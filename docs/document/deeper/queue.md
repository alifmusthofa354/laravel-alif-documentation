# **Queues (Antrian)**

## **Pendahuluan**

Dalam aplikasi web, beberapa tugas membutuhkan waktu lama, misalnya **parsing dan menyimpan file CSV** yang diunggah pengguna. Menjalankan tugas ini secara langsung saat permintaan web akan memperlambat halaman dan mengganggu pengalaman pengguna.

Laravel menyediakan sistem **Queues (Antrian)** yang memungkinkan pekerjaan dijalankan **di latar belakang**, sehingga aplikasi tetap responsif. Laravel mendukung berbagai **queue backend** seperti:

* Amazon SQS
* Redis
* Database relasional
* Beanstalkd

Pengaturan antrian Laravel berada di file **`config/queue.php`**.

---

## **1. Koneksi vs. Antrian**

Sebelum menggunakan Laravel Queues, pahami perbedaan:

* **Connection (Koneksi)**: Koneksi ke backend seperti Redis, SQS, Beanstalk.
* **Queue (Antrian)**: Setiap koneksi dapat memiliki banyak antrian untuk memisahkan prioritas atau jenis pekerjaan.

Contoh mengirim job ke antrian:

```php
use App\Jobs\ProcessPodcast;

// Antrian default
ProcessPodcast::dispatch();

// Antrian "emails"
ProcessPodcast::dispatch()->onQueue('emails');
```

Memproses antrian dengan prioritas:

```bash
php artisan queue:work --queue=high,default
```

---

## **2. Driver Queue dan Persyaratan**

### **2.1 Database**

Buat tabel jobs:

```bash
php artisan make:queue-table
php artisan migrate
```

### **2.2 Redis**

Konfigurasi Redis di `config/database.php`:

```php
'redis' => [
    'driver' => 'redis',
    'connection' => env('REDIS_QUEUE_CONNECTION', 'default'),
    'queue' => env('REDIS_QUEUE', 'default'),
    'retry_after' => 90,
    'block_for' => 5,
    'after_commit' => false,
],
```

> Catatan: `serializer` dan `compression` tidak didukung.

### **2.3 Driver Lain**

* Amazon SQS: `aws/aws-sdk-php`
* Beanstalkd: `pda/pheanstalk`
* Redis: `predis/predis` atau `phpredis`
* MongoDB: `mongodb/laravel-mongodb`

---

## **3. Membuat Job**

### **3.1 Membuat Kelas Job**

Semua job disimpan di **`app/Jobs`**. Contoh membuat job:

```bash
php artisan make:job ProcessPodcast
```

Job otomatis mengimplementasikan **`ShouldQueue`**, menandakan dijalankan secara asynchronous.

### **3.2 Struktur Kelas Job**

```php
<?php
namespace App\Jobs;

use App\Models\Podcast;
use App\Services\AudioProcessor;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessPodcast implements ShouldQueue
{
    use Queueable;

    public function __construct(public Podcast $podcast) {}

    public function handle(AudioProcessor $processor): void
    {
        // Proses podcast
    }
}
```

> **Catatan:** Model Eloquent otomatis diserialisasi saat dikirim ke antrian dan diambil kembali saat job dijalankan.

### **3.3 Dependency Injection**

```php
$this->app->bindMethod([ProcessPodcast::class, 'handle'], function (ProcessPodcast $job, $app) {
    return $job->handle($app->make(AudioProcessor::class));
});
```

> Data binary harus di-encode terlebih dahulu menggunakan `base64_encode()` agar dapat diserialisasi ke JSON.

### **3.4 Job dan Relasi Eloquent**

* Semua relasi yang dimuat ikut diserialisasi → payload bisa besar.
* Gunakan `$model->withoutRelations()` atau atribut `#[WithoutRelations]` untuk mencegah serialisasi relasi.

---

## **4. Job Unik**

Job unik memastikan hanya **satu instance job berada di antrian** sekaligus.

```php
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class UpdateSearchIndex implements ShouldQueue, ShouldBeUnique
{
    public $product;
    public $uniqueFor = 3600;

    public function uniqueId(): string
    {
        return $this->product->id;
    }
}
```

* Gunakan **`ShouldBeUniqueUntilProcessing`** untuk unlock sebelum diproses.
* Gunakan metode **`uniqueVia()`** untuk memilih cache driver.

---

## **5. Job Encrypted**

Untuk mengenkripsi job:

```php
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;

class UpdateSearchIndex implements ShouldQueue, ShouldBeEncrypted
{
    // ...
}
```

---

## **6. Middleware Job**

Middleware job memungkinkan logika tambahan sebelum atau sesudah job diproses.

### **6.1 Rate Limiting**

```php
Redis::throttle('key')->block(0)->allow(1)->every(5)->then(function () {
    // Handle job
}, function () {
    return $this->release(5);
});
```

Middleware terpisah:

```php
namespace App\Jobs\Middleware;

use Closure;
use Illuminate\Support\Facades\Redis;

class RateLimited
{
    public function handle(object $job, Closure $next): void
    {
        Redis::throttle('key')->block(0)->allow(1)->every(5)->then(function () use ($job, $next) {
            $next($job);
        }, function () use ($job) {
            $job->release(5);
        });
    }
}
```

### **6.2 Rate Limiting via `RateLimiter`**

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('backups', function ($job) {
    return $job->user->vipCustomer()
        ? Limit::none()
        : Limit::perHour(1)->by($job->user->id);
});
```

### **6.3 Prevent Overlapping**

```php
use Illuminate\Queue\Middleware\WithoutOverlapping;

public function middleware(): array
{
    return [new WithoutOverlapping($this->user->id)];
}
```

* Waktu lock: `expireAfter()`.
* Bisa berbagi key antar job: `shared()`.

### **6.4 Throttling Exceptions**

```php
use Illuminate\Queue\Middleware\ThrottlesExceptions;

public function middleware(): array
{
    return [new ThrottlesExceptions(10, 300)]; // 10 exception, 5 menit delay
}
```

### **6.5 Skip Jobs**

```php
use Illuminate\Queue\Middleware\Skip;

public function middleware(): array
{
    return [Skip::when($this->shouldSkip())];
}
```

* `Skip::when()` → hapus job jika kondisi true.
* `Skip::unless()` → hapus job jika kondisi false.

---

## **7. Dispatching Jobs**

### **7.1 Basic Dispatch**

```php
ProcessPodcast::dispatch($podcast);
```

* Conditional Dispatch:

```php
ProcessPodcast::dispatchIf($accountActive, $podcast);
ProcessPodcast::dispatchUnless($accountSuspended, $podcast);
```

### **7.2 Delayed Dispatch**

```php
ProcessPodcast::dispatch($podcast)->delay(now()->addMinutes(10));
ProcessPodcast::dispatch($podcast)->withoutDelay();
```

> Maximum delay SQS: 15 menit.

### **7.3 Dispatch After Response**

```php
SendNotification::dispatchAfterResponse();
dispatch(fn() => Mail::to($user)->send(new WelcomeMessage))->afterResponse();
```

### **7.4 Synchronous Dispatch**

```php
ProcessPodcast::dispatchSync($podcast);
```

---

## **8. Jobs & Database Transactions**

* Problem: Job dapat berjalan sebelum transaksi commit.
* Solusi:

```php
// Connection config
'redis' => [
    'driver' => 'redis',
    'after_commit' => true,
];

// Inline control
ProcessPodcast::dispatch($podcast)->afterCommit();
ProcessPodcast::dispatch($podcast)->beforeCommit();
```

---

## **9. Job Chaining**

```php
Bus::chain([
    new ProcessPodcast,
    new OptimizePodcast,
    new ReleasePodcast,
])->dispatch();
```

* Chain berhenti jika job gagal.
* Bisa menentukan queue/connection:

```php
->onConnection('redis')->onQueue('podcasts')
```

* Tambah job ke chain:

```php
$this->prependToChain(new TranscribePodcast);
$this->appendToChain(new TranscribePodcast);
```

* Handle failures:

```php
->catch(function (Throwable $e) { ... });
```

---

## **10. Queue Customization**

* Queue:

```php
ProcessPodcast::dispatch($podcast)->onQueue('processing');
```

* Connection:

```php
ProcessPodcast::dispatch($podcast)->onConnection('sqs');
```

* Chain queue & connection:

```php
ProcessPodcast::dispatch($podcast)->onConnection('sqs')->onQueue('processing');
```

---

## **11. Job Attempts dan Timeouts**

* Maximum attempts:

```php
public $tries = 5;
public function tries(): int { return 5; }
```

* Retry until:

```php
public function retryUntil(): DateTime { return now()->addMinutes(10); }
```

* Maximum exceptions:

```php
public $maxExceptions = 3;
```

* Timeout:

```php
public $timeout = 120;
public $failOnTimeout = true;
```

* Command-line:

```bash
php artisan queue:work --timeout=30 --tries=3
```

---

## **12. Amazon SQS FIFO Queues**

* Message group ID:

```php
->onGroup("customer-{$order->customer_id}");
```

* Deduplication ID:

```php
public function deduplicationId(): string { return "renewal-{$this->subscription->id}"; }
```

---

## **13. Error Handling**

* Release job:

```php
$this->release();
$this->release(10); // delay detik
```

* Fail job:

```php
$this->fail();
$this->fail($exception);
$this->fail('Custom message');
```

* Fail middleware:

```php
public function middleware(): array {
    return [new FailOnException([AuthorizationException::class])];
}
```

---

## **14. Job Batching**

* Trait `Batchable`:

```php
use Illuminate\Bus\Batchable;

class ImportCsv implements ShouldQueue {
    use Batchable, Queueable;
}
```

* Dispatch batch:

```php
$batch = Bus::batch([
    new ImportCsv(1, 100),
    new ImportCsv(101, 200),
])->then(fn(Batch $batch) => ...)
  ->catch(fn(Batch $batch, Throwable $e) => ...)
  ->dispatch();
```

* Nama batch:

```php
->name('Import CSV')
```

* Connection/Queue:

```php
->onConnection('redis')->onQueue('imports')
```

* Chains di batch:

```php
Bus::batch([
    [new Job1, new Job2],
    [new Job3, new Job4]
])->dispatch();
```

* Tambah job dinamis:

```php
$this->batch()->add(Collection::times(1000, fn() => new ImportContacts));
```

* Cancel batch:

```php
$this->batch()->cancel();
$this->middleware(): array { return [new SkipIfBatchCancelled]; }
```

* Retry batch gagal:

```bash
php artisan queue:retry-batch <batch-id>
```

* Prune batch:

```bash
php artisan queue:prune-batches --hours=48 --unfinished=72 --cancelled=72
```

* DynamoDB support untuk TTL pruning.

---

## **15. Queueing Closures**

```php
dispatch(fn() => $podcast->publish())->name('Publish Podcast')->catch(fn(Throwable $e) => ...);
```

---

## **16. Menjalankan Queue Workers**

* Start worker:

```bash
php artisan queue:work
php artisan queue:work redis --queue=emails
php artisan queue:work --once
php artisan queue:work --max-jobs=1000
php artisan queue:work --stop-when-empty
php artisan queue:work --max-time=3600
```

* Sleep duration:

```bash
php artisan queue:work --sleep=3
```

* Force processing maintenance mode:

```bash
php artisan queue:work --force
```

* Restart worker:

```bash
php artisan queue:restart
```

---

## **17. Job Expirations dan Retry Logic**

* `retry_after`: lama job sebelum di-retry.
* `--timeout`: memastikan worker membunuh job sebelum retry.
* Pastikan `--timeout` sedikit lebih pendek dari `retry_after` untuk menghindari duplikasi.

---

## **18. Menjaga Queue Worker Tetap Berjalan (Supervisor)**

### **18.1 Mengapa**

Worker dapat berhenti karena timeout atau `queue:restart`. Supervisor memastikan worker restart otomatis jika gagal.

### **18.2 Instalasi**

```bash
sudo apt-get install supervisor
```

### **18.3 Konfigurasi**

Buat `/etc/supervisor/conf.d/laravel-worker.conf`:

```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /home/forge/app.com/artisan queue:work sqs --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=forge
numprocs=8
redirect_stderr=true
stdout_logfile=/home/forge/app.com/worker.log
stopwaitsecs=3600
```

* **numprocs**: jumlah worker paralel.
* **stopwaitsecs**: lebih besar dari job terlama.

### **18.4 Menjalankan Supervisor**

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start "laravel-worker:*"
```

---

## **19. Menangani Failed Jobs**

### **19.1 Database Table**

```bash
php artisan make:queue-failed-table
php artisan migrate
```

### **19.2 Retry Jobs**

```bash
php artisan queue:work redis --tries=3 --backoff=3
```

* `$backoff`: jeda retry per-job.
* `backoff()` method bisa array untuk exponential backoff.

### **19.3 Handling Job Failures**

```php
public function failed(?Throwable $exception): void
{
    // Contoh: notif user
}
```

* `$exception` bisa:

  * `MaxAttemptsExceededException`
  * `TimeoutExceededException`

---

## **20. Mengelola Failed Jobs**

* List failed jobs:

```bash
php artisan queue:failed
```

* Retry failed jobs:

```bash
php artisan queue:retry <id>    # single
```


/multiple
php artisan queue\:retry all

````
* Delete failed jobs:
```bash
php artisan queue:forget <id>
php artisan queue:flush
php artisan queue:flush --hours=48
````

* Prune old failed jobs:

```bash
php artisan queue:prune-failed --hours=48
```

### **20.1 DynamoDB (Opsional)**

```bash
composer require aws/aws-sdk-php
```

Update `config/queue.php`:

```php
'failed' => [
    'driver' => env('QUEUE_FAILED_DRIVER', 'dynamodb'),
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    'table' => 'failed_jobs',
],
```

---

## **21. Mengabaikan Model yang Hilang**

```php
public $deleteWhenMissingModels = true;
```

> Mencegah `ModelNotFoundException` jika model dihapus saat job berada di antrian.

---

## **22. Monitoring Queues**

* Command:

```bash
php artisan queue:monitor redis:default,redis:deployments --max=100
```

* Bisa mendengarkan event `QueueBusy` untuk notifikasi.

---

## **23. Membersihkan Jobs dari Queue**

* Clear default queue:

```bash
php artisan queue:clear
```

* Clear connection/queue tertentu:

```bash
php artisan queue:clear redis --queue=emails
```

* Laravel Horizon: `horizon:clear`

---

## **24. Testing Jobs**

### **24.1 Faking Queues**

```php
Queue::fake();
Queue::assertPushed(JobClass::class, 2);
Queue::assertNothingPushed();
```

### **24.2 Partial Fakes**

```php
Queue::fake([ShipOrder::class]);
Queue::fake()->except([ShipOrder::class]);
```

### **24.3 Job Chains**

```php
Bus::fake();
Bus::assertChained([ShipOrder::class, RecordShipment::class, UpdateInventory::class]);
Bus::assertDispatchedWithoutChain(ShipOrder::class);
```

### **24.4 Job Batches**

```php
Bus::assertBatched(fn(PendingBatch $batch) => $batch->name == 'Import CSV' && $batch->jobs->count() === 10);
Bus::assertBatchCount(3);
Bus::assertNothingBatched();
```

### **24.5 Job Queue Interactions**

```php
$job = (new ProcessPodcast)->withFakeQueueInteractions();
$job->handle();
$job->assertReleased(delay: 30);
$job->assertDeleted();
$job->assertFailedWith(CorruptedAudioException::class);
```

---

## **25. Job Events**

* Before/After job:

```php
Queue::before(fn(JobProcessing $event) => ...);
Queue::after(fn(JobProcessed $event) => ...);
```

* Pre-job hook (looping):

```php
Queue::looping(function () {
    while (DB::transactionLevel() > 0) DB::rollBack();
});
```

---

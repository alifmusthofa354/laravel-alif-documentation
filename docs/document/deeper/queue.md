# 🚦 Queue di Laravel: Panduan Lengkap dari Guru Kesayanganmu (Edisi Antrian Super Cepat & Andal)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel yang super seru. Hari ini kita akan membahas salah satu fitur paling penting dalam dunia aplikasi web modern - **Queue (Antrian)**. Bayangkan kamu punya tugas berat seperti mengolah file besar, mengirim email massal, atau memproses pembayaran - semua ini bisa membuat aplikasimu menjadi lamban kalau dikerjakan langsung. Tapi tenang, dengan Queue, kamu bisa membuat pekerjaan berat itu dikerjakan di belakang layar sambil pengguna tetap menikmati aplikasi yang cepat dan responsif! 🚀

Di edisi ini, kita akan kupas tuntas **semua detail** tentang Queue, tapi setiap topik akan Guru ajarkan dengan sabar. Siap? Ayo kita mulai petualangan performa ini!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Queue Itu Sebenarnya?

**Analogi:** Bayangkan kamu seorang manajer restoran yang sibuk. Ada pesanan yang bisa disajikan langsung (seperti kopi), tapi ada juga pesanan yang membutuhkan waktu lama untuk diproses (seperti memasak steak). Kalau kamu proses semuanya secara berurutan, pelanggan yang memesan kopi harus menunggu lama! Solusinya? Kamu buat sistem antrian: pesanan kopi tetap bisa dilayani cepat, sementara pesanan steak masuk ke antrian khusus yang diproses oleh koki saat senggang.

**Mengapa ini penting?** Karena dalam dunia aplikasi web, seringkali kita punya tugas-tugas berat yang bisa memperlambat respon ke pengguna. Queue memungkinkan kita menjalankan tugas-tugas ini di latar belakang tanpa mengganggu pengalaman pengguna.

**Bagaimana cara kerjanya?** Laravel dengan sistem Queues-nya akan:
1.  **Mencatat tugas berat** yang perlu dilakukan ke dalam antrian.
2.  **Mengerjakan tugas tersebut secara asynchronous** di latar belakang.
3.  **Menjaga aplikasi tetap responsif** karena tidak menunggu tugas selesai.

Jadi, alur kerja (workflow) aplikasimu menjadi sangat efisien:

`➡️ Tugas Berat Masuk -> 🚦 Queue (Antrian) -> 🧑‍🔧 Worker (Pekerja Latar Belakang) -> ✅ Tugas Selesai Tanpa Mengganggu Pengguna`

Tanpa Queue, semua tugas harus dikerjakan langsung, dan itu adalah mimpi buruk untuk pengalaman pengguna. 😵

### 2. ✍️ Resep Pertamamu: Membuat Queue dari Nol

Ini adalah fondasi paling dasar. Mari kita buat queue pertamamu dari nol, langkah demi langkah.

#### Langkah 1️⃣: Siapkan Koneksi Antrian di Konfigurasi (Config)
**Mengapa?** Setiap antrian butuh koneksi ke backend tempat job disimpan (Redis, Database, SQS, dll).

**Bagaimana?** Atur file `.env` dan `config/queue.php`:

**.env:**
```env
QUEUE_CONNECTION=database
# Atau bisa juga redis
# QUEUE_CONNECTION=redis
```

**config/queue.php:**
```php
<?php

return [
    'default' => env('QUEUE_CONNECTION', 'sync'), // Default sync artinya langsung dijalankan (tidak antri)

    'connections' => [
        'database' => [
            'driver' => 'database',
            'connection' => env('DB_QUEUE_CONNECTION'),
            'table' => 'jobs',
            'queue' => 'default',
            'retry_after' => 90,
            'after_commit' => false,
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => env('REDIS_QUEUE_CONNECTION', 'default'),
            'queue' => env('REDIS_QUEUE', 'default'),
            'retry_after' => 90,
            'block_for' => null,
            'after_commit' => false,
        ],
    ],

    'failed' => [
        'driver' => env('QUEUE_FAILED_DRIVER', 'database-uuids'),
        'database' => env('DB_CONNECTION', 'mysql'),
        'table' => 'failed_jobs',
    ],
];
```

Buat tabel jobs:
```bash
php artisan make:queue-table
php artisan migrate
```

#### Langkah 2️⃣: Panggil Sang Pekerja Latar Belakang (Job)
**Mengapa?** Kita butuh "pekerja" yang bisa menjalankan tugas di latar belakang.

**Bagaimana?** Buat Job dengan artisan:
```bash
php artisan make:job ProcessPodcast
```

#### Langkah 3️⃣: Beri Naskah pada Pekerja (Isi Job)
**Mengapa?** Pekerja yang baru dibuat masih kosong. Kita perlu memberinya tugas yang harus dikerjakan.

**Bagaimana?** Buka `app/Jobs/ProcessPodcast.php` dan isi kontennya:
```php
<?php

namespace App\Jobs;

use App\Models\Podcast;
use App\Services\AudioProcessor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessPodcast implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3; // Maksimum percobaan
    public $timeout = 120; // Timeout dalam detik

    protected $podcast;

    public function __construct(Podcast $podcast)
    {
        $this->podcast = $podcast;
    }

    public function handle(AudioProcessor $processor): void
    {
        // Proses podcast di sini
        $processor->process($this->podcast);
        
        // Misalnya: encode ke berbagai format, upload ke storage, dll
        $this->podcast->update(['processed' => true]);
    }

    public function failed(\Throwable $exception): void
    {
        // Tangani jika job gagal
        \Log::error('Processing podcast failed: ' . $exception->getMessage());
    }
}
```

#### Langkah 4️⃣: Jalankan Worker untuk Menangani Antrian
**Mengapa?** Tanpa worker, job tidak akan pernah dikerjakan.

**Bagaimana?** Jalankan perintah artisan di terminal:
```bash
php artisan queue:work
```

Selesai! 🎉 Sekarang, kamu bisa mengirim job ke queue ini:
```php
use App\Jobs\ProcessPodcast;
use App\Models\Podcast as PodcastModel;

// Kirim job ke queue
$podcast = PodcastModel::find(1);
ProcessPodcast::dispatch($podcast); // Ini akan masuk ke antrian dan diproses nanti
```

### 3. ⚡ Perbedaan Queue vs Tugas Biasa (Synchronous)

**Analogi:** Bayangkan kamu memesan makanan di restoran. 
- **Tugas biasa (sync)**: Kamu menunggu di tempat, melihat makanan dimasak, lalu baru bisa makan.
- **Queue (async)**: Kamu memesan, dapat nomor antrian, lalu bisa ngobrol dengan teman, nanti dipanggil saat makanan siap.

**Mengapa ini penting?** Karena Queue membuat aplikasi lebih responsif dan dapat menangani beban kerja yang berat tanpa mengganggu pengalaman pengguna.

---

## Bagian 2: Driver Queue - Pilihan Mesin Antrianmu 🏗️

### 4. 📦 Apa Itu Driver Queue?

**Analogi:** Bayangkan kamu punya beberapa tempat untuk menyimpan antrian tugas, masing-masing dengan kelebihan: ada yang cepat tapi perlu biaya, ada yang murah tapi agak lambat. **Driver Queue itu seperti pilihan tempat penyimpanan antrian-mu di Laravel**.

**Mengapa ini keren?** Karena kamu bisa memilih backend yang paling cocok dengan kebutuhan dan infrastruktur aplikasimu.

**Bagaimana?** Laravel menyediakan berbagai driver: `database`, `redis`, `sqs`, `beanstalkd`, dll.

### 5. 🗃️ Driver Database - Tempat Penyimpanan Sederhana

**Analogi:** Ini seperti menyimpan daftar tugas di buku catatan biasa. Relatif lambat tapi sangat sederhana dan tidak butuh layanan eksternal.

**Mengapa ini ada?** Karena ini adalah pilihan termudah untuk mulai menggunakan queue, terutama di lingkungan development.

**Bagaimana?** Konfigurasi di `.env`:
```env
QUEUE_CONNECTION=database
```

**Contoh Lengkap Database Queue:**

1. **Buat tabel jobs:**
```bash
composer require doctrine/dbal
php artisan make:queue-table
php artisan migrate

# Jika menggunakan failed jobs
php artisan make:queue-failed-table
php artisan migrate
```

2. **Job dengan Database Queue:**
```php
<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class ProcessCsvImport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 300; // 5 menit

    protected $filePath;

    public function __construct($filePath)
    {
        $this->filePath = $filePath;
    }

    public function handle()
    {
        // Proses file CSV di sini
        $data = \Excel::toArray([], $this->filePath);
        
        foreach ($data as $row) {
            // Proses setiap baris
            \DB::table('imported_data')->insert($row);
        }
    }
}
```

### 6. 🔥 Driver Redis - Tempat Penyimpanan Super Cepat

**Analogi:** Ini seperti menyimpan antrian di papan tulis yang bisa diakses sangat cepat oleh semua pekerja. Jauh lebih cepat dari buku catatan biasa.

**Mengapa ini keren?** Karena Redis jauh lebih cepat dan efisien untuk queue daripada database biasa.

**Bagaimana?** 
1. Install Redis dan package pendukung:
```bash
# Install Redis di sistem kamu (Linux/Ubuntu)
sudo apt-get install redis-server

# Install PHP package
composer require predis/predis
# Atau jika kamu sudah punya PHP Redis extension
# composer require phpredis/phpredis
```

2. Konfigurasi:
```env
QUEUE_CONNECTION=redis
```

```php
// config/queue.php
'redis' => [
    'driver' => 'redis',
    'connection' => env('REDIS_QUEUE_CONNECTION', 'default'),
    'queue' => env('REDIS_QUEUE', 'default'),
    'retry_after' => 90,
    'block_for' => 5,
    'after_commit' => false,
],
```

### 7. ☁️ Driver Amazon SQS - Layanan Cloud

**Analogi:** Ini seperti menyewa gudang antrian profesional di awan. Sangat skalabel dan andal, tapi ada biayanya.

**Mengapa ini ada?** Karena SQS sangat cocok untuk aplikasi berskala besar yang perlu menangani jutaan job per hari.

**Bagaimana?** 
1. Install AWS package:
```bash
composer require aws/aws-sdk-php
```

2. Konfigurasi:
```env
QUEUE_CONNECTION=sqs
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_DEFAULT_REGION=us-east-1
SQS_PREFIX=https://sqs.us-east-1.amazonaws.com/your-account-id
SQS_QUEUE=your-queue-name
```

```php
// config/queue.php
'sqs' => [
    'driver' => 'sqs',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'prefix' => env('SQS_PREFIX', 'https://sqs.us-east-1.amazonaws.com/your-account-id'),
    'queue' => env('SQS_QUEUE', 'default'),
    'suffix' => env('SQS_SUFFIX'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    'after_commit' => false,
],
```

### 8. 🌋 Driver Beanstalkd - Pilihan Alternatif

**Analogi:** Ini seperti tempat penyimpanan antrian yang didesain khusus untuk queue, sangat efisien dan handal.

**Mengapa ini ada?** Karena Beanstalkd adalah system queue yang ringan dan cepat, cocok untuk banyak skenario.

**Bagaimana?** 
1. Install Beanstalkd dan package pendukung:
```bash
# Install Beanstalkd di sistem kamu
sudo apt-get install beanstalkd

# Install PHP package
composer require pda/pheanstalk
```

2. Konfigurasi:
```env
QUEUE_CONNECTION=beanstalkd
```

```php
// config/queue.php
'beanstalkd' => [
    'driver' => 'beanstalkd',
    'host' => env('BEANSTALKD_HOST', 'localhost'),
    'queue' => env('BEANSTALKD_QUEUE', 'default'),
    'retry_after' => 90,
    'block_for' => 0,
    'after_commit' => false,
],
```

---

## Bagian 3: Membuat dan Mengelola Job yang Kuat 🛠️

### 9. 👨‍👩‍👧 Membuat Job dengan Berbagai Fitur

**Analogi:** Seperti menulis buku resep yang tidak hanya berisi instruksi dasar, tapi juga catatan penting, bahan cadangan, dan langkah-langkah jika terjadi kesalahan.

**Mengapa?** Karena job modern sering membutuhkan logika kompleks, penanganan kesalahan, dan konfigurasi khusus.

**Bagaimana?** Kita bisa menambahkan berbagai fitur ke dalam Job:

#### **9.1 Struktur Lengkap Job dengan Semua Fitur**
```php
<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Support\Facades\Log;

class ProcessOrderPayment implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // Konfigurasi job
    public $tries = 5;
    public $timeout = 180;
    public $maxExceptions = 2;
    public $deleteWhenMissingModels = true;
    
    protected $order;
    protected $paymentData;

    public function __construct(Order $order, array $paymentData)
    {
        $this->order = $order;
        $this->paymentData = $paymentData;
    }

    public function handle(): void
    {
        // Proses pembayaran
        $paymentService = new \App\Services\PaymentService();
        
        if ($paymentService->process($this->order, $this->paymentData)) {
            $this->order->update(['status' => 'paid']);
            Log::info("Payment processed successfully for order: {$this->order->id}");
        } else {
            throw new \Exception('Payment processing failed');
        }
    }

    public function failed(\Throwable $exception): void
    {
        // Tangani jika job gagal
        Log::error("Payment processing failed for order {$this->order->id}: " . $exception->getMessage());
        
        // Kirim notifikasi ke admin
        \Notification::send(
            User::where('role', 'admin')->get(),
            new \App\Notifications\PaymentFailedNotification($this->order, $exception)
        );
    }

    public function middleware(): array
    {
        // Gunakan middleware untuk mencegah overlapping
        return [new WithoutOverlapping("payment-{$this->order->id}")];
    }

    public function retryUntil(): ?\DateTime
    {
        // Ulangi selama 1 jam sejak pertama kali diqueue
        return now()->addHour();
    }
}
```

#### **9.2 Serialisasi dan Eloquent Models**
Saat kamu mengirim model Eloquent ke queue, Laravel akan otomatis menangani serialisasi dan deserialisasi:

```php
// Saat mengirim
ProcessPodcast::dispatch($podcast); // $podcast adalah model Eloquent

// Di dalam job
public function handle()
{
    // $this->podcast sudah menjadi model Eloquent yang segar dari database
    $this->podcast->title; // Akses properti model
}
```

**Perhatian:** Jika kamu tidak ingin relasi dimuat ulang (untuk mengurangi ukuran payload):
```php
// Di controller
ProcessPodcast::dispatch($podcast->withoutRelations());

// Atau gunakan atribut #[WithoutRelations]
use Illuminate\Queue\WithoutRelations;

class ProcessPodcast implements ShouldQueue
{
    use Queueable;

    public function __construct(#[WithoutRelations] public Podcast $podcast) {}
}
```

### 10. 🔒 Job Unik - Mencegah Duplikasi

**Analogi:** Ini seperti membuat nomor antrian unik, sehingga tidak ada dua orang dengan nomor yang sama dalam antrian.

**Mengapa?** Karena terkadang kamu tidak ingin job yang sama berada di antrian secara bersamaan.

**Bagaimana?** Gunakan interface `ShouldBeUnique`:

```php
<?php

namespace App\Jobs;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateSearchIndex implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $product;
    
    // Waktu lock unik (dalam detik)
    public $uniqueFor = 3600; // 1 jam

    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function uniqueId(): string
    {
        // Kunci unik berdasarkan ID produk
        return $this->product->id;
    }

    public function handle(): void
    {
        // Update indeks pencarian
        \SearchService::updateProduct($this->product);
    }
}
```

**Jenis-jenis Unique Jobs:**
```php
// Unik selama di antrian dan diproses
use Illuminate\Contracts\Queue\ShouldBeUnique;

// Unik hanya selama di antrian (unlock saat mulai diproses)
use Illuminate\Contracts\Queue\ShouldBeUniqueUntilProcessing;
```

### 11. 🔐 Job Encrypted - Mencegah Job Dibaca Orang Lain

**Analogi:** Ini seperti menyimpan surat penting dalam amplop yang terenkripsi, sehingga hanya orang yang berwenang yang bisa membacanya.

**Mengapa?** Karena beberapa job mungkin membawa data sensitif yang sebaiknya tidak bisa dibaca secara langsung dari queue.

**Bagaimana?** Gunakan interface `ShouldBeEncrypted`:

```php
<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessSensitiveData implements ShouldQueue, ShouldBeEncrypted
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $sensitiveData;

    public function __construct(array $sensitiveData)
    {
        $this->sensitiveData = $sensitiveData;
    }

    public function handle(): void
    {
        // Proses data sensitif di sini
        // Job akan dienkripsi saat disimpan ke queue
    }
}
```

### 12. 🧩 Middleware Job - Logika Tambahan di Sekitar Job

**Analogi:** Ini seperti memiliki satpam atau asisten yang mengecek job sebelum dan sesudah dikerjakan.

**Mengapa?** Karena kamu sering butuh logika tambahan seperti rate limiting, mencegah overlapping, atau penanganan error khusus.

#### **12.1 Rate Limiting untuk Job**
```php
<?php

namespace App\Jobs\Middleware;

use Closure;
use Illuminate\Support\Facades\Redis;

class RateLimited
{
    public function handle($job, Closure $next)
    {
        return Redis::throttle('job-rate-limit')
            ->block(0)
            ->allow(1)
            ->every(5)
            ->then(function () use ($job, $next) {
                $next($job);
            }, function () use ($job) {
                $job->release(5); // Tunda job selama 5 detik
            });
    }
}

// Di job:
public function middleware(): array
{
    return [new RateLimited];
}
```

#### **12.2 Mencegah Overlapping**
```php
use Illuminate\Queue\Middleware\WithoutOverlapping;

public function middleware(): array
{
    return [
        (new WithoutOverlapping($this->user->id))
            ->expireAfter(3600) // 1 jam
    ];
}
```

#### **12.3 Throttling Exceptions**
```php
use Illuminate\Queue\Middleware\ThrottlesExceptions;

public function middleware(): array
{
    // Maksimal 5 exception dalam 10 menit
    return [new ThrottlesExceptions(5, 600)];
}
```

#### **12.4 Skip Job Kondisional**
```php
use Illuminate\Queue\Middleware\Skip;

public function middleware(): array
{
    return [
        Skip::when($this->shouldSkip()),
        Skip::unless($this->shouldNotSkip()),
    ];
}

private function shouldSkip(): bool
{
    return $this->user->isSuspended();
}
```

---

## Bagian 4: Menjalankan dan Mengelola Job 🏃‍♂️

### 13. 🚀 Mengirim Job ke Antrian

**Analogi:** Seperti menulis tugas di slip kertas dan memasukkannya ke dalam kotak antrian agar dikerjakan nanti.

**Mengapa?** Karena kamu perlu memberi tahu sistem queue tentang tugas yang perlu dilakukan di latar belakang.

**Bagaimana?** Berbagai cara mengirim job:

#### **13.1 Pengiriman Dasar**
```php
use App\Jobs\ProcessPodcast;
use App\Models\Podcast as PodcastModel;

// Kirim job ke queue default
ProcessPodcast::dispatch($podcast);

// Kirim dengan kondisi
ProcessPodcast::dispatchIf($accountActive, $podcast);
ProcessPodcast::dispatchUnless($accountSuspended, $podcast);

// Kirim ke queue tertentu
ProcessPodcast::dispatch($podcast)->onQueue('processing');

// Kirim ke connection tertentu
ProcessPodcast::dispatch($podcast)->onConnection('redis');

// Kombinasi connection dan queue
ProcessPodcast::dispatch($podcast)->onConnection('redis')->onQueue('podcasts');
```

#### **13.2 Pengiriman dengan Delay**
```php
use Carbon\Carbon;

// Tunda eksekusi selama 10 menit
ProcessPodcast::dispatch($podcast)->delay(now()->addMinutes(10));

// Tunda 1 jam
ProcessPodcast::dispatch($podcast)->delay(Carbon::now()->addHour());

// Tidak pakai delay (langsung dijalankan jika worker tersedia)
ProcessPodcast::dispatch($podcast)->withoutDelay();
```

#### **13.3 Pengiriman Setelah Request Selesai**
```php
use App\Jobs\SendNotification;

// Kirim job setelah response HTTP dikirim ke pengguna
SendNotification::dispatchAfterResponse($user);

// Atau dengan closure
dispatch(fn() => Mail::to($user)->send(new WelcomeMessage($user)))->afterResponse();
```

#### **13.4 Pengiriman Synchronous**
```php
// Jalankan langsung (tanpa antrian)
ProcessPodcast::dispatchSync($podcast);

// Berguna untuk testing atau lingkungan tertentu
if (app()->environment('local')) {
    ProcessPodcast::dispatchSync($podcast);
} else {
    ProcessPodcast::dispatch($podcast);
}
```

### 14. 🔄 Chain Job - Rangkaian Tugas yang Berurutan

**Analogi:** Seperti proses perakitan mobil: pertama menyiapkan rangka, lalu memasang mesin, lalu memasang ban. Setiap langkah harus selesai sebelum ke langkah berikutnya.

**Mengapa?** Karena seringkali tugas harus dijalankan dalam urutan tertentu.

**Bagaimana?** Gunakan Bus::chain:

```php
use Illuminate\Bus\Batch;
use Illuminate\Support\Facades\Bus;
use App\Jobs\ProcessPodcast;
use App\Jobs\OptimizePodcast;
use App\Jobs\ReleasePodcast;

// Buat rangkaian job
Bus::chain([
    new ProcessPodcast($podcast),
    new OptimizePodcast($podcast),
    new ReleasePodcast($podcast),
])->dispatch();

// Atur connection dan queue untuk seluruh chain
Bus::chain([
    new ProcessPodcast($podcast),
    new OptimizePodcast($podcast),
])->onConnection('redis')->onQueue('podcasts')->dispatch();

// Tangani error di chain
Bus::chain([
    new ProcessPodcast($podcast),
    new OptimizePodcast($podcast),
])->catch(function (\Throwable $e) {
    // Tangani jika salah satu job dalam chain gagal
    \Log::error('Chain failed: ' . $e->getMessage());
})->dispatch();
```

### 15. 📦 Job Batching - Pengelompokan Tugas dalam Jumlah Besar

**Analogi:** Seperti memproses 1000 file CSV sekaligus, tapi tetap bisa memantau kemajuan secara keseluruhan dan mengetahui kapan semua selesai.

**Mengapa?** Karena untuk tugas dalam jumlah besar, kamu butuh cara untuk mengelola dan memantau secara bersamaan.

**Bagaimana?** Gunakan fitur batching:

```php
<?php

namespace App\Jobs;

use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ImportCsvChunk implements ShouldQueue
{
    use Batchable, Queueable;

    protected $startRow;
    protected $endRow;

    public function __construct($startRow, $endRow)
    {
        $this->startRow = $startRow;
        $this->endRow = $endRow;
    }

    public function handle()
    {
        // Proses bagian dari file CSV
        for ($i = $this->startRow; $i <= $this->endRow; $i++) {
            // Proses baris ke-i
            $this->processRow($i);
        }
    }

    private function processRow($rowNumber)
    {
        // Logika untuk memproses satu baris
    }
}

// Di controller
use Illuminate\Bus\Batch;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;

// Buat batch dengan banyak job
$batch = Bus::batch([
    new ImportCsvChunk(1, 100),
    new ImportCsvChunk(101, 200),
    new ImportCsvChunk(201, 300),
    // ... dan seterusnya
])
->name('Import CSV File')
->finally(function (Batch $batch) {
    // Dijalankan setelah semua job selesai (success atau failed)
    if ($batch->hasFailures()) {
        \Log::error('Batch import failed: ' . $batch->id);
    } else {
        \Log::info('Batch import completed: ' . $batch->id);
    }
})
->onConnection('redis')
->onQueue('imports')
->dispatch();

// Cek progress
echo "Progress: {$batch->progress()}% ({$batch->processed()} of {$batch->totalJobs()} jobs)";
```

### 16. 🔄 Queue Connection dan Antrian yang Berbeda

**Analogi:** Seperti punya beberapa meja kerja berbeda untuk jenis pekerjaan yang berbeda: meja A untuk tugas penting, meja B untuk tugas biasa, meja C untuk tugas besar.

**Mengapa?** Karena kamu bisa mengatur prioritas dan jenis tugas yang berbeda.

**Bagaimana?** 

#### **16.1 Menentukan Queue Spesifik**
```php
// Kirim ke antrian "emails" 
SendEmailNotification::dispatch($user)->onQueue('emails');

// Kirim ke antrian "heavy" untuk job berat
ProcessVideo::dispatch($video)->onQueue('heavy');

// Kirim ke connection tertentu
ProcessPayment::dispatch($order)->onConnection('redis');
```

#### **16.2 Menjalankan Worker untuk Queue Tertentu**
```bash
# Hanya proses antrian dengan prioritas tinggi dulu
php artisan queue:work --queue=high,default

# Proses antrian email saja
php artisan queue:work --queue=emails

# Proses berbagai connection dan queue
php artisan queue:work redis database --queue=high,default,emails
```

---

## Bagian 5: Penanganan Error dan Monitoring 🔧

### 17. 🚨 Penanganan Error dan Retry Logic

**Analogi:** Seperti memiliki sistem backup yang otomatis mencoba ulang jika terjadi kegagalan, dan memberikan laporan jika tetap gagal setelah beberapa kali percobaan.

**Mengapa?** Karena dalam dunia nyata, error bisa terjadi dan kamu perlu sistem yang bisa menanganinya dengan elegan.

**Bagaimana?** Laravel menyediakan berbagai cara untuk menangani error:

#### **17.1 Konfigurasi Retry dan Timeout**
```php
<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessPaymentWithRetry implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // Maksimal percobaan
    public $tries = 5;
    
    // Timeout dalam detik
    public $timeout = 120;
    
    // Maksimal exception sebelum fail
    public $maxExceptions = 2;
    
    // Tambahkan backoff (delay eksponensial antar retry)
    public $backoff = [3, 5, 10, 15, 30]; // Detik delay antar retry

    public function handle(\App\Services\PaymentService $paymentService)
    {
        $paymentService->process($this->order);
    }

    public function retryUntil(): ?\DateTime
    {
        // Ulangi hingga 1 jam dari waktu pertama kali diantrikan
        return now()->addHour();
    }

    public function failed(\Throwable $exception): void
    {
        // Tangani jika job gagal setelah semua retry
        \Log::error('Payment processing failed after all retries: ' . $exception->getMessage());
        
        // Kirim notifikasi ke pengguna
        $this->order->user->notify(new \App\Notifications\PaymentFailed($this->order));
    }
}
```

#### **17.2 Penanganan Error dalam Runtime**
```php
public function handle()
{
    try {
        // Proses utama
        $this->processPayment();
    } catch (\Exception $e) {
        // Jika error tertentu, langsung fail
        if ($e instanceof \App\Exceptions\InvalidPaymentException) {
            $this->fail($e);
        }
        
        // Atau tunda job untuk nanti
        $this->release(30); // Tunda 30 detik
    }
}

// Atau gunakan middleware fail exception
use Illuminate\Queue\Middleware\WithoutOverlapping;

public function middleware(): array
{
    return [
        new \Illuminate\Queue\Middleware\FailOnException([
            \App\Exceptions\AuthorizationException::class
        ])
    ];
}
```

### 18. 📊 Monitoring dan Menjalankan Worker

**Analogi:** Seperti memiliki ruang kontrol yang memantau semua aktivitas antrian dan bisa menghentikan/memulai pekerja jika perlu.

**Mengapa?** Karena kamu perlu memastikan worker tetap berjalan dan bisa memantau kinerja sistem queue.

**Bagaimana?** 

#### **18.1 Menjalankan Queue Worker**
```bash
# Jalankan worker default
php artisan queue:work

# Jalankan worker untuk connection tertentu
php artisan queue:work redis

# Jalankan untuk antrian tertentu
php artisan queue:work --queue=emails,default

# Proses hanya satu job lalu berhenti
php artisan queue:work --once

# Proses maksimal 1000 job lalu restart
php artisan queue:work --max-jobs=1000

# Proses hingga antrian kosong
php artisan queue:work --stop-when-empty

# Hanya untuk maintenance mode
php artisan queue:work --force

# Tambahkan timeout dan retry
php artisan queue:work --timeout=60 --tries=3 --sleep=5
```

#### **18.2 Mengatur Sleep dan Delay**
```bash
# Waktu delay saat tidak ada job (dalam detik)
php artisan queue:work --sleep=3

# Waktu delay saat ada job failed
php artisan queue:work --backoff=5
```

#### **18.3 Restart Worker**
```bash
# Restart semua worker (akan selesai setelah job selesai)
php artisan queue:restart
```

#### **18.4 Monitoring Queue**
```bash
# Monitor jumlah job di queue
php artisan queue:monitor redis:default,redis:emails --max=100

# Akan memicu event QueueBusy jika melebihi batas
// Di service provider
Queue::looping(function () {
    // Aksi saat worker looping
    if (app()->isDownForMaintenance()) {
        sleep(10); // Tunggu 10 detik jika dalam maintenance
    }
});
```

### 19. 🧪 Testing Queue

**Analogi:** Seperti mencoba sistem antrian di laboratorium terlebih dahulu sebelum digunakan di dunia nyata.

**Mengapa?** Karena kamu harus yakin bahwa job akan dikirim dan diproses sesuai harapan.

**Bagaimana?** Laravel menyediakan berbagai metode untuk testing queue:

#### **19.1 Fake Queue untuk Testing**
```php
<?php

namespace Tests\Unit;

use App\Jobs\ProcessPodcast;
use App\Models\Podcast as PodcastModel;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class ProcessPodcastTest extends TestCase
{
    /** @test */
    public function it_processes_podcast_via_queue()
    {
        Queue::fake();

        $podcast = PodcastModel::factory()->create();

        ProcessPodcast::dispatch($podcast);

        // Cek apakah job dikirim ke queue
        Queue::assertPushed(ProcessPodcast::class);
        
        // Cek apakah job dikirim dengan parameter yang benar
        Queue::assertPushed(ProcessPodcast::class, function ($job) use ($podcast) {
            return $job->podcast->id === $podcast->id;
        });
        
        // Cek jumlah job yang dikirim
        Queue::assertPushed(ProcessPodcast::class, 1);
    }

    /** @test */
    public function it_does_not_send_queue_jobs_during_testing_by_default()
    {
        Queue::fake();

        // Job tidak benar-benar dijalankan
        ProcessPodcast::dispatch(PodcastModel::factory()->create());

        Queue::assertNothingPushed();
    }
}
```

#### **19.2 Testing Job Batching**
```php
<?php

namespace Tests\Unit;

use Illuminate\Bus\PendingBatch;
use Illuminate\Support\Facades\Bus;
use Tests\TestCase;

class BatchJobTest extends TestCase
{
    /** @test */
    public function it_processes_batch_of_jobs()
    {
        Bus::fake();

        Bus::batch([
            new \App\Jobs\ImportCsvChunk(1, 100),
            new \App\Jobs\ImportCsvChunk(101, 200),
        ])->name('CSV Import')->dispatch();

        Bus::assertBatched(function (PendingBatch $batch) {
            return $batch->name === 'CSV Import' && 
                   $batch->jobs->count() === 2;
        });
    }
}
```

#### **19.3 Testing Chain Jobs**
```php
<?php

namespace Tests\Unit;

use Illuminate\Support\Facades\Bus;
use Tests\TestCase;

class ChainJobTest extends TestCase
{
    /** @test */
    public function it_creates_job_chain()
    {
        Bus::fake();

        Bus::chain([
            new \App\Jobs\ProcessPodcast,
            new \App\Jobs\OptimizePodcast,
            new \App\Jobs\ReleasePodcast,
        ])->dispatch();

        Bus::assertChained([
            \App\Jobs\ProcessPodcast::class,
            \App\Jobs\OptimizePodcast::class,
            \App\Jobs\ReleasePodcast::class,
        ]);
    }
}
```

### 20. 🚨 Failed Jobs - Menangani Job yang Gagal

**Analogi:** Seperti memiliki kotak khusus untuk menyimpan slip tugas yang tidak bisa diselesaikan, agar bisa diinspeksi dan ditindaklanjuti nanti.

**Mengapa?** Karena kamu perlu tahu job mana yang gagal dan bisa menanganinya secara manual atau otomatis.

**Bagaima?** Laravel menyediakan sistem untuk mencatat dan menangani failed jobs:

#### **20.1 Setup Tabel Failed Jobs**
```bash
php artisan make:queue-failed-table
php artisan migrate
```

#### **20.2 Melihat dan Mengelola Failed Jobs**
```bash
# Lihat semua failed jobs
php artisan queue:failed

# Retry job tertentu
php artisan queue:retry 5

# Retry semua failed jobs
php artisan queue:retry all

# Hapus failed job tertentu
php artisan queue:forget 5

# Hapus semua failed jobs
php artisan queue:flush

# Hapus failed jobs lebih dari 24 jam
php artisan queue:flush --hours=24

# Bersihkan failed jobs lama (prune)
php artisan queue:prune-failed --hours=48
```

#### **20.3 Retry Batch Failed Jobs**
```bash
# Retry semua job dalam batch yang gagal
php artisan queue:retry-batch batch-id-here
```

### 21. 🔁 Job dan Database Transactions

**Analogi:** Seperti memastikan bahwa slip tugas hanya dimasukkan ke antrian setelah semua langkah dalam transaksi selesai dengan sukses.

**Mengapa?** Karena jika job dikirim sebelum transaksi commit, bisa terjadi inkonsistensi data.

**Bagaimana?** Gunakan pengaturan `after_commit`:

#### **21.1 Konfigurasi Connection**
```php
// config/queue.php
'redis' => [
    'driver' => 'redis',
    'connection' => env('REDIS_QUEUE_CONNECTION', 'default'),
    'queue' => env('REDIS_QUEUE', 'default'),
    'retry_after' => 90,
    'block_for' => 5,
    'after_commit' => true,  // Kirim job hanya setelah transaksi selesai
],
```

#### **21.2 Pengaturan Inline**
```php
// Kirim job hanya setelah transaksi commit
ProcessPodcast::dispatch($podcast)->afterCommit();

// Kirim job sebelum transaksi commit (default)
ProcessPodcast::dispatch($podcast)->beforeCommit();
```

**Contoh dengan Database Transaction:**
```php
use Illuminate\Support\Facades\DB;

DB::transaction(function () use ($podcast) {
    // Simpan data podcast
    $podcast->save();
    
    // Kirim job untuk diproses nanti
    // Dengan after_commit=true, job hanya akan dikirim setelah transaksi selesai
    ProcessPodcast::dispatch($podcast);
});
```

---

## Bagian 6: Supervisor dan Production Setup 🏭

### 22. 🧑‍🔧 Menjaga Worker Tetap Berjalan dengan Supervisor

**Analogi:** Seperti memiliki manajer shift yang memastikan pekerja terus bekerja, mengganti yang lelah, dan memulai ulang jika terjadi gangguan.

**Mengapa?** Karena worker bisa berhenti karena berbagai alasan (timeout, error, restart sistem), dan kamu perlu sistem yang otomatis menggantinya.

**Bagaimana?** Gunakan supervisor seperti Supervisor (Linux) atau systemd:

#### **22.1 Instalasi Supervisor**
```bash
sudo apt-get install supervisor
```

#### **22.2 Konfigurasi Supervisor**
Buat file konfigurasi: `/etc/supervisor/conf.d/laravel-worker.conf`

```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /home/forge/your-app/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=forge
numprocs=8
redirect_stderr=true
stdout_logfile=/home/forge/your-app/worker.log
stopwaitsecs=3600
```

**Penjelasan Konfigurasi:**
- `numprocs=8`: Jalankan 8 worker proses secara paralel
- `--max-time=3600`: Restart worker setiap jam untuk mencegah memory leaks
- `stopwaitsecs=3600`: Beri waktu 1 jam untuk job saat shutdown

#### **22.3 Menjalankan Supervisor**
```bash
# Muat konfigurasi baru
sudo supervisorctl reread
sudo supervisorctl update

# Mulai worker
sudo supervisorctl start "laravel-worker:*"

# Cek status
sudo supervisorctl status

# Restart jika perlu
sudo supervisorctl restart "laravel-worker:*"
```

### 23. 🚦 Queue Events - Menangkap Kejadian dalam Antrian

**Analogi:** Seperti memiliki sistem CCTV di jalur antrian yang memberitahu kamu setiap kali ada job yang mulai diproses, selesai, atau error.

**Mengapa?** Karena kamu bisa memantau aktivitas queue secara real-time dan merespons kejadian tertentu.

**Bagaimana?** Gunakan event listener untuk queue:

#### **23.1 Event Listener Dasar**
```php
<?php

namespace App\Providers;

use Illuminate\Queue\Events\JobProcessed;
use Illuminate\Queue\Events\JobProcessing;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Sebelum job diproses
        Queue::before(function (JobProcessing $event) {
            \Log::info('Job starting: ' . $event->job->getJobId(), [
                'connection' => $event->connectionName,
                'queue' => $event->job->getQueue(),
                'job' => $event->job->getName(),
            ]);
        });

        // Setelah job diproses
        Queue::after(function (JobProcessed $event) {
            \Log::info('Job completed: ' . $event->job->getJobId(), [
                'connection' => $event->connectionName,
                'queue' => $event->job->getQueue(),
                'runtime' => $event->job->getRawBody(),
            ]);
        });

        // Saat worker looping (untuk membersihkan state)
        Queue::looping(function () {
            // Membersihkan cache, koneksi DB, dll
            while (\DB::transactionLevel() > 0) {
                \DB::rollBack();
            }
        });
    }
}
```

#### **23.2 Event Handler dalam Service Provider**
```php
<?php

namespace App\Providers;

use Illuminate\Queue\Events\JobFailed;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\ServiceProvider;

class QueueEventServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Queue::failure(function (JobFailed $event) {
            // Simpan informasi error ke database
            \DB::table('job_failures')->insert([
                'job_id' => $event->job->getJobId(),
                'connection' => $event->connectionName,
                'queue' => $event->job->getQueue(),
                'payload' => $event->job->getRawBody(),
                'exception' => $event->exception->getMessage(),
                'failed_at' => now(),
            ]);

            // Kirim notifikasi ke admin
            \Notification::route('mail', 'admin@yourapp.com')
                ->notify(new \App\Notifications\JobFailedNotification($event));
        });
    }
}
```

### 24. 🧹 Membersihkan dan Mengelola Queue

**Analogi:** Seperti membersihkan kotak antrian dari slip-slip yang sudah tidak relevan atau sudah terlalu lama menunggu.

**Mengapa?** Karena queue yang penuh dengan job lama bisa memperlambat sistem dan menyulitkan manajemen.

**Bagaimana?** Gunakan perintah artisan untuk membersihkan:

#### **24.1 Membersihkan Queue**
```bash
# Bersihkan antrian default
php artisan queue:clear

# Bersihkan antrian tertentu
php artisan queue:clear redis --queue=emails

# Bersihkan semua queue di connection tertentu
php artisan queue:clear redis
```

#### **24.2 Pruning Jobs Lama**
```bash
# Hapus failed jobs lebih dari 48 jam
php artisan queue:prune-failed --hours=48

# Hapus batch jobs yang belum selesai lebih dari 72 jam
php artisan queue:prune-batches --unfinished=72

# Hapus batch jobs yang dibatalkan lebih dari 72 jam
php artisan queue:prune-batches --cancelled=72
```

---

## Bagian 7: Peralatan Canggih di 'Kotak Perkakas' Queue 🧰

### 25. 🏗️ Struktur Proyek dengan Queue Service

Agar kode kamu tetap rapi dan mudah dikelola, kamu bisa mengorganisir logika queue ke dalam Service Classes:

#### **1. Service Class untuk Pengiriman Antrian**
```php
<?php
// app/Services/QueueService.php

namespace App\Services;

use App\Jobs\ProcessOrderPayment;
use App\Jobs\SendEmailNotification;
use App\Jobs\UpdateUserAnalytics;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Queue;

class QueueService
{
    public function processOrderPayments(array $orders): void
    {
        foreach ($orders as $order) {
            ProcessOrderPayment::dispatch($order);
        }
    }

    public function sendBulkNotifications(array $users, string $notificationClass, array $data = []): void
    {
        foreach ($users as $user) {
            SendEmailNotification::dispatch($user, $notificationClass, $data);
        }
    }

    public function batchProcessCsv(string $filePath, int $chunkSize = 100): void
    {
        $totalRows = $this->countRows($filePath);
        
        $jobs = [];
        for ($i = 0; $i < $totalRows; $i += $chunkSize) {
            $jobs[] = new \App\Jobs\ImportCsvChunk($i, min($i + $chunkSize - 1, $totalRows - 1), $filePath);
        }

        Bus::batch($jobs)
            ->name("CSV Import: {$filePath}")
            ->onQueue('imports')
            ->then(function ($batch) {
                \Log::info("CSV import completed: {$batch->id}");
            })
            ->catch(function ($batch, $e) {
                \Log::error("CSV import failed: {$batch->id}", ['error' => $e->getMessage()]);
            })
            ->dispatch();
    }

    public function dispatchCriticalJob($job, string $queue = 'critical'): void
    {
        $job->onQueue($queue)->onConnection('redis');
        Bus::dispatch($job);
    }

    private function countRows(string $filePath): int
    {
        // Implementasi untuk menghitung jumlah baris
        return count(file($filePath, FILE_IGNORE_NEW_LINES));
    }
}
```

#### **2. Controller Menggunakan Service**
```php
<?php

namespace App\Http\Controllers;

use App\Services\QueueService;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $queueService;

    public function __construct(QueueService $queueService)
    {
        $this->queueService = $queueService;
    }

    public function processBulkPayments(Request $request)
    {
        $orderIds = $request->input('order_ids');
        $orders = Order::whereIn('id', $orderIds)->get();

        // Gunakan service untuk mengirim ke queue
        $this->queueService->processOrderPayments($orders);

        return response()->json(['message' => 'Payments queued for processing']);
    }

    public function importCsv(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt'
        ]);

        $filePath = $request->file('csv_file')->store('csv-imports');

        // Mulai batch import
        $this->queueService->batchProcessCsv(storage_path("app/{$filePath}"));

        return response()->json(['message' => 'CSV import started']);
    }
}
```

#### **3. Command untuk Monitoring dan Maintenance Queue**
```php
<?php
// app/Console/Commands/QueueMaintenanceCommand.php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class QueueMaintenanceCommand extends Command
{
    protected $signature = 'queue:maintenance 
                           {action : Action to perform (monitor|purge|report)} 
                           {--connection=redis : Queue connection} 
                           {--queue=default : Queue name}';
    
    protected $description = 'Maintenance operations for queue system';

    public function handle()
    {
        $action = $this->argument('action');
        
        switch ($action) {
            case 'monitor':
                $this->monitorQueue();
                break;
                
            case 'purge':
                $this->purgeQueue();
                break;
                
            case 'report':
                $this->generateReport();
                break;
                
            default:
                $this->error('Invalid action. Use monitor, purge, or report.');
                return 1;
        }
        
        return 0;
    }

    private function monitorQueue()
    {
        $connection = $this->option('connection');
        $queue = $this->option('queue');
        
        $size = Redis::llen("queues:{$queue}");
        
        $this->info("Queue {$queue} on {$connection} has {$size} jobs pending.");
        
        if ($size > 1000) {
            $this->warn("Queue is getting large! Consider adding more workers.");
        }
    }

    private function purgeQueue()
    {
        $queue = $this->option('queue');
        
        if ($this->confirm("Purge all jobs from queue {$queue}?")) {
            Redis::del("queues:{$queue}");
            $this->info("Queue {$queue} has been purged.");
        }
    }

    private function generateReport()
    {
        // Kumpulkan statistik dari berbagai queue
        $queues = ['default', 'emails', 'processing', 'critical'];
        
        $this->info('Queue Status Report:');
        $this->table(['Queue', 'Pending Jobs', 'Failed Jobs'], [
            ['default', Redis::llen('queues:default'), \DB::table('failed_jobs')->count()],
            ['emails', Redis::llen('queues:emails'), 0], // Implementasi tergantung driver
            ['processing', Redis::llen('queues:processing'), 0],
            ['critical', Redis::llen('queues:critical'), 0],
        ]);
    }
}
```

### 26. 🧪 Testing Lengkap untuk Sistem Queue

Testing penting untuk memastikan sistem queue berjalan sesuai harapan:

#### **1. Integration Test dengan Queue**
```php
<?php

namespace Tests\Feature;

use App\Jobs\ProcessOrderPayment;
use App\Models\Order;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class QueueIntegrationTest extends TestCase
{
    /** @test */
    public function it_processes_payment_via_queue()
    {
        Queue::fake();

        $order = Order::factory()->create(['status' => 'pending']);

        // Kirim job ke queue
        ProcessOrderPayment::dispatch($order);

        // Cek apakah job benar-benar dikirim
        Queue::assertPushed(ProcessOrderPayment::class, function ($job) use ($order) {
            return $job->order->id === $order->id;
        });

        // Jalankan job secara manual untuk testing
        Queue::assertPushed(ProcessOrderPayment::class);
        $this->assertEquals('pending', $order->fresh()->status);
    }

    /** @test */
    public function it_handles_failed_jobs_properly()
    {
        Queue::fake();

        $order = Order::factory()->create();

        // Simulasikan job gagal dengan mengatur max exception
        $job = new ProcessOrderPayment($order);
        $job->maxExceptions = 1;
        
        // Jalankan job dan pastikan masuk ke failed jobs
        $job->handle();
        
        // Dalam dunia nyata, kamu akan menguji ini dengan worker
        $this->assertDatabaseHas('failed_jobs', [
            'payload' => json_encode(['job' => ProcessOrderPayment::class])
        ]);
    }
}
```

#### **2. Testing dengan Fakes dan Partial Fakes**
```php
<?php

namespace Tests\Unit;

use App\Jobs\ProcessOrderPayment;
use App\Jobs\SendEmailNotification;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class QueuePartialFakeTest extends TestCase
{
    /** @test */
    public function it_fakes_specific_queue_jobs()
    {
        // Fake hanya job tertentu
        Queue::fake([SendEmailNotification::class]);

        // Job ini tidak difake
        ProcessOrderPayment::dispatch(Order::factory()->create());

        // Job ini difake
        SendEmailNotification::dispatch(User::factory()->create());

        Queue::assertPushed(SendEmailNotification::class);
        // ProcessOrderPayment akan tetap dijalankan secara normal
    }

    /** @test */
    public function it_fakes_all_except_specific_jobs()
    {
        // Fake semua kecuali job tertentu
        Queue::fake()->except([ProcessOrderPayment::class]);

        ProcessOrderPayment::dispatch(Order::factory()->create());
        SendEmailNotification::dispatch(User::factory()->create());

        // ProcessOrderPayment tidak akan difake (akan benar-benar dijalankan)
        Queue::assertNotPushed(ProcessOrderPayment::class);
        Queue::assertPushed(SendEmailNotification::class);
    }
}
```

### 27. 🚨 Best Practices dan Potensi Masalah

#### **1. Memory Leaks dan Restart Worker**
- **Masalah:** Worker bisa mengalami memory leaks jika berjalan terlalu lama.
- **Solusi:** Gunakan `--max-jobs` atau `--max-time` untuk restart worker secara berkala.

#### **2. Deadlock dan Transaction Issues**
- **Masalah:** Job bisa terjebak dalam deadlock jika menggunakan database transactions.
- **Solusi:** Gunakan `after_commit` dan hindari job yang mengakses resource bersamaan.

#### **3. Overlapping Jobs**
- **Masalah:** Bisa ada beberapa instance job yang berjalan bersamaan.
- **Solusi:** Gunakan `WithoutOverlapping` middleware.

#### **4. Monitoring dan Logging**
- **Masalah:** Sulit mengetahui apakah job sedang berjalan dengan baik.
- **Solusi:** Gunakan monitoring queue dan logging yang komprehensif.

**Contoh dengan Error Handling dan Monitoring:**
```php
<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RobustDataProcessor implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 300;
    public $backoff = [5, 10, 15];

    protected $dataId;

    public function __construct($dataId)
    {
        $this->dataId = $dataId;
    }

    public function handle()
    {
        Log::info("Starting processing for data: {$this->dataId}");

        try {
            // Proses data di sini
            $this->processData();
            
            Log::info("Successfully processed data: {$this->dataId}");
        } catch (\Exception $e) {
            Log::error("Error processing data: {$this->dataId}", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Re-throw untuk trigger retry logic
            throw $e;
        }
    }

    private function processData()
    {
        // Logika pemrosesan data
        sleep(10); // Simulasi proses berat
    }

    public function middleware(): array
    {
        return [
            (new WithoutOverlapping("data-process-{$this->dataId}"))
                ->expireAfter(600) // 10 menit
        ];
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("Data processing permanently failed: {$this->dataId}", [
            'error' => $exception->getMessage()
        ]);
        
        // Kirim notifikasi ke admin
        // \Notification::send($adminUsers, new DataProcessingFailedNotification($this->dataId, $exception));
    }

    public function retryUntil(): ?\DateTime
    {
        return now()->addHour();
    }
}
```

---

## Bagian 8: Menjadi Master Queue Laravel 🏆

### 28. ✨ Wejangan dari Guru

1.  **Gunakan Queue untuk Tugas Berat**: Jangan proses tugas besar langsung di request HTTP, kecuali sangat kritis.
  
2.  **Pilih Driver yang Tepat**: Gunakan Redis untuk performa terbaik, Database untuk kemudahan setup, dan SQS untuk skalabilitas cloud.

3.  **Atur Retry dan Timeout Dengan Bijak**: Terlalu banyak retry bisa menyebabkan antrian penuh, terlalu sedikit bisa menyebabkan job hilang.

4.  **Monitor Sistem Queue**: Gunakan logging dan monitoring untuk mendeteksi masalah sebelum menjadi kritis.

5.  **Gunakan Batching untuk Tugas Besar**: Untuk pekerjaan dalam jumlah besar, gunakan batch untuk memudahkan manajemen dan monitoring.

### 29. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Queue di Laravel:

#### 🚦 Dasar-dasar Queue
| Perintah | Fungsi |
|----------|--------|
| `php artisan make:job ProcessPodcast` | Buat job class |
| `ProcessPodcast::dispatch($podcast)` | Kirim job ke queue |
| `php artisan queue:work` | Jalankan queue worker |
| `QUEUE_CONNECTION=redis` | Set queue connection |

#### 🏗️ Driver Queue
| Driver | Instalasi | Ketika Digunakan |
|--------|-----------|------------------|
| `database` | `composer require doctrine/dbal` | Development, sederhana |
| `redis` | `composer require predis/predis` | Production, performa |
| `sqs` | `composer require aws/aws-sdk-php` | Scalable, cloud |
| `beanstalkd` | `composer require pda/pheanstalk` | Alternatif cepat |

#### 🔧 Konfigurasi Queue
| File | Fungsi |
|------|--------|
| `.env` | Pengaturan utama (QUEUE_CONNECTION, etc.) |
| `config/queue.php` | Konfigurasi connection secara lengkap |
| `php artisan queue:failed` | Lihat failed jobs |
| `php artisan queue:retry all` | Retry semua failed jobs |

#### 🧪 Testing Commands
| Perintah | Fungsi |
|----------|--------|
| `Queue::fake()` | Mock queue untuk testing |
| `Queue::assertPushed(JobClass::class)` | Cek apakah job dikirim |
| `Bus::fake()` | Fake job batching/chaining |
| `Bus::assertChained([...])` | Cek apakah chain benar |

#### ⚙️ Job Konfigurasi
| Fitur | Implementasi |
|-------|-------------|
| Retry | `public $tries = 5;` atau `retryUntil(): DateTime` |
| Timeout | `public $timeout = 120;` |
| Unique | `implements ShouldBeUnique` dengan `uniqueId()` |
| Encrypted | `implements ShouldBeEncrypted` |

#### 🚀 Perintah Queue Worker
| Command | Fungsi |
|---------|--------|
| `php artisan queue:work --queue=high,default` | Proses antrian dengan prioritas |
| `php artisan queue:work --max-jobs=1000` | Restart worker setelah 1000 job |
| `php artisan queue:restart` | Restart semua worker |
| `php artisan queue:monitor redis:default` | Monitor jumlah job |

#### 🧹 Maintenance Commands
| Command | Fungsi |
|---------|--------|
| `php artisan queue:clear` | Bersihkan semua job di queue |
| `php artisan queue:flush` | Hapus semua failed jobs |
| `php artisan queue:prune-failed --hours=48` | Hapus failed jobs lama |

#### 🚨 Best Practices
| Praktik | Alasan |
|---------|--------|
| Gunakan `after_commit` | Mencegah inkonsistensi data |
| Gunakan `WithoutOverlapping` | Mencegah multiple execution |
| Monitor queue size | Mencegah bottleneck |
| Gunakan batching | Untuk tugas dalam jumlah besar |

### 30. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Queue di Laravel, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Dengan memahami sistem Queue, kamu sekarang memiliki kemampuan untuk membuat aplikasi yang sangat responsif dan bisa menangani beban kerja berat dengan elegan.

Queue bukan hanya tentang menunda tugas - itu adalah strategi arsitektur penting yang memungkinkan aplikasimu tetap cepat dan andal bahkan ketika mengerjakan tugas-tugas berat. Dengan memilih driver yang tepat, mengelola error dengan baik, dan menggunakan fitur lanjutan seperti batching dan monitoring, kamu bisa membuat sistem yang mampu menangani jutaan job tanpa membuat pengguna menunggu.

Ingat, Queue adalah alat yang sangat kuat dalam gudang senjatamu sebagai developer Laravel. Menguasainya berarti kamu sudah siap membuat aplikasi Laravel yang tidak hanya hebat secara teknis, tapi juga hebat dalam memberikan pengalaman pengguna yang luar biasa.

Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku! 🚀


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



## **21. Mengabaikan Model yang Hilang**

```php
public $deleteWhenMissingModels = true;
```

> Mencegah `ModelNotFoundException` jika model dihapus saat job berada di antrian.



## **22. Monitoring Queues**

* Command:

```bash
php artisan queue:monitor redis:default,redis:deployments --max=100
```

* Bisa mendengarkan event `QueueBusy` untuk notifikasi.



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



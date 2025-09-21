# ✅**Cache**

## **1. Pendahuluan**

Cache adalah mekanisme penyimpanan sementara data yang sering diakses agar aplikasi dapat merespons lebih cepat. Beberapa operasi pengambilan atau pemrosesan data bisa **memakan waktu lama atau intensif CPU**. Cache membantu dengan menyimpan hasil proses atau data yang sudah diambil sehingga dapat digunakan kembali dengan cepat pada permintaan berikutnya.

Laravel menyediakan **API cache yang terpadu dan ekspresif**, mendukung berbagai backend cache populer seperti **Memcached**, **Redis**, **DynamoDB**, **Database**, dan **file-based cache**. Ini memudahkan pengembang memanfaatkan cache tanpa bergantung pada implementasi spesifik backend tertentu.



## **2. Konfigurasi Cache**

File konfigurasi cache berada di:

```
config/cache.php
```

Di sini, Anda dapat menentukan **driver cache default**, serta pengaturan lain seperti prefix, lifetime, dan server backend. Driver yang didukung Laravel antara lain:

* **Database**: menyimpan data cache dalam tabel database.
* **File**: menyimpan cache dalam file di storage.
* **Memcached**: cache in-memory.
* **Redis**: cache in-memory cepat.
* **DynamoDB**: cache di cloud AWS.
* **Array** dan **Null**: untuk testing atau cache sementara.

Secara default, Laravel menggunakan **database driver**.



## **3. Prasyarat Driver**

### **3.1 Database**

Untuk menggunakan database sebagai cache, buat tabel cache:

```bash
php artisan make:cache-table
php artisan migrate
```

### **3.2 Memcached**

Pastikan PECL Memcached terinstal. Konfigurasi server di `config/cache.php`:

```php
'memcached' => [
    'servers' => [
        [
            'host' => env('MEMCACHED_HOST', '127.0.0.1'),
            'port' => env('MEMCACHED_PORT', 11211),
            'weight' => 100,
        ],
    ],
],
```

Untuk UNIX socket:

```php
'memcached' => [
    'servers' => [
        [
            'host' => '/var/run/memcached/memcached.sock',
            'port' => 0,
            'weight' => 100
        ],
    ],
],
```

### **3.3 Redis**

Install **PhpRedis** atau `predis/predis`:

```bash
composer require predis/predis
```

Laravel Sail sudah menyertakan extension Redis.

### **3.4 DynamoDB**

* Buat tabel DynamoDB dengan partition key (default: `key`) dan aktifkan TTL.
* Install AWS SDK:

```bash
composer require aws/aws-sdk-php
```

* Konfigurasi `.env`:

```php
'dynamodb' => [
    'driver' => 'dynamodb',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    'table' => env('DYNAMODB_CACHE_TABLE', 'cache'),
    'endpoint' => env('DYNAMODB_ENDPOINT'),
],
```

### **3.5 MongoDB**

Gunakan package `mongodb/laravel-mongodb`. Mendukung TTL index untuk pembersihan otomatis cache.



## **4. Penggunaan Cache**

### **4.1 Mendapatkan Instance Cache**

Gunakan **Cache facade**:

```php
use Illuminate\Support\Facades\Cache;

$value = Cache::get('key');
```

### **4.2 Mengakses Beberapa Cache Store**

```php
$value = Cache::store('file')->get('foo');
Cache::store('redis')->put('bar', 'baz', 600); // 10 menit
```

### **4.3 Mengambil Item**

```php
$value = Cache::get('key', 'default');
```

Dengan closure untuk default value:

```php
$value = Cache::get('key', function () {
    return DB::table('users')->get();
});
```

### **4.4 Mengecek Keberadaan Item**

```php
if (Cache::has('key')) {
    // Key ada
}
```

### **4.5 Increment / Decrement**

```php
Cache::add('counter', 0, now()->addHours(4));
Cache::increment('counter');
Cache::decrement('counter', 2);
```

### **4.6 Retrieve and Store**

```php
$value = Cache::remember('users', 600, function () {
    return DB::table('users')->get();
});

$value = Cache::rememberForever('users', function () {
    return DB::table('users')->get();
});
```

### **4.7 Stale While Revalidate**

```php
$value = Cache::flexible('users', [5, 10], function () {
    return DB::table('users')->get();
});
```

### **4.8 Retrieve and Delete**

```php
$value = Cache::pull('key', 'default');
```

### **4.9 Menyimpan Item**

```php
Cache::put('key', 'value', 600);
Cache::forever('key', 'value'); // permanen
```

### **4.10 Menghapus Item**

```php
Cache::forget('key');
Cache::flush(); // menghapus semua cache
```

### **4.11 Memoization**

```php
$value = Cache::memo()->get('key');
Cache::memo()->put('name', 'Taylor');
```

### **4.12 Cache Helper**

```php
$value = cache('key');
cache(['key' => 'value'], 600);
cache()->remember('users', 600, function () {
    return DB::table('users')->get();
});
```



## **5. Cache Tags**

### **5.1 Menyimpan Tagged Cache**

```php
Cache::tags(['people', 'artists'])->put('John', $john, 600);
```

### **5.2 Mengakses Tagged Cache**

```php
$john = Cache::tags(['people', 'artists'])->get('John');
```

### **5.3 Menghapus Tagged Cache**

```php
Cache::tags(['people', 'authors'])->flush();
Cache::tags('authors')->flush();
```



## **6. Atomic Locks**

### **6.1 Mengelola Lock**

```php
$lock = Cache::lock('foo', 10);
if ($lock->get()) {
    // Do something
    $lock->release();
}
```

### **6.2 Lock dengan Closure**

```php
Cache::lock('foo', 10)->get(function () {
    // Lock otomatis dilepas
});
```

### **6.3 Block & Timeout**

```php
use Illuminate\Contracts\Cache\LockTimeoutException;

try {
    Cache::lock('foo', 10)->block(5, function () {
        // lock acquired
    });
} catch (LockTimeoutException $e) {
    // gagal
}
```

### **6.4 Lock Across Process**

```php
$lock = Cache::lock('processing', 120);
if ($lock->get()) {
    ProcessPodcast::dispatch($podcast, $lock->owner());
}

// di job
Cache::restoreLock('processing', $this->owner)->release();
```



## **7. Menambahkan Custom Cache Driver**

### **7.1 Membuat Driver**

```php
class MongoStore implements Store {
    public function get($key) {}
    public function put($key, $value, $seconds) {}
    public function forever($key, $value) {}
    public function forget($key) {}
    public function flush() {}
}
```

### **7.2 Registrasi Driver**

```php
Cache::extend('mongo', function ($app) {
    return Cache::repository(new MongoStore);
});
```



## **8. Events**

Laravel menyediakan event cache seperti:

* `CacheHit`, `CacheMissed`
* `KeyWritten`, `KeyForgotten`
* `CacheFlushed`, `CacheFlushing`

Menonaktifkan event untuk performa:

```php
'database' => [
    'driver' => 'database',
    'events' => false,
],
```



✅ **Dokumentasi ini sudah lengkap** dengan:

* Narasi penjelasan setiap bab/sub-bab
* Contoh kode nyata
* Semua topik utama Laravel Cache (driver, penggunaan, tags, locks, custom driver, events)



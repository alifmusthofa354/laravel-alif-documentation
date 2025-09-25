# 📘 Redis di Laravel: Panduan dari Guru Kesayanganmu (Edisi Super Cepat)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Hari ini kita akan membahas salah satu teknologi super cepat yang bisa membuat aplikasimu berjalan seperti mobil balap: **Redis**. Yups, kita akan belajar bagaimana membuat aplikasi yang responsif, cepat, dan mampu menangani ribuan pengguna sekaligus dengan teknologi caching dan storage super cepat ini.

Setelah beberapa kali revisi, akhirnya Guru paham apa yang sebenarnya kalian inginkan: sebuah panduan yang **super lengkap** tapi dijelaskan dengan **super sederhana**, seolah-olah Guru sedang duduk di sebelahmu sambil menjelaskan pelan-pelan.

Siap untuk belajar tentang kecepatan aplikasi digital? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Redis Itu Sebenarnya?

**Analogi:** Bayangkan kamu punya toko buku favorit. Setiap kali pengunjung datang, mereka sering bertanya tentang buku-buku terlaris. Daripada kamu harus selalu ke gudang (database) untuk mencari informasi buku itu, lebih baik kamu punya meja samping kasir (Redis) yang selalu menyimpan informasi buku-buku terlaris tersebut. Jadinya, kamu bisa langsung kasih jawabannya tanpa bolak-balik ke gudang.

**Mengapa ini penting?** Karena database itu seperti gudang besar - aman tapi lambat. Redis itu seperti meja samping kasir - cepat tapi tidak untuk menyimpan semua barang. Dengan Redis, kamu bisa membuat aplikasimu super cepat karena data yang sering diakses langsung ada di meja samping.

**Bagaimana cara kerjanya?** Redis adalah *in-memory key-value store* yang sangat cepat, cocok untuk data yang sering diakses. Redis menyimpan berbagai tipe data:
- **String** → data sederhana seperti "halo" atau "123"
- **Hash** → struktur mirip objek dengan key-value pairs
- **List** → seperti array atau antrian
- **Set** → koleksi unik tanpa duplikasi
- **Sorted Set** → list dengan skor (sangat cocok untuk leaderboard/ranking)

Jadi, alur kerja aplikasi kita menjadi:

`➡️ Permintaan Pengguna -> 🔍 Cek di Redis (Meja Samping) -> Jika Ada, Kembalikan Langsung -> Jika Tidak Ada, Cek ke Database (Gudang) -> Simpan ke Redis untuk Kedepannya`

Tanpa Redis, setiap permintaan harus bolak-balik ke database, dan itu membuat aplikasimu lambat seperti kura-kura. 😴

### 2. ✍️ Resep Pertamamu: Setup Redis di Laravel

Ini adalah fondasi paling dasar. Mari kita persiapkan Redis di Laravel dari nol, langkah demi langkah.

#### Langkah 1️⃣: Install Server Redis (Meja Samping Kasirmu)
**Mengapa?** Kita butuh server Redis berjalan di komputer kita untuk menggunakan layanannya.

**Bagaimana?** Buka terminal dan jalankan perintah sesuai sistem operasi kamu:

Untuk Linux/Mac:
```bash
sudo apt install redis-server  # Ubuntu/Debian
# atau
brew install redis  # Mac
```

Untuk Windows, kamu bisa menggunakan WSL (Windows Subsystem for Linux) atau Redis untuk Windows.

#### Langkah 2️⃣: Install Client Redis di Laravel
**Mengapa?** Laravel butuh client untuk berkomunikasi dengan server Redis.

**Bagaimana?** Kamu punya dua pilihan:

**Pilihan 1 (Direkomendasikan):** PhpRedis (ekstensi PHP)
```bash
pecl install redis
```

**Pilihan 2 (Alternatif):** Predis (library PHP murni)
```bash
composer require predis/predis
```

**Penjelasan Pilihan:**
- **PhpRedis** lebih cepat karena ekstensi C, tapi butuh instalasi ekstensi PHP
- **Predis** lebih mudah diinstall karena pure PHP, tapi sedikit lebih lambat

#### Langkah 3️⃣: Konfigurasi Laravel untuk Berbicara dengan Redis
**Mengapa?** Kita harus memberi tahu Laravel dimana server Redis berada dan bagaimana cara mengaksesnya.

**Bagaimana?** Atur file `.env` dan `config/database.php`:

**File `.env`:**
```bash
REDIS_HOST=127.0.0.1  # Alamat server Redis (localhost)
REDIS_PORT=6379       # Port standar Redis
REDIS_CLIENT=phpredis # atau predis
REDIS_DB=0            # Database Redis utama
REDIS_CACHE_DB=1      # Database Redis untuk cache
```

**File `config/database.php` (bagian redis):**
```php
'redis' => [
    'client' => env('REDIS_CLIENT', 'phpredis'),
    'options' => [
        'cluster' => env('REDIS_CLUSTER', 'redis'),
        'prefix' => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_database_'),
    ],
    'default' => [
        'url' => env('REDIS_URL'),
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'username' => env('REDIS_USERNAME'),
        'password' => env('REDIS_PASSWORD'),
        'port' => env('REDIS_PORT', '6379'),
        'database' => env('REDIS_DB', '0'),
    ],
    'cache' => [
        'url' => env('REDIS_URL'),
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'username' => env('REDIS_USERNAME'),
        'password' => env('REDIS_PASSWORD'),
        'port' => env('REDIS_PORT', '6379'),
        'database' => env('REDIS_CACHE_DB', '1'),
    ],
],
```

**Penjelasan Kode:**
- `REDIS_HOST` adalah alamat server Redis (biasanya localhost/127.0.0.1)
- `REDIS_PORT` adalah port koneksi (standar Redis: 6379)
- `REDIS_CLIENT` menentukan client yang digunakan (phpredis atau predis)
- `REDIS_DB` dan `REDIS_CACHE_DB` memungkinkan kamu menggunakan database berbeda di Redis

Selesai! 🎉 Sekarang, kamu punya koneksi antara Laravel dan Redis.

### 3. ⚡ Redis Spesialis (Caching Sederhana)

**Analogi:** Bayangkan kamu punya asisten yang selalu mengingat jawaban atas pertanyaan yang sering diajukan pelanggan. Inilah yang dilakukan Redis untuk caching.

**Mengapa ini ada?** Untuk menyimpan data yang sering diakses sehingga tidak perlu kembali ke database setiap kali.

**Bagaimana?** Gunakan facade `Redis` langsung di Laravel:
```php
<?php

use Illuminate\Support\Facades\Redis;

// Menyimpan data di Redis
Redis::set('user:1:name', 'Alif');

// Membaca data dari Redis
$name = Redis::get('user:1:name'); // Returns: 'Alif'

// Menyimpan dengan waktu kadaluarsa (5 menit)
Redis::setex('user:1:last_seen', 300, now()->toISOString());

// Menghapus data
Redis::del('user:1:name');
```

---

## Bagian 2: Feature Redis - Mesin Cepat-mu 🤖

### 4. 📦 Apa Itu Redis Feature?

**Analogi:** Bayangkan kamu punya toko dengan berbagai jenis rak khusus: rak untuk buku terlaris, rak untuk antrian pesanan, rak untuk leaderboard penjualan, dll. Itulah berbagai fitur Redis - setiap jenis rak (tipe data) punya kegunaan spesifik.

**Mengapa ini keren?** Karena Redis punya berbagai tipe data yang bisa digunakan untuk berbagai kasus seperti caching, queue, leaderboard, real-time notification, dll.

**Bagaimana?** Redis menyediakan berbagai tipe data untuk berbagai kebutuhan:

### 5. 🛠️ Tipe Data Redis dengan Kekuatan Tambahan

> **✨ Tips dari Guru:** Setiap tipe data punya kegunaan spesifik! Gunakan sesuai kebutuhanmu agar aplikasimu efisien.

*   **String**: Untuk menyimpan data sederhana (teks, angka, JSON string).
    ```php
    Redis::set('simple_data', 'ini adalah string');
    Redis::set('counter', 1); // bisa juga untuk counter
    Redis::incr('counter'); // increment counter: 1 -> 2
    ```

*   **Hash**: Untuk menyimpan struktur objek dengan banyak field.
    ```php
    // Menyimpan objek user
    Redis::hset('user:1', 'name', 'Alif');
    Redis::hset('user:1', 'email', 'alif@example.com');
    Redis::hset('user:1', 'score', 100);
    
    // Ambil satu field
    $name = Redis::hget('user:1', 'name');
    
    // Ambil semua field
    $user = Redis::hgetall('user:1');
    ```

*   **List**: Untuk antrian (queue) atau stack.
    ```php
    // Tambahkan ke akhir list (queue)
    Redis::rpush('job_queue', json_encode(['task' => 'send_email', 'user_id' => 1]));
    
    // Tambahkan ke awal list (stack)  
    Redis::lpush('recent_activities', 'user_logged_in');
    
    // Ambil dari awal list
    $job = Redis::lpop('job_queue');
    ```

*   **Set**: Untuk koleksi unik (tidak ada duplikasi).
    ```php
    // Tambah ke set (unik)
    Redis::sadd('users:visited', 1);
    Redis::sadd('users:visited', 2);
    Redis::sadd('users:visited', 1); // tidak akan ditambah karena duplikat
    
    // Cek apakah item ada di set
    $isVisited = Redis::sismember('users:visited', 1);
    
    // Ambil semua member
    $allUsers = Redis::smembers('users:visited');
    ```

*   **Sorted Set**: Untuk leaderboard dan ranking.
    ```php
    // Tambah ke sorted set dengan skor
    Redis::zadd('leaderboard', 100, 'player1');
    Redis::zadd('leaderboard', 200, 'player2');
    Redis::zadd('leaderboard', 150, 'player3');
    
    // Ambil top 10
    $top10 = Redis::zrevrange('leaderboard', 0, 9, ['withscores' => true]);
    
    // Dapatkan skor user
    $score = Redis::zscore('leaderboard', 'player1');
    ```

### 6. 🧩 Memilih Rak yang Tepat (Pemilihan Tipe Data)

*   **Gunakan String**: Untuk menyimpan data sederhana, cache, atau counter.
*   **Gunakan Hash**: Untuk menyimpan objek dengan banyak field (user profile, product info).
*   **Gunakan List**: Untuk antrian tugas (job queue), recent activity.
*   **Gunakan Set**: Untuk koleksi unik (following, tags, permissions).
*   **Gunakan Sorted Set**: Untuk leaderboard, rating, atau ranking.

### 7. 🌐 Redis dengan Laravel Cache

**Mengapa?** Laravel menyediakan integration Redis dengan facade Cache yang lebih mudah digunakan untuk caching umum.

**Bagaimana?** Gunakan facade Cache dan atur driver ke Redis:

1. **Konfigurasi Cache Redis:**
```bash
// Di .env
CACHE_DRIVER=redis
```

2. **Contoh Penggunaan Cache:**
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CacheController extends Controller
{
    public function showUser($id)
    {
        // Coba ambil dari cache dulu, jika tidak ada ambil dari database
        $user = Cache::remember("user.{$id}", 300, function () use ($id) {
            return \App\Models\User::find($id); // Cari di database
        });
        
        return response()->json($user);
    }
    
    public function updateUser(Request $request, $id)
    {
        $user = \App\Models\User::findOrFail($id);
        $user->update($request->all());
        
        // Hapus cache untuk user ini agar cache terbaru
        Cache::forget("user.{$id}");
        
        return response()->json($user);
    }
}
```

3. **Route:**
```php
// routes/web.php
use App\Http\Controllers\CacheController;

Route::get('/user/{id}', [CacheController::class, 'showUser']);
Route::put('/user/{id}', [CacheController::class, 'updateUser']);
```

Redis sebagai driver cache membuat aplikasimu sangat cepat karena data sering diakses langsung dari memory.

---

## Bagian 3: Jurus Tingkat Lanjut - Redis dengan Queue & Pub/Sub 🚀

### 8. 👨‍👩‍👧 Redis Queue (Background Jobs)

**Analogi:** Bayangkan kamu punya restoran, dan ketika pelanggan memesan makanan, pesanan tidak langsung dimasak di tempat (akan memperlambat pelayanan), tapi dimasukkan ke dalam antrian agar bisa diproses oleh dapur (worker) di belakang layar. Itulah queue!

**Mengapa?** Agar task berat (seperti kirim email, proses gambar, API calls) tidak memperlambat respons aplikasi.

**Bagaimana?** Gunakan Redis sebagai driver queue di Laravel:

**Konfigurasi Queue:**
```bash
// Di .env
QUEUE_CONNECTION=redis
```

**File `config/queue.php` (bagian redis):**
```php
'redis' => [
    'driver' => 'redis',
    'connection' => 'default',
    'queue' => env('REDIS_QUEUE', 'default'),
    'retry_after' => 90,
    'block_for' => null,
    'after_commit' => false,
],
```

**Contoh Job:**
```php
<?php
// app/Jobs/SendWelcomeEmail.php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Mail;

class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function handle()
    {
        // Kirim email welcome
        Mail::send('emails.welcome', ['user' => $this->user], function ($message) {
            $message->to($this->user->email)->subject('Welcome!');
        });
    }
}
```

**Contoh Penggunaan dalam Controller:**
```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Jobs\SendWelcomeEmail;
use App\Models\User;

class UserController extends Controller
{
    public function register()
    {
        $user = User::create([
            'name' => 'Alif',
            'email' => 'alif@example.com',
            'password' => bcrypt('password')
        ]);
        
        // Kirim email ke queue (akan diproses nanti oleh worker)
        SendWelcomeEmail::dispatch($user);
        
        return response()->json(['message' => 'User registered successfully!']);
    }
}
```

**Menjalankan Queue Worker:**
```bash
php artisan queue:work
```

**Contoh Lengkap Redis Queue:**

1. **Buat Job Baru:**
```bash
php artisan make:job ProcessImageUpload
```

2. **Isi Job:**
```php
<?php
// app/Jobs/ProcessImageUpload.php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class ProcessImageUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $imagePath;

    public function __construct($imagePath)
    {
        $this->imagePath = $imagePath;
    }

    public function handle()
    {
        // Proses gambar secara berat (resize, watermark, dll)
        $image = Image::make(Storage::path($this->imagePath));
        
        // Resize gambar
        $image->resize(800, 600);
        
        // Tambah watermark (contoh)
        $image->insert('public/images/watermark.png', 'bottom-right', 10, 10);
        
        // Simpan versi yang sudah diproses
        $processedPath = str_replace('.', '_processed.', $this->imagePath);
        $image->save(Storage::path($processedPath));
        
        // Hapus file asli jika diinginkan
        Storage::delete($this->imagePath);
    }
}
```

3. **Controller untuk Upload:**
```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessImageUpload;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function upload(Request $request): RedirectResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:10000', // max 10MB
        ]);

        // Simpan file sementara
        $path = $request->file('image')->store('temp');

        // Tambahkan ke queue untuk diproses nanti
        ProcessImageUpload::dispatch($path);

        return redirect()->back()->with('status', 'Gambar sedang diproses di background!');
    }
}
```

Dengan Redis queue, pengguna bisa melanjutkan aktivitas tanpa menunggu proses berat selesai.
*   **Pub/Sub (Publish/Subscribe)**: Ini seperti sistem pengumuman di mall - kamu bisa mengirim pengumuman (publish) dan banyak orang bisa mendengarkan (subscribe) pengumuman tersebut secara real-time.

**Contoh Lengkap Pub/Sub:**

1. **Route untuk Publish:**
```php
// routes/web.php
use Illuminate\Support\Facades\Redis;

Route::post('/broadcast', function () {
    $message = request('message');
    
    // Publish ke channel
    Redis::publish('notifications', json_encode([
        'message' => $message,
        'timestamp' => now()->toISOString()
    ]));
    
    return response()->json(['status' => 'Message broadcasted']);
});
```

2. **Artisan Command untuk Subscribe:**
```bash
php artisan make:command RedisNotifier
```

3. **Isi Command:**
```php
<?php
// app/Console/Commands/RedisNotifier.php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class RedisNotifier extends Command
{
    protected $signature = 'redis:notify';
    protected $description = 'Listen to Redis notifications';

    public function handle()
    {
        $this->info("Listening for Redis notifications...");
        
        Redis::subscribe(['notifications'], function ($message) {
            $data = json_decode($message, true);
            $this->info("New notification: {$data['message']} at {$data['timestamp']}");
        });
    }
}
```

4. **Jalankan Command:**
```bash
php artisan redis:notify
```

5. **Test dengan POST request ke /broadcast

Pub/Sub sangat berguna untuk:
- Real-time notifications
- Chat applications
- Live updates
- System monitoring

### 9. 👤 Redis untuk Session Management

**Analogi:** Ini untuk menyimpan catatan kecil tentang pengunjung yang sedang aktif di toko kamu - seperti apakah mereka login, barang yang ditambahkan ke keranjang, dll.

**Mengapa?** Agar session bisa dibagi di banyak server dan lebih cepat dari file session.

**Bagaimana?** Atur session driver ke Redis:
```bash
// Di .env
SESSION_DRIVER=redis
SESSION_LIFETIME=120
```

```php
// config/session.php (bagian driver redis)
'driver' => env('SESSION_DRIVER', 'redis'),
'connection' => 'default',
```

### 10. 🎨 Mendekorasi Performa-mu (Kustomisasi Redis)

Kamu bisa mendekorasi konfigurasi Redis sesukamu:

*   **Mengganti Database Redis**: 
    ```php
    $redis = Redis::connection('cache'); // Gunakan database cache
    $redis = Redis::connection('default'); // Gunakan database default
    ```

*   **Mengganti Prefix**: 
    ```php
    // Di config/database.php
    'prefix' => env('REDIS_PREFIX', 'myapp_'),
    ```

*   **Mengganti Timeout Koneksi**: 
    ```php
    // Di config/database.php
    'options' => [
        'read_write_timeout' => 60,
    ],
    ```

*   **Menggunakan Cluster Redis**: 
    ```php
    // Di config/database.php
    'redis' => [
        'clusters' => [
            'default' => [
                [
                    'host' => env('REDIS_HOST', 'localhost'),
                    'password' => env('REDIS_PASSWORD', null),
                    'port' => env('REDIS_PORT', 6379),
                    'database' => 0,
                ],
            ],
        ],
    ],
    ```

**Contoh Lengkap Kustomisasi Redis:**
```php
// config/redis.php
return [
    'client' => env('REDIS_CLIENT', 'phpredis'),
    
    'options' => [
        'cluster' => env('REDIS_CLUSTER', 'redis'),
        'prefix' => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_database_'),
    ],
    
    'default' => [
        'url' => env('REDIS_URL'),
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'username' => env('REDIS_USERNAME'),
        'password' => env('REDIS_PASSWORD'),
        'port' => env('REDIS_PORT', '6379'),
        'database' => env('REDIS_DB', '0'),
        'read_write_timeout' => 60,
    ],
    
    'cache' => [
        'url' => env('REDIS_URL'),
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'username' => env('REDIS_USERNAME'),
        'password' => env('REDIS_PASSWORD'),
        'port' => env('REDIS_PORT', '6379'),
        'database' => env('REDIS_CACHE_DB', '1'),
    ],
    
    'sessions' => [
        'url' => env('REDIS_URL'),
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'username' => env('REDIS_USERNAME'),
        'password' => env('REDIS_PASSWORD'),
        'port' => env('REDIS_PORT', '6379'),
        'database' => 2, // Gunakan database khusus untuk session
    ],
];

// Di service class
class RedisService
{
    public function __construct(
        protected \Illuminate\Redis\Connections\Connection $redis
    ) {
        $this->redis = \Illuminate\Support\Facades\Redis::connection();
    }
    
    public function cacheWithExpiry(string $key, mixed $data, int $minutes = 5): void
    {
        $this->redis->setex($key, $minutes * 60, json_encode($data));
    }
    
    public function getFromCache(string $key): mixed
    {
        $data = $this->redis->get($key);
        return $data ? json_decode($data, true) : null;
    }
    
    public function incrementCounter(string $key): int
    {
        return $this->redis->incr($key);
    }
    
    public function addToSortedSet(string $key, array $membersWithScore): void
    {
        foreach ($membersWithScore as $member => $score) {
            $this->redis->zadd($key, $score, $member);
        }
    }
}
```

### 11.5 🔐 Middleware untuk Manajemen Redis

Kamu juga bisa menambahkan middleware untuk memastikan hanya operasi Redis yang sah yang bisa dijalankan:

*   **Middleware untuk Rate Limiting**:
    ```php
    php artisan make:middleware RedisRateLimiter
    
    // app/Http/Middleware/RedisRateLimiter.php
    namespace App\Http\Middleware;
    
    use Closure;
    use Illuminate\Support\Facades\Redis;
    use Illuminate\Http\Request;
    
    class RedisRateLimiter
    {
        public function handle(Request $request, Closure $next)
        {
            $key = 'rate_limit:' . $request->ip();
            $count = Redis::incr($key);
            
            if ($count === 1) {
                Redis::expire($key, 60); // Reset setelah 60 detik
            }
            
            if ($count > 100) { // Batasi 100 request per menit
                abort(429, 'Too Many Requests');
            }
    
            return $next($request);
        }
    }
    ```

*   **Menggunakan Middleware di Controller**:
    ```php
    class RedisController extends Controller implements HasMiddleware
    {
        public static function middleware(): array
        {
            return [
                'auth',
                new Middleware('redis.rate-limiter', only: ['store', 'update']),
            ];
        }
    }
    ```

### 11.7 🌐 Redis dengan Microservices

**Mengapa?** Untuk berbagi data antar layanan (microservices) secara real-time dan cepat.

**Bagaimana?**
```php
// Di service 1 - publisher
Redis::publish('user_events', json_encode([
    'event' => 'user_created',
    'user_id' => $user->id,
    'data' => $user->toArray()
]));

// Di service 2 - subscriber (bisa berjalan di server berbeda)
Redis::subscribe(['user_events'], function ($message) {
    $event = json_decode($message, true);
    
    if ($event['event'] === 'user_created') {
        // Proses event di service lain
        processUserCreation($event['user_id'], $event['data']);
    }
});
```

### 11. 🗑️ Menangani Data Sementara (TTL & Expiration)

**Mengapa?** Terkadang kita hanya ingin data tersimpan sementara, lalu otomatis hilang.

**Bagaimana?**
*   **TTL (Time To Live)**: `expire`, `setex`, `pexpire`
*   **Data Sementara**: Cache dengan expiration time

**Contoh Lengkap dengan TTL:**

1. **Mengatur TTL untuk Data:**
```php
<?php

use Illuminate\Support\Facades\Redis;

// Set data dengan TTL 300 detik (5 menit)
Redis::setex('temp_token', 300, 'abc123xyz');

// Set TTL untuk key yang sudah ada
Redis::expire('user_session_123', 1800); // 30 menit

// Cek berapa lama lagi key akan kadaluarsa
$ttl = Redis::ttl('temp_token'); // Returns seconds remaining
```

2. **Service untuk Session Sementara:**
```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Redis;

class TemporarySessionService
{
    private string $prefix = 'temp_session:';
    
    public function createSession(string $userId, array $data, int $minutes = 30): string
    {
        $sessionId = uniqid();
        $key = $this->prefix . $sessionId;
        
        $sessionData = array_merge($data, [
            'user_id' => $userId,
            'created_at' => now()->toISOString()
        ]);
        
        Redis::setex($key, $minutes * 60, json_encode($sessionData));
        
        return $sessionId;
    }
    
    public function getSession(string $sessionId): ?array
    {
        $key = $this->prefix . $sessionId;
        $data = Redis::get($key);
        
        return $data ? json_decode($data, true) : null;
    }
    
    public function extendSession(string $sessionId, int $additionalMinutes = 30): bool
    {
        $key = $this->prefix . $sessionId;
        $ttl = Redis::ttl($key);
        
        if ($ttl > 0) {
            // Perpanjang TTL
            return Redis::expire($key, $ttl + ($additionalMinutes * 60));
        }
        
        return false;
    }
    
    public function deleteSession(string $sessionId): int
    {
        $key = $this->prefix . $sessionId;
        return Redis::del($key);
    }
}
```

3. **Controller dengan Session Sementara:**
```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\TemporarySessionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TemporarySessionController extends Controller
{
    public function __construct(
        protected TemporarySessionService $sessionService
    ) {}
    
    public function create(Request $request): JsonResponse
    {
        $sessionId = $this->sessionService->createSession(
            $request->user()->id,
            $request->only(['cart_items', 'preferences']),
            60 // 1 jam
        );
        
        return response()->json([
            'session_id' => $sessionId,
            'message' => 'Session created successfully'
        ]);
    }
    
    public function get(string $sessionId): JsonResponse
    {
        $session = $this->sessionService->getSession($sessionId);
        
        if (!$session) {
            return response()->json(['error' => 'Session not found or expired'], 404);
        }
        
        return response()->json($session);
    }
    
    public function extend(string $sessionId): JsonResponse
    {
        $success = $this->sessionService->extendSession($sessionId, 30);
        
        if ($success) {
            return response()->json(['message' => 'Session extended']);
        }
        
        return response()->json(['error' => 'Session not found or already expired'], 404);
    }
}
```

4. **Route untuk fitur TTL:**
```php
// routes/api.php
use App\Http\Controllers\TemporarySessionController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/session', [TemporarySessionController::class, 'create']);
    Route::get('/session/{id}', [TemporarySessionController::class, 'get']);
    Route::put('/session/{id}/extend', [TemporarySessionController::class, 'extend']);
});
```

**Fitur TTL:**
- `GET /session/{id}` → `get()` - Dapatkan session sementara
- `POST /session` → `create()` - Buat session sementara
- `PUT /session/{id}/extend` → `extend()` - Perpanjang session sementara

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Redis 🧰

### 12. 🔐 Middleware di Service Redis (Penjaga Performa)

**Mengapa?** Terkadang semua interaksi dengan Redis butuh kontrol tambahan seperti rate limiting atau logging.

**Bagaimana?**
*   **Cara Modern (👍 Rekomendasi)**: Service class dengan logika Redis kompleks.
    ```php
    use App\Services\AdvancedRedisService;

    class CacheController extends Controller
    {
        public function __construct(
            protected AdvancedRedisService $redis
        ) {}

        public function getCachedData()
        {
            // Menggunakan service Redis yang aman dan terkontrol
            return $this->redis->getWithFallback('key', function() {
                return $this->getFromDatabase(); // Fallback ke database
            });
        }
    }
    ```

### 13. 💉 Dependency Injection (Asisten Pribadi Ajaib)

**Prinsipnya: Jangan buat sendiri, minta saja!** Butuh layanan Redis canggih? Tulis di parameter constructor atau method, dan Laravel akan memberikannya untukmu.

**Mengapa?** Ini membuat kodemu sangat fleksibel, mudah di-test, dan tidak terikat pada satu cara pembuatan objek.

**Bagaimana?**
*   **Service Injection**: Meminta "layanan Redis" yang akan digunakan di banyak method.
    ```php
    use App\Services\RedisCacheService;
    public function __construct(protected RedisCacheService $redisCache) {}
    ```

*   **Redis Facade Injection**: Meminta facade Redis langsung.
    ```php
    use Illuminate\Support\Facades\Redis;
    public function store(Request $request) { /* ... */ }
    ```

**Contoh Lengkap Dependency Injection:**

1. **Membuat Service Redis Canggih:**
```php
<?php
// app/Services/RedisCacheService.php

namespace App\Services;

use Illuminate\Support\Facades\Redis;
use Illuminate\Contracts\Cache\Repository as Cache;

class RedisCacheService
{
    public function __construct(
        protected Cache $cache
    ) {}

    public function getWithFallback(string $key, callable $fallback): mixed
    {
        $value = $this->cache->get($key);
        
        if (is_null($value)) {
            $value = $fallback();
            $this->cache->put($key, $value, now()->addMinutes(10));
        }
        
        return $value;
    }

    public function storeWithExpiry(string $key, mixed $value, int $minutes = 5): void
    {
        $this->cache->put($key, $value, now()->addMinutes($minutes));
    }

    public function incrementCounter(string $key, int $amount = 1): int
    {
        return $this->cache->increment($key, $amount);
    }

    public function storeObject(string $key, object $obj): void
    {
        $this->cache->put($key, serialize($obj), now()->addHours(1));
    }

    public function getObject(string $key): ?object
    {
        $serialized = $this->cache->get($key);
        return $serialized ? unserialize($serialized) : null;
    }
}
```

2. **Controller dengan Constructor Injection:**
```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\RedisCacheService;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;

class ProductController extends Controller
{
    // Constructor injection - service akan di-inject ke semua method
    public function __construct(
        protected RedisCacheService $redisCache
    ) {}

    public function index(): View
    {
        $products = $this->redisCache->getWithFallback('all_products', function() {
            return Product::with('category')->latest()->get();
        });
        
        return view('products.index', compact('products'));
    }

    public function show(string $id): View
    {
        $product = $this->redisCache->getWithFallback("product_{$id}", function() use ($id) {
            return Product::findOrFail($id);
        });
        
        // Increment counter untuk tracking
        $this->redisCache->incrementCounter("product_views_{$id}");
        
        return view('products.show', compact('product'));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
        ]);

        $product = Product::create($validated);
        
        // Hapus cache karena ada data baru
        $this->redisCache->storeWithExpiry("product_{$product->id}", $product, 60);
        $this->redisCache->storeWithExpiry('all_products', null); // Akan direbuild saat request berikutnya
        
        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());
        
        // Update cache
        $this->redisCache->storeWithExpiry("product_{$id}", $product, 60);
        
        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }
}
```

3. **Form Request Class (untuk validasi produk):**
```php
<?php
// app/Http/Requests/StoreProductRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Pastikan user bisa menyimpan produk
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk harus disediakan.',
            'price.required' => 'Harga produk harus disediakan.',
            'price.numeric' => 'Harga produk harus berupa angka.',
        ];
    }
}
```

Dependency Injection membuat kode kamu:
- **Lebih modular**: Setiap class punya tanggung jawab sendiri
- **Lebih mudah di-test**: Kamu bisa mock dependencies saat testing
- **Lebih fleksibel**: Mudah untuk mengganti implementasi service
- **Lebih bersih**: Controller tidak kotor dengan pembuatan objek manual

### 13.5 🏗️ Constructor dan Method Injection Detail

Ada beberapa pendekatan untuk dependency injection di controller:

**1. Constructor Injection dengan Visibility Modifiers:**
```php
class ProductController extends Controller
{
    // Protected akan membuat property bisa diakses dari class ini dan child class
    public function __construct(protected RedisCacheService $redisCache) {}
    
    // Atau bisa juga dengan property promotion lebih eksplisit:
    public function __construct(
        protected RedisCacheService $redisCache,
        protected AuthService $authService
    ) {}
}
```

**2. Method Injection untuk Request Spesifik:**
```php
public function store(StoreProductRequest $request) 
{
    // StoreProductRequest adalah kelas Form Request yang berisi aturan validasi
    $validated = $request->validated();
    // ...
}

public function update(Request $request, string $id) 
{
    // Request otomatis di-inject
}
```

### 14. 👮 Autorisasi (Kartu Akses Ajaib)

**Mengapa?** Untuk memastikan hanya orang yang berhak yang bisa mengakses atau mengubah data di Redis.

**Bagaimana?** Helper `authorize` ini seperti men-scan kartu akses. Laravel akan otomatis mengecek ke "sistem keamanan" (**Policy** class) apakah kartumu (user-mu) punya izin.

```php
public function update(Request $request, string $id)
{
    $this->authorize('updateRedisData', $id); // Pindai kartu akses!
    // Jika diizinkan, lanjutkan...
    
    Redis::set("user_data:{$id}", $request->data);
}
```

**Contoh Lengkap Otorisasi:**

1. **Buat Policy:**
```bash
php artisan make:policy RedisDataPolicy
```

2. **Isi Policy:**
```php
<?php
// app/Policies/RedisDataPolicy.php

namespace App\Policies;

use App\Models\User;

class RedisDataPolicy
{
    public function updateRedisData(User $user, string $key): bool
    {
        // Cek apakah key milik user ini atau apakah user admin
        $prefix = 'user_data:' . $user->id;
        return str_starts_with($key, $prefix) || $user->hasRole('admin');
    }
    
    public function deleteRedisData(User $user, string $key): bool
    {
        return str_starts_with($key, 'user_data:' . $user->id) || $user->hasRole('admin');
    }
}
```

3. **Gunakan di Controller:**
```php
class RedisDataController extends Controller
{
    public function update(Request $request, string $key)
    {
        $this->authorize('updateRedisData', $key);
        Redis::set($key, $request->data);
        
        return response()->json(['message' => 'Data updated successfully']);
    }
    
    public function destroy(string $key)
    {
        $this->authorize('deleteRedisData', $key);
        Redis::del($key);
        
        return response()->json(['message' => 'Data deleted successfully']);
    }
}
```

---

## Bagian 5: Menjadi Master Redis 🏆

### 15. ✨ Wejangan dari Guru

1.  **Gunakan Redis untuk Cache, Bukan Database**: Redis adalah cache/in-memory store, bukan pengganti database utama.
2.  **Atur TTL dengan Bijak**: Gunakan expiration time agar memory tidak penuh.
3.  **Pilih Tipe Data yang Tepat**: Gunakan string, hash, list, set, atau sorted set sesuai kebutuhan.
4.  **Gunakan Queue untuk Task Berat**: Pindahkan task berat ke queue agar aplikasi tetap cepat.
5.  **Monitor Penggunaan Memory**: Perhatikan penggunaan memory Redis agar tidak over limit.

### 16. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Redis di Laravel:

#### 📦 Tipe Data Redis
| Perintah | Fungsi |
|----------|--------|
| `Redis::set('key', 'value')` | Simpan string |
| `Redis::hset('hash', 'field', 'value')` | Simpan hash |
| `Redis::rpush('list', 'item')` | Tambah ke list (queue) |
| `Redis::sadd('set', 'item')` | Tambah ke set (unik) |
| `Redis::zadd('sortedset', 100, 'member')` | Tambah ke sorted set |

#### 🎯 Operasi Dasar
| Perintah | Fungsi |
|----------|--------|
| `Redis::get('key')` | Ambil string |
| `Redis::hgetall('hash')` | Ambil semua hash |
| `Redis::lrange('list', 0, -1)` | Ambil list |
| `Redis::smembers('set')` | Ambil semua set |
| `Redis::zrevrange('sortedset', 0, 9)` | Ambil top 10 sorted set |

#### 🔧 Cache Integration
| Perintah | Hasil |
|----------|--------|
| `Cache::put('key', $value, 60)` | Simpan ke Redis via Cache |
| `Cache::remember('key', 300, fn() => $data)` | Cache dengan fallback |
| `Cache::forget('key')` | Hapus dari cache |

#### 🌐 Queue & Pub/Sub
| Perintah | Fungsi |
|----------|--------|
| `Redis::lpush('queue', $job)` | Tambah ke queue |
| `Redis::brpop('queue', 10)` | Ambil dari queue (blocking) |
| `Redis::publish('channel', $message)` | Publish ke channel |
| `Redis::subscribe(['channel'], $callback)` | Subscribe ke channel |

#### 🚀 Performance & TTL
| Perintah | Fungsi |
|----------|--------|
| `Redis::expire('key', 300)` | Set TTL 5 menit |
| `Redis::setex('key', 300, 'value')` | Simpan dengan TTL |
| `Redis::ttl('key')` | Cek sisa waktu TTL |
| `Redis::pipeline()` | Eksekusi banyak command sekaligus |

#### 🔐 Konfigurasi
| Konfigurasi | Fungsi |
|----------|--------|
| `REDIS_CLIENT=phpredis` | Gunakan PhpRedis |
| `REDIS_DB=0` | Database Redis utama |
| `CACHE_DRIVER=redis` | Gunakan Redis sebagai cache |
| `QUEUE_CONNECTION=redis` | Gunakan Redis sebagai queue |

#### 🧰 Service dan Tools
| Tool | Fungsi |
|------|--------|
| `RedisCacheService` | Service untuk operasi Redis kompleks |
| `RedisRateLimiter` | Middleware untuk rate limiting |
| `TemporarySessionService` | Service untuk session sementara di Redis |

### 17. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Redis, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Ingat, Redis adalah mesin kecepatan dari aplikasi. Menguasainya berarti kamu sudah siap membangun aplikasi Laravel yang **super cepat**, **bertenaga tinggi**, dan **siap produksi**.

Jangan pernah berhenti belajar dan mencoba. Perlakukan Redis seperti asisten super cepat yang selalu siap membantu aplikasimu! Selamat ngoding, murid kesayanganku!



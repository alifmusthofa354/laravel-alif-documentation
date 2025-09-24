# 📘 Redis

## 🌟 Bab 1: Apa itu Redis dan Kapan Menggunakannya

**Redis** adalah *in-memory key-value store* yang cepat, cocok untuk data yang sering diakses. Redis menyimpan berbagai tipe data:

* **String** → data sederhana
* **Hash** → struktur mirip objek
* **List** → array/list
* **Set** → koleksi unik
* **Sorted Set** → list dengan skor (Leaderboard / ranking)

### 💡 Kapan Menggunakan Redis

Redis sangat berguna ketika:

1. **Caching** data agar aplikasi cepat
2. **Session Management** untuk user session
3. **Queue / Job Background**
4. **Leaderboard / Score Game**
5. **Rate Limiting**
6. **Pub/Sub Notifikasi real-time**

> Redis ideal untuk aplikasi yang membutuhkan **low latency** dan **high performance**.



## ⚙️ Bab 2: Instalasi Redis dengan Laravel

### 2.1 Instal Redis Server

* Linux/Mac: `sudo apt install redis-server`
* Windows: gunakan WSL atau Redis Windows

### 2.2 Instal PHP Redis Client

* **PhpRedis (direkomendasikan)**:

```bash
pecl install redis
```

* **Predis (alternatif pure PHP)**:

```bash
composer require predis/predis
```



## 🔧 Bab 3: Konfigurasi Redis di Laravel

`.env`:

```bash
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_CLIENT=phpredis
REDIS_DB=0
REDIS_CACHE_DB=1
```

`config/database.php`:

```php
'redis' => [
    'client' => env('REDIS_CLIENT', 'phpredis'),
    'default' => [
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'port' => env('REDIS_PORT', 6379),
        'database' => env('REDIS_DB', 0),
    ],
    'cache' => [
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'port' => env('REDIS_PORT', 6379),
        'database' => env('REDIS_CACHE_DB', 1),
    ],
],
```

> Redis dapat dijalankan di **server yang sama** atau **server terpisah**.



## 🏗️ Bab 4: Contoh Proyek Sederhana – Hitung Kunjungan Pengguna

### 4.1 Struktur Project

```
project-laravel/
│
├── app/Http/Controllers/VisitController.php
├── routes/web.php
├── resources/views/visits.blade.php
├── app/Console/Commands/RedisSubscribe.php
└── .env
```

Redis digunakan untuk:

* Menyimpan **jumlah kunjungan user**
* Menyimpan **total kunjungan**
* **Pub/Sub** notifikasi real-time



### 4.2 Controller

```php
<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Redis;
use Illuminate\Http\Request;

class VisitController extends Controller
{
    public function index()
    {
        $totalVisits = Redis::get('total_visits') ?? 0;
        $userVisits = Redis::get('user:1:visits') ?? 0;

        return view('visits', compact('totalVisits', 'userVisits'));
    }

    public function increment()
    {
        Redis::incr('user:1:visits');
        Redis::incr('total_visits');

        Redis::publish('visits-channel', json_encode([
            'user_id' => 1,
            'message' => 'User 1 melakukan kunjungan'
        ]));

        return redirect()->back();
    }
}
```



### 4.3 Route

```php
use App\Http\Controllers\VisitController;

Route::get('/visits', [VisitController::class, 'index']);
Route::get('/visits/increment', [VisitController::class, 'increment']);
```



### 4.4 View

`resources/views/visits.blade.php`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Redis Visits Example</title>
</head>
<body>
    <h1>Total Visits: {{ $totalVisits }}</h1>
    <h2>User 1 Visits: {{ $userVisits }}</h2>
    <a href="/visits/increment">Tambah Kunjungan User 1</a>
</body>
</html>
```



### 4.5 Subscriber Notifikasi

Buat Artisan Command:

```bash
php artisan make:command RedisSubscribe
```

`app/Console/Commands/RedisSubscribe.php`:

```php
<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class RedisSubscribe extends Command
{
    protected $signature = 'redis:subscribe';
    protected $description = 'Subscribe ke channel Redis';

    public function handle()
    {
        $this->info("Menunggu notifikasi Redis...");

        Redis::subscribe(['visits-channel'], function ($message) {
            $data = json_decode($message, true);
            $this->info("Notifikasi: User {$data['user_id']} - {$data['message']}");
        });
    }
}
```

Jalankan dengan:

```bash
php artisan redis:subscribe
```



## 📝 Bab 5: Dokumentasi Laravel Redis (Advanced)

Laravel menyediakan **Redis Facade** dengan fitur lengkap:

### 5.1 Menggunakan Multiple Connection

```php
$redisCache = Redis::connection('cache');
$redisDefault = Redis::connection();
```

### 5.2 Transaksi Redis (MULTI / EXEC)

```php
Redis::transaction(function ($redis) {
    $redis->incr('user_visits');
    $redis->incr('total_visits');
});
```

### 5.3 Pipelining (Batch Command)

```php
Redis::pipeline(function ($pipe) {
    for ($i = 0; $i < 100; $i++) {
        $pipe->set("key:$i", $i);
    }
});
```

### 5.4 Pub/Sub

```php
// Subscribe
Redis::subscribe(['channel'], function ($message) {
    echo $message;
});

// Publish
Redis::publish('channel', json_encode(['message'=>'Hello']));
```

### 5.5 Lua Scripts

```php
$value = Redis::eval(<<<'LUA'
local count = redis.call("incr", KEYS[1])
if count > 5 then
    redis.call("incr", KEYS[2])
end
return count
LUA, 2, 'counter1', 'counter2');
```



## 🚀 Bab 6: Tips Advanced / Expert

1. **Gunakan Redis untuk cache** sebelum query database → kurangi load DB
2. **Gunakan Sorted Set untuk leaderboard / ranking**
3. **Gunakan Pub/Sub untuk notifikasi real-time / messaging**
4. **Gunakan transaksi / Lua scripting untuk operasi atomik**
5. **Gunakan pipelining untuk batch command → kurangi request ke server**
6. **Pertimbangkan cluster Redis** jika aplikasi scale tinggi



Dengan dokumen ini, kamu bisa belajar dari **dasar** sampai **advanced/ expert**, dan langsung mempraktekkan **Redis dengan Laravel** di proyek nyata.



# ⚡ Laravel Octane

Laravel Octane mempercepat aplikasi Laravel Anda dengan melayani aplikasi Anda menggunakan server aplikasi berbasis RoadRunner atau Swoole yang kaya akan fitur. Oleh karena itu, Octane sangat meningkatkan kinerja aplikasi Anda dan jumlah permintaan yang dapat ditangani per detik (TPS).

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Konfigurasi Server](#konfigurasi-server)
4. [Menjalankan Aplikasi](#menjalankan-aplikasi)
5. [Dependencies yang Kompatibel](#dependencies-yang-kompatibel)
6. [Konfigurasi Aplikasi](#konfigurasi-aplikasi)
7. [Optimasi Performa](#optimasi-performa)
8. [Monitoring](#monitoring)
9. [Pengujian](#pengujian)
10. [Troubleshooting](#troubleshooting)

## 🎯 Pendahuluan

Laravel Octane meningkatkan performa aplikasi Laravel Anda dengan melayani aplikasi menggunakan server aplikasi berbasis Swoole, RoadRunner, atau OpenSwoole. Ini secara dramatis meningkatkan kinerja aplikasi Anda dan jumlah permintaan yang dapat ditangani per detik dibandingkan dengan server web tradisional.

### ✨ Fitur Utama
- Server aplikasi berbasis Swoole/RoadRunner/OpenSwoole
- Performa yang sangat tinggi
- Manajemen memori yang efisien
- Hot reloading
- WebSocket support
- Task queue processing
- Monitoring real-time
- Graceful shutdown

### ⚠️ Prasyarat
Sebelum menggunakan Octane, Anda harus memastikan bahwa lingkungan pengembangan dan produksi Anda kompatibel dengan teknologi server yang akan Anda gunakan (Swoole, RoadRunner, atau OpenSwoole).

## 📦 Instalasi

### 🎯 Menginstal Octane
Untuk memulai, instal Octane melalui Composer:

```bash
composer require laravel/octane
```

Setelah menginstal Octane, Anda dapat menjalankan perintah `octane:install` untuk menginstal file konfigurasi Octane ke dalam aplikasi Anda:

```bash
php artisan octane:install
```

### 🛠️ Menginstal Server
Octane saat ini mendukung tiga server aplikasi, yaitu RoadRunner, Swoole, dan OpenSwoole. Silakan lihat dokumentasi resmi server aplikasi pilihan Anda untuk instruksi instalasi:

#### 🚀 RoadRunner
RoadRunner dapat diinstal melalui package manager Composer:

```bash
composer require spiral/roadrunner-cli
```

#### 🔥 Swoole
Swoole dapat diinstal melalui PECL:

```bash
pecl install swoole
```

#### 🔥 OpenSwoole
OpenSwoole dapat diinstal melalui PECL:

```bash
pecl install openswoole
```

## ⚙️ Konfigurasi Server

### 📄 File Konfigurasi
File konfigurasi Octane utama terletak di `config/octane.php`. File ini memungkinkan Anda mengkonfigurasi berbagai aspek server Octane Anda.

### 📋 Konfigurasi Dasar
```php
<?php

return [
    'server' => env('OCTANE_SERVER', 'roadrunner'),

    'listen' => [
        '127.0.0.1:8000',
        '[::1]:8000',
    ],

    'workers' => env('OCTANE_WORKERS', 0),

    'task_workers' => env('OCTANE_TASK_WORKERS', 0),

    'max_requests' => env('OCTANE_MAX_REQUESTS', 500),

    'warm' => [
        // Daftar file yang dipanaskan saat startup
    ],
];
```

### 📋 Konfigurasi Server Spesifik
```php
'swoole' => [
    'options' => [
        'worker_num' => env('OCTANE_SWOOLE_WORKER_NUM', 8),
        'task_worker_num' => env('OCTANE_SWOOLE_TASK_WORKER_NUM', 4),
        'enable_coroutine' => true,
        'max_request' => env('OCTANE_SWOOLE_MAX_REQUEST', 1000),
        'http_compression' => true,
        'http_compression_level' => 6,
        'package_max_length' => 20 * 1024 * 1024,
        'buffer_output_size' => 10 * 1024 * 1024,
        'socket_buffer_size' => 128 * 1024 * 1024,
    ],
],

'roadrunner' => [
    'host' => '127.0.0.1',
    'port' => 8000,
    'rpc_host' => '127.0.0.1',
    'rpc_port' => 6001,
    'max_jobs' => 500,
],
```

## ▶️ Menjalankan Aplikasi

### 🚀 Menjalankan Octane
Anda dapat memulai server Octane menggunakan perintah `octane:start`:

```bash
php artisan octane:start
```

Secara default, perintah ini akan memulai server menggunakan driver yang dikonfigurasi dalam file konfigurasi `octane` Anda. Namun, Anda dapat menentukan driver yang akan digunakan melalui opsi `--server`:

```bash
php artisan octane:start --server=swoole
php artisan octane:start --server=roadrunner
```

### 📋 Opsi Server
```bash
# Menentukan host dan port
php artisan octane:start --host=127.0.0.1 --port=8000

# Menentukan jumlah worker
php artisan octane:start --workers=8

# Menentukan jumlah task worker
php artisan octane:start --task-workers=4

# Menentukan jumlah maksimum permintaan sebelum restart worker
php artisan octane:start --max-requests=500

# Mengaktifkan hot reload
php artisan octane:start --watch

# Menjalankan dalam mode debug
php artisan octane:start --debug
```

### 🛑 Menghentikan Server
Anda dapat menghentikan server menggunakan perintah `octane:stop`:

```bash
php artisan octane:stop
```

### 🔄 Merestart Server
Anda dapat merestart server menggunakan perintah `octane:reload`:

```bash
php artisan octane:reload
```

## 🔧 Dependencies yang Kompatibel

### 📋 Dependencies yang Tidak Kompatibel
Karena Octane memulai aplikasi Anda sekali dan menjaga aplikasi tetap dalam memori, beberapa dependencies yang dikembangkan untuk request-response cycle tradisional mungkin tidak berfungsi sebagaimana dimaksud. Misalnya, sebagian besar packages debugging tidak akan berfungsi sebagaimana dimaksud ketika Octane aktif.

#### 🚫 Packages yang Tidak Kompatibel
- barryvdh/laravel-debugbar
- barryvdh/laravel-ide-helper (jika tidak dimatikan dalam produksi)
- filp/whoops
- nunomaduro/collision (dalam produksi)

### 🛠️ Mengatasi Dependencies yang Tidak Kompatibel
```php
// app/Providers/AppServiceProvider.php
public function register()
{
    if ($this->app->environment('local', 'testing') && ! $this->app->runningInConsole()) {
        $this->app->register(\Barryvdh\Debugbar\ServiceProvider::class);
    }
}
```

## ⚙️ Konfigurasi Aplikasi

### 📋 Session Configuration
Ketika menggunakan Octane, session harus disimpan dalam cache:

```env
SESSION_DRIVER=cache
CACHE_DRIVER=redis
```

### 📋 Queue Configuration
Ketika menggunakan Redis queue driver, Anda harus menjalankan queue worker melalui perintah `queue:listen` atau menggunakan task workers Octane:

```bash
php artisan queue:listen
# atau
php artisan octane:start --task-workers=4
```

### 📋 Event Broadcasting
Event broadcasting bekerja dengan baik dengan Octane ketika menggunakan Redis broadcaster:

```env
BROADCAST_DRIVER=redis
```

## 🚀 Optimasi Performa

### 📋 Memanaskan Cache
Untuk mempercepat startup aplikasi, Anda dapat memanaskan cache file yang sering digunakan:

```php
'warm' => [
    base_path('vendor/composer/files.php'),
    base_path('app/Models/User.php'),
    base_path('app/Http/Controllers/HomeController.php'),
],
```

### 📋 Menghindari Global State
Karena Octane menjaga aplikasi dalam memori antar permintaan, Anda harus menghindari penggunaan global state:

```php
// ❌ Tidak disarankan
$_SERVER['last_request_time'] = time();

// ✅ Disarankan
app()->instance('last_request_time', time());
```

### 📋 Menggunakan Static Properties dengan Bijak
```php
class Service
{
    // ❌ Tidak disarankan
    public static $data = [];

    // ✅ Disarankan
    public function getData()
    {
        return app('service.data', []);
    }
}
```

### 📋 File Watching
Untuk pengembangan, Anda dapat mengaktifkan file watching:

```bash
php artisan octane:start --watch
```

## 📊 Monitoring

### 📋 Dashboard Monitoring
Octane menyediakan dashboard monitoring untuk melihat performa aplikasi:

```bash
php artisan octane:status
```

### 📋 Logging
Logging bekerja sebagaimana dimaksud dengan Octane:

```php
Log::info('User logged in', ['user_id' => $user->id]);
```

### 📋 Metrics
Anda dapat mengakses metrics melalui facade:

```php
use Laravel\Octane\Facades\Octane;

$metrics = Octane::metrics();
```

## 🧪 Pengujian

### 📋 Pengujian dengan PHPUnit
Pengujian dengan PHPUnit bekerja sebagaimana dimaksud:

```php
public function test_example()
{
    $response = $this->get('/');
    
    $response->assertStatus(200);
}
```

### 📋 Pengujian dengan Pest
Pengujian dengan Pest juga didukung:

```php
it('returns a successful response', function () {
    $response = $this->get('/');
    
    $response->assertStatus(200);
});
```

### 📋 Testing Stateful Behavior
Untuk menguji perilaku stateful, Anda mungkin perlu me-reset state antar test:

```php
protected function tearDown(): void
{
    parent::tearDown();
    
    // Reset state spesifik aplikasi
    app()->forgetInstance('some.state');
}
```

## 🔧 Troubleshooting

### 📋 Common Issues

#### 🔄 Memory Leaks
Memory leaks dapat terjadi jika aplikasi tidak membersihkan state dengan benar:

```php
// Bersihkan state di akhir setiap request
public function terminate($request, $response)
{
    // Bersihkan state aplikasi
    app()->forgetInstance('some.state');
}
```

#### 🔄 Global State Issues
Global state dapat menyebabkan perilaku yang tidak terduga:

```php
// Gunakan container daripada global state
// ❌ Tidak disarankan
$GLOBALS['data'] = $value;

// ✅ Disarankan
app()->instance('my.data', $value);
```

#### 🔄 Dependency Conflicts
Beberapa dependencies mungkin tidak kompatibel:

```bash
# Nonaktifkan dependencies debugging dalam produksi
APP_ENV=production
APP_DEBUG=false
```

### 📋 Debugging

#### 📋 Debugging Tools
Gunakan tools debugging yang kompatibel dengan Octane:

```php
// Gunakan logger daripada var_dump atau dd
Log::debug('Debug information', ['data' => $data]);
```

#### 📋 Error Handling
Error handling bekerja sebagaimana dimaksud:

```php
try {
    // Kode yang mungkin error
} catch (\Exception $e) {
    Log::error($e->getMessage());
    // Tangani error
}
```

## 🧠 Kesimpulan

Laravel Octane menyediakan cara yang kuat untuk meningkatkan performa aplikasi Laravel Anda dengan menggunakan server aplikasi berbasis Swoole, RoadRunner, atau OpenSwoole. Dengan Octane, Anda dapat melayani lebih banyak permintaan per detik dengan latency yang lebih rendah.

### 🔑 Keuntungan Utama
- Performa yang sangat tinggi
- Manajemen memori yang efisien
- Hot reloading untuk pengembangan
- WebSocket support
- Task queue processing
- Monitoring real-time
- Graceful shutdown

### ⚠️ Considerations
- Membutuhkan konfigurasi server yang tepat
- Tidak semua packages kompatibel
- Membutuhkan perhatian khusus terhadap global state
- Memerlukan pemahaman tentang aplikasi stateful

### 🚀 Best Practices
1. Gunakan cache drivers yang kompatibel
2. Hindari global state
3. Bersihkan state aplikasi dengan benar
4. Uji aplikasi secara menyeluruh sebelum produksi
5. Monitor performa aplikasi secara berkala
6. Gunakan dependencies yang kompatibel dengan Octane
7. Optimalkan konfigurasi server sesuai kebutuhan

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Octane untuk meningkatkan performa aplikasi Laravel Anda.
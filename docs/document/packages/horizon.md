# ⚡ Laravel Horizon

Laravel Horizon menyediakan dashboard yang indah dan konfigurasi berbasis kode untuk queue worker Redis yang dikirimkan dengan Laravel. Horizon memungkinkan Anda dengan mudah memantau metrik kunci sistem queue Anda seperti throughput job, waktu runtime, dan kegagalan job.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [Dashboard](#dashboard)
5. [Supervisors](#supervisors)
6. [Metrik](#metrik)
7. [Notifikasi](#notifikasi)
8. [Tag](#tag)
9. [Policies](#policies)
10. [High Availability](#high-availability)

## 🎯 Pendahuluan

Laravel Horizon adalah dashboard dan konfigurasi untuk queue worker Redis Laravel. Horizon menyediakan antarmuka yang indah untuk memantau metrik sistem queue Anda dan mengelola worker Anda.

### ✨ Fitur Utama
- Dashboard yang indah untuk memantau queue
- Konfigurasi berbasis kode untuk worker
- Metrik real-time untuk throughput dan performa
- Notifikasi untuk kegagalan job
- Tagging untuk job
- Supervisor otomatis
- High availability support

### ⚠️ Prasyarat
Sebelum menggunakan Horizon, Anda harus memastikan bahwa aplikasi Anda menggunakan driver queue `redis` dalam file konfigurasi queue Anda (`config/queue.php`).

## 📦 Instalasi

### 🎯 Menginstal Horizon
Untuk memulai, instal Horizon melalui Composer:

```bash
composer require laravel/horizon
```

Setelah menginstal Horizon, publikasikan asetnya menggunakan perintah `horizon:install`:

```bash
php artisan horizon:install
```

### 🛠️ Konfigurasi Environment
Pastikan file `.env` Anda mengkonfigurasi driver queue ke `redis`:

```bash
QUEUE_CONNECTION=redis
```

### 🔧 Migrasi Database (Opsional)
Jika Anda berencana menggunakan fitur notifikasi Horizon, jalankan migrasi database:

```bash
php artisan migrate
```

### 🔄 Publish Configuration
Untuk mempublish file konfigurasi Horizon, gunakan perintah berikut:

```bash
php artisan vendor:publish --provider="Laravel\Horizon\HorizonServiceProvider"
```

## ⚙️ Konfigurasi

### 📄 File Konfigurasi
File konfigurasi Horizon utama terletak di `config/horizon.php`. File ini memungkinkan Anda mengkonfigurasi opsi supervisor worker Anda.

### 📋 Konfigurasi Dasar
```php
<?php

return [
    'domain' => null,
    'path' => 'horizon',
    'use' => 'default',
    'prefix' => env('HORIZON_PREFIX', 'horizon:'),
    'middleware' => ['web'],
    'waits' => [
        'redis:default' => 60,
    ],
    'trim' => [
        'recent' => 60,
        'pending' => 60,
        'completed' => 60,
        'recent_failed' => 10080,
        'failed' => 10080,
        'monitored' => 10080,
    ],
];
```

### 📋 Konfigurasi Supervisor
```php
'environments' => [
    'production' => [
        'supervisor-1' => [
            'connection' => 'redis',
            'queue' => ['default'],
            'balance' => 'auto',
            'processes' => 10,
            'tries' => 3,
        ],
    ],

    'local' => [
        'supervisor-1' => [
            'connection' => 'redis',
            'queue' => ['default'],
            'balance' => 'auto',
            'processes' => 3,
            'tries' => 3,
        ],
    ],
],
```

## 🎨 Dashboard

### 🚀 Mengakses Dashboard
Setelah mengkonfigurasi Horizon, Anda dapat mengakses dashboard di route `/horizon`:

```
http://your-app.test/horizon
```

### 🔐 Melindungi Dashboard
Secara default, Anda hanya dapat mengakses dashboard di lingkungan `local`. Untuk mengkonfigurasi akses di lingkungan lain, Anda harus menentukan gate dalam metode `boot` dari `AppServiceProvider` Anda:

```php
use Laravel\Horizon\Horizon;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Horizon::auth(function ($request) {
        // Return true if user is authorized to view Horizon...
        return auth()->check() && auth()->user()->hasRole('admin');
    });
}
```

### 📊 Informasi Dashboard
Dashboard Horizon menampilkan informasi berikut:
- Ringkasan sistem
- Metrik throughput
- Job yang sedang berjalan
- Job yang gagal
- Job yang terpantau
- Supervisor dan worker

## 👥 Supervisors

### 📋 Konfigurasi Supervisor
Supervisor adalah proses yang mengawasi worker Horizon dan memastikan mereka tetap berjalan:

```php
'environments' => [
    'production' => [
        'supervisor-1' => [
            'connection' => 'redis',
            'queue' => ['default', 'emails', 'notifications'],
            'balance' => 'auto',
            'minProcesses' => 2,
            'maxProcesses' => 10,
            'balanceMaxShift' => 1,
            'balanceCooldown' => 3,
            'tries' => 3,
            'timeout' => 60,
        ],
    ],
],
```

### 📋 Balance Strategies
Horizon menyediakan tiga strategi balancing:
- `auto` - Menyesuaikan jumlah worker berdasarkan workload
- `simple` - Mengalokasikan worker secara merata
- `false` - Tidak melakukan balancing

### 📋 Supervisor Options
```php
'supervisor-1' => [
    'connection' => 'redis',
    'queue' => ['default'],
    'balance' => 'auto',
    'minProcesses' => 1,
    'maxProcesses' => 10,
    'balanceMaxShift' => 1,
    'balanceCooldown' => 3,
    'tries' => 3,
    'timeout' => 60,
    'sleep' => 3,
    'maxTries' => 3,
    'force' => false,
],
```

## 📊 Metrik

### 📈 Metrik Real-time
Horizon menyediakan metrik real-time untuk:

#### 🔢 Throughput Metrics
- Jobs per minute
- Jobs per hour
- Jobs per day

#### ⏱️ Runtime Metrics
- Average job runtime
- Slowest job runtime
- Fastest job runtime

#### ❌ Failure Metrics
- Failed jobs count
- Failure rate
- Recent failures

### 📋 Custom Metrics
Anda dapat mencatat metrik kustom menggunakan facade Horizon:

```php
use Laravel\Horizon\Horizon;

Horizon::recordMeasure('orders', 1);
```

## 📢 Notifikasi

### 📋 Konfigurasi Notifikasi
Horizon dapat mengirim notifikasi ketika job gagal:

```php
// app/Providers/HorizonServiceProvider.php
use Laravel\Horizon\Horizon;

public function boot()
{
    parent::boot();

    Horizon::routeMailNotificationsTo('example@example.com');
    Horizon::routeSlackNotificationsTo('slack-webhook-url', '#channel');
    Horizon::routeTelegramNotificationsTo('telegram-bot-token', 'telegram-chat-id');
}
```

### 📋 Customizing Notifications
Anda dapat mempublish dan mengkostumisasi notifikasi Horizon:

```bash
php artisan vendor:publish --tag=horizon-notifications
```

## 🏷️ Tag

### 📋 Menambahkan Tag ke Job
Tag memungkinkan Anda mengelompokkan job untuk pemantauan yang lebih mudah:

```php
use Illuminate\Queue\InteractsWithQueue;

class ProcessPodcast implements ShouldQueue
{
    use InteractsWithQueue;

    public function tags()
    {
        return ['podcast:'.$this->podcast->id];
    }
}
```

### 📋 Menambahkan Tag Dinamis
```php
public function tags()
{
    return [
        'podcast:'.$this->podcast->id,
        'user:'.$this->user->id,
        'priority:'.$this->priority,
    ];
}
```

### 📋 Mencari Berdasarkan Tag
Anda dapat mencari job berdasarkan tag di dashboard Horizon.

## 🔐 Policies

### 📋 Authorization Policies
Anda dapat menentukan siapa yang dapat mengakses Horizon menggunakan gate:

```php
use Laravel\Horizon\Horizon;

Horizon::auth(function ($request) {
    return auth()->check() && $request->user()->can('viewHorizon');
});
```

### 📋 Model Policies
```php
// app/Policies/UserPolicy.php
public function viewHorizon(User $user)
{
    return $user->hasRole('admin');
}
```

## 🔄 High Availability

### 📋 Menjalankan Multiple Master
Untuk high availability, Anda dapat menjalankan multiple instance Horizon master:

```bash
php artisan horizon --environment=production
```

### 📋 Load Balancing
Horizon secara otomatis menyeimbangkan beban antara supervisor yang berbeda.

### 📋 Failover
Jika satu instance master gagal, instance lain akan mengambil alih.

## ▶️ Menjalankan Horizon

### 🚀 Memulai Horizon
Untuk memulai Horizon, jalankan perintah artisan `horizon`:

```bash
php artisan horizon
```

### 🛑 Menghentikan Horizon
Anda dapat menghentikan Horizon dengan aman menggunakan perintah `horizon:terminate`:

```bash
php artisan horizon:terminate
```

### 🔄 Restarting Horizon
Untuk merestart Horizon, gunakan perintah `horizon:terminate` diikuti dengan `horizon`:

```bash
php artisan horizon:terminate
php artisan horizon
```

### 📋 Menggunakan Supervisor (System Process Monitor)
Untuk memastikan Horizon selalu berjalan, gunakan supervisor system process monitor:

```ini
[program:horizon]
process_name=%(program_name)s
command=php /home/forge/app.com/artisan horizon
autostart=true
autorestart=true
user=forge
redirect_stderr=true
stdout_logfile=/home/forge/app.com/horizon.log
stopwaitsecs=3600
```

## 🧠 Kesimpulan

Laravel Horizon menyediakan cara yang kuat dan elegan untuk mengelola queue worker Redis dalam aplikasi Laravel Anda. Dengan dashboard yang indah dan konfigurasi berbasis kode, Horizon memungkinkan Anda memantau dan mengoptimalkan sistem queue Anda dengan mudah.

### 🔑 Keuntungan Utama
- Dashboard yang indah untuk memantau queue
- Konfigurasi berbasis kode yang fleksibel
- Metrik real-time untuk performa
- Notifikasi untuk kegagalan job
- Tagging untuk organisasi job
- Supervisor otomatis
- Dukungan high availability
- Integrasi dengan berbagai platform notifikasi

### 🚀 Best Practices
1. Gunakan supervisor system untuk menjaga Horizon tetap berjalan
2. Konfigurasi supervisor berdasarkan kebutuhan lingkungan
3. Gunakan tagging untuk organisasi job yang lebih baik
4. Monitor metrik untuk mengoptimalkan performa
5. Konfigurasi notifikasi untuk kegagalan job
6. Gunakan gate untuk melindungi akses dashboard
7. Restart Horizon setelah deployment
8. Monitor log untuk troubleshooting

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Horizon untuk mengelola queue worker dalam aplikasi Laravel Anda.
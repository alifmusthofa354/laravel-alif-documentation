# 🔴 Laravel Pulse

Laravel Pulse adalah dashboard aplikasi yang indah dan mudah untuk memahami kinerja aplikasi Anda secara real-time. Pulse mengumpulkan dan menampilkan metrik penting seperti request throughput, latensi, penggunaan memory, dan error rates dari aplikasi Laravel Anda.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [Recorder](#recorder)
5. [Cards](#cards)
6. [Dashboard](#dashboard)
7. [Custom Cards](#custom-cards)
8. [Performance](#performance)
9. [Monitoring](#monitoring)
10. [Alerts](#alerts)
11. [Exporting Data](#exporting-data)
12. [Troubleshooting](#troubleshooting)

## 🎯 Pendahuluan

Laravel Pulse adalah tool monitoring real-time yang memungkinkan Anda untuk memahami kinerja aplikasi Laravel Anda secara langsung. Pulse mengumpulkan dan menampilkan metrik penting seperti request throughput, latensi, penggunaan memory, dan error rates.

### ✨ Fitur Utama
- Dashboard real-time yang indah
- Pengumpulan metrik otomatis
- Recorder yang dapat dikustomisasi
- Cards untuk berbagai metrik
- Alert system
- Export data
- Performance monitoring
- Integrasi dengan Laravel Horizon
- Support untuk multiple server

### ⚠️ Catatan Penting
Pulse memerlukan Redis untuk menyimpan dan mengambil metrik. Pastikan Redis telah dikonfigurasi dengan benar dalam aplikasi Anda.

## 📦 Instalasi

### 🎯 Menginstal Pulse
Untuk memulai, instal Pulse melalui Composer:

```bash
composer require laravel/pulse
```

### 🛠️ Publish Resources
Publikasikan file konfigurasi dan migrasi Pulse menggunakan perintah vendor:

```bash
php artisan vendor:publish --provider="Laravel\Pulse\PulseServiceProvider"
```

### 🔧 Run Migrations
Pulse menyertakan migrasi database untuk menyimpan metrik. Jalankan migrasi:

```bash
php artisan migrate
```

### 🔄 Install Pulse Dashboard
Untuk menginstal dashboard Pulse, jalankan perintah berikut:

```bash
php artisan pulse:install
```

## ⚙️ Konfigurasi

### 📄 File Konfigurasi
File konfigurasi utama terletak di `config/pulse.php`. File ini memungkinkan Anda mengkonfigurasi berbagai aspek Pulse.

### 📋 Konfigurasi Dasar
```php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Pulse Domain
    |--------------------------------------------------------------------------
    |
    | This is the domain that the Pulse dashboard will be accessible from.
    |
    */

    'domain' => env('PULSE_DOMAIN'),

    /*
    |--------------------------------------------------------------------------
    | Pulse Path
    |--------------------------------------------------------------------------
    |
    | This is the path that the Pulse dashboard will be accessible from.
    |
    */

    'path' => env('PULSE_PATH', 'pulse'),

    /*
    |--------------------------------------------------------------------------
    | Pulse Middleware
    |--------------------------------------------------------------------------
    |
    | These middleware will be assigned to every Pulse route.
    |
    */

    'middleware' => [
        'web',
        Laravel\Pulse\Http\Middleware\Authorize::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Pulse Storage Driver
    |--------------------------------------------------------------------------
    |
    | This is the storage driver that will be used to store Pulse data.
    |
    */

    'storage' => [
        'driver' => env('PULSE_STORAGE_DRIVER', 'database'),

        'database' => [
            'connection' => env('PULSE_DB_CONNECTION', null),
            'chunk' => 1000,
        ],
    ],
];
```

### 🔐 Konfigurasi Environment
Tambahkan konfigurasi berikut ke file `.env` Anda:

```env
PULSE_DOMAIN=null
PULSE_PATH=pulse
PULSE_STORAGE_DRIVER=database
```

### 🔐 Mengamankan Dashboard
Untuk mengamankan dashboard Pulse, Anda dapat memodifikasi middleware dalam file konfigurasi:

```php
'middleware' => [
    'web',
    'auth',
    Laravel\Pulse\Http\Middleware\Authorize::class,
],
```

Atau Anda dapat menentukan gate dalam metode `boot` dari `AppServiceProvider` Anda:

```php
use Laravel\Pulse\Pulse;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Pulse::auth(function ($request) {
        return $request->user()->isAdmin();
    });
}
```

## 📼 Recorder

### 📋 Recorder Dasar
Recorder adalah komponen yang bertanggung jawab untuk mengumpulkan metrik dari aplikasi Anda. Pulse menyertakan beberapa recorder bawaan:

```php
'recorders' => [
    Laravel\Pulse\Recorders\SlowJobs::class => [
        'enabled' => env('PULSE_SLOW_JOBS_ENABLED', true),
        'threshold' => env('PULSE_SLOW_JOBS_THRESHOLD', 1000),
        'sample_rate' => env('PULSE_SLOW_JOBS_SAMPLE_RATE', 1),
    ],

    Laravel\Pulse\Recorders\SlowOutgoingRequests::class => [
        'enabled' => env('PULSE_SLOW_OUTGOING_REQUESTS_ENABLED', true),
        'threshold' => env('PULSE_SLOW_OUTGOING_REQUESTS_THRESHOLD', 1000),
        'sample_rate' => env('PULSE_SLOW_OUTGOING_REQUESTS_SAMPLE_RATE', 1),
        'ignore' => [
            // 'example.com',
        ],
    ],

    Laravel\Pulse\Recorders\SlowQueries::class => [
        'enabled' => env('PULSE_SLOW_QUERIES_ENABLED', true),
        'threshold' => env('PULSE_SLOW_QUERIES_THRESHOLD', 1000),
        'sample_rate' => env('PULSE_SLOW_QUERIES_SAMPLE_RATE', 1),
        'location' => env('PULSE_SLOW_QUERIES_LOCATION', true),
    ],

    Laravel\Pulse\Recorders\SlowRequests::class => [
        'enabled' => env('PULSE_SLOW_REQUESTS_ENABLED', true),
        'threshold' => env('PULSE_SLOW_REQUESTS_THRESHOLD', 1000),
        'sample_rate' => env('PULSE_SLOW_REQUESTS_SAMPLE_RATE', 1),
    ],

    Laravel\Pulse\Recorders\UserJobs::class => [
        'enabled' => env('PULSE_USER_JOBS_ENABLED', true),
        'sample_rate' => env('PULSE_USER_JOBS_SAMPLE_RATE', 1),
    ],

    Laravel\Pulse\Recorders\UserRequests::class => [
        'enabled' => env('PULSE_USER_REQUESTS_ENABLED', true),
        'sample_rate' => env('PULSE_USER_REQUESTS_SAMPLE_RATE', 1),
    ],
],
```

### 📋 Mengaktifkan dan Menonaktifkan Recorder
Anda dapat mengaktifkan atau menonaktifkan recorder tertentu dengan mengubah konfigurasi:

```php
'recorders' => [
    Laravel\Pulse\Recorders\SlowRequests::class => [
        'enabled' => false, // Menonaktifkan recorder
    ],
    
    Laravel\Pulse\Recorders\SlowQueries::class => [
        'enabled' => true, // Mengaktifkan recorder
        'threshold' => 500, // Mengatur threshold
    ],
],
```

### 📋 Sample Rate
Sample rate memungkinkan Anda untuk mengontrol berapa banyak metrik yang dikumpulkan:

```php
'recorders' => [
    Laravel\Pulse\Recorders\SlowRequests::class => [
        'enabled' => true,
        'threshold' => 1000,
        'sample_rate' => 0.1, // Hanya 10% dari request yang akan dicatat
    ],
],
```

## 🃏 Cards

### 📋 Cards Dasar
Cards adalah komponen visual yang menampilkan metrik dalam dashboard Pulse. Pulse menyertakan beberapa card bawaan:

#### 🚀 Slow Requests Card
```php
use Laravel\Pulse\Facades\Pulse;

// Menampilkan slow requests dalam dashboard
```

#### 📊 Performance Card
Card ini menampilkan metrik kinerja seperti throughput dan latensi.

#### 💾 Memory Card
Card ini menampilkan penggunaan memory aplikasi.

#### ❌ Exceptions Card
Card ini menampilkan error dan exception yang terjadi.

#### 📈 Usage Card
Card ini menampilkan penggunaan resource sistem.

### 📋 Mengkustomisasi Cards
Anda dapat mengkustomisasi card dalam file konfigurasi:

```php
'cards' => [
    Laravel\Pulse\Cards\SlowQueries::class => [
        'limit' => 10,
    ],
    
    Laravel\Pulse\Cards\Exceptions::class => [
        'limit' => 5,
    ],
],
```

## 🎨 Dashboard

### 📋 Mengakses Dashboard
Setelah mengkonfigurasi Pulse, Anda dapat mengakses dashboard di route `/pulse`:

```
http://your-app.test/pulse
```

### 📋 Dashboard Components
Dashboard Pulse terdiri dari beberapa komponen:

1. **Header** - Menampilkan informasi aplikasi dan navigasi
2. **Sidebar** - Menu navigasi antar card
3. **Main Content** - Area utama untuk menampilkan card
4. **Footer** - Informasi copyright dan versi

### 📋 Real-time Updates
Dashboard Pulse secara otomatis memperbarui metrik secara real-time tanpa perlu refresh halaman.

### 📋 Time Range Selection
Pengguna dapat memilih rentang waktu untuk melihat metrik historis.

## 🛠️ Custom Cards

### 📋 Membuat Custom Card
Untuk membuat custom card, Anda perlu membuat class card baru:

```bash
php artisan make:pulse-card CustomMetricCard
```

### 📋 Struktur Card Dasar
```php
<?php

namespace App\Pulse\Cards;

use Laravel\Pulse\Facades\Pulse;
use Laravel\Pulse\Card;

class CustomMetricCard extends Card
{
    /**
     * Render the card.
     */
    public function render(): string
    {
        $metrics = Pulse::get('custom-metric', ['count']);

        return view('pulse.cards.custom-metric', [
            'metrics' => $metrics,
        ])->render();
    }
}
```

### 📋 View untuk Card
```blade
<!-- resources/views/pulse/cards/custom-metric.blade.php -->
<div class="pulse-card">
    <h3>Custom Metric</h3>
    <div class="metric-value">
        {{ $metrics['count'] ?? 0 }}
    </div>
</div>
```

### 📋 Mendaftarkan Custom Card
Tambahkan custom card ke file konfigurasi:

```php
'cards' => [
    App\Pulse\Cards\CustomMetricCard::class => [
        // Konfigurasi card
    ],
],
```

## ⚡ Performance

### 📋 Optimasi Performance
Pulse dirancang untuk memiliki dampak minimal terhadap performa aplikasi Anda:

1. **Sampling** - Gunakan sample rate untuk mengurangi beban
2. **Batching** - Pulse secara otomatis mengumpulkan metrik dalam batch
3. **Async Processing** - Metrik diproses secara asynchronous
4. **Efficient Storage** - Penggunaan storage yang efisien

### 📋 Konfigurasi Performance
```php
'storage' => [
    'driver' => env('PULSE_STORAGE_DRIVER', 'database'),
    
    'database' => [
        'connection' => env('PULSE_DB_CONNECTION', null),
        'chunk' => 1000, // Ukuran batch untuk insert
    ],
],

'recorders' => [
    Laravel\Pulse\Recorders\SlowRequests::class => [
        'sample_rate' => 0.1, // Hanya 10% dari request yang dicatat
    ],
],
```

### 📋 Monitoring Resource Usage
Monitor penggunaan resource Pulse dengan:

```bash
php artisan pulse:check
```

## 🔍 Monitoring

### 📋 Real-time Monitoring
Pulse menyediakan monitoring real-time untuk:

1. **Request Performance** - Latensi dan throughput
2. **Database Queries** - Query yang lambat
3. **Job Processing** - Queue dan worker performance
4. **Memory Usage** - Penggunaan memory aplikasi
5. **Error Rates** - Exception dan error tracking

### 📋 Historical Data
Pulse menyimpan data historis yang memungkinkan Anda untuk:

```php
use Laravel\Pulse\Facades\Pulse;

// Mengambil data historis
$historical = Pulse::graph('slow_requests', 'count', now()->subHour(), now());
```

### 📋 Trend Analysis
Analisis tren kinerja aplikasi Anda:

```php
$trend = Pulse::graph('requests', 'count', now()->subDay(), now(), 'hour');
```

## 🚨 Alerts

### 📋 Alert System
Pulse menyertakan sistem alert untuk memberi tahu Anda ketika metrik melewati threshold tertentu:

```php
'alerts' => [
    'slow_requests' => [
        'threshold' => 100, // Jika lebih dari 100 slow requests
        'channels' => ['slack', 'email'], // Channel notifikasi
    ],
],
```

### 📋 Custom Alert Conditions
```php
'alerts' => [
    'high_error_rate' => [
        'condition' => fn ($value) => $value > 5, // Lebih dari 5 error per menit
        'channels' => ['slack'],
    ],
],
```

### 📋 Alert Channels
Pulse mendukung berbagai channel notifikasi:

1. **Slack**
2. **Email**
3. **Webhook**
4. **Custom Channels**

## 📤 Exporting Data

### 📋 Export Data Metrik
Anda dapat mengekspor data metrik Pulse:

```bash
php artisan pulse:export --format=csv --period=24h
```

### 📋 Format Export yang Tersedia
1. **CSV** - Comma Separated Values
2. **JSON** - JavaScript Object Notation
3. **XML** - Extensible Markup Language

### 📋 Scheduled Exports
Atur export data secara terjadwal:

```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    $schedule->command('pulse:export --format=csv')
             ->daily()
             ->sendOutputTo(storage_path('app/pulse-export.csv'));
}
```

## 🔧 Troubleshooting

### 📋 Masalah Umum

#### 🔄 Pulse tidak mengumpulkan data
Periksa konfigurasi recorder dan pastikan Redis berjalan dengan benar:

```bash
php artisan pulse:check
```

#### 📊 Dashboard tidak menampilkan data
Pastikan metrik telah dikumpulkan dan Redis berfungsi dengan baik:

```bash
redis-cli ping
```

#### ⚡ Performance issues
Kurangi sample rate dan optimalkan konfigurasi recorder:

```php
'recorders' => [
    Laravel\Pulse\Recorders\SlowRequests::class => [
        'sample_rate' => 0.01, // Kurangi sample rate
    ],
],
```

### 📋 Debugging

#### 📋 Mode Debug
Aktifkan mode debug untuk informasi tambahan:

```env
PULSE_DEBUG=true
```

#### 📋 Logging
Periksa log Laravel untuk error Pulse:

```bash
tail -f storage/logs/laravel.log | grep Pulse
```

## 🧠 Kesimpulan

Laravel Pulse menyediakan dashboard monitoring real-time yang kuat dan indah untuk aplikasi Laravel Anda. Dengan Pulse, Anda dapat memahami kinerja aplikasi Anda secara langsung dan mengidentifikasi masalah sebelum mereka mempengaruhi pengguna Anda.

### 🔑 Keuntungan Utama
- Dashboard real-time yang indah
- Pengumpulan metrik otomatis
- Recorder yang dapat dikustomisasi
- Cards untuk berbagai metrik
- Alert system
- Export data
- Performance monitoring
- Integrasi dengan Laravel Horizon

### 🚀 Best Practices
1. Gunakan sample rate untuk mengurangi beban pada aplikasi produksi
2. Monitor metrik kritis seperti request latency dan error rates
3. Gunakan alert untuk diberi tahu ketika threshold dilampaui
4. Ekspor data secara terjadwal untuk analisis historis
5. Gunakan custom cards untuk metrik spesifik bisnis Anda
6. Amankan dashboard dengan middleware autentikasi yang tepat
7. Monitor resource usage Pulse secara berkala
8. Gunakan Redis yang andal untuk storage metrik

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Pulse untuk memantau dan meningkatkan kinerja aplikasi Laravel Anda.
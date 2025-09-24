# 🔭 Laravel Telescope

Laravel Telescope adalah panel observabilitas yang indah untuk framework Laravel. Telescope memberikan wawasan tentang permintaan yang masuk ke aplikasi Anda, exception, log entry, database query, queued job, dan lainnya.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [Filtering Entries](#filtering-entries)
5. [Tagging Entries](#tagging-entries)
6. [Dashboard](#dashboard)
7. [Watching Entries](#watching-entries)
8. [Notifications](#notifications)
9. [Storage Watchers](#storage-watchers)
10. [Performance](#performance)
11. [Cleaning Up Records](#cleaning-up-records)
12. [Upgrading Telescope](#upgrading-telescope)

## 🎯 Pendahulahan

Laravel Telescope adalah panel observabilitas yang indah untuk framework Laravel. Telescope memberikan wawasan tentang permintaan yang masuk ke aplikasi Anda, exception, log entry, database query, queued job, mail, notification, scheduled task, variable dump, dan banyak lagi.

### ✨ Fitur Utama
- Request inspection
- Command inspection
- Schedule task inspection
- Event inspection
- Exception inspection
- Log inspection
- Database query inspection
- Mail inspection
- Notification inspection
- Queue job inspection
- Redis command inspection
- Request inspection
- Variable dump inspection
- Custom watcher support
- Tagging system
- Filtering system
- Performance monitoring

### ⚠️ Catatan Penting
Telescope dimaksudkan untuk digunakan dalam lingkungan pengembangan lokal. Namun, Anda dapat menginstal Telescope di lingkungan staging jika Anda berhati-hati. Telescope dapat mengumpulkan ribuan record dalam permintaan atau perintah console, yang dapat secara negatif mempengaruhi performa aplikasi Anda.

## 📦 Instalasi

### 🎯 Menginstal Telescope
Untuk memulai, instal Telescope melalui Composer:

```bash
composer require laravel/telescope
```

### 🛠️ Publish Resources
Setelah menginstal Telescope, publikasikan asetnya menggunakan perintah `telescope:install`:

```bash
php artisan telescope:install
```

### 🔧 Run Migrations
Setelah mempublish aset Telescope, jalankan migrasi database:

```bash
php artisan migrate
```

### 🔄 Add Service Provider
Jika Anda menonaktifkan package discovery, Anda perlu mendaftarkan service provider Telescope secara manual dalam file `config/app.php` Anda:

```php
'providers' => [
    // ...
    Laravel\Telescope\TelescopeServiceProvider::class,
],
```

## ⚙️ Konfigurasi

### 📄 File Konfigurasi
File konfigurasi utama terletak di `config/telescope.php`. File ini memungkinkan Anda mengkonfigurasi berbagai aspek perilaku Telescope.

### 📋 Konfigurasi Dasar
```php
<?php

use Laravel\Telescope\Http\Middleware\Authorize;
use Laravel\Telescope\Watchers;

return [
    /*
    |--------------------------------------------------------------------------
    | Telescope Domain
    |--------------------------------------------------------------------------
    |
    | This is the subdomain where Telescope will be accessible from. If the
    | setting is null, Telescope will reside under the same domain as the
    | application. Otherwise, this value will be used as the subdomain.
    |
    */

    'domain' => env('TELESCOPE_DOMAIN'),

    /*
    |--------------------------------------------------------------------------
    | Telescope Path
    |--------------------------------------------------------------------------
    |
    | This is the URI path where Telescope will be accessible from. Feel free
    | to change this path to anything you like. Note that the URI will not
    | affect the paths of its internal API that aren't exposed to users.
    |
    */

    'path' => env('TELESCOPE_PATH', 'telescope'),

    /*
    |--------------------------------------------------------------------------
    | Telescope Storage Driver
    |--------------------------------------------------------------------------
    |
    | This configuration options determines the storage driver that will
    | be used to store Telescope's data. In addition, you may set any
    | custom options as needed by the particular driver you choose.
    |
    */

    'driver' => env('TELESCOPE_DRIVER', 'database'),

    'storage' => [
        'database' => [
            'connection' => env('DB_CONNECTION', 'mysql'),
            'chunk' => 1000,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Telescope Master Switch
    |--------------------------------------------------------------------------
    |
    | This option may be used to disable all Telescope watchers regardless
    | of their individual configuration, which simply provides a single
    | and convenient way to enable or disable Telescope data storage.
    |
    */

    'enabled' => env('TELESCOPE_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Telescope Route Middleware
    |--------------------------------------------------------------------------
    |
    | These middleware will be assigned to every Telescope route, giving you
    | the chance to add your own middleware to this list or change any of
    | the existing middleware. Or, you can simply stick with this list.
    |
    */

    'middleware' => [
        'web',
        Authorize::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Allowed / Ignored Paths & Commands
    |--------------------------------------------------------------------------
    |
    | The following array lists the URI paths and Artisan commands that will
    | not be watched by Telescope. In addition to this list, some Laravel
    | commands, like migrations and queue commands, are always ignored.
    |
    */

    'only_paths' => [
        // 'api/*'
    ],

    'ignore_paths' => [
        'nova-api*',
    ],

    'ignore_commands' => [
        //
    ],

    /*
    |--------------------------------------------------------------------------
    | Telescope Watchers
    |--------------------------------------------------------------------------
    |
    | The following array lists the "watchers" that will be registered with
    | Telescope. The watchers gather the application's profile data when
    | a request or task is executed.
    |
    */

    'watchers' => [
        Watchers\BatchWatcher::class => env('TELESCOPE_BATCH_WATCHER', true),
        Watchers\CacheWatcher::class => env('TELESCOPE_CACHE_WATCHER', true),
        Watchers\ClientRequestWatcher::class => env('TELESCOPE_CLIENT_REQUEST_WATCHER', true),
        Watchers\CommandWatcher::class => env('TELESCOPE_COMMAND_WATCHER', true),
        Watchers\DumpWatcher::class => env('TELESCOPE_DUMP_WATCHER', true),
        Watchers\EventWatcher::class => env('TELESCOPE_EVENT_WATCHER', true),
        Watchers\ExceptionWatcher::class => env('TELESCOPE_EXCEPTION_WATCHER', true),
        Watchers\GateWatcher::class => env('TELESCOPE_GATE_WATCHER', true),
        Watchers\JobWatcher::class => env('TELESCOPE_JOB_WATCHER', true),
        Watchers\LogWatcher::class => env('TELESCOPE_LOG_WATCHER', true),
        Watchers\MailWatcher::class => env('TELESCOPE_MAIL_WATCHER', true),
        Watchers\ModelWatcher::class => env('TELESCOPE_MODEL_WATCHER', true),
        Watchers\NotificationWatcher::class => env('TELESCOPE_NOTIFICATION_WATCHER', true),
        Watchers\QueryWatcher::class => env('TELESCOPE_QUERY_WATCHER', true),
        Watchers\RedisWatcher::class => env('TELESCOPE_REDIS_WATCHER', true),
        Watchers\RequestWatcher::class => env('TELESCOPE_REQUEST_WATCHER', true),
        Watchers\ScheduleWatcher::class => env('TELESCOPE_SCHEDULE_WATCHER', true),
        Watchers\ViewWatcher::class => env('TELESCOPE_VIEW_WATCHER', true),
    ],
];
```

### 🔐 Konfigurasi Environment
Tambahkan konfigurasi berikut ke file `.env` Anda:

```bash
TELESCOPE_ENABLED=true
TELESCOPE_PATH=telescope
TELESCOPE_DRIVER=database

TELESCOPE_BATCH_WATCHER=true
TELESCOPE_CACHE_WATCHER=true
TELESCOPE_CLIENT_REQUEST_WATCHER=true
TELESCOPE_COMMAND_WATCHER=true
TELESCOPE_DUMP_WATCHER=true
TELESCOPE_EVENT_WATCHER=true
TELESCOPE_EXCEPTION_WATCHER=true
TELESCOPE_GATE_WATCHER=true
TELESCOPE_JOB_WATCHER=true
TELESCOPE_LOG_WATCHER=true
TELESCOPE_MAIL_WATCHER=true
TELESCOPE_MODEL_WATCHER=true
TELESCOPE_NOTIFICATION_WATCHER=true
TELESCOPE_QUERY_WATCHER=true
TELESCOPE_REDIS_WATCHER=true
TELESCOPE_REQUEST_WATCHER=true
TELESCOPE_SCHEDULE_WATCHER=true
TELESCOPE_VIEW_WATCHER=true
```

### 🔐 Melindungi Dashboard
Secara default, Anda hanya dapat mengakses dashboard di lingkungan `local`. Untuk mengkonfigurasi akses di lingkungan lain, Anda harus menentukan gate dalam metode `boot` dari `AppServiceProvider` Anda:

```php
use Laravel\Telescope\Telescope;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Telescope::auth(function ($request) {
        return auth()->check() && auth()->user()->hasRole('admin');
    });
}
```

## 🔍 Filtering Entries

### 📋 Menggunakan Filter
Anda dapat memfilter entri yang dicatat oleh Telescope menggunakan metode `filter`:

```php
use Laravel\Telescope\Telescope;

Telescope::filter(function (IncomingEntry $entry) {
    if ($entry->type === 'request') {
        return $entry->content['response_status'] >= 400;
    }

    return true;
});
```

### 📋 Menggunakan Filter Berdasarkan Environment
```php
use Laravel\Telescope\Telescope;

Telescope::filter(function (IncomingEntry $entry) {
    return config('app.env') === 'local' ||
           $entry->isReportableException() ||
           $entry->isFailedRequest() ||
           $entry->isFailedJob() ||
           $entry->type === 'exception';
});
```

### 📋 Menggunakan Filter Kustom
```php
use Laravel\Telescope\Telescope;

Telescope::filter(function (IncomingEntry $entry) {
    // Hanya mencatat entri yang penting
    return $entry->isReportableException() ||
           $entry->isFailedRequest() ||
           $entry->isFailedJob() ||
           $entry->type === 'schedule';
});
```

### 📋 Menggunakan Filter dengan Log Level
```php
use Laravel\Telescope\Telescope;

Telescope::filter(function (IncomingEntry $entry) {
    if ($entry->type === 'log') {
        return $entry->content['level'] === 'error' || 
               $entry->content['level'] === 'critical';
    }

    return true;
});
```

## 🏷️ Tagging Entries

### 📋 Menambahkan Tags
Anda dapat menambahkan tag ke entri Telescope untuk memudahkan pencarian dan filter:

```php
use Laravel\Telescope\Telescope;

Telescope::tag(function (IncomingEntry $entry) {
    if ($entry->type === 'request') {
        return ['requests'];
    }

    if ($entry->type === 'job') {
        return ['jobs', 'background'];
    }

    return [];
});
```

### 📋 Tagging Berdasarkan User
```php
use Laravel\Telescope\Telescope;

Telescope::tag(function (IncomingEntry $entry) {
    $tags = [];

    if (auth()->check()) {
        $tags[] = 'user:' . auth()->id();
    }

    if ($entry->type === 'request') {
        $tags[] = 'requests';
    }

    if ($entry->type === 'job') {
        $tags[] = 'jobs';
    }

    return $tags;
});
```

### 📋 Tagging Berdasarkan Context
```php
use Laravel\Telescope\Telescope;

Telescope::tag(function (IncomingEntry $entry) {
    $tags = ['app'];

    if (app()->runningInConsole()) {
        $tags[] = 'console';
    } else {
        $tags[] = 'web';
    }

    if (config('app.debug')) {
        $tags[] = 'debug';
    }

    return $tags;
});
```

### 📋 Tagging dengan Data Dinamis
```php
use Laravel\Telescope\Telescope;

Telescope::tag(function (IncomingEntry $entry) {
    $tags = [];

    if ($entry->type === 'request') {
        $tags[] = 'method:' . strtolower($entry->content['method']);
        $tags[] = 'status:' . $entry->content['response_status'];
    }

    if ($entry->type === 'query') {
        if ($entry->content['slow']) {
            $tags[] = 'slow-query';
        }
    }

    return $tags;
});
```

## 🎨 Dashboard

### 📋 Mengakses Dashboard
Setelah mengkonfigurasi Telescope, Anda dapat mengakses dashboard di route `/telescope`:

```
http://your-app.test/telescope
```

### 📋 Komponen Dashboard
Dashboard Telescope terdiri dari beberapa komponen:

1. **Navigation Sidebar** - Menu navigasi antar jenis entri
2. **Entry List** - Daftar entri yang telah dicatat
3. **Entry Detail** - Detail informasi untuk entri yang dipilih
4. **Search Bar** - Pencarian entri
5. **Tag Filter** - Filter berdasarkan tag
6. **Time Range Filter** - Filter berdasarkan rentang waktu

### 📋 Entry Types
Dashboard menampilkan berbagai jenis entri:

- **Requests** - HTTP requests dan responses
- **Commands** - Artisan commands
- **Schedule** - Scheduled tasks
- **Jobs** - Queued jobs
- **Events** - Event broadcasting
- **Exceptions** - Exceptions dan errors
- **Logs** - Log entries
- **Queries** - Database queries
- **Models** - Model operations
- **Mail** - Email yang dikirim
- **Notifications** - Notifications
- **Cache** - Cache operations
- **Gates** - Authorization gates
- **Dumps** - Variable dumps

### 📋 Searching Entries
Anda dapat mencari entri menggunakan search bar:

```php
// Mencari berdasarkan content
$search = 'user@example.com';

// Mencari berdasarkan tag
$tag = 'user:123';

// Mencari berdasarkan type
$type = 'exception';
```

### 📋 Filtering Entries
Anda dapat memfilter entri berdasarkan:

```php
// Filter berdasarkan tag
http://your-app.test/telescope/requests?tag=user:123

// Filter berdasarkan rentang waktu
http://your-app.test/telescope/requests?startTime=2023-01-01&endTime=2023-01-31

// Filter berdasarkan status
http://your-app.test/telescope/requests?status=404
```

## 👀 Watching Entries

### 📋 Watchers Configuration
Anda dapat mengkonfigurasi watchers dalam file `config/telescope.php`:

```php
'watchers' => [
    Watchers\CacheWatcher::class => true,
    Watchers\ClientRequestWatcher::class => true,
    Watchers\CommandWatcher::class => true,
    Watchers\DumpWatcher::class => true,
    Watchers\EventWatcher::class => true,
    Watchers\ExceptionWatcher::class => true,
    Watchers\GateWatcher::class => true,
    Watchers\JobWatcher::class => true,
    Watchers\LogWatcher::class => true,
    Watchers\MailWatcher::class => true,
    Watchers\ModelWatcher::class => true,
    Watchers\NotificationWatcher::class => true,
    Watchers\QueryWatcher::class => true,
    Watchers\RedisWatcher::class => true,
    Watchers\RequestWatcher::class => true,
    Watchers\ScheduleWatcher::class => true,
    Watchers\ViewWatcher::class => true,
],
```

### 📋 Mengaktifkan/Menonaktifkan Watchers
```php
'watchers' => [
    Watchers\CacheWatcher::class => env('TELESCOPE_CACHE_WATCHER', true),
    Watchers\QueryWatcher::class => [
        'enabled' => env('TELESCOPE_QUERY_WATCHER', true),
        'slow' => 100, // Query dianggap lambat jika > 100ms
    ],
    Watchers\RequestWatcher::class => [
        'enabled' => env('TELESCOPE_REQUEST_WATCHER', true),
        'size_limit' => env('TELESCOPE_RESPONSE_SIZE_LIMIT', 64),
    ],
],
```

### 📋 Watchers Kustom
```php
<?php

namespace App\Telescope\Watchers;

use Laravel\Telescope\IncomingEntry;
use Laravel\Telescope\Telescope;
use Laravel\Telescope\Watchers\Watcher;

class CustomWatcher extends Watcher
{
    /**
     * Register the watcher.
     */
    public function register(): void
    {
        Telescope::recordCustom(function (array $data) {
            Telescope::recordCustomEntry(
                IncomingEntry::make($data)
                    ->withFamilyHash($this->familyHash($data))
                    ->setType('custom')
            );
        });
    }

    /**
     * Get the family hash for the entry.
     */
    public function familyHash(array $data): string
    {
        return md5(json_encode($data));
    }
}
```

### 📋 Mendaftarkan Watcher Kustom
```php
// config/telescope.php
'watchers' => [
    App\Telescope\Watchers\CustomWatcher::class => true,
],
```

## 📢 Notifications

### 📋 Email Notifications
Telescope dapat mengirim notifikasi email ketika exception terjadi:

```php
// config/telescope.php
'notifications' => [
    'email' => [
        'to' => 'admin@example.com',
    ],
],
```

### 📋 Slack Notifications
```php
// config/telescope.php
'notifications' => [
    'slack' => [
        'webhook_url' => env('TELESCOPE_SLACK_WEBHOOK_URL'),
        'channel' => '#exceptions',
    ],
],
```

### 📋 Discord Notifications
```php
// config/telescope.php
'notifications' => [
    'discord' => [
        'webhook_url' => env('TELESCOPE_DISCORD_WEBHOOK_URL'),
        'username' => 'Telescope Bot',
    ],
],
```

### 📋 Custom Notifications
```php
use Laravel\Telescope\EntryType;
use Laravel\Telescope\Telescope;

Telescope::notify(function (EntryType $entry) {
    if ($entry->isReportableException()) {
        // Kirim notifikasi untuk exception yang dapat dilaporkan
    }
});
```

### 📋 Notification Conditions
```php
Telescope::notify(function (EntryType $entry) {
    return $entry->type === 'exception' && 
           $entry->content['class'] === 'PDOException';
});
```

## 💾 Storage Watchers

### 📋 Database Storage
Telescope secara default menggunakan database untuk menyimpan entri:

```php
'driver' => env('TELESCOPE_DRIVER', 'database'),

'storage' => [
    'database' => [
        'connection' => env('DB_CONNECTION', 'mysql'),
        'chunk' => 1000,
    ],
],
```

### 📋 Custom Storage Driver
```php
use Laravel\Telescope\Contracts\EntriesRepository;

class CustomStorageDriver implements EntriesRepository
{
    public function store($entries)
    {
        // Implementasi penyimpanan kustom
    }

    public function get($id)
    {
        // Implementasi pengambilan entri
    }

    public function prune(DateTimeInterface $before)
    {
        // Implementasi pembersihan entri lama
    }
}
```

### 📋 Mendaftarkan Custom Storage Driver
```php
use Laravel\Telescope\Telescope;

Telescope::store(function ($app) {
    return new CustomStorageDriver;
});
```

## ⚡ Performance

### 📋 Optimizing Telescope
Untuk mengoptimalkan performa Telescope:

```php
// config/telescope.php
'enabled' => env('TELESCOPE_ENABLED', true),

'watchers' => [
    Watchers\QueryWatcher::class => [
        'enabled' => env('TELESCOPE_QUERY_WATCHER', true),
        'slow' => 100, // Hanya mencatat query lambat
    ],
],
```

### 📋 Limiting Entries
```php
// config/telescope.php
'limiting' => [
    'max_entries' => 1000, // Batasi jumlah entri yang disimpan
],
```

### 📋 Disabling in Production
```php
// config/telescope.php
'enabled' => env('TELESCOPE_ENABLED', false),
```

### 📋 Using Telescope in Staging
```php
// Hanya aktifkan untuk pengguna admin tertentu
Telescope::filter(function ($entry) {
    return auth()->check() && auth()->user()->isAdmin();
});
```

### 📋 Performance Considerations
```php
// Gunakan sampling untuk mengurangi beban
Telescope::filter(function ($entry) {
    return rand(1, 100) <= 10; // Hanya 10% entri yang dicatat
});
```

## 🧹 Cleaning Up Records

### 📋 Pruning Old Records
Telescope menyertakan perintah untuk membersihkan entri lama:

```bash
php artisan telescope:prune
```

### 📋 Pruning dengan Rentang Waktu
```bash
# Membersihkan entri yang lebih dari 48 jam
php artisan telescope:prune --hours=48

# Membersihkan semua entri kecuali yang terbaru
php artisan telescope:prune --keep-exceptions
```

### 📋 Scheduled Pruning
```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    $schedule->command('telescope:prune --hours=48')->daily();
}
```

### 📋 Manual Pruning
```php
use Laravel\Telescope\Storage\EntryModel;

// Membersihkan entri berdasarkan tanggal
EntryModel::where('created_at', '<', now()->subDays(7))->delete();
```

### 📋 Pruning dengan Conditions
```php
use Laravel\Telescope\Storage\EntryModel;

// Membersihkan entri berdasarkan jenis
EntryModel::where('type', 'request')
    ->where('created_at', '<', now()->subHours(24))
    ->delete();
```

## 🚀 Upgrading Telescope

### 📋 Checking for Updates
Untuk memeriksa versi Telescope saat ini:

```bash
composer show laravel/telescope
```

### 📋 Updating Telescope
Untuk mengupdate Telescope ke versi terbaru:

```bash
composer update laravel/telescope
```

### 📋 Publishing Updated Assets
Setelah mengupdate, publikasikan aset yang diperbarui:

```bash
php artisan telescope:publish
```

### 📋 Running Migrations
Jika ada migrasi baru:

```bash
php artisan migrate
```

### 📋 Breaking Changes
Lihat changelog untuk breaking changes:

```bash
composer show laravel/telescope --all
```

### 📋 Backward Compatibility
Untuk menjaga backward compatibility:

```php
// Gunakan versi spesifik
composer require laravel/telescope:^4.0
```

## 🧪 Testing

### 📋 Testing dengan Telescope
Untuk menguji aplikasi dengan Telescope:

```php
use Laravel\Telescope\Telescope;

public function test_telescope_records_exceptions()
{
    Telescope::stopRecording(); // Hentikan recording untuk test
    
    // Lakukan pengujian
    
    Telescope::startRecording(); // Mulai recording kembali
}
```

### 📋 Faking Telescope
```php
use Laravel\Telescope\Telescope;

public function test_exception_is_recorded()
{
    Telescope::fake(); // Fake Telescope untuk pengujian
    
    // Trigger exception
    
    Telescope::assertRecorded(function ($entry) {
        return $entry->type === 'exception';
    });
}
```

### 📋 Clearing Entries for Tests
```php
use Laravel\Telescope\Telescope;

protected function setUp(): void
{
    parent::setUp();
    
    Telescope::clearEntries(); // Bersihkan entri sebelum test
}
```

## 🛠️ Troubleshooting

### 📋 Common Issues

#### 🔄 Telescope tidak mencatat entri
Periksa konfigurasi `TELESCOPE_ENABLED` dan pastikan Telescope diaktifkan.

#### 🔒 Akses dashboard ditolak
Pastikan gate autentikasi dikonfigurasi dengan benar dalam `AppServiceProvider`.

#### 🐌 Performance issues
Nonaktifkan watchers yang tidak diperlukan dan gunakan pruning secara teratur.

#### 📁 Database size growing
Gunakan perintah `telescope:prune` secara terjadwal.

### 📋 Debugging

#### 📋 Enabling Debug Mode
```php
// config/telescope.php
'debug' => env('TELESCOPE_DEBUG', false),
```

#### 📋 Viewing Telescope Logs
```bash
tail -f storage/logs/laravel.log | grep Telescope
```

#### 📋 Checking Telescope Status
```bash
php artisan telescope:status
```

## 🧠 Kesimpulan

Laravel Telescope menyediakan panel observabilitas yang kuat dan indah untuk aplikasi Laravel Anda. Dengan Telescope, Anda dapat memahami dan mendebug aplikasi Anda dengan lebih baik melalui wawasan tentang request, exception, log, database query, dan banyak lagi.

### 🔑 Keuntungan Utama
- Panel observabilitas yang indah
- Request inspection
- Exception tracking
- Database query analysis
- Queue job monitoring
- Mail and notification tracking
- Event and command inspection
- Variable dump inspection
- Custom watcher support
- Tagging and filtering system
- Performance monitoring

### 🚀 Best Practices
1. Gunakan hanya dalam lingkungan pengembangan lokal
2. Nonaktifkan watcher yang tidak diperlukan
3. Gunakan pruning secara terjadwal
4. Terapkan filter untuk mengurangi noise
5. Gunakan tagging untuk organisasi entri
6. Lindungi dashboard dengan autentikasi
7. Monitor ukuran database secara berkala
8. Gunakan dalam staging dengan hati-hati
9. Uji aplikasi dengan Telescope dinonaktifkan
10. Gunakan notifications untuk exception penting

### ⚠️ Production Considerations
1. Jangan aktifkan Telescope dalam produksi
2. Gunakan environment variables untuk konfigurasi
3. Terapkan rate limiting jika digunakan di staging
4. Gunakan pruning otomatis untuk menjaga ukuran database
5. Lindungi akses dashboard dengan autentikasi ketat
6. Gunakan sampling jika perlu aktif di produksi
7. Monitor penggunaan resource secara berkala
8. Gunakan logging tambahan untuk debugging produksi

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Telescope untuk memantau dan mendebug aplikasi Laravel Anda.
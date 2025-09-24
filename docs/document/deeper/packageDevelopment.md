# 📦 Pengembangan Package Laravel: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Hari ini kita akan belajar tentang **Package Development** - konsep penting yang membuat kamu bisa **membuat fitur-fitur modular** yang bisa digunakan di banyak aplikasi Laravel. Ini adalah topik yang super penting untuk membangun aplikasi Laravel yang modular dan reusable!

Bayangkan kamu seorang **pembuat alat** yang bisa digunakan oleh banyak tukang lain. Package itu seperti kotak peralatan yang lengkap dan mudah dipasang, yang bisa digunakan siapa saja untuk memudahkan pekerjaan mereka. Siap? Ayo kita mulai petualangan ini!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Package Itu Sebenarnya?

**Analogi:** Bayangkan kamu sedang bekerja di sebuah bengkel besar. Setiap kali kamu butuh memasang sistem pendingin udara, kamu tidak perlu membuat semua komponen dari awal. Kamu cukup membuka **kotak peralatan** yang sudah berisi semua komponen lengkap: kompresor, pipa, remote, dan manual instalasi. Itulah Package!

**Package dalam Laravel** bekerja seperti ini! Package adalah **kotak peralatan modular** yang berisi:
- Service Provider (otak package)
- Konfigurasi (pengaturan)
- Routes (alamat)
- Views (tampilan)
- Migrations (struktur database)
- Artisan Commands (perintah terminal)

**Mengapa ini penting?** Karena ini membuat aplikasi kita:
- **Modular**: Tidak perlu menulis kode yang sama berulang-ulang.
- **Reusabel**: Bisa digunakan di banyak aplikasi.
- **Mudah dirawat**: Saat ada bug, tinggal perbaiki di satu tempat.
- **Fleksibel**: Bisa dipasang atau dicopot dengan mudah.

Tanpa Package, semua fitur akan tumpuk di satu aplikasi, dan itu adalah mimpi buruk untuk dirawat. 😵

**Bagaimana cara kerjanya?** Alur kerja (workflow) Package kita menjadi sangat rapi:

`➡️ Buat Package -> 📦 Package diinstal -> 🔌 Service Provider aktif -> ✅ Fitur siap digunakan`

### 2. ⚡ Tipe Package (Pemilihan yang Tepat)

**Analogi:** Ini seperti memilih jenis alat kerja: ada yang bisa digunakan di semua situasi, ada yang spesifik untuk jenis pekerjaan tertentu.

Package dibagi menjadi dua tipe utama:

#### Stand-alone Package
**Analogi:** Ini seperti alat serbaguna yang bisa digunakan di berbagai jenis proyek - tidak tergantung pada framework tertentu.

**Contoh:**
- Carbon (library tanggal dan waktu)
- Guzzle (HTTP client)
- Monolog (logging)

**Kelebihan:**
- Bisa digunakan di framework lain
- Lebih ringan dan fokus pada tugas spesifik
- Tidak bergantung pada fitur framework tertentu

**Kekurangan:**
- Tidak bisa memanfaatkan fitur Laravel secara langsung
- Harus implementasi sendiri komponen seperti caching, logging, dll.

#### Laravel-specific Package
**Analogi:** Ini seperti alat khusus yang dibuat untuk digunakan dalam sistem tertentu - sangat efisien karena dirancang khusus untuk sistem tersebut.

**Contoh:**
- Spatie packages (laravel-permission, media-library, ecc.)
- Laravel Cashier
- Laravel Horizon

**Kelebihan:**
- Bisa menggunakan semua fitur Laravel secara langsung
- Integrasi yang lebih mulus
- Lebih mudah untuk implementasi fitur kompleks

**Kekurangan:**
- Hanya bisa digunakan di aplikasi Laravel
- Bergantung pada versi Laravel tertentu

### 3. 📋 Konsep Utama dalam Package Development

Sebelum kita mulai, mari kita kenali konsep-konsep utama:

- **Service Provider**: Jantung package, mengatur integrasi dengan Laravel.
- **Package Discovery**: Fitur Laravel yang otomatis mendaftarkan package.
- **Publishing**: Proses menyalin file dari package ke aplikasi utama.
- **Autoloading**: Fitur composer untuk mengakses kelas di package.

---

## Bagian 2: Membangun Package dengan Sempurna 🏗️

### 4. 🗂️ Struktur Project Package (Dapur yang Rapi!)

**Analogi:** Ini seperti menata dapur kamu. Tempat yang rapi akan membuat memasak jadi lebih mudah dan menyenangkan!

**Struktur yang baik** akan membuat package kamu mudah dirawat dan dipahami oleh developer lain.

**Contoh Struktur Package yang Rapi:**
```
vendor/package-name/
├─ src/
│  ├─ Console/
│  │  └─ Commands/InstallCommand.php
│  ├─ Http/
│  │  └─ Controllers/CourierController.php
│  ├─ Providers/
│  │  └─ CourierServiceProvider.php
│  └─ View/Components/AlertComponent.php
├─ resources/
│  ├─ views/
│  │  └─ dashboard.blade.php
│  └─ lang/
│     └─ en/messages.php
├─ routes/
│  └─ web.php
├─ database/
│  └─ migrations/
├─ public/
│  └─ js/courier.js
├─ config/
│  └─ courier.php
├─ composer.json
└─ README.md
```

**Penjelasan Setiap Folder:**

- **`src/`**: Tempat semua kelas utama kamu.
- **`Console/Commands/`**: Tempat perintah Artisan kamu.
- **`Http/Controllers/`**: Controller milik package kamu.
- **`Providers/`**: Service provider kamu.
- **`View/Components/`**: Blade components kamu.
- **`resources/views/`**: Template Blade kamu.
- **`resources/lang/`**: File terjemahan kamu.
- **`routes/`**: Route milik package kamu.
- **`database/migrations/`**: Migration kamu.
- **`public/`**: File publik (JS, CSS, gambar).
- **`config/`**: File konfigurasi kamu.
- **`composer.json`**: Informasi package kamu.

**Tips Penting:**
- Struktur ini fleksibel, yang penting penamaan namespace mengikuti PSR-4 agar autoload bekerja lancar.
- Gunakan struktur yang logis dan konsisten.
- Jaga agar kode tetap modular dan tidak saling bergantungan secara berlebihan.

### 5. 📦 composer.json & Autoloading (Dasar yang Kuat!)

**Analogi:** Ini seperti **kontrak resmi** yang memberi tahu dunia tentang package kamu dan bagaimana cara menggunakannya.

**composer.json** adalah file konfigurasi utama package kamu. Ini memberi tahu:
- Bagaimana cara autoload kelas kamu
- Dependencies yang dibutuhkan
- Package discovery setup
- Informasi tentang package kamu

**Contoh Lengkap composer.json:**
```json
{
  "name": "vendor/courier",
  "description": "Courier package untuk Laravel - Kirim pesanan dengan mudah",
  "type": "library",
  "keywords": ["laravel", "courier", "shipping", "delivery"],
  "homepage": "https://github.com/vendor/courier",
  "license": "MIT",
  "authors": [
    {
      "name": "Developer Name",
      "email": "developer@example.com",
      "role": "Developer"
    }
  ],
  "autoload": {
    "psr-4": {
      "Vendor\\Courier\\": "src/"
    }
  },
  "extra": {
    "laravel": {
      "providers": [
        "Vendor\\Courier\\Providers\\CourierServiceProvider"
      ],
      "aliases": {
        "Courier": "Vendor\\Courier\\Facades\\Courier"
      }
    }
  },
  "require": {
    "php": ">=8.0",
    "illuminate/support": "^10.0|^11.0"
  },
  "require-dev": {
    "orchestra/testbench": "^8.0",
    "phpunit/phpunit": "^10.0"
  },
  "autoload-dev": {
    "psr-4": {
      "Vendor\\Courier\\Tests\\": "tests/"
    }
  },
  "scripts": {
    "test": "vendor/bin/phpunit",
    "test-coverage": "vendor/bin/phpunit --coverage-html coverage"
  }
}
```

**Penjelasan Setiap Bagian:**

- **`name`**: Nama package kamu (formatnya: vendor/package-name)
- **`description`**: Deskripsi singkat tentang package kamu
- **`autoload.psr-4`**: Memberi tahu composer bagaimana mengakses kelas kamu
- **`extra.laravel`**: Setup package discovery - sangat penting!
- **`require`**: Dependencies yang dibutuhkan
- **`require-dev`**: Dependencies hanya untuk development
- **`autoload-dev.psr-4`**: Autoloading untuk test
- **`scripts`**: Perintah shortcut untuk testing

**Package Discovery Setup:**
Bagian `extra.laravel` adalah yang membuat package kamu bisa otomatis terdeteksi oleh Laravel:
```json
"extra": {
  "laravel": {
    "providers": [
      "Vendor\\Courier\\Providers\\CourierServiceProvider"
    ],
    "aliases": {
      "Courier": "Vendor\\Courier\\Facades\\Courier"
    }
  }
}
```

### 6. ⚙️ Konfigurasi (Config) - Settingan yang Fleksibel

**Analogi:** Ini seperti **remote kontrol** untuk package kamu - pengguna bisa mengatur bagaimana package bekerja sesuai kebutuhan mereka.

**Mengapa konfigurasi penting?** Karena setiap aplikasi punya kebutuhan yang berbeda. Mungkin satu aplikasi ingin mode cepat, aplikasi lain butuh mode hemat.

**Contoh Konfigurasi:**
```php
<?php
// config/courier.php

return [
    'driver' => env('COURIER_DRIVER', 'default'),
    'api_key' => env('COURIER_API_KEY', null),
    'timeout' => env('COURIER_TIMEOUT', 30),
    'options' => [
        'auto_retry' => env('COURIER_AUTO_RETRY', true),
        'max_retries' => env('COURIER_MAX_RETRIES', 3),
    ],
];
```

**Mengakses Konfigurasi:**
```php
// Di dalam service kamu
$driver = config('courier.driver');
$timeout = config('courier.timeout');
$autoRetry = config('courier.options.auto_retry');
```

**Tips Konfigurasi:**
1. Gunakan `env()` untuk mengambil nilai dari file `.env`
2. Berikan default value yang masuk akal
3. Jangan menaruh closure di file konfigurasi - tidak bisa di-cache!
4. Gunakan struktur yang logis dan terdokumentasi

**Publish Konfigurasi (di ServiceProvider):**
```php
// Di boot method service provider
$this->publishes([
    __DIR__.'/../../config/courier.php' => config_path('courier.php'),
], 'courier-config');
```

**Cara Pengguna Menggunakan:**
```bash
php artisan vendor:publish --tag=courier-config
```

---

## Bagian 3: Service Provider - Jantung Package Mu! 🛠️

### 7. 🛠️ Service Provider (Mesin Penghubung!)

**Analogi:** Ini seperti **mesin penghubung** antara package kamu dan aplikasi Laravel. Service Provider adalah jantung dari integrasi kamu ke Laravel.

**Mengapa Service Provider penting?** Karena di sinilah kamu:
- Mengatur binding ke service container
- Memuat routes, views, migrations
- Mempublish resources
- Mengatur konfigurasi

**Contoh Lengkap Service Provider:**
```php
<?php

namespace Vendor\Courier\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;
use Illuminate\Foundation\Console\AboutCommand;
use Vendor\Courier\Facades\Courier;
use Vendor\Courier\CourierService;

class CourierServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // 1. Merge config agar default config tetap tersedia
        $this->mergeConfigFrom(__DIR__.'/../../config/courier.php', 'courier');

        // 2. Binding contoh: singleton service
        $this->app->singleton(CourierService::class, function ($app) {
            return new CourierService(
                config('courier.api_key'),
                config('courier.timeout')
            );
        });

        // 3. Alias untuk kemudahan penggunaan
        $this->app->alias(CourierService::class, 'courier');
    }

    public function boot(): void
    {
        // 1. Publish config
        $this->publishes([
            __DIR__.'/../../config/courier.php' => config_path('courier.php'),
        ], 'courier-config');

        // 2. Load routes - hanya jika routes belum dicache
        if (! $this->app->routesAreCached()) {
            $this->loadRoutesFrom(__DIR__.'/../../routes/web.php');
        }

        // 3. Load views
        $this->loadViewsFrom(__DIR__.'/../../resources/views', 'courier');

        // 4. Publish views
        $this->publishes([
            __DIR__.'/../../resources/views' => resource_path('views/vendor/courier'),
        ], 'courier-views');

        // 5. Load translations
        $this->loadTranslationsFrom(__DIR__.'/../../resources/lang', 'courier');

        // 6. Publish translations
        $this->publishes([
            __DIR__.'/../../resources/lang' => resource_path('lang/vendor/courier'),
        ], 'courier-lang');

        // 7. Publish public assets (js/css)
        $this->publishes([
            __DIR__.'/../../public' => public_path('vendor/courier'),
        ], 'public');

        // 8. Register Blade component
        Blade::component('package-alert', \Vendor\Courier\View\Components\AlertComponent::class);

        // 9. Register commands only if running in console
        if ($this->app->runningInConsole()) {
            $this->commands([
                \Vendor\Courier\Console\Commands\InstallCommand::class,
            ]);

            // Add info to `php artisan about`
            AboutCommand::add('Courier Package', [
                'Version' => '1.0.0',
                'Status' => 'Active'
            ]);
        }

        // 10. Publish migrations
        $this->publishesMigrations([
            __DIR__.'/../../database/migrations' => database_path('migrations'),
        ], 'courier-migrations');
    }
}
```

**Penjelasan Register vs Boot:**

**Register Method:**
- Tempat untuk binding ke service container
- Tempat untuk `mergeConfigFrom`
- Tidak boleh mengakses service container yang lain (kecuali untuk binding)
- Jangan melakukan operasi berat di sini

**Boot Method:**
- Tempat untuk hooking ke sistem Laravel
- Tempat untuk publikasi resources
- Tempat untuk load routes, views, migrations
- Boleh mengakses service container lain
- Boleh melakukan operasi berat

### 8. 🔄 Package Discovery - Fitur Ajaib Laravel!

**Analogi:** Ini seperti memiliki **asisten pintar** yang secara otomatis mengatur semuanya untuk kamu saat package diinstal.

**Mengapa Package Discovery keren?** Karena pengguna tidak perlu mendaftarkan service provider secara manual.

**Cara Kerja:**
```json
// composer.json
{
  "extra": {
    "laravel": {
      "providers": [
        "Vendor\\Courier\\Providers\\CourierServiceProvider"
      ],
      "aliases": {
        "Courier": "Vendor\\Courier\\Facades\\Courier"
      }
    }
  }
}
```

**Cara Pengguna Menonaktifkan Discovery:**
```json
// Di aplikasi pengguna
{
  "extra": {
    "laravel": {
      "dont-discover": ["vendor/courier"]
    }
  }
}
```

---

## Bagian 4: Membangun Fitur-fitur Package 🧰

### 9. 🛣️ Routes (Jalan Raya Package!)

**Analogi:** Ini seperti **jalan raya** yang menghubungkan berbagai fitur dalam package kamu ke dunia luar.

**Mengapa Routes penting?** Karena tanpa routes, pengguna tidak bisa mengakses fitur package kamu dari web.

**Contoh Routes Package:**
```php
<?php
// routes/web.php

use Illuminate\Support\Facades\Route;
use Vendor\Courier\Http\Controllers\CourierController;

// Routes untuk dashboard package
Route::prefix('courier')->name('courier.')->group(function () {
    Route::get('/dashboard', [CourierController::class, 'dashboard'])
         ->name('dashboard');

    Route::get('/shipments', [CourierController::class, 'shipments'])
         ->name('shipments.index');

    Route::post('/shipments', [CourierController::class, 'createShipment'])
         ->name('shipments.store');

    Route::get('/shipments/{shipment}', [CourierController::class, 'shipment'])
         ->name('shipments.show');
});
```

**Load Routes di Service Provider:**
```php
public function boot(): void
{
    // Load routes - hanya jika routes belum dicache
    if (! $this->app->routesAreCached()) {
        $this->loadRoutesFrom(__DIR__.'/../../routes/web.php');
    }
}
```

**Tips Routes:**
- Gunakan prefix untuk menghindari konflik
- Gunakan name untuk kemudahan penggunaan
- Hati-hati dengan route caching - gunakan `routesAreCached()` check

### 10. 👀 Views & Blade (Tampilan yang Indah!)

**Analogi:** Ini seperti **wajah dari package kamu** - tampilan yang indah dan fungsional akan membuat pengguna betah.

**Mengapa Views penting?** Karena tanpa tampilan, pengguna tidak bisa melihat hasil dari fitur package kamu.

**Load Views di Service Provider:**
```php
public function boot(): void
{
    // Load views
    $this->loadViewsFrom(__DIR__.'/../../resources/views', 'courier');
}
```

**Contoh View Package:**
```blade
{{-- resources/views/dashboard.blade.php --}}
@extends('layouts.app')

@section('title', 'Courier Dashboard')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-12">
            <h1 class="mb-4">Courier Dashboard</h1>
            
            <!-- Menggunakan component dari package -->
            <x-package-alert type="info">
                Selamat datang di dashboard Courier Package!
            </x-package-alert>
            
            <div class="card">
                <div class="card-header">
                    <h5>Status Pengiriman</h5>
                </div>
                <div class="card-body">
                    <p class="mb-0">Jumlah pengiriman hari ini: {{ $shipmentsCount }}</p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
```

**Menggunakan View di Controller:**
```php
// Di controller kamu
return view('courier::dashboard', [
    'shipmentsCount' => $shipments->count()
]);
```

**Override View:**
Pengguna bisa meng-override view dengan menyalin file ke `resources/views/vendor/courier`.

### 11. 🧱 View Components (Modular UI!)

**Analogi:** Ini seperti **kotak alat komponen** yang bisa digunakan berkali-kali - hemat waktu dan konsisten!

**Mengapa Components penting?** Karena membuat UI menjadi modular dan reusable.

**Contoh Component:**
```php
<?php
// src/View/Components/AlertComponent.php

namespace Vendor\Courier\View\Components;

use Illuminate\View\Component;

class AlertComponent extends Component
{
    public $type;
    public $dismissible;

    public function __construct($type = 'info', $dismissible = false)
    {
        $this->type = $type;
        $this->dismissible = $dismissible;
    }

    public function render()
    {
        return view('courier::components.alert');
    }

    public function typeClass()
    {
        return match($this->type) {
            'success' => 'alert-success',
            'warning' => 'alert-warning', 
            'danger' => 'alert-danger',
            default => 'alert-info'
        };
    }
}
```

**View Component:**
```blade
{{-- resources/views/components/alert.blade.php --}}
<div {{ $attributes->merge(['class' => 'alert ' . $typeClass()]) }} role="alert">
    @if($dismissible)
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    @endif
    
    {{ $slot }}
</div>
```

**Registrasi Component:**
```php
// Di boot method service provider
Blade::component('package-alert', \Vendor\Courier\View\Components\AlertComponent::class);
```

**Penggunaan:**
```blade
<x-package-alert type="success" dismissible="true">
    Pengiriman berhasil diproses!
</x-package-alert>
```

### 12. 🗃️ Migrations (Struktur Database!)

**Analogi:** Ini seperti **blueprint bangunan** - harus ada dulu sebelum bisa membangun aplikasi.

**Mengapa Migrations penting?** Karena banyak package butuh struktur database untuk menyimpan data.

**Contoh Migration:**
```php
<?php
// database/migrations/2025_01_01_000000_create_couriers_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('couriers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('service');
            $table->string('tracking_number')->unique();
            $table->json('status_history')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('couriers');
    }
};
```

**Publish Migrations:**
```php
// Di boot method service provider
$this->publishesMigrations([
    __DIR__.'/../../database/migrations' => database_path('migrations'),
], 'courier-migrations');
```

**Cara Pengguna Menggunakan:**
```bash
php artisan vendor:publish --tag=courier-migrations
php artisan migrate
```

### 13. 🌍 Bahasa / Translations (Dunia Internasional!)

**Analogi:** Ini seperti **penerjemah universal** - membuat package kamu bisa dipahami oleh pengguna dari berbagai negara.

**Mengapa Translations penting?** Karena membuat package kamu lebih mudah digunakan oleh pengguna internasional.

**Contoh File Translasi (Inggris):**
```php
<?php
// resources/lang/en/messages.php

return [
    'welcome' => 'Welcome to Courier package!',
    'shipment_created' => 'Shipment successfully created!',
    'tracking_not_found' => 'Tracking number not found.',
    'status' => [
        'pending' => 'Pending',
        'shipped' => 'Shipped',
        'delivered' => 'Delivered',
        'cancelled' => 'Cancelled',
    ]
];
```

**Contoh File Translasi (Indonesia):**
```php
<?php
// resources/lang/id/messages.php

return [
    'welcome' => 'Selamat datang di package Courier!',
    'shipment_created' => 'Pengiriman berhasil dibuat!',
    'tracking_not_found' => 'Nomor pelacakan tidak ditemukan.',
    'status' => [
        'pending' => 'Menunggu',
        'shipped' => 'Dikirim',
        'delivered' => 'Diterima',
        'cancelled' => 'Dibatalkan',
    ]
];
```

**Menggunakan Translasi:**
```php
// Di controller
$message = trans('courier::messages.welcome');

// Di view
{{ trans('courier::messages.welcome') }}
// atau
@lang('courier::messages.welcome')
```

**Load Translations di Service Provider:**
```php
public function boot(): void
{
    // Load translations
    $this->loadTranslationsFrom(__DIR__.'/../../resources/lang', 'courier');

    // Publish translations
    $this->publishes([
        __DIR__.'/../../resources/lang' => resource_path('lang/vendor/courier'),
    ], 'courier-lang');
}
```

---

## Bagian 5: Advanced Features - Level Berikutnya! 🚀

### 14. 🖥️ Artisan Commands (Perintah Ajaib!)

**Analogi:** Ini seperti **asisten pribadi** yang bisa melakukan tugas-tugas penting dengan satu perintah.

**Mengapa Commands penting?** Karena membuat installasi dan maintenance package jadi mudah.

**Contoh Command:**
```php
<?php
// src/Console/Commands/InstallCommand.php

namespace Vendor\Courier\Console\Commands;

use Illuminate\Console\Command;

class InstallCommand extends Command
{
    protected $signature = 'courier:install';
    protected $description = 'Install the Courier package';

    public function handle()
    {
        $this->info('Installing Courier Package...');
        
        $this->info('Publishing configuration...');
        $this->call('vendor:publish', ['--tag' => 'courier-config']);

        $this->info('Publishing views...');
        $this->call('vendor:publish', ['--tag' => 'courier-views']);

        $this->info('Publishing translations...');
        $this->call('vendor:publish', ['--tag' => 'courier-lang']);

        $this->info('Publishing migrations...');
        $this->call('vendor:publish', ['--tag' => 'courier-migrations']);

        $this->info('Publishing assets...');
        $this->call('vendor:publish', ['--tag' => 'public']);

        $this->info('Running migrations...');
        $this->call('migrate', ['--force' => true]);

        $this->info('Courier Package installed successfully! 🎉');
        $this->comment('You can now use the Courier package in your application!');
    }
}
```

**Contoh Command dengan Option:**
```php
<?php
// src/Console/Commands/PublishCommand.php

namespace Vendor\Courier\Console\Commands;

use Illuminate\Console\Command;

class PublishCommand extends Command
{
    protected $signature = 'courier:publish {--config : Publish config only}
                                       {--views : Publish views only} 
                                       {--migrations : Publish migrations only}
                                       {--force : Overwrite any existing files}';
    
    protected $description = 'Publish Courier package resources';

    public function handle()
    {
        $this->info('Publishing Courier resources...');

        if ($this->option('config') || !$this->option('views') && !$this->option('migrations')) {
            $this->call('vendor:publish', [
                '--tag' => 'courier-config',
                '--force' => $this->option('force'),
            ]);
        }

        if ($this->option('views') || !$this->option('config') && !$this->option('migrations')) {
            $this->call('vendor:publish', [
                '--tag' => 'courier-views',
                '--force' => $this->option('force'),
            ]);
        }

        if ($this->option('migrations') || !$this->option('config') && !$this->option('views')) {
            $this->call('vendor:publish', [
                '--tag' => 'courier-migrations',
                '--force' => $this->option('force'),
            ]);
        }

        $this->info('Resources published successfully!');
    }
}
```

**Registrasi Commands (di ServiceProvider):**
```php
public function boot(): void
{
    if ($this->app->runningInConsole()) {
        $this->commands([
            \Vendor\Courier\Console\Commands\InstallCommand::class,
            \Vendor\Courier\Console\Commands\PublishCommand::class,
        ]);
    }
}
```

### 15. 🎨 Assets Publik (JS/CSS/Images)

**Analogi:** Ini seperti **dekorasi dan furnitur** yang membuat tampilan package jadi lebih menarik dan fungsional.

**Mengapa Assets Publik penting?** Karena banyak package butuh CSS, JS, atau gambar untuk tampilan yang lebih baik.

**Struktur Assets:**
```
public/
├─ css/
│  └─ courier.css
├─ js/
│  └─ courier.js
└─ images/
   └─ logo.png
```

**Publish Assets (di ServiceProvider):**
```php
public function boot(): void
{
    $this->publishes([
        __DIR__.'/../../public' => public_path('vendor/courier'),
    ], 'public');
}
```

**Contoh CSS Assets:**
```css
/* public/css/courier.css */
.courier-dashboard {
    background-color: #f8f9fa;
    min-height: 100vh;
}

.courier-card {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

**Contoh JS Assets:**
```javascript
// public/js/courier.js
document.addEventListener('DOMContentLoaded', function() {
    // Fungsi untuk melacak pengiriman
    document.querySelectorAll('.track-button').forEach(button => {
        button.addEventListener('click', function() {
            const trackingNumber = this.dataset.tracking;
            fetch('/courier/track/' + trackingNumber)
                .then(response => response.json())
                .then(data => {
                    // Tampilkan hasil pelacakan
                    console.log('Tracking info:', data);
                });
        });
    });
});
```

### 16. 🧪 Testing dengan Orchestra Testbench (Uji Kekuatan!)

**Analogi:** Ini seperti **uji coba laboratorium** yang memastikan semua fungsi package kamu bekerja dengan sempurna.

**Mengapa Testing penting?** Karena memastikan package kamu bekerja seperti yang diharapkan di lingkungan Laravel.

**Install Testbench:**
```bash
composer require --dev orchestra/testbench
```

**Contoh TestCase Base:**
```php
<?php
// tests/TestCase.php

namespace Vendor\Courier\Tests;

use Orchestra\Testbench\TestCase as OrchestraTestCase;
use Vendor\Courier\Providers\CourierServiceProvider;

class TestCase extends OrchestraTestCase
{
    protected function getPackageProviders($app)
    {
        return [CourierServiceProvider::class];
    }

    protected function getEnvironmentSetUp($app)
    {
        // Setup environment
        $app['config']->set('app.key', 'base64:9OnDxjU8aLq1uTUztZ6gMhF1uRjJgw3Qw7m0GJrL0Yc=');
    }
}
```

**Contoh Test Service:**
```php
<?php
// tests/Feature/CourierServiceTest.php

namespace Vendor\Courier\Tests\Feature;

use Vendor\Courier\Tests\TestCase;
use Vendor\Courier\CourierService;
use Illuminate\Support\Facades\Config;

class CourierServiceTest extends TestCase
{
    public function test_courier_service_can_be_resolved(): void
    {
        $service = $this->app->make(CourierService::class);
        
        $this->assertInstanceOf(CourierService::class, $service);
    }

    public function test_courier_service_uses_config_values(): void
    {
        Config::set('courier.api_key', 'test-key');
        Config::set('courier.timeout', 60);

        $service = $this->app->make(CourierService::class);

        $this->assertEquals('test-key', $service->getApiKey());
        $this->assertEquals(60, $service->getTimeout());
    }
}
```

**Contoh Test Command:**
```php
<?php
// tests/Feature/Commands/InstallCommandTest.php

namespace Vendor\Courier\Tests\Feature\Commands;

use Vendor\Courier\Tests\TestCase;
use Illuminate\Support\Facades\File;

class InstallCommandTest extends TestCase
{
    public function test_install_command_publishes_resources(): void
    {
        $this->artisan('courier:install')->assertExitCode(0);

        $this->assertFileExists(config_path('courier.php'));
        $this->assertDirectoryExists(resource_path('views/vendor/courier'));
    }
}
```

**Menjalankan Tests:**
```bash
# Jalankan semua test
composer test

# Jalankan test dengan coverage
composer test-coverage
```

---

## Bagian 6: Best Practices & Rekomendasi 🏆

### 17. ✅ Best Practices (Praktik Terbaik!)

**Analogi:** Ini seperti **aturan main** yang harus diikuti agar semua berjalan dengan baik dan rapi.

**Best Practices untuk Package Development:**

1. **Namespace Konsisten**: Gunakan namespace yang konsisten dan deskriptif
   ```php
   namespace Vendor\Courier\Http\Controllers;  // Benar
   namespace Vendor\Courier\Controllers;       // Juga bagus
   ```

2. **Versioning (SemVer)**: Gunakan semantic versioning (MAJOR.MINOR.PATCH)
   - MAJOR: Breaking changes
   - MINOR: New features (backward compatible)
   - PATCH: Bug fixes (backward compatible)

3. **Documentation yang Lengkap**: Dokumentasikan semua fitur
   - Cara install
   - Cara publish resource
   - Contoh penggunaan
   - API yang tersedia

4. **Testing yang Lengkap**: Minimal 80% code coverage
   ```php
   // tests/ExampleTest.php
   public function test_example(): void
   {
       $this->assertTrue(true);
   }
   ```

5. **Error Handling yang Baik**: Tangani error dengan elegan
   ```php
   public function handleException(Exception $e)
   {
       Log::error('Courier error: ' . $e->getMessage(), [
           'exception' => $e
       ]);
       throw new CourierException('Failed to process courier request');
   }
   ```

6. **Performance**: Gunakan caching dan lazy loading jika perlu
   ```php
   return cache()->remember('courier.status.' . $id, 300, function () use ($id) {
       return $this->fetchStatusFromApi($id);
   });
   ```

### 18. 📦 Tips Publikasi Package

**Cara Pengguna Menginstal Package:**
```bash
composer require vendor/courier
```

**Publish Semua Resource:**
```bash
php artisan vendor:publish --provider="Vendor\\Courier\\Providers\\CourierServiceProvider"
```

**Publish Tag Tertentu:**
```bash
php artisan vendor:publish --tag=courier-config
php artisan vendor:publish --tag=courier-views
php artisan vendor:publish --tag=courier-migrations
php artisan vendor:publish --tag=public
```

### 19. 🧰 Checklist Rilis

**Sebelum Rilis Package:**

- [ ] ✅ `composer.json` punya metadata lengkap (name, description, license, authors)
- [ ] ✅ PSR-4 autoload berfungsi dengan benar
- [ ] ✅ Tidak ada closure di file konfigurasi
- [ ] ✅ Package discovery berfungsi
- [ ] ✅ Semua test passing
- [ ] ✅ Dokumentasi lengkap
- [ ] ✅ Contoh penggunaan tersedia
- [ ] ✅ CHANGELOG terupdate
- [ ] ✅ Versi semver sudah benar
- [ ] ✅ CI/CD berjalan dengan sukses
- [ ] ✅ Sudah diuji di aplikasi Laravel yang berbeda

### 20. 🛠️ Troubleshooting Umum

**Masalah: Package tidak otomatis terdeteksi**
- Pastikan `extra.laravel` di `composer.json` sudah benar
- Jalankan `composer dump-autoload`
- Cek apakah service provider benar

**Masalah: View tidak bisa diakses**
- Pastikan `loadViewsFrom` dijalankan di service provider
- Cek namespace view sudah benar (`package::view`)

**Masalah: Config tidak bisa diakses**
- Pastikan `mergeConfigFrom` dijalankan di `register()` method
- Clear cache: `php artisan config:clear`

**Masalah: Command tidak tampil**
- Pastikan command didaftarkan di `boot()` method
- Pastikan hanya didaftarkan saat running in console

---

## Bagian 7: Peralatan Canggih di 'Kotak Perkakas' Package 🧰

### 21. 🔧 Tambahan Fitur yang Berguna

**Facades untuk Kemudahan:**
```php
<?php
// src/Facades/Courier.php

namespace Vendor\Courier\Facades;

use Illuminate\Support\Facades\Facade;

class Courier extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'courier';
    }
}
```

**Penggunaan Facade:**
```php
use Vendor\Courier\Facades\Courier;

Courier::track($trackingNumber);
```

**Custom Validation Rules:**
```php
<?php
// Di service provider boot method

Validator::extend('courier_tracking', function ($attribute, $value, $parameters, $validator) {
    return preg_match('/^[A-Z0-9]+$/', $value) && strlen($value) >= 10;
}, 'The :attribute must be a valid courier tracking number.');
```

**Custom Artisan Generator:**
```php
<?php
// Buat custom command untuk generate komponen package

class MakeCourierComponent extends Command
{
    protected $signature = 'make:courier-component {name}';
    protected $description = 'Create a new courier component';

    public function handle()
    {
        // Generate file komponen secara otomatis
    }
}
```

### 22. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Package Development di Laravel:

#### 📦 Struktur Package
| Folder | Fungsi |
|--------|--------|
| `src/` | Tempat kelas utama |
| `config/` | File konfigurasi |
| `resources/views/` | Template Blade |
| `routes/` | Routes package |
| `database/migrations/` | Migrations |
| `public/` | Assets publik |

#### 🧰 Service Provider Methods
| Method | Fungsi |
|--------|--------|
| `register()` | Binding service container, mergeConfigFrom |
| `boot()` | Load resources, publish, register commands |
| `routesAreCached()` | Check sebelum load routes |

#### 📦 Package Discovery
| Bagian | Fungsi |
|--------|--------|
| `extra.laravel.providers` | Otomatis register service provider |
| `extra.laravel.aliases` | Otomatis register facade alias |

#### 🚀 Publish Resources
| Tag | Fungsi |
|-----|--------|
| `publishes([...], 'config')` | Publish config |
| `publishes([...], 'views')` | Publish views |
| `publishesMigrations([...])` | Publish migrations |

#### 🧪 Testing Commands
| Perintah | Fungsi |
|----------|--------|
| `composer test` | Jalankan tests |
| `php artisan vendor:publish` | Publish resources |
| `php artisan config:cache` | Cache config |
| `php artisan route:cache` | Cache routes |

#### 🛠️ Commands Umum
| Command | Fungsi |
|---------|--------|
| `php artisan courier:install` | Install package lengkap |
| `php artisan courier:publish --tag=config` | Publish config saja |
| `php artisan list` | Lihat semua command |

---

## Bagian 8: Menjadi Master Package Developer 🏆

### 23. ✨ Wejangan dari Guru

1. **Mulai Simple**: Bangun fitur dasar dulu, tambahkan komplexitas pelan-pelan.
2. **Testing adalah Kewajiban**: Selalu test package kamu secara menyeluruh.
3. **Dokumentasi itu Penting**: Dokumentasi yang baik membuat package kamu digunakan lebih banyak.
4. **Ikuti Laravel Convention**: Ikuti konvensi Laravel agar pengguna mudah mengerti.
5. **Gunakan Package Discovery**: Fitur ini membuat package kamu sangat mudah digunakan.
6. **Fokus pada User Experience**: Package kamu harus mudah dipasang dan digunakan.
7. **Maintain Code Quality**: Gunakan linter, code style checker, dan static analysis.
8. **Version dengan Bijak**: Ikuti semantic versioning untuk backward compatibility.

### 24. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Package Development, dari yang paling dasar sampai yang paling rumit. Package Development adalah keterampilan yang sangat penting untuk menjadi Laravel developer profesional!

Dengan memahami Package Development, kamu sekarang bisa:
- Membuat package yang modular dan reusable
- Mengintegrasikan package dengan Laravel secara mulus
- Membuat fitur-fitur yang bisa digunakan di banyak aplikasi
- Menulis test untuk memastikan keandalan
- Membangun ekosistem tools yang bermanfaat bagi komunitas

Package Development bukan hanya tentang teknis - ini tentang berkontribusi pada komunitas Laravel dengan menciptakan solusi yang membantu developer lain. Inilah saatnya kamu menjadi bagian dari ekosistem Laravel yang hebat!

Jangan pernah berhenti belajar dan mencoba. Buat package pertamamu hari ini dan kontribusikan pada komunitas. Selamat ngoding, murid kesayanganku! 🎉

---

## Bagian 9: FAQ (Pertanyaan Sering Ditanyakan) ❓

### 25. 🤔 FAQ Singkat

**Q: Bagaimana cara pengguna men-override view?**
A: Salin file view ke `resources/views/vendor/your-package-name/` dan Laravel akan otomatis menggunakannya.

**Q: Kenapa config saya tidak berubah setelah `vendor:publish`?**
A: Pastikan kamu mem-publish tag yang benar dan clear cache: `php artisan config:clear` atau `php artisan config:cache`.

**Q: Bagaimana cara membuat package yang bisa digunakan di Laravel 8, 9, dan 10?**
A: Gunakan range versi di `composer.json`:
```json
"illuminate/support": "^8.0|^9.0|^10.0"
```

**Q: Bisakah saya gunakan middleware di routes package saya?**
A: Ya! Tapi kamu harus daftarkan middleware di service provider kamu:
```php
$this->app['router']->aliasMiddleware('courier.auth', \Vendor\Courier\Http\Middleware\CourierAuth::class);
```

**Q: Bagaimana cara menangani breaking changes di versi baru?**
A: Ikuti semantic versioning: naikkan MAJOR version saat ada breaking changes, tambahkan dokumentasi migrasi.

**Q: Haruskah saya selalu gunakan Package Discovery?**
A: Tidak selalu. Kadang kamu ingin pengguna mendaftarkan secara manual. Tapi Package Discovery membuat pengalaman pengguna jauh lebih baik.




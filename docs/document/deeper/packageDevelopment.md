# 📦 Pengembangan Package Laravel

## 📖 Daftar Isi

1. [Pendahuluan](#-pendahuluan)
2. [Tipe Package](#-tipe-package)
3. [Struktur Project Package (Contoh)](#-struktur-project-package-contoh)
4. [composer.json & Autoloading](#-composerjson--autoloading)
5. [Service Provider](#-service-provider)
6. [Konfigurasi (Config)](#-konfigurasi-config)
7. [Routes](#-routes)
8. [Migrations](#-migrations)
9. [Bahasa / Translations](#-bahasa--translations)
10. [Views & Blade](#-views--blade)
11. [View Components](#-view-components)
12. [Artisan Commands](#-artisan-commands)
13. [Assets Publik (JS/CSS/Images)](#-assets-publik-jscssimages)
14. [Package Discovery](#-package-discovery)
15. [Testing (Orchestra Testbench)](#-testing-orchestra-testbench)
16. [Checklist Rilis & Best Practices](#-checklist-rilis--best-practices)
17. [FAQ singkat](#-faq-singkat)



## 📖 Pendahuluan

Package adalah cara yang bersih dan reusable untuk menambah fitur ke aplikasi Laravel. Dokumentasi ini membahas pembuatan package **khusus Laravel** (yang biasanya memiliki routes, views, service provider, konfigurasi, dll).

> Narasi: Saat membangun package, tujuan utama adalah membuat antarmuka yang mudah digunakan (API sederhana), dokumentasi jelas, dan instalasi mudah (publikasi resources & package discovery).



## 🧭 Tipe Package

* **Stand-alone package**: Dapat digunakan di framework PHP lain (contoh: Carbon).
* **Laravel-specific package**: Dirancang untuk integrasi dengan Laravel (contoh: Spatie packages).



## 🗂️ Struktur Project Package (Contoh)

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

> Narasi: Struktur ini fleksibel — yang penting penamaan namespace mengikuti PSR-4 agar autoload bekerja lancar.



## 📦 composer.json & Autoloading

Contoh `composer.json` minimal yang mendukung Laravel package discovery:

```json
{
  "name": "vendor/courier",
  "description": "Courier package untuk Laravel",
  "type": "library",
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
    "illuminate/support": "^10.0"
  }
}
```

> Narasi: `extra.laravel.providers` memastikan package dapat di-discover otomatis oleh Laravel (package discovery). Jangan lupa PSR-4 agar kelas dapat dikenali.



## 🛠️ Service Provider

Service Provider adalah jantung integrasi package dengan Laravel. Di sini kita register binding, publish resources, load views, dll.

### Contoh `CourierServiceProvider.php`

```php
<?php

namespace Vendor\Courier\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;
use Illuminate\Foundation\Console\AboutCommand;

class CourierServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Merge config agar default config tetap tersedia
        $this->mergeConfigFrom(__DIR__.'/../../config/courier.php', 'courier');

        // Binding contoh: singleton
        $this->app->singleton('courier', function ($app) {
            return new \Vendor\Courier\CourierService(config('courier'));
        });
    }

    public function boot(): void
    {
        // Publish config
        $this->publishes([
            __DIR__.'/../../config/courier.php' => config_path('courier.php'),
        ], 'courier-config');

        // Load routes
        $this->loadRoutesFrom(__DIR__.'/../../routes/web.php');

        // Load views
        $this->loadViewsFrom(__DIR__.'/../../resources/views', 'courier');

        // Publish views
        $this->publishes([
            __DIR__.'/../../resources/views' => resource_path('views/vendor/courier'),
        ], 'courier-views');

        // Load translations
        $this->loadTranslationsFrom(__DIR__.'/../../resources/lang', 'courier');

        // Publish translations
        $this->publishes([
            __DIR__.'/../../resources/lang' => resource_path('lang/vendor/courier'),
        ], 'courier-lang');

        // Publish public assets (js/css)
        $this->publishes([
            __DIR__.'/../../public' => public_path('vendor/courier'),
        ], 'public');

        // Register Blade component
        Blade::component('package-alert', \Vendor\Courier\View\Components\AlertComponent::class);

        // Register commands only if running in console
        if ($this->app->runningInConsole()) {
            $this->commands([
                \Vendor\Courier\Console\Commands\InstallCommand::class,
            ]);
        }

        // Add info to `php artisan about`
        AboutCommand::add('Courier Package', fn () => ['Version' => '1.0.0']);
    }
}
```

> Narasi: `register()` adalah tempat untuk binding service container dan `mergeConfigFrom`. `boot()` untuk publikasi resource dan hooking lainnya.



## ⚙️ Konfigurasi (Config)

File konfigurasi memungkinkan pengguna package mengatur opsi sesuai kebutuhan.

### Contoh `config/courier.php`

```php
<?php

return [
    'driver' => env('COURIER_DRIVER', 'sync'),
    'key' => env('COURIER_KEY', null),
];
```

### Publish config (di ServiceProvider)

```php
$this->publishes([
    __DIR__.'/../../config/courier.php' => config_path('courier.php'),
], 'courier-config');
```

### Mengakses konfigurasi di package

```php
$value = config('courier.driver');
```

> Catatan penting: **Jangan** menaruh closure di file konfigurasi — tidak akan bisa di-cache (`php artisan config:cache`).



## 🛣️ Routes

Jika package mengandung route, letakkan di `routes/web.php` atau `routes/api.php`.

### Contoh `routes/web.php`

```php
<?php

use Illuminate\Support\Facades\Route;

Route::get('/courier/dashboard', function () {
    return view('courier::dashboard');
});
```

> Narasi: Gunakan `loadRoutesFrom()` di ServiceProvider agar Laravel tidak memuatnya saat route sudah dicache.



## 🗃️ Migrations

Jika package perlu tabel database, sediakan migration dan izinkan pengguna mempublikasikannya.

### Contoh migration `database/migrations/2025_01_01_000000_create_couriers_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('couriers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('service');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('couriers');
    }
};
```

### Publish migrations (di ServiceProvider)

```php
$this->publishesMigrations([
    __DIR__.'/../../database/migrations' => database_path('migrations'),
]);
```

> Narasi: Saat mem-publish migration, Laravel otomatis mengganti timestamp sehingga tidak menimpa migration lain.



## 🌍 Bahasa / Translations

Sertakan file bahasa agar package bisa di-localize.

### Contoh `resources/lang/en/messages.php`

```php
<?php

return [
    'welcome' => 'Welcome to Courier package!',
];
```

### Menggunakan di code

```php
echo trans('courier::messages.welcome');
```

### JSON translations

Jika menggunakan JSON, simpan di `resources/lang/en.json` dan load dengan `loadJsonTranslationsFrom()`.



## 👀 Views & Blade

Tempatkan view di `resources/views` dan gunakan `loadViewsFrom()` agar dapat dirender via `package::view`.

### Contoh `resources/views/dashboard.blade.php`

```blade
@extends('layouts.app')

@section('content')
    <div class="container">
        <h1>Courier Dashboard</h1>
        <x-package-alert />
    </div>
@endsection
```

> Narasi: Pengguna dapat meng-override view dengan menyalin file ke `resources/views/vendor/courier`.



## 🧱 View Components

Dukung komponen Blade agar UI package lebih modular.

### Contoh Komponen (`src/View/Components/AlertComponent.php`)

```php
<?php

namespace Vendor\Courier\View\Components;

use Illuminate\View\Component;

class AlertComponent extends Component
{
    public function render()
    {
        return view('courier::components.alert');
    }
}
```

### Contoh view komponen `resources/views/components/alert.blade.php`

```blade
<div class="alert alert-info">Ini alert dari package Courier</div>
```

### Registrasi (ServiceProvider)

```php
Blade::component('package-alert', \Vendor\Courier\View\Components\AlertComponent::class);
```



## 🖥️ Artisan Commands

Package sering punya perintah Artisan untuk install atau maintenance.

### Contoh Command `src/Console/Commands/InstallCommand.php`

```php
<?php

namespace Vendor\Courier\Console\Commands;

use Illuminate\Console\Command;

class InstallCommand extends Command
{
    protected $signature = 'courier:install';
    protected $description = 'Install the Courier package';

    public function handle()
    {
        $this->info('Publishing configuration...');
        $this->call('vendor:publish', ['--tag' => 'courier-config']);

        $this->info('Done.');
    }
}
```

### Registrasi commands (ServiceProvider)

```php
if ($this->app->runningInConsole()) {
    $this->commands([
        \Vendor\Courier\Console\Commands\InstallCommand::class,
    ]);
}
```



## 🎨 Public Assets (JS/CSS/Images)

Tempatkan file publik di folder `public/` dalam package dan publikasikan ke `public/vendor/package-name`.

```php
$this->publishes([
    __DIR__.'/../../public' => public_path('vendor/courier'),
], 'public');
```

Eksekusi publish:

```bash
php artisan vendor:publish --tag=public --provider="Vendor\\Courier\\Providers\\CourierServiceProvider"
```



## 🔍 Package Discovery

Jika ingin auto-register service provider dan alias, tambahkan `extra.laravel` di `composer.json` (contoh sudah ada di bagian composer.json). Untuk menonaktifkan discovery dari sisi pengguna:

```json
"extra": {
  "laravel": {
    "dont-discover": ["vendor/courier"]
  }
}
```



## 🧪 Testing (Orchestra Testbench)

Gunakan `orchestra/testbench` agar dapat mengetes package layaknya berada di aplikasi Laravel.

### Install untuk dev

```bash
composer require --dev orchestra/testbench
```

### Contoh `tests/TestCase.php`

```php
<?php

namespace Vendor\Courier\Tests;

use Orchestra\Testbench\TestCase as OrchestraTestCase;
use Vendor\Courier\Providers\CourierServiceProvider;

class TestCase extends OrchestraTestCase
{
    protected function getPackageProviders($app)
    {
        return [CourierServiceProvider::class];
    }
}
```

> Narasi: Dengan Testbench Anda bisa menjalankan test pada package tanpa membuat project Laravel terpisah.



## ✅ Checklist Rilis & Best Practices

* [ ] Pastikan `composer.json` punya metadata lengkap (name, description, license, authors).
* [ ] Pastikan PSR-4 autoload benar.
* [ ] Hindari closure di config.
* [ ] Tambahkan tests (unit + integration) menggunakan Testbench.
* [ ] Dokumentasikan cara install & publish resource.
* [ ] Pastikan versi (semver) dan CHANGELOG.
* [ ] Tambahkan CI (GitHub Actions) untuk run tests.



## ❓ FAQ Singkat

**Q:** Bagaimana cara pengguna men-override view?
**A:** Salin file view ke `resources/views/vendor/your-package-name/`.

**Q:** Kenapa config saya tidak berubah setelah `vendor:publish`?
**A:** Pastikan Anda mem-publish tag yang benar dan clear cache: `php artisan config:clear` atau `php artisan config:cache`.




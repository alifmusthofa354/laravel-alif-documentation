# 🏁 Laravel Pennant

Laravel Pennant menyediakan fitur manajemen feature flag yang elegan dan ringkas untuk aplikasi Laravel Anda. Fitur flag memungkinkan Anda untuk mengaktifkan atau menonaktifkan fitur tertentu untuk subset pengguna aplikasi Anda. Ini sangat berguna untuk deployment bertahap, pengujian A/B, dan merilis fitur baru secara bertahap.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [Mendefinisikan Fitur](#mendefinisikan-fitur)
5. [Mengelola Fitur](#mengelola-fitur)
6. [Menggunakan Fitur](#menggunakan-fitur)
7. [Scope Fitur](#scope-fitur)
8. [Blade Directives](#blade-directives)
9. [Middleware](#middleware)
10. [Testing](#testing)
11. [Event](#event)
12. [Custom Drivers](#custom-drivers)

## 🎯 Pendahuluan

Laravel Pennant adalah package manajemen feature flag yang memungkinkan Anda untuk mengaktifkan atau menonaktifkan fitur tertentu untuk pengguna aplikasi Anda. Dengan Pennant, Anda dapat merilis fitur baru secara bertahap, melakukan pengujian A/B, dan mengelola rollout fitur dengan presisi.

### ✨ Fitur Utama
- Manajemen feature flag yang elegan
- Scope berbasis pengguna atau entitas khusus
- Driver database dan in-memory
- Integrasi dengan Blade directives
- Middleware untuk proteksi route
- Event system untuk monitoring
- Testing yang mudah
- Caching otomatis

### ⚠️ Catatan Penting
Pennant dirancang untuk pengelolaan fitur dalam aplikasi produksi. Ini bukan untuk pengembangan lokal atau debugging, tetapi untuk manajemen fitur yang tepat untuk pengguna akhir.

## 📦 Instalasi

### 🎯 Menginstal Pennant
Untuk memulai, instal Pennant melalui Composer:

```bash
composer require laravel/pennant
```

### 🛠️ Publish Resources
Publikasikan file konfigurasi Pennant menggunakan perintah vendor:

```bash
php artisan vendor:publish --provider="Laravel\Pennant\PennantServiceProvider"
```

### 🔧 Run Migrations
Pennant menyertakan migrasi database untuk menyimpan status fitur. Jalankan migrasi:

```bash
php artisan migrate
```

### 🔄 Service Provider
Pennant secara otomatis mendaftarkan service providernya ketika aplikasi menggunakan package discovery.

## ⚙️ Konfigurasi

### 📄 File Konfigurasi
File konfigurasi utama terletak di `config/pennant.php`. File ini memungkinkan Anda mengkonfigurasi driver dan perilaku Pennant.

### 📋 Konfigurasi Dasar
```php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Pennant Store
    |--------------------------------------------------------------------------
    |
    | Here you will specify the store that Pennant should use to store
    | feature flag data. Pennant ships with two stores: "database" and
    | "memory". You may use the "memory" store for testing purposes.
    |
    */

    'stores' => [
        'database' => [
            'driver' => 'database',
            'connection' => null,
            'table' => 'features',
        ],

        'memory' => [
            'driver' => 'memory',
        ],
    ],

    'default' => env('PENNANT_STORE', 'database'),
];
```

### 📋 Konfigurasi Environment
Tambahkan konfigurasi berikut ke file `.env` Anda:

```bash
PENNANT_STORE=database
```

## 🚩 Mendefinisikan Fitur

### 📋 Membuat Feature Class
Fitur didefinisikan dalam class PHP yang mengimplementasikan interface `Feature`. Anda dapat membuat feature class menggunakan perintah Artisan:

```bash
php artisan make:feature NewApi
```

### 📋 Struktur Feature Dasar
```php
<?php

namespace App\Features;

use Laravel\Pennant\Feature;

class NewApi implements Feature
{
    /**
     * Resolve the feature's initial value.
     */
    public function resolve(mixed $scope): mixed
    {
        return false;
    }
}
```

### 📋 Feature dengan Logika Dinamis
```php
<?php

namespace App\Features;

use Laravel\Pennant\Feature;
use App\Models\User;

class NewApi implements Feature
{
    /**
     * Resolve the feature's initial value.
     */
    public function resolve(mixed $scope): mixed
    {
        if ($scope instanceof User) {
            return $scope->isPremium() || $scope->created_at->isToday();
        }

        return false;
    }
}
```

### 📋 Feature dengan Percentage Rollout
```php
<?php

namespace App\Features;

use Laravel\Pennant\Feature;
use Illuminate\Support\Arr;

class NewApi implements Feature
{
    /**
     * Resolve the feature's initial value.
     */
    public function resolve(mixed $scope): mixed
    {
        return match(true) {
            $scope->is_admin => true,
            default => Arr::random([true, false], 1, 10) // 10% rollout
        };
    }
}
```

## 🛠️ Mengelola Fitur

### 📋 Mengaktifkan Fitur
Anda dapat mengaktifkan fitur untuk semua pengguna atau scope tertentu:

```php
use Laravel\Pennant\Feature;

// Mengaktifkan untuk semua pengguna
Feature::activate('new-api');

// Mengaktifkan untuk pengguna tertentu
Feature::activate('new-api', $user);

// Mengaktifkan untuk beberapa pengguna
Feature::activate('new-api', [$user1, $user2, $user3]);
```

### 📋 Menonaktifkan Fitur
```php
// Menonaktifkan untuk semua pengguna
Feature::deactivate('new-api');

// Menonaktifkan untuk pengguna tertentu
Feature::deactivate('new-api', $user);

// Menonaktifkan untuk beberapa pengguna
Feature::deactivate('new-api', [$user1, $user2]);
```

### 📋 Toggle Fitur
```php
// Toggle untuk semua pengguna
Feature::for(null)->activate('new-api');

// Toggle untuk pengguna tertentu
Feature::for($user)->activate('new-api');
```

### 📋 Bulk Operations
```php
// Mengaktifkan banyak fitur
Feature::activate([
    'new-api' => true,
    'new-dashboard' => [$user1, $user2],
    'beta-feature' => true,
]);

// Menonaktifkan banyak fitur
Feature::deactivate([
    'old-api',
    'deprecated-feature' => [$user1],
]);
```

## 🎯 Menggunakan Fitur

### 📋 Memeriksa Status Fitur
```php
use Laravel\Pennant\Feature;

// Memeriksa apakah fitur aktif untuk pengguna saat ini
if (Feature::active('new-api')) {
    // Fitur aktif
}

// Memeriksa apakah fitur aktif untuk pengguna tertentu
if (Feature::for($user)->active('new-api')) {
    // Fitur aktif untuk pengguna ini
}

// Memeriksa beberapa fitur
if (Feature::allAreActive(['new-api', 'new-dashboard'])) {
    // Semua fitur aktif
}

if (Feature::someAreActive(['new-api', 'beta-feature'])) {
    // Minimal satu fitur aktif
}
```

### 📋 Menggunakan dalam Controller
```php
<?php

namespace App\Http\Controllers;

use Laravel\Pennant\Feature;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    public function index(Request $request)
    {
        if (Feature::for($request->user())->active('new-api')) {
            return $this->newApiResponse();
        }

        return $this->legacyApiResponse();
    }
}
```

### 📋 Menggunakan dalam Model
```php
<?php

namespace App\Models;

use Laravel\Pennant\Feature;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /**
     * Determine if the user has access to the new API.
     */
    public function hasNewApiAccess(): bool
    {
        return Feature::for($this)->active('new-api');
    }
}
```

## 🎯 Scope Fitur

### 📋 Scope Berbasis Pengguna
Secara default, Pennant menggunakan pengguna yang diautentikasi sebagai scope:

```php
// Untuk pengguna yang diautentikasi
Feature::active('new-api');

// Untuk pengguna tertentu
Feature::for($user)->active('new-api');
```

### 📋 Scope Kustom
Anda dapat menggunakan scope kustom seperti team, organization, atau entitas lain:

```php
// Scope berbasis team
Feature::for($team)->active('new-feature');

// Scope berbasis organization
Feature::for($organization)->active('enterprise-feature');

// Scope berbasis ID
Feature::for('user:123')->active('beta-feature');
```

### 📋 Scope Implicit
Pennant secara otomatis menggunakan pengguna yang diautentikasi sebagai scope ketika tidak ditentukan:

```php
// Ini secara implisit menggunakan pengguna yang diautentikasi
if (Feature::active('new-feature')) {
    // ...
}
```

## 🎨 Blade Directives

### 📋 @feature Directive
Pennant menyediakan directive Blade untuk memeriksa status fitur:

```blade
@feature('new-api')
    <!-- Konten untuk pengguna dengan akses ke new-api -->
@else
    <!-- Konten untuk pengguna tanpa akses ke new-api -->
@endfeature
```

### 📋 @featurefor Directive
Anda juga dapat memeriksa fitur untuk scope tertentu:

```blade
@featurefor('new-api', $user)
    <!-- Konten untuk pengguna dengan akses ke new-api -->
@endfeaturefor
```

### 📋 Contoh Penggunaan
```blade
@extends('layouts.app')

@section('content')
    @feature('new-dashboard')
        @include('dashboard.new')
    @else
        @include('dashboard.old')
    @endfeature

    @featurefor('beta-feature', $team)
        <div class="alert alert-info">
            Anda memiliki akses ke fitur beta!
        </div>
    @endfeaturefor
@endsection
```

## 🔐 Middleware

### 📋 Membuat Middleware Fitur
Anda dapat membuat middleware untuk melindungi route berdasarkan fitur:

```bash
php artisan make:middleware EnsureFeatureIsEnabled
```

### 📋 Implementasi Middleware
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Pennant\Feature;

class EnsureFeatureIsEnabled
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $feature): mixed
    {
        if (! Feature::active($feature)) {
            abort(404);
        }

        return $next($request);
    }
}
```

### 📋 Menggunakan Middleware
```php
// Dalam route definition
Route::get('/beta-feature', function () {
    // Hanya pengguna dengan akses ke fitur beta
})->middleware('feature:beta-feature');

// Dalam controller
class BetaController extends Controller
{
    public function __construct()
    {
        $this->middleware('feature:beta-feature');
    }
}
```

## 🧪 Testing

### 📋 Testing dengan PHPUnit
Pennant menyediakan helper untuk pengujian fitur:

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use Laravel\Pennant\Feature;
use App\Models\User;

class FeatureTest extends TestCase
{
    public function test_new_api_feature()
    {
        $user = User::factory()->create();
        
        // Mengaktifkan fitur untuk pengujian
        Feature::activate('new-api', $user);
        
        $response = $this->actingAs($user)->get('/api/data');
        
        $response->assertStatus(200);
    }
    
    public function test_feature_inactive()
    {
        $user = User::factory()->create();
        
        // Memastikan fitur tidak aktif
        Feature::deactivate('new-api', $user);
        
        $response = $this->actingAs($user)->get('/api/data');
        
        $response->assertStatus(404);
    }
}
```

### 📋 Testing dengan Pest
```php
<?php

use Laravel\Pennant\Feature;
use App\Models\User;

test('new api feature is active', function () {
    $user = User::factory()->create();
    
    Feature::activate('new-api', $user);
    
    $this->actingAs($user)
        ->get('/api/data')
        ->assertStatus(200);
});

test('feature is inactive by default', function () {
    $user = User::factory()->create();
    
    $this->actingAs($user)
        ->get('/api/data')
        ->assertStatus(404);
});
```

### 📋 Faking Features
Untuk pengujian yang lebih kompleks, Anda dapat memalsukan fitur:

```php
use Laravel\Pennant\Feature;

public function test_with_faked_features()
{
    Feature::fake();
    
    Feature::push(['new-api' => true]);
    
    $this->assertTrue(Feature::active('new-api'));
    
    Feature::push(['new-api' => false]);
    
    $this->assertFalse(Feature::active('new-api'));
}
```

## 📢 Event

### 📋 Pennant Events
Pennant memicu event ketika status fitur berubah:

```php
use Laravel\Pennant\Events\FeatureActivated;
use Laravel\Pennant\Events\FeatureDeactivated;

Event::listen(FeatureActivated::class, function ($event) {
    // Fitur telah diaktifkan
    Log::info("Feature {$event->feature} activated for scope {$event->scope}");
});

Event::listen(FeatureDeactivated::class, function ($event) {
    // Fitur telah dinonaktifkan
    Log::info("Feature {$event->feature} deactivated for scope {$event->scope}");
});
```

### 📋 Listening to Events
Anda dapat membuat listener untuk event Pennant:

```bash
php artisan make:listener HandleFeatureActivation
```

```php
<?php

namespace App\Listeners;

use Laravel\Pennant\Events\FeatureActivated;

class HandleFeatureActivation
{
    public function handle(FeatureActivated $event)
    {
        // Kirim notifikasi
        // Log aktivitas
        // Update statistik
    }
}
```

## 🚀 Custom Drivers

### 📋 Membuat Driver Kustom
Anda dapat membuat driver penyimpanan kustom untuk Pennant:

```php
<?php

namespace App\Pennant\Drivers;

use Laravel\Pennant\Drivers\Decorator;
use Laravel\Pennant\Contracts\Driver;

class RedisDriver implements Driver
{
    use Decorator;

    /**
     * Retrieve the value of a feature flag.
     */
    public function get(string $feature, mixed $scope): mixed
    {
        // Implementasi pengambilan dari Redis
    }

    /**
     * Set the value of a feature flag.
     */
    public function set(string $feature, mixed $scope, mixed $value): void
    {
        // Implementasi penyimpanan ke Redis
    }

    /**
     * Remove the value of a feature flag.
     */
    public function delete(string $feature, mixed $scope): void
    {
        // Implementasi penghapusan dari Redis
    }
}
```

### 📋 Mendaftarkan Driver Kustom
```php
// Dalam AppServiceProvider
use App\Pennant\Drivers\RedisDriver;
use Laravel\Pennant\PennantServiceProvider;

public function register()
{
    PennantServiceProvider::extend('redis', function ($app, $config) {
        return new RedisDriver($config);
    });
}
```

## 🧠 Kesimpulan

Laravel Pennant menyediakan sistem manajemen feature flag yang kuat dan fleksibel untuk aplikasi Laravel Anda. Dengan Pennant, Anda dapat merilis fitur baru secara bertahap, melakukan pengujian A/B, dan mengelola rollout fitur dengan presisi tinggi.

### 🔑 Keuntungan Utama
- Manajemen feature flag yang elegan
- Scope berbasis pengguna atau entitas khusus
- Driver database dan in-memory
- Integrasi dengan Blade directives
- Middleware untuk proteksi route
- Event system untuk monitoring
- Testing yang mudah
- Caching otomatis

### 🚀 Best Practices
1. Gunakan fitur flag untuk rollout bertahap
2. Implementasikan scope yang sesuai dengan kebutuhan bisnis
3. Gunakan middleware untuk proteksi route
4. Monitor aktivitas fitur melalui event
5. Uji implementasi fitur flag secara menyeluruh
6. Gunakan Blade directives untuk tampilan kondisional
7. Bersihkan fitur flag yang sudah tidak digunakan
8. Dokumentasikan setiap fitur flag dengan jelas

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Pennant untuk mengelola fitur dalam aplikasi Laravel Anda.
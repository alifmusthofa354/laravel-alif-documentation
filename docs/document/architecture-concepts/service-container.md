# 📦 Service Container Laravel

Dokumentasi ini membahas secara lengkap mengenai **Laravel Service Container** dalam bahasa Indonesia. Setiap bab dilengkapi dengan penjelasan naratif, contoh kode, serta ikon agar lebih ramah dipahami.

---

## 🚀 Introduction

**Service Container** di Laravel adalah alat yang sangat kuat untuk mengelola *class dependencies* dan melakukan *dependency injection*.

➡️ **Dependency Injection** berarti kita tidak membuat objek secara manual, tetapi "disuntikkan" melalui constructor atau setter method. 

### 🧩 Contoh Sederhana
```php
<?php

namespace App\Http\Controllers;

use App\Services\AppleMusic;
use Illuminate\View\View;

class PodcastController extends Controller
{
    public function __construct(
        protected AppleMusic $apple,
    ) {}

    public function show(string $id): View
    {
        return view('podcasts.show', [
            'podcast' => $this->apple->findPodcast($id)
        ]);
    }
}
```

📖 **Narasi:** 
Dalam contoh di atas, `PodcastController` membutuhkan layanan `AppleMusic`. Dengan dependency injection, kita bisa mengganti implementasi `AppleMusic` dengan versi *mock* saat pengujian.

---

## ⚡ Zero Configuration Resolution

Laravel dapat menyelesaikan dependensi **tanpa konfigurasi tambahan** jika hanya melibatkan class konkret.

### 🔧 Contoh
```php
<?php

class Service
{
    // ...
}

Route::get('/', function (Service $service) {
    dd($service::class);
});
```

📖 **Narasi:** 
Saat kita mengakses route `/`, Laravel otomatis membuat instance `Service` dan menyuntikkannya ke dalam handler. Tidak perlu konfigurasi manual.

---

## 🎯 When to Utilize the Container

Kita sering tidak sadar menggunakan container karena Laravel otomatis melakukan injeksi pada **controller, middleware, event listener, job, dll.**

### ✨ Contoh
```php
use Illuminate\Http\Request;

Route::get('/', function (Request $request) {
    // otomatis request diinject oleh container
});
```

📖 **Narasi:** 
Kita tidak perlu mendaftarkan `Request` ke container, karena Laravel sudah melakukannya secara otomatis di belakang layar.

---

## 🔗 Binding

### 📌 Binding Basics
Binding berarti kita mendaftarkan class atau interface ke dalam container.

#### 🛠️ Simple Bindings
```php
use App\Services\Transistor;
use App\Services\PodcastParser;
use Illuminate\Contracts\Foundation\Application;

$this->app->bind(Transistor::class, function (Application $app) {
    return new Transistor($app->make(PodcastParser::class));
});
```

📖 **Narasi:**
Dengan `bind`, kita bisa menentukan bagaimana sebuah class harus di-*resolve*.

#### 🧭 Singleton
```php
$this->app->singleton(Transistor::class, function (Application $app) {
    return new Transistor($app->make(PodcastParser::class));
});
```

📖 **Narasi:**
`singleton` memastikan objek dibuat sekali saja, lalu digunakan kembali.

#### 🏷️ Scoped
```php
$this->app->scoped(Transistor::class, function (Application $app) {
    return new Transistor($app->make(PodcastParser::class));
});
```

📖 **Narasi:**
`scoped` mirip singleton, tapi hanya berlaku selama satu siklus request/job.

---

## 🧩 Binding Interfaces to Implementations

```php
use App\Contracts\EventPusher;
use App\Services\RedisEventPusher;

$this->app->bind(EventPusher::class, RedisEventPusher::class);
```

📖 **Narasi:**
Sekarang kapanpun kita membutuhkan `EventPusher`, Laravel akan memberikan `RedisEventPusher`.

---

## 🎚️ Contextual Binding

Kadang kita butuh implementasi berbeda untuk interface yang sama.

```php
$this->app->when(PhotoController::class)
    ->needs(Filesystem::class)
    ->give(fn() => Storage::disk('local'));

$this->app->when(VideoController::class)
    ->needs(Filesystem::class)
    ->give(fn() => Storage::disk('s3'));
```

📖 **Narasi:**
`PhotoController` menggunakan `local`, sementara `VideoController` menggunakan `s3`.

---

## 🏷️ Tagging

```php
$this->app->bind(CpuReport::class, fn() => new CpuReport);
$this->app->bind(MemoryReport::class, fn() => new MemoryReport);

$this->app->tag([CpuReport::class, MemoryReport::class], 'reports');
```

📖 **Narasi:**
Kita dapat mengelompokkan beberapa service dengan **tag**, lalu mengambil semuanya sekaligus.

---

## 🔍 Resolving

### 🛠️ Menggunakan `make`
```php
$transistor = $this->app->make(Transistor::class);
```

### 🛠️ Menggunakan `App` facade
```php
use Illuminate\Support\Facades\App;

$transistor = App::make(Transistor::class);
```

📖 **Narasi:**
Dengan `make`, kita memerintahkan container untuk membuat sebuah objek sesuai binding yang ada.

---

## 🧪 Automatic Injection

```php
class PodcastController extends Controller
{
    public function __construct(
        protected AppleMusic $apple,
    ) {}
}
```

📖 **Narasi:**
Cukup *type-hint* class yang dibutuhkan, container akan mengurus sisanya.

---

## ⚡ Method Invocation and Injection

```php
use App\PodcastStats;
use Illuminate\Support\Facades\App;

$stats = App::call([new PodcastStats, 'generate']);
```

📖 **Narasi:**
Dengan `App::call`, kita bisa memanggil method dan Laravel otomatis menginject dependensinya.

---

## 📡 Container Events

```php
$this->app->resolving(Transistor::class, function ($transistor, $app) {
    // dipanggil setiap kali Transistor diresolve
});
```

📖 **Narasi:**
Kita bisa menambahkan logika tambahan setiap kali container membuat objek tertentu.

---

## ♻️ Rebinding

```php
$this->app->rebinding(PodcastPublisher::class, function ($app, $newInstance) {
    // dijalankan saat binding diganti
});
```

📖 **Narasi:**
Rebinding memungkinkan kita bereaksi jika sebuah service di-*override*.

---

## 📜 PSR-11 Support

```php
use Psr\Container\ContainerInterface;

Route::get('/', function (ContainerInterface $container) {
    $service = $container->get(Transistor::class);
});
```

📖 **Narasi:**
Laravel mendukung standar **PSR-11**, sehingga mudah berinteraksi dengan library PHP lain.

---

# ✅ Kesimpulan
Laravel Service Container adalah fondasi dari **dependency injection** di Laravel. Dengan memahaminya, kita bisa membangun aplikasi yang lebih **modular, fleksibel, dan mudah diuji**.
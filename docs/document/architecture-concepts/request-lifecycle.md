# 🔄 Siklus Hidup Request di Laravel

## 📌 Pendahuluan

Saat menggunakan sebuah alat di dunia nyata, kita akan merasa lebih percaya diri jika memahami cara kerjanya. Begitu juga dalam pengembangan aplikasi. Jika kita tahu bagaimana framework bekerja di balik layar, semuanya terasa lebih jelas dan tidak “magis” lagi.

Tujuan dokumen ini adalah memberikan gambaran umum tentang bagaimana **Laravel** memproses setiap request hingga menghasilkan response. Jangan khawatir jika ada istilah yang belum familiar — cukup pahami alurnya, pemahamanmu akan bertambah seiring berjalannya waktu.

---

## 🗂️ Gambaran Umum Lifecycle

Siklus hidup sebuah request di Laravel bisa dibagi menjadi beberapa tahap:

1. **📂 Entry Point** → `public/index.php`
2. **⚙️ Kernel** → HTTP Kernel / Console Kernel
3. **🧩 Service Providers** → Registrasi & bootstrapping
4. **🛣️ Routing** → Dispatch ke route/controller
5. **📤 Finishing** → Response dikirim kembali ke browser

---

## 🚪 Entry Point (First Steps)

Semua request yang masuk ke aplikasi Laravel diarahkan ke file **`public/index.php`** melalui konfigurasi web server (Apache/Nginx).

File ini tidak berisi banyak kode, tetapi berfungsi sebagai **gerbang masuk** aplikasi:

* Memuat **Composer Autoloader**
* Memanggil **bootstrap/app.php** untuk membuat instance aplikasi

📄 Contoh kode `public/index.php`:

```php
<?php

define('LARAVEL_START', microtime(true));

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

$response->send();

$kernel->terminate($request, $response);
```

➡️ Di sini aplikasi Laravel pertama kali di-boot.

---

## ⚙️ HTTP & Console Kernel

Setelah aplikasi dibuat, request masuk akan diproses melalui **Kernel**.
Laravel memiliki dua kernel:

* **🌐 HTTP Kernel** → menangani request web
* **💻 Console Kernel** → menangani perintah artisan

Fokus kita di **HTTP Kernel** (`app/Http/Kernel.php`).

Beberapa tugas HTTP Kernel:

* Menjalankan **bootstrappers** (logging, error handling, environment, dll.)
* Menjalankan **middleware** global & route-specific
* Menangani request → menghasilkan response

📄 Potongan kode HTTP Kernel:

```php
class Kernel extends HttpKernel
{
    protected $middleware = [
        \App\Http\Middleware\TrustProxies::class,
        \Illuminate\Foundation\Http\Middleware\CheckForMaintenanceMode::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \App\Http\Middleware\VerifyCsrfToken::class,
    ];
}
```

➡️ Kernel bisa dianggap sebagai **"kotak hitam"**: menerima request → mengembalikan response.

---

## 🧩 Service Providers

Salah satu langkah penting dalam bootstrap adalah memuat **Service Providers**.

🔑 Fungsi Service Providers:

* Mendaftarkan binding di **Service Container**
* Menginisialisasi komponen framework (database, queue, validation, routing, dll.)
* Memberikan tempat untuk konfigurasi custom aplikasi

Lifecycle service providers:

1. **Register** → mendaftarkan semua binding ke container
2. **Boot** → dijalankan setelah semua provider terdaftar

📄 Contoh `AppServiceProvider`:

```php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Daftarkan service atau binding custom
    }

    public function boot()
    {
        // Inisialisasi logika saat aplikasi berjalan
    }
}
```

➡️ Semua fitur besar Laravel berawal dari **Service Providers**.

---

## 🛣️ Routing

Setelah aplikasi selesai di-boot, request akan dikirim ke **Router**. Router bertugas:

* Mencocokkan request dengan **route** atau **controller**
* Menjalankan **middleware** terkait
* Mengeksekusi handler & mengembalikan response

📄 Contoh route dengan middleware:

```php
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware('auth');
```

➡️ Jika user belum login, middleware `auth` akan mengarahkan ke halaman login. Jika sudah login, request diteruskan ke `dashboard`.

---

## 📤 Finishing Up

Setelah controller menghasilkan response:

1. Response melewati middleware lagi (outgoing)
2. Diteruskan ke **HTTP Kernel**
3. Kernel memanggil `$response->send()`
4. Response dikirim ke browser pengguna

➡️ Pada titik ini, siklus request sudah **selesai** ✅

---

## 🎯 Fokus pada Service Providers

📌 Intinya, alur request Laravel adalah:

1. Aplikasi dibuat → **Service Providers** di-load
2. Request masuk → diproses kernel & middleware
3. Router memutuskan → response dikembalikan ke user

Karena perannya yang besar, **Service Providers** adalah kunci utama dalam proses bootstrap aplikasi Laravel.

📄 Lokasi Service Providers custom:

```
app/Providers
```

---

# 📝 Kesimpulan

* Laravel memproses request secara **berurutan** mulai dari `index.php` hingga response terkirim ke browser.
* **Kernel** berperan sebagai pengatur utama, dengan middleware sebagai filter.
* **Service Providers** adalah jantung bootstrap Laravel — semua fitur penting berasal darinya.

Dengan memahami siklus ini, kita bisa lebih percaya diri dalam mengembangkan aplikasi Laravel tanpa merasa "magis".
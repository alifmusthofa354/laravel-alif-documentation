# Dokumentasi Laravel: Views

## 1. Pendahuluan

Dalam pengembangan aplikasi web, mencampurkan logika bisnis (controller) dengan logika tampilan (HTML) adalah praktik yang buruk. Laravel menyediakan **Views** sebagai solusi untuk memisahkan keduanya.

* **Controller / Application Logic** → Mengatur alur aplikasi dan data.
* **View / Presentation Logic** → Menampilkan data dalam bentuk HTML (atau frontend framework seperti Vue/React).

Views biasanya disimpan di direktori:

```
resources/views
```

Contoh sederhana:

**File view:** `resources/views/greeting.blade.php`

```blade
<html>
    <body>
        <h1>Hello, {{ $name }}</h1>
    </body>
</html>
```

**Route untuk memanggil view:**

```php
Route::get('/', function () {
    return view('greeting', ['name' => 'James']);
});
```

---

## 2. Menulis Views di React / Vue dengan Inertia

Selain Blade, Laravel juga mendukung frontend modern seperti **React** dan **Vue** menggunakan **Inertia.js**.
Keunggulannya:

* Tidak perlu membuat API terpisah.
* Backend Laravel dan frontend React/Vue terhubung dengan mudah.

Starter kit Laravel (Breeze/Jetstream) sudah menyediakan integrasi ini.

---

## 3. Membuat dan Merender Views

### 3.1 Membuat View dengan Artisan

```bash
php artisan make:view greeting
```

Perintah ini akan membuat file:

```
resources/views/greeting.blade.php
```

### 3.2 Merender View

```php
// Menggunakan helper view()
Route::get('/', function () {
    return view('greeting', ['name' => 'James']);
});

// Menggunakan View facade
use Illuminate\Support\Facades\View;

Route::get('/', function () {
    return View::make('greeting', ['name' => 'James']);
});
```

> Argumen pertama (`greeting`) adalah nama file, tanpa `.blade.php`.

---

## 4. Nested View Directories

Views bisa disimpan dalam subfolder. Misalnya:

```
resources/views/admin/profile.blade.php
```

Untuk memanggilnya:

```php
return view('admin.profile', $data);
```

Gunakan **dot notation** untuk memanggil view dalam subfolder.

---

## 5. View Opsional

### 5.1 Membuat View Pertama yang Tersedia

```php
use Illuminate\Support\Facades\View;

return View::first(['custom.admin', 'admin'], $data);
```

### 5.2 Mengecek Apakah View Ada

```php
if (View::exists('admin.profile')) {
    // View tersedia
}
```

---

## 6. Mengoper Data ke View

### 6.1 Dengan Array

```php
return view('greetings', ['name' => 'Victoria']);
```

### 6.2 Dengan Metode `with`

```php
return view('greeting')
    ->with('name', 'Victoria')
    ->with('occupation', 'Astronaut');
```

---

## 7. Berbagi Data ke Semua View

Gunakan `View::share` di `AppServiceProvider@boot`:

```php
namespace App\Providers;

use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        View::share('appName', 'My Laravel App');
    }
}
```

Sekarang variabel `$appName` tersedia di semua view.

---

## 8. View Composers

**View composer** adalah callback/kelas yang otomatis dipanggil setiap kali view dirender.

### 8.1 Contoh Registrasi di Service Provider

```php
Facades\View::composer('profile', \App\View\Composers\ProfileComposer::class);

Facades\View::composer('welcome', function (View $view) {
    $view->with('today', now()->toDateString());
});
```

### 8.2 Contoh Kelas Composer

```php
namespace App\View\Composers;

use App\Repositories\UserRepository;
use Illuminate\View\View;

class ProfileComposer
{
    public function __construct(
        protected UserRepository $users,
    ) {}

    public function compose(View $view): void
    {
        $view->with('count', $this->users->count());
    }
}
```

### 8.3 Composer ke Banyak View

```php
View::composer(['profile', 'dashboard'], MultiComposer::class);
```

### 8.4 Composer untuk Semua View

```php
View::composer('*', function (View $view) {
    $view->with('globalVar', 'Ini berlaku di semua view');
});
```

---

## 9. View Creators

**Creators** mirip dengan composers, hanya saja dijalankan **saat view dibuat**, bukan saat dirender.

```php
use App\View\Creators\ProfileCreator;
use Illuminate\Support\Facades\View;

View::creator('profile', ProfileCreator::class);
```

---

## 10. Optimasi Views

Secara default, view dikompilasi **on-demand**. Untuk mempercepat aplikasi, gunakan cache:

### 10.1 Cache Semua View

```bash
php artisan view:cache
```

### 10.2 Hapus Cache View

```bash
php artisan view:clear
```

---

# Kesimpulan

* **Views** di Laravel memisahkan logika presentasi dari logika aplikasi.
* Bisa menggunakan **Blade**, **React**, atau **Vue** (via Inertia).
* Data bisa dikirim ke view melalui array, `with`, `share`, composer, atau creator.
* View bisa dioptimasi dengan `view:cache`.

---
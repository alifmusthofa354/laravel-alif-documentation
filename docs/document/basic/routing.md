# Routing di Laravel 🚀

## 📑 Table of Contents

* [1️⃣ Konsep Dasar & Pengantar](#_1%EF%B8%8F⃣-konsep-dasar-pengantar)

  * [📌 Apa Itu Routing?](#📌-apa-itu-routing)
  * [⚡ Basic Routing](#⚡-basic-routing)
  * [🗂 Default Route Files: Web vs. API](#🗂-default-route-files-web-vs-api)
* [2️⃣ Elemen-elemen Penting dalam Routing](#_2%EF%B8%8F⃣-elemen-elemen-penting-dalam-routing)

  * [📝 HTTP Methods](#📝-http-methods)
  * [📍 Route Parameters](#📍-route-parameters)
  * [🔒 Regex Constraints](#%F0%9F%94%92-regex-constraints)
* [3️⃣ Fitur Organisasi & Reusabilitas](#_3%EF%B8%8F⃣-fitur-organisasi-reusabilitas)

  * [🏷 Named Routes](#🏷-named-routes)
  * [🧩 Route Groups](#🧩-route-groups)
  * [🧰 Dependency Injection & Model Binding](#🧰-dependency-injection-model-binding)
* [4️⃣ Fitur Lanjutan & Utility](#_4%EF%B8%8F⃣-fitur-lanjutan-utility)

  * [🛡 CSRF Protection](#🛡-csrf-protection)
  * [🔄 Redirect & View Routes](#🔄-redirect-view-routes)
  * [🚨 Fallback Route](#🚨-fallback-route)
  * [⏱ Rate Limiting](#⏱-rate-limiting)
  * [📋 Listing & Caching Routes](#📋-listing-caching-routes)



## 1️⃣ Konsep Dasar & Pengantar

### 📌 Apa Itu Routing?

Secara sederhana, **routing** di Laravel adalah jembatan yang menghubungkan **permintaan URL (URI)** dari browser atau aplikasi lain dengan kode yang akan mengeksekusi aksi tertentu di dalam aplikasi kamu.

Bayangkan setiap URL yang diakses adalah sebuah alamat. Routing adalah sistem navigasi yang mengarahkan "kurir" (yaitu permintaan) ke "rumah" yang tepat (yaitu kode fungsi atau controller yang sesuai). Semua "peta jalan" ini, atau definisi route, disimpan di dalam folder `routes/` di aplikasi Laravel kamu.

Secara default, Laravel menyediakan dua file utama untuk mengorganisir route:

* `routes/web.php` untuk aplikasi web biasa yang membutuhkan sesi dan cookie.
* `routes/api.php` untuk membangun API yang bersifat *stateless*.



### ⚡ Basic Routing

Membuat route paling dasar sangat mudah. Tentukan **HTTP method** (`GET`, `POST`) dan **URL**, lalu tentukan **closure function** atau **controller** yang akan dieksekusi.

```php
use Illuminate\Support\Facades\Route;

Route::get('/greeting', function () {
    return 'Hello World';
});
```

👉 Jika kamu mengetik `http://localhost:8000/greeting` di browser, Laravel akan menampilkan `Hello World`.



### 🗂 Default Route Files: Web vs. API

Laravel memisahkan rute untuk **web** dan **API** agar lebih terorganisir:

* **`routes/web.php`**: Untuk rute yang berhubungan dengan web, dilindungi **middleware `web`**.

```php
use App\Http\Controllers\UserController;

Route::get('/user', [UserController::class, 'index']);
```

* **`routes/api.php`**: Untuk API, dilindungi **middleware `api`**, bersifat *stateless*.

```php
use Illuminate\Http\Request;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
```

#### Mengaktifkan API Routing

```bash
php artisan install:api
```

Semua rute API akan memiliki prefix `/api`.



## 2️⃣ Elemen-elemen Penting dalam Routing

### 📝 HTTP Methods

Contoh penggunaan method HTTP di Laravel:

```php
Route::get('/get-example', fn() => 'GET'); // Membaca data
Route::post('/post-example', fn() => 'POST'); // Mengirim data baru
Route::put('/put-example', fn() => 'PUT'); // Memperbarui data
Route::patch('/patch-example', fn() => 'PATCH'); // Memperbarui sebagian data
Route::delete('/delete-example', fn() => 'DELETE'); // Menghapus data
```

Kamu juga bisa menggunakan `Route::match()` atau `Route::any()`.



### 📍 Route Parameters

* **Required Parameter**:

```php
Route::get('/user/{id}', function ($id) {
    return "User ID: $id";
});
```

* **Optional Parameter**:

```php
Route::get('/user/{name?}', function ($name = "Guest") {
    return "Hello, $name";
});
```



### 🔒 Regex Constraints

Laravel memungkinkan pembatasan format parameter:

| Jenis Constraint | Contoh Route                         | Diterima            | Ditolak          |
| ---------------- | ------------------------------------ | ------------------- | ---------------- |
| Angka            | `->whereNumber('id')`                | `/user/123`         | `/user/abc`      |
| Huruf            | `->whereAlpha('name')`               | `/user/Andi`        | `/user/123`      |
| Huruf + Angka    | `->whereAlphaNumeric('username')`    | `/user/Andi123`     | `/user/andi_123` |
| UUID             | `->whereUuid('id')`                  | `/post/550e8400...` | `/post/123`      |
| ULID             | `->whereUlid('id')`                  | `/order/01ARZ3...`  | `/order/xyz`     |
| Pilihan Tertentu | `->whereIn('cat', ['movie','song'])` | `/category/movie`   | `/category/car`  |



## 3️⃣ Fitur Organisasi & Reusabilitas

### 🏷 Named Routes

```php
Route::get('/user/profile', function () { /* ... */ })->name('profile');

$url = route('profile');
return redirect()->route('profile');
```



### 🧩 Route Groups

```php
Route::middleware(['auth'])->group(function () { /* ... */ });
Route::controller(OrderController::class)->group(function () { /* ... */ });
Route::prefix('admin')->group(function () { /* ... */ });
Route::name('admin.')->group(function () { /* ... */ });
Route::domain('{account}.example.com')->group(function () { /* ... */ });
```



### 🧰 Dependency Injection & Model Binding

```php
use Illuminate\Http\Request;
use App\Models\User;

Route::get('/users', function (Request $request) { /* ... */ });
Route::get('/users/{user}', function (User $user) { /* ... */ });
```



## 4️⃣ Fitur Lanjutan & Utility

### 🛡 CSRF Protection

```html
<form method="POST" action="/profile">
    @csrf
    ...
</form>
```



### 🔄 Redirect & View Routes

```php
Route::redirect('/old', '/new', 301);
Route::view('/welcome', 'welcome', ['name' => 'Taylor']);
```



### 🚨 Fallback Route

```php
Route::fallback(function () {
    return response()->json(['message' => 'Route tidak ditemukan'], 404);
});
```



### ⏱ Rate Limiting

```php
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;

RateLimiter::for('api', fn(Request $r) => Limit::perMinute(60)->by($r->ip()));
```



### 📋 Listing & Caching Routes

* **Listing:**

```bash
php artisan route:list
php artisan route:list -v
php artisan route:list --path=api
php artisan route:list --except-vendor
```

* **Caching:**

```bash
php artisan route:cache
php artisan route:clear
```

⚠️ Gunakan `route:cache` hanya di lingkungan produksi.


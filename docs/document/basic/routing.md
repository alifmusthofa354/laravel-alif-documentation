# Routing di Laravel 🚀

Routing adalah jantung dari setiap aplikasi web, dan di Laravel, sistem routing-nya sangat fleksibel dan kuat. Ini adalah cara kita memberi tahu aplikasi apa yang harus dilakukan ketika pengguna mengunjungi URL tertentu. Mari kita selami lebih dalam\!

-----

## 1\. Konsep Dasar & Pengantar

### Apa Itu Routing?

Secara sederhana, **routing** di Laravel adalah jembatan yang menghubungkan **permintaan URL (URI)** dari browser atau aplikasi lain dengan kode yang akan mengeksekusi aksi tertentu di dalam aplikasi kamu.

Bayangkan setiap URL yang diakses adalah sebuah alamat. Routing adalah sistem navigasi yang mengarahkan "kurir" (yaitu permintaan) ke "rumah" yang tepat (yaitu kode fungsi atau controller yang sesuai). Semua "peta jalan" ini, atau definisi route, disimpan di dalam folder `routes/` di aplikasi Laravel kamu.

Secara default, Laravel menyediakan dua file utama untuk mengorganisir route:

  * `routes/web.php` untuk aplikasi web biasa yang membutuhkan sesi dan cookie.
  * `routes/api.php` untuk membangun API yang bersifat *stateless*.

-----

### Basic Routing

Membuat route paling dasar sangatlah mudah di Laravel. Kamu cukup menentukan **HTTP method** (seperti `GET`, `POST`) dan **URL** yang ingin kamu tangani, kemudian tentukan **closure function** atau **controller** yang akan dieksekusi.

Sebagai contoh, route di bawah ini akan menangani permintaan `GET` ke URL `/greeting` dan langsung mengembalikan teks "Hello World".

```php
use Illuminate\Support\Facades\Route;

Route::get('/greeting', function () {
    return 'Hello World';
});
```

👉 Jadi, jika kamu mengetik `http://localhost:8000/greeting` di browser, Laravel akan menemukan route ini dan menampilkan output `Hello World`.

-----

### Default Route Files: Web vs. API

Laravel secara cerdas memisahkan rute untuk web dan API agar lebih terorganisir. Ini adalah praktik terbaik yang sangat membantu dalam pengembangan aplikasi modern.

  * **`routes/web.php`**: Ini adalah tempat untuk semua rute yang berkaitan dengan antarmuka web, seperti halaman yang kamu lihat di browser. Rute di sini secara otomatis dilindungi oleh **middleware `web`**, yang menyediakan fitur-fitur seperti manajemen sesi, proteksi CSRF, dan enkripsi cookie.

    Contoh: Menampilkan daftar user dari `UserController`.

    ```php
    use App\Http\Controllers\UserController;

    Route::get('/user', [UserController::class, 'index']);
    ```

  * **`routes/api.php`**: File ini diperuntukkan bagi rute yang melayani **API (Application Programming Interface)**. API biasanya digunakan oleh aplikasi mobile atau JavaScript frontend untuk bertukar data. Route di sini dilindungi oleh **middleware `api`**, yang membuat mereka bersifat **stateless**, artinya tidak menggunakan sesi atau cookie.

    Contoh: Mengambil data user yang sedang login melalui token API.

    ```php
    use Illuminate\Http\Request;

    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');
    ```

#### Mengaktifkan API Routing

Jika kamu ingin mengaktifkan fungsionalitas API, kamu bisa menjalankan perintah ini:

```bash
php artisan install:api
```

Perintah ini akan menginstal **Laravel Sanctum** untuk otentikasi API berbasis token dan membuat file `routes/api.php` jika belum ada. Secara default, semua rute di `routes/api.php` akan memiliki awalan (**prefix**) `/api`.

-----

## 2\. Elemen-elemen Penting dalam Routing

### HTTP Methods

Setiap interaksi di web menggunakan **HTTP methods** (atau verbs) untuk mengindikasikan jenis aksi yang dilakukan. Router Laravel mendukung semua method ini dengan baik.

Berikut adalah contoh penggunaan berbagai method HTTP:

```php
Route::get('/get-example', fn() => 'GET'); // Membaca data
Route::post('/post-example', fn() => 'POST'); // Mengirimkan data baru
Route::put('/put-example', fn() => 'PUT'); // Memperbarui data
Route::patch('/patch-example', fn() => 'PATCH'); // Memperbarui sebagian data
Route::delete('/delete-example', fn() => 'DELETE'); // Menghapus data
```

Kamu juga bisa membuat rute yang merespons **lebih dari satu method** menggunakan `Route::match()`, atau merespons **semua method** dengan `Route::any()`.

-----

### Route Parameters

Seringkali, kamu perlu menangkap bagian dinamis dari URL, seperti ID user atau nama produk. Inilah fungsi dari **route parameters**.

  * **Required Parameter**: Parameter yang **wajib** ada di URL. Jika tidak, Laravel akan mengembalikan error 404 (Not Found).
    ```php
    Route::get('/user/{id}', function ($id) {
        return "User ID: $id";
    });
    ```
  * **Optional Parameter**: Kamu bisa membuat parameter menjadi **opsional** dengan menambahkan tanda tanya `?` di belakang namanya.
    ```php
    Route::get('/user/{name?}', function ($name = "Guest") {
        return "Hello, $name";
    });
    ```

-----

### Regex Constraints

Kadang kamu perlu membatasi format dari parameter, misalnya hanya menerima angka. Kamu bisa melakukannya dengan metode `->where()`.

| Jenis Constraint | Contoh Route | Diterima | Ditolak |
| --- | --- | --- | --- |
| **Angka** | `->whereNumber('id')` | `/user/123` | `/user/abc` |
| **Huruf** | `->whereAlpha('name')` | `/user/Andi` | `/user/123` |
| **Huruf + Angka** | `->whereAlphaNumeric('username')` | `/user/Andi123` | `/user/andi_123` |
| **UUID** | `->whereUuid('id')` | `/post/550e8400...` | `/post/123` |
| **ULID** | `->whereUlid('id')` | `/order/01ARZ3...` | `/order/xyz` |
| **Pilihan Tertentu** | `->whereIn('cat', ['movie','song'])` | `/category/movie` | `/category/car` |

#### Global Regex Constraint

Untuk menghindari duplikasi kode dan menjaga konsistensi, gunakan **Global Constraints** dengan mendaftarkan pola di `AppServiceProvider`.

```php
use Illuminate\Support\Facades\Route;

public function boot(): void
{
    // Setiap parameter bernama 'id' akan otomatis dibatasi hanya menerima angka
    Route::pattern('id', '[0-9]+'); 
}
```

#### Encoded Forward Slashes

Secara default, Laravel menganggap `/` sebagai pemisah segmen URL. Untuk mengizinkan slash di dalam parameter, tambahkan regex `.*`.

```php
Route::get('/search/{search}', function ($search) {
    return $search;
})->where('search', '.*');
```

⚠️ **Catatan penting**: Regex `.*` hanya bisa digunakan di **parameter terakhir** sebuah rute.

-----

## 3\. Fitur Organisasi & Reusabilitas

### Named Routes

Memberi nama pada rute sangat penting. Nama ini berfungsi sebagai alias yang memudahkan kamu untuk merujuk ke rute tersebut di tempat lain di aplikasi, seperti saat membuat URL atau melakukan redirect, tanpa harus menulis ulang URL-nya.

**Menentukan Nama Rute**

```php
Route::get('/user/profile', function () { /* ... */ })->name('profile');
```

**Menggunakan Nama Rute**

```php
$url = route('profile');
return redirect()->route('profile');
```

-----

### Route Groups

**Route Groups** memungkinkan kamu untuk mengelompokkan rute dengan atribut yang sama. Ini adalah cara yang efisien untuk menghindari duplikasi kode.

  * **Middleware**: Menerapkan middleware ke sekelompok rute.
    ```php
    Route::middleware(['auth'])->group(function () { /* ... */ });
    ```
  * **Controllers**: Menggunakan controller yang sama untuk semua rute dalam grup.
    ```php
    Route::controller(OrderController::class)->group(function () { /* ... */ });
    ```
  * **Prefixes**: Menambahkan awalan ke URL atau nama rute.
    ```php
    Route::prefix('admin')->group(function () { /* ... */ });
    Route::name('admin.')->group(function () { /* ... */ });
    ```
  * **Subdomain Routing**: Mengelompokkan rute berdasarkan subdomain.
    ```php
    Route::domain('{account}.example.com')->group(function () { /* ... */ });
    ```

-----

### Dependency Injection & Model Binding

**Dependency Injection** memungkinkan kamu menginjeksikan kelas yang dibutuhkan langsung ke dalam rute, seperti objek `Request`. **Route Model Binding** adalah fitur luar biasa yang secara otomatis mengambil data dari database berdasarkan nilai parameter di URL.

```php
use Illuminate\Http\Request;
use App\Models\User;

Route::get('/users', function (Request $request) { /* ... */ });
Route::get('/users/{user}', function (User $user) { /* ... */ });
```

-----

## 4\. Fitur Lanjutan & Utility

### CSRF Protection

Laravel secara otomatis melindungi form web dari serangan **CSRF (Cross-Site Request Forgery)**. Untuk semua form dengan method `POST`, `PUT`, `PATCH`, atau `DELETE`, kamu **wajib** menyertakan token CSRF menggunakan `@csrf`.

```html
<form method="POST" action="/profile">
    @csrf
    ...
</form>
```

-----

### Redirect & View Routes

Laravel juga menyediakan shortcut yang sangat berguna:

  * Mengalihkan pengguna dari satu URL ke URL lain dengan status HTTP tertentu.

<!-- end list -->

```php
Route::redirect('/old', '/new', 301); 
```

  * Langsung mengembalikan sebuah view tanpa perlu membuat controller atau closure function yang kompleks.

<!-- end list -->

```php
Route::view('/welcome', 'welcome', ['name' => 'Taylor']);
```

-----

### Fallback Route

**Fallback route** adalah rute yang akan dijalankan jika tidak ada rute lain yang cocok dengan permintaan yang masuk. Ini berguna untuk menampilkan halaman 404 kustom. Pastikan untuk menempatkan fallback route sebagai rute **terakhir**.

```php
Route::fallback(function () {
    return response()->json(['message' => 'Route tidak ditemukan'], 404);
});
```

-----

### Rate Limiting

**Rate limiting** digunakan untuk membatasi jumlah permintaan yang bisa diterima dari satu IP atau user dalam jangka waktu tertentu. Ini berguna untuk mencegah penyalahgunaan API atau serangan.

```php
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;

RateLimiter::for('api', fn(Request $r) => Limit::perMinute(60)->by($r->ip()));
```

-----

### Listing & Caching Routes

Untuk mengelola dan mengoptimalkan performa rute, kamu bisa menggunakan perintah Artisan.
#### Listing
Lihat semua route dengan:

```bash
php artisan route:list
```

Tambahan:

* Tampilkan middleware → `php artisan route:list -v`
* Filter path → `php artisan route:list --path=api`
* Exclude vendor → `php artisan route:list --except-vendor`

#### caching
Menyimpan rute ke dalam cache untuk performa lebih cepat di lingkungan produksi.

  ```bash
php artisan route:cache   # cache route
php artisan route:clear   # clear cache
```

⚠️ **Penting**: Jalankan `route:cache` hanya di lingkungan produksi.
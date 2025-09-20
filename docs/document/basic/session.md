# 📘 Session di Laravel

## Pendahuluan

HTTP adalah protokol **stateless**. Artinya, setiap permintaan (request) yang dikirim oleh pengguna tidak menyimpan informasi dari permintaan sebelumnya. Untuk mengatasi hal ini, **session** digunakan agar aplikasi dapat menyimpan informasi pengguna di antara beberapa request.

Laravel menyediakan berbagai **backend session** seperti file, cookie, database, Redis, Memcached, DynamoDB, hingga array. Semua ini diakses melalui API yang ekspresif dan seragam.

---

## 1. Konfigurasi Session

Konfigurasi session di Laravel terdapat di file:

```
config/session.php
```

Secara default, Laravel menggunakan **database session driver**.

### Opsi Driver Session

* **file** → disimpan di `storage/framework/sessions`.
* **cookie** → disimpan di cookie terenkripsi.
* **database** → disimpan dalam tabel database.
* **memcached / redis** → disimpan di sistem cache berbasis memori.
* **dynamodb** → disimpan di AWS DynamoDB.
* **array** → disimpan dalam array PHP (tidak persisten, cocok untuk testing).

📌 **Catatan**: Driver `array` hanya untuk testing karena data tidak tersimpan permanen.

---

## 2. Prasyarat Driver

### a. Database

Jika menggunakan driver **database**, pastikan tersedia tabel `sessions`. Laravel sudah menyiapkan migrasi khusus untuk membuat tabel ini:

```bash
php artisan make:session-table
php artisan migrate
```

### b. Redis

Untuk menggunakan Redis, pastikan salah satu sudah terpasang:

* **PhpRedis** (ekstensi PHP melalui PECL), atau
* **predis/predis** melalui Composer.

Di `.env`, Anda bisa mengatur koneksi Redis khusus untuk session:

```
SESSION_DRIVER=redis
SESSION_CONNECTION=default
```

---

## 3. Bekerja dengan Session

Ada dua cara utama berinteraksi dengan session:

1. **Melalui instance `Request`**
2. **Menggunakan helper global `session()`**

### a. Mengambil Data dari Session

Menggunakan **Request**:

```php
$value = $request->session()->get('key', 'default');
```

Menggunakan **helper global**:

```php
$value = session('key', 'default');
```

### b. Menyimpan Data ke Session

```php
// Via Request instance
$request->session()->put('key', 'value');

// Via helper global
session(['key' => 'value']);
```

### c. Menghapus Data dari Session

```php
// Hapus satu data
$request->session()->forget('name');

// Hapus semua data
$request->session()->flush();
```

### d. Contoh di Controller

```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function show(Request $request, string $id)
    {
        // Ambil session
        $username = $request->session()->get('username', 'Guest');

        // Simpan data ke session
        $request->session()->put('last_visited', now());

        return view('user.profile', compact('username'));
    }
}
```

---

## 4. Manipulasi Session

### a. Menambahkan Data ke Array

```php
$request->session()->push('user.teams', 'developers');
```

### b. Ambil & Hapus Sekaligus

```php
$value = $request->session()->pull('key', 'default');
```

### c. Increment / Decrement

```php
$request->session()->increment('count', 2);
$request->session()->decrement('count', 1);
```

---

## 5. Flash Data

Flash data digunakan untuk menyimpan data hanya untuk request berikutnya. Cocok untuk **notifikasi** atau **pesan sukses**.

```php
$request->session()->flash('status', 'Data berhasil disimpan!');
```

Jika ingin data flash bertahan lebih lama:

```php
$request->session()->reflash(); // semua data flash
$request->session()->keep(['status']); // hanya key tertentu
```

---

## 6. Regenerasi Session ID

Untuk keamanan (mencegah **session fixation attack**), session ID bisa diregenerasi:

```php
$request->session()->regenerate();
```

Atau jika ingin sekaligus menghapus semua data session:

```php
$request->session()->invalidate();
```

---

## 7. Session Cache

Laravel menyediakan **session cache** yang scoped per user. Contoh penggunaannya:

```php
// Simpan data cache di session
$request->session()->cache()->put('discount', 10, now()->addMinutes(5));

// Ambil data cache
$discount = $request->session()->cache()->get('discount');
```

---

## 8. Session Blocking

Secara default, Laravel mengizinkan request paralel dengan session yang sama. Namun, ini bisa menimbulkan **data race condition**.

Untuk mengatasi hal tersebut, gunakan method `block()` pada route:

```php
Route::post('/profile', function () {
    // ...
})->block(10, 10);
```

Parameter:

* **lockSeconds**: Lama lock dipegang (default 10 detik).
* **waitSeconds**: Lama request menunggu lock (default 10 detik).

---

## 9. Custom Session Driver

Jika driver bawaan tidak sesuai, kita bisa membuat driver kustom dengan mengimplementasikan **SessionHandlerInterface**.

### a. Contoh MongoDB Session Handler

```php
namespace App\Extensions;

class MongoSessionHandler implements \SessionHandlerInterface
{
    public function open($savePath, $sessionName) {}
    public function close() {}
    public function read($sessionId) {}
    public function write($sessionId, $data) {}
    public function destroy($sessionId) {}
    public function gc($lifetime) {}
}
```

### b. Registrasi Driver

Tambahkan di `App\Providers\SessionServiceProvider`:

```php
namespace App\Providers;

use App\Extensions\MongoSessionHandler;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\ServiceProvider;

class SessionServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Session::extend('mongo', function (Application $app) {
            return new MongoSessionHandler;
        });
    }
}
```

Lalu ubah di `.env`:

```
SESSION_DRIVER=mongo
```

---

# Kesimpulan

* **Session** di Laravel mempermudah penyimpanan data antar request.
* Laravel mendukung berbagai **driver** (file, DB, Redis, dll).
* Kita dapat **membaca, menyimpan, menghapus, flash data, hingga custom driver** sesuai kebutuhan.
* Fitur tambahan seperti **session cache** dan **session blocking** membantu pengelolaan data yang lebih aman dan efisien.

---

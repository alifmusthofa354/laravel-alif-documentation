# HTTP Requests di Laravel

Dalam pengembangan aplikasi web, **HTTP Request** adalah fondasi utama komunikasi antara client (seperti browser atau aplikasi mobile) dan server. Laravel menyediakan class `Illuminate\Http\Request` yang memberikan cara berorientasi objek untuk berinteraksi dengan request yang sedang diproses.
Dengan class ini, kita dapat dengan mudah mengambil input, cookie, file, serta memeriksa informasi lain yang terkait dengan request.

---

## 📘Berinteraksi dengan Request

#### Mengakses Request

Untuk mendapatkan instance dari request yang sedang berjalan, kita dapat menggunakan **Dependency Injection** dengan menambahkan type-hint `Illuminate\Http\Request` pada method controller atau route closure. Laravel akan otomatis menyuntikkan (inject) request tersebut.

**Contoh pada Controller:**

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Store a new user.
     */
    public function store(Request $request): RedirectResponse
    {
        $name = $request->input('name');

        // Simpan user...

        return redirect('/users');
    }
}
```

**Contoh pada Route Closure:**

```php
use Illuminate\Http\Request;

Route::get('/', function (Request $request) {
    // Akses request di sini...
});
```

---

#### Dependency Injection dan Parameter Route

Kadang kita perlu mengakses parameter dari route sekaligus instance `Request`. Laravel mengizinkan keduanya dengan menuliskan parameter route setelah dependency lainnya.

**Contoh Route:**

```php
use App\Http\Controllers\UserController;

Route::put('/user/{id}', [UserController::class, 'update']);
```

**Contoh Controller:**

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Update the specified user.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        // Update user berdasarkan $id...

        return redirect('/users');
    }
}
```

---

### Path, Host, dan Method dari Request

#### Mengambil Path Request

Method `path()` digunakan untuk mendapatkan informasi path dari request.

```php
$uri = $request->path(); 
// contoh hasil: "foo/bar"
```

#### Mengecek Path / Route

Laravel menyediakan method `is()` untuk memeriksa apakah path cocok dengan pola tertentu.

```php
if ($request->is('admin/*')) {
    // request menuju ke path "admin/..."
}
```

Sedangkan `routeIs()` digunakan untuk memeriksa nama route:

```php
if ($request->routeIs('admin.*')) {
    // request menggunakan route dengan prefix admin
}
```

---

#### Mengambil URL Request

* **URL tanpa query string**

  ```php
  $url = $request->url();
  ```

* **URL dengan query string**

  ```php
  $urlWithQueryString = $request->fullUrl();
  ```

* **Menambahkan query string ke URL**

  ```php
  $newUrl = $request->fullUrlWithQuery(['type' => 'phone']);
  ```

* **Menghapus query string tertentu**

  ```php
  $cleanUrl = $request->fullUrlWithoutQuery(['type']);
  ```

---

#### Mengambil Host Request

Laravel menyediakan beberapa method:

```php
$request->host();              // contoh: "example.com"
$request->httpHost();          // contoh: "example.com:80"
$request->schemeAndHttpHost(); // contoh: "http://example.com"
```

---

#### Mengambil Method Request

Untuk mengetahui HTTP verb dari request, gunakan:

```php
$method = $request->method();

if ($request->isMethod('post')) {
    // Request menggunakan POST
}
```

---

### Headers pada Request

Kita dapat mengambil header tertentu dengan method `header()`.

```php
$value = $request->header('X-Header-Name');
$valueWithDefault = $request->header('X-Header-Name', 'default');
```

Untuk mengecek apakah header tersedia:

```php
if ($request->hasHeader('X-Header-Name')) {
    // Header tersedia
}
```

Mengambil **Bearer Token** dari header Authorization:

```php
$token = $request->bearerToken();
```

---

### Alamat IP Request

Laravel menyediakan method untuk mengambil alamat IP client:

```php
$ipAddress = $request->ip();
```

Jika ingin mendapatkan semua alamat IP (termasuk forwarded proxies):

```php
$ipAddresses = $request->ips();
```

> ⚠️ Catatan: Alamat IP dianggap sebagai input yang tidak sepenuhnya terpercaya, sehingga hanya digunakan untuk informasi tambahan.

---

### Content Negotiation

Laravel mendukung pemeriksaan tipe konten yang diminta client berdasarkan header `Accept`.

* **Mendapatkan semua tipe konten yang diterima:**

  ```php
  $contentTypes = $request->getAcceptableContentTypes();
  ```

* **Memeriksa apakah request menerima tipe tertentu:**

  ```php
  if ($request->accepts(['text/html', 'application/json'])) {
      // ...
  }
  ```

* **Menentukan konten yang lebih disukai:**

  ```php
  $preferred = $request->prefers(['text/html', 'application/json']);
  ```

* **Mengecek apakah request mengharapkan JSON:**

  ```php
  if ($request->expectsJson()) {
      // ...
  }
  ```

---

### PSR-7 Requests

Laravel mendukung standar **PSR-7** untuk HTTP messages. Dengan ini, request dan response dapat menggunakan interface standar industri.

#### Instalasi Library

Jalankan perintah berikut:

```bash
composer require symfony/psr-http-message-bridge
composer require nyholm/psr7
```

#### Contoh Penggunaan

```php
use Psr\Http\Message\ServerRequestInterface;

Route::get('/', function (ServerRequestInterface $request) {
    // Menggunakan PSR-7 request
});
```

Jika kita mengembalikan response PSR-7, Laravel akan otomatis mengonversinya kembali ke instance response Laravel.


---

## 📘Input pada HTTP Request di Laravel

### Pendahuluan

Selain menyediakan informasi tentang path, method, dan headers dari sebuah request, Laravel juga mempermudah kita untuk **mengambil data input** yang dikirimkan melalui form HTML, query string, JSON, maupun metode lainnya.
Class `Illuminate\Http\Request` menyediakan berbagai method untuk mengakses input ini dengan cara yang aman, konsisten, dan fleksibel.

---

### Mengambil Seluruh Data Input

Untuk mendapatkan semua data input dari request dalam bentuk array, gunakan method `all()`.

```php
$input = $request->all();
```

Jika ingin mengubahnya menjadi collection (agar lebih mudah diolah menggunakan method koleksi Laravel), gunakan `collect()`:

```php
$input = $request->collect();
```

Bahkan kita bisa mengambil subset data input sebagai collection:

```php
$request->collect('users')->each(function (string $user) {
    // Proses setiap user...
});
```

---

### Mengambil Nilai Input Tertentu

#### Menggunakan `input()`

Method `input()` memungkinkan kita mengambil nilai dari request tanpa peduli apakah datanya dikirim via GET, POST, atau JSON.

```php
$name = $request->input('name');
```

Kita juga bisa memberikan nilai default jika data tidak tersedia:

```php
$name = $request->input('name', 'Sally');
```

Jika input berupa array (misalnya pada form dengan multiple field), kita bisa menggunakan **dot notation**:

```php
$name = $request->input('products.0.name'); 
$names = $request->input('products.*.name');
```

Memanggil `input()` tanpa parameter akan mengembalikan semua input sebagai array:

```php
$input = $request->input();
```

---

#### Input dari Query String

Gunakan `query()` jika ingin mengambil data **hanya dari query string**:

```php
$name = $request->query('name', 'Helen');
```

Atau mengambil semua query string sekaligus:

```php
$query = $request->query();
```

---

#### Input dari JSON

Jika request berupa JSON dengan header `Content-Type: application/json`, kita tetap bisa menggunakan `input()`:

```php
$name = $request->input('user.name');
```

---

### Mengambil Input dengan Tipe Tertentu

Laravel menyediakan berbagai helper untuk memastikan tipe data yang diambil sesuai kebutuhan.

* **Stringable Input**

  ```php
  $name = $request->string('name')->trim();
  ```

* **Integer Input**

  ```php
  $perPage = $request->integer('per_page');
  ```

* **Boolean Input**
  (berguna untuk checkbox / switch form)

  ```php
  $archived = $request->boolean('archived');
  ```

* **Array Input**

  ```php
  $versions = $request->array('versions');
  ```

* **Date Input**
  Mengambil data tanggal sebagai instance Carbon:

  ```php
  $birthday = $request->date('birthday');
  $elapsed  = $request->date('elapsed', '!H:i', 'Europe/Madrid');
  ```

* **Enum Input**
  Mendukung PHP Enum:

  ```php
  use App\Enums\Status;

  $status = $request->enum('status', Status::class);
  ```

---

### Dynamic Properties

Selain method, kita bisa langsung mengakses input seolah-olah itu adalah properti dari request:

```php
$name = $request->name;
```

Laravel akan mencari input dari payload terlebih dahulu, jika tidak ada baru dari parameter route.

---

### Mengambil Sebagian Data Input

* Mengambil subset tertentu:

  ```php
  $input = $request->only(['username', 'password']);
  ```
* Mengabaikan field tertentu:

  ```php
  $input = $request->except('credit_card');
  ```

---

### Mengecek Keberadaan Input

Laravel menyediakan berbagai method untuk mengecek apakah input ada, kosong, atau bernilai.

* **Cek apakah ada:**

  ```php
  if ($request->has('name')) { ... }
  ```
* **Cek apakah semua ada:**

  ```php
  if ($request->has(['name', 'email'])) { ... }
  ```
* **Cek apakah salah satu ada:**

  ```php
  if ($request->hasAny(['name', 'email'])) { ... }
  ```
* **Cek jika tidak kosong (filled):**

  ```php
  if ($request->filled('name')) { ... }
  ```
* **Cek jika kosong (isNotFilled):**

  ```php
  if ($request->isNotFilled('name')) { ... }
  ```
* **Cek jika salah satu terisi (anyFilled):**

  ```php
  if ($request->anyFilled(['name', 'email'])) { ... }
  ```

Kita juga bisa menggunakan `whenHas`, `whenFilled`, dan `whenMissing` untuk menjalankan closure secara kondisional.

---

### Menambahkan / Menggabungkan Input

Kadang kita ingin menambahkan data tambahan ke dalam request.

* **Merge (menimpa jika sudah ada):**

  ```php
  $request->merge(['votes' => 0]);
  ```
* **Merge jika tidak ada:**

  ```php
  $request->mergeIfMissing(['votes' => 0]);
  ```

---

### Old Input (Input Lama)

Laravel memungkinkan kita menyimpan input lama ke session agar bisa digunakan di request berikutnya, biasanya untuk mengisi kembali form setelah validasi gagal.

#### Flashing Input ke Session

```php
$request->flash();
$request->flashOnly(['username', 'email']);
$request->flashExcept('password');
```

#### Flashing Input + Redirect

```php
return redirect('/form')->withInput();
return redirect()->route('user.create')->withInput();
```

#### Mengambil Old Input

```php
$username = $request->old('username');
```

Di Blade:

```blade
<input type="text" name="username" value="{{ old('username') }}">
```

---

### Cookies

Semua cookies yang dibuat Laravel akan **terenkripsi dan ditandatangani**. Untuk mengambil cookies:

```php
$value = $request->cookie('name');
```

---

### Normalisasi Input

Secara default, Laravel menambahkan middleware:

* `TrimStrings` → menghapus spasi pada string input.
* `ConvertEmptyStringsToNull` → mengubah string kosong menjadi `null`.

Hal ini dilakukan agar data input lebih konsisten.

#### Menonaktifkan Normalisasi

Jika ingin menonaktifkan global:

```php
use Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull;
use Illuminate\Foundation\Http\Middleware\TrimStrings;

->withMiddleware(function (Middleware $middleware): void {
    $middleware->remove([
        ConvertEmptyStringsToNull::class,
        TrimStrings::class,
    ]);
})
```

Atau menonaktifkan hanya untuk route tertentu:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->convertEmptyStringsToNull(except: [
        fn (Request $request) => $request->is('admin/*'),
    ]);

    $middleware->trimStrings(except: [
        fn (Request $request) => $request->is('admin/*'),
    ]);
})
```

---

### Kesimpulan

Dengan fitur input handling Laravel, kita dapat:

* Mengambil data dari berbagai sumber (form, query string, JSON).
* Mengubah data input menjadi tipe tertentu (string, integer, boolean, array, date, enum).
* Menyimpan input lama untuk repopulasi form.
* Mengontrol normalisasi input secara otomatis.

Semua ini membuat proses pengelolaan data dari request menjadi jauh lebih aman, konsisten, dan efisien.

---



## 📘Files pada HTTP Request di Laravel

### Pendahuluan

Laravel tidak hanya memudahkan kita dalam mengelola input teks atau query string, tetapi juga menyediakan API yang powerful untuk menangani **file upload**.
Semua file yang diunggah melalui form akan tersedia dalam instance `Illuminate\Http\Request`, dan dapat diakses menggunakan method atau dynamic property.

---

### Mengambil File yang Diunggah

Untuk mengambil file, gunakan method `file()` atau akses langsung dengan dynamic property. File yang diambil akan berupa instance dari `Illuminate\Http\UploadedFile`, yang memperluas class PHP `SplFileInfo`.

```php
$file = $request->file('photo');

// atau dengan dynamic property
$file = $request->photo;
```

#### Mengecek Apakah File Ada

Sebelum mengakses file, pastikan file memang ada pada request:

```php
if ($request->hasFile('photo')) {
    // File tersedia
}
```

---

### Validasi Upload Berhasil

Selain mengecek keberadaan file, kita juga bisa memastikan bahwa file diunggah tanpa error dengan `isValid()`:

```php
if ($request->file('photo')->isValid()) {
    // File berhasil diunggah
}
```

---

### Path dan Ekstensi File

Class `UploadedFile` menyediakan method untuk mengakses path file yang diunggah serta menebak ekstensi berdasarkan isi file.

```php
$path = $request->photo->path();
$extension = $request->photo->extension();
```

⚠️ Perlu dicatat: ekstensi yang ditebak bisa berbeda dengan ekstensi asli dari client, karena Laravel mencoba mendeteksi berdasarkan isi file.

---

### Method Lain pada UploadedFile

Selain `path()` dan `extension()`, masih banyak method lain pada class `UploadedFile`, seperti `getSize()`, `getMimeType()`, dan sebagainya. Dokumentasi API Laravel dapat dirujuk untuk detail lebih lengkap.

---

### Menyimpan File yang Diunggah

Untuk menyimpan file, Laravel memanfaatkan sistem **filesystem** yang bisa berupa:

* Local storage (misalnya `storage/app`).
* Cloud storage (seperti **Amazon S3**, **Google Cloud Storage**, atau **Azure**).

#### Menggunakan `store()`

Method `store()` akan menyimpan file di lokasi yang ditentukan dan secara otomatis memberikan nama file unik.

```php
$path = $request->photo->store('images'); // disimpan di storage/app/images

$path = $request->photo->store('images', 's3'); // disimpan di disk S3
```

Method ini mengembalikan **path relatif** dari file terhadap root direktori disk yang digunakan.

---

#### Menggunakan `storeAs()`

Jika ingin menentukan nama file sendiri, gunakan `storeAs()`:

```php
$path = $request->photo->storeAs('images', 'filename.jpg');

$path = $request->photo->storeAs('images', 'filename.jpg', 's3');
```

Dengan cara ini, nama file tidak akan diubah oleh Laravel.

---

### Kesimpulan

Laravel menyediakan cara sederhana dan aman untuk menangani file upload:

* Mengambil file dengan `file()` atau dynamic property.
* Memastikan file ada dengan `hasFile()` dan valid dengan `isValid()`.
* Mendapatkan informasi file seperti path dan ekstensi.
* Menyimpan file dengan fleksibilitas tinggi menggunakan `store()` atau `storeAs()`, baik di local storage maupun layanan cloud.

Hal ini membuat pengelolaan file menjadi lebih konsisten dan terintegrasi dengan baik di dalam ekosistem Laravel.

---

## 📘Mengonfigurasi Trusted Proxies & Hosts di Laravel

### Pendahuluan

Dalam beberapa kasus, aplikasi Laravel dijalankan di belakang **load balancer** atau **reverse proxy** (misalnya AWS ELB, Nginx proxy, Cloudflare, dll).
Kondisi ini dapat menyebabkan aplikasi salah mendeteksi protokol atau host yang digunakan, contohnya ketika aplikasi menghasilkan link HTTP padahal seharusnya HTTPS.

Untuk mengatasi hal ini, Laravel menyediakan middleware bawaan:

* `TrustProxies` → mengatur proxy yang dipercaya dan header yang digunakan.
* `TrustHosts` → membatasi aplikasi agar hanya menerima request dengan host tertentu.

---

### Mengonfigurasi Trusted Proxies

#### Masalah Umum

Ketika load balancer mengarahkan trafik ke aplikasi Laravel di port **80**, aplikasi mengira request menggunakan HTTP biasa, padahal aslinya client menggunakan **HTTPS**. Hal ini menyebabkan helper seperti `url()` atau `route()` menghasilkan link HTTP, bukan HTTPS.

#### Solusi dengan TrustProxies

Aktifkan middleware `Illuminate\Http\Middleware\TrustProxies` di file `bootstrap/app.php`. Kita dapat menentukan daftar proxy atau balancer yang dipercaya.

**Contoh konfigurasi:**

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->trustProxies(at: [
        '192.168.1.1',
        '10.0.0.0/8',
    ]);
})
```

#### Mengonfigurasi Proxy Headers

Selain IP proxy, kita juga dapat menentukan **header** mana yang harus dipercaya.

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->trustProxies(headers: 
        Request::HEADER_X_FORWARDED_FOR |
        Request::HEADER_X_FORWARDED_HOST |
        Request::HEADER_X_FORWARDED_PORT |
        Request::HEADER_X_FORWARDED_PROTO |
        Request::HEADER_X_FORWARDED_AWS_ELB
    );
})
```

* Jika menggunakan **AWS Elastic Load Balancing**, gunakan `Request::HEADER_X_FORWARDED_AWS_ELB`.
* Jika proxy mendukung standar **RFC 7239 Forwarded header**, gunakan `Request::HEADER_FORWARDED`.

ℹ️ Dokumentasi Symfony menjelaskan lebih detail konstanta header yang dapat digunakan.

---

#### Mempercayai Semua Proxies

Jika kita menggunakan cloud provider (misalnya AWS, GCP, Azure) di mana IP load balancer bisa berubah-ubah, kita bisa mempercayai semua proxy dengan simbol `*`.

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->trustProxies(at: '*');
})
```

⚠️ Hati-hati, opsi ini bisa berisiko jika aplikasi tidak berada di lingkungan terkontrol, karena mempercayai semua proxy dapat membuka potensi spoofing.

---

### Mengonfigurasi Trusted Hosts

#### Perilaku Default

Secara default, Laravel akan merespons **semua request** yang masuk, tanpa peduli apa isi header `Host`. Header ini juga digunakan saat Laravel membuat **absolute URL**.

Namun, demi keamanan, kita biasanya ingin membatasi aplikasi agar hanya menerima request untuk host tertentu.

---

#### Mengaktifkan TrustHosts

Aktifkan middleware `Illuminate\Http\Middleware\TrustHosts` di `bootstrap/app.php` dan tentukan host yang valid:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->trustHosts(at: ['laravel.test']);
})
```

Request dengan `Host` yang tidak ada di daftar ini akan **ditolak**.

---

#### Subdomain

Secara default, Laravel juga mempercayai request yang berasal dari subdomain. Jika ingin menonaktifkan perilaku ini:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->trustHosts(at: ['laravel.test'], subdomains: false);
})
```

---

#### Menggunakan Closure untuk Host Dinamis

Jika host perlu ditentukan dari konfigurasi atau database, gunakan closure:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->trustHosts(at: fn () => config('app.trusted_hosts'));
})
```

---

### Kesimpulan

* Gunakan `TrustProxies` untuk mengatur **proxy/load balancer** yang dipercaya, serta header yang digunakan.
* Gunakan `TrustHosts` untuk membatasi aplikasi hanya menerima request dengan **host tertentu**.
* Konfigurasi ini penting untuk memastikan aplikasi menghasilkan URL yang benar (HTTPS/HTTP) serta menolak request berbahaya dari host yang tidak sah.

---

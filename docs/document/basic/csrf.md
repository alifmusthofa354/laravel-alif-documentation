# 📘 Proteksi CSRF di Laravel

## 1. Pendahuluan

Cross-Site Request Forgery (CSRF) adalah salah satu bentuk serangan keamanan aplikasi web yang memanfaatkan otentikasi pengguna untuk menjalankan perintah berbahaya tanpa sepengetahuan mereka.

Laravel menyediakan mekanisme bawaan untuk melindungi aplikasi dari serangan CSRF dengan sangat mudah melalui penggunaan **token CSRF** yang terintegrasi dengan session.

---

## 2. Penjelasan Kerentanan CSRF

Sebelum memahami cara Laravel mengatasi serangan ini, mari lihat contoh sederhana bagaimana CSRF bisa dieksploitasi.

Bayangkan aplikasi memiliki route `/user/email` dengan method `POST` untuk mengubah alamat email pengguna yang sedang login. Form sederhana seperti berikut biasanya digunakan:

```html
<form action="/user/email" method="POST">
    <input type="email" name="email" placeholder="Masukkan email baru">
    <button type="submit">Simpan</button>
</form>
```

Jika aplikasi **tidak** menggunakan proteksi CSRF, penyerang bisa membuat form palsu di situs mereka sendiri:

```html
<form action="https://your-application.com/user/email" method="POST">
    <input type="email" value="malicious-email@example.com">
</form>

<script>
    document.forms[0].submit();
</script>
```

Ketika korban yang sudah login ke aplikasi mengunjungi situs berbahaya ini, form otomatis dikirim ke server dan alamat email pengguna sah akan berubah tanpa persetujuan mereka.

➡️ **Masalah utama:** server tidak tahu apakah request datang dari pengguna sah atau dari situs luar.

---

## 3. Mencegah Request CSRF di Laravel

Laravel secara otomatis membuat **CSRF token** unik untuk setiap session pengguna. Token ini diverifikasi setiap kali request `POST`, `PUT`, `PATCH`, atau `DELETE` diterima oleh aplikasi.

### 3.1 Mengakses Token

Token CSRF dapat diambil dengan dua cara:

```php
use Illuminate\Http\Request;

Route::get('/token', function (Request $request) {
    $token = $request->session()->token();

    $token = csrf_token();

    return $token;
});
```

### 3.2 Menambahkan Token ke Form

Setiap form yang mengirim request selain `GET` wajib menyertakan token. Laravel mempermudah dengan directive Blade `@csrf`:

```blade
<form method="POST" action="/profile">
    @csrf
    
    <!-- Sama dengan -->
    <input type="hidden" name="_token" value="{{ csrf_token() }}">
    
    <button type="submit">Update Profil</button>
</form>
```

Middleware bawaan Laravel `ValidateCsrfToken` akan memastikan token dari request cocok dengan token session. Jika sesuai, request dianggap valid.

---

## 4. CSRF pada SPA (Single Page Application)

Untuk aplikasi SPA yang menggunakan Laravel sebagai backend API, proteksi CSRF biasanya ditangani dengan **Laravel Sanctum**. Sanctum menyediakan sistem autentikasi berbasis token sekaligus proteksi CSRF untuk API yang diakses oleh browser.

---

## 5. Mengecualikan Route dari CSRF

Ada kalanya route tertentu harus dikecualikan dari proteksi CSRF, misalnya ketika menerima webhook dari pihak ketiga (Stripe, Midtrans, dsb).

Anda bisa menambahkan pengecualian di `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->validateCsrfTokens(except: [
        'stripe/*',
        'http://example.com/foo/bar',
        'http://example.com/foo/*',
    ]);
})
```

⚠️ **Catatan:** Gunakan dengan hati-hati, hanya pada route yang benar-benar perlu.

---

## 6. Proteksi CSRF di AJAX & API

Laravel juga mendukung proteksi CSRF melalui header request.

### 6.1 Menggunakan Header `X-CSRF-TOKEN`

Anda bisa menyimpan token di `<meta>` tag lalu menginstruksikan library JS seperti jQuery untuk otomatis menambahkannya ke setiap request:

```blade
<meta name="csrf-token" content="{{ csrf_token() }}">
```

```javascript
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
```

### 6.2 Menggunakan Cookie `XSRF-TOKEN`

Laravel secara otomatis mengirim cookie `XSRF-TOKEN` terenkripsi di setiap response. Beberapa framework JS (seperti Angular & Axios) akan otomatis menambahkan cookie ini ke header `X-XSRF-TOKEN` pada setiap request **same-origin**.

Contoh konfigurasi Axios (`resources/js/bootstrap.js`):

```javascript
import axios from 'axios';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
```

---

## 7. Ringkasan

* CSRF adalah serangan yang memanfaatkan session pengguna untuk mengirim request berbahaya.
* Laravel menggunakan token CSRF untuk melindungi setiap request `POST`, `PUT`, `PATCH`, dan `DELETE`.
* Token bisa ditambahkan secara otomatis dengan `@csrf` directive.
* Untuk SPA, gunakan Laravel Sanctum.
* Route tertentu (misalnya webhook) bisa dikecualikan dari proteksi CSRF.
* AJAX dan framework JS bisa menggunakan `X-CSRF-TOKEN` atau `X-XSRF-TOKEN` untuk request aman.

---

👉 Dengan proteksi bawaan Laravel, risiko serangan CSRF dapat diminimalisir tanpa konfigurasi kompleks.

---

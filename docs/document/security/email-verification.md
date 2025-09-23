# 📧 Email Verification di Laravel

## 📖 Pendahuluan
Banyak aplikasi web yang mengharuskan pengguna **memverifikasi alamat email** mereka sebelum dapat menggunakan fitur-fitur tertentu.  
Laravel menyediakan layanan bawaan yang sangat memudahkan dalam **mengirim dan memverifikasi permintaan verifikasi email**, sehingga kita tidak perlu membangun fitur ini dari nol.

👉 Cara tercepat untuk memulai adalah dengan menginstal **Laravel starter kit** (misalnya Breeze atau Jetstream). Starter kit ini otomatis membuatkan sistem autentikasi lengkap termasuk dukungan verifikasi email.

---

## 👤 Persiapan Model
Sebelum memulai, pastikan model `App\Models\User` mengimplementasikan kontrak `Illuminate\Contracts\Auth\MustVerifyEmail`.

```php
<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable;

    // ...
}
````

✅ Dengan menambahkan interface `MustVerifyEmail`, setiap pengguna baru akan otomatis menerima email berisi tautan verifikasi.
Hal ini terjadi karena Laravel secara otomatis mendaftarkan listener `SendEmailVerificationNotification` pada event `Registered`.

Jika kamu membuat proses registrasi manual (tanpa starter kit), jangan lupa memicu event `Registered` setelah registrasi sukses:

```php
use Illuminate\Auth\Events\Registered;

event(new Registered($user));
```

---

## 🗄️ Persiapan Database

Tabel `users` harus memiliki kolom `email_verified_at` untuk menyimpan **tanggal & waktu** verifikasi email.
Biasanya, ini sudah tersedia secara default di migration Laravel:

```php
$table->timestamp('email_verified_at')->nullable();
```

---

## 🛣️ Routing Verifikasi Email

Untuk implementasi lengkap, kita memerlukan **tiga route utama**:

1. **Route Notifikasi** → Memberitahu user untuk mengecek email verifikasi.
2. **Route Handler** → Menangani klik link verifikasi di email.
3. **Route Resend** → Mengirim ulang email verifikasi jika user kehilangan email sebelumnya.

---

### 📌 1. Email Verification Notice

Route ini menampilkan halaman yang memberitahu pengguna untuk mengecek email.

```php
Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->middleware('auth')->name('verification.notice');
```

⚡ Penting: Nama route harus **`verification.notice`** karena middleware `verified` akan mengarahkan user yang belum terverifikasi ke route ini.

---

### 📌 2. Email Verification Handler

Route ini menangani saat user mengklik tautan di email.

```php
use Illuminate\Foundation\Auth\EmailVerificationRequest;

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return redirect('/home');
})->middleware(['auth', 'signed'])->name('verification.verify');
```

🔎 Perhatikan: Kita menggunakan `EmailVerificationRequest` yang otomatis memvalidasi parameter `id` dan `hash`.
Metode `fulfill()` akan menandai email user sebagai terverifikasi.

---

### 📌 3. Resend Verification Email

Jika user kehilangan email verifikasi, kita sediakan route untuk mengirim ulang.

```php
use Illuminate\Http\Request;

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return back()->with('message', 'Verification link sent!');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');
```

🛡️ Middleware `throttle:6,1` membatasi pengiriman maksimal 6 kali per menit.

---

## 🔒 Melindungi Route

Gunakan middleware `verified` agar hanya pengguna yang sudah memverifikasi email yang dapat mengakses route tertentu.

```php
Route::get('/profile', function () {
    // Hanya user yang sudah verifikasi email yang bisa mengakses
})->middleware(['auth', 'verified']);
```

Jika belum terverifikasi, user otomatis diarahkan ke `verification.notice`.

---

## 🎨 Kustomisasi

Laravel menyediakan opsi untuk **mengubah isi email verifikasi**.
Kita bisa memodifikasi template email menggunakan `VerifyEmail::toMailUsing`.

```php
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

public function boot(): void
{
    VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
        return (new MailMessage)
            ->subject('Verifikasi Alamat Email')
            ->line('Klik tombol di bawah ini untuk memverifikasi alamat email Anda.')
            ->action('Verifikasi Email', $url);
    });
}
```

✨ Dengan ini, kita bisa menyesuaikan **subject**, **pesan**, maupun **CTA button** sesuai kebutuhan aplikasi.

---

## 📡 Events

Saat proses verifikasi berhasil, Laravel memicu event:

* `Illuminate\Auth\Events\Verified`

Jika kamu mengelola verifikasi secara manual, event ini bisa dipicu sendiri untuk melakukan aksi tambahan (misalnya logging atau notifikasi internal).

---

## ✅ Kesimpulan

* Laravel mempermudah proses verifikasi email dengan layanan bawaan.
* Kita hanya perlu menambahkan interface `MustVerifyEmail`, menyiapkan kolom database, dan mendefinisikan beberapa route.
* Middleware `verified` memastikan hanya user yang sudah verifikasi email yang bisa mengakses route tertentu.
* Email verifikasi bisa dikustomisasi agar lebih sesuai dengan branding aplikasi.

🚀 Dengan mengikuti langkah-langkah ini, sistem verifikasi email di aplikasi Laravel akan berjalan aman, rapi, dan fleksibel!

```

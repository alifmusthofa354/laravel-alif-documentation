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

# 📧 Verifikasi Email di Laravel: Perlindungan Digital untuk Akun Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Hari ini kita akan belajar tentang fitur penting yang sering diabaikan tapi sangat ampuh dalam menjaga keamanan aplikasi kita: **Verifikasi Email**.

Setelah beberapa kali revisi, akhirnya Guru paham apa yang sebenarnya kalian inginkan: sebuah panduan yang **super lengkap** tapi dijelaskan dengan **super sederhana**, seolah-olah Guru sedang duduk di sebelahmu sambil menjelaskan pelan-pelan.

Verifikasi email adalah seperti "kartu identitas digital" untuk pengguna. Ini memastikan bahwa orang yang mendaftar benar-benar pemilik email tersebut, bukan penipu atau bot. Tanpa verifikasi, akunmu rentan terhadap penyalahgunaan. Siap? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Verifikasi Email Itu Sebenarnya?

**Analogi:** Bayangkan kamu mendaftar di sebuah klub eksklusif. Mereka tidak langsung memberimu akses ke semua ruangan, kan? Mereka akan mengirimkan email ke alamatmu dengan **link rahasia**. Hanya dengan mengklik link itu, kamu dianggap sebagai anggota resmi.

**Mengapa ini penting?** Karena dengan verifikasi email, kamu tahu bahwa:
1.  **Emailnya valid**: Orang tersebut benar-benar punya akses ke email yang didaftarkan
2.  **Tidak spam**: Akun tidak dibuat sembarangan oleh bot
3.  **Aman**: Jika terjadi masalah akun, kamu bisa menghubungi lewat email yang sudah diverifikasi

**Bagaimana cara kerjanya?** Prosesnya seperti ini:

`➡️ User Mendaftar -> 📧 Email Verifikasi Dikirim -> ✅ User Klik Link -> 🏷️ Akun Dianggap Sah -> 🔐 Akses Fitur Lengkap`

Tanpa verifikasi email, siapa pun bisa mendaftar dengan email palsu dan langsung mengakses fitur penting aplikasimu. Jangan sampai itu terjadi! 😳

### 2. ✍️ Resep Pertamamu: Melindungi Akun Dengan Verifikasi

Ini adalah fondasi paling dasar. Mari kita aktifkan verifikasi email di aplikasimu dari nol, langkah demi langkah.

#### Langkah 1️⃣: Persiapkan Model Pengguna (User Model)
**Mengapa?** Kita butuh memberi tahu Laravel bahwa pengguna harus diverifikasi emailnya.

**Bagaimana?** Tambahkan interface `MustVerifyEmail` ke model User.

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
```

**Penjelasan Kode:**
- `implements MustVerifyEmail`: Ini adalah kontrak bahwa pengguna harus memverifikasi emailnya
- Dengan ini, pengguna baru otomatis akan menerima email verifikasi saat mendaftar
- Jika kamu membuat registrasi manual (tanpa starter kit), tambahkan event ini setelah registrasi:
  ```php
  use Illuminate\Auth\Events\Registered;

  event(new Registered($user));
  ```

#### Langkah 2️⃣: Siapkan Database (Kolom Verifikasi)
**Mengapa?** Kita butuh tempat menyimpan informasi kapan email pengguna sudah diverifikasi.

**Bagaimana?** Pastikan tabel `users` memiliki kolom `email_verified_at`.

```php
$table->timestamp('email_verified_at')->nullable();
```

Kolom ini otomatis akan diisi dengan tanggal dan waktu saat pengguna klik link verifikasi.

### 3. ⚡ Membangun Perlindungan Otomatis dengan Breeze/Jetstream

**Analogi:** Bayangkan kamu ingin membangun sistem keamanan rumah kompleks. Daripada menyusun semua komponen satu per satu, kamu bisa langsung menggunakan paket lengkap yang sudah terintegrasi.

**Mengapa ini ada?** Laravel starter kit (Breeze atau Jetstream) otomatis mengatur sistem autentikasi lengkap termasuk verifikasi email.

**Bagaimana?** Sangat mudah, cukup install salah satunya:

```bash
composer require laravel/breeze --dev
php artisan breeze:install
```

Atau untuk Jetstream (dengan Livewire atau Inertia):

```bash
composer require laravel/jetstream
php artisan jetstream:install livewire
```

Dengan ini, semua route, view, dan logika verifikasi sudah siap pakai!

---

## Bagian 2: Persiapan Perlindungan - Database & Model 🗄️

### 4. 🏗️ Membangun Fondasi Database

**Analogi:** Seperti membangun rumah, kamu butuh fondasi yang kuat. Untuk verifikasi email, fondasinya adalah struktur database yang tepat.

**Mengapa ini penting?** Kita butuh kolom khusus untuk menyimpan status verifikasi email pengguna.

**Bagaimana?** Pastikan migrasi user sudah menyertakan kolom ini:

```php
// Biasanya sudah otomatis ada di create_users_table migration
$table->timestamp('email_verified_at')->nullable();
```

Jika kolom ini tidak ada, kamu bisa membuat migrasi tambahan:

```bash
php artisan make:migration add_email_verified_at_to_users_table
```

Lalu isi dengan:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('email_verified_at')->nullable();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('email_verified_at');
        });
    }
};
```

### 5. 🛡️ Menyiapkan Model User dengan Perlindungan

**Mengapa?** Kita butuh memberi tahu Laravel bahwa model User mendukung verifikasi email.

**Bagaimana?** Sudah dijelaskan di Langkah 1, tapi penting untuk diingatkan kembali:

```php
<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable;

    // ... properti dan metode lainnya
}
```

Dengan implementasi `MustVerifyEmail`, Laravel otomatis akan:
- Mengirim email verifikasi saat user baru terdaftar
- Membatasi akses ke route yang memerlukan verifikasi
- Menyediakan logika untuk memproses link verifikasi

---

## Bagian 3: Membangun Gerbang Perlindungan - Routing Verifikasi 🛣️

### 6. 📌 Gerbang Verifikasi: Tiga Pintu Akses Utama

**Analogi:** Bayangkan sistem keamanan di gedung bertingkat. Ada tiga gerbang utama: gerbang pemberitahuan (kamu belum verifikasi), gerbang verifikasi (tempat konfirmasi identitas), dan gerbang pengiriman ulang (jika kamu kehilangan kartu akses).

**Mengapa ini penting?** Kita butuh tiga route utama untuk mengatur proses verifikasi email.

**Bagaimana?** Berikut adalah tiga route wajib:

#### Pintu 1️⃣: Gerbang Pemberitahuan (Email Verification Notice)

Route ini menampilkan halaman yang memberitahu pengguna untuk mengecek email mereka.

```php
Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->middleware('auth')->name('verification.notice');
```

**⚠️ Catatan Penting:** Nama route HARUS `verification.notice` karena middleware `verified` akan mengarahkan user yang belum terverifikasi ke route ini.

#### Pintu 2️⃣: Gerbang Verifikasi (Email Verification Handler)

Route ini menangani saat user mengklik tautan di email mereka.

```php
use Illuminate\Foundation\Auth\EmailVerificationRequest;

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return redirect('/home');
})->middleware(['auth', 'signed'])->name('verification.verify');
```

**Penjelasan Kode:**
- `{id}/{hash}`: Parameter unik untuk mengidentifikasi user dan memvalidasi keaslian link
- `EmailVerificationRequest`: Request khusus yang otomatis memvalidasi parameter
- `fulfill()`: Metode yang menandai email sebagai terverifikasi
- `signed`: Middleware yang memastikan link tidak dipalsukan

#### Pintu 3️⃣: Gerbang Pengiriman Ulang (Resend Verification Email)

Jika user kehilangan email verifikasi, kita sediakan route untuk mengirim ulang.

```php
use Illuminate\Http\Request;

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return back()->with('message', 'Verification link sent!');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');
```

**Penjelasan Kode:**
- `sendEmailVerificationNotification()`: Method yang mengirim ulang email
- `throttle:6,1`: Middleware yang membatasi pengiriman maksimal 6 kali per menit (mencegah spam)

### 7. 🎯 Memahami Alur Verifikasi Secara Lengkap

Mari kita kupas alur lengkap verifikasi email:

1. **User Mendaftar** → Menerima email verifikasi otomatis
2. **User Klik Link** → Dibawa ke `/email/verify/{id}/{hash}`
3. **Laravel Validasi** → Memastikan link sah dan user valid
4. **Email Ditandai Ter-verifikasi** → Kolom `email_verified_at` diisi
5. **User Dapat Akses Lengkap** → Bisa mengakses fitur yang sebelumnya dibatasi

### 8. 🔐 Melindungi Route dengan Middleware "Verified"

**Mengapa?** Kita hanya ingin memberi akses ke fitur penting kepada user yang sudah diverifikasi.

**Bagaimana?** Gunakan middleware `verified` di route yang ingin dilindungi:

```php
Route::get('/profile', function () {
    // Hanya user yang sudah verifikasi email yang bisa mengakses
})->middleware(['auth', 'verified']);
```

Jika user belum terverifikasi dan mencoba mengakses route ini, Laravel akan otomatis mengarahkan ke `verification.notice`.

**Contoh Lengkap Perlindungan Route:**

```php
// routes/web.php
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/settings', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

// Route yang tidak perlu verifikasi (misalnya halaman publik)
Route::get('/welcome', function () {
    return view('welcome');
});
```

### 9. 🎨 Kustomisasi Email Verifikasi (Dekorasi Pesan Perlindungan)

**Mengapa?** Agar email verifikasi sesuai dengan branding aplikasimu dan terlihat profesional.

**Bagaimana?** Kamu bisa memodifikasi isi email menggunakan `VerifyEmail::toMailUsing`:

```php
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

// Di AppServiceProvider atau boot method dari service provider lain
public function boot(): void
{
    VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
        return (new MailMessage)
            ->subject('Verifikasi Alamat Email Anda')
            ->line('Selamat datang! Kami perlu memastikan bahwa ini benar-benar email Anda.')
            ->line('Silakan klik tombol di bawah untuk memverifikasi alamat email Anda.')
            ->action('Verifikasi Email', $url)
            ->line('Jika Anda tidak membuat akun, abaikan email ini.');
    });
}
```

Dengan ini, kamu bisa menyesuaikan:
- Subject email
- Pesan pembuka dan penutup  
- Tombol aksi dan teksnya
- Gaya keseluruhan email

### 10. 📡 Memantau Proses Verifikasi dengan Events

**Analogi:** Seperti sistem keamanan yang mencatat setiap kali akses diberikan. Kamu bisa melacak kapan verifikasi berhasil.

**Mengapa?** Untuk logging, analytics, atau menjalankan aksi tambahan saat verifikasi berhasil.

**Bagaimana?** Laravel memicu event `Illuminate\Auth\Events\Verified` saat proses berhasil:

```php
// Di EventServiceProvider
protected $listen = [
    \Illuminate\Auth\Events\Verified::class => [
        \App\Listeners\LogSuccessfulVerification::class,
    ],
];
```

**Contoh Listener:**
```php
<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Log;

class LogSuccessfulVerification
{
    public function handle(Verified $event)
    {
        Log::info('User verified their email', [
            'user_id' => $event->user->id,
            'email' => $event->user->email,
            'verified_at' => now(),
        ]);
    }
}
```

Jika kamu mengelola verifikasi secara manual, kamu juga bisa memicu event ini sendiri:

```php
use Illuminate\Auth\Events\Verified;

event(new Verified($user));
```

---

## Bagian 4: Jurus Tingkat Lanjut - Perlindungan Cerdas 🚀

### 11. 🛡️ Perlindungan Multi-Layer (Verifikasi + Role)

**Analogi:** Seperti sistem keamanan bertingkat di gedung penting - kamu butuh kartu akses (verifikasi email) DAN hak istimewa (role admin).

**Mengapa?** Kombinasi verifikasi dan role-based access control memberikan perlindungan maksimal.

**Bagaimana?** Gunakan beberapa middleware sekaligus:

```php
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'index']);
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::resource('admin/posts', PostController::class);
});
```

### 12. 🎨 Custom Verification Views (Tampilan Verifikasi Kustom)

**Mengapa?** Agar halaman verifikasi sesuai dengan tampilan aplikasimu.

**Bagaimana?** Buat view kustom dan gunakan di route:

```php
Route::get('/email/verify', function () {
    return view('custom.verify-email');
})->middleware('auth')->name('verification.notice');
```

**Contoh View Kustom:**
```blade
<!-- resources/views/custom/verify-email.blade.php -->
@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Verifikasi Email Anda</div>
                
                <div class="card-body">
                    @if (session('message'))
                        <div class="alert alert-success" role="alert">
                            {{ session('message') }}
                        </div>
                    @endif

                    <p>Sebelum melanjutkan, silakan cek email Anda untuk tautan verifikasi.</p>
                    
                    <p>Belum menerima email? 
                        <form method="POST" action="{{ route('verification.send') }}" class="d-inline">
                            @csrf
                            <button type="submit" class="btn btn-link p-0 m-0" style="border: none; background: none;">
                                Klik di sini untuk mengirim ulang
                            </button>
                        </form>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
```

### 13. 🔒 Verifikasi Custom Logic (Logika Verifikasi Kustom)

**Mengapa?** Untuk kebutuhan bisnis yang lebih kompleks seperti verifikasi dua faktor tambahan.

**Bagaimana?** Kamu bisa memperluas logika verifikasi:

```php
// Di User model
public function markEmailAsVerified()
{
    $this->forceFill([
        'email_verified_at' => $this->freshTimestamp(),
        'email_verification_token' => null, // Jika kamu menggunakan custom token
    ])->save();

    event(new Verified($this));
    
    // Logika tambahan bisa ditambahkan di sini
    $this->sendWelcomeNotification();
}

// Custom method untuk verifikasi manual
public function verifyEmailManually($token)
{
    if ($this->email_verification_token === $token) {
        $this->markEmailAsVerified();
        return true;
    }
    
    return false;
}
```

### 14. 🧩 Verifikasi dengan Provider Eksternal

**Mengapa?** Jika kamu menggunakan socialite atau login dengan provider eksternal, kamu mungkin masih ingin verifikasi email.

**Bagaimana?** Pastikan provider juga menandai email sebagai terverifikasi jika mereka sudah memverifikasinya:

```php
// Di login handler dengan Socialite
$user = User::firstOrCreate(
    ['email' => $userData->email],
    [
        'name' => $userData->name,
        'password' => bcrypt(Str::random(24)),
    ]
);

// Jika provider sudah memverifikasi email
if ($userData->email_verified) {
    $user->markEmailAsVerified();
}
```

---

## Bagian 5: Menjadi Master Perlindungan Email 🏆

### 15. ✨ Wejangan dari Guru

1.  **Verifikasi Email Wajib**: Jangan pernah mengabaikan fitur ini. Perlindungan dasar yang sangat efektif.
2.  **Gunakan Starter Kit**: Breeze/Jetstream sangat membantu untuk setup cepat dan aman.
3.  **Kustomisasi Tampilan**: Buat email dan halaman verifikasi sesuai branding aplikasimu.
4.  **Monitor dan Log**: Lacak aktivitas verifikasi untuk keamanan dan analytics.
5.  **Gabungkan dengan Perlindungan Lain**: Kombinasikan dengan rate limiting, captcha, dan role management.

### 16. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk fitur verifikasi email di Laravel:

#### 🏗️ Setup Dasar
| Langkah | Fungsi |
|---------|--------|
| `implements MustVerifyEmail` | Wajib di User model |
| Kolom `email_verified_at` | Di tabel users |
| Install Breeze/Jetstream | Setup otomatis |

#### 🛣️ Route Wajib
| Route | Tujuan |
|-------|--------|
| `verification.notice` | Halaman pemberitahuan |
| `verification.verify` | Handler verifikasi |
| `verification.send` | Resend email |

#### 🔐 Perlindungan Route
| Middleware | Fungsi |
|------------|--------|
| `verified` | Batasi akses ke user ter-verifikasi |
| `throttle:6,1` | Batasi pengiriman email verifikasi |

#### 🎨 Kustomisasi
| Fungsi | Cara |
|--------|------|
| Custom email | `VerifyEmail::toMailUsing()` |
| Custom view | Ganti view di route `verification.notice` |
| Custom logic | Override method di User model |

#### 📡 Events
| Event | Trigger |
|-------|---------|
| `Illuminate\Auth\Events\Verified` | Saat verifikasi berhasil |

### 17. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Verifikasi Email, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Dengan memahami dan menerapkan fitur ini, kamu telah menambahkan lapisan keamanan penting ke aplikasimu.

Verifikasi email mungkin terlihat sepele, tapi dampaknya sangat besar dalam menjaga integritas dan keamanan aplikasi. Ingat, sebagai developer, kamu bukan hanya membuat fitur, kamu juga melindungi pengguna dan data mereka.

Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku!

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

# 🔐 Reset Password di Laravel: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Hari ini kita akan membahas topik penting: **Reset Password**. Bayangkan kamu adalah pemilik toko, dan ada pelanggan yang lupa kunci gudangnya. Kamu harus bantu mereka masuk lagi dengan aman, tanpa membahayakan barang-barang di dalamnya. Itulah reset password!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Reset Password Itu Sebenarnya?

**Analogi:** Bayangkan kamu di toko, dan kamu lupa kunci gudang. Kamu bilang ke manajer, "Saya lupa kunci saya!" Manajer itu lalu memberimu **kunci sementara** yang hanya kamu yang tahu dan punya, dan kunci itu bisa kamu pakai untuk **membuat kunci baru yang permanen**. Itulah reset password!

**Mengapa ini penting?** Karena fitur ini menjaga keamanan akun pengguna. Kita tidak bisa langsung memberikan password baru, karena itu sangat berbahaya. Kita harus pastikan dulu bahwa yang ingin mengganti password adalah **benar-benar pemilik akun tersebut**.

**Bagaimana cara kerjanya?** Secara umum, alurnya seperti ini:
1.  **Pengguna lupa password** dan meminta reset.
2.  **Sistem mengirimkan link reset** ke email yang terdaftar.
3.  **Pengguna mengklik link** tersebut (ini bukti bahwa mereka punya akses ke email).
4.  **Mereka masukkan password baru** di halaman yang aman.
5.  **Password lama diganti** dengan yang baru.

Tanpa sistem ini, pengguna akan kesulitan jika lupa password, dan bisa bikin akun baru, atau lebih buruk, mencari cara tidak aman untuk masuk.

### 2. ✍️ Resep Pertamamu: Setup Reset dari Nol

Ini adalah fondasi paling dasar. Mari kita setup reset password dari nol, langkah demi langkah.

#### Langkah 1️⃣: Pastikan Model User Sudah Siap (Model Preparation)
**Mengapa?** Kita butuh model `User` yang tahu cara reset password.

**Bagaimana?** Pastikan `App\Models\User` mengandung trait dan interface yang diperlukan.
```php
// app/Models/User.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\CanResetPassword; // Ini penting!

class User extends Authenticatable implements CanResetPassword // Ini juga penting!
{
    use Notifiable; // Ini agar bisa kirim notifikasi

    // Tidak perlu override apapun jika menggunakan default Laravel
}
```

#### Langkah 2️⃣: Siapkan Tempat Penyimpanan Token (Konfigurasi)
**Mengapa?** Kita butuh tempat aman untuk menyimpan "kunci sementara" (token) yang hanya berlaku sebentar.

**Bagaimana?** Di Laravel, ini bisa di database atau cache. Secara default, Laravel menggunakan **database**.
```php
// config/auth.php
'passwords' => [
    'users' => [
        'provider' => 'users',
        'table' => 'password_reset_tokens', // Nama tabel untuk menyimpan token
        'expire' => 60, // Waktu expired token dalam menit
        'throttle' => 60, // Tunggu 60 detik sebelum boleh minta reset lagi
    ],
],
```
Laravel sudah menyediakan migration untuk tabel `password_reset_tokens` secara otomatis.

#### Langkah 3️⃣: Siapkan Formulir Permintaan (Request Form)
**Mengapa?** Supaya pengguna bisa bilang "Saya lupa password saya!"

**Bagaimana?** Buat route dan view untuk form request.
```php
// routes/web.php
Route::get('/forgot-password', function () {
    return view('auth.forgot-password');
})->middleware('guest')->name('password.request');
```

```blade
{{-- resources/views/auth/forgot-password.blade.php --}}
<!DOCTYPE html>
<html>
<head><title>Lupa Password?</title></head>
<body>
    <h1>Mohon Reset Password 🤔</h1>
    <form method="POST" action="{{ route('password.email') }}">
        @csrf
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required />
        <button type="submit">Kirim Link Reset</button>
    </form>
</body>
</html>
```

#### Langkah 4️⃣: Tangani Permintaan Reset (Process Request)
**Mengapa?** Supaya sistem tahu harus buat dan kirim token ke email yang diminta.

**Bagaimana?** Tambahkan route untuk menangani submit form.
```php
// routes/web.php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink(
        $request->only('email')
    );

    return $status === Password::RESET_LINK_SENT
        ? back()->with(['status' => __($status)]) // Jika berhasil
        : back()->withErrors(['email' => __($status)]); // Jika gagal
})->middleware('guest')->name('password.email');
```
**Penjelasan Kode:**
- `Password::sendResetLink(...)`: Fungsi Laravel yang otomatis buat token, simpan di database, dan kirim notifikasi ke email.
- `__($status)`: Ambil pesan error/berhasil dalam bahasa lokal (Indonesia jika ada).

Selesai! 🎉 Jika kamu submit form dengan email yang valid, link reset akan dikirim ke email tersebut!

---

## Bagian 2: Sistem Reset yang Lebih Canggih (Proses Reset Lengkap) 🤖

### 3. 📩 Proses Reset: Dari Link ke Password Baru

**Analogi:** Ini adalah bagian di mana pelanggan yang dapat "kunci sementara" tadi, datang ke toko dengan kunci itu, dan manajer membantunya membuat kunci permanen baru.

**Mengapa ini penting?** Karena ini adalah bagian yang paling sensitif dalam proses reset. Kita harus sangat hati-hati.

**Bagaimana?**
1.  Pengguna klik link reset di email (misalnya `https://example.com/reset-password/TOKEN`).
2.  Sistem verifikasi bahwa token valid dan belum expired.
3.  Pengguna diminta masukkan password baru dan konfirmasinya.
4.  Sistem ganti password lama dengan yang baru.
5.  Sistem hapus token agar tidak bisa digunakan lagi.

### 4. 🛠️ Mantra Artisan untuk Keamanan Tambahan

> **✨ Tips dari Guru:** Mantra ini seperti memberi *power-up* tambahan ke sistemmu! Wajib dipakai!

*   **Membersihkan Token Kadaluarsa**: Setiap token hanya berlaku 60 menit (default). Kita harus bersihkan yang kadaluarsa agar tidak disalahgunakan.
    ```bash
    php artisan auth:clear-resets
    ```
    Mending dijadwal otomatis:
    ```php
    // app/Console/Kernel.php
    use Illuminate\Support\Facades\Schedule;

    Schedule::command('auth:clear-resets')->everyFifteenMinutes();
    ```

### 5. 🌐 Setting Host yang Dipercaya (Trusted Hosts)

**Mengapa?** Untuk mencegah **host header injection** yang bisa digunakan untuk membuat link reset palsu.

**Bagaimana?** Di `bootstrap/app.php`:
```php
$middleware->trustHosts(
    at: fn () => [
        'myapp.com',        // Ganti dengan domain kamu
        '*.myapp.com',      // Subdomain juga dipercaya
    ]
);
```
Dengan ini, Laravel akan menolak permintaan dari host yang tidak kamu percaya, tambah keamanan!

### 6. ⚙️ Proses Lengkap: Reset dari A-Z

Mari kita lihat proses lengkap untuk reset password:

1. **Form Reset Password (Tampilan):**
```php
// routes/web.php
Route::get('/reset-password/{token}', function (string $token) {
    return view('auth.reset-password', ['token' => $token]);
})->middleware('guest')->name('password.reset');
```

```blade
{{-- resources/views/auth/reset-password.blade.php --}}
<!DOCTYPE html>
<html>
<head><title>Reset Password</title></head>
<body>
    <h1>Buat Password Baru 🔐</h1>
    <form method="POST" action="{{ route('password.update') }}">
        @csrf
        <input type="hidden" name="token" value="{{ $token }}" />

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label for="password">Password Baru:</label>
        <input type="password" id="password" name="password" required />

        <label for="password_confirmation">Ulangi Password:</label>
        <input type="password" id="password_confirmation" name="password_confirmation" required />

        <button type="submit">Reset Password</button>
    </form>
</body>
</html>
```

2. **Mengolah Submit Reset (Proses):**
```php
// routes/web.php
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

Route::post('/reset-password', function (Request $request) {
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed', // Password minimal 8 karakter dan harus sama
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function (User $user, string $password) {
            // Ganti password lama dengan yang baru
            $user->forceFill([
                'password' => Hash::make($password), // Hash password baru
            ])->setRememberToken(Str::random(60)); // Set token untuk "Remember Me"

            $user->save(); // Simpan ke database

            event(new PasswordReset($user)); // Trigger event agar sistem tahu password sudah diganti
        }
    );

    // Kembalikan ke login jika berhasil, atau kirim error jika gagal
    return $status === Password::PASSWORD_RESET
        ? redirect()->route('login')->with('status', __($status))
        : back()->withErrors(['email' => [__($status)]]);
})->middleware('guest')->name('password.update');
```

---

## Bagian 3: Jurus Tingkat Lanjut - Kustomisasi Reset 🔑

### 7. 🎨 Kustomisasi Link Reset (Gaya Bebas!)

**Analogi:** Bayangkan kamu punya toko mewah, dan kamu ingin link resetnya tidak seperti link biasa, tapi seperti undangan resmi dari tokomu.

**Mengapa?** Untuk branding, atau mungkin kamu punya API sendiri untuk menangani reset.

**Bagaimana?** Di `AppServiceProvider::boot()`:
```php
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;

public function boot(): void
{
    ResetPassword::createUrlUsing(function (User $user, string $token) {
        // Kembalikan URL custom-mu
        return 'https://myapp.com/reset-password?token='.$token.'&email='.urlencode($user->email);
    });
}
```

### 8. 📧 Kustomisasi Email Reset (Desain Sendiri!)

**Analogi:** Bayangkan kamu tidak cukup dengan kertas biasa untuk undangan, kamu ingin kartu undangan yang keren dan sesuai brand tokomu.

**Mengapa?** Agar tampilan email reset sesuai dengan brand aplikasimu, atau kamu ingin tambah info khusus.

**Bagaimana?** Buat custom notification:
```bash
php artisan make:notification CustomResetPasswordNotification
```

Lalu ganti di `User` model:
```php
use App\Notifications\CustomResetPasswordNotification;

public function sendPasswordResetNotification($token): void
{
    $url = 'https://myapp.com/reset-password?token='.$token;
    $this->notify(new CustomResetPasswordNotification($url));
}
```

**Contoh Custom Notification:**
```php
<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class CustomResetPasswordNotification extends Notification
{
    public function __construct(protected string $resetUrl) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Reset Password Anda')
            ->line('Kamu menerima email ini karena ada permintaan untuk mengganti password.')
            ->action('Reset Password', $this->resetUrl)
            ->line('Link reset hanya berlaku 60 menit.')
            ->line('Jika kamu tidak merasa meminta reset password, abaikan saja email ini.');
    }
}
```

### 9. 👨‍👩‍👧‍👦 Multi Provider Reset (Reset untuk Banyak Tipe User)

**Analogi:** Bayangkan kamu punya toko dengan pelanggan biasa dan pelanggan VIP. Masing-masing butuh sistem reset password yang berbeda.

**Mengapa?** Kalau kamu punya beberapa model user (misalnya `User`, `Admin`, `Vendor`), kamu butuh setting reset yang berbeda untuk masing-masing.

**Bagaimana?** Di `config/auth.php`:
```php
'passwords' => [
    'users' => [ // Untuk model User biasa
        'provider' => 'users',
        'table' => 'password_reset_tokens',
        'expire' => 60,
    ],

    'admins' => [ // Untuk model Admin
        'provider' => 'admins',
        'table' => 'admin_password_resets',
        'expire' => 120, // Bisa beda waktu expired
    ],
],
```

Lalu, saat kirim reset, sebut provider yang mana:
```php
// Kirim reset ke admin
$status = Password::broker('admins')->sendResetLink(['email' => $email]);

// Kirim reset ke user biasa
$status = Password::sendResetLink(['email' => $email]); // Default ke 'users'
```

---

## Bagian 4: Perlindungan dan Pengamanan 🔒

### 10. 🛡️ Perlindungan Rate Limiting (Anti Spam)

**Mengapa?** Supaya orang jahat tidak bisa spam request reset ke email kamu berkali-kali.

**Bagaimana?** Sudah otomatis aktif di Laravel! Lihat `throttle` di `config/auth.php`:
```php
'passwords' => [
    'users' => [
        // ... lainnya
        'throttle' => 60, // Tunggu 60 detik sebelum boleh minta reset lagi
    ],
],
```

### 11. ⚰️ Soft Delete & Reset Token

**Analogi:** Bayangkan pelanggan yang akunnya dihapus, tapi masih bisa minta reset password. Ini bisa jadi celah keamanan!

**Mengapa?** Harus dipastikan bahwa reset password **hanya bisa dilakukan oleh akun yang aktif**.

**Bagaimana?** Jika kamu pakai soft delete, pastikan cek dulu apakah user aktif sebelum kirim reset.
```php
// Di form request reset
$request->validate([
    'email' => 'required|exists:users,email,deleted_at,NULL' // Hanya cari user yang tidak dihapus
]);
```

### 12. 🏷️ Token Expiration & Security

**Mengapa?** Token reset harus punya batas waktu agar tidak bisa disimpan dan digunakan nanti oleh orang jahat.

**Bagaimana?** Di `config/auth.php`:
```php
'passwords' => [
    'users' => [
        // ... lainnya
        'expire' => 60, // 60 menit, bisa diubah sesuai kebutuhan
        'throttle' => 60,
    ],
],
```
Token akan otomatis tidak berlaku setelah waktunya habis.

---

## Bagian 5: Menjadi Master Reset Password 🏆

### 13. ✨ Wejangan dari Guru

1.  **Gunakan Starter Kit untuk Cepat**: Kalau kamu baru mulai, pakai Laravel Breeze atau Jetstream untuk scaffolding otomatis.
2.  **Jaga Keamanan Token**: Pastikan token disimpan dengan aman dan punya waktu expired.
3.  **Gunakan Trusted Hosts**: Sangat penting untuk mencegah host header injection.
4.  **Customisasi Sesuai Kebutuhan**: Tapi jangan lupa, keamanan selalu prioritas utama.
5.  **Testing adalah Kunci**: Uji semua skenario reset, termasuk error dan edge case.

### 14. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk fitur reset password di Laravel:

#### ⚙️ Konfigurasi Reset Password
| Setting | Fungsi |
|---------|--------|
| `'driver' => 'database'` atau `'cache'` | Di mana token disimpan |
| `'expire' => 60` | Waktu expired token dalam menit |
| `'throttle' => 60` | Waktu tunggu sebelum boleh minta reset lagi |

#### 🛣️ Route Penting untuk Reset Password
| Route | Fungsi |
|-------|--------|
| `GET /forgot-password` | Menampilkan form untuk minta reset |
| `POST /forgot-password` | Menangani submit form request reset |
| `GET /reset-password/{token}` | Menampilkan form untuk input password baru |
| `POST /reset-password` | Menangani submit form reset password |

#### 📦 Artisan Commands
| Command | Fungsi |
|---------|--------|
| `php artisan auth:clear-resets` | Hapus token reset yang sudah kadaluarsa |
| `php artisan make:notification` | Buat custom notification untuk reset |

#### 🔐 Perlindungan Bawaan
| Fitur | Fungsi |
|-------|--------|
| Rate Limiting | Membatasi request reset dalam waktu tertentu |
| Token Expired | Token hanya berlaku dalam waktu tertentu |
| Trusted Hosts | Mencegah host header injection |

### 15. 🎯 Kesimpulan

Luar biasa! 🌟 Kamu sudah menyelesaikan seluruh materi Reset Password, dari yang paling dasar sampai yang paling rumit. Sekarang kamu tahu bagaimana membuat sistem reset password yang aman dan bisa dikustomisasi. Ingat, security adalah hal paling penting dalam fitur ini. Menguasainya berarti kamu sudah siap membuat aplikasi Laravel yang lebih aman dan profesional.

Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku!
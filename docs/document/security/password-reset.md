# 🔑 Resetting Passwords di Laravel

## 📖 Pendahuluan

Hampir semua aplikasi web menyediakan fitur untuk **mengatur ulang kata sandi** yang terlupa. Laravel sudah menyediakan layanan bawaan untuk mengirim tautan reset password dan melakukan reset dengan aman, sehingga kita tidak perlu membangun semuanya dari nol.

👉 Jika ingin cepat mulai, gunakan **Laravel Starter Kit** yang otomatis menyediakan scaffolding sistem autentikasi lengkap, termasuk reset password.

---

## ⚙️ Konfigurasi

File konfigurasi reset password terdapat di:

```

config/auth.php

````

Secara default, Laravel menggunakan **database driver** untuk menyimpan token reset password.

### 🔧 Opsi Driver

- **database** → data reset password disimpan di tabel database relasional.  
- **cache** → data disimpan di cache store (misalnya Redis, Memcached).

#### 🗄️ Database Driver

Untuk driver database, pastikan migration bawaan `create_users_table.php` sudah menyediakan tabel reset token.

#### ⚡ Cache Driver

Jika menggunakan cache driver, konfigurasi di `auth.php` seperti berikut:

```php
'passwords' => [
    'users' => [
        'driver' => 'cache',
        'provider' => 'users',
        'store' => 'passwords', // opsional
        'expire' => 60,
        'throttle' => 60,
    ],
],
````

👉 Gunakan cache store terpisah agar `php artisan cache:clear` tidak menghapus data reset password.

---

## 👤 Persiapan Model

Sebelum menggunakan fitur ini:

1. Tambahkan trait `Notifiable` di `App\Models\User`.
2. Pastikan `User` mengimplementasi `Illuminate\Contracts\Auth\CanResetPassword`.

Contoh:

```php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\CanResetPassword;

class User extends Authenticatable implements CanResetPassword
{
    use Notifiable, \Illuminate\Auth\Passwords\CanResetPassword;
}
```

---

## 🛡️ Mengatur Trusted Hosts

Laravel secara default menerima semua **Host header**.
Untuk keamanan (khususnya saat menyediakan fitur reset password), sebaiknya atur hanya host tertentu di `bootstrap/app.php`:

```php
$middleware->trustHosts(
    at: fn () => [
        'example.com',
        '*.example.com',
    ]
);
```

---

## 🛣️ Routing

Laravel membutuhkan beberapa route untuk mengatur reset password.

### 📩 Meminta Link Reset

#### 1. Form Request Link

```php
Route::get('/forgot-password', function () {
    return view('auth.forgot-password');
})->middleware('guest')->name('password.request');
```

View ini berisi form dengan input email.

#### 2. Menangani Submit Form

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink(
        $request->only('email')
    );

    return $status === Password::RESET_LINK_SENT
        ? back()->with(['status' => __($status)])
        : back()->withErrors(['email' => __($status)]);
})->middleware('guest')->name('password.email');
```

Laravel otomatis mengirim notifikasi reset password menggunakan sistem notification.

---

### 🔒 Reset Password

#### 1. Form Reset Password

```php
Route::get('/reset-password/{token}', function (string $token) {
    return view('auth.reset-password', ['token' => $token]);
})->middleware('guest')->name('password.reset');
```

Form ini berisi:

* Email
* Password
* Password Confirmation
* Token (hidden)

#### 2. Menangani Submit Form Reset

```php
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
        'password' => 'required|min:8|confirmed',
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function (User $user, string $password) {
            $user->forceFill([
                'password' => Hash::make($password),
            ])->setRememberToken(Str::random(60));

            $user->save();

            event(new PasswordReset($user));
        }
    );

    return $status === Password::PASSWORD_RESET
        ? redirect()->route('login')->with('status', __($status))
        : back()->withErrors(['email' => [__($status)]]);
})->middleware('guest')->name('password.update');
```

---

## 🧹 Menghapus Token Kadaluarsa

Gunakan perintah Artisan:

```bash
php artisan auth:clear-resets
```

Atau jadwalkan otomatis setiap 15 menit:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('auth:clear-resets')->everyFifteenMinutes();
```

---

## 🎨 Kustomisasi

### 🔗 Custom Reset Link

```php
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;

public function boot(): void
{
    ResetPassword::createUrlUsing(function (User $user, string $token) {
        return 'https://example.com/reset-password?token='.$token;
    });
}
```

### 📧 Custom Reset Email

```php
use App\Notifications\ResetPasswordNotification;

public function sendPasswordResetNotification($token): void
{
    $url = 'https://example.com/reset-password?token='.$token;
    $this->notify(new ResetPasswordNotification($url));
}
```

---

## 🏁 Kesimpulan

Dengan fitur bawaan Laravel:

* 🔐 Reset password lebih **aman**.
* ⚡ Proses lebih **cepat** tanpa membangun dari nol.
* 🎨 Dapat dikustom sesuai kebutuhan aplikasi.

👉 Jika ingin langsung siap pakai, gunakan **Laravel Starter Kit** agar seluruh sistem autentikasi (login, register, reset password) otomatis ter-setup.

```
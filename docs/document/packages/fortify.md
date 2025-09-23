# 🔐 Laravel Fortify

Laravel Fortify adalah backend autentikasi headless untuk Laravel yang mengimplementasikan sebagian besar logika autentikasi aplikasi web Laravel. Fortify mendaftarkan rute dan controller yang diperlukan untuk mengimplementasikan seluruh fitur autentikasi Laravel termasuk login, registrasi, reset password, verifikasi email, dan lainnya.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [Fitur yang Diimplementasikan](#fitur-yang-diimplementasikan)
5. [Memodifikasi Autentikasi](#memodifikasi-autentikasi)
6. [User Interface](#user-interface)
7. [Dua Faktor Autentikasi](#dua-faktor-autentikasi)
8. [Disabling Features](#disabling-features)

## 🎯 Pendahuluan

Laravel Fortify adalah backend autentikasi headless untuk Laravel. Fortify mengimplementasikan sebagian besar logika autentikasi aplikasi web Laravel, seperti login, registrasi, reset password, verifikasi email, dan lainnya.

### ✨ Fitur Utama
- Login dan registrasi
- Reset password
- Verifikasi email
- Update profil
- Update password
- Dua faktor autentikasi
- Session management
- API token management

### ⚠️ Catatan Penting
Fortify adalah package "headless" yang tidak menyertakan user interface. Jika Anda mencari package autentikasi yang sudah jadi dengan UI, pertimbangkan untuk menggunakan Laravel Jetstream.

## 📦 Instalasi

### 🎯 Menginstal Fortify
Untuk memulai, instal Fortify melalui Composer:

```bash
composer require laravel/fortify
```

### 🛠️ Publish Resources
Publish action Fortify menggunakan perintah vendor:

```bash
php artisan vendor:publish --provider="Laravel\Fortify\FortifyServiceProvider"
```

### 🔧 Run Migrations
Pastikan Anda menjalankan migrasi database:

```bash
php artisan migrate
```

### 🔄 Add Features to App\Models\User
Tambahkan trait `TwoFactorAuthenticatable` ke model User Anda jika ingin menggunakan dua faktor autentikasi:

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use Notifiable, TwoFactorAuthenticatable;
}
```

## ⚙️ Konfigurasi

### 📄 File Konfigurasi
Setelah mempublish resource Fortify, file konfigurasi akan ditempatkan di `config/fortify.php`. File ini memungkinkan Anda untuk mengkostumisasi fitur dan perilaku Fortify.

### 🎯 Mengkonfigurasi Fitur
Anda dapat mengaktifkan atau menonaktifkan fitur Fortify dalam file konfigurasi:

```php
'features' => [
    Features::registration(),
    Features::resetPasswords(),
    Features::emailVerification(),
    Features::updateProfileInformation(),
    Features::updatePasswords(),
    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
        // 'window' => 0,
    ]),
],
```

### 🔐 Rate Limiting
Anda dapat mengkostumisasi rate limiting untuk setiap route Fortify:

```php
'limiters' => [
    'login' => 'login',
    'two-factor' => 'two-factor',
],
```

## 🚀 Fitur yang Diimplementasikan

### 👤 Registration
Fortify secara otomatis mengimplementasikan registrasi pengguna:

```php
// app/Actions/Fortify/CreateNewUser.php
public function create(array $input)
{
    Validator::make($input, [
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
        'password' => $this->passwordRules(),
    ])->validate();

    return User::create([
        'name' => $input['name'],
        'email' => $input['email'],
        'password' => Hash::make($input['password']),
    ]);
}
```

### 🔑 Login
Fortify mengimplementasikan login dengan rate limiting dan session management:

```php
// app/Actions/Fortify/AttemptToAuthenticate.php
public function handle($request, $next)
{
    if (Fortify::$authenticateUsingCallback) {
        return $this->handleUsingCustomCallback($request, $next);
    }

    if ($this->hasTooManyLoginAttempts($request)) {
        return $this->sendLockoutResponse($request);
    }

    // Attempt authentication...
}
```

### 🔁 Password Reset
Fortify mengimplementasikan sistem reset password lengkap:

```php
// app/Actions/Fortify/ResetUserPassword.php
public function reset($user, array $input)
{
    Validator::make($input, [
        'password' => $this->passwordRules(),
    ])->validate();

    $user->forceFill([
        'password' => Hash::make($input['password']),
    ])->save();
}
```

### 📧 Email Verification
Fortify mengimplementasikan verifikasi email:

```php
// app/Actions/Fortify/VerifyEmail.php
public function verify($user, EmailVerificationRequest $request)
{
    if (! hash_equals((string) $request->user()->getKey(), (string) $request->route('id'))) {
        return false;
    }

    if (! hash_equals(sha1($request->user()->getEmailForVerification()), (string) $request->route('hash'))) {
        return false;
    }

    if ($request->user()->hasVerifiedEmail()) {
        return redirect(config('fortify.redirects.email-verification') ?? route('dashboard'));
    }

    $request->user()->markEmailAsVerified();
}
```

## 🛠️ Memodifikasi Autentikasi

### 📝 Customizing Authentication Pipeline
Anda dapat memodifikasi pipeline autentikasi dengan mengganti action `AttemptToAuthenticate`:

```php
// app/Providers/FortifyServiceProvider.php
public function register(): void
{
    Fortify::authenticateThrough(function (Request $request) {
        return array_filter([
            config('fortify.limiters.login') ? null : EnsureLoginIsNotThrottled::class,
            Features::enabled(Features::twoFactorAuthentication()) ? RedirectIfTwoFactorAuthenticatable::class : null,
            AttemptToAuthenticate::class,
            PrepareAuthenticatedSession::class,
        ]);
    });
}
```

### 🔧 Customizing Password Validation
Anda dapat memodifikasi aturan validasi password:

```php
// app/Actions/Fortify/PasswordValidationRules.php
protected function passwordRules()
{
    return ['required', 'string', new Password, 'confirmed'];
}
```

### 🎯 Customizing Registration
Anda dapat memodifikasi proses registrasi:

```php
// app/Actions/Fortify/CreateNewUser.php
public function create(array $input)
{
    Validator::make($input, [
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
        'password' => $this->passwordRules(),
        'terms' => Jetstream::hasTermsAndPrivacyPolicyFeature() ? ['accepted', 'required'] : '',
    ])->validate();

    return User::create([
        'name' => $input['name'],
        'email' => $input['email'],
        'password' => Hash::make($input['password']),
    ]);
}
```

## 🎨 User Interface

### 🌐 Implementing Frontend
Karena Fortify adalah package headless, Anda perlu mengimplementasikan frontend Anda sendiri. Berikut adalah contoh form login sederhana:

```blade
<form method="POST" action="/login">
    @csrf
    
    <div>
        <label for="email">Email</label>
        <input id="email" type="email" name="email" required autofocus>
    </div>
    
    <div>
        <label for="password">Password</label>
        <input id="password" type="password" name="password" required>
    </div>
    
    <div>
        <input type="checkbox" name="remember" id="remember">
        <label for="remember">Remember Me</label>
    </div>
    
    <button type="submit">Login</button>
</form>
```

### 🎯 Routes yang Tersedia
Fortify secara otomatis mendaftarkan route berikut:

```php
// Melihat route yang tersedia
php artisan route:list | grep fortify
```

## 🔐 Dua Faktor Autentikasi

### 🚀 Mengaktifkan 2FA
Untuk mengaktifkan dua faktor autentikasi, pastikan sudah ditambahkan dalam konfigurasi fitur:

```php
// config/fortify.php
'features' => [
    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]),
],
```

### 📱 Implementing 2FA Frontend
Berikut adalah contoh implementasi frontend 2FA:

```blade
<form method="POST" action="/user/confirmed-two-factor-authentication">
    @csrf
    
    <div>
        <label for="code">Code</label>
        <input id="code" type="text" name="code" required>
    </div>
    
    <button type="submit">Confirm</button>
</form>
```

### 🔐 2FA Actions
Fortify menyediakan action berikut untuk 2FA:

```php
// app/Actions/Fortify/ConfirmTwoFactorAuthentication.php
public function confirm($user, $code)
{
    if (empty($user->two_factor_secret) ||
        empty($code) ||
        ! hash_equals($code, app(Google2FA::class)->getCurrentOtp(decrypt($user->two_factor_secret)))) {
        throw ValidationException::withMessages([
            'code' => [__('The provided two factor authentication code was invalid.')],
        ]);
    }

    $user->forceFill([
        'two_factor_confirmed_at' => now(),
    ])->save();
}
```

## 🚫 Disabling Features

### 🎯 Menonaktifkan Fitur Tertentu
Anda dapat menonaktifkan fitur tertentu dengan menghapusnya dari array fitur:

```php
// config/fortify.php
'features' => [
    // Features::registration(), // Registration dinonaktifkan
    Features::resetPasswords(),
    Features::emailVerification(),
    // Features::updateProfileInformation(), // Update profile dinonaktifkan
    Features::updatePasswords(),
    // Features::twoFactorAuthentication(), // 2FA dinonaktifkan
],
```

## 🧠 Kesimpulan

Laravel Fortify menyediakan implementasi backend autentikasi yang kuat dan fleksibel untuk aplikasi Laravel Anda. Dengan Fortify, Anda dapat dengan mudah mengimplementasikan fitur autentikasi kompleks tanpa harus menulis semua logika dari awal.

### 🔑 Keuntungan Utama
- Implementasi autentikasi yang lengkap
- Mudah dikustomisasi
- Backend headless yang fleksibel
- Integrasi dengan Laravel Sanctum untuk API
- Dukungan untuk dua faktor autentikasi
- Rate limiting yang terintegrasi
- Validasi password yang kuat

### 🚀 Best Practices
1. Kustomisasi action sesuai kebutuhan bisnis Anda
2. Gunakan rate limiting untuk keamanan
3. Implementasikan frontend yang sesuai dengan kebutuhan UI Anda
4. Gunakan dua faktor autentikasi untuk keamanan ekstra
5. Validasi password dengan benar
6. Gunakan HTTPS untuk semua route autentikasi

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Fortify untuk mengimplementasikan sistem autentikasi yang kuat dan aman dalam aplikasi Laravel Anda.
# 🚀 Starter Kits Laravel

Dokumentasi ini menjelaskan berbagai starter kit yang tersedia untuk Laravel, yang membantu mempercepat proses pengembangan aplikasi dengan menyediakan scaffolding autentikasi dan UI dasar.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Laravel Breeze](#laravel-breeze)
3. [Laravel Jetstream](#laravel-jetstream)
4. [Laravel Fortify](#laravel-fortify)
5. [Laravel Sanctum](#laravel-sanctum)
6. [Memilih Starter Kit yang Tepat](#memilih-starter-kit-yang-tepat)

## 🎯 Pendahuluan

Laravel menyediakan beberapa starter kits yang membantu mempercepat proses pengembangan aplikasi dengan menyediakan scaffolding untuk autentikasi, registrasi, verifikasi email, reset password, dan konfirmasi password.

### 🔧 Jenis Starter Kits
- **Breeze** - Starter kit sederhana dan minimal
- **Jetstream** - Starter kit kaya fitur dengan Inertia.js atau Livewire
- **Fortify** - Backend autentikasi tanpa frontend
- **Sanctum** - Autentikasi API sederhana

### 📦 Instalasi
Starter kit biasanya diinstal saat membuat aplikasi baru atau dapat ditambahkan ke aplikasi yang sudah ada.

## 🌬️ Laravel Breeze

Laravel Breeze adalah starter kit sederhana dan minimal yang menyediakan scaffolding autentikasi menggunakan Blade dan Tailwind CSS.

### 📦 Instalasi Breeze
```bash
composer require laravel/breeze --dev
php artisan breeze:install
```

### 🎨 Pilihan UI
Breeze menyediakan beberapa pilihan UI:
```bash
# Default (Blade dengan Tailwind)
php artisan breeze:install

# Dengan React
php artisan breeze:install react

# Dengan Vue
php artisan breeze:install vue

# Dengan API
php artisan breeze:install api
```

### 📁 File yang Dihasilkan
- Routes autentikasi
- Controller autentikasi
- View Blade (login, register, dashboard)
- Migrasi database
- Testing

### 🎨 Fitur Breeze
- Login dan registrasi
- Reset password
- Verifikasi email
- Konfirmasi password
- Profil pengguna
- Dua faktor autentikasi (opsional)

### 📄 Contoh View
File `resources/views/auth/login.blade.php`:
```blade
<x-guest-layout>
    <x-authentication-card>
        <x-slot name="logo">
            <x-authentication-card-logo />
        </x-slot>

        <x-validation-errors class="mb-4" />

        @if (session('status'))
            <div class="mb-4 font-medium text-sm text-green-600">
                {{ session('status') }}
            </div>
        @endif

        <form method="POST" action="{{ route('login') }}">
            @csrf

            <div>
                <x-label for="email" value="{{ __('Email') }}" />
                <x-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required autofocus autocomplete="username" />
            </div>

            <div class="mt-4">
                <x-label for="password" value="{{ __('Password') }}" />
                <x-input id="password" class="block mt-1 w-full" type="password" name="password" required autocomplete="current-password" />
            </div>

            <div class="block mt-4">
                <label for="remember_me" class="flex items-center">
                    <x-checkbox id="remember_me" name="remember" />
                    <span class="ml-2 text-sm text-gray-600">{{ __('Remember me') }}</span>
                </label>
            </div>

            <div class="flex items-center justify-end mt-4">
                @if (Route::has('password.request'))
                    <a class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" href="{{ route('password.request') }}">
                        {{ __('Forgot your password?') }}
                    </a>
                @endif

                <x-button class="ml-4">
                    {{ __('Log in') }}
                </x-button>
            </div>
        </form>
    </x-authentication-card>
</x-guest-layout>
```

## ⚡ Laravel Jetstream

Laravel Jetstream adalah starter kit yang lebih kaya fitur yang menyediakan scaffolding autentikasi dengan opsi Inertia.js atau Livewire.

### 📦 Instalasi Jetstream
```bash
composer require laravel/jetstream
php artisan jetstream:install inertia
# atau
php artisan jetstream:install livewire
```

### 🎨 Pilihan Teknologi
- **Inertia.js** - SPA dengan Vue.js atau React
- **Livewire** - Interaktivitas server-side

### 📦 Instalasi dengan Fitur Tambahan
```bash
# Dengan dua faktor autentikasi
php artisan jetstream:install inertia --teams

# Dengan profil pengguna
php artisan jetstream:install livewire --profile-photos
```

### 📁 File yang Dihasilkan
- Routes autentikasi
- Controller autentikasi
- Component Inertia.js atau Livewire
- Migrasi database
- Testing
- Team management (opsional)

### 🎨 Fitur Jetstream
- Semua fitur Breeze
- Team management
- Profil foto
- Dua faktor autentikasi
- Session management
- API token management
- Browser session management

### 📄 Contoh Component Livewire
File `app/Livewire/UpdateProfileInformationForm.php`:
```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithFileUploads;
use Illuminate\Support\Facades\Auth;

class UpdateProfileInformationForm extends Component
{
    use WithFileUploads;

    public $name;
    public $email;
    public $photo;

    public function mount()
    {
        $this->name = Auth::user()->name;
        $this->email = Auth::user()->email;
    }

    public function updateProfileInformation()
    {
        $this->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . Auth::id(),
            'photo' => 'nullable|image|max:1024',
        ]);

        if ($this->photo) {
            $path = $this->photo->store('profile-photos', 'public');
            Auth::user()->update(['profile_photo_path' => $path]);
        }

        Auth::user()->update([
            'name' => $this->name,
            'email' => $this->email,
        ]);

        $this->dispatch('saved');
    }

    public function render()
    {
        return view('livewire.update-profile-information-form');
    }
}
```

## 🔐 Laravel Fortify

Laravel Fortify adalah backend autentikasi tanpa frontend yang menyediakan implementasi untuk semua fitur autentikasi Laravel.

### 📦 Instalasi Fortify
```bash
composer require laravel/fortify
php artisan vendor:publish --provider="Laravel\Fortify\FortifyServiceProvider"
```

### ⚙️ Konfigurasi Fortify
File `config/fortify.php`:
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

### 📁 File yang Dihasilkan
- Service provider
- Routes autentikasi
- Actions untuk setiap fitur autentikasi

### 🎨 Fitur Fortify
- Registration
- Login
- Password reset
- Email verification
- Profile update
- Password update
- Two-factor authentication
- Session management

### 📄 Customizing Actions
File `app/Actions/Fortify/CreateNewUser.php`:
```php
<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Laravel\Jetstream\Jetstream;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
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
}
```

## 🔒 Laravel Sanctum

Laravel Sanctum menyediakan sistem autentikasi sederhana untuk SPA, mobile apps, dan API tokens.

### 📦 Instalasi Sanctum
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### ⚙️ Konfigurasi Sanctum
File `config/sanctum.php`:
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    Laravel\Sanctum\Sanctum::currentApplicationUrlWithPort()
))),
```

### 🎨 Fitur Sanctum
- API token authentication
- SPA authentication
- Mobile app authentication
- Session based authentication for first-party SPA

### 📄 Penggunaan Sanctum
```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
}
```

```php
// Membuat token API
$token = $user->createToken('token-name')->plainTextToken;

// Menggunakan token dalam request
$response = $http->withToken($token)->get('/api/user');
```

## 🎯 Memilih Starter Kit yang Tepat

### 📊 Perbandingan Fitur

| Fitur | Breeze | Jetstream | Fortify | Sanctum |
|-------|--------|-----------|---------|---------|
| Login/Register | ✅ | ✅ | ✅ | ❌ |
| Reset Password | ✅ | ✅ | ✅ | ❌ |
| Email Verification | ✅ | ✅ | ✅ | ❌ |
| Two-Factor Auth | ✅ | ✅ | ✅ | ❌ |
| Teams | ❌ | ✅ | ❌ | ❌ |
| Profile Photos | ❌ | ✅ | ❌ | ❌ |
| API Tokens | ❌ | ✅ | ❌ | ✅ |
| SPA Support | ✅ | ✅ | ✅ | ✅ |
| Inertia.js | ✅ | ✅ | ✅ | ✅ |
| Livewire | ✅ | ✅ | ✅ | ✅ |

### 🎯 Rekomendasi Berdasarkan Kebutuhan

#### 🚀 Untuk Proyek Sederhana
**Gunakan Breeze** jika:
- Proyek sederhana
- Tidak memerlukan fitur tim
- Menggunakan Blade templating
- Ingin scaffolding minimal

#### 💪 Untuk Proyek Kompleks
**Gunakan Jetstream** jika:
- Memerlukan fitur tim
- Butuh profil foto
- Ingin dua faktor autentikasi
- Menggunakan SPA dengan Inertia.js atau Livewire

#### 🔧 Untuk Backend Custom
**Gunakan Fortify** jika:
- Ingin mengimplementasi frontend sendiri
- Butuh kontrol penuh atas UI
- Menggunakan framework frontend lain
- Membutuhkan semua fitur autentikasi

#### 📱 Untuk API dan Mobile
**Gunakan Sanctum** jika:
- Membangun API
- Mengembangkan mobile app
- Membutuhkan token authentication
- Menggunakan SPA dari domain berbeda

### 📈 Skala Proyek

| Skala | Rekomendasi |
|-------|-------------|
| Small (Prototype/Learning) | Breeze |
| Medium (Internal App) | Breeze atau Jetstream |
| Large (Enterprise/SaaS) | Jetstream |
| API Only | Sanctum |
| Custom Frontend | Fortify + Sanctum |

## 🧠 Kesimpulan

Laravel menyediakan berbagai starter kit untuk memenuhi kebutuhan pengembangan yang berbeda:

### 🎯 Keuntungan Utama
- **Mempercepat development** dengan scaffolding siap pakai
- **Konsisten** dengan best practices Laravel
- **Fleksibel** untuk berbagai jenis aplikasi
- **Aman** dengan implementasi autentikasi yang teruji
- **Dapat dikustomisasi** sesuai kebutuhan

### 🚀 Best Practices
1. Pilih starter kit yang sesuai dengan kebutuhan proyek
2. Pahami struktur yang dihasilkan
3. Kustomisasi sesuai branding dan kebutuhan
4. Jaga keamanan dengan fitur dua faktor
5. Gunakan testing yang disediakan

Dengan menggunakan starter kit yang tepat, Anda dapat fokus pada fitur bisnis aplikasi Anda daripada mengimplementasikan autentikasi dari nol.
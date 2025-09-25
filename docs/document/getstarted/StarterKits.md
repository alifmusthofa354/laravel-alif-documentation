# 🚀 Starter Kits di Laravel: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Setelah beberapa kali revisi, akhirnya Guru paham apa yang sebenarnya kalian inginkan: sebuah panduan yang **super lengkap** tapi dijelaskan dengan **super sederhana**, seolah-olah Guru sedang duduk di sebelahmu sambil menjelaskan pelan-pelan.

Di edisi ini, kita akan kupas tuntas **semua detail** tentang Starter Kits, tapi setiap topik akan Guru ajarkan dengan sabar. Siap? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基 礎

### 1. 📖 Apa Sih Starter Kits Itu Sebenarnya?

**Analogi:** Bayangkan kamu ingin membangun rumah. Daripada harus membuat semua dari nol - pondasi, pintu, jendela, kamar mandi - kamu bisa memilih paket rumah siap bangun yang sudah include semua dasar-dasar yang dibutuhkan. Nah, **Starter Kits itu seperti paket rumah siap bangun** untuk aplikasimu! Mereka memberimu fondasi autentikasi (login, register, dll.) yang lengkap dan siap pakai.

**Mengapa ini penting?** Karena sebagian besar aplikasi membutuhkan fitur autentikasi dasar, dan membuat semuanya dari nol akan memakan waktu yang sangat lama. Dengan Starter Kits, kamu bisa langsung fokus pada fitur utama aplikasimu daripada mengulang-ulang pekerjaan dasar.

**Bagaimana cara kerjanya?** Starter Kits itu seperti kontraktor rumah yang:
1.  **Menyediakan kerangka dasar** (login, register, dashboard)
2.  **Membangun fondasi keamanan** (verifikasi email, reset password)
3.  **Memberimu template yang bisa dikostumisasi** (UI/UX)
4.  **Mengatur semua logika yang kompleks** untukmu

Jadi, alur kerja (workflow) penggunaan Starter Kits menjadi sangat rapi:

`➡️ Pilih Starter Kit yang Cocok -> 🏗️ Instal dengan Satu Perintah -> ✅ Fokus ke Fitur Bisnismu`

Tanpa Starter Kits, kamu harus membuat semua autentikasi dari awal setiap kali membuat proyek baru. 😵

### 2. ✍️ Kenapa Gunakan Starter Kits? (Keuntungan Utama)

**Analogi:** Ini seperti menggunakan template PowerPoint atau Google Docs ketimbang harus membuat desain presentasi dari nol setiap kali kamu punya rapat penting.

**Keuntungan Utama:**
- **Mempercepat development** - Hemat waktu dan tenaga
- **Konsisten dengan best practices Laravel** - Kode yang aman dan teruji
- **Fleksibel untuk berbagai jenis aplikasi** - Bisa disesuaikan dengan kebutuhan
- **Aman dengan implementasi autentikasi yang teruji** - Sudah melewati pengujian keamanan
- **Dapat dikustomisasi sesuai kebutuhan** - Bukan batu, tapi bisa dimodifikasi

### 3. ⚡ Jenis-Jenis Starter Kits (Pilihan yang Tersedia)

**Analogi:** Bayangkan kamu punya beberapa jenis rumah siap bangun - rumah minimalis, rumah mewah, apartemen, dan paviliun. Masing-masing punya kelebihan dan cocok untuk kebutuhan berbeda.

Laravel menyediakan beberapa starter kits:
- **Breeze** - Starter kit sederhana dan minimal (rumah minimalis)
- **Jetstream** - Starter kit kaya fitur dengan Inertia.js atau Livewire (rumah mewah)
- **Fortify** - Backend autentikasi tanpa frontend (pondasi rumah, kamu pasang dindingnya sendiri)
- **Sanctum** - Autentikasi API sederhana (sistem keamanan khusus untuk aplikasi eksternal)

---

## Bagian 2: Laravel Breeze - Sang Minimalis 🌬️

### 4. 🏠 Apa Itu Laravel Breeze?

**Analogi:** Bayangkan kamu memilih paket rumah minimalis - tidak terlalu banyak perabotan atau fitur mewah, tapi memiliki semua kebutuhan dasar yang kamu perlukan: kamar tidur, kamar mandi, dapur kecil, dan ruang tamu. Itulah Breeze - paket yang sederhana tapi komplit untuk kebutuhan autentikasi dasar.

**Mengapa ini keren?** Karena Breeze sangat ringan, mudah dipahami, dan menggunakan teknologi yang familiar: Blade (template Laravel) dan Tailwind CSS (framework CSS).

**Fitur Utama:**
- Login dan registrasi
- Reset password
- Verifikasi email
- Konfirmasi password
- Profil pengguna
- Dua faktor autentikasi (opsional)

### 5. 📦 Instalasi Laravel Breeze

**Langkah 1️⃣: Tambahkan Breeze ke Project-mu**
**Mengapa?** Karena kamu perlu menginstall paket Breeze ke dalam aplikasimu.

**Bagaimana?** Gunakan Composer untuk menginstall:
```bash
composer require laravel/breeze --dev
```

**Langkah 2️⃣: Instal Breeze**
**Mengapa?** Karena kamu perlu menyiapkan semua file dan struktur yang diperlukan.

**Bagaimana?** Gunakan Artisan:
```bash
php artisan breeze:install
```

**Penjelasan:**
- `composer require laravel/breeze --dev` - Menginstall paket Breeze (dev karena hanya untuk development)
- `php artisan breeze:install` - Menginstal dan menyiapkan semua file autentikasi

### 6. 🎨 Pilihan UI untuk Breeze

**Analogi:** Ini seperti memilih versi rumah minimalismu - apakah kamu suka dengan interior yang simple (Blade), atau kamu ingin tambahan teknologi modern seperti React atau Vue?

Breeze menyediakan beberapa pilihan UI:

**Pilihan Default (Blade dengan Tailwind):**
```bash
php artisan breeze:install
```

**Dengan React:**
```bash
php artisan breeze:install react
```

**Dengan Vue:**
```bash
php artisan breeze:install vue
```

**Dengan API Saja (tanpa frontend):**
```bash
php artisan breeze:install api
```

### 7. 📁 Apa Saja yang Dihasilkan Breeze?

**Analogi:** Setelah kamu memesan paket rumah minimalis, kamu akan mendapatkan semua bahan bangunan yang sudah disusun rapi: pintu, jendela, pipa air, kabel listrik, dll.

**File dan Struktur yang Dihasilkan:**
- Routes autentikasi (alamat-alamat untuk login, register, dll.)
- Controller autentikasi (logika untuk menangani request)
- View Blade (halaman-halaman tampilan: login, register, dashboard)
- Migrasi database (struktur tabel pengguna)
- Testing (ujian otomatis untuk fitur autentikasi)

### 8. 📄 Contoh View dari Breeze

File `resources/views/auth/login.blade.php` (disederhanakan):
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

Ini adalah contoh halaman login yang dihasilkan Breeze - sudah include form, validasi, dan tampilan yang bagus!

---

## Bagian 3: Laravel Jetstream - Sang Mewah ⚡

### 9. 🏢 Apa Itu Laravel Jetstream?

**Analogi:** Bayangkan kamu memilih paket rumah mewah lengkap dengan kolam renang, gym, smart home system, dan banyak fitur canggih lainnya. Itulah Jetstream - paket yang kaya fitur untuk aplikasi yang lebih kompleks dan modern.

**Mengapa ini keren?** Karena Jetstream menyediakan semua fitur dari Breeze ditambah dengan fitur-fitur advance seperti manajemen tim, dua faktor autentikasi, API token, dan menggunakan teknologi modern seperti Inertia.js atau Livewire.

### 10. 📦 Instalasi Laravel Jetstream

**Langkah 1️⃣: Tambahkan Jetstream ke Project-mu**
```bash
composer require laravel/jetstream
```

**Langkah 2️⃣: Instal Jetstream dengan Teknologi Pilihan**
**Dengan Inertia.js (Vue/React):**
```bash
php artisan jetstream:install inertia
```

**Dengan Livewire:**
```bash
php artisan jetstream:install livewire
```

### 11. 🎨 Pilihan Teknologi dalam Jetstream

**Inertia.js:**
- Single Page Application (SPA) dengan Vue.js atau React
- Kombinasi kekuatan Laravel dan framework frontend modern
- Responsif dan cepat seperti aplikasi desktop

**Livewire:**
- Interaktivitas server-side
- Tidak perlu JavaScript kompleks
- Mudah dipelajari dan digunakan

### 12. 📦 Instalasi dengan Fitur Tambahan

**Dengan fitur tim:**
```bash
php artisan jetstream:install inertia --teams
```

**Dengan foto profil:**
```bash
php artisan jetstream:install livewire --profile-photos
```

### 13. 📁 Apa Saja yang Dihasilkan Jetstream?

Selain semua yang dihasilkan Breeze, Jetstream juga menyediakan:
- Routes dan controller untuk manajemen tim
- Component Inertia.js atau Livewire untuk UI interaktif
- Sistem API token untuk autentikasi API
- Fitur manajemen sesi browser
- Sistem dua faktor autentikasi yang lengkap

### 14. 🎨 Fitur-Fitur Jetstream

**Semua fitur dari Breeze:**
- Login dan registrasi
- Reset password
- Verifikasi email
- Konfirmasi password

**Fitur tambahan Jetstream:**
- Team management (manajemen tim kolaboratif)
- Profil foto (upload dan tampilkan foto profil)
- Dua faktor autentikasi (keamanan tambahan)
- Session management (pantau login di berbagai perangkat)
- API token management (untuk autentikasi API)
- Browser session management (kelola sesi login)

### 15. 📄 Contoh Component dari Jetstream (Livewire)

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

Ini adalah contoh komponen Livewire yang menangani pembaruan informasi profil pengguna.

---

## Bagian 4: Laravel Fortify - Sang Backend 💐

### 16. 🔐 Apa Itu Laravel Fortify?

**Analogi:** Bayangkan kamu ingin membangun rumah tapi kamu ingin membuat desain interior dan eksterior sendiri dari nol. Fortify seperti memberimu pondasi dan struktur bangunan yang kuat, tapi tanpa furnitur atau gaya dekorasi - kamu bebas menata semuanya sesuai keinginanmu.

**Mengapa ini keren?** Karena Fortify menyediakan semua logika backend autentikasi tanpa UI, memberimu kontrol penuh atas tampilan dan pengalaman pengguna.

**Fitur Utama:**
- Registration (pembuatan akun)
- Login (masuk ke sistem)
- Password reset (pengaturan ulang sandi)
- Email verification (verifikasi alamat email)
- Profile update (pembaruan profil)
- Password update (pembaruan sandi)
- Two-factor authentication (otentikasi dua faktor)
- Session management (manajemen sesi login)

### 17. 📦 Instalasi Laravel Fortify

**Langkah 1️⃣: Tambahkan Fortify ke Project-mu**
```bash
composer require laravel/fortify
```

**Langkah 2️⃣: Publish Konfigurasi**
```bash
php artisan vendor:publish --provider="Laravel\Fortify\FortifyServiceProvider"
```

### 18. ⚙️ Konfigurasi Fortify

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

Dalam file konfigurasi ini, kamu bisa menentukan fitur-fitur mana yang ingin kamu aktifkan dalam aplikasimu.

### 19. 📁 Apa Saja yang Dihasilkan Fortify?

- Service provider untuk Fortify
- Routes autentikasi (bisa dikustomisasi)
- Actions untuk setiap fitur autentikasi (bisa diganti sesuai kebutuhan)

### 20. 📄 Customizing Actions (Menyesuaikan Logika)

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

Dengan Fortify, kamu bisa mengganti setiap logika autentikasi dengan kelasmu sendiri, memberikan fleksibilitas maksimum.

---

## Bagian 5: Laravel Sanctum - Sang API 🔒

### 21. 🔐 Apa Itu Laravel Sanctum?

**Analogi:** Bayangkan kamu punya toko yang melayani pelanggan datang langsung, aplikasi mobile, dan sistem POS yang saling berkomunikasi. Sanctum seperti sistem kunci yang bisa digunakan oleh semua jenis pelanggan dan sistem ini dengan cara yang berbeda-beda.

**Mengapa ini keren?** Karena Sanctum menyediakan sistem autentikasi sederhana dan ringan untuk Single Page Applications (SPA), mobile apps, dan API tokens.

### 22. 📦 Instalasi Laravel Sanctum

**Langkah 1️⃣: Tambahkan Sanctum ke Project-mu**
```bash
composer require laravel/sanctum
```

**Langkah 2️⃣: Publish Migrasi dan Konfigurasi**
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 23. ⚙️ Konfigurasi Sanctum

File `config/sanctum.php`:
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    Laravel\Sanctum\Sanctum::currentApplicationUrlWithPort()
))),
```

Konfigurasi ini mengatur domain mana yang boleh menggunakan session-based authentication.

### 24. 🎨 Fitur Sanctum

- API token authentication (otentikasi menggunakan token)
- SPA authentication (otentikasi untuk aplikasi single page)
- Mobile app authentication (otentikasi untuk aplikasi mobile)
- Session based authentication for first-party SPA (otentikasi untuk SPA yang dari domain yang sama)

### 25. 📄 Penggunaan Sanctum

**Menambahkan ke Model User:**
```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
}
```

**Membuat token API:**
```php
// Membuat token API
$token = $user->createToken('token-name')->plainTextToken;

// Menggunakan token dalam request
$response = $http->withToken($token)->get('/api/user');
```

Sanctum sangat cocok untuk aplikasi yang perlu melayani API ke berbagai klien seperti mobile app, SPA, atau aplikasi pihak ketiga.

---

## Bagian 6: Perbandingan dan Memilih Starter Kit yang Tepat 🎯

### 26. 📊 Perbandingan Fitur

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

### 27. 🎯 Rekomendasi Berdasarkan Kebutuhan

**🚀 Untuk Proyek Sederhana**
Gunakan **Breeze** jika:
- Proyek sederhana dan cepat
- Tidak memerlukan fitur tim
- Menggunakan Blade templating
- Ingin scaffolding minimal dan mudah dipahami
- Cocok untuk: Website biasa, dashboard internal, prototipe

**💪 Untuk Proyek Kompleks**
Gunakan **Jetstream** jika:
- Memerlukan fitur tim kolaboratif
- Butuh profil foto dan fitur sosial
- Ingin dua faktor autentikasi bawaan
- Menggunakan SPA dengan Inertia.js atau Livewire
- Cocok untuk: SaaS, aplikasi kolaboratif, platform berbasis tim

**🔧 Untuk Backend Custom**
Gunakan **Fortify** jika:
- Ingin membuat UI frontend sendiri dari nol
- Butuh kontrol penuh atas tampilan dan pengalaman pengguna
- Menggunakan framework frontend yang berbeda (Angular, Svelte, dll.)
- Membutuhkan semua fitur autentikasi tapi dengan logika sendiri
- Cocok untuk: API backend, proyek dengan desain UI khusus

**📱 Untuk API dan Mobile**
Gunakan **Sanctum** jika:
- Membangun API-only application
- Mengembangkan mobile app yang terpisah
- Membutuhkan sistem token authentication
- Menggunakan SPA dari domain berbeda
- Cocok untuk: REST API, mobile app backend, microservices

### 28. 📈 Skala Proyek dan Rekomendasi

| Skala | Rekomendasi |
|-------|-------------|
| Small (Prototype/Pembelajaran) | Breeze |
| Medium (Aplikasi Internal) | Breeze atau Jetstream |
| Large (Enterprise/SaaS) | Jetstream |
| API Only | Sanctum |
| Custom Frontend | Fortify + Sanctum |

---

## Bagian 7: Panduan Praktis - Memilih yang Tepat 🧭

### 29. 🤔 Pertanyaan untuk Membantu Memilih

**Pertanyaan 1:** "Apakah saya perlu UI autentikasi siap pakai?"
- **Ya** → Breeze atau Jetstream
- **Tidak** → Fortify

**Pertanyaan 2:** "Apakah saya akan membuat SPA atau mobile app?"
- **Ya** → Sanctum
- **Tidak** → Breeze atau Jetstream

**Pertanyaan 3:** "Apakah saya perlu fitur tim dan kolaborasi?"
- **Ya** → Jetstream
- **Tidak** → Breeze atau Fortify

**Pertanyaan 4:** "Apakah saya ingin mengontrol sepenuhnya tampilan dan logika UI?"
- **Ya** → Fortify
- **Tidak** → Breeze atau Jetstream

### 30. 🧪 Contoh Kasus Dunia Nyata

**Kasus 1: Website Portofolio Pribadi**
- **Rekomendasi:** Breeze dengan Blade
- **Alasan:** Cukup dengan login admin untuk mengelola konten

**Kasus 2: Aplikasi SaaS Kolaboratif**
- **Rekomendasi:** Jetstream dengan Inertia + Vue
- **Alasan:** Butuh fitur tim, manajemen pengguna, dan UI modern

**Kasus 3: API untuk Mobile App**
- **Rekomendasi:** Sanctum + Fortify
- **Alasan:** Hanya butuh autentikasi API dengan token

**Kasus 4: Platform Kustom untuk Klien**
- **Rekomendasi:** Fortify
- **Alasan:** Butuh kontrol penuh atas UI sesuai brand klien

---

## Bagian 8: Tips dan Trik Lanjutan 🧠

### 31. 🚀 Tips untuk Menggunakan Starter Kits dengan Efektif

**1. Mulai dari yang sederhana:**
Jika kamu baru belajar, mulai dengan Breeze agar tidak terlalu terintimidasi oleh fitur banyak.

**2. Kustomisasi sesuai kebutuhan:**
Jangan takut mengubah tampilan atau logika yang dihasilkan starter kit sesuai kebutuhan proyekmu.

**3. Gabungkan starter kits:**
Kamu bisa menggunakan Fortify + Sanctum bersamaan untuk backend yang kuat dan API yang aman.

**4. Gunakan testing bawaan:**
Semua starter kit menyertakan test bawaan - gunakan dan perluas untuk memastikan keamanan aplikasimu.

**5. Update secara berkala:**
Pastikan starter kit tetap versi terbaru untuk mendapatkan perbaikan keamanan dan fitur baru.

### 32. 🛠️ Best Practices saat Menggunakan Starter Kits

**1. Pahami arsitektur yang dihasilkan:**
Sebelum mengkustomisasi, pahami bagaimana file dan struktur yang dihasilkan bekerja.

**2. Gunakan environment variables:**
Simpan konfigurasi sensitif di file `.env`, bukan di file konfigurasi langsung.

**3. Tambahkan validasi tambahan:**
Sesuaikan validasi sesuai kebutuhan bisnismu, meskipun sudah ada validasi bawaan.

**4. Implementasikan logging:**
Catat aktivitas autentikasi untuk kebutuhan audit dan pemantauan keamanan.

**5. Gunakan HTTPS:**
Pastikan semua komunikasi autentikasi menggunakan HTTPS untuk keamanan data.

---

## Bagian 9: Cheat Sheet & Referensi Cepat 📋

### 33. 📦 Instalasi Starter Kits

| Starter Kit | Perintah Instalasi |
|-------------|-------------------|
| Breeze | `composer require laravel/breeze --dev` <br> `php artisan breeze:install` |
| Jetstream | `composer require laravel/jetstream` <br> `php artisan jetstream:install inertia` |
| Fortify | `composer require laravel/fortify` <br> `php artisan vendor:publish --provider="Laravel\Fortify\FortifyServiceProvider"` |
| Sanctum | `composer require laravel/sanctum` <br> `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"` |

### 34. 🎨 Pilihan UI untuk Breeze

| Pilihan | Perintah |
|---------|----------|
| Blade (Default) | `php artisan breeze:install` |
| React | `php artisan breeze:install react` |
| Vue | `php artisan breeze:install vue` |
| API Saja | `php artisan breeze:install api` |

### 35. 🏢 Fitur dalam Jetstream

| Fitur | Keterangan |
|-------|------------|
| Teams | Manajemen tim kolaboratif |
| Profile Photos | Upload dan tampilan foto profil |
| 2FA | Dua faktor autentikasi |
| API Tokens | Token untuk autentikasi API |
| Browser Sessions | Manajemen sesi login perangkat |

### 36. 🔐 Konfigurasi Autentikasi

| File | Fungsi |
|------|--------|
| `config/fortify.php` | Konfigurasi fitur autentikasi Fortify |
| `config/sanctum.php` | Konfigurasi domain stateful Sanctum |
| `config/auth.php` | Konfigurasi umum autentikasi |

### 37. 🧪 Testing Bawaan

| Fitur | Test File |
|-------|-----------|
| Breeze | `tests/Feature/Auth/` |
| Jetstream | `tests/Feature/Auth/` |
| API | `tests/Feature/Api/` |

---

## Bagian 10: Kesimpulan 🎯

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Starter Kits, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Ingat, Starter Kits adalah alat yang sangat penting untuk mempercepat pengembangan aplikasi Laravel. Menguasainya berarti kamu bisa memilih alat yang paling tepat untuk proyek yang sedang kamu kerjakan.

Setiap Starter Kit memiliki tujuan dan kegunaan yang berbeda:
- **Breeze** untuk proyek sederhana dan cepat
- **Jetstream** untuk proyek kompleks dengan fitur lengkap
- **Fortify** untuk backend custom dengan kontrol penuh
- **Sanctum** untuk autentikasi API dan mobile app

Dengan menggunakan starter kit yang tepat, kamu bisa fokus pada fitur bisnis aplikasimu daripada mengimplementasikan autentikasi dari nol. Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku!
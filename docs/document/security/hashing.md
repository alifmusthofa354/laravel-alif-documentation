# 🔐 Hashing di Laravel: Panduan dari Guru Kesayanganmu (Edisi Keamanan Super Kuat)

Hai murid-murid kesayanganku! Selamat datang di kelas keamanan aplikasi. Hari ini, Guru akan membawamu mempelajari salah satu benteng pertahanan terpenting dalam dunia digital: **Hashing Password**. Setelah mempelajari ini, kamu akan tahu bagaimana melindungi data pengguna seperti seorang ahli keamanan siber! Ayo kita mulai petualangan keamanan ini dengan semangat!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Itu Hashing Sebenarnya?

**Analogi:** Bayangkan kamu punya kotak harta karun (password) yang sangat berharga. Di dunia nyata, kamu tentu tidak akan menaruhnya di tempat terbuka, kan? Kamu akan masukkan ke dalam brankas yang kuat dan aman. Nah, **Hashing adalah brankas digital kita** untuk menyimpan password pengguna.

**Mengapa ini penting?** Karena jika database kita diserang dan password disimpan dalam bentuk aslinya, peretas bisa mencuri semua login pengguna! Tapi dengan hashing, bahkan jika mereka mencuri database, yang mereka dapatkan hanya "gumpalan acak" yang tidak bisa digunakan!

**Bagaimana cara kerjanya?** 
1. **Password asli** (misal: `rahasia123`) masuk ke "mesin hash".
2. **Mesin hash** mengacaknya menjadi kode yang tidak bisa dibaca (misal: `$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`).
3. **Kode ini** disimpan di database, bukan password asli.

Jadi, alur keamanan kita menjadi:
`password asli -> 🔐 mesin hash -> kode aman -> 💾 database`

Tanpa hashing, aplikasimulah yang menjadi target empuk peretas. 😰

### 2. ✍️ Mengapa Laravel Memilih Bcrypt? (Work Factor Hebat)

**Analogi:** Bayangkan kamu membuat kunci dengan 10 lubang kecil. Itu bisa dibobol dengan kunci lewat malam. Tapi jika kamu buat kunci dengan 1000 lubang yang rumit, butuh waktu berjam-jam bahkan berhari-hari untuk dibobol!

**Mengapa Bcrypt direkomendasikan?** Karena Bcrypt memiliki **"work factor"** atau **"rounds"** - seperti jumlah lubang pada kunci kita. Semakin tinggi angkanya, semakin lama dan susah proses pembobokannya.

**Bagaimana cara kerjanya?**
```php
// Contoh: membuat hash dengan 12 rounds (lebih aman tapi lebih lambat)
$hashed = Hash::make('password', [
    'rounds' => 12,
]);
```
**Apa artinya?**
- `rounds => 12`: Proses hashing dilakukan 12 kali lipat, membuatnya **sangat susah diretas**.
- Namun, lebih lambat: Ini baik untuk keamanan (memperlambat brute force), tapi perlu diperhitungkan saat beban server tinggi.

### 3. ⚡ Perbedaan Bcrypt vs Argon2 (Pendekatan Berbeda)

**Analogi:** Bcrypt adalah brankas yang sangat kuat dengan kunci mekanik lama tapi sangat andal. Argon2 adalah brankas modern dengan teknologi canggih yang bisa disesuaikan dengan kebutuhan spesifik (memori, waktu, kekuatan CPU).

**Mengapa ada dua pilihan?** Karena dunia keamanan terus berkembang, dan Argon2 adalah algoritma yang lebih modern dan bisa disesuaikan untuk menghadapi serangan yang lebih canggih.

**Contoh Implementasi:**
```php
// Bcrypt (default Laravel)
$hashed = Hash::make('password', [
    'rounds' => 12,
]);

// Argon2 (lebih fleksibel)
$hashed = Hash::make('password', [
    'memory' => 1024,  // jumlah memori yang digunakan
    'time' => 2,       // jumlah iterasi
    'threads' => 2,    // jumlah thread
]);
```

---

## Bagian 2: Konfigurasi Hashing - Persiapan Bentengmu 🤖

### 4. 📦 Mengganti Driver Hashing (Pilih Senjata Terbaik)

**Analogi:** Bayangkan kamu sedang memilih helm untuk berperang. Kamu bisa pilih helm baja biasa (`bcrypt`) atau helm teknologi canggih (`argon2`). Pemilihan tergantung kebutuhanmu.

**Mengapa penting?** Karena kamu bisa menyesuaikan algoritma yang paling sesuai dengan kebutuhan keamanan dan performa aplikasimu.

**Bagaimana?** Ganti di file `.env`:
```bash
HASH_DRIVER=argon2  # atau: bcrypt, argon
```

**Contoh Lengkap Perubahan Driver:**

1. **Atur driver di .env:**
```bash
# Pilih salah satu:
HASH_DRIVER=bcrpyt     # default, sangat aman
HASH_DRIVER=argon      # alternatif argon
HASH_DRIVER=argon2     # terbaru, lebih fleksibel
```

2. **Opsi konfigurasi lengkap (jika ingin disesuaikan lebih dalam):**
```bash
# Jalankan perintah ini untuk membuat file konfigurasi hashing
php artisan config:publish hashing
```

File konfigurasi akan muncul di `config/hashing.php` yang berisi semua pengaturan detail untuk masing-masing driver.

### 5. 🛠️ Konfigurasi Lebih Dalam (Opsi Detail)

Jika kamu mengakses `config/hashing.php`, kamu akan menemukan opsi-opsi berikut:

**Konfigurasi Bcrypt:**
```php
'bcrypt' => [
    'rounds' => env('BCRYPT_ROUNDS', 12),
],
```
- `rounds`: Tingkat kesulitan hashing (default 12, semakin tinggi semakin aman tapi lebih lambat)

**Konfigurasi Argon2:**
```php
'argon' => [
    'memory' => 65536,    // jumlah memori dalam KB
    'threads' => 1,       // jumlah thread
    'time' => 4,          // jumlah waktu iterasi
],
```
- `memory`: Semakin besar, semakin susah diretas tapi membutuhkan lebih banyak RAM
- `threads`: Jumlah thread CPU yang digunakan
- `time`: Jumlah iterasi hashing (semakin tinggi, semakin aman tapi lebih lambat)

---

## Bagian 3: Jurus Tingkat Lanjut - Implementasi Hashing 🚀

### 6. 🔐 Hashing Password (Langkah Perlindungan Utama)

**Analogi:** Ini seperti menulis password di kertas, lalu melewatkan kertas itu ke mesin pencacah yang menghancurnya menjadi serpihan kecil tak terbaca. Tapi bedanya, dari serpihan ini kita bisa tahu apakah password aslinya cocok atau tidak!

**Mengapa ini penting?** Ini adalah langkah pertamamu saat menyimpan password pengguna baru.

**Bagaimana?** Gunakan method `Hash::make()`:

**Contoh Lengkap:**
```php
<?php
// app/Http/Controllers/Auth/RegisterController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        // Validasi dulu
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
        ]);

        // Hash password dan simpan user
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // <-- Proses hashing disini
        ]);

        return redirect('/dashboard')->with('status', 'Registrasi berhasil!');
    }
}
```

**Penjelasan Kode:**
- `Hash::make($request->password)`: Proses hashing password sebelum disimpan
- Tidak pernah menyimpan password dalam bentuk aslinya di database
- Laravel secara otomatis memilih algoritma sesuai konfigurasi

### 7. ✅ Verifikasi Password (Pindai Kartu Akses)

**Analogi:** Ini seperti scanner sidik jari di pintu masuk kantor rahasia. Kamu masukkan sidik jari (password), dan scanner membandingkan dengan data yang sudah ter-hash di sistem keamanan.

**Mengapa ini penting?** Untuk memastikan hanya orang dengan password asli yang bisa login.

**Bagaimana?** Gunakan `Hash::check()`:

**Contoh Lengkap:**
```php
<?php
// app/Http/Controllers/Auth/LoginController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // Verifikasi password dengan Hash::check
        if ($user && Hash::check($request->password, $user->password)) {
            // Password cocok, login user
            Auth::login($user);
            return redirect('/dashboard');
        }

        return back()->withErrors([
            'email' => 'Kredensial tidak valid.',
        ]);
    }
}
```

**Alternatif (Laravel otomatis):**
Laravel secara otomatis memverifikasi password dengan `Auth::attempt()`:
```php
if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
    // Login berhasil
    return redirect('/dashboard');
}
```
Namun, `Hash::check()` tetap berguna saat kamu perlu verifikasi manual.

### 8. 🔄 Mengecek Perlu Rehash atau Tidak (Upgrade Perlindunganmu)

**Analogi:** Bayangkan kamu punya brankas lama di rumah, tapi kamu baru saja beli brankas baru yang jauh lebih kuat. Kamu perlu tahu kapan waktunya mengganti brankas lama dengan yang baru.

**Mengapa ini ada?** Jika kamu meningkatkan work factor (rounds) atau mengganti algoritma hashing, kamu butuh tahu password lama perlu di-hash ulang dengan pengaturan baru.

**Bagaimana?** Gunakan `Hash::needsRehash()`:

**Contoh Lengkap:**
```php
<?php
// app/Http/Controllers/Auth/LoginController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user && Hash::check($request->password, $user->password)) {
            // Cek apakah password perlu direhash (misalnya karena upgrade rounds)
            if (Hash::needsRehash($user->password)) {
                // Rehash password dengan pengaturan baru
                $user->password = Hash::make($request->password);
                $user->save();
            }

            Auth::login($user);
            return redirect('/dashboard');
        }

        return back()->withErrors([
            'email' => 'Kredensial tidak valid.',
        ]);
    }
}
```

**Kapan ini terjadi?**
- Kamu meningkatkan `rounds` dari 10 ke 12
- Kamu mengganti dari bcrypt ke argon2
- Algoritma baru lebih kuat dari sebelumnya

### 9. 👨‍👩‍👧 Verifikasi Algoritma (Perlindungan Tambahan)

**Analogi:** Bayangkan kamu punya sistem keamanan yang tidak hanya memindai kartu akses, tapi juga memastikan kartu itu dibuat oleh sistem keamanan resmi milikmu, bukan kartu palsu yang dibuat peretas.

**Mengapa ini penting?** Untuk mencegah peretas menyisipkan hash dengan algoritma yang berbeda dan lebih lemah ke database.

**Bagaimana?** Laravel secara otomatis memverifikasi algoritma hashing:

Default behavior:
- Jika hash tidak sesuai dengan driver yang dipilih, Laravel akan melempar `RuntimeException`
- Ini mencegah manipulasi algoritma hashing

**Contoh Penggunaan:**
```bash
# Secara default, verifikasi algoritma diaktifkan
# Jika ingin menonaktifkan (misalnya saat migrasi algoritma)
HASH_VERIFY=false
```

**Kapan Nonaktifkan?**
- Saat migrasi dari satu algoritma ke algoritma lain
- Saat kamu perlu mendukung beberapa algoritma hashing sekaligus

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Hashing 🧰

### 10. 🔐 Implementasi Lengkap (Praktik Nyata)

Mari kita buat contoh lengkap implementasi hashing dalam aplikasi Laravel:

**1. Model User (app/Models/User.php):**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed', // Laravel 11+ - otomatis hashing
    ];
}
```

**2. Form Register dengan Hashing:**
```blade
<!-- resources/views/auth/register.blade.php -->
<form method="POST" action="{{ route('register') }}">
    @csrf
    <div>
        <label>Nama:</label>
        <input type="text" name="name" required>
    </div>
    <div>
        <label>Email:</label>
        <input type="email" name="email" required>
    </div>
    <div>
        <label>Password:</label>
        <input type="password" name="password" required>
    </div>
    <div>
        <label>Konfirmasi Password:</label>
        <input type="password" name="password_confirmation" required>
    </div>
    <button type="submit">Register</button>
</form>
```

**3. Controller Registrasi Lengkap:**
```php
<?php
// app/Http/Controllers/Auth/RegisterController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    /**
     * Tampilkan form registrasi
     */
    public function showRegistrationForm()
    {
        return view('auth.register');
    }

    /**
     * Proses registrasi
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // <-- Hashing password
        ]);

        // Login otomatis setelah registrasi
        auth()->login($user);

        return redirect('/dashboard')->with('status', 'Registrasi berhasil! Selamat datang!');
    }
}
```

**4. Form Login:**
```blade
<!-- resources/views/auth/login.blade.php -->
<form method="POST" action="{{ route('login') }}">
    @csrf
    <div>
        <label>Email:</label>
        <input type="email" name="email" required>
    </div>
    <div>
        <label>Password:</label>
        <input type="password" name="password" required>
    </div>
    <button type="submit">Login</button>
</form>
```

**5. Controller Login Lengkap:**
```php
<?php
// app/Http/Controllers/Auth/LoginController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    /**
     * Tampilkan form login
     */
    public function showLoginForm()
    {
        return view('auth.login');
    }

    /**
     * Proses login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user && Hash::check($request->password, $user->password)) {
            // Cek apakah perlu rehash
            if (Hash::needsRehash($user->password)) {
                $user->password = Hash::make($request->password);
                $user->save();
            }

            Auth::login($user);
            return redirect('/dashboard')->with('status', 'Login berhasil!');
        }

        return back()->withErrors([
            'email' => 'Kredensial tidak valid.',
        ]);
    }

    /**
     * Logout
     */
    public function logout()
    {
        Auth::logout();
        return redirect('/login')->with('status', 'Anda telah logout.');
    }
}
```

### 11. 💉 Service Class untuk Hashing (Abstraksi Lebih Lanjut)

**Prinsipnya: Jangan biarkan controller kotor dengan logika hashing kompleks!** Untuk aplikasi besar, buat service class khusus untuk urusan keamanan.

**1. Buat Hashing Service:**
```php
<?php
// app/Services/HashingService.php

namespace App\Services;

use Illuminate\Support\Facades\Hash;

class HashingService
{
    /**
     * Hash password dengan driver dan opsi yang ditentukan
     */
    public function hashPassword(string $password, array $options = []): string
    {
        return Hash::make($password, $options);
    }

    /**
     * Verifikasi password
     */
    public function verifyPassword(string $plainPassword, string $hashedPassword): bool
    {
        return Hash::check($plainPassword, $hashedPassword);
    }

    /**
     * Cek apakah perlu rehash
     */
    public function needsRehash(string $hashedPassword): bool
    {
        return Hash::needsRehash($hashedPassword);
    }

    /**
     * Update password dengan rehash jika perlu
     */
    public function updatePassword(string $currentHash, string $newPlainPassword): string
    {
        if ($this->needsRehash($currentHash)) {
            return $this->hashPassword($newPlainPassword);
        }
        
        return $currentHash;
    }
}
```

**2. Gunakan di Controller:**
```php
<?php
// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\HashingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function __construct(
        protected HashingService $hashingService
    ) {}

    /**
     * Update password user
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = Auth::user();

        // Verifikasi password lama
        if (!$this->hashingService->verifyPassword($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Password saat ini salah.']);
        }

        // Hash password baru
        $user->password = $this->hashingService->hashPassword($request->new_password);
        $user->save();

        return redirect('/profile')->with('status', 'Password berhasil diubah!');
    }
}
```

---

## Bagian 5: Menjadi Master Keamanan Hashing 🏆

### 12. ✨ Wejangan dari Guru

1.  **Jangan Pernah Simpan Password dalam Bentuk Asli!** Gunakan hashing setiap kali.
2.  **Pilih Work Factor yang Tepat:** Terlalu tinggi membuat lambat, terlalu rendah kurang aman. Biasanya 12 untuk bcrypt adalah awal yang bagus.
3.  **Gunakan Argon2 untuk Aplikasi Modern:** Lebih fleksibel dan bisa disesuaikan dengan kebutuhan keamanan spesifik.
4.  **Aktifkan Verifikasi Algoritma:** Ini adalah benteng tambahan yang melindungimu dari manipulasi.
5.  **Lakukan Rehash Secara Otomatis:** Saat login, cek apakah password perlu di-hash ulang.
6.  **Gunakan Service Class untuk Aplikasi Besar:** Pisahkan logika keamanan dari controller agar lebih terorganisir.

### 13. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Hashing di Laravel:

#### 🔐 Fungsi Hash
| Fungsi | Penjelasan |
|--------|------------|
| `Hash::make($password)` | Membuat hash dari password |
| `Hash::check($plain, $hashed)` | Memverifikasi apakah password cocok |
| `Hash::needsRehash($hashed)` | Mengecek perlu rehash atau tidak |

#### ⚙️ Konfigurasi Hashing
| Opsi | Default | Fungsi |
|------|---------|--------|
| `HASH_DRIVER=bcrpyt` | bcrypt | Driver hashing utama |
| `BCRYPT_ROUNDS=12` | 10 | Tingkat kesulitan bcrypt |
| `HASH_VERIFY=true` | true | Aktifkan verifikasi algoritma |

#### 🔧 Driver Hashing
| Driver | Kelebihan | Kekurangan |
|--------|-----------|------------|
| **Bcrypt** | Sangat aman, standar industri | Sedikit terbatas dalam konfigurasi |
| **Argon2** | Sangat fleksibel, modern | Perlu konfigurasi lebih lanjut |
| **Argon2id** | Gabungan terbaik dari argon2i & argon2d | Lebih kompleks |

#### 🛠️ Opsi Konfigurasi
| Opsi | Tipe | Fungsi |
|------|------|--------|
| `rounds` | integer | Jumlah iterasi bcrypt |
| `memory` | integer | Penggunaan memori argon (KB) |
| `time` | integer | Jumlah iterasi argon |
| `threads` | integer | Jumlah thread argon |

#### 📦 Konfigurasi File
| Perintah | Fungsi |
|----------|--------|
| `php artisan config:publish hashing` | Membuat file konfigurasi hashing |

#### 🎯 Praktik Terbaik
| Praktik | Penjelasan |
|---------|------------|
| Hash saat menyimpan | Jangan pernah simpan plain text |
| Verifikasi saat login | Gunakan `Hash::check()` untuk validasi |
| Rehash otomatis | Gunakan `Hash::needsRehash()` saat login |
| Konfigurasi aman | Gunakan work factor yang sesuai |

### 14. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi tentang Hashing di Laravel, dari konsep dasar hingga implementasi kompleks. Kamu hebat! Dengan memahami dan menerapkan hashing dengan benar, kamu sekarang bisa melindungi data pengguna seperti seorang ahli keamanan profesional.

Ingat, **keamanan adalah tanggung jawab kita bersama** sebagai developer. Menguasai hashing berarti kamu sudah siap membangun aplikasi Laravel yang tidak hanya hebat, tapi juga aman dan terpercaya.

Jangan pernah berhenti belajar tentang keamanan! Dunia peretasan terus berkembang, maka kita juga harus terus meningkatkan benteng pertahanan kita. Selamat ngoding dengan aman, murid kesayanganku! 🛡️🔐🚀

```

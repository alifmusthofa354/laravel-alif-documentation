# 🔐 Autentikasi di Laravel: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Hari ini kita akan belajar tentang **Autentikasi** - konsep penting yang membuat aplikasimu aman dan dapat membedakan antara pengguna asli dan penipu. Ini adalah topik yang super penting untuk membangun aplikasi Laravel yang aman dan profesional!

Bayangkan Autentikasi seperti **sistem keamanan** di gedung kantor. Saat seseorang datang (pengguna), petugas keamanan (Laravel) akan mengecek kartu identitasnya (login) sebelum mengizinkan masuk ke area kerja. Siap? Ayo kita mulai petualangan ini!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Autentikasi Itu Sebenarnya?

**Analogi:** Bayangkan kamu seorang penjaga bank yang sangat teliti. Setiap kali seseorang ingin masuk ke brankas, kamu tidak langsung membukakan pintu. Kamu akan **memverifikasi identitasnya** terlebih dahulu: apakah kartu identitasnya valid, apakah wajahnya cocok, apakah password yang diberikan benar?

**Autentikasi dalam Laravel** bekerja seperti ini! Ini adalah sistem yang **memverifikasi identitas** pengguna sebelum memberinya akses ke area tertentu dalam aplikasi kamu.

**Mengapa ini penting?** Karena ini membuat aplikasi kita:
- **Aman**: Hanya pengguna yang sah yang bisa mengakses data sensitif.
- **Pribadi**: Setiap pengguna bisa memiliki pengalaman yang berbeda-beda.
- **Terlindungi**: Data tidak bisa diakses oleh orang yang tidak berhak.

Tanpa Autentikasi, semua orang bisa seenaknya masuk ke akun orang lain dan mengakses data sensitif. Itu adalah mimpi buruk untuk dirawat. 😵

**Bagaimana cara kerjanya?** Alur kerja (workflow) Autentikasi kita menjadi sangat rapi:

`➡️ User Datang -> 🔐 Verifikasi Identitas -> ✅ Akses Diberikan/Jangan Diberikan`

### 2. ⚡ Konsep Utama dalam Autentikasi

**Analogi:** Ini seperti memiliki berbagai jenis **kunci keamanan** untuk gedung kamu, masing-masing dengan tingkat keamanan yang berbeda.

Laravel menggunakan dua konsep utama dalam sistem autentikasi:

#### Guards (Penjaga Pintu)
**Apa itu?** Guards adalah **metode** bagaimana pengguna diautentikasi.
- **Session Guard**: Penjaga yang menggunakan cookie/session (untuk aplikasi web biasa)
- **Token Guard**: Penjaga yang menggunakan token (untuk API)
- **Custom Guard**: Penjaga buatan sendiri

**Contoh:**
```php
// Gunakan session guard (default)
Auth::guard('web')->attempt($credentials);

// Gunakan token guard
Auth::guard('api')->attempt($credentials);
```

#### Providers (Pengambil Data Pengguna)
**Apa itu?** Providers adalah **tempat asal data pengguna** yang digunakan untuk verifikasi.
- **Database Provider**: Ambil data dari database
- **Eloquent Provider**: Ambil data menggunakan Eloquent Model
- **Custom Provider**: Pengambil data buatan sendiri

**Contoh:**
```php
// Ambil pengguna dari database
Auth::guard('web')->user(); // Menggunakan Eloquent User model
```

### 3. 🌐 Jenis Autentikasi di Laravel

**Analogi:** Ini seperti memiliki berbagai jenis **metode keamanan** tergantung situasi: kunci biasa untuk rumah, kunci digital untuk mobil mewah, dan kunci kombinasi untuk brankas.

Laravel mendukung dua jenis utama autentikasi:

#### Autentikasi Berbasis Browser (Cookie/Session)
**Digunakan untuk:** Aplikasi web tradisional dengan server-side rendering
**Keamanan:** Session di server + cookie di client
**Contoh:** Login ke dashboard admin

#### Autentikasi API (Token-based)
**Digunakan untuk:** API untuk mobile app, SPA (Single Page Application)
**Keamanan:** Token di header request
**Contoh:** Mobile app yang mengakses data dari Laravel API

---

## Bagian 2: Membangun Sistem Autentikasi Dasar 🏗️

### 4. 🚀 Laravel Starter Kits (Pintu Masuk Cepat!)

**Analogi:** Ini seperti memiliki **set perlengkapan lengkap** yang sudah siap pakai ketika kamu pindah rumah - tidak perlu beli furnitur dari awal.

**Mengapa Starter Kits keren?** Karena kamu bisa mendapatkan sistem autentikasi lengkap hanya dengan beberapa perintah!

**Jenis Starter Kits:**
- **Breeze**: Paling simple, ideal untuk learning
- **Jetstream**: Bawaan Livewire/Inertia, fitur lengkap
- **Fortify**: Tanpa UI, hanya backend logic

**Contoh Install Breeze:**
```bash
# Install Laravel Breeze
composer require laravel/breeze --dev

# Install Breeze dengan Blade
php artisan breeze:install

# Install Breeze dengan React
php artisan breeze:install react

# Install Breeze dengan Vue
php artisan breeze:install vue

# Install Breeze dengan Livewire
php artisan breeze:install livewire

# Install Breeze dengan API only (tanpa UI)
php artisan breeze:install api
```

**Langkah Setelah Install:**
```bash
# Install dependencies
npm install && npm run dev

# Buat database
php artisan migrate
```

**Setelah migrasi selesai:**
- Buka `/register` untuk mendaftar
- Buka `/login` untuk login
- Fitur lengkap aktif: login, register, forgot password, email verification, dll.

### 5. 🗄️ Persiapan Database (Dasar yang Kuat!)

**Analogi:** Ini seperti **membangun fondasi gedung** yang kuat sebelum membangun lantai-lantai di atasnya.

**Mengapa database penting?** Karena semua data pengguna (email, password, nama, dll.) harus disimpan di suatu tempat yang aman.

**Struktur Tabel Users (Bawaan Laravel):**
```php
// database/migrations/create_users_table.php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password'); // Perhatikan: minimal 60 karakter untuk bcrypt
    $table->rememberToken();    // Untuk fitur "Remember Me"
    $table->timestamps();
});
```

**Catatan Penting:**
- **Panjang Password**: Kolom password harus minimal **60 karakter** karena bcrypt menghasilkan hash panjang 60 karakter
- **Remember Token**: Kolom `remember_token` harus bisa nullable dan panjangnya sekitar 100 karakter

**Contoh Migrasi Lengkap:**
```php
// database/migrations/2025_01_01_000000_create_users_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password', 255); // Bisa disesuaikan
            $table->rememberToken();
            $table->string('avatar')->nullable(); // Tambahan kolom
            $table->string('phone')->nullable();  // Tambahan kolom
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

**Model User (Bawaan Laravel):**
```php
<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed', // Laravel 11+ menggunakan hashed otomatis
    ];
}
```

---

## Bagian 3: Membangun Login Manual (Sistem yang Kuat!) 🔑

### 6. 👤 Login Manual (Membangun Sendiri!)

**Analogi:** Ini seperti **membuat kunci sendiri** ketimbang menggunakan kunci bawaan pabrik. Kamu bisa mengontrol semua prosesnya.

**Mengapa perlu login manual?** Kadang kamu butuh kontrol penuh atau fitur custom seperti login dengan username selain email.

**Contoh Form Login (Blade):**
```blade
{{-- resources/views/auth/login.blade.php --}}
@extends('layouts.app')

@section('title', 'Login')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <h4 class="mb-0">Login ke Akun Anda</h4>
                </div>
                <div class="card-body">
                    <form method="POST" action="{{ route('login') }}">
                        @csrf
                        
                        <div class="mb-3">
                            <label for="email" class="form-label">Email atau Username</label>
                            <input type="text" class="form-control @error('email') is-invalid @enderror" 
                                   id="email" name="email" value="{{ old('email') }}" required>
                            @error('email')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                        
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control @error('password') is-invalid @enderror" 
                                   id="password" name="password" required>
                            @error('password')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                        
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="remember" name="remember">
                            <label class="form-check-label" for="remember">Ingat saya</label>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-100">Login</button>
                    </form>
                    
                    <div class="mt-3 text-center">
                        <a href="{{ route('password.request') }}">Lupa Password?</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
```

**Contoh Controller Login:**
```php
<?php
// app/Http/Controllers/Auth/LoginController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.login');
    }

    public function login(Request $request): RedirectResponse
    {
        // Validasi input
        $credentials = $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        // Check rate limiting
        if ($this->tooManyLoginAttempts($request)) {
            $this->sendLockoutResponse($request);
        }

        // Coba login
        if ($this->attemptLogin($request, $credentials)) {
            return $this->sendLoginResponse($request);
        }

        // Jika login gagal
        $this->incrementLoginAttempts($request);

        return $this->sendFailedLoginResponse($request);
    }

    protected function attemptLogin(Request $request, array $credentials): bool
    {
        // Coba login dengan email
        if (Auth::attempt($credentials, $request->filled('remember'))) {
            return true;
        }

        // Jika gagal, coba login dengan username
        $field = filter_var($credentials['email'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $credentials = [$field => $credentials['email'], 'password' => $credentials['password']];

        return Auth::attempt($credentials, $request->filled('remember'));
    }

    protected function sendLoginResponse(Request $request): RedirectResponse
    {
        $request->session()->regenerate();

        // Hapus dari rate limiter
        $this->clearLoginAttempts($request);

        return redirect()->intended('/dashboard');
    }

    protected function sendFailedLoginResponse(Request $request)
    {
        throw ValidationException::withMessages([
            'email' => [trans('auth.failed')],
        ]);
    }

    protected function tooManyLoginAttempts(Request $request): bool
    {
        return RateLimiter::tooManyAttempts(
            $this->throttleKey($request), 5
        );
    }

    protected function incrementLoginAttempts(Request $request): void
    {
        RateLimiter::hit($this->throttleKey($request));
    }

    protected function clearLoginAttempts(Request $request): void
    {
        RateLimiter::clear($this->throttleKey($request));
    }

    protected function throttleKey(Request $request): string
    {
        return $request->ip();
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
```

**Route untuk Login Manual:**
```php
<?php
// routes/web.php

use App\Http\Controllers\Auth\LoginController;

Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
```

### 7. 🔑 Fitur "Remember Me" (Kemudahan Pengguna!)

**Analogi:** Ini seperti memberi **kunci cadangan** ke pengguna agar mereka bisa masuk lagi tanpa harus memasukkan password setiap kali.

**Mengapa "Remember Me" penting?** Karena memberikan kemudahan akses bagi pengguna yang percaya pada perangkatnya.

**Implementasi "Remember Me":**
```php
// Di controller login
if (Auth::attempt($credentials, $request->filled('remember'))) {
    // Login berhasil dengan "Remember Me"
    return redirect()->intended('/dashboard');
}

// Atau tanpa form request
if (Auth::attempt($credentials, true)) {
    // Login dengan "Remember Me" langsung true
    return redirect()->intended('/dashboard');
}
```

**Bagaimana Laravel Menyimpan dan Mengelola "Remember Me"?**
- Laravel membuat token acak dan menyimpannya di cookie
- Token tersebut juga disimpan di kolom `remember_token` di database
- Setiap kali request, Laravel mengecek token tersebut

### 8. 📡 HTTP Basic Authentication (Sistem Cepat!)

**Analogi:** Ini seperti **sistem keamanan sederhana** yang hanya meminta username dan password langsung di header - tidak perlu halaman login.

**Kapan menggunakan HTTP Basic Auth?** Untuk API sederhana atau sistem internal yang tidak perlu UI login.

**Contoh Route dengan HTTP Basic:**
```php
Route::get('/api/users', function () {
    return User::all();
})->middleware('auth.basic');

// Atau untuk route spesifik
Route::group(['middleware' => 'auth.basic'], function () {
    Route::get('/profile', function () {
        return Auth::user();
    });
    
    Route::get('/dashboard', function () {
        return view('dashboard');
    });
});
```

**Menggunakan Custom Username Field:**
```php
use Illuminate\Http\Request;

Route::get('/api/users', function (Request $request) {
    return User::all();
})->middleware('auth.basic:username'); // Menggunakan field username bukan email
```

---

## Bagian 4: Proteksi Route dan Middleware 🚪

### 9. 🔒 Proteksi Route (Jaga Pintu Masuk!)

**Analogi:** Ini seperti **pasang penjaga di setiap pintu** penting dalam gedung kamu - tidak sembarangan orang bisa masuk.

**Mengapa proteksi route penting?** Karena mencegah akses tidak sah ke fitur-fitur penting dalam aplikasi kamu.

**Proteksi Route Dasar:**
```php
// Hanya pengguna yang login yang bisa mengakses
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware('auth');

// Atau dengan group
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'index']);
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::get('/admin', [AdminController::class, 'index']);
});
```

**Proteksi Route dengan Guard Tertentu:**
```php
// Hanya admin yang bisa mengakses
Route::get('/admin', function () {
    return view('admin.dashboard');
})->middleware('auth:admin');

// Hanya user biasa yang bisa mengakses
Route::get('/user', function () {
    return view('user.dashboard');
})->middleware('auth:web');
```

**Proteksi Route dengan Multiple Middleware:**
```php
Route::get('/premium', function () {
    return view('premium.content');
})->middleware(['auth', 'verified', 'subscribed']);
```

**Contoh Middleware Custom untuk Role:**
```php
<?php
// app/Http/Middleware/CheckRole.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!Auth::check()) {
            return redirect('login');
        }

        $user = Auth::user();
        
        if (!in_array($user->role, $roles)) {
            abort(403, 'Akses ditolak.');
        }

        return $next($request);
    }
}
```

**Menggunakan Middleware Role:**
```php
Route::get('/admin', function () {
    return view('admin.dashboard');
})->middleware(['auth', 'role:admin']);

Route::get('/manager', function () {
    return view('manager.dashboard');
})->middleware(['auth', 'role:admin,manager']);
```

### 10. 🚪 Logout (Pintu Keluar yang Aman!)

**Analogi:** Ini seperti **memastikan semua akses ditutup** saat seseorang meninggalkan gedung - semua kunci direset dan session diakhiri.

**Mengapa logout penting?** Karena mencegah akses tidak sah saat pengguna menggunakan perangkat bersama atau perangkat publik.

**Contoh Controller Logout:**
```php
<?php
// Dalam LoginController atau AuthController

public function logout(Request $request): RedirectResponse
{
    // Logout dari auth guard
    Auth::logout();

    // Hapus semua data session
    $request->session()->invalidate();

    // Regenerasi token CSRF untuk keamanan
    $request->session()->regenerateToken();

    // Hapus session login dari guards lain jika ada
    $request->session()->regenerate();

    return redirect('/')->with('status', 'Berhasil logout!');
}
```

**Logout untuk Multiple Guards:**
```php
public function logout(Request $request): RedirectResponse
{
    // Logout dari semua guards
    Auth::guard('web')->logout();
    Auth::guard('admin')->logout();
    
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect('/')->with('status', 'Berhasil logout dari semua akun!');
}
```

**Logout dengan Flash Message:**
```php
public function logout(Request $request): RedirectResponse
{
    Auth::logout();
    
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect('/')->with('success', 'Anda telah berhasil logout. Sampai jumpa kembali!');
}
```

### 11. 🔐 Konfirmasi Password (Pemeriksaan Tambahan!)

**Analogi:** Ini seperti **meminta verifikasi tambahan** sebelum melakukan tindakan penting - seperti masukkan PIN lagi sebelum mengganti password utama.

**Kapan menggunakan password confirmation?** Untuk tindakan sensitif seperti:
- Ganti password
- Hapus akun
- Ganti email
- Akses fitur premium

**Menggunakan Middleware Password Confirm:**
```php
Route::get('/settings/security', function () {
    return view('settings.security');
})->middleware(['auth', 'password.confirm']);

// Atau untuk grup route
Route::middleware(['auth', 'password.confirm'])->group(function () {
    Route::get('/delete-account', [UserController::class, 'showDeleteForm']);
    Route::delete('/delete-account', [UserController::class, 'deleteAccount']);
    
    Route::get('/change-password', [UserController::class, 'showChangePasswordForm']);
    Route::put('/change-password', [UserController::class, 'changePassword']);
});
```

**Custom Durasi Password Confirmation:**
```php
// Secara default, Laravel mengingat konfirmasi password selama 3 jam
// Kamu bisa mengubahnya di config/auth.php

// Atau secara manual di controller
public function confirmPassword(Request $request)
{
    $request->session()->put('auth.password_confirmed_at', time());
    
    return redirect()->intended('/settings');
}
```

---

## Bagian 5: Autentikasi API dengan Sanctum 🌐

### 12. 🌟 Laravel Sanctum (API yang Aman!)

**Analogi:** Ini seperti **kunci pintar untuk API** - bisa digunakan untuk berbagai jenis aplikasi: mobile, SPA, atau browser.

**Mengapa Sanctum keren?** Karena:
- Ringan dan mudah diimplementasi
- Bisa digunakan untuk SPA dan mobile app
- Support token-based auth
- Bisa digunakan untuk browser sessions juga

**Install Sanctum:**
```bash
composer require laravel/sanctum
```

**Publish Migration:**
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

**Run Migration:**
```bash
php artisan migrate
```

**Register Sanctum Middleware:**
```php
// app/Http/Kernel.php
protected $middlewareAliases = [
    // ... middleware lain
    'auth:sanctum' => \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
];
```

### 13. 🛡️ Sanctum Personal Access Tokens

**Analogi:** Ini seperti **kunci akses pribadi** yang bisa kamu berikan ke aplikasi atau script untuk mengakses API kamu.

**Mengapa Personal Access Tokens penting?** Karena memungkinkan pengguna membuat token untuk aplikasi eksternal mereka sendiri.

**Contoh Model dengan Sanctum:**
```php
<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    
    // ... implementasi lainnya
}
```

**Membuat Personal Access Token (di controller):**
```php
public function createToken(Request $request)
{
    $request->validate([
        'token_name' => 'required|string|max:255',
        'abilities' => 'array',
        'abilities.*' => 'string',
    ]);

    $token = $request->user()->createToken(
        $request->token_name,
        $request->abilities ?? ['*']
    );

    return response()->json([
        'token' => $token->plainTextToken,
        'abilities' => $token->accessToken->abilities,
    ]);
}
```

**Contoh Frontend Request (JavaScript):**
```javascript
// Menggunakan token untuk request API
const token = '1|your-personal-access-token-here';

fetch('/api/user', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})
.then(response => response.json())
.then(data => console.log(data));
```

**Menggunakan Sanctum dengan SPA:**
```php
// routes/api.php
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->get('/dashboard', function (Request $request) {
    return [
        'user' => $request->user(),
        'dashboard_data' => 'Data yang hanya bisa diakses oleh user yang login'
    ];
});
```

**Frontend untuk Sanctum SPA:**
```javascript
// Login dengan Sanctum
async function login(email, password) {
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        credentials: 'include', // Penting untuk session cookies
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    const data = await response.json();
    
    if (response.ok) {
        // Login berhasil, sekarang bisa akses API
        await fetchUserData();
    }
}

// Fetch data user
async function fetchUserData() {
    const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        credentials: 'include' // Penting untuk session cookies
    });

    if (response.ok) {
        const user = await response.json();
        console.log('User data:', user);
    }
}
```

### 14. 🧩 Sanctum dengan API-only

**Mengapa API-only?** Untuk mobile app atau third-party integrasi yang tidak perlu session.

**Contoh Login API-only:**
```php
// routes/api.php
Route::post('/login', [ApiController::class, 'login']);
Route::post('/logout', [ApiController::class, 'logout'])->middleware('auth:sanctum');

// Controller API
class ApiController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
}
```

---

## Bagian 6: Custom Guards dan Providers (Level Lanjutan!) 🚀

### 15. 🛠️ Custom Guards (Penjaga Khusus!)

**Analogi:** Ini seperti **membuat sistem keamanan sendiri** untuk area tertentu dalam gedung kamu - bisa dengan metode verifikasi yang berbeda.

**Kapan perlu custom guard?** Saat kamu butuh metode autentikasi yang berbeda dari bawaan Laravel.

**Contoh Custom Guard (JWT):**
```php
<?php
// app/Services/JwtGuard.php

namespace App\Services;

use Illuminate\Auth\GuardHelpers;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Http\Request;

class JwtGuard implements Guard
{
    use GuardHelpers;

    protected $request;
    protected $provider;

    public function __construct(UserProvider $provider, Request $request)
    {
        $this->provider = $provider;
        $this->request = $request;
    }

    public function user()
    {
        $token = $this->getToken();
        
        if (! $token) {
            return null;
        }

        $payload = $this->decodeToken($token);

        if (! $payload) {
            return null;
        }

        $this->user = $this->provider->retrieveById($payload['sub']);

        return $this->user;
    }

    public function validate(array $credentials = [])
    {
        if (! isset($credentials['email'], $credentials['password'])) {
            return false;
        }

        $user = $this->provider->retrieveByCredentials($credentials);

        return $user && $this->provider->validateCredentials($user, $credentials);
    }

    protected function getToken()
    {
        $header = $this->request->header('Authorization');

        if (! $header) {
            return null;
        }

        return str_replace('Bearer ', '', $header);
    }

    protected function decodeToken($token)
    {
        // Decode JWT token di sini
        // Ini hanya contoh - gunakan library JWT sebenarnya
        $payload = base64_decode(str_replace('_', '/', str_replace('-', '+', explode('.', $token)[1])));
        return json_decode($payload, true);
    }
}
```

**Register Custom Guard:**
```php
// app/Providers/AuthServiceProvider.php
use App\Services\JwtGuard;
use Illuminate\Support\Facades\Auth;

public function boot()
{
    Auth::extend('jwt', function ($app, $name, array $config) {
        $guard = new JwtGuard(
            Auth::createUserProvider($config['provider']),
            $app['request']
        );

        return $guard;
    });
}
```

**Gunakan Custom Guard:**
```php
// Di route
Route::middleware('auth:jwt')->get('/api/secure', function () {
    return Auth::user();
});

// Di controller
$user = Auth::guard('jwt')->user();
```

### 16. 🏛️ Custom Providers (Pengambil Data Khusus!)

**Analogi:** Ini seperti **menggunakan sistem database yang berbeda** untuk menyimpan dan mengambil data pengguna - bisa dari MongoDB, LDAP, atau API eksternal.

**Kapan perlu custom provider?** Saat kamu menyimpan data pengguna di tempat lain selain database biasa.

**Contoh Custom Provider (API External):**
```php
<?php
// app/Providers/ExternalUserProvider.php

namespace App\Providers;

use Illuminate\Auth\UserProviderInterface;
use Illuminate\Contracts\Auth\Authenticatable as UserContract;

class ExternalUserProvider implements UserProviderInterface
{
    protected $httpClient;

    public function __construct($httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function retrieveById($identifier)
    {
        $response = $this->httpClient->get("https://api.external.com/users/{$identifier}");
        
        if ($response->getStatusCode() === 200) {
            $userData = json_decode($response->getBody(), true);
            return new ExternalUser($userData);
        }

        return null;
    }

    public function retrieveByToken($identifier, $token)
    {
        $user = $this->retrieveById($identifier);
        
        if ($user && hash_equals($user->getRememberToken(), $token)) {
            return $user;
        }

        return null;
    }

    public function updateRememberToken(UserContract $user, $token)
    {
        // Update token di API external
        $this->httpClient->put("https://api.external.com/users/{$user->getAuthIdentifier()}/token", [
            'json' => ['remember_token' => $token]
        ]);
    }

    public function retrieveByCredentials(array $credentials)
    {
        $email = $credentials['email'];
        $password = $credentials['password'];
        
        $response = $this->httpClient->post('https://api.external.com/auth/login', [
            'json' => [
                'email' => $email,
                'password' => $password
            ]
        ]);

        if ($response->getStatusCode() === 200) {
            $userData = json_decode($response->getBody(), true);
            return new ExternalUser($userData);
        }

        return null;
    }

    public function validateCredentials(UserContract $user, array $credentials)
    {
        // Validasi dilakukan di API external
        return true; // API external sudah validasi
    }
}
```

**Register Custom Provider:**
```php
// app/Providers/AuthServiceProvider.php
use App\Providers\ExternalUserProvider;

public function boot()
{
    Auth::provider('external', function ($app, array $config) {
        return new ExternalUserProvider(
            $app->make('http.client')
        );
    });
}
```

**Gunakan Custom Provider:**
```php
// Di config/auth.php
'providers' => [
    'external_users' => [
        'driver' => 'external',
    ],
],

'guards' => [
    'external' => [
        'driver' => 'session',
        'provider' => 'external_users',
    ],
],
```

---

## Bagian 7: Events dan Customization 📢

### 17. 📡 Authentication Events (Sistem Pemberitahuan!)

**Analogi:** Ini seperti **sistem alarm keamanan** yang memberi tahu kamu setiap kali ada aktivitas penting - login, logout, register, dll.

**Mengapa events penting?** Karena kamu bisa merespons secara otomatis terhadap aktivitas autentikasi.

**Events yang Tersedia:**
- `Illuminate\Auth\Events\Login`
- `Illuminate\Auth\Events\Failed`
- `Illuminate\Auth\Events\Logout`
- `Illuminate\Auth\Events\Lockout`
- `Illuminate\Auth\Events\PasswordReset`
- `Illuminate\Auth\Events\Registered`

**Contoh Event Listener:**
```php
<?php
// app/Listeners/Auth/LoginListener.php

namespace App\Listeners\Auth;

use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;

class LoginListener
{
    public function handle(Login $event)
    {
        Log::info('User logged in', [
            'user_id' => $event->user->id,
            'email' => $event->user->email,
            'ip' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'timestamp' => now(),
        ]);

        // Kirim notifikasi ke admin
        // Update last login time
        // Track login location
    }
}
```

**Register Event Listener:**
```php
<?php
// app/Providers/EventServiceProvider.php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Auth\Events\Login;
use App\Listeners\Auth\LoginListener;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Login::class => [
            LoginListener::class,
        ],
        // Tambahkan listener lain di sini
    ];

    public function boot()
    {
        //
    }
}
```

### 18. 🔧 Customization dan Best Practices

**Best Practices Autentikasi:**

1. **Rate Limiting**: Cegah brute force attack
   ```php
   // Di controller login
   if (RateLimiter::tooManyAttempts($request->ip(), 5)) {
       return back()->withErrors(['email' => 'Too many login attempts.']);
   }
   ```

2. **Password Complexity**: Gunakan aturan password yang kuat
   ```php
   use Illuminate\Validation\Rules\Password;

   Password::min(8)
           ->letters()
           ->mixedCase()
           ->numbers()
           ->symbols()
           ->uncompromised();
   ```

3. **Session Security**: Gunakan konfigurasi session yang aman
   ```php
   // config/session.php
   'secure' => env('SESSION_SECURE_COOKIE'),
   'http_only' => true,
   'same_site' => 'lax',
   ```

4. **Password Confirmation**: Untuk aksi sensitif
   ```php
   Route::middleware(['password.confirm'])->group(function () {
       // Route yang memerlukan konfirmasi password
   });
   ```

---

## Bagian 8: Peralatan Canggih di 'Kotak Perkakas' Autentikasi 🧰

### 19. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Autentikasi di Laravel:

#### 🚀 Starter Kits
| Perintah | Fungsi |
|----------|--------|
| `composer require laravel/breeze --dev` | Install Laravel Breeze |
| `php artisan breeze:install` | Install Breeze dengan Blade |
| `php artisan breeze:install api` | Install Breeze API only |
| `npm install && npm run dev` | Install dan build assets |
| `php artisan migrate` | Migrate database |

#### 🔐 Basic Auth Methods
| Metode | Fungsi |
|--------|--------|
| `Auth::user()` | Dapatkan user yang sedang login |
| `Auth::id()` | Dapatkan ID user yang sedang login |
| `Auth::check()` | Cek apakah user sedang login |
| `Auth::guest()` | Cek apakah user tidak login |
| `Auth::attempt($credentials)` | Coba login dengan credentials |

#### 🚪 Route Protection
| Middleware | Fungsi |
|------------|--------|
| `auth` | Proteksi route - hanya user login |
| `auth:admin` | Proteksi route - hanya admin |
| `guest` | Hanya user yang belum login |
| `password.confirm` | Konfirmasi password sebelum akses |
| `auth:sanctum` | Proteksi API route dengan Sanctum |

#### 🌟 Sanctum Methods
| Metode | Fungsi |
|--------|--------|
| `user()->createToken('token-name')` | Buat personal access token |
| `user()->tokens()->delete()` | Hapus semua token |
| `request()->user()->currentAccessToken()->delete()` | Hapus token saat ini |
| `HasApiTokens` | Trait untuk model User |

#### 🧪 Security Features
| Fitur | Fungsi |
|--------|--------|
| `RateLimiter` | Limit jumlah request |
| `throttle:60,1` | Rate limit 60 request per minute |
| `password.confirm` | Middleware konfirmasi password |
| `encrypt cookies` | Enkripsi cookie sensitif |

#### 🛠️ Auth Configuration
| File | Fungsi |
|------|--------|
| `config/auth.php` | Konfigurasi autentikasi utama |
| `config/session.php` | Konfigurasi session |
| `config/sanctum.php` | Konfigurasi Laravel Sanctum |
| `User` model | Model autentikasi utama |

---

## Bagian 9: Menjadi Master Autentikasi 🏆

### 20. ✨ Wejangan dari Guru

1. **Mulai Simple**: Gunakan Breeze untuk belajar, naik ke Jetstream saat siap.
2. **Security First**: Selalu prioritaskan keamanan daripada kemudahan.
3. **Rate Limiting**: Implementasi rate limiting untuk mencegah brute force.
4. **Session Security**: Gunakan konfigurasi session yang aman.
5. **Password Policy**: Gunakan password policy yang kuat.
6. **Monitor Activity**: Gunakan event untuk track aktivitas login.
7. **API Security**: Gunakan Sanctum untuk API modern.
8. **Testing adalah Kewajiban**: Uji semua flow autentikasi secara menyeluruh.

### 21. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Autentikasi, dari yang paling dasar sampai yang paling rumit. Autentikasi adalah fondasi penting dalam aplikasi web modern, dan dengan pemahaman ini kamu bisa membangun sistem yang aman dan profesional!

Dengan memahami Autentikasi, kamu sekarang bisa:
- Membangun sistem login/register dari awal
- Menggunakan starter kits dengan efektif
- Mengamankan route dengan middleware
- Membuat API dengan Sanctum
- Membuat custom guard dan provider
- Mengelola session dan token dengan benar
- Menangani security concerns dengan tepat

Autentikasi bukan hanya tentang teknis - ini tentang melindungi data dan memberikan pengalaman pengguna yang aman. Inilah saatnya kamu menjadi bagian dari developer yang membangun aplikasi yang bisa dipercaya!

Jangan pernah berhenti belajar dan mencoba. Implementasikan sistem autentikasi yang aman di proyekmu berikutnya. Selamat ngoding, murid kesayanganku! 🎉

---

## Bagian 10: FAQ (Pertanyaan Sering Ditanyakan) ❓

### 22. 🤔 FAQ Singkat

**Q: Perbedaan antara Auth::user() dan $request->user()?**
A: Keduanya mengembalikan user yang sedang login. `Auth::user()` adalah facade, sedangkan `$request->user()` mengakses dari request instance.

**Q: Kapan harus menggunakan Sanctum vs Passport?**
A: Gunakan Sanctum untuk SPA, mobile app, dan API sederhana. Gunakan Passport jika kamu butuh fitur OAuth2 lengkap.

**Q: Bagaimana cara mengganti field login dari email ke username?**
A: Override method `username()` di LoginController atau buat custom guard.

**Q: Bagaimana cara membuat multiple auth (user & admin)?**
A: Gunakan multiple guards di `config/auth.php` dengan provider yang berbeda.

**Q: Apa itu "stateful" vs "stateless" dalam Sanctum?**
A: Stateful (untuk browser) menggunakan cookies/session, stateless (untuk API) menggunakan token di header.
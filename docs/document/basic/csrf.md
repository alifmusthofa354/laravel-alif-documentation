# 🛡️ CSRF Token di Laravel - Panduan Lengkap untuk Pemula

Hai muridku yang hebat! Hari ini kita akan belajar tentang **CSRF Token** di Laravel - sebuah sistem keamanan penting yang melindungi aplikasi web kamu dari serangan berbahaya. Seperti biasa, aku akan menjelaskan semuanya dengan bahasa yang mudah dan contoh kode yang bisa kamu coba sendiri.

---

## Bagian 1: Memahami Konsep Dasar CSRF 🎯

### 1. 📖 Apa Itu CSRF (Cross-Site Request Forgery)?

**Analogi Sederhana:** Bayangkan kamu adalah pemilik rekening bank dan kamu memiliki akses ke rekening tersebut. Tiba-tiba, seseorang membuat formulir palsu di website mereka yang jika kamu kunjungi dan sudah login ke bank, maka formulir tersebut akan secara otomatis mengirimkan perintah transfer uang ke rekening si penipu. **CSRF adalah seperti penipuan ini di dunia web** - seseorang memanfaatkan session kamu yang masih login untuk melakukan aksi tanpa sepengetahuan kamu.

Dalam dunia web:

- **Korban** sedang login di situs resmi (misalnya `bank.com`)
- **Penyerang** membuat situs jahat dengan form yang mengarah ke situs resmi
- Ketika korban mengunjungi situs jahat, form otomatis dikirim ke situs resmi
- Server percaya request itu datang dari user yang sah karena session masih aktif
- Aksi berbahaya terjadi tanpa sepengetahuan korban

### 2. 💡 Contoh Nyata Serangan CSRF

Mari kita lihat contoh bagaimana serangan CSRF bisa terjadi:

**Skenario:**
1. Kamu login ke aplikasi perbankan `bankku.com`
2. Session kamu aktif dan memiliki cookie autentikasi
3. Kamu mengunjungi situs jahat `penipu.com`
4. Situs jahat memiliki form tersembunyi:

```html
<!-- Situs jahat: penipu.com -->
<html>
<body>
    <h1>Hadiah Spesial untukmu!</h1>
    
    <!-- Form tersembunyi yang mengirim data ke situs bank -->
    <form action="https://bankku.com/transfer" method="POST" style="display:none;">
        <input type="hidden" name="amount" value="10000000">
        <input type="hidden" name="recipient" value="penipu123">
        <input type="submit" value="Kirim">
    </form>
    
    <script>
        // Form otomatis dikirim tanpa kamu sadari
        document.forms[0].submit();
    </script>
</body>
</html>
```

5. Karena kamu masih login di `bankku.com`, form dikirim dengan session kamu
6. Tanpa token CSRF, bank akan memproses transfer tanpa menyadari itu dari situs jahat
7. Uang kamu dipindahkan ke rekening penipu!

---

## Bagian 2: Solusi Laravel untuk CSRF Protection 🛠️

### 3. 🔐 Bagaimana Laravel Mengatasi Serangan CSRF?

Laravel menggunakan sistem **token unik** untuk melindungi dari serangan CSRF:

1. **Server membuat token unik** untuk setiap session pengguna
2. **Token disertakan** di setiap form yang mengirim data sensitif
3. **Server memverifikasi** bahwa token di request cocok dengan token di session
4. **Request ditolak** jika token tidak cocok atau tidak ada

```
User → Request → [Laravel Generate CSRF Token] → Token Disimpan di Session
Form → [Include CSRF Token] → Request Dikirim → [Laravel Verify Token] → Aman / Ditolak
```

### 4. 🏗️ Cara Laravel Mengimplementasikan CSRF

Secara otomatis, Laravel:

- Menghasilkan token CSRF unik untuk setiap session
- Menyertakan token ini di setiap response yang memungkinkan form
- Memverifikasi token pada setiap request POST, PUT, PATCH, DELETE
- Mencegah request tanpa token yang valid

---

## Bagian 3: Menggunakan CSRF Token di Form 📝

### 5. 🧩 Directive @csrf di Blade

Cara paling mudah dan aman untuk menyertakan CSRF token:

```blade
<!-- resources/views/profile.blade.php -->
<form method="POST" action="/profile">
    @csrf
    
    <div class="form-group">
        <label for="name">Nama</label>
        <input type="text" id="name" name="name" value="{{ old('name', $user->name) }}">
    </div>
    
    <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" value="{{ old('email', $user->email) }}">
    </div>
    
    <button type="submit">Update Profil</button>
</form>
```

**Apa yang dihasilkan:**
```html
<form method="POST" action="/profile">
    <input type="hidden" name="_token" value="random-token-here">
    
    <!-- Form fields -->
    <button type="submit">Update Profil</button>
</form>
```

### 6. 🔄 Alternatif Manual

Jika kamu tidak menggunakan Blade, kamu bisa menyertakan token secara manual:

```php
<form method="POST" action="/profile">
    <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
    <!-- form fields -->
</form>
```

### 7. 🌐 Menggunakan di Route Lain

Token juga bisa diakses dari berbagai tempat:

```php
// Di route
Route::get('/token', function () {
    return csrf_token();
});

// Di controller
class ProfileController extends Controller
{
    public function show()
    {
        $token = csrf_token();
        return view('profile', compact('token'));
    }
}

// Di model atau service
class TokenService
{
    public function getCsrfToken()
    {
        return csrf_token();
    }
}
```

---

## Bagian 4: CSRF Protection untuk AJAX dan API 🌐

### 8. 📡 Menggunakan CSRF Token di AJAX

Untuk aplikasi dengan AJAX, kamu bisa menyertakan token di header:

**Cara 1: Dengan meta tag**
```blade
<!-- Di head HTML -->
<meta name="csrf-token" content="{{ csrf_token() }}">

<!-- Di JavaScript -->
<script>
    // Sertakan token di setiap AJAX request
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    
    // Contoh AJAX request
    $.ajax({
        url: '/profile',
        type: 'POST',
        data: {
            name: 'John Doe',
            email: 'john@example.com'
        },
        success: function(response) {
            console.log('Profil diperbarui');
        }
    });
</script>
```

**Cara 2: Dengan fetch API**
```javascript
fetch('/profile', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    },
    body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com'
    })
})
.then(response => response.json())
.then(data => console.log('Success:', data));
```

### 9. 🔄 Menggunakan Axios

Axios bisa diatur untuk otomatis menyertakan token:

```javascript
// resources/js/app.js
import axios from 'axios';

// Set default header untuk semua request
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Atau dengan interceptor
axios.interceptors.request.use(
    config => {
        config.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        return config;
    },
    error => Promise.reject(error)
);
```

### 10. 🍪 XSRF Cookie untuk Framework Modern

Laravel secara otomatis mengirim cookie `XSRF-TOKEN` di setiap response. Framework modern seperti Angular dan Axios bisa membaca cookie ini:

```javascript
// resources/js/bootstrap.js
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Laravel akan otomatis membaca XSRF-TOKEN dari cookie
// dan menggunakannya di setiap request same-origin
```

---

## Bagian 5: Mengecualikan Route dari CSRF ✂️

### 11. 🚫 Kapan Harus Mengecualikan CSRF?

Beberapa route tidak boleh diproteksi dengan CSRF:

- **Webhook dari pihak ketiga** (Stripe, PayPal, Midtrans, dll)
- **API publik** yang diakses dari luar
- **Route yang menerima request dari domain eksternal**

### 12. 🔧 Mengecualikan di bootstrap/app.php

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->validateCsrfTokens(except: [
        'stripe/*',           // Semua route webhook Stripe
        'paypal/*',          // Semua route webhook PayPal
        'api/webhook/*',     // Webhook API
        'payment/callback',  // Callback pembayaran
        'http://example.com/callback',  // URL spesifik
    ]);
});
```

### 13. 🎯 Pattern Matching untuk Pengecualian

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->validateCsrfTokens(except: [
        'api/*',                    // Semua route API
        'webhooks/*',              // Semua webhook
        'payment/*',               // Semua route pembayaran
        'payment/callback/*',      // Pattern lebih spesifik
    ]);
});
```

### 14. 🚨 Hati-hati dengan Pengecualian CSRF

**Jangan mengecualikan CSRF secara sembarangan karena:**
- Membuat route rentan terhadap serangan CSRF
- Harus menerapkan proteksi lain (seperti signature verification)
- Harus sangat yakin bahwa route tersebut memang perlu diakses dari luar

**Contoh aman untuk webhook:**
```php
Route::post('/webhook/stripe', function (Request $request) {
    // Verifikasi signature dari Stripe
    $signature = $request->header('Stripe-Signature');
    $payload = $request->getContent();
    
    try {
        $event = \Stripe\Webhook::constructEvent(
            $payload, 
            $signature, 
            config('services.stripe.webhook_secret')
        );
        
        // Proses event
        // ...
        
        return response('Webhook handled', 200);
    } catch (\Exception $e) {
        return response('Invalid signature', 400);
    }
});
```

---

## Bagian 6: CSRF di Single Page Applications (SPA) 🖥️

### 15. 🌟 Menggunakan Laravel Sanctum untuk SPA

Untuk SPA yang menggunakan Laravel sebagai API backend, Laravel Sanctum lebih disarankan:

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 16. 🏗️ Konfigurasi Sanctum

```php
// config/sanctum.php
return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
        env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
    ))),
    
    'guard' => ['web'],
    
    'expiration' => null,
    
    'middleware' => [
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
    ],
];
```

### 17. 🔄 Frontend Integration

```javascript
// resources/js/app.js
import axios from 'axios';

// Set up CSRF for Sanctum
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';

// Get CSRF cookie first
await axios.get('/sanctum/csrf-cookie');

// Then make authenticated requests
const response = await axios.post('/api/user/profile', {
    name: 'John',
    email: 'john@example.com'
});
```

---

## Bagian 7: Custom CSRF Configuration ⚙️

### 18. 🛠️ Mengganti Middleware CSRF

Kamu bisa membuat custom CSRF middleware:

```php
<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class CustomVerifyCsrfToken extends Middleware
{
    /**
     * URI yang dikecualikan dari verifikasi CSRF.
     */
    protected $except = [
        'api/webhook/*',
        'payment/callback',
    ];
    
    /**
     * Method untuk bypass CSRF berdasarkan kondisi
     */
    protected function shouldPassThrough($request)
    {
        // Tambahkan logika kustom
        if ($request->is('special-route') && $request->header('X-Custom-Auth')) {
            return true;
        }
        
        return parent::shouldPassThrough($request);
    }
}
```

### 19. 🔑 Mengganti Nama Input Token

```php
// app/Http/Middleware/VerifyCsrfToken.php
class VerifyCsrfToken extends Middleware
{
    // Ganti nama input dari _token ke custom_token
    protected $inputKey = 'custom_token';
}
```

---

## Bagian 8: Error Handling & Debugging 🔍

### 20. 🚨 Menangani CSRF Token Mismatch

Ketika CSRF token tidak cocok, Laravel akan mengembalikan error 419:

```php
// resources/lang/en/validation.php (custom pesan error)
'csrf_token' => [
    'mismatch' => 'Security token tidak valid. Silakan refresh halaman dan coba lagi.',
],

// Di exception handler (app/Exceptions/Handler.php)
public function render($request, Throwable $exception)
{
    if ($exception instanceof TokenMismatchException) {
        return response()->json([
            'error' => 'CSRF token tidak valid',
            'message' => 'Silakan refresh halaman dan coba lagi'
        ], 419);
    }
    
    return parent::render($request, $exception);
}
```

### 21. 🐛 Debugging CSRF Issues

Beberapa masalah umum dan solusinya:

**Masalah:** Token tidak ditemukan di request
**Solusi:** Pastikan `@csrf` directive digunakan di semua form POST

**Masalah:** Token tidak cocok
**Solusi:** Pastikan tidak ada caching yang mengganggu

**Masalah:** Session expired
**Solusi:** Perpanjang waktu session atau refresh token

```php
// Di controller untuk refresh token
public function refreshToken()
{
    return response()->json([
        'token' => csrf_token()
    ]);
}
```

---

## Bagian 9: Best Practices & Tips ✅

### 22. 📋 Best Practices untuk CSRF

1. **Selalu gunakan `@csrf`** di form yang mengirim data
2. **Jangan mengecualikan CSRF tanpa alasan kuat**
3. **Gunakan Sanctum untuk SPA** bukan CSRF token biasa
4. **Jaga keamanan token** - jangan pernah mengekspos ke client yang tidak terpercaya

### 23. 🧠 Tips dan Trik Berguna

```php
// Gunakan helper untuk cek apakah request CSRF valid
if (session()->token() === $request->input('_token')) {
    // Token valid
}

// Dapatkan token untuk API
$token = csrf_token();

// Refresh token secara manual
session()->regenerateToken();

// Cek apakah route menggunakan CSRF middleware
if ($request->route()->middleware()->contains('web')) {
    // Route ini menggunakan CSRF
}
```

### 24. 🚨 Kesalahan Umum

1. **Lupa `@csrf` di form** - Ini adalah kesalahan paling umum
2. **Mengecualikan route CSRF secara sembarangan** - Membuka celah keamanan
3. **Menggunakan CSRF di API publik** - Gunakan token API atau OAuth
4. **Tidak memperbarui token di AJAX dinamis** - Gunakan interceptor

---

## Bagian 10: Implementasi Lengkap dalam Aplikasi Nyata 👨‍💻

### 25. 🏢 Contoh Lengkap: Form Profil dengan CSRF

```blade
<!-- resources/views/profile/edit.blade.php -->
@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Edit Profil</h2>
    
    @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('profile.update') }}">
        @csrf
        @method('PUT')
        
        <div class="form-group">
            <label for="name">Nama</label>
            <input type="text" 
                   class="form-control @error('name') is-invalid @enderror" 
                   id="name" 
                   name="name" 
                   value="{{ old('name', $user->name) }}">
            @error('name')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" 
                   class="form-control @error('email') is-invalid @enderror" 
                   id="email" 
                   name="email" 
                   value="{{ old('email', $user->email) }}">
            @error('email')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        
        <button type="submit" class="btn btn-primary">Update Profil</button>
        <a href="{{ route('profile.show') }}" class="btn btn-secondary">Batal</a>
    </form>
</div>
@endsection
```

```php
<?php

// app/Http/Controllers/ProfileController.php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        return view('profile.show', compact('user'));
    }
    
    public function edit()
    {
        $user = Auth::user();
        return view('profile.edit', compact('user'));
    }
    
    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . Auth::id(),
        ]);
        
        $user = Auth::user();
        $user->update($validated);
        
        return redirect()->route('profile.show')
            ->with('success', 'Profil berhasil diperbarui!');
    }
}
```

### 26. 📱 Contoh AJAX dengan CSRF Protection

```blade
<!-- resources/views/ajax-form.blade.php -->
@extends('layouts.app')

@section('head')
    <meta name="csrf-token" content="{{ csrf_token() }}">
@endsection

@section('content')
<div class="container">
    <h2>Form AJAX</h2>
    
    <form id="ajaxForm">
        @csrf
        <div class="form-group">
            <label>Nama</label>
            <input type="text" name="name" class="form-control">
        </div>
        
        <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" class="form-control">
        </div>
        
        <button type="submit" class="btn btn-primary">Simpan</button>
    </form>
    
    <div id="result"></div>
</div>

<script>
document.getElementById('ajaxForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    try {
        const response = await fetch('/api/data', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        });
        
        const result = await response.json();
        
        if (response.ok) {
            document.getElementById('result').innerHTML = '<div class="alert alert-success">Data berhasil disimpan!</div>';
            this.reset();
        } else {
            document.getElementById('result').innerHTML = '<div class="alert alert-danger">Error: ' + result.message + '</div>';
        }
    } catch (error) {
        document.getElementById('result').innerHTML = '<div class="alert alert-danger">Error jaringan</div>';
    }
});
</script>
@endsection
```

### 27. 🛡️ Security Enhancement dengan CSRF

```php
<?php

// app/Http/Middleware/EnhancedSecurity.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class EnhancedSecurity
{
    public function handle(Request $request, Closure $next): Response
    {
        // Double-check CSRF token untuk action penting
        if ($this->needsEnhancedSecurity($request)) {
            $this->validateEnhancedCsrf($request);
        }
        
        return $next($request);
    }
    
    private function needsEnhancedSecurity(Request $request): bool
    {
        // Cek apakah request mengubah data penting
        return in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE']) &&
               $this->isSensitiveRoute($request);
    }
    
    private function isSensitiveRoute(Request $request): bool
    {
        return $request->is([
            'user/delete',
            'account/close',
            'payment/*',
            'admin/*'
        ]);
    }
    
    private function validateEnhancedCsrf(Request $request): void
    {
        $sessionToken = Session::token();
        $requestToken = $request->input('_token') ?? $request->header('X-CSRF-TOKEN');
        
        if (!hash_equals($sessionToken, $requestToken)) {
            abort(419, 'Security token tidak valid');
        }
    }
}
```

---

## Bagian 11: Cheat Sheet & Referensi Cepat 📚

### 🧩 Menggunakan CSRF Token
```
@csrf                           → Direktif Blade untuk input token
csrf_token()                    → Dapatkan token secara manual
<meta name="csrf-token">        → Simpan token di meta tag
X-CSRF-TOKEN header             → Kirim token via AJAX
```

### 🚫 Mengecualikan Route
```
validateCsrfTokens(except: [])   → Kecualikan route di app.php
```

### 🌐 AJAX Integration
```
$.ajaxSetup()                  → Set token global di jQuery
axios.defaults.headers        → Set token global di Axios
fetch with headers            → Manual CSRF di fetch
```

### 🏗️ SPA dengan Sanctum
```
laravel/sanctum                → Package untuk SPA auth
stateful domains             → Konfigurasi untuk request from frontend
```

### 🔧 Custom Configuration
```
VerifyCsrfToken middleware    → Middleware dasar
Custom middleware             → Extend untuk fitur tambahan
Token regeneration          → Refresh token saat diperlukan
```

### 🚨 Error Handling
```
419 status code             → Token tidak valid
TokenMismatchException     → Exception saat token tidak cocok
Custom error responses     → Handler error kustom
```

---

## 12. 🎯 Kesimpulan

CSRF Token adalah benteng pertahanan penting dalam aplikasi web Laravel yang melindungi dari serangan Cross-Site Request Forgery. Dengan memahami konsep berikut:

- **Apa itu serangan CSRF** dan mengapa berbahaya
- **Bagaimana Laravel melindungi** dari serangan ini
- **Cara penggunaan di form, AJAX, dan API**
- **Kapan harus mengecualikan proteksi**
- **Best practices dan security considerations**

Kamu sekarang siap membuat aplikasi web yang aman dari serangan CSRF. Ingat selalu untuk menggunakan `@csrf` di form yang mengirim data sensitif dan hanya mengecualikan proteksi CSRF ketika benar-benar diperlukan dan dengan proteksi tambahan.

Selamat mengembangkan aplikasi kamu, muridku! Dengan kuasai CSRF protection, kamu sudah melangkah jauh dalam membuat aplikasi web yang aman dan terpercaya.
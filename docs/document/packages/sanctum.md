# 🔐 Laravel Sanctum

Laravel Sanctum menyediakan sistem autentikasi yang ringan untuk SPA (Single Page Applications), mobile applications, dan API tokens sederhana berdasarkan token. Sanctum memungkinkan setiap pengguna aplikasi Anda untuk menghasilkan beberapa token API untuk akun mereka.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [API Tokens](#api-tokens)
5. [Mobile Application Authentication](#mobile-application-authentication)
6. [SPA Authentication](#spa-authentication)
7. [Middleware](#middleware)
8. [Authorization](#authorization)
9. [Testing](#testing)
10. [Revoking Tokens](#revoking-tokens)
11. [Customization](#customization)

## 🎯 Pendahuluan

Laravel Sanctum adalah package autentikasi ringan yang menyediakan sistem token berbasis cookie untuk SPA dan autentikasi token API sederhana. Sanctum dirancang untuk bekerja dengan aplikasi Laravel biasa dan Laravel Jetstream.

### ✨ Fitur Utama
- Autentikasi SPA dengan Laravel
- Mobile application authentication
- API token management
- Middleware autentikasi
- Revoking tokens
- Authorization policies
- Testing helpers

### ⚠️ Catatan Penting
Sanctum tidak dimaksudkan untuk menggantikan OAuth2. Jika aplikasi Anda memerlukan server OAuth2 yang sepenuhnya kompatibel dengan OAuth2, pertimbangkan untuk menggunakan Laravel Passport.

## 📦 Instalasi

### 🎯 Menginstal Sanctum
Untuk memulai, instal Sanctum melalui Composer:

```bash
composer require laravel/sanctum
```

### 🛠️ Publish Resources
Publish file konfigurasi Sanctum menggunakan perintah vendor:

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 🔧 Run Migrations
Setelah menginstal Sanctum, Anda perlu menjalankan migrasi database:

```bash
php artisan migrate
```

### 🔄 Add Traits to User Model
Tambahkan trait `Laravel\Sanctum\HasApiTokens` ke model User Anda:

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;
}
```

## ⚙️ Konfigurasi

### 📄 File Konfigurasi
File konfigurasi utama terletak di `config/sanctum.php`. File ini memungkinkan Anda mengkonfigurasi berbagai aspek Sanctum.

### 📋 Konfigurasi Dasar
```php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Stateful Domains
    |--------------------------------------------------------------------------
    |
    | Requests from the following domains / hosts will receive stateful API
    | authentication cookies. Typically, these should include your local
    | and production domains which access your API via a frontend SPA.
    |
    */

    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
        Laravel\Sanctum\Sanctum::currentApplicationUrlWithPort()
    ))),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Guards
    |--------------------------------------------------------------------------
    |
    | This array contains the authentication guards that will be checked when
    | Sanctum is trying to authenticate a request. If none of these guards
    | are able to authenticate the request, Sanctum will use the bearer
    | token that's present on an incoming request for authentication.
    |
    */

    'guard' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes
    |--------------------------------------------------------------------------
    |
    | This value controls the number of minutes until an issued token will be
    | considered expired. If this value is null, personal access tokens do
    | not expire. This won't tweak the lifetime of first-party sessions.
    |
    */

    'expiration' => null,

    /*
    |--------------------------------------------------------------------------
    | Sanctum Middleware
    |--------------------------------------------------------------------------
    |
    | When authenticating your first-party SPA with Sanctum you may need to
    | customize some of the middleware Sanctum uses while processing the
    | request. You may change the middleware listed below as required.
    |
    */

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    ],
];
```

### 🔐 Konfigurasi Environment
Tambahkan konfigurasi berikut ke file `.env` Anda:

```env
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1
```

## 🔑 API Tokens

### 📋 Membuat API Tokens
Untuk membuat API token untuk pengguna:

```php
use App\Models\User;

$user = User::find(1);

$token = $user->createToken('token-name')->plainTextToken;
```

### 📋 Membatasi Abilities
Anda dapat menentukan abilities untuk token:

```php
$token = $user->createToken('my-token', ['server:create'])->plainTextToken;
```

### 📋 Membatasi Waktu Kadaluarsa
```php
use Illuminate\Support\Carbon;

$token = $user->createToken(
    'my-token', 
    ['server:create'], 
    Carbon::now()->addDays(5)
)->plainTextToken;
```

### 📋 Menggunakan Token dalam Request
```bash
curl -X GET http://localhost:8000/api/user \
    -H "Authorization: Bearer YOUR_TOKEN_HERE" \
    -H "Accept: application/json"
```

### 📋 Membaca Token Saat Ini
```php
use Illuminate\Http\Request;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
```

### 📋 Mengecek Abilities
```php
if ($request->user()->tokenCan('server:create')) {
    // User dapat membuat server
}
```

### 📋 Mengecek Abilities dalam Blade
```blade
@can('server:create')
    <!-- User dapat membuat server -->
@endcan
```

## 📱 Mobile Application Authentication

### 📋 Autentikasi Dasar
Untuk aplikasi mobile, Anda biasanya akan memiliki endpoint login:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

Route::post('/sanctum/token', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        'device_name' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    return $user->createToken($request->device_name)->plainTextToken;
});
```

### 📋 Menggunakan Token dalam Aplikasi Mobile
```javascript
// JavaScript (React Native, Flutter, dll)
fetch('http://localhost:8000/sanctum/token', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'password',
        device_name: 'iPhone 12',
    }),
})
.then(response => response.json())
.then(data => {
    // Simpan token untuk penggunaan selanjutnya
    localStorage.setItem('api_token', data.plainTextToken);
});
```

### 📋 Menggunakan Token dalam Request API
```javascript
const token = localStorage.getItem('api_token');

fetch('http://localhost:8000/api/user', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
    },
})
.then(response => response.json())
.then(data => {
    console.log(data);
});
```

## 🌐 SPA Authentication

### 📋 Konfigurasi SPA Domains
Pastikan domain SPA Anda dikonfigurasi dalam file `.env`:

```env
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,your-spa-domain.com
```

### 📋 Endpoint CSRF Cookie
SPA Anda perlu mengambil CSRF cookie:

```javascript
// Frontend
fetch('/sanctum/csrf-cookie')
    .then(response => response.ok ? response : Promise.reject(response))
    .then(() => {
        // Anda sekarang dapat membuat request autentikasi
        return fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                email: 'user@example.com',
                password: 'password',
            }),
            credentials: 'include', // Penting untuk cookies
        });
    });
```

### 📋 Login Endpoint
Endpoint login untuk SPA:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (! Auth::attempt($request->only('email', 'password'))) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    return response()->json([
        'user' => Auth::user(),
        'message' => 'Login successful',
    ]);
});
```

### 📋 Logout Endpoint
```php
use Illuminate\Http\Request;

Route::post('/logout', function (Request $request) {
    Auth::guard('web')->logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json(['message' => 'Logged out successfully']);
})->middleware('auth:sanctum');
```

### 📋 Menggunakan Sanctum dengan Axios
```javascript
import axios from 'axios';

// Konfigurasi base URL dan credentials
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

// Mendapatkan CSRF cookie
await axios.get('/sanctum/csrf-cookie');

// Login
const loginResponse = await axios.post('/login', {
    email: 'user@example.com',
    password: 'password',
});

console.log('Login successful:', loginResponse.data);

// Mengakses endpoint yang dilindungi
const userResponse = await axios.get('/api/user');
console.log('User data:', userResponse.data);

// Logout
await axios.post('/logout');
```

## 🔐 Middleware

### 📋 Middleware Sanctum
Sanctum menyediakan middleware `auth:sanctum` untuk melindungi route:

```php
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
```

### 📋 Middleware untuk SPA dan API
Anda dapat menggunakan middleware yang berbeda untuk SPA dan API:

```php
// Untuk SPA (menggunakan session)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/spa/profile', [ProfileController::class, 'show']);
    Route::put('/spa/profile', [ProfileController::class, 'update']);
});

// Untuk API (menggunakan token)
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('/api/posts', PostController::class);
});
```

### 📋 Custom Middleware
Anda dapat membuat middleware kustom untuk kebutuhan spesifik:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureTokenHasAbility
{
    public function handle(Request $request, Closure $next, ...$abilities)
    {
        foreach ($abilities as $ability) {
            if (! $request->user()->tokenCan($ability)) {
                abort(403, 'Unauthorized action.');
            }
        }

        return $next($request);
    }
}
```

Mendaftarkan middleware dalam `app/Http/Kernel.php`:

```php
protected $routeMiddleware = [
    // Middleware lainnya...
    'token.can' => \App\Http\Middleware\EnsureTokenHasAbility::class,
];
```

Menggunakan middleware:

```php
Route::middleware(['auth:sanctum', 'token.can:server:create'])->post('/servers', function () {
    // Hanya token dengan ability 'server:create' yang dapat mengakses
});
```

## 🔐 Authorization

### 📋 Policies
Sanctum bekerja dengan Laravel Authorization Policies:

```bash
php artisan make:policy PostPolicy --model=Post
```

```php
<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Post $post)
    {
        return $user->id === $post->user_id;
    }

    public function update(User $user, Post $post)
    {
        return $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post)
    {
        return $user->id === $post->user_id;
    }
}
```

### 📋 Menggunakan Policies dalam Controller
```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function show(Post $post)
    {
        $this->authorize('view', $post);

        return $post;
    }

    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $post->update($request->all());

        return $post;
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return response()->json(['message' => 'Post deleted']);
    }
}
```

### 📋 Menggunakan Policies dalam Blade
```blade
@can('update', $post)
    <a href="/posts/{{ $post->id }}/edit">Edit Post</a>
@endcan

@can('delete', $post)
    <form method="POST" action="/posts/{{ $post->id }}">
        @method('DELETE')
        @csrf
        <button type="submit">Delete Post</button>
    </form>
@endcan
```

### 📋 Gates
Sanctum juga bekerja dengan Gates:

```php
use Illuminate\Support\Facades\Gate;

Gate::define('update-post', function (User $user, Post $post) {
    return $user->id === $post->user_id;
});
```

## 🧪 Testing

### 📋 Testing dengan PHPUnit
Anda dapat menguji endpoint Sanctum menggunakan PHPUnit:

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApiTokenTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_access_protected_endpoint_with_token()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->get('/api/user');

        $response->assertStatus(200);
    }

    public function test_user_cannot_access_protected_endpoint_without_token()
    {
        $response = $this->get('/api/user');

        $response->assertStatus(401);
    }
}
```

### 📋 Testing dengan Sanctum Helper
Sanctum menyediakan helper untuk testing:

```php
use Laravel\Sanctum\Sanctum;

public function test_user_can_access_protected_endpoint()
{
    $user = User::factory()->create();
    
    Sanctum::actingAs($user, ['*']); // '*' untuk semua abilities

    $response = $this->get('/api/user');

    $response->assertStatus(200);
}
```

### 📋 Testing dengan Abilities Spesifik
```php
public function test_user_can_only_perform_authorized_actions()
{
    $user = User::factory()->create();
    
    Sanctum::actingAs($user, ['view-posts']);

    // Ini akan berhasil
    $response = $this->get('/api/posts');
    $response->assertStatus(200);

    // Ini akan gagal (403) karena user tidak memiliki ability 'create-posts'
    $response = $this->post('/api/posts', ['title' => 'New Post']);
    $response->assertStatus(403);
}
```

### 📋 Testing SPA Authentication
```php
public function test_spa_authentication()
{
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    // Simulasi permintaan SPA
    $response = $this->withSession(['_token' => csrf_token()])
                     ->withHeader('X-Requested-With', 'XMLHttpRequest')
                     ->post('/login', [
                         'email' => 'test@example.com',
                         'password' => 'password',
                     ]);

    $response->assertStatus(200);
    
    // Test akses ke endpoint yang dilindungi
    $response = $this->get('/api/user');
    $response->assertStatus(200);
}
```

## 🚫 Revoking Tokens

### 📋 Mencabut Token Tertentu
Untuk mencabut token tertentu:

```php
$user->tokens()->where('id', $tokenId)->delete();
```

### 📋 Mencabut Semua Token Pengguna
```php
$user->tokens()->delete();
```

### 📋 Mencabut Token Berdasarkan Nama
```php
$user->tokens()->where('name', 'mobile-app')->delete();
```

### 📋 Endpoint untuk Mencabut Token
```php
use Illuminate\Http\Request;

Route::delete('/user/tokens/{token}', function (Request $request, $tokenId) {
    $request->user()->tokens()->where('id', $tokenId)->delete();

    return response()->json(['message' => 'Token revoked']);
})->middleware('auth:sanctum');
```

### 📋 Mencabut Token Saat Logout
```php
Route::post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();

    Auth::guard('web')->logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json(['message' => 'Logged out successfully']);
})->middleware('auth:sanctum');
```

### 📋 Mencabut Token Berdasarkan Ability
```php
Route::delete('/user/tokens', function (Request $request) {
    $request->user()->tokens()
        ->where('can', 'like', '%server:create%')
        ->delete();

    return response()->json(['message' => 'Tokens with server:create ability revoked']);
})->middleware('auth:sanctum');
```

## 🎨 Customization

### 📋 Custom Token Model
Anda dapat menggunakan model token kustom:

```php
<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    // Tambahkan custom logic di sini
}
```

Daftarkan model kustom dalam `AppServiceProvider`:

```php
use App\Models\PersonalAccessToken;
use Laravel\Sanctum\Sanctum;

public function boot()
{
    Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
}
```

### 📋 Custom User Provider
Anda dapat menggunakan provider pengguna kustom:

```php
use App\Models\User;
use Laravel\Sanctum\Sanctum;

public function boot()
{
    Sanctum::useUserModel(User::class);
}
```

### 📋 Custom Guard
Anda dapat menggunakan guard kustom:

```php
use Laravel\Sanctum\Sanctum;

public function boot()
{
    Sanctum::useGuard('admin');
}
```

### 📋 Event Listeners
Sanctum memicu event selama proses autentikasi:

```php
// Dalam EventServiceProvider
use Laravel\Sanctum\Events\TokenAuthenticated;

protected $listen = [
    TokenAuthenticated::class => [
        // Listeners Anda
    ],
];
```

### 📋 Custom Middleware
Anda dapat membuat middleware kustom untuk Sanctum:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\TransientToken;

class CustomSanctumMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Custom logic sebelum autentikasi Sanctum
        
        $response = $next($request);
        
        // Custom logic setelah autentikasi Sanctum
        
        return $response;
    }
}
```

## 🧠 Kesimpulan

Laravel Sanctum menyediakan sistem autentikasi yang ringan dan fleksibel untuk SPA, mobile applications, dan API tokens sederhana. Dengan Sanctum, Anda dapat dengan mudah mengautentikasi pengguna dan mengelola token API mereka.

### 🔑 Keuntungan Utama
- Autentikasi SPA dengan Laravel
- Mobile application authentication
- API token management
- Middleware autentikasi
- Revoking tokens
- Authorization policies
- Testing helpers

### 🚀 Best Practices
1. Gunakan Sanctum untuk SPA dan mobile apps
2. Terapkan rate limiting pada endpoint token
3. Gunakan HTTPS untuk semua endpoint autentikasi
4. Simpan token dengan aman di client-side
5. Cabut token yang tidak digunakan
6. Gunakan abilities untuk kontrol akses yang tepat
7. Terapkan CSRF protection untuk SPA
8. Uji implementasi autentikasi secara menyeluruh
9. Gunakan expiring tokens untuk keamanan tambahan
10. Monitor penggunaan token secara berkala

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Sanctum untuk mengimplementasikan sistem autentikasi yang aman dan efektif dalam aplikasi Laravel Anda.
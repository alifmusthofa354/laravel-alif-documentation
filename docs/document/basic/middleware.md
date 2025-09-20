# Middleware di Laravel

Middleware menyediakan mekanisme yang nyaman untuk memeriksa dan memfilter HTTP request yang masuk ke aplikasi Anda. Misalnya, Laravel sudah menyertakan middleware yang memverifikasi apakah pengguna telah terautentikasi. Jika belum, middleware akan mengarahkan pengguna ke halaman login; jika sudah, request akan diteruskan lebih jauh ke dalam aplikasi.

Selain autentikasi, middleware dapat digunakan untuk berbagai keperluan, misalnya mencatat log request atau melakukan validasi tambahan. Semua middleware yang ditulis sendiri biasanya berada di direktori `app/Http/Middleware`.

---

## 1. Membuat Middleware Baru

Untuk membuat middleware, gunakan perintah Artisan berikut:

```bash
php artisan make:middleware EnsureTokenIsValid
```

Middleware ini akan ditempatkan di folder `app/Http/Middleware`. Contoh implementasi:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenIsValid
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->input('token') !== 'my-secret-token') {
            return redirect('/home');
        }

        return $next($request);
    }
}
```

Jika token salah, middleware mengembalikan redirect ke `/home`. Jika benar, request diteruskan.

---

## 2. Middleware dan Response

Middleware dapat berjalan **sebelum** atau **sesudah** request diproses oleh aplikasi:

### Middleware Sebelum Request
```php
class BeforeMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Aksi sebelum request diproses
        return $next($request);
    }
}
```

### Middleware Sesudah Request
```php
class AfterMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        // Aksi setelah response dihasilkan
        return $response;
    }
}
```

---

## 3. Registrasi Middleware

### a. Global Middleware
Tambahkan ke `bootstrap/app.php` agar selalu dijalankan:

```php
use App\Http\Middleware\EnsureTokenIsValid;

->withMiddleware(function (Middleware $middleware): void {
     $middleware->append(EnsureTokenIsValid::class);
})
```

- `append`: menambahkan di akhir stack.
- `prepend`: menambahkan di awal stack.

### b. Manually Managing Global Middleware
Jika ingin mengatur ulang daftar middleware global:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->use([
        \Illuminate\Foundation\Http\Middleware\InvokeDeferredCallbacks::class,
        \Illuminate\Http\Middleware\TrustProxies::class,
        \Illuminate\Http\Middleware\HandleCors::class,
        \Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance::class,
        \Illuminate\Http\Middleware\ValidatePostSize::class,
        \Illuminate\Foundation\Http\Middleware\TrimStrings::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    ]);
})
```

---

## 4. Menetapkan Middleware ke Route

```php
use App\Http\Middleware\EnsureTokenIsValid;

Route::get('/profile', function () {
    // ...
})->middleware(EnsureTokenIsValid::class);
```

Untuk banyak middleware:
```php
Route::get('/', function () {
    // ...
})->middleware([First::class, Second::class]);
```

### Mengecualikan Middleware
```php
Route::middleware([EnsureTokenIsValid::class])->group(function () {
    Route::get('/', fn () => 'Halaman utama');
    Route::get('/profile', fn () => 'Profil')->withoutMiddleware([EnsureTokenIsValid::class]);
});
```

---

## 5. Middleware Groups

Middleware dapat digabungkan dalam grup agar lebih mudah dikelola.

```php
use App\Http\Middleware\First;
use App\Http\Middleware\Second;

->withMiddleware(function (Middleware $middleware): void {
    $middleware->appendToGroup('group-name', [First::class, Second::class]);
    $middleware->prependToGroup('group-name', [First::class, Second::class]);
})
```

Penggunaan:
```php
Route::middleware(['group-name'])->group(function () {
    // routes di sini
});
```

### Laravel Default Middleware Groups

- **web**: session, cookie, CSRF protection, dll.
- **api**: throttle, bindings.

### Customisasi Middleware Group

Tambahkan middleware ke grup default:
```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->web(append: [EnsureUserIsSubscribed::class]);
    $middleware->api(prepend: [EnsureTokenIsValid::class]);
})
```

Ganti middleware default dengan custom:
```php
$middleware->web(replace: [
    \Illuminate\Session\Middleware\StartSession::class => \App\Http\Middleware\StartCustomSession::class,
]);
```

Hapus middleware:
```php
$middleware->web(remove: [\Illuminate\Session\Middleware\StartSession::class]);
```

### Manually Managing Middleware Groups
```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->group('web', [
        \Illuminate\Cookie\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ]);

    $middleware->group('api', [
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ]);
})
```

---

## 6. Middleware Aliases

Agar lebih singkat, middleware bisa diberi alias:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->alias([
        'subscribed' => \App\Http\Middleware\EnsureUserIsSubscribed::class,
    ]);
})
```

Penggunaan:
```php
Route::get('/profile', fn () => 'Profil')->middleware('subscribed');
```

### Alias Bawaan Laravel
| Alias              | Middleware                                                                 |
|--------------------|----------------------------------------------------------------------------|
| auth               | Illuminate\Auth\Middleware\Authenticate                                    |
| auth.basic         | Illuminate\Auth\Middleware\AuthenticateWithBasicAuth                      |
| auth.session       | Illuminate\Session\Middleware\AuthenticateSession                         |
| cache.headers      | Illuminate\Http\Middleware\SetCacheHeaders                                |
| can                | Illuminate\Auth\Middleware\Authorize                                       |
| guest              | Illuminate\Auth\Middleware\RedirectIfAuthenticated                        |
| password.confirm   | Illuminate\Auth\Middleware\RequirePassword                                |
| precognitive       | Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests          |
| signed             | Illuminate\Routing\Middleware\ValidateSignature                           |
| subscribed         | \Spark\Http\Middleware\VerifyBillableIsSubscribed                         |
| throttle           | Illuminate\Routing\Middleware\ThrottleRequests / ThrottleRequestsWithRedis|
| verified           | Illuminate\Auth\Middleware\EnsureEmailIsVerified                          |

---

## 7. Urutan Eksekusi Middleware (Priority)

Kadang urutan eksekusi middleware penting. Atur dengan:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->priority([
        \Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests::class,
        \Illuminate\Cookie\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        \Illuminate\Routing\Middleware\ThrottleRequests::class,
        \Illuminate\Routing\Middleware\ThrottleRequestsWithRedis::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
        \Illuminate\Contracts\Auth\Middleware\AuthenticatesRequests::class,
        \Illuminate\Auth\Middleware\Authorize::class,
    ]);
})
```

---

## 8. Middleware dengan Parameter

Middleware bisa menerima parameter tambahan:

```php
class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (! $request->user()->hasRole($role)) {
            return redirect('/');
        }
        return $next($request);
    }
}
```

Penggunaan di route:
```php
Route::put('/post/{id}', fn ($id) => 'update')
    ->middleware(EnsureUserHasRole::class.':editor,publisher');
```

---

## 9. Terminable Middleware

Middleware dapat memiliki metode `terminate` yang dijalankan setelah response dikirim ke browser:

```php
class TerminatingMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        // tugas setelah response terkirim
    }
}
```

Agar Laravel menggunakan instance yang sama untuk `handle` dan `terminate`, daftarkan sebagai singleton di `AppServiceProvider`:

```php
public function register(): void
{
    $this->app->singleton(\App\Http\Middleware\TerminatingMiddleware::class);
}
```

---

## 10. 🚀 Implementasi Middleware pada Project Sederhana

Misalnya kita punya aplikasi sederhana dengan fitur:

* Halaman **home** bisa diakses semua orang.
* Halaman **dashboard** hanya bisa diakses user yang login.
* Halaman **admin** hanya bisa diakses user yang punya role `admin`.

---

### 1. Gunakan Middleware Bawaan Laravel

Laravel sudah menyediakan beberapa middleware seperti `auth` dan `verified`.

#### Routing dengan middleware `auth`

```php
// routes/web.php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome'); // semua orang bisa akses
});

Route::get('/dashboard', function () {
    return view('dashboard'); // hanya bisa diakses kalau sudah login
})->middleware('auth');
```

👉 Di sini kita gunakan **middleware bawaan `auth`**. Jika user belum login, otomatis diarahkan ke halaman login.

---

### 2. Buat Middleware Custom

Sekarang kita buat middleware custom untuk memeriksa role user.

#### Membuat middleware

```bash
php artisan make:middleware EnsureUserIsAdmin
```

#### Implementasi middleware

```php
// app/Http/Middleware/EnsureUserIsAdmin.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || $request->user()->role !== 'admin') {
            return redirect('/dashboard')->with('error', 'Akses ditolak: Admin saja.');
        }

        return $next($request);
    }
}
```

---

### 3. Registrasi Middleware Custom

Tambahkan alias untuk middleware ini di `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
    ]);
})
```

---

### 4. Gunakan Middleware di Route

Sekarang middleware custom bisa dipakai di route:

```php
// routes/web.php

Route::get('/admin', function () {
    return "Selamat datang, Admin!";
})->middleware(['auth', 'admin']);
```

👉 Penjelasan:

* `auth` memastikan user sudah login.
* `admin` memastikan user punya role admin.

---

### 5. Contoh Middleware Logging (Tambahan)

Misalkan kita ingin log setiap request masuk:

```bash
php artisan make:middleware LogRequest
```

```php
// app/Http/Middleware/LogRequest.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        Log::info('Request masuk:', [
            'url' => $request->fullUrl(),
            'ip'  => $request->ip(),
        ]);

        return $next($request);
    }
}
```

Registrasi di `bootstrap/app.php` sebagai global middleware:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->append(\App\Http\Middleware\LogRequest::class);
})
```

👉 Sekarang setiap request akan otomatis dicatat di `storage/logs/laravel.log`.

---


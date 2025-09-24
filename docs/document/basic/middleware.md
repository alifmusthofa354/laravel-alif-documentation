# 🛡️ Middleware di Laravel - Panduan Lengkap untuk Pemula

Hai muridku yang hebat! Hari ini kita akan belajar tentang **Middleware** di Laravel - sebuah sistem yang sangat penting untuk mengamankan dan mengelola request yang masuk ke aplikasi kamu. Sama seperti sebelumnya, aku akan menjelaskan semuanya dengan bahasa yang mudah dan contoh kode yang bisa kamu coba sendiri.

---

## Bagian 1: Memahami Konsep Dasar Middleware 🎯

### 1. 📖 Apa Itu Middleware?

**Analogi Sederhana:** Bayangkan kamu memiliki sebuah gedung perkantoran dengan pos penjagaan di depan. Setiap orang yang ingin masuk ke gedung harus melewati penjagaan dan diverifikasi dulu. **Middleware adalah seperti penjaga keamanan** di aplikasi web kamu - mereka memeriksa setiap request sebelum masuk ke aplikasi.

Dalam dunia web:

- **HTTP Request** masuk ke aplikasi kamu
- **Middleware** mengecek dan memfilter request tersebut
- **Aplikasi** (controller, dll) hanya menerima request yang sudah lolos verifikasi
- **HTTP Response** dikembalikan ke client

**Fungsi Umum Middleware:**
- Otentikasi pengguna (apakah sudah login?)
- Autorisasi (apakah berhak mengakses fitur tertentu?)
- Validasi request
- Logging request
- Rate limiting
- CSRF protection

### 2. 💡 Prinsip Kerja Middleware

Middleware bekerja seperti **pipa atau terowongan** - request masuk dari satu ujung, melewati beberapa pengecekan, dan keluar dari ujung lainnya. Kalau ada middleware yang tidak lolos, request akan ditolak dan tidak sampai ke aplikasi.

```
Request → [Middleware 1] → [Middleware 2] → [Controller] → Response
         (cek login)      (cek role)       (proses data)    (hasil)
```

---

## Bagian 2: Membuat Middleware Baru 🔧

### 3. 🛠️ Membuat Middleware dengan Artisan

Untuk membuat middleware baru, gunakan perintah artisan:

```bash
php artisan make:middleware EnsureTokenIsValid
```

Perintah ini akan membuat file di `app/Http/Middleware/EnsureTokenIsValid.php`.

### 4. 🏗️ Struktur Dasar Middleware

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenIsValid
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Tambahkan logika pengecekan di sini
        if ($request->input('token') !== 'my-secret-token') {
            // Jika pengecekan gagal, kembalikan response
            return redirect('/home')->with('error', 'Token tidak valid');
        }

        // Jika pengecekan lolos, lanjutkan ke middleware berikutnya
        return $next($request);
    }
}
```

---

## Bagian 3: Jenis-jenis Middleware dan Implementasinya 🧩

### 5. 🔄 Middleware Sebelum Request (Before Request)

Middleware jenis ini menjalankan logika **sebelum** request diproses oleh aplikasi:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BeforeMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Lakukan pengecekan sebelum request diproses
        \Log::info('Request masuk: ' . $request->path());
        
        // Lanjutkan ke middleware berikutnya
        return $next($request);
    }
}
```

### 6. ⏳ Middleware Sesudah Request (After Request)

Middleware jenis ini menjalankan logika **setelah** response dihasilkan:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AfterMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Proses request dulu
        $response = $next($request);
        
        // Lakukan pengecekan setelah response dihasilkan
        \Log::info('Response dikirim: ' . $response->getStatusCode());
        
        return $response;
    }
}
```

### 7. 🛂 Contoh Middleware Otentikasi

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect('/login')->with('error', 'Silakan login terlebih dahulu');
        }

        if (!Auth::user()->isVerified()) {
            return redirect('/email/verify')->with('info', 'Silakan verifikasi email Anda');
        }

        return $next($request);
    }
}
```

### 8. 🏢 Contoh Middleware Autorisasi

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!Auth::check()) {
            return redirect('/login');
        }

        if (Auth::user()->role !== $role) {
            abort(403, 'Anda tidak memiliki izin untuk mengakses halaman ini');
        }

        return $next($request);
    }
}
```

### 9. 📊 Contoh Middleware Logging

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        
        Log::info('Request Masuk', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => auth()->id() ?? null,
        ]);

        $response = $next($request);

        $endTime = microtime(true);
        $executionTime = ($endTime - $startTime) * 1000; // dalam milidetik

        Log::info('Request Selesai', [
            'url' => $request->fullUrl(),
            'status_code' => $response->getStatusCode(),
            'execution_time' => round($executionTime, 2) . 'ms',
        ]);

        return $response;
    }
}
```

---

## Bagian 4: Registrasi Middleware 🔧

### 10. 🌐 Global Middleware

Global middleware dijalankan untuk **setiap request**. Tambahkan di `bootstrap/app.php`:

```php
use App\Http\Middleware\CheckMaintenanceMode;
use App\Http\Middleware\LogRequest;

->withMiddleware(function (Middleware $middleware): void {
    // Tambahkan di akhir stack
    $middleware->append(LogRequest::class);
    
    // Tambahkan di awal stack
    $middleware->prepend(CheckMaintenanceMode::class);
});
```

### 11. 📋 Manual Management Global Middleware

Jika ingin mengatur semua global middleware secara manual:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->use([
        \Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \App\Http\Middleware\TrimStrings::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
        \App\Http\Middleware\LogRequest::class, // tambahkan custom middleware
    ]);
});
```

---

## Bagian 5: Menetapkan Middleware ke Route 🛣️

### 12. 🏷️ Menetapkan Middleware ke Route Tertentu

```php
use App\Http\Middleware\EnsureTokenIsValid;

// Middleware untuk satu route
Route::get('/profile', function () {
    return view('profile');
})->middleware(EnsureTokenIsValid::class);

// Banyak middleware untuk satu route
Route::get('/admin', function () {
    return view('admin.dashboard');
})->middleware(['auth', 'admin', 'verified']);

// Middleware untuk grup route
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/settings', [SettingsController::class, 'index']);
});
```

### 13. 🚫 Mengecualikan Middleware

```php
// Mengecualikan middleware tertentu dari grup
Route::middleware(['auth', 'throttle'])->group(function () {
    Route::get('/profile', [UserController::class, 'show']);
    Route::get('/home', [HomeController::class, 'index'])->withoutMiddleware(['auth']);
});

// Mengecualikan dari route individual
Route::get('/public', [PublicController::class, 'index'])->withoutMiddleware(['auth']);
```

---

## Bagian 6: Middleware Groups 📦

### 14. 🏗️ Membuat dan Menggunakan Middleware Groups

Middleware groups membantu mengelola middleware secara logis:

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware): void {
    // Buat grup middleware baru
    $middleware->group('admin', [
        \App\Http\Middleware\Authenticate::class,
        \App\Http\Middleware\EnsureAdmin::class,
        \App\Http\Middleware\VerifyCsrfToken::class,
    ]);
    
    // Tambahkan ke grup yang sudah ada
    $middleware->web(append: [
        \App\Http\Middleware\CheckUserSubscription::class,
    ]);
    
    $middleware->api(prepend: [
        \App\Http\Middleware\ThrottleApiRequests::class,
    ]);
});
```

### 15. 🏠 Default Middleware Groups di Laravel

Laravel menyediakan dua grup middleware utama:

**Web Group (untuk aplikasi web biasa):**
```php
[
    \Illuminate\Cookie\Middleware\EncryptCookies::class,
    \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    \Illuminate\Session\Middleware\StartSession::class,
    \Illuminate\View\Middleware\ShareErrorsFromSession::class,
    \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
]
```

**API Group (untuk API):**
```php
[
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
    \Illuminate\Routing\Middleware\ThrottleRequests::class . ':api',
]
```

### 16. 🛠️ Customisasi Middleware Groups

```php
->withMiddleware(function (Middleware $middleware): void {
    // Ganti middleware tertentu di grup web
    $middleware->web(replace: [
        \Illuminate\Session\Middleware\StartSession::class => \App\Http\Middleware\CustomStartSession::class,
    ]);
    
    // Hapus middleware dari grup web
    $middleware->web(remove: [
        \Illuminate\Session\Middleware\StartSession::class,
    ]);
    
    // Atur grup secara keseluruhan
    $middleware->group('custom', [
        \Illuminate\Session\Middleware\StartSession::class,
        \App\Http\Middleware\CustomAuth::class,
        \App\Http\Middleware\CustomCsrf::class,
    ]);
});
```

---

## Bagian 7: Middleware Aliases 🏷️

### 17. 🏗️ Membuat Alias untuk Middleware

Agar lebih mudah digunakan, buat alias untuk middleware:

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->alias([
        'auth' => \App\Http\Middleware\Authenticate::class,
        'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
        'subscribed' => \App\Http\Middleware\EnsureUserIsSubscribed::class,
        'api.throttle' => \App\Http\Middleware\ApiThrottleRequests::class,
    ]);
});
```

### 18. 📖 Alias Bawaan Laravel

| Alias | Middleware |
|-------|------------|
| `auth` | Illuminate\Auth\Middleware\Authenticate |
| `auth.basic` | Illuminate\Auth\Middleware\AuthenticateWithBasicAuth |
| `auth.session` | Illuminate\Session\Middleware\AuthenticateSession |
| `cache.headers` | Illuminate\Http\Middleware\SetCacheHeaders |
| `can` | Illuminate\Auth\Middleware\Authorize |
| `guest` | Illuminate\Auth\Middleware\RedirectIfAuthenticated |
| `password.confirm` | Illuminate\Auth\Middleware\RequirePassword |
| `signed` | Illuminate\Routing\Middleware\ValidateSignature |
| `throttle` | Illuminate\Routing\Middleware\ThrottleRequests |
| `verified` | Illuminate\Auth\Middleware\EnsureEmailIsVerified |

---

## Bagian 8: Parameter dalam Middleware 🎛️

### 19. 🧪 Middleware dengan Parameter

Kamu bisa mengirimkan parameter ke middleware:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!Auth::check()) {
            return redirect('/login');
        }

        if (!Auth::user()->hasPermission($permission)) {
            abort(403, "Anda tidak memiliki izin: {$permission}");
        }

        return $next($request);
    }
}
```

**Penggunaan di route:**
```php
Route::get('/posts/create', [PostController::class, 'create'])
    ->middleware('auth:permission:create-posts');

Route::get('/users/{user}', [UserController::class, 'show'])
    ->middleware('auth:permission:view-users');

Route::put('/users/{user}', [UserController::class, 'update'])
    ->middleware('auth:permission:edit-users');
```

### 20. 🧠 Multiple Parameters

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRoleOrPermission
{
    public function handle(Request $request, Closure $next, string $role, string $permission): Response
    {
        if (!Auth::check()) {
            return redirect('/login');
        }

        $user = Auth::user();
        
        if (!$user->hasRole($role) && !$user->hasPermission($permission)) {
            abort(403, "Anda perlu memiliki role '{$role}' atau permission '{$permission}'");
        }

        return $next($request);
    }
}
```

**Penggunaan:**
```php
Route::get('/admin', [AdminController::class, 'index'])
    ->middleware('role-or-permission:admin,manage-users');
```

---

## Bagian 9: Priority dan Urutan Middleware 🔄

### 21. 🔢 Mengatur Prioritas Middleware

Urutan middleware sangat penting untuk kinerja dan fungsi aplikasi:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->priority([
        \Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests::class,
        \Illuminate\Cookie\Middleware\EncryptCookies::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
        \Illuminate\Routing\Middleware\ThrottleRequests::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
        \Illuminate\Auth\Middleware\Authenticate::class,
    ]);
});
```

### 22. 🧠 Best Practices Urutan Middleware

- **EncryptCookies** harus di awal (sebelum session)
- **StartSession** sebelum **ShareErrorsFromSession** (error dari session)
- **ValidateCsrfToken** sebelum **Authenticate** (untuk mencegah pengeluaran session yang tidak perlu)
- **SubstituteBindings** setelah otentikasi (karena bisa memerlukan user)

---

## Bagian 10: Terminable Middleware 📞

### 23. 🔄 Middleware dengan Metode Terminate

Beberapa middleware perlu melakukan tugas setelah response dikirim ke browser:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TerminatingMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        // Lakukan tugas setelah response dikirim
        // Misalnya: mengirim notifikasi, logging, cleanup, dll.
        \Log::info('Request selesai diproses', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'status' => $response->getStatusCode(),
        ]);
    }
}
```

**Agar instance yang sama digunakan:**
```php
// app/Providers/AppServiceProvider.php
public function register(): void
{
    $this->app->singleton(\App\Http\Middleware\TerminatingMiddleware::class);
}
```

---

## Bagian 11: Implementasi Middleware dalam Aplikasi Nyata 👨‍💻

### 24. 🏢 Contoh Lengkap: Aplikasi Multi-role

Mari kita buat implementasi middleware dalam aplikasi dengan tiga role: Admin, Editor, dan Viewer.

```php
<?php

// app/Http/Middleware/EnsureUserIsAdmin.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect('/login')->with('error', 'Silakan login terlebih dahulu');
        }

        if (Auth::user()->role !== 'admin') {
            abort(403, 'Akses ditolak: Hanya untuk admin');
        }

        return $next($request);
    }
}
```

```php
<?php

// app/Http/Middleware/EnsureUserIsEditor.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsEditor
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect('/login');
        }

        $user = Auth::user();
        if (!in_array($user->role, ['admin', 'editor'])) {
            abort(403, 'Akses ditolak: Hanya untuk editor');
        }

        return $next($request);
    }
}
```

**Registrasi di bootstrap/app.php:**
```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->alias([
        'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
        'editor' => \App\Http\Middleware\EnsureUserIsEditor::class,
        'viewer' => \App\Http\Middleware\EnsureUserIsViewer::class,
    ]);
});
```

**Penggunaan di routes:**
```php
// routes/web.php
use App\Http\Controllers;

// Publik
Route::get('/', [HomeController::class, 'index']);

// Proteksi dengan auth
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/profile', [ProfileController::class, 'show']);
});

// Hanya untuk editor
Route::middleware(['auth', 'editor'])->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/create', [PostController::class, 'create']);
    Route::post('/posts', [PostController::class, 'store']);
});

// Hanya untuk admin
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::get('/admin/settings', [AdminController::class, 'settings']);
});
```

### 25. 🛡️ Contoh: Rate Limiting Middleware

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Symfony\Component\HttpFoundation\Response;

class RateLimitMiddleware
{
    public function handle(Request $request, Closure $next, int $maxAttempts = 60, int $decayMinutes = 1): Response
    {
        $key = 'rate_limit_' . $request->ip();
        $attempts = Redis::get($key) ?: 0;
        
        if ($attempts >= $maxAttempts) {
            return response()->json([
                'error' => 'Too many requests',
                'retry_after' => $decayMinutes * 60
            ], 429);
        }
        
        $response = $next($request);
        
        // Tambah hitungan request
        if (Redis::get($key) === null) {
            Redis::setex($key, $decayMinutes * 60, 1);
        } else {
            Redis::incr($key);
        }
        
        return $response;
    }
}
```

### 26. 📈 Contoh: Performance Monitoring Middleware

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class PerformanceMonitor
{
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = hrtime(true); // waktu dalam nanoseconds
        
        $response = $next($request);
        
        $endTime = hrtime(true);
        $executionTime = ($endTime - $startTime) / 1000000; // konversi ke milliseconds
        
        // Log jika eksekusi lebih dari 1000ms
        if ($executionTime > 1000) {
            Log::warning('Slow Request Detected', [
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'execution_time_ms' => round($executionTime, 2),
                'user_id' => auth()->id(),
            ]);
        }
        
        return $response;
    }
}
```

---

## Bagian 12: Best Practices & Tips ✅

### 27. 📋 Best Practices untuk Middleware

1. **Gunakan middleware dengan bijak:**
   - Jangan menempatkan logika berat di middleware
   - Middleware seharusnya hanya untuk filtering dan preprocessing

2. **Buat middleware yang bisa digunakan ulang:**
   - Gunakan parameter untuk membuat middleware lebih fleksibel
   - Ikuti prinsip single responsibility

3. **Gunakan priority dengan benar:**
   - Urutan middleware penting untuk kinerja dan fungsi

4. **Logging yang bijak:**
   - Jangan log request yang berisi data sensitif
   - Gunakan sanitasi jika perlu

### 28. 💡 Tips dan Trik Berguna

```php
// Gunakan when() untuk conditional middleware
Route::get('/api/data', [DataController::class, 'index'])
    ->middleware(['auth', 'api.throttle'])
    ->when(app()->environment('production'), fn ($route) => $route->middleware('log.requests'));

// Gunakan middleware grup untuk organisasi
Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/settings', [SettingsController::class, 'index']);
});

// Gunakan terminate untuk cleanup
class SessionCleanupMiddleware
{
    public function handle($request, $next)
    {
        return $next($request);
    }
    
    public function terminate($request, $response)
    {
        // Lakukan cleanup atau logging setelah response dikirim
        if ($request->session()->has('temp_data')) {
            $request->session()->forget('temp_data');
        }
    }
}
```

### 29. 🚨 Kesalahan Umum

1. **Lupa return $next($request)** - Ini akan membuat request tidak sampai ke controller
2. **Menempatkan logika berat di handle()** - Ini akan memperlambat semua request
3. **Tidak mengatur urutan middleware dengan benar** - Ini bisa menyebabkan error
4. **Tidak menggunakan terminable middleware saat perlu cleanup** - Bisa menyebabkan memory leak

---

## Bagian 13: Debugging dan Testing Middleware 🔬

### 30. 🧪 Testing Middleware

```php
// tests/Feature/MiddlewareTest.php
public function test_admin_middleware_redirects_non_admin_users()
{
    $user = User::factory()->create(['role' => 'user']);
    
    $response = $this->actingAs($user)
        ->get('/admin/dashboard');
    
    $response->assertRedirect('/login');
}

public function test_admin_middleware_allows_admin_users()
{
    $admin = User::factory()->create(['role' => 'admin']);
    
    $response = $this->actingAs($admin)
        ->get('/admin/dashboard');
    
    $response->assertSuccessful();
}
```

### 31. 🔍 Debugging Middleware

```php
class DebugMiddleware
{
    public function handle($request, $next)
    {
        \Log::info('Debug Middleware - Request Path: ' . $request->path());
        \Log::info('Debug Middleware - Request Method: ' . $request->method());
        \Log::info('Debug Middleware - User ID: ' . auth()->id());
        
        $response = $next($request);
        
        \Log::info('Debug Middleware - Response Status: ' . $response->getStatusCode());
        
        return $response;
    }
}
```

---

## Bagian 14: Contoh Kasus Nyata 🏢

### 32. 🎓 Aplikasi E-Learning

Berikut contoh implementasi middleware dalam aplikasi e-learning:

```php
<?php

// Middleware untuk cek apakah user enrolled di course
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserEnrolledInCourse
{
    public function handle(Request $request, Closure $next, string $courseId): Response
    {
        if (!Auth::check()) {
            return redirect('/login');
        }
        
        $user = Auth::user();
        
        // Cek apakah user enrolled di course
        if (!$user->courses()->where('course_id', $courseId)->exists()) {
            abort(403, 'Anda harus mendaftar ke kursus ini terlebih dahulu');
        }
        
        return $next($request);
    }
}

// Di route
Route::get('/courses/{courseId}/lessons', [LessonController::class, 'index'])
    ->middleware('auth:enrolled-course:{courseId}');

// Middleware untuk cek progress course
class EnsureCourseProgress
{
    public function handle(Request $request, Closure $next, string $courseId, string $lessonId): Response
    {
        $user = Auth::user();
        
        // Cek apakah lesson sebelumnya sudah diselesaikan
        $previousLesson = getPreviousLesson($courseId, $lessonId);
        
        if ($previousLesson && !$user->hasCompletedLesson($previousLesson)) {
            abort(403, 'Anda harus menyelesaikan lesson sebelumnya terlebih dahulu');
        }
        
        return $next($request);
    }
}
```

---

## 15. 📚 Cheat Sheet & Referensi Cepat

### 🧩 Pembuatan dan Registrasi
```
php artisan make:middleware Name      → Buat middleware baru
bootstrap/app.php                    → Registrasi middleware
append() / prepend()                 → Tambah ke global stack
alias()                              → Buat alias middleware
```

### 🔁 Jenis Middleware
```
Before Request: return $next($request)    → Sebelum proses
After Request: $response = $next($request) + return $response → Setelah proses
Terminable: handle() + terminate()        → Sebelum + setelah
```

### 🚦 Penggunaan di Route
```
->middleware('name')                    → Single middleware
->middleware(['name1', 'name2'])        → Multiple middleware
->withoutMiddleware('name')             → Kecualikan middleware
Route::middleware(['group'])->group()    → Middleware grup
```

### 📦 Middleware Groups
```
web()     → Untuk aplikasi web (session, csrf, dll)
api()     → Untuk API (throttle, dll)
group()   → Buat grup custom
```

### 🏗️ Struktur Middleware
```
handle($request, $next)              → Main logic
terminate($request, $response)       → After response
```

### 🧪 Tips Umum
```
Gunakan parameter: ensure-role:admin
Gunakan priority: untuk urutan penting
Gunakan singleton: untuk terminable middleware
Gunakan logging: untuk debugging
```

---

## 16. 🎯 Kesimpulan

Middleware adalah sistem penting dalam arsitektur Laravel yang berfungsi sebagai filter dan gatekeeper untuk request yang masuk ke aplikasi. Dengan memahami konsep berikut:

- **Cara membuat middleware** yang efisien dan reusable
- **Registrasi dan organisasi middleware** dalam aplikasi
- **Berbagai jenis middleware** (before, after, terminable)
- **Best practices** untuk penggunaan middleware
- **Parameter dan grup middleware** untuk fleksibilitas
- **Priority** untuk manajemen urutan eksekusi

Kamu sekarang siap membuat aplikasi Laravel yang aman, efisien, dan terorganisir dengan baik. Middleware bukan hanya alat untuk otentikasi dan autorisasi, tapi juga sistem yang kuat untuk mengelola request secara menyeluruh dalam aplikasi kamu.

Selamat mengembangkan aplikasi kamu, muridku! Dengan kuasai middleware, kamu sudah melangkah jauh dalam membuat aplikasi web yang aman dan profesional.
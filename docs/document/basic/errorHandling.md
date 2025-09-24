# 🚨 Error Handling di Laravel - Panduan Lengkap untuk Pemula

Hai muridku yang hebat! Hari ini kita akan belajar tentang **Error Handling** di Laravel - sistem penting yang membantu aplikasi kamu menangani kesalahan dengan elegan dan aman. Seperti biasa, aku akan menjelaskan semuanya dengan bahasa yang mudah dan contoh kode yang bisa kamu coba sendiri.

---

## Bagian 1: Memahami Konsep Dasar Error Handling 🎯

### 1. 📖 Apa Itu Error Handling?

**Analogi Sederhana:** Bayangkan kamu adalah seorang pilot pesawat. Ketika pesawat mengalami gangguan (mesin bermasalah, cuaca buruk, dll), kamu tidak langsung panik dan menabrakkan pesawat. Sebagai gantinya, kamu mengikuti prosedur darurat - memeriksa instrumen, memberi tahu kontrol lalu lintas udara, mencari bandara terdekat untuk mendarat darurat, dan mengambil tindakan yang tepat.

**Error Handling di Laravel adalah seperti prosedur darurat ini** - ketika sesuatu tidak berjalan sesuai rencana di aplikasi kamu, sistem ini membantu kamu menangani masalah dengan tenang dan profesional.

### 2. 💡 Mengapa Error Handling Penting?

Tanpa error handling yang baik, aplikasi kamu bisa menghadapi masalah serius:

- **Pengalaman Pengguna Buruk** - User melihat pesan error teknis yang membingungkan
- **Keamanan Rentan** - Informasi sensitif bisa bocor ke user
- **Debugging Sulit** - Developer kesulitan melacak penyebab masalah
- **Aplikasi Crash** - Sistem berhenti berfungsi sepenuhnya
- **Reputasi Buruk** - User kecewa dan meninggalkan aplikasi

### 3. 🛡️ Cara Kerja Error Handling di Laravel

```
Error Terjadi → [Laravel Exception Handler] → Log Error + Tampilkan Response Yang Ramah
             ↑                                ↓
        Developer bisa      User melihat pesan yang mudah dipahami
        melihat detail      bukan error teknis yang membingungkan
        error di log
```

---

## Bagian 2: Konfigurasi Dasar Error Handling ⚙️

### 4. 🎛️ Pengaturan APP_DEBUG

Konfigurasi paling penting untuk error handling:

```bash
# .env untuk development/local
APP_DEBUG=true

# .env untuk production
APP_DEBUG=false
```

**Apa yang terjadi:**

- **APP_DEBUG=true** (Development):
  - Menampilkan detail error lengkap
  - Stack trace yang jelas
  - Informasi debugging yang membantu developer

- **APP_DEBUG=false** (Production):
  - Menampilkan halaman error yang ramah
  - Menyembunyikan informasi sensitif
  - Mencegah bocornya informasi internal

### 5. ⚠️ Bahaya APP_DEBUG=true di Production

**JANGAN PERNAH** mengaktifkan `APP_DEBUG=true` di lingkungan production karena:

```php
// Contoh informasi sensitif yang bisa bocor:
// - Path direktori server
// - Struktur database
// - Kredensial API
// - Konfigurasi internal
// - Stack trace lengkap
```

---

## Bagian 3: Memahami Jenis Exception 📚

### 6. 🎯 Exception Bawaan Laravel

Laravel menyediakan berbagai exception yang umum terjadi:

```php
// HTTP Exceptions
abort(404); // Page Not Found
abort(403); // Forbidden
abort(500); // Internal Server Error
abort(419); // Page Expired (CSRF)

// Model Not Found
User::findOrFail($id); // Throws ModelNotFoundException jika tidak ditemukan

// Validation Failed
$request->validate([
    'email' => 'required|email|unique:users'
]); // Throws ValidationException jika tidak valid

// Authorization Failed
$this->authorize('update', $post); // Throws AuthorizationException
```

### 7. 🏗️ Membuat Custom Exception

```bash
php artisan make:exception InvalidOrderException
```

```php
<?php

namespace App\Exceptions;

use Exception;

class InvalidOrderException extends Exception
{
    public function __construct(
        string $message = "Pesanan tidak valid", 
        int $code = 400, 
        ?Exception $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }
    
    // Tambahkan context untuk logging
    public function context(): array
    {
        return [
            'order_id' => $this->orderId ?? null,
            'user_id' => auth()->id(),
            'timestamp' => now()->toISOString()
        ];
    }
}
```

**Penggunaan:**
```php
use App\Exceptions\InvalidOrderException;

public function processOrder($orderId)
{
    $order = Order::find($orderId);
    
    if (!$order) {
        throw new InvalidOrderException("Pesanan dengan ID {$orderId} tidak ditemukan");
    }
    
    if ($order->status !== 'pending') {
        throw new InvalidOrderException("Pesanan sudah diproses sebelumnya");
    }
    
    // Proses order...
}
```

---

## Bagian 4: Exception Reporting - Mencatat Error 🔍

### 8. 📝 Dasar Exception Reporting

Reporting adalah proses mencatat error untuk keperluan debugging dan monitoring:

```php
// bootstrap/app.php
use App\Exceptions\InvalidOrderException;
use Illuminate\Log\Logger;

->withExceptions(function (Exceptions $exceptions): void {
    // Custom reporting untuk exception tertentu
    $exceptions->report(function (InvalidOrderException $e) {
        // Kirim notifikasi ke Slack
        \Slack::send("🚨 Order Error: " . $e->getMessage());
        
        // Log ke file khusus
        \Log::channel('orders')->error($e->getMessage(), [
            'order_id' => $e->orderId ?? null,
            'user_id' => auth()->id(),
            'trace' => $e->getTraceAsString()
        ]);
        
        // Return false untuk menghentikan logging default
        // return false;
    });
});
```

### 9. 🌍 Menambahkan Context Global

Menambahkan informasi tambahan ke semua log:

```php
->withExceptions(function (Exceptions $exceptions): void {
    // Context global untuk semua log
    $exceptions->context(fn () => [
        'user_id' => auth()->id(),
        'ip_address' => request()?->ip(),
        'user_agent' => request()?->userAgent(),
        'environment' => app()->environment(),
        'request_id' => request()?->header('X-Request-ID'),
        'session_id' => session()->getId(),
    ]);
});
```

### 10. 🎯 Context Khusus di Exception

Menambahkan context hanya untuk exception tertentu:

```php
<?php

namespace App\Exceptions;

use Exception;

class DatabaseConnectionException extends Exception
{
    private $connectionName;
    private $query;
    
    public function __construct(
        string $connectionName, 
        string $query = null, 
        string $message = "", 
        int $code = 0, 
        ?Exception $previous = null
    ) {
        $this->connectionName = $connectionName;
        $this->query = $query;
        
        parent::__construct($message, $code, $previous);
    }
    
    public function context(): array
    {
        return [
            'connection' => $this->connectionName,
            'query' => $this->query,
            'database_config' => config("database.connections.{$this->connectionName}"),
            'server_info' => [
                'host' => gethostname(),
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version()
            ]
        ];
    }
}
```

### 11. 🛠️ Helper report() untuk Error Non-Fatal

Kadang kamu ingin mencatat error tanpa menghentikan eksekusi:

```php
public function isValidOrder($orderId): bool
{
    try {
        $order = Order::findOrFail($orderId);
        
        if ($order->total < 0) {
            throw new \InvalidArgumentException("Total order tidak valid");
        }
        
        return true;
        
    } catch (\Throwable $e) {
        // Hanya catat error, jangan hentikan eksekusi
        report($e);
        
        // Atau kirim notifikasi khusus
        report(new InvalidOrderException(
            "Order validation failed for ID: {$orderId}", 
            0, 
            $e
        ));
        
        return false;
    }
}
```

### 12. 🚫 Mencegah Duplikasi Log

Menghindari log yang sama berulang kali:

```php
->withExceptions(function (Exceptions $exceptions): void {
    // Cegah logging exception yang sama berulang kali
    $exceptions->dontReportDuplicates();
    
    // Atau atur batas khusus
    $exceptions->throttle(function (\Throwable $e) {
        // Batasi ke 100 log per menit untuk exception yang sama
        return \Illuminate\Cache\RateLimiting\Limit::perMinute(100);
    });
});
```

---

## Bagian 5: Exception Rendering - Menampilkan Error kepada User 👁️

### 13. 🎨 Dasar Exception Rendering

Rendering adalah bagaimana error ditampilkan kepada user:

```php
->withExceptions(function (Exceptions $exceptions): void {
    // Custom rendering untuk exception tertentu
    $exceptions->render(function (InvalidOrderException $e, \Illuminate\Http\Request $request) {
        // Untuk request AJAX/API
        if ($request->expectsJson()) {
            return response()->json([
                'error' => 'Invalid Order',
                'message' => $e->getMessage(),
                'code' => $e->getCode()
            ], 400);
        }
        
        // Untuk request web biasa
        return response()->view('errors.invalid-order', [
            'exception' => $e,
            'orderId' => $e->orderId ?? null
        ], 400);
    });
});
```

### 14. 🌐 Rendering JSON untuk API

Laravel otomatis mendeteksi apakah harus merender JSON berdasarkan Accept header:

```php
->withExceptions(function (Exceptions $exceptions): void {
    // Custom deteksi kapan harus menggunakan JSON
    $exceptions->shouldRenderJsonWhen(function (\Illuminate\Http\Request $request, \Throwable $e) {
        return $request->is('api/*') || 
               $request->wantsJson() || 
               $request->header('X-Requested-With') === 'XMLHttpRequest';
    });
    
    // Custom response untuk semua error
    $exceptions->respond(function (\Symfony\Component\HttpFoundation\Response $response) {
        // Tangani kasus khusus
        if ($response->getStatusCode() === 419) {
            // CSRF token expired
            if (request()->expectsJson()) {
                return response()->json([
                    'message' => 'Halaman telah kedaluwarsa. Silakan refresh halaman.',
                    'refresh' => true
                ], 419);
            }
            
            return back()->with([
                'error' => 'Halaman telah kedaluwarsa. Silakan coba lagi.'
            ]);
        }
        
        return $response;
    });
});
```

### 15. 🖼️ Custom Error Pages

Membuat halaman error yang ramah untuk user:

```bash
# Buat direktori untuk error pages
mkdir -p resources/views/errors

# Buat file error page khusus
touch resources/views/errors/404.blade.php
touch resources/views/errors/500.blade.php
touch resources/views/errors/403.blade.php
touch resources/views/errors/429.blade.php  # Too Many Requests
```

**Contoh Error Page 404:**
```blade
{{-- resources/views/errors/404.blade.php --}}
@extends('layouts.app')

@section('title', 'Halaman Tidak Ditemukan')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8 text-center">
            <div class="error-icon mb-4">
                <i class="fas fa-exclamation-triangle text-warning" style="font-size: 4rem;"></i>
            </div>
            
            <h1 class="display-4">404</h1>
            <h2>Halaman Tidak Ditemukan</h2>
            
            <p class="lead">
                Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
            </p>
            
            <div class="mt-4">
                <a href="{{ url('/') }}" class="btn btn-primary btn-lg">
                    <i class="fas fa-home"></i> Kembali ke Beranda
                </a>
                
                <a href="{{ url()->previous() }}" class="btn btn-outline-secondary btn-lg ml-2">
                    <i class="fas fa-arrow-left"></i> Kembali
                </a>
            </div>
            
            @if(config('app.debug'))
            <div class="alert alert-info mt-4">
                <h5>Debug Information:</h5>
                <p><strong>Message:</strong> {{ $exception->getMessage() }}</p>
                <p><strong>File:</strong> {{ $exception->getFile() }}:{{ $exception->getLine() }}</p>
            </div>
            @endif
        </div>
    </div>
</div>
@endsection
```

### 16. 🎯 Fallback Error Pages

Membuat halaman error untuk kelompok error:

```bash
# Error pages untuk kelompok 4xx
touch resources/views/errors/4xx.blade.php

# Error pages untuk kelompok 5xx
touch resources/views/errors/5xx.blade.php
```

**Contoh 4xx Error Page:**
```blade
{{-- resources/views/errors/4xx.blade.php --}}
@extends('layouts.app')

@section('title', 'Permintaan Tidak Valid')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8 text-center">
            <div class="error-icon mb-4">
                <i class="fas fa-question-circle text-info" style="font-size: 4rem;"></i>
            </div>
            
            <h1 class="display-4">{{ $statusCode ?? 400 }}</h1>
            <h2>Permintaan Tidak Valid</h2>
            
            <p class="lead">
                Permintaan Anda tidak dapat diproses karena alasan berikut:
            </p>
            
            <div class="alert alert-warning">
                @if(isset($exception) && $exception->getMessage())
                    {{ $exception->getMessage() }}
                @else
                    Permintaan tidak sesuai dengan format yang diharapkan.
                @endif
            </div>
            
            <div class="mt-4">
                <a href="{{ url('/') }}" class="btn btn-primary btn-lg">
                    <i class="fas fa-home"></i> Kembali ke Beranda
                </a>
            </div>
        </div>
    </div>
</div>
@endsection
```

---

## Bagian 6: Reportable & Renderable Exception 🛠️

### 17. 🏗️ Exception dengan Method Report dan Render

Membuat exception yang bisa melaporkan dan merender dirinya sendiri:

```php
<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class PaymentProcessingException extends Exception
{
    private $paymentId;
    private $gateway;
    
    public function __construct(
        string $paymentId,
        string $gateway,
        string $message = "Pembayaran gagal diproses",
        int $code = 0,
        ?Exception $previous = null
    ) {
        $this->paymentId = $paymentId;
        $this->gateway = $gateway;
        
        parent::__construct($message, $code, $previous);
    }
    
    /**
     * Report exception (akan dipanggil otomatis)
     */
    public function report(): void
    {
        Log::channel('payments')->error($this->getMessage(), [
            'payment_id' => $this->paymentId,
            'gateway' => $this->gateway,
            'user_id' => auth()->id(),
            'timestamp' => now()->toISOString()
        ]);
        
        // Kirim notifikasi ke tim keuangan
        if (app()->environment('production')) {
            \App\Notifications\PaymentFailedNotification::send([
                'payment_id' => $this->paymentId,
                'gateway' => $this->gateway,
                'message' => $this->getMessage(),
                'user_id' => auth()->id()
            ]);
        }
    }
    
    /**
     * Render exception (akan dipanggil otomatis)
     */
    public function render(Request $request): Response
    {
        // Untuk API
        if ($request->expectsJson()) {
            return response()->json([
                'error' => 'Payment Processing Failed',
                'message' => $this->getMessage(),
                'payment_id' => $this->paymentId,
                'support_contact' => 'support@example.com'
            ], 400);
        }
        
        // Untuk web
        return response()->view('errors.payment-failed', [
            'exception' => $this,
            'paymentId' => $this->paymentId,
            'gateway' => $this->gateway
        ], 400);
    }
    
    /**
     * Context untuk logging
     */
    public function context(): array
    {
        return [
            'payment_id' => $this->paymentId,
            'gateway' => $this->gateway,
            'user_id' => auth()->id()
        ];
    }
}
```

### 18. 🎯 Exception yang Tidak Perlu Dilaporkan

Beberapa exception tidak perlu dilaporkan karena bersifat normal:

```php
<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Contracts\Debug\ShouldntReport;

class UserNotFoundException extends Exception implements ShouldntReport
{
    // Exception ini tidak akan dilaporkan/log
}

// Atau dalam konfigurasi
->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->dontReport([
        \App\Exceptions\UserNotFoundException::class,
        \App\Exceptions\CacheMissException::class,
        \Illuminate\Auth\AuthenticationException::class,
        \Illuminate\Auth\Access\AuthorizationException::class,
        \Symfony\Component\HttpKernel\Exception\HttpException::class,
        \Illuminate\Database\Eloquent\ModelNotFoundException::class,
        \Illuminate\Validation\ValidationException::class,
    ]);
});
```

---

## Bagian 7: Throttling dan Rate Limiting Exception 📈

### 19. 🚦 Membatasi Jumlah Log Error

Mencegah log banjir saat banyak error terjadi:

```php
->withExceptions(function (Exceptions $exceptions): void {
    // Gunakan lottery untuk sampling log
    $exceptions->throttle(function (\Throwable $e) {
        // Hanya 1 dari 1000 error yang dilaporkan
        return \Illuminate\Support\Lottery::odds(1, 1000);
    });
    
    // Atau batasi berdasarkan rate
    $exceptions->throttle(function (\Throwable $e) {
        // Maksimal 300 error per menit
        return \Illuminate\Cache\RateLimiting\Limit::perMinute(300);
    });
    
    // Throttling berdasarkan jenis exception
    $exceptions->throttle(function (\Throwable $e) {
        if ($e instanceof \PDOException) {
            // Database errors lebih kritis, batasi lebih ketat
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(50);
        }
        
        if ($e instanceof \GuzzleHttp\Exception\RequestException) {
            // API errors, batasi lebih longgar
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(500);
        }
        
        // Default throttling
        return \Illuminate\Cache\RateLimiting\Limit::perMinute(100);
    });
});
```

---

## Bagian 8: Integrasi dengan Layanan External 🌐

### 20. 📡 Mengirim Error ke Sentry

Integrasi dengan layanan monitoring error:

```bash
composer require sentry/sentry-laravel
```

```php
->withExceptions(function (Exceptions $exceptions): void {
    // Konfigurasi Sentry reporting
    $exceptions->report(function (\Throwable $e) {
        if (app()->bound('sentry')) {
            app('sentry')->captureException($e);
        }
    });
    
    // Kustomisasi konteks Sentry
    $exceptions->context(function () {
        if (auth()->check()) {
            return [
                'user' => [
                    'id' => auth()->id(),
                    'email' => auth()->user()->email,
                    'name' => auth()->user()->name,
                ]
            ];
        }
        
        return [];
    });
});
```

### 21. 📱 Mengirim Notifikasi Error ke Slack

```php
->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->report(function (\Throwable $e) {
        // Kirim notifikasi kritis ke Slack
        if ($this->shouldNotifySlack($e)) {
            \Slack::send([
                'text' => "🚨 Application Error in " . config('app.name'),
                'attachments' => [
                    [
                        'color' => 'danger',
                        'fields' => [
                            [
                                'title' => 'Error Message',
                                'value' => $e->getMessage(),
                                'short' => false
                            ],
                            [
                                'title' => 'File & Line',
                                'value' => $e->getFile() . ':' . $e->getLine(),
                                'short' => true
                            ],
                            [
                                'title' => 'Environment',
                                'value' => app()->environment(),
                                'short' => true
                            ],
                            [
                                'title' => 'Timestamp',
                                'value' => now()->toISOString(),
                                'short' => true
                            ]
                        ]
                    ]
                ]
            ]);
        }
    });
});

private function shouldNotifySlack(\Throwable $e): bool
{
    // Hanya kirim error kritis ke Slack
    return app()->environment('production') && (
        $e instanceof \PDOException ||
        $e instanceof \Symfony\Component\Mailer\Exception\TransportException ||
        str_contains($e->getMessage(), 'database connection')
    );
}
```

---

## Bagian 9: Debugging dan Testing Exception 🧪

### 22. 🔍 Testing Exception Handling

```php
<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Exceptions\InvalidOrderException;
use Illuminate\Support\Facades\Log;

class ExceptionHandlingTest extends TestCase
{
    public function test_invalid_order_exception_is_handled()
    {
        Log::spy(); // Mock logger
        
        $this->expectException(InvalidOrderException::class);
        
        // Trigger exception
        throw new InvalidOrderException("Test order error", 123);
        
        // Verify logging
        Log::shouldHaveReceived('error')->once();
    }
    
    public function test_custom_error_page_rendering()
    {
        $response = $this->get('/non-existent-page');
        
        $response->assertStatus(404);
        $response->assertViewIs('errors.404');
    }
    
    public function test_api_error_response()
    {
        $response = $this->postJson('/api/orders', []);
        
        $response->assertStatus(422); // Validation error
        $response->assertJsonStructure([
            'message',
            'errors'
        ]);
    }
}
```

### 23. 🔧 Debugging Exception dengan Detail

```php
// resources/views/errors/debug.blade.php
@extends('layouts.app')

@section('title', 'Debug Error Information')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <div class="alert alert-danger">
                <h2><i class="fas fa-bug"></i> Debug Error Information</h2>
                <p><strong>Environment:</strong> {{ app()->environment() }}</p>
                <p><strong>Laravel Version:</strong> {{ app()->version() }}</p>
                <p><strong>PHP Version:</strong> {{ PHP_VERSION }}</p>
            </div>
            
            @if(isset($exception))
            <div class="card">
                <div class="card-header">
                    <h3>Exception Details</h3>
                </div>
                <div class="card-body">
                    <table class="table table-bordered">
                        <tr>
                            <th>Type</th>
                            <td>{{ get_class($exception) }}</td>
                        </tr>
                        <tr>
                            <th>Message</th>
                            <td>{{ $exception->getMessage() }}</td>
                        </tr>
                        <tr>
                            <th>Code</th>
                            <td>{{ $exception->getCode() }}</td>
                        </tr>
                        <tr>
                            <th>File</th>
                            <td>{{ $exception->getFile() }}:{{ $exception->getLine() }}</td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <div class="card mt-3">
                <div class="card-header">
                    <h3>Stack Trace</h3>
                </div>
                <div class="card-body">
                    <pre>{{ $exception->getTraceAsString() }}</pre>
                </div>
            </div>
            
            <div class="card mt-3">
                <div class="card-header">
                    <h3>Context Information</h3>
                </div>
                <div class="card-body">
                    @if(method_exists($exception, 'context'))
                        <pre>{{ json_encode($exception->context(), JSON_PRETTY_PRINT) }}</pre>
                    @endif
                    
                    <h4>Request Information</h4>
                    <pre>{{ json_encode([
                        'url' => request()->fullUrl(),
                        'method' => request()->method(),
                        'ip' => request()->ip(),
                        'user_agent' => request()->userAgent(),
                        'headers' => request()->headers->all(),
                        'input' => request()->except(['password', 'password_confirmation'])
                    ], JSON_PRETTY_PRINT) }}</pre>
                </div>
            </div>
            @endif
        </div>
    </div>
</div>
@endsection
```

---

## Bagian 10: Best Practices & Tips ✅

### 24. 📋 Best Practices untuk Error Handling

1. **Selalu matikan APP_DEBUG di production:**
```bash
# .env.production
APP_DEBUG=false
```

2. **Gunakan exception yang spesifik:**
```php
// ✅ Baik
throw new InvalidOrderException("Order sudah dibatalkan");

// ❌ Kurang baik
throw new Exception("Something went wrong");
```

3. **Jangan expose informasi sensitif:**
```php
// ❌ Jangan lakukan ini di production
dd($sensitiveData);

// ✅ Lakukan ini
\Log::debug('Processing order', ['order_id' => $orderId]);
```

4. **Gunakan context yang relevan:**
```php
public function context(): array
{
    return [
        'user_id' => auth()->id(),
        'order_id' => $this->orderId ?? null,
        'timestamp' => now()->toISOString()
    ];
}
```

### 25. 💡 Tips dan Trik Berguna

```php
// Gunakan rescue() untuk error handling yang aman
$result = rescue(
    fn() => $this->riskyOperation(),
    fn() => $this->fallbackOperation(),
    report: true // Laporkan error
);

// Gunakan try/catch dengan logging yang baik
try {
    $this->processPayment();
} catch (PaymentException $e) {
    // Log error dengan context
    \Log::error('Payment processing failed', [
        'order_id' => $orderId,
        'amount' => $amount,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
    
    // Tampilkan pesan yang user-friendly
    return redirect()->back()->with('error', 'Pembayaran gagal. Silakan coba lagi.');
}

// Gunakan exception handler untuk cleanup
class FileProcessingException extends Exception
{
    private $tempFile;
    
    public function __construct($tempFile, $message = "", $code = 0, ?Exception $previous = null)
    {
        $this->tempFile = $tempFile;
        parent::__construct($message, $code, $previous);
    }
    
    public function report(): void
    {
        // Cleanup file sementara jika ada error
        if (file_exists($this->tempFile)) {
            unlink($this->tempFile);
        }
        
        parent::report();
    }
}
```

### 26. 🚨 Kesalahan Umum

1. **Lupa mematikan debug di production:**
```php
// ❌ Bahaya!
APP_DEBUG=true # Di production

// ✅ Aman
APP_DEBUG=false # Di production
```

2. **Melempar exception tanpa penanganan:**
```php
// ❌ Tidak baik
throw new Exception("Database connection failed");

// ✅ Lebih baik
throw new DatabaseConnectionException(
    "Failed to connect to {$connectionName}",
    $code,
    $previousException
);
```

3. **Tidak mengatur error pages khusus:**
```php
// Pastikan ada error pages untuk:
// - 404 (Not Found)
// - 500 (Internal Server Error)
// - 403 (Forbidden)
// - 419 (Page Expired)
// - 429 (Too Many Requests)
```

---

## Bagian 11: Contoh Implementasi Lengkap 👨‍💻

### 27. 🏢 Sistem E-Commerce dengan Error Handling Komplit

```php
<?php

// app/Exceptions/OrderProcessingException.php
namespace App\Exceptions;

use Exception;

class OrderProcessingException extends Exception
{
    private $orderId;
    private $userId;
    
    public function __construct(
        string $orderId,
        string $userId,
        string $message = "Order processing failed",
        int $code = 0,
        ?Exception $previous = null
    ) {
        $this->orderId = $orderId;
        $this->userId = $userId;
        
        parent::__construct($message, $code, $previous);
    }
    
    public function report(): void
    {
        // Log ke channel khusus order
        \Log::channel('orders')->error($this->getMessage(), [
            'order_id' => $this->orderId,
            'user_id' => $this->userId,
            'timestamp' => now()->toISOString()
        ]);
        
        // Kirim notifikasi ke admin jika error kritis
        if ($this->getCode() >= 500) {
            \Notification::route('mail', config('mail.admin_email'))
                ->notify(new \App\Notifications\CriticalOrderErrorNotification(
                    $this->orderId,
                    $this->getMessage()
                ));
        }
    }
    
    public function render(\Illuminate\Http\Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'error' => 'Order Processing Failed',
                'message' => $this->getMessage(),
                'order_id' => $this->orderId,
                'support' => 'support@ecommerce.com'
            ], 400);
        }
        
        return response()->view('errors.order-processing', [
            'exception' => $this,
            'orderId' => $this->orderId
        ], 400);
    }
    
    public function context(): array
    {
        return [
            'order_id' => $this->orderId,
            'user_id' => $this->userId,
            'timestamp' => now()->toISOString()
        ];
    }
}
```

```php
<?php

// app/Http/Controllers/OrderController.php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Exceptions\OrderProcessingException;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class OrderController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'shipping_address' => 'required|string',
                'payment_method' => 'required|in:credit_card,bank_transfer,e_wallet'
            ]);
            
            // Proses order
            $order = $this->processOrder($validated);
            
            return redirect()->route('orders.show', $order)
                ->with('success', 'Order berhasil dibuat!');
                
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Validation errors ditangani otomatis oleh Laravel
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
                
        } catch (\Exception $e) {
            // Tangkap semua exception lainnya
            report(new OrderProcessingException(
                'temp_' . uniqid(),
                auth()->id(),
                'Failed to process order: ' . $e->getMessage(),
                $e->getCode(),
                $e
            ));
            
            return redirect()->back()
                ->with('error', 'Maaf, terjadi kesalahan saat memproses order. Tim kami sudah diberitahu.')
                ->withInput();
        }
    }
    
    private function processOrder(array $data)
    {
        // Simulasi proses order yang bisa gagal
        if (rand(1, 100) <= 5) { // 5% chance of failure
            throw new OrderProcessingException(
                'temp_' . uniqid(),
                auth()->id(),
                'Unexpected error during order processing'
            );
        }
        
        // Proses order normal...
        return $order;
    }
}
```

```blade
{{-- resources/views/errors/order-processing.blade.php --}}
@extends('layouts.app')

@section('title', 'Order Processing Failed')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header bg-danger text-white">
                    <h3><i class="fas fa-exclamation-triangle"></i> Order Processing Failed</h3>
                </div>
                <div class="card-body">
                    <p>We're sorry, but there was an error processing your order.</p>
                    
                    @if(isset($exception) && $exception->getMessage())
                        <div class="alert alert-info">
                            <strong>Details:</strong> {{ $exception->getMessage() }}
                        </div>
                    @endif
                    
                    @if(isset($orderId))
                        <div class="alert alert-warning">
                            <strong>Order Reference:</strong> {{ $orderId }}
                        </div>
                    @endif
                    
                    <p>Please try again or contact our support team if the problem persists.</p>
                    
                    <div class="mt-4">
                        <a href="{{ route('cart.index') }}" class="btn btn-primary">
                            <i class="fas fa-shopping-cart"></i> Back to Cart
                        </a>
                        <a href="{{ route('support.contact') }}" class="btn btn-outline-secondary">
                            <i class="fas fa-headset"></i> Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
```

---

## Bagian 12: Cheat Sheet & Referensi Cepat 📚

### 🧩 Konfigurasi Dasar
```
APP_DEBUG=true     → Development (detail error ditampilkan)
APP_DEBUG=false    → Production (error page ramah ditampilkan)
```

### 📋 Helper Functions
```
abort(404)         → Hentikan eksekusi dengan HTTP error
report($exception) → Cuma catat error, jangan hentikan eksekusi
rescue($callback)  → Tangkap error dan kembalikan nilai default
```

### 🎯 Exception Types
```
ModelNotFoundException     → Model tidak ditemukan
ValidationException       → Validasi gagal
AuthorizationException    → Tidak berhak mengakses
AuthenticationException    → Belum login
```

### 📝 Custom Exception
```
php artisan make:exception Name
report()                  → Method untuk logging
render()                  → Method untuk response
context()                 → Method untuk context logging
```

### 🌐 Error Pages
```
resources/views/errors/404.blade.php    → Halaman 404
resources/views/errors/500.blade.php    → Halaman 500
resources/views/errors/4xx.blade.php     → Kelompok 4xx
resources/views/errors/5xx.blade.php     → Kelompok 5xx
```

### 📊 Reporting & Throttling
```
$exceptions->report(fn)                  → Custom reporting
$exceptions->dontReport([])              → Jangan report exception tertentu
$exceptions->throttle(fn)                → Batasi jumlah log
$exceptions->dontReportDuplicates()      → Cegah log duplikat
```

### 🎨 Rendering
```
$exceptions->render(fn)                  → Custom response
$exceptions->shouldRenderJsonWhen(fn)   → Deteksi kapan pakai JSON
$exceptions->respond(fn)                → Customize semua response
```

### 📡 External Integration
```
Sentry integration                       → Monitoring error eksternal
Slack notifications                     → Notifikasi real-time
Custom logging channels                 → Logging ke berbagai tujuan
```

### 🧪 Testing
```
$this->expectException()                → Test exception handling
Log::spy()                              → Mock logging
$this->get('/error-page')              → Test error pages
```

---

## 13. 🎯 Kesimpulan

Error Handling adalah sistem kritis dalam aplikasi Laravel yang memastikan:

- **Aplikasi tetap stabil** meski terjadi kesalahan
- **User mendapat pengalaman yang baik** dengan pesan error yang ramah
- **Developer bisa dengan mudah mendiagnosis masalah** melalui logging
- **Informasi sensitif tetap aman** dan tidak bocor ke user
- **Monitoring dan alerting** bekerja dengan baik untuk issue kritis

Dengan memahami konsep berikut:

- **Konfigurasi dasar** APP_DEBUG dan environment
- **Exception reporting** untuk logging dan monitoring
- **Exception rendering** untuk tampilan error yang ramah
- **Custom exception** untuk kasus spesifik
- **Integration dengan layanan eksternal** untuk monitoring
- **Best practices** untuk keamanan dan maintainability

Kamu sekarang siap membuat aplikasi Laravel yang tangguh dan profesional. Ingat selalu bahwa error handling bukan hanya tentang menangkap error, tapi juga tentang memberikan pengalaman terbaik kepada user dan memudahkan debugging bagi developer.

Selamat mengembangkan aplikasi kamu, muridku! Dengan kuasai error handling, kamu sudah melangkah jauh dalam membuat aplikasi web yang stabil dan aman.
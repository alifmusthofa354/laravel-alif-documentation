# 📝 Logging di Laravel - Panduan Lengkap untuk Pemula

Hai muridku yang hebat! Hari ini kita akan belajar tentang **Logging** di Laravel - sistem penting yang membantu kamu memantau dan mendebug aplikasi dengan lebih efektif. Seperti biasa, aku akan menjelaskan semuanya dengan bahasa yang mudah dan contoh kode yang bisa kamu coba sendiri.

---

## Bagian 1: Memahami Konsep Dasar Logging 🎯

### 1. 📖 Apa Itu Logging?

**Analogi Sederhana:** Bayangkan kamu adalah seorang kapten kapal pesiar mewah. Kamu memiliki buku log harian yang mencatat segala sesuatu yang terjadi di kapalmu - cuaca, kondisi mesin, aktivitas penumpang, masalah teknis, dll. Ketika ada masalah, kamu bisa kembali ke buku log untuk melihat apa yang terjadi.

**Logging di Laravel adalah seperti buku log kapten kapal** - mencatat semua aktivitas penting dalam aplikasi kamu agar bisa dianalisis ketika ada masalah atau untuk monitoring kinerja.

### 2. 💡 Mengapa Logging Penting?

Tanpa logging yang baik, aplikasi kamu bisa menghadapi masalah serius:

- **Debugging Sulit** - Susah mencari tahu penyebab error
- **Monitoring Tidak Efektif** - Tidak tahu apa yang terjadi di aplikasi
- **Troubleshooting Lambat** - Butuh waktu lama untuk menyelesaikan masalah
- **User Experience Buruk** - Masalah tidak terdeteksi cepat
- **Security Risk** - Aktivitas mencurigakan tidak tercatat

### 3. 🛡️ Cara Kerja Logging di Laravel

```
Aplikasi Berjalan → [Laravel Logger] → Simpan ke File/Database/External Service
                ↑                    ↓
           Developer bisa      Bisa dianalisis untuk debugging,
           melihat log         monitoring, dan alerting
```

---

## Bagian 2: Konfigurasi Dasar Logging ⚙️

### 4. 🎛️ File Konfigurasi Utama

Semua konfigurasi logging ada di `config/logging.php`:

```php
<?php

return [
    // Channel default yang digunakan
    'default' => env('LOG_CHANNEL', 'stack'),
    
    // Channel untuk deployment (saat menggunakan Laravel Envoy)
    'deprecations' => [
        'channel' => env('LOG_DEPRECATIONS_CHANNEL', 'null'),
        'trace' => env('LOG_DEPRECATIONS_TRACE', false),
    ],
    
    // Definisi channel-channel
    'channels' => [
        // Channel stack (gabungan beberapa channel)
        'stack' => [
            'driver' => 'stack',
            'channels' => ['single'],
            'ignore_exceptions' => false,
        ],
        
        // Channel single file
        'single' => [
            'driver' => 'single',
            'path' => storage_path('logs/laravel.log'),
            'level' => env('LOG_LEVEL', 'debug'),
        ],
        
        // Channel daily rotation
        'daily' => [
            'driver' => 'daily',
            'path' => storage_path('logs/laravel.log'),
            'level' => env('LOG_LEVEL', 'debug'),
            'days' => 14,
        ],
    ],
];
```

### 5. 🌍 Environment Configuration

Konfigurasi melalui `.env`:

```bash
# .env untuk development
LOG_CHANNEL=stack
LOG_LEVEL=debug

# .env untuk production
LOG_CHANNEL=daily
LOG_LEVEL=error
```

---

## Bagian 3: Memahami Channel dan Driver 📚

### 6. 🎯 Jenis Channel yang Tersedia

| Driver | Deskripsi | Penggunaan |
|--------|-----------|------------|
| `single` | Satu file log | Development, simple logging |
| `daily` | Rotasi harian | Production, long-term logging |
| `slack` | Kirim ke Slack | Alerting, team notification |
| `syslog` | Sistem log OS | Server environment |
| `errorlog` | PHP error log | Shared hosting |
| `monolog` | Generic Monolog | Custom handlers |
| `custom` | Factory custom | Special requirements |
| `stack` | Gabungan channel | Multi destination |

### 7. 🏗️ Konfigurasi Channel Stack

Channel stack menggabungkan beberapa channel:

```php
// config/logging.php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['daily', 'slack', 'papertrail'],
        'ignore_exceptions' => false,
    ],
    
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => 'debug',
        'days' => 14,
        'replace_placeholders' => true,
    ],
    
    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'username' => 'Laravel Log',
        'emoji' => ':boom:',
        'level' => 'critical',
        'replace_placeholders' => true,
    ],
],
```

---

## Bagian 4: Tingkatan Log (Log Levels) 📊

### 8. 🎯 RFC 5424 Standard Levels

Laravel mengikuti standar logging RFC 5424:

```php
use Illuminate\Support\Facades\Log;

// Dari yang paling darurat ke yang paling ringan
Log::emergency('Sistem benar-benar down!');    // Level 0
Log::alert('Tindakan segera diperlukan!');      // Level 1
Log::critical('Komponen kritis gagal!');        // Level 2
Log::error('Terjadi error dalam proses');       // Level 3
Log::warning('Peringatan, ini perlu diperhatikan'); // Level 4
Log::notice('Informasi penting');               // Level 5
Log::info('Informasi biasa');                   // Level 6
Log::debug('Informasi debugging untuk developer'); // Level 7
```

### 9. 🎛️ Mengatur Level Minimum

```php
// config/logging.php
'daily' => [
    'driver' => 'daily',
    'path' => storage_path('logs/laravel.log'),
    'level' => 'debug', // Hanya log level ini ke atas yang dicatat
    'days' => 14,
],

// Di production, biasanya gunakan level yang lebih tinggi
'production_daily' => [
    'driver' => 'daily',
    'path' => storage_path('logs/laravel.log'),
    'level' => 'warning', // Hanya warning ke atas yang dicatat
    'days' => 30,
],
```

### 10. 📝 Penggunaan Level yang Tepat

```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Debug - informasi untuk developer selama development
            Log::debug('Memulai proses pembuatan user', [
                'input' => $request->all(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);
            
            // Info - informasi biasa tentang proses
            Log::info('Membuat user baru', [
                'email' => $request->email,
                'ip' => $request->ip()
            ]);
            
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|string|min:8'
            ]);
            
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password'])
            ]);
            
            Log::info('User berhasil dibuat', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);
            
            return response()->json([
                'message' => 'User created successfully',
                'user' => $user
            ], 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Warning - validasi gagal, bukan error sistem
            Log::warning('Validasi gagal saat membuat user', [
                'errors' => $e->errors(),
                'input' => $request->except('password'),
                'ip' => $request->ip()
            ]);
            
            throw $e;
            
        } catch (\Exception $e) {
            // Error - terjadi kesalahan sistem
            Log::error('Gagal membuat user', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'input' => $request->except('password'),
                'ip' => $request->ip()
            ]);
            
            return response()->json([
                'error' => 'Failed to create user'
            ], 500);
        }
    }
    
    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ]);
            
            if (Auth::attempt($credentials)) {
                Log::info('User berhasil login', [
                    'user_id' => Auth::id(),
                    'email' => $credentials['email'],
                    'ip' => $request->ip()
                ]);
                
                return response()->json(['message' => 'Login successful']);
            }
            
            // Notice - proses berhasil tapi hasil tidak seperti yang diharapkan
            Log::notice('Login gagal - kredensial tidak valid', [
                'email' => $credentials['email'],
                'ip' => $request->ip()
            ]);
            
            return response()->json(['error' => 'Invalid credentials'], 401);
            
        } catch (\Exception $e) {
            // Critical - error yang mempengaruhi fungsi kritis
            Log::critical('Sistem autentikasi bermasalah', [
                'message' => $e->getMessage(),
                'ip' => $request->ip()
            ]);
            
            return response()->json(['error' => 'Authentication system error'], 500);
        }
    }
}
```

---

## Bagian 5: Menulis Pesan Log 🔤

### 11. 📝 Cara Dasar Menulis Log

```php
use Illuminate\Support\Facades\Log;

// Method dasar
Log::emergency('Pesan darurat');
Log::alert('Butuh tindakan segera');
Log::critical('Komponen kritis gagal');
Log::error('Terjadi error');
Log::warning('Peringatan penting');
Log::notice('Informasi perlu diperhatikan');
Log::info('Informasi biasa');
Log::debug('Informasi debugging');

// Dengan context array
Log::info('User melakukan aksi penting', [
    'user_id' => 123,
    'action' => 'update_profile',
    'ip' => request()->ip()
]);

// Dengan interpolation
Log::info('User {user_id} melakukan {action} pada {timestamp}', [
    'user_id' => Auth::id(),
    'action' => 'login',
    'timestamp' => now()->toISOString()
]);
```

### 12. 🎯 Penggunaan di Controller dan Service

```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected $paymentService;
    
    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }
    
    public function process(Request $request)
    {
        $orderId = $request->order_id;
        
        Log::info('Memulai proses pembayaran', [
            'order_id' => $orderId,
            'user_id' => auth()->id(),
            'amount' => $request->amount,
            'method' => $request->payment_method
        ]);
        
        try {
            $result = $this->paymentService->processPayment(
                $orderId,
                $request->amount,
                $request->payment_method
            );
            
            Log::info('Pembayaran berhasil diproses', [
                'order_id' => $orderId,
                'transaction_id' => $result->transaction_id,
                'amount' => $request->amount
            ]);
            
            return response()->json([
                'status' => 'success',
                'transaction_id' => $result->transaction_id
            ]);
            
        } catch (\App\Exceptions\PaymentException $e) {
            Log::error('Pembayaran gagal', [
                'order_id' => $orderId,
                'error_code' => $e->getCode(),
                'error_message' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);
            
            return response()->json([
                'status' => 'failed',
                'message' => 'Payment processing failed'
            ], 400);
            
        } catch (\Exception $e) {
            Log::critical('Error sistem saat memproses pembayaran', [
                'order_id' => $orderId,
                'exception' => get_class($e),
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'System error occurred'
            ], 500);
        }
    }
}
```

---

## Bagian 6: Context dan Structured Logging 📦

### 13. 🎯 Menambahkan Context ke Log

```php
use Illuminate\Support\Facades\Log;

// Context sederhana
Log::info('User activity', [
    'user_id' => auth()->id(),
    'action' => 'view_profile',
    'ip_address' => request()->ip(),
    'user_agent' => request()->userAgent()
]);

// Context kompleks dengan nested array
Log::info('API request processed', [
    'request' => [
        'method' => request()->method(),
        'url' => request()->fullUrl(),
        'headers' => request()->headers->all(),
        'body' => request()->all()
    ],
    'response' => [
        'status_code' => 200,
        'processing_time' => 150, // dalam ms
        'memory_usage' => memory_get_peak_usage(true)
    ],
    'user' => [
        'id' => auth()->id(),
        'role' => auth()->user()?->role
    ]
]);

// Context dengan object
Log::info('Database query executed', [
    'query' => $query->toSql(),
    'bindings' => $query->getBindings(),
    'execution_time' => $executionTime,
    'connection' => $query->getConnection()->getName()
]);
```

### 14. 🌍 Global Context untuk Semua Log

```php
// AppServiceProvider atau middleware
use Illuminate\Support\Facades\Log;

public function boot(): void
{
    // Tambahkan context global untuk semua log
    Log::withContext([
        'request_id' => request()?->header('X-Request-ID') ?? uniqid(),
        'session_id' => session()->getId(),
        'user_id' => auth()->id(),
        'ip_address' => request()?->ip(),
        'user_agent' => request()?->userAgent(),
        'environment' => app()->environment()
    ]);
    
    // Atau gunakan closure untuk context dinamis
    Log::withContext(function () {
        return [
            'timestamp' => now()->toISOString(),
            'memory_usage' => memory_get_usage(true),
            'peak_memory' => memory_get_peak_usage(true)
        ];
    });
}
```

### 15. 🎯 Context Khusus untuk Request

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class LogContextMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Tambahkan context untuk setiap request
        Log::withContext([
            'request_id' => $request->header('X-Request-ID') ?? uniqid('req_', true),
            'correlation_id' => $request->header('X-Correlation-ID'),
            'trace_id' => $request->header('X-Trace-ID'),
            'user_id' => auth()->id(),
            'ip' => $request->ip(),
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'user_agent' => $request->userAgent()
        ]);
        
        return $next($request);
    }
    
    public function terminate(Request $request, $response): void
    {
        Log::info('Request completed', [
            'status_code' => $response->getStatusCode(),
            'response_time' => microtime(true) - LARAVEL_START
        ]);
    }
}
```

---

## Bagian 7: Channel Khusus dan Destinasi Logging 🎯

### 16. 📁 Daily File Rotation

```php
// config/logging.php
'channels' => [
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => 'debug',
        'days' => 14, // Simpan log selama 14 hari
        'bubble' => true, // Lanjutkan ke channel lain
        'locking' => false, // Lock file saat menulis
        'permission' => 0644, // Permission file
        'replace_placeholders' => true, // Ganti placeholder seperti {date}
    ],
    
    // Channel untuk audit trail
    'audit' => [
        'driver' => 'daily',
        'path' => storage_path('logs/audit.log'),
        'level' => 'info',
        'days' => 90, // Simpan lebih lama untuk audit
        'formatter' => \Monolog\Formatter\JsonFormatter::class, // Format JSON
    ],
    
    // Channel untuk error khusus
    'errors' => [
        'driver' => 'daily',
        'path' => storage_path('logs/errors.log'),
        'level' => 'error',
        'days' => 30,
        'bubble' => false, // Jangan lanjutkan ke channel lain
    ]
],
```

### 17. 🚀 Slack Notification Channel

```php
// config/logging.php
'channels' => [
    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'username' => 'Laravel App',
        'emoji' => ':robot_face:',
        'level' => 'error', // Hanya error ke atas
        'short' => false, // Gunakan format pendek
        'context' => true, // Sertakan context
    ],
    
    // Slack channel untuk alert kritis
    'slack_alerts' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_ALERTS_WEBHOOK_URL'),
        'username' => '🚨 System Alerts',
        'emoji' => ':rotating_light:',
        'level' => 'critical',
        'short' => false,
        'context' => true,
    ]
],
```

**Environment configuration:**
```bash
# .env
LOG_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/XXX/YYY/ZZZ
LOG_SLACK_ALERTS_WEBHOOK_URL=https://hooks.slack.com/services/AAA/BBB/CCC
```

### 18. ☁️ Cloud Logging Services

```php
// config/logging.php
'channels' => [
    // Papertrail
    'papertrail' => [
        'driver' => 'monolog',
        'level' => 'debug',
        'handler' => \Monolog\Handler\SyslogUdpHandler::class,
        'handler_with' => [
            'host' => env('PAPERTRAIL_URL'),
            'port' => env('PAPERTRAIL_PORT'),
            'connectionString' => 'tls://' . env('PAPERTRAIL_URL') . ':' . env('PAPERTRAIL_PORT'),
        ],
    ],
    
    // Loggly
    'loggly' => [
        'driver' => 'monolog',
        'level' => 'debug',
        'handler' => \Monolog\Handler\LogglyHandler::class,
        'handler_with' => [
            'token' => env('LOGGLY_TOKEN'),
        ],
    ],
    
    // Logstash/Elasticsearch
    'logstash' => [
        'driver' => 'monolog',
        'level' => 'debug',
        'handler' => \Monolog\Handler\SocketHandler::class,
        'handler_with' => [
            'connectionString' => 'tcp://' . env('LOGSTASH_HOST', '127.0.0.1:5000'),
        ],
        'formatter' => \Monolog\Formatter\LogstashFormatter::class,
    ]
],
```

---

## Bagian 8: Custom Channel dan Handler 🛠️

### 19. 🏗️ Membuat Custom Channel Factory

```php
// app/Logging/CreateCustomLogger.php
<?php

namespace App\Logging;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Formatter\LineFormatter;

class CreateCustomLogger
{
    public function __invoke(array $config): Logger
    {
        $logger = new Logger('custom');
        
        $handler = new StreamHandler(
            $config['path'] ?? storage_path('logs/custom.log'),
            $config['level'] ?? 'debug'
        );
        
        $formatter = new LineFormatter(
            "[%datetime%] %channel%.%level_name%: %message% %context% %extra%\n",
            null,
            true,
            true
        );
        
        $handler->setFormatter($formatter);
        $logger->pushHandler($handler);
        
        return $logger;
    }
}
```

**Konfigurasi:**
```php
// config/logging.php
'channels' => [
    'custom' => [
        'driver' => 'custom',
        'via' => \App\Logging\CreateCustomLogger::class,
        'path' => storage_path('logs/custom-app.log'),
        'level' => 'debug',
    ],
],
```

### 20. 🎨 Custom Formatter

```php
// app/Logging/CustomJsonFormatter.php
<?php

namespace App\Logging;

use Monolog\Formatter\JsonFormatter;

class CustomJsonFormatter extends JsonFormatter
{
    public function format(array $record): string
    {
        $record['timestamp'] = $record['datetime']->format('c');
        $record['service'] = config('app.name');
        $record['version'] = config('app.version', '1.0.0');
        $record['environment'] = app()->environment();
        
        unset($record['datetime']);
        
        return parent::format($record);
    }
}
```

```php
// config/logging.php
'daily' => [
    'driver' => 'daily',
    'path' => storage_path('logs/laravel.log'),
    'level' => 'debug',
    'days' => 14,
    'tap' => [\App\Logging\CustomizeFormatter::class],
],

// app/Logging/CustomizeFormatter.php
<?php

namespace App\Logging;

use Illuminate\Log\Logger;
use App\Logging\CustomJsonFormatter;

class CustomizeFormatter
{
    public function __invoke(Logger $logger): void
    {
        foreach ($logger->getHandlers() as $handler) {
            $handler->setFormatter(new CustomJsonFormatter());
        }
    }
}
```

---

## Bagian 9: Logging ke Channel Tertentu 🎯

### 21. 📝 Menggunakan Channel Spesifik

```php
use Illuminate\Support\Facades\Log;

// Log ke channel tertentu
Log::channel('daily')->info('Pesan hanya ke daily log');
Log::channel('slack')->error('Error kritis ke Slack');
Log::channel('audit')->info('Audit trail penting');

// Log ke beberapa channel sekaligus
Log::stack(['daily', 'slack'])->critical('Masalah kritis yang perlu diperhatikan');

// Log ke channel on-demand
$tempLogger = Log::build([
    'driver' => 'single',
    'path' => storage_path('logs/temporary.log'),
]);
$tempLogger->info('Pesan sementara');
```

### 22. 🎯 Channel Grouping

```php
// config/logging.php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['daily', 'slack'],
    ],
    
    // Group untuk development
    'dev_stack' => [
        'driver' => 'stack',
        'channels' => ['single', 'stderr'],
    ],
    
    // Group untuk production
    'prod_stack' => [
        'driver' => 'stack',
        'channels' => ['daily', 'slack', 'papertrail'],
        'ignore_exceptions' => true,
    ],
    
    // Group untuk security audit
    'security_stack' => [
        'driver' => 'stack',
        'channels' => ['security_log', 'slack_security'],
    ]
],
```

---

## Bagian 10: Monitoring dan Analysis 📊

### 23. 📈 Laravel Pail - Real-time Log Monitoring

**Instalasi:**
```bash
composer require --dev laravel/pail
```

**Penggunaan dasar:**
```bash
# Monitor semua log secara real-time
php artisan pail

# Monitor dengan detail lebih tinggi
php artisan pail -v    # verbose
php artisan pail -vv   # very verbose (termasuk stack trace)

# Filter log berdasarkan kriteria
php artisan pail --filter="QueryException"
php artisan pail --message="User created"
php artisan pail --level=error
php artisan pail --user=1

# Filter berdasarkan channel
php artisan pail --channel=security
```

### 24. 📊 Log Analysis dan Pattern Recognition

```php
// app/Services/LogAnalyzer.php
<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Carbon;

class LogAnalyzer
{
    public function analyzeDailyLogs(string $date = null): array
    {
        $date = $date ?? now()->format('Y-m-d');
        $logPath = storage_path("logs/laravel-{$date}.log");
        
        if (!File::exists($logPath)) {
            return [];
        }
        
        $content = File::get($logPath);
        $lines = explode("\n", $content);
        
        $analysis = [
            'total_lines' => count($lines),
            'error_count' => 0,
            'warning_count' => 0,
            'info_count' => 0,
            'errors' => [],
            'warnings' => [],
            'patterns' => []
        ];
        
        foreach ($lines as $line) {
            if (strpos($line, '.ERROR:') !== false) {
                $analysis['error_count']++;
                $analysis['errors'][] = $line;
            } elseif (strpos($line, '.WARNING:') !== false) {
                $analysis['warning_count']++;
                $analysis['warnings'][] = $line;
            } elseif (strpos($line, '.INFO:') !== false) {
                $analysis['info_count']++;
            }
        }
        
        return $analysis;
    }
    
    public function detectPatterns(): array
    {
        // Deteksi pola umum seperti error berulang
        $patterns = [];
        
        // Contoh: Deteksi brute force attempts
        $loginFailures = Log::build([
            'driver' => 'single',
            'path' => storage_path('logs/security.log'),
        ]);
        
        // Analisis log untuk pola mencurigakan
        // ...
        
        return $patterns;
    }
}
```

---

## Bagian 11: Best Practices & Tips ✅

### 25. 📋 Best Practices untuk Logging

1. **Gunakan level yang tepat:**
```php
// ✅ Benar
Log::info('User berhasil login', ['user_id' => $user->id]);
Log::error('Database connection failed', ['exception' => $e->getMessage()]);
Log::warning('Invalid input detected', ['input' => $request->all()]);

// ❌ Salah
Log::info('Error: Database connection failed'); // Level salah
Log::debug('User login'); // Terlalu umum, kurang context
```

2. **Jangan log data sensitif:**
```php
// ❌ Jangan lakukan ini
Log::info('User login attempt', [
    'email' => $request->email,
    'password' => $request->password // BERBAHAYA!
]);

// ✅ Lakukan ini
Log::info('User login attempt', [
    'email' => $request->email,
    'ip' => $request->ip()
]);
```

3. **Gunakan structured logging:**
```php
// ✅ Lebih baik
Log::info('Payment processed', [
    'order_id' => $order->id,
    'amount' => $amount,
    'currency' => $currency,
    'payment_method' => $method,
    'transaction_id' => $transactionId
]);

// ❌ Kurang baik
Log::info("Payment processed for order {$order->id} amount {$amount}");
```

### 26. 💡 Tips dan Trik Berguna

```php
// Gunakan rescue() untuk logging yang aman
rescue(function () use ($data) {
    // Operasi yang bisa gagal
    $this->processData($data);
}, function ($e) {
    // Log error dengan aman
    Log::error('Data processing failed', [
        'exception' => $e->getMessage(),
        'data_preview' => array_slice($data, 0, 5) // Preview saja
    ]);
});

// Gunakan logging conditionally
if (app()->environment('local', 'staging')) {
    Log::debug('Detailed debug info', $debugData);
}

// Gunakan context untuk tracing
class OrderService
{
    public function processOrder($orderId)
    {
        $traceId = uniqid('order_', true);
        Log::withContext(['trace_id' => $traceId]);
        
        try {
            Log::info('Starting order processing', ['order_id' => $orderId]);
            
            // Proses order...
            
            Log::info('Order processing completed', ['order_id' => $orderId]);
            
        } catch (\Exception $e) {
            Log::error('Order processing failed', [
                'order_id' => $orderId,
                'exception' => $e->getMessage()
            ]);
            
            throw $e;
        }
    }
}
```

### 27. 🚨 Kesalahan Umum

1. **Logging terlalu banyak informasi:**
```php
// ❌ Terlalu banyak log
Log::debug('Entering function', ['timestamp' => microtime(true)]);
Log::debug('Processing item 1');
Log::debug('Processing item 2');
// ... 1000 baris lagi
Log::debug('Exiting function');

// ✅ Lebih baik
Log::debug('Processing batch items', ['count' => $items->count()]);
foreach ($items as $item) {
    // Hanya log exception jika ada error
}
```

2. **Tidak menggunakan context yang tepat:**
```php
// ❌ Kurang context
Log::error('Payment failed');

// ✅ Lebih baik
Log::error('Payment processing failed', [
    'order_id' => $orderId,
    'amount' => $amount,
    'user_id' => auth()->id(),
    'payment_method' => $paymentMethod
]);
```

3. **Tidak mempertimbangkan performance:**
```php
// ❌ Bisa memperlambat aplikasi
for ($i = 0; $i < 10000; $i++) {
    Log::info("Processing item {$i}"); // Terlalu banyak log
}

// ✅ Lebih baik
Log::info('Starting batch processing', ['total_items' => 10000]);
// Proses batch...
Log::info('Batch processing completed', ['processed_items' => $processedCount]);
```

---

## Bagian 12: Contoh Implementasi Lengkap 👨‍💻

### 28. 🏢 Sistem Logging Komplit untuk Aplikasi E-Commerce

```php
<?php

// config/logging.php
return [
    'default' => env('LOG_CHANNEL', 'stack'),
    
    'channels' => [
        'stack' => [
            'driver' => 'stack',
            'channels' => ['daily', 'slack'],
            'ignore_exceptions' => false,
        ],
        
        'daily' => [
            'driver' => 'daily',
            'path' => storage_path('logs/laravel.log'),
            'level' => 'debug',
            'days' => 14,
            'replace_placeholders' => true,
        ],
        
        'audit' => [
            'driver' => 'daily',
            'path' => storage_path('logs/audit.log'),
            'level' => 'info',
            'days' => 90,
            'formatter' => \Monolog\Formatter\JsonFormatter::class,
        ],
        
        'security' => [
            'driver' => 'daily',
            'path' => storage_path('logs/security.log'),
            'level' => 'warning',
            'days' => 30,
        ],
        
        'slack' => [
            'driver' => 'slack',
            'url' => env('LOG_SLACK_WEBHOOK_URL'),
            'username' => 'E-Commerce App',
            'emoji' => ':shopping_cart:',
            'level' => 'error',
        ],
        
        'slack_critical' => [
            'driver' => 'slack',
            'url' => env('LOG_SLACK_CRITICAL_WEBHOOK_URL'),
            'username' => '🚨 Critical Alerts',
            'emoji' => ':rotating_light:',
            'level' => 'critical',
        ]
    ],
];
```

```php
<?php

// app/Services/OrderService.php
namespace App\Services;

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function createOrder(array $orderData, User $user)
    {
        $orderId = uniqid('order_', true);
        
        // Tambahkan context untuk tracing
        Log::withContext([
            'order_id' => $orderId,
            'user_id' => $user->id,
            'trace_id' => uniqid('trace_', true)
        ]);
        
        Log::info('Starting order creation process', [
            'items_count' => count($orderData['items'] ?? []),
            'total_amount' => $orderData['total'] ?? 0
        ]);
        
        try {
            DB::beginTransaction();
            
            // Validasi stok
            $this->validateStock($orderData['items']);
            
            // Buat order
            $order = Order::create([
                'user_id' => $user->id,
                'order_id' => $orderId,
                'total_amount' => $orderData['total'],
                'status' => 'pending'
            ]);
            
            // Proses items
            foreach ($orderData['items'] as $item) {
                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ]);
            }
            
            DB::commit();
            
            Log::info('Order created successfully', [
                'order_number' => $order->order_id,
                'status' => $order->status
            ]);
            
            return $order;
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Order creation failed', [
                'exception' => $e->getMessage(),
                'exception_class' => get_class($e),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw new \App\Exceptions\OrderCreationException(
                "Failed to create order: " . $e->getMessage(),
                0,
                $e
            );
        }
    }
    
    private function validateStock(array $items)
    {
        foreach ($items as $item) {
            $product = \App\Models\Product::find($item['product_id']);
            
            if (!$product || $product->stock < $item['quantity']) {
                Log::warning('Insufficient stock for product', [
                    'product_id' => $item['product_id'],
                    'requested' => $item['quantity'],
                    'available' => $product->stock ?? 0
                ]);
                
                throw new \App\Exceptions\InsufficientStockException(
                    "Insufficient stock for product {$item['product_id']}"
                );
            }
        }
    }
}
```

```php
<?php

// app/Http/Middleware/LoggingContext.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LoggingContext
{
    public function handle(Request $request, Closure $next)
    {
        // Tambahkan context global untuk semua log dalam request ini
        Log::withContext([
            'request_id' => $request->header('X-Request-ID') ?? uniqid('req_', true),
            'session_id' => session()->getId(),
            'user_id' => auth()->id(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'referer' => $request->header('Referer'),
            'locale' => app()->getLocale()
        ]);
        
        return $next($request);
    }
    
    public function terminate($request, $response)
    {
        Log::info('Request completed', [
            'status_code' => $response->getStatusCode(),
            'response_time' => (microtime(true) - LARAVEL_START) * 1000, // dalam ms
            'memory_peak' => memory_get_peak_usage(true)
        ]);
    }
}
```

---

## Bagian 13: Cheat Sheet & Referensi Cepat 📚

### 🧩 Konfigurasi Dasar
```
LOG_CHANNEL=stack         → Channel default
LOG_LEVEL=debug          → Level minimum log
storage/logs/            → Direktori log default
```

### 📋 Method Logging
```
Log::emergency($message, $context)
Log::alert($message, $context)
Log::critical($message, $context)
Log::error($message, $context)
Log::warning($message, $context)
Log::notice($message, $context)
Log::info($message, $context)
Log::debug($message, $context)
```

### 🎯 Channel Drivers
```
single      → Satu file log
daily       → Rotasi harian
slack       → Kirim ke Slack
syslog      → Sistem log OS
errorlog    → PHP error log
monolog     → Handler Monolog
custom      → Factory custom
stack       → Gabungan channel
```

### 📝 Context dan Formatting
```
Log::withContext($context)     → Tambah context global
Log::channel('name')           → Log ke channel spesifik
Log::stack(['ch1', 'ch2'])     → Log ke multiple channel
Log::build($config)            → Buat channel on-demand
```

### 📊 Monitoring Tools
```
php artisan pail              → Real-time log monitoring
php artisan pail --filter=""   → Filter log
php artisan pail --level=error → Filter berdasar level
```

### 🎨 Best Practices
```
Gunakan level yang tepat
Jangan log data sensitif
Gunakan structured logging
Tambah context yang relevan
Pertimbangkan performance
```

### 🚨 Security Considerations
```
Jangan log password
Jangan log token API
Jangan log data kartu kredit
Gunakan masking untuk data sensitif
Batasi akses ke file log
```

---

## 14. 🎯 Kesimpulan

Logging adalah sistem kritis dalam aplikasi Laravel yang membantu:

- **Monitoring aplikasi** secara real-time
- **Debugging masalah** dengan informasi yang detail
- **Security auditing** untuk mendeteksi aktivitas mencurigakan
- **Performance analysis** untuk optimasi
- **Team collaboration** melalui notifikasi dan alerting

Dengan memahami konsep berikut:

- **Konfigurasi channel** yang tepat untuk kebutuhan
- **Penggunaan level log** yang sesuai konteks
- **Structured logging** untuk analisis yang lebih baik
- **Integration dengan layanan external** untuk monitoring
- **Best practices** untuk keamanan dan performance

Kamu sekarang siap membuat sistem logging yang kuat dan efektif dalam aplikasi Laravel kamu. Ingat selalu bahwa logging bukan hanya tentang mencatat error, tapi juga tentang memberikan visibility ke dalam bagaimana aplikasi kamu bekerja.

Selamat mengembangkan aplikasi kamu, muridku! Dengan kuasai logging, kamu sudah melangkah jauh dalam membuat aplikasi yang mudah dimonitor, didebug, dan di-maintain.
# 📘 Error Handling

## Pendahuluan

Ketika Anda memulai proyek Laravel baru, penanganan error dan exception sudah dikonfigurasi secara default. Namun, Laravel memberikan fleksibilitas penuh bagi developer untuk mengatur bagaimana exception **dilaporkan (reporting)** dan **ditampilkan (rendering)** dengan memanfaatkan `withExceptions` pada file `bootstrap/app.php`.

Objek `$exceptions` yang diteruskan ke closure `withExceptions` merupakan instance dari `Illuminate\Foundation\Configuration\Exceptions`. Objek ini bertanggung jawab mengelola seluruh mekanisme penanganan exception di aplikasi Anda.

---

## 1. Konfigurasi

Laravel memiliki opsi **debug** yang dapat diatur di file `config/app.php`.
Opsi ini menentukan seberapa banyak detail error yang ditampilkan ke pengguna.

* Pada **development/local**, set `.env`:

```bash
APP_DEBUG=true
```

* Pada **production**, selalu gunakan:

```bash
APP_DEBUG=false
```

❗ Jika `APP_DEBUG=true` di production, informasi sensitif bisa terekspos kepada pengguna akhir.

---

## 2. Menangani Exception

### 2.1 Reporting Exception

Reporting berarti mencatat exception ke log atau mengirimkannya ke layanan eksternal seperti **Sentry** atau **Flare**.

Contoh custom report untuk exception tertentu:

```php
use App\Exceptions\InvalidOrderException;

->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->report(function (InvalidOrderException $e) {
        // Logika custom, misalnya kirim notifikasi ke Slack
    });
});
```

Jika Anda ingin **menghentikan logging default**, gunakan:

```php
$exceptions->report(function (InvalidOrderException $e) {
    return false; // tidak diteruskan ke logging default
});
```

---

### 2.2 Menambahkan Global Context pada Log

Laravel otomatis menambahkan `user_id` ke setiap log jika user terautentikasi. Anda dapat menambahkan context global lain:

```php
->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->context(fn () => [
        'environment' => app()->environment(),
        'foo' => 'bar',
    ]);
});
```

---

### 2.3 Context Khusus di Exception

Jika ingin menambahkan context hanya pada exception tertentu, definisikan method `context()`:

```php
namespace App\Exceptions;

use Exception;

class InvalidOrderException extends Exception
{
    public function context(): array
    {
        return ['order_id' => $this->orderId];
    }
}
```

---

### 2.4 Helper `report()`

Kadang kita perlu melaporkan exception tapi tidak menghentikan request. Gunakan helper `report()`:

```php
public function isValid(string $value): bool
{
    try {
        // Validasi...
    } catch (\Throwable $e) {
        report($e); // hanya dicatat
        return false;
    }
}
```

---

### 2.5 Menghindari Duplikasi Log

Gunakan `dontReportDuplicates()` agar exception yang sama tidak dilaporkan berulang:

```php
->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->dontReportDuplicates();
});
```

---

### 2.6 Level Log Exception

Anda bisa mengatur level log tertentu untuk jenis exception spesifik:

```php
use PDOException;
use Psr\Log\LogLevel;

->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->level(PDOException::class, LogLevel::CRITICAL);
});
```

---

### 2.7 Mengabaikan Exception

Ada kalanya kita tidak ingin exception tertentu dilaporkan. Gunakan `dontReport()`:

```php
->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->dontReport([
        InvalidOrderException::class,
    ]);
});
```

Atau tandai exception dengan interface `ShouldntReport`:

```php
use Exception;
use Illuminate\Contracts\Debug\ShouldntReport;

class PodcastProcessingException extends Exception implements ShouldntReport
{
    //
}
```

---

## 3. Rendering Exception

### 3.1 Custom Rendering

Laravel otomatis merender exception menjadi HTTP response. Namun, Anda bisa custom dengan `render()`:

```php
use App\Exceptions\InvalidOrderException;
use Illuminate\Http\Request;

->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->render(function (InvalidOrderException $e, Request $request) {
        return response()->view('errors.invalid-order', status: 500);
    });
});
```

---

### 3.2 Rendering JSON

Laravel mendeteksi format response berdasarkan **Accept header** request. Anda bisa override:

```php
->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
        return $request->is('api/*');
    });
});
```

---

### 3.3 Custom Response

Anda juga bisa override keseluruhan response:

```php
use Symfony\Component\HttpFoundation\Response;

->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->respond(function (Response $response) {
        if ($response->getStatusCode() === 419) {
            return back()->with(['message' => 'Halaman kedaluwarsa, coba lagi.']);
        }
        return $response;
    });
});
```

---

## 4. Reportable & Renderable Exception

Anda dapat langsung menulis logika `report()` dan `render()` di dalam class exception:

```php
namespace App\Exceptions;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InvalidOrderException extends Exception
{
    public function report(): void
    {
        // Custom reporting
    }

    public function render(Request $request): Response
    {
        return response('Pesanan tidak valid!', 400);
    }
}
```

---

## 5. Throttling Exception

Jika banyak error tercatat, gunakan throttling agar log tidak membanjir:

```php
use Illuminate\Support\Lottery;

->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->throttle(function (\Throwable $e) {
        return Lottery::odds(1, 1000); // hanya 1 dari 1000 yang dilaporkan
    });
});
```

Atau batasi jumlah per menit:

```php
use Illuminate\Cache\RateLimiting\Limit;

->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->throttle(function (\Throwable $e) {
        return Limit::perMinute(300);
    });
});
```

---

## 6. HTTP Exceptions

Untuk menghasilkan error HTTP secara manual gunakan helper `abort()`:

```php
abort(404); // Page not found
```

---

## 7. Custom Error Pages

Laravel mempermudah membuat halaman error kustom.
Misalnya untuk **404**, buat file:

```
resources/views/errors/404.blade.php
```

Contoh:

```blade
<h2>{{ $exception->getMessage() ?? 'Halaman tidak ditemukan' }}</h2>
```

Publikasikan template default Laravel agar bisa dimodifikasi:

```bash
php artisan vendor:publish --tag=laravel-errors
```

---

## 8. Fallback Error Pages

Anda dapat membuat fallback untuk kelompok error dengan nama:

* `resources/views/errors/4xx.blade.php`
* `resources/views/errors/5xx.blade.php`

Laravel akan menggunakan fallback ini jika tidak ada file khusus untuk kode tertentu.
Namun, untuk `404`, `500`, dan `503`, Anda tetap harus membuat file khusus.

---

# Kesimpulan

Laravel menyediakan sistem **Error & Exception Handling** yang sangat fleksibel. Mulai dari logging sederhana, integrasi ke layanan eksternal, custom rendering HTML/JSON, hingga throttling agar log tetap sehat. Dengan memanfaatkan fitur ini, Anda bisa meningkatkan **keamanan**, **keterbacaan log**, dan **pengalaman pengguna**.

---

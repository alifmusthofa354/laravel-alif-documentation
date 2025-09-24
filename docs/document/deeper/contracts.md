# 🤝 Kontrak di Laravel: Panduan Lengkap dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Hari ini kita akan belajar tentang **Laravel Contracts** atau dalam bahasa Indonesia disebut **Kontrak** - sebuah konsep penting yang akan membantu kamu membangun aplikasi Laravel yang lebih fleksibel dan mudah diuji.

Bayangkan kamu sedang bekerja sama dengan temanmu untuk membangun sebuah restoran. Kalian harus menetapkan perjanjian: siapa yang bertugas apa, bagaimana cara kerjanya, dan apa yang harus dilakukan. Nah, **Contracts** itu seperti perjanjian formal antara berbagai komponen dalam aplikasi Laravel.

Siap menjadi master aplikasi Laravel? Ayo kita mulai petualangan ini bersama-sama!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Contracts Itu Sebenarnya?

**Analogi:** Bayangkan kamu adalah pemilik restoran dan kamu ingin memesan kopi ke barista. Tapi kamu tidak peduli siapa baristan-ya, selama mereka bisa membuat kopi sesuai standar: harus pahit, harus hangat, harus enak. 

**Mengapa ini penting?** Karena kamu punya **kontrak** atau **perjanjian** tentang kopi: "Saya ingin segelas kopi yang memenuhi standar X, Y, Z". Tidak peduli siapa pembuatnya, selama mereka mengikuti kontraknya, hasilnya akan sama.

**Bagaimana cara kerjanya?** Laravel **Contracts** adalah **interface** (kontrak) yang mendefinisikan layanan inti yang disediakan oleh Laravel. Ini seperti standar yang harus dipenuhi oleh setiap "pembuat kopi" (implementasi layanan) dalam aplikasi kamu.

`➡️ Request Pengguna -> 🔗 Contract (Kesepakatan) -> 🛠️ Implementation (Implementasi) -> ✅ Response`

Tanpa Contracts, kamu akan terikat dengan implementasi spesifik, dan itu akan sulit untuk diuji atau diganti. 😵

### 2. ✍️ Resep Pertamamu: Menggunakan Contracts

Mari kita buat contoh sederhana tentang bagaimana menggunakan Contracts untuk mengelola cache, langkah demi langkah.

#### Langkah 1️⃣: Pahami Kontraknya (Interface)
**Mengapa?** Kita harus tahu apa yang diminta dari sebuah kontrak sebelum menggunakannya.

**Contoh Kontrak Cache:**
```php
// Ini adalah kontrak yang mendefinisikan metode untuk layanan cache
use Illuminate\Contracts\Cache\Repository;

// Interface ini mendefinisikan metode seperti: get(), put(), has(), forget(), dll.
```

#### Langkah 2️⃣: Gunakan Kontrak di Kelas (Dependency Injection)
**Mengapa?** Agar kelas kita tidak terikat dengan implementasi cache tertentu (Redis, File, Database).

**Bagaimana?** Gunakan **type-hinting** di konstruktor:
```php
<?php

namespace App\Services;

use Illuminate\Contracts\Cache\Repository as CacheRepository;

class ProductService
{
    protected CacheRepository $cache;

    public function __construct(CacheRepository $cache)
    {
        $this->cache = $cache;
    }

    public function getAllProducts()
    {
        // Dapatkan produk dari cache jika tersedia
        $products = $this->cache->get('products');
        
        if (!$products) {
            // Jika tidak ada di cache, ambil dari database
            $products = Product::all();
            // Simpan ke cache untuk 60 menit
            $this->cache->put('products', $products, 60 * 60);
        }

        return $products;
    }
}
```
**Penjelasan Kode:**
- Kita gunakan `CacheRepository` dari contract, bukan implementasi spesifik
- Laravel secara otomatis menyuntikkan implementasi cache yang benar
- Kita bisa mengganti driver cache (Redis, File, Database) tanpa mengubah kode!

#### Langkah 3️⃣: Daftarkan Service di Controller
**Mengapa?** Agar controller bisa menggunakan service kita dengan kontrak yang benar.

**Bagaimana?** Di controller:
```php
<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    public function index()
    {
        $products = $this->productService->getAllProducts();
        return view('products.index', compact('products'));
    }
}
```

Selesai! 🎉 Sekarang kamu menggunakan Contracts untuk dependency injection. Service kamu tidak terikat dengan implementasi cache tertentu!

### 3. ⚡ Perbedaan Contracts vs Facades

**Analogi:** Bayangkan kamu punya dua cara memesan kopi:
- **Facades**: Menyerahkan daftar kebutuhan ke manajer, lalu manajer yang mengurus semua
- **Contracts**: Datang langsung ke setiap departemen dan mengelola hubungan sendiri

**Mengapa ada dua pendekatan?** Karena masing-masing punya kegunaan dan kelebihannya sendiri.

**Bagaimana contohnya?**

**Menggunakan Facades:**
```php
// Sangat mudah, langsung akses layanan
Cache::get('key');
```

**Menggunakan Contracts:**
```php
use Illuminate\Contracts\Cache\Repository;

class ProductController extends Controller
{
    public function __construct(
        protected Repository $cache
    ) {}

    public function show($id)
    {
        $product = $this->cache->get('product_'.$id);
        // ...
    }
}
```

Perbedaan utamanya:
- **Facades**: Praktis, cepat, cocok untuk aplikasi biasa
- **Contracts**: Lebih fleksibel, lebih mudah diuji, cocok untuk package dan aplikasi kompleks

---

## Bagian 2: Jurus Tingkat Menengah - Penerapan Contracts 🚀

### 4. 📦 Kapan Menggunakan Contracts vs Facades?

**Analogi:** Seperti memilih alat makan. Pada acara formal mungkin pakai garpu dan pisau, tapi untuk makan mie rebus di rumah cukup pakai sendok.

**Mengapa ini penting?** Karena pemilihan pendekatan yang tepat akan membuat aplikasi kamu lebih efisien dan mudah dipelihara.

**Kapan menggunakan Contracts:**
*   📦 **Membangun Package**: Jika kamu membuat package untuk digunakan di berbagai aplikasi Laravel dan mungkin framework lain.
*   ✅ **Testing Mudah**: Contracts membuat mocking lebih mudah saat testing.
*   🔁 **Flexibility**: Kamu bisa mengganti implementasi tanpa mengubah kelas yang menggunakan contract.

**Kapan menggunakan Facades:**
*   💡 **Aplikasi Biasa**: Jika hanya membuat aplikasi biasa, tidak untuk dijual/dibagikan.
*   ⚡ **Kecepatan Pengembangan**: Lebih cepat menulis kode.
*   🧮 **Kode Sederhana**: Untuk kode yang tidak terlalu kompleks.

**Contoh Lengkap Perbandingan:**

**Menggunakan Facades (Simple approach):**
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index()
    {
        Log::info('Mengambil daftar order');
        $orders = Cache::remember('orders', 3600, function () {
            return Order::all();
        });
        
        return view('orders.index', compact('orders'));
    }
}
```

**Menggunakan Contracts (Flexible approach):**
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Contracts\Cache\Repository as Cache;
use Illuminate\Contracts\Logging\Log;

class OrderController extends Controller
{
    public function __construct(
        protected Cache $cache,
        protected Log $log
    ) {}

    public function index()
    {
        $this->log->info('Mengambil daftar order');
        $orders = $this->cache->remember('orders', 3600, function () {
            return Order::all();
        });
        
        return view('orders.index', compact('orders'));
    }
}
```

Perhatikan perbedaannya! Dengan Contracts, kita tahu persis layanan apa yang dibutuhkan, dan kita bisa ganti implementasi tanpa mengubah kode controller.

### 5. 🎯 Dependency Injection dengan Contracts

**Analogi:** Seperti memesan peralatan kerja khusus untuk tim kamu. Alih-alih mencari sendiri, kamu memesan dengan detail spesifik yang dibutuhkan.

**Mengapa ini keren?** Karena Laravel akan otomatis memberikan implementasi yang benar dari contract yang kamu minta. Tidak perlu repot mencari atau membuat sendiri!

**Bagaimana cara kerjanya?**
```php
use Illuminate\Contracts\Config\Repository as ConfigContract;

class SomeService
{
    public function __construct(ConfigContract $config)
    {
        // Laravel otomatis memberikan implementasi Config\Repository
        $this->app_name = $config->get('app.name');
    }
}
```

### 6. 🛠️ Kontrak Umum dan Implementasinya

Laravel menyediakan banyak kontrak untuk berbagai layanan. Berikut beberapa kontrak penting dan contoh penggunaannya:

**Cache Contract:**
```php
use Illuminate\Contracts\Cache\Repository as CacheContract;

class CacheService
{
    public function __construct(private CacheContract $cache) {}
    
    public function getWithDefault(string $key, $default = null)
    {
        return $this->cache->get($key, $default);
    }
    
    public function put(string $key, $value, $ttl = 3600)
    {
        return $this->cache->put($key, $value, $ttl);
    }
}
```

**Mail Contract:**
```php
use Illuminate\Contracts\Mail\Mailer as MailContract;

class NotificationService
{
    public function __construct(private MailContract $mailer) {}
    
    public function sendWelcomeEmail($user)
    {
        $this->mailer->send('emails.welcome', ['user' => $user], function ($message) use ($user) {
            $message->to($user->email)->subject('Welcome!');
        });
    }
}
```

**Queue Contract:**
```php
use Illuminate\Contracts\Queue\Queue as QueueContract;

class JobDispatcher
{
    public function __construct(private QueueContract $queue) {}
    
    public function dispatch($job)
    {
        $this->queue->push($job);
    }
}
```

**Contoh Lengkap Implementasi:**

Mari kita buat contoh lengkap dari service yang menggunakan beberapa kontrak:

1. **Membuat Service dengan Multiple Contracts:**
```php
<?php
// app/Services/OrderProcessingService.php

namespace App\Services;

use Illuminate\Contracts\Cache\Repository as CacheContract;
use Illuminate\Contracts\Queue\Queue as QueueContract;
use Illuminate\Contracts\Mail\Mailer as MailerContract;
use App\Jobs\ProcessOrderJob;
use App\Models\Order;

class OrderProcessingService
{
    public function __construct(
        private CacheContract $cache,
        private QueueContract $queue,
        private MailerContract $mailer
    ) {}

    public function processOrder(array $orderData): Order
    {
        // Simpan order ke database
        $order = Order::create($orderData);
        
        // Hapus cache terkait
        $this->cache->forget('recent_orders');
        $this->cache->forget('pending_orders');
        
        // Proses order secara asynchronous di queue
        $this->queue->push(new ProcessOrderJob($order));
        
        // Kirim notifikasi
        $this->sendOrderConfirmation($order);
        
        return $order;
    }
    
    private function sendOrderConfirmation(Order $order): void
    {
        $this->mailer->send('emails.order_confirmation', ['order' => $order], function ($message) use ($order) {
            $message->to($order->customer_email)->subject('Order Confirmation');
        });
    }
}
```

2. **Menggunakan Service di Controller:**
```php
<?php
// app/Http/Controllers/OrderController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\OrderProcessingService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class OrderController extends Controller
{
    public function __construct(
        private OrderProcessingService $orderService
    ) {}

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'items' => 'required|array',
            'total_amount' => 'required|numeric',
        ]);

        $order = $this->orderService->processOrder($validated);

        return redirect()->route('orders.show', $order->id)
            ->with('status', 'Order created successfully!');
    }
}
```

3. **Registrasi Service di Service Provider (jika perlu):**
```php
<?php
// app/Providers/AppServiceProvider.php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\OrderProcessingService;
use Illuminate\Contracts\Cache\Repository as CacheContract;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Daftarkan service dengan implementasi spesifik jika diperlukan
        $this->app->singleton(OrderProcessingService::class, function ($app) {
            return new OrderProcessingService(
                $app->make(CacheContract::class),
                $app['queue'],
                $app['mailer']
            );
        });
    }

    public function boot(): void
    {
        //
    }
}
```

### 7. 🧪 Testing dengan Contracts

**Analogi:** Seperti memiliki mock-restaurant untuk menguji layanan pelanggan sebelum membuka restoran asli.

**Mengapa ini penting?** Karena Contracts membuat mocking sangat mudah, jadi kamu bisa menguji logika tanpa harus mengakses database, cache, atau layanan eksternal.

**Contoh Testing:**
```php
<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\CacheService;
use Illuminate\Contracts\Cache\Repository as CacheContract;
use Mockery;

class CacheServiceTest extends TestCase
{
    public function test_can_get_value_from_cache(): void
    {
        // Buat mock untuk contract
        $mockCache = Mockery::mock(CacheContract::class);
        $mockCache->shouldReceive('get')
                  ->with('key', 'default')
                  ->andReturn('value');
        
        // Buat service dengan mock
        $service = new CacheService($mockCache);
        
        // Uji perilaku
        $result = $service->getWithDefault('key', 'default');
        
        $this->assertEquals('value', $result);
    }
}
```

---

## Bagian 3: Jurus Tingkat Lanjut - Penguasaan Contracts 🚀

### 8. 👨‍💼 Membuat Kontrak Sendiri (Custom Contracts)

**Analogi:** Seperti membuat standar khusus untuk tim kerja kamu sendiri. Kadang kamu perlu kontrak yang unik untuk kebutuhan aplikasi kamu.

**Mengapa kita butuh ini?** Karena kadang aplikasi kamu memiliki kebutuhan spesifik yang tidak tercakup dalam kontrak Laravel bawaan.

**Bagaimana cara membuatnya?** 
1. Buat interface dengan metode-metode yang kamu butuhkan
2. Implementasikan interface tersebut
3. Gunakan di kelas kamu

**Contoh Lengkap Membuat Kontrak Sendiri:**

1. **Membuat Contract Interface:**
```php
<?php
// app/Contracts/PaymentProcessor.php

namespace App\Contracts;

interface PaymentProcessor
{
    public function charge(float $amount, string $currency, array $paymentDetails): array;
    public function refund(string $transactionId, float $amount = null): array;
    public function verifyPayment(string $transactionId): array;
}
```

2. **Membuat Implementasi:**
```php
<?php
// app/Services/StripePaymentProcessor.php

namespace App\Services;

use App\Contracts\PaymentProcessor;

class StripePaymentProcessor implements PaymentProcessor
{
    public function charge(float $amount, string $currency, array $paymentDetails): array
    {
        // Implementasi pembayaran dengan Stripe
        // ...
        return [
            'status' => 'success',
            'transaction_id' => 'stripe_' . uniqid(),
            'amount' => $amount,
            'currency' => $currency
        ];
    }

    public function refund(string $transactionId, float $amount = null): array
    {
        // Implementasi refund dengan Stripe
        // ...
        return [
            'status' => 'refunded',
            'transaction_id' => $transactionId
        ];
    }

    public function verifyPayment(string $transactionId): array
    {
        // Implementasi verifikasi pembayaran dengan Stripe
        // ...
        return [
            'status' => 'verified',
            'transaction_id' => $transactionId
        ];
    }
}
```

3. **Membuat Implementasi Alternatif:**
```php
<?php
// app/Services/PayPalPaymentProcessor.php

namespace App\Services;

use App\Contracts\PaymentProcessor;

class PayPalPaymentProcessor implements PaymentProcessor
{
    public function charge(float $amount, string $currency, array $paymentDetails): array
    {
        // Implementasi pembayaran dengan PayPal
        // ...
        return [
            'status' => 'success',
            'transaction_id' => 'paypal_' . uniqid(),
            'amount' => $amount,
            'currency' => $currency
        ];
    }

    public function refund(string $transactionId, float $amount = null): array
    {
        // Implementasi refund dengan PayPal
        // ...
        return [
            'status' => 'refunded',
            'transaction_id' => $transactionId
        ];
    }

    public function verifyPayment(string $transactionId): array
    {
        // Implementasi verifikasi pembayaran dengan PayPal
        // ...
        return [
            'status' => 'verified',
            'transaction_id' => $transactionId
        ];
    }
}
```

4. **Menggunakan di Service:**
```php
<?php
// app/Services/OrderService.php

namespace App\Services;

use App\Contracts\PaymentProcessor;
use App\Models\Order;

class OrderService
{
    public function __construct(
        private PaymentProcessor $paymentProcessor
    ) {}

    public function processPayment(Order $order): array
    {
        return $this->paymentProcessor->charge(
            $order->total_amount,
            $order->currency,
            $order->payment_details
        );
    }
}
```

5. **Binding di Service Provider:**
```php
<?php
// app/Providers/AppServiceProvider.php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Contracts\PaymentProcessor;
use App\Services\StripePaymentProcessor;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind kontrak ke implementasi spesifik
        $this->app->bind(
            PaymentProcessor::class,
            StripePaymentProcessor::class
        );
    }

    public function boot(): void
    {
        //
    }
}
```

Dengan cara ini, kamu bisa dengan mudah mengganti implementasi pembayaran tanpa mengubah kode service atau controller! Cukup ganti binding di service provider, dan semua akan bekerja otomatis.

### 9. 🔐 Contracts dalam Middleware

**Mengapa?** Karena kadang middleware juga perlu akses ke layanan tertentu melalui kontrak.

**Contoh:**
```php
<?php
// app/Http/Middleware/CheckUserSubscription.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\Guard;
use App\Models\Subscription;

class CheckUserSubscription
{
    public function __construct(
        private Guard $auth
    ) {}

    public function handle(Request $request, Closure $next)
    {
        $user = $this->auth->user();
        
        if (!$user || !$user->subscription || !$user->subscription->isActive()) {
            return redirect()->route('subscription.create')
                ->with('error', 'Please renew your subscription to continue.');
        }

        return $next($request);
    }
}
```

### 10. 🌐 Contracts dalam Event Listeners

**Mengapa?** Karena event listeners sering perlu berinteraksi dengan layanan yang berbeda.

**Contoh:**
```php
<?php
// app/Listeners/LogSuccessfulLogin.php

namespace App\Listeners;

use App\Events\LoginSuccessful;
use Illuminate\Contracts\Logging\Log;

class LogSuccessfulLogin
{
    public function __construct(
        private Log $logger
    ) {}

    public function handle(LoginSuccessful $event): void
    {
        $this->logger->info('User logged in successfully', [
            'user_id' => $event->user->id,
            'email' => $event->user->email,
            'timestamp' => now(),
            'ip_address' => request()->ip(),
        ]);
    }
}
```

### 11. 📋 Daftar Lengkap Contracts Laravel dan Fasadnya

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi lengkap untuk berbagai kontrak Laravel:

| 📄 **Contract** | 🔗 **Fasad / Referensi** | 🔍 **Deskripsi** |
|------------------|-------------------------|------------------|
| `Illuminate\Contracts\Auth\Access\Gate` | Gate | Manajemen policy authorization |
| `Illuminate\Contracts\Auth\Factory` | Auth | Factory untuk service auth |
| `Illuminate\Contracts\Auth\Guard` | Auth::guard() | Service auth utama |
| `Illuminate\Contracts\Auth\PasswordBroker` | Password::broker() | Manajemen reset password |
| `Illuminate\Contracts\Bus\Dispatcher` | Bus | Dispatcher untuk job dan perintah |
| `Illuminate\Contracts\Cache\Factory` | Cache | Factory untuk layanan cache |
| `Illuminate\Contracts\Cache\Repository` | Cache | Repository cache utama |
| `Illuminate\Contracts\Config\Repository` | Config | Repository konfigurasi |
| `Illuminate\Contracts\Console\Kernel` | Artisan | Kernel untuk perintah console |
| `Illuminate\Contracts\Container\Container` | App | Service container utama |
| `Illuminate\Contracts\Cookie\Factory` | Cookie | Factory untuk layanan cookie |
| `Illuminate\Contracts\Encryption\Encrypter` | Crypt | Layanan enkripsi |
| `Illuminate\Contracts\Events\Dispatcher` | Event | Dispatcher event |
| `Illuminate\Contracts\Filesystem\Factory` | Storage | Factory untuk filesystem |
| `Illuminate\Contracts\Foundation\Application` | App | Aplikasi Laravel utama |
| `Illuminate\Contracts\Hashing\Hasher` | Hash | Layanan hashing |
| `Illuminate\Contracts\Mail\Mailer` | Mail | Layanan email |
| `Illuminate\Contracts\Notifications\Dispatcher` | Notification | Dispatcher notifikasi |
| `Illuminate\Contracts\Pagination\Paginator` | - | Layanan pagination |
| `Illuminate\Contracts\Pipeline\Pipeline` | Pipeline | Pipeline operasi |
| `Illuminate\Contracts\Queue\Factory` | Queue | Factory untuk layanan queue |
| `Illuminate\Contracts\Queue\Queue` | Queue::connection() | Layanan queue utama |
| `Illuminate\Contracts\Redis\Factory` | Redis | Factory untuk layanan Redis |
| `Illuminate\Contracts\Routing\Registrar` | Route | Registrar route |
| `Illuminate\Contracts\Routing\ResponseFactory` | Response | Factory untuk respon HTTP |
| `Illuminate\Contracts\Routing\UrlGenerator` | URL | Generator URL |
| `Illuminate\Contracts\Session\Session` | Session::driver() | Layanan session |
| `Illuminate\Contracts\Translation\Translator` | Lang | Layanan terjemahan |
| `Illuminate\Contracts\Validation\Factory` | Validator | Factory untuk validasi |
| `Illuminate\Contracts\Validation\Validator` | Validator::make() | Validator utama |
| `Illuminate\Contracts\View\Factory` | View | Factory untuk view |
| `Illuminate\Contracts\View\View` | View::make() | View utama |

### 12. 🧰 Tips dan Trik dalam Menggunakan Contracts

*   **Constructor vs Method Injection**: Gunakan constructor injection untuk dependensi yang selalu dibutuhkan, method injection untuk dependensi yang hanya digunakan dalam satu fungsi tertentu.
    ```php
    // Constructor injection - untuk dependensi yang dibutuhkan di banyak method
    public function __construct(protected ServiceContract $service) {}
    
    // Method injection - untuk dependensi yang hanya digunakan dalam satu method
    public function someMethod(RequestContract $request, AnotherServiceContract $anotherService)
    {
        // gunakan $anotherService di sini saja
    }
    ```

*   **Contract untuk Testing**: Selalu gunakan contract ketika kamu berencana membuat test unit. Ini akan membuat mocking jauh lebih mudah.
    ```php
    // Dalam test
    $mock = Mockery::mock(ServiceContract::class);
    $service = new MyClass($mock);
    ```

*   **Custom Contract untuk Business Logic**: Buat contract sendiri untuk business logic yang kompleks agar bisa diganti implementasinya tanpa memengaruhi kode lain.

### 13. 💡 Kapan Harus Menggunakan Contracts?

*   ✅ **Untuk Package Development**: Jika kamu membuat package yang akan digunakan oleh orang lain.
*   ✅ **Untuk Aplikasi Besar**: Jika kamu membangun aplikasi dengan banyak modul dan tim besar.
*   ✅ **Untuk Testing**: Jika kamu ingin membuat aplikasi yang mudah diuji.
*   ✅ **Untuk Fleksibilitas**: Jika kamu perlu bisa mengganti implementasi layanan di masa depan.

*   ❌ **Untuk Aplikasi Kecil**: Jika kamu hanya membuat aplikasi kecil dan tidak akan dijual/dibagikan.
*   ❌ **Jika Fokus Pada Kecepatan**: Jika kamu ingin membuat aplikasi secepat mungkin tanpa memikirkan fleksibilitas.

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Contracts 🧰

### 14. 🔧 Dependency Injection Detail

Ada beberapa pendekatan untuk dependency injection dengan contracts:

**1. Constructor Injection dengan Property Promotion:**
```php
class PostService
{
    public function __construct(
        private PostContract $postRepository,
        private CacheContract $cache,
        private LogContract $logger
    ) {}
    
    public function getPublishedPosts()
    {
        $cacheKey = 'published_posts';
        
        return $this->cache->remember($cacheKey, 3600, function () {
            $this->logger->info('Fetching published posts from database');
            return $this->postRepository->getPublished();
        });
    }
}
```

**2. Method Injection untuk Request Spesifik:**
```php
public function updatePost(UpdatePostRequest $request, PostContract $posts, int $id) 
{
    $post = $posts->findOrFail($id);
    $post->update($request->validated());
    return $post;
}
```

### 15. 🧪 Testing dengan Contracts - Lengkap

Berikut adalah contoh lengkap testing dengan berbagai kontrak:

**Test untuk Service dengan Banyak Kontrak:**
```php
<?php
// tests/Unit/OrderServiceTest.php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\OrderService;
use App\Contracts\PaymentProcessor;
use Illuminate\Contracts\Cache\Repository as CacheContract;
use Mockery;

class OrderServiceTest extends TestCase
{
    public function test_process_order_with_successful_payment(): void
    {
        // Buat mock untuk semua kontrak
        $paymentMock = Mockery::mock(PaymentProcessor::class);
        $paymentMock->shouldReceive('charge')
                   ->with(100.0, 'USD', Mockery::any())
                   ->andReturn(['status' => 'success', 'transaction_id' => 'test_123']);
        
        $cacheMock = Mockery::mock(CacheContract::class);
        $cacheMock->shouldReceive('forget')->with('recent_orders');
        
        // Buat service dengan semua mock
        $service = new OrderService($paymentMock, $cacheMock);
        
        // Uji perilaku
        $orderData = [
            'customer_email' => 'test@example.com',
            'amount' => 100.0,
            'currency' => 'USD'
        ];
        
        $result = $service->processOrder($orderData);
        
        $this->assertEquals('success', $result['status']);
    }
}
```

### 16. 📦 Service Provider Binding untuk Contracts

Kamu juga bisa mengelola binding kontrak di service provider:

**AppServiceProvider untuk Custom Contracts:**
```php
<?php
// app/Providers/AppServiceProvider.php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Contracts\PaymentProcessor;
use App\Services\StripePaymentProcessor;
use App\Services\CacheService;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind kontrak ke implementasi
        $this->app->bind(
            PaymentProcessor::class,
            function ($app) {
                // Kamu bisa membuat logika untuk memilih implementasi berdasarkan konfigurasi
                $paymentGateway = config('app.payment_gateway', 'stripe');
                
                return match($paymentGateway) {
                    'paypal' => $app->make(PayPalPaymentProcessor::class),
                    default => $app->make(StripePaymentProcessor::class),
                };
            }
        );
        
        // Bind singleton jika implementasi membutuhkan state
        $this->app->singleton(CacheService::class, function ($app) {
            return new CacheService(
                $app->make(CacheContract::class),
                $app->make(LoggerContract::class)
            );
        });
    }

    public function boot(): void
    {
        //
    }
}
```

---

## Bagian 5: Menjadi Master Contracts 🏆

### 17. ✨ Wejangan dari Guru

1.  **Contracts untuk Fleksibilitas**: Gunakan Contracts ketika kamu ingin aplikasi kamu fleksibel dan mudah diganti implementasinya.
2.  **Facades untuk Kecepatan**: Gunakan Facades ketika kamu ingin cepat dan tidak perlu fleksibilitas tinggi.
3.  **Mocking Mudah**: Contracts membuat mocking dan testing jauh lebih mudah.
4.  **Custom Contracts**: Jangan ragu membuat kontrak sendiri untuk business logic kompleks.
5.  **Pilih yang Tepat**: Tidak ada yang salah antara Contracts atau Facades - gunakan sesuai kebutuhan dan konteks proyekmu.

### 18. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Contracts di Laravel:

#### 📦 Menggunakan Contracts
| Kode | Fungsi |
|------|--------|
| `use Illuminate\Contracts\Cache\Repository;` | Import contract |
| `public function __construct(Repository $cache)` | Constructor injection |
| `$this->cache->get('key')` | Gunakan method dari contract |

#### 🏗️ Membuat Custom Contract
| Langkah | Kode |
|---------|------|
| Buat Interface | `interface PaymentInterface { ... }` |
| Implementasikan | `class StripeService implements PaymentInterface` |
| Bind di Service Provider | `$this->app->bind(Contract::class, Implementation::class)` |

#### 🧪 Testing dengan Contracts
| Kode | Fungsi |
|------|--------|
| `Mockery::mock(Contract::class)` | Buat mock dari contract |
| `shouldReceive('method')->andReturn(...)` | Tentukan perilaku mock |
| `$service = new MyService($mock)` | Gunakan mock di service |

#### 🔧 Binding di Service Provider
| Kode | Fungsi |
|------|--------|
| `$this->app->bind(Contract::class, Implementation::class)` | Bind interface ke implementation |
| `$this->app->singleton(Contract::class, Implementation::class)` | Bind sebagai singleton |
| `when(Service::class)->needs(Contract::class)->give(Implementation::class)` | Contextual binding |

#### 🎯 Contracts vs Facades
| Contracts | Facades |
|-----------|---------|
| Lebih fleksibel | Lebih praktis |
| Mudah diuji | Cepat diketik |
| Eksplisit dependencies | Global accessor |
| Cocok untuk package | Cocok untuk aplikasi biasa |

### 19. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Contracts, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Contracts adalah alat yang sangat ampuh untuk membuat aplikasi Laravel yang fleksibel, mudah diuji, dan profesional.

Dengan memahami Contracts, kamu bisa:
- Membuat aplikasi yang lebih modular dan terstruktur
- Mengganti implementasi layanan tanpa mengubah kode lain
- Membuat kode yang lebih mudah diuji
- Membangun package yang bisa digunakan di berbagai aplikasi

Ingat, Contracts dan Facades keduanya punya tempat di Laravel. Pilih yang paling sesuai dengan kebutuhan proyekmu. Selamat ngoding, murid kesayanganku!



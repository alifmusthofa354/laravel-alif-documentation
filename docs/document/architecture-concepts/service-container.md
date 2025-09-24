# 📦 Service Container di Laravel: Panduan Lengkap dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Hari ini kita akan belajar tentang **Laravel Service Container** - sebuah alat canggih yang seperti sebuah **gudang otomatis pintar** yang siap memberikan semua alat dan bahan yang kamu butuhkan saat kamu membutuhkannya, tanpa harus mencari sendiri.

Bayangkan kamu sedang membuat sebuah restoran besar. Dulu kamu harus mencari sendiri setiap bahan, menggabungkan semua alat, dan menyiapkan semuanya secara manual. Tapi sekarang kamu punya asisten pribadi canggih yang tahu persis apa yang kamu butuhkan dan kapan kamu butuhnya. **Service Container** adalah asisten canggih itu dalam Laravel!

Siap menjadi master Service Container Laravel? Ayo kita mulai petualangan ini bersama-sama!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Service Container Itu Sebenarnya?

**Analogi:** Bayangkan kamu adalah seorang tukang masak profesional dan kamu punya gudang otomatis yang mengelola semua bahan dan peralatan masakmu. Setiap kali kamu membutuhkan "garam", "wajan", atau "kompor", kamu tinggal menyebutkan kebutuhanmu dan gudang itu langsung memberikan yang kamu butuhkan. Bahkan lebih hebat lagi, gudang itu tahu betul bahwa kamu butuh "garam halus" untuk masakan tertentu, bukan "garam kasar".

**Mengapa ini penting?** Karena Service Container mengelola **dependency injection** - proses di mana kelas kamu menerima objek yang dibutuhkan dari luar, bukan membuatnya sendiri. Ini membuat kode kamu lebih modular, fleksibel, dan mudah diuji.

**Bagaimana cara kerjanya?** Service Container adalah registry (daftar) dari semua kelas dan layanan dalam aplikasi Laravel. Kamu bisa memberi tahu container bagaimana cara membuat objek, dan nanti container akan menyediakannya saat kamu butuh.

`➡️ Kebutuhan Kelas -> 📦 Service Container -> 🔧 Dependency Injection -> ✅ Kelas dengan Semua Kebutuhannya`

Tanpa Service Container, kamu harus membuat objek secara manual di mana-mana, membuat kode menjadi kaku dan sulit diuji. 😵

### 2. ✍️ Resep Pertamamu: Menggunakan Service Container

Mari kita buat contoh sederhana tentang bagaimana menggunakan Service Container untuk dependency injection, langkah demi langkah.

#### Langkah 1️⃣: Buat Kelas yang Butuh Layanan Lain
**Mengapa?** Karena sebelum bisa menggunakan Service Container, kamu harus punya kelas yang membutuhkan dependensi.

**Bagaimana?**
```php
<?php
// app/Services/EmailService.php

namespace App\Services;

class EmailService
{
    public function send($to, $subject, $message)
    {
        // Logika pengiriman email
        echo "Email dikirim ke: $to\n";
        echo "Subjek: $subject\n";
        echo "Pesan: $message\n";
        
        return true;
    }
}
```

#### Langkah 2️⃣: Buat Kelas yang Bergantung Pada Layanan Itu
**Mengapa?** Agar kamu bisa melihat bagaimana Service Container memasukkan dependensi secara otomatis.

**Bagaimana?**
```php
<?php
// app/Services/UserService.php

namespace App\Services;

class UserService
{
    public function __construct(
        private EmailService $emailService
    ) {}

    public function createUser($userData)
    {
        // Simulasi pembuatan user
        $user = [
            'name' => $userData['name'],
            'email' => $userData['email'],
            'created_at' => now()
        ];

        // Kirim email selamat datang
        $this->emailService->send(
            $user['email'],
            'Selamat Datang!',
            'Halo ' . $user['name'] . ', selamat datang di aplikasi kami!'
        );

        return $user;
    }
}
```

#### Langkah 3️⃣: Gunakan di Controller (Type-Hinting)
**Mengapa?** Karena Laravel otomatis menggunakan Service Container untuk dependency injection di controller.

**Bagaimana?**
```php
<?php
// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\View\View;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    public function register(Request $request): View
    {
        $user = $this->userService->createUser([
            'name' => $request->name,
            'email' => $request->email
        ]);

        return view('user.registered', compact('user'));
    }
}
```

**Penjelasan Kode:**
- Saat Laravel membuat instance `UserController`, Service Container akan:
  1. Lihat bahwa `UserController` butuh `UserService`
  2. Lihat bahwa `UserService` butuh `EmailService`  
  3. Buat `EmailService` dulu
  4. Gunakan `EmailService` untuk membuat `UserService`
  5. Gunakan `UserService` untuk membuat `UserController`
- Semua otomatis tanpa kamu harus membuat object secara manual!

### 3. ⚡ Zero Configuration Resolution

**Analogi:** Seperti memiliki remote control ajaib yang bisa menemukan channel yang kamu butuhkan tanpa harus mengatur atau menyimpannya terlebih dahulu.

**Mengapa ini keren?** Karena untuk kelas konkret (bukan interface), Laravel bisa otomatis membuat instance tanpa harus kamu daftarkan di Service Container.

**Contoh Lengkap:**
```php
<?php
// routes/web.php

use App\Services\SimpleService;

Route::get('/test', function (SimpleService $service) {
    // Laravel otomatis membuat instance SimpleService
    // Tidak perlu binding apapun!
    return $service->doSomething();
});

// app/Services/SimpleService.php
namespace App\Services;

class SimpleService
{
    public function doSomething()
    {
        return "Service bekerja dengan baik!";
    }
}
```

**Bagaimana ini bekerja?** 
- Laravel melihat `SimpleService` di parameter fungsi
- Laravel lihat bahwa ini adalah kelas konkret (bukan interface)
- Laravel otomatis membuat instance dengan `new SimpleService()`
- Laravel suntikkan ke fungsi route handler

---

## Bagian 2: Jurus Tingkat Menengah - Binding Dasar 🚀

### 4. 📌 Binding Basics - Daftarkan Layanan ke Container

**Analogi:** Seperti memberi tahu asisten pribadimu bahwa ketika kamu menyebut "kopi", yang harus diberikan adalah "kopi latte hangat", bukan "kopi hitam dingin".

**Mengapa ini penting?** Karena kamu bisa memberi tahu Service Container bagaimana cara membuat objek tertentu, atau mengganti implementasi dengan yang lain.

**Contoh Lengkap:**

**Simple Binding:**
```php
<?php
// app/Providers/AppServiceProvider.php

namespace App\Providers;

use App\Services\PaymentGateway;
use App\Services\StripePaymentGateway;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Binding sederhana - beri tahu container bagaimana membuat PaymentGateway
        $this->app->bind(PaymentGateway::class, function ($app) {
            return new StripePaymentGateway(
                config('services.stripe.secret_key'),
                config('services.stripe.public_key')
            );
        });
    }

    public function boot(): void
    {
        //
    }
}
```

**Bagaimana ini digunakan:**
```php
<?php
// app/Http/Controllers/PaymentController.php

namespace App\Http\Controllers;

use App\Services\PaymentGateway;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentGateway $paymentGateway  // Ini akan menerima StripePaymentGateway
    ) {}

    public function processPayment($amount)
    {
        return $this->paymentGateway->charge($amount);
    }
}
```

### 5. 🧭 Singleton Binding

**Analogi:** Seperti memiliki satu-satunya kunci mobil mewah di kantor, dan semua orang harus bergantian menggunakannya - hanya ada satu instance yang digunakan oleh semua orang.

**Mengapa ini penting?** Karena untuk layanan yang mahal atau kompleks dibuat, kamu hanya ingin membuatnya satu kali dan digunakan berkali-kali.

**Contoh Lengkap:**
```php
<?php
// app/Providers/AppServiceProvider.php

namespace App\Providers;

use App\Services\DatabaseConnection;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Singleton binding - hanya buat satu instance sepanjang siklus request
        $this->app->singleton(DatabaseConnection::class, function ($app) {
            return new DatabaseConnection([
                'host' => config('database.host'),
                'username' => config('database.username'),
                'password' => config('database.password'),
            ]);
        });
    }
}

// Dalam beberapa kelas berbeda
class UserRepository
{
    public function __construct(
        private DatabaseConnection $db  // Akan menerima instance yang sama
    ) {}
}

class OrderRepository  
{
    public function __construct(
        private DatabaseConnection $db  // Akan menerima instance yang SAMA
    ) {}
}

// Kedua kelas ini akan menerima instance DatabaseConnection yang sama!
```

### 6. 🏷️ Scoped Binding

**Analogi:** Seperti memiliki satu mobil untuk setiap proyek - satu mobil untuk proyek A, satu mobil untuk proyek B - tapi dalam satu proyek hanya ada satu mobil.

**Mengapa ini penting?** Karena kadang kamu butuh instance tunggal per request atau per job, bukan per aplikasi.

**Contoh:**
```php
<?php
// app/Providers/AppServiceProvider.php

use App\Services\RequestLogger;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Scoped binding - satu instance per request
        $this->app->scoped(RequestLogger::class, function ($app) {
            return new RequestLogger(
                request()->ip(),
                request()->userAgent()
            );
        });
    }
}

// Dalam satu request HTTP yang sama
class HomeController
{
    public function __construct(private RequestLogger $logger) {}
    
    public function index()
    {
        // $this->logger adalah instance yang sama dengan...
        app(OrderService::class)->processOrder(); // ...di sini
    }
}

class OrderService
{
    public function __construct(private RequestLogger $logger) {}
    
    public function processOrder()
    {
        // $this->logger adalah instance yang SAMA dengan di HomeController
        $this->logger->log('Processing order...');
    }
}
```

### 7. 🧩 Binding Interfaces to Implementations

**Analogi:** Seperti memberi tahu asisten bahwa ketika kamu menyebut "mobil", yang harus datangkan adalah "Toyota Camry", bukan "Honda Civic", meskipun keduanya adalah mobil.

**Mengapa ini penting?** Karena ini adalah inti dari SOLID principles - kamu bisa mengganti implementasi tanpa mengubah kode yang menggunakan interface.

**Contoh Lengkap:**
```php
<?php
// app/Contracts/PaymentProcessor.php

namespace App\Contracts;

interface PaymentProcessor
{
    public function charge($amount);
    public function refund($transactionId);
    public function verifyPayment($transactionId);
}

<?php
// app/Services/StripePaymentProcessor.php

namespace App\Services;

use App\Contracts\PaymentProcessor;

class StripePaymentProcessor implements PaymentProcessor
{
    public function charge($amount)
    {
        // Logika pembayaran dengan Stripe
        return ['status' => 'success', 'transaction_id' => uniqid('stripe_')];
    }

    public function refund($transactionId)
    {
        // Logika refund dengan Stripe
        return ['status' => 'refunded'];
    }

    public function verifyPayment($transactionId)
    {
        // Logika verifikasi dengan Stripe
        return ['status' => 'verified'];
    }
}

<?php
// app/Services/PayPalPaymentProcessor.php

namespace App\Services;

use App\Contracts\PaymentProcessor;

class PayPalPaymentProcessor implements PaymentProcessor
{
    public function charge($amount)
    {
        // Logika pembayaran dengan PayPal
        return ['status' => 'success', 'transaction_id' => uniqid('paypal_')];
    }

    public function refund($transactionId)
    {
        // Logika refund dengan PayPal
        return ['status' => 'refunded'];
    }

    public function verifyPayment($transactionId)
    {
        // Logika verifikasi dengan PayPal
        return ['status' => 'verified'];
    }
}

<?php
// app/Providers/AppServiceProvider.php

namespace App\Providers;

use App\Contracts\PaymentProcessor;
use App\Services\StripePaymentProcessor;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Binding interface ke implementasi spesifik
        $this->app->bind(PaymentProcessor::class, StripePaymentProcessor::class);
    }
}

// Sekarang di mana pun kamu type-hint PaymentProcessor, 
// Laravel akan memberikan StripePaymentProcessor
class OrderService
{
    public function __construct(
        private PaymentProcessor $paymentProcessor  // Akan menerima StripePaymentProcessor
    ) {}

    public function processOrder($amount)
    {
        return $this->paymentProcessor->charge($amount);
    }
}
```

### 8. 🎚️ Contextual Binding

**Analogi:** Seperti memberi tahu asisten bahwa ketika kamu pergi ke restoran, kamu butuh "mobil keluarga", tapi ketika kamu pergi ke acara formal, kamu butuh "mobil mewah" - meskipun keduanya tetap mobil.

**Mengapa ini penting?** Karena kadang satu interface butuh implementasi berbeda tergantung konteksnya.

**Contoh Lengkap:**
```php
<?php
// app/Contracts/Filesystem.php

namespace App\Contracts;

interface Filesystem
{
    public function save($file, $path);
    public function get($path);
    public function delete($path);
}

<?php
// app/Services/LocalStorage.php

namespace App\Services;

use App\Contracts\Filesystem;

class LocalStorage implements Filesystem
{
    public function save($file, $path)
    {
        // Simpan ke storage lokal
        return 'file saved locally: ' . $path;
    }

    public function get($path)
    {
        return 'file from local: ' . $path;
    }

    public function delete($path)
    {
        return 'file deleted from local: ' . $path;
    }
}

<?php
// app/Services/S3Storage.php

namespace App\Services;

use App\Contracts\Filesystem;

class S3Storage implements Filesystem
{
    public function save($file, $path)
    {
        // Simpan ke S3
        return 'file saved to S3: ' . $path;
    }

    public function get($path)
    {
        return 'file from S3: ' . $path;
    }

    public function delete($path)
    {
        return 'file deleted from S3: ' . $path;
    }
}

<?php
// app/Providers/AppServiceProvider.php

use App\Contracts\Filesystem;
use App\Services\LocalStorage;
use App\Services\S3Storage;
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\VideoController;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Contextual binding - beri implementasi berbeda tergantung kelas yang membutuhkan
        $this->app->when(PhotoController::class)
            ->needs(Filesystem::class)
            ->give(fn() => new LocalStorage());

        $this->app->when(VideoController::class)
            ->needs(Filesystem::class)
            ->give(fn() => new S3Storage());
    }
}

// PhotoController akan menerima LocalStorage
class PhotoController extends Controller
{
    public function __construct(
        private Filesystem $storage  // Akan menerima LocalStorage
    ) {}

    public function uploadPhoto(Request $request)
    {
        return $this->storage->save($request->file, 'photos/');
    }
}

// VideoController akan menerima S3Storage
class VideoController extends Controller
{
    public function __construct(
        private Filesystem $storage  // Akan menerima S3Storage
    ) {}

    public function uploadVideo(Request $request)
    {
        return $this->storage->save($request->file, 'videos/');
    }
}
```

---

## Bagian 3: Jurus Tingkat Lanjut - Teknik Canggih 🚀

### 9. 🏷️ Tagging - Mengelompokkan Layanan

**Analogi:** Seperti memberi label pada barang-barang di gudang, sehingga kamu bisa mengambil semua barang dengan label tertentu sekaligus, misalnya semua barang dengan label "elektronik" atau "makanan".

**Mengapa ini penting?** Karena kamu bisa mengelompokkan layanan serupa dan menggunakannya bersama-sama.

**Contoh Lengkap:**
```php
<?php
// app/Services/ReportServices.php

namespace App\Services;

class SalesReport
{
    public function generate()
    {
        return "Sales report generated";
    }
}

class InventoryReport
{
    public function generate()
    {
        return "Inventory report generated";
    }
}

class CustomerReport
{
    public function generate()
    {
        return "Customer report generated";
    }
}

<?php
// app/Providers/AppServiceProvider.php

use App\Services\SalesReport;
use App\Services\InventoryReport;
use App\Services\CustomerReport;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Daftarkan semua report service
        $this->app->bind(SalesReport::class, fn() => new SalesReport());
        $this->app->bind(InventoryReport::class, fn() => new InventoryReport());
        $this->app->bind(CustomerReport::class, fn() => new CustomerReport());

        // Beri tag ke semua report service
        $this->app->tag([SalesReport::class, InventoryReport::class, CustomerReport::class], 'reports');
    }

    public function boot(): void
    {
        // Gunakan semua report service yang ditag
        $this->app->tagged('reports')->each(function ($report) {
            // Proses setiap report
            echo $report->generate() . "\n";
        });
    }
}

// Dalam service atau controller
class ReportService
{
    public function __construct(
        private $reports
    ) {
        // Ambil semua service yang ditag 'reports'
        $this->reports = app()->tagged('reports');
    }

    public function generateAllReports()
    {
        $results = [];
        foreach ($this->reports as $report) {
            $results[] = $report->generate();
        }
        return $results;
    }
}
```

### 10. 🔍 Manual Resolution - Mengambil Layanan dari Container

**Analogi:** Seperti terkadang kamu perlu membuka gudang langsung dan mengambil barang sendiri, bukan menunggu dikirimkan.

**Mengapa ini penting?** Karena terkadang kamu perlu mengambil layanan secara manual di luar dependency injection otomatis.

**Contoh Lengkap:**
```php
<?php

// Menggunakan app() helper
$paymentService = app(PaymentProcessor::class);

// Menggunakan App facade
use Illuminate\Support\Facades\App;
$paymentService = App::make(PaymentProcessor::class);

// Menggunakan container instance
$container = app();
$paymentService = $container->make(PaymentProcessor::class);

// Dengan parameter tambahan
class ApiService
{
    public function __construct(
        private PaymentProcessor $processor,
        private $config
    ) {}

    public function setConfig($config)
    {
        $this->config = $config;
    }
}

// Resolve dengan parameter konteks
$apiService = app()->makeWith(ApiService::class, [
    'config' => ['timeout' => 30, 'retry' => 3]
]);
```

### 11. 📡 Container Events - Resolving Callbacks

**Analogi:** Seperti memiliki alarm yang berbunyi setiap kali asisten mengambil barang tertentu dari gudang, sehingga kamu bisa menambahkan label tambahan atau melakukan pengecekan.

**Mengapa ini penting?** Karena kamu bisa menambahkan logika tambahan setiap kali service dibuat.

**Contoh Lengkap:**
```php
<?php
// app/Providers/AppServiceProvider.php

use App\Services\PaymentProcessor;
use App\Services\EmailService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Event callback untuk PaymentProcessor
        $this->app->resolving(PaymentProcessor::class, function ($processor, $app) {
            // Tambahkan konfigurasi tambahan setelah object dibuat
            $processor->setApiKey(config('services.payment.api_key'));
            $processor->setEnvironment(config('app.env'));
            
            // Log bahwa service dibuat
            \Log::info('PaymentProcessor created', [
                'service' => get_class($processor),
                'timestamp' => now()
            ]);
        });

        // Event callback untuk semua service (tanpa interface spesifik)
        $this->app->resolving(function ($object, $app) {
            // Cek apakah object punya method setLogger
            if (method_exists($object, 'setLogger')) {
                $object->setLogger($app->make('logger'));
            }
        });
    }
}

// Dalam service
class StripePaymentProcessor implements PaymentProcessor
{
    private $logger;
    private $apiKey;
    private $environment;

    public function setApiKey($apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function setEnvironment($env)
    {
        $this->environment = $env;
    }

    public function setLogger($logger)
    {
        $this->logger = $logger;
    }

    public function charge($amount)
    {
        // Gunakan apiKey dan environment yang sudah diset di resolving callback
        $this->logger?->info("Processing payment: {$amount}", [
            'api_key_used' => $this->apiKey,
            'environment' => $this->environment
        ]);

        return ['status' => 'success'];
    }
}
```

### 12. ♻️ Rebinding - Merespon Perubahan Binding

**Analogi:** Seperti memiliki sistem alarm yang aktif ketika asisten ganti jenis mobil yang tersedia di gudang, sehingga kamu tahu bahwa sekarang mobil yang tersedia adalah yang baru.

**Mengapa ini penting?** Karena kamu bisa merespon ketika service di-rebind atau diganti implementasinya.

**Contoh:**
```php
<?php
// app/Providers/AppServiceProvider.php

use App\Services\OldPaymentService;
use App\Services\NewPaymentService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Daftarkan service awal
        $this->app->singleton(OldPaymentService::class, function ($app) {
            return new OldPaymentService();
        });

        // Tambahkan listener untuk rebinding
        $this->app->rebinding(OldPaymentService::class, function ($app, $newInstance) {
            // Ketika OldPaymentService di-rebind, lakukan sesuatu
            \Log::info('Payment service rebinding detected', [
                'new_instance' => get_class($newInstance),
                'timestamp' => now()
            ]);

            // Misalnya update cache atau hubungi layanan lain
            $app->make('cache')->forget('payment_methods');
        });
    }
}

// Di tempat lain, service bisa direbind
class FeatureToggleService
{
    public function enableNewPaymentSystem()
    {
        // Ganti implementasi tanpa restart aplikasi
        app()->bind(OldPaymentService::class, function ($app) {
            return new NewPaymentService();
        });
        // Rebinding listener akan diaktifkan!
    }
}
```

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Service Container 🧰

### 13. ⚡ Method Injection dan App::call()

**Analogi:** Seperti memiliki asisten yang bisa tidak hanya memberikan peralatan untuk membuat aplikasi, tapi juga bisa menjalankan fungsi spesifik dengan semua peralatan yang dibutuhkan secara otomatis.

**Mengapa ini penting?** Karena kamu bisa memanggil method dengan dependency injection otomatis, bahkan untuk method non-constructor.

**Contoh Lengkap:**
```php
<?php

use Illuminate\Support\Facades\App;

class ReportGenerator
{
    public function generateReport($type, PaymentProcessor $processor, EmailService $mailer)
    {
        $data = $processor->getReportData($type);
        $result = "Report: " . json_encode($data);
        
        $mailer->send('admin@company.com', 'Report Generated', $result);
        
        return $result;
    }
}

// Gunakan App::call untuk memanggil method dengan dependency injection
$result = App::call([new ReportGenerator, 'generateReport'], [
    'type' => 'monthly_sales'
]);
// Laravel akan otomatis inject PaymentProcessor dan EmailService!

// Atau dalam closure
Route::get('/report/{type}', function ($type) {
    return App::call(function (PaymentProcessor $processor, Request $request) use ($type) {
        return $processor->generateReport($type);
    });
});
```

### 14. 📜 PSR-11 Support - Kompatibilitas Standar

**Mengapa?** Karena Laravel mendukung standar PSR-11, membuatnya kompatibel dengan library PHP lain yang juga mengikuti standar ini.

**Contoh:**
```php
<?php

use Psr\Container\ContainerInterface;

class ThirdPartyService
{
    public function __construct(
        private ContainerInterface $container
    ) {}

    public function getService($name)
    {
        // Bekerja dengan container apapun yang mengikuti PSR-11
        return $this->container->get($name);
    }
}

// Laravel container mengikuti PSR-11
$thirdParty = new ThirdPartyService(app());
$paymentService = $thirdParty->getService(PaymentProcessor::class);
```

### 15. 🧪 Testing dengan Service Container

**Mengapa?** Karena Service Container sangat penting dalam testing - kamu bisa ganti real service dengan mock dengan mudah.

**Contoh Testing:**
```php
<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\PaymentProcessor;
use App\Services\MockPaymentProcessor;
use App\Http\Controllers\PaymentController;

class PaymentControllerTest extends TestCase
{
    public function test_payment_successful_with_mock()
    {
        // Ganti real service dengan mock
        $this->instance(PaymentProcessor::class, new MockPaymentProcessor());

        // Buat controller - akan menerima mock service
        $controller = app(PaymentController::class);

        $response = $controller->processPayment(100);

        $this->assertEquals('success', $response['status']);
    }

    public function test_payment_gateway_switch()
    {
        // Uji bahwa kita bisa ganti implementasi
        $this->swap(PaymentProcessor::class, new MockPaymentProcessor());
        
        $result = app(PaymentProcessor::class)->charge(50);
        
        $this->assertEquals('mocked_success', $result['status']);
    }
}
```

### 16. 🔧 Advanced Binding Techniques

**Instance Binding:**
```php
// Bind instance spesifik (bukan class)
$instance = new PaymentProcessor();
$this->app->instance(PaymentProcessor::class, $instance);
```

**Conditional Binding:**
```php
// Binding berdasarkan kondisi environment
if ($this->app->environment('testing')) {
    $this->app->bind(PaymentProcessor::class, MockPaymentProcessor::class);
} else {
    $this->app->bind(PaymentProcessor::class, RealPaymentProcessor::class);
}
```

**Extending Existing Bindings:**
```php
// Tambahkan fitur ke service yang sudah ada
$this->app->extend(PaymentProcessor::class, function ($processor, $app) {
    $processor->addLoggingMiddleware();
    $processor->addRetryMiddleware();
    return $processor;
});
```

---

## Bagian 5: Penguasaan Master Service Container 🏆

### 17. ✨ Wejangan dari Guru

1.  **Interface Segala-Galanya**: Gunakan interface untuk semua service penting agar mudah diganti implementasinya.
2.  **Singleton untuk Layanan Mahal**: Gunakan singleton untuk layanan yang mahal dibuat seperti koneksi database.
3.  **Contextual Binding untuk Fleksibilitas**: Gunakan contextual binding ketika satu interface butuh implementasi berbeda di konteks berbeda.
4.  **Tagging untuk Kelompok Service**: Gunakan tagging untuk mengelola banyak service serupa.
5.  **Testing Jadi Mudah**: Service Container membuat testing menjadi jauh lebih mudah dengan mocking yang mudah.
6.  **Gunakan Event Callbacks**: Gunakan resolving callbacks untuk logika tambahan saat service dibuat.

### 18. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Service Container di Laravel:

#### 🔗 Basic Binding
| Method | Fungsi | Contoh |
|--------|--------|--------|
| `bind($abstract, $concrete)` | Binding kelas/interface | `$app->bind(Interface::class, Implementation::class)` |
| `singleton($abstract, $concrete)` | Binding singleton | `$app->singleton(Service::class, fn() => new Service())` |
| `scoped($abstract, $concrete)` | Binding scoped | `$app->scoped(Service::class, fn() => new Service())` |
| `instance($abstract, $instance)` | Binding instance | `$app->instance(Service::class, $obj)` |

#### 🎚️ Contextual Binding
| Method | Fungsi | Contoh |
|--------|--------|--------|
| `when($class)->needs($abstract)->give($implementation)` | Binding kontekstual | `$app->when(Controller::class)->needs(Service::class)->give(MockService::class)` |

#### 🏷️ Tagging
| Method | Fungsi | Contoh |
|--------|--------|--------|
| `tag([$concrete], $tag)` | Beri tag ke service | `$app->tag([Service1::class, Service2::class], 'reports')` |
| `tagged($tag)` | Ambil semua tertag | `$app->tagged('reports')` |

#### 🔍 Resolution
| Method | Fungsi | Contoh |
|--------|--------|--------|
| `make($abstract)` | Resolve service | `$app->make(Service::class)` |
| `resolve($abstract)` | Alias make | `$app->resolve(Service::class)` |
| `app($abstract)` | Helper resolve | `app(Service::class)` |

#### 📡 Events
| Method | Fungsi | Contoh |
|--------|--------|--------|
| `resolving($abstract, $callback)` | Event saat resolve | `$app->resolving(Service::class, $callback)` |
| `rebinding($abstract, $callback)` | Event saat rebind | `$app->rebinding(Service::class, $callback)` |

#### 🧪 Testing Helpers
| Method | Fungsi | Contoh |
|--------|--------|--------|
| `instance($abstract, $instance)` | Ganti dengan mock | `$this->instance(Service::class, $mock)` |
| `swap($abstract, $instance)` | Ganti binding | `$this->swap(Service::class, $mock)` |
| `extend($abstract, $callback)` | Tambahkan fitur | `$app->extend(Service::class, $callback)` |

### 19. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Service Container, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Service Container adalah salah satu fitur paling penting di Laravel yang membuat aplikasi kamu menjadi modular, fleksibel, dan mudah diuji.

Dengan memahami Service Container, kamu bisa:
- Membuat aplikasi yang mudah diuji dengan mocking yang mudah
- Memisahkan concern dengan dependency injection
- Membuat kode yang lebih fleksibel dengan interface
- Mengelola instance dengan berbagai pendekatan (singleton, scoped, dll)
- Menyusun arsitektur aplikasi yang solid

Ingat, Service Container adalah jantung dari dependency injection di Laravel. Gunakan dengan bijak dan penuh kreativitas untuk membuat aplikasimu semakin canggih. Selamat ngoding, murid kesayanganku!
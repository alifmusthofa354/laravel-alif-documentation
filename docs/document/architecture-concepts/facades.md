# 🎭 Facades di Laravel: Panduan Lengkap dari Guru Kesayanganmu (Edisi Akses Super Mudah!)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel yang super seru. Hari ini kita akan membahas salah satu fitur keren yang membuat coding di Laravel jadi super praktis - **Facades**. Bayangkan kamu bisa menggunakan semua fitur keren Laravel hanya dengan menulis singkatan singkat seperti `Cache::get()` atau `DB::table()` - itulah kekuatan facades! Mereka seperti asisten pribadi super pintar yang siap membantumu mengakses semua fitur Laravel dengan mudah dan cepat. 🚀

Di edisi ini, kita akan kupas tuntas **semua detail** tentang Facades, tapi setiap topik akan Guru ajarkan dengan sabar. Siap? Ayo kita mulai petualangan akses mudah ini!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Facades Itu Sebenarnya?

**Analogi:** Bayangkan kamu seorang manajer hotel yang sibuk. Daripada kamu harus pergi ke setiap departemen (resepsionis, housekeeping, restoran) secara langsung, kamu punya sebuah interkom ajaib yang bisa kamu gunakan untuk memanggil siapa pun dan meminta apa pun dengan mudah. **Facades di Laravel itu seperti interkom ajaib tersebut** - mereka memberimu akses mudah ke semua layanan yang ada di dalam "service container" (tempat semua layanan Laravel disimpan) hanya dengan menuliskan singkatan dan titik dua.

**Mengapa ini penting?** Karena dalam dunia coding, kita sering membutuhkan layanan seperti cache, database, log, email, dll. Tanpa facades, kita harus menulis kode yang panjang dan kompleks untuk mengakses layanan-layanan ini.

**Bagaimana cara kerjanya?** Laravel dengan sistem facades-nya akan:
1.  **Menyediakan antarmuka statis** untuk mengakses layanan.
2.  **Meneruskan permintaan kamu ke service container**.
3.  **Mengambil layanan yang benar dan menjalankan metode yang diminta**.

Jadi, alur kerja (workflow) penggunaan facades menjadi sangat mudah:

`➡️ Kamu menulis kode sederhana seperti Cache::get() -> 🎭 Facades meneruskan ke service container -> 🧑‍💼 Service Container memberikan layanan cache -> ✅ Hasil dikembalikan ke kamu`

Tanpa facades, semua akses ke layanan bisa jadi rumit dan memakan tempat. 😵

### 2. ✍️ Resep Pertamamu: Menggunakan Facades dari Nol

Ini adalah fondasi paling dasar. Mari kita buat contoh penggunaan facades pertamamu dari nol, langkah demi langkah.

#### Langkah 1️⃣: Gunakan Facade yang Sudah Tersedia
**Mengapa?** Laravel sudah menyediakan banyak facades yang siap pakai untuk berbagai kebutuhan.

**Bagaimana?** Gunakan facade yang sesuai dengan kebutuhan kamu:
```php
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

// Gunakan cache untuk menyimpan dan mengambil data
Cache::put('user_count', 1000, now()->addMinutes(10));
$userCount = Cache::get('user_count');

// Gunakan database untuk query
$users = DB::table('users')->get();

// Gunakan log untuk mencatat aktivitas
Log::info('User accessed the dashboard', ['user_id' => $user->id]);
```

#### Langkah 2️⃣: Pahami Cara Menggunakannya di Route
**Mengapa?** Karena seringkali kamu akan menggunakan facades langsung di route atau controller.

**Bagaimana?** Di route atau controller:
```php
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;

Route::get('/cache', function () {
    // Ambil data dari cache
    $data = Cache::get('important_data', 'default_value');
    
    return response()->json(['data' => $data]);
});

// Di controller
class UserController extends Controller
{
    public function index()
    {
        // Gunakan facade di dalam controller
        $userCount = Cache::get('user_count');
        
        return view('users.index', compact('userCount'));
    }
}
```
**Penjelasan Kode:**
- `use Illuminate\Support\Facades\Cache;`: Kita mengimpor facade Cache
- `Cache::get('key')`: Kita mengakses metode get dari layanan cache dengan sintaks yang sangat sederhana
- `Cache::put('key', 'value', $ttl)`: Kita menyimpan data ke cache dengan waktu kadaluarsa

#### Langkah 3️⃣: Coba Berbagai Jenis Facades
**Mengapa?** Karena Laravel menyediakan banyak facade untuk berbagai kebutuhan.

**Bagaimana?** Coba berbagai facade yang sering digunakan:
```php
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

// Cek apakah user login
if (Auth::check()) {
    $user = Auth::user();
}

// Kirim email
Mail::to('user@example.com')->send(new WelcomeEmail($user));

// Simpan file ke storage
Storage::put('file.txt', 'konten file');

// Validasi data
$validator = Validator::make($request->all(), [
    'email' => 'required|email',
]);

Selesai! 🎉 Sekarang kamu sudah bisa menggunakan facades dengan mudah!
```

### 3. ⚡ Perbedaan dengan Tugas Biasa (Dependency Injection vs Facades)

**Analogi:** Bayangkan kamu memesan makanan.
- **Dependency Injection**: Seperti memesan dengan menyebutkan semua bahan dan cara pembuatan secara detail
- **Facades**: Seperti memesan dengan menyebutkan nama menu, dan koki tahu apa yang harus dilakukan

**Mengapa ini penting?** Karena kamu perlu tahu kapan menggunakan facades dan kapan menggunakan dependency injection.

---

## Bagian 2: Helper Functions - Kekuatan Ekstra! 🔧

### 4. 📦 Apa Itu Helper Functions?

**Analogi:** Jika facades adalah interkom ajaib, maka **helper functions itu seperti tombol pintas** di meja kerjamu. Tanpa harus mengambil interkom, kamu bisa langsung menekan tombol untuk mengakses fungsi penting.

**Mengapa ini keren?** Karena helper functions adalah fungsi global yang bisa kamu gunakan tanpa harus mengimpor kelas terlebih dahulu.

**Bagaimana?** Laravel menyediakan banyak helper functions yang setara dengan facades:

#### **4.1 Helper Functions yang Sering Digunakan**
```php
// Dengan facade
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Config;

return View::make('profile');
return Response::json(['data' => $data]);
return URL::to('/home');
return Config::get('app.name');

// Dengan helper functions (tidak perlu import!)
return view('profile');
return response()->json(['data' => $data]);
return url('/home');
return config('app.name');
```

#### **4.2 Perbandingan Lengkap**
| Facade | Helper Function | Kegunaan |
|--------|----------------|----------|
| `View::make()` | `view()` | Membuat view |
| `Response::json()` | `response()->json()` | Membuat response JSON |
| `URL::to()` | `url()` | Membuat URL |
| `Config::get()` | `config()` | Mengambil konfigurasi |
| `Storage::put()` | `storage_path()` | Mendapatkan path storage |
| `Hash::make()` | `bcrypt()` | Hash password |
| `Str::slug()` | `Str::of()->slug()` atau `str()` | Manipulasi string |

**Contoh Penggunaan Lengkap:**
```php
// Di controller
class UserController extends Controller
{
    public function show($id)
    {
        // Menggunakan helper functions (tidak perlu import!)
        $user = User::find($id);
        
        // Buat response menggunakan helper
        if (!$user) {
            return response()->json([
                'error' => 'User not found'
            ], 404);
        }
        
        // Gunakan helper untuk manipulasi data
        $profileUrl = url('/profile/' . $user->id);
        $appName = config('app.name');
        
        return response()->json([
            'user' => $user,
            'profile_url' => $profileUrl,
            'app_name' => $appName
        ]);
    }
    
    public function create()
    {
        // Gunakan helper untuk buat view
        return view('users.create', [
            'page_title' => 'Create User',
            'back_url' => url()->previous()
        ]);
    }
}
```

### 5. 💡 Kapan Menggunakan Helper Functions?

**Analogi:** Seperti memilih antara mengambil buku dari rak yang mudah dijangkau (helper) atau mengambil dari tempat yang lebih jauh tapi lebih lengkap (facade).

**Mengapa?** Karena kamu butuh tahu kapan helper lebih cocok digunakan.

**Kapan menggunakan helper functions?**
- Saat kamu hanya perlu fungsi dasar
- Di dalam route atau controller di mana kamu perlu singkat
- Jika kamu tidak perlu metode kompleks dari facade
- Untuk fungsi-fungsi dasar seperti `view()`, `response()`, `config()`, `url()`, dll

**Contoh:**
```php
// ✅ Bagus: Menggunakan helper untuk fungsi dasar
Route::get('/users', function () {
    $users = DB::table('users')->get();
    return view('users.index', compact('users'));
});

// ✅ Bagus: Menggunakan helper untuk response
Route::post('/users', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string',
        'email' => 'required|email|unique:users',
    ]);
    
    $user = User::create($validated);
    return response()->json($user);
});

// ❌ Kurang ideal: Jika kamu perlu banyak metode dari facade
// Akan lebih baik menggunakan facade langsung
```

---

## Bagian 3: Menguasai Berbagai Jenis Facades 🎯

### 6. 👨‍👩‍👧 Facades Umum dalam Laravel

**Analogi:** Seperti memiliki buku panduan lengkap untuk semua departemen di hotel - kamu tahu siapa yang harus kamu hubungi untuk setiap kebutuhan.

**Mengapa?** Karena kamu perlu tahu facade mana yang cocok untuk kebutuhan tertentu.

**Bagaimana?** Mari kita lihat berbagai facade dan kegunaannya:

#### **6.1 Facades untuk Database dan Cache**
```php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

// Query database
$users = DB::table('users')->where('active', true)->get();
$totalUsers = DB::table('users')->count();

// Cache data
Cache::put('user_count', $totalUsers, now()->addMinutes(15));
$cachedCount = Cache::get('user_count', 0);

// Cek atau ubah struktur database
if (Schema::hasTable('users')) {
    $columns = Schema::getColumnListing('users');
}
```

#### **6.2 Facades untuk Authentication dan Authorization**
```php
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

// Cek apakah user login
if (Auth::check()) {
    $user = Auth::user();
    $userId = Auth::id();
}

// Cek izin (permission)
if (Gate::allows('update', $post)) {
    // Pengguna diizinkan untuk update post
}

// Cek apakah user punya role
if (Auth::user()->hasRole('admin')) {
    // Lakukan tindakan admin
}
```

#### **6.3 Facades untuk Logging dan Error Handling**
```php
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Artisan;

// Log berbagai level
Log::info('User logged in', ['user_id' => $user->id]);
Log::warning('This is a warning');
Log::error('An error occurred', ['exception' => $e->getMessage()]);

// Jalankan perintah artisan lewat kode
Artisan::call('cache:clear');
$output = Artisan::output();
```

#### **6.4 Facades untuk Storage dan File**
```php
use Illuminate\Support\Facades\Storage;

// Simpan file
Storage::put('file.txt', 'isi file');

// Baca file
$contents = Storage::get('file.txt');

// Cek apakah file ada
if (Storage::exists('file.txt')) {
    // Lakukan sesuatu
}

// Upload file dari request
Storage::putFile('photos', $request->file('photo'));

// Gunakan disk tertentu
Storage::disk('s3')->put('remote-file.txt', 'isi');
```

#### **6.5 Facades untuk Queue dan Event**
```php
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Event;

// Kirim job ke queue
Queue::push(new ProcessPodcast($podcast));

// Cek status queue
if (Queue::connection('redis')->readyNow() > 0) {
    // Ada job yang siap diproses
}

// Fire event
Event::dispatch(new UserRegistered($user));

// Cek listener
Event::listen('user.login', function ($user) {
    // Tangani event login user
});
```

---

## Bagian 4: Cara Kerja Facades di Balik Layar ⚙️

### 7. 🧩 Mekanisme Kerja Facades

**Analogi:** Seperti memiliki sistem telekomunikasi yang canggih di balik interkom ajaibmu - setiap kali kamu menekan tombol, sistem secara otomatis tahu ke mana harus mengirimkan pesan dan bagaimana cara menghubungi layanan yang benar.

**Mengapa ini penting?** Karena kamu perlu tahu bagaimana Laravel membuat facades bisa bekerja secara "statis" padahal sebenarnya mereka mengakses layanan yang diinstantiasi.

**Bagaimana sebenarnya cara kerjanya?** Mari kita lihat dari dalam:

#### **7.1 Implementasi Dasar Facade**
```php
<?php

namespace Illuminate\Support\Facades;

class Cache extends Facade
{
    /**
     * Dapatkan binding key untuk service container
     */
    protected static function getFacadeAccessor()
    {
        return 'cache'; // Ini mengarah ke binding 'cache' di service container
    }
}

// Kelas dasar Facade (sederhana)
abstract class Facade
{
    public static function __callStatic($method, $args)
    {
        // Mendapatkan instance dari service container
        $instance = static::resolveFacadeInstance(static::getFacadeAccessor());
        
        // Memanggil metode pada instance tersebut
        return $instance->$method(...$args);
    }
    
    protected static function resolveFacadeInstance($name)
    {
        // Ambil dari service container
        return app($name);
    }
}
```

#### **7.2 Proses Eksekusi Facade**
Saat kamu menulis `Cache::get('key')`, berikut yang terjadi:

1. PHP memanggil metode `__callStatic()` karena `get()` tidak didefinisikan secara statis di kelas `Cache`
2. `__callStatic()` memanggil `getFacadeAccessor()` yang mengembalikan `'cache'`
3. Facade mengambil instance layanan cache dari service container menggunakan key `'cache'`
4. Facade memanggil metode `get('key')` pada instance cache tersebut
5. Hasilnya dikembalikan ke kamu

### 8. 🛠️ Membuat Facade Kustom

**Analogi:** Seperti menambahkan tombol baru di interkommu untuk layanan yang kamu buat sendiri.

**Mengapa ini berguna?** Karena kamu bisa membuat facade untuk layanan buatanmu sendiri agar mudah digunakan.

**Bagaimana?** Mari buat contoh facade kustom:

#### **8.1 Buat Layanan Kustom**
```php
<?php
// app/Services/NotificationService.php

namespace App\Services;

class NotificationService
{
    public function sendWelcomeNotification($user)
    {
        // Logika kirim notifikasi
        return "Welcome notification sent to {$user->name}";
    }
    
    public function sendOrderConfirmation($order)
    {
        // Logika kirim konfirmasi order
        return "Order confirmation sent for order #{$order->id}";
    }
}
```

#### **8.2 Daftarkan di Service Container**
```php
<?php
// app/Providers/AppServiceProvider.php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\NotificationService;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Daftarkan binding untuk layanan kita
        $this->app->singleton('notification-service', function ($app) {
            return new NotificationService();
        });
    }
}
```

#### **8.3 Buat Facade Kustom**
```php
<?php
// app/Support/Facades/NotificationServiceFacade.php

namespace App\Support\Facades;

use Illuminate\Support\Facades\Facade;

class NotificationServiceFacade extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'notification-service'; // Sesuai dengan binding di atas
    }
}
```

#### **8.4 Gunakan di Konfigurasi**
```php
<?php
// config/app.php

'aliases' => [
    // ... aliases lainnya
    'NotificationService' => App\Support\Facades\NotificationServiceFacade::class,
],
```

#### **8.5 Gunakan Facade Kustom**
```php
use NotificationService;

// Di controller atau tempat lain
class UserController extends Controller
{
    public function register(Request $request)
    {
        $user = User::create($request->validated());
        
        // Gunakan facade kustom kita
        $result = NotificationService::sendWelcomeNotification($user);
        
        return response()->json([
            'message' => 'User created',
            'notification_result' => $result
        ]);
    }
}
```

---

## Bagian 5: Real-Time Facades - Kekuatan Ekstra! ⚡

### 9. 🚀 Apa Itu Real-Time Facades?

**Analogi:** Bayangkan kamu bisa membuat tombol pintas untuk **apa pun** yang ada di aplikasimu, bahkan kelas yang baru saja kamu buat, tanpa harus membuat facade secara manual!

**Mengapa ini keren?** Karena kamu bisa menggunakan kelas biasa seolah-olah itu adalah facade, membuatnya sangat mudah diakses dan ditest.

**Bagaimana?** Gunakan prefix `Facades\` sebelum namespace kelas yang ingin kamu jadikan facade.

#### **9.1 Perbandingan Sebelum dan Sesudah Real-Time Facades**

**Sebelum (tanpa real-time facades):**
```php
<?php

namespace App\Models;

use App\Contracts\Publisher;
use Illuminate\Database\Eloquent\Model;

class Podcast extends Model
{
    public function publish(Publisher $publisher): void
    {
        $this->update(['publishing' => now()]);
        $publisher->publish($this);
    }
}
```

**Sesudah (dengan real-time facades):**
```php
<?php

namespace App\Models;

use Facades\App\Contracts\Publisher;
use Illuminate\Database\Eloquent\Model;

class Podcast extends Model
{
    public function publish(): void
    {
        $this->update(['publishing' => now()]);
        
        // Lihat betapa bersihnya! Tidak perlu dependency injection
        Publisher::publish($this);
    }
}
```

#### **9.2 Keuntungan Real-Time Facades**
```php
// Contoh kelas service kompleks
namespace App\Services;

class OrderProcessor
{
    public function processPayment($order, $paymentMethod)
    {
        // Logika proses pembayaran
        return true;
    }
    
    public function sendConfirmation($order)
    {
        // Logika kirim konfirmasi
    }
    
    public function updateInventory($order)
    {
        // Logika update inventory
    }
}

// Di model (dengan real-time facade)
use Facades\App\Services\OrderProcessor;

class Order extends Model
{
    public function completeOrder()
    {
        // Semua akses ke layanan jadi sangat mudah!
        if (OrderProcessor::processPayment($this, $this->payment_method)) {
            OrderProcessor::sendConfirmation($this);
            OrderProcessor::updateInventory($this);
            $this->update(['status' => 'completed']);
        }
    }
}
```

### 10. 🧪 Testing dengan Real-Time Facades

**Analogi:** Seperti memiliki simulator interkom yang bisa kamu atur sesuai kebutuhan untuk testing, tanpa harus menghubungkan ke layanan aslinya.

**Mengapa ini hebat?** Karena kamu bisa mock layanan dengan sangat mudah menggunakan real-time facades.

#### **10.1 Testing Biasa vs Real-Time Facades**
**Testing dengan dependency injection (lama):**
```php
public function test_podcast_can_be_published()
{
    // Buat mock
    $publisher = $this->createMock(Publisher::class);
    $publisher->expects($this->once())
              ->method('publish')
              ->with($this->isInstanceOf(Podcast::class));

    // Gunakan mock di constructor atau inject
    $podcast = new Podcast();
    $podcast->publish($publisher);
}
```

**Testing dengan real-time facades (baru dan lebih mudah):**
```php
use Facades\App\Contracts\Publisher;

public function test_podcast_can_be_published()
{
    $podcast = Podcast::factory()->create();

    // Mudah sekali untuk mock!
    Publisher::shouldReceive('publish')
             ->once()
             ->with($podcast);

    $podcast->publish();
}
```

#### **10.2 Contoh Lengkap Testing dengan Real-Time Facades**
```php
<?php

namespace Tests\Unit;

use App\Models\Order;
use Facades\App\Services\OrderProcessor;
use Tests\TestCase;

class OrderTest extends TestCase
{
    /** @test */
    public function it_completes_order_successfully()
    {
        $order = Order::factory()->create();

        // Mock semua metode yang akan dipanggil
        OrderProcessor::shouldReceive('processPayment')
                      ->once()
                      ->with($order, $order->payment_method)
                      ->andReturn(true);

        OrderProcessor::shouldReceive('sendConfirmation')
                      ->once()
                      ->with($order);

        OrderProcessor::shouldReceive('updateInventory')
                      ->once()
                      ->with($order);

        $order->completeOrder();

        $this->assertEquals('completed', $order->fresh()->status);
    }

    /** @test */
    public function it_handles_payment_failure()
    {
        $order = Order::factory()->create();

        OrderProcessor::shouldReceive('processPayment')
                      ->once()
                      ->andReturn(false);

        // Pastikan metode lain tidak dipanggil
        OrderProcessor::shouldNotReceive('sendConfirmation');
        OrderProcessor::shouldNotReceive('updateInventory');

        $order->completeOrder();

        $this->assertNotEquals('completed', $order->fresh()->status);
    }
}
```

---

## Bagian 6: Best Practices dan Pertimbangan Penting 🎯

### 11. ✅ Kapan Menggunakan Facades?

**Analogi:** Seperti memilih antara menggunakan mobil pribadi (facades) atau menggunakan layanan transportasi umum (dependency injection) - keduanya bagus, tapi situasi yang berbeda membutuhkan pilihan yang berbeda.

**Mengapa ini penting?** Karena kamu perlu tahu kapan facade adalah pilihan terbaik dan kapan bukan.

#### **11.1 Kapan Menggunakan Facades**
✅ **Gunakan facades ketika:**
- Kamu di dalam route atau controller dan hanya perlu fungsi dasar
- Kamu ingin kode lebih ringkas dan mudah dibaca
- Kamu bekerja dengan fungsi statis yang tidak perlu instance spesifik
- Kamu menggunakan real-time facades untuk testing yang mudah
- Kamu tidak perlu bergantung pada kontrak spesifik

**Contoh yang bagus:**
```php
Route::get('/dashboard', function () {
    // Ringkas dan jelas
    $userCount = Cache::get('user_count', DB::table('users')->count());
    $notifications = Auth::user()->notifications()->latest()->take(5)->get();
    
    return view('dashboard', compact('userCount', 'notifications'));
});
```

#### **11.2 Kapan TIDAK Menggunakan Facades**
❌ **Hindari facades ketika:**
- Kamu membangun kelas library yang akan digunakan di aplikasi lain
- Kamu ingin memudahkan mocking dalam testing yang kompleks
- Kamu sedang membangun service layer yang harus fleksibel
- Kamu perlu mengganti implementasi dengan mudah

**Contoh yang kurang ideal:**
```php
class PaymentService 
{
    public function process() 
    {
        // Ini membuat kelas terikat pada implementasi spesifik
        $gateway = \Illuminate\Support\Facades\Config::get('payment.default_gateway');
        $logger = \Illuminate\Support\Facades\Log::info('Processing payment...');
        
        // Akan sulit untuk diganti implementasinya
    }
}
```

**Alternatif yang lebih baik:**
```php
class PaymentService 
{
    public function __construct(
        protected PaymentGatewayInterface $gateway,
        protected LoggerInterface $logger
    ) {}
    
    public function process() 
    {
        // Ini lebih fleksibel dan mudah di-test
        $this->logger->info('Processing payment...');
        return $this->gateway->charge($amount);
    }
}
```

### 12. 🧪 Testing dengan Facades

**Analogi:** Seperti memiliki kemampuan untuk membuka interkommu dan mengganti suara yang keluar tanpa harus mengganti sistem interkom itu sendiri.

**Mengapa ini penting?** Karena kamu harus bisa menguji kode yang menggunakan facades dengan mudah.

#### **12.1 Mocking Facades**
```php
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

public function test_api_returns_cached_data()
{
    // Mock facade Cache
    Cache::shouldReceive('get')
         ->with('api-data')
         ->andReturn(['cached' => 'data']);

    $response = $this->get('/api/data');

    $response->assertJson(['cached' => 'data']);
    
    // Verifikasi bahwa cache benar-benar diakses
    Cache::shouldHaveReceived('get')->with('api-data');
}
```

#### **12.2 Partial Mocking**
```php
use Illuminate\Support\Facades\Auth;

public function test_user_can_access_restricted_area()
{
    // Mock hanya metode tertentu
    Auth::shouldReceive('check')
        ->andReturn(true);
        
    Auth::shouldReceive('user')
        ->andReturn(User::factory()->make());

    $response = $this->get('/restricted');

    $response->assertStatus(200);
}
```

#### **12.3 Testing Helper Functions**
Helper functions juga bisa di-test dengan mudah, terutama fungsi yang bisa di-swap:

```php
// Dalam kelas kamu
class UserService 
{
    public function getGravatarUrl($email) 
    {
        // Banyak helper tidak bisa dimock
        // Tapi kamu bisa buat wrapper
        return 'https://www.gravatar.com/avatar/' . md5(strtolower(trim($email)));
    }
}

// Atau buat sebagai dependency
interface GravatarServiceInterface 
{
    public function getAvatarUrl($email);
}

class GravatarService implements GravatarServiceInterface 
{
    public function getAvatarUrl($email) 
    {
        return 'https://www.gravatar.com/avatar/' . md5(strtolower(trim($email)));
    }
}

// Di service
class UserService 
{
    public function __construct(
        protected GravatarServiceInterface $gravatarService
    ) {}
    
    public function getGravatarUrl($email) 
    {
        return $this->gravatarService->getAvatarUrl($email);
    }
}
```

### 13. 🚨 Potensi Masalah dan Cara Menghindarinya

#### **13.1 Scope Cr

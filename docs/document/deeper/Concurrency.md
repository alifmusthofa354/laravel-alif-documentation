# 🚀 Concurrency di Laravel: Panduan Lengkap dari Guru Kesayanganmu (Edisi Performa Maksimal)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel yang super seru. Hari ini kita akan membahas salah satu fitur canggih yang bisa membuat aplikasimu **cepat seperti kilat** - yaitu **Concurrency**. Siapkan otakmu, karena kita akan mengeksplorasi cara bagaimana Laravel bisa menjalankan banyak tugas sekaligus seperti seorang ahli sulap performa! 🧙‍♂️

Di edisi ini, kita akan kupas tuntas **semua detail** tentang Concurrency, tapi setiap topik akan Guru ajarkan dengan sabar. Siap? Ayo kita mulai petualangan performa ini!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Concurrency Itu Sebenarnya?

**Analogi:** Bayangkan kamu seorang manajer restoran yang sibuk. Kamu butuh menghitung jumlah piring, gelas, dan sendok yang tersedia. Kalau kamu hitung satu per satu, satu persatu, itu akan memakan waktu lama. Tapi, bayangkan kalau kamu punya beberapa asisten yang bisa menghitung semuanya **secara bersamaan** - piring dihitung oleh asisten A, gelas oleh asisten B, dan sendok oleh asisten C. Hasilnya? Dapat dalam waktu yang jauh lebih cepat!

**Mengapa ini penting?** Karena dalam dunia pemrograman, seringkali kita punya beberapa tugas berat yang bisa dijalankan secara **paralel** (bersamaan) tanpa saling menggantung. Jika kita jalanin satu per satu, aplikasi jadi lambat. Tapi kalau kita jalankan bersamaan... KERENNYA LUAR BIASA! ⚡

**Bagaimana cara kerjanya?** Laravel dengan Concurrency-nya akan:
1.  **Mengirimkan tugas-tugas berat** ke beberapa "asisten virtual" (proses PHP terpisah).
2.  **Setiap asisten mengerjakan tugasnya sendiri** tanpa saling menunggu.
3.  **Mengumpulkan semua hasil** dari para asisten dan memberikannya kepadamu dalam satu wadah.

Jadi, alur kerja (workflow) aplikasimu menjadi sangat efisien:

`➡️ Tugas Berat -> 🚀 Concurrency (Kirim ke banyak proses) -> 💪 Setiap Proses Kerja Sendiri -> ✅ Kumpulkan Hasil -> 🎉 Kembalikan ke Aplikasi`

Tanpa Concurrency, semua tugas harus dikerjakan berurutan, dan itu adalah mimpi buruk untuk performa. 😵

### 2. ✍️ Resep Pertamamu: Menjalankan Tugas Secara Bersamaan

Ini adalah fondasi paling dasar. Mari kita buat contoh sederhana untuk memahami bagaimana Concurrency bekerja, langkah demi langkah.

#### Langkah 1️⃣: Siapkan Tugas-tugas yang Bisa Dikerjakan Bersamaan
**Mengapa?** Kita butuh beberapa tugas yang tidak saling bergantung (independent) agar bisa dikerjakan paralel.

**Bagaimana?** Misalnya kita ingin menghitung jumlah user dan order dalam database kita:
```php
use Illuminate\Support\Facades\Concurrency;
use Illuminate\Support\Facades\DB;

// Kita punya dua tugas:
// 1. Hitung user: DB::table('users')->count()
// 2. Hitung order: DB::table('orders')->count()
// Kedua tugas ini tidak saling bergantung, jadi bisa dikerjakan bersamaan!
[$userCount, $orderCount] = Concurrency::run([
    fn () => DB::table('users')->count(),    // Tugas 1
    fn () => DB::table('orders')->count(),   // Tugas 2
]);

echo "Jumlah User: $userCount, Jumlah Order: $orderCount";
```

#### Langkah 2️⃣: Bandingkan dengan Eksekusi Berurutan
**Mengapa?** Agar kamu paham betapa hebatnya Concurrency.

**Bagaimana?** Lihat perbedaan eksekusi biasa vs Concurrency:
```php
// Eksekusi berurutan (lama!)
$start = microtime(true);

$userCount = DB::table('users')->count();
$orderCount = DB::table('orders')->count();

$end = microtime(true);
echo "Waktu eksekusi berurutan: " . ($end - $start) . " detik\n";

// Eksekusi konkuren (cepat!)
$start = microtime(true);

[$userCount, $orderCount] = Concurrency::run([
    fn () => DB::table('users')->count(),
    fn () => DB::table('orders')->count(),
]);

$end = microtime(true);
echo "Waktu eksekusi konkuren: " . ($end - $start) . " detik\n";
```
**Penjelasan Kode:**
- `$userCount, $orderCount = ...`: Kita menerima hasil dari masing-masing tugas dalam urutan yang sama dengan penulisan tugasnya.
- `Concurrency::run([...])`: Ini adalah mantra ajaib yang membuat semua tugas dalam array dikerjakan bersamaan oleh para "asisten virtual" Laravel.

#### Langkah 3️⃣: Pahami Perbedaannya
Concurrency sangat efektif ketika tugas-tugas yang dijalankan:
- **Tidak saling bergantung** (independent)
- **Memerlukan waktu lama** jika dijalankan berurutan
- **Tidak memanipulasi resource bersama** secara langsung

Selesai! 🎉 Sekarang kamu sudah tahu dasar dari Concurrency!

### 3. ⚡ Perbedaan dengan Task Lain: Async vs Concurrent

**Analogi:** Bayangkan kamu makan di restoran cepat saji. 
- **Async** seperti memesan sesuatu, lalu menunggu di luar sambil mengerjakan hal lain, baru kembali saat pesanan datang.
- **Concurrent** seperti memesan beberapa makanan sekaligus, dan semua dimasak bersamaan di dapur, lalu datang bersamaan juga.

**Mengapa ini penting?** Karena Async dan Concurrent punya tujuan yang berbeda dalam dunia Laravel.
- **Async**: Cocok untuk tugas yang bisa dikerjakan "nanti" tanpa menghentikan alur utama (misalnya: kirim email).
- **Concurrent**: Cocok untuk tugas-tugas yang HARUS selesai di tempat dan waktu yang sama untuk melanjutkan alur (misalnya: ambil data dari beberapa API untuk satu halaman).

---

## Bagian 2: Driver Concurrency - Pilihan Mesin Performamu 🏎️

### 4. 📦 Apa Itu Driver Concurrency?

**Analogi:** Bayangkan kamu punya beberapa mobil untuk mengantar barang. Masing-masing mobil punya kelebihan dan kekurangan. Ada yang irit, ada yang cepat, ada yang hanya bisa jalan di jalan tertentu. **Driver Concurrency itu seperti pilihan mobil performa-mu di Laravel**.

**Mengapa ini keren?** Karena kamu bisa memilih cara yang paling cocok dengan lingkungan aplikasimu.

**Bagaimana?** Laravel menyediakan beberapa driver yang bisa kamu gunakan: `process`, `fork`, dan `sync`.

### 5. 🔄 Driver Proses (Process) - Mesin Andalan

**Analogi:** Ini seperti mengirimkan setiap tugas ke truk pengiriman yang berbeda. Setiap truk punya mesin sendiri dan mengerjakan tugasnya sendiri.

**Bagaimana?** Ini adalah driver default yang paling aman.
```php
use Illuminate\Support\Facades\Concurrency;

// Gunakan driver process secara eksplisit
$results = Concurrency::driver('process')->run([
    fn () => DB::table('users')->count(),
    fn () => DB::table('orders')->count(),
]);

// Atau gunakan default (sudah process)
[$userCount, $orderCount] = Concurrency::run([
    fn () => DB::table('users')->count(),
    fn () => DB::table('orders')->count(),
]);
```
**Kelebihan:**
- **Paling stabil** dan aman
- Bekerja di semua lingkungan (HTTP & CLI)
- **Pemisahan proses penuh** (tidak ada pembagian memory)

**Kekurangan:**
- **Lebih lambat** dibanding driver lain karena overhead pembuatan proses baru

### 6. ⚡ Driver Fork - Mesin Super Cepat (CLI Saja!)

**Analogi:** Ini seperti membuat bayangan dari dirimu sendiri, dan setiap bayangan mengerjakan tugas yang sama tapi jauh lebih cepat karena mereka berasal dari satu bentuk asli.

**Bagaimana?** Ini driver yang paling cepat, tapi hanya bisa digunakan di lingkungan CLI.
```bash
# Sebelum menggunakan driver ini, kamu harus install dependency-nya
composer require spatie/fork
```

```php
use Illuminate\Support\Facades\Concurrency;

// Gunakan driver fork (hanya di CLI environment!)
$results = Concurrency::driver('fork')->run([
    fn () => DB::table('users')->count(),
    fn () => DB::table('orders')->count(),
]);
```

**Kelebihan:**
- **Performa terbaik** karena tidak membuat proses baru dari awal
- **Share memory space** dengan proses utama (copy-on-write)

**Kekurangan:**
- **Hanya bisa digunakan di CLI** (command line interface)
- PHP tidak mendukung forking di request HTTP biasa
- **Butuh dependency tambahan**

**Contoh Implementasi di CLI Command:**
```php
<?php
// app/Console/Commands/ProcessMetricsCommand.php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Concurrency;
use Illuminate\Support\Facades\DB;

class ProcessMetricsCommand extends Command
{
    protected $signature = 'metrics:process';
    protected $description = 'Process metrics concurrently using fork driver';

    public function handle()
    {
        // Di lingkungan CLI, kita bisa gunakan driver fork untuk performa maksimal
        Concurrency::driver('fork');
        
        $this->info('Processing metrics concurrently...');
        
        [$userCount, orderCount, $productCount] = Concurrency::run([
            fn () => DB::table('users')->count(),
            fn () => DB::table('orders')->count(),
            fn () => DB::table('products')->count(),
        ]);

        $this->info("Users: $userCount");
        $this->info("Orders: $orderCount");
        $this->info("Products: $productCount");
    }
}
```

### 7. 🧪 Driver Sync - Mesin Debugging

**Analogi:** Ini seperti kamu mengerjakan semua tugas sendiri, satu per satu, tanpa bantuan asisten. Tidak cepat, tapi kamu bisa mengontrol semuanya.

**Bagaimana?** Driver ini sangat berguna saat testing, karena menonaktifkan semua concurrency dan menjalankan tugas secara berurutan.
```php
use Illuminate\Support\Facades\Concurrency;

// Gunakan driver sync untuk testing
Concurrency::driver('sync');

$results = Concurrency::run([
    fn () => DB::table('users')->count(),
    fn () => DB::table('orders')->count(),
]);

// Sekarang semua tugas dikerjakan secara berurutan (tidak konkuren)
```

**Kelebihan:**
- **Sangat berguna untuk testing** karena tidak ada faktor eksternal
- **Mudah untuk debugging** karena eksekusi sekuensial
- **Tidak butuh dependency tambahan**

**Kekurangan:**
- **Tidak memberikan manfaat performa** karena tidak konkuren

### 8. 🛠️ Mengatur Driver Default

Kamu bisa mengatur driver default yang akan digunakan di seluruh aplikasimu:

1. **Publikasikan konfigurasi:**
```bash
php artisan config:publish concurrency
```

2. **Atur driver default di file konfigurasi:**
```php
// config/concurrency.php
return [
    'default' => env('CONCURRENCY_DRIVER', 'process'),
    
    'drivers' => [
        'process' => [
            'timeout' => 60,
        ],
        'fork' => [
            'timeout' => 60,
        ],
        'sync' => [
            'timeout' => 60,
        ],
    ],
];
```

3. **Atur di environment:**
```env
CONCURRENCY_DRIVER=fork
```

Perhatikan bahwa kamu juga bisa mengatur timeout untuk masing-masing driver, agar proses tidak berjalan terlalu lama.

---

## Bagian 3: Jurus Tingkat Lanjut - Penggunaan Concurrency yang Efektif 🚀

### 9. 👨‍👩‍👧 Menangani Hasil dari Tugas Konkuren

**Analogi:** Setelah semua asisten selesai bekerja, kamu harus mengumpulkan semua hasilnya dengan rapi agar bisa digunakan lebih lanjut.

**Mengapa?** Karena hasil dari Concurrency::run() adalah array yang berisi output dari setiap closure dalam urutan yang sama.

**Bagaimana?** Gunakan array destructuring untuk mengambil hasil:
```php
use Illuminate\Support\Facades\Concurrency;
use Illuminate\Support\Facades\Http;

[$userData, $orderData, $inventoryData] = Concurrency::run([
    fn () => Http::get('https://api.example.com/users')->json(),
    fn () => Http::get('https://api.example.com/orders')->json(),
    fn () => Http::get('https://api.example.com/inventory')->json(),
]);

// Sekarang kita bisa gunakan semua data ini
foreach ($userData as $user) {
    // Proses data user
}

foreach ($orderData as $order) {
    // Proses data order
}

foreach ($inventoryData as $item) {
    // Proses data inventory
}
```

**Contoh Lengkap dengan Error Handling:**
```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Concurrency;
use Illuminate\Support\Facades\Http;

class ExternalDataService
{
    public function fetchAllData(): array
    {
        $results = Concurrency::run([
            fn () => $this->fetchWithRetry('https://api.example.com/users'),
            fn () => $this->fetchWithRetry('https://api.example.com/orders'),
            fn () => $this->fetchWithRetry('https://api.example.com/inventory'),
        ]);

        // Pastikan kita punya 3 hasil
        if (count($results) !== 3) {
            throw new \Exception('Gagal mengambil semua data eksternal');
        }

        return $results;
    }

    private function fetchWithRetry(string $url, int $maxRetries = 3): array
    {
        $retries = 0;
        
        do {
            try {
                $response = Http::timeout(10)->get($url);
                
                if ($response->successful()) {
                    return $response->json();
                }
                
                $retries++;
                sleep(1); // Tunggu 1 detik sebelum retry
            } catch (\Exception $e) {
                $retries++;
                sleep(1);
            }
        } while ($retries < $maxRetries);

        // Jika semua retry gagal, lempar exception
        throw new \Exception("Gagal mengambil data dari $url setelah $maxRetries percobaan");
    }
}
```

### 10. 🎨 Menunda Eksekusi Tugas (Defer)

**Analogi:** Bayangkan kamu sedang melayani pelanggan di kasir. Kamu sudah selesai melayani, tapi masih punya beberapa laporan yang perlu dikirim ke atasan. Kamu bisa kirim laporan itu sekarang (akan memperlambat pelanggan berikutnya), atau kirim nanti saat sedang sepi (tidak mengganggu layanan).

**Mengapa?** Kadang kita ingin menjalankan beberapa tugas yang tidak kritis tanpa memperlambat respon ke pengguna.

**Bagaimana?** Gunakan metode `defer`:
```php
use App\Services\Metrics;
use Illuminate\Support\Facades\Concurrency;

// Ini akan segera selesai tanpa menunggu pelaporan selesai
Concurrency::defer([
    fn () => Metrics::report('users'),
    fn () => Metrics::report('orders'),
    fn () => Metrics::report('revenue'),
]);

// Respon langsung dikirim ke pengguna, meskipun laporan masih berjalan di belakang layar
return response()->json(['status' => 'success']);
```

**Contoh Implementasi di Controller:**
```php
<?php

namespace App\Http\Controllers;

use App\Services\Metrics;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Concurrency;

class OrderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // Proses order secara normal
        $order = Order::create($request->validated());

        // Kita defer semua pelaporan dan analisis yang tidak kritis
        // agar respon cepat ke pengguna
        Concurrency::defer([
            fn () => Metrics::report('new_orders', 1),
            fn () => AnalyticsService::analyzeOrder($order),
            fn () => NotificationService::sendOrderNotification($order),
        ]);

        // Kembalikan respon secepat mungkin
        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order
        ]);
    }
}
```

### 11. 🧩 Kombinasi Concurrency dengan Jobs

**Mengapa?** Kadang kamu ingin manfaatkan kekuatan Concurrency tapi tetap dalam kerangka Queue Laravel.

**Bagaimana?** Kamu bisa menggunakan Concurrency di dalam Job:
```php
<?php

namespace App\Jobs;

use App\Services\ReportGenerator;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Concurrency;

class GenerateComplexReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(ReportGenerator $reportGenerator): void
    {
        // Dalam job ini, kita bisa gunakan Concurrency untuk mempercepat
        // pengambilan dan pengolahan data yang independen
        [$salesData, $inventoryData, $customerData] = Concurrency::run([
            fn () => $reportGenerator->getSalesData(),
            fn () => $reportGenerator->getInventoryData(),
            fn () => $reportGenerator->getCustomerData(),
        ]);

        // Setelah semua data ada, lanjutkan dengan proses yang tergantung
        $finalReport = $reportGenerator->combineAndAnalyze($salesData, $inventoryData, $customerData);

        // Simpan atau kirim laporan
        $reportGenerator->saveReport($finalReport);
    }
}
```

### 12. 🌐 Concurrency dalam API Context

**Mengapa?** Dalam API, respons cepat sangat penting untuk pengalaman pengguna dan performa sistem.

**Bagaimana?** Gunakan Concurrency untuk mengambil data dari berbagai sumber secara efisien:
```php
<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Concurrency;
use Illuminate\Support\Facades\Http;

class DashboardController extends Controller
{
    public function getMetrics(): JsonResponse
    {
        // Ambil semua data secara konkuren untuk respons cepat
        [$userCount, $orderCount, $revenue, $topProducts] = Concurrency::run([
            fn () => DB::table('users')->count(),
            fn () => DB::table('orders')->count(),
            fn () => DB::table('orders')->sum('amount'),
            fn () => DB::table('order_items')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->select('products.name', DB::raw('SUM(order_items.quantity) as total_sold'))
                ->groupBy('products.id', 'products.name')
                ->orderByRaw('total_sold DESC')
                ->limit(5)
                ->get(),
        ]);

        return response()->json([
            'metrics' => [
                'total_users' => $userCount,
                'total_orders' => $orderCount,
                'total_revenue' => $revenue,
            ],
            'top_products' => $topProducts,
        ]);
    }

    public function getUserAnalytics(int $userId): JsonResource
    {
        $user = User::findOrFail($userId);

        [$orderHistory, $preferences, $engagement] = Concurrency::run([
            fn () => $user->orders()->with('items')->latest()->take(10)->get(),
            fn () => $user->preferences()->get(),
            fn () => $user->engagementMetrics()->get(),
        ]);

        return new UserAnalyticsResource([
            'user' => $user,
            'order_history' => $orderHistory,
            'preferences' => $preferences,
            'engagement' => $engagement,
        ]);
    }
}
```

### 13. 🔒 Handling Keamanan dan Isolasi

**Mengapa?** Karena Concurrency menjalankan closure di proses terpisah, kamu harus paham tentang pembagian data dan resource.

**Bagaimana?** Pastikan closure yang kamu buat bersifat stateless dan tidak bergantung pada data dari proses utama:
```php
use Illuminate\Support\Facades\Concurrency;

// ❌ Ini salah - bergantung pada variabel dari luar scope
$userId = auth()->id();
Concurrency::run([
    fn () => DB::table('orders')->where('user_id', $userId)->count(),  // $userId tidak tersedia di proses anak!
]);

// ✅ Ini benar - semua data dibutuhkan dimasukkan ke closure
Concurrency::run([
    fn () => DB::table('orders')->where('user_id', auth()->id())->count(),  // auth()->id() dipanggil di dalam closure
]);

// Atau, passing data secara eksplisit
$userId = auth()->id();
Concurrency::run([
    fn () => DB::table('orders')->where('user_id', $userId)->count(),  // Closure akan menangani serialisasi $userId
]);
```

**Contoh dengan Dependency Injection:**
```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Concurrency;

class DataAggregatorService
{
    public function getDashboardData(): array
    {
        // Karena kita tidak bisa inject service ke dalam closure proses anak,
        // pastikan kita hanya passing data mentah atau menggunakan facade
        $currentUserId = auth()->id();
        
        return Concurrency::run([
            fn () => $this->getPersonalOrders($currentUserId),
            fn () => $this->getPersonalRevenue($currentUserId),
            fn () => $this->getPersonalActivity($currentUserId),
        ]);
    }

    private function getPersonalOrders(int $userId): int
    {
        // Metode ini tidak bisa dipanggil langsung di closure karena proses terpisah
        return DB::table('orders')->where('user_id', $userId)->count();
    }
    
    // Kita buat versi yang bisa digunakan di dalam closure
    public function getPersonalOrdersForConcurrency(int $userId): int
    {
        return DB::table('orders')->where('user_id', $userId)->count();
    }
}
```

### 14. ⚡ Timeout & Error Handling

**Mengapa?** Karena dalam dunia nyata, tugas bisa gagal atau memakan waktu terlalu lama.

**Bagaimana?** Laravel menyediakan konfigurasi timeout dan kamu bisa handle error dengan try-catch:
```php
use Illuminate\Support\Facades\Concurrency;
use Illuminate\Support\Facades\Log;

try {
    $results = Concurrency::run([
        fn () => Http::timeout(5)->get('https://api.slow.com/users')->json(),
        fn () => Http::timeout(5)->get('https://api.slow.com/orders')->json(),
        fn () => Http::timeout(5)->get('https://api.slow.com/inventory')->json(),
    ]);
    
    return response()->json($results);
} catch (\Throwable $e) {
    // Log error
    Log::error('Concurrency task failed: ' . $e->getMessage());
    
    // Kembalikan respons default atau handle error dengan cara lain
    return response()->json([
        'error' => 'Gagal mengambil data',
        'default_data' => [
            'users' => [],
            'orders' => [],
            'inventory' => [],
        ]
    ]);
}
```

**Contoh dengan Custom Timeout per Driver:**
```php
// Konfigurasi timeout di config/concurrency.php
return [
    'default' => 'process',
    
    'drivers' => [
        'process' => [
            'timeout' => 30,  // 30 detik timeout untuk driver process
        ],
        'fork' => [
            'timeout' => 20,  // 20 detik timeout untuk driver fork
        ],
        'sync' => [
            'timeout' => 60,  // 60 detik timeout untuk driver sync
        ],
    ],
];
```

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Concurrency 🧰

### 15. 🏗️ Struktur Proyek dengan Concurrency

Agar kode kamu tetap rapi dan mudah dikelola, kamu bisa mengorganisir logika Concurrency ke dalam Service Classes:

**1. Service Class untuk Operasi Berat:**
```php
<?php
// app/Services/Analytics/PerformanceAnalyzer.php

namespace App\Services\Analytics;

use Illuminate\Support\Facades\Concurrency;
use Illuminate\Support\Facades\DB;

class PerformanceAnalyzer
{
    public function getPerformanceMetrics(): array
    {
        return Concurrency::run([
            fn () => $this->getUserGrowthMetrics(),
            fn () => $this->getRevenueMetrics(),
            fn () => $this->getEngagementMetrics(),
            fn () => $this->getConversionMetrics(),
        ]);
    }

    private function getUserGrowthMetrics(): array
    {
        return [
            'total_users' => DB::table('users')->count(),
            'new_users_today' => DB::table('users')->whereDate('created_at', now())->count(),
            'new_users_this_month' => DB::table('users')->whereMonth('created_at', now())->count(),
        ];
    }

    private function getRevenueMetrics(): array
    {
        return [
            'total_revenue' => DB::table('orders')->sum('amount'),
            'revenue_today' => DB::table('orders')->whereDate('created_at', now())->sum('amount'),
            'average_order_value' => DB::table('orders')->avg('amount'),
        ];
    }

    private function getEngagementMetrics(): array
    {
        return [
            'active_users_today' => DB::table('user_sessions')->whereDate('created_at', now())->count(),
            'total_pageviews' => DB::table('pageviews')->count(),
            'avg_session_duration' => DB::table('user_sessions')->avg('duration'),
        ];
    }

    private function getConversionMetrics(): array
    {
        return [
            'conversion_rate' => $this->calculateConversionRate(),
            'cart_abandonment_rate' => $this->calculateCartAbandonmentRate(),
            'checkout_completion_rate' => $this->calculateCheckoutCompletionRate(),
        ];
    }

    private function calculateConversionRate(): float
    {
        $visitors = DB::table('pageviews')->where('path', '/')->count();
        $orders = DB::table('orders')->count();
        return $visitors > 0 ? ($orders / $visitors) * 100 : 0;
    }

    private function calculateCartAbandonmentRate(): float
    {
        $carts = DB::table('shopping_carts')->count();
        $orders = DB::table('orders')->count();
        return $carts > 0 ? (($carts - $orders) / $carts) * 100 : 0;
    }

    private function calculateCheckoutCompletionRate(): float
    {
        $checkoutsStarted = DB::table('checkout_sessions')->count();
        $orders = DB::table('orders')->count();
        return $checkoutsStarted > 0 ? ($orders / $checkoutsStarted) * 100 : 0;
    }
}
```

**2. Controller Menggunakan Service:**
```php
<?php

namespace App\Http\Controllers;

use App\Services\Analytics\PerformanceAnalyzer;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    public function dashboard(PerformanceAnalyzer $analyzer): JsonResponse
    {
        [$userGrowth, $revenue, $engagement, $conversion] = $analyzer->getPerformanceMetrics();

        return response()->json([
            'user_growth' => $userGrowth,
            'revenue' => $revenue,
            'engagement' => $engagement,
            'conversion' => $conversion,
        ]);
    }
}
```

**3. Command Line Interface (CLI) untuk Analisis Berat:**
```php
<?php
// app/Console/Commands/AnalyzePerformanceCommand.php

namespace App\Console\Commands;

use App\Services\Analytics\PerformanceAnalyzer;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Concurrency;

class AnalyzePerformanceCommand extends Command
{
    protected $signature = 'analyze:performance';
    protected $description = 'Analyze performance metrics using concurrency';

    public function handle(PerformanceAnalyzer $analyzer)
    {
        $this->info('Starting performance analysis...');
        
        // Di CLI, kita bisa gunakan driver fork untuk performa maksimal
        Concurrency::driver('fork');
        
        $startTime = microtime(true);
        
        [$userGrowth, $revenue, $engagement, $conversion] = $analyzer->getPerformanceMetrics();

        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        $this->info("Performance analysis completed in {$executionTime} seconds");
        
        $this->table(['Metric', 'Value'], [
            ['Total Users', $userGrowth['total_users']],
            ['Revenue Today', $revenue['revenue_today']],
            ['Active Users Today', $engagement['active_users_today']],
            ['Conversion Rate', $conversion['conversion_rate'] . '%'],
        ]);
    }
}
```

### 16. 🧪 Testing Concurrency

Testing concurrency bisa tricky karena melibatkan proses terpisah, tapi kamu tetap bisa test logikanya.

**1. Unit Test dengan Mocking:**
```php
<?php

namespace Tests\Unit;

use App\Services\Analytics\PerformanceAnalyzer;
use Illuminate\Support\Facades\Concurrency;
use Tests\TestCase;

class PerformanceAnalyzerTest extends TestCase
{
    /** @test */
    public function it_returns_performance_metrics_using_concurrency()
    {
        // Mock Concurrency::run agar tidak benar-benar menjalankan proses
        Concurrency::shouldReceive('run')
            ->once()
            ->andReturn([
                ['total_users' => 1000, 'new_users_today' => 10],
                ['total_revenue' => 50000, 'revenue_today' => 1500],
                ['active_users_today' => 200, 'total_pageviews' => 5000],
                ['conversion_rate' => 2.5, 'cart_abandonment_rate' => 75.0],
            ]);

        $analyzer = new PerformanceAnalyzer();
        [$userGrowth, $revenue, $engagement, $conversion] = $analyzer->getPerformanceMetrics();

        $this->assertEquals(1000, $userGrowth['total_users']);
        $this->assertEquals(50000, $revenue['total_revenue']);
        $this->assertEquals(200, $engagement['active_users_today']);
        $this->assertEquals(2.5, $conversion['conversion_rate']);
    }
}
```

**2. Integration Test (untuk testing tanpa mocking):**
```php
<?php

namespace Tests\Feature;

use App\Services\Analytics\PerformanceAnalyzer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Concurrency;
use Tests\TestCase;

class PerformanceAnalyzerIntegrationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_processes_real_data_with_concurrency()
    {
        // Setup data untuk testing
        User::factory(50)->create();
        Order::factory(20)->create(['amount' => 1000]);
        PageView::factory(100)->create();
        UserSession::factory(30)->create(['duration' => 1800]);

        $analyzer = new PerformanceAnalyzer();

        // Di test environment, kita mungkin ingin gunakan driver sync
        Concurrency::driver('sync');
        
        [$userGrowth, $revenue, $engagement, $conversion] = $analyzer->getPerformanceMetrics();

        $this->assertEquals(50, $userGrowth['total_users']);
        $this->assertEquals(20000, $revenue['total_revenue']); // 20 orders * 1000
        $this->assertEquals(100, $engagement['total_pageviews']);
    }
}
```

### 17. 🚨 Potensi Masalah & Cara Menghindarinya

**1. Memory Overflow:**
- **Masalah:** Menjalankan terlalu banyak proses sekaligus bisa menyebabkan kehabisan memory.
- **Solusi:** Batasi jumlah tugas konkuren dan gunakan `gc_collect_cycles()` jika perlu.

**2. Race Conditions:**
- **Masalah:** Karena proses terpisah, bisa terjadi kondisi di mana beberapa proses mencoba mengakses resource bersamaan.
- **Solusi:** Hindari sharing state antar proses, gunakan database atau cache sebagai perantara.

**3. Error Isolation:**
- **Masalah:** Error di satu proses konkuren bisa menggangu proses lain.
- **Solusi:** Selalu tangani error dengan try-catch di dalam closure.

**Contoh dengan Penanganan Error:**
```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Concurrency;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ApiService
{
    public function fetchMultipleApis(): array
    {
        return Concurrency::run([
            fn () => $this->safeFetch('https://api1.example.com/data'),
            fn () => $this->safeFetch('https://api2.example.com/data'),
            fn () => $this->safeFetch('https://api3.example.com/data'),
        ]);
    }

    private function safeFetch(string $url): array
    {
        try {
            $response = Http::timeout(10)->get($url);
            
            if ($response->successful()) {
                return $response->json();
            }
            
            Log::warning("API request failed", [
                'url' => $url,
                'status' => $response->status(),
            ]);
            
            return ['error' => "Request to $url failed", 'data' => null];
        } catch (\Exception $e) {
            Log::error("Exception during API request", [
                'url' => $url,
                'error' => $e->getMessage(),
            ]);
            
            return ['error' => "Exception for $url: " . $e->getMessage(), 'data' => null];
        }
    }
}
```

### 18. 📊 Monitoring & Logging

Penting untuk monitor dan log aktivitas Concurrency supaya bisa troubleshoot saat ada masalah:

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Concurrency;
use Illuminate\Support\Facades\Log;

class MonitoredConcurrencyService
{
    public function runWithMonitoring(array $tasks, string $operationName): array
    {
        Log::info("Starting concurrency operation: $operationName", [
            'task_count' => count($tasks),
            'timestamp' => now(),
        ]);

        $startTime = microtime(true);

        try {
            $results = Concurrency::run($tasks);

            $endTime = microtime(true);
            $executionTime = $endTime - $startTime;

            Log::info("Concurrency operation completed: $operationName", [
                'execution_time' => $executionTime,
                'result_count' => count($results),
                'timestamp' => now(),
            ]);

            return $results;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            $executionTime = $endTime - $startTime;

            Log::error("Concurrency operation failed: $operationName", [
                'execution_time' => $executionTime,
                'error' => $e->getMessage(),
                'timestamp' => now(),
            ]);

            throw $e;
        }
    }
}

// Penggunaan
$service = new MonitoredConcurrencyService();
$results = $service->runWithMonitoring([
    fn () => DB::table('users')->count(),
    fn () => DB::table('orders')->count(),
], 'dashboard_metrics');
```

---

## Bagian 5: Menjadi Master Concurrency 🏆

### 19. ✨ Wejangan dari Guru

1.  **Gunakan Concurrency untuk tugas independen**: Hanya gunakan Concurrency untuk tugas-tugas yang tidak saling bergantung. Jika tugas A butuh hasil dari tugas B, Concurrency tidak akan membantu.
  
2.  **Pilih driver yang tepat**: Gunakan `fork` di lingkungan CLI untuk performa maksimal, `process` untuk stabilitas, dan `sync` untuk testing.

3.  **Jaga agar closure tetap bersih**: Hindari passing variabel kompleks ke closure, karena akan meningkatkan overhead serialisasi.

4.  **Test dengan cermat**: Concurrency bisa menyembunyikan bug yang tidak muncul di eksekusi sekuensial, jadi pastikan testing-mu menyeluruh.

5.  **Monitor penggunaan resource**: Concurrency bisa meningkatkan penggunaan CPU dan memory, jadi pastikan server-mu siap menanganinya.

### 20. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Concurrency di Laravel:

#### ⚡ Dasar-dasar Concurrency
| Perintah | Fungsi |
|----------|--------|
| `Concurrency::run([...])` | Menjalankan closure secara konkuren |
| `Concurrency::driver('fork')->run([...])` | Gunakan driver tertentu |
| `Concurrency::defer([...])` | Menjalankan tugas tanpa menunggu hasilnya |

#### 🏎️ Driver Concurrency
| Driver | Lingkungan | Kecepatan | Keterangan |
|--------|------------|-----------|------------|
| `process` | HTTP & CLI | Rendah | Paling stabil, default |
| `fork` | Hanya CLI | Tinggi | Butuh `spatie/fork` |
| `sync` | Semua | Tidak relevan | Untuk testing |

#### 🛠️ Commands & Konfigurasi
| Command | Fungsi |
|---------|--------|
| `composer require spatie/fork` | Install dependency untuk driver fork |
| `php artisan config:publish concurrency` | Publikasikan file konfigurasi |
| `Concurrency::driver('driver_name')` | Set driver untuk instance tertentu |

#### 🧪 Testing Commands
| Perintah | Fungsi |
|----------|--------|
| `Concurrency::shouldReceive('run')->andReturn([...])` | Mock Concurrency dalam testing |
| `Concurrency::driver('sync')` | Gunakan driver sync dalam testing |

#### 📊 Contoh Kasus Umum
| Kasus | Solusi |
|-------|--------|
| Hitung data dari beberapa tabel | `Concurrency::run([fn()=>DB::table('a')->count(), fn()=>DB::table('b')->count()])` |
| Ambil data dari beberapa API | `Concurrency::run([fn()=>Http::get('api1'), fn()=>Http::get('api2')])` |
| Proses file besar secara paralel | Gunakan `defer` untuk proses non-kritis |

#### 🚨 Best Practices
| Praktik | Alasan |
|---------|--------|
| Gunakan Service Class | Kode tetap rapi dan mudah diuji |
| Gunakan try-catch dalam closure | Tangani error secara granular |
| Monitor resource usage | Hindari overloading server |
| Gunakan timeout | Hindari proses yang berjalan terlalu lama |

### 21. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Concurrency, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Dengan memahami Concurrency, kamu sekarang memiliki senjata ampuh untuk membuat aplikasi Laravel yang super cepat dan responsif.

Concurrency adalah tentang **mengerjakan banyak hal sekaligus** dengan cara yang aman dan efisien. Dengan memilih driver yang tepat, menangani error dengan baik, dan mengikuti best practices, kamu bisa membuat pengalaman pengguna yang jauh lebih baik.

Ingat, Concurrency adalah jantung performa dari aplikasi modern. Menguasainya berarti kamu sudah siap membuat aplikasi Laravel yang tidak hanya hebat, tetapi juga sangat cepat dan efisien. 

Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku! 🚀

# 🧠 Context di Laravel: Panduan Lengkap dari Guru Kesayanganmu (Edisi Context & Metadata)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel lanjutan. Hari ini, kita akan membahas sebuah fitur yang sangat powerful namun sering diabaikan oleh banyak developer: **Context**. Setelah beberapa kali revisi, akhirnya Guru paham apa yang sebenarnya kalian inginkan: sebuah panduan yang **super lengkap** tapi dijelaskan dengan **super sederhana**, seolah-olah Guru sedang duduk di sebelahmu sambil menjelaskan pelan-pelan.

Di edisi ini, kita akan kupas tuntas **semua detail** tentang Context, tapi setiap topik akan Guru ajarkan dengan sabar. Context adalah alat yang membantu kita **melacak keadaan aplikasi** saat eksekusi berlangsung, baik itu dari HTTP request, ke queue job, maupun command. Siap? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Context Itu Sebenarnya?

**Analogi:** Bayangkan kamu seorang detektif yang sedang menyelidiki sebuah kasus. Setiap kali kamu menemukan petunjuk, kamu mencatat **konteks** di mana petunjuk itu ditemukan: waktu kejadian, lokasi, siapa yang terlibat, dll. Inilah **Context** kita dalam aplikasi Laravel: sebuah "buku catatan" yang menyimpan informasi penting saat aplikasi kita berjalan.

**Mengapa ini penting?** Karena tanpa Context, saat error terjadi, kamu seperti detektif tanpa catatan - tidak tahu dari mana asalnya error itu, request mana yang menyebabkannya, atau job mana yang memprosesnya!

**Bagaimana cara kerjanya?** Context itu seperti karyawan administrasi yang otomatis mencatat semua informasi penting saat aplikasi berjalan dan menyimpannya langsung ke log kita. Tidak perlu lagi menulis banyak parameter manual saat logging!

Jadi, alur kerja (workflow) aplikasi kita menjadi sangat rapi:

`➡️ HTTP Request -> 🧠 Context (Catat Metadata) -> 📝 Log (Dilengkapi Metadata) -> 👨‍🔧 Debugging Mudah`

Tanpa Context, log kita akan sangat "pucat" dan susah ditelusuri. 😵

**Manfaat utama Context:**
- Menambah metadata ke log (memudahkan debugging)
- Melewatkan informasi dari request ke job yang di-dispatch
- Menyimpan data yang tidak ingin muncul di log (hidden data)



## Bagian 2: Resep Pertamamu: Dari Basic ke Advanced 🚀

### 2. ⚙️ Cara Kerja Context (Penjelasan Lengkap & Contoh)

**Analogi:** Bayangkan kamu sedang mengirimkan paket penting. Saat kamu mengirim, kamu tidak hanya mengirim isinya, tapi juga mencantumkan informasi pelacakan: nomor resi, lokasi pengiriman, waktu pengiriman, dan bahkan siapa yang mengirim. Context bekerja persis seperti ini! Setiap kali ada aktivitas di aplikasimu, Context mencantumkan "label pelacakan" yang otomatis terlampir ke log.

**Mengapa ini keren?** Karena kamu bisa melacak dari request awal, sampai ke queue job, bahkan ke command CLI - semuanya terhubung dengan informasi kontekstual!

**Bagaimana cara kerjanya?** Context itu seperti "perekam peristiwa" yang otomatis menempel ke setiap log kamu. Saat job dikirim ke queue, semua informasi konteks ini ikut "dikemas" dan "dibongkar" saat job dieksekusi!

#### Langkah 1️⃣: Siapkan Middleware Pelacak (Menambahkan `url` dan `trace_id`)

**Mengapa?** Kita butuh "label pelacakan" yang unik untuk setiap request. Ini akan membantu kita melacak dari mana sebuah log berasal.

**Bagaimana?** Buat middleware yang akan menambahkan informasi pelacakan ke setiap request:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AddContext
{
    public function handle(Request $request, Closure $next): Response
    {
        // Tambahkan metadata pada context
        Context::add('url', $request->url());
        Context::add('trace_id', Str::uuid()->toString());
        Context::add('user_agent', $request->userAgent());
        Context::add('ip_address', $request->ip());

        return $next($request);
    }
}
```

**Penjelasan Kode:**
- `Context::add('url', $request->url())`: Mencatat URL request
- `Context::add('trace_id', Str::uuid()->toString())`: Membuat ID unik untuk melacak request ini
- `Context::add('user_agent', $request->userAgent())`: Mencatat browser/device pengguna
- `Context::add('ip_address', $request->ip())`: Mencatat alamat IP pengguna

#### Langkah 2️⃣: Gunakan di Log (Contoh Log Otomatis Dilengkapi Context)

**Mengapa?** Sekarang setelah kita punya informasi pelacakan, kita bisa menggunakan log secara sederhana tapi tetap kaya konteks!

**Bagaimana?** Cukup gunakan log seperti biasa, dan Context akan otomatis melengkapinya:

```php
Log::info('User authenticated.', ['auth_id' => Auth::id()]);
```

**Hasil log akan menyertakan metadata dari `Context`, misalnya:**
```
User authenticated. {"auth_id":27} {"url":"https://example.com/login","trace_id":"550e8400-e29b-41d4-a716-446655440000","user_agent":"Mozilla/5.0...","ip_address":"192.168.1.1"}
```

**Penjelasan Kode:**
- Kita hanya menulis `Log::info('User authenticated.', ['auth_id' => Auth::id()])` 
- Tapi log secara otomatis dilengkapi dengan semua data yang kita simpan di Context!
- Ini membuat debugging jauh lebih mudah karena kita bisa melihat dari request mana event ini berasal!

**Contoh Lengkap Penerapan:**
```php
// Di controller
public function login(Request $request)
{
    // Context::add('url', $request->url()) dll sudah dijalankan oleh middleware
    
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (Auth::attempt($credentials)) {
        Log::info('User authenticated.', [
            'user_id' => Auth::id(),
            'email' => $request->email
        ]); // Ini akan otomatis menyertakan trace_id, url, dll dari context!
        
        return redirect('/dashboard');
    }
    
    Log::warning('Login failed.', [
        'email' => $request->email
    ]); // Ini juga akan menyertakan semua context!
    
    return back()->withErrors([
        'email' => 'The provided credentials do not match our records.',
    ]);
}
```

Selesai! 🎉 Sekarang, jika kamu membuka log, kamu akan melihat semua informasi pelacakan secara otomatis terlampir di setiap log!



### 3. 📝 Menangkap & Menyimpan Context: Teknik-Teknik Dasar

**Analogi:** Bayangkan Context seperti sebuah buku catatan yang kamu bawa saat bekerja. Setiap kali kamu menemukan informasi penting, kamu mencatatnya di buku itu. Context::add() adalah bolpoinmu untuk menulis di buku catatan ini!

#### 3.1 ➕ Menambahkan Data (Dengan dan Tanpa Array)

**Mengapa ini penting?** Karena kamu perlu menyimpan informasi yang bisa kamu gunakan nanti saat debugging atau melacak eksekusi aplikasi.

**Bagaimana?** Ada dua cara untuk menambahkan data ke Context:

**A. Menambahkan satu per satu:**
```php
use Illuminate\Support\Facades\Context;

Context::add('user_id', Auth::id());
Context::add('action', 'user_login');
Context::add('timestamp', now()->toISOString());
```

**B. Menambahkan dalam satu batch:**
```php
Context::add([
    'user_id' => Auth::id(),
    'action' => 'user_login',
    'timestamp' => now()->toISOString(),
    'source' => 'web',
    'device_type' => 'desktop'
]);
```

**Contoh Penerapan Lengkap:**
```php
// Di controller untuk proses pembuatan order
public function store(Request $request)
{
    $orderData = $request->validate([
        'product_id' => 'required|exists:products,id',
        'quantity' => 'required|integer|min:1',
    ]);

    // Tambahkan konteks sebelum proses
    Context::add([
        'user_id' => Auth::id(),
        'action' => 'create_order',
        'product_id' => $orderData['product_id'],
        'quantity' => $orderData['quantity'],
        'request_id' => request()->route()->getAction()['request_id'] ?? Str::random(10),
    ]);

    $order = Order::create([
        'user_id' => Auth::id(),
        'product_id' => $orderData['product_id'],
        'quantity' => $orderData['quantity'],
    ]);

    // Log ini akan otomatis menyertakan semua context di atas!
    Log::info('Order created successfully', [
        'order_id' => $order->id,
        'total' => $order->total
    ]);

    return response()->json(['order' => $order]);
}
```

**Penjelasan Kode:**
- Kita menyimpan banyak informasi penting sebelum proses
- Saat log dibuat, semua informasi ini otomatis terlampir!
- Ini akan sangat membantu saat debugging atau audit

#### 3.2 🛑 Menambahkan Jika Belum Ada (Prevent Override)

**Analogi:** Bayangkan kamu sedang mengisi formulir, dan kamu tidak ingin mengganti data yang sudah diisi sebelumnya. Context::addIf() adalah seperti pensil yang hanya akan menulis jika kotaknya masih kosong!

**Mengapa ini penting?** Karena terkadang kamu ingin mengatur nilai default yang tidak boleh diubah oleh proses lain dalam request yang sama.

**Bagaimana?** Gunakan `addIf` untuk menambahkan data hanya jika belum ada:

```php
Context::add('key', 'first');      // Menyimpan 'first'
Context::addIf('key', 'second');   // Tetap 'first', karena sudah ada
Context::addIf('another_key', 'value'); // Menyimpan 'value', karena belum ada
```

**Contoh Penerapan:**
```php
// Di middleware pertama
public function handle($request, Closure $next)
{
    Context::add('request_start_time', now());
    Context::add('environment', app()->environment());
    
    // Set trace_id default
    Context::addIf('trace_id', Str::uuid()->toString());
    
    return $next($request);
}

// Di middleware lain atau controller
// trace_id tidak akan diubah karena sudah diset di middleware pertama
Context::addIf('trace_id', 'another_trace_id'); // Akan diabaikan
Context::add('current_user', Auth::id());       // Akan ditambah karena belum ada
```

#### 3.3 🔼 Increment & Decrement (Teknik Penghitungan)

**Analogi:** Bayangkan kamu sedang menghitung berapa banyak produk yang ditambahkan ke keranjang saat satu sesi berlangsung. Context::increment() dan Context::decrement() adalah seperti counter manual yang bisa kamu tambah atau kurangi selama sesi!

**Mengapa ini penting?** Karena terkadang kamu ingin menghitung berapa kali sesuatu terjadi selama satu request atau proses tertentu.

**Bagaimana?** Gunakan increment/decrement untuk menambah atau mengurangi counter di Context:

```php
// Mulai dari 0 atau tidak ada
Context::increment('records_added');        // Sekarang 1
Context::increment('records_added', 5);     // Sekarang 6
Context::decrement('records_added');        // Sekarang 5
Context::decrement('records_added', 3);     // Sekarang 2
```

**Contoh Penerapan Lengkap:**
```php
// Dalam service class yang menangani banyak operasi
class ProductService
{
    public function addMultipleProducts(array $products)
    {
        Context::add('products_process_count', 0); // Inisialisasi counter
        
        foreach ($products as $product) {
            if ($this->createProduct($product)) {
                Context::increment('products_added_success');
            } else {
                Context::increment('products_added_failed');
            }
            Context::increment('products_process_count');
        }
        
        Log::info('Product batch processing completed', [
            'total_processed' => $products,
            'success_count' => Context::get('products_added_success', 0),
            'failed_count' => Context::get('products_added_failed', 0)
        ]);
        
        return Context::get('products_added_success', 0);
    }
    
    private function createProduct($product): bool
    {
        try {
            Product::create($product);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to create product', [
                'product' => $product,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
}
```

**Penjelasan Kode:**
- Kita menggunakan counter untuk melacak berapa banyak produk berhasil/tergagal
- Counter ini otomatis terlampir ke semua log di request ini
- Ini sangat membantu untuk audit dan debugging batch process



### 4. 🔍 Conditional Context (Penambahan Kondisional)

**Analogi:** Bayangkan kamu seorang bouncer di klub malam. Kamu hanya memberikan akses khusus ke orang-orang tertentu. Context::when() adalah seperti sistem keamanan yang hanya mencatat informasi tertentu kalau kriterianya terpenuhi!

**Mengapa ini penting?** Karena kamu tidak ingin mencatat informasi sensitif atau tidak relevan secara manual. Context::when() membuat penambahan context lebih deklaratif dan aman.

**Bagaimana?** Gunakan `when` untuk menambahkan context berdasarkan kondisi tertentu:

```php
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Context;

Context::when(
    Auth::user()->isAdmin(),
    fn ($context) => $context->add('permissions', Auth::user()->permissions),
    fn ($context) => $context->add('permissions', [])
);
```

**Contoh Penerapan Lengkap:**
```php
// Dalam controller atau service
public function show($userId)
{
    $user = User::findOrFail($userId);
    
    // Tambahkan context berdasarkan kondisi
    Context::when(
        Auth::check(),
        fn ($context) => $context->add('current_user_id', Auth::id()),
        fn ($context) => $context->add('current_user_id', 'guest')
    );
    
    Context::when(
        $user->isPremium(),
        fn ($context) => $context->add('user_tier', 'premium'),
        fn ($context) => $context->add('user_tier', 'basic')
    );
    
    // Tambahkan informasi berdasarkan role
    Context::when(
        $user->isAdmin(),
        function ($context) use ($user) {
            $context->add('admin_level', $user->admin_level)
                   ->add('admin_permissions', $user->permissions);
        },
        fn ($context) => $context->add('admin_level', 'none')
    );
    
    Log::info('User profile accessed', [
        'target_user_id' => $user->id,
        'target_user_name' => $user->name
    ]);
    
    return view('user.profile', compact('user'));
}
```

**Contoh Lain dengan Conditional Complex:**
```php
// Dalam middleware atau event listener
public function handle($event)
{
    Context::when(
        $event instanceof PaymentEvent,
        fn ($context) => $context->add('payment_method', $event->paymentMethod)
                                ->add('payment_amount', $event->amount),
        fn ($context) => $context->add('event_type', get_class($event))
    );
    
    // Tambahkan lebih banyak informasi berdasarkan environment
    Context::when(
        app()->environment('production'),
        fn ($context) => $context->add('env_type', 'production')
                                ->add('monitoring_enabled', true),
        fn ($context) => $context->add('env_type', app()->environment())
                                ->add('monitoring_enabled', false)
    );
}
```

**Penjelasan Kode:**
- Kita bisa menambahkan informasi berbeda berdasarkan kondisi
- Kita juga bisa menambahkan beberapa context dalam satu closure
- Ini menjaga kode tetap bersih dibanding banyak if/else



### 5. 🎯 Scoped Context (Context Sementara)

**Analogi:** Bayangkan kamu sedang makan di restoran dan kamu diberikan "piring sementara" hanya untuk makanan tertentu. Setelah selesai makan, piring itu dikembalikan - tidak mempengaruhi piring-piring lain yang kamu punya. Context::scope() bekerja seperti ini: memberikan informasi sementara hanya untuk blok kode tertentu!

**Mengapa ini penting?** Karena terkadang kamu hanya perlu menambahkan informasi spesifik untuk satu proses tertentu, tanpa mengotori context global. Ini menjaga kebersihan dan akurasi data di logmu.

**Bagaimana?** Gunakan `scope` untuk menambahkan data yang hanya berlaku untuk satu blok kode:

```php
Context::add('trace_id', 'abc-999');
Context::addHidden('user_id', 123);

Context::scope(
    function () {
        Context::add('action', 'adding_friend');

        $userId = Context::getHidden('user_id');

        Log::debug("Adding user [{$userId}] to friends list.");
    },
    data: ['user_name' => 'taylor_otwell'],
    hidden: ['user_id' => 987],
);

// Setelah scope selesai, perubahan sementara di-rollback (kecuali ada perubahan pada objek yang dimutasi)
```

**Contoh Penerapan Lengkap:**
```php
// Dalam service class untuk proses kompleks
class OrderProcessingService
{
    public function processOrder(Order $order)
    {
        Context::add('order_id', $order->id);
        Context::add('process_started', now());
        
        // Proses pembayaran dengan context spesifik
        $this->processPaymentWithinScope($order);
        
        // Proses pengiriman dengan context spesifik
        $this->processShippingWithinScope($order);
        
        Log::info('Order processing completed', [
            'order_id' => $order->id,
            'final_status' => $order->status
        ]);
    }
    
    private function processPaymentWithinScope(Order $order)
    {
        Context::scope(
            function () use ($order) {
                Context::add('payment_method', $order->payment_method);
                Context::add('action', 'payment_processing');
                
                // Proses pembayaran
                $payment = $this->paymentService->process($order);
                
                Log::info('Payment processed', [
                    'payment_id' => $payment->id,
                    'amount' => $payment->amount
                ]);
            },
            data: [
                'payment_gateway' => $order->payment_method,
                'currency' => $order->currency
            ]
        );
        
        // Data payment_method, action, gateway, dll akan hilang setelah scope
    }
    
    private function processShippingWithinScope(Order $order)
    {
        Context::scope(
            function () use ($order) {
                Context::add('action', 'shipping_processing');
                Context::add('location', $order->shipping_address->city);
                
                // Proses pengiriman
                $shipping = $this->shippingService->dispatch($order);
                
                Log::info('Shipping dispatched', [
                    'shipping_id' => $shipping->id,
                    'destination' => $shipping->destination
                ]);
            },
            data: [
                'shipping_method' => $order->shipping_method,
                'warehouse' => $order->preferred_warehouse
            ]
        );
        
        // Data location, warehouse, dll akan hilang setelah scope
    }
}
```

**Contoh Lain dengan Hidden Data:**
```php
// Dalam controller untuk operasi sensitif
public function updateSensitiveInfo(Request $request, User $user)
{
    Context::add('user_id', $user->id);
    
    Context::scope(
        function () use ($user, $request) {
            // Tambahkan informasi sensitif yang hanya relevan untuk update ini
            Context::add('action', 'sensitive_data_update');
            Context::addHidden('old_email', $user->email);
            Context::addHidden('old_phone', $user->phone);
            
            // Update data
            $user->update([
                'email' => $request->email,
                'phone' => $request->phone
            ]);
            
            Log::info('Sensitive information updated', [
                'user_id' => $user->id
            ]);
        },
        data: [
            'field_updated' => ['email', 'phone']
        ],
        hidden: [
            'old_email' => $user->email,
            'old_phone' => $user->phone
        ]
    );
    
    // Informasi sensitif tidak akan muncul di log setelah scope selesai
    return response()->json(['message' => 'Updated successfully']);
}
```

**Catatan penting:**
Jika objek kompleks dimodifikasi dalam scoped closure, mutasi tersebut dapat terlihat di luar scope karena referensi objek tetap sama.

**Penjelasan Kode:**
- Kita bisa menambahkan data sementara hanya untuk blok kode tertentu
- Data-data sementara ini otomatis hilang saat scope selesai
- Ini sangat berguna untuk menjaga kebersihan context global
- Hidden data tetap terjaga privasinya bahkan dalam scope



### 6. 📚 Stacks (Riwayat & Histori Context)

**Analogi:** Bayangkan kamu sedang membuat jurnal harian, dan setiap kali kamu melakukan sesuatu, kamu menulisnya di buku catatan secara berurutan. Context::push() adalah seperti menulis entri baru ke jurnalmu. Context::stack() menyimpan semua entri secara berurutan yang bisa kamu baca kembali!

**Mengapa ini penting?** Karena terkadang kamu ingin melihat urutan peristiwa yang terjadi selama satu request atau proses berlangsung. Ini sangat berguna untuk tracing dan debugging kompleks.

**Bagaimana?** Gunakan `push` untuk menyimpan data dalam urutan FIFO (First In, First Out):

```php
Context::push('breadcrumbs', 'user_login');
Context::push('breadcrumbs', 'product_view', 'cart_add');

Context::get('breadcrumbs');
// ['user_login', 'product_view', 'cart_add']
```

**Contoh Penerapan Lengkap:**
```php
// Dalam service class untuk tracing proses
class OrderService
{
    public function createOrder($orderData)
    {
        // Inisialisasi stack untuk melacak proses
        Context::push('order_process_steps', 'validation_started');
        
        // Validasi data
        $this->validateOrder($orderData);
        Context::push('order_process_steps', 'validation_completed');
        
        // Hitung total
        $total = $this->calculateTotal($orderData);
        Context::push('order_process_steps', 'total_calculated');
        
        // Buat order
        $order = $this->createOrderRecord($orderData, $total);
        Context::push('order_process_steps', 'order_created');
        
        // Proses pembayaran
        $this->processPayment($order);
        Context::push('order_process_steps', 'payment_processed');
        
        // Simpan ke database
        $order->save();
        Context::push('order_process_steps', 'order_saved');
        
        Log::info('Order creation process completed', [
            'order_id' => $order->id,
            'process_steps' => Context::get('order_process_steps')
        ]);
        
        return $order;
    }
    
    private function validateOrder($orderData)
    {
        // Proses validasi
        Context::push('validation_steps', 'data_structure_validated');
        Context::push('validation_steps', 'product_availability_checked');
        Context::push('validation_steps', 'user_eligibility_verified');
    }
    
    private function calculateTotal($orderData)
    {
        // Proses perhitungan
        Context::push('calculation_steps', 'base_amount_calculated');
        Context::push('calculation_steps', 'taxes_applied');
        Context::push('calculation_steps', 'discounts_applied');
        
        return $this->calculateFinalAmount($orderData);
    }
}
```

**Contoh Praktis untuk Mencatat Query SQL:**
```php
// Dalam AppServiceProvider atau middleware
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Context;

// Daftarkan listener untuk mencatat semua query
DB::listen(function ($event) {
    Context::push('sql_queries', [
        'sql' => $event->sql,
        'bindings' => $event->bindings,
        'time' => $event->time,
        'connection' => $event->connectionName
    ]);
    
    // Juga catat jumlah query untuk debugging
    Context::increment('query_count');
});

// Di controller atau service
public function getData()
{
    $users = User::with('posts')->get(); // Ini akan menambahkan ke stack sql_queries
    $posts = Post::where('published', true)->get(); // Ini juga akan menambahkan ke stack
    
    Log::info('Data retrieved', [
        'users_count' => $users->count(),
        'posts_count' => $posts->count(),
        'total_queries' => Context::get('query_count', 0)
    ]);
    
    return response()->json([
        'users' => $users,
        'posts' => $posts,
        'query_log' => Context::get('sql_queries') // Semua query yang dijalankan
    ]);
}
```

**Fungsi Stack Lengkap:**
```php
// Menambahkan ke stack
Context::push('user_actions', 'logged_in');
Context::push('user_actions', 'viewed_product', 'added_to_cart', 'checkout_started');

// Memeriksa keberadaan nilai di stack
if (Context::stackContains('user_actions', 'logged_in')) {
    Log::info('User was logged in during this session');
}

// Mendapatkan semua nilai dari stack
$actions = Context::get('user_actions');
// ['logged_in', 'viewed_product', 'added_to_cart', 'checkout_started']

// Mendapatkan nilai terakhir dari stack (tanpa menghapus)
$lastAction = end($actions); // 'checkout_started'

// Menghitung jumlah item di stack
$itemCount = count(Context::get('user_actions', [])); // 4
```

**Contoh dengan Multiple Stacks:**
```php
// Dalam proses checkout kompleks
public function processCheckout(CheckoutRequest $request)
{
    // Stack untuk langkah-langkah proses
    Context::push('checkout_steps', 'validation_started');
    
    // Validasi
    $this->validateCheckout($request);
    Context::push('checkout_steps', 'validation_completed');
    
    // Stack untuk item yang diproses
    foreach ($request->items as $item) {
        Context::push('processed_items', [
            'product_id' => $item['product_id'],
            'quantity' => $item['quantity'],
            'status' => 'validated'
        ]);
    }
    
    Context::push('checkout_steps', 'items_validated');
    
    // Stack untuk error jika ada
    try {
        $order = $this->createOrder($request);
        Context::push('checkout_steps', 'order_created');
    } catch (\Exception $e) {
        Context::push('checkout_errors', [
            'error' => $e->getMessage(),
            'step' => 'order_creation',
            'timestamp' => now()
        ]);
        Context::push('checkout_steps', 'order_creation_failed');
        
        throw $e;
    }
    
    Log::info('Checkout process completed', [
        'success' => !Context::get('checkout_errors', []),
        'steps' => Context::get('checkout_steps'),
        'errors' => Context::get('checkout_errors', []),
        'items_count' => count(Context::get('processed_items', []))
    ]);
}
```

**Penjelasan Kode:**
- Kita bisa melacak urutan peristiwa dengan akurat
- Stack menyimpan data dalam urutan FIFO
- Sangat berguna untuk debugging proses kompleks
- Bisa digunakan untuk audit trail



### 7. 📤 Mengambil & Mengelola Context (Operasi Lengkap)

**Analogi:** Bayangkan Context seperti sebuah perpustakaan digital. Kamu bisa mengambil buku tertentu (get), mengambil beberapa buku sekaligus (only), mengambil semua buku kecuali beberapa (except), atau bahkan mengambil dan langsung mengembalikan buku tersebut (pull). Context menyediakan banyak cara untuk mengakses dan mengelola informasimu!

**Mengapa ini penting?** Karena kamu perlu mengakses informasi yang sudah kamu simpan di Context, baik untuk keperluan log, pengambilan keputusan, atau debugging.

**Bagaimana?** Berikut adalah operasi lengkap untuk mengelola Context:

#### 7.1 A. Mengambil Data Tunggal

```php
$value = Context::get('key');
```

**Contoh Penerapan:**
```php
// Ambil data tunggal
$userId = Context::get('user_id');
$action = Context::get('current_action');
$traceId = Context::get('trace_id');

// Ambil dengan default value
$environment = Context::get('environment', 'unknown');
$locale = Context::get('locale', 'en');
```

#### 7.2 B. Mengambil Beberapa Data

```php
// Ambil hanya beberapa key
$data = Context::only(['first_key', 'second_key']);

// Ambil semua kecuali beberapa key
$data = Context::except(['first_key']);
```

**Contoh Penerapan:**
```php
// Ambil hanya informasi penting untuk log khusus
$importantContext = Context::only(['trace_id', 'user_id', 'request_id']);

// Ambil semua kecuali data sensitif
$publicContext = Context::except(['password', 'token', 'credit_card']);

Log::channel('security')->info('Security event', [
    'context' => $importantContext,
    'action' => 'user_login_attempt'
]);
```

#### 7.3 C. Mengambil dan Menghapus (Pull)

```php
$value = Context::pull('key'); // Ambil dan hapus dari context
```

**Contoh Penerapan:**
```php
// Gunakan untuk data yang hanya perlu sekali
$notificationId = Context::pull('notification_id'); // Hanya digunakan sekali

if ($notificationId) {
    Log::info('Processing notification', [
        'id' => $notificationId
    ]);
    // notification_id sekarang dihapus dari context
}

// Berguna untuk counter yang hanya perlu diakses sekali
$retryCount = Context::pull('retry_count', 0);
if ($retryCount > 0) {
    Log::warning('Operation retried', ['retries' => $retryCount]);
}
```

#### 7.4 D. Operasi Stack

```php
// Pop dari stack (ambil dan hapus item terakhir)
Context::push('breadcrumbs', 'first', 'second');
$lastItem = Context::pop('breadcrumbs'); // 'second'
```

**Contoh Penerapan Stack:**
```php
// Dalam proses dengan rollback capability
Context::push('process_stack', 'step_1_started');
Context::push('process_stack', 'step_2_started');
Context::push('process_stack', 'step_3_started');

// Jika ada error, kita bisa "mengulang" langkah terakhir
$lastStep = Context::pop('process_stack'); // 'step_3_started'
Log::warning('Rolling back from step', ['step' => $lastStep]);

// Ambil semua item dari stack
$allSteps = Context::get('process_stack'); // ['step_1_started', 'step_2_started']
```

#### 7.5 E. Ambil Semua Data

```php
$data = Context::all(); // Ambil semua context
```

**Contoh Penerapan:**
```php
// Untuk debugging atau audit lengkap
$fullContext = Context::all();

Log::debug('Full context at this point', [
    'all_context' => $fullContext
]);

// Simpan ke storage untuk analisis nanti
if (config('app.debug')) {
    Cache::put("context_snapshot_" . now()->timestamp, $fullContext, 3600);
}
```

#### 7.6 F. Fungsi Remember (Simpan jika Belum Ada)

```php
$permissions = Context::remember(
    'user-permissions',
    fn () => $user->permissions,
);
```

**Contoh Penerapan Lengkap:**
```php
class UserService
{
    public function getUserPermissions($user)
    {
        // Gunakan context untuk menyimpan dan mengingat permissions
        $permissions = Context::remember(
            'user-permissions-' . $user->id,
            fn () => $this->fetchPermissions($user) // Expensive operation
        );
        
        return $permissions;
    }
    
    private function fetchPermissions($user)
    {
        // Operasi mahal yang hanya dijalankan jika belum ada di context
        Context::push('debug_log', 'fetching_permissions_for_user_' . $user->id);
        return $user->load('roles.permissions')->permissions;
    }
    
    public function checkUserAccess($user, $permission)
    {
        // Gunakan permissions yang sudah di-cache di context
        $permissions = Context::remember(
            'user-permissions-' . $user->id,
            fn () => $this->fetchPermissions($user)
        );
        
        $hasAccess = $permissions->contains('name', $permission);
        
        Context::push('access_checks', [
            'user_id' => $user->id,
            'permission' => $permission,
            'granted' => $hasAccess,
            'timestamp' => now()
        ]);
        
        return $hasAccess;
    }
}

// Dalam controller
public function dashboard()
{
    $user = Auth::user();
    $userService = new UserService();
    
    // Permissions akan diambil sekali dan disimpan di context
    $canAccessReports = $userService->checkUserAccess($user, 'view_reports');
    $canManageUsers = $userService->checkUserAccess($user, 'manage_users');
    
    // Semua akses check tercatat di stack access_checks
    $accessLogs = Context::get('access_checks');
    
    Log::info('Dashboard access info', [
        'user_id' => $user->id,
        'can_access_reports' => $canAccessReports,
        'can_manage_users' => $canManageUsers,
        'total_access_checks' => count($accessLogs)
    ]);
    
    return view('dashboard');
}
```

**Penjelasan Kode:**
- Context::get() untuk mengambil nilai tunggal
- Context::only() untuk mengambil beberapa nilai tertentu
- Context::except() untuk mengambil semua kecuali nilai tertentu
- Context::pull() untuk mengambil sekaligus menghapus
- Context::pop() untuk mengambil dari stack
- Context::all() untuk mengambil semua context
- Context::remember() untuk "cache" nilai jika belum ada



## ✅ Menentukan Ada / Tidaknya Item

**Narasi:**
Gunakan `has` dan `missing` untuk memeriksa ada atau tidaknya key. Perlu diingat: `has` menganggap `null` sebagai "ada".

```php
if (Context::has('key')) { /* ada */ }
if (Context::missing('key')) { /* tidak ada */ }

Context::add('key', null);
Context::has('key'); // true
```



## ❌ Menghapus Data Context

**Narasi:**
`forget` menghapus key dari context. Anda bisa menghapus banyak key sekaligus.

```php
Context::add(['first_key' => 1, 'second_key' => 2]);
Context::forget('first_key');
Context::forget(['first_key', 'second_key']);
```



### 8. 🔒 Hidden Context (Data Tersembunyi)

**Analogi:** Bayangkan kamu sedang membawa dompet berisi kartu kredit dan dokumen penting lainnya. Kamu ingin mencatat bahwa kamu membawanya (untuk keperluan keamanan), tapi kamu tidak ingin mencantumkan nomor kartu atau detail sensitifnya di tempat umum. Context::addHidden() adalah seperti "saku rahasia" yang mencatat keberadaan sesuatu tanpa mengungkapkan detail sensitifnya!

**Mengapa ini penting?** Karena terkadang kamu perlu membawa informasi sensitif (seperti token API, password, atau detail kartu kredit) melalui proses aplikasi, tapi tidak ingin informasi itu muncul di log publik.

**Bagaimana cara kerjanya?** Hidden context menyimpan data secara terpisah dari context publik. Data yang disimpan di hidden context tidak akan otomatis muncul di log, tapi tetap bisa diakses dalam kode aplikasi saat dibutuhkan.

**Contoh Dasar Hidden Context:**
```php
Context::addHidden('api_token', $user->api_token);
Context::getHidden('api_token'); // Mengembalikan nilai token
Context::get('api_token'); // null - tidak akan muncul di context publik

// Hidden context tidak akan muncul di log
Log::info('User action performed'); 
// Hasil: hanya context publik yang terlampir, hidden context tetap tersembunyi!
```

**Contoh Penerapan Lengkap:**
```php
// Dalam service class yang menangani pembayaran
class PaymentService
{
    public function processPayment($paymentData)
    {
        // Tambahkan informasi sensitif ke hidden context
        Context::addHidden('credit_card', $paymentData['card_number']);
        Context::addHidden('cvv', $paymentData['cvv']);
        Context::addHidden('api_secret', config('services.payment_gateway.secret'));
        
        // Tambahkan informasi non-sensitif ke context publik
        Context::add('payment_method', $paymentData['method']);
        Context::add('amount', $paymentData['amount']);
        Context::add('currency', $paymentData['currency']);
        
        // Proses pembayaran
        $response = $this->sendToGateway($paymentData);
        
        // Di log hanya akan muncul informasi publik
        Log::info('Payment processed', [
            'status' => $response['status'],
            'transaction_id' => $response['transaction_id']
        ]); // Context publik akan otomatis terlampir, tapi hidden data tidak!
        
        // Hapus data sensitif setelah selesai
        Context::forgetHidden('api_secret');
        
        return $response;
    }
    
    private function sendToGateway($paymentData)
    {
        // Proses pengiriman ke gateway
        // Hidden context otomatis tersedia di sini jika perlu
        $apiSecret = Context::getHidden('api_secret');
        
        // Gunakan apiSecret untuk proses internal
        return Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiSecret
        ])->post('https://payment-gateway.com/process', $paymentData);
    }
    
    public function logPaymentAttempt($paymentData)
    {
        // Gunakan hidden context untuk debugging internal
        if (Context::hasHidden('credit_card')) {
            $last4 = substr(Context::getHidden('credit_card'), -4);
            Log::debug('Processing payment for card ending in', [
                'last_4_digits' => $last4
            ]);
        }
    }
}

// Semua hidden context methods lengkap:
Context::addHidden('key', 'sensitive_value');           // Tambah data sensitif
Context::getHidden('key');                              // Ambil data sensitif
Context::hasHidden('key');                              // Cek keberadaan data sensitif
Context::missingHidden('key');                         // Kebalikan dari hasHidden
Context::forgetHidden('key');                          // Hapus data sensitif
Context::pullHidden('key');                            // Ambil sekaligus hapus
Context::allHidden();                                  // Ambil semua data sensitif
Context::onlyHidden(['key1', 'key2']);                // Ambil beberapa data sensitif
Context::exceptHidden(['key1']);                       // Ambil semua kecuali beberapa data sensitif
Context::pushHidden('stack_name', 'value');            // Tambah ke stack sensitif
Context::popHidden('stack_name');                      // Ambil dari stack sensitif
Context::addHiddenIf('key', 'value');                  // Tambah jika belum ada
```

**Contoh Best Practice dengan Hidden Context:**
```php
// Dalam middleware otentikasi
class AuthMiddleware
{
    public function handle($request, Closure $next)
    {
        $token = $request->bearerToken();
        
        if ($token) {
            // Simpan token ke hidden context
            Context::addHidden('auth_token', $token);
            
            // Ambil dan proses informasi user (tanpa menyimpan token sensitif)
            $user = $this->validateToken($token);
            
            if ($user) {
                Context::add('user_id', $user->id);
                Context::add('user_email', $user->email);
                Context::add('auth_method', 'bearer_token');
                
                Auth::login($user);
            } else {
                // Log percobaan otentikasi gagal dengan context
                Log::warning('Invalid auth token provided', [
                    'ip' => $request->ip()
                ]);
                
                return response()->json(['error' => 'Unauthorized'], 401);
            }
        }
        
        return $next($request);
    }
    
    private function validateToken($token)
    {
        try {
            // Gunakan hidden token untuk validasi
            $payload = JWT::decode($token, Context::getHidden('auth_token_key'), ['HS256']);
            return User::find($payload->user_id);
        } catch (\Exception $e) {
            Log::error('Token validation failed', ['error' => $e->getMessage()]);
            return null;
        }
    }
}
```

**Penjelasan Kode:**
- Hidden context menyimpan data sensitif yang tidak akan muncul di log publik
- Punya API yang mirip dengan context publik tapi terpisah
- Sangat penting untuk keamanan aplikasi
- Bisa digunakan bersama context publik untuk informasi lengkap tapi aman



### 9. 📢 Events: Dehydrating & Hydrated (Context dalam Queue)

**Analogi:** Bayangkan kamu sedang mengirimkan "kotak waktu" ke masa depan. Sebelum dikirim (dehydrating), kamu menyimpan semua informasi penting ke dalamnya. Saat kotak tiba di masa depan (hydrated), kamu mengeluarkan kembali semua informasi itu dan menggunakannya. Context::dehydrating dan Context::hydrated bekerja seperti ini untuk queue job!

**Mengapa ini penting?** Karena saat job di-dispatch ke queue, semua context saat ini akan "dibekukan" dan "dibawa" ke dalam job. Ini memungkinkan kamu melacak request yang memicu job, bahkan saat job dijalankan di waktu yang berbeda!

**Bagaimana cara kerjanya?** Saat job di-dispatch, context "didehydrasi" (data disimpan ke payload job). Saat job itu berjalan, context tersebut "dihydrate" (kembalikan ke runtime job). Events `dehydrating` dan `hydrated` memberi hook untuk memodifikasi repository context saat proses ini.

#### 9.1 🏷️ Dehydrating (Sebelum Job Dikirim)

**Analogi:** Seperti menyusun daftar belanja sebelum pergi ke supermarket - kamu mencatat semua yang ingin kamu bawa dan kondisi sekarang.

**Mengapa ini penting?** Karena kamu bisa menambahkan informasi tambahan yang ingin kamu bawa ke dalam job, seperti konfigurasi khusus atau informasi lingkungan.

**Bagaimana?** Gunakan `Context::dehydrating()` untuk menambahkan data yang ingin kamu sertakan bersama job:

```php
use Illuminate\Log\Context\Repository;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Context;

Context::dehydrating(function (Repository $context) {
    // Simpan konfigurasi lokal saat job dipanggil
    $context->addHidden('locale', Config::get('app.locale'));
    $context->addHidden('timezone', Config::get('app.timezone'));
    
    // Tambahkan user-specific settings jika ada
    if (auth()->check()) {
        $context->add('user_timezone', auth()->user()->timezone ?? 'UTC');
    }
});
```

> **PENTING:** Jangan gunakan facade `Context` di dalam callback ini—gunakan repository yang diberikan sebagai argumen.

**Contoh Penerapan Lengkap Dehydrating:**
```php
// Dalam AppServiceProvider atau service provider lain
use Illuminate\Support\ServiceProvider;
use Illuminate\Log\Context\Repository;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Auth;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Tambahkan informasi penting saat job di-dispatch
        Context::dehydrating(function (Repository $context) {
            // Simpan konfigurasi lokal
            $context->addHidden('app_locale', Config::get('app.locale'));
            $context->addHidden('app_timezone', Config::get('app.timezone'));
            $context->addHidden('app_env', Config::get('app.env'));
            
            // Simpan user context jika ada
            if (Auth::check()) {
                $context->add('current_user_id', Auth::id());
                $context->add('current_user_role', Auth::user()->role ?? 'user');
            }
            
            // Tambahkan request context jika ada
            if (request()->has('trace_id')) {
                $context->add('request_trace_id', request()->get('trace_id'));
            }
            
            // Simpan custom user preferences
            $context->addHidden('user_preferences', session('preferences', []));
        });
    }
}
```

#### 9.2 💧 Hydrated (Saat Job Dijalankan)

**Analogi:** Seperti membuka kotak waktu yang tadi kamu kirim - kamu mengeluarkan kembali semua informasi dan mengembalikan kondisi sesuai saat pengiriman.

**Mengapa ini penting?** Karena kamu bisa mengembalikan kondisi lingkungan yang sama saat job di-dispatch, seperti locale pengguna atau timezone.

**Bagaimana?** Gunakan `Context::hydrated()` untuk memulihkan (restore) kondisi lingkungan saat job berjalan:

```php
Context::hydrated(function (Repository $context) {
    // Kembalikan locale pengguna
    if ($context->hasHidden('locale')) {
        Config::set('app.locale', $context->getHidden('locale'));
    }
    
    // Kembalikan timezone pengguna
    if ($context->hasHidden('timezone')) {
        Config::set('app.timezone', $context->getHidden('timezone'));
        date_default_timezone_set($context->getHidden('timezone'));
    }
    
    // Kembalikan user preferences
    if ($context->hasHidden('user_preferences')) {
        session(['preferences' => $context->getHidden('user_preferences')]);
    }
});
```

Sama seperti `dehydrating`, jangan gunakan facade `Context` langsung di callback ini—modifikasilah repository yang disediakan.

**Contoh Penerapan Lengkap Hydrated:**
```php
// Dalam AppServiceProvider yang sama
class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Lihat contoh dehydrating di atas...
        
        // Pulihkan lingkungan saat job dijalankan
        Context::hydrated(function (Repository $context) {
            // Kembalikan konfigurasi aplikasi
            if ($context->hasHidden('app_locale')) {
                Config::set('app.locale', $context->getHidden('app_locale'));
                app()->setLocale($context->getHidden('app_locale'));
            }
            
            if ($context->hasHidden('app_timezone')) {
                Config::set('app.timezone', $context->getHidden('app_timezone'));
                date_default_timezone_set($context->getHidden('app_timezone'));
            }
            
            // Kembalikan user context
            if ($context->has('current_user_id') && !Auth::check()) {
                // Coba login user jika belum login
                $userId = $context->get('current_user_id');
                Auth::loginUsingId($userId);
            }
            
            // Kembalikan request context
            if ($context->has('request_trace_id')) {
                Context::add('trace_id', $context->get('request_trace_id'));
            }
            
            // Kembalikan preferences
            if ($context->hasHidden('user_preferences')) {
                $preferences = $context->getHidden('user_preferences');
                session(['preferences' => $preferences]);
            }
        });
    }
}
```

**Contoh Lengkap: Job dengan Context:**
```php
// Job class: ProcessUserNotification.php
<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Context;

class ProcessUserNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $user;
    public $message;

    public function __construct($user, $message)
    {
        $this->user = $user;
        $this->message = $message;
    }

    public function handle()
    {
        // Context yang di-dihydrate otomatis tersedia di sini!
        $userId = Context::get('user_id'); // Dari request awal
        $traceId = Context::get('trace_id'); // Dari request awal
        $locale = Context::getHidden('locale'); // Dari dehydrating callback
        
        Log::info('Processing user notification', [
            'user_id' => $this->user->id,
            'message_preview' => substr($this->message, 0, 20) . '...',
            'original_request_user' => $userId,
            'original_trace_id' => $traceId
        ]);
        
        // Kirim notifikasi
        $this->user->notify(new UserNotification($this->message));
        
        Log::info('Notification sent successfully');
    }
}
```

**Penjelasan Kode:**
- Context disimpan saat job di-dispatch (dehydrating) dan dipulihkan saat job dijalankan (hydrated)
- Ini memungkinkan tracking penuh dari request ke job
- Informasi penting bisa dipulihkan saat job berjalan
- Hidden data tetap terjaga keamanannya



## Bagian 4: Tips & Best Practices dari Guru 🎓

### 10. ✅ Best Practices & Tips (Kiat-kiat Bijak)

Setelah belajar banyak hal tentang Context, sekarang waktunya memahami **cara menggunakan Context yang bijak**. Seperti pedang bermata dua, Context bisa sangat membantu... atau sangat membahayakan jika tidak digunakan dengan benar. 

**1. 🔐 Jangan menyimpan data sensitif ke context publik**
- Gunakan `addHidden` untuk informasi seperti token, password, atau detail kartu kredit
- Data sensitif di context publik bisa terbocor ke log publik
- Contoh benar:
```php
// ✅ BENAR
Context::addHidden('api_token', $user->api_token);
Context::add('user_id', $user->id);

// ❌ SALAH
Context::add('api_token', $user->api_token); // Raw token di context publik!
```

**2. 📏 Ringkaslah isi context**
- Terlalu banyak metadata membuat log berat dan susah dibaca
- Simpan hanya informasi yang benar-benar diperlukan
- Jangan masukkan data besar-besar ke context
- Contoh benar:
```php
// ✅ BENAR - informasi penting saja
Context::add([
    'user_id' => $user->id,
    'action' => 'file_upload',
    'file_size' => $request->file('document')->getSize()
]);

// ❌ SALAH - data besar dan tidak perlu
Context::add([
    'user_data' => $user,  // Objek besar!
    'full_request' => $request->all(),  // Semua data request!
    'file_content' => file_get_contents($request->file('document')->path())  // Isi file!
]);
```

**3. 🎪 Gunakan `scope` untuk data sementara**
- Scope membersihkan data otomatis saat selesai
- Menjaga context global tetap bersih
- Cocok untuk operasi yang punya konteks khusus
```php
// ✅ BENAR - gunakan scope untuk data sementara
Context::scope(
    function () use ($order) {
        Context::add('action', 'fulfillment_processing');
        $this->fulfillOrder($order);
    },
    data: ['order_channel' => $order->channel],
    hidden: ['fulfillment_token' => $order->fulfillment_token]
); // Data akan otomatis hilang setelah scope
```

**4. 📚 Gunakan `stack` untuk histori, tidak untuk data besar**
- Cocok untuk melacak urutan peristiwa
- Jangan simpan duplikasi data berukuran besar
- Gunakan untuk query log, langkah proses, dll
```php
// ✅ BENAR - track urutan peristiwa
Context::push('process_steps', 'validation_started');
Context::push('process_steps', 'data_processed');
Context::push('process_steps', 'result_saved');

// ❌ SALAH - simpan data besar
Context::push('data_history', $largeDataset); // Data besar!
Context::push('file_contents', $fileContent); // Isi file!
```

**5. 🔄 Tambahkan dehydrating/hydrated hooks untuk restore konfigurasi**
- Penting untuk maintain locale, timezone, atau user preferences dalam queue
- Jaga konsistensi lingkungan antara request dan job
```php
// ✅ BENAR - maintain lingkungan
Context::dehydrating(function (Repository $context) {
    $context->addHidden('locale', app()->getLocale());
    $context->addHidden('timezone', auth()->user()->timezone ?? 'UTC');
});

Context::hydrated(function (Repository $context) {
    if ($context->hasHidden('locale')) {
        app()->setLocale($context->getHidden('locale'));
    }
    if ($context->hasHidden('timezone')) {
        date_default_timezone_set($context->getHidden('timezone'));
    }
});
```

**6. 🧹 Bersihkan context saat selesai**
- Hapus data yang sudah tidak diperlukan
- Gunakan `forget` untuk membersihkan data sementara
```php
// Bersihkan setelah selesai
Context::add('temp_calculation', $result);
// ... gunakan $result ...
Context::forget('temp_calculation'); // Hapus setelah selesai
```

**7. 📊 Gunakan context untuk audit trail**
- Cocok untuk keperluan compliance atau debugging
- Track siapa yang melakukan apa, kapan, dari mana
```php
// Gunakan untuk audit
Context::add([
    'actor_id' => Auth::id(),
    'action' => 'data_export',
    'source_ip' => request()->ip(),
    'user_agent' => request()->userAgent(),
    'timestamp' => now()->toISOString()
]);
```

**8. 🧠 Gunakan Context::remember untuk optimasi**
- Hindari pengulangan operasi mahal
- Cache data yang sering digunakan
```php
$permissions = Context::remember(
    'user_permissions_' . $userId,
    fn () => User::find($userId)->load('roles.permissions')->permissions
);
```

**Contoh Implementasi Lengkap:**
```php
class OrderProcessingService
{
    public function processOrder(Order $order)
    {
        // Setup awal
        Context::add([
            'order_id' => $order->id,
            'user_id' => $order->user_id,
            'trace_id' => Str::uuid()->toString(),
            'process_started' => now()->toISOString()
        ]);
        
        // Simpan data sensitif dengan aman
        Context::addHidden('payment_token', $order->payment_token);
        
        try {
            // Proses dalam scope
            $this->processPaymentWithinScope($order);
            $this->processFulfillmentWithinScope($order);
            
            // Tambahkan ke stack untuk audit trail
            Context::push('process_events', [
                'event' => 'order_completed',
                'timestamp' => now()->toISOString(),
                'processor' => get_class($this)
            ]);
            
            Log::info('Order processed successfully');
        } catch (\Exception $e) {
            Context::push('process_events', [
                'event' => 'order_failed',
                'error' => $e->getMessage(),
                'timestamp' => now()->toISOString()
            ]);
            
            Log::error('Order processing failed', [
                'error' => $e->getMessage()
            ]);
            
            throw $e;
        } finally {
            // Bersihkan data sensitif
            Context::forgetHidden('payment_token');
            
            // Log audit trail lengkap
            Log::channel('audit')->info('Order process audit', [
                'order_id' => $order->id,
                'events' => Context::get('process_events', []),
                'total_duration' => now()->diffInSeconds(Context::get('process_started'))
            ]);
        }
    }
    
    private function processPaymentWithinScope(Order $order)
    {
        Context::scope(
            function () use ($order) {
                Context::add('step', 'payment_processing');
                // Proses pembayaran...
            },
            data: ['payment_method' => $order->payment_method]
        );
    }
    
    private function processFulfillmentWithinScope(Order $order)
    {
        Context::scope(
            function () use ($order) {
                Context::add('step', 'fulfillment_processing');
                // Proses fulfillment...
            },
            data: ['fulfillment_center' => $order->fulfillment_center]
        );
    }
}
```

**Penjelasan Kode:**
- Gunakan hidden context untuk data sensitif
- Gunakan scope untuk data sementara
- Gunakan stack untuk audit trail
- Bersihkan data saat selesai
- Simpan hanya informasi yang diperlukan



## Bagian 5: Troubleshooting & Penyelesaian Masalah 🔧

### 11. ⚠️ Troubleshooting Umum (Solusi Masalah yang Sering Terjadi)

Seperti halnya fitur-fitur lain di Laravel, Context juga bisa menyebabkan masalah jika tidak digunakan dengan benar. Berikut adalah **masalah-masalah umum** dan **solusi-solusi** yang sering ditemui saat menggunakan Context:

**1. 🚫 Context tidak muncul di log**
**Masalah:** Data yang kamu simpan di Context tidak muncul saat logging
**Penyebab:** Logger mungkin menghapus metadata atau menggunakan custom formatter
**Solusi:**
```php
// Periksa apakah kamu menggunakan custom formatter
// Di config/logging.php
'daily' => [
    'driver' => 'daily',
    'path' => storage_path('logs/laravel.log'),
    'level' => env('LOG_LEVEL', 'debug'),
    'days' => 14,
    // Pastikan tidak ada formatter custom yang menghapus context
],

// Pastikan tidak ada middleware atau channel yang menghapus metadata
Log::info('Test message'); // Harus menyertakan context jika sudah diset
```

**2. 🔥 Hidden data muncul di log publik**
**Masalah:** Data sensitif yang disimpan di hidden context muncul di log publik
**Penyebab:** Mungkin kamu secara eksplisit menambahkan hidden data ke log metadata
**Solusi:**
```php
// ❌ JANGAN LAKUKAN INI
$hiddenData = Context::getHidden('sensitive_info');
Log::info('Log message', ['hidden_data' => $hiddenData]); // Ini akan tampilkan di log!

// ✅ BENAR - biarkan Context handle otomatis
Context::addHidden('sensitive_info', $sensitiveData);
Log::info('Log message'); // Hidden data tidak akan muncul di log publik
```

**3. 🚨 Job tidak menerima Context**
**Masalah:** Job yang di-dispatch tidak menerima context dari request asal
**Penyebab:** Callback dehydrating tidak mendaftarkan data atau job di-dispatch sebelum context di-set
**Solusi:**
```php
// Pastikan context sudah di-set SEBELUM job di-dispatch
public function createOrder(Request $request)
{
    // 1. Set context dulu
    Context::add('user_id', Auth::id());
    Context::add('trace_id', Str::uuid()->toString());
    
    // 2. Baru dispatch job
    ProcessOrder::dispatch($order);
}

// Pastikan dehydrating callback sudah di-register
Context::dehydrating(function (Repository $context) {
    $context->add('user_timezone', auth()->user()->timezone ?? 'UTC');
});
```

**4. 📉 Context terlalu besar mempengaruhi performa**
**Masalah:** Aplikasi menjadi lambat karena context terlalu besar
**Penyebab:** Menyimpan data besar atau terlalu banyak informasi
**Solusi:**
```php
// ❌ JANGAN SIMPAN DATA BESAR
Context::add('large_dataset', $bigArray); // Ini akan berat!

// ✅ SIMPAN HANYA INFORMASI PENTING
Context::add('dataset_size', count($bigArray)); // Simpan statistik, bukan data aslinya
Context::add('dataset_type', gettype($bigArray));
```

**5. 🔄 Context tidak kembali ke keadaan semula setelah scope**
**Masalah:** Setelah menggunakan `Context::scope()`, beberapa data tetap ada
**Penyebab:** Jika kamu mengubah objek kompleks dalam scope, perubahannya bisa tetap terlihat karena referensi objek
**Solusi:**
```php
// Waspadai mutasi objek dalam scope
Context::scope(
    function () use (&$data) {
        $data['new_key'] = 'new_value'; // Ini akan tetap terlihat di luar scope!
    }
);

// Untuk data kompleks, buat salinan jika perlu
Context::scope(
    function () use ($originalData) {
        $data = clone $originalData; // Atau array_merge untuk array
        // Lakukan operasi pada salinan
    }
);
```

**6. 🚨 Context::remember tidak bekerja seperti yang diharapkan**
**Masalah:** Fungsi remember dijalankan berulang kali meskipun key sudah ada
**Penyebab:** Penanganan exception atau cara pemanggilan
**Solusi:**
```php
// Gunakan dengan benar
$permissions = Context::remember(
    'user_permissions_' . $user->id,
    function () use ($user) {
        // Operasi mahal di sini
        return $user->load('roles.permissions')->permissions;
    }
);

// Jangan lupa bahwa ini hanya di-cache per request, bukan permanen
```

**7. 🧹 Membersihkan context dengan benar**
**Masalah:** Context lama terbawa ke request berikutnya (kalau tidak menggunakan request cycle)
**Penyebab:** Context tidak direset saat perlu
**Solusi:**
```php
// Dalam command atau proses panjang, reset jika perlu
Artisan::command('custom:command', function () {
    // Lakukan sesuatu
    // Jika perlu reset context di akhir:
    Context::flush(); // Hapus semua context jika diperlukan
});
```

**Contoh Debugging Lengkap:**
```php
class ContextDebugService
{
    public function debugContextState()
    {
        // 1. Cek semua context publik
        $publicContext = Context::all();
        Log::debug('Current public context', ['context' => $publicContext]);
        
        // 2. Cek semua hidden context
        $hiddenContext = Context::allHidden();
        Log::debug('Current hidden context keys', ['keys' => array_keys($hiddenContext)]);
        
        // 3. Cek apakah ada key tertentu
        if (Context::has('expected_key')) {
            Log::debug('Expected key exists', ['value' => Context::get('expected_key')]);
        } else {
            Log::warning('Expected key missing');
        }
        
        // 4. Cek stack
        $stackItems = Context::get('stack_name', []);
        Log::debug('Stack items count', ['count' => count($stackItems)]);
    }
    
    public function validateJobContext()
    {
        // Dalam job, validasi apakah context sudah hydrate dengan benar
        $requiredContext = [
            'user_id',
            'trace_id',
            'process_started'
        ];
        
        foreach ($requiredContext as $key) {
            if (!Context::has($key)) {
                Log::error("Required context key missing in job", ['key' => $key]);
                throw new \Exception("Missing context key: $key");
            }
        }
        
        Log::debug('All required context keys present');
    }
}
```

**Penjelasan Solusi:**
- Periksa konfigurasi logging untuk masalah tampilan context
- Waspadai hidden data yang secara eksplisit ditambahkan ke log
- Pastikan urutan eksekusi benar (context sebelum dispatch)
- Hindari menyimpan data besar di context
- Perhatikan mutasi objek dalam scope
- Gunakan Context::remember dengan hati-hati
- Reset context jika perlu di proses panjang



## Bagian 6: Kumpulan Contoh Lengkap 🧩

### 12. 🧩 Lampiran: Kode Lengkap Contoh (Contoh Dunia Nyata)

Berikut adalah **contoh-contoh lengkap** yang bisa kamu tiru atau adaptasi untuk kebutuhan aplikasimu. Contoh-contoh ini mencakup berbagai skenario penggunaan Context di dunia nyata:

#### 12.1 🛡️ Contoh 1: Middleware Context Lengkap

**Deskripsi:** Middleware yang menambahkan berbagai informasi pelacakan ke setiap request

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AddContext
{
    public function handle(Request $request, Closure $next): Response
    {
        // Tambahkan informasi dasar dari request
        Context::add([
            'url' => $request->url(),
            'method' => $request->method(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'trace_id' => Str::uuid()->toString(),
            'request_started' => now()->toISOString(),
        ]);
        
        // Tambahkan informasi otentikasi jika ada
        if (auth()->check()) {
            Context::add([
                'user_id' => auth()->id(),
                'user_email' => auth()->user()->email,
                'user_role' => auth()->user()->role ?? 'user',
            ]);
        } else {
            Context::add('user_type', 'guest');
        }
        
        // Tambahkan informasi route
        if ($route = $request->route()) {
            Context::add([
                'route_name' => $route->getName(),
                'route_action' => $route->getActionName(),
                'route_parameters' => $route->parameters()
            ]);
        }
        
        // Tambahkan informasi API (jika request API)
        if (Str::startsWith($request->path(), 'api/')) {
            Context::add('request_type', 'api');
            Context::add('api_version', $request->header('Accept-Version', 'v1'));
        } else {
            Context::add('request_type', 'web');
        }
        
        $response = $next($request);
        
        // Tambahkan informasi response
        Context::add([
            'response_status' => $response->getStatusCode(),
            'response_size' => strlen($response->getContent()),
            'request_duration' => now()->diffInSeconds(Context::get('request_started'))
        ]);
        
        return $response;
    }
}
```

#### 12.2 🎯 Contoh 2: Service Class dengan Context Penuh

**Deskripsi:** Service class yang menggunakan berbagai fungsi Context untuk pelacakan proses

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class DataProcessingService
{
    public function processUserData(array $userData): array
    {
        // Catat awal proses
        Context::push('process_log', [
            'step' => 'start',
            'timestamp' => now()->toISOString()
        ]);
        
        // Tambahkan informasi proses
        Context::add([
            'process_id' => Str::uuid()->toString(),
            'data_size' => count($userData),
            'process_type' => 'user_data_processing'
        ]);
        
        // Proses data dalam scope yang terpisah
        $processedData = Context::scope(
            function () use ($userData) {
                Context::add('current_step', 'validation');
                
                // Validasi data
                $this->validateData($userData);
                
                Context::add('current_step', 'transformation');
                
                // Transformasi data
                $transformedData = $this->transformData($userData);
                
                Context::add('current_step', 'enrichment');
                
                // Tambahkan informasi tambahan
                $enrichedData = $this->enrichData($transformedData);
                
                return $enrichedData;
            },
            data: [
                'validation_rules' => 'strict',
                'transformer_version' => 'v2'
            ]
        );
        
        // Catat selesai
        Context::push('process_log', [
            'step' => 'completed',
            'timestamp' => now()->toISOString(),
            'result_count' => count($processedData)
        ]);
        
        // Log hasil
        Log::info('Data processing completed', [
            'processed_count' => count($processedData),
            'process_duration' => now()->diffInSeconds(Context::get('process_started'))
        ]);
        
        return $processedData;
    }
    
    private function validateData(array $data)
    {
        Context::increment('validation_attempts');
        
        // Validasi logika
        foreach ($data as $item) {
            if (empty($item['email']) || !filter_var($item['email'], FILTER_VALIDATE_EMAIL)) {
                Context::increment('validation_errors');
                Context::push('validation_failures', [
                    'item' => $item,
                    'error' => 'Invalid email format'
                ]);
            }
        }
        
        Log::debug('Data validation completed');
    }
    
    private function transformData(array $data): array
    {
        Context::add('transformation_started', now()->toISOString());
        
        $result = [];
        foreach ($data as $item) {
            $result[] = [
                'id' => $item['id'] ?? null,
                'name' => trim($item['name'] ?? ''),
                'email' => strtolower(trim($item['email'] ?? '')),
                'created_at' => $item['created_at'] ?? now()->toISOString()
            ];
        }
        
        Context::add([
            'transformation_completed' => now()->toISOString(),
            'transformed_count' => count($result)
        ]);
        
        return $result;
    }
    
    private function enrichData(array $data): array
    {
        Context::add('enrichment_started', now()->toISOString());
        
        $enrichedData = [];
        foreach ($data as $item) {
            // Kaya dengan informasi tambahan dari API eksternal
            $geoInfo = $this->getLocationByIP($item['ip'] ?? null);
            
            $enrichedData[] = array_merge($item, [
                'location' => $geoInfo,
                'processed_at' => now()->toISOString(),
                'processor_id' => Context::get('process_id')
            ]);
        }
        
        Context::add([
            'enrichment_completed' => now()->toISOString(),
            'enriched_count' => count($enrichedData)
        ]);
        
        return $enrichedData;
    }
    
    private function getLocationByIP(?string $ip): array
    {
        if (!$ip) {
            return ['country' => 'Unknown', 'region' => 'Unknown'];
        }
        
        try {
            $response = Http::get("http://ip-api.com/json/{$ip}");
            $data = $response->json();
            
            return [
                'country' => $data['country'] ?? 'Unknown',
                'region' => $data['regionName'] ?? 'Unknown',
                'city' => $data['city'] ?? 'Unknown',
                'timezone' => $data['timezone'] ?? 'UTC'
            ];
        } catch (\Exception $e) {
            Log::warning('IP location lookup failed', ['ip' => $ip, 'error' => $e->getMessage()]);
            return ['country' => 'Unknown', 'region' => 'Unknown'];
        }
    }
}
```

#### 12.3 🚀 Contoh 3: Queue Job dengan Context Penuh

**Deskripsi:** Job yang memanfaatkan context yang di-dihydrate dari request asal

```php
<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Log;

class ProcessUserReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $user;
    public $reportType;
    public $options;

    public function __construct($user, string $reportType, array $options = [])
    {
        $this->user = $user;
        $this->reportType = $reportType;
        $this->options = $options;
    }

    public function handle()
    {
        Log::info('Starting user report processing', [
            'user_id' => $this->user->id,
            'report_type' => $this->reportType
        ]);
        
        // Context dari request asal otomatis tersedia!
        $originalUserId = Context::get('user_id'); // Dari request awal
        $originalTraceId = Context::get('trace_id'); // Dari request awal
        $userLocale = Context::getHidden('locale'); // Dari dehydrating
        
        // Gunakan context untuk maintain konsistensi
        if ($userLocale) {
            app()->setLocale($userLocale);
        }
        
        // Tambahkan context khusus job
        Context::add([
            'job_id' => $this->job->getJobId(),
            'job_started' => now()->toISOString(),
            'report_type' => $this->reportType,
            'original_request_user' => $originalUserId,
            'original_trace_id' => $originalTraceId
        ]);
        
        // Proses laporan
        $this->generateReport();
        
        Log::info('User report processing completed');
    }
    
    private function generateReport()
    {
        Context::push('report_steps', 'query_preparation_started');
        
        // Siapkan query
        $query = $this->buildReportQuery();
        
        Context::push('report_steps', 'data_fetching_started');
        
        // Ambil data
        $data = $query->get();
        
        Context::push('report_steps', 'data_processing_started');
        
        // Proses data
        $processedData = $this->processReportData($data);
        
        Context::push('report_steps', 'file_generation_started');
        
        // Generate file
        $filePath = $this->generateReportFile($processedData);
        
        Context::push('report_steps', 'notification_preparation_started');
        
        // Kirim notifikasi
        $this->sendNotification($filePath);
        
        Context::push('report_steps', 'completed');
        
        Context::add([
            'report_generated_at' => now()->toISOString(),
            'file_size' => filesize($filePath),
            'data_count' => count($processedData)
        ]);
        
        Log::info('Report generated successfully', [
            'file_path' => $filePath,
            'data_count' => count($processedData)
        ]);
    }
    
    private function buildReportQuery()
    {
        $query = DB::table('user_activities');
        
        if ($this->options['date_from'] ?? false) {
            $query->where('created_at', '>=', $this->options['date_from']);
        }
        
        if ($this->options['date_to'] ?? false) {
            $query->where('created_at', '<=', $this->options['date_to']);
        }
        
        return $query->where('user_id', $this->user->id);
    }
    
    private function processReportData($data)
    {
        // Proses dan transformasi data untuk laporan
        return $data->map(function ($item) {
            return [
                'date' => $item->created_at->format('Y-m-d'),
                'action' => $item->action,
                'details' => json_decode($item->details, true)
            ];
        })->toArray();
    }
    
    private function generateReportFile($data)
    {
        $fileName = "report_{$this->user->id}_" . now()->timestamp . ".csv";
        $filePath = storage_path("app/reports/{$fileName}");
        
        $file = fopen($filePath, 'w');
        fputcsv($file, ['Date', 'Action', 'Details']);
        
        foreach ($data as $row) {
            fputcsv($file, [
                $row['date'],
                $row['action'],
                json_encode($row['details'])
            ]);
        }
        
        fclose($file);
        
        return $filePath;
    }
    
    private function sendNotification($filePath)
    {
        // Kirim notifikasi ke user bahwa laporan siap
        $this->user->notify(new ReportReadyNotification($filePath));
    }
}
```

#### 12.4 ⚙️ Contoh 4: Service Provider dengan Context Events

**Deskripsi:** Setup Context events di service provider untuk maintain lingkungan aplikasi

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Context;
use Illuminate\Log\Context\Repository;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class ContextServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Setup dehydrating - simpan konteks saat job di-dispatch
        Context::dehydrating(function (Repository $context) {
            // Simpan konfigurasi aplikasi
            $context->addHidden('app_locale', Config::get('app.locale'));
            $context->addHidden('app_timezone', Config::get('app.timezone'));
            $context->addHidden('app_env', Config::get('app.env'));
            
            // Simpan user context jika ada
            if (Auth::check()) {
                $context->add('current_user_id', Auth::id());
                $context->add('current_user_role', Auth::user()->role ?? 'user');
                
                // Simpan user preferences
                $context->addHidden('user_preferences', [
                    'timezone' => Auth::user()->timezone ?? 'UTC',
                    'locale' => Auth::user()->locale ?? Config::get('app.locale'),
                    'theme' => Auth::user()->theme ?? 'light'
                ]);
            }
            
            // Simpan session context penting
            $context->addHidden('session_data', [
                'cart_items' => session('cart', []),
                'last_activity' => session('last_activity', now()->toISOString())
            ]);
            
            // Simpan cache context jika diperlukan
            if (Cache::has('maintenance_mode')) {
                $context->add('maintenance_mode', Cache::get('maintenance_mode'));
            }
        });
        
        // Setup hydrated - kembalikan konteks saat job dijalankan
        Context::hydrated(function (Repository $context) {
            // Kembalikan locale dan timezone aplikasi
            if ($context->hasHidden('app_locale')) {
                app()->setLocale($context->getHidden('app_locale'));
                Config::set('app.locale', $context->getHidden('app_locale'));
            }
            
            if ($context->hasHidden('app_timezone')) {
                Config::set('app.timezone', $context->getHidden('app_timezone'));
                date_default_timezone_set($context->getHidden('app_timezone'));
            }
            
            // Kembalikan user preferences
            if ($context->hasHidden('user_preferences')) {
                $preferences = $context->getHidden('user_preferences');
                
                if (isset($preferences['timezone'])) {
                    date_default_timezone_set($preferences['timezone']);
                }
                
                if (isset($preferences['locale'])) {
                    app()->setLocale($preferences['locale']);
                }
            }
            
            // Kembalikan session data penting
            if ($context->hasHidden('session_data')) {
                $sessionData = $context->getHidden('session_data');
                session(['cart' => $sessionData['cart_items'] ?? []]);
            }
            
            // Kembalikan maintenance mode jika diperlukan
            if ($context->has('maintenance_mode')) {
                if ($context->get('maintenance_mode')) {
                    Cache::put('maintenance_mode', true, now()->addMinutes(5));
                }
            }
            
            // Set user ID context jika ada
            if ($context->has('current_user_id')) {
                // Catat bahwa kita sedang mengembalikan konteks user
                Context::add('context_restored_for_user', $context->get('current_user_id'));
            }
        });
        
        Log::debug('Context events registered');
    }
}
```

**Penjelasan Contoh:**
1. Middleware menyimpan semua informasi request ke context
2. Service class menggunakan berbagai fungsi context untuk pelacakan
3. Job memanfaatkan context yang di-dihydrate
4. Service provider mengatur persistensi context antar request dan job

Setiap contoh menunjukkan penggunaan Context dalam skenario dunia nyata dengan pendekatan yang aman dan efisien.



## Bagian 7: Menjadi Master Context 🏆

### 13. ✨ Wejangan dari Guru

Setelah kamu menempuh perjalanan panjang bersama Guru dalam mempelajari Context di Laravel, inilah **wejangan bijak** yang harus kamu ingat:

**1. 🧠 Gunakan Context dengan Bijak**
- Context adalah alat yang ampuh, bukan mainan
- Gunakan hanya untuk informasi yang benar-benar membantu debugging dan tracing
- Jangan berlebihan - terlalu banyak context bisa membuat log berat dan susah dibaca

**2. 🔐 Jaga Keamanan Data**
- Selalu gunakan `addHidden` untuk data sensitif
- Jangan pernah menyimpan password, token, atau data pribadi di context publik
- Sering-seringlah membersihkan hidden data setelah selesai digunakan

**3. 🎯 Fokus pada Observability**
- Context adalah salah satu pilar utama dalam membuat aplikasi yang mudah di-debug
- Kombinasikan dengan logging yang baik untuk observability maksimal
- Gunakan context untuk membuat "jejak roti" (breadcrumb) yang memudahkan tracing error

**4. 🔄 Latih dan Uji Terus**
- Terus latih penggunaan context dalam berbagai skenario
- Uji bagaimana context bekerja dalam queue, command, dan request yang kompleks
- Debug bersama tim untuk memastikan semua bisa memanfaatkan context dengan baik

### 14. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah **referensi cepat** untuk berbagai fitur Context di Laravel:

#### 🔧 Operasi Dasar Context
| Perintah | Fungsi |
|----------|--------|
| `Context::add('key', 'value')` | Tambah data ke context publik |
| `Context::add(['key1' => 'val1', 'key2' => 'val2'])` | Tambah banyak data sekaligus |
| `Context::get('key')` | Ambil data dari context |
| `Context::get('key', 'default')` | Ambil data dengan default value |
| `Context::has('key')` | Cek apakah key ada |
| `Context::missing('key')` | Cek apakah key tidak ada |
| `Context::forget('key')` | Hapus satu key |
| `Context::forget(['key1', 'key2'])` | Hapus banyak key sekaligus |

#### 📚 Stack Operations
| Perintah | Fungsi |
|----------|--------|
| `Context::push('stack_name', 'value')` | Tambah ke stack |
| `Context::push('stack_name', 'val1', 'val2')` | Tambah banyak item ke stack |
| `Context::pop('stack_name')` | Ambil dan hapus item terakhir dari stack |
| `Context::stackContains('stack_name', 'value')` | Cek keberadaan nilai di stack |
| `Context::get('stack_name')` | Ambil semua item dari stack |

#### 🔐 Hidden Context Operations
| Perintah | Fungsi |
|----------|--------|
| `Context::addHidden('key', 'sensitive')` | Tambah data ke hidden context |
| `Context::getHidden('key')` | Ambil dari hidden context |
| `Context::hasHidden('key')` | Cek hidden key |
| `Context::forgetHidden('key')` | Hapus dari hidden context |
| `Context::allHidden()` | Ambil semua hidden context |
| `Context::pullHidden('key')` | Ambil dan hapus dari hidden context |

#### ⚡ Advanced Operations
| Perintah | Fungsi |
|----------|--------|
| `Context::scope(fn, data: [], hidden: [])` | Jalankan dalam scope sementara |
| `Context::only(['key1', 'key2'])` | Ambil hanya beberapa key |
| `Context::except(['key1'])` | Ambil semua kecuali beberapa key |
| `Context::all()` | Ambil semua context publik |
| `Context::pull('key')` | Ambil dan hapus |
| `Context::remember('key', fn)` | Cache value jika belum ada |
| `Context::increment('counter')` | Tambah counter |
| `Context::decrement('counter')` | Kurangi counter |

#### 📢 Event Hooks
| Perintah | Fungsi |
|----------|--------|
| `Context::dehydrating(fn)` | Hook sebelum job di-dispatch |
| `Context::hydrated(fn)` | Hook saat job dijalankan |
| `Context::when(condition, fn, fn)` | Tambah context kondisional |

### 15. 🎯 Kesimpulan Akhir

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Context, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Context adalah fitur yang **sangat powerful** untuk meningkatkan observability aplikasi Laravel-mu.

Dengan Context, kamu bisa:
- Memperkaya log dengan metadata yang relevan
- Mengirim informasi dari request ke queue job
- Menyimpan data sensitif dengan aman
- Melacak eksekusi aplikasi dengan akurat
- Membuat debugging jauh lebih mudah dan cepat

`Context` adalah alat yang sangat berguna untuk memperkaya log, mengirim metadata ke job queue, dan menyimpan data tersembunyi yang tidak seharusnya muncul pada log. Dengan penggunaan yang benar (hidden data, scope, dehydrating/hydrated), observability aplikasi Laravel Anda akan meningkat **signifikan**.

**Jangan pernah berhenti belajar dan mencoba.** Implementasikan Context di proyekmu, dan kamu akan melihat betapa berharganya fitur ini dalam dunia nyata. Selamat ngoding, murid kesayanganku!





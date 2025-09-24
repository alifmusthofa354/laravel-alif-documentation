# 🚦 Routing di Laravel - Panduan Lengkap untuk Pemula

Hai muridku yang hebat! Hari ini kita akan belajar tentang **Routing** di Laravel - sebuah konsep penting yang menjadi dasar dari setiap aplikasi web. Seperti biasa, aku akan menjelaskan semuanya seolah-olah aku duduk di sebelahmu, dengan sabar dan mudah dipahami.

---

## Bagian 1: Memahami Dasar-Dasar Routing 🏁

### 1. 📖 Apa Itu Routing Sebenarnya?

**Analogi Sederhana:** Bayangkan kamu adalah seorang kurir pizza. Ada banyak alamat yang harus kamu datangi, masing-masing dengan pesanan berbeda:

- Alamat `www.toko.com/` → kamu antarkan halaman beranda (home page)
- Alamat `www.toko.com/tentang` → kamu antarkan halaman tentang (about page)
- Alamat `www.toko.com/user/123` → kamu antarkan profil user dengan ID 123

**Routing adalah peta jalan** yang memberi tahu Laravel kemana harus pergi dan apa yang harus dilakukan ketika seseorang mengakses URL tertentu.

**Kenapa Ini Penting?**
- Membantu mengorganisir request ke aplikasi kamu
- Menentukan bagian mana dari aplikasi yang akan menangani request tertentu
- Memungkinkan pembuatan URL yang rapi dan SEO-friendly

### 2. 🧭 Letak File Route dan Struktur Dasar

File route disimpan di folder `routes/` di aplikasi Laravel kamu:

```
routes/
├── web.php         ← untuk aplikasi web (dengan session & cookie)
├── api.php         ← untuk API (stateless)
├── console.php     ← untuk Artisan commands
└── channels.php    ← untuk broadcasting
```

**Perbedaan Web vs API:**
- `web.php`: Digunakan untuk aplikasi web biasa, sudah memiliki middleware `web` (session, cookie, CSRF protection)
- `api.php`: Digunakan untuk API, memiliki middleware `api` (stateless, rate limiting)

### 3. ⚡ Basic Routing - Langkah Pertama

Mari kita mulai dengan contoh paling dasar - membuat route yang menampilkan pesan sederhana:

```php
// routes/web.php
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return 'Selamat datang di halaman utama!';
});

Route::get('/about', function () {
    return 'Ini adalah halaman tentang kami.';
});
```

**Penjelasan Kode:**
- `Route::get()` → Menentukan method HTTP (dalam hal ini GET)
- `'/'` → Path URL (root/homepage)
- `function() { ... }` → Closure function yang akan dieksekusi saat route diakses

### 4. 📝 HTTP Methods yang Umum

Laravel mendukung semua method HTTP yang umum digunakan:

```php
// routes/web.php
use Illuminate\Support\Facades\Route;

// GET: Untuk membaca/menampilkan data
Route::get('/users', function () {
    return 'Daftar semua pengguna';
});

// POST: Untuk mengirim data baru
Route::post('/users', function () {
    return 'Membuat pengguna baru';
});

// PUT: Untuk mengupdate data (mengganti seluruh resource)
Route::put('/users/{id}', function ($id) {
    return "Update pengguna dengan ID: $id";
});

// PATCH: Untuk mengupdate sebagian data
Route::patch('/users/{id}', function ($id) {
    return "Update sebagian data pengguna dengan ID: $id";
});

// DELETE: Untuk menghapus data
Route::delete('/users/{id}', function ($id) {
    return "Hapus pengguna dengan ID: $id";
});
```

**Cara Lain untuk Menentukan Multiple Methods:**
```php
// route yang bisa menerima POST, PUT, dan PATCH
Route::match(['post', 'put', 'patch'], '/user', function () {
    return 'Method yang diperbolehkan: POST, PUT, PATCH';
});

// route yang bisa menerima semua method
Route::any('/all-methods', function () {
    return 'Bisa menerima semua HTTP method';
});
```

---

## Bagian 2: Route Parameters - Data dari URL 📥

### 5. 📍 Route Parameters Wajib

Fitur ini memungkinkan kamu mengambil bagian dari URL sebagai variabel:

```php
// routes/web.php
Route::get('/user/{id}', function ($id) {
    return "Menampilkan pengguna dengan ID: $id";
});

Route::get('/posts/{post}/comments/{comment}', function ($post, $comment) {
    return "Menampilkan komentar $comment dari post $post";
});
```

**Contoh URL yang valid:**
- `/user/123` → `$id = 123`
- `/posts/5/comments/10` → `$post = 5`, `$comment = 10`

### 6. 📍 Route Parameters Opsional

Kadang kamu ingin parameter tidak wajib (boleh kosong):

```php
// routes/web.php
Route::get('/user/{name?}', function ($name = null) {
    if ($name) {
        return "Halo, $name!";
    } else {
        return "Halo, tamu!";
    }
});

// Atau dengan default value
Route::get('/page/{name?}', function ($name = 'home') {
    return "Menampilkan halaman: $name";
});
```

### 7. 🔒 Route Constraints - Memvalidasi Format Parameter

Kamu bisa membatasi format parameter dengan regex atau constraint bawaan Laravel:

```php
// routes/web.php

// Menggunakan where() dengan regex
Route::get('/user/{id}', function ($id) {
    return "Menampilkan user: $id";
})->where('id', '[0-9]+'); // hanya angka

// Constraint bawaan Laravel
Route::get('/user/{id}', function ($id) {
    return "User ID: $id";
})->whereNumber('id'); // hanya angka

Route::get('/profile/{username}', function ($username) {
    return "Profil: $username";
})->whereAlpha('username'); // hanya huruf

Route::get('/post/{slug}', function ($slug) {
    return "Post: $slug";
})->whereAlphaNumeric('slug'); // huruf dan angka

Route::get('/post/{id}', function ($id) {
    return "Post ID: $id";
})->whereUuid('id'); // hanya UUID

Route::get('/order/{id}', function ($id) {
    return "Order ID: $id";
})->whereUlid('id'); // hanya ULID

// Multiple constraints
Route::get('/product/{category}/{id}', function ($category, $id) {
    return "Kategori: $category, ID: $id";
})->where(['category' => '[a-zA-Z]+', 'id' => '[0-9]+']);

// Pilihan tertentu
Route::get('/category/{type}', function ($type) {
    return "Kategori: $type";
})->whereIn('type', ['movie', 'music', 'book']);
```

---

## Bagian 3: Named Routes & Route Groups - Organisasi yang Lebih Baik 🗂️

### 8. 🏷️ Named Routes - Memberi Nama pada Route

Memberi nama pada route membuatnya lebih mudah untuk diacu di tempat lain:

```php
// routes/web.php
Route::get('/profile', function () {
    return view('profile');
})->name('profile');

Route::get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

Route::get('/user/{id}', function ($id) {
    return view('user.show', compact('id'));
})->name('user.show');
```

**Menggunakan Named Routes:**
```blade
<!-- Di file Blade -->
<a href="{{ route('profile') }}">Profil Saya</a>
<a href="{{ route('user.show', ['id' => 123]) }}">Lihat User</a>

<!-- Di controller atau route untuk redirect -->
return redirect()->route('profile');
return redirect()->route('user.show', ['id' => $user->id]);
```

### 9. 🧩 Route Groups - Mengorganisir Route Secara Logis

Route groups memungkinkan kamu menerapkan middleware, prefix, namespace, atau nama secara bersamaan:

#### A. Middleware Groups
```php
// routes/web.php
use App\Http\Controllers\UserController;

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [UserController::class, 'dashboard'])->name('dashboard');
    Route::get('/profile', [UserController::class, 'profile'])->name('profile');
    Route::post('/profile/update', [UserController::class, 'update'])->name('profile.update');
});

// Group yang lebih kompleks
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
    Route::resource('users', UserController::class);
});
```

#### B. Prefix Groups
```php
// Memberi prefix ke grup route
Route::prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('admin.users');
    Route::get('/settings', [AdminController::class, 'settings'])->name('admin.settings');
});

// Dengan parameter
Route::prefix('api/v1')->group(function () {
    Route::get('/users', [Api\UserController::class, 'index']);
    Route::post('/users', [Api\UserController::class, 'store']);
});
```

#### C. Name Groups
```php
// Memberi prefix nama ke route
Route::name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard'); // admin.dashboard
    Route::get('/users', [AdminController::class, 'users'])->name('users'); // admin.users
    Route::get('/posts', [PostController::class, 'index'])->name('posts.index'); // admin.posts.index
});
```

#### D. Domain Groups
```php
// Route untuk subdomain tertentu
Route::domain('{account}.myapp.com')->group(function () {
    Route::get('/dashboard', function ($account) {
        return "Dashboard untuk akun: $account";
    });
});
```

#### E. Controller Groups
```php
// Menentukan controller untuk grup route
Route::controller(UserController::class)->group(function () {
    Route::get('/users/{user}', 'show');
    Route::get('/users/{user}/edit', 'edit');
    Route::patch('/users/{user}', 'update');
});
```

---

## Bagian 4: Route Model Binding - Hubungan Langsung dengan Data 🧬

### 10. 📊 Implicit Binding (Otomatis)

Laravel secara otomatis mengikat parameter route ke model Eloquent:

```php
// routes/web.php
use App\Models\User;
use App\Http\Controllers\UserController;

// Laravel akan otomatis mencari user dengan ID yang sesuai
Route::get('/user/{user}', function (User $user) {
    return view('user.profile', compact('user'));
});

// Bisa juga digunakan di controller
Route::get('/user/{user}', [UserController::class, 'show']);
```

```php
// app/Http/Controllers/UserController.php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\View\View;

class UserController extends Controller
{
    public function show(User $user): View  // $user sudah otomatis diambil dari database
    {
        return view('user.show', compact('user'));
    }
}
```

### 11. 📊 Explicit Binding (Manual)

Kamu bisa menentukan sendiri bagaimana binding dilakukan:

```php
// routes/web.php
use App\Models\User;
use Illuminate\Support\Facades\Route;

// Binding dengan column tertentu
Route::get('/user/{user:username}', function (User $user) {
    return view('user.profile', compact('user'));
})->where('user', '[A-Za-z]+');

// Custom binding di RouteServiceProvider
// app/Providers/RouteServiceProvider.php
public function boot()
{
    Route::model('user', User::class);
    
    // Atau binding lebih lanjut
    Route::bind('user', function ($value) {
        return User::where('username', $value)->firstOrFail();
    });
}
```

---

## Bagian 5: Fitur Lainnya yang Penting 🛠️

### 12. 🔄 Redirect Routes

Membuat route yang otomatis mengarahkan ke URL lain:

```php
// routes/web.php
// Redirect permanen (301)
Route::redirect('/here', '/there', 301);

// Redirect sementara (302) - default
Route::redirect('/old-home', '/new-home');

// Redirect ke named route
Route::get('/old-profile', function () {
    return redirect()->route('profile');
});
```

### 13. 📄 View Routes

Route yang langsung menampilkan view tanpa controller:

```php
// routes/web.php
// Menampilkan view langsung
Route::view('/welcome', 'welcome');
Route::view('/contact', 'contact');

// Dengan data
Route::view('/about', 'about', ['company' => 'Laravel Co.']);

// Dengan parameter
Route::view('/user/{name}', 'user.profile');
```

### 14. 🚨 Fallback Routes

Route yang dijalankan ketika tidak ada route lain yang cocok:

```php
// routes/web.php
// Harus ditempatkan di akhir file

// Fallback biasa
Route::fallback(function () {
    return view('errors.404');
});

// Fallback API
Route::fallback(function () {
    return response()->json([
        'message' => 'Route tidak ditemukan',
        'status_code' => 404
    ], 404);
});
```

### 15. 🛡️ CSRF Protection dalam Routing

CSRF (Cross-Site Request Forgery) adalah fitur keamanan yang harus kamu gunakan:

```blade
<!-- Di file Blade form -->
<form method="POST" action="/profile">
    @csrf
    <!-- atau -->
    <input type="hidden" name="_token" value="{{ csrf_token() }}">
    
    <input type="text" name="name">
    <button type="submit">Simpan</button>
</form>
```

```php
// routes/web.php - CSRF otomatis aktif di web.php
// Tapi kamu bisa mengecualikannya
Route::post('/webhook', function () {
    // ...
})->withoutMiddleware(['web']);
```

---

## Bagian 6: Rate Limiting & Caching Routes 🚀

### 16. ⏱️ Rate Limiting

Membatasi jumlah request per user:

```php
// app/Providers/RouteServiceProvider.php atau app/Providers/AppServiceProvider.php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

public function boot()
{
    // Rate limiter global
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });
    
    // Rate limiter spesifik
    RateLimiter::for('login', function (Request $request) {
        return Limit::perMinute(5)->by($request->ip());
    });
}

// routes/api.php
Route::middleware('throttle:api')->group(function () {
    Route::get('/user', function () { /* ... */ });
    Route::post('/post', function () { /* ... */ });
});

// Rate limit spesifik
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
```

### 17. 🗂️ Route Caching

Meningkatkan kinerja aplikasi dengan mengcache definisi route:

```bash
# Membuat cache route
php artisan route:cache

# Membersihkan cache route
php artisan route:clear

# Melihat daftar route
php artisan route:list
php artisan route:list -v  # versi terperinci
php artisan route:list --path=api  # hanya route dengan 'api' di path
php artisan route:list --except-vendor  # kecuali route dari package
```

---

## Bagian 7: Route dengan Controller 🔧

### 18. 🎛️ Controller Basics

Menghubungkan route ke controller (sudah dijelaskan lebih detail di dokumentasi controller, tapi ini dasarnya):

```php
// routes/web.php
use App\Http\Controllers\UserController;

// Single action
Route::get('/user/{id}', [UserController::class, 'show']);

// Multiple actions
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/create', [UserController::class, 'create']);
Route::get('/users/{user}', [UserController::class, 'show']);
Route::get('/users/{user}/edit', [UserController::class, 'edit']);
Route::put('/users/{user}', [UserController::class, 'update']);
Route::delete('/users/{user}', [UserController::class, 'destroy']);
```

### 19. 📦 Resource Controllers

Cara cepat membuat semua route CRUD:

```php
// routes/web.php
use App\Http\Controllers\PostController;

// Ini akan membuat semua route CRUD secara otomatis
Route::resource('posts', PostController::class);

// Jika hanya ingin beberapa route
Route::resource('posts', PostController::class)->only(['index', 'show']);
Route::resource('posts', PostController::class)->except(['create', 'edit']);

// Multiple resources
Route::resources([
    'photos' => PhotoController::class,
    'posts' => PostController::class,
]);

// API resources (tanpa create dan edit)
Route::apiResource('api/posts', PostController::class);
```

**Route yang dihasilkan oleh `Route::resource('posts', PostController::class)`:**
```
Verb        | Path                | Action      | Route Name
GET         | /posts              | index       | posts.index
GET         | /posts/create       | create      | posts.create
POST        | /posts              | store       | posts.store
GET         | /posts/{post}       | show        | posts.show
GET         | /posts/{post}/edit  | edit        | posts.edit
PUT/PATCH   | /posts/{post}       | update      | posts.update
DELETE      | /posts/{post}       | destroy     | posts.destroy
```

---

## Bagian 8: Route Conditionals & Advanced Features 🧠

### 20. 🧪 Conditional Routes

Menentukan route berdasarkan kondisi tertentu:

```php
// routes/web.php
// Hanya aktif di environment tertentu
Route::get('/debug', function () {
    return 'Debug info';
})->middleware('local'); // hanya di local environment

// Berdasarkan user status
Route::when('admin/*', 'auth'); // semua route dengan prefix admin harus login
```

### 21. 🎚️ Subdomain Routing

Menggunakan subdomain untuk route yang berbeda:

```php
// routes/web.php
// Route untuk subdomain tertentu
Route::domain('{account}.myapp.com')->group(function () {
    Route::get('/dashboard', function ($account) {
        return "Dashboard untuk: $account";
    });
    
    Route::get('/settings', function ($account) {
        return "Pengaturan untuk: $account";
    });
});

// Route untuk subdomain statis
Route::domain('api.myapp.com')->group(function () {
    Route::get('/users', function () {
        return response()->json(['users' => []]);
    });
});
```

### 22. 📐 Route Parameter Patterns (Global Constraints)

Menetapkan pattern global untuk parameter:

```php
// app/Providers/RouteServiceProvider.php
public function boot()
{
    // Menetapkan pola default untuk parameter {id}
    Route::pattern('id', '[0-9]+');
}
```

---

## Bagian 9: Tips & Best Practices 💡

### 23. 📋 Route Organization Best Practices

1. **Gunakan Route Groups**: Organisir route terkait dalam grup
2. **Berikan Nama yang Jelas**: Gunakan nama route yang deskriptif
3. **Gunakan Resource Controller**: Untuk CRUD operations
4. **Letakkan Route Umum di Awal**: Fallback dan catch-all routes di akhir
5. **Gunakan Constraint**: Validasi format parameter di route

### 24. 👨‍🏫 Contoh Implementasi Lengkap

Mari kita buat contoh aplikasi sederhana dengan berbagai fitur routing:

```php
// routes/web.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    HomeController,
    UserController,
    PostController,
    AuthController
};

// Guest routes (tanpa middleware)
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/contact', [HomeController::class, 'contact'])->name('contact');

// Authentication routes
Route::controller(AuthController::class)->group(function () {
    Route::get('/login', 'showLoginForm')->name('login');
    Route::post('/login', 'login');
    Route::post('/logout', 'logout')->name('logout');
    Route::get('/register', 'showRegistrationForm')->name('register');
    Route::post('/register', 'register');
});

// Protected routes (dengan auth middleware)
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
    
    // User profile
    Route::prefix('profile')->group(function () {
        Route::get('/', [UserController::class, 'show'])->name('profile.show');
        Route::get('/edit', [UserController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [UserController::class, 'update'])->name('profile.update');
    });
    
    // Posts
    Route::resource('posts', PostController::class);
    
    // Admin routes
    Route::middleware(['role:admin'])->name('admin.')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');
        Route::resource('users', Admin\UserController::class);
    });
});

// Fallback route HARUS di akhir
Route::fallback(function () {
    return view('errors.404');
});
```

```php
// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostController;

// API routes dengan rate limiting
Route::middleware(['throttle:api'])->group(function () {
    Route::apiResource('posts', PostController::class);
    
    // API routes tambahan
    Route::get('/posts/popular', [PostController::class, 'popular']);
    Route::post('/posts/{post}/like', [PostController::class, 'like']);
});

// API route untuk guest
Route::get('/posts/public', [PostController::class, 'publicIndex']);
```

---

## 10. 📚 Cheat Sheet & Referensi Cepat

### 🚦 HTTP Methods
```
GET     → Membaca data
POST    → Membuat data baru
PUT     → Mengupdate semua data
PATCH   → Mengupdate sebagian data
DELETE  → Menghapus data
```

### 🔒 Route Constraints
```
->whereNumber('id')          → Hanya angka
->whereAlpha('name')         → Hanya huruf
->whereAlphaNumeric('slug')  → Huruf dan angka
->whereUuid('id')            → Hanya UUID
->whereUlid('id')            → Hanya ULID
->whereIn('type', [...])     → Pilihan tertentu
```

### 🏷️ Named Routes
```
->name('route.name')         → Memberi nama route
route('route.name')          → Dapatkan URL dari nama route
redirect()->route('name')    → Redirect ke named route
```

### 🧩 Route Groups
```
middleware(['auth'])         → Tambahkan middleware
prefix('admin')              → Tambahkan prefix ke path
name('admin.')               → Tambahkan prefix ke nama route
domain('{account}.com')      → Gunakan subdomain
controller(Controller::class)→ Tentukan controller untuk grup
```

### 📦 Resource Routes
```
Route::resource('posts', PostController::class)
→ Membuat semua route CRUD secara otomatis
→ Hanya beberapa: ->only([...]), semua kecuali: ->except([...])
```

### 🚀 CLI Commands
```
php artisan route:list          → Lihat semua route
php artisan route:cache         → Cache route untuk performa
php artisan route:clear         → Hapus cache route
```

---

## 11. 🎯 Kesimpulan

Routing adalah fondasi penting dalam setiap aplikasi Laravel. Dengan memahami konsep dan fitur routing dengan baik:

- Kamu bisa membuat aplikasi web yang terorganisir dengan baik
- URL menjadi rapi dan SEO-friendly
- Akses ke fitur bisa diatur dengan middleware
- Dapat dengan mudah mengelompokkan route berdasarkan fungsinya

Ingat selalu untuk:
- Menempatkan route umum di awal dan route fallback di akhir
- Menggunakan route groups untuk mengorganisir route secara logis
- Memberi nama pada route untuk kemudahan referensi
- Menggunakan constraint untuk validasi parameter

Luar biasa! Sekarang kamu sudah memahami dasar-dasar hingga fitur lanjut dari routing di Laravel. Selamat mengembangkan aplikasi kamu!

Kalau kamu ingin belajar lebih lanjut tentang controller dan bagaimana menggunakannya dengan route, kamu bisa membaca dokumentasi Controller yang juga sudah aku buat dengan pendekatan yang sama. Selamat ngoding, muridku!
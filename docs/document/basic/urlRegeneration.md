# 🔗 URL Generation di Laravel - Panduan Lengkap untuk Pemula

Hai muridku yang hebat! Hari ini kita akan belajar tentang **URL Generation** di Laravel - sistem penting yang memungkinkan kamu membuat URL dengan cara yang dinamis, aman, dan terorganisir. Seperti biasa, aku akan menjelaskan semuanya dengan bahasa yang mudah dan contoh kode yang bisa kamu coba sendiri.

---

## Bagian 1: Memahami Konsep Dasar URL Generation 🎯

### 1. 📖 Apa Itu URL Generation?

**Analogi Senerhana:** Bayangkan kamu adalah seorang resepsionis di sebuah hotel besar. Tamu sering bertanya "Bagaimana cara ke restoran?", "Di mana lokasi gym?", "Bagaimana menuju ke kolam renang?". Daripada memberikan arah yang panjang setiap kali, kamu memiliki **peta hotel** yang sudah menunjukkan semua lokasi penting dengan jelas.

**URL Generation di Laravel adalah seperti peta hotel ini** - sistem yang membantu kamu membuat alamat URL dengan cepat dan akurat tanpa harus mengetik alamat lengkap setiap kali.

### 2. 💡 Mengapa URL Generation Penting?

Tanpa URL Generation yang baik, aplikasi kamu bisa menghadapi masalah serius:

- **Hardcoding URL** - Mengecambahkan URL secara manual di mana-mana
- **Maintenance Sulit** - Ketika struktur URL berubah, harus ubah di banyak tempat
- **Security Risk** - URL tidak diverifikasi keasliannya
- **Flexibility Kurang** - Sulit menyesuaikan URL untuk berbagai environment
- **User Experience Buruk** - URL tidak konsisten atau tidak ramah

### 3. 🛡️ Cara Kerja URL Generation di Laravel

```
Aplikasi → [Laravel URL Generator] → URL yang Valid dan Konsisten
        ↑                           ↓
   Mudah digunakan         Bisa disesuaikan untuk berbagai kebutuhan
```

---

## Bagian 2: Dasar-Dasar URL Generation ⚙️

### 4. 🎛️ Helper url() - Generator URL Sederhana

Helper `url()` adalah cara paling dasar untuk membuat URL:

```php
// Membuat URL dasar
echo url('/');
// Hasil: http://example.com

// Membuat URL dengan path
echo url('/users');
// Hasil: http://example.com/users

// Membuat URL dengan parameter
$post = App\Models\Post::find(1);
echo url("/posts/{$post->id}");
// Hasil: http://example.com/posts/1

// Membuat URL dengan query string menggunakan query()
echo url()->query('/posts', ['search' => 'Laravel']);
// Hasil: http://example.com/posts?search=Laravel

// Mengganti query string yang sudah ada
echo url()->query('/posts?sort=latest', ['sort' => 'oldest']);
// Hasil: http://example.com/posts?sort=oldest
```

### 5. 📡 Mengakses Informasi URL Saat Ini

Mengambil informasi tentang URL yang sedang digunakan:

```php
// URL saat ini tanpa query string
$currentUrl = url()->current();
// Contoh: http://example.com/users/123

// URL saat ini dengan query string
$fullUrl = url()->full();
// Contoh: http://example.com/users/123?page=2&sort=name

// URL request sebelumnya
$previousUrl = url()->previous();
// Contoh: http://example.com/login

// Path dari request sebelumnya
$previousPath = url()->previousPath();
// Contoh: /login

// Menggunakan Facade (alternatif)
use Illuminate\Support\Facades\URL;

echo URL::current();
echo URL::full();
echo URL::previous();
```

### 6. 🧮 Menggunakan Query String dalam URL

```php
// Array sederhana sebagai query string
echo url()->query('/search', ['q' => 'Laravel tutorial']);
// Hasil: http://example.com/search?q=Laravel+tutorial

// Array kompleks
echo url()->query('/filter', [
    'categories' => ['php', 'javascript'],
    'tags' => ['beginner', 'intermediate']
]);
// Hasil: http://example.com/filter?categories%5B0%5D=php&categories%5B1%5D=javascript&tags%5B0%5D=beginner&tags%5B1%5D=intermediate

// Decode untuk melihat format yang lebih mudah dibaca
$url = url()->query('/filter', ['categories' => ['php', 'javascript']]);
echo urldecode($url);
// Hasil: http://example.com/filter?categories[0]=php&categories[1]=javascript

// Menggabungkan dengan fragment/anchor
echo url('/documentation#installation');
// Hasil: http://example.com/documentation#installation
```

---

## Bagian 3: Named Routes - Sistem Routing yang Kuat 🚀

### 7. 🎯 Apa Itu Named Routes?

Named routes adalah sistem yang memungkinkan kamu memberi nama pada route, sehingga bisa memanggilnya dengan nama daripada path lengkap:

```php
// routes/web.php
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;

// Memberi nama pada route
Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');

// Route dengan parameter kompleks
Route::get('/users/{user}/posts/{post}', [PostController::class, 'userPost'])->name('users.posts.show');
```

### 8. 🏗️ Membuat URL dengan Named Routes

```php
// Route sederhana tanpa parameter
echo route('posts.index');
// Hasil: http://example.com/posts

// Route dengan parameter
echo route('posts.show', ['post' => 1]);
// Hasil: http://example.com/posts/1

// Route dengan parameter kompleks
echo route('users.posts.show', ['user' => 1, 'post' => 3]);
// Hasil: http://example.com/users/1/posts/3

// Route dengan parameter tambahan sebagai query string
echo route('posts.show', ['post' => 1, 'preview' => 'true']);
// Hasil: http://example.com/posts/1?preview=true

// Route dengan model Eloquent langsung
$post = App\Models\Post::find(1);
echo route('posts.show', ['post' => $post]);
// Hasil: http://example.com/posts/1
```

### 9. 🎨 Contoh Penggunaan dalam Controller

```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class PostController extends Controller
{
    public function index(): View
    {
        $posts = Post::latest()->paginate(10);
        
        // Menggunakan route() untuk membuat pagination links
        return view('posts.index', compact('posts'));
    }
    
    public function show(Post $post): View
    {
        return view('posts.show', compact('post'));
    }
    
    public function create(): View
    {
        return view('posts.create');
    }
    
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string'
        ]);
        
        $post = Post::create($validated);
        
        // Redirect menggunakan named route
        return redirect()->route('posts.show', $post)
            ->with('success', 'Post berhasil dibuat!');
    }
    
    public function edit(Post $post): View
    {
        return view('posts.edit', compact('post'));
    }
    
    public function update(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string'
        ]);
        
        $post->update($validated);
        
        // Redirect dengan pesan sukses
        return redirect()->route('posts.show', $post)
            ->with('success', 'Post berhasil diperbarui!');
    }
    
    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();
        
        // Redirect ke index dengan pesan
        return redirect()->route('posts.index')
            ->with('success', 'Post berhasil dihapus!');
    }
}
```

### 10. 🖼️ Penggunaan di Blade Template

```blade
{{-- resources/views/posts/index.blade.php --}}
@extends('layouts.app')

@section('title', 'Daftar Post')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Daftar Post</h1>
        <a href="{{ route('posts.create') }}" class="btn btn-primary">
            <i class="fas fa-plus"></i> Buat Post Baru
        </a>
    </div>
    
    @if ($posts->count() > 0)
        <div class="row">
            @foreach ($posts as $post)
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">{{ $post->title }}</h5>
                            <p class="card-text">{{ Str::limit($post->content, 100) }}</p>
                            
                            <div class="d-flex justify-content-between">
                                <a href="{{ route('posts.show', $post) }}" class="btn btn-primary btn-sm">
                                    <i class="fas fa-eye"></i> Lihat
                                </a>
                                
                                <a href="{{ route('posts.edit', $post) }}" class="btn btn-warning btn-sm">
                                    <i class="fas fa-edit"></i> Edit
                                </a>
                                
                                <form action="{{ route('posts.destroy', $post) }}" method="POST" 
                                      onsubmit="return confirm('Yakin ingin menghapus post ini?')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-danger btn-sm">
                                        <i class="fas fa-trash"></i> Hapus
                                    </button>
                                </form>
                            </div>
                        </div>
                        
                        <div class="card-footer text-muted">
                            <small>Diposting {{ $post->created_at->diffForHumans() }}</small>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
        
        <!-- Pagination dengan named routes -->
        <div class="d-flex justify-content-center">
            {{ $posts->links() }}
        </div>
    @else
        <div class="text-center py-5">
            <h3>Belum ada post</h3>
            <p>Silakan buat post pertama Anda.</p>
            <a href="{{ route('posts.create') }}" class="btn btn-primary">
                <i class="fas fa-plus"></i> Buat Post Baru
            </a>
        </div>
    @endif
</div>
@endsection
```

---

## Bagian 4: Signed URLs - Keamanan Link Publik 🔐

### 11. 🛡️ Apa Itu Signed URLs?

Signed URLs adalah URL yang dilengkapi dengan signature/hash untuk memastikan URL tidak bisa dimodifikasi dan hanya berlaku untuk periode tertentu. Sangat berguna untuk:

- Link unsubscribe email
- Link download file sementara
- Link reset password
- Link undangan (invite links)
- Link akses sementara ke resource privat

### 12. 🔑 Membuat Signed URLs

```php
use Illuminate\Support\Facades\URL;

// Signed URL dasar
$signedUrl = URL::signedRoute('unsubscribe', ['user' => 1]);
// Hasil: http://example.com/unsubscribe/1?signature=xxxxx

// Temporary signed URL (berlaku sementara)
$temporaryUrl = URL::temporarySignedRoute(
    'unsubscribe',
    now()->addMinutes(30), // Berlaku 30 menit
    ['user' => 1]
);
// Hasil: http://example.com/unsubscribe/1?signature=xxxxx&expires=timestamp

// Signed URL dengan parameter kompleks
$complexUrl = URL::temporarySignedRoute(
    'document.download',
    now()->addHours(2),
    [
        'document' => 123,
        'user' => 456,
        'format' => 'pdf'
    ]
);
```

### 13. 🎯 Validasi Signed URLs

```php
use Illuminate\Http\Request;

Route::get('/unsubscribe/{user}', function (Request $request, User $user) {
    // Validasi signature
    if (! $request->hasValidSignature()) {
        abort(401, 'Link tidak valid atau telah kedaluwarsa');
    }
    
    // Proses unsubscribe
    $user->update(['subscribed' => false]);
    
    return view('unsubscribe.success');
})->name('unsubscribe');

// Atau gunakan middleware untuk validasi otomatis
Route::get('/unsubscribe/{user}', function (Request $request, User $user) {
    // Signature sudah divalidasi oleh middleware
    
    $user->update(['subscribed' => false]);
    
    return view('unsubscribe.success');
})->name('unsubscribe')->middleware('signed');
```

### 14. 🎨 Contoh Implementasi Lengkap

```php
<?php

// routes/web.php
use App\Http\Controllers\DocumentController;

Route::get('/documents/{document}/download', [DocumentController::class, 'download'])
    ->name('documents.download')
    ->middleware('signed');

Route::get('/invitations/{invitation}', [InvitationController::class, 'accept'])
    ->name('invitations.accept')
    ->middleware('signed');

// routes/api.php
Route::get('/files/{file}/temporary-url', [FileController::class, 'getTemporaryUrl'])
    ->name('files.temporary-url')
    ->middleware('auth:sanctum');
```

```php
<?php

// app/Http/Controllers/FileController.php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Http\JsonResponse;

class FileController extends Controller
{
    public function getTemporaryUrl(File $file): JsonResponse
    {
        // Cek apakah user berhak mengakses file
        if (!$this->userCanAccessFile(auth()->user(), $file)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        // Buat temporary signed URL
        $temporaryUrl = URL::temporarySignedRoute(
            'files.download',
            now()->addHour(), // Berlaku 1 jam
            [
                'file' => $file->id,
                'user' => auth()->id()
            ],
            false // Jangan absolute URL (untuk API)
        );
        
        return response()->json([
            'url' => $temporaryUrl,
            'expires_at' => now()->addHour()->toISOString()
        ]);
    }
    
    public function download(Request $request, File $file)
    {
        // Validasi signature
        if (!$request->hasValidSignature()) {
            abort(401, 'Link tidak valid atau telah kedaluwarsa');
        }
        
        // Cek apakah user sama dengan yang diminta
        if ($request->user != auth()->id()) {
            abort(403, 'Unauthorized');
        }
        
        // Log download activity
        \Log::info('File downloaded', [
            'file_id' => $file->id,
            'user_id' => auth()->id(),
            'ip_address' => $request->ip()
        ]);
        
        // Return file download
        return response()->download($file->path, $file->original_name);
    }
    
    private function userCanAccessFile($user, File $file): bool
    {
        // Implementasi logika akses file
        return $user && $file->user_id === $user->id;
    }
}
```

```php
<?php

// app/Http/Controllers/InvitationController.php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class InvitationController extends Controller
{
    public function accept(Request $request, Invitation $invitation): RedirectResponse
    {
        // Signature sudah divalidasi oleh middleware 'signed'
        
        // Cek apakah invitation masih valid
        if ($invitation->isExpired()) {
            return redirect('/')->with('error', 'Undangan telah kedaluwarsa');
        }
        
        if ($invitation->isAccepted()) {
            return redirect('/')->with('info', 'Undangan sudah diterima');
        }
        
        // Proses penerimaan undangan
        $invitation->accept();
        
        // Auto-login user jika belum login
        if (!auth()->check()) {
            auth()->login($invitation->user);
        }
        
        return redirect('/dashboard')
            ->with('success', 'Selamat datang! Undangan Anda telah diterima.');
    }
    
    public function sendInvitation(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:admin,editor,viewer'
        ]);
        
        // Buat user dan invitation
        $user = User::create([
            'email' => $validated['email'],
            'password' => bcrypt(str_random(32)), // Password sementara
            'role' => $validated['role']
        ]);
        
        $invitation = Invitation::create([
            'user_id' => $user->id,
            'invited_by' => auth()->id(),
            'expires_at' => now()->addWeek()
        ]);
        
        // Buat signed URL untuk invitation
        $signedUrl = URL::temporarySignedRoute(
            'invitations.accept',
            now()->addWeek(), // Berlaku 1 minggu
            ['invitation' => $invitation->id]
        );
        
        // Kirim email dengan signed URL
        \Mail::to($user->email)->send(new InvitationMail($signedUrl));
        
        return redirect()->back()
            ->with('success', 'Undangan telah dikirim ke ' . $user->email);
    }
}
```

### 15. ⚙️ Advanced Signed URL Features

```php
// Signed URL dengan parameter yang boleh diabaikan
if (! $request->hasValidSignatureWhileIgnoring(['utm_source', 'utm_medium'])) {
    abort(401);
}

// Signed URL dengan kondisi khusus
$signedUrl = URL::signedRoute('download', ['file' => 1], function ($url) {
    return $url->withQuery(['download' => 'true']);
});

// Signed URL untuk API (relatif)
$apiUrl = URL::temporarySignedRoute(
    'api.files.download',
    now()->addMinutes(30),
    ['file' => 1],
    false // Relatif URL untuk API
);
```

---

## Bagian 5: URL untuk Controller Actions 🎯

### 16. 🎯 Membuat URL ke Method Controller

```php
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;

// URL ke method controller tertentu
$url = action([HomeController::class, 'index']);
// Hasil: http://example.com/

// URL dengan parameter
$url = action([UserController::class, 'show'], ['user' => 1]);
// Hasil: http://example.com/users/1

// URL ke method dengan parameter kompleks
$url = action([UserController::class, 'profile'], ['id' => 1, 'tab' => 'settings']);
// Hasil: http://example.com/users/1/profile?tab=settings
```

### 17. 🎨 Contoh Penggunaan Praktis

```php
<?php

// app/Http/Controllers/Admin/DashboardController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        $stats = $this->getDashboardStats();
        
        return view('admin.dashboard', compact('stats'));
    }
    
    public function users(): View
    {
        $users = User::with('roles')->paginate(20);
        
        // Gunakan action() untuk membuat URL pagination
        return view('admin.users.index', compact('users'));
    }
    
    public function settings(): View
    {
        $settings = config('app');
        
        return view('admin.settings.index', compact('settings'));
    }
    
    private function getDashboardStats(): array
    {
        return [
            'total_users' => User::count(),
            'total_posts' => Post::count(),
            'recent_signups' => User::where('created_at', '>', now()->subWeek())->count()
        ];
    }
}
```

```blade
{{-- resources/views/admin/sidebar.blade.php --}}
<nav class="sidebar">
    <ul class="nav flex-column">
        <li class="nav-item">
            <a class="nav-link {{ request()->is('admin') ? 'active' : '' }}" 
               href="{{ action([\App\Http\Controllers\Admin\DashboardController::class, 'index']) }}">
                <i class="fas fa-tachometer-alt"></i> Dashboard
            </a>
        </li>
        
        <li class="nav-item">
            <a class="nav-link {{ request()->is('admin/users*') ? 'active' : '' }}" 
               href="{{ action([\App\Http\Controllers\Admin\DashboardController::class, 'users']) }}">
                <i class="fas fa-users"></i> Users
            </a>
        </li>
        
        <li class="nav-item">
            <a class="nav-link {{ request()->is('admin/settings*') ? 'active' : '' }}" 
               href="{{ action([\App\Http\Controllers\Admin\DashboardController::class, 'settings']) }}">
                <i class="fas fa-cog"></i> Settings
            </a>
        </li>
    </ul>
</nav>
```

---

## Bagian 6: Fluent URI Objects - Manipulasi URL Lanjutan 🧪

### 18. 🎯 Menggunakan Class Uri untuk Manipulasi URL

Laravel menyediakan class `Uri` untuk manipulasi URI dengan cara fluent (berantai):

```php
use Illuminate\Support\Uri;

// Membuat URI object dari string
$uri = Uri::of('https://example.com');

// Memanipulasi dengan method chaining
$modifiedUri = $uri
    ->withScheme('http')
    ->withHost('test.com')
    ->withPort(8000)
    ->withPath('/users')
    ->withQuery(['page' => 2, 'sort' => 'name'])
    ->withFragment('section-1');

echo $modifiedUri;
// Hasil: http://test.com:8000/users?page=2&sort=name#section-1

// Membuat URI dari komponen-komponen
$newUri = Uri::fromComponents([
    'scheme' => 'https',
    'host' => 'api.example.com',
    'path' => '/v1/users',
    'query' => 'limit=10&page=1'
]);

echo $newUri;
// Hasil: https://api.example.com/v1/users?limit=10&page=1
```

### 19. 🎨 Contoh Penggunaan Fluent URI Objects

```php
<?php

// app/Services/ApiUrlBuilder.php
namespace App\Services;

use Illuminate\Support\Uri;

class ApiUrlBuilder
{
    private $baseUrl;
    private $version;
    private $locale;
    
    public function __construct()
    {
        $this->baseUrl = config('app.api_base_url', 'https://api.example.com');
        $this->version = config('app.api_version', 'v1');
        $this->locale = app()->getLocale();
    }
    
    public function buildEndpoint(string $endpoint, array $params = []): string
    {
        $uri = Uri::of($this->baseUrl)
            ->withPath("/{$this->version}/{$endpoint}")
            ->withQuery(array_merge([
                'locale' => $this->locale,
                'timestamp' => time()
            ], $params));
            
        return (string) $uri;
    }
    
    public function buildPaginatedEndpoint(string $endpoint, int $page = 1, int $limit = 10): string
    {
        return $this->buildEndpoint($endpoint, [
            'page' => $page,
            'limit' => $limit
        ]);
    }
    
    public function buildFilteredEndpoint(string $endpoint, array $filters): string
    {
        $queryParams = [];
        
        foreach ($filters as $key => $value) {
            if (is_array($value)) {
                // Handle array filters
                foreach ($value as $index => $item) {
                    $queryParams["{$key}[{$index}]"] = $item;
                }
            } else {
                $queryParams[$key] = $value;
            }
        }
        
        return $this->buildEndpoint($endpoint, $queryParams);
    }
}

// Penggunaan
$apiBuilder = new ApiUrlBuilder();

// Endpoint dasar
echo $apiBuilder->buildEndpoint('users');
// Hasil: https://api.example.com/v1/users?locale=id&timestamp=1234567890

// Endpoint dengan pagination
echo $apiBuilder->buildPaginatedEndpoint('posts', 2, 20);
// Hasil: https://api.example.com/v1/posts?locale=id&timestamp=1234567890&page=2&limit=20

// Endpoint dengan filter
echo $apiBuilder->buildFilteredEndpoint('products', [
    'category' => 'electronics',
    'brands' => ['sony', 'samsung'],
    'price_range' => '1000-5000'
]);
// Hasil: https://api.example.com/v1/products?locale=id&timestamp=1234567890&category=electronics&brands[0]=sony&brands[1]=samsung&price_range=1000-5000
```

---

## Bagian 7: Default Values dan Parameter Dinamis ⚙️

### 20. 🎯 Mengatur Default Parameter untuk Routes

Kadang kita butuh parameter default untuk setiap request, seperti `{locale}` di banyak route:

```php
// routes/web.php
Route::get('/{locale}/posts', function ($locale) {
    // ...
})->name('posts.index');

Route::get('/{locale}/posts/{post}', function ($locale, Post $post) {
    // ...
})->name('posts.show');

Route::get('/{locale}/users/{user}', function ($locale, User $user) {
    // ...
})->name('users.show');
```

### 21. 🏗️ Membuat Middleware untuk Default Values

```php
<?php

// app/Http/Middleware/SetDefaultLocaleForUrls.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class SetDefaultLocaleForUrls
{
    public function handle(Request $request, Closure $next): Response
    {
        // Set default locale berdasarkan user preference atau browser
        $defaultLocale = $request->user()?->locale ?? 
                        $request->getPreferredLanguage(['en', 'id']) ?? 
                        'en';
        
        URL::defaults(['locale' => $defaultLocale]);
        
        return $next($request);
    }
}
```

**Registrasi middleware:**

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->prependToPriorityList(
        before: \Illuminate\Routing\Middleware\SubstituteBindings::class,
        prepend: \App\Http\Middleware\SetDefaultLocaleForUrls::class,
    );
})
```

### 22. 🎨 Contoh Implementasi Lengkap dengan Default Values

```php
<?php

// routes/web.php dengan locale parameter
Route::middleware(['web', 'locale'])->group(function () {
    Route::get('/{locale}/posts', [PostController::class, 'index'])->name('posts.index');
    Route::get('/{locale}/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::get('/{locale}/posts/{post}', [PostController::class, 'show'])->name('posts.show');
    Route::get('/{locale}/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
});

// app/Http/Middleware/LocaleMiddleware.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\URL;

class LocaleMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->route('locale') ?? 'en';
        
        // Validasi locale
        if (!in_array($locale, ['en', 'id'])) {
            $locale = 'en';
        }
        
        // Set locale untuk aplikasi
        App::setLocale($locale);
        
        // Set default locale untuk URL generation
        URL::defaults(['locale' => $locale]);
        
        return $next($request);
    }
}
```

```php
<?php

// app/Http/Controllers/PostController.php dengan localization
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class PostController extends Controller
{
    public function index(): View
    {
        $posts = Post::withTranslation()->latest()->paginate(10);
        
        return view('posts.index', compact('posts'));
    }
    
    public function show(Post $post): View
    {
        return view('posts.show', compact('post'));
    }
    
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string'
        ]);
        
        $post = Post::create($validated);
        
        // Gunakan URL dengan locale yang sesuai
        return redirect()->route('posts.show', [
            'locale' => app()->getLocale(),
            'post' => $post
        ])->with('success', __('Post created successfully!'));
    }
}
```

---

## Bagian 8: Best Practices dan Tips ✅

### 23. 📋 Best Practices untuk URL Generation

1. **Selalu gunakan named routes:**
```php
// ✅ Benar
return redirect()->route('posts.index');

// ❌ Hindari hardcoding
return redirect('/posts');
```

2. **Gunakan signed URLs untuk link sensitif:**
```php
// ✅ Untuk link reset password
$resetUrl = URL::temporarySignedRoute('password.reset', now()->addHour(), ['user' => $user->id]);

// ✅ Untuk link undangan
$inviteUrl = URL::temporarySignedRoute('invitations.accept', now()->addWeek(), ['invitation' => $invitation->id]);
```

3. **Gunakan model binding langsung:**
```php
// ✅ Lebih bersih
return redirect()->route('posts.show', $post);

// ❌ Kurang jelas
return redirect()->route('posts.show', ['post' => $post->id]);
```

### 24. 💡 Tips dan Trik Berguna

```php
// Gunakan route() dengan kondisi
$redirectUrl = $user->isAdmin() 
    ? route('admin.dashboard') 
    : route('user.dashboard');

// Gunakan action() untuk controller methods
$actionUrl = action([UserController::class, 'profile'], ['user' => $user->id]);

// Gunakan URL facade untuk manipulasi kompleks
use Illuminate\Support\Facades\URL;

$currentUrl = URL::current();
$fullUrl = URL::full();
$previousUrl = URL::previous();

// Gunakan signed URLs dengan parameter tambahan
$signedUrl = URL::temporarySignedRoute(
    'document.download',
    now()->addHour(),
    [
        'document' => $document->id,
        'user' => auth()->id(),
        'format' => 'pdf'
    ]
);

// Gunakan withQuery untuk menambahkan parameter
$paginatedUrl = url()->query(URL::current(), ['page' => 2]);

// Gunakan previousPath() untuk redirect pintar
return redirect()->to(url()->previousPath() . '#comments');
```

### 25. 🚨 Kesalahan Umum

1. **Lupa validasi signed URLs:**
```php
// ❌ Berbahaya
Route::get('/sensitive-action/{user}', function (User $user) {
    // Action sensitif tanpa validasi
});

// ✅ Aman
Route::get('/sensitive-action/{user}', function (User $user) {
    if (! request()->hasValidSignature()) {
        abort(401);
    }
    // Action sensitif
})->middleware('signed');
```

2. **Hardcoding URLs di tempat banyak:**
```php
// ❌ Sulit maintenance
<a href="/posts/{{ $post->id }}">View Post</a>
<a href="/posts/{{ $post->id }}/edit">Edit Post</a>

// ✅ Lebih baik
<a href="{{ route('posts.show', $post) }}">View Post</a>
<a href="{{ route('posts.edit', $post) }}">Edit Post</a>
```

3. **Tidak menggunakan default values dengan bijak:**
```php
// ❌ Repetitive
Route::get('/en/posts/{post}', [PostController::class, 'show'])->name('posts.en.show');
Route::get('/id/posts/{post}', [PostController::class, 'show'])->name('posts.id.show');

// ✅ Lebih baik
Route::get('/{locale}/posts/{post}', [PostController::class, 'show'])->name('posts.show');
URL::defaults(['locale' => 'en']); // Set default
```

---

## Bagian 9: Contoh Implementasi Lengkap 👨‍💻

### 26. 🏢 Sistem Blog dengan URL Generation Komplit

```php
<?php

// routes/web.php
use App\Http\Controllers\Blog\PostController;
use App\Http\Controllers\Blog\CategoryController;
use App\Http\Controllers\Blog\TagController;
use App\Http\Controllers\Blog\AuthorController;

// Blog routes dengan localization
Route::middleware(['web', 'locale'])->group(function () {
    // Home page
    Route::get('/{locale}', [PostController::class, 'index'])->name('blog.home');
    
    // Posts
    Route::get('/{locale}/posts', [PostController::class, 'index'])->name('blog.posts.index');
    Route::get('/{locale}/posts/create', [PostController::class, 'create'])->name('blog.posts.create');
    Route::post('/{locale}/posts', [PostController::class, 'store'])->name('blog.posts.store');
    Route::get('/{locale}/posts/{post:slug}', [PostController::class, 'show'])->name('blog.posts.show');
    Route::get('/{locale}/posts/{post:slug}/edit', [PostController::class, 'edit'])->name('blog.posts.edit');
    Route::put('/{locale}/posts/{post:slug}', [PostController::class, 'update'])->name('blog.posts.update');
    Route::delete('/{locale}/posts/{post:slug}', [PostController::class, 'destroy'])->name('blog.posts.destroy');
    
    // Categories
    Route::get('/{locale}/categories', [CategoryController::class, 'index'])->name('blog.categories.index');
    Route::get('/{locale}/categories/{category:slug}', [CategoryController::class, 'show'])->name('blog.categories.show');
    
    // Tags
    Route::get('/{locale}/tags', [TagController::class, 'index'])->name('blog.tags.index');
    Route::get('/{locale}/tags/{tag:slug}', [TagController::class, 'show'])->name('blog.tags.show');
    
    // Authors
    Route::get('/{locale}/authors', [AuthorController::class, 'index'])->name('blog.authors.index');
    Route::get('/{locale}/authors/{author:username}', [AuthorController::class, 'show'])->name('blog.authors.show');
    
    // Search
    Route::get('/{locale}/search', [PostController::class, 'search'])->name('blog.search');
});

// API routes untuk signed URLs
Route::middleware(['api', 'auth:sanctum'])->group(function () {
    Route::get('/api/v1/posts/{post}/temporary-url', [PostController::class, 'getTemporaryUrl'])
        ->name('api.posts.temporary-url');
});
```

```php
<?php

// app/Http/Controllers/Blog/PostController.php
namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request): View
    {
        $query = Post::with(['category', 'tags', 'author'])
                    ->published()
                    ->orderBy('published_at', 'desc');
        
        // Filter berdasarkan kategori
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }
        
        // Filter berdasarkan tag
        if ($request->filled('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', $request->tag);
            });
        }
        
        // Filter berdasarkan author
        if ($request->filled('author')) {
            $query->whereHas('author', function ($q) use ($request) {
                $q->where('username', $request->author);
            });
        }
        
        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('content', 'like', "%{$request->search}%");
            });
        }
        
        $posts = $query->paginate(10);
        
        return view('blog.posts.index', compact('posts'));
    }
    
    public function show(Post $post): View
    {
        // Increment view count
        $post->increment('views_count');
        
        // Related posts
        $relatedPosts = Post::where('category_id', $post->category_id)
                           ->where('id', '!=', $post->id)
                           ->published()
                           ->take(3)
                           ->get();
        
        return view('blog.posts.show', compact('post', 'relatedPosts'));
    }
    
    public function create(): View
    {
        $categories = Category::all();
        return view('blog.posts.create', compact('categories'));
    }
    
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id',
            'featured_image' => 'nullable|image|max:2048'
        ]);
        
        // Generate slug dari title
        $validated['slug'] = Str::slug($validated['title']) . '-' . time();
        $validated['author_id'] = auth()->id();
        $validated['published_at'] = now();
        
        $post = Post::create($validated);
        
        // Sync tags
        if (isset($validated['tags'])) {
            $post->tags()->sync($validated['tags']);
        }
        
        // Upload featured image jika ada
        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('posts');
            $post->update(['featured_image' => $path]);
        }
        
        return redirect()->route('blog.posts.show', [
            'locale' => app()->getLocale(),
            'post' => $post
        ])->with('success', 'Post berhasil dibuat!');
    }
    
    public function edit(Post $post): View
    {
        $categories = Category::all();
        return view('blog.posts.edit', compact('post', 'categories'));
    }
    
    public function update(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id',
            'featured_image' => 'nullable|image|max:2048'
        ]);
        
        // Update slug jika title berubah
        if ($validated['title'] !== $post->title) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . time();
        }
        
        $post->update($validated);
        
        // Sync tags
        if (isset($validated['tags'])) {
            $post->tags()->sync($validated['tags']);
        }
        
        // Upload featured image jika ada
        if ($request->hasFile('featured_image')) {
            // Hapus gambar lama jika ada
            if ($post->featured_image) {
                \Storage::delete($post->featured_image);
            }
            
            $path = $request->file('featured_image')->store('posts');
            $post->update(['featured_image' => $path]);
        }
        
        return redirect()->route('blog.posts.show', [
            'locale' => app()->getLocale(),
            'post' => $post
        ])->with('success', 'Post berhasil diperbarui!');
    }
    
    public function destroy(Post $post): RedirectResponse
    {
        // Hapus gambar jika ada
        if ($post->featured_image) {
            \Storage::delete($post->featured_image);
        }
        
        $post->delete();
        
        return redirect()->route('blog.posts.index', [
            'locale' => app()->getLocale()
        ])->with('success', 'Post berhasil dihapus!');
    }
    
    public function search(Request $request): View
    {
        $query = $request->get('q');
        $posts = collect();
        
        if ($query) {
            $posts = Post::where('title', 'like', "%{$query}%")
                        ->orWhere('content', 'like', "%{$query}%")
                        ->published()
                        ->paginate(10);
        }
        
        return view('blog.search.results', compact('posts', 'query'));
    }
    
    public function getTemporaryUrl(Post $post): JsonResponse
    {
        // Buat temporary signed URL untuk akses ke post privat
        if ($post->is_private) {
            $temporaryUrl = URL::temporarySignedRoute(
                'blog.posts.show',
                now()->addMinutes(30), // Berlaku 30 menit
                [
                    'locale' => app()->getLocale(),
                    'post' => $post->id
                ],
                false // Relatif URL untuk API
            );
            
            return response()->json([
                'url' => $temporaryUrl,
                'expires_at' => now()->addMinutes(30)->toISOString()
            ]);
        }
        
        // Untuk post publik, kembalikan URL biasa
        return response()->json([
            'url' => route('blog.posts.show', [
                'locale' => app()->getLocale(),
                'post' => $post
            ]),
            'expires_at' => null
        ]);
    }
}
```

```blade
{{-- resources/views/blog/posts/index.blade.php --}}
@extends('layouts.blog')

@section('title', 'Latest Posts')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-lg-8">
            <!-- Search and Filters -->
            <div class="card mb-4">
                <div class="card-body">
                    <form method="GET" action="{{ route('blog.search', ['locale' => app()->getLocale()]) }}">
                        <div class="input-group">
                            <input type="text" 
                                   name="q" 
                                   class="form-control" 
                                   placeholder="Cari post..." 
                                   value="{{ request('search') }}">
                            <button class="btn btn-outline-secondary" type="submit">
                                <i class="fas fa-search"></i> Cari
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Posts List -->
            @forelse ($posts as $post)
                <article class="card mb-4">
                    @if ($post->featured_image)
                        <img src="{{ Storage::url($post->featured_image) }}" 
                             class="card-img-top" 
                             alt="{{ $post->title }}">
                    @endif
                    
                    <div class="card-body">
                        <h2 class="card-title">
                            <a href="{{ route('blog.posts.show', ['locale' => app()->getLocale(), 'post' => $post]) }}">
                                {{ $post->title }}
                            </a>
                        </h2>
                        
                        <p class="card-text">{{ Str::limit($post->content, 200) }}</p>
                        
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <a href="{{ route('blog.posts.show', ['locale' => app()->getLocale(), 'post' => $post]) }}" 
                                   class="btn btn-primary">
                                    Baca Selengkapnya
                                </a>
                                
                                @can('update', $post)
                                    <a href="{{ route('blog.posts.edit', ['locale' => app()->getLocale(), 'post' => $post]) }}" 
                                       class="btn btn-outline-secondary">
                                        Edit
                                    </a>
                                @endcan
                            </div>
                            
                            <small class="text-muted">
                                {{ $post->published_at->diffForHumans() }} oleh 
                                <a href="{{ route('blog.authors.show', ['locale' => app()->getLocale(), 'author' => $post->author->username]) }}">
                                    {{ $post->author->name }}
                                </a>
                            </small>
                        </div>
                    </div>
                    
                    <div class="card-footer">
                        <div class="d-flex justify-content-between">
                            <div>
                                <span class="badge bg-secondary">
                                    <i class="fas fa-folder"></i>
                                    <a href="{{ route('blog.categories.show', ['locale' => app()->getLocale(), 'category' => $post->category->slug]) }}" 
                                       class="text-white">
                                        {{ $post->category->name }}
                                    </a>
                                </span>
                                
                                @foreach ($post->tags as $tag)
                                    <span class="badge bg-info ms-1">
                                        <i class="fas fa-tag"></i>
                                        <a href="{{ route('blog.tags.show', ['locale' => app()->getLocale(), 'tag' => $tag->slug]) }}" 
                                           class="text-white">
                                            {{ $tag->name }}
                                        </a>
                                    </span>
                                @endforeach
                            </div>
                            
                            <div>
                                <i class="fas fa-eye"></i> {{ $post->views_count }}
                            </div>
                        </div>
                    </div>
                </article>
            @empty
                <div class="text-center py-5">
                    <h3>Belum ada post</h3>
                    <p>Jadilah yang pertama menulis post!</p>
                    <a href="{{ route('blog.posts.create', ['locale' => app()->getLocale()]) }}" 
                       class="btn btn-primary">
                        <i class="fas fa-plus"></i> Buat Post Baru
                    </a>
                </div>
            @endforelse
            
            <!-- Pagination -->
            <div class="d-flex justify-content-center">
                {{ $posts->links() }}
            </div>
        </div>
        
        <div class="col-lg-4">
            <!-- Sidebar with Categories, Tags, Popular Posts -->
            <div class="card mb-4">
                <div class="card-header">
                    <h4>Kategori</h4>
                </div>
                <div class="card-body">
                    <div class="list-group">
                        @foreach (App\Models\Category::withCount('posts')->get() as $category)
                            <a href="{{ route('blog.categories.show', ['locale' => app()->getLocale(), 'category' => $category->slug]) }}" 
                               class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                {{ $category->name }}
                                <span class="badge bg-primary rounded-pill">{{ $category->posts_count }}</span>
                            </a>
                        @endforeach
                    </div>
                </div>
            </div>
            
            <div class="card mb-4">
                <div class="card-header">
                    <h4>Tag Populer</h4>
                </div>
                <div class="card-body">
                    @foreach (App\Models\Tag::withCount('posts')->orderBy('posts_count', 'desc')->take(10)->get() as $tag)
                        <a href="{{ route('blog.tags.show', ['locale' => app()->getLocale(), 'tag' => $tag->slug]) }}" 
                           class="badge bg-secondary text-decoration-none me-1 mb-1">
                            {{ $tag->name }} <span class="badge bg-light text-dark">{{ $tag->posts_count }}</span>
                        </a>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
```

---

## Bagian 10: Cheat Sheet & Referensi Cepat 📚

### 🧩 Helper URL Dasar
```
url('/')                           → URL dasar aplikasi
url('/posts')                      → URL dengan path
url()->current()                  → URL saat ini (tanpa query)
url()->full()                     → URL saat ini (dengan query)
url()->previous()                 → URL sebelumnya
url()->previousPath()            → Path sebelumnya
url()->query('/path', $params)   → URL dengan query string
```

### 🎯 Named Routes
```
route('posts.index')              → Route tanpa parameter
route('posts.show', ['post' => 1]) → Route dengan parameter
route('posts.show', $post)        → Route dengan model binding
route('posts.show', [...], false) → URL relatif (bukan absolut)
```

### 🔐 Signed URLs
```
URL::signedRoute('route.name', $params)                    → Signed URL permanen
URL::temporarySignedRoute('route.name', $expiration, $params) → Signed URL sementara
$request->hasValidSignature()                             → Validasi signature
$request->hasValidSignatureWhileIgnoring(['utm_*'])       → Validasi dengan ignore parameter
```

### 🎯 Controller Actions
```
action([Controller::class, 'method'])                    → URL ke controller method
action([Controller::class, 'method'], $params)          → Dengan parameter
```

### 🧪 Fluent URI Objects
```
Uri::of('https://example.com')                           → Buat dari string
    ->withScheme('http')                                 → Ubah scheme
    ->withHost('test.com')                              → Ubah host
    ->withPort(8000)                                    → Tambah port
    ->withPath('/users')                                → Tambah path
    ->withQuery(['page' => 2])                          → Tambah query
    ->withFragment('section-1')                         → Tambah fragment
```

### ⚙️ Default Values
```
URL::defaults(['locale' => 'en'])                        → Set default parameter
// Harus di middleware sebelum SubstituteBindings
```

### 🎨 Best Practices
```
✅ Gunakan named routes, bukan hardcoded URLs
✅ Gunakan signed URLs untuk link sensitif
✅ Gunakan model binding langsung
✅ Set default values untuk parameter umum
✅ Validasi signed URLs dengan middleware
✅ Gunakan URL fluent untuk manipulasi kompleks
```

### 🚨 Security Considerations
```
✅ Validasi selalu signed URLs untuk link sensitif
✅ Jangan expose parameter sensitif dalam URLs
✅ Gunakan temporary signed URLs untuk akses terbatas
✅ Regenerasi signature secara berkala untuk keamanan
✅ Logging akses ke signed URLs sensitif
```

### 📊 Testing URLs
```
$this->get(route('posts.index'))->assertOk();
$this->followingRedirects()->get(route('posts.show', $post))->assertOk();
URL::fake(); // Mock URL facade untuk testing
```

---

## 11. 🎯 Kesimpulan

URL Generation adalah sistem kritis dalam aplikasi Laravel yang memungkinkan kamu:

- **Membuat URL yang konsisten dan dinamis** tanpa hardcoding
- **Memanfaatkan named routes** untuk fleksibilitas pemeliharaan
- **Mengamankan link publik** dengan signed URLs
- **Memanipulasi URL kompleks** dengan fluent interface
- **Mengatur parameter default** untuk konsistensi aplikasi

Dengan memahami konsep berikut:

- **Dasar URL generation** dengan helper `url()` dan `route()`
- **Named routes** untuk organisasi routing yang baik
- **Signed URLs** untuk keamanan link publik
- **Controller actions** untuk navigasi langsung
- **Fluent URI objects** untuk manipulasi kompleks
- **Default values** untuk parameter umum
- **Best practices** untuk keamanan dan maintainability

Kamu sekarang siap membuat aplikasi Laravel yang memiliki sistem URL yang kuat, aman, dan mudah dikelola. Ingat selalu bahwa URL yang baik bukan hanya tentang alamat yang benar, tapi juga tentang pengalaman pengguna yang konsisten dan aman.

Selamat mengembangkan aplikasi kamu, muridku! Dengan kuasai URL generation, kamu sudah melangkah jauh dalam membuat aplikasi web yang profesional dan aman.
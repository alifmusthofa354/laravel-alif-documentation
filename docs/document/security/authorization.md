# 🔐 Laravel Authorization: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Setelah beberapa kali mengamati dan belajar, aku menyadari bahwa **Authorization** adalah salah satu topik paling krusial dalam pengembangan aplikasi web modern. Kita tidak bisa hanya membiarkan semua orang bisa mengakses atau melakukan apa saja di aplikasimu. Kita butuh sistem keamanan yang kuat namun tetap fleksibel! 

Di edisi super lengkap ini, kita akan kupas tuntas **semua detail** tentang Authorization di Laravel, tapi setiap topik akan aku ajarkan dengan sabar, seolah-olah aku sedang duduk di sebelahmu sambil menjelaskan pelan-pelan. Siap? Ayo kita mulai petualangan ini!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Authorization Itu Sebenarnya?

**Analogi:** Bayangkan kamu adalah **satpam** di sebuah gedung. Ketika seseorang datang (user), kamu tidak hanya memastikan dia adalah orang yang berhak masuk (autentikasi), tapi juga **mengizinkan dia kemana saja** dia boleh pergi dan **apa saja** yang boleh dilakukan di gedung tersebut (otorisasi).

Misalnya:
- User A bisa ke lantai 1-3, tapi tidak ke lantai 4 (karena rahasia).
- User B bisa membaca dokumen, tapi tidak bisa menghapusnya.
- User C adalah admin, bisa kemana-mana dan ngapain aja.

Itulah authorization! 

**Mengapa ini penting?** Karena tanpa authorization, aplikasimu seperti gedung tanpa satpam: siapa saja bisa masuk ke ruang server, menghapus data penting, atau mengakses informasi rahasia. Bisa berantakan! 😵

**Bagaimana cara kerjanya di Laravel?** Laravel menyediakan dua pendekatan utama:
1. **Gates** (pintu masuk untuk aksi-aksi spesifik) - seperti satpam yang mengecek akses ke ruangan tertentu.
2. **Policies** (aturan berdasarkan model) - seperti peraturan gedung yang menyeluruh dan terstruktur.

Alur kerja authorization di aplikasi kita:
`➡️ Permintaan User -> 🔒 Cek Authorization (Gates/Policies) -> Jika Diizinkan -> ✅ Akses Diberikan -> Jika Ditolak -> ❌ Akses Ditolak (403)`

Tanpa authorization, aplikasimu akan rentan keamanan dan sulit dikelola. Dengan pendekatan Laravel, authorization bisa sangat rapi dan fleksibel!

### 2. ✍️ Resep Pertamamu: Authorization Sederhana dengan Gates

Ini adalah fondasi paling dasar. Mari kita buat sistem authorization sederhana dari nol untuk memahami konsepnya.

#### Langkah 1️⃣: Siapkan Tempat Daftar Aturan (Gates)
**Mengapa?** Kita butuh tempat untuk mendaftarkan semua aturan otorisasi. Tempatnya adalah `AppServiceProvider`.

**Bagaimana?**
```php
// app/Providers/AppServiceProvider.php
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // "Jika user ingin update-post, cek apakah ID user sama dengan ID pemilik post"
        Gate::define('update-post', function (User $user, Post $post) {
            return $user->id === $post->user_id;
        });

        // Aturan tambahan: hanya admin yang bisa delete-post
        Gate::define('delete-post', function (User $user, Post $post) {
            return $user->isAdmin() || $user->id === $post->user_id;
        });
    }
}
```

#### Langkah 2️⃣: Gunakan Gates di Controller
**Mengapa?** Kita perlu mengecek apakah user berhak melakukan aksi tertentu sebelum memproses permintaan.

**Bagaimana?** Di method controller, kita cek dulu izinnya:
```php
// app/Http/Controllers/PostController.php
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\View\View;

class PostController extends Controller
{
    public function edit(Post $post): View
    {
        // Cek apakah user punya izin untuk update-post
        if (! Gate::allows('update-post', $post)) {
            abort(403, 'Anda tidak diizinkan mengedit post ini.');
        }

        return view('posts.edit', compact('post'));
    }

    public function update(Request $request, Post $post): RedirectResponse
    {
        // Cek authorization lebih cepat dengan authorize
        Gate::authorize('update-post', $post);
        
        $post->update($request->validated());
        return redirect()->route('posts.show', $post);
    }
}
```

#### Langkah 3️⃣: Gunakan Gates di Blade Template
**Mengapa?** Kita juga bisa menampilkan/hide element UI berdasarkan izin user.

**Bagaimana?** Gunakan directive `@can` di blade:
```blade
<!-- resources/views/posts/show.blade.php -->
<div class="post">
    <h1>{{ $post->title }}</h1>
    <p>{{ $post->content }}</p>
    
    @can('update-post', $post)
        <a href="{{ route('posts.edit', $post) }}" class="btn btn-primary">Edit</a>
    @endcan
    
    @can('delete-post', $post)
        <form action="{{ route('posts.destroy', $post) }}" method="POST"
              onsubmit="return confirm('Yakin ingin menghapus post ini?')">
            @csrf
            @method('DELETE')
            <button type="submit" class="btn btn-danger">Hapus</button>
        </form>
    @endcan
</div>
```

Selesai! 🎉 Sekarang kamu punya sistem authorization dasar dengan Gates. User hanya bisa mengedit post yang mereka buat sendiri!

### 3. ⚡ Gates Spesialis (Inline Authorization)

**Analogi:** Bayangkan kamu punya satpam yang bisa langsung memberi izin tanpa harus buka buku aturan dulu, hanya untuk situasi-situasi spesifik.

**Mengapa ini ada?** Untuk aturan sederhana yang ingin kamu definisikan sekaligus tanpa harus susah-susah buat di service provider.

**Bagaimana?** Gunakan `allowIf` atau `denyIf`.
```php
// Langsung di method controller atau tempat tertentu
use Illuminate\Support\Facades\Gate;

// Izinkan jika user adalah admin
if (Gate::check('admin-only', $user)) {
    // Lakukan sesuatu
}

// Atau langsung inline
Gate::allowIf(fn (User $user) => $user->isAdministrator());
Gate::denyIf(fn (User $user) => $user->isBanned());
```

---

## Bagian 2: Policy Controller - Sistem Aturan Terstruktur-mu 🤖

### 4. 📦 Apa Itu Policy?

**Analogi:** Jika Gates adalah daftar aturan sederhana di buku kecil, maka **Policy adalah buku pedoman lengkap otorisasi untuk masing-masing jenis resource** (misalnya: PostPolicy, CommentPolicy, UserPolicy). Ini seperti manual peraturan gedung yang lengkap dan terstruktur.

**Mengapa ini keren?** Karena ketika aplikasimu berkembang besar, kamu akan punya ratusan aturan untuk masing-masing model. Kalau semua dimasukkan ke Gates, aplikasi jadi kacau. Policy buat semua jadi rapi dan mudah dikelola.

**Bagaimana?**
```bash
php artisan make:policy PostPolicy --model=Post
```

Cukup buat satu file policy, dan kamu bisa definisikan semua aturan untuk model tersebut di sana!

### 5. 🛠️ Mantra Artisan dengan Kekuatan Tambahan

> **✨ Tips dari Guru:** Mantra ini seperti memberi *power-up* pada sistem keamananmu. Wajib dipakai untuk hemat waktu!

*   **Menghubungkan ke Model (`--model`)**: Ini seperti memberi tahu policy, "Hei, kamu akan selalu bekerja dengan model `Post` ini!".
    ```bash
    php artisan make:policy PostPolicy --model=Post
    ```
    Dengan ini, Laravel otomatis tahu bahwa `PostPolicy` adalah untuk model `Post`.

*   **Membuat Semua Method Otorisasi**: Policy yang baru dibuat sudah memiliki method-method umum seperti `view`, `create`, `update`, `delete`, dll.

### 6. 🧩 Struktur Policy Lengkap

**Isi lengkap dari PostPolicy:**
```php
<?php
// app/Policies/PostPolicy.php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    /**
     * Cek apakah user bisa melihat semua post
     */
    public function viewAny(User $user): bool
    {
        return true; // Semua user bisa lihat list post
    }

    /**
     * Cek apakah user bisa melihat detail post tertentu
     */
    public function view(User $user, Post $post): bool
    {
        return true; // Semua user bisa lihat post
    }

    /**
     * Cek apakah user bisa membuat post baru
     */
    public function create(User $user): bool
    {
        return $user->isVerified(); // Hanya user verified bisa buat post
    }

    /**
     * Cek apakah user bisa mengupdate post
     */
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    /**
     * Cek apakah user bisa menghapus post
     */
    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->isAdmin();
    }

    /**
     * Cek apakah user bisa merestore post (soft delete)
     */
    public function restore(User $user, Post $post): bool
    {
        return false; // Tidak ada yang bisa restore
    }

    /**
     * Cek apakah user bisa secara permanen menghapus post
     */
    public function forceDelete(User $user, Post $post): bool
    {
        return $user->isAdmin();
    }
}
```

### 7. 🌐 Menggunakan Policy dalam Berbagai Konteks

**Contoh Lengkap Penggunaan Policy:**

1. **Menggunakan Policy di Controller:**
```php
<?php
// app/Http/Controllers/PostController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller
{
    /**
     * Tampilkan semua posts
     */
    public function index(): View
    {
        $this->authorize('viewAny', Post::class); // Cek izin lihat semua posts
        $posts = Post::all();
        return view('posts.index', compact('posts'));
    }

    /**
     * Tampilkan detail post
     */
    public function show(Post $post): View
    {
        $this->authorize('view', $post); // Cek izin lihat post ini
        return view('posts.show', compact('post'));
    }

    /**
     * Form untuk membuat post baru
     */
    public function create(): View
    {
        $this->authorize('create', Post::class); // Cek izin buat post
        return view('posts.create');
    }

    /**
     * Simpan post baru
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Post::class); // Cek izin buat post
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post = $request->user()->posts()->create($validated);
        
        return redirect()->route('posts.show', $post);
    }

    /**
     * Form edit post
     */
    public function edit(Post $post): View
    {
        $this->authorize('update', $post); // Cek izin update post ini
        return view('posts.edit', compact('post'));
    }

    /**
     * Update post
     */
    public function update(Request $request, Post $post): RedirectResponse
    {
        $this->authorize('update', $post); // Cek izin update post ini
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post->update($validated);
        
        return redirect()->route('posts.show', $post);
    }

    /**
     * Hapus post
     */
    public function destroy(Post $post): RedirectResponse
    {
        $this->authorize('delete', $post); // Cek izin hapus post ini
        $post->delete();
        
        return redirect()->route('posts.index');
    }
}
```

2. **Menggunakan Policy di Route Middleware:**
```php
<?php
// routes/web.php

use App\Http\Controllers\PostController;

Route::middleware(['auth'])->group(function () {
    // Menggunakan policy via middleware
    Route::get('/posts', [PostController::class, 'index'])->can('viewAny', 'Post');
    Route::get('/posts/{post}', [PostController::class, 'show'])->can('view', 'post');
    Route::get('/posts/create', [PostController::class, 'create'])->can('create', 'Post');
    Route::post('/posts', [PostController::class, 'store'])->can('create', 'Post');
    Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->can('update', 'post');
    Route::put('/posts/{post}', [PostController::class, 'update'])->can('update', 'post');
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->can('delete', 'post');
});
```

3. **Menggunakan Policy di Blade Template:**
```blade
<!-- resources/views/posts/index.blade.php -->
@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Daftar Post</h1>
    
    @can('create', App\Models\Post::class)
        <a href="{{ route('posts.create') }}" class="btn btn-success mb-3">Buat Post Baru</a>
    @endcan
    
    @foreach($posts as $post)
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">{{ $post->title }}</h5>
                <p class="card-text">{{ Str::limit($post->content, 100) }}</p>
                
                <div class="d-flex gap-2">
                    <a href="{{ route('posts.show', $post) }}" class="btn btn-primary">Lihat</a>
                    
                    @can('update', $post)
                        <a href="{{ route('posts.edit', $post) }}" class="btn btn-warning">Edit</a>
                    @endcan
                    
                    @can('delete', $post)
                        <form action="{{ route('posts.destroy', $post) }}" method="POST" 
                              onsubmit="return confirm('Yakin ingin menghapus post ini?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger">Hapus</button>
                        </form>
                    @endcan
                </div>
            </div>
        </div>
    @endforeach
</div>
@endsection
```

---

## Bagian 3: Jurus Tingkat Lanjut - Authorization dengan Pendekatan Canggih 🚀

### 8. 👨‍👩‍👧 Policy Filters (Aturan Master untuk Admin)

**Analogi:** Bayangkan kamu punya **master key** yang bisa membuka semua pintu di gedung, bahkan tanpa harus ikuti aturan biasa. Itulah `before` method dalam policy - untuk memberikan izin otomatis pada user tertentu (misalnya admin).

**Mengapa?** Agar admin tidak perlu melewati semua peraturan satu per satu. Mereka adalah "master" dan bisa akses semua.

**Bagaimana?** Gunakan method `before` di dalam policy.
```php
<?php
// app/Policies/PostPolicy.php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    /**
     * Cek apakah user bisa mengakses resource sebelum memeriksa aturan lain
     */
    public function before(User $user, string $ability)
    {
        // Jika user adalah admin, izinkan semua aksi
        if ($user->isAdmin()) {
            return true;
        }
        
        // Jika user adalah super admin, izinkan semua aksi
        if ($user->isSuperAdmin()) {
            return true;
        }
        
        // Jika tidak, lanjutkan ke peraturan biasa
        return null;
    }

    /**
     * Cek apakah user bisa mengupdate post
     */
    public function update(User $user, Post $post): bool
    {
        // Karena before di atas, admin akan selalu bisa update
        // Jadi aturan ini hanya berlaku untuk non-admin
        return $user->id === $post->user_id;
    }

    /**
     * Cek apakah user bisa menghapus post
     */
    public function delete(User $user, Post $post): bool
    {
        // Admin bisa hapus semua post, user biasa hanya post miliknya sendiri
        return $user->id === $post->user_id || $user->isAdmin();
    }
}
```

**Contoh Lengkap dengan Policy Filter:**

1. **Policy dengan Filter:**
```php
<?php
// app/Policies/PostPolicy.php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    /**
     * Check apakah user bisa mengakses resource sebelum memeriksa aturan lain
     */
    public function before(User $user, string $ability)
    {
        // Hanya admin dan super admin yang bisa mengakses
        if ($user->isSuperAdmin()) {
            return true; // Izinkan semua aksi tanpa batas
        }
        
        if ($user->isAdmin() && in_array($ability, ['view', 'viewAny', 'create', 'update'])) {
            return true; // Admin hanya bisa view, create, update
        }
        
        return null; // Lanjutkan ke aturan biasa
    }

    /**
     * Cek apakah user bisa melihat post
     */
    public function view(User $user, Post $post): bool
    {
        // Aturan ini hanya berlaku jika before tidak mengizinkan
        return $user->id === $post->user_id;
    }

    /**
     * Cek apakah user bisa mengupdate post
     */
    public function update(User $user, Post $post): bool
    {
        // Aturan ini hanya berlaku jika before tidak mengizinkan
        return $user->id === $post->user_id;
    }

    /**
     * Cek apakah user bisa menghapus post
     */
    public function delete(User $user, Post $post): bool
    {
        // Aturan ini hanya berlaku jika before tidak mengizinkan
        return $user->id === $post->user_id;
    }
}
```

2. **Penggunaan di Controller:**
```php
<?php
// app/Http/Controllers/PostController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class PostController extends Controller
{
    /**
     * Form edit post - hanya admin atau owner yang bisa
     */
    public function edit(Post $post): View
    {
        // Policy filter akan otomatis izinkan admin
        $this->authorize('update', $post);
        return view('posts.edit', compact('post'));
    }

    /**
     * Update post - hanya admin atau owner yang bisa
     */
    public function update(Request $request, Post $post): RedirectResponse
    {
        $this->authorize('update', $post);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post->update($validated);
        
        return redirect()->route('posts.show', $post);
    }
}
```

### 9. 👤 Authorization dengan Guest User (User Belum Login)

**Analogi:** Ini untuk kasus di mana kamu ingin memberikan akses bahkan ke pengunjung yang belum login (guest user). Misalnya, hanya user terdaftar yang bisa komentar, tapi semua orang bisa baca artikelnya.

**Mengapa?** Agar bisa mengatur akses dengan lebih fleksibel, tidak hanya untuk user yang sudah login.

**Bagaimana?** Gunakan parameter nullable `?User` di policy dan gates.
```php
<?php
// app/Policies/PostPolicy.php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    /**
     * Cek apakah user bisa melihat semua post
     */
    public function viewAny(?User $user): bool
    {
        return true; // Semua orang bisa lihat list post
    }

    /**
     * Cek apakah user bisa melihat detail post tertentu
     */
    public function view(?User $user, Post $post): bool
    {
        // Semua orang bisa lihat post, bahkan guest
        return true;
    }

    /**
     * Cek apakah user bisa membuat post baru
     */
    public function create(?User $user): bool
    {
        return $user !== null; // Harus login
    }

    /**
     * Cek apakah user bisa mengupdate post
     */
    public function update(?User $user, Post $post): bool
    {
        // Jika user null (guest), tidak bisa update
        return $user?->id === $post->user_id;
    }

    /**
     * Cek apakah user bisa menghapus post
     */
    public function delete(?User $user, Post $post): bool
    {
        return $user?->id === $post->user_id || $user?->isAdmin();
    }
}
```

**Contoh Lengkap dengan Guest User:**

1. **Policy dengan Nullable User:**
```php
<?php
// app/Policies/PostPolicy.php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    /**
     * Cek apakah user bisa melihat semua posts (termasuk guest)
     */
    public function viewAny(?User $user): bool
    {
        return true; // Semua bisa lihat daftar posts
    }

    /**
     * Cek apakah user bisa melihat post tertentu (termasuk guest)
     */
    public function view(?User $user, Post $post): bool
    {
        // Bisa diakses jika post publik, atau user pemiliknya
        return $post->is_public || $user?->id === $post->user_id;
    }

    /**
     * Cek apakah user bisa membuat post (harus login)
     */
    public function create(?User $user): bool
    {
        return $user !== null; // Harus login
    }

    /**
     * Cek apakah user bisa mengupdate post
     */
    public function update(?User $user, Post $post): bool
    {
        return $user?->id === $post->user_id;
    }

    /**
     * Cek apakah user bisa menghapus post
     */
    public function delete(?User $user, Post $post): bool
    {
        return $user?->id === $post->user_id || $user?->isAdmin();
    }
}
```

2. **Controller yang Menangani Guest User:**
```php
<?php
// app/Http/Controllers/PostController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class PostController extends Controller
{
    /**
     * Tampilkan semua posts (bisa diakses oleh guest)
     */
    public function index(): View
    {
        $this->authorize('viewAny', Post::class);
        $posts = Post::where('is_public', true)->get();
        return view('posts.index', compact('posts'));
    }

    /**
     * Tampilkan post (bisa diakses oleh guest jika publik)
     */
    public function show(Post $post): View
    {
        $this->authorize('view', $post);
        return view('posts.show', compact('post'));
    }

    /**
     * Form buat post (harus login)
     */
    public function create(): View
    {
        $this->authorize('create', Post::class);
        return view('posts.create');
    }

    /**
     * Simpan post baru (harus login)
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Post::class);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_public' => 'boolean',
        ]);

        $request->user()->posts()->create(array_merge($validated, [
            'is_public' => $validated['is_public'] ?? false
        ]));
        
        return redirect()->route('posts.index');
    }
}
```

### 10. 🎨 Authorization dengan Kustomisasi Lengkap

Kamu bisa menyesuaikan authorization dengan berbagai pendekatan:

*   **Authorization dengan Pesan Kustom**:
    ```php
    use Illuminate\Auth\Access\Response;

    public function update(User $user, Post $post): Response
    {
        if ($user->id !== $post->user_id) {
            return Response::deny('Hanya pemilik post yang bisa mengedit.');
        }

        if ($post->is_locked) {
            return Response::deny('Post ini terkunci dan tidak bisa diedit.');
        }

        return Response::allow();
    }
    ```

*   **Authorization dengan Context Tambahan**:
    ```php
    // Di Gates
    Gate::define('create-post', function (User $user, ?Category $category = null) {
        if (! $category) {
            return $user->canCreateGeneralPosts();
        }
        
        return $user->canCreatePostsInCategory($category);
    });

    // Gunakan dengan parameter tambahan
    if (Gate::check('create-post', [$category])) {
        // User bisa create post dalam kategori ini
    }
    ```

*   **Authorization di Blade dengan Else Logic**:
    ```blade
    @can('update', $post)
        <a href="{{ route('posts.edit', $post) }}" class="btn btn-warning">Edit</a>
    @else
        <span class="text-muted">Anda tidak bisa mengedit post ini</span>
    @endcan

    @cannot('delete', $post)
        <span class="text-muted">Anda tidak bisa menghapus post ini</span>
    @else
        <form action="{{ route('posts.destroy', $post) }}" method="POST">
            @csrf
            @method('DELETE')
            <button type="submit" class="btn btn-danger">Hapus</button>
        </form>
    @endcannot
    ```

*   **Authorization di Route Model Binding**:
    ```php
    // routes/web.php
    Route::resource('posts', PostController::class)->middleware('auth');

    // Dan di controller, authorization otomatis dijalankan
    public function show(Post $post) // Model binding otomatis
    {
        $this->authorize('view', $post); // Authorization
        return view('posts.show', compact('post'));
    }
    ```

*   **Authorization dengan Conditional Logic**:
    ```php
    public function update(User $user, Post $post): bool
    {
        // User bisa update post miliknya sendiri
        if ($user->id === $post->user_id) {
            return true;
        }
        
        // Admin bisa update post orang lain
        if ($user->isAdmin()) {
            return true;
        }
        
        // Editor bisa update post jika belum dipublish
        if ($user->isEditor() && ! $post->is_published) {
            return true;
        }
        
        return false;
    }
    ```

### 11.5 🔐 Middleware Authorization di Controller

Kamu juga bisa menambahkan authorization middleware pada controller dengan berbagai tingkat spesifikasi:

*   **Middleware untuk semua aksi:**
    ```php
    class PostController extends Controller
    {
        public function __construct()
        {
            $this->middleware('auth');
        }
    }
    ```

*   **Authorization middleware untuk aksi tertentu:**
    ```php
    Route::middleware(['auth'])->group(function () {
        Route::get('/posts', [PostController::class, 'index'])->can('viewAny', 'Post');
        Route::get('/posts/{post}', [PostController::class, 'show'])->can('view', 'post');
        Route::put('/posts/{post}', [PostController::class, 'update'])->can('update', 'post');
        Route::delete('/posts/{post}', [PostController::class, 'destroy'])->can('delete', 'post');
    });
    ```

*   **Authorization di Controller Method:**
    ```php
    class PostController extends Controller
    {
        public function update(Request $request, Post $post)
        {
            // Authorization langsung di method
            $this->authorize('update', $post);
            
            // Proses update
            $post->update($request->validated());
            
            return response()->json($post);
        }
    }
    ```

**Contoh Lengkap Middleware Authorization:**
```php
// routes/web.php
use App\Http\Controllers\PostController;

Route::middleware(['auth'])->group(function () {
    // Semua aksi butuh auth, tambahan authorization per aksi
    Route::get('/posts', [PostController::class, 'index'])->can('viewAny', 'Post');
    Route::get('/posts/create', [PostController::class, 'create'])->can('create', 'Post');
    Route::post('/posts', [PostController::class, 'store'])->can('create', 'Post');
    Route::get('/posts/{post}', [PostController::class, 'show'])->can('view', 'post');
    Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->can('update', 'post');
    Route::put('/posts/{post}', [PostController::class, 'update'])->can('update', 'post');
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->can('delete', 'post');
});
```

### 11.7 🌐 Authorization di API (Lengkap dengan Response Detail)

**Mengapa?** Saat membuat API, kamu butuh memberikan response authorization yang jelas ke frontend atau mobile app.

**Bagaimana?**
```php
<?php
// app/Http/Controllers/Api/PostController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PostController extends Controller
{
    /**
     * Tampilkan semua posts dengan authorization
     */
    public function index(): ResourceCollection
    {
        $this->authorize('viewAny', Post::class);
        $posts = Post::latest()->paginate(10);
        return PostResource::collection($posts);
    }

    /**
     * Simpan post baru dengan authorization
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Post::class);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_public' => 'boolean',
        ]);

        $post = $request->user()->posts()->create(array_merge($validated, [
            'is_public' => $validated['is_public'] ?? false
        ]));

        return response()->json([
            'message' => 'Post created successfully',
            'data' => new PostResource($post)
        ], 201);
    }

    /**
     * Tampilkan detail post dengan authorization
     */
    public function show(Post $post): JsonResponse
    {
        $this->authorize('view', $post);
        return response()->json([
            'data' => new PostResource($post)
        ]);
    }

    /**
     * Update post dengan authorization
     */
    public function update(Request $request, Post $post): JsonResponse
    {
        $this->authorize('update', $post);
        
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'is_public' => 'boolean',
        ]);

        $post->update($validated);

        return response()->json([
            'message' => 'Post updated successfully',
            'data' => new PostResource($post)
        ]);
    }

    /**
     * Hapus post dengan authorization
     */
    public function destroy(Post $post): JsonResponse
    {
        $this->authorize('delete', $post);
        $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully'
        ]);
    }
}
```

### 11. 🗑️ Authorization dengan Soft Deletes

**Mengapa?** Terkadang kamu ingin memeriksa authorization pada model yang sudah dihapus sementara (soft delete).

**Bagaimana?**
*   **Authorization untuk model yang dihapus:** Gunakan `withTrashed()` di policy jika kamu ingin izinkan akses ke item yang dihapus.
*   **Authorization untuk restore:** Buat aturan khusus untuk restore.

**Contoh Lengkap dengan Soft Delete Authorization:**

1. **Policy dengan Soft Delete:**
```php
<?php
// app/Policies/PostPolicy.php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    /**
     * Cek apakah user bisa melihat post (termasuk yang dihapus)
     */
    public function view(User $user, Post $post): bool
    {
        // Izinkan lihat post bahkan jika dihapus, asalkan user pemiliknya
        return $user->id === $post->user_id;
    }

    /**
     * Cek apakah user bisa menghapus post
     */
    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->isAdmin();
    }

    /**
     * Cek apakah user bisa merestore post yang dihapus
     */
    public function restore(User $user, Post $post): bool
    {
        // Hanya owner atau admin yang bisa restore
        return $user->id === $post->user_id || $user->isAdmin();
    }

    /**
     * Cek apakah user bisa menghapus permanen
     */
    public function forceDelete(User $user, Post $post): bool
    {
        return $user->isAdmin();
    }
}
```

2. **Controller dengan Soft Delete:**
```php
<?php
// app/Http/Controllers/PostController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class PostController extends Controller
{
    /**
     * Tampilkan post yang dihapus (hanya admin)
     */
    public function trashed(): View
    {
        $this->authorize('viewAny', Post::class);
        $posts = Post::onlyTrashed()->get();
        return view('posts.trashed', compact('posts'));
    }

    /**
     * Restore post yang dihapus
     */
    public function restore(string $id): RedirectResponse
    {
        $post = Post::withTrashed()->findOrFail($id);
        $this->authorize('restore', $post);
        
        $post->restore();
        
        return redirect()->route('posts.show', $post)
            ->with('status', 'Post berhasil direstore!');
    }

    /**
     * Hapus permanen post
     */
    public function forceDestroy(string $id): RedirectResponse
    {
        $post = Post::withTrashed()->findOrFail($id);
        $this->authorize('forceDelete', $post);
        
        $post->forceDelete();
        
        return redirect()->route('posts.index')
            ->with('status', 'Post dihapus secara permanen!');
    }
}
```

3. **Route untuk Soft Delete Authorization:**
```php
// routes/web.php
use App\Http\Controllers\PostController;

Route::middleware(['auth'])->group(function () {
    Route::get('/posts/trashed', [PostController::class, 'trashed'])->can('viewAny', 'Post');
    Route::patch('/posts/{post}/restore', [PostController::class, 'restore'])->can('restore', 'post');
    Route::delete('/posts/{post}/force', [PostController::class, 'forceDestroy'])->can('forceDelete', 'post');
});
```

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Authorization 🧰

### 12. 🔐 Authorization di Controller (Satpam Pribadi)

**Mengapa?** Terkadang, semua method di sebuah controller butuh pengecekan authorization yang sama (misalnya, harus login dan punya role tertentu). Menaruhnya di controller lebih praktis daripada menuliskannya di setiap method.

**Bagaimana?**
*   **Cara Modern (`authorizeResource`)**: Ini seperti satpam yang otomatis mengecek authorization untuk semua method CRUD standar.
    ```php
    use App\Models\Post;

    class PostController extends Controller
    {
        public function __construct()
        {
            // Otomatis cek authorization untuk semua method
            $this->authorizeResource(Post::class);
        }
    }
    ```

*   **Cara Manual (`authorize` di setiap method)**: Untuk kontrol lebih lanjut.
    ```php
    class PostController extends Controller
    {
        public function index()
        {
            $this->authorize('viewAny', Post::class);
            // ...
        }

        public function show(Post $post)
        {
            $this->authorize('view', $post);
            // ...
        }
    }
    ```

### 13. 💉 Authorization dengan Dependency Injection

**Prinsipnya: Jangan buat authorization dari nol, gunakan yang sudah disediakan!** Laravel menyediakan berbagai cara untuk mengintegrasikan authorization ke dalam aplikasi dengan sangat fleksibel.

**Mengapa?** Ini membuat kodemu sangat fleksibel, mudah di-test, dan tidak terikat pada satu cara pemeriksaan authorization.

**Bagaimana?**
*   **Authorization via Gate Facade**: Meminta izin langsung dari sistem Gates.
    ```php
    public function update(Request $request, Post $post) 
    {
        if (! Gate::allows('update-post', $post)) {
            abort(403);
        }
        // ...
    }
    ```
*   **Authorization via User Method**: Memeriksa izin melalui method user.
    ```php
    public function update(Request $request, Post $post) 
    {
        if ($request->user()->cannot('update', $post)) {
            abort(403);
        }
        // ...
    }
    ```

**Contoh Lengkap Dependency Injection Authorization:**

1. **Membuat Service Class dengan Authorization:**
```php
<?php
// app/Services/PostAuthorizationService.php

namespace App\Services;

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

class PostAuthorizationService
{
    public function checkUserCanUpdate(User $user, Post $post): bool
    {
        return Gate::forUser($user)->allows('update', $post);
    }

    public function checkUserCanDelete(User $user, Post $post): bool
    {
        return $user->can('delete', $post);
    }

    public function getUserPermissions(User $user): array
    {
        return [
            'can_create_post' => $user->can('create', Post::class),
            'can_view_posts' => $user->can('viewAny', Post::class),
            'can_manage_posts' => $user->can('manage', Post::class),
        ];
    }
}
```

2. **Controller dengan Constructor Injection Authorization:**
```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Services\PostAuthorizationService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class AdvancedPostController extends Controller
{
    // Constructor injection untuk authorization service
    public function __construct(
        protected PostAuthorizationService $authService
    ) {}

    public function index(Request $request): View
    {
        $permissions = $this->authService->getUserPermissions($request->user());
        
        if (! $permissions['can_view_posts']) {
            abort(403);
        }

        $posts = Post::all();
        return view('posts.index', compact('posts'));
    }

    public function store(Request $request): RedirectResponse
    {
        if (! $this->authService->checkUserCanUpdate($request->user(), new Post())) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $request->user()->posts()->create($validated);
        
        return redirect()->route('posts.index');
    }

    public function update(Request $request, Post $post): RedirectResponse
    {
        if (! $this->authService->checkUserCanUpdate($request->user(), $post)) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post->update($validated);
        
        return redirect()->route('posts.show', $post);
    }
}
```

3. **Authorization Method Injection:**
```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class InjectionPostController extends Controller
{
    public function edit(Post $post, Request $request): View
    {
        // Authorization check menggunakan request dan model binding
        $this->authorize('update', $post);
        
        return view('posts.edit', compact('post'));
    }

    public function update(Request $request, Post $post, string $id): RedirectResponse
    {
        // Authorization check dengan model binding dan additional parameter
        $this->authorize('update', $post);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post->update($validated);
        
        return redirect()->route('posts.show', $post->id);
    }
}
```

Dependency Injection dalam authorization membuat kode kamu:
- **Lebih modular**: Setiap class punya tanggung jawab authorization sendiri
- **Lebih mudah di-test**: Kamu bisa mock authorization service saat testing
- **Lebih fleksibel**: Mudah untuk mengganti pendekatan authorization
- **Lebih bersih**: Controller tidak kotor dengan hard-coded authorization logic

### 13.5 🏗️ Authorization Helper dan Method Lengkap

Ada beberapa pendekatan untuk authorization di Laravel:

**1. Authorization Helper Methods:**
```php
class PostController extends Controller
{
    public function show(Post $post)
    {
        // Berbagai cara mengecek authorization
        $this->authorize('view', $post); // Throw exception jika tidak diizinkan
        $this->authorizeForUser(auth()->user(), 'view', $post); // Cek authorization untuk user tertentu
        
        // Cek tanpa throw exception
        if (! auth()->user()->can('view', $post)) {
            abort(403);
        }
    }
}
```

**2. Authorization dengan Response Detail:**
```php
use Illuminate\Auth\Access\Response;

public function update(User $user, Post $post): Response
{
    if ($user->id !== $post->user_id) {
        return Response::deny('Anda bukan pemilik post ini.', 403);
    }

    if ($post->is_locked) {
        return Response::deny('Post ini telah dikunci.', 403);
    }

    return Response::allow('Anda diizinkan mengedit post ini.');
}
```

### 14. 👮 Authorization Context dan Gate Response

**Mengapa?** Terkadang kamu butuh memberikan informasi lebih lanjut selain hanya "boleh/tidak", seperti pesan alasan, atau bahkan metadata tambahan.

**Bagaimana?** Gunakan `Response` untuk memberikan detail authorization.

```php
use Illuminate\Auth\Access\Response;

// Di Gates
Gate::define('view-post', function (User $user, Post $post) {
    if ($post->is_public) {
        return Response::allow();
    }
    
    if ($user->id === $post->user_id) {
        return Response::allow();
    }
    
    if ($user->isSubscriber() && $post->is_premium) {
        return Response::deny('Berlangganan diperlukan untuk mengakses post ini.', [
            'requires_subscription' => true
        ]);
    }
    
    return Response::deny('Post ini tidak publik.');
});

// Di Policies
public function view(User $user, Post $post): Response
{
    if ($post->is_public) {
        return Response::allow('Post ini publik dan bisa diakses semua orang.');
    }
    
    if ($user->id === $post->user_id) {
        return Response::allow('Anda pemilik post ini.');
    }
    
    return Response::deny('Anda tidak punya akses ke post ini.', 403);
}
```

**Contoh Lengkap dengan Authorization Context:**

1. **Gates dengan Context:**
```php
// app/Providers/AppServiceProvider.php
use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    // Gates dengan response detail
    Gate::define('view-post', function (User $user, Post $post) {
        if ($post->is_public) {
            return Response::allow();
        }
        
        if ($user->id === $post->user_id) {
            return Response::allow();
        }
        
        return Response::deny('Post ini bukan publik dan bukan milik Anda.');
    });

    // Gates dengan parameter tambahan
    Gate::define('create-post-in-category', function (User $user, Category $category) {
        if (! $user->isVerified()) {
            return Response::deny('Anda harus verifikasi akun terlebih dahulu.');
        }
        
        if (! $user->canPostInCategory($category)) {
            return Response::deny("Anda tidak diizinkan membuat post di kategori {$category->name}.");
        }
        
        return Response::allow();
    });
}
```

2. **Menggunakan Authorization Context:**
```php
<?php
// app/Http/Controllers/PostController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\View\View;

class PostController extends Controller
{
    public function show(Post $post): View
    {
        $response = Gate::inspect('view-post', $post);
        
        if (! $response->allowed()) {
            if ($response->message() === 'Post ini bukan publik dan bukan milik Anda.') {
                return redirect()->route('login')
                    ->with('error', 'Silakan login untuk mengakses post ini.');
            }
            
            abort(403, $response->message());
        }
        
        return view('posts.show', compact('post'));
    }

    public function create(Request $request): View
    {
        $category = $request->query('category');
        if ($category) {
            $response = Gate::inspect('create-post-in-category', $category);
            if (! $response->allowed()) {
                return back()->with('error', $response->message());
            }
        }
        
        return view('posts.create');
    }
}
```

---

## Bagian 5: Menjadi Master Authorization 🏆

### 15. ✨ Wejangan dari Guru

1.  **Authorization itu Proteksi, bukan Hambatan**: Buat sistem authorization yang aman tapi tetap user-friendly. Jangan membuat pengalaman pengguna buruk hanya untuk keamanan.
2.  **Gates untuk Aturan Sederhana**: Gunakan Gates untuk aturan authorization sederhan dan tidak terikat pada model tertentu.
3.  **Policies untuk Aturan Berbasis Model**: Gunakan Policies ketika authorization terkait dengan model dan memiliki banyak method.
4.  **Gunakan Policy Filters untuk Admin**: Implementasikan `before` untuk memberikan akses otomatis pada admin.
5.  **Jangan Lupa Authorization di Semua Layer**: Authorization harus diterapkan di controller, middleware, blade template, bahkan API.
6.  **Gunakan Authorization Response untuk Pesan Kustom**: Berikan pesan penolakan yang informatif dan bermanfaat.
7.  **Test Authorization dengan Baik**: Buat test untuk memastikan authorization bekerja sesuai harapan.

### 16. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Authorization di Laravel:

#### 🚪 Gates
| Perintah | Fungsi |
|----------|--------|
| `Gate::define('action', function ($user, $model) { ... });` | Definisikan gate sederhana |
| `Gate::allows('action', $model)` | Cek apakah user diizinkan (true/false) |
| `Gate::denies('action', $model)` | Cek apakah user ditolak (true/false) |
| `Gate::authorize('action', $model)` | Cek authorization, throw exception jika tidak diizinkan |
| `Gate::forUser($user)->allows('action', $model)` | Cek authorization untuk user tertentu |
| `Gate::before(function ($user, $ability) { ... });` | Hook sebelum semua gates |
| `Gate::after(function ($user, $ability, $result, $arguments) { ... });` | Hook setelah semua gates |
| `Gate::allowIf(fn($user) => true)` | Inline gate untuk izinkan |
| `Gate::denyIf(fn($user) => true)` | Inline gate untuk tolak |

#### 📑 Policies
| Perintah | Fungsi |
|----------|--------|
| `php artisan make:policy PostPolicy --model=Post` | Buat policy untuk model Post |
| `Gate::policy(Post::class, PostPolicy::class)` | Daftarkan policy secara manual |
| `$this->authorize('action', $model)` | Cek authorization di controller |
| `@can('action', $model)` | Cek authorization di blade template |
| `@cannot('action', $model)` | Cek apakah tidak diizinkan di blade template |
| `@canany(['action1', 'action2'])` | Cek apakah bisa salah satu dari beberapa aksi |

#### 🛡️ Authorization Methods di Policy
| Method | Fungsi |
|--------|--------|
| `viewAny(User $user)` | Cek izin lihat semua model |
| `view(User $user, Model $model)` | Cek izin lihat model tertentu |
| `create(User $user)` | Cek izin buat model |
| `update(User $user, Model $model)` | Cek izin update model |
| `delete(User $user, Model $model)` | Cek izin hapus model |
| `restore(User $user, Model $model)` | Cek izin restore model (soft delete) |
| `forceDelete(User $user, Model $model)` | Cek izin hapus permanen model (soft delete) |

#### 🎯 Authorization dengan Response
| Perintah | Hasil |
|----------|--------|
| `Response::allow()` | Izinkan akses |
| `Response::allow('pesan sukses')` | Izinkan akses dengan pesan |
| `Response::deny('pesan penolakan')` | Tolak akses dengan pesan |
| `Response::deny('pesan', 403)` | Tolak akses dengan pesan dan status code |

#### 🔐 Authorization di Controller
| Perintah | Fungsi |
|----------|--------|
| `$this->authorize('action', $model)` | Authorization di method controller |
| `$this->authorizeResource(Model::class)` | Authorization otomatis untuk semua method CRUD |
| `public function __construct() { $this->middleware('can:update,post'); }` | Authorization via middleware di constructor |

#### 🌐 Authorization di Route & Middleware
| Perintah | Fungsi |
|----------|--------|
| `Route::middleware('can:update,post')` | Authorization di route definition |
| `Route::get('/post/{post}')->can('update', 'post')` | Authorization via can directive |
| `@can('action', $model)` | Authorization di blade template |

#### 📦 Artisan Commands
| Command | Fungsi |
|---------|--------|
| `php artisan make:policy PostPolicy` | Membuat policy kosong |
| `php artisan make:policy PostPolicy --model=Post` | Membuat policy dengan model binding |

#### 📋 Authorization Response Methods
| Method | Fungsi |
|--------|--------|
| `$response->allowed()` | Cek apakah diizinkan |
| `$response->denied()` | Cek apakah ditolak |
| `$response->message()` | Ambil pesan dari response |
| `$response->code()` | Ambil status code dari response |

### 17. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Authorization, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Ingat, Authorization adalah benteng keamanan dari aplikasi. Menguasainya berarti kamu sudah siap membangun aplikasi Laravel yang aman, terstruktur, dan scalable.

Authorization bukan hanya tentang mencegah akses tidak sah, tapi juga tentang memberikan pengalaman pengguna yang tepat. Dengan pendekatan Laravel yang fleksibel, kamu bisa membangun sistem otorisasi yang kompleks namun tetap mudah dikelola.

Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku!

---

**Catatan Tambahan:**
Authorization adalah bagian penting dari keamanan aplikasi web. Pastikan selalu menguji authorizationmu secara menyeluruh dan pertimbangkan semua skenario akses yang mungkin terjadi dalam aplikasimu. Dengan pendekatan Laravel, authorization bisa menjadi seni tersendiri dalam pengembangan aplikasi - kuat, aman, namun tetap elegan. 🛡️✨
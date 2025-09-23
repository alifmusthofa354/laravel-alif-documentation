# 🔐 Laravel Authorization

## 📖 Pendahuluan
Laravel tidak hanya menyediakan layanan **autentikasi** bawaan, tetapi juga memiliki cara sederhana untuk **otorisasi (authorization)** terhadap aksi pengguna pada sebuah resource. Misalnya, seorang pengguna yang sudah login mungkin tidak memiliki izin untuk **update** atau **delete** model tertentu.

Laravel menyediakan dua cara utama untuk otorisasi:

- **Gates** 👉 aturan sederhana berbasis closure.
- **Policies** 👉 kelas khusus yang mengatur otorisasi berdasarkan model/resource.

> 🔎 **Analogi**: Gates itu seperti *route*, sedangkan Policies itu seperti *controller*.

Keduanya bisa dipakai bersamaan sesuai kebutuhan aplikasi.

---

## 🚪 Gates
### ✍️ Menulis Gates
Gates adalah closure yang memutuskan apakah user bisa melakukan aksi tertentu. Biasanya didefinisikan di dalam `App\Providers\AppServiceProvider` menggunakan `Gate` facade.

📌 **Contoh Gate sederhana:**
```php
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    Gate::define('update-post', function (User $user, Post $post) {
        return $user->id === $post->user_id;
    });
}
```

📌 **Contoh dengan Policy callback:**
```php
use App\Policies\PostPolicy;
use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    Gate::define('update-post', [PostPolicy::class, 'update']);
}
```

---

### ✅ Mengotorisasi Aksi dengan Gates
Gunakan `allows` atau `denies` untuk mengecek otorisasi:
```php
if (! Gate::allows('update-post', $post)) {
    abort(403);
}
```

Untuk user tertentu:
```php
if (Gate::forUser($user)->allows('update-post', $post)) {
    // user bisa update post
}
```

Cek banyak aksi sekaligus:
```php
if (Gate::any(['update-post', 'delete-post'], $post)) {
    // user bisa update atau delete
}
```

---

### 🚨 Otorisasi dengan Exception
Laravel bisa otomatis **throw exception** jika gagal otorisasi:
```php
Gate::authorize('update-post', $post);
// Jika gagal -> 403
```

---

### 🧩 Memberi Context Tambahan
Gate bisa menerima parameter tambahan:
```php
Gate::define('create-post', function (User $user, Category $category, bool $pinned) {
    if (! $user->canPublishToGroup($category->group)) {
        return false;
    } elseif ($pinned && ! $user->canPinPosts()) {
        return false;
    }
    return true;
});

if (Gate::check('create-post', [$category, $pinned])) {
    // user bisa create post
}
```

---

### 📋 Gate Response dengan Pesan
Selain `true/false`, kita bisa return **Response** dengan pesan error:
```php
use Illuminate\Auth\Access\Response;

Gate::define('edit-settings', function (User $user) {
    return $user->isAdmin
        ? Response::allow()
        : Response::deny('Kamu harus admin.');
});
```

Ambil pesan dari response:
```php
$response = Gate::inspect('edit-settings');
if (! $response->allowed()) {
    echo $response->message();
}
```

---

### ⚡ Before & After Hooks
Kadang kita ingin user admin bisa akses semua hal:
```php
Gate::before(function (User $user, string $ability) {
    if ($user->isAdministrator()) {
        return true;
    }
});
```

Hook `after` juga tersedia untuk logging atau override.

---

### ⚡ Inline Authorization
Jika butuh otorisasi cepat tanpa Gate khusus:
```php
Gate::allowIf(fn (User $user) => $user->isAdministrator());
Gate::denyIf(fn (User $user) => $user->banned());
```

---

## 📑 Policies
Policies mengorganisir logika otorisasi di dalam kelas. Biasanya dibuat per-model.

### 🛠️ Membuat Policy
```bash
php artisan make:policy PostPolicy --model=Post
```

File akan dibuat di `app/Policies/PostPolicy.php`.

### 🔗 Registrasi Policy
Laravel otomatis menemukan policy jika penamaan mengikuti konvensi. Jika tidak, bisa daftarkan manual:
```php
Gate::policy(Post::class, PostPolicy::class);
```

---

### ✍️ Menulis Policy Methods
Contoh method update di `PostPolicy`:
```php
public function update(User $user, Post $post): bool
{
    return $user->id === $post->user_id;
}
```

Dengan Response:
```php
public function update(User $user, Post $post): Response
{
    return $user->id === $post->user_id
        ? Response::allow()
        : Response::deny('Post ini bukan milikmu.');
}
```

---

### 👥 Guest User & Optional User
Bisa menerima user `null`:
```php
public function update(?User $user, Post $post): bool
{
    return $user?->id === $post->user_id;
}
```

---

### 🚦 Policy Filters
Buat admin bisa bypass semua aturan:
```php
public function before(User $user, string $ability)
{
    if ($user->isAdministrator()) {
        return true;
    }
    return null;
}
```

---

## ⚙️ Menggunakan Policies
### 👤 Via User Model
```php
if ($request->user()->cannot('update', $post)) {
    abort(403);
}
```

### 🏛️ Via Gate Facade
```php
Gate::authorize('update', $post);
```

### 🛡️ Via Middleware
```php
Route::put('/post/{post}', function (Post $post) {
    // authorized
})->middleware('can:update,post');
```

### 🎨 Via Blade Template
```blade
@can('update', $post)
    <!-- User bisa update -->
@endcan

@cannot('update', $post)
    <!-- User tidak bisa update -->
@endcannot
```

---

## 🔗 Authorization & Inertia
Kita bisa share info otorisasi ke frontend melalui middleware `HandleInertiaRequests`:
```php
return [
    'auth' => [
        'user' => $request->user(),
        'permissions' => [
            'post' => [
                'create' => $request->user()->can('create', Post::class),
            ],
        ],
    ],
];
```

---

## 🏁 Kesimpulan
- Gunakan **Gates** untuk aksi sederhana.
- Gunakan **Policies** untuk aksi yang terkait dengan model.
- Laravel mendukung otorisasi lewat **Controller, Middleware, Blade, hingga Inertia**.
- Fleksibilitas penuh: bisa pakai boolean, response dengan pesan, bahkan custom status code.

Dengan otorisasi ini, aplikasi Laravel jadi lebih **aman, terstruktur, dan scalable**. 🚀
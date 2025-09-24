# 🎛️ **Controllers di Laravel**

---

## 📖 **1. Introduction**

Daripada menuliskan seluruh logic request di file route menggunakan closure, kita bisa memindahkan logika tersebut ke dalam **Controller**.

* 🔄 Controller membantu mengelompokkan logic yang berhubungan dalam satu class.
* 👤 Contoh: `UserController` untuk menangani aksi terkait pengguna (show, create, update, delete).
* 📁 Secara default, controller disimpan di:

  ```
  app/Http/Controllers
  ```

---

## ✍️ **2. Writing Controllers**

### 🛠️ **2.1. Membuat Controller**

Gunakan Artisan command:

```bash
php artisan make:controller UserController
```

---

### 🧱 **2.2. Basic Controller**

Contoh:

```php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\View\View;

class UserController extends Controller
{
    public function show(string $id): View
    {
        return view('user.profile', [
            'user' => User::findOrFail($id)
        ]);
    }
}
```

Daftarkan route:

```php
use App\Http\Controllers\UserController;

Route::get('/user/{id}', [UserController::class, 'show']);
```

---

### ⚡ **2.3. Single Action Controller**

Controller hanya dengan satu method `__invoke`:

```php
namespace App\Http\Controllers;

class ProvisionServer extends Controller
{
    public function __invoke()
    {
        // ...
    }
}
```

Route:

```php
use App\Http\Controllers\ProvisionServer;

Route::post('/server', ProvisionServer::class);
```

Generate invokable controller:

```bash
php artisan make:controller ProvisionServer --invokable
```

---

### 🧪 **2.3 Contoh Simple Controller**
---

#### 🛠️ **1. Membuat Controller**

Gunakan perintah Artisan:

```bash
php artisan make:controller WelcomeController
```

Ini akan membuat file `app/Http/Controllers/WelcomeController.php`.

---

#### 📝 **2. Isi Controller**

Edit file `WelcomeController.php` menjadi seperti ini:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class WelcomeController extends Controller
{
    /**
     * Tampilkan halaman welcome.
     */
    // Kirim data title ke view

    return view('welcome', [
        'title' => 'Halaman Utama Laravel'
    ]);
}
```

---

#### 🛣️ **3. Definisikan Route**

Buka file `routes/web.php` lalu tambahkan:

```php
use App\Http\Controllers\WelcomeController;

Route::get('/', [WelcomeController::class, 'index']);
```

---

#### 👀 **4. View Welcome**

Laravel secara default sudah punya view `resources/views/welcome.blade.php`.
Jadi, route `/` akan otomatis menampilkan halaman **welcome** bawaan Laravel.

Kalau mau bikin versi custom, kamu bisa edit file tersebut, misalnya:

```blade
<!-- resources/views/welcome.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>{{ $title ?? 'Laravel App' }}</title>
</head>
<body>
    <h1>{{ $title }}</h1>
    <p>Selamat Datang di Laravel! Ini adalah halaman welcome sederhana dari controller.</p>
</body>
</html>

```

---

✅ Hasil akhirnya:

* 🌐 Akses `http://localhost:8000/`
* 🔄 Laravel akan memanggil `WelcomeController@index` → return `welcome.blade.php`.

---



## 🔐 **3. Controller Middleware**

Middleware bisa ditambahkan di routes:

```php
Route::get('/profile', [UserController::class, 'show'])->middleware('auth');
```

Atau langsung di controller:

```php
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
            new Middleware('log', only: ['index']),
            new Middleware('subscribed', except: ['store']),
        ];
    }
}
```

Middleware juga bisa ditulis inline:

```php
public static function middleware(): array
{
    return [
        function (Request $request, Closure $next) {
            return $next($request);
        },
    ];
}
```

---

## 📦 **4. Resource Controllers**

### 🛠️ **4.1. Membuat Resource Controller**

```bash
php artisan make:controller PhotoController --resource
```

Daftarkan:

```php
Route::resource('photos', PhotoController::class);
```

Akan menghasilkan route CRUD lengkap.

---

### 📚 **4.2. Multiple Resource Controllers**

```php
Route::resources([
    'photos' => PhotoController::class,
    'posts'  => PostController::class,
]);
```

### 🗑️ **4.3. Soft Deletable Resources**

```php
Route::softDeletableResources([
    'photos' => PhotoController::class,
    'posts'  => PostController::class,
]);
```

---

### 📋 **4.4. Actions dalam Resource**

| 🔄 Verb      | 🔗 URI                  | 🎯 Action  | 🏷️ Route Name     |
| --------- | -------------------- | ------- | -------------- |
| GET       | /photos              | index   | photos.index   |
| GET       | /photos/create       | create  | photos.create  |
| POST      | /photos              | store   | photos.store   |
| GET       | /photos/{photo}      | show    | photos.show    |
| GET       | /photos/{photo}/edit | edit    | photos.edit    |
| PUT/PATCH | /photos/{photo}      | update  | photos.update  |
| DELETE    | /photos/{photo}      | destroy | photos.destroy |

---

### 🔧 **4.5. Customizing Missing Model**

```php
Route::resource('photos', PhotoController::class)
    ->missing(function (Request $request) {
        return Redirect::route('photos.index');
    });
```

### 🗑️ **4.6. Soft Deleted Models**

```php
Route::resource('photos', PhotoController::class)->withTrashed();
Route::resource('photos', PhotoController::class)->withTrashed(['show']);
```

---

### 🧬 **4.7. Membuat Controller dengan Model**

```bash
php artisan make:controller PhotoController --model=Photo --resource
```

### 📝 **4.8. Membuat dengan Form Requests**

```bash
php artisan make:controller PhotoController --model=Photo --resource --requests
```

---

## 🎯 **5. Partial Resource Routes**

### ✅ **5.1. only()**

```php
Route::resource('photos', PhotoController::class)->only(['index', 'show']);
```

### ❌ **5.2. except()**

```php
Route::resource('photos', PhotoController::class)->except(['create', 'store']);
```

---

## 🌐 **6. API Resource Routes**

### 🚀 **6.1. Dasar**

```php
Route::apiResource('photos', PhotoController::class);
```

Hanya membuat: index, store, show, update, destroy.

### 📚 **6.2. Banyak API Resources**

```php
Route::apiResources([
    'photos' => PhotoController::class,
    'posts'  => PostController::class,
]);
```

### ⚡ **6.3. Generate API Controller**

```bash
php artisan make:controller PhotoController --api
```

---

## 🧩 **7. Nested Resources**

### 🔗 **7.1. Nested Resource**

```php
Route::resource('photos.comments', PhotoCommentController::class);
```

### 🧭 **7.2. Shallow Nesting**

```php
Route::resource('photos.comments', CommentController::class)->shallow();
```

### 🎯 **7.3. Scoped Nested Resources**

```php
Route::resource('photos.comments', PhotoCommentController::class)->scoped([
    'comment' => 'slug',
]);
```

---

## 🏷️ **8. Naming Resource Routes & Parameters**

### 🔧 **8.1. Custom Route Names**

```php
Route::resource('photos', PhotoController::class)->names([
    'create' => 'photos.build'
]);
```

### 🆔 **8.2. Custom Route Parameters**

```php
Route::resource('users', AdminUserController::class)->parameters([
    'users' => 'admin_user'
]);
```

### 🌍 **8.3. Localizing Resource URIs**

```php
Route::resourceVerbs([
    'create' => 'crear',
    'edit'   => 'editar',
]);
```

---

## ➕ **9. Supplementing Resource Controllers**

Tambahkan route tambahan **sebelum** resource:

```php
Route::get('/photos/popular', [PhotoController::class, 'popular']);
Route::resource('photos', PhotoController::class);
```

---

## 🎯 **10. Singleton Resource Controllers**

### 🔄 **10.1. Dasar**

```php
Route::singleton('profile', ProfileController::class);
```

Hanya menghasilkan:

* 🔄 GET /profile (show)
* ✏️ GET /profile/edit (edit)
* ✅ PUT/PATCH /profile (update)

### 🔗 **10.2. Nested Singleton**

```php
Route::singleton('photos.thumbnail', ThumbnailController::class);
```

### ➕ **10.3. Creatable Singleton**

```php
Route::singleton('photos.thumbnail', ThumbnailController::class)->creatable();
```

### 🌐 **10.4. API Singleton**

```php
Route::apiSingleton('profile', ProfileController::class);
```

---

## 🔐 **11. Middleware & Resource Controllers**

### 🌐 **11.1. Middleware untuk Semua Method**

```php
Route::resource('users', UserController::class)
    ->middleware(['auth', 'verified']);
```

### 🎯 **11.2. Middleware untuk Aksi Tertentu**

```php
Route::apiResource('users', UserController::class)
    ->middlewareFor(['show', 'update'], 'auth');
```

### 🔓 **11.3. Excluding Middleware**

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('users', UserController::class)
        ->withoutMiddlewareFor('index', ['auth', 'verified']);
});
```

---

## 💉 **12. Dependency Injection**

### 🏗️ **12.1. Constructor Injection**

```php
public function __construct(
    protected UserRepository $users
) {}
```

### 🔧 **12.2. Method Injection**

```php
public function update(Request $request, string $id): RedirectResponse
{
    // ...
}
```

---

## 📋 **13. Cheat Sheet** 📌

---

### 📦 **1. Resource Controllers**

| ⚙️ Perintah                                             | 📋 Fungsi                                                                      |
| ---------------------------------------------------- | --------------------------------------------------------------------------- |
| `Route::resource('photos', PhotoController::class);` | 🏗️ Buat semua route CRUD (`index, create, store, show, edit, update, destroy`) |
| `Route::resources([...])`                            | 📚 Daftar banyak resource sekaligus                                            |
| `Route::softDeletableResources([...])`               | 🗑️ Resource dengan dukungan soft deletes                                       |

---

### 🎯 **2. Partial Resource Routes**

| ⚙️ Perintah                        | 📋 Hasil                                 |
| ------------------------------- | ------------------------------------- |
| `->only(['index', 'show'])`     | ✅ Hanya buat `index` & `show`           |
| `->except(['create', 'store'])` | ✅ Buat semua kecuali `create` & `store` |

---

### 🌐 **3. API Resource Controllers**

| ⚙️ Perintah                                                | 📋 Fungsi                                                  |
| ------------------------------------------------------- | ------------------------------------------------------- |
| `Route::apiResource('photos', PhotoController::class);` | 🌐 Hanya route API (`index, store, show, update, destroy`) |
| `Route::apiResources([...])`                            | 📚 Banyak API resource sekaligus                           |
| `php artisan make:controller PhotoController --api`     | 🛠️ Membuat API controller (tanpa `create` & `edit`)        |

---

### 🔗 **4. Nested & Scoped Resources**

| ⚙️ Perintah                                                             | 📋 Fungsi                                                        |
| -------------------------------------------------------------------- | ------------------------------------------------------------- |
| `Route::resource('photos.comments', PhotoCommentController::class);` | 🔗 Nested resource                                               |
| `->shallow()`                                                        | 🧭 Child routes tanpa parent ID untuk `show/edit/update/destroy` |
| `->scoped(['comment' => 'slug'])`                                    | 🎯 Gunakan field lain (misal slug) untuk binding                 |

---

### 🎯 **5. Singleton Resources**

| ⚙️ Perintah                                                    | 📋 Hasil                                    |
| ----------------------------------------------------------- | ---------------------------------------- |
| `Route::singleton('profile', ProfileController::class);`    | 🔄 `show`, `edit`, `update`                 |
| `->creatable()`                                             | ➕ Tambah `create`, `store`, `destroy`      |
| `->destroyable()`                                           | ➕ Tambah hanya `destroy`                   |
| `Route::apiSingleton('profile', ProfileController::class);` | 🌐 Versi API (`show`, `update`)             |
| `->creatable()`                                             | 🌐 API Singleton dengan `store` & `destroy` |

---

### 🔧 **6. Customizing Routes**

| ⚙️ Perintah                                      | 📋 Fungsi                                    |
| --------------------------------------------- | ----------------------------------------- |
| `->names([...])`                              | 🏷️ Ubah nama route default                   |
| `->parameters([...])`                         | 🔤 Ubah nama parameter di URI                |
| `Route::resourceVerbs([...])`                 | 🌍 Lokalisasi verb `create` & `edit`         |
| `->missing(fn($req) => Redirect::route(...))` | 🔧 Custom handler saat model tidak ditemukan |
| `->withTrashed()`                             | 🗑️ Mengizinkan akses model soft deleted      |

---

### 🔐 **7. Middleware**

| ⚙️ Perintah                                 | 📋 Fungsi                                  |
| ---------------------------------------- | --------------------------------------- |
| `->middleware([...])`                    | 🔐 Tambah middleware ke semua aksi         |
| `->middlewareFor(['show'], 'auth')`      | 🔐 Tambah middleware ke aksi tertentu      |
| `->withoutMiddlewareFor('index', [...])` | 🔓 Hilangkan middleware dari aksi tertentu |

---

### 🛠️ **8. Artisan Commands**

| ⚙️ Command                                                                           | 📋 Fungsi                                                   |
| --------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `php artisan make:controller UserController`                                      | 🛠️ Membuat controller biasa                                 |
| `php artisan make:controller ServerController --invokable`                        | ⚡ Membuat single-action controller                         |
| `php artisan make:controller PhotoController --resource`                          | 📦 Membuat resource controller                              |
| `php artisan make:controller PhotoController --api`                               | 🌐 Membuat API controller                                   |
| `php artisan make:controller PhotoController --model=Photo --resource`            | 🧬 Resource controller dengan model binding                 |
| `php artisan make:controller PhotoController --model=Photo --resource --requests` | 📝 Sekaligus generate Form Request untuk `store` & `update` |

---

# ✨ **14. Kesimpulan** ✅ 

* 🎛️ **Controllers** membantu mengelola logic agar lebih rapi.
* 📦 Gunakan **`Route::resource`** untuk CRUD standar.
* 🌐 Gunakan **`Route::apiResource`** untuk API (tanpa `create` & `edit`).
* 🎯 Gunakan **singleton** untuk resource yang hanya 1 instance.
* 🧩 Gunakan **partial, scoped, shallow** sesuai kebutuhan.
* 🔧 Semua bisa dikustomisasi: nama route, parameter, verbs, middleware, missing handler, hingga soft deletes.

---

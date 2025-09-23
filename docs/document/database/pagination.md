# 📚 Pagination

## 📝 Pendahuluan

Pagination adalah teknik membagi data menjadi beberapa halaman agar lebih mudah dibaca. Laravel menyediakan **paginator otomatis** untuk Query Builder dan Eloquent, serta kompatibel dengan Tailwind dan Bootstrap. Pagination membantu performa karena tidak mengambil seluruh data sekaligus.



## 🎨 Tailwind CSS

Laravel default menggunakan Tailwind untuk pagination. Pastikan `resources/css/app.css` sudah:

```css
@import 'tailwindcss';

/* Mengimpor tampilan pagination default Laravel */
@source '../../vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php';
````

Jika menggunakan Bootstrap, aktifkan `Paginator::useBootstrapFive()` di `AppServiceProvider`.



## ⚡ Penggunaan Dasar

### 🔹 Paginating Query Builder Results

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class UserController extends Controller
{
    /**
     * Menampilkan semua pengguna dengan pagination.
     */
    public function index(): View
    {
        $users = DB::table('users')->paginate(10); // 10 per halaman
        return view('users.index', compact('users'));
    }
}
```

**File Blade (`resources/views/users/index.blade.php`):**

```blade
<h1>Daftar Pengguna</h1>

<ul class="space-y-2">
@foreach ($users as $user)
    <li class="p-2 border rounded">{{ $user->name }} - {{ $user->email }}</li>
@endforeach
</ul>

<div class="mt-4">
    {{ $users->links() }}
</div>
```



### 🔹 Simple Pagination

Jika hanya ingin tombol **Next** & **Previous**:

```php
$users = DB::table('users')->simplePaginate(10);
```



### 🔹 Paginating Eloquent Results

```php
use App\Models\User;

// Paginate semua user
$users = User::paginate(10);

// Filter kondisi tertentu
$users = User::where('votes', '>', 100)->paginate(10);

// Simple paginate
$users = User::where('votes', '>', 100)->simplePaginate(10);

// Cursor paginate (untuk dataset besar)
$users = User::where('votes', '>', 100)->cursorPaginate(10);
```



## 🔄 Multiple Paginator Instances

Jika ada dua paginator di satu halaman:

```php
$posts = Post::paginate(5, ['*'], 'posts');
$comments = Comment::paginate(10, ['*'], 'comments');
```

Di Blade gunakan:

```blade
{{ $posts->links() }}
{{ $comments->links() }}
```

URL otomatis membedakan `?posts=2&comments=1`.



## 🏎 Cursor Pagination

**Kelebihan:**

* Lebih cepat untuk dataset besar
* Tidak melewatkan data saat ada perubahan

**Keterbatasan:**

* Hanya Next & Previous
* Harus ada kolom unik (id)
* Kolom null tidak didukung

```php
$users = User::orderBy('id')->cursorPaginate(10);
```



## 🛠 Manual Paginator

Jika datanya berupa array:

```php
use Illuminate\Pagination\LengthAwarePaginator;

$items = range(1, 50); // data array
$page = request()->get('page', 1);
$perPage = 10;

$paginator = new LengthAwarePaginator(
    array_slice($items, ($page - 1) * $perPage, $perPage),
    count($items),
    $perPage,
    $page,
    ['path' => request()->url(), 'query' => request()->query()]
);
```



## 🔗 Kustomisasi URL Pagination

* `withPath('/admin/users')` → custom path
* `appends(['sort' => 'name'])` → menambah query string
* `withQueryString()` → pertahankan semua query string saat ini
* `fragment('list')` → menambahkan hash fragment

```php
$users->withPath('/admin/users')->appends(['sort' => 'name'])->fragment('list');
```



## 🌐 Internationalization / Localization

Tombol pagination bisa di-translate:

```php
// resources/lang/id/pagination.php
return [
    'previous' => 'Sebelumnya',
    'next' => 'Selanjutnya',
];
```

Blade:

```blade
{{ $users->links() }}
```

Laravel otomatis menyesuaikan tombol sesuai locale.



## 📦 Advanced Customization

### Tailwind / Bootstrap Override

Salin tampilan default:

```bash
php artisan vendor:publish --tag=laravel-pagination
```

Custom Blade (`resources/views/vendor/pagination/custom-tailwind.blade.php`):

```blade
<ul class="flex justify-center space-x-2">
@foreach ($elements as $element)
    <li class="px-2 py-1 border rounded">{{ $element }}</li>
@endforeach
</ul>
```

Set default di `AppServiceProvider`:

```php
use Illuminate\Pagination\Paginator;

public function boot(): void
{
    Paginator::defaultView('vendor.pagination.custom-tailwind');
    Paginator::useBootstrapFive();
}
```

### Passing Data Tambahan ke Views

```php
$users = User::paginate(10);
$roles = Role::all();

return view('users.index', compact('users', 'roles'));
```

Blade:

```blade
@foreach ($users as $user)
    {{ $user->name }} - {{ $roles->find($user->role_id)->name }}
@endforeach
```



## ⚡ Tips Performance

* Gunakan `cursorPaginate()` untuk dataset besar
* Cache pagination:

```php
$users = Cache::remember("users.page.$page", 60, fn() => User::paginate(10, ['*'], 'page', $page));
```

* Index kolom yang sering digunakan untuk filter/sorting



## 🧪 Testing Paginator

```php
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserPaginationTest extends TestCase
{
    use RefreshDatabase;

    public function test_pagination_returns_expected_number_of_items()
    {
        User::factory()->count(50)->create();

        $response = $this->get('/users?page=2');

        $response->assertStatus(200);
        $response->assertSeeText('Next');
        $response->assertViewHas('users', fn($users) => $users->count() === 10);
    }
}
```



## 📊 JSON Pagination

```php
return User::paginate(10); // otomatis JSON
```

Hasil JSON mencakup: `current_page`, `last_page`, `per_page`, `total`, `data`.



## 🚀 Contoh Project Sederhana

### 1. Buat Model & Migration

```bash
php artisan make:model User -m
```

Migration:

```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamps();
});
```

Seeder (`php artisan make:seeder UserSeeder`):

```php
User::factory()->count(50)->create();
```

### 2. Controller

```php
class UserController extends Controller
{
    public function index()
    {
        $users = User::paginate(10);
        return view('users.index', compact('users'));
    }
}
```

### 3. Blade View (`resources/views/users/index.blade.php`)

```blade
<h1 class="text-xl font-bold mb-4">Daftar Pengguna</h1>

<table class="min-w-full border">
<thead>
    <tr>
        <th class="border px-4 py-2">ID</th>
        <th class="border px-4 py-2">Name</th>
        <th class="border px-4 py-2">Email</th>
    </tr>
</thead>
<tbody>
@foreach ($users as $user)
<tr>
    <td class="border px-4 py-2">{{ $user->id }}</td>
    <td class="border px-4 py-2">{{ $user->name }}</td>
    <td class="border px-4 py-2">{{ $user->email }}</td>
</tr>
@endforeach
</tbody>
</table>

<div class="mt-4">
    {{ $users->onEachSide(2)->links() }}
</div>
```

### 4. Route

```php
Route::get('/users', [UserController::class, 'index']);
```

Buka `/users` di browser, dan pagination 10 user per halaman akan muncul dengan tampilan Tailwind yang rapi.

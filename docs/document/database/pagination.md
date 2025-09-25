# 📚 Pagination di Laravel: Membagi Data dengan Rapi dan Cepat (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Hari ini kita akan belajar tentang salah satu fitur penting dalam pengembangan web: **Pagination**.

Setelah beberapa kali revisi, akhirnya Guru paham apa yang sebenarnya kalian inginkan: sebuah panduan yang **super lengkap** tapi dijelaskan dengan **super sederhana**, seolah-olah Guru sedang duduk di sebelahmu sambil menjelaskan pelan-pelan.

Pagination itu seperti sistem perpustakaan yang membagi buku-buku ke dalam katalog berikut halaman-halaman. Bayangkan jika kamu harus melihat 1000 data sekaligus di satu halaman! Akan sangat kacau dan lambat. Pagination adalah solusinya. Siap? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Pagination Itu Sebenarnya?

**Analogi:** Bayangkan kamu datang ke perpustakaan besar dengan 1000 buku. Mereka tidak memberimu semua buku sekaligus, kan? Mereka memberimu buku-buku yang dibagi per halaman katalog. Kamu bisa membaca halaman 1 dulu, lalu klik "lanjut" ke halaman 2, dan seterusnya.

**Mengapa ini penting?** Karena dengan pagination kamu bisa:
1.  **Membuat halaman lebih cepat**: Tidak perlu memuat 1000 data sekaligus
2.  **Mudah dibaca**: Pengguna tidak kewalahan melihat data
3.  **Hemat sumber daya**: Server dan browser tidak kelebihan beban
4.  **Lebih rapi**: Tampilan datamu lebih terorganisir

**Bagaimana cara kerjanya?** Prosesnya seperti ini:

`➡️ Request User -> 📚 Laravel Ambil 10 Data -> 🖼️ Tampilkan di Halaman Web -> 🔢 Tombol Pagination -> 📄 Pindah Halaman`

Tanpa pagination, halaman kamu akan sangat lambat dan tidak ramah pengguna. Jangan sampai itu terjadi! 😳

### 2. ✍️ Resep Pertamamu: Pagination Dasar dengan Eloquent

Ini adalah fondasi paling dasar. Mari kita buat halaman daftar pengguna dengan pagination dari nol, langkah demi langkah.

#### Langkah 1️⃣: Siapkan Alamat di Buku Menu (Route)
**Mengapa?** Setiap halaman butuh alamat URL agar bisa diakses. Kita daftarkan dulu di `routes/web.php`.

**Bagaimana?**
```php
// routes/web.php
use App\Http\Controllers\UserController;

// "Jika ada yang buka alamat /users, panggil manajer UserController, suruh kerjakan tugas index."
Route::get('/users', [UserController::class, 'index']);
```

#### Langkah 2️⃣: Panggil Sang Manajer (Controller)
**Mengapa?** Kita butuh "manajer" untuk menangani permintaan ke alamat `/users`.

**Bagaimana?** Buat UserController jika belum ada.
```bash
php artisan make:controller UserController
```

#### Langkah 3️⃣: Beri Perintah pada Manajer (Isi Method)
**Mengapa?** Manajer yang baru dibuat masih kosong. Kita perlu memberinya instruksi.

**Bagaimana?** Buka `app/Http/Controllers/UserController.php` dan isi method `index`.
```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\View\View;

class UserController extends Controller
{
    /**
     * Menampilkan semua pengguna dengan pagination.
     */
    public function index(): View
    {
        $users = User::paginate(10); // Ambil 10 user per halaman
        return view('users.index', compact('users'));
    }
}
```

**Penjelasan Kode:**
- `User::paginate(10)`: Kita minta 10 user per halaman (bukan semua sekaligus!)
- `compact('users')`: Kita bawa data user ke view
- Laravel otomatis menangani query dan pagination logic

#### Langkah 4️⃣: Siapkan Piring Saji (View)
**Mengapa?** Data sudah siap, sekarang harus ditampilkan dalam format HTML yang cantik.

**Bagaimana?** Buat file di `resources/views/users/index.blade.php`.
```blade
@extends('layouts.app')

@section('content')
<div class="container">
    <h1 class="text-2xl font-bold mb-4">Daftar Pengguna</h1>

    <table class="min-w-full border">
        <thead>
            <tr class="bg-gray-100">
                <th class="border px-4 py-2">ID</th>
                <th class="border px-4 py-2">Nama</th>
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
        {{ $users->links() }}
    </div>
</div>
@endsection
```

Selesai! 🎉 Sekarang, jika kamu membuka `/users`, paginationmu akan bekerja dengan sempurna!

### 3. ⚡ Pagination Spesialis (Simple dan Cursor)

**Analogi:** Bayangkan kamu hanya butuh tombol "maju" dan "mundur" tanpa tombol nomor halaman. Itu adalah **Simple Pagination** dan **Cursor Pagination**.

**Mengapa ini ada?** Untuk kasus-kasus tertentu seperti infinite scroll atau dataset sangat besar, simple dan cursor pagination bisa lebih efisien.

**Bagaimana?** Gunakan method yang berbeda:
- **Simple Pagination**: `simplePaginate()` - hanya tombol next/previous
- **Cursor Pagination**: `cursorPaginate()` - lebih cepat untuk dataset besar

```php
// Simple pagination
$users = User::simplePaginate(10);

// Cursor pagination (lebih cepat untuk dataset besar)
$users = User::orderBy('id')->cursorPaginate(10);
```

---

## Bagian 2: Resource Pagination - Mesin Otomatis Pengatur Datamu 🤖

### 4. 📦 Apa Itu Pagination dengan Eloquent dan Query Builder?

**Analogi:** Bayangkan kamu punya mesin ajaib yang otomatis membagi 1000 buku ke dalam kardus-kardus kecil, masing-masing 10 buku. **Pagination Laravel itu mesin ajaibnya** untuk mengatur data.

**Mengapa ini keren?** Karena kamu tidak perlu manual menghitung offset dan limit, Laravel melakukannya untukmu secara otomatis dan aman.

**Bagaimana?** Laravel menyediakan beberapa metode:
- `paginate()` - pagination lengkap dengan nomor halaman
- `simplePaginate()` - hanya next/previous
- `cursorPaginate()` - untuk dataset sangat besar

### 5. 🛠️ Penggunaan dengan Query Builder dan Eloquent

> **✨ Tips dari Guru:** Pilih metode yang sesuai kebutuhan! `paginate()` untuk kebanyakan kasus, `cursorPaginate()` untuk dataset besar.

**Dengan Query Builder:**
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class UserController extends Controller
{
    public function index(): View
    {
        $users = DB::table('users')->paginate(10); // 10 per halaman
        return view('users.index', compact('users'));
    }
}
```

**Dengan Eloquent (lebih umum):**
```php
use App\Models\User;

// Paginate semua user
$users = User::paginate(10);

// Filter kondisi tertentu
$users = User::where('votes', '>', 100)->paginate(10);

// Simple paginate
$users = User::where('votes', '>', 100)->simplePaginate(10);

// Cursor paginate (untuk dataset besar)
$users = User::where('votes', '>', 100)->orderBy('id')->cursorPaginate(10);
```

### 6. 🧩 Pagination dengan Kondisi dan Filter

**Memfilter Data**: Kamu bisa menambahkan kondisi sebelum pagination.
```php
$activeUsers = User::where('status', 'active')->paginate(10);
```

**Mengurutkan Data**: Gunakan `orderBy` sebelum pagination.
```php
$users = User::orderBy('created_at', 'desc')->paginate(10);
```

**Memilih Kolom Tertentu**: Hemat bandwidth.
```php
$users = User::select('id', 'name', 'email')->paginate(10);
```

### 7. 🌐 Pagination untuk API

**Mengapa?** Saat membuat API untuk aplikasi Javascript (Vue/React) atau mobile, kamu tetap butuh pagination untuk kinerja.

**Bagaimana?** Laravel otomatis mengembalikan data pagination dalam format JSON saat merespon API request.

**Contoh Lengkap API Pagination:**

1. **Controller untuk API:**
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class UserController extends Controller
{
    public function index(Request $request): ResourceCollection
    {
        $perPage = $request->input('per_page', 10); // Default 10 per halaman
        $users = User::latest()->paginate($perPage);
        
        return UserResource::collection($users);
    }
}
```

2. **Route API:**
```php
// routes/api.php
use App\Http\Controllers\Api\UserController;

Route::get('/users', [UserController::class, 'index']);
```

3. **Respons JSON yang Dihasilkan:**
```json
{
    "data": [
        // array of 10 users
    ],
    "links": {
        "first": "http://localhost:8000/api/users?page=1",
        "last": "http://localhost:8000/api/users?page=5",
        "prev": null,
        "next": "http://localhost:8000/api/users?page=2"
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 5,
        "links": [...],
        "path": "http://localhost:8000/api/users",
        "per_page": 10,
        "to": 10,
        "total": 50
    }
}
```

Perhatikan bahwa pagination API **otomatis** mengembalikan informasi halaman dan metadata penting lainnya!

---

## Bagian 3: Jurus Tingkat Lanjut - Pagination Cerdas 🚀

### 8. 👨‍👩‍👧 Pagination Banyak Instance (Multiple Paginator)

**Analogi:** Bayangkan kamu punya rak buku besar dan rak majalah. Keduanya punya sistem pagination sendiri-sendiri. Itulah multiple paginator!

**Mengapa?** Kadang kamu butuh menampilkan dua atau lebih set data dengan pagination berbeda dalam satu halaman.

**Bagaimana?** Gunakan parameter nama khusus di method `paginate()`:

```php
$posts = Post::paginate(5, ['*'], 'posts'); // Gunakan 'posts' sebagai parameter query
$comments = Comment::paginate(10, ['*'], 'comments'); // Gunakan 'comments' sebagai parameter query
```

**URL yang Dihasilkan:**
- `/dashboard?posts=2&comments=1` - Halaman 2 untuk posts, halaman 1 untuk comments

**Di Blade:**
```blade
<div class="posts-section">
    <h2>Posts</h2>
    @foreach ($posts as $post)
        <p>{{ $post->title }}</p>
    @endforeach
    {{ $posts->links() }}
</div>

<div class="comments-section">
    <h2>Comments</h2>
    @foreach ($comments as $comment)
        <p>{{ $comment->content }}</p>
    @endforeach
    {{ $comments->links() }}
</div>
```

### 9. 🏎️ Cursor Pagination (Kecepatan Maksimum!)

**Analogi:** Jika pagination biasa seperti membaca buku dari halaman 1 ke halaman 100 (melewati semua halaman), cursor pagination seperti langsung melompat ke halaman 100 menggunakan bookmark. Sangat cepat!

**Mengapa?** Karena cursor pagination tidak perlu menghitung `OFFSET` yang bisa sangat lambat di dataset besar (jutaan record).

**Kelebihan:**
- **Sangat cepat** untuk dataset besar
- **Tidak melewatkan data** saat ada perubahan (insert/delete)
- **Konsisten** dalam performa

**Keterbatasan:**
- Hanya tombol **Next** & **Previous** (tidak ada nomor halaman)
- Harus ada **kolom unik** (biasanya `id`)
- Tidak bisa langsung ke halaman 50, harus dari halaman ke halaman

**Bagaimana?** Gunakan `cursorPaginate()`:
```php
$users = User::orderBy('id')->cursorPaginate(10);
```

**Contoh Lengkap Cursor Pagination:**

1. **Controller:**
```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\View\View;

class UserController extends Controller
{
    public function index(): View
    {
        $users = User::orderBy('id')->cursorPaginate(10);
        return view('users.index', compact('users'));
    }
}
```

2. **Blade View:**
```blade
@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Daftar Pengguna (Cursor Pagination)</h1>
    
    <ul class="list-disc pl-5">
        @foreach ($users as $user)
            <li>{{ $user->name }} - {{ $user->email }}</li>
        @endforeach
    </ul>

    <div class="mt-4">
        {{ $users->links() }}
    </div>
    
    @if($users->previousCursor())
        <p>Previous cursor: {{ $users->previousCursor() }}</p>
    @endif
    @if($users->nextCursor())
        <p>Next cursor: {{ $users->nextCursor() }}</p>
    @endif
</div>
@endsection
```

### 10. 🎨 Kustomisasi Tampilan Pagination

**Mengapa?** Agar pagination sesuai dengan desain aplikasimu.

**Bagaimana?** Laravel menyediakan beberapa cara:

#### A. Mengganti Path Pagination
```php
$users = User::paginate(10);
$users->withPath('/admin/users'); // URL menjadi /admin/users?page=2
```

#### B. Menambahkan Query String
```php
$users = User::paginate(10);
$users->appends(['sort' => 'name', 'direction' => 'asc']); 
// URL menjadi ?page=2&sort=name&direction=asc
```

#### C. Menjaga Query String Saat Ini
```php
$users = User::paginate(10);
$users->withQueryString(); // Menjaga semua query string saat ini
```

#### D. Menambahkan Fragment (Anchor)
```php
$users = User::paginate(10);
$users->fragment('results'); // Menambahkan #results ke URL
```

#### E. Menyesuaikan Jumlah Link di Setiap Sisi
```php
$users = User::paginate(10);
$users->onEachSide(2); // Tampilkan 2 halaman di setiap sisi halaman aktif
```

### 11. 🌐 Internasionalisasi (Localization)

**Mengapa?** Agar tombol pagination bisa dalam bahasa yang digunakan pengguna (Indonesia, dll).

**Bagaimana?** Laravel otomatis mendukung localization jika kamu menyiapkan file bahasa:

1. **Buat file lokalization**:
```php
// resources/lang/id/pagination.php
<?php

return [
    'previous' => '&laquo; Sebelumnya',
    'next' => 'Selanjutnya &raquo;',
];
```

2. **Atur locale** di request atau middleware:
```php
App::setLocale('id');
```

3. **Gunakan di blade** (tidak perlu ubah):
```blade
{{ $users->links() }}
```

### 12. 🛠️ Pagination Manual untuk Array

**Mengapa?** Kadang kamu punya data dalam bentuk array (bukan dari database) dan tetap butuh pagination.

**Bagaimana?** Gunakan `LengthAwarePaginator`:
```php
use Illuminate\Pagination\LengthAwarePaginator;

$items = range(1, 50); // data array
$page = request()->get('page', 1);
$perPage = 10;

$paginator = new LengthAwarePaginator(
    array_slice($items, ($page - 1) * $perPage, $perPage), // item untuk halaman ini
    count($items), // total item
    $perPage, // item per halaman
    $page, // halaman saat ini
    [
        'path' => request()->url(), // path untuk link
        'query' => request()->query() // query string
    ]
);
```

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Pagination 🧰

### 13. 🔐 Menggunakan Pagination dengan Middleware dan Otorisasi

**Mengapa?** Untuk memastikan hanya user tertentu yang bisa melihat data pagination.

**Bagaimana?** Gunakan middleware seperti biasa:
```php
// routes/web.php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});

// Atau di controller method
class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function index()
    {
        $posts = Post::where('user_id', auth()->id())->paginate(10);
        return view('dashboard.index', compact('posts'));
    }
}
```

### 14. 💉 Dependency Injection untuk Pagination

**Prinsipnya: Jangan buat sendiri, minta saja!** Laravel menyediakan pagination secara otomatis, kamu hanya perlu meminta dengan benar.

**Contoh dengan Request dan Model:**
```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\View\View;

class UserController extends Controller
{
    public function index(Request $request): View
    {
        // Request injection untuk mendapatkan parameter pagination
        $perPage = $request->input('per_page', 10); // Default 10
        $search = $request->input('search');
        
        $query = User::query();
        
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }
        
        $users = $query->paginate($perPage);
        
        return view('users.index', compact('users', 'search'));
    }
}
```

### 14.5 🏗️ Struktur View dan Styling Pagination

**Mengapa?** Agar pagination terlihat cantik dan konsisten dengan desain aplikasimu.

**Pilihan Styling:**
- **Tailwind CSS** (default Laravel)
- **Bootstrap 5**
- **Custom styling**

**Mengaktifkan Bootstrap:**
```php
// AppServiceProvider
use Illuminate\Pagination\Paginator;

public function boot(): void
{
    Paginator::useBootstrapFive();
}
```

**Mengganti Tampilan Default:**
```bash
php artisan vendor:publish --tag=laravel-pagination
```

Ini akan menyalin tampilan pagination ke `resources/views/vendor/pagination/` untuk kamu kustomisasi.

### 15. 🏃‍♂️ Optimasi Performa Pagination

**Mengapa?** Agar aplikasi tetap cepat meskipun datamu jutaan.

**Cara-cara Optimasi:**

#### A. Gunakan Cursor Pagination untuk Dataset Besar
```php
// Lebih cepat untuk jutaan record
$users = User::orderBy('id')->cursorPaginate(10);
```

#### B. Tambahkan Indeks di Kolom yang Sering Difilter
```php
// Migration untuk menambahkan index
Schema::table('users', function (Blueprint $table) {
    $table->index(['status', 'created_at']); // Jika sering filter dan sort berdasarkan ini
});
```

#### C. Gunakan Caching untuk Query Pagination
```php
$users = Cache::remember("users.page.{$page}", 60, function () use ($page) {
    return User::paginate(10, ['*'], 'page', $page);
});
```

#### D. Gunakan Select Spesifik, Bukan Semua Kolom
```php
// Buruk
$users = User::paginate(10);

// Lebih baik
$users = User::select('id', 'name', 'email', 'created_at')->paginate(10);
```

### 15.5 🧪 Testing Pagination

**Mengapa?** Untuk memastikan pagination berfungsi dengan benar dan tidak ada bug.

**Bagaimana?** Laravel menyediakan tools untuk testing pagination:

```php
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserPaginationTest extends TestCase
{
    use RefreshDatabase;

    public function test_pagination_returns_expected_number_of_items()
    {
        // Buat 50 user dengan factory
        User::factory()->count(50)->create();

        // Cek halaman pertama
        $response = $this->get('/users');

        $response->assertStatus(200);
        $response->assertViewHas('users', function ($users) {
            return $users->count() === 10; // Harus ada 10 item per halaman
        });
    }

    public function test_pagination_links_work_correctly()
    {
        User::factory()->count(25)->create();

        $response = $this->get('/users?page=2');

        $response->assertStatus(200);
        $response->assertViewHas('users', function ($users) {
            return $users->currentPage() === 2;
        });
    }
}
```

### 16. 📈 Monitoring dan Analisis Pagination

**Mengapa?** Untuk memahami bagaimana pengguna berinteraksi dengan pagination dan mengoptimalkan pengalaman mereka.

**Contoh:**
```php
// Dalam controller
public function index(Request $request)
{
    $page = $request->get('page', 1);
    
    // Log aktivitas pagination
    Log::info('User paginated data', [
        'user_id' => auth()->id(),
        'page' => $page,
        'endpoint' => $request->url()
    ]);

    $users = User::paginate(10);
    return view('users.index', compact('users'));
}
```

---

## Bagian 5: Menjadi Master Pagination 🏆

### 17. ✨ Wejangan dari Guru

1.  **Gunakan Pagination yang Tepat**: `paginate()` untuk kebanyakan kasus, `cursorPaginate()` untuk dataset besar.
2.  **Hemat Resource**: Gunakan `select()` untuk memilih kolom yang dibutuhkan, bukan `*`.
3.  **Tambahkan Indeks**: Indeks database sangat penting untuk performa pagination.
4.  **Cek Performa**: Monitor query dan response time saat pagination.
5.  **Pertimbangkan UX**: Jangan terlalu banyak item per halaman (umumnya 10-20).

### 18. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk fitur pagination di Laravel:

#### 📦 Metode Pagination
| Metode | Fungsi |
|--------|--------|
| `paginate(10)` | Pagination lengkap dengan nomor halaman |
| `simplePaginate(10)` | Hanya tombol next/previous |
| `cursorPaginate(10)` | Pagination cepat untuk dataset besar |

#### 🎨 Kustomisasi Link
| Metode | Fungsi |
|--------|--------|
| `withPath('/admin/users')` | Ganti base URL pagination |
| `appends(['sort' => 'name'])` | Tambah query string ke link |
| `withQueryString()` | Pertahankan semua query string |
| `fragment('results')` | Tambahkan #fragment ke URL |
| `onEachSide(2)` | Jumlah link di setiap sisi |

#### 🔧 Multiple Paginator
| Contoh | Hasil |
|--------|-------|
| `Post::paginate(5, ['*'], 'posts')` | Parameter query `?posts=2` |
| `Comment::paginate(10, ['*'], 'comments')` | Parameter query `?comments=1` |

#### 🌐 Localization
| File | Lokasi |
|------|--------|
| Inggris | `resources/lang/en/pagination.php` |
| Indonesia | `resources/lang/id/pagination.php` |

#### 🏗️ Styling Framework
| Perintah | Fungsi |
|----------|--------|
| `Paginator::useBootstrapFive()` | Gunakan Bootstrap 5 styling |
| `vendor:publish --tag=laravel-pagination` | Publish view custom pagination |

#### ⚡ Performa Tips
| Praktik | Keuntungan |
|---------|-----------|
| Gunakan `cursorPaginate()` | Lebih cepat untuk dataset besar |
| Tambahkan database index | Query lebih cepat |
| Gunakan `select()` spesifik | Hemat bandwidth dan memory |
| Cache data pagination | Kurangi beban database |

### 19. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Pagination, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Dengan memahami dan menerapkan fitur ini, kamu telah membuat aplikasimu lebih cepat, lebih ramah pengguna, dan lebih profesional.

Pagination mungkin terlihat sepele, tapi dampaknya sangat besar dalam pengalaman pengguna dan performa aplikasi. Ingat, sebagai developer, kamu bukan hanya membuat fitur, kamu juga memastikan pengalaman terbaik untuk pengguna aplikasimu.

Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku!

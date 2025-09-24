# 🎛️ Controller di Laravel: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Setelah beberapa kali revisi, akhirnya Guru paham apa yang sebenarnya kalian inginkan: sebuah panduan yang **super lengkap** tapi dijelaskan dengan **super sederhana**, seolah-olah Guru sedang duduk di sebelahmu sambil menjelaskan pelan-pelan.

Di edisi ini, kita akan kupas tuntas **semua detail** tentang Controller, tapi setiap topik akan Guru ajarkan dengan sabar. Siap? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Controller Itu Sebenarnya?

**Analogi:** Bayangkan kamu masuk ke restoran favoritmu. Kamu (pengguna) datang dengan sebuah **permintaan** (misalnya, "saya mau pesan nasi goreng"). Permintaanmu diterima oleh seorang **manajer** (inilah **Controller** kita).

**Mengapa ini penting?** Karena manajer inilah yang tahu persis apa yang harus dilakukan. Dia tidak membiarkanmu masuk ke dapur dan masak sendiri, kan? Itu bisa berbahaya dan bikin kacau!

**Bagaimana cara kerjanya?** Manajer itu akan:
1.  **Mencatat pesananmu** (Menerima `Request`).
2.  **Memberi perintah ke dapur** untuk dibuatkan (Berinteraksi dengan `Model` & `Service`).
3.  Setelah matang, dia **menyajikannya dengan cantik** di atas piring (Mengirim data ke `View`).

Jadi, alur kerja (workflow) aplikasi kita menjadi sangat rapi:

`➡️ Request Pengguna -> 👮 Controller -> 📚 Model (Ambil/Olah Data) -> 🖼️ View (Tampilkan Data) -> ✅ Response ke Pengguna`

Tanpa Controller, semua logika akan tumpah di file `routes/web.php`, dan itu adalah mimpi buruk untuk dirawat. 😵

### 2. ✍️ Resep Pertamamu: Dari Route ke Tampilan

Ini adalah fondasi paling dasar. Mari kita buat halaman daftar produk dari nol, langkah demi langkah.

#### Langkah 1️⃣: Siapkan Alamat di Buku Menu (Route)
**Mengapa?** Setiap halaman butuh alamat URL agar bisa diakses. Kita daftarkan dulu di `routes/web.php`.

**Bagaimana?**
```php
// routes/web.php
use App\Http\Controllers\ProductController;

// "Jika ada yang buka alamat /products, panggil manajer ProductController, suruh kerjakan tugas index."
Route::get('/products', [ProductController::class, 'index']);
```

#### Langkah 2️⃣: Panggil Sang Manajer (Controller)
**Mengapa?** Kita butuh "manajer" untuk menangani permintaan ke alamat `/products`.

**Bagaimana?** Panggil bantuan dari terminal dengan mantra Artisan:
```bash
php artisan make:controller ProductController
```

#### Langkah 3️⃣: Beri Perintah pada Manajer (Isi Method)
**Mengapa?** Manajer yang baru dibuat masih kosong. Kita perlu memberinya instruksi.

**Bagaimana?** Buka `app/Http/Controllers/ProductController.php` dan isi method `index`.
```php
// app/Http/Controllers/ProductController.php
namespace App\Http\Controllers;
use Illuminate\View\View;

class ProductController extends Controller
{
    public function index(): View
    {
        $products = ['💻 Laptop Gaming', '🖱️ Mouse RGB', '⌨️ Keyboard Mekanikal'];
        return view('products.index', ['products' => $products]);
    }
}
```
**Penjelasan Kode:**
- `$products = [...]`: Kita siapkan datanya. Nanti ini bisa diambil dari database.
- `return view(...)`: Kita perintahkan Laravel untuk merender file `products.index.blade.php` dan memberinya "bekal" data `$products`.

#### Langkah 4️⃣: Siapkan Piring Saji (View)
**Mengapa?** Data sudah siap, sekarang harus ditampilkan dalam format HTML yang cantik.

**Bagaimana?** Buat file di `resources/views/products/index.blade.php`.
```blade
<!DOCTYPE html>
<html>
<head><title>Daftar Produk</title></head>
<body>
    <h1>Produk Andalan Kami 🛍️</h1>
    <ul>
        @foreach ($products as $product)
            <li>{{ $product }}</li>
        @endforeach
    </ul>
</body>
</html>
```
Selesai! 🎉 Sekarang, jika kamu membuka `/products`, resep pertamamu berhasil disajikan dengan sempurna!

### 3. ⚡ Controller Spesialis (Single Action Controller)

**Analogi:** Bayangkan seorang manajer yang tugasnya hanya satu: mengunci brankas di malam hari. Sangat spesifik.

**Mengapa ini ada?** Untuk tugas-tugas tunggal yang kompleks (misal: memproses pembayaran, meng-export laporan), membuat satu class controller khusus untuk itu membuat kodemu lebih bersih dan fokus.

**Bagaimana?** Gunakan flag `--invokable`.
```bash
php artisan make:controller ProcessPaymentController --invokable
```
Controller ini hanya punya satu method sakti: `__invoke`. Jadi, saat mendaftarkan route, kita tidak perlu sebut nama methodnya.
```php
Route::post('/payment/process', ProcessPaymentController::class);
```

---

## Bagian 2: Resource Controller - Mesin Otomatis CRUD-mu 🤖

### 4. 📦 Apa Itu Resource Controller?

**Analogi:** Bayangkan kamu pesan paket combo di restoran cepat saji. Sekali pesan, langsung dapat burger, kentang, dan minuman. Nah, **Resource Controller itu paket combo-nya Laravel untuk CRUD** (Create, Read, Update, Delete).

**Mengapa ini keren?** Karena hampir semua aplikasi butuh halaman untuk "lihat semua data", "tambah data", "edit data", dan "hapus data". Daripada membuat 7 route dan 7 method manual, Laravel membungkusnya dalam satu perintah.

**Bagaimana?**
```bash
php artisan make:controller PhotoController --resource
```
Cukup daftarkan dengan `Route::resource('photos', PhotoController::class);` dan BOOM! 7 route siap pakai.

### 5. 🛠️ Mantra Artisan dengan Kekuatan Tambahan

> **✨ Tips dari Guru:** Mantra ini seperti memberi *power-up* pada controllermu. Wajib dipakai untuk hemat waktu!

*   **Menghubungkan ke Model (`--model`)**: Ini seperti memberi tahu controller, "Hei, kamu akan selalu bekerja dengan model `Photo` ini!".
    ```bash
    php artisan make:controller PhotoController --model=Photo --resource
    ```
    Dengan ini, method `show(Photo $photo)` akan otomatis mendapatkan data foto dari database. Ajaib!
*   **Membuat Form Request (`--requests`)**: Ini seperti menyewa asisten pribadi untuk urusan validasi. Controllermu jadi lebih bersih dan fokus pada tugas utamanya.
    ```bash
    php artisan make:controller PhotoController --model=Photo --resource --requests
    ```

### 6. 🧩 Memilih Paket Combo (Partial & Multiple Resources)

*   **Memilih Route**: Kamu bisa bilang, "Saya mau paket combo, tapi minumannya saja" (`only`) atau "Saya mau semua, kecuali kentangnya" (`except`).
    ```php
    Route::resource('photos', PhotoController::class)->only(['index', 'show']);
    ```
*   **Memesan Banyak Paket**: Gunakan `Route::resources()` untuk memesan beberapa paket combo sekaligus.
    ```php
    Route::resources([
        'photos' => PhotoController::class,
        'posts'  => PostController::class,
    ]);
    ```

### 7. 🌐 API Resource Controllers

**Mengapa?** Saat membuat API untuk aplikasi Javascript (Vue/React) atau mobile, kita tidak butuh halaman HTML untuk `create` dan `edit`. Kita butuh endpoint data.

**Bagaimana?** Gunakan flag `--api` dan daftarkan dengan `apiResource`.
```bash
php artisan make:controller Api/PhotoController --api
```
```php
// di routes/api.php
Route::apiResource('photos', PhotoController::class);
```
Ini hanya akan membuat 5 route yang relevan untuk API (tanpa `create` dan `edit`).

**Contoh Lengkap API Resource Controller:**

1. **Membuat API Controller:**
```bash
php artisan make:controller Api/PhotoController --api
# atau dengan model
php artisan make:controller Api/PhotoController --api --model=Photo
```

2. **Contoh API Controller Lengkap:**
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PhotoController extends Controller
{
    /**
     * Tampilkan semua photos
     */
    public function index(): ResourceCollection
    {
        $photos = Photo::latest()->paginate(10);
        return PhotoResource::collection($photos);
    }

    /**
     * Simpan photo baru
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'required|url',
        ]);

        $photo = Photo::create($validated);

        return response()->json([
            'message' => 'Photo created successfully',
            'data' => new PhotoResource($photo)
        ], 201);
    }

    /**
     * Tampilkan detail photo
     */
    public function show(Photo $photo): JsonResponse
    {
        return response()->json([
            'data' => new PhotoResource($photo)
        ]);
    }

    /**
     * Update photo
     */
    public function update(Request $request, Photo $photo): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'sometimes|url',
        ]);

        $photo->update($validated);

        return response()->json([
            'message' => 'Photo updated successfully',
            'data' => new PhotoResource($photo)
        ]);
    }

    /**
     * Hapus photo
     */
    public function destroy(Photo $photo): JsonResponse
    {
        $photo->delete();

        return response()->json([
            'message' => 'Photo deleted successfully'
        ], 200);
    }
}
```

3. **Resource untuk Response JSON (PhotoResource):**
```bash
php artisan make:resource PhotoResource
```

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PhotoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'image_url' => $this->image_url,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
```

4. **Route API:**
```php
// routes/api.php
use App\Http\Controllers\Api\PhotoController;

// API Resource hanya menghasilkan 5 route:
// GET /api/photos      -> index()
// POST /api/photos     -> store()
// GET /api/photos/{photo} -> show()
// PUT/PATCH /api/photos/{photo} -> update()
// DELETE /api/photos/{photo} -> destroy()

Route::apiResource('photos', PhotoController::class);

// Atau jika ingin mengecualikan beberapa route:
Route::apiResource('photos', PhotoController::class)->except(['destroy']);
```

5. **Route yang Dihasilkan oleh API Resource:**
```
Verb        | URI                    | Action      | Route Name
GET         | /api/photos            | index       | photos.index
POST        | /api/photos            | store       | photos.store
GET         | /api/photos/{photo}    | show        | photos.show
PUT/PATCH   | /api/photos/{photo}    | update      | photos.update
DELETE      | /api/photos/{photo}    | destroy     | photos.destroy
```

Perhatikan bahwa API Resource **tidak** menghasilkan route untuk `create` dan `edit` karena ini adalah endpoint API yang biasanya dikonsumsi oleh frontend (Vue/React) atau mobile app, bukan halaman HTML tradisional.

---

## Bagian 3: Jurus Tingkat Lanjut - Routing dengan Controller 🚀

### 8. 👨‍👩‍👧 Nested Resources (Resource Bersarang)

**Analogi:** Bayangkan rumahmu adalah `Post`, dan kamarmu adalah `Comment`. Alamat kamarmu tidak bisa berdiri sendiri, kan? Pasti alamatnya `Jalan Merdeka No. 10 (Post) / Kamar Anak (Comment)`. Itulah Nested Resource!

**Mengapa?** Agar URL kita logis dan kita tahu persis komentar ini milik post yang mana.

**Bagaimana?** Gunakan notasi titik.
```php
// URL-nya akan menjadi: /posts/{post}/comments/{comment}
Route::resource('posts.comments', PostCommentController::class);
```
*   **Shallow Nesting**: Ini seperti memberi "kunci rumah" sendiri pada si anak. Setelah tahu komentar mana yang mau diedit, kita tidak perlu lagi alamat lengkap post-nya. URL jadi lebih pendek dan rapi!
    ```php
    // URL edit: /comments/{comment}/edit (lebih pendek!)
    Route::resource('posts.comments', CommentController::class)->shallow();
    ```

**Contoh Lengkap Shallow Nesting:**

Tanpa shallow nesting, URL untuk edit komentar:
- `/posts/{post}/comments/{comment}/edit` (panjang dan kompleks)

Dengan shallow nesting, URL untuk edit komentar:
- `/comments/{comment}/edit` (lebih pendek dan sederhana)

**Contoh Implementasi:**

1. **Route dengan Shallow Nesting:**
```php
// routes/web.php
use App\Http\Controllers\CommentController;

// Nested resource biasa
Route::resource('posts.comments', CommentController::class);

// Nested resource dengan shallow nesting
Route::resource('posts.comments', CommentController::class)->shallow();
```

2. **Perbedaan Route yang Dihasilkan:**

**Tanpa Shallow Nesting:**
```
Verb    | URI                                        | Action      | Route Name
GET     | /posts/{post}/comments                     | index       | posts.comments.index
GET     | /posts/{post}/comments/create              | create      | posts.comments.create
POST    | /posts/{post}/comments                     | store       | posts.comments.store
GET     | /posts/{post}/comments/{comment}           | show        | posts.comments.show
GET     | /posts/{post}/comments/{comment}/edit      | edit        | posts.comments.edit
PUT/PATCH | /posts/{post}/comments/{comment}         | update      | posts.comments.update
DELETE  | /posts/{post}/comments/{comment}           | destroy     | posts.comments.destroy
```

**Dengan Shallow Nesting:**
```
Verb    | URI                                        | Action      | Route Name
GET     | /posts/{post}/comments                     | index       | posts.comments.index
GET     | /posts/{post}/comments/create              | create      | posts.comments.create
POST    | /posts/{post}/comments                     | store       | posts.comments.store
GET     | /posts/{post}/comments/{comment}           | show        | posts.comments.show
GET     | /comments/{comment}/edit                   | edit        | comments.edit
PUT/PATCH | /comments/{comment}                      | update      | comments.update
DELETE  | /comments/{comment}                        | destroy     | comments.destroy
```

3. **Controller dengan Shallow Nesting:**
```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class CommentController extends Controller
{
    // Tetap menerima $post karena untuk index/create/store/show
    public function index(Post $post): View
    {
        $comments = $post->comments;
        return view('comments.index', compact('post', 'comments'));
    }

    public function create(Post $post): View
    {
        return view('comments.create', compact('post'));
    }

    public function store(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $post->comments()->create([
            'content' => $validated['content'],
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('posts.comments.index', $post)
            ->with('status', 'Komentar berhasil ditambahkan!');
    }

    public function show(Post $post, Comment $comment): View
    {
        // Pastikan komentar milik post tertentu
        if ($comment->post_id !== $post->id) {
            abort(404);
        }
        return view('comments.show', compact('post', 'comment'));
    }

    // Perhatikan perubahan di sini: hanya menerima $comment
    public function edit(Comment $comment): View
    {
        // Kita tetap bisa mendapatkan post dari comment
        $post = $comment->post;
        return view('comments.edit', compact('post', 'comment'));
    }

    // Juga hanya menerima $comment
    public function update(Request $request, Comment $comment): RedirectResponse
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update($validated);

        // Kita tetap bisa mengarahkan ke route nested karena kita bisa akses post dari comment
        return redirect()->route('posts.comments.show', [$comment->post, $comment])
            ->with('status', 'Komentar berhasil diupdate!');
    }

    public function destroy(Comment $comment): RedirectResponse
    {
        $post = $comment->post; // Simpan post sebelum hapus comment
        $comment->delete();

        return redirect()->route('posts.comments.index', $post)
            ->with('status', 'Komentar berhasil dihapus!');
    }
}
```

Shallow nesting sangat berguna saat kita ingin URL yang lebih bersih untuk operasi edit/update/delete, sambil tetap menjaga hubungan logis antara resource.
*   **Scoped Bindings**: Ini fitur keamanan super canggih. Laravel akan otomatis memastikan `comment` yang kamu akses adalah benar-benar milik `post` tersebut. Anti salah kamar!
    ```php
    Route::resource('posts.comments', CommentController::class)->scoped();
    ```

**Contoh Lengkap Scoped Bindings:**

Tanpa scoped bindings, seseorang bisa mengakses komentar dari post lain dengan mengganti URL:
`/posts/1/comments/5` (mengakses komentar 5 dari post 1) 
`/posts/2/comments/5` (mengakses komentar 5 dari post 2 - tapi komentar 5 bisa saja milik post 1!)

Dengan scoped bindings, Laravel memastikan hanya komentar yang milik post tertentu yang bisa diakses.

**Contoh Implementasi:**

1. **Route dengan Scoped Bindings:**
```php
// routes/web.php
use App\Http\Controllers\CommentController;

// Ini memastikan bahwa komentar yang diakses benar-benar milik post tertentu
Route::resource('posts.comments', CommentController::class)
    ->scoped([
        'comment' => 'slug',  // Gunakan kolom 'slug' alih-alih 'id' untuk pencarian
    ]);
```

2. **Controller untuk Nested Resource:**
```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class CommentController extends Controller
{
    // Menampilkan semua komentar untuk post tertentu
    public function index(Post $post): View
    {
        $comments = $post->comments;
        return view('comments.index', compact('post', 'comments'));
    }

    // Menampilkan komentar tertentu milik post tertentu
    public function show(Post $post, Comment $comment): View
    {
        // Dengan scoped bindings, Laravel secara otomatis memastikan
        // bahwa $comment benar-benar milik $post
        return view('comments.show', compact('post', 'comment'));
    }

    // Form untuk membuat komentar baru
    public function create(Post $post): View
    {
        return view('comments.create', compact('post'));
    }

    // Menyimpan komentar baru
    public function store(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $post->comments()->create([
            'content' => $validated['content'],
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('posts.comments.index', $post)
            ->with('status', 'Komentar berhasil ditambahkan!');
    }

    // Form edit komentar
    public function edit(Post $post, Comment $comment): View
    {
        // Karena scoped bindings, kita dijamin $comment milik $post
        return view('comments.edit', compact('post', 'comment'));
    }

    // Update komentar
    public function update(Request $request, Post $post, Comment $comment): RedirectResponse
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update($validated);

        return redirect()->route('posts.comments.show', [$post, $comment])
            ->with('status', 'Komentar berhasil diupdate!');
    }

    // Hapus komentar
    public function destroy(Post $post, Comment $comment): RedirectResponse
    {
        $comment->delete();

        return redirect()->route('posts.comments.index', $post)
            ->with('status', 'Komentar berhasil dihapus!');
    }
}
```

3. **Model Post dan Comment:**
```php
// app/Models/Post.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'slug'];

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
```

```php
// app/Models/Comment.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['content', 'post_id', 'user_id', 'slug'];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
```

Dengan scoped bindings, URL `/posts/1/comments/5` hanya akan bekerja jika komentar dengan ID/Slug 5 benar-benar milik post dengan ID 1. Jika tidak, Laravel akan mengembalikan error 404.

### 9. 👤 Singleton Resources (Resource "Jomblo")

**Analogi:** Ini untuk resource yang cuma ada satu, seperti **buku harian** atau **profil pengguna**. Kamu tidak perlu "daftar semua buku harian", kan? Cukup `lihat`, `edit`, atau `update`.

**Mengapa?** Agar tidak membuat route-route yang tidak perlu seperti `index` atau `create`.

**Bagaimana?**
```php
Route::singleton('profile', ProfileController::class);
```

**Contoh Lengkap:**
Mari kita buat contoh lengkap untuk singleton resource profil pengguna:

1. **Buat Controller:**
```bash
php artisan make:controller ProfileController --singleton
```

2. **Isi Controller:**
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function show(): View
    {
        $user = Auth::user();
        return view('profile.show', compact('user'));
    }

    public function edit(): View
    {
        $user = Auth::user();
        return view('profile.edit', compact('user'));
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . Auth::id(),
            'bio' => 'nullable|string|max:1000',
        ]);

        Auth::user()->update($validated);

        return redirect()->route('profile.show')->with('status', 'Profile updated successfully!');
    }
}
```

3. **Route Singleton:**
```php
Route::singleton('profile', ProfileController::class)->middleware('auth');
```

**Route yang Dihasilkan:**
- `GET /profile` → `show()` - Menampilkan profil
- `GET /profile/edit` → `edit()` - Form edit profil  
- `PUT/PATCH /profile` → `update()` - Update profil

Jika kamu ingin singleton yang bisa dibuat dan dihapus:
```php
Route::singleton('profile', ProfileController::class)->creatable()->destroyable();
```
Ini akan menambahkan route `create`, `store`, dan `destroy`.

### 10. 🎨 Mendekorasi Pesta Resource-mu (Kustomisasi)

Kamu bisa mendekorasi resource route sesukamu:

*   **Menambah Menu Tambahan**: `Route::get('/photos/popular', ...);` (tulis **sebelum** `Route::resource`).
    ```php
    // routes/web.php
    use App\Http\Controllers\PhotoController;

    // Tambahkan route tambahan SEBELUM resource
    Route::get('/photos/popular', [PhotoController::class, 'popular'])->name('photos.popular');
    Route::resource('photos', PhotoController::class);
    ```

*   **Mengganti Nama Menu (Route Names)**: 
    ```php
    Route::resource('photos', PhotoController::class)->names([
        'create' => 'photos.build',
        'edit' => 'photos.revise',
        'show' => 'photos.display'
    ]);
    // Sekarang route menjadi: route('photos.build'), route('photos.revise'), dll.
    ```

*   **Mengganti Nama Tamu di Undangan (Route Parameters)**:
    ```php
    Route::resource('users', AdminUserController::class)->parameters([
        'users' => 'admin_user'
    ]);
    // URL menjadi: /users/{admin_user} (bukan /users/{user})
    ```

*   **Mengubah Bahasa di Pesta (Custom Resource Verbs)**:
    ```php
    // Ubah verb untuk create dan edit di semua resource
    Route::resourceVerbs([
        'create' => 'crear',  // /photos/crear
        'edit' => 'editar',   // /photos/{photo}/editar
    ]);

    Route::resource('photos', PhotoController::class);
    ```

*   **Jika Tamu Tak Ditemukan (Missing Model Handler)**:
    ```php
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Redirect;

    Route::resource('photos', PhotoController::class)
        ->missing(function (Request $request) {
            return Redirect::route('photos.index')
                ->with('error', 'Foto yang Anda cari tidak ditemukan.');
        });
    ```

**Contoh Lengkap Kustomisasi Resource:**
```php
// routes/web.php
use App\Http\Controllers\PhotoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

// Route tambahan sebelum resource
Route::get('/photos/popular', [PhotoController::class, 'popular'])->name('photos.popular');

// Route resource dengan berbagai kustomisasi
Route::resource('photos', PhotoController::class)
    ->names([                           // Ganti nama route
        'create' => 'photos.upload',
        'edit' => 'photos.revise'
    ])
    ->parameters([                      // Ganti nama parameter
        'photos' => 'photo_item'
    ])
    ->except(['destroy'])               // Kecualikan route destroy
    ->missing(function (Request $request) {  // Handler jika model tidak ditemukan
        return Redirect::route('photos.index')
            ->with('error', 'Foto yang Anda cari tidak ditemukan.');
    })
    ->middleware(['auth']);             // Tambahkan middleware

// Jika tetap ingin route destroy, tambahkan manual setelah resource
Route::delete('/photos/{photo_item}/permanent', [PhotoController::class, 'permanentDelete'])
    ->name('photos.permanentDelete')
    ->middleware(['auth', 'admin']);
```

### 11.5 🔐 Middleware di Resource Controllers

Kamu juga bisa menambahkan middleware pada resource controllers dengan berbagai tingkat spesifikasi:

*   **Middleware untuk semua aksi:**
    ```php
    Route::resource('users', UserController::class)
        ->middleware(['auth', 'verified']);
    ```

*   **Middleware untuk aksi tertentu:**
    ```php
    Route::apiResource('users', UserController::class)
        ->middlewareFor(['show', 'update'], 'auth');
    ```

*   **Mengecualikan middleware dari aksi tertentu:**
    ```php
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::resource('users', UserController::class)
            ->withoutMiddlewareFor('index', ['auth', 'verified']);
    });
    ```

**Contoh Lengkap Middleware di Resource:**
```php
// routes/web.php
use App\Http\Controllers\UserController;

Route::resource('users', UserController::class)
    ->middleware(['auth'])                    // Semua aksi butuh auth
    ->middlewareFor(['show', 'index'], 'role:viewer')  // Hanya show dan index butuh role viewer
    ->withoutMiddlewareFor('index', ['auth']);         // Kecualikan auth dari index
```

### 11.7 🌐 API Singleton Resources

**Mengapa?** Sama seperti singleton resource biasa, tapi untuk endpoint API yang hanya mengembalikan data JSON.

**Bagaimana?**
```php
// routes/api.php
use App\Http\Controllers\Api\ProfileController;

Route::apiSingleton('profile', ProfileController::class);
```

**Route yang Dihasilkan:**
- `GET /api/profile` → `show()` - Mengembalikan data profil dalam JSON
- `PUT/PATCH /api/profile` → `update()` - Update profil via API

Jika kamu ingin versi API singleton yang bisa dibuat dan dihapus:
```php
Route::apiSingleton('profile', ProfileController::class)->creatable();
```
Ini akan menambahkan route `store` & `destroy` untuk API.

### 11. 🗑️ Menangani Sampah (Soft Deletes)

**Mengapa?** Terkadang kita tidak mau data benar-benar hilang, hanya disembunyikan. Fitur ini menyediakan route untuk melihat dan mengembalikan data dari "tong sampah".

**Bagaimana?**
*   **Route untuk Tong Sampah**: `Route::softDeletableResources(...)` akan menambah route `restore` dan `trashed`.
*   **Melihat Isi Tong Sampah**: `->withTrashed()` agar route bisa menemukan data yang sudah "dibuang".

**Contoh Lengkap dengan Soft Delete:**

1. **Aktifkan Soft Delete di Model:**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['title', 'content', 'user_id'];
}
```

2. **Buat Migration untuk Kolom Deleted At:**
```bash
php artisan make:migration add_deleted_at_to_posts_table
```

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->softDeletes(); // Menambahkan kolom deleted_at
        });
    }

    public function down()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
```

3. **Gunakan Soft Deletable Resources:**
```php
// routes/web.php
use App\Http\Controllers\PostController;

Route::softDeletableResources([
    'posts' => PostController::class,
]);
```

4. **Contoh Controller dengan Soft Delete:**
```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class PostController extends Controller
{
    // Menampilkan semua posts (aktif dan dihapus)
    public function index(): View
    {
        $posts = Post::withTrashed()->get(); // Tampilkan semua termasuk yang dihapus
        return view('posts.index', compact('posts'));
    }

    // Menampilkan post tertentu (akan menampilkan meskipun dihapus)
    public function show(Post $post): View
    {
        return view('posts.show', compact('post'));
    }

    // Hapus post (soft delete)
    public function destroy(Post $post): RedirectResponse
    {
        $post->delete(); // Ini akan soft delete (menandai sebagai dihapus tanpa benar-benar menghapus)
        return redirect()->route('posts.index')->with('status', 'Post moved to trash!');
    }

    // Hanya menampilkan posts yang sudah dihapus
    public function trashed(): View
    {
        $posts = Post::onlyTrashed()->get(); // Hanya posts yang dihapus
        return view('posts.trashed', compact('posts'));
    }

    // Mengembalikan post dari tong sampah
    public function restore(string $id): RedirectResponse
    {
        $post = Post::withTrashed()->findOrFail($id);
        $post->restore(); // Kembalikan dari soft delete
        return redirect()->route('posts.show', $post->id)->with('status', 'Post restored successfully!');
    }

    // Hapus permanen post
    public function forceDestroy(string $id): RedirectResponse
    {
        $post = Post::withTrashed()->findOrFail($id);
        $post->forceDelete(); // Hapus benar-benar dari database
        return redirect()->route('posts.index')->with('status', 'Post permanently deleted!');
    }
}
```

5. **Route tambahan untuk fitur soft delete:**
```php
// routes/web.php
use App\Http\Controllers\PostController;

Route::resource('posts', PostController::class);

// Tambahkan route untuk soft delete
Route::patch('/posts/{post}/restore', [PostController::class, 'restore'])->name('posts.restore');
Route::delete('/posts/{post}/force', [PostController::class, 'forceDestroy'])->name('posts.forceDestroy');
Route::get('/posts/trashed', [PostController::class, 'trashed'])->name('posts.trashed');
```

**Route yang Dihasilkan dengan Soft Delete:**
- `GET /posts` → `index()` - Tampilkan semua posts termasuk yang dihapus
- `GET /posts/trashed` → `trashed()` - Tampilkan hanya posts yang dihapus
- `PATCH /posts/{post}/restore` → `restore()` - Kembalikan post dari tong sampah
- `DELETE /posts/{post}/force` → `forceDestroy()` - Hapus permanen

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Controller 🧰

### 12. 🔐 Middleware di Controller (Satpam Pribadi)

**Mengapa?** Terkadang, semua method di sebuah controller butuh penjagaan yang sama (misalnya, harus login dulu). Menaruhnya di controller lebih praktis daripada menuliskannya di setiap route.

**Bagaimana?**
*   **Cara Modern (👍 Rekomendasi)**: `implements HasMiddleware`. Ini seperti satpam yang baru datang saat gerbangnya mau dilewati, jadi lebih efisien.
    ```php
    use Illuminate\Routing\Controllers\HasMiddleware;
    use Illuminate\Routing\Controllers\Middleware;
    use App\Http\Controllers\Controller;

    class OrderController extends Controller implements HasMiddleware
    {
        public static function middleware(): array
        {
            return [
                'auth',
                new Middleware('verified', only: ['store', 'update']),
                new Middleware('role:admin', except: ['index', 'show']),
            ];
        }
    }
    ```

*   **Cara Lama (`__construct`)**: Ini seperti satpam yang sudah standby dari pagi, bahkan saat tidak ada yang lewat. Masih bisa, tapi kurang efisien.
    ```php
    class OrderController extends Controller
    {
        public function __construct()
        {
            $this->middleware('auth');
            $this->middleware('verified')->only(['store', 'update']);
            $this->middleware('role:admin')->except(['index', 'show']);
        }
    }
    ```

*   **Anonymous Middleware**: Kamu juga bisa membuat middleware inline langsung di controller:
    ```php
    use Illuminate\Routing\Controllers\Middleware;

    class UserController extends Controller implements HasMiddleware
    {
        public static function middleware(): array
        {
            return [
                'auth',
                new Middleware(function ($request, $next) {
                    // Logika middleware khusus
                    if ($request->user()->isBanned()) {
                        return redirect('/banned');
                    }
                    
                    return $next($request);
                }, only: ['update', 'delete']),
            ];
        }
    }
    ```

### 13. 💉 Dependency Injection (Asisten Pribadi Ajaib)

**Prinsipnya: Jangan buat sendiri, minta saja!** Butuh sesuatu? Tulis di parameter method, dan asisten ajaib Laravel (Service Container) akan menyiapkannya untukmu.

**Mengapa?** Ini membuat kodemu sangat fleksibel, mudah di-test, dan tidak terikat pada satu cara pembuatan objek.

**Bagaimana?**
*   **Method Injection**: Meminta `Request` atau `Model`.
    ```php
    public function update(Request $request, Post $post) { /* ... */ }
    ```
*   **Constructor Injection**: Meminta "alat canggih" (seperti `Service Class`) yang akan dipakai di banyak method.
    ```php
    use App\Services\StripeService;
    public function __construct(protected StripeService $stripe) {}
    ```

**Contoh Lengkap Dependency Injection:**

1. **Membuat Service Class:**
```php
<?php
// app/Services/OrderService.php

namespace App\Services;

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function createOrder(array $data, User $user): Order
    {
        return DB::transaction(function () use ($data, $user) {
            $order = new Order($data);
            $order->user()->associate($user);
            $order->save();

            // Logika tambahan seperti kalkulasi total, potongan harga, dll.
            $this->calculateTotals($order);
            
            return $order;
        });
    }

    private function calculateTotals(Order $order): void
    {
        // Logika kalkulasi total order
    }

    public function processPayment(Order $order, string $paymentMethod): bool
    {
        // Logika pemrosesan pembayaran
        return true;
    }
}
```

2. **Controller dengan Constructor Injection:**
```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class OrderController extends Controller
{
    // Constructor injection - service akan di-inject ke semua method
    public function __construct(
        protected OrderService $orderService
    ) {}

    public function index(): View
    {
        $orders = Order::with('user')->latest()->get();
        return view('orders.index', compact('orders'));
    }

    public function show(Order $order): View
    {
        return view('orders.show', compact('order'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Gunakan service yang sudah di-inject
        $order = $this->orderService->createOrder($validated, auth()->user());

        return redirect()->route('orders.show', $order)
            ->with('status', 'Order created successfully!');
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled',
        ]);

        $order->update($validated);

        return redirect()->route('orders.show', $order)
            ->with('status', 'Order updated successfully!');
    }

    public function processPayment(Request $request, Order $order): RedirectResponse
    {
        $paymentMethod = $request->input('payment_method');
        
        // Gunakan service yang sama
        $success = $this->orderService->processPayment($order, $paymentMethod);

        if ($success) {
            return redirect()->route('orders.show', $order)
                ->with('status', 'Payment processed successfully!');
        }

        return redirect()->back()
            ->with('error', 'Payment failed!');
    }
}
```

3. **Method Injection untuk Request dan Validasi:**
```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class AdvancedOrderController extends Controller
{
    public function index(Request $request): View
    {
        // Method injection untuk Request object
        $query = Order::query();
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $orders = $query->with('user')->latest()->get();
        return view('orders.index', compact('orders'));
    }

    // Request injection untuk validasi dan StoreOrderRequest injection untuk aturan validasi
    public function store(StoreOrderRequest $request): RedirectResponse
    {
        // StoreOrderRequest sudah otomatis melakukan validasi sesuai rules di classnya
        $validatedData = $request->validated(); // Mendapatkan data yang sudah divalidasi
        
        $order = Order::create([
            'user_id' => auth()->id(),
            'items' => $validatedData['items'],
            'total_amount' => $this->calculateTotal($validatedData['items']),
            'status' => 'pending'
        ]);

        return redirect()->route('orders.show', $order)
            ->with('status', 'Order created successfully!');
    }

    // Bisa juga menggunakan Request dan model binding bersamaan
    public function update(UpdateOrderRequest $request, Order $order, string $status): RedirectResponse
    {
        // UpdateOrderRequest melakukan validasi, $order di-bind dari route parameter
        $order->update($request->validated());

        return redirect()->route('orders.show', $order->id)
            ->with('status', 'Order updated successfully!');
    }

    private function calculateTotal(array $items): float
    {
        return array_reduce($items, function($total, $item) {
            return $total + ($item['price'] * $item['quantity']);
        }, 0);
    }
}
```

4. **Form Request Class (untuk validasi):**
```php
<?php
// app/Http/Requests/StoreOrderRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Pastikan user bisa membuat order
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'shipping_address' => 'required|string',
            'payment_method' => 'required|in:credit_card,paypal,bank_transfer',
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Setidaknya satu item harus dipilih.',
            'items.*.product_id.required' => 'Produk harus dipilih.',
            'items.*.quantity.min' => 'Jumlah barang minimal 1.',
        ];
    }
}
```

Dependency Injection membuat kode kamu:
- **Lebih modular**: Setiap class punya tanggung jawab sendiri
- **Lebih mudah di-test**: Kamu bisa mock dependencies saat testing
- **Lebih fleksibel**: Mudah untuk mengganti implementasi service
- **Lebih bersih**: Controller tidak kotor dengan pembuatan objek manual

### 13.5 🏗️ Constructor dan Method Injection Detail

Ada beberapa pendekatan untuk dependency injection di controller:

**1. Constructor Injection dengan Visibility Modifiers:**
```php
class PostController extends Controller
{
    // Protected akan membuat property bisa diakses dari class ini dan child class
    public function __construct(protected PostService $postService) {}
    
    // Atau bisa juga dengan property promotion lebih eksplisit:
    public function __construct(
        protected PostService $postService,
        protected AuthService $authService
    ) {}
}
```

**2. Method Injection untuk Request Spesifik:**
```php
public function store(StorePostRequest $request) 
{
    // StorePostRequest adalah kelas Form Request yang berisi aturan validasi
    $validated = $request->validated();
    // ...
}

public function update(Request $request, Post $post, int $id) 
{
    // Request otomatis di-inject, $post di-bind dari route parameter
    // $id juga di-bind dari route parameter
}
```

### 14. 👮 Autorisasi (Kartu Akses Ajaib)

**Mengapa?** Untuk memastikan hanya orang yang berhak yang bisa melakukan aksi tertentu (misal: hanya kamu yang bisa mengedit post-mu sendiri).

**Bagaimana?** Helper `authorize` ini seperti men-scan kartu akses. Laravel akan otomatis mengecek ke "sistem keamanan" (**Policy** class) apakah kartumu (user-mu) punya izin.

```php
public function update(Request $request, Post $post)
{
    $this->authorize('update', $post); // Pindai kartu akses!
    // Jika diizinkan, lanjutkan...
}
```

**Contoh Lengkap Otorisasi:**

1. **Buat Policy:**
```bash
php artisan make:policy PostPolicy
```

2. **Isi Policy:**
```php
<?php
// app/Policies/PostPolicy.php

namespace App\Policies;

use App\Models\User;
use App\Models\Post;

class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }
    
    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->hasRole('admin');
    }
}
```

3. **Gunakan di Controller:**
```php
class PostController extends Controller
{
    public function edit(Post $post)
    {
        $this->authorize('update', $post);
        return view('posts.edit', compact('post'));
    }
    
    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);
        $post->delete();
        
        return redirect()->route('posts.index')
            ->with('status', 'Post deleted successfully');
    }
}
```

---

## Bagian 5: Menjadi Master Controller 🏆

### 15. ✨ Wejangan dari Guru

1.  **Controller Langsing, Model Gemuk**: Controller itu manajer, bukan koki. Biarkan **Model** atau **Service Class** yang bekerja keras.
2.  **Beri Nama yang Jelas**: `ProductController`, `Api\V1\ProductController`.
3.  **Validasi itu Wajib!**: Gunakan **Form Request** agar controllermu tidak kotor oleh kode validasi.
4.  **Rapikan dengan Subfolder**: Untuk aplikasi besar, kelompokkan controller dalam folder seperti `Admin/`, `Api/`, dll.

### 16. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Controller di Laravel:

#### 📦 Resource Controllers
| Perintah | Fungsi |
|----------|--------|
| `Route::resource('photos', PhotoController::class);` | Buat semua route CRUD (`index, create, store, show, edit, update, destroy`) |
| `Route::resources([...])` | Daftar banyak resource sekaligus |
| `Route::softDeletableResources([...])` | Resource dengan dukungan soft deletes |

#### 🎯 Partial Resource Routes
| Perintah | Hasil |
|----------|-------|
| `->only(['index', 'show'])` | Hanya buat `index` & `show` |
| `->except(['create', 'store'])` | Buat semua kecuali `create` & `store` |

#### 🌐 API Resource Controllers
| Perintah | Fungsi |
|----------|--------|
| `Route::apiResource('photos', PhotoController::class);` | Hanya route API (`index, store, show, update, destroy`) |
| `Route::apiResources([...])` | Banyak API resource sekaligus |
| `php artisan make:controller PhotoController --api` | Membuat API controller (tanpa `create` & `edit`) |

#### 🔗 Nested & Scoped Resources
| Perintah | Fungsi |
|----------|--------|
| `Route::resource('photos.comments', PhotoCommentController::class);` | Nested resource |
| `->shallow()` | Child routes tanpa parent ID untuk `show/edit/update/destroy` |
| `->scoped(['comment' => 'slug'])` | Gunakan field lain (misal slug) untuk binding |

#### 🎯 Singleton Resources
| Perintah | Hasil |
|----------|--------|
| `Route::singleton('profile', ProfileController::class);` | `show`, `edit`, `update` |
| `->creatable()` | Tambah `create`, `store`, `destroy` |
| `->destroyable()` | Tambah hanya `destroy` |
| `Route::apiSingleton('profile', ProfileController::class);` | Versi API (`show`, `update`) |
| `Route::apiSingleton('profile', ProfileController::class)->creatable()` | API Singleton dengan `store` & `destroy` |

#### 🔧 Customizing Routes
| Perintah | Fungsi |
|----------|--------|
| `->names([...])` | Ubah nama route default |
| `->parameters([...])` | Ubah nama parameter di URI |
| `Route::resourceVerbs([...])` | Lokalisasi verb `create` & `edit` |
| `->missing(fn($req) => Redirect::route(...))` | Custom handler saat model tidak ditemukan |
| `->withTrashed()` | Mengizinkan akses model soft deleted |
| `->withTrashed(['show'])` | Hanya mengizinkan akses model soft deleted untuk aksi tertentu |

#### 🔐 Middleware in Resource Controllers
| Perintah | Fungsi |
|----------|--------|
| `->middleware([...])` | Tambah middleware ke semua aksi |
| `->middlewareFor(['show'], 'auth')` | Tambah middleware ke aksi tertentu |
| `->withoutMiddlewareFor('index', [...])` | Hilangkan middleware dari aksi tertentu |

#### 🛠️ Artisan Commands
| Command | Fungsi |
|---------|--------|
| `php artisan make:controller UserController` | Membuat controller biasa |
| `php artisan make:controller ServerController --invokable` | Membuat single-action controller |
| `php artisan make:controller PhotoController --resource` | Membuat resource controller |
| `php artisan make:controller PhotoController --api` | Membuat API controller |
| `php artisan make:controller PhotoController --model=Photo --resource` | Resource controller dengan model binding |
| `php artisan make:controller PhotoController --model=Photo --resource --requests` | Sekaligus generate Form Request untuk `store` & `update` |

#### 📋 Actions dalam Resource Controllers
| Verb | URI | Action | Route Name |
|------|-----|--------|------------|
| GET | `/photos` | `index` | `photos.index` |
| GET | `/photos/create` | `create` | `photos.create` |
| POST | `/photos` | `store` | `photos.store` |
| GET | `/photos/{photo}` | `show` | `photos.show` |
| GET | `/photos/{photo}/edit` | `edit` | `photos.edit` |
| PUT/PATCH | `/photos/{photo}` | `update` | `photos.update` |
| DELETE | `/photos/{photo}` | `destroy` | `photos.destroy` |

### 17. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Controller, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Ingat, Controller adalah jantung dari aplikasi. Menguasainya berarti kamu sudah siap membangun aplikasi Laravel yang hebat, terstruktur, dan aman.

Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku!


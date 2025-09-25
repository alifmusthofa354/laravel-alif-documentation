# 📚 Eloquent Relationships di Laravel: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Di dunia nyata, segala sesuatu saling terkait satu sama lain. Anak memiliki orang tua, mobil memiliki pemilik, komentar terkait dengan postingan, dan sebagainya. Di dunia database, kita menyebut keterkaitan ini sebagai **Relationships**.

Di edisi super lengkap ini, kita akan kupas tuntas **semua detail** tentang Eloquent Relationships, tapi setiap topik akan aku ajarkan dengan sabar, seolah-olah aku sedang duduk di sebelahmu sambil menjelaskan pelan-pelan. Siap? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Eloquent Relationships Itu Sebenarnya?

**Analogi:** Bayangkan kamu punya buku telepon besar yang penuh dengan informasi. Tapi setiap halaman buku ini tidak berdiri sendiri - mereka saling terhubung. Seorang **pemilik rumah** (User) punya **nomor telepon** (Phone), **daftar belanja** (ShoppingList), **catatan keuangan** (Account), dan sebagainya. Dan satu nomor telepon bisa terkait dengan **keluarga** (Family) yang tinggal di rumah tersebut.

**Mengapa ini penting?** Karena tanpa relationships, kamu harus:
- Menulis banyak query manual untuk menghubungkan data
- Melakukan banyak perhitungan di PHP untuk menggabungkan informasi
- Kehilangan kemampuan Laravel untuk mengatur query secara otomatis

**Bagaimana cara kerjanya?** Laravel Eloquent menyediakan metode khusus di model yang membuat hubungan antar tabel terlihat seolah-olah mereka adalah properti dari model itu sendiri:

`➡️ Model(User) -> 🤝 Relationships (hasOne, hasMany, belongsTo, etc.) -> 🗄️ Related Model(Phone, Post, etc.)`

Dengan pendekatan Laravel, mengakses data terkait menjadi sangat intuitif dan mudah! 😊

### 2. ✍️ Resep Pertamamu: One-to-One Relationship

Ini adalah fondasi paling dasar. Mari kita buat hubungan one-to-one dari nol, langkah demi langkah.

#### Langkah 1️⃣: Siapkan Tabel di Database
**Mengapa?** Kita butuh struktur database yang bisa menyimpan hubungan antar tabel.

**Bagaimana?**
```bash
# Buat migration untuk tabel users (sudah ada secara default)
php artisan make:migration create_users_table

# Buat migration untuk tabel phones
php artisan make:migration create_phones_table
```

File migration untuk phones:
```php
<?php
// database/migrations/xxxx_xx_xx_create_phones_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('phones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('number');
            $table->string('type')->default('mobile');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('phones');
    }
};
```

#### Langkah 2️⃣: Buat Model dengan Relationship
**Mengapa?** Kita perlu memberi tahu Laravel tentang hubungan antar tabel.

**Bagaimana?** Buka model User dan Phone:
```php
<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Model
{
    use HasFactory;

    /**
     * Dapatkan phone milik user ini
     */
    public function phone(): HasOne
    {
        return $this->hasOne(Phone::class);
    }
}
```

```php
<?php
// app/Models/Phone.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Phone extends Model
{
    use HasFactory;

    protected $fillable = ['number', 'type'];

    /**
     * Dapatkan user pemilik phone ini
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

**Penjelasan Kode:**
- `hasOne()`: Mengatakan bahwa satu User memiliki satu Phone
- `belongsTo()`: Mengatakan bahwa satu Phone milik satu User
- `$table->foreignId('user_id')->constrained()`: Membuat foreign key yang terhubung ke tabel users

#### Langkah 3️⃣: Gunakan Relationship di Controller
**Mengapa?** Kita ingin mengakses data terkait dengan mudah.

**Bagaimana?** Gunakan relationship seperti properti biasa:
```php
<?php
// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class UserController extends Controller
{
    public function show(int $id): View
    {
        $user = User::find($id);
        
        // Akses phone milik user dengan sangat mudah!
        $phone = $user->phone; // Akan mengembalikan satu model Phone atau null
        
        return view('users.show', compact('user', 'phone'));
    }

    public function createPhone(Request $request, int $userId): RedirectResponse
    {
        $request->validate([
            'number' => 'required|string|max:20',
            'type' => 'required|in:mobile,home,work'
        ]);

        $user = User::findOrFail($userId);
        
        // Buat phone baru yang terkait dengan user
        $user->phone()->create([
            'number' => $request->number,
            'type' => $request->type
        ]);

        return redirect()->route('users.show', $user->id)
            ->with('status', 'Phone berhasil ditambahkan!');
    }
}
```

Selesai! 🎉 Sekarang kamu bisa mengakses phone dari user dengan `$user->phone`!

### 3. ⚡ One-to-One Spesialis: Invers Relationship

**Analogi:** Bayangkan kamu mulai dari nomor telepon dan ingin tahu pemiliknya - itu adalah jalan balik dari hubungan one-to-one.

**Mengapa ini ada?** Karena dalam aplikasi nyata, kamu sering perlu bergerak dalam dua arah: dari user ke phone dan dari phone ke user.

**Bagaimana?** Gunakan relationship `belongsTo`:
```php
// Dari model Phone ke User (inverse dari one-to-one)
$phone = Phone::find(1);
$user = $phone->user; // Akses user dari phone

// Query dengan relationship
$user = Phone::where('number', '123-456-7890')
    ->first()
    ->user; // Dapatkan user pemilik nomor tersebut
```

---

## Bagian 2: Relationship Controller - Sistem Keterkaitan Otomatis-mu 🤖

### 4. 📦 Apa Itu Relationship System?

**Analogi:** Jika Eloquent adalah **pemandu wisata digital**, maka relationships adalah **jembatan-jembatan ajaib** yang menghubungkan tempat-tempat penting di kota data-mu. Pemandu ini tahu persis jembatan mana yang harus dilewati untuk sampai ke tempat yang kamu cari, dan bahkan bisa mengambil informasi sepanjang perjalanan!

**Mengapa ini keren?** Karena sistem ini tahu persis:
- Tabel mana yang terkait dengan tabel mana
- Bagaimana cara mengakses data terkait
- Bagaimana membuat query yang efisien
- Bisa menghindari N+1 queries yang membuat lambat

**Bagaimana?**
```bash
# Semua tipe relationship dalam Laravel
hasOne()        # Satu model memiliki satu model lain
hasMany()       # Satu model memiliki banyak model lain
belongsTo()     # Model ini milik satu model lain
belongsToMany() # Model ini memiliki banyak model lain dan sebaliknya
```

### 5. 🛠️ Mantra Artisan dengan Kekuatan Tambahan

> **✨ Tips dari Guru:** Mantra ini seperti memberi *power-up* pada sistem relationships-mu. Wajib dipakai untuk hemat waktu dan query!

*   **Membuat Model dengan Migration (`--all`)**: Ini seperti membuat rumah lengkap dengan furnitur dan koneksi.
    ```bash
    php artisan make:model Post -mfc
    # -m: migration, -f: factory, -c: controller
    ```

*   **Membuat Migration Pivot Spesifik Many-to-Many**: Untuk membuat tabel pivot dengan kolom tambahan.
    ```bash
    php artisan make:migration create_post_tag_table --create=post_tag
    ```

### 6. 🧩 One-to-Many Relationship (Paling Umum)

*   **Definisi Relationship**:
```php
<?php
// app/Models/Post.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    use HasFactory;

    /**
     * Dapatkan semua komentar dari postingan ini
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
```

```php
<?php
// app/Models/Comment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['content', 'approved'];

    /**
     * Dapatkan postingan tempat komentar ini berada
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
```

*   **Menggunakan Relationship**:
```php
// Dapatkan semua komentar dari satu postingan
$post = Post::find(1);
$comments = $post->comments; // Koleksi semua komentar

// Tambah komentar baru
$post->comments()->create([
    'content' => 'Ini adalah komentar baru!',
    'approved' => true
]);

// Query dengan kondisi
$approvedComments = $post->comments()->where('approved', true)->get();
```

### 7. 🌐 Many-to-Many Relationship (Kompleks tapi Kuat)

**Mengapa?** Karena banyak skenario dunia nyata melibatkan hubungan kompleks seperti: user memiliki banyak role, role dimiliki oleh banyak user.

**Bagaimana?** Dibutuhkan tabel pivot (tengah) untuk menghubungkan dua model.

*   **Struktur Tabel**:
```
users: id, name, email
roles: id, name
role_user: user_id, role_id (tabel pivot)
```

*   **Definisi Relationship**:
```php
<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasFactory;

    /**
     * Dapatkan semua role milik user ini
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }
}
```

```php
<?php
// app/Models/Role.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    use HasFactory;

    /**
     * Dapatkan semua user yang memiliki role ini
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
```

*   **Menggunakan Relationship**:
```php
// Dapatkan semua role dari user
$user = User::find(1);
$roles = $user->roles;

// Tambah role ke user
$user->roles()->attach($roleId);

// Hapus role dari user
$user->roles()->detach($roleId);

// Sync role (hapus semua, lalu tambahkan yang baru)
$user->roles()->sync([1, 2, 3]);

// Akses data pivot
foreach ($user->roles as $role) {
    echo $role->pivot->created_at; // Akses kolom dari tabel pivot
}
```

**Contoh Lengkap Many-to-Many:**

1. **Migration Pivot Table**:
```php
<?php
// database/migrations/xxxx_xx_xx_create_user_role_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('role_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->timestamp('assigned_at')->nullable();
            $table->string('assigned_by')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'role_id']); // Mencegah duplikasi
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('role_user');
    }
};
```

2. **Model dengan Pivot Custom**:
```php
<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasFactory;

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)
            ->withPivot(['assigned_at', 'assigned_by'])
            ->withTimestamps();
    }
}
```

3. **Penggunaan dalam Controller**:
```php
<?php
// app/Http/Controllers/UserRoleController.php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class UserRoleController extends Controller
{
    public function assignRole(Request $request, int $userId): RedirectResponse
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id'
        ]);

        $user = User::findOrFail($userId);
        
        // Cek apakah user sudah punya role ini
        if (!$user->roles()->where('role_id', $request->role_id)->exists()) {
            $user->roles()->attach($request->role_id, [
                'assigned_at' => now(),
                'assigned_by' => auth()->id()
            ]);
        }

        return redirect()->back()
            ->with('status', 'Role berhasil ditambahkan!');
    }

    public function removeRole(int $userId, int $roleId): RedirectResponse
    {
        $user = User::findOrFail($userId);
        $user->roles()->detach($roleId);

        return redirect()->back()
            ->with('status', 'Role berhasil dihapus!');
    }
}
```

---

## Bagian 3: Jurus Tingkat Lanjit - Relationships Canggih 🚀

### 8. 👨‍👩‍👧 Has One Through Relationships

**Analogi:** Bayangkan kamu ingin tahu siapa **pemilik mobil** dari seorang **mekanik**. Tapi hubungannya tidak langsung: mekanik → mobil → pemilik. Itulah hubungan "through" - lewat model perantara.

**Mengapa?** Karena dalam dunia nyata, terkadang hubungan antar data melibatkan model perantara.

**Bagaimana?** 
```php
<?php
// app/Models/Mechanic.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class Mechanic extends Model
{
    use HasFactory;

    /**
     * Dapatkan pemilik mobil yang diperbaiki mekanik ini
     * (mekanik -> car -> owner)
     */
    public function carOwner(): HasOneThrough
    {
        return $this->hasOneThrough(
            Owner::class,    // Model akhir yang ingin diakses
            Car::class,      // Model perantara
            'mechanic_id',   // Foreign key di tabel perantara (cars.mechanic_id)
            'id',           // Foreign key di tabel akhir (owners.id)
            'id',           // Local key di model ini (mechanics.id)
            'owner_id'      // Foreign key di tabel perantara (cars.owner_id)
        );
    }
}
```

```php
<?php
// app/Models/Car.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Car extends Model
{
    use HasFactory;

    public function mechanic(): BelongsTo
    {
        return $this->belongsTo(Mechanic::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(Owner::class);
    }
}
```

### 9. 👤 Has Many Through Relationships

**Analogi:** Ini seperti ingin tahu semua **deployment** dari sebuah **application**, tapi harus melewati **environment** dulu: application → environment → deployment.

**Mengapa?** Untuk mendapatkan banyak data tak langsung dari model lain melalui model perantara.

**Bagaimana?**
```php
<?php
// app/Models/Application.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Application extends Model
{
    use HasFactory;

    /**
     * Dapatkan semua deployment dari aplikasi ini
     * (application -> environment -> deployment)
     */
    public function deployments(): HasManyThrough
    {
        return $this->hasManyThrough(
            Deployment::class,     // Model akhir yang ingin diakses
            Environment::class,    // Model perantara
            'application_id',      // Foreign key di tabel perantara (environments.application_id)
            'environment_id',      // Foreign key di tabel akhir (deployments.environment_id)
            'id',                 // Local key di model ini (applications.id)
            'id'                  // Local key di tabel perantara (environments.id)
        );
    }
}
```

### 10. 🎨 Polymorphic Relationships (Satu Model untuk Banyak Tabel)

Kamu bisa menyesuaikan relationship dengan berbagai pendekatan:

*   **One-to-One Polymorphic**:
```php
<?php
// app/Models/Image.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Image extends Model
{
    use HasFactory;

    protected $fillable = ['path', 'alt'];

    /**
     * Gambar bisa dimiliki oleh berbagai model (user, post, etc.)
     */
    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }
}
```

```php
<?php
// app/Models/Post.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Post extends Model
{
    use HasFactory;

    /**
     * Dapatkan satu gambar yang terkait dengan post ini
     */
    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}
```

```php
<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class User extends Authenticatable
{
    use HasFactory;

    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}
```

*   **One-to-Many Polymorphic**:
```php
<?php
// app/Models/Comment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['content', 'approved'];

    /**
     * Komentar bisa terkait dengan berbagai model (post, video, etc.)
     */
    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }
}
```

```php
<?php
// app/Models/Post.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Post extends Model
{
    use HasFactory;

    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
```

*   **Many-to-Many Polymorphic**:
```php
<?php
// app/Models/Tag.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Tag extends Model
{
    use HasFactory;

    public function posts(): MorphToMany
    {
        return $this->morphedByMany(Post::class, 'taggable');
    }

    public function videos(): MorphToMany
    {
        return $this->morphedByMany(Video::class, 'taggable');
    }
}
```

```php
<?php
// app/Models/Post.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Post extends Model
{
    use HasFactory;

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}
```

### 11.5 🔐 Eager Loading - Menghindari N+1 Queries

**Mengapa?** Karena tanpa eager loading, kamu bisa mengalami N+1 queries - satu query untuk mengambil data utama, lalu N query tambahan untuk mengambil data terkait.

**Bagaimana?**

*   **Basic Eager Loading**:
```php
// Tanpa eager loading - N+1 queries!
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->user->name; // Query tambahan untuk setiap post!
}

// Dengan eager loading - hanya 2 queries!
$posts = Post::with('user')->get();
foreach ($posts as $post) {
    echo $post->user->name; // Sudah ada, tidak ada query tambahan!
}
```

*   **Nested Eager Loading**:
```php
// Eager load relasi bersarang
$posts = Post::with(['user', 'comments', 'comments.user'])->get();

// Eager load dengan kondisi
$posts = Post::with(['comments' => function ($query) {
    $query->where('approved', true)->orderBy('created_at', 'desc');
}])->get();
```

*   **Eager Loading dengan Agregasi**:
```php
// Hitung jumlah komentar untuk setiap post
$posts = Post::withCount('comments')->get();
foreach ($posts as $post) {
    echo "Post ini punya {$post->comments_count} komentar";
}

// Hitung dengan kondisi
$posts = Post::withCount(['comments' => function ($query) {
    $query->where('approved', true);
}])->get();
```

### 11.7 🌐 Querying Relationships dengan Kondisi

**Mengapa?** Karena kamu sering perlu mengambil data hanya jika mereka memiliki relationship tertentu atau kondisi tertentu.

**Bagaimana?**

*   **has() - Cek apakah punya relationship**:
```php
// Ambil semua post yang memiliki komentar
$posts = Post::has('comments')->get();

// Ambil post yang memiliki lebih dari 3 komentar
$popularPosts = Post::has('comments', '>', 3)->get();

// Nested has - post dengan komentar yang disetujui
$posts = Post::has('comments.approved')->get();
```

*   **whereHas() - Query dengan kondisi pada relationship**:
```php
// Ambil post yang memiliki komentar dari admin
$posts = Post::whereHas('comments', function ($query) {
    $query->where('user_id', auth()->id());
})->get();

// Ambil post dengan minimal 2 komentar disetujui
$posts = Post::whereHas('comments', function ($query) {
    $query->where('approved', true);
}, '>=', 2)->get();
```

*   **whereRelation() - Kondisi langsung pada relationship**:
```php
// Ambil post yang komentarnya disetujui
$posts = Post::whereRelation('comments', 'approved', true)->get();

// Ambil post dengan komentar dari user tertentu
$posts = Post::whereRelation('comments', 'user_id', auth()->id())->get();
```

### 11. 🗑️ Advanced Relationship Operations

**Mengapa?** Karena kamu perlu tidak hanya membaca, tapi juga membuat, mengupdate, dan menghapus data terkait dengan cara yang efisien.

**Bagaimana?**

*   **Menggunakan save() dan create() pada relationship**:
```php
// Simpan model terkait
$post = Post::find(1);
$comment = new Comment(['content' => 'Komentar baru']);
$post->comments()->save($comment);

// Buat langsung tanpa perlu save()
$post->comments()->create([
    'content' => 'Komentar lain',
    'user_id' => auth()->id()
]);

// Buat banyak sekaligus
$post->comments()->createMany([
    ['content' => 'Komentar 1', 'user_id' => 1],
    ['content' => 'Komentar 2', 'user_id' => 2],
]);
```

*   **Operasi Many-to-Many**:
```php
$user = User::find(1);

// Tambahkan role
$user->roles()->attach(1);

// Tambahkan dengan data tambahan di pivot
$user->roles()->attach(1, [
    'assigned_at' => now(),
    'assigned_by' => auth()->id()
]);

// Hapus role
$user->roles()->detach(1);

// Sinkronisasi (hapus semua, tambahkan yang baru)
$user->roles()->sync([1, 2, 3]);

// Toggle (jika ada hapus, jika tidak ada tambah)
$user->roles()->toggle([1, 2]);

// Update pivot
$user->roles()->updateExistingPivot($roleId, [
    'assigned_at' => now()
]);
```

**Contoh Lengkap Advanced Operations:**

1. **Model Post dengan Banyak Relationship**:
```php
<?php
// app/Models/Post.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'user_id', 'published'];

    /**
     * Post milik satu user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Post punya satu SEO record
     */
    public function seo(): HasOne
    {
        return $this->hasOne(Seo::class);
    }

    /**
     * Post punya banyak komentar
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->orderBy('created_at', 'desc');
    }

    /**
     * Post bisa punya banyak tag
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    /**
     * Post bisa punya banyak gambar
     */
    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    /**
     * Scope untuk post yang dipublikasikan
     */
    public function scopePublished($query)
    {
        return $query->where('published', true);
    }
}
```

2. **Controller dengan Advanced Relationship Querying**:
```php
<?php
// app/Http/Controllers/PostController.php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class PostController extends Controller
{
    /**
     * Tampilkan semua post dengan relationship
     */
    public function index(): View
    {
        $posts = Post::with(['user', 'comments', 'tags'])
            ->withCount(['comments', 'tags'])
            ->published()
            ->latest()
            ->paginate(10);

        return view('posts.index', compact('posts'));
    }

    /**
     * Tampilkan detail post dengan semua relationship
     */
    public function show(Post $post): View
    {
        $post->load(['user', 'comments.user', 'tags', 'images']);

        // Ambil post terkait berdasarkan tag
        $relatedPosts = Post::whereHas('tags', function ($query) use ($post) {
            $query->whereIn('tag_id', $post->tags->pluck('id'));
        })
        ->where('id', '!=', $post->id) // Jangan tampilkan post yang sama
        ->with(['user', 'tags'])
        ->limit(5)
        ->get();

        return view('posts.show', compact('post', 'relatedPosts'));
    }

    /**
     * Tambah post dengan relationship sekaligus
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id'
        ]);

        $post = auth()->user()->posts()->create([
            'title' => $request->title,
            'content' => $request->content,
            'published' => $request->has('published')
        ]);

        // Tambahkan tags jika ada
        if ($request->has('tags')) {
            $post->tags()->attach($request->tags);
        }

        // Buat SEO record otomatis
        $post->seo()->create([
            'meta_title' => $request->title,
            'meta_description' => Str::limit(strip_tags($request->content), 160)
        ]);

        return redirect()->route('posts.show', $post)
            ->with('status', 'Post berhasil dibuat!');
    }

    /**
     * Update post dan relationship-nya
     */
    public function update(Request $request, Post $post): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id'
        ]);

        $post->update([
            'title' => $request->title,
            'content' => $request->content,
            'published' => $request->has('published')
        ]);

        // Update tags
        $post->tags()->sync($request->tags ?? []);

        // Update SEO
        $post->seo()->updateOrCreate([
            'meta_title' => $request->title,
            'meta_description' => Str::limit(strip_tags($request->content), 160)
        ]);

        return redirect()->route('posts.show', $post)
            ->with('status', 'Post berhasil diperbarui!');
    }
}
```

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Relationships 🧰

### 12. 🔐 Lazy Eager Loading & Prevention

**Mengapa?** Terkadang kamu ingin menunda loading relationship sampai benar-benar dibutuhkan, atau mencegah loading yang tidak disengaja.

**Bagaimana?**

*   **Lazy Eager Loading**:
```php
// Load relationship secara manual setelah query
$posts = Post::all();

// Load relationship hanya jika dibutuhkan
if (request()->has('include_comments')) {
    $posts->load('comments');
}

// Load relationship dengan kondisi
$posts->load(['comments' => function ($query) {
    $query->where('approved', true);
}]);
```

*   **Prevent Lazy Loading** (untuk debugging):
```php
// Dalam AppServiceProvider boot method
use Illuminate\Database\Eloquent\Model;

Model::preventLazyLoading(!app()->isProduction());
```

*   **Automatic Eager Loading**:
```php
// Aktifkan automatic eager loading secara global
Model::shouldBeStrict(!app()->isProduction());
```

### 13. 💉 Relationship dengan Conditional Logic

**Prinsipnya: Jangan buat query yang tidak efisien!** Laravel menyediakan berbagai cara untuk mengatur relationship berdasarkan kondisi.

**Mengapa?** Karena tidak semua data perlu dimuat sepanjang waktu, dan kamu bisa menghemat resource dengan conditional loading.

**Bagaimana?**
*   **Conditional Relationship**:
    ```php
    public function comments(): HasMany
    {
        // Hanya tampilkan komentar yang disetujui jika bukan admin
        $query = $this->hasMany(Comment::class);
        
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            $query->where('approved', true);
        }
        
        return $query;
    }
    ```

*   **Conditional Eager Loading**:
    ```php
    $posts = Post::withConditional([
        'comments' => fn() => auth()->check(),
        'user' => true,
        'tags' => fn() => request()->has('include_tags')
    ])->get();
    ```

*   **Relationship Method dengan Parameter**:
    ```php
    public function commentsByUser($userId): HasMany
    {
        return $this->hasMany(Comment::class)->where('user_id', $userId);
    }

    // Penggunaan
    $userComments = $post->commentsByUser(auth()->id())->get();
    ```

**Contoh Lengkap Conditional Relationships:**

1. **Model dengan Conditional Relationships**:
```php
<?php
// app/Models/Post.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class Post extends Model
{
    use HasFactory;

    /**
     * Dapatkan komentar - hanya tampilkan yang disetujui untuk non-admin
     */
    public function comments(): HasMany
    {
        $query = $this->hasMany(Comment::class);
        
        if (!Auth::check() || !Auth::user()->isAdmin()) {
            $query->where('approved', true);
        }
        
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Dapatkan komentar tertentu berdasarkan user
     */
    public function commentsByUser($userId): HasMany
    {
        return $this->hasMany(Comment::class)
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc');
    }

    /**
     * Dapatkan user pemilik post
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Dapatkan komentar dengan paginasi berdasarkan status approval
     */
    public function commentsByApprovalStatus($approved = true, $perPage = 10): HasMany
    {
        $query = $this->hasMany(Comment::class)->where('approved', $approved);
        
        if (!Auth::check() || !Auth::user()->isAdmin()) {
            $query->where('approved', true);
        }
        
        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }
}
```

2. **Controller dengan Conditional Loading**:
```php
<?php
// app/Http/Controllers/PostController.php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PostController extends Controller
{
    public function show(Post $post, Request $request): View
    {
        // Load relationship secara conditional berdasarkan parameter
        $relations = [];
        
        if ($request->has('with_comments')) {
            $relations[] = 'comments';
        }
        
        if ($request->has('with_user')) {
            $relations[] = 'user';
        }
        
        if ($request->has('with_tags')) {
            $relations[] = 'tags';
        }
        
        if ($relations) {
            $post->load($relations);
        }

        // Atau load dengan kondisi
        $comments = $post->commentsByApprovalStatus(
            approved: $request->boolean('show_pending', false) ? false : true
        );

        return view('posts.show', compact('post', 'comments'));
    }

    public function apiShow(Post $post, Request $request)
    {
        $post->load(['user']);
        
        if ($request->has('include_comments')) {
            $commentStatus = $request->get('comment_status', 'approved');
            $commentsQuery = $post->comments();
            
            if ($commentStatus === 'pending') {
                $commentsQuery->where('approved', false);
            } elseif ($commentStatus === 'all' && auth()->user()?->isAdmin()) {
                // Tampilkan semua komentar jika admin
            } else {
                $commentsQuery->where('approved', true);
            }
            
            $post->setRelation('comments', $commentsQuery->get());
        }

        return response()->json($post);
    }
}
```

Relationship dengan conditional logic membuat kode kamu:
- **Lebih efisien**: Tidak memuat data yang tidak perlu
- **Lebih aman**: Membatasi akses data berdasarkan izin
- **Lebih fleksibel**: Bisa menyesuaikan dengan kebutuhan spesifik
- **Lebih bersih**: Kondisi logika ada di model, bukan di controller

### 13.5 🏗️ Relationship Scopes & Query Builder Integration

Ada berbagai teknik lanjutan untuk menggabungkan relationship dengan query builder:

**1. Relationship Scopes**:
```php
<?php
// app/Models/Post.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Post extends Model
{
    use HasFactory;

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Scope untuk post dengan jumlah komentar minimal
     */
    public function scopeWithMinComments(Builder $query, int $min): Builder
    {
        return $query->has('comments', '>=', $min);
    }

    /**
     * Scope untuk post dengan komentar dari user tertentu
     */
    public function scopeWithCommentsFromUser(Builder $query, int $userId): Builder
    {
        return $query->whereHas('comments', function ($subQuery) use ($userId) {
            $subQuery->where('user_id', $userId);
        });
    }
}

// Penggunaan
$popularPosts = Post::withMinComments(5)->get();
$userPosts = Post::withCommentsFromUser(auth()->id())->get();
```

**2. Complex Eager Loading with Subqueries**:
```php
// Ambil post dengan komentar terbaru dari masing-masing post
$posts = Post::with(['comments' => function ($query) {
    $query->orderBy('created_at', 'desc')->limit(5);
}])->get();

// Gunakan subquery untuk relationship condition
$posts = Post::whereExists(function ($query) {
    $query->select(DB::raw(1))
          ->from('comments')
          ->whereColumn('comments.post_id', 'posts.id')
          ->where('comments.approved', true);
})->get();
```

### 14. 👮 Relationship Performance Optimization

**Mengapa?** Karena performa aplikasi sangat penting, dan relationship sering menjadi sumber masalah performa jika tidak dioptimalkan dengan benar.

**Bagaimana?** 

**1. Gunakan Select Fields Spesifik**:
```php
// Buruk - ambil semua kolom
$posts = Post::with('user')->get();

// Baik - hanya ambil kolom yang dibutuhkan
$posts = Post::with(['user:id,name,email'])->get();

// Lebih baik - dengan hanya kolom tertentu dari relationship
$posts = Post::select('id', 'title', 'user_id', 'created_at')
    ->with(['user:id,name,email'])
    ->get();
```

**2. Gunakan Chunking untuk Data Besar**:
```php
// Proses banyak data tanpa memory overflow
Post::with('comments')->chunk(100, function ($posts) {
    foreach ($posts as $post) {
        // Proses masing-masing post
        foreach ($post->comments as $comment) {
            // Lakukan sesuatu
        }
    }
});
```

**3. Gunakan Model Events untuk Cache Invalidation**:
```php
<?php
// Dalam model Post

class Post extends Model
{
    protected static function booted()
    {
        static::saved(function ($post) {
            Cache::forget("post_{$post->id}_with_comments");
        });

        static::deleted(function ($post) {
            Cache::forget("post_{$post->id}_with_comments");
        });
    }
}
```

**Contoh Lengkap Performance Optimization:**

1. **Model dengan Optimized Relationships**:
```php
<?php
// app/Models/Post.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'user_id', 'published'];

    // Hanya ambil kolom yang dibutuhkan
    protected $visible = ['id', 'title', 'user_id', 'published', 'created_at'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id')
            ->select(['id', 'name', 'email']);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)
            ->select(['id', 'post_id', 'user_id', 'content', 'approved', 'created_at'])
            ->orderBy('created_at', 'desc');
    }

    /**
     * Dapatkan post dengan komentar, cache selama 10 menit
     */
    public function scopeWithCommentsCached(Builder $query, $id): Builder
    {
        $cacheKey = "post_{$id}_with_comments";
        
        return Cache::remember($cacheKey, 600, function () use ($query, $id) {
            return $query->with(['user:id,name', 'comments:id,post_id,content,created_at'])
                ->find($id);
        });
    }

    /**
     * Scope untuk post dengan jumlah komentar
     */
    public function scopeWithCommentsCount(Builder $query): Builder
    {
        return $query->withCount(['comments as approved_comments_count' => function ($subQuery) {
            $subQuery->where('approved', true);
        }]);
    }
}
```

2. **Controller dengan Optimasi Lengkap**:
```php
<?php
// app/Http/Controllers/OptimizedPostController.php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\View\View;

class OptimizedPostController extends Controller
{
    public function index(Request $request): View
    {
        $posts = Post::with(['user:id,name'])
            ->withCount(['comments as approved_comments_count' => function ($query) {
                $query->where('approved', true);
            }])
            ->when($request->has('search'), function ($query) use ($request) {
                $query->where('title', 'like', '%' . $request->search . '%');
            })
            ->when($request->has('user_id'), function ($query) use ($request) {
                $query->where('user_id', $request->user_id);
            })
            ->latest()
            ->paginate(15);

        return view('posts.index', compact('posts'));
    }

    public function show(int $id)
    {
        $post = Post::with(['user:id,name,email', 'comments.user:id,name'])
            ->find($id);

        if (!$post) {
            abort(404);
        }

        // Load comments secara terpisah jika jumlahnya besar
        if ($post->approved_comments_count > 50) {
            $comments = $post->comments()
                ->where('approved', true)
                ->with('user:id,name')
                ->paginate(10);
        } else {
            $comments = $post->comments->where('approved', true);
        }

        return view('posts.show', compact('post', 'comments'));
    }
}
```

---

## Bagian 5: Menjadi Master Relationships 🏆

### 15. ✨ Wejangan dari Guru

1.  **Pilih Tipe Relationship yang Tepat**: Gunakan `hasOne/belongsTo` untuk one-to-one, `hasMany/belongsTo` untuk one-to-many, dan `belongsToMany` untuk many-to-many.
2.  **Optimasi dengan Eager Loading**: Selalu gunakan `with()` untuk menghindari N+1 queries.
3.  **Gunakan Foreign Key Constraints**: Ini menjaga integritas data dan membantu performa.
4.  **Manfaatkan Relationship Method dengan Baik**: Beri nama yang jelas dan dokumentasikan fungsinya.
5.  **Gunakan Conditional Loading**: Jangan load relationship yang tidak dibutuhkan.
6.  **Hati-hati dengan Polymorphic Relationships**: Rancang dengan matang karena bisa membuat query kompleks.
7.  **Gunakan Caching untuk Relationship Berat**: Untuk data yang tidak berubah sering.

### 16. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Relationships di Laravel:

#### 📦 Tipe Relationships
| Tipe Relationship | Method | Deskripsi | Inverse |
|-------------------|--------|-----------|---------|
| One-to-One | `hasOne()` | Satu model memiliki satu model lain | `belongsTo()` |
| One-to-Many | `hasMany()` | Satu model memiliki banyak model lain | `belongsTo()` |
| Many-to-Many | `belongsToMany()` | Banyak model terkait dengan banyak model lain | `belongsToMany()` |
| Has One Through | `hasOneThrough()` | Akses model lewat model perantara | - |
| Has Many Through | `hasManyThrough()` | Akses banyak model lewat model perantara | - |

#### 🎯 Polymorphic Relationships
| Tipe | Method | Deskripsi |
|------|--------|-----------|
| One-to-One | `morphOne()` & `morphTo()` | Satu model bisa dimiliki oleh berbagai model |
| One-to-Many | `morphMany()` & `morphTo()` | Banyak model bisa dimiliki oleh berbagai model |
| Many-to-Many | `morphToMany()` & `morphedByMany()` | Banyak model terkait dengan banyak model dari berbagai jenis |

#### 🔧 Eager Loading
| Method | Fungsi |
|--------|--------|
| `with('relation')` | Load relationship untuk menghindari N+1 queries |
| `with(['rel1', 'rel2'])` | Load beberapa relationship sekaligus |
| `with('relation.nested')` | Load relationship bersarang |
| `load('relation')` | Load relationship setelah query (lazy loading) |
| `withCount('relation')` | Load jumlah data dari relationship |

#### 🛡️ Querying Relationships
| Method | Fungsi |
|--------|--------|
| `has('relation')` | Query berdasarkan keberadaan relationship |
| `whereHas('relation', $closure)` | Query dengan kondisi di relationship |
| `doesntHave('relation')` | Query untuk model tanpa relationship |
| `whereDoesntHave('relation', $closure)` | Query dengan kondisi negatif di relationship |

#### 📋 Many-to-Many Operations
| Method | Fungsi |
|--------|--------|
| `attach($id)` | Tambahkan record ke relationship |
| `detach($id)` | Hapus record dari relationship |
| `sync($ids)` | Sinkronisasi - hapus semua, tambahkan yang baru |
| `toggle($ids)` | Toggle - jika ada hapus, jika tidak ada tambah |
| `updateExistingPivot($id, $data)` | Update data di tabel pivot |

#### 🌐 Advanced Relationship Methods
| Method | Fungsi |
|--------|--------|
| `save($model)` | Simpan model terkait |
| `create($attributes)` | Buat dan simpan model terkait |
| `createMany($array)` | Buat dan simpan banyak model terkait |
| `associate($model)` | Set foreign key untuk belongsTo |
| `dissociate()` | Hapus foreign key untuk belongsTo |

### 17. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Eloquent Relationships, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Ingat, Relationships adalah jantung dari mengelola data terkait dalam aplikasi Laravel. Menguasainya berarti kamu sudah siap membangun aplikasi Laravel yang kompleks, terstruktur, dan performa tinggi.

Relationships bukan hanya tentang menghubungkan tabel, tapi tentang **membangun arsitektur data yang efisien dan mudah dipelihara**. Dengan pendekatan Laravel yang fleksibel, kamu bisa membangun sistem data yang kuat dan mudah dikelola.

Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku!

---

**Catatan Tambahan:**
Relationships adalah bagian penting dari pengembangan aplikasi web modern. Pastikan selalu memilih tipe relationship yang tepat, melakukan optimasi eager loading, dan menjaga integritas data dalam aplikasimu. Dengan pendekatan Laravel, relationships bisa menjadi alat yang sangat ampuh dalam mengembangkan aplikasi - kuat, efisien, dan tetap elegan. 🤝✨

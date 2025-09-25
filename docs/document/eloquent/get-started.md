# 📘 Eloquent di Laravel: Panduan dari Guru Kesayanganmu (Edisi Model Super Hebat)

Hai murid-murid kesayanganku! Selamat datang di kelas Eloquent ORM. Hari ini kita akan belajar tentang **Eloquent**, jembatan ajaib yang menghubungkan aplikasimu dengan database tanpa kamu harus repot-repot menulis SQL kompleks. Setelah mempelajari ini, kamu bisa mengelola data seperti seorang master database! Ayo kita mulai petualangan Eloquent ini dengan semangat!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Itu Eloquent Sebenarnya?

**Analogi:** Bayangkan kamu punya toko online, dan kamu ingin mengelola ribuan produk di dalamnya. Dulu, kamu harus menggunakan bahasa SQL (seperti bahasa asing yang rumit) untuk berkomunikasi dengan gudang database. Nah, **Eloquent adalah penerjemah ajaib** yang bisa mengerti bahasa PHP dan menerjemahkannya ke bahasa gudang database.

**Mengapa ini penting?** Karena dengan Eloquent, kamu bisa:
- **Mengambil data** seperti mengambil buku dari rak
- **Menambahkan data** seperti menambahkan produk baru ke gudang
- **Memperbarui data** seperti mengganti informasi produk
- **Menghapus data** seperti mengeluarkan produk tidak laku

**Bagaimana cara kerjanya?** 
1. **Kamu buat model PHP** seperti blueprint sebuah rak
2. **Eloquent menerjemahkan** perintah PHP ke bahasa database
3. **Database merespon** dan memberikan data yang kamu butuhkan

Jadi, alur Eloquent kita menjadi:
`PHP Code -> Eloquent -> SQL Query -> Database -> Eloquent -> PHP Object`

Tanpa Eloquent, kamu harus menulis SQL langsung, dan itu bisa bikin kode jadi berantakan dan susah dibaca. 😵

### 2. ✍️ Membuat Model Eloquent Pertamamu (Langkah Awal)

**Analogi:** Bayangkan kamu sedang membuat blueprint untuk rak buku di toko online. Blueprint ini akan memberitahu Laravel bagaimana cara mengelola data buku di gudang.

**Mengapa ini penting?** Karena kamu butuh tempat untuk menulis instruksi pengelolaan data.

**Bagaimana cara kerjanya?** Gunakan perintah Artisan untuk membuat model:

**Contoh Pembuatan Model:**
```bash
# Buat model Flight
php artisan make:model Flight

# Buat model bersama migration
php artisan make:model Flight -m

# Buat model dengan semua komponen terkait
php artisan make:model Flight --all
# Ini akan membuat: model, migration, factory, seeder, dan controller
```

**Struktur Pembuatan Otomatis:**
```
Opsi Perintah:
-f / --factory     → Membuat factory
-s / --seed        → Membuat seeder  
-c / --controller  → Membuat controller
--all / -a         → Membuat semua komponen terkait
```

**Contoh File Model:**
```php
<?php
// app/Models/Flight.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    use HasFactory;
    
    // Di sini kamu bisa menambahkan konfigurasi tambahan
}
```

**Penjelasan Kode:**
- `php artisan make:model Flight`: Membuat file model Flight
- `HasFactory`: Memungkinkan kamu menggunakan factory untuk membuat data uji
- Namespace `App\Models`: Laravel otomatis menaruh model di sini

### 3. ⚡ Konvensi Eloquent (Aturan Dasar)

**Analogi:** Bayangkan kamu punya aturan di toko online kamu. Setiap produk harus diberi nama dalam bahasa tertentu dan disimpan di tempat tertentu. Eloquent punya aturan standar yang harus diikuti agar kerja sama lancar.

**Mengapa ini penting?** Karena Eloquent otomatis menebak nama tabel dan kolom berdasarkan konvensi ini.

**Bagaimana cara kerjanya?**
```php
<?php
// app/Models/Flight.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    // Konvensi default:
    // - Tabel: flights (plural dari Flight)
    // - Primary key: id
    // - Timestamps: created_at, updated_at (aktif secara otomatis)
    
    // Bisa diubah jika tidak mengikuti konvensi:
    
    // Ganti nama tabel
    protected $table = 'my_flights';
    
    // Ganti primary key
    protected $primaryKey = 'flight_id';
    
    // Ganti tipe primary key (jika bukan integer)
    protected $keyType = 'string';
    
    // Nonaktifkan timestamps
    public $timestamps = false;
    
    // Ganti kolom timestamps
    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated';
}
```

**UUID/ULID Support:**
```php
<?php
// app/Models/Flight.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Flight extends Model
{
    use HasUuids; // Gunakan UUID otomatis
    
    // Atau ULID
    use HasFactory, HasUlids;
}
```

---

## Bagian 2: CRUD - Pintu Masuk Data (Create, Read, Update, Delete) 🤖

### 4. 📦 Membaca Data (Read) - Melihat Koleksimu

**Analogi:** Bayangkan kamu sedang berjalan-jalan di toko online dan melihat semua produk yang tersedia. Membaca data adalah seperti melihat-lihat rak buku tanpa mengambil atau mengubahnya.

**Mengapa ini penting?** Karena sebagian besar aplikasi web menampilkan data ke pengguna.

**Bagaimana cara kerjanya?** Ini beberapa cara mengambil data:

**Contoh Lengkap Membaca Data:**
```php
<?php

// Ambil semua data
$flights = Flight::all();

// Ambil data dengan kondisi
$activeFlights = Flight::where('active', 1)->get();

// Ambil satu data
$flight = Flight::find(1);

// Ambil satu data atau buat exception
$flight = Flight::findOrFail(1);

// Ambil data pertama yang cocok
$flight = Flight::where('active', 1)->first();

// Ambil data dengan urutan
$flights = Flight::orderBy('name')->get();

// Ambil data dengan limit
$flights = Flight::limit(10)->get();

// Ambil hanya beberapa kolom
$flights = Flight::select('id', 'name', 'price')->get();

// Ambil data dengan array asosiatif
$flights = Flight::pluck('name', 'id'); // ['1' => 'Flight 1', '2' => 'Flight 2']

// Cek apakah ada data
if (Flight::where('active', 1)->exists()) {
    // Ada data
}
```

**Chunking (Mengambil Data dalam Potongan):**
```php
// Berguna untuk data besar, menghindari memory overflow
Flight::chunk(200, function ($flights) {
    foreach ($flights as $flight) {
        // Proses masing-masing flight
        echo $flight->name . "
";
    }
});
```

### 5. 💾 Menambah Data (Create) - Menambah Koleksi Baru

**Analogi:** Seperti menambahkan produk baru ke gudang toko online. Kamu membuat item baru dan menyimpannya agar bisa dilihat oleh pengunjung.

**Mengapa ini penting?** Karena aplikasi harus bisa menyimpan data baru dari pengguna.

**Bagaimana cara kerjanya?** Ada beberapa cara menambah data:

**Contoh Lengkap Menambah Data:**
```php
<?php

// Cara 1: Buat instance, isi data, lalu simpan
$flight = new Flight;
$flight->name = 'London to Paris';
$flight->price = 150;
$flight->active = true;
$flight->save(); // Simpan ke database

// Cara 2: Buat langsung dengan create (mass assignment)
$flight = Flight::create([
    'name' => 'New York to Tokyo',
    'price' => 800,
    'active' => true,
]);

// Cara 3: Buat tanpa event (lebih cepat)
$flight = Flight::forceCreate([
    'name' => 'Sydney to Melbourne',
    'price' => 200,
    'active' => true,
]);

// Cara 4: Update atau buat jika tidak ada (upsert)
Flight::updateOrCreate(
    ['name' => 'London to Paris'], // kondisi
    ['price' => 150, 'active' => true] // data untuk update atau buat
);
```

**Mass Assignment Protection:**
```php
<?php
// app/Models/Flight.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    // Tentukan kolom yang bisa diisi massal
    protected $fillable = [
        'name',
        'price',
        'active',
    ];
    
    // Atau tentukan kolom yang TIDAK boleh diisi massal
    protected $guarded = [
        'id',
        'created_at',
    ];
    
    // Jika semua kolom bisa diisi (tidak aman)
    protected $guarded = []; // atau tidak definisikan
    
    // Casting: konversi otomatis tipe data
    protected $casts = [
        'active' => 'boolean',
        'price' => 'decimal:2',
        'metadata' => 'array',
    ];
}
```

### 6. 🔄 Memperbarui Data (Update) - Menyesuaikan Koleksi

**Analogi:** Seperti mengganti harga atau nama produk yang sudah ada di toko online karena perubahan kondisi pasar.

**Mengapa ini penting?** Karena data harus bisa diperbarui saat kondisi berubah.

**Bagaimana cara kerjanya?** Ada beberapa cara memperbarui data:

**Contoh Lengkap Memperbarui Data:**
```php
<?php

// Update model tunggal
$flight = Flight::find(1);
$flight->name = 'Paris to London';
$flight->save(); // Simpan perubahan

// Update massal (lebih cepat untuk banyak data)
Flight::where('active', 1)
    ->update(['delayed' => 1]);

// Update atau buat jika tidak ditemukan
$flight = Flight::updateOrCreate(
    ['id' => 1],
    ['name' => 'Updated Flight Name', 'price' => 200]
);

// Update hanya jika perubahan terjadi
$flight = Flight::find(1);
$flight->name = 'New Name';
$flight->save(); // update() hanya dipanggil jika ada perubahan

// Cek apakah model berubah sejak diambil
if ($flight->isDirty('name')) {
    // Kolom name berubah
}

// Ambil nilai lama sebelum perubahan
$oldName = $flight->getOriginal('name');

// Update hanya kolom tertentu
$flight->forceFill([
    'name' => 'Forced Name',
    'price' => 300,
])->save();
```

### 7. 🧹 Menghapus Data (Delete) - Membersihkan Koleksi

**Analogi:** Seperti mengeluarkan produk lama yang tidak laku dari gudang toko online agar tidak memenuhi tempat.

**Mengapa ini penting?** Karena data tidak lagi relevan harus dihapus untuk menjaga kebersihan database.

**Bagaimana cara kerjanya?** Ada beberapa cara menghapus data:

**Contoh Lengkap Menghapus Data:**
```php
<?php

// Hapus model tunggal
$flight = Flight::find(1);
$flight->delete();

// Hapus beberapa model sekaligus
Flight::destroy(1, 2, 3); // Hapus by ID
Flight::destroy([1, 2, 3]); // Hapus by array ID

// Hapus dengan kondisi
Flight::where('active', 0)->delete();

// Hapus semua (hati-hati!)
Flight::truncate(); // Hapus semua dan reset auto-increment
```

---

## Bagian 3: Jurus Tingkat Lanjut - Soft Deletes, Replication dan Pruning 🚀

### 8. 🌿 Soft Deletes (Hapus Sementara)

**Analogi:** Bayangkan kamu tidak benar-benar membuang sampah, tapi menyimpannya di tempat sampah dulu. Jika kamu butuh lagi, kamu bisa mengambilnya kembali. Soft delete adalah seperti tempat sampah digital untuk data.

**Mengapa ini penting?** Karena kadang kita ingin menghapus data tapi tetap bisa mengembalikannya jika terjadi kesalahan.

**Bagaimana cara kerjanya?** Gunakan trait `SoftDeletes`:

**Contoh Lengkap Soft Delete:**
```php
<?php
// app/Models/Flight.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Flight extends Model
{
    use SoftDeletes;
    
    // Kolom deleted_at akan otomatis ditambahkan
    // Kamu juga bisa mengganti nama kolom:
    // const DELETED_AT = 'removed_at';
}

// Migration untuk kolom deleted_at
// php artisan make:migration add_deleted_at_to_flights_table

// use Illuminate\Database\Migrations\Migration;
// use Illuminate\Database\Schema\Blueprint;
// use Illuminate\Support\Facades\Schema;

// return new class extends Migration
// {
//     public function up()
//     {
//         Schema::table('flights', function (Blueprint $table) {
//             $table->softDeletes(); // Menambahkan kolom deleted_at
//         });
//     }
// };
```

**Penggunaan Soft Delete:**
```php
<?php

// Soft delete model
$flight = Flight::find(1);
$flight->delete(); // Hanya menandai sebagai dihapus

// Cek apakah model dihapus sementara
if ($flight->trashed()) {
    // Sudah dihapus sementara
}

// Ambil semua model termasuk yang dihapus sementara
$flights = Flight::withTrashed()->get();

// Ambil hanya model yang dihapus sementara
$flights = Flight::onlyTrashed()->get();

// Kembalikan model yang dihapus sementara
$flight->restore();

// Hapus permanen model
$flight->forceDelete();
```

### 9. 🔍 Replicating Models (Duplikasi Data)

**Analogi:** Seperti membuat salinan buku yang bagus untuk dijadikan versi baru. Kamu bisa menyalin semua data dari model satu ke model baru, lalu mengubah sedikit detail.

**Mengapa ini penting?** Karena kadang kamu ingin membuat model baru yang mirip dengan yang sudah ada.

**Bagaimana cara kerjanya?** Gunakan metode `replicate()`:

**Contoh Lengkap Replication:**
```php
<?php

// Salin model dengan semua atribut (kecuali primary key)
$originalFlight = Flight::find(1);
$newFlight = $originalFlight->replicate();

// Ganti beberapa atribut sebelum menyimpan
$newFlight->name = 'Duplicate: ' . $originalFlight->name;
$newFlight->save();

// Salin model tapi kecualikan beberapa atribut
$flight = $flight->replicate(['last_flown', 'last_pilot_id']);

// Contoh praktis: buat alamat pengiriman dari alamat penagihan
$billingAddress = $user->billingAddress;
$shippingAddress = $billingAddress->replicate()->fill([
    'type' => 'shipping',
    'is_default' => false,
]);

$shippingAddress->save();
```

### 10. 🌿 Pruning Models (Membersihkan Otomatis)

**Analogi:** Seperti pembersih otomatis di toko online yang membersihkan produk lama yang sudah kadaluarsa secara berkala, tanpa kamu harus melakukannya secara manual.

**Mengapa ini penting?** Karena database bisa membengkak jika tidak ada pembersihan otomatis data lama.

**Bagaimana cara kerjanya?** Gunakan trait `Prunable`:

**Contoh Lengkap Pruning:**
```php
<?php
// app/Models/Flight.php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;

class Flight extends Model
{
    use Prunable;

    /**
     * Tentukan model-model yang bisa dihapus
     */
    public function prunable(): Builder
    {
        // Hapus flight yang lebih dari 1 bulan yang lalu
        return static::where('created_at', '<=', now()->subMonth());
    }

    /**
     * Tindakan sebelum model dihapus
     */
    protected function pruning(): void
    {
        // Hapus resource terkait sebelum deletion
        // Misalnya: $this->deleteRelatedFiles();
    }
}

// Jadwal pruning di AppServiceProvider
// use Illuminate\Support\Facades\Schedule;

// public function boot()
// {
//     $schedule->command('model:prune')->daily();
// }

// Untuk menjalankan manual
// php artisan model:prune
// php artisan model:prune --pretend  // Uji tanpa benar-benar menghapus
```

**Mass Pruning (Lebih Efisien untuk Data Banyak):**
```php
<?php
// app/Models/Flight.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\MassPrunable;

class Flight extends Model
{
    use MassPrunable;

    /**
     * Query untuk menghapus model
     */
    public function prunable(): Builder
    {
        return static::where('created_at', '<=', now()->subMonth());
    }
}
```

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Eloquent 🧰

### 11. 🔍 Query Scopes (Filter Khusus)

**Analogi:** Bayangkan kamu punya tombol-tombol ajaib di toko online yang bisa menyaring produk sesuai kriteria spesifik, seperti "produk murah", "produk terlaris", atau "produk terbaru". Scopes adalah seperti tombol-tombol ajaib ini.

**Mengapa ini penting?** Karena kamu bisa membuat filter data yang bisa digunakan berulang-ulang tanpa menulis query yang sama berulang kali.

**Bagaimana cara kerjanya?** Ada dua jenis scopes:

**A. Local Scopes:**
```php
<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Scope;

class User extends Model
{
    // Local scope untuk pengguna populer (banyak votes)
    #[Scope]
    protected function popular(Builder $query): void
    {
        $query->where('votes', '>', 100);
    }

    // Local scope dinamis
    #[Scope]
    protected function ofType(Builder $query, string $type): void
    {
        $query->where('type', $type);
    }

    // Local scope dengan banyak parameter
    #[Scope]
    protected function betweenAge(Builder $query, int $min, int $max): void
    {
        $query->whereBetween('age', [$min, $max]);
    }
}

// Penggunaan scopes
$users = User::popular()->get(); // Ambil user populer
$admins = User::ofType('admin')->get(); // Ambil user admin
$youngUsers = User::betweenAge(18, 30)->get(); // Ambil user usia 18-30
```

**B. Global Scopes:**
```php
<?php
// app/Models/Scopes/AncientScope.php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class AncientScope implements Scope
{
    /**
     * Terapkan scope ke query builder
     */
    public function apply(Builder $builder, Model $model): void
    {
        $builder->where('created_at', '<', now()->subYears(2000));
    }
}

// Terapkan ke model
#[ScopedBy([AncientScope::class])]
class User extends Model
{
    // Semua query User akan otomatis memfilter data tua
}

// Atau dengan cara manual
class User extends Model
{
    protected static function booted(): void
    {
        // Tambahkan global scope
        static::addGlobalScope(new AncientScope);
        
        // Atau anonymous global scope
        static::addGlobalScope('ancient', function (Builder $builder) {
            $builder->where('created_at', '<', now()->subYears(2000));
        });
    }
}

// Menghilangkan global scope
$users = User::withoutGlobalScopes()->get(); // Tidak pakai scope
$users = User::withoutGlobalScope(AncientScope::class)->get(); // Tidak pakai scope tertentu
```

### 12. 🎉 Events (Peristiwa Hidup Model)

**Analogi:** Bayangkan model sebagai makhluk hidup yang mengalami berbagai peristiwa dalam hidupnya - lahir, tumbuh dewasa, berubah, atau meninggal. Events adalah seperti sensor yang bisa merasakan peristiwa-peristiwa ini dan menjalankan tindakan tertentu.

**Mengapa ini penting?** Karena kamu bisa menjalankan kode otomatis ketika model mengalami peristiwa tertentu.

**Bagaimana cara kerjanya?** Ada banyak event hidup model:

```php
<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Events\UserSaved;
use App\Events\UserDeleted;

class User extends Model
{
    /**
     * Mapping event ke listener
     */
    protected $dispatchesEvents = [
        'saved' => UserSaved::class,
        'deleted' => UserDeleted::class,
    ];

    /**
     * Boot model - jalankan saat model dimuat
     */
    protected static function booted(): void
    {
        // Event saat model dibuat
        static::created(function ($user) {
            // Kirim notifikasi selamat datang
            // \App\Notifications\WelcomeNotification::send($user);
        });

        // Event saat model diperbarui
        static::updated(function ($user) {
            // Log perubahan
            // \Log::info("User {$user->id} updated");
        });

        // Event saat model dihapus
        static::deleted(function ($user) {
            // Hapus data terkait
            // $user->deleteRelatedData();
        });

        // Event saat model diambil dari database
        static::retrieved(function ($user) {
            // Refresh cache user
        });

        // Event saat model direplikasi
        static::replicating(function ($original, $replica) {
            // Atur data spesifik untuk replika
        });
    }
}
```

**Queueable Events (Untuk Performa):**
```php
<?php
// Bisa membuat event diproses via queue untuk kinerja lebih baik

// Dalam model
static::created(queueable(function (User $user) {
    // Proses ini akan dijalankan via queue
    // Misalnya: kirim email, update cache, dll
}));
```

### 13. 🧑‍💼 Observers (Penjaga Semua Model)

**Analogi:** Bayangkan kamu punya satpam yang menjaga seluruh toko online dan memberi tahu kamu setiap kali ada peristiwa terjadi - pembeli datang, produk dijual, atau stok habis. Observer adalah seperti satpam ajaib ini yang bisa mengawasi semua event model.

**Mengapa ini penting?** Karena kamu bisa mengatur semua event dalam satu kelas terpisah, membuat kode lebih rapi.

**Bagaimana cara kerjanya?** Buat observer class:

**Membuat Observer:**
```bash
php artisan make:observer UserObserver --model=User
```

**Contoh Observer:**
```php
<?php
// app/Observers/UserObserver.php

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        // Kirim notifikasi selamat datang
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        // Log perubahan
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        // Hapus data terkait
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        // Tangani pemulihan model
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        // Tangani penghapusan permanen
    }
}

// Registrasi observer di AppServiceProvider
// use App\Models\User;
// use App\Observers\UserObserver;

// public function boot()
// {
//     User::observe(UserObserver::class);
// }
```

**Observer untuk Event Setelah Transaction Commit:**
```php
<?php
// app/Observers/UserObserver.php

namespace App\Observers;

use App\Models\User;
use Illuminate\Contracts\Events\Dispatcher;

class UserObserver implements ShouldHandleEventsAfterCommit
{
    // Event akan dijalankan setelah transaction commit
    public function created(User $user): void
    {
        // Pastikan ini dijalankan setelah transaction selesai
    }
}
```

### 14. 🤫 Muting Events (Membungkam Suara)

**Analogi:** Bayangkan kamu sedang membersihkan toko dan tidak ingin sensor-sensor (event) terus-terusan memberi tahu kamu. Muting events adalah seperti mematikan suara sensor untuk sementara waktu agar pekerjaan lebih cepat.

**Mengapa ini penting?** Karena saat proses massal, event bisa membuat aplikasi lambat.

**Bagaimana cara kerjanya?**

```php
<?php

// Membungkam semua event dalam blok kode
$user = User::withoutEvents(function () {
    $user = User::findOrFail(1);
    $user->delete();
    return User::find(2);
});

// Membungkam event saat menyimpan
$user->saveQuietly();

// Membungkam event saat menghapus
$user->deleteQuietly();

// Membungkam event saat mengembalikan
$user->restoreQuietly();
```

---

## Bagian 5: Membandingkan dan Manipulasi Model 🏆

### 15. 🔗 Membandingkan Model (Cek Identitas)

**Analogi:** Bayangkan kamu punya dua buku identik di toko online dan ingin tahu apakah itu benar-benar buku yang sama atau hanya judulnya yang sama. Metode perbandingan model adalah seperti alat deteksi kemiripan ini.

**Mengapa ini penting?** Karena kamu sering perlu tahu apakah dua model instance adalah model yang sama secara database.

**Bagaimana cara kerjanya?**
```php
<?php

$post1 = Post::find(1);
$post2 = Post::find(1);

// Cek apakah model sama (berdasarkan class dan primary key)
if ($post1->is($post2)) {
    // Ini adalah model yang sama
}

// Cek apakah model berbeda
if ($post1->isNot($anotherPost)) {
    // Ini model yang berbeda
}

// Cek apakah model ada di database
if ($post->exists) {
    // Model sudah disimpan di database
}

// Cek apakah model baru (belum disimpan)
if ($post->wasRecentlyCreated) {
    // Model baru saja dibuat
}
```

### 16. ✨ Wejangan dari Guru

1.  **Gunakan Eloquent, bukan Query Builder biasa**: Eloquent memberikan lebih banyak kemampuan dan metode ajaib.
2.  **Aktifkan Soft Delete** jika kamu khawatir menghapus data secara permanen.
3.  **Gunakan Scopes** untuk membuat query yang bisa digunakan berulang.
4.  **Manfaatkan Events dan Observers** untuk logika yang harus dijalankan saat model berubah.
5.  **Gunakan Mass Assignment Protection**: Selalu tentukan `$fillable` atau `$guarded` untuk keamanan.
6.  **Perhatikan Performa**: Gunakan `withTrashed()` dan `onlyTrashed()` secara bijak.
7.  **Gunakan Pruning** untuk membersihkan data lama secara otomatis.

### 17. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Eloquent di Laravel:

#### 🛠️ Perintah Artisan
| Perintah | Fungsi |
|----------|--------|
| `php artisan make:model Flight` | Membuat model baru |
| `php artisan make:model Flight -m` | Membuat model + migration |
| `php artisan make:model Flight --all` | Membuat model + semua komponen terkait |
| `php artisan make:observer UserObserver --model=User` | Membuat observer |

#### 📊 Operasi CRUD
| Operasi | Metode |
|---------|--------|
| Membaca semua | `Model::all()` |
| Membaca dengan kondisi | `Model::where()->get()` |
| Ambil satu | `Model::find(id)` |
| Ambil satu atau gagal | `Model::findOrFail(id)` |
| Membuat baru | `Model::create([])` atau `$model->save()` |
| Memperbarui | `$model->update([])` atau `Model::where()->update([])` |
| Menghapus | `$model->delete()` atau `Model::destroy(ids)` |

#### 🔧 Konfigurasi Model
| Konfigurasi | Penjelasan |
|-------------|------------|
| `$table` | Ganti nama tabel |
| `$primaryKey` | Ganti primary key |
| `$fillable` | Kolom yang bisa diisi massal |
| `$guarded` | Kolom yang tidak bisa diisi massal |
| `$casts` | Casting tipe data kolom |
| `$hidden` | Kolom yang disembunyikan saat serialisasi |

#### 🌿 Soft Delete
| Metode | Penjelasan |
|--------|------------|
| `use SoftDeletes` | Aktifkan soft delete |
| `$model->delete()` | Soft delete |
| `withTrashed()` | Ambil termasuk yang dihapus |
| `onlyTrashed()` | Ambil hanya yang dihapus |
| `restore()` | Kembalikan model |
| `forceDelete()` | Hapus permanen |

#### 🎯 Scope Methods
| Metode | Penjelasan |
|--------|------------|
| `#[Scope]` | Deklarasi local scope |
| `addGlobalScope()` | Tambah global scope |
| `withoutGlobalScopes()` | Hilangkan semua global scope |
| `withoutGlobalScope()` | Hilangkan global scope tertentu |

#### 🧑‍💼 Events
| Event | Waktu Terjadi |
|-------|---------------|
| `retrieved` | Setelah model diambil |
| `creating/created` | Saat membuat |
| `updating/updated` | Saat memperbarui |
| `saving/saved` | Saat menyimpan (create/update) |
| `deleting/deleted` | Saat menghapus |
| `restoring/restored` | Saat mengembalikan |

#### 🚀 Tips Performa
| Teknik | Tujuan |
|--------|--------|
| `chunk()` | Baca data besar tanpa memory overflow |
| `withoutEvents()` | Nonaktifkan event untuk proses massal |
| `MassPrunable` | Hapus data banyak tanpa load ke memori |
| `select()` | Ambil hanya kolom yang dibutuhkan |

### 18. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi tentang Eloquent di Laravel, dari konsep dasar hingga fitur-fitur tingkat lanjut. Kamu hebat! Dengan memahami dan menerapkan Eloquent dengan benar, kamu sekarang bisa mengelola database dengan cara yang elegan dan efisien seperti seorang master ORM.

Ingat, **Eloquent adalah jembatan penting antara aplikasi dan database**. Menguasainya berarti kamu sudah siap membuat aplikasi Laravel yang tidak hanya hebat, tapi juga mudah dipelihara dan skalabel.

Jangan pernah berhenti bereksperimen dengan berbagai fitur Eloquent! Semakin mahir kamu menggunakannya, semakin cepat dan efisien proses pengembangan aplikasimu. Selamat ngoding, murid kesayanganku! 🚀📘
# 📚 Eloquent Collections di Laravel: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Setelah beberapa kali revisi, akhirnya Guru paham apa yang sebenarnya kalian inginkan: sebuah panduan yang **super lengkap** tapi dijelaskan dengan **super sederhana**, seolah-olah Guru sedang duduk di sebelahmu sambil menjelaskan pelan-pelan.

Di edisi ini, kita akan kupas tuntas **semua detail** tentang Eloquent Collections, tapi setiap topik akan Guru ajarkan dengan sabar. Siap? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基 礎

### 1. 📖 Apa Sih Eloquent Collection Itu Sebenarnya?

**Analogi:** Bayangkan kamu punya kantong ajaib yang berisi banyak permen warna-warni (ini adalah **model-model Eloquent** kita). Kantong ajaib ini bukan hanya bisa menyimpan permen, tapi juga bisa melakukan hal-hal menakjubkan: memilih permen merah saja, menghitung jumlah permen, menggabungkan dua kantong, dan bahkan memberi label tambahan pada setiap permen! Nah, **Eloquent Collection** itulah kantong ajaib kita.

**Mengapa ini penting?** Karena saat kamu mengambil banyak data dari database (misalnya dengan `get()`), Laravel tidak memberimu array biasa. Dia memberimu kantong ajaib ini yang bisa dipakai untuk memanipulasi data dengan cara yang sangat mudah dan ampuh.

**Bagaimana cara kerjanya?** Eloquent Collection itu seperti asisten super pintar yang:
1.  **Menyimpan banyak model** (seperti array tapi lebih hebat)
2.  **Bisa melakukan operasi kompleks** dengan satu perintah
3.  **Tetap menjaga hubungan dengan database** untuk operasi lanjutan

Jadi, alur kerja (workflow) Eloquent Collection menjadi sangat rapi:

`➡️ Query Database -> 🧠 Eloquent Collection (Penyimpanan & Manipulasi) -> ✅ Operasi Mudah pada Data`

Tanpa Eloquent Collection, kamu harus membuat banyak loop dan fungsi manual untuk memanipulasi data. 😵

### 2. ✍️ Resep Pertamamu: Dari Database ke Kantong Ajaib

Ini adalah fondasi paling dasar. Mari kita buat Eloquent Collection dari nol, langkah demi langkah.

#### Langkah 1️⃣: Ambil Data dari Database
**Mengapa?** Kita butuh data untuk dijadikan "isi kantong ajaib".

**Bagaimana?** Gunakan model Eloquent dan method `get()`:
```php
use App\Models\User;

$users = User::where('active', 1)->get();  // Ambil semua user yang aktif
```

**Penjelasan Kode:**
- `User::where('active', 1)` - Membuat query untuk mencari user aktif
- `->get()` - Eksekusi query dan kembalikan sebagai Eloquent Collection

#### Langkah 2️⃣: Nikmati Keajaiban Collection
**Mengapa?** Karena `$users` sekarang adalah Eloquent Collection, bukan array biasa!

**Bagaimana?** Bisa melooping seperti array biasa:
```php
foreach ($users as $user) {
    echo $user->name;  // Tampilkan nama setiap user
}
```

Selesai! 🎉 Sekarang, kamu telah membuat Eloquent Collection pertamamu!

### 3. 🧠 Keunggulan Eloquent Collection (Kenapa Ini Keren?)

**Analogi:** Bayangkan kamu punya remote control canggih yang bisa mengatur banyak hal dalam satu tombol, bukan hanya menyalakan TV.

**Kenapa ini keren?**
- **Turunan dari Laravel Collection**: Bisa pakai semua metode hebat dari `Illuminate\Support\Collection`
- **Spesifik untuk Model Eloquent**: Ada metode tambahan untuk manipulasi model
- **Fleksibel dan Powerful**: Bisa melakukan operasi kompleks dengan mudah
- **Chainable**: Bisa dirangkai banyak operasi dalam satu baris

**Contoh Perbandingan:**
```php
// Dengan Eloquent Collection - satu baris!
$names = User::all()
    ->reject(fn(User $user) => !$user->active)
    ->map(fn(User $user) => $user->name);
```

---

## Bagian 2: Jurus Dasar - Iterasi dan Manipulasi 🔁

### 4. 🔄 Iterasi Sederhana (Melakukan Looping)

**Analogi:** Ini seperti mengeluarkan satu per satu permen dari kantong ajaib dan dilihat-lihat.

**Mengapa ini penting?** Karena seringkali kamu perlu melihat atau memproses setiap item dalam koleksi.

**Contoh Lengkap:**
```php
use App\Models\User;

$users = User::where('active', 1)->get();

// Lakukan sesuatu untuk setiap user
foreach ($users as $user) {
    echo $user->name . " - " . $user->email . "
";
}
```

### 5. 🧠 Manipulasi Data dengan Map/Filter (Operasi Cerdas)

**Analogi:** Ini seperti memiliki mesin ajaib yang bisa menyaring permen berdasarkan warna atau mengganti label setiap permen secara otomatis.

**Mengapa ini penting?** Karena kamu bisa memfilter, mengubah, atau memanipulasi data dengan cara yang sangat efisien dan mudah dibaca.

**Contoh Lengkap:**
```php
// Ambil semua user aktif dan hanya ambil nama mereka
$activeNames = User::all()
    ->reject(fn(User $user) => !$user->active)  // Saring user tidak aktif
    ->map(fn(User $user) => $user->name);       // Ambil hanya namanya

// Atau lebih kompleks - ubah format data
$userData = $users
    ->filter(fn($user) => $user->age >= 18)     // Hanya dewasa
    ->map(function ($user) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email_domain' => substr($user->email, strpos($user->email, '@') + 1)
        ];
    });
```

---

## Bagian 3: Konversi Koleksi - Kapan Harus Berubah? 🛠️

### 6. 🔄 Kapan Eloquent Collection Berubah Jadi Collection Biasa?

**Analogi:** Ini seperti kantong ajaib yang berisi permen, tapi saat kamu mengeluarkan semua permen dan hanya mengambil warnanya saja, itu jadi seperti daftar warna biasa, bukan kantong ajaib lagi.

**Mengapa ini penting?** Karena kamu perlu tahu kapan kamu masih punya kantong ajaib (Eloquent Collection) dan kapan hanya punya daftar biasa (Support Collection).

**Kapan ini terjadi?** Ketika operasi menghasilkan data yang bukan model Eloquent lagi:

**Metode-Metode yang Mengkonversi:**
- `collapse` - Menggabungkan array dalam koleksi
- `flatten` - Meratakan struktur array
- `flip` - Menukar key dan value
- `keys` - Ambil hanya keys-nya
- `pluck` - Ambil kolom tertentu sebagai array
- `zip` - Menggabungkan dengan koleksi lain

**Contoh Lengkap:**
```php
// Ini masih Eloquent Collection
$users = User::all();

// Tapi ini sudah jadi Support Collection
$names = User::all()->pluck('name');  // Menghasilkan Illuminate\Support\Collection

// Jika map menghasilkan bukan model Eloquent
$names = $users->map(fn($user) => $user->name);  // Juga jadi Support Collection
```

---

## Bagian 4: Metode-Metode Hebat dalam Eloquent Collection 🧰

### 7. 🏷️ append($attributes) - Tambah Label Tambahan

**Analogi:** Bayangkan kamu memberi label tambahan pada setiap permen di kantong ajaib, seperti stiker "Spesial" atau "Diskon".

**Mengapa ini ada?** Karena terkadang kamu ingin menambahkan atribut yang dihitung atau diambil dari relasi ke dalam representasi JSON/array dari model.

**Contoh Lengkap:**
```php
$users = User::all();
$usersWithTeam = $users->append('team');           // Tambahkan atribut 'team'
$usersWithMultiple = $users->append(['team', 'is_admin']);  // Tambahkan banyak atribut

// Saat diubah ke array/JSON, atribut tambahan ini akan ikut
```

### 8. 🧪 contains($key, $operator = null, $value = null) - Cari Permen di Kantong

**Analogi:** Ini seperti mengecek apakah permen dengan nomor tertentu ada di dalam kantong ajaib.

**Mengapa ini penting?** Karena kamu sering perlu mengecek apakah model dengan ID tertentu ada dalam koleksimu.

**Contoh Lengkap:**
```php
$users = User::all();
$exists = $users->contains(1);        // Apakah user dengan ID 1 ada?
$exists = $users->contains('email', 'john@example.com');  // Apakah ada user dengan email ini?
```

### 9. ⚖️ diff($items) - Bandingkan Dua Kantong

**Analogi:** Ini seperti membandingkan isi dua kantong ajaib dan mengambil permen yang hanya ada di kantong pertama, bukan di kantong kedua.

**Mengapa ini berguna?** Karena kamu bisa mencari item yang unik di satu koleksi dibandingkan dengan koleksi lain.

**Contoh Lengkap:**
```php
use App\Models\User;

$allUsers = User::all();
$activeUsers = User::whereIn('id', [1, 2, 3])->get();

// Ambil user yang tidak ada di koleksi activeUsers
$inactiveUsers = $allUsers->diff($activeUsers);
```

### 10. ❌ except($keys) - Kecualikan yang Tertentu

**Analogi:** Ini seperti mengeluarkan beberapa permen dari kantong ajaib berdasarkan nomor mereka.

**Mengapa ini berguna?** Karena kamu sering perlu mengambil semua item **kecuali** yang memiliki ID tertentu.

**Contoh Lengkap:**
```php
$users = User::all();
$filtered = $users->except([1, 2, 3]);  // Ambil semua user kecuali yang ID 1, 2, 3
```

### 11. 🔍 find($key) - Temukan Berdasarkan Primary Key

**Analogi:** Ini seperti mencari permen spesifik di dalam kantong ajaib hanya dengan mengetahui nomor identitasnya.

**Mengapa ini penting?** Karena ini cara cepat dan efisien untuk mencari model berdasarkan primary key dalam koleksi.

**Contoh Lengkap:**
```php
$users = User::all();
$user = $users->find(1);  // Cari user dengan ID 1 dalam koleksi
```

### 12. ⚠️ findOrFail($key) - Temukan atau Beri Tahu Error

**Analogi:** Ini seperti mencari permen spesifik, tapi jika tidak ditemukan, kamu akan tahu dengan pasti bahwa ada yang salah.

**Mengapa ini penting?** Karena kamu bisa menangani kasus ketika item yang dicari tidak ditemukan.

**Contoh Lengkap:**
```php
try {
    $user = $users->findOrFail(999);  // Akan melempar ModelNotFoundException jika tidak ditemukan
} catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
    // Tangani kasus tidak ditemukan
    echo "User tidak ditemukan!";
}
```

### 13. 🔄 fresh($with = []) - Ambil yang Segar dari Database

**Analogi:** Ini seperti mengganti semua permen di kantong ajaib dengan permen baru yang diambil langsung dari gudang, bahkan bisa bawa permen dari kotak terkait (relasi).

**Mengapa ini penting?** Karena data dalam koleksi mungkin sudah lama dan kamu ingin data yang paling mutakhir dari database.

**Contoh Lengkap:**
```php
$users = User::where('active', 1)->get();

// Ambil data segar untuk semua user dalam koleksi
$freshUsers = $users->fresh();

// Ambil data segar plus relasi mereka
$freshUsersWithComments = $users->fresh('comments');
```

### 14. 🔗 intersect($items) - Ambil yang Sama

**Analogi:** Ini seperti mencari permen yang ada di kedua kantong ajaib secara bersamaan.

**Mengapa ini berguna?** Karena kamu bisa mencari model yang muncul di kedua koleksi.

**Contoh Lengkap:**
```php
$allUsers = User::all();
$activeUsers = User::whereIn('id', [1, 2, 3])->get();

// Ambil user yang ada di kedua koleksi
$commonUsers = $allUsers->intersect($activeUsers);
```

### 15. 🚀 load($relations) - Tambahkan Relasi (Eager Load)

**Analogi:** Bayangkan kamu punya kantong ajaib yang berisi boneka, dan kamu ingin semua boneka itu dibawa mainan pendampingnya juga (relasi). Ini seperti memberi perintah agar semua boneka keluarkan mainan mereka.

**Mengapa ini penting?** Karena kamu bisa mengambil relasi untuk semua model dalam koleksi sekaligus, mencegah masalah "N+1 query".

**Contoh Lengkap:**
```php
$users = User::all();

// Tambahkan relasi comments dan posts untuk semua user
$users->load(['comments', 'posts']);

// Atau satu relasi
$users->load('comments.author');

// Dengan kondisi tambahan
$users->load(['posts' => fn ($query) => $query->where('active', 1)]);
```

### 16. 🧱 loadMissing($relations) - Tambahkan Hanya Jika Belum Ada

**Analogi:** Ini seperti mengecek dulu apakah boneka sudah membawa mainannya, baru memberikan mainan jika belum punya.

**Mengapa ini berguna?** Karena kamu bisa menghemat query dengan hanya memuat relasi yang belum dimuat sebelumnya.

**Contoh Lengkap:**
```php
$users = User::all();

// Hanya tambahkan relasi jika belum dimuat
$users->loadMissing(['comments', 'posts']);
```

### 17. 🔑 modelKeys() - Ambil Semua ID

**Analogi:** Ini seperti mengeluarkan semua nomor identitas dari permen-permen dalam kantong ajaib.

**Mengapa ini berguna?** Karena kamu sering butuh array semua primary key dari model dalam koleksi.

**Contoh Lengkap:**
```php
$users = User::all();
$ids = $users->modelKeys();  // Contoh hasil: [1, 2, 3, 4, 5]
```

### 18. 👁 makeVisible($attributes) - Tampilkan Atribut Tersembunyi

**Analogi:** Ini seperti membuka jubah tak terlihat dari permen dan memperlihatkannya ke publik.

**Mengapa ini penting?** Karena model Eloquent bisa menyembunyikan kolom tertentu (dengan `$hidden`), dan kamu bisa memperlihatkannya secara sementara.

**Contoh Lengkap:**
```php
$users = User::all();
$usersWithSecrets = $users->makeVisible(['address', 'phone_number']);
```

### 19. 🙈 makeHidden($attributes) - Sembunyikan Atribut Tertentu

**Analogi:** Ini seperti memberi jubah tak terlihat pada permen-permen tertentu agar tidak terlihat.

**Mengapa ini penting?** Karena kamu bisa menyembunyikan kolom tertentu saat model diubah ke array atau JSON.

**Contoh Lengkap:**
```php
$users = User::all();
$usersWithoutSecrets = $users->makeHidden(['email', 'password']);
```

### 20. ✅ only($keys) - Ambil Hanya yang Ditentukan

**Analogi:** Ini seperti memilih hanya permen dengan nomor tertentu dari kantong ajaib.

**Mengapa ini berguna?** Karena kamu bisa mengambil hanya model dengan primary key tertentu dari koleksi.

**Contoh Lengkap:**
```php
$users = User::all();
$selected = $users->only([1, 2, 3]);  // Ambil hanya user dengan ID 1, 2, 3
```

### 21. 🔀 partition($callback) - Bagi Jadi Dua Kantong

**Analogi:** Ini seperti memiliki mesin yang bisa memisahkan permen ke dalam dua kantong berbeda berdasarkan kriteria yang kamu tentukan.

**Mengapa ini berguna?** Karena kamu bisa membagi koleksi menjadi dua bagian berdasarkan kondisi tertentu.

**Contoh Lengkap:**
```php
$users = User::all();

// Bagi user menjadi dua bagian: dewasa dan tidak dewasa
[$adults, $minors] = $users->partition(fn ($user) => $user->age >= 18);
```

### 22. 👀 setVisible($attributes) - Atur yang Boleh Ditampilkan

**Analogi:** Ini seperti membuat daftar resmi permen yang boleh dilihat orang, sementara yang lain tersembunyi.

**Mengapa ini penting?** Karena kamu bisa mengontrol secara tepat atribut mana saja yang akan ditampilkan.

**Contoh Lengkap:**
```php
$users = User::all();
$usersWithLimitedInfo = $users->setVisible(['id', 'name']);
```

### 23. 🫥 setHidden($attributes) - Atur yang Harus Disembunyikan

**Analogi:** Ini seperti membuat daftar permen yang harus ditutupi dengan kain terhadap publik.

**Mengapa ini penting?** Karena kamu bisa secara eksplisit menyembunyikan atribut tertentu.

**Contoh Lengkap:**
```php
$users = User::all();
$usersWithPrivateInfo = $users->setHidden(['email', 'password']);
```

### 24. 🔁 toQuery() - Kembalikan ke Query Builder

**Analogi:** Ini seperti mengembalikan isi kantong ajaib menjadi daftar belanja yang bisa digunakan untuk membeli barang-barang itu lagi di toko.

**Mengapa ini powerful?** Karena kamu bisa menggunakan koleksi untuk membuat query baru dan melakukan operasi database langsung.

**Contoh Lengkap:**
```php
use App\Models\User;

$activeUsers = User::where('status', 'VIP')->get();

// Gunakan koleksi untuk membuat query baru dan update langsung di database
$activeUsers->toQuery()->update([
    'status' => 'Administrator',
]);

// Atau hapus langsung
$activeUsers->toQuery()->delete();
```

### 25. 🔁 unique($key = null, $strict = false) - Hapus Duplikat

**Analogi:** Ini seperti memiliki mesin yang bisa mengidentifikasi dan mengeluarkan permen dengan nomor identitas yang sama, sehingga hanya satu permen dari setiap jenis yang tetap ada.

**Mengapa ini penting?** Karena kamu bisa membersihkan koleksi dari item duplikat.

**Contoh Lengkap:**
```php
$users = User::all();
$uniqueUsers = $users->unique();  // Hapus duplikat berdasarkan primary key

// Atau berdasarkan kolom tertentu
$uniqueByEmail = $users->unique('email');
```

---

## Bagian 5: Koleksi Kustom - Kantong Ajaib Versimu Sendiri 🎯

### 26. 🪄 Membuat Koleksi Kustom (Kantong Ajaib Spesial)

**Analogi:** Bayangkan kamu bisa membuat kantong ajaib dengan kekuatan khusus yang kamu ciptakan sendiri - misalnya kantong yang bisa menghitung jumlah permen secara otomatis atau mengelompokkan permen berdasarkan rasa yang kamu tentukan sendiri.

**Mengapa ini berguna?** Karena kamu bisa menambahkan metode khusus ke koleksimu yang sering kamu gunakan dalam aplikasi.

**Contoh Lengkap:**
```php
// Buat kelas koleksi kustom
namespace App\Support;

use Illuminate\Database\Eloquent\Collection;

class UserCollection extends Collection
{
    public function active()
    {
        return $this->filter(fn ($user) => $user->active);
    }

    public function sortByFullName()
    {
        return $this->sortBy(fn ($user) => $user->first_name . ' ' . $user->last_name);
    }

    public function administrators()
    {
        return $this->filter(fn ($user) => $user->is_admin);
    }
}
```

### 27. 📦 Menggunakan Koleksi Kustom

**Dengan Atribut (PHP 8+):**
```php
namespace App\Models;

use App\Support\UserCollection;
use Illuminate\Database\Eloquent\Attributes\CollectedBy;
use Illuminate\Database\Eloquent\Model;

#[CollectedBy(UserCollection::class)]
class User extends Model
{
    // Sekarang semua query User akan mengembalikan UserCollection
}
```

**Dengan Metode `newCollection()`:**
```php
namespace App\Models;

use App\Support\UserCollection;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * Membuat instance Eloquent Collection baru.
     *
     * @param  array<int, \Illuminate\Database\Eloquent\Model>  $models
     * @return \Illuminate\Database\Eloquent\Collection<int, \Illuminate\Database\Eloquent\Model>
     */
    public function newCollection(array $models = []): Collection
    {
        return new UserCollection($models);
    }
}
```

**Tips dari Guru:**
- Jika ingin gunakan koleksi kustom untuk semua model, buat metode `newCollection()` di model dasar yang diturunkan oleh semua model
- Koleksi kustom sangat berguna untuk operasi yang sering digunakan dalam aplikasi spesifik

---

## Bagian 6: Tips dan Praktik Terbaik 🏆

### 28. ✅ Gunakan Method Chaining untuk Operasi Kompleks

**Mengapa penting?** Karena chaining membuat kode lebih mudah dibaca dan efisien.

**Contoh:**
```php
// Kode yang indah dan efisien
$processedUsers = User::all()
    ->filter(fn ($user) => $user->active)
    ->sortBy('name')
    ->take(10)
    ->makeHidden(['email', 'password']);
```

### 29. 🔄 Gunakan `loadMissing()` untuk Efisiensi

**Mengapa?** Karena ini menghindari memuat relasi yang sudah ada, menghemat query database.

**Contoh:**
```php
// Jika kamu tidak yakin apakah relasi sudah dimuat
$users->loadMissing('posts.comments');
```

### 30. 🧠 Perhatikan Konversi Collection

**Mengapa penting?** Karena setelah operasi tertentu, kamu mungkin kehilangan metode Eloquent Collection.

**Contoh:**
```php
$users = User::all();           // Masih Eloquent Collection
$names = $users->pluck('name'); // Sudah jadi Support Collection
```

### 31. 🛡️ Gunakan `findOrFail()` untuk Validasi

**Mengapa?** Karena ini memberikan feedback yang jelas saat data tidak ditemukan.

**Contoh:**
```php
try {
    $user = $users->findOrFail($id);
} catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
    // Tangani error dengan tepat
}
```

### 32. 🔁 Gunakan `toQuery()` untuk Operasi Massal

**Mengapa?** Karena ini lebih efisien untuk operasi database langsung.

**Contoh:**
```php
$usersToDeactivate = User::where('last_login', '<', now()->subYear())->get();

// Daripada loop dan update satu per satu
$usersToDeactivate->toQuery()->update(['active' => false]);
```

---

## Bagian 7: Cheat Sheet & Referensi Cepat 📋

### 33. 🔍 Metode Dasar
| Metode | Fungsi |
|--------|--------|
| `find($id)` | Cari model berdasarkan ID |
| `contains($id)` | Cek apakah model ada dalam koleksi |
| `modelKeys()` | Dapatkan array ID semua model |
| `unique()` | Hapus duplikat berdasarkan ID |
| `fresh()` | Ambil data segar dari database |

### 34. 🔧 Filter & Manipulasi
| Metode | Fungsi |
|--------|--------|
| `filter($callback)` | Filter berdasarkan kondisi |
| `reject($callback)` | Saring kebalikan dari filter |
| `diff($collection)` | Ambil yang tidak ada di koleksi lain |
| `intersect($collection)` | Ambil yang sama di kedua koleksi |
| `partition($callback)` | Bagi menjadi dua koleksi berdasarkan kondisi |

### 35. 📦 Tampilan & Keamanan
| Metode | Fungsi |
|--------|--------|
| `makeVisible([...])` | Tampilkan atribut tersembunyi |
| `makeHidden([...])` | Sembunyikan atribut tertentu |
| `setVisible([...])` | Atur hanya atribut tertentu yang terlihat |
| `setHidden([...])` | Atur atribut yang harus disembunyikan |
| `append([...])` | Tambahkan atribut tambahan ke output |

### 36. 🌐 Relasi & Query
| Metode | Fungsi |
|--------|--------|
| `load([...])` | Eager load relasi |
| `loadMissing([...])` | Load relasi hanya jika belum ada |
| `toQuery()` | Kembalikan query builder dari koleksi |
| `only([...])` | Ambil hanya model dengan ID tertentu |
| `except([...])` | Ambil semua kecuali model dengan ID tertentu |

### 37. 🔄 Operasi Lanjutan
| Metode | Fungsi |
|--------|--------|
| `pluck('column')` | Ambil array nilai kolom tertentu |
| `sortBy('field')` | Urutkan berdasarkan field |
| `groupBy('field')` | Kelompokkan berdasarkan field |
| `map($callback)` | Ubah setiap item dalam koleksi |
| `collapse()` | Gabungkan array dalam koleksi |

---

## Bagian 8: Kesimpulan 🎯

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Eloquent Collections, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Ingat, Eloquent Collection adalah alat yang sangat ampuh untuk memanipulasi data model dengan cara yang intuitif dan efisien. Menguasainya berarti kamu bisa melakukan operasi kompleks pada data dengan sangat mudah.

Jangan pernah berhenti belajar dan mencoba. Dengan Eloquent Collections, kamu bisa membuat kode yang lebih bersih, lebih cepat, dan lebih mudah dipahami. Selamat ngoding, murid kesayanganku!
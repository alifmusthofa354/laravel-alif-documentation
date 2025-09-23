# 📘 Panduan Lengkap Eloquent Collections di Laravel

> **Catatan:** Dokumentasi ini ditulis dalam Bahasa Indonesia dan dilengkapi dengan contoh kode serta narasi setiap bagian untuk memudahkan pemahaman.

---

## 📌 Pendahuluan

Dalam Laravel, ketika Anda mengambil lebih dari satu model (misalnya melalui `get()` atau relasi), hasilnya akan berupa objek dari kelas `Illuminate\Database\Eloquent\Collection`. Kelas ini adalah turunan dari `Illuminate\Support\Collection`, sehingga Anda bisa menggunakan semua metode koleksi seperti `map`, `filter`, dan lainnya.

Selain itu, Eloquent Collection menyediakan metode tambahan yang berguna untuk bekerja dengan model-model Eloquent.

### 🔁 Iterasi Sederhana

Karena Eloquent Collection juga merupakan iterator, Anda bisa melooping koleksi seperti array biasa:

```php
use App\Models\User;

$users = User::where('active', 1)->get();

foreach ($users as $user) {
    echo $user->name;
}
```

### 🧠 Manipulasi Data dengan Map/Reduce

Eloquent Collection sangat powerful karena memungkinkan chaining operasi map/reduce secara intuitif:

```php
$names = User::all()
    ->reject(fn(User $user) => !$user->active)
    ->map(fn(User $user) => $user->name);
```

---

## 🛠️ Konversi Koleksi Eloquent

Sebagian besar metode Eloquent Collection mengembalikan instance baru dari Eloquent Collection itu sendiri. Namun, ada beberapa metode yang mengembalikan koleksi dasar (`Illuminate\Support\Collection`) jika tidak lagi berisi model-model Eloquent.

Metode-metode tersebut antara lain:
- `collapse`
- `flatten`
- `flip`
- `keys`
- `pluck`
- `zip`

Contoh:
```php
$collection = User::all()->pluck('name'); // Menghasilkan Illuminate\Support\Collection
```

Jika operasi `map` pada sebuah koleksi menghasilkan data yang bukan model Eloquent, maka hasilnya juga akan dikonversi ke koleksi dasar.

---

## 🧰 Metode-Metode yang Tersedia

Berikut adalah daftar lengkap metode-metode yang tersedia dalam Eloquent Collection beserta penjelasan dan contoh.

---

### 🏷️ append($attributes)

Menambahkan satu atau lebih atribut ke dalam setiap model dalam koleksi agar ditampilkan saat diubah ke array atau JSON.

```php
$users->append('team');
// Atau
$users->append(['team', 'is_admin']);
```

---

### 🧪 contains($key, $operator = null, $value = null)

Mengecek apakah model dengan primary key tertentu ada dalam koleksi.

```php
$users->contains(1); // true/false
```

---

### ⚖️ diff($items)

Mengembalikan model-model yang **tidak** ada di dalam koleksi `$items`.

```php
use App\Models\User;

$users = User::all();
$diffUsers = $users->diff(User::whereIn('id', [1, 2, 3])->get());
```

---

### ❌ except($keys)

Mengambil semua model **kecuali** dengan primary key tertentu.

```php
$filtered = $users->except([1, 2, 3]);
```

---

### 🔍 find($key)

Mencari model dengan primary key yang cocok.

```php
$user = $users->find(1);
```

---

### ⚠️ findOrFail($key)

Sama seperti `find()`, tetapi melempar exception jika tidak ditemukan.

```php
try {
    $user = $users->findOrFail(1);
} catch (ModelNotFoundException $e) {
    // Handle error
}
```

---

### 🔄 fresh($with = [])

Mengambil ulang data segar dari database untuk semua model dalam koleksi, termasuk eager loading relasi.

```php
$users = $users->fresh();
$users = $users->fresh('comments');
```

---

### 🔗 intersect($items)

Mengambil model-model yang juga ada di dalam koleksi `$items`.

```php
$result = $users->intersect(User::whereIn('id', [1, 2, 3])->get());
```

---

### 🚀 load($relations)

Eager load relasi untuk semua model dalam koleksi.

```php
$users->load(['comments', 'posts']);
$users->load('comments.author');
```

Dengan closure:
```php
$users->load(['comments', 'posts' => fn ($query) => $query->where('active', 1)]);
```

---

### 🧱 loadMissing($relations)

Hanya eager load jika relasi belum dimuat.

```php
$users->loadMissing(['comments', 'posts']);
```

---

### 🔑 modelKeys()

Mengembalikan array primary key dari semua model dalam koleksi.

```php
$ids = $users->modelKeys(); // Contoh: [1, 2, 3]
```

---

### 👁 makeVisible($attributes)

Menampilkan atribut yang biasanya disembunyikan di model.

```php
$users = $users->makeVisible(['address', 'phone_number']);
```

---

### 🙈 makeHidden($attributes)

Menyembunyikan atribut yang biasanya terlihat di model.

```php
$users = $users->makeHidden(['email', 'password']);
```

---

### ✅ only($keys)

Mengambil model hanya dengan primary key tertentu.

```php
$selected = $users->only([1, 2, 3]);
```

---

### 🔀 partition(callback)

Memecah koleksi menjadi dua bagian berdasarkan kondisi.

```php
$partition = $users->partition(fn ($user) => $user->age > 18);
```

---

### 👀 setVisible($attributes)

Menetapkan sementara atribut yang harus terlihat.

```php
$users = $users->setVisible(['id', 'name']);
```

---

### 🫥 setHidden($attributes)

Menetapkan sementara atribut yang harus disembunyikan.

```php
$users = $users->setHidden(['email', 'password']);
```

---

### 🔁 toQuery()

Mengembalikan query builder dengan kondisi `whereIn` pada primary key koleksi.

```php
use App\Models\User;

$users = User::where('status', 'VIP')->get();

$users->toQuery()->update([
    'status' => 'Administrator',
]);
```

---

### 🔁 unique($key = null, $strict = false)

Menghapus duplikasi berdasarkan primary key.

```php
$uniqueUsers = $users->unique();
```

---

## 🎯 Koleksi Kustom

Anda bisa menggunakan kelas koleksi kustom untuk model tertentu dengan menambahkan atribut `#[CollectedBy]` atau mendefinisikan metode `newCollection()`.

### 🪄 Menggunakan Atribut

```php
namespace App\Models;

use App\Support\UserCollection;
use Illuminate\Database\Eloquent\Attributes\CollectedBy;
use Illuminate\Database\Eloquent\Model;

#[CollectedBy(UserCollection::class)]
class User extends Model
{
    // ...
}
```

### 📦 Mendefinisikan newCollection()

```php
namespace App\Models;

use App\Support\UserCollection;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * Create a new Eloquent Collection instance.
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

> 💡 Jika ingin menggunakan koleksi kustom untuk semua model di aplikasi Anda, buat metode `newCollection()` di model dasar yang diturunkan oleh semua model.

---

## 🧠 Kesimpulan

Eloquent Collection adalah salah satu fitur kuat Laravel yang membuat manipulasi data model menjadi sangat fleksibel dan intuitif. Dengan menggabungkan kekuatan dari Laravel Collection dan metode-metode khusus Eloquent, Anda bisa melakukan operasi kompleks dengan mudah.

Jika Anda menggunakan koleksi secara intensif dalam aplikasi Anda, memahami metode-metode ini akan sangat membantu dalam efisiensi dan keterbacaan kode Anda.

--- 

**Penutup:**  
Dengan dokumentasi ini, Anda sekarang siap menggunakan Eloquent Collections secara maksimal dalam proyek Laravel Anda. Jangan ragu untuk bereksperimen dengan metode-metode yang telah dijelaskan. Selamat coding! 🧑‍💻✨
# 📦 Eloquent: Serialization: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Di dunia pembuatan API dan frontend, seringkali kita harus mengirimkan data dari database ke klien dalam bentuk **JSON**. Bayangkan kamu adalah seorang kurator museum, dan kamu harus "mengemas" pameran artefak ke dalam katalog digital yang bisa dilihat oleh pengunjung. Tapi kamu tidak ingin mengirimkan semua dokumen arsip rahasia atau catatan internal, kan? Kamu harus memilih dan memformat informasi yang bisa dilihat publik. Itulah **Eloquent Serialization** - alat ajaib Laravel untuk "mengemas" modelmu ke bentuk array atau JSON yang bisa dikirimkan dengan aman dan rapi!

Siap belajar bagaimana menjadi kurator data yang baik? Ayo kita mulai petualangan ini!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Eloquent Serialization Itu Sebenarnya?

**Analogi:** Bayangkan kamu adalah seorang penerbit buku. Kamu punya naskah panjang dan kompleks (ini adalah model Eloquent di database). Tapi ketika kamu ingin menerbitkan bukumu, kamu harus **mengemasnya** ke dalam bentuk yang bisa dibaca oleh pembaca: teks utuh, daftar isi, cover, dll. (ini adalah proses serialisasi ke JSON/array). Kamu tidak akan mencetak catatan editorial atau draf awalnya, kan? Serialization adalah proses "mencetak" naskahmu ke bentuk yang siap dikonsumsi.

**Mengapa ini penting?** Karena:
1.  **Kamu bisa mengontrol data yang dikirim** (contoh: tidak boleh kirim password!).
2.  **Format data bisa disesuaikan** (contoh: ubah format tanggal).
3.  **Relasi bisa disertakan atau disembunyikan**.
4.  **Kamu bisa tambahkan informasi tambahan** yang tidak ada di database.

**Bagaimana cara kerjanya?** Secara umum, alurnya seperti ini:
`➡️ Model Eloquent (di database) -> 🧰 Proses Serialization -> 📦 Array/JSON (untuk klien) -> ✅ Dikirim ke Frontend/API`

Tanpa Serialization yang tepat, kamu mungkin akan mengirimkan semua data mentah dari model, termasuk password, token, atau data internal yang tidak seharusnya diketahui klien - itu bisa sangat berbahaya!

### 2. ✍️ Resep Pertamamu: Serialisasi Sederhana dari Nol

Ini adalah fondasi paling dasar. Mari kita pelajari serialisasi sederhana dari nol, langkah demi langkah.

#### Langkah 1️⃣: Ambil Model Eloquent
**Mengapa?** Kita butuh data Eloquent yang akan dikonversi.

**Bagaimana?** Ambil model dari database seperti biasa.
```php
use App\Models\User;

$user = User::find(1); // Ambil user dengan ID 1
// atau
$user = User::with('posts')->first(); // Ambil user beserta post-nya
```

#### Langkah 2️⃣: Konversi ke Array (toArray)
**Mengapa?** Supaya kita bisa melihat struktur data dalam format PHP array biasa.

**Bagaimana?** Gunakan method `toArray()`.
```php
// app/Http/Controllers/UserController.php
use App\Models\User;

public function show($id)
{
    $user = User::find($id);
    $userArray = $user->toArray(); // Konversi model ke array
    return $userArray; // Kembalikan array (Laravel akan otomatis ubah ke JSON jika return dari route/controller)
}
```
**Penjelasan Kode:**
- `$user->toArray()`: Mengembalikan array dari semua atribut model *dan semua relasi* yang sudah dimuat.
- `with('posts')` akan membuat array menjadi nested: `['id' => 1, ..., 'posts' => [...]]`.

#### Langkah 3️⃣: Konversi ke JSON (toJson)
**Mengapa?** Karena biasanya API mengembalikan data dalam format JSON.

**Bagaimana?** Gunakan method `toJson()`.
```php
public function show($id)
{
    $user = User::find($id);
    return $user->toJson(); // Kembalikan JSON string
}
```
**Atau cara "jalan pintas":**
```php
public function show($id)
{
    $user = User::find($id);
    return $user; // Laravel otomatis akan panggil toJson() saat return model
}
```

#### Langkah 4️⃣: Hanya Atribut, Tanpa Relasi (attributesToArray)
**Mengapa?** Kadang kamu hanya butuh data utama, bukan seluruh relasinya.

**Bagaimana?** Gunakan method `attributesToArray()`.
```php
public function show($id)
{
    $user = User::with('posts')->find($id); // Misalnya relasi dimuat
    $userAttributes = $user->attributesToArray(); // Hanya atribut model, relasi tidak ikut
    return $userAttributes;
}
```
Output hanya: `{"id": 1, "name": "Budi", "email": "budi@email.com", ...}` (tanpa `posts`).

Selesai! 🎉 Sekarang kamu telah berhasil mengonversi model Eloquent ke bentuk array dan JSON yang bisa digunakan oleh frontend atau API lain!

### 3. ⚡ Perbedaan toArray vs attributesToArray vs toJson

**Analogi:** Jika model adalah sebuah "kotak misteri", maka:
*   `toArray()` = buka kotak dan lihat semua isinya, termasuk kotak-kotak kecil di dalamnya.
*   `attributesToArray()` = hanya lihat isi dasar dari kotak besar, tanpa kotak-kotak kecil.
*   `toJson()` = buatkan salinan semua isi kotak dalam format kertas yang bisa dikirim lewat pos (JSON).

**Mengapa ini penting?** Karena kamu harus tahu metode mana yang sesuai kebutuhanmu.

**Perbedaannya:**
*   **`toArray()`**: Mengembalikan array dari model *beserta semua relasi yang telah dimuat*.
*   **`attributesToArray()`**: Mengembalikan array dari model *hanya atribut utama*, tanpa relasi.
*   **`toJson()`**: Mengembalikan *string JSON* dari model (rekursif, termasuk relasi seperti `toArray`).

Contoh:
```php
$user = User::with('posts')->find(1);

// toArray() - termasuk relasi
$user->toArray(); 
// -> ["id" => 1, "name" => "Budi", "posts" => [...]]

// attributesToArray() - hanya atribut
$user->attributesToArray(); 
// -> ["id" => 1, "name" => "Budi"]

// toJson() - dalam bentuk JSON string
$user->toJson(); 
// -> '{"id":1,"name":"Budi","posts":[...]}' 
```

---

## Bagian 2: Mengontrol Isi "Kotak Misteri" - Visibilitas Atribut 🤖

### 4. 🔒 Mengontrol Atribut yang Ditampilkan (Hidden & Visible)

**Analogi:** Di museum, kamu memiliki artefak yang bisa dilihat publik dan artefak "rahasia" yang hanya bisa dilihat oleh kurator terpilih. Dalam serialization, kamu bisa menentukan atribut mana yang "publik" dan mana yang "rahasia".

**Mengapa ini kritis?** Karena kamu **tidak boleh** mengirimkan data sensitif seperti password, token, atau informasi internal ke API publik.

**Bagaimana?** Gunakan properti `$hidden` atau `$visible` di model.

#### A. Menggunakan `$hidden` - Atribut yang Disembunyikan:
```php
<?php
// app/Models/User.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    // Atribut-atribut ini tidak akan muncul di array/JSON
    protected $hidden = ['password', 'remember_token', 'email_verified_at'];
}
```

#### B. Menggunakan `$visible` - Atribut yang Ditampilkan:
```php
<?php
// app/Models/User.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    // Hanya atribut-atribut ini yang akan muncul di array/JSON
    protected $visible = ['id', 'name', 'email', 'created_at'];
}
```

**Catatan:** Jika kamu menentukan `$visible`, maka **hanya** atribut yang disebutkan di situ yang akan muncul. Jika tidak ada `$visible`, maka semua kecuali yang di `$hidden` akan muncul.

### 5. 🛠️ Menyembunyikan Atribut Secara Sementara (Runtime)

**Analogi:** Kadang kamu harus "menyembunyikan" artefak tertentu hanya untuk pengunjung spesial, bukan untuk semua orang.

**Mengapa ini berguna?** Karena kamu mungkin perlu menampilkan atau menyembunyikan atribut secara dinamis tergantung konteks (misalnya, untuk admin vs user biasa).

**Bagaimana?** Laravel menyediakan method-method untuk mengubah visibilitas sementara.

**Contoh Lengkap:**
```php
use App\Models\User;

// Ambil user
$user = User::find(1);

// 1. Tampilkan atribut yang biasanya tersembunyi
$withPassword = $user->makeVisible('password')->toArray();
// -> Akan menyertakan password

// 2. Sembunyikan atribut yang biasanya terlihat
$withoutEmail = $user->makeHidden('email')->toArray();
// -> Tidak akan menyertakan email

// 3. Tambahkan beberapa atribut ke yang terlihat
$withNameAndEmail = $user->mergeVisible(['name', 'email'])->toArray();
// -> Hanya akan menyertakan field yang sebelumnya visible + name dan email

// 4. Sembunyikan banyak atribut sekaligus
$basicInfo = $user->mergeHidden(['password', 'remember_token', 'email'])->toArray();
// -> Tidak menyertakan password, token, dan email

// 5. Atur ulang sepenuhnya atribut yang terlihat
$onlyIdAndName = $user->setVisible(['id', 'name'])->toArray();
// -> Hanya menyertakan id dan name

// 6. Atur ulang sepenuhnya atribut yang tersembunyi
$allVisible = $user->setHidden([])->toArray(); // Kosongkan hidden
// -> Menampilkan semua field, kecuali yang tidak ada di model
```

### 6. 🔄 Relasi Juga Bisa Disembunyikan

**Mengapa?** Karena relasi juga merupakan bagian dari "isi kotak", dan kamu mungkin tidak selalu ingin menyertakannya.

**Bagaimana?** Masukkan **nama method relasi** ke `$hidden`.

```php
<?php
// app/Models/User.php
class User extends Model
{
    protected $hidden = ['password', 'posts']; // Sembunyikan relasi posts

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}
```
Sekarang, meskipun kamu `with('posts')`, relasi `posts` tidak akan muncul di JSON karena disembunyikan.

---

## Bagian 3: Menambahkan Hiasan pada "Museum" - Atribut Tambahan 🚀

### 7. ➕ Menambahkan Atribut Tambahan (Appends)

**Analogi:** Di museum, kamu mungkin menambahkan informasi tambahan di samping artefak, seperti "Usia artefak ini 500 tahun" atau "Ditemukan di Mesir". Ini adalah informasi yang tidak tertulis langsung di artefak, tapi ditambahkan untuk memberikan konteks.

**Mengapa ini penting?** Karena seringkali kamu ingin menampilkan informasi yang dihitung dari data yang ada, tapi tidak disimpan langsung di database (misalnya: apakah user adalah admin, jumlah like, status akun).

**Bagaimana?** Gunakan **Accessor** dan masukkan ke `$appends`.

#### A. Buat Accessor:
```php
<?php
// app/Models/User.php
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Model
{
    // Tambahkan ke $appends agar otomatis disertakan
    protected $appends = ['is_admin', 'full_name'];

    // Method accessor untuk is_admin
    protected function isAdmin(): Attribute
    {
        return new Attribute(
            get: fn () => $this->role === 'admin', // Kembalikan true/false
        );
    }

    // Method accessor untuk full_name
    protected function fullName(): Attribute
    {
        return new Attribute(
            get: fn () => $this->first_name . ' ' . $this->last_name, // Gabungkan nama
        );
    }
}
```

#### B. Hasilnya:
Sekarang ketika kamu `toArray()` atau `toJson()`, atribut `is_admin` dan `full_name` akan otomatis muncul di hasil akhir!

```php
$user = User::find(1);
print_r($user->toArray());
// Output:
// [
//   'id' => 1,
//   'name' => 'Budi',
//   ...,
//   'is_admin' => true,  // Ditambahkan oleh accessor
//   'full_name' => 'Budi Santoso'  // Ditambahkan oleh accessor
// ]
```

### 8. ✨ Menambahkan Atribut Tambahan Secara Runtime

**Analogi:** Kadang kamu ingin menambahkan informasi tambahan hanya untuk kunjungan spesial ke museum, bukan untuk semua pengunjung.

**Mengapa ini berguna?** Karena kamu bisa menyesuaikan atribut yang ditambahkan secara dinamis tergantung konteks.

**Bagaimana?** Gunakan method `append`, `mergeAppends`, atau `setAppends`.

**Contoh:**
```php
$user = User::find(1);

// 1. Tambahkan satu atribut tambahan
$withStatus = $user->append('account_status')->toArray();

// 2. Tambahkan beberapa atribut tambahan
$withExtra = $user->mergeAppends(['account_status', 'last_login'])->toArray();

// 3. Atur ulang sepenuhnya atribut yang akan ditambahkan
$onlyCalculated = $user->setAppends(['is_admin'])->toArray();
```

### 9. 📅 Serialisasi Tanggal (Format Tanggal)

**Analogi:** Di museum, kamu mungkin ingin menampilkan tanggal penemuan artefak dalam format yang mudah dibaca, bukan dalam format teknis seperti "YYYY-MM-DD HH:MM:SS".

**Mengapa ini penting?** Karena format tanggal default mungkin tidak sesuai dengan kebutuhan frontend atau standar API kamu.

**Bagaimana?** Kamu bisa mengaturnya di beberapa level:

#### A. Format Global untuk Semua Tanggal:
```php
<?php
// app/Models/User.php atau base model
use DateTimeInterface;

class User extends Model
{
    // Ubah format semua tanggal di model ini
    protected function serializeDate(DateTimeInterface $date): string
    {
        return $date->format('Y-m-d H:i:s'); // Atau format lain seperti 'd/m/Y'
    }
}
```

#### B. Format Per Atribut Tertentu:
```php
<?php
// app/Models/User.php
class User extends Model
{
    protected function casts(): array
    {
        return [
            'birthday' => 'date:Y-m-d',        // Hanya tanggal
            'created_at' => 'datetime:Y-m-d H:i:s', // Tanggal dan waktu
            'updated_at' => 'datetime:Y-m-d H:i:s',
        ];
    }
}
```

---

## Bagian 4: Trik-Trik Lanjutan Serialization 🧰

### 10. 🔗 Serialization dan Relasi (Hubungan Eloquent)

**Analogi:** Dalam pameran museum, kamu mungkin memiliki "ruang utama" (model) dan "ruang pelengkap" (relasi). Ketika kamu membuat katalog, kamu bisa memilih apakah akan menyertakan informasi dari ruang pelengkap atau tidak.

**Mengapa ini penting?** Karena kamu harus mengontrol kapan dan bagaimana relasi muncul di dalam hasil serialization.

**Bagaimana?** Gunakan eager loading (`with`) dan `$hidden` untuk relasi.

```php
// Controller
$user = User::with('posts', 'profile')->find(1); // Muat relasi
return $user->toArray(); // Semua relasi akan muncul, kecuali yang disembunyikan

// Di model
class User extends Model
{
    protected $hidden = ['posts']; // Sembunyikan posts dari serialization
}
```

### 11. 📦 Serialization Koleksi (Banyak Model Sekaligus)

**Analogi:** Jika model adalah "satu artefak", maka koleksi adalah "satu ruangan penuh artefak". Serialization koleksi menghasilkan array dari banyak "katalog artefak".

**Mengapa ini penting?** Karena kamu sering perlu mengirim banyak data sekaligus (misalnya, daftar semua user).

**Bagaimana?** Gunakan `toArray()` atau `toJson()` pada koleksi.
```php
$users = User::all(); // Ambil semua user
return $users->toArray(); // Kembalikan array dari semua user
// Atau langsung return dari route
Route::get('/users', fn() => User::all()); // Laravel otomatis to json
```

### 12. 🎨 Serialization dan API Resources (Alternatif Lebih Canggih)

**Analogi:** Jika Serialization standar adalah "katalog cetak biasa", maka **API Resources** adalah "buku katalog edisi mewah" dengan desain dan informasi yang sangat spesifik.

**Mengapa?** Karena API Resources memberikan kontrol penuh atas bentuk JSON yang dihasilkan, sangat berguna untuk API kompleks.

**Bagaimana?** Gunakan `php artisan make:resource` dan gunakan resource class.

```php
// Buat resource
// php artisan make:resource UserResource

// Gunakan di controller
use App\Http\Resources\UserResource;

return new UserResource(User::find(1)); // Lebih fleksibel dari toArray()
```
> **Catatan:** Ini adalah topik terpisah, tapi saling terkait erat dengan serialization.

---

## Bagian 5: Menjadi Master Serialization Eloquent 🏆

### 13. ✨ Wejangan dari Guru

1.  **Jaga Keamanan**: Jangan pernah kirim password, token, atau data sensitif secara default. Gunakan `$hidden`!
2.  **Gunakan Accessor untuk Data Kalkulasi**: Jika kamu perlu mengirim nilai yang dihitung dari data lain, gunakan accessor + `$appends`.
3.  **Format Tanggal Konsisten**: Gunakan `casts` atau `serializeDate` untuk membuat format tanggal konsisten.
4.  **Kontrol Relasi**: Gunakan `$hidden` untuk relasi dan pastikan eager loading saat perlu.
5.  **Pertimbangkan API Resources**: Jika serialization standar terasa terbatas, API Resources adalah langkah lanjut yang sangat powerful.
6.  **Testing adalah Kunci**: Cek hasil serialization-mu di browser atau Postman untuk memastikan output sesuai harapan.

### 14. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk Serialization Eloquent:

#### 🔄 Dasar-dasar Serialization
| Method | Fungsi |
|--------|--------|
| `$model->toArray()` | Serialize model + relasi ke array |
| `$model->attributesToArray()` | Serialize hanya atribut ke array |
| `$model->toJson()` | Serialize model + relasi ke JSON string |
| `(string) $model` | Alias untuk toJson() |

#### 🔒 Kontrol Visibilitas
| Fungsi | Di Model | Sementara |
|--------|----------|-----------|
| Sembunyikan atribut | `protected $hidden = [...]` | `makeHidden()`, `mergeHidden()`, `setHidden()` |
| Hanya tampilkan ini | `protected $visible = [...]` | `makeVisible()`, `mergeVisible()`, `setVisible()` |

#### ➕ Atribut Tambahan
| Fungsi | Deskripsi |
|--------|-----------|
| Buat accessor | `protected function attributeName(): Attribute` |
| Tambahkan otomatis | `protected $appends = [...]` |
| Tambahkan runtime | `append()`, `mergeAppends()`, `setAppends()` |

#### 📅 Format Tanggal
| Fungsi | Level |
|--------|-------|
| `serializeDate()` | Global per model |
| `casts` dengan `date:format` atau `datetime:format` | Per atribut |

#### 📦 Koleksi
| Method | Fungsi |
|--------|--------|
| `$collection->toArray()` | Serialize semua model di koleksi ke array |
| `$collection->toJson()` | Serialize semua model ke JSON |
| `return Model::all()` | Laravel otomatis ke JSON saat return dari route |

### 15. 🎯 Kesimpulan

Luar biasa! 🌟 Kamu sudah menyelesaikan seluruh materi Serialization Eloquent, dari yang paling dasar sampai yang paling rumit. Sekarang kamu tahu bagaimana "mengemas" data Eloquent ke bentuk yang aman dan sesuai untuk dikirim ke API atau frontend. Kamu bisa menjadi kurator data yang handal! Serialization adalah fondasi penting dalam pembuatan API yang baik dan aman.

Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku!
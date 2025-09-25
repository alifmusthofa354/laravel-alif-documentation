# 📘 Eloquent API Resources: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Di dunia pembuatan API, ada saatnya kamu harus memberikan data dari model ke klien (misalnya aplikasi frontend), tapi kamu tidak ingin memberikan **semua** informasi. Bayangkan kamu adalah seorang juru masak restoran, dan kamu harus menyajikan hidangan. Kamu tidak akan memberikan semua bahan mentahnya, kan? Kamu harus "menyajikan" hidangan itu dengan cantik dan hanya menyediakan yang perlu disantap. Itulah **Eloquent API Resources** - alat ajaib Laravel untuk "menyajikan" data modelmu ke bentuk JSON yang indah dan terstruktur!

Siap belajar bagaimana menyajikan makanan API-mu dengan cantik? Ayo kita mulai petualangan ini!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Eloquent API Resources Itu Sebenarnya?

**Analogi:** Bayangkan kamu adalah seorang pramusaji restoran fine dining. Pelanggan memesan "Nasi Goreng Spesial". Kamu tidak akan bawa semua bahan ke meja (beras, minyak, bawang, dll), kan? Kamu akan **menyajikan** nasi gorengnya dalam piring cantik, dengan hiasan, dan mungkin tambahan sayuran tergantung pelanggan (misalnya, hanya untuk pelanggan VIP). Inilah yang dilakukan **API Resources** - mereka "menyajikan" data modelmu ke bentuk JSON yang sesuai dengan kebutuhan klien.

**Mengapa ini penting?** Karena:
1.  **Kamu bisa filter data yang ditampilkan** (contoh: password tidak perlu dikirim ke frontend).
2.  **Format data bisa disesuaikan** (contoh: ubah format tanggal).
3.  **Relasi bisa disertakan atau tidak**, tergantung kebutuhan.
4.  **Kamu bisa tambahkan metadata tambahan** (contoh: informasi pagination).

**Bagaimana cara kerjanya?** Secara umum, alurnya seperti ini:
`➡️ Model Eloquent -> 👮 Eloquent Resource -> 📦 JSON (Terstruktur) -> ✅ Dikirim ke Klien`

Tanpa API Resources, kamu mungkin hanya memanggil `Model::find($id)->toJson()` dan kirim semua data mentah. Itu berantakan dan tidak aman!

### 2. ✍️ Resep Pertamamu: Buat Resource dari Nol

Ini adalah fondasi paling dasar. Mari kita buat resource pertama dari nol, langkah demi langkah.

#### Langkah 1️⃣: Buat Resource Class (Si Pramusaji)
**Mengapa?** Kita butuh "resep" untuk menyajikan data model.

**Bagaimana?** Gunakan Artisan command untuk buat class resource.
```bash
php artisan make:resource UserResource
```
Perintah ini akan membuat file di `app/Http/Resources/UserResource.php`.

#### Langkah 2️⃣: Definisikan Bagaimana Data Disajikan (Method `toArray`)
**Mengapa?** Kita harus tentukan bagaimana data mentah dari model akan "dipresentasikan" ke klien.

**Bagaimana?** Buka `app/Http/Resources/UserResource.php` dan isi method `toArray`.
```php
<?php
// app/Http/Resources/UserResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email, // Hati-hati! Jangan kirim password!
            'created_at' => $this->created_at->format('Y-m-d H:i:s'), // Format tanggal
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
```
**Penjelasan Kode:**
- `$this` merujuk ke instance model `User` yang dilewatkan saat membuat resource.
- Kita memilih hanya field yang aman dan perlu dikirimkan.
- Kita bisa ubah format data (seperti format tanggal).

#### Langkah 3️⃣: Gunakan Resource di Route/Controller (Panggil Pramusaji)
**Mengapa?** Supaya saat ada permintaan ke API, kita tidak kirim model mentah, tapi data yang sudah "disajikan".

**Bagaimana?** Di route atau controller, kembalikan instance resource.
```php
// routes/web.php atau routes/api.php
use App\Http\Resources\UserResource;
use App\Models\User;

Route::get('/user/{id}', function (string $id) {
    $user = User::findOrFail($id); // Ambil model dari database
    return new UserResource($user); // Kembalikan resource yang sudah "disajikan"
});
```
Output JSON akan mengikuti struktur yang kamu tentukan di `toArray`.

Selesai! 🎉 Sekarang kamu telah berhasil menyajikan data user dalam bentuk JSON yang terstruktur dan aman!

### 3. ⚡ Resource vs Model (Perbedaan Mendasar)

**Analogi:** Jika model adalah "bahan baku di dapur", maka resource adalah "hidangan siap saji di meja pelanggan".

**Mengapa ini penting?** Karena kamu harus tahu kapan harus menggunakan yang mana.

**Perbedaannya:**
*   **Model**: Mewakili data mentah dari database. Semua field biasanya ada. Digunakan untuk query dan manipulasi data.
*   **Resource**: Hanya mewakili data yang akan **dikirim ke klien**. Tidak semua field dari model harus ditampilkan.

Contoh:
```php
// Jika kamu kirim model langsung (buruk!)
return User::find(1); 
// -> {"id": 1, "name": "Budi", "email": "budi@email.com", "password": "...", ...}

// Jika kamu kirim via resource (baik!)
return new UserResource(User::find(1));
// -> {"id": 1, "name": "Budi", "email": "budi@email.com", "created_at": "...", "updated_at": "..."}
```
Perhatikan bagaimana password tidak ikut terkirim!

---

## Bagian 2: Resource Collections - Menyajikan Banyak Hidangan Sekaligus 🤖

### 4. 📦 Apa Itu Resource Collections?

**Analogi:** Bayangkan kamu melayani "All You Can Eat Buffet". Kamu tidak menyajikan satu-satu hidangan, tapi kamu bawakan piring besar yang berisi banyak hidangan yang sudah disusun rapi. Inilah **Resource Collections** - mereka menyajikan banyak data sekaligus dengan format JSON terstruktur dan konsisten.

**Mengapa ini keren?** Karena kamu bisa menampilkan banyak data (seperti daftar semua user) dalam satu response, sambil tetap menjaga struktur dan bisa menambahkan metadata (seperti informasi pagination).

**Bagaimana?** Gunakan `UserResource::collection()` atau buat collection resource khusus.

**Contoh Sederhana:**
```php
use App\Http\Resources\UserResource;
use App\Models\User;

Route::get('/users', function () {
    $users = User::all(); // Ambil semua user
    return UserResource::collection($users); // Kembalikan sebagai collection
});
```

### 5. 🛠️ Membuat Resource Collection Khusus

**Mengapa?** Karena kadang kamu butuh informasi tambahan di level koleksi, seperti pagination links, total jumlah data, dll.

**Bagaimana?** Gunakan Artisan command dengan flag `--collection`.
```bash
php artisan make:resource UserCollection --collection
```

**Contoh Implementasi:**
```php
<?php
// app/Http/Resources/UserCollection.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class UserCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection, // Data utama dari collection
            'links' => [
                'self' => 'link-ke-collection-ini',
            ],
            'meta' => [
                'total' => $this->collection->count(), // Info tambahan
            ],
        ];
    }
}
```

**Penggunaannya:**
```php
Route::get('/users', function () {
    $users = User::all();
    return new UserCollection($users); // Pakai collection resource khusus
});
```
Output akan mengikuti struktur yang kamu tentukan di class `UserCollection`.

### 6. 🏷️ Menjaga Key Koleksi (Preserve Keys)

**Analogi:** Bayangkan kamu menyajikan menu makanan, dan kamu ingin nomor item tetap sesuai dengan nomor aslinya di database (bukan reset jadi 0, 1, 2...). 

**Mengapa ini penting?** Kadang kamu butuh key koleksi untuk tetap sama (misalnya ID user menjadi key), agar lebih mudah diolah oleh klien.

**Bagaimana?** Gunakan properti `$preserveKeys` di resource class biasa.
```php
<?php
// app/Http/Resources/UserResource.php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public $preserveKeys = true; // Aktifkan fitur ini
}

// Penggunaan
Route::get('/users', function () {
    $users = User::all()->keyBy('id'); // Buat koleksi dengan ID sebagai key
    return UserResource::collection($users); // Key akan tetap terjaga
});
```
Output:
```json
{
  "1": { "id": 1, "name": "Budi", ... },
  "2": { "id": 2, "name": "Siti", ... }
}
```

---

## Bagian 3: Menyajikan Relasi dengan Indah - Hubungan Data 🚀

### 7. 🔗 Menyertakan Relasi dalam Resource (Eager Load)

**Analogi:** Jika kamu menyajikan "Nasi Goreng Spesial", kamu mungkin juga ingin menyertakan "kerupuk" yang selalu menyertainya. Sama halnya, ketika menampilkan user, kamu sering ingin tampilkan postingannya juga.

**Mengapa ini penting?** Karena klien sering butuh data tambahan. Tapi kamu harus hati-hati agar tidak terjadi "N+1 query problem"!

**Bagaimana?** Gunakan resource untuk relasi juga, dan pastikan relasinya sudah di-eager load di controller.

**Contoh:**
```php
// app/Http/Resources/UserResource.php
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        // Sertakan posts, gunakan PostResource untuk formatnya
        'posts' => PostResource::collection($this->whenLoaded('posts')),
        'created_at' => $this->created_at->format('Y-m-d H:i:s'),
    ];
}
```

```php
// routes/web.php - Controller
use App\Http\Resources\UserResource;
use App\Models\User;

Route::get('/user/{id}', function (string $id) {
    $user = User::with('posts')->findOrFail($id); // Eager load posts
    return new UserResource($user); // Kembalikan resource
});
```
**Penjelasan:**
- `PostResource::collection(...)`: Gunakan resource untuk menyajikan koleksi relasi.
- `$this->whenLoaded('posts')`: Hanya sertakan posts jika relasinya sudah diload (mencegah N+1!).

### 8. ✨ Helper Conditional untuk Relasi & Atribut

**Analogi:** Kadang kamu hanya menyajikan "kerupuk" jika pelanggan memang memesan nasi goreng "spesial", atau menyajikan "menu rahasia" hanya untuk pelanggan VIP.

**Mengapa ini penting?** Untuk menyaring data yang ditampilkan berdasarkan kondisi, seperti hak akses pengguna atau apakah relasi sudah diload.

**Bagaimana?** Laravel menyediakan helper seperti `when`, `whenLoaded`, `whenCounted`, dll.

#### A. Conditional Attributes (when, whenNotNull, whenHas):
```php
// app/Http/Resources/UserResource.php
use Illuminate\Http\Request;

public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        'email' => $this->email,
        // Sertakan role hanya jika pengguna adalah admin
        'role' => $this->when($request->user()?->isAdmin(), $this->role),
        // Sertakan bio hanya jika tidak null
        'bio' => $this->whenNotNull($this->bio),
        // Sertakan avatar hanya jika field avatar ada di model
        'avatar' => $this->whenHas('avatar'),
    ];
}
```

#### B. Conditional Relationships (whenLoaded, whenCounted, whenAggregated):
```php
// app/Http/Resources/UserResource.php
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        // Sertakan posts hanya jika sudah diload
        'posts' => PostResource::collection($this->whenLoaded('posts')),
        // Sertakan jumlah posts jika sudah dihitung (menggunakan loadCount)
        'posts_count' => $this->whenCounted('posts'),
        // Sertakan rata-rata nilai jika sudah dihitung
        'average_rating' => $this->whenAggregated('reviews', 'rating', 'avg'),
    ];
}
```

**Contoh Controller untuk whenCounted:**
```php
Route::get('/user/{id}', function (string $id) {
    $user = User::with('posts')->findOrFail($id);
    $user->loadCount('posts'); // Hitung jumlah post sekali di awal
    return new UserResource($user);
});
```

### 9. 🔄 Pivot Attributes & Many-to-Many Relationships

**Analogi:** Bayangkan kamu menyajikan "Daftar Pesanan" dan kamu juga ingin sertakan informasi tambahan dari "tabel perantara", seperti tanggal kadaluarsa keanggotaan atau harga spesial yang diberikan.

**Mengapa ini penting?** Karena tabel pivot dalam relasi many-to-many sering menyimpan data penting yang relevan.

**Bagaimana?** Gunakan `whenPivotLoaded` atau `whenPivotLoadedAs`.

```php
// app/Http/Resources/RoleResource.php
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        // Tampilkan tanggal kadaluarsa hanya jika relasi pivot dimuat
        'expires_at' => $this->whenPivotLoaded('role_user', function () {
            return $this->pivot->expires_at->format('Y-m-d H:i:s');
        }),
    ];
}
```

---

## Bagian 4: Menghias dan Mengatur Respon API-mu 🧰

### 10. 📦 Pembungkusan Data (Wrapping) dan Format JSON

**Analogi:** Bayangkan kamu mengemas hidangan dalam kotak cantik sebelum dikirim ke pelanggan. Ini adalah "bantuan" agar klien tahu bahwa isi kotak adalah "data" yang diminta, tidak hanya data mentah.

**Mengapa ini penting?** Karena banyak standar API (seperti JSON:API) mengharapkan data dibungkus dalam key `data`.

**Bagaimana?** Laravel otomatis membungkus resource dalam key `data`.

**Output Default:**
```json
{
  "data": {
    "id": 1,
    "name": "Budi",
    "email": "budi@example.com"
  }
}
```

**Menonaktifkan Wrapping (jika perlu):**
```php
// app/Providers/AppServiceProvider.php
use Illuminate\Http\Resources\Json\JsonResource;

public function boot(): void
{
    JsonResource::withoutWrapping(); // Hapus pembungkusan otomatis
}
```
**Output tanpa wrapping:**
```json
{
  "id": 1,
  "name": "Budi",
  "email": "budi@example.com"
}
```

### 11. 📊 Pagination dengan API Resources

**Analogi:** Jika kamu menyajikan "Buku Menu Panjang", kamu tidak akan berikan semuanya sekaligus, tapi dalam bentuk "halaman-halaman", lengkap dengan tombol "sebelumnya", "berikutnya", dll.

**Mengapa ini penting?** Karena mengirim ribuan data sekaligus bisa berat untuk klien dan server. Pagination membuat API lebih cepat dan bisa diatur limitnya.

**Bagaimana?** Gunakan resource collection dengan paginator.

**Contoh:**
```php
// routes/web.php
use App\Http\Resources\UserCollection;
use App\Models\User;

Route::get('/users', function () {
    $users = User::paginate(10); // Ambil 10 user per halaman
    return new UserCollection($users); // Kembalikan collection dengan pagination
});
```

**Output akan otomatis berisi:**
```json
{
  "data": [ /* ... array user ... */ ],
  "links": {
    "first": "http://...",
    "last": "http://...",
    "prev": null,
    "next": "http://..."
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 10,
    "path": "http://...",
    "per_page": 10,
    "to": 10,
    "total": 100
  }
}
```

### 12. 🏷️ Metadata Tambahan & Response Header

**Analogi:** Kamu bisa menyertakan "kartu informasi" tambahan bersama hidangan, atau memberi label khusus pada kotak pengiriman.

**Mengapa ini penting?** Karena kadang kamu butuh menyertakan info tambahan seperti versi API, timestamp, atau header khusus untuk keamanan.

**Bagaimana?**

#### A. Menambahkan Metadata (via `with` atau `additional`):
```php
// Di dalam resource class
class UserResource extends JsonResource
{
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'version' => '1.0',
                'timestamp' => now()->toISOString(),
            ],
        ];
    }
}

// Atau menambahkan dinamis dari controller
return User::find(1)
    ->toResource()
    ->additional(['meta' => ['custom' => 'value']]);
```

#### B. Menambahkan Header (via `withResponse` atau chaining `response()`):
```php
// Di dalam resource class
class UserResource extends JsonResource
{
    public function withResponse(Request $request, JsonResponse $response): void
    {
        $response->header('X-Response-Version', '1.0')
                 ->header('X-Response-Timestamp', now()->toISOString());
    }
}

// Atau dari controller
return User::find(1)
    ->toResource()
    ->response()
    ->header('X-Custom-Header', 'Some-Value');
```

---

## Bagian 5: Menjadi Master API Resources 🏆

### 13. ✨ Wejangan dari Guru

1.  **Gunakan Resources untuk Konsistensi**: Jadikan API Resources sebagai standar untuk semua response JSON.
2.  **Eager Load & Gunakan `whenLoaded`**: Ini penting untuk mencegah N+1 Query dan membuat API lebih cepat.
3.  **Manfaatkan Helper Conditional**: Jangan ragu pakai `when`, `whenLoaded`, dll. untuk membuat kode bersih dan efisien.
4.  **Gunakan Helper `toResource` & `toResourceCollection`**: Laravel menyediakan helper untuk memudahkan.
5.  **Pahami Wrapping**: Ketahui kapan dan mengapa kamu perlu wrapping atau tidak.
6.  **Test API-mu**: Gunakan Postman atau tools sejenis untuk verifikasi response.

### 14. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk Eloquent API Resources:

#### 📦 Membuat Resources
| Perintah | Fungsi |
|----------|--------|
| `php artisan make:resource UserResource` | Membuat single resource |
| `php artisan make:resource UserCollection --collection` | Membuat collection resource |
| `UserResource::collection($data)` | Membuat collection dari single resource |
| `Model::toResource()` | Helper untuk single resource |
| `Collection::toResourceCollection()` | Helper untuk collection resource |

#### 🎨 Conditional Attributes
| Fungsi | Kegunaan |
|--------|----------|
| `$this->when($condition, $value)` | Tambahkan atribut jika kondisi benar |
| `$this->whenNotNull($value)` | Tambahkan atribut jika nilainya tidak null |
| `$this->whenHas('field')` | Tambahkan atribut jika field ada di model |
| `$this->mergeWhen($condition, [...])` | Tambahkan beberapa atribut jika kondisi benar |

#### 🔗 Conditional Relationships
| Fungsi | Kegunaan |
|--------|----------|
| `$this->whenLoaded('relation')` | Tambahkan relasi jika sudah diload |
| `$this->whenCounted('relation')` | Tambahkan jumlah relasi jika sudah dihitung |
| `$this->whenAggregated('relation', 'field', 'function')` | Tambahkan hasil agregasi |
| `$this->whenPivotLoaded('pivot_table', fn)` | Tambahkan atribut pivot jika tabel pivot dimuat |

#### 📊 Pagination
| Fungsi | Hasil |
|--------|--------|
| `Model::paginate()` | Membuat paginator |
| `new CollectionResource(Model::paginate())` | Resource collection dengan pagination info |

#### 📦 Wrapping
| Perintah | Fungsi |
|----------|--------|
| `JsonResource::withoutWrapping()` | Hapus pembungkusan otomatis di AppServiceProvider |

#### 🏷️ Metadata & Header
| Fungsi | Tempat |
|--------|--------|
| `with()` | Di resource class untuk data tambahan |
| `withResponse()` | Di resource class untuk header |
| `additional()` | Di controller untuk menambahkan data dinamis |
| `response()->header()` | Di controller untuk header |

### 15. 🎯 Kesimpulan

Luar biasa! 🌟 Kamu sudah menyelesaikan seluruh materi Eloquent API Resources, dari yang paling dasar sampai yang paling rumit. Sekarang kamu tahu bagaimana membuat response API yang indah, konsisten, dan efisien. Kamu bisa menyajikan data seperti seorang juru masak profesional! Ingat, API Resources adalah alat yang sangat ampuh untuk membuat API-mu lebih rapi dan mudah dipahami oleh klien.

Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku!
# 📘 Eloquent API Resources

Dokumentasi ini menjelaskan **Eloquent API Resources** di Laravel secara lengkap dalam **Bahasa Indonesia**. 
Setiap bab memiliki narasi penjelasan, contoh kode, dan ikon agar lebih mudah dan ramah dibaca. 🚀

## 🌟 Pendahuluan
Ketika membangun API, seringkali kita memerlukan lapisan transformasi antara **model Eloquent** dan **JSON response** yang dikirim ke klien. Misalnya:
- Menampilkan atribut tertentu hanya untuk beberapa pengguna (mis. admin). 👥
- Selalu menyertakan hubungan (relationships) tertentu di JSON. 🔗

**Eloquent Resource classes** memudahkan transformasi ini dengan cara yang terstruktur dan dapat dikustomisasi dibandingkan sekadar memanggil `toJson()` pada model/collection.

**Narasi singkat:** gunakan resource untuk memisahkan logika presentasi (bagaimana data ditampilkan) dari model dan controller. Ini membantu konsistensi dan maintainability API Anda.

---

## ⚡ Menghasilkan Resource
Untuk membuat resource tunggal:

```bash
php artisan make:resource UserResource
```

Secara default, file akan dibuat di `app/Http/Resources` dan akan mewarisi `Illuminate\Http\Resources\Json\JsonResource`.

Untuk membuat resource collection (yang mewakili kumpulan model):

```bash
php artisan make:resource User --collection
# atau
php artisan make:resource UserCollection
```

Resource collection mewarisi `Illuminate\Http\Resources\Json\ResourceCollection`.

**Narasi:** perintah di atas membantu scaffold class yang siap dikembangkan — mulai dari `toArray()` sampai ke method tambahan seperti `with()` atau `withResponse()`.

---

## 📂 Resource Collections
Resource collections bertugas mengubah koleksi model menjadi struktur JSON yang sesuai (seringkali termasuk meta atau links).

Contoh sederhana (mengembalikan seluruh user sebagai resource collection):

```php
use App\Http\Resources\UserResource;
use App\Models\User;

Route::get('/users', function () {
    return UserResource::collection(User::all());
});
```

Atau bisa lebih ringkas menggunakan helper pada koleksi Eloquent:

```php
return User::all()->toResourceCollection();
```

**Narasi:** gunakan collection resources saat Anda ingin menambahkan metadata atau link yang relevan untuk keseluruhan kumpulan data (mis. pagination info, total counts, dsb.).

---

## 🧭 Gambaran Umum Konsep
Resource class mewakili satu model dan mendefinisikan bagaimana model itu dipetakan ke array (yang nantinya di-JSON-kan).

Contoh `UserResource` sederhana:

```php
<?php

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
            'email' => $this->email,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
```

Penggunaan di route/controller:

```php
use App\Http\Resources\UserResource;
use App\Models\User;

Route::get('/user/{id}', function (string $id) {
    return new UserResource(User::findOrFail($id));
});
```

Atau menggunakan model helper `toResource` (convention-based):

```php
return User::findOrFail($id)->toResource();
```

**Narasi:** resources mem-proxy properti dan method ke model sehingga Anda bisa mengakses `$this->id`, `$this->relation`, dsb. dengan mudah.

---

## 🛠️ Custom Resource Collection
Jika Anda perlu menambahkan meta/links khusus pada koleksi, buat class collection sendiri:

```php
php artisan make:resource UserCollection
```

Contoh implementasinya:

```php
<?php

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
            'data' => $this->collection,
            'links' => [
                'self' => 'link-value',
            ],
        ];
    }
}
```

Pengembalian dari route:

```php
use App\Http\Resources\UserCollection;
use App\Models\User;

Route::get('/users', function () {
    return new UserCollection(User::all());
});
```

**Narasi:** membuat collection resource memungkinkan Anda untuk mengontrol struktur atas (top-level) dari hasil koleksi (mis. menambahkan `links` atau `meta` tertentu).

---

## 🔑 Mempertahankan Key Koleksi
Secara default, Laravel mereset key koleksi menjadi urutan numerik. Jika ingin mempertahankan key asli, set properti `$preserveKeys` pada kelas resource:

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Indicates if the resource's collection keys should be preserved.
     *
     * @var bool
     */
    public $preserveKeys = true;
}
```

Contoh penggunaan:

```php
Route::get('/users', function () {
    return UserResource::collection(User::all()->keyBy->id);
});
```

**Narasi:** berguna ketika key koleksi memiliki arti (mis. ID yang disimpan sebagai key) dan Anda ingin mempertahankan mapping tersebut di JSON output.

---

## 🤝 Relasi dan Resource
Untuk menyertakan relasi pada resource, gunakan resource relasi (singular) atau collection dari resource relasi:

```php
use App\Http\Resources\PostResource;

/**
 * Transform the resource into an array.
 */
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        'email' => $this->email,
        'posts' => PostResource::collection($this->posts),
        'created_at' => $this->created_at,
        'updated_at' => $this->updated_at,
    ];
}
```

Untuk menambahkan relasi **hanya jika sudah diload**, gunakan `whenLoaded`:

```php
'posts' => PostResource::collection($this->whenLoaded('posts')),
```

**Narasi:** `whenLoaded` membantu menghindari N+1 query — controller atau service Anda mengontrol eager loading, resource hanya menampilkan relasi jika sudah tersedia.

---

## 📦 Data Wrapping (Pembungkusan Data)
Secara default, Laravel membungkus outermost resource dalam key `data`:

```json
{
  "data": [
    { "id": 1, "name": "Eladio Schroeder Sr.", "email": "therese28@example.com" },
    { "id": 2, "name": "Liliana Mayert", "email": "evandervort@example.com" }
  ]
}
```

Untuk menonaktifkan wrapping (mis. ingin output datar), panggil `withoutWrapping` pada `JsonResource`, biasanya di `AppServiceProvider`:

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Resources\Json\JsonResource;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        JsonResource::withoutWrapping();
    }
}
```

> Catatan: `withoutWrapping` hanya mempengaruhi outermost resource, bukan `data` yang Anda tambahkan sendiri di resource collection.

**Narasi:** gunakan pembungkusan bila mengikuti spesifikasi API (mis. JSON:API) atau ketika konsumen API Anda mengharapkan struktur `data` tertentu.

---

## 📊 Pagination
Untuk mengembalikan koleksi yang dipaginasi:

```php
use App\Http\Resources\UserCollection;
use App\Models\User;

Route::get('/users', function () {
    return new UserCollection(User::paginate());
});
```

Atau menggunakan helper pada paginator:

```php
return User::paginate()->toResourceCollection();
```

Paginated response otomatis berisi `data`, `links`, dan `meta` (yang berisi informasi paginator seperti `current_page`, `last_page`, `per_page`, `total`, dsb.).

### ✨ Mengkustomisasi Informasi Pagination
Definisikan method `paginationInformation` di resource Anda untuk mengubah `links`/`meta` default:

```php
/**
 * Customize the pagination information for the resource.
 *
 * @param  \Illuminate\Http\Request  $request
 * @param  array $paginated
 * @param  array $default
 * @return array
 */
public function paginationInformation($request, $paginated, $default)
{
    $default['links']['custom'] = 'https://example.com';

    return $default;
}
```

**Narasi:** ini berguna jika Anda perlu menambahkan link tambahan (mis. dokumentasi, filter links) atau meta info yang relevan dengan UI/consumer Anda.

---

## ⚙️ Atribut Kondisional
Gunakan helper `when`, `whenNotNull`, `whenHas` untuk menambahkan atribut berdasarkan kondisi tanpa menulis banyak `if` statement.

Contoh menambahkan atribut `secret` hanya untuk admin:

```php
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        'email' => $this->email,
        'secret' => $this->when($request->user()?->isAdmin(), 'secret-value'),
        'created_at' => $this->created_at,
        'updated_at' => $this->updated_at,
    ];
}
```

`when` juga menerima closure untuk menghitung nilai hanya jika kondisi terpenuhi:

```php
'secret' => $this->when($request->user()?->isAdmin(), function () {
    return 'secret-value';
}),
```

`whenHas` mengikutsertakan atribut hanya jika atribut tersebut ada di model:

```php
'name' => $this->whenHas('name'),
```

`whenNotNull` mengikutsertakan atribut jika nilainya tidak null:

```php
'name' => $this->whenNotNull($this->name),
```

### 🔀 Merging Conditional Attributes
Jika beberapa atribut tergantung pada kondisi sama, gunakan `mergeWhen`:

```php
$this->mergeWhen($request->user()?->isAdmin(), [
    'first-secret' => 'value',
    'second-secret' => 'value',
]),
```

> Peringatan: jangan gunakan `mergeWhen` di dalam array dengan campuran key string dan numerik yang tidak berurutan.

**Narasi:** helper ini membuat kode resource bersih dan deklaratif; controller cukup memutuskan siapa yang boleh melihat apa melalui policy atau method model.

---

## 🔗 Relasi Kondisional & Hitungan
Menambahkan relasi hanya jika sudah diload:

```php
'posts' => PostResource::collection($this->whenLoaded('posts')),
```

Menambahkan `count` relasi jika sudah di-*load* menggunakan `loadCount`:

```php
'posts_count' => $this->whenCounted('posts'),
```

Contoh memanggil di controller:

```php
new UserResource($user->loadCount('posts'));
```

Selain `whenCounted`, tersedia `whenAggregated` untuk agregat lain:

```php
'words_avg' => $this->whenAggregated('posts', 'words', 'avg'),
'words_sum' => $this->whenAggregated('posts', 'words', 'sum'),
```

**Narasi:** ini membantu mengontrol overhead query sekaligus menampilkan nilai agregat bila sudah dihitung sebelumnya.

---

## 🔁 Informasi Pivot Kondisional (Many-to-Many)
Saat ingin menampilkan data dari tabel pivot (contoh: `role_user`), gunakan `whenPivotLoaded`:

```php
'expires_at' => $this->whenPivotLoaded('role_user', function () {
    return $this->pivot->expires_at;
}),
```

Jika pivot menggunakan model custom, Anda bisa mengganti argumen pertama dengan instance model pivot itu:

```php
'expires_at' => $this->whenPivotLoaded(new Membership, function () {
    return $this->pivot->expires_at;
}),
```

Jika pivot diakses dengan nama accessor selain `pivot`, gunakan `whenPivotLoadedAs`:

```php
'expires_at' => $this->whenPivotLoadedAs('subscription', 'role_user', function () {
    return $this->subscription->expires_at;
}),
```

**Narasi:** memeriksa pivot secara kondisional menghindarkan error ketika pivot tidak tersedia (mis. saat relasi tidak diload).

---

## 🏷️ Menambahkan Meta Data & Top-level Meta
Menambahkan meta data untuk resource/collection sering dibutuhkan untuk standar API tertentu atau kebutuhan klien.

Menambahkan meta pada collection lewat method `with`:

```php
public function with(Request $request): array
{
    return [
        'meta' => [
            'key' => 'value',
        ],
    ];
}
```

Menambah meta saat membangun resource di controller menggunakan method `additional`:

```php
return User::all()
    ->load('roles')
    ->toResourceCollection()
    ->additional(['meta' => [
        'key' => 'value',
    ]]);
```

**Narasi:** gunakan `with` untuk meta yang selalu Anda sertakan saat resource adalah outermost response, dan `additional` untuk menambahkan meta secara dinamis dari controller.

---

## 📬 Resource Responses & Kustomisasi Response
Return resource langsung dari route/controller:

```php
use App\Models\User;

Route::get('/user/{id}', function (string $id) {
    return User::findOrFail($id)->toResource();
});
```

Jika perlu mengatur header atau status code, chain `response()` lalu manipulasi `JsonResponse`:

```php
return User::find(1)
    ->toResource()
    ->response()
    ->header('X-Value', 'True');
```

Atau definisikan `withResponse` di dalam resource untuk kustomisasi ketika resource dikembalikan sebagai outermost resource:

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
        ];
    }

    public function withResponse(Request $request, JsonResponse $response): void
    {
        $response->header('X-Value', 'True');
    }
}
```

**Narasi:** `withResponse` berguna untuk menambahkan header audit, versioning, atau custom status ketika resource dikembalikan.

---

## 🎯 Kesimpulan & Tips Praktis
- Resource membuat tampilan JSON konsisten dan terkontrol. ✅
- Gunakan `whenLoaded`, `whenCounted`, `whenAggregated` untuk menghindari N+1 dan overhead query. 🚫🐘
- Buat resource collection bila Anda perlu meta/links di tingkat koleksi. 🔗
- Matikan wrapping jika klien mengharapkan format datar: `JsonResource::withoutWrapping()`. 🧾
- Selalu pastikan relasi yang ingin ditampilkan sudah di-*eager load* jika perlu performa. ⚡

---

## 🛠️ Contoh Project Mini (Ilustrasi)
Misal kita punya `User` dan `Post` (1 user -> banyak post). Struktur sederhana:

- Model: `App\\Models\\User`, `App\\Models\\Post`
- Resource: `App\\Http\\Resources\\UserResource`, `App\\Http\\Resources\\PostResource`
- Collection: `App\\Http\\Resources\\UserCollection` (opsional)

Contoh `UserResource` menampilkan relasi posts jika diload:

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->when($request->user()?->isAdmin(), $this->email),
            'posts' => PostResource::collection($this->whenLoaded('posts')),
            'posts_count' => $this->whenCounted('posts'),
            'created_at' => $this->created_at,
        ];
    }
}
```

Contoh route yang mengembalikan user dengan posts yang di-*eager load*:

```php
Route::get('/user-with-posts/{id}', function ($id) {
    $user = App\Models\User::with('posts')->findOrFail($id);
    return new App\Http\Resources\UserResource($user);
});
```

---

## 📎 Referensi Singkat
- Official Laravel Documentation (Resources) — konsep dan helper seperti `whenLoaded`, `whenCounted`, dsb.
- Dokumentasi Eloquent Collections dan Paginators untuk integrasi `toResourceCollection()` dan `paginate()`.
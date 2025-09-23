# 🧑‍💻 Eloquent: Mutators & Casting

Laravel Eloquent menyediakan fitur **Accessors**, **Mutators**, dan **Attribute Casting** untuk mengubah atau memanipulasi nilai atribut model ketika diakses maupun disimpan. Hal ini memudahkan developer agar data yang tersimpan dan digunakan selalu dalam format yang sesuai.

Misalnya:
- Menggunakan enkripsi saat menyimpan data dan otomatis mendekripsinya saat diakses.
- Mengonversi JSON string di database menjadi array ketika diambil melalui model.

---

## 📖 Daftar Isi
1. [Accessors dan Mutators](#accessors-dan-mutators)
   - [Accessors](#accessors-1)
   - [Accessor dengan Banyak Atribut](#accessor-dengan-banyak-atribut-1)
   - [Caching Accessor](#caching-accessor-1)
   - [Mutators](#mutators-1)
   - [Mutator dengan Banyak Atribut](#mutator-dengan-banyak-atribut-1)
2. [Attribute Casting](#attribute-casting)
   - [Casting Tipe Data Bawaan](#casting-tipe-data-bawaan-1)
   - [Stringable Casting](#stringable-casting-1)
   - [Array & JSON Casting](#array-json-casting)
   - [ArrayObject & Collection Casting](#arrayobject-collection-casting)
   - [Date Casting](#date-casting-1)
   - [Enum Casting](#enum-casting-1)
   - [Encrypted Casting](#encrypted-casting-1)
   - [Query Time Casting](#query-time-casting-1)
3. [Custom Casts](#custom-casts)
   - [Membuat Cast Kustom](#membuat-cast-kustom-1)
   - [Value Object Casting](#value-object-casting-1)
   - [Inbound Casting](#inbound-casting-1)
   - [Cast Parameters](#cast-parameters-1)
   - [Castables](#castables-1)
   - [Anonymous Cast Classes](#anonymous-cast-classes-1)

---

## 🚀 Accessors dan Mutators {#accessors-dan-mutators}

### 📌 Accessors {#accessors-1}
Accessors adalah method untuk **mengubah nilai atribut saat diambil** dari model. Untuk mendefinisikan accessor, buat metode `protected` pada model yang merepresentasikan atribut yang dapat diakses. Metode ini harus mengembalikan instance `Illuminate\Database\Eloquent\Casts\Attribute`.

```php
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected function firstName(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucfirst($value),
        );
    }
}

// Contoh penggunaan
$user = User::find(1);
echo $user->first_name; // Nilai akan otomatis dikapitalisasi
```

👉 Narasi: Dengan accessor, kita bisa memastikan data yang ditampilkan sudah dalam format yang lebih rapi, misalnya nama depan selalu kapital saat diambil dari database.

---

### 📊 Accessor dengan Banyak Atribut {#accessor-dengan-banyak-atribut-1}
Terkadang, kita perlu menggabungkan beberapa atribut menjadi satu **value object**. Kita dapat mengakses semua atribut model dengan parameter kedua pada fungsi accessor.

```php
protected function address(): Attribute
{
    return Attribute::make(
        get: fn (mixed $value, array $attributes) => new Address(
            $attributes['address_line_one'],
            $attributes['address_line_two'],
        ),
    );
}
```

👉 Narasi: Dengan teknik ini, kita bisa membungkus beberapa kolom database ke dalam satu objek yang lebih bermakna, memudahkan penggunaan data dalam aplikasi.

---

### 💾 Caching Accessor {#caching-accessor-1}
Laravel menyimpan instance object yang dihasilkan accessor agar konsisten dan hemat resource. Untuk mengaktifkan caching, tambahkan method `shouldCache()`.

```php
protected function hash(): Attribute
{
    return Attribute::make(
        get: fn (string $value) => bcrypt(gzuncompress($value)),
    )->shouldCache();
}
```

👉 Narasi: Jika nilai accessor mahal secara komputasi (misalnya melakukan dekripsi dan hashing), caching membantu mengurangi beban dengan menyimpan hasil transformasi.

---

### 🔧 Mutators {#mutators-1}
Mutators digunakan untuk **mengubah nilai atribut sebelum disimpan** ke database. Anda dapat mendefinisikan mutator dengan menyediakan argumen `set` saat mendefinisikan atribut.

```php
class User extends Model
{
    protected function firstName(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucfirst($value),
            set: fn (string $value) => strtolower($value),
        );
    }
}

// Contoh penggunaan
$user = User::find(1);
$user->first_name = 'Sally';
```

👉 Narasi: Dengan mutator, kita memastikan data yang masuk ke database konsisten, misalnya selalu huruf kecil saat disimpan, meskipun pengguna memasukkan huruf kapital.

---

### 🔄 Mutator dengan Banyak Atribut {#mutator-dengan-banyak-atribut-1}
Mutator bisa mengubah satu input menjadi beberapa kolom database. Untuk mengakses atribut lain pada model saat mengatur nilai, gunakan parameter keempat pada fungsi mutator.

```php
protected function address(): Attribute
{
    return Attribute::make(
        get: fn (mixed $value, array $attributes) => new Address(
            $attributes['address_line_one'],
            $attributes['address_line_two'],
        ),
        set: fn (Address $value) => [
            'address_line_one' => $value->lineOne,
            'address_line_two' => $value->lineTwo,
        ],
    );
}
```

👉 Narasi: Dengan ini, developer bisa langsung memberikan objek Address, dan Laravel akan menyimpannya dalam beberapa kolom yang sesuai, memudahkan pengelolaan data kompleks.

---

## 🎯 Attribute Casting {#attribute-casting}
Attribute casting memungkinkan kita **mengonversi atribut ke tipe data tertentu** tanpa menulis accessor/mutator secara eksplisit. Casting dilakukan melalui metode `casts()` pada model.

### 📦 Casting Tipe Data Bawaan {#casting-tipe-data-bawaan-1}
Laravel menyediakan berbagai tipe casting bawaan yang dapat digunakan secara langsung dalam array `casts`.

```php
class User extends Model
{
    protected function casts(): array
    {
        return [
            'is_admin' => 'boolean',
            'age' => 'integer',
            'height' => 'decimal:2',
            'weight' => 'float',
            'settings' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'timestamp',
        ];
    }
}

// Contoh
$user = User::find(1);
if ($user->is_admin) {
    // otomatis true/false
}
```

👉 Narasi: Dengan casting bawaan, kita tidak perlu manual mengubah tipe data dasar seperti mengubah string "1"/"0" menjadi boolean true/false, atau mengubah string numerik menjadi integer/float.

---

### 🔤 Stringable Casting {#stringable-casting-1}
Mengubah atribut menjadi instance `Stringable` yang menyediakan berbagai metode untuk memanipulasi string.

```php
use Illuminate\Database\Eloquent\Casts\AsStringable;

class User extends Model
{
    protected function casts(): array
    {
        return [
            'directory' => AsStringable::class,
            'name' => AsStringable::class,
        ];
    }
}

// Penggunaan
$user = User::find(1);
echo $user->name->kebab(); // Mengubah nama menjadi format kebab-case
echo $user->directory->afterLast('/'); // Mendapatkan bagian terakhir dari path direktori
```

👉 Narasi: Casting `AsStringable` memungkinkan kita untuk langsung menggunakan berbagai metode manipulasi string yang disediakan oleh Laravel tanpa perlu membuat accessor kustom.

---

### 📋 Array & JSON Casting {#array-json-casting}
Secara otomatis mengubah kolom JSON menjadi array PHP saat diambil dan sebaliknya saat disimpan.

```php
class User extends Model
{
    protected function casts(): array
    {
        return [
            'options' => 'array',
            'preferences' => 'json',
        ];
    }
}

// Penggunaan
$user = User::find(1);
$user->options['theme'] = 'dark';
$user->preferences = ['locale' => 'id', 'timezone' => 'Asia/Jakarta'];
$user->save();

// Mengakses nilai
echo $user->options['theme']; // 'dark'
echo $user->preferences['locale']; // 'id'
```

👉 Narasi: Casting array dan JSON sangat berguna untuk kolom yang menyimpan data fleksibel seperti preferensi pengguna, pengaturan aplikasi, atau metadata tambahan yang strukturnya bisa berubah-ubah.

---

### 🧺 ArrayObject & Collection Casting  {#arrayobject-collection-casting}
Mengubah JSON ke `ArrayObject` atau `Collection` Laravel agar lebih mudah dimanipulasi dengan metode yang tersedia.

```php
use Illuminate\Database\Eloquent\Casts\AsCollection;

class User extends Model
{
    protected function casts(): array
    {
        return [
            'options' => AsCollection::class,
        ];
    }
}

// Penggunaan
$user = User::find(1);
$user->options->put('theme', 'dark');
$user->options->put('notifications', true);
$user->save();

// Menggunakan metode Collection
if ($user->options->get('notifications')) {
    // Kirim notifikasi
}
```

👉 Narasi: Casting ke Collection memberikan keuntungan lebih dibanding array biasa karena mendukung berbagai metode manipulasi dan transformasi data yang disediakan oleh Laravel Collection.

---

### 📅 Date Casting {#date-casting-1}
Secara otomatis meng-cast atribut tanggal ke instance `Carbon` dan memungkinkan pengaturan format khusus untuk serialisasi JSON.

```php
protected function casts(): array
{
    return [
        'created_at' => 'datetime',
        'updated_at' => 'datetime:Y-m-d H:i:s',
        'birthday' => 'date:Y-m-d',
        'exam_time' => 'immutable_datetime',
        'meeting_date' => 'immutable_date',
    ];
}

// Penggunaan
$user = User::find(1);
$user->birthday->age; // Mendapatkan usia dalam tahun
$user->created_at->format('d/m/Y'); // Memformat tanggal
```

👉 Narasi: Date casting memudahkan pengelolaan atribut tanggal dengan menyediakan instance Carbon yang memiliki banyak metode untuk manipulasi dan format tanggal, serta memungkinkan pengaturan format khusus saat serialisasi ke JSON.

---

### 🎴 Enum Casting {#enum-casting-1}
Secara otomatis meng-cast atribut ke PHP Enums, memastikan tipe data yang ketat dan validasi otomatis.

```php
<?php

enum ServerStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case MAINTENANCE = 'maintenance';
}

// Di Model
class Server extends Model
{
    protected function casts(): array
    {
        return [
            'status' => ServerStatus::class,
        ];
    }
}

// Penggunaan
$server = Server::find(1);
$server->status = ServerStatus::ACTIVE; // Valid
$server->status = 'invalid'; // Akan menyebabkan error
```

👉 Narasi: Enum casting memberikan type safety yang ketat untuk atribut dengan nilai terbatas, mencegah nilai yang tidak valid dan membuat kode lebih jelas dan mudah dikelola.

---

### 🔐 Encrypted Casting {#encrypted-casting-1}
Secara otomatis mengenkripsi atribut saat menyimpan ke database dan mendekripsinya saat diambil, menjaga keamanan data sensitif.

```php
class User extends Model
{
    protected function casts(): array
    {
        return [
            'secret' => 'encrypted',
            'sensitive_data' => 'encrypted:array',
            'confidential_info' => 'encrypted:collection',
            'private_object' => 'encrypted:object',
        ];
    }
}

// Penggunaan
$user = User::find(1);
$user->secret = 'password123'; // Otomatis terenkripsi saat disimpan
echo $user->secret; // Otomatis didekripsi saat diakses
```

👉 Narasi: Encrypted casting melindungi data sensitif dengan enkripsi otomatis menggunakan fitur enkripsi Laravel, memastikan bahwa data seperti password, token, atau informasi pribadi tetap aman di database.

---

### 🔍 Query Time Casting {#query-time-casting-1}
Memungkinkan casting atribut tambahan yang dihasilkan dari query database, seperti kolom yang dihitung atau hasil subquery.

```php
use App\Models\Post;

$users = User::select([
    'users.*',
    'last_posted_at' => Post::selectRaw('MAX(created_at)')
        ->whereColumn('user_id', 'users.id')
])->withCasts([
    'last_posted_at' => 'datetime'
])->get();

// Penggunaan
foreach ($users as $user) {
    echo $user->last_posted_at->diffForHumans(); // Bisa menggunakan metode Carbon
}
```

👉 Narasi: Query time casting sangat berguna untuk casting atribut tambahan yang dihasilkan dari query kompleks seperti agregasi, subquery, atau join, memungkinkan kita untuk menggunakan metode yang sesuai dengan tipe data dari atribut tersebut.

---

## ⚙️ Custom Casts {#custom-casts}

### 🛠️ Membuat Cast Kustom {#membuat-cast-kustom-1}
Laravel memungkinkan pembuatan cast kustom untuk kebutuhan transformasi data yang spesifik. Anda dapat membuat cast kustom menggunakan perintah Artisan:

```bash
php artisan make:cast AsJson
```

Contoh implementasi cast kustom sederhana:

```php
<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class AsJson implements CastsAttributes
{
    /**
     * Cast nilai atribut.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  string  $key
     * @param  mixed  $value
     * @param  array  $attributes
     * @return array
     */
    public function get($model, $key, $value, $attributes)
    {
        return json_decode($value, true);
    }

    /**
     * Persiapkan nilai atribut untuk disimpan.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  string  $key
     * @param  mixed  $value
     * @param  array  $attributes
     * @return string
     */
    public function set($model, $key, $value, $attributes)
    {
        return json_encode($value);
    }
}
```

Penggunaan dalam model:
```php
class User extends Model
{
    protected function casts(): array
    {
        return [
            'preferences' => AsJson::class,
        ];
    }
}
```

👉 Narasi: Custom cast memungkinkan developer untuk menentukan cara unik mengubah atribut sesuai kebutuhan aplikasi, memberikan fleksibilitas maksimal untuk transformasi data yang kompleks atau spesifik.

---

### 🏗️ Value Object Casting {#value-object-casting-1}
Custom cast bisa mengembalikan objek nilai (value object) yang kompleks, memungkinkan pengelolaan data yang lebih terstruktur.

```php
<?php

namespace App\Casts;

use App\ValueObjects\Address;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class AsAddress implements CastsAttributes
{
    /**
     * Cast nilai atribut.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  string  $key
     * @param  mixed  $value
     * @param  array  $attributes
     * @return \App\ValueObjects\Address
     */
    public function get($model, $key, $value, $attributes)
    {
        return new Address(
            $attributes['address_line_one'],
            $attributes['address_line_two']
        );
    }

    /**
     * Persiapkan nilai atribut untuk disimpan.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  string  $key
     * @param  mixed  $value
     * @param  array  $attributes
     * @return array
     */
    public function set($model, $key, $value, $attributes)
    {
        return [
            'address_line_one' => $value->lineOne,
            'address_line_two' => $value->lineTwo,
        ];
    }
}
```

Penggunaan dalam model:
```php
class User extends Model
{
    protected function casts(): array
    {
        return [
            'address' => AsAddress::class,
        ];
    }
}
```

👉 Narasi: Value object casting memudahkan mapping beberapa kolom database ke dalam satu objek domain yang bermakna, menjadikan kode lebih terorganisir dan mudah dikelola.

---

### 📥 Inbound Casting {#inbound-casting-1}
Inbound casting hanya mentransformasi nilai saat disimpan ke database, tidak saat diambil. Berguna untuk operasi seperti hashing password.

```php
<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsInboundAttributes;
use Illuminate\Support\Facades\Hash;

class HashCast implements CastsInboundAttributes
{
    /**
     * Persiapkan nilai atribut untuk disimpan.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  string  $key
     * @param  mixed  $value
     * @param  array  $attributes
     * @return string
     */
    public function set($model, $key, $value, $attributes)
    {
        return Hash::make($value);
    }
}
```

Penggunaan dalam model:
```php
class User extends Model
{
    protected function casts(): array
    {
        return [
            'password' => HashCast::class,
        ];
    }
}
```

👉 Narasi: Inbound casting cocok untuk operasi satu arah seperti hashing password, di mana kita hanya perlu mengubah nilai saat menyimpan ke database tanpa perlu membalikkan transformasi saat mengambil data.

---

### ⚙️ Cast Parameters {#cast-parameters-1}
Cast kustom dapat menerima parameter untuk memberikan fleksibilitas ekstra dalam transformasi data.

```php
<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class CastWithParameter implements CastsAttributes
{
    public function __construct(
        protected string $format
    ) {}

    /**
     * Cast nilai atribut.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  string  $key
     * @param  mixed  $value
     * @param  array  $attributes
     * @return mixed
     */
    public function get($model, $key, $value, $attributes)
    {
        // Gunakan parameter $this->format dalam transformasi
        return $this->transformValue($value, $this->format);
    }

    /**
     * Persiapkan nilai atribut untuk disimpan.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  string  $key
     * @param  mixed  $value
     * @param  array  $attributes
     * @return mixed
     */
    public function set($model, $key, $value, $attributes)
    {
        // Gunakan parameter $this->format dalam transformasi
        return $this->reverseTransformValue($value, $this->format);
    }
    
    protected function transformValue($value, $format)
    {
        // Implementasi transformasi berdasarkan format
        return $value;
    }
    
    protected function reverseTransformValue($value, $format)
    {
        // Implementasi transformasi balik berdasarkan format
        return $value;
    }
}
```

Penggunaan dengan parameter dalam model:
```php
class User extends Model
{
    protected function casts(): array
    {
        return [
            'data' => CastWithParameter::class.':json',
            'value' => CastWithParameter::class.':xml',
        ];
    }
}
```

👉 Narasi: Parameter cast memberikan fleksibilitas ekstra pada cast kustom, memungkinkan satu kelas cast untuk menangani berbagai variasi transformasi berdasarkan parameter yang diberikan.

---

### 🎯 Castables {#castables-1}
Objek nilai bisa mendefinisikan cast mereka sendiri dengan mengimplementasikan antarmuka `Castable`, membuat value object lebih mandiri dan reusable.

```php
<?php

namespace App\ValueObjects;

use App\Casts\AsAddress;
use Illuminate\Contracts\Database\Eloquent\Castable;

class Address implements Castable
{
    public function __construct(
        public string $lineOne,
        public string $lineTwo
    ) {}

    /**
     * Dapatkan nama kelas cast untuk value object ini.
     *
     * @param  array  $arguments
     * @return string
     */
    public static function castUsing(array $arguments)
    {
        return AsAddress::class;
    }
}
```

Penggunaan dalam model:
```php
class User extends Model
{
    protected function casts(): array
    {
        return [
            'address' => Address::class,
        ];
    }
}
```

👉 Narasi: Castables membuat value object lebih mandiri dengan memungkinkan objek tersebut menentukan kelas cast yang digunakan, memudahkan penggunaan value object di berbagai model tanpa perlu konfigurasi tambahan.

---

### 📦 Anonymous Cast Classes {#anonymous-cast-classes-1}
Bisa membuat cast langsung di dalam value object tanpa perlu membuat file cast terpisah, berguna untuk kasus sederhana atau prototyping.

```php
<?php

namespace App\ValueObjects;

use Illuminate\Contracts\Database\Eloquent\Castable;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class Address implements Castable
{
    public function __construct(
        public string $lineOne,
        public string $lineTwo
    ) {}

    /**
     * Dapatkan implementasi cast untuk value object ini.
     *
     * @param  array  $arguments
     * @return \Illuminate\Contracts\Database\Eloquent\CastsAttributes
     */
    public static function castUsing(array $arguments)
    {
        return new class implements CastsAttributes
        {
            public function get($model, $key, $value, $attributes)
            {
                return new Address(
                    $attributes['address_line_one'],
                    $attributes['address_line_two']
                );
            }

            public function set($model, $key, $value, $attributes)
            {
                return [
                    'address_line_one' => $value->lineOne,
                    'address_line_two' => $value->lineTwo,
                ];
            }
        };
    }
}
```

👉 Narasi: Anonymous cast classes berguna untuk kasus kecil atau prototyping tanpa harus membuat file cast terpisah, memungkinkan definisi cast langsung dalam value object untuk kemudahan penggunaan dan pemeliharaan.

---

## 🎯 Kesimpulan
- **Accessors** → memodifikasi data saat **diambil** dari model.
- **Mutators** → memodifikasi data saat **disimpan** ke model.
- **Attribute Casting** → konversi otomatis tipe data umum (boolean, array, JSON, enum, dll) melalui metode `casts()`.
- **Custom Casts** → memungkinkan developer membuat aturan transformasi sesuai kebutuhan dengan berbagai jenis cast seperti value object casting, inbound casting, dll.

Dengan memahami Mutators & Casting di Laravel, developer dapat menjaga **konsistensi data**, **keamanan aplikasi**, serta membuat kode lebih **bersih dan mudah dirawat** ✅

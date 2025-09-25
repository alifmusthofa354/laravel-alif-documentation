# 🧑‍💻 Eloquent: Mutators & Casting di Laravel: Panduan dari Guru Kesayanganmu (Edisi Super Transformatif)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Hari ini kita akan membahas salah satu topik paling penting di Eloquent: **Mutators & Casting**. Yups, kita akan belajar bagaimana mengubah, memanipulasi, dan mengatur format data sebelum dan sesudah disimpan ke database agar tetap konsisten dan rapi.

Setelah beberapa kali revisi, akhirnya Guru paham apa yang sebenarnya kalian inginkan: sebuah panduan yang **super lengkap** tapi dijelaskan dengan **super sederhana**, seolah-olah Guru sedang duduk di sebelahmu sambil menjelaskan pelan-pelan.

Siap untuk belajar tentang transformasi data digital? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Mutators & Casting Itu Sebenarnya?

**Analogi:** Bayangkan kamu punya toko serba ada, dan setiap kali barang masuk (disimpan ke database) atau keluar (diakses dari database), kamu ingin mengubah formatnya dulu sebelum diterima. Misalnya, kamu ingin nama produk selalu kapital saat ditampilkan, atau kamu ingin data rahasia dienkripsi sebelum disimpan, dan didekripsi saat diambil.

**Mengapa ini penting?** Karena data yang masuk ke database seringkali tidak dalam format yang kita inginkan. Dengan mutators dan casting, kita bisa memastikan data yang disimpan dan diakses selalu dalam format yang konsisten dan sesuai kebutuhan aplikasi.

**Bagaimana cara kerjanya?** Laravel menyediakan fitur **Accessors**, **Mutators**, dan **Attribute Casting** untuk mengubah atau memanipulasi nilai atribut model ketika diakses maupun disimpan. Jadi, kamu bisa mengatur format data secara otomatis tanpa harus manual setiap kali.

Jadi, alur kerja data kita menjadi:

`➡️ Data Mentah -> 🔧 Mutator (Saat Disimpan) -> Database -> 🔍 Accessor (Saat Diakses) -> Data Siap Pakai`

Tanpa mutators & casting, kamu harus manual mengubah format data setiap kali menyimpan atau mengaksesnya. 😫

### 2. ✍️ Resep Pertamamu: Setup Accessor Sederhana

Ini adalah fondasi paling dasar. Mari kita buat accessor pertama dari nol, langkah demi langkah.

#### Langkah 1️⃣: Siapkan Model (Meja Kerjamu)
**Mengapa?** Kita butuh model Eloquent sebagai tempat mendefinisikan accessor dan mutator.

**Bagaimana?** Buat model User jika belum ada:
```bash
php artisan make:model User
```

#### Langkah 2️⃣: Buat Accessor Pertamamu
**Mengapa?** Kita ingin mengubah format nama depan agar selalu kapital saat diakses.

**Bagaimana?** Gunakan facade `Attribute` di model:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Model
{
    protected function firstName(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucfirst($value),  // Kapitalisasi saat diakses
        );
    }
}
```

**Penjelasan Kode:**
- `protected function firstName(): Attribute` mendefinisikan accessor untuk kolom `first_name`
- `get:` adalah fungsi yang dipanggil saat nilai diakses
- `ucfirst($value)` membuat huruf pertama menjadi kapital

#### Langkah 3️⃣: Gunakan Accessor-mu
**Mengapa?** Kita ingin melihat magic bagaimana accessor mengubah data.

**Bagaimana?** Akses model dan lihat hasilnya:
```php
<?php

use App\Models\User;

// Misalnya di database, first_name = 'sally'
$user = User::find(1);
echo $user->first_name; // Output: 'Sally' (kapitalisasi otomatis!)
```

**Penjelasan Kode:**
- `$user->first_name` secara otomatis memanggil accessor yang telah didefinisikan
- Data diubah sesuai logika accessor sebelum dikembalikan

Selesai! 🎉 Sekarang, kamu punya kemampuan dasar untuk mengubah format data saat diakses.

### 3. ⚡ Accessor Spesialis (Dengan Banyak Atribut)

**Analogi:** Bayangkan kamu punya kotak ajaib yang bisa menggabungkan beberapa informasi dari database (alamat jalan 1, alamat jalan 2) menjadi satu objek alamat yang lengkap.

**Mengapa ini ada?** Untuk menggabungkan beberapa kolom database menjadi satu objek yang lebih bermakna saat diakses.

**Bagaimana?** Gunakan parameter kedua untuk mengakses semua atribut:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Model
{
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => 
                $attributes['first_name'] . ' ' . $attributes['last_name'],
        );
    }
}
```

---

## Bagian 2: Feature Casting - Mesin Transformasi-mu 🤖

### 4. 📦 Apa Itu Attribute Casting?

**Analogi:** Bayangkan kamu punya mesin ajaib yang secara otomatis mengubah tipe data saat data masuk atau keluar dari database - seperti mesin yang otomatis membuat string menjadi boolean, atau array menjadi JSON.

**Mengapa ini keren?** Karena kamu tidak perlu manual mengubah tipe data lagi! Laravel akan otomatis mengubahnya sesuai aturan casting.

**Bagaimana?** Gunakan metode `casts()` di model untuk mendefinisikan casting otomatis:

### 5. 🛠️ Casting Tipe Data dengan Kekuatan Tambahan

> **✨ Tips dari Guru:** Ini seperti punya mesin transformasi data otomatis! Wajib dipakai untuk konsistensi data.

*   **Boolean Casting**: Untuk mengubah string "1"/"0" atau "true"/"false" menjadi boolean.
    ```php
    protected function casts(): array
    {
        return [
            'is_admin' => 'boolean',  // String "1"/"0" otomatis jadi true/false
        ];
    }
    ```

*   **Array/JSON Casting**: Untuk menyimpan dan mengakses array atau object secara otomatis.
    ```php
    protected function casts(): array
    {
        return [
            'options' => 'array',     // JSON string otomatis jadi PHP array
            'preferences' => 'json',  // PHP array otomatis jadi JSON string
        ];
    }
    ```

*   **Date Casting**: Untuk mengubah string tanggal ke instance Carbon.
    ```php
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',  // String jadi Carbon instance
            'birthday' => 'date:Y-m-d',  // Format khusus untuk serialisasi
        ];
    }
    ```

### 6. 🧩 Memilih Jenis Casting (Pemilihan Tipe)

*   **Gunakan Boolean**: Untuk kolom yang menyimpan nilai 0/1 atau true/false.
*   **Gunakan Array**: Untuk kolom JSON yang menyimpan data struktur fleksibel.
*   **Gunakan Date**: Untuk kolom tanggal/waktu yang perlu manipulasi date.
*   **Gunakan Enum**: Untuk kolom dengan nilai terbatas dan type safety.
*   **Gunakan Encrypted**: Untuk data sensitif yang harus dienkripsi.

### 7. 🌐 Casting dengan Format Khusus

**Mengapa?** Agar data bisa disimpan dan ditampilkan dalam format yang sesuai kebutuhan aplikasi.

**Bagaimana?** Gunakan format parameter untuk casting tertentu:

1. **Decimal Casting dengan Presisi:**
```php
protected function casts(): array
{
    return [
        'price' => 'decimal:2',      // Format desimal dengan 2 angka di belakang koma
        'tax_rate' => 'decimal:4',   // Presisi lebih tinggi untuk rate
    ];
}
```

2. **Datetime Casting dengan Format:**
```php
protected function casts(): array
{
    return [
        'created_at' => 'datetime',                    // Carbon instance standar
        'updated_at' => 'datetime:Y-m-d H:i:s',      // Format khusus saat JSON
        'last_login' => 'immutable_datetime',        // Versi immutable dari Carbon
        'birth_date' => 'date:Y-m-d',                // Format tanggal saja
    ];
}
```

3. **Enum Casting:**
```php
<?php

// Buat enum terlebih dahulu
enum UserStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case SUSPENDED = 'suspended';
}

// Di model
class User extends Model
{
    protected function casts(): array
    {
        return [
            'status' => UserStatus::class,  // Type safety dengan enum
        ];
    }
}
```

4. **Encrypted Casting:**
```php
class User extends Model
{
    protected function casts(): array
    {
        return [
            'secret_token' => 'encrypted',           // Enkripsi string biasa
            'sensitive_data' => 'encrypted:array',   // Enkripsi array
            'private_info' => 'encrypted:object',    // Enkripsi object
        ];
    }
}
```

Perhatikan bahwa casting membuat format data konsisten tanpa perlu manipulasi manual setiap kali.

---

## Bagian 3: Jurus Tingkat Lanjut - Custom Cast & Mutator 🚀

### 8. 👨‍👩‍👧 Custom Cast (Value Object)

**Analogi:** Bayangkan kamu punya kotak ajaib yang bisa mengubah beberapa kolom database (alamat_jalan1, alamat_jalan2) menjadi satu objek alamat yang bisa digunakan langsung dalam aplikasimu.

**Mengapa?** Agar data kompleks bisa dikelola dalam bentuk object yang lebih bermakna dan mudah digunakan.

**Bagaimana?** Buat casting kustom untuk menggabungkan beberapa kolom:

**Contoh Lengkap Custom Cast:**

1. **Buat Value Object:**
```php
<?php
// app/ValueObjects/Address.php

namespace App\ValueObjects;

class Address
{
    public function __construct(
        public string $lineOne,
        public string $lineTwo,
        public string $city,
        public string $postalCode
    ) {}

    public function fullAddress(): string
    {
        return $this->lineOne . ', ' . $this->lineTwo . ', ' . $this->city . ' ' . $this->postalCode;
    }
}
```

2. **Buat Custom Cast:**
```bash
php artisan make:cast AsAddress
```

3. **Isi Custom Cast:**
```php
<?php
// app/Casts/AsAddress.php

namespace App\Casts;

use App\ValueObjects\Address;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class AsAddress implements CastsAttributes
{
    /**
     * Transformasi saat mengambil dari database
     */
    public function get($model, string $key, $value, array $attributes): ?Address
    {
        if (!isset($attributes['address_line_one']) && !isset($attributes['address_line_two'])) {
            return null;
        }

        return new Address(
            $attributes['address_line_one'],
            $attributes['address_line_two'],
            $attributes['city'],
            $attributes['postal_code']
        );
    }

    /**
     * Transformasi saat menyimpan ke database
     */
    public function set($model, string $key, $value, array $attributes): array
    {
        if (!$value instanceof Address) {
            return $attributes;
        }

        return [
            'address_line_one' => $value->lineOne,
            'address_line_two' => $value->lineTwo,
            'city' => $value->city,
            'postal_code' => $value->postalCode,
        ];
    }
}
```

4. **Gunakan di Model:**
```php
<?php

namespace App\Models;

use App\Casts\AsAddress;
use Illuminate\Database\Eloquent\Model;

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

5. **Contoh Penggunaan:**
```php
<?php

use App\Models\User;
use App\ValueObjects\Address;

$user = User::find(1);

// saat mengakses, kita mendapatkan objek Address
$address = $user->address;
echo $address->fullAddress(); // Output: "Jl. Merdeka No. 123, Kel. Bahagia, Jakarta 12345"

// saat menyimpan, kita bisa langsung memberikan objek Address
$newAddress = new Address(
    'Jl. Sudirman No. 456',
    'Lantai 3',
    'Jakarta',
    '12190'
);

$user->address = $newAddress;
$user->save(); // Akan otomatis menyimpan ke kolom-kolom terkait
```

Dengan custom cast, kamu bisa menggunakan value object dalam aplikasi sambil tetap menyimpan data dalam beberapa kolom database.
*   **Inbound Casting**: Ini seperti mesin satu arah yang hanya mentransformasi data saat menyimpan, sangat cocok untuk hashing password atau enkripsi.

**Contoh Lengkap Inbound Casting:**

1. **Buat Inbound Cast:**
```php
<?php
// app/Casts/HashPassword.php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsInboundAttributes;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Model;

class HashPassword implements CastsInboundAttributes
{
    /**
     * Transformasi saat menyimpan saja
     */
    public function set($model, string $key, $value, array $attributes): string
    {
        return Hash::make($value);
    }
}
```

2. **Gunakan di Model:**
```php
<?php

namespace App\Models;

use App\Casts\HashPassword;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected function casts(): array
    {
        return [
            'password' => HashPassword::class,
        ];
    }
}
```

3. **Penggunaan:**
```php
<?php

use App\Models\User;

// Saat menyimpan, password otomatis di-hash
$user = new User();
$user->password = 'password123'; // Akan otomatis di-hash saat disimpan
$user->save();
```

Inbound casting sangat berguna untuk operasi satu arah seperti hashing atau enkripsi.
*   **Cast dengan Parameter**: Ini seperti mesin transformasi yang bisa diatur dengan pengaturan berbeda-beda.

**Contoh Lengkap Parameter Cast:**

1. **Buat Parameter Cast:**
```php
<?php
// app/Casts/FormatValue.php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class FormatValue implements CastsAttributes
{
    public function __construct(
        private string $format = 'default'
    ) {}

    public function get($model, string $key, $value, array $attributes)
    {
        switch ($this->format) {
            case 'uppercase':
                return strtoupper($value);
            case 'lowercase':
                return strtolower($value);
            case 'title':
                return ucwords(strtolower($value));
            default:
                return $value;
        }
    }

    public function set($model, string $key, $value, array $attributes)
    {
        return $value; // Tidak perlu transformasi saat menyimpan
    }
}
```

2. **Gunakan dengan Parameter:**
```php
<?php

namespace App\Models;

use App\Casts\FormatValue;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected function casts(): array
    {
        return [
            'name' => FormatValue::class . ':title',      // Format judul
            'category' => FormatValue::class . ':upper',  // Format kapital
            'description' => FormatValue::class,          // Format default
        ];
    }
}
```

3. **Penggunaan:**
```php
<?php

use App\Models\Product;

$product = Product::create([
    'name' => 'samsung galaxy s21',      // Akan jadi "Samsung Galaxy S21"
    'category' => 'electronics',         // Akan jadi "ELECTRONICS"
    'description' => 'latest smartphone' // Tetap "latest smartphone"
]);

echo $product->name; // "Samsung Galaxy S21"
```

Parameter cast memberikan fleksibilitas tinggi dalam transformasi data.
*   **Castables**: Ini seperti memberi kemampuan pada value object untuk menentukan sendiri bagaimana ia ingin ditransformasi.

**Contoh Lengkap Castables:**

1. **Buat Value Object dengan Castable:**
```php
<?php
// app/ValueObjects/Address.php

namespace App\ValueObjects;

use App\Casts\AsAddress;
use Illuminate\Contracts\Database\Eloquent\Castable;

class Address implements Castable
{
    public function __construct(
        public string $lineOne,
        public string $lineTwo,
        public string $city,
        public string $postalCode
    ) {}

    public static function castUsing(array $arguments): string
    {
        return AsAddress::class;
    }

    public function fullAddress(): string
    {
        return implode(', ', [$this->lineOne, $this->lineTwo, $this->city, $this->postalCode]);
    }
}
```

2. **Gunakan di Model:**
```php
<?php

namespace App\Models;

use App\ValueObjects\Address;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected function casts(): array
    {
        return [
            'address' => Address::class,  // Otomatis menggunakan AsAddress
        ];
    }
}
```

3. **Penggunaan:**
```php
<?php

use App\Models\User;
use App\ValueObjects\Address;

$user = User::find(1);
$address = $user->address; // Langsung mendapatkan objek Address

$newAddress = new Address('Jl. Baru No. 1', 'Lantai 5', 'Bandung', '40123');
$user->address = $newAddress; // Akan otomatis menggunakan casting yang sesuai
```

Castables membuat value object lebih mandiri dan mudah digunakan.

### 9. 👤 Mutator (Saat Penyimpanan Data)

**Analogi:** Ini untuk saat menyimpan data yang perlu diubah formatnya - seperti alamat email yang diubah ke huruf kecil saat disimpan.

**Mengapa?** Agar data yang masuk ke database selalu dalam format yang konsisten.

**Bagaimana?** Gunakan argumen `set` dalam accessor untuk membuat mutator:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Model
{
    protected function email(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => strtolower($value),  // Format saat diakses
            set: fn (string $value) => strtolower($value),  // Format saat disimpan
        );
    }
}
```

**Contoh Lengkap Mutator:**

1. **Model dengan Mutator:**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Model
{
    protected function firstName(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucfirst($value),      // Kapitalisasi pertama saat diakses
            set: fn (string $value) => strtolower($value),  // Huruf kecil saat disimpan
        );
    }
    
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => 
                $attributes['first_name'] . ' ' . $attributes['last_name'],
            set: fn (string $value) => [
                'first_name' => explode(' ', $value)[0],
                'last_name' => explode(' ', $value)[1] ?? '',
            ],
        );
    }
}
```

2. **Penggunaan:**
```php
<?php

use App\Models\User;

// Saat menyimpan, nama akan diubah formatnya
$user = new User();
$user->first_name = 'SALLY';  // Akan disimpan sebagai 'sally' karena mutator
$user->full_name = 'John Doe'; // Akan disimpan ke first_name='John', last_name='Doe'
$user->save();

// Saat mengakses, format akan diubah kembali
echo $user->first_name; // 'Sally' (kapitalisasi karena accessor)
```

### 10. 🎨 Mendekorasi Transformasi Data-mu (Kustomisasi Casting)

Kamu bisa mendekorasi casting data sesukamu:

*   **Caching Accessor**: 
    ```php
    protected function computedHash(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => bcrypt(gzuncompress($value)),
        )->shouldCache(); // Simpan hasil untuk efisiensi
    }
    ```

*   **Collection Casting**: 
    ```php
    use Illuminate\Database\Eloquent\Casts\AsCollection;

    protected function casts(): array
    {
        return [
            'preferences' => AsCollection::class, // Jadi Laravel Collection
        ];
    }
    ```

*   **Stringable Casting**: 
    ```php
    use Illuminate\Database\Eloquent\Casts\AsStringable;

    protected function casts(): array
    {
        return [
            'description' => AsStringable::class, // Jadi Stringable object
        ];
    }
    ```

*   **Query Time Casting**: 
    ```php
    $users = User::select([
        'users.*',
        'last_posted_at' => Post::selectRaw('MAX(created_at)')
            ->whereColumn('user_id', 'users.id')
    ])->withCasts([
        'last_posted_at' => 'datetime'  // Casting kolom hasil query
    ])->get();
    ```

**Contoh Lengkap Kustomisasi Casting:**
```php
// app/Models/User.php
<?php

namespace App\Models;

use App\Casts\HashPassword;
use App\Casts\AsAddress;
use App\ValueObjects\Address;
use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Casts\AsStringable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Model
{
    protected function casts(): array
    {
        return [
            'is_admin' => 'boolean',
            'age' => 'integer',
            'balance' => 'decimal:2',
            'settings' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime:Y-m-d H:i:s',
            'options' => AsCollection::class,      // Jadi Laravel Collection
            'bio' => AsStringable::class,         // Jadi Stringable object
            'address' => AsAddress::class,        // Custom cast ke Value Object
            'password' => HashPassword::class,    // Inbound cast untuk hashing
        ];
    }
    
    // Accessor tambahan
    protected function profileUrl(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => 
                '/users/' . $attributes['id'] . '/profile',
        )->shouldCache();
    }
    
    // Mutator tambahan
    protected function username(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => strtolower($value),
            set: fn (string $value) => strtolower($value),
        );
    }
}
```

### 11.5 🔐 Middleware untuk Validasi Casting

Kamu juga bisa menambahkan middleware untuk memastikan hanya data dengan format yang benar yang bisa disimpan:

*   **Middleware Validasi Format**:
    ```php
    php artisan make:middleware ValidateModelAttribute
    
    // app/Http/Middleware/ValidateModelAttribute.php
    namespace App\Http\Middleware;
    
    use Closure;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Validator;
    
    class ValidateModelAttribute
    {
        public function handle(Request $request, Closure $next)
        {
            // Validasi format sebelum data disimpan
            $validator = Validator::make($request->all(), [
                'email' => 'email',
                'age' => 'integer|min:0',
            ]);
            
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
    
            return $next($request);
        }
    }
    ```

### 11.7 🌐 Casting dengan API Resources

**Mengapa?** Untuk memastikan data dikirim dalam format yang konsisten melalui API.

**Bagaimana?**
```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'is_admin' => $this->is_admin,  // Boolean casting otomatis
            'created_at' => $this->created_at->toISOString(), // Date casting otomatis
            'settings' => $this->settings,  // Array casting otomatis
            'profile_url' => $this->whenHas('profile_url'),  // Accessor otomatis
        ];
    }
}
```

### 11. 🗑️ Menangani Data Transformasi Lama (Migrasi Format)

**Mengapa?** Terkadang kita perlu mengubah format casting lama ke format baru.

**Bagaimana?**
*   **Migrasi Format**: Lakukan migrasi data secara bertahap
*   **Backward Compatibility**: Jaga kompatibilitas format lama

**Contoh Lengkap dengan Migrasi:**

1. **Update Casting di Model:**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected function casts(): array
    {
        return [
            'preferences' => 'array',           // Format lama: JSON string
            // Jika ingin mengganti ke collection:
            // 'preferences' => AsCollection::class,  // Format baru: Collection
        ];
    }
    
    // Method migrasi backward compatibility
    public function getPreferencesAttribute($value)
    {
        $decoded = json_decode($value, true);
        return is_array($decoded) ? $decoded : [];
    }
}
```

2. **Migration untuk Update Format:**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Update data lama ke format baru jika perlu
        DB::table('users')->whereNotNull('preferences')->chunk(100, function ($users) {
            foreach ($users as $user) {
                $preferences = json_decode($user->preferences, true);
                if (is_array($preferences)) {
                    // Validasi dan update jika perlu
                    DB::table('users')
                        ->where('id', $user->id)
                        ->update(['preferences' => json_encode($preferences)]);
                }
            }
        });
    }
};
```

3. **Service untuk Konversi:**
```php
<?php

namespace App\Services;

class CastMigrationService
{
    public function convertArrayToCollection(string $arrayJson): string
    {
        $array = json_decode($arrayJson, true);
        $collection = collect($array);
        return $collection->toJson();
    }
    
    public function convertLegacyFormat($oldFormat)
    {
        // Logika konversi dari format lama ke format baru
        return $oldFormat;
    }
}
```

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Casting 🧰

### 12. 🔐 Middleware di Service Casting (Penjaga Konsistensi)

**Mengapa?** Terkadang semua transformasi data butuh validasi dan kontrol tambahan.

**Bagaimana?**
*   **Cara Modern (👍 Rekomendasi)**: Service class dengan logika casting kompleks.
    ```php
    use App\Services\AdvancedCastingService;

    class UserController extends Controller
    {
        public function __construct(
            protected AdvancedCastingService $castingService
        ) {}

        public function store(Request $request)
        {
            // Gunakan service untuk transformasi data sebelum disimpan
            $processedData = $this->castingService->processUserData($request->all());
            User::create($processedData);
        }
    }
    ```

### 13. 💉 Dependency Injection (Asisten Pribadi Ajaib)

**Prinsipnya: Jangan buat sendiri, minta saja!** Butuh layanan casting canggih? Tulis di parameter constructor atau method, dan Laravel akan memberikannya untukmu.

**Mengapa?** Ini membuat kodemu sangat fleksibel, mudah di-test, dan tidak terikat pada satu cara pembuatan objek.

**Bagaimana?**
*   **Service Injection**: Meminta "layanan casting" yang akan digunakan di banyak method.
    ```php
    use App\Services\DataCastingService;
    public function __construct(protected DataCastingService $castingService) {}
    ```

*   **Model Injection**: Meminta model dengan casting yang sudah siap.
    ```php
    public function show(User $user) { /* ... */ }
    ```

**Contoh Lengkap Dependency Injection:**

1. **Membuat Service Casting Canggih:**
```php
<?php
// app/Services/DataCastingService.php

namespace App\Services;

use App\Models\User;
use App\ValueObjects\Address;
use Illuminate\Support\Arr;

class DataCastingService
{
    public function processUserData(array $rawData): array
    {
        $processed = $rawData;
        
        // Proses alamat jika ada
        if (isset($rawData['full_address'])) {
            $address = $this->parseFullAddress($rawData['full_address']);
            $processed = array_merge($processed, [
                'address_line_one' => $address->lineOne,
                'address_line_two' => $address->lineTwo,
                'city' => $address->city,
                'postal_code' => $address->postalCode,
            ]);
        }
        
        // Proses preferensi jika ada
        if (isset($rawData['preferences'])) {
            $processed['preferences'] = json_encode($rawData['preferences']);
        }
        
        return $processed;
    }

    public function parseFullAddress(string $fullAddress): Address
    {
        // Logika parsing alamat
        $parts = explode(',', $fullAddress);
        return new Address(
            trim($parts[0] ?? ''),
            trim($parts[1] ?? ''),
            trim($parts[2] ?? ''),
            trim($parts[3] ?? '')
        );
    }

    public function formatUserDataForDisplay(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'full_address' => $user->address?->fullAddress(),
            'preferences' => $user->preferences,
        ];
    }
}
```

2. **Controller dengan Constructor Injection:**
```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\DataCastingService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;

class UserController extends Controller
{
    // Constructor injection - service akan di-inject ke semua method
    public function __construct(
        protected DataCastingService $castingService
    ) {}

    public function index(): View
    {
        $users = User::all();
        $formattedUsers = $users->map(function($user) {
            return $this->castingService->formatUserDataForDisplay($user);
        });
        
        return view('users.index', compact('formattedUsers'));
    }

    public function store(Request $request): JsonResponse
    {
        $processedData = $this->castingService->processUserData($request->all());
        
        $user = User::create($processedData);
        
        return response()->json([
            'message' => 'User created successfully',
            'user' => $this->castingService->formatUserDataForDisplay($user)
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $user = User::findOrFail($id);
        
        return response()->json([
            'user' => $this->castingService->formatUserDataForDisplay($user)
        ]);
    }
}
```

3. **Form Request Class (untuk validasi user):**
```php
<?php
// app/Http/Requests/StoreUserRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Pastikan user bisa menyimpan user (mungkin hanya admin)
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'full_address' => 'nullable|string',
            'preferences' => 'nullable|array',
            'preferences.theme' => 'string|in:light,dark',
            'preferences.notifications' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama harus disediakan.',
            'email.unique' => 'Email sudah terdaftar.',
            'preferences.theme.in' => 'Tema hanya bisa light atau dark.',
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
class UserController extends Controller
{
    // Protected akan membuat property bisa diakses dari class ini dan child class
    public function __construct(protected DataCastingService $castingService) {}
    
    // Atau bisa juga dengan property promotion lebih eksplisit:
    public function __construct(
        protected DataCastingService $castingService,
        protected AuthService $authService
    ) {}
}
```

**2. Method Injection untuk Request Spesifik:**
```php
public function store(StoreUserRequest $request) 
{
    // StoreUserRequest adalah kelas Form Request yang berisi aturan validasi
    $validated = $request->validated();
    // ...
}

public function update(Request $request, string $id) 
{
    // Request otomatis di-inject
}
```

### 14. 👮 Autorisasi (Kartu Akses Ajaib)

**Mengapi?** Untuk memastikan hanya orang yang berhak yang bisa mengubah data dengan casting kompleks.

**Bagaimana?** Helper `authorize` ini seperti men-scan kartu akses. Laravel akan otomatis mengecek ke "sistem keamanan" (**Policy** class) apakah kartumu (user-mu) punya izin.

```php
public function update(Request $request, string $id)
{
    $user = User::findOrFail($id);
    $this->authorize('updateCastedData', $user); // Pindai kartu akses!
    // Jika diizinkan, lanjutkan...
    
    $user->update($request->all());
}
```

**Contoh Lengkap Otorisasi:**

1. **Buat Policy:**
```bash
php artisan make:policy UserCastingPolicy
```

2. **Isi Policy:**
```php
<?php
// app/Policies/UserCastingPolicy.php

namespace App\Policies;

use App\Models\User as AuthUser;
use App\Models\User;

class UserCastingPolicy
{
    public function updateCastedData(AuthUser $authUser, User $user): bool
    {
        // User hanya bisa mengupdate data casting miliknya sendiri atau jika admin
        return $authUser->id === $user->id || $authUser->hasRole('admin');
    }
    
    public function viewCastedData(AuthUser $authUser, User $user): bool
    {
        return $authUser->id === $user->id || $authUser->hasRole('admin');
    }
}
```

3. **Gunakan di Controller:**
```php
class UserController extends Controller
{
    public function show(string $id)
    {
        $user = User::findOrFail($id);
        $this->authorize('viewCastedData', $user);
        
        return view('users.show', compact('user'));
    }
    
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        $this->authorize('updateCastedData', $user);
        
        $user->update($request->all());
        
        return redirect()->route('users.show', $user)
            ->with('status', 'Data pengguna diperbarui dengan casting otomatis!');
    }
}
```

---

## Bagian 5: Menjadi Master Mutators & Casting 🏆

### 15. ✨ Wejangan dari Guru

1.  **Gunakan Casting untuk Konsistensi**: Gunakan casting untuk memastikan data selalu dalam format yang benar tanpa perlu transformasi manual.
2.  **Pilih Tipe yang Tepat**: Gunakan boolean untuk data true/false, array untuk JSON, date untuk tanggal, dll.
3.  **Caching untuk Performa**: Gunakan `shouldCache()` pada accessor yang mahal secara komputasi.
4.  **Custom Cast untuk Kompleksitas**: Gunakan custom cast untuk data kompleks seperti value object atau struktur data khusus.
5.  **Inbound Cast untuk Operasi Satu Arah**: Gunakan inbound cast untuk hashing, enkripsi, atau transformasi hanya saat menyimpan.

### 16. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Mutators & Casting di Laravel:

#### 📦 Tipe Casting Bawaan
| Perintah | Fungsi |
|----------|--------|
| `'active' => 'boolean'` | Konversi ke boolean |
| `'age' => 'integer'` | Konversi ke integer |
| `'balance' => 'decimal:2'` | Konversi ke desimal dengan presisi |
| `'options' => 'array'` | Konversi JSON ke PHP array |
| `'created_at' => 'datetime'` | Konversi ke Carbon instance |

#### 🎯 Accessor & Mutator
| Perintah | Hasil |
|----------|--------|
| `get: fn ($value) => ...` | Transformasi saat diakses |
| `set: fn ($value) => ...` | Transformasi saat disimpan |
| `->shouldCache()` | Aktifkan caching accessor |
| `fn ($value, $attributes) => ...` | Akses semua atribut model |

#### 🔧 Casting Kustom
| Perintah | Fungsi |
|----------|--------|
| `AsCollection::class` | Konversi ke Laravel Collection |
| `AsStringable::class` | Konversi ke Stringable object |
| `AsAddress::class` | Custom cast ke value object |
| `'encrypted'` | Enkripsi otomatis |
| `UserStatus::class` | Enum casting |

#### 🌐 Casting Lanjutan
| Perintah | Fungsi |
|----------|--------|
| `withCasts([...])` | Query time casting |
| `'datetime:Y-m-d'` | Format custom untuk serialisasi |
| `CastsInboundAttributes` | Interface untuk inbound casting |
| `Castable` | Interface untuk value object casting |

#### 🚀 Performance & Format
| Perintah | Fungsi |
|----------|--------|
| `AsCollection::class` | Collection casting |
| `'encrypted:array'` | Enkripsi array |
| `immutable_datetime` | Carbon immutable |
| `'decimal:4'` | Desimal dengan presisi 4 |

#### 🔐 Keamanan
| Perintah | Fungsi |
|----------|--------|
| `'encrypted'` | Enkripsi data sensitif |
| `'encrypted:collection'` | Enkripsi collection |
| `HashPassword::class` | Inbound casting untuk hashing |
| `AsAddress::class` | Custom cast dengan validasi |

#### 🧰 Service dan Tools
| Tool | Fungsi |
|------|--------|
| `DataCastingService` | Service untuk transformasi data kompleks |
| `AsAddress` | Custom cast untuk value object |
| `FormatValue` | Parameter cast dengan format berbeda |
| `HashPassword` | Inbound cast untuk password |

### 17. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Mutators & Casting, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Ingat, Mutators & Casting adalah alat transformasi dari aplikasi. Menguasainya berarti kamu sudah siap membangun aplikasi Laravel yang **konsisten**, **aman**, dan **siap produksi**.

Jangan pernah berhenti belajar dan mencoba. Perlakukan casting seperti asisten pintar yang selalu menjaga format data tetap konsisten! Selamat ngoding, murid kesayanganku!

# ⚡ Eloquent: Factories di Laravel: Pembuat Data Cepat untuk Developer Hebatmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Hari ini kita akan belajar tentang fitur ajaib yang bakal bikin hidupmu jauh lebih mudah: **Model Factories**.

Setelah beberapa kali revisi, akhirnya Guru paham apa yang sebenarnya kalian inginkan: sebuah panduan yang **super lengkap** tapi dijelaskan dengan **super sederhana**, seolah-olah Guru sedang duduk di sebelahmu sambil menjelaskan pelan-pelan.

Bayangkan kamu sedang membuat aplikasi dan perlu banyak data dummy untuk pengujian atau seeding. Daripada ngetik manual satu per satu, Factory adalah seperti "mesin pencetak data ajaib" yang otomatis mengisi tabelmu. Keren, kan? Siap? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Eloquent Factory Itu Sebenarnya?

**Analogi:** Bayangkan kamu sedang membangun kota mainan. Kalau kamu harus membuat satu per satu rumah, mobil, dan penduduk secara manual, akan sangat lama dan melelahkan. Model Factory itu seperti "mesin cetak 3D" yang otomatis mencetak rumah-rumah, mobil-mobil, dan penduduk-penduduk dengan detail yang berbeda-beda.

**Mengapa ini penting?** Karena dengan Factory kamu bisa:
1.  **Membuat data dummy cepat**: Tidak perlu ngetik satu per satu
2.  **Testing jadi lebih mudah**: Banyak data untuk diuji
3.  **Data realistis**: Dengan variasi yang otomatis
4.  **Hemat waktu**: Fokus ke logika aplikasi, bukan kepengisian data

**Bagaimana cara kerjanya?** Prosesnya seperti ini:

`➡️ Kita Definisikan Template -> 🤖 Laravel Cetak Data -> 📚 Masuk ke Database -> 🧪 Gunakan untuk Testing/Seeding`

Tanpa Factory, kamu harus menulis banyak kode untuk membuat data dummy. Jangan sampai itu terjadi! 😳

### 2. ✍️ Resep Pertamamu: Membuat User Factory dari Nol

Ini adalah fondasi paling dasar. Mari kita buat User Factory pertamamu dari nol, langkah demi langkah.

#### Langkah 1️⃣: Buat File Factory Baru
**Mengapa?** Kita butuh template untuk mencetak model User.

**Bagaimana?** Gunakan perintah Artisan:
```bash
php artisan make:factory UserFactory
```

**Dimana?** File akan dibuat di `database/factories/UserFactory.php`.

#### Langkah 2️⃣: Isi Template Factory
**Mengapa?** Kita perlu memberi tahu Factory bagaimana bentuk User yang ingin kita cetak.

**Bagaimana?** Buka `database/factories/UserFactory.php` dan isi template:
```php
<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    protected static ?string $password;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(), // Nama acak
            'email' => fake()->unique()->safeEmail(), // Email acak & unik
            'email_verified_at' => now(), // Waktu sekarang
            'password' => static::$password ??= Hash::make('password'), // Password default
            'remember_token' => Str::random(10), // Token acak
        ];
    }
}
```

**Penjelasan Kode:**
- `fake()->name()` → Nama acak dari library Faker
- `fake()->unique()->safeEmail()` → Email acak yang unik dan aman
- `now()` → Timestamp saat ini
- `Hash::make('password')` → Password yang di-hash
- `definition()` → Tempat kamu mendefinisikan data default

#### Langkah 3️⃣: Gunakan Model User (Pastikan HasFactory ada)
**Mengapa?** Kita butuh memberi tahu User bahwa dia bisa menggunakan Factory.

**Bagaimana?** Pastikan `app/Models/User.php` punya trait `HasFactory`:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasFactory; // Ini penting!

    // ... properti dan metode lainnya
}
```

### 3. ⚡ Factory Bawaan Laravel (User Factory)

**Analogi:** Bayangkan kamu beli mobil dan di dalamnya sudah ada kitab petunjuk penggunaan. User Factory bawaan Laravel itu seperti kitab petunjuk siap pakai!

**Mengapa ini ada?** Laravel otomatis menyediakan User Factory agar kamu bisa langsung bikin data user dummy tanpa harus membuat dari nol.

**Bagaimana?** Ini adalah contoh User Factory bawaan yang sangat lengkap:

```php
<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    // State: membuat user yang belum diverifikasi
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
```

Perhatikan adanya method `unverified()` yang menciptakan variasi dari User biasa - inilah kekuatan **State**!

---

## Bagian 2: Resource Factory - Mesin Cetak Data Otomatismu 🤖

### 4. 📦 Apa Itu Model Factory dan Konvensi Nama?

**Analogi:** Bayangkan kamu punya mesin cetak buku. Kamu tinggal sebut "Buku Matematika", dan mesin tahu harus ambil dari template "BukuMatematikaFactory". Itulah konvensi nama Factory!

**Mengapa ini keren?** Karena Laravel otomatis tahu factory mana yang harus digunakan berdasarkan nama modelnya - tidak perlu manual!

**Bagaimana?** Cukup pastikan model punya trait `HasFactory`:

```php
// app/Models/User.php
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Model
{
    use HasFactory; // Laravel otomatis cari UserFactory
}
```

### 5. 🛠️ Membuat Factory Baru dengan Artisan

> **✨ Tips dari Guru:** Gunakan perintah ini untuk membuat factory baru dengan cepat!

**Perintah Dasar:**
```bash
php artisan make:factory PostFactory
```

**Contoh Lengkap:**
```bash
php artisan make:factory PostFactory --model=Post
```

Perintah kedua akan otomatis menghubungkan factory ke model Post dan menetapkan `$model` di dalam factory.

### 6. 🧩 Menyesuaikan Konvensi Nama Factory

**Mengapa?** Kadang kamu butuh factory di tempat yang berbeda atau dengan nama yang berbeda.

**Bagaimana?** Kamu bisa override method `newFactory()` di model:

```php
// app/Models/Flight.php
namespace App\Models;

use Database\Factories\Administration\FlightFactory;
use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    protected static function newFactory()
    {
        return FlightFactory::new();
    }
}
```

**Atau di dalam factory tentukan modelnya:**
```php
// database/factories/Administration/FlightFactory.php
namespace Database\Factories\Administration;

use App\Models\Flight;
use Illuminate\Database\Eloquent\Factories\Factory;

class FlightFactory extends Factory
{
    protected $model = Flight::class; // Hubungkan ke model Flight
}
```

### 7. 🌐 Menggunakan Factory di Berbagai Konteks

**Mengapa?** Factory bisa digunakan tidak hanya untuk testing tapi juga untuk seeding.

**Contoh dengan Seeder:**
```php
// database/seeders/UserSeeder.php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::factory(50)->create(); // Buat 50 user dummy
    }
}
```

**Contoh dengan Testing:**
```php
// tests/Feature/UserTest.php
public function test_user_can_be_created()
{
    $user = User::factory()->create();
    
    $this->assertDatabaseHas('users', [
        'email' => $user->email,
    ]);
}
```

---

## Bagian 3: Jurus Tingkat Lanjut - Factory Cerdas 🚀

### 8. 👨‍👩‍👧 Factory States - Variasi Data dalam Satu Cetakan

**Analogi:** Bayangkan kamu punya mesin cetak boneka yang bisa menghasilkan boneka dengan atribut berbeda seperti "boneka yang sedang tidur", "boneka yang marah", dll. Itulah Factory States!

**Mengapa?** Agar kamu bisa membuat variasi data tanpa harus buat factory baru.

**Bagaimana?** Gunakan method `state()`:

```php
<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    // ... definisi biasa

    // State: membuat user yang belum diverifikasi
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    // State: membuat user admin
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_admin' => true,
        ]);
    }

    // State: membuat user yang di-suspend
    public function suspended(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'suspended',
        ]);
    }
}
```

**Penggunaan States:**
```php
// Buat user biasa
$user = User::factory()->create();

// Buat user yang belum diverifikasi
$unverifiedUser = User::factory()->unverified()->create();

// Buat user admin
$adminUser = User::factory()->admin()->create();

// Buat user yang di-suspend
$suspendedUser = User::factory()->suspended()->create();
```

### 9. 🏎️ Factory Callbacks - Aksi Spesial Saat Membuat Data

**Analogi:** Seperti memiliki asisten pribadi yang bisa melakukan hal-hal tambahan setelah kamu memberinya perintah utama. Misalnya, setelah mencetak boneka, asisten langsung mengenakan baju pada boneka itu.

**Mengapa?** Untuk melakukan aksi tambahan sebelum atau sesudah data dibuat.

**Bagaimana?** Gunakan `afterMaking` dan `afterCreating`:

```php
<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    public function configure(): static
    {
        return $this->afterMaking(function (User $user) {
            // Aksi setelah data dibuat di memory (belum disimpan ke DB)
            // Contoh: mengisi variabel sementara
        })->afterCreating(function (User $user) {
            // Aksi setelah data disimpan ke database
            Profile::create([
                'user_id' => $user->id,
                'bio' => 'Ini adalah bio default pengguna baru',
            ]);
        });
    }
}
```

**Callback juga bisa digunakan di dalam state:**
```php
public function withProfile(): static
{
    return $this->afterCreating(function (User $user) {
        $user->profile()->create([
            'bio' => fake()->sentence(),
        ]);
    });
}
```

### 10. 🎨 Sequences - Pola Berulang dalam Dataset

**Analogi:** Bayangkan kamu ingin mencetak kartu pelajar dengan nomor urut bergantian: 001, 002, 003, dst. Atau kamu ingin mencetak pasangan suami-istri secara bergantian. Itulah kekuatan Sequences!

**Mengapa?** Untuk menciptakan pola dalam data yang kamu buat.

**Bagaimana?** Gunakan `Sequence`:

```php
use Illuminate\Database\Eloquent\Factories\Sequence;

// Membuat 10 user dengan pola admin dan non-admin bergantian
$users = User::factory()
    ->count(10)
    ->state(new Sequence(
        ['is_admin' => true],
        ['is_admin' => false],
    ))
    ->create();

// Membuat user dengan nama berurutan
$users = User::factory()
    ->count(5)
    ->state(new Sequence(
        fn (Sequence $sequence) => ['name' => 'User '.$sequence->index],
    ))
    ->create();
```

### 11. 🌐 Soft Delete State Bawaan

**Mengapa?** Untuk model yang menggunakan Soft Delete, Laravel menyediakan state bawaan `trashed`.

**Bagaimana?** Gunakan langsung:
```php
// Buat user yang "dihapus" (soft deleted)
$user = User::factory()->trashed()->create();

// Cek bahwa user ada tapi dihapus
$this->assertTrue($user->trashed());
```

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Factory 🧰

### 12. 🔐 Membuat Model dengan Override Atribut

**Mengapa?** Kadang kamu butuh membuat data dengan beberapa atribut tertentu yang berbeda dari default.

**Bagaimana?** Gunakan array saat memanggil `make()` atau `create()`:

```php
// Hanya override nama
$user = User::factory()->create([
    'name' => 'Abigail Otwell',
]);

// Override beberapa atribut
$user = User::factory()->create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'is_admin' => true,
]);
```

### 13. 💉 Membuat vs Menyimpan Data (make vs create)

**Prinsipnya: Jangan langsung simpan kalau belum yakin!** Ada dua pendekatan:

**Membuat di memory (belum ke database):**
```php
$user = User::factory()->make(); // Belum masuk database
$user->name = 'Jane Doe'; // Bisa diubah dulu
$user->save(); // Baru simpan
```

**Membuat dan langsung simpan:**
```php
$user = User::factory()->create(); // Langsung masuk database
```

**Contoh penggunaan make():**
```php
// Membuat beberapa user tanpa simpan dulu
$users = User::factory()->count(3)->make();

foreach ($users as $user) {
    $user->is_verified = true; // Modifikasi sebelum simpan
    $user->save();
}
```

### 14. 🎯 Membuat Banyak Data Sekaligus

**Mengapa?** Untuk seeding atau testing dengan jumlah data besar.

**Bagaimana?** Gunakan `count()`:

```php
// Buat 50 user sekaligus
$users = User::factory()->count(50)->create();

// Buat 10 user admin
$adminUsers = User::factory()->count(10)->admin()->create();

// Buat 3 user yang belum diverifikasi
$unverifiedUsers = User::factory()->count(3)->unverified()->create();
```

### 15. 🏗️ Definisi Relasi di Dalam Factory

**Mengapa?** Kadang kamu ingin otomatis membuat data terkait saat membuat model utama.

**Bagaimana?** Gunakan model factory di dalam definisi:

```php
<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(), // Buat user baru otomatis
            'title' => fake()->sentence(),
            'content' => fake()->paragraph(),
            'published_at' => now(),
        ];
    }
    
    // Jika butuh data tergantung atribut lain
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(),
            'content' => fake()->paragraph(),
            'user_type' => function (array $attributes) {
                // Tergantung user_id yang sudah dibuat
                return User::find($attributes['user_id'])->user_type;
            },
        ];
    }
}
```

### 16. 🔄 Recycle Model yang Sama

**Analogi:** Seperti menggunakan satu boneka untuk beberapa foto alih-alih membuat boneka baru untuk setiap foto. Hemat dan efisien!

**Mengapa?** Untuk menghemat resource saat membuat banyak relasi yang menggunakan model yang sama.

**Bagaimana?** Gunakan `recycle()`:

```php
use App\Models\Airline;

// Buat satu airline, gunakan untuk semua ticket
$airline = Airline::factory()->create();

$tickets = Ticket::factory()
    ->recycle($airline) // Gunakan airline yang sama
    ->count(10)
    ->create();

// Atau recycle banyak model sekaligus
$airlines = Airline::factory()->count(3)->create();
$tickets = Ticket::factory()
    ->recycle($airlines) // Gunakan dari 3 airlines yang dibuat
    ->count(10)
    ->create();
```

---

## Bagian 5: Menjadi Master Factory 🏆

### 17. ✨ Wejangan dari Guru

1.  **Gunakan Factory untuk Testing**: Jadikan Factory sebagai jalan utama untuk membuat data testing.
2.  **Bikin State untuk Variasi**: Jangan buat banyak factory berbeda, gunakan state untuk variasi.
3.  **Pakai Faker secara Bijak**: Gunakan jenis data yang realistis untuk aplikasimu.
4.  **Gunakan Sequence untuk Pola**: Saat butuh data dengan pola tertentu, gunakan sequence.
5.  **Hemat Resource dengan Recycle**: Gunakan `recycle()` saat membuat banyak relasi dengan model yang sama.

### 18. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk fitur Factory di Laravel:

#### 🏗️ Membuat Factory
| Perintah | Fungsi |
|----------|--------|
| `php artisan make:factory PostFactory` | Buat factory baru |
| `php artisan make:factory PostFactory --model=Post` | Buat factory yang terhubung ke model |

#### 🛠️ Membuat Data
| Metode | Fungsi |
|--------|--------|
| `User::factory()->make()` | Buat instance tanpa simpan ke DB |
| `User::factory()->create()` | Buat dan langsung simpan ke DB |
| `User::factory()->count(3)->create()` | Buat 3 record sekaligus |

#### 🎨 States dan Variasi
| Metode | Fungsi |
|--------|--------|
| `User::factory()->unverified()` | Gunakan state unverified |
| `User::factory()->admin()` | Gunakan state admin |
| `new Sequence([...])` | Buat pola berulang |

#### 🔗 Relationships
| Metode | Fungsi |
|--------|--------|
| `->has(Post::factory()->count(3))` | Buat dengan relasi hasMany |
| `->for(User::factory())` | Buat dengan relasi belongsTo |
| `->hasAttached(Role::factory(), [...])` | Buat dengan relasi manyToMany |

#### 🚀 Advanced Features
| Fitur | Fungsi |
|--------|--------|
| `->recycle($model)` | Gunakan model yang sama untuk efisiensi |
| `afterCreating(...)` | Callback setelah simpan ke DB |
| `afterMaking(...)` | Callback sebelum simpan ke DB |

#### 🎯 Faker Methods
| Method | Contoh Hasil |
|--------|--------------|
| `fake()->name()` | John Doe |
| `fake()->email()` | john@example.com |
| `fake()->paragraph()` | Lorem ipsum dolor sit amet... |
| `fake()->unique()->word()` | UniqueWord123 |

### 19. 🧩 Factory Relationships Lengkap

#### A. Has Many Relationship
```php
// Membuat user dengan 3 post
$user = User::factory()
    ->has(Post::factory()->count(3))
    ->create();

// Atau dengan magic method
$user = User::factory()->hasPosts(3)->create();
```

#### B. Belongs To Relationship
```php
// Membuat 3 post untuk satu user
$posts = Post::factory()
    ->count(3)
    ->for(User::factory()->state(['name' => 'Jessica Archer']))
    ->create();

// Atau dengan magic method
$posts = Post::factory()->count(3)->forUser(['name' => 'Jessica Archer'])->create();
```

#### C. Many to Many Relationship
```php
// Membuat user dengan 3 role
$user = User::factory()
    ->hasAttached(Role::factory()->count(3), ['active' => true])
    ->create();
```

#### D. Polymorphic Relationship
```php
// Membuat post dengan 3 komentar
$post = Post::factory()->hasComments(3)->create();

// Membuat komentar untuk post (morphTo)
$comments = Comment::factory()->count(3)->for(
    Post::factory(), 'commentable'
)->create();
```

### 20. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Eloquent Factory, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Dengan memahami dan menerapkan fitur ini, kamu telah membuat workflow pengembangan dan pengujian aplikasimu jauh lebih cepat, fleksibel, dan rapi.

Factory bukan hanya tentang membuat data dummy - ini adalah alat yang sangat ampuh untuk menciptakan skenario pengujian realistis dan mengisi database dengan data bermakna. Ingat, sebagai developer, kamu bukan hanya membuat fitur, kamu juga memastikan pengujian dan pengembangan bisa berjalan dengan lancar.

Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku!
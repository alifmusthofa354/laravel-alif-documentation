# 📦 Seeding di Laravel: Panduan dari Guru Kesayanganmu (Edisi Isi Database Super Mudah)

Hai murid-murid kesayanganku! Selamat datang di kelas database Laravel. Hari ini kita akan belajar tentang **Seeding** - cara mengisi database aplikasimu dengan data awal yang keren dan siap digunakan. Setelah mempelajari ini, kamu bisa membuat aplikasi dengan data contoh yang realistis seperti seorang master! Ayo kita mulai petualangan penyemaian database ini dengan semangat!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Itu Seeding Sebenarnya?

**Analogi:** Bayangkan kamu punya toko online kosong yang baru selesai dibangun. Tapi tanpa produk, pengguna, atau kategori, tempat itu terlihat membosankan dan tidak menarik. Nah, **Seeding adalah seperti menata barang-barang awal** ke dalam toko itu agar terlihat lengkap dan siap digunakan.

**Mengapa ini penting?** Karena saat pengembangan aplikasi, kamu butuh data contoh untuk melihat tampilan aplikasi secara keseluruhan. Tanpa data, tampilan kosong tidak akan memberimu gambaran bagusnya aplikasi.

**Bagaimana cara kerjanya?** 
1. **Kamu siapkan seeder class** seperti resep masakan.
2. **Seeder class** berisi instruksi untuk membuat data contoh.
3. **Kamu jalankan perintah Artisan** dan boom! Data contoh muncul di database.

Jadi, alur penyemaian kita menjadi:
`Seeder Class -> Perintah Artisan -> Data Contoh di Database`

Tanpa seeding, kamu akan mengisi data secara manual satu per satu, dan itu bukanlah cara seorang developer yang cerdas! 😎

### 2. ✍️ Membuat Seeder Pertamamu (Langkah Awal)

**Analogi:** Bayangkan kamu sedang membuat resep untuk membuat boneka mainan. Pertama, kamu harus membuat wadah resep itu sendiri. Nah, membuat seeder itu seperti membuat wadah resep untuk mengisi database.

**Mengapa ini penting?** Karena kamu butuh tempat untuk menulis instruksi pengisian data.

**Bagaimana cara kerjanya?** Gunakan perintah Artisan untuk membuat seeder:

```bash
# Buat seeder untuk user
php artisan make:seeder UserSeeder

# Seeder akan dibuat di direktori database/seeders/
```

**Struktur Seeder:**
```php
<?php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Jalankan seeder database
     */
    public function run(): void
    {
        // Tempat kamu menulis instruksi pengisian data
    }
}
```

**Penjelasan Kode:**
- `php artisan make:seeder UserSeeder`: Membuat file seeder baru
- `run()`: Metode utama yang berisi instruksi untuk mengisi data
- Tidak perlu khawatir tentang tempat penyimpanan, Laravel otomatis menempatkannya di `database/seeders/`

### 3. ⚡ Struktur Dasar Seeding (Pintu Masuk)

**Analogi:** Bayangkan kamu punya kunci utama (DatabaseSeeder) yang bisa membuka berbagai ruangan (seeder lainnya). DatabaseSeeder adalah seperti pintu utama yang bisa mengakses semua seeder lainnya.

**Mengapa ini ada?** Karena kamu bisa mengontrol urutan seeding dan memanggil banyak seeder sekaligus dari satu titik.

**Bagaimana cara kerjanya?** Laravel menyediakan DatabaseSeeder utama:

```php
<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Jalankan seeder database
     */
    public function run(): void
    {
        // Tempat kamu memanggil seeder lain
        $this->call([
            UserSeeder::class,
        ]);
    }
}
```

**Catatan Penting:**
- Perlindungan **mass assignment** secara otomatis dinonaktifkan selama seeding
- Ini memudahkanmu mengisi data tanpa harus mengatur fillable

---

## Bagian 2: Isi Database dengan Cepat - Model Factories 🤖

### 4. 📦 Menggunakan Model Factories (Pabrik Data Super Cepat)

**Analogi:** Bayangkan kamu punya pabrik boneka mainan otomatis. Kamu cukup menekan tombol dan boneka-boneka cantik langsung dibuat dalam jumlah banyak. Model Factory adalah seperti pabrik otomatis ini untuk membuat data contoh!

**Mengapa ini keren?** Karena kamu bisa membuat banyak data dengan satu baris kode, lengkap dengan data acak yang realistis.

**Bagaimana cara kerjanya?** Gunakan factory di dalam seeder:

**Contoh Lengkap:**
```php
<?php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Jalankan seeder database
     */
    public function run(): void
    {
        // Buat 10 user sekaligus dengan factory
        User::factory()->count(10)->create();
        
        // Atau buat user dengan relasi post
        User::factory()
            ->count(50)
            ->hasPosts(3) // setiap user punya 3 post
            ->create();
    }
}
```

**Jenis-jenis Pemanggilan Factory:**
```php
// Buat 1 user
User::factory()->create();

// Buat 5 user
User::factory()->count(5)->create();

// Buat user dengan data khusus
User::factory()->create([
    'name' => 'Alif',
    'email' => 'alif@example.com',
]);

// Buat user dengan relasi
User::factory()
    ->hasPosts(2) // 2 posts per user
    ->hasComments(5) // 5 comments per user
    ->create();

// Buat banyak user dengan relasi
User::factory()
    ->count(10)
    ->hasPosts(3)
    ->create();
```

### 5. 🛠️ Membuat Custom Factory (Pabrik Kustom)

**Mengapa perlu?** Karena terkadang kamu ingin data yang lebih spesifik dan tidak hanya data acak.

**Bagaimana?** Buat factory dengan perintah Artisan:
```bash
php artisan make:factory ProductFactory --model=Product
```

**Contoh Factory Lengkap:**
```php
<?php
// database/factories/ProductFactory.php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->productName(),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'stock' => $this->faker->numberBetween(0, 100),
            'sku' => $this->faker->unique()->ean13(),
        ];
    }

    // State untuk produk yang sedang diskon
    public function onSale(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'price' => $attributes['price'] * 0.8, // 20% diskon
                'on_sale' => true,
            ];
        });
    }
}
```

**Penggunaan Custom Factory:**
```php
<?php
// database/seeders/ProductSeeder.php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Buat 20 produk biasa
        Product::factory()->count(20)->create();
        
        // Buat 5 produk yang sedang diskon
        Product::factory()->count(5)->onSale()->create();
        
        // Buat produk dengan detail spesifik
        Product::factory()->create([
            'name' => 'Laptop Gaming',
            'price' => 15000000,
        ]);
    }
}
```

---

## Bagian 3: Jurus Tingkat Lanjut - Mengatur Urutan dan Kecepatan 🚀

### 6. 📂 Memanggil Seeder Lain (Konduktor Orkestra Data)

**Analogi:** Bayangkan kamu seorang konduktor orkestra. Kamu tidak memainkan semua instrumen sendiri, tapi memberi sinyal kapan masing-masing instrumen harus bermain. DatabaseSeeder adalah seperti konduktor yang mengatur kapan tiap seeder harus dijalankan.

**Mengapa ini penting?** Karena kamu bisa mengontrol urutan data yang dimasukkan, misalnya kategori harus ada dulu sebelum produk.

**Bagaimana cara kerjanya?** Gunakan metode `call()`:

**Contoh Lengkap:**
```php
<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Jalankan seeder database
     */
    public function run(): void
    {
        // Panggil seeder dalam urutan yang benar
        $this->call([
            CategorySeeder::class,      // Kategori harus ada dulu
            UserSeeder::class,          // User dibuat setelah kategori
            ProductSeeder::class,       // Produk bisa dibuat setelah user dan kategori
            OrderSeeder::class,         // Order dibuat setelah produk dan user
            CommentSeeder::class,       // Komentar bisa dibuat terakhir
        ]);
    }
}
```

**Contoh Seeder yang Bergantung pada Data Lain:**
```php
<?php
// database/seeders/ProductSeeder.php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil semua kategori yang sudah dibuat
        $categories = Category::all();
        
        // Buat produk untuk setiap kategori
        foreach ($categories as $category) {
            Product::factory()
                ->count(5)
                ->for($category) // Hubungkan ke kategori
                ->create();
        }
    }
}
```

### 7. 🔕 Menonaktifkan Model Events (Hindari Gangguan)

**Analogi:** Bayangkan kamu sedang menyalin buku ke buku lain. Tapi setiap kali kamu menyalin satu halaman, seseorang datang dan memberimu catatan tambahan (event). Ini akan membuat proses menyalin menjadi lambat. Menonaktifkan event adalah seperti mematikan pengganggu itu.

**Mengapa ini ada?** Karena saat seeding banyak data, model events bisa membuat proses jadi lambat dan tidak perlu.

**Bagaimana cara kerjanya?** Gunakan trait `WithoutModelEvents`:

**Contoh Lengkap:**
```php
<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents; // Nonaktifkan semua event model

    /**
     * Jalankan seeder database
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ProductSeeder::class,
        ]);
    }
}
```

**Jika hanya ingin menonaktifkan untuk seeder tertentu:**
```php
<?php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->count(100)->create(); // Proses cepat tanpa event
    }
}
```

### 8. 🏭 Menggunakan Query Builder Secara Manual (Pengisian Tangan)

**Analogi:** Terkadang kamu ingin mengisi data dengan cara yang sangat spesifik, seperti membuat resep masakan yang rumit dengan bahan-bahan yang harus pas. Query Builder adalah seperti sendok dan garpu yang membantumu mengisi data secara manual dengan presisi.

**Mengapa ini penting?** Karena terkadang kamu butuh kontrol penuh terhadap data yang dimasukkan.

**Bagaimana cara kerjanya?** Gunakan DB facade:

**Contoh Lengkap:**
```php
<?php
// database/seeders/ManualSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ManualSeeder extends Seeder
{
    public function run(): void
    {
        // Masukkan data secara manual
        DB::table('users')->insert([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'created_at' => now(),
        ]);
        
        // Masukkan banyak data sekaligus
        DB::table('categories')->insert([
            [
                'name' => 'Elektronik',
                'slug' => 'elektronik',
                'description' => 'Berbagai perangkat elektronik',
                'created_at' => now(),
            ],
            [
                'name' => 'Pakaian',
                'slug' => 'pakaian',
                'description' => 'Berbagai jenis pakaian',
                'created_at' => now(),
            ],
            [
                'name' => 'Buku',
                'slug' => 'buku',
                'description' => 'Berbagai jenis buku',
                'created_at' => now(),
            ],
        ]);
        
        // Gunakan transaction untuk keamanan data
        DB::transaction(function () {
            DB::table('products')->insert([
                'name' => 'Laptop Gaming',
                'description' => 'Laptop untuk bermain game',
                'price' => 15000000,
                'category_id' => 1, // Elektronik
                'created_at' => now(),
            ]);
            
            DB::table('product_images')->insert([
                [
                    'product_id' => DB::getPdo()->lastInsertId(),
                    'image_url' => 'laptop-gaming.jpg',
                    'created_at' => now(),
                ]
            ]);
        });
    }
}
```

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Seeding 🧰

### 9. 🔐 Dependency Injection di Seeder (Asisten Pribadi)

**Prinsipnya: Jangan buat sendiri, minta saja!** Butuh sesuatu? Tulis di parameter method, dan asisten ajaib Laravel (Service Container) akan menyiapkannya untukmu.

**Mengapa?** Ini membuat kodemu sangat fleksibel, mudah di-test, dan tidak terikat pada satu cara pembuatan objek.

**Bagaimana?** Laravel otomatis menyelesaikan dependencies di metode `run()`:

**Contoh Lengkap:**
```php
<?php
// database/seeders/AdvancedUserSeeder.php

namespace Database\Seeders;

use App\Models\User;
use App\Services\RoleService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdvancedUserSeeder extends Seeder
{
    public function run(
        RoleService $roleService  // Type-hint dependencies
    ): void 
    {
        // Buat user admin
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        
        // Tambahkan role menggunakan service
        $roleService->assignRole($admin, 'admin');
        
        // Buat beberapa user biasa
        User::factory()->count(10)->create()->each(function ($user) use ($roleService) {
            $roleService->assignRole($user, 'user');
        });
    }
}
```

### 10. 💉 Seeder dengan Kondisi (Pemilihan Cerdas)

Kadang kamu ingin menjalankan seeder hanya dalam kondisi tertentu:

**Contoh Seeder dengan Kondisi:**
```php
<?php
// database/seeders/ConditionalSeeder.php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\App;

class ConditionalSeeder extends Seeder
{
    public function run(): void
    {
        // Hanya jalankan di environment development
        if (App::environment('local', 'development')) {
            User::factory()->count(50)->create();
        }
        
        // Atau jalankan jika tabel kosong
        if (User::count() === 0) {
            User::factory()->count(10)->create([
                'email_verified_at' => now(),
            ]);
        }
        
        // Atau jalankan jika ada argumen tertentu
        if ($this->command->option('with-demo-users')) {
            User::factory()->count(100)->create();
        }
    }
}
```

### 11. 📋 Organisasi Seeder dalam Subfolder (Pengaturan Rapi)

Untuk aplikasi besar, kamu bisa mengorganisir seeder dalam subfolder:

**Struktur Folder:**
```
database/
└── seeders/
    ├── DatabaseSeeder.php
    ├── Auth/
    │   ├── UserSeeder.php
    │   └── RoleSeeder.php
    ├── Ecommerce/
    │   ├── ProductSeeder.php
    │   ├── CategorySeeder.php
    │   └── OrderSeeder.php
    └── Content/
        ├── PostSeeder.php
        └── PageSeeder.php
```

**Penggunaan:**
```php
<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            Auth\UserSeeder::class,
            Auth\RoleSeeder::class,
            Ecommerce\ProductSeeder::class,
            Ecommerce\CategorySeeder::class,
            Content\PostSeeder::class,
        ]);
    }
}
```

---

## Bagian 5: Menjadi Master Seeding Database 🏆

### 12. ✨ Wejangan dari Guru

1.  **Gunakan Factory untuk Data Massal:** Jangan buat data secara manual jika bisa pakai factory.
2.  **Atur Urutan Seeding:** Pastikan seeder yang bergantung pada data lain dijalankan setelahnya.
3.  **Gunakan WithoutModelEvents:** Untuk seeding banyak data, nonaktifkan event agar lebih cepat.
4.  **Gunakan Transaction:** Saat memasukkan data yang berelasi, gunakan transaction agar aman.
5.  **Pisahkan Seeder Berdasarkan Fungsi:** Organisasi seeder dalam subfolder untuk aplikasi besar.
6.  **Nonaktifkan Seeding di Production:** Gunakan `--force` hanya jika benar-benar diperlukan di production.

### 13. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Seeding di Laravel:

#### 🛠️ Perintah Artisan
| Perintah | Fungsi |
|----------|--------|
| `php artisan make:seeder UserSeeder` | Membuat seeder baru |
| `php artisan db:seed` | Menjalankan DatabaseSeeder |
| `php artisan db:seed --class=UserSeeder` | Menjalankan seeder tertentu |
| `php artisan migrate:fresh --seed` | Membangun ulang database + seeding |
| `php artisan db:seed --force` | Menjalankan seeding tanpa konfirmasi di production |

#### 🏭 Factory Methods
| Method | Fungsi |
|--------|--------|
| `User::factory()->create()` | Buat 1 user |
| `User::factory()->count(10)->create()` | Buat 10 user |
| `User::factory()->hasPosts(3)->create()` | Buat user dengan 3 post |
| `User::factory()->for(Category::first())` | Buat user dengan relasi ke kategori |

#### 🔧 Opsi Lanjutan
| Fitur | Penjelasan |
|-------|------------|
| `WithoutModelEvents` | Nonaktifkan semua event model |
| `DB::transaction()` | Kelompokkan query dalam satu transaksi |
| `type-hint dependencies` | Laravel otomatis injeksi dependencies |
| `App::environment()` | Cek environment saat ini |

#### 📂 Struktur Direktori
| Lokasi | Fungsi |
|--------|--------|
| `database/seeders/` | Tempat semua seeder |
| `database/factories/` | Tempat model factories |
| `App\Models\` | Model yang digunakan di seeder |

#### 🎯 Praktik Terbaik
| Praktik | Penjelasan |
|---------|------------|
| Gunakan factory | Lebih cepat dan fleksibel |
| Atur urutan dengan call() | Pastikan dependensi terpenuhi |
| Gunakan transaction | Untuk data yang berelasi |
| Nonaktifkan event | Saat seeding banyak data |
| Organisasi dalam folder | Untuk aplikasi besar |

### 14. ▶️ Menjalankan Seeder (Langkah Aksi)

Sekarang saatnya kamu mencoba sendiri!

**Jalankan semua seeder:**
```bash
php artisan db:seed
```

**Jalankan seeder tertentu:**
```bash
php artisan db:seed --class=UserSeeder
```

**Jalankan dengan fresh migrate:**
```bash
php artisan migrate:fresh --seed
```

**Jalankan dengan seeder spesifik setelah fresh migrate:**
```bash
php artisan migrate:fresh --seed --seeder=UserSeeder
```

### 15. ⚠️ Peringatan Produksi (Keamanan)

Seeding bisa **mengubah atau menghapus data**. Jadi:

- Laravel akan meminta konfirmasi saat dijalankan di environment production
- Untuk memaksa eksekusi tanpa konfirmasi: `php artisan db:seed --force`
- **Gunakan --force dengan sangat hati-hati** di production
- Sebaiknya tidak menjalankan seeding di production kecuali untuk tujuan tertentu

---

## Bagian 6: Contoh Lengkap Implementasi (Proyek Nyata) 🎯

Mari kita buat contoh lengkap implementasi seeding untuk aplikasi e-commerce:

**1. DatabaseSeeder (Pengatur Utama):**
```php
<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Jalankan seeder dalam urutan yang benar
        $this->call([
            CategorySeeder::class,      // Kategori pertama
            UserSeeder::class,          // User kedua
            ProductSeeder::class,       // Produk ketiga
            OrderSeeder::class,         // Order keempat
            ReviewSeeder::class,        // Review terakhir
        ]);
    }
}
```

**2. CategorySeeder (Data Dasar):**
```php
<?php
// database/seeders/CategorySeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categories')->insert([
            ['name' => 'Elektronik', 'slug' => 'elektronik', 'created_at' => now()],
            ['name' => 'Pakaian', 'slug' => 'pakaian', 'created_at' => now()],
            ['name' => 'Buku', 'slug' => 'buku', 'created_at' => now()],
            ['name' => 'Otomotif', 'slug' => 'otomotif', 'created_at' => now()],
        ]);
    }
}
```

**3. ProductSeeder (Menggunakan Factory & Relasi):**
```php
<?php
// database/seeders/ProductSeeder.php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil kategori dan buat produk untuk masing-masing
        Category::all()->each(function ($category) {
            Product::factory()
                ->count(10)
                ->for($category) // Hubungkan ke kategori
                ->create();
        });
    }
}
```

**4. OrderSeeder (Data Kompleks):**
```php
<?php
// database/seeders/OrderSeeder.php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // Buat beberapa order untuk user terverifikasi
        User::where('email_verified_at', '!=', null)->get()->each(function ($user) {
            $products = Product::inRandomOrder()->limit(3)->get();
            
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $products->sum('price'),
                'status' => 'completed',
                'created_at' => now(),
            ]);
            
            // Tambahkan produk ke order
            foreach ($products as $product) {
                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => rand(1, 3),
                    'price' => $product->price,
                ]);
            }
        });
    }
}
```

### 16. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi tentang Seeding di Laravel, dari konsep dasar hingga implementasi kompleks. Kamu hebat! Dengan memahami dan menerapkan seeding dengan benar, kamu sekarang bisa mempersiapkan database dengan data contoh yang realistis dan siap digunakan.

Ingat, **seeding adalah alat penting dalam pengembangan aplikasi**. Menguasainya berarti kamu sudah siap membuat aplikasi Laravel yang tidak hanya hebat, tapi juga mudah diuji dan dikembangkan.

Jangan pernah berhenti bereksperimen dengan berbagai teknik seeding! Semakin mahir kamu mengaturnya, semakin cepat dan efisien proses pengembangan aplikasimu. Selamat ngoding, murid kesayanganku! 🚀📦



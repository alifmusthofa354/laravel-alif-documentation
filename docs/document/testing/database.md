# 🗄️ Testing Database di Laravel: Panduan dari Guru Kesayanganmu (Edisi Validasi Data Super Kuat)

Hai murid-murid kesayanganku! Selamat datang di kelas testing database. Hari ini kita akan belajar tentang **Database Testing** - cara menguji aplikasimu dengan data yang akurat dan aman tanpa takut merusak database asli. Setelah mempelajari ini, kamu bisa menguji aplikasi seperti seorang master testing! Ayo kita mulai petualangan validasi database ini dengan semangat!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Itu Database Testing Sebenarnya?

**Analogi:** Bayangkan kamu seorang penjaga gudang (database) besar. Setiap kali ada orang yang ingin mengambil atau menaruh barang, kamu harus memastikan semuanya berjalan sesuai prosedur. Database testing adalah seperti **daftar periksa dan ujian keamanan** untuk memastikan setiap transaksi di gudangmu aman dan benar.

**Mengapa ini penting?** Karena aplikasi kamu bergantung pada data. Jika proses menyimpan, membaca, atau menghapus data tidak benar, aplikasimu bisa rusak atau memberikan hasil yang salah.

**Bagaimana cara kerjanya?** 
1. **Kamu buat lingkungan test** seperti gudang cadangan
2. **Kamu isi dengan data dummy** untuk mengetes fungsi
3. **Kamu jalankan test** dan periksa apakah semuanya bekerja sesuai harapan
4. **Kamu bersihkan semua data** agar tidak mengganggu test berikutnya

Jadi, alur testing database kita menjadi:
`Lingkungan Test -> Data Dummy -> Jalankan Test -> Validasi Hasil -> Bersihkan`

Tanpa testing database, kamu seperti jualan tanpa mengecek produknya dulu - bisa-bisa ada yang rusak dan pelanggan protes! 😰

### 2. ✍️ Mengapa Butuh Reset Database (Kebersihan Penting)

**Analogi:** Bayangkan kamu seorang chef yang memasak di dapur. Setelah memasak satu hidangan, kamu harus membersihkan semua peralatan dan bahan sisa agar tidak mengganggu masakan berikutnya. Reset database adalah seperti membersihkan dapurmu setelah setiap pengujian.

**Mengapa ini penting?** Karena kamu tidak ingin data dari test sebelumnya mempengaruhi test berikutnya.

**Bagaimana cara kerjanya?** Laravel menyediakan trait `RefreshDatabase`:

```php
<?php
// tests/Feature/UserTest.php

use Illuminate\Foundation\Testing\RefreshDatabase;

it('creates a user', function () {
    // Database otomatis di-reset sebelum test ini dijalankan
    $response = $this->post('/users', [
        'name' => 'Alif',
        'email' => 'alif@example.com',
        'password' => 'password',
    ]);

    // Test berjalan di lingkungan bersih
    $this->assertDatabaseCount('users', 1);
});
```

**Contoh Lengkap dengan Pest:**
```php
<?php
// tests/Feature/UserTest.php

use Illuminate\Foundation\Testing\RefreshDatabase;

pest()->use(RefreshDatabase::class); // Gunakan RefreshDatabase untuk semua test

test('basic example', function () {
    // Database bersih untuk setiap test
    $user = User::factory()->create();
    
    expect($user)->toBeInstanceOf(User::class);
});
```

**Penjelasan Kode:**
- `RefreshDatabase`: Membersihkan database setelah setiap test
- `pest()->use()`: Menerapkan trait untuk semua test dalam file ini
- Membuat lingkungan test yang konsisten dan bersih

### 3. ⚡ Perbedaan Mode Reset (Pilihan yang Tepat)

**Analogi:** Bayangkan kamu punya tiga cara membersihkan meja: 
1. Hanya mengelap permukaan (RefreshDatabase) - cepat dan efisien
2. Membongkar dan memasang ulang meja (DatabaseMigrations) - lebih bersih tapi lebih lama
3. Mengganti seluruh meja (DatabaseTruncation) - paling bersih tapi paling lama

**Mengapa ada pilihan?** Karena tergantung kebutuhan speed vs thoroughness.

**Bagaimana cara kerjanya?**
```php
<?php
// RefreshDatabase (rekomendasi)
use Illuminate\Foundation\Testing\RefreshDatabase;
// - Hanya truncate data, tidak migrate ulang jika schema sudah ada
// - Cepat dan efisien

// DatabaseMigrations (lebih lambat)
use Illuminate\Foundation\Testing\DatabaseMigrations;
// - Migrate ulang dari awal setiap test
// - Bagus jika struktur database sering berubah

// DatabaseTruncation (paling bersih tapi lambat)
use Illuminate\Foundation\Testing\DatabaseTruncation;
// - Hapus semua data dari semua tabel
// - Paling bersih tapi paling lambat
```

---

## Bagian 2: Menyediakan Data Uji - Model Factories 🤖

### 4. 📦 Menggunakan Model Factories (Pabrik Data Cerdas)

**Analogi:** Bayangkan kamu punya mesin pencetak boneka yang bisa membuat boneka dengan berbagai wajah, pakaian, dan kepribadian secara otomatis. Model Factories adalah seperti mesin ajaib ini yang bisa mencetak data dummy dengan berbagai variasi hanya dengan satu perintah!

**Mengapa ini keren?** Karena kamu bisa membuat banyak data dengan cepat, lengkap dengan data acak yang realistis, tanpa harus mengetik manual satu per satu.

**Bagaimana cara kerjanya?** Gunakan factory di dalam test:

**Contoh Lengkap dengan Model Factory:**
```php
<?php
// tests/Feature/UserTest.php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can create a user', function () {
    // Buat satu user dengan factory
    $user = User::factory()->create();
    
    // Periksa user telah dibuat
    $this->assertDatabaseCount('users', 1);
    $this->assertModelExists($user);
});

it('can create multiple users', function () {
    // Buat 10 user sekaligus
    $users = User::factory()->count(10)->create();
    
    // Periksa jumlahnya
    $this->assertDatabaseCount('users', 10);
});

it('can create user with specific data', function () {
    // Buat user dengan data spesifik
    $user = User::factory()->create([
        'name' => 'Alif Testing',
        'email' => 'alif@test.com',
    ]);
    
    // Periksa datanya sesuai
    $this->assertDatabaseHas('users', [
        'name' => 'Alif Testing',
        'email' => 'alif@test.com',
    ]);
});

it('can create user with relationships', function () {
    // Buat user dengan posts
    $user = User::factory()
        ->hasPosts(3) // Buat 3 post untuk user ini
        ->create();
    
    // Periksa jumlah post
    expect($user->posts)->toHaveCount(3);
});

it('can create user with state', function () {
    // Buat user dengan kondisi tertentu
    $admin = User::factory()
        ->admin() // Gunakan state khusus
        ->create();
    
    $this->assertTrue($admin->is_admin);
});
```

**Contoh Factory yang Lebih Lengkap:**
```php
<?php
// database/factories/UserFactory.php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // password default
            'remember_token' => Str::random(10),
            'is_admin' => false,
        ];
    }

    // State untuk user admin
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);
    }

    // State untuk user yang belum verifikasi email
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
```

### 5. 🌱 Menjalankan Seeder di Testing (Isi Awal Gudang)

**Analogi:** Bayangkan kamu membuka toko online baru. Sebelum bisa beroperasi, kamu harus mengisi gudang dengan produk dasar seperti kategori, status order, atau pengguna admin. Seeder adalah seperti petugas yang otomatis mengisi gudang dengan data dasar yang diperlukan.

**Mengapa ini penting?** Karena beberapa fitur aplikasi membutuhkan data dasar untuk bisa diuji.

**Bagaimana cara kerjanya?** Jalankan seeder di dalam test:

**Contoh Lengkap dengan Seeder:**
```php
<?php
// tests/Feature/OrderTest.php

use Database\Seeders\OrderStatusSeeder;
use Database\Seeders\TransactionStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can create order with status', function () {
    // Jalankan seeder untuk mengisi data status
    $this->seed(OrderStatusSeeder::class);
    
    // Sekarang kamu bisa membuat order dengan status yang valid
    $order = Order::create([
        'user_id' => User::factory()->create()->id,
        'status_id' => OrderStatus::where('name', 'pending')->first()->id,
        'total_amount' => 100000,
    ]);

    $this->assertDatabaseHas('orders', [
        'status_id' => $order->status_id,
        'total_amount' => 100000,
    ]);
});

it('can run multiple seeders', function () {
    // Jalankan beberapa seeder sekaligus
    $this->seed([
        OrderStatusSeeder::class,
        TransactionStatusSeeder::class,
    ]);

    // Sekarang semua data dasar telah siap
    $this->assertDatabaseCount('order_statuses', 4); // pending, processing, completed, cancelled
    $this->assertDatabaseCount('transaction_statuses', 3); // success, failed, pending
});

it('can run default DatabaseSeeder', function () {
    // Jalankan DatabaseSeeder (default) yang memanggil semua seeder
    $this->seed();

    // Semua data dari DatabaseSeeder telah dibuat
    $this->assertDatabaseCount('users', 10); // dari UserSeeder
    $this->assertDatabaseCount('products', 20); // dari ProductSeeder
});
```

**Auto-Seed di TestCase Base:**
```php
<?php
// tests/TestCase.php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Jalankan DatabaseSeeder sebelum setiap test.
     *
     * @var bool
     */
    protected $seed = true; // Ini akan menjalankan DatabaseSeeder otomatis
}

// Atau hanya seeder tertentu
class TestCase extends BaseTestCase
{
    /**
     * Jalankan seeder spesifik sebelum test.
     *
     * @var string
     */
    protected $seeder = OrderStatusSeeder::class; // Hanya jalankan OrderStatusSeeder
}
```

---

## Bagian 3: Jurus Validasi Data - Database Assertions 🚀

### 6. 🧪 Assertion untuk Mengecek Jumlah Data

**Analogi:** Bayangkan kamu seorang akuntan yang harus memastikan jumlah barang di gudang sesuai dengan catatan. Assertion database adalah seperti alat penghitung otomatis yang bisa memastikan jumlah data di database sesuai dengan harapanmu.

**Mengapa ini penting?** Karena kamu harus tahu apakah data benar-benar telah disimpan di database.

**Bagaimana cara kerjanya?** Ini beberapa assertion untuk mengecek jumlah:

**Contoh Lengkap Assertion Jumlah:**
```php
<?php

it('creates exactly one user', function () {
    // Buat user
    $response = $this->post('/users', [
        'name' => 'New User',
        'email' => 'newuser@example.com',
        'password' => 'password123',
    ]);

    // Mengecek jumlah user sekarang adalah 1
    $this->assertDatabaseCount('users', 1);
});

it('does not create user when validation fails', function () {
    // Mencoba membuat user dengan data invalid
    $response = $this->post('/users', [
        'name' => '', // Nama kosong
        'email' => 'invalid-email', // Email tidak valid
        'password' => '123', // Password terlalu pendek
    ]);

    // Mengecek tidak ada user yang dibuat
    $this->assertDatabaseEmpty('users');
});

it('can check exact number of records', function () {
    // Buat beberapa user
    User::factory()->count(5)->create();

    // Mengecek jumlahnya benar 5
    $this->assertDatabaseCount('users', 5);
});

it('can check database is empty', function () {
    // Pastikan tabel kosong sebelum test
    $this->assertDatabaseEmpty('users');

    // Tambahkan user
    $user = User::factory()->create();

    // Sekarang tidak kosong
    $this->assertDatabaseHas('users', [
        'email' => $user->email,
    ]);
});
```

### 7. 🔍 Assertion untuk Mengecek Keberadaan Data

**Analogi:** Bayangkan kamu seorang detektif yang mencari jejak kejahatan. Kamu harus bisa mengonfirmasi bahwa bukti (data) yang kamu cari memang ada di tempat kejadian. Assertion keberadaan data adalah seperti kaca pembesar detektif yang bisa menemukan data spesifik atau memastikan data tidak ada.

**Mengapa ini penting?** Karena kamu harus tahu apakah data yang diharapkan benar-benar ada atau tidak ada di database.

**Bagaimana cara kerjanya?** Ini beberapa assertion untuk mengecek keberadaan:

**Contoh Lengkap Assertion Keberadaan:**
```php
<?php

it('creates user with correct data', function () {
    $userData = [
        'name' => 'Alif Testing',
        'email' => 'alif@test.com',
        'password' => bcrypt('password123'),
    ];

    // Simulasikan pembuatan user
    User::create($userData);

    // Mengecek data user ada di database
    $this->assertDatabaseHas('users', [
        'name' => 'Alif Testing',
        'email' => 'alif@test.com',
    ]);
});

it('does not store invalid data', function () {
    // Mencoba menyimpan data invalid
    $response = $this->post('/users', [
        'name' => 'Invalid User',
        'email' => 'invalid-email',
        'password' => '123',
    ]);

    // Mengecek data invalid tidak disimpan
    $this->assertDatabaseMissing('users', [
        'name' => 'Invalid User',
        'email' => 'invalid-email',
    ]);
});

it('can verify specific user exists', function () {
    $user = User::factory()->create([
        'email' => 'unique@example.com',
    ]);

    // Mengecek user spesifik ada
    $this->assertDatabaseHas('users', [
        'email' => 'unique@example.com',
        'id' => $user->id,
    ]);
});

it('can verify user does not exist anymore after deletion', function () {
    $user = User::factory()->create([
        'email' => 'todelete@example.com',
    ]);

    // Hapus user
    $user->delete();

    // Mengecek user tidak lagi ada
    $this->assertDatabaseMissing('users', [
        'id' => $user->id,
    ]);
});
```

### 8. 🕊️ Assertion untuk Soft Delete

**Analogi:** Bayangkan kamu punya kotak arsip yang berisi dokumen yang "ditandai" untuk dihapus tapi belum benar-benar dihancurkan. Soft delete adalah seperti sistem arsip ini - data masih ada tapi ditandai sebagai dihapus. Assertion soft delete adalah seperti petugas arsip yang bisa memeriksa apakah dokumen sudah ditandai untuk dihapus atau tidak.

**Mengapa ini penting?** Karena kamu sering menggunakan soft delete untuk menjaga data penting tapi tetap menandai bahwa itu tidak aktif lagi.

**Bagaimana cara kerjanya?** Ini assertion untuk soft delete:

**Contoh Lengkap Soft Delete:**
```php
<?php

it('soft deletes user correctly', function () {
    $user = User::factory()->create();

    // Soft delete user
    $user->delete();

    // Mengecek user di-soft delete
    $this->assertSoftDeleted($user);

    // Atau dengan mengecek secara spesifik
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'deleted_at' => $user->deleted_at->toISOString(),
    ]);
});

it('does not soft delete user when not needed', function () {
    $user = User::factory()->create();

    // User tidak dihapus
    $this->assertNotSoftDeleted($user);

    // Atau dengan mengecek deleted_at null
    $this->assertDatabaseMissing('users', [
        'id' => $user->id,
        'deleted_at' => now(),
    ]);
});

it('can check soft deleted records', function () {
    $user = User::factory()->create();
    $user->delete();

    // Ambil user yang di-soft delete
    $deletedUser = User::onlyTrashed()->find($user->id);

    // Mengecek bahwa user memang dihapus sementara
    $this->assertNotNull($deletedUser);
    $this->assertTrue($deletedUser->trashed());
});

it('can restore soft deleted user', function () {
    $user = User::factory()->create();
    $user->delete(); // Soft delete

    // Cek soft deleted
    $this->assertSoftDeleted($user);

    // Restore user
    $user->restore();

    // Sekarang tidak lagi soft deleted
    $this->assertNotSoftDeleted($user);
    $this->assertModelExists($user);
});
```

### 9. 👤 Assertion untuk Model Instance

**Analogi:** Bayangkan kamu seorang kurator museum yang harus memastikan bahwa setiap benda pameran (model instance) memang benar-benar ada di dalam museum (database). Assertion model adalah seperti sistem pencocokan unik yang bisa memastikan benda pameran dengan ID spesifik memang benar-benar ada atau sudah dihapus.

**Mengapa ini penting?** Karena kamu sering bekerja dengan model instance dan ingin tahu apakah instance tersebut masih valid di database.

**Bagaimana cara kerjanya?** Ini assertion untuk model instance:

**Contoh Lengkap Model Assertion:**
```php
<?php

it('creates model that exists in database', function () {
    $user = User::factory()->create();

    // Mengecek bahwa model instance benar-benar ada di database
    $this->assertModelExists($user);

    // Atau dengan cara lain
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'email' => $user->email,
    ]);
});

it('confirms model is removed from database after deletion', function () {
    $user = User::factory()->create();

    // Pastikan awalnya ada
    $this->assertModelExists($user);

    // Hapus user
    $user->delete();

    // Sekarang model harus hilang dari database
    $this->assertModelMissing($user);

    // Atau dengan cara lain
    $this->assertDatabaseMissing('users', [
        'id' => $user->id,
    ]);
});

it('can verify same model instances', function () {
    $user1 = User::factory()->create();
    $user2 = User::find($user1->id); // Ambil dari database

    // Mengecek bahwa model instance sama
    $this->assertTrue($user1->is($user2));
    
    // Mengecek bahwa dua model instance berbeda
    $differentUser = User::factory()->create();
    $this->assertFalse($user1->is($differentUser));
});

it('can handle model existence checks', function () {
    $user = User::factory()->create();

    // Cek model ada
    expect($user->exists)->toBeTrue();

    // Hapus dan cek model tidak ada
    $user->delete();
    expect($user->exists)->toBeFalse();
});
```

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Testing Database 🧰

### 10. 📈 Menghitung Query Database (Performance Check)

**Analogi:** Bayangkan kamu seorang manajer restoran dan ingin tahu apakah koki terlalu banyak mengambil bahan dari gudang. Menghitung query database adalah seperti sistem pelacak yang bisa memberitahu kamu berapa kali aplikasimu mengakses gudang (database), sehingga kamu bisa tahu apakah ada pemborosan.

**Mengapa ini penting?** Karena query yang terlalu banyak bisa membuat aplikasimu lambat dan boros resource.

**Bagaimana cara kerjanya?** Gunakan `expectsDatabaseQueryCount`:

**Contoh Lengkap Query Counting:**
```php
<?php

it('performs expected number of queries', function () {
    // Tunggu maksimal 5 query database
    $this->expectsDatabaseQueryCount(5);

    // Buat beberapa user
    User::factory()->count(3)->create();

    // Ambil user dengan posts - ini bisa menghasilkan beberapa query
    $users = User::with('posts')->get();

    // Asumsikan: 1 query untuk users, 1 untuk posts (eager loading)
    // Total sekitar 2 query, jadi masih di bawah batas 5
});

it('avoids n+1 query problem', function () {
    // Buat user dengan posts
    $users = User::factory()
        ->count(10)
        ->hasPosts(3) // Setiap user punya 3 post
        ->create();

    // TANPA eager loading - ini akan menyebabkan n+1 problem
    $this->expectsDatabaseQueryCount(100); // Bisa sampai 10+30 query

    $users = User::all(); // 1 query
    foreach ($users as $user) {
        $user->posts; // 10 query tambahan
    }

    // DENGAN eager loading - jauh lebih efisien
    $this->expectsDatabaseQueryCount(5); // Sekitar 2 query maksimal

    $users = User::with('posts')->get(); // 2 query total
});

it('can test query efficiency', function () {
    // Buat banyak data
    User::factory()->count(50)->create();

    // Menguji efisiensi query
    $this->expectsDatabaseQueryCount(2);

    // Query efisien
    $users = User::where('active', true)
        ->withCount('posts') // Gunakan withCount daripada with
        ->paginate(10);
});
```

### 11. 🔧 Transaksi dalam Testing (Isolasi Sempurna)

**Analogi:** Bayangkan kamu sedang melakukan eksperimen ilmiah dalam ruang hampa udara yang terpisah dari dunia luar. Transaksi database dalam testing adalah seperti ruang hampa ini - semua perubahan data terjadi dalam lingkungan isolasi dan tidak akan mempengaruhi database asli.

**Mengapa ini penting?** Karena transaksi memastikan bahwa semua perubahan database dalam satu test akan di-rollback (dibatalkan) jika test gagal, menjaga kebersihan lingkungan test.

**Bagaimana cara kerjanya?** Laravel otomatis menggunakan transaksi dengan `RefreshDatabase`:

**Contoh Lengkap dengan Transaksi:**
```php
<?php

it('uses transaction to ensure clean state', function () {
    // Semua perubahan dalam test ini akan diisolasi
    $user = User::factory()->create([
        'name' => 'Transaction Test User',
    ]);

    // Cek user dibuat
    $this->assertDatabaseHas('users', [
        'name' => 'Transaction Test User',
    ]);

    // Jika test selesai (baik sukses maupun gagal)
    // Semua perubahan akan di-rollback karena RefreshDatabase
    // Jadi database tetap bersih untuk test berikutnya
});

it('can test transaction rollback', function () {
    $this->expectException(Exception::class);

    DB::transaction(function () {
        $user = User::create([
            'name' => 'Transaction User',
            'email' => 'transaction@example.com',
        ]);

        // Cek user ada
        $this->assertDatabaseHas('users', [
            'email' => 'transaction@example.com',
        ]);

        // Buat exception untuk trigger rollback
        throw new Exception('Force rollback');
    });

    // Karena exception, transaksi dibatalkan
    $this->assertDatabaseMissing('users', [
        'email' => 'transaction@example.com',
    ]);
});
```

### 12. 🎯 Setup dan Teardown Manual (Kontrol Penuh)

**Analogi:** Bayangkan kamu seorang sutradara film yang ingin mengatur sendiri semua aspek panggung sebelum dan sesudah syuting. Setup dan teardown manual adalah seperti kontrol penuhmu atas persiapan dan pembersihan lingkungan test sebelum dan sesudah eksekusi.

**Mengapa ini penting?** Karena terkadang kamu butuh setup khusus yang tidak bisa dicapai dengan trait Laravel saja.

**Bagaimana cara kerjanya?** Gunakan metode `setUp` dan `tearDown`:

**Contoh Lengkap Setup/Teardown:**
```php
<?php

it('has full control over test environment', function () {
    // Setup manual sebelum test
    $this->setUpDatabase();
    
    // Jalankan test
    $user = User::factory()->create();
    $this->assertModelExists($user);
    
    // Teardown manual setelah test
    $this->cleanUpTestEnvironment();
});

// Atau dengan before/after hooks
it('runs with custom setup', function () {
    // Setup sebelum test
    $this->beforeTestSetup();
    
    // Isi test
    expect(true)->toBeTrue();
    
    // Cleanup setelah test
    $this->afterTestCleanup();
})->beforeEach(function () {
    // Ini berjalan sebelum setiap test dalam file ini
    $this->setUpForTesting();
});
```

---

## Bagian 5: Menjadi Master Testing Database 🏆

### 13. ✨ Wejangan dari Guru

1.  **Gunakan `RefreshDatabase`** untuk sebagian besar test - cepat dan efisien.
2.  **Manfaatkan Model Factories** - jangan membuat data secara manual, gunakan factory!
3.  **Gunakan Seeder untuk data awal** - seperti status order, role, dll.
4.  **Periksa jumlah query** - hindari N+1 problem dan query yang tidak efisien.
5.  **Gunakan assertion yang tepat** - `assertDatabaseHas` untuk data yang harus ada, `assertDatabaseMissing` untuk data yang tidak boleh ada.
6.  **Test soft delete juga** - jangan lupa periksa apakah data benar-benar dihapus atau hanya di-soft delete.
7.  **Gunakan `assertModelExists/absent`** untuk instance model spesifik.

### 14. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Database Testing di Laravel:

#### 🔄 Reset Database
| Trait | Kecepatan | Kegunaan |
|-------|-----------|----------|
| `RefreshDatabase` | Cepat | Rekomendasi umum |
| `DatabaseMigrations` | Lambat | Jika struktur sering berubah |
| `DatabaseTruncation` | Paling lambat | Pembersihan paling menyeluruh |

#### 🏗️ Data Setup
| Metode | Fungsi |
|--------|--------|
| `User::factory()->create()` | Buat data dengan factory |
| `$this->seed()` | Jalankan DatabaseSeeder |
| `$this->seed(Seeder::class)` | Jalankan seeder spesifik |
| `$this->seed([A::class, B::class])` | Jalankan banyak seeder |

#### 🧪 Database Assertions
| Assertion | Kegunaan |
|-----------|----------|
| `assertDatabaseCount('table', count)` | Cek jumlah record |
| `assertDatabaseEmpty('table')` | Cek tabel kosong |
| `assertDatabaseHas('table', data)` | Cek data ada |
| `assertDatabaseMissing('table', data)` | Cek data tidak ada |
| `assertSoftDeleted($model)` | Cek model soft deleted |
| `assertNotSoftDeleted($model)` | Cek model tidak soft deleted |
| `assertModelExists($model)` | Cek model instance ada |
| `assertModelMissing($model)` | Cek model instance tidak ada |
| `expectsDatabaseQueryCount(n)` | Cek jumlah query |

#### 📊 Performance Testing
| Teknik | Tujuan |
|--------|--------|
| `withCount()` | Hindari N+1 problem |
| `expectsDatabaseQueryCount()` | Batasi jumlah query |
| `eager loading` | Muat relasi efisien |

#### 🧪 Pest Setup
| Setup | Fungsi |
|-------|--------|
| `pest()->use(RefreshDatabase::class)` | Gunakan trait untuk semua test |
| `uses(RefreshDatabase::class)` | Alternatif penulisan |
| `beforeEach()` | Setup sebelum setiap test |
| `afterEach()` | Cleanup setelah setiap test |

### 15. 🧪 Contoh Lengkap Implementasi Test

Mari kita buat contoh lengkap implementasi test untuk sebuah fitur:

**1. Test untuk User Registration:**
```php
<?php
// tests/Feature/UserRegistrationTest.php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

it('registers a new user successfully', function () {
    $userData = [
        'name' => 'New Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post('/register', $userData);

    // Cek redirect atau response
    $response->assertRedirect('/dashboard');

    // Cek user dibuat di database
    $this->assertDatabaseCount('users', 1);
    $this->assertDatabaseHas('users', [
        'name' => 'New Test User',
        'email' => 'test@example.com',
    ]);

    // Cek password di-hash
    $user = User::first();
    expect(Hash::check('password123', $user->password))->toBeTrue();
});

it('fails to register with invalid data', function () {
    $userData = [
        'name' => '', // Nama kosong
        'email' => 'invalid-email', // Email tidak valid
        'password' => '123', // Password terlalu pendek
    ];

    $response = $this->post('/register', $userData);

    // Cek validasi gagal
    $response->assertSessionHasErrors(['name', 'email', 'password']);

    // Cek user tidak dibuat
    $this->assertDatabaseEmpty('users');
});

it('ensures unique email constraint', function () {
    // Buat user pertama
    $user1 = User::factory()->create([
        'email' => 'unique@example.com',
    ]);

    // Coba buat user kedua dengan email yang sama
    $userData = [
        'name' => 'Second User',
        'email' => 'unique@example.com', // Sama dengan user1
        'password' => 'password123',
    ];

    $response = $this->post('/register', $userData);

    // Cek validasi email unique
    $response->assertSessionHasErrors('email');

    // Cek tetap hanya ada 1 user
    $this->assertDatabaseCount('users', 1);
});
```

**2. Test untuk User Profile Update:**
```php
<?php
// tests/Feature/UserProfileTest.php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('updates user profile successfully', function () {
    $user = User::factory()->create([
        'name' => 'Original Name',
        'email' => 'original@example.com',
    ]);

    $this->actingAs($user);

    $response = $this->put('/profile', [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
    ]);

    $response->assertRedirect();

    // Cek data diperbarui
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
    ]);
});

it('does not update with invalid data', function () {
    $user = User::factory()->create([
        'name' => 'Original Name',
    ]);

    $this->actingAs($user);

    $response = $this->put('/profile', [
        'name' => '', // Nama kosong
        'email' => 'invalid-email',
    ]);

    $response->assertSessionHasErrors(['name', 'email']);

    // Cek data tidak berubah
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Original Name', // Nama tetap original
    ]);
});
```

### 16. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi tentang Testing Database di Laravel, dari konsep dasar hingga teknik-teknik lanjut. Kamu hebat! Dengan memahami dan menerapkan database testing dengan benar, kamu sekarang bisa membuat test yang kuat dan bisa dipercaya seperti seorang master testing.

Ingat, **database testing adalah fondasi penting dalam aplikasi yang handal**. Menguasainya berarti kamu sudah siap membuat aplikasi Laravel yang tidak hanya hebat, tapi juga aman dari bug dan bisa dipercaya secara konsisten.

Jangan pernah berhenti bereksperimen dengan berbagai teknik testing! Semakin mahir kamu menggunakannya, semakin percaya diri kamu dalam mengembangkan aplikasi yang berkualitas tinggi. Selamat ngoding, murid kesayanganku! 🚀🗄️

```

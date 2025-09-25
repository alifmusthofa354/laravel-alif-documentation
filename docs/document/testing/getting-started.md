# 🧪 Panduan Pengujian di Laravel: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Bayangkan kamu adalah seorang insinyur konstruksi yang membangun gedung pencakar langit. Sebelum menyerahkan kunci gedung ke pemiliknya, kamu pasti ingin memastikan bahwa setiap tiang, setiap lantai, dan setiap sistem berfungsi dengan **sempurna**, bukan? Kamu tidak ingin ada kecelakaan atau kerusakan di masa depan, kan? Itulah **testing** dalam dunia pemrograman - kamu menguji setiap bagian aplikasimu sebelum "diserahkan" ke pengguna. Laravel menyediakan alat-alat yang canggih untuk membantumu melakukannya dengan percaya diri dan efisien!

Siap belajar bagaimana menjadi "insinyur kualitas perangkat lunak" yang handal? Ayo kita mulai petualangan ini!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Testing Itu Sebenarnya?

**Analogi:** Bayangkan kamu adalah seorang chef restoran terkenal. Sebelum menyajikan hidangan ke pelanggan, kamu pasti mencicipinya terlebih dahulu, kan? Apakah rasanya pas? Apakah tampilannya menarik? Apakah tidak ada bahan yang salah? Itulah testing! Kamu **mengujicoba** hidanganmu sebelum disajikan. Di dunia Laravel, testing adalah **cara untuk memastikan kode kamu berjalan seperti yang kamu harapkan**, tanpa error atau bug yang tidak terduga.

**Mengapa ini penting?** Karena:
1.  **Kamu bisa mendeteksi bug lebih awal**, sebelum pengguna mengalaminya.
2.  **Kamu bisa yakin bahwa kode baru tidak merusak kode lama**.
3.  **Kamu bisa membuat fitur baru dengan percaya diri**, tahu bahwa yang sudah ada tetap berfungsi.
4.  **Kode kamu jadi lebih aman dan stabil** secara keseluruhan.

**Bagaimana cara kerjanya?** Secara umum, alurnya seperti ini:
`➡️ Tulis Test -> 🧪 Jalankan Test -> ✅ Lihat Hasil (Pass/Fail) -> 🔧 Perbaiki Jika Gagal -> 🎉 Ulangi`

Tanpa testing, kamu mungkin harus menguji semua fitur secara manual setiap kali kamu menambahkan sesuatu baru - itu bisa sangat melelahkan dan tidak efisien!

### 2. ✍️ Resep Pertamamu: Jalankan Test dari Nol

Ini adalah fondasi paling dasar. Mari kita jalankan test pertama dari nol, langkah demi langkah.

#### Langkah 1️⃣: Cek File Testing Bawaan Laravel
**Mengapa?** Laravel sudah menyediakan test contoh untuk kamu lihat.

**Bagaimana?** Buka folder `tests/` di project Laravel kamu.
```
tests/
├── Feature/
│   └── ExampleTest.php
└── Unit/
    └── ExampleTest.php
```
Di sinilah tempat test-test disimpan.

#### Langkah 2️⃣: Lihat Contoh Test
**Mengapa?** Supaya kamu tahu bentuk dasar dari test di Laravel.

**Bagaimana?** Lihat file `tests/Feature/ExampleTest.php`:
```php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
```

#### Langkah 3️⃣: Jalankan Test dari Command Line
**Mengapa?** Supaya kamu bisa lihat test benar-benar berjalan.

**Bagaimana?** Gunakan perintah Artisan di terminal kamu.
```bash
php artisan test
```
Kamu akan melihat output seperti ini:
```
PASS  Tests\Feature\ExampleTest
  ✓ the application returns a successful response

Tests:  1 passed
```

**Penjelasan Kode:**
- `$this->get('/')`: Membuat request HTTP GET ke route `/`.
- `$response->assertStatus(200)`: Memastikan response status code adalah 200 (OK).

Selesai! 🎉 Sekarang kamu telah berhasil menjalankan test pertamamu dan melihat bahwa halaman utama aplikasi kamu berjalan dengan baik!

### 3. ⚡ Perbedaan Unit vs Feature Test

**Analogi:** Jika kamu adalah chef, **Unit Test** seperti mencicipi setiap bahan mentah satu per satu (garam, gula, bawang) untuk memastikan rasanya pas. **Feature Test** seperti mencicipi hidangan lengkap (nasi goreng) untuk memastikan semua bahan bekerja sama dengan baik dan hidangannya lezat.

**Mengapa ini penting?** Karena kamu harus tahu kapan harus menggunakan yang mana.

**Perbedaannya:**
*   **Unit Test**: Menguji bagian **kecil dan terisolasi** dari kode, seperti satu method di class. Ini **tidak mem-boot Laravel** secara penuh (tidak bisa akses database, cache, dll).
*   **Feature Test**: Menguji bagian **besar dan kompleks** dari aplikasi, seperti request HTTP, interaksi antar service, atau seluruh alur bisnis. Ini **mem-boot Laravel** secara penuh.

Contoh:
```php
// Unit Test - Menguji method di class
class CalculatorTest extends TestCase
{
    public function test_addition(): void
    {
        $calc = new Calculator();
        $result = $calc->add(2, 3);
        $this->assertEquals(5, $result); // Hasil harus 5
    }
}

// Feature Test - Menguji request ke controller
class UserTest extends TestCase
{
    public function test_user_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(302); // Redirect setelah sukses
        $this->assertDatabaseHas('users', ['email' => 'budi@example.com']);
    }
}
```

---

## Bagian 2: Menulis Test dengan Pest & PHPUnit 🤖

### 4. 📦 Pest vs PHPUnit - Pilihanmu!

**Analogi:** Bayangkan kamu punya dua alat untuk mencicipi makanan. Keduanya bisa memberitahumu apakah makanannya enak, tapi satu alat mungkin terasa lebih "alami" dan cepat digunakan untukmu. Laravel mendukung **Pest** dan **PHPUnit**.

**Mengapa ini penting?** Karena kamu harus tahu opsi yang tersedia dan pilih yang paling kamu suka.

**Perbedaannya:**
*   **PHPUnit**: Framework testing resmi yang solid, sintaks lebih verbose (kaya detail).
*   **Pest**: Framework yang lebih modern dan ringkas, sintaks lebih "natural", dibangun di atas PHPUnit.

#### Pest Example:
```php
<?php
// tests/Feature/ExampleTest.php (menggunakan Pest)

test('the application returns a successful response', function () {
    $response = get('/'); // Fungsi helper langsung

    $response->assertStatus(200);
});
```

#### PHPUnit Example:
```php
<?php
// tests/Feature/ExampleTest.php (menggunakan PHPUnit)

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
```

### 5. 🛠️ Helper Methods & Aserisi (Assertions)

**Analogi:** Di dapur, kamu punya banyak alat bantu (garpu, sendok, penggaris) untuk menilai makanan. Di Laravel, kamu punya banyak **helper methods dan assertions** untuk menilai apakah kode berjalan sesuai harapan.

**Mengapa ini penting?** Karena kamu butuh cara untuk "menilai" hasil dari testmu.

**Contoh Umum:**
```php
// Pest
test('user can login', function () {
    $user = User::factory()->create(['password' => bcrypt('password')]);

    $response = post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect('/dashboard'); // Harus redirect ke dashboard
    $this->assertAuthenticated(); // Harus login sekarang
});

// PHPUnit
public function test_user_can_login(): void
{
    $user = User::factory()->create(['password' => bcrypt('password')]);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect('/dashboard');
    $this->assertAuthenticated();
}
```

### 6. 🏗️ Membuat Test Baru (Artisan Command)

**Mengapa?** Supaya kamu tidak perlu buat file dari awal.

**Bagaimana?** Gunakan Artisan.

**Feature Test:**
```bash
php artisan make:test UserTest
# Akan membuat: tests/Feature/UserTest.php
```

**Unit Test:**
```bash
php artisan make:test UserTest --unit
# Akan membuat: tests/Unit/UserTest.php
```

---

## Bagian 3: Jurus Tingkat Lanjut - Environment, Parallel, & Coverage 🚀

### 7. 🌍 Environment Testing (Setting yang Aman)

**Analogi:** Jika kamu mencicipi makanan di dapur, kamu tidak ingin menggangu stok makanan utama untuk restoran, kan? Kamu buat "dapur sementara" untuk percobaan. Itulah **Environment Testing**.

**Mengapa ini penting?** Karena test harus berjalan di lingkungan yang **terisolasi** dan **tidak merusak data asli**.

**Bagaimana?**
*   Laravel otomatis set `APP_ENV=testing` saat test.
*   Laravel gunakan `SESSION_DRIVER=array` dan `CACHE_DRIVER=array` (artinya data tidak disimpan permanen).
*   Buat file `.env.testing` jika kamu perlu setting khusus untuk test (misalnya database test).
*   Jangan lupa `php artisan config:clear` jika kamu ubah `.env.testing`.

### 8. ⚡ Parallel Testing - Uji Lebih Cepat!

**Analogi:** Bayangkan kamu punya 10 chef mencicipi makanan berbeda secara bersamaan, bukan satu per satu. Maka waktu yang dibutuhkan jauh lebih cepat!

**Mengapa ini penting?** Karena test bisa memakan waktu lama, dan parallel testing mempercepatnya secara signifikan.

**Bagaimana?**
1. Install paket `paratest`:
```bash
composer require brianium/paratest --dev
```

2. Jalankan test secara paralel:
```bash
php artisan test --parallel
```

3. Atur jumlah proses:
```bash
php artisan test --parallel --processes=4
```

#### Database dan Parallel Testing:
Laravel otomatis buat database terpisah untuk setiap proses:
Contoh: `your_main_db_test_1`, `your_main_db_test_2`, dst.

Jika ingin recreate database sebelum test:
```bash
php artisan test --parallel --recreate-databases
```

### 9. 📊 Coverage & Profiling - Melihat dan Mengukur

**Analogi:** Setelah mencicipi semua hidangan, kamu ingin tahu: "Apa semua hidangan sudah dicicipi? Hidangan mana yang paling lama disiapkan?"

**Mengapa ini penting?** Karena kamu ingin:
*   Tau **berapa persen kode** kamu yang sudah diuji (coverage).
*   Tau **test mana yang paling lambat** agar bisa dioptimalkan (profiling).

**Bagaimana?**
*   Jalankan test dengan coverage:
```bash
php artisan test --coverage
```

*   Tetapkan minimal coverage (misalnya 80%):
```bash
php artisan test --coverage --min=80.5
```

*   Profil test (lihat 10 test terlama):
```bash
php artisan test --profile
```

---

## Bagian 4: Hooks & Setup Lanjutan untuk Parallel Testing 🧰

### 10. 🪝 Parallel Testing Hooks - Setup untuk Banyak Proses

**Analogi:** Jika kamu punya banyak chef paralel, kamu mungkin perlu atur dapur awal (siapkan alat, tentukan resep), dan bersihkan dapur akhir (simpan alat, buang sisa bahan) untuk setiap chef atau untuk keseluruhan proses.

**Mengapa ini penting?** Karena kadang kamu butuh setup khusus sebelum atau setelah test berjalan secara paralel.

**Bagaimana?** Gunakan `ParallelTesting` facade di service provider (misalnya `AppServiceProvider::boot`).

```php
<?php
// app/Providers/AppServiceProvider.php
namespace App\Providers;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\ParallelTesting;
use Illuminate\Support\ServiceProvider;
use PHPUnit\Framework\TestCase;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Dijalankan saat proses parallel mulai
        ParallelTesting::setUpProcess(function (int $token) {
            // Setup untuk proses tertentu (gunakan $token jika perlu)
        });

        // Dijalankan sebelum tiap test case
        ParallelTesting::setUpTestCase(function (int $token, TestCase $testCase) {
            // Setup untuk test case tertentu
        });

        // Dijalankan saat setup database test (misalnya, seed)
        ParallelTesting::setUpTestDatabase(function (string $database, int $token) {
            Artisan::call('db:seed'); // atau setup lainnya
        });

        // Dijalankan setelah tiap test case
        ParallelTesting::tearDownTestCase(function (int $token, TestCase $testCase) {
            // Cleanup setelah test case tertentu
        });

        // Dijalankan saat proses parallel selesai
        ParallelTesting::tearDownProcess(function (int $token) {
            // Cleanup untuk proses tertentu
        });

        // Dapatkan token proses saat ini
        $token = ParallelTesting::token();
    }
}
```

---

## Bagian 5: Menjadi Master Testing Laravel 🏆

### 11. ✨ Wejangan dari Guru

1.  **Feature Test adalah Prioritas**: Mayoritas test sebaiknya adalah feature test karena mereka menguji aplikasi secara menyeluruh.
2.  **Gunakan Pest jika kamu suka sintaks ringkas**.
3.  **Manfaatkan Parallel Testing** untuk mempercepat eksekusi test suite besar.
4.  **Gunakan .env.testing** untuk mengisolasi environment test.
5.  **Aktifkan Coverage & Profiling** secara berkala untuk menjaga kualitas dan performa.
6.  **Jangan abaikan Unit Test** untuk hal-hal yang bisa di-isolate.

### 12. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk Testing di Laravel:

#### 📦 Membuat & Menjalankan Test
| Perintah | Fungsi |
|----------|--------|
| `php artisan make:test NameTest` | Buat feature test |
| `php artisan make:test NameTest --unit` | Buat unit test |
| `php artisan test` | Jalankan semua test (rekomendasi) |
| `./vendor/bin/pest` | Jalankan test via Pest |
| `./vendor/bin/phpunit` | Jalankan test via PHPUnit |
| `php artisan test --testsuite=Feature` | Jalankan hanya Feature Test |
| `php artisan test --stop-on-failure` | Hentikan jika ada test gagal |

#### ⚡ Parallel Testing
| Perintah | Fungsi |
|----------|--------|
| `composer require brianium/paratest --dev` | Install paratest |
| `php artisan test --parallel` | Jalankan test secara paralel |
| `php artisan test --parallel --processes=4` | Jalankan dengan 4 proses |
| `php artisan test --parallel --recreate-databases` | Recreate database test untuk parallel |

#### 📊 Coverage & Profiling
| Perintah | Fungsi |
|----------|--------|
| `php artisan test --coverage` | Jalankan test dan tampilkan coverage |
| `php artisan test --coverage --min=80.5` | Pastikan minimal 80.5% coverage |
| `php artisan test --profile` | Profil test dan tampilkan 10 terlama |

#### 🧪 Aserisi Umum (Pest/PHPUnit)
| Aserisi | Deskripsi |
|---------|-----------|
| `->assertStatus(200)` | Harus status 200 |
| `->assertSee('text')` | Harus ada teks di response |
| `->assertJson(['key' => 'value'])` | Harus ada JSON tertentu |
| `->assertDatabaseHas('table', ['col' => 'val'])` | Data harus ada di DB |
| `->assertAuthenticated()` | User harus login |
| `$this->assertTrue($condition)` | Pastikan kondisi true (PHPUnit) |
| `expect($value)->toBe(5)` | Pastikan nilainya 5 (Pest) |

### 13. 🎯 Kesimpulan

Luar biasa! 🌟 Kamu sudah menyelesaikan seluruh materi Testing di Laravel, dari yang paling dasar sampai yang paling rumit. Sekarang kamu tahu bagaimana menulis, menjalankan, dan mengelola test dengan baik menggunakan Laravel. Kamu bisa menjadi "insinyur kualitas perangkat lunak" yang hebat! Testing adalah fondasi penting untuk membangun aplikasi yang aman, stabil, dan dapat dipercaya.

Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku!
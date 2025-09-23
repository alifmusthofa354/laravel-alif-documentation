# 🧪 Panduan Pengujian di Laravel

Laravel dibangun dengan **testing** (pengujian) dalam pikiran. Secara bawaan, Laravel sudah mendukung **Pest** dan **PHPUnit**, sehingga Anda bisa langsung melakukan testing tanpa konfigurasi tambahan yang rumit. File `phpunit.xml` juga sudah tersedia untuk mengatur lingkungan pengujian.

Framework ini juga menyediakan berbagai **helper methods** agar Anda bisa menulis kode uji dengan lebih ekspresif.

---

## 📂 Struktur Direktori Testing

Secara default, direktori `tests` dalam aplikasi Laravel berisi dua folder utama:

* **Unit Tests** 🧩
  Fokus pada bagian kecil dan terisolasi dari kode, biasanya satu method saja.
  Unit test tidak mem-boot Laravel, sehingga **tidak bisa mengakses database** atau service framework lainnya.

* **Feature Tests** ⚙️
  Menguji bagian kode yang lebih besar, seperti interaksi antar-objek, hingga permintaan HTTP penuh ke endpoint JSON.
  Umumnya, **mayoritas pengujian sebaiknya berupa feature test** karena memberikan keyakinan bahwa sistem berjalan sesuai harapan.

📌 Laravel menyediakan file contoh `ExampleTest.php` di masing-masing folder tersebut.

---

## ⚙️ Menjalankan Testing

Setelah instalasi baru Laravel, Anda bisa langsung menjalankan testing dengan perintah:

```bash
vendor/bin/pest
vendor/bin/phpunit
php artisan test
```

Command `php artisan test` biasanya lebih informatif karena memberikan laporan hasil uji yang lebih jelas.

---

## 🌍 Lingkungan (Environment) Testing

Ketika menjalankan testing, Laravel otomatis:

* Mengatur environment ke **testing** berdasarkan `phpunit.xml`.
* Menggunakan **array driver** untuk session dan cache (data tidak dipersistensikan).

### 🔑 File `.env.testing`

Anda bisa membuat file `.env.testing` di root project. File ini akan menggantikan `.env` ketika menjalankan testing, baik dengan Pest/PHPUnit maupun Artisan dengan opsi:

```bash
php artisan migrate --env=testing
```

⚠️ Jika mengubah konfigurasi environment, jangan lupa menjalankan:

```bash
php artisan config:clear
```

---

## 🛠️ Membuat Test Baru

Gunakan Artisan command untuk membuat test:

* **Feature Test** (default):

```bash
php artisan make:test UserTest
```

* **Unit Test** (menggunakan opsi `--unit`):

```bash
php artisan make:test UserTest --unit
```

Setelah file test dibuat, Anda bisa langsung menuliskan uji dengan **Pest** atau **PHPUnit**.

### 📌 Contoh Pest Test

```php
<?php
 
test('basic', function () {
    expect(true)->toBeTrue();
});
```

Jika menggunakan `setUp` / `tearDown`, pastikan tetap memanggil `parent::setUp()` dan `parent::tearDown()`.

---

## ▶️ Menjalankan Test

Jalankan test dengan:

```bash
./vendor/bin/pest
./vendor/bin/phpunit
php artisan test
```

Tambahan opsi dapat digunakan, misalnya hanya menjalankan **Feature Test** dan berhenti saat ada error:

```bash
php artisan test --testsuite=Feature --stop-on-failure
```

---

## ⚡ Parallel Testing

Secara default, test dijalankan **sekuensial**. Untuk mempercepat, gunakan **parallel testing**:

1. Instal paket tambahan:

```bash
composer require brianium/paratest --dev
```

2. Jalankan dengan opsi `--parallel`:

```bash
php artisan test --parallel
```

### 🔢 Mengatur Jumlah Proses

```bash
php artisan test --parallel --processes=4
```

---

## 🗄️ Database pada Parallel Testing

Laravel otomatis membuat database test baru untuk setiap proses paralel:
contoh: `your_db_test_1`, `your_db_test_2`.

Jika ingin membuat ulang database setiap kali menjalankan test:

```bash
php artisan test --parallel --recreate-databases
```

---

## 🪝 Parallel Testing Hooks

Kadang Anda perlu men-setup resource agar bisa digunakan dengan aman oleh banyak proses. Gunakan **ParallelTesting facade**:

```php
<?php
 
namespace App\Providers;
 
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\ParallelTesting;
use Illuminate\Support\ServiceProvider;
use PHPUnit\Framework\TestCase;
 
class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        ParallelTesting::setUpProcess(function (int $token) {
            // ...
        });
 
        ParallelTesting::setUpTestCase(function (int $token, TestCase $testCase) {
            // ...
        });
 
        ParallelTesting::setUpTestDatabase(function (string $database, int $token) {
            Artisan::call('db:seed');
        });
 
        ParallelTesting::tearDownTestCase(function (int $token, TestCase $testCase) {
            // ...
        });
 
        ParallelTesting::tearDownProcess(function (int $token) {
            // ...
        });
    }
}
```

Untuk mendapatkan token proses saat ini:

```php
$token = ParallelTesting::token();
```

---

## 📊 Test Coverage

Pastikan Anda sudah mengaktifkan **Xdebug** atau **PCOV**.

Menjalankan test dengan coverage:

```bash
php artisan test --coverage
```

### 🚦 Minimal Coverage

Jika ingin menetapkan standar minimal coverage:

```bash
php artisan test --coverage --min=80.3
```

---

## ⏱️ Profiling Tests

Untuk mengetahui test mana yang paling lambat:

```bash
php artisan test --profile
```

Laravel akan menampilkan daftar **10 test paling lambat** untuk memudahkan optimasi.

---

# 🎯 Kesimpulan

* ✅ Laravel sudah siap untuk testing dengan **Pest** dan **PHPUnit**.
* ✅ Gunakan **Feature Test** untuk menguji sistem secara menyeluruh.
* ✅ Gunakan **Parallel Testing** untuk mempercepat eksekusi test.
* ✅ Manfaatkan fitur **coverage** dan **profiling** untuk menjaga kualitas dan performa kode.

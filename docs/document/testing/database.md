# 🗄️ Database Testing di Laravel

## 📖 Pendahuluan
Laravel menyediakan berbagai alat bantu dan **assertion** untuk mempermudah pengujian aplikasi berbasis database.  
Selain itu, Laravel juga dilengkapi dengan **Model Factories** dan **Seeders** yang memudahkan kita membuat data uji menggunakan **Eloquent Models** dan relasinya.  

👉 Pada dokumentasi ini, kita akan membahas cara menguji database dengan fitur-fitur Laravel yang powerful.

---

## 🔄 Reset Database Setelah Setiap Test

Sebelum melangkah lebih jauh, penting untuk memastikan bahwa database **reset** setelah setiap pengujian.  
Tujuannya agar data dari pengujian sebelumnya tidak memengaruhi pengujian berikutnya.

Laravel menyediakan trait:  
```php
use Illuminate\Foundation\Testing\RefreshDatabase;
````

### ✅ Contoh Penggunaan dengan Pest

```php
<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

pest()->use(RefreshDatabase::class);

test('basic example', function () {
    $response = $this->get('/');

    // ...
});
```

📝 **Catatan**

* `RefreshDatabase` **tidak melakukan migrate ulang** jika schema sudah up-to-date.
* Jika ingin reset penuh, gunakan:

  * `DatabaseMigrations`
  * `DatabaseTruncation`
    Namun, keduanya lebih lambat dibandingkan `RefreshDatabase`.

---

## 🏗️ Model Factories

Saat menguji, sering kali kita membutuhkan data dummy. Daripada mengisi field satu per satu, kita bisa menggunakan **Model Factories**.

### ✅ Contoh

```php
use App\Models\User;

test('models can be instantiated', function () {
    $user = User::factory()->create();

    // ...
});
```

Dengan cara ini, kita bisa menghasilkan data test dengan cepat dan konsisten.
Untuk lebih detail, lihat dokumentasi **Model Factory** Laravel.

---

## 🌱 Menjalankan Seeders

Laravel mendukung penggunaan **Seeder** dalam pengujian.
Seeder membantu mengisi tabel dengan data awal, baik secara keseluruhan atau hanya sebagian.

### ✅ Contoh Menjalankan Seeder

```php
<?php

use Database\Seeders\OrderStatusSeeder;
use Database\Seeders\TransactionStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

pest()->use(RefreshDatabase::class);

test('orders can be created', function () {
    // Jalankan DatabaseSeeder (default)
    $this->seed();

    // Jalankan seeder tertentu
    $this->seed(OrderStatusSeeder::class);

    // Jalankan beberapa seeder sekaligus
    $this->seed([
        OrderStatusSeeder::class,
        TransactionStatusSeeder::class,
    ]);
});
```

### ⚡ Auto-Seed Sebelum Test

Kita juga bisa mengatur agar seeder otomatis dijalankan sebelum setiap test:

```php
<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Jalankan DatabaseSeeder sebelum setiap test.
     *
     * @var bool
     */
    protected $seed = true;
}
```

Atau gunakan seeder tertentu dengan properti `$seeder`:

```php
use Database\Seeders\OrderStatusSeeder;

/**
 * Jalankan seeder spesifik sebelum test.
 *
 * @var string
 */
protected $seeder = OrderStatusSeeder::class;
```

---

## 🧪 Assertion yang Tersedia

Laravel menyediakan banyak assertion untuk memvalidasi database saat pengujian.

### 📊 `assertDatabaseCount`

Memastikan jumlah record sesuai:

```php
$this->assertDatabaseCount('users', 5);
```

### 🗑️ `assertDatabaseEmpty`

Memastikan tabel kosong:

```php
$this->assertDatabaseEmpty('users');
```

### 🔍 `assertDatabaseHas`

Memastikan data tertentu ada:

```php
$this->assertDatabaseHas('users', [
    'email' => 'sally@example.com',
]);
```

### 🚫 `assertDatabaseMissing`

Memastikan data tertentu tidak ada:

```php
$this->assertDatabaseMissing('users', [
    'email' => 'sally@example.com',
]);
```

### 🕊️ `assertSoftDeleted`

Memastikan model di-*soft delete*:

```php
$this->assertSoftDeleted($user);
```

### 🛡️ `assertNotSoftDeleted`

Memastikan model tidak di-*soft delete*:

```php
$this->assertNotSoftDeleted($user);
```

### 👤 `assertModelExists`

Memastikan model ada di database:

```php
use App\Models\User;

$user = User::factory()->create();

$this->assertModelExists($user);
```

### 👻 `assertModelMissing`

Memastikan model sudah dihapus:

```php
use App\Models\User;

$user = User::factory()->create();
$user->delete();

$this->assertModelMissing($user);
```

### 📈 `expectsDatabaseQueryCount`

Mengatur ekspektasi jumlah query:

```php
$this->expectsDatabaseQueryCount(5);

// Test...
```

---

## 🎯 Kesimpulan

Dengan fitur-fitur seperti **RefreshDatabase**, **Factories**, **Seeders**, dan berbagai **Assertion**, Laravel membuat pengujian database menjadi jauh lebih mudah, cepat, dan aman.
Gunakan strategi yang sesuai (factories untuk data dummy, seeder untuk setup awal, dan assertion untuk validasi) agar test Anda tetap **rapi dan andal** 🚀.

```

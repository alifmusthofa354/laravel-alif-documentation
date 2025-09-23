# 📦 Seeding

## 📘 Pendahuluan

Laravel menyediakan kemampuan untuk **mengisi database dengan data awal** menggunakan **seed classes**. Semua seed class disimpan di direktori `database/seeders`.

Secara default, Laravel menyediakan **DatabaseSeeder** yang dapat memanggil seed class lain menggunakan metode `call()`. Hal ini memungkinkan kita untuk mengontrol **urutan seeding**.

> ⚡ Catatan: Perlindungan **mass assignment** secara otomatis dinonaktifkan selama database seeding.


## ✍️ Menulis Seeders

Untuk membuat seeder baru, jalankan perintah Artisan berikut:

```bash
php artisan make:seeder UserSeeder
```

Semua seeder yang dibuat akan ditempatkan di direktori `database/seeders`.

### Struktur Seeder

Seeder hanya memiliki **satu metode utama**, yaitu `run()`. Metode ini dipanggil ketika perintah `db:seed` dijalankan. Di dalam metode `run()`, kita dapat memasukkan data ke database menggunakan:

* **Query Builder** → untuk memasukkan data secara manual.
* **Eloquent Model Factories** → untuk membuat banyak data dengan mudah.

#### Contoh Seeder Sederhana

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Jalankan seeder database
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => Str::random(10),
            'email' => Str::random(10).'@example.com',
            'password' => Hash::make('password'),
        ]);
    }
}
```

> 📝 Tip: Anda dapat **type-hint dependencies** pada metode `run()` dan Laravel akan otomatis menyelesaikannya melalui service container.



## 🏭 Menggunakan Model Factories

Menulis data secara manual bisa merepotkan, apalagi jika jumlahnya banyak. Laravel menyediakan **model factories** untuk menghasilkan banyak data dengan cepat.

#### Contoh: Membuat 50 User dengan 1 Post masing-masing

```php
use App\Models\User;

/**
 * Jalankan seeder database
 */
public function run(): void
{
    User::factory()
        ->count(50)
        ->hasPosts(1)
        ->create();
}
```



## 📂 Memanggil Seeder Lain

Di dalam **DatabaseSeeder**, kita bisa memanggil seeder tambahan menggunakan metode `call()`. Ini berguna untuk **memecah seeder menjadi beberapa file** sehingga tidak ada seeder yang terlalu besar.

```php
/**
 * Jalankan seeder database
 */
public function run(): void
{
    $this->call([
        UserSeeder::class,
        PostSeeder::class,
        CommentSeeder::class,
    ]);
}
```



## 🔕 Menonaktifkan Model Events

Jika ingin mencegah model **mengirimkan events** saat seeding, gunakan trait `WithoutModelEvents`. Trait ini memastikan **tidak ada event model yang dijalankan**, bahkan ketika memanggil seeder lain melalui `call()`.

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Jalankan seeder database
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
        ]);
    }
}
```



## ▶️ Menjalankan Seeder

Untuk mengeksekusi seeder, gunakan perintah:

```bash
php artisan db:seed
```

Secara default, perintah ini menjalankan **DatabaseSeeder**.

Jika ingin menjalankan **seeder tertentu**:

```bash
php artisan db:seed --class=UserSeeder
```

#### Seeder + Migrate Fresh

Untuk **membangun ulang database** dan sekaligus menjalankan seeder:

```bash
php artisan migrate:fresh --seed
php artisan migrate:fresh --seed --seeder=UserSeeder
```



## ⚠️ Memaksa Seeder di Production

Seeding dapat **mengubah atau menghapus data**. Saat dijalankan di environment production, Laravel akan meminta konfirmasi.

Untuk memaksa eksekusi tanpa konfirmasi:

```bash
php artisan db:seed --force
```



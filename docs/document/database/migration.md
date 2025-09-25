# 📚 Migration di Laravel: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Di dunia pengembangan aplikasi, database adalah tempat kita menyimpan semua harta karun data. Tapi bayangkan betapa berantakkannya jika tidak ada catatan yang rapi tentang bagaimana database kita dibangun dan diubah seiring waktu! 

Di edisi ini, kita akan kupas tuntas **semua detail** tentang Migration, tapi setiap topik akan aku ajarkan dengan sabar, seolah-olah aku sedang duduk di sebelahmu sambil menjelaskan pelan-pelan. Siap? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Migration Itu Sebenarnya?

**Analogi:** Bayangkan kamu sedang membangun rumah besar bersama tim arsitek. Setiap perubahan pada desain harus dicatat dengan rapi, disetujui semua pihak, dan bisa dikembalikan jika terjadi kesalahan. **Migration adalah buku catatan harian perubahan struktur database-mu**.

**Mengapa ini penting?** Karena tanpa migration, kamu harus:
- Memberi tahu semua developer secara manual tentang perubahan database
- Melakukan perubahan secara manual di semua lingkungan (development, staging, production)
- Khawatir akan kehilangan data jika melakukan kesalahan

**Bagaimana cara kerjanya?** Laravel menyimpan semua perubahan struktur database dalam bentuk file PHP yang bisa dijalankan (up) atau dibatalkan (down). Ini seperti buku resep untuk membangun dan menghancurkan struktur database:

`➡️ Migration File -> 👨‍🔧 Laravel (artisan migrate) -> 🗄️ Database (diubah sesuai perintah)`

Tanpa migration, pengelolaan database bisa berantakan dan penuh risiko. Dengan pendekatan Laravel, semua jadi rapi dan aman! 😊

### 2. ✍️ Resep Pertamamu: Membuat Migration Pertama

Ini adalah fondasi paling dasar. Mari kita buat migration pertama dari nol, langkah demi langkah.

#### Langkah 1️⃣: Siapkan Alamat di Buku Catatan (Membuat File Migration)
**Mengapa?** Kita butuh file tempat mencatat perubahan struktur database kita.

**Bagaimana?**
```bash
# Buat migration untuk tabel users
php artisan make:migration create_users_table
```

File ini akan dibuat di `database/migrations/` dengan format timestamp, contoh: `2023_10_01_000000_create_users_table.php`

#### Langkah 2️⃣: Buka Buku Catatan (File Migration)
**Mengapa?** Kita perlu mengisi perintah perubahan apa yang ingin kita lakukan.

**Bagaimana?** Buka file yang baru dibuat dan lihat struktur dasarnya:
```php
<?php
// database/migrations/2023_10_01_000000_create_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Ini adalah metode untuk menjalankan perubahan
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamps(); // created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Ini adalah metode untuk membatalkan perubahan
        Schema::dropIfExists('users');
    }
}
```

**Penjelasan Kode:**
- `up()`: Perintah untuk membuat/mengubah struktur database
- `down()`: Perintah untuk mengembalikan perubahan
- `Schema::create()`: Membuat tabel baru
- `$table->id()`: Kolom ID otomatis
- `$table->string()`: Kolom teks biasa
- `$table->timestamps()`: Kolom created_at dan updated_at

#### Langkah 3️⃣: Jalankan Migration (Menjalankan Perubahan)
**Mengapa?** Kita harus memberi tahu Laravel untuk mengeksekusi perubahan yang sudah kita tulis.

**Bagaimana?** Gunakan perintah Artisan:
```bash
# Jalankan semua migration yang belum dijalankan
php artisan migrate
```

Selesai! 🎉 Sekarang tabel `users` sudah ada di database-mu!

### 3. ⚡ Membuat Migration Spesialis (Tabel dengan Kolom Spesifik)

**Analogi:** Bayangkan kamu membuat tabel buku tamu yang hanya bisa menyimpan nama dan komentar, tapi dengan aturan spesifik.

**Mengapa ini ada?** Untuk kebutuhan yang lebih kompleks dari sekedar membuat tabel biasa.

**Bagaimana?** 
```bash
php artisan make:migration create_guestbook_table
```

Lalu isi file migration dengan berbagai tipe kolom:
```php
<?php
// database/migrations/2023_10_01_000001_create_guestbook_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGuestbookTable extends Migration
{
    public function up(): void
    {
        Schema::create('guestbook', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100); // Nama maksimal 100 karakter
            $table->string('email')->nullable(); // Email opsional
            $table->text('message'); // Pesan panjang
            $table->boolean('is_approved')->default(false); // Status approve
            $table->timestamp('approved_at')->nullable(); // Tanggal approve
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guestbook');
    }
}
```

---

## Bagian 2: Migration Controller - Sistem Perubahan Otomatis-mu 🤖

### 4. 📦 Apa Itu Migration System?

**Analogi:** Jika migration adalah resep masakan, maka sistem migration adalah **koki otomatis** yang tahu persis kapan harus memasak resep mana, dan bisa membatalkan masakan jika ada yang salah. Ini seperti mesin waktu untuk struktur database-mu!

**Mengapa ini keren?** Karena sistem ini tahu persis:
- Migration mana yang sudah dijalankan
- Migration mana yang belum dijalankan
- Bisa mengembalikan perubahan
- Bisa mengulangi perubahan dari awal

**Bagaimana?**
```bash
# Lihat status semua migration
php artisan migrate:status

# Jalankan semua migration yang belum dijalankan
php artisan migrate

# Rollback satu langkah terakhir
php artisan migrate:rollback

# Rollback semua migration
php artisan migrate:reset

# Refresh: rollback semua lalu migrate ulang
php artisan migrate:refresh
```

### 5. 🛠️ Mantra Artisan dengan Kekuatan Tambahan

> **✨ Tips dari Guru:** Mantra ini seperti memberi *power-up* pada sistem migrasimu. Wajib dipakai untuk hemat waktu!

*   **Menjalankan Migration ke Connection Tertentu (`--database`)**: Ini seperti memberi tahu koki untuk memasak di dapur mana.
    ```bash
    php artisan migrate --database=pgsql
    ```
    
*   **Menjalankan Migration dalam Mode Terisolasi (`--isolated`)**: Ini untuk deploy ke server banyak.
    ```bash
    php artisan migrate --isolated
    ```

*   **Simulasikan Eksekusi (`--pretend`)**: Seperti mencoba masak tanpa benar-benar memasak, untuk melihat SQL yang akan dijalankan.
    ```bash
    php artisan migrate --pretend
    ```

### 6. 🧩 Migrasi Segar & Segar Ulang (Fresh & Refresh)

*   **Membuat Migrasi Segar (`migrate:fresh`)**: Seperti mengganti semua perabotan rumah dengan yang baru!
    ```bash
    php artisan migrate:fresh
    # Atau dengan seeder langsung
    php artisan migrate:fresh --seed
    ```

*   **Menggabungkan Rollback dan Migrate (`migrate:refresh`)**: Seperti merenovasi rumah dari awal.
    ```bash
    php artisan migrate:refresh
    # Atau dengan jumlah rollback tertentu
    php artisan migrate:refresh --step=5
    ```

### 7. 🌐 Squashing Migration (Menggabungkan)

**Mengapa?** Setelah banyak migration dibuat, folder `database/migrations/` bisa jadi penuh. Squashing seperti menyatukan semua perubahan menjadi satu file schema.

**Bagaimana?** 
```bash
# Buat schema dump
php artisan schema:dump

# Buat schema dump dan hapus file migration lama
php artisan schema:dump --prune
```

Ini akan membuat file di `database/schema/` yang akan dijalankan sebelum migration lainnya.

**Contoh Lengkap Squashing:**

1. **Membuat Migration Banyak:**
```bash
php artisan make:migration create_users_table
php artisan make:migration create_posts_table
php artisan make:migration create_comments_table
```

2. **Setelah Semua Migration Dijalankan:**
```bash
php artisan migrate
```

3. **Lakukan Squashing:**
```bash
php artisan schema:dump --prune
```

Sekarang semua migration sebelumnya digabungkan menjadi satu file schema dan file migration lama dihapus.

---

## Bagian 3: Jurus Tingkat Lanjut - Membuat Perubahan Database 🚀

### 8. 👨‍👩‍👧 Membuat Tabel dengan Berbagai Kolom

**Analogi:** Bayangkan kamu adalah arsitek yang merancang berbagai ruangan dengan furniture yang berbeda-beda. Setiap kolom adalah furniture dengan fungsi dan ukuran spesifik.

**Mengapa?** Agar kamu bisa membuat struktur database yang lengkap dan sesuai kebutuhan.

**Bagaimana?** Berbagai tipe kolom yang tersedia:

**1. Kolom Teks:**
```php
Schema::create('articles', function (Blueprint $table) {
    $table->string('title', 255); // Teks pendek, maksimal 255 karakter
    $table->text('content'); // Teks panjang
    $table->mediumText('summary'); // Teks sedang
    $table->longText('description'); // Teks sangat panjang
});
```

**2. Kolom Angka:**
```php
Schema::create('products', function (Blueprint $table) {
    $table->integer('price'); // Integer biasa
    $table->unsignedInteger('stock'); // Integer positif
    $table->decimal('rating', 3, 2); // Desimal 3 digit, 2 di belakang koma
    $table->float('weight', 8, 2); // Float dengan presisi
});
```

**3. Kolom Khusus:**
```php
Schema::create('records', function (Blueprint $table) {
    $table->boolean('is_active'); // true/false
    $table->timestamp('published_at'); // Tanggal dan waktu
    $table->date('birth_date'); // Hanya tanggal
    $table->time('open_time'); // Hanya waktu
    $table->json('metadata'); // Data JSON
    $table->uuid('identifier'); // UUID unik
});
```

**4. Kolom ID Khusus:**
```php
Schema::create('orders', function (Blueprint $table) {
    $table->id(); // Auto-increment ID
    $table->uuid('uuid'); // UUID
    $table->ulid('ulid'); // ULID (Universally Unique Lexicographically Sortable Identifier)
    $table->foreignId('user_id')->constrained(); // Foreign key ke users
});
```

### 9. 👤 Menambah Kolom Baru (Modifikasi Tabel)

**Analogi:** Ini seperti menambahkan furnitur baru ke ruangan yang sudah ada.

**Mengapa?** Karena kebutuhan aplikasi selalu berubah, dan kadang kamu harus menambah kolom ke tabel yang sudah ada.

**Bagaimana?** Buat migration baru untuk menambah kolom:
```bash
php artisan make:migration add_status_to_orders_table
```

Lalu isi migration:
```php
<?php
// database/migrations/2023_10_01_000002_add_status_to_orders_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToOrdersTable extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('status')->default('pending'); // Tambah kolom status
            $table->text('notes')->nullable(); // Tambah kolom notes opsional
            $table->index('status'); // Tambah index untuk status
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['status']); // Hapus index dulu
            $table->dropColumn(['status', 'notes']); // Hapus kolom
        });
    }
}
```

### 10. 🎨 Mengubah dan Menghapus Kolom

Kamu bisa menyesuaikan struktur tabel setelah dibuat:

*   **Mengubah Kolom** (Perlu package doctrine/dbal):
    ```bash
    composer require doctrine/dbal
    ```

    ```php
    Schema::table('users', function (Blueprint $table) {
        $table->string('name', 100)->change(); // Ubah ukuran kolom
        $table->string('email')->nullable()->change(); // Jadikan nullable
    });
    ```

*   **Mengganti Nama Kolom**:
    ```php
    Schema::table('users', function (Blueprint $table) {
        $table->renameColumn('name', 'full_name'); // Ganti nama kolom
    });
    ```

*   **Menghapus Kolom**:
    ```php
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('age'); // Hapus kolom
    });
    ```

*   **Menghapus Banyak Kolom**:
    ```php
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['age', 'phone', 'address']);
    });
    ```

### 11.5 🔐 Foreign Keys & Indexes Canggih

**Mengapa?** Foreign keys menjaga integritas data antar tabel, sedangkan indexes membuat query jauh lebih cepat.

**Bagaimana?**

**1. Membuat Foreign Keys:**
```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users', 'id');
    $table->foreignId('category_id')->nullable()->constrained();
    $table->timestamps();
});

// Atau dengan spesifikasi lengkap:
Schema::create('comments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')
          ->constrained('users', 'id')
          ->onDelete('cascade') // Jika user dihapus, komentar ikut terhapus
          ->onUpdate('cascade'); // Jika user_id diupdate, ikut terupdate
    $table->foreignId('post_id')->constrained();
    $table->text('content');
    $table->timestamps();
});
```

**2. Membuat Indexes:**
```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug');
    $table->decimal('price', 10, 2);
    
    // Tambahkan berbagai jenis index
    $table->index('name'); // Single column index
    $table->unique('slug'); // Unique index
    $table->index(['name', 'price']); // Compound index
    $table->fulltext('name'); // Fulltext index (MySQL)
});
```

**3. Menghapus Foreign Keys & Indexes:**
```php
Schema::table('comments', function (Blueprint $table) {
    // Hapus foreign key
    $table->dropForeign(['user_id']);
    
    // Hapus unique index
    $table->dropUnique(['email']);
    
    // Hapus index biasa
    $table->dropIndex(['name']);
    
    // Hapus banyak index sekaligus
    $table->dropIndex(['name', 'price']);
});
```

### 11.7 🌐 Migrasi untuk Berbagai Jenis Database

**Mengapa?** Laravel bisa bekerja dengan berbagai jenis database (MySQL, PostgreSQL, SQLite, SQL Server), dan setiap database memiliki fitur uniknya sendiri.

**Bagaimana?** Laravel menyediakan dukungan khusus untuk:

**1. PostgreSQL:**
```php
Schema::create('articles', function (Blueprint $table) {
    $table->id();
    $table->json('tags'); // PostgreSQL JSON
    $table->uuid('uuid'); // UUID
    $table->integer('rating')->default(0);
});
```

**2. MySQL:**
```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name')->charset('utf8mb4'); // Charset khusus MySQL
    $table->longText('description')->collation('utf8mb4_unicode_ci'); // Collation
    $table->json('options'); // MySQL JSON
    $table->engine('InnoDB'); // Storage engine
});
```

**3. SQLite:**
```php
Schema::create('logs', function (Blueprint $table) {
    $table->id();
    $table->string('action');
    $table->text('details');
    $table->timestamp('created_at');
});
```

### 11. 🗑️ Migrasi dengan Foreign Key Constraints

**Mengapa?** Kadang kamu harus menonaktifkan constrain sementara saat melakukan perubahan kompleks.

**Bagaimana?**
```php
public function up(): void
{
    // Nonaktifkan foreign key constraints sementara
    Schema::disableForeignKeyConstraints();

    Schema::table('comments', function (Blueprint $table) {
        $table->foreignId('user_id')->constrained();
        $table->foreignId('post_id')->constrained();
    });

    // Aktifkan kembali
    Schema::enableForeignKeyConstraints();
}
```

**Contoh Lengkap dengan Foreign Key:**

1. **Buat Migration Tabel Utama:**
```php
<?php
// database/migrations/2023_10_01_000003_create_posts_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained('users', 'id')
                  ->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
}
```

2. **Buat Migration Tabel Relasi:**
```php
<?php
// database/migrations/2023_10_01_000004_create_comments_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentsTable extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->text('content');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
}
```

3. **Migration untuk Mengubah Foreign Key:**
```php
<?php
// database/migrations/2023_10_01_000005_modify_comments_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyCommentsTable extends Migration
{
    public function up(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreignId('user_id')->constrained()->change();
        });
    }
}
```

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Migration 🧰

### 12. 🔐 Cek Eksistensi Tabel & Kolom

**Mengapa?** Terkadang kamu perlu mengecek apakah tabel atau kolom sudah ada sebelum melakukan perubahan.

**Bagaimana?**
```php
use Illuminate\Support\Facades\Schema;

// Di migration atau controller
if (Schema::hasTable('users')) {
    // Lakukan sesuatu jika tabel exists
}

if (Schema::hasColumn('users', 'email')) {
    // Lakukan sesuatu jika kolom exists
}
```

**Contoh Penggunaan dalam Migration:**
```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class SafeModifyUsersTable extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('users')) {
            Schema::table('users', function ($table) {
                if (!Schema::hasColumn('users', 'phone')) {
                    $table->string('phone')->nullable();
                }
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function ($table) {
            if (Schema::hasColumn('users', 'phone')) {
                $table->dropColumn('phone');
            }
        });
    }
}
```

### 13. 💉 Migration untuk Koneksi Database Berbeda

**Prinsipnya: Jangan batasi dirimu hanya pada satu database!** Laravel memungkinkan kamu bekerja dengan berbagai koneksi database dalam satu aplikasi.

**Mengapa?** Kadang kamu perlu bekerja dengan database terpisah untuk logging, analitik, atau data historis.

**Bagaimana?**
*   **Menggunakan Koneksi Lain di Migration**:
    ```php
    public function up(): void
    {
        Schema::connection('pgsql')->create('analytics', function (Blueprint $table) {
            $table->id();
            $table->json('payload');
            $table->timestamp('logged_at');
        });
    }
    ```

*   **Menentukan Koneksi di Class Migration**:
    ```php
    class CreateAnalyticsTable extends Migration
    {
        protected $connection = 'pgsql'; // Gunakan koneksi PostgreSQL
        
        public function up(): void
        {
            Schema::create('analytics', function (Blueprint $table) {
                $table->id();
                $table->json('payload');
                $table->timestamp('logged_at');
            });
        }
        
        public function down(): void
        {
            Schema::dropIfExists('analytics');
        }
    }
    ```
    
**Contoh Lengkap Migration dengan Multi-Koneksi:**

1. **Konfigurasi Tambahan Database:**
```php
// config/database.php
'connections' => [
    'mysql' => [
        // konfigurasi MySQL default
    ],
    'pgsql' => [
        // konfigurasi PostgreSQL
    ],
    'sqlite' => [
        // konfigurasi SQLite
    ],
],
```

2. **Migration untuk Koneksi Tertentu:**
```php
<?php
// database/migrations/2023_10_01_000006_create_postgres_logs_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostgresLogsTable extends Migration
{
    protected $connection = 'pgsql';

    public function up(): void
    {
        Schema::create('logs', function (Blueprint $table) {
            $table->id();
            $table->string('level');
            $table->text('message');
            $table->json('context');
            $table->timestamp('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logs');
    }
}
```

3. **Migration dengan Koneksi Dinamis:**
```php
<?php
// database/migrations/2023_10_01_000007_create_dynamic_connection_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDynamicConnectionTable extends Migration
{
    public function up(): void
    {
        // Gunakan koneksi berdasarkan environment
        $connection = env('ANALYTICS_DB_CONNECTION', 'mysql');
        
        Schema::connection($connection)->create('analytics_data', function (Blueprint $table) {
            $table->id();
            $table->string('metric_name');
            $table->decimal('value', 15, 2);
            $table->date('date_recorded');
        });
    }

    public function down(): void
    {
        $connection = env('ANALYTICS_DB_CONNECTION', 'mysql');
        Schema::connection($connection)->dropIfExists('analytics_data');
    }
}
```

Migration dengan dependency injection membuat kode kamu:
- **Lebih fleksibel**: Bisa bekerja dengan berbagai jenis dan jumlah koneksi database
- **Lebih mudah di-test**: Kamu bisa mock koneksi database saat testing
- **Lebih modular**: Setiap migration bisa dirancang untuk bekerja dengan koneksi tertentu
- **Lebih bersih**: Tidak perlu hard-code koneksi di banyak tempat

### 13.5 🏗️ Tipe Kolom Lengkap dan Fitur Baru

Ada berbagai tipe kolom yang tersedia di Laravel:

**1. Tipe Kolom Geospasial:**
```php
Schema::create('locations', function (Blueprint $table) {
    $table->id();
    $table->geometry('coordinates'); // Tipe geometry umum
    $table->point('location'); // Titik koordinat
    $table->polygon('boundary'); // Wilayah poligon
    $table->linestring('route'); // Garis rute
});
```

**2. Tipe Kolom Spesial:**
```php
Schema::create('devices', function (Blueprint $table) {
    $table->id();
    $table->macAddress('mac_address'); // Alamat MAC
    $table->uuid('device_id'); // UUID
    $table->ulid('session_id'); // ULID
    $table->vector('embedding', 1536); // Tipe vector (untuk AI/embedding)
});
```

**3. Tipe Kolom JSON:**
```php
Schema::create('settings', function (Blueprint $table) {
    $table->id();
    $table->json('preferences'); // JSON biasa
    $table->jsonb('metadata'); // JSONB untuk PostgreSQL (lebih cepat)
});
```

**4. Default Expressions:**
```php
use Illuminate\Database\Query\Expression;

Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->json('specifications')->default(new Expression('(JSON_ARRAY())'));
    $table->timestamp('created_at')->default(new Expression('CURRENT_TIMESTAMP'));
});
```

### 14. 👮 Migrasi Aman dan Best Practices

**Mengapa?** Karena kesalahan dalam migration bisa menyebabkan kehilangan data atau downtime aplikasi.

**Bagaimana?** 

**1. Gunakan --pretend untuk Simulasi:**
```bash
# Lihat SQL yang akan dijalankan tanpa benar-benar menjalankan
php artisan migrate --pretend
```

**2. Backup Sebelum Migrasi Produksi:**
```bash
# Selalu backup database sebelum migrasi produksi
mysqldump -u user -p database_name > backup.sql
```

**3. Gunakan --isolated untuk Multi-Server:**
```bash
# Untuk deploy ke server cluster
php artisan migrate --isolated
```

**4. Testing Migration:**
```php
// Dalam test
public function test_migration_works()
{
    // Reset database ke kondisi awal
    Artisan::call('migrate:reset');
    
    // Jalankan migration
    Artisan::call('migrate');
    
    // Cek apakah tabel sudah dibuat
    $this->assertTrue(Schema::hasTable('users'));
    $this->assertTrue(Schema::hasColumn('users', 'email'));
}
```

**Contoh Lengkap Best Practices Migration:**

1. **Migration dengan Validasi:**
```php
<?php
// database/migrations/2023_10_01_000008_create_safe_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSafeUsersTable extends Migration
{
    public function up(): void
    {
        // Cek apakah tabel sudah ada sebelum membuat
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('name')->nullable(false);
                $table->string('email')->unique()->nullable(false);
                $table->timestamp('email_verified_at')->nullable();
                $table->string('password');
                $table->rememberToken();
                $table->timestamps();
                
                // Tambahkan index untuk kolom yang sering diquery
                $table->index('email');
                $table->index('created_at');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('users')) {
            Schema::dropIfExists('users');
        }
    }
}
```

2. **Migrasi dengan Error Handling:**
```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class SafeModifyTable extends Migration
{
    public function up(): void
    {
        DB::transaction(function () {
            Schema::table('users', function (Blueprint $table) {
                $table->string('phone')->nullable();
                $table->index('phone');
            });
        });
    }

    public function down(): void
    {
        DB::transaction(function () {
            Schema::table('users', function (Blueprint $table) {
                $table->dropIndex(['phone']);
                $table->dropColumn('phone');
            });
        });
    }
}
```

---

## Bagian 5: Menjadi Master Migration 🏆

### 15. ✨ Wejahan dari Guru

1.  **Migration adalah Catatan Harian Database**: Perlakukan migration seperti buku harian penting. Setiap perubahan harus terdokumentasi dengan baik.
2.  **Beri Nama Migration yang Jelas**: Gunakan nama yang menjelaskan perubahan yang dilakukan.
3.  **Selalu Test Migration**: Uji migration di environment development sebelum dijalankan di production.
4.  **Backup Database Sebelum Migrasi Produksi**: Jangan pernah lakukan migrasi produksi tanpa backup.
5.  **Gunakan Squashing untuk Menjaga Kebersihan**: Gabungkan banyak migration kecil menjadi satu schema dump.
6.  **Manfaatkan Fitur Database Lengkap**: Gunakan tipe kolom dan fitur yang disediakan oleh database.
7.  **Gunakan Foreign Keys**: Ini menjaga integritas data dan mencegah error di kemudian hari.

### 16. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Migration di Laravel:

#### 📦 Perintah Artisan
| Perintah | Fungsi |
|----------|--------|
| `php artisan make:migration create_users_table` | Buat migration baru |
| `php artisan migrate` | Jalankan semua migration pending |
| `php artisan migrate:status` | Lihat status semua migration |
| `php artisan migrate:rollback` | Kembalikan satu migration terakhir |
| `php artisan migrate:reset` | Kembalikan semua migration |
| `php artisan migrate:refresh` | Reset dan migrate ulang |
| `php artisan migrate:fresh` | Hapus semua tabel dan migrate ulang |
| `php artisan migrate --pretend` | Simulasikan eksekusi migration |
| `php artisan migrate --isolated` | Jalankan migrasi dalam mode isolasi |
| `php artisan schema:dump` | Buat schema dump |
| `php artisan schema:dump --prune` | Buat schema dump dan hapus migration lama |

#### 🎯 Membuat Tabel
| Perintah | Hasil |
|----------|--------|
| `Schema::create('users', function (Blueprint $table) { ... });` | Buat tabel baru |
| `Schema::table('users', function (Blueprint $table) { ... });` | Modifikasi tabel yang sudah ada |
| `Schema::dropIfExists('users')` | Hapus tabel jika ada |
| `Schema::hasTable('users')` | Cek apakah tabel exists |
| `Schema::hasColumn('users', 'email')` | Cek apakah kolom exists |

#### 🔧 Tipe Kolom Umum
| Tipe Kolom | Fungsi |
|------------|--------|
| `$table->id()` | Kolom ID auto-increment |
| `$table->uuid('uuid')` | Kolom UUID |
| `$table->ulid('ulid')` | Kolom ULID |
| `$table->string('name', 255)` | Kolom string (maks 255 karakter) |
| `$table->text('description')` | Kolom teks panjang |
| `$table->integer('age')` | Kolom integer |
| `$table->decimal('price', 10, 2)` | Kolom desimal (10 digit, 2 di belakang koma) |
| `$table->boolean('is_active')` | Kolom boolean |
| `$table->timestamp('created_at')` | Kolom timestamp |
| `$table->json('metadata')` | Kolom JSON |
| `$table->foreignId('user_id')` | Kolom foreign key |

#### 🛡️ Indexes
| Perintah | Fungsi |
|----------|--------|
| `$table->index('column')` | Tambah single index |
| `$table->unique('email')` | Tambah unique index |
| `$table->primary('id')` | Tambah primary key |
| `$table->dropIndex(['column'])` | Hapus index |
| `$table->dropUnique(['email'])` | Hapus unique index |

#### 🔐 Foreign Keys
| Perintah | Fungsi |
|----------|--------|
| `$table->foreignId('user_id')->constrained()` | Tambah foreign key ke users |
| `$table->foreignId('user_id')->constrained('custom_users', 'id')` | Foreign key ke tabel/kolom custom |
| `$table->foreignId('user_id')->constrained()->onDelete('cascade')` | Foreign key dengan cascade delete |
| `$table->dropForeign(['user_id'])` | Hapus foreign key |

#### 🎨 Modifikasi Kolom
| Perintah | Fungsi |
|----------|--------|
| `$table->renameColumn('old', 'new')` | Ganti nama kolom |
| `$table->dropColumn(['col1', 'col2'])` | Hapus beberapa kolom |
| `$table->string('name', 100)->change()` | Ubah kolom yang sudah ada (butuh doctrine/dbal) |

#### 🌐 Koneksi Database
| Perintah | Fungsi |
|----------|--------|
| `Schema::connection('pgsql')->create(...)` | Gunakan koneksi database tertentu |
| `protected $connection = 'pgsql';` | Tentukan koneksi di class migration |

#### 📋 Events Migration
| Event | Ketika Dipanggil |
|-------|------------------|
| `MigrationStarted` | Saat migration dimulai |
| `MigrationEnded` | Saat migration selesai |
| `MigrationsStarted` | Saat semua migration dimulai |
| `MigrationsEnded` | Saat semua migration selesai |

### 17. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Migration, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Ingat, Migration adalah jantung dari manajemen struktur database aplikasi. Menguasainya berarti kamu sudah siap membangun aplikasi Laravel yang aman, terstruktur, dan scalable.

Migration bukan hanya tentang membuat tabel, tapi tentang **mengelola evolusi struktur data secara aman dan terdokumentasi**. Dengan pendekatan Laravel yang fleksibel, kamu bisa membangun sistem database yang kuat dan mudah dikelola.

Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku!

---

**Catatan Tambahan:**
Migration adalah bagian penting dari pengembangan aplikasi web. Pastikan selalu menulis migration dengan hati-hati, test secara menyeluruh, dan pertimbangkan semua skenario perubahan struktur data dalam aplikasimu. Dengan pendekatan Laravel, migration bisa menjadi alat yang sangat ampuh dalam mengembangkan aplikasi - kuat, aman, dan tetap elegan. 🛠️✨
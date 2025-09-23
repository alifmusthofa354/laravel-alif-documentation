# 📚 **Migrations**

Migrations di Laravel adalah **version control untuk database** yang memungkinkan tim developer mendefinisikan, berbagi, dan memodifikasi struktur database aplikasi secara aman.



## 🔹 **1. Pengenalan Migrations**

Migrations digunakan untuk:

* Membuat tabel, kolom, dan index secara terstruktur.
* Rollback perubahan jika terjadi kesalahan.
* Menjaga database tetap konsisten antar developer.

Laravel menggunakan **Schema Facade** agar migrations dapat berjalan di berbagai database: MySQL, PostgreSQL, SQLite, MariaDB.



## 🔹 **2. Membuat Migration**

```bash
php artisan make:migration create_flights_table
```

* File migration tersimpan di `database/migrations`.
* Timestamp pada nama file menentukan urutan eksekusi.
* Laravel mencoba menebak nama tabel dari nama migration; jika gagal, bisa ditentukan manual.

**Opsi tambahan:**

* `--path=custom/path` → simpan migration di folder tertentu.
* Stub migration bisa dikustomisasi.



## 🔹 **3. Squashing Migration**

Untuk menghindari folder migrations penuh:

```bash
php artisan schema:dump
php artisan schema:dump --prune
```

* Laravel membuat file schema di `database/schema`.
* File ini dijalankan sebelum migrations lain.
* Commit file schema ke version control.

⚠️ Hanya tersedia untuk MariaDB, MySQL, PostgreSQL, SQLite.



## 🔹 **4. Struktur Migration**

Migration memiliki dua metode:

* `up()` → menambahkan tabel/kolom/index.
* `down()` → membatalkan perubahan `up()`.

Contoh:

```php
Schema::create('flights', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('airline');
    $table->timestamps();
});
```



## 🔹 **5. Koneksi Migration**

Jika menggunakan koneksi selain default:

```php
protected $connection = 'pgsql';
```



## 🔹 **6. Menjalankan & Mengelola Migration**

* Jalankan migration:

```bash
php artisan migrate
```

* Melihat status migration:

```bash
php artisan migrate:status
```

* Simulasi eksekusi (tanpa dijalankan):

```bash
php artisan migrate --pretend
```

* Rollback migrations:

```bash
php artisan migrate:rollback --step=5
php artisan migrate:reset
```

* Rollback + migrate:

```bash
php artisan migrate:refresh --seed
```

* Drop semua tabel + migrate:

```bash
php artisan migrate:fresh --seed
```

💡 **Tips**: gunakan `--isolated` saat deploy multi-server:

```bash
php artisan migrate --isolated
```



## 🔹 **7. Membuat Tabel**

```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email');
    $table->timestamps();
});
```

* Mengecek eksistensi tabel/kolom/index:

```php
Schema::hasTable('users');
Schema::hasColumn('users', 'email');
```

* Gunakan koneksi lain:

```php
Schema::connection('sqlite')->create('users', function (Blueprint $table) {
    $table->id();
});
```



## 🔹 **8. Kolom Database Lengkap**

### 🔹 8.1 Tipe Kolom Unik & Contoh

| Tipe Kolom      | Contoh                                                   |
| --------------- | -------------------------------------------------------- |
| `geometry`      | `$table->geometry('positions', 'point', srid: 0);`       |
| `geography`     | `$table->geography('coordinates', 'point', srid: 4326);` |
| `vector`        | `$table->vector('embedding', dimensions: 100);`          |
| `macAddress`    | `$table->macAddress('device');`                          |
| `rememberToken` | `$table->rememberToken();`                               |
| `json`          | `$table->json('options');`                               |
| `jsonb`         | `$table->jsonb('options');`                              |
| `uuid`          | `$table->uuid('id');`                                    |
| `ulid`          | `$table->ulid('id');`                                    |
| `uuidMorphs`    | `$table->uuidMorphs('taggable');`                        |
| `ulidMorphs`    | `$table->ulidMorphs('taggable');`                        |

### 🔹 8.2 Default Expressions

```php
use Illuminate\Database\Query\Expression;

$table->json('movies')->default(new Expression('(JSON_ARRAY())'));
$table->timestamp('created_at')->default(new Expression('CURRENT_TIMESTAMP'));
```



## 🔹 **9. Modifikasi Kolom**

* Ubah kolom:

```php
$table->string('name', 50)->change();
```

* Rename kolom:

```php
$table->renameColumn('from', 'to');
```

* Drop kolom:

```php
$table->dropColumn(['votes', 'avatar']);
```



## 🔹 **10. Indexes Kompleks**

* Membuat compound index:

```php
$table->index(['account_id', 'created_at'], 'account_created_index');
```

* Rename index:

```php
$table->renameIndex('old_index', 'new_index');
```

* Drop multiple indexes:

```php
$table->dropIndex(['account_id', 'created_at']);
```



## 🔹 **11. Foreign Key Lengkap**

* Membuat foreign key:

```php
$table->foreignId('user_id')
    ->nullable()
    ->constrained('users', 'id')
    ->onDelete('cascade')
    ->onUpdate('cascade');
```

* Drop foreign key:

```php
$table->dropForeign(['user_id']);
$table->dropForeign(['user_id', 'post_id']);
```

* Disable sementara:

```php
Schema::disableForeignKeyConstraints();
Schema::enableForeignKeyConstraints();
```



## 🔹 **12. Tips & Best Practices**

1. Gunakan `--isolated` saat deploy multi-server.
2. Commit schema dump agar developer baru bisa migrate cepat.
3. Selalu backup production sebelum `migrate:fresh` atau destructive operations.
4. Gunakan `--pretend` untuk melihat SQL tanpa mengeksekusi.
5. Tetap gunakan foreign key dan index untuk menjaga integritas data.



## 🔹 **13. Diagram Alur Migrations**

```text
┌──────────────────┐
│ php artisan migrate │
└─────────┬─────────┘
          │
   Cek schema dump
          │
  ┌───────▼────────┐
  │ Jalankan schema │
  └───────┬────────┘
          │
   Jalankan migrations pending
          │
  ┌───────▼────────┐
  │ Update tabel & kolom │
  └─────────────────────┘
```

* Event dispatched: `MigrationStarted`, `MigrationEnded`, `MigrationsStarted`, `MigrationsEnded`.



📌 **Kesimpulan**:
Dokumen ini mencakup **semua aspek Laravel Migrations**, termasuk tipe kolom unik, default expressions, modifikasi index/foreign key, tips deployment, dan diagram alur. Dengan panduan ini, tim developer dapat **mengelola database secara aman, efisien, dan konsisten**.
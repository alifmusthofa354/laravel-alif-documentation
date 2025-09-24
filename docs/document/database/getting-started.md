# 📚 Database Laravel: Permulaan

## 🌟 Pendahuluan

Hampir semua aplikasi web modern membutuhkan interaksi dengan **database**. Laravel menyederhanakan proses ini melalui beberapa metode: **raw SQL**, **query builder**, dan **Eloquent ORM**. Laravel mendukung berbagai database populer:

* 🟢 **MariaDB 10.3+**
* 🟢 **MySQL 5.7+**
* 🟢 **PostgreSQL 10.0+**
* 🟢 **SQLite 3.26.0+**
* 🟢 **SQL Server 2017+**

Selain itu, MongoDB juga didukung melalui paket `mongodb/laravel-mongodb`.

> Narasi: Laravel mempermudah integrasi database tanpa mengorbankan fleksibilitas, sehingga baik pemula maupun developer berpengalaman dapat bekerja efisien.

---

## ⚙️ Konfigurasi Database

Konfigurasi database Laravel berada di file:

```text
config/database.php
```

Di sini, Anda bisa mendefinisikan **semua koneksi database** dan menentukan koneksi default. Biasanya, konfigurasi ini menggunakan **environment variables** untuk mempermudah setup di berbagai lingkungan.

---

### 🟢 Konfigurasi SQLite

SQLite hanya membutuhkan satu file di sistem Anda. Contoh membuat database SQLite:

```bash
touch database/database.sqlite
```

Kemudian konfigurasi `.env`:

```bash
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite
DB_FOREIGN_KEYS=false  # optional, untuk menonaktifkan foreign key
```

> Narasi: SQLite cocok untuk pengembangan lokal atau aplikasi kecil karena setupnya sederhana dan ringan.

---

### 🟢 Konfigurasi Microsoft SQL Server

Pastikan ekstensi PHP `sqlsrv` dan `pdo_sqlsrv` sudah terpasang, serta driver ODBC Microsoft SQL Server jika diperlukan.

---

### 🟢 Konfigurasi Menggunakan URL

Beberapa provider seperti AWS atau Heroku menyediakan **Database URL**:

```text
mysql://root:password@127.0.0.1/forge?charset=UTF-8
```

Laravel mendukung URL ini sebagai alternatif konfigurasi multi-variabel.

---

### 🟢 Koneksi Read / Write

Laravel mendukung **koneksi berbeda untuk membaca dan menulis**:

```php
'mysql' => [
    'read' => ['host' => ['192.168.1.1', '196.168.1.2']],
    'write' => ['host' => ['196.168.1.3']],
    'sticky' => true,
    'database' => env('DB_DATABASE', 'laravel'),
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'strict' => true,
]
```

**Sticky Option**: memastikan data yang baru ditulis bisa langsung dibaca dalam satu siklus request.

---

## 💻 Menjalankan Query SQL

Laravel menggunakan **DB Facade** untuk eksekusi query.

### 🔹 Select Query

```php
$users = DB::select('select * from users where active = ?', [1]);

foreach ($users as $user) {
    echo $user->name;
}
```

### 🔹 Scalar Query

```php
$burgers = DB::scalar("select count(*) from menu where food = 'burger'");
```

### 🔹 Named Bindings

```php
$results = DB::select('select * from users where id = :id', ['id' => 1]);
```

### 🔹 Insert, Update, Delete

```php
DB::insert('insert into users (id, name) values (?, ?)', [1, 'Marc']);

$affected = DB::update('update users set votes = 100 where name = ?', ['Anita']);

$deleted = DB::delete('delete from users');
```

### 🔹 Statement & Unprepared

```php
DB::statement('drop table users');
DB::unprepared('update users set votes = 100 where name = "Dries"');
```

> Narasi: Gunakan `unprepared` hanya untuk operasi aman, karena raw query dapat rentan SQL Injection.

---

## 🔄 Transaksi Database

### 🔹 Menggunakan Transaction

```php
DB::transaction(function () {
    DB::update('update users set votes = 1');
    DB::delete('delete from posts');
});
```

### 🔹 Menangani Deadlock

```php
DB::transaction(function () {
    DB::update('update users set votes = 1');
    DB::delete('delete from posts');
}, 5); // retry 5 kali
```

### 🔹 Manual Transaction

```php
DB::beginTransaction();
DB::rollBack(); // jika gagal
DB::commit();   // jika sukses
```

---

## 🔍 Monitoring & CLI

### 🔹 Koneksi CLI

```bash
php artisan db
php artisan db mysql
```

### 🔹 Inspect Database

```bash
php artisan db:show
php artisan db:table users
```

### 🔹 Monitoring Open Connections

```bash
php artisan db:monitor --databases=mysql,pgsql --max=100
```

> Narasi: Laravel menyediakan berbagai fitur monitoring agar performa database tetap optimal dan masalah koneksi dapat segera ditangani.

---

## 📌 Event dan Listener Query

```php
DB::listen(function (QueryExecuted $query) {
    // $query->sql
    // $query->bindings
    // $query->time
});
```

### 🔹 Monitoring Query Lambat

```php
DB::whenQueryingForLongerThan(500, function ($connection, $event) {
    // Notifikasi jika query > 500ms
});
```

---

## ⚡ Kesimpulan

Laravel mempermudah manajemen database dari konfigurasi, query, transaksi, hingga monitoring. Dengan kombinasi **DB Facade**, **query builder**, dan **Eloquent ORM**, pengembangan aplikasi menjadi lebih cepat, aman, dan efisien.

---
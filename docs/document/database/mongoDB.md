# 🗄️ MongoDB dengan Laravel

## 📌 Pendahuluan

MongoDB adalah salah satu **database NoSQL** yang populer dan berbasis dokumen. MongoDB banyak digunakan karena **kemampuannya menulis data dalam jumlah besar**, cocok untuk analitik atau IoT, serta memiliki **high availability** melalui replica set dengan automatic failover. MongoDB juga mendukung **sharding** untuk skalabilitas horizontal dan memiliki **query language yang kuat** untuk agregasi, pencarian teks, atau query geospasial.

Alih-alih menyimpan data dalam tabel seperti SQL, **MongoDB menyimpan data sebagai dokumen** dalam format BSON (Binary JSON). Data ini bisa diambil kembali dalam format JSON, mendukung berbagai tipe data seperti **dokumen, array, embedded documents, dan binary data**.

> Sebelum menggunakan MongoDB dengan Laravel, disarankan menggunakan package **mongodb/laravel-mongodb** melalui Composer. Package ini memberikan integrasi Eloquent dan fitur Laravel lainnya secara lebih lengkap.

```bash
composer require mongodb/laravel-mongodb
```



## ⚙️ Instalasi

### 🧩 MongoDB Driver

Untuk menghubungkan Laravel dengan MongoDB, **ekstensi PHP `mongodb`** harus terpasang.

Jika menggunakan Laravel Herd atau PHP dari php.new, biasanya sudah tersedia. Jika perlu manual, gunakan PECL:

```bash
pecl install mongodb
```

Dokumentasi lengkap: [MongoDB PHP Extension Installation](https://www.php.net/manual/en/mongodb.installation.php)



### 🚀 Menjalankan Server MongoDB

MongoDB Community Server bisa diinstal di **Windows, macOS, Linux**, atau melalui **Docker**.

Setelah instalasi, koneksi MongoDB dapat dikonfigurasi di file `.env`:

```bash
MONGODB_URI="mongodb://localhost:27017"
MONGODB_DATABASE="laravel_app"
```

Untuk **hosting cloud** menggunakan **MongoDB Atlas**, tambahkan IP Anda di **IP Access List**. Koneksi Atlas di `.env`:

```bash
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority"
MONGODB_DATABASE="laravel_app"
```



### 📦 Instalasi Package Laravel MongoDB

Gunakan Composer untuk menginstal package:

```bash
composer require mongodb/laravel-mongodb
```

> Package ini **memerlukan ekstensi PHP mongodb** agar dapat bekerja. Pastikan ekstensi aktif di CLI dan web server.



## 🛠️ Konfigurasi

Tambahkan konfigurasi MongoDB di `config/database.php`:

```php
'connections' => [
    'mongodb' => [
        'driver' => 'mongodb',
        'dsn' => env('MONGODB_URI', 'mongodb://localhost:27017'),
        'database' => env('MONGODB_DATABASE', 'laravel_app'),
    ],
],
```



## 🌟 Fitur-Fitur

Dengan konfigurasi lengkap, Anda bisa menggunakan **MongoDB dengan Laravel** secara maksimal:

* 🗂️ **Eloquent Models**: Model bisa disimpan dalam collection MongoDB. Mendukung embedded relationships.
* 🔍 **Query Builder**: Menulis query kompleks.
* 🕒 **Caching**: Driver cache MongoDB mendukung TTL index untuk otomatis menghapus data kadaluarsa.
* 📤 **Queue Jobs**: Mendukung queue driver MongoDB.
* 📁 **GridFS**: Menyimpan file besar menggunakan GridFS dan Flysystem Adapter.
* 🧩 **Kompatibilitas**: Banyak package pihak ketiga berbasis database atau Eloquent bisa digunakan dengan MongoDB.

Contoh penggunaan Eloquent dengan MongoDB:

```php
use App\Models\User;

// Membuat data baru
$user = new User();
$user->name = 'Budi';
$user->email = 'budi@example.com';
$user->save();

// Mengambil data
$users = User::where('name', 'Budi')->get();
```



## 📖 Rekomendasi Belajar

Untuk belajar lebih lanjut, kunjungi **[MongoDB Quick Start](https://www.mongodb.com/docs/manual/tutorial/getting-started/)**.



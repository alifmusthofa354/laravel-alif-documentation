# 📁 Struktur Direktori Laravel

Dokumentasi ini menjelaskan struktur direktori default Laravel dan tujuan dari setiap direktori dalam aplikasi Laravel.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Direktori Root](#direktori-root)
3. [Direktori App](#direktori-app)
4. [Direktori Bootstrap](#direktori-bootstrap)
5. [Direktori Config](#direktori-config)
6. [Direktori Database](#direktori-database)
7. [Direktori Public](#direktori-public)
8. [Direktori Resources](#direktori-resources)
9. [Direktori Routes](#direktori-routes)
10. [Direktori Storage](#direktori-storage)
11. [Direktori Tests](#direktori-tests)
12. [Direktori Vendor](#direktori-vendor)

## 🎯 Pendahuluan

Struktur direktori default Laravel dimaksudkan untuk menyediakan titik awal yang baik untuk aplikasi besar dan kecil. Namun, Anda bebas mengatur aplikasi Anda sesuka Anda. Laravel tidak menerapkan batasan ketat tentang di mana logika aplikasi Anda harus hidup - asalkan Composer dapat memuat kelas-kelas Anda secara otomatis.

## 📁 Direktori Root

Direktori root aplikasi Laravel berisi beberapa file penting:

### 📄 File Penting
- `.env` - File konfigurasi environment
- `.env.example` - Contoh file environment
- `artisan` - CLI untuk Laravel
- `composer.json` - Dependency manager PHP
- `composer.lock` - Lock file Composer
- `package.json` - Dependency manager Node.js
- `phpunit.xml` - Konfigurasi testing
- `README.md` - Dokumentasi awal
- `server.php` - Server development
- `webpack.mix.js` - Konfigurasi Laravel Mix

## 📁 Direktori App

Direktori `app` berisi kode inti aplikasi Anda. Hampir semua kelas dalam aplikasi Anda akan berada dalam direktori ini.

### 📁 Subdirektori Penting
- `Console/` - Perintah Artisan kustom
- `Exceptions/` - Handler exception kustom
- `Http/` - Controller, middleware, form request
- `Models/` - Model Eloquent
- `Providers/` - Service provider

### 📁 Struktur Http
- `Controllers/` - Controller aplikasi
- `Middleware/` - Middleware HTTP
- `Requests/` - Form request untuk validasi

### 📁 Struktur Models
- `Factories/` - Factory model untuk testing
- `Policies/` - Policy authorization

## 📁 Direktori Bootstrap

Direktori `bootstrap` berisi file `app.php` yang mem-bootstrap framework. Direktori ini juga menyimpan cache framework yang dihasilkan oleh Laravel.

## 📁 Direktori Config

Direktori `config` seperti namanya, berisi semua file konfigurasi aplikasi Anda. Direktori ini penting untuk menyesuaikan perilaku framework Anda.

### 📄 File Konfigurasi Utama
- `app.php` - Konfigurasi aplikasi utama
- `auth.php` - Konfigurasi autentikasi
- `broadcasting.php` - Konfigurasi broadcasting
- `cache.php` - Konfigurasi caching
- `cors.php` - Konfigurasi CORS
- `database.php` - Konfigurasi database
- `filesystems.php` - Konfigurasi filesystem
- `hashing.php` - Konfigurasi hashing
- `logging.php` - Konfigurasi logging
- `mail.php` - Konfigurasi mail
- `queue.php` - Konfigurasi queue
- `services.php` - Konfigurasi layanan pihak ketiga
- `session.php` - Konfigurasi session
- `view.php` - Konfigurasi view

## 📁 Direktori Database

Direktori `database` berisi migrasi database, model factory, dan seeders.

### 📁 Subdirektori
- `factories/` - Factory model untuk testing
- `migrations/` - File migrasi database
- `seeders/` - Seeder database

## 📁 Direktori Public

Direktori `public` berisi file `index.php`, yang merupakan titik masuk untuk semua permintaan yang masuk ke aplikasi Anda dan mengkonfigurasi autoloading. Direktori ini juga berisi aset Anda seperti gambar, JavaScript, dan CSS.

### ⚠️ Penting
Direktori `public` harus menjadi "web root" atau "document root" dari aplikasi Anda. Tidak ada file dalam direktori aplikasi Laravel lainnya yang boleh dipublikasikan secara publik melalui web server karena mereka mungkin berisi kode sensitif.

### 📄 File Penting
- `index.php` - Titik masuk aplikasi
- `.htaccess` - Konfigurasi Apache
- `robots.txt` - Instruksi untuk crawler
- `favicon.ico` - Ikon situs

## 📁 Direktori Resources

Direktori `resources` berisi view, aset mentah (LESS, SASS, JavaScript), dan file bahasa.

### 📁 Subdirektori
- `css/` - File CSS mentah
- `js/` - File JavaScript mentah
- `lang/` - File bahasa
- `views/` - View Blade

## 📁 Direktori Routes

Direktori `routes` berisi semua definisi route untuk aplikasi Anda.

### 📄 File Route Utama
- `web.php` - Route web dengan session
- `api.php` - Route API tanpa session
- `channels.php` - Route broadcast
- `console.php` - Perintah Artisan kustom

## 📁 Direktori Storage

Direktori `storage` berisi template Blade yang telah dikompilasi, file session berbasis file, file cache, dan file lain yang dihasilkan oleh framework.

### 📁 Subdirektori
- `app/` - File aplikasi
- `framework/` - File framework
- `logs/` - File log

### 📁 Framework Storage
- `cache/` - File cache
- `sessions/` - File session
- `testing/` - File testing
- `views/` - Template Blade yang telah dikompilasi

## 📁 Direktori Tests

Direktori `tests` berisi test otomatis Anda. Contoh unit test dan feature test disediakan secara default.

### 📁 Subdirektori
- `Feature/` - Feature test
- `Unit/` - Unit test
- `CreatesApplication.php` - Trait untuk membuat aplikasi

## 📁 Direktori Vendor

Direktori `vendor` berisi dependensi Composer Anda. Direktori ini dibuat secara otomatis saat Anda menjalankan perintah `composer install` atau `composer update`.

## 🎯 Organisasi Kustom

Anda bebas mengatur aplikasi Anda sesuka Anda. Laravel tidak menerapkan batasan ketat tentang di mana logika aplikasi Anda harus hidup - asalkan Composer dapat memuat kelas-kelas Anda secara otomatis.

### 📁 Contoh Struktur Kustom
```
app/
├── Models/
├── Http/
│   ├── Controllers/
│   └── Middleware/
├── Services/
├── Repositories/
└── Traits/
```

## 🧠 Kesimpulan

Memahami struktur direktori Laravel membantu Anda:
- Menemukan file dengan cepat
- Memahami alur kerja aplikasi
- Mengorganisir kode dengan baik
- Menyesuaikan struktur sesuai kebutuhan

Struktur default Laravel menyediakan fondasi yang kuat untuk aplikasi besar dan kecil, tetapi fleksibel untuk disesuaikan dengan kebutuhan proyek Anda.
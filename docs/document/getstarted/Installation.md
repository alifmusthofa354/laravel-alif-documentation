# 🚀 Instalasi dan Konfigurasi Laravel

> **Catatan:** Panduan ini akan membawa Anda melalui proses instalasi dan konfigurasi awal Laravel dari nol hingga siap dikembangkan.

---

## 📖 Pengantar Instalasi Laravel

Sebelum kita mulai membuat aplikasi web yang luar biasa dengan Laravel, kita perlu memastikan lingkungan pengembangan kita sudah siap. Instalasi Laravel sebenarnya cukup mudah, tapi ada beberapa prasyarat yang perlu dipenuhi terlebih dahulu.

### 🤔 Kenapa Laravel?

Laravel adalah framework PHP yang paling populer saat ini karena:

- **Sintaks yang elegan** - Mudah dibaca dan ditulis
- **Fitur lengkap** - Authentication, routing, ORM, dll sudah tersedia
- **Komunitas besar** - Banyak tutorial dan dukungan
- **Dokumentasi lengkap** - Mudah dipelajari
- **Ekosistem kaya** - Forge, Envoyer, Vapor, dll

---

## ⚙️ Prasyarat Sistem

Sebelum menginstal Laravel, pastikan sistem Anda memenuhi persyaratan berikut:

### 🖥️ Server Requirements

- PHP >= 8.1
- BCMath PHP Extension
- Ctype PHP Extension
- cURL PHP Extension
- DOM PHP Extension
- Fileinfo PHP Extension
- JSON PHP Extension
- Mbstring PHP Extension
- OpenSSL PHP Extension
- PCRE PHP Extension
- PDO PHP Extension
- Tokenizer PHP Extension
- XML PHP Extension

### 🛠️ Tools yang Direkomendasikan

1. **Composer** - Package manager untuk PHP
2. **Database** - MySQL, PostgreSQL, SQLite, atau SQL Server
3. **Web Server** - Apache, Nginx, atau built-in server Laravel
4. **Code Editor** - VS Code dengan ekstensi PHP/Laravel

---

## 📥 Metode Instalasi Laravel

Ada beberapa cara untuk menginstal Laravel. Kita akan membahas dua metode utama:

### 🎯 Metode 1: Menggunakan Laravel Installer (Direkomendasikan)

#### 1. Instal Laravel Installer

Pertama, instal Laravel installer secara global melalui Composer:

```bash
composer global require laravel/installer
```

#### 2. Buat Proyek Baru

Setelah itu, buat proyek Laravel baru:

```bash
laravel new nama-aplikasi
```

Contoh:
```bash
laravel new blog
```

### 🎯 Metode 2: Menggunakan Composer Create-Project

Alternatif lain adalah menggunakan perintah Composer langsung:

```bash
composer create-project laravel/laravel nama-aplikasi
```

Contoh:
```bash
composer create-project laravel/laravel blog
```

---

## 🏗️ Struktur Direktori Laravel

Setelah instalasi selesai, mari kita pahami struktur direktori Laravel:

```
nama-aplikasi/
├── app/                 # Kode aplikasi inti
├── bootstrap/           # File bootstrapping framework
├── config/              # File konfigurasi
├── database/            # Migration, seeder, factory
├── public/              # Direktori publik (entry point)
├── resources/           # View, asset (CSS, JS)
├── routes/              # Definisi route
├── storage/             # File yang di-generate Laravel
├── tests/               # Unit dan feature test
├── vendor/              # Package Composer
├── .env                 # Environment variable
├── .env.example         # Contoh file environment
├── artisan              # Command line interface Laravel
├── composer.json        # Dependency manager
└── ...
```

### 📁 Direktori Penting

#### 📁 `app/`
Berisi kode inti aplikasi Anda:
- `Models/` - Model Eloquent
- `Http/Controllers/` - Controller
- `Providers/` - Service provider

#### 📁 `config/`
Berisi semua file konfigurasi Laravel:
- `app.php` - Konfigurasi aplikasi
- `database.php` - Konfigurasi database
- `mail.php` - Konfigurasi email

#### 📁 `database/`
Berisi migration, seeder, dan factory:
- `migrations/` - File migrasi database
- `seeders/` - Data contoh
- `factories/` - Factory untuk testing

#### 📁 `public/`
Direktori publik yang dapat diakses web:
- `index.php` - Entry point aplikasi
- Asset CSS, JS, gambar

#### 📁 `resources/`
Berisi view dan asset yang belum dikompilasi:
- `views/` - Template Blade
- `js/` - JavaScript
- `css/` - CSS

#### 📁 `routes/`
Berisi definisi route:
- `web.php` - Route web
- `api.php` - Route API
- `console.php` - Command Artisan

---

## ⚙️ Konfigurasi Awal

### 🔧 File Environment (.env)

Setelah instalasi, salin file `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Atau di Windows:
```cmd
copy .env.example .env
```

### 🔐 Generate Application Key

Laravel memerlukan application key untuk enkripsi:

```bash
php artisan key:generate
```

Perintah ini akan mengisi `APP_KEY` di file `.env`.

### ⚙️ Konfigurasi Database

Edit file `.env` untuk mengatur koneksi database:

```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database
DB_USERNAME=username
DB_PASSWORD=password
```

Untuk SQLite:
```bash
DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=
```

---

## ▶️ Menjalankan Aplikasi

### 🚀 Menggunakan Laravel Development Server

Laravel menyediakan server pengembangan bawaan:

```bash
php artisan serve
```

Secara default, aplikasi akan berjalan di `http://localhost:8000`.

Untuk mengganti port:
```bash
php artisan serve --port=8080
```

Untuk mengganti host:
```bash
php artisan serve --host=192.168.1.100
```

### 🌐 Menggunakan Valet (Mac)

Jika menggunakan Mac dan Valet:
```bash
valet park
```

Lalu akses `http://nama-folder.test`.

### 🐳 Menggunakan Sail (Docker)

Laravel Sail menyediakan environment Docker bawaan:

```bash
./vendor/bin/sail up
```

Akses di `http://localhost`.

---

## 🧪 Verifikasi Instalasi

Untuk memastikan Laravel terinstal dengan benar:

1. Jalankan server pengembangan
2. Akses `http://localhost:8000` di browser
3. Anda akan melihat halaman welcome Laravel

### 🧪 Mengecek Versi Laravel

```bash
php artisan --version
```

Atau dengan perintah:
```bash
php artisan about
```

---

## 🛠️ Konfigurasi Tambahan

### 📦 Instalasi Node Dependencies

Jika proyek Anda memiliki frontend assets:

```bash
npm install
npm run dev
```

### 🎨 Konfigurasi IDE

Untuk VS Code, instal ekstensi yang direkomendasikan:
1. PHP Intelephense
2. Laravel Blade Snippets
3. Laravel Extra Intellisense
4. DotENV

### 🧪 Setup Database

Jalankan migrasi database default:

```bash
php artisan migrate
```

---

## 🎉 Kesimpulan

Selamat! Anda telah berhasil:
- Menginstal Laravel di sistem Anda
- Memahami struktur direktori Laravel
- Mengkonfigurasi environment aplikasi
- Menjalankan server pengembangan

### 📝 Poin Penting:
1. **Prasyarat penting** - Pastikan PHP dan Composer terinstal
2. **Environment** - File `.env` mengatur konfigurasi aplikasi
3. **Application Key** - Diperlukan untuk enkripsi
4. **Server Development** - Gunakan `php artisan serve` untuk pengembangan

### 🚀 Langkah Selanjutnya:
1. Pelajari tentang routing Laravel
2. Buat controller pertama Anda
3. Membuat view dengan Blade templating
4. Menghubungkan dengan database

Dengan instalasi yang sudah selesai, Anda sekarang siap untuk memulai perjalanan pengembangan aplikasi web dengan Laravel!
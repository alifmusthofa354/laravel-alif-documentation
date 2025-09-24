# ⚙️ Konfigurasi Laravel

Dokumentasi ini menjelaskan cara mengkonfigurasi aplikasi Laravel, termasuk pengaturan file konfigurasi, environment variables, dan pengaturan penting lainnya.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [File Konfigurasi](#file-konfigurasi)
3. [Environment Configuration](#environment-configuration)
4. [Akses Konfigurasi](#akses-konfigurasi)
5. [Konfigurasi Cache](#konfigurasi-cache)
6. [Mode Maintenance](#mode-maintenance)

## 🎯 Pendahuluan

Semua file konfigurasi untuk framework Laravel disimpan dalam direktori `config`. Setiap opsi memiliki dokumentasi yang jelas, jadi pastikan untuk membaca melalui file-file tersebut untuk membiasakan diri dengan opsi yang tersedia.

Laravel tidak perlu konfigurasi tambahan untuk menggunakan konfigurasi - konfigurasi bekerja di luar kotak. Anda bebas mengubah konfigurasi sesuai kebutuhan aplikasi Anda.

## 📁 File Konfigurasi

Semua file konfigurasi Laravel disimpan dalam direktori `config`. Setiap opsi memiliki dokumentasi yang jelas, sehingga Anda bisa dengan mudah menemukan opsi yang Anda butuhkan.

Beberapa file konfigurasi penting:
- `app.php` - Konfigurasi aplikasi utama
- `auth.php` - Konfigurasi autentikasi
- `cache.php` - Konfigurasi caching
- `database.php` - Konfigurasi database
- `filesystems.php` - Konfigurasi filesystem
- `logging.php` - Konfigurasi logging
- `mail.php` - Konfigurasi mail
- `queue.php` - Konfigurasi queue
- `services.php` - Konfigurasi layanan pihak ketiga
- `session.php` - Konfigurasi session

## 🌍 Environment Configuration

Seringkali penting untuk memiliki nilai konfigurasi yang berbeda berdasarkan lingkungan tempat aplikasi berjalan. Misalnya, Anda mungkin ingin menggunakan driver cache yang berbeda secara lokal dibandingkan dengan server produksi Anda.

Untuk membuat hal ini mudah, Laravel menggunakan library PHP yang populer bernama [DotEnv](https://github.com/vlucas/phpdotenv) oleh Vance Lucas. Pada instalasi baru Laravel, direktori root aplikasi Anda akan berisi file `.env.example` yang mendefinisikan banyak environment variables umum.

Selama instalasi, Laravel secara otomatis akan membuat file `.env` dari file `.env.example`. File `.env` tidak boleh dicommit ke source control Anda karena setiap developer/server yang menggunakan aplikasi Anda mungkin memerlukan konfigurasi environment yang berbeda.

Jika Anda membuat aplikasi dengan tim, Anda mungkin ingin terus menyertakan file `.env.example` dengan aplikasi Anda. Dengan memberikan nilai placeholder dalam file tersebut, tim lain dapat dengan jelas melihat environment variables mana yang diperlukan untuk menjalankan aplikasi Anda.

### 🔐 Application Key

File `.env` akan berisi variabel `APP_KEY`. Nilai ini digunakan oleh Laravel untuk enkripsi data penting seperti session dan cookies. Anda tidak boleh pernah mengubah `APP_KEY` setelah aplikasi berada dalam produksi, karena hal ini akan menyebabkan data terenkripsi menjadi tidak valid.

Jika Anda perlu mengatur `APP_KEY`, gunakan perintah Artisan:

```bash
php artisan key:generate
```

### 📦 Retrieving Environment Configuration

Semua variabel dalam file `.env` dapat diakses oleh aplikasi Anda melalui fungsi helper `env()`. Namun, Anda sebenarnya tidak akan perlu menggunakan fungsi ini secara langsung dalam banyak bagian aplikasi Anda. Konfigurasi Laravel akan menerima nilai dari file `.env` secara otomatis.

Contoh penggunaan `env()`:
```php
'debug' => env('APP_DEBUG', false),
```

Parameter kedua adalah nilai default yang akan digunakan jika variabel environment tidak ada.

### ⚠️ Environment Variable Types

Variabel environment selalu disediakan dalam bentuk string, jadi perlu diperhatikan beberapa nilai yang dikembalikan:

| Variable | Description |
|---------|-------------|
| `true` | Boolean true |
| `(true)` | Boolean true |
| `false` | Boolean false |
| `(false)` | Boolean false |
| `empty` | Empty string |
| `(empty)` | Empty string |
| `null` | Null |
| `(null)` | Null |

Jika Anda memerlukan nilai boolean `false`, Anda harus menetapkannya dalam file `.env` sebagai `(false)`. Hal yang sama berlaku untuk kata kunci `empty` dan `null`.

### 📝 Environment Variable Prefixes

Untuk menghindari kolisi dengan environment variables sistem lain, Anda dapat menambahkan prefix ke file `.env` Anda. Misalnya, jika nama aplikasi Anda "Acme", Anda dapat menambahkan prefix `ACME_` ke semua variabel:

```bash
ACME_APP_NAME=Acme
ACME_DB_HOST=localhost
ACME_DB_DATABASE=acme
```

## 🔍 Akses Konfigurasi

Anda dapat dengan mudah mengakses nilai konfigurasi Anda menggunakan fungsi helper `config()` global dari mana saja dalam aplikasi Anda. Nilai konfigurasi dapat diakses menggunakan sintaks "dot", yang menyertakan nama file dan opsi yang ingin Anda akses.

```php
$value = config('app.timezone');
```

Untuk mengatur nilai konfigurasi runtime, berikan array ke fungsi `config`:

```php
config(['app.timezone' => 'America/Chicago']);
```

## 💾 Konfigurasi Cache

Untuk memberikan peningkatan kecepatan, Anda harus meng-cache semua file konfigurasi Anda ke dalam satu file menggunakan perintah Artisan `config:cache`. Ini akan menggabungkan semua opsi konfigurasi untuk aplikasi Anda ke dalam satu file yang akan dimuat dengan cepat oleh framework.

Anda harus menjalankan perintah `php artisan config:cache` sebagai bagian dari rutinitas deployment produksi Anda. Perintah ini tidak boleh dijalankan selama pengembangan lokal karena opsi konfigurasi sering perlu diubah selama pengembangan aplikasi.

### 🔄 Reloading Configuration Cache

Jika Anda mengeksekusi perintah `config:cache` selama proses deployment, Anda harus memastikan bahwa Anda hanya memanggil fungsi `env` dari dalam file konfigurasi Anda.

### 🚫 Configuration Caching & Environment

Setelah konfigurasi di-cache, file `.env` tidak akan dimuat dan semua pemanggilan fungsi `env()` akan mengembalikan `null`. Oleh karena itu, pastikan Anda hanya memanggil fungsi `env` dari dalam file konfigurasi Anda.

## 🛠️ Mode Maintenance

Ketika aplikasi Anda dalam mode maintenance, tampilan kustom akan ditampilkan untuk semua permintaan ke aplikasi. Ini membuatnya mudah untuk "mematikan" aplikasi Anda saat sedang diperbarui atau saat melakukan maintenance.

### 🔧 Activating Maintenance Mode

Untuk mengaktifkan mode maintenance, eksekusi perintah Artisan `down`:

```bash
php artisan down
```

Untuk menonaktifkan mode maintenance, gunakan perintah `up`:

```bash
php artisan up
```

### 🎨 Custom Maintenance Mode Responses

Anda dapat menentukan template yang digunakan untuk mode maintenance dengan menambahkan opsi `--render` ke perintah `down`:

```bash
php artisan down --render="errors::503"
```

### ⏱️ Maintenance Mode & Queues

Saat aplikasi Anda dalam mode maintenance, tidak ada job queue yang akan diproses. Job akan dilanjutkan ketika aplikasi keluar dari mode maintenance.

### 🔁 Bypassing Maintenance Mode

Untuk memungkinkan server tertentu mengakses aplikasi bahkan dalam mode maintenance, Anda dapat menggunakan opsi `--secret`:

```bash
php artisan down --secret="1630542a-246b-4b66-afa1-dd72a4c43515"
```

Setelah memasuki mode maintenance dengan secret, Anda dapat menavigasi ke URL aplikasi dengan secret key yang ditambahkan ke URL dan Anda akan diberikan akses ke aplikasi:

```
https://example.com/1630542a-246b-4b66-afa1-dd72a4c43515
```

## 🧠 Kesimpulan

- File konfigurasi Laravel disimpan dalam direktori `config`
- Gunakan file `.env` untuk konfigurasi berbasis environment
- Akses nilai konfigurasi dengan fungsi `config()`
- Cache konfigurasi untuk produksi dengan perintah `config:cache`
- Gunakan mode maintenance saat memperbarui aplikasi

Dengan memahami sistem konfigurasi Laravel, Anda dapat dengan mudah menyesuaikan aplikasi Anda untuk berbagai lingkungan dan kebutuhan.
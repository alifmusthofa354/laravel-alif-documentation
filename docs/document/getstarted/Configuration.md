# ⚙️ Konfigurasi Laravel: Panduan dari Guru Kesayanganmu (Edisi Pengaturan Super Mudah)

Hai murid-murid kesayanganku! Selamat datang di kelas konfigurasi Laravel. Hari ini kita akan belajar tentang **Konfigurasi** - cara mengatur dan menyesuaikan aplikasimu agar bekerja sesuai kebutuhanmu. Setelah mempelajari ini, kamu bisa mengelola aplikasi seperti seorang master pengaturan! Ayo kita mulai petualangan pengaturan ini dengan semangat!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Itu Konfigurasi Sebenarnya?

**Analogi:** Bayangkan kamu punya rumah baru yang bisa disesuaikan sesuai keinginanmu - lampu bisa diatur warnanya, suhu bisa diatur panas dinginnya, dan musik bisa dipilih genre-nya. Konfigurasi Laravel adalah seperti **alat kontrol pusat** rumah pintarmu, tempat kamu mengatur semua pengaturan aplikasimu.

**Mengapa ini penting?** Karena aplikasi kamu butuh diatur sesuai lingkungan - lokal, staging, produksi - masing-masing punya pengaturan yang berbeda.

**Bagaimana cara kerjanya?** 
1. **Kamu siapkan file konfigurasi** seperti manual rumah pintarmu
2. **Laravel membaca pengaturan** sesuai lingkungan (local, staging, production)
3. **Aplikasi bekerja sesuai pengaturan** yang telah kamu tentukan

Jadi, alur konfigurasi kita menjadi:
`File Konfigurasi -> Laravel -> Aplikasi Berjalan Sesuai Aturan`

Tanpa konfigurasi yang tepat, aplikasimu akan bingung dan bisa berjalan tidak sesuai harapan. 😰

### 2. ✍️ Struktur Konfigurasi Laravel (Pengaturan Dasar)

**Analogi:** Bayangkan kamu punya buku panduan lengkap untuk mengatur rumah pintarmu. Setiap halaman menerangkan pengaturan untuk bagian tertentu - listrik, air, keamanan, dll. File konfigurasi Laravel adalah seperti buku panduan ini, masing-masing mengatur bagian tertentu dari aplikasimu.

**Mengapa ini penting?** Karena Laravel menyediakan banyak pengaturan terpisah untuk hal-hal berbeda.

**Bagaimana cara kerjanya?** File-file konfigurasi disimpan di direktori `config/`:

```
config/
├── app.php         # Aplikasi utama
├── auth.php        # Autentikasi
├── cache.php       # Caching
├── database.php    # Database
├── filesystems.php # File sistem
├── logging.php     # Logging
├── mail.php        # Email
├── queue.php       # Queue
├── services.php    # Layanan eksternal
└── session.php     # Session
```

**Contoh Struktur Dasar File Konfigurasi:**
```php
<?php
// config/app.php

return [
    'name' => env('APP_NAME', 'Laravel'),
    'env' => env('APP_ENV', 'production'),
    'debug' => (bool) env('APP_DEBUG', false),
    'url' => env('APP_URL', 'http://localhost'),
    'timezone' => 'Asia/Jakarta',
    'locale' => 'en',
    'fallback_locale' => 'en',
    'faker_locale' => 'en_US',
    'key' => env('APP_KEY'),
    'cipher' => 'AES-256-CBC',
];
```

**Penjelasan Kode:**
- File konfigurasi mengembalikan array asosiatif
- Gunakan `env()` untuk mengambil nilai dari file `.env`
- Nilai default disediakan untuk keamanan

### 3. ⚡ File-Fil Konfigurasi Penting (Kotak Perkakas)

**Analogi:** Bayangkan kamu seorang tukang yang punya kotak alat berisi perkakas untuk pekerjaan berbeda - obeng untuk memperbaiki listrik, kunci pas untuk memperbaiki air, dll. Setiap file konfigurasi adalah seperti alat spesifik untuk mengatur bagian tertentu dari aplikasimu.

**Mengapa ini penting?** Karena kamu harus tahu file mana yang mengatur apa.

**Bagaimana cara kerjanya?** Ini beberapa file penting dan fungsinya:

**1. `config/app.php` - Pengaturan Utama:**
```php
<?php
// config/app.php

return [
    // Nama aplikasi
    'name' => env('APP_NAME', 'Laravel'),
    
    // Environment (local, staging, production)
    'env' => env('APP_ENV', 'production'),
    
    // Debug mode (aktifkan untuk development)
    'debug' => (bool) env('APP_DEBUG', false),
    
    // Base URL
    'url' => env('APP_URL', 'http://localhost'),
    
    // Zona waktu
    'timezone' => 'Asia/Jakarta',
    
    // Bahasa default
    'locale' => env('APP_LOCALE', 'en'),
    
    // Key enkripsi
    'key' => env('APP_KEY'),
];
```

**2. `config/database.php` - Pengaturan Database:**
```php
<?php
// config/database.php

return [
    'default' => env('DB_CONNECTION', 'mysql'),
    'connections' => [
        'mysql' => [
            'driver' => 'mysql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            // ... konfigurasi lainnya
        ],
    ],
];
```

**3. `config/cache.php` - Pengaturan Cache:**
```php
<?php
// config/cache.php

return [
    'default' => env('CACHE_DRIVER', 'file'),
    'stores' => [
        'file' => [
            'driver' => 'file',
            'path' => storage_path('framework/cache/data'),
        ],
        'redis' => [
            'driver' => 'redis',
            'connection' => 'cache',
        ],
    ],
];
```

Setiap file konfigurasi telah diisi dengan pengaturan default yang bekerja dengan baik untuk kebanyakan aplikasi.

---

## Bagian 2: Environment Configuration - Pengaturan Berdasarkan Lingkungan 🤖

### 4. 🌍 Mengapa Butuh Environment Variables (Pengaturan Berbeda untuk Berbeda Tempat)

**Analogi:** Bayangkan kamu punya tiga rumah berbeda - rumah di kota (local), rumah di pegunungan (staging), dan rumah di pantai (production). Setiap rumah butuh pengaturan berbeda - lampu, suhu, keamanan, dll. Environment variables adalah seperti pengaturan khusus untuk masing-masing rumahmu.

**Mengapa ini penting?** Karena kamu tidak ingin menggunakan database produksi saat development, atau menampilkan debug error ke pengguna produksi.

**Bagaimana cara kerjanya?** Laravel menggunakan library DotEnv untuk membaca file `.env`:

**Contoh File `.env`:**
```
# Konfigurasi Aplikasi
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:1234567890abcdefghijklmnopqrstuvwxyz=
APP_DEBUG=true
APP_URL=http://localhost

# Konfigurasi Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_local
DB_USERNAME=root
DB_PASSWORD=

# Konfigurasi Mail
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
```

### 5. 🔐 Application Key (Kunci Rahasia Aplikasi)

**Analogi:** Bayangkan kamu punya brankas di rumah pintarmu. Kunci brankas ini harus sangat rahasia dan hanya kamu yang tahu. APP_KEY adalah seperti kunci ajaib yang digunakan Laravel untuk mengenkripsi data penting seperti session dan cookie pengguna.

**Mengapa ini penting?** Karena tanpa kunci ini, data rahasia pengguna tidak aman dan tidak bisa disimpan dengan benar.

**Bagaimana cara kerjanya?** 
```bash
# Membuat kunci baru saat instalasi
php artisan key:generate

# Atau untuk membuat kunci baru
php artisan key:generate --show
```

**Penjelasan Kode:**
- `APP_KEY` digunakan untuk enkripsi data penting
- Jangan pernah mengganti `APP_KEY` saat aplikasi sudah produksi
- Gunakan perintah Artisan untuk membuat kunci yang aman

### 6. 📦 Mengakses Environment Variables (Ambil Pengaturanmu)

**Analogi:** Bayangkan kamu punya remote control yang bisa mengambil pengaturan apapun dari kotak pengaturan pusat. Fungsi `env()` adalah seperti remote control ini yang bisa mengambil nilai dari file `.env`.

**Mengapa ini penting?** Karena kamu sering butuh nilai dari file `.env` di dalam aplikasimu.

**Bagaimana cara kerjanya?** Gunakan fungsi `env()`:

**Contoh Akses Environment Variables:**
```php
<?php
// Di dalam file konfigurasi atau controller

// Ambil nilai tanpa default
$databaseHost = env('DB_HOST'); // Akan NULL jika tidak ada

// Ambil nilai dengan default
$databaseHost = env('DB_HOST', '127.0.0.1'); // Default jika tidak ada

// Konversi ke tipe data tertentu
$debugMode = (bool) env('APP_DEBUG', false);
$maxUploadSize = (int) env('MAX_UPLOAD_SIZE', 2048);
$allowedTypes = explode(',', env('ALLOWED_FILE_TYPES', 'jpg,png,pdf'));

// Di dalam file konfigurasi
'debug' => (bool) env('APP_DEBUG', false),
'url' => env('APP_URL', 'http://localhost'),
'timezone' => env('APP_TIMEZONE', 'UTC'),
```

### 7. ⚠️ Tipe Data Environment Variables (Pengaturan yang Pintar)

**Analogi:** Bayangkan kamu memberi perintah ke asisten virtual. Terkadang kamu harus spesifikkan apakah perintah itu angka, teks, atau pilihan ya/tidak. Environment variables juga perlu diberi tahu tipe datanya agar Laravel mengerti.

**Mengapa ini penting?** Karena semua environment variable dibaca sebagai string, tapi terkadang kamu butuh boolean, null, atau array.

**Bagaimana cara kerjanya?** Laravel otomatis mengonversi beberapa nilai:

| Variabel di .env | Tipe PHP | Arti |
|------------------|----------|------|
| `DEBUG=true` | Boolean `true` | Boolean benar |
| `DEBUG=(true)` | Boolean `true` | Boolean benar (ekspresi) |
| `DEBUG=false` | String "false" | Tetap string! |
| `DEBUG=(false)` | Boolean `false` | Boolean salah (ekspresi) |
| `MESSAGE=empty` | String "empty" | String kosong |
| `MESSAGE=(empty)` | String "" | String benar-benar kosong |
| `API_KEY=null` | String "null" | String null |
| `API_KEY=(null)` | `null` | Nilai null sebenarnya |

**Contoh Implementasi:**
```php
<?php
// File .env
APP_DEBUG=(true)
MAINTENANCE_MODE=(false)
MAX_USERS=(null)
ALLOWED_IPS=(empty)
```

**Dalam aplikasi:**
```php
$debug = env('APP_DEBUG'); // Akan true (boolean)
$maintenance = env('MAINTENANCE_MODE'); // Akan false (boolean)
$maxUsers = env('MAX_USERS'); // Akan null
$allowedIps = env('ALLOWED_IPS'); // Akan '' (empty string)
```

---

## Bagian 3: Jurus Akses Konfigurasi - Ambil dan Atur Nilai 🚀

### 8. 🔍 Mengakses Konfigurasi (Ambil Pengaturanmu)

**Analogi:** Bayangkan kamu punya kotak ajaib yang bisa memberikan informasi apapun dari file konfigurasi hanya dengan menyebut nama dan lokasinya. Fungsi `config()` adalah seperti kotak ajaib ini yang bisa mengambil nilai konfigurasi dari mana saja.

**Mengapa ini penting?** Karena kamu sering perlu mengambil nilai konfigurasi di controller, middleware, atau service.

**Bagaimana cara kerjanya?** Gunakan fungsi `config()`:

**Contoh Lengkap Akses Konfigurasi:**
```php
<?php

// Ambil nilai konfigurasi dengan notasi dot
$timezone = config('app.timezone'); // 'Asia/Jakarta'
$debugMode = config('app.debug'); // boolean
$cacheDriver = config('cache.default'); // 'file'

// Ambil nilai dengan default jika tidak ditemukan
$customValue = config('services.custom_value', 'default_value');

// Ambil array konfigurasi lengkap
$appConfig = config('app'); // Seluruh array dari config/app.php

// Periksa apakah konfigurasi ada
if (config()->has('app.name')) {
    $appName = config('app.name');
}

// Dalam controller
class HomeController extends Controller
{
    public function index()
    {
        $timezone = config('app.timezone');
        $appName = config('app.name');
        
        return view('home', compact('timezone', 'appName'));
    }
}
```

### 9. ✏️ Mengubah Konfigurasi Runtime (Atur Pengaturan Saat Jalan)

**Analogi:** Bayangkan kamu bisa mengganti pengaturan rumah pintarmu saat sedang digunakan - misalnya mengganti suhu dari 22°C ke 25°C tanpa harus mematikan sistemnya. Fungsi `config()` juga bisa digunakan untuk mengganti nilai konfigurasi saat aplikasi sedang berjalan.

**Mengapa ini penting?** Karena terkadang kamu perlu mengganti konfigurasi berdasarkan kondisi tertentu saat runtime.

**Bagaimana cara kerjanya?** Kirim array ke fungsi `config()`:

**Contoh Lengkap Runtime Configuration:**
```php
<?php

class ConfigurationService
{
    public function updateAppConfig()
    {
        // Ganti nilai konfigurasi saat runtime
        config(['app.timezone' => 'America/New_York']);
        config(['app.locale' => 'es']);
        
        // Juga bisa ganti beberapa sekaligus
        config([
            'cache.default' => 'redis',
            'session.driver' => 'redis',
            'queue.default' => 'redis',
        ]);
        
        // Pengaturan baru langsung digunakan
        $timezone = config('app.timezone'); // 'America/New_York'
    }
}

// Dalam controller
public function dynamicConfig(Request $request)
{
    // Ganti konfigurasi berdasarkan input user
    if ($request->input('theme') === 'dark') {
        config(['app.theme' => 'dark']);
    } else {
        config(['app.theme' => 'light']);
    }
    
    return response()->json(['theme' => config('app.theme')]);
}
```

### 10. 📝 Prefix Environment Variables (Pengaturan Aman dari Tabrakan)

**Analogi:** Bayangkan kamu punya banyak remote control untuk banyak perangkat elektronik. Untuk mencegah remote TV mematikan AC atau sebaliknya, kamu memberi kode khusus untuk setiap remote. Prefix environment variable adalah seperti kode khusus ini agar tidak terjadi konflik.

**Mengapa ini penting?** Karena environment variables bisa bertabrakan dengan variabel sistem lain saat deploy ke lingkungan berbeda.

**Bagaimana cara kerjanya?** Gunakan prefix sesuai nama aplikasi:

**Contoh File .env dengan Prefix:**
```
# Prefix untuk aplikasi "LARAVEL_APP"
LARAVEL_APP_NAME=LaravelApp
LARAVEL_APP_ENV=local
LARAVEL_APP_KEY=base64:1234567890abcdefghijklmnopqrstuvwxyz=
LARAVEL_APP_DEBUG=true
LARAVEL_APP_URL=http://localhost

# Database dengan prefix
LARAVEL_DB_HOST=127.0.0.1
LARAVEL_DB_DATABASE=laravel_app_local
LARAVEL_DB_USERNAME=root
LARAVEL_DB_PASSWORD=

# Service dengan prefix
LARAVEL_MAIL_HOST=smtp.gmail.com
LARAVEL_MAIL_PORT=587
```

**Cara mengakses dengan prefix dalam helper:**
```php
<?php
// Buat helper untuk mengakses dengan prefix
function app_env($key, $default = null)
{
    return env('LARAVEL_' . strtoupper($key), $default);
}

// Gunakan di aplikasi
$debugMode = app_env('debug', false);
$databaseHost = app_env('db_host', '127.0.0.1');
$appName = app_env('name', 'Default App');
```

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Konfigurasi 🧰

### 11. 💾 Konfigurasi Cache (Percepat Aplikasimu)

**Analogi:** Bayangkan kamu punya buku panduan rumah pintarmu yang sangat tebal. Setiap kali kamu ingin mencari sesuatu, kamu harus membuka buku itu dan mencari halamannya. Konfigurasi cache adalah seperti membuat versi ringkas dan cepat dari buku panduan itu, sehingga kamu bisa mengakses semua pengaturan dalam satu langkah.

**Mengapa ini penting?** Karena membaca banyak file konfigurasi bisa membuat aplikasi lambat.

**Bagaimana cara kerjanya?** Gunakan perintah Artisan untuk meng-cache semua konfigurasi:

**Proses Konfigurasi Cache:**
```bash
# Cache semua file konfigurasi
php artisan config:cache

# Clear cache konfigurasi
php artisan config:clear

# Cache dan clear sekaligus
php artisan config:clear && php artisan config:cache
```

**Contoh Implementasi Cache:**
```php
<?php
// File di storage/framework/cache/config.php (hasil dari config:cache)
return [
    'app' => [
        'name' => 'Laravel',
        'env' => 'production',
        'debug' => false,
        'url' => 'https://example.com',
        // ... semua nilai konfigurasi dalam satu array
    ],
    'database' => [
        'default' => 'mysql',
        'connections' => [
            'mysql' => [
                'driver' => 'mysql',
                'host' => 'localhost',
                'database' => 'production_db',
                // ... semua nilai konfigurasi database
            ],
        ],
    ],
    // ... semua file konfigurasi lainnya
];
```

### 12. ⚠️ Peringatan Tentang Konfigurasi Cache (Awas!)

**Analogi:** Bayangkan kamu membuat versi cetak buku panduan rumah pintarmu, tapi kamu lupa menyertakan halaman yang bisa berubah setiap hari. Setelah buku dicetak, kamu tidak bisa mengubah halaman tersebut tanpa mencetak ulang. Saat konfigurasi di-cache, Laravel tidak lagi membaca file `.env`, jadi kamu harus berhati-hati.

**Mengapa ini penting?** Karena jika tidak hati-hati, aplikasi bisa error saat konfigurasi di-cache.

**Bagaimana cara kerjanya?** Saat `config:cache` dijalankan:

**Peringatan Penting:**
```php
<?php
// TIDAK BOLEH dilakukan jika ingin cache konfigurasi
'api_key' => env('API_KEY'), // INI ERROR saat dikunci!

// YANG BENAR: gunakan dalam file konfigurasi
'api_key' => env('API_KEY', 'default_key'), // Ini OK
```

**File Konfigurasi yang Aman untuk Cache:**
```php
<?php
// config/services.php
return [
    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],
    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],
];
```

**File Konfigurasi yang BERMASALAH saat Cache:**
```php
<?php
// TIDAK DISARANKAN: akses env() di luar file konfigurasi saat cache aktif
public function getApiKey()
{
    return env('API_KEY'); // Akan NULL saat konfigurasi di-cache
}

// YANG BENAR: akses dari konfigurasi
public function getApiKey()
{
    return config('services.api_key'); // Akan bekerja saat cache aktif
}
```

### 13. 🛠️ Mode Maintenance (Istirahatkan Aplikasimu)

**Analogi:** Bayangkan kamu punya toko yang sedang renovasi. Kamu ingin menutup toko sementara waktu dan memberi tahu pengunjung bahwa kamu sedang istirahat atau memperbaiki sesuatu. Mode maintenance adalah seperti papan "Tutup Sementara" untuk aplikasimu.

**Mengapa ini penting?** Karena kamu butuh waktu untuk memperbarui aplikasi tanpa mengganggu pengguna.

**Bagaimana cara kerjanya?** Gunakan perintah Artisan untuk mengaktifkan mode maintenance:

**Contoh Lengkap Mode Maintenance:**
```bash
# Aktifkan maintenance mode
php artisan down

# Nonaktifkan maintenance mode
php artisan up

# Aktifkan dengan pesan khusus
php artisan down --message="Sedang dalam perbaikan, mohon bersabar!"

# Aktifkan dengan render view khusus
php artisan down --render="errors::maintenance"

# Aktifkan dengan secret bypass
php artisan down --secret="1630542a-246b-4b66-afa1-dd72a4c43515"

# Aktifkan untuk waktu terbatas
php artisan down --until="2023-12-31 12:00:00"
```

**Contoh View Maintenance Mode:**
```blade
{{-- resources/views/errors/maintenance.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <title>Aplikasi Sedang Dalam Perawatan</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .maintenance { max-width: 600px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="maintenance">
        <h1>Maaf, kami sedang dalam perawatan</h1>
        <p>Aplikasi sedang diperbarui untuk memberikan pengalaman terbaik.</p>
        <p>Kami akan kembali segera!</p>
    </div>
</body>
</html>
```

**Bypass Maintenance Mode:**
```php
<?php
// Jika kamu menetapkan secret, kamu bisa mengakses aplikasi
// dengan URL: https://example.com/1630542a-246b-4b66-afa1-dd72a4c43515
// Ini berguna untuk pengembang yang perlu tetap mengakses aplikasi
```

**Queue & Maintenance Mode:**
- Saat mode maintenance aktif, queue tidak akan diproses
- Queue akan dilanjutkan saat maintenance mode dimatikan

### 14. 🧪 Konfigurasi Berdasarkan Environment (Pengaturan Pintar)

**Analogi:** Bayangkan kamu punya sistem pengaturan otomatis yang bisa tahu apakah kamu sedang di rumah, di kantor, atau di tempat lain, dan mengatur lingkungan sesuai lokasimu. Laravel bisa melakukan hal yang sama berdasarkan environment (local, staging, production).

**Mengapa ini penting?** Karena kamu butuh pengaturan berbeda untuk lingkungan berbeda.

**Bagaimana cara kerjanya?** Gunakan kondisi berdasarkan environment:

**Contoh Konfigurasi Environment:**
```php
<?php
// config/app.php

return [
    'name' => env('APP_NAME', 'Laravel'),
    'env' => env('APP_ENV', 'production'),
    'debug' => env('APP_ENV') === 'local', // Aktifkan debug hanya di local
    'url' => env('APP_URL', 'http://localhost'),
    
    // Pengaturan berdasarkan environment
    'asset_url' => env('ASSET_URL'),
    'timezone' => env('APP_TIMEZONE', 'UTC'),
    'locale' => env('APP_LOCALE', 'en'),
    
    // Cache driver berbeda per environment
    'cache' => [
        'driver' => env('CACHE_DRIVER', 'file'),
        'connection' => env('CACHE_CONNECTION', null),
    ],
];

// Di service provider atau middleware
if (app()->environment('local')) {
    // Pengaturan khusus local development
    config(['logging.level' => 'debug']);
} elseif (app()->environment('production')) {
    // Pengaturan khusus production
    config(['logging.level' => 'error']);
}
```

---

## Bagian 5: Menjadi Master Konfigurasi 🏆

### 15. ✨ Wejangan dari Guru

1.  **Gunakan environment variables untuk rahasia**: Jangan hardcode password, API key, atau rahasia lainnya.
2.  **Gunakan konfigurasi cache di production**: Ini membuat aplikasi jauh lebih cepat.
3.  **Jangan gunakan `env()` di luar file konfigurasi saat cache aktif**: Hanya gunakan dalam file `config/`.
4.  **Gunakan maintenance mode saat deploy**: Ini mencegah pengguna melihat error saat perubahan.
5.  **Gunakan prefix untuk environment variables**: Mencegah konflik dengan variabel sistem.
6.  **Simpan `.env.example` di source control**: Ini membantu developer lain tahu apa yang dibutuhkan.
7.  **Gunakan tipe data yang benar dalam `.env`**: Gunakan `(false)`, `(null)`, `(empty)` saat diperlukan.

### 16. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Konfigurasi di Laravel:

#### 🔄 Konfigurasi Cache
| Perintah | Fungsi |
|----------|--------|
| `php artisan config:cache` | Cache semua file konfigurasi |
| `php artisan config:clear` | Hapus cache konfigurasi |
| `php artisan config:clear && php artisan config:cache` | Bersih dan cache ulang |

#### 🔐 Environment Variables
| Format | Tipe Data |
|--------|-----------|
| `DEBUG=true` | Boolean `true` |
| `DEBUG=(true)` | Boolean `true` |
| `DEBUG=false` | String "false" |
| `DEBUG=(false)` | Boolean `false` |
| `VALUE=null` | String "null" |
| `VALUE=(null)` | `null` |
| `VALUE=empty` | String "empty" |
| `VALUE=(empty)` | String "" |

#### 📁 File Konfigurasi Penting
| File | Kegunaan |
|------|----------|
| `app.php` | Konfigurasi aplikasi utama |
| `database.php` | Konfigurasi koneksi database |
| `cache.php` | Konfigurasi caching |
| `auth.php` | Konfigurasi autentikasi |
| `services.php` | Konfigurasi layanan eksternal |
| `mail.php` | Konfigurasi email |
| `queue.php` | Konfigurasi queue |
| `session.php` | Konfigurasi session |
| `filesystems.php` | Konfigurasi sistem file |

#### 🧪 Akses Konfigurasi
| Penggunaan | Fungsi |
|------------|--------|
| `config('app.name')` | Ambil nilai konfigurasi |
| `config('app.name', 'default')` | Ambil nilai dengan default |
| `config(['app.name' => 'New Name'])` | Atur nilai konfigurasi |
| `config()->has('app.name')` | Cek apakah konfigurasi ada |

#### 🛠️ Maintenance Mode
| Perintah | Fungsi |
|----------|--------|
| `php artisan down` | Aktifkan maintenance mode |
| `php artisan up` | Nonaktifkan maintenance mode |
| `php artisan down --message="..."` | Aktifkan dengan pesan |
| `php artisan down --render="..."` | Gunakan view khusus |
| `php artisan down --secret="..."` | Aktifkan dengan bypass key |

#### 🧠 Best Practices
| Praktik | Penjelasan |
|---------|------------|
| Jangan hardcode rahasia | Gunakan environment variables |
| Gunakan cache di production | Percepat loading aplikasi |
| Simpan .env.example | Bantu developer lain |
| Gunakan prefix | Cegah konflik variabel |
| Gunakan maintenance mode saat deploy | Lindungi pengguna dari error |

### 17. 🧪 Contoh Lengkap Implementasi

Mari kita buat contoh lengkap konfigurasi untuk aplikasi produksi:

**1. File `.env` untuk Production:**
```
APP_NAME=ProductionApp
APP_ENV=production
APP_KEY=base64:1234567890abcdefghijklmnopqrstuvwxyz=
APP_DEBUG=false
APP_URL=https://production-app.com
APP_TIMEZONE=Asia/Jakarta
APP_LOCALE=id

DB_CONNECTION=mysql
DB_HOST=db.production.com
DB_PORT=3306
DB_DATABASE=prod_app_db
DB_USERNAME=prod_user
DB_PASSWORD=super_secret_password

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

MAIL_MAILER=smtp
MAIL_HOST=smtp.production.com
MAIL_PORT=587
MAIL_USERNAME=mail@production.com
MAIL_PASSWORD=mail_password
MAIL_ENCRYPTION=tls
```

**2. File Konfigurasi Kustom:**
```php
<?php
// config/production.php

return [
    'performance' => [
        'cache_enabled' => true,
        'debug_mode' => false,
        'log_level' => 'error',
    ],
    'security' => [
        'force_https' => true,
        'rate_limiting' => true,
        'api_throttling' => true,
    ],
    'monitoring' => [
        'sentry_dsn' => env('SENTRY_DSN'),
        'bugsnag_api_key' => env('BUGSNAG_API_KEY'),
    ],
];
```

**3. Service untuk Manajemen Konfigurasi:**
```php
<?php
// app/Services/ConfigurationService.php

namespace App\Services;

class ConfigurationService
{
    public function updatePerformanceConfig()
    {
        // Atur konfigurasi performa berdasarkan environment
        if (app()->environment('production')) {
            config([
                'app.debug' => false,
                'logging.level' => 'error',
                'cache.default' => 'redis',
                'queue.default' => 'redis',
            ]);
        } elseif (app()->environment('local')) {
            config([
                'app.debug' => true,
                'logging.level' => 'debug',
                'cache.default' => 'file',
                'queue.default' => 'sync',
            ]);
        }
    }
    
    public function getSecurityConfig()
    {
        return [
            'https_required' => config('production.security.force_https'),
            'rate_limiting' => config('production.security.rate_limiting'),
        ];
    }
}
```

**4. Middleware untuk Konfigurasi:**
```php
<?php
// app/Http/Middleware/EnvironmentConfigMiddleware.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnvironmentConfigMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Atur konfigurasi berdasarkan environment
        if (app()->environment('production')) {
            // Atur pengaturan khusus production
            config(['app.asset_url' => config('app.url')]);
        }
        
        return $next($request);
    }
}
```

### 18. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi tentang Konfigurasi di Laravel, dari konsep dasar hingga teknik-teknik lanjut. Kamu hebat! Dengan memahami dan menerapkan konfigurasi dengan benar, kamu sekarang bisa mengelola aplikasi seperti seorang master konfigurasi.

Ingat, **konfigurasi adalah fondasi penting dalam aplikasi yang dapat diandalkan dan skalabel**. Menguasainya berarti kamu sudah siap membuat aplikasi Laravel yang tidak hanya hebat, tapi juga mudah dikelola dan bisa beradaptasi dengan berbagai lingkungan.

Jangan pernah berhenti bereksperimen dengan berbagai teknik konfigurasi! Semakin mahir kamu menggunakannya, semakin percaya diri kamu dalam mengembangkan aplikasi yang berkualitas tinggi. Selamat ngoding, murid kesayanganku! 🚀⚙️
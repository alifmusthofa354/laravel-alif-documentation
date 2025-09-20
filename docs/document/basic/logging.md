# **Logging di Laravel**

## 1. Pendahuluan

Logging adalah salah satu fitur penting dalam sebuah aplikasi untuk memantau apa yang sedang terjadi di dalam sistem. Laravel menyediakan layanan logging yang sangat kuat dan fleksibel. Dengan logging, kita dapat menyimpan pesan ke file, menuliskannya ke sistem error log, atau bahkan mengirimkan notifikasi ke Slack untuk memberitahu seluruh tim.

Laravel mengatur logging menggunakan konsep **channel**. Setiap channel merepresentasikan cara tertentu dalam menulis log. Misalnya:

* **single channel** → menulis log ke satu file.
* **slack channel** → mengirim pesan log ke Slack.

Di balik layar, Laravel menggunakan **Monolog**, sebuah library logging populer di PHP, sehingga kita bisa memanfaatkan banyak handler dan formatter yang tersedia.

---

## 2. Konfigurasi Logging

Semua pengaturan logging Laravel terdapat pada file **`config/logging.php`**.

Secara default, Laravel menggunakan channel **stack**, yang menggabungkan beberapa channel sekaligus. Ini memudahkan kita menulis log ke lebih dari satu tempat.

Contoh konfigurasi default:

```php
'stack' => [
    'driver' => 'stack',
    'channels' => ['single', 'slack'],
],
```


Dengan konfigurasi di atas, setiap log akan dicatat ke file **single** dan juga dikirim ke Slack jika memenuhi level minimal yang disyaratkan.

---

## 3. Driver Channel yang Tersedia

Laravel mendukung berbagai macam **driver channel**, di antaranya:

| Nama       | Deskripsi                                  |
| ---------- | ------------------------------------------ |
| custom     | Membuat channel khusus dengan factory.     |
| daily      | Menyimpan log harian (rotasi otomatis).    |
| errorlog   | Menggunakan ErrorLogHandler dari Monolog.  |
| monolog    | Channel generik menggunakan Monolog.       |
| papertrail | Mengirim log ke Papertrail.                |
| single     | Menyimpan log dalam satu file.             |
| slack      | Mengirim log ke Slack menggunakan Webhook. |
| stack      | Menggabungkan beberapa channel.            |
| syslog     | Menyimpan log ke sistem log (Syslog).      |


Dengan berbagai pilihan ini, kita bisa menyesuaikan kebutuhan logging, mulai dari debugging lokal, monitoring server, hingga kolaborasi tim lewat Slack.

---

## 4. Konfigurasi Channel Populer

### 4.1 Single dan Daily

Channel **single** dan **daily** punya opsi tambahan seperti:

* **bubble** → apakah log diteruskan ke channel lain.
* **locking** → mencoba mengunci file log sebelum menulis.
* **permission** → izin file log.
* **days** (khusus daily) → jumlah hari log disimpan.

Contoh konfigurasi:

```php
'daily' => [
    'driver' => 'daily',
    'path' => storage_path('logs/laravel.log'),
    'level' => 'debug',
    'days' => 14,
],
```

### 4.2 Slack

Untuk mengirim log ke Slack, kita perlu membuat webhook URL, lalu masukkan ke file `.env`:

```env
LOG_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz
```

Konfigurasi channel:

```php
'slack' => [
    'driver' => 'slack',
    'url' => env('LOG_SLACK_WEBHOOK_URL'),
    'username' => 'Laravel Log',
    'emoji' => ':boom:',
    'level' => 'critical',
],
```


Dengan konfigurasi ini, log dengan level minimal **critical** akan langsung masuk ke channel Slack tim kita.

---

## 5. Tingkatan Log (Log Levels)

Laravel mengikuti standar **RFC 5424**, dengan tingkatan dari paling darurat hingga informasi biasa:

* emergency
* alert
* critical
* error
* warning
* notice
* info
* debug

Contoh penggunaan:

```php
use Illuminate\Support\Facades\Log;

Log::debug('Pesan debug untuk developer.');
Log::error('Terjadi error pada proses pembayaran.');
Log::emergency('Sistem down total!');
```


Level log sangat penting agar kita bisa memfilter informasi sesuai kebutuhan. Misalnya, di server produksi kita mungkin hanya ingin mencatat log dengan level **error** ke atas.

---

## 6. Menulis Pesan Log

Laravel menggunakan **Facade Log** untuk menulis pesan.

Contoh di controller:

```php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function show(string $id)
    {
        Log::info('Menampilkan profil user dengan ID: {id}', ['id' => $id]);

        return view('user.profile', [
            'user' => User::findOrFail($id)
        ]);
    }
}
```


Dengan cara ini, setiap kali metode `show` dipanggil, kita bisa melacak siapa user yang sedang dilihat.

---

## 7. Konteks Log

Selain pesan utama, kita juga bisa menambahkan **context** berupa data tambahan.

```php
Log::info('User gagal login.', ['id' => $user->id]);
```

Atau menambahkan konteks global untuk semua log:

```php
Log::withContext(['request-id' => 'abc-123']);
```


Fitur ini sangat berguna untuk melacak log berdasarkan request ID, sehingga debugging lebih mudah dilakukan.

---

## 8. Menulis ke Channel Tertentu

Kadang kita ingin menulis log hanya ke channel tertentu:

```php
Log::channel('slack')->info('Ada sesuatu yang terjadi!');
```

Atau menulis ke beberapa channel sekaligus:

```php
Log::stack(['single', 'slack'])->info('Notifikasi ke file dan Slack');
```

---

## 9. Channel On-Demand

Kita juga bisa membuat channel log sementara (on-demand) tanpa konfigurasi di file `logging.php`.

```php
Log::build([
    'driver' => 'single',
    'path' => storage_path('logs/custom.log'),
])->info('Log sementara ditulis di custom.log');
```

---

## 10. Kustomisasi Monolog

Kadang kita ingin kontrol penuh terhadap Monolog. Laravel menyediakan opsi **tap** untuk menyesuaikan formatter atau handler.

### Contoh menambahkan formatter:

```php
'single' => [
    'driver' => 'single',
    'tap' => [App\Logging\CustomizeFormatter::class],
    'path' => storage_path('logs/laravel.log'),
    'level' => 'debug',
],
```

```php
namespace App\Logging;

use Illuminate\Log\Logger;
use Monolog\Formatter\LineFormatter;

class CustomizeFormatter
{
    public function __invoke(Logger $logger): void
    {
        foreach ($logger->getHandlers() as $handler) {
            $handler->setFormatter(new LineFormatter(
                '[%datetime%] %channel%.%level_name%: %message% %context%'
            ));
        }
    }
}
```


Dengan formatter khusus, kita bisa menyesuaikan format log agar lebih mudah dibaca atau diolah oleh sistem monitoring.

---

## 11. Tailing Log dengan Laravel Pail

**Pail** adalah package Laravel untuk menonton log secara real-time langsung dari CLI, lebih fleksibel daripada `tail -f`.

### Instalasi:

```bash
composer require --dev laravel/pail
```

### Penggunaan:

```bash
php artisan pail
php artisan pail -v    # lebih detail
php artisan pail -vv   # termasuk stack trace
```

### Filter Log:

```bash
php artisan pail --filter="QueryException"
php artisan pail --message="User created"
php artisan pail --level=error
php artisan pail --user=1
```


Dengan Pail, kita bisa lebih cepat menemukan error tertentu, misalnya error SQL (QueryException) atau aktivitas user tertentu.

---

# **Kesimpulan**

Logging di Laravel sangat fleksibel dan dapat diintegrasikan ke berbagai layanan. Dengan memanfaatkan channel, context, level, serta tool seperti Laravel Pail, kita bisa memantau aplikasi secara efektif, baik saat pengembangan maupun produksi.

---

# 🕐 Task Scheduler di Laravel: Panduan Lengkap dari Guru Kesayanganmu (Edisi Super Scheduler)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel lanjutan. Hari ini, kita akan membahas sebuah fitur yang **sangat penting** dalam dunia aplikasi otomatis: **Task Scheduler**. Setelah beberapa kali revisi, akhirnya Guru paham apa yang sebenarnya kalian inginkan: sebuah panduan yang **super lengkap** tapi dijelaskan dengan **super sederhana**, seolah-olah Guru sedang duduk di sebelahmu sambil menjelaskan pelan-pelan.

Di edisi ini, kita akan kupas tuntas **semua detail** tentang Task Scheduler, tapi setiap topik akan Guru ajarkan dengan sabar. Task Scheduler adalah alat yang membantu kita **menjadwalkan tugas-tugas otomatis** di aplikasi Laravel kita: membersihkan database lama, mengirim email periodik, backup data, dan segudang tugas lainnya. Siap? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Task Scheduler Itu Sebenarnya?

**Analogi:** Bayangkan kamu seorang manajer kantor yang sangat rapi dan sistematis. Kamu punya banyak tugas yang harus dilakukan secara rutin: membersihkan sampah jam 10 malam setiap hari, mengirim laporan mingguan setiap hari Senin, atau backup data setiap bulan sekali. Dulu, kamu harus mengingatkan semua staf secara manual. Tapi dengan Task Scheduler, kamu bisa membuat sistem otomatis seperti "asisten virtual" yang mengingatkan dan menjalankan semua tugas itu secara otomatis tanpa kamu harus ada di kantor!

**Mengapa ini penting?** Karena tanpa Task Scheduler, kamu harus bergantung pada sistem cron tradisional yang:
- Harus diatur manual di server (SSH)
- Tidak bisa di-track di source control
- Susah di-maintain saat aplikasi semakin kompleks
- Banyak kekurangan lainnya

**Bagaimana cara kerjanya?** Task Scheduler itu seperti "kalender digital pintar" yang bisa menjalankan perintah kamu secara otomatis sesuai jadwal yang kamu tentukan - semuanya diatur dalam kode Laravel sehingga bisa di-track dan di-maintain dengan mudah!

Jadi, alur kerja (workflow) aplikasi kita menjadi sangat rapi:

`➡️ Jadwal Diatur di Laravel -> 🕐 Task Scheduler -> 📅 Cron System (1 entry) -> 🔁 Tugas Otomatis Berjalan`

Tanpa Task Scheduler, kamu harus kelola banyak cron entry manual. 😵

**Manfaat utama Task Scheduler:**
- Semua jadwal tugas diatur dalam source control
- Mudah untuk dilihat, diedit, dan dimaintain
- Banyak pilihan frekuensi dan kondisi eksekusi
- Bisa integrasi dengan berbagai sistem (Artisan Commands, Jobs, Shell Commands, etc)

## Bagian 2: Resep Pertamamu: Dari Dasar ke Mahir 🚀

### 2. ⚙️ Pendahuluan (Mengapa dan Bagaimana Task Scheduler)

**Analogi:** Bayangkan kamu sedang membuat jadwal kegiatan harian yang biasanya kamu tulis di kertas. Dulu kamu harus mengingat semua hal yang harus dilakukan, sekarang kamu punya aplikasi kalender pintar yang mengingatkan kamu secara otomatis dan bisa kamu edit kapan saja.

**Mengapa ini penting?** Karena Task Scheduler menyelesaikan banyak permasalahan yang ada di sistem cron tradisional.

**Bagaimana cara kerjanya?** Laravel hanya butuh **satu entri cron** di server kamu, dan semua jadwal tugas lainnya diatur di dalam aplikasi Laravel kamu sendiri!

#### Sebelum dan Sesudah Task Scheduler

**Dulu (Metode Cron Manual):**
- Banyak entri cron di server
- Harus SSH ke server untuk lihat/ubah
- Jadwal tidak ada di source control
- Sulit untuk maintain saat kompleks

**Sekarang (Dengan Laravel Task Scheduler):**
- Cuma satu entri cron di server
- Semua jadwal di source control
- Mudah untuk lihat dan ubah
- Bisa gunakan semua fitur Laravel

#### Setup Dasar Task Scheduler

**Mengapa?** Karena kamu perlu setup satu entri cron yang akan menjalankan Laravel scheduler.

**Bagaimana?** Tambahkan satu baris cron di server kamu:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

**Penjelasan:**
- `* * * * *` berarti jalankan setiap menit
- `php artisan schedule:run` adalah perintah yang memeriksa apakah ada tugas yang harus dijalankan sekarang
- `>> /dev/null 2>&1` untuk mengabaikan output dan error

Setelah setup ini, semua jadwal tugas kamu akan diatur di dalam aplikasi Laravel, bukan lagi di server!

### 3. 📋 Definisi Jadwal Tugas (Tempat dan Cara Mengatur Tugas Otomatis)

**Analogi:** Bayangkan kamu sedang membuat daftar tugas harian di buku catatan. Dulu kamu tulis di banyak tempat, sekarang kamu punya satu buku khusus untuk semua jadwal tugas kamu.

**Mengapa ini penting?** Karena semua jadwal tugas harus didefinisikan di satu tempat agar mudah dikelola dan di-maintain.

**Bagaimana cara kerjanya?** Semua jadwal tugas didefinisikan di `routes/console.php` atau bisa juga di `bootstrap/app.php` jika kamu ingin pisahkan dari file console utama.

#### 3.1 A. Menjadwalkan Closure (Fungsi Langsung)

**Mengapa?** Karena kadang kamu cuma butuh jalankan beberapa baris kode secara rutin, tanpa perlu buat command khusus.

**Bagaimana?** Gunakan `Schedule::call()` dengan closure:

```php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    DB::table('recent_users')->delete();
})->daily();
```

**Contoh Lengkap Penerapan:**
```php
// routes/console.php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Log;

// Contoh: Bersihkan tabel temporary setiap hari jam 12 malam
Schedule::call(function () {
    DB::table('temporary_files')->where('created_at', '<', now()->subDay())->delete();
    Log::info('Temporary files cleaned up');
})->daily()->at('00:00');

// Contoh: Update statistik harian
Schedule::call(function () {
    $activeUsers = DB::table('users')->where('last_login_at', '>', now()->subDay())->count();
    DB::table('daily_stats')->updateOrInsert(
        ['date' => now()->toDateString()],
        ['active_users' => $activeUsers]
    );
    Log::info('Daily stats updated');
})->daily()->at('23:59');

// Contoh: Validasi data secara berkala
Schedule::call(function () {
    DB::table('users')
        ->whereNull('email_verified_at')
        ->where('created_at', '<', now()->subDays(7))
        ->delete();
    Log::info('Unverified accounts cleaned up');
})->weekly()->mondays()->at('02:00');
```

**Penjelasan Kode:**
- `Schedule::call()` digunakan untuk menjadwalkan fungsi anonymous
- `->daily()` menentukan frekuensi eksekusi
- Sangat cocok untuk tugas-tugas sederhana

#### 3.2 B. Menjadwalkan Invokable Object (Class dengan __invoke)

**Analogi:** Bayangkan kamu punya banyak tugas yang kompleks, seperti punya banyak staf dengan tugas spesifik. Daripada kamu lakukan semuanya sendiri, kamu beri tugas ke masing-masing staf sesuai keahliannya.

**Mengapa?** Karena untuk tugas yang kompleks, lebih baik kamu buat class sendiri agar kode lebih terorganisir dan bisa di-test dengan mudah.

**Bagaimana?** Buat class dengan method `__invoke()` lalu jadwalkan:

```php
// Buat class untuk tugas kompleks
class DeleteRecentUsers
{
    public function __invoke()
    {
        DB::table('recent_users')->delete();
    }
}

// Jadwalkan class ini
Schedule::call(new DeleteRecentUsers)->daily();
```

**Contoh Lengkap Invokable Class:**
```php
<?php

namespace App\Console\Tasks;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CleanUpTasks
{
    public function __invoke()
    {
        $this->cleanTemporaryFiles();
        $this->cleanOldLogs();
        $this->updateStatistics();
    }
    
    private function cleanTemporaryFiles()
    {
        DB::table('temporary_files')
            ->where('created_at', '<', now()->subHours(24))
            ->delete();
        
        Log::info('Temporary files cleaned up');
    }
    
    private function cleanOldLogs()
    {
        DB::table('logs')
            ->where('created_at', '<', now()->subDays(30))
            ->delete();
        
        Log::info('Old logs cleaned up');
    }
    
    private function updateStatistics()
    {
        // Update statistik kompleks di sini
        $userCount = DB::table('users')->count();
        $orderCount = DB::table('orders')->where('created_at', '>', now()->subDay())->count();
        
        DB::table('stats')->updateOrInsert(
            ['date' => now()->toDateString()],
            [
                'user_count' => $userCount,
                'daily_orders' => $orderCount,
                'updated_at' => now()
            ]
        );
    }
}

// Di routes/console.php
use App\Console\Tasks\CleanUpTasks;

Schedule::call(new CleanUpTasks)->daily()->at('01:00');
```

#### 3.3 C. Memisahkan Definisi Jadwal (Pisahkan di bootstrap/app.php)

**Mengapa?** Karena saat aplikasi kamu besar dan kompleks, kamu mungkin ingin memisahkan definisi jadwal dari file console utama agar lebih terorganisir.

**Bagaimana?** Gunakan method `withSchedule` di `bootstrap/app.php`:

```php
// bootstrap/app.php
use Illuminate\Console\Scheduling\Schedule;
use App\Console\Tasks\CleanUpTasks;

->withSchedule(function (Schedule $schedule) {
    $schedule->call(new CleanUpTasks)->daily();
})
```

**Contoh Lengkap Struktur Terorganisir:**
```php
// bootstrap/app.php
use Illuminate\Console\Scheduling\Schedule;
use App\Console\Tasks\DailyCleanUpTask;
use App\Console\Tasks\WeeklyReportTask;
use App\Console\Tasks\MonthlyBackupTask;

->withSchedule(function (Schedule $schedule) {
    // Tugas harian
    $schedule->call(new DailyCleanUpTask)->daily()->at('02:00');
    $schedule->call(new DailyStatsTask)->daily()->at('23:59');
    
    // Tugas mingguan
    $schedule->call(new WeeklyReportTask)->weekly()->mondays()->at('08:00');
    
    // Tugas bulanan
    $schedule->call(new MonthlyBackupTask)->monthly()->at('03:00');
    
    // Tugas kritis
    $schedule->command('queue:work --max-jobs=1000')->everyFiveMinutes();
})
```

#### 3.4 D. Melihat Jadwal Tugas (Cek Jadwal Kamu)

**Mengapa?** Karena kamu perlu memastikan semua jadwal yang kamu buat sudah benar dan terdaftar.

**Bagaimana?** Gunakan perintah Artisan untuk melihat semua jadwal:

```bash
php artisan schedule:list
```

**Contoh Output:**
```bash
+----------+----------+----------+----------+----------+
| Command  | Interval | User     | On One   | Next Due |
|          |          |          | Server   |          |
+----------+----------+----------+----------+----------+
| php ...  | daily    | forge    | no       | 2023-10-25 00:00:00 |
| php ...  | weekly   | forge    | yes      | 2023-10-30 08:00:00 |
+----------+----------+----------+----------+----------+
```

**Penjelasan Kode:**
- `Schedule::call()` untuk menjalankan fungsi atau class
- Jadwal bisa disimpan di `routes/console.php` atau `bootstrap/app.php`
- `php artisan schedule:list` untuk cek semua jadwal

### 4. 🎛️ Menjadwalkan Artisan Commands (Perintah Khusus Kamu)

**Analogi:** Bayangkan kamu punya banyak perintah khusus yang harus dijalankan secara otomatis, seperti perintah backup, perintah kirim email, atau perintah generate laporan. Task Scheduler adalah seperti "mesin perintah" yang bisa menjalankan semua perintah itu sesuai jadwal kamu tentukan.

**Mengapa ini penting?** Karena banyak tugas kompleks harus dibuat dalam bentuk Artisan Command dan dijadwalkan secara rutin.

**Bagaimana cara kerjanya?** Gunakan `Schedule::command()` untuk menjadwalkan Artisan Commands kamu.

#### 4.1 A. Menggunakan Nama Command (String)

**Mengapa?** Karena ini cara paling sederhana untuk menjadwalkan command.

**Bagaimana?** Gunakan nama command sebagai string:

```php
Schedule::command('emails:send Taylor --force')->daily();
```

**Contoh Command:**
```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SendEmailsCommand extends Command
{
    protected $signature = 'emails:send {user} {--force}';
    protected $description = 'Kirim email ke user';

    public function handle()
    {
        $user = $this->argument('user');
        $force = $this->option('force');
        
        // Logika kirim email
        $this->info("Email dikirim ke {$user}");
    }
}
```

**Contoh Lengkap:**
```php
// Jadwal command dengan argumen
Schedule::command('emails:send taylor@example.com --force')->daily()->at('09:00');

// Jadwal command dengan banyak argumen
Schedule::command('reports:generate --type=monthly --format=pdf')->monthly()->at('02:00');

// Jadwal command dengan flag
Schedule::command('backup:database --gzip')->daily()->at('01:00');
```

#### 4.2 B. Menggunakan Class Command (Lebih Aman)

**Mengapa?** Karena ini lebih aman dan terhindar dari typo di nama command.

**Bagaimana?** Gunakan reference class langsung:

```php
use App\Console\Commands\SendEmailsCommand;

Schedule::command(SendEmailsCommand::class, ['Taylor', '--force'])->daily();
```

**Contoh Lengkap:**
```php
use App\Console\Commands\SendEmailsCommand;
use App\Console\Commands\GenerateReportCommand;
use App\Console\Commands\BackupDatabaseCommand;

// Jadwal dengan class reference
Schedule::command(SendEmailsCommand::class, ['taylor@example.com', '--force'])
    ->daily()
    ->at('09:00');

Schedule::command(GenerateReportCommand::class, ['--type=weekly'])
    ->weekly()
    ->mondays()
    ->at('08:00');

Schedule::command(BackupDatabaseCommand::class, ['--gzip'])
    ->daily()
    ->at('01:00');
```

#### 4.3 C. Command Closure (Buat Command Cepat)

**Mengapa?** Karena kadang kamu butuh buat command sederhana tanpa harus buat file class terpisah.

**Bagaimana?** Gunakan `Artisan::command()` dan method `schedule()`:

```php
Artisan::command('delete:recent-users', function () {
    DB::table('recent_users')->delete();
    $this->info('Recent users deleted successfully');
})->purpose('Delete recent users');

// Jadwalkan command ini
Schedule::command('delete:recent-users')->daily()->at('02:00');
```

**Contoh Lengkap Command Closure:**
```php
// routes/console.php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

// Command sederhana untuk cleanup
Artisan::command('cleanup:temporary', function () {
    $count = DB::table('temporary_files')
        ->where('created_at', '<', now()->subDay())
        ->delete();
    
    $this->info("{$count} temporary files cleaned up");
})->purpose('Clean up temporary files');

// Command dengan parameter
Artisan::command('emails:send {user} {--force}', function ($user) {
    // Logika kirim email
    $this->info("Email sent to {$user}");
})->purpose('Send emails to the specified user');

// Jadwalkan semua command
Schedule::command('cleanup:temporary')->daily()->at('02:00');
Schedule::command('emails:send taylor@example.com --force')->daily()->at('09:00');
```

**Penjelasan Kode:**
- `Schedule::command()` bisa dengan string nama atau class reference
- Bisa tambahkan argumen dan option
- Cocok untuk command yang kompleks

### 5. 🚚 Menjadwalkan Jobs Antrian (Tugas di Background)

**Analogi:** Bayangkan kamu punya toko yang menerima banyak pesanan. Daripada kamu kerjakan semua pesanan langsung (yang bisa membuat toko macet), kamu taruh pesanan di antrian dan pekerjakan karyawan untuk menyelesaikannya satu per satu. Queue Jobs adalah seperti antrian pesanan itu!

**Mengapa ini penting?** Karena untuk tugas yang berat atau membutuhkan waktu lama, lebih baik dijalankan di background lewat queue.

**Bagaimana cara kerjanya?** Task Scheduler bisa menjadwalkan Queue Jobs untuk dijalankan sesuai jadwal.

#### 5.1 A. Basic Queue Job Scheduling

**Mengapa?** Karena kamu ingin jalankan job secara berkala di background.

**Bagaimana?** Gunakan `Schedule::job()`:

```php
use App\Jobs\Heartbeat;

Schedule::job(new Heartbeat)->everyFiveMinutes();
```

**Contoh Job Class:**
```php
<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Http;

class Heartbeat implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        // Kirim heartbeat ke monitoring service
        Http::post('https://monitoring.service.com/heartbeat', [
            'timestamp' => now(),
            'server' => gethostname(),
            'status' => 'running'
        ]);
    }
}
```

#### 5.2 B. Menentukan Queue dan Koneksi

**Mengapa?** Karena kamu mungkin punya banyak queue dengan tujuan dan prioritas berbeda.

**Bagaimana?** Tambahkan parameter queue dan koneksi:

```php
Schedule::job(new Heartbeat, 'heartbeats', 'sqs')->everyFiveMinutes();
```

**Contoh Lengkap Queue Job Scheduling:**
```php
use App\Jobs\ProcessWeeklyReportJob;
use App\Jobs\SendDailyNotificationJob;
use App\Jobs\CleanupOldFilesJob;

// Jadwal beberapa jobs dengan prioritas berbeda
Schedule::job(new ProcessWeeklyReportJob, 'high-priority', 'redis')
    ->weekly()
    ->mondays()
    ->at('08:00');

Schedule::job(new SendDailyNotificationJob, 'notifications', 'redis')
    ->daily()
    ->at('09:00');

Schedule::job(new CleanupOldFilesJob, 'maintenance', 'database')
    ->daily()
    ->at('02:00');

// Job yang harus dijalankan bersamaan di semua server
Schedule::job(new HeartbeatJob, 'urgent', 'redis')
    ->everyFiveMinutes()
    ->onOneServer();

// Job dengan parameter
Schedule::job(new CheckUptimeJob('https://laravel.com'), 'monitoring', 'redis')
    ->everyFiveMinutes()
    ->name('check_uptime:laravel.com')
    ->onOneServer();
```

**Penjelasan Kode:**
- `Schedule::job()` untuk menjadwalkan Queue Jobs
- Bisa tentukan queue dan koneksi
- Cocok untuk tugas berat yang harus di background

### 6. 💻 Menjadwalkan Perintah Shell (Perintah Sistem)

**Analogi:** Bayangkan kamu punya banyak perintah sistem yang harus dijalankan secara rutin: backup database, update sistem, atau jalankan skrip dari bahasa pemrograman lain. Task Scheduler bisa juga menjalankan semua itu!

**Mengapa ini penting?** Karena kadang kamu harus jalankan perintah yang bukan dari Laravel, seperti perintah shell, Python, Node.js, dll.

**Bagaimana cara kerjanya?** Gunakan `Schedule::exec()` untuk menjalankan perintah shell secara berkala.

```php
Schedule::exec('node /home/forge/script.js')->daily();
Schedule::exec('python /path/to/script.py')->weekly();
Schedule::exec('bash /path/to/script.sh')->hourly();
```

**Contoh Lengkap Shell Command:**
```php
// Jadwal perintah backup database
Schedule::exec('mysqldump -u username -p password database_name > /backup/backup_'.now()->format('Y-m-d').'.sql')
    ->daily()
    ->at('03:00');

// Jadwal perintah Node.js
Schedule::exec('node /home/forge/process-payments.js')
    ->everyFiveMinutes();

// Jadwal perintah Python
Schedule::exec('python3 /home/forge/data-processing.py')
    ->hourly();

// Jadwal perintah backup file
Schedule::exec('rsync -avz /source/ /backup/ --delete')
    ->daily()
    ->at('04:00');

// Jadwal perintah cleanup
Schedule::exec('find /tmp -type f -mtime +7 -delete')
    ->weekly()
    ->sundays()
    ->at('01:00');
```

**Penjelasan Kode:**
- `Schedule::exec()` untuk perintah shell
- Bisa jalankan perintah dari bahasa lain
- Cocok untuk perintah sistem/backup

### 7. ⏱️ Opsi Frekuensi Jadwal (Kapan Tugas Terjadi)

**Analogi:** Bayangkan kamu sedang membuat jadwal acara TV atau jadwal kelas di sekolah. Kamu punya banyak pilihan waktu: setiap jam, setiap hari, setiap minggu, dll. Scheduler Laravel memberikan semua pilihan itu!

**Mengapa ini penting?** Karena tugas-tugas berbeda butuh frekuensi berbeda - ada yang harus jalan tiap menit, ada yang sekali sebulan.

**Bagaimana cara kerjanya?** Laravel menyediakan banyak method untuk menentukan frekuensi tugas.

#### 7.1 A. Frekuensi Dasar

**Mengapa?** Karena kamu butuh pilihan dasar yang sering digunakan.

**Bagaimana?** Gunakan method-method yang sudah disediakan:

```php
Schedule::call(function () {
    // kode...
})->daily();            // Setiap hari tengah malam
Schedule::call(function () {
    // kode...
})->hourly();           // Setiap jam
Schedule::call(function () {
    // kode...
})->weekly();           // Setiap minggu
Schedule::call(function () {
    // kode...
})->monthly();          // Setiap bulan
Schedule::call(function () {
    // kode...
})->yearly();           // Setiap tahun
```

**Daftar Lengkap Method Frekuensi:**
| Method | Deskripsi | Waktu Eksekusi |
|--------|-----------|----------------|
| `->everyMinute()` | Setiap menit | Setiap menit |
| `->everyFiveMinutes()` | Setiap 5 menit | 0,5,10,15,20,25,30,35,40,45,50,55 |
| `->everyTenMinutes()` | Setiap 10 menit | 0,10,20,30,40,50 |
| `->everyFifteenMinutes()` | Setiap 15 menit | 0,15,30,45 |
| `->everyThirtyMinutes()` | Setiap 30 menit | 0,30 |
| `->hourly()` | Setiap jam | 00:00 |
| `->hourlyAt(17)` | Setiap jam pada menit 17 | 00:17, 01:17, 02:17, dst |
| `->daily()` | Setiap hari | 00:00 |
| `->dailyAt('13:00')` | Setiap hari jam 13:00 | 13:00 |
| `->twiceDaily(1, 13)` | Dua kali sehari jam 01:00 dan 13:00 | 01:00, 13:00 |
| `->weekly()` | Setiap minggu | 00:00 Minggu |
| `->weeklyOn(1, '8:00')` | Setiap Senin jam 8:00 | 08:00 Senin |
| `->monthly()` | Setiap bulan | 00:00 hari pertama bulan |
| `->monthlyOn(15, '2:00')` | Tanggal 15 setiap bulan jam 2:00 | 02:00 tanggal 15 |
| `->quarterly()` | Setiap 3 bulan | 00:00 hari pertama kuartal |
| `->yearly()` | Setiap tahun | 00:00 tanggal 1 Januari |
| `->cron('* * * * *')` | Cron kustom | Sesuai format cron |

#### 7.2 B. Kombinasi Frekuensi (Pengaturan Waktu yang Lebih Spesifik)

**Mengapa?** Karena terkadang kamu butuh waktu yang lebih spesifik dari sekadar "setiap hari" atau "setiap minggu".

**Bagaimana?** Gabungkan beberapa method:

```php
// Setiap minggu hari Senin jam 13:00
Schedule::call(function () {
    // kode...
})->weekly()->mondays()->at('13:00');

// Setiap hari jam 9 pagi dan 5 sore
Schedule::call(function () {
    // kode...
})->twiceDaily(9, 17);

// Setiap 30 menit antara jam 9 pagi sampai 5 sore pada hari kerja
Schedule::call(function () {
    // kode...
})->everyThirtyMinutes()
  ->between('9:00', '17:00')
  ->days([1, 2, 3, 4, 5]); // Senin-Jumat

// Setiap bulan tanggal 1 jam 2:00
Schedule::call(function () {
    // kode...
})->monthlyOn(1, '2:00');
```

**Contoh Penerapan Kombinasi:**
```php
// Backup database: setiap hari jam 2 pagi
Schedule::command('backup:database')->daily()->at('02:00');

// Report mingguan: setiap Senin jam 8 pagi
Schedule::command('reports:weekly')->weekly()->mondays()->at('08:00');

// Cleanup temporary files: setiap 10 menit antara jam 9 pagi - 5 sore
Schedule::command('cleanup:temp')
    ->everyTenMinutes()
    ->between('9:00', '17:00');

// Maintenance bulanan: tanggal 1 setiap bulan jam 3 pagi
Schedule::command('maintenance:full')
    ->monthlyOn(1, '03:00');

// Monitoring weekend: setiap Sabtu jam 12 siang
Schedule::command('monitor:status')
    ->weeklyOn(6, '12:00');

// Update statistik: per 15 menit, hanya saat jam kerja
Schedule::command('stats:update')
    ->everyFifteenMinutes()
    ->between('8:00', '18:00')
    ->days([1, 2, 3, 4, 5]);
```

**Penjelasan Kode:**
- Berbagai pilihan frekuensi untuk semua kebutuhan
- Bisa kombinasikan method untuk waktu spesifik
- Cocok untuk semua jenis tugas otomatis

## Bagian 3: Advanced Scheduling - Jurus Tingkat Lanjut 🚀

### 8. 🔒 Pembatasan Hari dan Waktu (Menentukan Kapan Tugas Boleh Jalan)

**Analogi:** Bayangkan kamu punya karyawan shift yang hanya boleh kerja pada jam dan hari tertentu. Tidak semua tugas harus jalan 24/7 - beberapa hanya harus jalan di waktu-waktu tertentu agar tidak mengganggu performa sistem.

**Mengapa ini penting?** Karena kamu ingin kontrol kapan tugas bisa jalan agar tidak bentrok dengan jam sibuk atau saat user aktif tinggi.

**Bagaimana cara kerjanya?** Gunakan method-method untuk membatasi waktu dan hari eksekusi tugas.

#### 8.1 A. Hari Tertentu (Dengan Days Method)

**Mengapa?** Karena kamu mungkin hanya ingin tugas jalan di hari-hari tertentu.

**Bagaimana?** Gunakan method `days()` untuk tentukan hari:

```php
// Jalan hanya hari Minggu dan Rabu
Schedule::command('emails:send')->hourly()->days([0, 3]); 

// Atau dengan nama hari (lebih readable)
Schedule::command('reports:generate')
    ->weekly()
    ->days([1, 3, 5]); // Senin, Rabu, Jumat
```

**Contoh Lengkap:**
```php
// Maintenance hanya saat weekend (Sabtu-Minggu)
Schedule::command('maintenance:system')
    ->hourly()
    ->days([0, 6]); // Minggu = 0, Sabtu = 6

// Backup harian tapi tidak di hari kerja
Schedule::command('backup:important')
    ->daily()
    ->days([0, 6]); // Hanya weekend

// Heavy processing hanya di akhir minggu
Schedule::command('analytics:heavy-process')
    ->daily()
    ->days([6]); // Hanya Sabtu
```

#### 8.2 B. Batas Waktu (Between dan UnlessBetween)

**Mengapa?** Karena kamu ingin jaga performa sistem saat jam sibuk dengan hanya menjalankan tugas berat saat jam sepi.

**Bagaimana?** Gunakan method `between()` dan `unlessBetween()`:

```php
// Jalan antara jam 9 pagi sampe 10 malam
Schedule::command('emails:send')->hourly()->between('9:00', '22:00');

// Jalan KECUALI antara jam 11 malam sampe 6 pagi (waktu tidur)
Schedule::command('emails:send')->hourly()->unlessBetween('23:00', '6:00');
```

**Contoh Penerapan:**
```php
// Backup besar: hanya saat jam sepi (malam hari)
Schedule::command('backup:full')
    ->daily()
    ->between('23:00', '5:00');

// Heavy analytics: tidak saat jam kerja
Schedule::command('analytics:process')
    ->hourly()
    ->unlessBetween('8:00', '18:00');

// Maintenance tasks: hanya saat sistem sepi
Schedule::command('system:maintenance')
    ->everyFiveMinutes()
    ->between('22:00', '6:00')
    ->days([0, 6]); // Hanya weekend jam sepi
```

#### 8.3 C. Berdasarkan Kondisi (Truth Test)

**Analogi:** Bayangkan kamu punya sensor yang hanya mengaktifkan lampu jika kondisi tertentu terpenuhi - misalnya hanya jika gelap dan ada gerakan. Scheduler bisa juga melakukan hal yang sama dengan kondisi-kondisi kamu.

**Mengapa?** Karena kamu ingin tugas jalan hanya jika kondisi tertentu terpenuhi (contoh: hanya jika server punya cukup memori, hanya jika hari kerja, dll).

**Bagaimana?** Gunakan method `when()` dan `skip()`:

```php
// Jalankan hanya jika kondisi TRUE
Schedule::command('emails:send')->daily()->when(function () {
    return app()->environment('production'); // Hanya di production
});

// Jangan jalankan jika kondisi TRUE
Schedule::command('emails:send')->daily()->skip(function () {
    return now()->dayOfWeek === 0; // Jangan jalan hari Minggu
});
```

**Contoh Lengkap:**
```php
// Backup hanya jika disk space cukup
Schedule::command('backup:database')->daily()->at('02:00')
    ->when(function () {
        $diskSpace = disk_free_space(storage_path()) / (1024 * 1024 * 1024); // GB
        return $diskSpace > 10; // Hanya jika lebih dari 10GB free
    });

// Maintenance hanya jika load average rendah
Schedule::command('maintenance:heavy')->daily()->at('03:00')
    ->when(function () {
        $load = sys_getloadavg()[0]; // Load average 1 menit
        return $load < 1.0; // Hanya jika load < 1.0
    });

// Report hanya jika ada data hari sebelumnya
Schedule::command('reports:daily')->daily()->at('08:00')
    ->when(function () {
        return DB::table('orders')
            ->whereDate('created_at', now()->subDay())
            ->count() > 0;
    });

// Jangan jalan saat weekend
Schedule::command('analytics:process')->hourly()
    ->skip(function () {
        return now()->dayOfWeek === 0 || now()->dayOfWeek === 6; // Minggu atau Sabtu
    });

// Jangan jalan saat maintenance
Schedule::command('emails:send')->hourly()
    ->skip(function () {
        return Cache::has('maintenance_mode');
    });
```

#### 8.4 D. Berdasarkan Lingkungan (Environment)

**Mengapa?** Karena kamu mungkin ingin hanya tugas-tugas tertentu yang jalan di lingkungan produksi atau staging.

**Bagaimana?** Gunakan method `environments()`:

```php
// Hanya jalan di staging dan production
Schedule::command('report:generate')->daily()->environments(['staging', 'production']);

// Hanya jalan di production
Schedule::command('backup:full')->daily()->environments(['production']);
```

**Contoh Lengkap:**
```php
// Heavy analytics hanya di production
Schedule::command('analytics:full-process')
    ->hourly()
    ->environments(['production']);

// Debug logging hanya di staging
Schedule::command('logs:analyze')
    ->hourly()
    ->environments(['staging']);

// Security scan hanya di production
Schedule::command('security:scan')
    ->daily()
    ->at('02:00')
    ->environments(['production']);

// Performance monitoring di semua lingkungan
Schedule::command('monitor:performance')
    ->everyFiveMinutes()
    ->environments(['local', 'staging', 'production']);
```

**Penjelasan Kode:**
- `days()` untuk batasi hari eksekusi
- `between()` untuk batasi waktu eksekusi
- `when()` untuk kondisi aktif
- `skip()` untuk kondisi tidak aktif
- `environments()` untuk batasi berdasarkan lingkungan

### 9. 🌍 Zona Waktu dan Tugas Server (Menyesuaikan dengan Lokasi)

**Analogi:** Bayangkan kamu punya toko yang punya cabang di berbagai negara. Waktu pembukuan harian harus menyesuaikan waktu lokal masing-masing cabang, bukan waktu kantor pusat.

**Mengapa ini penting?** Karena aplikasi kamu mungkin digunakan oleh pengguna di zona waktu berbeda, dan tugas-tugas kamu harus bisa disesuaikan dengan zona waktu lokal mereka.

**Bagaimana cara kerjanya?** Gunakan method `timezone()` untuk menyesuaikan waktu eksekusi berdasarkan zona waktu.

#### 9.1 A. Setting Zona Waktu

**Mengapa?** Karena kamu ingin tugas jalan di waktu yang benar di zona waktu tertentu.

**Bagaimana?** Gunakan method `timezone()`:

```php
Schedule::command('report:generate')
    ->timezone('America/New_York')
    ->at('2:00'); // Jam 2 pagi di zona waktu New York
```

**Contoh Lengkap:**
```php
// Report untuk user di Asia
Schedule::command('reports:asian-users')
    ->timezone('Asia/Jakarta')
    ->daily()
    ->at('06:00'); // 6 pagi waktu Jakarta

// Backup untuk server di Eropa
Schedule::command('backup:european-server')
    ->timezone('Europe/London')
    ->daily()
    ->at('03:00'); // 3 pagi waktu London

// Notifikasi pagi untuk user di US
Schedule::command('notifications:morning-us')
    ->timezone('America/Los_Angeles')
    ->daily()
    ->at('08:00'); // 8 pagi waktu LA

// Maintenance server
Schedule::command('maintenance:server')
    ->timezone('UTC')
    ->daily()
    ->at('02:00'); // 2 pagi UTC
```

#### 9.2 B. Menjalankan Tugas di Satu Server (onOneServer)

**Analogi:** Bayangkan kamu punya beberapa kasir di restoran. Untuk tugas seperti menghitung total penjualan harian, kamu hanya butuh satu kasir yang melakukannya, tidak semua kasir melakukannya secara bersamaan.

**Mengapa ini penting?** Karena saat kamu punya banyak server (load balancing), kamu mungkin hanya ingin tugas tertentu jalan di satu server saja agar tidak ada duplikasi.

**Bagaimana?** Gunakan method `onOneServer()`:

```php
Schedule::command('report:generate')
    ->fridays()
    ->at('17:00')
    ->onOneServer();
```

**Contoh Lengkap:**
```php
// Backup database: hanya satu server yang backup
Schedule::command('backup:database')
    ->daily()
    ->at('02:00')
    ->onOneServer();

// Weekly report: hanya satu server yang generate
Schedule::command('reports:weekly')
    ->weekly()
    ->mondays()
    ->at('08:00')
    ->onOneServer();

// Cleanup: hanya satu server yang bersih-bersih
Schedule::command('cleanup:temp')
    ->hourly()
    ->onOneServer();

// Monitoring: khusus untuk tugas dengan parameter
use App\Jobs\CheckUptime;
Schedule::job(new CheckUptime('https://laravel.com'))
    ->name('check_uptime:laravel.com')  // Harus pakai name saat pakai parameter
    ->everyFiveMinutes()
    ->onOneServer();
```

**Penjelasan Kode:**
- `timezone()` untuk setting zona waktu
- `onOneServer()` untuk hanya jalan di satu server
- `name()` harus digunakan saat `onOneServer()` dengan parameter

### 10. ⚡ Mencegah Overlap dan Optimasi (Kontrol Eksekusi)

**Analogi:** Bayangkan kamu punya mesin cetak yang butuh waktu 30 menit untuk mencetak laporan besar. Jika kamu jadwalkan cetak setiap 10 menit, maka mesin akan tetap sibuk mencetak laporan yang belum selesai. Mencegah overlap seperti memberi tahu mesin untuk tidak mulai mencetak yang baru jika yang lama belum selesai.

**Mengapa ini penting?** Karena tugas yang overlapping bisa membuat server kelebihan beban atau membuat tugas tidak berjalan dengan benar.

**Bagaimana cara kerjanya?** Gunakan method-method untuk kontrol eksekusi tugas.

#### 10.1 A. Mencegah Overlap (withoutOverlapping)

**Mengapa?** Karena kamu tidak ingin tugas yang sama jalan bersamaan jika yang pertama belum selesai.

**Bagaimana?** Gunakan method `withoutOverlapping()`:

```php
// Mencegah tugas ini overlap
Schedule::command('emails:send')->withoutOverlapping();

// Atur waktu lock (default 24 jam)
Schedule::command('emails:send')->withoutOverlapping(10); // Lock selama 10 menit
```

**Contoh Lengkap:**
```php
// Heavy processing task: tidak boleh overlap
Schedule::command('analytics:process-heavy')
    ->hourly()
    ->withoutOverlapping();

// Backup task: lock 2 jam agar tidak overlap
Schedule::command('backup:full')
    ->daily()
    ->at('02:00')
    ->withoutOverlapping(120); // 2 jam lock

// Report generation: lock 30 menit
Schedule::command('reports:generate')
    ->daily()
    ->at('03:00')
    ->withoutOverlapping(30);

// Cleanup task: lock 5 menit
Schedule::command('cleanup:temp')
    ->everyFiveMinutes()
    ->withoutOverlapping(5);
```

#### 10.2 B. Tugas Latar Belakang (runInBackground)

**Mengapa?** Karena untuk tugas yang berjalan lama, kamu tidak ingin scheduler menunggu selesai sebelum lanjut ke tugas berikutnya.

**Bagaimana?** Gunakan method `runInBackground()`:

```php
// Jalan di background, scheduler tidak menunggu
Schedule::command('analytics:report')->daily()->runInBackground();
```

**Contoh Lengkap:**
```php
// Heavy analytics report: jalan di background
Schedule::command('analytics:full-report')
    ->weekly()
    ->mondays()
    ->at('04:00')
    ->runInBackground();

// Data migration: jalan di background
Schedule::command('data:migrate-heavy')
    ->monthly()
    ->at('03:00')
    ->runInBackground();

// File processing: jalan di background
Schedule::command('files:process-batch')
    ->hourly()
    ->runInBackground();
```

#### 10.3 C. Mode Maintenance (evenInMaintenanceMode)

**Mengapa?** Karena kadang kamu butuh tetap jalankan tugas penting meskipun aplikasi sedang maintenance.

**Bagaimana?** Gunakan method `evenInMaintenanceMode()`:

```php
// Tetap jalan meskipun maintenance mode aktif
Schedule::command('emails:send')->evenInMaintenanceMode();
```

**Contoh Lengkap:**
```php
// Backup tetap jalan saat maintenance
Schedule::command('backup:database')
    ->daily()
    ->at('02:00')
    ->evenInMaintenanceMode();

// Monitoring tetap aktif saat maintenance
Schedule::command('monitor:health')
    ->everyFiveMinutes()
    ->evenInMaintenanceMode();

// Cleanup tetap jalan saat maintenance
Schedule::command('cleanup:temp')
    ->hourly()
    ->evenInMaintenanceMode();
```

**Penjelasan Kode:**
- `withoutOverlapping()` untuk mencegah tugas tumpang tindih
- `runInBackground()` untuk jalan di background
- `evenInMaintenanceMode()` untuk tetap jalan saat maintenance

### 11. 📦 Grup Jadwal dan Advanced Features (Fitur Lanjutan)

**Analogi:** Bayangkan kamu sedang mengatur tim kerja. Daripada memberi perintah satu-satu, kamu kelompokkan tugas-tugas yang terkait dan berikan ke satu tim untuk dikerjakan bersama-sama.

**Mengapa ini penting?** Karena kadang kamu ingin menerapkan setting yang sama ke banyak tugas sekaligus.

**Bagaimana cara kerjanya?** Gunakan fitur grouping dan advanced scheduling features.

#### 11.1 A. Grup Jadwal (Group Scheduling)

**Mengapa?** Karena kamu bisa menerapkan setting sama ke banyak tugas sekaligus.

**Bagaimana?** Gunakan method `group()`:

```php
Schedule::daily()->onOneServer()->timezone('America/New_York')->group(function () {
    Schedule::command('emails:send --force');
    Schedule::command('emails:prune');
    Schedule::command('reports:generate');
});
```

**Contoh Lengkap Grup Jadwal:**
```php
// Group untuk tugas maintenance
Schedule::daily()->at('02:00')->onOneServer()->timezone('UTC')->group(function () {
    Schedule::command('cleanup:temp');
    Schedule::command('logs:prune');
    Schedule::command('cache:prune');
    Schedule::command('sessions:prune');
});

// Group untuk tugas backup
Schedule::daily()->at('03:00')->onOneServer()->group(function () {
    Schedule::command('backup:database');
    Schedule::command('backup:files');
    Schedule::command('backup:logs');
});

// Group untuk tugas laporan
Schedule::daily()->at('08:00')->timezone('Asia/Jakarta')->group(function () {
    Schedule::command('reports:daily');
    Schedule::command('analytics:summary');
    Schedule::command('notifications:report');
});
```

#### 11.2 B. Output Tugas (Menangani Output dan Error)

**Mengapa?** Karena kamu perlu log dan monitor output dari tugas-tugas kamu untuk debugging dan audit.

**Bagaimana?** Gunakan method-method untuk menangani output:

```php
// Simpan output ke file
Schedule::command('emails:send')->daily()->sendOutputTo($filePath);

// Tambahkan ke file (append)
Schedule::command('emails:send')->daily()->appendOutputTo($filePath);

// Kirim output via email jika sukses
Schedule::command('report:generate')->daily()->emailOutputTo('admin@example.com');

// Kirim output via email hanya jika gagal
Schedule::command('report:generate')->daily()->emailOutputOnFailure('admin@example.com');
```

**Contoh Lengkap Output Management:**
```php
// Log ke file spesifik
Schedule::command('backup:database')
    ->daily()
    ->at('02:00')
    ->sendOutputTo(storage_path('logs/backup.log'));

// Append ke log file
Schedule::command('analytics:process')
    ->hourly()
    ->appendOutputTo(storage_path('logs/analytics.log'));

// Kirim log ke admin jika gagal
Schedule::command('critical:task')
    ->daily()
    ->at('01:00')
    ->emailOutputOnFailure('admin@company.com');

// Kirim log ke tim opsional
Schedule::command('reports:generate')
    ->weekly()
    ->mondays()
    ->at('08:00')
    ->emailOutputTo(['ops@company.com', 'admin@company.com'])
    ->emailOutputOnFailure('admin@company.com');
```

#### 11.3 C. Task Hooks (Event Sebelum dan Sesudah Eksekusi)

**Analogi:** Bayangkan kamu punya sistem manajemen yang bisa memberi tahu sistem lain tentang kejadian penting: "sebelum tugas dimulai", "setelah tugas selesai", "jika tugas sukses", "jika tugas gagal".

**Mengapa ini penting?** Karena kamu bisa trigger action lain berdasarkan lifecycle tugas kamu.

**Bagaimana?** Gunakan hook-methods:

```php
Schedule::command('emails:send')
    ->daily()
    ->before(fn() => Log::info('Email task starting...'))  // Sebelum eksekusi
    ->after(fn() => Log::info('Email task finished'))      // Sesudah eksekusi
    ->onSuccess(fn($output) => Log::info('Emails sent successfully', ['output' => $output]))  // Jika sukses
    ->onFailure(fn($output) => Log::error('Email task failed', ['output' => $output]));      // Jika gagal
```

**Contoh Lengkap Task Hooks:**
```php
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

Schedule::command('reports:generate')
    ->daily()
    ->at('08:00')
    ->before(function () {
        Log::info('Starting report generation');
        // Kirim pemberitahuan ke monitoring
        Http::post('https://monitoring.com/api/task-start', [
            'task' => 'reports:generate',
            'timestamp' => now()
        ]);
    })
    ->after(function () {
        Log::info('Report generation completed');
        // Kirim pemberitahuan selesai
        Http::post('https://monitoring.com/api/task-end', [
            'task' => 'reports:generate',
            'timestamp' => now()
        ]);
    })
    ->onSuccess(function ($output) {
        Log::info('Report generated successfully', ['output' => $output]);
        // Kirim notifikasi ke Slack jika sukses
        Http::post('https://hooks.slack.com/services/...', [
            'text' => '✅ Report generated successfully'
        ]);
    })
    ->onFailure(function ($output) {
        Log::error('Report generation failed', ['output' => $output]);
        // Kirim notifikasi ke Slack jika gagal
        Http::post('https://hooks.slack.com/services/...', [
            'text' => '❌ Report generation failed'
        ]);
    });
```

#### 11.4 D. Pinging URL (Notifikasi Eksternal)

**Mengapa?** Karena kamu mungkin ingin memberi tahu layanan eksternal bahwa tugas telah dimulai, selesai, atau gagal.

**Bagaimana?** Gunakan method ping untuk notifikasi ke layanan eksternal:

```php
Schedule::command('emails:send')
    ->daily()
    ->pingBefore($url)        // Ping sebelum eksekusi
    ->thenPing($url)          // Ping setelah eksekusi
    ->pingOnSuccess($successUrl)  // Ping jika sukses
    ->pingOnFailure($failureUrl); // Ping jika gagal
```

**Contoh Lengkap Pinging:**
```php
// Integrasi dengan layanan monitoring eksternal
Schedule::command('data:process-heavy')
    ->hourly()
    ->pingBefore('https://hc-ping.com/task-start')      // Beri tahu monitoring mulai jalan
    ->thenPing('https://hc-ping.com/task-complete')     // Beri tahu selesai
    ->pingOnSuccess('https://hc-ping.com/task-success') // Beri tahu sukses
    ->pingOnFailure('https://hc-ping.com/task-failed'); // Beri tahu gagal

// Integrasi dengan health check monitoring
Schedule::command('system:health-check')
    ->everyFiveMinutes()
    ->pingBefore('https://healthchecks.io/ping/uuid/start')
    ->thenPing('https://healthchecks.io/ping/uuid')
    ->pingOnFailure('https://healthchecks.io/ping/uuid/fail');
```

**Penjelasan Kode:**
- `group()` untuk kelompokkan tugas dengan setting sama
- Output methods untuk log dan notifikasi
- Hook methods untuk event lifecycle
- Ping methods untuk integrasi eksternal

### 12. 🎛️ Menjalankan Scheduler (Implementasi dan Monitoring)

**Analogi:** Bayangkan kamu sudah menyiapkan semua jadwal kerja tim kamu, sekarang kamu butuh mesin penjadwal yang bisa baca jadwal itu dan mengingatkan tim untuk menjalankan tugas mereka sesuai waktu.

**Mengapa ini penting?** Karena semua jadwal yang kamu buat harus benar-benar dijalankan oleh sistem.

**Bagaimana cara kerjanya?** Ada beberapa cara untuk menjalankan scheduler tergantung lingkungan kamu.

#### 12.1 A. Di Server Produksi (Cron Entry)

**Mengapa?** Karena di server produksi kamu butuh sistem yang selalu jaga dan periksa jadwal.

**Bagaimana?** Tambahkan satu entri cron di server kamu:

```bash
# Tambahkan di crontab server
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

**Instalasi di server:**
```bash
# Edit crontab
crontab -e

# Tambahkan baris ini
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1

# Simpan dan keluar
```

**Contoh Path yang Benar:**
```bash
# Contoh path lengkap
* * * * * cd /var/www/html/laravel-app && php artisan schedule:run >> /dev/null 2>&1

# Atau dengan absolute path
* * * * * /usr/bin/php /var/www/html/laravel-app/artisan schedule:run >> /var/null 2>&1
```

#### 12.2 B. Sub-Minute Task (Jalankan Lebih dari Sekali Per Menit)

**Mengapa?** Karena kadang kamu butuh tugas yang jalan lebih sering dari sekali per menit.

**Bagaimana?** Gunakan `everySecond()` atau `everySeconds()`:

```php
// Jalan setiap detik (butuh schedule:work)
Schedule::call(function () {
    DB::table('recent_users')->delete();
})->everySecond();

// Jalan setiap 30 detik
Schedule::call(function () {
    // periksa sesuatu
})->everySeconds(30);
```

**Catatan Penting:**
```bash
# Untuk sub-minute task, kamu perlu jalankan:
php artisan schedule:work

# Bukan hanya schedule:run
```

#### 12.3 C. Jalankan Scheduler Lokal (Development)

**Mengapa?** Karena saat development kamu mungkin ingin test scheduler tanpa harus setup cron.

**Bagaimana?** Gunakan `schedule:work`:

```bash
# Jalankan scheduler di terminal (akan jalan terus)
php artisan schedule:work

# Atau dengan konfigurasi
php artisan schedule:work --run-output-file=/path/to/your/logs
```

**Contoh Development Workflow:**
```bash
# Dalam satu terminal
php artisan schedule:work

# Dalam terminal lain
php artisan serve
```

#### 12.4 D. Monitoring dan Troubleshooting

**Mengapa?** Karena kamu perlu memastikan tugas-tugas kamu jalan sesuai jadwal dan bisa debug jika ada masalah.

**Bagaimana?** Gunakan beberapa tools dan command:

```bash
# Lihat semua jadwal
php artisan schedule:list

# Test eksekusi manual
php artisan schedule:run

# Jalan scheduler di foreground (untuk test)
php artisan schedule:work
```

**Contoh Monitoring Script:**
```php
// Buat command untuk monitoring
Artisan::command('schedule:monitor', function () {
    $this->info('Checking scheduled tasks...');
    
    // Cek apakah scheduler aktif
    $processes = shell_exec('ps aux | grep schedule:work | grep -v grep');
    
    if (empty($processes)) {
        $this->error('Scheduler is not running!');
        // Kirim notifikasi atau restart
    } else {
        $this->info('Scheduler is running: ' . count(explode("\n", $processes)) . ' processes');
    }
});
```

**Penjelasan Kode:**
- Setup cron entry untuk production
- Gunakan `schedule:work` untuk sub-minute tasks
- Gunakan `schedule:work` untuk development
- Monitor dengan `schedule:list` dan log

## Bagian 4: Events dan Integrasi 📡

### 13. 📡 Events Scheduler (Mendengarkan Kejadian Scheduler)

**Analogi:** Bayangkan kamu punya sistem keamanan yang bisa memberi tahu kamu setiap kali sesuatu terjadi: pintu dibuka, alarm aktif, atau tugas selesai. Scheduler events adalah seperti sensor-sensor itu yang memberi tahu kamu tentang kejadian penting dalam proses scheduling.

**Mengapa ini penting?** Karena kamu bisa trigger action tambahan atau monitoring berdasarkan kejadian scheduler.

**Bagaimana cara kerjanya?** Laravel menyediakan event yang bisa kamu listen untuk merespons kejadian scheduler.

#### Event yang Tersedia

| Event | Keterangan |
|-------|------------|
| `ScheduledTaskStarting` | Tugas mulai dijalankan |
| `ScheduledTaskFinished` | Tugas selesai dijalankan |
| `ScheduledBackgroundTaskFinished` | Tugas background selesai |
| `ScheduledTaskSkipped` | Tugas dilewati karena kondisi |
| `ScheduledTaskFailed` | Tugas gagal dijalankan |

**Contoh Listener:**
```php
// EventServiceProvider
protected $listen = [
    'Illuminate\Console\Events\ScheduledTaskStarting' => [
        'App\Listeners\LogScheduledTaskStarting',
    ],
    'Illuminate\Console\Events\ScheduledTaskFinished' => [
        'App\Listeners\LogScheduledTaskFinished',
    ],
    'Illuminate\Console\Events\ScheduledTaskFailed' => [
        'App\Listeners\NotifyOnTaskFailure',
    ],
];

// Listener class
<?php

namespace App\Listeners;

use Illuminate\Console\Events\ScheduledTaskStarting;
use Illuminate\Support\Facades\Log;

class LogScheduledTaskStarting
{
    public function handle(ScheduledTaskStarting $event)
    {
        Log::info('Scheduled task starting', [
            'command' => $event->task->command ?? $event->task->getSummaryForDisplay(),
            'expression' => $event->task->expression,
            'description' => $event->task->description ?? 'No description'
        ]);
    }
}
```

## Bagian 5: Tips & Best Practices dari Guru 🎓

### 14. ✅ Best Practices & Tips (Kiat-kiat Bijak)

Setelah belajar banyak hal tentang Task Scheduler, sekarang waktunya memahami **cara menggunakan Scheduler yang bijak**. Seperti pedang bermata dua, Task Scheduler bisa sangat membantu... atau sangat mengganggu jika tidak digunakan dengan benar.

**1. 🧠 Rancang Jadwal dengan Bijak**
- Jangan jadwalkan tugas berat saat jam sibuk pengguna
- Gunakan waktu sepi untuk tugas berat
- Contoh benar:
```php
// ✅ BENAR - jadwalkan tugas berat saat jam sepi
Schedule::command('analytics:heavy-process')
    ->daily()
    ->at('02:00')  // Jam sepi
    ->between('22:00', '6:00');  // Di jam sepi

// ❌ SALAH - jadwalkan tugas berat saat jam sibuk
Schedule::command('analytics:heavy-process')
    ->hourly()
    ->between('8:00', '18:00');  // Saat jam kerja
```

**2. 🛡️ Gunakan Preventive Measures**
- Gunakan `withoutOverlapping()` untuk tugas yang bisa lama
- Gunakan `onOneServer()` untuk tugas single execution
- Gunakan `runInBackground()` untuk tugas berat
```php
// ✅ BENAR - tugas berat dilindungi
Schedule::command('backup:full')
    ->daily()
    ->at('02:00')
    ->withoutOverlapping(120)  // Lock 2 jam
    ->runInBackground()        // Jalan di background
    ->onOneServer();           // Hanya di satu server

// ❌ SALAH - tugas tanpa proteksi
Schedule::command('backup:full')->daily()->at('02:00');
```

**3. 📊 Monitor dan Log Aktifitas**
- Log semua tugas penting
- Gunakan `before()`, `after()`, `onSuccess()`, `onFailure()`
- Kirim notifikasi jika tugas penting gagal
```php
// ✅ BENAR - tugas penting dengan monitoring
Schedule::command('critical:backup')
    ->daily()
    ->at('03:00')
    ->onSuccess(function () {
        // Kirim notifikasi sukses ke monitoring
        Http::post('https://monitoring.com/api/backup-success');
    })
    ->onFailure(function ($output) {
        // Kirim notifikasi gagal ke admin
        Http::post('https://alert.com/api/backup-failed', ['error' => $output]);
    });
```

**4. ⚡ Optimalkan Performa**
- Group tugas-tugas serupa
- Gunakan queue untuk tugas berat
- Batasi tugas di jam sibuk
```php
// ✅ BENAR - optimasi dengan grouping
Schedule::daily()->at('02:00')->group(function () {
    Schedule::command('cleanup:temp');
    Schedule::command('cleanup:logs');
    Schedule::command('cleanup:cache');
});
```

**5. 🔒 Amankan Tugas Kritis**
- Gunakan `evenInMaintenanceMode()` untuk tugas backup
- Gunakan kondisi untuk cek resource sebelum eksekusi
```php
// ✅ BENAR - backup dengan pengecekan
Schedule::command('backup:database')
    ->daily()
    ->at('02:00')
    ->when(function () {
        return disk_free_space(storage_path()) / (1024 * 1024 * 1024) > 5; // >5GB
    })
    ->evenInMaintenanceMode();
```

## Bagian 6: Troubleshooting & Penyelesaian Masalah 🔧

### 15. ⚠️ Troubleshooting Umum (Solusi Masalah yang Sering Terjadi)

**1. 🚫 Tugas Tidak Berjalan**
- Cek apakah cron entry sudah benar
- Cek apakah command benar: `php artisan schedule:run`
- Cek log: `storage/logs/laravel.log`
- Solusi:
```bash
# Test manual
php artisan schedule:run

# Cek entri cron
crontab -l

# Cek path project
cd /path-to-your-project && php artisan schedule:run
```

**2. 💤 Tugas Overlapping**
- Gunakan `withoutOverlapping()` untuk tugas yang bisa lama
- Atur lock duration sesuai kebutuhan
- Solusi:
```php
// Gunakan overlapping protection
Schedule::command('heavy:task')->withoutOverlapping(60); // 1 jam lock
```

**3. 🌍 Waktu Salah**
- Pastikan timezone sudah benar
- Cek setting `config/app.php`
- Solusi:
```php
// Gunakan timezone eksplisit
Schedule::command('report:generate')
    ->timezone('Asia/Jakarta')  // Sesuaikan dengan lokal
    ->daily()
    ->at('08:00');
```

**4. 🏃‍♂️ Tugas Berjalan Di Semua Server**
- Gunakan `onOneServer()` untuk tugas single execution
- Gunakan `name()` jika dengan parameter
- Solusi:
```php
// Untuk tugas backup
Schedule::command('backup:database')
    ->daily()
    ->at('02:00')
    ->onOneServer();

// Untuk tugas dengan parameter
Schedule::job(new CheckUptime('https://site.com'))
    ->name('check_uptime:site.com')
    ->everyFiveMinutes()
    ->onOneServer();
```

## Bagian 7: Kumpulan Contoh Lengkap 🧩

### 16. 🧩 Contoh Implementasi End-to-End (Skenario Dunia Nyata)

**Skenario**: Sistem e-commerce yang perlu jalankan banyak tugas otomatis: backup, analisis statistik, pembersihan data, pengiriman email, dll.

#### 16.1 Struktur Jadwal Lengkap

```php
// routes/console.php
use Illuminate\Support\Facades\Schedule;

Schedule::call(new DailyCleanupTask)->daily()->at('02:00');
Schedule::call(new WeeklyReportTask)->weekly()->mondays()->at('08:00');
Schedule::call(new MonthlyBackupTask)->monthly()->at('03:00');

// Atau di bootstrap/app.php
->withSchedule(function (Schedule $schedule) {
    // Daily tasks
    $schedule->command('cleanup:temporary')->daily()->at('02:00');
    $schedule->command('backup:database')->daily()->at('03:00');
    $schedule->command('analytics:daily')->daily()->at('04:00');
    
    // Weekly tasks
    $schedule->command('reports:weekly')->weekly()->mondays()->at('08:00');
    $schedule->command('system:health-check')->weekly()->sundays()->at('06:00');
    
    // Heavy tasks
    $schedule->command('analytics:heavy-process')
        ->daily()
        ->at('02:00')
        ->unlessBetween('8:00', '18:00')
        ->withoutOverlapping(120)
        ->runInBackground()
        ->onOneServer();
    
    // Monitoring
    $schedule->command('monitor:status')
        ->everyFiveMinutes()
        ->environments(['production']);
        
    // Critical tasks
    $schedule->command('backup:critical')
        ->daily()
        ->at('03:00')
        ->evenInMaintenanceMode()
        ->when(function () {
            return disk_free_space(storage_path()) / (1024 * 1024 * 1024) > 10; // >10GB
        });
});
```

#### 16.2 Contoh Task Classes

**DailyCleanupTask:**
```php
<?php

namespace App\Console\Tasks;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DailyCleanupTask
{
    public function __invoke()
    {
        $this->cleanupTemporaryFiles();
        $this->cleanupOldLogs();
        $this->cleanupExpiredSessions();
        $this->updateStatistics();
    }
    
    private function cleanupTemporaryFiles()
    {
        $count = DB::table('temporary_files')
            ->where('created_at', '<', now()->subDay())
            ->delete();
        
        Log::info("Cleaned up {$count} temporary files");
    }
    
    private function cleanupOldLogs()
    {
        $count = DB::table('logs')
            ->where('created_at', '<', now()->subDays(30))
            ->delete();
        
        Log::info("Cleaned up {$count} old logs");
    }
    
    private function cleanupExpiredSessions()
    {
        // Hapus session yang expired
        $count = DB::table('sessions')
            ->where('last_activity', '<', now()->subHours(24)->timestamp)
            ->delete();
        
        Log::info("Cleaned up {$count} expired sessions");
    }
    
    private function updateStatistics()
    {
        // Update statistik harian
        $stats = [
            'user_count' => DB::table('users')->count(),
            'order_count' => DB::table('orders')->whereDate('created_at', now())->count(),
            'revenue' => DB::table('orders')->whereDate('created_at', now())->sum('amount'),
        ];
        
        DB::table('daily_stats')->updateOrInsert(
            ['date' => now()->toDateString()],
            $stats + ['updated_at' => now()]
        );
        
        Log::info("Daily statistics updated");
    }
}
```

#### 16.3 Monitoring dan Alert System

```php
// Event listener untuk monitoring
<?php

namespace App\Listeners;

use Illuminate\Console\Events\ScheduledTaskFailed;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AlertOnTaskFailure
{
    public function handle(ScheduledTaskFailed $event)
    {
        $command = $event->task->command ?? $event->task->getSummaryForDisplay();
        $error = $event->output;
        
        Log::error("Scheduled task failed", [
            'command' => $command,
            'error' => $error,
            'timestamp' => now()
        ]);
        
        // Kirim ke monitoring service
        Http::post('https://alert-service.com/api/task-failed', [
            'command' => $command,
            'error' => $error,
            'timestamp' => now()->toISOString(),
            'server' => gethostname()
        ]);
        
        // Kirim ke Slack
        Http::post('https://hooks.slack.com/services/...', [
            'text' => "❌ Scheduled task failed: {$command}",
            'attachments' => [
                [
                    'color' => 'danger',
                    'fields' => [
                        ['title' => 'Command', 'value' => $command],
                        ['title' => 'Error', 'value' => substr($error, 0, 100)],
                        ['title' => 'Time', 'value' => now()->format('Y-m-d H:i:s')],
                    ]
                ]
            ]
        ]);
    }
}
```

> 🎯 Dengan pola ini, sistem kamu bisa **menjalankan banyak tugas otomatis dengan aman dan termonitor**!

## Bagian 8: Menjadi Master Scheduler 🏆

### 17. ✨ Wejangan dari Guru

Setelah kamu menempuh perjalanan panjang bersama Guru dalam mempelajari Task Scheduler di Laravel, inilah **wejangan bijak** yang harus kamu ingat:

**1. 🎯 Focus pada Kebutuhan Bisnis**
- Jadwalkan tugas yang memberi nilai tambah
- Jangan buat tugas hanya karena "bisa"
- Ukur efek dari setiap tugas yang dijadwalkan

**2. 🔄 Integrasikan dengan Monitoring**
- Gunakan tools monitoring untuk tugas kritis
- Set up alert untuk tugas yang gagal
- Log semuanya untuk audit trail

**3. 📊 Evaluasi dan Optimasi**
- Monitor resource usage dari tugas-tugas
- Pindahkan tugas berat ke queue saat perlu
- Review jadwal secara berkala

### 18. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah **referensi cepat** untuk berbagai fitur Task Scheduler di Laravel:

#### 🧰 Basic Scheduling Methods
| Method | Fungsi |
|--------|--------|
| `Schedule::call()` | Jadwalkan closure/function |
| `Schedule::command()` | Jadwalkan Artisan command |
| `Schedule::job()` | Jadwalkan Queue job |
| `Schedule::exec()` | Jadwalkan shell command |

#### ⏱️ Frequency Options
| Method | Fungsi |
|--------|--------|
| `->everyMinute()` | Setiap menit |
| `->everyFiveMinutes()` | Setiap 5 menit |
| `->hourly()` | Setiap jam |
| `->daily()` | Setiap hari |
| `->weekly()` | Setiap minggu |
| `->monthly()` | Setiap bulan |
| `->cron('* * * * *')` | Cron kustom |

#### 🔒 Control and Limitation
| Method | Fungsi |
|--------|--------|
| `->between('9:00', '17:00')` | Jalankan hanya di waktu tertentu |
| `->unlessBetween('23:00', '6:00')` | Jangan jalan di waktu tertentu |
| `->when(condition)` | Jalankan jika kondisi TRUE |
| `->skip(condition)` | Jangan jalan jika kondisi TRUE |
| `->environments(['prod'])` | Hanya di lingkungan tertentu |
| `->withoutOverlapping(60)` | Cegah overlap (60 menit lock) |
| `->onOneServer()` | Hanya jalan di satu server |
| `->runInBackground()` | Jalan di background |
| `->evenInMaintenanceMode()` | Jalan meski maintenance aktif |

#### 📡 Advanced Features
| Method | Fungsi |
|--------|--------|
| `->before(callback)` | Eksekusi sebelum tugas |
| `->after(callback)` | Eksekusi setelah tugas |
| `->onSuccess(callback)` | Eksekusi jika sukses |
| `->onFailure(callback)` | Eksekusi jika gagal |
| `->sendOutputTo(file)` | Simpan output ke file |
| `->emailOutputTo(email)` | Kirim output via email |
| `->pingBefore(url)` | Ping URL sebelum eksekusi |

### 19. 🎯 Kesimpulan Akhir

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Task Scheduler, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Task Scheduler adalah fitur yang **sangat powerful** untuk membuat sistem otomatisasi yang handal dan dapat di-maintain.

Dengan Task Scheduler, kamu bisa:
- Mengotomatiskan tugas-tugas repetitif
- Membangun sistem maintenance otomatis
- Mengelola backup dan monitoring sistem
- Menjadwalkan laporan dan analisis data
- Menangani tugas berat di background
- Membuat sistem yang "hidup" 24/7

Task Scheduler adalah alat yang sangat berguna untuk membuat aplikasi Laravel kamu **lebih otomatis, lebih cerdas, dan lebih bisa diandalkan**. Dengan penggunaan yang benar (pemilihan frekuensi, kontrol overlap, monitoring, dll), aplikasi kamu akan bisa menjaga dirinya sendiri secara otomatis.

**Jangan pernah berhenti belajar dan mencoba.** Implementasikan Task Scheduler di proyekmu, coba berbagai skenario, dan kamu akan melihat betapa berharganya fitur ini dalam dunia nyata. Selamat ngoding, murid kesayanganku!
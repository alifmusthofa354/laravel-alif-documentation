# Task Schedule

## Pendahuluan

Pada proyek sebelumnya, mungkin Anda pernah menulis entri **cron** untuk setiap tugas yang ingin dijadwalkan di server. Namun, metode ini memiliki beberapa kekurangan:

* Jadwal tugas tidak tersimpan dalam **source control**.
* Harus **SSH** ke server untuk melihat atau menambah entri cron.
* Sulit untuk memelihara jadwal ketika proyek bertambah kompleks.

Laravel menyediakan **Command Scheduler**, solusi modern untuk mengelola tugas terjadwal langsung di dalam aplikasi Laravel. Dengan scheduler ini, Anda hanya perlu satu entri cron di server, dan semua jadwal tugas didefinisikan di `routes/console.php`.



## Definisi Jadwal Tugas

### 1. Menjadwalkan Closure

Semua tugas terjadwal dapat didefinisikan di `routes/console.php`. Contoh, menjalankan query untuk membersihkan tabel setiap hari pada tengah malam:

```php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    DB::table('recent_users')->delete();
})->daily();
```

### 2. Menjadwalkan Invokable Object

Anda juga dapat menjadwalkan **invokable objects** — kelas PHP dengan metode `__invoke()`:

```php
Schedule::call(new DeleteRecentUsers)->daily();
```

Jika ingin memisahkan definisi tugas dari `console.php`, Anda bisa menggunakan metode `withSchedule` di `bootstrap/app.php`:

```php
use Illuminate\Console\Scheduling\Schedule;

->withSchedule(function (Schedule $schedule) {
    $schedule->call(new DeleteRecentUsers)->daily();
})
```

### 3. Melihat Jadwal Tugas

Gunakan perintah Artisan berikut untuk melihat daftar tugas yang dijadwalkan:

```bash
php artisan schedule:list
```



## Menjadwalkan Artisan Commands

### 1. Menggunakan Nama Command

```php
Schedule::command('emails:send Taylor --force')->daily();
```

### 2. Menggunakan Class Command

```php
use App\Console\Commands\SendEmailsCommand;

Schedule::command(SendEmailsCommand::class, ['Taylor', '--force'])->daily();
```

### 3. Command Closure

```php
Artisan::command('delete:recent-users', function () {
    DB::table('recent_users')->delete();
})->purpose('Delete recent users')->daily();
```

Jika ingin melewatkan argumen:

```php
Artisan::command('emails:send {user} {--force}', function ($user) {
    // kode pengiriman email
})->purpose('Send emails to the specified user')->schedule(['Taylor', '--force'])->daily();
```



## Menjadwalkan Jobs Antrian

```php
use App\Jobs\Heartbeat;

Schedule::job(new Heartbeat)->everyFiveMinutes();
```

Menentukan queue dan koneksi:

```php
Schedule::job(new Heartbeat, 'heartbeats', 'sqs')->everyFiveMinutes();
```



## Menjadwalkan Perintah Shell

```php
Schedule::exec('node /home/forge/script.js')->daily();
```



## Opsi Frekuensi Jadwal

Laravel menyediakan banyak metode untuk menentukan frekuensi eksekusi:

| Metode                 | Deskripsi                                  |
| - |  |
| `->daily()`            | Setiap hari tengah malam                   |
| `->hourly()`           | Setiap jam                                 |
| `->weekly()`           | Setiap minggu                              |
| `->monthly()`          | Setiap bulan                               |
| `->cron('* * * * *')`  | Cron kustom                                |
| `->everyMinute()`      | Setiap menit                               |
| `->everyFiveMinutes()` | Setiap 5 menit                             |
| ...                    | ... (lihat daftar lengkap di Laravel Docs) |

Contoh kombinasi jadwal:

```php
Schedule::call(function () {
    // kode...
})->weekly()->mondays()->at('13:00');
```



## Pembatasan Hari dan Waktu

### 1. Hari Tertentu

```php
Schedule::command('emails:send')->hourly()->days([0, 3]); // Minggu & Rabu
```

### 2. Batas Waktu

```php
Schedule::command('emails:send')->hourly()->between('7:00', '22:00');
Schedule::command('emails:send')->hourly()->unlessBetween('23:00', '4:00');
```

### 3. Berdasarkan Kondisi (Truth Test)

```php
Schedule::command('emails:send')->daily()->when(function () {
    return true;
});

Schedule::command('emails:send')->daily()->skip(function () {
    return true;
});
```

### 4. Lingkungan

```php
Schedule::command('emails:send')->daily()->environments(['staging', 'production']);
```



## Zona Waktu

```php
Schedule::command('report:generate')
    ->timezone('America/New_York')
    ->at('2:00');
```



## Mencegah Overlap Tugas

```php
Schedule::command('emails:send')->withoutOverlapping();
Schedule::command('emails:send')->withoutOverlapping(10); // Lock 10 menit
```



## Menjalankan Tugas di Satu Server

```php
Schedule::command('report:generate')
    ->fridays()
    ->at('17:00')
    ->onOneServer();
```

Untuk tugas dengan parameter berbeda, gunakan `name`:

```php
Schedule::job(new CheckUptime('https://laravel.com'))
    ->name('check_uptime:laravel.com')
    ->everyFiveMinutes()
    ->onOneServer();
```



## Tugas Latar Belakang

```php
Schedule::command('analytics:report')->daily()->runInBackground();
```



## Mode Maintenance

```php
Schedule::command('emails:send')->evenInMaintenanceMode();
```



## Grup Jadwal

```php
Schedule::daily()->onOneServer()->timezone('America/New_York')->group(function () {
    Schedule::command('emails:send --force');
    Schedule::command('emails:prune');
});
```



## Menjalankan Scheduler

### 1. Di Server

Tambahkan satu entri cron:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

### 2. Sub-Minute Task

```php
Schedule::call(function () {
    DB::table('recent_users')->delete();
})->everySecond();
```

### 3. Jalankan Scheduler Lokal

```bash
php artisan schedule:work
```



## Output Tugas

```php
Schedule::command('emails:send')->daily()->sendOutputTo($filePath);
Schedule::command('emails:send')->daily()->appendOutputTo($filePath);
Schedule::command('report:generate')->daily()->emailOutputTo('taylor@example.com');
Schedule::command('report:generate')->daily()->emailOutputOnFailure('taylor@example.com');
```



## Task Hooks

```php
Schedule::command('emails:send')
    ->daily()
    ->before(fn() => // sebelum eksekusi)
    ->after(fn() => // sesudah eksekusi)
    ->onSuccess(fn($output) => // jika sukses)
    ->onFailure(fn($output) => // jika gagal);
```



## Pinging URL

```php
Schedule::command('emails:send')
    ->daily()
    ->pingBefore($url)
    ->thenPing($url)
    ->pingOnSuccess($successUrl)
    ->pingOnFailure($failureUrl);
```



## Events Scheduler

Laravel menyediakan event selama proses scheduling, misalnya:

* `ScheduledTaskStarting`
* `ScheduledTaskFinished`
* `ScheduledBackgroundTaskFinished`
* `ScheduledTaskSkipped`
* `ScheduledTaskFailed`



# ⚙️ Process di Laravel: Panduan Eksekusi Perintah dari Guru Kesayanganmu

Hai murid-murid kesayanganku! Hari ini kita akan membahas fitur yang bisa membuat aplikasimu **berinteraksi langsung dengan sistem operasi** - **Process**! 🔥

Bayangkan kamu sedang membuat aplikasi yang perlu:
- Jalankan perintah shell seperti `git pull`, `composer install`, atau `npm run build`
- Proses file besar menggunakan tools eksternal
- Eksekusi skrip Python, Node.js, atau shell script dari dalam Laravel
- Backup database secara otomatis

Nah, **Process** di Laravel adalah seperti **asisten pintar** yang bisa kamu suruh untuk **menjalankan perintah di sistem operasi** secara aman dan terkontrol!

Laravel menggunakan komponen Symfony Process, tapi dibungkus dengan API yang **sangat mudah digunakan** dan **ekspresif**.

Setelah beberapa kali revisi, aku yakin kamu akan lebih mudah memahami konsep ini dengan penjelasan yang **super lengkap** tapi dijelaskan dengan **super sederhana**. Siap? Ayo kita mulai petualangan eksekusi proses ini!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Process Itu Sebenarnya?

**Analogi:** Bayangkan kamu seorang manajer besar yang punya banyak asisten. Kamu bisa suruh asisten ini:
1.  **Jalankan tugas di komputer** (misalnya: backup data, proses file, update sistem)
2.  **Ambil hasilnya** (misalnya: daftar file, status backup)
3.  **Laporkan jika ada error** (misalnya: disk penuh, permission error)

**Process** di Laravel adalah seperti **asisten sistem operasi** ini! Ia bisa:
- **Menjalankan perintah shell** (seperti yang kamu ketik di terminal)
- **Mengatur environment** (direktori, variabel lingkungan)
- **Mengelola output** (ambil hasil atau error)
- **Mengatur waktu dan timeout** (jangan terlalu lama jalan)

**Mengapa ini penting?** Karena seringkali aplikasi perlu **eksekusi tugas yang lebih cepat atau lebih efisien dilakukan oleh tools sistem**, bukan PHP murni. Dari backup database, proses gambar dengan ImageMagick, hingga deploy otomatis - semua bisa dilakukan via Process.

**Bagaimana cara kerjanya?** 
1.  **Kamu beri perintah**: Misalnya kamu ingin jalankan `ls -la`.
2.  **Process eksekusi**: Laravel kirim perintah ke sistem operasi.
3.  **Ambil hasilnya**: Kembalikan output dan status ke aplikasimu.

Tanpa Process, kamu harus manual-handle eksekusi shell command, yang bisa **berbahaya dan tidak aman**.

### 2. ✍️ Resep Pertamamu: Jalankan Perintah Sederhana

Mari kita buat contoh pertama: menampilkan isi folder saat ini. Kita akan buat dari nol, langkah demi langkah.

#### Langkah 1️⃣: Siapkan Alatnya (Import Facade)

**Mengapa?** Kita perlu facade Process untuk bisa menggunakan fitur ini.

**Bagaimana?** Di file kamu (controller, service, atau class lain):
```php
use Illuminate\Support\Facades\Process;
```

#### Langkah 2️⃣: Jalankan Perintah Dasar

**Mengapa?** Kita perlu coba dulu eksekusi perintah dasar.

**Bagaimana?**
```php
// Jalankan perintah ls -la
$result = Process::run('ls -la');

// Tampilkan output
echo $result->output();
```

#### Langkah 3️⃣: Proses Hasil Eksekusi

**Mengapa?** Karena biasanya kamu perlu cek apakah perintah berhasil atau tidak.

**Bagaimana?**
```php
// Jalankan perintah dan cek hasil
$result = Process::run('ls -la');

if ($result->successful()) {
    echo "Perintah berhasil dijalankan!";
    echo $result->output(); // Tampilkan output
} else {
    echo "Perintah gagal!";
    echo $result->errorOutput(); // Tampilkan error
    echo "Kode exit: " . $result->exitCode();
}
```

#### Langkah 4️⃣: Cek Apakah Perintah Berhasil

**Mengapa?** Karena kamu perlu tahu apakah perintah berjalan dengan benar.

**Bagaimana?**
```php
$result = Process::run('ls -la');

// Cek berbagai kondisi
echo "Perintah: " . $result->command() . "\n";
echo "Berhasil: " . ($result->successful() ? 'Ya' : 'Tidak') . "\n";
echo "Gagal: " . ($result->failed() ? 'Ya' : 'Tidak') . "\n";
echo "Kode exit: " . $result->exitCode() . "\n";
echo "Output: " . $result->output() . "\n";
```

Selesai! 🎉 Sekarang kamu sudah bisa jalankan perintah shell dari dalam Laravel.

### 3. ⚡ Process Spesialis (Eksekusi dengan Exception Handling)

**Analogi:** Bayangkan kamu punya asisten yang langsung memberitahu kamu jika ada masalah besar, tidak perlu kamu tanya satu per satu.

**Mengapa ini ada?** Karena kadang kamu ingin langsung tahu jika proses gagal.

**Bagaimana?**
```php
try {
    // throw() akan lempar exception jika proses gagal
    $result = Process::run('ls -la')->throw();
    
    echo "Perintah berhasil: " . $result->output();
} catch (\Illuminate\Process\Exceptions\ProcessFailedException $e) {
    echo "Proses gagal: " . $e->getMessage();
}

// Atau dengan kondisi
$result = Process::run('ls -la')->throwIf(fn($result) => $result->exitCode() !== 0);
```

---

## Bagian 2: Konfigurasi Process - Settingan Super 🧰

### 4. 📁 Working Directory (Direktori Kerja)

**Analogi:** Seperti memberi tahu asistenmu tempat kerja spesifik sebelum dia mulai tugas.

**Mengapa?** Karena banyak perintah harus dijalankan dari direktori tertentu.

**Bagaimana?**
```php
// Jalankan perintah dari direktori tertentu
$result = Process::path(__DIR__)->run('ls -la');

// Atau dari storage
$result = Process::path(storage_path())->run('ls -la');

// Atau dari public
$result = Process::path(public_path())->run('ls -la');
```

### 5. ⏱️ Timeout & Durasi Eksekusi

**Analogi:** Seperti memberi batas waktu maksimal untuk tugas, agar asisten tidak bekerja terlalu lama.

**Mengapa?** Karena proses bisa stuck atau berjalan terlalu lama.

**Bagaimana?**
```php
// Timeout 60 detik
$result = Process::timeout(60)->run('bash long-running-script.sh');

// Tidak ada timeout (hati-hati!)
$result = Process::forever()->run('bash infinite-loop.sh');

// Timeout idle 30 detik (waktu tanpa output baru)
$result = Process::timeout(60)->idleTimeout(30)->run('bash import-data.sh');
```

### 6. 🌿 Environment Variables (Variabel Lingkungan)

**Analogi:** Seperti memberi informasi penting ke asisten sebelum dia mulai kerja.

**Mengapa?** Karena banyak skrip perlu informasi seperti path, API key, atau mode operasi.

**Bagaimana?**
```php
// Tambahkan environment variables
$result = Process::forever()
    ->env(['APP_ENV' => 'production', 'BACKUP_PATH' => storage_path('backups')])
    ->run('bash backup-script.sh');

// Hapus variabel lingkungan (dengan false)
$result = Process::forever()
    ->env(['PATH' => false]) // Hapus PATH
    ->run('bash script.sh');
```

### 7. ✉️ Input ke Proses

**Analogi:** Seperti memberi dokumen awal ke asisten sebelum dia mulai mengerjakan tugas.

**Mengapa?** Karena beberapa perintah butuh input dari stdin.

**Bagaimana?**
```php
// Beri input ke perintah cat
$result = Process::input('Hello World')->run('cat');
// Output: "Hello World"

// Atau dari file
$input = file_get_contents('data.txt');
$result = Process::input($input)->run('bash process-data.sh');
```

### 8. 🖥️ TTY Mode (Terminal Interaktif)

**Analogi:** Seperti memberi asisten akses ke terminal langsung, bisa berinteraksi secara real-time.

**Mengapa?** Karena beberapa perintah perlu terminal interaktif (seperti vim, mysql, dll).

**Bagaimana?**
```php
// Mulai vim (tidak untuk Windows)
Process::forever()->tty()->run('vim');

// Catatan: TTY mode tidak didukung di Windows
```

---

## Bagian 3: Jurus Tingkat Lanjut - Process Canggih 🚀

### 9. 📝 Output Real-time (Streaming)

**Analogi:** Seperti kamu bisa melihat asistenmu bekerja secara live, bukan hanya hasil akhirnya.

**Mengapa?** Karena kamu ingin tahu proses sedang berlangsung, bukan hanya hasil akhir.

**Bagaimana?**
```php
// Callback untuk output real-time
Process::run('php artisan queue:work', function (string $type, string $output) {
    // $type: 'out' untuk stdout, 'err' untuk stderr
    if ($type === 'out') {
        echo "Output: " . $output;
    } else {
        echo "Error: " . $output;
    }
});
```

### 10. 🔍 Cek Output untuk String Tertentu

**Mengapa?** Karena kamu perlu tahu apakah proses menghasilkan output tertentu.

**Bagaimana?**
```php
$result = Process::run('php artisan list');

if ($result->seeInOutput('make:controller')) {
    echo "Command make:controller tersedia!";
}

// Cek error output
if ($result->seeInErrorOutput('error')) {
    echo "Ada error dalam output!";
}
```

### 11. 🚫 Membuat Proses Senyap (Quiet)

**Analogi:** Seperti menyuruh asisten untuk kerja tanpa membuat suara atau gangguan.

**Mengapa?** Karena kadang kamu tidak perlu output, hanya statusnya.

**Bagaimana?**
```php
// Jalankan tanpa output
$result = Process::quietly()->run('bash background-task.sh');

// Proses tetap berjalan, output tidak ditampilkan
```

### 12. ⚡ Proses Asinkron (Non-blocking)

**Analogi:** Seperti menyuruh asisten mengerjakan tugas panjang, sementara kamu bisa mengerjakan hal lain.

**Mengapa?** Karena kamu tidak ingin request user menunggu proses panjang.

**Bagaimana?**
```php
// Mulai proses tanpa block
$process = Process::timeout(300)->start('bash long-import.sh');

// Aplikasi bisa mengerjakan hal lain
echo "Proses sedang berjalan...";

// Cek apakah masih berjalan
while ($process->running()) {
    echo "Proses masih berjalan...\n";
    sleep(1);
}

// Tunggu selesai dan ambil hasil
$result = $process->wait();
if ($result->successful()) {
    echo "Proses selesai sukses!";
} else {
    echo "Proses gagal!";
}
```

### 13. 📊 Monitoring Proses Asinkron

**Mengapa?** Karena kamu ingin tahu progress proses secara real-time.

**Bagaimana?**
```php
$process = Process::start('bash import-data.sh');

while ($process->running()) {
    // Ambil output terbaru
    $latestOutput = $process->latestOutput();
    $latestError = $process->latestErrorOutput();
    
    echo "Output: " . $latestOutput . "\n";
    echo "Error: " . $latestError . "\n";
    
    sleep(1);
}

$result = $process->wait();
```

### 14. 🎯 Menunggu Kondisi Tertentu

**Mengapa?** Karena kamu ingin lanjut saat proses mencapai titik tertentu.

**Bagaimana?**
```php
$process = Process::start('bash initialization-script.sh');

// Tunggu sampai output mengandung "Ready..."
$process->waitUntil(function (string $type, string $output) {
    return strpos($output, 'Ready...') !== false;
});

echo "Proses siap, lanjutkan...";
```

---

## Bagian 4: Pipeline & Pool - Proses Kolaboratif 🧰

### 15. 🔗 Pipeline Proses

**Analogi:** Seperti lini produksi di pabrik, output satu mesin langsung jadi input mesin berikutnya.

**Mengapa?** Karena kamu bisa gabungkan beberapa perintah secara efisien.

**Bagaimana?**
```php
use Illuminate\Process\Pipe;
use Illuminate\Support\Facades\Process;

// Pipeline: cat file.txt | grep "laravel" | wc -l
$result = Process::pipe(function (Pipe $pipe) {
    $pipe->command('cat example.txt');      // Ambil konten file
    $pipe->command('grep -i "laravel"');    // Filter yang mengandung "laravel"
    $pipe->command('wc -l');                // Hitung jumlah baris
});

if ($result->successful()) {
    echo "Jumlah baris dengan 'laravel': " . trim($result->output());
}

// Dengan callback real-time
$result = Process::pipe(function (Pipe $pipe) {
    $pipe->command('cat example.txt');
    $pipe->command('grep -i "laravel"');
}, function (string $type, string $output) {
    echo $output; // Tampilkan output real-time
});
```

### 16. 🏃‍♂️ Pool Proses (Concurrent)

**Analogi:** Seperti punya banyak asisten yang bekerja bersamaan untuk menyelesaikan banyak tugas sekaligus.

**Mengapa?** Karena kamu bisa eksekusi banyak proses sekaligus, lebih cepat dari serial.

**Bagaimana?**
```php
use Illuminate\Process\Pool;
use Illuminate\Support\Facades\Process;

// Eksekusi 3 proses backup bersamaan
$pool = Process::pool(function (Pool $pool) {
    $pool->path(storage_path('backups'))->command('bash backup-db.sh');
    $pool->path(storage_path('backups'))->command('bash backup-files.sh');
    $pool->path(storage_path('backups'))->command('bash backup-logs.sh');
})->start(function (string $type, string $output, int $key) {
    echo "Proses $key: $output\n";
});

// Tunggu semua selesai
$results = $pool->wait();

// Cek hasil masing-masing
foreach ($results as $index => $result) {
    if ($result->successful()) {
        echo "Proses $index sukses\n";
    } else {
        echo "Proses $index gagal\n";
    }
}
```

### 17. 🏷️ Named Pool Proses

**Mengapa?** Karena lebih mudah tracking proses mana yang mana.

**Bagaimana?**
```php
$pool = Process::pool(function (Pool $pool) {
    $pool->as('database')->command('bash backup-db.sh');
    $pool->as('files')->command('bash backup-files.sh');
    $pool->as('logs')->command('bash backup-logs.sh');
})->start();

$results = $pool->wait();

// Akses hasil dengan nama
$dbResult = $results['database'];
$fileResult = $results['files'];
$logResult = $results['logs'];
```

---

## Bagian 5: Peralatan Canggih di 'Kotak Perkakas' Process 🧰

### 18. 🛡️ Security & Best Practices

1. **Jangan pernah jalankan input user langsung**:
```php
// BURUK - RAWAN INJEKSI
$command = "ls -la " . $request->input('folder');
$result = Process::run($command);

// BAIK - Validasi dan sanitize dulu
$validFolders = ['images', 'documents', 'videos'];
$folder = $request->input('folder');

if (in_array($folder, $validFolders)) {
    $result = Process::path(storage_path($folder))->run('ls -la');
} else {
    throw new \InvalidArgumentException('Invalid folder');
}
```

2. **Gunakan timeout untuk semua proses panjang**:
```php
Process::timeout(300)->run('bash long-script.sh');
```

3. **Jangan hardcode credential di command**:
```php
// BURUK
Process::run('mysql -u root -psecretpassword ...');

// BAIK
Process::env(['MYSQL_PASSWORD' => config('database.password')])
    ->run('bash mysql-script.sh');
```

### 19. 🚀 Performance & Optimization

1. **Gunakan proses asinkron untuk tugas berat**:
```php
// Jangan block request
$process = Process::start('bash heavy-task.sh');

return response()->json(['message' => 'Task started', 'status' => 'processing']);
```

2. **Gunakan pool untuk proses paralel**:
```php
// Lebih cepat dari eksekusi serial
Process::pool(function ($pool) use ($files) {
    foreach ($files as $file) {
        $pool->command("bash process-file.sh $file");
    }
})->start()->wait();
```

3. **Gunakan pipeline untuk chain command**:
```php
// Lebih efisien dari eksekusi terpisah
Process::pipe(function ($pipe) {
    $pipe->command('find . -name "*.log"');
    $pipe->command('grep "error"');
    $pipe->command('sort');
})->run();
```

### 20. 🧪 Testing Process

**Mengapa?** Karena kamu tidak ingin eksekusi proses sungguhan saat testing.

**Bagaimana?**
```php
<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Process;
use Tests\TestCase;

class ProcessTest extends TestCase
{
    public function test_backup_command_works()
    {
        // Fake proses
        Process::fake([
            'bash backup-db.sh' => Process::result(
                output: 'Backup successful',
                errorOutput: '',
                exitCode: 0
            )
        ]);

        // Jalankan kode yang menggunakan Process
        $response = $this->post('/backup');

        // Cek bahwa proses benar-benar berjalan
        Process::assertRan('bash backup-db.sh');
        
        $response->assertStatus(200);
    }
    
    public function test_handles_process_failure()
    {
        Process::fake([
            'bash backup-db.sh' => Process::result(
                output: '',
                errorOutput: 'Permission denied',
                exitCode: 1
            )
        ]);

        $response = $this->post('/backup');
        
        $response->assertStatus(500);
        Process::assertRan('bash backup-db.sh');
    }
    
    public function test_sequential_output()
    {
        Process::fake([
            'bash import.sh' => Process::describe()
                ->output('Starting import...')
                ->output('Processing file 1...')
                ->output('Processing file 2...')
                ->exitCode(0)
                ->iterations(3)
        ]);

        $result = Process::run('bash import.sh');
        
        $this->assertTrue($result->successful());
    }
}
```

### 21. 🛑 Mencegah Proses Tak Diinginkan

**Mengapa?** Untuk mencegah eksekusi proses yang tidak dites.

**Bagaimana?**
```php
// Di testing environment
Process::preventStrayProcesses();

Process::fake([
    'ls *' => 'Test output',  // Ini akan digunakan
]);

Process::run('ls -la');           // ✓ OK, sudah di-fake
Process::run('unknown-script');   // ✗ Exception karena tidak di-fake
```

### 22. 🎨 Advanced Process Patterns

#### Process dengan Progress Monitoring
```php
public function runImportWithProgress()
{
    $process = Process::start('bash import-with-progress.sh');
    
    $progress = 0;
    
    while ($process->running()) {
        $latest = $process->latestOutput();
        
        // Cek jika output mengandung progress
        if (preg_match('/Progress: (\d+)%/', $latest, $matches)) {
            $progress = (int)$matches[1];
            
            // Simpan ke cache atau broadcast via websocket
            cache()->put("import_progress", $progress, 300);
        }
        
        sleep(1);
    }
    
    $result = $process->wait();
    return $result->successful();
}
```

#### Process dengan Retry Logic
```php
public function runWithRetry(string $command, int $maxRetries = 3): \Illuminate\Process\ProcessResult
{
    for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
        $result = Process::run($command);
        
        if ($result->successful()) {
            return $result;
        }
        
        if ($attempt < $maxRetries) {
            sleep($attempt * 2); // Backoff
        }
    }
    
    return $result; // Return hasil terakhir
}
```

---

## Bagian 6: Menjadi Master Process 🏆

### 23. ✨ Wejangan dari Guru

1.  **Jangan jalankan command dari user input!** - Selalu validasi dan sanitize.
2.  **Gunakan timeout** untuk semua proses yang bisa lama.
3.  **Gunakan asynchronous** untuk proses berat agar tidak block request.
4.  **Test dengan Process::fake()** - Jangan eksekusi proses sungguhan saat testing.
5.  **Gunakan pool** untuk multiple parallel tasks.
6.  **Gunakan pipeline** untuk chain commands.
7.  **Log process execution** untuk debugging.

### 24. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Process di Laravel:

#### ⚙️ Basic Process
| Method | Fungsi |
|--------|--------|
| `Process::run('command')` | Jalankan command secara sinkron |
| `Process::start('command')` | Jalankan command secara asinkron |
| `$result->successful()` | Cek apakah sukses |
| `$result->failed()` | Cek apakah gagal |
| `$result->output()` | Ambil output |
| `$result->errorOutput()` | Ambil error output |
| `$result->exitCode()` | Ambil exit code |

#### 🛠️ Process Options
| Method | Fungsi |
|--------|--------|
| `Process::path('/dir')` | Set working directory |
| `Process::timeout(60)` | Set timeout |
| `Process::forever()` | Nonaktifkan timeout |
| `Process::env([...])` | Set environment variables |
| `Process::input('text')` | Set input ke process |
| `Process::quietly()` | Jalankan tanpa output |

#### ⚡ Async & Pool
| Method | Fungsi |
|--------|--------|
| `Process::start('cmd')` | Mulai proses async |
| `$process->running()` | Cek apakah masih running |
| `$process->wait()` | Tunggu proses selesai |
| `Process::pool(...)` | Eksekusi multiple proses |
| `Process::pipe(...)` | Chain multiple commands |

#### 🧪 Testing
| Method | Fungsi |
|--------|--------|
| `Process::fake([...])` | Fake process execution |
| `Process::assertRan('cmd')` | Cek apakah command dijalankan |
| `Process::assertRanTimes('cmd', 2)` | Cek berapa kali dijalankan |
| `Process::result(...)` | Buat fake result |
| `Process::describe()` | Buat fake result dengan detail |

#### 🚀 Advanced
| Method | Fungsi |
|--------|--------|
| `$result->throw()` | Throw exception jika gagal |
| `$result->throwIf(...)` | Throw dengan kondisi |
| `Process::tty()` | Enable TTY mode |
| `Process::idleTimeout(30)` | Set idle timeout |
| `$process->waitUntil(...)` | Tunggu sampai kondisi terpenuhi |

### 25. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Process, dari yang paling dasar sampai yang paling rumit. Kamu hebat! 

Dengan Process, kamu bisa membuat aplikasi yang **berinteraksi langsung dengan sistem operasi secara aman dan terkontrol**. Dari backup otomatis, proses file besar, hingga integrasi dengan tools eksternal - semua bisa kamu tangani dengan Laravel Process.

**Ingat**: Process adalah kekuatan besar. Selalu pertimbangkan:
- **Security**: Validasi input, jangan eksekusi command user langsung
- **Performance**: Gunakan async untuk proses berat
- **Reliability**: Gunakan timeout dan error handling
- **Testing**: Gunakan `Process::fake()` untuk testing yang aman

Jangan pernah berhenti belajar dan mencoba! Implementasikan Process di proyekmu dan lihat betapa kuatnya kemampuan aplikasimu untuk berinteraksi dengan sistem.

Selamat ngoding, murid kesayanganku! 🚀✨
# 📄 Processes

## 📌 Pendahuluan

Laravel menyediakan API minimal namun ekspresif untuk **Symfony Process component**, memungkinkan Anda memanggil proses eksternal dari aplikasi Laravel. Fitur proses Laravel fokus pada **kemudahan penggunaan** dan **pengalaman pengembang yang menyenangkan**.



## 🚀 Memanggil Proses

Laravel menawarkan metode `run` dan `start` pada **Process facade**.

* `run` → Menjalankan proses secara **sinkron** dan menunggu hingga selesai.
* `start` → Menjalankan proses secara **asinkron**, memungkinkan aplikasi melakukan tugas lain saat proses berjalan.

### Contoh Sinkron

```php
use Illuminate\Support\Facades\Process;

$result = Process::run('ls -la');

return $result->output();
```

### Memeriksa Hasil Proses

```php
$result = Process::run('ls -la');

$result->command();       // Perintah yang dijalankan
$result->successful();    // Apakah berhasil
$result->failed();        // Apakah gagal
$result->output();        // Output standar
$result->errorOutput();   // Output error
$result->exitCode();      // Kode keluar
```



## ⚠️ Melempar Exception

Laravel memungkinkan Anda melempar **ProcessFailedException** jika proses gagal:

```php
$result = Process::run('ls -la')->throw();
$result = Process::run('ls -la')->throwIf($condition);
```



## ⚙️ Opsi Proses

### 📁 Direktori Kerja

```php
$result = Process::path(__DIR__)->run('ls -la');
```

### ✉️ Input

```php
$result = Process::input('Hello World')->run('cat');
```

### ⏱️ Timeout

```php
$result = Process::timeout(120)->run('bash import.sh'); // Timeout 120 detik
$result = Process::forever()->run('bash import.sh');    // Nonaktifkan timeout
$result = Process::timeout(60)->idleTimeout(30)->run('bash import.sh'); // Idle timeout
```

### 🌿 Variabel Lingkungan

```php
$result = Process::forever()
    ->env(['IMPORT_PATH' => __DIR__])
    ->run('bash import.sh');

$result = Process::forever()
    ->env(['LOAD_PATH' => false])
    ->run('bash import.sh'); // Menghapus variabel lingkungan
```

### 🖥️ TTY Mode

```php
Process::forever()->tty()->run('vim'); // Tidak didukung di Windows
```



## 📝 Output Proses

### Mengakses Output

```php
$result = Process::run('ls -la');
echo $result->output();       // stdout
echo $result->errorOutput();  // stderr
```

### Output Real-time

```php
$result = Process::run('ls -la', function (string $type, string $output) {
    echo $output;
});
```

### Pengecekan String di Output

```php
if (Process::run('ls -la')->seeInOutput('laravel')) {
    // ...
}
```

### Menonaktifkan Output

```php
$result = Process::quietly()->run('bash import.sh');
```



## 🔗 Pipeline

Output dari satu proses dapat menjadi input proses lain menggunakan **pipe**.

### Contoh Pipeline

```php
use Illuminate\Process\Pipe;
use Illuminate\Support\Facades\Process;

$result = Process::pipe(function (Pipe $pipe) {
    $pipe->command('cat example.txt');
    $pipe->command('grep -i "laravel"');
});

if ($result->successful()) {
    // ...
}
```

### Real-time Output Pipeline

```php
$result = Process::pipe(function (Pipe $pipe) {
    $pipe->command('cat example.txt');
    $pipe->command('grep -i "laravel"');
}, function (string $type, string $output) {
    echo $output;
});
```



## ⚡ Proses Asinkron

```php
$process = Process::timeout(120)->start('bash import.sh');

while ($process->running()) {
    // Proses masih berjalan
}

$result = $process->wait(); // Tunggu hingga selesai
```

### Output Asinkron

```php
while ($process->running()) {
    echo $process->latestOutput();
    echo $process->latestErrorOutput();
    sleep(1);
}
```

### Menunggu Hingga Kondisi Tertentu

```php
$process->waitUntil(function (string $type, string $output) {
    return $output === 'Ready...';
});
```



## 🏃‍♂️ Pool Proses (Concurrent)

Laravel mendukung **pool proses asinkron** untuk mengeksekusi banyak tugas sekaligus.

```php
use Illuminate\Process\Pool;
use Illuminate\Support\Facades\Process;

$pool = Process::pool(function (Pool $pool) {
    $pool->path(__DIR__)->command('bash import-1.sh');
    $pool->path(__DIR__)->command('bash import-2.sh');
    $pool->path(__DIR__)->command('bash import-3.sh');
})->start(function (string $type, string $output, int $key) {
    echo $output;
});

$results = $pool->wait();
echo $results[0]->output();
```

### Memberi Nama Pool

```php
$pool = Process::pool(function (Pool $pool) {
    $pool->as('first')->command('bash import-1.sh');
    $pool->as('second')->command('bash import-2.sh');
    $pool->as('third')->command('bash import-3.sh');
})->start();

$results = $pool->wait();
return $results['first']->output();
```



## 🧪 Testing Proses

### Faking Proses

```php
Process::fake();

$response = $this->get('/import');

Process::assertRan('bash import.sh');
```

### Faking dengan Output Kustom

```php
Process::fake([
    '*' => Process::result(
        output: 'Test output',
        errorOutput: 'Test error',
        exitCode: 1
    ),
]);
```

### Faking Proses Asinkron

```php
Process::fake([
    'bash import.sh' => Process::describe()
        ->output('Line 1')
        ->errorOutput('Error line 1')
        ->output('Line 2')
        ->exitCode(0)
        ->iterations(3),
]);
```

### Assertions

```php
Process::assertRan('ls -la');          // Dipanggil
Process::assertDidntRun('ls -la');     // Tidak dipanggil
Process::assertRanTimes('ls -la', 3);  // Dipanggil 3 kali
```

### Mencegah Proses Sebenarnya

```php
Process::preventStrayProcesses();

Process::fake([
    'ls *' => 'Test output',
]);

Process::run('ls -la');  // Fake
Process::run('bash import.sh'); // Exception
```




# 🖥️ Console Tests di Laravel

## 📖 Pendahuluan

Selain menyederhanakan pengujian HTTP, Laravel juga menyediakan API yang simpel untuk menguji **custom console commands** yang dibuat di aplikasi kita.
Hal ini memudahkan kita untuk memastikan perintah Artisan yang dibuat dapat berjalan sesuai ekspektasi tanpa harus mengeksekusinya secara manual di terminal.

---

## ✅ Ekspektasi Berhasil / Gagal

### 🔹 Narasi

Dalam setiap perintah Artisan, selalu ada **exit code** yang dihasilkan.

* `0` → Berhasil (success).
* `non-zero` → Gagal (failed).

Laravel menyediakan cara mudah untuk menguji hasil ini melalui metode `assertExitCode`, `assertSuccessful`, atau `assertFailed`.

### 🔹 Contoh Code (Pest)

```php
test('console command', function () {
    $this->artisan('inspire')->assertExitCode(0);
});
```

👉 Kita juga bisa memeriksa kebalikannya dengan `assertNotExitCode`:

```php
$this->artisan('inspire')->assertNotExitCode(1);
```

👉 Cara singkat lain untuk uji keberhasilan atau kegagalan:

```php
$this->artisan('inspire')->assertSuccessful();
$this->artisan('inspire')->assertFailed();
```

---

## ⌨️ Ekspektasi Input / Output

### 🔹 Narasi

Laravel memungkinkan kita melakukan **mocking input pengguna** pada console command. Kita dapat menggunakan:

* `expectsQuestion()` → untuk jawaban dari pertanyaan.
* `expectsOutput()` → untuk hasil output.
* `doesntExpectOutput()` → memastikan output tertentu tidak muncul.

### 🔹 Contoh Console Command

```php
Artisan::command('question', function () {
    $name = $this->ask('What is your name?');
 
    $language = $this->choice('Which language do you prefer?', [
        'PHP',
        'Ruby',
        'Python',
    ]);
 
    $this->line('Your name is '.$name.' and you prefer '.$language.'.');
});
```

### 🔹 Contoh Pengujian

```php
test('console command', function () {
    $this->artisan('question')
        ->expectsQuestion('What is your name?', 'Taylor Otwell')
        ->expectsQuestion('Which language do you prefer?', 'PHP')
        ->expectsOutput('Your name is Taylor Otwell and you prefer PHP.')
        ->doesntExpectOutput('Your name is Taylor Otwell and you prefer Ruby.')
        ->assertExitCode(0);
});
```

### 🔹 Mocking Search

Jika menggunakan fitur `search` atau `multisearch` dari **Laravel Prompts**, kita bisa gunakan `expectsSearch`:

```php
test('console command', function () {
    $this->artisan('example')
        ->expectsSearch('What is your name?', search: 'Tay', answers: [
            'Taylor Otwell',
            'Taylor Swift',
            'Darian Taylor'
        ], answer: 'Taylor Otwell')
        ->assertExitCode(0);
});
```

### 🔹 Tidak Ada Output

```php
test('console command', function () {
    $this->artisan('example')
        ->doesntExpectOutput()
        ->assertExitCode(0);
});
```

### 🔹 Hanya Sebagian Output

```php
test('console command', function () {
    $this->artisan('example')
        ->expectsOutputToContain('Taylor')
        ->assertExitCode(0);
});
```

---

## 🙋 Ekspektasi Konfirmasi

### 🔹 Narasi

Kadang perintah membutuhkan konfirmasi **ya/tidak**. Kita bisa uji dengan `expectsConfirmation`.

### 🔹 Contoh

```php
$this->artisan('module:import')
    ->expectsConfirmation('Do you really wish to run this command?', 'no')
    ->assertExitCode(1);
```

---

## 📊 Ekspektasi Tabel

### 🔹 Narasi

Jika perintah menampilkan tabel, menulis assertion untuk setiap baris bisa merepotkan.
Laravel menyediakan `expectsTable` untuk mempermudah.

### 🔹 Contoh

```php
$this->artisan('users:all')
    ->expectsTable([
        'ID',
        'Email',
    ], [
        [1, 'taylor@example.com'],
        [2, 'abigail@example.com'],
    ]);
```

---

## 🎧 Console Events

### 🔹 Narasi

Secara default, event seperti:

* `Illuminate\Console\Events\CommandStarting`
* `Illuminate\Console\Events\CommandFinished`

tidak dipicu saat menjalankan test.
Namun, jika dibutuhkan, kita bisa mengaktifkannya dengan trait `WithConsoleEvents`.

### 🔹 Contoh (Pest)

```php
<?php
 
use Illuminate\Foundation\Testing\WithConsoleEvents;
 
pest()->use(WithConsoleEvents::class);
 
// ...
```

---

# 🏁 Kesimpulan

Dengan dukungan penuh Laravel untuk menguji **console commands**, kita bisa memastikan setiap perintah Artisan bekerja dengan baik, mulai dari **exit code**, **input/output**, **konfirmasi**, **tabel**, hingga **event console**.
Hal ini membuat aplikasi lebih andal dan meminimalisir error yang tidak terduga di lingkungan produksi.

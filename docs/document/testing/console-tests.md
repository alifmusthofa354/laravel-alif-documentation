# 🖥️ Console Tests di Laravel: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Setelah beberapa kali revisi, akhirnya Guru paham apa yang sebenarnya kalian inginkan: sebuah panduan yang **super lengkap** tapi dijelaskan dengan **super sederhana**, seolah-olah Guru sedang duduk di sebelahmu sambil menjelaskan pelan-pelan.

Di edisi ini, kita akan kupas tuntas **semua detail** tentang Console Tests, tapi setiap topik akan Guru ajarkan dengan sabar. Siap? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基 礎

### 1. 📖 Apa Sih Console Tests Itu Sebenarnya?

**Analogi:** Bayangkan kamu membuat robot khusus (inilah **console command** kita) yang bisa membersihkan rumah, menyiram tanaman, dan mengatur lampu. Sebelum kamu percaya robot itu ke tugas penting, kamu harus **menguji semua fungsinya di tempat aman** (inilah **console tests** kita). Jadi, kamu bisa tahu apakah perintah "nyalakan lampu" berfungsi tanpa harus menunggu lampunya nyala di rumah asli.

**Mengapa ini penting?** Karena kamu bisa memastikan custom console commands yang kamu buat bekerja sesuai harapan TANPA harus menjalankannya secara manual di terminal. Ini mencegah bug dan memastikan perintahmu bekerja dengan baik sebelum digunakan di lingkungan produksi.

**Bagaimana cara kerjanya?** Console Tests itu seperti asisten uji coba yang:
1.  **Menjalankan perintahmu** secara virtual (tidak benar-benar di terminal)
2.  **Menyimulasikan input** yang biasanya diberikan oleh pengguna
3.  **Mengecek output** dan hasil eksekusi
4.  **Memberi laporan** apakah semuanya berjalan sesuai harapan

Jadi, alur kerja (workflow) Console Tests menjadi sangat rapi:

`➡️ Tulis Console Command -> 🧪 Uji dengan Console Tests -> ✅ Pastikan Berfungsi -> 🚀 Gunakan di Produksi dengan Yakin`

Tanpa Console Tests, kamu harus menjalankan command secara manual setiap kali mengubahnya, yang bisa sangat membosankan dan rentan kesalahan. 😵

### 2. ✍️ Resep Pertamamu: Dari Command ke Test

Ini adalah fondasi paling dasar. Mari kita buat test untuk console command dari nol, langkah demi langkah.

#### Langkah 1️⃣: Buat Console Command (Kalau Belum Ada)
**Mengapa?** Kita butuh command untuk diuji.

**Bagaimana?** Gunakan artisan untuk membuat command:
```bash
php artisan make:command InspireCommand
```

#### Langkah 2️⃣: Tulis Test untuk Command-mu
**Mengapa?** Agar bisa memastikan command berfungsi sesuai harapan.

**Bagaimana?** Gunakan metode `artisan()` dalam test:
```php
// Dalam file test, misalnya tests/Feature/InspireCommandTest.php
test('console command works', function () {
    $this->artisan('inspire')  // Panggil command 'inspire'
        ->assertExitCode(0);   // Pastikan exit code-nya 0 (berhasil)
});
```

**Penjelasan Kode:**
- `$this->artisan('inspire')` - Menyiapkan untuk menjalankan command 'inspire'
- `->assertExitCode(0)` - Memastikan command selesai dengan sukses (exit code 0)

Selesai! 🎉 Sekarang, kamu telah membuat test pertamamu untuk console command!

### 3. ⚡ Apa Itu Exit Code (Nilai Kembalian)?

**Analogi:** Ini seperti lampu sinyal di mobil - hijau berarti semuanya baik-baik saja, merah berarti ada masalah.

**Mengapa ini penting?** Karena dalam dunia command line, exit code adalah cara utama untuk memberi tahu apakah perintah berhasil atau gagal.

**Penjelasan:**
- `0` → Berhasil (success) - lampu hijau
- `non-zero` → Gagal (failed) - lampu merah

Laravel menyediakan metode untuk menguji exit code ini: `assertExitCode()`, `assertSuccessful()`, atau `assertFailed()`.

---

## Bagian 2: Uji Kepastian - Berhasil atau Gagal ✅

### 4. 🔍 Uji Exit Code (Cek Kepastian Hasil)

**Analogi:** Ini seperti mengecek apakah lampu benar-benar menyala setelah menekan saklar - apakah "ya" atau "tidak".

**Mengapa ini penting?** Karena kamu perlu memastikan command memberikan hasil yang benar (sukses atau gagal) sesuai dengan skenario yang kamu uji.

**Contoh Lengkap:**
```php
// Test bahwa command berhasil
test('command success', function () {
    $this->artisan('inspire')
        ->assertExitCode(0);  // Memastikan exit code 0 (berhasil)
});

// Test bahwa command mengembalikan kode tertentu
test('command custom exit code', function () {
    $this->artisan('custom:command')
        ->assertExitCode(5);  // Memastikan exit code 5
});

// Test kebalikan dari exit code
test('command not fail', function () {
    $this->artisan('inspire')
        ->assertNotExitCode(1);  // Memastikan BUKAN exit code 1
});

// Test dengan metode pendek
test('command success shortcut', function () {
    $this->artisan('inspire')
        ->assertSuccessful();    // Sama dengan assertExitCode(0)
});

test('command failure shortcut', function () {
    $this->artisan('inspire')
        ->assertFailed();        // Sama dengan assertExitCode tidak 0
});
```

---

## Bagian 3: Uji Interaktif - Simulasikan Pengguna ⌨️

### 5. 🧪 Uji Input dan Output (Simulasikan Interaksi Pengguna)

**Analogi:** Bayangkan kamu punya robot yang bertanya ke pengguna "Siapa namamu?" dan kamu ingin menguji apakah robot ini bertanya dengan benar dan merespon dengan tepat. Kita perlu memberinya jawaban palsu dan memeriksa apakah jawabannya sesuai harapan.

**Mengapa ini penting?** Karena banyak console command memiliki interaksi seperti pertanyaan, konfirmasi, atau input dari pengguna. Kita harus bisa mensimulasikan ini dalam test.

**Cara Kerja:**
- `expectsQuestion()` → Mengharapkan pertanyaan dan memberi jawaban
- `expectsOutput()` → Mengharapkan output tertentu dari command
- `doesntExpectOutput()` → Memastikan output TIDAK muncul
- `expectsOutputToContain()` → Mengharapkan bagian tertentu dari output

### 6. 🎯 Contoh Console Command Interaktif

**Analogi:** Ini seperti membuat asisten virtual yang bertanya nama dan bahasa kesukaan pengguna, lalu memberi sambutan.

```php
Artisan::command('greeting', function () {
    $name = $this->ask('What is your name?');
    
    $language = $this->choice('Which language do you prefer?', [
        'PHP',
        'Python',
        'JavaScript',
    ]);
    
    $this->line('Hello ' . $name . '! You prefer ' . $language . '.');
});
```

### 7. 🧪 Contoh Pengujian Interaktif

**Contoh Lengkap:**
```php
test('greeting command works correctly', function () {
    $this->artisan('greeting')
        ->expectsQuestion('What is your name?', 'Taylor Otwell')      // Simulasikan jawaban pertanyaan
        ->expectsQuestion('Which language do you prefer?', 'PHP')     // Simulasikan jawaban pertanyaan
        ->expectsOutput('Hello Taylor Otwell! You prefer PHP.')       // Pastikan output sesuai
        ->doesntExpectOutput('Hello Taylor Otwell! You prefer Python.') // Pastikan output TIDAK sesuai ini
        ->assertExitCode(0);                                         // Dan pastikan sukses
});
```

### 8. 🔍 Mocking Search (Fitur Laravel Prompts)

**Analogi:** Seperti memberi petunjuk pada asisten yang bisa mencari nama dalam daftar, lalu memilih hasilnya.

**Mengapa ini ada?** Karena beberapa command menggunakan fitur search/multisearch dari Laravel Prompts, yang perlu disimulasikan dalam test.

**Contoh Lengkap:**
```php
test('search command works', function () {
    $this->artisan('user:search')
        ->expectsSearch(
            'Search for user?',             // Pertanyaan pencarian
            search: 'Tay',                  // Input pencarian
            answers: [                      // Daftar hasil pencarian
                'Taylor Otwell',
                'Taylor Swift',
                'Darian Taylor'
            ], 
            answer: 'Taylor Otwell'         // Jawaban yang dipilih
        )
        ->assertExitCode(0);
});
```

### 9. 🧪 Uji Output Secara Spesifik

**Tidak ada output tertentu:**
```php
test('command with no specific output', function () {
    $this->artisan('example')
        ->doesntExpectOutput()             // Pastikan tidak ada output
        ->assertExitCode(0);
});
```

**Hanya sebagian output:**
```php
test('command with partial output match', function () {
    $this->artisan('example')
        ->expectsOutputToContain('Taylor') // Hanya periksa bagian tertentu
        ->assertExitCode(0);
});
```

---

## Bagian 4: Uji Konfirmasi - Ya atau Tidak 🙋

### 10. 🎯 Uji Konfirmasi (Pertanyaan Ya/Tidak)

**Analogi:** Bayangkan perintahmu seperti seorang asisten rumah yang bertanya "Apakah kamu yakin ingin menghapus semua file penting?" dan kamu harus bisa mensimulasikan jawaban "ya" atau "tidak" untuk menguji respon yang benar.

**Mengapa ini penting?** Karena banyak command penting meminta konfirmasi sebelum menjalankan aksi yang tidak bisa dibatalkan, seperti menghapus data.

**Contoh Lengkap:**
```php
test('command with confirmation', function () {
    // Simulasikan jawaban "no" dan pastikan command gagal
    $this->artisan('module:import')
        ->expectsConfirmation('Do you really wish to run this command?', 'no')
        ->assertExitCode(1);  // Karena jawabannya "no", seharusnya gagal
});

test('command with positive confirmation', function () {
    // Simulasikan jawaban "yes" dan pastikan command berhasil
    $this->artisan('module:import')
        ->expectsConfirmation('Do you really wish to run this command?', 'yes')
        ->assertExitCode(0);  // Karena jawabannya "yes", seharusnya berhasil
});
```

---

## Bagian 5: Uji Tabel - Format Output Kompleks 📊

### 11. 🧪 Uji Output Tabel (Format Terstruktur)

**Analogi:** Bayangkan kamu punya command yang menampilkan daftar pengguna dalam bentuk tabel rapi seperti spreadsheet, dan kamu ingin menguji apakah tabel tersebut tampil dengan benar tanpa harus memeriksa setiap baris secara manual.

**Mengapa ini penting?** Karena command sering menampilkan data dalam format tabel, dan menulis assertion untuk setiap baris bisa sangat merepotkan. Laravel menyediakan solusi yang lebih mudah.

**Contoh Lengkap:**
```php
test('command with table output', function () {
    $this->artisan('users:list')
        ->expectsTable([
            'ID',    // Header kolom
            'Email', // Header kolom
        ], [
            [1, 'taylor@example.com'],      // Baris data pertama
            [2, 'abigail@example.com'],    // Baris data kedua
        ]);
});
```

**Bagaimana ini membantu?** Karena kamu bisa dengan mudah memastikan tabel tampil dengan struktur dan data yang benar tanpa harus membuat assertion kompleks untuk setiap bagian output.

---

## Bagian 6: Uji Event - Kapan Semua Terjadi 🎧

### 12. 🔔 Console Events (Uji Event yang Dipicu)

**Analogi:** Bayangkan kamu ingin tahu kapan persisnya robotmu mulai bekerja dan kapan selesai, seperti sensor yang merekam waktu mulai dan selesai tugasnya. Ini seperti menguji event-event yang terjadi saat command berjalan.

**Mengapa ini penting?** Karena beberapa aplikasi mungkin memiliki logika yang tergantung pada event tertentu seperti `CommandStarting` atau `CommandFinished`. Kamu perlu bisa menguji bahwa event ini dipicu dengan benar.

**Contoh Lengkap:**
Secara default, event seperti:
- `Illuminate\Console\Events\CommandStarting`
- `Illuminate\Console\Events\CommandFinished`

tidak dipicu saat menjalankan test. Namun, jika dibutuhkan, kita bisa mengaktifkannya dengan trait `WithConsoleEvents`.

**Aktivasi Console Events:**
```php
<?php

use Illuminate\Foundation\Testing\WithConsoleEvents;

// Untuk Pest
pest()->use(WithConsoleEvents::class);

// Atau dalam test class
class ExampleCommandTest extends TestCase
{
    use WithConsoleEvents;
    
    public function test_command_events()
    {
        // Sekarang kamu bisa menguji event-event command
    }
}
```

---

## Bagian 7: Praktik Terbaik dalam Console Tests 🏆

### 13. ✅ Praktik Terbaik untuk Test yang Efektif

**1. Uji Skenario Berhasil dan Gagal:**
```php
test('command works with valid input', function () {
    $this->artisan('user:create')
        ->expectsQuestion('Name?', 'Taylor')
        ->assertSuccessful();
});

test('command fails with invalid input', function () {
    $this->artisan('user:create')
        ->expectsQuestion('Name?', '')
        ->assertFailed();
});
```

**2. Uji Berbagai Jenis Input:**
```php
test('command handles different confirmation answers', function () {
    $this->artisan('dangerous:operation')
        ->expectsConfirmation('Sure?', 'yes')
        ->assertSuccessful();

    $this->artisan('dangerous:operation')
        ->expectsConfirmation('Sure?', 'no')
        ->assertExitCode(1);
});
```

**3. Uji Output secara Lengkap:**
```php
test('command shows correct table', function () {
    $this->artisan('stats:show')
        ->expectsTable([
            'Date',
            'Users',
            'Revenue',
        ], [
            ['2023-01-01', '100', '$1000'],
            ['2023-01-02', '120', '$1200'],
        ]);
});
```

**4. Gunakan Nama Test yang Jelas:**
```php
// Buruk
test('a', function () { ... });

// Baik
test('command creates user with provided name', function () { ... });
```

**5. Uji Error Conditions:**
```php
test('command shows error for invalid email', function () {
    $this->artisan('user:create')
        ->expectsQuestion('Email?', 'invalid-email')
        ->expectsOutput('Invalid email format')
        ->assertExitCode(1);
});
```

---

## Bagian 8: Tips dan Trik Lanjutan 🧠

### 14. 🚀 Tips untuk Console Testing yang Lebih Baik

**Gunakan Fungsi Bantuan:**
```php
function assertConsoleCommand($command, $exitCode = 0) {
    return $this->artisan($command)->assertExitCode($exitCode);
}
```

**Gabungkan Beberapa Ekspektasi:**
```php
test('comprehensive command test', function () {
    $this->artisan('complex:command')
        ->expectsQuestion('First?', 'Yes')
        ->expectsQuestion('Second?', 'No')
        ->expectsOutput('Processing...')
        ->expectsOutputToContain('Success')
        ->doesntExpectOutput('Error')
        ->assertSuccessful();
});
```

**Gunakan Data Provider (dalam PHPUnit):**
```php
public function provideConfirmationAnswers()
{
    return [
        ['yes', 0],      // jawaban, exit code yang diharapkan
        ['no', 1],
        ['y', 0],
        ['n', 1],
    ];
}

#[DataProvider('provideConfirmationAnswers')]
public function test_confirmation_command($answer, $expectedCode)
{
    $this->artisan('prompt:command')
        ->expectsConfirmation('Sure?', $answer)
        ->assertExitCode($expectedCode);
}
```

---

## Bagian 9: Cheat Sheet & Referensi Cepat 📋

### 15. 🔍 Metode Dasar
| Metode | Fungsi |
|--------|--------|
| `artisan('command')` | Siapkan untuk menjalankan console command |
| `assertExitCode(0)` | Pastikan exit code tertentu |
| `assertSuccessful()` | Pastikan exit code 0 |
| `assertFailed()` | Pastikan exit code bukan 0 |
| `assertNotExitCode(1)` | Pastikan BUKAN exit code tertentu |

### 16. 🎤 Input/Output Testing
| Metode | Fungsi |
|--------|--------|
| `expectsQuestion('Q?', 'A')` | Simulasikan jawaban untuk pertanyaan |
| `expectsOutput('text')` | Pastikan output tertentu muncul |
| `doesntExpectOutput('text')` | Pastikan output TIDAK muncul |
| `expectsOutputToContain('text')` | Pastikan output mengandung teks |
| `expectsConfirmation('Q?', 'yes')` | Simulasikan jawaban konfirmasi |

### 17. 🔍 Fitur Lanjutan
| Metode | Fungsi |
|--------|--------|
| `expectsSearch(...)` | Simulasikan pencarian (Laravel Prompts) |
| `expectsTable([...], [...])` | Pastikan output tabel sesuai |
| `WithConsoleEvents` | Mengaktifkan event testing |
| `expectsChoice('Q?', 'option')` | Simulasikan pilihan dari daftar |

### 18. 🚀 Best Practice Patterns
| Pattern | Contoh |
|--------|--------|
| Test Skenario Sukses | `->assertSuccessful()` |
| Test Skenario Gagal | `->assertFailed()` |
| Test Input Interaktif | `->expectsQuestion(...)` |
| Test Output Tertentu | `->expectsOutput(...)` |
| Test Validasi Error | `->expectsOutput('Error')->assertExitCode(1)` |

---

## Bagian 10: Kesimpulan 🎯

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Console Tests, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Ingat, Console Tests adalah alat yang sangat penting untuk memastikan custom console commands-mu bekerja dengan baik dan tidak menyebabkan masalah di lingkungan produksi. Menguasainya berarti kamu bisa membuat aplikasi yang lebih andal dan teruji dengan percaya diri.

Jangan pernah berhenti belajar dan mencoba. Dengan Console Tests, kamu bisa membuat command-line tools yang kuat dan andal. Selamat ngoding, murid kesayanganku!

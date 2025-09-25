# 🌐 Browser Testing dengan Laravel Dusk: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Di dunia pengembangan web, ada saatnya kamu harus memastikan aplikasimu bekerja **sempurna** seperti yang dilihat oleh pengguna sungguhan. Bayangkan kamu adalah seorang manajer restoran, dan kamu ingin memastikan bahwa **setiap pelanggan** bisa memesan makanan dengan mudah, dari awal hingga akhir, di **browser mereka sendiri**. Tidak ada yang boleh "error" atau "aneh". Itulah **Browser Testing** - kamu menguji aplikasimu seolah-olah kamu benar-benar duduk di meja pelanggan, menekan tombol, mengisi form, dan menonton animasi. **Laravel Dusk** adalah juru masak canggih yang bisa meniru semua gerakan pelanggan itu secara otomatis! 

Siap belajar bagaimana menjadi "manajer kualitas restoran digital" yang hebat? Ayo kita mulai petualangan ini!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Browser Testing & Laravel Dusk Itu Sebenarnya?

**Analogi:** Bayangkan kamu adalah **inspektur kualitas restoran**. Kamu tidak hanya melihat resepnya (unit test), tapi kamu **benar-benar masuk ke restoran itu**, memesan makanan, mengisi formulir, menekan tombol, dan mengamati apakah semuanya berjalan lancar **seperti yang akan dilakukan pelanggan sungguhan**. Laravel Dusk adalah **robot pelayan otomatis** yang bisa meniru semua tindakan itu berulang-ulang untukmu, dan melaporkan jika sesuatu tidak berjalan seperti yang seharusnya.

**Mengapa ini penting?** Karena:
1.  **Kamu bisa menguji pengalaman nyata pengguna** (end-to-end).
2.  **Kamu bisa menguji interaksi JavaScript** yang kompleks.
3.  **Kamu bisa memastikan form dan autentikasi bekerja** dengan benar.
4.  **Kamu bisa tangkap bug yang mungkin terlewat oleh unit test**.

**Bagaimana cara kerjanya?** Secara umum, alurnya seperti ini:
`➡️ Test Dusk Ditulis -> 🤖 Dusk Buka Browser (Chrome) -> 👆 Dusk Lakukan Interaksi -> ✅ Dusk Cek Hasil -> 📊 Laporan (Pass/Fail)`

Tanpa Browser Testing, kamu mungkin merilis fitur yang terlihat bagus di kodingan, tapi ternyata tidak bisa digunakan oleh pengguna sungguhan karena error di sisi browser!

### 2. ✍️ Resep Pertamamu: Setup Dusk dari Nol

Ini adalah fondasi paling dasar. Mari kita setup Laravel Dusk dari nol, langkah demi langkah.

#### Langkah 1️⃣: Install Google Chrome & Package Dusk
**Mengapa?** Dusk menggunakan ChromeDriver untuk mengendalikan browser Chrome.

**Bagaimana?** Pastikan kamu punya Chrome dan install package Dusk.
```bash
composer require laravel/dusk --dev
```

#### Langkah 2️⃣: Setup Awal Dusk
**Mengapa?** Untuk membuat struktur test dan install ChromeDriver.

**Bagaimana?** Jalankan Artisan command.
```bash
php artisan dusk:install
```
**Penjelasan Kode:**
- Command ini membuat folder `tests/Browser/` untuk test-test Dusk.
- Menginstall binary ChromeDriver ke `vendor/laravel/dusk/bin/` (ini yang mengendalikan Chrome).
- Membuat contoh test dasar.

#### Langkah 3️⃣: Atur Environment (APP_URL)
**Mengapa?** Karena Dusk harus tahu alamat aplikasimu untuk mengujinya.

**Bagaimana?** Pastikan `APP_URL` di `.env` benar.
```bash
APP_URL=http://localhost:8000
```
Jika kamu akan jalankan `php artisan serve` di port 8000, ini adalah nilai yang benar.

#### Langkah 4️⃣: Generate Test Pertamamu
**Mengapa?** Supaya kamu punya file kosong untuk menulis test Dusk-mu.

**Bagaimana?** Gunakan Artisan command.
```bash
php artisan dusk:make LoginTest
```
File test akan dibuat di `tests/Browser/LoginTest.php`.

Selesai! 🎉 Sekarang kamu telah berhasil menyiapkan Laravel Dusk dan siap menulis test pertamamu!

### 3. ⚡ Perbedaan Dusk vs Unit Test vs Feature Test

**Analogi:** Jika unit test adalah memeriksa bahan-bahan masakan satu per satu, dan feature test adalah melihat apakah tombol di dapur bisa ditekan, maka **browser test (dengan Dusk)** adalah memeriksa apakah hidangan yang disajikan ke pelanggan benar-benar bisa dimakan dan enak!

**Mengapa ini penting?** Karena kamu harus tahu kapan harus pakai yang mana.

**Perbedaannya:**
*   **Unit Test**: Menguji fungsi/kelas secara individual (sangat cepat, tidak butuh database).
*   **Feature Test**: Menguji request HTTP ke aplikasi (lebih lambat, bisa pakai database, tidak render frontend).
*   **Browser Test (Dusk)**: Menguji aplikasi **dalam browser nyata** (paling lambat, menguji frontend dan interaksi pengguna sesungguhnya).

Contoh:
```php
// Unit Test - Test fungsi sederhana
public function test_addition()
{
    $this->assertEquals(4, 2 + 2);
}

// Feature Test - Test endpoint API
public function test_user_can_login()
{
    $response = $this->post('/login', ['email' => 'test@test.com', 'password' => 'pass']);
    $response->assertStatus(200);
}

// Browser Test (Dusk) - Test proses login di halaman browser
test('user can login via browser', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit('/login')
                ->type('email', 'test@test.com')
                ->type('password', 'pass')
                ->click('Login')
                ->assertPathIs('/dashboard'); // Pastikan halaman berubah
    });
});
```

---

## Bagian 2: Interaksi Dasar dengan Browser 🤖

### 4. 🌐 Memulai Test Dusk Sederhana

**Analogi:** Ini seperti kamu mengajari robot pelayan pertamamu cara membuka pintu restoran (mengunjungi halaman). Hanya langkah dasar untuk memulai.

**Mengapa ini penting?** Karena semua test Dusk dimulai dengan membuka halaman dan melakukan interaksi.

**Bagaimana?** Gunakan `browse()` dan method-method browser.

**Contoh Lengkap:**
```php
<?php
// tests/Browser/LoginTest.php
namespace Tests\Browser;

use Laravel\Dusk\Browser;

test('user can visit homepage', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit('/') // Kunjungi halaman utama
                ->assertSee('Welcome'); // Pastikan teks "Welcome" muncul
    });
});
```

### 5. 🛠️ Interaksi Umum: Type, Click, Select

**Analogi:** Jika sebelumnya kamu hanya mengajari robot cara membuka pintu, sekarang kamu ajarkan cara **mengisi formulir pesanan** (type), **menekan tombol** (click), dan **memilih ukuran makanan** (select).

**Mengapa ini penting?** Karena ini adalah interaksi dasar yang sering dilakukan pengguna.

**Bagaimana?** Gunakan method `type`, `click`, `press`, `select`, dll.

**Contoh Lengkap:**
```php
<?php
// tests/Browser/LoginTest.php
namespace Tests\Browser;

use App\Models\User;
use Laravel\Dusk\Browser;

test('user can login', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    $this->browse(function (Browser $browser) use ($user) {
        $browser->visit('/login') // Kunjungi halaman login
                ->type('email', $user->email) // Isi email
                ->type('password', 'password') // Isi password
                ->press('Login') // Klik tombol login
                ->assertPathIs('/dashboard'); // Pastikan diarahkan ke dashboard
    });
});
```

**Penjelasan Method:**
*   `visit('/')`: Buka halaman dengan path tertentu.
*   `type('email', 'value')`: Isi input field dengan name/email dengan value tertentu.
*   `press('Login')`: Klik tombol dengan teks tertentu (bisa juga pakai selector CSS).
*   `assertPathIs('/dashboard')`: Aserikan bahwa URL path sekarang adalah `/dashboard`.

### 6. 🏷️ Aserisi (Assertions) Dasar

**Analogi:** Ini seperti menanyakan ke robot, "Apakah pelanggan benar-benar melihat menu yang kamu sajikan?" atau "Apakah pelanggan sekarang berada di ruang makan?" Aserisi adalah cara untuk **mengonfirmasi** bahwa sesuatu benar-benar terjadi seperti yang diharapkan.

**Mengapa ini penting?** Karena tanpa aserisi, test hanya "berjalan", tapi kamu tidak tahu apakah itu berhasil atau tidak.

**Bagaimana?** Gunakan method `assert...`.

**Contoh Lengkap:**
```php
test('form validation works', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit('/register')
                ->press('Register') // Submit form kosong
                ->assertSee('The name field is required'); // Harus muncul error
    });
});
```

**Aserisi Umum:**
*   `assertSee('text')`: Pastikan teks muncul di halaman.
*   `assertSeeIn('.selector', 'text')`: Pastikan teks muncul dalam elemen tertentu.
*   `assertPathIs('/path')`: Pastikan path URL sekarang adalah path tertentu.
*   `assertTitle('title')`: Pastikan title halaman benar.
*   `assertVisible('.selector')`: Pastikan elemen tertentu terlihat.
*   `assertPresent('.selector')`: Pastikan elemen tertentu ada di DOM (bisa saja tidak terlihat).
*   `assertMissing('.selector')`: Pastikan elemen tertentu tidak ada di halaman.
*   `assertInputValue('field', 'value')`: Pastikan input field memiliki value tertentu.
*   `assertChecked('field')`: Pastikan checkbox tertentu dicentang.
*   `assertSelected('field', 'value')`: Pastikan item di dropdown dipilih.

---

## Bagian 3: Jurus Tingkat Lanjut - Interaksi Kompleks dengan JavaScript & Async 🚀

### 7. ⚡ Menunggu Elemen (Waiting) - Taktik Sabar

**Analogi:** Bayangkan robot pelayanmu mengirim pesanan ke dapur, tapi dia langsung pergi sebelum pesanan siap. Dia harus **menunggu** sebentar sampai makanan datang. Di dunia browser, seringkali kamu harus **menunggu** elemen muncul atau data selesai dimuat sebelum bisa berinteraksi dengannya.

**Mengapa ini penting?** Karena aplikasi modern sering menggunakan JavaScript untuk memuat data secara async (tidak langsung). Jika tidak menunggu, test bisa gagal karena mencoba berinteraksi dengan elemen yang belum siap.

**Bagaimana?** Gunakan method `waitFor...`.

**Contoh Lengkap:**
```php
test('async data loads', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit('/products')
                ->click('@load-more') // Klik tombol untuk memuat lebih banyak
                ->waitFor('.product-item', 5) // Tunggu maksimal 5 detik, sampai .product-item muncul
                ->assertSee('New Product Name'); // Pastikan produk baru muncul
    });
});
```

**Method Tunggu Umum:**
*   `waitFor('.selector')`: Tunggu elemen muncul.
*   `waitForText('some text')`: Tunggu teks muncul di halaman.
*   `waitForTextIn('.selector', 'text')`: Tunggu teks muncul dalam elemen tertentu.
*   `waitForLocation('/path')`: Tunggu URL berubah ke path tertentu.
*   `pause(milliseconds)`: Tunggu sejenak (tidak direkomendasikan, lebih baik `waitFor`).
*   `waitUntil('javascript expression')`: Tunggu JavaScript expression benar.

### 8. 🧭 Menguji Interaksi JavaScript

**Analogi:** Banyak restoran modern punya menu digital interaktif. Robot pelayanmu harus bisa **mengklik tab**, **membuka dropdown**, atau **mengisi form yang muncul setelah klik**. Ini adalah interaksi JavaScript!

**Mengapa ini penting?** Karena sebagian besar aplikasi web modern sangat bergantung pada JavaScript.

**Bagaimana?** Dusk bisa menangani sebagian besar interaksi JS secara otomatis. Untuk yang kompleks, kamu bisa pakai `script` atau `executeAsyncScript`.

**Contoh Lengkap:**
```php
test('javascript dropdown works', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit('/profile')
                ->click('#settings-menu') // Klik tombol yang buka dropdown JS
                ->waitFor('#settings-dropdown') // Tunggu dropdown muncul
                ->click('#logout-button') // Klik tombol logout di dropdown
                ->assertPathIs('/login'); // Pastikan diarahkan ke login
    });
});
```

### 9. 🖱️ Interaksi Mouse & Keyboard

**Analogi:** Robot pelayan harus bisa tidak hanya menekan tombol, tapi juga **menggeser**, **meng-klik kanan**, atau bahkan **mengetik di keyboard** untuk menavigasi aplikasi.

**Mengapa ini penting?** Karena beberapa fitur mungkin tergantung pada interaksi mouse/keyboard yang spesifik.

**Bagaimana?** Gunakan method seperti `click`, `doubleClick`, `rightClick`, `keys`.

**Contoh Lengkap:**
```php
test('keyboard shortcut works', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit('/app')
                ->keys('.app-container', ['{command}', 'k']) // Tekan Cmd+K (macOS) / Ctrl+K (Win)
                ->waitFor('.command-palette') // Tunggu command palette muncul
                ->assertVisible('.command-palette');
    });
});
```

---

## Bagian 4: Organisasi & Peningkatan Kode dengan Page Objects & Components 🧰

### 10. 📄 Page Objects - Pelayan Profesional dengan Buku Panduan

**Analogi:** Bayangkan kamu punya banyak robot pelayan, dan kamu tidak ingin mengulang instruksi "buka halaman login, isi email, isi password, klik login" di setiap test. Kamu buat **buku panduan khusus untuk halaman login** yang berisi semua instruksi itu. Inilah **Page Object**!

**Mengapa ini penting?** Karena membuat test menjadi lebih rapi, mudah dibaca, dan gampang dipelihara. Jika layout login berubah, kamu hanya perlu ubah satu file Page Object, bukan semua test.

**Bagaimana?** Buat class Page yang menggambarkan satu halaman.

**1. Buat Page Object:**
```bash
php artisan dusk:page LoginPage
```

**2. Isi Page Object (contoh):**
```php
<?php
// tests/Browser/Pages/LoginPage.php
namespace Tests\Browser\Pages;

use Laravel\Dusk\Page;

class LoginPage extends Page
{
    public function url(): string
    {
        return '/login'; // Alamat halaman
    }

    public function assert($browser): void
    {
        $browser->assertPathIs($this->url()); // Pastikan di halaman yang benar
    }

    public function elements(): array
    {
        return [
            '@email' => 'input[name=email]', // Alias untuk selector
            '@password' => 'input[name=password]',
            '@login-button' => 'button[type=submit]',
        ];
    }

    // Method untuk melakukan login di halaman ini
    public function login($browser, $email, $password): void
    {
        $browser->type('@email', $email)
                ->type('@password', $password)
                ->click('@login-button');
    }
}
```

**3. Gunakan di Test:**
```php
test('user can login via page object', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new LoginPage()) // Kunjungi halaman login
                ->login('test@example.com', 'password') // Gunakan method login dari page object
                ->assertPathIs('/dashboard');
    });
});
```

### 11. 🧩 Components - Modul UI yang Dapat Digunakan Ulang

**Analogi:** Di restoranmu, kamu punya modul-menu yang sama di beberapa meja: sistem pemesanan minuman atau sistem rating. Alih-alih mengulang kode untuk modul itu di setiap halaman, kamu buat satu **komponen modul pemesanan minuman** dan gunakan ulang di mana pun.

**Mengapa ini penting?** Untuk menghindari duplikasi kode dan membuat test lebih modular untuk elemen UI yang digunakan di banyak tempat.

**Bagaimana?** Seperti Page Object, tapi untuk bagian UI kecil yang digunakan ulang.

**1. Buat Component:**
```bash
php artisan dusk:component StarRating
```

**2. Isi Component (contoh):**
```php
<?php
// tests/Browser/Components/StarRating.php
namespace Tests\Browser\Components;

use Laravel\Dusk\Component as BaseComponent;

class StarRating extends BaseComponent
{
    public function selector(): string
    {
        return '.star-rating'; // Root selector komponen
    }

    public function elements(): array
    {
        return [
            '@star' => 'span.star', // Selector untuk bintang-bintang
            '@rating-text' => '.rating-display',
        ];
    }

    // Method untuk memberikan rating, misalnya klik 4 bintang
    public function rate($browser, $stars): void
    {
        for ($i = 1; $i <= $stars; $i++) {
            $browser->click("@star:nth-child($i)"); // Klik bintang ke-i
        }
    }
}
```

**3. Gunakan di Test:**
```php
test('user can rate product', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit('/product/1')
                ->within(new StarRating, function ($browser) { // Gunakan komponen
                    $browser->rate(4); // Berikan rating 4 bintang
                })
                ->assertSee('You rated this 4 stars');
    });
});
```

### 12. 🔄 Mengelola Data Sesi Test (Database & Autentikasi)

**Analogi:** Bayangkan kamu harus setup meja makan dan peralatannya sebelum setiap uji coba, lalu bersihkan semua setelahnya agar tidak mengganggu uji coba berikutnya.

**Mengapa ini penting?** Karena test harus bersifat independen dan tidak saling mempengaruhi.

**Bagaimana?** Gunakan trait untuk mengelola database dan autentikasi.

#### A. Mengelola Database:
Karena test Dusk melibatkan HTTP request penuh, kamu tidak bisa pakai `RefreshDatabase`. Gunakan `DatabaseTruncation`.

```php
<?php
// tests/Browser/LoginTest.php
use Illuminate\Foundation\Testing\DatabaseTruncation;

uses(DatabaseTruncation::class); // Gunakan trait ini

test('user can login', function () {
    // Data akan di-truncate setelah test
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    $this->browse(function (Browser $browser) use ($user) {
        // ... test code
    });
});
```

#### B. Mengelola Autentikasi:
Alih-alih mengisi form login di setiap test, kamu bisa pakai `loginAs`.

```php
test('authenticated user access dashboard', function () {
    $user = User::factory()->create();

    $this->browse(function (Browser $browser) use ($user) {
        $browser->loginAs($user) // Login secara otomatis
                ->visit('/dashboard')
                ->assertSee('Welcome, ' . $user->name);
    });
});
```

---

## Bagian 5: Menjadi Master Browser Testing 🏆

### 13. ✨ Wejangan dari Guru

1.  **Gunakan Page Objects untuk Halaman Kompleks**: Ini membuat test jauh lebih mudah dibaca.
2.  **Gunakan Components untuk UI yang Digunakan Ulang**: Mencegah duplikasi kode.
3.  **Jangan Gunakan `pause()` Berlebihan**: Selalu coba `waitFor` terlebih dahulu.
4.  **Gunakan `@` Selector di Page Objects**: Buat selector lebih stabil dan mudah diganti.
5.  **Atur Environment Dengan Benar**: Jangan lupa `APP_URL` dan pastikan server aktif.
6.  **Gunakan DatabaseTruncation**: Untuk menjaga test tetap bersih dan independen.
7.  **Pertimbangkan Pest Browser Testing**: Laravel Dusk bagus, tapi Pest menawarkan pengalaman yang lebih modern dan cepat.

### 14. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk Laravel Dusk:

#### 📦 Instalasi & Setup
| Perintah | Fungsi |
|----------|--------|
| `composer require laravel/dusk --dev` | Install package Dusk |
| `php artisan dusk:install` | Setup awal (folder test, ChromeDriver) |
| `php artisan dusk:page Login` | Buat Page Object |
| `php artisan dusk:component DatePicker` | Buat Component |
| `php artisan dusk:chrome-driver` | Update ChromeDriver |

#### 🧪 Menulis & Menjalankan Test
| Perintah | Fungsi |
|----------|--------|
| `php artisan dusk` | Jalankan semua test Dusk |
| `php artisan dusk --filter=testName` | Jalankan test tertentu |
| `php artisan dusk:make LoginTest` | Buat test file baru |

#### 🌐 Interaksi Browser Umum
| Method | Fungsi |
|--------|--------|
| `visit('/path')` | Buka halaman |
| `type('selector', 'value')` | Isi input |
| `click('selector')` / `press('text')` | Klik elemen |
| `select('selector', 'value')` | Pilih dropdown option |
| `check('selector')` / `uncheck('selector')` | Centang/Hapus centang checkbox |
| `attach('selector', 'path')` | Upload file |
| `loginAs($user)` | Login tanpa form |
| `keys('selector', ['{shift}', 'a'])` | Interaksi keyboard kompleks |

#### ⏳ Menunggu & Scoping
| Method | Fungsi |
|--------|--------|
| `waitFor('.selector')` | Tunggu elemen muncul |
| `waitForText('text')` | Tunggu teks muncul |
| `pause(milliseconds)` | Tunggu sejenak (tidak direkomendasikan) |
| `with('.selector', fn)` | Scoping operasi dalam elemen tertentu |
| `elsewhere('.selector', fn)` | Eksekusi di luar scope saat ini |

#### ✅ Aserisi Umum
| Method | Fungsi |
|--------|--------|
| `assertSee('text')` | Pastikan teks muncul |
| `assertPathIs('/path')` | Pastikan URL path benar |
| `assertTitle('title')` | Pastikan title halaman benar |
| `assertVisible('.selector')` | Pastikan elemen terlihat |
| `assertPresent('.selector')` | Pastikan elemen ada di DOM |
| `assertMissing('.selector')` | Pastikan elemen tidak ada |
| `assertInputValue('field', 'value')` | Pastikan input value benar |
| `assertChecked('field')` | Pastikan checkbox dicentang |
| `assertSelected('field', 'value')` | Pastikan dropdown option dipilih |
| `assertAuthenticated()` | Pastikan user login |
| `assertGuest()` | Pastikan user tidak login |

#### 🧰 Page Objects & Components
| Method | Tempat | Fungsi |
|--------|--------|--------|
| `url()` | Page | Tentukan path halaman |
| `assert()` | Page/Component | Aserisi untuk halaman/komponen |
| `elements()` | Page/Component | Daftar alias selector |
| `visit(new Page())` | Test | Kunjungi halaman via object |
| `within(new Component(), fn)` | Test | Gunakan komponen |

#### 🔄 Database & Auth Traits
| Trait | Fungsi |
|--------|--------|
| `DatabaseTruncation::class` | Truncate tabel setelah test |
| `loginAs($user)` | Login user secara otomatis |

### 15. 🎯 Kesimpulan

Luar biasa! 🌟 Kamu sudah menyelesaikan seluruh materi Browser Testing dengan Laravel Dusk, dari yang paling dasar sampai yang paling rumit. Sekarang kamu tahu bagaimana menguji aplikasimu secara end-to-end di browser nyata, bagaimana mengotomatiskan interaksi pengguna, dan bagaimana menyusun test-test kompleks dengan rapi menggunakan Page Objects dan Components. Kamu bisa menjadi "manajer kualitas restoran digital" yang hebat! Browser Testing adalah alat penting untuk memastikan aplikasimu siap disajikan ke pengguna nyata.

Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku!
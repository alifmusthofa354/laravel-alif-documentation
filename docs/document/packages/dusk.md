# 🌐 Laravel Dusk

Laravel Dusk menyediakan API otomatisasi dan pengujian browser yang ekspresif dan mudah digunakan. Secara default, Dusk tidak memerlukan instalasi JDK atau Selenium di komputer lokal Anda. Sebagai gantinya, Dusk menggunakan instalasi ChromeDriver yang mandiri. Namun, Anda bebas menggunakan driver yang kompatibel dengan Selenium yang Anda inginkan.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [Menulis Test](#menulis-test)
5. [Browser Basics](#browser-basics)
6. [Interaksi dengan Elemen](#interaksi-dengan-elemen)
7. [Tunggu Elemen](#tunggu-elemen)
8. [Assertions](#assertions)
9. [Halaman](#halaman)
10. [Komponen](#komponen)
11. [Continuous Integration](#continuous-integration)

## 🎯 Pendahuluan

Laravel Dusk adalah alat pengujian browser resmi untuk Laravel. Dusk tidak memerlukan Anda untuk menginstal Java JDK atau Selenium pada mesin lokal Anda. Namun, Dusk memerlukan Google Chrome dan ChromeDriver.

### ✨ Fitur Utama
- Pengujian browser end-to-end sederhana
- API otomatisasi browser yang ekspresif
- Tidak memerlukan Java atau Selenium
- Integrasi dengan PHPUnit
- Dukungan untuk multiple browser
- Screenshot ketika test gagal

## 📦 Instalasi

### 🎯 Menginstal Dusk
Untuk memulai, instal Dusk melalui Composer:

```bash
composer require --dev laravel/dusk
```

### 🛠️ Setup Dusk
Setelah menginstal Dusk, jalankan perintah artisan `dusk:install`:

```bash
php artisan dusk:install
```

Perintah ini akan membuat direktori `tests/Browser` dan contoh test Dusk.

### 🔧 Konfigurasi Environment
Pastikan Anda mengatur variabel `APP_URL` dalam file `.env` Anda. Nilai ini harus cocok dengan URL yang Anda gunakan untuk mengakses aplikasi Anda di browser.

```env
APP_URL=http://localhost:8000
```

## ⚙️ Konfigurasi

### 🔧 Chrome Driver
Perintah `dusk:install` juga akan mengunduh ChromeDriver yang kompatibel dengan sistem operasi Anda ke direktori `vendor/laravel/dusk/bin/`.

### 🔄 Mengelola Chrome Driver
Untuk menginstal versi ChromeDriver yang berbeda:

```bash
php artisan dusk:chrome-driver 86
```

Untuk menginstal ChromeDriver yang sesuai dengan versi Chrome Anda:

```bash
php artisan dusk:chrome-driver --detect
```

### 🔐 Service Provider
Secara default, Dusk secara otomatis mendaftarkan service provider-nya ketika aplikasi berada dalam environment `local` atau `testing`. Jika tidak, Anda perlu mendaftarkannya secara manual dalam file `AppServiceProvider` Anda:

```php
use Laravel\Dusk\DuskServiceProvider;

/**
 * Register any application services.
 */
public function register(): void
{
    if ($this->app->environment('local', 'testing')) {
        $this->app->register(DuskServiceProvider::class);
    }
}
```

## 🧪 Menulis Test

### 🆕 Membuat Test
Untuk membuat test Dusk, gunakan perintah artisan `dusk:make`:

```bash
php artisan dusk:make LoginTest
```

Test yang dihasilkan akan ditempatkan dalam direktori `tests/Browser`.

### 🎯 Struktur Test Dasar
```php
<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class LoginTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * A basic browser test example.
     */
    public function test_basic_example(): void
    {
        $user = User::factory()->create([
            'email' => 'taylor@laravel.com',
        ]);

        $this->browse(function (Browser $browser) use ($user) {
            $browser->visit('/login')
                    ->type('email', $user->email)
                    ->type('password', 'password')
                    ->press('Login')
                    ->assertPathIs('/home');
        });
    }
}
```

## 🌐 Browser Basics

### 🚀 Membuat Browser Instance
Metode `browse` menerima sebuah callback. Instance browser akan secara otomatis diteruskan ke callback ini:

```php
$this->browse(function (Browser $browser) {
    $browser->visit('/login')
            ->type('email', 'user@example.com')
            ->type('password', 'secret')
            ->press('Login')
            ->assertPathIs('/home');
});
```

### 👥 Multiple Browser
Kadang-kadang Anda mungkin perlu multiple browser untuk menguji aplikasi Anda dengan benar:

```php
$this->browse(function (Browser $first, Browser $second) {
    $first->loginAs(User::find(1))
          ->visit('/home')
          ->waitForText('Message');

    $second->loginAs(User::find(2))
           ->visit('/home')
           ->waitForText('Message')
           ->type('message', 'Hey Taylor')
           ->press('Send');

    $first->waitForText('Hey Taylor')
          ->assertSee('Jeffrey Way');
});
```

### 🧭 Navigasi
```php
// Mengunjungi halaman
$browser->visit('/home');

// Mengunjungi route bernama
$browser->visitRoute('home');

// Navigasi mundur
$browser->back();

// Navigasi maju
$browser->forward();

// Refresh halaman
$browser->refresh();
```

## 🖱️ Interaksi dengan Elemen

### ⌨️ Typing Values
```php
// Typing text
$browser->type('email', 'user@example.com');

// Typing tanpa menghapus konten yang ada
$browser->append('tags', 'foo');

// Menghapus nilai
$browser->clear('email');

// Typing dengan kecepatan lambat
$browser->typeSlowly('email', 'user@example.com');
```

### 🔽 Dropdowns
```php
// Memilih opsi
$browser->select('size', 'Large');

// Memilih opsi multiple
$browser->select('categories', ['Art', 'Music']);
```

### ✅ Checkboxes
```php
// Mencentang checkbox
$browser->check('terms');

// Menghapus centang checkbox
$browser->uncheck('terms');
```

### 🔘 Radio Buttons
```php
// Memilih radio button
$browser->radio('size', 'large');
```

### 📎 File Attachments
```php
// Mengunggah file
$browser->attach('photo', __DIR__.'/photos/mountains.png');
```

### 🖱️ Mouse Clicks
```php
// Klik tombol
$browser->click('#selector');

// Klik link
$browser->clickLink('Link Text');

// Double click
$browser->doubleClick('#selector');

// Right click
$browser->rightClick('#selector');
```

### ⌨️ Keyboard Interactions
```php
// Menggunakan tombol keyboard
$browser->keys('selector', ['{shift}', 'taylor'], 'swift');

// Keyboard shortcuts
$browser->keys('.app', ['{command}', 'j']);
```

## ⏳ Tunggu Elemen

### ⏱️ Waiting
```php
// Menunggu beberapa detik
$browser->pause(1000);

// Menunggu selector muncul
$browser->waitFor('.selector');

// Menunggu selector mengandung text
$browser->waitForTextIn('.selector', 'Hello World');

// Menunggu text muncul
$browser->waitForText('Hello World');

// Menunggu link muncul
$browser->waitForLink('Create');
```

### 🔁 Scoping Selectors When Available
```php
$browser->whenAvailable('.modal', function (Browser $modal) {
    $modal->assertSee('Hello World')
          ->press('OK');
});
```

## ✅ Assertions

### 📰 Text Assertions
```php
// Memastikan text ada
$browser->assertSee('Hello World');

// Memastikan text tidak ada
$browser->assertDontSee('Hello World');

// Memastikan text ada dalam selector
$browser->assertSeeIn('.selector', 'Hello World');
```

### 🏷️ Title and URL Assertions
```php
// Memastikan title
$browser->assertTitle('Home Page');

// Memastikan URL
$browser->assertUrlIs('http://example.com/home');

// Memastikan path
$browser->assertPathIs('/home');
```

### 📥 Form Assertions
```php
// Memastikan nilai input
$browser->assertInputValue('email', 'user@example.com');

// Memastikan checkbox dicentang
$browser->assertChecked('terms');

// Memastikan radio dipilih
$browser->assertRadioSelected('size', 'large');
```

### 👁️ Visibility Assertions
```php
// Memastikan elemen terlihat
$browser->assertVisible('.selector');

// Memastikan elemen ada di DOM
$browser->assertPresent('.selector');

// Memastikan elemen tidak terlihat
$browser->assertMissing('.selector');
```

### 🔐 Authentication Assertions
```php
// Memastikan user terautentikasi
$browser->assertAuthenticated();

// Memastikan user adalah guest
$browser->assertGuest();

// Memastikan user terautentikasi sebagai user tertentu
$browser->assertAuthenticatedAs($user);
```

## 📄 Halaman

### 🏗️ Membuat Page Object
Page objects memungkinkan Anda mendefinisikan metode aksi ekspresif yang dapat dilakukan pada halaman tertentu:

```bash
php artisan dusk:page Login
```

### 📋 Contoh Page Object
```php
<?php

namespace Tests\Browser\Pages;

use Laravel\Dusk\Browser;
use Laravel\Dusk\Page;

class Login extends Page
{
    /**
     * Get the URL for the page.
     */
    public function url(): string
    {
        return '/login';
    }

    /**
     * Assert that the browser is on the page.
     */
    public function assert(Browser $browser): void
    {
        $browser->assertPathIs($this->url());
    }

    /**
     * Get the element shortcuts for the page.
     */
    public function elements(): array
    {
        return [
            '@email' => 'input[name=email]',
            '@password' => 'input[name=password]',
            '@login' => 'button[type=submit]',
        ];
    }

    /**
     * Log into the application.
     */
    public function login(Browser $browser, $email, $password): void
    {
        $browser->type('@email', $email)
                ->type('@password', $password)
                ->press('@login');
    }
}
```

### 🚀 Menggunakan Page Object
```php
use Tests\Browser\Pages\Login;

$browser->visit(new Login)
        ->login('user@example.com', 'secret')
        ->assertPathIs('/home');
```

## 🧩 Komponen

### 🏗️ Membuat Komponen
Komponen mirip dengan "page objects", tetapi dimaksudkan untuk bagian UI dan fungsionalitas yang digunakan kembali:

```bash
php artisan dusk:component DatePicker
```

### 📋 Contoh Komponen
```php
<?php

namespace Tests\Browser\Components;

use Laravel\Dusk\Browser;
use Laravel\Dusk\Component as BaseComponent;

class DatePicker extends BaseComponent
{
    /**
     * Get the root selector for the component.
     */
    public function selector(): string
    {
        return '.date-picker';
    }

    /**
     * Assert that the browser page contains the component.
     */
    public function assert(Browser $browser): void
    {
        $browser->assertVisible($this->selector());
    }

    /**
     * Get the element shortcuts for the component.
     */
    public function elements(): array
    {
        return [
            '@date-field' => 'input.datepicker-input',
            '@year-list' => 'div > div.datepicker-years',
            '@month-list' => 'div > div.datepicker-months',
            '@day-list' => 'div > div.datepicker-days',
        ];
    }

    /**
     * Select the given date.
     */
    public function selectDate(Browser $browser, int $year, int $month, int $day): void
    {
        $browser->click('@date-field')
                ->within('@year-list', function (Browser $browser) use ($year) {
                    $browser->click($year);
                })
                ->within('@month-list', function (Browser $browser) use ($month) {
                    $browser->click($month);
                })
                ->within('@day-list', function (Browser $browser) use ($day) {
                    $browser->click($day);
                });
    }
}
```

### 🚀 Menggunakan Komponen
```php
$browser->visit('/')
        ->within(new DatePicker, function (Browser $browser) {
            $browser->selectDate(2019, 1, 30);
        })
        ->assertSee('January');
```

## 🔄 Continuous Integration

### 🐙 GitHub Actions
```yaml
name: CI
on: [push]
jobs:
  dusk-php:
    runs-on: ubuntu-latest
    env:
      APP_URL: "http://127.0.0.1:8000"
    steps:
      - uses: actions/checkout@v3
      - name: Prepare The Environment
        run: cp .env.example .env
      - name: Install Composer Dependencies
        run: composer install --no-progress --prefer-dist --optimize-autoloader
      - name: Generate Application Key
        run: php artisan key:generate
      - name: Upgrade Chrome Driver
        run: php artisan dusk:chrome-driver --detect
      - name: Start Chrome Driver
        run: ./vendor/laravel/dusk/bin/chromedriver-linux --port=9515 &
      - name: Run Laravel Server
        run: php artisan serve --no-reload &
      - name: Run Dusk Tests
        run: php artisan dusk
```

### 🟦 Travis CI
```yaml
language: php

php:
  - 8.1

addons:
  chrome: stable

install:
  - cp .env.testing .env
  - travis_retry composer install --no-interaction --prefer-dist
  - php artisan key:generate
  - php artisan dusk:chrome-driver

before_script:
  - google-chrome-stable --headless --disable-gpu --remote-debugging-port=9222 http://localhost &
  - php artisan serve --no-reload &

script:
  - php artisan dusk
```

## 🧠 Kesimpulan

Laravel Dusk menyediakan cara yang kuat dan ekspresif untuk melakukan pengujian browser end-to-end untuk aplikasi Laravel Anda. Dengan fitur-fiturnya yang lengkap, Anda dapat memastikan bahwa aplikasi Anda berfungsi dengan benar di lingkungan browser nyata.

### 🔑 Keuntungan Utama
- Pengujian browser real tanpa Java atau Selenium
- API yang ekspresif dan mudah digunakan
- Dukungan untuk multiple browser
- Integrasi dengan PHPUnit
- Screenshot otomatis ketika test gagal
- Page objects dan komponen untuk organisasi kode
- Kompatibel dengan CI/CD

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Dusk untuk menguji aplikasi web Anda secara menyeluruh.
# 🌐 Browser Testing dengan Laravel Dusk

Dokumentasi ini menjelaskan cara melakukan browser testing di Laravel menggunakan Dusk, termasuk pengujian interaksi pengguna, form, JavaScript, dan skenario kompleks di browser.

## 🚀 Pendahuluan

Laravel Dusk menyediakan API otomatisasi dan pengujian browser yang ekspresif dan mudah digunakan. Secara default, Dusk tidak memerlukan instalasi JDK atau Selenium di komputer lokal Anda. Sebagai gantinya, Dusk menggunakan instalasi ChromeDriver yang mandiri.

### ✨ Fitur Utama Dusk
- ✅ Pengujian browser end-to-end
- ✅ Interaksi dengan JavaScript
- ✅ Otomatisasi form dan autentikasi
- ✅ Screenshot dan debugging
- ✅ Page Objects untuk organisasi kode

### 🆕 Rekomendasi Terbaru
Pest 4 sekarang menyertakan pengujian browser otomatis yang menawarkan peningkatan kinerja dan kegunaan yang signifikan dibandingkan Laravel Dusk. Untuk proyek baru, kami merekomendasikan menggunakan Pest untuk pengujian browser.

Namun, dokumentasi ini akan membahas Laravel Dusk secara komprehensif untuk proyek yang sudah ada atau yang memiliki kebutuhan spesifik.

## ⚙️ Instalasi dan Konfigurasi Dusk

### 📦 Instalasi Dasar
Untuk memulai, instal Google Chrome dan tambahkan dependensi Composer laravel/dusk ke proyek Anda:

```bash
composer require laravel/dusk --dev
```

⚠️ **Peringatan Keamanan**: Jika Anda secara manual mendaftarkan service provider Dusk, jangan pernah mendaftarkannya di lingkungan produksi, karena hal ini bisa menyebabkan pengguna sembarang dapat mengautentikasi dengan aplikasi Anda.

### 🛠️ Setup Awal
Setelah menginstal paket Dusk, jalankan perintah Artisan dusk:install:

```bash
php artisan dusk:install
```

Perintah ini akan membuat:
- Direktori `tests/Browser`
- Contoh test Dusk
- Menginstal biner Chrome Driver untuk sistem operasi Anda

### ⚙️ Konfigurasi Environment
Setel variabel `APP_URL` di file `.env` aplikasi Anda. Nilai ini harus sesuai dengan URL yang Anda gunakan untuk mengakses aplikasi Anda di browser.

```bash
APP_URL=http://localhost:8000
```

### 🔄 Mengelola Instalasi ChromeDriver
Jika Anda ingin menginstal versi ChromeDriver yang berbeda dari yang diinstal oleh Laravel Dusk melalui perintah dusk:install, Anda dapat menggunakan perintah dusk:chrome-driver:

```bash
# Instal versi terbaru ChromeDriver untuk OS Anda
php artisan dusk:chrome-driver

# Instal versi tertentu ChromeDriver untuk OS Anda
php artisan dusk:chrome-driver 86

# Instal versi tertentu ChromeDriver untuk semua OS yang didukung
php artisan dusk:chrome-driver --all

# Instal versi ChromeDriver yang sesuai dengan versi Chrome/Chromium terdeteksi
php artisan dusk:chrome-driver --detect
```

Pastikan biner chromedriver dapat dieksekusi:
```bash
chmod -R 0755 vendor/laravel/dusk/bin/
```

## 🏗️ Membuat Browser Test

### 🆕 Generate Test
Untuk membuat test Dusk, gunakan perintah Artisan dusk:make:

```bash
php artisan dusk:make LoginTest
```

Test yang dihasilkan akan ditempatkan di direktori `tests/Browser`.

### 🗃️ Reset Database Setelah Setiap Test
Sebagian besar test yang Anda tulis akan berinteraksi dengan halaman yang mengambil data dari database aplikasi Anda. Namun, test Dusk Anda tidak boleh menggunakan trait `RefreshDatabase` karena menggunakan transaksi database yang tidak akan berlaku atau tersedia di seluruh permintaan HTTP.

#### 🔁 Menggunakan Database Truncation (Disarankan)
```php
<?php

use Illuminate\Foundation\Testing\DatabaseTruncation;
use Laravel\Dusk\Browser;

uses(DatabaseTruncation::class);

test('basic example', function () {
    $this->browse(function (Browser $browser) {
        // Test implementation
    });
});
```

## 🧭 Dasar-dasar Browser Testing

### 🌐 Membuat Browser Instance
Untuk memulai, mari kita tulis test yang memverifikasi kita dapat masuk ke aplikasi kita:

```php
<?php

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;

uses(DatabaseMigrations::class);

test('basic example', function () {
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
});
```

### 👥 Membuat Multiple Browsers
Terkadang Anda mungkin memerlukan beberapa browser untuk menguji skenario kompleks:

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
// Kunjungi URI tertentu
$browser->visit('/login');

// Kunjungi route bernama
$browser->visitRoute($routeName, $parameters);

// Navigasi maju dan mundur
$browser->back();
$browser->forward();

// Refresh halaman
$browser->refresh();
```

### 🖥️ Resizing Browser Windows
```php
// Atur ukuran window
$browser->resize(1920, 1080);

// Maksimalkan window
$browser->maximize();

// Sesuaikan dengan konten
$browser->fitContent();

// Pindahkan posisi window
$browser->move($x = 100, $y = 100);
```

### 🎯 Browser Macros
Untuk mendefinisikan metode browser kustom yang dapat digunakan kembali:

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Dusk\Browser;

class DuskServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Browser::macro('scrollToElement', function (string $element = null) {
            $this->script("$('html, body').animate({ scrollTop: $('$element').offset().top }, 0);");
            return $this;
        });
    }
}
```

Penggunaan:
```php
$this->browse(function (Browser $browser) use ($user) {
    $browser->visit('/pay')
            ->scrollToElement('#credit-card-details')
            ->assertSee('Enter Credit Card Details');
});
```

## 🔐 Menguji Form dan Autentikasi

### 🔑 Authentication
Gunakan metode `loginAs` untuk menghindari berinteraksi dengan layar login aplikasi Anda selama setiap test:

```php
use App\Models\User;
use Laravel\Dusk\Browser;

$this->browse(function (Browser $browser) {
    $browser->loginAs(User::find(1))
            ->visit('/home');
});
```

### 📝 Interacting With Forms
```php
// Typing values
$browser->type('email', 'taylor@laravel.com');

// Append text
$browser->type('tags', 'foo')
        ->append('tags', ', bar, baz');

// Clear value
$browser->clear('email');

// Type slowly
$browser->typeSlowly('mobile', '+1 (202) 555-5555');

// Dropdowns
$browser->select('size', 'Large');
$browser->select('categories', ['Art', 'Music']);

// Checkboxes
$browser->check('terms');
$browser->uncheck('terms');

// Radio buttons
$browser->radio('size', 'large');

// Attach files
$browser->attach('photo', __DIR__.'/photos/mountains.png');

// Press buttons
$browser->press('Login');
$browser->pressAndWaitFor('Save', 1);
```

### 🔗 Clicking Links
```php
// Click link
$browser->clickLink($linkText);

// Check if link visible
if ($browser->seeLink($linkText)) {
    // ...
}
```

## ⚡ Menguji Interaksi JavaScript

### ⌨️ Using the Keyboard
```php
// Complex input sequences
$browser->keys('selector', ['{shift}', 'taylor'], 'swift');

// Keyboard shortcuts
$browser->keys('.app', ['{command}', 'j']);

// Fluent keyboard interactions
use Laravel\Dusk\Keyboard;

$browser->withKeyboard(function (Keyboard $keyboard) {
    $keyboard->press('c')
             ->pause(1000)
             ->release('c')
             ->type(['c', 'e', 'o']);
});
```

### 🖱️ Using the Mouse
```php
// Clicking elements
$browser->click('.selector');
$browser->clickAtXPath('//div[@class="selector"]');
$browser->clickAtPoint($x = 0, $y = 0);
$browser->doubleClick();
$browser->rightClick();

// Mouseover
$browser->mouseover('.selector');

// Drag and drop
$browser->drag('.from-selector', '.to-selector');
$browser->dragLeft('.selector', $pixels = 10);
```

### 💬 JavaScript Dialogs
```php
// Wait for dialog
$browser->waitForDialog($seconds = null);

// Assert dialog opened
$browser->assertDialogOpened('Dialog message');

// Type in dialog prompt
$browser->typeInDialog('Hello World');

// Close dialogs
$browser->acceptDialog();
$browser->dismissDialog();
```

## 🧪 Menguji Skenario Kompleks

### ⏳ Waiting for Elements
```php
// Pause execution
$browser->pause(1000);

// Wait for selectors
$browser->waitFor('.selector');
$browser->waitFor('.selector', 1);
$browser->waitForTextIn('.selector', 'Hello World');

// Wait for text
$browser->waitForText('Hello World');

// Wait for links
$browser->waitForLink('Create');

// Wait for location
$browser->waitForLocation('/secret');
$browser->waitForRoute($routeName, $parameters);

// Wait with JavaScript expressions
$browser->waitUntil('App.data.servers.length > 0');
```

### 🔍 Scoping Selectors
```php
// Scope operations within selector
$browser->with('.table', function (Browser $table) {
    $table->assertSee('Hello World')
          ->clickLink('Delete');
});

// Execute assertions outside current scope
$browser->with('.table', function (Browser $table) {
    $browser->elsewhere('.page-title', function (Browser $title) {
        $title->assertSee('Hello World');
    });
});
```

## 📄 Menggunakan Page Objects

Page Objects memungkinkan Anda mendefinisikan tindakan ekspresif yang kemudian dapat dilakukan pada halaman tertentu melalui satu metode.

### 🏗️ Generating Pages
```bash
php artisan dusk:page Login
```

### ⚙️ Configuring Pages
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

### 🚀 Navigating to Pages
```php
use Tests\Browser\Pages\Login;

$browser->visit(new Login)
        ->login('taylor@laravel.com', 'secret');
```

## 🔄 CI/CD dengan Browser Tests

### ⚙️ Konfigurasi Umum
Sebagian besar konfigurasi CI Dusk mengharapkan aplikasi Laravel Anda dilayani menggunakan server pengembangan PHP bawaan di port 8000.

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

## ✅ Available Assertions

Dusk menyediakan berbagai asersi yang dapat Anda buat terhadap aplikasi Anda:

### 📰 Text Assertions
```php
$browser->assertSee($text);
$browser->assertDontSee($text);
$browser->assertSeeIn($selector, $text);
$browser->assertDontSeeIn($selector, $text);
```

### 🏷️ Title and URL Assertions
```php
$browser->assertTitle($title);
$browser->assertTitleContains($title);
$browser->assertUrlIs($url);
$browser->assertPathIs('/home');
$browser->assertPathIsNot('/home');
```

### 📥 Form Assertions
```php
$browser->assertInputValue($field, $value);
$browser->assertChecked($field);
$browser->assertNotChecked($field);
$browser->assertRadioSelected($field, $value);
$browser->assertSelected($field, $value);
```

### 👁️ Visibility Assertions
```php
$browser->assertVisible($selector);
$browser->assertPresent($selector);
$browser->assertMissing($selector);
```

### 🔐 Authentication Assertions
```php
$browser->assertAuthenticated();
$browser->assertGuest();
$browser->assertAuthenticatedAs($user);
```

### 🍪 Cookie Assertions
```php
$browser->assertHasCookie($name);
$browser->assertCookieValue($name, $value);
$browser->assertCookieMissing($name);
```

### 🧪 JavaScript Assertions
```php
$browser->assertScript('window.isLoaded');
$browser->assertDialogOpened($message);
```

## 🧩 Components

Components mirip dengan "page objects" Dusk, tetapi dimaksudkan untuk bagian UI dan fungsionalitas yang digunakan kembali di seluruh aplikasi Anda.

### 🏗️ Generating Components
```bash
php artisan dusk:component DatePicker
```

### 🧱 Component Example
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

### 🚀 Using Components
```php
$browser->visit('/')
        ->within(new DatePicker, function (Browser $browser) {
            $browser->selectDate(2019, 1, 30);
        })
        ->assertSee('January');
```

## 🎯 Kesimpulan

Browser testing dengan Laravel Dusk menyediakan cara yang kuat untuk menguji aplikasi web Anda secara end-to-end. Dengan fitur-fitur seperti:

### 🔑 Keuntungan Utama
- ✅ **Real Browser Testing**: Menggunakan Chrome nyata untuk pengujian akurat
- ✅ **Interaksi JavaScript**: Mendukung pengujian aplikasi SPA dan AJAX
- ✅ **Page Objects**: Organisasi kode yang baik untuk test yang kompleks
- ✅ **Components**: Reusability untuk UI elements yang umum
- ✅ **CI/CD Integration**: Mudah diintegrasikan dengan pipeline CI/CD
- ✅ **Screenshot Debugging**: Bantuan visual untuk debugging test yang gagal

### 🚀 Best Practices
1. **Gunakan Page Objects** untuk test yang kompleks
2. **Gunakan Components** untuk elemen UI yang digunakan berulang
3. **Gunakan Assertions yang tepat** untuk verifikasi yang akurat
4. **Gunakan Waiting Methods** untuk menangani async operations
5. **Gunakan Dusk Selectors** (@attribute) untuk seleksi yang stabil
6. **Jaga Test Database** tetap bersih dengan truncation

Dengan mengikuti panduan ini, Anda dapat membangun suite pengujian browser yang kuat dan dapat diandalkan untuk aplikasi Laravel Anda.
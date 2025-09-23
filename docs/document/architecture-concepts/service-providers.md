# 📦 Service Providers di Laravel

Laravel adalah framework yang sangat fleksibel dan kuat. Salah satu fitur utama yang membuat Laravel mudah dikembangkan dan dikelola adalah **Service Providers**. Pada dokumentasi ini, kita akan membahas konsep service providers dalam bahasa Indonesia, dilengkapi dengan narasi, contoh kode, dan ikon agar lebih ramah dibaca.

---

## 🚀 Pendahuluan

**Service Providers** adalah pusat dari seluruh proses _bootstrapping_ aplikasi Laravel.  
Baik aplikasi buatan kita maupun layanan inti Laravel dijalankan melalui service providers.  

👉 **Apa itu _bootstrapping_?**  
Secara umum, _bootstrapping_ berarti **mendaftarkan sesuatu**, misalnya:
- Service container bindings
- Event listeners
- Middleware
- Routes

Laravel menggunakan banyak service provider secara internal untuk menginisialisasi layanan seperti:
- 📧 Mailer  
- ⏳ Queue  
- 🗄️ Cache  
- Dan lainnya  

Beberapa service provider bersifat **deferred**, artinya mereka **hanya dimuat ketika benar-benar dibutuhkan**, sehingga performa aplikasi lebih optimal.  

📂 Semua service provider buatan kita akan didaftarkan pada file:  
`bootstrap/providers.php`

---

## ✍️ Menulis Service Provider

Setiap service provider **selalu** mewarisi (`extends`) class:  
```php
Illuminate\Support\ServiceProvider
````

Biasanya, sebuah service provider memiliki dua metode utama:

1. **register()** → hanya digunakan untuk *binding* ke service container.
2. **boot()** → dipanggil setelah semua provider lain terdaftar.

⚠️ Penting:
Jangan mendaftarkan event listener, routes, atau fitur lain di dalam `register()`. Hal tersebut harus dilakukan di `boot()`.

---

### 🛠️ Membuat Service Provider dengan Artisan

Kita bisa membuat service provider baru menggunakan perintah Artisan:

```bash
php artisan make:provider RiakServiceProvider
```

Laravel otomatis akan menambahkan provider baru tersebut ke dalam file `bootstrap/providers.php`.

---

## 🔧 Metode `register()`

Seperti dijelaskan sebelumnya, `register()` digunakan untuk **mendaftarkan binding ke dalam service container**.

Contoh sederhana:

```php
<?php

namespace App\Providers;

use App\Services\Riak\Connection;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

class RiakServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(Connection::class, function (Application $app) {
            return new Connection(config('riak'));
        });
    }
}
```

📌 Penjelasan:

* Kita mendaftarkan `App\Services\Riak\Connection` sebagai **singleton**.
* Artinya, Laravel hanya akan membuat satu instance `Connection` selama siklus hidup aplikasi.

---

## 📑 Properti `bindings` & `singletons`

Jika terdapat banyak binding sederhana, kita bisa menggunakan properti `bindings` dan `singletons` alih-alih menuliskan manual di dalam `register()`.

Contoh:

```php
<?php

namespace App\Providers;

use App\Contracts\DowntimeNotifier;
use App\Contracts\ServerProvider;
use App\Services\DigitalOceanServerProvider;
use App\Services\PingdomDowntimeNotifier;
use App\Services\ServerToolsProvider;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public $bindings = [
        ServerProvider::class => DigitalOceanServerProvider::class,
    ];

    public $singletons = [
        DowntimeNotifier::class => PingdomDowntimeNotifier::class,
        ServerProvider::class   => ServerToolsProvider::class,
    ];
}
```

💡 Dengan cara ini, kode jadi lebih rapi dan mudah dibaca.

---

## ⚙️ Metode `boot()`

Jika kita perlu mendaftarkan sesuatu yang membutuhkan layanan lain (misalnya **view composer**), maka kita gunakan `boot()`.

Contoh:

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class ComposerServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        View::composer('view', function () {
            // Kode logika di sini...
        });
    }
}
```

---

### 📥 Dependency Injection di `boot()`

Laravel juga mendukung **dependency injection** langsung di metode `boot()`.
Service container akan otomatis menginjeksi dependensi yang dibutuhkan.

Contoh:

```php
use Illuminate\Contracts\Routing\ResponseFactory;

public function boot(ResponseFactory $response): void
{
    $response->macro('serialized', function (mixed $value) {
        // Implementasi macro baru
    });
}
```

---

## 📌 Mendaftarkan Provider

Semua service provider didaftarkan di file:
📂 `bootstrap/providers.php`

Contoh isi file:

```php
<?php

return [
    App\Providers\AppServiceProvider::class,
];
```

Jika membuat provider secara manual, kita juga harus menambahkannya secara manual ke array tersebut:

```php
<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\ComposerServiceProvider::class,
];
```

---

## ⏳ Deferred Providers

Jika service provider hanya mendaftarkan **binding ke service container**, kita bisa menundanya (*defer*) hingga benar-benar dibutuhkan.

Untuk membuat provider menjadi deferred, implementasikan interface:

```php
Illuminate\Contracts\Support\DeferrableProvider
```

Contoh:

```php
<?php

namespace App\Providers;

use App\Services\Riak\Connection;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

class RiakServiceProvider extends ServiceProvider implements DeferrableProvider
{
    public function register(): void
    {
        $this->app->singleton(Connection::class, function (Application $app) {
            return new Connection($app['config']['riak']);
        });
    }

    public function provides(): array
    {
        return [Connection::class];
    }
}
```

💡 Dengan deferred provider, performa aplikasi lebih baik karena tidak semua provider dimuat di setiap request.

---

# 🎯 Kesimpulan

* **Service Providers** adalah pusat konfigurasi Laravel.
* Gunakan `register()` untuk binding service, dan `boot()` untuk hal-hal yang membutuhkan layanan lain.
* Manfaatkan properti `bindings` dan `singletons` agar kode lebih ringkas.
* Daftarkan provider di `bootstrap/providers.php`.
* Gunakan **Deferred Providers** untuk meningkatkan performa aplikasi.

Dengan memahami konsep ini, kita bisa mengontrol penuh bagaimana aplikasi Laravel di-bootstrapped dan diorganisir. 🚀

```

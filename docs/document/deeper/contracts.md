# 📘 Dokumentasi Laravel Contracts

## 🔹 Pendahuluan
Laravel **Contracts** adalah sekumpulan *interface* yang mendefinisikan layanan inti yang disediakan oleh framework Laravel. Misalnya:
- 📦 `Illuminate\Contracts\Queue\Queue` → mendefinisikan metode untuk *queueing jobs*.
- 📧 `Illuminate\Contracts\Mail\Mailer` → mendefinisikan metode untuk mengirim email.

Setiap *contract* memiliki implementasi yang disediakan oleh Laravel. Contohnya:
- ⚡ Laravel menyediakan implementasi *queue* dengan berbagai *driver*.
- ✉️ Laravel menyediakan *mailer* yang dibangun di atas **Symfony Mailer**.

📌 Semua *contracts* Laravel berada di repositori GitHub terpisah, sehingga mudah diakses saat membangun paket yang berinteraksi dengan layanan Laravel.



## 🔹 Contracts vs. Facades
Laravel menyediakan **Facades** dan **helper functions** agar mudah memanggil layanan tanpa perlu *type-hint* atau resolusi manual melalui *service container*.

- ✅ **Facades** → Mudah digunakan, cocok untuk pengembangan cepat.  
- 🛠️ **Contracts** → Mendefinisikan *explicit dependencies* di dalam konstruktor kelas.  

📌 **Contoh perbedaan penggunaan:**

### ⚡ Facade
```php
Cache::get('key');
````

### 🛠️ Contract

```php
use Illuminate\Contracts\Cache\Repository;

class UserController {
    protected Repository $cache;

    public function __construct(Repository $cache) {
        $this->cache = $cache;
    }
}
```

👉 Keduanya dapat digunakan berdampingan. Pilihan tergantung preferensi tim.


## 🔹 Kapan Menggunakan Contracts?

Penggunaan **Contracts** atau **Facades** sangat fleksibel:

* 🖥️ Jika hanya mengembangkan aplikasi → **Facades** sudah cukup.
* 📦 Jika membangun **package** untuk berbagai framework → gunakan **Contracts** (`illuminate/contracts`) agar tidak terikat dengan implementasi spesifik Laravel.

📌 **Prinsip utama**: Pastikan kelas tetap fokus pada tanggung jawabnya, baik menggunakan *contracts* maupun *facades*.



## 🔹 Cara Menggunakan Contracts

Untuk mendapatkan implementasi sebuah *contract*, cukup gunakan **type-hinting** pada konstruktor kelas. Laravel akan otomatis menyuntikkan implementasi yang sesuai melalui **Service Container**.

📌 **Contoh penggunaan di Event Listener**:

```php
namespace App\Listeners;

use App\Events\OrderWasPlaced;
use Illuminate\Contracts\Redis\Factory;

class CacheOrderInformation
{
    public function __construct(
        protected Factory $redis,
    ) {}

    public function handle(OrderWasPlaced $event): void
    {
        // 💾 Simpan informasi order ke Redis
        $this->redis->set('order_'.$event->id, json_encode($event->data));
    }
}
```

📝 Saat listener ini dijalankan, Laravel otomatis menyuntikkan instance `Redis Factory` ke dalam kelas.



## 🔹 Referensi Contracts

📋 Berikut tabel *contract* utama Laravel dan **Facade** yang bersesuaian:

| 📄 **Contract**                                 | 🔗 **Facade / Referensi** |
| ----------------------------------------------- | ------------------------- |
| `Illuminate\Contracts\Auth\Access\Gate`         | Gate                      |
| `Illuminate\Contracts\Auth\Factory`             | Auth                      |
| `Illuminate\Contracts\Auth\Guard`               | Auth::guard()             |
| `Illuminate\Contracts\Auth\PasswordBroker`      | Password::broker()        |
| `Illuminate\Contracts\Bus\Dispatcher`           | Bus                       |
| `Illuminate\Contracts\Cache\Factory`            | Cache                     |
| `Illuminate\Contracts\Config\Repository`        | Config                    |
| `Illuminate\Contracts\Console\Kernel`           | Artisan                   |
| `Illuminate\Contracts\Container\Container`      | App                       |
| `Illuminate\Contracts\Cookie\Factory`           | Cookie                    |
| `Illuminate\Contracts\Encryption\Encrypter`     | Crypt                     |
| `Illuminate\Contracts\Events\Dispatcher`        | Event                     |
| `Illuminate\Contracts\Filesystem\Factory`       | Storage                   |
| `Illuminate\Contracts\Foundation\Application`   | App                       |
| `Illuminate\Contracts\Hashing\Hasher`           | Hash                      |
| `Illuminate\Contracts\Mail\Mailer`              | Mail                      |
| `Illuminate\Contracts\Notifications\Dispatcher` | Notification              |
| `Illuminate\Contracts\Pagination\Paginator`     | -                         |
| `Illuminate\Contracts\Pipeline\Pipeline`        | Pipeline                  |
| `Illuminate\Contracts\Queue\Factory`            | Queue                     |
| `Illuminate\Contracts\Queue\Queue`              | Queue::connection()       |
| `Illuminate\Contracts\Redis\Factory`            | Redis                     |
| `Illuminate\Contracts\Routing\Registrar`        | Route                     |
| `Illuminate\Contracts\Routing\ResponseFactory`  | Response                  |
| `Illuminate\Contracts\Routing\UrlGenerator`     | URL                       |
| `Illuminate\Contracts\Session\Session`          | Session::driver()         |
| `Illuminate\Contracts\Translation\Translator`   | Lang                      |
| `Illuminate\Contracts\Validation\Factory`       | Validator                 |
| `Illuminate\Contracts\Validation\Validator`     | Validator::make()         |
| `Illuminate\Contracts\View\Factory`             | View                      |
| `Illuminate\Contracts\View\View`                | View::make()              |



## 🎯 Kesimpulan

* 🛠️ **Contracts** → memberikan fleksibilitas, *explicit dependencies*, dan cocok untuk *package development*.
* ⚡ **Facades** → lebih mudah dan praktis untuk pengembangan aplikasi sehari-hari.
* 🔀 Laravel mendukung keduanya, sehingga pengembang bisa memilih sesuai kebutuhan.

🚀 Dengan memahami Contracts, developer dapat membuat aplikasi Laravel yang **modular, terstruktur, dan mudah diuji**.



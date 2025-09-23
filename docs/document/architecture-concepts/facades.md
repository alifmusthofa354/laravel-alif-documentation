# 📚 Facades di Laravel

## 🚀 Pendahuluan

Dalam dokumentasi Laravel, kita sering melihat contoh kode yang berinteraksi dengan fitur Laravel melalui **facades**. Facades memberikan antarmuka "statis" ke kelas-kelas yang tersedia di dalam **service container** aplikasi. Hampir semua fitur Laravel dapat diakses melalui facades.

Laravel facades bertindak sebagai **proxy statis** terhadap kelas yang ada di service container. Ini memungkinkan kita menulis kode dengan sintaks yang ringkas dan ekspresif, tetapi tetap menjaga fleksibilitas dan testability.

Contoh penggunaan:

```php
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;

Route::get('/cache', function () {
    return Cache::get('key');
});
```

⚡ Dengan menggunakan facades, kita bisa mengakses fitur Laravel tanpa harus menuliskan nama kelas panjang atau melakukan konfigurasi manual.

---

## 🛠️ Helper Functions

Selain facades, Laravel juga menyediakan berbagai **helper functions global**. Fungsi ini membuat interaksi dengan fitur Laravel jadi lebih sederhana. Beberapa helper populer antara lain: `view()`, `response()`, `url()`, `config()`, dan lainnya.

Contoh perbedaan facade dan helper:

```php
use Illuminate\Support\Facades\Response;

Route::get('/users', function () {
    return Response::json([
        // ...
    ]);
});

Route::get('/users', function () {
    return response()->json([
        // ...
    ]);
});
```

✨ Dengan helper, kita tidak perlu melakukan `import` kelas terlebih dahulu karena fungsi sudah tersedia secara global.

---

## 🎯 Kapan Menggunakan Facades?

### ✅ Kelebihan
- Sintaks singkat dan mudah diingat.
- Tidak perlu menyuntikkan dependency secara manual.
- Mudah digunakan dalam testing dengan metode mock.

### ⚠️ Kekurangan
- Berpotensi menyebabkan **scope creep** (kelas menjadi terlalu besar).
- Sulit terlihat apakah sebuah kelas sudah memiliki terlalu banyak dependency.

💡 Solusi: Jika kelas menjadi terlalu besar, pecah menjadi beberapa kelas yang lebih kecil.

---

## 🆚 Facades vs Dependency Injection

Salah satu manfaat dependency injection adalah kemudahan untuk **swap implementasi**. Dengan DI, kita bisa mengganti kelas dengan mock atau stub saat testing.

Namun, Laravel facades juga bisa dites seperti dependency injection karena menggunakan metode dinamis dari PHP.

Contoh test dengan **Pest**:

```php
use Illuminate\Support\Facades\Cache;

test('basic example', function () {
    Cache::shouldReceive('get')
        ->with('key')
        ->andReturn('value');

    $response = $this->get('/cache');

    $response->assertSee('value');
});
```

---

## 🆚 Facades vs Helper Functions

Laravel menyediakan helper functions yang seringkali setara dengan facade. Misalnya:

```php
return Illuminate\Support\Facades\View::make('profile');

return view('profile');
```

📌 Tidak ada perbedaan signifikan antara keduanya. Testing helper function juga dapat dilakukan dengan cara yang sama seperti facade.

---

## ⚙️ Cara Kerja Facades

Facade adalah kelas yang menyediakan akses ke objek dari service container. Kelas dasar `Facade` menggunakan metode PHP `__callStatic()` untuk meneruskan pemanggilan metode ke objek yang ada di container.

Contoh penggunaan:

```php
use Illuminate\Support\Facades\Cache;

$user = Cache::get('user:'.$id);
```

Di balik layar, facade `Cache` memanggil binding `cache` dari service container:

```php
class Cache extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'cache';
    }
}
```

---

## ⚡ Real-Time Facades

Dengan real-time facades, kita dapat memperlakukan kelas apa pun seolah-olah itu adalah sebuah facade.

Contoh sebelum real-time facades:

```php
class Podcast extends Model
{
    public function publish(Publisher $publisher): void
    {
        $this->update(['publishing' => now()]);
        $publisher->publish($this);
    }
}
```

Dengan real-time facades:

```php
use Facades\App\Contracts\Publisher;

class Podcast extends Model
{
    public function publish(): void
    {
        $this->update(['publishing' => now()]);
        Publisher::publish($this);
    }
}
```

🧪 Pengujian juga lebih mudah dengan real-time facades:

```php
test('podcast can be published', function () {
    $podcast = Podcast::factory()->create();

    Publisher::shouldReceive('publish')->once()->with($podcast);

    $podcast->publish();
});
```

---

## 📖 Daftar Referensi Facades

| Facade | Kelas | Service Container Binding |
|--------|-------|----------------------------|
| App | Illuminate\Foundation\Application | app |
| Artisan | Illuminate\Contracts\Console\Kernel | artisan |
| Auth | Illuminate\Auth\AuthManager | auth |
| Cache | Illuminate\Cache\CacheManager | cache |
| Config | Illuminate\Config\Repository | config |
| DB | Illuminate\Database\DatabaseManager | db |
| Event | Illuminate\Events\Dispatcher | events |
| Log | Illuminate\Log\LogManager | log |
| Mail | Illuminate\Mail\Mailer | mailer |
| Queue | Illuminate\Queue\QueueManager | queue |
| Route | Illuminate\Routing\Router | router |
| Session | Illuminate\Session\SessionManager | session |
| Storage | Illuminate\Filesystem\FilesystemManager | filesystem |
| URL | Illuminate\Routing\UrlGenerator | url |
| View | Illuminate\View\Factory | view |

👉 Daftar lengkap dapat dilihat di dokumentasi resmi Laravel.

---

## 🏁 Kesimpulan

- Facades mempermudah akses ke fitur Laravel dengan sintaks singkat.
- Helper functions adalah alternatif yang sama-sama valid.
- Facades tetap mendukung pengujian dengan mudah.
- Gunakan dengan bijak agar kelas tidak terlalu besar (scope creep).
- Real-time facades memungkinkan kelas biasa digunakan seolah-olah facade.

⚡ Singkatnya: gunakan **facades** untuk kemudahan, tapi tetap perhatikan **best practice OOP** agar kode tetap bersih dan mudah dirawat.
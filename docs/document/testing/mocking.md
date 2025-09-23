# 🧪 Mocking di Laravel

## 📌 Pendahuluan
Ketika menguji aplikasi **Laravel**, sering kali kita tidak ingin semua proses sungguhan dijalankan. Misalnya, jika kita menguji sebuah *controller* yang memicu sebuah event, maka kita tidak perlu benar-benar menjalankan semua *event listener*-nya.  
👉 Tujuannya: **fokus pada hasil respons** tanpa perlu memikirkan logika lain di belakang layar, karena logika itu bisa diuji secara terpisah.

Laravel menyediakan berbagai *helper* bawaan untuk melakukan **mocking** pada *event*, *job*, maupun *facade* sehingga kita tidak perlu repot menulis konfigurasi manual dengan **Mockery**.

---

## 🏗️ Mocking Objects
Saat kita ingin melakukan **mock** pada sebuah objek yang di-*resolve* oleh **Service Container**, kita harus mengikatkan versi mock dari objek tersebut ke dalam container. Dengan begitu, Laravel akan menggunakan objek hasil mock, bukan objek asli.

### ✅ Contoh Menggunakan Pest
```php
use App\Service;
use Mockery;
use Mockery\MockInterface;
 
test('something can be mocked', function () {
    $this->instance(
        Service::class,
        Mockery::mock(Service::class, function (MockInterface $mock) {
            $mock->expects('process');
        })
    );
});
````

### 🚀 Versi Ringkas dengan `mock()`

Laravel menyediakan metode `mock()` agar lebih sederhana:

```php
use App\Service;
use Mockery\MockInterface;
 
$mock = $this->mock(Service::class, function (MockInterface $mock) {
    $mock->expects('process');
});
```

### 🛠️ Partial Mock

Kadang kita hanya ingin me-*mock* sebagian metode saja, sementara metode lain tetap berjalan normal. Gunakan `partialMock()`:

```php
use App\Service;
use Mockery\MockInterface;
 
$mock = $this->partialMock(Service::class, function (MockInterface $mock) {
    $mock->expects('process');
});
```

### 👀 Spy

Jika kita ingin **mencatat interaksi** antara objek dan kode yang diuji, gunakan `spy()`:

```php
use App\Service;
 
$spy = $this->spy(Service::class);

// Jalankan kode...

$spy->shouldHaveReceived('process');
```

---

## 🏷️ Mocking Facades

Berbeda dengan *static method* tradisional, **facade di Laravel** bisa dengan mudah di-*mock*.
Hal ini membuat pengujian lebih fleksibel dan mirip seperti jika kita menggunakan **Dependency Injection**.

### 📂 Contoh Kasus

Sebuah controller sederhana menggunakan `Cache`:

```php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
 
class UserController extends Controller
{
    public function index(): array
    {
        $value = Cache::get('key');
 
        return [
            // ...
        ];
    }
}
```

### 🧩 Uji dengan Mocking

```php
use Illuminate\Support\Facades\Cache;
 
test('get index', function () {
    Cache::expects('get')
        ->with('key')
        ->andReturn('value');
 
    $response = $this->get('/users');
 
    // assertions...
});
```

⚠️ **Catatan penting**:

* Jangan me-*mock* `Request`. Lebih baik langsung kirim data lewat metode HTTP (`get`, `post`, dll).
* Jangan me-*mock* `Config`. Gunakan `Config::set()` di dalam test.

---

## 🔍 Facade Spies

Jika ingin melacak interaksi pada sebuah facade, gunakan `spy()`:

```php
use Illuminate\Support\Facades\Cache;
 
test('values are stored in cache', function () {
    Cache::spy();
 
    $response = $this->get('/');
 
    $response->assertStatus(200);
 
    Cache::shouldHaveReceived('put')->with('name', 'Taylor', 10);
});
```

---

## ⏳ Interaksi dengan Waktu

Kadang kita perlu mengontrol **waktu** saat melakukan pengujian. Misalnya untuk menguji fitur yang sensitif terhadap waktu (expired, locked, dll).

Laravel menyediakan metode seperti:

```php
test('time can be manipulated', function () {
    // Perjalanan waktu ke depan
    $this->travel(5)->milliseconds();
    $this->travel(5)->seconds();
    $this->travel(5)->minutes();
    $this->travel(5)->hours();
    $this->travel(5)->days();
    $this->travel(5)->weeks();
    $this->travel(5)->years();
 
    // Perjalanan waktu ke masa lalu
    $this->travel(-5)->hours();
 
    // Melompat ke waktu tertentu
    $this->travelTo(now()->subHours(6));
 
    // Kembali ke waktu normal
    $this->travelBack();
});
```

### 🔒 Freeze Time

Kita juga bisa membekukan waktu dengan `freezeTime()` atau `freezeSecond()`:

```php
use Illuminate\Support\Carbon;

// Membekukan waktu dan mengembalikannya setelah closure
$this->freezeTime(function (Carbon $time) {
    // ...
});

// Membekukan di detik sekarang
$this->freezeSecond(function (Carbon $time) {
    // ...
});
```

### 🏁 Contoh Kasus Nyata

Mengunci thread forum setelah 1 minggu tidak aktif:

```php
use App\Models\Thread;
 
test('forum threads lock after one week of inactivity', function () {
    $thread = Thread::factory()->create();
 
    $this->travel(1)->week();
 
    expect($thread->isLockedByInactivity())->toBeTrue();
});
```

---

## 🎯 Kesimpulan

* **Mocking** membantu kita mengisolasi bagian kode saat pengujian.
* **Objects** bisa di-*mock*, *partial mock*, atau *spy* dengan mudah.
* **Facades** lebih unggul daripada *static methods* karena bisa di-*mock* maupun *spy*.
* **Time travel & freeze** sangat berguna untuk menguji fitur yang terkait waktu.

👉 Dengan memanfaatkan fitur ini, pengujian Laravel menjadi **lebih cepat, aman, dan fleksibel**. 🚀

# Events

## Pendahuluan

Laravel menyediakan **Events** sebagai implementasi pola observer yang sederhana. Events memungkinkan kita untuk **membuat aplikasi yang lebih terpisah (decoupled)** karena satu event dapat memiliki beberapa listener yang tidak saling bergantung.

Misalnya, ketika sebuah pesanan dikirim, kita ingin mengirim notifikasi ke Slack. Alih-alih menulis kode notifikasi di proses pengiriman pesanan, kita cukup memicu event `App\Events\OrderShipped` dan listener akan menangani pengiriman notifikasi.

Event disimpan di direktori `app/Events`, sedangkan listener disimpan di `app/Listeners`. Direktori ini akan otomatis dibuat saat kita membuat event dan listener menggunakan **Artisan**.



## 1. Membuat Event dan Listener

Laravel memudahkan pembuatan event dan listener menggunakan perintah Artisan:

```bash
php artisan make:event PodcastProcessed
php artisan make:listener SendPodcastNotification --event=PodcastProcessed
```

Jika dijalankan tanpa argumen, Laravel akan meminta nama kelas secara interaktif:

```bash
php artisan make:event
php artisan make:listener
```



## 2. Mendaftarkan Event dan Listener

### 2.1 Event Discovery

Secara default, Laravel akan **otomatis menemukan listener** dengan memindai direktori `Listeners`. Laravel akan mendaftarkan metode `handle` atau `__invoke` pada kelas listener sebagai event listener.

```php
use App\Events\PodcastProcessed;

class SendPodcastNotification
{
    public function handle(PodcastProcessed $event): void
    {
        // Logika listener di sini
    }
}
```

Listener dapat menangani beberapa event menggunakan **union types**:

```php
public function handle(PodcastProcessed|PodcastPublished $event): void
{
    // Logika untuk kedua event
}
```

Jika listener disimpan di direktori lain, kita dapat menambahkan direktori menggunakan `withEvents` di `bootstrap/app.php`.

```php
->withEvents(discover: [
    __DIR__.'/../app/Domain/*/Listeners',
])
```

Perintah berikut menampilkan semua listener yang terdaftar:

```bash
php artisan event:list
```

### 2.2 Event Discovery di Produksi

Untuk mempercepat aplikasi, gunakan cache listener:

```bash
php artisan event:cache
php artisan event:clear
```

### 2.3 Mendaftarkan Event Secara Manual

Kita juga bisa mendaftarkan listener secara manual menggunakan `Event::listen` di `AppServiceProvider`:

```php
use App\Events\PodcastProcessed;
use App\Listeners\SendPodcastNotification;
use Illuminate\Support\Facades\Event;

public function boot(): void
{
    Event::listen(PodcastProcessed::class, SendPodcastNotification::class);
}
```

### 2.4 Listener Berdasarkan Closure

Listener tidak harus berupa kelas; bisa juga menggunakan closure:

```php
Event::listen(function (PodcastProcessed $event) {
    // Logika listener
});
```

Listener anonim juga dapat dijalankan secara queueable:

```php
use function Illuminate\Events\queueable;

Event::listen(queueable(function (PodcastProcessed $event) {
    // Logika queueable listener
}));
```



## 3. Listener Wildcard

Listener dapat menangani beberapa event sekaligus menggunakan wildcard `*`:

```php
Event::listen('event.*', function (string $eventName, array $data) {
    // Logika listener untuk semua event
});
```



## 4. Mendefinisikan Event

Event adalah **wadah data** yang menyimpan informasi terkait event. Contoh event `OrderShipped`:

```php
namespace App\Events;

use App\Models\Order;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderShipped
{
    use Dispatchable, SerializesModels;

    public function __construct(public Order $order) {}
}
```



## 5. Mendefinisikan Listener

Listener menerima instance event di metode `handle`:

```php
namespace App\Listeners;

use App\Events\OrderShipped;

class SendShipmentNotification
{
    public function handle(OrderShipped $event): void
    {
        // Mengakses order: $event->order
    }
}
```

Listener dapat menghentikan propagasi event dengan **return false**.



## 6. Listener Queueable

Listener dapat dijalankan secara **asynchronous** menggunakan queue. Tambahkan interface `ShouldQueue`:

```php
use Illuminate\Contracts\Queue\ShouldQueue;

class SendShipmentNotification implements ShouldQueue
{
    // Listener otomatis dijalankan melalui queue
}
```

### 6.1 Mengatur Queue Connection, Name & Delay

```php
public $connection = 'sqs';
public $queue = 'listeners';
public $delay = 60;
```

Atau secara dinamis:

```php
public function viaConnection(): string { return 'sqs'; }
public function viaQueue(): string { return 'listeners'; }
public function withDelay(OrderShipped $event): int { return 60; }
```

### 6.2 Kondisional Queue

```php
public function shouldQueue(OrderCreated $event): bool
{
    return $event->order->subtotal >= 5000;
}
```

### 6.3 Failed Jobs

Listener queueable bisa menangani kegagalan:

```php
public function failed(OrderShipped $event, Throwable $exception): void
{
    // Logika jika listener gagal
}
```

### 6.4 Pengaturan Retry, Backoff & Timeout

```php
public $tries = 5;
public $backoff = 3; // detik
public $timeout = 120; // detik
public $failOnTimeout = true;
```



## 7. Dispatching Events

Untuk memicu event, gunakan:

```php
OrderShipped::dispatch($order);
```

Secara kondisional:

```php
OrderShipped::dispatchIf($condition, $order);
OrderShipped::dispatchUnless($condition, $order);
```

Jika ingin hanya setelah database commit:

```php
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

class OrderShipped implements ShouldDispatchAfterCommit
{
    use Dispatchable, SerializesModels;
    public function __construct(public Order $order) {}
}
```



## 8. Deferred Events

Menunda eksekusi event sampai blok kode selesai:

```php
Event::defer(function () {
    $user = User::create(['name' => 'Victoria']);
    $user->posts()->create(['title' => 'Post pertama']);
});
```



## 9. Event Subscribers

Subscriber adalah kelas yang bisa menangani beberapa event sekaligus:

```php
class UserEventSubscriber
{
    public function handleUserLogin(Login $event): void {}
    public function handleUserLogout(Logout $event): void {}

    public function subscribe(Dispatcher $events): array
    {
        return [
            Login::class => 'handleUserLogin',
            Logout::class => 'handleUserLogout',
        ];
    }
}
```

Mendaftarkan subscriber:

```php
Event::subscribe(UserEventSubscriber::class);
```



## 10. Testing Events

Laravel menyediakan metode untuk **fake event** saat testing:

```php
Event::fake();

// Eksekusi logika
Event::assertDispatched(OrderShipped::class);
Event::assertNotDispatched(OrderFailedToShip::class);
```

Faking sebagian event:

```php
Event::fake([OrderCreated::class]);
```

Scoped event fake:

```php
$order = Event::fakeFor(function () {
    return Order::factory()->create();
});
```

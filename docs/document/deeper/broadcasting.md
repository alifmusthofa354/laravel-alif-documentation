# 📡 Laravel Event Broadcasting

## 🔹 1. Apa itu Event Broadcasting?

Event Broadcasting = cara Laravel untuk **mengirim event dari backend ke frontend** secara **real-time** 🎯.
Dipakai di banyak fitur modern:

* 💬 Chat
* 🔔 Notifikasi
* 📦 Tracking pesanan
* 👥 Kolaborasi multi-user (misal: Google Docs style)

## ⚙️ 2. Konfigurasi Awal

### 2.1. Install Laravel Echo

Laravel Echo = library JS untuk dengar event realtime.

**Install via npm:**

```bash
npm install --save laravel-echo pusher-js
```

### 2.2. Pilih Broadcaster

Laravel mendukung beberapa driver:

* 🟢 `pusher` → paling sering dipakai (butuh akun Pusher/Ably)
* 🔴 `redis` → pakai Redis + Socket.io
* 🟠 `ably` → alternatif ke Pusher
* 🔵 `reverb` → WebSocket server bawaan Laravel
* 📝 `log` → hanya catat event ke log (debug)
* 🚫 `null` → nonaktif

Atur di `.env`:

```env
BROADCAST_DRIVER=pusher
```

### 2.3. Konfigurasi `config/broadcasting.php`

Contoh konfigurasi Pusher:

```php
'pusher' => [
    'driver' => 'pusher',
    'key' => env('PUSHER_APP_KEY'),
    'secret' => env('PUSHER_APP_SECRET'),
    'app_id' => env('PUSHER_APP_ID'),
    'options' => [
        'cluster' => env('PUSHER_APP_CLUSTER'),
        'useTLS' => true,
    ],
],
```



## 🚀 3. Membuat & Menyiarkan Event

### 3.1. Membuat Event

```bash
php artisan make:event OrderShipmentStatusUpdated
```

Tambahkan `ShouldBroadcast`:

```php
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class OrderShipmentStatusUpdated implements ShouldBroadcast
{
    public $order;

    public function __construct($order)
    {
        $this->order = $order;
    }

    public function broadcastOn(): array
    {
        return ['orders.' . $this->order->id];
    }
}
```

### 3.2. Menyiarkan Event

```php
use App\Events\OrderShipmentStatusUpdated;

OrderShipmentStatusUpdated::dispatch($order);
```



## 🙅‍♂️ 4. Broadcast ke Semua Kecuali User Saat Ini

Supaya user yang memicu event **tidak menerima ulang broadcast**:

```php
broadcast(new OrderShipmentStatusUpdated($order))->toOthers();
```

Syarat: event pakai trait:

```php
use Illuminate\Broadcasting\InteractsWithSockets;
```



## 🕹️ 5. Cara Kerja dengan Socket ID

* Saat Echo connect → Laravel kasih **socketId** 🔑
* Axios otomatis kirim `X-Socket-ID` di setiap request.
* Laravel cek → jika `toOthers()`, tidak kirim ke socket itu.

Manual dapatkan socketId:

```js
var socketId = Echo.socketId();
```



## 🔌 6. Custom Broadcaster

Pilih broadcaster saat broadcast:

```php
broadcast(new OrderShipmentStatusUpdated($order))->via('pusher');
```

Atau di constructor event:

```php
$this->broadcastVia('pusher');
```



## 🎭 7. Anonymous Event

Broadcast tanpa bikin event class:

```php
Broadcast::on("orders.$order->id")->send();
```

Custom nama & data:

```php
Broadcast::on("orders.$order->id")
    ->as("OrderPlaced")
    ->with($order)
    ->send();
```



## 🛟 8. Rescue Error (`ShouldRescue`)

Kalau server queue down → broadcast bisa error ❌.
Supaya tidak ganggu UX → pakai `ShouldRescue`:

```php
class ServerCreated implements ShouldBroadcast, ShouldRescue {}
```



## 👂 9. Mendengarkan Event (Frontend)

### Public Channel

```js
Echo.channel(`orders.${order.id}`)
    .listen("OrderShipmentStatusUpdated", (e) => {
        console.log(e.order.name);
    });
```

### Private Channel

```js
Echo.private(`orders.${order.id}`)
    .listen("OrderShipmentStatusUpdated", (e) => {
        console.log(e.order.status);
    });
```

### Stop Listening

```js
Echo.leave(`orders.${order.id}`);
```



## ⚛️ 10. Integrasi React / Vue

### React

```tsx
import { useEcho } from "@laravel/echo-react";

useEcho(
  `orders.${orderId}`,
  "OrderShipmentStatusUpdated",
  (e) => console.log(e.order),
);
```

### Vue

```js
const { useEcho } = require('@laravel/echo-vue');

useEcho(`orders.${orderId}`, "OrderShipmentStatusUpdated", (e) => {
    console.log(e.order);
});
```



## 👫 11. Presence Channels

Presence channel = private channel + info siapa saja yg online 👀

### Autorisasi di backend

`routes/channels.php`

```php
Broadcast::channel('chat.{roomId}', function (User $user, int $roomId) {
    return $user->canJoinRoom($roomId)
        ? ['id' => $user->id, 'name' => $user->name]
        : false;
});
```

### Join di frontend

```js
Echo.join(`chat.${roomId}`)
    .here(users => console.log(users))      // semua user
    .joining(user => console.log(user))    // user baru masuk
    .leaving(user => console.log(user));   // user keluar
```



## 📝 12. Model Broadcasting

Model bisa otomatis broadcast saat `created`, `updated`, `deleted`.

### Tambahkan trait

```php
use Illuminate\Database\Eloquent\BroadcastsEvents;

class Post extends Model
{
    use BroadcastsEvents;

    public function broadcastOn(string $event): array
    {
        return [$this, $this->user];
    }
}
```

Event default → `PostCreated`, `PostUpdated`, `PostDeleted`
Channel default → `App.Models.Post.{id}`



## 🗣️ 13. Client Events (Whisper)

Dipakai untuk komunikasi **client → client** (misal: typing indicator ⌨️).

### Kirim

```js
Echo.private(`chat.${roomId}`).whisper("typing", {
    name: this.user.name
});
```

### Dengar

```js
Echo.private(`chat.${roomId}`)
    .listenForWhisper("typing", e => console.log(e.name));
```



## 🔔 14. Notifications

Laravel Notifications bisa dikirim via broadcast.

Frontend:

```js
Echo.private(`App.Models.User.${userId}`)
    .notification((notification) => {
        console.log(notification.type);
    });
```



## ⚡ 15. Advanced Features

### 15.1. BroadcastNow (tanpa queue)

```php
class OrderShipped implements ShouldBroadcastNow {}
```

### 15.2. Kondisional `broadcastWhen()`

```php
public function broadcastWhen()
{
    return $this->order->status === 'delivered';
}
```

### 15.3. Broadcast Routes

Semua channel private/presence harus didefinisikan di:

```
routes/channels.php
```

Contoh:

```php
Broadcast::channel('orders.{orderId}', function (User $user, $orderId) {
    return $user->id === Order::find($orderId)->user_id;
});
```



## 🧪 16. Testing

Laravel bisa mengetes event broadcast:

```php
public function test_order_event_dispatched()
{
    Event::fake();

    OrderShipmentStatusUpdated::dispatch(new Order(1));

    Event::assertDispatched(OrderShipmentStatusUpdated::class);
}
```



# 🎉 Kesimpulan

Laravel Broadcasting memberikan **kemudahan membangun aplikasi real-time** 🚀

✨ Ringkasan fitur utama:

* 📡 Broadcast event (public, private, presence)
* 🙅‍♂️ `toOthers()` biar tidak double
* 🛟 `ShouldRescue` biar UX tetap mulus
* 👂 Laravel Echo (React/Vue hooks bawaan)
* 👫 Presence channel (lihat siapa online)
* 📝 Model broadcasting otomatis
* 🗣️ Client → client whisper event
* 🔔 Realtime notifications
* ⚡ Advanced: `ShouldBroadcastNow`, `broadcastWhen`, testing



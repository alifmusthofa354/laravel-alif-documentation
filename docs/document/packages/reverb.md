# 📡 Laravel Reverb

Laravel Reverb adalah server WebSocket yang cepat, skalabel, dan siap produksi untuk Laravel. Reverb memungkinkan aplikasi Laravel Anda untuk menangani koneksi WebSocket real-time dengan performa tinggi dan skalabilitas horizontal.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [Menjalankan Server](#menjalankan-server)
5. [Broadcasting Events](#broadcasting-events)
6. [Menggunakan dengan Echo](#menggunakan-dengan-echo)
7. [Channels dan Authorization](#channels-dan-authorization)
8. [Presence Channels](#presence-channels)
9. [Private Channels](#private-channels)
10. [Monitoring](#monitoring)
11. [Scalability](#scalability)
12. [Production Deployment](#production-deployment)

## 🎯 Pendahuluan

Laravel Reverb adalah server WebSocket yang dirancang khusus untuk aplikasi Laravel. Reverb menyediakan solusi WebSocket yang cepat, skalabel, dan siap produksi yang terintegrasi langsung dengan sistem broadcasting Laravel.

### ✨ Fitur Utama
- Server WebSocket berkinerja tinggi
- Integrasi langsung dengan Laravel Broadcasting
- Scalability horizontal
- Monitoring real-time
- Support untuk berbagai protokol
- Integrasi dengan Laravel Echo
- Presence channels
- Private channels
- Channel authorization
- Load balancing

### ⚠️ Catatan Penting
Reverb memerlukan PHP 8.2+ dan ekstensi PHP yang sesuai untuk berfungsi dengan baik. Pastikan lingkungan produksi Anda memenuhi persyaratan ini.

## 📦 Instalasi

### 🎯 Menginstal Reverb
Untuk memulai, instal Reverb melalui Composer:

```bash
composer require laravel/reverb
```

### 🛠️ Publish Configuration
Publikasikan file konfigurasi Reverb menggunakan perintah vendor:

```bash
php artisan reverb:install
```

Perintah ini akan membuat file konfigurasi `config/reverb.php` dan memperbarui file `.env` Anda.

### 🔧 Run Migrations (Opsional)
Jika Anda berencana menggunakan fitur monitoring Reverb, jalankan migrasi database:

```bash
php artisan migrate
```

## ⚙️ Konfigurasi

### 📄 File Konfigurasi
File konfigurasi utama terletak di `config/reverb.php`. File ini memungkinkan Anda mengkonfigurasi berbagai aspek server Reverb.

### 📋 Konfigurasi Dasar
```php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Reverb Server
    |--------------------------------------------------------------------------
    |
    | This option controls the default server that will be used by Reverb.
    |
    */

    'servers' => [
        'reverb' => [
            'host' => env('REVERB_SERVER_HOST', '0.0.0.0'),
            'port' => env('REVERB_SERVER_PORT', 8080),
            'hostname' => env('REVERB_HOST'),
            'options' => [
                'tls' => env('REVERB_USE_TLS', false),
            ],
            'max_request_size' => env('REVERB_MAX_REQUEST_SIZE', 10_000),
            'scaling' => [
                'enabled' => env('REVERB_SCALING_ENABLED', false),
                'channel' => env('REVERB_SCALING_CHANNEL', 'reverb'),
            ],
        ],
    ],

    'apps' => [
        [
            'key' => env('REVERB_APP_KEY'),
            'secret' => env('REVERB_APP_SECRET'),
            'app_id' => env('REVERB_APP_ID'),
            'options' => [
                'host' => env('REVERB_HOST'),
                'port' => env('REVERB_PORT', 443),
                'scheme' => env('REVERB_SCHEME', 'https'),
                'useTLS' => env('REVERB_USE_TLS', true),
            ],
        ],
    ],
];
```

### 🔐 Konfigurasi Environment
Tambahkan konfigurasi berikut ke file `.env` Anda:

```bash
REVERB_APP_ID=your-app-id
REVERB_APP_KEY=your-app-key
REVERB_APP_SECRET=your-app-secret
REVERB_HOST="localhost"
REVERB_PORT=8080
REVERB_SCHEME=http
REVERB_USE_TLS=false
```

### 🔧 Konfigurasi Broadcasting
Pastikan file `config/broadcasting.php` Anda dikonfigurasi untuk menggunakan driver Reverb:

```php
'connections' => [
    'reverb' => [
        'driver' => 'reverb',
        'key' => env('REVERB_APP_KEY'),
        'secret' => env('REVERB_APP_SECRET'),
        'app_id' => env('REVERB_APP_ID'),
        'options' => [
            'host' => env('REVERB_HOST', 'localhost'),
            'port' => env('REVERB_PORT', 8080),
            'scheme' => env('REVERB_SCHEME', 'http'),
            'useTLS' => env('REVERB_USE_TLS', false),
        ],
    ],
],
```

## ▶️ Menjalankan Server

### 🚀 Menjalankan Server Reverb
Untuk memulai server Reverb, jalankan perintah berikut:

```bash
php artisan reverb:start
```

### 📋 Opsi Server
```bash
# Menjalankan server dengan host dan port khusus
php artisan reverb:start --host=127.0.0.1 --port=8080

# Menjalankan server dalam mode debug
php artisan reverb:start --debug

# Menjalankan server dengan jumlah worker khusus
php artisan reverb:start --workers=4
```

### 📋 Daemon Mode
Untuk menjalankan server dalam mode daemon:

```bash
php artisan reverb:start --daemon
```

### 📋 Menggunakan Process Managers
Untuk produksi, gunakan process manager seperti Supervisor:

```ini
[program:reverb]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/your/app/artisan reverb:start
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/path/to/your/app/storage/logs/reverb.log
```

## 📢 Broadcasting Events

### 📋 Membuat Event Broadcast
Untuk membuat event yang dapat di-broadcast, gunakan perintah Artisan:

```bash
php artisan make:event OrderShipped
```

### 📋 Event Broadcast Dasar
```php
<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderShipped implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public $order)
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('orders.'.$this->order->id),
        ];
    }
}
```

### 📋 Mengirim Event
```php
use App\Events\OrderShipped;

$order = Order::first();
event(new OrderShipped($order));

// Atau menggunakan helper
broadcast(new OrderShipped($order));
```

### 📋 Broadcasting dengan Data Tambahan
```php
public function broadcastWith(): array
{
    return [
        'order_id' => $this->order->id,
        'shipped_at' => $this->order->shipped_at->toISOString(),
    ];
}
```

### 📋 Broadcasting ke Multiple Channels
```php
public function broadcastOn(): array
{
    return [
        new PrivateChannel('orders.'.$this->order->id),
        new PrivateChannel('users.'.$this->order->user_id),
    ];
}
```

## 🎧 Menggunakan dengan Echo

### 📋 Instalasi Laravel Echo
Instal Laravel Echo dan Pusher JS melalui NPM:

```bash
npm install --save-dev laravel-echo pusher-js
```

### 📋 Konfigurasi Echo
Dalam file `resources/js/bootstrap.js` Anda:

```javascript
import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});
```

### 📋 Mendengarkan Events
```javascript
// Mendengarkan private channel
window.Echo.private('orders.' + orderId)
    .listen('OrderShipped', (e) => {
        console.log(e.order);
    });

// Mendengarkan presence channel
window.Echo.join('chat.' + roomId)
    .here((users) => {
        console.log('Current users:', users);
    })
    .joining((user) => {
        console.log(user.name + ' joined the chat');
    })
    .leaving((user) => {
        console.log(user.name + ' left the chat');
    })
    .listen('MessageSent', (e) => {
        console.log(e.message);
    });
```

## 🔐 Channels dan Authorization

### 📋 Membuat Channel Authorization Routes
Reverb secara otomatis membuat route untuk channel authorization. Anda dapat menentukan logika authorization dalam file `routes/channels.php`:

```php
use App\Models\User;

Broadcast::channel('orders.{orderId}', function (User $user, int $orderId) {
    return $user->id === Order::find($orderId)->user_id;
});
```

### 📋 Private Channels
Private channels memerlukan authorization sebelum pengguna dapat bergabung:

```javascript
// Frontend
window.Echo.private('orders.' + orderId)
    .listen('OrderShipped', (e) => {
        // Handle event
    });
```

```php
// Backend - routes/channels.php
Broadcast::channel('orders.{orderId}', function (User $user, Order $order) {
    return $user->id === $order->user_id;
});
```

### 📋 Presence Channels
Presence channels memungkinkan Anda untuk melacak pengguna yang saat ini berada di channel:

```javascript
window.Echo.join('chat.' + roomId)
    .here((users) => {
        // Pengguna yang saat ini berada di channel
        console.log(users);
    })
    .joining((user) => {
        // Pengguna baru yang bergabung
        console.log(user.name + ' joined');
    })
    .leaving((user) => {
        // Pengguna yang meninggalkan channel
        console.log(user.name + ' left');
    });
```

### 📋 Channel Authorization dengan Data Tambahan
```php
Broadcast::channel('games.{gameId}', function (User $user, Game $game) {
    if ($user->canJoinGame($game)) {
        return ['id' => $user->id, 'name' => $user->name];
    }
});
```

## 👥 Presence Channels

### 📋 Menggunakan Presence Channels
Presence channels memungkinkan Anda untuk melacak pengguna yang saat ini berada di channel:

```php
// routes/channels.php
Broadcast::channel('chat.{roomId}', function (User $user, int $roomId) {
    if ($user->canJoinRoom($roomId)) {
        return ['id' => $user->id, 'name' => $user->name];
    }
});
```

### 📋 Frontend Implementation
```javascript
window.Echo.join('chat.' + roomId)
    .here((users) => {
        console.log('Users currently in room:', users);
    })
    .joining((user) => {
        console.log(user.name + ' joined the room');
    })
    .leaving((user) => {
        console.log(user.name + ' left the room');
    })
    .listen('MessageSent', (e) => {
        console.log('New message:', e.message);
    });
```

### 📋 Server-Side Presence Tracking
```php
// Mengirim event ke semua pengguna di presence channel
broadcast(new UserJoined($user))->toOthers();
```

## 🔒 Private Channels

### 📋 Menggunakan Private Channels
Private channels memerlukan authorization sebelum pengguna dapat bergabung:

```php
// routes/channels.php
Broadcast::channel('users.{userId}', function (User $user, int $userId) {
    return (int) $user->id === (int) $userId;
});
```

### 📋 Frontend Implementation
```javascript
window.Echo.private('users.' + userId)
    .listen('UserUpdated', (e) => {
        console.log('User updated:', e.user);
    });
```

### 📋 Channel Authorization dengan Model Binding
```php
Broadcast::channel('orders.{order}', function (User $user, Order $order) {
    return $user->id === $order->user_id;
});
```

## 📊 Monitoring

### 📋 Built-in Monitoring Dashboard
Reverb menyertakan dashboard monitoring real-time:

```
http://your-app.test/reverb
```

### 📋 Monitoring Metrics
Dashboard menyediakan metrik berikut:
- Active connections
- Messages per second
- Channel counts
- Memory usage
- CPU usage
- Error rates

### 📋 Custom Monitoring
```php
use Laravel\Reverb\Facades\Monitoring;

// Mencatat metrik kustom
Monitoring::record('custom_metric', 1);
```

### 📋 Alert Configuration
```php
// config/reverb.php
'monitoring' => [
    'alerts' => [
        'high_connection_count' => [
            'threshold' => 1000,
            'channels' => ['slack', 'email'],
        ],
    ],
],
```

## 📈 Scalability

### 📋 Horizontal Scaling
Reverb mendukung scaling horizontal melalui Redis:

```bash
REVERB_SCALING_ENABLED=true
REVERB_SCALING_CHANNEL=reverb
```

### 📋 Load Balancer Configuration
Untuk scaling dengan load balancer:

```nginx
upstream reverb_backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}

server {
    listen 80;
    server_name websocket.your-app.test;

    location / {
        proxy_pass http://reverb_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }
}
```

### 📋 Redis Configuration
```bash
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=null
REDIS_DB=0
```

## 🚀 Production Deployment

### 📋 Server Requirements
- PHP 8.2+
- Redis server
- Supervisor atau process manager lainnya
- Reverse proxy (Nginx/Apache) untuk TLS termination

### 📋 Environment Configuration
```bash
APP_ENV=production
APP_DEBUG=false

REVERB_APP_ID=your-production-app-id
REVERB_APP_KEY=your-production-app-key
REVERB_APP_SECRET=your-production-app-secret
REVERB_HOST=websocket.your-app.test
REVERB_PORT=443
REVERB_SCHEME=https
REVERB_USE_TLS=true

REVERB_SCALING_ENABLED=true
REVERB_SCALING_CHANNEL=reverb
```

### 📋 Supervisor Configuration
```ini
[program:reverb]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/your/app/artisan reverb:start --workers=4
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/path/to/your/app/storage/logs/reverb.log
```

### 📋 Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name websocket.your-app.test;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }
}
```

### 📋 Monitoring in Production
```bash
# Memantau log Reverb
tail -f storage/logs/reverb.log

# Memeriksa status server
php artisan reverb:status

# Memeriksa koneksi aktif
php artisan reverb:connections
```

### 📋 Backup and Recovery
```bash
# Membuat backup konfigurasi
cp config/reverb.php config/reverb.php.backup

# Membuat backup data monitoring
php artisan reverb:export --format=json > reverb-backup.json
```

## 🧠 Kesimpulan

Laravel Reverb menyediakan solusi WebSocket yang kuat dan skalabel untuk aplikasi Laravel Anda. Dengan integrasi langsung dengan sistem broadcasting Laravel dan dukungan untuk scaling horizontal, Reverb memungkinkan Anda membangun aplikasi real-time yang performa tinggi.

### 🔑 Keuntungan Utama
- Server WebSocket berkinerja tinggi
- Integrasi langsung dengan Laravel Broadcasting
- Scalability horizontal
- Monitoring real-time
- Support untuk berbagai protokol
- Integrasi dengan Laravel Echo
- Presence channels
- Private channels
- Channel authorization
- Load balancing

### 🚀 Best Practices
1. Gunakan Supervisor untuk manajemen proses
2. Terapkan TLS untuk koneksi aman
3. Gunakan load balancer untuk scaling
4. Monitor metrik kinerja secara berkala
5. Terapkan backup dan recovery strategy
6. Gunakan environment configuration yang tepat
7. Optimalkan konfigurasi Redis untuk scalability
8. Terapkan channel authorization yang ketat
9. Gunakan presence channels untuk fitur kolaboratif
10. Uji performa dengan beban yang realistis

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Reverb untuk membangun aplikasi WebSocket real-time yang skalabel dan berkinerja tinggi.
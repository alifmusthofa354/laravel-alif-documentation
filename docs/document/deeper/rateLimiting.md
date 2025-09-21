# 📊 Rate Limiting

## 📌 Pendahuluan

Laravel menyediakan **abstraksi rate limiting** yang mudah digunakan. Dengan rate limiter ini, Anda dapat membatasi frekuensi suatu aksi dalam jangka waktu tertentu menggunakan **cache aplikasi**.

> Jika tujuan Anda adalah membatasi **HTTP request** masuk, Anda juga bisa menggunakan **rate limiter middleware** Laravel.



## ⚙️ Konfigurasi Cache

Secara default, **rate limiter** menggunakan cache aplikasi yang telah didefinisikan di file konfigurasi `config/cache.php`. Namun, Anda bisa menentukan driver cache khusus untuk limiter dengan menambahkan key `limiter`:

```php
'default' => env('CACHE_STORE', 'database'),

'limiter' => 'redis',
```

🔹 Artinya, Laravel akan menggunakan Redis untuk menyimpan data rate limiting.



## 🚀 Penggunaan Dasar

Fasad `Illuminate\Support\Facades\RateLimiter` digunakan untuk berinteraksi dengan rate limiter.

### 1️⃣ Method `attempt`

Method `attempt` membatasi callback tertentu selama sejumlah detik yang ditentukan.

```php
use Illuminate\Support\Facades\RateLimiter;

$executed = RateLimiter::attempt(
    'send-message:'.$user->id,
    $perMinute = 5,
    function() {
        // Kirim pesan
    }
);

if (! $executed) {
    return 'Terlalu banyak pesan dikirim!';
}
```

**Keterangan:**

* `'send-message:'.$user->id` → key unik untuk aksi.
* `$perMinute = 5` → maksimal percobaan per menit.
* Callback → aksi yang ingin dibatasi.

Anda juga bisa menambahkan **decay rate** (waktu reset dalam detik):

```php
$executed = RateLimiter::attempt(
    'send-message:'.$user->id,
    $perTwoMinutes = 5,
    function() {
        // Kirim pesan
    },
    $decayRate = 120, // reset setiap 2 menit
);
```



## ✋ Menambah Percobaan Secara Manual

Selain `attempt`, Anda bisa mengelola percobaan rate limiter secara manual:

### 1️⃣ Cek terlalu banyak percobaan

```php
use Illuminate\Support\Facades\RateLimiter;

if (RateLimiter::tooManyAttempts('send-message:'.$user->id, $perMinute = 5)) {
    return 'Terlalu banyak percobaan!';
}
```

### 2️⃣ Menambah percobaan

```php
RateLimiter::increment('send-message:'.$user->id);

// Kirim pesan...
```

### 3️⃣ Mendapatkan sisa percobaan

```php
if (RateLimiter::remaining('send-message:'.$user->id, $perMinute = 5)) {
    RateLimiter::increment('send-message:'.$user->id);

    // Kirim pesan...
}
```

### 4️⃣ Menambah lebih dari satu percobaan

```php
RateLimiter::increment('send-message:'.$user->id, amount: 5);
```



## ⏳ Menentukan Ketersediaan Limiter

Jika key tidak memiliki percobaan tersisa, method `availableIn` mengembalikan sisa detik sampai percobaan tersedia kembali:

```php
if (RateLimiter::tooManyAttempts('send-message:'.$user->id, $perMinute = 5)) {
    $seconds = RateLimiter::availableIn('send-message:'.$user->id);

    return 'Coba lagi dalam '.$seconds.' detik.';
}

RateLimiter::increment('send-message:'.$user->id);

// Kirim pesan...
```

## 🗑️ Menghapus Percobaan (Reset)

Anda dapat mereset percobaan untuk key tertentu menggunakan method `clear`:

```php
use App\Models\Message;
use Illuminate\Support\Facades\RateLimiter;

/**
 * Tandai pesan sebagai terbaca.
 */
public function read(Message $message): Message
{
    $message->markAsRead();

    RateLimiter::clear('send-message:'.$message->user_id);

    return $message;
}
```

> Contoh ini menunjukkan bahwa percobaan reset bisa dilakukan ketika pesan sudah dibaca oleh penerima.



## ✅ Kesimpulan

* Rate limiting membantu **mengontrol frekuensi aksi tertentu**.
* Laravel memudahkan implementasi menggunakan **facade `RateLimiter`**.
* Anda bisa menggunakan **attempt, increment, remaining, tooManyAttempts, availableIn, dan clear** sesuai kebutuhan.
* Pastikan cache Laravel sudah dikonfigurasi dengan benar agar rate limiter bekerja optimal.



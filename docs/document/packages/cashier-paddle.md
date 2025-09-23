# 🛶 Laravel Cashier (Paddle)

Laravel Cashier Paddle menyediakan antarmuka yang ekspresif dan mudah untuk layanan langganan dan pembayaran Paddle. Ini menangani hampir semua kode langganan boilerplate yang biasanya Anda takutkan menulis. Selain manajemen langganan dasar, Cashier dapat menangani kupon, pergantian langganan, langganan "quantity", periode percobaan pembatalan, dan bahkan menghasilkan faktur dalam format PDF.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [Model Billing](#model-billing)
5. [Langganan](#langganan)
6. [Checkout](#checkout)
7. [Faktur](#faktur)
8. [Pelanggan](#pelanggan)
9. [Webhook](#webhook)
10. [Pajak](#pajak)
11. [Pengujian](#pengujian)

## 🎯 Pendahuluan

Laravel Cashier Paddle memungkinkan Anda untuk dengan mudah mengintegrasikan manajemen langganan dan pembayaran ke aplikasi Anda menggunakan platform Paddle. Dengan Cashier, Anda dapat melakukan berbagai operasi seperti membuat langganan, mengelola pelanggan, dan menghasilkan faktur.

### ✨ Fitur Utama
- Manajemen langganan
- Pembayaran sekali pakai
- Faktur otomatis
- Webhook handling
- Pajak otomatis
- Kupon dan diskon
- Trial period
- Pergantian langganan

### ⚠️ Catatan Penting
Cashier Paddle menggunakan Paddle's "PayPal Express Checkout" untuk pembayaran berulang. Paddle tidak mengizinkan pengguna untuk mengubah metode pembayaran yang ada untuk langganan saat ini. Jika pengguna ingin mengubah metode pembayaran mereka, Anda perlu membatalkan langganan mereka yang ada dan membuat yang baru.

## 📦 Instalasi

### 🎯 Menginstal Cashier Paddle
Untuk memulai, instal Cashier Paddle melalui Composer:

```bash
composer require laravel/cashier-paddle
```

### 🔧 Migrasi Database
Sebelum menggunakan Cashier, Anda perlu mempublikasikan dan menjalankan migrasi database:

```bash
php artisan vendor:publish --tag="cashier-paddle-migrations"
php artisan migrate
```

### 🔄 Menambahkan Billable Trait
Tambahkan trait `Billable` ke model Anda (biasanya model User):

```php
<?php

namespace App\Models;

use Laravel\Paddle\Billable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Billable;
}
```

## ⚙️ Konfigurasi

### 🔑 Kredensial Paddle
Setelah menginstal Cashier Paddle, Anda perlu mengkonfigurasi kredensial Paddle Anda. Kredensial ini dapat dikonfigurasi melalui file `.env` Anda:

```env
PADDLE_VENDOR_ID=your-paddle-vendor-id
PADDLE_VENDOR_AUTH_CODE=your-paddle-vendor-auth-code
PADDLE_PUBLIC_KEY="your-paddle-public-key"
PADDLE_SANDBOX=true
```

### 🌐 URL Notifikasi
Anda juga perlu mengkonfigurasi URL notifikasi Paddle dalam dashboard Paddle Anda ke:

```
https://your-domain.com/paddle/webhook
```

## 🧑‍💼 Model Billing

### 📋 Billable Trait
Trait `Billable` menyediakan metode untuk melakukan pengisian ulang, pemrosesan langganan, dan pengelolaan informasi pembayaran.

### 🎯 Contoh Penggunaan
```php
use App\Models\User;
use Illuminate\Http\Request;

Route::get('/user/invoice/{invoice}', function (Request $request, string $invoice) {
    return $request->user()->downloadInvoice($invoice);
});
```

## 🔄 Langganan

### 🚀 Membuat Langganan
Untuk membuat langganan, pertama-tama Anda harus membuat instance model billable Anda, yang biasanya merupakan instance `App\Models\User`. Setelah itu, Anda dapat menggunakan metode `newSubscription`:

```php
use Illuminate\Http\Request;

Route::get('/user/subscribe', function (Request $request) {
    $payLink = $request->user()->newSubscription('default', $planId)
                ->returnTo(route('dashboard'))
                ->create();

    return view('subscribe', ['payLink' => $payLink]);
});
```

### 🧪 Trial Period
Anda dapat menyediakan masa percobaan gratis kepada pelanggan Anda:

```php
$payLink = $user->newSubscription('default', $planId)
            ->returnTo(route('dashboard'))
            ->trialDays(10)
            ->create();
```

### 🔁 Mengelola Langganan
```php
// Mengecek status langganan
if ($user->subscribed('default')) {
    // User memiliki langganan aktif
}

// Membatalkan langganan
$user->subscription('default')->cancel();

// Mengecek apakah langganan dalam masa percobaan
if ($user->subscription('default')->onTrial()) {
    // Langganan sedang dalam masa percobaan
}
```

### 📈 Mengubah Langganan
```php
// Mengganti harga
$payLink = $user->subscription('default')
            ->swap($newPlanId)
            ->returnTo(route('dashboard'))
            ->create();
```

## 🛒 Checkout

### 🎯 Paddle Pay Links
Cashier Paddle menggunakan "Pay Links" untuk proses checkout:

```php
$payLink = $user->newSubscription('default', $planId)
            ->returnTo(route('dashboard'))
            ->create();

return view('subscribe', ['payLink' => $payLink]);
```

### 💰 Pembayaran Sekali Pakai
Untuk pembayaran sekali pakai:

```php
$payLink = $user->chargeProduct($productId, [
    'returnTo' => route('dashboard'),
]);

return view('checkout', ['payLink' => $payLink]);
```

### 📦 Produk dengan Kuantitas
```php
$payLink = $user->chargeProduct($productId, [
    'quantity' => 5,
    'returnTo' => route('dashboard'),
]);
```

## 🧾 Faktur

### 📄 Menghasilkan Faktur
Cashier memungkinkan Anda untuk dengan mudah menghasilkan faktur dalam format PDF:

```php
Route::get('/user/invoice/{invoice}', function (Request $request, string $invoice) {
    return $request->user()->downloadInvoice($invoice);
});
```

### 📋 Mendaftar Faktur
```php
$invoices = $user->invoices();
```

### 🔍 Mencari Faktur Spesifik
```php
$invoice = $user->findInvoice($invoiceId);
```

## 👥 Pelanggan

### 🆕 Membuat Pelanggan
```php
$customer = $user->createAsCustomer();
```

### 🔄 Memperbarui Informasi Pelanggan
```php
$user->updatePaddleCustomer([
    'email' => 'new@example.com',
    'country' => 'US',
]);
```

### 🔗 Menghubungkan dengan Paddle Customer
```php
$user->paddleCustomer($options = []);
```

## 📡 Webhook

### 🛠️ Menangani Webhook Paddle
Cashier secara otomatis menangani pembatalan langganan yang gagal membayar dan informasi pelanggan lainnya melalui webhook.

### 🎯 Mengatur Endpoint Webhook
Anda perlu mengkonfigurasi endpoint webhook Anda di dashboard Paddle untuk mengarah ke `/paddle/webhook`.

### 🔐 Verifikasi Webhook
Cashier Paddle secara otomatis memverifikasi webhook menggunakan kunci publik Paddle Anda.

## 💰 Pajak

### 📊 Pajak Otomatis
Cashier Paddle menggunakan sistem pajak Paddle untuk menghitung dan mengumpulkan pajak secara otomatis:

```php
$payLink = $user->newSubscription('default', $planId)
            ->country('GB')
            ->postcode('JE4 5GB')
            ->returnTo(route('dashboard'))
            ->create();
```

### 🌍 Pajak Berbasis Lokasi
```php
$payLink = $user->chargeProduct($productId, [
    'country' => 'GB',
    'postcode' => 'JE4 5GB',
    'returnTo' => route('dashboard'),
]);
```

## 🧪 Pengujian

### 🎯 Mode Sandbox
Aktifkan mode sandbox untuk pengujian:

```env
PADDLE_SANDBOX=true
```

### 🧪 Data Pengujian
Gunakan data pengujian berikut untuk pengembangan:
- Sandbox Vendor ID
- Sandbox Auth Code
- Sandbox Public Key

## 🧠 Kesimpulan

Laravel Cashier Paddle menyediakan cara yang sederhana dan ekspresif untuk mengelola langganan dan pembayaran Paddle. Dengan fitur-fiturnya yang lengkap, Anda dapat dengan mudah membangun aplikasi berbasis langganan yang kuat dan aman.

### 🔑 Keuntungan Utama
- Integrasi yang mulus dengan Paddle
- Manajemen langganan yang lengkap
- Faktur otomatis
- Webhook handling yang otomatis
- Dukungan untuk pembayaran sekali pakai dan berulang
- Integrasi dengan sistem pajak Paddle

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Cashier Paddle untuk mengelola pembayaran dan langganan dalam aplikasi Laravel Anda.
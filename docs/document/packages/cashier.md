# 💳 Laravel Cashier (Stripe)

Laravel Cashier menyediakan antarmuka yang ekspresif dan mudah untuk layanan langganan dan pembayaran Stripe. Ini menangani hampir semua kode langganan boilerplate yang biasanya Anda takutkan menulis. Selain manajemen langganan dasar, Cashier dapat menangani kupon, pergantian langganan, langganan "quantity", periode percobaan pembatalan, dan bahkan menghasilkan faktur dalam format PDF.

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

Laravel Cashier memungkinkan Anda untuk dengan mudah mengintegrasikan manajemen langganan dan pembayaran ke aplikasi Anda. Dengan Cashier, Anda dapat melakukan berbagai operasi seperti membuat langganan, mengelola pelanggan, dan menghasilkan faktur.

### ✨ Fitur Utama
- Manajemen langganan
- Pembayaran sekali pakai
- Faktur otomatis
- Webhook handling
- Pajak otomatis
- Kupon dan diskon
- Trial period
- Pergantian langganan

## 📦 Instalasi

### 🎯 Menginstal Cashier
Untuk memulai, instal Cashier melalui Composer:

```bash
composer require laravel/cashier
```

### 🔧 Migrasi Database
Sebelum menggunakan Cashier, Anda perlu mempublikasikan dan menjalankan migrasi database:

```bash
php artisan vendor:publish --tag="cashier-migrations"
php artisan migrate
```

### 🔄 Menambahkan Billable Trait
Tambahkan trait `Billable` ke model Anda (biasanya model User):

```php
<?php

namespace App\Models;

use Laravel\Cashier\Billable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Billable;
}
```

## ⚙️ Konfigurasi

### 🔑 Kredensial Stripe
Setelah menginstal Cashier, Anda perlu mengkonfigurasi kredensial Stripe Anda. Kredensial ini dapat dikonfigurasi melalui file `.env` Anda:

```env
STRIPE_KEY=your-stripe-key
STRIPE_SECRET=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

### 🌐 Stripe Checkout
Untuk menggunakan Stripe Checkout, Anda perlu mengkonfigurasi URL dalam file `.env` Anda:

```env
CASHIER_CURRENCY=usd
CASHIER_CURRENCY_LOCALE=en
APP_URL=http://localhost:8000
```

## 🧑‍💼 Model Billing

### 📋 Billable Trait
Trait `Billable` menyediakan metode untuk melakukan pengisian ulang, pemrosesan langganan, dan pengelolaan informasi pembayaran.

### 🎯 Contoh Penggunaan
```php
use App\Models\User;
use Illuminate\Http\Request;

Route::get('/user/invoice/{invoice}', function (Request $request, string $invoice) {
    return $request->user()->downloadInvoice($invoice, [
        'vendor' => 'Your Company',
        'product' => 'Your Product',
    ]);
});
```

## 🔄 Langganan

### 🚀 Membuat Langganan
Untuk membuat langganan, pertama-tama Anda harus membuat instance model billable Anda, yang biasanya merupakan instance `App\Models\User`. Setelah itu, Anda dapat menggunakan metode `newSubscription`:

```php
use Illuminate\Http\Request;

Route::get('/user/subscribe', function (Request $request) {
    $request->user()->newSubscription('default', 'price_xxx')
                ->create($request->paymentMethodId);

    return redirect('/dashboard');
});
```

### 🧪 Trial Period
Anda dapat menyediakan masa percobaan gratis kepada pelanggan Anda:

```php
$user->newSubscription('default', 'price_xxx')
        ->trialDays(10)
        ->create($paymentMethod);
```

### 🔁 Mengelola Langganan
```php
// Mengecek status langganan
if ($user->subscribed('default')) {
    // User memiliki langganan aktif
}

// Membatalkan langganan
$user->subscription('default')->cancel();

// Membatalkan segera
$user->subscription('default')->cancelNow();
```

### 📈 Mengubah Langganan
```php
// Mengganti harga
$user->subscription('default')->swap('price_yyy');

// Menambah kuantitas
$user->subscription('default')->incrementQuantity(5);

// Mengurangi kuantitas
$user->subscription('default')->decrementQuantity(2);
```

## 🛒 Checkout

### 🎯 Stripe Checkout Sessions
Cashier menyediakan metode yang mudah untuk membuat Stripe Checkout Sessions:

```php
$checkout = $user->newSubscription('default', 'price_xxx')
            ->checkout([
                'success_url' => route('your-success-route'),
                'cancel_url' => route('your-cancel-route'),
            ]);

return redirect($checkout->url);
```

### 💰 Pembayaran Sekali Pakai
Untuk pembayaran sekali pakai:

```php
$checkout = $user->checkout(['price_xxx'], [
    'success_url' => route('your-success-route'),
    'cancel_url' => route('your-cancel-route'),
]);

return redirect($checkout->url);
```

## 🧾 Faktur

### 📄 Menghasilkan Faktur
Cashier memungkinkan Anda untuk dengan mudah menghasilkan faktur dalam format PDF:

```php
Route::get('/user/invoice/{invoice}', function (Request $request, string $invoice) {
    return $request->user()->downloadInvoice($invoice, [
        'vendor' => 'Your Company',
        'product' => 'Your Product',
    ]);
});
```

### 📧 Mengirim Faktur Melalui Email
```php
$request->user()->emailInvoice($invoice, [
    'vendor' => 'Your Company',
    'product' => 'Your Product',
]);
```

### 📋 Mendaftar Faktur
```php
$invoices = $user->invoices();
```

## 👥 Pelanggan

### 🆕 Membuat Pelanggan
```php
$customer = $user->createAsStripeCustomer();
```

### 🔄 Memperbarui Informasi Pelanggan
```php
$user->updateStripeCustomer(['address' => 'New Address']);
```

### 💳 Mengelola Metode Pembayaran
```php
// Menambahkan metode pembayaran
$user->addPaymentMethod($paymentMethod);

// Mendapatkan metode pembayaran default
$defaultPaymentMethod = $user->defaultPaymentMethod();

// Mengatur metode pembayaran default
$user->updateDefaultPaymentMethod($paymentMethod);
```

## 📡 Webhook

### 🛠️ Menangani Webhook Stripe
Cashier secara otomatis menangani pembatalan langganan yang gagal membayar dan informasi pelanggan lainnya melalui webhook.

```php
// app/Http/Middleware/VerifyCsrfToken.php
protected $except = [
    'stripe/*',
];
```

### 🎯 Mengatur Endpoint Webhook
Anda perlu mengkonfigurasi endpoint webhook Anda di dashboard Stripe untuk mengarah ke `/stripe/webhook`.

## 💰 Pajak

### 📊 Pajak Otomatis
Cashier menggunakan Stripe Tax untuk menghitung dan mengumpulkan pajak secara otomatis:

```php
$user->newSubscription('default', 'price_xxx')
        ->withTaxRates(['txr_xxx'])
        ->create($paymentMethod);
```

### 🌍 Pajak Berbasis Lokasi
```php
$user->newSubscription('default', 'price_xxx')
        ->withTax(new TaxConfiguration([
            'location' => new TaxLocation('US', 'CA'),
        ]))
        ->create($paymentMethod);
```

## 🧪 Pengujian

### 🎯 Menggunakan Stripe CLI
Untuk pengujian webhook, Anda dapat menggunakan Stripe CLI:

```bash
stripe listen --forward-to localhost:8000/stripe/webhook
```

### 🧪 Mode Pengujian
Pastikan Anda menggunakan kunci pengujian Stripe dalam lingkungan pengembangan:

```env
STRIPE_KEY=pk_test_xxx
STRIPE_SECRET=sk_test_xxx
```

## 🧠 Kesimpulan

Laravel Cashier menyediakan cara yang sederhana dan ekspresif untuk mengelola langganan dan pembayaran Stripe. Dengan fitur-fiturnya yang lengkap, Anda dapat dengan mudah membangun aplikasi berbasis langganan yang kuat dan aman.

### 🔑 Keuntungan Utama
- Integrasi yang mulus dengan Stripe
- Manajemen langganan yang lengkap
- Faktur otomatis dan pengelolaan pajak
- Webhook handling yang otomatis
- Dukungan untuk pembayaran sekali pakai dan berulang
- Integrasi dengan Stripe Checkout

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Cashier untuk mengelola pembayaran dan langganan dalam aplikasi Laravel Anda.
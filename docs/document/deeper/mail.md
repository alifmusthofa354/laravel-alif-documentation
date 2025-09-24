# 📧 Email di Laravel: Panduan Lengkap dari Guru Kesayanganmu (Edisi Pengiriman Cepat & Aman)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel yang super seru. Hari ini kita akan membahas salah satu fitur penting yang sering digunakan dalam aplikasi web - **Email**. Setiap kali kamu ingin memberi notifikasi, konfirmasi pendaftaran, atau pengingat kepada pengguna, kamu pasti akan mengandalkan sistem email. 

Di edisi ini, kita akan kupas tuntas **semua detail** tentang pengiriman email di Laravel, tapi setiap topik akan Guru ajarkan dengan sabar. Siap? Ayo kita mulai petualangan komunikasi digital ini!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Email di Laravel Itu Sebenarnya?

**Analogi:** Bayangkan kamu seorang manajer restoran yang harus mengabari pelanggan tentang pesanan yang sudah siap. Kamu bisa saja berdiri di depan restoran dan berteriak satu per satu, atau kamu bisa mengirimkan pesan lewat aplikasi pesan instan. **Email di Laravel itu seperti asisten pribadi yang tahu cara mengirim pesan ke siapa pun, kapan pun, dan dengan format yang cantik.**

**Mengapa ini penting?** Karena komunikasi dengan pengguna adalah bagian penting dari aplikasi. Tanpa notifikasi email yang baik, pengguna bisa merasa ditinggalkan atau bingung.

**Bagaimana cara kerjanya?** Laravel dengan bantuan **Symfony Mailer** akan:
1.  **Membuat pesan** sesuai dengan yang kamu inginkan.
2.  **Mengirimkannya melalui layanan email** (SMTP, Mailgun, Postmark, dll).
3.  **Memastikan pesan sampai ke tujuan** dengan format yang rapi dan cantik.

Jadi, alur kerja (workflow) pengiriman email kita menjadi sangat rapi:

`➡️ Mailable (Pesanmu) -> 📧 Laravel Mailer -> 🌐 Service Email (SMTP/API) -> ✅ Email Sampai ke Pengguna`

Tanpa sistem email yang baik, semua notifikasi akan tumpang tindih di file log atau bahkan tidak pernah dikirim. 😵

### 2. ✍️ Resep Pertamamu: Mengirim Email dari Nol

Ini adalah fondasi paling dasar. Mari kita buat email pertamamu dari nol, langkah demi langkah.

#### Langkah 1️⃣: Siapkan Alamat Email di Konfigurasi (Config)
**Mengapa?** Setiap pengiriman email butuh konfigurasi pengirim dan layanan email.

**Bagaimana?** Atur file `.env` dan `config/mail.php`:

**.env:**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

**config/mail.php:**
```php
// config/mail.php
return [
    'default' => env('MAIL_MAILER', 'smtp'),
    
    'mailers' => [
        'smtp' => [
            'transport' => 'smtp',
            'url' => env('MAIL_URL'),
            'host' => env('MAIL_HOST', 'smtp.gmail.com'),
            'port' => env('MAIL_PORT', 587),
            'encryption' => env('MAIL_ENCRYPTION', 'tls'),
            'username' => env('MAIL_USERNAME'),
            'password' => env('MAIL_PASSWORD'),
            'timeout' => null,
            'local_domain' => env('MAIL_EHLO_DOMAIN'),
        ],
        
        // dan konfigurasi lainnya...
    ],
    
    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
        'name' => env('MAIL_FROM_NAME', 'Example'),
    ],
];
```

#### Langkah 2️⃣: Panggil Sang Kurir Email (Mailable)
**Mengapa?** Kita butuh "kurir" untuk membawa pesan kita ke pengguna.

**Bagaimana?** Buat Mailable dengan artisan:
```bash
php artisan make:mail WelcomeEmail
```

#### Langkah 3️⃣: Beri Surat dan Tujuan pada Kurir (Isi Mailable)
**Mengapa?** Kurir yang baru dibuat masih kosong. Kita perlu memberinya surat (isi email) dan tujuan (alamat penerima).

**Bagaimana?** Buka `app/Mail/WelcomeEmail.php` dan isi kontennya:
```php
<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;

class WelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('admin@domain.com', 'Admin Dapur Laravel'),
            subject: 'Selamat Datang di Dunia Laravel!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.welcome',
        );
    }
}
```

#### Langkah 4️⃣: Siapkan Template Surat (View)
**Mengapa?** Pesan sudah siap, sekarang harus ditampilkan dengan format HTML yang cantik.

**Bagaimana?** Buat file di `resources/views/emails/welcome.blade.php`.
```blade
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Selamat Datang!</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px; }
        .content { padding: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Selamat Datang, {{ $user->name }}!</h1>
            <p>Dunia Laravel menantimu dengan penuh keajaiban</p>
        </div>
        <div class="content">
            <h2>Terima kasih sudah bergabung dengan kami! 🎉</h2>
            <p>Hai {{ $user->name }},</p>
            <p>Kami sangat senang kamu bergabung dengan komunitas Laravel terbesar. Di sini kamu akan belajar segalanya tentang pengembangan web modern dengan Laravel.</p>
            <p>Untuk memulai, kamu bisa:</p>
            <ul>
                <li>🔍 Eksplorasi dokumentasi kami</li>
                <li>💬 Bergabung dengan forum komunitas</li>
                <li>📚 Ikuti kursus pemula kami</li>
            </ul>
            
            <p style="text-align: center;">
                <a href="{{ route('dashboard') }}" class="button">Akses Dashboard</a>
            </p>
            
            <p>Terus semangat belajar dan berkembang!</p>
            <p>Salam,<br><strong>Tim Dapur Laravel</strong></p>
        </div>
    </div>
</body>
</html>
```

Selesai! 🎉 Sekarang, kamu bisa mengirim email ini dari controller atau service:
```php
use App\Mail\WelcomeEmail;
use Illuminate\Support\Facades\Mail;

// Kirim email ke pengguna baru
Mail::to($newUser)->send(new WelcomeEmail($newUser));
```

### 3. ⚡ Mailable Spesialis (Markdown Mailable)

**Analogi:** Bayangkan kamu punya template surat formal yang bisa digunakan untuk berbagai keperluan, tapi tetap terlihat profesional dan rapi.

**Mengapa ini ada?** Untuk membuat email yang responsif dan konsisten dengan komponen Laravel seperti tombol, panel, dll tanpa harus membuat HTML dari awal.

**Bagaimana?** Gunakan flag `--markdown`:
```bash
php artisan make:mail OrderConfirmation --markdown=mail.order-confirmation
```

Mailable ini akan otomatis menggunakan template Markdown Laravel yang responsif dan sudah diatur agar terlihat cantik di semua perangkat.

**Contoh Mailable dengan Markdown:**
```php
<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;

class OrderConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    public function __construct($order)
    {
        $this->order = $order;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('admin@domain.com', 'Laravel Store'),
            subject: 'Konfirmasi Pesanan #' . $this->order->id,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.order-confirmation',
        );
    }
}
```

**Template Markdown:**
```blade
@component('mail::layout')
    {{-- Header --}}
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
            Laravel Store
        @endcomponent
    @endslot

    {{-- Body --}}
    # Konfirmasi Pesanan

    Terima kasih atas pesanan Anda. Berikut adalah detail pesanan:

    @component('mail::table')
        | Produk | Jumlah | Harga |
        |:-------|:------:|------:|
        @foreach($order->items as $item)
        | {{ $item->name }} | {{ $item->quantity }} | Rp {{ number_format($item->price, 0, ',', '.') }} |
        @endforeach
        | **Total** | **{{ $order->items->sum('quantity') }}** | **Rp {{ number_format($order->total, 0, ',', '.') }}** |
    @endcomponent

    {{-- Subcopy --}}
    @slot('subcopy')
        @component('mail::subcopy')
            Jika kamu mengalami kesulitan dengan pesanan ini, silakan balas email ini untuk bantuan lebih lanjut.
        @endcomponent
    @endslot

    {{-- Footer --}}
    @slot('footer')
        @component('mail::footer')
            © {{ date('Y') }} Laravel Store. Hak Cipta Dilindungi.
        @endcomponent
    @endslot
@endcomponent
```

---

## Bagian 2: Driver Email - Mesin Pengirimanmu 🚚

### 4. 📦 Apa Itu Driver Email?

**Analogi:** Bayangkan kamu ingin mengirimkan hadiah ke teman. Kamu bisa menggunakan jasa kurir A, B, atau C. Masing-masing punya kelebihan: yang satu cepat, yang satu murah, yang satu andal. **Driver Email itu seperti pilihan jasa kurir-mu di Laravel**.

**Mengapa ini keren?** Karena kamu bisa memilih layanan pengiriman yang paling cocok dengan kebutuhan aplikasimu.

**Bagaimana?** Laravel menyediakan berbagai driver yang bisa kamu gunakan: `smtp`, `mailgun`, `postmark`, `ses`, `sendmail`, dll.

### 5. 🌀 Driver SMTP - Kurir Tradisional

**Analogi:** Ini seperti mengirim surat lewat kantor pos. Cukup andal dan bisa digunakan secara umum.

**Mengapa ini ada?** Karena ini adalah metode pengiriman email standar yang paling umum digunakan.

**Bagaimana?** Konfigurasi di `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
```

**Contoh Lengkap SMTP Mailable:**
```php
<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Headers;

class PasswordReset extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $token;

    public function __construct($user, $token)
    {
        $this->user = $user;
        $this->token = $token;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('no-reply@laravelapp.com', 'Laravel App'),
            subject: 'Reset Password',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.password-reset',
        );
    }

    public function headers(): Headers
    {
        return new Headers(
            text: [
                'X-Priority' => '3',
                'X-Mailer' => 'Laravel Mailer',
            ]
        );
    }
}
```

### 6. 🚀 Driver API-based (Postmark, Mailgun, Resend) - Kurir Modern

**Analogi:** Ini seperti menggunakan layanan kurir ekspres yang menggunakan teknologi API. Lebih cepat, lebih aman, dan lebih terukur.

**Mengapa ini keren?** Karena lebih cepat, bisa diintegrasikan dengan tracking, analytics, dan lebih andal secara umum.

**Bagaimana?** Install package dan konfigurasi service:

#### **6.1 Konfigurasi Postmark**
1. Install package:
```bash
composer require symfony/postmark-mailer symfony/http-client
```

2. Konfigurasi `config/mail.php`:
```php
'default' => env('MAIL_MAILER', 'postmark'),

'postmark' => [
    'transport' => 'postmark',
    'message_stream_id' => env('POSTMARK_MESSAGE_STREAM_ID'),
],
```

3. Konfigurasi `config/services.php`:
```php
'postmark' => [
    'token' => env('POSTMARK_TOKEN'),
],
```

.env:
```env
MAIL_MAILER=postmark
POSTMARK_TOKEN=your-postmark-token-here
```

#### **6.2 Konfigurasi Mailgun**
1. Install package:
```bash
composer require symfony/mailgun-mailer symfony/http-client
```

2. Konfigurasi:
```php
'default' => env('MAIL_MAILER', 'mailgun'),

'mailgun' => [
    'transport' => 'mailgun',
],
```

Di `config/services.php`:
```php
'mailgun' => [
    'domain' => env('MAILGUN_DOMAIN'),
    'secret' => env('MAILGUN_SECRET'),
    'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    'scheme' => 'https',
],
```

.env:
```env
MAIL_MAILER=mailgun
MAILGUN_DOMAIN=your-domain.com
MAILGUN_SECRET=your-mailgun-secret
```

#### **6.3 Konfigurasi Resend**
1. Install package:
```bash
composer require resend/resend-php
```

2. Konfigurasi:
```php
'default' => env('MAIL_MAILER', 'resend'),

'resend' => [
    'transport' => 'resend',
],
```

Di `config/services.php`:
```php
'resend' => [
    'key' => env('RESEND_KEY'),
],
```

.env:
```env
MAIL_MAILER=resend
RESEND_KEY=your-resend-api-key
```

### 7. 🌐 Amazon SES - Kurir Skala Besar

**Analogi:** Ini seperti jasa logistik besar yang menangani pengiriman dalam jumlah sangat besar dengan biaya terjangkau.

**Mengapa ini ada?** Karena Amazon SES sangat andal dan murah untuk email dalam jumlah besar.

**Bagaimana?** 
```bash
composer require aws/aws-sdk-php
```

Konfigurasi:
```php
'default' => env('MAIL_MAILER', 'ses'),

'ses' => [
    'transport' => 'ses',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
],
```

.env:
```env
MAIL_MAILER=ses
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_DEFAULT_REGION=us-east-1
```

### 8. 🛠️ Failover dan Round Robin - Sistem Backup & Distribusi

#### **8.1 Failover - Sistem Backup**
**Analogi:** Seperti punya cadangan baterai jika listrik mati. Jika kurir utama tidak bisa, pakai kurir cadangan.

**Mengapa?** Untuk memastikan email tetap terkirim meski ada masalah dengan layanan utama.

**Bagaimana?**
```php
'failover' => [
    'transport' => 'failover',
    'mailers' => ['postmark', 'mailgun', 'sendmail'],
],
```

Kemudian guna di `.env`:
```env
MAIL_MAILER=failover
```

#### **8.2 Round Robin - Distribusi Beban**
**Analogi:** Seperti punya dua kurir yang bergantian melayani pelanggan agar keduanya tidak kelebihan beban.

**Mengapa?** Untuk mendistribusikan pengiriman email ke beberapa layanan secara bergantian.

**Bagaimana?**
```php
'roundrobin' => [
    'transport' => 'roundrobin',
    'mailers' => ['ses', 'postmark'],
],
```

---

## Bagian 3: Membuat Mailable yang Kuat & Cantik 🎨

### 9. 👨‍👩‍👧 Membuat Mailable dengan Berbagai Fitur

**Analogi:** Seperti menulis surat yang bagus, bukan hanya teks biasa, tapi juga ada hal-hal tambahan seperti lampiran, prioritas, dan informasi tambahan.

**Mengapa?** Karena email modern sering membutuhkan hal-hal tambahan seperti lampiran, header kustom, dll.

**Bagaimana?** Kita bisa menambahkan berbagai fitur ke dalam Mailable:

#### **9.1 Konfigurasi Lengkap Mailable**
```php
<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Mail\Mailables\Attachment;

class CompleteMailableExample extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $order;

    public function __construct($user, $order)
    {
        $this->user = $user;
        $this->order = $order;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('support@laravelapp.com', 'Laravel Support'),
            subject: 'Detail Pesanan #' . $this->order->id,
            tags: ['order', 'confirmation'],
            metadata: [
                'order_id' => $this->order->id,
                'user_id' => $this->user->id,
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.complete-example',
            with: [
                'userName' => $this->user->name,
                'orderId' => $this->order->id,
                'orderTotal' => $this->order->total,
            ],
        );
    }

    public function headers(): Headers
    {
        return new Headers(
            text: [
                'X-Custom-Header' => 'Value',
                'X-Priority' => '3',
            ]
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromPath(storage_path('app/invoices/' . $this->order->id . '.pdf'))
                ->as('invoice-' . $this->order->id . '.pdf')
                ->withMime('application/pdf'),
        ];
    }
}
```

#### **9.2 Menyusun Data untuk Ditampilkan**
Kamu bisa mengirim data ke view dengan beberapa cara:

**Via Public Property (diakses langsung di view):**
```php
public function __construct(public User $user, public Order $order) {}
```

**Di view:**
```blade
<h1>Halo {{ $user->name }}!</h1>
<p>Pesanan Anda: #{{ $order->id }}</p>
```

**Via Parameter `with` di Content:**
```php
public function content(): Content
{
    return new Content(
        view: 'emails.order-confirmation',
        with: [
            'userName' => $this->user->name,
            'orderId' => $this->order->id,
            'orderItems' => $this->order->items->pluck('name')->toArray(),
        ]
    );
}
```

### 10. 📎 Lampiran (Attachments) - Menyertakan File

**Analogi:** Ini seperti menyertakan bukti pembayaran atau dokumen penting dalam surat.

**Mengapa?** Karena seringkali kita perlu mengirim file seperti faktur, laporan, atau dokumen lainnya.

**Bagaimana?** Gunakan kelas `Attachment`:

```php
use Illuminate\Mail\Mailables\Attachment;

public function attachments(): array
{
    return [
        // Lampirkan file dari path
        Attachment::fromPath('/path/to/file.pdf')
            ->as('document.pdf')
            ->withMime('application/pdf'),

        // Lampirkan file dari string
        Attachment::fromString('Content of text file', 'info.txt')
            ->withMime('text/plain'),

        // Lampirkan file dari storage
        Attachment::fromStorage('/path/to/file.pdf')
            ->as('invoice.pdf'),

        // Lampirkan file dari storage disk tertentu
        Attachment::fromStorageDisk('s3', 'path/to/file.pdf'),
    ];
}
```

### 11. 🎨 Template Email - Membuat Tampilan yang Cantik

#### **11.1 Template HTML Biasa**
```blade
{{-- resources/views/emails/order-shipped.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <title>Pesanan Dikirim</title>
    <style>
        .email-container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Pesanan Dikirim!</h1>
        </div>
        <div class="content">
            <p>Hai {{ $order->user->name }},</p>
            <p>Pesanan Anda (ID: #{{ $order->id }}) telah dikirimkan dan sedang dalam perjalanan.</p>
            <p>Estimasi tiba: {{ $order->estimated_delivery }}</p>
            <p><strong>Terima kasih atas kepercayaan Anda!</strong></p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Laravel Store. Hak Cipta Dilindungi.</p>
        </div>
    </div>
</body>
</html>
```

#### **11.2 Template Markdown (Lebih Mudah dan Responsif)**
```blade
{{-- resources/views/emails/order-shipped.blade.php --}}
@component('mail::message')
# Pesanan Dikirim! 🚚

Hai {{ $order->user->name }},

Pesanan Anda (ID: #{{ $order->id }}) telah dikirimkan dan sedang dalam perjalanan.

@component('mail::panel')
**Estimasi Tiba:** {{ $order->estimated_delivery }}
@endcomponent

@component('mail::button', ['url' => route('orders.show', $order)])
Lacak Pesanan
@endcomponent

Terima kasih atas kepercayaan Anda!

Terima kasih,<br>
{{ config('app.name') }}
@endcomponent
```

### 12. 🧪 Testing Mailable - Memastikan Semuanya Berjalan Sempurna

**Analogi:** Seperti mencoba surat di laboratorium sebelum mengirimnya ke dunia nyata.

**Mengapa?** Karena kamu harus yakin bahwa email yang dikirim tampil dengan benar dan berisi informasi yang akurat.

**Bagaimana?** Laravel menyediakan berbagai metode untuk testing:

#### **12.1 Menguji Isi Mailable**
```php
<?php

namespace Tests\Unit;

use App\Mail\OrderShipped;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MailableTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_contains_correct_content()
    {
        $user = User::factory()->create(['name' => 'John Doe', 'email' => 'john@example.com']);
        $order = Order::factory()->create(['user_id' => $user->id, 'id' => 123]);

        $mailable = new OrderShipped($order);

        $mailable->assertSeeInHtml($user->name);
        $mailable->assertSeeInHtml('#123');
        $mailable->assertSeeInText($user->name);
        $mailable->assertFrom('support@laravelapp.com');
        $mailable->assertSubject('Pesanan Dikirim!');
    }
}
```

#### **12.2 Menguji Pengiriman Email**
```php
<?php

namespace Tests\Feature;

use App\Mail\OrderShipped;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class EmailSendingTest extends TestCase
{
    /** @test */
    public function it_sends_order_shipped_email()
    {
        Mail::fake();

        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        Mail::to($user)->send(new OrderShipped($order));

        Mail::assertSent(OrderShipped::class, function ($mail) use ($user, $order) {
            return $mail->hasTo($user->email) && $mail->order->id === $order->id;
        });
    }

    /** @test */
    public function it_queues_order_shipped_email()
    {
        Mail::fake();

        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        Mail::to($user)->queue(new OrderShipped($order));

        Mail::assertQueued(OrderShipped::class);
    }
}
```

---

## Bagian 4: Jurus Tingkat Lanjut - Fitur Lanjutan Email 🚀

### 13. 👮 Queueing Email - Jangan Biarkan Pengiriman Membuat Aplikasi Lambat!

**Analogi:** Bayangkan kamu melayani pelanggan di kasir. Kalau setiap pengiriman email harus menunggu dulu (bisa 1-2 detik), pelanggan harus menunggu lama. Tapi kalau kamu kirimkan ke kurir untuk dikirim nanti, pelanggan bisa dilayani segera.

**Mengapa?** Karena pengiriman email bisa memperlambat respon aplikasi. Dengan queues, email dikirim di latar belakang.

**Bagaimana?** Gunakan `queue()` alih-alih `send()`:

```php
// Kirim langsung (bisa memperlambat respon)
Mail::to($user)->send(new OrderShipped($order));

// Kirim ke queue (cepat, pengiriman di belakang layar)
Mail::to($user)->queue(new OrderShipped($order));

// Kirim nanti (setelah 10 menit)
Mail::to($user)->later(now()->addMinutes(10), new OrderShipped($order));
```

#### **13.1 Membuat Mailable Selalu Dikirim ke Queue**
```php
<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;  // Tambahkan ini
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;

class HighVolumeEmail extends Mailable implements ShouldQueue  // Tambahkan ini
{
    use Queueable, SerializesModels;

    public $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('noreply@laravelapp.com', 'Laravel App'),
            subject: 'Email Berisi Banyak Data',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.high-volume',
        );
    }
}
```

### 14. 🎨 Custom Transport - Membuat Kurir Khusus

**Analogi:** Terkadang kamu ingin menggunakan kurir sendiri dengan aturan dan cara kerja khusus, bukan menggunakan jasa kurir standar.

**Mengapa?** Karena kamu mungkin perlu menggunakan layanan email khusus yang tidak disediakan Laravel secara default.

**Bagaimana?** Buat kelas transport custom:

```php
<?php

namespace App\Mail\Transports;

use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mime\Message;

class CustomApiTransport extends AbstractTransport
{
    protected $client;

    public function __construct($client)
    {
        $this->client = $client;
        parent::__construct();
    }

    protected function doSend(SentMessage $message): void
    {
        $email = [
            'to' => $this->getRecipients($message),
            'subject' => $message->getOriginalMessage()->getSubject(),
            'body' => $message->getOriginalMessage()->getBody()->getBody(),
        ];

        // Kirim email lewat API kustom
        $this->client->sendEmail($email);
    }

    public function __toString(): string
    {
        return 'customapi';
    }

    private function getRecipients(SentMessage $message): array
    {
        $recipients = [];
        foreach ($message->getOriginalMessage()->getTo() as $address) {
            $recipients[] = $address->getAddress();
        }
        return $recipients;
    }
}
```

Daftarkan di `AppServiceProvider`:

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Mail;
use App\Mail\Transports\CustomApiTransport;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Mail::extend('customapi', function () {
            $client = new YourCustomApiClient(config('services.customapi.key'));
            return new CustomApiTransport($client);
        });
    }
}
```

### 15. 🎯 Personalisasi Email - Membuat Setiap Email Terasa Spesial

**Analogi:** Seperti menulis surat yang berbeda untuk setiap teman dengan menyebutkan hal-hal spesifik tentang mereka.

**Mengapa?** Karena email yang dipersonalisasi membuat pengguna merasa lebih dihargai dan meningkatkan engagement.

**Bagaimana?** Kirim data spesifik pengguna ke mailable:

```php
<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;

class PersonalizedWelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $recommendedProducts;

    public function __construct($user)
    {
        $this->user = $user;
        $this->recommendedProducts = $this->getRecommendationsForUser($user);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('welcome@laravelstore.com', 'Laravel Store'),
            subject: 'Selamat Datang, ' . $this->user->name . '! Rekomendasi Untukmu',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.personalized-welcome',
            with: [
                'userName' => $this->user->name,
                'userLevel' => $this->getUserLevel($this->user),
                'recommendedProducts' => $this->recommendedProducts,
                'personalOffer' => $this->getPersonalOffer($this->user),
            ],
        );
    }

    private function getRecommendationsForUser($user)
    {
        // Logika untuk mendapatkan rekomendasi produk
        return Product::where('category', $user->preferred_category)
            ->limit(3)
            ->get();
    }

    private function getUserLevel($user)
    {
        if ($user->total_spent > 1000000) {
            return 'VIP';
        } elseif ($user->total_spent > 500000) {
            return 'Premium';
        }
        return 'Regular';
    }

    private function getPersonalOffer($user)
    {
        return $user->total_spent > 1000000 ? '20% OFF' : '10% OFF';
    }
}
```

### 16. 🛡️ Keamanan Email - Perlindungan Ekstra

**Analogi:** Seperti memberi label "Confidential" dan "Handle with Care" pada surat penting agar tidak disalahgunakan.

**Mengapa?** Karena email bisa menjadi target serangan dan membocorkan informasi sensitif.

**Bagaimana?** Beberapa praktik keamanan untuk email:

#### **16.1 Validasi Alamat Email**
```php
// Di form request atau sebelum mengirim email
public function sendNotification($request)
{
    $request->validate([
        'email' => 'required|email|exists:users,email',
    ]);

    $user = User::where('email', $request->email)->first();
    Mail::to($user)->send(new NotificationEmail($user));
}
```

#### **16.2 Gunakan Token untuk Link Aman**
```php
// Dalam mailable
public function content(): Content
{
    $unsubscribeToken = hash_hmac('sha256', $this->user->email, config('app.key'));
    
    return new Content(
        view: 'emails.notification',
        with: [
            'unsubscribeUrl' => url('/unsubscribe/' . $this->user->id . '?token=' . $unsubscribeToken),
        ],
    );
}
```

### 17. 📈 Monitoring & Analytics Email

**Analogi:** Seperti melacak apakah suratmu sampai ke tujuan dan apakah dibaca.

**Mengapa?** Karena kamu perlu tahu apakah emailmu efektif atau tidak.

**Bagaimana?** Gunakan event listener untuk melacak kiriman email:

```php
<?php

namespace App\Listeners;

use Illuminate\Mail\Events\MessageSent;
use Illuminate\Support\Facades\Log;

class LogEmailDelivery
{
    public function handle(MessageSent $event)
    {
        Log::info('Email sent', [
            'to' => $event->message->getTo(),
            'subject' => $event->message->getSubject(),
            'transport' => $event->sent->transportName(),
            'timestamp' => now(),
        ]);

        // Simpan ke database untuk analisis
        EmailLog::create([
            'recipient' => $event->message->getTo()[0]->toString(),
            'subject' => $event->message->getSubject(),
            'status' => 'sent',
            'timestamp' => now(),
        ]);
    }
}
```

Daftarkan di `EventServiceProvider`:
```php
protected $listen = [
    \Illuminate\Mail\Events\MessageSent::class => [
        \App\Listeners\LogEmailDelivery::class,
    ],
];
```

---

## Bagian 5: Peralatan Canggih di 'Kotak Perkakas' Email 🧰

### 18. 🏗️ Struktur Proyek dengan Email Service

Agar kode kamu tetap rapi dan mudah dikelola, kamu bisa mengorganisir logika email ke dalam Service Classes:

#### **1. Service Class untuk Pengiriman Email**
```php
<?php
// app/Services/EmailService.php

namespace App\Services;

use App\Mail\OrderShipped;
use App\Mail\WelcomeEmail;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Order;

class EmailService
{
    public function sendWelcomeEmail(User $user): void
    {
        Mail::to($user)->queue(new WelcomeEmail($user));
    }

    public function sendOrderShipped(Order $order): void
    {
        Mail::to($order->user)->queue(new OrderShipped($order));
    }

    public function sendBulkEmail($users, $mailable): void
    {
        foreach ($users as $user) {
            Mail::to($user)->queue($mailable);
        }
    }

    public function sendPersonalizedEmail(User $user, $mailableClass, $data = []): void
    {
        $mailable = new $mailableClass($user, $data);
        Mail::to($user)->queue($mailable);
    }
}
```

#### **2. Controller Menggunakan Service**
```php
<?php

namespace App\Http\Controllers;

use App\Services\EmailService;
use App\Models\User;
use App\Models\Order;

class OrderController extends Controller
{
    protected $emailService;

    public function __construct(EmailService $emailService)
    {
        $this->emailService = $emailService;
    }

    public function shipOrder(Order $order)
    {
        $order->update(['status' => 'shipped']);

        // Kirim email pemberitahuan
        $this->emailService->sendOrderShipped($order);

        return response()->json(['message' => 'Order shipped and email sent']);
    }

    public function registerUser($userData)
    {
        $user = User::create($userData);
        
        // Kirim email selamat datang
        $this->emailService->sendWelcomeEmail($user);

        return response()->json(['message' => 'User registered and welcome email sent']);
    }
}
```

#### **3. Command untuk Pengiriman Email Masal**
```php
<?php
// app/Console/Commands/SendBulkNotificationsCommand.php

namespace App\Console\Commands;

use App\Mail\BulkNotification;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendBulkNotificationsCommand extends Command
{
    protected $signature = 'email:send-bulk {--type=general : Type of notification}';
    protected $description = 'Send bulk notifications to users';

    protected $emailService;

    public function __construct(EmailService $emailService)
    {
        parent::__construct();
        $this->emailService = $emailService;
    }

    public function handle()
    {
        $type = $this->option('type');
        
        $this->info('Starting bulk email sending for ' . $type . ' notifications...');

        $users = User::where('email_notifications', true)->get();

        foreach ($users as $user) {
            $this->emailService->sendPersonalizedEmail(
                $user, 
                BulkNotification::class, 
                ['type' => $type]
            );
        }

        $this->info('Bulk email sending completed. Total: ' . $users->count() . ' emails queued.');
    }
}
```

### 19. 🧪 Testing Lengkap untuk Sistem Email

Testing penting untuk memastikan semua berjalan sesuai harapan:

#### **1. Integration Test**
```php
<?php

namespace Tests\Feature;

use App\Mail\OrderShipped;
use App\Models\Order;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class EmailServiceTest extends TestCase
{
    /** @test */
    public function it_sends_order_shipped_email()
    {
        Mail::fake();

        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $emailService = new EmailService();
        $emailService->sendOrderShipped($order);

        Mail::assertQueued(OrderShipped::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }

    /** @test */
    public function it_sends_bulk_emails()
    {
        Mail::fake();

        $users = User::factory(5)->create();
        $mailable = new OrderShipped(Order::factory()->create());

        $emailService = new EmailService();
        $emailService->sendBulkEmail($users, $mailable);

        Mail::assertQueued(OrderShipped::class, 5);
    }
}
```

#### **2. Testing dengan Mail Facade Direct**
```php
<?php

namespace Tests\Unit;

use App\Mail\WelcomeEmail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class WelcomeEmailTest extends TestCase
{
    /** @test */
    public function it_sends_welcome_email_to_new_user()
    {
        Mail::fake();

        $user = User::factory()->create();

        // Kirim email selamat datang
        Mail::to($user)->send(new WelcomeEmail($user));

        // Cek apakah email dikirim
        Mail::assertSent(WelcomeEmail::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email) && $mail->user->id === $user->id;
        });
    }

    /** @test */
    public function it_sends_welcome_email_with_correct_subject()
    {
        Mail::fake();

        $user = User::factory()->create(['name' => 'John Doe']);

        Mail::to($user)->send(new WelcomeEmail($user));

        Mail::assertSent(WelcomeEmail::class, function ($mail) {
            return $mail->envelope()->subject === 'Selamat Datang di Dunia Laravel!';
        });
    }
}
```

### 20. 🚨 Potensi Masalah & Cara Menghindarinya

#### **1. Keterlambatan Pengiriman**
- **Masalah:** Queue worker mati atau terlalu banyak job.
- **Solusi:** Monitor queue dan pastikan worker selalu aktif.

#### **2. Email dianggap Spam**
- **Masalah:** Email masuk ke folder spam karena tidak ada domain yang terotentikasi.
- **Solusi:** Siapkan SPF, DKIM, dan DMARC records untuk domain.

#### **3. Kebocoran Data Pengguna**
- **Masalah:** Email dikirim ke alamat yang salah karena bug.
- **Solusi:** Gunakan `Mail::alwaysTo()` di lingkungan development.

#### **4. Pemborosan Resource**
- **Masalah:** Mengirim email secara langsung bisa memperlambat aplikasi.
- **Solusi:** Gunakan queue untuk semua email non-kritis.

**Contoh dengan Error Handling:**
```php
<?php

namespace App\Services;

use App\Mail\NotificationEmail;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class RobustEmailService
{
    public function sendNotificationWithRetry(User $user, array $data, int $maxRetries = 3): bool
    {
        $retries = 0;

        while ($retries < $maxRetries) {
            try {
                Mail::to($user)->send(new NotificationEmail($user, $data));
                Log::info("Notification email sent to {$user->email}");
                return true;
            } catch (\Exception $e) {
                $retries++;
                Log::warning("Email sending failed (attempt {$retries}): {$e->getMessage()}");
                
                if ($retries >= $maxRetries) {
                    Log::error("Failed to send email to {$user->email} after {$maxRetries} attempts");
                    // Simpan ke tabel failed_jobs untuk diproses nanti
                    \DB::table('failed_emails')->insert([
                        'user_id' => $user->id,
                        'data' => json_encode($data),
                        'attempts' => $maxRetries,
                        'failed_at' => now(),
                        'error' => $e->getMessage(),
                    ]);
                    return false;
                }
                
                // Tunggu sebentar sebelum retry
                sleep(1);
            }
        }

        return false;
    }
}
```

### 21. 🧪 Pengembangan Lokal & Debugging

#### **21.1 Log Driver untuk Development**
Ubah di `.env`:
```env
MAIL_MAILER=log
```

Email akan ditulis ke log file (`storage/logs/laravel.log`) alih-alih benar-benar dikirim.

#### **21.2 Mailtrap atau Mailhog untuk Inspeksi**
Gunakan layanan dummy seperti Mailtrap, Mailhog, atau Mailpit untuk melihat tampilan email tanpa mengirim ke alamat asli.

#### **21.3 Global To Address untuk Development**
Di service provider atau middleware development:
```php
use Illuminate\Support\Facades\Mail;

// Hanya di lingkungan development
if (app()->environment('local', 'staging')) {
    Mail::alwaysTo('dev@myapp.com');
}
```

Ini sangat berguna agar tidak secara tidak sengaja mengirim email ke alamat pengguna asli saat development.

---

## Bagian 6: Menjadi Master Email Laravel 🏆

### 22. ✨ Wejangan dari Guru

1.  **Gunakan Queue untuk Email**: Jangan pernah kirim email secara langsung di request HTTP kecuali benar-benar kritis.
  
2.  **Pilih Driver yang Tepat**: Gunakan driver API-based (Postmark, Mailgun, Resend) untuk performa dan keandalan terbaik. SMTP jika kamu punya server sendiri.

3.  **Personalisasi Email**: Buat email sepersonal mungkin untuk meningkatkan engagement pengguna.

4.  **Testing adalah Kunci**: Selalu test pengiriman email dan pastikan tampilan email responsif di berbagai email client.

5.  **Monitor Pengiriman**: Gunakan event listener untuk mencatat statistik pengiriman email dan mendeteksi masalah.

### 23. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Email di Laravel:

#### 📨 Membuat dan Mengirim Mailable
| Perintah | Fungsi |
|----------|--------|
| `php artisan make:mail WelcomeEmail` | Buat mailable biasa |
| `php artisan make:mail WelcomeEmail --markdown=mail.welcome` | Buat mailable dengan template markdown |
| `Mail::to($user)->send(new WelcomeEmail($user))` | Kirim email langsung |
| `Mail::to($user)->queue(new WelcomeEmail($user))` | Kirim email via queue |
| `Mail::to($user)->cc($ccUsers)->bcc($bccUsers)->send(...)` | Kirim dengan CC/BCC |

#### 🚚 Driver Email
| Driver | Instalasi | Keterangan |
|--------|-----------|------------|
| `smtp` | Tidak perlu | Default, standar |
| `mailgun` | `composer require symfony/mailgun-mailer` | Cepat dan andal |
| `postmark` | `composer require symfony/postmark-mailer` | Terbaik untuk transaksional |
| `resend` | `composer require resend/resend-php` | Baru tapi menjanjikan |
| `ses` | `composer require aws/aws-sdk-php` | Skala besar, murah |

#### 🔧 Konfigurasi Email
| File | Fungsi |
|------|--------|
| `.env` | Konfigurasi utama (driver, host, username, etc.) |
| `config/mail.php` | Konfigurasi lengkap untuk semua driver |
| `config/services.php` | Konfigurasi API key untuk driver tertentu |

#### 🧪 Testing Commands
| Perintah | Fungsi |
|----------|--------|
| `$mailable->assertSeeInHtml('text')` | Cek teks di HTML mailable |
| `Mail::fake()` | Mock pengiriman email |
| `Mail::assertSent(WelcomeEmail::class)` | Cek apakah email telah dikirim |
| `Mail::assertQueued(WelcomeEmail::class)` | Cek apakah email telah di-queue |

#### 🎨 Fitur Mailable
| Fitur | Implementasi |
|-------|-------------|
| Lampiran | `attachments(): array` dengan `Attachment::fromPath(...)` |
| Header kustom | `headers(): Headers` dengan `new Headers(text: [...])` |
| Metadata | `envelope(): Envelope` dengan `metadata: [...]` |
| Template markdown | Gunakan `markdown` alih-alih `view` di `Content` |

#### 🚨 Best Practices
| Praktik | Alasan |
|---------|--------|
| Gunakan Queue | Mencegah penundaan respon HTTP |
| Gunakan Driver API | Performa dan keandalan lebih baik |
| Validasi Email | Mencegah pengiriman ke alamat tidak valid |
| Gunakan Sandboxes | Mencegah pengiriman ke alamat asli saat dev |
| Monitor Pengiriman | Mendeteksi dan menangani masalah cepat |

### 24. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Email di Laravel, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Dengan memahami sistem email Laravel, kamu sekarang memiliki kemampuan untuk membuat komunikasi aplikasi yang profesional, cepat, dan menarik.

Email bukan hanya tentang mengirim pesan - itu adalah bagian penting dari pengalaman pengguna. Dengan memilih driver yang tepat, menggunakan queue, dan membuat tampilan email yang menarik, kamu bisa membuat pengguna merasa dihargai dan terjaga komunikasinya.

Ingat, sistem email adalah jembatan komunikasi antara aplikasimu dan pengguna. Menguasainya berarti kamu sudah siap membuat aplikasi Laravel yang tidak hanya hebat secara teknis, tapi juga hebat dalam komunikasi dengan pengguna.

Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku! 🚀




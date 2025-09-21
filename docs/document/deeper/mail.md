# **Mengirim Email di Laravel**

## **Pendahuluan**

Mengirim email di Laravel tidak harus rumit. Laravel menyediakan API email yang bersih dan sederhana yang didukung oleh **Symfony Mailer**. Laravel dan Symfony Mailer menyediakan driver untuk mengirim email melalui **SMTP, Mailgun, Postmark, Resend, Amazon SES, Sendmail**, dan lainnya, sehingga memungkinkan aplikasi Anda mengirim email melalui layanan lokal maupun cloud.



## **1. Konfigurasi Email**

Laravel mengatur layanan email melalui file konfigurasi `config/mail.php`. Setiap mailer dapat memiliki konfigurasi unik, termasuk transport yang berbeda. Misalnya, Anda bisa menggunakan **Postmark** untuk email transaksional dan **Amazon SES** untuk email massal.

### **1.1 Mailer Default**

```php
'default' => env('MAIL_MAILER', 'smtp'),
```

Nilai default ini menentukan mailer mana yang akan digunakan ketika aplikasi mengirim email.



### **1.2 Prasyarat Driver/Transport**

API-based driver seperti **Mailgun, Postmark, Resend, MailerSend** lebih cepat dan sederhana dibanding SMTP. Laravel menyarankan menggunakan driver ini bila memungkinkan.



## **2. Driver Umum Laravel**

### **2.1 Mailgun**

1. Install package:

```bash
composer require symfony/mailgun-mailer symfony/http-client
```

2. Konfigurasi `config/mail.php`:

```php
'default' => env('MAIL_MAILER', 'mailgun'),

'mailgun' => [
    'transport' => 'mailgun',
],
```

3. Konfigurasi `config/services.php`:

```php
'mailgun' => [
    'domain' => env('MAILGUN_DOMAIN'),
    'secret' => env('MAILGUN_SECRET'),
    'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    'scheme' => 'https',
],
```



### **2.2 Postmark**

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



### **2.3 Resend**

```bash
composer require resend/resend-php
```

Konfigurasi di `config/mail.php`:

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



### **2.4 Amazon SES**

```bash
composer require aws/aws-sdk-php
```

`config/mail.php`:

```php
'default' => env('MAIL_MAILER', 'ses'),
```

`config/services.php`:

```php
'ses' => [
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
],
```



## **3. Failover dan Round Robin Mailers**

* **Failover**: Menggunakan mailer cadangan bila mailer utama gagal.

```php
'failover' => [
    'transport' => 'failover',
    'mailers' => ['postmark', 'mailgun', 'sendmail'],
],
```

* **Round Robin**: Distribusi email ke beberapa mailer.

```php
'roundrobin' => [
    'transport' => 'roundrobin',
    'mailers' => ['ses', 'postmark'],
],
```



## **4. Membuat Mailable**

Setiap email di Laravel direpresentasikan sebagai kelas **Mailable** yang disimpan di `app/Mail`.

```bash
php artisan make:mail OrderShipped
```

### **4.1 Menulis Mailable**

```php
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;

class OrderShipped extends Mailable
{
    public $order;

    public function __construct($order)
    {
        $this->order = $order;
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.orders.shipped'
        );
    }
}
```



### **4.2 Konfigurasi Pengirim**

```php
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;

public function envelope(): Envelope
{
    return new Envelope(
        from: new Address('admin@domain.com', 'Admin'),
        subject: 'Order Shipped'
    );
}
```

Global dari `config/mail.php`:

```php
'from' => [
    'address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
    'name' => env('MAIL_FROM_NAME', 'Example'),
],
```



### **4.3 Menentukan Template (View)**

```php
public function content(): Content
{
    return new Content(
        view: 'mail.orders.shipped',
        text: 'mail.orders.shipped-text'
    );
}
```



### **4.4 Mengirim Data ke View**

#### **Via Public Property**

```php
public function __construct(public Order $order) {}
```

Di Blade:

```blade
Price: {{ $order->price }}
```

#### **Via With Parameter**

```php
public function content(): Content
{
    return new Content(
        view: 'mail.orders.shipped',
        with: [
            'orderName' => $this->order->name,
            'orderPrice' => $this->order->price,
        ]
    );
}
```



### **4.5 Lampiran (Attachments)**

```php
use Illuminate\Mail\Mailables\Attachment;

public function attachments(): array
{
    return [
        Attachment::fromPath('/path/to/file')
            ->as('invoice.pdf')
            ->withMime('application/pdf'),
    ];
}
```



### **4.6 Headers, Tags, Metadata**

```php
use Illuminate\Mail\Mailables\Headers;

public function headers(): Headers
{
    return new Headers(
        text: ['X-Custom-Header' => 'Value']
    );
}
```

```php
use Illuminate\Mail\Mailables\Envelope;

public function envelope(): Envelope
{
    return new Envelope(
        subject: 'Order Shipped',
        tags: ['shipment'],
        metadata: ['order_id' => $this->order->id]
    );
}
```



## **5. Mengirim Email**

```php
use Illuminate\Support\Facades\Mail;

Mail::to($user)->send(new OrderShipped($order));
Mail::to($user)->cc($moreUsers)->bcc($moreUsers)->send(new OrderShipped($order));
```



### **5.1 Queueing Email**

```php
Mail::to($user)->queue(new OrderShipped($order));
Mail::to($user)->later(now()->addMinutes(10), new OrderShipped($order));
```

### **5.2 Mailables yang Selalu Dikirim ke Queue**

```php
use Illuminate\Contracts\Queue\ShouldQueue;

class OrderShipped extends Mailable implements ShouldQueue {}
```



## **6. Markdown Mailables**

Laravel mendukung Markdown untuk email responsif.

```bash
php artisan make:mail OrderShipped --markdown=mail.orders.shipped
```

Contoh template:

```blade
<x-mail::message>
# Order Shipped
Your order has been shipped!

<x-mail::button :url="$url">View Order</x-mail::button>

Thanks,<br>{{ config('app.name') }}
</x-mail::message>
```



## **7. Testing Mailables**

### **7.1 Menguji Konten**

```php
$mailable->assertSeeInHtml($user->email);
$mailable->assertHasAttachment('/path/to/file');
```

### **7.2 Menguji Pengiriman**

```php
Mail::fake();
Mail::assertSent(OrderShipped::class);
Mail::assertQueued(OrderShipped::class);
```



## **8. Pengembangan Lokal**

* **Log Driver**: Menulis email ke log.
* **Mailtrap / Mailpit**: Mengirim ke mailbox dummy untuk inspeksi.
* **Global to Address**:

```php
Mail::alwaysTo('dev@example.com');
```



## **9. Event Email**

* `MessageSending`: Sebelum email dikirim.
* `MessageSent`: Setelah email dikirim.



## **10. Custom Transport**

Buat transport baru dengan:

```php
class MailchimpTransport extends AbstractTransport
{
    protected function doSend(SentMessage $message): void {}
    public function __toString(): string { return 'mailchimp'; }
}
```

Registrasi di `AppServiceProvider`:

```php
Mail::extend('mailchimp', fn($config) => new MailchimpTransport($client));
```



## **Kesimpulan**

Laravel menyediakan sistem pengiriman email yang fleksibel dan modular. Anda bisa:

* Menggunakan driver bawaan atau API-based.
* Membuat mailable dengan Blade atau Markdown.
* Queueing email agar tidak memperlambat respons.
* Mengatur failover, round-robin, dan custom transport.
* Menguji mailables tanpa mengirim email nyata.




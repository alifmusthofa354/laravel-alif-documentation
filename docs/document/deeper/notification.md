# 📘 Notifications

Laravel Notifications menyediakan cara sederhana dan fleksibel untuk mengirim pesan singkat ke berbagai channel seperti **Email, SMS (Vonage/Nexmo), Slack, Database, Broadcast**, hingga channel tambahan dari komunitas (misalnya Telegram).

Notifikasi biasanya digunakan untuk hal-hal seperti:
- Konfirmasi pembayaran invoice.
- Reset password.
- Notifikasi komentar baru.

Dengan ini, pengguna bisa segera mengetahui update penting dari aplikasi Anda.



## 📑 Daftar Isi
1. [Membuat Notifikasi](#1️⃣-membuat-notifikasi)
2. [Mengirim Notifikasi](#2️⃣-mengirim-notifikasi)
3. [Menentukan Channel](#3️⃣-menentukan-channel)
4. [Queueing Notifications](#4️⃣-queueing-notifications)
5. [On-Demand Notifications](#5️⃣-on-demand-notifications)
6. [Mail Notifications](#6️⃣-mail-notifications)
7. [Markdown Mail Notifications](#7️⃣-markdown-mail-notifications)
8. [Database Notifications](#database-notifications)
9. [Broadcast Notifications](#broadcast-notifications)
10. [SMS Notifications](#sms-notifications)
11. [Slack Notifications](#slack-notifications)
12. [Testing Notifications](#testing-notifications)
13. [Custom Channels](#custom-channels)



## 1️⃣ Membuat Notifikasi

```bash
php artisan make:notification InvoicePaid
```

File `InvoicePaid.php` akan dibuat di folder `app/Notifications`.

Isi class biasanya memiliki:
- `via()` → menentukan channel (misalnya mail, database).
- `toMail()`, `toDatabase()`, dll → isi pesan sesuai channel.



## 2️⃣ Mengirim Notifikasi

### a. Menggunakan Trait `Notifiable`

```php
use App\Models\User;
use App\Notifications\InvoicePaid;

$user = User::find(1);
$user->notify(new InvoicePaid($invoice));
```

> Catatan: `Notifiable` bisa ditambahkan ke model lain selain `User`.



### b. Menggunakan `Notification` Facade

```php
use Illuminate\Support\Facades\Notification;
use App\Notifications\InvoicePaid;

$users = User::all();
Notification::send($users, new InvoicePaid($invoice));

// tanpa antrean
Notification::sendNow($developers, new DeploymentCompleted($deployment));
```



## 3️⃣ Menentukan Channel

```php
public function via(object $notifiable): array
{
    return $notifiable->prefers_sms
        ? ['vonage']
        : ['mail', 'database'];
}
```

> Laravel mendukung bawaan: `mail`, `database`, `broadcast`, `vonage`, `slack`.  
> Untuk channel lain (Telegram, Pusher, dll) gunakan **Laravel Notification Channels**.



## 4️⃣ Queueing Notifications

### a. Mengantrekan

```php
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;
}
```

### b. Menunda (Delay)

```php
$delay = now()->addMinutes(10);
$user->notify((new InvoicePaid($invoice))->delay($delay));
```

Per channel berbeda:

```php
$user->notify((new InvoicePaid($invoice))->delay([
    'mail' => now()->addMinutes(5),
    'sms' => now()->addMinutes(10),
]));
```

Atau override dengan `withDelay()`.

### c. Menentukan Connection & Queue

```php
Notification::send($users, (new InvoicePaid($invoice))
    ->onConnection('sqs')
    ->onQueue('notifications'));
```

### d. Middleware Queue

```php
public function middleware(object $notifiable): array
{
    return [new RateLimited('notifications')];
}
```

### e. Setelah Commit Database

```php
class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;

    public bool $afterCommit = true;
}
```

### f. Menentukan Apakah Dikirim

```php
public function shouldSend(object $notifiable, string $channel): bool
{
    return $notifiable->wants_notifications;
}
```



## 5️⃣ On-Demand Notifications

Untuk penerima **bukan user** aplikasi:

```php
Notification::route('mail', 'taylor@example.com')
    ->route('vonage', '5555555555')
    ->notify(new InvoicePaid($invoice));
```

Dengan nama penerima:

```php
Notification::route('mail', [
    'barrett@example.com' => 'Barrett Blair',
])->notify(new InvoicePaid($invoice));
```



## 6️⃣ Mail Notifications

Gunakan `toMail()`:

```php
use Illuminate\Notifications\Messages\MailMessage;

public function toMail(object $notifiable): MailMessage
{
    $url = url('/invoice/'.$this->invoice->id);

    return (new MailMessage)
        ->greeting('Hello!')
        ->line('Your invoice has been paid!')
        ->action('View Invoice', $url)
        ->line('Thank you for using our application!');
}
```

### a. Error Messages

```php
return (new MailMessage)
    ->error()
    ->subject('Payment Failed')
    ->line('There was a problem with your payment.');
```

### b. Custom View / Text

```php
return (new MailMessage)->view(
    'emails.invoice.paid',
    ['invoice' => $this->invoice]
);
```

### c. Custom Sender, Recipient, Subject, Mailer

```php
return (new MailMessage)
    ->mailer('postmark')
    ->from('barrett@example.com', 'Barrett Blair')
    ->to('taylor@example.com', 'Taylor Otwell')
    ->subject('Invoice Paid')
    ->line('Your invoice has been paid!');
```

### d. Template Customization

```bash
php artisan vendor:publish --tag=laravel-notifications
```

### e. Attachments

```php
->attach('/path/file.pdf')
->attachData($this->pdf, 'invoice.pdf', ['mime' => 'application/pdf'])
```

### f. Tags & Metadata

```php
->tag('invoice')
->metadata('invoice_id', $this->invoice->id)
```

### g. Symfony Message

```php
->withSymfonyMessage(function ($message) {
    $message->getHeaders()->addTextHeader('Custom-Header', 'Value');
});
```

### h. Menggunakan Mailables

```php
public function toMail(object $notifiable): Mailable
{
    return (new InvoicePaidMailable($this->invoice))->to($notifiable->email);
}
```

### i. Previewing

```php
Route::get('/notification-preview', function () {
    $invoice = Invoice::find(1);
    return (new InvoicePaid($invoice))->toMail($invoice->user);
});
```



## 7️⃣ Markdown Mail Notifications

```bash
php artisan make:notification InvoicePaid --markdown=mail.invoice.paid
```

```php
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->subject('Invoice Paid')
        ->markdown('mail.invoice.paid', ['invoice' => $this->invoice]);
}
```

```blade
@component('mail::message')
# Invoice Paid

Your invoice has been paid.

@component('mail::button', ['url' => $url])
View Invoice
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
```



## Database Notifications

### Prerequisites

```bash
php artisan make:notifications-table
php artisan migrate
```

> ⚠️ Jika pakai UUID / ULID gunakan `uuidMorphs` atau `ulidMorphs`.

### Formatting Database Notifications

```php
public function toArray(object $notifiable): array
{
    return [
        'invoice_id' => $this->invoice->id,
        'amount' => $this->invoice->amount,
    ];
}
```

### Accessing Notifications

```php
foreach ($user->notifications as $notification) {
    echo $notification->type;
}
```

- **Unread**: `$user->unreadNotifications`
- **Read**: `$user->readNotifications`

### Marking as Read

```php
$user->unreadNotifications->markAsRead();
$user->unreadNotifications()->update(['read_at' => now()]);
```



## Broadcast Notifications

### Formatting Broadcast Notifications

```php
public function toBroadcast(object $notifiable): BroadcastMessage
{
    return new BroadcastMessage([
        'invoice_id' => $this->invoice->id,
        'amount' => $this->invoice->amount,
    ]);
}
```

### Listening for Notifications

```js
Echo.private('App.Models.User.' + userId)
    .notification((notification) => {
        console.log(notification.type);
    });
```



## SMS Notifications (Vonage)

### Setup

```bash
composer require laravel/vonage-notification-channel guzzlehttp/guzzle
```

```env
VONAGE_KEY=xxxx
VONAGE_SECRET=xxxx
VONAGE_SMS_FROM=15556666666
```

### Contoh

```php
public function toVonage(object $notifiable): VonageMessage
{
    return (new VonageMessage)
        ->content('Your SMS message content');
}
```

### Unicode

```php
return (new VonageMessage)
    ->content('Your unicode message')
    ->unicode();
```

### Custom Nomor Asal

```php
->from('15554443333')
```

### Routing SMS

```php
public function routeNotificationForVonage(Notification $notification): string
{
    return $this->phone_number;
}
```



## Slack Notifications

### Setup

```bash
composer require laravel/slack-notification-channel
```

```php
'slack' => [
    'notifications' => [
        'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
        'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
    ],
],
```

### Contoh Notifikasi Slack

```php
public function toSlack(object $notifiable): SlackMessage
{
    return (new SlackMessage)
        ->text('Invoice Paid!')
        ->headerBlock('Invoice Paid')
        ->sectionBlock(fn (SectionBlock $block) =>
            $block->text('An invoice has been paid.')
        );
}
```

### Routing

```php
public function routeNotificationForSlack(Notification $notification): mixed
{
    return '#support-channel';
}
```



## Testing Notifications

Gunakan fake:

```php
Notification::fake();

Notification::assertNothingSent();
Notification::assertSentTo([$user], OrderShipped::class);
Notification::assertNotSentTo([$user], AnotherNotification::class);
Notification::assertSentTimes(WeeklyReminder::class, 2);
Notification::assertCount(3);
```

On-demand:

```php
Notification::assertSentOnDemand(OrderShipped::class);
```

Dengan closure:

```php
Notification::assertSentTo(
    $user,
    fn (OrderShipped $notification) => $notification->order->id === $order->id
);
```



## Custom Channels

Buat channel sendiri:

```php
class VoiceChannel
{
    public function send(object $notifiable, Notification $notification): void
    {
        $message = $notification->toVoice($notifiable);
        // kirim message ke layanan voice call
    }
}
```

Di notifikasi:

```php
public function via(object $notifiable): array
{
    return [VoiceChannel::class];
}
```



## ✅ Ringkasan

Dengan Laravel Notifications Anda bisa:
- Membuat class notifikasi dengan artisan.
- Mengirim via model (`Notifiable`) atau massal (`Notification::send`).
- Mendukung channel: Mail, Database, Broadcast, SMS (Vonage), Slack, dan custom.
- Menambahkan queue, delay, middleware, hingga after-commit.
- Mengirim ke user non-registered (on-demand).
- Membuat email notifikasi kaya fitur (view custom, attachments, metadata, dsb).
- Menggunakan template Markdown.
- Menulis test dengan `Notification::fake()`.
- Membuat channel kustom sesuai kebutuhan.


## Contoh Implementasi End-to-End

📌 **Skenario**: User melakukan pembayaran invoice. Setelah pembayaran berhasil:
- User menerima **Email** konfirmasi.
- Notifikasi tersimpan di **Database**.
- Tim finance menerima notifikasi di **Slack**.



### 1. Membuat Event

```bash
php artisan make:event InvoicePaid
```

**app/Events/InvoicePaid.php**

```php
namespace App\Events;

use App\Models\Invoice;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class InvoicePaid
{
    use Dispatchable, SerializesModels;

    public Invoice $invoice;

    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }
}
```



### 2. Membuat Notification

```bash
php artisan make:notification InvoicePaidNotification
```

**app/Notifications/InvoicePaidNotification.php**

```php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class InvoicePaidNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public $invoice) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'slack'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Invoice Paid')
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('Your invoice #'.$this->invoice->id.' has been paid.')
            ->action('View Invoice', url('/invoices/'.$this->invoice->id))
            ->line('Thank you for your payment!');
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'invoice_id' => $this->invoice->id,
            'amount' => $this->invoice->amount,
        ];
    }

    public function toSlack(object $notifiable): SlackMessage
    {
        return (new SlackMessage)
            ->success()
            ->content('💰 Invoice Paid!')
            ->attachment(function ($attachment) {
                $attachment->title('Invoice #'.$this->invoice->id)
                           ->fields([
                               'Amount' => $this->invoice->amount,
                               'Customer' => $this->invoice->user->name,
                           ]);
            });
    }
}
```



### 3. Menjalankan Notification dari Listener

```bash
php artisan make:listener SendInvoicePaidNotification --event=InvoicePaid
```

**app/Listeners/SendInvoicePaidNotification.php**

```php
namespace App\Listeners;

use App\Events\InvoicePaid;
use App\Notifications\InvoicePaidNotification;

class SendInvoicePaidNotification
{
    public function handle(InvoicePaid $event): void
    {
        $user = $event->invoice->user;

        // kirim ke user (mail + db)
        $user->notify(new InvoicePaidNotification($event->invoice));

        // kirim ke Slack finance team
        \Notification::route('slack', '#finance-team')
            ->notify(new InvoicePaidNotification($event->invoice));
    }
}
```



### 4. Trigger Event

Di controller pembayaran:

```php
use App\Events\InvoicePaid;

public function pay(Invoice $invoice)
{
    $invoice->markAsPaid();

    event(new InvoicePaid($invoice));

    return back()->with('success', 'Invoice paid successfully!');
}
```



### 5. Hasil Akhir

- **Email**: User menerima email dengan link invoice.
- **Database**: Tabel `notifications` terisi data invoice.
- **Slack**: Channel `#finance-team` menerima notifikasi invoice yang baru dibayar.

> 🎯 Dengan pola ini, aplikasi bisa **mengintegrasikan banyak channel notifikasi sekaligus** secara elegan.




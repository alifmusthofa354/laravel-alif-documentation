# 📢 Notifications di Laravel: Panduan Lengkap dari Guru Kesayanganmu (Edisi Super Notifikasi)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel lanjutan. Hari ini, kita akan membahas sebuah fitur yang **sangat penting** dalam dunia aplikasi modern: **Notifications**. Setelah beberapa kali revisi, akhirnya Guru paham apa yang sebenarnya kalian inginkan: sebuah panduan yang **super lengkap** tapi dijelaskan dengan **super sederhana**, seolah-olah Guru sedang duduk di sebelahmu sambil menjelaskan pelan-pelan.

Di edisi ini, kita akan kupas tuntas **semua detail** tentang Notifications, tapi setiap topik akan Guru ajarkan dengan sabar. Notifications adalah alat yang membantu kita **mengirim pesan penting** ke pengguna aplikasi kita lewat berbagai saluran: **Email, SMS (Vonage/Nexmo), Slack, Database, Broadcast**, hingga channel tambahan dari komunitas (misalnya Telegram). Siap? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Notifications Itu Sebenarnya?

**Analogi:** Bayangkan kamu seorang manajer restoran yang sedang sibuk. Setiap kali ada pesanan baru, pembayaran diterima, atau pelanggan complain, kamu butuh memberi tahu berbagai pihak: koki, kasir, manager, bahkan pelanggan itu sendiri. Inilah **Notifications** kita dalam aplikasi Laravel: sebuah "sistem pengumuman" yang bisa memberi tahu berbagai pihak lewat berbagai saluran!

**Mengapa ini penting?** Karena tanpa Notifications, pengguna seperti orang yang tinggal di gua - tidak tahu apa-apa tentang update penting dari aplikasimu! Mereka bisa melewatkan pembayaran, konfirmasi penting, atau informasi kritis lainnya.

**Bagaimana cara kerjanya?** Notifications itu seperti "pegawai pengumuman" yang otomatis memastikan setiap orang mendapatkan informasi yang tepat, lewat saluran yang tepat, pada waktu yang tepat!

Jadi, alur kerja (workflow) aplikasi kita menjadi sangat rapi:

`➡️ Event Terjadi (Pembayaran, Komentar, dll) -> 📢 Notification System -> 📧 Email/SMS/Slack -> ✅ Pengguna Mendapat Info`

Tanpa Notifications, pengguna bisa kelewatan informasi penting. 😵

**Manfaat utama Notifications:**
- Memberi tahu pengguna tentang event penting (konfirmasi pembayaran invoice, reset password, notifikasi komentar baru)
- Mengirim update ke berbagai saluran sekaligus
- Membangun pengalaman pengguna yang lebih interaktif
- Menghubungkan aplikasi dengan layanan eksternal (Slack, SMS Gateway, dll)

## Bagian 2: Resep Pertamamu: Dari Dasar ke Mahir 🚀

### 2. 🧰 Membuat Notifikasi (Langkah Pertama Menuju Notifikasi Profesional)

**Analogi:** Bayangkan kamu sedang membuat kartu ucapan ulang tahun. Pertama-tama kamu butuh template kartu kosong, lalu kamu isi dengan pesan yang ingin kamu sampaikan. Membuat Notifikasi di Laravel persis seperti itu! Kamu buat "template kartu kosong" dulu, lalu isi dengan pesan dan channel pengiriman.

**Mengapa ini penting?** Karena setiap notifikasi harus punya template dan logika pengiriman yang terdefinisi dengan jelas sebelum bisa dikirim ke pengguna.

**Bagaimana?** Gunakan perintah Artisan untuk membuat class Notifikasi:

```bash
php artisan make:notification InvoicePaid
```

**Penjelasan Perintah:**
- `php artisan make:notification` adalah perintah Artisan untuk membuat notifikasi
- `InvoicePaid` adalah nama kelas notifikasi yang akan kamu buat
- File `InvoicePaid.php` akan dibuat di folder `app/Notifications`

#### Langkah 1️⃣: Struktur Dasar Notification Class

**Mengapa?** Setelah membuat class, kamu perlu mengerti struktur dasar dan method-method penting yang harus diimplementasikan.

**Bagaimana?** Buka file `app/Notifications/InvoicePaid.php` yang baru saja dibuat:

```php
<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoicePaid extends Notification
{
    use Queueable;

    public function __construct()
    {
        //
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }
}
```

**Penjelasan Kode:**
- `use Queueable;` - Memungkinkan notifikasi dikirim dalam queue
- `via()` - Menentukan channel-channel yang akan digunakan (email, database, dll)
- `toMail()` - Mendefinisikan isi pesan email
- `$notifiable` - Objek yang akan menerima notifikasi (biasanya User)

Setelah kamu membuat template notifikasi pertamamu, kamu sudah siap melangkah ke tahap berikutnya: mengirimnya!

### 3. 📤 Mengirim Notifikasi (Mengirim Pesan ke Dunia)

**Analogi:** Setelah kamu membuat kartu ucapan, sekarang waktunya mengirimkannya! Mengirim notifikasi seperti mengirim surat: kamu bisa mengirim ke satu orang (lewat direct delivery) atau ke banyak orang sekaligus (lewat pos massal).

**Mengapa ini penting?** Karena notifikasi yang dibuat tapi tidak dikirim tidak akan memberi manfaat apa-apa. Kamu harus tahu cara mengirim notifikasi ke penerima yang benar.

**Bagaimana?** Ada dua cara utama mengirim notifikasi:

#### 3.1 A. Menggunakan Trait `Notifiable` (Pengiriman Personal)

**Analogi:** Ini seperti mengantarkan surat secara langsung ke rumah seseorang. Paling personal dan cocok untuk notifikasi yang ditujukan ke satu penerima spesifik.

**Mengapa?** Karena kamu bisa mengirim langsung ke satu model (biasanya User) yang memiliki trait `Notifiable`.

**Bagaimana?** Gunakan method `notify()` pada model:

```php
use App\Models\User;
use App\Notifications\InvoicePaid;

$user = User::find(1);
$user->notify(new InvoicePaid($invoice));
```

**Contoh Lengkap Penerapan:**
```php
// Dalam controller pembayaran
class PaymentController extends Controller
{
    public function processPayment(Request $request, Invoice $invoice)
    {
        // Proses pembayaran
        $payment = $this->processPayment($invoice, $request->payment_data);
        
        if ($payment->isSuccessful()) {
            // Tandai invoice sebagai dibayar
            $invoice->markAsPaid();
            
            // Kirim notifikasi langsung ke user
            $invoice->user->notify(new InvoicePaid($invoice));
            
            // Atau bisa juga ke admin
            $invoice->user->admin->notify(new AdminInvoicePaid($invoice));
            
            return response()->json([
                'status' => 'success',
                'message' => 'Payment processed successfully'
            ]);
        }
        
        return response()->json([
            'status' => 'failed',
            'message' => 'Payment failed'
        ], 422);
    }
    
    private function processPayment($invoice, $paymentData)
    {
        // Implementasi logika pembayaran
        return new PaymentResult(true);
    }
}

// Penting! Trait `Notifiable` bisa ditambahkan ke model lain selain `User`
// Misalnya ke model Customer, Vendor, atau Model lain yang bisa menerima notifikasi
```

**Penjelasan Kode:**
- `$user->notify()` mengirim notifikasi secara langsung ke satu user
- Ini cocok untuk notifikasi personal seperti konfirmasi pembayaran
- Method `notify()` tersedia karena model memiliki trait `Notifiable`

#### 3.2 B. Menggunakan `Notification` Facade (Pengiriman Massal)

**Analogi:** Ini seperti kantor pos yang mengirim banyak surat sekaligus. Sangat efisien saat kamu perlu mengirim notifikasi yang sama ke banyak penerima.

**Mengapa?** Karena kamu bisa mengirim notifikasi ke banyak model sekaligus dalam satu perintah.

**Bagaimana?** Gunakan facade `Notification` dengan method `send()`:

```php
use Illuminate\Support\Facades\Notification;
use App\Notifications\InvoicePaid;

$users = User::all();
Notification::send($users, new InvoicePaid($invoice));

// Atau kirim ke user dengan role tertentu
$admins = User::where('role', 'admin')->get();
Notification::send($admins, new AdminInvoicePaid($invoice));

// Pengiriman tanpa antrean (langsung)
Notification::sendNow($developers, new DeploymentCompleted($deployment));
```

**Contoh Lengkap Penerapan Massal:**
```php
// Dalam service class untuk notifikasi massal
class NotificationService
{
    public function notifyAllPremiumUsers($message)
    {
        // Ambil semua user premium
        $premiumUsers = User::where('subscription_type', 'premium')->get();
        
        // Kirim notifikasi ke semua premium user
        Notification::send($premiumUsers, new PremiumUserUpdate($message));
    }
    
    public function notifyTeamMembers($teamId, $notification)
    {
        // Ambil semua member dari tim
        $teamMembers = Team::find($teamId)->users;
        
        // Kirim notifikasi ke semua member
        Notification::send($teamMembers, $notification);
    }
    
    public function notifyOnPaymentFailed($payment)
    {
        // Kirim ke user dan admin
        $recipients = collect([$payment->user, User::where('role', 'admin')->first()]);
        
        Notification::send($recipients, new PaymentFailed($payment));
    }
    
    public function notifyNewFeature($feature)
    {
        // Kirim ke semua user aktif dalam 30 hari terakhir
        $activeUsers = User::where('last_login_at', '>', now()->subDays(30))->get();
        
        Notification::send($activeUsers, new NewFeatureAvailable($feature));
    }
}

// Dalam command untuk notifikasi massal
class SendMonthlyNewsletterCommand extends Command
{
    public function handle()
    {
        $subscribers = User::where('subscribed_to_newsletter', true)->get();
        $newsletter = new MonthlyNewsletter($this->getMonthData());
        
        // Gunakan sendNow jika kamu ingin kirim semua sekaligus tanpa queue
        Notification::sendNow($subscribers, $newsletter);
        
        $this->info('Newsletter sent to ' . $subscribers->count() . ' subscribers');
    }
}
```

**Penjelasan Kode:**
- `Notification::send()` mengirim ke banyak penerima sekaligus
- `Notification::sendNow()` mengirim tanpa melalui queue (langsung eksekusi)
- Sangat efisien untuk notifikasi massal

### 4. 🎯 Menentukan Channel (Saluran Komunikasi Pilihan)

**Analogi:** Bayangkan kamu seorang sales yang punya banyak cara untuk menghubungi pelanggan: lewat email, telepon, SMS, atau datang langsung ke kantor mereka. Dalam Notifications, "channel" adalah pilihan-pilihan saluran komunikasi yang bisa kamu gunakan untuk mengirim pesan ke pengguna.

**Mengapa ini penting?** Karena tidak semua pengguna ingin menerima notifikasi lewat saluran yang sama. Beberapa suka email, yang lain lebih suka SMS, dan beberapa ingin informasi muncul di dashboard aplikasi mereka.

**Bagaimana cara kerjanya?** Kamu tentukan channel-channel yang akan digunakan lewat method `via()` di dalam notification class kamu.

```php
public function via(object $notifiable): array
{
    return $notifiable->prefers_sms
        ? ['vonage']  // SMS channel
        : ['mail', 'database'];  // Email dan database
}
```

**Contoh Penerapan Lengkap:**
```php
<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class InvoicePaid extends Notification
{
    use Queueable;

    public function __construct(public $invoice) {}

    public function via(object $notifiable): array
    {
        $channels = [];
        
        // Tambahkan email jika pengguna ingin menerima email
        if ($notifiable->email_notifications_enabled) {
            $channels[] = 'mail';
        }
        
        // Tambahkan database jika pengguna ingin lihat di dashboard
        if ($notifiable->dashboard_notifications_enabled) {
            $channels[] = 'database';
        }
        
        // Tambahkan SMS jika pengguna ingin menerima SMS
        if ($notifiable->sms_notifications_enabled && $notifiable->phone) {
            $channels[] = 'vonage';
        }
        
        // Tambahkan broadcast jika pengguna online di aplikasi web
        if ($notifiable->realtime_notifications_enabled) {
            $channels[] = 'broadcast';
        }
        
        // Jika tidak ada channel yang dipilih, gunakan default
        return $channels ?: ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Invoice #' . $this->invoice->id . ' Dibayar')
            ->greeting('Halo ' . $notifiable->name . '!')
            ->line('Invoice Anda #' . $this->invoice->id . ' telah dibayar.')
            ->action('Lihat Invoice', url('/invoices/' . $this->invoice->id))
            ->line('Terima kasih atas pembayaran Anda!');
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'invoice_id' => $this->invoice->id,
            'amount' => $this->invoice->amount,
            'message' => 'Invoice #' . $this->invoice->id . ' telah dibayar',
        ];
    }

    public function toVonage(object $notifiable): \Illuminate\Notifications\Messages\VonageMessage
    {
        return (new \Illuminate\Notifications\Messages\VonageMessage)
            ->content('Invoice #' . $this->invoice->id . ' telah dibayar. Jumlah: ' . $this->invoice->amount);
    }
}
```

**Channel-channel yang didukung Laravel:**
- `mail` - Mengirim notifikasi lewat email
- `database` - Menyimpan notifikasi ke tabel database
- `broadcast` - Mengirim notifikasi ke sistem real-time (Pusher, Socket.io, dll)
- `vonage` (SMS) - Mengirim lewat SMS via Vonage (dulu Nexmo)
- `slack` - Mengirim ke channel Slack
- `custom channels` - Channel tambahan dari paket eksternal

> **Catatan:** `Notifiable` bisa ditambahkan ke model lain selain `User`, seperti Customer, Vendor, atau model lain yang bisa menerima notifikasi.

### 5. ⏰ Queueing Notifications (Notifikasi Antri Dulu, Baru Dikirim)

**Analogi:** Bayangkan kamu punya restoran dengan banyak pesanan. Alih-alih melayani semua pelanggan sekaligus (yang bisa membuat kekacauan), kamu buat sistem antrian. Pesanan masuk ke antrian, lalu diproses satu per satu. Queueing Notifications bekerja seperti ini - mengatur agar notifikasi dikirim secara teratur dan tidak membuat server kewalahan.

**Mengapa ini penting?** Karena saat kamu mengirim banyak notifikasi sekaligus (misalnya email ke 10,000 user), jika semua dikirim langsung, server bisa lemot atau bahkan crash. Dengan queue, notifikasi diproses secara bertahap.

**Bagaimana cara kerjanya?** Notifikasi dimasukkan ke dalam antrian dan diproses oleh worker secara background.

#### 5.1 A. Mengantrekan (Basic Queue)

**Mengapa?** Untuk memastikan notifikasi tidak memblokir eksekusi request utama.

**Bagaimana?** Tambahkan interface `ShouldQueue` dan trait `Queueable`:

```php
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;
    
    // Tambahkan property untuk kontrol tambahan
    public $tries = 3;  // Berapa kali mencoba jika gagal
    public $timeout = 120;  // Timeout dalam detik
}
```

**Contoh Penerapan Lengkap:**
```php
<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;
    
    // Atur berapa kali mencoba jika gagal
    public $tries = 3;
    
    // Atur timeout proses
    public $timeout = 120;
    
    // Proses setelah commit ke database
    public bool $afterCommit = true;

    public function __construct(public $invoice) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Invoice Dibayar - ' . $this->invoice->id)
            ->greeting('Halo ' . $notifiable->name . '!')
            ->line('Invoice #' . $this->invoice->id . ' telah berhasil dibayar.')
            ->line('Jumlah: $' . number_format($this->invoice->amount, 2))
            ->action('Lihat Detail Invoice', url('/invoices/' . $this->invoice->id))
            ->line('Terima kasih atas kepercayaan Anda!');
    }

    public function failed(\Throwable $exception)
    {
        // Log error jika notifikasi gagal dikirim
        \Log::error('Gagal mengirim notifikasi InvoicePaid', [
            'invoice_id' => $this->invoice->id,
            'error' => $exception->getMessage()
        ]);
    }
}
```

#### 5.2 B. Menunda (Delay) - Kirim Nanti

**Analogi:** Seperti menjadwalkan surat untuk dikirim besok pagi, bukan sekarang. Kamu bisa menentukan kapan notifikasi akan dikirim.

**Mengapa?** Karena terkadang kamu ingin mengirim notifikasi nanti, misalnya email follow-up 24 jam setelah pembelian.

**Bagaimana?** Gunakan method `delay()`:

```php
use Carbon\Carbon;

// Tunda 10 menit dari sekarang
$delay = now()->addMinutes(10);
$user->notify((new InvoicePaid($invoice))->delay($delay));

// Atau dengan object Carbon
$user->notify((new InvoicePaid($invoice))->delay(
    Carbon::now()->addHours(1)  // 1 jam dari sekarang
));
```

**Contoh Penerapan Delay:**
```php
// Dalam controller
class PaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $payment = $this->processPaymentLogic($request);
        
        if ($payment->isSuccessful()) {
            // Kirim notifikasi langsung
            $user->notify(new ImmediatePaymentConfirmation($payment));
            
            // Kirim notifikasi follow-up 24 jam kemudian
            $user->notify(
                (new PaymentFollowUp($payment))
                    ->delay(now()->addHours(24))
            );
            
            // Kirim notifikasi ulasan 7 hari kemudian
            $user->notify(
                (new ReviewRequest($payment))
                    ->delay(now()->addDays(7))
            );
        }
    }
}

// Tunda per channel berbeda
$user->notify((new InvoicePaid($invoice))->delay([
    'mail' => now()->addMinutes(5),   // Kirim email 5 menit dari sekarang
    'sms' => now()->addMinutes(10),   // Kirim SMS 10 menit dari sekarang
    'database' => now()->addMinutes(1), // Simpan ke database segera
]));
```

#### 5.3 C. Menentukan Connection & Queue

**Analogi:** Seperti menentukan jalur mana yang harus dilewati surat kamu (lewat pos biasa, pos kilat, atau kurir khusus) dan di antrean mana surat itu diproses.

**Mengapa?** Karena kamu mungkin punya banyak queue dengan prioritas berbeda-beda.

**Bagaimana?** Gunakan method `onConnection()` dan `onQueue()`:

```php
// Atur connection dan queue
Notification::send($users, (new InvoicePaid($invoice))
    ->onConnection('redis')      // Gunakan Redis sebagai queue driver
    ->onQueue('high-priority')); // Masukkan ke queue high-priority

// Atau untuk satu user
$user->notify((new InvoicePaid($invoice))
    ->onQueue('email-notifications')); // Hanya untuk notifikasi email
```

#### 5.4 D. Middleware Queue

**Analogi:** Seperti petugas keamanan yang memeriksa setiap item sebelum masuk ke dalam gedung. Middleware queue memungkinkan kamu menjalankan logika sebelum notifikasi diproses.

**Mengapa?** Karena kamu mungkin ingin membatasi jumlah notifikasi yang dikirim per menit (rate limiting) atau melakukan validasi tambahan.

**Bagaimana?** Gunakan method `middleware()`:

```php
class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;

    public function middleware(object $notifiable): array
    {
        // Hanya kirim maksimal 5 notifikasi per menit per user
        return [
            new \Illuminate\Queue\Middleware\RateLimited('notifications-per-minute')
        ];
    }
}
```

#### 5.5 E. Setelah Commit Database (After Commit)

**Analogi:** Seperti menunggu pesanan kamu benar-benar tercatat di buku besar sebelum mengirim notifikasi konfirmasi.

**Mengapa?** Karena kamu ingin memastikan database transaction selesai sebelum mengirim notifikasi.

**Bagaimana?** Gunakan property `$afterCommit`:

```php
class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;

    // Kirim notifikasi hanya setelah transaksi database selesai
    public bool $afterCommit = true;
}
```

#### 5.6 F. Menentukan Apakah Dikirim (Conditional Sending)

**Analogi:** Seperti petugas yang mengecek apakah alamat tujuan valid sebelum mengirim surat.

**Mengapa?** Karena kamu mungkin tidak ingin mengirim notifikasi ke beberapa penerima dalam kondisi tertentu.

**Bagaimana?** Gunakan method `shouldSend()`:

```php
class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;

    public function shouldSend(object $notifiable, string $channel): bool
    {
        // Jangan kirim jika user tidak aktif
        if (!$notifiable->is_active) {
            return false;
        }
        
        // Jangan kirim ke channel tertentu saat jam sibuk
        if ($channel === 'mail' && now()->hour >= 22) {
            return false; // Jangan kirim email malam hari
        }
        
        // Cek apakah user ingin menerima notifikasi ini
        return $notifiable->wants_notifications;
    }
}
```

### 6. 🎫 On-Demand Notifications (Notifikasi Tanpa User)

**Analogi:** Bayangkan kamu seorang kurir yang ingin mengirim paket ke seseorang yang bukan pelanggan tetap kamu - mungkin orang yang kamu kenal dari Facebook atau email dari acara. On-Demand Notifications memungkinkan kamu mengirim notifikasi ke penerima yang **bukan model user terdaftar** di aplikasi kamu.

**Mengapa ini penting?** Karena terkadang kamu perlu mengirim notifikasi ke alamat email atau nomor telepon yang tidak terkait dengan user di database kamu.

**Bagaimana cara kerjanya?** Kamu secara eksplisit menentukan alamat tujuan tanpa perlu menyimpannya sebagai model User.

```php
use Illuminate\Support\Facades\Notification;
use App\Notifications\InvoicePaid;

// Kirim ke alamat email langsung
Notification::route('mail', 'taylor@example.com')
    ->route('vonage', '5555555555')
    ->notify(new InvoicePaid($invoice));
```

**Contoh Penerapan Lengkap:**
```php
// Dalam service untuk mengirim invoice ke klien non-user
class ClientInvoiceService
{
    public function sendInvoiceToClient($clientEmail, $clientPhone, $invoice)
    {
        // Kirim ke email langsung
        Notification::route('mail', $clientEmail)
            ->route('vonage', $clientPhone)
            ->notify(new InvoicePaid($invoice));
    }
    
    public function sendWelcomeToGuest($guestEmail, $welcomeData)
    {
        // Kirim welcome email ke pengunjung website
        Notification::route('mail', $guestEmail)
            ->notify(new WelcomeNotification($welcomeData));
    }
    
    public function sendPromoToNonRegistered($promoDetails, $recipientList)
    {
        foreach ($recipientList as $recipient) {
            Notification::route('mail', $recipient['email'])
                ->route('vonage', $recipient['phone'] ?? null)
                ->notify(new PromoNotification($promoDetails));
        }
    }
}

// Dengan nama penerima
Notification::route('mail', [
    'barrett@example.com' => 'Barrett Blair',
])
->notify(new InvoicePaid($invoice));

// Contoh dalam controller
class GuestNotificationController extends Controller
{
    public function sendGuestNotification(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'phone' => 'nullable',
            'message_type' => 'required|in:welcome,promo,invoice'
        ]);
        
        switch ($request->message_type) {
            case 'welcome':
                Notification::route('mail', $request->email)
                    ->notify(new WelcomeGuestNotification());
                break;
                
            case 'promo':
                $promo = new PromoNotification($request->promo_data);
                
                if ($request->phone) {
                    Notification::route('mail', $request->email)
                        ->route('vonage', $request->phone)
                        ->notify($promo);
                } else {
                    Notification::route('mail', $request->email)
                        ->notify($promo);
                }
                break;
                
            case 'invoice':
                $invoice = Invoice::findOrFail($request->invoice_id);
                
                Notification::route('mail', $request->email)
                    ->route('vonage', $request->phone)
                    ->notify(new InvoicePaid($invoice));
                break;
        }
        
        return response()->json(['message' => 'Notification sent successfully']);
    }
}

// Kirim ke multiple routes sekaligus
Notification::route('mail', 'admin@example.com')
    ->route('slack', '#admin-channel')
    ->route('vonage', '+1234567890')
    ->notify(new CriticalSystemNotification());
```

**Penjelasan Kode:**
- `Notification::route()` digunakan untuk menentukan tujuan secara langsung
- Bekerja untuk berbagai channel: 'mail', 'vonage', 'slack', dll.
- Sangat berguna untuk notifikasi satu kali atau ke penerima non-pengguna

### 7. 📧 Mail Notifications (Notifikasi Email Profesional)

**Analogi:** Bayangkan kamu seorang desainer surat yang sangat berpengalaman. Kamu tidak hanya menulis pesan, tapi juga membuat tampilan surat yang cantik, menarik, dan profesional. Mail Notifications di Laravel memungkinkan kamu membuat email yang bukan hanya informatif, tapi juga terlihat profesional dan menarik.

**Mengapa ini penting?** Karena email adalah saluran komunikasi utama dengan banyak pengguna. Email yang terlihat profesional dan terstruktur dengan baik akan meningkatkan kepercayaan dan tingkat pembacaan.

**Bagaimana cara kerjanya?** Gunakan method `toMail()` untuk mendefinisikan isi email kamu.

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

#### 7.1 A. Error Messages (Email untuk Pesan Kesalahan)

**Mengapa?** Karena pesan error harus terlihat berbeda dari pesan biasa agar pengguna langsung tahu ada masalah.

**Bagaimana?** Gunakan method `error()`:

```php
return (new MailMessage)
    ->error()  // Memberi tampilan khusus untuk error
    ->subject('Payment Failed')
    ->line('There was a problem with your payment.')
    ->line('Please contact support or try again.');
```

#### 7.2 B. Custom View / Text (Template Email Sendiri)

**Mengapa?** Karena terkadang kamu butuh kontrol penuh atas tampilan email, melebihi yang disediakan oleh template bawaan.

**Bagaimana?** Gunakan method `view()`:

```php
return (new MailMessage)->view(
    'emails.invoice.paid',  // Custom blade template
    ['invoice' => $this->invoice, 'user' => $notifiable]
);
```

**Contoh Custom Blade Template (`emails.invoice.paid.blade.php`):**
```blade
@component('mail::layout')
    {{-- Header --}}
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
            {{ config('app.name') }}
        @endcomponent
    @endslot

    {{-- Body --}}
    <div class="content">
        <h1>Invoice Pembayaran</h1>
        <p>Terima kasih telah melakukan pembayaran untuk invoice berikut:</p>
        
        <table style="width:100%; border-collapse: collapse;">
            <tr>
                <td><strong>Nomor Invoice:</strong></td>
                <td>{{ $invoice->id }}</td>
            </tr>
            <tr>
                <td><strong>Tanggal:</strong></td>
                <td>{{ $invoice->created_at->format('d M Y') }}</td>
            </tr>
            <tr>
                <td><strong>Jumlah:</strong></td>
                <td>Rp{{ number_format($invoice->amount, 2) }}</td>
            </tr>
        </table>
    </div>

    {{-- Subcopy --}}
    @slot('subcopy')
        @component('mail::subcopy')
            Jika Anda mengalami kesulitan klik tombol di atas, salin dan tempel URL berikut ke browser Anda: [{{ $invoiceUrl }}]({{ $invoiceUrl }})
        @endcomponent
    @endslot

    {{-- Footer --}}
    @slot('footer')
        @component('mail::footer')
            © {{ date('Y') }} {{ config('app.name') }}. Hak Cipta Dilindungi.
        @endcomponent
    @endslot
@endcomponent
```

#### 7.3 C. Custom Sender, Recipient, Subject, Mailer

**Mengapa?** Karena kamu mungkin ingin menggunakan sender yang berbeda untuk jenis notifikasi yang berbeda, atau mengirim dari alamat domain yang berbeda.

**Bagaimana?** Gunakan berbagai method untuk kustomisasi:

```php
return (new MailMessage)
    ->mailer('postmark')  // Gunakan mailer tertentu (jika kamu punya beberapa mailer)
    ->from('billing@company.com', 'Billing Department')  // Custom sender
    ->to('customer@example.com', 'John Doe')  // Custom recipient (biasanya tidak perlu karena sudah dari notifiable)
    ->subject('Invoice Paid - ' . $this->invoice->id)  // Custom subject
    ->line('Your invoice has been processed successfully!');
```

#### 7.4 D. Template Customization (Sesuaikan Tampilan Email)

**Mengapa?** Karena kamu ingin email kamu sesuai dengan branding perusahaan kamu, bukan tampilan default Laravel.

**Bagaimana?** Publish template default dan kustomisasi:

```bash
php artisan vendor:publish --tag=laravel-notifications
```

Ini akan membuat file-file template di `resources/views/vendor/notifications/` yang bisa kamu ubah sesuai kebutuhan branding kamu.

#### 7.5 E. Attachments (Lampiran File)

**Analogi:** Seperti melampirkan dokumen penting ke dalam surat kamu.

**Mengapa?** Karena terkadang kamu perlu mengirimkan invoice PDF, laporan, atau dokumen lainnya.

**Bagaimana?** Gunakan method `attach()` dan `attachData()`:

```php
return (new MailMessage)
    ->subject('Invoice Details')
    ->line('Please find your invoice attached.')
    ->attach('/path/to/invoice.pdf')  // Lampirkan file dari sistem
    ->attachData(  // Buat attachment dari data
        $this->pdfContent, 
        'invoice.pdf', 
        ['mime' => 'application/pdf']
    );
```

**Contoh Penerapan Lengkap:**
```php
class InvoicePaid extends Notification
{
    public function toMail(object $notifiable): MailMessage
    {
        $invoiceUrl = url('/invoices/' . $this->invoice->id);
        $pdfPath = storage_path('app/invoices/' . $this->invoice->id . '.pdf');
        
        $mail = (new MailMessage)
            ->subject('Invoice #' . $this->invoice->id . ' - Pembayaran Berhasil')
            ->greeting('Halo ' . $notifiable->name . '!')
            ->line('Kami senang memberitahu bahwa invoice #' . $this->invoice->id . ' telah berhasil dibayar.')
            ->line('Jumlah: $' . number_format($this->invoice->amount, 2))
            ->line('Tanggal Pembayaran: ' . $this->invoice->paid_at->format('d M Y H:i'))
            ->action('Lihat Detail Invoice', $invoiceUrl)
            ->line('Terima kasih atas kepercayaan Anda.');
        
        // Tambahkan lampiran jika file PDF ada
        if (file_exists($pdfPath)) {
            $mail->attach($pdfPath, [
                'as' => 'Invoice-' . $this->invoice->id . '.pdf',
                'mime' => 'application/pdf',
            ]);
        }
        
        return $mail;
    }
}
```

#### 7.6 F. Tags & Metadata (Penanda dan Data Tambahan)

**Mengapa?** Karena kamu mungkin menggunakan layanan email seperti Postmark atau SendGrid yang mendukung tagging untuk pelacakan dan analisis.

**Bagaimana?** Gunakan method `tag()` dan `metadata()`:

```php
return (new MailMessage)
    ->subject('Invoice Notification')
    ->tag('invoice')  // Tag untuk kategorisasi
    ->metadata('invoice_id', $this->invoice->id)  // Metadata tambahan
    ->metadata('user_type', $notifiable->type)    // Metadata lain
    ->line('Your invoice has been paid.');
```

#### 7.7 G. Symfony Message (Kontrol Lebih Lanjut)

**Mengapa?** Karena terkadang kamu perlu menambahkan header khusus atau konfigurasi lanjutan yang tidak disediakan oleh API MailMessage.

**Bagaimana?** Gunakan method `withSymfonyMessage()`:

```php
return (new MailMessage)
    ->subject('Special Notification')
    ->line('This is a special notification.')
    ->withSymfonyMessage(function ($message) {
        // Tambahkan custom headers
        $message->getHeaders()->addTextHeader('X-Custom-Header', 'Special-Value');
        $message->getHeaders()->addTextHeader('X-Priority', '1');
        
        // Atau set custom configuration
        $message->setPriority(\Swift_Message::PRIORITY_HIGH);
    });
```

#### 7.8 H. Menggunakan Mailables (Email Class Terpisah)

**Mengapa?** Karena untuk email yang kompleks, lebih baik mengelola logika email dalam class Mailable terpisah.

**Bagaimana?** Kembalikan instance Mailable dari `toMail()`:

```php
use App\Mail\InvoicePaidMailable;

public function toMail(object $notifiable): Mailable
{
    return (new InvoicePaidMailable($this->invoice))->to($notifiable->email);
}
```

#### 7.9 I. Previewing (Pratinjau Email)

**Mengapa?** Karena kamu ingin melihat tampilan email sebelum dikirim, untuk debugging dan desain.

**Bagaimana?** Buat route untuk pratinjau:

```php
// routes/web.php
Route::get('/notification-preview', function () {
    $user = User::find(1); // Ambil user contoh
    $invoice = Invoice::find(1); // Ambil invoice contoh
    
    return (new InvoicePaid($invoice))->toMail($user);
});
```

Kunjungi `/notification-preview` untuk melihat pratinjau email langsung di browser kamu.

### 8. 🎨 Markdown Mail Notifications (Email dengan Format Cantik)

**Analogi:** Bayangkan kamu seorang desainer yang tidak hanya bisa menulis surat biasa, tapi juga bisa membuat surat dengan tata letak profesional yang bisa kamu susun dengan mudah menggunakan sintaks sederhana seperti menulis dokumen biasa. Markdown Mail Notifications memungkinkan kamu membuat email yang terlihat profesional hanya dengan sintaks markdown yang sederhana.

**Mengapa ini penting?** Karena membuat email yang terlihat bagus dan profesional bisa kompleks, tapi dengan Markdown kamu bisa membuatnya dengan lebih mudah sambil tetap menjaga tampilan yang konsisten.

**Bagaimana cara kerjanya?** Laravel menyediakan template dengan komponen-komponen siap pakai yang bisa kamu gunakan dalam sintaks markdown.

#### 8.1 Membuat Notification dengan Markdown

**Mengapa?** Karena kamu ingin memanfaatkan kekuatan template Markdown yang lebih fleksibel.

**Bagaimana?** Gunakan flag `--markdown` saat membuat notification:

```bash
php artisan make:notification InvoicePaid --markdown=mail.invoice.paid
```

Ini akan membuat Notification class dengan template Markdown siap pakai.

**Contoh Notification Class dengan Markdown:**
```php
<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class InvoicePaid extends Notification
{
    use Queueable;

    public function __construct(public $invoice) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = url('/invoices/' . $this->invoice->id);

        return (new MailMessage)
            ->subject('Invoice Pembayaran #' . $this->invoice->id)
            ->markdown('mail.invoice.paid', [
                'invoice' => $this->invoice,
                'user' => $notifiable,
                'url' => $url
            ]);
    }
}
```

#### 8.2 Struktur Template Markdown

**Contoh Template (`resources/views/mail/invoice/paid.blade.php`):**
```blade
@component('mail::message')
# Invoice Telah Dibayar

Halo {{ $user->name }},

Kami dengan senang hati memberitahu bahwa invoice berikut telah berhasil dibayar:

@component('mail::panel')
**Detail Invoice:**
- ID Invoice: {{ $invoice->id }}
- Jumlah: Rp{{ number_format($invoice->amount, 2) }}
- Tanggal: {{ $invoice->paid_at->format('d M Y') }}
@endcomponent

@component('mail::button', ['url' => $url])
Lihat Invoice
@endcomponent

@component('mail::table')
| Produk | Jumlah | Harga |
|:-------|:------:|------:|
@foreach($invoice->items as $item)
| {{ $item->name }} | {{ $item->quantity }} | Rp{{ number_format($item->total, 2) }} |
@endforeach
| **Total** | | **Rp{{ number_format($invoice->amount, 2) }}** |
@endcomponent

Terima kasih atas kepercayaan Anda menggunakan layanan kami.<br>
{{ config('app.name') }}
@endcomponent
```

#### 8.3 Komponen-Komponen Markdown yang Tersedia

**1. Message Component** - Kerangka utama email
```blade
@component('mail::message')
<!-- Konten email di sini -->
@endcomponent
```

**2. Button Component** - Tombol aksi
```blade
@component('mail::button', ['url' => $url])
Klik Disini
@endcomponent
```

**3. Panel Component** - Kotak informasi penting
```blade
@component('mail::panel')
Info penting disini
@endcomponent
```

**4. Table Component** - Tabel data
```blade
@component('mail::table')
| Header 1 | Header 2 |
|:---------|:---------|
| Data 1   | Data 2   |
@endcomponent
```

**5. Subcopy Component** - Teks tambahan
```blade
@component('mail::subcopy')
Teks tambahan atau instruksi
@endcomponent
@endcomponent
```

#### 8.4 Contoh Lengkap Template Markdown

**Template Pemberitahuan Pembayaran (`mail.invoice.paid.blade.php`):**
```blade
@component('mail::message')
# Pembayaran Invoice Berhasil

Halo {{ $user->name }},

Invoice **#{{ $invoice->id }}** telah berhasil dibayar pada {{ $invoice->paid_at->format('d F Y H:i') }}.

@if($invoice->hasDiscount())
@component('mail::panel')
**Diskon Diterapkan:** {{ $invoice->discount_percentage }}% - Rp{{ number_format($invoice->discount_amount, 2) }}
@endcomponent
@endif

@component('mail::table')
| Produk | Jumlah | Harga Satuan | Subtotal |
|:-------|:------:|:------------:|---------:|
@foreach($invoice->items as $item)
| {{ Str::limit($item->name, 20) }} | {{ $item->quantity }} | Rp{{ number_format($item->price, 2) }} | Rp{{ number_format($item->total, 2) }} |
@endforeach
| | | | |
| | | **Total Sebelum Pajak** | **Rp{{ number_format($invoice->sub_total, 2) }}** |
| | | PPN ({{ $invoice->tax_rate }}%) | Rp{{ number_format($invoice->tax_amount, 2) }} |
| | | | |
| | | **TOTAL** | **Rp{{ number_format($invoice->amount, 2) }}** |
@endcomponent

@component('mail::button', ['url' => $url])
Lihat Detail Invoice
@endcomponent

**Metode Pembayaran:** {{ $invoice->payment_method }}  
**Status:** Pembayaran Berhasil  

Jika Anda memiliki pertanyaan tentang invoice ini, jangan ragu untuk menghubungi tim support kami.

Terima kasih,<br>
{{ config('app.name') }}
@endcomponent
```

#### 8.5 Stilasi dan Branding

Kamu juga bisa menyesuaikan warna tema email dengan mengedit file CSS di:
- `resources/views/vendor/mail/html/themes/default.css`

**Contoh kustomisasi tema:**
```css
/* Ganti warna utama brand */
.button-primary {
    background-color: #3b82f6; /* ubah ke warna brand kamu */
    border-color: #3b82f6;
}

/* Ganti warna heading */
.header {
    background-color: #1e40af; /* warna header sesuai brand */
}
```

**Penjelasan Kode:**
- Markdown Mail menyediakan komponen-komponen siap pakai
- Mudah untuk membuat email yang terlihat profesional
- Dapat digunakan dengan data dinamis dari notification
- Dapat dikustomisasi secara visual sesuai branding

### 9. 💾 Database Notifications (Notifikasi di Database - Simpan untuk Waktu Lain)

**Analogi:** Bayangkan kamu punya buku tamu digital di mana semua pengumuman penting yang datang ke kamu disimpan dalam daftar yang bisa kamu baca kapan saja. Database Notifications seperti buku tamu digital ini - menyimpan semua notifikasi penting di database sehingga pengguna bisa melihatnya saat login ke aplikasi kamu, seperti notifikasi di aplikasi sosial media.

**Mengapa ini penting?** Karena tidak semua pengguna langsung membuka email atau SMS, tapi mereka sering melihat dashboard aplikasi kamu. Database notifications memastikan mereka tidak melewatkan informasi penting.

**Bagaimana cara kerjanya?** Notifikasi disimpan ke tabel database, dan bisa diakses lewat model user melalui relationship.

#### 9.1 Persiapan (Setup Prasyarat)

**Mengapa?** Karena kamu perlu tabel database untuk menyimpan notifikasi.

**Bagaimana?** Buat dan jalankan migration untuk tabel notifikasi:

```bash
php artisan make:notifications-table
php artisan migrate
```

**Catatan Khusus:**
> ⚠️ **Jika kamu menggunakan UUID / ULID untuk ID user**, gunakan `uuidMorphs` atau `ulidMorphs` di migration-nya:
```php
// Dalam migration
Schema::create('notifications', function (Blueprint $table) {
    $table->uuid('id')->primary();  // Jika menggunakan UUID
    $table->uuid('notifiable_id'); // Atau ulid() jika ULID
    $table->string('notifiable_type');
    // ... kolom lainnya
});
```

#### 9.2 Format Database Notifications

**Mengapa?** Karena kamu harus menentukan data apa yang akan disimpan di database saat notifikasi dibuat.

**Bagaimana?** Gunakan method `toArray()` untuk menentukan data yang disimpan:

```php
<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class InvoicePaid extends Notification
{
    use Queueable;

    public function __construct(public $invoice) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];  // Gunakan juga database
    }

    public function toArray(object $notifiable): array
    {
        return [
            'invoice_id' => $this->invoice->id,
            'amount' => $this->invoice->amount,
            'customer_name' => $this->invoice->customer->name ?? 'Customer',
            'payment_date' => $this->invoice->paid_at->format('Y-m-d H:i:s'),
            'message' => 'Invoice #' . $this->invoice->id . ' telah dibayar',
        ];
    }
}
```

**Contoh Lengkap dengan Berbagai Data:**
```php
public function toArray(object $notifiable): array
{
    return [
        'invoice_id' => $this->invoice->id,
        'invoice_number' => $this->invoice->number,
        'amount' => $this->invoice->amount,
        'currency' => $this->invoice->currency,
        'customer' => [
            'id' => $this->invoice->customer->id,
            'name' => $this->invoice->customer->name,
        ],
        'payment_method' => $this->invoice->payment_method,
        'payment_date' => $this->invoice->paid_at,
        'previous_balance' => $this->invoice->previous_balance,
        'remaining_balance' => $this->invoice->customer->balance,
        'message' => 'Invoice #' . $this->invoice->number . ' telah berhasil dibayar',
    ];
}
```

#### 9.3 Mengakses dan Menampilkan Notifikasi

**Mengapa?** Karena kamu perlu menampilkan notifikasi ini di UI aplikasi kamu.

**Bagaimana?** Gunakan relationship yang otomatis disediakan oleh trait `Notifiable`:

```php
// Dalam controller untuk menampilkan notifikasi
class NotificationController extends Controller
{
    public function index()
    {
        // Ambil semua notifikasi
        $notifications = auth()->user()->notifications;
        
        // Ambil hanya notifikasi yang belum dibaca
        $unreadNotifications = auth()->user()->unreadNotifications;
        
        // Ambil hanya notifikasi yang sudah dibaca
        $readNotifications = auth()->user()->readNotifications;
        
        return view('notifications.index', compact('notifications', 'unreadNotifications', 'readNotifications'));
    }
    
    public function markAsRead($id)
    {
        $notification = auth()->user()->notifications()->findOrFail($id);
        $notification->markAsRead();
        
        return response()->json(['status' => 'success']);
    }
    
    public function markAllAsRead()
    {
        auth()->user()->unreadNotifications->markAsRead();
        
        return response()->json(['status' => 'success', 'count' => auth()->user()->unreadNotifications->count()]);
    }
}

// Dalam Blade template (notifications/index.blade.php)
@foreach($notifications as $notification)
    <div class="notification-item {{ $notification->read_at ? 'read' : 'unread' }}">
        <h4>{{ $notification->data['message'] ?? 'Notification' }}</h4>
        <p>Invoice #{{ $notification->data['invoice_id'] }} - Rp{{ number_format($notification->data['amount'], 2) }}</p>
        <small>{{ $notification->created_at->diffForHumans() }}</small>
        
        @if(!$notification->read_at)
            <button onclick="markAsRead({{ $notification->id }})">Tandai Dibaca</button>
        @endif
    </div>
@endforeach
```

#### 9.4 Menandai Sebagai Dibaca

**Mengapa?** Karena kamu ingin mencatat kapan pengguna membaca notifikasi.

**Bagaimana?** Gunakan method-method bantuan:

```php
// Menandai semua notifikasi belum dibaca sebagai sudah dibaca
auth()->user()->unreadNotifications->markAsRead();

// Menandai satu notifikasi
$notification = auth()->user()->notifications()->first();
$notification->markAsRead();

// Menandai hanya notifikasi tertentu
auth()->user()->unreadNotifications()
    ->where('type', 'App\Notifications\InvoicePaid')
    ->update(['read_at' => now()]);

// Secara massal tanpa memuat ke memory
auth()->user()->unreadNotifications()->update(['read_at' => now()]);
```

**Contoh Lengkap Penerapan:**
```php
use App\Models\User;
use App\Notifications\InvoicePaid;
use Illuminate\Support\Facades\Notification;

// Dalam service class
class NotificationDashboardService
{
    public function getUserNotificationSummary(User $user)
    {
        return [
            'total' => $user->notifications()->count(),
            'unread' => $user->unreadNotifications()->count(),
            'read' => $user->readNotifications()->count(),
            'recent' => $user->notifications()->latest()->take(5)->get(),
            'invoice_notifications' => $user->notifications()
                ->where('type', InvoicePaid::class)
                ->count()
        ];
    }
    
    public function getUnreadNotificationsForDashboard(User $user)
    {
        return $user->unreadNotifications()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
    }
    
    public function markNotificationsAsRead(User $user, array $notificationIds)
    {
        return $user->notifications()
            ->whereIn('id', $notificationIds)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }
}

// Dalam API controller untuk notifikasi real-time
class ApiNotificationController extends Controller
{
    public function getUnreadCount()
    {
        return response()->json([
            'count' => auth()->user()->unreadNotifications()->count()
        ]);
    }
    
    public function getRecent()
    {
        $notifications = auth()->user()->notifications()
            ->latest()
            ->take(20)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => class_basename($notification->type),
                    'message' => $notification->data['message'] ?? 'New notification',
                    'data' => $notification->data,
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at->toISOString(),
                    'is_read' => !is_null($notification->read_at)
                ];
            });
            
        return response()->json($notifications);
    }
    
    public function markAsRead(Request $request)
    {
        $notification = auth()->user()->notifications()->findOrFail($request->id);
        $notification->markAsRead();
        
        return response()->json(['status' => 'marked_as_read']);
    }
}
```

**Penjelasan Kode:**
- Database notifications disimpan dalam tabel `notifications`
- Bisa diakses lewat relationship dari model dengan trait `Notifiable`
- Tersedia method untuk membedakan notifikasi yang sudah dibaca dan belum
- Sangat cocok untuk dashboard notifikasi dalam aplikasi

### 10. 🔊 Broadcast Notifications (Notifikasi Real-time)

**Analogi:** Bayangkan kamu sedang nonton siaran langsung bola di stadion, dan setiap kali terjadi gol, semua orang langsung mendapat pemberitahuan secara real-time di layar besar. Broadcast Notifications bekerja seperti ini - mengirim notifikasi langsung ke semua pengguna yang sedang online di aplikasi kamu.

**Mengapa ini penting?** Karena dalam aplikasi modern, pengguna sering ingin informasi langsung tanpa harus refresh halaman. Ini bagus untuk chat, sistem komentar, atau notifikasi real-time lainnya.

**Bagaimana cara kerjanya?** Notifikasi dikirim melalui sistem broadcasting ke semua klien yang sedang listen ke channel tertentu.

#### 10.1 Setup Broadcast

**Mengapa?** Karena kamu perlu konfigurasi untuk broadcasting.

**Bagaimana?** Pastikan kamu sudah setup broadcasting:

```bash
# Install Pusher jika menggunakan Pusher
composer require pusher/pusher-php-server

# Atau setup Redis untuk broadcasting internal
```

#### 10.2 Format Broadcast Notifications

**Mengapa?** Karena broadcast butuh format khusus untuk dikirim ke klien.

**Bagaimana?** Gunakan method `toBroadcast()`:

```php
use Illuminate\Notifications\Messages\BroadcastMessage;

public function toBroadcast(object $notifiable): BroadcastMessage
{
    return new BroadcastMessage([
        'invoice_id' => $this->invoice->id,
        'amount' => $this->invoice->amount,
        'message' => 'Invoice #' . $this->invoice->id . ' telah dibayar',
        'user' => [
            'id' => $notifiable->id,
            'name' => $notifiable->name,
        ],
        'created_at' => now()->toISOString(),
    ]);
}
```

**Contoh Lengkap:**
```php
class InvoicePaid extends Notification
{
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'id' => $this->invoice->id,
            'amount' => $this->invoice->amount,
            'customer_name' => $this->invoice->customer->name,
            'message' => 'Pembayaran invoice berhasil',
            'read_at' => null, // Karena broadcast notifikasi baru
        ])->onConnection('redis')  // Gunakan connection tertentu
          ->onQueue('broadcasts'); // Masukkan ke queue tertentu
    }
}
```

#### 10.3 Listening di Sisi Klien (JavaScript)

**Mengapa?** Karena kamu perlu menerima notifikasi broadcast di sisi klien.

**Bagaimana?** Gunakan Laravel Echo di JavaScript:

```javascript
// Di file JavaScript kamu
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Echo.private(`App.Models.User.${userId}`)
    .notification((notification) => {
        console.log('Notifikasi diterima:', notification);
        
        // Tampilkan di UI
        showNotification(notification);
    });

// Atau listen ke channel tertentu
window.Echo.channel('invoices')
    .listen('InvoicePaid', (e) => {
        console.log('Invoice dibayar:', e.invoice);
        updateInvoiceStatus(e.invoice.id, 'paid');
    });
```

#### 10.4 Contoh Implementasi Lengkap

**Controller untuk broadcast:**
```php
class InvoiceController extends Controller
{
    public function markAsPaid(Invoice $invoice)
    {
        $invoice->update(['status' => 'paid', 'paid_at' => now()]);
        
        // Kirim notifikasi ke user dan broadcast
        $invoice->user->notify(new InvoicePaid($invoice));
        
        // Broadcast ke semua user yang mungkin listen
        broadcast(new InvoicePaidBroadcast($invoice));
        
        return response()->json(['status' => 'paid']);
    }
}
```

**Event Broadcast:**
```php
class InvoicePaidBroadcast implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Invoice $invoice) {}

    public function broadcastOn()
    {
        return new Channel('invoices');
    }
}
```

### 11. 📱 SMS Notifications (Notifikasi via SMS dengan Vonage)

**Analogi:** Bayangkan kamu seorang manajer yang sangat sibuk dan tidak selalu bisa cek email, tapi HP selalu kamu bawa. SMS Notifications seperti asisten pribadi yang mengirimkan informasi penting langsung ke HP kamu.

**Mengapa ini penting?** Karena SMS punya tingkat pembacaan yang sangat tinggi dan langsung. Cocok untuk notifikasi penting seperti verifikasi, pembayaran, atau peringatan kritis.

**Bagaimana cara kerjanya?** Gunakan channel Vonage (dulu Nexmo) yang terintegrasi dengan Laravel.

#### 11.1 Setup SMS Notifications

**Mengapa?** Karena kamu perlu setup layanan SMS terlebih dahulu.

**Bagaimana?** Install dan konfigurasi Vonage:

```bash
composer require laravel/vonage-notification-channel
```

**Konfigurasi `.env`:**
```env
VONAGE_KEY=your_vonage_key
VONAGE_SECRET=your_vonage_secret
VONAGE_SMS_FROM=1234567890
```

#### 11.2 Format SMS Notifications

**Mengapa?** Karena SMS punya format dan batasan karakter tersendiri.

**Bagaimana?** Gunakan method `toVonage()`:

```php
use Illuminate\Notifications\Messages\VonageMessage;

public function toVonage(object $notifiable): VonageMessage
{
    return (new VonageMessage)
        ->content("Invoice #{$this->invoice->id} telah dibayar. Jumlah: {$this->invoice->amount}");
}
```

**Contoh Lengkap:**
```php
class InvoicePaid extends Notification
{
    public function via(object $notifiable): array
    {
        return ['vonage']; // Hanya SMS
        // atau ['mail', 'vonage', 'database'] untuk banyak channel
    }

    public function toVonage(object $notifiable): VonageMessage
    {
        return (new VonageMessage)
            ->content("Pembayaran invoice #{$this->invoice->id} sebesar {$this->invoice->amount} telah diterima.")
            ->from(config('vonage.sms_from')) // Nomor pengirim kustom
            ->unicode(); // Aktifkan unicode untuk karakter khusus
    }
}
```

#### 11.3 Pengaturan Rute SMS

**Mengapa?** Karena mungkin user menyimpan nomor di field yang berbeda.

**Bagaimana?** Gunakan method `routeNotificationForVonage()` di model:

```php
class User extends Authenticatable
{
    // ... kode model
    
    public function routeNotificationForVonage($notification)
    {
        return $this->phone_number; // Sesuaikan dengan nama field kamu
    }
}
```

#### 11.4 SMS dengan Media (MMS)

**Mengapa?** Karena kadang kamu perlu kirim gambar atau dokumen via SMS.

**Bagaimana?** Gunakan method `media()`:

```php
public function toVonage(object $notifiable): VonageMessage
{
    return (new VonageMessage)
        ->content("Lihat lampiran invoice Anda")
        ->media('https://example.com/invoice.jpg'); // URL gambar
}
```

### 12. 💬 Slack Notifications (Notifikasi ke Slack)

**Analogi:** Bayangkan kamu punya tim kerja yang selalu aktif di Slack, dan kamu ingin memberi tahu mereka tentang event penting seperti pembayaran, error sistem, atau aktivitas pengguna. Slack Notifications seperti juru bicara yang memberi pengumuman langsung ke channel kerja kamu.

**Mengapa ini penting?** Karena banyak tim menggunakan Slack sebagai pusat komunikasi. Mengirim notifikasi ke Slack memastikan tim selalu update tentang hal penting.

**Bagaimana cara kerjanya?** Integrasi dengan Slack API untuk kirim pesan ke channel tertentu.

#### 12.1 Setup Slack Notifications

**Mengapa?** Karena kamu perlu konfigurasi Slack terlebih dahulu.

**Bagaimana?** Install dan konfigurasi:

```bash
composer require laravel/slack-notification-channel
```

**Konfigurasi `config/services.php`:**
```php
'slack' => [
    'notifications' => [
        'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
        'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
    ],
],
```

#### 12.2 Format Slack Notifications

**Mengapa?** Karena Slack punya format pesan khusus yang kaya fitur.

**Bagaimana?** Gunakan method `toSlack()`:

```php
use Illuminate\Notifications\Messages\SlackMessage;

public function toSlack(object $notifiable): SlackMessage
{
    return (new SlackMessage)
        ->success()  // Warna hijau untuk sukses
        ->content('Invoice Paid!')
        ->attachment(function ($attachment) {
            $attachment->title('Invoice #' . $this->invoice->id)
                       ->fields([
                           'Amount' => $this->invoice->amount,
                           'Customer' => $this->invoice->user->name,
                           'Date' => $this->invoice->paid_at->format('Y-m-d'),
                       ]);
        });
}
```

**Contoh Lengkap:**
```php
class SystemAlert extends Notification
{
    public function via(object $notifiable): array
    {
        return ['slack'];
    }

    public function toSlack(object $notifiable): SlackMessage
    {
        return (new SlackMessage)
            ->error()  // Warna merah untuk error
            ->content('🚨 Sistem mengalami error kritis!')
            ->attachment(function ($attachment) {
                $attachment->title('Database Connection Failed')
                           ->fields([
                               'Server' => gethostname(),
                               'Time' => now()->format('Y-m-d H:i:s'),
                               'Environment' => app()->environment(),
                           ])
                           ->footer('Aplikasi Monitoring')
                           ->timestamp(now());
            })
            ->to('#critical-alerts');  // Kirim ke channel tertentu
    }
}
```

#### 12.3 Pengaturan Rute Slack

**Mengapa?** Karena kamu mungkin ingin kirim ke channel yang berbeda berdasarkan notifikasi.

**Bagaimana?** Gunakan method `routeNotificationForSlack()`:

```php
class SystemAlert extends Notification
{
    public function routeNotificationForSlack($notification)
    {
        if ($this->isCritical) {
            return '#critical-alerts';  // Channel khusus untuk error kritis
        }
        
        return '#notifications';  // Channel default
    }
}
```

### 13. 🧪 Testing Notifications (Testing Notifikasi dengan Tepat)

**Analogi:** Bayangkan kamu seorang koki yang sebelum menyajikan hidangan ke pelanggan, kamu selalu mencicipinya dulu untuk memastikan rasanya pas. Testing Notifications seperti mencicipi hidangan - memastikan notifikasi dikirim dengan benar tanpa benar-benar mengirimkannya ke pengguna.

**Mengapa ini penting?** Karena kamu ingin memastikan notifikasi dikirim ke penerima yang benar, dengan pesan yang benar, dan lewat channel yang benar - tanpa mengganggu pengguna saat testing.

**Bagaimana cara kerjanya?** Gunakan facade `Notification::fake()` untuk menyimulasikan pengiriman notifikasi.

#### 13.1 Setup Testing

**Mengapa?** Karena kamu perlu setup testing environment.

**Bagaimana?** Gunakan `Notification::fake()` di test setUp:

```php
use Illuminate\Support\Facades\Notification;

class NotificationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        
        Notification::fake();  // Matikan pengiriman nyata
    }
    
    public function test_invoice_paid_notification_sent()
    {
        $user = User::factory()->create();
        $invoice = Invoice::factory()->create(['user_id' => $user->id]);
        
        // Lakukan aksi yang seharusnya kirim notifikasi
        $this->post("/invoices/{$invoice->id}/pay");
        
        // Cek apakah notifikasi dikirim
        Notification::assertSentTo($user, InvoicePaid::class);
    }
}
```

#### 13.2 Assertion Methods

**Mengapa?** Karena kamu perlu berbagai cara untuk memverifikasi notifikasi.

**Bagaimana?** Gunakan berbagai assertion methods:

```php
// Cek tidak ada notifikasi dikirim
Notification::assertNothingSent();

// Cek notifikasi dikirim ke user tertentu
Notification::assertSentTo([$user], OrderShipped::class);

// Cek notifikasi TIDAK dikirim ke user tertentu
Notification::assertNotSentTo([$user], AnotherNotification::class);

// Cek jumlah pengiriman
Notification::assertSentTimes(WeeklyReminder::class, 2);

// Cek total jumlah notifikasi
Notification::assertCount(3);

// Cek untuk on-demand notifications
Notification::assertSentOnDemand(OrderShipped::class);
```

#### 13.3 Assertion dengan Closure

**Mengapa?** Karena kamu mungkin perlu cek konten notifikasi.

**Bagaimana?** Gunakan closure untuk cek detail:

```php
Notification::assertSentTo(
    $user,
    fn (OrderShipped $notification) => $notification->order->id === $order->id
);

// Atau cek data dalam notifikasi
Notification::assertSentTo($user, InvoicePaid::class, function ($notification) use ($invoice) {
    return $notification->invoice->id === $invoice->id && 
           $notification->invoice->amount > 1000;
});
```

#### 13.4 Complete Testing Example

**Contoh lengkap testing:**
```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Invoice;
use App\Notifications\InvoicePaid;
use Illuminate\Support\Facades\Notification;
use Illuminate\Foundation\Testing\RefreshDatabase;

class InvoicePaymentNotificationsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Notification::fake();
    }

    public function test_notification_sent_when_invoice_paid()
    {
        $user = User::factory()->create();
        $invoice = Invoice::factory()->create([
            'user_id' => $user->id,
            'amount' => 1500
        ]);

        // Aksi: bayar invoice
        $response = $this->postJson("/api/invoices/{$invoice->id}/pay");

        // Verifikasi: response dan notifikasi
        $response->assertStatus(200);
        
        Notification::assertSentTo($user, InvoicePaid::class, function ($notification, $channels) use ($invoice) {
            return $notification->invoice->id === $invoice->id &&
                   in_array('mail', $channels) &&
                   in_array('database', $channels);
        });
    }

    public function test_no_notification_sent_for_failed_payment()
    {
        $user = User::factory()->create();
        $invoice = Invoice::factory()->create(['user_id' => $user->id]);

        // Aksi: pembayaran gagal
        $response = $this->postJson("/api/invoices/{$invoice->id}/pay", [
            'payment_method' => 'credit_card',
            'card_number' => '4000000000000002'  // Kartu yang akan ditolak
        ]);

        // Verifikasi: tidak ada notifikasi dikirim
        $response->assertStatus(422);
        Notification::assertNothingSent();
    }
}
```

**Penjelasan Kode:**
- `Notification::fake()` menonaktifkan pengiriman nyata
- Berbagai assertion methods untuk cek kondisi yang berbeda
- Closure untuk validasi detail notifikasi
- Testing untuk kasus sukses dan gagal

### 14. 🔌 Custom Channels (Channel Notifikasi Buatan Sendiri)

**Analogi:** Bayangkan kamu punya banyak saluran komunikasi sendiri - mungkin sistem internal, API khusus, atau bahkan cara unik untuk mengirim pesan. Custom Channels seperti membuat jalur komunikasi sendiri yang tidak tergantung pada channel-channel bawaan Laravel.

**Mengapa ini penting?** Karena terkadang kamu perlu integrasi dengan sistem eksternal yang tidak didukung oleh Laravel secara default, atau kamu ingin kontrol penuh atas bagaimana notifikasi dikirim.

**Bagaimana cara kerjanya?** Buat class channel sendiri yang mengimplementasikan interface notifikasi, lalu daftarkan ke sistem Laravel.

#### 14.1 Membuat Custom Channel Class

**Mengapa?** Karena kamu perlu definisikan bagaimana notifikasi dikirim lewat channel kamu.

**Bagaimana?** Buat class dengan method `send()`:

```php
<?php

namespace App\Channels;

use Illuminate\Notifications\Notification;

class VoiceChannel
{
    public function send($notifiable, Notification $notification): void
    {
        $message = $notification->toVoice($notifiable);
        
        // Kirim ke layanan voice call
        $this->makeVoiceCall(
            $notifiable->routeNotificationForVoice($notification),
            $message
        );
    }
    
    private function makeVoiceCall($phoneNumber, $message): void
    {
        // Implementasi untuk panggilan suara
        // Bisa menggunakan Twilio, Aculab, atau layanan voice lain
    }
}
```

#### 14.2 Gunakan Custom Channel di Notification

**Mengapa?** Karena kamu perlu memberi tahu sistem bahwa kamu ingin gunakan channel custom.

**Bagaimana?** Tambahkan nama class channel ke method `via()`:

```php
class InvoicePaid extends Notification
{
    public function via(object $notifiable): array
    {
        return [VoiceChannel::class, 'mail', 'database'];
    }
    
    public function toVoice(object $notifiable): string
    {
        return "Halo, ini adalah pemberitahuan bahwa invoice nomor {$this->invoice->id} telah dibayar sebesar {$this->invoice->amount}";
    }
}
```

#### 14.3 Setup Custom Channel Service Provider

**Mengapa?** Karena kamu perlu daftarkan channel ke sistem Laravel.

**Bagaimana?** Di service provider:

```php
// Di AppServiceProvider atau service provider khusus
use App\Channels\VoiceChannel;
use Illuminate\Support\Facades\Notification;

public function boot()
{
    Notification::extend('voice', function () {
        return new VoiceChannel();
    });
}
```

#### 14.4 Contoh Lengkap Custom Channel

**Custom Push Notification Channel:**
```php
<?php

namespace App\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Http;

class PushNotificationChannel
{
    public function send($notifiable, Notification $notification): void
    {
        $message = $notification->toPushNotification($notifiable);
        
        $deviceTokens = $notifiable->device_tokens ?? collect();
        
        foreach ($deviceTokens as $token) {
            $this->sendToDevice($token, $message);
        }
    }
    
    private function sendToDevice($deviceToken, $message): void
    {
        // Kirim ke Firebase atau sistem push notification lain
        Http::withHeaders([
            'Authorization' => 'key=' . config('services.firebase.server_key'),
            'Content-Type' => 'application/json',
        ])->post('https://fcm.googleapis.com/fcm/send', [
            'to' => $deviceToken,
            'notification' => [
                'title' => $message['title'],
                'body' => $message['body'],
            ],
            'data' => $message['data'] ?? [],
        ]);
    }
}

// Di notification
class InvoicePaid extends Notification
{
    public function via(object $notifiable): array
    {
        return ['push-notification', 'mail'];
    }
    
    public function toPushNotification(object $notifiable): array
    {
        return [
            'title' => 'Invoice Dibayar',
            'body' => "Invoice #{$this->invoice->id} telah berhasil dibayar",
            'data' => [
                'invoice_id' => $this->invoice->id,
                'type' => 'invoice_paid'
            ]
        ];
    }
}
```

**Penjelasan Kode:**
- Custom channel harus punya method `send()`
- Bisa integrasi dengan sistem eksternal
- Daftarkan di service provider untuk bisa digunakan

## Bagian 3: Tips & Best Practices dari Guru 🎓

### 15. ✅ Best Practices & Tips (Kiat-kiat Bijak)

Setelah belajar banyak hal tentang Notifications, sekarang waktunya memahami **cara menggunakan Notifications yang bijak**. Seperti pedang bermata dua, Notifications bisa sangat membantu... atau sangat mengganggu jika tidak digunakan dengan benar.

**1. 🎯 Jangan Spam Pengguna**
- Batasi frekuensi notifikasi
- Gunakan queue untuk notifikasi massal
- Beri opsi pengguna untuk menonaktifkan jenis notifikasi tertentu
- Contoh benar:
```php
// ✅ BENAR - kirim hanya satu ringkasan
Notification::send($users, new DailySummaryNotification($dailyUpdates));

// ❌ SALAH - kirim banyak notifikasi individual dalam loop
foreach ($dailyUpdates as $update) {
    Notification::send($users, new IndividualUpdateNotification($update));
}
```

**2. 🧠 Gunakan Channel Secara Bijak**
- Jangan kirim notifikasi penting lewat channel yang tidak diutamakan pengguna
- Pertimbangkan waktu dan konteks saat kirim notifikasi
- Gunakan kombinasi channel untuk jaminan delivery
```php
// ✅ BENAR - kombinasi untuk notifikasi kritis
public function via($notifiable) {
    return ['database', 'mail', 'broadcast'];  // Backup channel
}

// ❌ SALAH - kirim ke semua channel tanpa pertimbangan
public function via($notifiable) {
    return ['mail', 'database', 'broadcast', 'slack', 'vonage', 'custom_channel'];
}
```

**3. ⚡ Optimalkan Performa**
- Gunakan queue untuk notifikasi yang tidak segera
- Gunakan `Notification::sendNow()` untuk notifikasi kritis yang perlu langsung
- Tunda notifikasi non-kritis
```php
// ✅ BENAR - notifikasi kritis langsung
$user->notify(new CriticalAlert($alert));  // Langsung kirim

// ✅ BENAR - notifikasi non-kritis diqueue
Notification::send($users, (new WeeklyDigest($digest))->delay(now()->addMinutes(5)));
```

**4. 🔐 Jaga Keamanan Data**
- Jangan sertakan data sensitif dalam notifikasi
- Gunakan short-lived links untuk tindakan sensitif
- Mask data penting dalam notifikasi
```php
// ✅ BENAR - mask data sensitif
return (new MailMessage)
    ->line("Kartu akhir dengan nomor ...".substr($this->cardNumber, -4)." telah digunakan.");

// ❌ SALAH - sertakan data lengkap
return (new MailMessage)
    ->line("Kartu dengan nomor {$this->cardNumber} telah digunakan.");
```

**5. 📊 Lacak dan Uji**
- Gunakan tools analitik untuk melacak delivery rate
- Test berbagai channel secara berkala
- Monitor error dan retry logic
```php
// Gunakan monitoring untuk notifikasi penting
public function failed(\Throwable $exception)
{
    \Log::error('Notification failed:', [
        'notification' => get_class($this),
        'exception' => $exception->getMessage(),
        'context' => [
            'invoice_id' => $this->invoice->id ?? null,
            'user_id' => $this->notifiable->id ?? null,
        ]
    ]);
    
    // Kirim ke monitoring service (Sentry, etc)
    report($exception);
}
```

**6. 🎨 Jaga Konsistensi Brand**
- Gunakan template dan gaya yang konsisten
- Maintain tone dan voice brand di semua channel
- Gunakan branding di semua notifikasi
```php
// Gunakan helper atau trait untuk konsistensi
trait NotificationBranding
{
    protected function addBrandElements($mail)
    {
        return $mail
            ->from(config('mail.from.address'), config('app.name'))
            ->with('brand_color', config('app.brand_color'));
    }
}
```

## Bagian 4: Troubleshooting & Penyelesaian Masalah 🔧

### 16. ⚠️ Troubleshooting Umum (Solusi Masalah yang Sering Terjadi)

**1. 🔁 Notifikasi Tidak Dikirim**
- Cek apakah queue worker jalan: `php artisan queue:work`
- Pastikan `ShouldQueue` interface diimplementasikan
- Cek log queue: `storage/logs/laravel.log`
- Solusi:
```php
// Cek apakah notifikasi dikirim dengan sendNow
Notification::sendNow($users, new TestNotification());

// Atau pastikan queue worker jalan
// php artisan queue:listen atau jalankan supervisor
```

**2. 📧 Email Tidak Terkirim**
- Pastikan konfigurasi mail benar di `.env`
- Cek apakah mail driver didukung
- Cek limit rate provider email
- Solusi:
```bash
# Test konfigurasi kirim email
php artisan tinker
>>> Mail::raw('Test', function($message) { $message->to('test@example.com')->subject('Test'); });
```

**3. 📱 SMS Tidak Terkirim**
- Pastikan credentials Vonage benar
- Cek apakah nomor valid dan aktif
- Pastikan format nomor benar (international format)
- Solusi:
```php
// Di model User
public function routeNotificationForVonage($notification)
{
    // Pastikan nomor dalam format internasional
    return '+' . ltrim($this->phone_number, '0');
}
```

**4. 📊 Database Notifications Tidak Muncul**
- Pastikan migration sudah dijalankan
- Pastikan `Notifiable` trait ditambahkan ke model
- Cek apakah `'database'` disertakan di method `via()`
- Solusi:
```php
// Pastikan trait ada
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable; // Pastikan ini ada
}
```

## Bagian 5: Kumpulan Contoh Lengkap 🧩

### 17. 🧩 Contoh Implementasi End-to-End (Skenario Dunia Nyata)

**Skenario**: User melakukan pembayaran invoice. Setelah pembayaran berhasil:
- User menerima **Email** konfirmasi.
- Notifikasi tersimpan di **Database**.
- Tim finance menerima notifikasi di **Slack**.

#### 17.1 Membuat Event

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

#### 17.2 Membuat Notification

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

#### 17.3 Menjalankan Notification dari Listener

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

#### 17.4 Trigger Event

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

#### 17.5 Hasil Akhir

- **Email**: User menerima email dengan link invoice.
- **Database**: Tabel `notifications` terisi data invoice.
- **Slack**: Channel `#finance-team` menerima notifikasi invoice yang baru dibayar.

> 🎯 Dengan pola ini, aplikasi bisa **mengintegrasikan banyak channel notifikasi sekaligus** secara elegan.

## Bagian 6: Menjadi Master Notifications 🏆

### 18. ✨ Wejangan dari Guru

Setelah kamu menempuh perjalanan panjang bersama Guru dalam mempelajari Notifications di Laravel, inilah **wejangan bijak** yang harus kamu ingat:

**1. 🎯 Focus pada Pengalaman Pengguna**
- Kirim notifikasi yang bernilai, bukan spam
- Hormati waktu dan perhatian pengguna
- Gunakan timing yang tepat

**2. 🔄 Integrasikan dengan Sistem Lain**
- Gunakan notifications untuk membangun workflow otomatis
- Integrasikan dengan CRM, helpdesk, dan sistem lain
- Gunakan sebagai bagian dari strategi komunikasi keseluruhan

**3. 📊 Monitor dan Analisis**
- Lacak delivery rate dan engagement
- Gunakan data untuk meningkatkan timing dan konten
- A/B test untuk meningkatkan efektivitas

### 19. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah **referensi cepat** untuk berbagai fitur Notifications di Laravel:

#### 🧰 Basic Operations
| Perintah | Fungsi |
|----------|--------|
| `php artisan make:notification InvoicePaid` | Buat notification class |
| `$user->notify(new InvoicePaid($invoice))` | Kirim ke satu user |
| `Notification::send($users, $notification)` | Kirim ke banyak user |
| `Notification::sendNow($users, $notification)` | Kirim tanpa queue |

#### 📡 Channel Options
| Channel | Fungsi |
|---------|--------|
| `'mail'` | Kirim lewat email |
| `'database'` | Simpan ke tabel notifications |
| `'broadcast'` | Kirim lewat sistem broadcasting |
| `'vonage'` | Kirim lewat SMS |
| `'slack'` | Kirim ke channel Slack |

#### ⏰ Queue Options
| Method | Fungsi |
|--------|--------|
| `implements ShouldQueue` | Jadikan notifikasi diqueue |
| `->delay($time)` | Tunda pengiriman |
| `->onConnection('redis')` | Gunakan connection tertentu |
| `->onQueue('high-priority')` | Masukkan ke queue tertentu |

#### 🧪 Testing Methods
| Method | Fungsi |
|--------|--------|
| `Notification::fake()` | Matikan pengiriman nyata |
| `Notification::assertSentTo()` | Cek notifikasi dikirim ke user |
| `Notification::assertNotSentTo()` | Cek notifikasi TIDAK dikirim |
| `Notification::assertCount()` | Cek jumlah total notifikasi |

### 20. 🎯 Kesimpulan Akhir

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Notifications, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Notifications adalah fitur yang **sangat powerful** untuk meningkatkan pengalaman pengguna dan membangun sistem komunikasi yang efektif.

Dengan Notifications, kamu bisa:
- Mengirim pesan ke berbagai saluran sekaligus (email, SMS, Slack, database)
- Menjaga pengalaman pengguna dengan notifikasi real-time
- Membangun sistem komunikasi otomatis dan terstruktur
- Mengintegrasikan dengan berbagai layanan eksternal
- Membangun workflow bisnis yang efisien

Notifications adalah alat yang sangat berguna untuk membangun aplikasi yang **terasa hidup** dan **interaktif**. Dengan penggunaan yang benar (queue management, channel selection, user preferences), pengalaman pengguna aplikasi Laravel-mu akan meningkat **signifikan**.

**Jangan pernah berhenti belajar dan mencoba.** Implementasikan Notifications di proyekmu, uji berbagai channel, dan kamu akan melihat betapa berharganya fitur ini dalam dunia nyata. Selamat ngoding, murid kesayanganku!
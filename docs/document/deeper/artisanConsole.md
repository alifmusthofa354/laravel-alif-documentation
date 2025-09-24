# 🪄 Artisan Console: Tongkat Sihir Developer Laravel

Hai para penyihir kode! Selamat datang di kelas lanjutan kita. Hari ini, kita akan mempelajari salah satu alat paling kuat di gudang senjata seorang developer Laravel: **Artisan Console**.

**Analogi:** Bayangkan kamu adalah seorang penyihir, dan Artisan adalah **tongkat sihirmu**. Dengan mantra yang tepat, kamu bisa melakukan hal-hal luar biasa—membangun bagian-bagian aplikasi, menjalankan tugas-tugas rumit, dan bahkan memperbaiki masalah—semua hanya dengan beberapa ketukan di terminal.

Di panduan ini, kita akan kupas tuntas setiap mantra yang perlu kamu ketahui, dari yang paling dasar hingga yang paling canggih. Siap ayunkan tongkat sihirmu? Ayo mulai!

---

## Bagian 1: Kenalan Dengan Tongkat Sihirmu 🧙

### 1. 📖 Apa Itu Artisan?

Artisan adalah *command-line interface* (CLI) atau antarmuka baris perintah yang datang bersama Laravel. Ia menyediakan puluhan perintah siap pakai yang akan menghemat **banyak sekali** waktumu.

**Mengapa ini penting?** Tanpa Artisan, kamu harus membuat file, folder, dan kode-kode boilerplate (kode yang itu-itu saja) secara manual. Dengan Artisan, semua itu bisa dilakukan dengan satu baris perintah. Efisien, cepat, dan bebas dari kesalahan ketik!

#### Mantra Dasar yang Wajib Tahu:

🔹 **Melihat Semua Mantra (Perintah)**
Untuk melihat semua perintah yang tersedia, gunakan mantra `list`:
```bash
php artisan list
```

🔹 **Membaca Buku Mantra (Bantuan)**
Jika kamu lupa cara menggunakan sebuah perintah, panggil saja bantuannya:
```bash
php artisan help make:controller
```

#### 🐳 Khusus Pengguna Laravel Sail
Jika kamu menggunakan Sail, jangan lupa untuk mengawali setiap perintah Artisan dengan `sail`:
```bash
./vendor/bin/sail artisan list
```

### 2. 🧪 Tinker: Arena Bermain Ajaib (REPL)

**Analogi:** Jika Artisan adalah tongkat sihir, maka **Tinker** adalah **laboratorium atau arena latihan pribadimu**. Di sini, kamu bisa mencoba kode Laravel, berinteraksi dengan database, dan menjalankan fungsi apa pun secara *real-time* tanpa perlu membuat route atau controller.

**Bagaimana cara masuk?**
```bash
php artisan tinker
```
Setelah masuk, kamu bisa langsung menjalankan kode PHP dan Laravel:
```php
// Langsung akses model dari database
App\Models\User::find(1);

// Membuat user baru
App\Models\User::create(['name' => 'Murid Teladan', 'email' => 'murid@laravel.com', 'password' => bcrypt('rahasia')]);

// Mencoba helper Laravel
str('halo dunia')->upper();
```
Tinker sangat berguna untuk debugging cepat, mencoba query Eloquent, atau sekadar bereksperimen.

---

## Bagian 2: Membuat Mantra Sendiri (Menulis Perintah) ✍️

Inilah bagian paling seru: membuat perintah Artisan versimu sendiri!

### 3. ✨ Resep Membuat Perintah Baru

Mari kita buat sebuah perintah untuk mengirim email pengingat kepada pengguna yang sudah lama tidak aktif.

#### Langkah 1️⃣: Siapkan Kerangka Mantra (Generate Command)
Gunakan mantra `make:command` untuk membuat file perintah baru:
```bash
php artisan make:command SendReminderEmails
```
Laravel akan membuatkan file baru di `app/Console/Commands/SendReminderEmails.php`.

#### Langkah 2️⃣: Tentukan Nama & Deskripsi Mantra
Buka file tersebut dan isi properti `$signature` dan `$description`.
- `$signature`: Ini adalah nama unik dari perintahmu.
- `$description`: Penjelasan singkat tentang apa yang dilakukan perintah ini.

```php
// app/Console/Commands/SendReminderEmails.php
class SendReminderEmails extends Command
{
    /**
     * Nama dan signature dari perintah console.
     * 'user:remind' adalah nama perintahnya.
     */
    protected $signature = 'user:remind';

    /**
     * Deskripsi dari perintah console.
     */
    protected $description = 'Kirim email pengingat ke pengguna yang tidak aktif';

    // ...
}
```

#### Langkah 3️⃣: Tulis Logika Mantra di `handle()`
Method `handle()` adalah tempat semua keajaiban terjadi. Di sinilah kamu menulis logika utama dari perintahmu.

```php
// app/Console/Commands/SendReminderEmails.php
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReminderEmail; // Anggap kita sudah punya Mailable ini

public function handle(): void
{
    // 1. Tampilkan pesan informasi di console
    $this->info('Mencari pengguna tidak aktif...');

    // 2. Ambil pengguna yang tidak login lebih dari 30 hari
    $inactiveUsers = User::where('last_login_at', '<', now()->subDays(30))->get();

    if ($inactiveUsers->isEmpty()) {
        $this->info('Tidak ada pengguna tidak aktif yang ditemukan. Kerja bagus!');
        return;
    }

    // 3. Buat progress bar agar terlihat keren!
    $this->withProgressBar($inactiveUsers, function ($user) {
        // 4. Kirim email ke setiap pengguna
        Mail::to($user)->send(new ReminderEmail($user));
    });

    // 5. Tampilkan pesan sukses setelah selesai
    $this->newLine(); // Beri baris baru
    $this->info('Email pengingat berhasil dikirim ke ' . $inactiveUsers->count() . ' pengguna.');
}
```

#### Langkah 4️⃣: Daftarkan Mantra Baru
Perintah berbasis kelas secara otomatis terdeteksi oleh Laravel. Kamu tidak perlu mendaftarkannya secara manual!

#### Langkah 5️⃣: Jalankan Mantra!
Sekarang, kamu bisa menjalankan perintah barumu dari terminal:
```bash
php artisan user:remind
```
Keren, kan? Kamu baru saja membuat alat otomatisasi versimu sendiri!

### 4. 🧩 Perintah Simpel (Closure Commands)

Untuk tugas-tugas yang sangat sederhana, kamu bisa mendefinisikan perintah langsung di file `routes/console.php` tanpa harus membuat file kelas.

```php
// routes/console.php
use Illuminate\Support\Facades\Artisan;

Artisan::command('hello', function () {
    $this->comment('Halo, Murid Kesayanganku!');
})->purpose('Menampilkan pesan sapaan dari Guru.');
```
Jalankan dengan: `php artisan hello`.

---

## Bagian 3: Mengatur Input & Output Perintah 🛠️

Perintahmu bisa menjadi lebih interaktif dan fleksibel dengan menerima input.

### 5. 📌 Argumen: Input Wajib

Argumen adalah input yang posisinya penting.
```php
// {user} adalah argumen wajib
// {--s|silent} adalah opsi (lihat di bawah)
protected $signature = 'mail:send {user} {--s|silent}';

public function handle()
{
    // Mengambil nilai argumen 'user'
    $userId = $this->argument('user');
    $user = User::find($userId);

    // ... logika mengirim email
}
```
**Cara menjalankan:** `php artisan mail:send 1` (angka `1` adalah nilai untuk `user`).

**Jenis-jenis Argumen:**
- `{user}`: Wajib diisi.
- `{user?}`: Opsional (tidak wajib).
- `{user=1}`: Opsional dengan nilai default `1`.
- `{user*}`: Bisa menerima banyak nilai (array).

### 6. ⚙️ Opsi: Input Fleksibel

Opsi diawali dengan `--` dan tidak bergantung pada posisi. Mereka seperti *setting* tambahan.
```php
// --queue adalah opsi boolean (ada atau tidak)
// --channel= adalah opsi yang butuh nilai
protected $signature = 'report:generate {--queue} {--channel=}';

public function handle()
{
    if ($this->option('queue')) {
        $this->info('Laporan akan dijalankan di background (queued).');
    }

    if ($channel = $this->option('channel')) {
        $this->info("Laporan akan dikirim ke channel: {$channel}.");
    }
}
```
**Cara menjalankan:**
- `php artisan report:generate --queue`
- `php artisan report:generate --channel=slack`
- `php artisan report:generate --queue --channel=email`

### 7. 💻 Interaksi dengan Pengguna (Command I/O)

Kamu bisa membuat perintahmu "berbicara" dengan pengguna.

- **Meminta Input:**
  ```php
  $name = $this->ask('Siapa namamu?');
  $this->info("Halo, {$name}!");
  ```
- **Meminta Informasi Rahasia:**
  ```php
  $password = $this->secret('Masukkan password API:');
  ```
- **Meminta Konfirmasi:**
  ```php
  if ($this->confirm('Apakah kamu yakin ingin melanjutkan proses ini?')) {
      // Lanjutkan proses...
  }
  ```
- **Memberi Pilihan:**
  ```php
  $framework = $this->choice(
      'Apa framework PHP favoritmu?',
      ['Laravel', 'Symfony', 'Lainnya'],
      0 // Pilihan default
  );
  ```

- **Menampilkan Output:**
  ```php
  $this->line('Sebuah baris teks biasa.');
  $this->info('Pesan informasi (biasanya hijau).');
  $this->comment('Pesan komentar (biasanya kuning).');
  $this->question('Ini adalah pertanyaan.');
  $this->error('Ups, terjadi kesalahan (biasanya merah).');
  $this->warn('Sebuah pesan peringatan.');
  ```

- **Menampilkan Data dalam Tabel:**
  ```php
  $headers = ['Nama', 'Email'];
  $users = App\Models\User::all(['name', 'email'])->toArray();
  $this->table($headers, $users);
  ```

---

## Bagian 4: Jurus Tingkat Lanjut 🚀

### 8. 🔄 Menjalankan Perintah dari Kode Lain

Kamu bisa memanggil perintah Artisan dari dalam Controller, Service, atau bahkan dari perintah lain.

```php
use Illuminate\Support\Facades\Artisan;

// Dari mana saja di aplikasimu
Artisan::call('user:remind');

// Dengan argumen dan opsi
Artisan::call('mail:send', [
    'user' => 1,
    '--queue' => 'default'
]);

// Menjalankannya di background
Artisan::queue('mail:send', ['user' => 1]);

// Dari dalam file command lain
$this->call('mail:send', ['user' => 1]);
```

### 9. 🔒 Perintah yang Tidak Bisa Tumpang Tindih (Isolatable)

Untuk tugas-tugas kritis (misal: memproses pembayaran), kamu pasti tidak mau ada dua proses yang sama berjalan bersamaan. Gunakan `Isolatable`.

```php
use Illuminate\Contracts\Console\Isolatable;

class ProcessPayments extends Command implements Isolatable
{
    protected $signature = 'payment:process';
    // ...
}
```
Dengan ini, Laravel akan memastikan hanya ada satu instans `payment:process` yang berjalan pada satu waktu.

### 10. 📡 Menangani Sinyal (Signal Handling)

Untuk perintah yang berjalan lama (long-running process), kamu bisa "mendengarkan" sinyal dari sistem operasi (misalnya saat pengguna menekan `Ctrl+C`) untuk menghentikan proses dengan aman.

```php
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'server:start')]
class StartServer extends Command
{
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->trap([SIGINT, SIGTERM], function ($signal) {
            $this->info('Proses dihentikan dengan aman...');
            // Lakukan cleanup di sini...
            exit(0);
        });

        // Logika server yang berjalan terus-menerus...
        while (true) {
            // ...
        }
    }
}
```

### 11. 🛠️ Kustomisasi Stub

Saat kamu menjalankan `php artisan make:controller`, Laravel menggunakan sebuah file "template" yang disebut **stub**. Kamu bisa mengubah template ini sesuai seleramu!

**Caranya:**
```bash
php artisan stub:publish
```
Perintah ini akan membuat folder `stubs` di root proyekmu. Sekarang, kamu bisa mengedit file-file di dalamnya. Misalnya, kamu bisa mengubah `stubs/controller.plain.stub` agar setiap controller baru yang kamu buat sudah memiliki method atau komentar default versimu.

---

## Bagian 5: Referensi Cepat & Cheat Sheet 📋

| Kategori | Perintah / Konsep | Contoh |
|---|---|---|
| **Dasar** | Melihat semua perintah | `php artisan list` |
| | Melihat bantuan | `php artisan help <nama-perintah>` |
| | Masuk ke Tinker | `php artisan tinker` |
| **Membuat Perintah** | Generate file command | `php artisan make:command NamaPerintah` |
| | Signature (nama perintah) | `protected $signature = 'kirim:email {user}';` |
| | Deskripsi | `protected $description = 'Deskripsi perintah.';` |
| | Logika Utama | Method `handle()` |
| **Input Argumen** | Wajib | `{user}` |
| | Opsional | `{user?}` |
| | Default | `{user=1}` |
| | Array | `{user*}` |
| **Input Opsi** | Boolean | `{--force}` |
| | Dengan Nilai | `{--queue=}` |
| | Singkatan | `{--Q|queue=}` |
| **Output** | Info | `$this->info('Pesan...');` |
| | Error | `$this->error('Pesan...');` |
| | Tabel | `$this->table($headers, $data);` |
| | Progress Bar | `$this->withProgressBar($collection, fn() => ...);` |
| **Eksekusi** | Dari kode | `Artisan::call('perintah');` |
| | Di background | `Artisan::queue('perintah');` |
| **Fitur Lanjut** | Isolasi Perintah | `implements Isolatable` |
| | Kustomisasi Stub | `php artisan stub:publish` |

---

### 🎯 Kesimpulan

Kamu berhasil! Kamu telah mempelajari cara menggunakan dan membuat "mantra" Artisan sendiri. Ini adalah skill fundamental yang akan membuatmu menjadi developer Laravel yang jauh lebih produktif dan efisien.

Teruslah berlatih, coba buat perintah-perintah custom untuk mengotomatiskan tugas-tugas di proyekmu. Selamat mengayunkan tongkat sihirmu!

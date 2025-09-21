# 🚀 Laravel Artisan Console


## 📑 Table of Contents

1. [⚡ Artisan Console](#-artisan-console)  
2. [🧪 Tinker (REPL)](#-tinker-repl)  
3. [📝 Writing Commands](#-writing-commands)  
4. [🔒 Isolatable Commands](#-isolatable-commands)  
5. [🛠 Defining Input Expectations](#-defining-input-expectations)  
6. [💻 Command I/O](#-command-io)  
7. [🗂 Registering Commands](#-registering-commands)  
8. [🔄 Programmatically Executing Commands](#-programmatically-executing-commands)  
9. [📡 Signal Handling](#-signal-handling)  
10. [🛠 Stub Customization](#-stub-customization)  
11. [🎉 Events](#-events)  



## ⚡ Artisan Console

### 📖 Introduction
Artisan adalah command line interface yang disertakan dengan Laravel. File Artisan berada di root aplikasi Anda dan menyediakan banyak perintah yang membantu saat membangun aplikasi.

🔹 Untuk melihat daftar perintah Artisan:

```bash
php artisan list
````

🔹 Untuk melihat bantuan perintah tertentu:

```bash
php artisan help migrate
```

### 🐳 Laravel Sail

Jika menggunakan Laravel Sail sebagai lingkungan pengembangan lokal, gunakan perintah `sail` untuk memanggil Artisan:

```bash
./vendor/bin/sail artisan list
```



## 🧪 Tinker (REPL)

Laravel Tinker adalah REPL yang kuat untuk Laravel, menggunakan package PsySH.

### 💾 Installation

Tinker sudah termasuk secara default. Jika perlu:

```bash
composer require laravel/tinker
```

### 🏃 Usage

Masuk ke lingkungan Tinker:

```bash
php artisan tinker
```

Publikasikan konfigurasi Tinker:

```bash
php artisan vendor:publish --provider="Laravel\Tinker\TinkerServiceProvider"
```

Tinker menggunakan **command allow list** dan **dont\_alias** untuk mengatur perintah dan class yang bisa digunakan.



## 📝 Writing Commands

### ✨ Generating Commands

Buat command baru:

```bash
php artisan make:command SendEmails
```

### 🏗️ Command Structure

```php
<?php
namespace App\Console\Commands;

use App\Models\User;
use App\Support\DripEmailer;
use Illuminate\Console\Command;

class SendEmails extends Command
{
    protected $signature = 'mail:send {user}';
    protected $description = 'Send a marketing email to a user';

    public function handle(DripEmailer $drip): void
    {
        $drip->send(User::find($this->argument('user')));
    }
}
```

#### ❌ Exit Codes

```php
$this->error('Something went wrong.');
return 1;

// Atau langsung
$this->fail('Something went wrong.');
```

### 🧩 Closure Commands

```php
Artisan::command('mail:send {user}', function (string $user) {
    $this->info("Sending email to: {$user}!");
})->purpose('Send a marketing email to a user');
```



## 🔒 Isolatable Commands

Pastikan hanya satu instance command berjalan:

```php
use Illuminate\Contracts\Console\Isolatable;

class SendEmails extends Command implements Isolatable
{
    // ...
}
```

Custom Lock ID dan expiration:

```php
public function isolatableId(): string
{
    return $this->argument('user');
}

public function isolationLockExpiresAt(): DateTimeInterface|DateInterval
{
    return now()->addMinutes(5);
}
```



## 🛠 Defining Input Expectations

### 📌 Arguments

```php
protected $signature = 'mail:send {user}';
protected $signature = 'mail:send {user?}';
protected $signature = 'mail:send {user=foo}';
```

### ⚙️ Options

```php
protected $signature = 'mail:send {user} {--queue}';
protected $signature = 'mail:send {user} {--queue=}';
protected $signature = 'mail:send {user} {--Q|queue}';
```

### 📚 Arrays

```php
'mail:send {user*}'
'mail:send {user?*}'
'mail:send {--id=*}'
```

### 📝 Input Descriptions

```php
protected $signature = 'mail:send
                        {user : The ID of the user}
                        {--queue : Whether the job should be queued}';
```

### 🤔 Prompting for Missing Input

```php
class SendEmails extends Command implements PromptsForMissingInput
{
    protected $signature = 'mail:send {user}';
}
```

Custom questions:

```php
protected function promptForMissingArgumentsUsing(): array
{
    return [
        'user' => 'Which user ID should receive the mail?',
    ];
}
```



## 💻 Command I/O

### 🔹 Retrieving Input

```php
$userId = $this->argument('user');
$arguments = $this->arguments();
$queueName = $this->option('queue');
$options = $this->options();
```

### 🗣 Prompting for Input

```php
$name = $this->ask('What is your name?', 'Taylor');
$password = $this->secret('What is the password?');
if ($this->confirm('Do you wish to continue?', true)) { /* ... */ }
$name = $this->anticipate('What is your address?', ['Option1','Option2']);
$name = $this->choice('What is your name?', ['Taylor', 'Dayle'], $defaultIndex);
```

### 📣 Writing Output

```php
$this->info('Success!');
$this->error('Error!');
$this->line('Plain text');
$this->newLine(3);
$this->table(['Name','Email'], User::all(['name','email'])->toArray());
$users = $this->withProgressBar(User::all(), fn($user) => $this->performTask($user));
```



## 🗂 Registering Commands

```php
->withCommands([
    __DIR__.'/../app/Domain/Orders/Commands',
    SendEmails::class,
])
```



## 🔄 Programmatically Executing Commands

```php
$exitCode = Artisan::call('mail:send', ['user'=>$user,'--queue'=>'default']);
Artisan::call('mail:send 1 --queue=default');
Artisan::queue('mail:send', ['user'=>1,'--queue'=>'default'])->onConnection('redis')->onQueue('commands');
$this->call('mail:send', ['user'=>1,'--queue'=>'default']);
$this->callSilently('mail:send', ['user'=>1,'--queue'=>'default']);
```



## 📡 Signal Handling

```php
$this->trap(SIGTERM, fn()=> $this->shouldKeepRunning = false);
$this->trap([SIGTERM, SIGQUIT], function(int $signal){ $this->shouldKeepRunning=false; dump($signal); });
```



## 🛠 Stub Customization

```bash
php artisan stub:publish
```

📂 Stubs akan berada di folder `stubs` pada root aplikasi.



## 🎉 Events

Artisan memicu tiga event saat menjalankan perintah:

* `ArtisanStarting`
* `CommandStarting`
* `CommandFinished`

```
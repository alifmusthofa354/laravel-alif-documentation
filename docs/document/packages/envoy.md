# 🚀 Laravel Envoy

Laravel Envoy menyediakan sintaks yang bersih dan minimal untuk mendefinisikan tugas umum yang Anda jalankan di server jarak jauh Anda. Menggunakan sintaks ala Blade, Anda dapat dengan mudah menyiapkan tugas untuk deployment, perintah Artisan, dan lainnya. Saat ini, Envoy hanya mendukung sistem operasi Mac dan Linux.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Menulis Task](#menulis-task)
4. [Multiple Server](#multiple-server)
5. [Setup & Teardown](#setup--teardown)
6. [Variabel](#variabel)
7. [Story](#story)
8. [Notifikasi](#notifikasi)
9. [Update Envoy](#update-envoy)

## 🎯 Pendahuluan

Laravel Envoy adalah alat untuk menjalankan tugas umum di server jarak jauh. Dengan menggunakan sintaks Blade yang sederhana, Anda dapat dengan mudah mendefinisikan tugas untuk deployment, backup database, perintah Artisan, dan banyak lagi.

### ✨ Fitur Utama
- Sintaks Blade yang sederhana
- Dukungan untuk multiple server
- Setup dan teardown hooks
- Notifikasi Slack dan Discord
- Story untuk mengelompokkan tugas
- Variabel dinamis

## 📦 Instalasi

### 🎯 Menginstal Envoy
Envoy dikirim sebagai package Composer. Pertama, instal Envoy menggunakan Composer:

```bash
composer require laravel/envoy --dev
```

Setelah menginstal Envoy, file executable `envoy` akan tersedia dalam direktori `vendor/bin` Anda:

```bash
php vendor/bin/envoy
```

### 🔄 Menginstal Global
Untuk menginstal Envoy secara global, Anda dapat menggunakan opsi `-g` dari Composer:

```bash
composer global require laravel/envoy
```

## ✍️ Menulis Task

### 📄 File Envoy.blade.php
Semua task Envoy Anda harus didefinisikan dalam file `Envoy.blade.php` di root proyek Anda. Berikut adalah contoh sederhana:

```blade
@servers(['web' => ['user@192.168.1.1']])

@task('foo')
    ls -la
@endtask
```

### ▶️ Menjalankan Task
Untuk menjalankan task, gunakan perintah `run` dari CLI Envoy:

```bash
php vendor/bin/envoy run foo
```

### 🖥️ Menjalankan Task di Local
Untuk menjalankan task di mesin lokal Anda, tentukan server IP address sebagai `127.0.0.1`:

```blade
@servers(['localhost' => '127.0.0.1'])
```

### 📝 Tugas dengan Multiple Perintah
```blade
@task('deploy')
    cd /home/user/app
    git pull origin main
    composer install --no-dev
    php artisan migrate --force
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
@endtask
```

## 🖥️ Multiple Server

### 📋 Mendefinisikan Multiple Server
```blade
@servers([
    'web-1' => 'user@192.168.1.1',
    'web-2' => 'user@192.168.1.2',
    'web-3' => 'user@192.168.1.3',
])
```

### ▶️ Menjalankan di Multiple Server
```blade
@task('deploy', ['on' => ['web-1', 'web-2', 'web-3']])
    cd /home/user/app
    php artisan down
    git pull origin main
    composer install --no-dev
    php artisan migrate --force
    php artisan up
@endtask
```

### 🎯 Menjalankan di Server Tertentu
```bash
php vendor/bin/envoy run deploy --on=web-1,web-3
```

### 🔄 Parallel Execution
Untuk menjalankan task secara paralel di semua server:

```blade
@task('deploy', ['on' => ['web-1', 'web-2'], 'parallel' => true])
    cd /home/user/app
    php artisan cache:clear
@endtask
```

## ⚙️ Setup & Teardown

### 🚀 Setup Hook
Setup hook dijalankan sebelum task utama:

```blade
@servers(['web' => '192.168.1.1'])

@setup
    $now = new DateTime();
    $environment = isset($env) ? $env : "testing";
@endsetup

@task('deploy')
    cd /home/user/app
    php artisan down
    git pull origin {{ $branch }}
    php artisan up
@endtask
```

### 🛑 Teardown Hook
Teardown hook dijalankan setelah task utama:

```blade
@teardown
    echo "Deployment completed at {{ $now->format('Y-m-d H:i:s') }}";
@endteardown
```

### 🔁 Importing PHP Files
Anda juga dapat mengimpor file PHP eksternal menggunakan `@include`:

```blade
@include('vendor/autoload.php')
```

## 📦 Variabel

### 📝 Mendefinisikan Variabel
```blade
@servers(['web' => '192.168.1.1'])

@setup
    $repo = "git@github.com:user/app.git";
    $release_dir = "/home/user/app/releases";
    $app_dir = "/home/user/app";
    $current_dir = "/home/user/app/current";
    $new_release_dir = $release_dir . '/' . date('YmdHis');
@endsetup
```

### ▶️ Menggunakan Variabel dalam Task
```blade
@task('deploy')
    [ -d {{ $release_dir }} ] || mkdir {{ $release_dir }}
    cd {{ $release_dir }}
    
    # Clone repository
    git clone {{ $repo }} {{ $new_release_dir }}
    cd {{ $new_release_dir }}
    
    # Install dependencies
    composer install --no-dev --prefer-dist --optimize-autoloader
    
    # Create symlink
    ln -nfs {{ $new_release_dir }} {{ $current_dir }}
    cd {{ $app_dir }}
    php artisan config:cache
@endtask
```

### 🎯 Passing Variables
Anda dapat mengirim variabel ke task melalui command line:

```bash
php vendor/bin/envoy run deploy --branch=main
```

```blade
@setup
    $branch = isset($branch) ? $branch : "main";
@endsetup

@task('deploy')
    git pull origin {{ $branch }}
@endtask
```

## 📖 Story

### 📚 Mendefinisikan Story
Story memungkinkan Anda untuk mengelompokkan tugas-tugas kecil menjadi tugas yang lebih besar:

```blade
@servers(['web' => '192.168.1.1'])

@story('deploy')
    git
    composer
    artisan
@endstory

@task('git')
    git pull origin main
@endtask

@task('composer')
    composer install --no-dev
@endtask

@task('artisan')
    php artisan migrate --force
    php artisan config:cache
@endtask
```

### ▶️ Menjalankan Story
```bash
php vendor/bin/envoy run deploy
```

## 📢 Notifikasi

### 🔗 Slack Notifications
Envoy mendukung pengiriman notifikasi Slack setelah task selesai:

```blade
@finished
    @slack('webhook-url', '#channel', 'Deployment completed!')
@endfinished
```

### 🎯 Discord Notifications
```blade
@finished
    @discord('webhook-url', 'Deployment completed!')
@endfinished
```

### 📧 Email Notifications
```blade
@finished
    @telegram('bot-token', 'chat-id', 'Deployment completed!')
@endfinished
```

### 📋 Custom Notifications
```blade
@finished
    if (isset($task)) {
        echo "Task {$task} completed successfully.\n";
    }
@endfinished
```

## 🔄 Update Envoy

### 🔧 Memperbarui Envoy
Untuk memperbarui Envoy ke versi terbaru:

```bash
composer update laravel/envoy
```

### 📄 Memeriksa Versi
```bash
php vendor/bin/envoy --version
```

## 🧠 Kesimpulan

Laravel Envoy menyediakan cara yang sederhana namun kuat untuk mengelola dan menjalankan tugas di server jarak jauh. Dengan sintaks Blade yang familiar, Anda dapat dengan mudah mendefinisikan tugas kompleks untuk deployment, maintenance, dan operasi server lainnya.

### 🔑 Keuntungan Utama
- Sintaks Blade yang sederhana dan familiar
- Dukungan untuk multiple server
- Setup dan teardown hooks
- Notifikasi otomatis
- Story untuk mengelompokkan tugas
- Eksekusi paralel
- Integrasi dengan sistem notifikasi populer

### 🚀 Best Practices
1. Gunakan setup hook untuk inisialisasi variabel
2. Gunakan teardown hook untuk cleanup dan logging
3. Kelompokkan tugas terkait dalam story
4. Gunakan notifikasi untuk monitoring
5. Simpan file Envoy.blade.php dalam version control
6. Gunakan variabel untuk konfigurasi dinamis
7. Gunakan eksekusi paralel untuk operasi yang tidak saling bergantung

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Envoy untuk mengelola dan menjalankan tugas di server jarak jauh Anda dengan efisien.
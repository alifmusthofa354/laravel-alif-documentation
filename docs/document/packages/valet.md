# 🌐 Laravel Valet

Laravel Valet adalah environment pengembangan Laravel untuk Mac minimalis. Valet menyediakan lingkungan pengembangan PHP yang sangat cepat dengan menggunakan RAM drive untuk melayani situs Anda melalui Nginx proxy.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Menggunakan Valet](#menggunakan-valet)
4. [Domain dan Path](#domain-dan-path)
5. [Custom Valet Drivers](#custom-valet-drivers)
6. [Site Sharing](#site-sharing)
7. [Mail Sending](#mail-sending)
8. [Valet Database](#valet-database)
9. [PHP Versions](#php-versions)
10. [Valet Extensions](#valet-extensions)
11. [Troubleshooting](#troubleshooting)

## 🎯 Pendahulahan

Laravel Valet adalah environment pengembangan Laravel untuk Mac minimalis. Valet menyediakan lingkungan pengembangan PHP yang sangat cepat dengan menggunakan RAM drive untuk melayani situs Anda melalui Nginx proxy.

### ✨ Fitur Utama
- Lingkungan pengembangan yang sangat cepat
- Konsumsi resource sistem yang minimal
- Site sharing dengan internet publik
- Support untuk berbagai framework PHP
- Custom domain dan path
- PHP version management
- Mail sending testing
- Database management
- Valet extensions

### ⚠️ Catatan Penting
Valet dirancang untuk Mac dan tidak tersedia untuk Windows atau Linux. Untuk pengguna Windows, pertimbangkan untuk menggunakan Laravel Sail atau Homestead.

## 📦 Instalasi

### 🎯 Prasyarat
Sebelum menginstal Valet, Anda perlu menginstal:
- Homebrew (package manager untuk Mac)
- PHP (melalui Homebrew)
- Composer

### 🛠️ Menginstal Homebrew
Jika Anda belum memiliki Homebrew:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 🔧 Menginstal PHP
Instal PHP melalui Homebrew:

```bash
brew install php
```

### 🎯 Menginstal Composer
Instal Composer melalui Homebrew:

```bash
brew install composer
```

### 🚀 Menginstal Valet
Setelah menginstal prasyarat, Anda dapat menginstal Valet menggunakan Composer:

```bash
composer global require laravel/valet
```

Pastikan direktori `~/.composer/vendor/bin` ada dalam PATH Anda:

```bash
echo 'export PATH="$PATH:$HOME/.composer/vendor/bin"' >> ~/.zshrc
source ~/.zshrc
```

### 🔧 Menginstal Valet Services
Instal Valet services dengan menjalankan perintah `valet install`:

```bash
valet install
```

Perintah ini akan mengkonfigurasi dan menginstal Valet daemon yang diperlukan untuk melayani situs Anda.

### 🔐 Menginstal Certificate Authority
Valet secara otomatis menginstal certificate authority untuk melayani situs melalui HTTPS:

```bash
valet secure
```

## ▶️ Menggunakan Valet

### 📋 Park Directory
Untuk melayani situs dari direktori tertentu, gunakan perintah `park`:

```bash
cd ~/Sites
valet park
```

Sekarang situs apa pun dalam direktori `~/Sites` akan secara otomatis tersedia di `http://namasitus.test`.

### 📋 Link Individual Sites
Untuk melayani situs individu, gunakan perintah `link`:

```bash
cd ~/Sites/my-site
valet link my-site
```

Sekarang situs akan tersedia di `http://my-site.test`.

### 📋 Unlink Sites
Untuk menghapus link situs:

```bash
valet unlink my-site
```

### 📋 List Linked Sites
Untuk melihat daftar situs yang di-link:

```bash
valet links
```

### 📋 Secure Sites
Untuk melayani situs melalui HTTPS:

```bash
valet secure my-site
```

Sekarang situs akan tersedia di `https://my-site.test`.

### 📋 Unsecure Sites
Untuk menghapus HTTPS dari situs:

```bash
valet unsecure my-site
```

### 📋 List Secured Sites
Untuk melihat daftar situs yang diamankan:

```bash
valet secured
```

## 🌐 Domain dan Path

### 📋 Mengubah Domain TLD
Untuk mengubah domain TLD default dari `.test`:

```bash
valet domain app
```

Sekarang situs akan tersedia di `http://mysite.app`.

### 📋 Mengembalikan Domain TLD ke Default
```bash
valet domain test
```

### 📋 Menambahkan Path Tambahan
Untuk menambahkan path tambahan untuk melayani situs:

```bash
valet park ~/Projects
valet park ~/Work
```

### 📋 Menghapus Parked Path
```bash
valet forget ~/Projects
```

### 📋 List Parked Paths
```bash
valet paths
```

### 📋 Menggunakan Subdomain
Valet secara otomatis mendukung subdomain:

```bash
# Untuk situs di ~/Sites/my-site
# Akses di http://my-site.test
# Subdomain di http://admin.my-site.test
```

### 📋 Menggunakan Domain Kustom
```bash
valet domain company.test
# Situs akan tersedia di http://mysite.company.test
```

## 🛠️ Custom Valet Drivers

### 📋 Membuat Driver Kustom
Untuk framework atau CMS kustom, Anda dapat membuat driver Valet kustom:

```bash
valet driver MyCustomFramework
```

### 📋 Struktur Driver Dasar
```php
<?php

class MyCustomFramework extends ValetDriver
{
    /**
     * Determine if the driver serves the request.
     */
    public function serves($sitePath, $siteName, $uri): bool
    {
        return is_dir($sitePath.'/custom-framework');
    }

    /**
     * Determine if the incoming request is for a static file.
     */
    public function isStaticFile($sitePath, $siteName, $uri): string|false
    {
        if (file_exists($staticFilePath = $sitePath.'/public/'.$uri)) {
            return $staticFilePath;
        }

        return false;
    }

    /**
     * Get the fully resolved path to the application's front controller.
     */
    public function frontControllerPath($sitePath, $siteName, $uri): string
    {
        return $sitePath.'/public/index.php';
    }
}
```

### 📋 Mendaftarkan Driver Kustom
Tempatkan driver kustom dalam direktori `~/.config/valet/Drivers`:

```bash
mkdir -p ~/.config/valet/Drivers
```

### 📋 Driver yang Tersedia
Valet menyertakan driver untuk framework berikut:
- Laravel
- Lumen
- Symfony
- Zend
- CakePHP
- WordPress
- Drupal
- Statamic
- Craft
- Jigsaw
- OctoberCMS
- Magento
- Typo3

### 📋 Menguji Driver
```bash
valet diagnose
```

## 🔗 Site Sharing

### 📋 Menggunakan Expose
Untuk membagikan situs Anda dengan internet publik:

```bash
valet share
```

Perintah ini akan menghasilkan URL publik yang dapat digunakan oleh siapa saja untuk mengakses situs Anda.

### 📋 Menggunakan Ngrok
Valet menggunakan Expose secara default, tetapi Anda juga dapat menggunakan Ngrok:

```bash
valet share --ngrok
```

### 📋 Mengatur Subdomain Kustom
```bash
valet share --subdomain=my-custom-subdomain
```

### 📋 Mengatur Region
```bash
valet share --region=eu
```

### 📋 Mengatur Port
```bash
valet share --port=8080
```

### 📋 Menghentikan Sharing
```bash
valet stop-sharing
```

## 📧 Mail Sending

### 📋 MailHog
Valet menyertakan MailHog untuk pengujian pengiriman email:

```bash
valet mailhog
```

MailHog akan tersedia di `http://127.0.0.1:8025`.

### 📋 Mengkonfigurasi Mail dalam Laravel
Untuk menggunakan MailHog dalam aplikasi Laravel:

```env
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
```

### 📋 Menghentikan MailHog
```bash
valet mailhog:stop
```

### 📋 Memulai MailHog
```bash
valet mailhog:start
```

### 📋 Mengatur MailHog Port
```bash
valet mailhog --port=1026
```

## 🗃️ Valet Database

### 📋 MySQL
Valet menyertakan MySQL untuk pengelolaan database:

```bash
valet mysql
```

### 📋 Membuat Database
```bash
valet db create my_database
```

### 📋 Menghapus Database
```bash
valet db drop my_database
```

### 📋 Mendaftar Database
```bash
valet db list
```

### 📋 Mengimpor Database
```bash
valet db import my_database < database.sql
```

### 📋 Mengekspor Database
```bash
valet db export my_database > database.sql
```

### 📋 Mengatur MySQL Port
```bash
valet mysql --port=3307
```

### 📋 Menghentikan MySQL
```bash
valet mysql:stop
```

### 📋 Memulai MySQL
```bash
valet mysql:start
```

## 🐘 PHP Versions

### 📋 Menginstal PHP Version Tambahan
```bash
brew install php@8.1
brew install php@8.2
```

### 📋 Mengganti PHP Version
```bash
valet use php@8.1
```

### 📋 Melihat PHP Version Saat Ini
```bash
valet php
```

### 📋 Menginstal PHP Extensions
```bash
brew install php@8.1-xdebug
brew install php@8.1-imagick
```

### 📋 Mengelola PHP Services
```bash
valet php:start
valet php:stop
valet php:restart
```

### 📋 Menggunakan PHP Version Tertentu untuk Situs
```bash
valet use php@8.1 --force
```

## 📦 Valet Extensions

### 📋 Instalasi Extensions
Valet menyertakan beberapa extensions bawaan:

```bash
valet extensions
```

### 📋 Menginstal Extension
```bash
valet extension install my-extension
```

### 📋 Menghapus Extension
```bash
valet extension remove my-extension
```

### 📋 Extension yang Tersedia
- Database management
- Mail testing
- PHP version management
- Site sharing
- SSL certificates
- Custom drivers
- Performance monitoring

### 📋 Membuat Extension Kustom
```bash
valet extension create my-custom-extension
```

### 📋 Mengelola Extensions
```bash
valet extension list
valet extension update
valet extension status
```

## 🔧 Troubleshooting

### 📋 Masalah Umum

#### 🔄 Valet tidak merespons
```bash
valet restart
```

#### 🔌 Port conflict
```bash
valet uninstall
valet install
```

#### 📁 Permissions issues
```bash
sudo valet fix
```

#### 🐘 PHP issues
```bash
valet php:restart
```

#### 🌐 DNS issues
```bash
valet dns
```

### 📋 Diagnosa

#### 📋 Menjalankan Diagnosa
```bash
valet diagnose
```

#### 📋 Melihat Log
```bash
valet log
```

#### 📋 Memeriksa Status
```bash
valet status
```

#### 📋 Memeriksa Konfigurasi
```bash
valet config
```

### 📋 Debugging

#### 📋 Mode Debug
```bash
valet --verbose
valet --debug
```

#### 📋 Testing Connectivity
```bash
ping my-site.test
```

#### 📋 Testing DNS Resolution
```bash
dig my-site.test
```

#### 📋 Testing HTTP Response
```bash
curl -I http://my-site.test
```

### 📋 Reinstalling

#### 📋 Uninstall Valet
```bash
valet uninstall
```

#### 📋 Reinstall Valet
```bash
valet install
```

#### 📋 Force Reinstall
```bash
valet install --force
```

### 📋 Updating

#### 📋 Update Valet
```bash
composer global update laravel/valet
```

#### 📋 Update Dependencies
```bash
brew update
brew upgrade
```

#### 📋 Update All
```bash
valet update
```

### 📋 Certificate Issues

#### 📋 Renew Certificates
```bash
valet renew
```

#### 📋 Trust Certificate Authority
```bash
valet trust
```

#### 📋 Reset Certificate Authority
```bash
valet untrust
valet trust
```

## 🚀 Advanced Configuration

### 📋 Custom Nginx Configuration
Untuk konfigurasi Nginx kustom:

```bash
valet nginx
```

### 📋 Custom Hosts File
```bash
valet hosts
```

### 📋 Custom Proxy Configuration
```bash
valet proxy my-app http://127.0.0.1:8000
```

### 📋 Custom SSL Certificates
```bash
valet certificate my-site.test
```

### 📋 Custom DNS Configuration
```bash
valet dns 8.8.8.8
```

## 🧠 Kesimpulan

Laravel Valet menyediakan lingkungan pengembangan yang cepat dan minimalis untuk pengembangan aplikasi web di Mac. Dengan konsumsi resource sistem yang minimal dan setup yang mudah, Valet memungkinkan Anda memfokuskan waktu pada pengembangan daripada konfigurasi server.

### 🔑 Keuntungan Utama
- Lingkungan pengembangan yang sangat cepat
- Konsumsi resource sistem yang minimal
- Setup yang mudah dan cepat
- Site sharing dengan internet publik
- Support untuk berbagai framework PHP
- PHP version management
- Mail testing dengan MailHog
- Database management
- SSL certificate management
- Custom drivers support

### 🚀 Best Practices
1. Gunakan Valet hanya untuk pengembangan lokal
2. Jangan aktifkan Valet dalam produksi
3. Gunakan site sharing untuk demo dan testing
4. Gunakan MailHog untuk testing pengiriman email
5. Gunakan PHP version management yang sesuai
6. Gunakan database management untuk pengembangan
7. Gunakan SSL certificates untuk testing HTTPS
8. Gunakan custom drivers untuk framework kustom
9. Gunakan extensions untuk fungsionalitas tambahan
10. Gunakan troubleshooting tools untuk debugging

### ⚠️ Production Considerations
1. Jangan gunakan Valet dalam lingkungan produksi
2. Gunakan server web yang sesuai untuk produksi (Nginx/Apache)
3. Gunakan database produksi yang sesuai (MySQL/PostgreSQL)
4. Gunakan SSL certificate yang valid untuk produksi
5. Gunakan mail server produksi
6. Gunakan caching dan opsi performa produksi
7. Gunakan monitoring dan logging produksi
8. Gunakan backup dan disaster recovery
9. Gunakan security best practices
10. Gunakan deployment pipeline yang sesuai

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Valet untuk lingkungan pengembangan web di Mac Anda.
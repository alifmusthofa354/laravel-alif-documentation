# 🧰 Ekstensi VS Code untuk Pengembangan Laravel

> **Catatan:** Panduan ini berisi rekomendasi ekstensi VS Code yang akan meningkatkan produktivitas Anda dalam pengembangan aplikasi Laravel.

---

## 📖 Pengantar

Visual Studio Code adalah code editor yang sangat populer di kalangan developer PHP dan Laravel. Salah satu kekuatan VS Code adalah ekosistem ekstensinya yang kaya, yang dapat secara signifikan meningkatkan pengalaman pengembangan Anda.

Dengan ekstensi yang tepat, Anda bisa:
- Mendapatkan autocompletion yang lebih baik
- Melakukan debugging dengan mudah
- Memformat kode secara otomatis
- Mengintegrasikan command Laravel langsung dari editor

---

## 🎯 Ekstensi Wajib untuk Laravel

Berikut adalah daftar ekstensi VS Code yang sangat direkomendasikan untuk pengembangan Laravel:

### 1. 🐘 PHP Intelephense

**ID:** `bmewburn.vscode-intelephense-client`

Ekstensi ini menyediakan:
- Autocompletion yang canggih untuk PHP
- Navigasi kode yang baik
- Refactoring tools
- Error detection

```json
{
  "intelephense.environment.phpVersion": "8.1",
  "intelephense.files.exclude": [
    "**/.git/**",
    "**/node_modules/**",
    "**/vendor/**"
  ]
}
```

### 2. 🔷 Laravel Blade Snippets

**ID:** `onecentlin.laravel-blade`

Ekstensi ini menyediakan:
- Syntax highlighting untuk Blade templates
- Snippets untuk directive Blade
- Code completion untuk Blade

Fitur utama:
- Syntax highlighting yang akurat
- Snippets untuk `@if`, `@foreach`, `@extends`, dll
- Completion untuk helper Laravel

### 3. 🧠 Laravel Extra Intellisense

**ID:** `amiralizadeh9480.laravel-extra-intellisense`

Ekstensi ini menyediakan:
- Autocompletion untuk route names
- Autocompletion untuk view names
- Autocompletion untuk config keys
- Navigation ke route definitions

### 4. 🌐 Laravel goto view

**ID:** `codingyu.laravel-goto-view`

Ekstensi ini memungkinkan:
- Navigasi cepat ke view Blade dari controller
- Alt + klik untuk membuka view
- Pencarian view yang lebih efisien

### 5. ⚙️ DotENV

**ID:** `mikestead.dotenv`

Ekstensi ini menyediakan:
- Syntax highlighting untuk file `.env`
- Autocompletion untuk environment variables
- Validation untuk format `.env`

---

## 🎯 Ekstensi Tambahan yang Berguna

### 6. 🐛 PHP Debug

**ID:** `xdebug.php-debug`

Untuk debugging aplikasi Laravel:
- Integrasi dengan Xdebug
- Breakpoint debugging
- Variable inspection
- Call stack navigation

Konfigurasi `launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Listen for Xdebug",
      "type": "php",
      "request": "launch",
      "port": 9003
    }
  ]
}
```

### 7. 📏 PHP CS Fixer

**ID:** `junstyle.php-cs-fixer`

Untuk memformat kode PHP sesuai standar:
- Otomatis memperbaiki kode
- Integrasi dengan PHP CS Fixer
- Format on save

Konfigurasi:
```json
{
  "php-cs-fixer.executablePath": "${extensionPath}/php-cs-fixer.phar",
  "php-cs-fixer.rules": "@PSR12",
  "editor.formatOnSave": true
}
```

### 8. 🧪 Test Explorer UI + PHPUnit

**ID:** 
- `hbenl.vscode-test-explorer`
- `recca0120.vscode-phpunit`

Untuk testing Laravel:
- UI untuk menjalankan test
- Integrasi dengan PHPUnit
- Coverage report

### 9. 📁 Laravel Artisan

**ID:** `ryannaddy.laravel-artisan`

Menyediakan:
- Command palette untuk Artisan
- Shortcut untuk perintah Artisan umum
- Integrasi langsung dengan terminal

### 10. 🗃️ Database Client

**ID:** `cweijan.vscode-database-client2`

Untuk manajemen database:
- Koneksi ke MySQL, PostgreSQL, SQLite
- Query editor
- Data viewer
- Export/import data

---

## ⚙️ Konfigurasi Rekomended Settings

Tambahkan konfigurasi berikut ke `settings.json` Anda:

```json
{
  "files.associations": {
    "*.php": "php"
  },
  "emmet.includeLanguages": {
    "blade": "html"
  },
  "blade.format.enable": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "php.suggest.basic": false,
  "intelephense.environment.phpVersion": "8.1"
}
```

---

## 🛠️ Snippets Berguna

### PHP Snippets
```php
// Model factory
factory(App\Models\User::class, 10)->create();

// Database seeder
php artisan make:seeder UsersTableSeeder

// Controller resource
php artisan make:controller PostController --resource
```

### Blade Snippets
```blade
// Extends layout
@extends('layouts.app')

// Foreach loop
@forelse($items as $item)
    {{ $item }}
@empty
    <p>No items found.</p>
@endforelse

// CSRF field
@csrf

// Validation errors
@error('title')
    <div class="alert alert-danger">{{ $message }}</div>
@enderror
```

---

## 🔧 Integrasi Terminal

### Command Artisan Berguna

Anda bisa menjalankan command Artisan langsung dari terminal VS Code:

```bash
# Membuat controller
php artisan make:controller UserController

# Membuat model
php artisan make:model Post

# Membuat migration
php artisan make:migration create_posts_table

# Menjalankan migrasi
php artisan migrate

# Menjalankan server
php artisan serve

# Membuat seeder
php artisan make:seeder UsersTableSeeder

# Menjalankan seeder
php artisan db:seed
```

---

## 🎨 Tema dan Icon Theme

### Tema yang Direkomendasikan

1. **One Dark Pro** - Tema gelap yang populer
2. **Material Theme** - Tema berdasarkan Material Design
3. **Dracula** - Tema gelap dengan warna cerah

### Icon Theme

1. **Material Icon Theme** - Icon yang cantik dan informatif
2. **VSCode Great Icons** - Icon yang detail

---

## 🧪 Debugging Laravel di VS Code

### Konfigurasi Xdebug

1. Install Xdebug di sistem Anda
2. Tambahkan ke `php.ini`:
```ini
zend_extension=xdebug
xdebug.mode=debug
xdebug.start_with_request=yes
xdebug.client_port=9003
```

3. Konfigurasi `launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Listen for Xdebug",
      "type": "php",
      "request": "launch",
      "port": 9003
    }
  ]
}
```

### Cara Debugging

1. Set breakpoint di kode Anda
2. Tekan F5 untuk mulai debugging
3. Akses aplikasi di browser
4. Eksekusi akan berhenti di breakpoint
5. Inspect variable dan call stack

---

## 🎉 Kesimpulan

Dengan ekstensi yang tepat, VS Code bisa menjadi IDE yang sangat powerful untuk pengembangan Laravel. Ekstensi-ekstensi yang telah disebutkan akan:

### 📝 Manfaat Utama:
1. **Meningkatkan Produktivitas** - Autocompletion dan snippets
2. **Mengurangi Error** - Syntax highlighting dan error detection
3. **Mempermudah Debugging** - Integrasi Xdebug
4. **Meningkatkan Kualitas Kode** - Code formatting dan standards
5. **Mempercepat Development** - Navigasi cepat dan command integration

### 🚀 Tips Penggunaan:
- Mulai dengan ekstensi wajib dulu
- Tambahkan ekstensi tambahan sesuai kebutuhan
- Sesuaikan konfigurasi dengan workflow Anda
- Gunakan snippets untuk operasi yang sering dilakukan

Dengan setup yang benar, Anda akan menemukan bahwa pengembangan aplikasi Laravel di VS Code bisa menjadi pengalaman yang sangat menyenangkan dan efisien!
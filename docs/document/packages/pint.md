# 🎨 Laravel Pint

Laravel Pint adalah formatter kode PHP yang indah dan sangat cepat yang dibangun di atas PHP-CS-Fixer. Pint secara otomatis memperbaiki masalah gaya kode dan menjaga konsistensi kode dalam proyek Laravel Anda.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Menggunakan Pint](#menggunakan-pint)
4. [Konfigurasi](#konfigurasi)
5. [Presets](#presets)
6. [Rule Sets](#rule-sets)
7. [Integrasi CI/CD](#integrasi-ci/cd)
8. [Integrasi Editor](#integrasi-editor)
9. [Penggunaan Lanjutan](#penggunaan-lanjutan)
10. [Custom Rules](#custom-rules)
11. [Performance](#performance)
12. [Troubleshooting](#troubleshooting)

## 🎯 Pendahulahan

Laravel Pint adalah formatter kode PHP yang indah dan sangat cepat yang dibangun di atas PHP-CS-Fixer. Pint dirancang untuk bekerja dengan konfigurasi default yang sesuai dengan gaya kode Laravel, menjadikannya tool yang sempurna untuk proyek Laravel.

### ✨ Fitur Utama
- Formatting kode PHP yang indah
- Kecepatan ekstrem
- Konfigurasi default yang sesuai dengan gaya Laravel
- Preset yang dapat dikustomisasi
- Integrasi CI/CD yang mudah
- Integrasi editor yang luas
- Rule sets yang fleksibel
- Caching untuk performa optimal

### ⚠️ Catatan Penting
Pint hanya bertujuan untuk memperbaiki masalah gaya kode, bukan untuk mengidentifikasi potensi bug atau masalah keamanan dalam kode Anda.

## 📦 Instalasi

### 🎯 Menginstal Pint secara Global
Untuk menginstal Pint secara global, Anda dapat menggunakan Composer:

```bash
composer global require laravel/pint
```

Setelah menginstal secara global, pastikan direktori `~/.composer/vendor/bin` ada dalam PATH Anda.

### 🛠️ Menginstal Pint secara Lokal
Untuk menginstal Pint secara lokal dalam proyek Anda, jalankan:

```bash
composer require laravel/pint --dev
```

### 🔧 Menginstal sebagai PHAR
Anda juga dapat mengunduh file PHAR Pint secara langsung:

```bash
curl -OL https://github.com/laravel/pint/releases/latest/download/pint.phar
chmod +x pint.phar
./pint.phar --version
```

## ▶️ Menggunakan Pint

### 🚀 Menjalankan Pint
Untuk memformat semua file PHP dalam proyek Anda, jalankan perintah berikut:

```bash
# Jika diinstal secara global
pint

# Jika diinstal secara lokal
./vendor/bin/pint

# Jika menggunakan PHAR
php pint.phar
```

### 📋 Menjalankan Pint pada File atau Direktori Spesifik
Anda dapat memformat file atau direktori tertentu:

```bash
# Memformat file tertentu
pint app/Models/User.php

# Memformat direktori tertentu
pint app/Http/Controllers

# Memformat beberapa file
pint app/Models/User.php app/Http/Controllers/HomeController.php
```

### 📋 Menjalankan Pint dalam Mode Dry Run
Untuk melihat perubahan yang akan dibuat tanpa benar-benar memformat file:

```bash
pint --dry-run
```

### 📋 Menjalankan Pint dengan Output Verbose
Untuk melihat informasi tambahan tentang proses formatting:

```bash
pint --verbose
```

### 📋 Menjalankan Pint dengan Statistik
Untuk melihat statistik tentang proses formatting:

```bash
pint --statistics
```

## ⚙️ Konfigurasi

### 📄 File Konfigurasi
Pint akan secara otomatis mencari file `pint.json` dalam direktori root proyek Anda. File ini memungkinkan Anda mengkustomisasi perilaku Pint.

### 📋 Konfigurasi Dasar
File konfigurasi `pint.json` paling dasar terlihat seperti ini:

```json
{
    "preset": "laravel"
}
```

### 📋 Konfigurasi Lanjutan
```json
{
    "preset": "laravel",
    "rules": {
        "concat_space": {
            "spacing": "one"
        },
        "ordered_imports": {
            "sort_algorithm": "alpha"
        }
    },
    "exclude": [
        "tests/fixtures"
    ],
    "notName": [
        "*-fix.php"
    ]
}
```

### 📋 Konfigurasi dengan Preset Kustom
```json
{
    "preset": "psr12",
    "rules": {
        "align_multiline_comment": true,
        "array_indentation": true,
        "array_syntax": {
            "syntax": "short"
        }
    }
}
```

## 🎨 Presets

### 📋 Preset yang Tersedia
Pint menyertakan beberapa preset bawaan:

#### 🎯 Laravel Preset
```json
{
    "preset": "laravel"
}
```

#### 📋 PSR-12 Preset
```json
{
    "preset": "psr12"
}
```

#### 📋 Symfony Preset
```json
{
    "preset": "symfony"
}
```

#### 📋 Recommended Preset
```json
{
    "preset": "recommended"
}
```

### 📋 Mengkustomisasi Preset
Anda dapat mengganti atau menambahkan rule ke preset yang ada:

```json
{
    "preset": "laravel",
    "rules": {
        "concat_space": false,
        "new_with_braces": {
            "anonymous_class": false,
            "named_class": false
        }
    }
}
```

## 📐 Rule Sets

### 📋 Menggunakan Rule Sets
Pint mendukung berbagai rule sets:

```json
{
    "preset": "laravel",
    "rules": {
        "@DoctrineAnnotation": true,
        "@PHP74Migration": true,
        "@PHP80Migration": true,
        "@PHP81Migration": true,
        "@PHP82Migration": true
    }
}
```

### 📋 Rule Sets yang Tersedia
- `@DoctrineAnnotation`
- `@PHP70Migration`
- `@PHP71Migration`
- `@PHP73Migration`
- `@PHP74Migration`
- `@PHP80Migration`
- `@PHP81Migration`
- `@PHP82Migration`
- `@PHPUnit84Migration:risky`
- `@PHPUnit100Migration:risky`

### 📋 Mengkombinasikan Rule Sets
```json
{
    "preset": "laravel",
    "rules": {
        "@PHP80Migration": true,
        "@PHPUnit84Migration:risky": true,
        "declare_strict_types": true
    }
}
```

## 🔄 Integrasi CI/CD

### 📋 GitHub Actions
Anda dapat mengintegrasikan Pint dalam pipeline CI/CD Anda:

```yaml
name: CI

on: [push]

jobs:
  pint:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.1'
          tools: composer

      - name: Install dependencies
        run: composer install

      - name: Run Pint
        run: ./vendor/bin/pint --test
```

### 📋 GitLab CI
```yaml
pint:
  stage: test
  script:
    - composer install
    - ./vendor/bin/pint --test
```

### 📋 CircleCI
```yaml
jobs:
  pint:
    steps:
      - checkout
      - run: composer install
      - run: ./vendor/bin/pint --test
```

### 📋 Pre-commit Hook
Anda dapat menyiapkan pre-commit hook untuk menjalankan Pint sebelum commit:

```bash
#!/bin/bash
# .git/hooks/pre-commit

./vendor/bin/pint
```

## 🎨 Integrasi Editor

### 📋 Visual Studio Code
Anda dapat mengintegrasikan Pint dengan VS Code menggunakan task:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Format PHP with Pint",
            "type": "shell",
            "command": "./vendor/bin/pint",
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "silent"
            },
            "problemMatcher": "$eslint-stylish"
        }
    ]
}
```

### 📋 PHPStorm
Anda dapat mengkonfigurasi PHPStorm untuk menjalankan Pint:

1. Buka Preferences → Tools → External Tools
2. Klik `+` untuk menambahkan tool baru
3. Konfigurasikan:
   - Name: `Pint`
   - Program: `$ProjectFileDir$/vendor/bin/pint`
   - Arguments: `$FilePath$`
   - Working Directory: `$ProjectFileDir$`

### 📋 Vim/Neovim
Anda dapat mengintegrasikan Pint dengan Vim/Neovim:

```vim
" Menambahkan command untuk menjalankan Pint
command! Pint execute '!./vendor/bin/pint %'
```

## 🚀 Penggunaan Lanjutan

### 📋 Menggunakan Cache
Pint menggunakan caching untuk meningkatkan performa:

```bash
# Membersihkan cache
pint --clear-cache

# Menonaktifkan cache
pint --no-cache
```

### 📋 Menggunakan Paralelisasi
Pint secara otomatis menggunakan threading untuk mempercepat formatting:

```bash
# Menentukan jumlah thread
pint --threads=4

# Menonaktifkan paralelisasi
pint --threads=1
```

### 📋 Filtering File
Anda dapat memfilter file yang akan diformat:

```bash
# Memfilter berdasarkan path
pint --path=app --path=database

# Mengecualikan path
pint --exclude=tests/fixtures

# Memfilter berdasarkan nama file
pint --name="*.php" --not-name="*-fix.php"
```

### 📋 Menggunakan Diff
Untuk melihat perubahan yang akan dibuat:

```bash
# Menampilkan diff
pint --diff

# Menampilkan diff dengan warna
pint --diff --ansi
```

## 🛠️ Custom Rules

### 📋 Menambahkan Rule Kustom
Anda dapat menambahkan rule kustom ke konfigurasi Pint:

```json
{
    "preset": "laravel",
    "rules": {
        "custom_rule": {
            "option": "value"
        }
    }
}
```

### 📋 Menonaktifkan Rule
Anda dapat menonaktifkan rule tertentu:

```json
{
    "preset": "laravel",
    "rules": {
        "concat_space": false,
        "new_with_braces": false
    }
}
```

### 📋 Mengganti Konfigurasi Rule
```json
{
    "preset": "laravel",
    "rules": {
        "array_syntax": {
            "syntax": "long"
        },
        "binary_operator_spaces": {
            "operators": {
                "=": "single_space",
                "=>": "align_single_space_minimal"
            }
        }
    }
}
```

## ⚡ Performance

### 📋 Tips Performa
1. Gunakan cache untuk mempercepat proses
2. Gunakan paralelisasi untuk proyek besar
3. Batasi file yang diformat dengan filtering
4. Gunakan preset yang sesuai dengan proyek Anda

### 📋 Benchmarking
Anda dapat membandingkan performa dengan tool lain:

```bash
# Mengukur waktu eksekusi
time ./vendor/bin/pint
```

### 📋 Memory Usage
Pint dioptimalkan untuk penggunaan memori yang efisien:

```bash
# Memantau penggunaan memori
pint --verbose
```

## 🔧 Troubleshooting

### 📋 Masalah Umum

#### 🔄 Pint tidak ditemukan
Pastikan Pint telah diinstal dan PATH telah dikonfigurasi dengan benar:

```bash
# Memeriksa instalasi global
composer global show laravel/pint

# Memeriksa instalasi lokal
ls vendor/bin/pint
```

#### 🔄 File tidak diformat
Periksa konfigurasi exclude dan filter:

```bash
# Memeriksa file yang diformat
pint --verbose
```

#### 🔄 Rule tidak bekerja
Periksa konfigurasi rule dan preset yang digunakan:

```bash
# Menampilkan rules yang aktif
pint --show-progress
```

### 📋 Debugging

#### 📋 Mode Debug
Gunakan mode verbose untuk informasi tambahan:

```bash
pint --verbose --diff
```

#### 📋 Testing Konfigurasi
Uji konfigurasi Anda dengan file sampel:

```bash
# Membuat file test
echo "<?php echo 'Hello World'; ?>" > test.php

# Menjalankan pint pada file test
pint test.php --diff
```

## 🧠 Kesimpulan

Laravel Pint menyediakan cara yang indah dan sangat cepat untuk memformat kode PHP dalam proyek Laravel Anda. Dengan konfigurasi default yang sesuai dengan gaya kode Laravel, Pint menjadikan proses formatting kode menjadi sederhana dan konsisten.

### 🔑 Keuntungan Utama
- Formatting kode yang indah dan konsisten
- Kecepatan ekstrem dengan paralelisasi
- Konfigurasi default yang sesuai dengan gaya Laravel
- Integrasi CI/CD yang mudah
- Integrasi editor yang luas
- Rule sets yang fleksibel
- Caching untuk performa optimal

### 🚀 Best Practices
1. Gunakan preset Laravel untuk proyek Laravel
2. Integrasi dengan CI/CD untuk memastikan konsistensi
3. Gunakan pre-commit hooks untuk formatting otomatis
4. Kustomisasi rules sesuai kebutuhan tim
5. Gunakan caching untuk performa optimal
6. Gunakan paralelisasi untuk proyek besar
7. Dokumentasikan konfigurasi Pint dalam README tim
8. Gunakan dry-run untuk melihat perubahan sebelum commit

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Pint untuk memformat kode PHP dalam proyek Laravel Anda.
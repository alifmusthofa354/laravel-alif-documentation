# Instalansi
panduan singkat dan jelas untuk **cara install Laravel** di komputer Anda:

---

## 🔧 1. Persiapan

Pastikan Anda sudah menginstal:

* **PHP** versi ≥ 8.1
* **Composer** (dependency manager untuk PHP)
* **Node.js & NPM** (opsional, untuk frontend build)

Cek versi PHP & Composer:

```bash
php -v
composer -V
```

---

## 📌 2. Install Laravel

Ada dua cara utama:

### ✅ Cara 1: Menggunakan Composer Create-Project (tanpa installer)

Jika tidak ingin install Laravel installer:

```bash
composer create-project laravel/laravel nama-project
```

---

### ✅ Cara 2: Menggunakan Laravel Installer

1. Install Laravel installer secara global:

   ```bash
   composer global require laravel/installer
   ```
2. Buat project baru:

   ```bash
   laravel new nama-project
   ```

---



## 🚀 3. Menjalankan Laravel

Masuk ke folder project:

```bash
cd nama-project
php artisan serve
```

Laravel akan berjalan di:
```
http://localhost:8000
```

---

## 📌 4. (Opsional) Install Frontend Asset

Jika Anda menggunakan starter kit atau butuh asset frontend:

```bash
npm install
npm run dev
```

---

Jadi, langkah paling simpel adalah:

```bash
composer create-project laravel/laravel example-app
cd example-app
php artisan serve
```

👉 Selesai! Laravel sudah bisa dijalankan di browser.

---


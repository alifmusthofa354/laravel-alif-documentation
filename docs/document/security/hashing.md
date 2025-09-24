# 🔐 Hashing di Laravel

Hashing adalah salah satu mekanisme keamanan penting dalam pengembangan aplikasi. Laravel menyediakan **Hash Facade** yang mendukung algoritma **Bcrypt** dan **Argon2** untuk menyimpan password pengguna dengan aman.  

Pada dokumen ini, kita akan membahas mulai dari pengenalan hashing di Laravel, cara konfigurasi, hingga implementasi penggunaan secara praktis dengan contoh kode.

---

## 📘 1. Pengenalan (Introduction)

Laravel menggunakan hashing untuk **menyimpan password dengan aman**.  
Secara default, **Bcrypt** digunakan pada proses registrasi dan autentikasi (jika menggunakan starter kit Laravel).  

👉 **Mengapa Bcrypt direkomendasikan?**  
- **Work factor** dapat diatur (menentukan seberapa lama proses hashing).  
- Semakin tinggi work factor, semakin lambat hashing dijalankan, dan itu **baik untuk keamanan**.  
- Algoritma hashing yang lambat memperlambat upaya brute force & rainbow table attack.  

---

## ⚙️ 2. Konfigurasi (Configuration)

Secara bawaan, Laravel menggunakan **bcrypt** sebagai driver hashing.  
Namun, tersedia juga driver lain seperti **argon** dan **argon2id**.

🔧 Untuk mengatur driver hashing, gunakan variabel environment:

```bash
HASH_DRIVER=bcrypt
````

👉 Jika ingin menyesuaikan semua opsi driver hashing, jalankan perintah berikut:

```bash
php artisan config:publish hashing
```

Dengan begitu, file konfigurasi hashing akan tersedia di dalam direktori `config/`.

---

## 🛠️ 3. Penggunaan Dasar (Basic Usage)

### 🔑 3.1. Hashing Password

Untuk meng-hash sebuah password, gunakan method `make` pada **Hash Facade**.

```php
<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
 
class PasswordController extends Controller
{
    /**
     * Update the password for the user.
     */
    public function update(Request $request): RedirectResponse
    {
        // Validasi password baru...
 
        $request->user()->fill([
            'password' => Hash::make($request->newPassword)
        ])->save();
 
        return redirect('/profile');
    }
}
```

---

### ⚡ 3.2. Mengatur Work Factor Bcrypt

Anda bisa menyesuaikan **rounds** untuk meningkatkan tingkat kesulitan hashing:

```php
$hashed = Hash::make('password', [
    'rounds' => 12,
]);
```

> Semakin tinggi `rounds`, semakin aman namun lebih lambat.

---

### 🧩 3.3. Mengatur Work Factor Argon2

Argon2 memiliki opsi tambahan yang dapat diatur: **memory**, **time**, dan **threads**.

```php
$hashed = Hash::make('password', [
    'memory' => 1024,
    'time' => 2,
    'threads' => 2,
]);
```

📖 Untuk detail lebih lanjut, silakan lihat dokumentasi resmi PHP mengenai **Argon hashing**.

---

### ✅ 3.4. Verifikasi Password

Gunakan `check` untuk memverifikasi apakah string plain-text sesuai dengan hash:

```php
if (Hash::check('plain-text', $hashedPassword)) {
    // Password cocok...
}
```

---

### 🔄 3.5. Menentukan Apakah Password Perlu Rehash

Gunakan `needsRehash` untuk mengecek apakah hash perlu diperbarui karena adanya perubahan konfigurasi:

```php
if (Hash::needsRehash($hashed)) {
    $hashed = Hash::make('plain-text');
}
```

---

## 🛡️ 4. Verifikasi Algoritma Hash (Hash Algorithm Verification)

Laravel memastikan bahwa hash yang diberikan **dibuat dengan algoritma hashing yang dipilih** aplikasi.
Jika berbeda, Laravel akan melempar `RuntimeException`.

👉 Hal ini bertujuan untuk mencegah manipulasi algoritma hashing yang berpotensi berbahaya.

Namun, jika Anda perlu mendukung lebih dari satu algoritma hashing (misalnya saat migrasi algoritma), Anda bisa menonaktifkan verifikasi ini dengan menambahkan pada `.env`:

```bash
HASH_VERIFY=false
```

---

## 🎯 Kesimpulan

* Laravel menyediakan **Hash Facade** untuk keamanan password.
* Secara default menggunakan **Bcrypt**, namun bisa juga memakai **Argon2**.
* Pengaturan seperti **work factor** membuat password lebih tahan brute force.
* Tersedia fitur **verifikasi password** dan **rehash otomatis** jika konfigurasi berubah.

Dengan menerapkan hashing dengan benar, aplikasi Laravel Anda akan memiliki **lapisan keamanan ekstra** dalam menangani password pengguna. 🚀

```

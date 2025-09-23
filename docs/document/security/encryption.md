# 🔐 Encryption di Laravel

## 📖 Pendahuluan

Laravel menyediakan layanan **enkripsi** yang sederhana dan aman melalui **OpenSSL** dengan algoritma **AES-256** dan **AES-128**.
Semua nilai yang terenkripsi akan dilindungi dengan **Message Authentication Code (MAC)** sehingga data tidak bisa dimodifikasi atau dipalsukan setelah dienkripsi.

Dengan fitur ini, Laravel memungkinkan developer untuk menyimpan data sensitif (misalnya token API, informasi pribadi, atau session cookie) secara aman.

---

## ⚙️ Konfigurasi

Sebelum menggunakan layanan enkripsi di Laravel, kita harus memastikan bahwa konfigurasi **APP\_KEY** telah diatur pada file `.env` dan `config/app.php`.

👉 **Langkah-langkah konfigurasi:**

1. Buka terminal project Laravel.
2. Jalankan perintah berikut untuk menghasilkan key baru:

   ```bash
   php artisan key:generate
   ```
3. Laravel akan membuat **APP\_KEY** secara otomatis dan menyimpannya ke dalam file `.env`.

📌 **Contoh hasil di file `.env`:**

```env
APP_KEY=base64:J63qRTDLub5NuZvP+kb8YIorGS6qFYHKVo6u7179stY=
```

🔑 APP\_KEY ini sangat penting, jangan pernah membagikannya sembarangan.

---

## 🔄 Gracefully Rotating Encryption Keys

Kadang kita perlu mengganti kunci enkripsi (APP\_KEY) untuk alasan keamanan.
Namun, ada konsekuensinya:

* Semua user yang sedang login akan otomatis **logout**.
* Data yang terenkripsi dengan key lama **tidak bisa lagi didekripsi** dengan key baru.

✨ **Solusinya:** Laravel menyediakan dukungan untuk menyimpan key lama di variabel `APP_PREVIOUS_KEYS`.
Dengan ini, Laravel akan mencoba mendekripsi data menggunakan key lama jika key utama gagal.

📌 **Contoh konfigurasi di `.env`:**

```env
APP_KEY="base64:J63qRTDLub5NuZvP+kb8YIorGS6qFYHKVo6u7179stY="
APP_PREVIOUS_KEYS="base64:2nLsGFGzyoae2ax3EF2Lyq/hH6QghBGLIq5uL+Gp8/w="
```

📝 **Penjelasan:**

* **APP\_KEY** → selalu dipakai untuk enkripsi data baru.
* **APP\_PREVIOUS\_KEYS** → dipakai hanya saat dekripsi jika APP\_KEY gagal.

Dengan cara ini, user tetap bisa menggunakan aplikasi tanpa gangguan meskipun kunci enkripsi diganti.

---

## 🛠️ Menggunakan Encrypter

### 🔒 Mengenkripsi Data

Untuk mengenkripsi data, kita dapat menggunakan metode `encryptString` dari **Facade Crypt**.

📌 **Contoh implementasi Controller:**

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class DigitalOceanTokenController extends Controller
{
    /**
     * Simpan token API DigitalOcean untuk user.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->user()->fill([
            'token' => Crypt::encryptString($request->token),
        ])->save();

        return redirect('/secrets');
    }
}
```

📝 **Narasi:**

* Token API user disimpan di database dalam bentuk terenkripsi.
* Jika database bocor, token tetap aman karena tidak bisa dibaca tanpa key enkripsi.

---

### 🔓 Mendekripsi Data

Untuk mengembalikan data ke bentuk aslinya, gunakan metode `decryptString`.
Jika data gagal didekripsi (misalnya karena MAC tidak valid), Laravel akan melempar exception `DecryptException`.

📌 **Contoh kode:**

```php
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;

try {
    $decrypted = Crypt::decryptString($encryptedValue);
} catch (DecryptException $e) {
    // Tangani error jika data tidak bisa didekripsi
}
```

📝 **Narasi:**

* `Crypt::decryptString()` akan mencoba membuka data terenkripsi.
* Jika data rusak atau diubah, Laravel akan menolak dekripsi untuk mencegah manipulasi berbahaya.

---

## 🎯 Kesimpulan

* Laravel menyediakan enkripsi built-in yang aman dengan **AES-256** dan **AES-128**.
* **APP\_KEY** adalah kunci utama enkripsi, dan bisa diputar (rotated) dengan aman menggunakan `APP_PREVIOUS_KEYS`.
* Data dapat dengan mudah dienkripsi (`encryptString`) dan didekripsi (`decryptString`) menggunakan **Crypt Facade**.
* Dengan fitur ini, developer bisa menjaga keamanan data sensitif pengguna secara optimal.

🚀 Dengan memanfaatkan **Encryption di Laravel**, kita bisa membangun aplikasi yang lebih **aman**, **andal**, dan **siap produksi**.

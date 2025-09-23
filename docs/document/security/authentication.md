# 🔐 Autentikasi di Laravel

Autentikasi adalah salah satu fitur penting dalam hampir semua aplikasi web modern. Dengan autentikasi, aplikasi dapat memastikan bahwa pengguna yang masuk memang memiliki akses yang sah ke sistem. Laravel menyediakan fitur autentikasi yang **aman, cepat, dan mudah diimplementasikan**.

---

## 📖 Pendahuluan
Laravel menyediakan sistem autentikasi berbasis **guards** dan **providers**.

- **Guards** → Menentukan bagaimana pengguna diautentikasi untuk setiap request (misalnya session-based, token-based, dsb).
- **Providers** → Menentukan bagaimana data pengguna diambil dari database atau penyimpanan lain.

File konfigurasi utama autentikasi ada di `config/auth.php`.

⚠️ **Catatan:** Jangan bingungkan guards dan providers dengan **roles** dan **permissions**. Untuk mengelola izin pengguna, Laravel memiliki sistem **authorization** yang berbeda.

---

## 🚀 Starter Kits
Untuk memulai lebih cepat, Laravel menyediakan **Starter Kit** seperti Breeze, Jetstream, atau Fortify. Starter kit akan otomatis menambahkan:

- Controller autentikasi
- Routes
- Views (form login, register, reset password, dll)

👉 Contoh penggunaan starter kit:
```bash
composer require laravel/breeze --dev
php artisan breeze:install
npm install && npm run dev
php artisan migrate
```
Setelah migrasi database, kunjungi `/register` untuk mencoba autentikasi bawaan.

---

## 🗄️ Pertimbangan Database
Secara default, Laravel menyertakan model `App\Models\User` dengan migrasi tabel `users`. Pastikan:

- Kolom password memiliki panjang minimal **60 karakter** (untuk bcrypt).
- Tabel memiliki kolom `remember_token` (100 karakter, nullable) untuk fitur **Remember Me**.

Contoh migrasi bawaan:
```php
$table->string('password');
$table->rememberToken();
```

---

## 🌐 Ekosistem Autentikasi Laravel
Laravel mendukung dua jenis autentikasi utama:

1. **Autentikasi berbasis browser (cookie/session)** → menggunakan `Auth` & `Session` facade.
2. **Autentikasi API (token)** → menggunakan **Sanctum** atau **Passport**.

🔑 **Rekomendasi:**
- Gunakan **Sanctum** untuk aplikasi modern (SPA, API, mobile).
- Gunakan **Passport** hanya jika membutuhkan semua fitur **OAuth2**.

---

## 🖥️ Autentikasi Bawaan Browser
Laravel menyediakan autentikasi bawaan berbasis **cookie dan session**.

Contoh mendapatkan user yang sedang login:
```php
use Illuminate\Support\Facades\Auth;

$user = Auth::user();
$id = Auth::id();
```

Alternatif di controller:
```php
public function update(Request $request)
{
    $user = $request->user();
    // update data user...
}
```

---

## 🔒 Proteksi Route
Gunakan middleware `auth` agar hanya user yang login dapat mengakses route tertentu.

```php
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware('auth');
```

Menentukan guard tertentu:
```php
Route::get('/admin', function () {
    // hanya admin
})->middleware('auth:admin');
```

---

## 👤 Login Manual
Jika tidak menggunakan Starter Kit, Anda dapat membuat autentikasi manual dengan `Auth::attempt()`.

```php
public function authenticate(Request $request): RedirectResponse
{
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();
        return redirect()->intended('dashboard');
    }

    return back()->withErrors([
        'email' => 'Email atau password salah.',
    ])->onlyInput('email');
}
```

⚠️ Password tidak perlu di-hash manual, Laravel akan membandingkan otomatis dengan hash di database.

---

## 🔑 Remember Me
Untuk fitur **ingat saya**, tambahkan parameter kedua di `Auth::attempt()`:

```php
if (Auth::attempt(['email' => $email, 'password' => $password], true)) {
    // user diingat hingga logout manual
}
```

---

## 📡 HTTP Basic Auth
Laravel juga mendukung autentikasi cepat via **HTTP Basic Auth**.

```php
Route::get('/profile', function () {
    return view('profile');
})->middleware('auth.basic');
```

👉 Cocok untuk API sederhana tanpa halaman login.

---

## 🚪 Logout
Gunakan `Auth::logout()` untuk logout user.

```php
public function logout(Request $request): RedirectResponse
{
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect('/');
}
```

---

## 🔄 Konfirmasi Password
Untuk tindakan sensitif, Laravel memiliki middleware `password.confirm`.

```php
Route::get('/settings', function () {
    // halaman setting
})->middleware(['auth', 'password.confirm']);
```

User harus memasukkan ulang password sebelum melanjutkan.

---

## 🛠️ Custom Guards & Providers
Anda bisa membuat **custom guard** atau **custom user provider** jika ingin autentikasi non-standar (misalnya JWT atau MongoDB).

Contoh custom guard:
```php
Auth::extend('jwt', function ($app, $name, array $config) {
    return new JwtGuard(Auth::createUserProvider($config['provider']));
});
```

Contoh custom provider:
```php
Auth::provider('mongo', function ($app, array $config) {
    return new MongoUserProvider($app->make('mongo.connection'));
});
```

---

## 📢 Event Autentikasi
Laravel men-trigger event saat proses autentikasi, misalnya:

- `Illuminate\Auth\Events\Login`
- `Illuminate\Auth\Events\Logout`
- `Illuminate\Auth\Events\Registered`
- `Illuminate\Auth\Events\Failed`

👉 Anda bisa membuat listener untuk logging, notifikasi, atau tracking keamanan.

---

## ✅ Kesimpulan
- Gunakan **starter kit** untuk cepat memulai.
- Pilih **Sanctum** untuk SPA, API, atau mobile.
- Gunakan **Passport** hanya jika butuh fitur lengkap OAuth2.
- Middleware `auth`, `guest`, dan `password.confirm` akan membantu menjaga keamanan route.
- Laravel memungkinkan membuat guard & provider kustom sesuai kebutuhan.

Dengan fitur ini, Anda bisa membangun sistem autentikasi yang **fleksibel, aman, dan modern**. 🚀
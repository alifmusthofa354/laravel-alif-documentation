# 📨 HTTP Requests di Laravel - Panduan Lengkap untuk Pemula

Hai muridku yang hebat! Hari ini kita akan belajar tentang **HTTP Requests** di Laravel - bagian penting dari setiap aplikasi web yang bertanggung jawab untuk menangani data yang dikirim dari client (seperti browser, mobile app, atau API lain) ke server. Seperti biasa, aku akan menjelaskan semuanya dengan bahasa yang mudah dan contoh kode yang bisa kamu coba sendiri.

---

## Bagian 1: Memahami Dasar-dasar HTTP Request 🎯

### 1. 📖 Apa Itu HTTP Request?

**Analogi Sederhana:** Bayangkan kamu datang ke sebuah restoran dan memberikan pesananmu ke pelayan. Pesananmu (apa yang kamu minta makanan dan minuman) adalah **request**, dan pelayan yang mengantar pesananmu ke dapur adalah **Laravel** yang menangani request-mu.

Dalam dunia web:

- **Client** (browser, mobile app) mengirim request ke server
- **HTTP Request** berisi informasi seperti URL, method (GET, POST, PUT, dll), headers, dan data yang dikirim
- **Laravel** menerima request dan memberikan response yang sesuai

**Jenis HTTP Methods Umum:**
- `GET`: Mengambil data
- `POST`: Mengirim data baru
- `PUT/PATCH`: Mengupdate data
- `DELETE`: Menghapus data

### 2. 💡 Konsep Dasar Request di Laravel

Laravel menyediakan class `Illuminate\Http\Request` yang memudahkan kita untuk:

- Mengakses semua data dari request (input, file, headers, dll)
- Memvalidasi data dengan mudah
- Menangani file upload
- Mengetahui informasi tentang request (path, method, IP, dll)

---

## Bagian 2: Mengakses Request dalam Controller 🔧

### 3. 🧰 Dependency Injection untuk Request

Cara paling umum dan direkomendasikan untuk mengakses request adalah menggunakan **Dependency Injection**:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class UserController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        // Mengambil data dari request
        $name = $request->input('name');
        $email = $request->input('email');
        
        // Proses data
        // ...
        
        return redirect('/users');
    }
    
    public function update(Request $request, int $id): RedirectResponse
    {
        // Bisa juga digabung dengan parameter route
        $data = $request->only(['name', 'email']);
        
        // Update user
        // ...
        
        return redirect()->route('users.show', $id);
    }
}
```

### 4. 🔄 Mengakses Request di Route Closure

Jika kamu tidak menggunakan controller, kamu bisa mengakses request langsung di route closure:

```php
use Illuminate\Http\Request;

Route::post('/users', function (Request $request) {
    $name = $request->input('name');
    $email = $request->input('email');
    
    // Proses data
    return response()->json(['message' => 'User created successfully']);
});
```

---

## Bagian 3: Mendapatkan Informasi Request 📊

### 5. 📍 Path dan URL Request

Mendapatkan informasi tentang URL dan path yang diakses:

```php
// Mendapatkan path (tanpa query string)
$path = $request->path(); // contoh: "users/123"

// Mengecek apakah path cocok dengan pola tertentu
if ($request->is('admin/*')) {
    // URL dimulai dengan 'admin/'
}

if ($request->is('users/*')) {
    // URL dimulai dengan 'users/'
}

if ($request->routeIs('admin.*')) {
    // Route menggunakan nama yang dimulai dengan 'admin.'
}

// Mendapatkan URL lengkap (dengan query string)
$url = $request->url(); // contoh: "http://example.com/users"
$fullUrl = $request->fullUrl(); // contoh: "http://example.com/users?active=1"

// Menambahkan query string ke URL
$newUrl = $request->fullUrlWithQuery(['sort' => 'name', 'order' => 'desc']);
```

### 6. 🌐 Host dan Method Request

```php
// Mendapatkan host
$host = $request->host(); // "example.com"
$httpHost = $request->httpHost(); // "example.com:80"
$schemeAndHost = $request->schemeAndHttpHost(); // "https://example.com"

// Mendapatkan HTTP method
$method = $request->method(); // "GET", "POST", dll
if ($request->isMethod('post')) {
    // Ini adalah request POST
}
```

### 7. 🏷️ Headers Request

Mengambil header dari request:

```php
// Mendapatkan header tertentu
$accept = $request->header('Accept');
$userAgent = $request->header('User-Agent');

// Dengan nilai default jika header tidak ada
$contentType = $request->header('Content-Type', 'text/html');

// Mengecek keberadaan header
if ($request->hasHeader('X-Requested-With')) {
    // Header ada
}

// Mendapatkan Bearer token (untuk API authentication)
$token = $request->bearerToken();
```

### 8. 🌍 Content Negotiation

Laravel mendukung content negotiation untuk menentukan format respons yang diinginkan client:

```php
// Mendapatkan daftar content types yang diterima
$accepts = $request->getAcceptableContentTypes();

// Mengecek apakah client menerima format tertentu
if ($request->accepts(['application/json', 'text/html'])) {
    // Client bisa menerima JSON atau HTML
}

// Mendapatkan format yang paling disukai
$preferred = $request->prefers(['text/html', 'application/json']);

// Mengecek apakah client mengharapkan JSON (biasanya digunakan dalam API)
if ($request->expectsJson()) {
    // Respons sebaiknya dalam format JSON
}

// Mengecek apakah request adalah AJAX
if ($request->ajax()) {
    // Request menggunakan AJAX
}
```

---

## Bagian 4: Mengambil Data Input dari Request 📥

### 9. 📝 Mengambil Input Sederhana

```php
// Mengambil input dengan nama tertentu
$name = $request->input('name');
$email = $request->input('email', 'default@example.com'); // dengan default value

// Mengambil semua input sebagai array
$allInput = $request->all();

// Menggunakan dynamic property (sama seperti input())
$phone = $request->phone;
```

### 10. 📋 Input dari Array dan Nested Data

```php
// Jika form mengirimkan array
$skills = $request->input('skills'); // ['php', 'laravel', 'javascript']

// Jika form memiliki nested structure
$address = $request->input('user.address.street');
$firstSkill = $request->input('skills.0');

// Menggunakan dot notation untuk mengambil semua dari nested array
$allSkills = $request->input('skills.*');
```

### 11. 🧮 Helper untuk Tipe Data Tertentu

Laravel menyediakan helper untuk mengambil input dengan tipe data tertentu:

```php
// String dengan trim otomatis
$name = $request->string('name')->trim();

// Integer
$age = $request->integer('age');

// Boolean (berguna untuk checkbox)
$isActive = $request->boolean('is_active');

// Array
$tags = $request->array('tags');

// Date (mengembalikan Carbon instance)
$birthday = $request->date('birthday');

// Enum (jika menggunakan PHP Enum)
use App\Enums\UserStatus;
$status = $request->enum('status', UserStatus::class);
```

### 12. 🔍 Mengecek Keberadaan dan Status Input

```php
// Mengecek apakah input ada
if ($request->has('name')) {
    // Input 'name' ada
}

// Mengecek beberapa input sekaligus
if ($request->has(['name', 'email'])) {
    // Input 'name' dan 'email' ada
}

// Mengecek apakah salah satu dari beberapa input ada
if ($request->hasAny(['name', 'email', 'phone'])) {
    // Salah satu dari input tersebut ada
}

// Mengecek apakah input terisi (tidak kosong)
if ($request->filled('name')) {
    // Input 'name' terisi (tidak null, tidak string kosong, dll)
}

// Mengecek apakah salah satu input terisi
if ($request->anyFilled(['name', 'email'])) {
    // Salah satu dari input tersebut terisi
}

// Mengecek apakah input tidak terisi
if ($request->isNotFilled('phone')) {
    // Input 'phone' kosong atau tidak ada
}
```

### 13. 📦 Mengambil Sebagian Input

```php
// Mengambil hanya input tertentu
$credentials = $request->only(['email', 'password']);

// Mengambil semua kecuali input tertentu
$filtered = $request->except(['password', 'credit_card']);

// Menggunakan conditional
$whenHas = $request->whenHas('name', function ($request) {
    return $request->input('name');
}, function ($request) {
    return 'Anonymous';
});
```

### 14. 📝 Old Input (Input Lama) - Repopulasi Form

Fitur ini sangat berguna untuk mengisi ulang form saat validasi gagal:

```php
// Menyimpan input ke session
$request->flash();

// Menyimpan hanya input tertentu
$request->flashOnly(['name', 'email']);

// Menyimpan semua kecuali input tertentu
$request->flashExcept(['password']);

// Cara yang lebih umum: flash input dan redirect
return redirect('/form')->withInput();
return redirect()->back()->withInput();
return redirect()->route('user.create')->withInput(['name' => 'John']);
```

**Di Blade template:**
```blade
<input type="text" name="name" value="{{ old('name') }}">
<input type="email" name="email" value="{{ old('email', 'default@example.com') }}">
```

---

## Bagian 5: Menangani File Upload 📁

### 15. 🏷️ Mendapatkan File dari Request

```php
// Mengambil file dengan method
$file = $request->file('photo');

// Menggunakan dynamic property
$file = $request->photo;

// Mengecek apakah file ada
if ($request->hasFile('photo')) {
    // File ada
}

// Mengecek apakah upload berhasil (tidak ada error)
if ($request->file('photo')->isValid()) {
    // File berhasil diupload
}
```

### 16. 📊 Informasi Tentang File Upload

```php
$file = $request->file('photo');

// Nama file asli
$originalName = $file->getClientOriginalName();

// Ekstensi file (dideteksi dari isi file)
$extension = $file->extension();

// Ekstensi asli dari client
$clientExtension = $file->getClientOriginalExtension();

// Ukuran file dalam bytes
$size = $file->getSize();

// MIME type
$mimeType = $file->getMimeType();

// Path sementara file
$path = $file->path();

// Cek file type
if ($file->isValid() && $file->isImage()) {
    // Ini adalah gambar
}
```

### 17. 💾 Menyimpan File Upload

Laravel menyediakan berbagai cara untuk menyimpan file:

```php
// Menyimpan ke storage/app/public/images (menghasilkan nama unik)
$path = $request->file('photo')->store('images');

// Menyimpan dengan nama tertentu
$path = $request->file('photo')->storeAs('images', 'my-photo.jpg');

// Menyimpan ke disk tertentu (misalnya s3)
$path = $request->file('photo')->store('images', 's3');

// Menyimpan dengan nama tertentu ke disk tertentu
$path = $request->file('photo')->storeAs('images', 'my-photo.jpg', 's3');
```

### 18. 🔒 Validasi File Upload

```php
public function store(Request $request)
{
    $request->validate([
        'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        'documents.*' => 'file|mimes:pdf,doc,docx|max:10240' // validasi untuk array file
    ]);
    
    // Proses upload
    if ($request->hasFile('photo')) {
        $path = $request->file('photo')->store('user-photos');
    }
}
```

---

## Bagian 6: Menangani Cookies 🍪

### 19. 📤 Mengambil Cookie

```php
// Mengambil cookie
$sessionId = $request->cookie('session_id');

// Dengan default value
$theme = $request->cookie('theme', 'light');

// Semua cookies
$allCookies = $request->cookies->all();
```

**Catatan:** Cookie yang dibuat oleh Laravel otomatis dienkripsi dan ditandatangani.

---

## Bagian 7: PSR-7 Support 💠

### 20. 🔄 Menggunakan PSR-7 Requests

Laravel mendukung standar PSR-7 untuk HTTP messages:

**Instalasi:**
```bash
composer require symfony/psr-http-message-bridge
composer require nyholm/psr7
```

**Penggunaan:**
```php
use Psr\Http\Message\ServerRequestInterface;

Route::get('/psr7', function (ServerRequestInterface $request) {
    $uri = $request->getUri();
    $method = $request->getMethod();
    
    return response("Method: {$method}, URI: {$uri}");
});
```

---

## Bagian 8: Normalisasi Input Otomatis ⚙️

### 21. 🧹 Trim Strings dan Convert Empty to Null

Laravel otomatis menerapkan middleware berikut:

- `TrimStrings`: Menghapus spasi di awal/akhir string
- `ConvertEmptyStringsToNull`: Mengubah string kosong menjadi `null`

**Contoh efek:**
```php
// Input: "  John Doe  " → Output: "John Doe" (telah ditrim)
// Input: "" → Output: null
```

**Menonaktifkan normalisasi untuk route tertentu:**
```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->trimStrings(except: [
        '/admin/*', // tidak akan ditrim untuk route admin
    ]);
    
    $middleware->convertEmptyStringsToNull(except: [
        '/admin/*', // string kosong tidak akan diubah menjadi null
    ]);
});
```

---

## Bagian 9: Trusted Proxies dan Hosts 🔐

### 22. 🛡️ Mengonfigurasi Trusted Proxies

Sangat penting ketika aplikasi berada di belakang load balancer:

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->trustProxies(at: [
        '192.168.1.1',
        '10.0.0.0/8',
        // Jika di cloud dan IP bisa berubah:
        // '*' untuk mempercayai semua (berisiko jika tidak dalam lingkungan terkontrol)
    ]);
    
    // Atur header yang bisa dipercaya
    $middleware->trustProxies(headers: 
        Request::HEADER_X_FORWARDED_FOR |
        Request::HEADER_X_FORWARDED_HOST |
        Request::HEADER_X_FORWARDED_PORT |
        Request::HEADER_X_FORWARDED_PROTO |
        Request::HEADER_X_FORWARDED_AWS_ELB
    );
});
```

### 23. 🏠 Mengonfigurasi Trusted Hosts

Untuk mencegah host header injection:

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->trustHosts(at: [
        'laravel.test',
        'myapp.com',
        '*.myapp.com', // untuk subdomain
    ]);
});
```

---

## Bagian 10: Best Practices & Tips ✅

### 24. 📋 Praktik Terbaik untuk Request

1. **Gunakan Validasi:** Selalu validasi input sebelum diproses
```php
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
    ]);
    
    // Lanjutkan dengan data yang sudah divalidasi
}
```

2. **Gunakan Input Sanitization:** Bersihkan data sebelum digunakan
```php
$cleanName = strip_tags($request->input('name'));
```

3. **Hindari Accessing Raw Input:** Gunakan method bawaan Laravel
```php
// Jangan
$input = $_POST['name'];

// Gunakan
$input = $request->input('name');
```

4. **Gunakan Filling Protection:** Ketika membuat model dari input
```php
// Di model
protected $fillable = ['name', 'email'];

// Di controller
User::create($request->only(['name', 'email']));
```

### 25. 💡 Tips Berguna

```php
// Gunakan when() untuk conditional logic
$users = User::when($request->filled('status'), function ($query) use ($request) {
    $query->where('status', $request->input('status'));
})->get();

// Gunakan collect() untuk mengubah input menjadi collection
$inputs = $request->collect()->filter(function ($value) {
    return !empty($value);
});

// Gunakan except() untuk membersihkan input sensitif
$createData = $request->except(['password_confirmation']);
```

---

## Bagian 11: Contoh Implementasi Lengkap 👨‍💻

Mari kita buat contoh form penggunaan request yang lengkap:

```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class UserController extends Controller
{
    public function showForm(): View
    {
        return view('users.create');
    }
    
    public function store(Request $request): RedirectResponse
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'age' => 'required|integer|min:18|max:100',
            'bio' => 'nullable|string|max:1000',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'interests' => 'array',
            'interests.*' => 'string|in:programming,gaming,music,reading',
        ]);
        
        // Proses file upload jika ada
        $photoPath = null;
        if ($request->hasFile('profile_photo')) {
            $photoPath = $request->file('profile_photo')->store('profile-photos');
        }
        
        // Tambahkan photo_path ke data yang divalidasi
        $validated['photo_path'] = $photoPath;
        
        // Buat user baru
        $user = User::create($validated);
        
        // Redirect dengan pesan sukses
        return redirect()->route('users.show', $user)
            ->with('success', 'User created successfully!');
    }
    
    public function update(Request $request, User $user): RedirectResponse
    {
        // Validasi dengan kondisi update
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'age' => 'required|integer|min:18|max:100',
            'bio' => 'nullable|string|max:1000',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);
        
        // Handle file upload
        if ($request->hasFile('profile_photo')) {
            // Hapus foto lama jika ada
            if ($user->photo_path) {
                Storage::delete($user->photo_path);
            }
            
            // Simpan foto baru
            $validated['photo_path'] = $request->file('profile_photo')->store('profile-photos');
        }
        
        // Update user
        $user->update($validated);
        
        return redirect()->route('users.show', $user)
            ->with('success', 'User updated successfully!');
    }
    
    public function search(Request $request): View
    {
        // Ambil parameter pencarian
        $query = $request->input('q', '');
        $status = $request->input('status', '');
        $sort = $request->input('sort', 'created_at');
        $order = $request->input('order', 'desc');
        
        // Bangun query secara kondisional
        $users = User::query();
        
        if (!empty($query)) {
            $users->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
        }
        
        if (!empty($status)) {
            $users->where('status', $status);
        }
        
        $users->orderBy($sort, $order);
        
        $users = $users->paginate(15);
        
        return view('users.search', compact('users', 'query', 'status', 'sort', 'order'));
    }
}
```

**Contoh route:**
```php
// routes/web.php
Route::get('/users/create', [UserController::class, 'showForm'])->name('users.create');
Route::post('/users', [UserController::class, 'store'])->name('users.store');
Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
Route::get('/users/search', [UserController::class, 'search'])->name('users.search');
```

**Contoh view (resources/views/users/create.blade.php):**
```blade
@extends('layouts.app')

@section('title', 'Create User')

@section('content')
<div class="container">
    <h1>Create User</h1>
    
    @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
    
    <form method="POST" action="{{ route('users.store') }}" enctype="multipart/form-data">
        @csrf
        
        <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name" name="name" value="{{ old('name') }}">
        </div>
        
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email" value="{{ old('email') }}">
        </div>
        
        <div class="mb-3">
            <label for="age" class="form-label">Age</label>
            <input type="number" class="form-control" id="age" name="age" value="{{ old('age') }}">
        </div>
        
        <div class="mb-3">
            <label for="bio" class="form-label">Bio</label>
            <textarea class="form-control" id="bio" name="bio" rows="3">{{ old('bio') }}</textarea>
        </div>
        
        <div class="mb-3">
            <label for="profile_photo" class="form-label">Profile Photo</label>
            <input type="file" class="form-control" id="profile_photo" name="profile_photo">
        </div>
        
        <div class="mb-3">
            <button type="submit" class="btn btn-primary">Create User</button>
            <a href="{{ route('users.index') }}" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
</div>
@endsection
```

---

## 12. 📚 Cheat Sheet & Referensi Cepat

### 🧩 Mengambil Input
```
$request->input('name')           → Ambil input dengan nama
$request->input('name', 'default') → Ambil input dengan default
$request->all()                   → Ambil semua input
$request->only(['name', 'email']) → Ambil beberapa input
$request->except('password')       → Ambil semua kecuali beberapa
```

### 🔍 Validasi Input
```
$request->has('name')            → Cek apakah input ada
$request->filled('name')         → Cek apakah input terisi
$request->boolean('active')      → Ambil sebagai boolean
$request->integer('age')         → Ambil sebagai integer
```

### 📁 File Upload
```
$request->hasFile('photo')       → Cek apakah file ada
$request->file('photo')          → Ambil file
$file->store('images')          → Simpan file
$file->isValid()                → Cek apakah upload berhasil
```

### 🍪 Cookies
```
$request->cookie('name')         → Ambil cookie
$cookie = $request->cookies->all() → Ambil semua cookies
```

### 🔐 Proxies dan Hosts
```
TrustProxies: Untuk load balancer
TrustHosts: Untuk mencegah host header injection
```

### 💡 Tips Umum
```
Use $request->validate() for validation
Use $request->only() for mass assignment protection
Use $request->flash() for form repopulation on error
```

---

## 13. 🎯 Kesimpulan

HTTP Request adalah komponen penting dalam aplikasi Laravel yang bertanggung jawab untuk menangani semua data yang masuk ke aplikasi kamu. Dengan memahami konsep berikut:

- **Mengakses request** melalui dependency injection
- **Mengambil input** dari berbagai sumber (form, JSON, query string)
- **Menangani file upload** dengan aman
- **Menggunakan validasi** untuk keamanan
- **Memahami konfigurasi trusted proxies** untuk lingkungan production

Kamu sekarang siap membuat aplikasi web yang aman dan efisien dalam menangani berbagai jenis request dari client. Ingat selalu untuk memvalidasi semua input dari user untuk mencegah potensi serangan keamanan.

Selamat mengembangkan aplikasi kamu, muridku! Dengan kuasai request handling, kamu sudah melangkah jauh dalam membangun aplikasi web yang robust dan aman.
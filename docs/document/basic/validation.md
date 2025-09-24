# 📝 Laravel Validation - Panduan Lengkap untuk Pemula

Hai muridku yang hebat! Hari ini kita akan belajar tentang **Validation** di Laravel - sistem penting yang memastikan data yang masuk ke aplikasi kamu adalah **aman**, **valid**, dan **siap diproses**. Seperti biasa, aku akan menjelaskan semuanya dengan bahasa yang mudah dan contoh kode yang bisa kamu coba sendiri.

---

## Bagian 1: Memahami Konsep Dasar Validation 🎯

### 1. 📖 Apa Itu Validation?

**Analogi Sederhana:** Bayangkan kamu adalah seorang petugas keamanan di sebuah acara besar. Tugas kamu memeriksa setiap tamu sebelum mereka masuk ke dalam gedung. Kamu memastikan mereka:

- Membawa tiket yang valid (tidak palsu)
- Identitas sesuai dengan nama di tiket
- Tidak membawa barang berbahaya
- Memenuhi syarat usia minimum

**Validation di Laravel adalah seperti petugas keamanan ini** - mereka memeriksa setiap data yang masuk ke aplikasi kamu sebelum data tersebut diproses lebih lanjut.

### 2. 💡 Mengapa Validation Penting?

Tanpa validasi, aplikasi kamu bisa menghadapi masalah serius:

- **Data Rusak:** User bisa mengirim data yang tidak sesuai format
- **Serangan Keamanan:** Hacker bisa menyuntikkan kode berbahaya
- **Error Sistem:** Aplikasi bisa crash karena data yang tidak sesuai
- **Data Tidak Konsisten:** Database bisa terisi data yang tidak valid

### 3. 🛡️ Cara Kerja Validation di Laravel

```
User → Kirim Data → [Laravel Validation] → Data Valid? → Ya → Proses Data
                                        ↓ Tidak
                                    Kembalikan Error
```

---

## Bagian 2: Metode Validation di Laravel 🔧

### 4. 🚀 Quick Validation dengan Method validate()

Cara paling cepat dan mudah:

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|unique:posts|max:255',
        'body' => 'required',
        'publish_at' => 'nullable|date|after:tomorrow'
    ]);
    
    // Data sudah divalidasi, aman untuk digunakan
    Post::create($validated);
    
    return redirect('/posts')->with('success', 'Post created successfully!');
}
```

### 5. 📦 Form Request Validation (Recommended)

Untuk validasi yang kompleks dan reusable:

```bash
php artisan make:request StorePostRequest
```

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Ubah menjadi false jika perlu otorisasi
    }
    
    public function rules(): array
    {
        return [
            'title' => 'required|unique:posts|max:255',
            'body' => 'required|min:10',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id'
        ];
    }
    
    public function messages(): array
    {
        return [
            'title.required' => 'Judul wajib diisi!',
            'title.unique' => 'Judul sudah digunakan!',
            'body.required' => 'Konten tidak boleh kosong!',
            'body.min' => 'Konten minimal 10 karakter!'
        ];
    }
}
```

**Penggunaan di controller:**
```php
public function store(StorePostRequest $request)
{
    $validated = $request->validated();
    Post::create($validated);
    
    return redirect('/posts')->with('success', 'Post created successfully!');
}
```

### 6. ⚙️ Manual Validation dengan Validator Class

Untuk kontrol penuh:

```php
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'title' => 'required|unique:posts|max:255',
        'body' => 'required|min:10'
    ], [
        'title.required' => 'Judul wajib diisi!',
        'body.required' => 'Konten tidak boleh kosong!'
    ]);
    
    if ($validator->fails()) {
        return redirect('/posts/create')
            ->withErrors($validator)
            ->withInput();
    }
    
    $validated = $validator->validated();
    Post::create($validated);
    
    return redirect('/posts')->with('success', 'Post created successfully!');
}
```

---

## Bagian 3: Implementasi Validasi Langkah demi Langkah 👨‍💻

### 7. 🏗️ Membuat Sistem Validasi Lengkap

Mari kita buat contoh lengkap sistem validasi untuk form registrasi user:

```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function create(): View
    {
        return view('users.create');
    }
    
    public function store(Request $request): RedirectResponse
    {
        // Validasi data input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'age' => 'required|integer|min:13|max:120',
            'phone' => 'nullable|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:15',
            'bio' => 'nullable|string|max:1000',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // 2MB max
            'terms' => 'accepted' // Harus disetujui
        ], [
            // Pesan error kustom
            'name.required' => 'Nama wajib diisi!',
            'email.required' => 'Email wajib diisi!',
            'email.unique' => 'Email sudah digunakan!',
            'password.confirmed' => 'Konfirmasi password tidak cocok!',
            'age.min' => 'Usia minimal 13 tahun!',
            'phone.regex' => 'Format nomor telepon tidak valid!',
            'avatar.image' => 'File harus berupa gambar!',
            'avatar.max' => 'Ukuran gambar maksimal 2MB!',
            'terms.accepted' => 'Anda harus menyetujui syarat dan ketentuan!'
        ]);
        
        // Proses avatar jika ada
        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars');
        }
        
        // Buat user baru
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'age' => $validated['age'],
            'phone' => $validated['phone'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'avatar' => $avatarPath
        ]);
        
        return redirect('/users')->with('success', 'User registered successfully!');
    }
}
```

### 8. 🎨 View dengan Error Display

```blade
<!-- resources/views/users/create.blade.php -->
@extends('layouts.app')

@section('title', 'Register User')

@section('content')
<div class="container">
    <h1>Register New User</h1>
    
    {{-- Tampilkan semua error --}}
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
        
        <div class="form-group">
            <label for="name">Name *</label>
            <input type="text" 
                   class="form-control @error('name') is-invalid @enderror" 
                   id="name" 
                   name="name" 
                   value="{{ old('name') }}" 
                   required>
            @error('name')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        
        <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" 
                   class="form-control @error('email') is-invalid @enderror" 
                   id="email" 
                   name="email" 
                   value="{{ old('email') }}" 
                   required>
            @error('email')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        
        <div class="form-group">
            <label for="password">Password *</label>
            <input type="password" 
                   class="form-control @error('password') is-invalid @enderror" 
                   id="password" 
                   name="password" 
                   required>
            @error('password')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        
        <div class="form-group">
            <label for="password_confirmation">Confirm Password *</label>
            <input type="password" 
                   class="form-control" 
                   id="password_confirmation" 
                   name="password_confirmation" 
                   required>
        </div>
        
        <div class="form-group">
            <label for="age">Age *</label>
            <input type="number" 
                   class="form-control @error('age') is-invalid @enderror" 
                   id="age" 
                   name="age" 
                   value="{{ old('age') }}" 
                   min="13" 
                   max="120" 
                   required>
            @error('age')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        
        <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" 
                   class="form-control @error('phone') is-invalid @enderror" 
                   id="phone" 
                   name="phone" 
                   value="{{ old('phone') }}">
            @error('phone')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        
        <div class="form-group">
            <label for="bio">Biography</label>
            <textarea class="form-control @error('bio') is-invalid @enderror" 
                      id="bio" 
                      name="bio" 
                      rows="3">{{ old('bio') }}</textarea>
            @error('bio')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        
        <div class="form-group">
            <label for="avatar">Avatar</label>
            <input type="file" 
                   class="form-control-file @error('avatar') is-invalid @enderror" 
                   id="avatar" 
                   name="avatar">
            @error('avatar')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        
        <div class="form-check mb-3">
            <input type="checkbox" 
                   class="form-check-input @error('terms') is-invalid @enderror" 
                   id="terms" 
                   name="terms" 
                   value="1">
            <label class="form-check-label" for="terms">
                I agree to the terms and conditions *
            </label>
            @error('terms')
                <div class="invalid-feedback d-block">{{ $message }}</div>
            @enderror
        </div>
        
        <button type="submit" class="btn btn-primary">Register</button>
        <a href="{{ route('users.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection
```

---

## Bagian 4: Validasi Lanjutan 🚀

### 9. 🎯 Validasi Kondisional

```php
// Validasi hanya jika kondisi tertentu terpenuhi
public function rules(): array
{
    return [
        'has_car' => 'required|boolean',
        'car_model' => 'required_if:has_car,1|string|max:255',
        'car_year' => 'required_if:has_car,1|integer|min:1900|max:' . date('Y'),
        
        // Exclude field jika kondisi tertentu
        'temporary_password' => 'exclude_if:change_password,false|required|string|min:8',
        
        // Validasi hanya jika field ada
        'optional_email' => 'sometimes|required|email|unique:users,email'
    ];
}
```

### 10. 📊 Validasi Array dan Nested Data

```php
// Validasi array data
public function rules(): array
{
    return [
        'users' => 'required|array|min:1',
        'users.*.name' => 'required|string|max:255',
        'users.*.email' => 'required|email|unique:users,email',
        'users.*.age' => 'required|integer|min:13|max:120',
        
        // Validasi nested object
        'address.street' => 'required|string|max:255',
        'address.city' => 'required|string|max:100',
        'address.postal_code' => 'required|string|regex:/^[0-9]{5}$/',
        
        // Validasi array associative
        'metadata' => 'array',
        'metadata.key' => 'string',
        'metadata.value' => 'string'
    ];
}
```

### 11. 📁 Validasi File dan Gambar

```php
public function rules(): array
{
    return [
        // Validasi file dasar
        'document' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10MB
        
        // Validasi gambar
        'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        
        // Validasi dimensi gambar
        'banner' => 'required|image|dimensions:min_width=100,min_height=100,ratio=16/9',
        
        // Validasi file dengan File facade (Laravel 9+)
        'attachment' => [
            'required',
            \Illuminate\Validation\Rules\File::types(['mp3', 'wav'])
                ->min(1024)  // 1KB min
                ->max(12 * 1024) // 12MB max
        ],
        
        // Validasi gambar dengan File facade
        'photo' => [
            'required',
            \Illuminate\Validation\Rules\File::image()
                ->dimensions(\Illuminate\Validation\Rules\Dimensions::ratio('16/9'))
                ->max(12 * 1024)
        ]
    ];
}
```

### 12. 🔐 Validasi Password

```php
use Illuminate\Validation\Rules\Password;

public function rules(): array
{
    return [
        'password' => [
            'required',
            'string',
            'confirmed',
            Password::min(8)
                ->letters()      // Minimal ada huruf
                ->mixedCase()    // Campuran huruf besar dan kecil
                ->numbers()      // Minimal ada angka
                ->symbols()      // Minimal ada simbol
                ->uncompromised() // Tidak ada dalam daftar password bocor
        ],
        
        // Password untuk current user (saat update)
        'current_password' => 'required|current_password'
    ];
}
```

---

## Bagian 5: Validasi AJAX dan API 🌐

### 13. 📡 Validasi API Response

Untuk request AJAX/API, Laravel secara otomatis mengembalikan JSON error:

```php
// Controller untuk API
public function apiStore(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users'
    ]);
    
    $user = User::create($validated);
    
    return response()->json([
        'message' => 'User created successfully',
        'user' => $user
    ], 201);
}

// Response error otomatis (422 Unprocessable Entity):
{
    "message": "The given data was invalid.",
    "errors": {
        "name": ["The name field is required."],
        "email": ["The email has already been taken."]
    }
}
```

### 14. 🔄 Custom AJAX Validation

```javascript
// resources/js/validation.js
async function validateForm(formElement) {
    const formData = new FormData(formElement);
    
    try {
        const response = await fetch('/api/validate', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            
            // Tampilkan error di form
            displayErrors(errorData.errors);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Validation error:', error);
        return false;
    }
}

function displayErrors(errors) {
    // Hapus error sebelumnya
    document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    
    // Tampilkan error baru
    Object.keys(errors).forEach(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.add('is-invalid');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.textContent = errors[fieldName][0];
            
            field.parentNode.appendChild(errorDiv);
        }
    });
}
```

---

## Bagian 6: Custom Validation Rules 🛠️

### 15. 🏗️ Membuat Custom Validation Rule

```bash
php artisan make:rule Uppercase
```

```php
<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Uppercase implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (strtoupper($value) !== $value) {
            $fail('The :attribute must be uppercase.');
        }
    }
}
```

**Penggunaan:**
```php
public function rules(): array
{
    return [
        'code' => ['required', new Uppercase],
        'title' => 'required|string|max:255'
    ];
}
```

### 16. ⚡ Custom Validation dengan Closure

```php
public function rules(): array
{
    return [
        'username' => [
            'required',
            'string',
            'max:255',
            function ($attribute, $value, $fail) {
                if (preg_match('/[^a-zA-Z0-9_]/', $value)) {
                    $fail('Username hanya boleh mengandung huruf, angka, dan underscore.');
                }
                
                if (strlen($value) < 3) {
                    $fail('Username minimal 3 karakter.');
                }
            }
        ],
        
        'domain' => [
            'required',
            'string',
            function ($attribute, $value, $fail) {
                if (!checkdnsrr($value, 'A')) {
                    $fail('Domain tidak valid atau tidak aktif.');
                }
            }
        ]
    ];
}
```

### 17. 🧪 Custom Validation dengan Database

```php
use Illuminate\Validation\Rule;

public function rules(): array
{
    return [
        'email' => [
            'required',
            'email',
            Rule::unique('users')->where(function ($query) {
                return $query->where('status', '!=', 'deleted');
            })
        ],
        
        'role' => [
            'required',
            Rule::in(['admin', 'editor', 'viewer']),
            function ($attribute, $value, $fail) {
                // Validasi tambahan berdasarkan user yang login
                if (auth()->user()->role !== 'admin' && $value === 'admin') {
                    $fail('Hanya admin yang bisa membuat admin baru.');
                }
            }
        ]
    ];
}
```

---

## Bagian 7: Advanced Validation Techniques 🧠

### 18. 🔄 Validasi Dinamis

```php
public function rules(): array
{
    $rules = [
        'name' => 'required|string|max:255',
        'email' => 'required|email'
    ];
    
    // Tambahkan rule berdasarkan kondisi
    if ($this->isUpdating()) {
        $rules['email'] .= '|unique:users,email,' . $this->user->id;
    } else {
        $rules['email'] .= '|unique:users';
        $rules['password'] = 'required|string|min:8|confirmed';
    }
    
    // Validasi kondisional
    if ($this->has('subscription_type')) {
        $rules['subscription_type'] = 'required|in:basic,premium,enterprise';
        
        if ($this->subscription_type === 'premium') {
            $rules['billing_address'] = 'required|string';
        }
    }
    
    return $rules;
}

private function isUpdating(): bool
{
    return $this->method() === 'PUT' || $this->method() === 'PATCH';
}
```

### 19. 📋 Validasi dengan Custom Attributes

```php
public function attributes(): array
{
    return [
        'email' => 'alamat email',
        'password' => 'kata sandi',
        'password_confirmation' => 'konfirmasi kata sandi',
        'first_name' => 'nama depan',
        'last_name' => 'nama belakang'
    ];
}

public function messages(): array
{
    return [
        'required' => ':attribute wajib diisi!',
        'email' => ':attribute tidak valid!',
        'unique' => ':attribute sudah digunakan!',
        'confirmed' => ':attribute tidak cocok!',
        'min' => ':attribute minimal :min karakter!',
        'max' => ':attribute maksimal :max karakter!'
    ];
}
```

### 20. 🧩 Validasi dengan Rule Objects

```bash
php artisan make:rule PhoneNumber
```

```php
<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class PhoneNumber implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Hapus semua karakter non-digit
        $cleanNumber = preg_replace('/[^0-9]/', '', $value);
        
        // Validasi format Indonesia
        if (!preg_match('/^0[0-9]{9,12}$/', $cleanNumber) && 
            !preg_match('/^\+62[0-9]{9,12}$/', $cleanNumber)) {
            $fail('Nomor telepon tidak valid. Gunakan format 08xxxxxxxxx atau +628xxxxxxxxx');
        }
        
        // Validasi panjang
        if (strlen($cleanNumber) < 10 || strlen($cleanNumber) > 13) {
            $fail('Nomor telepon harus terdiri dari 10-13 digit');
        }
    }
}
```

---

## Bagian 8: Error Handling dan User Experience ✨

### 21. 🎨 Menampilkan Error dengan Baik

```blade
{{-- resources/views/partials/form-errors.blade.php --}}
@if ($errors->any())
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <h4 class="alert-heading">Oops! Ada beberapa kesalahan:</h4>
        <ul class="mb-0">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
@endif

{{-- Untuk error field spesifik --}}
@error('field_name')
    <div class="invalid-feedback d-block">
        <i class="fas fa-exclamation-circle"></i> {{ $message }}
    </div>
@enderror

{{-- Real-time validation feedback --}}
<div class="form-group">
    <label for="email">Email</label>
    <input type="email" 
           class="form-control @error('email') is-invalid @enderror {{ $errors->any() ? '' : ($errors->has('email') ? 'is-valid' : '') }}" 
           id="email" 
           name="email" 
           value="{{ old('email') }}">
    @error('email')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
    @if (!$errors->has('email') && $errors->any())
        <div class="valid-feedback">Looks good!</div>
    @endif
</div>
```

### 22. 📱 Validasi dengan Flash Messages

```php
// Di controller
public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users'
        ]);
        
        User::create($validated);
        
        return redirect('/users')->with('success', 'User berhasil ditambahkan!');
        
    } catch (\Illuminate\Validation\ValidationException $e) {
        return redirect('/users/create')
            ->withErrors($e->errors())
            ->withInput()
            ->with('error', 'Mohon perbaiki kesalahan berikut:');
    }
}
```

---

## Bagian 9: Best Practices & Tips ✅

### 23. 📋 Best Practices untuk Validation

1. **Gunakan Form Request untuk validasi kompleks:**
```php
// ✅ Benar
php artisan make:request StoreUserRequest

// ❌ Hindari validasi inline yang kompleks
$request->validate([...banyak rules...]);
```

2. **Gunakan pesan error yang user-friendly:**
```php
public function messages(): array
{
    return [
        'email.required' => 'Alamat email wajib diisi!',
        'email.unique' => 'Email ini sudah terdaftar!',
        'password.min' => 'Kata sandi minimal 8 karakter!'
    ];
}
```

3. **Validasi di sisi client juga (tapi jangan hanya client-side):**
```javascript
// Validasi dasar di frontend untuk UX
document.getElementById('email').addEventListener('blur', function() {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        this.classList.add('is-invalid');
        // Tampilkan pesan error
    } else {
        this.classList.remove('is-invalid');
    }
});
```

### 24. 💡 Tips dan Trik Berguna

```php
// Gunakan when() untuk validasi kondisional
$rules = [
    'name' => 'required|string|max:255'
];

$rules = array_merge($rules, $request->when(
    $request->user()->isAdmin(),
    fn() => ['role' => 'required|in:admin,editor,user'],
    fn() => []
));

// Gunakan Rule facade untuk validasi kompleks
use Illuminate\Validation\Rule;

$rules = [
    'status' => [
        'required',
        Rule::in(['draft', 'published', 'archived']),
        Rule::notIn(['deleted']) // Tidak boleh deleted
    ],
    
    'email' => [
        'required',
        'email',
        Rule::unique('users')->ignore($user->id),
        Rule::when(
            $user->organization_id,
            Rule::exists('organizations', 'id')->where('id', $user->organization_id)
        )
    ]
];

// Validasi dengan kondisi database
'email' => [
    'required',
    'email',
    Rule::unique('users')->where(function ($query) {
        return $query->where('organization_id', auth()->user()->organization_id)
                    ->whereNull('deleted_at');
    })
]
```

### 25. 🚨 Kesalahan Umum

1. **Lupa validasi data sensitif:**
```php
// ❌ Berbahaya
Post::create($request->all());

// ✅ Aman
$validated = $request->validate([
    'title' => 'required|string|max:255',
    'content' => 'required|string',
    // Hanya field yang diizinkan
]);
Post::create($validated);
```

2. **Tidak menangani error dengan baik:**
```php
// ❌ Tidak user-friendly
$errors->first('email'); // Pesan generik

// ✅ Lebih deskriptif
$errors->get('email'); // Semua error untuk field email
```

---

## Bagian 10: Contoh Implementasi Lengkap 👨‍💻

### 26. 🏢 Sistem Manajemen Artikel dengan Validasi Komplit

```php
<?php

// app/Http/Requests/StoreArticleRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    
    public function rules(): array
    {
        $rules = [
            'title' => 'required|string|max:255|unique:articles,title',
            'slug' => 'required|string|alpha_dash|max:255|unique:articles,slug',
            'content' => 'required|string|min:50',
            'excerpt' => 'nullable|string|max:300',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'array|max:10',
            'tags.*' => 'exists:tags,id',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg|max:3072', // 3MB
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'publish_at' => 'nullable|date|after:now',
            'meta_title' => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
            'allow_comments' => 'boolean'
        ];
        
        // Aturan tambahan untuk update
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['title'] = 'required|string|max:255|unique:articles,title,' . $this->article->id;
            $rules['slug'] = 'required|string|alpha_dash|max:255|unique:articles,slug,' . $this->article->id;
        }
        
        return $rules;
    }
    
    public function messages(): array
    {
        return [
            'title.required' => 'Judul artikel wajib diisi!',
            'title.unique' => 'Judul artikel sudah digunakan!',
            'slug.required' => 'Slug wajib diisi!',
            'slug.alpha_dash' => 'Slug hanya boleh mengandung huruf, angka, dash, dan underscore!',
            'content.required' => 'Konten artikel tidak boleh kosong!',
            'content.min' => 'Konten artikel minimal 50 karakter!',
            'category_id.required' => 'Kategori wajib dipilih!',
            'category_id.exists' => 'Kategori tidak valid!',
            'featured_image.image' => 'File harus berupa gambar!',
            'featured_image.max' => 'Ukuran gambar maksimal 3MB!',
            'status.required' => 'Status artikel wajib dipilih!',
            'publish_at.after' => 'Tanggal publish harus di masa depan!'
        ];
    }
    
    public function attributes(): array
    {
        return [
            'title' => 'judul',
            'slug' => 'slug',
            'content' => 'konten',
            'category_id' => 'kategori',
            'featured_image' => 'gambar utama',
            'status' => 'status',
            'publish_at' => 'tanggal publish'
        ];
    }
}
```

```php
<?php

// app/Http/Controllers/ArticleController.php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class ArticleController extends Controller
{
    public function index(): View
    {
        $articles = Article::with('category')->latest()->paginate(15);
        return view('articles.index', compact('articles'));
    }
    
    public function create(): View
    {
        return view('articles.create');
    }
    
    public function store(StoreArticleRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        
        // Proses upload gambar
        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('articles');
        }
        
        // Tambahkan user_id
        $validated['user_id'] = auth()->id();
        
        $article = Article::create($validated);
        
        // Sinkronisasi tags
        if (isset($validated['tags'])) {
            $article->tags()->sync($validated['tags']);
        }
        
        return redirect()->route('articles.index')
            ->with('success', 'Artikel berhasil dibuat!');
    }
    
    public function edit(Article $article): View
    {
        return view('articles.edit', compact('article'));
    }
    
    public function update(UpdateArticleRequest $request, Article $article): RedirectResponse
    {
        $validated = $request->validated();
        
        // Proses upload gambar jika ada
        if ($request->hasFile('featured_image')) {
            // Hapus gambar lama jika ada
            if ($article->featured_image) {
                \Storage::delete($article->featured_image);
            }
            $validated['featured_image'] = $request->file('featured_image')->store('articles');
        }
        
        $article->update($validated);
        
        // Sinkronisasi tags
        if (isset($validated['tags'])) {
            $article->tags()->sync($validated['tags']);
        }
        
        return redirect()->route('articles.index')
            ->with('success', 'Artikel berhasil diperbarui!');
    }
    
    public function destroy(Article $article): RedirectResponse
    {
        // Hapus gambar jika ada
        if ($article->featured_image) {
            \Storage::delete($article->featured_image);
        }
        
        $article->delete();
        
        return redirect()->route('articles.index')
            ->with('success', 'Artikel berhasil dihapus!');
    }
}
```

---

## Bagian 11: Cheat Sheet & Referensi Cepat 📚

### 🧩 Metode Validasi
```
$request->validate([...])         → Quick validation
Form Request                      → Reusable validation
Validator::make([...])            → Manual validation
```

### 📋 Rules Umum
```
required                          → Wajib diisi
string                            → Harus string
integer                           → Harus angka bulat
numeric                           → Bisa angka desimal
email                             → Format email valid
unique:table,column               → Unik di database
exists:table,column               → Harus ada di database
max:value                         → Maksimal nilai/panjang
min:value                         → Minimal nilai/panjang
between:min,max                   → Antara nilai tertentu
```

### 📝 Validasi String
```
alpha                             → Hanya huruf
alpha_dash                        → Huruf, angka, -, _
alpha_num                         → Huruf dan angka
confirmed                         → Harus cocok dengan _confirmation
regex:pattern                     → Harus cocok dengan regex
lowercase / uppercase             → Format huruf
```

### 🔢 Validasi Angka
```
digits:value                      → Jumlah digit tertentu
digits_between:min,max            → Jumlah digit antara
gt:field                          → Lebih besar dari field lain
lt:field                          → Lebih kecil dari field lain
gte:field                         → Lebih besar sama dengan
lte:field                         → Lebih kecil sama dengan
```

### 📁 Validasi File
```
file                              → Harus file
image                             → Harus gambar
mimes:jpeg,png,jpg                → Ekstensi file
max:size                          → Ukuran maksimal (KB)
dimensions:min_width=100          → Dimensi gambar
```

### 📅 Validasi Tanggal
```
date                              → Format tanggal valid
date_format:Y-m-d                 → Format tertentu
after:date                        → Setelah tanggal
before:date                       → Sebelum tanggal
after_or_equal:date               → Setelah atau sama
before_or_equal:date              → Sebelum atau sama
```

### 🛡️ Validasi Kondisional
```
required_if:field,value          → Wajib jika field=value
required_unless:field,value       → Wajib kecuali field=value
required_with:field1,field2       → Wajib jika field ada
required_without:field            → Wajib jika field tidak ada
```

### 🎯 Validasi Array
```
array                             → Harus array
size:value                        → Jumlah elemen
min:value                         → Minimal elemen
max:value                         → Maksimal elemen
distinct                          → Semua elemen unik
*.field                           → Validasi elemen array
```

### 🏗️ Custom Validation
```
Rule::unique('table')->ignore($id) → Unique dengan pengecualian
Rule::exists('table')             → Exists dengan kondisi
Rule::in([...])                  → Dalam daftar
Rule::notIn([...])               → Tidak dalam daftar
Rule::when(condition, rules)     → Validasi kondisional
```

### 🎨 Error Handling
```
$errors->any()                    → Ada error?
$errors->first('field')          → Error pertama field
$errors->get('field')            → Semua error field
$errors->all()                    → Semua error
old('field')                      → Input lama
```

### 💡 Tips Cepat
```
@error('field') ... @enderror     → Tampilkan error Blade
withInput()                       → Simpan input lama
withErrors($validator)            → Simpan error
validated()                       → Data yang sudah divalidasi
```

---

## 12. 🎯 Kesimpulan

Validation adalah sistem penting dalam aplikasi Laravel yang memastikan:

- **Data yang masuk adalah valid dan aman**
- **Aplikasi terhindar dari error dan serangan**
- **User mendapat feedback yang jelas dan membantu**
- **Database tetap konsisten dan terstruktur**

Dengan memahami konsep berikut:

- **Berbagai metode validasi** (quick, form request, manual)
- **Rules bawaan Laravel** yang lengkap
- **Custom validation** untuk kebutuhan spesifik
- **Error handling** yang user-friendly
- **Best practices** untuk pengalaman pengguna yang baik

Kamu sekarang siap membuat aplikasi Laravel yang aman, valid, dan menyenangkan digunakan. Ingat selalu bahwa validasi adalah benteng pertahanan pertama dalam aplikasi kamu - semakin baik validasinya, semakin aman aplikasimu.

Selamat mengembangkan aplikasi kamu, muridku! Dengan kuasai validation, kamu sudah melangkah jauh dalam membuat aplikasi web yang profesional dan aman.
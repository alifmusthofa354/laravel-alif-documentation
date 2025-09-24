# 🎨 Blade Templates di Laravel - Panduan Lengkap untuk Pemula

Hai muridku yang hebat! Hari ini kita akan belajar tentang **Blade Templates** di Laravel - sebuah sistem templating yang sangat kuat dan fleksibel. Seperti biasa, aku akan menjelaskan semuanya dengan bahasa yang mudah dan contoh kode yang bisa kamu coba sendiri.

---

## Bagian 1: Memahami Konsep Dasar Blade 🎯

### 1. 📖 Apa Itu Blade dan Kenapa Penting?

**Analogi Sederhana:** Bayangkan kamu seorang arsitek dan kamu punya template rumah yang bisa kamu gunakan berulang-ulang. Setiap rumah mungkin memiliki dinding, atap, dan jendela yang sama, tapi warnanya atau perabotannya bisa berbeda-beda. **Blade adalah template rumahmu**, dan data yang kamu kirim adalah perabotannya.

**Blade** adalah templating engine bawaan Laravel yang sangat kuat karena:

- **Sederhana tapi lengkap** - Mudah dipelajari tapi menawarkan fitur kompleks
- **Aman dari XSS** - Secara otomatis melindungi dari serangan cross-site scripting
- **Cepat & efisien** - Tidak menambah overhead karena dikompilasi ke PHP murni
- **Dapat digunakan ulang** - Dengan components dan layouts

**Struktur Dasar:**
- File Blade memiliki ekstensi `.blade.php`
- Disimpan di direktori `resources/views/`

### 2. 💡 Contoh Sederhana untuk Pemula

Mari kita mulai dengan contoh sederhana untuk memahami konsep dasar:

**Langkah 1:** Buat file view di `resources/views/welcome.blade.php`
```blade
<!DOCTYPE html>
<html>
<head>
    <title>Selamat Datang</title>
</head>
<body>
    <h1>Halo, {{ $name }}!</h1>
    <p>Ini adalah tampilan pertamamu di Laravel dengan Blade!</p>
</body>
</html>
```

**Langkah 2:** Buat route di `routes/web.php`
```php
Route::get('/', function () {
    return view('welcome', ['name' => 'Andi']);
});
```

**Apa yang terjadi:**
- User mengakses `/`
- Route mengembalikan view `welcome`
- View menerima data `['name' => 'Andi']`
- Blade merender `{{ $name }}` menjadi `Andi`
- Hasil HTML ditampilkan ke browser

---

## Bagian 2: Menampilkan Data dengan Aman dalam Blade 📤

### 3. 🌍 Menampilkan Data dengan Escaping (Aman)

Blade secara otomatis melindungi dari serangan XSS dengan meng-escape output:

```blade
<!-- resources/views/user.blade.php -->
<h1>Nama: {{ $user->name }}</h1>
<p>Email: {{ $user->email }}</p>
<p>Deskripsi: {{ $user->description }}</p>
```

**Kelebihan:**
- Otomatis menggunakan `htmlspecialchars()`
- Mencegah XSS attack
- Tidak perlu manual escaping

### 4. ❗ Menampilkan Data Tanpa Escaping (Perlu Hati-hati)

Jika kamu yakin konten aman dan ingin menampilkan HTML mentah:

```blade
<!-- Hanya untuk konten yang sudah difilter -->
<div>{!! $trustedHtml !!}</div>

<!-- Lebih aman: filter dulu -->
<div>{!! e($untrustedHtml) !!}</div>
```

**peringatan:** Hanya gunakan ini untuk konten yang kamu yakini aman!

### 5. 📊 Menampilkan Data Kompleks

```blade
<!-- Array dan objek -->
<p>Total pengguna: {{ count($users) }}</p>
<p>Terakhir login: {{ $user->last_login->format('d M Y') }}</p>

<!-- Conditional dengan ternary -->
<p>Status: {{ $user->isActive() ? 'Aktif' : 'Tidak Aktif' }}</p>

<!-- Null coalescing untuk menghindari error -->
<p>Nama: {{ $user->name ?? 'Tidak Diketahui' }}</p>
```

---

## Bagian 3: Blade Directives - Struktur Kendali yang Kuat 🔁

### 6. 🧠 Directives Percabangan

Blade menyediakan direktif untuk kontrol alur program:

```blade
<!-- If-Else statement -->
@if ($user->isAdmin())
    <p>Anda adalah administrator</p>
@elseif ($user->isEditor())
    <p>Anda adalah editor</p>
@else
    <p>Anda adalah pengguna biasa</p>
@endif

<!-- Unless - kebalikan dari if -->
@unless ($user->isVerified())
    <p>Silakan verifikasi email Anda</p>
@endunless

<!-- Isset dan empty -->
@isset($user->phone)
    <p>Telepon: {{ $user->phone }}</p>
@endisset

@empty($posts)
    <p>Belum ada postingan.</p>
@endempty
```

### 7. 🔐 Authentication Directives

Memeriksa status otentikasi pengguna:

```blade
<!-- Cek apakah user login -->
@auth
    <p>Halo, {{ Auth::user()->name }}!</p>
    <a href="/logout">Logout</a>
@endauth

@guest
    <a href="/login">Login</a>
    <a href="/register">Register</a>
@endguest

<!-- Cek dengan guard tertentu -->
@auth('admin')
    <p>Anda adalah admin</p>
@endauth

@guest('admin')
    <p>Halaman ini hanya untuk admin</p>
@endguest
```

### 8. 🌍 Environment Directives

Menampilkan konten berdasarkan environment:

```blade
<!-- Hanya tampil di production -->
@production
    <script src="https://analytics.example.com/script.js"></script>
@endproduction

<!-- Hanya tampil di local -->
@env('local')
    <div class="debug-panel">Debug mode aktif</div>
@endenv

<!-- Multiple environment -->
@env(['staging', 'production'])
    <p>Fitur ini aktif di staging dan production</p>
@endenv
```

### 9. 🔄 Directives Perulangan

```blade
<!-- Foreach loop -->
<ul>
@foreach ($users as $user)
    <li>{{ $user->name }}</li>
@endforeach
</ul>

<!-- Foreach dengan empty state -->
@forelse ($posts as $post)
    <article>
        <h3>{{ $post->title }}</h3>
        <p>{{ $post->content }}</p>
    </article>
@empty
    <p>Belum ada postingan.</p>
@endforelse

<!-- For loop -->
@for ($i = 0; $i < 5; $i++)
    <p>Angka: {{ $i }}</p>
@endfor

<!-- While loop -->
@php $counter = 0; @endphp
@while ($counter < 3)
    <p>Perulangan ke-{{ ++$counter }}</p>
@endwhile
```

### 10. 🎲 Switch Statement

```blade
@switch($status)
    @case('pending')
        <span class="badge badge-warning">Menunggu</span>
        @break
    @case('approved')
        <span class="badge badge-success">Disetujui</span>
        @break
    @case('rejected')
        <span class="badge badge-danger">Ditolak</span>
        @break
    @default
        <span class="badge badge-secondary">Status tidak diketahui</span>
@endswitch
```

### 11. 🔁 Menggunakan Variabel $loop

Di dalam foreach, kamu bisa mengakses informasi iterasi:

```blade
@foreach ($users as $user)
    <!-- Iterasi pertama atau terakhir -->
    @if ($loop->first)
        <div class="first-user">
    @endif
    
    <div class="user-item">
        <span>{{ $loop->iteration }}. {{ $user->name }}</span>
        <span>Sisa: {{ $loop->remaining }} item</span>
    </div>
    
    @if ($loop->last)
        </div> <!-- tutup first-user -->
    @endif
@endforeach

<!-- Nested loop -->
@foreach ($categories as $category)
    <h3>{{ $category->name }}</h3>
    @foreach ($category->products as $product)
        <!-- Akses loop parent -->
        <p>Product dalam kategori {{ $loop->parent->iteration }}: {{ $product->name }}</p>
    @endforeach
@endforeach
```

---

## Bagian 4: Conditional Classes & Attributes - Styling Dinamis 🎨

### 12. 🎨 Conditional CSS Classes

Blade menyediakan direktif `@class` untuk mengelola kelas CSS secara kondisional:

```blade
@php
    $isActive = true;
    $hasError = false;
    $theme = 'dark';
@endphp

<div @class([
    'p-4',
    'bg-blue-500' => $isActive,
    'text-white' => $isActive,
    'border-red-500' => $hasError,
    'bg-gray-800' => $theme === 'dark',
    'rounded-lg' => true, // selalu aktif
])>
    Konten dengan kelas dinamis
</div>

<!-- Contoh dengan data model -->
<button @class([
    'btn',
    'btn-primary' => $user->isActive(),
    'btn-warning' => $user->isPending(),
    'btn-danger' => $user->isSuspended(),
    'disabled' => !$user->canEdit()
])>
    Edit User
</button>
```

### 13. 🎨 Conditional Inline Styles

```blade
@php
    $isHighlighted = true;
    $fontSize = '16px';
@endphp

<span @style([
    'color: red',
    'font-weight: bold' => $isHighlighted,
    'font-size: ' . $fontSize,
    'background-color: yellow' => $isHighlighted,
])>
    Teks dengan style kondisional
</span>
```

### 14. 📋 HTML Attribute Directives

Blade menyediakan shortcut untuk atribut HTML umum:

```blade
<!-- Checked attribute -->
<input type="checkbox" @checked($user->isSubscribed())>

<!-- Selected attribute -->
<select>
    <option value="1" @selected(old('category') == 1)>Kategori 1</option>
    <option value="2" @selected(old('category') == 2)>Kategori 2</option>
</select>

<!-- Disabled attribute -->
<button @disabled($form->isLocked())>Submit</button>

<!-- Required attribute -->
<input type="email" @required($user->needsEmail())>

<!-- Readonly attribute -->
<input type="text" @readonly($user->isReadOnly())>
```

---

## Bagian 5: Template Inheritance - Membangun Layout yang Kuat 🏗️

### 15. 🏛️ Dasar Template Inheritance

Template inheritance memungkinkan kamu membuat layout dasar dan mengisinya dengan konten dari halaman lain:

**Layout Dasar (`resources/views/layouts/app.blade.php`):**
```blade
<!DOCTYPE html>
<html>
<head>
    <title>@yield('title', 'Aplikasi Laravel')</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    @yield('styles')
</head>
<body>
    <nav class="navbar">
        <h1>{{ config('app.name') }}</h1>
        <ul>
            <li><a href="/">Beranda</a></li>
            <li><a href="/about">Tentang</a></li>
        </ul>
    </nav>

    <main class="container">
        @yield('content')
    </main>

    <footer>
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}</p>
    </footer>

    <script src="{{ asset('js/app.js') }}"></script>
    @yield('scripts')
</body>
</html>
```

**Halaman Anak (`resources/views/home.blade.php`):**
```blade
@extends('layouts.app')

@section('title', 'Beranda')

@section('styles')
    <link href="{{ asset('css/home.css') }}" rel="stylesheet">
@endsection

@section('content')
    <div class="hero">
        <h1>Selamat Datang di {{ config('app.name') }}</h1>
        <p>Ini adalah halaman beranda.</p>
    </div>
    
    <div class="features">
        @foreach ($features as $feature)
            <div class="feature-item">
                <h3>{{ $feature->title }}</h3>
                <p>{{ $feature->description }}</p>
            </div>
        @endforeach
    </div>
@endsection

@section('scripts')
    <script>
        console.log('Halaman beranda dimuat');
    </script>
@endsection
```

### 16. 🔁 Menggunakan @parent dan @show

```blade
{{-- resources/views/layouts/master.blade.php --}}
@section('sidebar')
    <div class="master-sidebar">
        <p>Menu utama</p>
    </div>
@show

{{-- resources/views/page.blade.php --}}
@extends('layouts.master')

@section('sidebar')
    @parent {{-- Menyertakan konten sidebar dari layout --}}
    <div class="page-sidebar">
        <p>Menu tambahan untuk halaman ini</p>
    </div>
@endsection
```

---

## Bagian 6: Components - Membangun UI yang Dapat Digunakan Ulang 🔧

### 17. 🏗️ Membuat Components

Components adalah elemen UI modular yang bisa digunakan berulang:

```bash
# Membuat component sederhana
php artisan make:component Alert

# Membuat component dengan subfolder
php artisan make:component Forms/Input

# Membuat component inline (tanpa file PHP terpisah)
php artisan make:component Card --inline
```

### 18. 📦 Class-Based Components

**File PHP (`app/View/Components/Alert.php`):**
```php
<?php

namespace App\View\Components;

use Illuminate\View\Component;

class Alert extends Component
{
    public $type;
    public $message;

    public function __construct($type = 'info', $message = '')
    {
        $this->type = $type;
        $this->message = $message;
    }

    public function render()
    {
        return view('components.alert');
    }
}
```

**File Template (`resources/views/components/alert.blade.php`):**
```blade
<div {{ $attributes->merge(['class' => "alert alert-{$type}"]) }}>
    {{ $message }}
    {{ $slot }}
</div>
```

### 19. 🎨 Menggunakan Components

```blade
<!-- Basic usage -->
<x-alert type="success" message="Operasi berhasil!" />

<!-- Dengan slot -->
<x-alert type="warning" class="mb-4">
    <strong>Peringatan!</strong> Harap perhatikan hal ini.
</x-alert>

<!-- Component dengan subfolder -->
<x-forms.input type="email" name="email" placeholder="Email" />

<!-- Component dengan kondisi -->
@auth
    <x-user-menu />
@endauth
```

### 20. 🎭 Anonymous Components

Component tanpa file PHP - hanya file Blade:

**File component (`resources/views/components/button.blade.php`):**
```blade
@props(['type' => 'button', 'variant' => 'primary'])

<button {{ $attributes->merge(['type' => $type, 'class' => "btn btn-{$variant}"]) }}>
    {{ $slot }}
</button>
```

**Menggunakannya:**
```blade
<x-button variant="success">Simpan</x-button>
<x-button variant="danger" class="ml-2">Hapus</x-button>
```

### 21. 🧩 Slots - Konten Fleksibel

```blade
<!-- Component dengan slot default -->
<x-card>
    <h3>Ini adalah header</h3>
    <p>Ini adalah konten dari slot default</p>
</x-card>

<!-- Component dengan named slot -->
<x-modal>
    <x-slot:title>
        Konfirmasi Hapus
    </x-slot>
    
    <x-slot:body>
        <p>Apakah Anda yakin ingin menghapus item ini?</p>
    </x-slot>
    
    <x-slot:footer>
        <button class="btn btn-danger">Hapus</button>
        <button class="btn btn-secondary">Batal</button>
    </x-slot>
</x-modal>
```

### 22. 🧬 Component Attributes

Menggabungkan atribut dari component dan parent:

```blade
<!-- resources/views/components/input.blade.php -->
@props(['type' => 'text', 'name', 'label'])

<div class="form-group">
    <label for="{{ $name }}">{{ $label }}</label>
    <input 
        type="{{ $type }}" 
        name="{{ $name }}" 
        id="{{ $name }}"
        {{ $attributes->merge(['class' => 'form-control']) }}
    >
</div>

<!-- Penggunaan -->
<x-input 
    name="email" 
    label="Email" 
    type="email" 
    class="custom-class" 
    placeholder="masukkan email"
/>
```

---

## Bagian 7: Form Handling - Keamanan dan Validasi 📝

### 23. 🔐 CSRF Protection

CSRF (Cross-Site Request Forgery) protection adalah penting untuk keamanan:

```blade
<!-- Form dengan CSRF token -->
<form method="POST" action="/profile">
    @csrf
    <!-- atau -->
    <input type="hidden" name="_token" value="{{ csrf_token() }}">
    
    <input type="text" name="name">
    <button type="submit">Simpan</button>
</form>

<!-- Method override untuk PUT/PATCH/DELETE -->
<form method="POST" action="/user/1" class="d-inline">
    @csrf
    @method('PUT')
    <button type="submit" class="btn btn-sm btn-primary">Update</button>
</form>
```

### 24. 🚨 Validation Errors Display

Menampilkan error validasi dengan mudah:

```blade
<form method="POST" action="/register">
    @csrf
    
    <div class="form-group">
        <label for="email">Email</label>
        <input 
            type="email" 
            id="email"
            name="email"
            value="{{ old('email') }}"
            class="@error('email') is-invalid @enderror"
        >
        @error('email')
            <div class="invalid-feedback">
                {{ $message }}
            </div>
        @enderror
    </div>
    
    <div class="form-group">
        <label for="name">Nama</label>
        <input 
            type="text" 
            id="name"
            name="name"
            value="{{ old('name') }}"
            class="@error('name') is-invalid @enderror"
        >
        @error('name')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>
    
    <button type="submit">Daftar</button>
</form>
```

### 25. 🧪 Multiple Form Validation

Menggunakan error bag untuk form berbeda di halaman yang sama:

```blade
<!-- resources/views/auth.blade.php -->
<div class="row">
    <div class="col-md-6">
        <!-- Form Login -->
        <form method="POST" action="/login">
            @csrf
            <input type="email" name="email" @error('email', 'login') class="is-invalid" @enderror>
            @error('email', 'login')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
            <button type="submit">Login</button>
        </form>
    </div>
    
    <div class="col-md-6">
        <!-- Form Register -->
        <form method="POST" action="/register">
            @csrf
            <input type="email" name="email" @error('email', 'register') class="is-invalid" @enderror>
            @error('email', 'register')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
            <button type="submit">Register</button>
        </form>
    </div>
</div>
```

---

## Bagian 8: Blade Stacks - Menyisipkan Konten Dinamis 📚

### 26. 🗂️ Mengelola CSS/JS Tambahan

Blade stacks sangat berguna untuk menyisipkan script atau CSS spesifik halaman:

**Layout (`resources/views/layouts/app.blade.php`):**
```blade
<!DOCTYPE html>
<html>
<head>
    <title>@yield('title')</title>
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    @stack('styles')
</head>
<body>
    @yield('content')
    
    <script src="{{ asset('js/app.js') }}"></script>
    @stack('scripts')
</body>
</html>
```

**Halaman dengan konten tambahan (`resources/views/dashboard.blade.php`):**
```blade
@extends('layouts.app')

@section('title', 'Dashboard')

@push('styles')
    <link href="{{ asset('css/dashboard.css') }}" rel="stylesheet">
    <link href="https://cdn.datatables.net/1.11.3/css/dataTables.bootstrap5.min.css" rel="stylesheet">
@endpush

@push('scripts')
    <script src="https://cdn.datatables.net/1.11.3/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.11.3/js/dataTables.bootstrap5.min.js"></script>
    <script>
        $(document).ready(function() {
            $('#dataTable').DataTable();
        });
    </script>
@endpush

@section('content')
    <h1>Dashboard</h1>
    <table id="dataTable" class="table">
        <thead>
            <tr><th>Nama</th><th>Email</th></tr>
        </thead>
        <tbody>
            @foreach($users as $user)
                <tr>
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->email }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endsection
```

### 27. 🔁 Prepend vs Push

```blade
<!-- Di layout -->
<head>
    @stack('head')
</head>

<!-- Di halaman A -->
@push('head')
    <!-- Akan muncul terakhir -->
    <script src="script-a.js"></script>
@endpush

<!-- Di halaman B -->
@prepend('head')
    <!-- Akan muncul pertama -->
    <script src="script-b.js"></script>
@endprepend

<!-- Hasil akhir: -->
<!-- <script src="script-b.js"></script> -->
<!-- <script src="script-a.js"></script> -->
```

---

## Bagian 9: Advanced Features - Fitur-fitur Kuat Lainnya ⚡

### 28. 🔧 Service Injection

Mengakses service langsung dari template:

```blade
<!-- resources/views/dashboard.blade.php -->
@inject('metrics', 'App\Services\MetricsService')

<div class="dashboard-stats">
    <h3>Statistik Bulan Ini</h3>
    <p>Pendapatan: {{ $metrics->monthlyRevenue() }}</p>
    <p>Pengguna Baru: {{ $metrics->newUsersCount() }}</p>
</div>
```

### 29. 🧪 Conditional Directives

```blade
<!-- Cek apakah section ada -->
@hasSection('sidebar')
    <aside class="sidebar">
        @yield('sidebar')
    </aside>
@endif

<!-- Cek apakah section tidak ada -->
@sectionMissing('header')
    @include('partials.default-header')
@endif

<!-- Session check -->
@session('success')
    <div class="alert alert-success">
        {{ $value }}
    </div>
@endsession
```

### 30. 🔀 JavaScript Integration

Mengintegrasikan dengan framework JavaScript:

```blade
<!-- Escape untuk Vue/Angular -->
<div id="app">
    Halo, @{{ name }}!
</div>

<!-- Atau gunakan verbatim untuk blok besar -->
@verbatim
<div id="vue-app">
    <p>Nama: {{ user.name }}</p>
    <p>Email: {{ user.email }}</p>
</div>
@endverbatim

<!-- Mengirim data PHP ke JavaScript -->
<script>
    window.Laravel = {
        csrfToken: '{{ csrf_token() }}',
        user: @json($user),
        notifications: @json($notifications)
    };
</script>

<!-- Atau dengan Js helper -->
<script>
    const app = {{ Js::from($data) }};
</script>
```

### 31. 🧠 Raw PHP dan Fungsi Lainnya

```blade
<!-- Kode PHP langsung -->
@php
    $isActive = true;
    $count = $posts->count();
@endphp

@if($count > 0)
    <p>Ada {{ $count }} postingan</p>
@endif

<!-- Import kelas -->
@use('App\Models\User')
@use('App\Models\{Post, Comment}')

<!-- Import fungsi -->
@use(function App\Helpers\formatCurrency, 'formatMoney')
@use(const App\Constants\MAX_ATTEMPTS, 'MAX_TRIES')

<!-- Komentar (tidak muncul di HTML) -->
{{-- Ini adalah komentar dan tidak akan tampil di browser --}}
```

### 32. 🔄 Inline Blade Rendering

```php
// Di controller
use Illuminate\Support\Facades\Blade;

// Render template langsung dari string
$html = Blade::render('Halo, {{ $name }}!', ['name' => $user->name]);

// Dengan penghapusan cache otomatis
$html = Blade::render(
    'Template: {{ $value }}',
    ['value' => $data],
    deleteCachedView: true
);
```

---

## Bagian 10: Best Practices & Tips ✅

### 33. 📋 Praktik Terbaik untuk Blade

1. **Gunakan Components untuk UI yang Dapat Digunakan Ulang**:
   ```blade
   <!-- Jangan -->
   <div class="alert alert-success">{{ $message }}</div>
   
   <!-- Lebih baik -->
   <x-alert type="success">{{ $message }}</x-alert>
   ```

2. **Gunakan Layout dan Template Inheritance**:
   - Pisahkan struktur dasar dari konten
   - Gunakan sections untuk bagian yang bisa diubah

3. **Hindari Logika Kompleks di View**:
   - Pindahkan logika ke controller atau model
   - Gunakan accessor/mutator untuk transformasi sederhana

4. **Gunakan Escaping Secara Default**:
   - Gunakan `{!! !!}` hanya ketika benar-benar yakin aman

### 34. 💡 Tips dan Trik Berguna

```blade
<!-- Conditional rendering yang elegan -->
{{ $user->name ?? 'Pengguna Baru' }}

<!-- Gunakan @includeWhen dan @includeUnless -->
@includeWhen($user->isAdmin(), 'partials.admin-tools')
@includeUnless($user->isSubscribed(), 'partials.upgrade-notice')

<!-- Gunakan @includeFirst -->
@includeFirst(['custom.alert', 'default.alert'], ['message' => $message])

<!-- Gunakan @once untuk mencegah duplikasi -->
@once
    @push('scripts')
        <script src="unique-script.js"></script>
    @endpush
@endonce
```

---

## Bagian 11: Contoh Implementasi Lengkap 👨‍💻

Mari kita buat contoh aplikasi sederhana dengan berbagai fitur Blade:

**Layout Dasar (`resources/views/layouts/app.blade.php`):**
```blade
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? 'Aplikasi Laravel' }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    @stack('styles')
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="/">{{ config('app.name') }}</a>
            
            <div class="navbar-nav ms-auto">
                @auth
                    <span class="navbar-text me-3">Halo, {{ Auth::user()->name }}</span>
                    <a class="nav-link" href="/logout">Logout</a>
                @else
                    <a class="nav-link" href="/login">Login</a>
                @endauth
            </div>
        </div>
    </nav>

    <div class="container mt-4">
        @if (session('success'))
            <div class="alert alert-success alert-dismissible fade show">
                {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        @yield('content')
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    @stack('scripts')
</body>
</html>
```

**Component Alert (`resources/views/components/alert.blade.php`):**
```blade
@props(['type' => 'info', 'dismissible' => false])

<div {{ $attributes->merge(['class' => "alert alert-{$type}"]) }} role="alert">
    @if ($dismissible)
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    @endif
    
    {{ $slot }}
</div>
```

**Halaman Dashboard (`resources/views/dashboard.blade.php`):**
```blade
@extends('layouts.app')

@section('title', 'Dashboard')

@push('styles')
    <style>
        .stats-card {
            border-left: 4px solid #0d6efd;
        }
    </style>
@endpush

@section('content')
    <div class="row">
        <div class="col-md-12">
            <h1>Dashboard</h1>
            
            <x-alert type="success" dismissible class="mb-4">
                Selamat datang di dashboard!
            </x-alert>
            
            <div class="row">
                @php
                    $stats = [
                        ['title' => 'Pengguna', 'value' => $userCount, 'icon' => 'users', 'color' => 'primary'],
                        ['title' => 'Postingan', 'value' => $postCount, 'icon' => 'file-text', 'color' => 'success'],
                        ['title' => 'Komentar', 'value' => $commentCount, 'icon' => 'message-square', 'color' => 'info'],
                    ];
                @endphp
                
                @foreach ($stats as $stat)
                    <div class="col-md-4 mb-3">
                        <div class="card stats-card">
                            <div class="card-body">
                                <h5 class="card-title">{{ $stat['title'] }}</h5>
                                <h2 class="text-{{ $stat['color'] }}">{{ $stat['value'] }}</h2>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
            
            @if ($recentPosts->count() > 0)
                <div class="card mt-4">
                    <div class="card-header">
                        <h5>Postingan Terbaru</h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-group">
                            @foreach ($recentPosts->take(5) as $post)
                                <li class="list-group-item">
                                    <a href="{{ route('posts.show', $post) }}">{{ $post->title }}</a>
                                    <small class="text-muted">oleh {{ $post->user->name }} - {{ $post->created_at->diffForHumans() }}</small>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            @else
                <x-alert type="secondary" class="mt-4">
                    Belum ada postingan.
                </x-alert>
            @endif
        </div>
    </div>
@endsection
```

**Route:**
```php
// routes/web.php
Route::get('/dashboard', function () {
    $userCount = \App\Models\User::count();
    $postCount = \App\Models\Post::count();
    $commentCount = \App\Models\Comment::count();
    $recentPosts = \App\Models\Post::with('user')->latest()->take(10)->get();
    
    return view('dashboard', compact('userCount', 'postCount', 'commentCount', 'recentPosts'));
})->middleware('auth');
```

---

## 12. 📚 Cheat Sheet & Referensi Cepat

### 🧩 Sintaks Blade Umum
```
{{ $data }}                → Tampilkan data (dengan escaping)
{!! $html !!}              → Tampilkan HTML tanpa escaping  
@{{ raw_data }}            → Tampilkan literal {{ }}
@php /* PHP code */ @endphp → Jalankan PHP
@verbatim ... @endverbatim → Tidak proses isi
```

### 🔁 Struktur Kendali
```
@if / @endif              → Kondisi
@unless / @endunless      → Kebalikan dari if
@isset / @endisset        → Cek apakah variabel ada
@empty / @endempty        → Cek apakah kosong
@foreach / @endforeach     → Perulangan
@forelse / @empty / @endforelse → Perulangan dengan empty state
```

### 🏛️ Template Inheritance
```
@extends('layout')        → Gunakan layout
@section / @endsection     → Definisikan bagian
@yield('section')         → Tampilkan bagian di layout
@parent                   → Sertakan konten dari layout
@hasSection('name')       → Cek apakah section ada
```

### 🔧 Components
```
<x-component-name />       → Gunakan component
<x-component :prop="$value" /> → Kirim data ke component
<x-slot:name>...@endslot   → Named slot
{{ $slot }}               → Default slot
{{ $attributes }}          → Atribut komponen
```

### 🧮 Conditional Classes/Attributes
```
@class([...])             → Kelas CSS kondisional
@style([...])             → Style kondisional
@checked($condition)       → Atribut checked
@selected($condition)      → Atribut selected
@disabled($condition)      → Atribut disabled
```

### 📚 Stacks
```
@push('name') ... @endpush     → Tambahkan ke stack
@prepend('name') ... @endprepend → Tambahkan ke awal stack
@stack('name')                 → Tampilkan stack
```

### 🔐 Forms
```
@csrf                        → CSRF token
@method('PUT')              → Method override
@error('field') ... @enderror → Tampilkan error validasi
```

### 🔧 CLI Commands
```
php artisan make:component Name          → Buat component
php artisan view:clear                   → Hapus cache view
php artisan view:cache                   → Cache semua view
```

---

## 13. 🎯 Kesimpulan

Blade adalah templating engine yang sangat kuat dan fleksibel yang memungkinkan kamu membuat tampilan web yang indah dan dinamis. Dengan memahami konsep berikut:

- **Template inheritance** untuk menyusun layout dengan terstruktur
- **Components** untuk membuat UI yang dapat digunakan ulang
- **Directives** untuk kontrol alur program
- **Security features** untuk perlindungan XSS
- **Stacks** untuk mengelola asset dinamis
- **Conditional attributes** untuk styling fleksibel

Kamu sekarang siap membuat tampilan web profesional dengan Laravel. Ingat selalu untuk menjaga perpisahan antara logika tampilan dan logika aplikasi, serta selalu perhatikan aspek keamanan saat menampilkan data pengguna.

Selamat mengembangkan aplikasi kamu, muridku! Dengan kuasai Blade, kamu sudah melangkah jauh dalam membangun aplikasi web yang indah dan fungsional.
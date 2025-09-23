# 📄 Laravel Folio

Laravel Folio adalah alat inovatif untuk menyajikan halaman web sederhana dalam aplikasi Laravel Anda. Dengan Folio, Anda dapat dengan mudah membuat halaman web statis atau dinamis hanya dengan membuat file Blade di direktori `resources/views/pages` Anda.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Membuat Halaman](#membuat-halaman)
4. [Nested Routes](#nested-routes)
5. [Route Parameters](#route-parameters)
6. [Route Model Binding](#route-model-binding)
7. [Middleware](#middleware)
8. [Frontmatter](#frontmatter)
9. [Named Routes](#named-routes)
10. [Asset Compilation](#asset-compilation)
11. [Static Pages](#static-pages)

## 🎯 Pendahuluan

Laravel Folio adalah package untuk menyajikan halaman web sederhana dalam aplikasi Laravel Anda. Dengan Folio, Anda dapat membuat halaman web hanya dengan membuat file Blade di direktori `resources/views/pages`.

### ✨ Fitur Utama
- Pembuatan halaman dengan mudah melalui file Blade
- Routing otomatis berdasarkan struktur direktori
- Dukungan untuk nested routes
- Route parameters dan model binding
- Middleware per-halaman
- Frontmatter untuk metadata
- Named routes otomatis
- Integrasi dengan Vite untuk asset compilation

### ⚠️ Catatan Penting
Folio dirancang untuk halaman sederhana dan tidak dimaksudkan untuk menggantikan controller Laravel yang penuh fitur untuk logika aplikasi kompleks.

## 📦 Instalasi

### 🎯 Menginstal Folio
Untuk memulai, instal Folio melalui Composer:

```bash
composer require laravel/folio
```

### 🛠️ Publish Configuration (Opsional)
Anda dapat mempublish file konfigurasi Folio jika perlu mengkostumisasi perilakunya:

```bash
php artisan vendor:publish --tag="folio-config"
```

## 📝 Membuat Halaman

### 📄 Halaman Sederhana
Untuk membuat halaman sederhana, buat file Blade di direktori `resources/views/pages`:

```blade
{{-- resources/views/pages/about.blade.php --}}
@extends('layouts.app')

@section('title', 'About Us')

@section('content')
    <h1>About Our Company</h1>
    <p>This is the about page content.</p>
@endsection
```

Halaman ini akan secara otomatis tersedia di route `/about`.

### 🏠 Halaman Home
Untuk membuat halaman home, buat file `index.blade.php`:

```blade
{{-- resources/views/pages/index.blade.php --}}
@extends('layouts.app')

@section('title', 'Home')

@section('content')
    <h1>Welcome to Our Website</h1>
    <p>This is the home page content.</p>
@endsection
```

Halaman ini akan tersedia di route `/`.

### 📁 Struktur Direktori
```
resources/views/pages/
├── index.blade.php          → /
├── about.blade.php          → /about
├── contact.blade.php        → /contact
└── services/
    ├── index.blade.php      → /services
    ├── web-design.blade.php → /services/web-design
    └── seo.blade.php        → /services/seo
```

## 📂 Nested Routes

### 📁 Struktur Nested
Folio secara otomatis menghasilkan nested routes berdasarkan struktur direktori:

```blade
{{-- resources/views/pages/services/web-development.blade.php --}}
@extends('layouts.app')

@section('title', 'Web Development Services')

@section('content')
    <h1>Web Development Services</h1>
    <p>We offer professional web development services.</p>
@endsection
```

Halaman ini akan tersedia di route `/services/web-development`.

### 📋 Nested Directory Structure
```
resources/views/pages/
├── services/
│   ├── index.blade.php
│   ├── web-design.blade.php
│   ├── web-development.blade.php
│   └── seo.blade.php
└── products/
    ├── index.blade.php
    └── software/
        ├── index.blade.php
        └── laravel.blade.php
```

Routes yang dihasilkan:
- `/services` → `services/index.blade.php`
- `/services/web-design` → `services/web-design.blade.php`
- `/services/web-development` → `services/web-development.blade.php`
- `/services/seo` → `services/seo.blade.php`
- `/products` → `products/index.blade.php`
- `/products/software` → `products/software/index.blade.php`
- `/products/software/laravel` → `products/software/laravel.blade.php`

## 🔗 Route Parameters

### 📌 Parameter Dinamis
Untuk membuat route dengan parameter, gunakan tanda kurung siku dalam nama file:

```blade
{{-- resources/views/pages/users/[id].blade.php --}}
@extends('layouts.app')

@section('title', 'User Profile')

@section('content')
    <h1>User Profile</h1>
    <p>User ID: {{ $id }}</p>
@endsection
```

Halaman ini akan tersedia di route `/users/{id}`.

### 📋 Multiple Parameters
```blade
{{-- resources/views/pages/posts/[category]/[slug].blade.php --}}
@extends('layouts.app')

@section('title', 'Blog Post')

@section('content')
    <h1>{{ $category }} - {{ $slug }}</h1>
    <p>This is a blog post in the {{ $category }} category with slug {{ $slug }}.</p>
@endsection
```

Halaman ini akan tersedia di route `/posts/{category}/{slug}`.

## 🔗 Route Model Binding

### 🎯 Model Binding Otomatis
Folio mendukung route model binding otomatis dengan menggunakan nama parameter yang sesuai dengan nama model:

```blade
{{-- resources/views/pages/users/[User].blade.php --}}
@extends('layouts.app')

@section('title', 'User Profile')

@section('content')
    <h1>{{ $user->name }}</h1>
    <p>Email: {{ $user->email }}</p>
@endsection
```

### 📋 Model Binding Kustom
Untuk model binding kustom, Anda dapat menggunakan frontmatter:

```blade
---
<?php
use App\Models\User;

$model = User::where('username', $username)->firstOrFail();
?>
---

@extends('layouts.app')

@section('title', 'User Profile')

@section('content')
    <h1>{{ $model->name }}</h1>
    <p>Username: {{ $model->username }}</p>
@endsection
```

## 🔐 Middleware

### 📋 Middleware Per-Halaman
Anda dapat menetapkan middleware ke halaman tertentu menggunakan frontmatter:

```blade
---
middleware: auth
---

@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
    <h1>Dashboard</h1>
    <p>Welcome to your dashboard, {{ Auth::user()->name }}!</p>
@endsection
```

### 📋 Multiple Middleware
```blade
---
middleware: ['auth', 'verified']
---

@extends('layouts.app')

@section('title', 'Verified Dashboard')

@section('content')
    <h1>Verified Dashboard</h1>
    <p>This page requires authentication and email verification.</p>
@endsection
```

### 📋 Middleware dengan Parameter
```blade
---
middleware: 'role:admin'
---

@extends('layouts.app')

@section('title', 'Admin Panel')

@section('content')
    <h1>Admin Panel</h1>
    <p>This page is only accessible to administrators.</p>
@endsection
```

## 📄 Frontmatter

### 📋 Menggunakan Frontmatter
Frontmatter memungkinkan Anda menetapkan metadata ke halaman Anda:

```blade
---
title: "About Our Team"
description: "Learn more about our amazing team members"
middleware: auth
---

@extends('layouts.app')

@section('title', $frontmatter->title)

@section('content')
    <h1>{{ $frontmatter->title }}</h1>
    <p>{{ $frontmatter->description }}</p>
@endsection
```

### 📋 Frontmatter PHP
Anda juga dapat menggunakan PHP dalam frontmatter:

```blade
---
<?php
$users = App\Models\User::all();
$title = "Our Team (" . $users->count() . " members)";
?>
---

@extends('layouts.app')

@section('title', $title)

@section('content')
    <h1>{{ $title }}</h1>
    <ul>
        @foreach($users as $user)
            <li>{{ $user->name }}</li>
        @endforeach
    </ul>
@endsection
```

## 🏷️ Named Routes

### 📋 Named Routes Otomatis
Folio secara otomatis menghasilkan named routes berdasarkan struktur direktori:

```blade
{{-- resources/views/pages/services/web-design.blade.php --}}
@extends('layouts.app')

@section('content')
    <h1>Web Design Services</h1>
    <a href="{{ route('services.web-design') }}">Link to this page</a>
@endsection
```

### 📋 Named Routes dengan Frontmatter
Anda dapat menetapkan nama route kustom menggunakan frontmatter:

```blade
---
name: custom.web.design
---

@extends('layouts.app')

@section('content')
    <h1>Web Design Services</h1>
    <a href="{{ route('custom.web.design') }}">Link to this page</a>
@endsection
```

## 🎨 Asset Compilation

### 📋 Integrasi dengan Vite
Folio berintegrasi dengan Vite untuk asset compilation:

```blade
{{-- resources/views/pages/about.blade.php --}}
@extends('layouts.app')

@section('title', 'About Us')

@section('content')
    <h1>About Us</h1>
    <p>This is the about page content.</p>
    
    @push('scripts')
        @vite('resources/js/about.js')
    @endpush
@endsection
```

### 📋 Asset Per-Halaman
```blade
{{-- resources/views/pages/contact.blade.php --}}
@extends('layouts.app')

@section('title', 'Contact Us')

@section('content')
    <h1>Contact Us</h1>
    <form id="contact-form">
        <!-- Form fields -->
    </form>
@endsection

@push('scripts')
    @vite('resources/js/contact.js')
@endpush

@push('styles')
    @vite('resources/css/contact.css')
@endpush
```

## 📄 Static Pages

### 📋 Halaman Statis Sederhana
Untuk halaman statis sederhana, Anda dapat menggunakan layout tanpa extends:

```blade
{{-- resources/views/pages/privacy.blade.php --}}
<x-layout>
    <x-slot name="title">Privacy Policy</x-slot>
    
    <h1>Privacy Policy</h1>
    <p>Last updated: {{ date('F d, Y') }}</p>
    
    <h2>Information We Collect</h2>
    <p>We collect information you provide directly to us...</p>
    
    <h2>How We Use Your Information</h2>
    <p>We use the information we collect to...</p>
</x-layout>
```

### 📋 Halaman dengan Data Dinamis
```blade
{{-- resources/views/pages/blog/[slug].blade.php --}}
<x-layout>
    <x-slot name="title">{{ $post->title }}</x-slot>
    
    <article>
        <h1>{{ $post->title }}</h1>
        <p class="meta">
            Published on {{ $post->published_at->format('F d, Y') }} 
            by {{ $post->author->name }}
        </p>
        
        <div class="content">
            {!! $post->content !!}
        </div>
    </article>
</x-layout>
```

## 🧠 Kesimpulan

Laravel Folio menyediakan cara yang sederhana dan elegan untuk membuat halaman web dalam aplikasi Laravel Anda. Dengan pendekatan berbasis file Blade, Folio memungkinkan Anda membuat halaman dengan cepat tanpa perlu mendefinisikan route secara manual.

### 🔑 Keuntungan Utama
- Routing otomatis berdasarkan struktur file
- Dukungan untuk nested routes dan parameters
- Route model binding otomatis
- Middleware per-halaman
- Frontmatter untuk metadata
- Named routes otomatis
- Integrasi dengan Vite
- Mudah dipelajari dan digunakan

### 🚀 Best Practices
1. Gunakan Folio untuk halaman sederhana dan statis
2. Gunakan frontmatter untuk metadata dan konfigurasi
3. Manfaatkan route model binding untuk halaman dinamis
4. Gunakan middleware untuk kontrol akses
5. Organisir file Blade dengan struktur direktori yang logis
6. Gunakan named routes untuk navigasi
7. Integrasi dengan Vite untuk asset compilation

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Folio untuk membuat halaman web dengan cepat dan efisien dalam aplikasi Laravel Anda.
# 🎨 Frontend di Laravel: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Setelah beberapa kali revisi, akhirnya Guru paham apa yang sebenarnya kalian inginkan: sebuah panduan yang **super lengkap** tapi dijelaskan dengan **super sederhana**, seolah-olah Guru sedang duduk di sebelahmu sambil menjelaskan pelan-pelan.

Di edisi ini, kita akan kupas tuntas **semua detail** tentang Frontend Development di Laravel, tapi setiap topik akan Guru ajarkan dengan sabar. Siap? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基 礎

### 1. 📖 Apa Sih Frontend di Laravel Itu Sebenarnya?

**Analogi:** Bayangkan kamu punya restoran hebat dengan dapur yang luar biasa (backend Laravel), tapi kamu juga butuh dekorasi menarik, meja kursi yang nyaman, dan tampilan menu yang menggugah selera (frontend). Frontend inilah yang membuat pengunjung betah dan nyaman saat makan di restoranmu. Dalam Laravel, frontend adalah bagian yang **membuat aplikasimu enak dilihat dan mudah digunakan**.

**Mengapa ini penting?** Karena pengguna akhir (user) tidak peduli dengan keren-kerennya kode backend, mereka hanya melihat dan berinteraksi dengan tampilan aplikasi. Frontend yang bagus membuat aplikasimu terasa cepat, cantik, dan mudah digunakan.

**Bagaimana cara kerjanya?** Laravel menyediakan berbagai alat untuk mengembangkan frontend:
1.  **Vite** - Mesin pembangun yang cepat untuk CSS/JS
2.  **Blade** - Template engine untuk membuat tampilan HTML
3.  **Integrasi framework modern** - Seperti Vue, React, Inertia, Livewire
4.  **Asset management** - Mengelola file CSS, JS, gambar, dll.

Jadi, alur kerja (workflow) Frontend di Laravel menjadi sangat rapi:

`➡️ Desain Tampilan -> 🧱 Gunakan Blade/Vue/React -> 🚀 Kompilasi dengan Vite -> ✅ Tampil Cantik & Cepat`

Tanpa pendekatan frontend yang terorganisir, aplikasimu akan terlihat seperti catatan tulis tangan di tengah zaman digital. 😵

### 2. ✍️ Resep Pertamamu: Dari Tampilan ke Kode

Ini adalah fondasi paling dasar. Mari kita buat tampilan pertama dari nol, langkah demi langkah.

#### Langkah 1️⃣: Siapkan Struktur Frontend
**Mengapa?** Kita butuh tahu tempat menyimpan file CSS, JS, dan View kita.

**Struktur Direktori Frontend:**
```
resources/
├── css/
│   └── app.css
├── js/
│   └── app.js
└── views/
    └── welcome.blade.php
```

#### Langkah 2️⃣: Gunakan Vite untuk Kompilasi
**Mengapa?** Karena Vite membuat proses development lebih cepat dan efisien.

**Bagaimana?** Pastikan kamu sudah punya file `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
})
```

#### Langkah 3️⃣: Hubungkan Asset di View
**Mengapa?** Karena kamu perlu memuat CSS dan JS ke dalam halaman HTML-mu.

**Bagaimana?** Gunakan directive `@vite`:
```blade
<!DOCTYPE html>
<html>
<head>
    {{-- Load Vite assets --}}
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <!-- Konten halaman -->
</body>
</html>
```

Selesai! 🎉 Sekarang, kamu telah membuat dasar frontend Laravel pertamamu!

### 3. ⚡ Alat yang Digunakan (Peralatan Koki Frontend)

**Analogi:** Seperti koki yang butuh peralatan dapur, seorang developer frontend juga butuh alat-alat yang tepat.

**Alat Utama dalam Laravel Frontend:**
- **Vite** - Build tool yang cepat untuk development dan production (sepeti mesin pembuat kue yang cepat)
- **Blade** - Templating engine Laravel (seperti stempel untuk membuat tampilan dengan cepat)
- **NPM/Bun** - Package manager untuk frontend dependencies (seperti toko bahan makanan)

---

## Bagian 2: Vite - Mesin Pembangun yang Super Cepat ⚡

### 4. 🏗️ Apa Itu Vite?

**Analogi:** Bayangkan kamu punya mesin ajaib yang bisa menggabungkan ribuan potongan kue, menghiasnya, dan menyajikannya dalam hitungan detik. Itulah Vite! Dia mengambil semua file CSS dan JavaScript-mu, menggabungkan, mengoptimasi, dan membuatnya siap digunakan dalam aplikasi.

**Mengapa ini keren?** Karena Vite menyediakan lingkungan development yang sangat cepat dengan Hot Module Replacement (HMR) - artinya perubahan yang kamu buat langsung terlihat tanpa refresh halaman!

### 5. 📄 Konfigurasi Vite (Mengatur Mesin Ajaib)

**File `vite.config.js`** adalah tempat kamu memberi instruksi ke Vite:

```javascript
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],  // File utama yang akan dikompilasi
            refresh: true,                                           // Auto-refresh saat kamu edit Blade
        }),
    ],
})
```

### 6. ⚙️ Menjalankan dan Membangun dengan Vite

**Menjalankan Development Server (saat development):**
```bash
npm run dev
```

**Membangun Asset untuk Production (saat siap deploy):**
```bash
npm run build
```

### 7. 📄 Menghubungkan Asset di Blade

**Cara menghubungkan asset Vite di view Blade:**
```blade
<!DOCTYPE html>
<html>
<head>
    {{-- Load asset Vite secara otomatis --}}
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <!-- Konten halaman -->
</body>
</html>
```

---

## Bagian 3: Menulis CSS - Mewarnai Duniamu 🎨

### 8. 📄 CSS Utama (Pondasi Tampilan)

**File `resources/css/app.css`** adalah titik masuk utama untuk semua CSS-mu:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

.btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
}
```

### 9. 🎨 Menggunakan Tailwind CSS (Penggunaan Framework CSS)

**Analogi:** Bayangkan kamu punya lemari pakaian berisi baju-baju siap pakai dengan berbagai gaya. Tailwind seperti lemari itu - semua kelas CSS siap pakai untuk kamu gunakan langsung di HTML.

**Instalasi Tailwind:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**File `tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**File `postcss.config.js`:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 10. 💡 Tips Menggunakan CSS di Laravel

**Gunakan Tailwind Utility Classes:**
```blade
<div class="bg-blue-500 text-white p-4 rounded-lg">
    <h1 class="text-2xl font-bold">Selamat Datang!</h1>
    <p class="mt-2">Ini adalah contoh penggunaan Tailwind CSS</p>
</div>
```

**Buat custom component dengan @apply:**
```css
@layer components {
    .btn-primary {
        @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
    }
}
```

---

## Bagian 4: Menulis JavaScript - Memberi Kehidupan 📜

### 11. 📄 JavaScript Utama (Jantung Interaktivitas)

**File `resources/js/app.js`** adalah titik masuk utama untuk semua JavaScript-mu:

```javascript
import './bootstrap';          // Inisialisasi framework
import '../css/app.css';       // Import CSS untuk HMR

import Alpine from 'alpinejs'; // Jika menggunakan Alpine JS

window.Alpine = Alpine;
Alpine.start();
```

### 12. 📦 Integrasi Framework JavaScript

**Menggunakan Bootstrap:**
```bash
npm install bootstrap
```

```javascript
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
```

**Menggunakan Vue.js:**
```bash
npm install vue@latest
```

```javascript
import { createApp } from 'vue';
import ExampleComponent from './components/ExampleComponent.vue';

createApp({
    components: {
        ExampleComponent,
    }
}).mount('#app');
```

**Menggunakan React:**
```bash
npm install react react-dom
```

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import ExampleComponent from './components/ExampleComponent';

ReactDOM.createRoot(document.getElementById('app')).render(
    <ExampleComponent />
);
```

### 13. 🧩 Directives dan Helpers di JavaScript

**Gunakan Laravel Mix Helpers jika perlu:**
```javascript
// resources/js/bootstrap.js
import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
```

---

## Bagian 5: Blade Templating - Mesin Pembuat Tampilan 🧱

### 14. 🏗️ Apa Itu Blade?

**Analogi:** Bayangkan kamu punya mesin stempel yang bisa membuat halaman HTML lengkap hanya dengan beberapa perintah sederhana. Blade adalah mesin stempel itu! Dia mengizinkanmu menggunakan fitur-fitur PHP dalam template HTML-mu, membuat tampilan menjadi dinamis dan modular.

**Mengapa ini keren?** Karena Blade sangat cepat, aman dari XSS (Cross-Site Scripting), dan menyediakan fitur-fitur yang membuat membuat tampilan menjadi mudah dan terorganisasi.

### 15. 📄 Layout Master (Kerangka Dasar)

**File `resources/views/layouts/app.blade.php`** - kerangka dasar semua halaman:

```blade
<!DOCTYPE html>
<html>
<head>
    <title>@yield('title', 'Laravel App')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <nav class="bg-blue-500 text-white p-4">
        <div class="container mx-auto">
            <h1 class="text-xl font-bold">Aplikasi Laravel</h1>
        </div>
    </nav>

    <main class="container mx-auto p-4">
        @yield('content')
    </main>

    <footer class="bg-gray-800 text-white p-4 mt-8">
        <div class="container mx-auto text-center">
            <p>&copy; 2025 Laravel App. Hak Cipta Dilindungi.</p>
        </div>
    </footer>
</body>
</html>
```

### 16. 📄 Menggunakan Layout (Mengisi Kerangka)

**File `resources/views/welcome.blade.php`** - mengisi halaman dengan konten:

```blade
@extends('layouts.app')

@section('title', 'Selamat Datang')

@section('content')
    <h1 class="text-3xl font-bold text-blue-600 mb-4">Selamat Datang di Laravel!</h1>
    <p class="text-gray-700 mb-6">Ini adalah halaman welcome yang menggunakan layout dasar Laravel.</p>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2">Cepat</h3>
            <p>Laravel memberikan performa yang luar biasa.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2">Aman</h3>
            <p>Dibangun dengan fitur keamanan terdepan.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2">Modern</h3>
            <p>Menggunakan teknologi terbaru untuk pengembangan.</p>
        </div>
    </div>
@endsection
```

### 17. 🎨 Directives Blade (Perintah Ajaib)

**Kondisional (If/Else):**
```blade
{{-- Kondisional --}}
@if ($user->isActive())
    <p class="text-green-600">User aktif</p>
@elseif ($user->isPending())
    <p class="text-yellow-600">User menunggu verifikasi</p>
@else
    <p class="text-red-600">User tidak aktif</p>
@endif

{{-- Kondisi sederhana --}}
@unless ($user->isSubscribed())
    <p class="text-red-600">Silakan berlangganan!</p>
@endunless
```

**Loop (Perulangan):**
```blade
{{-- Loop --}}
@foreach ($users as $user)
    <div class="user-card p-4 border rounded mb-2">
        <h3 class="font-bold">{{ $user->name }}</h3>
        <p class="text-gray-600">{{ $user->email }}</p>
    </div>
@endforeach

{{-- Loop dengan else --}}
@forelse ($users as $user)
    <p>{{ $user->name }}</p>
@empty
    <p>Belum ada pengguna.</p>
@endforelse

{{-- Loop sederhana --}}
@for ($i = 0; $i < 10; $i++)
    <p>Angka: {{ $i }}</p>
@endfor
```

**Authentication (Otentikasi):**
```blade
{{-- Authentication --}}
@auth
    <p class="text-blue-600">Selamat datang, {{ Auth::user()->name }}!</p>
    <a href="/logout" class="btn btn-secondary">Logout</a>
@endauth

@guest
    <p class="text-gray-600">Silakan login terlebih dahulu.</p>
    <a href="/login" class="btn btn-primary">Login</a>
@endguest

@can('update', $post)
    <a href="{{ route('posts.edit', $post) }}" class="btn btn-warning">Edit</a>
@endcan
```

**Form dan Security:**
```blade
{{-- CSRF Protection --}}
<form method="POST" action="/profile">
    @csrf
    <div class="form-group mb-4">
        <label for="name" class="block text-gray-700">Nama:</label>
        <input type="text" id="name" name="name" class="form-control w-full p-2 border rounded">
    </div>
    
    <div class="form-group mb-4">
        <label for="email" class="block text-gray-700">Email:</label>
        <input type="email" id="email" name="email" class="form-control w-full p-2 border rounded">
    </div>
    
    <button type="submit" class="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded">
        Simpan Profil
    </button>
</form>

{{-- Validation Errors --}}
@error('name')
    <div class="alert alert-danger bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ $message }}
    </div>
@enderror

@error('email')
    <div class="alert alert-danger bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ $message }}
    </div>
@enderror
```

### 18. 🧱 Fitur Lainnya di Blade

**Components (Komponen):**
```blade
{{-- Membuat komponen --}}
{{-- resources/views/components/alert.blade.php --}}
<div class="alert {{ $type ? 'alert-' . $type : 'alert-info' }}">
    {{ $slot }}
</div>

{{-- Menggunakan komponen --}}
<x-alert type="success">
    Ini adalah pesan sukses!
</x-alert>
```

**Slots:**
```blade
{{-- resources/views/components/card.blade.php --}}
<div class="card border rounded p-4">
    <div class="card-header">
        {{ $title }}
    </div>
    <div class="card-body">
        {{ $slot }}
    </div>
    @if (isset($footer))
        <div class="card-footer">
            {{ $footer }}
        </div>
    @endif
</div>

{{-- Menggunakan slot --}}
<x-card title="Judul Kartu">
    Ini adalah isi kartu.
    <x-slot name="footer">
        Ini adalah footer kartu.
    </x-slot>
</x-card>
```

---

## Bagian 6: Inertia.js - Jembatan Laravel & SPA 🔄

### 19. 🌉 Apa Itu Inertia.js?

**Analogi:** Bayangkan kamu punya restoran dengan dapur backend Laravel dan ruang makan frontend Vue/React. Inertia adalah pelayan yang mengantarkan hidangan dari dapur ke meja tanpa perlu keluar dari restoran. Dia membuat aplikasi single-page (SPA) tanpa harus membuat API terpisah.

**Mengapa ini keren?** Karena kamu bisa membuat aplikasi SPA modern dengan Vue/React tapi tetap menggunakan Laravel sebagai backend tanpa membuat API REST terpisah. Inertia menghubungkan keduanya secara langsung.

### 20. 📦 Instalasi Inertia

**Langkah 1️⃣: Instal di Backend (Laravel):**
```bash
composer require inertiajs/inertia-laravel
```

**Langkah 2️⃣: Instal di Frontend (Vue/React):**
```bash
npm install @inertiajs/vue3
```

### 21. 📄 Konfigurasi Inertia (Mengatur Pelayan)

**File `resources/js/app.js`:**
```javascript
import './bootstrap';
import '../css/app.css';

import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
    title: (title) => `${title} - Laravel App`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        return createApp({ render: () => h(App, props) })
            .use(plugin)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});
```

### 22. 📄 Controller dengan Inertia (Mengirim Hidangan)

```php
<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Index', [
            'users' => User::all(),
            'title' => 'Dashboard',
        ]);
    }
    
    public function show(User $user)
    {
        return Inertia::render('User/Show', [
            'user' => $user,
        ]);
    }
}
```

### 23. 📄 Component Vue dengan Inertia (Menerima Hidangan)

**File `resources/js/Pages/Dashboard/Index.vue`:**
```vue
<template>
    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold text-blue-600 mb-6">Dashboard</h1>
        
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4">Daftar Pengguna</h2>
            <ul class="space-y-3">
                <li v-for="user in users" :key="user.id" class="border-b pb-2">
                    {{ user.name }} - {{ user.email }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    users: Array,
    title: String,
})
</script>
```

### 24. 🔄 Fitur Lanjutan Inertia

**Form Handling:**
```vue
<template>
    <form @submit.prevent="submit">
        <input v-model="form.name" type="text" class="form-input" />
        <input v-model="form.email" type="email" class="form-input" />
        <button type="submit" :disabled="form.processing" class="btn btn-primary">
            Simpan
        </button>
    </form>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3'

const form = useForm({
    name: '',
    email: '',
})

const submit = () => {
    form.post('/users', {
        onSuccess: () => form.reset(),
    })
}
</script>
```

---

## Bagian 7: Livewire - Interaktivitas Tanpa JavaScript 🧠

### 25. 🌟 Apa Itu Livewire?

**Analogi:** Bayangkan kamu punya remote control ajaib yang bisa mengendalikan TV tanpa harus tahu bagaimana cara kerja elektronik di dalamnya. Livewire seperti remote control itu - memberikan interaktivitas pada halaman web langsung dari server tanpa harus menulis JavaScript kompleks.

**Mengapa ini keren?** Karena kamu bisa membuat komponen interaktif hanya dengan PHP dan Blade, tanpa harus menulis JavaScript, mengelola state, atau membuat API. Semuanya berjalan di server dan Livewire menangani komunikasi ke client.

### 26. 📦 Instalasi Livewire

```bash
composer require livewire/livewire
```

### 27. 📄 Membuat Component Livewire

**Membuat component Counter:**
```bash
php artisan make:livewire Counter
```

**File `app/Livewire/Counter.php`:**
```php
<?php

namespace App\Livewire;

use Livewire\Component;

class Counter extends Component
{
    public $count = 0;

    public function increment()
    {
        $this->count++;
    }

    public function decrement()
    {
        $this->count--;
    }

    public function render()
    {
        return view('livewire.counter');
    }
}
```

**File `resources/views/livewire/counter.blade.php`:**
```blade
<div class="p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Counter Sederhana</h2>
    <div class="flex items-center space-x-4">
        <button wire:click="decrement" class="btn btn-danger bg-red-500 text-white py-2 px-4 rounded">
            -
        </button>
        <span class="text-2xl font-bold min-w-[50px] text-center">{{ $count }}</span>
        <button wire:click="increment" class="btn btn-success bg-green-500 text-white py-2 px-4 rounded">
            +
        </button>
    </div>
</div>
```

### 28. 📄 Menggunakan Component Livewire

```blade
<!DOCTYPE html>
<html>
<head>
    <title>Livewire Demo</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
</head>
<body class="bg-gray-100">
    <div class="container mx-auto p-8">
        <h1 class="text-3xl font-bold mb-8 text-center">Contoh Livewire</h1>
        
        @livewire('counter')
        
        <div class="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-4">Komponen Lain</h2>
            @livewire('user-list')
        </div>
    </div>
    
    @livewireScripts
</body>
</html>
```

### 29. 🧠 Fitur Lanjutan Livewire

**Component dengan Data:**
```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\User;

class UserList extends Component
{
    public $users = [];
    public $search = '';

    public function mount()
    {
        $this->users = User::all();
    }

    public function render()
    {
        $users = User::where('name', 'like', '%' . $this->search . '%')->get();
        return view('livewire.user-list', [
            'users' => $users
        ]);
    }
}
```

**Component Blade:**
```blade
<div>
    <input wire:model.live="search" type="text" placeholder="Cari pengguna..." class="form-input p-2 border rounded w-full mb-4">
    
    <ul>
        @foreach($users as $user)
            <li class="p-2 border-b hover:bg-gray-50">{{ $user->name }}</li>
        @endforeach
    </ul>
</div>
```

---

## Bagian 8: Optimasi Asset - Membuat Lebih Cepat ⚡

### 30. 🚀 Mengapa Perlu Optimasi?

**Analogi:** Bayangkan restoranmu penuh dengan peralatan berat yang tidak terpakai - tentu akan membuat service menjadi lambat. Optimasi asset seperti membersihkan peralatan yang tidak perlu dan mengatur sisanya secara efisien agar service tetap cepat.

**Mengapa ini penting?** Karena asset yang besar dan tidak dioptimasi akan membuat halaman load lebih lama, yang buruk untuk user experience dan SEO.

### 31. 📦 Mengurangi Ukuran Bundle dengan Code Splitting

**File `vite.config.js`:**
```javascript
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-alpine': ['alpinejs'],
                    'vendor-vue': ['vue'],
                    'vendor-axios': ['axios'],
                }
            }
        }
    }
})
```

### 32. 🎨 Purging CSS (Membersihkan CSS Tidak Terpakai)

**Untuk Tailwind CSS:**
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Tidak perlu purge lagi karena sudah otomatis di mode production
}
```

### 33. 📦 Code Splitting di JavaScript

**Dinamis import:**
```javascript
// resources/js/app.js
import('./modules/admin').then(module => {
    module.initializeAdminFeatures();
});

// Atau dengan async/await
async function loadAdminModule() {
    const module = await import('./modules/admin');
    module.initializeAdminFeatures();
}
```

**Lazily load component di Vue:**
```javascript
// resources/js/app.js
const app = createApp({});

app.component('admin-panel', () => import('./components/AdminPanel.vue'));
app.component('user-dashboard', () => import('./components/UserDashboard.vue'));
```

### 34. 🧠 Tips Optimasi Lainnya

**Gunakan kompresi:**
- Aktifkan Gzip/Brotli di server
- Gunakan format gambar yang efisien (WebP, AVIF)

**Optimasi gambar:**
- Kurangi ukuran sebelum upload
- Gunakan lazy loading untuk gambar yang tidak terlihat langsung

**Gunakan CDN:**
- Gunakan CDN untuk asset statis untuk distribusi global

**Analisis bundle:**
```bash
npm run build -- --analyze
```

---

## Bagian 9: Panduan Praktis - Pemilihan Pendekatan 🧭

### 35. 🤔 Kapan Harus Gunakan Apa?

**Untuk Aplikasi Sederhana (Blog, Website Company Profile):**
- Gunakan **Blade + Tailwind CSS**
- Cukup dengan interaktivitas minimal (Alpine.js jika perlu)

**Untuk Aplikasi Interaktif (Dashboard, CRUD Complex):**
- Gunakan **Blade + Livewire** untuk kemudahan development
- Atau **Inertia + Vue/React** untuk pengalaman SPA

**Untuk Aplikasi SPA Penuh:**
- Gunakan **Inertia + Vue/React** dengan Laravel sebagai API
- Atau buat frontend terpisah dengan API Laravel

**Untuk Prototipe Cepat:**
- Gunakan **Blade + Livewire** untuk development super cepat
- Tidak perlu setup API atau framework JS kompleks

### 36. 🧪 Contoh Kasus Dunia Nyata

**Kasus 1: Website Bisnis**
- **Rekomendasi:** Blade + Tailwind + Alpine.js
- **Alasan:** Cepat, ringan, SEO-friendly

**Kasus 2: Dashboard Admin**
- **Rekomendasi:** Blade + Livewire atau Inertia + Vue
- **Alasan:** Butuh interaktivitas tinggi dan real-time

**Kasus 3: Aplikasi SaaS**
- **Rekomendasi:** Inertia + Vue/React
- **Alasan:** Pengalaman SPA yang mulus dan cepat

---

## Bagian 10: Tips dan Trik Lanjutan 🧠

### 37. 🚀 Best Practices dalam Frontend Laravel

**1. Organisasi File:**
```
resources/
├── css/
│   ├── app.css
│   ├── components/
│   │   ├── buttons.css
│   │   └── forms.css
│   └── pages/
│       └── dashboard.css
├── js/
│   ├── app.js
│   ├── components/
│   │   ├── Alert.vue
│   │   └── Card.vue
│   └── pages/
│       └── Dashboard.vue
└── views/
    ├── layouts/
    │   └── app.blade.php
    ├── components/
    │   └── alert.blade.php
    └── pages/
        └── welcome.blade.php
```

**2. Gunakan Component:**
```blade
{{-- resources/views/components/button.blade.php --}}
<button class="{{ $type ? 'btn-'.$type : 'btn-primary' }} {{ $class ?? '' }}">
    {{ $slot }}
</button>

{{-- Menggunakan component --}}
<x-button type="success" class="mt-4">Simpan</x-button>
```

**3. Gunakan Form Request:**
```php
// Dalam component Livewire
public function createPost(PostRequest $request)
{
    Post::create($request->validated());
}
```

### 38. 🔧 Debugging Frontend

**Gunakan Laravel Debugbar:**
```bash
composer require barryvdh/laravel-debugbar --dev
```

**Gunakan browser dev tools untuk:**
- Mengecek network request (apakah asset dimuat dengan benar)
- Mengecek console errors
- Mengecek elements dan styles

---

## Bagian 11: Cheat Sheet & Referensi Cepat 📋

### 39. 🛠️ Perintah Umum

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan Vite development server |
| `npm run build` | Bangun asset untuk production |
| `php artisan make:livewire ComponentName` | Buat Livewire component |
| `@vite(['file.css', 'file.js'])` | Load asset di Blade |
| `@csrf` | Tambahkan CSRF token ke form |

### 40. 🎨 Directives Blade Umum

| Directive | Fungsi |
|-----------|--------|
| `@extends('layout')` | Gunakan layout |
| `@section('name')` | Definisikan section |
| `@yield('name')` | Tampilkan section |
| `@if(condition)` | Kondisional |
| `@foreach($items as $item)` | Loop |
| `@auth` | Jika user login |
| `@guest` | Jika user tidak login |
| `@error('field')` | Tampilkan error validasi |

### 41. ⚡ Framework Integrations

| Framework | Instalasi |
|-----------|-----------|
| Vue | `npm install vue@latest` |
| React | `npm install react react-dom` |
| Inertia | `composer require inertiajs/inertia-laravel` `npm install @inertiajs/vue3` |
| Livewire | `composer require livewire/livewire` |
| Tailwind | `npm install -D tailwindcss postcss autoprefixer` `npx tailwindcss init -p` |

---

## Bagian 12: Kesimpulan 🎯

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Frontend Development di Laravel, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Ingat, Frontend Development adalah bagian penting dari aplikasi Laravel yang menentukan pengalaman pengguna.

Kamu sekarang paham tentang:
- **Vite** - Build tool modern untuk asset compilation
- **Blade** - Templating engine yang kuat dan aman
- **CSS & JavaScript** - Pengelolaan dan integrasi
- **Inertia.js** - Jembatan Laravel dan SPA modern
- **Livewire** - Interaktivitas server-side tanpa JS
- **Optimasi** - Membuat aplikasi lebih cepat

Pilih pendekatan yang sesuai dengan kebutuhan proyekmu. Laravel menyediakan banyak pilihan untuk membuat frontend yang modern, cepat, dan mudah dikelola. Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku!
# 🎨 Frontend Laravel

Dokumentasi ini menjelaskan cara mengelola dan mengembangkan frontend dalam aplikasi Laravel, termasuk asset compilation, Blade templating, dan integrasi dengan framework frontend modern.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Menggunakan Vite](#menggunakan-vite)
3. [Menulis CSS](#menulis-css)
4. [Menulis JavaScript](#menulis-javascript)
5. [Blade Templating](#blade-templating)
6. [Inertia.js](#inertiajs)
7. [Livewire](#livewire)
8. [Optimasi Asset](#optimasi-asset)

## 🎯 Pendahuluan

Laravel menyediakan titik awal yang kuat untuk aplikasi frontend modern menggunakan Vite untuk mengompilasi CSS dan JavaScript Anda. Laravel juga menyediakan Blade templating engine untuk membuat tampilan aplikasi Anda.

### 🔧 Alat yang Digunakan
- **Vite** - Build tool untuk development dan production
- **Blade** - Templating engine Laravel
- **NPM/Bun** - Package manager untuk frontend dependencies

### 📁 Struktur Direktori Frontend
```
resources/
├── css/
│   └── app.css
├── js/
│   └── app.js
└── views/
    └── welcome.blade.php
```

## ⚡ Menggunakan Vite

Laravel menggunakan Vite untuk mengompilasi asset frontend. Vite menyediakan lingkungan development yang cepat dengan Hot Module Replacement (HMR).

### 📄 Konfigurasi Vite
File `vite.config.js` di root direktori:

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

### ▶️ Menjalankan Vite Development Server
```bash
npm run dev
```

### 🏗️ Membangun Asset untuk Production
```bash
npm run build
```

### 📄 Menghubungkan Asset di Blade
```blade
<!DOCTYPE html>
<html>
<head>
    {{-- Load Vite --}}
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <!-- Konten -->
</body>
</html>
```

## 🎨 Menulis CSS

### 📄 File CSS Utama
File `resources/css/app.css` adalah titik masuk untuk semua CSS Anda.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

.btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
}
```

### 🎨 Menggunakan Tailwind CSS
Tailwind CSS sudah dikonfigurasi secara default dalam Laravel:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

File `tailwind.config.js`:
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

### 📄 File PostCSS
File `postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 📜 Menulis JavaScript

### 📄 File JavaScript Utama
File `resources/js/app.js` adalah titik masuk untuk semua JavaScript Anda.

```javascript
import './bootstrap';
import '../css/app.css';

import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.start();
```

### 📦 Menggunakan Bootstrap
```bash
npm install bootstrap
```

```javascript
import 'bootstrap';
```

### 📦 Menggunakan Vue.js
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

### 📦 Menggunakan React
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

## 🧱 Blade Templating

Blade adalah templating engine yang kuat dan sederhana yang disertakan dengan Laravel.

### 📄 Layout Master
File `resources/views/layouts/app.blade.php`:
```blade
<!DOCTYPE html>
<html>
<head>
    <title>@yield('title', 'Laravel App')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <nav>
        <!-- Navigation -->
    </nav>

    <main>
        @yield('content')
    </main>

    <footer>
        <!-- Footer -->
    </footer>
</body>
</html>
```

### 📄 Menggunakan Layout
File `resources/views/welcome.blade.php`:
```blade
@extends('layouts.app')

@section('title', 'Welcome')

@section('content')
    <h1>Welcome to Laravel!</h1>
    <p>This is the welcome page.</p>
@endsection
```

### 🎨 Directives Blade
```blade
{{-- Kondisional --}}
@if ($user->isActive())
    <p>User is active</p>
@endif

{{-- Loop --}}
@foreach ($users as $user)
    <p>{{ $user->name }}</p>
@endforeach

{{-- Authentication --}}
@auth
    <p>Welcome, {{ Auth::user()->name }}!</p>
@endauth

@guest
    <p>Please login.</p>
@endguest

{{-- CSRF --}}
<form method="POST" action="/profile">
    @csrf
    <!-- Form fields -->
</form>

{{-- Validation --}}
@error('title')
    <div class="alert alert-danger">{{ $message }}</div>
@enderror
```

## 🔄 Inertia.js

Inertia.js memungkinkan Anda membangun single-page applications modern menggunakan Laravel sebagai backend.

### 📦 Instalasi Inertia
```bash
composer require inertiajs/inertia-laravel
npm install @inertiajs/vue3
```

### 📄 Konfigurasi Inertia
File `resources/js/app.js`:
```javascript
import './bootstrap';
import '../css/app.css';

import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
    title: (title) => `${title} - Laravel`,
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

### 📄 Controller Inertia
```php
<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Index', [
            'users' => User::all(),
        ]);
    }
}
```

### 📄 Component Vue
File `resources/js/Pages/Dashboard/Index.vue`:
```vue
<template>
    <div>
        <h1>Dashboard</h1>
        <ul>
            <li v-for="user in users" :key="user.id">
                {{ user.name }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    users: Array,
})
</script>
```

## 🧠 Livewire

Livewire memungkinkan Anda membangun antarmuka dinamis tanpa meninggalkan Laravel.

### 📦 Instalasi Livewire
```bash
composer require livewire/livewire
```

### 📄 Component Livewire
```bash
php artisan make:livewire Counter
```

File `app/Livewire/Counter.php`:
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

    public function render()
    {
        return view('livewire.counter');
    }
}
```

File `resources/views/livewire/counter.blade.php`:
```blade
<div>
    <button wire:click="increment">+</button>
    <h1>{{ $count }}</h1>
</div>
```

### 📄 Menggunakan Component
```blade
<!DOCTYPE html>
<html>
<head>
    @livewireStyles
</head>
<body>
    @livewire('counter')

    @livewireScripts
</body>
</html>
```

## ⚡ Optimasi Asset

### 📦 Mengurangi Ukuran Bundle
```javascript
// vite.config.js
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
                }
            }
        }
    }
})
```

### 🎨 Purging CSS
Untuk Tailwind CSS:
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
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './resources/**/*.blade.php',
      './resources/**/*.js',
      './resources/**/*.vue',
    ],
  },
}
```

### 📦 Code Splitting
```javascript
// resources/js/app.js
import('./modules/admin');
import('./modules/user');
```

## 🧠 Kesimpulan

Laravel menyediakan ekosistem frontend yang lengkap dan fleksibel:

### 🎯 Keuntungan Utama
- **Vite** - Build tool modern dengan HMR
- **Blade** - Templating engine yang kuat
- **Inertia.js** - SPA tanpa API terpisah
- **Livewire** - Interaktivitas tanpa JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### 🚀 Best Practices
1. Gunakan Vite untuk asset compilation
2. Organisir CSS dan JavaScript dengan baik
3. Manfaatkan Blade templating untuk tampilan
4. Pertimbangkan Inertia.js untuk SPA
5. Gunakan Livewire untuk interaktivitas server-side
6. Optimasi asset untuk production

Dengan pendekatan ini, Anda dapat membangun aplikasi frontend yang modern, cepat, dan mudah dikelola.
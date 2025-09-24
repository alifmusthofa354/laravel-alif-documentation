# 📦 Asset Bundling dengan Vite di Laravel - Panduan Lengkap untuk Pemula

Hai muridku yang hebat! Hari ini kita akan belajar tentang **Asset Bundling dengan Vite** di Laravel - sistem penting yang memungkinkan kamu mengompilasi, mengoptimalkan, dan memuat file CSS, JavaScript, dan aset statis lainnya dengan sangat cepat dan efisien. Seperti biasa, aku akan menjelaskan semuanya dengan bahasa yang mudah dan contoh kode yang bisa kamu coba sendiri.

---

## Bagian 1: Memahami Konsep Dasar Asset Building 🎯

### 1. 📖 Apa Itu Asset Building?

**Analogi Sederhana:** Bayangkan kamu adalah seorang koki profesional yang sedang menyiapkan hidangan kompleks. Kamu memiliki banyak bahan mentah - sayuran segar, rempah-rempah premium, daging berkualitas tinggi. Tapi sebelum bisa disajikan kepada pelanggan, semua bahan ini perlu:

- **Diproses** (dicuci, dipotong, dimasak)
- **Digabung** (dijadikan satu hidangan yang harmonis)
- **Dioptimalkan** (dikemas agar tetap segar dan enak saat disajikan)

**Asset building di Laravel adalah seperti proses memasak ini** - mengambil file CSS, JavaScript, gambar, dan aset lainnya, lalu memproses, menggabung, dan mengoptimalkan mereka untuk disajikan kepada pengguna akhir.

### 2. 💡 Mengapa Asset Building Penting?

Tanpa asset building yang baik, aplikasi kamu bisa menghadapi masalah serius:

- **Performa Lambat** - File besar dan tidak teroptimasi membuat halaman muat lama
- **Kompatibilitas Buruk** - CSS/JS modern tidak kompatibel dengan browser lama
- **Maintenance Sulit** - File tersebar di mana-mana tanpa struktur
- **Caching Tidak Efektif** - Browser tidak bisa melakukan caching yang optimal
- **User Experience Buruk** - Pengguna frustrasi dengan loading yang lama

### 3. 🛡️ Cara Kerja Asset Building di Laravel

```
File Mentah → [Vite] → Asset Terproses → Browser Pengguna
         ↑             ↓
    SCSS/SASS    File Optimized
    TypeScript   Caching Ready
    ES6+         Versioned
    Gambar       Minified
```

---

## Bagian 2: Instalasi & Setup Dasar ⚙️

### 4. 🛠️ Persiapan Lingkungan Pengembangan

Sebelum memulai, pastikan lingkungan pengembangan kamu siap:

```bash
# Cek versi Node.js (minimal v16+)
node -v

# Cek versi NPM
npm -v

# Jika menggunakan Laravel Sail
./vendor/bin/sail node -v
./vendor/bin/sail npm -v
```

**Jika belum terinstal:**
```bash
# Di Windows
# Download dari https://nodejs.org dan install

# Di macOS dengan Homebrew
brew install node

# Di Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm
```

### 5. 📦 Instalasi Dependensi Frontend

Laravel sudah menyediakan file konfigurasi dasar untuk frontend:

```bash
# Instal semua dependensi yang diperlukan
npm install

# Atau jika ingin bersih dari awal
rm -rf node_modules package-lock.json
npm install
```

**File package.json default:**
```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "devDependencies": {
    "axios": "^1.6.4",
    "laravel-vite-plugin": "^1.0.0",
    "vite": "^5.0.0"
  }
}
```

### 6. 🏗️ Struktur Direktori Asset

Struktur standar untuk asset frontend:

```
resources/
├── css/
│   └── app.css
├── js/
│   ├── app.js
│   └── bootstrap.js
└── views/
    └── welcome.blade.php
```

---

## Bagian 3: Konfigurasi Vite 🎛️

### 7. 📝 File Konfigurasi Vite

Vite dikonfigurasi melalui file `vite.config.js` di root proyek:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
            ],
            refresh: true, // Refresh otomatis saat file berubah
        }),
    ],
});
```

### 8. 🎯 Entry Points - Titik Masuk Asset

Entry points adalah file utama yang akan diproses oleh Vite:

```javascript
// vite.config.js - Konfigurasi entry points kompleks
export default defineConfig({
    plugins: [
        laravel({
            input: [
                // CSS utama
                'resources/css/app.css',
                'resources/css/admin.css',
                
                // JavaScript utama
                'resources/js/app.js',
                'resources/js/admin.js',
                
                // Sass/SCSS files
                'resources/sass/main.scss',
                
                // TypeScript files
                'resources/ts/app.ts',
            ],
            refresh: [
                // File yang memicu refresh otomatis
                'resources/views/**',
                'routes/**',
                'app/**',
            ],
        }),
    ],
});
```

### 9. 🔄 SPA (Single Page Application) Configuration

Untuk aplikasi SPA dengan Inertia.js atau frontend framework:

```javascript
// vite.config.js untuk SPA
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue'; // Jika menggunakan Vue

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js', // Hanya satu entry point
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
});
```

```javascript
// resources/js/app.js untuk SPA
import './bootstrap';
import '../css/app.css'; // Impor CSS dari JavaScript

// Import frontend framework
import { createApp } from 'vue';
import App from './App.vue';

// Buat aplikasi
const app = createApp(App);

// Mount ke DOM
app.mount('#app');
```

---

## Bagian 4: Menjalankan Development Server 🚀

### 10. ▶️ Menjalankan Mode Development

```bash
# Jalankan development server dengan HMR (Hot Module Replacement)
npm run dev

# Output yang diharapkan:
#   VITE v5.0.0  ready in 123 ms
#   ➜  Local:   http://localhost:5173/
#   ➜  Network: http://192.168.1.100:5173/
```

### 11. 🏗️ Building untuk Production

```bash
# Build asset untuk produksi (teroptimasi dan minified)
npm run build

# Output akan disimpan di:
# public/build/manifest.json
# public/build/assets/
```

### 12. 🌐 Konfigurasi untuk Laravel Sail di WSL2

Jika menggunakan Laravel Sail dengan WSL2, tambahkan konfigurasi HMR:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    server: {
        host: '0.0.0.0',
        hmr: {
            host: 'localhost',
        },
    },
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
            ],
            refresh: true,
        }),
    ],
});
```

**Jalankan dengan:**
```bash
# Di WSL2 dengan Sail
npm run dev -- --host 0.0.0.0
```

---

## Bagian 5: Memuat Asset di Blade 📄

### 13. 🎨 Menggunakan Directive @vite

Laravel menyediakan directive `@vite` untuk memuat asset di template Blade:

```blade
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>
    
    {{-- Jika CSS diimpor terpisah --}}
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <div id="app">
        <h1>Selamat Datang di Laravel dengan Vite!</h1>
    </div>
</body>
</html>
```

### 14. 🎯 Cara Memuat Asset yang Berbeda

```blade
{{-- Jika CSS sudah diimpor lewat JavaScript --}}
@vite('resources/js/app.js')

{{-- Untuk halaman admin dengan asset khusus --}}
@vite(['resources/css/admin.css', 'resources/js/admin.js'])

{{-- Untuk halaman dengan banyak asset --}}
@vite([
    'resources/css/app.css',
    'resources/css/components.css',
    'resources/js/app.js',
    'resources/js/components.js'
])

{{-- Conditional loading berdasarkan environment --}}
@if (app()->environment('local'))
    @vite(['resources/css/app.css', 'resources/js/app.js'])
@else
    <link rel="stylesheet" href="{{ asset('build/assets/app.css') }}">
    <script src="{{ asset('build/assets/app.js') }}" defer></script>
@endif
```

### 15. 🖼️ Menggunakan Asset Static dengan Vite::asset()

Untuk memuat asset statis seperti gambar, font, dll:

```blade
{{-- Di template Blade --}}
<img src="{{ Vite::asset('resources/images/logo.png') }}" alt="Logo">
<link rel="icon" href="{{ Vite::asset('resources/images/favicon.ico') }}">

{{-- Untuk font --}}
<style>
@font-face {
    font-family: 'CustomFont';
    src: url('{{ Vite::asset('resources/fonts/custom-font.woff2') }}') format('woff2');
}
</style>

{{-- Untuk SVG --}}
<svg>
    <use xlink:href="{{ Vite::asset('resources/icons/sprite.svg') }}#icon-home"></use>
</svg>
```

---

## Bagian 6: Menggunakan Framework Frontend 🎨

### 16. 🖼️ Vue.js Integration

**Instalasi Vue Plugin:**
```bash
npm install --save-dev @vitejs/plugin-vue vue
```

**Konfigurasi Vite:**
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
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
});
```

**Setup Vue App:**
```javascript
// resources/js/app.js
import './bootstrap';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.mount('#app');
```

```vue
<!-- resources/js/App.vue -->
<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <Counter />
  </div>
</template>

<script>
import Counter from './components/Counter.vue';

export default {
  name: 'App',
  components: {
    Counter
  },
  data() {
    return {
      message: 'Halo dari Vue di Laravel!'
    }
  }
}
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 50px;
}
</style>
```

**Di Blade Template:**
```blade
<!DOCTYPE html>
<html>
<head>
    <title>Laravel + Vue</title>
    @vite('resources/js/app.js')
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

### 17. ⚛️ React Integration

**Instalasi React Plugin:**
```bash
npm install --save-dev @vitejs/plugin-react
```

**Konfigurasi Vite:**
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
});
```

**Setup React App:**
```jsx
// resources/js/app.jsx
import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
```

```jsx
// resources/js/App.jsx
import React, { useState } from 'react';
import Counter from './components/Counter';

function App() {
    const [message] = useState('Halo dari React di Laravel!');
    
    return (
        <div className="app">
            <h1>{message}</h1>
            <Counter />
        </div>
    );
}

export default App;
```

**Di Blade Template:**
```blade
<!DOCTYPE html>
<html>
<head>
    <title>Laravel + React</title>
    @viteReactRefresh
    @vite('resources/js/app.jsx')
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

---

## Bagian 7: Mengelola Asset Statis 📁

### 18. 🖼️ Mengimpor Gambar dan Font

```javascript
// resources/js/app.js
// Impor semua gambar dari direktori tertentu
import.meta.glob([
    '../images/**',
    '../fonts/**',
]);

// Atau impor spesifik
import logo from '../images/logo.png';
import customFont from '../fonts/custom-font.woff2';

// Gunakan dalam kode
console.log(logo); // URL ke logo yang sudah diproses
```

### 19. 📂 Struktur Asset yang Terorganisir

```
resources/
├── css/
│   ├── app.css
│   ├── components/
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   └── forms.css
│   └── pages/
│       ├── home.css
│       └── dashboard.css
├── js/
│   ├── app.js
│   ├── bootstrap.js
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── Form.jsx
│   └── pages/
│       ├── Home.jsx
│       └── Dashboard.jsx
├── images/
│   ├── logos/
│   ├── icons/
│   └── backgrounds/
└── fonts/
    ├── custom-font.woff2
    └── icon-font.ttf
```

### 20. 🎨 Menggunakan Asset dalam CSS

```scss
// resources/css/app.scss
@import 'variables';
@import 'components/buttons';
@import 'components/cards';

// Menggunakan asset dalam CSS
.hero-banner {
    background-image: url('../images/backgrounds/hero.jpg');
    background-size: cover;
    height: 100vh;
}

.logo {
    background-image: url('../images/logos/logo.svg');
    width: 200px;
    height: 60px;
}
```

---

## Bagian 8: Refresh Otomatis dan Hot Module Replacement 🔥

### 21. 🔄 Konfigurasi Refresh Otomatis

Refresh otomatis memungkinkan browser merefresh halaman saat file berubah:

```javascript
// vite.config.js
export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
            ],
            refresh: [
                // File yang memicu refresh
                'resources/views/**/*.blade.php',
                'resources/js/**/*.js',
                'resources/css/**/*.css',
                'app/View/Components/**/*.php',
                'routes/**/*.php',
            ],
        }),
    ],
});
```

### 22. 🔥 Hot Module Replacement (HMR)

HMR memungkinkan perubahan kode langsung terlihat tanpa refresh penuh:

```javascript
// resources/js/app.js
import './bootstrap';

// Contoh HMR untuk komponen Vue
if (import.meta.hot) {
    import.meta.hot.accept();
}

// Atau untuk modul spesifik
if (import.meta.hot) {
    import.meta.hot.accept('./components/Header.vue', (newModule) => {
        // Update komponen tanpa refresh penuh
    });
}
```

### 23. 🎯 Refresh Kondisional

```javascript
// vite.config.js
export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            refresh: {
                paths: [
                    'resources/views/**',
                    'routes/**',
                ],
                config: {
                    delay: 300, // Delay 300ms sebelum refresh
                    events: ['add', 'unlink'], // Hanya refresh saat file ditambah/hapus
                },
            },
        }),
    ],
});
```

---

## Bagian 9: Topik Lanjutan 🚀

### 24. 🎯 Asset Prefetching

Prefetching mempercepat loading SPA dengan memuat asset sebelum dibutuhkan:

```php
// app/Providers/AppServiceProvider.php
use Illuminate\Support\Facades\Vite;

public function boot(): void
{
    // Prefetch 3 asset sekaligus
    Vite::prefetch(concurrency: 3);
}
```

```blade
{{-- Di template Blade --}}
@vite('resources/js/app.js')
@vitePrefetch
```

### 25. 🖥️ Server-Side Rendering (SSR)

SSR meningkatkan SEO dan performa initial load:

```bash
# Buat entry point SSR
touch resources/js/ssr.js
```

```javascript
// resources/js/ssr.js
import { renderToString } from '@vue/server-renderer';
import { createApp } from './app';

export async function render(url, manifest) {
    const { app } = createApp();
    const html = await renderToString(app);
    return html;
}
```

```javascript
// vite.config.js
export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            ssr: 'resources/js/ssr.js',
            refresh: true,
        }),
    ],
});
```

### 26. 🔐 Subresource Integrity (SRI)

SRI menambahkan integrity check untuk keamanan:

```bash
npm install --save-dev vite-plugin-manifest-sri
```

```javascript
// vite.config.js
import manifestSRI from 'vite-plugin-manifest-sri';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
            ],
        }),
        manifestSRI(),
    ],
});
```

### 27. 🔒 Content Security Policy (CSP) Nonce

Menggunakan nonce untuk CSP inline scripts:

```php
// Di controller atau middleware
$nonce = csrf_token(); // atau generate nonce unik
return view('welcome', ['cspNonce' => $nonce]);
```

```blade
{{-- Di template --}}
<script nonce="{{ $cspNonce }}">
    console.log('Script aman dengan nonce');
</script>
```

---

## Bagian 10: Optimasi dan Performance Tuning ⚡

### 28. 📦 Code Splitting

Membagi kode menjadi chunk yang lebih kecil:

```javascript
// resources/js/app.js
import './bootstrap';

// Dynamic import untuk code splitting
const Dashboard = () => import('./pages/Dashboard.vue');
const Profile = () => import('./pages/Profile.vue');

// Lazy loading components
const AsyncComponent = () => import('./components/HeavyComponent.vue');
```

### 29. 🗜️ Minification dan Compression

```javascript
// vite.config.js
export default defineConfig({
    build: {
        minify: 'terser', // atau 'esbuild'
        terserOptions: {
            compress: {
                drop_console: true, // Hapus console.log
                drop_debugger: true, // Hapus debugger statements
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['vue', 'axios'],
                    charts: ['chart.js', 'd3'],
                },
            },
        },
    },
    plugins: [
        laravel({
            input: 'resources/js/app.js',
        }),
    ],
});
```

### 30. 🎨 CSS Optimization

```scss
// resources/css/app.scss
// Purge unused CSS
@tailwind base;
@tailwind components;
@tailwind utilities;

// Critical CSS untuk above-the-fold content
.critical {
    /* CSS penting untuk tampilan awal */
}

// Non-critical CSS
.non-critical {
    /* CSS yang bisa dimuat asinkron */
}
```

---

## Bagian 11: Troubleshooting dan Debugging 🔍

### 31. 🚨 Masalah Umum dan Solusi

**Masalah 1: Vite tidak terdeteksi**
```bash
# Solusi: Pastikan dependensi terinstal
npm install
npm run dev
```

**Masalah 2: Asset tidak muncul**
```bash
# Solusi: Bersihkan cache dan rebuild
php artisan view:clear
npm run build
```

**Masalah 3: Error HMR di WSL2**
```javascript
// vite.config.js
export default defineConfig({
    server: {
        host: '0.0.0.0',
        hmr: {
            host: 'localhost',
            protocol: 'ws',
        },
    },
});
```

### 32. 🧪 Debugging Asset Loading

```javascript
// resources/js/app.js
// Debug informasi build
console.log('Vite mode:', import.meta.env.MODE);
console.log('Base URL:', import.meta.env.BASE_URL);

// Debug asset loading
import.meta.hot?.on('vite:beforeUpdate', (payload) => {
    console.log('Updating modules:', payload);
});
```

---

## Bagian 12: Best Practices & Tips ✅

### 33. 📋 Best Practices untuk Asset Building

1. **Gunakan named routes untuk URL generation:**
```php
// ✅ Benar
return redirect()->route('posts.show', $post);

// ❌ Hindari hardcoding
return redirect('/posts/' . $post->id);
```

2. **Optimalkan asset untuk production:**
```bash
# Selalu build sebelum deploy
npm run build
```

3. **Gunakan code splitting untuk aplikasi besar:**
```javascript
// resources/js/app.js
const Dashboard = () => import('./pages/Dashboard.vue');
```

4. **Bersihkan cache secara berkala:**
```bash
php artisan view:clear
php artisan config:clear
npm run build
```

### 34. 💡 Tips dan Trik Berguna

```bash
# Monitor ukuran bundle
npm install --save-dev vite-bundle-visualizer
npx vite-bundle-visualizer

# Gunakan environment variables
VITE_API_URL=https://api.example.com
# Di JavaScript: import.meta.env.VITE_API_URL

# Hot reload untuk file spesifik
npm run dev -- --host 0.0.0.0 --port 3000

# Build dengan sourcemaps untuk debugging
npm run build -- --sourcemap
```

### 35. 🚨 Kesalahan Umum

1. **Lupa menjalankan npm run dev:**
```bash
# ✅ Selalu jalankan saat development
npm run dev
```

2. **Tidak membangun untuk production:**
```bash
# ✅ Selalu build sebelum deploy
npm run build
```

3. **Hardcoding path asset:**
```blade
{{-- ❌ Jangan lakukan ini --}}
<link rel="stylesheet" href="/css/app.css">

{{-- ✅ Lakukan ini --}}
@vite('resources/css/app.css')
```

---

## Bagian 13: Contoh Implementasi Lengkap 👨‍💻

### 36. 🏢 Sistem Manajemen Blog dengan Asset Building Komplit

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/css/admin.css',
                'resources/js/app.js',
                'resources/js/admin.js',
            ],
            refresh: [
                'resources/views/**',
                'routes/**',
                'app/View/Components/**',
            ],
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
                    vendor: ['vue', 'axios', 'vue-router'],
                    editor: ['@toast-ui/editor'],
                    charts: ['chart.js'],
                },
            },
        },
    },
});
```

```javascript
// resources/js/app.js
import './bootstrap';
import '../css/app.css';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import HomePage from './pages/Home.vue';
import PostPage from './pages/Post.vue';

// Router
const routes = [
    { path: '/', component: HomePage },
    { path: '/posts/:id', component: PostPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Buat aplikasi
const app = createApp(App);
app.use(router);
app.mount('#app');

// HMR support
if (import.meta.hot) {
    import.meta.hot.accept();
}
```

```css
/* resources/css/app.css */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Custom styles */
.hero-banner {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card {
    @apply bg-white rounded-lg shadow-md p-6 transition-transform duration-300 hover:shadow-lg;
}

.btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors;
}

/* Responsive design */
@media (max-width: 768px) {
    .hero-banner {
        padding: 2rem;
    }
}
```

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>@yield('title', config('app.name', 'Laravel Blog'))</title>
    
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    @yield('styles')
</head>
<body class="font-sans antialiased bg-gray-100">
    <div id="app">
        @yield('content')
    </div>
    
    @yield('scripts')
</body>
</html>
```

```blade
{{-- resources/views/blog/index.blade.php --}}
@extends('layouts.app')

@section('title', 'Blog Posts')

@section('content')
    <div class="hero-banner">
        <div class="text-center text-white">
            <h1 class="text-4xl md:text-6xl font-bold mb-4">Selamat Datang di Blog Kami</h1>
            <p class="text-xl mb-8">Temukan artikel menarik seputar teknologi dan pengembangan web</p>
            <a href="{{ route('posts.create') }}" class="btn-primary">
                Buat Post Baru
            </a>
        </div>
    </div>
    
    <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach ($posts as $post)
                <div class="card">
                    @if ($post->featured_image)
                        <img src="{{ Vite::asset('resources/images/posts/' . $post->featured_image) }}" 
                             alt="{{ $post->title }}" 
                             class="w-full h-48 object-cover rounded-t-lg">
                    @endif
                    
                    <h2 class="text-2xl font-bold mb-2">
                        <a href="{{ route('posts.show', $post) }}" class="text-gray-800 hover:text-blue-600">
                            {{ $post->title }}
                        </a>
                    </h2>
                    
                    <p class="text-gray-600 mb-4">
                        {{ Str::limit($post->excerpt ?? $post->content, 150) }}
                    </p>
                    
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">
                            Oleh {{ $post->author->name }} • {{ $post->created_at->diffForHumans() }}
                        </span>
                        
                        <div class="flex space-x-2">
                            <a href="{{ route('posts.edit', $post) }}" class="text-blue-600 hover:text-blue-800">
                                Edit
                            </a>
                            
                            <form action="{{ route('posts.destroy', $post) }}" method="POST" 
                                  onsubmit="return confirm('Yakin ingin menghapus post ini?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="text-red-600 hover:text-red-800">
                                    Hapus
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
        
        <div class="mt-8">
            {{ $posts->links() }}
        </div>
    </div>
@endsection
```

---

## Bagian 14: Cheat Sheet & Referensi Cepat 📚

### 🧩 Helper URL Dasar
```
url('/')                    → URL dasar aplikasi
url('/posts')               → URL dengan path
url()->current()            → URL saat ini (tanpa query)
url()->full()               → URL saat ini (dengan query)
url()->previous()           → URL sebelumnya
url()->previousPath()       → Path sebelumnya
url()->query('/path', $params) → URL dengan query string
```

### 🎯 Named Routes
```
route('posts.index')              → Route tanpa parameter
route('posts.show', ['post' => 1]) → Route dengan parameter
route('posts.show', $post)        → Route dengan model binding
route('posts.show', [...], false) → URL relatif (bukan absolut)
```

### 🔐 Signed URLs
```
URL::signedRoute('route.name', $params)                    → Signed URL permanen
URL::temporarySignedRoute('route.name', $expiration, $params) → Signed URL sementara
$request->hasValidSignature()                             → Validasi signature
$request->hasValidSignatureWhileIgnoring(['utm_*'])       → Validasi dengan ignore parameter
```

### 🎯 Controller Actions
```
action([Controller::class, 'method'])                    → URL ke controller method
action([Controller::class, 'method'], $params)          → Dengan parameter
```

### 🧪 Fluent URI Objects
```
Uri::of('https://example.com')                           → Buat dari string
    ->withScheme('http')                                 → Ubah scheme
    ->withHost('test.com')                              → Ubah host
    ->withPort(8000)                                    → Tambah port
    ->withPath('/users')                                → Tambah path
    ->withQuery(['page' => 2])                          → Tambah query
    ->withFragment('section-1')                         → Tambah fragment
```

### ⚙️ Default Values
```
URL::defaults(['locale' => 'en'])                        → Set default parameter
// Harus di middleware sebelum SubstituteBindings
```

### 🎨 Best Practices
```
✅ Gunakan named routes, bukan hardcoded URLs
✅ Gunakan signed URLs untuk link sensitif
✅ Gunakan model binding langsung
✅ Set default values untuk parameter umum
✅ Validasi signed URLs dengan middleware
✅ Gunakan URL fluent untuk manipulasi kompleks
```

### 🚨 Security Considerations
```
✅ Validasi selalu signed URLs untuk link sensitif
✅ Jangan expose parameter sensitif dalam URLs
✅ Gunakan temporary signed URLs untuk akses terbatas
✅ Regenerasi signature secara berkala untuk keamanan
✅ Logging akses ke signed URLs sensitif
```

### 📊 Testing URLs
```
$this->get(route('posts.index'))->assertOk();
$this->followingRedirects()->get(route('posts.show', $post))->assertOk();
URL::fake(); // Mock URL facade untuk testing
```

### 🛠️ Vite Commands
```
npm run dev                 → Jalankan development server
npm run build               → Build untuk production
npm run preview             → Preview build production
vite --host 0.0.0.0         → Buka ke network
vite --port 3000            → Gunakan port custom
```

### 📦 Vite Configuration
```
input: [...]                → Entry points
refresh: [...]              → File yang memicu refresh
ssr: 'ssr.js'              → Entry point SSR
manualChunks: {...}         → Code splitting
minify: 'terser'           → Minification
```

### 🔧 Blade Directives
```
@vite([...])                → Muat asset
@viteReactRefresh           → HMR untuk React
@vitePrefetch               → Prefetch asset
Vite::asset('path')         → Asset statis
Vite::prefetch()            → Enable prefetching
```

---

## 15. 🎯 Kesimpulan

URL Generation dan Asset Building adalah sistem penting dalam aplikasi Laravel yang memastikan:

- **Aplikasi memiliki URL yang konsisten dan dinamis**
- **Asset frontend dioptimalkan untuk performa terbaik**
- **Keamanan terjaga dengan signed URLs dan validasi**
- **Maintainability tinggi dengan named routes**
- **User experience yang baik dengan HMR dan caching**

Dengan memahami konsep berikut:

- **Dasar URL generation** dengan helper `url()` dan `route()`
- **Named routes** untuk organisasi routing yang baik
- **Signed URLs** untuk keamanan link publik
- **Asset building dengan Vite** untuk frontend modern
- **Framework integration** (Vue, React) untuk SPA
- **Optimasi dan performance tuning** untuk production
- **Best practices** untuk keamanan dan maintainability

Kamu sekarang siap membuat aplikasi Laravel yang memiliki sistem URL dan asset yang kuat, aman, dan efisien. Ingat selalu bahwa URL dan asset yang baik bukan hanya tentang alamat yang benar, tapi juga tentang pengalaman pengguna yang optimal dan aplikasi yang mudah dikelola.

Selamat mengembangkan aplikasi kamu, muridku! Dengan kuasai URL generation dan asset building, kamu sudah melangkah jauh dalam membuat aplikasi web yang profesional dan modern.
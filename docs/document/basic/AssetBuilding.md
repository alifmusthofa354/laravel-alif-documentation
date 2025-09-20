# 📘 Asset Bundling dengan Vite di Laravel

## 1. Pendahuluan

Vite adalah **alat build frontend modern** yang sangat cepat untuk pengembangan, dan juga dapat melakukan bundling kode untuk produksi.
Dalam ekosistem Laravel, Vite digunakan untuk mengompilasi file **CSS** dan **JavaScript** menjadi asset siap produksi.

Laravel menyediakan **plugin resmi** serta **Blade directive (@vite)** agar integrasi dengan Vite lebih mudah, baik untuk mode pengembangan maupun produksi.

---

## 2. Instalasi & Setup

### 2.1. Instalasi Node.js & NPM

Sebelum menggunakan Vite, pastikan **Node.js (versi 16 ke atas)** dan **NPM** sudah terpasang:

```bash
node -v
npm -v
```

Jika menggunakan Laravel Sail, jalankan perintah berikut:

```bash
./vendor/bin/sail node -v
./vendor/bin/sail npm -v
```

### 2.2. Instalasi Dependensi Frontend

Di dalam instalasi Laravel yang baru, sudah terdapat file `package.json`. Untuk menginstal dependensi frontend, cukup jalankan:

```bash
npm install
```

---

## 3. Konfigurasi Vite

### 3.1. File `vite.config.js`

Vite dikonfigurasi melalui file `vite.config.js` di root proyek.
Contoh konfigurasi standar untuk Laravel:

```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel([
            'resources/css/app.css',
            'resources/js/app.js',
        ]),
    ],
});
```

### 3.2. SPA (Single Page Application)

Jika membuat SPA (misalnya dengan Inertia), sebaiknya **CSS diimpor dari JavaScript**:

```javascript
// resources/js/app.js
import './bootstrap';
import '../css/app.css';
```

---

## 4. Menjalankan Development Server

Untuk menjalankan server pengembangan:

```bash
npm run dev
```

Untuk melakukan build ke mode produksi:

```bash
npm run build
```

Jika menggunakan Laravel Sail di WSL2, tambahkan konfigurasi HMR agar browser bisa terkoneksi:

```javascript
// vite.config.js
export default defineConfig({
    server: {
        hmr: { host: 'localhost' },
    },
});
```

---

## 5. Memuat Asset di Blade

Laravel menyediakan directive `@vite` untuk memuat asset di template Blade:

```blade
<!DOCTYPE html>
<html>
<head>
    {{-- Jika CSS diimpor terpisah --}}
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <h1>Halo Laravel + Vite</h1>
</body>
</html>
```

Jika CSS sudah diimpor lewat JavaScript, cukup sertakan JS saja:

```blade
@vite('resources/js/app.js')
```

---

## 6. Menggunakan Framework Frontend

### 6.1. Vue

Install plugin Vue untuk Vite:

```bash
npm install --save-dev @vitejs/plugin-vue
```

Konfigurasi `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        laravel(['resources/js/app.js']),
        vue(),
    ],
});
```

### 6.2. React

Install plugin React:

```bash
npm install --save-dev @vitejs/plugin-react
```

Konfigurasi:

```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel(['resources/js/app.jsx']),
        react(),
    ],
});
```

Di Blade, tambahkan:

```blade
@viteReactRefresh
@vite('resources/js/app.jsx')
```

---

## 7. Mengelola Asset Statis

Untuk memproses gambar/font di dalam `resources/`, daftarkan dengan `import.meta.glob`:

```javascript
// resources/js/app.js
import.meta.glob([
    '../images/**',
    '../fonts/**',
]);
```

Kemudian di Blade:

```blade
<img src="{{ Vite::asset('resources/images/logo.png') }}">
```

---

## 8. Refresh Otomatis

Agar browser **refresh otomatis** saat file Blade diubah:

```javascript
export default defineConfig({
    plugins: [
        laravel({
            refresh: true,
        }),
    ],
});
```

---

## 9. Advanced Topics

### 9.1. Asset Prefetching

Untuk mempercepat SPA, Laravel mendukung **prefetch asset**:

```php
// App\Providers\AppServiceProvider.php
use Illuminate\Support\Facades\Vite;

public function boot(): void
{
    Vite::prefetch(concurrency: 3);
}
```

### 9.2. Server-Side Rendering (SSR)

Tambahkan entry point `resources/js/ssr.js`:

```javascript
export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            ssr: 'resources/js/ssr.js',
        }),
    ],
});
```

### 9.3. Subresource Integrity (SRI)

Aktifkan **integrity check** untuk keamanan:

```bash
npm install --save-dev vite-plugin-manifest-sri
```

```javascript
import manifestSRI from 'vite-plugin-manifest-sri';

export default defineConfig({
    plugins: [
        laravel(),
        manifestSRI(),
    ],
});
```

---

## 10. Kesimpulan

Dengan integrasi Laravel dan Vite, proses **pengembangan frontend lebih cepat** berkat HMR (Hot Module Replacement), serta asset yang dihasilkan untuk produksi lebih **optimal, aman, dan mudah dikelola**.

* Untuk pemula, cukup gunakan **starter kit Laravel (Breeze, Jetstream, atau Laravel Herd)**.
* Untuk penggunaan lanjut, Anda dapat melakukan **custom alias, SSR, prefetching, SRI, hingga CSP nonce**.

---

# 🎵 Laravel Mix

Laravel Mix menyediakan API yang indah untuk mendefinisikan langkah-langkah build webpack dasar untuk aplikasi Anda. Mix adalah lapisan konfigurasi di atas webpack, sehingga Anda dapat menggunakan kekuatan webpack tanpa kompleksitas yang menjengkelkan.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Menjalankan Mix](#menjalankan-mix)
4. [Bekerja dengan Stylesheet](#bekerja-dengan-stylesheet)
5. [Bekerja dengan JavaScript](#bekerja-dengan-javascript)
6. [Copy Files & Directories](#copy-files--directories)
7. [Versioning & Cache Busting](#versioning--cache-busting)
8. [URL Processing](#url-processing)
9. [Hot Module Replacement](#hot-module-replacement)
10. [CSS Preprocessors](#css-preprocessors)
11. [FastSass](#fastsass)

## 🎯 Pendahuluan

Laravel Mix adalah wrapper di sekitar webpack yang menyediakan API yang indah untuk mendefinisikan langkah-langkah build webpack dasar untuk aplikasi Anda. Mix membuat proses menggunakan webpack menjadi sederhana dan mudah dipahami.

### ✨ Fitur Utama
- Kompilasi CSS dan JavaScript
- Minifikasi otomatis
- Prefix vendor otomatis
- Compiling Sass, Less, dan Stylus
- Hot Module Replacement
- Versioning dan cache busting
- Source maps
- Asset copying

### ⚠️ Catatan Penting
Laravel Mix telah di-deprecated dan tidak lagi dikembangkan secara aktif. Untuk project baru, pertimbangkan untuk menggunakan Vite yang sudah dikonfigurasi secara default dalam Laravel.

## 📦 Instalasi

### 🎯 Menginstal Node
Sebelum menginstal Mix, Anda perlu memastikan bahwa Node.js dan NPM telah diinstal di mesin Anda:

```bash
node -v
npm -v
```

### 🛠️ Menginstal Mix
Dalam instalasi Laravel yang fresh, Anda akan menemukan file `package.json` di root direktori Anda. File ini menyertakan semua dependensi frontend yang diperlukan. Untuk menginstal dependensi ini, jalankan:

```bash
npm install
```

### 📄 File Konfigurasi
Setelah menginstal dependensi, Anda akan menemukan file `webpack.mix.js` di root direktori Anda. File ini adalah file konfigurasi utama untuk semua aset Mix Anda.

```javascript
const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .postCss('resources/css/app.css', 'public/css', [
        //
    ]);
```

## ▶️ Menjalankan Mix

### 🚀 Menjalankan Tugas Mix
Ada beberapa perintah NPM yang dapat Anda gunakan untuk menjalankan tugas Mix:

```bash
# Menjalankan semua tugas Mix sekali
npm run dev

# Menjalankan semua tugas Mix dan minify output
npm run production

# Menjalankan semua tugas Mix secara terus-menerus saat file berubah
npm run watch

# Menjalankan semua tugas Mix secara terus-menerus saat file berubah (dengan polling)
npm run watch-poll
```

### 📋 Monitoring Assets
Untuk memonitor aset Anda saat file berubah, jalankan:

```bash
npm run watch
```

## 🎨 Bekerja dengan Stylesheet

### 📄 Compiling Sass
Untuk mengkompilasi file Sass ke CSS, gunakan metode `sass`:

```javascript
mix.sass('resources/sass/app.scss', 'public/css');
```

### 📄 Compiling Less
Untuk mengkompilasi file Less ke CSS, gunakan metode `less`:

```javascript
mix.less('resources/less/app.less', 'public/css');
```

### 📄 Compiling Stylus
Untuk mengkompilasi file Stylus ke CSS, gunakan metode `stylus`:

```javascript
mix.stylus('resources/stylus/app.styl', 'public/css');
```

### 📄 Plain CSS
Untuk mengkompilasi file CSS biasa, gunakan metode `postCss`:

```javascript
mix.postCss('resources/css/app.css', 'public/css', [
    require('tailwindcss'),
    require('autoprefixer'),
]);
```

### 🎨 CSS Minification
Dalam mode produksi, Mix secara otomatis akan minify semua file CSS:

```bash
npm run production
```

### 🎨 CSS Prefix Vendor
Mix secara otomatis menambahkan prefix vendor ke CSS Anda menggunakan Autoprefixer:

```javascript
mix.sass('resources/sass/app.scss', 'public/css')
    .options({
        autoprefixer: {
            options: {
                browsers: [
                    'last 6 versions',
                ]
            }
        }
    });
```

## 📜 Bekerja dengan JavaScript

### 📄 Basic JavaScript Compilation
Untuk mengkompilasi file JavaScript, gunakan metode `js`:

```javascript
mix.js('resources/js/app.js', 'public/js');
```

### 📦 Vendor Extraction
Untuk mengekstrak library vendor ke file terpisah, gunakan metode `extract`:

```javascript
mix.js('resources/js/app.js', 'public/js')
    .extract(['vue', 'jquery']);
```

### 📦 React Support
Untuk mengaktifkan dukungan React, gunakan metode `react`:

```javascript
mix.react('resources/js/app.jsx', 'public/js');
```

### 📦 Vue Support
Untuk mengaktifkan dukungan Vue, gunakan metode `vue`:

```javascript
mix.js('resources/js/app.js', 'public/js')
    .vue();
```

### 📦 JavaScript Minification
Dalam mode produksi, Mix secara otomatis akan minify semua file JavaScript:

```bash
npm run production
```

## 📁 Copy Files & Directories

### 📋 Copy Files
Untuk menyalin file ke direktori public, gunakan metode `copy`:

```javascript
mix.copy('node_modules/foo/bar.css', 'public/css/bar.css');
```

### 📋 Copy Directories
Untuk menyalin seluruh direktori, gunakan metode yang sama:

```javascript
mix.copy('vendor/foo/project/assets/img', 'public/img');
```

### 📋 Copy with Versioning
Untuk menyalin file dengan versioning otomatis:

```javascript
mix.copy('resources/img', 'public/img')
    .version();
```

## 🔢 Versioning & Cache Busting

### 📋 Versioning Assets
Untuk menambahkan versioning ke aset Anda (cache busting), gunakan metode `version`:

```javascript
mix.js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .version();
```

### 📋 Menggunakan Versioned Assets
Dalam template Blade Anda, gunakan helper `mix` untuk menghasilkan URL yang benar:

```blade
<link rel="stylesheet" href="{{ mix('css/app.css') }}">
<script src="{{ mix('js/app.js') }}"></script>
```

## 🔗 URL Processing

### 📋 Resolving URLs
Setelah mengkompilasi CSS, Mix secara otomatis mengubah setiap URL `url()` dalam stylesheet Anda:

```css
.example {
    background: url('../images/example.png');
}
```

### 📋 Disabling URL Processing
Untuk menonaktifkan pemrosesan URL, gunakan opsi `processCssUrls`:

```javascript
mix.sass('resources/sass/app.scss', 'public/css')
    .options({
        processCssUrls: false
    });
```

## 🔥 Hot Module Replacement

### 🚀 Mengaktifkan HMR
Hot Module Replacement (HMR) menyediakan pengalaman pengembangan yang luar biasa, langsung memperbarui modul di browser saat Anda mengubah kode sumber Anda.

Pertama, gunakan perintah `hot` untuk memulai server pengembangan:

```bash
npm run hot
```

### 📋 Konfigurasi HMR
Anda mungkin perlu mengkonfigurasi server pengembangan untuk HMR:

```javascript
mix.js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .options({
        hmrOptions: {
            host: 'your-site.test',
            port: 8080,
        }
    });
```

### 📋 Menggunakan HMR dalam Blade
Dalam template Blade Anda, gunakan helper `mix` untuk memuat file HMR:

```blade
@if (app()->isLocal())
    <script src="http://localhost:8080/js/bundle.js"></script>
@else
    <script src="{{ mix('js/app.js') }}"></script>
@endif
```

## 🎨 CSS Preprocessors

### 🎨 Sass
Untuk mengkompilasi Sass ke CSS:

```javascript
mix.sass('resources/sass/app.scss', 'public/css');
```

### 🎨 Less
Untuk mengkompilasi Less ke CSS:

```javascript
mix.less('resources/less/app.less', 'public/css');
```

### 🎨 Stylus
Untuk mengkompilasi Stylus ke CSS:

```javascript
mix.stylus('resources/stylus/app.styl', 'public/css');
```

### 🎨 Customizing Preprocessor Options
Anda dapat menyesuaikan opsi preprocessor:

```javascript
mix.sass('resources/sass/app.scss', 'public/css', {
    sassOptions: {
        outputStyle: 'compressed',
    }
});
```

## ⚡ FastSass

### 🚀 Menggunakan FastSass
FastSass adalah implementasi alternatif dari Sass yang lebih cepat:

```javascript
mix.fastSass('resources/sass/app.scss', 'public/css');
```

### 📋 Keuntungan FastSass
- Waktu kompilasi yang lebih cepat
- Penggunaan memori yang lebih rendah
- Kompatibilitas dengan sebagian besar fitur Sass

### 📋 Konfigurasi FastSass
```javascript
mix.fastSass('resources/sass/app.scss', 'public/css')
    .options({
        fastSass: {
            includePaths: ['node_modules'],
        }
    });
```

## 🧠 Kesimpulan

Laravel Mix menyediakan cara yang sederhana dan elegan untuk mengkompilasi aset frontend dalam aplikasi Laravel Anda. Meskipun Mix telah di-deprecated, itu masih digunakan dalam banyak aplikasi Laravel yang sudah ada.

### 🔑 Keuntungan Utama
- API yang sederhana dan intuitif
- Kompilasi CSS dan JavaScript yang kuat
- Minifikasi otomatis
- Prefix vendor otomatis
- Dukungan untuk berbagai preprocessor CSS
- Hot Module Replacement
- Versioning dan cache busting
- Asset copying

### ⚠️ Peringatan Penting
Laravel Mix telah di-deprecated dan tidak lagi dikembangkan secara aktif. Untuk project baru, disarankan untuk menggunakan Vite yang sudah dikonfigurasi secara default dalam Laravel.

### 🚀 Migration ke Vite
Untuk migrasi dari Mix ke Vite, Anda dapat:

1. Menghapus dependensi Mix dari `package.json`
2. Menginstal Vite: `npm install --save-dev vite laravel-vite-plugin`
3. Membuat file `vite.config.js`
4. Memperbarui script dalam `package.json`
5. Memperbarui template Blade untuk menggunakan `@vite` directive

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Mix untuk mengkompilasi aset frontend dalam aplikasi Laravel Anda.
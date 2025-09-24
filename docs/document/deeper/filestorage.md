# 📁 File Storage di Laravel: Panduan Simpan & Akses File dari Guru Kesayanganmu

Hai murid-murid kesayanganku! Hari ini kita akan membahas salah satu fitur **sangat penting** dalam dunia web development: **File Storage**! 📦

Bayangkan kamu sedang membuat aplikasi seperti Instagram, Google Drive, atau marketplace. Pengguna ingin upload foto profil, unggah produk dengan gambar, atau download file penting. Nah, **File Storage** di Laravel adalah seperti **gudang digital** yang bisa kamu gunakan untuk menyimpan, mengamankan, dan mengakses file-file tersebut!

Laravel menggunakan sistem yang disebut **Flysystem** yang membuat semua operasi file jadi super mudah dan konsisten, apakah kamu simpan di server lokal, cloud storage, atau tempat lainnya.

Setelah beberapa kali revisi, aku yakin kamu akan lebih mudah memahami konsep ini dengan penjelasan yang **super lengkap** tapi dijelaskan dengan **super sederhana**. Siap? Ayo kita mulai petualangan penyimpanan file ini!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih File Storage Itu Sebenarnya?

**Analogi:** Bayangkan kamu seorang penjaga gudang di toko serba ada. Kamu punya banyak ruangan berbeda:
- **Gudang lokal**: Tempat penyimpanan di toko sendiri
- **Gudang di pusat kota**: Tempat penyimpanan eksternal
- **Gudang premium**: Tempat penyimpanan yang bisa diakses pelanggan
- **Gudang terkunci**: Tempat penyimpanan rahasia

**File Storage** di Laravel adalah sistem gudangmu untuk menyimpan file. Ia bisa:
- **Menyimpan file** (gambar, PDF, video, dll)
- **Mengambil file** saat dibutuhkan
- **Mengamankan file** dari akses tidak sah
- **Mengelola file** di berbagai lokasi (lokal, cloud, dll)

**Mengapa ini penting?** Karena hampir semua aplikasi modern butuh menyimpan dan mengelola file. Dari foto profil, dokumen, hingga file hasil laporan - semua butuh tempat penyimpanan yang aman dan efisien.

**Bagaimana cara kerjanya?** 
1.  **Kamu punya file**: Misalnya foto dari form upload.
2.  **Kirim ke sistem storage**: Laravel bawa file itu ke tempat penyimpanan.
3.  **Simpan dengan aman**: File diacak nama dan ditempatkan di lokasi yang ditentukan.
4.  **Akses kapan pun**: Kamu bisa ambil dan tampilkan file saat dibutuhkan.

Tanpa File Storage yang benar, kamu bisa menghadapi masalah keamanan, performance, dan scalability.

### 2. ✍️ Resep Pertamamu: Simpan File di Lokal

Mari kita buat contoh pertama: menyimpan foto profil user ke storage lokal. Kita akan buat dari nol, langkah demi langkah.

#### Langkah 1️⃣: Siapkan Alatnya (Konfigurasi Filesystem)

**Mengapa?** Kita harus setup tempat penyimpanan file kita.

**Bagaimana?** Laravel menyimpan konfigurasi di `config/filesystems.php`. Di sana ada beberapa **disk** yang bisa kamu gunakan:

```php
// config/filesystems.php
'disks' => [
    'local' => [
        'driver' => 'local',
        'root' => storage_path('app'), // Lokasi default: storage/app
        'throw' => false,
    ],
    'public' => [
        'driver' => 'local', 
        'root' => storage_path('app/public'), // Lokasi file publik
        'url' => env('APP_URL').'/storage', // URL untuk akses publik
        'visibility' => 'public',
        'throw' => false,
    ],
],
```

#### Langkah 2️⃣: Siapkan Symbolic Link untuk File Publik

**Mengapa?** Agar file di `storage/app/public` bisa diakses dari web (misalnya foto profil yang bisa dilihat semua orang).

**Bagaimana?** Jalankan perintah Artisan:
```bash
php artisan storage:link
```
Ini membuat link dari `public/storage` ke `storage/app/public`.

#### Langkah 3️⃣: Gunakan File Storage di Controller

**Mengapa?** Kita perlu cara untuk menyimpan file upload ke storage.

**Bagaimana?** Di controller kamu:
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\RedirectResponse;

class ProfileController extends Controller
{
    public function updateAvatar(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Validasi file
        ]);

        if ($request->hasFile('avatar')) {
            // Simpan file ke disk public
            $path = $request->file('avatar')->store('avatars', 'public');
            
            // Update avatar user
            $request->user()->update(['avatar_path' => $path]);
            
            return redirect()->back()->with('status', 'Avatar berhasil diupload!');
        }

        return redirect()->back()->with('error', 'File tidak valid!');
    }
}
```

**Penjelasan Kode:**
- `store('avatars', 'public')`: Simpan file ke folder `avatars` di disk `public`.
- `'public'`: Disk yang bisa diakses dari web.
- `$path`: Lokasi file yang disimpan (misalnya: `avatars/abc123.jpg`).

#### Langkah 4️⃣: Tampilkan File yang Disimpan

**Mengapa?** Agar user bisa melihat file yang sudah diupload.

**Bagaimana?** Di view kamu:
```blade
{{-- resources/views/profile.blade.php --}}
@if($user->avatar_path)
    <img src="{{ Storage::url($user->avatar_path) }}" alt="Avatar" class="rounded-circle">
@else
    <img src="{{ asset('images/default-avatar.png') }}" alt="Default Avatar" class="rounded-circle">
@endif
```

**Atau pakai helper asset() jika sudah buat symbolic link:**
```blade
<img src="{{ asset('storage/' . $user->avatar_path) }}" alt="Avatar" class="rounded-circle">
```

Selesai! 🎉 Sekarang user bisa upload dan lihat foto profil mereka secara aman.

### 3. ⚡ File Storage Spesialis (Streaming Upload)

**Analogi:** Bayangkan kamu sedang menerima kiriman barang besar. Daripada menunggu semua barang datang baru diproses, kamu bisa mulai proses sebagian-sebagian saat barang datang.

**Mengapa ini ada?** Untuk file yang sangat besar, agar tidak memakan memory server terlalu banyak.

**Bagaimana?** Laravel support streaming untuk file besar:
```php
// Simpan file besar tanpa memuat semua ke memory
$request->file('large_video')->storeAs('videos', 'video.mp4', 's3');
```

---

## Bagian 2: Jenis-Jenis Disk - Tempat Penyimpanan-mu 🧰

### 4. 📦 Disk Lokal (Private)

**Analogi:** Ini seperti ruang penyimpanan pribadi di rumahmu. Hanya kamu yang bisa masuk dan ambil barang.

**Mengapa?** Untuk file-file yang tidak boleh diakses publik (misalnya laporan internal, file backup).

**Bagaimana?**
```php
// Simpan ke disk lokal (private)
Storage::disk('local')->put('reports/secret.pdf', $content);

// Ambil file dari disk lokal
$report = Storage::disk('local')->get('reports/secret.pdf');
```

File akan disimpan di `storage/app/` dan **tidak bisa diakses langsung dari web**.

### 5. 🔓 Disk Publik

**Analogi:** Ini seperti rak buku di perpustakaan umum. Semua orang bisa ambil buku yang ditempatkan di sana.

**Mengapa?** Untuk file yang bisa diakses publik (foto profil, banner, logo).

**Bagaimana?**
```php
// Simpan ke disk publik
$path = Storage::disk('public')->put('images/avatar.jpg', $file);

// Dapatkan URL untuk ditampilkan
$url = Storage::disk('public')->url($path);
// Atau lebih pendek
$url = asset('storage/' . $path); // Harus sudah buat symbolic link!
```

### 6. ☁️ Disk Cloud (S3, SFTP, FTP)

**Analogi:** Ini seperti menyewa gudang besar di pusat kota. Banyak ruang, aman, dan bisa diakses dari mana saja.

**Mengapa?** Karena lebih scalable dan reliable dari simpan di server lokal.

**Cara setup S3 (contoh paling populer):**
1. Install dependency:
```bash
composer require league/flysystem-aws-s3-v3 "^3.0"
```

2. Atur di `.env`:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your_bucket_name
```

3. Konfigurasi di `config/filesystems.php`:
```php
's3' => [
    'driver' => 's3',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION'),
    'bucket' => env('AWS_BUCKET'),
    'url' => env('AWS_URL'),
    'endpoint' => env('AWS_ENDPOINT'),
    'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
    'throw' => false,
],
```

4. Gunakan di controller:
```php
// Upload ke S3
$path = $request->file('document')->store('documents', 's3');

// Dapatkan URL publik dari S3
$url = Storage::disk('s3')->url($path);
```

### 7. 🎛️ Disk Scoped (Dengan Prefix Otomatis)

**Analogi:** Seperti membuat kategori otomatis. Semua barang yang kamu simpan langsung masuk ke kategori "video" misalnya.

**Mengapa?** Untuk mengorganisir file dengan prefix otomatis.

**Bagaimana?**
```php
// Konfigurasi di config/filesystems.php
'video_storage' => [
    'driver' => 'scoped',
    'disk' => 's3',
    'prefix' => 'videos/user-uploads', // Semua file otomatis masuk sini
],

// Pakai seperti biasa, tapi file langsung ke prefix
Storage::disk('video_storage')->put('my_video.mp4', $content);
// File sebenarnya disimpan di: s3://bucket/videos/user-uploads/my_video.mp4
```

### 8. 🛡️ Disk Read-Only

**Analogi:** Seperti ruang arsip yang hanya boleh dibaca, tidak bisa ditulis atau diubah.

**Mengapa?** Untuk keamanan, agar data tidak bisa diubah secara tidak sengaja.

**Bagaimana?**
```php
// Konfigurasi di config/filesystems.php
'archive' => [
    'driver' => 's3',
    'read-only' => true, // Tidak bisa upload atau delete
    // ... konfigurasi lainnya
],

// Hanya bisa baca, tidak bisa tulis
$contents = Storage::disk('archive')->get('important_file.pdf');
Storage::disk('archive')->put('new_file.txt', 'content'); // Akan gagal!
```

---

## Bagian 3: Jurus Tingkat Lanjut - Operasi File Canggih 🚀

### 9. 📤 Upload File dari Request

**Mengapa?** Karena operasi upload adalah hal yang paling sering dilakukan.

**Method-method penting:**
```php
// Upload sederhana
$path = $request->file('avatar')->store('avatars');

// Upload dengan nama custom
$path = $request->file('avatar')->storeAs('avatars', 'user_' . $user->id . '.jpg');

// Upload ke disk tertentu
$path = $request->file('document')->store('documents', 's3');

// Upload dengan validasi dan ekstensi
if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
    $extension = $request->file('photo')->getClientOriginalExtension();
    $filename = time() . '.' . $extension;
    $path = $request->file('photo')->storeAs('photos', $filename, 'public');
}
```

### 10. 📥 Mengambil & Manipulasi File

**Mengapa?** Karena seringkali kamu perlu baca, cek, atau manipulasi file yang sudah disimpan.

**Method-method penting:**
```php
// Ambil konten file
$contents = Storage::get('file.jpg');

// Baca file JSON
$data = Storage::json('config.json');

// Cek apakah file ada
if (Storage::exists('file.jpg')) {
    // File ada
}

// Cek apakah file TIDAK ada
if (Storage::missing('file.jpg')) {
    // File tidak ada
}

// Dapatkan ukuran file
$size = Storage::size('file.jpg');

// Dapatkan waktu modifikasi
$time = Storage::lastModified('file.jpg');

// Dapatkan MIME type
$mimeType = Storage::mimeType('file.jpg');

// Unduh file ke browser user
return Storage::download('file.pdf', 'nama_file.pdf', ['Content-Type' => 'application/pdf']);
```

### 11. 🔧 Operasi File Lengkap

#### Menyimpan Data
```php
// Simpan string
Storage::put('file.txt', 'isi konten file');

// Simpan dari resource
Storage::put('file.txt', $resource);

// Tambahkan ke awal file
Storage::prepend('log.txt', 'pesan baru: ');

// Tambahkan ke akhir file
Storage::append('log.txt', PHP_EOL . 'pesan baru');
```

#### Menyalin & Memindahkan
```php
// Salin file
Storage::copy('old/file.jpg', 'new/file.jpg');

// Pindahkan file
Storage::move('old/file.jpg', 'new/file.jpg');

// Hapus file
Storage::delete('file.jpg');
Storage::delete(['file1.jpg', 'file2.jpg']); // Hapus banyak sekaligus
```

#### Visibilitas File
```php
// Simpan dengan visibilitas public
Storage::put('public_file.jpg', $content, 'public');

// Set visibilitas
Storage::setVisibility('file.jpg', 'private');

// Dapatkan visibilitas
$visibility = Storage::getVisibility('file.jpg');
```

### 12. 📂 Operasi Direktori

**Mengapa?** Karena seringkali kamu perlu lihat isi folder atau buat folder baru.

**Method-method penting:**
```php
$directory = 'photos';

// Dapatkan semua file di direktori
$files = Storage::files($directory);

// Dapatkan semua file termasuk subfolder
$allFiles = Storage::allFiles($directory);

// Dapatkan direktori di dalam direktori
$directories = Storage::directories($directory);

// Dapatkan semua direktori termasuk subfolder
$allDirectories = Storage::allDirectories($directory);

// Buat direktori baru
Storage::makeDirectory('new_folder/sub_folder');

// Hapus direktori
Storage::deleteDirectory('old_folder');
```

### 13. 🌐 Disk On-Demand

**Mengapa?** Jika kamu butuh setup disk temporary atau konfigurasi custom.

**Bagaimana?**
```php
// Buat disk secara dinamis
$disk = Storage::build([
    'driver' => 'local',
    'root' => storage_path('app/temp_' . $user->id),
]);

// Gunakan seperti biasa
$disk->put('temp_file.txt', 'content');
```

### 14. 🏷️ File Upload dengan Validasi & Manipulasi

**Contoh kompleks upload dengan validasi dan manipulasi:**
```php
public function uploadDocument(Request $request)
{
    $request->validate([
        'document' => 'required|file|mimes:pdf,doc,docx|max:10240', // Max 10MB
        'category' => 'required|string'
    ]);

    if ($request->hasFile('document')) {
        $file = $request->file('document');
        
        // Generate nama unik
        $filename = time() . '_' . $file->getClientOriginalName();
        
        // Simpan ke folder berdasarkan kategori
        $path = $file->storeAs('documents/' . $request->category, $filename, 's3');
        
        // Simpan info ke database
        Document::create([
            'user_id' => auth()->id(),
            'file_path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'category' => $request->category
        ]);

        return response()->json(['message' => 'File uploaded successfully', 'path' => $path]);
    }
}
```

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' File Storage 🧰

### 15. 🛡️ Security Best Practices

1. **Validasi file sebelum upload**:
```php
$validated = $request->validate([
    'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
]);
```

2. **Jangan percaya nama file dari user** - selalu generate nama baru.

3. **Simpan file sensitif di disk private** - jangan di public.

4. **Gunakan signed URL untuk akses temporary**:
```php
// Generate URL dengan expiry time
$url = Storage::temporaryUrl('file.pdf', now()->addMinutes(5));
```

### 16. 🚀 Performance & Optimization

1. **Gunakan cloud storage untuk file besar** - hindari overload server lokal.
2. **Gunakan queue untuk operasi file besar** - jangan blokir request.
3. **Cache URL file** - hindari generate URL berulang-ulang.
4. **Gunakan compression untuk file besar**.

### 17. 🧪 Testing File Storage

**Mengapa?** Pastikan upload dan storage bekerja saat testing.

**Bagaimana?**
```php
<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class FileUploadTest extends TestCase
{
    public function test_user_can_upload_avatar()
    {
        // Gunakan fake disk untuk testing
        Storage::fake('public');
        
        $file = UploadedFile::fake()->image('avatar.jpg');
        
        $response = $this->post('/profile/upload-avatar', [
            'avatar' => $file
        ]);
        
        // Cek file benar-benar diupload
        Storage::disk('public')->assertExists('avatars/' . $file->hashName());
        
        $response->assertStatus(200);
    }
    
    public function test_large_file_rejected()
    {
        Storage::fake('public');
        
        // Buat file besar (100MB)
        $file = UploadedFile::fake()->create('large_file.pdf', 102400); // KB
        
        $response = $this->post('/upload', [
            'document' => $file
        ]);
        
        $response->assertStatus(422); // Validation error
    }
}
```

### 18. 🌐 Custom Filesystem Driver

**Mengapa?** Jika kamu ingin gunakan storage service yang tidak didukung Laravel secara default.

**Bagaimana?** Di Service Provider (misalnya `AppServiceProvider`):
```php
use Illuminate\Support\Facades\Storage;
use League\Flysystem\Filesystem;
use Spatie\FlysystemDropbox\DropboxAdapter;

public function boot()
{
    Storage::extend('dropbox', function ($app, $config) {
        $client = new \Spatie\Dropbox\Client($config['authorization_token']);
        $adapter = new DropboxAdapter($client);
        
        return new \Illuminate\Filesystem\FilesystemAdapter(
            new Filesystem($adapter, $config),
            $adapter,
            $config
        );
    });
}
```

Konfigurasi di `config/filesystems.php`:
```php
'dropbox' => [
    'driver' => 'dropbox',
    'authorization_token' => env('DROPBOX_TOKEN'),
],
```

### 19. 🎨 File Processing & Manipulation

**Contoh: Resize image sebelum simpan:**
```php
// Install: composer require intervention/image
use Intervention\Image\Facades\Image;

public function uploadAvatar(Request $request)
{
    if ($request->hasFile('avatar')) {
        $image = $request->file('avatar');
        
        // Resize image
        $resizedImage = Image::make($image)->resize(300, 300)->stream();
        
        // Simpan yang sudah diresize
        $path = Storage::disk('public')->put('avatars/' . time() . '.jpg', $resizedImage);
        
        return response()->json(['path' => $path]);
    }
}
```

---

## Bagian 5: Menjadi Master File Storage 🏆

### 20. ✨ Wejangan dari Guru

1.  **Pilih disk yang tepat**: Private untuk data sensitif, public untuk file yang bisa diakses, S3 untuk skalabilitas.
2.  **Selalu validasi file upload**: Jangan percaya input user!
3.  **Gunakan queue untuk file besar**: Jangan block request.
4.  **Pertimbangkan security**: Signed URL, visibilitas file, dll.
5.  **Test dengan fake storage**: Gunakan `Storage::fake()` di testing.
6.  **Gunakan symbolic link dengan benar**: Untuk file publik, buat link dari public ke storage.

### 21. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur File Storage di Laravel:

#### 📁 Basic Operations
| Method | Fungsi |
|--------|--------|
| `Storage::put('file.txt', 'content')` | Simpan file |
| `Storage::get('file.txt')` | Ambil konten file |
| `Storage::exists('file.txt')` | Cek apakah file ada |
| `Storage::delete('file.txt')` | Hapus file |
| `Storage::download('file.txt')` | Unduh file ke browser |

#### 📤 File Upload
| Method | Fungsi |
|--------|--------|
| `$request->file('photo')->store('photos')` | Upload ke folder photos |
| `$request->file('photo')->storeAs('photos', 'name.jpg')` | Upload dengan nama custom |
| `$request->file('photo')->store('photos', 's3')` | Upload ke disk S3 |

#### 🔍 File Information
| Method | Fungsi |
|--------|--------|
| `Storage::size('file.txt')` | Dapatkan ukuran file |
| `Storage::mimeType('file.txt')` | Dapatkan MIME type |
| `Storage::lastModified('file.txt')` | Dapatkan waktu modifikasi |
| `Storage::url('file.txt')` | Dapatkan URL file |

#### 📂 Directory Operations
| Method | Fungsi |
|--------|--------|
| `Storage::files('dir')` | Dapatkan file di direktori |
| `Storage::directories('dir')` | Dapatkan subdirektori |
| `Storage::makeDirectory('new_dir')` | Buat direktori baru |
| `Storage::deleteDirectory('old_dir')` | Hapus direktori |

#### 🛡️ Security & Validation
| Method | Fungsi |
|--------|--------|
| `Storage::setVisibility('file.txt', 'public')` | Set visibilitas |
| `Storage::getVisibility('file.txt')` | Dapatkan visibilitas |
| `Storage::temporaryUrl('file.txt', $time)` | Dapatkan temporary URL |

#### 🧪 Testing
| Method | Fungsi |
|--------|--------|
| `Storage::fake('disk_name')` | Buat fake disk untuk testing |
| `Storage::assertExists('file.txt')` | Cek file ada di storage |
| `Storage::assertMissing('file.txt')` | Cek file tidak ada di storage |

#### 🌐 Multiple Disks
| Method | Fungsi |
|--------|--------|
| `Storage::disk('s3')->put('file.txt', 'content')` | Gunakan disk tertentu |
| `Storage::build([...])` | Buat disk on-demand |
| `'links' => [...]` in `config/filesystems.php` | Setup symbolic links |

### 22. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi File Storage, dari yang paling dasar sampai yang paling rumit. Kamu hebat! 

Dengan File Storage, kamu bisa membuat aplikasi yang **mengelola file dengan aman dan efisien**. Dari upload foto profil, dokumen penting, hingga file besar seperti video - semua bisa kamu tangani dengan Laravel Storage.

**Ingat**: File Storage adalah tanggung jawab besar. Selalu pertimbangkan:
- **Security**: Validasi file dan kontrol akses
- **Performance**: Gunakan cloud storage dan queue saat perlu
- **Scalability**: Pilih solusi yang bisa tumbuh dengan aplikasimu
- **Testing**: Gunakan fake disk agar test tetap cepat dan aman

Jangan pernah berhenti belajar dan mencoba! Implementasikan File Storage di proyekmu dan lihat betapa aman dan efisien aplikasimu bisa menjadi.

Selamat ngoding, murid kesayanganku! 🚀✨
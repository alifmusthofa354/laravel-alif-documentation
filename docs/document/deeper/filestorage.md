# **File Storage**

## **1. Pendahuluan**

Laravel menyediakan abstraksi sistem file yang kuat berkat paket PHP **Flysystem**. Dengan integrasi ini, Laravel mempermudah penggunaan berbagai *driver* penyimpanan seperti lokal, SFTP, FTP, dan Amazon S3. Kelebihan utama adalah API yang konsisten, sehingga Anda dapat beralih antar *disk* tanpa mengubah kode.



## **2. Konfigurasi Sistem File**

File konfigurasi sistem file Laravel berada di `config/filesystems.php`. Di sini, Anda dapat menentukan beberapa **disk**, yaitu kombinasi driver dan lokasi penyimpanan. Laravel menyediakan contoh konfigurasi untuk *local*, *sftp*, dan *s3*.

### **2.1 Disk Lokal**

Disk lokal digunakan untuk menyimpan file pada server tempat aplikasi berjalan. Secara default, root direktori berada di `storage/app/private`.

**Contoh kode:**

```php
use Illuminate\Support\Facades\Storage;

Storage::disk('local')->put('example.txt', 'Isi file contoh');
```



### **2.2 Disk Publik**

Disk publik digunakan untuk file yang dapat diakses publik. Root default: `storage/app/public`. Agar dapat diakses dari web, buat symbolic link:

```bash
php artisan storage:link
```

Setelah itu, Anda dapat membuat URL file:

```php
echo asset('storage/file.txt');
```

Contoh konfigurasi *links* di `config/filesystems.php`:

```php
'links' => [
    public_path('storage') => storage_path('app/public'),
    public_path('images') => storage_path('app/images'),
],
```

Untuk menghapus link simbolik:

```bash
php artisan storage:unlink
```



### **2.3 Prasyarat Driver**

* **S3**:

  ```bash
  composer require league/flysystem-aws-s3-v3 "^3.0" --with-all-dependencies
  ```

  Variabel lingkungan:

  ```
  AWS_ACCESS_KEY_ID=
  AWS_SECRET_ACCESS_KEY=
  AWS_DEFAULT_REGION=
  AWS_BUCKET=
  AWS_USE_PATH_STYLE_ENDPOINT=false
  ```

* **FTP**:

  ```bash
  composer require league/flysystem-ftp "^3.0"
  ```

  Contoh konfigurasi:

  ```php
  'ftp' => [
      'driver' => 'ftp',
      'host' => env('FTP_HOST'),
      'username' => env('FTP_USERNAME'),
      'password' => env('FTP_PASSWORD'),
  ],
  ```

* **SFTP**:

  ```bash
  composer require league/flysystem-sftp-v3 "^3.0"
  ```

  Contoh konfigurasi:

  ```php
  'sftp' => [
      'driver' => 'sftp',
      'host' => env('SFTP_HOST'),
      'username' => env('SFTP_USERNAME'),
      'password' => env('SFTP_PASSWORD'),
      'privateKey' => env('SFTP_PRIVATE_KEY'),
      'passphrase' => env('SFTP_PASSPHRASE'),
  ],
  ```



### **2.4 Disk Scoped dan Read-Only**

* **Scoped**: Menambahkan *prefix* otomatis pada semua path.

  ```php
  's3-videos' => [
      'driver' => 'scoped',
      'disk' => 's3',
      'prefix' => 'path/to/videos',
  ],
  ```
* **Read-only**: Disk hanya bisa dibaca.

  ```bash
  composer require league/flysystem-read-only "^3.0"
  ```

  ```php
  's3-videos' => [
      'driver' => 's3',
      'read-only' => true,
  ],
  ```



## **3. Menggunakan Disk**

Untuk menggunakan disk:

```php
use Illuminate\Support\Facades\Storage;

// Disk default
Storage::put('avatars/1', $content);

// Disk spesifik
Storage::disk('s3')->put('avatars/1', $content);

// Disk on-demand
$disk = Storage::build([
    'driver' => 'local',
    'root' => '/path/to/root',
]);
$disk->put('image.jpg', $content);
```



## **4. Mengambil dan Mengunduh File**

### **4.1 Mengambil Konten**

```php
$contents = Storage::get('file.jpg');
$orders = Storage::json('orders.json');
```

### **4.2 Mengecek File**

```php
if (Storage::disk('s3')->exists('file.jpg')) { /* ... */ }
if (Storage::disk('s3')->missing('file.jpg')) { /* ... */ }
```

### **4.3 Mengunduh File**

```php
return Storage::download('file.jpg', 'nama_file.jpg', ['Content-Type' => 'image/jpeg']);
```

### **4.4 Mendapatkan URL**

```php
$url = Storage::url('file.jpg');
```



## **5. Menyimpan File**

### **5.1 Menyimpan Konten**

```php
Storage::put('file.jpg', $contents);
Storage::put('file.jpg', $resource);
```

### **5.2 Menambahkan Konten**

```php
Storage::prepend('file.log', 'Teks Awal');
Storage::append('file.log', 'Teks Akhir');
```

### **5.3 Menyalin dan Memindahkan File**

```php
Storage::copy('old/file.jpg', 'new/file.jpg');
Storage::move('old/file.jpg', 'new/file.jpg');
```

### **5.4 Streaming File**

```php
use Illuminate\Http\File;

$path = Storage::putFile('photos', new File('/path/to/photo'));
$path = Storage::putFileAs('photos', new File('/path/to/photo'), 'photo.jpg');
```



## **6. Upload File**

### **6.1 Upload Sederhana**

```php
$path = $request->file('avatar')->store('avatars');
```

### **6.2 Menentukan Nama File**

```php
$path = $request->file('avatar')->storeAs('avatars', $request->user()->id);
```

### **6.3 Menentukan Disk**

```php
$path = $request->file('avatar')->store('avatars/'.$request->user()->id, 's3');
```



## **7. Visibilitas File**

```php
Storage::put('file.jpg', $contents, 'public');

$visibility = Storage::getVisibility('file.jpg');
Storage::setVisibility('file.jpg', 'public');
```

* Lokal: `public` = 0644, `private` = 0600
* Direktori: `public` = 0755, `private` = 0700



## **8. Menghapus File dan Direktori**

```php
Storage::delete('file.jpg');
Storage::delete(['file1.jpg','file2.jpg']);
Storage::deleteDirectory('nama_folder');
```



## **9. Direktori**

```php
$files = Storage::files($directory);
$allFiles = Storage::allFiles($directory);

$dirs = Storage::directories($directory);
$allDirs = Storage::allDirectories($directory);

Storage::makeDirectory('folder_baru');
Storage::deleteDirectory('folder_baru');
```



## **10. Testing File Uploads**

### **10.1 Menggunakan Fake Disk**

```php
Storage::fake('photos');

$response = $this->json('POST', '/photos', [
    UploadedFile::fake()->image('photo1.jpg'),
]);

Storage::disk('photos')->assertExists('photo1.jpg');
Storage::disk('photos')->assertMissing('missing.jpg');
```



## **11. Custom Filesystems**

### **11.1 Contoh Driver Dropbox**

```bash
composer require spatie/flysystem-dropbox
```

```php
Storage::extend('dropbox', function ($app, $config) {
    $adapter = new DropboxAdapter(new DropboxClient($config['authorization_token']));
    return new FilesystemAdapter(new Filesystem($adapter, $config), $adapter, $config);
});
```

Gunakan disk ini di `config/filesystems.php`:

```php
'dropbox' => [
    'driver' => 'dropbox',
    'authorization_token' => env('DROPBOX_TOKEN'),
],
```

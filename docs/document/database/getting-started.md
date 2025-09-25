# 📚 Database di Laravel: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Setelah beberapa kali revisi, akhirnya Guru paham apa yang sebenarnya kalian inginkan: sebuah panduan yang **super lengkap** tapi dijelaskan dengan **super sederhana**, seolah-olah Guru sedang duduk di sebelahmu sambil menjelaskan pelan-pelan.

Di edisi ini, kita akan kupas tuntas **semua detail** tentang Database di Laravel, tapi setiap topik akan Guru ajarkan dengan sabar. Siap? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基 礎

### 1. 📖 Apa Sih Database Itu Sebenarnya?

**Analogi:** Bayangkan kamu masuk ke toko buku besar favoritmu. Setiap buku disimpan rapi di rak-rak yang terorganisir. Kamu (pengguna) datang dengan sebuah **permintaan** (misalnya, "saya cari buku Laravel yang ditulis oleh Taylor"). Petugas toko (inilah **Database** kita) mencari di sistem raknya dan memberimu buku yang benar-benar kamu cari.

**Mengapa ini penting?** Karena tanpa database, semua informasi akan hilang saat kamu matikan komputer. Bisa bayangkan jika setiap kali aplikasimu dimatikan, semua data user hilang?

**Bagaimana cara kerjanya?** Database itu seperti gudang raksasa:
1.  **Menyimpan data** dengan rapi (seperti rak buku).
2.  **Mencari data** dengan cepat (seperti sistem katalog toko buku).
3.  **Mengelola data** tanpa kekacauan (seperti petugas gudang yang ahli).

Jadi, alur kerja (workflow) aplikasi kita menjadi seperti ini:

`➡️ Request Pengguna -> 🧠 Aplikasi Laravel -> 💾 Database (Simpan/Cari/Olah Data) -> ✅ Response ke Pengguna`

Tanpa Database, aplikasimu hanya bisa tampilkan informasi tetap yang tidak bisa diubah-ubah. 😵

### 2. ✍️ Kenali Peta Dunia Database (Dukungan Laravel)

Sebelum kita masuk ke teknis, mari kita kenali dulu "peta dunia database" yang didukung oleh Laravel. Ini seperti mengetahui negara-negara yang bisa kamu kunjungi sebelum traveling!

Laravel mendukung berbagai database populer:

* 🟢 **MariaDB 10.3+** - seperti saudara MySQL yang lebih mandiri
* 🟢 **MySQL 5.7+** - raja database relasional yang sangat populer
* 🟢 **PostgreSQL 10.0+** - seperti "senior" yang lebih canggih dan kaya fitur
* 🟢 **SQLite 3.26.0+** - seperti mobil kecil yang ringan dan portable
* 🟢 **SQL Server 2017+** - pilihan dari Microsoft

Selain itu, MongoDB juga didukung melalui paket `mongodb/laravel-mongodb`.

**Mengapa penting tahu ini?** Karena setiap database punya kelebihan dan cocok untuk kebutuhan berbeda. Seperti memilih kendaraan: mobil untuk jarak jauh, motor untuk macet, sepeda untuk sehat!

### 3. 🏗️ Tiga Jalan Menuju Database (Metode Interaksi)

Laravel memberimu tiga jalan untuk berinteraksi dengan database:

1. **Raw SQL** - Jalur langsung menggunakan perintah SQL murni (bagus untuk query kompleks)
2. **Query Builder** - Jalur yang lebih ramah dengan metode-metode PHP (bagus untuk developer baru)
3. **Eloquent ORM** - Jalur paling elegan menggunakan model PHP (bagus untuk struktur aplikasi yang bersih)

**Analogi:** Ini seperti tiga cara untuk memesan makanan:
- Raw SQL: Membuat makanan dari nol
- Query Builder: Memesan dengan instruksi langkah-demi-langkah
- Eloquent: Memesan dengan menyebut nama menu spesial

---

## Bagian 2: Persiapan Gudangmu - Konfigurasi Database ⚙️

### 4. 📋 Lokasi Peta Harta Karun (Konfigurasi Utama)

**Analogi:** Sebelum bisa mengakses gudang, kamu harus tahu di mana letaknya dan punya kuncinya. File `config/database.php` adalah seperti peta dan kunci utama untuk semua koneksi database kita.

**Mengapa ini ada?** Karena semua konfigurasi koneksi database disimpan di sini. Seperti buku alamat yang menyimpan semua informasi login gudang.

**Bagaimana?** Konfigurasi database Laravel berada di file:
```text
config/database.php
```

Di sini, kamu bisa mendefinisikan **semua koneksi database** dan menentukan koneksi default. Biasanya, konfigurasi ini menggunakan **environment variables** (variabel lingkungan) untuk mempermudah setup di berbagai lingkungan (development, staging, production).

### 5. 🔧 Resep Pertamamu: Siapkan Koneksi (SQLite)

Ini adalah fondasi paling dasar. Mari kita buat database SQLite dari nol, langkah demi langkah.

**Analogi:** Ini seperti membuat rak buku pertamamu di kamarmu sendiri - tidak perlu server besar!

#### Langkah 1️⃣: Siapkan Gudangnya (Buat File Database)
**Mengapa?** Kita butuh tempat penyimpanan fisik untuk data kita.

**Bagaimana?** Di terminal, buat file database SQLite:
```bash
touch database/database.sqlite
```

#### Langkah 2️⃣: Buka Pintu Gudang (Konfigurasi Environment)
**Mengapa?** Kita harus memberi tahu Laravel bahwa kita ingin menggunakan SQLite dan lokasinya.

**Bagaimana?** Konfigurasi di file `.env`:
```bash
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite
DB_FOREIGN_KEYS=false  # optional, untuk menonaktifkan foreign key
```

**Penjelasan Konfigurasi:**
- `DB_CONNECTION=sqlite` - Beri tahu Laravel kita pakai SQLite
- `DB_DATABASE=...` - Lokasi file database fisik
- `DB_FOREIGN_KEYS=false` - Optional, untuk performa lebih baik saat development

**Tips dari Guru:** SQLite cocok untuk pengembangan lokal atau aplikasi kecil karena setupnya sederhana dan ringan!

### 6. ⚙️ Tantangan Lain: Konfigurasi Microsoft SQL Server

**Analogi:** Ini seperti menggunakan gudang besar perusahaan dengan keamanan tinggi.

**Mengapa ini ada?** Untuk aplikasi enterprise yang menggunakan teknologi Microsoft.

**Bagaimana?** Pastikan ekstensi PHP `sqlsrv` dan `pdo_sqlsrv` sudah terpasang, serta driver ODBC Microsoft SQL Server jika diperlukan.

### 7. 🏗️ Jalan Pintas: Konfigurasi Menggunakan URL

**Analogi:** Ini seperti memiliki kunci ajaib yang bisa membukakan berbagai gudang hanya dengan satu kode!

**Mengapa ini ada?** Karena beberapa provider seperti AWS atau Heroku menyediakan **Database URL** yang lengkap dengan semua informasi koneksi.

**Bagaimana?** Beberapa provider seperti AWS atau Heroku menyediakan URL seperti ini:
```text
mysql://root:password@127.0.0.1/forge?charset=UTF-8
```

Laravel mendukung URL ini sebagai alternatif konfigurasi multi-variabel.

### 8. 🏗️ Gudang Super: Koneksi Read/Write Terpisah

**Analogi:** Ini seperti memiliki gudang utama (write) dan cabang-cabang gudang (read) untuk melayani pelanggan lebih cepat!

**Mengapa ini ada?** Untuk aplikasi besar yang perlu memisahkan beban membaca dan menulis data.

**Bagaimana?** Laravel mendukung **koneksi berbeda untuk membaca dan menulis**:
```php
'mysql' => [
    'read' => ['host' => ['192.168.1.1', '196.168.1.2']],  // Gudang cabang untuk membaca
    'write' => ['host' => ['196.168.1.3']],                 // Gudang utama untuk menulis
    'sticky' => true,                                        // Jika sudah nulis, baca dari gudang utama
    'database' => env('DB_DATABASE', 'laravel'),
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'strict' => true,
]
```

**Penjelasan:**
- **Read**: Koneksi khusus untuk operasi baca (SELECT), bisa lebih dari satu server
- **Write**: Koneksi khusus untuk operasi tulis (INSERT, UPDATE, DELETE)
- **Sticky Option**: memastikan data yang baru ditulis bisa langsung dibaca dalam satu siklus request

---

## Bagian 3: Bermain dengan Barang di Gudang - Query SQL 🧰

### 9. 🧠 Siapa yang Jadi Pelayan (DB Facade)?

**Analogi:** Bayangkan DB Facade ini seperti pelayan restoran yang sangat pandai dan bisa menerima pesanan dalam berbagai bahasa. Dia tahu persis apa yang kamu butuhkan dan langsung mengantarnya dari gudang.

**Mengapa ini penting?** Karena Laravel menggunakan **DB Facade** untuk eksekusi query. Pelayan inilah yang menghubungkan aplikasimu dengan database.

### 10. 📝 Ambil Barangnya (Select Query)

**Analogi:** Ini seperti meminta si pelayan untuk mengambil beberapa barang dari gudang berdasarkan daftar yang kamu berikan.

**Contoh Lengkap:**
```php
$users = DB::select('select * from users where active = ?', [1]);

foreach ($users as $user) {
    echo $user->name;
}
```

**Penjelasan Kode:**
- `DB::select(...)` - Pemanggilan pelayan untuk mengambil data
- `?` - Placeholder untuk mencegah SQL injection (seperti filter keamanan)
- `[1]` - Nilai yang menggantikan placeholder

### 11. 📏 Hitung Barangnya (Scalar Query)

**Analogi:** Seperti menanyakan jumlah total barang tertentu di gudang tanpa perlu melihat setiap itemnya.

**Contoh Lengkap:**
```php
$burgers = DB::scalar("select count(*) from menu where food = 'burger'");
```

**Penjelasan:** Fungsi `scalar()` mengembalikan satu nilai tunggal dari query, sangat efisien untuk operasi hitung!

### 12. 💬 Gunakan Nama, Bukan Anonim (Named Bindings)

**Analogi:** Ini seperti memberi nama pada barang yang ingin kamu cari, bukan hanya nomor atau posisi.

**Contoh Lengkap:**
```php
$results = DB::select('select * from users where id = :id', ['id' => 1]);
```

**Mengapa ini bagus?** Karena lebih mudah dibaca dan dimengerti, seperti memberi label pada kotak penyimpanan.

### 13. 🏗️ Tambah, Ganti, Hapus Barang (Insert, Update, Delete)

**Analogi:** Ini adalah tiga operasi dasar dalam mengelola gudang: memasukkan barang baru, mengganti barang yang sudah ada, atau menghapus barang yang tidak dibutuhkan.

**Contoh Lengkap:**
```php
// Masukkan barang baru (Insert)
DB::insert('insert into users (id, name) values (?, ?)', [1, 'Marc']);

// Ganti informasi barang (Update)
$affected = DB::update('update users set votes = 100 where name = ?', ['Anita']);

// Hapus barang (Delete)
$deleted = DB::delete('delete from users');
```

**Penjelasan:**
- `insert` - Menambahkan record baru ke tabel
- `update` - Memperbarui record yang sudah ada
- `delete` - Menghapus record dari tabel
- Semua ini mengembalikan jumlah baris yang terpengaruh

### 14. ⚠️ Perintah Spesial (Statement & Unprepared)

**Analogi:** Ini seperti memberi instruksi khusus yang tidak bisa di-filter, digunakan dengan hati-hati karena bisa berbahaya.

**Contoh Lengkap:**
```php
DB::statement('drop table users');  // Hapus seluruh tabel
DB::unprepared('update users set votes = 100 where name = "Dries"');  // Perintah tanpa filter keamanan
```

**Peringatan dari Guru:** Gunakan `unprepared` hanya untuk operasi aman, karena raw query dapat rentan SQL Injection. Seperti bermain api - bisa sangat berguna tapi juga sangat berbahaya jika tidak hati-hati!

---

## Bagian 4: Transaksi - Jaminan 100% Sukses atau Gagal 🔄

### 15. 📋 Apa Itu Transaksi?

**Analogi:** Bayangkan kamu sedang mentransfer uang antar bank. Uang harus didebet dari rekening A dan dikredit ke rekening B. Jika proses ini gagal di tengah jalan, semuanya harus dikembalikan seperti semula - tidak boleh ada uang yang hilang atau terduplikasi.

**Mengapa ini krusial?** Karena transaksi menjamin bahwa sekumpulan operasi database dilakukan secara keseluruhan (semua berhasil) atau tidak sama sekali (jika ada yang gagal).

### 16. 🏗️ Gunakan Transaksi dengan Aman

**Contoh Lengkap:**
```php
DB::transaction(function () {
    DB::update('update users set votes = 1');     // Langkah 1
    DB::delete('delete from posts');             // Langkah 2
    
    // Jika ada error di sini, semua perubahan di atas akan dibatalkan
});
```

**Bagaimana ini bekerja?**
1. Laravel membuka transaksi
2. Menjalankan semua perintah di dalam fungsi
3. Jika semua sukses → Commit (simpan semua perubahan)
4. Jika ada error → Rollback (batalkan semua perubahan)

### 17. 🛡️ Tangani Deadlock (Kemacetan Database)

**Analogi:** Ini seperti situasi macet di jalan raya, di mana dua mobil saling menunggu satu sama lain untuk lewat. Database pun bisa mengalami situasi serupa.

**Contoh Lengkap:**
```php
DB::transaction(function () {
    DB::update('update users set votes = 1');
    DB::delete('delete from posts');
}, 5); // retry 5 kali jika terjadi deadlock
```

**Penjelasan:** Parameter kedua (5) artinya Laravel akan mencoba kembali hingga 5 kali jika terjadi deadlock.

### 18. 🏗️ Transaksi Manual (Untuk Kasus Khusus)

**Analogi:** Ini seperti mengatur sendiri semua pintu gerbang gudang, bukan menggunakan sistem otomatis.

**Contoh Lengkap:**
```php
DB::beginTransaction();    // Buka transaksi
try {
    DB::update('update users set votes = 1');
    DB::delete('delete from posts');
    DB::commit();          // Simpan semua perubahan
} catch (\Exception $e) {
    DB::rollBack();        // Batalkan semua perubahan
    // Tangani error di sini
}
```

**Kapan digunakan?** Saat kamu butuh kontrol penuh atau logika error handling yang kompleks.

---

## Bagian 5: Monitoring & CLI - Mata dan Telinga Database 🔍

### 19. 💻 Perintah CLI untuk Database

**Analogi:** Ini seperti memiliki remote control untuk mengakses dan memantau gudangmu dari jarak jauh.

**Contoh Perintah:**
```bash
php artisan db                    # Buka koneksi interaktif ke database default
php artisan db mysql              # Buka koneksi interaktif ke database mysql
```

**Mengapa ini berguna?** Karena kamu bisa langsung berinteraksi dengan database tanpa aplikasi eksternal.

### 20. 🔎 Inspeksi Database-mu

**Analogi:** Ini seperti melakukan pemeriksaan kesehatan menyeluruh terhadap gudangmu.

**Contoh Perintah:**
```bash
php artisan db:show               # Tampilkan informasi umum database
php artisan db:table users        # Tampilkan informasi detail tentang tabel users
```

**Fungsinya:** Untuk debugging, inspeksi struktur tabel, atau memahami kondisi database saat ini.

### 21. 🏗️ Monitoring Koneksi Terbuka

**Analogi:** Ini seperti memonitor jumlah pintu gudang yang sedang terbuka, untuk mencegah kebakaran (konektor terlalu banyak).

**Contoh Perintah:**
```bash
php artisan db:monitor --databases=mysql,pgsql --max=100
```

**Mengapa ini penting?** Karena koneksi database yang tidak ditutup bisa menyebabkan aplikasi menjadi lambat atau bahkan crash.

**Tips dari Guru:** Laravel menyediakan berbagai fitur monitoring agar performa database tetap optimal dan masalah koneksi dapat segera ditangani!

---

## Bagian 6: Event dan Monitoring Query 📌

### 22. 📡 Dengarkan Setiap Query (Event Listener)

**Analogi:** Ini seperti menempatkan mikrofon di setiap lorong gudang untuk mendengarkan semua aktivitas yang terjadi.

**Contoh Lengkap:**
```php
DB::listen(function (QueryExecuted $query) {
    // $query->sql         - Perintah SQL yang dijalankan
    // $query->bindings    - Parameter yang digunakan
    // $query->time        - Waktu eksekusi dalam milidetik
});
```

**Mengapa ini penting?** Karena kamu bisa:
- Mencatat semua query untuk debugging
- Menemukan query yang lambat
- Memahami pola penggunaan database aplikasimu

### 23. 🚨 Monitoring Query Lambat

**Analogi:** Ini seperti sistem alarm yang berbunyi jika ada aktivitas gudang yang berlangsung terlalu lama.

**Contoh Lengkap:**
```php
DB::whenQueryingForLongerThan(500, function ($connection, $event) {
    // Notifikasi jika query > 500ms
    // Bisa kirim email, log ke file, atau apapun yang kamu inginkan
});
```

**Fungsinya:** Untuk mendeteksi dan menangani kinerja database yang buruk sebelum mempengaruhi pengguna.

---

## Bagian 7: Menjadi Master Database 🏆

### 24. ✨ Wejangan dari Guru

1.  **Gunakan Parameter Binding**: Selalu gunakan `?` atau `:nama` untuk mencegah SQL injection. Jangan pernah langsung menggabungkan input user ke query!
2.  **Pilih Metode yang Tepat**: Gunakan Raw SQL untuk query kompleks, Query Builder untuk operasi biasa, dan Eloquent untuk struktur aplikasi bersih.
3.  **Gunakan Transaksi untuk Operasi Kritis**: Setiap operasi yang melibatkan beberapa perubahan data harus dalam transaksi.
4.  **Monitor Kinerja**: Gunakan fitur monitoring untuk mendeteksi query lambat dan masalah koneksi.
5.  **Gunakan Koneksi Read/Write Terpisah**: Untuk aplikasi besar, pisahkan beban baca dan tulis ke database yang berbeda.

### 25. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Database di Laravel:

#### 📦 Query Dasar
| Perintah | Fungsi |
|----------|--------|
| `DB::select(...)` | Ambil data dari database |
| `DB::insert(...)` | Tambah data ke database |
| `DB::update(...)` | Ganti data di database |
| `DB::delete(...)` | Hapus data dari database |
| `DB::scalar(...)` | Ambil satu nilai dari database |

#### 🎯 Query dengan Binding
| Perintah | Hasil |
|----------|-------|
| `DB::select('...', [1, 2])` | Menggunakan placeholder `?` |
| `DB::select('...', ['id' => 1])` | Menggunakan named binding `:id` |
| `DB::unprepared(...)` | Query tanpa validasi (hati-hati!) |

#### 🔄 Transaksi
| Perintah | Fungsi |
|----------|--------|
| `DB::transaction(fn)` | Transaksi otomatis |
| `DB::beginTransaction()` | Buka transaksi manual |
| `DB::commit()` | Simpan perubahan |
| `DB::rollBack()` | Batalkan perubahan |

#### 🔧 CLI Commands
| Command | Fungsi |
|---------|--------|
| `php artisan db` | Koneksi interaktif |
| `php artisan db:show` | Info database |
| `php artisan db:table` | Info tabel |
| `php artisan db:monitor` | Monitoring koneksi |

#### 📌 Event & Monitoring
| Perintah | Hasil |
|----------|--------|
| `DB::listen(fn)` | Dengarkan semua query |
| `DB::whenQueryingForLongerThan(ms, fn)` | Alarm query lambat |
| `$query->sql` | Perintah SQL |
| `$query->time` | Waktu eksekusi |

#### 🏗️ Konfigurasi
| Setting | Fungsi |
|---------|--------|
| `DB_CONNECTION=sqlite` | Gunakan SQLite |
| `DB_CONNECTION=mysql` | Gunakan MySQL |
| `'sticky' => true` | Baca dari write connection setelah tulis |
| `'read' => [...]` | Server baca terpisah |

---

## Bagian 8: Kesimpulan 🎯

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Database, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Ingat, Database adalah jantung dari aplikasi yang menyimpan semua data penting. Menguasainya berarti kamu sudah siap membangun aplikasi Laravel yang hebat, aman, dan efisien.

Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku!

---
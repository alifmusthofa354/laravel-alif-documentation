# 🛠️ Query Builder di Laravel: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Setelah beberapa kali revisi, akhirnya Guru paham apa yang sebenarnya kalian inginkan: sebuah panduan yang **super lengkap** tapi dijelaskan dengan **super sederhana**, seolah-olah Guru sedang duduk di sebelahmu sambil menjelaskan pelan-pelan.

Di edisi ini, kita akan kupas tuntas **semua detail** tentang Query Builder, tapi setiap topik akan Guru ajarkan dengan sabar. Siap? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基 礎

### 1. 📖 Apa Sih Query Builder Itu Sebenarnya?

**Analogi:** Bayangkan kamu masuk ke restoran favoritmu, tapi bukan kamu yang memasak sendiri. Kamu punya **pelayan istimewa** (inilah **Query Builder** kita). Kamu tinggal bilang, "Saya mau semua makanan yang pedas dan harganya di bawah 50 ribu", maka pelayannya akan merangkai permintaanmu itu ke dapur (database) dengan benar dan memberimu hasilnya.

**Mengapa ini penting?** Karena kamu tidak perlu menulis SQL mentah yang rumit dan berisiko, tapi tetap bisa membuat query yang kompleks dengan cara yang lebih aman dan mudah dibaca.

**Bagaimana cara kerjanya?** Query Builder itu seperti translator yang:
1.  **Menerima permintaan**mu dengan bahasa PHP yang mudah (misalnya `->where('price', '<', 50000)`)
2.  **Menterjemahkannya** ke SQL yang aman dan efisien
3.  **Mengirim ke database** dan **membawakan hasilnya** kembali kepadamu

Jadi, alur kerja (workflow) Query Builder menjadi sangat rapi:

`➡️ Permintaan PHP -> 🧠 Query Builder (Translator) -> 💾 Database (SQL Aman) -> ✅ Hasil Kembali ke PHP`

Tanpa Query Builder, kamu harus menulis semua SQL secara manual dan raw, yang bisa berisiko dan memakan waktu. 😵

### 2. ✍️ Resep Pertamamu: Dari PHP ke Data (Pengenalan Dasar)

Ini adalah fondasi paling dasar. Mari kita ambil data dari tabel dari nol, langkah demi langkah.

#### Langkah 1️⃣: Panggil Pelayan (Inisialisasi Query Builder)
**Mengapa?** Kita butuh "pelayan istimewa" yang bisa menghubungkan aplikasimu dengan database.

**Bagaimana?** Gunakan facade `DB` dan method `table()`:
```php
DB::table('users')  // Panggil pelayan dan beri tahu dia ingin mengakses tabel 'users'
```

#### Langkah 2️⃣: Beri Perintah pada Pelayan (Chain Method)
**Mengapa?** Kita harus memberi instruksi spesifik tentang data apa yang kita butuhkan.

**Bagaimana?** Gunakan method-method berantai (chaining):
```php
$users = DB::table('users')
    ->select('id', 'name')  // Bilang: "Saya hanya butuh kolom id dan name"
    ->get();                // Bilang: "Bawa semua hasilnya ke saya"
```

**Penjelasan Kode:**
- `DB::table('users')` - Memanggil pelayan dan menentukan tabel
- `->select('id', 'name')` - Memberi instruksi kolom apa yang dipilih
- `->get()` - Meminta semua data yang sesuai kriteria

#### Langkah 3️⃣: Terima Hasilnya
**Mengapa?** Karena pelayan sudah membawakan data yang kamu minta.

**Bagaimana?** Gunakan variabel untuk menampung hasilnya:
```php
foreach ($users as $user) {
    echo $user->name;  // Tampilkan nama setiap user
}
```

Selesai! 🎉 Sekarang, kamu telah membuat query sederhana tanpa menulis SQL mentah!

### 3. ⚡ Keunggulan Query Builder (Kenapa Ini Keren?)

**Analogi:** Bayangkan kamu punya remote control universal yang bisa mengendalikan berbagai merek TV, AC, dan kipas angin di rumahmu. Itulah Query Builder - serbaguna dan kompatibel!

**Kenapa ini keren?**
- **Aman dari SQL Injection**: Karena Query Builder menggunakan parameter binding otomatis
- **Multi-Database Support**: Bekerja dengan MySQL, PostgreSQL, SQLite, SQL Server, dll
- **Fluent & Readable**: Bisa dirangkai (chained) dengan mudah dan enak dibaca
- **Mendukung Transaksi**: Bisa digunakan dalam transaksi database
- **Cocok untuk Query Kompleks**: Seperti join, subquery, aggregasi

---

## Bagian 2: Bandingkan Dulu - Eloquent vs Query Builder 🏗️

### 4. 📋 Peta Perbedaan (Eloquent vs Query Builder)

**Analogi:** Bayangkan kamu punya dua cara untuk memesan makanan:
- **Eloquent**: Seperti memesan lewat aplikasi yang punya menu lengkap, rekomendasi, dan mudah untuk sehari-hari
- **Query Builder**: Seperti berbicara langsung dengan koki, lebih fleksibel untuk permintaan khusus

| Fitur                | Query Builder              | Eloquent                       |
| --------------------| -------------------------- | ------------------------------ |
| **Objek model**      | stdClass                   | Model class instance           |
| **Relasi**           | Join manual                | Relasi Eloquent (`hasMany`, `belongsTo`) |
| **Kecepatan**        | Lebih cepat / ringan       | Sedikit lebih lambat           |
| **Fluent API**       | Ya                         | Ya, tapi lebih object-oriented |
| **Custom/Complex**   | Mudah untuk query kompleks | Bisa, tapi kadang verbose      |

**Contoh Query Kompleks (Query Builder):**
```php
$users = DB::table('users')
    ->join('orders', 'users.id', '=', 'orders.user_id')
    ->select('users.*', DB::raw('COUNT(orders.id) as total_orders'))
    ->groupBy('users.id')
    ->get();
```

**Output yang Diharapkan:**
```json
[
  {"id":"uuid-1","name":"Alif","email":"alif@example.com","total_orders":3},
  {"id":"uuid-2","name":"Budi","email":"budi@example.com","total_orders":5}
]
```

**Kesimpulan:**
- Gunakan **Query Builder** untuk query kompleks, aggregasi, batch processing
- Gunakan **Eloquent** untuk CRUD sederhana dan relasi antar tabel

### 5. 🎯 Menentukan Pilihan (Kapan Harus Gunakan Apa?)

**Analogi:** Seperti memilih alat yang tepat untuk pekerjaan yang tepat. Kalau hanya perlu pasang paku, pakai palu. Kalau butuh sekrup, pakai obeng.

**Kapan gunakan Query Builder?**
- Saat kamu butuh query SQL kompleks (join banyak tabel, subquery, aggregasi)
- Saat kamu hanya butuh data mentah tanpa logika model
- Saat kamu butuh performa maksimum tanpa overhead Eloquent

**Kapan gunakan Eloquent?**
- Saat kamu bekerja dengan model dan relasinya
- Saat kamu butuh fitur Eloquent seperti accessor, mutator, events
- Saat kamu buat CRUD sederhana

---

## Bagian 3: Query Dasar - Resep-Resep Dasarmu 📝

### 6. 📥 Mengambil Semua Baris (The Complete Order)

**Analogi:** Ini seperti memesan semua makanan yang ada di menu restoran.

**Mengapa ini ada?** Karena terkadang kamu butuh melihat semua data dalam satu tabel.

**Contoh Lengkap:**
```php
$users = DB::table('users')
    ->select('id', 'name')  // Pilih hanya kolom yang kamu butuhkan
    ->get();                // Ambil semua data yang sesuai

// Atau bisa lebih lanjut:
$users = DB::table('users')
    ->select('id', 'name', 'email')
    ->orderBy('name')       // Urutkan berdasarkan nama
    ->limit(10)             // Batasi hanya 10 hasil
    ->get();                // Ambil hasilnya
```

**Output yang Diharapkan:**
```json
[
  {"id":"uuid-1","name":"Alif"},
  {"id":"uuid-2","name":"Budi"},
  {"id":"uuid-3","name":"Citra"}
]
```

### 7. 📄 Mengambil Satu Baris atau Nilai (The Precise Order)

**Analogi:** Ini seperti memesan satu makanan spesifik dari menu, bukan semua.

**Mengapa ini ada?** Karena kamu sering hanya butuh satu record atau satu nilai spesifik.

**Contoh Lengkap:**
```php
// Ambil satu record pertama yang cocok
$user = DB::table('users')
    ->where('name', 'John')
    ->first();

// Ambil satu nilai dari kolom tertentu
$email = DB::table('users')
    ->where('name', 'John')
    ->value('email');

// Atau ambil berdasarkan ID
$user = DB::table('users')->find(1);
```

**Output yang Diharapkan:**
- `first()` → stdClass:
```json
{"id":"uuid-3","name":"John","email":"john@example.com"}
```

- `value()` → scalar:
```json
"john@example.com"
```

### 8. 🗂️ Mengambil List Kolom (The Pluck Order)

**Analogi:** Ini seperti menyusun daftar nama semua pelanggan tanpa informasi lainnya, atau membuat kamus nama dengan peran mereka.

**Mengapa ini ada?** Karena terkadang kamu cuma butuh satu kolom sebagai array, atau ingin membuat pasangan key-value.

**Contoh Lengkap:**
```php
// Ambil hanya kolom 'title' sebagai array
$titles = DB::table('users')
    ->pluck('title');

// Atau buat pasangan key-value (nama sebagai key, title sebagai value)
$titles = DB::table('users')
    ->pluck('title', 'name');
```

**Output yang Diharapkan:**
```json
{"John":"Manager","Budi":"Staff","Citra":"Intern"}
```

### 9. 📦 Chunking & Lazy Loading (The Efficient Order)

**Analogi:** Bayangkan kamu punya gudang besar dengan jutaan barang, tapi kamu tidak bisa mengangkut semuanya sekaligus. Maka kamu ambil sebagian-sebagian dengan truk kecil.

**Mengapa ini penting?** Karena mengambil jutaan data sekaligus bisa memakan memori dan membuat aplikasi crash.

**Contoh Lengkap:**
```php
// Ambil data dalam potongan (chunks) sebesar 100 baris
DB::table('users')
    ->orderBy('id')
    ->chunk(100, function ($users) {
        foreach ($users as $user) {
            // Proses setiap user dalam chunk
            echo $user->name . "\n";
        }
    });

// Atau gunakan lazy loading (lebih hemat memori)
DB::table('users')
    ->orderBy('id')
    ->lazy()
    ->each(function ($user) {
        // Proses satu per satu
        echo $user->name . "\n";
    });
```

**Output Contoh (chunk pertama 2 baris):**
```json
[
  {"id":"uuid-1","name":"Alif"},
  {"id":"uuid-2","name":"Budi"}
]
```

---

## Bagian 4: Pilihan Kolom - Pilih yang Kamu Butuhkan 🔍

### 10. 📋 Select Custom (Pilih Sesuai Keinginan)

**Analogi:** Ini seperti memesan makanan dan meminta nama makanan serta harga, tapi dengan nama kolom yang kamu ubah sendiri agar lebih mudah dimengerti.

**Mengapa ini ada?** Karena kamu sering hanya perlu kolom tertentu, dan kadang ingin mengganti nama kolom untuk output.

**Contoh Lengkap:**
```php
$users = DB::table('users')
    ->select('name', 'email as user_email')  // Ganti nama kolom email menjadi user_email
    ->get();
```

**Output yang Diharapkan:**
```json
[
  {"name":"Alif","user_email":"alif@example.com"},
  {"name":"Budi","user_email":"budi@example.com"}
]
```

### 11. 💎 Raw Expressions (Kekuatan Ekspresi SQL)

**Analogi:** Ini seperti memberi instruksi khusus pada koki untuk membuat sesuatu yang tidak ada di menu standar, tapi tetap dalam batas keamanan.

**Mengapa ini ada?** Karena terkadang kamu butuh fungsi SQL khusus seperti COUNT, AVG, atau ekspresi kompleks yang tidak tersedia sebagai method biasa.

**Contoh Lengkap:**
```php
$users = DB::table('users')
    ->select(DB::raw('count(*) as total, status'))  // Gunakan ekspresi SQL langsung
    ->groupBy('status')
    ->get();
```

**Output yang Diharapkan:**
```json
[
  {"status":"active","total":5},
  {"status":"inactive","total":2}
]
```

### 12. 🎛️ Conditional Clauses (Pilih Sesuai Kondisi)

**Analogi:** Ini seperti memesan makanan yang berbeda tergantung apakah hari ini libur atau tidak.

**Mengapa ini penting?** Karena kamu sering butuh menambahkan kondisi tambahan hanya jika sesuatu benar.

**Contoh Lengkap:**
```php
$active = true;  // Misalnya dari input atau kondisi tertentu

$users = DB::table('users')
    ->when($active, function ($query) {           // Jika $active benar
        return $query->where('status', 'active'); // Tambahkan kondisi where
    })
    ->get();
```

**Output yang Diharapkan (jika `$active = true`):**
```json
[
  {"id":"uuid-1","name":"Alif","status":"active"},
  {"id":"uuid-2","name":"Budi","status":"active"}
]
```

---

## Bagian 5: Perhitungan Cerdas - Aggregates 📊

### 13. 🧮 Hitung, Jumlah, Rata-rata (The Calculation Tools)

**Analogi:** Ini seperti memiliki kalkulator canggih yang bisa menghitung total penjualan, rata-rata nilai, jumlah pelanggan, dll hanya dengan satu perintah.

**Mengapa ini penting?** Karena kamu sering butuh data ringkasan, bukan data mentahnya.

**Contoh Lengkap:**
```php
// Hitung jumlah semua user
$count = DB::table('users')->count();

// Hitung rata-rata harga dari order yang sudah final
$avg = DB::table('orders')
    ->where('finalized', 1)
    ->avg('price');

// Atau hitung total, minimum, maksimum
$sum = DB::table('orders')->sum('amount');
$min = DB::table('users')->min('age');
$max = DB::table('users')->max('salary');
```

**Output yang Diharapkan:**
```json
{"count":7,"avg":150.5}
```

---

## Bagian 6: Menggabungkan Data - Joins 🔗

### 14. 🔗 Inner Join (Menggabungkan yang Cocok)

**Analogi:** Bayangkan kamu punya dua buku telepon - satu berisi nama dan alamat, satunya lagi berisi nomor telepon. Join adalah seperti menggabungkan dua buku itu menjadi satu yang lengkap.

**Mengapa ini penting?** Karena data sering disimpan di berbagai tabel, dan kamu butuh informasi dari beberapa tabel sekaligus.

**Contoh Lengkap:**
```php
$users = DB::table('users')
    ->join('contacts', 'users.id', '=', 'contacts.user_id')  // Gabungkan tabel users dan contacts
    ->select('users.name', 'contacts.phone')                // Ambil kolom yang kamu butuhkan
    ->get();
```

**Output yang Diharapkan:**
```json
[
  {"name":"Alif","phone":"081234567"},
  {"name":"Budi","phone":"081987654"}
]
```

### 15. 🏗️ Advanced Join (Subquery Join)

**Analogi:** Ini seperti meminta pelayan untuk membuatkan daftar khusus (misalnya makanan terlaris minggu ini) dan kemudian menggabungkannya dengan daftar pelanggan.

**Mengapa ini ada?** Karena terkadang kamu butuh menggabungkan dengan hasil query lain yang kompleks.

**Contoh Lengkap:**
```php
// Buat subquery untuk mencari postingan terbaru per user
$latestPosts = DB::table('posts')
    ->select('user_id', DB::raw('MAX(created_at) as last_post'))
    ->groupBy('user_id');

// Gabungkan dengan tabel users
$users = DB::table('users')
    ->joinSub($latestPosts, 'latest_posts', function ($join) {
        $join->on('users.id', '=', 'latest_posts.user_id');
    })
    ->select('users.name', 'latest_posts.last_post')
    ->get();
```

**Output yang Diharapkan:**
```json
[
  {"name":"Alif","last_post":"2025-09-21 12:00:00"},
  {"name":"Budi","last_post":"2025-09-20 15:30:00"}
]
```

---

## Bagian 7: Kondisi Kompleks - Advanced Where Clauses ⚡

### 16. 🗄️ JSON Query (Mengakses Data JSON)

**Analogi:** Bayangkan tabelmu seperti kotak-kotak yang bisa berisi dokumen kompleks (bukan hanya teks biasa), dan kamu ingin mengambil barang spesifik dari dalam dokumen itu.

**Mengapa ini penting?** Karena banyak database modern mendukung kolom JSON, dan kamu butuh mencari data di dalam struktur kompleks itu.

**Contoh Lengkap:**
```php
$users = DB::table('users')
    ->where('preferences->dining->meal', 'salad')  // Cari user yang meal favoritnya salad
    ->get();
```

**Output yang Diharapkan:**
```json
[
  {"id":"uuid-1","name":"Alif","preferences":{"dining":{"meal":"salad"}}}
]
```

### 17. 🔍 Full Text Search (Pencarian Cerdas)

**Analogi:** Ini seperti mesin pencari Google untuk datamu - bisa menemukan dokumen yang relevan meskipun hanya dengan kata kunci umum.

**Mengapa ini ada?** Karena pencarian biasa dengan `LIKE` kadang tidak cukup efisien untuk teks panjang.

**Contoh Lengkap:**
```php
$users = DB::table('users')
    ->whereFullText('bio', 'developer')  // Cari user dengan bio tentang developer
    ->get();
```

**Output yang Diharapkan:**
```json
[
  {"id":"uuid-1","name":"Alif","bio":"Full stack developer"}
]
```

### 18. 🔄 Exists/Not Exists (Pengecekan Kehadiran)

**Analogi:** Ini seperti menanyakan apakah seseorang pernah memesan sesuatu sebelumnya atau tidak, tanpa perlu tahu detail pesanannya.

**Mengapa ini penting?** Karena kamu sering butuh filter berdasarkan keberadaan data terkait di tabel lain.

**Contoh Lengkap:**
```php
$users = DB::table('users')
    ->whereExists(function ($query) {
        $query->select(DB::raw(1))
              ->from('orders')
              ->whereColumn('orders.user_id', 'users.id');  // Periksa apakah user punya order
    })
    ->get();
```

**Output yang Diharapkan:**
```json
[
  {"id":"uuid-1","name":"Alif"},
  {"id":"uuid-2","name":"Budi"}
]
```

### 19. 🧠 Subquery Where (Query Dalam Query)

**Analogi:** Ini seperti meminta pelayan untuk mengecek dulu berapa rata-rata pendapatan semua orang, lalu baru memberimu daftar orang dengan pendapatan di bawah rata-rata itu.

**Mengapa ini ada?** Karena kamu sering butuh membandingkan data dengan hasil dari query lain.

**Contoh Lengkap:**
```php
$incomes = DB::table('incomes')
    ->where('amount', '<', function ($query) {
        $query->selectRaw('avg(i.amount)')  // Ambil rata-rata pendapatan
              ->from('incomes as i');
    })
    ->get();
```

**Output yang Diharapkan:**
```json
[
  {"id":"inc-1","amount":120},
  {"id":"inc-2","amount":140}
]
```

### 20. 🔗 Union Queries (Menggabungkan Hasil Berbeda)

**Analogi:** Ini seperti menggabungkan daftar pelanggan reguler dengan daftar admin menjadi satu daftar semua pengguna.

**Mengapa ini penting?** Karena kamu sering butuh menggabungkan hasil dari dua query berbeda menjadi satu set data.

**Contoh Lengkap:**
```php
$first = DB::table('users')->select('name');
$second = DB::table('admins')->select('name');

$allNames = $first->union($second)->get();  // Gabungkan hasil kedua query
```

**Output yang Diharapkan:**
```json
[
  {"name":"Alif"},
  {"name":"Budi"},
  {"name":"Citra"},
  {"name":"Admin1"},
  {"name":"Admin2"}
]
```

---

## Bagian 8: Memodifikasi Data - Update, Insert, Delete 🔄

### 21. 📝 Update dan Insert Data (Ubah atau Tambah)

**Analogi:** Ini seperti mengganti informasi di buku catatan atau menambahkan entri baru.

**Mengapa ini penting?** Karena aplikasi harus bisa mengelola data - menambahkan yang baru, mengubah yang sudah ada, atau menghapus yang tidak dibutuhkan.

**Contoh Lengkap:**
```php
// Tambah data baru
DB::table('users')->insert([
    'name' => 'John',
    'email' => 'john@example.com'
]);

// Tambah dan dapatkan ID-nya
$id = DB::table('users')->insertGetId([
    'name' => 'Jane',
    'email' => 'jane@example.com'
]);

// Update data
DB::table('users')
    ->where('email', 'john@example.com')
    ->update(['votes' => 5]);

// Update atau insert (jika belum ada)
DB::table('users')->updateOrInsert(
    ['email' => 'john@example.com'],  // Kondisi pencarian
    ['votes' => 5]                   // Data yang diupdate/insert
);

// Tambah atau kurangi nilai
DB::table('users')->increment('votes', 2);    // Tambah 2 suara
DB::table('users')->decrement('votes', 1);    // Kurangi 1 suara
```

### 22. 🗑️ Hapus Data (The Delete Command)

**Analogi:** Ini seperti menghapus catatan yang tidak relevan dari buku harian.

**Mengapa ini penting?** Karena kamu butuh membersihkan data yang tidak diperlukan.

**Contoh Lengkap:**
```php
// Hapus semua user yang tidak aktif lebih dari 1 tahun
DB::table('users')
    ->where('last_login', '<', now()->subYear())
    ->delete();

// Hapus satu user
DB::table('users')->where('id', 1)->delete();
```

---

## Bagian 9: Jaminan 100% Sukses - Transactions 🗂️

### 23. 📋 Apa Itu Transaksi?

**Analogi:** Bayangkan kamu sedang mentransfer uang antar bank. Uang harus didebet dari rekening A dan dikredit ke rekening B. Jika proses ini gagal di tengah jalan, semuanya harus dikembalikan seperti semula - tidak boleh ada uang yang hilang atau terduplikasi.

**Mengapa ini krusial?** Karena transaksi menjamin bahwa sekumpulan operasi database dilakukan secara keseluruhan (semua berhasil) atau tidak sama sekali (jika ada yang gagal).

**Contoh Lengkap:**
```php
DB::transaction(function () {
    // Langkah 1: Update votes di tabel users
    DB::table('users')->update(['votes' => 100]);
    
    // Langkah 2: Tambah log ke tabel logs
    DB::table('logs')->insert(['action' => 'update_votes']);
    
    // Jika ada error di sini, semua perubahan di atas akan dibatalkan
});
```

**Bagaimana ini bekerja?**
1. Laravel membuka transaksi
2. Menjalankan semua perintah di dalam fungsi
3. Jika semua sukses → Commit (simpan semua perubahan)
4. Jika ada error → Rollback (batalkan semua perubahan)

### 24. 🛡️ Transaksi Manual (Untuk Kasus Khusus)

**Contoh Lengkap:**
```php
DB::beginTransaction();    // Buka transaksi
try {
    DB::table('users')->update(['votes' => 100]);
    DB::table('logs')->insert(['action' => 'update_votes']);
    DB::commit();          // Simpan semua perubahan
} catch (\Exception $e) {
    DB::rollBack();        // Batalkan semua perubahan
    // Tangani error di sini
    throw $e;
}
```

---

## Bagian 10: Bekerja dengan Banyak Gudang - Multiple Connections 🌐

### 25. 🏢 Menggunakan Multiple Database Connections

**Analogi:** Ini seperti memiliki kantor pusat dan kantor cabang yang masing-masing punya gudang sendiri. Kamu bisa mengakses gudang mana pun tergantung kebutuhan.

**Mengapa ini ada?** Karena beberapa aplikasi besar butuh mengakses lebih dari satu database untuk berbagai tujuan (misalnya: production, reporting, logging).

**Contoh Lengkap:**
```php
// Akses database utama
$users = DB::table('users')->get();

// Akses database khusus untuk reporting
$reports = DB::connection('mysql2')->table('reports')->get();

// Bisa juga untuk database lain seperti PostgreSQL
$analytics = DB::connection('pgsql')->table('analytics')->get();
```

**Output yang Diharapkan:**
```json
[
  {"id":"uuid-101","name":"Eka"},
  {"id":"uuid-102","name":"Fajar"}
]
```

---

## Bagian 11: Debugging - Menemukan Masalah 🔧

### 26. 🔍 Debugging Query dan Hasil

**Analogi:** Ini seperti memiliki kaca pembesar untuk melihat detail bagian mana dari proses yang tidak berjalan sesuai harapan.

**Mengapa ini penting?** Karena saat query tidak memberikan hasil yang diharapkan, kamu perlu melihat apa yang sebenarnya dikirim ke database dan apa hasilnya.

**Contoh Lengkap:**
```php
// Tampilkan query dan hasilnya sebelum dieksekusi
DB::table('users')
    ->where('votes', '>', 100)
    ->dd();  // Dump dan die (berhenti di sini)

// Atau hanya lihat query SQL yang dihasilkan
DB::table('users')
    ->where('votes', '>', 100)
    ->dumpRawSql();

// Tampilkan hasil tanpa berhenti
DB::table('users')
    ->where('votes', '>', 100)
    ->dump();
```

---

## Bagian 12: Kiat dan Praktik Terbaik 🏆

### 27. ✅ Gunakan Binding Parameter untuk Input User

**Analogi:** Ini seperti menyaring tamu yang datang ke pesta dengan memeriksa undangan mereka terlebih dahulu, bukan membiarkan siapa pun masuk tanpa pemeriksaan.

**Mengapa ini penting?** Karena tanpa binding parameter, input user bisa digunakan untuk menyisipkan SQL berbahaya (SQL injection).

**Contoh Aman:**
```php
$name = request('name'); // input user
$user = DB::table('users')
    ->where('name', $name)  // Laravel akan mengamankan input ini
    ->first();
```

**Cara Kerja di Balik Layar:**
Query yang dijalankan:
```sql
SELECT * FROM users WHERE name = ?
```
Laravel mengganti `?` dengan `$name` secara aman.

**Contoh Berbahaya (JANGAN LAKUKAN INI):**
```php
$user = DB::table('users')
    ->whereRaw("name = '$name'")  // RAW SQL TANPA PENGAMANAN!
    ->first();
```

Jika `$name = "John' OR 1=1 --"`, maka hacker bisa mengambil semua data!

### 28. 🎯 Pilih yang Tepat: Query Builder vs Eloquent

**Analogi:** Seperti memilih alat yang tepat untuk pekerjaan yang tepat. Kalau hanya perlu pasang paku, pakai palu. Kalau butuh sekrup, pakai obeng.

**Gunakan Query Builder ketika:**
- Membuat query kompleks (join banyak tabel, aggregasi, subquery)
- Hanya butuh data mentah tanpa logika model
- Butuh performa maksimum

**Gunakan Eloquent ketika:**
- Bekerja dengan model dan relasinya
- Buat CRUD sederhana
- Butuh fitur seperti accessor, mutator, events

**Contoh Query Builder (kompleks):**
```php
$users = DB::table('users')
    ->join('orders', 'users.id', '=', 'orders.user_id')
    ->select('users.*', DB::raw('COUNT(orders.id) as total_orders'))
    ->groupBy('users.id')
    ->get();
```

**Contoh Eloquent (sederhana):**
```php
$user = User::find(1);
$user->name = 'Alif';
$user->save();
```

### 29. 🛡️ Gunakan Transaksi untuk Update Multi-Tabel

**Analogi:** Ini seperti kontrak yang hanya sah jika semua pihak menandatangani, atau tidak ada yang menandatangani sama sekali.

**Mengapa ini penting?** Karena jika kamu update beberapa tabel sekaligus, gagal satu update bisa menyebabkan data tidak konsisten.

**Contoh:**
```php
DB::transaction(function() {
    DB::table('users')->update(['votes' => 100]);
    DB::table('logs')->insert(['action' => 'update_votes']);
});
```

Jika update `users` sukses tapi insert `logs` gagal → **rollback otomatis**, jadi `users` tetap tidak berubah.

### 30. ⚠️ Hindari Dynamic Column Names dari Input User

**Analogi:** Ini seperti membiarkan tamu menentukan sendiri kunci mana yang boleh dipakai untuk membuka pintu, yang bisa sangat berbahaya.

**Mengapa berbahaya?** Karena PDO tidak mendukung binding nama kolom, jadi input user untuk nama kolom bisa menyebabkan SQL injection.

**Contoh Berbahaya:**
```php
$orderBy = request('sort_column'); // input user
$users = DB::table('users')
    ->orderBy($orderBy)  // BERBAHAYA: nama kolom dari input user
    ->get();
```

**Alternatif Aman:**
```php
// Gunakan whitelist kolom yang boleh diurutkan
$allowedColumns = ['name', 'email', 'created_at'];
$column = in_array(request('sort_column'), $allowedColumns) 
    ? request('sort_column') 
    : 'name';

$users = DB::table('users')
    ->orderBy($column)
    ->get();
```

### 31. 📦 Gunakan Chunking/Lazy Loading untuk Dataset Besar

**Analogi:** Ini seperti mengangkut batu-batu besar dengan truk kecil, membawa sedikit-sedikit agar tidak membuat jembatan roboh.

**Mengapa ini penting?** Karena mengambil jutaan data sekaligus bisa memakan memori dan membuat aplikasi crash.

**Contoh Chunking:**
```php
DB::table('users')
    ->orderBy('id')
    ->chunk(100, function ($users) {
        foreach ($users as $user) {
            // Proses batch 100 user
            processUser($user);
        }
    });
```

**Contoh Lazy Loading:**
```php
DB::table('users')
    ->orderBy('id')
    ->lazy()
    ->each(function ($user) {
        // Proses satu per satu
        processUser($user);
    });
```

**Keuntungan:**
- Hemat memori
- Bisa proses jutaan data tanpa crash

### 32. 🌐 Gunakan Multiple Connections Bila Perlu

**Analogi:** Ini seperti memiliki gudang utama dan gudang cadangan, masing-masing untuk keperluan berbeda.

**Contoh:**
```php
// Database utama untuk transaksi
$users = DB::table('users')->get();

// Database terpisah untuk reporting
$reports = DB::connection('reporting_db')->table('reports')->get();
```

**Keuntungan:**
- Pisahkan beban baca/tulis
- Gunakan database spesifik untuk keperluan spesifik
- Meningkatkan performa aplikasi

---

## Bagian 13: Cheat Sheet & Referensi Cepat 📋

### 33. 🏗️ Query Dasar
| Perintah | Fungsi |
|----------|--------|
| `DB::table('users')->get()` | Ambil semua data dari tabel |
| `DB::table('users')->first()` | Ambil satu record pertama |
| `DB::table('users')->find($id)` | Ambil record berdasarkan ID |
| `DB::table('users')->value('column')` | Ambil nilai satu kolom |
| `DB::table('users')->pluck('column')` | Ambil satu kolom sebagai array |

### 34. 🔍 Where Clauses
| Perintah | Fungsi |
|----------|--------|
| `->where('column', 'value')` | Filter dengan kondisi sama |
| `->where('column', '>', value)` | Filter dengan kondisi perbandingan |
| `->whereIn('column', [1,2,3])` | Filter dengan array nilai |
| `->whereBetween('column', [1,10])` | Filter dengan rentang nilai |
| `->whereNull('column')` | Filter untuk nilai null |

### 35. 📊 Aggregates
| Perintah | Fungsi |
|----------|--------|
| `->count()` | Hitung jumlah record |
| `->sum('column')` | Jumlahkan nilai kolom |
| `->avg('column')` | Rata-rata nilai kolom |
| `->min('column')` | Nilai minimum kolom |
| `->max('column')` | Nilai maksimum kolom |

### 36. 🔗 Join Clauses
| Perintah | Fungsi |
|----------|--------|
| `->join('table', 'col1', '=', 'col2')` | Inner join dengan kondisi |
| `->leftJoin('table', ...)` | Left join |
| `->rightJoin('table', ...)` | Right join |
| `->joinSub($query, 'alias', ...)` | Join dengan subquery |
| `->crossJoin('table')` | Cross join (semua kombinasi) |

### 37. 🛠️ Modifikasi Data
| Perintah | Fungsi |
|----------|--------|
| `->insert([...])` | Tambah data baru |
| `->insertGetId([...])` | Tambah data dan dapatkan ID-nya |
| `->update([...])` | Update data yang cocok |
| `->updateOrInsert([...], [...])` | Update atau insert jika tidak ada |
| `->delete()` | Hapus data yang cocok |
| `->increment('column', amount)` | Tambah nilai kolom |
| `->decrement('column', amount)` | Kurangi nilai kolom |

### 38. 🔄 Advanced Features
| Perintah | Fungsi |
|----------|--------|
| `DB::transaction(fn)` | Transaksi otomatis |
| `->chunk(size, fn)` | Proses data dalam potongan |
| `->lazy()->each(fn)` | Proses data satu per satu |
| `->when(condition, fn)` | Tambah kondisi jika benar |
| `->union($query)` | Gabungkan hasil dengan query lain |

---

## Bagian 14: Kesimpulan 🎯

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Query Builder, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Ingat, Query Builder adalah alat yang sangat ampuh untuk mengakses dan memanipulasi data dengan cara yang aman dan efisien. Menguasainya berarti kamu sudah siap membuat aplikasi Laravel yang bisa menangani berbagai skenario database dengan percaya diri.

Jangan pernah berhenti belajar dan mencoba. Selamat ngoding, murid kesayanganku!

---



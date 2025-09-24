# 🧺 Collection di Laravel: Panduan Manipulasi Data dari Guru Kesayanganmu

Hai murid-murid kesayanganku! Hari ini kita akan membahas salah satu fitur **sangat powerful** di Laravel: **Collection**! 🔥

Bayangkan kamu punya kantong besar berisi buah-buahan. Kamu ingin mengambil semua buah apel, mengupasnya, memotongnya menjadi irisan, lalu menyusunnya dalam urutan tertentu. Kalau kamu lakukan itu satu per satu secara manual, pasti melelahkan dan memakan waktu lama.

Nah, **Collection** di Laravel adalah seperti **asisten pribadi yang super canggih** untuk mengolah data! Ia bisa:
- Memfilter data seperti menyaring buah
- Mengubah bentuk data seperti mengupas dan memotong buah
- Mengelompokkan data seperti menyusun buah per jenis
- Dan masih banyak lagi!

Setelah beberapa kali revisi, aku yakin kamu akan lebih mudah memahami konsep ini dengan penjelasan yang **super lengkap** tapi dijelaskan dengan **super sederhana**. Siap? Ayo kita mulai petualangan manipulasi data ini!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Collection Itu Sebenarnya?

**Analogi:** Bayangkan kamu seorang koki profesional. Di dapurmu ada keranjang besar berisi bahan-bahan mentah (data). Kamu tidak bisa langsung menghidangkan semua bahan itu ke pelanggan, kan? Kamu butuh:
1.  **Menyaring** bahan yang rusak
2.  **Mengolah** bahan mentah jadi makanan siap saji
3.  **Mengelompokkan** makanan berdasarkan jenisnya
4.  **Menyusun** makanan dalam urutan tertentu

**Collection** adalah dapur canggihmu untuk mengolah data! Ia memberimu banyak **alat (method)** untuk melakukan semua itu secara **fluent** (menggunakan method chaining) dan **efisien**.

**Mengapa ini penting?** Karena di dunia nyata, hampir semua aplikasi harus **memanipulasi data**. Dari menghitung jumlah item di keranjang belanja, menyaring produk berdasarkan kategori, hingga mengelompokkan transaksi per bulan - semua bisa dilakukan dengan Collection.

**Bagaimana cara kerjanya?** 
1.  **Ambil data**: Kamu mulai dengan array data atau hasil query Eloquent.
2.  **Masukkan ke Collection**: Gunakan helper `collect()`.
3.  **Gunakan alat**: Rangkai berbagai method seperti `filter()`, `map()`, `sortBy()` untuk mengolah data.
4.  **Ambil hasilnya**: Data sudah siap disajikan!

Tanpa Collection, kamu harus manual-looping data dan menulis banyak kode. Dengan Collection, semuanya jadi **lebih elegan dan singkat**!

### 2. ✍️ Resep Pertamamu: Membuat dan Mengolah Collection

Mari kita buat contoh pertama: mengolah data siswa. Kita akan filter siswa aktif, ubah format nama, dan urutkan berdasarkan nilai. Kita akan buat dari nol, langkah demi langkah.

#### Langkah 1️⃣: Buat Collection dari Array

**Mengapa?** Kita perlu data awal untuk diolah.

**Bagaimana?** Gunakan helper `collect()`:
```php
$students = [
    ['name' => 'Andi', 'grade' => 85, 'active' => true],
    ['name' => 'Budi', 'grade' => 92, 'active' => false],
    ['name' => 'Citra', 'grade' => 78, 'active' => true],
    ['name' => 'Dedi', 'grade' => 95, 'active' => true],
];

$collection = collect($students); // Masukkan ke Collection
```

#### Langkah 2️⃣: Filter Data Siswa Aktif

**Mengapa?** Kita hanya ingin kerjakan siswa-siswa yang aktif.

**Bagaimana?** Gunakan method `filter()`:
```php
$activeStudents = $collection->filter(function ($student) {
    return $student['active'] === true;
});
```

#### Langkah 3️⃣: Ubah Format Nama (Map)

**Mengapa?** Kita ingin tampilkan nama dalam huruf kapital.

**Bagaimana?** Gunakan method `map()`:
```php
$studentsWithUppercaseName = $activeStudents->map(function ($student) {
    return [
        'name' => strtoupper($student['name']),
        'grade' => $student['grade'],
        'active' => $student['active']
    ];
});
```

#### Langkah 4️⃣: Urutkan Berdasarkan Nilai (Sort)

**Mengapa?** Kita ingin tampilkan dari nilai tertinggi ke terendah.

**Bagaimana?** Gunakan method `sortByDesc()`:
```php
$sortedStudents = $studentsWithUppercaseName->sortByDesc('grade');
```

#### Langkah 5️⃣: Gabungkan Semua dalam Satu Rangkaian (Method Chaining)

**Mengapa?** Agar kode jadi lebih rapi dan efisien.

**Bagaimana?** Rangkai semua method:
```php
$result = collect($students)
    ->filter(function ($student) {
        return $student['active'] === true;
    })
    ->map(function ($student) {
        return [
            'name' => strtoupper($student['name']),
            'grade' => $student['grade'],
            'active' => $student['active']
        ];
    })
    ->sortByDesc('grade');

// Hasilnya: Citra (78), Andi (85), Dedi (95) -> diurutkan jadi Dedi, Andi, Citra
dd($result->all()); // Tampilkan hasil
```

**Penjelasan Kode:**
- `collect()`: Membuat Collection dari array.
- `filter()`: Memfilter item-item berdasarkan kondisi.
- `map()`: Mengubah bentuk setiap item.
- `sortByDesc()`: Mengurutkan berdasarkan field tertentu (desc = descending).
- `dd()`: Dump and die untuk debugging.
- **Method Chaining**: Semua method bisa dirangkai karena Collection mengembalikan Collection baru setiap kali.

Selesai! 🎉 Sekarang kamu sudah bisa mengolah data kompleks dalam satu baris kode yang indah!

### 3. ⚡ Collection Spesialis (Eloquent Collections)

**Analogi:** Bayangkan kamu punya asisten yang langsung mengerti semua perintah tentang buku, tanpa kamu harus jelaskan dari awal.

**Mengapa ini ada?** Karena hasil query Eloquent secara otomatis berupa Collection! Jadi kamu bisa langsung gunakan semua method Collection tanpa perlu convert manual.

**Bagaimana?**
```php
// Hasil query Eloquent = Collection otomatis!
$users = User::where('active', true)->get(); // Ini sudah Collection!

// Langsung bisa pakai method Collection
$vipUsers = $users->filter(function ($user) {
    return $user->balance > 1000000;
})->sortByDesc('balance');

// Atau lebih singkat dengan method Eloquent + Collection
$topUsers = User::where('active', true)
    ->get()
    ->sortByDesc('balance')
    ->take(10); // Ambil 10 user dengan balance tertinggi
```

---

## Bagian 2: Metode-Metode Collection - Toolkit-mu 🧰

### 4. 🔍 Seleksi Data (Filtering)

**Analogi:** Seperti mesin penyaring air yang hanya membiarkan zat-zat tertentu lewat.

**Mengapa?** Karena seringkali kamu hanya butuh sebagian data, bukan semua.

**Metode-metode penting:**
```php
$students = collect([
    ['name' => 'Andi', 'grade' => 85],
    ['name' => 'Budi', 'grade' => 92],
    ['name' => 'Citra', 'grade' => 78],
]);

// Filter: Ambil hanya nilai di atas 80
$highGradeStudents = $students->filter(function ($student) {
    return $student['grade'] > 80;
});
// Hasil: Andi (85), Budi (92)

// Where: Filter berdasarkan field spesifik
$specificStudent = $students->where('name', 'Budi');

// Reject: Kebalikan filter, buang yang tidak cocok
$lowGradeStudents = $students->reject(function ($student) {
    return $student['grade'] > 80;
});
// Hasil: Citra (78)
```

### 5. 🔁 Transformasi Data (Mapping)

**Analogi:** Seperti mesin konveyor yang mengubah bentuk bahan mentah jadi produk jadi.

**Mengapa?** Karena kamu sering perlu ubah format data sebelum ditampilkan.

**Metode-metode penting:**
```php
$products = collect([
    ['name' => 'Laptop', 'price' => 10000000],
    ['name' => 'Mouse', 'price' => 150000],
]);

// Map: Ubah tiap item
$productsWithTax = $products->map(function ($product) {
    return [
        'name' => $product['name'],
        'price' => $product['price'],
        'price_with_tax' => $product['price'] * 1.11, // Tax 11%
    ];
});

// Pluck: Ambil hanya field tertentu
$onlyNames = $products->pluck('name'); // ['Laptop', 'Mouse']

// MapWithKeys: Ubah jadi array asosiatif
$productsByPrice = $products->mapWithKeys(function ($product) {
    return [$product['name'] => $product['price']]; 
});
// Hasil: ['Laptop' => 10000000, 'Mouse' => 150000]
```

### 6. 📊 Agregasi Data (Statistik)

**Analogi:** Seperti kalkulator super cepat yang langsung hitung semua angka untukmu.

**Mengapa?** Karena seringkali kamu butuh informasi statistik dari data.

**Metode-metode penting:**
```php
$scores = collect([85, 92, 78, 95, 88]);

// Sum: Jumlahkan semua
$total = $scores->sum(); // 438

// Avg: Rata-rata
$average = $scores->avg(); // 87.6

// Max/Min: Nilai tertinggi/terendah
$highest = $scores->max(); // 95
$lowest = $scores->min(); // 78

// Count: Jumlah item
$jumlahSiswa = $scores->count(); // 5

// Lebih kompleks: Rata-rata nilai dari collection array
$students = collect([
    ['name' => 'Andi', 'grade' => 85],
    ['name' => 'Budi', 'grade' => 92],
]);
$averageGrade = $students->avg('grade'); // 88.5
```

### 7. 📋 Pengelompokan Data

**Analogi:** Seperti mengatur buku-buku ke rak berdasarkan genre.

**Mengapa?** Karena seringkali kamu perlu tampilkan data dalam kelompok-kelompok.

**Metode-metode penting:**
```php
$orders = collect([
    ['product' => 'Laptop', 'category' => 'Electronics', 'amount' => 10000000],
    ['product' => 'Shirt', 'category' => 'Clothing', 'amount' => 150000],
    ['product' => 'Phone', 'category' => 'Electronics', 'amount' => 5000000],
]);

// GroupBy: Kelompokkan berdasarkan field
$groupedOrders = $orders->groupBy('category');
// Hasil: ['Electronics' => [Laptop, Phone], 'Clothing' => [Shirt]]

// Lebih kompleks: Kelompokkan dan hitung total per kategori
$summary = $orders->groupBy('category')->map(function ($items) {
    return [
        'count' => $items->count(),
        'total_amount' => $items->sum('amount')
    ];
});
// Hasil: ['Electronics' => ['count' => 2, 'total' => 15000000], 'Clothing' => ['count' => 1, 'total' => 150000]]
```

### 8. 🏷️ Higher Order Messages (Jalan Pintas)

**Analogi:** Seperti pintasan keyboard super keren yang bisa lakukan banyak hal dengan satu tekan.

**Mengapa?** Karena seringkali kamu harus memanggil method yang sama ke semua item dalam Collection.

**Metode-metode penting:**
```php
use App\Models\User;

// Ambil semua user yang VIP
$users = User::where('group', 'VIP')->get();

// Biasa: Harus pakai map
$vips = $users->map(function ($user) {
    $user->markAsVip();
    return $user;
});

// Lebih pendek: Pakai higher order message
$users->each->markAsVip(); // Panggil markAsVip() ke semua user

// Hitung total votes dari semua user
$totalVotes = $users->sum->votes; // Ambil field votes, jumlahkan semua

// Cek apakah semua user verified
$allVerified = $users->every->isVerified; // Panggil isVerified() ke semua, cek semua true
```

---

## Bagian 3: Jurus Tingkat Lanjut - Collection Canggih 🚀

### 9. 🔧 Chunking (Pecah Data Besar)

**Analogi:** Seperti membagi tugas besar ke dalam banyak tugas kecil agar lebih mudah dikerjakan.

**Mengapa?** Karena saat kamu punya data sangat besar, memproses semuanya sekaligus bisa membuat aplikasimu lambat atau memakan memori berlebihan.

**Bagaimana?**
```php
// Proses data dalam bagian-bagian kecil
$largeDataset = collect(range(1, 100000)); // Data 100 ribu item

$largeDataset->chunk(1000) // Bagi jadi potongan 1000 item
    ->each(function ($chunk) {
        // Proses masing-masing chunk 1000 item
        foreach ($chunk as $item) {
            // Lakukan sesuatu ke item
            processItem($item);
        }
    });
```

### 10. 🧩 Merging & Combining (Penggabungan)

**Analogi:** Seperti menyatukan beberapa kotak puzzle menjadi satu gambar besar.

**Mengapa?** Karena seringkali kamu punya beberapa sumber data yang perlu disatukan.

**Bagaimana?**
```php
$dataset1 = collect(['a' => 1, 'b' => 2]);
$dataset2 = collect(['c' => 3, 'd' => 4]);

// Merge: Gabungkan dua collection
$merged = $dataset1->merge($dataset2); 
// Hasil: ['a' => 1, 'b' => 2, 'c' => 3, 'd' => 4]

// Concat: Tambahkan array ke collection
$concatenated = $dataset1->concat(['e' => 5]);
// Hasil: ['a' => 1, 'b' => 2, 'e' => 5] (tapi index bukan associative)

// Union: Gabungkan tanpa overwrite value yang sudah ada
$union = $dataset1->union(['b' => 100, 'c' => 3]); 
// Hasil: ['a' => 1, 'b' => 2, 'c' => 3] (nilai dari dataset1 dipertahankan)
```

### 11. 🧠 Custom Method (Macros)

**Analogi:** Seperti membuat alat sendiri di laboratorium sesuai kebutuhan spesifikmu.

**Mengapa?** Karena kadang kamu butuh method yang sangat spesifik untuk kebutuhan aplikasimu.

**Bagaimana?** Di Service Provider (misalnya `AppServiceProvider`):
```php
// Dalam boot() method
use Illuminate\Support\Collection;

Collection::macro('toUpper', function () {
    return $this->map(function ($value) {
        return is_string($value) ? strtoupper($value) : $value;
    });
});

Collection::macro('evenNumbers', function () {
    return $this->filter(function ($value) {
        return is_numeric($value) && $value % 2 === 0;
    });
});

// Gunakan di mana saja
$names = collect(['andi', 'budi'])->toUpper(); // ['ANDI', 'BUDI']
$numbers = collect([1, 2, 3, 4, 5])->evenNumbers(); // [2, 4]
```

### 12. 🧮 Reducing (Kompresi Data)

**Analogi:** Seperti mesin yang menghimpit banyak benda menjadi satu benda kecil yang berisi semua informasi pentingnya.

**Mengapa?** Karena kadang kamu perlu "kompres" kumpulan data jadi satu nilai final.

**Bagaimana?**
```php
$numbers = collect([1, 2, 3, 4, 5]);

// Hitung total (ini sebenarnya adalah reduce internal)
$total = $numbers->sum();

// Lebih kompleks: Hitung factorial
$factorial = $numbers->reduce(function ($carry, $item) {
    return $carry * $item;
}, 1); // 1 adalah nilai awal
// Hasil: 1 * 2 * 3 * 4 * 5 = 120

// Lebih kompleks: Gabungkan semua nama
$names = collect(['Andi', 'Budi', 'Citra']);
$concatenated = $names->reduce(function ($carry, $name) {
    return $carry . ($carry ? ', ' : '') . $name;
}, '');
// Hasil: "Andi, Budi, Citra"
```

### 13. 🔍 Pencarian & Validasi

**Analogi:** Seperti detektif yang mencari informasi spesifik atau memverifikasi keaslian dokumen.

**Mengapa?** Karena sering kamu perlu cek apakah sesuatu ada atau sesuai kondisi tertentu.

**Bagaimana?**
```php
$users = collect([
    ['name' => 'Andi', 'age' => 25],
    ['name' => 'Budi', 'age' => 30],
    ['name' => 'Citra', 'age' => 25],
]);

// Contains: Cek apakah item ada
$hasAndi = $users->contains('name', 'Andi'); // true

// FirstWhere: Ambil item pertama yang cocok
$budi = $users->firstWhere('name', 'Budi'); // ['name' => 'Budi', 'age' => 30]

// Every: Cek apakah semua item memenuhi kondisi
$allAdult = $users->every(function ($user) {
    return $user['age'] >= 18;
}); // true

// Some/Contains: Cek apakah ada setidaknya satu item yang cocok
$hasUnder30 = $users->some(function ($user) {
    return $user['age'] < 30;
}); // true
```

---

## Bagian 4: Lazy Collections - Penguasa Dataset Besar 🦙

### 14. 🌟 Apa Itu Lazy Collection?

**Analogi:** Bayangkan kamu punya buku sebesar ensiklopedia. Kalau kamu baca semua halaman sekaligus, kamu pasti lelah dan memakan waktu lama. Tapi kalau kamu baca satu halaman per satu halaman, sesuai kebutuhan, jauh lebih efisien!

**Mengapa?** Karena **LazyCollection** hanya memproses data **saat benar-benar dibutuhkan**, bukan semua sekaligus. Ini **sangat penting** saat kamu punya dataset yang sangat besar (ribuan atau jutaan data).

**Bagaimana cara kerjanya?** 
- **Collection biasa**: Muat semua data ke memory, proses semua sekaligus.
- **LazyCollection**: Muat data satu per satu, proses satu per satu saat dibutuhkan.

### 15. 🏗️ Membuat Lazy Collection

**Mengapa?** Untuk mengolah data besar tanpa memakan memory berlebihan.

**Bagaimana?**
```php
use Illuminate\Support\LazyCollection;

// Cara 1: Dari generator function
$lazy = LazyCollection::make(function () {
    $file = fopen('large_file.txt', 'r');
    while (($line = fgets($file)) !== false) {
        yield $line; // Berikan satu baris per satu baris
    }
    fclose($file);
});

// Cara 2: Dari query Eloquent (ini sebenarnya LazyCollection)
$users = User::cursor(); // Gunakan cursor() bukan get()

// Cara 3: Dari collection biasa
$normalCollection = collect(range(1, 1000000));
$lazyCollection = $normalCollection->lazy();
```

### 16. 🚀 Manfaat Lazy Collection

```php
// Misalnya kamu harus baca file log 1GB dan proses setiap baris
// COLLECTION BIASA (JELEK! Bisa out of memory)
$lines = collect(file('large_log.txt')) // Muat semua ke memory!
    ->filter(function ($line) { /* ... */ })
    ->map(function ($line) { /* ... */ })
    ->each(function ($processedLine) { /* ... */ });

// LAZY COLLECTION (BAGUS! Hemat memory)
$lazyLines = LazyCollection::make(function () {
    $file = fopen('large_log.txt', 'r');
    while (($line = fgets($file)) !== false) {
        yield $line;
    }
    fclose($file);
});

$lazyLines
    ->filter(function ($line) { /* ... */ })
    ->map(function ($line) { /* ... */ })
    ->each(function ($processedLine) { /* ... */ });
```

### 17. 🧠 Method Khusus Lazy Collection

**takeUntilTimeout()**: Hentikan proses setelah waktu tertentu.
```php
// Proses data maksimal 1 menit
$lazy = LazyCollection::times(INF) // Kumpulan tak hingga
    ->takeUntilTimeout(now()->addMinute());

$lazy->each(function ($item) {
    // Lakukan sesuatu...
    if (someCondition) break; // Proses otomatis berhenti setelah 1 menit
});
```

**throttle()**: Batasi kecepatan pemrosesan (untuk API rate limit).
```php
// Panggil API 1x per detik
User::cursor()
    ->throttle(seconds: 1)
    ->each(function ($user) {
        callApi($user); // Pasti 1 detik jeda antar panggilan
    });
```

**remember()**: Cache hasil yang sudah diproses.
```php
$users = User::cursor()->remember(); // Cache hasil enumerasi

$users->take(5)->all(); // Proses 5 pertama
$users->take(10)->all(); // 5 pertama dari cache, 5 berikutnya baru diproses
```

**withHeartbeat()**: Perpanjang lock saat proses berjalan lama.
```php
$lock = Cache::lock('process_reports', 300); // Lock 5 menit

if ($lock->get()) {
    try {
        Report::where('status', 'pending')
            ->lazy() // Ini LazyCollection
            ->withHeartbeat(
                \Carbon\CarbonInterval::minutes(4), 
                fn() => $lock->extend(\Carbon\CarbonInterval::minutes(5)) // Perpanjang lock tiap 4 menit
            )
            ->each(function ($report) {
                $report->process();
            });
    } finally {
        $lock->release();
    }
}
```

### 18. 🔄 Kontrak Enumerable

**Apa itu?** `Collection` dan `LazyCollection` sama-sama mengimplementasi `Enumerable` contract, jadi **hampir semua method bisa digunakan di keduanya**!

```php
// Berfungsi di Collection biasa
collect([1, 2, 3])->map(function ($x) { return $x * 2; });

// BERJUGA JUGA di LazyCollection
LazyCollection::make([1, 2, 3])->map(function ($x) { return $x * 2; });

// Tapi ada beberapa method yang berbeda:
// Collection biasa: pop(), shift() -> mengubah koleksi
// LazyCollection: Tidak mendukung! Karena immutable dan lazy.
```

---

## Bagian 5: Peralatan Canggih di 'Kotak Perkakas' Collection 🧰

### 19. 🧪 Testing Collection

**Mengapa?** Pastikan manipulasi datamu bekerja sesuai harapan.

**Bagaimana?**
```php
<?php

namespace Tests\Unit;

use Illuminate\Support\Collection;
use Tests\TestCase;

class CollectionTest extends TestCase
{
    public function test_student_filtering_works()
    {
        $students = collect([
            ['name' => 'Andi', 'grade' => 85, 'active' => true],
            ['name' => 'Budi', 'grade' => 70, 'active' => false],
            ['name' => 'Citra', 'grade' => 90, 'active' => true],
        ]);

        $activeHighGrade = $students
            ->filter(fn($s) => $s['active'])
            ->filter(fn($s) => $s['grade'] > 80)
            ->pluck('name');

        $this->assertEquals(['Andi', 'Citra'], $activeHighGrade->values()->toArray());
    }
}
```

### 20. 🚀 Performance Tips

1. **Gunakan LazyCollection** untuk dataset besar.
2. **Minimalkan method chaining yang tidak perlu**.
3. **Gunakan `first()` bukan `get()->first()`**.
4. **Gunakan `pluck()` untuk field tunggal** bukan `map()`.
5. **Gunakan `contains()` untuk pencarian** bukan `filter()->isNotEmpty()`.

### 21. 🛡️ Best Practices

1. **Collection immutable**: Method mengembalikan Collection baru, tidak mengubah aslinya.
2. **Gunakan method yang sesuai**: `sum()` untuk jumlah, `pluck()` untuk field tunggal, dll.
3. **Gunakan Higher Order Messages** untuk kemudahan baca.
4. **Gunakan `tap()`** untuk debugging dalam method chain.
5. **Gunakan `when()`** untuk conditional chaining.

```php
// Conditional chaining dengan when()
$collection = collect($data)
    ->when($withFilters, function ($collection) use ($filters) {
        return $collection->filter($filters);
    })
    ->when($sortBy, function ($collection) use ($sortBy) {
        return $collection->sortBy($sortBy);
    });
```

---

## Bagian 6: Menjadi Master Collection 🏆

### 22. ✨ Wejangan dari Guru

1.  **Gunakan Collection untuk manipulasi data**: Jangan manual-looping.
2.  **Pilih metode yang paling tepat**: `sum()` bukan `reduce()`, `pluck()` bukan `map()`.
3.  **Gunakan LazyCollection saat dataset besar**: Jaga memory usage.
4.  **Gunakan Higher Order Messages**: Lebih ringkas dan mudah dibaca.
5.  **Pahami immutable vs mutable**: Collection biasanya immutable.
6.  **Manfaatkan method chaining**: Buat kode jadi alur kerja yang jelas.

### 23. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai metode Collection di Laravel:

#### 🔄 Basic Operations
| Method | Fungsi |
|--------|--------|
| `collect([1,2,3])` | Buat collection dari array |
| `all()` | Ambil semua item sebagai array |
| `count()` | Hitung jumlah item |
| `isEmpty()` | Cek apakah kosong |
| `isNotEmpty()` | Cek apakah tidak kosong |

#### 🔍 Filtering
| Method | Fungsi |
|--------|--------|
| `filter()` | Filter berdasarkan callback |
| `where('field', 'value')` | Filter berdasarkan field |
| `whereIn('field', ['a', 'b'])` | Filter field dalam array |
| `reject()` | Kebalikan filter |
| `firstWhere()` | Ambil item pertama yang cocok |

#### 🔁 Mapping
| Method | Fungsi |
|--------|--------|
| `map()` | Ubah tiap item |
| `mapWithKeys()` | Ubah jadi array asosiatif |
| `pluck('field')` | Ambil hanya field tertentu |
| `flatMap()` | Map + flatten |

#### 📊 Aggregation
| Method | Fungsi |
|--------|--------|
| `sum()` | Jumlahkan semua |
| `avg()` | Rata-rata |
| `max()` | Nilai maksimum |
| `min()` | Nilai minimum |
| `countBy()` | Hitung berdasarkan nilai |

#### 📋 Grouping & Sorting
| Method | Fungsi |
|--------|--------|
| `groupBy('field')` | Kelompokkan berdasarkan field |
| `sortBy('field')` | Urutkan ascending |
| `sortByDesc('field')` | Urutkan descending |
| `sortKeys()` | Urutkan berdasarkan key |
| `chunk(100)` | Bagi jadi potongan 100 item |

#### 🧠 Advanced
| Method | Fungsi |
|--------|--------|
| `reduce()` | Kompres jadi satu nilai |
| `merge()` | Gabungkan dua collection |
| `concat()` | Gabungkan array |
| `union()` | Gabungkan tanpa overwrite |
| `intersect()` | Ambil item yang sama |

#### 🧭 Lazy Collection Specific
| Method | Fungsi |
|--------|--------|
| `LazyCollection::make()` | Buat dari generator |
| `throttle(seconds: 1)` | Batasi kecepatan |
| `takeUntilTimeout()` | Hentikan setelah timeout |
| `remember()` | Cache hasil enumerasi |
| `withHeartbeat()` | Callback berkala saat proses |

#### 🎯 Higher Order Messages
| Method | Fungsi |
|--------|--------|
| `$collection->each->methodName()` | Panggil method ke semua item |
| `$collection->sum->field` | Jumlahkan field |
| `$collection->every->property` | Cek properti semua item |

### 24. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Collection, dari yang paling dasar sampai yang paling rumit. Kamu hebat! 

Dengan Collection, kamu bisa membuat manipulasi data yang **sangat kompleks** menjadi **sangat elegan** dan **mudah dipahami**. Dari menyaring data, mengubah format, hingga mengelompokkan dan menghitung - semua bisa kamu lakukan dengan berbagai metode Collection.

**Ingat**: Collection adalah alat yang kuat, gunakan dengan bijak. Pilih metode yang paling sesuai untuk kebutuhanmu. Dan kalau datamu sangat besar, jangan lupa pakai **LazyCollection** agar aplikasimu tetap cepat dan hemat memory!

Jangan pernah berhenti belajar dan mencoba! Implementasikan Collection di proyekmu dan lihat betapa indahnya manipulasi data yang kamu bisa lakukan.

Selamat ngoding, murid kesayanganku! 🚀✨
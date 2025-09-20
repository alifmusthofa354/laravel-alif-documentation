# Collections dan Lazy Collections

## Bab 1: Collections

### 1.1 Pendahuluan

Kelas `Illuminate\Support\Collection` menyediakan *wrapper* yang fleksibel dan nyaman untuk bekerja dengan array data. Dengan menggunakan **Collection**, kita bisa melakukan manipulasi data secara *fluent* dengan *method chaining*. Koleksi pada umumnya **immutable**, artinya setiap metode Collection mengembalikan instance Collection baru.

**Contoh:**

```php
$collection = collect(['Taylor', 'Abigail', null])
    ->map(function (?string $name) {
        return strtoupper($name);
    })
    ->reject(function (string $name) {
        return empty($name);
    });

// Hasil: ['TAYLOR', 'ABIGAIL']
```

Dalam contoh di atas, kita membuat Collection, mengubah semua nama menjadi huruf besar, dan menghapus elemen yang kosong.

---

### 1.2 Membuat Collections

Untuk membuat Collection baru, cukup gunakan **helper `collect`**:

```php
$collection = collect([1, 2, 3]);
```

Selain itu, Collection juga bisa dibuat menggunakan metode:

* `make()`
* `fromJson()`

> Catatan: Hasil query Eloquent selalu berupa instance Collection.

---

### 1.3 Memperluas Collections

Collection bersifat *macroable*, artinya kita bisa menambahkan metode baru saat runtime menggunakan `macro()`.

**Contoh:**

```php
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

Collection::macro('toUpper', function () {
    return $this->map(function (string $value) {
        return Str::upper($value);
    });
});

$collection = collect(['first', 'second']);
$upper = $collection->toUpper(); // ['FIRST', 'SECOND']
```

**Macro dengan argumen tambahan:**

```php
use Illuminate\Support\Facades\Lang;

Collection::macro('toLocale', function (string $locale) {
    return $this->map(function (string $value) use ($locale) {
        return Lang::get($value, [], $locale);
    });
});

$collection = collect(['first', 'second']);
$translated = $collection->toLocale('es');
```

> Biasanya, macro didefinisikan di `boot()` pada Service Provider.

---

### 1.4 Metode yang Tersedia

Collection menyediakan ratusan metode yang bisa di-*chain* untuk manipulasi data, misalnya:

* `map()`, `filter()`, `reject()`, `pluck()`, `sum()`, `average()`
* `groupBy()`, `sortBy()`, `unique()`, `merge()`, `flatten()`
* Dan masih banyak lainnya.

> Hampir semua metode mengembalikan Collection baru, sehingga koleksi asli tetap utuh.

---

### 1.5 Higher Order Messages

Collection mendukung **higher order messages**, yaitu cara singkat untuk memanggil metode pada setiap item koleksi.

**Contoh menggunakan `each`:**

```php
use App\Models\User;

$users = User::where('votes', '>', 500)->get();
$users->each->markAsVip();
```

**Contoh menggunakan `sum`:**

```php
$users = User::where('group', 'Development')->get();
$totalVotes = $users->sum->votes;
```

### 1.6 CheatSheet Collection

#### 1. Dasar / Informasi Umum

| Metode             | Deskripsi                                | Contoh Kode                              |
| ------------------ | ---------------------------------------- | ---------------------------------------- |
| `all`              | Mengembalikan semua item sebagai array   | `collect([1,2,3])->all(); // [1,2,3]`    |
| `collect`          | Membuat Collection baru                  | `Collection::collect([1,2,3]);`          |
| `make`             | Alias untuk collect                      | `Collection::make([1,2,3]);`             |
| `fromJson`         | Membuat Collection dari JSON             | `Collection::fromJson('{"a":1,"b":2}');` |
| `value` / `unwrap` | Mengembalikan nilai koleksi atau default | `collect([1])->value(); // [1]`          |
| `isEmpty`          | Mengecek apakah koleksi kosong           | `collect([])->isEmpty(); // true`        |
| `isNotEmpty`       | Mengecek koleksi tidak kosong            | `collect([1])->isNotEmpty(); // true`    |
| `count`            | Menghitung jumlah item                   | `collect([1,2,3])->count(); // 3`        |

---

#### 2. Iterasi / Loop

| Metode       | Deskripsi                                        | Contoh Kode                                             |
| ------------ | ------------------------------------------------ | ------------------------------------------------------- |
| `each`       | Jalankan callback untuk setiap item              | `collect([1,2])->each(fn($x)=>dump($x));`               |
| `eachSpread` | Iterasi array/tuple                              | `collect([[1,2]])->eachSpread(fn($a,$b)=>dump($a,$b));` |
| `tap`        | Jalankan callback tanpa mengubah koleksi         | `collect([1,2])->tap(fn($c)=>dump($c))->all();`         |
| `tapEach`    | Untuk LazyCollection, callback saat item diambil | `$lazy->tapEach(fn($x)=>dump($x));`                     |
| `dd`         | Dump & die koleksi                               | `collect([1,2])->dd();`                                 |
| `dump`       | Dump koleksi tanpa menghentikan eksekusi         | `collect([1,2])->dump();`                               |

---

#### 3. Transformasi / Mapping

| Metode        | Deskripsi                        | Contoh Kode                                                      |
| ------------- | -------------------------------- | ---------------------------------------------------------------- |
| `map`         | Ubah setiap item                 | `collect([1,2])->map(fn($x)=>$x*2); // [2,4]`                    |
| `mapWithKeys` | Ubah menjadi array asosiatif     | `collect(['a','b'])->mapWithKeys(fn($v)=>[$v=>strtoupper($v)]);` |
| `mapInto`     | Ubah item menjadi instance class | `collect(['a'])->mapInto(User::class);`                          |
| `mapSpread`   | Map dengan unpack tuple          | `collect([[1,2]])->mapSpread(fn($a,$b)=>$a+$b); // [3]`          |
| `flatMap`     | Map + flatten                    | `collect([1,2])->flatMap(fn($x)=>[$x,$x*2]); // [1,2,2,4]`       |
| `flatten`     | Meratakan array multidimensi     | `collect([[1,2],[3,4]])->flatten(); // [1,2,3,4]`                |
| `transform`   | Ubah koleksi asli                | `collect([1,2])->transform(fn($x)=>$x*2); // [2,4]`              |
| `flip`        | Tukar key dan value              | `collect(['a'=>1])->flip(); // [1=>'a']`                         |

---

#### 4. Filter / Seleksi

| Metode            | Deskripsi                            | Contoh Kode                                                     |
| ----------------- | ------------------------------------ | --------------------------------------------------------------- |
| `filter`          | Ambil item sesuai callback           | `collect([1,2,3])->filter(fn($x)=>$x>1); // [2,3]`              |
| `reject`          | Hapus item sesuai callback           | `collect([1,2,3])->reject(fn($x)=>$x>1); // [1]`                |
| `where`           | Filter berdasarkan nilai             | `collect([['id'=>1],['id'=>2]])->where('id',2); // [['id'=>2]]` |
| `whereStrict`     | Filter dengan strict                 | `collect([1,'1'])->whereStrict(null,1); // [1]`                 |
| `whereIn`         | Filter jika nilai ada di array       | `collect([1,2,3])->whereIn(null,[1,3]); // [1,3]`               |
| `whereNotIn`      | Filter jika nilai tidak ada di array | `collect([1,2,3])->whereNotIn(null,[1,3]); // [2]`              |
| `whereBetween`    | Filter di antara dua nilai           | `collect([1,2,3])->whereBetween(null,[1,2]); // [1,2]`          |
| `whereNotBetween` | Filter di luar rentang               | `collect([1,2,3])->whereNotBetween(null,[1,2]); // [3]`         |
| `whereNull`       | Filter null                          | `collect([null,1])->whereNull(); // [null]`                     |
| `whereNotNull`    | Filter bukan null                    | `collect([null,1])->whereNotNull(); // [1]`                     |
| `firstWhere`      | Ambil item pertama yang cocok        | `collect([1,2,3])->firstWhere(fn($x)=>$x>1); // 2`              |

---

#### 5. Agregasi / Statistik

| Metode            | Deskripsi                               | Contoh Kode                                        |
| ----------------- | --------------------------------------- | -------------------------------------------------- |
| `sum`             | Menjumlahkan semua item                 | `collect([1,2,3])->sum(); // 6`                    |
| `avg` / `average` | Menghitung rata-rata                    | `collect([1,2,3])->avg(); // 2`                    |
| `min`             | Nilai minimum                           | `collect([1,2,3])->min(); // 1`                    |
| `max`             | Nilai maksimum                          | `collect([1,2,3])->max(); // 3`                    |
| `median`          | Nilai tengah                            | `collect([1,2,3])->median(); // 2`                 |
| `mode`            | Nilai terbanyak                         | `collect([1,2,2,3])->mode(); // [2]`               |
| `countBy`         | Hitung item per key                     | `collect([1,2,2])->countBy(); // [1=>1,2=>2]`      |
| `every`           | Cek semua item sesuai kondisi           | `collect([2,4])->every(fn($x)=>$x%2===0); // true` |
| `some`            | Cek setidaknya satu item sesuai kondisi | `collect([1,2])->some(fn($x)=>$x>1); // true`      |

---

#### 6. Menggabungkan / Mengubah Struktur

| Metode                | Deskripsi                       | Contoh Kode                                                              |
| --------------------- | ------------------------------- | ------------------------------------------------------------------------ |
| `merge`               | Gabungkan koleksi               | `collect([1,2])->merge([3,4]); // [1,2,3,4]`                             |
| `mergeRecursive`      | Gabungkan rekursif              | `collect(['a'=>['x'=>1]])->mergeRecursive(['a'=>['y'=>2]]);`             |
| `concat`              | Tambahkan item                  | `collect([1,2])->concat([3,4]); // [1,2,3,4]`                            |
| `combine`             | Jadikan array asosiatif         | `collect(['a','b'])->combine([1,2]); // ['a'=>1,'b'=>2]`                 |
| `zip`                 | Gabungkan item berdampingan     | `collect([1,2])->zip(['a','b']); // [[1,'a'],[2,'b']]`                   |
| `collapse`            | Flatten array dalam koleksi     | `collect([[1,2],[3,4]])->collapse(); // [1,2,3,4]`                       |
| `collapseWithKeys`    | Flatten & pertahankan key       | `collect([['a'=>1],['b'=>2]])->collapseWithKeys(); // ['a'=>1,'b'=>2]`   |
| `union`               | Gabungkan tanpa overwrite key   | `collect(['a'=>1])->union(['a'=>2,'b'=>2]); // ['a'=>1,'b'=>2]`          |
| `intersect`           | Ambil item yang sama            | `collect([1,2,3])->intersect([2,3,4]); // [2,3]`                         |
| `intersectUsing`      | Intersect dengan callback       | `collect([1,2])->intersectUsing([2,3], fn($a,$b)=>$a===$b);`             |
| `intersectAssoc`      | Intersect key & value           | `collect(['a'=>1,'b'=>2])->intersectAssoc(['a'=>1,'b'=>3]); // ['a'=>1]` |
| `intersectAssocUsing` | Intersect assoc dengan callback | `...`                                                                    |
| `intersectByKeys`     | Intersect berdasarkan key saja  | `collect(['a'=>1,'b'=>2])->intersectByKeys(['b'=>3]); // ['b'=>2]`       |

---

#### 7. Sorting / Ordering

| Metode          | Deskripsi                            | Contoh Kode                                                |
| --------------- | ------------------------------------ | ---------------------------------------------------------- |
| `sort`          | Urutkan nilai                        | `collect([3,1,2])->sort(); // [1,2,3]`                     |
| `sortDesc`      | Urutkan menurun                      | `collect([1,2,3])->sortDesc(); // [3,2,1]`                 |
| `sortBy`        | Urutkan berdasarkan callback         | `collect([['x'=>2],['x'=>1]])->sortBy('x');`               |
| `sortByDesc`    | Urutkan menurun berdasarkan callback | `...`                                                      |
| `sortKeys`      | Urutkan key                          | `collect(['b'=>1,'a'=>2])->sortKeys(); // ['a'=>2,'b'=>1]` |
| `sortKeysDesc`  | Urutkan key menurun                  | `collect(['b'=>1,'a'=>2])->sortKeysDesc();`                |
| `sortKeysUsing` | Urutkan key dengan callback          | `...`                                                      |

---

#### 8. Chunk / Paging

| Metode       | Deskripsi                       | Contoh Kode                                              |
| ------------ | ------------------------------- | -------------------------------------------------------- |
| `chunk`      | Pecah koleksi jadi bagian kecil | `collect([1,2,3,4])->chunk(2); // [[1,2],[3,4]]`         |
| `chunkWhile` | Chunk sesuai kondisi callback   | `collect([1,2,3,4])->chunkWhile(fn($a,$b)=>$b-$a===1);`  |
| `forPage`    | Ambil item per halaman          | `collect([1,2,3,4])->forPage(2,2); // [3,4]`             |
| `split`      | Bagi menjadi N bagian           | `collect([1,2,3,4])->split(2); // [[1,2],[3,4]]`         |
| `slice`      | Ambil potongan koleksi          | `collect([1,2,3])->slice(1,2); // [2,3]`                 |
| `sliding`    | Ambil window sliding            | `collect([1,2,3,4])->sliding(2); // [[1,2],[2,3],[3,4]]` |



## Bab 2: Lazy Collections

### 2.1 Pendahuluan

**LazyCollection** memanfaatkan **PHP Generators** untuk mengolah dataset besar dengan penggunaan memori minimal. Cocok untuk file besar atau dataset dengan ribuan model.

**Contoh membaca file log besar:**

```php
use Illuminate\Support\LazyCollection;

LazyCollection::make(function () {
    $handle = fopen('log.txt', 'r');
    while (($line = fgets($handle)) !== false) {
        yield $line;
    }
    fclose($handle);
})->chunk(4)->map(function (array $lines) {
    return LogEntry::fromLines($lines);
})->each(function (LogEntry $logEntry) {
    // Proses log entry...
});
```

---

### 2.2 Membuat Lazy Collections

Gunakan **generator PHP** dengan `LazyCollection::make()`:

```php
$lazy = LazyCollection::make(function () {
    $handle = fopen('log.txt', 'r');
    while (($line = fgets($handle)) !== false) {
        yield $line;
    }
    fclose($handle);
});
```

---

### 2.3 Kontrak Enumerable

Hampir semua metode Collection juga tersedia di LazyCollection karena keduanya mengimplementasikan **Enumerable contract**, seperti:

* `map()`, `filter()`, `reduce()`, `sum()`, `groupBy()`, dll.

> Catatan: Metode yang mengubah koleksi (`shift`, `pop`, `prepend`) **tidak tersedia** di LazyCollection.

---

### 2.4 Metode Khusus LazyCollection

1. **takeUntilTimeout()** – hentikan enumerasi setelah waktu tertentu:

```php
$lazy = LazyCollection::times(INF)->takeUntilTimeout(now()->addMinute());
$lazy->each(fn($n) => dump($n));
```

2. **tapEach()** – jalankan callback saat item diambil:

```php
$lazy = LazyCollection::times(INF)->tapEach(fn($v) => dump($v));
$array = $lazy->take(3)->all(); // Dump 3 item pertama
```

3. **throttle()** – batasi eksekusi setiap item (misal API rate limit):

```php
User::where('vip', true)
    ->cursor()
    ->throttle(seconds: 1)
    ->each(fn($user) => callApi($user));
```

4. **remember()** – cache nilai yang sudah di-*enumerate*:

```php
$users = User::cursor()->remember();
$users->take(5)->all(); // Ambil 5 pertama
$users->take(20)->all(); // Ambil 20 berikutnya, 5 pertama dari cache
```

5. **withHeartbeat()** – jalankan callback berkala saat koleksi diproses:

```php
use Carbon\CarbonInterval;

$lock = Cache::lock('generate-reports', 300);
if ($lock->get()) {
    try {
        Report::where('status', 'pending')
            ->lazy()
            ->withHeartbeat(CarbonInterval::minutes(4), fn() => $lock->extend(CarbonInterval::minutes(5)))
            ->each(fn($report) => $report->process());
    } finally {
        $lock->release();
    }
}
```


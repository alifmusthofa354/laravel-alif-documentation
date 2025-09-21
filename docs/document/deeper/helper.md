# **Laravel Helpers Cheatsheet Lengkap**

 ## Methode yang sering dipakai

**1. Arrays & Objects Helpers (Arr, data\_\*, head, last)**

Sering digunakan:

* `Arr::get($array, $key, $default)` → ambil data dari array bersarang
* `Arr::set(&$array, $key, $value)` → set data di array bersarang
* `Arr::has($array, $key)` → cek key ada
* `Arr::only($array, $keys)` → ambil subset
* `Arr::except($array, $keys)` → hapus key tertentu
* `data_get($target, $key, $default)` → ambil data fleksibel dari array/object
* `data_set(&$target, $key, $value)` → set data di array/object
* `head($array)` → ambil elemen pertama
* `last($array)` → ambil elemen terakhir

Kadang dipakai:

* `Arr::flatten($array)` → flatten array
* `Arr::wrap($value)` → buat array dari value tunggal

Jarang dipakai:

* `Arr::mapSpread`, `Arr::mapWithKeys`, `Arr::sole`, `Arr::partition` → untuk kasus khusus

---

 **2. Numbers Helpers**

Sering digunakan:

* `Number::format($number, $decimals)` → format angka
* `Number::parseInt($value)` / `Number::parseFloat($value)` → konversi tipe

Kadang dipakai:

* `Number::currency($amount)` → format currency
* `Number::forHumans($number)` → angka mudah dibaca

Jarang dipakai:

* `Number::abbreviate`, `Number::spell`, `Number::spellOrdinal`

---

 **3. Paths Helpers**

Sering digunakan:

* `app_path()`, `base_path()`, `config_path()` → akses folder
* `storage_path()` → akses storage
* `public_path()` → akses public

Jarang dipakai:

* `lang_path()`, `resource_path()` → tergantung proyek

---

 **4. URLs Helpers**

Sering digunakan:

* `route($name, $params)` → generate URL route
* `url($path)` → generate URL lengkap
* `action($controllerAction)` → URL ke controller action
* `asset($path)` → URL asset

Jarang dipakai:

* `to_route()`, `to_action()`, `secure_url()`, `secure_asset()` → tergantung kebutuhan HTTPS

---

 **5. Miscellaneous Helpers**

Sering digunakan:

* `dd()`, `dump()` → debug
* `collect()` → Collection helper
* `config($key)` → ambil config
* `app()` → ambil instance app
* `auth()->user()` → akses user
* `request()` → akses request input
* `redirect()` → redirect response
* `session()` → akses/set session
* `now()`, `today()` → tanggal sekarang
* `abort()`, `abort_if()`, `abort_unless()` → handle error/HTTP status
* `optional()` → safe call
* `value($value)` → kadang digunakan untuk default callable

Kadang dipakai:

* `dispatch()`, `dispatch_sync()` → jobs
* `validator()` → validasi data
* `encrypt()`, `decrypt()` → keamanan

Jarang dipakai:

* `broadcast()`, `broadcast_if()`, `broadcast_unless()`, `once()`, `rescue()`, `tap()`

---

 **6. Other Utilities**

Sering digunakan:

* `now()` / `Carbon::now()` → waktu sekarang
* `Uri::route()` / `Uri::to()` → generate URL
* `Uri->withQuery()`, `Uri->replaceQuery()` → manipulasi query string

Kadang dipakai:

* `Benchmark::dd()` → debug/performance
* `defer()` → optimasi response (jarang kecuali high load)
* `Sleep::for()` / `Sleep::fake()` → testing & delay
* `Pipeline` → proses data berantai

Jarang dipakai:

* `Timebox`, `Lottery`, `Uri->redirect()`, `Uri::of()` → kasus spesifik

---

✅ **Kesimpulan:**
Jika kamu ingin **menghafal atau sering pakai di daily Laravel**, fokus ke:

* `Arr::get`, `Arr::set`, `Arr::has`, `data_get`, `data_set`, `head`, `last`
* `route`, `url`, `asset`, `action`
* `dd`, `dump`, `collect`, `config`, `request`, `session`, `auth()->user()`, `redirect`
* `now`, `today`

Yang lain itu **bonus/helper canggih** tergantung kebutuhan proyek.



## **1. Arrays & Objects Helpers (Arr, data\_\*, head, last)**

| Helper/Method                             | Deskripsi    Singkat | Contoh                                                      |
| :---- | :---------------------------- | :---- |
| `Arr::accessible($value)`                 | Mengecek apakah nilai dapat diakses sebagai array | `Arr::accessible(['a'=>1]); // true`                                |
| `Arr::add($array, $key, $value)`          | Menambahkan elemen jika key belum ada             | `$array = Arr::add(['a'=>1],'b',2);`                                |
| `Arr::array($value)`                      | Mengubah value menjadi array                      | `Arr::array('foo'); // ['foo']`                                     |
| `Arr::boolean($value)`                    | Konversi value menjadi boolean                    | `Arr::boolean('true'); // true`                                     |
| `Arr::collapse($arrays)`                  | Menggabungkan beberapa array menjadi satu         | `Arr::collapse([[1,2],[3,4]]); // [1,2,3,4]`                        |
| `Arr::crossJoin(...$arrays)`              | Kombinasi semua kemungkinan elemen                | `Arr::crossJoin([1,2],[3,4]); // [[1,3],[1,4],[2,3],[2,4]]`         |
| `Arr::divide($array)`                     | Pisahkan key dan value menjadi 2 array            | `Arr::divide(['a'=>1,'b'=>2]); // [['a','b'],[1,2]]`                |
| `Arr::dot($array)`                        | Array bersarang menjadi dot notation              | `Arr::dot(['user'=>['name'=>'Budi']]); // ['user.name'=>'Budi']`    |
| `Arr::every($array, $callback)`           | Mengecek semua elemen sesuai kondisi              | `Arr::every([2,4], fn($v)=>$v%2==0); // true`                       |
| `Arr::except($array, $keys)`              | Menghapus key tertentu                            | `Arr::except(['a'=>1,'b'=>2],'b'); // ['a'=>1]`                     |
| `Arr::exists($array, $key)`               | Mengecek key ada                                  | `Arr::exists(['a'=>1],'a'); // true`                                |
| `Arr::first($array, $callback=null)`      | Ambil elemen pertama                              | `Arr::first([1,2,3]); // 1`                                         |
| `Arr::flatten($array)`                    | Array multidimensi → 1 dimensi                    | `Arr::flatten([[1,2],[3,4]]); // [1,2,3,4]`                         |
| `Arr::float($value)`                      | Konversi value menjadi float                      | `Arr::float('1.23'); // 1.23`                                       |
| `Arr::forget(&$array, $keys)`             | Hapus key array (by reference)                    | `$arr=['a'=>1]; Arr::forget($arr,'a');`                             |
| `Arr::from($value)`                       | Buat array dari value jika belum array            | `Arr::from('foo'); // ['foo']`                                      |
| `Arr::get($array, $key, $default=null)`   | Ambil nilai dari array bersarang                  | `Arr::get(['user'=>['name'=>'Budi']],'user.name'); // Budi`         |
| `Arr::has($array, $keys)`                 | Cek keberadaan key                                | `Arr::has(['a'=>1],'a'); // true`                                   |
| `Arr::hasAll($array, $keys)`              | Cek semua key ada                                 | `Arr::hasAll(['a'=>1,'b'=>2],['a','b']); // true`                   |
| `Arr::hasAny($array, $keys)`              | Cek minimal satu key ada                          | `Arr::hasAny(['a'=>1],['a','b']); // true`                          |
| `Arr::integer($value)`                    | Konversi value menjadi integer                    | `Arr::integer('10'); // 10`                                         |
| `Arr::isAssoc($array)`                    | Cek apakah array associative                      | `Arr::isAssoc(['a'=>1]); // true`                                   |
| `Arr::isList($array)`                     | Cek apakah array numerik                          | `Arr::isList([1,2,3]); // true`                                     |
| `Arr::join($array, $glue=',')`            | Gabungkan array menjadi string                    | `Arr::join([1,2,3],'-'); // "1-2-3"`                                |
| `Arr::keyBy($array, $key)`                | Index array berdasarkan key tertentu              | `Arr::keyBy([['id'=>1]],'id'); // [1=>['id'=>1]]`                   |
| `Arr::last($array, $callback=null)`       | Ambil elemen terakhir                             | `Arr::last([1,2,3]); // 3`                                          |
| `Arr::map($array, $callback)`             | Transform semua elemen                            | `Arr::map([1,2], fn($v)=>$v*2); // [2,4]`                           |
| `Arr::mapSpread($array, $callback)`       | Map dengan spread argumen                         | `Arr::mapSpread([[1,2]], fn($a,$b)=>$a+$b); // [3]`                 |
| `Arr::mapWithKeys($array, $callback)`     | Map dengan key baru                               | `Arr::mapWithKeys([1,2], fn($v)=>[$v=>$v*2]); // [1=>2,2=>4]`       |
| `Arr::only($array, $keys)`                | Ambil subset array                                | `Arr::only(['a'=>1,'b'=>2],['a']); // ['a'=>1]`                     |
| `Arr::partition($array, $callback)`       | Bagi array berdasarkan kondisi                    | `Arr::partition([1,2,3], fn($v)=>$v>1); // [[2,3],[1]]`             |
| `Arr::pluck($array, $value, $key=null)`   | Ambil value tertentu                              | `Arr::pluck([['name'=>'Budi']],'name'); // ['Budi']`                |
| `Arr::prepend($array, $value, $key=null)` | Tambah di awal array                              | `Arr::prepend([2,3],1); // [1,2,3]`                                 |
| `Arr::prependKeysWith($array, $prefix)`   | Tambah prefix ke key                              | `Arr::prependKeysWith(['a'=>1],'pre_'); // ['pre_a'=>1]`            |
| `Arr::pull(&$array, $key, $default=null)` | Ambil & hapus value                               | `$arr=['a'=>1]; Arr::pull($arr,'a'); // 1`                          |
| `Arr::push($array, $value)`               | Tambah elemen di akhir                            | `Arr::push([1,2],3); // [1,2,3]`                                    |
| `Arr::query($array)`                      | Array → query string                              | `Arr::query(['a'=>1]); // "a=1"`                                    |
| `Arr::random($array, $number=1)`          | Ambil elemen random                               | `Arr::random([1,2,3]); // 2`                                        |
| `Arr::reject($array, $callback)`          | Buang elemen tertentu                             | `Arr::reject([1,2,3], fn($v)=>$v<3); // [3]`                        |
| `Arr::select($array, $keys)`              | Ambil subset                                      | `Arr::select(['a'=>1,'b'=>2],['a']); // ['a'=>1]`                   |
| `Arr::set(&$array, $key, $value)`         | Tetapkan value di array bersarang                 | `$arr=[]; Arr::set($arr,'user.name','Budi');`                       |
| `Arr::shuffle($array)`                    | Acak array                                        | `Arr::shuffle([1,2,3]); // [2,1,3]`                                 |
| `Arr::sole($array, $key=null)`            | Ambil satu elemen, error jika >1                  | `Arr::sole([1]); // 1`                                              |
| `Arr::some($array, $callback)`            | Cek minimal satu memenuhi kondisi                 | `Arr::some([1,2], fn($v)=>$v>1); // true`                           |
| `Arr::sort($array)`                       | Sort ascending                                    | `Arr::sort([3,1,2]); // [1,2,3]`                                    |
| `Arr::sortDesc($array)`                   | Sort descending                                   | `Arr::sortDesc([1,2,3]); // [3,2,1]`                                |
| `Arr::sortRecursive($array)`              | Sort array multidimensi                           | `Arr::sortRecursive([['b'=>2,'a'=>1]]); // [['a'=>1,'b'=>2]]`       |
| `Arr::string($value)`                     | Konversi menjadi string                           | `Arr::string(123); // "123"`                                        |
| `Arr::take($array, $keys)`                | Ambil key tertentu                                | `Arr::take(['a'=>1,'b'=>2],['a']); // ['a'=>1]`                     |
| `Arr::toCssClasses($array)`               | Array → class string                              | `Arr::toCssClasses(['btn','active']); // "btn active"`              |
| `Arr::toCssStyles($array)`                | Array → style string                              | `Arr::toCssStyles(['color'=>'red']); // "color:red;"`               |
| `Arr::undot($array)`                      | Dot notation → array bersarang                    | `Arr::undot(['user.name'=>'Budi']); // ['user'=>['name'=>'Budi']]`  |
| `Arr::where($array, $callback)`           | Ambil elemen sesuai callback                      | `Arr::where([1,2,3], fn($v)=>$v>1); // [2,3]`                       |
| `Arr::whereNotNull($array)`               | Ambil elemen non-null                             | `Arr::whereNotNull([1,null,2]); // [1,2]`                           |
| `Arr::wrap($value)`                       | Buat array dari value jika bukan array            | `Arr::wrap(1); // [1]`                                              |
| `data_fill(&$target, $key, $value)`       | Isi data jika key kosong                          | `$data=[]; data_fill($data,'user.name','Budi');`                    |
| `data_get($target, $key, $default=null)`  | Ambil data                                        | `data_get(['user'=>['name'=>'Budi']],'user.name'); // Budi`         |
| `data_set(&$target, $key, $value)`        | Tetapkan data                                     | `$data=[]; data_set($data,'user.name','Budi');`                     |
| `data_forget(&$target, $key)`             | Hapus key                                         | `$data=['user'=>['name'=>'Budi']]; data_forget($data,'user.name');` |
| `head($array)`                            | Ambil elemen pertama                              | `head([1,2,3]); // 1`                                               |
| `last($array)`                            | Ambil elemen terakhir                             | `last([1,2,3]); // 3`                                               |

---

```php
use Illuminate\Support\Arr;

// ==========================
// ARRAYS HELPERS
// ==========================

// 1. Mengecek apakah array bisa diakses
$array = ['a' => 1];
var_dump(Arr::accessible($array)); // true

// 2. Menambahkan elemen jika key belum ada
$array = Arr::add($array, 'b', 2);
print_r($array); // ['a'=>1, 'b'=>2]

// 3. Mengubah value menjadi array
print_r(Arr::array('foo')); // ['foo']

// 4. Konversi value menjadi boolean
var_dump(Arr::boolean('true')); // true

// 5. Menggabungkan beberapa array
print_r(Arr::collapse([[1,2],[3,4]])); // [1,2,3,4]

// 6. Kombinasi semua kemungkinan elemen
print_r(Arr::crossJoin([1,2],[3,4])); // [[1,3],[1,4],[2,3],[2,4]]

// 7. Pisahkan key dan value menjadi 2 array
print_r(Arr::divide(['a'=>1,'b'=>2])); // [['a','b'],[1,2]]

// 8. Dot notation
$nested = ['user'=>['name'=>'Budi']];
print_r(Arr::dot($nested)); // ['user.name'=>'Budi']

// 9. Cek semua elemen sesuai kondisi
var_dump(Arr::every([2,4], fn($v)=>$v%2==0)); // true

// 10. Menghapus key tertentu
print_r(Arr::except(['a'=>1,'b'=>2],'b')); // ['a'=>1]

// 11. Mengecek key ada
var_dump(Arr::exists(['a'=>1],'a')); // true

// 12. Ambil elemen pertama dan terakhir
print_r(Arr::first([1,2,3])); // 1
print_r(Arr::last([1,2,3]));  // 3

// 13. Flatten array multidimensi
print_r(Arr::flatten([[1,2],[3,4]])); // [1,2,3,4]

// 14. Konversi value menjadi float
var_dump(Arr::float('1.23')); // 1.23

// 15. Hapus key array by reference
$arr = ['a'=>1];
Arr::forget($arr,'a');
print_r($arr); // []

// 16. Buat array dari value jika belum array
print_r(Arr::from('foo')); // ['foo']

// 17. Ambil nilai dari array bersarang
$user = ['user'=>['name'=>'Budi']];
echo Arr::get($user,'user.name'); // Budi

// 18. Cek keberadaan key
var_dump(Arr::has(['a'=>1],'a')); // true

// 19. Cek semua key ada
var_dump(Arr::hasAll(['a'=>1,'b'=>2],['a','b'])); // true

// 20. Cek minimal satu key ada
var_dump(Arr::hasAny(['a'=>1],['a','b'])); // true

// 21. Konversi value menjadi integer
var_dump(Arr::integer('10')); // 10

// 22. Cek array associative atau list
var_dump(Arr::isAssoc(['a'=>1])); // true
var_dump(Arr::isList([1,2,3])); // true

// 23. Gabungkan array menjadi string
echo Arr::join([1,2,3],'-'); // "1-2-3"

// 24. Index array berdasarkan key
print_r(Arr::keyBy([['id'=>1]],'id')); // [1=>['id'=>1]]

// 25. Transform semua elemen
print_r(Arr::map([1,2], fn($v)=>$v*2)); // [2,4]

// 26. Map dengan spread argumen
print_r(Arr::mapSpread([[1,2]], fn($a,$b)=>$a+$b)); // [3]

// 27. Map dengan key baru
print_r(Arr::mapWithKeys([1,2], fn($v)=>[$v=>$v*2])); // [1=>2,2=>4]

// 28. Ambil subset array
print_r(Arr::only(['a'=>1,'b'=>2],['a'])); // ['a'=>1]

// 29. Bagi array berdasarkan kondisi
print_r(Arr::partition([1,2,3], fn($v)=>$v>1)); // [[2,3],[1]]

// 30. Ambil value tertentu
print_r(Arr::pluck([['name'=>'Budi']],'name')); // ['Budi']

// 31. Tambah di awal array
print_r(Arr::prepend([2,3],1)); // [1,2,3]

// 32. Tambah prefix ke key
print_r(Arr::prependKeysWith(['a'=>1],'pre_')); // ['pre_a'=>1]

// 33. Ambil & hapus value
$arr = ['a'=>1];
echo Arr::pull($arr,'a'); // 1
print_r($arr); // []

// 34. Tambah elemen di akhir
print_r(Arr::push([1,2],3)); // [1,2,3]

// 35. Array → query string
echo Arr::query(['a'=>1]); // "a=1"

// 36. Ambil elemen random
print_r(Arr::random([1,2,3])); // misal 2

// 37. Buang elemen tertentu
print_r(Arr::reject([1,2,3], fn($v)=>$v<3)); // [3]

// 38. Ambil subset
print_r(Arr::select(['a'=>1,'b'=>2],['a'])); // ['a'=>1]

// 39. Tetapkan value di array bersarang
$arr = [];
Arr::set($arr,'user.name','Budi');
print_r($arr); // ['user'=>['name'=>'Budi']]

// 40. Acak array
print_r(Arr::shuffle([1,2,3])); // misal [2,1,3]

// 41. Ambil satu elemen, error jika >1
print_r(Arr::sole([1])); // 1

// 42. Cek minimal satu memenuhi kondisi
var_dump(Arr::some([1,2], fn($v)=>$v>1)); // true

// 43. Sort ascending & descending
print_r(Arr::sort([3,1,2])); // [1,2,3]
print_r(Arr::sortDesc([1,2,3])); // [3,2,1]

// 44. Sort array multidimensi
print_r(Arr::sortRecursive([['b'=>2,'a'=>1]])); // [['a'=>1,'b'=>2]]

// 45. Konversi menjadi string
echo Arr::string(123); // "123"

// 46. Ambil key tertentu
print_r(Arr::take(['a'=>1,'b'=>2],['a'])); // ['a'=>1]

// 47. Array → class string / style string
echo Arr::toCssClasses(['btn','active']); // "btn active"
echo Arr::toCssStyles(['color'=>'red']); // "color:red;"

// 48. Dot notation → array bersarang
print_r(Arr::undot(['user.name'=>'Budi'])); // ['user'=>['name'=>'Budi']]

// 49. Ambil elemen sesuai callback
print_r(Arr::where([1,2,3], fn($v)=>$v>1)); // [2,3]

// 50. Ambil elemen non-null
print_r(Arr::whereNotNull([1,null,2])); // [1,2]

// 51. Buat array dari value jika bukan array
print_r(Arr::wrap(1)); // [1]

// ==========================
// DATA HELPERS
// ==========================

// 52. Isi data jika key kosong
$data = [];
data_fill($data,'user.name','Budi');
print_r($data); // ['user'=>['name'=>'Budi']]

// 53. Ambil data
echo data_get($data,'user.name'); // Budi

// 54. Tetapkan data
$data2 = [];
data_set($data2,'user.name','Budi');
print_r($data2); // ['user'=>['name'=>'Budi']]

// 55. Hapus key
$data3 = ['user'=>['name'=>'Budi']];
data_forget($data3,'user.name');
print_r($data3); // ['user'=>[]]

// 56. Ambil elemen pertama dan terakhir
print_r(head([1,2,3])); // 1
print_r(last([1,2,3])); // 3
```




## **2. Numbers Helpers**

| Helper/Method                          | Deskripsi Singkat                        | Contoh Kode                                                  |
| -------------------------------------- | ---------------------------------------- | ------------------------------------------------------------ |
| `Number::abbreviate($number)`          | Memendekkan angka menjadi format singkat | `Number::abbreviate(1200); // 1.2K`                          |
| `Number::clamp($value, $min, $max)`    | Membatasi angka dalam rentang tertentu   | `Number::clamp(15,0,10); // 10`                              |
| `Number::currency($amount)`            | Format angka sebagai mata uang           | `Number::currency(1500); // Rp 1.500,00`                     |
| `Number::defaultCurrency()`            | Ambil default currency                   | `Number::defaultCurrency(); // "IDR"`                        |
| `Number::defaultLocale()`              | Ambil default locale                     | `Number::defaultLocale(); // "id"`                           |
| `Number::fileSize($bytes)`             | Format ukuran file                       | `Number::fileSize(1024); // 1 KB`                            |
| `Number::forHumans($number)`           | Format angka agar mudah dibaca           | `Number::forHumans(1000); // 1K`                             |
| `Number::format($number, $decimals=0)` | Format angka dengan desimal              | `Number::format(1500.456,2); // 1.500,46`                    |
| `Number::ordinal($number)`             | Ubah angka menjadi ordinal               | `Number::ordinal(1); // 1st`                                 |
| `Number::pairs($number)`               | Ambil pasangan angka                     | `Number::pairs(1234); // [12,34]`                            |
| `Number::parseInt($value)`             | Parse menjadi integer                    | `Number::parseInt('10'); // 10`                              |
| `Number::parseFloat($value)`           | Parse menjadi float                      | `Number::parseFloat('1.23'); // 1.23`                        |
| `Number::percentage($value)`           | Format angka sebagai persentase          | `Number::percentage(0.75); // 75%`                           |
| `Number::spell($number)`               | Ubah angka menjadi kata                  | `Number::spell(100); // seratus`                             |
| `Number::spellOrdinal($number)`        | Ubah angka ordinal menjadi kata          | `Number::spellOrdinal(1); // pertama`                        |
| `Number::trim($number)`                | Menghapus trailing zero                  | `Number::trim(1.5000); // 1.5`                               |
| `Number::useLocale($locale)`           | Set locale                               | `Number::useLocale('id');`                                   |
| `Number::withLocale($locale)`          | Gunakan locale sementara                 | `Number::withLocale('en', fn()=>Number::format(1000));`      |
| `Number::useCurrency($currency)`       | Set currency                             | `Number::useCurrency('USD');`                                |
| `Number::withCurrency($currency)`      | Gunakan currency sementara               | `Number::withCurrency('USD', fn()=>Number::currency(1000));` |

```php
use Illuminate\Support\Number;

// 1. Memendekkan angka menjadi format singkat
echo Number::abbreviate(1200); // 1.2K

// 2. Membatasi angka dalam rentang tertentu
echo Number::clamp(15, 0, 10); // 10

// 3. Format angka sebagai mata uang
echo Number::currency(1500); // Rp 1.500,00

// 4. Ambil default currency
echo Number::defaultCurrency(); // IDR

// 5. Ambil default locale
echo Number::defaultLocale(); // id

// 6. Format ukuran file
echo Number::fileSize(1024); // 1 KB
echo Number::fileSize(1048576); // 1 MB

// 7. Format angka agar mudah dibaca
echo Number::forHumans(1000); // 1K
echo Number::forHumans(1250000); // 1.25M

// 8. Format angka dengan desimal
echo Number::format(1500.456, 2); // 1.500,46

// 9. Ubah angka menjadi ordinal
echo Number::ordinal(1); // 1st
echo Number::ordinal(2); // 2nd

// 10. Ambil pasangan angka
print_r(Number::pairs(1234)); // [12, 34]
print_r(Number::pairs(56789)); // [56, 78, 9]

// 11. Parse menjadi integer
var_dump(Number::parseInt('10')); // 10
var_dump(Number::parseInt('15.6')); // 15

// 12. Parse menjadi float
var_dump(Number::parseFloat('1.23')); // 1.23

// 13. Format angka sebagai persentase
echo Number::percentage(0.75); // 75%
echo Number::percentage(0.1234, 1); // 12.3%

// 14. Ubah angka menjadi kata
echo Number::spell(100); // seratus
echo Number::spell(1234); // seribu dua ratus tiga puluh empat

// 15. Ubah angka ordinal menjadi kata
echo Number::spellOrdinal(1); // pertama
echo Number::spellOrdinal(2); // kedua

// 16. Menghapus trailing zero
echo Number::trim(1.5000); // 1.5
echo Number::trim(2.0); // 2

// 17. Set locale permanen
Number::useLocale('id');
echo Number::format(1000.5); // 1.000,5

// 18. Gunakan locale sementara
echo Number::withLocale('en', fn() => Number::format(1000.5)); // 1,000.5

// 19. Set currency permanen
Number::useCurrency('USD');
echo Number::currency(1500); // $1,500.00

// 20. Gunakan currency sementara
echo Number::withCurrency('EUR', fn() => Number::currency(1500)); // €1,500.00
```

## **3. Paths Helpers**

| Helper            | Deskripsi             | Contoh                                   |
| ----------------- | --------------------- | ---------------------------------------- |
| `app_path()`      | Path folder app       | `app_path(); // /project/app`            |
| `base_path()`     | Path root project     | `base_path(); // /project`               |
| `config_path()`   | Path folder config    | `config_path(); // /project/config`      |
| `database_path()` | Path folder database  | `database_path(); // /project/database`  |
| `lang_path()`     | Path folder language  | `lang_path(); // /project/lang`          |
| `public_path()`   | Path folder public    | `public_path(); // /project/public`      |
| `resource_path()` | Path folder resources | `resource_path(); // /project/resources` |
| `storage_path()`  | Path folder storage   | `storage_path(); // /project/storage`    |

```php
// 1. Path folder 'app'
$appPath = app_path();
echo $appPath; // /project/app

// 2. Path root project
$basePath = base_path();
echo $basePath; // /project

// 3. Path folder 'config'
$configPath = config_path();
echo $configPath; // /project/config

// 4. Path folder 'database'
$databasePath = database_path();
echo $databasePath; // /project/database

// 5. Path folder 'lang' / bahasa
$langPath = lang_path();
echo $langPath; // /project/lang

// 6. Path folder 'public'
$publicPath = public_path();
echo $publicPath; // /project/public

// 7. Path folder 'resources'
$resourcePath = resource_path();
echo $resourcePath; // /project/resources

// 8. Path folder 'storage'
$storagePath = storage_path();
echo $storagePath; // /project/storage
```

## **4. URLs Helpers**

| Helper                                     | Deskripsi                        | Contoh                                        |
| ------------------------------------------ | -------------------------------- | --------------------------------------------- |
| `action($controllerAction, $params=[])`    | URL ke action controller         | `action([UserController::class,'index']);`    |
| `asset($path)`                             | URL asset                        | `asset('img/logo.png');`                      |
| `route($name, $params=[])`                 | URL route bernama                | `route('users.show',['user'=>1]);`            |
| `secure_asset($path)`                      | URL asset HTTPS                  | `secure_asset('img/logo.png');`               |
| `secure_url($path)`                        | URL HTTPS                        | `secure_url('/login');`                       |
| `to_action($controllerAction, $params=[])` | URL ke action controller (alias) | `to_action([UserController::class,'index']);` |
| `to_route($name, $params=[])`              | URL route bernama (alias)        | `to_route('users.show',['user'=>1]);`         |
| `uri($path=null)`                          | Ambil URI saat ini               | `uri(); // /dashboard`                        |
| `url($path)`                               | URL lengkap                      | `url('/home'); // https://example.com/home`   |

```php
use App\Http\Controllers\UserController;

// 1. URL ke action controller
$urlAction = action([UserController::class, 'index']);
echo $urlAction; // e.g., https://example.com/user

// 2. URL asset
$assetUrl = asset('img/logo.png');
echo $assetUrl; // e.g., https://example.com/img/logo.png

// 3. URL route bernama
$routeUrl = route('users.show', ['user' => 1]);
echo $routeUrl; // e.g., https://example.com/users/1

// 4. URL asset HTTPS
$secureAssetUrl = secure_asset('img/logo.png');
echo $secureAssetUrl; // e.g., https://example.com/img/logo.png

// 5. URL HTTPS
$secureUrl = secure_url('/login');
echo $secureUrl; // e.g., https://example.com/login

// 6. Alias ke action controller
$toAction = to_action([UserController::class, 'index']);
echo $toAction; // sama seperti action()

// 7. Alias ke route bernama
$toRoute = to_route('users.show', ['user' => 1]);
echo $toRoute; // sama seperti route()

// 8. Ambil URI saat ini
$currentUri = uri();
echo $currentUri; // e.g., /dashboard

// 9. URL lengkap
$fullUrl = url('/home');
echo $fullUrl; // e.g., https://example.com/home
```



## **5. Miscellaneous Helpers**

| Helper                                                         | Deskripsi                           | Contoh                                                           |
| -------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------- |
| `abort($code, $message=null)`                                  | Hentikan request dengan HTTP code   | `abort(404,'Not Found');`                                        |
| `abort_if($condition, $code)`                                  | Abort jika kondisi benar            | `abort_if(!$user,404);`                                          |
| `abort_unless($condition,$code)`                               | Abort jika kondisi salah            | `abort_unless($user,404);`                                       |
| `app()`                                                        | Ambil instance app                  | `app(); // Application instance`                                 |
| `auth()`                                                       | Ambil guard auth                    | `auth()->user();`                                                |
| `back()`                                                       | Redirect ke halaman sebelumnya      | `return back();`                                                 |
| `bcrypt($value)`                                               | Hash value dengan bcrypt            | `bcrypt('secret');`                                              |
| `blank($value)`                                                | Cek value kosong                    | `blank(''); // true`                                             |
| `broadcast()`                                                  | Broadcast event                     | `broadcast(new EventName());`                                    |
| `broadcast_if($condition)`                                     | Broadcast jika kondisi              | `broadcast_if(true, new EventName());`                           |
| `broadcast_unless($condition)`                                 | Broadcast kecuali kondisi           | `broadcast_unless(false, new EventName());`                      |
| `cache()`                                                      | Akses cache                         | `cache()->get('key');`                                           |
| `class_uses_recursive($class)`                                 | Ambil trait class                   | `class_uses_recursive(User::class);`                             |
| `collect($array)`                                              | Buat Collection                     | `collect([1,2,3])->sum(); // 6`                                  |
| `config($key, $default=null)`                                  | Ambil config                        | `config('app.name');`                                            |
| `context()`                                                    | Ambil context                       | `context();`                                                     |
| `cookie($name, $value=null, $minutes=null)`                    | Ambil/set cookie                    | `cookie('name','value',60);`                                     |
| `csrf_token()`                                                 | Ambil CSRF token                    | `csrf_token();`                                                  |
| `decrypt($value)`                                              | Decrypt value                       | `decrypt($encrypted);`                                           |
| `dd($values...)`                                               | Dump & die                          | `dd($data);`                                                     |
| `dispatch($job)`                                               | Dispatch job                        | `dispatch(new JobClass());`                                      |
| `dispatch_sync($job)`                                          | Dispatch job sync                   | `dispatch_sync(new JobClass());`                                 |
| `dump($values...)`                                             | Dump value                          | `dump($data);`                                                   |
| `encrypt($value)`                                              | Encrypt value                       | `encrypt('secret');`                                             | 
| `event($event, $payload=[])`                                   | Trigger event                       | `event(new EventName());`                                        |
| `fake($class=null)`                                            | Fake service (testing)              | `fake();`                                                        |
| `filled($value)`                                               | Cek value tidak kosong              | `filled('foo'); // true`                                         |
| `info($message)`                                               | Log info                            | `info('Message');`                                               |
| `literal($value)`                                              | Ambil literal                       | `literal('value');`                                              |
| `logger()`                                                     | Ambil logger                        | `logger()->info('Login');`                                       |
| `method_field($method)`                                        | Field form method                   | `method_field('PUT');`                                           |
| `now()`                                                        | Waktu saat ini (Carbon)             | `now();`                                                         |
| `old($key)`                                                    | Ambil input lama                    | `old('name');`                                                   |
| `once($callback)`                                              | Jalankan callback sekali            | `once(fn()=>doSomething());`                                     |
| `optional($value)`                                             | Safe call                           | `optional($user)->name;`                                         |
| `policy($ability, $arguments)`                                 | Policy helper                       | `policy(Post::class)->update($post);`                            |
| `redirect()`                                                   | Redirect response                   | `redirect()->route('home');`                                     |
| `report($exception)`                                           | Report exception                    | `report(new Exception());`                                       |
| `report_if($condition, $exception)`                            | Report jika kondisi                 | `report_if(true, new Exception());`                              |
| `report_unless($condition, $exception)`                        | Report kecuali kondisi              | `report_unless(false, new Exception());`                         |
| `request()`                                                    | Ambil request                       | `request()->input('name');`                                      |
| `rescue($callback, $rescue=null)`                              | Catch exception & return default    | `rescue(fn()=>doSomething(), 'default');`                        |
| `resolve($class)`                                              | Resolve instance dari container     | `resolve(User::class);`                                          |
| `response()`                                                   | Response helper                     | `response('OK',200);`                                            |
| `retry($times, $callback, $sleep=0)`                           | Retry eksekusi                      | `retry(3, fn()=>doSomething(), 100);`                            |
| `session($key=null, $value=null)`                              | Akses/set session                   | `session(['key'=>'value']);`                                     |
| `tap($value, $callback)`                                       | Jalankan callback & return value    | `tap($user, fn($u)=>$u->save());`                                |
| `throw_if($condition, $exception)`                             | Throw exception jika kondisi        | `throw_if(!$user, new Exception());`                             |
| `throw_unless($condition, $exception)`                         | Throw kecuali kondisi               | `throw_unless($user, new Exception());`                          |
| `today()`                                                      | Ambil tanggal hari ini              | `today();`                                                       |
| `trait_uses_recursive($class)`                                 | Ambil semua trait class             | `trait_uses_recursive(User::class);`                             |
| `transform($value, $callback)`                                 | Transform value                     | `transform(1, fn($v)=>$v*2); // 2`                               |
| `validator($data, $rules, $messages=[], $customAttributes=[])` | Validasi data                       | `validator($data, ['name'=>'required']);`                        |
| `value($value)`                                                | Ambil value atau jalankan callback  | `value(fn()=>1); // 1`                                           |
| `view($view, $data=[])`                                        | Return view                         | `view('welcome');`                                               |
| `with($value, $callback)`                                      | Chain callback                      | `with(1, fn($v)=>$v+1); // 2`                                    |
| `when($value, $callback, $default=null)`                       | Jalankan callback jika value truthy | `when(true, fn()=>1, 0); // 1`                                   |

```php
use Illuminate\Support\Facades\{Cache, Event, Log, Session, Validator};

// 1. Abort
// Hentikan request dengan HTTP code
abort(404, 'Not Found');

// 2. Conditional abort
abort_if(!$user, 404);
abort_unless($user, 404);

// 3. Ambil instance app
$app = app(); // Application instance

// 4. Auth
$currentUser = auth()->user();

// 5. Redirect back
return back();

// 6. Hash password
$hash = bcrypt('secret');

// 7. Cek kosong
$isBlank = blank(''); // true

// 8. Broadcast event
broadcast(new EventName());
broadcast_if(true, new EventName());
broadcast_unless(false, new EventName());

// 9. Cache
$value = cache()->get('key');

// 10. Trait class
$traits = class_uses_recursive(User::class);

// 11. Collection
$sum = collect([1,2,3])->sum(); // 6

// 12. Config
$appName = config('app.name');

// 13. Cookie
$cookie = cookie('name','value',60);

// 14. CSRF token
$token = csrf_token();

// 15. Encrypt/Decrypt
$encrypted = encrypt('secret');
$decrypted = decrypt($encrypted);

// 16. Dump & Die / Dump
dd($data);
dump($data);

// 17. Dispatch job
dispatch(new JobClass());
dispatch_sync(new JobClass());

// 18. Event helper
event(new EventName());

// 19. Fake service (testing)
fake();

// 20. Filled check
$filled = filled('foo'); // true

// 21. Logger / info
logger()->info('Login');
info('Message');

// 22. Form method field
echo method_field('PUT');

// 23. Carbon helpers
$now = now();
$today = today();

// 24. Old input
$oldValue = old('name');

// 25. Once
once(fn()=>doSomething());

// 26. Optional safe call
$name = optional($user)->name;

// 27. Policy
policy(Post::class)->update($post);

// 28. Redirect response
return redirect()->route('home');

// 29. Report exception
report(new Exception());
report_if(true, new Exception());
report_unless(false, new Exception());

// 30. Request
$input = request()->input('name');

// 31. Rescue
$result = rescue(fn()=>doSomething(), 'default');

// 32. Resolve instance
$userInstance = resolve(User::class);

// 33. Response helper
return response('OK', 200);

// 34. Retry
retry(3, fn()=>doSomething(), 100);

// 35. Session
session(['key'=>'value']);
$value = session('key');

// 36. Tap
tap($user, fn($u)=>$u->save());

// 37. Throw exceptions conditionally
throw_if(!$user, new Exception());
throw_unless($user, new Exception());

// 38. Transform
$newValue = transform(1, fn($v)=>$v*2); // 2

// 39. Validator
$validator = validator($data, ['name'=>'required']);
if ($validator->fails()) {
    $errors = $validator->errors();
}

// 40. Value / with / when
$value = value(fn()=>1); // 1
$result = with(1, fn($v)=>$v+1); // 2
$output = when(true, fn()=>1, 0); // 1

// 41. Return view
return view('welcome');
```

## **6. Other Utilities**

| Helper/Method                                        | Deskripsi Singkat                                                          | Contoh                                                                                 |
| :--------------------------------------------------- | :------------------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| `Benchmark::dd($callback, iterations: 1)`            | Mengukur durasi eksekusi callback dan menampilkan hasil di browser/console | `Benchmark::dd(fn()=>User::find(1)); // 0.1 ms`                                        |
| `Benchmark::value($callback)`                        | Mengembalikan nilai callback dan durasi eksekusi                           | `[$count, $duration] = Benchmark::value(fn()=>User::count());`                         |
| `now()`                                              | Membuat instance Carbon dari waktu sekarang                                | `$now = now();`                                                                        |
| `Carbon::now()`                                      | Membuat instance Carbon sekarang menggunakan class Carbon                  | `use Illuminate\Support\Carbon; $now = Carbon::now();`                                 |
| `defer(fn())`                                        | Menunda eksekusi closure hingga HTTP response selesai                      | `defer(fn()=>Metrics::reportOrder($order));`                                           |
| `defer()->always()`                                  | Menjalankan deferred function selalu, meski terjadi error 4xx/5xx          | `defer(fn()=>Metrics::reportOrder($order))->always();`                                 |
| `defer()->forget('name')`                            | Membatalkan deferred function                                              | `defer(fn()=>Metrics::report(), 'reportMetrics'); defer()->forget('reportMetrics');`   |
| `Lottery::odds($win, $total)`                        | Menentukan peluang eksekusi callback                                       | `Lottery::odds(1,20)->winner(fn()=> $user->won())->choose();`                          |
| `Lottery::alwaysWin()`                               | Memaksa lotere selalu menang (untuk testing)                               | `Lottery::alwaysWin();`                                                                |
| `Lottery::alwaysLose()`                              | Memaksa lotere selalu kalah (untuk testing)                                | `Lottery::alwaysLose();`                                                               |
| `Pipeline::send($input)->through([...])->then(fn())` | Menjalankan input melalui serangkaian callable atau invokable class        | `$user = Pipeline::send($user)->through([GenerateProfilePhoto::class])->thenReturn();` |
| `Pipeline::withinTransaction()`                      | Membungkus pipeline dalam satu transaksi DB                                | `$user = Pipeline::send($user)->withinTransaction()->through([...])->thenReturn();`    |
| `Sleep::for($n)->seconds()`                          | Menunda eksekusi selama \$n detik                                          | `Sleep::for(2)->seconds();`                                                            |
| `Sleep::fake()`                                      | Memalsukan delay untuk testing                                             | `Sleep::fake();`                                                                       |
| `Sleep::assertSequence([...])`                       | Mengecek urutan sleep yang terjadi                                         | `Sleep::assertSequence([Sleep::for(1)->second()]);`                                    |
| `Timebox->call(fn(), microseconds)`                  | Memastikan callback berjalan minimal waktu tertentu                        | `(new Timebox)->call(fn() => ..., microseconds: 10000);`                               |
| `Uri::of($url)`                                      | Membuat instance URI dari string                                           | `$uri = Uri::of('https://example.com');`                                               |
| `Uri::to($path)`                                     | Membuat URI ke path tertentu                                               | `$uri = Uri::to('/dashboard');`                                                        |
| `Uri::route($name, $params)`                         | Membuat URI ke named route                                                 | `$uri = Uri::route('users.show', ['user'=>1]);`                                        |
| `Uri->withQuery([...])`                              | Menambahkan query string ke URI                                            | `$uri = $uri->withQuery(['page'=>2]);`                                                 |
| `Uri->replaceQuery([...])`                           | Mengganti query string sepenuhnya                                          | `$uri = $uri->replaceQuery(['page'=>1]);`                                              |
| `Uri->withoutQuery([...])`                           | Menghapus query string tertentu                                            | `$uri = $uri->withoutQuery(['page']);`                                                 |
| `Uri->redirect()`                                    | Mengembalikan redirect response ke URI                                     | `return $uri->redirect();`                                                             |

```php
use Illuminate\Support\Carbon;

// 1. Benchmark
// Tampilkan durasi eksekusi langsung
Benchmark::dd(fn()=>User::find(1));

// Ambil nilai callback dan durasi
[$count, $duration] = Benchmark::value(fn()=>User::count());

// 2. Carbon / waktu sekarang
$now = now();
$nowCarbon = Carbon::now();

// 3. Defer execution
defer(fn()=>Metrics::reportOrder($order));
defer(fn()=>Metrics::reportOrder($order))->always();

// Batalkan deferred function
defer(fn()=>Metrics::report(), 'reportMetrics');
defer()->forget('reportMetrics');

// 4. Lottery (testing)
Lottery::odds(1, 20)->winner(fn()=> $user->won())->choose();
Lottery::alwaysWin();
Lottery::alwaysLose();

// 5. Pipeline
$user = Pipeline::send($user)
    ->through([GenerateProfilePhoto::class])
    ->thenReturn();

// Pipeline dalam transaksi DB
$user = Pipeline::send($user)
    ->withinTransaction()
    ->through([GenerateProfilePhoto::class])
    ->thenReturn();

// 6. Sleep
Sleep::for(2)->seconds();
Sleep::fake();
Sleep::assertSequence([Sleep::for(1)->second()]);

// 7. Timebox
(new Timebox)->call(fn()=> doSomething(), microseconds: 10000);

// 8. URI helpers
$uri = Uri::of('https://example.com');
$uri = Uri::to('/dashboard');
$uri = Uri::route('users.show', ['user'=>1]);

$uri = $uri->withQuery(['page'=>2]);
$uri = $uri->replaceQuery(['page'=>1]);
$uri = $uri->withoutQuery(['page']);

// Redirect ke URI
return $uri->redirect();
```


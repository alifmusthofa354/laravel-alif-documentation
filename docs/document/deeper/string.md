# **Laravel String Cheatsheet**

### **1. Case Conversion (Mengubah Format String)**

| Method           | Deskripsi               | Contoh                                      |
| ---------------- | ----------------------- | ------------------------------------------- |
| `Str::camel()`   | Convert ke camelCase    | `Str::camel('hello_world')` → `helloWorld`  |
| `Str::studly()`  | Convert ke StudlyCase   | `Str::studly('hello_world')` → `HelloWorld` |
| `Str::snake()`   | Convert ke snake\_case  | `Str::snake('HelloWorld')` → `hello_world`  |
| `Str::kebab()`   | Convert ke kebab-case   | `Str::kebab('Hello World')` → `hello-world` |
| `Str::title()`   | Convert ke Title Case   | `Str::title('hello world')` → `Hello World` |
| `Str::upper()`   | Semua huruf uppercase   | `Str::upper('hello')` → `HELLO`             |
| `Str::lower()`   | Semua huruf lowercase   | `Str::lower('HELLO')` → `hello`             |
| `Str::ucfirst()` | Huruf pertama uppercase | `Str::ucfirst('hello')` → `Hello`           |


```php
use Illuminate\Support\Str;

echo Str::camel('hello_world');   // helloWorld
echo Str::studly('hello_world');  // HelloWorld
echo Str::snake('HelloWorld');    // hello_world
echo Str::kebab('Hello World');   // hello-world
echo Str::title('hello world');   // Hello World
echo Str::upper('hello');         // HELLO
echo Str::lower('HELLO');         // hello
echo Str::ucfirst('hello');       // Hello
```
---

### **2. Substring & Trimming**

| Method                               | Deskripsi                 | Contoh                                               |
| ------------------------------------ | ------------------------- | ---------------------------------------------------- |
| `Str::substr($str, $start, $length)` | Ambil substring           | `Str::substr('Hello World', 0, 5)` → `Hello`         |
| `Str::before($str, $search)`         | Ambil sebelum substring   | `Str::before('Hello World', ' World')` → `Hello`     |
| `Str::after($str, $search)`          | Ambil setelah substring   | `Str::after('Hello World', 'Hello ')` → `World`      |
| `Str::between($str, $start, $end)`   | Ambil di antara 2 string  | `Str::between('Hello [World]!', '[', ']')` → `World` |
| `Str::trim()`                        | Hapus spasi di kedua sisi | `Str::trim('  hello  ')` → `hello`                   |
| `Str::ltrim()`                       | Hapus spasi di kiri       | `Str::ltrim('  hello')` → `hello`                    |
| `Str::rtrim()`                       | Hapus spasi di kanan      | `Str::rtrim('hello  ')` → `hello`                    |

```php
use Illuminate\Support\Str;

echo Str::substr('Hello World', 0, 5);       // Hello
echo Str::before('Hello World', ' World');   // Hello
echo Str::after('Hello World', 'Hello ');    // World
echo Str::between('Hello [World]!', '[', ']'); // World
echo Str::trim('  hello  ');                 // hello
echo Str::ltrim('  hello');                  // hello
echo Str::rtrim('hello  ');                  // hello
```
---

### **3. Checking & Searching**

| Method                                | Deskripsi               | Contoh                                            |
| ------------------------------------- | ----------------------- | ------------------------------------------------- |
| `Str::contains($str, $needle)`        | Cek substring ada       | `Str::contains('Hello', 'He')` → `true`           |
| `Str::containsAll($str, ['He','lo'])` | Semua substring ada     | `Str::containsAll('Hello', ['He','lo'])` → `true` |
| `Str::doesntContain($str, $needle)`   | Cek substring tidak ada | `Str::doesntContain('Hello', 'Hi')` → `true`      |
| `Str::startsWith($str, $prefix)`      | Cek diawali             | `Str::startsWith('Hello', 'He')` → `true`         |
| `Str::endsWith($str, $suffix)`        | Cek diakhiri            | `Str::endsWith('Hello', 'lo')` → `true`           |

```php
use Illuminate\Support\Str;

var_dump(Str::contains('Hello', 'He'));           // true
var_dump(Str::containsAll('Hello', ['He','lo'])); // true
var_dump(Str::doesntContain('Hello', 'Hi'));      // true
var_dump(Str::startsWith('Hello', 'He'));         // true
var_dump(Str::endsWith('Hello', 'lo'));           // true
```
---

### **4. Manipulation & Replacement**

| Method                                       | Deskripsi                | Contoh                                                               |
| -------------------------------------------- | ------------------------ | -------------------------------------------------------------------- |
| `Str::replace($search, $replace, $str)`      | Replace semua            | `Str::replace('world','PHP','Hello world')` → `Hello PHP`            |
| `Str::replaceFirst($search, $replace, $str)` | Replace pertama          | `Str::replaceFirst('l','L','Hello')` → `HeLlo`                       |
| `Str::replaceLast($search, $replace, $str)`  | Replace terakhir         | `Str::replaceLast('l','L','Hello')` → `HellO`                        |
| `Str::remove($search, $str)`                 | Hapus substring          | `Str::remove('l','Hello')` → `Heo`                                   |
| `Str::swap(['Hello'=>'Hi'], 'Hello World')`  | Replace banyak sekaligus | `Str::swap(['Hello'=>'Hi','World'=>'PHP'],'Hello World')` → `Hi PHP` |
| `Str::repeat($str, $times)`                  | Repeat string            | `Str::repeat('Ha',3)` → `HaHaHa`                                     |

```php
use Illuminate\Support\Str;

echo Str::replace('world','PHP','Hello world');  // Hello PHP
echo Str::replaceFirst('l','L','Hello');         // HeLlo
echo Str::replaceLast('l','L','Hello');          // HelLo
echo Str::remove('l','Hello');                   // Heo
echo Str::swap(['Hello'=>'Hi','World'=>'PHP'],'Hello World'); // Hi PHP
echo Str::repeat('Ha',3);                        // HaHaHa
```
---

### **5. Helpers & Utilities**

| Method                       | Deskripsi              | Contoh                                                        |
| ---------------------------- | ---------------------- | ------------------------------------------------------------- |
| `Str::limit($str, $limit)`   | Batasi panjang string  | `Str::limit('Hello World',5)` → `Hello...`                    |
| `Str::words($str, $count)`   | Ambil beberapa kata    | `Str::words('Hello World from Laravel',2)` → `Hello World...` |
| `Str::slug($str)`            | Buat slug URL-friendly | `Str::slug('Hello World')` → `hello-world`                    |
| `Str::random($length)`       | String random          | `Str::random(8)` → `a1B2c3D4`                                 |
| `Str::classBasename($class)` | Nama kelas dari FQCN   | `Str::classBasename(App\Models\User::class)` → `User`         |
| `Str::fromBase64($str)`      | Decode Base64          | `Str::fromBase64('SGVsbG8=')` → `Hello`                       |
| `Str::toBase64($str)`        | Encode Base64          | `Str::toBase64('Hello')` → `SGVsbG8=`                         |

```php
use Illuminate\Support\Str;

echo Str::limit('Hello World',5);                // Hello...
echo Str::words('Hello World from Laravel',2);   // Hello World...
echo Str::slug('Hello World');                   // hello-world
echo Str::random(8);                             // random string, e.g. a1B2c3D4
echo Str::classBasename(App\Models\User::class);// User
echo Str::fromBase64('SGVsbG8=');               // Hello
echo Str::toBase64('Hello');                    // SGVsbG8=
```
---

### **6. Fluent Strings Example**

```php
use Illuminate\Support\Str;

$result = Str::of('hello world')
    ->title()         // Hello World
    ->replace('World','PHP') // Hello PHP
    ->append('!')     // Hello PHP!
    ->upper();        // HELLO PHP!

echo $result; // Output: HELLO PHP!
```

* Fluent strings memudahkan **method chaining** tanpa membuat banyak variabel.
* Hampir semua metode `Str::` bisa digunakan sebagai fluent method.

---


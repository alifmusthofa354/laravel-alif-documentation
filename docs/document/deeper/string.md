# 🔡 String di Laravel: Panduan Lengkap dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Hari ini kita akan belajar tentang **Laravel String Helpers** - sekumpulan metode canggih yang siap membantu kamu mengolah string dengan mudah dan cepat, seperti seorang master yang ahli dalam seni manipulasi teks.

Bayangkan kamu sedang menjadi seorang tukang bubur ayam yang ahli. Dulu kamu harus memotong dan menata bubur satu per satu secara manual, tapi sekarang kamu punya alat canggih yang bisa mengubah, memotong, memperbaiki, dan menghias bubur dalam sekejap. **String Helpers** adalah alat canggih itu untuk kamu yang ingin mengolah teks dalam aplikasimu!

Siap menjadi master manipulasi string Laravel? Ayo kita mulai petualangan ini bersama-sama!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih String Helpers Itu Sebenarnya?

**Analogi:** Bayangkan kamu sedang menjadi seorang editor di penerbit buku. Kamu punya kotak peralatan ajaib yang bisa mengubah format judul dari `judul_buku` menjadi `JudulBuku`, `judul-buku`, atau `Judul Buku` hanya dengan satu klik. Itulah kekuatan String Helpers!

**Mengapa ini penting?** Karena dalam pengembangan aplikasi web, kamu sering kali harus mengolah string: mengubah format, memeriksa isinya, memotong bagian tertentu, atau membuat URL-friendly slug. Tanpa String Helpers, kamu harus menulis banyak kode manual yang kompleks.

**Bagaimana cara kerjanya?** Laravel menyediakan kelas `Str` dengan berbagai method siap pakai yang bisa kamu gunakan untuk mengolah string dengan sangat mudah dan efisien.

`➡️ Input String Mentah -> 🧰 String Helper -> ✅ Output Terolah`

Tanpa String Helpers, kamu mungkin harus menggunakan fungsi PHP built-in yang rumit atau menulis kode sendiri yang rawan error. 😵

### 2. ✍️ Resep Pertamamu: Menggunakan String Helpers

Mari kita buat contoh sederhana tentang bagaimana menggunakan beberapa String Helper paling dasar, langkah demi langkah.

#### Langkah 1️⃣: Import dan Gunakan Str Class
**Mengapa?** Karena untuk menggunakan String Helpers, kamu perlu mengimpor kelas Str terlebih dahulu.

**Bagaimana?**
```php
use Illuminate\Support\Str;

// Gunakan method static
$result = Str::upper('hello');
echo $result; // Output: HELLO
```
**Penjelasan Kode:**
- `use Illuminate\Support\Str;` - import kelas Str
- `Str::upper()` - method static yang mengubah string ke huruf kapital

#### Langkah 2️⃣: Contoh Penggunaan Dasar
**Mengapa?** Karena kamu perlu tahu bagaimana menggabungkan beberapa method dasar.

**Bagaimana?**
```php
use Illuminate\Support\Str;

$input = "hello_world_laravel";

// Ubah ke format camelCase
$camelCase = Str::camel($input);
echo $camelCase; // Output: helloWorldLaravel

// Ubah ke format snake_case
$snakeCase = Str::snake($camelCase);
echo $snakeCase; // Output: hello_world_laravel

// Ubah ke format Title Case
$titleCase = Str::title($input);
echo $titleCase; // Output: Hello World Laravel
```

#### Langkah 3️⃣: Cek dan Manipulasi String
**Mengapa?** Karena kamu sering perlu memeriksa kondisi atau mengubah bagian tertentu dari string.

**Bagaimana?**
```php
use Illuminate\Support\Str;

$email = "user@example.com";

// Cek apakah string berakhiran dengan domain tertentu
if (Str::endsWith($email, '@example.com')) {
    echo "Email valid dari domain example.com";
} else {
    echo "Email tidak valid";
}

// Ambil bagian setelah @
$username = Str::after($email, '@');
echo $username; // Output: example.com (ini contoh salah)
$username = Str::before($email, '@');
echo $username; // Output: user (ini yang benar)

// Ambil bagian sebelum @
$domain = Str::after($email, '@');
echo $domain; // Output: example.com
```

Selesai! 🎉 Sekarang kamu sudah tahu cara menggunakan beberapa String Helper dasar!

### 3. ⚡ Dua Pendekatan String Manipulation

**Analogi:** Seperti memiliki dua cara memasak: kamu bisa menggunakan metode tradisional (memanggil method langsung), atau menggunakan metode modern dengan alat bantu (Fluent String).

**Mengapa ada dua pendekatan?** Karena masing-masing punya kelebihan tergantung situasi dan preferensi kode kamu.

1. **Method Static**: `Str::camel('hello_world')`
2. **Fluent String**: `Str::of('hello_world')->camel()->title()`

**Contoh Perbandingan:**
```php
use Illuminate\Support\Str;

// Static method (pendekatan tradisional)
$result1 = Str::upper(Str::camel('hello_world'));

// Fluent method (pendekatan chaining)
$result2 = Str::of('hello_world')->camel()->upper();

// Keduanya menghasilkan: 'HELLOWORLD'
```

---

## Bagian 2: Jurus Tingkat Menengah - Konversi Format 🚀

### 4. 🔄 Case Conversion - Transformasi Format

**Analogi:** Seperti memiliki mesin transformasi yang bisa mengubah bentuk robot: dari mode biasa (`hello_world`) menjadi mode tempur (`helloWorld`), mode jet (`HelloWorld`), atau mode ramah (`Hello World`).

**Mengapa ini keren?** Karena format string yang benar sangat penting dalam pengembangan aplikasi: untuk nama variabel, nama kelas, URL, atau tampilan bagi pengguna.

**Contoh Lengkap:**

**Camel Case - Format untuk Variabel dan Method:**
```php
use Illuminate\Support\Str;

// Dari snake_case ke camelCase
$camel = Str::camel('user_profile_settings');
echo $camel; // Output: userProfileSettings

// Dari kebab-case ke camelCase
$camel = Str::camel('user-profile-settings');
echo $camel; // Output: userProfileSettings

// Dari Title Case ke camelCase
$camel = Str::camel('User Profile Settings');
echo $camel; // Output: userProfileSettings
```

**Studly Case - Format untuk Nama Kelas:**
```php
use Illuminate\Support\Str;

// Dari snake_case ke StudlyCase
$studly = Str::studly('user_profile');
echo $studly; // Output: UserProfile

// Dari kebab-case ke StudlyCase
$studly = Str::studly('user-profile');
echo $studly; // Output: UserProfile

// Umum digunakan untuk nama kelas
$className = Str::studly('payment_gateway');
echo $className; // Output: PaymentGateway
```

**Snake Case - Format untuk Database dan Konfigurasi:**
```php
use Illuminate\Support\Str;

// Dari camelCase ke snake_case
$snake = Str::snake('userProfileSettings');
echo $snake; // Output: user_profile_settings

// Dari StudlyCase ke snake_case
$snake = Str::snake('UserProfileSettings');
echo $snake; // Output: user_profile_settings

// Dari Title Case ke snake_case
$snake = Str::snake('User Profile Settings');
echo $snake; // Output: user_profile_settings

// Dengan custom delimiter
$snake = Str::snake('UserProfileSettings', '-');
echo $snake; // Output: user-profile-settings
```

**Kebab Case - Format untuk URL dan CSS:**
```php
use Illuminate\Support\Str;

// Dari camelCase ke kebab-case
$kebab = Str::kebab('userProfileSettings');
echo $kebab; // Output: user-profile-settings

// Dari StudlyCase ke kebab-case
$kebab = Str::kebab('UserProfileSettings');
echo $kebab; // Output: user-profile-settings

// Umum digunakan untuk URL slug
$routeName = Str::kebab('My Blog Post Title');
echo $routeName; // Output: my-blog-post-title
```

**Title Case - Format untuk Tampilan:**
```php
use Illuminate\Support\Str;

// Dari snake_case ke Title Case
$title = Str::title('user_profile_settings');
echo $title; // Output: User Profile Settings

// Dari kebab-case ke Title Case
$title = Str::title('user-profile-settings');
echo $title; // Output: User Profile Settings

// Umum digunakan untuk judul
$displayTitle = Str::title('welcome_message');
echo $displayTitle; // Output: Welcome Message
```

### 5. 📐 Upper, Lower, dan First Letter Case

**Mengapa?** Karena terkadang kamu perlu mengubah format huruf untuk keperluan tampilan atau validasi.

**Contoh Lengkap:**
```php
use Illuminate\Support\Str;

$text = 'laravel String Manipulation';

// Semua huruf kapital
$upper = Str::upper($text);
echo $upper; // Output: LARAVEL STRING MANIPULATION

// Semua huruf kecil
$lower = Str::lower($text);
echo $lower; // Output: laravel string manipulation

// Huruf pertama kapital
$ucfirst = Str::ucfirst($text);
echo $ucfirst; // Output: Laravel string manipulation

// Kalimat seperti judul
$ucfirstWord = Str::title($text);
echo $ucfirstWord; // Output: Laravel String Manipulation
```

### 6. 🧹 Substring & Trimming - Pemotongan String

**Analogi:** Seperti memiliki pisau laser yang bisa memotong bagian tertentu dari string, atau kain yang bisa kamu lipat dan rapihkan dari kedua sisi.

**Mengapa ini penting?** Karena kamu sering perlu mengambil bagian tertentu dari string atau membersihkan whitespace.

**Contoh Lengkap:**

**Pengambilan Substring:**
```php
use Illuminate\Support\Str;

$text = 'Hello World from Laravel';

// Ambil substring dengan panjang tertentu
$part = Str::substr($text, 0, 5); // Mulai dari posisi 0, ambil 5 karakter
echo $part; // Output: Hello

$part = Str::substr($text, 6, 5); // Mulai dari posisi 6, ambil 5 karakter
echo $part; // Output: World

$part = Str::substr($text, -7); // Ambil 7 karakter dari belakang
echo $part; // Output: Laravel
```

**Ambil Bagian Sebelum/Asetelah Pattern:**
```php
use Illuminate\Support\Str;

$email = 'user@laravel.com';
$fullName = 'John Doe Laravel Expert';
$wrappedText = '[[Hello Laravel]]';

// Ambil sebelum pattern
$before = Str::before($email, '@');
echo $before; // Output: user

// Ambil setelah pattern
$after = Str::after($email, '@');
echo $after; // Output: laravel.com

// Ambil di antara dua pattern
$between = Str::between($wrappedText, '[[', ']]');
echo $between; // Output: Hello Laravel

// Ambil nama depan dari nama lengkap
$firstName = Str::before($fullName, ' ');
echo $firstName; // Output: John

// Ambil bagian setelah nama depan
$lastName = Str::after($fullName, 'John ');
echo $lastName; // Output: Doe Laravel Expert
```

**Pembersihan Whitespace:**
```php
use Illuminate\Support\Str;

$text = '  Hello World  ';

// Hapus dari kedua sisi
$trimmed = Str::trim($text);
echo $trimmed; // Output: Hello World (tanpa spasi)

// Hapus dari kiri
$ltrimmed = Str::ltrim($text);
echo $ltrimmed; // Output: 'Hello World  ' (spasi kanan tetap ada)

// Hapus dari kanan
$rtrimmed = Str::rtrim($text);
echo $rtrimmed; // Output: '  Hello World' (spasi kiri tetap ada)
```

---

## Bagian 3: Jurus Tingkat Lanjut - Pencarian dan Manipulasi 🚀

### 7. 🔍 Pencarian dan Cek String

**Analogi:** Seperti memiliki detektif cerdas yang bisa mencari keberadaan kata kunci dalam sebuah dokumen, atau bahkan mengecek apakah dokumen tersebut diawali atau diakhiri dengan kata tertentu.

**Mengapa ini penting?** Karena kamu sering perlu memvalidasi input atau mencari pola tertentu dalam string sebelum memprosesnya lebih lanjut.

**Contoh Lengkap:**

**Cek Keberadaan Substring:**
```php
use Illuminate\Support\Str;

$text = 'Laravel is a PHP framework';

// Cek apakah string mengandung substring
$hasLaravel = Str::contains($text, 'Laravel');
var_dump($hasLaravel); // Output: bool(true)

$hasPython = Str::contains($text, 'Python');
var_dump($hasPython); // Output: bool(false)

// Cek keberadaan banyak substring sekaligus
$hasMultiple = Str::containsAll($text, ['Laravel', 'PHP']);
var_dump($hasMultiple); // Output: bool(true)

// Cek substring tidak ditemukan
$notFound = Str::doesntContain($text, 'Ruby');
var_dump($notFound); // Output: bool(true)
```

**Cek Awalan dan Akhiran:**
```php
use Illuminate\Support\Str;

$url = 'https://laravel.com/docs';
$email = 'user@example.com';
$filename = 'document.pdf';

// Cek awalan
$isHttps = Str::startsWith($url, 'https://');
var_dump($isHttps); // Output: bool(true)

$isUser = Str::startsWith($email, 'user');
var_dump($isUser); // Output: bool(true)

// Cek akhiran
$isPdf = Str::endsWith($filename, '.pdf');
var_dump($isPdf); // Output: bool(true)

$isCom = Str::endsWith($url, '.com');
var_dump($isCom); // Output: bool(true)

// Cek banyak awalan/akhiran
$hasProtocol = Str::startsWith($url, ['http://', 'https://']);
var_dump($hasProtocol); // Output: bool(true)
```

### 8. 🔄 Manipulasi dan Penggantian String

**Analogi:** Seperti memiliki pensil ajaib yang bisa mengganti kata-kata dalam dokumen dengan cepat dan akurat, bahkan bisa mengganti hanya yang pertama, terakhir, atau semua sekaligus.

**Mengapa ini penting?** Karena kamu sering perlu membersihkan, mengganti, atau memformat string sebelum menampilkannya atau menyimpannya.

**Contoh Lengkap:**

**Replace Semua:**
```php
use Illuminate\Support\Str;

$text = 'Hello world, world is beautiful';

// Ganti semua kemunculan
$replaced = Str::replace('world', 'Laravel', $text);
echo $replaced; // Output: Hello Laravel, Laravel is beautiful

// Ganti dengan case-insensitive
$text = 'Hello WORLD, world is beautiful';
$replaced = Str::replace('world', 'Laravel', $text);
echo $replaced; // Output: Hello WORLD, Laravel is beautiful (hanya 'world' yang diubah)
```

**Replace Pertama dan Terakhir:**
```php
use Illuminate\Support\Str;

$text = 'Hello world, hello world, hello again';

// Ganti hanya kemunculan pertama
$first = Str::replaceFirst('hello', 'Hi', $text);
echo $first; // Output: Hi world, hello world, hello again

// Ganti hanya kemunculan terakhir
$last = Str::replaceLast('hello', 'Hey', $text);
echo $last; // Output: Hello world, hello world, Hey again

// Ganti hanya huruf 'l' pertama
$text = 'hello';
$firstL = Str::replaceFirst('l', 'L', $text);
echo $firstL; // Output: heLlo

// Ganti hanya huruf 'l' terakhir
$lastL = Str::replaceLast('l', 'L', $text);
echo $lastL; // Output: helo (diubah jadi 'heLo')
```

**Remove (Penghapusan):**
```php
use Illuminate\Support\Str;

$text = 'Hello world';

// Hapus substring tertentu
$removed = Str::remove('world', $text);
echo $removed; // Output: Hello 

// Hapus beberapa substring sekaligus
$text = 'Hello world and universe';
$removed = Str::remove(['world', 'universe'], $text);
echo $removed; // Output: Hello  and 

// Remove dengan case-insensitive
$text = 'Hello World';
$removed = Str::remove('world', $text, false); // false untuk case-insensitive
echo $removed; // Output: Hello 
```

**Swap (Replace Banyak Sekaligus):**
```php
use Illuminate\Support\Str;

$text = 'Hello World from Laravel';

// Ganti banyak string sekaligus
$swapped = Str::swap([
    'Hello' => 'Hi',
    'World' => 'PHP',
    'Laravel' => 'Framework'
], $text);

echo $swapped; // Output: Hi PHP from Framework

// Berguna untuk template sederhana
$template = 'Welcome {name}, you have {count} messages';
$processed = Str::swap([
    '{name}' => 'Budi',
    '{count}' => '5'
], $template);

echo $processed; // Output: Welcome Budi, you have 5 messages
```

### 9. 🎨 Pengulangan dan Pembatasan String

**Mengapa?** Karena terkadang kamu perlu mengulang string atau membatasi panjangnya untuk keperluan tampilan.

**Contoh:**
```php
use Illuminate\Support\Str;

// Pengulangan string
$repeated = Str::repeat('Ha', 3);
echo $repeated; // Output: HaHaHa

$stars = Str::repeat('*', 5);
echo $stars; // Output: *****

// Pembatasan panjang
$longText = 'This is a very long text that needs to be limited';
$limited = Str::limit($longText, 15);
echo $limited; // Output: This is a very...

$limitedWithCustomEnd = Str::limit($longText, 15, ' [more]');
echo $limitedWithCustomEnd; // Output: This is a very [more]

// Ambil beberapa kata
$text = 'Hello world from Laravel string helpers';
$words = Str::words($text, 4);
echo $words; // Output: Hello world from Laravel...

$wordsWithCustomEnd = Str::words($text, 3, ' [read more]');
echo $wordsWithCustomEnd; // Output: Hello world from [read more]
```

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' String 🧰

### 10. 🏷️ Slug dan URL-Friendly String

**Analogi:** Seperti memiliki mesin yang bisa mengubah judul artikel yang panjang dan kompleks menjadi URL yang cantik dan SEO-friendly.

**Mengapa ini penting?** Karena URL yang bersih sangat penting untuk SEO dan pengalaman pengguna.

**Contoh Lengkap:**
```php
use Illuminate\Support\Str;

// Buat slug dari judul
$title = 'Laravel 10: The Ultimate Guide for Beginners';
$slug = Str::slug($title);
echo $slug; // Output: laravel-10-the-ultimate-guide-for-beginners

// Slug dengan custom separator
$slug = Str::slug($title, '_');
echo $slug; // Output: laravel_10_the_ultimate_guide_for_beginners

// Slug dari teks non-English
$chineseTitle = 'Laravel 框架 指南';
$slug = Str::slug($chineseTitle);
echo $slug; // Output: laravel-kuang-jia-zhi-nan

// Slug untuk route parameter
$productName = 'iPhone 14 Pro Max';
$routeSlug = Str::slug($productName);
echo $routeSlug; // Output: iphone-14-pro-max
// Route: /products/iphone-14-pro-max
```

### 11. 🔐 Base64 Encoding/Decoding

**Analogi:** Seperti memiliki kotak kunci ajaib yang bisa mengubah teks biasa menjadi kode rahasia, dan juga bisa membuka kodenya kembali.

**Mengapa ini penting?** Karena sering digunakan untuk encode binary data ke format yang aman untuk transportasi.

**Contoh:**
```php
use Illuminate\Support\Str;

// Encode ke Base64
$original = 'Hello Laravel';
$encoded = Str::toBase64($original);
echo $encoded; // Output: SGVsbG8gTGFyYXZlbA==

// Decode dari Base64
$decoded = Str::fromBase64($encoded);
echo $decoded; // Output: Hello Laravel

// Berguna untuk URL parameter
$data = json_encode(['user' => 1, 'action' => 'view']);
$encodedData = Str::toBase64($data);
echo $encodedData; // URL-safe encoded data

// Decode kembali
$decodedData = Str::fromBase64($encodedData);
$originalData = json_decode($decodedData, true);
print_r($originalData); // ['user' => 1, 'action' => 'view']
```

### 12. 🎲 String Random dan Unik

**Analogi:** Seperti memiliki mesin pengacak yang bisa menghasilkan sandi atau token unik dalam sekejap.

**Mengapa ini penting?** Karena sering dibutuhkan untuk token keamanan, password sementara, atau ID unik.

**Contoh:**
```php
use Illuminate\Support\Str;

// String random dengan panjang tertentu
$random = Str::random(10);
echo $random; // Output: misalnya 'a1B2c3D4e5'

$shortToken = Str::random(6);
echo $shortToken; // Output: misalnya 'X9zY2p'

// Umum digunakan untuk token
$activationToken = Str::random(32);
$passwordResetToken = Str::random(64);

// Berguna untuk nama file unik
$uniqueFilename = Str::random(12) . '.jpg';
echo $uniqueFilename; // Output: misalnya 'a1B2c3D4e5f6.jpg'

// Atau untuk kunci API
$apiKey = Str::random(40);
echo $apiKey; // Output: string acak 40 karakter
```

### 13. 📚 Class Name Helpers

**Analogi:** Seperti memiliki alat yang bisa memisahkan nama lengkap dari alamat lengkap, tapi dalam konteks nama kelas PHP.

**Mengapa ini penting?** Karena sering digunakan dalam framework dan package development.

**Contoh:**
```php
use Illuminate\Support\Str;

// Dapatkan nama kelas dari Fully Qualified Class Name (FQCN)
$fqcn = App\Models\User::class;
$className = Str::classBasename($fqcn);
echo $className; // Output: User

$fqcn = App\Http\Controllers\HomeController::class;
$className = Str::classBasename($fqcn);
echo $className; // Output: HomeController

// Berguna dalam metaprogramming
function getClassName($object) {
    return Str::classBasename(get_class($object));
}

$user = new App\Models\User();
echo getClassName($user); // Output: User
```

---

## Bagian 5: Fluent String - Seni Chaining 🏆

### 14. 💫 Fluent String Method Chaining

**Analogi:** Seperti memiliki lini produksi string di mana setiap stasiun bisa mengolah string dan mengirimkannya langsung ke stasiun berikutnya tanpa harus menyimpan hasilnya di tempat lain.

**Mengapa ini keren?** Karena membuat kode menjadi lebih ekspresif dan mudah dibaca, seolah-olah kamu memberi perintah berurutan pada string tersebut.

**Contoh Lengkap:**

**Dasar Fluent String:**
```php
use Illuminate\Support\Str;

// Dibandingkan menggunakan method static berulang
$manual = Str::upper(
    Str::camel(
        Str::snake('hello world laravel')
    )
);
echo $manual; // Output: HELLOWORLDLARAVEL

// Dengan fluent string jauh lebih mudah dibaca
$fluent = Str::of('hello world laravel')
    ->snake()    // hello_world_laravel
    ->camel()    // helloWorldLaravel
    ->upper();   // HELLOWORLDLARAVEL

echo $fluent; // Output: HELLOWORLDLARAVEL
```

**Contoh Kompleks dengan Multiple Operations:**
```php
use Illuminate\Support\Str;

// Format nama untuk URL dan tampilan
$input = "  LARAVEL 10: The Ultimate Guide!  ";

// Dengan fluent string
$result = Str::of($input)
    ->trim()                    // "LARAVEL 10: The Ultimate Guide!"
    ->lower()                   // "laravel 10: the ultimate guide!"
    ->replace(':', '')          // "laravel 10 the ultimate guide!"
    ->replace('!', '')          // "laravel 10 the ultimate guide"
    ->slug();                   // "laravel-10-the-ultimate-guide"

echo $result; // Output: laravel-10-the-ultimate-guide

// Format untuk tampilan
$display = Str::of($input)
    ->trim()                    // "LARAVEL 10: The Ultimate Guide!"
    ->ucfirst()                 // "Laravel 10: The Ultimate Guide!"
    ->replace('laravel', 'Laravel'); // Karena sudah upper, ini tidak akan berubah

echo $display; // Output: LARAVEL 10: The Ultimate Guide!
```

**Method yang Tersedia di Fluent String:**
```php
use Illuminate\Support\Str;

$text = "  hello WORLD laravel  ";

$result = Str::of($text)
    ->trim()                   // hapus whitespace
    ->lower()                  // ke huruf kecil
    ->ucfirst()                // huruf pertama kapital
    ->replace('laravel', 'Laravel')  // ganti kata
    ->prepend('Welcome ')       // tambah di awal
    ->append(' Guide')          // tambah di akhir
    ->limit(20);                // batasi panjang

echo $result; // Output: Welcome Hello world lar...

// Cek kondisi dengan fluent
$hasLaravel = Str::of($text)
    ->contains('laravel')
    ->value(); // ambil nilai boolean

if (Str::of($text)->startsWith('  hello')->value()) {
    echo "String diawali dengan '  hello'";
}
```

### 15. 🧪 Testing dengan String Helpers

**Mengapa?** Karena kamu perlu memastikan bahwa manipulasi string berjalan sesuai harapan dalam berbagai skenario.

**Contoh Testing:**
```php
<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Support\Str;

class StringHelperTest extends TestCase
{
    public function test_camel_case_conversion()
    {
        $result = Str::camel('user_profile_settings');
        $this->assertEquals('userProfileSettings', $result);
    }

    public function test_slug_generation()
    {
        $title = 'Laravel 10: The Ultimate Guide';
        $slug = Str::slug($title);
        
        $this->assertEquals('laravel-10-the-ultimate-guide', $slug);
        $this->assertNotEquals('Laravel_10_The_Ultimate_Guide', $slug);
    }

    public function test_string_contains()
    {
        $text = 'Laravel is awesome';
        
        $this->assertTrue(Str::contains($text, 'Laravel'));
        $this->assertFalse(Str::contains($text, 'PHP'));
        $this->assertTrue(Str::startsWith($text, 'Laravel'));
        $this->assertTrue(Str::endsWith($text, 'awesome'));
    }

    public function test_fluent_string_chain()
    {
        $result = Str::of('hello world')
            ->upper()
            ->replace('WORLD', 'LARAVEL')
            ->prepend('Welcome ')
            ->value(); // Perlu value() untuk mendapatkan hasil akhir
            
        $this->assertEquals('Welcome HELLO LARAVEL', $result);
    }

    public function test_slug_uses_custom_separator()
    {
        $result = Str::slug('Hello World Test', '_');
        
        $this->assertEquals('hello_world_test', $result);
    }
}
```

---

## Bagian 6: Penguasaan Master String 🏆

### 16. ✨ Wejangan dari Guru

1.  **Pilih Metode yang Tepat**: Gunakan `Str::camel()` untuk nama variabel/method, `Str::studly()` untuk nama kelas, `Str::snake()` untuk database, dan `Str::kebab()` untuk URL.
2.  **Gunakan Fluent untuk Operasi Majemuk**: Jika kamu perlu melakukan banyak operasi pada satu string, gunakan `Str::of()` untuk kemudahan membaca.
3.  **String Manipulation adalah Alat Bantu**: Gunakan dengan bijak, jangan terlalu kompleks karena bisa mempengaruhi kinerja.
4.  **Gunakan Slug untuk URL**: Selalu gunakan `Str::slug()` untuk membuat URL-friendly string.
5.  **Perhatikan Case Sensitivity**: Beberapa method case-sensitive, perhatikan kebutuhan aplikasi kamu.
6.  **Gunakan Random untuk Security**: Gunakan `Str::random()` untuk token keamanan, bukan string yang dapat ditebak.

### 17. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur String Helpers di Laravel:

#### 🔄 Case Conversion
| Method | Fungsi | Contoh |
|--------|--------|--------|
| `Str::camel($str)` | ke camelCase | `Str::camel('hello_world')` → `helloWorld` |
| `Str::studly($str)` | ke StudlyCase | `Str::studly('hello_world')` → `HelloWorld` |
| `Str::snake($str)` | ke snake_case | `Str::snake('HelloWorld')` → `hello_world` |
| `Str::kebab($str)` | ke kebab-case | `Str::kebab('Hello World')` → `hello-world` |
| `Str::title($str)` | ke Title Case | `Str::title('hello world')` → `Hello World` |
| `Str::upper($str)` | ke UPPERCASE | `Str::upper('hello')` → `HELLO` |
| `Str::lower($str)` | ke lowercase | `Str::lower('HELLO')` → `hello` |
| `Str::ucfirst($str)` | huruf pertama kapital | `Str::ucfirst('hello')` → `Hello` |

#### 🔍 Pencarian dan Pengecekan
| Method | Fungsi | Contoh |
|--------|--------|--------|
| `Str::contains($str, $needle)` | cek substring | `Str::contains('Hello', 'He')` → `true` |
| `Str::containsAll($str, $needles)` | cek semua substring | `Str::containsAll('Hello', ['He','lo'])` → `true` |
| `Str::startsWith($str, $prefix)` | cek awalan | `Str::startsWith('Hello', 'He')` → `true` |
| `Str::endsWith($str, $suffix)` | cek akhiran | `Str::endsWith('Hello', 'lo')` → `true` |

#### 🧹 Pemotongan dan Pembersihan
| Method | Fungsi | Contoh |
|--------|--------|--------|
| `Str::substr($str, $start, $length)` | ambil substring | `Str::substr('Hello World', 0, 5)` → `Hello` |
| `Str::before($str, $search)` | ambil sebelum | `Str::before('Hello World', ' World')` → `Hello` |
| `Str::after($str, $search)` | ambil setelah | `Str::after('Hello World', 'Hello ')` → `World` |
| `Str::between($str, $start, $end)` | ambil di antara | `Str::between('Hello [World]!', '[', ']')` → `World` |
| `Str::trim($str)` | bersihkan spasi | `Str::trim('  hello  ')` → `hello` |

#### 🔄 Manipulasi dan Penggantian
| Method | Fungsi | Contoh |
|--------|--------|--------|
| `Str::replace($search, $replace, $str)` | ganti semua | `Str::replace('world','Laravel','Hello world')` → `Hello Laravel` |
| `Str::replaceFirst($search, $replace, $str)` | ganti pertama | `Str::replaceFirst('l','L','Hello')` → `HeLlo` |
| `Str::replaceLast($search, $replace, $str)` | ganti terakhir | `Str::replaceLast('l','L','Hello')` → `HelLo` |
| `Str::remove($search, $str)` | hapus substring | `Str::remove('l','Hello')` → `Heo` |
| `Str::swap($replace_pairs, $str)` | ganti banyak | `Str::swap(['Hello'=>'Hi'],'Hello World')` → `Hi World` |

#### 🛠️ Utility dan Lainnya
| Method | Fungsi | Contoh |
|--------|--------|--------|
| `Str::slug($str)` | buat URL slug | `Str::slug('Hello World')` → `hello-world` |
| `Str::limit($str, $limit)` | batasi panjang | `Str::limit('Hello World',5)` → `Hello...` |
| `Str::words($str, $count)` | ambil kata | `Str::words('Hello World',2)` → `Hello World...` |
| `Str::random($length)` | string acak | `Str::random(8)` → `a1B2c3D4` |
| `Str::toBase64($str)` | encode Base64 | `Str::toBase64('Hello')` → `SGVsbG8=` |
| `Str::fromBase64($str)` | decode Base64 | `Str::fromBase64('SGVsbG8=')` → `Hello` |

#### 💫 Fluent String Chaining
| Method | Fungsi |
|--------|--------|
| `Str::of($str)->...` | mulai fluent chain |
| `->camel()` | ubah ke camelCase |
| `->snake()` | ubah ke snake_case |
| `->upper()` | ubah ke UPPERCASE |
| `->replace()` | ganti string |
| `->append($str)` | tambah di akhir |
| `->prepend($str)` | tambah di awal |
| `->limit($n)` | batasi panjang |
| `->value()` | ambil hasil akhir |

### 18. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi String Helpers, dari yang paling dasar sampai yang paling rumit. Kamu hebat! String Helpers adalah alat yang sangat penting untuk membuat aplikasi Laravel kamu lebih bersih, terstruktur, dan mudah dipelihara.

Dengan memahami String Helpers, kamu bisa:
- Memformat string sesuai kebutuhan aplikasi
- Membuat URL-friendly slug untuk SEO
- Memeriksa dan memanipulasi string dengan mudah
- Menggunakan fluent method chaining untuk operasi kompleks
- Membuat kode yang lebih ekspresif dan mudah dibaca

Ingat, String Helpers adalah bagian penting dari toolkit seorang developer Laravel. Gunakan dengan bijak dan kreatif untuk membuat aplikasimu semakin canggih. Selamat ngoding, murid kesayanganku!


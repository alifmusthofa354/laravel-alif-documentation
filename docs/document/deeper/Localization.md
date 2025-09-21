# 🌍 Laravel Localization

## 📌 Pendahuluan

Secara default, struktur awal aplikasi Laravel **tidak menyertakan folder `lang`**.
Jika Anda ingin menyesuaikan file bahasa Laravel, Anda dapat mempublikasikannya menggunakan perintah artisan:

```bash
php artisan lang:publish
```

Fitur **Localization** di Laravel memungkinkan kita untuk:

* Mengelola string dalam berbagai bahasa.
* Mendukung aplikasi multi-bahasa dengan mudah.

Laravel mendukung dua pendekatan penyimpanan string terjemahan:

1. 📁 **File PHP dalam folder `lang`**

   ```
   /lang
       /en
           messages.php
       /es
           messages.php
   ```
2. 📄 **File JSON** dalam folder `lang`

   ```
   /lang
       en.json
       es.json
   ```



## 📂 Memublikasikan File Bahasa

Karena folder `lang` tidak tersedia secara default, jalankan perintah berikut untuk membuatnya:

```bash
php artisan lang:publish
```

👉 Perintah ini akan menghasilkan folder `lang` lengkap dengan file bahasa default Laravel.



## ⚙️ Konfigurasi Locale

Bahasa default aplikasi Laravel diatur di file `config/app.php` pada opsi `locale`, biasanya dikendalikan melalui variabel `.env`:

```bash
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
```

* **locale** → bahasa default.
* **fallback\_locale** → bahasa cadangan jika string terjemahan tidak ditemukan.

Anda juga bisa mengubah bahasa **secara runtime** dalam request tertentu:

```php
use Illuminate\Support\Facades\App;
 
Route::get('/greeting/{locale}', function (string $locale) {
    if (! in_array($locale, ['en', 'es', 'fr'])) {
        abort(400);
    }
    App::setLocale($locale);
});
```



## 🔎 Menentukan Locale Saat Ini

Gunakan method berikut dari `App` facade:

```php
use Illuminate\Support\Facades\App;
 
$locale = App::currentLocale();

if (App::isLocale('en')) {
    // Do something...
}
```



## 🔤 Pluralizer Language

Laravel dapat mengubah kata tunggal menjadi jamak sesuai bahasa. Anda bisa mengganti bahasa pluralizer di `AppServiceProvider`:

```php
use Illuminate\Support\Pluralizer;

public function boot(): void
{
    Pluralizer::useLanguage('spanish');
}
```

> ⚠️ Jika mengubah pluralizer, sebaiknya tentukan nama tabel model Eloquent secara eksplisit.



## 📝 Mendefinisikan String Terjemahan

### 1️⃣ Menggunakan **Short Keys**

Struktur folder `lang`:

```
/lang
    /en
        messages.php
    /es
        messages.php
```

Contoh isi file:

```php
// lang/en/messages.php
return [
    'welcome' => 'Welcome to our application!',
];
```



### 2️⃣ Menggunakan **Default String sebagai Key (JSON)**

Jika jumlah string sangat banyak, lebih mudah menggunakan **file JSON**:

```json
// lang/es.json
{
    "I love programming.": "Me encanta programar."
}
```



## 📥 Mengambil String Terjemahan

Gunakan helper `__`:

```php
echo __('messages.welcome'); // dari lang/en/messages.php
echo __('I love programming.'); // dari lang/es.json
```

Dalam Blade template:

```blade
{{ __('messages.welcome') }}
```



## 🔄 Placeholder dalam String

Gunakan `:name` sebagai placeholder:

```php
// lang/en/messages.php
'welcome' => 'Welcome, :name',
```

Cara mengganti placeholder:

```php
echo __('messages.welcome', ['name' => 'Dayle']);
// Output: Welcome, Dayle
```



## 🧩 Object Replacement

Jika placeholder berupa object, method `__toString()` akan dipanggil.
Untuk object custom, daftarkan formatter di `AppServiceProvider`:

```php
use Illuminate\Support\Facades\Lang;
use Money\Money;

public function boot(): void
{
    Lang::stringable(function (Money $money) {
        return $money->formatTo('en_GB');
    });
}
```



## 🍎 Pluralization (Jamak)

Gunakan simbol `|` untuk memisahkan singular & plural:

```php
'apples' => 'There is one apple|There are many apples',
```

Ambil dengan `trans_choice`:

```php
echo trans_choice('messages.apples', 10);
```

👉 Bisa juga dengan placeholder:

```php
'minutes_ago' => '{1} :value minute ago|[2,*] :value minutes ago',

echo trans_choice('time.minutes_ago', 5, ['value' => 5]);
```



## 📦 Override File Bahasa dari Package

Jika package membawa file bahasa sendiri, Anda bisa override dengan menaruh file di:

```
/lang/vendor/{package}/{locale}/
```

Contoh:

```
/lang/vendor/hearthfire/en/messages.php
```

Di dalamnya cukup definisikan string yang ingin dioverride. Sisanya tetap menggunakan bawaan package.



# ✅ Kesimpulan

* Laravel mendukung **dua cara** pengelolaan string terjemahan: **file PHP** (short key) dan **file JSON** (default string).
* Locale default & fallback bisa diatur di `config/app.php`.
* Tersedia fitur **pluralization**, **placeholder**, hingga **override package translation**.
* Localization membuat aplikasi **lebih fleksibel dan mendukung multi-bahasa** 🌍.



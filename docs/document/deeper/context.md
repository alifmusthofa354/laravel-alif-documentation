# 📘 `Context`

> **Ringkasan singkat:** Laravel `Context` memungkinkan Anda menyimpan, berbagi, dan memanipulasi data (metadata) yang terkait dengan eksekusi code—baik selama HTTP request, saat job di-dispatch ke queue, maupun di dalam command. Data ini juga otomatis ditambahkan ke log sehingga memudahkan *tracing* dan debugging.



## 🔖 Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Cara Kerja (Ringkasan & Contoh)](#cara-kerja-ringkasan--contoh)
3. [Menangkap & Menyimpan Context](#menangkap--menyimpan-context)

   * [Menambahkan data](#menambahkan-data)
   * [Menambahkan jika belum ada](#menambahkan-jika-belum-ada)
   * [Increment / Decrement](#increment--decrement)
4. [Conditional Context](#conditional-context)
5. [Scoped Context](#scoped-context)
6. [Stacks (Riwayat / Histori)](#stacks-riwayat--histori)
7. [Mengambil & Mengelola Context](#mengambil--mengelola-context)
8. [Hidden Context (Data Tersembunyi)](#hidden-context-data-tersembunyi)
9. [Events: Dehydrating & Hydrated](#events-dehydrating--hydrated)
10. [Best Practices & Tips](#best-practices--tips)
11. [Troubleshooting Umum](#troubleshooting-umum)
12. [Lampiran: Kode Lengkap Contoh](#lampiran-kode-lengkap-contoh)
13. [Kesimpulan singkat](#kesimpulan-singkat)



## 🧾 Pendahuluan

**Narasi:**
Fitur `Context` di Laravel dirancang untuk membantu developer melacak keadaan (state) aplikasi saat suatu event/log terjadi. Bayangkan Anda ingin tahu URL request, atau trace ID request yang sama ketika sebuah job berjalan di queue — `Context` memungkinkan hal ini dengan aman dan terstruktur.

Manfaat utamanya:

* Menambah metadata ke log (memudahkan debugging).
* Melewatkan informasi dari request ke job yang di-dispatch.
* Menyimpan data yang tidak ingin muncul di log (hidden data).



## ⚙️ Cara Kerja (Ringkasan & Contoh)

**Narasi:**
Pada dasarnya Anda menambahkan data ke `Context` menggunakan facade `Context`. Data ini otomatis dilampirkan ke setiap log yang dibuat selama konteks itu berlaku. Selain itu, ketika job di-dispatch, context saat itu "didehydrasi" dan ikut dibawa ke job, lalu "dihydrate" saat job dieksekusi.

**Contoh Middleware (menambahkan `url` dan `trace_id`):**

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AddContext
{
    public function handle(Request $request, Closure $next): Response
    {
        // Tambahkan metadata pada context
        Context::add('url', $request->url());
        Context::add('trace_id', Str::uuid()->toString());

        return $next($request);
    }
}
```

**Contoh Log:**

```php
Log::info('User authenticated.', ['auth_id' => Auth::id()]);
```

Hasil log akan menyertakan metadata dari `Context`, mis.:

```
User authenticated. {"auth_id":27} {"url":"https://example.com/login","trace_id":"..."}
```

**Narasi tambahan:**
Ini membuat log lebih kaya konteks tanpa perlu menambahkan metadata secara manual di setiap pemanggilan log.



## 📝 Menangkap & Menyimpan Context

### ➕ Menambahkan data

**Narasi:**
Gunakan `Context::add()` untuk menaruh key/value ke repository context yang sedang berjalan.

```php
use Illuminate\Support\Facades\Context;

Context::add('key', 'value');

Context::add([
    'first_key' => 'value1',
    'second_key' => 'value2',
]);
```

### 🛑 Menambahkan jika belum ada

**Narasi:**
Jika Anda tidak ingin menimpa nilai yang sudah ada, gunakan `addIf`.

```php
Context::add('key', 'first');
Context::addIf('key', 'second');

// tetap 'first'
```

### 🔼 Increment & Decrement

**Narasi:**
Cocok untuk menghitung kejadian selama request, mis. berapa record yang ditambahkan.

```php
Context::increment('records_added');
Context::increment('records_added', 5);

Context::decrement('records_added');
Context::decrement('records_added', 5);
```



## 🔍 Conditional Context

**Narasi:**
Fungsi `when` membuat penambahan context lebih deklaratif berdasarkan kondisi. Ini membantu menjaga kode tetap bersih dibanding branching manual.

```php
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Context;

Context::when(
    Auth::user()->isAdmin(),
    fn ($context) => $context->add('permissions', Auth::user()->permissions),
    fn ($context) => $context->add('permissions', []),
);
```



## 🎯 Scoped Context

**Narasi:**
`scope` memungkinkan Anda menambahkan data hanya untuk durasi eksekusi callback, dan kemudian mengembalikan context ke keadaan semula. Ini berguna bila Anda perlu menambahkan metadata temporer saat menjalankan blok operasi tertentu.

```php
Context::add('trace_id', 'abc-999');
Context::addHidden('user_id', 123);

Context::scope(
    function () {
        Context::add('action', 'adding_friend');

        $userId = Context::getHidden('user_id');

        Log::debug("Adding user [{$userId}] to friends list.");
    },
    data: ['user_name' => 'taylor_otwell'],
    hidden: ['user_id' => 987],
);

// Setelah scope selesai, perubahan sementara di-rollback (kecuali ada perubahan pada objek yang dimutasi)
```

**Catatan narasi:**
Jika objek kompleks dimodifikasi dalam scoped closure, mutasi tersebut dapat terlihat di luar scope karena referensi objek tetap sama.



## 📚 Stacks (Riwayat / Histori)

**Narasi:**
Stack menyimpan list nilai secara berurutan. Sangat cocok untuk mencatat historie peristiwa (mis. query SQL yang dijalankan) selama lifecycle request.

```php
Context::push('breadcrumbs', 'first_value');
Context::push('breadcrumbs', 'second_value', 'third_value');

Context::get('breadcrumbs');
// ['first_value', 'second_value', 'third_value']
```

**Contoh praktis (mencatat query SQL):**

```php
use Illuminate\Support\Facades\DB;

DB::listen(function ($event) {
    Context::push('queries', [$event->time, $event->sql]);
});
```

Anda dapat memeriksa keberadaan nilai di stack dengan `stackContains`.

```php
if (Context::stackContains('breadcrumbs', 'first_value')) {
    // ...
}
```



## 📤 Mengambil & Mengelola Context

**Narasi:**
Akses data menggunakan `get`, `only`, `except`, `pull` dan lainnya.

```php
$value = Context::get('key');

$data = Context::only(['first_key', 'second_key']);
$data = Context::except(['first_key']);

$value = Context::pull('key'); // ambil dan hapus

// Pop dari stack
Context::push('breadcrumbs', 'first', 'second');
Context::pop('breadcrumbs'); // 'second'

// Ambil semua
$data = Context::all();
```

Ada juga `remember` untuk menetapkan nilai jika belum ada:

```php
$permissions = Context::remember(
    'user-permissions',
    fn () => $user->permissions,
);
```



## ✅ Menentukan Ada / Tidaknya Item

**Narasi:**
Gunakan `has` dan `missing` untuk memeriksa ada atau tidaknya key. Perlu diingat: `has` menganggap `null` sebagai "ada".

```php
if (Context::has('key')) { /* ada */ }
if (Context::missing('key')) { /* tidak ada */ }

Context::add('key', null);
Context::has('key'); // true
```



## ❌ Menghapus Data Context

**Narasi:**
`forget` menghapus key dari context. Anda bisa menghapus banyak key sekaligus.

```php
Context::add(['first_key' => 1, 'second_key' => 2]);
Context::forget('first_key');
Context::forget(['first_key', 'second_key']);
```



## 🔒 Hidden Context (Data Tersembunyi)

**Narasi:**
Hidden context berguna untuk menyimpan informasi sensitif atau internal yang *tidak* ingin Anda tulis ke log. Hidden context menggunakan API yang mirip dengan public context namun terpisah.

```php
Context::addHidden('key', 'value');
Context::getHidden('key'); // 'value'
Context::get('key'); // null
```

Metode hidden mencakup: `addHidden`, `addHiddenIf`, `pushHidden`, `getHidden`, `pullHidden`, `popHidden`, `onlyHidden`, `exceptHidden`, `allHidden`, `hasHidden`, `missingHidden`, `forgetHidden`.



## 📢 Events: Dehydrating & Hydrated

**Narasi:**
Saat job di-dispatch, context "didehydrasi" (data disimpan ke payload job). Saat job itu berjalan, context tersebut "dihydrate" (kembalikan ke runtime job). Events `dehydrating` dan `hydrated` memberi hook untuk memodifikasi repository context saat proses ini.

### 🏷️ Dehydrating

**Narasi:**
Gunakan `Context::dehydrating()` untuk menambahkan data yang ingin Anda sertakan bersama job (contoh: menyimpan konfigurasi lokal saat job dipanggil).

```php
use Illuminate\Log\Context\Repository;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Context;

Context::dehydrating(function (Repository $context) {
    $context->addHidden('locale', Config::get('app.locale'));
});
```

> **PENTING:** Jangan gunakan facade `Context` di dalam callback ini—gunakan repository yang diberikan sebagai argumen.

### 💧 Hydrated

**Narasi:**
Gunakan `Context::hydrated()` untuk memulihkan (restore) kondisi lingkungan saat job berjalan.

```php
Context::hydrated(function (Repository $context) {
    if ($context->hasHidden('locale')) {
        Config::set('app.locale', $context->getHidden('locale'));
    }
});
```

Sama seperti `dehydrating`, jangan gunakan facade `Context` langsung di callback ini—modifikasilah repository yang disediakan.



## ✅ Best Practices & Tips

* **Jangan menyimpan data sensitif ke context publik.** Gunakan `addHidden` untuk hal-hal seperti token atau informasi internal.
* **Ringkaslah isi context.** Terlalu banyak metadata dapat membuat log sulit dibaca.
* **Gunakan `scope` untuk data sementara** supaya state global tidak mudah tercemar.
* **Gunakan `stack` untuk histori** (mis. query) dan hindari menyimpan duplikasi data berukuran besar.
* **Tambahkan dehydrating/hydrated hooks** bila butuh restore konfigurasi runtime (seperti locale).



## ⚠️ Troubleshooting Umum

* Jika context tidak muncul di log: pastikan logger Anda tidak menghapus metadata atau menggunakan formatter yang berbeda.
* Jika hidden data muncul di log: cek apakah Anda tidak secara eksplisit menambahkan data hidden ke log metadata.
* Jika job tidak menerima context: pastikan `dehydrating` callback mendaftarkan data yang diperlukan dan job tersebut benar-benar di-dispatch setelah context di-set.



## 🧩 Lampiran: Kode Lengkap Contoh

### 1) Middleware `AddContext`

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AddContext
{
    public function handle(Request $request, Closure $next): Response
    {
        Context::add('url', $request->url());
        Context::add('trace_id', Str::uuid()->toString());

        return $next($request);
    }
}
```

### 2) Job `ProcessPodcast`

```php
<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class ProcessPodcast implements ShouldQueue
{
    use Queueable, InteractsWithQueue;

    public $podcast;

    public function __construct($podcast)
    {
        $this->podcast = $podcast;
    }

    public function handle(): void
    {
        Log::info('Processing podcast.', [
            'podcast_id' => $this->podcast->id,
        ]);
    }
}
```

### 3) AppServiceProvider (daftarkan dehydrating/hydrated)

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Context;
use Illuminate\Support\ServiceProvider;
use Illuminate\Log\Context\Repository;
use Illuminate\Support\Facades\Config;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Context::dehydrating(function (Repository $context) {
            $context->addHidden('locale', Config::get('app.locale'));
        });

        Context::hydrated(function (Repository $context) {
            if ($context->hasHidden('locale')) {
                Config::set('app.locale', $context->getHidden('locale'));
            }
        });
    }
}
```



## 🏁 Kesimpulan singkat

`Context` adalah alat yang sangat berguna untuk memperkaya log, mengirim metadata ke job queue, dan menyimpan data tersembunyi yang tidak seharusnya muncul pada log. Dengan penggunaan yang benar (hidden data, scope, dehydrating/hydrated), observability aplikasi Laravel Anda akan meningkat signifikan.





# URL Generation di Laravel

## Pendahuluan

Laravel menyediakan berbagai **helper** yang memudahkan kita dalam membangkitkan URL pada aplikasi. Fitur ini sangat berguna ketika kita ingin membuat link di template Blade, API response, atau ketika melakukan **redirect** ke bagian lain dari aplikasi.
Dengan memanfaatkan helper ini, kita tidak perlu menulis URL secara manual, sehingga kode lebih rapi dan fleksibel.

---

## Dasar-Dasar

### Membuat URL

Helper `url()` dapat digunakan untuk membuat URL secara otomatis berdasarkan **scheme** (HTTP/HTTPS) dan **host** dari request saat ini.

**Contoh:**

```php
$post = App\Models\Post::find(1);

echo url("/posts/{$post->id}");
// Hasil: http://example.com/posts/1
```

Untuk menambahkan **query string**, gunakan method `query()`:

```php
echo url()->query('/posts', ['search' => 'Laravel']);
// Hasil: http://example.com/posts?search=Laravel
```

Jika query sudah ada, maka akan ditimpa:

```php
echo url()->query('/posts?sort=latest', ['sort' => 'oldest']);
// Hasil: http://example.com/posts?sort=oldest
```

Array juga bisa digunakan sebagai parameter:

```php
$url = url()->query('/posts', ['columns' => ['title', 'body']]);

echo $url;
// Hasil: http://example.com/posts?columns%5B0%5D=title&columns%5B1%5D=body

echo urldecode($url);
// Lebih mudah dibaca: http://example.com/posts?columns[0]=title&columns[1]=body
```

---

### Mengakses URL Saat Ini

Jika tidak memberi path, `url()` akan mengembalikan instance dari `Illuminate\Routing\UrlGenerator`.
Dengan ini, kita bisa mengambil informasi URL saat ini.

```php
// URL tanpa query string
echo url()->current();

// URL dengan query string
echo url()->full();

// URL request sebelumnya
echo url()->previous();

// Path dari request sebelumnya
echo url()->previousPath();
```

Hal ini juga bisa diakses lewat **Facade**:

```php
use Illuminate\Support\Facades\URL;

echo URL::current();
```

---

## URL untuk Named Routes

Helper `route()` digunakan untuk membuat URL berdasarkan **named route**. Keuntungannya adalah kita tidak perlu terikat dengan path route, cukup gunakan nama yang didefinisikan.

**Contoh route:**

```php
Route::get('/post/{post}', function (Post $post) {
    // ...
})->name('post.show');
```

**Membuat URL:**

```php
echo route('post.show', ['post' => 1]);
// Hasil: http://example.com/post/1
```

Dengan parameter lebih dari satu:

```php
Route::get('/post/{post}/comment/{comment}', function (Post $post, Comment $comment) {
    // ...
})->name('comment.show');

echo route('comment.show', ['post' => 1, 'comment' => 3]);
// Hasil: http://example.com/post/1/comment/3
```

Tambahan parameter yang tidak ada di definisi route akan jadi query string:

```php
echo route('post.show', ['post' => 1, 'search' => 'rocket']);
// Hasil: http://example.com/post/1?search=rocket
```

Laravel juga mendukung **Eloquent model** langsung:

```php
echo route('post.show', ['post' => $post]);
```

---

## Signed URLs

Laravel mendukung **signed URL**, yaitu URL yang dilengkapi hash signature agar tidak bisa dimodifikasi sembarangan. Cocok digunakan untuk link publik seperti **unsubscribe**.

**Membuat signed URL:**

```php
use Illuminate\Support\Facades\URL;

return URL::signedRoute('unsubscribe', ['user' => 1]);
```

**Temporary signed URL (berlaku sementara):**

```php
return URL::temporarySignedRoute(
    'unsubscribe',
    now()->addMinutes(30),
    ['user' => 1]
);
```

**Validasi request:**

```php
use Illuminate\Http\Request;

Route::get('/unsubscribe/{user}', function (Request $request) {
    if (! $request->hasValidSignature()) {
        abort(401);
    }

    // Aksi jika valid...
})->name('unsubscribe');
```

Jika ingin menambahkan parameter yang boleh diabaikan:

```php
if (! $request->hasValidSignatureWhileIgnoring(['page', 'order'])) {
    abort(401);
}
```

Lebih praktis, gunakan **middleware**:

```php
Route::post('/unsubscribe/{user}', function (Request $request) {
    // ...
})->name('unsubscribe')->middleware('signed');
```

---

## URL untuk Controller Actions

Helper `action()` digunakan untuk membuat URL ke method dalam controller.

**Contoh:**

```php
use App\Http\Controllers\HomeController;

$url = action([HomeController::class, 'index']);
```

Jika butuh parameter:

```php
$url = action([UserController::class, 'profile'], ['id' => 1]);
```

---

## Fluent URI Objects

Laravel menyediakan class `Uri` untuk manipulasi URI dengan cara **fluent** (berantai).

**Contoh penggunaan:**

```php
use Illuminate\Support\Uri;

$uri = Uri::of('https://example.com')
    ->withScheme('http')
    ->withHost('test.com')
    ->withPort(8000)
    ->withPath('/users')
    ->withQuery(['page' => 2])
    ->withFragment('section-1');

echo $uri;
```

Dengan ini kita bisa lebih fleksibel membentuk dan mengubah URL.

---

## Default Values

Kadang kita butuh default parameter untuk setiap request. Misalnya ada `{locale}` di banyak route:

```php
Route::get('/{locale}/posts', function () {
    // ...
})->name('post.index');
```

Daripada menuliskan `locale` setiap kali, kita bisa set default di middleware:

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class SetDefaultLocaleForUrls
{
    public function handle(Request $request, Closure $next): Response
    {
        URL::defaults(['locale' => $request->user()->locale]);

        return $next($request);
    }
}
```

Agar tidak bentrok dengan binding model otomatis, middleware ini perlu dijalankan **sebelum** `SubstituteBindings`. Atur di `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->prependToPriorityList(
        before: \Illuminate\Routing\Middleware\SubstituteBindings::class,
        prepend: \App\Http\Middleware\SetDefaultLocaleForUrls::class,
    );
})
```

---

## Kesimpulan

Laravel menyediakan berbagai cara untuk membangkitkan URL secara fleksibel dan aman:

* **Helper dasar**: `url()` dan `route()`
* **Named routes** agar URL tidak hardcoded
* **Signed URLs** untuk keamanan link publik
* **Controller action URLs** agar rapi
* **Fluent URI Objects** untuk manipulasi lebih kompleks
* **Default values** agar lebih efisien

Dengan fitur ini, pengelolaan URL dalam aplikasi Laravel menjadi lebih **dinamis, aman, dan mudah dipelihara**.

---

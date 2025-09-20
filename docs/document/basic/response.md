# HTTP Responses di Laravel

Laravel menyediakan berbagai cara untuk membuat dan mengirimkan **HTTP Response** kembali ke browser pengguna. Response ini bisa berupa teks sederhana, JSON, redirect, file download, hingga streaming data. Pada dokumen ini, kita akan membahas berbagai jenis response yang dapat digunakan, lengkap dengan contoh kode.

---

## 1. Membuat Response

### 1.1 Mengembalikan String

```php
Route::get('/', function () {
    return 'Hello World';
});
```

📌 Laravel otomatis mengubah string menjadi response HTTP lengkap dengan kode status `200 OK`.

---

### 1.2 Mengembalikan Array

```php
Route::get('/', function () {
    return [1, 2, 3];
});
```

📌 Array akan otomatis dikonversi menjadi **JSON response**.

---

### 1.3 Mengembalikan Koleksi Eloquent

```php
use App\Models\User;

Route::get('/user/{user}', function (User $user) {
    return $user;
});
```

📌 Model dan Collection otomatis menjadi JSON, dengan menghormati atribut `hidden`.

---

## 2. Response Object

Kadang kita perlu kontrol lebih (status code, headers, dll).

```php
Route::get('/home', function () {
    return response('Hello World', 200)
        ->header('Content-Type', 'text/plain');
});
```

---

## 3. Menambahkan Header

### 3.1 Dengan `header()`

```php
return response('Data dikirim')
    ->header('Content-Type', 'application/json')
    ->header('X-Header-One', 'Value 1');
```

### 3.2 Dengan `withHeaders()`

```php
return response('Data dikirim')->withHeaders([
    'Content-Type' => 'application/json',
    'X-Header-One' => 'Value 1',
]);
```

---

## 4. Cache Control Middleware

Gunakan middleware `cache.headers` untuk mengatur `Cache-Control` dan `ETag`.

```php
Route::middleware('cache.headers:public;max_age=2628000;etag')->group(function () {
    Route::get('/privacy', fn () => '...');
    Route::get('/terms', fn () => '...');
});
```

---

## 5. Cookies dalam Response

### 5.1 Menambahkan Cookie

```php
return response('Hello World')->cookie(
    'name', 'value', 60
);
```

### 5.2 Cookie dengan Opsi Lengkap

```php
return response('Hello World')->cookie(
    'name', 'value', 60, '/', '.example.com', true, true
);
```

### 5.3 Menggunakan `Cookie::queue`

```php
use Illuminate\Support\Facades\Cookie;

Cookie::queue('user_id', '12345', 60);
```

### 5.4 Membuat & Menghapus Cookie

```php
$cookie = cookie('name', 'value', 60);
return response('Hello')->cookie($cookie);

return response('Bye')->withoutCookie('name');
Cookie::expire('name');
```

📌 Semua cookie di Laravel terenkripsi secara default.

---

## 6. Redirect Response

### 6.1 Redirect ke URL

```php
return redirect('/home/dashboard');
```

### 6.2 Redirect Kembali (`back`)

```php
return back()->withInput();
```

### 6.3 Redirect ke Named Route

```php
return redirect()->route('login');
return redirect()->route('profile', ['id' => 1]);
```

### 6.4 Redirect dengan Model

```php
return redirect()->route('profile', [$user]);
```

📌 Bisa override `getRouteKey()` di model untuk custom parameter.

### 6.5 Redirect ke Controller Action

```php
use App\Http\Controllers\UserController;

return redirect()->action([UserController::class, 'index']);
```

### 6.6 Redirect ke Domain Eksternal

```php
return redirect()->away('https://www.google.com');
```

### 6.7 Redirect dengan Flash Data

```php
return redirect('/dashboard')->with('status', 'Profile updated!');
```

### 6.8 Redirect dengan Input Lama

```php
return back()->withInput();
```

---

## 7. Jenis Response Lain

### 7.1 View Response

```php
return response()->view('welcome', ['name' => 'Budi'], 200);
```

### 7.2 JSON Response

```php
return response()->json(['name' => 'Abigail', 'state' => 'CA']);
```

### 7.3 JSONP Response

```php
return response()->json(['name' => 'Abigail'])
    ->withCallback(request()->input('callback'));
```

### 7.4 File Download

```php
return response()->download(storage_path('app/file.pdf'));
```

### 7.5 File Display

```php
return response()->file(storage_path('app/file.pdf'));
```

---

## 8. Streamed Responses

### 8.1 Streaming Data

```php
Route::get('/stream', function () {
    return response()->stream(function () {
        foreach (['developer', 'admin'] as $string) {
            echo $string;
            ob_flush(); flush();
            sleep(2);
        }
    });
});
```

### 8.2 Streamed JSON

```php
use App\Models\User;

Route::get('/users.json', function () {
    return response()->streamJson([
        'users' => User::cursor(),
    ]);
});
```

### 8.3 Event Stream (SSE)

```php
Route::get('/chat', function () {
    return response()->eventStream(function () {
        yield "data: Hello\n\n";
    });
});
```

### 8.4 Streamed Download

```php
return response()->streamDownload(function () {
    echo "Dynamic content...";
}, 'example.txt');
```

---

## 9. Konsumsi Stream di Frontend

Gunakan paket **@laravel/stream-react** atau **@laravel/stream-vue**.

Contoh React:

```tsx
import { useStream } from "@laravel/stream-react";

function App() {
    const { data, send } = useStream("chat");
    return (
        <div>
            <div>{data}</div>
            <button onClick={() => send({ msg: "Hello" })}>Send</button>
        </div>
    );
}
```

---

## 10. Response Macro

```php
// App\Providers\AppServiceProvider.php
use Illuminate\Support\Facades\Response;

public function boot(): void
{
    Response::macro('caps', function ($value) {
        return Response::make(strtoupper($value));
    });
}
```

Pemanggilan:

```php
return response()->caps('halo dunia');
```

---


## 📌 Laravel HTTP Response Cheatsheet

### 🔹 Basic Response

```php
return 'Hello World';               // String
return [1, 2, 3];                   // Array → JSON
return $user;                       // Eloquent Model → JSON
```

---

### 🔹 Response Object

```php
return response('Hello', 200)
    ->header('Content-Type', 'text/plain');
```

---

### 🔹 Headers

```php
response('ok')->header('X-Token', '123');
response('ok')->withHeaders([
  'X-One' => '1',
  'X-Two' => '2',
]);
```

---

### 🔹 Cache Control

```php
Route::middleware('cache.headers:public;max_age=2628000;etag')
    ->group(fn () => ... );
```

---

### 🔹 Cookies

```php
// Tambah cookie
response('ok')->cookie('name', 'val', 60);

// Queue cookie
Cookie::queue('id', '123', 60);

// Hapus cookie
response('bye')->withoutCookie('name');
Cookie::expire('name');

// Buat instance cookie
$cookie = cookie('foo', 'bar', 60);
```

---

### 🔹 Redirect

```php
redirect('/home');                         // ke URL
redirect()->route('login');                // ke named route
redirect()->route('profile', [$user]);     // dengan model
redirect()->action([UserController::class, 'index']); // ke action
redirect()->away('https://google.com');    // eksternal
back()->withInput();                       // kembali + input lama
redirect('/dashboard')->with('status', 'done!'); // flash data
```

---

### 🔹 View / JSON

```php
response()->view('welcome', ['name'=>'Budi']);
response()->json(['ok' => true]);
response()->json(['ok' => true])->withCallback('cb'); // JSONP
```

---

### 🔹 File Response

```php
response()->download(storage_path('app/file.pdf'));
response()->file(storage_path('app/file.pdf'));
```

---

### 🔹 Streaming

```php
// Stream teks bertahap
response()->stream(function () {
  echo "chunk1"; flush();
});

// Stream JSON
response()->streamJson(['users' => User::cursor()]);

// SSE (Event Stream)
response()->eventStream(fn () => yield "data: hello\n\n");

// Stream Download
response()->streamDownload(fn () => echo "content", 'file.txt');
```

---

### 🔹 Response Macro

```php
Response::macro('caps', fn($v) => Response::make(strtoupper($v)));
return response()->caps('halo dunia');
```

---

### ✅ Ringkasan Cepat

* **String / Array / Model** → otomatis jadi response.
* **response()** → kontrol penuh (status, header, cookie).
* **redirect()** → URL, route, action, back, away.
* **response()->json()** → API response.
* **response()->download() / file()** → kirim file.
* **response()->stream()** → data bertahap.
* **Macro** → custom reusable response.


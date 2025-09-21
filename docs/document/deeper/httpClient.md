# HTTP Client (Klien HTTP)

## Pendahuluan
Laravel menyediakan API yang ekspresif dan minimalis di atas Guzzle HTTP client. Ini memungkinkan Anda untuk dengan cepat melakukan permintaan HTTP keluar (outgoing requests) untuk berkomunikasi dengan aplikasi web lain.  
Laravel membungkus Guzzle dengan fokus pada kasus penggunaan yang paling umum dan memberikan pengalaman pengembang yang nyaman.



## Membuat Permintaan (Making Requests)
Untuk melakukan permintaan HTTP, Anda dapat menggunakan metode `head`, `get`, `post`, `put`, `patch`, dan `delete` yang disediakan oleh **Http facade**.

```php
use Illuminate\Support\Facades\Http;

$response = Http::get('http://example.com');
````

Metode `get` akan mengembalikan objek `Illuminate\Http\Client\Response`, yang menyediakan berbagai metode untuk memeriksa hasil respons:

```php
$response->body();        // Mengembalikan konten sebagai string
$response->json();        // Mengembalikan konten JSON sebagai array atau object
$response->object();      // Mengembalikan konten JSON sebagai object
$response->collect();     // Mengembalikan konten sebagai Collection Laravel
$response->status();      // Kode status HTTP
$response->successful();  // True jika status 200–299
$response->failed();      // True jika status >= 400
$response->clientError(); // True jika status 400–499
$response->serverError(); // True jika status 500–599
$response->header('X');   // Mengambil header tertentu
$response->headers();     // Mengambil semua header
```

Objek `Response` juga mendukung **ArrayAccess**, sehingga Anda dapat mengakses data JSON langsung seperti array:

```php
return Http::get('http://example.com/users/1')['name'];
```

Anda juga dapat memeriksa status HTTP spesifik:

```php
$response->ok();           // 200 OK
$response->created();      // 201 Created
$response->accepted();     // 202 Accepted
$response->noContent();    // 204 No Content
$response->notFound();     // 404 Not Found
$response->serverError();  // 500 Internal Server Error
```



## URI Templates

Laravel HTTP Client mendukung **URI Template** untuk membangun URL dinamis:

```php
Http::withUrlParameters([
    'endpoint' => 'https://laravel.com',
    'page' => 'docs',
    'version' => '12.x',
    'topic' => 'validation',
])->get('{+endpoint}/{page}/{version}/{topic}');
```

Ini mempermudah membuat URL kompleks tanpa harus menggabungkan string manual.



## Dumping Requests

Jika ingin **men-debug request** sebelum dikirim, gunakan `dd()`:

```php
return Http::dd()->get('http://example.com');
```



## Data Permintaan (Request Data)

### Mengirim Data (POST/PUT/PATCH)

Untuk mengirim data ke server:

```php
$response = Http::post('http://example.com/users', [
    'name' => 'Steve',
    'role' => 'Network Administrator',
]);
```

### Parameter Query (GET)

Anda bisa menambahkan parameter query langsung atau menggunakan array:

```php
$response = Http::get('http://example.com/users', [
    'name' => 'Taylor',
    'page' => 1,
]);
```

Atau menggunakan `withQueryParameters`:

```php
Http::retry(3, 100)->withQueryParameters([
    'name' => 'Taylor',
    'page' => 1,
])->get('http://example.com/users');
```

### Form Request

Untuk mengirim data `application/x-www-form-urlencoded`:

```php
$response = Http::asForm()->post('http://example.com/users', [
    'name' => 'Sara',
    'role' => 'Privacy Consultant',
]);
```

### Raw Body

Jika ingin mengirim konten mentah:

```php
$response = Http::withBody(
    base64_encode($photo), 'image/jpeg'
)->post('http://example.com/photo');
```

### Multipart Requests

Untuk mengirim file:

```php
$response = Http::attach(
    'attachment', file_get_contents('photo.jpg'), 'photo.jpg'
)->post('http://example.com/attachments');
```



## Header

Menambahkan header ke permintaan:

```php
$response = Http::withHeaders([
    'X-First' => 'foo',
    'X-Second' => 'bar'
])->post('http://example.com/users', ['name' => 'Taylor']);
```

Shortcut untuk header umum:

```php
Http::accept('application/json');
Http::acceptJson();
```

Mengganti seluruh header:

```php
$response = Http::withHeaders([
    'X-Original' => 'foo',
])->replaceHeaders([
    'X-Replacement' => 'bar',
])->post('http://example.com/users', ['name' => 'Taylor']);
```



## Autentikasi

### Basic / Digest

```php
Http::withBasicAuth('user', 'secret')->post(/* ... */);
Http::withDigestAuth('user', 'secret')->post(/* ... */);
```

### Bearer Token

```php
Http::withToken('token')->post(/* ... */);
```



## Timeout

Menentukan batas waktu request:

```php
Http::timeout(3)->get(/* ... */);
Http::connectTimeout(3)->get(/* ... */);
```



## Retry (Percobaan Ulang)

Laravel dapat otomatis mencoba ulang permintaan jika terjadi error:

```php
Http::retry(3, 100)->post(/* ... */);
```

Strategi backoff:

```php
Http::retry(3, fn($attempt, $e) => $attempt * 100)->post(/* ... */);
```

Kondisi khusus:

```php
Http::retry(3, 100, function (Exception $e, PendingRequest $request) {
    return $e instanceof ConnectionException;
})->post(/* ... */);
```



## Penanganan Error

```php
$response->successful();   // 200–299
$response->failed();       // >=400
$response->clientError();  // 400–499
$response->serverError();  // 500–599
$response->onError(fn() => ...); // Callback jika error
```



## Melempar Exception

```php
$response = Http::post(/* ... */)->throw();
$response->throwIf(fn($res) => true);
$response->throwUnlessStatus(200);
```

Custom handling:

```php
Http::post(/* ... */)->throw(function (Response $response, RequestException $e) {
    // logika custom
})->json();
```



## Middleware Guzzle

### Request Middleware

```php
Http::withRequestMiddleware(function (RequestInterface $request) {
    return $request->withHeader('X-Example', 'Value');
})->get('http://example.com');
```

### Response Middleware

```php
Http::withResponseMiddleware(function (ResponseInterface $response) {
    return $response;
})->get('http://example.com');
```

### Global Middleware

Middleware yang berlaku untuk semua request:

```php
Http::globalRequestMiddleware(fn($req) => $req->withHeader('User-Agent', 'App/1.0'));
Http::globalResponseMiddleware(fn($res) => $res->withHeader('X-Finished-At', now()));
```



## Opsi

### Per Request

```php
Http::withOptions(['debug' => true])->get('http://example.com');
```

### Global Options

```php
Http::globalOptions(['allow_redirects' => false]);
```



## Concurrent Requests

Mengirim beberapa request sekaligus:

```php
$responses = Http::pool(fn(Pool $pool) => [
    $pool->get('http://localhost/first'),
    $pool->get('http://localhost/second'),
    $pool->get('http://localhost/third'),
]);
```

Named requests:

```php
$responses = Http::pool(fn(Pool $pool) => [
    $pool->as('first')->get('http://localhost/first'),
]);
```

Custom headers untuk pool:

```php
$headers = ['X-Example' => 'example'];
Http::pool(fn(Pool $pool) => [
    $pool->withHeaders($headers)->get('http://laravel.test/test'),
]);
```



## Macros

Mendefinisikan konfigurasi request reusable:

```php
Http::macro('github', function () {
    return Http::withHeaders(['X-Example' => 'example'])
               ->baseUrl('https://github.com');
});

$response = Http::github()->get('/');
```



## Testing

### Fake Responses

```php
Http::fake();
Http::fake(['github.com/*' => Http::response(['foo' => 'bar'], 200)]);
```

Simple responses:

```php
Http::fake([
    'google.com/*' => 'Hello World',
    'github.com/*' => ['foo' => 'bar'],
    'chatgpt.com/*' => 200,
]);
```

### Fake Exceptions

```php
Http::fake(['github.com/*' => Http::failedConnection()]);
Http::fake(['github.com/*' => Http::failedRequest(['code' => 'not_found'], 404)]);
```

### Response Sequences

```php
Http::fake([
    'github.com/*' => Http::sequence()
        ->push('Hello World', 200)
        ->push(['foo' => 'bar'], 200)
        ->pushStatus(404),
]);
```

### Fake Callback

```php
Http::fake(function (Request $request) {
    return Http::response('Hello World', 200);
});
```

### Inspecting Requests

```php
Http::assertSent(fn(Request $req) => $req->url() == 'http://example.com/users');
Http::assertNotSent(fn(Request $req) => $req->url() === 'http://example.com/posts');
Http::assertSentCount(5);
Http::assertNothingSent();
```

### Recording Requests / Responses

```php
$recorded = Http::recorded();
[$request, $response] = $recorded[0];
```

### Preventing Stray Requests

```php
Http::preventStrayRequests();
Http::allowStrayRequests(['http://127.0.0.1:5000/*']);
```



## Events

Laravel memicu tiga event selama proses request:

* `RequestSending` → sebelum request dikirim
* `ResponseReceived` → setelah menerima response
* `ConnectionFailed` → jika koneksi gagal

Contoh membuat event listener:

```php
use Illuminate\Http\Client\Events\RequestSending;

class LogRequest {
    public function handle(RequestSending $event): void {
        // $event->request bisa digunakan untuk logging atau debugging
    }
}
```

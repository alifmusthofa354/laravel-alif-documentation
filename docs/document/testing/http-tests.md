# 🧪 HTTP Tests di Laravel

## 📌 Pendahuluan

Laravel menyediakan API yang sangat **fleksibel dan ekspresif** untuk melakukan **HTTP request** ke aplikasi kita serta memeriksa responnya.
Dengan ini, kita bisa menguji endpoint tanpa benar-benar melakukan request ke jaringan.

👉 Contoh sederhana dengan **Pest**:

```php
<?php

test('aplikasi mengembalikan response sukses', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
```

📝 Pada contoh di atas:

* `get()` → membuat request GET ke aplikasi.
* `assertStatus(200)` → memastikan respon memiliki status HTTP 200.

---

## 🚀 Membuat Request

Laravel mendukung berbagai metode HTTP seperti:
`get`, `post`, `put`, `patch`, `delete`.

⚡ Catatan:

* Request tidak benar-benar keluar ke jaringan, tapi disimulasikan secara internal.
* Mengembalikan instance `Illuminate\Testing\TestResponse`, yang menyediakan banyak metode assertion.

👉 Contoh dasar:

```php
<?php

test('basic request', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
```

---

## 🛠️ Menyesuaikan Request

### 🔖 Menambahkan Header

Gunakan `withHeaders()` untuk menambahkan custom header:

```php
<?php

test('menggunakan header custom', function () {
    $response = $this->withHeaders([
        'X-Header' => 'Value',
    ])->post('/user', ['name' => 'Sally']);

    $response->assertStatus(201);
});
```

---

### 🍪 Cookies

Gunakan `withCookie` atau `withCookies`:

```php
<?php

test('menggunakan cookies', function () {
    $response = $this->withCookie('color', 'blue')->get('/');

    $response = $this->withCookies([
        'color' => 'blue',
        'name' => 'Taylor',
    ])->get('/');
});
```

---

### 🎒 Session & Autentikasi

Gunakan `withSession()` untuk preload data ke session:

```php
<?php

test('menggunakan session', function () {
    $response = $this->withSession(['banned' => false])->get('/');
});
```

Untuk autentikasi user, gunakan `actingAs()`:

```php
<?php

use App\Models\User;

test('action yang butuh login', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->withSession(['banned' => false])
        ->get('/');
});
```

Jika ingin memastikan request berjalan tanpa autentikasi:

```php
$this->actingAsGuest();
```

---

## 🐞 Debugging Response

Laravel menyediakan beberapa metode untuk debug response:

* `dump()` → menampilkan isi response
* `dumpHeaders()` → menampilkan header
* `dumpSession()` → menampilkan data session

👉 Contoh:

```php
$response = $this->get('/');
$response->dumpHeaders();
```

Jika ingin debug sekaligus menghentikan eksekusi:

* `dd()`, `ddHeaders()`, `ddBody()`, `ddJson()`, `ddSession()`

---

## ⚡ Exception Handling

Kadang kita ingin memastikan exception tertentu dilemparkan. Gunakan `Exceptions::fake()`.

👉 Contoh:

```php
<?php

use App\Exceptions\InvalidOrderException;
use Illuminate\Support\Facades\Exceptions;

test('exception ditangkap', function () {
    Exceptions::fake();

    $response = $this->get('/order/1');

    Exceptions::assertReported(InvalidOrderException::class);
});
```

Jika ingin disable handler exception bawaan:

```php
$response = $this->withoutExceptionHandling()->get('/');
```

---

## 📡 Testing JSON API

Laravel memudahkan testing API dengan `getJson`, `postJson`, dll.

👉 Contoh:

```php
<?php

test('request API', function () {
    $response = $this->postJson('/api/user', ['name' => 'Sally']);

    $response
        ->assertStatus(201)
        ->assertJson([
            'created' => true,
        ]);
});
```

Kita bisa memeriksa data JSON langsung:

```php
expect($response['created'])->toBeTrue();
```

---

## 🖼️ Testing File Upload

Laravel menyediakan `UploadedFile::fake()` + `Storage::fake()`.

👉 Contoh upload avatar:

```php
<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('upload avatar', function () {
    Storage::fake('avatars');

    $file = UploadedFile::fake()->image('avatar.jpg');

    $response = $this->post('/avatar', [
        'avatar' => $file,
    ]);

    Storage::disk('avatars')->assertExists($file->hashName());
});
```

---

## 🎨 Testing Views

Selain HTTP request, Laravel juga mendukung testing view secara langsung.

👉 Contoh:

```php
<?php

test('render view welcome', function () {
    $view = $this->view('welcome', ['name' => 'Taylor']);

    $view->assertSee('Taylor');
});
```

---

## ✅ Daftar Assertion Lengkap

Laravel menyediakan ratusan assertion untuk:

* **Response** → `assertStatus`, `assertOk`, `assertJson`, `assertExactJson`, `assertRedirect`, dll.
* **Authentication** → `assertAuthenticated`, `assertGuest`, `assertAuthenticatedAs`.
* **Validation** → `assertValid`, `assertInvalid`.
* **Views** → `assertViewHas`, `assertViewMissing`, `assertViewIs`.

👉 Misalnya:

```php
$response->assertStatus(200);   // HTTP OK
$response->assertJson(['name' => 'Taylor']);
$response->assertViewHas('user');
```

---

# 🎯 Kesimpulan

* Laravel HTTP Testing memungkinkan kita menguji endpoint, JSON API, file upload, view, hingga autentikasi **tanpa request nyata**.
* Sangat berguna untuk **automated testing** agar aplikasi tetap stabil saat berkembang.
* Gunakan assertion yang sesuai dengan kebutuhan: **status, JSON, session, view, atau autentikasi**.

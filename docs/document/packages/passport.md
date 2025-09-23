# 🔐 Laravel Passport

Laravel Passport menyediakan implementasi server OAuth2 penuh untuk aplikasi Laravel Anda dalam hitungan menit. Passport dibuat di atas server OAuth2 League, yang menyediakan backend OAuth2 yang kuat dan teruji untuk aplikasi Laravel Anda.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [Frontend Quickstart](#frontend-quickstart)
5. [Mengatur Clients](#mengatur-clients)
6. [Token Request](#token-request)
7. [Consuming API](#consuming-api)
8. [Authorization Scopes](#authorization-scopes)
9. [Personal Access Tokens](#personal-access-tokens)
10. [Routing](#routing)
11. [Events](#events)
12. [Testing](#testing)

## 🎯 Pendahuluan

Laravel Passport adalah package lengkap untuk mengimplementasikan autentikasi OAuth2 dalam aplikasi Laravel Anda. Passport menyediakan backend OAuth2 yang kuat dan teruji yang memungkinkan aplikasi Anda dapat mengeluarkan token akses untuk pengguna eksternal.

### ✨ Fitur Utama
- Implementasi OAuth2 penuh
- Manajemen client yang lengkap
- Personal access tokens
- Authorization scopes
- Middleware autentikasi
- Vue components untuk frontend
- Event system
- Token revocation

### ⚠️ Catatan Penting
Passport adalah package "heavyweight" yang menyediakan implementasi OAuth2 penuh. Jika Anda membutuhkan sistem autentikasi yang lebih sederhana untuk SPA, mobile apps, atau API tokens, pertimbangkan untuk menggunakan Laravel Sanctum.

## 📦 Instalasi

### 🎯 Menginstal Passport
Untuk memulai, instal Passport melalui Composer:

```bash
composer require laravel/passport
```

### 🛠️ Publish Resources
Passport memiliki service provider sendiri yang mendaftarkan direktori migrasi database-nya sendiri. Anda harus mendaftarkan penyedia layanan tersebut dalam array `providers` dari file konfigurasi `app.php` Anda:

```php
'providers' => [
    // ...
    Laravel\Passport\PassportServiceProvider::class,
],
```

Setelah mendaftarkan penyedia layanan Passport, panggil perintah `vendor:publish` Artisan:

```bash
php artisan vendor:publish --provider="Laravel\Passport\PassportServiceProvider"
```

### 🔧 Run Migrations
Setelah mempublish resource Passport, Anda harus menjalankan migrasi database:

```bash
php artisan migrate
```

### 🔐 Generate Encryption Keys
Passport menggunakan encryption keys untuk membuat token akses yang aman. Anda dapat menghasilkan key ini menggunakan perintah `passport:install`:

```bash
php artisan passport:install
```

Perintah ini akan membuat key "personal access" dan "password grant" client yang akan digunakan untuk menghasilkan token akses.

### 🔄 Add Traits to User Model
Tambahkan trait `Laravel\Passport\HasApiTokens` ke model `App\Models\User` Anda:

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;
}
```

### 📋 Configure API Guards
Dalam file konfigurasi `config/auth.php` Anda, Anda harus mengatur opsi `driver` dari guard `api` ke `passport`:

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],

    'api' => [
        'driver' => 'passport',
        'provider' => 'users',
    ],
],
```

## ⚙️ Konfigurasi

### 📄 File Konfigurasi
Setelah menginstal Passport, file konfigurasi utama akan ditempatkan di `config/passport.php`. File ini memungkinkan Anda mengkonfigurasi berbagai aspek Passport.

### 📋 Konfigurasi Dasar
```php
<?php

return [
    'private_key' => env('PASSPORT_PRIVATE_KEY'),

    'public_key' => env('PASSPORT_PUBLIC_KEY'),

    'client_uuids' => true,

    'personal_access_client' => [
        'id' => env('PASSPORT_PERSONAL_ACCESS_CLIENT_ID'),
        'secret' => env('PASSPORT_PERSONAL_ACCESS_CLIENT_SECRET'),
    ],

    'storage' => [
        'database' => [
            'connection' => env('DB_CONNECTION', 'mysql'),
        ],
    ],
];
```

### 📋 Client UUIDs
Passport menggunakan UUID untuk client ID secara default. Jika Anda ingin menggunakan integer ID, Anda dapat menonaktifkan fitur ini:

```php
'client_uuids' => false,
```

### 📋 Token Lifetimes
Anda dapat menyesuaikan lifetime token akses dan refresh token:

```php
'token_expires_in' => now()->addDays(15),

'refresh_tokens_expire_in' => now()->addDays(30),

'personal_access_tokens_expire_in' => now()->addMonths(6),
```

## 🎨 Frontend Quickstart

### 📋 Vue Components
Passport menyertakan Vue components yang dapat digunakan sebagai titik awal untuk frontend aplikasi Anda. Untuk mempublikasikan component ini, gunakan perintah `vendor:publish`:

```bash
php artisan vendor:publish --provider="Laravel\Passport\PassportServiceProvider" --tag="passport-components"
```

### 📋 Menggunakan Components
Setelah mempublikasikan component, Anda dapat mendaftarkannya dalam file `app.js` Anda:

```javascript
import Vue from 'vue';
import Example from './components/Example.vue';

Vue.component('example-component', Example);

const app = new Vue({
    el: '#app',
});
```

### 📋 Blade Views
Anda juga dapat mempublikasikan view Passport untuk menyesuaikannya:

```bash
php artisan vendor:publish --provider="Laravel\Passport\PassportServiceProvider" --tag="passport-views"
```

## 🛠️ Mengatur Clients

### 📋 Membuat Clients
Clients adalah aplikasi yang ingin berinteraksi dengan API Anda. Misalnya, aplikasi mobile Anda mungkin perlu membuat client untuk meminta token akses dari pengguna.

Anda dapat membuat client menggunakan perintah Artisan `passport:client`:

```bash
php artisan passport:client
```

Perintah ini akan meminta Anda informasi lebih lanjut tentang client Anda dan akan memberikan client ID dan secret.

### 📋 Password Grant Clients
Jika aplikasi Anda hanya perlu mendukung flow "password grant", Anda dapat menggunakan opsi `--password` ketika membuat client:

```bash
php artisan passport:client --password
```

### 📋 Personal Access Clients
Sebelum aplikasi Anda dapat menghasilkan personal access tokens, Anda harus membuat personal access client:

```bash
php artisan passport:client --personal
```

### 📋 Listing Clients
Anda dapat melihat semua client yang ada menggunakan perintah `passport:client --list`:

```bash
php artisan passport:client --list
```

## 🎟️ Token Request

### 📋 Password Grant Tokens
Password grant tokens memungkinkan aplikasi klien lain untuk menukar email dan password untuk token akses. Ini memungkinkan aplikasi klien untuk memiliki pengalaman login yang sama seperti aplikasi web tradisional.

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

Route::post('/oauth/token', function (Request $request) {
    $response = Http::asForm()->post('http://your-app.test/oauth/token', [
        'grant_type' => 'password',
        'client_id' => 'client-id',
        'client_secret' => 'client-secret',
        'username' => $request->username,
        'password' => $request->password,
        'scope' => '',
    ]);

    return $response->json();
});
```

### 📋 Authorization Code Grant
Flow "authorization code grant" digunakan ketika aplikasi klien ingin mengakses data pengguna atas nama pengguna. Flow ini adalah flow OAuth2 yang paling kompleks tetapi juga memberikan keamanan yang paling tinggi.

```php
Route::get('/redirect', function () {
    $query = http_build_query([
        'client_id' => 'client-id',
        'redirect_uri' => 'http://example.com/callback',
        'response_type' => 'code',
        'scope' => '',
    ]);

    return redirect('http://your-app.test/oauth/authorize?'.$query);
});
```

### 📋 Implicit Grant
Flow "implicit grant" mirip dengan flow authorization code; namun, token dikembalikan ke aplikasi klien tanpa pertukaran kode otorisasi. Flow ini paling umum digunakan untuk JavaScript atau aplikasi mobile:

```php
Route::get('/redirect', function () {
    $query = http_build_query([
        'client_id' => 'client-id',
        'redirect_uri' => 'http://example.com/callback',
        'response_type' => 'token',
        'scope' => '',
    ]);

    return redirect('http://your-app.test/oauth/authorize?'.$query);
});
```

### 📋 Client Credentials Grant
Flow "client credentials grant" sesuai untuk autentikasi mesin-ke-mesin. Misalnya, Anda dapat menggunakan flow ini untuk API yang berjalan di server Anda untuk melaporkan statistik ke aplikasi induk:

```php
use Illuminate\Support\Facades\Http;

Route::get('/token', function () {
    $response = Http::asForm()->post('http://your-app.test/oauth/token', [
        'grant_type' => 'client_credentials',
        'client_id' => 'client-id',
        'client_secret' => 'client-secret',
        'scope' => '',
    ]);

    return $response->json();
});
```

## 🌐 Consuming API

### 📋 Melalui JavaScript
Saat menggunakan Passport, Anda mungkin perlu mengkonsumsi API Anda dari aplikasi JavaScript yang berjalan di browser yang sama. Dalam situasi ini, Anda dapat menggunakan middleware `CreateFreshApiToken`:

```php
use Laravel\Passport\Http\Middleware\CreateFreshApiToken;

'web' => [
    // Middleware lain...
    CreateFreshApiToken::class,
],
```

Middleware ini akan melampirkan cookie `laravel_token` ke respons outbound Anda. Cookie ini berisi token CSRF terenkripsi yang dapat digunakan untuk mengautentikasi permintaan API JavaScript yang dibuat dari aplikasi Anda.

### 📋 Melalui Axios
Jika Anda menggunakan library HTTP Axios untuk membuat permintaan outbound, cookie akan secara otomatis dilampirkan ke permintaan yang dibuat:

```javascript
axios.get('/api/user')
    .then(response => {
        console.log(response.data);
    });
```

### 📋 Melalui Guzzle
Anda juga dapat menggunakan Guzzle HTTP library untuk membuat permintaan ke API Anda:

```php
use GuzzleHttp\Client;

$client = new Client();

$response = $client->request('GET', 'http://example.com/api/user', [
    'headers' => [
        'Accept' => 'application/json',
        'Authorization' => 'Bearer '.$accessToken,
    ],
]);

return json_decode((string) $response->getBody(), true);
```

## 🔐 Authorization Scopes

### 📋 Mendefinisikan Scopes
Scopes memungkinkan aplikasi klien untuk meminta izin spesifik saat meminta akses ke akun pengguna. Misalnya, jika Anda membangun media sosial, Anda mungkin hanya perlu izin untuk membaca feed pengguna, bukan menghapus akun pengguna.

Anda dapat mendefinisikan scope aplikasi Anda dalam metode `boot` dari class `AppServiceProvider`:

```php
use Laravel\Passport\Passport;

Passport::tokensCan([
    'read' => 'Read user data',
    'write' => 'Write user data',
    'delete' => 'Delete user data',
]);
```

### 📋 Meminta Scopes
Ketika meminta akses otorisasi, konsumen dapat menentukan scope yang mereka inginkan menggunakan parameter `scope` yang dipisahkan dengan spasi:

```php
$query = http_build_query([
    'client_id' => 'client-id',
    'redirect_uri' => 'http://example.com/callback',
    'response_type' => 'code',
    'scope' => 'read write',
]);

return redirect('http://your-app.test/oauth/authorize?'.$query);
```

### 📋 Memeriksa Scopes
Passport menyertakan dua middleware yang dapat digunakan untuk memverifikasi bahwa token autentikasi yang masuk memiliki scope yang diperlukan:

```php
Route::get('/orders', function () {
    // Token memiliki scope "read" atau "write"...
})->middleware('scope:read,write');

Route::get('/orders', function () {
    // Token memiliki scope "read"...
})->middleware('scopes:read');
```

## 🎫 Personal Access Tokens

### 📋 Membuat Personal Access Tokens
Terkadang pengguna Anda mungkin ingin mengeluarkan token akses untuk diri mereka sendiri tanpa melalui flow pengkodean otorisasi tipikal. Memungkinkan pengguna Anda untuk mengeluarkan token melalui UI aplikasi Anda dapat berguna untuk memberikan pendekatan yang mudah untuk mengeluarkan token untuk penggunaan API pribadi.

Anda dapat membuat token untuk pengguna yang saat ini diautentikasi menggunakan metode `createToken` pada model pengguna:

```php
use Illuminate\Http\Request;

Route::get('/token', function (Request $request) {
    $token = $request->user()->createToken('My Token Name');

    return ['token' => $token->plainTextToken];
});
```

### 📋 Menggunakan Personal Access Tokens
Personal access tokens dapat digunakan seperti token OAuth2 biasa:

```bash
curl -X GET http://localhost:8000/api/user \
    -H "Authorization: Bearer your-personal-access-token" \
    -H "Accept: application/json"
```

### 📋 Menghapus Personal Access Tokens
Anda dapat menghapus personal access tokens menggunakan metode `tokens` pada model pengguna:

```php
$request->user()->tokens()->delete();
```

## 🚦 Routing

### 📋 Passport Routes
Passport menyertakan rute untuk mengeluarkan token dan mencabut akses terhadap token klien. Namun, Anda harus secara manual menentukan rute ini dalam file `AuthServiceProvider` Anda:

```php
use Laravel\Passport\Passport;

public function boot()
{
    $this->registerPolicies();

    Passport::routes();
}
```

### 📋 Customizing Routes
Jika Anda tidak ingin mendaftarkan semua route Passport, Anda dapat menggunakan metode berikut untuk mendaftarkan subset route:

```php
Passport::routes(function ($router) {
    $router->forAccessTokens();
    $router->forTransientTokens();
});
```

### 📋 Route Middleware
Passport juga menyertakan middleware untuk melindungi route API Anda:

```php
Route::get('/user', function () {
    // Hanya pengguna yang diautentikasi yang dapat mengakses...
})->middleware('auth:api');
```

## 📢 Events

### 📋 Passport Events
Passport memicu berbagai event selama proses autentikasi token:

```php
use Laravel\Passport\Events\AccessTokenCreated;
use Laravel\Passport\Events\RefreshTokenCreated;

Event::listen(AccessTokenCreated::class, function ($event) {
    // Token akses telah dibuat...
});

Event::listen(RefreshTokenCreated::class, function ($event) {
    // Token refresh telah dibuat...
});
```

### 📋 Custom Events
Anda juga dapat memicu event kustom dalam aplikasi Anda:

```php
use Laravel\Passport\Events\AccessTokenCreated;

event(new AccessTokenCreated($tokenId, $userId, $clientId));
```

## 🧪 Testing

### 📋 Testing dengan PHPUnit
Anda dapat menguji route API yang dilindungi dengan token Passport dalam pengujian:

```php
use Laravel\Passport\Passport;

public function test_get_user_details()
{
    Passport::actingAs(
        User::factory()->create(),
        ['read']
    );

    $response = $this->get('/api/user');

    $response->assertStatus(200);
}
```

### 📋 Testing dengan Personal Access Tokens
Anda juga dapat menguji menggunakan personal access tokens:

```php
public function test_get_user_details_with_personal_token()
{
    $user = User::factory()->create();
    $token = $user->createToken('Test Token')->accessToken;

    $response = $this->withHeaders([
        'Authorization' => 'Bearer '.$token,
        'Accept' => 'application/json',
    ])->get('/api/user');

    $response->assertStatus(200);
}
```

### 📋 Creating Test Tokens
Untuk kemudahan pengujian, Anda dapat membuat helper untuk membuat token uji:

```php
use Laravel\Passport\Passport;

protected function createUserToken($user, $scopes = [])
{
    Passport::actingAs($user, $scopes);
    
    return $user->createToken('Test Token', $scopes)->accessToken;
}
```

## 🧠 Kesimpulan

Laravel Passport menyediakan implementasi OAuth2 penuh yang kuat dan fleksibel untuk aplikasi Laravel Anda. Dengan Passport, Anda dapat dengan mudah mengeluarkan token akses untuk aplikasi klien eksternal dan melindungi route API Anda dengan autentikasi token.

### 🔑 Keuntungan Utama
- Implementasi OAuth2 penuh
- Manajemen client yang lengkap
- Personal access tokens
- Authorization scopes
- Middleware autentikasi
- Vue components untuk frontend
- Event system
- Token revocation

### ⚠️ Pertimbangan Penting
- Passport adalah package "heavyweight"
- Lebih kompleks daripada Sanctum untuk kasus penggunaan sederhana
- Membutuhkan pemahaman OAuth2
- Memerlukan manajemen client yang tepat
- Memerlukan konfigurasi yang benar

### 🚀 Best Practices
1. Gunakan password grant untuk aplikasi klien tepercaya
2. Gunakan authorization code grant untuk aplikasi klien pihak ketiga
3. Terapkan scopes untuk kontrol akses yang tepat
4. Gunakan personal access tokens untuk penggunaan API pribadi
5. Monitor dan cabut token yang tidak digunakan
6. Uji implementasi OAuth2 secara menyeluruh
7. Gunakan HTTPS untuk semua endpoint OAuth2
8. Simpan client secrets dengan aman

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Passport untuk mengimplementasikan autentikasi OAuth2 dalam aplikasi Laravel Anda.
# 🔗 Laravel Socialite

Laravel Socialite menyediakan antarmuka yang indah dan mulus untuk autentikasi dengan penyedia OAuth seperti Facebook, Twitter, LinkedIn, Google, GitHub, dan Bitbucket. Socialite mengurus hampir semua kerumitan OAuth untuk mengautentikasi pengguna.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [Routing](#routing)
5. [Autentikasi](#autentikasi)
6. [Provider yang Tersedia](#provider-yang-tersedia)
7. [Mengambil Detail Pengguna](#mengambil-detail-pengguna)
8. [Mengambil Token](#mengambil-token)
9. [Menghapus Token](#menghapus-token)
10. [Scope Tambahan](#scope-tambahan)
11. [Permintaan Parameter Tambahan](#permintaan-parameter-tambahan)
12. [Stateless Authentication](#stateless-authentication)
13. [Menambahkan Provider Kustom](#menambahkan-provider-kustom)

## 🎯 Pendahuluan

Laravel Socialite menyediakan antarmuka yang indah dan mulus untuk autentikasi dengan penyedia OAuth seperti Facebook, Twitter, LinkedIn, Google, GitHub, dan Bitbucket. Socialite mengurus hampir semua kerumitan OAuth untuk mengautentikasi pengguna.

### ✨ Fitur Utama
- Integrasi dengan berbagai provider OAuth
- Autentikasi yang mulus dan indah
- Token management
- Scope dan parameter kustom
- Stateless authentication
- Provider kustom yang dapat dikembangkan
- Event system
- Testing yang mudah

### ⚠️ Catatan Penting
Socialite hanya menyediakan fasilitas untuk autentikasi. Socialite tidak mengelola autentikasi pengguna setelah mereka masuk ke aplikasi Anda. Untuk itu, Anda perlu memasangkan Socialite dengan layanan autentikasi tradisional Laravel.

## 📦 Instalasi

### 🎯 Menginstal Socialite
Untuk memulai, instal Socialite melalui Composer:

```bash
composer require laravel/socialite
```

### 🛠️ Service Provider
Laravel Socialite secara otomatis mendaftarkan service providernya menggunakan package auto-discovery Laravel.

## ⚙️ Konfigurasi

### 📄 File Konfigurasi
Setelah menginstal Socialite, Anda perlu mengkonfigurasi kredensial untuk penyedia OAuth yang ingin Anda gunakan. Kredensial ini harus ditempatkan dalam file `config/services.php` Anda:

```php
'github' => [
    'client_id' => env('GITHUB_CLIENT_ID'),
    'client_secret' => env('GITHUB_CLIENT_SECRET'),
    'redirect' => 'http://your-callback-url',
],
```

### 🔐 Konfigurasi Environment
Tambahkan kredensial ke file `.env` Anda:

```bash
GITHUB_CLIENT_ID=your-github-app-id
GITHUB_CLIENT_SECRET=your-github-app-secret
GITHUB_REDIRECT=http://your-callback-url

FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
FACEBOOK_REDIRECT=http://your-callback-url

GOOGLE_CLIENT_ID=your-google-app-id
GOOGLE_CLIENT_SECRET=your-google-app-secret
GOOGLE_REDIRECT=http://your-callback-url

TWITTER_CLIENT_ID=your-twitter-app-id
TWITTER_CLIENT_SECRET=your-twitter-app-secret
TWITTER_REDIRECT=http://your-callback-url
```

### 📋 Konfigurasi Dasar
File `config/services.php`:

```php
<?php

return [
    // Provider lainnya...

    'github' => [
        'client_id' => env('GITHUB_CLIENT_ID'),
        'client_secret' => env('GITHUB_CLIENT_SECRET'),
        'redirect' => env('GITHUB_REDIRECT'),
    ],

    'facebook' => [
        'client_id' => env('FACEBOOK_CLIENT_ID'),
        'client_secret' => env('FACEBOOK_CLIENT_SECRET'),
        'redirect' => env('FACEBOOK_REDIRECT'),
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT'),
    ],

    'twitter' => [
        'client_id' => env('TWITTER_CLIENT_ID'),
        'client_secret' => env('TWITTER_CLIENT_SECRET'),
        'redirect' => env('TWITTER_REDIRECT'),
    ],
];
```

## 🚦 Routing

### 📋 Route untuk Redirect
Untuk mengautentikasi pengguna dengan salah satu provider, Anda perlu dua route:

1. Route untuk mengarahkan pengguna ke provider
2. Route untuk menerima callback dari provider

```php
use Laravel\Socialite\Facades\Socialite;

Route::get('/auth/redirect', function () {
    return Socialite::driver('github')->redirect();
});

Route::get('/auth/callback', function () {
    $user = Socialite::driver('github')->user();

    // $user->token
});
```

### 📋 Route dengan Controller
```php
<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    /**
     * Redirect the user to the GitHub authentication page.
     */
    public function redirectToProvider()
    {
        return Socialite::driver('github')->redirect();
    }

    /**
     * Obtain the user information from GitHub.
     */
    public function handleProviderCallback()
    {
        $user = Socialite::driver('github')->user();

        // $user->token
    }
}
```

### 📋 Route dengan Named Routes
```php
// Redirect route
Route::get('/auth/github/redirect', function () {
    return Socialite::driver('github')->redirect();
})->name('github.redirect');

// Callback route
Route::get('/auth/github/callback', function () {
    $user = Socialite::driver('github')->user();
    
    // Handle user authentication
})->name('github.callback');
```

## 🔐 Autentikasi

### 📋 Menggunakan Socialite untuk Autentikasi
Setelah pengguna dikembalikan dari provider OAuth, Anda dapat mengambil detail pengguna dan membuat/mengautentikasi mereka dalam aplikasi Anda:

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    /**
     * Redirect the user to the GitHub authentication page.
     */
    public function redirectToProvider()
    {
        return Socialite::driver('github')->redirect();
    }

    /**
     * Obtain the user information from GitHub.
     */
    public function handleProviderCallback()
    {
        try {
            $user = Socialite::driver('github')->user();
        } catch (\Exception $e) {
            return redirect('/login');
        }

        // Cek apakah pengguna sudah ada
        $existingUser = User::where('email', $user->email)->first();

        if ($existingUser) {
            Auth::login($existingUser);
        } else {
            // Buat pengguna baru
            $newUser = User::create([
                'name' => $user->name,
                'email' => $user->email,
                'github_id' => $user->id,
                'password' => bcrypt('default-password'), // atau kosongkan untuk login hanya dengan OAuth
            ]);

            Auth::login($newUser);
        }

        return redirect('/dashboard');
    }
}
```

### 📋 Menggunakan User Provider Kustom
```php
public function handleProviderCallback()
{
    $githubUser = Socialite::driver('github')->user();

    $user = User::updateOrCreate([
        'github_id' => $githubUser->id,
    ], [
        'name' => $githubUser->name,
        'email' => $githubUser->email,
        'github_token' => $githubUser->token,
        'github_refresh_token' => $githubUser->refreshToken,
    ]);

    Auth::login($user);

    return redirect('/dashboard');
}
```

### 📋 Menghindari Duplikasi Pengguna
```php
public function handleProviderCallback()
{
    $githubUser = Socialite::driver('github')->user();

    // Cek berdasarkan github_id terlebih dahulu
    $user = User::where('github_id', $githubUser->id)->first();

    if (!$user) {
        // Jika tidak ditemukan, cek berdasarkan email
        $user = User::where('email', $githubUser->email)->first();

        if (!$user) {
            // Buat pengguna baru jika tidak ditemukan
            $user = User::create([
                'name' => $githubUser->name,
                'email' => $githubUser->email,
                'github_id' => $githubUser->id,
            ]);
        } else {
            // Update github_id jika pengguna ditemukan berdasarkan email
            $user->update(['github_id' => $githubUser->id]);
        }
    }

    Auth::login($user);

    return redirect('/dashboard');
}
```

## 🌐 Provider yang Tersedia

### 📋 Provider Bawaan
Socialite saat ini mendukung autentikasi dengan beberapa provider:

- **bitbucket**
- **facebook**
- **github**
- **google**
- **linkedin**
- **twitter**

### 📋 Menggunakan Provider Tertentu
```php
// GitHub
return Socialite::driver('github')->redirect();

// Facebook
return Socialite::driver('facebook')->redirect();

// Google
return Socialite::driver('google')->redirect();

// Twitter
return Socialite::driver('twitter')->redirect();

// LinkedIn
return Socialite::driver('linkedin')->redirect();

// Bitbucket
return Socialite::driver('bitbucket')->redirect();
```

### 📋 Konfigurasi Provider Opsi
```php
// config/services.php
'github' => [
    'client_id' => env('GITHUB_CLIENT_ID'),
    'client_secret' => env('GITHUB_CLIENT_SECRET'),
    'redirect' => env('GITHUB_REDIRECT'),
],

'facebook' => [
    'client_id' => env('FACEBOOK_CLIENT_ID'),
    'client_secret' => env('FACEBOOK_CLIENT_SECRET'),
    'redirect' => env('FACEBOOK_REDIRECT'),
    'client_url' => env('FACEBOOK_CLIENT_URL'),
],

'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT'),
],
```

## 👤 Mengambil Detail Pengguna

### 📋 Informasi Pengguna Dasar
Setelah pengguna diautentikasi, Anda dapat mengakses informasi pengguna:

```php
$user = Socialite::driver('github')->user();

// Informasi pengguna yang tersedia
$id = $user->getId();
$name = $user->getName();
$email = $user->getEmail();
$avatar = $user->getAvatar();
```

### 📋 Objek Pengguna Lengkap
Objek pengguna yang dikembalikan berisi properti berikut:

```php
$user = Socialite::driver('github')->user();

// Properti dasar
$user->id;           // ID unik dari provider
$user->nickname;     // Nickname pengguna
$user->name;         // Nama lengkap pengguna
$user->email;        // Email pengguna
$user->avatar;       // URL avatar pengguna
$user->token;        // Token akses OAuth
$user->refreshToken; // Token refresh (jika tersedia)
$user->expiresIn;    // Waktu kadaluarsa token (jika tersedia)
$user->user;         // Array mentah data pengguna
```

### 📋 Mengakses Data Mentah
```php
$user = Socialite::driver('github')->user();

// Mengakses data mentah
$rawData = $user->user; // Array mentah
$specificField = $user->user['specific_field'];

// Dengan helper
$email = $user->getEmail();
$name = $user->getName();
$avatar = $user->getAvatar();
```

### 📋 Menyimpan Data Pengguna Tambahan
```php
public function handleProviderCallback()
{
    $githubUser = Socialite::driver('github')->user();

    $user = User::updateOrCreate([
        'github_id' => $githubUser->id,
    ], [
        'name' => $githubUser->name,
        'email' => $githubUser->email,
        'avatar' => $githubUser->avatar,
        'github_token' => $githubUser->token,
        'github_refresh_token' => $githubUser->refreshToken,
        'bio' => $githubUser->user['bio'] ?? null,
        'location' => $githubUser->user['location'] ?? null,
        'company' => $githubUser->user['company'] ?? null,
    ]);

    Auth::login($user);

    return redirect('/dashboard');
}
```

## 🔑 Mengambil Token

### 📋 Token Akses
Token akses adalah token yang digunakan untuk mengakses API provider:

```php
$user = Socialite::driver('github')->user();

$token = $user->token; // Token akses
$refreshToken = $user->refreshToken; // Token refresh (jika tersedia)
$expiresIn = $user->expiresIn; // Waktu kadaluarsa (jika tersedia)
```

### 📋 Menggunakan Token untuk API Calls
```php
$user = Socialite::driver('github')->user();

// Menggunakan token untuk membuat API calls
$response = Http::withToken($user->token)
    ->get('https://api.github.com/user/repos');
```

### 📋 Menyimpan Token untuk Penggunaan Nanti
```php
public function handleProviderCallback()
{
    $githubUser = Socialite::driver('github')->user();

    $user = User::updateOrCreate([
        'github_id' => $githubUser->id,
    ], [
        'name' => $githubUser->name,
        'email' => $githubUser->email,
        'github_token' => $githubUser->token,
        'github_refresh_token' => $githubUser->refreshToken,
        'github_token_expires_at' => now()->addSeconds($githubUser->expiresIn),
    ]);

    Auth::login($user);

    return redirect('/dashboard');
}
```

### 📋 Menggunakan Token yang Disimpan
```php
// Menggunakan token yang disimpan untuk API calls
$token = auth()->user()->github_token;

$response = Http::withToken($token)
    ->get('https://api.github.com/user/repos');
```

## 🗑️ Menghapus Token

### 📋 Mencabut Token
Beberapa provider memungkinkan Anda untuk mencabut token akses:

```php
// Untuk provider yang mendukung pencabutan token
Socialite::driver('github')->revokeToken($token);
```

### 📋 Menghapus Token dari Database
```php
public function disconnectAccount()
{
    $user = auth()->user();
    
    $user->update([
        'github_id' => null,
        'github_token' => null,
        'github_refresh_token' => null,
        'github_token_expires_at' => null,
    ]);

    return redirect('/settings')->with('success', 'Akun GitHub telah diputuskan.');
}
```

### 📋 Membatalkan Koneksi Provider
```php
public function disconnectProvider($provider)
{
    $user = auth()->user();
    
    $user->update([
        "{$provider}_id" => null,
        "{$provider}_token" => null,
        "{$provider}_refresh_token" => null,
        "{$provider}_token_expires_at" => null,
    ]);

    return redirect('/settings')->with('success', "Akun {$provider} telah diputuskan.");
}
```

## 🎯 Scope Tambahan

### 📋 Menambahkan Scope ke Permintaan
Scope memungkinkan Anda untuk meminta akses tambahan dari provider:

```php
return Socialite::driver('github')
    ->scopes(['read:user', 'user:email'])
    ->redirect();
```

### 📋 Scope untuk Provider Tertentu
```php
// GitHub
return Socialite::driver('github')
    ->scopes(['read:user', 'user:email', 'repo'])
    ->redirect();

// Facebook
return Socialite::driver('facebook')
    ->scopes(['email', 'public_profile'])
    ->redirect();

// Google
return Socialite::driver('google')
    ->scopes(['openid', 'profile', 'email'])
    ->redirect();
```

### 📋 Scope dengan Separator Kustom
```php
// Beberapa provider menggunakan separator yang berbeda
return Socialite::driver('provider')
    ->setScopesSeparator(',')
    ->scopes(['scope1', 'scope2'])
    ->redirect();
```

### 📋 Scope Tambahan untuk Permintaan Khusus
```php
return Socialite::driver('github')
    ->scopes([
        'read:user',
        'user:email',
        'repo',
        'delete_repo',
        'admin:org'
    ])
    ->redirect();
```

## 📦 Permintaan Parameter Tambahan

### 📋 Menambahkan Parameter ke Permintaan
Anda dapat menambahkan parameter tambahan ke permintaan autentikasi:

```php
return Socialite::driver('github')
    ->with(['hd' => 'example.com'])
    ->redirect();
```

### 📋 Parameter untuk Provider Tertentu
```php
// Google dengan domain terbatas
return Socialite::driver('google')
    ->with(['hd' => 'example.com'])
    ->redirect();

// Facebook dengan display mode
return Socialite::driver('facebook')
    ->with(['display' => 'popup'])
    ->redirect();

// Twitter dengan force login
return Socialite::driver('twitter')
    ->with(['force_login' => 'true'])
    ->redirect();
```

### 📋 Parameter Kustom untuk Permintaan
```php
return Socialite::driver('provider')
    ->with([
        'param1' => 'value1',
        'param2' => 'value2',
        'custom_param' => 'custom_value',
    ])
    ->redirect();
```

## 🌐 Stateless Authentication

### 📋 Menggunakan Stateless Authentication
Stateless authentication berguna untuk API dan aplikasi tanpa session:

```php
$user = Socialite::driver('github')->stateless()->user();
```

### 📋 Stateless dengan Route
```php
Route::get('/api/auth/github', function () {
    return Socialite::driver('github')->stateless()->redirect();
});

Route::get('/api/auth/github/callback', function () {
    $user = Socialite::driver('github')->stateless()->user();
    
    // Handle API authentication
});
```

### 📋 Stateless dalam Controller
```php
<?php

namespace App\Http\Controllers\Api;

use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function redirectToProvider()
    {
        return Socialite::driver('github')->stateless()->redirect();
    }

    public function handleProviderCallback()
    {
        $user = Socialite::driver('github')->stateless()->user();

        // Buat atau temukan pengguna
        $existingUser = User::where('github_id', $user->id)->first();

        if ($existingUser) {
            $token = $existingUser->createToken('api-token')->plainTextToken;
            return response()->json(['token' => $token]);
        }

        // Buat pengguna baru dan token
        $newUser = User::create([
            'name' => $user->name,
            'email' => $user->email,
            'github_id' => $user->id,
        ]);

        $token = $newUser->createToken('api-token')->plainTextToken;
        return response()->json(['token' => $token]);
    }
}
```

### 📋 Stateless dengan Custom Parameters
```php
$user = Socialite::driver('github')
    ->stateless()
    ->with(['custom' => 'parameter'])
    ->user();
```

## 🛠️ Menambahkan Provider Kustom

### 📋 Membuat Provider Kustom
Anda dapat membuat provider kustom dengan mengimplementasikan interface yang sesuai:

```php
<?php

namespace App\Socialite\Providers;

use Laravel\Socialite\Two\AbstractProvider;
use Laravel\Socialite\Two\ProviderInterface;
use Laravel\Socialite\Two\User;

class CustomProvider extends AbstractProvider implements ProviderInterface
{
    /**
     * The separating character for the requested scopes.
     *
     * @var string
     */
    protected $scopeSeparator = ' ';

    /**
     * The scopes being requested.
     *
     * @var array
     */
    protected $scopes = ['read:user'];

    /**
     * {@inheritdoc}
     */
    protected function getAuthUrl($state)
    {
        return $this->buildAuthUrlFromBase('https://custom-provider.com/oauth/authorize', $state);
    }

    /**
     * {@inheritdoc}
     */
    protected function getTokenUrl()
    {
        return 'https://custom-provider.com/oauth/token';
    }

    /**
     * {@inheritdoc}
     */
    protected function getUserByToken($token)
    {
        $response = $this->getHttpClient()->get('https://custom-provider.com/api/user', [
            'headers' => [
                'Authorization' => 'Bearer '.$token,
            ],
        ]);

        return json_decode($response->getBody(), true);
    }

    /**
     * {@inheritdoc}
     */
    protected function mapUserToObject(array $user)
    {
        return (new User)->setRaw($user)->map([
            'id' => $user['id'],
            'nickname' => $user['username'],
            'name' => $user['name'],
            'email' => $user['email'],
            'avatar' => $user['avatar_url'],
        ]);
    }

    /**
     * Get the POST fields for the token request.
     *
     * @param  string  $code
     * @return array
     */
    protected function getTokenFields($code)
    {
        return parent::getTokenFields($code) + ['grant_type' => 'authorization_code'];
    }
}
```

### 📋 Mendaftarkan Provider Kustom
Mendaftarkan provider kustom dalam `AppServiceProvider`:

```php
<?php

namespace App\Providers;

use App\Socialite\Providers\CustomProvider;
use Illuminate\Support\ServiceProvider;
use Laravel\Socialite\Facades\Socialite;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Socialite::extend('custom', function ($app) {
            $config = $app['config']['services.custom'];

            return Socialite::buildProvider(
                CustomProvider::class, $config
            );
        });
    }
}
```

### 📋 Konfigurasi Provider Kustom
```php
// config/services.php
'custom' => [
    'client_id' => env('CUSTOM_CLIENT_ID'),
    'client_secret' => env('CUSTOM_CLIENT_SECRET'),
    'redirect' => env('CUSTOM_REDIRECT_URI'),
],
```

### 📋 Menggunakan Provider Kustom
```php
return Socialite::driver('custom')->redirect();
```

### 📋 Provider Kustom dengan Scope
```php
return Socialite::driver('custom')
    ->scopes(['read:user', 'write:user'])
    ->redirect();
```

## 🧪 Testing

### 📋 Testing dengan Socialite
Untuk menguji aplikasi yang menggunakan Socialite:

```php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User;
use Mockery as m;
use Tests\TestCase;

class SocialiteTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_be_redirected_to_provider()
    {
        $response = $this->get('/auth/github/redirect');

        $response->assertStatus(302);
        $this->assertStringStartsWith(
            'https://github.com/login/oauth/authorize',
            $response->headers->get('Location')
        );
    }

    public function test_user_can_be_authenticated_via_provider()
    {
        $abstractUser = m::mock(User::class);
        $abstractUser->shouldReceive('getId')
            ->andReturn(1234567890);
        $abstractUser->shouldReceive('getNickname')
            ->andReturn('laravel');
        $abstractUser->shouldReceive('getName')
            ->andReturn('Laravel');
        $abstractUser->shouldReceive('getEmail')
            ->andReturn('laravel@example.com');
        $abstractUser->shouldReceive('getAvatar')
            ->andReturn('https://avatars.githubusercontent.com/u/1234567890?v=4');

        Socialite::shouldReceive('driver->user')
            ->andReturn($abstractUser);

        $response = $this->get('/auth/github/callback');

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticated();
    }
}
```

### 📋 Testing dengan Fake
```php
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User;

public function test_socialite_authentication()
{
    $user = new User();
    $user->id = 1234567890;
    $user->nickname = 'laravel';
    $user->name = 'Laravel';
    $user->email = 'laravel@example.com';
    $user->avatar = 'https://avatars.githubusercontent.com/u/1234567890?v=4';

    Socialite::fake();
    Socialite::shouldReceive('driver->user')
        ->andReturn($user);

    $response = $this->get('/auth/github/callback');

    $response->assertRedirect('/dashboard');
    $this->assertAuthenticated();
}
```

## 🧠 Kesimpulan

Laravel Socialite menyediakan cara yang indah dan mulus untuk mengintegrasikan autentikasi OAuth dengan berbagai penyedia dalam aplikasi Laravel Anda. Dengan dukungan untuk berbagai provider populer dan kemampuan untuk membuat provider kustom, Socialite memungkinkan Anda membangun pengalaman autentikasi yang kaya fitur dan aman.

### 🔑 Keuntungan Utama
- Integrasi yang mulus dengan berbagai provider OAuth
- Autentikasi yang indah dan mudah digunakan
- Token management
- Scope dan parameter kustom
- Stateless authentication
- Provider kustom yang dapat dikembangkan
- Event system
- Testing yang mudah

### 🚀 Best Practices
1. Gunakan environment variables untuk kredensial provider
2. Terapkan error handling yang tepat
3. Gunakan queue untuk operasi sinkronisasi yang berat
4. Terapkan rate limiting untuk mencegah abuse
5. Gunakan token yang disimpan dengan aman
6. Implementasikan refresh token handling
7. Gunakan scope yang sesuai dengan kebutuhan aplikasi
8. Terapkan stateless authentication untuk API
9. Uji implementasi OAuth secara menyeluruh
10. Monitor penggunaan provider secara berkala

### ⚠️ Pertimbangan Keamanan
1. Simpan token dengan aman (jangan di session biasa)
2. Gunakan HTTPS untuk semua endpoint OAuth
3. Validasi OAuth callback dengan benar
4. Terapkan rate limiting untuk mencegah brute force attacks
5. Gunakan state parameter untuk mencegah CSRF
6. Validasi redirect URLs dengan benar
7. Cabut token yang tidak digunakan
8. Gunakan scope minimal yang diperlukan
9. Terapkan logging untuk aktivitas OAuth
10. Gunakan token expiration dan refresh mechanism

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Socialite untuk mengintegrasikan autentikasi OAuth dalam aplikasi Laravel Anda.
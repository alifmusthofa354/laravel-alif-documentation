# 🔐 Enkripsi di Laravel: Panduan dari Guru Kesayanganmu (Edisi Super Aman)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Hari ini kita akan membahas salah satu topik paling penting di dunia pengembangan aplikasi: **Enkripsi**. Yups, kita akan belajar bagaimana menjaga data rahasia kita seperti token API, password, atau informasi pribadi agar tidak bisa dibaca oleh orang yang tidak berhak.

Setelah beberapa kali revisi, akhirnya Guru paham apa yang sebenarnya kalian inginkan: sebuah panduan yang **super lengkap** tapi dijelaskan dengan **super sederhana**, seolah-olah Guru sedang duduk di sebelahmu sambil menjelaskan pelan-pelan.

Siap untuk belajar tentang keamanan digital? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Sih Enkripsi Itu Sebenarnya?

**Analogi:** Bayangkan kamu punya buku harian pribadi yang berisi rahasia-rahasia penting. Kamu nggak mau kan buku itu dibaca orang lain? Nah, kamu bisa simpan buku itu di dalam brankas (enkripsi). Hanya kamu yang punya kuncinya, jadi hanya kamu yang bisa membukanya.

**Mengapa ini penting?** Karena di dunia digital, kita sering menyimpan data sensitif seperti password, token API, atau informasi pribadi. Tanpa enkripsi, data itu bisa dicuri dan dibaca oleh hacker. 😵

**Bagaimana cara kerjanya?** Laravel menyediakan enkripsi yang sederhana dan aman melalui **OpenSSL** dengan algoritma **AES-256** dan **AES-128**. Setiap data yang dienkripsi akan dilindungi dengan **Message Authentication Code (MAC)** sehingga tidak bisa dimodifikasi atau dipalsukan setelah dienkripsi.

Jadi, alur keamanan data kita menjadi:

`➡️ Data Asli -> 🔐 Enkripsi -> Data Terlindungi -> 🔓 Dekripsi -> Data Asli`

Tanpa enkripsi, data sensitif kita seperti buku harian terbuka yang bisa dibaca semua orang. 😱

### 2. ✍️ Resep Pertamamu: Enkripsi String Sederhana

Ini adalah fondasi paling dasar. Mari kita coba enkripsi dan dekripsi sebuah string dari nol, langkah demi langkah.

#### Langkah 1️⃣: Siapkan Kunci Brankas (APP_KEY)
**Mengapa?** Setiap enkripsi butuh kunci rahasia agar hanya orang yang berhak bisa membaca data.

**Bagaimana?** Buka terminal dan jalankan mantra Artisan:
```bash
php artisan key:generate
```

Guru tahu kamu butuh penjelasan. Ini akan menghasilkan kunci unik seperti ini di file `.env`:
```
APP_KEY=base64:J63qRTDLub5NuZvP+kb8YIorGS6qFYHKVo6u7179stY=
```

**Penjelasan:**
- `APP_KEY` adalah kunci utama untuk semua proses enkripsi dan dekripsi
- Jangan pernah membagikan kunci ini ke orang lain
- Ini seperti kunci brankasmu sendiri!

#### Langkah 2️⃣: Enkripsi Data Pertamamu
**Mengapa?** Kita butuh melihat magic bagaimana data bisa diubah menjadi "kata sandi".

**Bagaimana?** Gunakan facade `Crypt` di Laravel:
```php
<?php

use Illuminate\Support\Facades\Crypt;

// Enkripsi sebuah string
$encrypted = Crypt::encryptString('rahasia-rahasianya-si-murid');

// String aslinya sekarang jadi seperti ini (contoh):
// gAAAAABb...[string acak yang tidak bisa dibaca]
```

**Penjelasan Kode:**
- `Crypt::encryptString()` mengambil string biasa dan mengubahnya menjadi data terenkripsi
- Hasilnya adalah string yang tidak bisa dimengerti, seperti "kata sandi rahasia"

#### Langkah 3️⃣: Dekripsi Data Terenkripsimu
**Mengapa?** Kita butuh cara untuk membaca kembali data yang sudah dienkripsi.

**Bagaimana?** Gunakan metode `decryptString`:
```php
<?php

use Illuminate\Support\Facades\Crypt;

try {
    $decrypted = Crypt::decryptString($encrypted);
    echo $decrypted; // Output: rahasia-rahasianya-si-murid
} catch (Illuminate\Contracts\Encryption\DecryptException $e) {
    // Tangani error jika data tidak bisa didekripsi
    echo 'Maaf, data tidak bisa dibuka!';
}
```

**Penjelasan Kode:**
- `Crypt::decryptString()` mengembalikan data terenkripsi ke bentuk aslinya
- Kita perlu `try-catch` karena jika data rusak atau kunci salah, Laravel akan memberi error

Selesai! 🎉 Sekarang, kamu punya kemampuan dasar untuk mengamankan data dengan enkripsi.

### 3. ⚡ Enkripsi Spesialis (Dengan Model)

**Analogi:** Bayangkan kamu punya murid yang sangat istimewa dan kamu ingin menjaga semua catatan pribadinya dengan sangat aman.

**Mengapa ini ada?** Untuk menyimpan data sensitif langsung ke dalam model (database) tanpa harus manual mengenkripsi setiap saat.

**Bagaimana?** Gunakan mutator dan accessor di modelmu:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class User extends Model
{
    // Otomatis mengenkripsi saat menyimpan
    public function setApiKeyAttribute($value)
    {
        $this->attributes['api_key'] = Crypt::encryptString($value);
    }

    // Otomatis mendekripsi saat mengakses
    public function getApiKeyAttribute($value)
    {
        return Crypt::decryptString($value);
    }
}
```

---

## Bagian 2: Rotasi Kunci Enkripsi - Ganti Gembok Brankasmu 🤖

### 4. 📦 Apa Itu Rotasi Enkripsi?

**Analogi:** Bayangkan kamu punya brankas di rumah, dan kamu ingin ganti gemboknya setiap 6 bulan untuk keamanan. Tapi kamu nggak ingin semua barang di dalamnya jadi tidak bisa diakses, kan?

**Mengapa ini keren?** Karena kadang kita perlu mengganti kunci enkripsi kita untuk alasan keamanan (seperti ganti password). Tapi data lama yang sudah dienkripsi dengan kunci lama tetap harus bisa dibaca.

**Bagaimana?** Laravel menyediakan fitur `APP_PREVIOUS_KEYS` untuk menyimpan kunci lama.

### 5. 🛠️ Rotasi Kunci dengan Kekuatan Tambahan

> **✨ Tips dari Guru:** Ini seperti punya kunci cadangan! Wajib dipakai untuk keamanan tingkat tinggi!

*   **Menyimpan Kunci Lama**: Kamu bisa menyimpan kunci lama di variabel `APP_PREVIOUS_KEYS` di file `.env`.
    ```env
    APP_KEY="base64:J63qRTDLub5NuZvP+kb8YIorGS6qFYHKVo6u7179stY="
    APP_PREVIOUS_KEYS="base64:2nLsGFGzyoae2ax3EF2Lyq/hH6QghBGLIq5uL+Gp8/w="
    ```

*   **Cara Kerja**: 
    - `APP_KEY` selalu digunakan untuk enkripsi data baru
    - `APP_PREVIOUS_KEYS` digunakan hanya saat dekripsi jika `APP_KEY` gagal

### 6. 🧩 Memilih Strategi Rotasi (Partial & Multiple Keys)

*   **Memilih Waktu Rotasi**: Kamu bisa bilang, "Saya mau ganti kunci setiap 3 bulan" atau "Saya mau ganti setiap kali ada incident keamanan".
*   **Menyimpan Banyak Kunci**: Gunakan `APP_PREVIOUS_KEYS` untuk menyimpan lebih dari satu kunci lama.

**Contoh Lengkap Rotasi Kunci:**

1. **Membuat Kunci Baru:**
```bash
php artisan key:generate
# Ini akan mengganti APP_KEY di .env
```

2. **Menyimpan Kunci Lama:**
```env
# Sebelum mengganti, simpan kunci lama ke APP_PREVIOUS_KEYS
APP_KEY="base64:J63qRTDLub5NuZvP+kb8YIorGS6qFYHKVo6u7179stY="  # kunci baru
APP_PREVIOUS_KEYS="base64:2nLsGFGzyoae2ax3EF2Lyq/hH6QghBGLIq5uL+Gp8/w="  # kunci lama
```

3. **Efek Rotasi:**
- Data baru akan dienkripsi dengan `APP_KEY` yang baru
- Data lama masih bisa didekripsi dengan `APP_PREVIOUS_KEYS`
- User tidak perlu login ulang (kecuali untuk session yang terenkripsi)

### 7. 🌐 API dan Enkripsi (Menggunakan dalam Endpoint)

**Mengapa?** Saat membuat API untuk aplikasi mobile atau frontend, kita tetap butuh menyimpan data sensitif secara aman.

**Bagaimana?** Gunakan enkripsi dalam controller API:

1. **Contoh API Controller dengan Enkripsi:**
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Crypt;

class ApiController extends Controller
{
    /**
     * Simpan token API dengan aman
     */
    public function storeToken(Request $request): JsonResponse
    {
        $request->validate([
            'api_token' => 'required|string|max:255',
        ]);

        $user = $request->user();

        // Enkripsi token sebelum disimpan
        $user->update([
            'encrypted_token' => Crypt::encryptString($request->api_token)
        ]);

        return response()->json([
            'message' => 'Token disimpan dengan aman'
        ]);
    }

    /**
     * Ambil token yang terenkripsi
     */
    public function getToken(): JsonResponse
    {
        $user = auth()->user();
        
        if (!$user->encrypted_token) {
            return response()->json(['error' => 'Tidak ada token'], 404);
        }

        // Dekripsi token sebelum dikembalikan
        $decryptedToken = Crypt::decryptString($user->encrypted_token);

        return response()->json([
            'token' => $decryptedToken
        ]);
    }
}
```

2. **Route API:**
```php
// routes/api.php
use App\Http\Controllers\Api\ApiController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/token', [ApiController::class, 'storeToken']);
    Route::get('/token', [ApiController::class, 'getToken']);
});
```

Perhatikan bahwa kita tetap menjaga keamanan sambil menyediakan data dalam format JSON untuk aplikasi frontend.

---

## Bagian 3: Jurus Tingkat Lanjut - Enkripsi dengan Model & Database 🚀

### 8. 👨‍👩‍👧 Enkripsi dalam Model (Eloquent Attribute Casting)

**Analogi:** Bayangkan kamu punya kotak ajaib yang secara otomatis mengenkripsi semua barang yang dimasukkan dan mendekripsi saat diambil. Itulah yang bisa dilakukan oleh Laravel dengan model casting!

**Mengapa?** Agar tidak perlu manual mengenkripsi dan mendekripsi di controller. Laravel akan otomatis melakukannya.

**Bagaimana?** Gunakan `encrypted` casting di model:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $casts = [
        'api_token' => 'encrypted',
        'private_key' => 'encrypted',
        'personal_secret' => 'encrypted',
    ];
}
```

**Contoh Lengkap Eloquent Attribute Casting:**

1. **Model dengan Encrypted Casting:**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'email', 'api_token', 'private_key', 'personal_secret'
    ];

    protected $casts = [
        'api_token' => 'encrypted',      // Otomatis enkripsi/deskripsi
        'private_key' => 'encrypted',    // Otomatis enkripsi/deskripsi  
        'personal_secret' => 'encrypted',// Otomatis enkripsi/deskripsi
        'email_verified_at' => 'datetime',
    ];
}
```

2. **Penggunaan dalam Controller:**
```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class UserController extends Controller
{
    // Simpan data terenkripsi secara otomatis
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'api_token' => 'required|string|max:255', // Ini akan otomatis terenkripsi
            'private_key' => 'required|string|max:255', // Ini juga otomatis terenkripsi
        ]);

        User::create($validated);

        return redirect()->route('users.index')
            ->with('status', 'User berhasil ditambahkan dan data sensitif terlindungi!');
    }

    // Akses data terdekripsi secara otomatis
    public function show(User $user): View
    {
        // $user->api_token otomatis terdekripsi saat diakses
        $token = $user->api_token;
        
        return view('users.show', compact('user', 'token'));
    }

    // Update data terenkripsi
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'api_token' => 'sometimes|string|max:255', // Ini akan otomatis terenkripsi
            'private_key' => 'sometimes|string|max:255', // Ini juga otomatis terenkripsi
        ]);

        $user->update($validated);

        return redirect()->route('users.show', $user)
            ->with('status', 'Data pengguna diperbarui dan tetap terlindungi!');
    }
}
```

3. **Route:**
```php
// routes/web.php
use App\Http\Controllers\UserController;

Route::resource('users', UserController::class)->middleware('auth');
```

Dengan encrypted casting, kamu tidak perlu khawatir tentang proses enkripsi/deskripsi manual. Laravel akan menanganinya untukmu secara otomatis.
*   **Custom Encrypted Casting**: Kamu juga bisa membuat casting sendiri untuk kasus khusus.
    ```php
    // app/Casts/EncryptedToken.php
    namespace App\Casts;

    use Illuminate\Contracts\Encryption\DecryptException;
    use Illuminate\Support\Facades\Crypt;
    use Illuminate\Database\Eloquent\Casts\Attribute;

    class EncryptedToken
    {
        public function get($value): ?string
        {
            if ($value === null) {
                return null;
            }

            try {
                return Crypt::decryptString($value);
            } catch (DecryptException $e) {
                return null;
            }
        }

        public function set($value): string
        {
            if ($value === null) {
                return null;
            }
            
            return Crypt::encryptString($value);
        }
    }
    ```

**Contoh Implementasi Custom Casting:**

1. **Gunakan Custom Casting di Model:**
```php
<?php

namespace App\Models;

use App\Casts\EncryptedToken;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    protected $casts = [
        'card_number' => EncryptedToken::class,
        'cvv' => EncryptedToken::class, 
        'expiry_date' => EncryptedToken::class,
    ];
}
```

### 9. 👤 Enkripsi Data Pribadi (Personal Data Protection)

**Analogi:** Ini untuk data pribadi yang sangat sensitif seperti data keuangan atau kesehatan - seperti brankas dalam brankas.

**Mengapa?** Agar data paling sensitif dilindungi dengan lapisan keamanan ekstra.

**Bagaimana?** Gunakan kombinasi encrypted casting dan kebijakan akses ketat:
```php
// Di model yang menyimpan data sangat sensitif
class FinancialRecord extends Model
{
    protected $casts = [
        'bank_account' => 'encrypted',
        'credit_card' => 'encrypted', 
        'tax_id' => 'encrypted',
    ];
}
```

**Contoh Lengkap untuk Data Pribadi:**

1. **Buat Model untuk Data Sensitif:**
```bash
php artisan make:model FinancialRecord
```

2. **Model dengan Enkripsi Penuh:**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FinancialRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'bank_account', 'credit_card', 'tax_id', 'balance'
    ];

    protected $casts = [
        'bank_account' => 'encrypted',    // Otomatis terenkripsi
        'credit_card' => 'encrypted',     // Otomatis terenkripsi
        'tax_id' => 'encrypted',          // Otomatis terenkripsi
        'balance' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

3. **Controller untuk Data Finansial:**
```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\FinancialRecord;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class FinancialRecordController extends Controller
{
    public function show(User $user): View
    {
        // Data otomatis terdekripsi saat diakses
        $financialRecord = $user->financialRecord()->first();
        return view('financial.show', compact('user', 'financialRecord'));
    }

    public function store(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'bank_account' => 'required|string|max:50',
            'credit_card' => 'required|string|max:16',
            'tax_id' => 'required|string|max:20',
            'balance' => 'required|numeric|min:0',
        ]);

        $user->financialRecord()->create([
            'bank_account' => $validated['bank_account'], // Otomatis terenkripsi
            'credit_card' => $validated['credit_card'],   // Otomatis terenkripsi
            'tax_id' => $validated['tax_id'],             // Otomatis terenkripsi
            'balance' => $validated['balance'],
        ]);

        return redirect()->route('users.show', $user)
            ->with('status', 'Data finansial berhasil disimpan dengan aman!');
    }

    public function update(Request $request, FinancialRecord $record): RedirectResponse
    {
        $validated = $request->validate([
            'bank_account' => 'sometimes|string|max:50',
            'credit_card' => 'sometimes|string|max:16', 
            'tax_id' => 'sometimes|string|max:20',
            'balance' => 'sometimes|numeric|min:0',
        ]);

        $record->update($validated);

        return redirect()->route('users.show', $record->user)
            ->with('status', 'Data finansial diperbarui dan tetap terlindungi!');
    }
}
```

### 10. 🎨 Mendekorasi Perlindungan Data-mu (Kustomisasi Enkripsi)

Kamu bisa mendekorasi perlindungan data sesukamu:

*   **Mengganti Algoritma Enkripsi**: 
    ```php
    // Di config/encrypt.php
    'cipher' => 'AES-256-CBC',  // atau 'AES-128-CBC'
    ```

*   **Mengganti Kunci untuk Kasus Tertentu**: 
    ```php
    use Illuminate\Support\Facades\Crypt;
    
    // Gunakan kunci yang berbeda untuk data sensitif tertentu
    $customKey = config('custom_sensitive_data_key');
    $encrypted = Crypt::usingKey($customKey)->encryptString($data);
    ```

*   **Mengganti Tingkat Keamanan**: 
    ```php
    // Gunakan AES-256 untuk data super sensitif
    $encrypted = Crypt::driver('openssl')
        ->usingKey(config('app.key'))
        ->encryptString($data);
    ```

*   **Mengubah Bahasa di Log Error (Jika Perlu)**:
    ```php
    // Jika kamu butuh log error dalam bahasa Indonesia
    try {
        $decrypted = Crypt::decryptString($encryptedData);
    } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
        \Log::error('Gagal mendekripsi data sensitif: ' . $e->getMessage());
        return 'Data tidak bisa dibuka - mungkin kunci salah';
    }
    ```

*   **Jika Enkripsi Gagal (Missing Data Handler)**:
    ```php
    use Illuminate\Support\Facades\Crypt;

    $encryptedData = $user->sensitive_data;
    if ($encryptedData) {
        try {
            $decrypted = Crypt::decryptString($encryptedData);
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            \Log::warning('Data tidak bisa didekripsi, mungkin kunci berubah');
            $decrypted = null;
        }
    } else {
        $decrypted = null;
    }
    ```

**Contoh Lengkap Kustomisasi Enkripsi:**
```php
// config/encryption.php
return [
    'default' => 'openssl',
    
    'drivers' => [
        'openssl' => [
            'cipher' => env('ENCRYPTION_CIPHER', 'AES-256-CBC'),
            'key' => env('APP_KEY'),
        ],
    ],
    
    'keys' => [
        'sensitive_data' => env('SENSITIVE_DATA_KEY', null),
        'user_tokens' => env('USER_TOKENS_KEY', null),
    ]
];

// Di service class
class DataProtectionService
{
    public function encryptSensitiveData(string $data, string $type = 'default'): string
    {
        $key = config("encryption.keys.{$type}") ?? config('app.key');
        
        return Crypt::usingKey($key)->encryptString($data);
    }
    
    public function decryptSensitiveData(string $data, string $type = 'default'): string
    {
        $key = config("encryption.keys.{$type}") ?? config('app.key');
        
        try {
            return Crypt::usingKey($key)->decryptString($data);
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            throw new \Exception("Gagal mendekripsi data {$type}: " . $e->getMessage());
        }
    }
}
```

### 10.5 🔐 Middleware untuk Perlindungan Enkripsi

Kamu juga bisa menambahkan middleware untuk memastikan hanya data yang benar-benar terenkripsi yang bisa diakses:

*   **Middleware untuk Akses Data Terenkripsi**:
    ```php
    php artisan make:middleware EnsureEncryptedDataAccess
    
    // app/Http/Middleware/EnsureEncryptedDataAccess.php
    namespace App\Http\Middleware;
    
    use Closure;
    use Illuminate\Http\Request;
    
    class EnsureEncryptedDataAccess
    {
        public function handle(Request $request, Closure $next)
        {
            // Pastikan user memiliki izin untuk mengakses data terenkripsi
            if (!auth()->user()->canAccessEncryptedData()) {
                abort(403, 'Akses ke data terenkripsi tidak diizinkan.');
            }
    
            return $next($request);
        }
    }
    ```

*   **Menggunakan Middleware di Controller**:
    ```php
    class SensitiveDataController extends Controller implements HasMiddleware
    {
        public static function middleware(): array
        {
            return [
                'auth',
                new Middleware('verified', only: ['show', 'download']),
                new Middleware('ensure-encrypted-data-access', except: ['index']),
            ];
        }
    }
    ```

### 11. 🗑️ Menangani Data Lama (Rotasi dengan Soft Deletion Pada Enkripsi)

**Mengapa?** Terkadang kita tidak mau data terenkripsi benar-benar hilang, hanya disembunyikan. Kita bisa menggunakan rotasi kunci untuk "mengarsipkan" data lama.

**Bagaimana?**
*   **Arsip Kunci Lama**: `APP_PREVIOUS_KEYS` akan menyimpan kunci-kunci yang digunakan sebelumnya.
*   **Mengarsipkan Data**: Data yang sudah dienkripsi dengan kunci lama tetap bisa dibaca dengan kunci lama.

**Contoh Lengkap dengan Rotasi dan Arsip:**

1. **Aktifkan Rotasi Kunci di Environment:**
```env
APP_KEY=base64:J63qRTDLub5NuZvP+kb8YIorGS6qFYHKVo6u7179stY=
APP_PREVIOUS_KEYS=base64:2nLsGFGzyoae2ax3EF2Lyq/hH6QghBGLIq5uL+Gp8/w=,base64:abc123def456ghi789=
```

2. **Service untuk Manajemen Kunci:**
```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;

class EncryptionKeyRotationService
{
    public function decryptWithCurrentOrPreviousKeys(string $encryptedData): string
    {
        // Coba dengan kunci utama dulu
        try {
            return Crypt::decryptString($encryptedData);
        } catch (DecryptException $e) {
            // Jika gagal, coba dengan kunci-kunci sebelumnya
            $previousKeys = config('app.previous_keys');
            
            if ($previousKeys) {
                $keys = is_string($previousKeys) ? explode(',', $previousKeys) : $previousKeys;
                
                foreach ($keys as $key) {
                    $key = trim($key);
                    try {
                        return Crypt::usingKey($key)->decryptString($encryptedData);
                    } catch (DecryptException $e2) {
                        continue; // Coba kunci berikutnya
                    }
                }
            }
            
            // Jika semua gagal, lempar exception
            throw $e;
        }
    }
}
```

3. **Controller dengan Rotasi Kunci:**
```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\EncryptionKeyRotationService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class SecureDataController extends Controller
{
    public function __construct(
        protected EncryptionKeyRotationService $keyRotationService
    ) {}

    public function showData(Request $request, string $id): View
    {
        $data = collect([
            'sensitive_value' => 'gAAAAABb...[data terenkripsi]',
        ]);
        
        try {
            $decryptedValue = $this->keyRotationService->decryptWithCurrentOrPreviousKeys(
                $data['sensitive_value']
            );
            
            return view('secure.show', [
                'decryptedValue' => $decryptedValue
            ]);
        } catch (\Exception $e) {
            return view('secure.show', [
                'decryptedValue' => 'Data tidak bisa dibuka - mungkin kunci telah berubah'
            ]);
        }
    }
}
```

4. **Route tambahan untuk fitur rotasi:**
```php
// routes/web.php
use App\Http\Controllers\SecureDataController;

Route::resource('secure-data', SecureDataController::class)->middleware('auth');

// Route untuk pengelolaan kunci
Route::get('/encryption/keys', [SecureDataController::class, 'manageKeys'])
    ->name('encryption.manageKeys')
    ->middleware('role:admin');
```

**Route untuk Manajemen Kunci:**
- `GET /encryption/keys` → `manageKeys()` - Tampilkan manajemen kunci enkripsi

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Enkripsi 🧰

### 12. 🔐 Middleware di Model dan Service (Penjaga Super Aman)

**Mengapa?** Terkadang, semua akses ke data terenkripsi butuh penjagaan tambahan. Menaruhnya di service class lebih fleksibel daripada menuliskannya di setiap route.

**Bagaimana?**
*   **Cara Modern (👍 Rekomendasi)**: Service class dengan logika keamanan yang rumit.
    ```php
    use App\Services\DataProtectionService;

    class SecureDataController extends Controller
    {
        public function __construct(
            protected DataProtectionService $protection
        ) {}

        public function store(Request $request)
        {
            // Menggunakan service yang aman untuk enkripsi
            $encrypted = $this->protection->encrypt($request->sensitive_data);
        }
    }
    ```

*   **Cara Otorisasi Lanjutan**: Kombinasikan dengan policy untuk kontrol akses yang kompleks.
    ```php
    public function show(SecureData $data)
    {
        // Cek apakah user bisa mengakses data terenkripsi ini
        $this->authorize('accessEncrypted', $data);
        
        $decrypted = Crypt::decryptString($data->encrypted_value);
    }
    ```

### 13. 💉 Dependency Injection (Asisten Pribadi Ajaib)

**Prinsipnya: Jangan buat sendiri, minta saja!** Butuh layanan enkripsi canggih? Tulis di parameter constructor atau method, dan Laravel akan memberikannya untukmu.

**Mengapa?** Ini membuat kodemu sangat fleksibel, mudah di-test, dan tidak terikat pada satu cara pembuatan objek.

**Bagaimana?**
*   **Service Injection**: Meminta "layanan keamanan" yang akan digunakan di banyak method.
    ```php
    use App\Services\AdvancedEncryptionService;
    public function __construct(protected AdvancedEncryptionService $encryption) {}
    ```

*   **Request Injection**: Meminta `Request` untuk validasi dan akses data.
    ```php
    public function store(Request $request) { /* ... */ }
    ```

**Contoh Lengkap Dependency Injection:**

1. **Membuat Service Enkripsi Canggih:**
```php
<?php
// app/Services/AdvancedEncryptionService.php

namespace App\Services;

use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;

class AdvancedEncryptionService
{
    public function encryptSensitiveData(array $data, string $keyType = 'default'): array
    {
        $encryptedData = [];
        foreach ($data as $key => $value) {
            $encryptedData[$key] = [
                'value' => Crypt::encryptString($value),
                'timestamp' => now()->toISOString(),
                'key_type' => $keyType,
            ];
        }
        
        return $encryptedData;
    }

    public function decryptSensitiveData(array $encryptedData): array
    {
        $decryptedData = [];
        foreach ($encryptedData as $key => $item) {
            try {
                $decryptedData[$key] = Crypt::decryptString($item['value']);
            } catch (DecryptException $e) {
                \Log::warning("Gagal mendekripsi data {$key}: " . $e->getMessage());
                $decryptedData[$key] = null;
            }
        }
        
        return $decryptedData;
    }

    public function updateEncryptionKey(string $oldData, string $newKeyType): string
    {
        // Dekripsi dengan kunci lama
        $decrypted = Crypt::decryptString($oldData);
        
        // Enkripsi dengan kunci baru
        return Crypt::encryptString($decrypted);
    }
}
```

2. **Controller dengan Constructor Injection:**
```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\AdvancedEncryptionService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class SecureController extends Controller
{
    // Constructor injection - service akan di-inject ke semua method
    public function __construct(
        protected AdvancedEncryptionService $encryptionService
    ) {}

    public function index(): View
    {
        $users = User::select('id', 'name', 'email', 'created_at')
                    ->latest()
                    ->paginate(10);
        return view('secure.index', compact('users'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'sensitive_data' => 'required|array',
            'sensitive_data.token' => 'required|string',
            'sensitive_data.api_key' => 'required|string',
        ]);

        // Gunakan service yang sudah di-inject untuk enkripsi
        $encryptedData = $this->encryptionService->encryptSensitiveData(
            $validated['sensitive_data'],
            'api_credentials'
        );

        // Simpan ke database atau tempat lainnya
        $user = $request->user();
        $user->update([
            'encrypted_credentials' => json_encode($encryptedData)
        ]);

        return redirect()->route('secure.index')
            ->with('status', 'Data sensitif disimpan dengan aman!');
    }

    public function show(Request $request, int $id): View
    {
        $user = User::findOrFail($id);
        
        if (!$user->encrypted_credentials) {
            return view('secure.show', [
                'user' => $user,
                'decrypted' => []
            ]);
        }

        $encryptedData = json_decode($user->encrypted_credentials, true);
        
        // Gunakan service untuk dekripsi
        $decrypted = $this->encryptionService->decryptSensitiveData($encryptedData);

        return view('secure.show', compact('user', 'decrypted'));
    }

    public function rotateKey(Request $request, int $id): RedirectResponse
    {
        $user = User::findOrFail($id);
        
        if ($user->encrypted_credentials) {
            $oldData = $user->encrypted_credentials;
            
            // Update enkripsi dengan kunci baru
            $newData = $this->encryptionService->updateEncryptionKey(
                $oldData, 
                'updated_key'
            );
            
            $user->update([
                'encrypted_credentials' => $newData
            ]);
        }

        return redirect()->route('secure.show', $user)
            ->with('status', 'Kunci enkripsi diperbarui dengan aman!');
    }
}
```

3. **Form Request Class (untuk validasi data sensitif):**
```php
<?php
// app/Http/Requests/StoreSecureDataRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSecureDataRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Pastikan user bisa menyimpan data sensitif
        return auth()->check() && auth()->user()->canStoreSecureData();
    }

    public function rules(): array
    {
        return [
            'sensitive_data' => 'required|array',
            'sensitive_data.token' => 'required|string|max:255',
            'sensitive_data.api_key' => 'required|string|max:255',
            'sensitive_data.private_key' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'sensitive_data.required' => 'Data sensitif harus disediakan.',
            'sensitive_data.token.required' => 'Token harus disediakan.',
            'sensitive_data.api_key.required' => 'API Key harus disediakan.',
        ];
    }
}
```

Dependency Injection membuat kode kamu:
- **Lebih modular**: Setiap class punya tanggung jawab sendiri
- **Lebih mudah di-test**: Kamu bisa mock dependencies saat testing
- **Lebih fleksibel**: Mudah untuk mengganti implementasi service
- **Lebih bersih**: Controller tidak kotor dengan pembuatan objek manual

### 13.5 🏗️ Constructor dan Method Injection Detail

Ada beberapa pendekatan untuk dependency injection di controller:

**1. Constructor Injection dengan Visibility Modifiers:**
```php
class SecureController extends Controller
{
    // Protected akan membuat property bisa diakses dari class ini dan child class
    public function __construct(protected AdvancedEncryptionService $encryptionService) {}
    
    // Atau bisa juga dengan property promotion lebih eksplisit:
    public function __construct(
        protected AdvancedEncryptionService $encryptionService,
        protected AuthService $authService
    ) {}
}
```

**2. Method Injection untuk Request Spesifik:**
```php
public function store(StoreSecureDataRequest $request) 
{
    // StoreSecureDataRequest adalah kelas Form Request yang berisi aturan validasi
    $validated = $request->validated();
    // ...
}

public function update(Request $request, int $id) 
{
    // Request otomatis di-inject
}
```

### 14. 👮 Autorisasi (Kartu Akses Ajaib)

**Mengapa?** Untuk memastikan hanya orang yang berhak yang bisa mengakses data terenkripsi.

**Bagaimana?** Helper `authorize` ini seperti men-scan kartu akses. Laravel akan otomatis mengecek ke "sistem keamanan" (**Policy** class) apakah kartumu (user-mu) punya izin.

```php
public function show(SecureData $data)
{
    $this->authorize('viewEncrypted', $data); // Pindai kartu akses!
    // Jika diizinkan, lanjutkan...
    
    $decrypted = Crypt::decryptString($data->encrypted_value);
}
```

**Contoh Lengkap Otorisasi:**

1. **Buat Policy:**
```bash
php artisan make:policy SecureDataPolicy
```

2. **Isi Policy:**
```php
<?php
// app/Policies/SecureDataPolicy.php

namespace App\Policies;

use App\Models\User;
use App\Models\SecureData;

class SecureDataPolicy
{
    public function viewEncrypted(User $user, SecureData $data): bool
    {
        return $user->id === $data->user_id || $user->hasRole('admin');
    }
    
    public function updateEncrypted(User $user, SecureData $data): bool
    {
        return $user->id === $data->user_id || $user->hasRole('admin');
    }
    
    public function deleteEncrypted(User $user, SecureData $data): bool
    {
        return $user->id === $data->user_id || $user->hasRole('admin');
    }
}
```

3. **Gunakan di Controller:**
```php
class SecureDataController extends Controller
{
    public function show(SecureData $data)
    {
        $this->authorize('viewEncrypted', $data);
        $decryptedValue = Crypt::decryptString($data->encrypted_value);
        return view('secure.show', compact('data', 'decryptedValue'));
    }
    
    public function destroy(SecureData $data)
    {
        $this->authorize('deleteEncrypted', $data);
        $data->delete();
        
        return redirect()->route('secure.index')
            ->with('status', 'Data terenkripsi dihapus dengan aman');
    }
}
```

---

## Bagian 5: Menjadi Master Enkripsi 🏆

### 15. ✨ Wejangan dari Guru

1.  **Lindungi Kuncimu seperti Harta Karun**: `APP_KEY` adalah harta paling berhargamu. Jangan pernah menyimpannya di tempat publik atau git repository.
2.  **Gunakan Casting untuk Kemudahan**: Gunakan `encrypted` casting di model untuk otomatisasi enkripsi/deskripsi.
3.  **Validasi itu Wajib!**: Pastikan data yang akan dienkripsi memang valid dan aman.
4.  **Rotasi Kunci Secara Berkala**: Seperti ganti password, ganti `APP_KEY` secara berkala untuk keamanan tingkat tinggi.
5.  **Gunakan Policy untuk Kontrol Akses**: Kombinasikan enkripsi dengan otorisasi untuk lapisan keamanan ekstra.

### 16. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur enkripsi di Laravel:

#### 🔐 Enkripsi Dasar
| Perintah | Fungsi |
|----------|--------|
| `Crypt::encryptString($data)` | Enkripsi string |
| `Crypt::decryptString($encrypted)` | Dekripsi string |
| `php artisan key:generate` | Generate APP_KEY baru |

#### 🎯 Konfigurasi Enkripsi
| Konfigurasi | Fungsi |
|----------|--------|
| `APP_KEY` di `.env` | Kunci utama enkripsi |
| `APP_PREVIOUS_KEYS` di `.env` | Kunci lama untuk rotasi |
| `'cipher' => 'AES-256-CBC'` di config | Algoritma enkripsi |

#### 🧩 Model Casting
| Casting | Fungsi |
|----------|--------|
| `'api_token' => 'encrypted'` | Otomatis enkripsi/dekripsi kolom |
| `'sensitive_data' => 'encrypted:array'` | Enkripsi array data |

#### 🔧 Rotasi Kunci
| Perintah | Fungsi |
|----------|--------|
| `APP_KEY="baru" APP_PREVIOUS_KEYS="lama"` | Ganti kunci sambil simpan lama |
| `Crypt::usingKey($customKey)` | Gunakan kunci custom |

#### 🛡️ Otorisasi
| Perintah | Fungsi |
|----------|--------|
| `$this->authorize('viewEncrypted', $data)` | Cek izin akses data terenkripsi |
| `return $user->id === $data->user_id` | Aturan dalam policy |

#### 🧰 Service dan Tools
| Tool | Fungsi |
|------|--------|
| `AdvancedEncryptionService` | Service untuk enkripsi kompleks |
| `StoreSecureDataRequest` | Validasi data sebelum enkripsi |
| `EnsureEncryptedDataAccess` | Middleware untuk akses data terenkripsi |

### 17. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi Enkripsi, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Ingat, Enkripsi adalah pelindung utama dari data sensitif. Menguasainya berarti kamu sudah siap membangun aplikasi Laravel yang **aman**, **terlindungi**, dan **siap produksi**.

Jangan pernah berhenti belajar dan menjaga keamanan data. Perlakukan kunci enkripsimu seperti harta karun paling berhargamu! Selamat ngoding, murid kesayanganku!

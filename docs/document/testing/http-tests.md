# 🧪 HTTP Tests di Laravel: Panduan dari Guru Kesayanganmu (Edisi Super Lengkap)

Hai murid-murid kesayanganku! Selamat datang kembali di kelas Laravel. Setelah beberapa kali revisi, akhirnya Guru paham apa yang sebenarnya kalian inginkan: sebuah panduan yang **super lengkap** tapi dijelaskan dengan **super sederhana**, seolah-olah Guru sedang duduk di sebelahmu sambil menjelaskan pelan-pelan.

Di edisi ini, kita akan kupas tuntas **semua detail** tentang HTTP Tests, tapi setiap topik akan Guru ajarkan dengan sabar. Siap? Ayo kita mulai petualangan ini, sekali lagi, dengan lebih baik!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基 礎

### 1. 📖 Apa Sih HTTP Tests Itu Sebenarnya?

**Analogi:** Bayangkan kamu punya toko online. Sebelum membukanya untuk umum, kamu ingin **menguji semua tombol, form, dan proses pembelian** tanpa harus menunggu pengunjung sungguhan datang. HTTP Tests adalah seperti **ruang uji coba pribadimu** - kamu bisa mengakses semua halaman dan fitur toko online-mu secara virtual, memastikan semuanya berfungsi dengan baik sebelum pengunjung sungguhan datang.

**Mengapa ini penting?** Karena kamu bisa memastikan aplikasimu bekerja dengan benar tanpa harus mengirim request sungguhan ke jaringan. Ini seperti memiliki laboratorium di mana kamu bisa bereksperimen dan memastikan semuanya aman sebelum digunakan.

**Bagaimana cara kerjanya?** HTTP Tests itu seperti asisten uji coba yang:
1.  **Mengirim request** ke aplikasimu (seperti GET, POST, PUT, dll.)
2.  **Menerima response** seperti seorang pengguna sungguhan
3.  **Memeriksa apakah semuanya sesuai harapan** (status, isi halaman, dll.)
4.  **Memberi laporan** apakah semuanya berjalan dengan baik

Jadi, alur kerja (workflow) HTTP Tests menjadi sangat rapi:

`➡️ Buat Request (GET/POST/etc.) -> 🧪 Terima Response -> ✅ Cek Semuanya Beres -> ✅ Pastikan Tidak Ada Bug`

Tanpa HTTP Tests, kamu harus membuka browser dan mengklik setiap tombol secara manual untuk menguji aplikasimu - sangat membosankan dan tidak efisien! 😵

### 2. ✍️ Resep Pertamamu: Dari Request ke Response

Ini adalah fondasi paling dasar. Mari kita buat test HTTP dari nol, langkah demi langkah.

#### Langkah 1️⃣: Buat Request ke Aplikasi
**Mengapa?** Kita perlu mengakses halaman atau endpoint di aplikasi kita.

**Bagaimana?** Gunakan metode seperti `get()` untuk mengirim HTTP GET request:
```php
$response = $this->get('/');  // Kirim GET request ke halaman utama
```

#### Langkah 2️⃣: Periksa Response-nya
**Mengapa?** Agar tahu apakah request berhasil atau tidak.

**Bagaimana?** Gunakan assertion untuk mengecek status response:
```php
$response->assertStatus(200);  // Pastikan statusnya 200 (berhasil)
```

#### Langkah 3️⃣: Gabungkan Dalam Test
**Contoh Lengkap:**
```php
<?php

test('aplikasi mengembalikan response sukses', function () {
    $response = $this->get('/');      // Langkah 1: Kirim request
    $response->assertStatus(200);     // Langkah 2: Cek status response
});
```

**Penjelasan Kode:**
- `$this->get('/')` - Mengirim HTTP GET request ke halaman utama (route '/')
- `$response->assertStatus(200)` - Memastikan response memiliki status HTTP 200 (berhasil)

Selesai! 🎉 Sekarang, kamu telah membuat test HTTP pertamamu!

### 3. ⚡ Metode HTTP (Berbagai Jenis Request)

**Analogi:** Bayangkan kamu berinteraksi dengan toko online - kamu bisa hanya melihat-lihat (GET), menambahkan barang ke keranjang (POST), mengubah pesanan (PUT/PATCH), atau menghapus barang (DELETE).

**Mengapa ini penting?** Karena aplikasi web memiliki berbagai cara pengguna berinteraksi, dan kamu harus bisa menguji semuanya.

Laravel mendukung semua metode HTTP utama:
- `get()` → Melihat data (seperti membuka halaman)
- `post()` → Mengirim data baru (seperti submit form)
- `put()` → Memperbarui data lengkap
- `patch()` → Memperbarui sebagian data
- `delete()` → Menghapus data

Semua request ini **tidak benar-benar keluar ke jaringan**, tapi disimulasikan secara internal, dan mengembalikan instance `Illuminate\Testing\TestResponse` yang menyediakan banyak metode assertion untuk kamu gunakan.

---

## Bagian 2: Request Dasar - Menguji Endpoint Sederhana 🚀

### 4. 🧪 Membuat Request ke Endpoint

**Analogi:** Ini seperti mengirim surat ke alamat tertentu dan menunggu jawaban kembali - kamu ingin tahu apakah suratmu diterima dan jawabannya sesuai harapan.

**Mengapa ini penting?** Karena kamu perlu menguji apakah endpoint-endpoint di aplikasimu merespon dengan benar.

**Contoh Lengkap:**
```php
<?php

test('basic request to homepage', function () {
    $response = $this->get('/');        // Kirim GET request ke halaman utama
    $response->assertStatus(200);       // Periksa status 200 (berhasil)
});

test('basic request to about page', function () {
    $response = $this->get('/about');   // Kirim GET request ke halaman about
    $response->assertStatus(200);       // Periksa status 200 (berhasil)
});

test('request with parameters', function () {
    $response = $this->get('/user/1');  // Kirim GET request dengan parameter
    $response->assertStatus(200);       // Periksa status 200 (berhasil)
});

test('post request', function () {
    $response = $this->post('/user', [      // Kirim POST request dengan data
        'name' => 'Sally',
        'email' => 'sally@example.com'
    ]);
    $response->assertStatus(201);           // Periksa status 201 (created)
});
```

---

## Bagian 3: Menyesuaikan Request - Menambahkan Data dan Informasi 🛠️

### 5. 🔖 Menambahkan Header (Informasi Tambahan)

**Analogi:** Bayangkan kamu mengirim surat dengan informasi tambahan di amplop - seperti "PENTING" atau "RAHASIA". Headers seperti itu, memberi informasi tambahan tentang requestmu.

**Mengapa ini penting?** Karena banyak endpoint membutuhkan header tertentu seperti API keys, content-type, atau token autentikasi.

**Contoh Lengkap:**
```php
<?php

test('request dengan header custom', function () {
    $response = $this->withHeaders([        // Tambahkan header custom
        'X-Header' => 'Value',
        'Authorization' => 'Bearer token123',
        'Content-Type' => 'application/json',
    ])->post('/api/user', ['name' => 'Sally']);  // Kirim POST request
    
    $response->assertStatus(201);           // Periksa status 201 (created)
});
```

### 6. 🍪 Menggunakan Cookies (Data Pengguna)

**Analogi:** Bayangkan kamu memberi tahu toko online bahwa kamu orang yang sama dengan membawa kartu member. Cookies seperti kartu member itu - menyimpan informasi tentang pengguna.

**Mengapa ini penting?** Karena aplikasi sering menyimpan informasi pengguna di cookies, dan kamu perlu bisa mensimulasikan ini dalam test.

**Contoh Lengkap:**
```php
<?php

test('request dengan cookie tunggal', function () {
    $response = $this->withCookie('color', 'blue')  // Tambahkan satu cookie
        ->get('/');                                  // Kirim GET request
});

test('request dengan beberapa cookies', function () {
    $response = $this->withCookies([                // Tambahkan beberapa cookies
        'color' => 'blue',
        'name' => 'Taylor',
        'theme' => 'dark'
    ])->get('/');                                   // Kirim GET request
});
```

### 7. 🎒 Session & Autentikasi (Keadaan Pengguna)

**Analogi:** Session seperti meja kerja yang disediakan untukmu di toko - semua barang yang kamu lihat atau yang kamu ambil disimpan di mejamu. Autentikasi seperti memberitahu toko bahwa kamu pelanggan yang sudah terdaftar.

**Mengapa ini penting?** Karena banyak fitur hanya tersedia untuk pengguna yang sudah login atau memiliki session tertentu.

**Contoh Lengkap:**

**Menggunakan Session:**
```php
<?php

test('request dengan data session', function () {
    $response = $this->withSession([         // Tambahkan data ke session
        'banned' => false,
        'user_preferences' => ['theme' => 'light']
    ])->get('/');                            // Kirim GET request
});
```

**Menggunakan Autentikasi:**
```php
<?php

use App\Models\User;

test('action yang butuh login pengguna', function () {
    $user = User::factory()->create();       // Buat pengguna palsu
    
    $response = $this->actingAs($user)       // Simulasikan pengguna sudah login
        ->withSession(['banned' => false])   // Tambahkan data session
        ->get('/dashboard');                 // Kirim GET request ke halaman yang butuh login
});

test('request sebagai pengguna guest (belum login)', function () {
    $response = $this->actingAsGuest()       // Simulasikan sebagai pengguna belom login
        ->get('/home');                      // Kirim GET request
});
```

---

## Bagian 4: Debugging - Menemukan dan Memperbaiki Masalah 🐞

### 8. 🔍 Debugging Response (Menganalisis Apa yang Terjadi)

**Analogi:** Ini seperti menggunakan kaca pembesar untuk melihat dengan detail apa yang terjadi saat kamu mengirim surat - apakah amplopnya rusak, alamatnya salah, atau ada masalah lain.

**Mengapa ini penting?** Karena saat test gagal atau tidak berjalan sesuai harapan, kamu perlu melihat detail response untuk memahami masalahnya.

**Metode Debugging:**
- `dump()` → Menampilkan isi response
- `dumpHeaders()` → Menampilkan header response
- `dumpSession()` → Menampilkan data session
- `dd()`, `ddHeaders()`, `ddBody()`, `ddJson()`, `ddSession()` → Debug dan hentikan eksekusi

**Contoh Lengkap:**
```php
// Tampilkan header response
$response = $this->get('/');
$response->dumpHeaders();

// Tampilkan isi response dan hentikan eksekusi
$response->dd();

// Tampilkan body response dan hentikan eksekusi
$response->ddBody();

// Tampilkan data JSON response dan hentikan eksekusi
$response->ddJson();
```

---

## Bagian 5: Menangani Exception - Uji Kesalahan dan Gangguan ⚡

### 9. ⚡ Testing Exception (Uji Kesalahan)

**Analogi:** Bayangkan kamu ingin tahu apakah toko online-mu bisa menangani saat terjadi kesalahan - seperti stok habis atau pembayaran gagal. Kamu ingin memastikan sistem bisa memberi pesan yang benar saat gagal.

**Mengapa ini penting?** Karena kamu perlu memastikan aplikasimu bisa menangani error dengan benar dan memberi pesan yang sesuai.

**Contoh Lengkap:**
```php
<?php

use App\Exceptions\InvalidOrderException;
use Illuminate\Support\Facades\Exceptions;

test('exception ditangani dengan benar', function () {
    Exceptions::fake();                       // Matikan handler exception bawaan
    
    $response = $this->get('/order/1');      // Kirim request yang seharusnya buat exception
    
    // Periksa apakah exception yang benar dilaporkan
    Exceptions::assertReported(InvalidOrderException::class);
});

// Jika ingin menonaktifkan exception handling untuk melihat error langsung
test('exception handling dinonaktifkan', function () {
    $response = $this->withoutExceptionHandling()  // Nonaktifkan exception handler
        ->get('/error-prone-endpoint');            // Kirim request ke endpoint yang bisa error
});
```

---

## Bagian 6: Testing API - Dunia JSON dan Data 💱

### 10. 📡 Testing JSON API (API dengan Format Data JSON)

**Analogi:** Bayangkan kamu punya mesin yang berkomunikasi dengan bahasa tertentu (JSON), dan kamu ingin memastikan mesin ini memahami perintah dan memberi jawaban yang benar dalam bahasa yang sama.

**Mengapa ini penting?** Karena banyak aplikasi modern menggunakan API yang berkomunikasi dengan format JSON untuk frontend (React, Vue, dll.) atau aplikasi mobile.

**Contoh Lengkap:**
```php
<?php

test('API endpoint merespon dengan JSON', function () {
    $response = $this->postJson('/api/user', [    // Kirim POST request dengan data JSON
        'name' => 'Sally',
        'email' => 'sally@example.com'
    ]);
    
    $response
        ->assertStatus(201)                        // Periksa status 201 (created)
        ->assertJson([                             // Periksa apakah response berisi data ini
            'created' => true,
            'user' => [
                'name' => 'Sally'
            ]
        ]);
});

// Metode lain untuk menguji JSON API
test('API endpoint dengan getJson', function () {
    $response = $this->getJson('/api/users');     // Kirim GET request API dengan header JSON
    
    $response->assertStatus(200)                  // Periksa status
             ->assertJsonCount(5);                // Periksa jumlah item JSON
});

// Cek data JSON secara langsung
test('cek data JSON secara langsung', function () {
    $response = $this->getJson('/api/users/1');
    
    expect($response['name'])->toBe('Taylor');    // Periksa nilai field tertentu
    expect($response['created'])->toBeTrue();     // Periksa nilai boolean
});
```

---

## Bagian 7: Testing Upload File - Uji Kirim dan Terima File 🖼️

### 11. 📤 Testing File Upload (Upload dan Verifikasi File)

**Analogi:** Bayangkan kamu ingin menguji apakah fitur upload foto di toko online-mu berfungsi - kamu ingin mengirimkan gambar dan memastikan gambar itu benar-benar tersimpan di tempat yang seharusnya.

**Mengapa ini penting?** Karena upload file adalah fitur yang kompleks dan rentan terhadap berbagai jenis error atau keamanan.

**Contoh Lengkap:**
```php
<?php

use Illuminate\Http\UploadedFile;                   // Class untuk file upload palsu
use Illuminate\Support\Facades\Storage;            // Facade untuk manajemen storage

test('upload avatar berhasil', function () {
    Storage::fake('avatars');                       // Matikan storage sungguhan, gunakan storage palsu
    
    $file = UploadedFile::fake()->image('avatar.jpg');  // Buat file gambar palsu
    
    $response = $this->post('/avatar', [            // Kirim POST request dengan file
        'avatar' => $file,
    ]);
    
    // Periksa apakah file benar-benar disimpan di storage
    Storage::disk('avatars')->assertExists($file->hashName());
    
    // Atau periksa dengan nama aslinya
    Storage::disk('avatars')->assertExists('avatar.jpg');
});

test('upload file dengan validasi', function () {
    Storage::fake('documents');
    
    $file = UploadedFile::fake()->create('document.pdf', 100);  // Buat file PDF palsu
    
    $response = $this->post('/document', [
        'document' => $file,
    ]);
    
    $response->assertStatus(200);                   // Periksa status success
    Storage::disk('documents')->assertExists($file->hashName()); // Periksa file disimpan
});
```

---

## Bagian 8: Testing View - Uji Tampilan Langsung 🎨

### 12. 🎨 Testing View (Uji Tampilan Halaman)

**Analogi:** Bayangkan kamu ingin memastikan isi surat yang akan dikirim terlihat bagus sebelum benar-benar dikirim - kamu ingin melihat tampilan surat itu tanpa harus mengirimnya.

**Mengapa ini penting?** Karena kamu bisa menguji apakah view (template) menampilkan data dengan benar tanpa harus membuat request HTTP lengkap.

**Contoh Lengkap:**
```php
<?php

test('render view welcome dengan data', function () {
    $view = $this->view('welcome', [               // Render view langsung dengan data
        'name' => 'Taylor'
    ]);
    
    $view->assertSee('Taylor');                    // Periksa apakah nama muncul di halaman
});

test('render view dengan data kompleks', function () {
    $user = User::factory()->make();               // Buat model user palsu
    
    $view = $this->view('profile.show', [
        'user' => $user
    ]);
    
    $view->assertSee($user->name)                  // Periksa apakah nama user muncul
         ->assertSee($user->email);                // Periksa apakah email user muncul
});

test('view tidak menampilkan data tertentu', function () {
    $view = $this->view('welcome', []);
    
    $view->assertDontSee('admin');                 // Periksa apakah 'admin' tidak muncul
});
```

---

## Bagian 9: Assertion Power - Berbagai Jenis Pemeriksaan ✅

### 13. 🧪 Berbagai Jenis Assertion (Cek Berbagai Aspek Response)

**Analogi:** Bayangkan kamu adalah inspektur yang mengecek berbagai aspek dari sebuah pesanan - apakah alamatnya benar, apakah isinya lengkap, apakah kemasannya rapi, dll. Assertion seperti itu, mengecek berbagai aspek dari response.

**Mengapa ini penting?** Karena kamu bisa memastikan berbagai aspek dari response sesuai dengan harapan.

Laravel menyediakan ratusan assertion untuk berbagai kebutuhan:

**Assertion untuk Response:**
- `assertStatus(200)` → Cek status HTTP
- `assertOk()` → Cek status 200
- `assertJson([...])` → Cek data JSON
- `assertExactJson([...])` → Cek data JSON secara eksak
- `assertRedirect('/path')` → Cek redirect
- `assertSee('text')` → Cek teks muncul di response
- `assertDontSee('text')` → Cek teks TIDAK muncul
- `assertViewIs('name')` → Cek view yang digunakan
- `assertViewHas('key')` → Cek data dikirim ke view

**Contoh Lengkap:**
```php
// Berbagai assertion untuk response
$response->assertStatus(200);                    // HTTP OK
$response->assertOk();                          // Sama dengan status 200
$response->assertRedirect('/dashboard');        // Redirect ke halaman tertentu
$response->assertSee('Welcome');                // Teks muncul di response
$response->assertDontSee('Admin Only');         // Teks TIDAK muncul
$response->assertJson(['name' => 'Taylor']);    // Data JSON tertentu
$response->assertExactJson(['name' => 'Taylor', 'id' => 1]); // Data JSON ekak

// Assertion untuk authentication
$response->assertAuthenticated();                // User sudah login
$response->assertGuest();                       // User belum login
$response->assertAuthenticatedAs($user);        // Spesifik user yang login

// Assertion untuk validasi
$response->assertValid('name');                 // Field 'name' valid
$response->assertInvalid('email');              // Field 'email' invalid

// Assertion untuk view
$response->assertViewIs('user.show');           // View yang digunakan benar
$response->assertViewHas('user');               // Data 'user' dikirim ke view
$response->assertViewHas('user', function ($user) {  // Cek data view lebih spesifik
    return $user->name === 'Taylor';
});
```

---

## Bagian 10: Praktik Terbaik dalam HTTP Testing 🏆

### 14. ✅ Praktik Terbaik untuk Test yang Efektif

**1. Gunakan Nama Test yang Jelas dan Deskriptif:**
```php
// Buruk
test('test 1', function () { ... });

// Baik
test('user can create new post', function () { ... });
```

**2. Gunakan Factory untuk Data Testing:**
```php
use App\Models\User;

test('authenticated user can view dashboard', function () {
    $user = User::factory()->create();        // Gunakan factory
    
    $response = $this->actingAs($user)
        ->get('/dashboard');
    
    $response->assertStatus(200);
});
```

**3. Kelompokkan Test yang Terkait:**
```php
test('user can register', function () { ... });
test('user can login', function () { ... });
test('user can logout', function () { ... });
```

**4. Gunakan Database Transaction untuk Test:**
```php
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    use RefreshDatabase;        // Gunakan ini agar database kembali ke kondisi awal setelah test
    
    test('user can be created', function () { ... });
}
```

**5. Test Skenario Error Juga:**
```php
test('user cannot access protected page without login', function () {
    $response = $this->get('/admin');
    
    $response->assertRedirect('/login');       // Harus redirect ke login
});
```

### 15. 🧠 Tips dan Trik Lanjutan

**Gunakan Closure untuk Assertion Kompleks:**
```php
$response->assertJson(function ($json) {
    $json->has('user.id')
         ->has('user.name')
         ->where('user.name', 'Taylor')
         ->etc();
});
```

**Test Multiple Assertions dalam Satu Chain:**
```php
$response = $this->post('/user', ['name' => 'Taylor'])
    ->assertStatus(201)
    ->assertJson(['created' => true])
    ->assertJson(['user' => ['name' => 'Taylor']])
    ->assertRedirect('/users');
```

**Gunakan Pest Feature Tests untuk HTTP Testing:**
```php
<?php

test('user registration', function () {
    $response = $this->post('/register', [
        'name' => 'Taylor',
        'email' => 'taylor@example.com',
        'password' => 'password',
    ]);
    
    $response->assertRedirect('/dashboard');
    
    $this->assertAuthenticated();
});
```

---

## Bagian 11: Cheat Sheet & Referensi Cepat 📋

### 16. 🔍 HTTP Request Methods
| Metode | Fungsi |
|--------|--------|
| `get('/path')` | Kirim GET request |
| `post('/path', $data)` | Kirim POST request dengan data |
| `put('/path', $data)` | Kirim PUT request untuk update lengkap |
| `patch('/path', $data)` | Kirim PATCH request untuk update partial |
| `delete('/path')` | Kirim DELETE request |

### 17. 🛠️ Request Customization
| Metode | Fungsi |
|--------|--------|
| `withHeaders([...])` | Tambahkan custom headers |
| `withCookie('name', 'value')` | Tambahkan satu cookie |
| `withCookies([...])` | Tambahkan beberapa cookies |
| `withSession([...])` | Tambahkan data ke session |
| `actingAs($user)` | Simulasikan user sudah login |
| `actingAsGuest()` | Simulasikan user belum login |

### 18. 🧪 HTTP Response Assertions
| Assertion | Fungsi |
|-----------|--------|
| `assertStatus(200)` | Cek HTTP status code |
| `assertOk()` | Cek status 200 |
| `assertRedirect('/path')` | Cek redirect ke path tertentu |
| `assertSee('text')` | Cek teks muncul di response |
| `assertDontSee('text')` | Cek teks TIDAK muncul |
| `assertJson([...])` | Cek data JSON muncul |
| `assertExactJson([...])` | Cek data JSON secara eksak |

### 19. 🔐 Authentication Assertions
| Assertion | Fungsi |
|-----------|--------|
| `assertAuthenticated()` | Cek user sudah login |
| `assertGuest()` | Cek user belum login |
| `assertAuthenticatedAs($user)` | Cek user tertentu yang login |

### 20. ✅ Validation Assertions
| Assertion | Fungsi |
|-----------|--------|
| `assertValid('field')` | Cek field valid |
| `assertInvalid('field')` | Cek field tidak valid |
| `assertSessionHasErrors()` | Cek ada error di session |

### 21. 🎨 View Assertions
| Assertion | Fungsi |
|-----------|--------|
| `assertViewIs('name')` | Cek view yang digunakan |
| `assertViewHas('key')` | Cek data dikirim ke view |
| `assertViewMissing('key')` | Cek data TIDAK dikirim ke view |

### 22. 📡 JSON API Testing
| Metode | Fungsi |
|--------|--------|
| `getJson('/api/endpoint')` | Kirim GET request API |
| `postJson('/api/endpoint', $data)` | Kirim POST request API |
| `assertJsonCount(5)` | Cek jumlah item JSON |
| `assertJsonPath('data.name', 'Taylor')` | Cek nilai di path JSON tertentu |

---

## Bagian 12: Kesimpulan 🎯

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi HTTP Tests, dari yang paling dasar sampai yang paling rumit. Kamu hebat! Ingat, HTTP Tests adalah alat yang sangat penting untuk memastikan aplikasi webmu bekerja dengan baik sebelum pengguna sungguhan menggunakannya. Menguasainya berarti kamu bisa membuat aplikasi yang lebih andal, stabil, dan bebas bug.

Dengan HTTP Tests, kamu bisa menguji:
- Endpoint HTTP (GET, POST, PUT, PATCH, DELETE)
- API JSON dengan berbagai data
- Upload file dan verifikasi hasilnya
- Session, autentikasi, dan cookies
- View dan tampilan halaman
- Error handling dan exception

Jangan pernah berhenti belajar dan mencoba. Dengan HTTP Tests, kamu bisa membuat aplikasi yang kamu percaya akan berjalan lancar di produksi. Selamat ngoding, murid kesayanganku!

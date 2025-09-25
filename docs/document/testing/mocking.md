# 🧪 Mocking di Laravel: Panduan dari Guru Kesayanganmu (Edisi Testing Cerdas Tanpa Ketergantungan)

Hai murid-murid kesayanganku! Selamat datang di kelas testing cerdas. Hari ini kita akan belajar tentang **Mocking** - teknik ajaib yang membuat pengujian aplikasimu tidak tergantung pada sistem eksternal atau proses berat lainnya. Setelah mempelajari ini, kamu bisa membuat test yang cepat, aman, dan fokus seperti seorang master testing! Ayo kita mulai petualangan mock ini dengan semangat!

---

## Bagian 1: Kenalan Dulu, Yuk! (Konsep Dasar) 基礎

### 1. 📖 Apa Itu Mocking Sebenarnya?

**Analogi:** Bayangkan kamu sedang mengetes mobil baru di sirkuit balap. Tapi daripada harus mengisi bensin, menghubungkan mesin ke sistem pendingin, dan mengatur semua sistem kompleks mobil, kamu gunakan simulator mesin yang bisa meniru semua fungsi mesin asli tapi lebih cepat dan mudah dikendalikan. Nah, **Mocking adalah seperti simulator ini** - menggantikan komponen asli dengan versi tiruan yang bisa kamu kontrol saat pengujian.

**Mengapa ini penting?** Karena saat menguji fitur tertentu, kamu tidak ingin:
- Mengirim email sungguhan
- Menyimpan ke database sungguhan
- Membuat request ke API eksternal
- Menjalankan semua event listener
- Menunggu proses panjang selesai

**Bagaimana cara kerjanya?** 
1. **Kamu buat tiruan komponen** seperti objek aslinya
2. **Kamu tentukan responsnya** sesuai keinginan
3. **Laravel menggantikan komponen asli** dengan tiruannya saat test
4. **Kamu bisa menguji hanya fitur yang kamu inginkan**

Jadi, alur mocking kita menjadi:
`Komponen Asli -> Tiruan (Mock) -> Test yang Fokus -> Validasi`

Tanpa mocking, testmu bisa jadi lambat, tidak dapat diprediksi, dan susah dijalankan. 😰

### 2. ✍️ Mengapa Butuh Mocking (Keuntungan Luar Biasa)

**Analogi:** Bayangkan kamu seorang sutradara film yang sedang syuting adegan cuaca buruk di studio. Daripada menunggu badai datang, kamu gunakan efek cuaca buatan agar syuting bisa tetap berjalan cepat dan aman. Mocking adalah seperti efek cuaca buatan ini untuk pengujianmu.

**Mengapa ini penting?** Karena kamu bisa:
- **Mempercepat eksekusi test** (tidak menunggu API atau proses berat)
- **Menguji kondisi error** (menggagalkan API untuk melihat respons error)
- **Mengisolasi fitur** (menguji hanya satu bagian tanpa ketergantungan)
- **Menguji berbagai skenario** (sukses, error, timeout, dll)

**Contoh Perbandingan:**
```php
// TANPA mocking - test lambat dan tidak dapat diprediksi
public function testSendsWelcomeEmail()
{
    // Ini akan benar-benar kirim email, bisa gagal karena internet
    $user = User::create(['email' => 'test@example.com']);
    $user->sendWelcomeEmail(); // Ini benar-benar mengirim email
    
    // Test bisa gagal karena banyak faktor selain fitur sesungguhnya
}

// DENGAN mocking - test cepat dan terprediksi
public function testSendsWelcomeEmail()
{
    // Mock service pengirim email
    $this->mock(EmailService::class, function ($mock) {
        $mock->shouldReceive('send')->once(); // Harap satu kali pemanggilan
    });
    
    // Sekarang test hanya fokus pada logika, bukan eksekusi sebenarnya
    $user = User::create(['email' => 'test@example.com']);
    $user->sendWelcomeEmail(); // Tidak benar-benar kirim email
    
    // Test fokus pada logika, bukan eksekusi sebenarnya
}
```

### 3. ⚡ Jenis-Jenis Mocking (Pilihan yang Tepat)

**Analogi:** Bayangkan kamu punya tiga jenis boneka untuk bermain:
1. **Boneka utuh** (full mock) - semua gerakannya bisa kamu kontrol
2. **Boneka sebagian** (partial mock) - beberapa gerakannya otomatis, beberapa kamu kontrol
3. **Boneka pengintai** (spy) - melaporkan semua gerakan tanpa mengubahnya

**Mengapa ada pilihan?** Karena tergantung kebutuhan pengujianmu.

**Bagaimana cara kerjanya?**
- **Full Mock**: Gantikan semua metode objek
- **Partial Mock**: Gantikan beberapa metode, sisanya tetap asli
- **Spy**: Amati interaksi tanpa mengubah perilaku

---

## Bagian 2: Membuat Mock Objek - Alat Uji Cerdasmu 🤖

### 4. 📦 Full Mock (Ganti Semua Metode)

**Analogi:** Bayangkan kamu membuat replika robot lengkap yang bisa meniru semua gerakan dan suara aslinya, tapi kamu bisa mengontrol semua perilakunya. Full mock adalah seperti replika robot ini - menggantikan semua metode objek asli dengan versi tiruan.

**Mengapa ini penting?** Karena kamu bisa mengontrol semua respons dari komponen yang diuji.

**Bagaimana cara kerjanya?** Gunakan metode `mock()`:

**Contoh Lengkap Full Mock:**
```php
<?php
// tests/Feature/OrderServiceTest.php

use App\Services\PaymentService;
use Mockery\MockInterface;

it('processes order with successful payment', function () {
    // Buat mock untuk PaymentService
    $paymentMock = $this->mock(PaymentService::class, function (MockInterface $mock) {
        $mock->shouldReceive('charge') // Metode charge akan dipanggil
             ->with(100000) // Dengan parameter 100000
             ->once() // Harus dipanggil satu kali
             ->andReturn(['success' => true, 'transaction_id' => 'trans_123']);
    });
    
    // Gunakan service untuk proses order
    $orderService = new OrderService($paymentMock);
    $result = $orderService->processOrder(100000);
    
    // Periksa hasilnya
    expect($result['success'])->toBeTrue();
    expect($result['transaction_id'])->toBe('trans_123');
});

it('handles payment failure gracefully', function () {
    // Mock yang mengembalikan error
    $this->mock(PaymentService::class, function (MockInterface $mock) {
        $mock->shouldReceive('charge')
             ->andReturn(['success' => false, 'error' => 'Insufficient funds']);
    });
    
    $orderService = new OrderService($paymentMock);
    $result = $orderService->processOrder(100000);
    
    // Periksa bahwa error ditangani dengan benar
    expect($result['success'])->toBeFalse();
    expect($result['error'])->toBe('Insufficient funds');
});
```

**Contoh Lengkap dengan Pest:**
```php
<?php
// tests/Feature/NotificationServiceTest.php

use App\Services\NotificationService;
use Mockery\MockInterface;

it('sends notification successfully', function () {
    // Buat mock notification service
    $notificationMock = $this->mock(NotificationService::class, function (MockInterface $mock) {
        $mock->shouldReceive('send')
             ->with('Welcome', 'user@example.com')
             ->once()
             ->andReturn(true);
    });
    
    // Jalankan kode yang menggunakan service
    $result = $notificationMock->send('Welcome', 'user@example.com');
    
    // Periksa hasilnya
    expect($result)->toBeTrue();
});
```

### 5. 🛠️ Partial Mock (Ganti Sebagian Metode)

**Analogi:** Bayangkan kamu punya mobil mainan yang bisa bergerak sendiri (fungsi asli), tapi kamu ingin mengganti mesinnya dengan mesin yang bisa kamu kontrol manual. Partial mock adalah seperti modifikasi ini - sebagian fungsi tetap asli, sebagian kamu ganti dengan kontrolmu.

**Mengapa ini penting?** Karena terkadang kamu hanya ingin mengganti satu atau dua metode, bukan semua metode.

**Bagaimana cara kerjanya?** Gunakan metode `partialMock()`:

**Contoh Lengkap Partial Mock:**
```php
<?php
// tests/Feature/UserServiceTest.php

use App\Services\UserService;
use Mockery\MockInterface;

it('creates user but mock email sending', function () {
    // Buat partial mock - sebagian fungsi asli, sebagian diganti
    $userMock = $this->partialMock(UserService::class, function (MockInterface $mock) {
        // Ganti metode sendWelcomeEmail
        $mock->shouldReceive('sendWelcomeEmail')
             ->with(m::any()) // Terima parameter apa saja
             ->andReturn(true);
        
        // Metode lain akan tetap berjalan normal
    });
    
    // Jalankan proses yang biasanya mengirim email
    $result = $userMock->createUser([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);
    
    // Periksa bahwa user dibuat (metode asli berjalan)
    expect($result)->not()->toBeNull();
    
    // Periksa bahwa metode mock dipanggil
    $userMock->shouldHaveReceived('sendWelcomeEmail');
});
```

**Contoh Lengkap dengan Metode Asli:**
```php
<?php

it('uses real validation but mocks database save', function () {
    $userMock = $this->partialMock(UserService::class, function (MockInterface $mock) {
        // Hanya mock save method
        $mock->shouldReceive('save')
             ->andReturn(true);
    });
    
    // Metode validasi tetap berjalan seperti aslinya
    $result = $userMock->createUserValidated([
        'name' => 'Valid User',
        'email' => 'valid@example.com',
    ]);
    
    // Validasi tetap berjalan, hanya save yang diganti
    expect($result)->toBeTrue();
});
```

### 6. 👀 Spy (Pengintai Interaksi)

**Analogi:** Bayangkan kamu seorang detektif yang menyamar sebagai pelayan di sebuah restoran untuk mengamati perilaku pelanggan. Spy adalah seperti detektif ini - tidak mengubah perilaku objek, hanya mencatat apa yang dilakukan.

**Mengapa ini penting?** Karena kamu ingin tahu apakah metode tertentu dipanggil, berapa kali, dan dengan parameter apa.

**Bagaimana cara kerjanya?** Gunakan metode `spy()`:

**Contoh Lengkap Spy:**
```php
<?php
// tests/Feature/OrderProcessorTest.php

use App\Services\PaymentService;

it('calls payment service when processing order', function () {
    // Buat spy - objek asli berjalan, tapi kita bisa melihat interaksinya
    $paymentSpy = $this->spy(PaymentService::class);
    
    // Jalankan kode yang seharusnya memanggil metode charge
    $orderProcessor = new OrderProcessor($paymentSpy);
    $orderProcessor->processOrder(['amount' => 100000]);
    
    // Cek bahwa metode charge dipanggil
    $paymentSpy->shouldHaveReceived('charge');
    
    // Cek bahwa metode dipanggil dengan parameter tertentu
    $paymentSpy->shouldHaveReceived('charge')->with(100000);
    
    // Cek jumlah pemanggilan
    $paymentSpy->shouldHaveReceived('charge')->times(1);
});

it('does not call notification when processing failed order', function () {
    $notificationSpy = $this->spy(NotificationService::class);
    
    $orderProcessor = new OrderProcessor($notificationSpy);
    $orderProcessor->processFailedOrder(['amount' => 100000]);
    
    // Cek bahwa metode tidak dipanggil
    $notificationSpy->shouldNotHaveReceived('send');
});
```

**Contoh Lanjutan Spy:**
```php
<?php

it('tracks multiple method calls', function () {
    $emailSpy = $this->spy(EmailService::class);
    
    // Jalankan beberapa operasi
    $user = User::factory()->create();
    $user->sendWelcomeEmail();
    $user->sendNotificationEmail('Welcome!');
    $user->sendPromotionalEmail();
    
    // Cek semua pemanggilan
    $emailSpy->shouldHaveReceived('sendWelcomeEmail')->times(1);
    $emailSpy->shouldHaveReceived('sendNotificationEmail')->with('Welcome!');
    $emailSpy->shouldHaveReceived('sendPromotionalEmail');
});
```

---

## Bagian 3: Jurus Tingkat Lanjut - Mocking Facades 🚀

### 7. 🏷️ Mocking Facades (Gantikan Static Method)

**Analogi:** Bayangkan kamu punya mesin yang biasanya mengeluarkan barang dengan cara tetap (static method), tapi kamu ingin mengganti cara kerjanya sementara waktu untuk pengujian. Facades di Laravel unik karena bisa diganti dengan versi mock, meskipun terlihat seperti static method.

**Mengapa ini penting?** Karena banyak fitur Laravel menggunakan facade, dan kamu butuh menggantinya saat testing.

**Bagaimana cara kerjanya?** Gunakan metode facade langsung untuk mocking:

**Contoh Lengkap Mocking Cache Facade:**
```php
<?php
// tests/Feature/UserDashboardTest.php

use Illuminate\Support\Facades\Cache;

it('loads user data from cache when available', function () {
    // Mock facade Cache untuk mengembalikan data tertentu
    Cache::shouldReceive('get')
         ->with('user_dashboard_data_1')
         ->andReturn(['stats' => ['posts' => 10, 'comments' => 50]]);
    
    // Jalankan request
    $response = $this->get('/dashboard');
    
    // Periksa respons
    $response->assertOk();
    $response->assertJson(['stats' => ['posts' => 10, 'comments' => 50]]);
});

it('saves data to cache', function () {
    // Mock untuk mengecek apakah data disimpan ke cache
    Cache::shouldReceive('put')
         ->with('user_dashboard_data_1', m::type('array'), 3600)
         ->once();
    
    // Jalankan kode yang seharusnya menyimpan ke cache
    $this->get('/dashboard');
    
    // Cek bahwa metode dipanggil sesuai harapan
    Cache::shouldHaveReceived('put');
});

it('uses default cache time when not specified', function () {
    Cache::shouldReceive('remember')
         ->with('default_data', 300, m::type('callable')) // default 5 menit
         ->andReturn(['data' => 'cached']);
    
    $response = $this->get('/default-cache');
    
    $response->assertJson(['data' => 'cached']);
});
```

**Contoh Lengkap dengan Multiple Facade:**
```php
<?php
// tests/Feature/UserRegistrationTest.php

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Queue;

it('registers user and sends welcome email', function () {
    // Mock semua facade yang digunakan
    Mail::shouldReceive('to')
        ->shouldReceive('send')
        ->once();
        
    Cache::shouldReceive('put')
         ->with('new_user_count', m::type('int'))
         ->once();
         
    Queue::shouldReceive('push')
         ->once();
    
    // Jalankan registrasi
    $response = $this->post('/register', [
        'name' => 'New User',
        'email' => 'newuser@example.com',
        'password' => 'password123',
    ]);
    
    // Cek respons
    $response->assertRedirect('/dashboard');
    
    // Cek semua facade dipanggil seperti yang diharapkan
    Mail::shouldHaveReceived('send');
    Cache::shouldHaveReceived('put');
    Queue::shouldHaveReceived('push');
});
```

### 8. 🔍 Facade Spies (Amati Tanpa Mengganti)

**Analogi:** Bayangkan kamu seorang pengawas yang hanya mencatat semua aktivitas di meja informasi tanpa mengubah prosesnya. Facade spy adalah seperti pengawas ini - mengamati semua interaksi facade tanpa menggantinya.

**Mengapa ini penting?** Karena kamu ingin tahu apakah facade digunakan dengan benar tanpa mengganti perilakunya.

**Bagaimana cara kerjanya?** Gunakan metode `spy()` pada facade:

**Contoh Lengkap Facade Spy:**
```php
<?php
// tests/Feature/ProfileUpdateTest.php

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Event;

it('invalidates user cache when profile updated', function () {
    // Gunakan spy untuk facade
    Cache::spy();
    Event::spy();
    
    $user = User::factory()->create();
    $this->actingAs($user);
    
    // Jalankan update profile
    $response = $this->put('/profile', [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
    ]);
    
    // Cek bahwa cache dihapus
    Cache::shouldHaveReceived('forget')
         ->with("user_profile_{$user->id}");
         
    // Cek bahwa event dipicu
    Event::shouldHaveReceived('dispatch');
});

it('tracks multiple cache operations', function () {
    Cache::spy();
    
    $this->get('/home'); // Ini bisa menyimpan cache
    $this->get('/profile'); // Ini juga bisa menyimpan cache
    $this->get('/settings'); // Ini juga bisa menyimpan cache
    
    // Cek semua interaksi
    Cache::shouldHaveReceived('get')->times(m::atLeast(1));
    Cache::shouldHaveReceived('put')->times(m::atLeast(1));
    
    // Cek bahwa tidak ada interaksi yang tidak diharapkan
    Cache::shouldNotHaveReceived('flush');
});
```

### 9. ⚠️ Peringatan dan Best Practices

**Analogi:** Bayangkan kamu seorang pilot yang harus tahu kapan harus menggunakan alat bantu dan kapan tidak. Ada beberapa facade yang sebaiknya tidak dimock karena bisa mengganggu pengujian.

**Mengapa ini penting?** Karena beberapa facade sebaiknya tidak dimock agar test tetap realistis.

**Bagaimana cara kerjanya?** Perhatikan peringatan berikut:

```php
<?php
// TIDAK REKOMENDASI: Mock Request facade
// Request::shouldReceive('get')->andReturn('value'); // JANGAN LAKUKAN INI

// YANG BENAR: Gunakan method HTTP Laravel
$response = $this->get('/users?search=alif'); // Lebih baik kirim data langsung

// TIDAK REKOMENDASI: Mock Config facade
// Config::shouldReceive('get')->andReturn('value'); // JANGAN LAKUKAN INI

// YANG BENAR: Gunakan Config::set() di dalam test
Config::set('app.name', 'Test App'); // Ini lebih baik

// CONTOH YANG BENAR:
it('uses configured app name', function () {
    // Atur konfigurasi untuk test ini
    Config::set('app.name', 'Testing App');
    
    $response = $this->get('/about');
    $response->assertSee('Testing App');
});
```

---

## Bagian 4: Peralatan Canggih di 'Kotak Perkakas' Mocking 🧰

### 10. ⏳ Time Travel & Freeze (Perjalanan Waktu untuk Testing)

**Analogi:** Bayangkan kamu seorang arkeolog waktu yang bisa melompat ke masa lalu atau masa depan untuk menguji fitur yang sensitif terhadap waktu. Time travel di Laravel adalah seperti mesin waktu ini - memungkinkan kamu menguji fitur berbasis waktu tanpa harus menunggu waktu sungguhan.

**Mengapa ini penting?** Karena banyak fitur bergantung pada waktu (expired, schedule, inactivity lock, dll).

**Bagaimana cara kerjanya?** Gunakan metode time manipulation:

**Contoh Lengkap Time Travel:**
```php
<?php
// tests/Feature/UserInactivityTest.php

use App\Models\Thread;

it('locks thread after one week of inactivity', function () {
    $thread = Thread::factory()->create();
    
    // Melompat ke masa depan 1 minggu
    $this->travel(1)->week();
    
    // Cek apakah thread terkunci
    expect($thread->fresh()->isLockedByInactivity())->toBeTrue();
});

it('expires temporary tokens', function () {
    $user = User::factory()->create();
    $token = $user->createTemporaryToken(['expires_at' => now()->addHour()]);
    
    // Melompat ke masa depan 2 jam
    $this->travel(2)->hours();
    
    // Cek apakah token sudah expired
    expect($user->isTokenExpired($token))->toBeTrue();
});

it('tests multiple time scenarios', function () {
    $user = User::factory()->create();
    
    // Test sebelum expired
    expect($user->isSessionExpired())->toBeFalse();
    
    // Melompat ke masa depan
    $this->travel(30)->minutes();
    expect($user->isSessionExpired())->toBeFalse();
    
    // Melompat lebih jauh
    $this->travel(31)->minutes();
    expect($user->isSessionExpired())->toBeTrue();
    
    // Kembali ke waktu normal
    $this->travelBack();
});

it('travels to specific date', function () {
    $this->travelTo(now()->subDays(30)); // Kembali 30 hari
    
    $user = User::factory()->create();
    expect($user->created_at->isPast())->toBeTrue();
    
    $this->travelBack(); // Kembali ke waktu sekarang
});
```

**Contoh Lengkap dengan Freeze Time:**
```php
<?php
// tests/Feature/TimeSensitiveTest.php

use Illuminate\Support\Carbon;

it('freezes time during test execution', function () {
    // Bekukan waktu dan jalankan closure
    $this->freezeTime(function (Carbon $time) {
        $start = now();
        
        // Jalankan proses yang biasanya mengambil waktu
        sleep(1); // Ini tetap tidak mengubah waktu karena dibekukan
        
        $end = now();
        
        // Karena waktu dibekukan, waktu tetap sama
        expect($start)->toEqual($end);
    });
});

it('tests time-based features consistently', function () {
    $this->freezeSecond(function (Carbon $time) {
        $timestamp1 = time();
        sleep(1); // Meskipun sleep, waktu tidak berubah
        $timestamp2 = time();
        
        expect($timestamp1)->toEqual($timestamp2);
    });
});
```

### 11. 🧪 Mocking dengan Callbacks dan Conditions

**Analogi:** Bayangkan kamu seorang detektif yang bisa mengatur syarat tertentu - "jika pelaku datang dengan mobil biru, maka..." Mocking dengan callback adalah seperti kemampuan ini - menjalankan logika tertentu saat kondisi tertentu terpenuhi.

**Mengapa ini penting?** Karena kamu bisa menguji berbagai skenario berdasarkan kondisi.

**Bagaimana cara kerjanya?** Gunakan metode dengan callback:

```php
<?php

it('returns different responses based on input', function () {
    $serviceMock = $this->mock(PaymentService::class, function ($mock) {
        $mock->shouldReceive('process')
             ->with(m::on(function ($value) {
                 return $value['amount'] > 100000;
             }))
             ->andReturn(['status' => 'high_value', 'fee' => 5000]);
             
        $mock->shouldReceive('process')
             ->with(m::on(function ($value) {
                 return $value['amount'] <= 100000;
             }))
             ->andReturn(['status' => 'standard', 'fee' => 1000]);
    });
    
    // Test dengan jumlah besar
    $result = $serviceMock->process(['amount' => 150000]);
    expect($result['status'])->toBe('high_value');
    
    // Test dengan jumlah kecil
    $result = $serviceMock->process(['amount' => 50000]);
    expect($result['status'])->toBe('standard');
});
```

### 12. 🔧 Membongkar Mock (Cleanup)

**Analogi:** Bayangkan kamu seorang penata panggung yang harus membersihkan semua alat bantu setelah pertunjukan selesai. Cleanup dalam mocking adalah seperti membersihkan semua mock setelah test selesai agar tidak mengganggu test berikutnya.

**Mengapa ini penting?** Karena satu test tidak boleh mempengaruhi test lain.

**Bagaimana cara kerjanya?** Laravel otomatis membersihkan mock setelah test, tapi kamu juga bisa manual:

```php
<?php

it('cleans up properly after test', function () {
    $mock = $this->mock(Service::class, function ($m) {
        $m->shouldReceive('method')->andReturn('test');
    });
    
    // Jalankan test...
    
    // Laravel otomatis membersihkan setelah test selesai
});
```

---

## Bagian 5: Menjadi Master Mocking Testing 🏆

### 13. ✨ Wejangan dari Guru

1.  **Gunakan mocking secara bijak**: Jangan mocking semua, hanya komponen yang benar-benar perlu.
2.  **Fokus pada behavior, bukan implementation**: Test apa yang seharusnya terjadi, bukan bagaimana implementasinya.
3.  **Gunakan spy saat kamu hanya ingin mengamati**: Jangan ganti perilaku hanya untuk mengamati.
4.  **Gunakan partial mock saat sebagian besar harus tetap asli**: Jangan full mock jika hanya butuh ganti satu metode.
5.  **Manfaatkan time travel untuk fitur time-sensitive**: Ini membuat test lebih cepat dan prediktif.
6.  **Jangan mock Request dan Config facade**: Gunakan alternatif yang lebih tepat.
7.  **Gunakan facade mocking untuk integrasi testing**: Ini membantu menguji alur tanpa eksekusi sebenarnya.

### 14. 📋 Cheat Sheet & Referensi Cepat

Untuk membantumu mengingat semua yang telah dipelajari, berikut ini adalah referensi cepat untuk berbagai fitur Mocking di Laravel:

#### 🧪 Jenis Mocking
| Metode | Fungsi | Kegunaan |
|--------|--------|----------|
| `mock()` | Full mock semua metode | Ganti seluruh perilaku objek |
| `partialMock()` | Sebagian metode diganti | Tetap gunakan sebagian metode asli |
| `spy()` | Amati interaksi | Tidak ganti perilaku, hanya catat |

#### 🏷️ Facade Mocking
| Metode | Fungsi |
|--------|--------|
| `Cache::shouldReceive()` | Mock method pada facade cache |
| `Mail::shouldReceive()` | Mock method pada facade mail |
| `Queue::shouldReceive()` | Mock method pada facade queue |
| `Event::shouldReceive()` | Mock method pada facade event |

#### 🧪 Mockery Matcher
| Matcher | Fungsi |
|---------|--------|
| `m::any()` | Terima parameter apa saja |
| `m::type('array')` | Parameter harus bertipe array |
| `m::on(callback)` | Parameter harus memenuhi callback |
| `m::subset(['key' => 'value'])` | Parameter harus berisi subset tertentu |

#### ⏳ Time Manipulation
| Metode | Fungsi |
|--------|--------|
| `$this->travel(5)->days()` | Melompat ke masa depan 5 hari |
| `$this->travel(-5)->days()` | Melompat ke masa lalu 5 hari |
| `$this->travelTo(date)` | Melompat ke tanggal tertentu |
| `$this->travelBack()` | Kembali ke waktu sekarang |
| `$this->freezeTime()` | Bekukan waktu selama eksekusi |
| `$this->freezeSecond()` | Bekukan waktu per detik |

#### 🧪 Assertion
| Assertion | Kegunaan |
|-----------|----------|
| `shouldHaveReceived()` | Cek metode dipanggil |
| `shouldNotHaveReceived()` | Cek metode tidak dipanggil |
| `times(n)` | Jumlah pemanggilan harus n kali |
| `with(params)` | Dipanggil dengan parameter tertentu |

#### 🚫 Tidak Direkomendasikan
| Action | Alasan |
|--------|--------|
| Mock Request facade | Gunakan HTTP method testing |
| Mock Config facade | Gunakan Config::set() |
| Mock DB facade | Gunakan RefreshDatabase |

#### 🧪 Pest Setup
| Setup | Fungsi |
|-------|--------|
| `uses(RefreshDatabase::class)` | Kombinasi dengan database testing |
| `beforeEach()` | Setup sebelum setiap test |
| `afterEach()` | Cleanup setelah setiap test |

### 15. 🧪 Contoh Lengkap Implementasi Mocking

Mari kita buat contoh lengkap implementasi mocking untuk fitur kompleks:

**1. Test untuk Order Processing:**
```php
<?php
// tests/Feature/OrderProcessingTest.php

use App\Services\PaymentService;
use App\Services\NotificationService;
use App\Services\InventoryService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Queue;

uses(RefreshDatabase::class);

it('processes order successfully with all integrations mocked', function () {
    // Mock semua service eksternal
    $paymentMock = $this->mock(PaymentService::class, function ($mock) {
        $mock->shouldReceive('charge')
             ->with(100000)
             ->andReturn(['success' => true, 'transaction_id' => 'trans_123']);
    });
    
    $notificationMock = $this->mock(NotificationService::class, function ($mock) {
        $mock->shouldReceive('sendOrderConfirmation')
             ->once();
    });
    
    $inventoryMock = $this->partialMock(InventoryService::class, function ($mock) {
        $mock->shouldReceive('decreaseStock')
             ->with('item_1', 1)
             ->andReturn(true);
    });
    
    // Spy cache dan queue
    Cache::spy();
    Queue::spy();
    
    // Buat order
    $order = Order::factory()->create([
        'total_amount' => 100000,
        'status' => 'pending',
    ]);
    
    // Proses order
    $result = $order->process();
    
    // Validasi hasil
    expect($result)->toBeTrue();
    expect($order->fresh()->status)->toBe('completed');
    
    // Cek semua service dipanggil dengan benar
    $paymentMock->shouldHaveReceived('charge');
    $notificationMock->shouldHaveReceived('sendOrderConfirmation');
    $inventoryMock->shouldHaveReceived('decreaseStock');
    
    // Cek cache dan queue juga digunakan
    Cache::shouldHaveReceived('put');
    Queue::shouldHaveReceived('push');
});
```

**2. Test untuk Error Handling:**
```php
<?php
// tests/Feature/PaymentErrorHandlingTest.php

use App\Services\PaymentService;

it('handles payment failures gracefully', function () {
    $this->mock(PaymentService::class, function ($mock) {
        $mock->shouldReceive('charge')
             ->andReturn(['success' => false, 'error' => 'Card declined']);
    });
    
    $order = Order::factory()->create(['total_amount' => 100000]);
    
    $result = $order->process();
    
    expect($result)->toBeFalse();
    expect($order->fresh()->status)->toBe('failed');
    expect($order->fresh()->failure_reason)->toBe('Card declined');
});

it('retries payment on temporary failure', function () {
    $attempt = 0;
    
    $this->mock(PaymentService::class, function ($mock) use (&$attempt) {
        $mock->shouldReceive('charge')
             ->andReturnUsing(function () use (&$attempt) {
                 $attempt++;
                 if ($attempt < 3) {
                     return ['success' => false, 'error' => 'Temporary failure'];
                 }
                 return ['success' => true, 'transaction_id' => 'trans_retry'];
             });
    });
    
    $order = Order::factory()->create(['total_amount' => 100000]);
    
    $result = $order->process();
    
    expect($result)->toBeTrue();
    expect($attempt)->toBe(3); // Coba 3 kali sebelum sukses
});
```

### 16. 🎯 Kesimpulan

Luar biasa! 🥳 Kamu sudah menyelesaikan seluruh materi tentang Mocking di Laravel, dari konsep dasar hingga teknik-teknik lanjut. Kamu hebat! Dengan memahami dan menerapkan mocking dengan benar, kamu sekarang bisa membuat test yang cepat, aman, dan fokus seperti seorang master testing.

Ingat, **mocking adalah alat penting dalam membentuk test suite yang handal**. Menguasainya berarti kamu sudah siap membuat aplikasi Laravel yang tidak hanya hebat, tapi juga mudah diuji dan dipercaya secara konsisten.

Jangan pernah berhenti bereksperimen dengan berbagai teknik mocking! Semakin mahir kamu menggunakannya, semakin percaya diri kamu dalam mengembangkan aplikasi yang berkualitas tinggi. Selamat ngoding, murid kesayanganku! 🚀🧪

# 📦 Eloquent: Serialization

## 🚀 Pendahuluan

Saat membangun **API dengan Laravel**, seringkali kita perlu mengubah *model* dan relasi ke dalam bentuk **array** atau **JSON**. Laravel Eloquent sudah menyediakan metode praktis untuk melakukan konversi ini, termasuk mengontrol atribut mana saja yang akan disertakan.

👉 Untuk pendekatan yang lebih canggih, bisa menggunakan **Eloquent API Resources** yang disediakan Laravel.

---

## 🔄 Serialisasi Model dan Koleksi

### 📑 Serialisasi ke Array

Untuk mengubah model beserta relasinya menjadi array, gunakan metode `toArray`. Metode ini bersifat **rekursif**, sehingga semua atribut dan relasi (termasuk relasi di dalam relasi) akan otomatis dikonversi.

```php
use App\Models\User;

$user = User::with('roles')->first();

return $user->toArray();
```

🔹 Jika hanya ingin mengubah atribut tanpa relasi, gunakan `attributesToArray`:

```php
$user = User::first();

return $user->attributesToArray();
```

🔹 Koleksi model juga bisa diubah menjadi array:

```php
$users = User::all();

return $users->toArray();
```

---

### 🌐 Serialisasi ke JSON

Untuk mengubah model menjadi JSON, gunakan metode `toJson`. Sama seperti `toArray`, metode ini juga rekursif.

```php
use App\Models\User;

$user = User::find(1);

return $user->toJson();

// Dengan format rapi
return $user->toJson(JSON_PRETTY_PRINT);
```

🔹 Cara lain, cukup *casting* model ke string:

```php
return (string) User::find(1);
```

🔹 Karena model/collection otomatis diubah menjadi JSON ketika di-*return*, kita bisa langsung:

```php
Route::get('/users', function () {
    return User::all();
});
```

---

## 🤝 Relasi dalam JSON

Ketika model Eloquent diubah menjadi JSON, relasi yang telah dimuat otomatis ikut ditambahkan sebagai atribut. Menariknya, meskipun relasi didefinisikan dengan **camelCase**, dalam JSON atributnya akan otomatis menjadi **snake\_case**.

---

## 🔒 Menyembunyikan Atribut dari JSON

Kadang ada atribut yang **tidak boleh ditampilkan** (misalnya password). Untuk itu gunakan properti `$hidden`.

```php
class User extends Model
{
    protected $hidden = ['password'];
}
```

🔹 Jika ingin menyembunyikan **relasi**, cukup tambahkan nama metodenya ke dalam `$hidden`.

🔹 Alternatifnya, gunakan `$visible` untuk menentukan atribut mana saja yang boleh ditampilkan:

```php
class User extends Model
{
    protected $visible = ['first_name', 'last_name'];
}
```

---

## 👀 Modifikasi Sementara pada Visibilitas

Laravel menyediakan metode untuk **menampilkan atau menyembunyikan atribut sementara**:

```php
// Menampilkan atribut yang biasanya tersembunyi
return $user->makeVisible('attribute')->toArray();

// Menambahkan beberapa atribut untuk ditampilkan
return $user->mergeVisible(['name', 'email'])->toArray();

// Menyembunyikan atribut yang biasanya terlihat
return $user->makeHidden('attribute')->toArray();

// Menyembunyikan banyak atribut
return $user->mergeHidden(['name', 'email'])->toArray();

// Override total atribut yang terlihat
return $user->setVisible(['id', 'name'])->toArray();

// Override total atribut yang tersembunyi
return $user->setHidden(['email', 'password', 'remember_token'])->toArray();
```

---

## ➕ Menambahkan Nilai ke JSON

Kadang kita ingin menambahkan atribut tambahan (yang **tidak ada di database**) ketika model diubah menjadi array/JSON. Caranya dengan membuat **accessor**.

```php
class User extends Model
{
    protected function isAdmin(): Attribute
    {
        return new Attribute(
            get: fn () => 'yes',
        );
    }
}
```

🔹 Supaya selalu ditambahkan, masukkan ke dalam `$appends`:

```php
class User extends Model
{
    protected $appends = ['is_admin'];
}
```

🔹 Bisa juga menambahkan atribut tambahan **secara runtime**:

```php
return $user->append('is_admin')->toArray();

return $user->mergeAppends(['is_admin', 'status'])->toArray();

return $user->setAppends(['is_admin'])->toArray();
```

---

## ⏰ Serialisasi Tanggal

### 🎯 Mengubah Format Default

Jika ingin mengubah format tanggal secara global, override metode `serializeDate`:

```php
protected function serializeDate(DateTimeInterface $date): string
{
    return $date->format('Y-m-d');
}
```

### 📌 Format Per Atribut

Jika ingin berbeda per atribut, gunakan `casts`:

```php
protected function casts(): array
{
    return [
        'birthday' => 'date:Y-m-d',
        'joined_at' => 'datetime:Y-m-d H:00',
    ];
}
```

---

## ✅ Kesimpulan

Dengan fitur **Serialization di Eloquent**, kita bisa:

* Mengubah model dan koleksi ke **array** atau **JSON** dengan mudah 🧩
* Mengontrol atribut yang tampil/tersembunyi 🔒
* Menambahkan atribut tambahan sesuai kebutuhan ➕
* Menyesuaikan format tanggal sesuai standar aplikasi ⏰

✨ Semua ini memudahkan kita dalam membangun **API Laravel yang aman, fleksibel, dan terstruktur**.

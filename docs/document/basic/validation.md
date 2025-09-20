# 📘 Laravel Validation

## 1. Pendahuluan
Validasi di Laravel berguna untuk memastikan data yang masuk **sesuai aturan**, **aman**, dan **siap diproses**.  

Ada beberapa cara melakukan validasi:
- **Method `validate()`** → cara tercepat.
- **Form Request** → untuk aturan validasi yang kompleks.
- **Validator Class** → memberi kendali penuh.

Laravel sudah menyediakan banyak aturan bawaan, misalnya:
- `required`, `unique`, `max`, `min`, `email`, `exists`, dll.  

---

## 2. Quickstart Validasi

### 2.1 Definisi Route
```php
// routes/web.php
use App\Http\Controllers\PostController;

Route::get('/post/create', [PostController::class, 'create']);
Route::post('/post', [PostController::class, 'store']);
````

* `GET /post/create` → tampilkan form.
* `POST /post` → proses & simpan data.

---

### 2.2 Membuat Controller

```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class PostController extends Controller
{
    public function create(): View
    {
        return view('post.create');
    }

    public function store(Request $request): RedirectResponse
    {
        // validasi nanti ditulis di sini
        return redirect('/posts');
    }
}
```

---

### 2.3 Menulis Logika Validasi

```php
public function store(Request $request): RedirectResponse
{
    $validated = $request->validate([
        'title' => 'required|unique:posts|max:255',
        'body'  => 'required',
    ]);

    // Post::create($validated);

    return redirect('/posts');
}
```

👉 Jika validasi gagal → otomatis redirect kembali + error message.
👉 Jika lolos → `$validated` berisi data yang sudah bersih.

---

### 2.4 Alternatif Array Rules

```php
$validated = $request->validate([
    'title' => ['required', 'unique:posts', 'max:255'],
    'body'  => ['required'],
]);
```

Lebih rapi & enak dibaca untuk aturan panjang.

---

## 3. Menampilkan Pesan Error di View

```blade
@if ($errors->any())
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form method="POST" action="/post">
    @csrf
    <input type="text" name="title" value="{{ old('title') }}">
    <textarea name="body">{{ old('body') }}</textarea>
    <button type="submit">Submit</button>
</form>
```

👉 `old('field')` menjaga input lama tetap muncul jika validasi gagal.

---

## 4. Form Request Validation

Cara yang lebih bersih, cocok untuk aturan validasi panjang.

### 4.1 Membuat Request

```bash
php artisan make:request StorePostRequest
```

### 4.2 Menulis Rules

```php
public function rules(): array
{
    return [
        'title' => 'required|unique:posts|max:255',
        'body'  => 'required',
    ];
}
```

### 4.3 Pakai di Controller

```php
public function store(StorePostRequest $request): RedirectResponse
{
    $validated = $request->validated();
    // Post::create($validated);

    return redirect('/posts');
}
```

---

## 5. Validator Manual

Cocok jika butuh kendali penuh atas proses validasi.

```php
use Illuminate\Support\Facades\Validator;

$validator = Validator::make($request->all(), [
    'title' => 'required|unique:posts|max:255',
    'body'  => 'required',
]);

if ($validator->fails()) {
    return redirect('/post/create')
        ->withErrors($validator)
        ->withInput();
}

$validated = $validator->validated();
```

---

## 6. Kustomisasi Pesan Error

```php
public function messages(): array
{
    return [
        'title.required' => 'Judul wajib diisi!',
        'body.required'  => 'Konten tidak boleh kosong!',
    ];
}
```

---

## 7. Validasi pada XHR / AJAX

Jika validasi gagal pada request AJAX, Laravel otomatis kirim JSON:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "title": ["Judul wajib diisi."],
    "body": ["Konten tidak boleh kosong."]
  }
}
```

---

## 8. Validasi Kondisional

### 8.1 exclude\_if & exclude\_unless

```php
$validator = Validator::make($data, [
    'has_appointment' => 'required|boolean',
    'appointment_date' => 'exclude_if:has_appointment,false|required|date',
    'doctor_name' => 'exclude_if:has_appointment,false|required|string',
]);
```

### 8.2 sometimes (hanya jika field ada)

```php
$validator = Validator::make($data, [
    'email' => 'sometimes|required|email',
]);
```

### 8.3 Validasi kompleks dengan closure

```php
$validator->sometimes('reason', 'required|max:500', function ($input) {
    return $input->games >= 100;
});
```

---

## 9. Validasi Array & Nested Input

### 9.1 Dot Notation

```php
'photos.profile' => 'required|image',
```

### 9.2 Elemen Array

```php
'users.*.email' => 'email|unique:users',
```

### 9.3 Rule::forEach

```php
'companies.*.id' => Rule::forEach(fn ($value) => [
    Rule::exists(Company::class, 'id'),
    new HasPermission('manage-company', $value),
]),
```

---

## 10. Validasi File & Gambar

### 10.1 File

```php
'attachment' => [
    'required',
    File::types(['mp3', 'wav'])->min(1024)->max(12 * 1024),
],
```

### 10.2 Gambar

```php
'photo' => [
    'required',
    File::image()->min(1024)->max(12 * 1024),
],
```

---

## 11. Validasi Password

```php
'password' => ['required', 'confirmed', Password::min(8)
    ->letters()
    ->mixedCase()
    ->numbers()
    ->symbols()
    ->uncompromised()
],
```

---

## 12. Custom Validation Rule

### 12.1 Dengan Rule Object

```bash
php artisan make:rule Uppercase
```

```php
class Uppercase implements ValidationRule {
    public function validate($attribute, $value, $fail): void {
        if (strtoupper($value) !== $value) {
            $fail('The :attribute must be uppercase.');
        }
    }
}
```

### 12.2 Dengan Closure

```php
'title' => [
    'required',
    function ($attribute, $value, $fail) {
        if ($value === 'foo') {
            $fail("The {$attribute} is invalid.");
        }
    },
],
```

---

## 📑 Laravel Validation Rules – Cheat Sheet + Contoh

### 🟢 Booleans

| Rule         | Fungsi                           | Contoh                                    |
| ------------ | -------------------------------- | ----------------------------------------- |
| accepted     | Harus disetujui (yes/on/1)       | `'terms' => 'accepted'`                   |
| accepted\_if | Disetujui jika kondisi terpenuhi | `'terms' => 'accepted_if:role,admin'`     |
| declined     | Harus ditolak                    | `'newsletter' => 'declined'`              |
| declined\_if | Ditolak jika kondisi terpenuhi   | `'newsletter' => 'declined_if:role,user'` |
| boolean      | Harus true/false/1/0             | `'active' => 'boolean'`                   |

---

### 🔤 Strings

| Rule                                    | Fungsi                                | Contoh                                       |
| --------------------------------------- | ------------------------------------- | -------------------------------------------- |
| alpha                                   | Hanya huruf                           | `'name' => 'alpha'`                          |
| alpha\_dash                             | Huruf, angka, - , \_                  | `'username' => 'alpha_dash'`                 |
| alpha\_num                              | Huruf + angka                         | `'code' => 'alpha_num'`                      |
| ascii                                   | Hanya ASCII                           | `'slug' => 'ascii'`                          |
| confirmed                               | Harus cocok dengan \_confirmation     | `'password' => 'confirmed'`                  |
| current\_password                       | Cek password user                     | `'password' => 'current_password'`           |
| different                               | Harus beda dengan field lain          | `'new_password' => 'different:old_password'` |
| email                                   | Format email valid                    | `'email' => 'email'`                         |
| url                                     | Format URL valid                      | `'website' => 'url'`                         |
| ip                                      | IP valid                              | `'server_ip' => 'ip'`                        |
| json                                    | Harus JSON valid                      | `'config' => 'json'`                         |
| in / not\_in                            | Harus (atau tidak boleh) dalam daftar | `'role' => 'in:admin,editor,user'`           |
| regex / not\_regex                      | Cocok (atau tidak) dengan regex       | `'phone' => 'regex:/^[0-9]{10}$/'`           |
| starts\_with / ends\_with               | Harus diawali/diakhiri string         | `'code' => 'starts_with:INV-'`               |
| doesnt\_start\_with / doesnt\_end\_with | Tidak boleh diawali/diakhiri string   | `'slug' => 'doesnt_start_with:test'`         |
| string                                  | Harus string                          | `'title' => 'string'`                        |
| lowercase / uppercase                   | Format huruf kecil/besar              | `'username' => 'lowercase'`                  |
| uuid / ulid                             | ID unik valid                         | `'id' => 'uuid'`                             |
| hex\_color                              | Warna HEX valid                       | `'color' => 'hex_color'`                     |
| enum                                    | Nilai sesuai enum                     | `'status' => [new Enum(StatusEnum::class)]`  |

---

### 🔢 Numbers

| Rule                | Fungsi                      | Contoh                              |
| ------------------- | --------------------------- | ----------------------------------- |
| numeric             | Harus angka                 | `'price' => 'numeric'`              |
| integer             | Harus bilangan bulat        | `'age' => 'integer'`                |
| decimal             | Angka desimal               | `'rating' => 'decimal:2'`           |
| digits              | Jumlah digit tertentu       | `'pin' => 'digits:6'`               |
| digits\_between     | Jumlah digit antara x-y     | `'phone' => 'digits_between:10,13'` |
| min / max / between | Range nilai                 | `'score' => 'between:1,100'`        |
| size                | Harus bernilai sama dengan  | `'tickets' => 'size:5'`             |
| gt / gte            | Lebih besar dari field lain | `'end' => 'gt:start'`               |
| lt / lte            | Lebih kecil dari field lain | `'discount' => 'lte:100'`           |
| multiple\_of        | Harus kelipatan             | `'quantity' => 'multiple_of:5'`     |

---

### 📦 Arrays

| Rule                       | Fungsi                  | Contoh                               |          |
| -------------------------- | ----------------------- | ------------------------------------ | -------- |
| array                      | Harus array             | `'tags' => 'array'`                  |          |
| min / max / size / between | Jumlah elemen           | \`'tags' => 'min:2                   | max:5'\` |
| distinct                   | Semua elemen unik       | `'emails.*' => 'distinct'`           |          |
| in\_array                  | Value ada di array lain | `'selected' => 'in_array:options.*'` |          |
| in\_array\_keys            | Key ada di array lain   | `'key' => 'in_array_keys:data'`      |          |
| contains / doesnt\_contain | Cek keberadaan elemen   | `'roles' => 'contains:admin'`        |          |
| list                       | Harus berupa daftar     | `'items' => 'list'`                  |          |

---

### 📅 Dates

| Rule                                 | Fungsi                       | Contoh                                        |
| ------------------------------------ | ---------------------------- | --------------------------------------------- |
| date                                 | Format tanggal valid         | `'start_date' => 'date'`                      |
| date\_equals                         | Sama dengan tanggal tertentu | `'event_date' => 'date_equals:2025-01-01'`    |
| date\_format                         | Format tertentu              | `'published_at' => 'date_format:Y-m-d H:i:s'` |
| before / after                       | Sebelum / sesudah tanggal    | `'end_date' => 'after:start_date'`            |
| before\_or\_equal / after\_or\_equal | <= / >= tanggal              | `'signup' => 'before_or_equal:today'`         |
| timezone                             | Zona waktu valid             | `'tz' => 'timezone'`                          |

---

### 📂 Files

| Rule                       | Fungsi                  | Contoh                                                  |
| -------------------------- | ----------------------- | ------------------------------------------------------- |
| file                       | Harus file              | `'doc' => 'file'`                                       |
| image                      | Hanya gambar            | `'avatar' => 'image'`                                   |
| mimes                      | Ekstensi file           | `'resume' => 'mimes:pdf,docx'`                          |
| mimetypes                  | MIME type               | `'video' => 'mimetypes:video/mp4'`                      |
| extensions                 | Ekstensi valid          | `'file' => 'extensions:jpg,png'`                        |
| size / min / max / between | Ukuran file (KB)        | `'photo' => 'max:2048'`                                 |
| dimensions                 | Validasi dimensi gambar | `'banner' => 'dimensions:min_width=100,max_height=500'` |

---

### 🗄️ Database

| Rule   | Fungsi           | Contoh                            |
| ------ | ---------------- | --------------------------------- |
| exists | Value ada di DB  | `'user_id' => 'exists:users,id'`  |
| unique | Value unik di DB | `'email' => 'unique:users,email'` |

---

### ⚙️ Utilities

| Rule                               | Fungsi                                 | Contoh                                                |          |          |
| ---------------------------------- | -------------------------------------- | ----------------------------------------------------- | -------- | -------- |
| required                           | Wajib diisi                            | `'title' => 'required'`                               |          |          |
| required\_if / unless              | Wajib jika/kecuali kondisi             | `'reason' => 'required_if:status,rejected'`           |          |          |
| required\_with / without           | Wajib jika ada/tidak ada field lain    | `'password' => 'required_with:password_confirmation'` |          |          |
| required\_with\_all / without\_all | Wajib jika semua field ada/tidak ada   | `'address' => 'required_with_all:city,state'`         |          |          |
| nullable                           | Boleh kosong                           | `'middle_name' => 'nullable'`                         |          |          |
| sometimes                          | Validasi hanya jika field ada          | \`'avatar' => 'sometimes                              | image'\` |          |
| prohibited                         | Field tidak boleh ada                  | `'debug' => 'prohibited'`                             |          |          |
| prohibited\_if / unless            | Dilarang jika/kecuali kondisi          | `'api_key' => 'prohibited_if:env,production'`         |          |          |
| prohibits                          | Jika field ini ada, yang lain dilarang | `'admin' => 'prohibits:user'`                         |          |          |
| present                            | Harus ada di request (boleh kosong)    | `'token' => 'present'`                                |          |          |
| missing                            | Harus tidak ada di request             | `'legacy_field' => 'missing'`                         |          |          |
| exclude                            | Hilangkan dari validasi                | `'internal' => 'exclude'`                             |          |          |
| exclude\_if / unless               | Hilangkan jika/kecuali kondisi         | `'comment' => 'exclude_if:status,draft'`              |          |          |
| bail                               | Hentikan validasi jika gagal           | \`'username' => 'bail                                 | required | min:3'\` |
| any\_of                            | Lolos jika sesuai salah satu rule      | `'field' => 'any_of:email,uuid'`                      |          |          |

---

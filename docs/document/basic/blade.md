# Templates Laravel

## 📘Pendahuluan

Blade adalah **templating engine** yang sederhana namun sangat kuat yang sudah tersedia secara bawaan pada **Laravel**.
Berbeda dengan beberapa templating engine PHP lainnya, Blade tidak membatasi penggunaan kode PHP biasa di dalam template.

Semua template Blade akan dikompilasi menjadi kode PHP biasa dan disimpan (cached) hingga ada perubahan.
Artinya, Blade menambahkan **nyaris nol overhead** ke aplikasi Anda.

File template Blade memiliki ekstensi:

```
.blade.php
```

dan biasanya disimpan di direktori:

```
resources/views
```

Untuk menampilkan sebuah view menggunakan Blade, kita bisa memanggil helper global `view` baik di **route** maupun di **controller**.

**Contoh**

```php
// routes/web.php
Route::get('/', function () {
    return view('greeting', ['name' => 'Finn']);
});
```

File `resources/views/greeting.blade.php`:

```blade
<!DOCTYPE html>
<html>
<head>
    <title>Greeting</title>
</head>
<body>
    <h1>Hello, {{ $name }}!</h1>
</body>
</html>
```

---

#### Blade + Livewire: Level Berikutnya

Jika ingin membuat **UI dinamis** tanpa ribet dengan framework frontend seperti React atau Vue, Anda bisa menggunakan **Laravel Livewire**.

Livewire memungkinkan kita menulis **komponen Blade** yang memiliki interaktivitas tinggi, tanpa perlu build step JavaScript yang rumit.
Dengan cara ini, Anda bisa membangun frontend modern yang **reaktif** hanya dengan PHP dan Blade.

---

## 📘Menampilkan Data

Data yang diterima dari route atau controller dapat ditampilkan pada Blade dengan cara membungkus variabel menggunakan kurung kurawal ganda `{{ }}`.

**Contoh**

```php
// routes/web.php
Route::get('/', function () {
    return view('welcome', ['name' => 'Samantha']);
});
```

File `resources/views/welcome.blade.php`:

```blade
<h1>Hello, {{ $name }}.</h1>
```

> Blade secara otomatis akan melindungi output menggunakan fungsi `htmlspecialchars` PHP untuk mencegah serangan **XSS**.

Selain variabel, Anda juga bisa menampilkan hasil dari fungsi PHP.

```blade
<p>Waktu UNIX sekarang adalah {{ time() }}.</p>
```

---

#### HTML Entity Encoding

Secara bawaan, Blade akan melakukan **double encoding** pada HTML entities.
Jika ingin menonaktifkannya, panggil metode `Blade::withoutDoubleEncoding()` pada `AppServiceProvider`.

**Contoh**

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Blade::withoutDoubleEncoding();
    }
}
```

---

#### Menampilkan Data Tanpa Escape

Jika Anda ingin menampilkan data **apa adanya** (tanpa htmlspecialchars), gunakan sintaks `{!! !!}`.

**Contoh**

```blade
Hello, {!! $name !!}.
```

⚠️ **Peringatan**: Jangan gunakan ini untuk data yang berasal dari input pengguna, karena rentan terhadap **XSS attack**.

---

#### Blade dan Framework JavaScript

Banyak framework JavaScript (misalnya Vue.js) juga menggunakan kurung kurawal `{{ }}`.
Untuk mencegah Blade mengeksekusi ekspresi ini, gunakan simbol `@`.

**Contoh**

```blade
<h1>Laravel</h1>
Hello, @{{ name }}.
```

Hasil keluaran:

```html
<h1>Laravel</h1>
Hello, {{ name }}.
```

Selain itu, simbol `@` juga dapat digunakan untuk **escape directive Blade**:

```blade
{{-- Blade template --}}
@@if()

<!-- HTML output -->
@if()
```

---

#### Rendering JSON

Seringkali kita ingin mengoper array dari PHP ke JavaScript.
Alih-alih menggunakan `json_encode` secara manual, kita dapat memanfaatkan `Js::from()`.

**Contoh**

```blade
<script>
    //var app = {{ Js::from($array) }};
</script>
```

Metode ini lebih aman karena memastikan JSON sudah di-escape dengan benar agar tidak rusak saat dimasukkan ke dalam HTML.

---

#### Direktif @verbatim

Jika Anda menulis blok kode besar dengan JavaScript yang menggunakan kurung kurawal `{{ }}`, Anda bisa membungkusnya dengan direktif `@verbatim`.

Dengan begitu, Blade tidak akan mencoba untuk memproses isinya.

**Contoh**

```blade
@verbatim
    <div id="app">
        Hello, {{ name }}.
    </div>
@endverbatim
```

---


## 📘Blade Directives

Selain untuk **pewarisan template** dan **menampilkan data**, Blade juga menyediakan **direktif** (directives) yang merupakan shortcut untuk berbagai struktur kontrol PHP.

Direktif ini membuat sintaks menjadi lebih bersih, ringkas, dan tetap mudah dipahami karena mirip dengan PHP aslinya.

---

### If Statements (Percabangan)

Blade menyediakan direktif untuk percabangan seperti `@if`, `@elseif`, `@else`, dan `@endif`.

**Contoh**

```blade
@if (count($records) === 1)
    Saya hanya punya satu data!
@elseif (count($records) > 1)
    Saya punya banyak data!
@else
    Saya tidak punya data sama sekali!
@endif
```

Selain itu, ada juga `@unless` yang merupakan kebalikan dari `@if`.

```blade
@unless (Auth::check())
    Anda belum login.
@endunless
```

Blade juga menyediakan `@isset` dan `@empty`:

```blade
@isset($records)
    // $records terdefinisi dan tidak null
@endisset

@empty($records)
    // $records kosong
@endempty
```

---

### Authentication Directives

Untuk memeriksa apakah user sedang login atau guest, Blade menyediakan `@auth` dan `@guest`.

```blade
@auth
    // User sedang login
@endauth

@guest
    // User adalah guest
@endguest
```

Anda juga bisa menentukan guard:

```blade
@auth('admin')
    // User login dengan guard admin
@endauth

@guest('admin')
    // User guest di guard admin
@endguest
```

---

### Environment Directives

Blade bisa mendeteksi environment aplikasi (production, staging, local, dll).

```blade
@production
    // Kode ini hanya tampil di production
@endproduction
```

Atau dengan `@env`:

```blade
@env('staging')
    // Hanya untuk staging
@endenv

@env(['staging', 'production'])
    // Untuk staging atau production
@endenv
```

---

### Section Directives

Untuk memeriksa apakah sebuah section memiliki konten:

```blade
@hasSection('navigation')
    <div>
        @yield('navigation')
    </div>
@endif
```

Atau sebaliknya, jika section kosong:

```blade
@sectionMissing('navigation')
    @include('default-navigation')
@endif
```

---

### Session Directives

Blade menyediakan `@session` untuk memeriksa apakah ada nilai di session.

```blade
@session('status')
    <div class="p-4 bg-green-100">
        {{ $value }}
    </div>
@endsession
```

---

### Context Directives

Sama seperti session, tetapi digunakan untuk memeriksa **context**.

```blade
@context('canonical')
    <link href="{{ $value }}" rel="canonical">
@endcontext
```

---

### Switch Statements

Blade mendukung struktur `switch case` dengan sintaks sederhana:

```blade
@switch($i)
    @case(1)
        Kasus pertama
        @break

    @case(2)
        Kasus kedua
        @break

    @default
        Default case
@endswitch
```

---

### Loops (Perulangan)

Blade mendukung semua loop PHP (`for`, `foreach`, `forelse`, `while`).

**Contoh**

```blade
@for ($i = 0; $i < 10; $i++)
    Nilai sekarang: {{ $i }}
@endfor

@foreach ($users as $user)
    <p>Ini user {{ $user->id }}</p>
@endforeach

@forelse ($users as $user)
    <li>{{ $user->name }}</li>
@empty
    <p>Tidak ada user.</p>
@endforelse

@while (false)
    <p>Looping selamanya (tidak jalan)</p>
@endwhile
```

Anda juga bisa skip atau break loop:

```blade
@foreach ($users as $user)
    @continue($user->type == 1)
    <li>{{ $user->name }}</li>
    @break($user->number == 5)
@endforeach
```

---

### Variabel \$loop

Di dalam `@foreach`, tersedia variabel khusus `$loop` untuk mendapatkan informasi tentang iterasi.

```blade
@foreach ($users as $user)
    @if ($loop->first)
        Iterasi pertama
    @endif

    @if ($loop->last)
        Iterasi terakhir
    @endif

    <p>User: {{ $user->id }}</p>
@endforeach
```

#### Properti `$loop`:

| Properti           | Deskripsi           |
| ------------------ | ------------------- |
| `$loop->index`     | Index (mulai 0)     |
| `$loop->iteration` | Iterasi (mulai 1)   |
| `$loop->remaining` | Sisa iterasi        |
| `$loop->count`     | Jumlah total item   |
| `$loop->first`     | Iterasi pertama     |
| `$loop->last`      | Iterasi terakhir    |
| `$loop->even`      | Iterasi genap       |
| `$loop->odd`       | Iterasi ganjil      |
| `$loop->depth`     | Level nesting loop  |
| `$loop->parent`    | Akses ke loop induk |

---

### Conditional Classes & Styles

Blade memudahkan pembuatan class CSS dan inline style secara kondisional.

```blade
@php
    $isActive = false;
    $hasError = true;
@endphp

<span @class([
    'p-4',
    'font-bold' => $isActive,
    'text-gray-500' => ! $isActive,
    'bg-red' => $hasError,
])></span>
```

Hasil HTML:

```html
<span class="p-4 text-gray-500 bg-red"></span>
```

Untuk style:

```blade
@php
    $isActive = true;
@endphp

<span @style([
    'background-color: red',
    'font-weight: bold' => $isActive,
])></span>
```

Hasil:

```html
<span style="background-color: red; font-weight: bold;"></span>
```

---

### Additional Attributes

Blade menyediakan shortcut untuk atribut HTML:

```blade
<input type="checkbox" @checked($user->active)>
<select>
    <option @selected($version == '1.0')>1.0</option>
</select>
<button @disabled($errors->isNotEmpty())>Submit</button>
<input type="text" @readonly($user->isNotAdmin())>
<input type="text" @required($user->isAdmin())>
```

---

### Including Subviews

Untuk menyertakan view lain:

```blade
@include('shared.errors')
@include('view.name', ['status' => 'complete'])
@includeIf('view.optional')
@includeWhen($user->isAdmin(), 'view.admin')
@includeUnless($user->isGuest(), 'view.member')
@includeFirst(['custom.admin', 'admin'])
```

---

### Rendering Views for Collections

Menggabungkan loop dan include dengan `@each`.

```blade
@each('partials.job', $jobs, 'job', 'partials.empty')
```

---

### The @once Directive

Digunakan untuk memastikan bagian template hanya dieksekusi sekali.

```blade
@once
    @push('scripts')
        <script>alert("Hello");</script>
    @endpush
@endonce
```

---

### Raw PHP

Jika perlu menjalankan kode PHP langsung:

```blade
@php
    $counter = 1;
@endphp
```

Import class dengan `@use`:

```blade
@use('App\Models\Flight')
@use('App\Models\Flight', 'FlightModel')
@use('App\Models\{Flight, Airport}')
```

Import function atau constant:

```blade
@use(function App\Helpers\format_currency, 'formatMoney')
@use(const App\Constants\MAX_ATTEMPTS, 'MAX_TRIES')
```

---

### Komentar

Blade mendukung komentar yang tidak akan muncul di HTML output.

```blade
{{-- Ini adalah komentar dan tidak akan tampil di browser --}}
```

---


## 📘Components

### 1. Pendahuluan

**Blade Components** adalah fitur Laravel yang memungkinkan kita untuk membangun UI yang lebih terstruktur, dapat digunakan ulang, dan mudah dikelola.
Konsep ini mirip dengan *layouts*, *sections*, dan *includes*, tetapi lebih fleksibel dan modern.
Ada dua jenis utama **components** di Blade:

* **Class-based Component** → memiliki class PHP dan view.
* **Anonymous Component** → hanya berupa view tanpa class.

---

### 2. Membuat Component

#### 2.1 Class-Based Component

Gunakan perintah artisan berikut:

```bash
php artisan make:component Alert
```

📂 Laravel akan membuat:

* Class di `app/View/Components/Alert.php`
* View di `resources/views/components/alert.blade.php`

Contoh struktur:

```
app/
 └── View/
     └── Components/
         └── Alert.php
resources/
 └── views/
     └── components/
         └── alert.blade.php
```

---

#### 2.2 Subdirektori Component

Kita bisa menaruh component dalam folder:

```bash
php artisan make:component Forms/Input
```

📂 Hasil:

* `app/View/Components/Forms/Input.php`
* `resources/views/components/forms/input.blade.php`

Render di Blade:

```blade
<x-forms.input />
```

---

#### 2.3 Anonymous Component

Untuk membuat component tanpa class:

```bash
php artisan make:component forms.input --view
```

📂 Hasil:
`resources/views/components/forms/input.blade.php`

Render di Blade:

```blade
<x-forms.input />
```

---

### 3. Registrasi Manual Komponen Package

Jika Anda membangun **package**, component harus diregistrasikan secara manual.

```php
use Illuminate\Support\Facades\Blade;
use VendorPackage\View\Components\AlertComponent;

public function boot(): void
{
    Blade::component('package-alert', AlertComponent::class);
}
```

Pemakaian:

```blade
<x-package-alert />
```

Atau gunakan **namespace** agar otomatis:

```php
Blade::componentNamespace('Nightshade\\Views\\Components', 'nightshade');
```

Render di Blade:

```blade
<x-nightshade::calendar />
<x-nightshade::color-picker />
```

---

### 4. Rendering Component

#### 4.1 Pemanggilan Sederhana

```blade
<x-alert />
<x-user-profile />
```

#### 4.2 Component dalam Subdirektori

Jika file ada di `app/View/Components/Inputs/Button.php`:

```blade
<x-inputs.button />
```

#### 4.3 Conditional Rendering

Gunakan method `shouldRender()` pada class component:

```php
public function shouldRender(): bool
{
    return strlen($this->message) > 0;
}
```

Jika `false`, component tidak akan ditampilkan.

---

### 5. Passing Data ke Component

#### 5.1 Melalui Attribute

```blade
<x-alert type="error" :message="$message" />
```

#### 5.2 Definisi di Constructor

```php
class Alert extends Component
{
    public function __construct(
        public string $type,
        public string $message,
    ) {}

    public function render(): View
    {
        return view('components.alert');
    }
}
```

#### 5.3 Pemakaian di View

```blade
<div class="alert alert-{{ $type }}">
    {{ $message }}
</div>
```

---

### 6. Slots

#### 6.1 Default Slot

```blade
<x-alert>
    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

Component `alert.blade.php`:

```blade
<div class="alert alert-danger">
    {{ $slot }}
</div>
```

---

#### 6.2 Named Slot

```blade
<x-alert>
    <x-slot:title>
        Server Error
    </x-slot>
    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

`alert.blade.php`:

```blade
<span class="alert-title">{{ $title }}</span>
<div class="alert alert-danger">
    {{ $slot }}
</div>
```

---

#### 6.3 Scoped Slot

Mengakses method dari component class melalui `$component`:

```blade
<x-alert>
    <x-slot:title>
        {{ $component->formatAlert('Server Error') }}
    </x-slot>
    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

---

### 7. Component Attributes

#### 7.1 Atribut Default & Merge

```blade
<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}>
    {{ $message }}
</div>
```

Pemanggilan:

```blade
<x-alert type="error" :message="$message" class="mb-4" />
```

Hasil HTML:

```html
<div class="alert alert-error mb-4">
    <!-- isi $message -->
</div>
```

---

### 8. Inline Components

Kadang kita tidak butuh file view terpisah. Bisa langsung return string:

```php
public function render(): string
{
    return <<<'blade'
        <div class="alert alert-danger">
            {{ $slot }}
        </div>
    blade;
}
```

Atau buat langsung dengan artisan:

```bash
php artisan make:component Alert --inline
```

---

### 9. Dynamic Components

Jika component ditentukan saat runtime:

```php
$componentName = "secondary-button";
```

Render:

```blade
<x-dynamic-component :component="$componentName" class="mt-4" />
```

---


## 📘Anonymous Components

### 1. Pendahuluan

**Anonymous Components** adalah cara sederhana untuk membuat komponen Blade tanpa harus menuliskan class PHP.
Mirip dengan **inline components**, tetapi anonymous components hanya berupa **satu file Blade** di dalam folder `resources/views/components`.

Contoh: jika kita membuat file berikut:

```
resources/views/components/alert.blade.php
```

Maka kita bisa langsung memanggilnya di template:

```blade
<x-alert />
```

Jika komponen berada di dalam subdirektori:

```
resources/views/components/inputs/button.blade.php
```

Maka cara pemanggilannya:

```blade
<x-inputs.button />
```

---

### 2. Anonymous Index Components

Terkadang sebuah komponen memiliki beberapa file terkait.
Misalnya komponen **accordion**:

```
/resources/views/components/accordion.blade.php
/resources/views/components/accordion/item.blade.php
```

Pemanggilan:

```blade
<x-accordion>
    <x-accordion.item>
        ...
    </x-accordion.item>
</x-accordion>
```

👉 Tetapi pendekatan di atas mengharuskan file utama `accordion.blade.php` berada langsung di folder `components/`.

Laravel menyediakan solusi: gunakan **index component**.
Ubah struktur folder:

```
/resources/views/components/accordion/accordion.blade.php
/resources/views/components/accordion/item.blade.php
```

Dan tetap bisa dipanggil dengan cara yang sama:

```blade
<x-accordion>
    <x-accordion.item>...</x-accordion.item>
</x-accordion>
```

---

### 3. Data Properties & Attributes

Karena anonymous component tidak punya class, kita perlu mendefinisikan properti datanya.
Gunakan direktif `@props` di bagian atas file Blade.

Contoh:

```blade
{{-- /resources/views/components/alert.blade.php --}}
@props(['type' => 'info', 'message'])

<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}>
    {{ $message }}
</div>
```

Pemanggilan:

```blade
<x-alert type="error" :message="$message" class="mb-4" />
```

📌

* `type` → punya default value `"info"`.
* `message` → wajib diisi.
* `class="mb-4"` → masuk ke `$attributes`.

---

### 4. Accessing Parent Data (Mengakses Data dari Parent Component)

Kadang kita ingin **child component** bisa mewarisi data dari parent.
Gunakan direktif `@aware`.

Contoh penggunaan:

```blade
{{-- Pemanggilan --}}
<x-menu color="purple">
    <x-menu.item>Menu 1</x-menu.item>
    <x-menu.item>Menu 2</x-menu.item>
</x-menu>
```

#### Parent (`menu/index.blade.php`):

```blade
@props(['color' => 'gray'])

<ul {{ $attributes->merge(['class' => 'bg-'.$color.'-200']) }}>
    {{ $slot }}
</ul>
```

#### Child (`menu/item.blade.php`):

```blade
@aware(['color' => 'gray'])

<li {{ $attributes->merge(['class' => 'text-'.$color.'-800']) }}>
    {{ $slot }}
</li>
```

👉 Dengan `@aware`, child component `<x-menu.item>` bisa menggunakan atribut `color` yang awalnya hanya diberikan ke parent `<x-menu>`.

⚠️ Catatan: `@aware` hanya bisa membaca **atribut yang dikirim via HTML**, bukan nilai default `@props`.

---

### 5. Anonymous Component Paths

Secara default, Laravel mencari anonymous components di:

```
resources/views/components
```

Tetapi kita bisa menambahkan **custom path** menggunakan `anonymousComponentPath()` di `AppServiceProvider`:

```php
public function boot(): void
{
    Blade::anonymousComponentPath(__DIR__.'/../components');
}
```

Jika ada file `panel.blade.php` di folder tersebut, maka kita bisa langsung memanggilnya:

```blade
<x-panel />
```

#### Dengan Prefix Namespace

Kita juga bisa menambahkan **prefix namespace**:

```php
Blade::anonymousComponentPath(__DIR__.'/../components', 'dashboard');
```

Maka, pemanggilannya:

```blade
<x-dashboard::panel />
```

---

## 📘Building Layouts

### 1. Layouts Menggunakan Components

#### Definisi Layout Component

Laravel memungkinkan kita membuat layout utama sebagai **komponen Blade** sehingga tidak perlu menuliskan ulang struktur HTML di setiap view.

Contoh layout sederhana untuk aplikasi Todo List:

```blade
{{-- resources/views/components/layout.blade.php --}}
<html>
    <head>
        <title>{{ $title ?? 'Todo Manager' }}</title>
    </head>
    <body>
        <h1>Todos</h1>
        <hr/>
        {{ $slot }}
    </body>
</html>
```

📌

* `$slot` → tempat konten view anak akan ditampilkan.
* `$title` → slot opsional yang bisa di-override.

---

#### Menggunakan Layout di View

```blade
{{-- resources/views/tasks.blade.php --}}
<x-layout>
    @foreach ($tasks as $task)
        <div>{{ $task }}</div>
    @endforeach
</x-layout>
```

Jika ingin mengganti **title**, gunakan **named slot**:

```blade
{{-- resources/views/tasks.blade.php --}}
<x-layout>
    <x-slot:title>
        Custom Title
    </x-slot>

    @foreach ($tasks as $task)
        <div>{{ $task }}</div>
    @endforeach
</x-layout>
```

#### Routing

```php
use App\Models\Task;

Route::get('/tasks', function () {
    return view('tasks', ['tasks' => Task::all()]);
});
```

---

### 2. Layouts Menggunakan Template Inheritance

Sebelum ada Blade Components, Laravel menyediakan **template inheritance** yang masih banyak dipakai.

#### Definisi Layout

```blade
{{-- resources/views/layouts/app.blade.php --}}
<html>
    <head>
        <title>App Name - @yield('title')</title>
    </head>
    <body>
        @section('sidebar')
            This is the master sidebar.
        @show

        <div class="container">
            @yield('content')
        </div>
    </body>
</html>
```

📌

* `@section` → mendefinisikan sebuah section.
* `@yield` → menampilkan isi dari section yang didefinisikan di child view.

---

#### Membuat Child View

```blade
{{-- resources/views/child.blade.php --}}
@extends('layouts.app')

@section('title', 'Page Title')

@section('sidebar')
    @@parent
    <p>This is appended to the master sidebar.</p>
@endsection

@section('content')
    <p>This is my body content.</p>
@endsection
```

📌

* `@extends` → menentukan layout yang diwarisi.
* `@@parent` → menambahkan isi baru di section tanpa menimpa isi bawaan layout.
* `@endsection` → hanya mendefinisikan section.
* `@show` → mendefinisikan **dan langsung menampilkan** section.

---

#### Default Value untuk `@yield`

`@yield` bisa diberi default value jika section tidak didefinisikan:

```blade
@yield('content', 'Default content')
```

---

## 📘Forms

### 1. CSRF Field

Laravel melindungi aplikasi dari serangan **Cross-Site Request Forgery (CSRF)**.
Setiap form **POST**, **PUT**, **PATCH**, atau **DELETE** harus menyertakan **token CSRF** agar request dianggap valid oleh middleware Laravel.

Blade menyediakan direktif `@csrf` untuk menghasilkan input hidden secara otomatis:

```blade
<form method="POST" action="/profile">
    @csrf
    <!-- isi form -->
</form>
```

📌 Tanpa token ini, Laravel akan menolak request dengan status **419 Page Expired**.

---

### 2. Method Field

Karena HTML standar hanya mendukung **GET** dan **POST**, maka untuk **PUT**, **PATCH**, atau **DELETE** kita perlu menggunakan hidden field `_method`.

Blade menyediakan direktif `@method`:

```blade
<form action="/foo/bar" method="POST">
    @method('PUT')
    @csrf
    <!-- isi form -->
</form>
```

📌 Laravel akan membaca `_method` dan mengenalinya sebagai HTTP verb yang sesuai.

---

### 3. Validation Errors

Validasi input adalah bagian penting dari form. Laravel menyediakan cara mudah untuk menampilkan error validasi melalui direktif `@error`.

#### Contoh dasar

```blade
<!-- resources/views/post/create.blade.php -->
<label for="title">Post Title</label>

<input
    id="title"
    type="text"
    class="@error('title') is-invalid @enderror"
/>

@error('title')
    <div class="alert alert-danger">{{ $message }}</div>
@enderror
```

📌

* `@error('title')` → akan aktif jika ada error untuk field `title`.
* Variabel `$message` otomatis berisi pesan error validasi.

---

#### Menggunakan `@else`

Karena `@error` dikompilasi menjadi `if`, kita bisa memakai `@else` untuk kondisi sebaliknya:

```blade
<!-- resources/views/auth.blade.php -->
<label for="email">Email address</label>

<input
    id="email"
    type="email"
    class="@error('email') is-invalid @else is-valid @enderror"
/>
```

📌 Jika ada error → input diberi class `is-invalid`.
Jika tidak ada error → input diberi class `is-valid`.

---

#### Menggunakan Error Bag

Laravel mendukung banyak form pada satu halaman. Kadang tiap form punya **error bag** sendiri. Kita bisa menentukan error bag kedua pada `@error`.

```blade
<!-- resources/views/auth.blade.php -->
<label for="email">Email address</label>

<input
    id="email"
    type="email"
    class="@error('email', 'login') is-invalid @enderror"
/>

@error('email', 'login')
    <div class="alert alert-danger">{{ $message }}</div>
@enderror
```

📌

* `'login'` adalah nama error bag.
* Berguna ketika ada lebih dari satu form di satu halaman, misalnya form **register** dan **login**.

---



---

## 📘Blade Stacks

### 🔹 Konsep

`Stacks` di Blade memungkinkan kita **menambahkan konten ke area tertentu dari layout**.
Biasanya dipakai untuk:

* Menyertakan **JavaScript library** tambahan.
* Menyisipkan **CSS khusus** hanya pada halaman tertentu.

Dengan stacks, child view bisa "menyuntikkan" script atau markup tambahan ke layout tanpa perlu mengedit layout langsung.

---

### 🔹 Menambahkan ke Stack

Gunakan `@push` untuk menambahkan konten ke stack bernama:

```blade
@push('scripts')
    <script src="/example.js"></script>
@endpush
```

---

### 🔹 Kondisional Push

Jika ingin menambahkan hanya ketika kondisi bernilai **true**, gunakan `@pushIf`:

```blade
@pushIf($shouldPush, 'scripts')
    <script src="/example.js"></script>
@endPushIf
```

---

### 🔹 Menampilkan Stack

Di layout utama (misalnya `layouts/app.blade.php`), gunakan `@stack` untuk menampilkan semua konten stack:

```blade
<head>
    <!-- Head Contents -->

    @stack('scripts')
</head>
```

📌 Semua `@push('scripts')` dari child view akan terkumpul di sini.

---

### 🔹 Prepend ke Stack

Jika ingin konten tampil **lebih dulu** sebelum konten stack lain, gunakan `@prepend`:

```blade
@push('scripts')
    This will be second...
@endpush

@prepend('scripts')
    This will be first...
@endprepend
```

Hasil akhirnya:

```
This will be first...
This will be second...
```

---

### ✅ Contoh Praktis

#### Layout (`layouts/app.blade.php`)

```blade
<html>
<head>
    <title>My App</title>
    @stack('scripts')
</head>
<body>
    <h1>Welcome</h1>
    @yield('content')
</body>
</html>
```

#### Child View (`home.blade.php`)

```blade
@extends('layouts.app')

@section('content')
    <p>Homepage Content</p>
@endsection

@push('scripts')
    <script src="/homepage.js"></script>
@endpush
```

#### Output Rendered

```html
<html>
<head>
    <title>My App</title>
    <script src="/homepage.js"></script>
</head>
<body>
    <h1>Welcome</h1>
    <p>Homepage Content</p>
</body>
</html>
```

---

---

## 📘Service Injection di Blade

### 🔹 Konsep

Kadang kita butuh **mengakses service atau class** langsung di dalam Blade template tanpa harus mengoper datanya dari controller.
Laravel menyediakan direktif `@inject` untuk **mengambil service dari service container** dan menjadikannya variabel di view.

---

### 🔹 Sintaks

```blade
@inject('variableName', 'Full\Namespace\To\Service')
```

* **parameter pertama** → nama variabel yang akan dipakai di Blade.
* **parameter kedua** → nama class / interface yang ingin di-resolve dari service container.

---

### 🔹 Contoh

Misalnya kita punya service `MetricsService`:

```php
namespace App\Services;

class MetricsService
{
    public function monthlyRevenue(): string
    {
        return '$12,345';
    }
}
```

Kemudian di Blade:

```blade
@inject('metrics', 'App\Services\MetricsService')

<div>
    Monthly Revenue: {{ $metrics->monthlyRevenue() }}.
</div>
```

📌 Hasil yang ditampilkan di browser:

```html
<div>
    Monthly Revenue: $12,345.
</div>
```

---

### 🔹 Kapan Digunakan?

* Jika hanya butuh **sekali akses service** langsung dari Blade.
* Cocok untuk **utility services** (misalnya format tanggal, statistik, konfigurasi global).

---

### ⚠️ Catatan

* Jika service dipakai **sering atau kompleks**, sebaiknya inject di **controller** lalu oper ke view dengan `view()->with()` → ini menjaga **separation of concerns**.
* `@inject` lebih cocok untuk **quick access** di view, bukan logic utama aplikasi.

---

---

## 📘Rendering Inline Blade Templates & Fragments

### 🔹 1. Rendering Inline Blade Templates

Kadang kita butuh **langsung render string Blade** menjadi HTML tanpa harus membuat file view `.blade.php`.
Laravel menyediakan `Blade::render()` untuk hal ini.

#### 📌 Contoh dasar

```php
use Illuminate\Support\Facades\Blade;

return Blade::render('Hello, {{ $name }}', ['name' => 'Julian Bashir']);
```

📍 Output:

```html
Hello, Julian Bashir
```

#### 📌 Hapus cache setelah render

Secara default, Blade akan menyimpan file cache di `storage/framework/views`.
Kalau hanya butuh sekali render, bisa pakai `deleteCachedView: true` agar file cache langsung dihapus:

```php
return Blade::render(
    'Hello, {{ $name }}',
    ['name' => 'Julian Bashir'],
    deleteCachedView: true
);
```

✅ Cocok untuk:

* Template yang **dinamis**
* Email content rendering
* Quick test / string-based view

---

### 🔹 2. Rendering Blade Fragments

Kadang kita butuh **hanya sebagian view** dikembalikan (misalnya saat pakai frontend framework: Turbo, htmx).
Laravel mendukung ini dengan **@fragment**.

#### 📌 Definisi fragment di Blade

```blade
@fragment('user-list')
    <ul>
        @foreach ($users as $user)
            <li>{{ $user->name }}</li>
        @endforeach
    </ul>
@endfragment
```

#### 📌 Return hanya fragment

```php
return view('dashboard', ['users' => $users])->fragment('user-list');
```

👉 Hanya `<ul>...</ul>` yang dikembalikan, bukan keseluruhan `dashboard.blade.php`.

---

### 🔹 3. Conditional Fragment

Jika ingin render fragment **hanya jika kondisi tertentu terpenuhi**:

```php
return view('dashboard', ['users' => $users])
    ->fragmentIf($request->hasHeader('HX-Request'), 'user-list');
```

* Kalau request dari **htmx/Turbo** → hanya fragment `user-list`.
* Kalau request biasa → render full view.

---

### 🔹 4. Multiple Fragments

Bisa juga render **lebih dari satu fragment**:

```php
view('dashboard', ['users' => $users])
    ->fragments(['user-list', 'comment-list']);
```

Atau conditional multiple fragments:

```php
view('dashboard', ['users' => $users])
    ->fragmentsIf(
        $request->hasHeader('HX-Request'),
        ['user-list', 'comment-list']
    );
```

📌 Hasil akhirnya: semua fragment yang disebutkan akan digabungkan.

---

### ⚖️ Perbandingan

* **Blade::render()** → untuk **inline string template** (tanpa file Blade).
* **Fragments** → untuk **partial view rendering** (hanya sebagian konten view).

---

---

## 📘Extending Blade

### 🔹 1. Custom Directives

Laravel memungkinkan kamu bikin **directive baru** dengan `Blade::directive()`.

#### 📌 Contoh

Buat `@datetime($var)` untuk format tanggal:

```php
// App\Providers\AppServiceProvider.php
use Illuminate\Support\Facades\Blade;

public function boot(): void
{
    Blade::directive('datetime', function (string $expression) {
        return "<?php echo ($expression)->format('m/d/Y H:i'); ?>";
    });
}
```

👉 Blade:

```blade
@datetime($user->created_at)
```

👉 Output:

```html
09/20/2025 14:35
```

📌 Jangan lupa jalankan:

```bash
php artisan view:clear
```

setelah update directive.

---

### 🔹 2. Custom Echo Handlers

Biasanya `{{ $obj }}` akan memanggil `__toString()`.
Kalau library pihak ketiga tidak punya `__toString()`, kita bisa atur handler pakai `Blade::stringable()`.

#### 📌 Contoh

```php
use Illuminate\Support\Facades\Blade;
use Money\Money;

public function boot(): void
{
    Blade::stringable(function (Money $money) {
        return $money->formatTo('en_GB');
    });
}
```

👉 Blade:

```blade
Cost: {{ $money }}
```

👉 Output:

```html
Cost: £1,234.56
```

---

### 🔹 3. Custom If Statements

Kalau butuh kondisi custom tanpa directive panjang, gunakan `Blade::if()`.

#### 📌 Contoh

Cek **default filesystem disk**:

```php
use Illuminate\Support\Facades\Blade;

public function boot(): void
{
    Blade::if('disk', function (string $value) {
        return config('filesystems.default') === $value;
    });
}
```

👉 Blade:

```blade
@disk('local')
    Using local disk...
@elsedisk('s3')
    Using s3 disk...
@else
    Using another disk...
@enddisk

@unlessdisk('local')
    Not using local disk...
@enddisk
```

---

### ⚖️ Kapan Dipakai?

* **Custom Directive** → kalau sering butuh transformasi data di view (misalnya `@currency`, `@uppercase`).
* **Custom Echo Handler** → kalau ingin Blade otomatis tahu cara menampilkan objek tertentu.
* **Custom If** → kalau butuh kondisi reusable (misalnya `@admin`, `@featureEnabled('x')`).

---


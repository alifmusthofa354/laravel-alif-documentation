# 🔮 Laravel Precognition

Laravel Precognition menyediakan kemampuan untuk secara ajaib memprediksi hasil dari permintaan HTTP dari frontend aplikasi Anda sebelum formulir benar-benar dikirimkan. Ini memungkinkan pengalaman pengguna yang luar biasa dengan memvalidasi formulir secara real-time dan menampilkan error sebelum pengguna mengirimkan formulir.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [Menggunakan Precognition](#menggunakan-precognition)
5. [Validasi Formulir](#validasi-formulir)
6. [Integrasi JavaScript](#integrasi-javascript)
7. [Alpine.js Integration](#alpinejs-integration)
8. [Vue.js Integration](#vuejs-integration)
9. [React Integration](#react-integration)
10. [Livewire Integration](#livewire-integration)
11. [Advanced Usage](#advanced-usage)
12. [Testing](#testing)

## 🎯 Pendahuluan

Laravel Precognition adalah paket yang memungkinkan frontend aplikasi Anda untuk secara ajaib memprediksi hasil dari permintaan HTTP sebelum formulir dikirimkan. Ini memberikan pengalaman pengguna yang luar biasa dengan memvalidasi formulir secara real-time dan menampilkan error sebelum pengguna mengirimkan formulir.

### ✨ Fitur Utama
- Validasi formulir real-time
- Prediksi error sebelum pengiriman
- Integrasi dengan berbagai framework JavaScript
- Dukungan Alpine.js, Vue.js, dan React
- Integrasi dengan Laravel Livewire
- Validasi server-side yang kuat
- Pengalaman pengguna yang mulus

### ⚠️ Catatan Penting
Precognition memerlukan koneksi internet untuk berfungsi karena bergantung pada permintaan AJAX ke server.

## 📦 Instalasi

### 🎯 Menginstal Precognition Client
Untuk memulai, instal client JavaScript Precognition menggunakan npm:

```bash
npm install laravel-precognition
```

### 🛠️ Menginstal Precognition Server
Instal paket server Precognition melalui Composer:

```bash
composer require laravel/precognition
```

### 🔧 Konfigurasi Middleware
Tambahkan middleware Precognition ke grup middleware `api` dalam file `app/Http/Kernel.php` Anda:

```php
'api' => [
    // Middleware lainnya...
    \Laravel\Precognition\Middleware\HandlePrecognition::class,
],
```

## ⚙️ Konfigurasi

### 📄 File Konfigurasi
Precognition tidak memerlukan konfigurasi tambahan dalam kebanyakan kasus. Namun, Anda dapat mempublish file konfigurasi jika perlu mengkustomisasi perilaku:

```bash
php artisan vendor:publish --tag="precognition-config"
```

### 📋 Konfigurasi Dasar
File konfigurasi `config/precognition.php` memungkinkan Anda mengkustomisasi berbagai aspek Precognition:

```php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Precognition Header
    |--------------------------------------------------------------------------
    |
    | Here you may configure the header that Precognition clients will use
    | to inform the server that they are requesting a precognitive response.
    |
    */

    'header' => 'Precognition',

    /*
    |--------------------------------------------------------------------------
    | Precognition Validate Header
    |--------------------------------------------------------------------------
    |
    | Here you may configure the header that Precognition clients will use
    | to inform the server which validation rules should be applied.
    |
    */

    'validate-header' => 'Precognition-Validate-Only',
];
```

## 🚀 Menggunakan Precognition

### 📋 Dasar Penggunaan
Untuk menggunakan Precognition, Anda perlu menandai route Anda dengan middleware `HandlePrecognition`:

```php
use Illuminate\Http\Request;

Route::post('/users', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => 'required|string|min:8',
    ]);

    // Logic untuk membuat pengguna...
})->middleware(['api', 'precognition']);
```

### 📋 Menggunakan dalam Controller
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['admin', 'user'])],
        ]);

        // Logic untuk membuat pengguna...
    }
}
```

### 📋 Route dengan Precognition
```php
Route::post('/users', [UserController::class, 'store'])
    ->middleware(['api', 'precognition']);
```

## 📋 Validasi Formulir

### 📋 Validasi Dasar
Precognition secara otomatis menangani validasi formulir dan mengembalikan error yang relevan:

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => [
            'required',
            'string',
            'min:8',
            'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/',
        ],
    ]);

    // Logic untuk membuat pengguna...
}
```

### 📋 Validasi Kondisional
```php
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'type' => 'required|in:individual,company',
        'company_name' => 'required_if:type,company|string|max:255',
        'vat_number' => 'required_if:type,company|string|max:50',
    ]);

    // Logic untuk membuat pengguna...
}
```

### 📋 Validasi Array
```php
public function store(Request $request)
{
    $validated = $request->validate([
        'items' => 'required|array|min:1',
        'items.*.name' => 'required|string|max:255',
        'items.*.quantity' => 'required|integer|min:1',
        'items.*.price' => 'required|numeric|min:0',
    ]);

    // Logic untuk memproses item...
}
```

### 📋 Validasi dengan Form Request
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Laravel\Precognition\Concerns\IdentifiesUnvalidatedArrayKeys;

class StoreUserRequest extends FormRequest
{
    use IdentifiesUnvalidatedArrayKeys;

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
```

```php
public function store(StoreUserRequest $request)
{
    $validated = $request->validated();

    // Logic untuk membuat pengguna...
}
```

## 🎨 Integrasi JavaScript

### 📋 Penggunaan Dasar dengan Vanilla JavaScript
```javascript
import { client } from 'laravel-precognition';

const form = client.post('/users', {
    name: '',
    email: '',
    password: '',
});

// Membatalkan validasi otomatis
form.setValidationTimeout(1000); // 1 detik

// Mendengarkan perubahan pada field
document.getElementById('name').addEventListener('input', (e) => {
    form.setData('name', e.target.value);
    form.validate('name');
});

document.getElementById('email').addEventListener('input', (e) => {
    form.setData('email', e.target.value);
    form.validate('email');
});

// Mengirim formulir
document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();

    form.submit().then(response => {
        // Sukses
        console.log('User created successfully!');
    }).catch(error => {
        // Error
        console.error('Error creating user:', error);
    });
});
```

### 📋 Menggunakan Reactive Data
```javascript
import { client } from 'laravel-precognition';

const formData = {
    name: '',
    email: '',
    password: '',
};

const form = client.post('/users', formData);

// Sinkronisasi data secara otomatis
Object.keys(formData).forEach(key => {
    Object.defineProperty(formData, key, {
        set(value) {
            form.setData(key, value);
            form.validate(key);
        },
        get() {
            return form.data[key];
        }
    });
});
```

## 🧊 Alpine.js Integration

### 📋 Penggunaan Dasar dengan Alpine.js
```blade
<div x-data="userForm()" x-init="init()">
    <form @submit.prevent="submit">
        <div>
            <label for="name">Name</label>
            <input 
                id="name" 
                type="text" 
                x-model="form.name"
                @input.debounce.500ms="validate('name')"
                :class="{'border-red-500': hasError('name')}"
            >
            <template x-if="hasError('name')">
                <p class="text-red-500 text-sm" x-text="error('name')"></p>
            </template>
        </div>

        <div>
            <label for="email">Email</label>
            <input 
                id="email" 
                type="email" 
                x-model="form.email"
                @input.debounce.500ms="validate('email')"
                :class="{'border-red-500': hasError('email')}"
            >
            <template x-if="hasError('email')">
                <p class="text-red-500 text-sm" x-text="error('email')"></p>
            </template>
        </div>

        <div>
            <label for="password">Password</label>
            <input 
                id="password" 
                type="password" 
                x-model="form.password"
                @input.debounce.500ms="validate('password')"
                :class="{'border-red-500': hasError('password')}"
            >
            <template x-if="hasError('password')">
                <p class="text-red-500 text-sm" x-text="error('password')"></p>
            </template>
        </div>

        <button 
            type="submit" 
            :disabled="processing"
            :class="{'opacity-50': processing}"
        >
            <span x-show="!processing">Create User</span>
            <span x-show="processing">Creating...</span>
        </button>
    </form>
</div>

<script>
function userForm() {
    return {
        form: {
            name: '',
            email: '',
            password: '',
        },
        errors: {},
        processing: false,

        precognitionForm: null,

        init() {
            this.precognitionForm = Precognition.client.post('/users', this.form)
                .on('errorsChanged', ({ errors }) => {
                    this.errors = errors;
                });
        },

        validate(field) {
            this.precognitionForm.setData(field, this.form[field]);
            this.precognitionForm.validate(field);
        },

        hasError(field) {
            return Object.hasOwn(this.errors, field);
        },

        error(field) {
            return this.errors[field]?.[0] ?? '';
        },

        async submit() {
            this.processing = true;

            try {
                await this.precognitionForm.submit();
                alert('User created successfully!');
                this.reset();
            } catch (error) {
                console.error('Error creating user:', error);
            } finally {
                this.processing = false;
            }
        },

        reset() {
            this.form = {
                name: '',
                email: '',
                password: '',
            };
            this.errors = {};
        }
    };
}
</script>
```

## 🖼️ Vue.js Integration

### 📋 Penggunaan Dasar dengan Vue.js
```vue
<template>
  <form @submit.prevent="submit">
    <div>
      <label for="name">Name</label>
      <input
        id="name"
        v-model="form.name"
        @input="validate('name')"
        :class="{ 'border-red-500': hasError('name') }"
      >
      <p v-if="hasError('name')" class="text-red-500 text-sm">
        {{ error('name') }}
      </p>
    </div>

    <div>
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        v-model="form.email"
        @input="validate('email')"
        :class="{ 'border-red-500': hasError('email') }"
      >
      <p v-if="hasError('email')" class="text-red-500 text-sm">
        {{ error('email') }}
      </p>
    </div>

    <div>
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        v-model="form.password"
        @input="validate('password')"
        :class="{ 'border-red-500': hasError('password') }"
      >
      <p v-if="hasError('password')" class="text-red-500 text-sm">
        {{ error('password') }}
      </p>
    </div>

    <button
      type="submit"
      :disabled="processing"
      :class="{ 'opacity-50': processing }"
    >
      <span v-if="!processing">Create User</span>
      <span v-else>Creating...</span>
    </button>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { client } from 'laravel-precognition';

const form = reactive({
  name: '',
  email: '',
  password: '',
});

const errors = ref({});
const processing = ref(false);

const precognitionForm = client.post('/users', form)
  .on('errorsChanged', ({ errors: newErrors }) => {
    errors.value = newErrors;
  });

const validate = (field) => {
  precognitionForm.setData(field, form[field]);
  precognitionForm.validate(field);
};

const hasError = (field) => {
  return Object.hasOwn(errors.value, field);
};

const error = (field) => {
  return errors.value[field]?.[0] ?? '';
};

const submit = async () => {
  processing.value = true;

  try {
    await precognitionForm.submit();
    alert('User created successfully!');
    reset();
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    processing.value = false;
  }
};

const reset = () => {
  form.name = '';
  form.email = '';
  form.password = '';
  errors.value = {};
};
</script>
```

## ⚛️ React Integration

### 📋 Penggunaan Dasar dengan React
```jsx
import React, { useState, useEffect } from 'react';
import { client } from 'laravel-precognition';

function UserForm() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const precognitionForm = client.post('/users', form);

    useEffect(() => {
        precognitionForm.on('errorsChanged', ({ errors }) => {
            setErrors(errors);
        });
    }, []);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        precognitionForm.setData(field, value);
        precognitionForm.validate(field);
    };

    const hasError = (field) => {
        return Object.hasOwn(errors, field);
    };

    const error = (field) => {
        return errors[field]?.[0] ?? '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            await precognitionForm.submit();
            alert('User created successfully!');
            reset();
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setProcessing(false);
        }
    };

    const reset = () => {
        setForm({
            name: '',
            email: '',
            password: '',
        });
        setErrors({});
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={hasError('name') ? 'border-red-500' : ''}
                />
                {hasError('name') && (
                    <p className="text-red-500 text-sm">{error('name')}</p>
                )}
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={hasError('email') ? 'border-red-500' : ''}
                />
                {hasError('email') && (
                    <p className="text-red-500 text-sm">{error('email')}</p>
                )}
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className={hasError('password') ? 'border-red-500' : ''}
                />
                {hasError('password') && (
                    <p className="text-red-500 text-sm">{error('password')}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={processing}
                className={processing ? 'opacity-50' : ''}
            >
                {!processing ? 'Create User' : 'Creating...'}
            </button>
        </form>
    );
}

export default UserForm;
```

## 🌐 Livewire Integration

### 📋 Penggunaan Dasar dengan Livewire
```php
<?php

namespace App\Http\Livewire;

use Livewire\Component;
use Laravel\Precognition\Concerns\IdentifiesUnvalidatedArrayKeys;

class UserForm extends Component
{
    use IdentifiesUnvalidatedArrayKeys;

    public $name = '';
    public $email = '';
    public $password = '';

    protected $rules = [
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => 'required|string|min:8',
    ];

    public function updated($field)
    {
        $this->validateOnly($field);
    }

    public function save()
    {
        $validated = $this->validate();

        // Logic untuk membuat pengguna...

        $this->reset();
        
        session()->flash('message', 'User created successfully!');
    }

    public function render()
    {
        return view('livewire.user-form');
    }
}
```

```blade
<div>
    @if (session()->has('message'))
        <div class="alert alert-success">
            {{ session('message') }}
        </div>
    @endif

    <form wire:submit.prevent="save">
        <div>
            <label for="name">Name</label>
            <input 
                id="name" 
                type="text" 
                wire:model="name"
                class="@error('name') border-red-500 @enderror"
            >
            @error('name') 
                <p class="text-red-500 text-sm">{{ $message }}</p> 
            @enderror
        </div>

        <div>
            <label for="email">Email</label>
            <input 
                id="email" 
                type="email" 
                wire:model="email"
                class="@error('email') border-red-500 @enderror"
            >
            @error('email') 
                <p class="text-red-500 text-sm">{{ $message }}</p> 
            @enderror
        </div>

        <div>
            <label for="password">Password</label>
            <input 
                id="password" 
                type="password" 
                wire:model="password"
                class="@error('password') border-red-500 @enderror"
            >
            @error('password') 
                <p class="text-red-500 text-sm">{{ $message }}</p> 
            @enderror
        </div>

        <button type="submit" wire:loading.attr="disabled">
            <span wire:loading.remove>Create User</span>
            <span wire:loading>Creating...</span>
        </button>
    </form>
</div>
```

## 🚀 Advanced Usage

### 📋 Validasi Kustom
Anda dapat menambahkan validasi kustom dalam controller Anda:

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => 'required|string|min:8',
    ]);

    // Validasi kustom
    if ($this->shouldRejectUser($validated)) {
        return response()->json([
            'message' => 'User cannot be created at this time.',
        ], 422);
    }

    // Logic untuk membuat pengguna...
}

private function shouldRejectUser(array $data)
{
    // Logika validasi kustom
    return false;
}
```

### 📋 Validasi dengan Database
```php
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,NULL,id,deleted_at,NULL',
        'password' => 'required|string|min:8',
        'company_id' => 'required|exists:companies,id',
    ]);

    // Memastikan pengguna memiliki akses ke company
    if (!$request->user()->canAccessCompany($validated['company_id'])) {
        abort(403, 'You do not have access to this company.');
    }

    // Logic untuk membuat pengguna...
}
```

### 📋 Validasi dengan Rate Limiting
```php
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

public function store(Request $request)
{
    // Rate limiting
    $throttleKey = Str::lower($request->ip()).'|user-store';
    
    if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
        return response()->json([
            'message' => 'Too many attempts. Please try again later.',
        ], 429);
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => 'required|string|min:8',
    ]);

    RateLimiter::hit($throttleKey);

    // Logic untuk membuat pengguna...
}
```

## 🧪 Testing

### 📋 Testing dengan PHPUnit
Anda dapat menguji endpoint Precognition menggunakan PHPUnit:

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;

class PrecognitionTest extends TestCase
{
    public function test_precognition_validation()
    {
        $response = $this->withHeader('Precognition', 'true')
            ->withHeader('Precognition-Validate-Only', 'name,email,password')
            ->post('/users', [
                'name' => '',
                'email' => 'invalid-email',
                'password' => '123',
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_precognition_success()
    {
        $response = $this->withHeader('Precognition', 'true')
            ->withHeader('Precognition-Validate-Only', 'name,email,password')
            ->post('/users', [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => 'password123',
            ]);

        $response->assertStatus(204);
    }
}
```

### 📋 Testing dengan Pest
```php
<?php

use function Pest\Laravel\{post};

test('precognition validation catches errors', function () {
    $response = post('/users', [
        'name' => '',
        'email' => 'invalid-email',
        'password' => '123',
    ], [
        'Precognition' => 'true',
        'Precognition-Validate-Only' => 'name,email,password',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['name', 'email', 'password']);
});

test('precognition validation passes with valid data', function () {
    $response = post('/users', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
    ], [
        'Precognition' => 'true',
        'Precognition-Validate-Only' => 'name,email,password',
    ]);

    $response->assertStatus(204);
});
```

### 📋 Testing dengan JavaScript
Anda dapat menguji integrasi JavaScript menggunakan Cypress atau Playwright:

```javascript
// cypress/integration/user_form.spec.js
describe('User Form', () => {
    beforeEach(() => {
        cy.visit('/users/create');
    });

    it('shows validation errors in real-time', () => {
        cy.get('#name').type('J').blur();
        cy.get('#name').siblings('.text-red-500').should('contain', 'The name field must be at least 2 characters.');

        cy.get('#email').type('invalid-email').blur();
        cy.get('#email').siblings('.text-red-500').should('contain', 'The email must be a valid email address.');

        cy.get('#password').type('123').blur();
        cy.get('#password').siblings('.text-red-500').should('contain', 'The password must be at least 8 characters.');
    });

    it('allows valid submission', () => {
        cy.get('#name').type('John Doe');
        cy.get('#email').type('john@example.com');
        cy.get('#password').type('password123');

        cy.get('button[type="submit"]').click();
        cy.contains('User created successfully!').should('be.visible');
    });
});
```

## 🧠 Kesimpulan

Laravel Precognition menyediakan cara yang kuat dan elegan untuk memvalidasi formulir secara real-time sebelum pengiriman, memberikan pengalaman pengguna yang luar biasa. Dengan integrasi yang mulus dengan berbagai framework JavaScript dan Livewire, Precognition membuat proses validasi menjadi lebih intuitif dan responsif.

### 🔑 Keuntungan Utama
- Validasi formulir real-time
- Prediksi error sebelum pengiriman
- Integrasi dengan berbagai framework JavaScript
- Dukungan Alpine.js, Vue.js, dan React
- Integrasi dengan Laravel Livewire
- Validasi server-side yang kuat
- Pengalaman pengguna yang mulus

### 🚀 Best Practices
1. Gunakan debouncing untuk menghindari spam validasi
2. Tampilkan error secara jelas dan ramah pengguna
3. Gunakan indikator loading saat memproses formulir
4. Reset formulir setelah pengiriman berhasil
5. Uji implementasi secara menyeluruh
6. Gunakan rate limiting untuk mencegah abuse
7. Dokumentasikan perilaku validasi dengan jelas
8. Berikan feedback yang bermakna kepada pengguna

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Precognition untuk meningkatkan pengalaman pengguna dalam aplikasi Laravel Anda.
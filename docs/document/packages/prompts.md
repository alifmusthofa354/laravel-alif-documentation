# 🎯 Laravel Prompts

Laravel Prompts adalah package yang menyediakan cara yang indah untuk menambahkan interaktivitas ke command-line aplikasi Laravel Anda. Dengan Prompts, Anda dapat dengan mudah meminta input dari pengguna, menampilkan informasi, dan membuat pengalaman command-line yang menarik.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Text Input](#text-input)
4. [Password Input](#password-input)
5. [Confirmation](#confirmation)
6. [Multiple Choice](#multiple-choice)
7. [Multi-select](#multi-select)
8. [Suggestions](#suggestions)
9. [Search](#search)
10. [Multi-search](#multi-search)
11. [Number Input](#number-input)
12. [File Upload](#file-upload)
13. [Spinners](#spinners)
14. [Progress Bars](#progress-bars)
15. [Tables](#tables)
16. [Customization](#customization)

## 🎯 Pendahuluan

Laravel Prompts menyediakan antarmuka yang indah dan ekspresif untuk berinteraksi dengan pengguna melalui command-line. Package ini memungkinkan Anda untuk membuat command Artisan yang interaktif dengan berbagai jenis prompt dan elemen visual.

### ✨ Fitur Utama
- Berbagai jenis prompt input
- Elemen visual menarik
- Validasi input bawaan
- Customizable appearance
- Cross-platform compatibility
- Graceful fallback untuk environment non-TTY

### ⚠️ Catatan Penting
Prompts secara otomatis akan menggunakan implementasi yang sesuai berdasarkan environment tempat command dijalankan. Jika command dijalankan dalam environment non-TTY, Prompts akan menggunakan implementasi fallback.

## 📦 Instalasi

### 🎯 Menginstal Prompts
Laravel Prompts sudah disertakan dalam Laravel 10+. Untuk versi Laravel sebelumnya, Anda dapat menginstalnya melalui Composer:

```bash
composer require laravel/prompts
```

### 🛠️ Menggunakan Prompts
Prompts secara otomatis tersedia dalam command Artisan Anda. Anda tidak perlu mengimpor apapun secara eksplisit.

## 📝 Text Input

### 📋 Prompt Dasar
Untuk meminta input teks dari pengguna:

```php
use function Laravel\Prompts\text;

$name = text('What is your name?');
```

### 📋 Prompt dengan Placeholder
```php
$email = text(
    label: 'What is your email address?',
    placeholder: 'e.g. taylor@example.com'
);
```

### 📋 Prompt dengan Default Value
```php
$name = text(
    label: 'What is your name?',
    default: 'Taylor'
);
```

### 📋 Prompt dengan Validasi
```php
$email = text(
    label: 'What is your email address?',
    validate: fn (string $value) => match (true) {
        ! filter_var($value, FILTER_VALIDATE_EMAIL) => 'The email address must be valid.',
        default => null
    }
);
```

### 📋 Prompt dengan Hint
```php
$password = text(
    label: 'Choose a password',
    hint: 'Minimum 8 characters.'
);
```

## 🔒 Password Input

### 📋 Prompt Password Dasar
Untuk meminta input password (character akan disembunyikan):

```php
use function Laravel\Prompts\password;

$password = password('What is your password?');
```

### 📋 Prompt Password dengan Validasi
```php
$password = password(
    label: 'Choose a password',
    validate: fn (string $value) => match (true) {
        strlen($value) < 8 => 'The password must be at least 8 characters.',
        default => null
    }
);
```

## ✅ Confirmation

### 📋 Prompt Konfirmasi Dasar
Untuk meminta konfirmasi ya/tidak dari pengguna:

```php
use function Laravel\Prompts\confirm;

$confirmed = confirm('Do you wish to continue?');
```

### 📋 Prompt Konfirmasi dengan Default Value
```php
$confirmed = confirm(
    label: 'Do you wish to continue?',
    default: true
);
```

### 📋 Prompt Konfirmasi dengan Hint
```php
$confirmed = confirm(
    label: 'Do you wish to continue?',
    hint: 'The installation will begin immediately.'
);
```

## 🔘 Multiple Choice

### 📋 Prompt Pilihan Tunggal Dasar
Untuk memungkinkan pengguna memilih satu opsi dari beberapa:

```php
use function Laravel\Prompts\select;

$role = select(
    'What role should the user have?',
    ['Member', 'Contributor', 'Owner'],
);
```

### 📋 Prompt dengan Default Value
```php
$role = select(
    label: 'What role should the user have?',
    options: ['Member', 'Contributor', 'Owner'],
    default: 'Member'
);
```

### 📋 Prompt dengan Indexed Options
```php
$type = select(
    label: 'What type of database will your application use?',
    options: [
        'MySQL',
        'PostgreSQL',
        'SQLite',
        'SQL Server',
    ],
    default: 'MySQL',
);
```

### 📋 Prompt dengan Associative Options
```php
$database = select(
    label: 'Which database driver will your application use?',
    options: [
        'mysql' => 'MySQL',
        'pgsql' => 'PostgreSQL',
        'sqlite' => 'SQLite',
        'sqlsrv' => 'SQL Server',
    ],
    default: 'mysql',
);
```

## ☑️ Multi-select

### 📋 Prompt Multi-select Dasar
Untuk memungkinkan pengguna memilih beberapa opsi:

```php
use function Laravel\Prompts\multiselect;

$permissions = multiselect(
    'What permissions should be assigned?',
    ['Read', 'Create', 'Update', 'Delete'],
);
```

### 📋 Prompt dengan Default Value
```php
$permissions = multiselect(
    label: 'What permissions should be assigned?',
    options: ['Read', 'Create', 'Update', 'Delete'],
    default: ['Read']
);
```

### 📋 Prompt dengan Hint
```php
$services = multiselect(
    label: 'Which services will your application need?',
    options: ['redis', 'soketi', 'mysql', 's3', 'mailgun'],
    hint: 'Space to select. Return to submit.'
);
```

## 💡 Suggestions

### 📋 Prompt dengan Suggestions
Untuk memberikan suggestions berdasarkan input pengguna:

```php
use function Laravel\Prompts\suggest;

$name = suggest(
    'What is your name?',
    ['Taylor', 'Dayle', 'Nuno', 'Marcel', 'Dan']
);
```

### 📋 Prompt dengan Custom Search
```php
$name = suggest(
    label: 'What is your name?',
    options: fn ($value) => collect(['Taylor', 'Dayle', 'Nuno', 'Marcel', 'Dan'])
        ->filter(fn ($name) => str_contains(strtolower($name), strtolower($value)))
        ->all()
);
```

## 🔍 Search

### 📋 Prompt Search Dasar
Untuk memungkinkan pengguna mencari dan memilih satu opsi:

```php
use function Laravel\Prompts\search;

$id = search(
    'Search for the user:',
    fn (string $value) => strlen($value) > 0
        ? User::where('name', 'like', "%{$value}%")->pluck('name', 'id')->all()
        : []
);
```

## 🔎 Multi-search

### 📋 Prompt Multi-search Dasar
Untuk memungkinkan pengguna mencari dan memilih beberapa opsi:

```php
use function Laravel\Prompts\multisearch;

$ids = multisearch(
    'Search for the users:',
    fn (string $value) => strlen($value) > 0
        ? User::where('name', 'like', "%{$value}%")->pluck('name', 'id')->all()
        : []
);
```

## 🔢 Number Input

### 📋 Prompt Number Dasar
Untuk meminta input angka dari pengguna:

```php
use function Laravel\Prompts\number;

$age = number('What is your age?');
```

### 📋 Prompt Number dengan Constraints
```php
$age = number(
    label: 'What is your age?',
    min: 18,
    max: 120,
    hint: 'Must be between 18 and 120.'
);
```

## 📁 File Upload

### 📋 Prompt File Upload
Untuk memungkinkan pengguna memilih file:

```php
use function Laravel\Prompts\upload;

$path = upload('Select a file to upload', '../assets');
```

## 🔄 Spinners

### 📋 Spinner Dasar
Untuk menampilkan spinner saat operasi sedang berlangsung:

```php
use function Laravel\Prompts\spin;

$response = spin(
    fn () => Http::get('https://example.com/api.json'),
    'Fetching response...'
);
```

### 📋 Spinner dengan Custom Message
```php
$result = spin(
    fn () => $this->performLongRunningTask(),
    'Processing data...'
);
```

## 📊 Progress Bars

### 📋 Progress Bar Dasar
Untuk menampilkan progress bar saat memproses item:

```php
use function Laravel\Prompts\progress;

$users = User::all();

progress(
    label: 'Updating users',
    steps: $users,
    callback: function ($user) {
        $user->update(['last_active_at' => now()]);
    }
);
```

### 📋 Progress Bar dengan Estimated Time
```php
$results = progress(
    label: 'Processing items',
    steps: 1000,
    callback: function ($step, $progress) {
        // Process item...
        usleep(5000); // Simulate work
        
        // Update progress
        $progress->advance();
    }
);
```

## 📋 Tables

### 📋 Menampilkan Data dalam Tabel
Untuk menampilkan data terstruktur dalam format tabel:

```php
use function Laravel\Prompts\table;

table(
    headers: ['Name', 'Email', 'Role'],
    rows: [
        ['Taylor Otwell', 'taylor@example.com', 'Owner'],
        ['Nuno Maduro', 'nuno@example.com', 'Maintainer'],
    ]
);
```

## 🎨 Customization

### 📋 Mengubah Styling
Anda dapat mengkustomisasi tampilan prompts:

```php
use Laravel\Prompts\Prompt;

Prompt::fallbackWhen(
    ! $input->isInteractive() || windows_os() || app()->runningUnitTests()
);
```

### 📋 Menggunakan Custom Themes
```php
use Laravel\Prompts\Themes\Default\ConfirmPromptRenderer;

ConfirmPromptRenderer::configureUsing(function (ConfirmPromptRenderer $renderer) {
    $renderer->symbol('❓');
});
```

### 📋 Menangani Environment Non-Interactive
```php
use function Laravel\Prompts\text;

if (app()->runningInConsole() && ! app()->environment('testing')) {
    $name = text('What is your name?', required: true);
} else {
    $name = 'Default Name';
}
```

## 🧪 Testing

### 📋 Testing dengan Prompts
Untuk menguji command yang menggunakan prompts:

```php
use Laravel\Prompts\Testing\FakePrompt;

public function test_command_prompts()
{
    FakePrompt::fake([
        'What is your name?' => 'Taylor',
        'Do you wish to continue?' => true,
    ]);

    $this->artisan('your-command')
         ->expectsOutput('Hello Taylor!')
         ->assertExitCode(0);
}
```

### 📋 Testing dengan Multiple Prompts
```php
public function test_command_with_multiple_prompts()
{
    FakePrompt::fake();
    FakePrompt::assertFilled('What is your name?', 'Taylor');
    FakePrompt::assertConfirmed('Do you wish to continue?');
    
    $this->artisan('your-command');
}
```

## 🧠 Kesimpulan

Laravel Prompts menyediakan cara yang indah dan ekspresif untuk menambahkan interaktivitas ke command-line aplikasi Laravel Anda. Dengan berbagai jenis prompt dan elemen visual, Anda dapat membuat pengalaman command-line yang menarik dan intuitif.

### 🔑 Keuntungan Utama
- Berbagai jenis prompt input
- Elemen visual menarik
- Validasi input bawaan
- Customizable appearance
- Cross-platform compatibility
- Graceful fallback untuk environment non-TTY

### 🚀 Best Practices
1. Gunakan prompt yang sesuai dengan jenis input yang dibutuhkan
2. Berikan hint dan placeholder yang informatif
3. Gunakan validasi untuk memastikan input yang valid
4. Gunakan spinner untuk operasi yang memakan waktu
5. Gunakan progress bar untuk proses batch
6. Gunakan tabel untuk menampilkan data terstruktur
7. Uji command dengan berbagai skenario input
8. Tangani kasus edge case seperti environment non-interactive

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Prompts untuk membuat command-line aplikasi Laravel yang interaktif dan menarik.
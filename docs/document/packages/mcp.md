# 🤖 Laravel MCP

Laravel MCP (Mission Control Program) adalah package yang memungkinkan aplikasi Laravel Anda berkomunikasi dengan agen MCP yang kompatibel. MCP menyediakan cara yang aman dan terstruktur untuk aplikasi untuk berinteraksi dengan agen AI, memungkinkan agen untuk membantu pengembang dengan berbagai tugas pengembangan.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [Mendaftarkan Tool](#mendaftarkan-tool)
5. [Membuat Tool](#membuat-tool)
6. [Menggunakan Tool](#menggunakan-tool)
7. [Resource](#resource)
8. [Prompt Caching](#prompt-caching)
9. [Best Practices](#best-practices)

## 🎯 Pendahuluan

Laravel MCP adalah integrasi resmi Laravel dengan protokol Mission Control Program (MCP) yang dikembangkan oleh Anthropic. MCP memungkinkan agen AI untuk dengan aman berinteraksi dengan aplikasi Anda melalui serangkaian "tool" yang telah ditentukan, memungkinkan agen untuk membantu dengan tugas-tugas seperti debugging, refactoring kode, dan analisis sistem.

### ✨ Fitur Utama
- Integrasi langsung dengan protokol MCP
- Sistem tool yang aman dan terstruktur
- Resource untuk berbagi informasi dengan agen
- Prompt caching untuk efisiensi
- Validasi otomatis untuk input tool
- Event system untuk monitoring

### ⚠️ Catatan Penting
Laravel MCP saat ini dalam tahap beta dan mungkin mengalami perubahan breaking sebelum rilis stabil.

## 📦 Instalasi

### 🎯 Menginstal Laravel MCP
Untuk memulai, instal Laravel MCP melalui Composer:

```bash
composer require laravel/mcp
```

### 🛠️ Publish Configuration
Publish file konfigurasi MCP menggunakan perintah vendor:

```bash
php artisan vendor:publish --tag="mcp-config"
```

### 🔧 Run Migrations (Opsional)
Jika Anda berencana menggunakan prompt caching, jalankan migrasi database:

```bash
php artisan migrate
```

## ⚙️ Konfigurasi

### 📄 File Konfigurasi
File konfigurasi utama terletak di `config/mcp.php`. File ini memungkinkan Anda mengkonfigurasi berbagai aspek integrasi MCP.

### 📋 Konfigurasi Dasar
```php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Mission Control Program Domain
    |--------------------------------------------------------------------------
    |
    | This is the domain that the MCP server will be accessible from.
    |
    */

    'domain' => env('MCP_DOMAIN'),

    /*
    |--------------------------------------------------------------------------
    | Mission Control Program Path
    |--------------------------------------------------------------------------
    |
    | This is the path that the MCP server will be accessible from.
    |
    */

    'path' => env('MCP_PATH', 'mcp'),

    /*
    |--------------------------------------------------------------------------
    | Mission Control Program Middleware
    |--------------------------------------------------------------------------
    |
    | These middleware will be assigned to every MCP route.
    |
    */

    'middleware' => [
        'web',
        // 'auth:sanctum',
    ],
];
```

### 🔐 Konfigurasi Environment
Tambahkan konfigurasi berikut ke file `.env` Anda:

```env
MCP_DOMAIN=null
MCP_PATH=mcp
```

## 🛠️ Mendaftarkan Tool

### 📋 Mendaftarkan Tool dalam Service Provider
Tool MCP harus didaftarkan dalam service provider Anda:

```php
<?php

namespace App\Providers;

use App\Mcp\Tools\CreateUserTool;
use App\Mcp\Tools\ListUsersTool;
use Illuminate\Support\ServiceProvider;
use Laravel\Mcp\Mcp;

class McpServiceProvider extends ServiceProvider
{
    /**
     * Register MCP tools.
     */
    public function boot(): void
    {
        Mcp::tools([
            CreateUserTool::class,
            ListUsersTool::class,
        ]);
    }
}
```

### 📋 Mendaftarkan Resource
Resource juga dapat didaftarkan dengan cara yang sama:

```php
use App\Mcp\Resources\UserResource;

public function boot(): void
{
    Mcp::resources([
        UserResource::class,
    ]);
}
```

## 🔧 Membuat Tool

### 📋 Struktur Tool Dasar
Tool MCP mengimplementasikan interface `Laravel\Mcp\Contracts\Tool`:

```php
<?php

namespace App\Mcp\Tools;

use Illuminate\Http\Request;
use Laravel\Mcp\Contracts\Tool;

class CreateUserTool implements Tool
{
    /**
     * Get the tool's name.
     */
    public function name(): string
    {
        return 'create_user';
    }

    /**
     * Get the tool's description.
     */
    public function description(): string
    {
        return 'Create a new user account';
    }

    /**
     * Get the tool's rules.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
        ];
    }

    /**
     * Handle the tool request.
     */
    public function handle(Request $request): array
    {
        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
        ]);

        return [
            'user' => $user->toArray(),
            'message' => 'User created successfully',
        ];
    }
}
```

### 📋 Tool dengan Konfirmasi
Tool dapat memerlukan konfirmasi dari pengguna sebelum dieksekusi:

```php
use Laravel\Mcp\Confirmable;

class DeleteUserTool implements Tool
{
    use Confirmable;

    public function name(): string
    {
        return 'delete_user';
    }

    public function description(): string
    {
        return 'Delete a user account';
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
        ];
    }

    public function confirmationPrompt(Request $request): string
    {
        $user = User::find($request->input('user_id'));
        return "Are you sure you want to delete user {$user->name}?";
    }

    public function handle(Request $request): array
    {
        $user = User::find($request->input('user_id'));
        $user->delete();

        return [
            'message' => 'User deleted successfully',
        ];
    }
}
```

## 🚀 Menggunakan Tool

### ▶️ Menjalankan Server MCP
Untuk menjalankan server MCP, gunakan perintah artisan:

```bash
php artisan mcp:serve
```

### 📋 Mengakses Endpoint MCP
Server MCP akan tersedia di endpoint yang dikonfigurasi:

```
http://your-app.test/mcp
```

### 📋 Testing Tool
Anda dapat menguji tool secara manual menggunakan HTTP client:

```bash
curl -X POST http://your-app.test/mcp/tools/create_user \
     -H "Content-Type: application/json" \
     -d '{
         "name": "John Doe",
         "email": "john@example.com",
         "password": "secret123"
     }'
```

## 📦 Resource

### 📋 Membuat Resource
Resource memungkinkan Anda untuk berbagi informasi dengan agen MCP:

```php
<?php

namespace App\Mcp\Resources;

use Laravel\Mcp\Contracts\Resource;

class UserResource implements Resource
{
    /**
     * Get the resource's name.
     */
    public function name(): string
    {
        return 'users';
    }

    /**
     * Get the resource's description.
     */
    public function description(): string
    {
        return 'Information about application users';
    }

    /**
     * Get the resource's content.
     */
    public function content(): string
    {
        return json_encode([
            'total_users' => User::count(),
            'recent_users' => User::latest()->take(10)->get()->toArray(),
            'user_roles' => Role::all()->toArray(),
        ]);
    }
}
```

### 📋 Resource Dinamis
Resource juga dapat menerima parameter:

```php
public function content(array $parameters = []): string
{
    $query = User::query();
    
    if (isset($parameters['role'])) {
        $query->whereHas('roles', function ($q) use ($parameters) {
            $q->where('name', $parameters['role']);
        });
    }
    
    return json_encode($query->get()->toArray());
}
```

## 💾 Prompt Caching

### 📋 Mengaktifkan Prompt Caching
Prompt caching memungkinkan Anda untuk menyimpan prompt yang mahal secara komputasi:

```php
use Laravel\Mcp\Concerns\HasPromptCache;

class AnalyzeUserBehaviorTool implements Tool
{
    use HasPromptCache;
    
    public function handle(Request $request): array
    {
        $prompt = "Analyze user behavior for user ID: {$request->input('user_id')}";
        
        $result = $this->cachePrompt($prompt, function () use ($request) {
            // Expensive analysis logic here
            return $this->performAnalysis($request->input('user_id'));
        });
        
        return [
            'analysis' => $result,
        ];
    }
}
```

### 📋 Konfigurasi Caching
Anda dapat mengkonfigurasi durasi caching dalam file konfigurasi:

```php
'prompt_cache' => [
    'ttl' => 3600, // 1 hour
    'store' => 'redis',
],
```

## 🧠 Best Practices

### 🔐 Keamanan
1. Validasi semua input tool dengan benar
2. Gunakan konfirmasi untuk operasi destruktif
3. Batasi akses ke endpoint MCP
4. Gunakan middleware autentikasi yang sesuai
5. Jangan mengekspos informasi sensitif melalui resource

### 🚀 Performa
1. Gunakan prompt caching untuk operasi mahal
2. Batasi jumlah data yang dikembalikan oleh resource
3. Gunakan pagination untuk dataset besar
4. Optimalkan query database dalam tool
5. Gunakan queue untuk operasi lama

### 📋 Organisasi
1. Kelompokkan tool terkait dalam namespace yang sama
2. Gunakan penamaan yang konsisten untuk tool dan resource
3. Dokumentasikan setiap tool dengan deskripsi yang jelas
4. Gunakan type hinting dan return type dengan benar
5. Gunakan event untuk logging dan monitoring

### 🧪 Testing
1. Tulis test unit untuk setiap tool
2. Test validasi input dengan berbagai skenario
3. Test error handling dan edge cases
4. Gunakan mocking untuk dependensi eksternal
5. Test konfirmasi dan prompt caching

## 🧠 Kesimpulan

Laravel MCP menyediakan integrasi yang kuat dan aman antara aplikasi Laravel Anda dan agen AI yang kompatibel dengan MCP. Dengan sistem tool yang terstruktur dan resource untuk berbagi informasi, MCP memungkinkan agen untuk memberikan bantuan yang berharga dalam pengembangan aplikasi Anda.

### 🔑 Keuntungan Utama
- Integrasi langsung dengan protokol MCP
- Sistem tool yang aman dan tervalidasi
- Resource untuk berbagi informasi dengan agen
- Prompt caching untuk efisiensi
- Event system untuk monitoring
- Konfigurasi yang fleksibel

### 🚀 Best Practices
1. Prioritaskan keamanan dalam semua tool
2. Gunakan validasi input yang ketat
3. Implementasikan konfirmasi untuk operasi kritis
4. Gunakan caching untuk operasi mahal
5. Organisir tool dengan baik
6. Tulis test yang komprehensif
7. Monitor penggunaan tool melalui event

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel MCP untuk mengintegrasikan aplikasi Laravel Anda dengan agen AI yang kompatibel dengan MCP.
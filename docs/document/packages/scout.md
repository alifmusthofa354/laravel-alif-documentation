# 🔍 Laravel Scout

Laravel Scout menyediakan solusi pencarian database yang sederhana dan dapat diskalakan untuk model Eloquent Anda. Dengan menggunakan driver berbasis model, Scout secara otomatis akan menyinkronkan pencarian indeks Anda dengan model Eloquent Anda.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [Driver yang Tersedia](#driver-yang-tersedia)
5. [Membuat Indeks](#membuat-indeks)
6. [Mengindeks Model](#mengindeks-model)
7. [Mencari Model](#mencari-model)
8. [Customizing Engine Searches](#customizing-engine-searches)
9. [Mencari Collections](#mencari-collections)
10. [Customizing Index Queries](#customizing-index-queries)
11. [Customizing Searchable Data](#customizing-searchable-data)
12. [Searching Algolia](#searching-algolia)
13. [Searching Meilisearch](#searching-meilisearch)
14. [Searching Database](#searching-database)

## 🎯 Pendahuluan

Laravel Scout menyediakan solusi pencarian database yang sederhana dan dapat diskalakan untuk model Eloquent Anda. Dengan menggunakan driver berbasis model, Scout secara otomatis akan menyinkronkan pencarian indeks Anda dengan model Eloquent Anda.

### ✨ Fitur Utama
- Pencarian full-text yang kuat
- Sinkronisasi otomatis dengan model Eloquent
- Support untuk berbagai search engine
- Pencarian real-time
- Customizable searchable data
- Pagination support
- Soft delete handling
- Queue support
- Multiple model search

### ⚠️ Catatan Penting
Scout hanya akan menyinkronkan kolom yang telah diindeks ke mesin pencari Anda. Jika Anda ingin menyinkronkan data model yang tidak dapat diindeks, Anda harus menggunakan metode `toSearchableArray` untuk menentukan data yang akan disinkronkan.

## 📦 Instalasi

### 🎯 Menginstal Scout
Untuk memulai, instal Scout melalui Composer:

```bash
composer require laravel/scout
```

### 🛠️ Publish Configuration
Setelah menginstal Scout, Anda harus mempublish file konfigurasi menggunakan perintah vendor:

```bash
php artisan vendor:publish --provider="Laravel\Scout\ScoutServiceProvider"
```

### 🔧 Run Migrations
Scout menyertakan migrasi database untuk menyimpan informasi tentang indeks model Anda. Anda harus menjalankan migrasi:

```bash
php artisan migrate
```

### 🔄 Add Scout Trait to Models
Tambahkan trait `Laravel\Scout\Searchable` ke model yang ingin Anda buat indeksnya:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scct\Searchable;

class Post extends Model
{
    use Searchable;
}
```

## ⚙️ Konfigurasi

### 📄 File Konfigurasi
File konfigurasi utama terletak di `config/scout.php`. File ini memungkinkan Anda mengkonfigurasi berbagai aspek perilaku Scout.

### 📋 Konfigurasi Dasar
```php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Search Engine
    |--------------------------------------------------------------------------
    |
    | This option controls the default search connection that gets used while
    | using Laravel Scout. This connection is used when syncing all models
    | to the search service. You should adjust this based on your needs.
    |
    */

    'driver' => env('SCOUT_DRIVER', 'algolia'),

    /*
    |--------------------------------------------------------------------------
    | Index Prefix
    |--------------------------------------------------------------------------
    |
    | Here you may specify a prefix that will be applied to all search index
    | names so you can avoid collisions with other applications.
    |
    */

    'prefix' => env('SCOUT_PREFIX', ''),

    /*
    |--------------------------------------------------------------------------
    | Queue Data Syncing
    |--------------------------------------------------------------------------
    |
    | This option allows you to control if the operations that sync your data
    | with your search engines are queued. When this is set to "true" then
    | all automatic data syncing will get queued for better performance.
    |
    */

    'queue' => env('SCOUT_QUEUE', false),

    /*
    |--------------------------------------------------------------------------
    | Database Transactions
    |--------------------------------------------------------------------------
    |
    | This configuration option determines if your data will only be synced
    | with your search indexes after every open database transaction has
    | been committed, thus preventing any discarded data from syncing.
    |
    */

    'after_commit' => false,

    /*
    |--------------------------------------------------------------------------
    | Chunk Sizes
    |--------------------------------------------------------------------------
    |
    | These options allow you to control the maximum chunk size when you are
    | mass importing data into the search engine. This allows you to fine
    | tune each of these chunk sizes based on the power of the servers.
    |
    */

    'chunk' => [
        'searchable' => 500,
        'unsearchable' => 500,
    ],

    /*
    |--------------------------------------------------------------------------
    | Soft Deletes
    |--------------------------------------------------------------------------
    |
    | This option allows to control whether soft deleted models should be
    | synced to the search engine. This is great if you don't want to
    | sync soft deletes to your search engine.
    |
    */

    'soft_delete' => false,

    /*
    |--------------------------------------------------------------------------
    | Identify User
    |--------------------------------------------------------------------------
    |
    | This option allows you to control whether to notify the search engine
    | of the user performing the search. This is sometimes useful if the
    | engine supports any analytics based on this application's users.
    |
    */

    'identify' => env('SCOUT_IDENTIFY', false),

    /*
    |--------------------------------------------------------------------------
    | Engines
    |--------------------------------------------------------------------------
    |
    | Below, you can configure the settings for each search engine that is
    | supported by Scout. Each configuration array contains various
    | settings for the particular search engine.
    |
    */

    'algolia' => [
        'id' => env('ALGOLIA_APP_ID', ''),
        'secret' => env('ALGOLIA_SECRET', ''),
    ],

    'meilisearch' => [
        'host' => env('MEILISEARCH_HOST', 'http://localhost:7700'),
        'key' => env('MEILISEARCH_KEY', null),
        'index-settings' => [
            // 'users' => [
            //     'filterableAttributes'=> ['id', 'name', 'email'],
            // ],
        ],
    ],
];
```

### 🔐 Konfigurasi Environment
Tambahkan konfigurasi berikut ke file `.env` Anda:

```bash
SCOUT_DRIVER=algolia
SCOUT_QUEUE=false
SCOUT_PREFIX=

ALGOLIA_APP_ID=your-algolia-app-id
ALGOLIA_SECRET=your-algolia-secret

MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_KEY=masterKey
```

## 🚀 Driver yang Tersedia

### 📋 Algolia Driver
Driver default Scout adalah Algolia, layanan pencarian berbasis cloud yang cepat:

```bash
SCOUT_DRIVER=algolia
ALGOLIA_APP_ID=your-algolia-app-id
ALGOLIA_SECRET=your-algolia-secret
```

### 📋 Meilisearch Driver
Meilisearch adalah mesin pencarian open-source yang kuat:

```bash
SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_KEY=masterKey
```

### 📋 Database Driver
Untuk penggunaan sederhana tanpa search engine eksternal:

```bash
SCOUT_DRIVER=database
SCOUT_QUEUE=false
```

### 📋 Collection Driver
Untuk pengujian dan pengembangan:

```bash
SCOUT_DRIVER=collection
SCOUT_QUEUE=false
```

### 📋 Null Driver
Untuk menonaktifkan pencarian:

```bash
SCOUT_DRIVER=null
```

## 📋 Membuat Indeks

### 📋 Membuat Indeks untuk Model
Untuk membuat indeks untuk model Anda:

```bash
php artisan scout:index posts
```

### 📋 Menghapus Indeks
Untuk menghapus indeks:

```bash
php artisan scout:delete-index posts
```

### 📋 Membuat Indeks dengan Konfigurasi Kustom
Untuk driver tertentu seperti Meilisearch:

```bash
php artisan scout:index users --key=users_index_key
```

### 📋 Membuat Indeks dengan Filterable Attributes (Meilisearch)
```php
// config/scout.php
'meilisearch' => [
    'host' => env('MEILISEARCH_HOST', 'http://localhost:7700'),
    'key' => env('MEILISEARCH_KEY', null),
    'index-settings' => [
        'users' => [
            'filterableAttributes' => ['id', 'name', 'email', 'created_at'],
            'sortableAttributes' => ['created_at'],
        ],
    ],
],
```

## 📦 Mengindeks Model

### 📋 Menambahkan Model ke Indeks
Untuk menambahkan model ke indeks pencarian:

```php
use App\Models\Post;

// Menambahkan satu model
$post = Post::find(1);
$post->searchable();

// Menambahkan koleksi model
$posts = Post::where('published', true)->get();
$posts->searchable();
```

### 📋 Menghapus Model dari Indeks
```php
// Menghapus satu model
$post = Post::find(1);
$post->unsearchable();

// Menghapus koleksi model
$posts = Post::where('published', false)->get();
$posts->unsearchable();
```

### 📋 Mengindeks Semua Model
```bash
php artisan scout:import "App\Models\Post"
```

### 📋 Menghapus Semua Model dari Indeks
```bash
php artisan scout:flush "App\Models\Post"
```

### 📋 Menggunakan Queue untuk Sinkronisasi
Untuk meningkatkan performa, Anda dapat mengantrekan operasi sinkronisasi:

```bash
SCOUT_QUEUE=true
```

Kemudian jalankan queue worker:

```bash
php artisan queue:work
```

### 📋 Membatalkan Operasi Queue
Jika Anda perlu membatalkan operasi yang telah diantrekan:

```bash
php artisan queue:forget {id}
```

## 🔎 Mencari Model

### 📋 Pencarian Dasar
Untuk melakukan pencarian dasar:

```php
use App\Models\Post;

$posts = Post::search('laravel')->get();
```

### 📋 Pencarian dengan Pagination
```php
$posts = Post::search('laravel')->paginate(20);
```

### 📋 Pencarian dengan Constraint
```php
// Mencari dengan constraint
$posts = Post::search('laravel')
    ->where('published', true)
    ->get();

// Mencari dengan multiple constraint (Meilisearch)
$posts = Post::search('laravel')
    ->where('published', true)
    ->where('category_id', 1)
    ->get();
```

### 📋 Pencarian dengan Sorting
```php
// Sorting (Meilisearch)
$posts = Post::search('laravel')
    ->orderBy('created_at', 'desc')
    ->get();

// Sorting dengan multiple kolom
$posts = Post::search('laravel')
    ->orderBy('created_at', 'desc')
    ->orderBy('title', 'asc')
    ->get();
```

### 📋 Pencarian dengan Raw Results
```php
// Mendapatkan hasil raw dari search engine
$results = Post::search('laravel')->raw();
```

### 📋 Pencarian dengan Highlighting
```php
// Highlighting (Meilisearch)
$posts = Post::search('laravel')
    ->withHighlighting()
    ->get();
```

### 📋 Pencarian dengan Faceting
```php
// Faceting (Meilisearch)
$posts = Post::search('laravel')
    ->withFacets(['category', 'tags'])
    ->get();
```

## ⚙️ Customizing Engine Searches

### 📋 Menggunakan Engine Kustom
Anda dapat mengakses engine pencarian langsung:

```php
use App\Models\Post;
use Laravel\Scout\EngineManager;

$engine = app(EngineManager::class)->engine();
$results = $engine->search(Post::search('laravel'));
```

### 📋 Mengkustomisasi Parameter Pencarian
```php
$posts = Post::search('laravel')
    ->options([
        'hitsPerPage' => 50,
        'page' => 1,
    ])
    ->get();
```

### 📋 Menggunakan Search Rules (Algolia)
```php
$posts = Post::search('laravel')
    ->rules([
        'promoteExactOn:slug',
        'typoTolerance:strict',
    ])
    ->get();
```

## 📚 Mencari Collections

### 📋 Menggunakan Collection Driver
Collection driver berguna untuk pengujian dan pengembangan:

```php
// config/scout.php
'driver' => env('SCOUT_DRIVER', 'collection'),
```

### 📋 Pencarian dengan Collections
```php
use App\Models\Post;

$posts = Post::search('laravel')->get();

// Collections driver mendukung semua metode pencarian dasar
$posts = Post::search('laravel')
    ->where('published', true)
    ->paginate(20);
```

### 📋 Testing dengan Collections
```php
// tests/Feature/SearchTest.php
public function test_search_returns_correct_results()
{
    $post = Post::factory()->create([
        'title' => 'Laravel Scout Tutorial',
        'content' => 'Learn how to use Laravel Scout for search functionality',
    ]);

    $results = Post::search('Laravel')->get();

    $this->assertCount(1, $results);
    $this->assertEquals($post->id, $results->first()->id);
}
```

## 🎯 Customizing Index Queries

### 📋 Membuat Scope Query MakeAllSearchable
Untuk menyesuaikan query yang digunakan saat membuat indeks:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Post extends Model
{
    use Searchable;

    /**
     * Modify the query used to retrieve models when making all of the models searchable.
     */
    protected function makeAllSearchableUsing($query)
    {
        return $query->with('author');
    }
}
```

### 📋 Menggunakan Global Scopes
```php
protected function makeAllSearchableUsing($query)
{
    return $query->withoutGlobalScopes();
}
```

### 📋 Menggunakan Eager Loading
```php
protected function makeAllSearchableUsing($query)
{
    return $query->with(['author', 'category', 'tags']);
}
```

## 🎨 Customizing Searchable Data

### 📋 Menyesuaikan Data yang Dapat Dicari
Untuk menyesuaikan data yang disinkronkan ke search engine:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Post extends Model
{
    use Searchable;

    /**
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        $array = $this->toArray();

        // Menyesuaikan data indeks
        $array['created_at_human'] = $this->created_at->diffForHumans();

        return $array;
    }
}
```

### 📋 Menambahkan Data Relasi
```php
public function toSearchableArray(): array
{
    return array_merge($this->toArray(), [
        'author' => $this->author->name,
        'category' => $this->category->name,
        'tags' => $this->tags->pluck('name')->toArray(),
    ]);
}
```

### 📋 Menggunakan Array Transformasi
```php
public function toSearchableArray(): array
{
    return $this->transform($this->toArray());
}

protected function transform($data): array
{
    // Menghapus kolom yang tidak diperlukan
    unset($data['password'], $data['remember_token']);

    // Menambahkan data tambahan
    $data['full_text'] = implode(' ', [
        $data['title'],
        $data['content'],
        $this->author->name ?? '',
    ]);

    return $data;
}
```

## 🔍 Searching Algolia

### 📋 Konfigurasi Algolia
```bash
SCOUT_DRIVER=algolia
ALGOLIA_APP_ID=your-algolia-app-id
ALGOLIA_SECRET=your-algolia-secret
```

### 📋 Menggunakan Algolia Search
```php
use App\Models\Post;

// Pencarian dasar
$posts = Post::search('laravel')->get();

// Pencarian dengan facet filtering
$posts = Post::search('laravel')
    ->where('category', 'technology')
    ->get();

// Pencarian dengan typo tolerance
$posts = Post::search('laravel')
    ->options([
        'typoTolerance' => 'min',
    ])
    ->get();

// Pencarian dengan ranking
$posts = Post::search('laravel')
    ->options([
        'ranking' => ['typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'],
    ])
    ->get();
```

### 📋 Algolia Search Rules
```php
$posts = Post::search('laravel')
    ->rules([
        'promoteExactOn:slug',
        'typoTolerance:strict',
    ])
    ->get();
```

### 📋 Algolia Faceting
```php
$results = Post::search('laravel')
    ->withFacets(['category', 'tags'])
    ->raw();
```

## 🔎 Searching Meilisearch

### 📋 Konfigurasi Meilisearch
```bash
SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_KEY=masterKey
```

### 📋 Menggunakan Meilisearch
```php
use App\Models\Post;

// Pencarian dasar
$posts = Post::search('laravel')->get();

// Pencarian dengan filtering
$posts = Post::search('laravel')
    ->where('published', true)
    ->get();

// Pencarian dengan sorting
$posts = Post::search('laravel')
    ->orderBy('created_at', 'desc')
    ->get();

// Pencarian dengan highlighting
$posts = Post::search('laravel')
    ->withHighlighting()
    ->get();

// Pencarian dengan faceting
$posts = Post::search('laravel')
    ->withFacets(['category', 'tags'])
    ->get();
```

### 📋 Konfigurasi Indeks Meilisearch
```php
// config/scout.php
'meilisearch' => [
    'host' => env('MEILISEARCH_HOST', 'http://localhost:7700'),
    'key' => env('MEILISEARCH_KEY', null),
    'index-settings' => [
        'posts' => [
            'filterableAttributes' => ['id', 'category_id', 'published', 'created_at'],
            'sortableAttributes' => ['created_at', 'title'],
            'displayedAttributes' => ['id', 'title', 'content', 'created_at'],
        ],
    ],
],
```

### 📋 Membuat Indeks dengan Konfigurasi Kustom
```bash
php artisan scout:index posts --key=posts_index_key
```

## 🗃️ Searching Database

### 📋 Konfigurasi Database Driver
```bash
SCOUT_DRIVER=database
SCOUT_QUEUE=false
```

### 📋 Menggunakan Database Search
```php
use App\Models\Post;

// Pencarian full-text
$posts = Post::search('laravel')->get();

// Pencarian dengan constraint
$posts = Post::search('laravel')
    ->where('published', true)
    ->get();

// Pencarian dengan pagination
$posts = Post::search('laravel')
    ->paginate(20);
```

### 📋 Konfigurasi Database Search Columns
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Post extends Model
{
    use Searchable;

    /**
     * Get the columns that should be searched.
     */
    public function toSearchableArray(): array
    {
        return [
            'title' => $this->title,
            'content' => $this->content,
            'excerpt' => $this->excerpt,
        ];
    }
}
```

### 📋 Database Search dengan Multiple Columns
```php
public function toSearchableArray(): array
{
    return [
        'title' => $this->title,
        'content' => $this->content,
        'author_name' => $this->author->name,
        'category_name' => $this->category->name,
    ];
}
```

### 📋 Database Search dengan Weighted Columns
```php
// Untuk database driver, weighting dilakukan dengan menambahkan kolom beberapa kali
public function toSearchableArray(): array
{
    return [
        // Title muncul 3 kali untuk weighting
        'title' => str_repeat($this->title . ' ', 3),
        'content' => $this->content,
    ];
}
```

## 🧠 Kesimpulan

Laravel Scout menyediakan solusi pencarian database yang sederhana dan dapat diskalakan untuk model Eloquent Anda. Dengan dukungan untuk berbagai search engine dan kemampuan untuk menyesuaikan data yang dapat dicari, Scout memungkinkan Anda membangun fitur pencarian yang kuat dalam aplikasi Laravel Anda.

### 🔑 Keuntungan Utama
- Sinkronisasi otomatis dengan model Eloquent
- Support untuk berbagai search engine (Algolia, Meilisearch, database)
- Pencarian full-text yang kuat
- Pagination support
- Queue support untuk performa optimal
- Soft delete handling
- Customizable searchable data
- Testing yang mudah

### 🚀 Best Practices
1. Gunakan queue untuk sinkronisasi data yang besar
2. Sesuaikan data yang diindeks dengan kebutuhan pencarian
3. Gunakan soft delete handling jika diperlukan
4. Terapkan rate limiting pada endpoint pencarian
5. Gunakan pagination untuk hasil yang besar
6. Monitor penggunaan search engine secara berkala
7. Gunakan konfigurasi prefix untuk menghindari collision
8. Uji implementasi pencarian secara menyeluruh
9. Gunakan index settings yang optimal untuk performa
10. Terapkan caching untuk hasil pencarian yang sering digunakan

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Scout untuk mengimplementasikan fitur pencarian yang kuat dalam aplikasi Laravel Anda.
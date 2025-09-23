# 📘 Eloquent

Dokumentasi ini menjelaskan semua fitur Eloquent Laravel secara menyeluruh, dari **model dasar** hingga **pruning, scopes, events, observers, dan manipulasi model**.

## 📝 Pendahuluan

Laravel menyertakan **Eloquent ORM**, yang memungkinkan interaksi dengan database menggunakan model PHP. Setiap tabel database biasanya memiliki model yang mewakili tabel tersebut. Model ini memudahkan kita untuk:

* Mengambil data
* Menambahkan data
* Memperbarui data
* Menghapus data

Sebelum memulai, pastikan **koneksi database** telah dikonfigurasi di `config/database.php`.

## ⚡ Membuat Model

### Membuat Model Baru

```bash
php artisan make:model Flight
```

Bersamaan dengan migration:

```bash
php artisan make:model Flight -m
```

Opsional lainnya:

| Opsi                  | Fungsi                      |
|  |  |
| `-f` / `--factory`    | Membuat factory             |
| `-s` / `--seed`       | Membuat seeder              |
| `-c` / `--controller` | Membuat controller          |
| `--all` / `-a`        | Membuat semua kelas terkait |



## 🔗 Konvensi Model

* **Tabel:** default nama plural snake\_case (`Flight` → `flights`)
* **Primary Key:** default `id`, bisa diganti
* **UUID/ULID:** menggunakan trait `HasUuids` atau `HasUlids`
* **Timestamps:** otomatis (`created_at`, `updated_at`), bisa dimatikan



## 💾 Menyimpan Data

### Menambahkan Data

```php
$flight = new Flight;
$flight->name = 'London to Paris';
$flight->save();
```

Atau menggunakan mass assignment:

```php
$flight = Flight::create(['name' => 'London to Paris']);
```

### Memperbarui Data

```php
$flight = Flight::find(1);
$flight->name = 'Paris to London';
$flight->save();
```

Mass update:

```php
Flight::where('active', 1)
    ->update(['delayed' => 1]);
```



## 🧹 Menghapus Data

* **Delete** (menghapus model tertentu)
* **Destroy** (menghapus tanpa ambil model)

```php
$flight->delete();
Flight::destroy(1,2,3);
```

### 🌿 Soft Deletes

```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Flight extends Model
{
    use SoftDeletes;
}
```

* **Restore:** `$flight->restore();`
* **Force Delete:** `$flight->forceDelete();`
* **Query Soft Deleted:**

```php
Flight::withTrashed()->get();
Flight::onlyTrashed()->get();
```



## 📊 Mengambil Data

* Semua data: `Flight::all()`
* Query builder:

```php
Flight::where('active', 1)->orderBy('name')->limit(10)->get();
```

* Single model: `Flight::find(1)`
* Chunking:

```php
Flight::chunk(200, function($flights){ /* ... */ });
```



## 🌿 Pruning Models

Pruning otomatis menghapus model yang tidak lagi dibutuhkan.

### **Prunable Trait**

```php
use Illuminate\Database\Eloquent\Prunable;

class Flight extends Model
{
    use Prunable;

    public function prunable(): Builder
    {
        return static::where('created_at', '<=', now()->subMonth());
    }

    protected function pruning(): void
    {
        // Hapus resource terkait sebelum deletion
    }
}
```

* Jadwal:

```php
Schedule::command('model:prune')->daily();
```

* Uji tanpa hapus data:

```bash
php artisan model:prune --pretend
```

### **MassPrunable Trait**

* Hapus massal tanpa memuat model.
* Event dan `pruning()` **tidak dipanggil**.



## 🔄 Replicating Models

* Membuat salinan model:

```php
$billing = $shipping->replicate()->fill(['type' => 'billing']);
$billing->save();
```

* Mengecualikan atribut:

```php
$flight = $flight->replicate(['last_flown', 'last_pilot_id']);
```



## 🔍 Query Scopes

### **Global Scopes**

* Memberikan constraint pada semua query model
* Class-based:

```php
class AncientScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $builder->where('created_at', '<', now()->subYears(2000));
    }
}
```

* Terapkan di model:

```php
#[ScopedBy([AncientScope::class])]
class User extends Model {}
```

* Anonymous scope:

```php
static::addGlobalScope('ancient', fn(Builder $builder)=> $builder->where('created_at','<', now()->subYears(2000)));
```

* Menghapus scope:

```php
User::withoutGlobalScope(AncientScope::class)->get();
User::withoutGlobalScopes()->get();
```

### **Local Scopes**

* Reusable constraints:

```php
#[Scope]
protected function popular(Builder $query): void
{
    $query->where('votes','>',100);
}
```

* Dynamic scopes:

```php
#[Scope]
protected function ofType(Builder $query, string $type): void
{
    $query->where('type',$type);
}
$users = User::ofType('admin')->get();
```



## 🔗 Membandingkan Model

```php
$post->is($anotherPost);
$post->isNot($anotherPost);
```



## 🎉 Events

* Lifecycle events: `retrieved`, `creating`, `created`, `updating`, `updated`, `saving`, `saved`, `deleting`, `deleted`, `restoring`, `restored`, `replicating`
* Mapping:

```php
protected $dispatchesEvents = [
    'saved'=>UserSaved::class,
    'deleted'=>UserDeleted::class,
];
```

* Closure events:

```php
protected static function booted(): void
{
    static::created(function(User $user){ /* ... */ });
}
```

* Queueable events:

```php
static::created(queueable(fn(User $user)=>{/* ... */}));
```



## 🧑‍💼 Observers

* Group multiple event listeners
* Artisan command:

```bash
php artisan make:observer UserObserver --model=User
```

* Register:

```php
User::observe(UserObserver::class);
```

* Bisa implement `ShouldHandleEventsAfterCommit` untuk event setelah transaction commit.



## 🤫 Muting Events

* Tanpa event:

```php
$user = User::withoutEvents(fn() => {
    User::findOrFail(1)->delete();
    return User::find(2);
});
```

* Save/update/delete quietly:

```php
$user->saveQuietly();
$user->deleteQuietly();
$user->restoreQuietly();
```
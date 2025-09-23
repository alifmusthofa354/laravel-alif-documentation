# 📚 **Relationships**

## 🔹 **Pendahuluan**

Database sering memiliki tabel yang saling terkait. Misalnya:

* Blog post memiliki banyak komentar
* Pesanan terkait dengan pengguna

Laravel Eloquent memudahkan kita mengelola hubungan antar tabel dengan berbagai tipe relasi:

* 🔹 One To One
* 🔹 One To Many
* 🔹 Many To Many
* 🔹 Has One / Has Many Through
* 🔹 One To One / One To Many Polymorphic
* 🔹 Many To Many Polymorphic

Eloquent menggunakan **metode pada model** untuk mendefinisikan relasi sekaligus berfungsi sebagai **query builder**. Contoh:

```php
$user->posts()->where('active', 1)->get();
```



## 🔹 **1. One to One / Has One**

Relasi **one-to-one** adalah tipe hubungan paling sederhana.
Contoh: **User** memiliki satu **Phone**.

### 📌 **Definisi Relasi**

```php
class User extends Model
{
    public function phone(): HasOne
    {
        return $this->hasOne(Phone::class);
    }
}
```

### 📌 **Mengakses Relasi**

```php
$phone = User::find(1)->phone;
```

### 📌 **Inverse Relasi**

```php
class Phone extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```



## 🔹 **2. One to Many / Has Many**

Satu model memiliki banyak model anak.
Contoh: **Post** memiliki banyak **Comment**.

### 📌 **Definisi Relasi**

```php
class Post extends Model
{
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
```

### 📌 **Mengakses Relasi**

```php
$comments = Post::find(1)->comments;

foreach ($comments as $comment) {
    echo $comment->body;
}
```

### 📌 **Inverse Relasi**

```php
class Comment extends Model
{
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
```



## 🔹 **3. Many to Many**

Digunakan saat banyak model saling memiliki.
Contoh: User ↔ Role

### 📌 **Struktur Tabel**

```
users
roles
role_user (pivot table)
```

### 📌 **Definisi Relasi**

```php
class User extends Model
{
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }
}

class Role extends Model
{
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
```

### 📌 **Mengakses Data Pivot**

```php
$user = User::find(1);
foreach ($user->roles as $role) {
    echo $role->pivot->created_at;
}
```



## 🔹 **4. Has One / Has Many Through**

### 📌 **Has One Through**

Satu model mengakses model lain melalui model perantara.
Contoh: Mechanic → Car → Owner

```php
class Mechanic extends Model
{
    public function carOwner(): HasOneThrough
    {
        return $this->hasOneThrough(Owner::class, Car::class);
    }
}
```

### 📌 **Has Many Through**

Satu model mengakses banyak model melalui model perantara.
Contoh: Application → Environment → Deployment

```php
class Application extends Model
{
    public function deployments(): HasManyThrough
    {
        return $this->hasManyThrough(Deployment::class, Environment::class);
    }
}
```



## 🔹 **5. Polymorphic Relationships**

Polymorphic memungkinkan child model dimiliki oleh lebih dari satu model.

### 📌 **One to One Polymorphic**

Contoh: User & Post memiliki Image

```php
class Image extends Model
{
    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }
}

class Post extends Model
{
    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}

class User extends Model
{
    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}
```

### 📌 **One to Many Polymorphic**

Contoh: Post & Video memiliki Comment

```php
class Comment extends Model
{
    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }
}

class Post extends Model
{
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

class Video extends Model
{
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
```



## 🔹 **6. Eager Loading & Querying**

### 📌 **Eager Loading**

* Mengurangi **N+1 queries**

```php
$books = Book::with('author.contacts')->get();
```

* MorphTo eager loading: `morphWith()`, `morphWithCount()`
* Constrained eager loading:

```php
User::with(['posts' => fn($q) => $q->where('title', 'like', '%code%')])->get();
```

### 📌 **Querying Relationships**

* `has()`, `doesntHave()`
* `whereHas()`, `whereDoesntHave()`
* `whereRelation()`

### 📌 **Aggregating Related Models**

* `withCount()`, `withSum()`, `withAvg()`, `withMin()`, `withMax()`

```php
$posts = Post::withCount(['comments', 'comments as pending_comments_count' => fn($q)=>$q->where('approved', false)])->get();
```



## 🔹 **7. Menyimpan dan Mengupdate Relasi**

* **One to Many**

```php
$post->comments()->save(new Comment(['message' => 'New comment']));
$post->comments()->create(['message' => 'Another comment']);
```

* **BelongsTo**: `associate()` / `dissociate()`
* **Many to Many**: `attach()`, `detach()`, `sync()`, `toggle()`, `updateExistingPivot()`



## 🔹 **8. Tips Performa**

* Hindari lazy loading: `Model::preventLazyLoading()`
* Seleksi kolom spesifik saat eager loading
* Gunakan **automatic eager loading** & **lazy prevention**
* Hati-hati saat polymorphic parent-child



## ⚡ **Kesimpulan**

1. Selalu gunakan eager loading untuk nested/multiple relationships.
2. Polymorphic relationships perlu perencanaan matang.
3. Many-to-many operations fleksibel dan efisien.
4. Aggregates (`withCount` dll.) meningkatkan performa.
5. Optimalkan koleksi besar dengan automatic eager loading dan lazy prevention.


Perfect! Saya akan buat versi **cheat sheet Eloquent Relationships** dalam **bahasa Indonesia**, lengkap dengan **ikon**, ringkas, dan mudah dijadikan **quick reference**. Berikut versinya:

## 📋 **Cheat Sheet Eloquent Relationships Laravel**

| 🔹 **Tipe Relasi**           | 🛠️ **Method**     | 📌 **Keterangan / Contoh**                                      |
| ---------------------------- | ------------------ | --------------------------------------------------------------- |
| **One to One**               | `hasOne()`         | User → Phone <br> `$user->phone`                                |
|                              | `belongsTo()`      | Phone → User <br> `$phone->user`                                |
| **One to Many**              | `hasMany()`        | Post → Comment <br> `$post->comments`                           |
|                              | `belongsTo()`      | Comment → Post <br> `$comment->post`                            |
| **Many to Many**             | `belongsToMany()`  | User ↔ Role <br> `$user->roles`                                 |
|                              | Pivot access       | `$role->pivot->created_at`                                      |
| **Has One Through**          | `hasOneThrough()`  | Mechanic → Car → Owner <br> `$mechanic->carOwner`               |
| **Has Many Through**         | `hasManyThrough()` | Application → Environment → Deployment <br> `$app->deployments` |
| **One to One Polymorphic**   | `morphOne()`       | User & Post → Image <br> `$user->image`                         |
|                              | `morphTo()`        | Image → User / Post <br> `$image->imageable`                    |
| **One to Many Polymorphic**  | `morphMany()`      | Post & Video → Comment <br> `$post->comments`                   |
|                              | `morphTo()`        | Comment → Post / Video <br> `$comment->commentable`             |
| **Many to Many Polymorphic** | `morphToMany()`    | Post / Video → Tag <br> `$post->tags`                           |
|                              | `morphedByMany()`  | Tag → Post / Video <br> `$tag->posts`                           |



## 🔹 **Querying & Filtering Relasi**

| 🛠️ **Method**    | 📌 **Keterangan / Contoh**                                                                    |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `has()`           | Ambil yang punya child tertentu <br> `Post::has('comments')->get();`                          |
| `doesntHave()`    | Ambil yang tidak punya child <br> `Post::doesntHave('comments')->get();`                      |
| `whereHas()`      | Filter child dengan kondisi <br> `Post::whereHas('comments', fn($q)=>$q->approved)->get();`   |
| `whereRelation()` | Inline query parent-child <br> `Post::whereRelation('comments', 'is_approved', true)->get();` |



## 🔹 **Eager Loading**

| 🛠️ **Method**                     | 📌 **Keterangan / Contoh**                                       |
| ---------------------------------- | ---------------------------------------------------------------- |
| `with()`                           | Prevent N+1 queries <br> `Book::with('author.contacts')->get();` |
| `load()`                           | Lazy eager loading <br> `$post->load('comments');`               |
| `morphWith()` / `morphWithCount()` | Eager loading untuk polymorphic                                  |
| Automatic eager loading            | `Model::automaticallyEagerLoadRelationships();`                  |



## 🔹 **Aggregates (Count / Sum / Avg)**

| 🛠️ **Method**            | 📌 **Keterangan / Contoh**                                     |
| ------------------------- | ----------------------------------------------------------- |
| `withCount()`             | Hitung jumlah child <br> `Post::withCount('comments')->get();` |
| `withSum()`               | Total kolom numeric child                                      |
| `withAvg()`               | Rata-rata kolom numeric child                                  |
| `withMin()` / `withMax()` | Nilai minimum / maksimum child                                 |
| `loadCount()`             | Deferred loading hitung jumlah child                           |



## 🔹 **Menyimpan / Update Relasi**

| 🛠️ **Method**                                  | 📌 **Keterangan / Contoh**                                          |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| `save()`                                        | Simpan model anak <br> `$post->comments()->save(new Comment(...));` |
| `create()`                                      | Buat & simpan anak <br> `$post->comments()->create([...]);`         |
| `associate()` / `dissociate()`                  | Set parent untuk `belongsTo`                                        |
| `attach()` / `detach()` / `sync()` / `toggle()` | Many-to-many operations                                             |
| `updateExistingPivot()`                         | Update pivot table                                                  |

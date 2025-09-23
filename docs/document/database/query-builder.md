# 📚 Query Builder

## 🚀 Pendahuluan

Laravel Query Builder menyediakan antarmuka **fluent** untuk membangun dan menjalankan query database. Tidak perlu menulis SQL mentah, dan aman dari SQL injection. Cocok untuk:

* **Query sederhana:** mengambil data satu tabel.
* **Query kompleks:** join, subquery, aggregasi.
* **Batch processing:** chunking, update/delete massal.
* **Multiple database connections** dan **transactions**.

**Keunggulan:**

* Aman dari **SQL injection** melalui binding parameter otomatis.
* Mendukung **berbagai database** Laravel.
* Fluent & readable, mudah di-chain.
* Mendukung **transactions**, multiple connections, advanced queries.

> ⚠️ Catatan: PDO **tidak mendukung binding nama kolom**, jangan gunakan input user untuk kolom (`orderBy`, `groupBy`).



## ⚖️ Eloquent vs Query Builder

| Fitur                | Query Builder              | Eloquent                       |
| -------------------- | -------------------------- | ------------------------------ |
| Objek model          | stdClass                   | Model class instance           |
| Relasi               | Join / manual              | Relasi Eloquent (`hasMany`)    |
| Kecepatan            | Lebih cepat / ringan       | Sedikit lebih lambat           |
| Fluent API           | Ya                         | Ya, tapi lebih object-oriented |
| Custom SQL / Complex | Mudah untuk query kompleks | Bisa, tapi kadang verbose      |

> 🔹 Gunakan Query Builder untuk **query kompleks, aggregasi, batch processing**.

> 🔹 Gunakan Eloquent untuk **CRUD sederhana dan relasi antar tabel**.

**Contoh Query Complex (Query Builder):**

```php
$users = DB::table('users')
    ->join('orders', 'users.id', '=', 'orders.user_id')
    ->select('users.*', DB::raw('COUNT(orders.id) as total_orders'))
    ->groupBy('users.id')
    ->get();
```

**Output JSON:**

```json
[
  {"id":"uuid-1","name":"Alif","email":"alif@example.com","total_orders":3},
  {"id":"uuid-2","name":"Budi","email":"budi@example.com","total_orders":5}
]
```

**Method / chain terkait:** `join()`, `select()`, `groupBy()`, `get()`



## 📝 Query Dasar

### 1. Mengambil Semua Baris

**Kegunaan:** ambil semua data dari tabel `users`.

```php
$users = DB::table('users')->select('id','name')->get();
```

**Output JSON:**

```json
[
  {"id":"uuid-1","name":"Alif"},
  {"id":"uuid-2","name":"Budi"},
  {"id":"uuid-3","name":"Citra"}
]
```

**Method / chain terkait:** `select()`, `get()`, `orderBy()`, `limit()`, `offset()`



### 2. Mengambil Baris / Kolom Tunggal

**Kegunaan:** ambil satu record atau nilai kolom tunggal.

```php
$user = DB::table('users')->where('name','John')->first();
$email = DB::table('users')->where('name','John')->value('email');
```

**Output JSON:**

`first() → stdClass`:

```json
{"id":"uuid-3","name":"John","email":"john@example.com"}
```

`value() → scalar`:

```json
"john@example.com"
```

**Method / chain:** `first()`, `value()`, `find($id)`, `firstOrFail()`



### 3. Mengambil List Kolom (pluck)

**Kegunaan:** ambil satu kolom sebagai array/collection, bisa set key custom.

```php
$titles = DB::table('users')->pluck('title','name');
```

**Output JSON:**

```json
{"John":"Manager","Budi":"Staff","Citra":"Intern"}
```

**Method / chain:** `pluck(column,key)`



### 4. Chunking & Lazy Loading

**Kegunaan:** ambil data besar tanpa loading semua sekaligus.

```php
DB::table('users')->orderBy('id')->chunk(2, fn($users)=>print_r($users->toArray()));
DB::table('users')->orderBy('id')->lazy()->each(fn($user)=>print_r($user));
```

**Output JSON (chunk pertama 2 baris):**

```json
[
  {"id":"uuid-1","name":"Alif"},
  {"id":"uuid-2","name":"Budi"}
]
```

**Method / chain:** `chunk()`, `chunkById()`, `lazy()`, `each()`



## 🔍 Select Statements

### Select Custom

```php
$users = DB::table('users')->select('name','email as user_email')->get();
```

**Output JSON:**

```json
[
  {"name":"Alif","user_email":"alif@example.com"},
  {"name":"Budi","user_email":"budi@example.com"}
]
```

**Method / chain:** `select()`, `selectRaw()`, `addSelect()`



### Raw Expressions

```php
$users = DB::table('users')
    ->select(DB::raw('count(*) as total, status'))
    ->groupBy('status')
    ->get();
```

**Output JSON:**

```json
[
  {"status":"active","total":5},
  {"status":"inactive","total":2}
]
```

**Method / chain:** `selectRaw()`, `whereRaw()`, `havingRaw()`



### Conditional Clauses

```php
$users = DB::table('users')->when($active, fn($q)=>$q->where('status','active'))->get();
```

**Output JSON:** (jika `$active = true`)

```json
[
  {"id":"uuid-1","name":"Alif","status":"active"},
  {"id":"uuid-2","name":"Budi","status":"active"}
]
```

**Method / chain:** `when()`, `unless()`



## 📊 Aggregates

```php
$count = DB::table('users')->count();
$avg = DB::table('orders')->where('finalized',1)->avg('price');
```

**Output JSON:**

```json
{"count":7,"avg":150.5}
```

**Method / chain:** `count()`, `sum()`, `avg()`, `min()`, `max()`



## 🔗 Joins

### Inner Join

```php
$users = DB::table('users')
    ->join('contacts','users.id','=','contacts.user_id')
    ->get();
```

**Output JSON:**

```json
[
  {"id":"uuid-1","name":"Alif","phone":"081234567"},
  {"id":"uuid-2","name":"Budi","phone":"081987654"}
]
```

**Method / chain:** `join()`, `leftJoin()`, `rightJoin()`, `crossJoin()`, `joinSub()`



### Advanced Join / Subquery Join

```php
$latestPosts = DB::table('posts')
    ->select('user_id', DB::raw('MAX(created_at) as last_post'))
    ->groupBy('user_id');

$users = DB::table('users')
    ->joinSub($latestPosts,'latest_posts', fn($join)=>$join->on('users.id','=','latest_posts.user_id'))
    ->get();
```

**Output JSON:**

```json
[
  {"id":"uuid-1","name":"Alif","last_post":"2025-09-21 12:00:00"},
  {"id":"uuid-2","name":"Budi","last_post":"2025-09-20 15:30:00"}
]
```

**Method / chain:** `joinSub()`, `leftJoinSub()`



## ⚡ Advanced Where Clauses

### JSON Query

```php
$users = DB::table('users')->where('preferences->dining->meal','salad')->get();
```

**Output JSON:**

```json
[
  {"id":"uuid-1","name":"Alif","preferences":{"dining":{"meal":"salad"}}}
]
```

**Method / chain:** `where()`, `whereJsonContains()`, `whereJsonLength()`



### Full Text Search

```php
$users = DB::table('users')->whereFullText('bio','developer')->get();
```

**Output JSON:**

```json
[
  {"id":"uuid-1","name":"Alif","bio":"Full stack developer"}
]
```

**Method / chain:** `whereFullText()`



### Exists / Not Exists

```php
$users = DB::table('users')
    ->whereExists(fn($q)=>$q->select(DB::raw(1))
    ->from('orders')
    ->whereColumn('orders.user_id','users.id'))
    ->get();
```

**Output JSON:**

```json
[
  {"id":"uuid-1","name":"Alif"},
  {"id":"uuid-2","name":"Budi"}
]
```

**Method / chain:** `whereExists()`, `whereNotExists()`



### Subquery Where

```php
$incomes = Income::where('amount','<',fn($q)=>$q->selectRaw('avg(i.amount)')->from('incomes as i'))->get();
```

**Output JSON:**

```json
[
  {"id":"inc-1","amount":120},
  {"id":"inc-2","amount":140}
]
```

**Method / chain:** `where()`, `whereColumn()`, `whereRaw()`



### Union Queries

```php
$first = DB::table('users')->select('name');
$second = DB::table('admins')->select('name');
$users = $first->union($second)->get();
```

**Output JSON:**

```json
[
  {"name":"Alif"},
  {"name":"Budi"},
  {"name":"Citra"},
  {"name":"Admin1"},
  {"name":"Admin2"}
]
```

**Method / chain:** `union()`, `unionAll()`



## 🔄 Modifikasi Data

```php
DB::table('users')->updateOrInsert(['email'=>'john@example.com'],['votes'=>5]);
DB::table('users')->increment('votes',2);
DB::table('users')->delete();
```

**Hasil:** record diperbarui, dibuat, atau dihapus.
**Method / chain:** `insert()`, `insertGetId()`, `update()`, `updateOrInsert()`, `increment()`, `decrement()`, `delete()`



## 🗂 Transactions

```php
DB::transaction(fn() => [
    DB::table('users')->update(['votes'=>100]),
    DB::table('logs')->insert(['action'=>'update_votes'])
]);
```

**Hasil:** semua query sukses → commit, jika gagal → rollback.
**Method / chain:** `DB::transaction()`, `DB::beginTransaction()`, `DB::commit()`, `DB::rollBack()`



## 🌐 Multiple Connections

```php
$users = DB::connection('mysql2')->table('users')->get();
```

**Output JSON:**

```json
[
  {"id":"uuid-101","name":"Eka"},
  {"id":"uuid-102","name":"Fajar"}
]
```

**Method / chain:** `DB::connection(name)`



## 🛠 Debugging

```php
DB::table('users')->where('votes','>',100)->dd();
DB::table('users')->where('votes','>',100)->dumpRawSql();
```

**Hasil:** tampilkan query & hasil sebelum dieksekusi.
**Method / chain:** `dd()`, `dump()`, `dumpRawSql()`



## 🔧 Tips & Best Practices

### 1. **Gunakan binding parameter untuk input user**

**Apa itu:**
Binding parameter adalah cara Laravel Query Builder menempatkan nilai input user ke query tanpa menyisipkan langsung ke SQL, sehingga mencegah **SQL injection**.

**Kenapa penting:**
Kalau kamu langsung memasukkan input user ke query, hacker bisa menyisipkan SQL berbahaya.

**Contoh aman:**

```php
$name = request('name'); // input user
$user = DB::table('users')->where('name', $name)->first();
```

**Query yang dijalankan di database (pseudo):**

```sql
SELECT * FROM users WHERE name = ?
```

Laravel akan mengganti `?` dengan `$name` dengan aman.

**Jangan lakukan ini (berbahaya!):**

```php
$user = DB::table('users')->whereRaw("name = '$name'")->first();
```

Jika `$name = "John' OR 1=1 --"`, hacker bisa mengambil semua data.

---

### 2. **Query Builder untuk query kompleks, Eloquent untuk CRUD model biasa**

**Apa itu:**

* **Query Builder** → bagus untuk query kompleks, join, aggregasi, batch update/delete.
* **Eloquent** → bagus untuk operasi CRUD biasa dan relasi antar tabel, karena lebih readable dan object-oriented.

**Contoh Query Builder (complex):**

```php
$users = DB::table('users')
    ->join('orders', 'users.id', '=', 'orders.user_id')
    ->select('users.*', DB::raw('COUNT(orders.id) as total_orders'))
    ->groupBy('users.id')
    ->get();
```

**Contoh Eloquent (CRUD sederhana):**

```php
$user = User::find(1);
$user->name = 'Alif';
$user->save();
```

---

### 3. **Gunakan transactions untuk update multi-tabel**

**Apa itu:**
Transaction memastikan **semua query berhasil atau rollback semua** jika ada error.

**Kenapa penting:**
Kalau kamu update beberapa tabel sekaligus, gagal satu query bisa bikin data inconsistent.

**Contoh:**

```php
DB::transaction(function() {
    DB::table('users')->update(['votes' => 100]);
    DB::table('logs')->insert(['action' => 'update_votes']);
});
```

Kalau update `users` sukses tapi insert `logs` gagal → **rollback otomatis**, jadi `users` tetap tidak berubah.

---

### 4. **Hindari dynamic column names dari input user**

**Apa itu:**
Dynamic column name = nama kolom ditentukan oleh input user.

**Kenapa berbahaya:**
PDO tidak mendukung binding nama kolom → bisa menyebabkan SQL injection.

**Contoh berbahaya:**

```php
$orderBy = request('sort_column'); // input user
$users = DB::table('users')->orderBy($orderBy)->get(); // bisa berbahaya
```

**Alternatif aman:**
Gunakan whitelist:

```php
$allowed = ['name','email','created_at'];
$column = in_array(request('sort_column'), $allowed) ? request('sort_column') : 'name';
$users = DB::table('users')->orderBy($column)->get();
```

---

### 5. **Gunakan chunking/lazy loading untuk dataset besar**

**Apa itu:**
Jika tabel punya ribuan atau jutaan baris, ambil sekaligus bisa memakan memori. Chunking/method lazy loading membagi query jadi batch kecil.

**Contoh chunk:**

```php
DB::table('users')->orderBy('id')->chunk(100, function($users){
    foreach ($users as $user) {
        // proses batch 100 row
    }
});
```

**Contoh lazy:**

```php
DB::table('users')->orderBy('id')->lazy()->each(function($user){
    // proses baris per baris
});
```

**Keuntungan:**

* Hemat memori.
* Bisa proses jutaan data tanpa crash.

---

### 6. **Gunakan multiple connections bila perlu**

**Apa itu:**
Laravel bisa connect ke lebih dari satu database, misal `mysql` utama dan `mysql2` untuk reporting.

**Contoh:**

```php
$users = DB::connection('mysql2')->table('users')->get();
```

**Keuntungan:**

* Bisa query database berbeda di satu aplikasi.
* Memisahkan read/write atau reporting dari transaksi utama.

---



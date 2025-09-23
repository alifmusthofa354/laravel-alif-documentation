# ⚡ Eloquent: Factories

## 📖 Pendahuluan
Ketika melakukan pengujian aplikasi atau seeding database, kita sering membutuhkan data dummy. Daripada harus mengetik manual setiap kolom tabel, Laravel menyediakan Model Factories yang memudahkan kita membuat data secara otomatis dengan nilai default.

Contoh UserFactory sudah tersedia di semua project Laravel baru dan dapat ditemukan pada:

database/factories/UserFactory.php


### 🔍 Contoh UserFactory
```php
namespace Database\Factories;
 
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
```

➡️ Dari contoh di atas, definition() mendefinisikan atribut default. Laravel juga menggunakan Faker untuk membuat data random.

---

## 🏗️ Membuat Factory
Untuk membuat factory baru gunakan Artisan command:
```bash
php artisan make:factory PostFactory
```

Factory baru akan dibuat di folder database/factories.

---

## 📌 Konvensi Model & Factory
Setiap model yang menggunakan trait HasFactory dapat memanggil method factory(). Laravel otomatis mencari factory dengan nama model + Factory.

Jika ingin mengubah mapping, kita bisa override method newFactory:
```php
use Database\Factories\Administration\FlightFactory;

protected static function newFactory()
{
    return FlightFactory::new();
}
```

Di dalam factory, kita bisa tentukan model terkait:
```php
use App\Administration\Flight;

class FlightFactory extends Factory
{
    protected $model = Flight::class;
}
```

---

## 🎭 Factory States
State memungkinkan kita membuat variasi data. Misalnya membuat state suspended:
```php
public function suspended(): Factory
{
    return $this->state(fn (array $attributes) => [
        'account_status' => 'suspended',
    ]);
}
```

### 🗑️ State trashed
Untuk model yang menggunakan Soft Delete, kita bisa langsung gunakan:
```php
$user = User::factory()->trashed()->create();
```

---

## 🔄 Factory Callbacks
Kita bisa menambahkan aksi tambahan setelah membuat data dengan afterMaking dan afterCreating.

```php
class UserFactory extends Factory
{
    public function configure(): static
    {
        return $this->afterMaking(function (User $user) {
            // aksi setelah membuat tapi belum disimpan
        })->afterCreating(function (User $user) {
            // aksi setelah membuat & disimpan
        });
    }
}
```

Callback juga bisa ditaruh di dalam state.

---

## 🛠️ Membuat Model dengan Factory
### 1️⃣ Membuat Tanpa Menyimpan (make)
```php
$user = User::factory()->make();
$users = User::factory()->count(3)->make();
```

### 2️⃣ Menambahkan State
```php
$users = User::factory()->count(5)->suspended()->make();
```

### 3️⃣ Override Atribut
```php
$user = User::factory()->make([
    'name' => 'Abigail Otwell',
]);
```

### 4️⃣ Menyimpan ke Database (create)
```php
$user = User::factory()->create();
$users = User::factory()->count(3)->create();
```

---

## 🔁 Sequences
Sequence digunakan untuk membuat pola bergantian:
```php
$users = User::factory()
    ->count(10)
    ->state(new Sequence(
        ['admin' => 'Y'],
        ['admin' => 'N'],
    ))
    ->create();
```

➡️ Hasil: 5 user admin=Y dan 5 user admin=N.

Kita juga bisa menggunakan closure agar lebih dinamis:
```php
->state(new Sequence(
    fn (Sequence $sequence) => ['name' => 'User '.$sequence->index],
))
```

---

## 🔗 Factory Relationships
### 🔹 Has Many
```php
$user = User::factory()
    ->has(Post::factory()->count(3))
    ->create();
```

Atau dengan magic method:
```php
$user = User::factory()->hasPosts(3)->create();
```

### 🔹 Belongs To
```php
$posts = Post::factory()
    ->count(3)
    ->for(User::factory()->state(['name' => 'Jessica Archer']))
    ->create();
```

Atau:
```php
$posts = Post::factory()->count(3)->forUser(['name' => 'Jessica Archer'])->create();
```

### 🔹 Many to Many
```php
$user = User::factory()
    ->hasAttached(Role::factory()->count(3), ['active' => true])
    ->create();
```

### 🔹 Polymorphic
```php
$post = Post::factory()->hasComments(3)->create();
```

Untuk morphTo relationship:
```php
$comments = Comment::factory()->count(3)->for(
    Post::factory(), 'commentable'
)->create();
```

---

## 🏗️ Definisi Relasi di Dalam Factory
Kita bisa langsung definisikan relasi di definition():
```php
public function definition(): array
{
    return [
        'user_id' => User::factory(),
        'title' => fake()->title(),
        'content' => fake()->paragraph(),
    ];
}
```

Jika butuh data tergantung atribut lain:
```php
'user_type' => function (array $attributes) {
    return User::find($attributes['user_id'])->type;
},
```

---

## 🔄 Recycle Model yang Sama
Jika beberapa relasi butuh model yang sama, gunakan recycle():
```php
Ticket::factory()
    ->recycle(Airline::factory()->create())
    ->create();
```

Atau dengan collection:
```php
Ticket::factory()
    ->recycle($airlines)
    ->create();
```

---

## 🎯 Kesimpulan
- Factory memudahkan testing & seeding data.
- Bisa gunakan state, sequence, dan relasi untuk membuat data lebih realistis.
- Mendukung berbagai jenis relationship (hasMany, belongsTo, manyToMany, polymorphic).
- recycle() berguna untuk menghemat resource ketika menggunakan relasi yang sama.

🚀 Dengan memahami Factory, workflow development & testing menjadi lebih cepat, fleksibel, dan rapi.
# 🏠 Laravel Homestead

Laravel Homestead adalah box Vagrant yang sudah dikonfigurasi sebelumnya yang menyediakan lingkungan pengembangan Laravel yang indah. Jika Anda tidak familiar dengan Vagrant, lihat dokumentasi resmi Vagrant untuk meninjau semua keunggulan.

Homestead menyertakan perangkat lunak dan layanan berikut:
- Ubuntu 20.04
- Git
- PHP 8.1
- PHP 8.2
- PHP 8.3
- Nginx
- MySQL 8.0
- MariaDB 10.3
- PostgreSQL 15
- Redis
- Memcached
- Beanstalkd
- Mailpit
- SQLite
- Apache (opsional)
- Docker
- Elasticsearch
- MongoDB
- Neo4j
- MinIO

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [Properti Konfigurasi](#properti-konfigurasi)
5. [Menjalankan Homestead](#menjalankan-homestead)
6. [Menginstal Fitur Tambahan](#menginstal-fitur-tambahan)
7. [Antarmuka Pengguna](#antarmuka-pengguna)
8. [Port](#port)
9. [Sharing Environment](#sharing-environment)
10. [Database](#database)
11. [Mail](#mail)
12. [Filesystem](#filesystem)

## 🎯 Pendahuluan

Laravel Homestead adalah box Vagrant yang menyediakan lingkungan pengembangan Laravel yang sudah dikonfigurasi sebelumnya. Homestead menghilangkan kebutuhan untuk menginstal PHP, web server, dan server database lainnya di mesin lokal Anda.

### ✨ Fitur Utama
- Lingkungan pengembangan yang konsisten
- Mudah dikonfigurasi
- Dukungan untuk multiple project
- Database yang sudah terinstal
- Mail testing dengan Mailpit
- Redis dan caching
- Queue workers
- File sharing otomatis

### ⚠️ Prasyarat
Sebelum menggunakan Homestead, Anda perlu menginstal:
- VirtualBox 6.1.44, 7.0.8 atau lebih tinggi, atau Parallels v18.0.0 atau lebih tinggi
- Vagrant 2.2.9 atau lebih tinggi

## 📦 Instalasi

### 🎯 Menginstal VirtualBox/Parallels + Vagrant
1. Instal [VirtualBox](https://www.virtualbox.org/wiki/Downloads) atau [Parallels](https://www.parallels.com/products/desktop/)
2. Instal [Vagrant](https://developer.hashicorp.com/vagrant/downloads)

### 🛠️ Menginstal Homestead
Anda dapat menginstal Homestead dengan mengkloning repositori secara global:

```bash
git clone https://github.com/laravel/homestead.git ~/Homestead
cd ~/Homestead
git checkout release
```

Karena Homestead box akan sangat besar setelah diinstal, Anda mungkin ingin mengkloning ke direktori "home" Anda agar file Homestead tetap tetap di tempat yang sama selamanya. Anda juga akan membuat file `Homestead.yaml` dengan perintah `init.sh`:

```bash
# Mac / Linux...
bash init.sh

# Windows...
init.bat
```

### 🔧 Menginstal Box Vagrant
Setelah mengedit file `Homestead.yaml` sesuai kebutuhan Anda, jalankan perintah berikut dari direktori Homestead:

```bash
vagrant box add laravel/homestead
```

Jika perintah ini gagal, pastikan Vagrant Anda sudah diperbarui ke versi terbaru.

### 🔄 Menginstal Homestead Secara Global
Setelah menginstal Homestead, pastikan untuk menambahkan direktori `vendor/bin` ke PATH Anda sehingga file `homestead` dapat dieksekusi secara sistem-wide:

```bash
composer global require laravel/valet
```

Setelah instalasi, Anda perlu memastikan direktori `~/.composer/vendor/bin` ada di PATH Anda.

## ⚙️ Konfigurasi

### 📄 File Homestead.yaml
Setelah mengkloning repositori Homestead, jalankan perintah `bash init.sh` (Mac / Linux) atau `init.bat` (Windows) untuk membuat file konfigurasi `Homestead.yaml`:

```bash
# Mac / Linux...
bash init.sh

# Windows...
init.bat
```

File konfigurasi akan ditempatkan di direktori Homestead Anda.

### 📋 Contoh Konfigurasi Dasar
```yaml
---
ip: "192.168.56.56"
memory: 2048
cpus: 2
provider: virtualbox

authorize: ~/.ssh/id_rsa.pub

keys:
    - ~/.ssh/id_rsa

folders:
    - map: ~/code
      to: /home/vagrant/code

sites:
    - map: homestead.test
      to: /home/vagrant/code/Laravel/public

databases:
    - homestead

features:
    - mysql: true
    - mariadb: false
    - postgresql: false
    - redis: false
    - memcached: false
    - meilisearch: false
    - minio: false
    - mongo: false
    - selenium: false
    - mailpit: false

services:
    - enabled:
        - "mysql"
    - disabled:
        - "postgresql@15-main"
```

### 📁 Mapping Folders
Properti `folders` dari file `Homestead.yaml` mendaftarkan semua folder yang ingin Anda share dengan Homestead:

```yaml
folders:
    - map: ~/code
      to: /home/vagrant/code
```

Untuk mengaktifkan [NFS](https://www.vagrantup.com/docs/synced-folders/nfs.html), cukup tambahkan opsi ke sinkronisasi folder Anda:

```yaml
folders:
    - map: ~/code
      to: /home/vagrant/code
      type: "nfs"
```

### 🌐 Mapping Sites
Properti `sites` memungkinkan Anda memetakan domain ke folder tertentu:

```yaml
sites:
    - map: homestead.test
      to: /home/vagrant/code/Laravel/public
    - map: another.test
      to: /home/vagrant/code/Another/public
```

## 🎯 Properti Konfigurasi

### 🖥️ Konfigurasi Dasar
```yaml
---
ip: "192.168.56.56"
memory: 2048
cpus: 2
provider: virtualbox
```

### 🔐 SSH Key
```yaml
authorize: ~/.ssh/id_rsa.pub

keys:
    - ~/.ssh/id_rsa
```

### 📁 Folders
```yaml
folders:
    - map: ~/code/project1
      to: /home/vagrant/project1
    - map: ~/code/project2
      to: /home/vagrant/project2
```

### 🌐 Sites
```yaml
sites:
    - map: project1.test
      to: /home/vagrant/project1/public
    - map: project2.test
      to: /home/vagrant/project2/public
```

### 🗃️ Databases
```yaml
databases:
    - homestead
    - project1
    - project2
```

## ▶️ Menjalankan Homestead

### 🚀 Menjalankan Vagrant Box
Setelah mengedit file `Homestead.yaml` sesuai kebutuhan Anda, jalankan box Vagrant dari direktori Homestead Anda:

```bash
vagrant up
```

Vagrant akan mem-boot mesin virtual dan secara otomatis mengkonfigurasi folder dan situs Anda.

### 🛑 Menghentikan Mesin
Untuk menghentikan mesin virtual, Anda dapat menggunakan perintah berikut dari direktori Homestead Anda:

```bash
vagrant halt
```

### 🔄 Menghancurkan Mesin
Jika ingin menghancurkan mesin sepenuhnya:

```bash
vagrant destroy
```

### 📡 SSH ke Mesin
Anda juga dapat menggunakan perintah `vagrant ssh` untuk SSH ke mesin virtual:

```bash
vagrant ssh
```

## 🛠️ Menginstal Fitur Tambahan

### 📋 Mengaktifkan Fitur
Anda dapat mengaktifkan berbagai fitur tambahan dalam file `Homestead.yaml` Anda:

```yaml
features:
    - mysql: true
    - mariadb: true
    - postgresql: true
    - redis: true
    - memcached: true
    - meilisearch: true
    - minio: true
    - mongo: true
    - selenium: true
    - mailpit: true
```

### 🔄 Menginstal Docker
Untuk menginstal Docker, tambahkan ke fitur Anda:

```yaml
features:
    - docker: true
```

Setelah mengaktifkan Docker, Anda dapat menggunakan perintah Docker seperti:

```bash
docker run -it ubuntu:latest
```

## 🎨 Antarmuka Pengguna

### 🖥️ Menggunakan Apache
Secara default, Homestead menggunakan Nginx. Jika Anda ingin menggunakan Apache, Anda dapat menambahkan opsi `type` ke situs Anda:

```yaml
sites:
    - map: homestead.test
      to: /home/vagrant/code/Laravel/public
      type: "apache"
```

### 📊 Menggunakan Elasticsearch
Untuk mengaktifkan Elasticsearch, tambahkan ke fitur Anda:

```yaml
features:
    - elasticsearch: 8.9.0
```

## 🔌 Port

### 📋 Port yang Diexpose
Berikut port yang diexpose oleh Homestead:

```yaml
ports:
    - send: 33060
      to: 3306
    - send: 54320
      to: 5432
    - send: 8025
      to: 8025
    - send: 9200
      to: 9200
    - send: 27017
      to: 27017
```

### 🔄 Forwarding Port Tambahan
Anda dapat memforward port tambahan ke Vagrant box:

```yaml
ports:
    - send: 50000
      to: 5000
    - send: 7777
      to: 777
      protocol: udp
```

## 🌐 Sharing Environment

### 📋 Menggunakan ngrok
Homestead menyertakan dukungan untuk ngrok, yang memungkinkan Anda membagikan lingkungan pengembangan Anda dengan dunia:

```bash
vagrant share
```

### 🔄 Menggunakan Expose
Alternatif lain adalah menggunakan [Expose](https://expose.dev/) dari Beyond Code:

```bash
expose share homestead.test
```

## 🗃️ Database

### 📋 MySQL
MySQL sudah dikonfigurasi dengan database default bernama `homestead`. Anda dapat mengakses database ini dengan kredensial berikut:

- Host: 127.0.0.1
- Port: 33060
- Database: homestead
- Username: homestead
- Password: secret

### 📋 PostgreSQL
PostgreSQL sudah dikonfigurasi dengan database default bernama `homestead`. Anda dapat mengakses database ini dengan kredensial berikut:

- Host: 127.0.0.1
- Port: 54320
- Database: homestead
- Username: homestead
- Password: secret

### 📋 Menginstal MariaDB
Untuk menginstal MariaDB, tambahkan ke fitur Anda:

```yaml
features:
    - mariadb: true
```

## 📧 Mail

### 📋 Mailpit
Homestead menyertakan Mailpit, layanan pengujian email yang menangkap email yang dikirim oleh aplikasi Anda dan menyediakan antarmuka web yang nyaman untuk melihat email tersebut:

```yaml
features:
    - mailpit: true
```

Anda dapat mengakses antarmuka Mailpit di: `http://homestead.test:8025`

## 📁 Filesystem

### 📋 Mounting External Drives
Di Windows, Anda mungkin perlu mengaktifkan symlink untuk Vagrant dengan menambahkan opsi berikut ke file `Vagrantfile` Anda:

```ruby
config.vm.provider "virtualbox" do |v|
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant", "1"]
end
```

### 📋 File Synchronization
Homestead secara otomatis menyinkronkan file antara mesin host Anda dan mesin virtual, memungkinkan Anda mengedit file pada mesin host Anda dan menjalankan aplikasi Laravel pada mesin virtual.

## 🧠 Kesimpulan

Laravel Homestead menyediakan lingkungan pengembangan yang konsisten dan kuat untuk aplikasi Laravel Anda. Dengan Homestead, Anda dapat memastikan bahwa lingkungan pengembangan Anda identik dengan lingkungan produksi.

### 🔑 Keuntungan Utama
- Lingkungan pengembangan yang konsisten
- Semua dependensi yang diperlukan sudah terinstal
- Mudah dikonfigurasi melalui file YAML
- Dukungan untuk multiple project
- Database yang sudah dikonfigurasi
- Mail testing dengan Mailpit
- Integrasi dengan Vagrant
- Dukungan untuk berbagai provider (VirtualBox, Parallels)

### 🚀 Best Practices
1. Gunakan Homestead untuk lingkungan pengembangan lokal
2. Konfigurasi folder mapping dengan benar
3. Gunakan domain yang konsisten untuk situs Anda
4. Aktifkan fitur yang Anda butuhkan saja
5. Gunakan Mailpit untuk pengujian email
6. Simpan file konfigurasi dalam version control
7. Gunakan NFS untuk performa file sharing yang lebih baik
8. Backup database secara teratur

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Homestead untuk lingkungan pengembangan Laravel Anda.
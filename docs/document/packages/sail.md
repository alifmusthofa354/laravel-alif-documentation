# ⛵ Laravel Sail

Laravel Sail adalah antarmuka command-line ringan untuk berinteraksi dengan lingkungan pengembangan Docker default Laravel. Sail menyediakan cara yang hebat untuk memulai dengan Laravel tanpa memerlukan pra-pengalaman Docker.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [Menjalankan Sail](#menjalankan-sail)
5. [Services yang Tersedia](#services-yang-tersedia)
6. [Menggunakan Sail](#menggunakan-sail)
7. [Docker Desktop Integration](#docker-desktop-integration)
8. [Customizing Sail](#customizing-sail)
9. [Sharing Your Site](#sharing-your-site)
10. [Debugging](#debugging)
11. [Production Considerations](#production-considerations)

## 🎯 Pendahuluan

Laravel Sail adalah antarmuka command-line ringan yang menyediakan titik awal yang hebat untuk membangun aplikasi Laravel menggunakan PHP, MySQL, dan Redis tanpa memerlukan pengalaman Docker sebelumnya.

### ✨ Fitur Utama
- Lingkungan pengembangan Docker yang dikonfigurasi sebelumnya
- Integrasi langsung dengan Artisan commands
- Services yang umum digunakan (MySQL, Redis, Mailpit, dll)
- Dukungan untuk multiple PHP versions
- Easy sharing site dengan internet
- Docker Desktop integration
- Customizable service configuration

### ⚠️ Catatan Penting
Sail memerlukan Docker untuk berfungsi. Pastikan Docker telah terinstal dan berjalan di sistem Anda sebelum menggunakan Sail.

## 📦 Instalasi

### 🎯 Prasyarat
Sebelum menginstal Sail, Anda perlu menginstal:
- Docker Engine
- Docker Compose

### 🛠️ Menginstal Docker
Untuk macOS:
1. Unduh [Docker Desktop untuk Mac](https://www.docker.com/products/docker-desktop)
2. Ikuti petunjuk instalasi

Untuk Windows:
1. Unduh [Docker Desktop untuk Windows](https://www.docker.com/products/docker-desktop)
2. Ikuti petunjuk instalasi

Untuk Linux:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose

# CentOS/RHEL
sudo yum install docker docker-compose
```

### 🎯 Menginstal Sail dalam Project Baru
Untuk membuat project Laravel baru dengan Sail:

```bash
curl -s "https://laravel.build/example-app" | bash
```

Atau menggunakan Composer:

```bash
composer create-project laravel/laravel example-app
cd example-app
php artisan sail:install
```

### 🎯 Menginstal Sail dalam Project yang Sudah Ada
Dalam project Laravel yang sudah ada:

```bash
composer require laravel/sail --dev
php artisan sail:install
```

## ⚙️ Konfigurasi

### 📄 File docker-compose.yml
File konfigurasi utama terletak di root direktori project Anda. File ini mendefinisikan service-service Docker yang akan digunakan oleh aplikasi Anda.

### 📋 Konfigurasi Dasar
```yaml
version: '3'
services:
    laravel.test:
        build:
            context: ./vendor/laravel/sail/runtimes/8.2
            dockerfile: Dockerfile
            args:
                WWWGROUP: '${WWWGROUP}'
        image: sail-8.2/app
        extra_hosts:
            - 'host.docker.internal:host-gateway'
        ports:
            - '${APP_PORT:-80}:80'
            - '${VITE_PORT:-5173}:${VITE_PORT:-5173}'
        environment:
            WWWUSER: '${WWWUSER}'
            LARAVEL_SAIL: 1
            XDEBUG_MODE: '${SAIL_XDEBUG_MODE:-off}'
            XDEBUG_CONFIG: '${SAIL_XDEBUG_CONFIG:-client_host=host.docker.internal}'
        volumes:
            - '.:/var/www/html'
        networks:
            - sail
        depends_on:
            - mysql
            - redis
            - meilisearch
            - mailpit
            - selenium
```

### 🔐 Konfigurasi Environment
File `.env` Anda akan diperbarui dengan konfigurasi yang sesuai:

```env
APP_PORT=80
DB_PORT=3306
REDIS_PORT=6379
MEILISEARCH_PORT=7700
MAILPIT_PORT=8025
```

### 📋 Memilih Services
Selama instalasi Sail, Anda akan diminta untuk memilih services yang ingin digunakan:

```bash
Which services would you like to install? [mysql]:
  [0] mysql
  [1] pgsql
  [2] mariadb
  [3] redis
  [4] memcached
  [5] meilisearch
  [6] minio
  [7] mailpit
  [8] selenium
 > 0,3,7
```

## ▶️ Menjalankan Sail

### 🚀 Menjalankan Sail untuk Pertama Kali
Untuk memulai Sail, jalankan perintah berikut dari root direktori project Anda:

```bash
./vendor/bin/sail up
```

Atau jika Anda menggunakan alias:

```bash
sail up
```

### 📋 Alias untuk Sail
Untuk kenyamanan, Anda dapat membuat alias untuk Sail:

```bash
alias sail='[ -f sail ] && sh sail || sh vendor/bin/sail'
```

Tambahkan ke file `~/.bashrc` atau `~/.zshrc` Anda:

```bash
echo "alias sail='[ -f sail ] && sh sail || sh vendor/bin/sail'" >> ~/.bashrc
source ~/.bashrc
```

### 📋 Menjalankan di Background
Untuk menjalankan Sail di background:

```bash
sail up -d
```

### 📋 Menghentikan Sail
Untuk menghentikan Sail:

```bash
sail down
```

### 📋 Menjalankan Perintah dalam Container
Untuk menjalankan perintah dalam container:

```bash
sail artisan migrate
sail composer install
sail npm install
sail phpunit
```

## 🛠️ Services yang Tersedia

### 📋 MySQL
Database relasional yang populer:

```yaml
mysql:
    image: 'mysql/mysql-server:8.0'
    ports:
        - '${FORWARD_DB_PORT:-3306}:3306'
    environment:
        MYSQL_ROOT_PASSWORD: '${DB_PASSWORD}'
        MYSQL_ROOT_HOST: "%"
        MYSQL_DATABASE: '${DB_DATABASE}'
        MYSQL_USER: '${DB_USERNAME}'
        MYSQL_PASSWORD: '${DB_PASSWORD}'
        MYSQL_ALLOW_EMPTY_PASSWORD: 1
    volumes:
        - 'sail-mysql:/var/lib/mysql'
        - './vendor/laravel/sail/database/mysql/create-testing-database.sh:/docker-entrypoint-initdb.d/10-create-testing-database.sh'
    networks:
        - sail
    healthcheck:
        test: ["CMD", "mysqladmin", "ping", "-p${DB_PASSWORD}"]
        retries: 3
        timeout: 5s
```

### 📋 Redis
In-memory data structure store:

```yaml
redis:
    image: 'redis:alpine'
    ports:
        - '${FORWARD_REDIS_PORT:-6379}:6379'
    volumes:
        - 'sail-redis:/data'
    networks:
        - sail
    healthcheck:
        test: ["CMD", "redis-cli", "ping"]
        retries: 3
        timeout: 5s
```

### 📋 Mailpit
SMTP server dan mail testing tool:

```yaml
mailpit:
    image: 'axllent/mailpit:latest'
    ports:
        - '${FORWARD_MAILPIT_PORT:-1025}:1025'
        - '${FORWARD_MAILPIT_DASHBOARD_PORT:-8025}:8025'
    networks:
        - sail
```

### 📋 Meilisearch
Mesin pencarian open-source:

```yaml
meilisearch:
    image: 'getmeili/meilisearch:latest'
    ports:
        - '${FORWARD_MEILISEARCH_PORT:-7700}:7700'
    volumes:
        - 'sail-meilisearch:/meili_data'
    networks:
        - sail
    healthcheck:
        test: ["CMD", "wget", "--no-verbose", "--spider",  "http://localhost:7700/health"]
        retries: 3
        timeout: 5s
```

### 📋 Selenium
Browser automation tool:

```yaml
selenium:
    image: 'selenium/standalone-chrome'
    extra_hosts:
        - 'host.docker.internal:host-gateway'
    volumes:
        - '/dev/shm:/dev/shm'
    networks:
        - sail
```

## 🎯 Menggunakan Sail

### 📋 Artisan Commands
Menjalankan Artisan commands melalui Sail:

```bash
sail artisan migrate
sail artisan db:seed
sail artisan make:model Post
sail artisan make:controller PostController
sail artisan tinker
```

### 📋 Composer Commands
Menggunakan Composer melalui Sail:

```bash
sail composer require laravel/breeze
sail composer update
sail composer dump-autoload
```

### 📋 NPM Commands
Menggunakan NPM melalui Sail:

```bash
sail npm install
sail npm run dev
sail npm run build
sail npm run watch
```

### 📋 PHPUnit Testing
Menjalankan PHPUnit tests:

```bash
sail test
sail phpunit
sail phpunit --filter=SomeTest
```

### 📋 Dusk Testing
Menjalankan Dusk browser tests:

```bash
sail dusk
sail dusk:fails
```

### 📋 Database Management
Mengelola database melalui Sail:

```bash
# Menjalankan MySQL client
sail mysql

# Menjalankan database dump
sail artisan migrate:fresh --seed

# Menjalankan database backup
sail artisan backup:run
```

### 📋 Redis Management
Mengelola Redis melalui Sail:

```bash
# Menjalankan Redis client
sail redis

# Membersihkan cache Redis
sail artisan cache:clear
sail artisan config:clear
```

## 🖥️ Docker Desktop Integration

### 📋 Melihat Containers
Anda dapat melihat containers yang berjalan melalui Docker Desktop:

1. Buka Docker Desktop
2. Klik tab "Containers"
3. Lihat containers Sail Anda

### 📋 Melihat Logs
Melihat logs melalui Docker Desktop:

1. Pilih container dalam Docker Desktop
2. Klik tab "Logs"
3. Lihat output logs real-time

### 📋 Mengelola Volumes
Mengelola Docker volumes:

```bash
# Melihat volumes
docker volume ls

# Menghapus volume
docker volume rm sail_mysql
```

### 📋 Mengelola Networks
Mengelola Docker networks:

```bash
# Melihat networks
docker network ls

# Menghapus network
docker network rm sail
```

## 🎨 Customizing Sail

### 📋 Menambahkan Service Baru
Untuk menambahkan service baru, edit file `docker-compose.yml`:

```yaml
# Menambahkan MongoDB
mongodb:
    image: 'mongo:5.0'
    ports:
        - '${FORWARD_MONGODB_PORT:-27017}:27017'
    environment:
        MONGO_INITDB_ROOT_USERNAME: '${DB_USERNAME}'
        MONGO_INITDB_ROOT_PASSWORD: '${DB_PASSWORD}'
    volumes:
        - 'sail-mongodb:/data/db'
    networks:
        - sail
```

### 📋 Mengganti PHP Version
Untuk menggunakan PHP version yang berbeda:

1. Edit file `docker-compose.yml`
2. Ubah `runtime` dari `8.2` ke versi yang diinginkan:

```yaml
laravel.test:
    build:
        context: ./vendor/laravel/sail/runtimes/8.1
        dockerfile: Dockerfile
        args:
            WWWGROUP: '${WWWGROUP}'
    image: sail-8.1/app
```

### 📋 Mengkustomisasi Dockerfile
Anda dapat mengkustomisasi Dockerfile dengan membuat file `docker/8.2/Dockerfile`:

```dockerfile
FROM ubuntu:22.04

# Install PHP dan extensions
RUN apt-get update && apt-get install -y \
    php8.2 \
    php8.2-cli \
    php8.2-fpm \
    php8.2-mysql \
    php8.2-redis \
    php8.2-mbstring \
    php8.2-xml \
    php8.2-curl \
    php8.2-zip \
    php8.2-bcmath \
    php8.2-gd \
    php8.2-soap \
    php8.2-intl \
    php8.2-xdebug

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy existing application directory contents
COPY . /var/www/html

# Install dependencies
RUN composer install --optimize-autoloader --no-dev

# Expose port 80 and start php-fpm server
EXPOSE 80
CMD ["php-fpm"]
```

### 📋 Environment Variables
Menambahkan environment variables kustom:

```env
# File .env
CUSTOM_VARIABLE=value
API_KEY=your-api-key
```

Menggunakan dalam `docker-compose.yml`:

```yaml
environment:
    CUSTOM_VARIABLE: '${CUSTOM_VARIABLE}'
    API_KEY: '${API_KEY}'
```

## 🌐 Sharing Your Site

### 📋 Menggunakan Expose
Untuk membagikan situs Anda dengan internet menggunakan Expose:

```bash
# Menginstal Expose
composer global require beyondcode/expose

# Membagi situs Anda
expose share http://localhost
```

### 📋 Menggunakan Ngrok
Untuk membagikan situs Anda menggunakan Ngrok:

```bash
# Menginstal Ngrok
brew install ngrok/ngrok/ngrok

# Membagi situs Anda
ngrok http 80
```

### 📋 Menggunakan Laravel Valet Sharing
Jika menggunakan Laravel Valet:

```bash
# Membagi situs Anda
valet share
```

### 📋 Konfigurasi Sharing
Menambahkan konfigurasi untuk sharing:

```env
# File .env
APP_URL=http://localhost
ASSET_URL=http://localhost
```

## 🐛 Debugging

### 📋 Melihat Logs
Melihat logs aplikasi:

```bash
# Melihat Laravel logs
sail tail -f storage/logs/laravel.log

# Melihat Nginx logs
sail tail -f /var/log/nginx/access.log
sail tail -f /var/log/nginx/error.log

# Melihat PHP-FPM logs
sail tail -f /var/log/php8.2-fpm.log
```

### 📋 Debugging dengan Xdebug
Mengaktifkan Xdebug:

```env
# File .env
SAIL_XDEBUG_MODE=develop,debug
SAIL_XDEBUG_CONFIG=client_host=host.docker.internal
```

### 📋 Menggunakan Tinker
Menggunakan Laravel Tinker untuk debugging:

```bash
sail artisan tinker

>>> User::find(1);
>>> DB::table('users')->get();
```

### 📋 Menggunakan Artisan Commands
Menggunakan Artisan untuk debugging:

```bash
# Melihat routes
sail artisan route:list

# Melihat config
sail artisan config:show

# Melihat environment
sail artisan env

# Melihat cache
sail artisan cache:clear
```

### 📋 Debugging Database
Debugging koneksi database:

```bash
# Masuk ke MySQL container
sail mysql

# Masuk ke Redis container
sail redis
```

## 🚀 Production Considerations

### 📋 Environment Differences
Perbedaan antara development dan production:

1. **Resource Limits** - Production memerlukan alokasi resource yang lebih tepat
2. **Security** - Production memerlukan konfigurasi keamanan yang ketat
3. **Backups** - Production memerlukan strategi backup yang solid
4. **Monitoring** - Production memerlukan monitoring yang aktif

### 📋 Production Configuration
Konfigurasi untuk production:

```env
# File .env.production
APP_ENV=production
APP_DEBUG=false
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=production_db
DB_USERNAME=production_user
DB_PASSWORD=secure_password

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
```

### 📋 Deployment Strategy
Strategi deployment dengan Sail:

1. **Build Images** - Bangun Docker images untuk production
2. **Push Images** - Push images ke registry
3. **Deploy Containers** - Deploy containers ke production server
4. **Run Migrations** - Jalankan migrations
5. **Seed Database** - Seed database jika diperlukan
6. **Clear Cache** - Bersihkan cache aplikasi

### 📋 Production Monitoring
Monitoring di production:

```bash
# Memantau resource usage
docker stats

# Memantau logs
docker logs -f container_name

# Memantau koneksi database
sail artisan db:monitor
```

### 📋 Backup Strategy
Strategi backup untuk production:

```bash
# Membuat backup database
sail artisan backup:run

# Membuat backup storage
tar -czf storage-backup.tar.gz storage/

# Membuat backup Docker volumes
docker run --rm -v sail_mysql:/data -v $(pwd):/backup alpine tar czf /backup/mysql-backup.tar.gz -C /data .
```

## 🧠 Kesimpulan

Laravel Sail menyediakan lingkungan pengembangan Docker yang dikonfigurasi sebelumnya yang memungkinkan Anda memulai dengan Laravel dengan cepat dan mudah tanpa memerlukan pengalaman Docker sebelumnya.

### 🔑 Keuntungan Utama
- Lingkungan pengembangan yang konsisten
- Mudah dikonfigurasi
- Services yang umum digunakan sudah tersedia
- Integrasi langsung dengan Artisan commands
- Dukungan untuk multiple PHP versions
- Easy sharing site dengan internet
- Docker Desktop integration
- Customizable service configuration

### 🚀 Best Practices
1. Gunakan Sail untuk lingkungan pengembangan lokal
2. Gunakan environment variables untuk konfigurasi
3. Monitor resource usage secara berkala
4. Gunakan backup strategy yang solid
5. Terapkan security best practices
6. Gunakan monitoring tools
7. Dokumentasikan konfigurasi kustom Anda
8. Uji aplikasi secara menyeluruh sebelum production

Dengan dokumentasi ini, Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan Laravel Sail untuk lingkungan pengembangan Laravel Anda.
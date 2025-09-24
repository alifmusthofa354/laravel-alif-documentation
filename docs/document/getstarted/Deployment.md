# 🚀 Deployment Laravel

Dokumen ini menjelaskan berbagai cara untuk mendeploy aplikasi Laravel ke lingkungan produksi, termasuk persiapan, konfigurasi, dan best practices untuk deployment yang sukses.

## 📖 Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Persiapan Deployment](#persiapan-deployment)
3. [Optimasi untuk Produksi](#optimasi-untuk-produksi)
4. [Platform Deployment](#platform-deployment)
5. [Deployment Manual](#deployment-manual)
6. [Monitoring dan Maintenance](#monitoring-dan-maintenance)

## 🎯 Pendahuluan

Deployment adalah proses memindahkan aplikasi dari lingkungan pengembangan ke lingkungan produksi. Proses ini melibatkan berbagai tahap untuk memastikan aplikasi berjalan dengan optimal dan aman.

### 🔧 Proses Deployment
1. **Persiapan** - Optimasi kode dan asset
2. **Testing** - Memastikan aplikasi berjalan dengan baik
3. **Transfer** - Memindahkan file ke server produksi
4. **Konfigurasi** - Mengatur environment produksi
5. **Verifikasi** - Memastikan aplikasi berjalan dengan baik

### ⚠️ Pertimbangan Penting
- Keamanan aplikasi
- Performa dan skalabilitas
- Backup dan recovery
- Monitoring dan logging
- Maintenance dan updates

## 📦 Persiapan Deployment

### 📋 Checklist Deployment
Sebelum mendeploy aplikasi, pastikan semua item berikut sudah selesai:

#### ✅ Kode dan Asset
- [ ] Semua fitur sudah selesai dan dites
- [ ] Asset frontend sudah dikompilasi
- [ ] Tidak ada debug code atau dump
- [ ] Log level sudah diatur ke production
- [ ] Debug mode sudah dimatikan

#### ✅ Konfigurasi
- [ ] File `.env` untuk produksi sudah siap
- [ ] Key aplikasi sudah di-generate
- [ ] Konfigurasi database sudah benar
- [ ] Konfigurasi cache sudah diatur
- [ ] Konfigurasi mail sudah diatur

#### ✅ Security
- [ ] APP_KEY sudah diatur
- [ ] APP_DEBUG sudah false
- [ ] Semua dependency sudah diperbarui
- [ ] Tidak ada credential di kode
- [ ] File permission sudah benar

### 🛠️ Optimasi Kode
```bash
# Generate application key
php artisan key:generate

# Cache konfigurasi
php artisan config:cache

# Cache route
php artisan route:cache

# Cache event
php artisan event:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev
```

### 🎨 Optimasi Asset
```bash
# Build asset untuk produksi
npm run build
# atau
bun run build
```

## ⚡ Optimasi untuk Produksi

### 🚀 Caching Configuration
```bash
# Cache semua konfigurasi
php artisan config:cache

# Clear cache konfigurasi
php artisan config:clear
```

### 🛣️ Route Caching
```bash
# Cache route
php artisan route:cache

# Clear route cache
php artisan route:clear
```

### 📦 Autoloader Optimization
```bash
# Optimize autoloader
composer install --optimize-autoloader --no-dev

# Dump autoload
composer dump-autoload --optimize
```

### 🎨 Asset Compilation
```bash
# Build asset untuk produksi
npm run build
# atau untuk Bun
bun run build
```

### 📁 File Permission
Pastikan permission file sudah benar:
```bash
# Direktori yang harus writable
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
```

### 📄 Environment Configuration
File `.env` untuk produksi:
```bash
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:your-app-key

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## ☁️ Platform Deployment

### 🚀 Laravel Forge
Laravel Forge menyediakan cara mudah untuk mengelola server dan mendeploy aplikasi Laravel.

#### 📦 Instalasi Forge
1. Buat akun di Laravel Forge
2. Hubungkan dengan penyedia cloud (AWS, DigitalOcean, dll)
3. Buat server baru
4. Deploy aplikasi

#### 🎯 Fitur Forge
- Server management
- SSL certificate
- Database management
- Queue worker management
- Scheduler management
- Deployment automation

### ⚡ Laravel Vapor
Laravel Vapor adalah platform serverless untuk Laravel yang dihosting di AWS.

#### 📦 Instalasi Vapor
```bash
composer require laravel/vapor-cli
vapor login
```

#### 🚀 Deploy dengan Vapor
```bash
# Inisialisasi proyek
vapor init

# Deploy ke staging
vapor deploy staging

# Deploy ke production
vapor deploy production
```

#### 📄 Konfigurasi Vapor
File `vapor.yml`:
```yaml
id: 12345
name: my-app
environments:
    production:
        runtime: php-8.1:al2
        build:
            - 'composer install --no-dev --optimize-autoloader'
            - 'php artisan event:cache'
            - 'php artisan route:cache'
            - 'php artisan config:cache'
            - 'npm ci && npm run prod && rm -rf node_modules'
```

### 🌐 Laravel Envoyer
Laravel Envoyer menyediakan zero downtime deployment untuk aplikasi Laravel.

#### 🎯 Fitur Envoyer
- Zero downtime deployment
- Rollback otomatis
- Health monitoring
- Deployment hooks
- Multiple server support

### ☁️ Platform as a Service (PaaS)

#### 🐘 Heroku
```bash
# Buat file Procfile
echo "web: vendor/bin/heroku-php-apache2 public/" > Procfile

# Deploy ke Heroku
git push heroku main
```

#### 🐳 Docker
File `Dockerfile`:
```dockerfile
FROM php:8.1-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory contents
COPY . /var/www

# Install dependencies
RUN composer install --optimize-autoloader --no-dev

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]
```

## 🛠️ Deployment Manual

### 🖥️ Server Requirements
- PHP >= 8.1
- Composer
- Web server (Apache/Nginx)
- Database (MySQL/PostgreSQL)
- Redis (opsional tapi direkomendasikan)

### 📦 Langkah Deployment Manual

#### 1. Setup Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP dan extensions
sudo apt install php php-cli php-fpm php-json php-common php-mysql php-zip php-gd php-mbstring php-curl php-xml php-pear php-bcmath -y

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Nginx
sudo apt install nginx -y
```

#### 2. Clone Repository
```bash
# Clone aplikasi
git clone your-repository-url /var/www/your-app

# Masuk ke direktori aplikasi
cd /var/www/your-app

# Install dependencies
composer install --optimize-autoloader --no-dev
npm install
npm run build
```

#### 3. Konfigurasi Environment
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Konfigurasi database dan lainnya
# Edit file .env
```

#### 4. Setup Database
```bash
# Jalankan migrasi
php artisan migrate --force

# Jalankan seeder (jika diperlukan)
php artisan db:seed --force
```

#### 5. Optimasi untuk Production
```bash
# Cache konfigurasi
php artisan config:cache

# Cache route
php artisan route:cache

# Cache event
php artisan event:cache

# Optimize autoloader
composer dump-autoload --optimize
```

#### 6. Setup Web Server (Nginx)
File `/etc/nginx/sites-available/your-app`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/your-app/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

#### 7. Setup Queue Worker
```bash
# Install Supervisor
sudo apt install supervisor -y

# Buat file konfigurasi supervisor
sudo nano /etc/supervisor/conf.d/your-app.conf
```

File `/etc/supervisor/conf.d/your-app.conf`:
```ini
[program:your-app-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/your-app/artisan queue:work --sleep=3 --tries=3 --max-jobs=1000
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=8
redirect_stderr=true
stdout_logfile=/var/www/your-app/storage/logs/worker.log
stopwaitsecs=3600
```

#### 8. Setup Scheduler
Tambahkan ke crontab:
```bash
sudo crontab -e
```

Tambahkan baris berikut:
```bash
* * * * * cd /var/www/your-app && php artisan schedule:run >> /dev/null 2>&1
```

## 🔍 Monitoring dan Maintenance

### 📊 Monitoring Tools

#### 🐘 Laravel Telescope
```bash
composer require laravel/telescope
php artisan telescope:install
php artisan migrate
```

#### 🔥 Laravel Horizon
```bash
composer require laravel/horizon
php artisan horizon:install
```

#### 📈 Laravel Pulse
```bash
composer require laravel/pulse
php artisan pulse:install
```

### 🛠️ Maintenance Tasks

#### 🔄 Update Dependencies
```bash
# Update Composer dependencies
composer update

# Update NPM dependencies
npm update
```

#### 🗃️ Backup Database
```bash
# Backup database
php artisan backup:run

# Schedule backup
# Tambahkan ke App\Console\Kernel.php
$schedule->command('backup:clean')->daily();
$schedule->command('backup:run')->daily();
```

#### 📈 Monitoring Logs
```bash
# Lihat log aplikasi
tail -f storage/logs/laravel.log

# Lihat log queue worker
tail -f storage/logs/worker.log
```

#### 🚨 Health Checks
```php
// routes/web.php
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'database' => DB::connection()->getPdo() ? 'connected' : 'disconnected',
    ]);
});
```

### 🆘 Troubleshooting

#### 🔄 Clear All Cache
```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

#### 🐛 Debug Mode
Sementara aktifkan debug mode untuk troubleshooting:
```bash
APP_DEBUG=true
```

#### 📋 Check System Requirements
```bash
php artisan about
```

## 🧠 Kesimpulan

Deployment Laravel melibatkan berbagai aspek penting untuk memastikan aplikasi berjalan dengan optimal di lingkungan produksi:

### 🎯 Best Practices Deployment
1. **Pre-deployment Testing** - Pastikan semua fitur berjalan dengan baik
2. **Optimization** - Cache konfigurasi, route, dan asset
3. **Security** - Matikan debug mode dan atur permission dengan benar
4. **Monitoring** - Gunakan tools monitoring untuk tracking performance
5. **Backup** - Implementasikan backup strategy yang solid
6. **Rollback Plan** - Siapkan rencana rollback jika deployment gagal

### 🚀 Platform Recommendation
- **Forge + Envoyer** - Untuk server tradisional dengan deployment automation
- **Vapor** - Untuk serverless deployment di AWS
- **PaaS** - Untuk deployment cepat tanpa manajemen server

### ⚡ Performance Optimization
- Gunakan caching (Redis/Memcached)
- Optimize database queries
- Use CDN untuk asset statis
- Implement HTTP/2
- Enable Gzip compression

Dengan mengikuti best practices ini, Anda dapat memastikan aplikasi Laravel Anda berjalan dengan stabil, aman, dan performa tinggi di lingkungan produksi.
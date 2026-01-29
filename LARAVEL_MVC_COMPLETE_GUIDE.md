# SEWA Hospitality - Laravel MVC Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schema & Design](#database-schema--design)
5. [Directory Structure](#directory-structure)
6. [Models & Relationships](#models--relationships)
7. [Controllers & Business Logic](#controllers--business-logic)
8. [Views & Blade Templates](#views--blade-templates)
9. [Routes & API Endpoints](#routes--api-endpoints)
10. [Authentication & Authorization](#authentication--authorization)
11. [Multi-Language Implementation](#multi-language-implementation)
12. [Live Chat System](#live-chat-system)
13. [Analytics & Tracking](#analytics--tracking)
14. [Admin Dashboard](#admin-dashboard)
15. [SEO Optimization](#seo-optimization)
16. [Security Implementation](#security-implementation)
17. [Error Handling & Monitoring](#error-handling--monitoring)
18. [Deployment & DevOps](#deployment--devops)
19. [Testing Strategy](#testing-strategy)
20. [Production Checklist](#production-checklist)

---

## Project Overview

### Mission
SEWA Hospitality is a premium end-to-end hospitality platform offering medical tourism, luxury travel, wellness retreats, corporate services, destination weddings, and heritage tours in India.

### Core Services
- **Medical Tourism**: Healthcare coordination with world-class hospitals
- **Luxury Travel**: Bespoke experiences across India's exclusive destinations
- **Wellness Retreats**: Ayurveda, yoga, and holistic healing programs
- **Corporate Services**: MICE solutions and executive travel management
- **Destination Weddings**: Full wedding planning and coordination
- **Heritage Tours**: Cultural immersion and historical exploration

### Key Features
- Real-time live chat with persistent visitor sessions
- Comprehensive visitor analytics and tracking
- Google Ads conversion tracking integration
- SEO-optimized multi-language content (10 languages)
- Production-grade admin dashboard
- Audit logging for compliance
- Role-based access control
- Backup and disaster recovery strategy

---

## System Architecture

### MVC Architecture Overview
```
SEWA Hospitality (Laravel MVC)
├── Routes (web.php, api.php, admin.php)
├── Controllers
│   ├── Frontend (Public Pages)
│   ├── Admin (Dashboard & Management)
│   └── API (Real-time & AJAX)
├── Models (Eloquent ORM)
├── Views (Blade Templates)
├── Services (Business Logic Layer)
├── Middlewares (Authentication, CORS, etc.)
├── Database (MySQL/PostgreSQL)
└── Resources (Public Assets)
```

### Request Flow Diagram
```
HTTP Request
    ↓
Routes (web.php/api.php) - Route Matching
    ↓
Middleware Stack - Authentication, CORS, CSRF
    ↓
Controller - Request Handling
    ↓
Service/Model - Business Logic & Database
    ↓
Blade Template Rendering
    ↓
JSON Response / HTML Response
```

### Design Patterns Used
1. **MVC Pattern**: Clear separation of concerns
2. **Repository Pattern**: Data abstraction layer
3. **Service Layer Pattern**: Business logic encapsulation
4. **Observer Pattern**: Event-driven architecture
5. **Singleton Pattern**: Single instance services
6. **Facade Pattern**: Simplified complex subsystems

---

## Technology Stack

### Backend Framework
- **Laravel 11**: PHP 8.2+ web framework
- **Eloquent ORM**: Object-relational mapping
- **Blade Template Engine**: Server-side templating
- **Artisan CLI**: Command-line interface

### Database
- **MySQL 8.0+** or **PostgreSQL 14+**
- **Redis**: Caching and session storage
- **Queue System**: Background job processing (SQS/Redis)

### Frontend Technologies
- **HTML5**: Semantic markup
- **CSS3**: Custom styles (no Tailwind, pure CSS)
- **JavaScript (Vanilla/jQuery)**: Client-side interactivity
- **Bootstrap 5**: Responsive framework (optional)
- **HTMX/Livewire**: Interactive components

### Real-time Communication
- **Laravel WebSockets** or **Pusher**: Real-time chat
- **Socket.io (optional)**: Alternative real-time solution

### External Services
- **Stripe**: Payment processing (future phase)
- **SendGrid/Mailgun**: Email delivery
- **Google Cloud Storage**: File uploads
- **Google Analytics 4**: Advanced analytics
- **Google Ads**: Conversion tracking
- **Sentry**: Error monitoring

### Development Tools
- **Docker**: Containerization (Laravel Sail)
- **Git**: Version control
- **Composer**: PHP dependency management
- **npm/Yarn**: Frontend dependencies

---

## Database Schema & Design

### Database Design Philosophy
- Normalized design (3NF)
- Soft deletes for audit trail
- Timestamped records (created_at, updated_at)
- Soft foreign keys for flexibility
- Indexed commonly queried columns

### Core Tables

#### 1. Users (Admin Users)
```sql
CREATE TABLE users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_active (is_active)
);
```

#### 2. Site Settings
```sql
CREATE TABLE site_settings (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  key VARCHAR(255) UNIQUE NOT NULL,
  value LONGTEXT,
  type ENUM('string', 'array', 'json', 'boolean') DEFAULT 'string',
  group VARCHAR(100),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (key),
  INDEX idx_group (group)
);
```

#### 3. Pages (SEO-Optimized Content)
```sql
CREATE TABLE pages (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  meta_description VARCHAR(500),
  meta_keywords JSON,
  og_image VARCHAR(500),
  canonical_url VARCHAR(500),
  structured_data JSON,
  content LONGTEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP NULL,
  created_by BIGINT UNSIGNED,
  updated_by BIGINT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (updated_by) REFERENCES users(id),
  INDEX idx_slug (slug),
  INDEX idx_published (is_published)
);
```

#### 4. Services
```sql
CREATE TABLE services (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  icon VARCHAR(100),
  image_url VARCHAR(500),
  items JSON,
  display_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  seo_title VARCHAR(255),
  seo_description VARCHAR(500),
  seo_keywords JSON,
  created_by BIGINT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_slug (slug),
  INDEX idx_featured (is_featured),
  INDEX idx_published (is_published),
  FULLTEXT INDEX ft_title_desc (title, description)
);
```

#### 5. Destinations
```sql
CREATE TABLE destinations (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  headline VARCHAR(500),
  description LONGTEXT,
  icon VARCHAR(100),
  image_url VARCHAR(500),
  gallery_images JSON,
  services JSON,
  highlights JSON,
  display_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  INDEX idx_slug (slug),
  INDEX idx_featured (is_featured),
  SPATIAL INDEX idx_location (POINT(latitude, longitude))
);
```

#### 6. Team Members
```sql
CREATE TABLE team_members (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  bio TEXT,
  expertise JSON,
  languages JSON,
  image_url VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(20),
  linkedin_url VARCHAR(500),
  is_leadership BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  INDEX idx_leadership (is_leadership),
  INDEX idx_published (is_published)
);
```

#### 7. Partners
```sql
CREATE TABLE partners (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  INDEX idx_category (category),
  INDEX idx_featured (is_featured),
  INDEX idx_published (is_published)
);
```

#### 8. Testimonials
```sql
CREATE TABLE testimonials (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  client_name VARCHAR(255) NOT NULL,
  client_title VARCHAR(255),
  client_company VARCHAR(255),
  client_location VARCHAR(255),
  client_image_url VARCHAR(500),
  platform VARCHAR(50),
  platform_url VARCHAR(500),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  content LONGTEXT NOT NULL,
  service_type VARCHAR(100),
  destination VARCHAR(100),
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  INDEX idx_platform (platform),
  INDEX idx_featured (is_featured),
  INDEX idx_rating (rating)
);
```

#### 9. Contact Submissions
```sql
CREATE TABLE contact_submissions (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  nationality VARCHAR(100),
  service_interest VARCHAR(255),
  preferred_language VARCHAR(10) DEFAULT 'en',
  message LONGTEXT NOT NULL,
  status ENUM('new', 'in_progress', 'responded', 'closed') DEFAULT 'new',
  admin_notes LONGTEXT,
  replied_at TIMESTAMP NULL,
  replied_by BIGINT UNSIGNED,
  ip_address VARCHAR(50),
  user_agent LONGTEXT,
  referrer VARCHAR(500),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  gclid VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (replied_by) REFERENCES users(id),
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created (created_at),
  FULLTEXT INDEX ft_message (message)
);
```

#### 10. Chat Sessions
```sql
CREATE TABLE chat_sessions (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  visitor_id VARCHAR(100) NOT NULL,
  visitor_name VARCHAR(255),
  visitor_email VARCHAR(255),
  visitor_phone VARCHAR(20),
  status ENUM('active', 'waiting', 'closed') DEFAULT 'active',
  assigned_admin_id BIGINT UNSIGNED,
  ip_address VARCHAR(50),
  user_agent LONGTEXT,
  location_country VARCHAR(100),
  location_city VARCHAR(100),
  page_url VARCHAR(500),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL,
  last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  duration_seconds INT DEFAULT 0,
  message_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_admin_id) REFERENCES users(id),
  INDEX idx_visitor (visitor_id),
  INDEX idx_status (status),
  INDEX idx_assigned (assigned_admin_id),
  INDEX idx_created (created_at)
);
```

#### 11. Chat Messages
```sql
CREATE TABLE chat_messages (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT UNSIGNED NOT NULL,
  sender_type ENUM('visitor', 'admin', 'system') NOT NULL,
  sender_name VARCHAR(255),
  sender_id BIGINT UNSIGNED,
  message LONGTEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  INDEX idx_session (session_id),
  INDEX idx_created (created_at)
);
```

#### 12. Visitor Analytics
```sql
CREATE TABLE visitor_analytics (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  visitor_id VARCHAR(100) NOT NULL,
  session_id VARCHAR(100),
  page_path VARCHAR(500) NOT NULL,
  page_title VARCHAR(500),
  referrer VARCHAR(500),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_term VARCHAR(100),
  utm_content VARCHAR(100),
  gclid VARCHAR(500),
  ip_address VARCHAR(50),
  country VARCHAR(100),
  city VARCHAR(100),
  region VARCHAR(100),
  device_type ENUM('desktop', 'mobile', 'tablet') DEFAULT 'desktop',
  browser VARCHAR(100),
  os VARCHAR(100),
  screen_resolution VARCHAR(20),
  language VARCHAR(10),
  duration_seconds INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_visitor (visitor_id),
  INDEX idx_session (session_id),
  INDEX idx_page (page_path),
  INDEX idx_created (created_at),
  INDEX idx_utm (utm_source, utm_medium, utm_campaign)
);
```

#### 13. Audit Logs
```sql
CREATE TABLE audit_logs (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED,
  action VARCHAR(255) NOT NULL,
  model_type VARCHAR(255),
  model_id BIGINT UNSIGNED,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(50),
  user_agent LONGTEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user (user_id),
  INDEX idx_model (model_type, model_id),
  INDEX idx_created (created_at)
);
```

#### 14. Translations
```sql
CREATE TABLE translations (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  model_type VARCHAR(255) NOT NULL,
  model_id BIGINT UNSIGNED NOT NULL,
  language_code VARCHAR(10) NOT NULL,
  field_name VARCHAR(255) NOT NULL,
  field_value LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_translation (model_type, model_id, language_code, field_name),
  INDEX idx_language (language_code),
  INDEX idx_model (model_type, model_id)
);
```

#### 15. Email Logs
```sql
CREATE TABLE email_logs (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  template_name VARCHAR(255),
  status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
  error_message TEXT,
  metadata JSON,
  sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created (created_at)
);
```

### Migration Strategy
```bash
php artisan make:migration create_users_table --table=users
php artisan make:migration create_site_settings_table --table=site_settings
php artisan make:migration create_pages_table --table=pages
php artisan make:migration create_services_table --table=services
# ... continue for all tables
php artisan migrate
```

---

## Directory Structure

```
laravel-project/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Web/
│   │   │   │   ├── HomeController.php
│   │   │   │   ├── ServiceController.php
│   │   │   │   ├── DestinationController.php
│   │   │   │   ├── ContactController.php
│   │   │   │   ├── ChatController.php
│   │   │   │   └── PageController.php
│   │   │   ├── Admin/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── ContactController.php
│   │   │   │   ├── ChatController.php
│   │   │   │   ├── AnalyticsController.php
│   │   │   │   ├── ServiceController.php
│   │   │   │   ├── DestinationController.php
│   │   │   │   └── UserController.php
│   │   │   └── Api/
│   │   │       ├── ChatApiController.php
│   │   │       ├── AnalyticsApiController.php
│   │   │       └── SearchApiController.php
│   │   ├── Middleware/
│   │   │   ├── Authenticate.php
│   │   │   ├── IsAdmin.php
│   │   │   ├── VerifyCsrfToken.php
│   │   │   ├── TrackVisitor.php
│   │   │   └── LogActivity.php
│   │   └── Requests/
│   │       ├── StoreContactRequest.php
│   │       ├── StoreServiceRequest.php
│   │       └── UpdateUserRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── SiteSetting.php
│   │   ├── Page.php
│   │   ├── Service.php
│   │   ├── Destination.php
│   │   ├── TeamMember.php
│   │   ├── Partner.php
│   │   ├── Testimonial.php
│   │   ├── ContactSubmission.php
│   │   ├── ChatSession.php
│   │   ├── ChatMessage.php
│   │   ├── VisitorAnalytic.php
│   │   ├── AuditLog.php
│   │   ├── Translation.php
│   │   └── EmailLog.php
│   ├── Services/
│   │   ├── ChatService.php
│   │   ├── AnalyticsService.php
│   │   ├── EmailService.php
│   │   ├── SeoService.php
│   │   ├── TranslationService.php
│   │   └── NotificationService.php
│   ├── Events/
│   │   ├── ContactSubmitted.php
│   │   ├── ChatMessageSent.php
│   │   └── VisitorTracked.php
│   ├── Jobs/
│   │   ├── SendContactEmail.php
│   │   ├── ProcessAnalytics.php
│   │   └── GenerateReport.php
│   ├── Mail/
│   │   ├── ContactConfirmation.php
│   │   ├── ContactNotification.php
│   │   └── ChatNotification.php
│   ├── Observers/
│   │   ├── ServiceObserver.php
│   │   └── ContactSubmissionObserver.php
│   └── Exceptions/
│       ├── Handler.php
│       └── CustomExceptions.php
├── resources/
│   ├── views/
│   │   ├── layouts/
│   │   │   ├── app.blade.php (main layout)
│   │   │   ├── admin.blade.php (admin layout)
│   │   │   └── guest.blade.php (guest layout)
│   │   ├── pages/
│   │   │   ├── home.blade.php
│   │   │   ├── services.blade.php
│   │   │   ├── destinations.blade.php
│   │   │   ├── about.blade.php
│   │   │   ├── contact.blade.php
│   │   │   ├── partners.blade.php
│   │   │   └── corporate.blade.php
│   │   ├── admin/
│   │   │   ├── dashboard.blade.php
│   │   │   ├── contacts/
│   │   │   │   ├── index.blade.php
│   │   │   │   ├── show.blade.php
│   │   │   │   └── edit.blade.php
│   │   │   ├── chat/
│   │   │   │   ├── index.blade.php
│   │   │   │   └── session.blade.php
│   │   │   ├── analytics/
│   │   │   │   ├── dashboard.blade.php
│   │   │   │   └── detailed.blade.php
│   │   │   ├── services/
│   │   │   └── users/
│   │   ├── components/
│   │   │   ├── chat-widget.blade.php
│   │   │   ├── header.blade.php
│   │   │   ├── footer.blade.php
│   │   │   ├── hero.blade.php
│   │   │   ├── service-card.blade.php
│   │   │   └── testimonial-carousel.blade.php
│   │   └── auth/
│   │       ├── login.blade.php
│   │       └── register.blade.php
│   ├── css/
│   │   ├── app.css (custom styles)
│   │   ├── responsive.css (mobile-first design)
│   │   └── admin.css (admin panel styles)
│   └── js/
│       ├── app.js
│       ├── chat.js (live chat functionality)
│       ├── analytics.js (visitor tracking)
│       └── admin.js (admin panel scripts)
├── routes/
│   ├── web.php (public routes)
│   ├── api.php (API routes)
│   └── admin.php (admin routes)
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000001_create_users_table.php
│   │   ├── 2024_01_01_000002_create_site_settings_table.php
│   │   └── ... (all migrations)
│   ├── factories/
│   │   ├── UserFactory.php
│   │   ├── ServiceFactory.php
│   │   └── TestimonialFactory.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── ServiceSeeder.php
│       ├── DestinationSeeder.php
│       └── TestimonialSeeder.php
├── storage/
│   ├── app/
│   │   ├── public/ (public files)
│   │   └── private/ (private files)
│   ├── logs/ (application logs)
│   └── framework/ (cache, sessions)
├── tests/
│   ├── Feature/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── HomeControllerTest.php
│   │   │   │   ├── ContactControllerTest.php
│   │   │   │   └── ChatControllerTest.php
│   │   │   └── Middleware/
│   │   └── Models/
│   │       ├── ServiceTest.php
│   │       └── ChatSessionTest.php
│   └── Unit/
│       ├── Services/
│       │   ├── ChatServiceTest.php
│       │   └── AnalyticsServiceTest.php
│       └── Models/
├── .env.example (environment template)
├── artisan (Artisan CLI)
├── composer.json (dependencies)
└── phpunit.xml (testing config)
```

---

## Models & Relationships

### User Model
```php
// app/Models/User.php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class User extends Authenticatable
{
    use Notifiable, LogsActivity;

    protected $fillable = ['name', 'email', 'password', 'phone', 'role', 'is_active'];
    protected $hidden = ['password', 'remember_token'];
    protected $casts = [
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function chatSessions()
    {
        return $this->hasMany(ChatSession::class, 'assigned_admin_id');
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'role', 'is_active'])
            ->useLogName('user');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeAdmin($query)
    {
        return $query->whereIn('role', ['super_admin', 'admin']);
    }

    // Methods
    public function hasRole($role)
    {
        return $this->role === $role || $this->role === 'super_admin';
    }

    public function recordLogin()
    {
        $this->update(['last_login_at' => now()]);
    }
}
```

### Service Model
```php
// app/Models/Service.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Service extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'slug', 'title', 'description', 'icon', 'image_url', 
        'items', 'display_order', 'is_featured', 'is_published',
        'seo_title', 'seo_description', 'seo_keywords', 'created_by'
    ];

    protected $casts = [
        'items' => 'array',
        'seo_keywords' => 'array',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // Relationships
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function testimonials()
    {
        return $this->hasMany(Testimonial::class, 'service_type', 'title');
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order')->orderBy('created_at', 'desc');
    }

    // Methods
    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function publish()
    {
        $this->update(['is_published' => true]);
    }

    public function unpublish()
    {
        $this->update(['is_published' => false]);
    }
}
```

### ChatSession & ChatMessage Models
```php
// app/Models/ChatSession.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatSession extends Model
{
    protected $fillable = [
        'visitor_id', 'visitor_name', 'visitor_email', 'visitor_phone',
        'status', 'assigned_admin_id', 'ip_address', 'user_agent',
        'location_country', 'location_city', 'page_url', 'started_at',
        'ended_at', 'last_message_at', 'duration_seconds', 'message_count'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'last_message_at' => 'datetime',
    ];

    // Relationships
    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class)->orderBy('created_at');
    }

    public function assignedAdmin()
    {
        return $this->belongsTo(User::class, 'assigned_admin_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('last_message_at', 'desc');
    }

    // Methods
    public function close()
    {
        $this->update([
            'status' => 'closed',
            'ended_at' => now(),
            'duration_seconds' => $this->calculateDuration()
        ]);
    }

    public function calculateDuration()
    {
        if (!$this->ended_at) return 0;
        return $this->started_at->diffInSeconds($this->ended_at);
    }

    public function addMessage($message, $senderType, $senderName = null, $senderId = null)
    {
        $this->messages()->create([
            'message' => $message,
            'sender_type' => $senderType,
            'sender_name' => $senderName,
            'sender_id' => $senderId,
        ]);

        $this->increment('message_count');
        $this->update(['last_message_at' => now()]);
    }
}

// app/Models/ChatMessage.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = [
        'session_id', 'sender_type', 'sender_name', 'sender_id', 'message', 'is_read', 'read_at'
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public $timestamps = false;

    // Relationships
    public function session()
    {
        return $this->belongsTo(ChatSession::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    // Methods
    public function markAsRead()
    {
        if (!$this->is_read) {
            $this->update([
                'is_read' => true,
                'read_at' => now()
            ]);
        }
    }
}
```

### VisitorAnalytic Model
```php
// app/Models/VisitorAnalytic.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisitorAnalytic extends Model
{
    protected $fillable = [
        'visitor_id', 'session_id', 'page_path', 'page_title', 'referrer',
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
        'gclid', 'ip_address', 'country', 'city', 'region', 'device_type',
        'browser', 'os', 'screen_resolution', 'language', 'duration_seconds'
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public $timestamps = false;

    // Scopes
    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('created_at', now()->month);
    }

    public function scopeWithUtm($query)
    {
        return $query->whereNotNull('utm_source');
    }

    public function scopeWithGclid($query)
    {
        return $query->whereNotNull('gclid');
    }
}
```

---

## Controllers & Business Logic

### Web Controllers - Frontend

#### HomeController
```php
// app/Http/Controllers/Web/HomeController.php
<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Destination;
use App\Models\Partner;
use App\Models\Testimonial;
use App\Models\TeamMember;

class HomeController extends Controller
{
    public function index()
    {
        $services = Service::published()
            ->featured()
            ->ordered()
            ->limit(6)
            ->get();

        $destinations = Destination::published()
            ->featured()
            ->ordered()
            ->limit(6)
            ->get();

        $partners = Partner::where('is_published', true)
            ->featured()
            ->limit(8)
            ->get();

        $testimonials = Testimonial::published()
            ->featured()
            ->limit(6)
            ->get();

        $team = TeamMember::where('is_published', true)
            ->where('is_leadership', true)
            ->limit(4)
            ->get();

        return view('pages.home', [
            'services' => $services,
            'destinations' => $destinations,
            'partners' => $partners,
            'testimonials' => $testimonials,
            'team' => $team,
        ]);
    }
}
```

#### ServiceController
```php
// app/Http/Controllers/Web/ServiceController.php
<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Service;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::published()
            ->ordered()
            ->paginate(12);

        return view('pages.services', ['services' => $services]);
    }

    public function show(Service $service)
    {
        if (!$service->is_published) {
            abort(404);
        }

        $relatedServices = Service::published()
            ->where('id', '!=', $service->id)
            ->limit(3)
            ->get();

        return view('pages.service-detail', [
            'service' => $service,
            'relatedServices' => $relatedServices,
        ]);
    }
}
```

#### ContactController
```php
// app/Http/Controllers/Web/ContactController.php
<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Models\ContactSubmission;
use App\Events\ContactSubmitted;
use Illuminate\Support\Facades\Cookie;

class ContactController extends Controller
{
    public function index()
    {
        return view('pages.contact');
    }

    public function store(StoreContactRequest $request)
    {
        $contact = ContactSubmission::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'nationality' => $request->nationality,
            'service_interest' => $request->service_interest,
            'preferred_language' => app()->getLocale(),
            'message' => $request->message,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'referrer' => $request->referrer(),
            'utm_source' => $request->query('utm_source'),
            'utm_medium' => $request->query('utm_medium'),
            'utm_campaign' => $request->query('utm_campaign'),
            'gclid' => $request->query('gclid'),
        ]);

        event(new ContactSubmitted($contact));

        return response()->json([
            'success' => true,
            'message' => __('contact.thank_you')
        ]);
    }
}
```

#### ChatController
```php
// app/Http/Controllers/Web/ChatController.php
<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use App\Services\ChatService;

class ChatController extends Controller
{
    private $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    public function startSession()
    {
        $visitorId = request()->cookie('visitor_id') ?: \Str::uuid();

        $session = $this->chatService->createSession(
            visitorId: $visitorId,
            pageUrl: request()->referrer(),
            ipAddress: request()->ip(),
            userAgent: request->userAgent(),
        );

        return response()->json($session, 201)
            ->cookie('visitor_id', $visitorId, 43200);
    }

    public function sendMessage()
    {
        $this->chatService->addMessage(
            sessionId: request('session_id'),
            message: request('message'),
            senderType: 'visitor',
            senderName: request('sender_name'),
        );

        return response()->json(['success' => true]);
    }

    public function getMessages($sessionId)
    {
        $messages = ChatSession::findOrFail($sessionId)
            ->messages()
            ->where('is_read', false)
            ->where('sender_type', 'admin')
            ->get();

        ChatSession::findOrFail($sessionId)
            ->messages()
            ->update(['is_read' => true, 'read_at' => now()]);

        return response()->json($messages);
    }
}
```

### Admin Controllers

#### AdminDashboardController
```php
// app/Http/Controllers/Admin/DashboardController.php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use App\Models\ChatSession;
use App\Models\VisitorAnalytic;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('admin');
    }

    public function index()
    {
        $stats = [
            'totalContacts' => ContactSubmission::count(),
            'newContacts' => ContactSubmission::where('status', 'new')->count(),
            'activeSessions' => ChatSession::where('status', 'active')->count(),
            'todayVisitors' => VisitorAnalytic::whereDate('created_at', today())->distinct('visitor_id')->count('visitor_id'),
            'todayPageViews' => VisitorAnalytic::whereDate('created_at', today())->count(),
        ];

        $recentContacts = ContactSubmission::latest()->limit(10)->get();
        $activeSessions = ChatSession::where('status', 'active')
            ->latest('last_message_at')
            ->limit(5)
            ->get();

        $visitorsChart = $this->getVisitorsChart();
        $conversionChart = $this->getConversionChart();

        return view('admin.dashboard', [
            'stats' => $stats,
            'recentContacts' => $recentContacts,
            'activeSessions' => $activeSessions,
            'visitorsChart' => $visitorsChart,
            'conversionChart' => $conversionChart,
        ]);
    }

    private function getVisitorsChart()
    {
        $data = VisitorAnalytic::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(DISTINCT visitor_id) as count')
        )
            ->whereBetween('created_at', [now()->subDays(30), now()])
            ->groupBy('date')
            ->get();

        return [
            'labels' => $data->pluck('date'),
            'data' => $data->pluck('count'),
        ];
    }

    private function getConversionChart()
    {
        $data = ContactSubmission::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count')
        )
            ->whereBetween('created_at', [now()->subDays(30), now()])
            ->groupBy('date')
            ->get();

        return [
            'labels' => $data->pluck('date'),
            'data' => $data->pluck('count'),
        ];
    }
}
```

#### AdminContactController
```php
// app/Http/Controllers/Admin/ContactController.php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use App\Mail\ContactReply;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('admin');
    }

    public function index()
    {
        $contacts = ContactSubmission::when(request('status'), function ($query) {
            $query->where('status', request('status'));
        })
            ->when(request('search'), function ($query) {
                $query->where('email', 'like', '%' . request('search') . '%')
                    ->orWhere('name', 'like', '%' . request('search') . '%');
            })
            ->latest()
            ->paginate(20);

        return view('admin.contacts.index', ['contacts' => $contacts]);
    }

    public function show(ContactSubmission $contact)
    {
        return view('admin.contacts.show', ['contact' => $contact]);
    }

    public function update(ContactSubmission $contact)
    {
        $contact->update([
            'status' => request('status'),
            'admin_notes' => request('admin_notes'),
            'replied_by' => auth()->id(),
            'replied_at' => now(),
        ]);

        if (request('send_email')) {
            Mail::to($contact->email)->send(new ContactReply($contact));
        }

        return redirect()->back()->with('success', 'Contact updated successfully');
    }

    public function delete(ContactSubmission $contact)
    {
        $contact->delete();
        return redirect()->back()->with('success', 'Contact deleted');
    }
}
```

#### AdminChatController
```php
// app/Http/Controllers/Admin/ChatController.php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use App\Services\ChatService;
use App\Events\ChatMessageSent;

class ChatController extends Controller
{
    private $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->middleware('auth');
        $this->middleware('admin');
        $this->chatService = $chatService;
    }

    public function index()
    {
        $sessions = ChatSession::when(request('status'), function ($query) {
            $query->where('status', request('status'));
        })
            ->latest('last_message_at')
            ->paginate(20);

        return view('admin.chat.index', ['sessions' => $sessions]);
    }

    public function show(ChatSession $session)
    {
        $session->update(['assigned_admin_id' => auth()->id()]);

        $messages = $session->messages;
        $messages->each(fn($msg) => $msg->markAsRead());

        return view('admin.chat.session', ['session' => $session, 'messages' => $messages]);
    }

    public function sendMessage(ChatSession $session)
    {
        $this->chatService->addMessage(
            sessionId: $session->id,
            message: request('message'),
            senderType: 'admin',
            senderName: auth()->user()->name,
            senderId: auth()->id(),
        );

        event(new ChatMessageSent($session));

        return response()->json(['success' => true]);
    }

    public function close(ChatSession $session)
    {
        $session->close();
        return redirect()->back()->with('success', 'Chat session closed');
    }
}
```

#### AdminAnalyticsController
```php
// app/Http/Controllers/Admin/AnalyticsController.php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VisitorAnalytic;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('admin');
    }

    public function dashboard()
    {
        $period = request('period', 30);

        $totalVisitors = VisitorAnalytic::whereBetween('created_at', [
            now()->subDays($period),
            now()
        ])->distinct('visitor_id')->count('visitor_id');

        $totalPageViews = VisitorAnalytic::whereBetween('created_at', [
            now()->subDays($period),
            now()
        ])->count();

        $topPages = VisitorAnalytic::select('page_path', 'page_title', DB::raw('COUNT(*) as views'))
            ->whereBetween('created_at', [now()->subDays($period), now()])
            ->groupBy('page_path', 'page_title')
            ->orderBy('views', 'desc')
            ->limit(10)
            ->get();

        $topCountries = VisitorAnalytic::select('country', DB::raw('COUNT(*) as count'))
            ->whereBetween('created_at', [now()->subDays($period), now()])
            ->groupBy('country')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        $deviceTypes = VisitorAnalytic::select('device_type', DB::raw('COUNT(*) as count'))
            ->whereBetween('created_at', [now()->subDays($period), now()])
            ->groupBy('device_type')
            ->get();

        $utmCampaigns = VisitorAnalytic::select('utm_campaign', 'utm_source', 'utm_medium', DB::raw('COUNT(*) as count'))
            ->whereBetween('created_at', [now()->subDays($period), now()])
            ->whereNotNull('utm_campaign')
            ->groupBy('utm_campaign', 'utm_source', 'utm_medium')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        return view('admin.analytics.dashboard', [
            'totalVisitors' => $totalVisitors,
            'totalPageViews' => $totalPageViews,
            'topPages' => $topPages,
            'topCountries' => $topCountries,
            'deviceTypes' => $deviceTypes,
            'utmCampaigns' => $utmCampaigns,
        ]);
    }

    public function detailed()
    {
        $analytics = VisitorAnalytic::latest()->paginate(50);
        return view('admin.analytics.detailed', ['analytics' => $analytics]);
    }

    public function export()
    {
        $data = VisitorAnalytic::whereBetween('created_at', [
            now()->subDays(request('days', 30)),
            now()
        ])->get();

        return response()->streamDownload(function () use ($data) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Visitor ID', 'Page Path', 'Country', 'Device', 'Created At']);

            foreach ($data as $row) {
                fputcsv($handle, [
                    $row->visitor_id,
                    $row->page_path,
                    $row->country,
                    $row->device_type,
                    $row->created_at,
                ]);
            }
            fclose($handle);
        }, 'analytics-' . now()->format('Y-m-d') . '.csv');
    }
}
```

---

## Views & Blade Templates

### Main Layout
```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="@yield('meta_description', __('seo.default_description'))">
    <meta name="keywords" content="@yield('meta_keywords', __('seo.default_keywords'))">
    <meta property="og:title" content="@yield('og_title', config('app.name'))">
    <meta property="og:description" content="@yield('og_description', __('seo.default_description'))">
    <meta property="og:image" content="@yield('og_image', asset('images/og-image.jpg'))">
    <meta name="theme-color" content="#1a73e8">
    <link rel="canonical" href="{{ url()->current() }}">
    
    <title>@yield('title', config('app.name'))</title>

    {{-- Styles --}}
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="stylesheet" href="{{ asset('css/responsive.css') }}">
    @yield('extra_css')

    {{-- Google Analytics --}}
    @include('components.google-analytics')

    {{-- Google Ads Conversion Tracking --}}
    @include('components.google-ads-tracking')
</head>
<body>
    @include('components.header')

    <main role="main">
        @yield('content')
    </main>

    @include('components.footer')
    @include('components.chat-widget')

    {{-- Scripts --}}
    <script src="{{ asset('js/app.js') }}"></script>
    <script src="{{ asset('js/analytics.js') }}"></script>
    <script src="{{ asset('js/chat.js') }}"></script>
    @yield('extra_js')

    {{-- Livewire (optional for reactive components) --}}
    @livewireScripts
</body>
</html>
```

### Home Page
```blade
{{-- resources/views/pages/home.blade.php --}}
@extends('layouts.app')

@section('title', __('home.title'))
@section('meta_description', __('home.meta_description'))
@section('meta_keywords', __('home.meta_keywords'))

@section('content')
    {{-- Hero Section --}}
    <section class="hero-section">
        <div class="hero-content">
            <h1 class="hero-title">@lang('home.hero_title')</h1>
            <p class="hero-subtitle">@lang('home.hero_subtitle')</p>
            <div class="hero-buttons">
                <a href="#services" class="btn btn-primary">@lang('home.explore_services')</a>
                <a href="{{ route('contact.index') }}" class="btn btn-secondary">@lang('home.get_in_touch')</a>
            </div>
        </div>
        <div class="hero-image">
            <img src="{{ asset('images/hero-bg.jpg') }}" alt="@lang('home.hero_alt')" loading="lazy">
        </div>
    </section>

    {{-- Services Section --}}
    <section id="services" class="services-section">
        <div class="container">
            <h2 class="section-title">@lang('home.our_services')</h2>
            <div class="services-grid">
                @foreach($services as $service)
                    @include('components.service-card', ['service' => $service])
                @endforeach
            </div>
        </div>
    </section>

    {{-- Destinations Section --}}
    <section class="destinations-section">
        <div class="container">
            <h2 class="section-title">@lang('home.destinations')</h2>
            <div class="destinations-grid">
                @foreach($destinations as $destination)
                    <div class="destination-card">
                        <img src="{{ $destination->image_url }}" alt="{{ $destination->name }}" loading="lazy">
                        <div class="destination-content">
                            <h3>{{ $destination->name }}</h3>
                            <p>{{ $destination->headline }}</p>
                            <a href="{{ route('destinations.show', $destination->slug) }}" class="btn btn-link">
                                @lang('home.explore') →
                            </a>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    {{-- Testimonials Section --}}
    <section class="testimonials-section">
        <div class="container">
            <h2 class="section-title">@lang('home.what_clients_say')</h2>
            @include('components.testimonial-carousel', ['testimonials' => $testimonials])
        </div>
    </section>

    {{-- Partners Section --}}
    <section class="partners-section">
        <div class="container">
            <h2 class="section-title">@lang('home.our_partners')</h2>
            <div class="partners-grid">
                @foreach($partners as $partner)
                    <a href="{{ $partner->website_url }}" target="_blank" rel="noopener noreferrer" class="partner-logo">
                        <img src="{{ $partner->logo_url }}" alt="{{ $partner->name }}" loading="lazy">
                    </a>
                @endforeach
            </div>
        </div>
    </section>

    {{-- CTA Section --}}
    <section class="cta-section">
        <div class="container">
            <h2>@lang('home.ready_to_explore')</h2>
            <p>@lang('home.cta_description')</p>
            <a href="{{ route('contact.index') }}" class="btn btn-large">@lang('home.get_started')</a>
        </div>
    </section>

    {{-- Structured Data for SEO --}}
    @include('components.schema-org')
@endsection

@section('extra_css')
    <style>
        .hero-section {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 60px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .hero-content {
            flex: 1;
            max-width: 600px;
        }

        .hero-title {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 20px;
            line-height: 1.2;
        }

        .hero-subtitle {
            font-size: 1.25rem;
            margin-bottom: 30px;
            opacity: 0.9;
        }

        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }

        @media (max-width: 768px) {
            .hero-section {
                flex-direction: column;
                text-align: center;
                padding: 40px 20px;
            }

            .hero-title {
                font-size: 2rem;
            }

            .services-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
@endsection
```

### Service Card Component
```blade
{{-- resources/views/components/service-card.blade.php --}}
<div class="service-card">
    <div class="service-icon">
        <i class="icon-{{ $service->icon }}"></i>
    </div>
    <h3 class="service-title">{{ $service->title }}</h3>
    <p class="service-description">{{ Str::limit($service->description, 150) }}</p>
    
    @if($service->items)
        <ul class="service-items">
            @foreach($service->items as $item)
                <li>{{ $item }}</li>
            @endforeach
        </ul>
    @endif

    <a href="{{ route('services.show', $service->slug) }}" class="btn btn-outline">
        @lang('common.learn_more')
    </a>
</div>

<style>
    .service-card {
        padding: 30px;
        border: 1px solid #ddd;
        border-radius: 8px;
        transition: all 0.3s ease;
        background: white;
    }

    .service-card:hover {
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        transform: translateY(-5px);
    }

    .service-icon {
        font-size: 2.5rem;
        margin-bottom: 15px;
        color: #667eea;
    }

    .service-items {
        list-style: none;
        padding: 0;
        margin: 20px 0;
    }

    .service-items li {
        padding: 8px 0;
        padding-left: 20px;
        position: relative;
    }

    .service-items li:before {
        content: "✓";
        position: absolute;
        left: 0;
        color: #667eea;
        font-weight: bold;
    }
</style>
```

### Chat Widget Component
```blade
{{-- resources/views/components/chat-widget.blade.php --}}
<div id="chat-widget" class="chat-widget">
    <div class="chat-header">
        <h4>@lang('chat.need_help')</h4>
        <button id="chat-close" aria-label="Close chat">&times;</button>
    </div>
    
    <div class="chat-messages" id="chat-messages">
        <div class="chat-welcome">
            <p>@lang('chat.welcome_message')</p>
        </div>
    </div>

    <div class="chat-input-area">
        <form id="chat-form">
            @csrf
            <div class="visitor-info-step" id="visitor-info-step" style="display: none;">
                <input type="text" name="visitor_name" placeholder="@lang('chat.your_name')" required>
                <input type="email" name="visitor_email" placeholder="@lang('chat.your_email')" required>
                <input type="tel" name="visitor_phone" placeholder="@lang('chat.your_phone')">
                <textarea name="message" placeholder="@lang('chat.your_message')" required></textarea>
                <button type="submit" class="btn btn-primary">@lang('chat.send')</button>
            </div>
        </form>
    </div>
</div>

<button id="chat-toggle" class="chat-toggle" aria-label="Open chat">
    <span class="chat-icon">💬</span>
</button>

<style>
    .chat-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 5px 40px rgba(0,0,0,0.16);
        display: flex;
        flex-direction: column;
        z-index: 1000;
        display: none;
    }

    .chat-widget.open {
        display: flex;
    }

    .chat-header {
        background: #667eea;
        color: white;
        padding: 15px;
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
    }

    .chat-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #667eea;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 24px;
        z-index: 999;
    }

    @media (max-width: 480px) {
        .chat-widget {
            width: 100%;
            height: 100vh;
            bottom: 0;
            right: 0;
            border-radius: 0;
        }
    }
</style>

<script>
    document.getElementById('chat-toggle').addEventListener('click', function() {
        document.getElementById('chat-widget').classList.toggle('open');
    });

    document.getElementById('chat-close').addEventListener('click', function() {
        document.getElementById('chat-widget').classList.remove('open');
    });
</script>
```

### Admin Dashboard Template
```blade
{{-- resources/views/admin/dashboard.blade.php --}}
@extends('layouts.admin')

@section('title', 'Admin Dashboard')

@section('content')
    <div class="dashboard-container">
        <h1>@lang('admin.dashboard')</h1>

        {{-- Stats Cards --}}
        <div class="stats-grid">
            <div class="stat-card">
                <h3>@lang('admin.total_contacts')</h3>
                <p class="stat-value">{{ $stats['totalContacts'] }}</p>
            </div>
            <div class="stat-card">
                <h3>@lang('admin.new_contacts')</h3>
                <p class="stat-value">{{ $stats['newContacts'] }}</p>
            </div>
            <div class="stat-card">
                <h3>@lang('admin.active_chats')</h3>
                <p class="stat-value">{{ $stats['activeSessions'] }}</p>
            </div>
            <div class="stat-card">
                <h3>@lang('admin.today_visitors')</h3>
                <p class="stat-value">{{ $stats['todayVisitors'] }}</p>
            </div>
        </div>

        {{-- Charts --}}
        <div class="charts-grid">
            <div class="chart-card">
                <h3>@lang('admin.visitors_chart')</h3>
                <canvas id="visitorsChart"></canvas>
            </div>
            <div class="chart-card">
                <h3>@lang('admin.conversions_chart')</h3>
                <canvas id="conversionChart"></canvas>
            </div>
        </div>

        {{-- Recent Contacts --}}
        <div class="section">
            <h2>@lang('admin.recent_contacts')</h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>@lang('common.name')</th>
                        <th>@lang('common.email')</th>
                        <th>@lang('common.service')</th>
                        <th>@lang('common.status')</th>
                        <th>@lang('common.date')</th>
                        <th>@lang('common.action')</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($recentContacts as $contact)
                        <tr>
                            <td>{{ $contact->name }}</td>
                            <td>{{ $contact->email }}</td>
                            <td>{{ $contact->service_interest }}</td>
                            <td>
                                <span class="badge badge-{{ $contact->status }}">
                                    {{ $contact->status }}
                                </span>
                            </td>
                            <td>{{ $contact->created_at->format('M d, Y') }}</td>
                            <td>
                                <a href="{{ route('admin.contacts.show', $contact->id) }}" class="btn btn-sm">
                                    @lang('common.view')
                                </a>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js@3"></script>
    <script>
        // Visitors Chart
        const visitorsCtx = document.getElementById('visitorsChart').getContext('2d');
        new Chart(visitorsCtx, {
            type: 'line',
            data: {
                labels: @json($visitorsChart['labels']),
                datasets: [{
                    label: 'Visitors',
                    data: @json($visitorsChart['data']),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.3
                }]
            }
        });
    </script>
@endsection
```

---

## Routes & API Endpoints

### Web Routes
```php
// routes/web.php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\{
    HomeController,
    ServiceController,
    DestinationController,
    ContactController,
    ChatController,
    PageController
};

Route::get('/', [HomeController::class, 'index'])->name('home');

// Services
Route::prefix('services')->group(function () {
    Route::get('/', [ServiceController::class, 'index'])->name('services.index');
    Route::get('{service:slug}', [ServiceController::class, 'show'])->name('services.show');
});

// Destinations
Route::prefix('destinations')->group(function () {
    Route::get('/', [DestinationController::class, 'index'])->name('destinations.index');
    Route::get('{destination:slug}', [DestinationController::class, 'show'])->name('destinations.show');
});

// Contact
Route::prefix('contact')->group(function () {
    Route::get('/', [ContactController::class, 'index'])->name('contact.index');
    Route::post('/', [ContactController::class, 'store'])->name('contact.store');
});

// Pages
Route::get('/{page:slug}', [PageController::class, 'show'])->name('pages.show');

// Localization
Route::prefix('{locale}')->where('locale', '[a-z]{2}')->middleware('set.locale')->group(function () {
    Route::get('/', [HomeController::class, 'index']);
    // ... repeat routes
});
```

### API Routes
```php
// routes/api.php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    ChatApiController,
    AnalyticsApiController
};

Route::middleware('api')->prefix('v1')->group(function () {
    // Chat API
    Route::prefix('chat')->group(function () {
        Route::post('start-session', [ChatApiController::class, 'startSession']);
        Route::post('send-message', [ChatApiController::class, 'sendMessage']);
        Route::get('messages/{sessionId}', [ChatApiController::class, 'getMessages']);
    });

    // Analytics API
    Route::prefix('analytics')->group(function () {
        Route::post('track-page-view', [AnalyticsApiController::class, 'trackPageView']);
        Route::post('track-event', [AnalyticsApiController::class, 'trackEvent']);
    });
});
```

### Admin Routes
```php
// routes/admin.php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\{
    DashboardController,
    ContactController,
    ChatController,
    AnalyticsController,
    UserController,
    ServiceController,
    AuthController
};

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');

    // Contacts
    Route::resource('contacts', ContactController::class)
        ->only(['index', 'show', 'update', 'destroy'])
        ->names('admin.contacts');

    // Chat
    Route::resource('chat', ChatController::class)
        ->only(['index', 'show'])
        ->names('admin.chat');
    Route::post('chat/{session}/send-message', [ChatController::class, 'sendMessage'])
        ->name('admin.chat.send-message');
    Route::post('chat/{session}/close', [ChatController::class, 'close'])
        ->name('admin.chat.close');

    // Analytics
    Route::get('analytics', [AnalyticsController::class, 'dashboard'])->name('admin.analytics.dashboard');
    Route::get('analytics/detailed', [AnalyticsController::class, 'detailed'])->name('admin.analytics.detailed');
    Route::get('analytics/export', [AnalyticsController::class, 'export'])->name('admin.analytics.export');

    // Services Management
    Route::resource('services', ServiceController::class)
        ->names('admin.services');

    // Users Management
    Route::resource('users', UserController::class)
        ->names('admin.users');
});

// Auth Routes
Route::middleware('guest')->group(function () {
    Route::get('admin/login', [AuthController::class, 'showLogin'])->name('admin.login');
    Route::post('admin/login', [AuthController::class, 'login']);
});

Route::middleware('auth')->post('admin/logout', [AuthController::class, 'logout'])->name('admin.logout');
```

---

## Authentication & Authorization

### Authentication Setup
```php
// app/Models/User.php - Add authentication guards

// config/auth.php
<?php

return [
    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
        'api' => [
            'driver' => 'token',
            'provider' => 'users',
            'hash' => false,
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_resets',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => 10800,
];
```

### Authorization Middleware
```php
// app/Http/Middleware/IsAdmin.php
<?php

namespace App\Http\Middleware;

use Closure;

class IsAdmin
{
    public function handle($request, Closure $next)
    {
        if (!auth()->check() || !auth()->user()->hasRole('admin')) {
            abort(403, 'Unauthorized access');
        }

        return $next($request);
    }
}

// Register in app/Http/Kernel.php
protected $routeMiddleware = [
    // ...
    'admin' => \App\Http\Middleware\IsAdmin::class,
];
```

### Login Implementation
```php
// app/Http/Controllers/Admin/AuthController.php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('auth.admin-login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        if (Auth::guard('web')->attempt($credentials, $request->boolean('remember'))) {
            $request->user()->recordLogin();
            
            return redirect()->intended(route('admin.dashboard'))
                ->with('success', 'Welcome back!');
        }

        return back()->withErrors(['email' => 'Invalid credentials']);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect(route('admin.login'))->with('success', 'Logged out successfully');
    }
}
```

---

## Multi-Language Implementation

### Language Support Architecture
```php
// config/languages.php
<?php

return [
    'supported' => ['en', 'hi', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'zh', 'tr'],
    'fallback' => 'en',
    'flag_emoji' => [
        'en' => '🇬🇧',
        'hi' => '🇮🇳',
        'ja' => '🇯🇵',
        'ko' => '🇰🇷',
        'fr' => '🇫🇷',
        'de' => '🇩🇪',
        'es' => '🇪🇸',
        'ru' => '🇷🇺',
        'zh' => '🇨🇳',
        'tr' => '🇹🇷',
    ],
];
```

### Translation Model
```php
// app/Models/Translation.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    protected $fillable = ['model_type', 'model_id', 'language_code', 'field_name', 'field_value'];

    public static function translate($modelType, $modelId, $fieldName, $languageCode = null)
    {
        $language = $languageCode ?? app()->getLocale();
        
        return self::where([
            'model_type' => $modelType,
            'model_id' => $modelId,
            'field_name' => $fieldName,
            'language_code' => $language
        ])->value('field_value');
    }
}
```

### Service for Translation
```php
// app/Services/TranslationService.php
<?php

namespace App\Services;

use App\Models\Translation;
use Illuminate\Support\Facades\Cache;

class TranslationService
{
    public function getTranslation($model, $field, $language = null)
    {
        $language = $language ?? app()->getLocale();

        $cacheKey = "translation.{$model->getTable()}.{$model->id}.{$field}.{$language}";
        
        return Cache::remember($cacheKey, 86400, function () use ($model, $field, $language) {
            $translation = Translation::where([
                'model_type' => $model::class,
                'model_id' => $model->id,
                'field_name' => $field,
                'language_code' => $language
            ])->value('field_value');

            return $translation ?? $model->{$field};
        });
    }

    public function saveTranslation($model, $field, $value, $language)
    {
        Translation::updateOrCreate([
            'model_type' => $model::class,
            'model_id' => $model->id,
            'field_name' => $field,
            'language_code' => $language
        ], ['field_value' => $value]);

        Cache::forget("translation.{$model->getTable()}.{$model->id}.{$field}.{$language}");
    }
}
```

### Blade Translation Helper
```blade
{{-- In templates --}}
{{ $service->translate('title') }}
{{ $service->translate('description') }}

{{-- Language Switcher Component --}}
<div class="language-switcher">
    @foreach(config('languages.supported') as $lang)
        <a href="{{ route('locale', ['locale' => $lang]) }}" 
           class="lang-link {{ app()->getLocale() === $lang ? 'active' : '' }}">
            {{ config('languages.flag_emoji')[$lang] }} {{ strtoupper($lang) }}
        </a>
    @endforeach
</div>
```

---

## Live Chat System

### Chat Service
```php
// app/Services/ChatService.php
<?php

namespace App\Services;

use App\Models\ChatSession;
use App\Models\ChatMessage;
use App\Events\ChatMessageSent;
use Illuminate\Support\Str;

class ChatService
{
    public function createSession($visitorId, $pageUrl, $ipAddress, $userAgent)
    {
        $session = ChatSession::create([
            'visitor_id' => $visitorId,
            'page_url' => $pageUrl,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'status' => 'active',
            'location_country' => $this->getCountryFromIp($ipAddress),
            'location_city' => $this->getCityFromIp($ipAddress),
        ]);

        return $session;
    }

    public function addMessage($sessionId, $message, $senderType, $senderName = null, $senderId = null)
    {
        $session = ChatSession::findOrFail($sessionId);

        $message = $session->messages()->create([
            'message' => $message,
            'sender_type' => $senderType,
            'sender_name' => $senderName,
            'sender_id' => $senderId,
            'is_read' => $senderType === 'admin',
        ]);

        $session->increment('message_count');
        $session->update(['last_message_at' => now()]);

        event(new ChatMessageSent($session, $message));

        return $message;
    }

    public function getCountryFromIp($ip)
    {
        // Use MaxMind GeoIP2 or similar service
        // Fallback to "Unknown"
        return 'Unknown';
    }

    public function getCityFromIp($ip)
    {
        return 'Unknown';
    }

    public function assignToAdmin($sessionId, $adminId)
    {
        ChatSession::findOrFail($sessionId)->update(['assigned_admin_id' => $adminId]);
    }

    public function closeSession($sessionId)
    {
        ChatSession::findOrFail($sessionId)->close();
    }

    public function getActiveSessions()
    {
        return ChatSession::where('status', 'active')
            ->latest('last_message_at')
            ->get();
    }
}
```

### Chat Events
```php
// app/Events/ChatMessageSent.php
<?php

namespace App\Events;

use App\Models\ChatSession;
use App\Models\ChatMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatMessageSent implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $session;
    public $message;

    public function __construct(ChatSession $session, ChatMessage $message)
    {
        $this->session = $session;
        $this->message = $message;
    }

    public function broadcastOn()
    {
        return new Channel("chat.session.{$this->session->id}");
    }

    public function broadcastAs()
    {
        return 'message-sent';
    }

    public function broadcastWith()
    {
        return [
            'message' => $this->message,
            'sender_name' => $this->message->sender_name,
        ];
    }
}
```

### Real-time Chat JavaScript
```javascript
// resources/js/chat.js

class ChatWidget {
    constructor() {
        this.sessionId = null;
        this.visitorId = this.getOrCreateVisitorId();
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadStoredSession();
    }

    getOrCreateVisitorId() {
        let visitorId = localStorage.getItem('visitor_id');
        if (!visitorId) {
            visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('visitor_id', visitorId);
        }
        return visitorId;
    }

    startSession() {
        fetch('/api/v1/chat/start-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            },
            body: JSON.stringify({
                visitor_id: this.visitorId,
                page_url: window.location.href,
            })
        })
        .then(r => r.json())
        .then(data => {
            this.sessionId = data.id;
            localStorage.setItem('chat_session_id', this.sessionId);
            this.setupWebSocket();
        });
    }

    sendMessage(message, visitorName = null) {
        if (!this.sessionId) {
            this.startSession();
        }

        fetch('/api/v1/chat/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            },
            body: JSON.stringify({
                session_id: this.sessionId,
                message: message,
                sender_name: visitorName,
            })
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                this.addMessageToUI(message, 'visitor', visitorName);
                this.pollForAdminMessages();
            }
        });
    }

    setupWebSocket() {
        // Using Laravel WebSockets or Pusher
        Echo.channel(`chat.session.${this.sessionId}`)
            .listen('ChatMessageSent', (e) => {
                this.addMessageToUI(e.message.message, e.message.sender_type, e.sender_name);
                this.playNotificationSound();
            });
    }

    pollForAdminMessages() {
        setInterval(() => {
            if (this.sessionId) {
                fetch(`/api/v1/chat/messages/${this.sessionId}`)
                    .then(r => r.json())
                    .then(messages => {
                        messages.forEach(msg => {
                            this.addMessageToUI(msg.message, 'admin', msg.sender_name);
                        });
                    });
            }
        }, 3000);
    }

    addMessageToUI(message, senderType, senderName) {
        const messagesDiv = document.getElementById('chat-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message chat-message-${senderType}`;
        messageEl.innerHTML = `
            <div class="message-sender">${senderName || 'Admin'}</div>
            <div class="message-content">${this.escapeHtml(message)}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        messagesDiv.appendChild(messageEl);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    attachEventListeners() {
        document.getElementById('chat-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.querySelector('input[name="visitor_name"]').value;
            const message = document.querySelector('textarea[name="message"]').value;
            this.sendMessage(message, name);
            document.querySelector('textarea[name="message"]').value = '';
        });
    }

    loadStoredSession() {
        const storedSession = localStorage.getItem('chat_session_id');
        if (storedSession) {
            this.sessionId = storedSession;
            this.setupWebSocket();
        }
    }

    playNotificationSound() {
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(() => {}); // Silently fail if audio can't play
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.chatWidget = new ChatWidget();
});
```

---

## Analytics & Tracking

### Analytics Middleware
```php
// app/Http/Middleware/TrackVisitor.php
<?php

namespace App\Http\Middleware;

use App\Models\VisitorAnalytic;
use App\Services\AnalyticsService;
use Closure;

class TrackVisitor
{
    public function handle($request, Closure $next)
    {
        if ($this->shouldTrack($request)) {
            app(AnalyticsService::class)->trackPageView($request);
        }

        return $next($request);
    }

    private function shouldTrack($request)
    {
        // Don't track admin routes, API routes, etc.
        return !$request->is('admin/*', 'api/*', '*.css', '*.js', '*.woff*');
    }
}
```

### Analytics Service
```php
// app/Services/AnalyticsService.php
<?php

namespace App\Services;

use App\Models\VisitorAnalytic;
use Jenssegers\Agent\Agent;

class AnalyticsService
{
    public function trackPageView($request)
    {
        $agent = new Agent();

        VisitorAnalytic::create([
            'visitor_id' => $this->getVisitorId($request),
            'session_id' => session()->getId(),
            'page_path' => $request->path(),
            'page_title' => '',
            'referrer' => $request->referrer(),
            'utm_source' => $request->query('utm_source'),
            'utm_medium' => $request->query('utm_medium'),
            'utm_campaign' => $request->query('utm_campaign'),
            'utm_term' => $request->query('utm_term'),
            'utm_content' => $request->query('utm_content'),
            'gclid' => $request->query('gclid'),
            'ip_address' => $request->ip(),
            'device_type' => $this->getDeviceType($agent),
            'browser' => $agent->browser(),
            'os' => $agent->platform(),
            'screen_resolution' => $request->header('User-Agent'),
            'language' => $request->getPreferredLanguage(),
        ]);
    }

    private function getVisitorId($request)
    {
        $cookie = $request->cookie('visitor_id');
        if (!$cookie) {
            $visitorId = 'visitor_' . \Str::uuid();
            return $visitorId;
        }
        return $cookie;
    }

    private function getDeviceType($agent)
    {
        if ($agent->isDesktop()) return 'desktop';
        if ($agent->isTablet()) return 'tablet';
        if ($agent->isMobile()) return 'mobile';
        return 'unknown';
    }
}
```

### Google Ads Conversion Tracking
```blade
{{-- resources/views/components/google-ads-tracking.blade.php --}}
@if(env('GOOGLE_ADS_CONVERSION_ID'))
    <script async src="https://www.googletagmanager.com/gtag/js?id={{ env('GOOGLE_ADS_CONVERSION_ID') }}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', '{{ env("GOOGLE_ADS_CONVERSION_ID") }}');

        // Track form submissions as conversions
        document.getElementById('contact-form')?.addEventListener('submit', function() {
            gtag('event', 'conversion', {
                'send_to': '{{ env("GOOGLE_ADS_CONVERSION_ID") }}/{{ env("GOOGLE_ADS_CONVERSION_LABEL") }}'
            });
        });

        // Track page views
        gtag('event', 'page_view', {
            'page_path': window.location.pathname,
            'page_title': document.title,
            'value': 1.0,
            'currency': 'USD'
        });

        // Track gclid from URL
        function getParameterByName(name) {
            const url = new URL(window.location);
            return url.searchParams.get(name);
        }

        const gclid = getParameterByName('gclid');
        if (gclid) {
            localStorage.setItem('gclid', gclid);
            gtag('event', 'page_view', {
                'gclid': gclid
            });
        }
    </script>
@endif
```

---

## SEO Optimization

### SEO Service
```php
// app/Services/SeoService.php
<?php

namespace App\Services;

class SeoService
{
    public function generateMetaTags($page)
    {
        return [
            'title' => $page->seo_title ?? $page->title,
            'description' => $page->seo_description ?? $page->meta_description,
            'keywords' => $page->seo_keywords ?? [],
            'og_title' => $page->title,
            'og_description' => $page->meta_description,
            'og_image' => $page->og_image,
            'canonical_url' => route('pages.show', $page->slug),
        ];
    }

    public function generateStructuredData($model)
    {
        $schema = [
            '@context' => 'https://schema.org',
        ];

        if ($model instanceof \App\Models\Service) {
            $schema['@type'] = 'Service';
            $schema['name'] = $model->title;
            $schema['description'] = $model->description;
            $schema['image'] = $model->image_url;
            $schema['areaServed'] = 'IN';
            $schema['provider'] = [
                '@type' => 'Organization',
                'name' => config('app.name'),
                'url' => config('app.url'),
            ];
        }

        return json_encode($schema);
    }
}
```

### Sitemap Generation
```php
// app/Console/Commands/GenerateSitemap.php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\{Service, Destination, Partner, Page};
use SimpleXMLElement;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';
    protected $description = 'Generate XML sitemap';

    public function handle()
    {
        $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');

        // Homepage
        $this->addUrl($xml, route('home'), 'weekly', 1.0);

        // Services
        Service::published()->each(fn($service) =>
            $this->addUrl($xml, route('services.show', $service->slug), 'monthly', 0.8)
        );

        // Destinations
        Destination::published()->each(fn($dest) =>
            $this->addUrl($xml, route('destinations.show', $dest->slug), 'monthly', 0.8)
        );

        // Pages
        Page::published()->each(fn($page) =>
            $this->addUrl($xml, route('pages.show', $page->slug), 'weekly', 0.7)
        );

        $xml->asXML(public_path('sitemap.xml'));
        $this->info('Sitemap generated successfully');
    }

    private function addUrl($xml, $loc, $changefreq = 'weekly', $priority = 0.5)
    {
        $url = $xml->addChild('url');
        $url->addChild('loc', $loc);
        $url->addChild('lastmod', date('Y-m-d'));
        $url->addChild('changefreq', $changefreq);
        $url->addChild('priority', $priority);
    }
}
```

### Robots.txt
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /*.css$
Disallow: /*.js$

Sitemap: https://sewahospitality.com/sitemap.xml
```

### Meta Tags in Views
```blade
{{-- resources/views/components/seo-head.blade.php --}}
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="{{ $seo['description'] ?? __('seo.default_description') }}">
<meta name="keywords" content="{{ implode(', ', $seo['keywords'] ?? []) }}">
<meta property="og:title" content="{{ $seo['og_title'] ?? config('app.name') }}">
<meta property="og:description" content="{{ $seo['og_description'] ?? __('seo.default_description') }}">
<meta property="og:image" content="{{ $seo['og_image'] ?? asset('images/og-image.jpg') }}">
<meta property="og:type" content="website">
<meta property="og:url" content="{{ request()->url() }}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ $seo['title'] ?? config('app.name') }}">
<meta name="twitter:description" content="{{ $seo['description'] ?? __('seo.default_description') }}">
<meta name="theme-color" content="#1a73e8">
<link rel="canonical" href="{{ $seo['canonical_url'] ?? request()->url() }}">

{{-- Structured Data --}}
@if(isset($structuredData))
    <script type="application/ld+json">
        {!! $structuredData !!}
    </script>
@endif
```

---

## Security Implementation

### CSRF Protection
```php
// Already built into Laravel, enabled in middleware
// app/Http/Middleware/VerifyCsrfToken.php

class VerifyCsrfToken extends Middleware
{
    protected $except = [
        'api/*', // API routes don't need CSRF
    ];
}
```

### Password Hashing
```php
// app/Models/User.php
<?php

namespace App\Models;

use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    // Hash password on create/update
    public static function boot()
    {
        parent::boot();

        self::creating(function ($model) {
            $model->password = Hash::make($model->password);
        });

        self::updating(function ($model) {
            if ($model->isDirty('password')) {
                $model->password = Hash::make($model->password);
            }
        });
    }
}
```

### Rate Limiting
```php
// app/Http/Middleware/RateLimiter.php
<?php

namespace App\Http\Middleware;

use Illuminate\Cache\RateLimiter;

class ThrottleRequests
{
    public function handle($request, Closure $next, $maxAttempts = 60, $decayMinutes = 1)
    {
        $key = $this->resolveRequestSignature($request);

        if ($this->limiter->tooManyAttempts($key, $maxAttempts, $decayMinutes)) {
            throw new ThrottleRequestsException;
        }

        $this->limiter->hit($key, $decayMinutes * 60);

        return $next($request)->header(
            'X-RateLimit-Limit', $maxAttempts
        );
    }
}
```

### Input Validation & Sanitization
```php
// app/Http/Requests/StoreContactRequest.php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255|regex:/^[a-zA-Z\s]+$/',
            'email' => 'required|email:rfc,dns|max:255',
            'phone' => 'nullable|phone:AUTO',
            'nationality' => 'nullable|string|max:100',
            'service_interest' => 'required|in:medical_tourism,luxury_travel,wellness,corporate,weddings,heritage',
            'message' => 'required|string|min:10|max:5000',
        ];
    }

    public function messages()
    {
        return [
            'name.regex' => 'Name can only contain letters and spaces',
            'email.email' => 'Please provide a valid email address',
        ];
    }

    public function sanitized()
    {
        return [
            'name' => trim(strip_tags($this->name)),
            'email' => strtolower(trim($this->email)),
            'message' => trim($this->message),
        ];
    }
}
```

---

## Error Handling & Monitoring

### Exception Handler
```php
// app/Exceptions/Handler.php
<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class Handler extends ExceptionHandler
{
    public function register()
    {
        $this->reportable(function (Exception $e) {
            if (app()->bound('sentry')) {
                app('sentry')->captureException($e);
            }
        });

        $this->renderable(function (NotFoundHttpException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json(['error' => 'Resource not found'], 404);
            }
            return view('errors.404');
        });

        $this->renderable(function (ValidationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json(['errors' => $e->errors()], 422);
            }
        });
    }
}
```

### Sentry Integration for Error Monitoring
```php
// config/sentry.php
<?php

return [
    'dsn' => env('SENTRY_DSN'),
    'environment' => env('APP_ENV'),
    'release' => env('APP_VERSION'),
    'traces_sample_rate' => 0.1,
    'profiles_sample_rate' => 0.1,
];
```

### Application Logging
```php
// app/Logging/CustomFormatter.php
<?php

namespace App\Logging;

use Monolog\Formatter\JsonFormatter;

class CustomFormatter extends JsonFormatter
{
    public function format(array $record)
    {
        $record['context']['user_id'] = auth()->id();
        $record['context']['user_ip'] = request()->ip();
        $record['context']['request_id'] = request()->id();

        return parent::format($record);
    }
}
```

---

## Deployment & DevOps

### Environment Configuration
```env
# .env.example

APP_NAME="SEWA Hospitality"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://sewahospitality.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sewa_prod
DB_USERNAME=sewa_user
DB_PASSWORD=

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_DRIVER=mailgun
MAILGUN_DOMAIN=
MAILGUN_SECRET=

GOOGLE_ADS_CONVERSION_ID=
GOOGLE_ADS_CONVERSION_LABEL=
GOOGLE_ANALYTICS_ID=

SENTRY_DSN=

APP_KEY=
```

### Docker Setup
```dockerfile
# Dockerfile
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    libpq-dev \
    libmcrypt-dev \
    mysql-client

RUN docker-php-ext-install pdo_mysql pdo_pgsql

COPY . /app
WORKDIR /app

RUN composer install

RUN php artisan cache:clear && php artisan config:clear

EXPOSE 9000
CMD ["php-fpm"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - .:/app
    environment:
      - DB_HOST=db
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis

  db:
    image: mysql:8
    environment:
      MYSQL_DATABASE: sewa_prod
      MYSQL_USER: sewa_user
      MYSQL_PASSWORD: secret
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - db_data:/var/lib/mysql

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - .:/app
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app

volumes:
  db_data:
```

### Backup Strategy
```php
// app/Console/Commands/BackupDatabase.php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class BackupDatabase extends Command
{
    protected $signature = 'backup:database';

    public function handle()
    {
        $filename = 'backup_' . Carbon::now()->format('Y-m-d_H-i-s') . '.sql';
        
        $command = sprintf(
            'mysqldump -h %s -u %s -p%s %s | gzip > %s',
            env('DB_HOST'),
            env('DB_USERNAME'),
            env('DB_PASSWORD'),
            env('DB_DATABASE'),
            storage_path('backups/' . $filename)
        );

        exec($command);

        // Upload to S3
        Storage::disk('s3')->put(
            'backups/' . $filename,
            file_get_contents(storage_path('backups/' . $filename))
        );

        // Delete old backups (keep only 30 days)
        $this->deleteOldBackups();

        $this->info('Database backed up successfully');
    }

    private function deleteOldBackups()
    {
        $files = Storage::disk('s3')->files('backups');
        
        foreach ($files as $file) {
            if (Storage::disk('s3')->lastModified($file) < now()->subDays(30)->timestamp) {
                Storage::disk('s3')->delete($file);
            }
        }
    }
}
```

### Scheduled Tasks
```php
// app/Console/Kernel.php
<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule)
    {
        // Backup database daily
        $schedule->command('backup:database')->daily()->at('02:00');

        // Generate sitemap weekly
        $schedule->command('sitemap:generate')->weekly()->sundays()->at('03:00');

        // Generate analytics report
        $schedule->command('analytics:report')->weekly()->mondays()->at('08:00');

        // Clear old logs
        $schedule->command('log:clear')->daily()->at('00:00');

        // Prune closed chat sessions (30 days old)
        $schedule->command('prune:closed-chats')->daily()->at('04:00');

        // Delete old audit logs (6 months)
        $schedule->command('prune:audit-logs')->monthly()->at('05:00');
    }
}
```

### CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, production]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: mysql, redis

      - name: Install dependencies
        run: composer install --no-dev --optimize-autoloader

      - name: Run migrations
        run: php artisan migrate --force

      - name: Run tests
        run: php artisan test

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/sewa
            git pull origin main
            composer install --no-dev
            php artisan migrate --force
            php artisan cache:clear
            php artisan config:clear
```

---

## Testing Strategy

### Unit Tests
```php
// tests/Unit/Services/ChatServiceTest.php
<?php

namespace Tests\Unit\Services;

use PHPUnit\Framework\TestCase;
use App\Services\ChatService;
use App\Models\ChatSession;

class ChatServiceTest extends TestCase
{
    private $chatService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->chatService = app(ChatService::class);
    }

    public function test_create_session()
    {
        $session = $this->chatService->createSession(
            visitorId: 'visitor_123',
            pageUrl: 'https://sewahospitality.com/services',
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0...'
        );

        $this->assertNotNull($session->id);
        $this->assertEquals('visitor_123', $session->visitor_id);
    }

    public function test_add_message()
    {
        $session = ChatSession::factory()->create();

        $message = $this->chatService->addMessage(
            sessionId: $session->id,
            message: 'Hello, I need help',
            senderType: 'visitor',
            senderName: 'John Doe'
        );

        $this->assertNotNull($message->id);
        $this->assertEquals(1, $session->fresh()->message_count);
    }
}
```

### Feature Tests
```php
// tests/Feature/Http/Controllers/Web/ContactControllerTest.php
<?php

namespace Tests\Feature\Http\Controllers\Web;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ContactControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_form_submission()
    {
        $response = $this->post(route('contact.store'), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+91-9876543210',
            'nationality' => 'Indian',
            'service_interest' => 'medical_tourism',
            'message' => 'I am interested in your medical tourism services.',
        ]);

        $response->assertSuccessful();
        $this->assertDatabaseHas('contact_submissions', [
            'email' => 'john@example.com',
        ]);
    }

    public function test_contact_form_validation()
    {
        $response = $this->post(route('contact.store'), [
            'name' => '',
            'email' => 'invalid-email',
        ]);

        $response->assertSessionHasErrors(['name', 'email']);
    }
}
```

### Browser Tests (Optional)
```php
// tests/Browser/ContactFormTest.php
<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ContactFormTest extends DuskTestCase
{
    public function test_fill_and_submit_contact_form()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/contact')
                ->type('name', 'John Doe')
                ->type('email', 'john@example.com')
                ->type('message', 'I need your services')
                ->press('Submit')
                ->assertSee('Thank you for contacting us');
        });
    }
}
```

---

## Production Checklist

### Pre-Deployment
- [ ] All tests passing (`php artisan test`)
- [ ] Code reviewed and approved
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] CDN configured for static assets
- [ ] Email templates tested
- [ ] Error monitoring (Sentry) setup
- [ ] Analytics configured
- [ ] Backup strategy verified

### Deployment Steps
```bash
# 1. Pull latest code
git pull origin production

# 2. Install dependencies
composer install --no-dev --optimize-autoloader

# 3. Clear caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# 4. Run migrations
php artisan migrate --force

# 5. Create backups
php artisan backup:database

# 6. Warm up caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 7. Restart services
systemctl restart php8.2-fpm
systemctl restart nginx
systemctl restart redis-server

# 8. Generate sitemap
php artisan sitemap:generate

# 9. Health check
curl https://sewahospitality.com/health
```

### Post-Deployment Monitoring
- [ ] Monitor error logs (Sentry)
- [ ] Check database performance
- [ ] Verify analytics are tracking
- [ ] Test all key user flows
- [ ] Monitor server resources (CPU, Memory)
- [ ] Verify email delivery
- [ ] Test live chat functionality
- [ ] Check SEO indexing

### Performance Optimization
- [ ] Enable gzip compression
- [ ] Minify CSS/JS
- [ ] Enable browser caching (1 month for assets)
- [ ] Use CDN for images
- [ ] Database query optimization
- [ ] Redis caching configuration
- [ ] Image optimization (WebP, lazy loading)

---

## Appendix A: Database Fallback Strategy

When production database is unavailable, serve fallback data:

```php
// app/Models/Service.php
public static function getOrFallback()
{
    try {
        return self::published()->ordered()->get();
    } catch (\Exception $e) {
        \Log::error('Database error fetching services: ' . $e->getMessage());
        return self::getFallbackData();
    }
}

private static function getFallbackData()
{
    return [
        ['id' => 1, 'title' => 'Medical Tourism', 'slug' => 'medical-tourism', ...],
        // ... more fallback items
    ];
}
```

---

## Appendix B: Multi-Language String Keys

```php
// resources/lang/en/seo.php
return [
    'default_title' => 'SEWA Hospitality - Premium Medical Tourism & Luxury Travel',
    'default_description' => 'Experience world-class medical tourism and luxury travel experiences in India',
    'default_keywords' => 'medical tourism, luxury travel, wellness retreats, India',
];

// resources/lang/hi/seo.php (Hindi)
return [
    'default_title' => 'SEWA होस्पिटालिटी - प्रीमियम मेडिकल टूरिज्म और विलासिता यात्रा',
    'default_description' => 'भारत में विश्व-स्तरीय चिकित्सा पर्यटन और विलासितापूर्ण यात्रा का अनुभव लें',
];
```

---

## Conclusion

This comprehensive Laravel MVC guide provides a complete roadmap for building SEWA Hospitality from development to production. Follow each section systematically, adapt to your specific requirements, and maintain the quality standards outlined throughout this documentation.

**Key Takeaways:**
- Use the provided database schema for proper data organization
- Implement the security measures for user protection
- Leverage the multi-language support for global reach
- Monitor analytics and use chat for customer engagement
- Follow the deployment checklist for smooth production launch
- Regularly backup and test disaster recovery procedures

For questions or clarifications, refer to the corresponding section numbers or consult the Laravel documentation at https://laravel.com/docs

**Last Updated:** January 2024
**Version:** 1.0

-- M3alemConnect Database Schema
-- Run: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS m3alemconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE m3alemconnect;

-- Users table (clients, artisans, admins)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('client', 'artisan', 'admin') NOT NULL DEFAULT 'client',
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  city VARCHAR(100),
  avatar_url VARCHAR(500),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Service categories
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name_fr VARCHAR(100) NOT NULL,
  name_ar VARCHAR(100),
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(10),
  description_fr TEXT,
  artisan_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artisan professional profiles
CREATE TABLE IF NOT EXISTS artisan_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  category_id INT NOT NULL,
  bio_fr TEXT,
  years_experience INT DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  is_available BOOLEAN DEFAULT TRUE,
  is_premium BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  total_jobs INT DEFAULT 0,
  rating_avg DECIMAL(3,2) DEFAULT 0.00,
  rating_count INT DEFAULT 0,
  service_areas VARCHAR(500),
  views_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Portfolio photos
CREATE TABLE IF NOT EXISTS portfolio_photos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  artisan_id INT NOT NULL,
  photo_url VARCHAR(500) NOT NULL,
  caption VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artisan_id) REFERENCES artisan_profiles(id) ON DELETE CASCADE
);

-- Artisan skills/services
CREATE TABLE IF NOT EXISTS artisan_skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  artisan_id INT NOT NULL,
  skill_name VARCHAR(150) NOT NULL,
  FOREIGN KEY (artisan_id) REFERENCES artisan_profiles(id) ON DELETE CASCADE
);

-- Reviews and ratings
CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  artisan_id INT NOT NULL,
  client_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artisan_id) REFERENCES artisan_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_review (artisan_id, client_id)
);

-- Quote requests from clients
CREATE TABLE IF NOT EXISTS quote_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  artisan_id INT NOT NULL,
  client_id INT NOT NULL,
  description TEXT NOT NULL,
  city VARCHAR(100),
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  status ENUM('pending','viewed','responded','accepted','rejected','completed') DEFAULT 'pending',
  artisan_response TEXT,
  artisan_price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (artisan_id) REFERENCES artisan_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration_days INT NOT NULL DEFAULT 30,
  features JSON NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artisan subscriptions
CREATE TABLE IF NOT EXISTS artisan_subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  artisan_id INT NOT NULL,
  plan_id INT NOT NULL,
  starts_at TIMESTAMP NOT NULL,
  ends_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artisan_id) REFERENCES artisan_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- =============================================
-- SEED DATA
-- =============================================

-- Service categories
INSERT IGNORE INTO categories (id, name_fr, name_ar, slug, icon, description_fr) VALUES
(1, 'Plomberie', 'السباكة', 'plomberie', '🔧', 'Réparation et installation de plomberie'),
(2, 'Électricité', 'الكهرباء', 'electricite', '⚡', 'Travaux électriques et installation'),
(3, 'Menuiserie', 'النجارة', 'menuiserie', '🪚', 'Fabrication et réparation de meubles'),
(4, 'Peinture', 'الطلاء', 'peinture', '🎨', 'Peinture intérieure et extérieure'),
(5, 'Maçonnerie', 'البناء', 'maconnerie', '🧱', 'Construction et rénovation'),
(6, 'Réparation appareils', 'إصلاح الأجهزة', 'reparation', '🔨', 'Réparation électroménager'),
(7, 'Déménagement', 'النقل', 'demenagement', '🚛', 'Transport et déménagement'),
(8, 'Nettoyage', 'التنظيف', 'nettoyage', '🧹', 'Nettoyage professionnel');

-- Subscription plans
INSERT IGNORE INTO subscription_plans (id, name, price, duration_days, features) VALUES
(1, 'Gratuit', 0, 30, '["Profil de base","Visible dans la recherche","5 devis par mois","Support par email"]'),
(2, 'Pro', 199, 30, '["Profil mis en avant","Badge Vérifié Pro","Devis illimités","Statistiques du profil","Support prioritaire"]'),
(3, 'Premium', 399, 30, '["Position sponsorisée en tête","Badge Premium","Devis illimités","Statistiques avancées","Support dédié 24/7","Mise en avant catégorie"]');

-- Demo admin user (password: Admin@123)
INSERT IGNORE INTO users (id, email, password_hash, role, first_name, last_name, city, is_verified) VALUES
(1, 'admin@m3alemconnect.ma', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbxHnYpAS', 'admin', 'Admin', 'M3alem', 'Casablanca', TRUE);

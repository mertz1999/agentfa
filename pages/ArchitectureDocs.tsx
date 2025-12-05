
import React from 'react';

const ArchitectureDocs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 text-left" dir="ltr">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Technical Plan & Architecture</h1>
        <p className="text-gray-600 mb-6">
          This document outlines the MVP architecture for the AgentFa (ایجنت فا) platform.
          While this web application simulates the interface, the production system is designed with the following stack.
        </p>

        <h2 className="text-xl font-bold text-gray-800 mt-6 mb-3">1. System Architecture</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li><strong>Frontend:</strong> React + Vite + TypeScript. <strong>Localization:</strong> RTL support + Vazirmatn Font.</li>
            <li><strong>Backend:</strong> Node.js + Express + TypeScript. RESTful API architecture.</li>
            <li><strong>AI Layer:</strong> Integrated Gemini 2.5 Flash for high-speed tasks (Product Chat) and Gemini 3.0 Pro for complex reasoning (Content Gen).</li>
            <li><strong>Database:</strong> PostgreSQL managed via Prisma ORM.</li>
            <li><strong>Integrations:</strong> 
              <ul className="list-circle pl-5 mt-1">
                <li>Webhook listeners for Telegram/Bale/Eitaa bots.</li>
                <li>WooCommerce REST API (v3) for bidirectional product/order sync.</li>
              </ul>
            </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-800 mt-8 mb-3">2. Database Schema (PostgreSQL)</h2>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
{`-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(100),
  bio TEXT,
  avatar_url TEXT
);

-- Stores/Sites Table
CREATE TABLE sites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(100),
  url VARCHAR(255),
  telegram_bot_token VARCHAR(255),
  -- WooCommerce Config
  woocommerce_base_url VARCHAR(255),
  woocommerce_consumer_key VARCHAR(255),
  woocommerce_consumer_secret VARCHAR(255),
  last_sync_at TIMESTAMP
);

-- Products Table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  site_id INTEGER REFERENCES sites(id),
  external_id VARCHAR(100), -- WooCommerce ID
  name VARCHAR(255),
  price DECIMAL(10, 2),
  stock INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  description TEXT,
  short_description TEXT,
  tags TEXT[],
  categories TEXT[],
  last_synced_at TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  site_id INTEGER REFERENCES sites(id),
  external_id VARCHAR(100), -- WooCommerce Order ID
  customer_name VARCHAR(255),
  amount DECIMAL(15, 0),
  status VARCHAR(50), 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Articles
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  site_id INTEGER REFERENCES sites(id),
  title VARCHAR(255),
  content TEXT,
  status VARCHAR(20), 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
        </div>

        <h2 className="text-xl font-bold text-gray-800 mt-8 mb-3">3. API Design (REST)</h2>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
{`POST /api/products/command
  Body: { "command": "قیمت کفش ها را ۱۰ درصد زیاد کن" }
  Response: { "operations": [...], "message": "انجام شد" }

POST /api/integrations/woocommerce/test
  Body: { "baseUrl": "...", "key": "...", "secret": "..." }
  
POST /api/integrations/woocommerce/sync-products
  Response: { "synced_count": 5 }
  
POST /api/integrations/woocommerce/sync-orders
  Response: { "synced_count": 2 }
`}
        </div>

      </div>
    </div>
  );
};

export default ArchitectureDocs;

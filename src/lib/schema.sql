-- Table for Users
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'staff',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table for Reports
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  supervisor TEXT,
  total_revenue REAL DEFAULT 0,
  cars_handled INTEGER DEFAULT 0,
  parking_count INTEGER DEFAULT 0,
  valet_revenue REAL DEFAULT 0,
  notes TEXT,
  detailed_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table for Zaps (Quick Transactions)
CREATE TABLE IF NOT EXISTS zaps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount REAL NOT NULL,
  car_number TEXT,
  hotel_name TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table for Settings
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Table for Shared Reports
CREATE TABLE IF NOT EXISTS shared_reports (
  id TEXT PRIMARY KEY,
  type TEXT,
  config TEXT,
  title TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Initialize default settings
INSERT OR IGNORE INTO settings (key, value) VALUES ('admin_username', 'admin');
INSERT OR IGNORE INTO settings (key, value) VALUES ('admin_password', 'valet2026');

-- Insert dummy admin if not exists
INSERT OR IGNORE INTO users (email, password, name, role) 
VALUES ('admin@valet.com', 'valet2026', 'مدير النظام', 'admin');

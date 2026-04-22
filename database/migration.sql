CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  canteen_id VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  canteen_id VARCHAR(50) NOT NULL,
  item_id INT NOT NULL,
  item_name VARCHAR(150) NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_complaint TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admins (canteen_id, email, password_hash) VALUES
('snackers', 'admin.snackers@college.edu', '$2b$10$16JEhB9WSONkTHEstq93Fe6G1/3Bg5wXN8V2nsqK0I56ZlXBDdqAm'),
('nescafe', 'admin.nescafe@college.edu', '$2b$10$GNcGtLurdC50s.UetuNYdOwJ7j39Nfxf1GnY/Uxdz8.ceUaaz.cii'),
('yadav', 'admin.yadav@college.edu', '$2b$10$uIMyFFySGRHke6ZsWl5QGui/vqIOoCm0CK2K8SQMc1rPsqDnBjA7S'),
('night', 'admin.night@college.edu', '$2b$10$Z7f1Qf2X6HwrElzMti4k6.ihInjNPpSJuXnBmnqqtOId7S.stYsz.'),
('campus', 'admin.campus@college.edu', '$2b$10$Pc.6BRQVV.EBy3679qOT1OttA6HjiuxHEMLVnEwA/wJ45fsjIL7fa');

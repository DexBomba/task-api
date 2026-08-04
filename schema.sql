-- Use your existing database
USE ojt_store;

-- ============================================
-- USERS TABLE (For Authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY unique_user_email (email)
);

-- ============================================
-- ANIMALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS animals (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    numLegs INT NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================
-- TASKS TABLE (If needed from previous project)
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- SAMPLE DATA (Optional - uncomment if needed)
-- ============================================
-- INSERT INTO users (name, email, password_hash) VALUES 
-- ('John Dexter Obut', 'john@example.com', '$2b$12$M0umjjiRpkd6YoeOcDytF.s4C56yYfH8TAH5Wav3AZ3wUR8/UR1Em');

-- INSERT INTO animals (name, numLegs, user_id) VALUES
-- ('BIRD', 2, 1),
-- ('ANT', 6, 1),
-- ('HUMAN', 2, 1);
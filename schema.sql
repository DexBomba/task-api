-- Use your existing database
USE ojt_store;

-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Optional: Sample records (uncomment these if you want initial data)
-- INSERT INTO tasks (title, completed) VALUES
-- ('Learn Node.js', FALSE),
-- ('Connect Express to MySQL', FALSE);
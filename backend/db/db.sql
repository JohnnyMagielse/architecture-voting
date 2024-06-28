CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  date_of_birth DATE NOT NULL,
  image_url VARCHAR(255)
);

INSERT INTO users (email, password, first_name, last_name, address, phone_number, date_of_birth, image_url) VALUES
('demo@hva.nl', '$2a$10$/sZMhA7iRDzNfB5FGohZwugQwtuIagXPeLWaWyn8/Y0t675wGbHce', 'Demo', 'HvA', 'Weteringschans', '020 123456', '1800-01-01', 'https://i.kym-cdn.com/entries/icons/original/000/016/546/hidethepainharold.jpg');

import pool from '../db/db.js';

const User = {
  findByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  create: async (user) => {
    const { email, password, firstName, lastName, address, phoneNumber, dateOfBirth, imageUrl } = user;
    await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, address, phone_number, date_of_birth, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [email, password, firstName, lastName, address, phoneNumber, dateOfBirth, imageUrl]
    );
  }
};

export default User;

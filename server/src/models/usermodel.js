import { db } from "../config/db.js";
export const User = {
  create: (userData, callback) => {
    const { name, email, contact, password } = userData;
    const sql = 'INSERT INTO users (name, email, contact, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, contact, password], callback);
  },

  findByEmail: (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], callback);
  }
};


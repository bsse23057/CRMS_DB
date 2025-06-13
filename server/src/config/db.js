// src/config/db.js
import mysql from 'mysql2';

// ✅ Create connection directly (no need to instantiate mysql)
export const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'asdqwe123#',         // ← change this if needed
  database: 'crime_db'  // ← your DB name
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    return;
  }
  console.log('✅ MySQL Connected');
});

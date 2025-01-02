const sqlite = require('sqlite3').verbose();
const path = require('path');
const log = console.log;

const dbPath = path.join(__dirname, 'local.db');

const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // db.run('DROP TABLE IF EXISTS `db_info`');
    // db.run('DROP TABLE IF EXISTS `apps`');
    // Check if tables exist before creating them

    checkAndCreateTable('apps', `
      CREATE TABLE IF NOT EXISTS \`apps\` (
        \`id\` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        \`app_id\` TEXT NOT NULL,
        \`app_name\` TEXT NOT NULL,
        \`access_key\` TEXT NOT NULL
      )
    `);

    checkAndCreateTable('db_info', `
      CREATE TABLE IF NOT EXISTS \`db_info\` (
        \`id\` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        \`app_id\` TEXT NOT NULL,
        \`host\` TEXT NOT NULL,
        \`port\` TEXT NOT NULL,
        \`user\` TEXT NOT NULL,
        \`password\` TEXT NOT NULL,
        \`database\` TEXT NOT NULL,
        FOREIGN KEY(\`app_id\`) REFERENCES \`apps\`(\`app_id\`) ON DELETE CASCADE
      )
    `);
  }
});

function checkAndCreateTable(tableName, createTableStatement) {
  db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`, (err, row) => {
    if (err) {
      console.error(err.message);
    } else if (!row) {
      // Table doesn't exist, create it
      db.run(createTableStatement, (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`Table '${tableName}' created successfully.`);
        }
      });
    } else {
      console.log(`Table '${tableName}' already exists.`);
    }
  });
}

module.exports = db;
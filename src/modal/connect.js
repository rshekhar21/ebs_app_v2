const mysql = require('mysql2');

class Connect {
  constructor(cs) {
    if (!cs) throw new Error('invalid connection string');
    this.cs = cs;
  }


  async execute(sql, values = []) {
    try {
      return new Promise((resolve, reject) => {
        if (!sql) return reject('invalid request');
        const con = mysql.createConnection(this.cs);
        con.execute(sql, values, (err, result, fields) => {
          if (err) reject(err);
          con.end(); // Close the connection after the query is executed
          resolve(result, fields);
        });
      });
    } catch (error) {
      log(error);
      return 'invalid request';
    }
  }

  async query(sql, values = []) {
    try {
      return new Promise((resolve, reject) => {
        if (!sql) return reject('invalid request');
        const con = mysql.createConnection(this.cs);
        con.query(sql, values, (err, result, fields) => {
          if (err) reject(err);
          con.end(); // Close the connection after the query is executed
          resolve(result, fields);
        });
      });
    } catch (error) {
      log(error);
      return 'invalid request';
    }
  }
}



module.exports = Connect;
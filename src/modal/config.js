const log = console.log;
const path = require('path');
const mysql = require('mysql2');
const fse = require('fs-extra');
const { create, update, views } = require('./fields');

const cs = {
    host: 'myebs.in',
    port: '3306',
    user: 'master',
    password: '269608Raj$',
    database: 'ebs_clients',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
}

const pool = mysql.createPool(cs);
function runSql(sql, values = []) {
    return new Promise(function (resolve, reject) {
        pool.query(sql, values, (err, rows, fields) => {
            if (err) {
                return reject(err.message)
            }
            return resolve(rows, fields)
        })
    })
}

function readQuery(fileName, queryType = 'r') {
    try {
        if (!fileName) throw 'invalid/missing filename';
        let type = queryType === 'r' ? 'read' : 'create';
        let filePath = path.join(__dirname, 'sql', type, fileName + '.sql');
        return fse.readFileSync(filePath, { encoding: 'utf-8', flag: 'r' });
    } catch (error) {
        log('config@37', error);
        return false;
    }
}

function trimValues(obj) {
    //this function trims object values and return an array named values
    try {
        const entity = 1;
        let values = [];
        if (typeof obj === 'object') {
            for (v in obj) {
                if (typeof obj[v] === 'string') {
                    obj[v] = obj[v].trim();
                }
                if (obj[v] === '') obj[v] = null;
            }
            if (!obj.entity) { obj.entity = entity; } // ensure to insert entity
            values.push(obj);
            return values
        } else return false

    } catch (error) {
        log(error);
        return false;
    }
}

function createSqlStmt(table, type = 'c') {
    if (!table) return false;
    let stmt = '';
    // insert statement
    if (type.toLowerCase() == 'c') {
        let stk = create[table];
        let sql = '', val = '';
        for (let k of stk) { sql = sql + '`' + k + '`,'; val = k=='password'? val + 'MD5(?),' : val + '?,' }
        sql = sql.slice(0, -1);
        val = val.slice(0, -1);
        stmt = `INSERT INTO \`${table}\`(${sql}) VALUES(${val})`;
    }

    // update statement
    if (type.toLowerCase() == 'u') {
        let stk = update[table];
        let sql = '';
        for (let k of stk) { if (k != 'id') { sql = sql + '`' + k + '`=?,' } }
        sql = sql.slice(0, -1);  //log(sql)
        stmt = `UPDATE \`${table}\` SET ${sql} WHERE id = ?`;
    }
    return stmt;
}

// createUpdateStmt(`stock`);
function createUpdateStmt(table, obj) {
    try {
        // let obj = { product: 'EBS SERVER', pcode: 'SVR', mrp: '123465', id: '150' } 
        let arr = update['stock']; //log(arr);
        let ar = [];
        for (let k of arr) {
            if (obj[k]) {
                let ox = {};
                ox.key = k;
                ox.value = obj[k];
                ar.push(ox);
            }
        }
        let str = `UPDATE \`${table}\` SET`;
        for (let k of ar) {
            if (k.key != 'id') {
                str += ` \`${k.key}\`='${k.value}',`
            } else {
                str = str.slice(0, -1); //log(str)
                str += ` WHERE \`id\` = ${k.value};`;
            }
        }
        return str;
    } catch (error) {
        log(error);
        return false
    }
}

function sqlDate() {
    let date = new Date;
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`
}





module.exports = { runSql, readQuery, trimValues, createSqlStmt, create, update, views, createUpdateStmt, sqlDate }
const log = console.log;
const config = require('./config');
const { runSql, create, update, views } = require('./config');
const queries = require('./queries');
const connection = require('./connect');
const schema = require('./schema');
const aws = require('./aws');
const sendMail = require('./nodemailer');
const uuid = require('uuid');
const mysql = require('mysql2/promise');
const CryptoJS = require('crypto-js');
const shortid = require('short-uuid');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const jose = require('node-jose');
const JWT_SECRET = 'your_jwt_secret_key';
const restrictions = require('./restrictions'); //log(restrictions);
const { sendEmail } = require('./email');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { error } = require('console');
const db = require('./sqlite');

function querySqlite(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}

showApps({ body: { client_id: 1 } }).then(res => log(res)).catch(err => log(err));

async function showApps(req) {
    try {
        // SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';
        let res = await querySqlite(`select * from apps`); //log('res', res);
        if (res.length == 0) {
            let rsp = await listApps(req); log(rsp);
            // if (rsp.length) {
            //     rsp.forEach(col => {
            //         let sql = `INSERT INTO apps (app_id, app_name, access_key) VALUES (?,?,?);`; //log(sql); 
            //         db.run(sql, [col.app_id, col.trade_name, col.access_key], (err) => {
            //             if (err) log(err);
            //         })
                        let qry = `INSERT INTO db_info (app_id, host, port, user, password, database) VALUES (?,?,?,?,?,?);`; //log(qry);
            //     })
            // }
        }
        db.close();
        return 'ok';
    } catch (error) {
        log(error);
    }
}

async function createEncryptedJWT(payload) {
    const keystore = jose.JWK.createKeyStore();

    // Define the key in JWK format
    const jwkKey = {
        kty: 'oct',                   // Key type: octet (symmetric key)
        k: 'WcTza4v8FzW2yHN2WE+zEdIszpUiaCk+HjBE89rqCKE=', // Base64-encoded key
    };

    try {
        // Add the key to the keystore
        const key = await keystore.add(jwkKey);

        // Create the encrypted JWT
        const encryptedJWT = await jose.JWE.createEncrypt({ format: 'compact' }, key)
            .update(JSON.stringify(payload))
            .final();

        return encryptedJWT;
    } catch (err) {
        console.error('Error creating encrypted JWT:', err);
        throw err;
    }
}

async function decryptEncryptedJWT(encryptedToken) {
    const keystore = jose.JWK.createKeyStore();

    // Define the key in JWK format (same key used for encryption)
    const jwkKey = {
        kty: 'oct',                   // Key type: octet (symmetric key)
        k: 'WcTza4v8FzW2yHN2WE+zEdIszpUiaCk+HjBE89rqCKE=', // Base64-encoded key
    };

    try {
        // Add the key to the keystore
        const key = await keystore.add(jwkKey);

        // Decrypt the JWT
        const decrypted = await jose.JWE.createDecrypt(key).decrypt(encryptedToken);

        // Parse and return the decrypted payload
        return JSON.parse(decrypted.plaintext.toString());
    } catch (err) {
        console.error('Error decrypting JWT:', err);
        throw err;
    }
}

async function remoteCS(app_id) {
    try {
        if (!app_id) throw 'unauthorized access';
        let sql = 'select d.`host`, d.`port`, d.`user`, d.`password`, d.`database` from db_info d join apps a on d.`app_id` = a.`id` where a.`app_id` = ?';
        let res = await runSql(sql, [app_id]);
        return res
    } catch (error) {
        log(error);
        return false
    }
}

async function connectSession(app_id) {
    try {
        let [cnstr] = await remoteCS(app_id); //log(cnstr);
        const token = jwt.sign({ cnstr }, JWT_SECRET, { expiresIn: '365d' }); //log(token);
        return token;
    } catch (error) {
        log(error);
    }
}

async function connectEncypSession(app_id) {
    try {
        let [cnstr] = await remoteCS(app_id); log(cnstr);
        const token = await createEncryptedJWT(cnstr);
        return token;
    } catch (error) {
        log(error);
    }
}

async function loadCnstr(req) {
    try {
        let cnstr = null;
        if (req?.cnstr) {
            const decoded = jwt.verify(req.cnstr, JWT_SECRET);
            cnstr = decoded.cnstr; //log(226, cnstr);
        } else {
            let { ssid } = req.body
            [cnstr] = await remoteCS(ssid); //log(229, cnstr);
        }
        // log(231, cnstr);
        return cnstr;
    } catch (error) {
        log(error);
    }
}

async function loadeCnstr(req) {
    try {
        let cnstr = null;
        let ecnstr = req?.cookies?.ecnstr || req.ecnstr; //log('ecnstr', ecnstr);
        if (ecnstr) {
            const decoded = await decryptEncryptedJWT(ecnstr); //log('decoded', decoded);
            cnstr = decoded;
        } else {
            let { ssid } = req.body
            [cnstr] = await remoteCS(ssid);
        }
        // log(231, cnstr);
        return cnstr;
    } catch (error) {
        log(error);
    }
}

async function loginUser(req) {
    try {
        let { username, password, 'g-recaptcha-response': captcha } = req.body; //log(captcha);
        if (!username) throw 'Username Required';
        if (!password) throw 'Password Required';
        if (!captcha) throw 'Unauthorized Login';
        const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                // secret: '6LfD75IqAAAAAOmbHobyJJyjlOUoFpo9o_ZuL2Do', // localhost Replace with your reCAPTCHA secret key
                secret: '6LfK6JIqAAAAAMheDMHiN_cdI0GrDfPSjg6kczRA', // store.myebs.in Replace with your reCAPTCHA secret key
                response: captcha,
            },
        });
        // log(response.data);
        if (!response.data.success) {
            return res.status(400).json({ status: 'error', message: 'CAPTCHA verification failed.' });
        }
        let sql = 'select `user_id` as `id`, `client_id` from `users` where `username` = ? and `password` = md5(?);';
        let res = await runSql(sql, [username.trim(), password.trim()]);
        return res;
    } catch (error) {
        log(error);
        return false;
    }
}

async function userLogin(req) {
    try {
        let { username, password, ssid } = req.body;
        if (!ssid) throw 'Unauthorized request';
        if (!username) throw 'Username Required';
        if (!password) throw 'Password Required';
        const cnstr = await loadeCnstr(req);
        const remoteQry = new connection(cnstr);
        let sql = "select `id` AS userid, `username`, `user_role` AS userrole from `users` where is_active = 'yes' and `username` = ? and `password` = md5(?);";
        let values = [username, password];
        let [res] = await remoteQry.execute(sql, values);
        return res;
    } catch (error) {
        log(error);
    }
}

async function userResctictions(req) {
    try {
        let { ssid, user, rc } = req.body;
        let username = req.cookies.username;
        if (!rc) throw 'Unauthorized request';
        if (!ssid) throw 'Unauthorized request';
        if (!username) throw 'Username Required';
        if (user !== username) throw 'Invalid Access'
        const cnstr = await loadeCnstr(req);
        const remoteQry = new connection(cnstr);
        let restiction = restrictions[rc];
        let sql = `select ${restiction} from restrictions r join users u on u.id = r.userid where u.username = ?;`;
        let [res] = await remoteQry.execute(sql, [username]);
        return res[restiction];
    } catch (error) {
        log(error);
        return 0;
    }
}

async function listApps(req) {
    try {
        let { client_id } = req.body;
        let qry = "select `id`, `app_id`, `trade_name`, `access_key`, `status`, `port_number` from `apps` where `client_id` = ? AND is_active = 'yes';";
        let sql = "select a.`id`, a.`app_id`, a.`trade_name`, a.`access_key`, d.`host`, d.`port`, d.`user`, d.`password`, d.`database` from `apps` a join `db_info` d on a.`id` = d.`app_id` where a.`client_id` = ? AND a.`is_active` = 'yes';"
        let res = await runSql(sql, [client_id]);
        return res;
    } catch (error) {
        log(error);
        return false;
    }
}

async function appUsersList(req) {
    try {
        let { ssid } = req.body;
        if (!ssid) throw 'Unauthorized request';
        let sql = "SELECT `name`, `username`, `user_role` FROM `users` WHERE `is_active` = 'yes' ORDER BY `id` ASC;";
        const cnstr = await loadeCnstr(req); //log('modal.js 230',cnstr); //return 'ok'
        const remoteQry = new connection(cnstr);
        let res = await remoteQry.execute(sql);
        return res;
    } catch (error) {
        log(error);
    }
}

// testfun().then(res => log()).catch(err => log(err));
// async function testfun() {
//     const cs = {
//         host: 'myebs.in',
//         port: '3306',
//         user: 'sa_demo',
//         password: '269608Raj$',
//         database: 'db_demo'
//     };

//     const conn = await mysql.createConnection(cs);
//     try {

//         const [rows, fields] = await conn.execute('select ?+? as sum', [2, 2]); log(rows)
//         await conn.end();
//     } catch (error) {
//         log(error);
//     }finally{
//         conn.end;
//     }
// }

function setItems(orderid, items) {
    let str = '';
    for (let item of items) {
        let product = item['product'];
        let pcode = item['pcode'] || '';
        product = String(product).replace(/'/g, "\\'");
        if (pcode) pcode = String(pcode).replace(/'/g, "\\'");
        let emp_id = item['emp_id'];
        emp_id = isNaN(emp_id) ? null : emp_id || null;
        str += `('${'orderid'}', '${item['sku']}', '${item['hsn']}', '${item['category']}', '${item['qty']}', '${product}', '${pcode}', '${item['size']}', '${item['unit']}', '${item['price']}', '${item['price']}', ${item['disc'] || null}, ${item['gst'] || null}, ${item['tax'] || null}, ${item['net'] || null}, ${item['total']}, ${emp_id}, ${item['disc_val'] || null}, ${item['disc_per'] || null}, '${1}'),`;
    }
    str = str.slice(0, -1);
    let updatedStr = str.replace(/'orderid'/g, orderid);
    updatedStr = updatedStr.replace(/''/g, null);  //log(updatedStr)
    // let stmt = config.createSqlStmt('sold');
    let qry = 'INSERT INTO `sold`(`order_id`,`sku`,`hsn`, `category`,`qty`,`product`,`pcode`,`size`,`unit`,`mrp`,`price`,`disc`,`gst`,`tax`,`net`,`gross`,`emp_id`,`disc_val`,`disc_per`,`entity`) VALUES';
    let sql = `${qry} ${updatedStr};`;
    return sql;
}

async function createOrder(req) {
    let { ssid, data, ecnstr } = req.body;
    let { order, items, pymts } = data;

    // const [cnstr] = await remoteCS(ssid);
    const cnstr = await loadeCnstr(req);
    const connection = await mysql.createConnection(cnstr);
    try {
        // Start a transaction
        connection.beginTransaction();

        // Insert into orders table
        let [sql, values] = createQuery('orders', order); //log(sql, values)
        const [orderResult] = await connection.execute(sql, values); //log(orderResult);

        const orderId = orderResult.insertId;
        let itmsql = setItems(orderId, items); //log(itmsql);
        let res = await connection.execute(itmsql); //log('items', res);

        // const transformedItems = items.map(item => {
        //     const { total, ...rest } = item; // Extract total and the rest of the fields
        //     return { gross: total, mrp: total, ...rest }; // Create a new object with gross and other fields
        // });

        // Insert into sold table
        // for (const item of transformedItems) {
        //     item.order_id = orderId;
        //     let [sql, values] = createQuery('sold', item); //log(sql, values);
        //     await connection.execute(sql, values);
        // }


        // Insert into payments table
        if (pymts.length) {
            for (const pymt of pymts) {
                pymt.order_id = orderId;
                pymt.pymt_for = 'Sales';
                let [sql, values] = createQuery('payments', pymt); //log(sql, values)
                await connection.execute(sql, values);
            }
        }

        // Commit the transaction
        // log('Order created successfully')
        connection.commit();
        // await ulAWS(orderId)
        return { status: true, orderid: orderId };
    } catch (error) {
        // Rollback the transaction in case of error
        log('Transaction failed, rolled back:', error);
        connection.rollback();
        return false
    } finally {
        connection.end();
    }
}

function createQuery(table, data, type = 'c') {
    try {
        const tbl = schema[table] || table;
        if (!tbl) throw 'Table not found!';
        const kvp = config.trimValues(data);
        if (kvp[0]?.id) kvp[0].id = parseInt(kvp[0].id);
        let values = [];
        const fieldsArr = type === 'c' ? create[tbl] : update[tbl];
        fieldsArr.forEach(f => values.push(kvp[0][f] || null));
        sql = config.createSqlStmt(tbl, type);
        return [sql, values]
    } catch (error) {
        log(error);
    }
}

async function insertRecord(req, type) {
    try {
        let { ssid, data } = req.body; //log(154, data); //return 'ok';
        if (!ssid) throw 'invalid request';
        const { table } = req.params; //log(table);
        // if (req.params.multi) return addMultiStock(req);
        const kvp = config.trimValues(data); //log(kvp); return false;
        if (!table) throw Error('Tablename not found');
        if (kvp[0]?.id) kvp[0].id = parseInt(kvp[0].id);
        let values = [];
        const tbl = schema[table] || table; //log(tbl); return false;
        if (!tbl) throw 'Table not found!';
        const fieldsArr = type === 'c' ? create[tbl] : update[tbl]; //log(164, fieldsArr);
        fieldsArr.forEach(f => values.push(kvp[0][f] || null));
        sql = config.createSqlStmt(tbl, type); //log(sql, values); //return {sql}; //log(sql);
        // const [cnstr] = await remoteCS(ssid);
        const cnstr = await loadeCnstr(req);
        const remoteQry = new connection(cnstr);
        let res = await remoteQry.execute(sql, values);
        return res;
    } catch (error) {
        log(error);
        return false;
    }
}

async function createRecord(req) {
    try {
        return await insertRecord(req, 'c')
    } catch (error) {
        return false
    }
}

async function updateRecord(req) {
    try {
        return await insertRecord(req, 'u')
    } catch (error) {
        return false
    }
}

async function advanceQuery(req) {
    try {
        let { data, ssid } = req.body; //log(req);
        if (!data) throw 'no information found!'
        if (!ssid) throw 'invalid request';
        const key = data?.key;
        if (!key) throw 'no table found!';
        let sql = queries[key] || config.readQuery(key) || null;
        if (!sql) throw 'no information found!';
        const values = data.values || [];
        if (data?.type == 'search') {
            search = data.searchfor; //log(search);
            if (!search) throw 'no search string found'
            sql = sql.replace(/search/gi, '%' + search + '%');
        }
        if (data?.limit) { sql = sql.slice(0, -1) + ` LIMIT ${data.limit};` }

        const entity = data?.eid ?? null;
        if (entity) { values.push('1') }
        const bulk = data?.bulk ?? null;
        if (bulk) { sql = `${sql} ${data.bulkstr};` }
        // const decoded = jwt.verify(req.cnstr, JWT_SECRET); //log(decoded.cnstr);
        // const [cnstr] = await remoteCS(ssid); log(cnstr);
        const cnstr = await loadeCnstr(req); //log('cnstr', cnstr);
        const remoteQry = new connection(cnstr);
        let res = await remoteQry.execute(sql, values);
        return res;
    } catch (error) {
        log('modal@103', error);
        return false;
    }
}

async function localQuery(req) {
    try {
        let { data } = req.body; //log(data);
        if (!data) throw 'no information found!'
        const key = data?.key; //log(key);
        if (!key) throw 'no table found!';
        let sql = queries[key] || config.readQuery(key) || null; //log(sql);
        if (!sql) throw 'no information found!';
        const values = data.values || []; //log(values);
        if (data?.type == 'search') {
            search = data.searchfor; //log(search);
            if (!search) throw 'no search string found'
            sql = sql.replace(/search/gi, '%' + search + '%'); //log(sql);
        }
        const bulk = data?.bulk ?? null;
        if (bulk) { sql = `${sql} ${data.bulkstr};` }

        let res = await runSql(sql, values); //log('res', res);
        return res;
    } catch (error) {
        log(error);
        return false;
    }
}

async function newSKU(ssid) {
    try {
        if (!ssid) throw 'Invalid Request';
        // const [cnstr] = await remoteCS(ssid);
        const cnstr = await loadeCnstr(req);
        const remoteQry = new connection(cnstr);
        let sql = 'SELECT MAX(id) + 1000 AS sku FROM stock;'
        let res = await remoteQry.execute(sql); //log(res);
        let sku = res[0].sku ? res[0].sku : '1001';
        return sku;
    } catch (error) {
        return false
    }
}

async function setClassicSKU(req) {
    try {
        const { ssid, data } = req.body;
        if (!ssid) throw 'Invalid Request';
        const id = data.id;
        if (!id) throw 'Invalid/Missing ID !';
        // const [cnstr] = await remoteCS(ssid);
        const cnstr = await loadeCnstr(req);
        const remoteQry = new connection(cnstr);
        const sku = Number(id) + 1000; //log(sku, id);
        // const sql = "UPDATE `stock` SET `sku` = ? WHERE `id` = ?;";
        const sql = "UPDATE `stock` s LEFT JOIN `sold` l on l.`sku` = s.`sku` SET s.`sku` = ? WHERE s.`id` = ? AND l.`sku` IS NULL;;";
        const res = await remoteQry.execute(sql, [sku, id]); //log(res);
        return res;
    } catch (error) {
        return false;
    }
}

async function bulkEdit(req) {
    try {
        const { ssid, data: db } = req.body;
        let { data, selected } = db;
        if (!ssid) throw 'Invalid Request';
        // const [cnstr] = await remoteCS(ssid);
        const cnstr = await loadeCnstr(req);
        const remoteQry = new connection(cnstr);
        let sql = `UPDATE stock SET ${Object.entries(data)
            .filter(([key, value]) => value !== '') // Include non-blank values
            .map(([key, value]) => {
                // Check if the value is 'del', and set the column to null in that case
                return (value === 'delete') ? `\`${key}\` = NULL` : `\`${key}\` = '${value}'`;
            }).join(', ')} WHERE id IN (${selected.join(',')});`; //log(sql);
        let res = await remoteQry.execute(sql); //log(res);
        return res;
    } catch (error) {
        log(error);
    }
}

function newDynamicSKU(ssid) {
    try {
        if (!ssid) throw 'Invalid Request';
        return Date.now();
    } catch (error) {
        return false;
    }
}

async function newPartyID(req) {
    try {
        let { ssid } = req.body
        if (!ssid) throw 'Invalid Request';
        // const [cnstr] = await remoteCS(ssid);
        const cnstr = await loadeCnstr(req);
        const remoteQry = new connection(cnstr);
        let sql = 'SELECT MAX(id) + 101 as party_id FROM party;'
        let res = await remoteQry.execute(sql);
        let party_id = res.length ? parseInt(res[0].party_id) : 101;
        return party_id;
    } catch (error) {
        return false
    }
}

async function ulAWS(req) {
    try {
        let { folder, orderid, ssid } = req.body; //log(req.body); //return 'ok';
        // let cnstr = req.cnstr;
        let ecnstr = req.cookies.ecnstr; //log('cnstr 516', ecnstr)
        if (!folder) throw 'error';
        let [{ id, order_id }] = await advanceQuery({ ecnstr, body: { ssid, data: { key: 'getorderids', values: [orderid, orderid] } } });
        //log(id, order_id); return 'ok';
        // let id = res.id;
        let data = await Promise.all([
            await advanceQuery({ ecnstr, body: { ssid, data: { key: 'basicorder', values: [id, id] } } }),
            await advanceQuery({ ecnstr, body: { ssid, data: { key: 'viewOrderItemSql', values: [id] } } }),
            await advanceQuery({ ecnstr, body: { ssid, data: { key: 'viewEntity', eid: true } } }),
            await advanceQuery({ ecnstr, body: { ssid, data: { key: 'viewGS', values: [id] } } }),
            await advanceQuery({ ecnstr, body: { ssid, data: { key: 'viewGR', values: [id] } } }),
            await advanceQuery({ ecnstr, body: { ssid, data: { key: 'partyDueBalByorderId', values: [id, id, id] } } }),
            await advanceQuery({ ecnstr, body: { ssid, data: { key: 'settings', eid: true } } }),
            await advanceQuery({ ecnstr, body: { ssid, data: { key: 'thermal', values: [id] } } }),
            await advanceQuery({ ecnstr, body: { ssid, data: { key: 'soldItems', values: [id] } } }),
            // await h.runsql(pymtsSql),
        ]); //log(data); return 'ok';

        let jsonData = {
            orderData: data[0],
            itemsData: data[1],
            entityData: data[2],
            gsData: data[3],
            grData: data[4],
            partyDues: data[5],
            settingsData: data[6],
            thermalitems: data[7],
            soldItems: data[8],
        }; //log(jsonData);
        await aws.uploadFile(folder, order_id, jsonData);
        return jsonData;
    } catch (error) {
        log(error);
        return false;
    }
}

async function dlAWS(req) {
    try {
        let { folder, fileName } = req.body;
        if (!folder) throw 'error';
        let res = await aws.downloadFile(folder, fileName);
        return res;
    } catch (error) {
        return false;
    }
}

async function sendAuthCode(req) {
    try {
        let { email } = req.body;
        if (!email) throw 'Email id is required!';
        let user = req.user; //log(user);
        if (!user.id) throw 'Invalid Access';
        let qry = "SELECT `auth_key_sent` FROM `clients` WHERE `id` = ? AND `email` IS NOT NULL;";
        let [rs] = await runSql(qry, [user.client_id]); //log(rs); return { msg: 'test', status: false };
        if (rs?.auth_key_sent === 1) { return { status: false, msg: 'The Authorization code has been sent to your registered email address.! Please check your inbox, including your spam folder, or you can contact our support team at at service.myebs@gmail.com' } }
        let sql = "SELECT c.auth_key FROM ebs_clients.clients c JOIN ebs_clients.users u ON c.id = u.client_id WHERE c.id = ? AND u.email = ? AND  u.user_id = ? AND  email_verified = 1;"
        let [res] = await runSql(sql, [user.client_id, email, user.id]);
        let mailOptions = {
            from: '"EBS"<service.myebs@gmail.com>',
            to: email,
            subject: 'Authorization Code',
            html: `
            <div style="font-size: 1.2px; line-height: 1.5;">
                <p style="font-size: 14px;">Authorization Code.</p>
                <p style="font-size: 18px; font-weight: bold; color:rgb(48, 48, 48); font-family: Verdana, Geneva, Tahoma, sans-serif;">${res?.auth_key}</p>     
                <p style="font-size: 14px; color: grey;">The authorization code is required to reset or change the admin password for the application. This code is issued only once; therefore, it is essential to keep this email secure.</p>            
            </div>`
        }
        let rsp = await sendMail(mailOptions); log(rsp);
        if (rsp?.msg == 'Email Sent') {
            await runSql("UPDATE `clients` SET auth_key_sent = ? WHERE id = ?;", [true, user.client_id]);
            return { msg: 'Auth Code Send Successfully', status: true, rs: rsp };
        } else {
            return { status: false, msg: 'Could not sent Eail! Please Try later.' }
        }
    } catch (error) {
        log(error);
        return { error };
    }
}

async function restLocalAppAdminPwd(req) {
    try {
        let { username, password, ssid, authkey } = req.body;
        if (!username) throw 'Username Required';
        if (!password) throw 'Password Required';
        let sql = "SELECT id FROM ebs_clients.clients WHERE auth_key = ?;"; // '46e89011-dea7-4dcf-a827-df39076073df';
        let [res] = await runSql(sql, [authkey]); //log(res);
        if (!res?.id) throw 'Invalid Auth Key';

        let qry = "UPDATE users SET password = md5(?) WHERE username = ?;";
        const cnstr = await loadeCnstr(req);
        const remoteQry = new connection(cnstr);
        let rs = await remoteQry.execute(qry, [password, username]); //log(rs);
        return rs;
    } catch (error) {
        log(error);
        return error;
    }
}

async function emailOrder(req) {
    try {
        let { email, link, party, ssid } = req.body;
        if (!ssid) throw 'Unauthorized request';
        if (!email) throw 'Email id is required!';
        let app = req.cookies.app_name;
        const cnstr = await loadeCnstr(req);
        const remoteQry = new connection(cnstr);
        let sql = "SELECT service_email, email_pwd, email_client FROM settings WHERE id = 1;";
        let [res] = await remoteQry.execute(sql);
        if (!res) throw 'Invalid Email Settings';
        let mailOptions = {
            from: `"${app}"<${res.service_email}>`,
            to: email,
            subject: "Order Details",
            html: `
                <body>
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                        <h2>Dear <span
                                style="font-size:2rem; font-family: 'Segoe Print', Tahoma, Geneva, Verdana, sans-serif;color:rgb(64, 67, 224); margin-left: 1rem">${party}</span>
                        </h2 <p style="font-size: 1rem; color: #3a3838;">Thanks for the Visit </p>
                        <p style="font-size: 1rem;  color: #3a3838;">Please find your order details
                            <a href="${link}">here</a>.
                        </p>

                        <p style="font-size:0.9rem;color:#3a3838; margin: 0;">Sincerely</p>
                        <p style="font-size:0.8rem;color:#3a3838; margin: 0;">The ${app} Team</p>

                        <p><i><span style="font-size:10.0pt;color:#3a3838">Please Add <a href="mailto:${res.service_email}"
                                        target="_blank">${res.service_email}</a> in your address book so that mail from us going to
                                    SPAM/JUNK</i></p>

                        <p style="text-align:justify; font-size: 0.8rem; color:#202020;"><span style="color:#3a3838">We commits to
                                Save/Secure/Protect your Detail and will never share it with any other Person/Vendor/Party etc. This
                                info is only to improve our customer services and to use for the customer information system.</span></p>

                        <p style="text-align:justify; font-size: 0.8rem; color:#686868; border-top: 1px solid grey;">
                            This email and any files transmitted with it are confidential and intended solely for the use of the
                            individual or entity to whom they are addressed. If you have received this email in error please notify the
                            system manager. This message contains confidential information and is intended only for the individual
                            named. If you are not the named addressee you should not disseminate, distribute or copy this e-mail. Please
                            notify the sender immediately by e-mail if you have received this e-mail by mistake and delete this e-mail
                            from your system. If you are not the intended recipient you are notified that disclosing, copying,
                            distributing, or taking any action in reliance on the contents of this information is strictly prohibited.
                            The information contained in this mail is propriety and strictly confidential.
                        </p>
                    </div>
                </body>
                `,
        }
        let rsp = await sendEmail(res, mailOptions); //log(rsp);
        return { status: true, res: rsp };
    } catch (error) {
        log(error);
        return error;
    }
}

async function sendActivation(req) {
    try {
        let { email } = req.body;
        if (!email) throw 'Email id is required!';
        let user = req.user; //log(user);
        if (!user.id) throw 'Invalid Access';
        let qry = 'SELECT verify_code, email_verified FROM users WHERE user_id =? AND email = ?;';
        let res = await runSql(qry, [user.id, email]); //log(res);
        if (res[0]?.verify_code) {
            if (res[0].email_verified) {
                return { msg: 'Email is Verified' }
            } else {
                let mailOptions = {
                    from: '"EBS"<service.myebs@gmail.com>',
                    to: email,
                    subject: 'Account Activation',
                    html: `
                    <div style="font-size: 1.2px; line-height: 1.5;">
                        <p style="font-size: 12px;">Enter this code to Activate you Email.</p>
                        <p style="font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 4px; font-family: Verdana, Geneva, Tahoma, sans-serif;">${res[0].verify_code}</p>     
                        <p style="font-size: 10px; color: grey;">This code can be used only once and is valid for 24 hours.</p>            
                    </div>`
                }
                let rs = await sendMail(mailOptions); //log(rs);

                return { msg: 'Verificatin Code has been send again!', status: true, rs };
            }
        } else {
            let verify_code = generate8DigitNumericValue();
            let sql = 'UPDATE users SET email_verified = false, verify_code = ?, email = ? WHERE user_id =?;';
            let res = await runSql(sql, [verify_code, email, user.id]); //log(res);
            if (res?.affectedRows) {
                let mailOptions = {
                    from: '"EBS"<service.myebs@gmail.com>',
                    to: email,
                    subject: 'Account Activation',
                    html: `
                <div style="font-size: 1.2px; line-height: 1.5;">
                    <p style="font-size: 12px;">Enter this code to Activate you Email.</p>
                    <p style="font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 4px; font-family: Verdana, Geneva, Tahoma, sans-serif;">${verify_code}</p>     
                    <p style="font-size: 10px; color: grey;">This code can be used only once and is valid for 24 hours.</p>            
                </div>`
                }
                let rs = await sendMail(mailOptions); //log(rs);
                return { msg: 'An activation code has been send to your Email id !', status: true, rs };
            }
        }
    } catch (error) {
        log(error);
        return { error };
    }
}

async function activateEmail(req) {
    try {
        let { act_code } = req.body;
        if (!act_code) throw 'Activation Code Required to Activate the Account!';
        let sql = "SELECT id, email_verified FROM users WHERE verify_code = ? and user_id = ?;";
        let res = await runSql(sql, [act_code.trim(), req.user.id]);
        if (res[0]?.email_verified) return { msg: 'Email Already Verified' };
        if (res[0]?.id) {
            let sql = 'UPDATE users SET email_verified = true WHERE verify_code = ? AND user_id = ?;';
            let res = await runSql(sql, [act_code.trim(), req.user.id]);
            return { msg: 'Email Varified Successfully ', status: true, res }
        } else {
            throw 'Invalid Activation Code';
        }
    } catch (error) {
        log(error);
        return { error };
    }
}

async function changePassword(req) {
    try {
        let { old_pwd, new_pwd } = req.body;
        if (!old_pwd || !new_pwd) throw 'Existing / New Password missing !';
        if (new_pwd.length < 6) throw 'Password must be 6 Characters Long !';
        let sql = 'UPDATE users SET password = md5(?) WHERE user_id = ? AND password = md5(?);';
        let res = await runSql(sql, [new_pwd, req.user.id, old_pwd]);
        return { status: true, res };
    } catch (error) {
        log(error);
        throw { error };
    }
}

async function register(req) {
    try {
        let { email, password, app_id } = req.body.data; //log(req.body)
        let sql = "select * from apps where app_id = ?;";
        let res = await runSql(sql, [app_id]); //log(res);
        let
        return 'ok';
    } catch (error) {
        log(error);
    }
}

async function getActiveEmail(req) {
    try {
        let sql = 'SELECT email, email_verified FROM users WHERE user_id = ?;';
        let res = await runSql(sql, [req.user.id]);
        return res;
    } catch (error) {
        log(error);
        return { error };
    }
}

async function verifyPassword(req) {
    try {
        let sql = "SELECT id FROM users WHERE user_id = ? and password = md5(?);";
        let [res] = await runSql(sql, [req.user.id, req.body.password]); //log(res, res?.id);
        return res?.id ? true : false;
    } catch (error) {
        log(error);
        return { error };
    }
}

async function sendPasswordResetCode(req) {
    try {
        let { email_id: email } = req.body; //log(email); return 'ok';
        let sql = 'SELECT id FROM users WHERE email = ? AND email_verified = true;';
        let res = await runSql(sql, [email]); //log(res);
        let id = res[0]?.id
        if (id) {
            let sql = "UPDATE users SET user_pwd_reset_code = ? WHERE id = ? AND email = ?";
            let reset_code = generate8DigitNumericValue();
            await runSql(sql, [reset_code, id, email,]);
            let mailOptions = {
                from: '"EBS"<service.myebs@gmail.com>',
                to: email,
                subject: 'Reset Password Code',
                html: `
            <div style="font-size: 1.2px; line-height: 1.5;">
                <p style="font-size: 12px;">Enter this code to reset App Password !</p>
                <p style="font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 4px; font-family: Verdana, Geneva, Tahoma, sans-serif;">${reset_code}</p>     
                <p style="font-size: 10px; color: grey;">This code can be used only once and is valid for 24 hours.</p>            
            </div>`
            }
            await sendMail(mailOptions);
            return { msg: 'You will soon receive a reset code via email.', status: true, };
        } else {
            return { msg: 'Sorry, this email address could not be located in our records.', status: false }
        }
    } catch (error) {
        log(error);
        return { error };
    }
}

async function resetUserPassword(req) {
    try {
        let { resetcode, username, password } = req.body;
        if (!resetcode || !username || !password) throw 'Invalid Details';
        if (password.trim().length < 6) throw 'Password must be 6 characters long';
        let sql = "SELECT id, client_id FROM users WHERE user_pwd_reset_code = ?";
        let rsp = await runSql(sql, [resetcode]);
        if (!rsp.length) throw 'Invalid Reset Code';
        let user_id = rsp[0].id;
        let client_id = rsp[0].client_id;
        // let qry = "UPDATE users u JOIN clients c ON c.id = u.client_id SET u.password = MD5(?) WHERE c.id = ? AND c.user_pwd_reset_code = ? AND u.username = ?;"
        let qry = "UPDATE users SET password = MD5(?) WHERE id =? AND client_id =?;"
        let res = await runSql(qry, [password.trim(), user_id, client_id]);
        if (res?.affectedRows) {
            let sql = "UPDATE users SET user_pwd_reset_code = NULL WHERE id = ?;";
            await runSql(sql, [user_id]);
            return { status: true, msg: 'Password updated successfully !' }
        } else throw 'Sorry could not change the password';
    } catch (error) {
        log(error);
        return { status: false, msg: error || 'Something went wrong, Try again later or contact EBS Support' };
    }
}

function generate8DigitNumericValue() {
    const min = 10000000; // Minimum 8-digit number (10000000)
    const max = 99999999; // Maximum 8-digit number (99999999)

    // Generate a random number within the specified range
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomNumber.toString(); // Convert the number to a string
}

function uniqueKey(n = 8) {
    // Define all possible characters for the password
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let password = '';

    // Loop to generate 8 random characters
    for (let i = 0; i < n; i++) {
        // Generate a random index to select a character from the `characters` string
        const randomIndex = Math.floor(Math.random() * characters.length);
        // Append the randomly selected character to the password
        password += characters[randomIndex];
    }

    return password;
}

function encrypt(req) {
    try {
        let { key } = req.body;
        if (!key) return false;
        const encrypted = CryptoJS.AES.encrypt(key, 'my secreat key').toString();
        return Buffer.from(encrypted).toString('base64');
    } catch (error) {
        log(error);
    }
}

function decrypt(encrypted) {
    try {
        const encryptedText = Buffer.from(encrypted, 'base64').toString();
        const bytes = CryptoJS.AES.decrypt(encryptedText, 'my secreat key');
        const originalUrl = bytes.toString(CryptoJS.enc.Utf8);
        return originalUrl;
    } catch (error) {
        log(error);
    }
}

async function resetSchema(req) {
    try {
        log(req.body);
        let data = {
            username: '',
            passwrod: '',
            database: '',
        }
        let res = await axios.post('http://localhost:3500/api/reset/schema', data); log(res.data);
    } catch (error) {
        return false;
    }
}
// log(path.join(__dirname, 'uploads'));


async function importPartys(req) {
    try {
        const { ssid, filename } = req.body; //log(ssid);
        if (!ssid) throw 'Unauthorized request';
        const filePath = path.join(__dirname, '..', 'folder', filename);
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const pd = JSON.parse(jsonData); //log(pd[0]);
        if (!pd.length) throw 'No Data found';
        const cnstr = await loadeCnstr(req);
        req.body.cnstr = cnstr;
        let rsp = await config.bulkInsertParty(req); //log(rsp);
        fs.unlinkSync(filePath);
        return { status: true, msg: 'Partys Imported Successfully' };
    } catch (error) {
        log(error);
        return error;
    }
}

// testfunction().then(res => log()).catch(err => log(err));



async function testfunction(cnstr) {
    try {
        let sql = 'select max(id) id from party;'; //log(sql);
        const mysql = require('mysql2');
        const pool = mysql.createPool(cnstr); //log(pool)
        function runQry(sql, values = []) {
            return new Promise(function (resolve, reject) {
                pool.query(sql, values, (err, rows, fields) => {
                    if (err) {
                        return reject(err.message)
                    }
                    return resolve(rows, fields)
                })
            })
        }
        let res = await runQry(sql); log(res);
        // const con = await mysql.createConnection(cnstr);
        // const [results, fields] = await con.query(sql); log(results);
    } catch (error) {
        log(error);
    }
}

module.exports = {
    loginUser,
    userLogin,
    listApps,
    advanceQuery,
    localQuery,
    createRecord,
    updateRecord,
    newSKU,
    newDynamicSKU,
    setClassicSKU,
    newPartyID,
    ulAWS,
    dlAWS,
    sendActivation,
    activateEmail,
    changePassword,
    register,
    getActiveEmail,
    sendPasswordResetCode,
    resetUserPassword,
    createOrder,
    encrypt,
    bulkEdit,
    resetSchema,
    connectSession,
    appUsersList,
    verifyPassword,
    sendAuthCode,
    restLocalAppAdminPwd,
    createEncryptedJWT,
    decryptEncryptedJWT,
    connectEncypSession,
    userResctictions,
    emailOrder,
    importPartys,
    showApps,
}



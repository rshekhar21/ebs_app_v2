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


async function loginUser(req) {
    try {
        let { username, password } = req.body;
        if (!username) throw 'Username Required';
        if (!password) throw 'Password Required';
        let sql = 'select `user_id` as `id`, `client_id` from `users` where `username` = ? and `password` = md5(?);';
        let res = await runSql(sql, [username.trim(), password.trim()]);
        return res;
    } catch (error) {
        log(error);
        return false;
    }
}

async function listApps(req) {
    try {
        let { client_id } = req.body;
        let sql = "select `id`, `app_id`, `trade_name`, `access_key`, `status`, `port_number` from `apps` where `client_id` = ?;";
        let res = await runSql(sql, [client_id]);
        return res;
    } catch (error) {
        log(error);
        return false;
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
    let { ssid, data } = req.body;
    let { order, items, pymts } = data;

    const [cnstr] = await remoteCS(ssid);
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
        const [cnstr] = await remoteCS(ssid);
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
        let { data, ssid } = req.body; //log(req.body);
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

        const [cnstr] = await remoteCS(ssid); //log(cnstr);
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

async function remoteCS(app_id) {
    try {
        if (!app_id) throw 'unauthorized access';
        let sql = 'select d.`host`, d.`port`, d.`user`, d.`password`, d.`database` from db_info d join apps a on d.`app_id` = a.`id` where a.`app_id` =?';
        return await runSql(sql, [app_id]);
    } catch (error) {
        log(error);
        return false
    }
}

async function newSKU(ssid) {
    try {
        if (!ssid) throw 'Invalid Request';
        const [cnstr] = await remoteCS(ssid);
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
        const [cnstr] = await remoteCS(ssid);
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
        const [cnstr] = await remoteCS(ssid);
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
// let sku = newDynamicSKU('abcd'); log(sku);

async function newPartyID(ssid) {
    try {
        if (!ssid) throw 'Invalid Request';
        const [cnstr] = await remoteCS(ssid);
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
        if (!folder) throw 'error';
        let [{ id, order_id }] = await advanceQuery({ body: { ssid, data: { key: 'getorderids', values: [orderid, orderid] } } }); //log(id, order_id); return 'ok';
        // let id = res.id;
        let data = await Promise.all([
            await advanceQuery({ body: { ssid, data: { key: 'basicorder', values: [id, id] } } }),
            await advanceQuery({ body: { ssid, data: { key: 'viewOrderItemSql', values: [id] } } }),
            await advanceQuery({ body: { ssid, data: { key: 'viewEntity', eid: true } } }),
            await advanceQuery({ body: { ssid, data: { key: 'viewGS', values: [id] } } }),
            await advanceQuery({ body: { ssid, data: { key: 'viewGR', values: [id] } } }),
            await advanceQuery({ body: { ssid, data: { key: 'partyDueBalByorderId', values: [id, id, id] } } }),
            await advanceQuery({ body: { ssid, data: { key: 'settings', eid: true } } }),
            await advanceQuery({ body: { ssid, data: { key: 'thermal', values: [id] } } }),
            await advanceQuery({ body: { ssid, data: { key: 'soldItems', values: [id] } } }),
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

async function resetSchema(req){
    try {
        log( req.body );
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

// console.log(CryptoJS.MD5('VTJGc2RHVmtYMTlFMWUzUWRsWkpWUlRoWjRYUWxtMWplZXZ6N2FCdnY5dEIrNm5IWmlqUWFhbHJMbDg3UVdqRXlvRnZsS3Ird1RNQnpWWGlDNWpHQXc9PQ==').toString());

// console.log(decrypt('VTJGc2RHVmtYMTlFMWUzUWRsWkpWUlRoWjRYUWxtMWplZXZ6N2FCdnY5dEIrNm5IWmlqUWFhbHJMbDg3UVdqRXlvRnZsS3Ird1RNQnpWWGlDNWpHQXc9PQ=='))


module.exports = {
    loginUser,
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
    resetSchema
}



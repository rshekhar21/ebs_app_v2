const jwt = require('jsonwebtoken');
const secreatKey = 'ILoveIndia';
const modal = require('../modal/modal');
const config = require('../modal/config');
const log = console.log;
const maxAge = 1000 * 60 * 60 * 24 * 365 //milliseconds * seconds * minutes * hours * days * weeks * months


const createToken = (user) => {
    if (user) {
        return jwt.sign(user, secreatKey, { expiresIn: '365d' })
    } else return null;
}

const verifyToken = (token) => {
    let decodedToken = null;
    if (token) {
        jwt.verify(token, secreatKey, (err, decoded) => {
            if (err) {
                decodedToken = null
            } else {
                decodedToken = decoded
            }
        })
    }
    return decodedToken;
}

async function authorizeUser(req, res) {
    try {
        let rsp = await modal.loginUser(req);
        if (rsp.length > 0) {
            let user = rsp[0];
            const accessToken = createToken(user)
            if (accessToken) {
                res.clearCookie('EBSToken');
                res.cookie('EBSToken', accessToken, { httpOnly: true, maxAge });
                return res.json(true)
            } else {
                throw error
            }
        } else {
            res.json({ 'status': 'error', 'message': 'invalid credentials' })
        }
    } catch (error) {
        res.json(error)
    }
}

function setapp(req, res, next) {
    const url = req.path;
    if (req.user) {
        if (url == '/setapp') {
            let { app_id, trade } = req.body;
            if (app_id) {
                let store_id = app_id.substring(0,8);
                res.cookie('app_id', app_id, { httpOnly: true, maxAge });
                res.cookie('app_name', trade, { maxAge });
                res.cookie('store_id', store_id, { maxAge }); 
                res.json(true);
            } else {
                res.json(false);
            }
        }

        next();

    } else return res.redirect('/');
}

function authenticateToken(req, res, next) {
    // log(72, req.path)
    const token = req.cookies.EBSToken; //log(token) // Assuming token is stored in a cookie
    if (!token) {
        // No token found, user is not authenticated
        return next();
    }

    jwt.verify(token, secreatKey, (err, decoded) => {
        if (err) {
            // Token is invalid
            return next();
        }
        // Valid token, store user information in request object
        req.user = decoded;
        req.body.client_id = decoded.client_id;
        res.cookie('user_id', req.user.id, { maxAge });
        let app_id = req.cookies.app_id;
        let app_name = req.cookies.app_name;
        if (app_id) req.body.ssid = app_id;
        if (app_name) req.body.app_name = app_name;
        next();
    });
}

function checkLogin(req, res, next) {
    if (!req.user) return res.redirect('/');
    next();
}

function authenticate(req, res, next) {
    try { 
        if (req.user) {
            let { ssid, app_name } = req.body; //log(ssid);
            if (!ssid) { return res.redirect('/apps') };

            if (app_name) res.locals.trade = app_name;
            next();
        } else return res.redirect('/');
    } catch (error) {
        log(error);
    }
}

function listApps(req, res, next) {
    try {
        let url = req.path;
        if (!req.user) { return res.json(false); }
        next();
    } catch (error) {
        log(error);
        next();
    }
}

function logout(req, res) {
    res.clearCookie('EBSToken');
    res.clearCookie('client_id')
    res.clearCookie('app_id')
    res.clearCookie('app_name')
    res.clearCookie('user_id')
    res.redirect('/')
}

async function sanatizeData(req, res, next) {
    try {
        const url = req.path;
        if (url === '/api/crud/create/stock') {
            if (!req.body.data.product) throw 'Column product cannot be blank'
            // let sku = await modal.newSKU(req.body.ssid);
            let sku = modal.newDynamicSKU(req.body.ssid); //log(sku);
            if (!sku) { return res.end('Invalid SKU') }
            req.body.data.sku = sku;
        };

        if (url === '/api/crud/create/party') {
            if (!req.body.data.party_name) throw 'Party Name cannot be blank !';
            let party_id = await modal.newPartyID(req.body.ssid);
            if (!party_id) { return res.end('Invalid Details') }
            if(!req.body.data.reg_date) req.body.data.reg_date = config.sqlDate();
            req.body.data.party_id = party_id;
        }

        if(url==='/api/crud/create/payments'){
            // if(!req.body.data.party) throw 'party is Required to Add Payment';
            if(!req.body.data.amount) throw 'Payment Amount Cannot be Empyt';
            if(!req.body.data.pymt_date) req.body.data.pymt_date = config.sqlDate();
        }               

        next();
    } catch (error) {
        log(error);
        res.end(error);
    }
}


module.exports = {
    authorizeUser, setapp, logout, authenticate, authenticateToken, sanatizeData, listApps, checkLogin
}
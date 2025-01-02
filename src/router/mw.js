const jwt = require('jsonwebtoken');
const secretKey = 'ILoveIndia';// 'ILoveIndia';
const modal = require('../modal/modal');
const config = require('../modal/config');
const log = console.log;
const maxAge = 1000 * 60 * 60 * 24 * 365 //milliseconds * seconds * minutes * hours * days * weeks * months
const verifiedUsers = new Map(); // Store verified users temporarily


const createToken = (user) => {
    if (user) {
        return jwt.sign(user, secretKey, { expiresIn: '365d' })
    } else return null;
}

const verifyToken = (token) => {
    let decodedToken = null;
    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
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

async function authorizeAppUser(req, res) {
    try {
        let rsp = await modal.userLogin(req);
        if (!rsp) return res.json({ status: false, msg: 'Invalid/Missing Details!' });
        let { username } = rsp;
        const encryptedToken = await modal.createEncryptedJWT(rsp);
        // const decryptedPayload = await modal.decryptEncryptedJWT(encryptedToken); log(decryptedPayload);
        res.cookie('username', username, { maxAge });
        res.cookie('userrole', encryptedToken, {
            httpOnly: true, // Prevent client-side access
            // secure: true,   // Ensure transmission over HTTPS
            sameSite: 'Strict', // Prevent CSRF
            maxAge
        });
        return res.json({ status: true, msg: '' })
    } catch (error) {
        log(error);
        res.json(error);
    }
}

async function isAdmin(req, res, next) {
    try {
        if (!req.user) return res.redirect('/');
        const userrole = req.cookies.userrole;
        if (!userrole) return res.redirect('/login');
        const decryptedPayload = await modal.decryptEncryptedJWT(userrole);
        return res.json(decryptedPayload.userrole === 'admin');
    } catch (error) {
        log(error);
    }
}

async function setapp(req, res, next) {
    const url = req.path;
    if (req.user) {
        if (url == '/setapp') {
            let { app_id, trade } = req.body;
            if (app_id) {
                let store_id = app_id.substring(0, 8);
                let cnstrToken = await modal.connectSession(app_id);
                let encypToken = await modal.connectEncypSession(app_id); log('encypToken', encypToken);
                res.cookie('app_id', app_id, { httpOnly: true, maxAge });
                res.cookie('app_name', trade, { maxAge });
                res.cookie('store_id', store_id, { maxAge });
                // res.cookie('cnstr', cnstrToken, { httpOnly: true, maxAge });
                res.cookie('ecnstr', encypToken, { httpOnly: true, maxAge, sameSite: 'Strict' });
                res.json(true);
            } else {
                res.json(false);
            }
        }

        next();

    } else return res.redirect('/');
}

function authenticateToken(req, res, next) {
    const token = req.cookies.EBSToken; //log(token) // Assuming token is stored in a cookie
    if (!token) {
        // No token found, user is not authenticated
        // log('no token found');
        return next();
    }
    // log('token found');
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            // Token is invalid
            return next();
        }
        // Valid token, store user information in request object
        req.user = decoded;
        req.cnstr = req.cookies.cnstr;
        req.body.client_id = decoded.client_id;
        res.cookie('user_id', req.user.id, { maxAge });
        let app_id = req.cookies.app_id;
        let app_name = req.cookies.app_name;
        if (app_id) req.body.ssid = app_id;
        if (app_name) req.body.app_name = app_name;
        next();
    });
}

function isLoggedIn(req, res, next) {
    if (!req.user) return res.redirect('/');
    if (req.cookies.username) return res.redirect('/apps/app');
    next();
}

function authenticate(req, res, next) {
    try {
        if (req.user) {
            let { ssid, app_name } = req.body; //log(ssid);
            if (!ssid) { return res.redirect('/apps') };
            if (!req.cookies.username) { return res.redirect('/login') }
            if (app_name) res.locals.trade = app_name;
            next();
        } else return res.redirect('/');
    } catch (error) {
        log(error);
    }
}

function authorize(req, res, next) {
    try {
        if (req.user) {
            let { ssid, app_name, username } = req.body; //log(ssid);
            if (!ssid) { return res.redirect('/apps') };
            if (!username) { return res.redirect('/login') }
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

function log_out(req, res) {
    res.clearCookie('username');
    res.clearCookie('userrole');
    res.redirect('/login')
}

function toTitleCaseIfLowerCase(str) {
    if (str === str.toLowerCase()) {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return str;
}

async function sanatizeData(req, res, next) {
    try {
        const url = req.path;
        if (url === '/api/crud/create/stock') {
            if (!req.body.data.product) throw 'Column product cannot be blank'
            // let sku = await modal.newSKU(req);
            let sku = modal.newDynamicSKU(req.body.ssid); //log(sku);
            if (!sku) { return res.end('Invalid SKU') }
            req.body.data.sku = sku;
        };

        if (url === '/api/crud/create/party') {
            if (!req.body.data.party_name) throw 'Party Name cannot be blank !';
            let party_id = await modal.newPartyID(req);
            if (!party_id) { return res.end('Invalid Details') }
            if (!req.body.data.reg_date) req.body.data.reg_date = config.sqlDate();
            let party_name = toTitleCaseIfLowerCase(req.body.data.party_name);
            if (req.body.data.email) req.body.data.email = req.body.data.email.toLowerCase();
            req.body.data.party_name = party_name;
            req.body.data.party_id = party_id;
        }

        if (url === '/api/crud/create/payments') {
            // if(!req.body.data.party) throw 'party is Required to Add Payment';
            if (!req.body.data.amount) throw 'Payment Amount Cannot be Empyt';
            if (!req.body.data.pymt_date) req.body.data.pymt_date = config.sqlDate();
        }

        next();
    } catch (error) {
        log(error);
        res.end(error);
    }
}

const isPasswordVerified = (req, res, next) => {
    const userId = req.user.id;
    const expiration = verifiedUsers.get(userId);
    if (expiration && Date.now() < expiration) {
        return next();
    }
    // Remove expired verification
    verifiedUsers.delete(userId);
    res.redirect('/apps');
};

async function vefifyPassword(req, res, next) {
    const { password } = req.body;
    let match = await modal.verifyPassword(req);
    let userId = req.user.id;
    if (match) {
        verifiedUsers.set(userId, Date.now() + 10 * 60 * 1000); // 10 minutes expiry
        // return res.redirect('/settings');
        res.json(true);
    }
    next();
}


module.exports = {
    authorizeUser, authorizeAppUser, setapp, logout, log_out, authenticate, authenticateToken, sanatizeData, listApps, isLoggedIn, authorize, vefifyPassword, isPasswordVerified, isAdmin
}
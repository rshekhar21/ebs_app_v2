const log = console.log;
const path = require('path');
const express = require('express');
const router = express.Router();
const mw = require('./mw');
const ctrl = require('../modal/controller');
const upload = require('./multer');

// USE
router.use('/', mw.authenticateToken);

// RENDER
router.get('/', (req, res) => { if (req.user) { return res.redirect('/apps') } res.render('index') });
router.get('/apps', mw.isLoggedIn, (req, res) => res.render('apps'));
router.get('/login', mw.isLoggedIn, (req, res) => { res.render('login') });
router.get('/apps/*', mw.authenticate);
router.get('/apps/app', (req, res) => { res.render('home') });
router.get('/apps/app/orders/create/:xyx?', (req, res) => { res.render(`order`) });
router.get('/apps/app/:url', (req, res) => { res.locals.script = req.params.url, res.render(`page`) });
router.get('/apps/order/:page', (req, res) => { res.render(`view/${req.params.page}`) });
router.get('/ebs/:blank?', (req, res) => res.render('blank'));
router.get('/settings', mw.isLoggedIn, mw.isPasswordVerified, (req, res) => { res.render('settings') });
router.get('/view/order/format/:format', mw.authenticate, (req, res) => { res.render(`view/${req.params.format}`) });

// GET
router.get('/showapps', ctrl.showApps);
router.get('/listapps', mw.listApps, ctrl.listApps);
router.get('/users-list', mw.isLoggedIn, ctrl.appUsersList);
router.get('/active-email', ctrl.getActiveEmail);
router.get('/apps/is-admin', mw.isAdmin);
router.get('/apps/user-roles');

router.get('/log-out', mw.logout);
router.get('/logout', mw.log_out);

router.get('/test', (req, res) => {
    const data = {
        product: "TSHIRT",
        size: null,  // Ensure null is sent as null
        unit: "PCS",
        price: "800.00",
        qty: "1.000",
        disc: null,
        tax: "40.00",
        gst: "5.00",
        amount: "840.00",
        disc_val: null,
        disc_per: null
    };
    res.json(data);  // Send data as JSON
})

// Catch-all route for any other GET requests
router.get('*', (req, res) => {
    res.redirect('/'); // Redirect to the home page
});

// POST
router.post('/login', mw.authorizeUser);
router.post('/app-login', mw.authorizeAppUser);
router.post('/setapp', mw.setapp);
router.post('/register', ctrl.register);
router.post('/api/*', mw.authenticate);
router.post('/api/localquery', ctrl.localQuery);
router.post('/api/advancequery', ctrl.advanceQuery);
router.post('/api/set-classic-sku', ctrl.setClassicSKU);
router.post('/api/crud/create/:table/:multi?', mw.sanatizeData, ctrl.createRecord);
router.post('/api/crud/update/:table', ctrl.updateRecord);
router.post('/api/create/order', ctrl.createOrder);
router.post('/api/update/pwd', ctrl.changePassword);
router.post('/api/encrypt', ctrl.encrypt);
router.post('/aws/upload', ctrl.ulAWS)
router.post('/aws/download', ctrl.dlAWS)
router.post('/api/bulk-edit', ctrl.bulkEdit);
router.post('/api/reset/schema', ctrl.resetSchema);
router.post('/api/email/order', ctrl.emailOrder);
router.post('/getuserpwdresetcode', ctrl.sendPasswordResetCode);
router.post('/reset-user-password', ctrl.resetUserPassword);
router.post('/verify-password', mw.isLoggedIn, mw.vefifyPassword);
router.post('/email', mw.isLoggedIn, ctrl.sendActivation);
router.post('/email/activate', mw.isLoggedIn, ctrl.activateEmail);
router.post('/email/send-authcode', mw.isLoggedIn, ctrl.sendAuthCode);
router.post('/rest-admin-pwd', mw.isLoggedIn, ctrl.restLocalAppAdminPwd);
router.post('/apps/user-restriction', ctrl.userResctictions);
// router.post('/api/upload/partys', function (req, res, next) { req.ebs = req.body, next() }, upload.single('file'), ctrl.importPartys);
router.post('/api/import/partys', ctrl.importPartys)
router.post('/api/upload/file', upload.single('file'), (req, res) => {
    if (!req.filename) { return res.json({ status: false, message: 'No file uploaded' }) }
    res.json({ status: true, filename: req.filename, message: 'File uploaded successfully' })
});





module.exports = router;
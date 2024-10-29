const log = console.log;
const path = require('path');
const express = require('express');
const router = express.Router();
const mw = require('./mw');

const ctrl = require('../modal/controller');

// USE
router.use('/', mw.authenticateToken);

// RENDER
router.get('/', (req, res) => { if (req.user) { return res.redirect('/apps') } res.render('index') });
router.get('/apps', mw.checkLogin, (req, res) => res.render('apps'));
router.get('/ebs/:blank?', (req, res)=>res.render('blank'));
router.get('/apps/app', mw.authenticate, (req, res) => { res.render('home') });
router.get('/apps/app/orders/create/:xyx?', (req, res) => { res.render(`order`) });
router.get('/apps/app/:url', mw.authenticate, (req, res) => { res.locals.script = req.params.url, res.render(`page`) });
router.get('/apps/order/:page', mw.authenticate, (req, res) => { res.render(`view/${req.params.page}`) });
router.get('/settings', mw.checkLogin, (req, res) => { res.render('settings') });
router.get('/view/order/format/:format', mw.authenticate, (req, res)=>{ res.render(`view/${req.params.format}`)})
// GET
router.get('/listapps', mw.listApps, ctrl.listApps);
router.get('/active-email', mw.authenticate, ctrl.getActiveEmail);

router.get('/logout', mw.logout);

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
router.post('/setapp', mw.setapp)
router.post('/api/*', mw.authenticate);
router.post('/api/advancequery', ctrl.advanceQuery);
router.post('/api/localquery', ctrl.localQuery);
router.post('/api/crud/create/:table/:multi?', mw.sanatizeData, ctrl.createRecord);
router.post('/api/crud/update/:table', ctrl.updateRecord);
router.post('/api/create/order', ctrl.createOrder);
router.post('/aws/download', ctrl.dlAWS)
router.post('/aws/upload', ctrl.ulAWS)
router.post('/api/email', ctrl.sendActivation);
router.post('/api/email/activate', ctrl.activateEmail);
router.post('/api/update/pwd', ctrl.changePassword);
router.post('/register', ctrl.register);
router.post('/getuserpwdresetcode', ctrl.sendPasswordResetCode);
router.post('/reset-user-password', ctrl.resetUserPassword);
router.post('/api/encrypt', ctrl.encrypt);
router.post('/api/set-classic-sku', ctrl.setClassicSKU);
router.post('/api/bulk-edit', ctrl.bulkEdit);
router.post('/api/reset/schema', ctrl.resetSchema);




module.exports = router;
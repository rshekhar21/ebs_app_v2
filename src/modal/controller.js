const modal = require('./modal');
const log = console.log;


async function action(req, res, modal) {
    try {
        let rs = await modal(req);
        res.json(rs)
    } catch (error) {
        res.json(error)
    }
}


function listApps(req, res) { action(req, res, modal.listApps) }
function advanceQuery(req, res) { action(req, res, modal.advanceQuery) }
function localQuery(req, res) { action(req, res, modal.localQuery) }
function createRecord(req, res) { action(req, res, modal.createRecord) }
function updateRecord(req, res) { action(req, res, modal.updateRecord) }
function dlAWS(req, res) { action(req, res, modal.dlAWS) }
function ulAWS(req, res) { action(req, res, modal.ulAWS) }
function sendActivation(req, res) { action(req, res, modal.sendActivation) }
function activateEmail(req, res) { action(req, res, modal.activateEmail) }
function changePassword(req, res) { action(req, res, modal.changePassword) }
function register(req, res) { action(req, res, modal.register) }
function getActiveEmail(req, res) { action(req, res, modal.getActiveEmail) }
function sendPasswordResetCode(req, res) { action(req, res, modal.sendPasswordResetCode) }
function resetUserPassword(req, res) { action(req, res, modal.resetUserPassword) }
function createOrder(req, res) { action(req, res, modal.createOrder) }
function encrypt(req, res) { action(req, res, modal.encrypt) }
function setClassicSKU(req, res) { action(req, res, modal.setClassicSKU) }
function bulkEdit(req, res) { action(req, res, modal.bulkEdit) }
function resetSchema(req, res) { action(req, res, modal.resetSchema) }



module.exports = {
    listApps,
    advanceQuery,
    localQuery,
    createRecord,
    updateRecord,
    dlAWS,
    ulAWS,
    sendActivation,
    activateEmail,
    changePassword,
    register,
    getActiveEmail,
    sendPasswordResetCode,
    resetUserPassword,
    createOrder,
    encrypt,
    setClassicSKU,
    bulkEdit,
    resetSchema,
};
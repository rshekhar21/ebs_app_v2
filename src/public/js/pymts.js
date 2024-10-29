import help, { advanceQuery, displayDatatable, doc, jq, log, pageHead, parseData, searchData, storeId, xdb } from "./help.js";
import { deletePayment, editPayment, listofBanks } from "./module.js";

doc.addEventListener('DOMContentLoaded', function () {
    pageHead({ title: 'payments' });
    loadData();
    help.controlBtn({
        buttons: [
            {
                title: 'Add Payment', cb: async () => {
                    let { mb } = await help.createStuff({
                        title: 'New Payment',
                        table: 'payment',
                        url: '/api/crud/create/payments',
                        cb: loadData,
                    });
                    jq(mb).find('#cash, #bank').keyup(function () {
                        let pymts = jq('#cash, #bank').map(function () { return this.valueAsNumber || 0 }).get();
                        let amount = help.sumArray(pymts);
                        jq('#amount').val(amount);
                    })
                    jq(mb).find('#card, #bank').change(async function () {
                        if (this.valueAsNumber) {
                            let rs = await help.advanceQuery({ key: 'defaultbank' });
                            let defaultBank = rs.data[0].default_bank;
                            if (defaultBank) jq('#bank_id').val(defaultBank);
                        } else {
                            jq('#bank_id').val('');
                        }
                    })
                }
            },
            {
                title: 'Hard Reset',
                icon: '<i class="bi bi-arrow-clockwise"></i>',
                cb: async () => {
                    try {
                        let res = await advanceQuery({ key: 'payments' });
                        let db = new xdb(storeId, 'payments');
                        db.clear();
                        await db.add(res.data);
                        loadData();
                    } catch (error) {
                        log(error);
                    }
                }
            }
        ]
    })
    // help.controlBtn({})
    searchData({ key: 'srchpymts', showData, loadData });
})

async function loadData() {
    try {
        let db = new xdb(storeId, 'payments');
        let data = await db.getColumns({
            columns: ['id', 'dated', 'party_name', 'party', 'amount', 'cash', 'bank', 'other', 'forefiet', 'bank_name', 'bank_mode',  'payment_method', 'order_id', 'purch_id', 'notes' ],
            rename: { 'bank_name': 'account', 'payment_method': 'pymt_method', 'amount': 'payment', 'bank_mode': 'mode' },
            sortby: 'id',
            sortOrder: 'desc',

        });
        let res = await help.fetchTable({ key: 'payments' }, true, true, data); //log(tbl);
        showData(res);
    } catch (error) {
        log(error);
    }
}

function showData(data) {
    try {
        let { table, tbody, thead } = data
        jq(tbody).find(`[data-key="id"]`).addClass('text-primary role-btn').each(function (i, e) {
            jq(e).click(function () {
                let id = this.textContent;
                help.popListInline({
                    el: this, li: [
                        { key: 'Edit', id: 'editPymt' },
                        { key: 'Delete', id: 'delPymt' },
                        { key: 'Cancel' },
                    ]
                })
                jq('#editPymt').click(function () { editPayment(id, loadData) });
                jq('#delPymt').click(function () { deletePayment(id, loadData) });
            })
        })
        parseData({
            tableObj: data,
            colsToParse: ['payment', 'cash', 'bank', 'other', 'forfiet'],
            alignRight: true,
            colsToHide: ['party', 'pymt_date'],
            // colsToRename: [{ old: 'bank_name', new: 'account' }],
            hideBlanks: ['notes', 'purch_id'],
        })
        displayDatatable(table);
    } catch (error) {
        log(error);
    }
}


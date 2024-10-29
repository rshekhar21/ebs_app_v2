import { setupIndexDB } from './_localdb.js';
import help, { jq, log, doc, fetchTable, pageHead, displayDatatable, searchData, parseData, createStuff, parseNumber, popListInline, advanceQuery, storeId, xdb, queryData } from './help.js';
import { getOrderData, quickData, updateDetails } from './order.config.js';

doc.addEventListener('DOMContentLoaded', function () {
    pageHead({ title: 'purchase', placeholder: 'Search by supplier' });
    loadData();
    help.controlBtn({
        buttons: [
            {
                title: 'New Entry',
                cb: () => {
                    log('ok');
                }
            },
            {
                title: 'Hard Reset',
                icon: '<i class="bi bi-arrow-clockwise"></i>',
                cb: async () => {
                    let store = [
                        {
                            store: 'purchase',
                            options: { keyPath: 'id', autoIncrement: true },
                            indexes: [
                                { name: 'id', keyPath: 'id', unique: true },
                                { name: 'dated', keyPath: 'dated', unique: false },
                                { name: 'supplier', keyPath: 'supplier', unique: false },
                            ]
                        }
                    ];
                    setupIndexDB(store, storeId);
                    queryData({ key: 'purchOrders' }).then(data => {
                        let db = new xdb(storeId, 'purchase');
                        db.clear();
                        db.put(data);
                        loadData();
                    });

                }
            }
        ]
    });
    searchData({ key: 'srchpurchase', showData, loadData });
})

async function loadData() {
    try {
        let db = new xdb(storeId, 'purchase');
        let data = await db.getColumns({
            table: 'purchase', limit: 150, sortyb: 'id', sortOrder: 'DESC',
        }); //log(data); return;
        // let rsp = await fetchTable({ key: 'purchase' }, false, true); log(rsp); return;
        // let res = data?.length ? await fetchTable({}, false, true, data) : await fetchTable({ key: 'purchase', limit: 300 }, false, true);
        if (!data.length) {
            let rsp = await queryData({ key: 'purchase', limit: 300 });
            db.clear();
            await db.put(rsp);
            data = rsp;
        }
        let res = await fetchTable({}, true, true, data);
        showData(res);
    } catch (error) {
        log(error);
    }
}

function showData(data) {
    try {
        parseData({
            tableObj: data.tbl,
            colsToParse: ['qty', 'subtotal', 'disc', 'tax', 'freight', 'total', 'pymt', 'balance'],
            alignRight: true,
            colsToHide: ['supid', 'order_number', 'freight', 'fin_year', 'timestamp', 'bdate', 'fyear'],
            colsToRename: [{ old: 'bill_type', new: 'type' }],
            hideBlanks: ['notes'],
        });

        jq(data.tbody).find(`[data-key="id"]`).addClass('role-btn text-primary').each(function (i, e) {
            jq(e).click(function () {
                let id = this.textContent;
                let index = jq(this).index();
                let balance = data.data[index].balance;
                let supplier = jq(this).closest('tr').find(`[data-key="supplier"]`).text();
                popListInline({
                    el: this, li: [
                        { key: 'View Order', id: 'viewOrder' },
                        { key: 'Edit', id: 'editOrder' },
                        { key: 'Add Suplier', id: 'addSup' },
                        { key: 'Add Payment', id: 'addPymt' },
                        { key: 'Delete', id: 'delOrder' },
                        { key: 'Cancel' },
                    ]
                })
                jq('#viewOrder').click(function () {
                    log('viewOrder')
                })

                jq('#editOrder').click(async function () {
                    try {
                        let [x, y, z] = await Promise.all([
                            await advanceQuery({ key: 'editPurch', values: [id] }),
                            await advanceQuery({ key: 'purchasedStock', values: [id] }),
                            await advanceQuery({ key: 'purchPymt', values: [id] }),
                        ]);
                        let items = y.data;
                        let pymts = z.data;
                        let data = x.data[0];
                        data.update = true,
                            data.items = items || [];
                        data.pymts = pymts || [];
                        data.supplier = supplier;
                        delete items.timestamp; // log(data); return;
                        updateDetails({ purchase: { ...data }, pin_purch: true }); // let od = getOrderData().purchase; log(od);
                        location.href = '/apps/app/orders/create';

                    } catch (error) {
                        log(error);
                    }
                })

                jq('#addSup').click(function () {
                    log('add sup')
                })

                jq('#addPymt').click(async function () {
                    let res = await createStuff({
                        title: 'Add Payment',
                        table: 'purch_pymt',
                        url: '/api/crud/create/payments',
                        defaultInputValues: [{ inputId: 'purch_id', value: id }, { inputId: 'balance', value: balance }],
                    });
                    let mb = res.mb; //log(mb);

                    const [cashInput] = jq(mb).find('#cash');
                    const [bankInput] = jq(mb).find('#bank');
                    const [amountInput] = jq(mb).find('#amount');

                    cashInput.addEventListener('input', updateAmount);
                    bankInput.addEventListener('input', updateAmount);

                    function updateAmount() {
                        const cashValue = parseNumber(cashInput.value) || 0;
                        const bankValue = parseNumber(bankInput.value) || 0;
                        const totalAmount = cashValue + bankValue;
                        amountInput.value = parseNumber(totalAmount); // Format to two decimal places
                    }
                })

                jq('#delOrder').click(async function () {
                    let cnf = help.confirmMsg('Are you sure want to delete this Purchaes?'); //log(cnf);
                    if (cnf) {
                        await advanceQuery({ key: 'delPurch', values: [id] });
                        let db = new xdb(storeId, 'purchase');
                        await db.delete(id);
                        loadData()
                    }
                })
            })
        })


        // jq(data.tbody).find(`[data-key="pymt"]`).addClass('role-btn').each(function (i, e) {
        //     jq(e).click(async function () {
        //         let id = jq(this).closest('tr').find(`[data-key="id"]`).text(); //log(id);

        //     })
        // })


        displayDatatable(data.table);
    } catch (error) {
        log(error);
    }
}




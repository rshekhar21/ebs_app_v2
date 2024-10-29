import { setupIndexDB } from './_localdb.js';
import help, { jq, log, doc, fetchTable, parseNumber, pageHead, popListInline, displayDatatable, showCalender, advanceQuery, fd2json, sumArray, showModal, getForm, showTable, parseData, createTable, createEL, createStuff, xdb, storeId, getActiveEntity, encrypt, postData, showSuccess, getSettings } from './help.js';
import { _addPartyPymt } from './module.js';

doc.addEventListener('DOMContentLoaded', function () {
    pageHead({ title: 'orders', ph: 'Search Orders By ID, Date, Party, Year, FY' });
    loadData()
    help.controlBtn({
        buttons: [
            {
                title: 'New Order',
                cb: () => window.location.href = '/apps/app/orders/create'
            },
            {
                title: 'Hard Refresh',
                icon: '<i class="bi bi-arrow-clockwise"></i>',
                cb: () => {
                    let config = [
                        {
                            store: 'orders',
                            options: { keyPath: 'id', autoIncrement: true },
                            indexes: [
                                { name: 'id', keyPath: 'id', unique: true },
                                { name: 'dated', keyPath: 'dated', unique: false },
                                { name: 'party', keyPath: 'party', unique: false },
                                { name: 'month', keyPath: 'month', unique: false },
                                { name: 'fyear', keyPath: 'fyear', unique: false },
                            ]
                        }
                    ];
                    // setupIndexDB(config);
                    jq('div.process, div.ctrl-menu').toggleClass('d-none');
                    // jq('div.ctrl-menu').addClass('d-none');
                    let db = new xdb(storeId, 'orders');
                    advanceQuery({ key: 'orders' }).then(async (res) => {
                        let data = res.data;
                        if (data?.length) {
                            await db.clear();
                            await db.put(data);
                            loadData();
                        }
                    }).catch(err => log(err));
                }
            }
        ]
    });
    // help.searchData({ key: 'srchordersbyparty', showData, loadData });
    jq('#search').keyup(async function(){
        let key = this.value;
        if(key){
            let data = await db.getColumns({
                key,
                indexes: ['id', 'year', 'month', 'dated', 'party', 'biller', 'fin_year', 'party_name'],
                limit: 50,
                sortby: 'id',
                sortOrder: 'desc'
            });
            let tbl = createTable(data);
            showData(tbl);
        }else{
            loadData();
        }
    }).on('search', loadData)
})

let db = new xdb(storeId, 'orders');
async function loadData() {
    try {
        let data = await db.getColumns({
            sortby: 'id',
            sortOrder: 'desc',
            limit: 100,
        });
        if (data.length) {
            let tbl = createTable(data);
            showData(tbl);
        } else {
            let { data } = await fetchTable({ key: 'orders' }, false); //log(data);
            if (data?.length) {
                db.put(data);
                loadData();
            }
        }
    } catch (error) {
        log(error);
    }
}

async function showData(data) {
    try {
        let { table, tbody, thead } = setData(data);
        displayDatatable(table);

        let div = createEL('div');
        jq(div)
            .addClass('position-absolute bottom-0 mb-3 h3 bg-warning d-flex jcc aic role-btn text-white d-none d-print-none z-2')
            .css({ 'width': '3.5rem', 'height': '3.5rem', 'right': '80px', 'border-radius': '100%' })
            .html('<i class="bi bi-arrow-up"></i>')
            .click(function () { jq(table).parent('div').scrollTop(0); jq(div).addClass('d-none') });
        jq('body').append(div);

        let rsp = await advanceQuery({ key: 'firstAndLastOrderId' }); //log(rsp.data);
        // let last_id = rsp.data[0].last_id;
        let first_id = rsp.data[0].first_id;

        jq(table).parent('div').scroll(async function () {
            try {
                if (data.data.length < 100) return;
                if (this.scrollTop + this.clientHeight >= this.scrollHeight - 10) {
                    let lastId = jq(table).find('tr').last().find(`[data-key="id"]`).text();
                    if (parseNumber(lastId) == first_id) return;
                    jq('div.process').removeClass('d-none');
                    let res = await advanceQuery({ key: 'loadMoreOrders', values: [lastId] });
                    let tbl = createTable(res.data);
                    let tbx = setData(tbl);
                    jq(tbody).append(jq(tbx.tbody).find('tr'));
                    jq('div.process').addClass('d-none');
                }
                if (this.scrollTop > 1000) jq(div).removeClass('d-none');
            } catch (error) {
                log(error);
            }
        })

        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    } catch (error) {
        log(error);
    }
}

function setData(data) {
    let { table, tbody, thead } = data;
    jq(tbody).find(`[data-key="id"]`).addClass('text-primary role-btn').each(function (i, e) {
        jq(e).click(async function () {
            let id = this.textContent;
            let pymt = jq(e).closest('tr').find(`[data-key="pymt"]`).text(); //log(pymt);
            let party = jq(e).closest('tr').find(`[data-key="party"]`).text(); //log(pymt);
            let order_id = jq(e).closest('tr').find(`[data-key="order_id"]`).text(); //log(order_id);

            popListInline({
                el: e, li: [
                    { key: 'View', id: 'viewOrder' },
                    { key: 'Share', id: 'shareDetails' },
                    { key: 'Print Order', id: 'savePdf' },
                    { key: 'View Articles', id: 'viewItems' },
                    { key: 'Change Date', id: 'editDate' },
                    { key: 'Edit Inv-Number', id: 'editInv' },
                    { key: 'Add/Edit Party', id: 'addParty' },
                    { key: 'View Payments', id: 'viewPymts' },
                    { key: 'Add Payment', id: 'addPymt', class: 'disabled' },
                    { key: 'Mark Wholesale', id: 'markWsale' },
                    { key: 'Export JSON', id: 'exportJson' },
                    { key: 'Refetch', id: 'refetch' },
                    { key: 'Delete', id: 'delete' },
                    { key: 'Cancel' }
                ]
            });

            if (!pymt) jq('#viewPymts').addClass('disabled');
            // if (!party) jq('#addParty').removeClass('d-none');

            await checkShowPymt(id);

            jq('#viewOrder').click(function () {
                let url = `${window.location.origin}/apps/order/thermal/?orderid=${order_id}`; //log(url);
                window.open(url);
            });

            jq('#shareDetails').click(function () {
                let { entity } = getSettings()
                let key = `${entity.entity_id}-${order_id}`;
                let url = `${window.location.origin}/order/?key=${key}`;
                // Encode the URL and message for WhatsApp
                // Encrypt the key
                let secretKey = 'your-secret-key'; // Use a strong key
                // let encryptedKey = encrypt(key, secretKey); log(encryptedKey); return;
                // let res = await postData({ url: '/api/encrypt', data: { key }}); log(res.data); return;
                let message = `View Order\n${url}`; //log(message); return;
                let encodedMessage = encodeURIComponent(message);
                let location = `https://api.whatsapp.com/send/?text=${encodedMessage}`;
                window.open(location);
            });

            jq('#editDate').click(function () {
                try {
                    let cal = showCalender().modal;
                    jq(cal).modal('show');
                    jq(cal).on('shown.bs.modal', function () {
                        jq(this).find('td').click(async function () {
                            let date = jq(this).data('date'); //log(date);
                            jq(cal).modal('hide')
                            jq(cal).remove();
                            let [a, b] = await Promise.all([
                                await advanceQuery({ key: 'editorderdate', values: [date, id] }),
                                await advanceQuery({ key: 'updateIndexdbOrder', values: [id] }),
                            ]);
                            let db = new xdb(storeId);
                            db.put(b.data, 'orders')
                            loadData();
                        })
                    })
                } catch (error) {
                    log(error);
                }
            });

            jq('#editInv').click(function () {
                try {
                    createStuff({
                        title: 'Edit Inv Number',
                        table: 'editInvNo',
                        modalSize: 'modal-md',
                        addonData: { id },
                        advQry: { key: 'editinvno', values: ['_invoice_number', '_id'] },
                        cb: async () => {
                            let { data } = await advanceQuery({ key: 'updateIndexdbOrder', values: [id] });
                            let db = new xdb(storeId);
                            db.put(data, 'orders');
                            loadData();
                        },
                    });
                } catch (error) {
                    log(error);
                }
            });

            jq('#addParty').click(function () {
                try {
                    createStuff({
                        title: 'Add / Edit Party',
                        table: 'addeditparty',
                        modalSize: 'modal-md',
                        addonData: { id },
                        advQry: { key: 'addeditparty', values: ['_party', '_id'] },
                        cb: async () => {
                            let { data } = await advanceQuery({ key: 'updateIndexdbOrder', values: [id] });
                            let db = new xdb(storeId);
                            db.put(data, 'orders');
                            loadData();
                        },
                    })
                } catch (error) {
                    log(error)
                }
            })

            jq('#delete').click(async function () {
                try {
                    let cnf = confirm('Are you sure want to delete this order?');
                    if (!cnf) return;
                    let db = new xdb(storeId);
                    await Promise.all([
                        await advanceQuery({ key: 'deleteorder', values: [id] }),
                        await db.delete(id, 'orders'),
                        await db.deleteByIndexKeySmartCheck(id, 'order_id', 'sold'),
                        await db.deleteByIndexKeySmartCheck(id, 'order_id', 'payments'),
                    ])
                    loadData();
                } catch (error) {
                    log(error);
                }
            });

            jq('#addPymt').click(async function () {
                _addPartyPymt(id, loadData)
            });

            jq('#viewPymts').click(function () {
                try {
                    showTable({
                        title: 'View Payments',
                        query: { key: 'vieworderpymts', values: [id] },
                        colsToTotal: ['cash', 'bank', 'payment'],
                        alignRight: true,
                    })
                } catch (error) {
                    log(error)
                }
            });

            jq('#viewItems').click(function () {
                try {
                    showTable({
                        title: 'Order Items',
                        query: { key: 'vieworderitems', values: [id] },
                        colsToTotal: ['qty', 'net', 'gross'],
                        colsToParse: ['price', 'disc'],
                        colsToHide: ['order_id'],
                        alignRight: true
                    });
                } catch (error) {
                    log(error);
                }
            });

            jq('#savePdf').click(function () {
                let url = `${window.location.origin}/view/order/format/b/?orderid=${order_id}`;
                window.open(url);
            });

            jq('#markWsale').click(async function () {
                let res = await advanceQuery({ key: 'setAsWholesale', values: [id] });
                if (!res.data.affectedRows) return;
                showSuccess('Order Update Successfully!');
                let { data } = await advanceQuery({ key: 'ordersByID', values: [id] });
                let db = new xdb(storeId, 'orders');
                await db.put(data);
                loadData();
            })

            jq('#refetch').click(async function () {
                let { entity_id: folder } = getSettings().entity;
                let res = await postData({ url: '/aws/upload', data: { folder, orderid: id } }); //log(res);
            })

            jq('#exportJson').click(async function () {
                try {
                    let db = new xdb(storeId);
                    let items = await db.getColumns({
                        table: 'sold',
                        columns: ['hsn', 'pcode', 'product', 'size', 'price', 'unit', 'qty', 'disc', 'gst'],
                        where: { order_id: id }
                    });
                    if (!items.length) {
                        let { data } = await advanceQuery({ key: 'purchItems', values: [id] });
                        items = data;
                    }
                    let [{ subtotal, discount, inv_number, order_date }] = await db.get(id, 'orders');
                    let orderData = [{ discount, subtotal, inv_number, order_date }];
                    let obj = { soldItems: items, orderData };
                    let json = JSON.stringify(obj);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'ebs-export.json';
                    link.click();
                } catch (error) {
                    log(error);
                }
            })

        })
    })
    jq(table).find(`[data-key="order_id"]`).addClass('d-none');

    jq(tbody).find(`[data-key="notes"]`).addClass('role-btn').each(function (i, e) {
        let title = this.textContent;
        if (title) {
            jq(e)
                .attr({ 'data-bs-toggle': 'tooltip', 'data-bs-placement': 'left', 'data-bs-title': title })
                .html(`<i class="bi bi-chat-square-text"></i>`);
        }
    })

    parseData({
        tableObj: data,
        alignRight: true,
        colsToShow: [`id`, `dated`, `party_name`, `party_id`, `order_type`, `inv_number`, `qty`, `subtotal`, `discount`, `tax`, `freight`, `total`, `previous_due`, `pymt`, `round_off`, `balance`, `fin_year`, `category`, `location`, `rewards`, `redeem`, `notes`, `biller`, `order_id`],
        colsToParse: ['subtotal', 'discount', 'tax', 'freight', 'total', 'pymt', 'adj', 'balance', 'qty', 'round', 'previous_due'],
        colsToHide: ['round_off', 'order_id' ],
        hideBlanks: ['freight', 'round', 'category', 'location', 'rewards', 'redeem', 'previous_due'],
        colsToCenter: ['inv_number', 'qty', 'fin_year', 'notes'],
        colsToRename: [
            { old: 'inv_number', new: 'inv' },
            { old: 'party_name', new: 'party' },
            { old: 'party_id', new: 'pid' },
            { old: 'order_type', new: 'type' },
            { old: 'previous_due', new: 'p_due' },
            { old: 'discount', new: 'disc' },
            { old: 'fin_year', new: 'fy' },
        ]
    })

    jq(table).find(`[data-key="id"]`).addClass('position-sticky start-0');
    return { table, tbody, thead };
}

async function checkShowPymt(id) {
    try {
        let res = await advanceQuery({ key: 'chkorderpymt', values: [id, id] }); //log(res);
        let pymt = parseNumber(res.data[0].pymt);
        let total = parseNumber(res.data[0].total);
        if (pymt < total) jq('#addPymt').removeClass('disabled');
    } catch (error) {
        log(error);
    }
}
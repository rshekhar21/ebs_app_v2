import { setupIndexDB } from "./_localdb.js";
import h, { advanceQuery, controlBtn, createStuff, displayDatatable, doc, fd2json, fetchTable, getForm, jq, log, myIndexDBName, pageHead, parseData, postData, searchData, showModal, storeId, xdb } from "./help.js";
import { createEditParty, editParty } from "./module.js";

doc.addEventListener('DOMContentLoaded', function () {
    pageHead({ title: 'party list' });
    loadData();
    controlBtn({
        buttons: [
            {
                title: 'Add Party',
                cb: () => createEditParty({ callback: loadData }),
            },
            {
                title: 'Hard Reset Data',
                icon: '<i class="bi bi-arrow-clockwise"></i>',
                cb: async () => {
                    let rs = await advanceQuery({ key: 'party' });
                    let data = rs.data;
                    let db = new xdb(storeId, 'partys');
                    db.clear
                    await db.put(data);
                    loadData();
                }
            }
        ]
    })
    searchData({ key: 'srchparty', showData, loadData, serial: true });
})

async function loadData() {
    try {
        // let dbname = myIndexDBName('partyData');
        let store = 'partys';
        // let config = [
        //     {
        //         store,
        //         options: { keyPath: 'id', autoIncrement: true },
        //         indexes: [
        //             { name: 'id', keyPath: 'id', unique: true },
        //             { name: 'party', keyPath: 'party', unique: false },
        //             { name: 'party_id', keyPath: 'party_id', unique: true },
        //             { name: 'party_name', keyPath: 'party_name', unique: false },
        //             { name: 'contact', keyPath: 'contact', unique: false },
        //             { name: 'email', keyPath: 'email', unique: false },
        //             { name: 'gst_number', keyPath: 'gst_number', unique: false },
        //         ]
        //     }];
        // setupIndexDB(config);
        let db = new xdb(storeId, store);
        // let data = await db.powerAll({ limit: 20, sortOrder: 'desc' }); //log(data);
        let data = await db.getColumns({
            columns: [
                `id`, `title`, `party_name`, `party_id`, `contact`, 
                `email`, `gender`, `birthday`, `opening`, `orders`, 
                `billing`, `payments`, `balance`
            ],
            rename: {
                'payments': 'pymts'
            },
            limit: 50,
            sortby: 'id',
            sortOrder: 'desc',
        })
        if (!data.length) {
            let rs = await advanceQuery({ key: 'party' });
            let data = rs.data;
            db.put(data);
            loadData();
            return;
        }
        let res = await fetchTable({ key: 'party' }, true, true, data);
        showData(res);
    } catch (error) {
        log(error);
    }
}

function showData(data) {
    try {
        let { table, tbody, thead } = data;
        jq(tbody).find(`[data-key="id"]`).addClass('text-primary role-btn').each(function (i, e) {
            jq(this).click(function () {
                let id = this.textContent;
                h.popListInline({
                    el: this, li: [
                        { key: 'Edit', id: 'editParty' },
                        { key: 'Delete', id: 'delParty' },
                        { key: 'Cancel', }
                    ]
                });
                jq('#editParty').click(async function () {
                    createEditParty({ update_id: id, callback: loadData })
                })
                jq('#delParty').click(async function () {
                    let cnf = confirm('Are you sure want to delete this Party ?');
                    if (!cnf) return;
                    await advanceQuery({ key: 'deleteParty', values: [id] });
                    loadData();
                })
            })
        })
        parseData({
            tableObj: data,
            colsToParse: ['opening', 'billing', 'balance', 'pymts', 'orders'],
            alignRight: true,
        });
        displayDatatable(table);
    } catch (error) {
        log(error);
    }
}


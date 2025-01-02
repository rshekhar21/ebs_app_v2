import { updateIndexDB } from "./_localdb.js";
import h, { advanceQuery, displayDatatable, doc, jq, log, pageHead, parseData, queryData, searchData, storeId, xdb } from "./help.js";

doc.addEventListener('DOMContentLoaded', function () {
    pageHead({ title: 'sold' });
    loadData();
    h.controlBtn({
        buttons: [
            {
                title: 'Hard Reset',
                icon: '<i class="bi bi-arrow-clockwise"></i>',
                cb: async () => {
                    try {
                        jq('div.process').removeClass('d-none');
                        let res = await queryData({ key: 'sold', limit: 500 }); //log(res.data); return;
                        if (!res.length) return;
                        let db = new xdb(storeId, 'sold');
                        db.clear();
                        await db.add(res);
                        loadData();
                    } catch (error) {
                        log(error);
                    }
                }
            }
        ]
    });
    searchData({ key: 'srchsold', showData, loadData });

    // jq('#search').keyup(async function(){
    //     try {
    //         let db = new xdb(storeId, 'sold');
    //         let data = await db.getColumns({
    //             key: this.value,
    //             indexes: ['sku', 'hsn', 'category', 'pcode', 'product'],
    //             columns: ['id', 'dated', 'order_id', 'party_name', 'sku', 'hsn', 'category', 'pcode', 'product', 'size', 'unit', 'qty', 'price', 'disc', 'gst', 'tax', 'net', 'gross', 'emp_id', 'emp_name'],
    //             hidecols: ['emp_id'],
    //             sortby: 'id', sortOrder: 'desc',
    //             limit: 250,
    //         });
    //         showData(data);
    //     } catch (error) {
    //         log(error);
    //     }
    // })


})



async function loadData() {
    try {
        let db = new xdb(storeId, 'sold');
        let data = await db.getColumns({
            columns: ['id', 'dated', 'order_id', 'party_name', 'sku', 'hsn', 'category', 'pcode', 'product', 'size', 'unit', 'qty', 'price', 'disc', 'gst', 'tax', 'net', 'gross', 'emp_id', 'emp_name'],
            hidecols: ['emp_id'],
            sortby: 'id', sortOrder: 'desc',
            limit: 500,
        });
        jq('div.process').addClass('d-none');
        let res = await h.fetchTable({ key: 'sold' }, false, true, data);
        showData(res);
    } catch (error) {
        log(error);
    }
}

function showData(data) {
    try {
        parseData({
            tableObj: data,
            colsToParse: ['qty', 'price', 'disc', 'gst', 'tax', 'net', 'gross'],
            alignRight: true,
            colsToRight: ['emp_name'],
            hideBlanks: ['hsn', 'size', 'emp_name']
        })
        displayDatatable(data.table, 'container-fluid');
    } catch (error) {
        log(error);
    }
}
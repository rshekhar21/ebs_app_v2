import { setupIndexDB, updateIndexDB, verifyIndex } from "./_localdb.js";
import h, { addTableColumnsTotal, advanceQuery, createTable, displayDatatable, doc, jq, log, pageHead, parseData, storeId, xdb } from "./help.js";

doc.addEventListener('DOMContentLoaded', function () {
    pageHead({ title: 'sales', viewSearch: false });
    const fyear = h.getFinYear(); //log(fyear);
    const cyear = h.getCYear(); //log(fyear);
    const month = h.getMonth(); //log(month);
    loadData(cyear, month);

    let pMonth = month;
    let year = cyear;

    h.controlBtn({
        buttons: [
            { title: 'Next Month', key: 'next-month', icon: '<i class="bi bi-caret-right-fill"></i>', cb: () => nextMonth(), hidden: true },
            { title: 'Previous Month', key: 'prev-month', icon: '<i class="bi bi-caret-left-fill"></i>', cb: () => { prevMonth() } },
            {
                title: 'Hard Refresh',
                icon: '<i class="bi bi-arrow-clockwise"></i>',
                cb: () => {
                    let config = [
                        {
                            store: 'sales',
                            options: { keyPath: 'id', autoIncrement: true },
                            indexes: [
                                { name: 'id', unique: true },
                                { name: 'month', keyPath: 'month', unique: false },
                                { name: 'year', keyPath: 'year', unique: false },
                                { name: 'fyear', keyPath: 'fyear', unique: false },
                                { name: 'dated', keyPath: 'dated', unique: false },
                            ]
                        }
                    ];
                    // setupIndexDB(config);
                    const storeUpdates = [
                        {
                            store: 'sales',
                            addIndexes: [
                                {
                                    name: 'year',
                                    keyPath: 'year',
                                    unique: false
                                }
                            ],
                            deleteIndexes: [] // No indexes to delete
                        }
                    ];
                    // updateIndexDB(storeId, storeUpdates);
                    // verifyIndex(storeId, 'sales', 'year');
                    // return;
                    advanceQuery({ key: 'allsales' }).then(res => {
                        let data = res.data; log(data);
                        let db = new xdb(storeId, 'sales');
                        db.clear();
                        db.add(data);
                        loadData(cyear, month);
                    }).catch(err => log(err))
                }
            }
        ]
    })


    function prevMonth() { 
        pMonth--;
        if (pMonth === 0) { pMonth = 12; year-- }
        log(pMonth, year);
        // if (pMonth === 3) { year-- }
        jq('div.process').removeClass('d-none');
        loadData(year, pMonth);
        jq('div.next-month').removeClass('d-none');
    }

    function nextMonth() {
        pMonth++
        if (pMonth === 13) { pMonth = 1, year++ }
        // if (pMonth === 4) { year++ }
        log(pMonth, year);
        jq('div.process').removeClass('d-none');
        loadData(year, pMonth);
        if (month === pMonth && year === fyear) jq('div.next-month').addClass('d-none');
    }

})

async function loadData(year, month) {
    try {
        let db = new xdb(storeId, 'sales');
        let arr = await db.getColumns({
            hidecols: ['id', 'month', 'fyear', 'year'],
            where: { month, year }
        }); //log(arr);

        if(arr.length){
            let tbl = createTable(arr);
            showData(tbl);
        }else{
            const tbl = await h.fetchTable({ key: 'sales', values: [year, month] });
            showData(tbl);
        }
        
    } catch (error) {
        log(error);
    }
}

function showData(data) {
    try {
        let { table, tbody, thead } = data;        
        parseData({
            tableObj: data,
            colsToTotal: ['orders', 'sales', 'net_sale', 'returns', 'ws', 'event', 'discount', 'gst', 'freight', 'qty', 'gr', 'pymt', 'cash', 'bank'],
            alignRight: true,
            // colsToRename: [{ old: 'discount', new: 'disc'}],
            hideBlanks: ['ws', 'event', 'freight', 'returns', 'discount', 'gr']
        });
        let div = displayDatatable(table);
        if(!div) jq('#root').html(jq('<div></div>').addClass('d-flex jcc aic vh-50 text-danger fs-4').text('No Records Found!'));

    } catch (error) {
        log(error);
    }
}




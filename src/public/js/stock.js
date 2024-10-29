import { setupIndexDB } from './_localdb.js';
import help, { jq, log, doc, fetchTable, parseNumber, parseLocal, advanceQuery, pageHead, displayDatatable, searchData, parseData, createStuff, createEL, myIndexDBName, xdb, storeId, createTable, showErrors, postData, getSettings, queryData } from './help.js';
import { _delStock, _loadSrchstock, setEditStockBody } from './module.js';

doc.addEventListener('DOMContentLoaded', function () {

    pageHead({ title: 'stock' });
    loadData();

    help.controlBtn({
        buttons: [
            {
                title: 'Add Stock',
                cb: async () => {
                    let res = await createStuff({
                        title: 'Add Stock',
                        table: 'stock',
                        url: '/api/crud/create/stock',
                        focus: '#product',
                        applyCallback: loadData,
                        cb: async () => {
                            let { data } = await advanceQuery({ key: 'getstockby_maxid' });
                            let db = new xdb(storeId, 'stock');
                            await db.put(data);
                            loadData();
                        },
                        hideFields: [],
                    });

                    let mb = res.mb;

                    setbody(mb);
                    function setbody(mb) {
                        jq(mb).find('div.pcode').after('<div class="d-flex jcb aic gap-3 odd size-group w-100"></div>');
                        jq(mb).find('div.size, div.size_group').appendTo(jq(mb).find('div.size-group'));
                        jq(mb).find('div.size_group, div.size').addClass('w-50');

                        jq(mb).find('div.size-group').after('<div class="d-flex jcb aic gap-3 odd qty-cost"></div>');
                        jq(mb).find('div.qty, div.cost').appendTo(jq(mb).find('div.qty-cost'));

                        jq(mb).find('div.qty-cost').after('<div class="d-flex jcb aic gap-3 odd price-gst"></div>');
                        jq(mb).find('div.price, div.gst').appendTo(jq(mb).find('div.price-gst'));

                        jq(mb).find('div.price-gst').after('<div class="d-flex jcb aic gap-3 odd wsp-mrp"></div>');
                        jq(mb).find('div.wsp, div.mrp').appendTo(jq(mb).find('div.wsp-mrp'));

                        jq(mb).find('div.wsp-mrp').after('<div class="d-flex jcb aic gap-3 odd disc-per w-100"></div>');
                        jq(mb).find('div.discount, div.disc_type').appendTo(jq(mb).find('div.disc-per'));
                        jq(mb).find('div.discount, div.disc_type').addClass('w-50');

                        jq(mb).find('div.brand').after('<div class="d-flex jcb aic gap-3 even sec-sea"></div>');
                        jq(mb).find('div.section, div.season').appendTo(jq(mb).find('div.sec-sea'));

                        jq(mb).find('div.sec-sea').after('<div class="d-flex jcb aic gap-3 even cat-col"></div>');
                        jq(mb).find('div.category, div.colour').appendTo(jq(mb).find('div.cat-col'));

                        jq(mb).find('div.cat-col').after('<div class="d-flex jcb aic gap-3 even upc-label"></div>');
                        jq(mb).find('div.upc, div.label').appendTo(jq(mb).find('div.upc-label'));

                        jq(mb).find('div.upc-label').after('<div class="d-flex jcb aic gap-3 even hsn-unit"></div>');
                        jq(mb).find('div.hsn, div.unit').appendTo(jq(mb).find('div.hsn-unit'));
                    }

                    let settigns = getSettings();
                    let cs = settigns.customSizes;
                    cs.forEach(size => { jq(mb).find('#size_group').append(new Option(size.group_name, size.size_group)); })

                    let cover = createEL('div');
                    jq('#size_group').change(function () {
                        try {
                            cover.style.width = jq(mb).find('form').width();
                            jq(mb).find('div.row').append(cover);
                            cover.innerHTML = '';

                            let val = this.value; //log(val);
                            if (val) {
                                jq(mb).find('button.apply').val('2')
                                jq('#size, #qty').prop('disabled', true);
                            } else {
                                jq(mb).find('button.apply').val('1');
                                jq('#size, #qty').prop('disabled', false);
                                return;
                            }

                            let sizes = val.split(',');
                            cover.className = 'd-flex jcb aic flex-wrap gap-2 my-3';

                            sizes.forEach(size => {
                                let input = createEL('input');
                                input.type = 'text';
                                input.name = size;
                                input.className = 'form-control';
                                input.placeholder = size;
                                input.style.width = '80px';
                                input.title = size;
                                let label = jq('<label></label>').addClass('form-label').text(size);
                                let div = jq('<div></div>').addClass('form-floating').append(input, label);
                                jq(cover).append(div);
                            })
                        } catch (error) {
                            log(error);
                        }
                    })

                    jq(mb).find('button.apply').click(async function () {
                        try {
                            if (this.value == '1') return;
                            let proceed = true;
                            let obj = res.obj
                            jq(obj.form).find('input:not([type="hidden"]), textarea:not([type="hidden"])').each(function () {
                                if (this.hasAttribute('required')) {
                                    if (this.value == '' || this.value == '0') {
                                        jq(this).addClass('is-invalid');
                                        proceed = false;
                                    }
                                }
                            })
                            if (!proceed) return;

                            jq(this).addClass('disabled');
                            jq('div.p-status').removeClass('d-none');
                            jq('div.error-msg').addClass('d-none').text('');
                            let data = fd2json({ form: obj.form });

                            let val = data.size_group;
                            let sizes = val.split(',').map(size => size.trim()).filter(Boolean);
                            let resArr = []
                            delete data.size_groups;
                            for (let size of sizes) {
                                data.qty = data[size];
                                if (data.qty) {
                                    let obj = { ...data, size: size, qty: data[size] }; //log(obj); return;
                                    let res = await postData({ url: '/api/crud/create/stock', data: { data: obj } });
                                    resArr.push(res?.data?.insertId);
                                }
                            }

                            if (resArr.length) {
                                jq('span.success').removeClass('d-none');
                                jq('span.fail, div.p-status').addClass('d-none');
                            } else {
                                throw 'Stock data not saved.';
                            }

                            jq(this).removeClass('disabled');
                        } catch (error) {
                            log(error);
                            jq('span.success, div.p-status').addClass('d-none');
                            jq('span.fail').removeClass('d-none');
                            jq('div.error-msg').removeClass('d-none').text(error);
                            log(error);
                        }
                    })
                }
            },
            {
                title: 'Hard Reset',
                icon: '<i class="bi bi-arrow-clockwise"></i>',
                cb: async () => {      
                    jq('div.process').removeClass('d-none');             
                    let data = await queryData({ key: 'stock' }); //log(data.length);
                    if (data.length) {
                        let db = new xdb(storeId, 'stock');
                        db.clear();
                        await db.put(data);
                        jq('div.process').addClass('d-none');
                        loadData();
                    }
                }
            }
        ]
    });

    jq('#search').keyup(async function () {
        try {
            let key = this.value;
            let db = new xdb(storeId, 'stock');
            let arr = await db.getColumns({
                key,
                indexes: [`sku`, `product`, `pcode`, `price`, `mrp`, `brand`, `label`, `hsn`, `upc`, `section`, `season`, `colour`, `category`, `supplier`, `unit`, `ean`],
                // columns: [`id`, `sku`, `product`, `pcode`, `mrp`, `price`, `wsp`, `gst`, `size`, `discount`, `disc_type`, `brand`, `colour`, `label`, `section`, `season`, `category`, `upc`, `hsn`, `unit`, `prchd_on`, `purch_id`, `bill_number`, `supid`, `supplier`, `ean`, `cost`, `purch_price`, `cost_gst`, `qty`, `sold`, `defect`, `returned`, `available`,],
                // rename: { 'available': 'avl', 'returned': 'gr', 'discount': 'disc' },
                limit: 150,
                sortby: 'product'
            });
            let tbl = createTable(arr, false, true);
            showData(tbl);
        } catch (error) {
            log(error);
        }
    }).on('search', function () {
        loadData();
    })

})

async function loadData(key = null) {
    try {
        let db = new xdb(storeId, 'stock');
        // let data1 = await db.powerAll({ limit: 21, sortField: 'id', sortOrder: 'desc' });
        let data = await db.getColumns({
            key: key || null,
            indexes: [`sku`, `product`, `pcode`, `price`, `mrp`, `brand`, `label`, `hsn`, `upc`, `section`, `season`, `colour`, `category`, `supplier`, `unit`, `ean`],
            // columns: [`id`, `sku`, `product`, `pcode`, `mrp`, `price`, `wsp`, `gst`, `size`, `discount`, `disc_type`, `brand`, `colour`, `label`, `section`, `season`, `category`, `upc`, `hsn`, `unit`, `prchd_on`, `purch_id`, `bill_number`, `supid`, `supplier`, `ean`, `cost`, `purch_price`, `cost_gst`, `qty`, `sold`, `defect`, `returned`, `available`,],
            // rename: { 'available': 'avl', 'returned': 'gr', 'discount': 'disc' },
            limit: '250', 
            sortby: 'id', 
            sortOrder: 'desc'
        });
        if (!data.length) {
            let { data } = await advanceQuery({ key: 'stock' });
            if (data) {
                db.put(data);
                loadData();
            }
        }
        let res = await fetchTable({ key: 'stock' }, false, true, data);
        showData(res);
    } catch (error) {
        log(error);
    }
}

function showData(data) {
    try {
        let { table, tbody, thead } = data
        parseData({
            tableObj: data,
            colsToShow: [`id`, `sku`, `product`, `pcode`, `mrp`, `price`, `wsp`, `gst`, `size`, `discount`, `disc_type`, `brand`, `colour`, `label`, `section`, `season`, `category`, `upc`, `hsn`, `unit`, `prchd_on`, `purch_id`, `bill_number`, `supid`, `supplier`, `ean`, `cost`, `purch_price`, `cost_gst`, `qty`, `sold`, `defect`, `returned`, `available`,],
            colsToParse: ['price', 'mrp', 'wsp', 'gst', 'qty', 'sold', 'returned', 'available', 'discount'],
            colsToHide: ['purch_id', 'supid', 'cost', 'purch_price', 'cost_gst', 'bill_number', 'prchd_on'],
            hideBlanks: ['wsp', 'mrp', 'gst', 'size', 'discount', 'disc_type', 'brand', 'colour', 'label', 'section', 'season', 'category', 'upc', 'ean', 'hsn', 'unit', 'purch_on', 'supplier', 'defect', 'returned'],
            alignRight: true,
            colsToRight: ['disc_type', 'ean'],
            colsTitle: [
                { col: 'wsp', title: 'Whole Sale Price' },
                { col: 'ean', title: 'Barcode Number' },
                { col: 'gr', title: 'Goods Return' },
                { col: 'pcode', title: 'Product Code' },
                { col: 'price', title: 'Selling Price' },
            ],
            colsToRename: [
                { old: 'available', new: 'avl' },
                { old: 'returned', new: 'gr' },
                { old: 'discount', new: 'disc' },
            ]
        })

        jq(tbody).find(`[data-key="id"]`).addClass('text-primary role-btn').each(function (i, e) {
            jq(e).click(function () {
                let id = jq(this).text();
                let sku = jq(this).closest('tr').find(`[data-key="sku"]`).text();
                // let puid = jq(this).closest('tr').find('[data-key="puid"]').text(); //log(puid);
                help.popListInline({
                    el: this, li: [
                        { key: 'Edit', id: 'editStock' },
                        { key: 'Set Classic SKU', id: 'updateSKU' },
                        { key: 'Delete', id: 'delete' },
                        { key: 'Cancel' },
                    ]
                })

                jq('#editStock').click(async function () {
                    try {
                        let db = new xdb(storeId, 'stock'); //log(id);
                        let [arr] = await db.getColumns({ key: id, indexes: ['id'], columns: ['id', 'purch_id'], limit: 1, });
                        let table = 'stock';
                        if (arr.purch_id) { table = 'purchStockEdit' }; log(table);

                        let res = await createStuff({
                            title: 'Edit Stock',
                            table: table,
                            applyButtonText: 'Update',
                            url: '/api/crud/update/stock',
                            focus: '#product',
                            qryObj: { key: 'editStock', values: [id] },
                            applyCallback: _loadSrchstock,
                            applyCBPrams: id,
                            hideFields: ['sizeGroup'],
                            cb: loadData,
                        });

                        let mb = res.mb;

                        setEditStockBody(mb);

                    } catch (error) {
                        log(error);
                    }
                })

                jq('#delete').click(async function () {
                    let key = jq('#search').val();
                    _delStock(id, () => loadData(key));
                })

                jq('#updateSKU').click(async function () {
                    try {
                        let cnf = confirm('Update SKU?');
                        if (!cnf) return;
                        let { data: res } = await postData({ url: '/api/set-classic-sku', data: { data: { id } } });
                        if (!res.affectedRows) { showErrors('Error Updating SKU!\nOnly Unsold Article/Item is allowed to Change/Update SKU!', 7000); return; }
                        let { data } = await advanceQuery({ key: 'getstock_byid', values: [id] });
                        let db = new xdb(storeId, 'stock');
                        await db.put(data);
                        loadData();
                    } catch (error) {
                        log(error);
                    }
                })
            })
        })

        displayDatatable(table, 'container-fluid');
        jq(table).find(`[data-key="sku"]`).addClass('position-sticky start-0');
    } catch (error) {
        log(error);
    }
}
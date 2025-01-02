import help, { advanceQuery, createEL, createNewPage, createStuff, createTable, doc, errorMsg, fd2obj, fetchTable, generateUniqueAlphaCode, getFinYear, getForm, getSettings, getSqlDate, isAdmin, isRrestricted, jq, log, parseColumn, parseCurrency, parseData, parseNumber, popListInline, postData, queryData, setTable, showCalender, showErrors, showModal, showTable, storeId, xdb } from "../help.js";
import { loadSettings } from "./settings.js";
import { icons } from "../svgs.js";
import { _addPartyPymt, _delStock, _loadSrchstock, createStock, editParty, numerifyObject, purchEntry, sendOrderEmail, setEditStockBody } from "../module.js";
import { getOrderData, hardresetData, loadOrderDetails, loadPartyDetails, quickData, refreshOrder, resetOrder, setItems, showOrderDetails, updateDetails } from "../order.config.js";
import { setupIndexDB } from "../_localdb.js";

// let { pin_purch = null } = getOrderData(); //log(pin_purch);


// export default {}
export function leftPanel() {
    try {
        let topMenu = [
            // home
            {
                id: 'home', rc: '', name: "Home", title: 'Home Page', icon: icons.home, href: '/apps/app', class: 'menu-item',
                action: () => location.href = '/apps/app'
            },
            // create order
            {
                id: 'order', rc: '', name: "Order", title: 'Create New Order', icon: icons.plus, href: '', class: 'menu-item order-item',
                action: () => {
                    // history.pushState({}, null, '/apps/app/orders/create');
                    const { pin_purch = null } = getOrderData(); //log(pin_purch);
                    if (pin_purch) { alert('Please Un-Pin Purchase!'); return; }
                    jq('#new-order').removeClass('d-none');
                }
            },
            // view orders
            {
                id: 'vieworder', rc: 'PgBXvEqD', name: "View Orders", title: 'View Orders', icon: icons.view_orders, href: '', class: 'menu-item',
                action: () => {
                    const { pin_purch = null } = getOrderData();
                    if (pin_purch) return;
                    _viewOrders();
                }
            },
            // closing
            {
                id: 'closing', rc: 'jDzNlYbp', name: 'Closing', title: 'View Closing', icon: icons.closing, href: '', class: 'menu-item',
                action: async () => {
                    const { pin_purch = null } = getOrderData();
                    if (pin_purch) return;
                    _viewClosing()
                }
            },
            // partys
            {
                id: 'party', rc: '', name: "Customers", title: 'View Customers', icon: icons.partys, href: '', class: 'menu-item',
                action: () => {
                    const { pin_purch = null } = getOrderData();
                    if (pin_purch) return;
                    _viewPartys();
                }
            },
            {
                id: 'create', name: 'Create', title: 'Create Stuff', icon: icons.plus, href: '', class: '', hide: true,
                submenu: [
                    { title: 'Create Stock', name: 'stock' },
                    { title: 'Create Expense', name: 'expense' },
                    { title: 'Create Employee', name: 'employee' },
                ],
                action: function () {
                    let [div] = jq('<div></div>').addClass('vstack gap-2 posotion-fixed').css({ 'top': 'anchor(top)', 'left': 'anchor(left)' })
                    this.submenu.forEach(menu => {
                        let [span] = jq('<span></span>')
                            .addClass('role-btn').text(menu.name).click(function () { log('ok'); })
                            .attr('id', generateUniqueAlphaCode(6))
                            .attr('anchor', 'abcd'); //log(span);
                        // span.setAttribute('anchor', generateUniqueAlphaCode(6)); log(span);
                        // jq(div).append(span);


                        // const [span] = $('<span></span>')
                        // .addClass('role-btn')
                        // .text('ok')
                        // .click(function () { console.log('Clicked!') })
                        // .attr('id', generateUniqueAlphaCode(6))
                        // .attr('anchor', 'bluebox'); log(span);
                    })
                    jq('#side-panel').append(div);
                }
            },
            // {
            //     id: 'employee', name: "Employee", title: 'Create Employee', icon: icons.employee2, href: '',
            //     action: () => createStuff({ title: 'Add Employee', table: 'employee', url: '/api/crud/create/employee' })
            // },
            // create expense
            {
                id: 'expense', rc: '', name: "Expense", title: 'Create Expense', icon: icons.dollar2, href: '',
                action: () => createStuff({ title: 'Add Expnse', table: 'expense', url: '/api/crud/create/expense' })
            },
            // create stock
            {
                id: 'stock', rc: '', name: "Stock", title: 'Create New Stock', icon: icons.stock, href: '',
                action: () => createStock({})
            },
            // view stock
            {
                id: 'inventory', rc: '', name: "View Stock", title: 'View Stock', icon: icons.stock_1, href: '', class: 'menu-item',
                // action: () => location.href = '/apps/app/stock',
                action: () => {
                    const { pin_purch = null } = getOrderData();
                    if (pin_purch) return;
                    _viewStock();
                }
            },
            // view purchaes
            {
                id: 'viewpurch', rc: 'WnkzKJLc', name: "View Purchase", title: 'View Purchase', icon: icons.inventory, href: '', class: 'menu-item',
                action: () => {
                    const { pin_purch = null } = getOrderData();
                    if (pin_purch) return;
                    _viewPurch();
                },
            },
            // create purchase
            {
                id: 'purchase', rc: 'FROKLrJs', name: "Purchase Entry", title: 'Purchase Stock', icon: icons.purchase, href: '', class: '', hide: true,
                action: () => {
                    const { pin_purch = null } = getOrderData();
                    if (pin_purch) return;
                    purchEntry()
                },
            },
            // create purchase
            {
                id: 'purchase', rc: 'FROKLrJs', name: "Purchase", title: 'Create New Purchase', icon: icons.cart, href: '', class: 'menu-item purch-item',
                action: () => {
                    // history.pushState({}, null, '/apps/app/orders/create/purchase');
                    jq('#purchase-order').removeClass('d-none');
                    // log(window.location.href)
                    // http://localhost:4100/apps/app/orders/create#purchase
                    // http://localhost:4100/apps/app/orders/create
                }
            },
            {
                id: 'monthlyhsales', rc: 'klidFVCa', name: "Monthly Sales", title: 'View Montyly Sales!', icon: icons.salesdata, href: '', class: 'menu-item',
                action: () => {
                    const { pin_purch = null } = getOrderData();
                    if (pin_purch) return;
                    _monthlySales()
                    // jq('#desktop-body').find('div.menu-body').addClass('d-none');
                    // jq('#monthlySales').toggleClass('d-none');
                    // let fy = getFinYear();
                    // advanceQuery({ key: 'fin_years' }).then(res => {
                    //     let years = res.data; //log(years);

                    //     jq('#fin-year').html('');
                    //     years.forEach(year => {
                    //         let option = new Option(year.fin_year);
                    //         jq('#fin-year').append(option);
                    //     })
                    //     jq('#fin-year').val(fy).change(function () { monthlySalesData(this.value); })
                    // })
                    // monthlySalesData(fy);;
                }
            },
            // {
            //     id: 'storedetails', name: 'Dashboard', title: 'General Details', icon: icons.dashboard, href: '', class: 'menu-item',
            //     action: () => {
            //         const { pin_purch = null } = getOrderData();
            //         if (pin_purch) return;
            //         _viewDash()
            //     }

            // },
            // {
            //     id: 'views', name: 'View', title: 'View Data', icon: icons.inventory, href: '', class: '',
            //     action: () => {
            //         const { pin_purch = null } = getOrderData();
            //         if (pin_purch) return;
            //         _viewData();
            //     }
            // }
        ];

        topMenu.forEach(menu => {
            let div = createEL('div');
            div.title = menu.title;
            let link = createEL('span');
            link.href = menu.href;
            jq(link).addClass(`d-none d-xl-flex ms-3 link-light`).text(menu.name);
            jq(div).addClass(`d-xl-flex jcs text-center p-1 aic role-btn fw-300 ${menu?.class ? menu.class : ''} ${menu.id}`).append(menu.icon, link);
            let divId = generateUniqueAlphaCode(8);
            // let obj = {key: menu.name, id: divId };
            // let arr = [];
            // arr.push(obj);
            jq(div).click(async function () {
                if (menu.rc) { if (await isRrestricted(menu.rc)) return }
                const { pin_purch = null } = getOrderData();
                if (pin_purch) { return; }
                if (jq(this).hasClass('menu-item')) {
                    jq('div.top-side').find('div.menu-item').removeClass('fw-500');
                    jq('#desktop-body').find('div.menu-body').addClass('d-none');
                    jq(this).addClass('fw-500');
                }
                menu.action();
            }).hover(function () { jq(this).toggleClass('bg-hover rounded-end') }).prop('id', `${divId}`)
            // menu?.hide && jq(div).addClass('d-none');
            // jq(div).hover(function () { jq(this).toggleClass('bg-hover rounded-end') });
            jq('div.top-side').append(div);
            if (menu?.hide) jq(div).addClass('d-none').removeClass('d-xl-flex');
        })

        let { pin_purch = null } = getOrderData();
        if (pin_purch) {
            jq('#purchase-order, button.unpin-purch').removeClass('d-none');
            jq('#purchase-order button.pin-purch').addClass('d-none');
            jq('#side-panel div.purch-item').addClass('fw-500');
        } else {
            // log('no pin purch')
            jq('#side-panel div.order-item').addClass('fw-500');
        }

        // bottom side
        let bottomMenu = [
            // {
            //     id: 'fullscreen', name: 'Fullscreen', title: 'View Fullscreen', icon: icons.expand, class: '',
            //     action: () => {
            //         if (!document.fullscreenElement) {
            //             // Enter fullscreen mode
            //             document.documentElement.requestFullscreen().catch(err => {
            //                 console.error(`Error attempting to enter fullscreen mode: ${err.message} (${err.name})`);
            //             });
            //         } else {
            //             // Exit fullscreen mode
            //             document.exitFullscreen().catch(err => {
            //                 console.error(`Error attempting to exit fullscreen mode: ${err.message} (${err.name})`);
            //             });
            //         }
            //     }
            // },

            // {
            //     id: 'hiderightpanel', name: 'Hide Panel', title: 'Hide Right Panel', icon: icons.switch, class: 'd-none d-xxl-flex',
            //     action: (e) => {
            //         jq('#rightPanel').toggleClass('d-xxl-flex')
            //         let span = jq(e.currentTarget).find('span');
            //         $('#rightPanel').hasClass('d-xxl-flex') ? jq(span).text('Hide Panel') : jq(span).text('Show Panel');
            //     }
            // },

            // { id: 'calc', name: 'Calculaotr', title: 'Calculator', icon: icons.calc, class: '', action: () => { jq('div.calculator').toggleClass('d-none'); jq('#equation').focus(); } },
            // { id: 'show_charts', name: 'View Charts', title: 'Sales Charts', icon: icons.charts, class: '', action: () => { jq('#charts').toggleClass('d-none'); loadSettings(); } },

            {
                id: 'app_settings', admin: true, name: 'Settings', title: 'Application Settings', icon: icons.settings, class: '',
                action: async (m) => {
                    if (m.admin) { if (!await isAdmin()) { errorMsg('Restricted Access!'); return }; }
                    jq('#settings').toggleClass('d-none');
                    loadSettings();
                }
            },

            {
                id: 'logout', admin: false, name: 'Logout', title: 'Log Out Application', icon: icons.logout, class: '',
                action: async () => {
                    hardresetData();
                    window.location.href = '/logout'
                }
            },

        ];

        bottomMenu.forEach(async menu => {
            let div = createEL('div');
            div.title = menu.title;
            let span = createEL('span');
            jq(span).addClass('d-none d-xl-flex ms-3').text(menu.name);
            $(div).addClass(`d-xl-flex jcs text-center aic p-1 role-btn fw-300 ${menu.id} ${menu?.class || ''} `).append(menu.icon, span);
            jq(div).click(function () { menu.action(menu) }).hover(function () { jq(this).toggleClass('bg-hover rounded-end') })
            jq('div.bottom-side').append(div);
        })

        // jq(window).resize(function(e){
        //    let height = this.innerHeight; //log(height);
        //    let [a,b] = jq('#bottom').find('div.menu-items'); //log(a,b);
        //    if(height>700){
        //     jq(a).removeClass('d-none');
        //     jq(b).addClass('d-none');
        //    }else{
        //     jq(b).removeClass('d-none');
        //     jq(a).addClass('d-none');
        //    }            
        // })

    } catch (error) {
        log(error);
    }
}

export function rightPanel() {
    try {
        let arr = [
            { id: 'holds', name: 'Holds', title: 'View Hold Orders', action: (id) => { _viewholds(id); } },
            { id: 'party_dues', name: 'Party Dues', title: 'View Party Dues', action: (id, spinner) => { _partyDues(id, spinner) } },
            // { id: 'party_details', name: 'Party Details', title: 'View Party Details', action: (id) => { } },
            // { id: 'closing', name: 'Closing', title: 'View Closing', action: (id) => { _closing(id) } },
            { id: 'recent_orders', name: 'Recent Orders', title: 'View Recent Orders', action: (id) => { _recent(id) } },
            { id: 'unpaid_orders', name: 'Unpaid Orders', title: 'View Orders Pending Payment', action: (id) => { _unpaid(id) } },
            // { id: 'month_sale', name: "Month's Sale", title: 'View Total Monthly Sales', action: (id) => { _monthSales(id) } },
            {
                id: 'emp_sales', name: 'Employee Sales', title: 'View Employee Sales', action: (id) => { _empSales(id) }
            },
        ];

        let cover = createEL('div');
        cover.className = 'd-flex flex-column bg-white rounded p-2';
        // let spinner = `<div class="spinner-border spinner-border-sm me-auto loader d-none" role="status">
        // <span class="visually-hidden">Loading...</span>
        // </div>`;

        arr.forEach(menu => {
            let [span] = jq('<span></span>').addClass('label fw-500').text(menu.name);
            let [hide] = jq('<span></span>').addClass('hide').html('<i class="bi bi-chevron-down"></i>')
            let [show] = jq('<span></span>').addClass('show d-none').html('<i class="bi bi-chevron-up"></i>');
            let [spinner] = jq('<div></div>').addClass('spinner-border spinner-border-sm me-auto status d-none').html(`<span class="visually-hidden">Loading...</span>`);
            let [matter] = jq('<div></div>').addClass('d-none overflow-auto matter').css('max-height', '250px').attr('id', menu.id);
            let [div] = jq('<div></div>').addClass('d-flex jcb aic role-btn gap-2 border-top py-3 wrapper small').append(span, spinner, hide, show).click(function () {
                $(hide).toggleClass('d-none');
                $(show).toggleClass('d-none');
                $(span).toggleClass('text-primary');
                $(matter).toggleClass('d-none');
                menu.action(menu.id, spinner);
            });
            let container = createEL('div');
            jq(container).addClass('vstack').append(div, matter)
            $(cover).append(container);
        })
        $('#content-right-panel').html(cover);

    } catch (error) {
        log(error);
    }
}

async function monthlySalesData(year) {
    try {
        let months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        let values = Array(12).fill(year).concat([year]); //log(values)
        let tbl = await setTable({
            qryObj: { key: 'dailySalesFY', values },
            colsToTotal: months,
            alignRight: true,
            serial: false,
        })
        jq('div.sales-data').html(tbl.table);

    } catch (error) {
        log(error);
    }
}

async function recentOrders(id) {
    try {
        let div = doc.getElementById(id);
        if (jq(div).hasClass('d-none')) {
            jq(div).parent('div').find('div.status').removeClass('d-none');
            let res = await fetchTable({ key: 'recent_order' }, false, false); //log(res);  
            parseData({ tableObj: res, colsToParse: ['total'], alignRight: true })
            jq(div).html(res.table).parent('div').find('div.status').addClass('d-none');
        } else {
            jq(div).html('');
        }
    } catch (error) {
        log(error);
    }
}

async function unpaidOrders(id) {
    try {
        let div = doc.getElementById(id);
        if (jq(div).hasClass('d-none')) {
            jq(div).parent('div').find('div.status').removeClass('d-none');
            let res = await fetchTable({ key: 'unpaid_orders' }, false, false); //log(res);        
            parseData({ tableObj: res, colsToParse: ['total'], alignRight: true })
            jq(div).html(res.table).parent('div').find('div.status').addClass('d-none');
        } else {
            jq(div).html('');
        }
    } catch (error) {
        log(error);
    }
}

async function _closing(id) {
    try {
        let div = document.getElementById(id);
        if (jq(div).hasClass('d-none')) return;
        let db = new xdb(storeId, 'closing');
        let data = await db.all();
        let res = await setTable({ data, colsToTotal: ['total'], alignRight: true, serial: false });
        jq(div).html('').html(res.table);
    } catch (error) {
        log(error);
    }
}

async function _recent(id) {
    try {
        let div = document.getElementById(id);
        if (jq(div).hasClass('d-none')) return;
        let db = new xdb(storeId, 'recent');
        let data = await db.getColumns({ sortby: 'id', sortOrder: 'desc' });
        let res = await setTable({ data, colsToParse: ['total'], colsToHide: ['id'], alignRight: true, serial: false });
        jq(div).html('').html(res.table);
    } catch (error) {
        log(error);
    }
}

async function _unpaid(id) {
    try {
        let div = document.getElementById(id);
        if (jq(div).hasClass('d-none')) return;
        let db = new xdb(storeId, 'unpaid');
        let data = await db.getColumns({ sortby: 'id', sortOrder: 'desc' });
        let res = await setTable({ data, colsToParse: ['amount'], colsToHide: ['id'], alignRight: true, serial: false });
        jq(div).html('').html(res.table);
    } catch (error) {
        log(error);
    }
}

async function _monthSales(id) {
    try {
        let div = document.getElementById(id);
        if (jq(div).hasClass('d-none')) return;
        let db = new xdb(storeId, 'sales_data');
        let data = await db.all();
        let res = await setTable({ data, serial: false, colsToTotal: ['sale'], alignRight: true, colsToHide: ['id', 'date'] });
        jq(div).html('').html(res.table);
    } catch (error) {
        log(error);
    }
}

async function _partyDues(id, spinner) {
    try {
        let div = document.getElementById(id); //log(id, spinner)
        if (jq(div).hasClass('d-none')) return;
        jq(spinner).removeClass('d-none');
        let res = await setTable({
            qryObj: { key: 'partydues' },
            colsToHide: ['id', 'ob', 'total', 'pymt'],
            colsToParse: ['balance'],
            alignRight: true
        });
        jq(spinner).addClass('d-none');
        jq(div).html('').html(res.table);
    } catch (error) {
        log(error);
    }
}

async function _empSales(id) {
    try {
        let div = document.getElementById(id);
        if (jq(div).hasClass('d-none')) return;
        // let config = [{
        //     store: 'emp_sales',
        //     options: { keyPath: 'id', autoIncrement: true },
        //     indexes: [
        //         { name: 'id', keyPath: 'id', unique: true },
        //         { name: 'employee', keyPath: 'employee', unique: false }
        //     ]
        // }]
        // setupIndexDB(config);
        let db = new xdb(storeId, 'emp_sales');
        let data = await db.all();
        let res = await setTable({ data, colsToParse: ['sales'], alignRight: true, serial: false, });
        jq(div).html('').html(res.table);
    } catch (error) {
        log(error);
    }
}

export async function _viewholds(id) {
    try {
        let div = document.getElementById(id); //log(div);
        if (jq(div).hasClass('d-none')) return;
        let db = new xdb(storeId, 'holds');
        let data = await db.getColumns({
            columns: ['party_name', 'order_date', 'id'],
            rename: { 'party_name': 'party', 'order_date': 'dated' },
            sortby: 'id'
        }); //log(data);

        let tbl = await setTable({ data, colsToHide: ['id'], colsToRight: ['dated'], serial: false, });
        jq(div).html('').html(tbl.table);
        jq(tbl.tbody).find(`[data-key="party"]`).each(function (e) {
            let party = this.textContent; //log(party);
            if (party == '') jq(this).text('N/A');
        })
        jq(tbl.tbody).find('tr').addClass('role-btn').each(function (i, e) {
            jq(e).click(async function () {
                let od = getOrderData();
                if (od.items.length) {
                    let cnf = confirm('All Existing Data will be Cleared? are you sure want to Unhold?');
                    if (!cnf) return;
                }
                let id = jq(this).closest('tr').find(`[data-key="id"]`).text();
                let [data] = await db.get(id);
                await db.delete(id);
                let pymts = data.pymts;
                let items = data.items;
                let payments = data.payments;
                delete data.pymts;
                delete data.items;
                delete data.payments;
                updateDetails(data);
                updateDetails({ pymts: [], items: [] });
                updateDetails({ pymts, items });
                // updateDetails({ items });
                jq(this).closest('tr').remove();
                loadOrderDetails();
                refreshOrder();
                jq('div.ihold-panel').addClass('d-none');
            })
        })
    } catch (error) {
        log(error);
    }
}

async function _viewPurch() {
    try {
        let [h5] = jq('<h4></h4>').addClass('mb-0').text('Purchases');
        let [spinner] = jq('<div></div>').addClass('spinner-border spinner-border-sm text-primary me-auto d-none').html('<span class="visually-hidden">Loading...</span>').prop('role', 'status');
        let [refresh] = jq('<button></button>').addClass('btn btn-secondary ms-auto').html('<i class="bi bi-arrow-counterclockwise"></i>').click(refreshData).prop('title', 'Refresh Data');
        let [search] = jq('<input></input>').addClass('form-control me-auto').attr({ 'type': 'search', 'placeholder': 'Search Purchase' }).css('width', '300px');
        let [header] = jq('<div></div>').addClass('d-flex jcb aic gap-5 mb-5').append(h5, search, spinner, refresh);
        let [tbldiv] = jq('<div></div>').addClass('table-responsive mb-auto')
        let db = new xdb(storeId, 'purchase');

        loadData();

        async function refreshData() {
            try {
                jq(spinner).removeClass('d-none');
                let data = await queryData({ key: 'purchase' }); //log(data);  return
                db.put(data);
                jq(spinner).addClass('d-none');
                loadData();
            } catch (error) {
                log(error);
            }
        }

        jq(search).keyup(async function () {
            let key = this.value; //log(key);
            if (key) {
                let data = await db.getColumns({
                    key, indexes: ['id', 'dated', 'supid', 'supplier'],
                    table: 'purchase', limit: 50, sortby: 'id', sortOrder: 'desc',
                });
                loadData(data);
            }
        }).on('search', function () { loadData() })

        async function loadData(data = null, key = null) {
            if (!data) {
                data = await db.getColumns({
                    key, indexes: ['id', 'dated', 'supid', 'supplier'],
                    table: 'purchase', limit: 50, sortby: 'id', sortOrder: 'desc',
                });
            }

            if (!data.length) {
                jq(spinner).addClass('d-none');
                jq(tbldiv).html('');
                return;
            }

            jq(spinner).removeClass('d-none');
            let res = await fetchTable({ key: 'purchase' }, true, true, data);
            jq(spinner).addClass('d-none');
            if (!res) return;

            let { tbl } = res;

            parseData({
                tableObj: tbl,
                colsToParse: ['qty', 'subtotal', 'disc', 'tax', 'freight', 'total', 'pymt', 'balance'],
                alignRight: true,
                colsToHide: ['supid', 'order_number', 'freight', 'fin_year', 'timestamp', 'bdate', 'fyear'],
                colsToRename: [{ old: 'bill_type', new: 'type' }],
                hideBlanks: ['supid', 'freight', 'timestamp', 'bdate']
            });

            jq(tbl.tbody).find(`[data-key="id"]`).each(function (i, e) {
                jq(e).addClass('role-btn text-primary').click(function () {
                    let id = this.textContent;
                    let index = jq(this).index();
                    // let balance = data.data[index].balance;
                    let supplier = jq(this).closest('tr').find(`[data-key="supplier"]`).text();
                    popListInline({
                        el: this,
                        li: [
                            // { key: 'View', id: 'viewPOrder' },
                            // { key: 'Print View', id: 'printView' },
                            { key: 'View Articles', id: 'viewArticles' },
                            { key: 'View Payments', id: 'viewPayments' },
                            { key: 'Edit', id: 'editPOrder' },
                            { key: 'Delete', id: 'deletePOrder' },
                            { key: 'Cancel' }
                        ]
                    });

                    jq('#editPOrder').click(async function () {
                        try {
                            if (await isRrestricted('tfjlDGeL')) return;
                            let [x, y, z] = await Promise.all([
                                await advanceQuery({ key: 'editPurch', values: [id] }),
                                await advanceQuery({ key: 'purchasedStock', values: [id] }),
                                await advanceQuery({ key: 'purchPymt', values: [id] }),
                            ]);

                            let items = y.data;
                            let pymts = z.data;
                            let data = x.data[0];
                            data.update = true;
                            data.items = items || [];
                            data.pymts = pymts || [];
                            data.supplier = supplier;
                            delete items.timestamp;
                            updateDetails({ purchase: { ...data }, pin_purch: true });
                            // updateDetails({ purchase: { ...data } });                            
                            // history.pushState({}, null, '/apps/app/orders/create/purchase');
                            location.reload()

                        } catch (error) {
                            log(error);
                        }
                    })

                    jq('#deletePOrder').click(async function () {
                        if (await isRrestricted('eVyiaFnt')) return;
                        let cnf = confirm('Are you sure want to delete this Purchaes?'); //log(cnf);
                        if (cnf) {
                            await advanceQuery({ key: 'delPurch', values: [id] });
                            await db.delete(id);
                            let key = jq(search).val();
                            loadData(null, key)
                            let res = await advanceQuery({ key: 'stock' });
                            if (res.data.length) {
                                let stkdb = new xdb(storeId, 'stock')
                                stkdb.clear();
                                stkdb.add(res.data);
                            }
                        }
                    })

                    jq('#viewArticles').click(async function () {
                        let db = new xdb(storeId, 'stock');
                        let data = await db.getColumns({
                            columns: ['id', 'pcode', 'product', 'size', 'qty', 'price', 'purch_price', 'cost', 'sold', 'available'],
                            where: { purch_id: id },
                            rename: { 'available': 'avl' }
                        });

                        if (!data.length) {
                            let res = await advanceQuery({ key: '', values: [id] });
                            if (res.data.length) {
                                data = res.data
                                db.put(data);
                            }
                        }

                        showTable({
                            data,
                            title: 'Purchased Stock',
                            colsToParse: ['qty', 'price', 'cost', 'purch_price', 'sold', 'avl'],
                            colsToTotal: ['qty', 'avl', 'sold'],
                            alignRight: true
                        })
                    })

                    jq('#viewPayments').click(async function () {
                        try {
                            let db = new xdb(storeId, 'payments');
                            let data = await db.getColumns({ where: { purch_id: id }, });

                            if (!data.length) {
                                data = await queryData({ key: 'pymtByPurchid', values: [id] });
                                db.put(data);
                            }
                            showTable({
                                data,
                                title: 'Purchased Stock',
                                colsToShow: ['id', 'amount', 'cash', 'bank', 'other', 'bank_name', 'bank_mode', 'payment_method'],
                                colsToTotal: ['amount', 'cash', 'bank', 'other'],
                                colsToRename: [
                                    { old: 'payment_method', new: 'method' },
                                    { old: 'bank_mode', new: 'mode' },
                                    { old: 'amount', new: 'pymt' },
                                    { old: 'bank_name', new: 'a/c' },
                                ]
                            })
                        } catch (error) {
                            log(error);
                        }
                    })
                })
            })

            jq(tbldiv).html(tbl.table);
        }

        // const divElement = document.createElement('div');
        // divElement.textContent = 'This is the content of the new div.';
        // divElement.className = 'my-div';
        // divElement.style.backgroundColor = 'blue';
        // const win = window.open('/ebs', '_blank', 'width=auto,height=auto');
        // const content = `
        // <h1>This is the content of the new page</h1>
        // <p>You can add more elements here.</p>
        // `;
        // // $(newWindow).ready(function () {
        // //     jq(this).find('#root').append(content);
        // // });


        // // jq(win).find('#root').append(content);
        // // let blankPage = createNewPage(content);
        // // win.document.write(content);


        jq('#view-purchase').removeClass('d-none').html('').append(header, tbldiv);
    } catch (error) {
        log(error);
    }
}

async function _viewOrders() {
    try {
        let [h5] = jq('<h4></h4>').addClass('mb-0').text('Orders');
        let [spinner] = jq('<div></div>').addClass('spinner-border spinner-border-sm text-primary me-auto').html('<span class="visually-hidden">Loading...</span>').prop('role', 'status');
        let [refresh] = jq('<button></button>').addClass('btn btn-secondary ms-auto').html('<i class="bi bi-arrow-counterclockwise"></i>').click(refreshData).prop('title', 'Refresh Data');
        let [search] = jq('<input></input>').addClass('form-control w-25 me-auto').attr('type', 'search').prop('placeholder', 'Search');
        let [header] = jq('<div></div>').addClass('d-flex jcb aic gap-5 mb-5').append(h5, search, spinner, refresh);
        let [tbldiv] = jq('<div></div>').addClass('table-responsive mb-auto');

        let db = new xdb(storeId, 'orders');
        jq(search).on('keyup', async function () {
            let key = this.value;
            if (key) {
                jq(spinner).removeClass('d-none');
                let res = await db.getColumns({
                    key,
                    indexes: ['id', 'year', 'month', 'dated', 'party', 'biller', 'fin_year', 'party_name'],
                    limit: 50,
                    sortby: 'id',
                    sortOrder: 'desc'
                });
                // let res = await queryData({ key: 'srchordersbyparty', type: 'search', searchfor: key })
                loadData(res);
            } else {
                loadData();
            }
        }).on('search', function () { loadData() })

        async function refreshData() {
            try {
                jq(spinner).removeClass('d-none');
                let [a, b, c] = await Promise.all([
                    await advanceQuery({ key: 'orders', limit: 300 }),
                    await advanceQuery({ key: 'sold', limit: 300 }),
                    await advanceQuery({ key: 'payments', limit: 300 }),
                ]);
                let db = new xdb(storeId);
                db.clearAll(['orders', 'sold', 'payments']);
                await db.add(a.data, 'orders');
                await db.add(b.data, 'sold');
                await db.add(c.data, 'payments');
                loadData();
            } catch (error) {
                log(error);
            }
        }

        loadData();

        async function loadData(data = null) {
            let db = new xdb(storeId, 'orders');
            if (!data) {
                data = await db.getColumns({
                    sortby: 'id',
                    sortOrder: 'desc',
                    limit: 150
                });
            }

            if (!data.length) {
                jq(tbldiv).html('');
                jq(spinner).addClass('d-none');
                return;
            }

            let res = await fetchTable({ key: 'orders', limit: 150 }, true, true, data);
            jq(spinner).addClass('d-none');
            if (!res) return;
            let { tbl } = res;

            parseData({
                tableObj: tbl,
                // colsToShow: [`id`, `dated`, `party_name`, `inv_number`, `order_type`, `category`, `location`, `qty`, `subtotal`, `discount`, `tax`, `freight`, `round_off`, `total`, `pymt`, `balance`, `notes`, `order_id`],
                alignRight: true,
                colsToParse: ['subtotal', 'qty', 'discount', 'tax', 'freight', 'total', 'pymt', 'balance', 'round_off'],
                colsToHide: ['order_date', 'party', 'party_id', 'adjustment', 'disc_id', 'disc_percent', 'ship_id', 'tax_type', 'gst_type', 'month', 'year', 'timestamp', 'order_id', 'email'],
                hideBlanks: ['category', 'location', 'freight', 'round_off', 'notes', 'tax', 'disc', 'manual_tax', 'balance', 'rewards', 'redeem', 'previous_due'],
                colsToCenter: ['inv_num', 'qty', 'notes'],
                colsToRename: [
                    { old: 'party_name', new: 'customer' },
                    { old: 'inv_number', new: 'inv#' },
                    { old: 'discount', new: 'disc' },
                    { old: 'round_off', new: 'rnd_off' },
                    { old: 'order_type', new: 'type' },
                ],
                colsToRight: ['fin_year', 'biller'],
            })

            jq(tbl.tbody).find(`[data-key="notes"]`).addClass('role-btn').each(function (i, e) {
                let title = this.textContent;
                if (title) {
                    jq(e)
                        .attr({ 'data-bs-toggle': 'tooltip', 'data-bs-placement': 'left', 'data-bs-title': title })
                        .html(`<i class="bi bi-chat-square-text"></i>`);
                }
            })

            jq(tbl).find(`[data-key="email"]`).addClass('d-none');

            jq(tbl.tbody).find(`[data-key="id"]`).addClass('text-primary role-btn').each(function (i, e) {
                jq(e).click(function () {
                    let id = this.textContent;
                    let date = jq(this).closest('tr').find(`[data-key="order_date"]`).text();
                    let email = jq(e).closest('tr').find(`[data-key="email"]`).text();
                    let party = jq(e).closest('tr').find(`[data-key="party_name"]`).text();
                    let order_id = jq(this).closest('tr').find(`[data-key="order_id"]`).text();

                    popListInline({
                        el: this, li: [
                            { key: 'View', id: 'viewOrder' },
                            { key: 'Share', id: 'shareDetails' },
                            { key: 'Print Order', id: 'viewPrint' },
                            { key: 'Email Order', id: 'emailOrder' },
                            { key: 'View Articles', id: 'viewItems' },
                            { key: 'Add Payment', id: 'addPymts' },
                            { key: 'View Payments', id: 'viewPymts' },
                            { key: 'Add/Edit Party', id: 'addParty' },
                            { key: 'Edit Inv-Number', id: 'editInv' },
                            { key: 'Change Date', id: 'editDate' },
                            { key: 'Export JSON', id: 'exportJson' },
                            { key: 'Refetch', id: 'refetch' },
                            { key: 'Edit', id: 'editOrder' },
                            { key: 'Delete', id: 'delOrder' },
                            { key: 'Cancel' },
                        ]
                    });

                    jq('#viewOrder').click(function () {
                        let url = `${window.location.origin}/apps/order/thermal/?orderid=${order_id}`;
                        let height = window.innerHeight;
                        let width = window.innerWidth;
                        // let myWindow = window.open(url, "_blank", "width=500, height=700, top=0, right=0");
                        const myWin = window.open(url, "_blank", "top=0, width=550, height=100");
                        myWin.resizeTo(550, height);
                        myWin.moveTo(width / 2 - 250, 0)
                    })

                    jq('#viewPrint').click(function () {
                        let url = `${window.location.origin}/view/order/format/b/?orderid=${order_id}`;
                        let height = window.innerHeight;
                        let width = window.innerWidth;
                        const myWin = window.open(url, "_blank", "top=0, width=1024, height=700");
                        myWin.resizeTo(1024, height);
                        myWin.moveTo(width / 2 - 512, 0)
                    })

                    jq('#editOrder').click(async function () {
                        if (await isRrestricted('fiSvlNab')) return;
                        let db = new xdb(storeId);
                        let [data] = await db.getColumns({
                            table: 'orders',
                            columns: [
                                'id', 'order_date', 'order_type', 'inv_number', 'party', 'party_id', 'party_name', 'subtotal', 'disc',
                                'tax', 'freight', 'round_off', 'total', 'pymt', 'fin_year', 'tax_type', 'gst_type', 'manual_tax',
                                'discount', 'disc_id', 'disc_percent', 'category', 'location', 'notes',
                            ],
                            rename: {
                                'id': 'edit_id',
                                'inv_number': 'order_number',
                            },
                            where: {
                                id: id
                            }
                        });

                        data.tax = parseNumber(data.tax);
                        data.pymt = parseNumber(data.pymt);
                        data.total = parseNumber(data.total);
                        data.freight = parseNumber(data.freight);
                        data.subtotal = parseNumber(data.subtotal);
                        data.discount = parseNumber(data.discount);
                        //log(data); return;
                        let items = await db.getColumns({
                            columns: ['id', 'sku', 'hsn', 'category', 'unit', 'pcode', 'product', 'qty', 'price', 'gst', 'disc_val', 'disc_per', 'emp_id', 'order_id'],
                            table: 'sold',
                            where: { order_id: id }
                        });


                        let pymts = await db.getColumns({
                            columns: ['id', 'cash', 'bank', 'other', 'amount', 'bank_id', 'bank_mode', 'pymt_method', 'notes', 'order_id'],
                            table: 'payments',
                            where: { order_id: id }
                        });

                        pymts.forEach(pymt => numerifyObject(pymt)); //log(pymts); return;  


                        updateDetails({ items: [], pymts: [] });
                        updateDetails({ ...data, update: true, items, pymts });
                        loadOrderDetails();
                        jq('#side-panel div.order').click();
                    })

                    jq('#delOrder').click(async function () {
                        try {
                            if (await isRrestricted('jFxGDeft')) return;
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
                    })

                    jq('#viewItems').click(async function () {
                        let db = new xdb(storeId, 'sold');
                        let data = await db.getColumns({
                            columns: ['sku', 'pcode', 'product', 'price', 'qty', 'gross'],
                            where: { order_id: id }
                        });
                        if (!data.length) {
                            data = await queryData({ key: 'vieworderitems', values: [id] });
                        }
                        await showTable({
                            title: 'Order Items',
                            data,
                            colsToParse: ['price', 'qty', 'gross'],
                            colsToTotal: ['qty', 'gross'],
                        })
                    });

                    jq('#viewPymts').click(async function () {
                        let db = new xdb(storeId, 'payments');
                        let data = await db.getColumns({
                            columns: ['id', 'cash', 'bank', 'other', 'amount', 'bank_name', 'payment_method'],
                            rename: { 'amount': 'payment', 'payment_method': 'pymt_method' },
                            where: { order_id: id }
                        }); //log(data);

                        await showTable({
                            data,
                            colsToTotal: ['cash', 'bank', 'other', 'payment'],
                        })
                    })

                    jq('#refetch').click(async function () {
                        let { entity_id: folder } = getSettings().entity;
                        let res = await postData({ url: '/aws/upload', data: { folder, orderid: id } });
                    })

                    jq('#shareDetails').click(function () {
                        let { entity } = getSettings()
                        let key = `${entity.entity_id}-${order_id}`;
                        // let url = `${window.location.origin}/order/?key=${key}`;
                        let url = `https://api.ebsserver.in/order/?key=${key}`;
                        let message = `View Order\n${url}`;
                        let encodedMessage = encodeURIComponent(message);
                        let location = `https://api.whatsapp.com/send/?text=${encodedMessage}`;
                        window.open(location);
                    });

                    jq('#exportJson').click(async function () {
                        try {
                            if (await isRrestricted('fiSvlNab')) return;
                            let db = new xdb(storeId);
                            let items = await db.getColumns({
                                table: 'sold',
                                columns: ['hsn', 'pcode', 'product', 'size', 'price', 'unit', 'qty', 'price', 'disc', 'gst'],
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

                    jq('#editDate').click(async function () {
                        try {
                            if (await isRrestricted('ybaUOclE')) return;
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

                    jq('#editInv').click(async function () {
                        try {
                            if (await isRrestricted('fiSvlNab')) return;
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

                    jq('#addParty').click(async function () {
                        try {
                            if (await isRrestricted('fiSvlNab')) return;
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

                    jq('#addPymts').click(async function () {
                        _addPartyPymt(id, loadData);
                    });

                    jq('#emailOrder').click(async function () {
                        sendOrderEmail(id);
                    })
                });
            })

            jq(tbldiv).html(tbl.table);
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
            const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

        }

        jq('#view-orders').removeClass('d-none').html('').append(header, tbldiv);
    } catch (error) {
        log(error);
    }
}

async function _viewPartys() {
    try {
        let [h5] = jq('<h4></h4>').addClass('mb-0').text('Customers');
        let [spinner] = jq('<div></div>').addClass('spinner-border spinner-border-sm text-primary me-auto').html('<span class="visually-hidden">Loading...</span>').prop('role', 'status');
        let [refresh] = jq('<button></button>').addClass('btn btn-secondary ms-auto').html('<i class="bi bi-arrow-counterclockwise"></i>').click(refreshData).prop('title', 'Refresh Data');
        let [search] = jq('<input></input>').addClass('form-control me-auto w-25')
            .attr({ 'type': 'search', 'placeholder': 'Search Customer' });
        let [header] = jq('<div></div>').addClass('d-flex jcb aic gap-5 mb-5').append(h5, search, spinner, refresh);
        let [tbldiv] = jq('<div></div>').addClass('table-responsive mb-auto')
        let db = new xdb(storeId, 'partys');
        loadData();

        async function refreshData() {
            let res = await advanceQuery({ key: 'party' });
            db.clear();
            db.add(res.data);
            loadData();
        }

        jq(search).keyup(async function () {
            let val = this.value;
            if (val) {
                jq(spinner).removeClass('d-none');
                let data = await db.getColumns({
                    key: val,
                    indexes: ['party_id', 'party_name', 'contact', 'email'],
                    columns: [
                        `id`, `title`, `party_name`, `party_id`, `contact`,
                        `email`, `gender`, `birthday`, `opening`, `orders`,
                        `billing`, `payments`, `balance`
                    ],
                    limit: 30,
                    rename: {
                        'payments': 'pymts'
                    },
                    sortby: 'party_name',
                }); //log(data);
                loadData(data);
            } else {
                loadData();
            }

        })

        async function loadData(data = null) {
            if (!data) {
                data = await db.getColumns({
                    // columns: [ `id`, `title`, `party_name`, `party_id`, `contact`, `email`, `gender`, `birthday`, `opening`, `orders`, `billing`, `payments`, `balance`],
                    // rename: { 'payments': 'pymts' },
                    limit: 150,
                    sortby: 'id',
                    sortOrder: 'desc',
                })
            }

            if (!data.length) {
                jq(spinner).addClass('d-none');
                jq(tbldiv).html('');
                return;
            }

            let res = await fetchTable({ key: 'party' }, true, true, data);
            jq(spinner).addClass('d-none');
            if (!res) return;

            let { tbl } = res;
            parseData({
                tableObj: tbl,
                colsToShow: [`id`, `title`, `party_name`, `party_id`, `contact`, `email`, `gender`, `birthday`, `opening`, `orders`, `billing`, `payments`, `balance`],
                colsToParse: [`opening`, `orders`, `billing`, `payments`, `balance`],
                colsToHide: [],
                alignRight: true,
                colsToRename: [
                    { old: 'payments', new: 'pymts' }
                ]
            })

            jq(tbl.tbody).find(`[data-key="id"]`).each(function (i, e) {
                jq(e).addClass('role-btn text-primary').click(function () {
                    let id = this.textContent;
                    let index = jq(this).index();
                    // let balance = data.data[index].balance;
                    let supplier = jq(this).closest('tr').find(`[data-key="supplier"]`).text();
                    popListInline({
                        el: this,
                        li: [
                            { key: 'Edit', id: 'editParty' },
                            { key: 'Delete', id: 'delParty' },
                            { key: 'Cancel' }
                        ]
                    });

                    jq('#editParty').click(async function () {
                        if (await isRrestricted('PUgTVuft')) return;
                        editParty(id, false,
                            async () => {
                                let [party] = await queryData({ key: 'getpartyByid', values: [id] }); //log(party);
                                await db.put(party);
                            },
                            () => {
                                loadData();
                            });
                    })

                    jq('#delParty').click(async function () {
                        if (await isRrestricted('PUgTVuft')) return;
                        let [x] = await db.get(id); log(x);
                        if (x.billing || x.payments) {
                            showErrors('Customers with No Billing/Payments can be Deleted!');
                            return;
                        }
                        let cnf = confirm('Are you sure want to delete this Party/Customer?');
                        if (cnf) {
                            let res = await advanceQuery({ key: 'delParty', values: [id] });
                            if (res.data.affectedRows) {
                                db.delete(id);
                                loadData();
                            }
                        }
                    })
                })
            })

            jq(tbldiv).html(tbl.table);
        }

        jq('#view-partys').removeClass('d-none').html('').append(header, tbldiv);
    } catch (error) {
        log(error);
    }
}

let selectedIds = [];
async function _viewStock() {
    try {
        let [h5] = jq('<h4></h4>').addClass('mb-0').text('Stock');
        let [spinner] = jq('<div></div>').addClass('spinner-border spinner-border-sm text-primary me-auto').html('<span class="visually-hidden">Loading...</span>').prop('role', 'status');
        let [refresh] = jq('<button></button>').addClass('btn btn-secondary ms-auto').html('<i class="bi bi-arrow-counterclockwise"></i>').click(refreshData).prop('title', 'Refresh Data');
        let [search] = jq('<input></input>').addClass('form-control w-25').attr({ 'type': 'search', 'placeholder': 'Search Stock' });
        let [header] = jq('<div></div>').addClass('d-flex jcb aic gap-5 mb-5').append(h5, search, spinner, refresh);
        let [tbldiv] = jq('<div></div>').addClass('table-responsive mb-auto')
        let db = new xdb(storeId, 'stock');

        loadData();

        async function refreshData() {
            jq(spinner).removeClass('d-none');
            let data = await queryData({ key: 'stock' });
            await db.put(data);
            jq(spinner).addClass('d-none');
            loadData();
        }

        jq(search).keyup(async function () {
            let val = this.value;
            if (val) {
                jq(spinner).removeClass('d-none');
                let data = await db.getColumns({
                    key: val,
                    indexes: [`sku`, `product`, `pcode`, `price`, `mrp`, `brand`, `label`, `hsn`, `upc`, `section`, `season`, `colour`, `category`, `supplier`, `unit`, `ean`],
                    limit: 400,
                    sortby: 'product',
                });
                loadData(data);

            } else {
                loadData();
            }

        }).on('search', function () { loadData() })

        async function loadData(data = null, key = null) {

            if (!data) {
                data = await db.getColumns({
                    key: key || null,
                    indexes: [`sku`, `product`, `pcode`, `price`, `mrp`, `brand`, `label`, `hsn`, `upc`, `section`, `season`, `colour`, `category`, `supplier`, `unit`, `ean`],
                    limit: 250, sortby: 'id', sortOrder: 'desc',
                });
            }

            if (!data.length) {
                jq(spinner).addClass('d-none');
                jq(tbldiv).html('');
                return;
            }


            let res = await fetchTable({ key: 'stock' }, true, true, data);
            jq(spinner).addClass('d-none');
            if (!res) return;
            let { tbl } = res;
            parseData({
                tableObj: tbl,
                colsToShow: [`id`, `sku`, `product`, `pcode`, `mrp`, `price`, `wsp`, `gst`, `size`, `discount`, `disc_type`, `brand`, `colour`, `label`, `section`, `season`, `category`, `upc`, `hsn`, `unit`, `prchd_on`, `purch_id`, `bill_number`, `supid`, `supplier`, `ean`, `cost`, `purch_price`, `cost_gst`, `qty`, `sold`, `defect`, `returned`, `available`,],
                colsToHide: ['purch_id', 'supid', 'cost', 'purch_price', 'cost_gst', 'bill_number', 'prchd_on'],
                hideBlanks: ['wsp', 'mrp', 'gst', 'size', 'discount', 'disc_type', 'brand', 'colour', 'label', 'section', 'season', 'category', 'upc', 'ean', 'hsn', 'unit', 'purch_on', 'supplier', 'defect', 'returned'],
                colsToParse: ['price', 'mrp', 'wsp', 'gst', 'qty', 'sold', 'returned', 'available'],
                colsToCenter: ['gst', 'size', 'hsn', 'uni', 'qty', 'sold', 'available'],
                colsToRename: [
                    { old: 'available', new: 'avl' },
                    { old: 'returned', new: 'gr' },
                    { old: 'discount', new: 'disc' },
                ]
            })

            jq(tbl.tbody).find(`[data-key="id"]`).each(function (i, e) {
                jq(e).addClass('role-btn text-primary').click(function () {
                    let id = this.textContent;
                    let index = jq(this).index();
                    let supplier = jq(this).closest('tr').find(`[data-key="supplier"]`).text();
                    popListInline({
                        el: this,
                        li: [
                            { key: 'Edit', id: 'editStock' },
                            { key: 'Set Classic SKU', id: 'updateSKU' },
                            { key: 'Delete', id: 'delStock' },
                            { key: 'Cancel' }
                        ]
                    });

                    jq('#editStock').click(async function () {
                        try {
                            let db = new xdb(storeId, 'stock'); //log(id);
                            let [arr] = await db.getColumns({ key: id, indexes: ['id'], columns: ['id', 'purch_id'], limit: 1, });
                            let table = 'stock';
                            if (arr.purch_id) { table = 'purchStockEdit' };
                            let res = await createStuff({
                                title: 'Edit Stock',
                                table: table,
                                applyButtonText: 'Update',
                                url: '/api/crud/update/stock',
                                focus: '#product',
                                qryObj: { key: 'editStock', values: [id] },
                                applyCallback: async () => {
                                    let { data } = await advanceQuery({ key: 'getstock_byid', values: [id] }); //log(data);
                                    let db = new xdb(storeId, 'stock');
                                    await db.put(data);
                                },
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

                    jq('#updateSKU').click(async function () {
                        let cnf = confirm('Update SKU?');
                        if (!cnf) return;
                        let { data: res } = await postData({ url: '/api/set-classic-sku', data: { data: { id } } }); //log(res);
                        if (!res.affectedRows) { showErrors('Error Updating SKU!\nOnly Unsold Article/Item is allowed to Change/Update SKU!', 7000); return; }
                        let { data } = await advanceQuery({ key: 'getstock_byid', values: [id] });
                        let db = new xdb(storeId, 'stock');
                        await db.put(data);
                        loadData();
                    })

                    jq('#delStock').click(async function () {
                        let key = jq(search).val();
                        _delStock(id, () => loadData(null, key))
                    })
                })
            })

            let srch = jq(search).val(); //log(srch);
            if (srch) {
                let [li1] = jq('<li></li>').addClass('dropdown-item').text('Set Classic SKU');
                let [li2] = jq('<li></li>').addClass('dropdown-item').text('Edit Selected');
                let [li3] = jq('<li></li>').addClass('dropdown-item').text('Delete');
                let [li4] = jq('<li></li>').addClass('dropdown-item').text('Cancel');
                let [ul] = jq('<ul></ul>').addClass('dropdown-menu');
                let [btn] = jq('<span></span>').addClass('role-btn').attr('data-bs-toggle', 'dropdown').html(`<i class="bi bi-gear-fill"></i>`)
                let [div] = jq('<div></div>').addClass('dropdown').attr('data-ebs', 'dropdown');
                jq(ul).append(li1, li2, li3, li4);
                jq(div).append(btn, ul);

                if (jq(header).find(`[data-ebs="dropdown"]`).length == 0) { jq(header).children().eq(1).after(div); }

                jq(tbl.tbody).find(`[data-key="sku"]`).addClass('role-btn').prop('title', 'Select SKU').click(function () {
                    let id = jq(this).closest('tr').find(`[data-key="id"]`).text(); //log(id);
                    let exists = selectedIds.includes(id);
                    if (!exists) {
                        selectedIds.push(id);
                        $(this).addClass('fw-500');
                    } else {
                        // If the ID exists, remove it from the array and remove the class
                        selectedIds.splice(selectedIds.indexOf(id), 1);
                        $(this).removeClass('fw-500');
                    }
                })

                jq(li1).click(function () {
                    let cnf = confirm(`Are you sure want to Update all selected SKU'S to Classic SKU?\nOnly Unsold SKU's will be Converted!`);
                    if (!cnf) return;
                    let ids = data.map(item => item.id);
                    selectedIds.length ? updateSkus(selectedIds) : updateSkus(ids);
                })

                jq(li2).click(async function () {
                    try {
                        let mb = showModal({
                            title: 'Bulk Edit',
                            callback: () => {
                                refreshData();
                            }
                        }).modal;

                        let { form } = await getForm({ table: 'editSelected' });
                        jq(mb).find('div.modal-body').html(form);

                        function setModalBody(mb) {
                            // odd side
                            jq(mb).find('div.pcode').after('<div class="d-flex jcb aic gap-2 odd price-gst"></div>');
                            jq(mb).find('div.price, div.gst').appendTo(jq(mb).find('div.price-gst'));

                            jq(mb).find('div.price-gst').after('<div class="d-flex jcb aic gap-2 odd wsp-size"></div>');
                            jq(mb).find('div.wsp, div.size').appendTo(jq(mb).find('div.wsp-size'));

                            jq(mb).find('div.wsp-size').after('<div class="d-flex jcb aic gap-2 odd unit-hsn"></div>');
                            jq(mb).find('div.unit, div.hsn').appendTo(jq(mb).find('div.unit-hsn'));

                            jq(mb).find('div.unit-hsn').after('<div class="d-flex jcb aic gap-2 odd disc-per w-100"></div>');
                            jq(mb).find('div.discount, div.disc_type').addClass('w-50').appendTo(jq(mb).find('div.disc-per'));

                            // even side
                            jq(mb).find('div.brand').after('<div class="d-flex jcb aic gap-2 even colour-cat"></div>');
                            jq(mb).find('div.colour, div.category').appendTo(jq(mb).find('div.colour-cat'));

                            jq(mb).find('div.brand').before('<div class="d-flex jcb aic gap-2 even sec-sea"></div>');
                            jq(mb).find('div.section, div.season').appendTo(jq(mb).find('div.sec-sea'));

                            jq(mb).find('div.colour-cat').after('<div class="d-flex jcb aic gap-2 even upc-label"></div>');
                            jq(mb).find('div.upc, div.label').appendTo(jq(mb).find('div.upc-label'));

                            jq(mb).find('button.apply').click(function () {
                                //log('ok');
                            })
                        }
                        setModalBody(mb);

                        jq(mb).find('button.apply').click(async function () {
                            try {
                                let data = fd2obj({ form });
                                jq(this).addClass('disabled');
                                jq('div.p-status').removeClass('d-none');
                                let res = await postData({ url: '/api/bulk-edit', data: { data: { data, selected: selectedIds } } }); //log(res);
                                if (res.data?.affectedRows) {
                                    jq(this).removeClass('disabled');
                                    jq(mb).find('span.success').removeClass('d-none');
                                    jq(mb).find('span.fail, div.p-status').addClass('d-none');
                                } else {
                                    throw res.data;
                                }
                            } catch (error) {
                                jq(mb).find('span.success, div.p-status').addClass('d-none');
                                jq(mb).find('span.fail').removeClass('d-none');
                                jq(mb).find('div.error-msg').removeClass('d-none').text(error);
                                log(error);
                            }
                        })


                        new bootstrap.Modal(mb).show();

                    } catch (error) {
                        log(error);
                    }
                })

                function updateSkus(ids) {
                    let arr = [];
                    ids.forEach(async (id) => {
                        let { data: res } = await postData({ url: '/api/set-classic-sku', data: { data: { id } } });
                        arr.push(res.affectedRows);
                    });
                    refreshData();
                    jq(div).remove();
                    jq(search).val('').focus();
                }
                // jq(tbl.thead).find(`[data-key="sku"]`).addClass('role-btn').prop('title', 'Select All SKU').click(function () {})
            } else {
                if (jq(header).find(`[data-ebs="dropdown"]`).length > 0) jq(header).find(`[data-ebs="dropdown"]`).remove();
                selectedIds = [];
            }



            jq(tbldiv).html(tbl.table);
        }

        jq('#view-stock').removeClass('d-none').html('').append(header, tbldiv);
    } catch (error) {
        log(error);
    }
}

async function _monthlySales() {
    try {
        let fy = getFinYear();
        let [h5] = jq('<h4></h4>').addClass('mb-0').text("Month's Sale");
        let [spinner] = jq('<div></div>').addClass('spinner-border spinner-border-sm text-primary me-auto d-none').html('<span class="visually-hidden">Loading...</span>').prop('role', 'status');
        let [fyear] = jq('<span></span>').addClass('ms-auto').text('FY').prop('title', 'Financial Year');
        let [select] = jq('<select></select>').addClass('form-select').css('width', '200px').attr('name', 'fin-year').prop('title', 'Select FY');
        let [refresh] = jq('<button></button>').addClass('btn btn-secondary').html('<i class="bi bi-arrow-counterclockwise"></i>').click(refreshData).prop('title', 'Refresh Data');
        let [header] = jq('<div></div>').addClass('d-flex jcb aic gap-5 mb-5').append(h5, spinner, fyear, select, refresh);
        let [tbldiv] = jq('<div></div>').addClass('table-responsive mb-auto');
        let [div] = jq('<div></div>').addClass('d-flex justify-content-around aic text-success fw-bold');


        let { data: fys } = await advanceQuery({ key: 'fin_years' });
        loadData(fy);

        jq(select).html('');
        fys.forEach(fy => {
            let option = new Option(fy.fin_year);
            jq(select).append(option);
        })
        jq(select).val(fy);

        async function refreshData() {
            try {
                let { data } = await advanceQuery({ key: 'allsales' }); //log(data);
                let db = new xdb(storeId, 'sales');
                db.clear();
                db.add(data);
                loadData(fy);
            } catch (error) {
                log(error);
            }
        }

        async function loadData(year) {
            try {
                let months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                let values = Array(12).fill(year).concat([year]);
                jq(spinner).removeClass('d-none');
                let tbl = await setTable({
                    qryObj: { key: 'dailySalesFY', values },
                    colsToTotal: months,
                    alignRight: true,
                    serial: false,
                })
                jq(tbldiv).html(tbl.table);
                jq(spinner).addClass('d-none');
            } catch (error) {
                log(error);
            }
        }

        jq(select).change(async function () {
            let fy = this.value;
            loadData(fy);
            let { data: [{ sale }] } = await advanceQuery({ key: 'fysales', values: [fy] });
            jq(div).html(`<span>Total Sales (${jq(select).val()})</span> <span>${parseCurrency(sale)}</span>`);

        })

        let { data: [{ sale }] } = await advanceQuery({ key: 'fysales', values: [jq(select).val()] });
        jq(div).html(`<span>Total Sales (${jq(select).val()})</span> <span>${parseCurrency(sale)}</span>`);

        jq('#view-stock').removeClass('d-none').html('').append(header, tbldiv, div);

    } catch (error) {
        log(error);
    }
}

async function _viewDash() {
    try {

        let blocks = [
            [
                {
                    name: 'Stock',
                    title: '',
                    data: [],
                    grah: '',
                    more: '',
                },
                {
                    name: 'Sales',
                    title: '',
                    data: [],
                    grah: '',
                    more: '',
                },
                {
                    name: 'Purchase',
                    title: '',
                    data: [],
                    grah: '',
                    more: '',
                },
                {
                    name: 'Accounts',
                    title: '',
                    data: [],
                    grah: '',
                    more: '',
                }
            ],
            [
                {
                    name: 'Test',
                    title: '',
                    data: [],
                    grah: '',
                    more: '',
                },
            ]
        ];

        let [h5] = jq('<h4></h4>').addClass('mb-0').text('Dashboard');
        let [header] = jq('<div></div>').addClass('d-flex jcb aic').append(h5);
        let [cardsdiv] = jq('<div></div>').addClass('d-felx flex-column gap-2')

        blocks.forEach(block => {
            let [blockdiv] = jq('<div></div>').addClass('d-flex justify-content-evenly aic gap-5 mt-5 small');
            block.forEach(card => {
                let [div] = jq('<div></div>')
                    .addClass('vstack gap-3 p-2 rounded border details shadow')
                    .css({ 'width': '300px', 'height': '250px' })
                    .html(`<h5>${card.name}</h5>`)

                jq(blockdiv).append(div);
            });
            jq(cardsdiv).append(blockdiv);
        })

        let [div] = jq('<div></div>')
            .addClass('position-absolute menu-body top-0 start-0 overflow-auto bg-white w-100 h-100 p-2 px-3 d-flex flex-column gap-2 position-relative z-2 d-nonee')
            .prop('id', 'store-details')
            .append(header, cardsdiv);

        jq('#dashboard').removeClass('d-none').html('').append(header, cardsdiv);
    } catch (error) {
        log(error);
    }
}

async function _viewData() {
    try {
        let [sp] = jq('#side-panel'); //log(sp);
        let rect = sp.getBoundingClientRect(); //log(rect);
        let div = jq('<div></div>').addClass('vstack gap-2');
        let subMenu = jq('<div></div>').addClass('position-absolute position-relative top-0 start-0 h-100 p-2 border-end bg-white z-5').css('width', '250px').attr('id', 'sub-menu').html(div);
        let btn = jq('<button></button').addClass('btn-close position-absolute top-0 end-0 me-2 mt-2').attr('type', 'button').click(() => jq(subMenu).remove())
        let arr = [
            {
                name: 'Stock', title: '', class: 'sub-menu', cb: () => {
                    const { pin_purch = null } = getOrderData();
                    if (pin_purch) return;
                    _viewStock();
                }
            },
            { name: 'Partys', title: '', class: '', cb: () => { } },
            { name: 'Supplier', title: '', class: '', cb: () => { } },
            { name: 'Sold', title: '', class: '', cb: () => { } },
            { name: 'Expense', title: '', class: '', cb: () => { } },
            { name: 'Employees', title: '', class: '', cb: () => { } },
            { name: 'Purchase', title: '', class: '', cb: () => { } },
            { name: 'Sales', title: '', class: '', cb: () => { } },
        ];


        arr.forEach(key => {
            let span = jq('<span></span>')
                .addClass('role-btn text-primary fw-400 ms-4 sub-menu')
                .text(key.name)
                .hover(function () { jq(this).toggleClass('fw-bold') })
                .click(function () {
                    key.cb();
                    jq(subMenu).remove();
                });
            jq(div).append(span, btn);
        })

        let sm = $('#sub-menu'); //log(sm, sm.length);
        sm.length > 0 ? sm.remove() : jq('#desktop-body').append(subMenu);
    } catch (error) {
        log(error);
    }
}

async function _viewClosing() {
    try {
        let [h5] = jq('<h4></h4>').addClass('mb-0').text('Closing');
        let [spinner] = jq('<div></div>').addClass('spinner-border text-primary me-auto d-none').html('<span class="visually-hidden">Loading...</span>').prop('role', 'status');
        let [inputDate] = jq('<input></input>').addClass('form-control').attr('type', 'date').css('width', '175px').val(moment(new Date).format('YYYY-MM-DD')).change(function () {
            log(this.value);
            loadData(this.value);
        })
        let [btn] = jq('<button></button').addClass('btn btn-sm btn-primary d-none').text('View').click(function () {
            let date = jq(inputDate).val();
            loadData(date);
        })
        let [prev] = jq('<button></button>').addClass('btn btn-light ms-auto').html('<i class="bi bi-caret-left-fill"></i>').click(function () {
            decreaseDate();
            jq(btn).click();
        }).prop('title', 'View Previous')
        let [next] = jq('<spn></spn>').addClass('btn btn-light').html('<i class="bi bi-caret-right-fill"></i>').click(function () {
            increaseDate();
            jq(btn).click();
        }).prop('title', 'View Next')

        let [refresh] = jq('<button></button>').addClass('btn btn-secondary').html('<i class="bi bi-arrow-counterclockwise"></i>').prop('title', 'Refresh Data');
        let [header] = jq('<div></div>').addClass('d-flex jcb aic gap-5 mb-5 d-print-none').append(h5, spinner, prev, next, inputDate, btn);
        let [tbldiv] = jq('<div></div>').addClass('table-responsive mb-auto')

        loadData();
        async function loadData(closing_date = null) {
            try {
                jq(spinner).removeClass('d-none');
                if (!closing_date) closing_date = getSqlDate(); //log(closing_date);
                let { data } = await advanceQuery({ key: 'closing_rep', values: [closing_date] }); //log(data); return;
                jq(spinner).addClass('d-none');

                if (data.length) {
                    let res = await fetchTable({}, true, true, data); //log(res.data);                
                    let { tbl } = res; //log(tbl);
                    parseData({
                        tableObj: tbl,
                        colsToTotal: ['total', 'sold', 'return', 'ws', 'disc', 'tax', 'qty', 'gr', 'pymt', 'cash', 'bank', 'freight'],
                        hideBlanks: ['return', 'ws', 'disc', 'tax', 'gr', 'freight'],
                        colsToHide: ['party_id', 'orderid']
                    })

                    jq(tbl.tbody).find(`[data-key="id"]`).addClass('text-primary role-btn').each(function (i, e) {
                        jq(e).click(function () {
                            try {
                                let id = jq(this).text();
                                let orderid = jq(this).closest('tr').find(`[data-key="orderid"]`).text();
                                popListInline({
                                    el: this,
                                    li: [
                                        { key: 'View', id: 'viewOrder' },
                                        { key: 'Print Order', id: 'viewPrint' },
                                        { key: 'View Articles', id: 'viewItems' },
                                        { key: 'Add Payment', id: 'addPymts' },
                                        { key: 'Delete', id: 'delOrder' },
                                        { key: 'Cancel' }
                                    ]
                                });

                                jq('#viewOrder').click(function () {
                                    let url = `${window.location.origin}/apps/order/thermal/?orderid=${orderid}`;
                                    let height = window.innerHeight;
                                    let width = window.innerWidth;
                                    // let myWindow = window.open(url, "_blank", "width=500, height=700, top=0, right=0");
                                    const myWin = window.open(url, "_blank", "top=0, width=550, height=100");
                                    myWin.resizeTo(550, height);
                                    myWin.moveTo(width / 2 - 250, 0)
                                })

                                jq('#viewPrint').click(function () {
                                    let url = `${window.location.origin}/view/order/format/b/?orderid=${orderid}`;
                                    let height = window.innerHeight;
                                    let width = window.innerWidth;
                                    const myWin = window.open(url, "_blank", "top=0, width=1024, height=700");
                                    myWin.resizeTo(1024, height);
                                    myWin.moveTo(width / 2 - 512, 0)
                                })

                                jq('#addPymts').click(async function () {
                                    _addPartyPymt(id, loadData);
                                });

                                jq('#delOrder').click(async function () {
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
                                })

                                jq('#viewItems').click(async function () {
                                    let db = new xdb(storeId, 'sold');
                                    let data = await db.getColumns({
                                        columns: ['sku', 'pcode', 'product', 'price', 'qty', 'gross'],
                                        where: { order_id: id }
                                    });
                                    if (!data.length) {
                                        data = await queryData({ key: 'vieworderitems', values: [id] });
                                    }
                                    await showTable({
                                        title: 'Order Items',
                                        data,
                                        colsToParse: ['price', 'qty', 'gross'],
                                        colsToTotal: ['qty', 'gross'],
                                    })
                                });
                            } catch (error) {
                                log(error);
                            }
                        })
                    })

                    jq(tbldiv).html(tbl.table);
                } else {
                    jq(tbldiv).html('');
                    return;

                }

            } catch (error) {
                log(error);
            }
        }

        function increaseDate() {
            // const inputDate = document.getElementById("myDate");
            const date = new Date(inputDate.value);
            date.setDate(date.getDate() + 1);
            inputDate.value = date.toISOString().slice(0, 10);
        }

        function decreaseDate() {
            // const inputDate = document.getElementById("myDate");
            const date = new Date(inputDate.value);
            date.setDate(date.getDate() - 1);
            inputDate.value = date.toISOString().slice(0, 10);
        }
        jq('#view-closing').removeClass('d-none').html('').append(header, tbldiv);
    } catch (error) {
        log(error);
    }
}
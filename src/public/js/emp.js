import help, { Months, advanceQuery, controlBtn, createEL, displayDatatable, doc, getCYear, getMonth, jq, log, pageHead, parseNumber, searchData, storeId, xdb } from "./help.js";

doc.addEventListener('DOMContentLoaded', function () {
    pageHead({ title: 'EMPLOYEES' });
    loadData();
    searchData({ key: 'srchemp', loadData, showData });
    controlBtn({
        buttons: [
            // { title: 'Advance Pymt', icon: '<i class="bi bi-currency-rupee"></i>', cb: () => { log('ok') } },
            {
                title: 'Add Employee',
                cb: () => { help.createStuff({ title: 'New Employee', table: 'employee', url: '/api/crud/create/employee', cb: loadData }) }
            },
        ]
    });
})

async function loadData() {
    try {
        let db = new xdb(storeId, 'employees');
        let data = await db.getColumns({
            columns: [`id`, `emp_name`, `emp_id`, `contact`, `exprience`, `education`, `birthday`, `joined_on`, `bg`, `deg`, `ecd`, `address`, `hometown`, `father`, `mother`, `ref`, `department`, `lwd`, `status`],
            sortby: 'id',
            sortOrder: 'desc',
        })
        if (!data.length) {
            let rs = await advanceQuery({ key: 'employee' });
            let data = rs.data;
            db.put(data);
            loadData();
            return;
        }
        let res = await help.fetchTable({ key: 'employee' }, false);
        showData(res);
    } catch (error) {
        log(error); 
    }
}

function showData(data) {
    try {
        let { table, tbody, thead } = data;
        if (!table) return;
        jq(tbody).find(`[data-key="name"]`).addClass('text-primary role-btn').each(function (i, e) {
            jq(e).click(function () {
                let id = jq(this).closest('tr').find(`[data-key="id"]`).text();
                help.popListInline({
                    el: this, li: [
                        { key: 'Edit', id: 'editEmp' },
                        { key: 'Profile', id: 'viewProfile' },
                        { key: 'View Sales', id: 'viewSales' },
                        { key: 'Advance Pymt', id: 'advPymt' },
                        { key: 'Delete', id: 'deleteEmp' },
                        { key: 'Cancel' }
                    ]
                });

                jq('#editEmp').click(async function () {
                    help.createStuff({
                        title: 'Edit Employee',
                        modalSize: 'modal-md',
                        applyButtonText: 'Update',
                        table: 'employee',
                        url: '/api/crud/update/employees',
                        qryObj: { key: 'editEmployee', values: [id] },
                        applyCallback: loadData
                    })

                    // try {
                    //     let mb = help.showModal({ title: 'Edit Employee', applyButtonText: 'Update' }).modal;
                    //     let { form, res } = await help.getForm({ table: 'employee', qryobj: { key: 'editEmployee', values: [id] } });
                    //     jq(mb).find('div.modal-body').html(form);
                    //     jq(mb).find('button.apply').click(async function () {
                    //         jq(this).addClass('disabled');
                    //         jq('div.p-status').removeClass('d-none');
                    //         const data = help.fd2json({ form });
                    //         let res = await help.postData({ url: '/api/crud/update/employee', data: { data } });
                    //         if (res.data?.affectedRows) {
                    //             jq('span.success').removeClass('d-none');
                    //             jq('span.fail, div.p-status').addClass('d-none');
                    //             jq(this).removeClass('disabled');
                    //         }
                    //     })
                    //     new bootstrap.Modal(mb).show();
                    //     mb.addEventListener('hidden.bs.modal', function () { loadData() })
                    // } catch (error) {
                    //     jq('span.success, div.p-status').addClass('d-none');
                    //     jq('span.fail').removeClass('d-none');
                    //     log(error);
                    // }
                })

                jq('#viewProfile').click(function(){
                    window.location.href = '/apps/app/emprofile?id='+id;
                })

                jq('#deleteEmp').click(async function () {
                    try {
                        let confirm = help.confirmMsg('Are you sure want to delete this Employee?');
                        if (!confirm) return;
                        await help.advanceQuery({ key: 'deleteEmp', values: [id] });
                        loadData();
                    } catch (error) {
                        log(error);
                    }
                })

                jq('#advPymt').click(async function () {
                    help.createStuff({
                        title: 'Advance Payment',
                        table: 'empAdvance',
                        url: '/api/crud/create/emp_advance',
                        cb: loadData,
                        defaultInputValues: [
                            {
                                inputId: '#emp_id',
                                value: id,
                            }
                        ]
                    })
                })

                jq('#viewSales').click(async function () {
                    try {
                        let year = getCYear(); //log(year)
                        let mnth = getMonth(); //log(mnth)
                        let res = await help.setTable({ qryObj: { key: 'empSales', values: [id, mnth, year] }, colsToParse: ['disc', 'price'], colsToTotal: ['qty', 'sale'], alignRight: true, showProcess: false }); //log(res);
                        let mb = help.showModal({ title: 'Emp. Sales', showFooter: false }).modal;
                        jq(mb).modal('show');
                        let div = createEL('div');
                        jq(div).addClass('d-flex jcb aic gap-2 mb-2');
                        let selectMonth = createEL('select');
                        let selectYear = createEL('select');
                        jq(selectMonth).addClass('form-select form-select-sm');
                        jq(selectYear).addClass('form-select form-select-sm');
                        Months.forEach(m => {
                            let option = new Option(m.full, m.month);
                            selectMonth.add(option);
                        });
                        selectMonth.value = mnth.toLocaleString();
                        for (let i = parseNumber(year); i >= parseNumber(year) - 2; i--) {
                            let option = new Option(i);
                            selectYear.add(option);
                        }
                        selectYear.value = year
                        jq(div).append(selectMonth, selectYear);
                        jq(mb).find('div.modal-body').prepend(div);
                        jq(selectMonth, selectYear).change(async function () {
                            let mnth = jq(selectMonth).val();
                            let year = jq(selectYear).val();
                            let res = await help.setTable({ qryObj: { key: 'empSales', values: [id, mnth, year] }, colsToParse: ['disc', 'price'], colsToTotal: ['qty', 'sale'], alignRight: true, showProcess: false }); //log(res);
                            jq(mb).find('div.data-table').html(res?.table||'');
                        })
                        let dataDiv = createEL('div');
                        jq(dataDiv).addClass('data-table table-responsive').html(res?.table||'');
                        jq(mb).find('div.modal-body').append(dataDiv)
                    } catch (error) {
                        log(error)
                    }
                })
            })
        })
        displayDatatable(table, 'container-fluid');
    } catch (error) {
        log(error);
    }
}
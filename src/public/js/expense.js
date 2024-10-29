import help, { displayDatatable, doc, fd2json, getForm, jq, log, pageHead, searchData } from "./help.js";

doc.addEventListener('DOMContentLoaded', function () {
    pageHead({ title: 'EXPENSE' });
    loadData();
    help.controlBtn({ buttons: [{ title: 'New Expense', cb: createExpense }] });
    searchData({ key: 'srchexpense', loadData, showData });
})

async function loadData() {
    let res = await help.fetchTable({ key: 'expense' }); //log(res);
    showData(res);
}

function showData(data) {
    try {
        let { table, tbody, thead } = data;
        if (!table) return;
        jq(tbody).find(`[data-key="id"]`).addClass('role-btn text-primary').each(function (i, e) {
            jq(e).click(function () {
                let id = this.textContent; //log(id);
                help.popListInline({
                    el: this, li: [
                        { key: 'Edit', id: 'editExp' },
                        { key: 'Delete', id: 'deleteExp' },
                        { key: 'Cancel' }
                    ]
                });
                jq('#editExp').click(async function () {
                    let mb = help.showModal({ title: 'Exit Expense', applyButtonText: 'Update' }).modal;
                    let { form, res } = await help.getForm({ table: 'expense', qryobj: { key: 'editExpense', values: [id] } });
                    jq(mb).find('div.modal-body').html(form);
                    help.loadOptions({ selectId: 'bank_id', qryObj: { key: 'selectBanks' }, defaultValue: res.data[0].bank_id });
                    help.loadOptions({ selectId: 'pymt_method', qryObj: { key: 'pymtmethods' }, defaultValue: res.data[0].pymt_method });
                    jq(mb).find('button.apply').click(async function () {
                        try {
                            jq('div.p-status').removeClass('d-none');
                            jq(this).addClass('disabled');
                            let data = help.fd2json({ form }); //log(data);
                            let res = await help.postData({ url: '/api/crud/update/expense', data: { data } }); //log(res);
                            if (res.data?.affectedRows) {
                                jq('span.success').removeClass('d-none');
                                jq('span.fail, div.p-status').addClass('d-none');
                                jq(this).removeClass('disabled');
                            }
                        } catch (error) {
                            jq('span.success, div.p-status').addClass('d-none');
                            jq('span.fail').removeClass('d-none');
                            log(error);
                        }
                    })
                    new bootstrap.Modal(mb).show();
                    mb.addEventListener('hidden.bs.modal', function () { loadData() })
                })
                jq('#deleteExp').click(async function () {
                    try {
                        let confirm = help.confirmMsg('Are you sure want to delete this Expense?');
                        if (!confirm) return;
                        await help.advanceQuery({ key: 'deleteExp', values: [id] });
                        loadData();
                    } catch (error) {
                        log(error);
                    }
                })
            })

        })
        // jq('div.data-table').html(table);
        displayDatatable(table);
    } catch (error) {
        jq('span.success, div.p-status').addClass('d-none');
        jq('span.fail').removeClass('d-none');
        log(error);
    }
}

async function createExpense() {
    try {
        const mb = help.showModal({ title: 'New Expense' }).modal;
        let { form } = await getForm({ table: 'expense' }); //log(res);

        jq(mb).find('div.modal-body').html(form);

        help.loadOptions({ selectId: 'bank_id', qryObj: { key: 'selectBanks' } });
        help.loadOptions({ selectId: 'pymt_method', qryObj: { key: 'pymtmethods' } });

        jq(mb).find('button.apply').click(async function () {
            try {
                jq('div.p-status').removeClass('d-none');
                jq(this).addClass('disabled');
                const data = fd2json({ form });
                if (!data.date) data.date = help.getSqlDate();
                let res = await help.postData({ url: '/api/crud/create/expense', data: { data } }); //log(res);
                if (res.data?.insertId) {
                    jq('span.success').removeClass('d-none');
                    jq('span.fail, div.p-status').addClass('d-none');
                    jq(this).removeClass('disabled');
                } else {
                    throw res.data;
                }
            } catch (error) {
                jq('span.success, div.p-status').addClass('d-none');
                jq('span.fail').removeClass('d-none');
                jq('div.error-msg').removeClass('d-none').text(error);
                log(error);
            }
        })

        new bootstrap.Modal(mb).show();
        mb.addEventListener('hidden.bs.modal', function () { loadData() })

    } catch (error) {
        log(error);
    }
}
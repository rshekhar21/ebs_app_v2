import { jq, log, doc, getData, create, postData, showModal } from './help.js';

doc.addEventListener('DOMContentLoaded', function () {
    loadApps();

    jq('button.settings').click(function(){
        let mb = showModal({
            title: "Vefify Password",
            modalSize: 'modal-md',
            applyButtonText: 'Submit',
        }).modal;        
        jq(mb).modal('show');

        let input = jq('<input></input>').addClass('form-control').attr({'type':'password', 'placeholder': 'Account Passwrod'});
        let note = jq('<div></div>').addClass('text-danger small mt-3').text('For security purposes, please re-enter your account password to proceed.')
        jq(mb).find('div.modal-body').append(input, note);

        jq(mb).find('button.apply').click(async function(){
            let password = jq(input).val(); //log(pwd)
            if(password.trim().length === 0) return;
            let res = await postData({ url: '/verify-password', data: { password }}); //log(res.data);
            if(res.data) {
                jq(input).val('');
                jq(mb).modal('hide').remove();
                window.location.href = '/settings';
            }
        });

    })
})

async function loadApps() {
    try {
        let rs = await getData('/showapps');    log(rs); return;
        if(!rs.data) {
            
        }
        return
        let res = await getData('/listapps');
        if (!res.data) { window.location.href = '/'; return }
        if (res.data.length == 0) { return };
        jq('div.process, div.apps').toggleClass('d-none');
        let apps = res.data;
        for (let a of apps) {
            let div = create('div');
            div.dataset.key = a.app_id;
            jq(div).addClass('py-4 d-flex jcc aic bg-success rounded text-white role-btn').html(a.trade_name).click(async function () {
                let app_id = this.dataset.key;
                let res = await postData({ url: '/setapp', data: { app_id, trade: a.trade_name } });
                if (res.data) window.location.href = '/apps/app'
            });
            jq('div.apps').append(div);
        }

    } catch (error) {
        log(error);
    }
}
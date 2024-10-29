import help, { doc, isEmail, jq, localQuery, log } from "./help.js";

doc.addEventListener('DOMContentLoaded', function () {

    checkVerified();

    jq('span.cnange-email').click(function(){
        jq('#account-email').prop('disabled', (i, v) => !v);
        jq('button.get-activation').toggleClass('d-none');
    })

    jq('.get-activation').click(async function () {
        try {
            let email = jq('#account-email').val(); //log(email);
            if (!email) { jq('div.actcode-message').text('Invalid/Missing Email Id!').addClass('text-danger'); return };
            jq('div.submit-status').removeClass('d-none');
            jq(this).addClass('disabled');
            let res = await help.postData({ url: '/api/email', data: { email } }); //log(res);
            jq('div.actcode-message').text(res.data.msg);
            jq('span.verified, .get-activation').addClass('d-none') 
            jq('span.pending, div.validate-code').removeClass('d-none') 
        } catch (error) {
            log(error);
        }
    })

    jq('button.link-email').click(async function(){
        try {
            let act_code = jq('#validate-code').val(); //log(act_code);
            if(!act_code) throw 'No act_code found';
            let res = await help.postData({ url: '/api/email/activate', data: { act_code }}); //log(res);
            if(res.data?.status) {
                jq('span.pending, div.validate-code, div.actcode-message').addClass('d-none') 
                jq('span.verified').removeClass('d-none') 
            }
            if(res.data?.error) throw res.data?.error;
        } catch (error) {
            log(error);
            jq('div.status-message').addClass('text-danger').text(error);
        }
    })

    jq('button.chg-pwd').click(async function(){
        try {
            let old_pwd = jq('#old-pwd').val(); //log(pwd);
            let new_pwd = jq('#new-pwd').val();
            if(new_pwd.length < 6 ) return 
            let res = await localQuery({ key: 'updateUserPwd', values: [new_pwd, help.user_id, old_pwd]}); log(res);
            if(res.data?.affectedRows){
                jq(this).text('Success').addClass('text-success disabled')
                jq('a.btn-exit, a.logout').toggleClass('d-none');
            }
        } catch (error) {
            log(error);
        }
    })

    jq('#account-email').keyup(function(){ if(isEmail(this.value)) jq('button.get-activation').removeClass('disabled') })
});

async function checkVerified() {
    try {
        let res = await help.getData('/active-email'); log(res);//return;
        let data = res?.data[0];
        let email = data.email; //log(email);
        if (email) {
            jq('#account-email').val(email);
            if (data?.email_verified) {  
                jq('span.verified').removeClass('d-none') 
            }else{
                jq('span.pending, div.validate-code').removeClass('d-none') 
            }
        }else{
            jq('span.cnange-email').text('Link Email')
        }
    } catch (error) {
        log(error);
    }
}
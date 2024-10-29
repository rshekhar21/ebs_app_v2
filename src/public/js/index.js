import help, { jq, log, doc, formDataToJson, postData, fd2json, isEmail } from './help.js';

doc.addEventListener('DOMContentLoaded', function () {
    // jq('body').addClass('gred-blue')
    let year = new Date().getFullYear();
    jq('span.copyright').text(`Copyright ${year}, All Rights Reserved`);

    jq('p.forgot-pwd, span.back').click(function () {
        jq('#login-form, #reset-pwd').toggleClass('d-none');
        jq('div.resp-code').addClass('d-none').removeClass('text-danger').text('');
        jq('span.send-reset-code, span.have-code').removeClass('d-none')
        jq('#acnt-email').parent('div').removeClass('d-none');
        jq('div.reset-pwd').addClass('d-none');
        jq('#reset-pwd')[0].reset();
    })

    jq('#acnt-email').blur(function () {
        if (isEmail(this.value)) { 
            jq('span.send-reset-code').removeClass('text-secondary').addClass('role-btn text-primary'); 
        }else{
            jq('span.send-reset-code').removeClass('role-btn text-primary').addClass('text-secondary');
        }
    })

    jq('span.send-reset-code').click(async function () {
        try {
            let email_id = jq('#acnt-email').val();
            if (!email_id) return;
            jq('div.sending-status').removeClass('d-none'); //return;
            let res = await help.postData({ url: '/getuserpwdresetcode', data: { email_id } });
            if (res.data.status) {
                jq('div.send-reset-code, div.sending-status').addClass('d-none');
                jq('p.server-msg').removeClass('d-none text-danger').addClass('text-success').text(res.data.msg)
                jq('div.reset-pwd').removeClass('d-none')
            } else {
                jq('div.sending-status, div.reset-pwd').addClass('d-none');
                jq('p.server-msg').removeClass('d-none text-success').addClass('text-danger').text(res.data.msg)
            }
        } catch (error) {
            log(error);
        }
    })

    jq('span.have-code').click(function () {
        jq('div.reset-pwd').removeClass('d-none');
        jq('span.send-reset-code, span.have-code').addClass('d-none')
        jq('#acnt-email').parent('div').addClass('d-none');
    })

    jq('#login-form').submit(async function (e) {
        try {
            e.preventDefault();
            let data = formDataToJson({ form: this }); //log(data);
            let res = await postData({ url: '/login', data }); //log(res); return;
            if (res.data.status == 'error') {
                throw res.data.message
            } else {
                window.location.href = '/apps'
                // if (res.data) { window.location.href = '/apps' } else { jq('div.error').removeClass('d-none') }
            }
        } catch (error) {
            log(error);
            jq('div.error').removeClass('d-none').text(error);
        }
    })

    jq('#reset-pwd').submit(async function (e) {
        try {
            e.preventDefault();
            let data = fd2json({ form: this }); //log(data); return;
            if (!data.username || !data.password || !data.resetcode) throw 'All fields are required to reset password !';
            if (data.password.length < 6) throw 'Password must be 6 characters long !';
            let submitBtn = jq(this).find('button[type="submit"]');
            submitBtn.attr('disabled', true);
            let res = await postData({ url: '/reset-user-password', data });
            if (res.data?.status) {
                jq('div.resp-code').removeClass('d-none text-danger').addClass('text-success').text(res.data.msg);
                jq('button.show-login').removeClass('d-none').click(function () {
                    jq('#reset-pwd')[0].reset();
                    submitBtn.attr('disabled', false);
                    jq('#login-form, #reset-pwd').toggleClass('d-none');
                });
            } else { throw res.data.msg }
        } catch (error) {
            log(error);
            jq('div.resp-code').removeClass('d-none').addClass('text-danger').text(error);
        }
    })


    const newVersionDiv = document.querySelector('.new-version');
    const downloadButton = document.querySelector('.download');
    const downloadProgress = document.querySelector('.progress');

    // Show the update available notification
    window.app.onUpdateAvailable(() => {
        newVersionDiv.classList.remove('d-none');
    });

    // Handle download button click
    downloadButton.addEventListener('click', () => {
        window.app.requestDownload();
        downloadProgress.classList.remove('d-none')
        // newVersionDiv.innerHTML = '<span>Downloading Update: <progress id="progressBar" max="100" value="0"></progress> <span id="progressText">0%</span></span>';
    });

    // Update progress bar
    window.app.onDownloadProgress((percent) => {
        document.getElementById('progressBar').style.width = `${Math.round(percent)}%`;
        document.getElementById('progressBar').textContent = `${Math.round(percent)}%`;
    });

    // Prompt user to install after download
    window.app.onUpdateDownloaded(() => {
        window.app.requestInstall();
    });

})
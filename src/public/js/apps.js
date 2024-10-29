import help, { jq, log, doc, formDataToJson, getData, create, postData, LStore, Cookie, advanceQuery, setAppID, getActiveEntity } from './help.js';
import { details, getOrderData, purchase, updateDetails } from './order.config.js';

doc.addEventListener('DOMContentLoaded', function () {
    loadApps();
})

let general = {
    "bank_id": "",
    "defaultInvFormat": "format-b",
    "basePrice": "sp",
    "productMode": "Search",
    "thermalFormat": "Classic",
    "chartType": "line",
    "showPymt": "No",
    "showBankOnInv": "No",
    "sendEmail": "No",
    "invoiceMessage": "",
    "declareMessage": "This invoice reflects the actual price of the items described and all details are true and correct.",
    "showEntity": "Yes",
    "showOrderType": "Yes",
    "showPartyAddress": "No",
    "screenSaverWait": "10",
    "groupItems": ""
}

async function loadApps() {
    try {
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
                if (res.data) {
                    let store_id = Cookie.get('store_id');
                    let settings = LStore.get(store_id) || {};
                    settings.storeId = store_id;
                    settings.bankModes = ['', 'Card', 'Online', 'Multiple', 'Cheque', 'Draft'];
                    let rsp = await Promise.all([
                        await advanceQuery({ key: 'pymtmethodslist' }),
                        await advanceQuery({ key: 'listofBanks' }),
                        await advanceQuery({ key: 'discounts' }),
                    ]);
                    settings.pymtMethods = rsp[0].data || [];
                    let banks = rsp[1].data;
                    let disc = rsp[2].data;
                    settings.discounts = disc;
                    if (banks.length) {
                        settings.banks = rsp[1].data || [];
                        let default_bank = settings?.default_bank || banks[0].id;
                        settings.default_bank = default_bank
                    }
                    let customSizes = settings.customSizes || [];
                    if (customSizes.length === 0) settings.customSizes = [{
                        "size_group": "XS,S,M,L,XL,XXL,3XL",
                        "group_name": "SML"
                      }];

                    let gs = settings?.general || null;
                    if(!gs){ settings.general = general; }

                    let entity = await getActiveEntity(); 
                    settings.entity = entity;
                    updateDetails(details);

                    LStore.set(store_id, settings);
                    if (!LStore.get(store_id)) { }

                    // help.Storage.set('ordersData', orderdData);
                    window.location.href = '/apps/app'
                };
            });
            jq('div.apps').append(div);
        }

    } catch (error) {
        log(error);
    }
}
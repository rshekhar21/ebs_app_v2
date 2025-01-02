import { jq, log, doc, getUrlParams, getSettings, parseDecimal, parseNumber, parseCurrency, createTable, parseData } from './help.js';
import { fetchOrderData } from './module.js';

doc.addEventListener('DOMContentLoaded', function () {
    const { orderid } = getUrlParams();
    fetchOrder(orderid);
    document.title = 'Invoice';

    jq('span.print').click(() => window.print());
    jq('span.close').click(() => window.close());
    jq('span.share').click(() => {
        let { entity } = getSettings();
        let key = `${entity.entity_id}-${orderid}`;
        let url = `${window.location.origin}/order/print/?key=${key}`;
        let message = `View Order\n${url}`;
        let encodedMessage = encodeURIComponent(message);
        let location = `https://api.whatsapp.com/send/?text=${encodedMessage}`;
        window.close();
        window.open(location);
    })

    let x = 1;
    jq('div.copy-type').click(function () {
        let arr = ['(ORIGINAL FOR RECIPIENT)', '(DUPLICATE COPY)', '(FOR TRANSPORT)'];
        jq(this).text(arr[x]);
        x++
        if (x >= arr.length) x = 0;
    })

    // document.getElementById('extractStylesButton').addEventListener('click', extractHTMLWithStyles);
    // extractHTMLWithStyles();
})


async function fetchOrder(orderid) {
    try {
        if (!orderid) throw 'Unable to Fetch Order, Please Try Again!';
        let { entity } = getSettings();
        if (!entity?.entity_name) throw 'Unable to Fetch Order, Please Try Again!';

        let res = await fetchOrderData({ folder: entity.entity_id, orderid });
        let { orderData: [od], itemsData: items, gsData: [gs], grData: [gr] } = res; //log(od);

        // entity
        jq('#entity .entity-name').text(entity.entity_name);

        let ent = `
            <span class="mb-1 fst-italic">${entity.tag_line || ''}</span>
            <span class="${entity.address ? '' : 'd-none'}">${entity.address}</span>            
            <div class="d-flex jcc aic gap-2">
                <span class="${entity.city ? '' : 'd-none'}">${entity.city}</span>
                <span class="${entity.state ? '' : 'd-none'}">${entity.state}</span>
                <span class="${entity.pincode ? '' : 'd-none'}">${entity.pincode}</span>
            </div>
            <span class="${entity.contact ? '' : 'd-none'}">${entity.contact}</span>
            <div class="d-flex jcc aic gap-2">
                <span class="${entity.email ? '' : 'd-none'}">${entity.email}</span>
                <span class="${entity.website ? '' : 'd-none'}">${entity.website}</span>
            </div>
            <div class="d-flex jcc aic gap-2 mt-1 font-monospace ${entity.gst_num ? '' : 'd-none'}"  style="font-size: 1rem; letter-spacing: 1px;">
                <span class="fw-500">GST Number:</span>
                <span class="fw-bold">${entity.gst_num}</span>
            </div>`;
        jq('#entity-details').html(ent);

        jq('span.for-entity').html(`For <span class="fw-500">${entity.entity_name}</span>`);
        jq('span.comments').text(od.notes)

        // party
        jq('.bill-number').text(od.inv_number);
        jq('.bill-date').html(`${od?.bill_date || moment(od?.order_date).format('DD-MM-YYYY')}`);
        jq('.party-name').text(od.party_name)

        let billing = `
            <span class="small fw-500 mb-1">BILLED TO</span>
            <span class="title">${od.title || 'M/s'}</span>
            <span class="party-name fw-500">${od.party_name}</span>
            <span class="address">${od.address || ''}</span>
            <span class="city">${od.city || ''}</span>
            <div class="d-flex jcs aic gap-2 mb-1">
                <span class="state">${od.state || ''}</span>
                <span class="pincode">${od.pincode || ''}</span>
            </div>
            <div class="d-flex jsc aic gap-2 ${od.gst_number ? '' : 'd-none'}">
                <span class="fw-500">GST Number:</span>
                <span class="gst-number fw-500" style="letter-spacing: 1px;">${od.gst_number}</span>
            </div>`;
        jq('#billing').html(billing);

        let shipping = `
            <span class="small fw-500 mb-1">SHIPED TO</span>
            <span class="title">${od.title || 'M/s'}</span>
            <span class="party-name fw-500">${od.party_name || ''}</span>
            <span class="address">${od.address || od.ship_address || ''}</span>
            <span class="city">${od.city || ''}</span>
            <div class="d-flex jcs aic gap-2">
                <span class="state">${od.state || ''}</span>
                <span class="pincode">${od.pincode || ''}</span>
            </div>`;
        jq('#shipping').html(shipping);

        // items
        let tbl = createTable(items, true, false);
        parseData({
            tableObj: tbl,
            colsToParse: ['price', 'disc', 'gst', 'tax', 'net', 'total', 'qty'],
            colsToRight: ['price', 'disc', 'gst', 'tax', 'net', 'total'],
            hideBlanks: ['sku', 'pcode', 'hsn', 'size', 'unit', 'disc', 'gst', 'tax'],
            colsToCenter: ['qty'],
        })

        jq('.quantity').text(parseDecimal(gs.gs));

        let bank = `
                <div class="d-flex jcb aic gap-2 pb-1 fw-500">
                    BANK DETAILS                    
                </div>
                <div class="d-flex jcb aic gap-2 pb-1">
                    BANK
                    <span class=""></span>
                </div>
                <div class="d-flex jcb aic gap-2 pb-1">
                    BRANCH
                    <span class=""></span>
                </div>
                <div class="d-flex jcb aic gap-2 pb-1">
                   ACCOUNT
                    <span class=""></span>
                </div>
                <div class="d-flex jcb aic gap-2 pb-1">
                    IFSC Code
                    <span class=""></span>
                </div>
                <div class="d-flex jcb aic gap-2 pb-1">
                    UPI ID
                    <span class=""></span>
                </div>`;

        jq('#bank-details').addClass('d-none').html(bank);

        let str = ` 
                <div class="d-flex flex-column gap-0 h-100">
                    <div class="d-flex jce aic gap-2 pb-1 fw-500">
                        SUBTOTAL
                        <span class="text-end" style="min-width: 75px;">${parseDecimal(od.subtotal)}</span>
                    </div>
                    <div class="d-flex jce aic gap-2 pb-1 ${parseNumber(od?.discount) ? '' : 'd-none'}">
                        DISCOUNT
                        <span class="text-end" style="min-width: 75px;">${parseDecimal(od.discount)}</span>
                    </div>
                    <div class="d-flex flex-column gap-0 ${parseNumber(od.totaltax) ? '' : 'd-none'}">
                        <div class="d-flex jce aic gap-2 pb-1 ${od.gst_type == 'igst' ? 'd-none' : ''}">
                            CGST
                            <span class="text-end" style="min-width: 75px;">${parseDecimal(parseNumber(od.totaltax) / 2)}</span>
                        </div>
                        <div class="d-flex jce aic gap-2 pb-1 ${od.gst_type == 'igst' ? 'd-none' : ''}">
                            SGST
                            <span class="text-end" style="min-width: 75px;">${parseDecimal(parseNumber(od.totaltax) / 2)}</span>
                        </div>
                        <div class="d-flex jce aic gap-2 pb-1 ${od.gst_type == 'igst' ? '' : 'd-none'}">
                            IGST
                            <span class="text-end" style="min-width: 75px;">${parseDecimal(parseNumber(od.totaltax))}</span>
                        </div>
                    </div>
                    <div class="d-flex jce aic gap-2 pb-1 ${parseNumber(od?.freight) ? '' : 'd-none'}">
                        FREIGHT
                        <span class="text-end" style="min-width: 75px;">${parseDecimal(od.freight)}</span>
                    </div>
                    <div class="d-flex jce aic gap-2 pb-1 ${parseNumber(od?.round_off) ? '' : 'd-none'}">
                        ROUND OFF
                        <span class="text-end" style="min-width: 75px;">${parseDecimal(od.round_off)}</span>
                    </div>
                    <div class="d-flex jce aic gap-2 pb-1 fw-bold mt-auto">
                        TOTAL
                        <span class="text-end" style="min-width: 75px;">${parseCurrency(od.alltotal)}</span>
                    </div>
                </div>`;

        jq('#totals').html(str);

        jq(tbl.tbody).find(`[data-key="gst"]`).each(function (i, e) {
            let gst = this.textContent;
            jq(this).html(gst + '%')
        })
        jq(tbl.table).css('--custom-tbl-size', '0.8rem')

        jq('#order-items').html(tbl.table);
        jq('div.view-order, div.status').toggleClass('d-none');

    } catch (error) {
        jq('#order').removeClass('d-none').text(error);
        log(error);
    }
}

function extractRelevantStyles() {
    // Create a new HTML document
    let htmlDoc = document.implementation.createHTMLDocument('Styled Page');
    
    // Get the original document's HTML content
    const bodyContent = document.body.innerHTML;
    const headContent = document.head.innerHTML;
    
    // Add HTML content to the new document
    htmlDoc.body.innerHTML = bodyContent;
    htmlDoc.head.innerHTML = headContent;

    // Find all unique CSS class names and inline styles used on the page
    const elements = document.querySelectorAll('*');
    let classList = new Set();  // Unique class names
    let inlineStyles = '';

    elements.forEach((element) => {
        // Collect class names
        element.classList.forEach((className) => {
            classList.add(className);
        });

        // Collect inline styles
        const elementStyle = element.getAttribute('style');
        if (elementStyle) {
            inlineStyles += `${element.tagName.toLowerCase()}[style] { ${elementStyle} }\n`;
        }
    });

    // Fetch relevant CSS rules from all stylesheets
    let styleTag = htmlDoc.createElement('style');
    let relevantCSS = '';

    for (let i = 0; i < document.styleSheets.length; i++) {
        let sheet = document.styleSheets[i];
        
        try {
            let rules = sheet.cssRules || sheet.rules;  // Access CSS rules
            for (let j = 0; j < rules.length; j++) {
                let rule = rules[j];
                
                // Check if the rule matches any class in classList
                classList.forEach((className) => {
                    if (rule.selectorText && rule.selectorText.includes(`.${className}`)) {
                        relevantCSS += rule.cssText + '\n';
                    }
                });
            }
        } catch (e) {
            console.warn(`Cannot access rules from stylesheet: ${sheet.href}`);
        }
    }

    // Add collected inline styles and relevant CSS to the new style tag
    styleTag.innerHTML = relevantCSS + inlineStyles; log(styleTag); return;
    htmlDoc.head.appendChild(styleTag);

    // Convert the new document to a string and open it in a new window/tab
    const newHTML = '<!DOCTYPE html>\n' + htmlDoc.documentElement.outerHTML;
    const newWindow = window.open('', '_blank');
    newWindow.document.open();
    newWindow.document.write(newHTML);
    newWindow.document.close();
}

// Call the function (or tie it to a button)
// extractRelevantStyles();



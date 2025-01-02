
import { initLocaldb } from './_localdb.js';
import { jq, log, doc, formDataToJson, getData, create, getCookie, isRrestricted } from './help.js';

doc.addEventListener('DOMContentLoaded', function () {
    // showList(list);
    loadMenuItems(list);
    jq('#search').keyup(function () {
        let arr = filterList(list, this.value);
        // showList(arr);
        loadMenuItems(arr)
    })
    initLocaldb();

})

let urlstr = '/apps/app/';

let closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M130-130v-65.77l60-60V-130h-60Zm160 0v-225.77l60-60V-130h-60Zm160 0v-285.77l60 61V-130h-60Zm160 0v-224.77l60-60V-130h-60Zm160 0v-385.77l60-60V-130h-60ZM130-351.23v-84.54l270-270 160 160 270-270v84.54l-270 270-160-160-270 270Z"/></svg>';

let salesIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M100-140v-60h760v60H100Zm40-115.39V-500h100v244.61H140Zm193.08 0V-700h100v444.61h-100Zm193.46 0V-580h100v324.61h-100Zm193.46 0V-820h100v564.61H720Z"/></svg>';

let stockIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M212.31-100q-29.92 0-51.12-21.19Q140-142.39 140-172.31v-447.92q-17.61-9.08-28.81-25.81Q100-662.77 100-684.62v-103.07q0-29.92 21.19-51.12Q142.39-860 172.31-860h615.38q29.92 0 51.12 21.19Q860-817.61 860-787.69v103.07q0 21.85-11.19 38.58-11.2 16.73-28.81 25.81v447.92q0 29.92-21.19 51.12Q777.61-100 747.69-100H212.31ZM200-612.31v438.08q0 6.15 4.42 10.19 4.43 4.04 10.97 4.04h532.3q5.39 0 8.85-3.46t3.46-8.85v-440H200Zm-27.69-60h615.38q5.39 0 8.85-3.46t3.46-8.85v-103.07q0-5.39-3.46-8.85t-8.85-3.46H172.31q-5.39 0-8.85 3.46t-3.46 8.85v103.07q0 5.39 3.46 8.85t8.85 3.46Zm195.38 249.62h224.62V-480H367.69v57.31ZM480-386.15Z"/></svg>';

let supIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-68.46 368.46-180H212.31Q182-180 161-201q-21-21-21-51.31v-535.38Q140-818 161-839q21-21 51.31-21h535.38Q778-860 799-839q21 21 21 51.31v535.38Q820-222 799-201q-21 21-51.31 21H591.54L480-68.46ZM200-278.31q54-53 125.5-83.5t154.5-30.5q83 0 154.5 30.5t125.5 83.5v-509.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v509.38Zm280-200.15q54.15 0 92.08-37.92Q610-554.31 610-608.46t-37.92-92.08q-37.93-37.92-92.08-37.92t-92.08 37.92Q350-662.61 350-608.46t37.92 92.08q37.93 37.92 92.08 37.92ZM257.69-240h444.62v-8.46q-47.39-42.31-103.96-63.08-56.58-20.77-118.35-20.77-61 0-117.77 20.58-56.77 20.58-104.54 62.5v9.23ZM480-538.46q-28.85 0-49.42-20.58Q410-579.61 410-608.46t20.58-49.42q20.57-20.58 49.42-20.58t49.42 20.58Q550-637.31 550-608.46t-20.58 49.42q-20.57 20.58-49.42 20.58Zm0-.69Z"/></svg>';

const list = [
    { key: 'closing', name: 'Closing', url: `${urlstr}closing`, icon: 'checklist', class: '', bsicon: closeIcon, img: '', rc: 'jDzNlYbp', hidden: false },
    { key: 'sales', name: 'Sales', url: `${urlstr}sales`, icon: 'list_alt', class: '', bsicon: salesIcon, img: '', rc: 'klidFVCa', hidden: false },
    { key: 'orders', name: 'Orders', url: `${urlstr}orders`, icon: 'orders', class: '', bsicon: '<i class="bi bi-list-ol"></i>', rc: 'PgBXvEqD', img: '', },
    { key: 'neworder', name: 'New Order', url: `${urlstr}orders/create`, icon: 'orders', class: '', bsicon: '<i class="bi bi-receipt"></i>', img: '', rc: '', hidden: false },
    { key: 'party', name: 'Partys', url: `${urlstr}partys`, icon: 'group', class: '', bsicon: '<i class="bi bi-people"></i>', img: '', rc: '', hidden: false },
    { key: 'dues', name: 'Party Dues', url: `${urlstr}dues`, icon: 'contact_page', class: '', bsicon: '<i class="bi bi-plus-slash-minus"></i>', img: '', rc: 'eLpjxhZi', hidden: false },
    { key: 'stock', name: 'Stock', url: `${urlstr}stock`, icon: 'inventory', class: '', bsicon: stockIcon, img: '', rc: '', hidden: false },
    { key: 'purchase', name: 'Purchase', url: `${urlstr}purch`, icon: 'shopping_cart', class: '', bsicon: '<i class="bi bi-bag-check"></i>', img: '', rc: 'WnkzKJLc', hidden: false },
    { key: 'supplier', name: 'Suppliers', url: `${urlstr}supplier`, icon: 'shopping_cart', class: '', bsicon: supIcon, img: '', rc: 'FROKLrJs', hidden: false },
    { key: 'payments', name: 'Payments', url: `${urlstr}pymts`, icon: 'currency_rupee', class: '', bsicon: '<i class="bi bi-currency-rupee"></i>', img: '', rc: '', hidden: false },
    { key: 'sold', name: 'Sold', url: `${urlstr}sold`, icon: 'filter_list', class: '', bsicon: '<i class="bi bi-arrow-return-right"></i>', img: '', rc: '', hidden: false },
    { key: 'gr', name: 'GR', url: `${urlstr}gr`, icon: 'filter_list', class: '', bsicon: '<i class="bi bi-arrow-return-left"></i>', img: '', rc: '', hidden: false },
    { key: 'notes', name: 'Notes', url: `${urlstr}notes`, icon: 'notes', class: '', bsicon: '<i class="bi bi-card-text"></i>', img: '', rc: '', hidden: false },
    { key: 'expense', name: 'Expenses', url: `${urlstr}expense`, icon: 'request_quote', class: '', bsicon: '<i class="bi bi-wallet2"></i>', img: '', rc: 'QUbxNZWM', hidden: false },
    { key: 'employee', name: 'Employees', url: `${urlstr}emp`, icon: 'person_apron', class: '', bsicon: '<i class="bi bi-person"></i>', img: '', rc: 'xyfztULQ', hidden: false },
    { key: 'banks', name: 'Banks', url: `${urlstr}banks`, icon: 'account_balance', class: '', bsicon: '<i class="bi bi-bank"></i>', img: '', rc: 'FnhxaHlT', hidden: false },
    { key: 'users', name: 'Users', url: `${urlstr}users`, icon: '', class: '', bsicon: '<i class="bi bi-person-check"></i>', img: '', rc: 'CrOdiKbL', hidden: false },
    { key: 'entity', name: 'Entity', url: `${urlstr}entity`, icon: '', class: '', bsicon: '<i class="bi bi-brightness-low"></i>', img: '', rc: 'ZKGfSuzx', hidden: false },
    // { key: 'settings', name: 'Settings', url: `${urlstr}settings`, icon: '', class:'', bsicon:'<i class="bi bi-gear"></i>', img: '', rc: '', hidden: false },
    // { key: 'switch', name: 'Switch App', url: '/apps', icon: 'toggle_on', class:'', bsicon:'<i class="bi bi-toggle-off"></i>', img: '', rc: '', hidden: false },
    { key: 'logout', name: 'Logout', url: '/logout', icon: 'logout', class: '', bsicon: '<i class="bi bi-box-arrow-right"></i>', img: '', rc: '', hidden: false },
]


function showList(list) {
    try {
        jq('ul').html('');
        for (let k of list) {
            let link = create('a');
            link.href = k.url;
            jq(link).addClass('list-group-item list-group-item-action d-flex jcb aic').text(k.name);
            if (k.hidden) jq(link).addClass('d-none');
            // jq(link).append(`<span class="material-symbols-outlined">${k.icon}</span>`);
            jq(link).append(`<span class="fs-4">${k.bsicon}</span>`);
            jq('ul.menu-list').append(link);
        }
    } catch (error) {
        log(error);
    }
}

function loadMenuItems(list) {
    try {
        jq('div.menu-items').html('');
        for (let k of list) {
            let icon = jq('<span></span>').addClass('fs-4').html(k.bsicon);
            let name = jq('<span></span>').addClass('fs-6').text(k.name);
            let content = jq('<div></div>').addClass('card-content d-flex flex-column jcc aic gap-1').append(icon, name);
            let card = jq('<div></div>').addClass(`ebs-card role-btn ${k.class}`).append(content);
            // jq(card).attr('href', k.url);

            jq(card).click(async function () {
                if (k.rc) { if (await isRrestricted(k.rc)) return; }
                window.location.href = k.url;
            })
            jq('div.menu-items').append(card);
        }
    } catch (error) {
        log(error);
    }
}

{/* <span class="material-symbols-outlined">home</span> */ }


function filterList(data, searchKeyword) {
    // Filter out the objects based on the search keyword
    const filteredObjects = data.filter(obj => {
        // Check if the object's key matches the search keyword
        return obj.name.toLowerCase().includes(searchKeyword.toLowerCase());
    });

    // Extract keys from the filtered objects
    const filteredKeys = filteredObjects.map(obj => obj);

    return filteredKeys;
}
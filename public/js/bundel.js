import 'https://code.jquery.com/jquery-3.6.1.min.js';
import 'https://unpkg.com/axios/dist/axios.min.js';

const help = {};
export default help;
export const log = console.log;
export const doc = document;
export const jq = jQuery;
export const axios = window.axios;

export function fd2obj({ formId, form }) {
    if (formId === null || form === null) return;
    const formElement = form ? form : document.getElementById(formId);
    const inputs = formElement.querySelectorAll('input, textarea, select');
    const output = {};
    inputs.forEach(input => {
        const value = input.value.trim();
        output[input.name] = value;
    });
    return output;
}
help.fd2obj = fd2obj;

export function fd2json({ formId, form }) {
    if (formId === null || form === null) return;
    const formEl = form ? form : document.getElementById(formId);
    const fd = new FormData(formEl);
    const object = {};
    for (let key of fd.keys()) { object[key] = fd.get(key) }
    return object;
}
help.fd2json = fd2json;

export async function postData(url, data) {
    try {
        if (!url) throw 'Invalid/Missign URL';
        if (!data) throw 'Invalid/Missing Data';
        let res = await axios.post(url, data);
        return res;
    } catch (error) {
        log(error);
    }
}
help.postData = postData;

export async function getData(url) {
    try {
        if (!url) throw 'Invalid/Missign URL';
        let res = axios.get(url);
        return res;
    } catch (error) {
        log(error);
    }
}
help.getData = getData;
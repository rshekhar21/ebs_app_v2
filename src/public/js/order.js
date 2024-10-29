import { deleteIndexDB, initLocaldb } from "./_localdb.js";
import help, { Storage, advanceQuery, create, createEL, createStuff, createTable, doc, fd2json, getSettings, jq, log, parseData, parseNumber, queryData, setAppID, showCalender, showModal, storeId, sumArray, updatePopupPosition, xdb } from "./help.js";
import { _searchParty, createEditParty, editParty } from "./module.js";
import { resetOrder, setDate, updateDetails, loadOrderDetails, skuMode, srchMode, showBilledItems, loadBillNumber, setItems, getOrderData, showOrderDetails, executeOrder, saveOrder, refreshOrder } from "./order.config.js";
import './_purchase/purch.js';
import 'https://unpkg.com/@zxing/library@0.18.6/umd/index.min.js';

doc.addEventListener('DOMContentLoaded', () => {
    loadOrderDetails();
    // setImages();  


    jq('div.order-date').click(function () {
        let cal = showCalender().modal;
        new bootstrap.Modal(cal).show();
        setDate(cal);
        jq(cal).find('td').click(function () {
            jq('#monthSelect, #yearSelect').change(function () {
                let modalInstance = bootstrap.Modal.getInstance('#calendarModal');
                let cal = modalInstance._element;
                setDate(cal);
            })
            loadOrderDetails();
        })
    })

    jq('div.order-number').click(function () {
        jq('form.order-number, div.order-number, button.reset-order').toggleClass('d-none')
        jq('input.order-number').focus();
    });

    jq('form.order-number').submit(function (e) {
        e.preventDefault();
        let val = jq('input.order-number').val();
        if (!val) {
            updateDetails({ manual_order_number: null });
            jq('form.order-number, div.order-number, button.reset-order').toggleClass('d-none');
            loadOrderDetails()
            return;
        }
        updateDetails({ manual_order_number: val });
        jq('form.order-number, div.order-number, button.reset-order').toggleClass('d-none');
        jq('input.order-number').val('');
        loadOrderDetails()
    })

    jq('span.party-info, span.close-info-box').click(function () {
        jq('ul.party-info-box').toggleClass('d-none')
    })

    jq('div.select-party').click(function () {
        jq('div.srch-party').removeClass('d-none');
        jq('div.party-details').addClass('d-none');
        const inputdiv = createEL('div');
        const input = createEL('input');
        input.classList.add('form-control');
        // input.style.focus.outline='none';
        input.type = 'search';
        input.placeholder = 'search party by name, contact';
        const srchdiv = createEL('div');
        srchdiv.className = 'position-absolute top-0 left-0 w-100 bg-white rounded z-3 p-2 mt-5 rounded border d-none';
        srchdiv.style.maxHeight = '250px';
        const btn = createEL('button');
        btn.type = 'button';
        jq(btn).addClass('btn btn-light border').html('<i class="bi bi-x-lg"></i>').click(function () {
            let party = getOrderData().party || null;
            if (party) {
                jq('div.srch-party').addClass('d-none');
                jq('div.party-details').removeClass('d-none');
            } else {
                jq('div.srch-party').addClass('d-none')
            }
        });
        let [srch] = jq('<span></span>')
            .addClass('role-btn input-group-text')
            .html('<i class="bi bi-search"></i>')
            .click(async function () {
                jq('div.party-sync-status').removeClass('d-none')
                const { data } = await advanceQuery({ key: 'party' }); //log(data);
                const db = new xdb(storeId, 'partys');
                await db.clear()
                await db.add(data);
                jq('div.party-sync-status').addClass('d-none');
                jq('span.party-synced').removeClass('d-none');
                setTimeout(() => {
                    jq('span.party-synced').addClass('d-none')
                }, 3000);
            });
        jq(inputdiv).addClass('input-group w-100').append(srch, input, btn);
        jq('div.srch-party').html('').append(inputdiv, srchdiv);
        jq(input).on('search', function () { jq(srchdiv).addClass('d-none').html('') })
        jq(input).keyup(async function () {
            try {
                let srchtrm = this.value;
                if (!srchtrm) {
                    jq(srchdiv).addClass('d-none').html('');
                    return
                };
                let arr = await _searchParty(srchtrm);
                // create party
                if (!arr.length) {
                    let btn = createEL('button');
                    jq(btn).addClass('btn btn-primary btn-sm w-100').text('+ Party').click(async function () {
                        let res = await createEditParty({
                            modalSize: 'modal-md',
                            quick: true,
                            callback: () => {
                                if (res.affectedRows) {
                                    let party = res.insertId;
                                    updateDetails({ party, party_name: res.fd.party_name })
                                }
                            }
                        });
                        res.mb.addEventListener('shown.bs.modal', function () {
                            if (isNaN(srchtrm)) {
                                jq('#party_name').val(srchtrm.toUpperCase().trim());
                                jq('#contact').focus();
                            } else {
                                jq('#contact').val(srchtrm.trim());
                                jq('#party_name').focus();
                            }
                        })
                    })
                    jq(srchdiv).removeClass('d-none').html(btn);
                    return
                };
                // load party
                let tbl = createTable(arr, false);
                parseData({ tableObj: tbl, colsToRight: ['contact'], colsToHide: ['id', 'party_id', 'email'] });
                jq(tbl.tbody).find('tr').addClass('role-btn').each(function (i, e) {
                    jq(e).click(function () {
                        let party = jq(this).find(`[data-key="id"]`).text(); //log(party)
                        let party_name = jq(this).find(`[data-key="party"]`).text(); //log(party_name);
                        jq(srchdiv).html('')
                        jq('div.srch-party').addClass('d-none');
                        jq('div.party-info').html('<i class="bi bi-info-circle-fill"></i>');
                        updateDetails({ party, party_name })
                        loadOrderDetails();
                    })
                })
                jq(srchdiv).removeClass('d-none').html(tbl.table);
            } catch (error) {
                log(error);
            }
        })
        jq(input).focus();
    })

    jq('button.new-order').click(function () {
        let cnf = confirm('Reset Order?');
        if (cnf) {
            resetOrder();
            refreshOrder();
        }
    })

    jq('button.execute').click(async function () {
        let { total } = getOrderData();
        if (!total) return;
        let cnf = confirm('Execute Order?');
        if (!cnf) return;
        jq('div.execute-status').removeClass('d-none');
        await saveOrder();
        jq('div.exe-status, div.order-saved').toggleClass('d-none');
    })

    let lastWin = null;
    jq('div.view-order').click(async function () {
        try {
            if (lastWin && !lastWin.closed) {
                lastWin.focus();
                return;
            }
            let db = new xdb(storeId, 'orders');
            let id = await db.maxId();
            let [data] = await db.get(id);
            let url = `${window.location.origin}/apps/order/thermal/?orderid=${data.order_id}`;
            let height = window.innerHeight;
            let width = window.innerWidth;
            lastWin = window.open(url, "_blank", "top=0, width=550, height=100");
            lastWin.resizeTo(550, height);
            lastWin.moveTo(width / 2 - 250, 0)
            jq('div.exe-status, div.order-saved').toggleClass('d-none');
            jq('div.execute-status').addClass('d-none');
        } catch (error) {
            log(error);
        }
    })

    jq('#option1').click(function () {
        updateDetails({ itemsMode: 'sku' });
        let isEmpty = jq('div.inputs').is(':empty');
        isEmpty ? skuMode() : jq('div.inputs').toggleClass('d-none');

    })

    jq('#option2').click(function () {
        jq('div.inputs').html('');
        updateDetails({ itemsMode: 'manual' });
        srchMode();
    })

    jq('span.refresh-stock').click(async function () {
        let [spinner] = jq('<div></div>').addClass('spinner-border spinner-border-sm text-primary');
        jq(this).html(spinner);
        const { data } = await advanceQuery({ key: 'stock' });
        const db = new xdb(storeId, 'stock');
        await db.clear()
        await db.add(data);
        let [synced] = jq('<span></span>').addClass('text-success').html('<i class="bi bi-patch-check-fill"></i>');
        jq(this).html(synced);
        setTimeout(() => {
            jq(this).html('<i class="bi bi-search"></i>')
        }, 3000);
    })

    jq('button.close-item-edit').click(function () {
        jq('div.item-ctrl').addClass('d-none');
        showBilledItems();
    })

    jq('button.set-subtotal').click(async function () {
        let { discount, freight, gstType, taxType, disc_percent } = getOrderData();
        let res = await createStuff({
            title: 'Order',
            table: 'overheads',
            modalSize: 'modal-md',
            applyCallback,
            defaultInputValues: [
                { inputId: 'disc', value: disc_percent ? '' : discount ? discount : '' },
                { inputId: 'perc', value: disc_percent ? disc_percent : '' },
                { inputId: 'freight', value: freight ? freight : '' },
                { inputId: 'gstType', value: gstType ? gstType : '' },
                { inputId: 'taxType', value: taxType ? taxType : '' },
            ],
            focus: '#perc',
            cb: null,
        });
        let mb = res.mb; //log(res);

        jq(mb).find('div.freight').before('<div class="d-flex jcb aic gap-2 even discount w-100"></div>')
        jq(mb).find('div.perc, div.disc').appendTo(jq(mb).find('div.discount'));

        jq(mb).find('div.freight').after('<div class="d-flex jcb aic gap-2 even taxamt w-100"></div>');
        jq(mb).find('div.gstType, div.taxType').addClass('w-50').appendTo(jq(mb).find('div.taxamt'));

        function applyCallback() {
            let fd = res.fd;
            let { freight, taxType, gstType } = res.fd; //log(fd, freight); return;
            const disc = parseNumber(fd.disc);
            const perc = parseNumber(fd.perc);

            if (!disc) {
                updateDetails({
                    disc: 0, discount: 0, disc_id: null, disc_type: null,
                    disc_percent: null, freight, taxType, gstType
                });
            }

            const { items } = getOrderData();
            const subtotal = items.map(item => (item.clc)).reduce((prev, curr) => prev + curr, 0);
            const percent = perc ? true : false;
            const discount = percent ? (subtotal * perc) / 100 : disc;
            updateDetails({
                disc: percent ? null : discount, disc_id: null,
                disc_type: percent ? '%' : "#", disc_percent: perc || null, discount,
                freight, taxType, gstType
            });
            jq('span.success').removeClass('d-none');
            jq('span.fail').addClass('d-none');
            loadOrderDetails();
            jq(mb).modal('hide').remove();
        }
    })

    jq('span.cash-pymt').click(function () {
        let data = getOrderData();
        if (!data.total) return;
        let cash = data.total; //log(cash); 
        let obj = { cash: cash, bank: 0, other: 0, amount: cash, bank_mode: null, bank_id: null, pymt_method: null, notes: null };
        updateDetails({ pymt: cash, pymts: [] });
        updateDetails({ pymts: [obj] })
        loadOrderDetails();
    })

    jq('span.del-pymt').click(function () {
        let { total, pymt } = getOrderData();
        if (!total || !pymt) return;
        let cnf = confirm('Delete Paymet?');
        if (!cnf) return;
        updateDetails({ pymts: [], pymt: 0 });
        loadOrderDetails();
    })

    jq('span.add-pymt').click(async function () {
        let { total, pymts } = getOrderData();
        if (!total) return;
        let data = pymts[0];
        let res = await createStuff({
            title: 'Add Payment',
            table: 'order_pymt',
            modalSize: 'modal-md',
            focus: '#cash',
            defaultInputValues: data?.amount ? ([
                { inputId: 'cash', value: data?.cash },
                { inputId: 'bank', value: data?.bank },
                { inputId: 'bank_mode', value: data?.bank_mode },
                { inputId: 'bank_id', value: data?.bank_id },
                { inputId: 'pymt_method', value: data?.pymt_method },
            ]) : [],
            applyCallback: applyPymt,
            cb: loadOrderDetails
        });
        let mb = res.mb;
        jq(mb).find('div.pymt_method').addClass('d-none');
        if (data?.bank_mode == 'Online') { jq(mb).find('div.pymt_method').removeClass('d-none'); }

        jq(mb).find('#bank_mode').change(function () {
            jq('div.pymt_method').toggleClass('d-none', this.value.toLowerCase() !== 'online');
        });

        jq('#cash, #bank').change(async function () {
            // let banks = jq('#cards, #online').map(function () { return this.valueAsNumber || 0 }).get();
            let pymts = jq('#cash, #bank').map(function () { return this.valueAsNumber || 0 }).get();
            let amount = sumArray(pymts);

            jq('#amount').val(amount);

            if (jq('#bank').val()) {
                let settings = getSettings();
                let defaultBank = settings?.default_bank;
                if (defaultBank) {
                    jq('#bank_id').val(defaultBank)
                } else {
                    // let rs = await help.advanceQuery({ key: 'defaultbank' });
                    // let defaultBank = rs.data[0].default_bank;
                    // if (defaultBank) jq('#bank_id').val(defaultBank);
                };
            }
        })


        // pymt form submit event
        function applyPymt() {
            try {
                let { fd } = res;
                let pymtsarr = jq('#cash, #bank').map(function () { return this.valueAsNumber || 0 }).get(); //log(pymts);
                let amount = sumArray(pymtsarr);
                jq('#amount').val(amount);
                let { cash, bank, bank_id = null, bank_mode, pymt_method = null } = fd
                bank = parseNumber(bank);
                cash = parseNumber(cash);
                let pymts = [
                    {
                        amount, bank, bank_id, bank_mode, cash, notes: null, other: 0,
                        pymt_method: bank_mode == 'Card' ? null : pymt_method,
                    }
                ];
                updateDetails({ pymt: amount })
                updateDetails({ pymts: [] })
                updateDetails({ pymts })
                jq('span.success').toggleClass('d-none', !amount);
                jq('span.fail').toggleClass('d-none', !!amount);
            } catch (error) {
                log(error);
            }
        }
    })

    jq('button.qty-plus').click(function () {
        let inputQty = jq('#edit-qty').val();
        jq('#edit-qty').val(parseNumber(inputQty) + 1)
    })

    jq('button.qty-minus').click(function () {
        let inputQty = jq('#edit-qty').val();
        jq('#edit-qty').val(parseNumber(inputQty) - 1)
    })

    jq('#add-manual').submit(function (e) {
        try {
            e.preventDefault();
            let fd = fd2json({ form: this });
            if (!fd.product) return
            if (!fd.price) { jq('input.price').addClass('is-invalid'); return }
            if (!fd.qty) { jq('input.qty').addClass('is-invalid'); return }
            let obj = setItems(fd);
            updateDetails({ items: [obj] });
            loadOrderDetails();
            jq(this)[0].reset();
            jq('input.price, input.qty').removeClass('is-invalid');
            jq('input.product').focus();
        } catch (error) {
            log(error);
        }
    })

    jq('#item-edit-form').submit(function (e) {
        try {
            e.preventDefault();
            let fd = fd2json({ form: this });
            let obj = setItems(fd);
            let index = fd.index;
            let { items } = getOrderData();
            const updatedItems = items.map((item, i) => i == index ? { ...item, ...obj } : item);
            updateDetails({ items: [] });
            updateDetails({ items: updatedItems });
            jq('#item-edit-form')[0].reset();
            jq('div.item-ctrl').addClass('d-none');
            loadOrderDetails();
        } catch (error) {
            log(error);
        }
    })

    jq('button.maximise-items').click(function () {
        jq('div.items-list').toggleClass('position-absolute top-0 start-0 w-100 h-100 z-3').css('max-height', '100dvh')
        jq('button.close-list').toggleClass('d-none')
    })

    jq('button.close-list').click(function () {
        jq('div.items-list').toggleClass('position-absolute top-0 start-0 w-100 h-100 z-3').css('max-height', '210px')
        jq('button.close-list').toggleClass('d-none')
    })

    jq('div.freight').click(function () {
        jq('div.freight, form.add-freight').toggleClass('d-none');
        // jq('form.add-freight').removeClass('d-none');
        jq('form.add-freight input').val('').focus();
    })

    jq('button.close-execute-status').click(function () {
        jq('div.execute-status').addClass('d-none');
    })

    jq('span.edit-party').click(function () {
        let party = getOrderData().party;
        createEditParty({
            update_id: party,
            callback: loadOrderDetails
        })
    })

    jq('a.resetIDB').click(function () {
        deleteIndexDB(storeId);
        initLocaldb();
    })

    jq('#order-comments').blur(function () {
        updateDetails({ notes: this.value })
    })

    // const codeReader = new ZXing.BrowserMultiFormatReader();
    // let isScanning = false; // Moved outside to maintain state
    // $('#scanButton').click(function () {
    //     try {
    //         if (isScanning) {
    //             // Stop scanning
    //             codeReader.reset();
    //             $('#video').hide();
    //             $('#scanButton').text('Scan');
    //             isScanning = false;
    //             return;
    //         }

    //         // Start scanning
    //         // Request camera access explicitly
    //         navigator.mediaDevices.getUserMedia({ video: true })
    //             .then((stream) => {
    //                 // Camera access granted
    //                 // Stop the stream as we only needed permission
    //                 stream.getTracks().forEach(track => track.stop());

    //                 // Proceed to list video input devices
    //                 return codeReader.listVideoInputDevices();
    //             })
    //             .then((videoInputDevices) => {
    //                 console.log("Available Video Input Devices:", videoInputDevices);
    //                 if (videoInputDevices.length === 0) {
    //                     alert('No video input devices found.');
    //                     return;
    //                 }

    //                 // Display device details for debugging
    //                 alert(JSON.stringify(videoInputDevices[0], null, 2));

    //                 const firstDevice = videoInputDevices[0];
    //                 if (!firstDevice.deviceId) {
    //                     alert('deviceId is undefined.');
    //                     console.error('deviceId:', firstDevice.deviceId);
    //                     return;
    //                 }

    //                 const firstDeviceId = firstDevice.deviceId;
    //                 console.log("Using Device ID:", firstDeviceId);

    //                 // Start decoding from the first device
    //                 codeReader.decodeFromVideoDevice(firstDeviceId, 'video', (result, err) => {
    //                     if (result) {
    //                         $('#result').html("<p>Scanned Code: " + result.text + "</p>");
    //                         codeReader.reset();
    //                         $('#video').hide();
    //                         $('#scanButton').text('Scan');
    //                         isScanning = false;
    //                     }
    //                     if (err && !(err instanceof ZXing.NotFoundException)) {
    //                         console.error(err);
    //                         alert(err);
    //                         // Handle errors
    //                     }
    //                 });

    //                 $('#video').show();
    //                 $('#scanButton').text('Stop Scanning');
    //                 isScanning = true;
    //             })
    //             .catch((err) => {
    //                 console.error('Error accessing camera or enumerating devices:', err);
    //                 alert('Error accessing camera or enumerating devices: ' + err.message);
    //             });
    //     } catch (error) {
    //         console.error(error);
    //         alert('An unexpected error occurred: ' + error.message);
    //     }
    // });



})


// $(document).ready(function() {
//     const codeReader = new ZXing.BrowserMultiFormatReader();
//     let isScanning = false; // Moved outside to maintain state

//     $('#scanButton').click(function () {
//         try {
//             if (isScanning) {
//                 // Stop scanning
//                 codeReader.reset();
//                 $('#video-container').addClass('d-none'); // Updated to match HTML structure
//                 $('#scanButton').text('Scan');
//                 isScanning = false;
//                 return;
//             }

//             // Start scanning
//             // Request camera access explicitly
//             navigator.mediaDevices.getUserMedia({ video: true })
//                 .then((stream) => {
//                     // Camera access granted
//                     // Stop the stream as we only needed permission
//                     stream.getTracks().forEach(track => track.stop());

//                     // Proceed to list video input devices
//                     return codeReader.listVideoInputDevices();
//                 })
//                 .then((videoInputDevices) => {
//                     console.log("Available Video Input Devices:", videoInputDevices);
//                     if (videoInputDevices.length === 0) {
//                         alert('No video input devices found.');
//                         return;
//                     }

//                     // Display device details for debugging
//                     // alert(JSON.stringify(videoInputDevices[0], null, 2));

//                     const firstDevice = videoInputDevices[0];
//                     if (!firstDevice.deviceId) {
//                         alert('deviceId is undefined.');
//                         console.error('deviceId:', firstDevice.deviceId);
//                         return;
//                     }

//                     const firstDeviceId = firstDevice.deviceId;
//                     console.log("Using Device ID:", firstDeviceId);

//                     // Start decoding from the first device
//                     codeReader.decodeFromVideoDevice(firstDeviceId, 'video', (result, err) => {
//                         if (result) {
//                             $('#result').html("<p>Scanned Code: " + result.text + "</p>");
//                             codeReader.reset();
//                             $('#video-container').addClass('d-none'); // Updated to match HTML structure
//                             $('#scanButton').text('Scan');
//                             isScanning = false;
//                         }
//                         if (err && !(err instanceof ZXing.NotFoundException)) {
//                             console.error(err);
//                             alert(err);
//                             // Handle errors
//                         }
//                     });

//                     $('#video-container').removeClass('d-none'); // Updated to match HTML structure
//                     $('#scanButton').text('Stop');
//                     isScanning = true;
//                 })
//                 .catch((err) => {
//                     console.error('Error accessing camera or enumerating devices:', err);
//                     alert('Error accessing camera or enumerating devices: ' + err.message);
//                 });
//         } catch (error) {
//             console.error(error);
//             alert('An unexpected error occurred: ' + error.message);
//         }
//     });
// });


$(document).ready(function() {
    const codeReader = new ZXing.BrowserMultiFormatReader();
    let isScanning = false;

    // Function to populate the camera selection dropdown
    function populateCameraSelect(videoInputDevices) {
        const $cameraSelect = $('#cameraSelect');
        $cameraSelect.empty(); // Clear existing options

        videoInputDevices.forEach((device, index) => {
            const deviceLabel = device.label || `Camera ${index + 1}`;
            $cameraSelect.append(`<option value="${device.deviceId}">${deviceLabel}</option>`);
        });
    }

    $('#scanButton').click(function () {
        try {
            if (isScanning) {
                // Stop scanning
                codeReader.reset();
                $('#video-container').addClass('d-none');
                $('#scanButton').text('Scan');
                isScanning = false;
                return;
            }

            // Start scanning
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
                .then((stream) => {
                    // Camera access granted
                    // Stop the stream as we only needed permission
                    stream.getTracks().forEach(track => track.stop());

                    video.srcObject = stream;
                    video.play();
                    // Proceed to list video input devices
                    return codeReader.listVideoInputDevices();
                })
                .then((videoInputDevices) => {
                    console.log("Available Video Input Devices:", videoInputDevices);
                    if (videoInputDevices.length === 0) {
                        alert('No video input devices found.');
                        return;
                    }

                    // Populate the camera selection dropdown
                    populateCameraSelect(videoInputDevices);

                    // Automatically select the back camera if available
                    let selectedDeviceId = null;
                    for (let device of videoInputDevices) {
                        const label = device.label.toLowerCase();
                        // alert(device.label.toLowerCase())
                        if (label.includes('back') || label.includes('rear') || label.includes('environment')) {
                            selectedDeviceId = device.deviceId;
                            // Set the dropdown to this device
                            $('#cameraSelect').val(selectedDeviceId);
                            break;
                        }
                    }

                    // If no back camera found, default to the first device
                    if (!selectedDeviceId) {
                        selectedDeviceId = videoInputDevices[0].deviceId;
                        console.warn('Back camera not found. Using the first available camera.');
                        $('#cameraSelect').val(selectedDeviceId);
                    }

                    console.log("Selected Device ID:", selectedDeviceId);

                    // Start decoding from the selected device
                    codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
                        if (result) {
                            $('#result').html("<p>Scanned Code: " + result.text + "</p>");
                            alert(result.text)
                            codeReader.reset();
                            $('#video-container').addClass('d-none');
                            $('#scanButton').text('Scan');
                            isScanning = false;
                        }
                        if (err && !(err instanceof ZXing.NotFoundException)) {
                            console.error(err);
                            alert(err);
                            // Handle errors
                        }
                    });

                    $('#video-container').removeClass('d-none');
                    $('#scanButton').text('Stop');
                    isScanning = true;
                })
                .catch((err) => {
                    console.error('Error accessing camera or enumerating devices:', err);
                    alert('Error accessing camera or enumerating devices: ' + err.message);
                });
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred: ' + error.message);
        }
    });

    // Optional: Allow users to switch cameras while scanning
    $('#cameraSelect').change(function() {
        if (isScanning) {
            const selectedDeviceId = $(this).val();
            console.log("Switched to Device ID:", selectedDeviceId);
            codeReader.reset();
            codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
                if (result) {
                    $('#result').html("<p>Scanned Code: " + result.text + "</p>");
                    codeReader.reset();
                    $('#video-container').addClass('d-none');
                    $('#scanButton').text('Scan');
                    isScanning = false;
                }
                if (err && !(err instanceof ZXing.NotFoundException)) {
                    console.error(err);
                    alert(err);
                    // Handle errors
                }
            });
        }
    });
});


function setImages() {
    let imgarr = [
        '99fc167ac92d93d0117cfbed91b5c444',
        '8a244686ebf4547158323fb999697c73',
        '2f4090258d2d0a1eb381ba8241710a7d',
        '1e995d611d40f8690b9220125b8d3c9c',
        'ea6ac4ca9aa1b246b99d49133780b8d7',
        '28c1c2de514eb969c8f694fd729ce46a',
    ];
    let cnt = imgarr.length;
    let rnd = Math.floor(Math.random() * cnt);
    let img = imgarr[rnd];
    jq('div.execute-status').css('background-image', `url('/img/${img}.jpg')`)
}


// let x = Array.prototype.slice.call(res.obj.form); log(x);




import {IItem} from "@/components/upcLookup";
import {Runtime} from "webextension-polyfill";

const selectorProductNumber = '#radix-dialog-container input'


const waitForElm = async (selector: string): Promise<Element | null> => {
    return new Promise(resolve => {
        //@ts-ignore
        if (document.querySelector(selector) && (document.querySelector(selector)?.value ?? false)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            //@ts-ignore
            if (document.querySelector(selector) && (document.querySelector(selector)?.value ?? false)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
const waitForElmToNotExist = async (selector: string): Promise<boolean> => {
    return new Promise(resolve => {
        const el = document.querySelector(selector)
        if (typeof el == 'undefined' || el == null) {
            return resolve(true);
        }

        const observer = new MutationObserver(mutations => {
            const el = document.querySelector(selector)
            if (typeof el == 'undefined' || el == null) {
                observer.disconnect();
                resolve(true);
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


const waitForFieldToExistCallback = async (elm: Element | null) => {
    if (elm) {
        let loadingDiv = document.createElement('div')
        loadingDiv.style.display = 'inline-block'
        loadingDiv.innerHTML = '<svg style="display: block;    width: 100px; height: 20px;" version="1.1" id="upc-lookup-loading" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve"><circle fill="#006cb8" stroke="none" cx="6" cy="50" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1"></animate></circle><circle fill="#006cb8" stroke="none" cx="26" cy="50" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2"></animate></circle><circle fill="#006cb8" stroke="none" cx="46" cy="50" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3"></animate></circle></svg>'
        let a = document.createElement("a")
        a.innerText = 'Lookup UPC'
        a.style.cursor = 'pointer'
        //@ts-ignore: value undefined but it really is
        a.onclick = ()=>{
            const productInput = document.querySelector('#radix-dialog-container input')
            setLoading(true)
            //@ts-ignore: value undefined but it really is
            browser.runtime.sendMessage({upc: productInput?.value ?? ''
            } ) }
        elm.after(a, loadingDiv)

        //@ts-ignore: value undefined but it really is
        let upcValue = elm?.value ?? ''
        console.log('upc value: ' + upcValue);
        if (typeof upcValue == 'undefined' || upcValue == null || upcValue == '') {
            return
        }

        //do lookup in background
        browser.runtime.sendMessage({upc: upcValue})

        waitForElmToNotExist('#radix-dialog-container input').then(waitForFieldNotToExistCallback)
    }
}
const waitForFieldNotToExistCallback = async () => {
    //console.log('Popup is gone')
    waitForElm('#radix-dialog-container input').then(waitForFieldToExistCallback);
}

const updateFields = async (request: { task: string, product: IItem|null|undefined, base64:string|null|undefined }, sender: Runtime.MessageSender) => {
    console.log(request)
    if(request.task=='upcProductFill') {
        console.log('update product info on screen')
        console.log(request.product)

        //part number field
        const partNumberEl = document.querySelector('#radix-dialog-container [data-testid="manufacturer_part_number-input-text"]')
        //@ts-ignore
        if (partNumberEl) {
            //@ts-ignore
            partNumberEl.value = request.product?.model ?? ''
        }

        //upc field
        const upcEl = document.querySelector('#radix-dialog-container [data-testid="upc-input-text"]')
        //@ts-ignore
        if (upcEl) {
            //@ts-ignore
            upcEl.value = request.product?.upc ?? request.product?.ean ?? ''
        }

        //description field
        const descriptionEl = document.querySelector('#radix-dialog-container [name="description"]')
        //@ts-ignore
        if (descriptionEl) {
            //@ts-ignore
            descriptionEl.value = (request.product?.title ?? '') + " " + (request.product?.description ?? '')
            descriptionEl.innerHTML = (request.product?.title ?? '') + " " + (request.product?.description ?? '') + " " + (request.product?.dimension ?? '')
        }

        //category filed
        const categoryEl = document.querySelector('#radix-dialog-container [data-testid="part_category_id-react-select-container"] input');
        if (categoryEl) {
            //@ts-ignore
            categoryEl.value = request.product?.category ?? ''
            //@ts-ignore
            categoryEl.focus()
            categoryEl.dispatchEvent(new Event("input", {
                'bubbles': true
            }))
            setTimeout(() => {
                let evOptions = {
                    key: 'Enter',
                    code: 'Enter',
                    which: 13,
                    keyCode: 13,
                    'bubbles': true
                }
                categoryEl.dispatchEvent(new KeyboardEvent('keydown', evOptions))
                categoryEl.dispatchEvent(new KeyboardEvent('keyup', evOptions))
            }, 500)
        }

        //manufacturer field after category field is over
        setTimeout(() => {
            const manufacturerEl = document.querySelector('[data-testid="part_manufacturer_id-react-select-container"] input');
            if(manufacturerEl) {
                //@ts-ignore
                manufacturerEl.value = request.product?.brand ?? ''
                //@ts-ignore
                manufacturerEl.focus()
                manufacturerEl.dispatchEvent(new Event("input", {
                    'bubbles': true
                }))
                setTimeout(() => {
                    let evOptions = {
                        key: 'Enter',
                        code: 'Enter',
                        which: 13,
                        keyCode: 13,
                        'bubbles': true
                    }
                    manufacturerEl.dispatchEvent(new KeyboardEvent('keydown', evOptions))
                    manufacturerEl.dispatchEvent(new KeyboardEvent('keyup', evOptions))

                    //loading is over
                    setLoading(false)
                }, 500)
            }
        }, 700)
    }
    else if(request.task=='updateImage') {

        //convert base 64 to blob
        const response = await fetch(request.base64 ?? '');
        const imageBlob:Blob = await response.blob();

        let fileName = 'image.jpg'
        let file = new File([imageBlob], fileName, {type: "image/jpeg", lastModified: new Date().getTime()});

        let container = new DataTransfer();
        container.items.add(file);

        console.log(file)
        console.log(container)

        const fileEl = document.querySelector('#radix-dialog-container input[type="file"]')
        if(fileEl) {
            //@ts-ignore files exists
            fileEl.files = container.files;
            fileEl.dispatchEvent(new Event("input", {
                'bubbles': true
            }));
            fileEl.dispatchEvent(new Event("change", {
                'bubbles': true
            }))
        }
    }

}

const setLoading = (loading:boolean) =>{
    const loadingEl = document.getElementById('upc-lookup-loading')
    if(!loadingEl) {
        return
    }
    if(!loading) {
        loadingEl.style.display = 'none'
    }
    else {
        loadingEl.style.display = 'block'
    }
}

export default defineContentScript({
    matches: ['*://*.fleetio.com/*'],
    main() {

        //9781541736696

        //console.log('Watching for "add product" popup');
        waitForElm('#radix-dialog-container input').then(waitForFieldToExistCallback);


        browser.runtime.onMessage.addListener(updateFields);

    },
});

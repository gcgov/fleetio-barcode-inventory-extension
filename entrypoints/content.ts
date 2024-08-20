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


const addLookupUPCLinkAndLoading = async (elm: Element | null) => {
    let existingUpcLookupLinkEls = document.getElementsByClassName('upc-lookup-link')
    let existingUpcLookupLoadingEls = document.getElementsByClassName('upc-lookup-loading-container')
    if (elm && (existingUpcLookupLoadingEls.length==0 || existingUpcLookupLinkEls.length==0)) {
        elm.addEventListener("input", (event) => {
            console.log('change')
            console.log(event)
        });
        let loadingDiv = document.createElement('div')
        loadingDiv.classList.add('upc-lookup-loading-container')
        loadingDiv.style.display = 'inline-block'
        loadingDiv.innerHTML = '<svg style="display: block;    width: 100px; height: 20px;" version="1.1" class="upc-lookup-loading" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve"><circle fill="#006cb8" stroke="none" cx="6" cy="50" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1"></animate></circle><circle fill="#006cb8" stroke="none" cx="26" cy="50" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2"></animate></circle><circle fill="#006cb8" stroke="none" cx="46" cy="50" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3"></animate></circle></svg>'

        let a = document.createElement("a")
        loadingDiv.classList.add('upc-lookup-link')
        a.innerText = 'Lookup UPC'
        a.style.cursor = 'pointer'
        //@ts-ignore: value undefined but it really is
        a.onclick = ()=>{
            const productInput = elm
            setLoading(true)
            //@ts-ignore: value undefined but it really is
            browser.runtime.sendMessage({upc: productInput?.value ?? ''
            } ) }


        let messageDiv = document.createElement("div")
        messageDiv.classList.add('upc-lookup-message')
        messageDiv.classList.add('text-sm')
        messageDiv.classList.add('text-red-600')
        messageDiv.style.display = 'inline'
        messageDiv.style.fontStyle = 'italic'
        messageDiv.style.marginLeft = '10px'

        elm.after(a, loadingDiv, messageDiv)

        //@ts-ignore: value undefined but it really is
        let upcValue = elm?.value ?? ''
        console.log('upc value: ' + upcValue);
        if (typeof upcValue == 'undefined' || upcValue == null || upcValue == '') {
            return
        }

        //do lookup in background
        browser.runtime.sendMessage({upc: upcValue})

        //watch for the modal window to disappear and attach a callback
        waitForElmToNotExist('#radix-dialog-container input').then(waitForFieldNotToExistCallback)
    }
}
const waitForFieldNotToExistCallback = async () => {
    //console.log('Popup is gone')
    //modal window has closed; wait for the modal window to appear again and add the lookup link and loading
    waitForElm('#radix-dialog-container input').then((el)=>{ setTimeout(()=>{ addLookupUPCLinkAndLoading(el) }, 500)});
}

const updateFields = async (request: { task: string, product: IItem|null|undefined, base64:string|null|undefined }, sender: Runtime.MessageSender) => {
    console.log(request)
    if(request.task=='upcProductFill') {
        console.log('update product info on screen')
        console.log(request.product)

        //product not found
            if (request.product === null) {
                setMessage('Product details for this UPC not found. This does not mean it is an invalid UPC, just that there is no detail found from our UPC lookup provider.')
                setLoading(false)
            } else {
                setMessage('')
            }

        //part number field
        let partNumberEl = document.querySelector('#radix-dialog-container [data-testid="manufacturer_part_number-input-text"]')
        if(partNumberEl==null) {
            partNumberEl = document.querySelector('[data-testid="manufacturer_part_number-input-text"]')
        }
        //@ts-ignore
        if (partNumberEl) {
            //@ts-ignore
            partNumberEl.value = request.product?.model ?? ''
        }

        //upc field
        let upcEl = document.querySelector('#radix-dialog-container [data-testid="upc-input-text"]')
        if(upcEl==null) {
            upcEl = document.querySelector('[data-testid="upc-input-text"]')
        }
        //@ts-ignore
        if (upcEl) {
            //@ts-ignore
            upcEl.value = request.product?.upc ?? request.product?.ean ?? ''
        }

        //description field
        let descriptionEl = document.querySelector('#radix-dialog-container [name="description"]')
        if(descriptionEl==null) {
            descriptionEl = document.querySelector('[data-testid="description-textarea"]')
        }
        //@ts-ignore
        if (descriptionEl) {
            //@ts-ignore
            descriptionEl.value = (request.product?.title ?? '') + " " + (request.product?.description ?? '')
            descriptionEl.innerHTML = (request.product?.title ?? '') + " " + (request.product?.description ?? '') + " " + (request.product?.dimension ?? '')
        }

        //category filed
        let categoryEl = document.querySelector('#radix-dialog-container [data-testid="part_category_id-react-select-container"] input');
        if(categoryEl==null) {
            categoryEl = document.querySelector('[data-testid="part_category_id-react-select-container"] input');
        }
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
            let manufacturerEl = document.querySelector('#radix-dialog-container [data-testid="part_manufacturer_id-react-select-container"] input');
            if(manufacturerEl==null) {
                manufacturerEl = document.querySelector('[data-testid="part_manufacturer_id-react-select-container"] input');
            }
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

        let fileEl = document.querySelector('#radix-dialog-container input[type="file"]')
        if(fileEl==null) {
            fileEl = document.querySelector('input[type="file"]')
        }
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
    else if(request.task=='tabChanged') {
        console.log(document.location.href)
        if(document.location.href.endsWith('parts/new')) {
            setTimeout(()=>{
                addLookupUPCLinkAndLoading(document.querySelector('input[name="number"]'))
                waitForElm('input[name="number"]').then(addLookupUPCLinkAndLoading);
                setLoading(false)
            }, 2000)
        }
    }

}

const setLoading = (loading:boolean) =>{
    const loadingEls = document.getElementsByClassName('upc-lookup-loading')
    if(loadingEls.length==0) {
        return
    }

    for(let i=0; i<loadingEls.length; i++) {
        if(!loading) {
            //@ts-ignore style exists
            loadingEls[i].style.display = 'none'
        }
        else {
            //@ts-ignore style exists
            loadingEls[i].style.display = 'block'
        }
    }

}
const setMessage = (message:string) =>{
    const messageEl = document.querySelector('.upc-lookup-message')
    if(!messageEl) {
        return
    }

    messageEl.innerHTML = message

}

export default defineContentScript({
    matches: ['*://*.fleetio.com/*'],
    main() {

        //9781541736696
        waitForElm('#radix-dialog-container input').then(addLookupUPCLinkAndLoading);

        if(document.location.href.endsWith('parts/new')) {
            setTimeout(()=>{
                addLookupUPCLinkAndLoading(document.querySelector('input[name="number"]'))
                setLoading(false)
            }, 2000)
        }

        browser.runtime.onMessage.addListener(updateFields);

    },
});

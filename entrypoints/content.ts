import upcLookup, {IItem} from "@/components/upcLookup";

export default defineContentScript({
  matches: ['*://*.fleetio.com/*'],
  main() {
      const waitForElm = async (selector:string):Promise<Element|null> => {
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
      const waitForElmToNotExist = async (selector:string): Promise<boolean> => {
          return new Promise(resolve => {
              const el = document.querySelector(selector)
              if (typeof el=='undefined' || el==null ) {
                  return resolve(true);
              }

              const observer = new MutationObserver(mutations => {
                  const el = document.querySelector(selector)
                  if (typeof el=='undefined' || el==null ) {
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



      const waitForFieldToExistCallback = async (elm:Element|null) => {
          //console.log('element exists')
          if(elm) {
              //@ts-ignore: value undefined but it really is
              let upcValue = elm?.value ?? ''
              //console.log('upc value: '+upcValue);
              if (typeof upcValue == 'undefined' || upcValue == null || upcValue == '') {
                  return
              }

              //console.log('send upc to background lookup')

              //do lookup in background
              browser.runtime.sendMessage({upc:upcValue})

              waitForElmToNotExist('#radix-dialog-container input').then(waitForFieldNotToExistCallback)
          }
      }
      const waitForFieldNotToExistCallback = async () => {
          //console.log('Popup is gone')
          waitForElm('#radix-dialog-container input').then(waitForFieldToExistCallback);
      }


      //9781541736696

      //console.log('Watching for "add product" popup');
      waitForElm('#radix-dialog-container input').then(waitForFieldToExistCallback);


      browser.runtime.onMessage.addListener(
          function(request:{task:string, product:IItem|null}, sender, sendResponse) {
              console.log('update product info on screen')
              console.log(request.product)
              console.log(request.product?.category)
              const partNumberEl = document.querySelector('[data-testid="manufacturer_part_number-input-text"]');
              //@ts-ignore
              if(partNumberEl) {
                  console.log(partNumberEl)
                  //@ts-ignore
                  partNumberEl.value = request.product?.model ?? ''
              }

              const upcEl = document.querySelector('[data-testid="upc-input-text"]')
              //@ts-ignore
              if(upcEl) {
                  console.log(upcEl)
                  //@ts-ignore
                  upcEl.value = request.product?.upc ?? request.product?.ean ?? ''
              }

              const categoryEl = document.querySelector('[data-testid="part_category_id-react-select-container"] input');
              if(categoryEl) {
                  console.log(categoryEl)
                  //@ts-ignore
                  categoryEl.focus()
                  //@ts-ignore
                  categoryEl.value =  request.product?.category ?? ''
              }
          }
      );

  },
});

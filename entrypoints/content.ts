import upcLookup from "@/components/upcLookup";

export default defineContentScript({
  matches: ['*://*.fleetio.com/*'],
  main() {
      const waitForElm = async (selector:string):Promise<Element|null> => {
          return new Promise(resolve => {
              if (document.querySelector(selector)) {
                  return resolve(document.querySelector(selector));
              }

              const observer = new MutationObserver(mutations => {
                  if (document.querySelector(selector)) {
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
                  if (document.querySelector(selector)) {
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

      const afterFieldExists  = async (elm:Element)=> {
          console.log('Getting upc info');
          //get the value of the part number (upc)
          let upcValue = elm.value ?? ''
          console.log('upc value: '+upcValue);
          if (typeof upcValue == 'undefined' || upcValue == null || upcValue == '') {
              return
          }

          console.log('lookup upc ' + upcValue)

          //lookup the upc part
          let rsp = await upcLookup.lookupUpc(upcValue)

          //update the fields
          console.log(rsp)
      }

    console.log('Watching for "add product" popup');

      const waitForFieldToExistCallback = async (elm:Element|null) => {
          if(elm) {
              console.log('Element is ready');
              await afterFieldExists(elm)
              waitForElmToNotExist('#radix-dialog-container input').then(waitForFieldNotToExistCallback)
          }
      }
      const waitForFieldNotToExistCallback = async () => {
          console.log('Popup is gone')
          waitForElm('#radix-dialog-container input').then(waitForFieldToExistCallback);
      }

    //watch for document.getElementById('radix-dialog-container') to exist
      waitForElm('#radix-dialog-container input').then(waitForFieldToExistCallback);
      //9781541736696


  },
});

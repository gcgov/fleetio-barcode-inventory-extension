import upcLookup from "@/components/upcLookup";

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  browser.runtime.onMessage.addListener(
      async function(request:{upc:string}, sender, sendResponse) {
          /*console.log(sender.tab ?
              "from a content script:" + sender.tab.url :
              "from the extension");
          console.log(sender)
          console.log(request)*/

          console.log('lookup upc ' + request.upc)

          //lookup the upc part
          let rsp = await upcLookup.lookupUpc(request.upc)
          console.log(rsp)

          if(sender.tab?.id) {
              const response = await browser.tabs.sendMessage(sender.tab.id, {task: "upcProductFill", product:rsp});
              // do something with response here, not outside the function
              console.log(response)
          }
      }
  );
});

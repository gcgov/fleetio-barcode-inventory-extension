import upcLookup from "@/components/upcLookup";

const getImgFile = async ( url: string ): Promise<DataTransfer> => {

    //get image from rsp.offers and a fetch


    //let fileName = 'hasFilename.jpg'
    // let file = new File([imgBlob], fileName,{type:"image/jpeg", lastModified:new Date().getTime()}, 'utf-8');
    let container = new DataTransfer();
    // container.items.add(file);

    return container
}

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
              const productResponse = await browser.tabs.sendMessage(sender.tab.id, {task: "upcProductFill", product:rsp});
              // do something with response here, not outside the function
              //console.log(productResponse)

              //update image
              let url = ''
              if(url.trim()!='') {
                  const container: DataTransfer = await getImgFile(url)
                  const imgResponse = await browser.tabs.sendMessage(sender.tab.id, {
                      task: "updateImage",
                      files: container.files
                  });
                  //console.log(imgResponse)
              }
          }

      }
  );
});

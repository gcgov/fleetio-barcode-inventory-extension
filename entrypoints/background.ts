import upcLookup from "@/components/upcLookup";

const blobToBase64 = (blob: Blob) => {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}
const getImgFile = async (url: string, tabId: number): Promise<void> => {
    const response = await fetch(url );
    const imageBlob:Blob = await response.blob();

    const message = {
        task: "updateImage",
        base64: await blobToBase64(imageBlob),
    }
    console.log(message)
    await browser.tabs.sendMessage(tabId, message);
}

export default defineBackground(() => {
    console.log('Hello background!', {id: browser.runtime.id});

    browser.runtime.onMessage.addListener(
        async function (request: { upc: string }, sender, sendResponse) {

            console.log('lookup upc ' + request.upc)

            //lookup the upc part
            let rsp = await upcLookup.lookupUpc(request.upc)
            console.log(rsp)

            if (sender.tab?.id) {
                const productResponse = await browser.tabs.sendMessage(sender.tab.id, {
                    task: "upcProductFill",
                    product: rsp
                });

                let file: File|null = null
                if (rsp && rsp.images && rsp.images[0]) {
                    console.log('get image: ' + rsp.images[0])
                    let url = rsp.images[0]
                    await getImgFile(url, sender.tab.id)
                }
            }

        }
    );

    browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if (changeInfo.url) {
            await browser.tabs.sendMessage(tabId, {  task: "tabChanged", url: tab.url });
        }
    });

});

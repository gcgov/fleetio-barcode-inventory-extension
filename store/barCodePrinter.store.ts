import {defineStore, PiniaPluginContext} from 'pinia'
import {ref, Ref} from "vue";
import ObjectID from "bson-objectid";
import labelXml from '@/assets/barcode-label-small.xml?raw'
import PrinterInfo = dymo.label.framework.PrinterInfo;

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useBarCodePrinterStore = defineStore('barCodePrinter', () => {
        const uiLoadingPrinters: Ref<boolean> = ref(false)
        const createBarCodeError: Ref<boolean> = ref(false)
        const createBarCodeErrorMessage: Ref<string> = ref('')
        const preview: Ref<string> = ref('')
        const printers: Ref<PrinterInfo[]> = ref([])
        const selectedPrinter: Ref<PrinterInfo | undefined> = ref(undefined)

        const getId = (): string => {
            let oid: ObjectID = new ObjectID()
            return oid.toHexString().toUpperCase()
        }

        const getPrinters = async (event:any=undefined) => {
            uiLoadingPrinters.value = true

            createBarCodeError.value = false
            createBarCodeErrorMessage.value = ''

            let printerList = dymo.label.framework.getPrinters()

            console.log(printerList)
            if (printerList.length == 0) {
                createBarCodeError.value = true
                createBarCodeErrorMessage.value = 'No printer is available'

                printers.value = []
                uiLoadingPrinters.value = false
                return
            }

            printers.value = printerList
            if (typeof selectedPrinter.value == undefined || printerList[0]) {
                selectedPrinter.value = printerList[0]
            }

            if(event) {
                setTimeout(() => {
                    uiLoadingPrinters.value = false
                }, 600);
            }
            else {
                uiLoadingPrinters.value = false
            }

        }

        const generatePrintBarcode = (newBarCodeId: string = '', productTitle: string = '', previewOnly: boolean = false) => {
            if (selectedPrinter.value == undefined) {
                console.log('No printer is selected')
                createBarCodeError.value = true
                createBarCodeErrorMessage.value = 'No printer is selected'
                return
            }
            //reset error
            createBarCodeError.value = false
            createBarCodeErrorMessage.value = ''

            //load label file from xml string
            try {
                if (newBarCodeId == '') {
                    newBarCodeId = getId()
                }
                console.log('Print bar code for: ' + newBarCodeId)
                console.log(labelXml)
                let label = dymo.label.framework.openLabelXml(labelXml)

                //update fields
                label.setObjectText('QRCode', newBarCodeId)
                label.setObjectText('TextCode', newBarCodeId)
                label.setObjectText('TextProductTitle', productTitle)

                //update preview
                //preview.value = 'data:image/png;base64,'+label.render('', selectedPrinter.value?.name ?? '')

                //send to printer
                if (!previewOnly) {
                    label.print(selectedPrinter.value?.name ?? '', '', '')
                }

            } catch (e: any) {
                console.log(e.message || e)
                createBarCodeError.value = true
                createBarCodeErrorMessage.value = e.message || e
            }
        }

        return {
            //state
            uiLoadingPrinters,
            createBarCodeError,
            createBarCodeErrorMessage,
            preview,
            printers,
            selectedPrinter,


            //actions
            getId,
            getPrinters,
            generatePrintBarcode


        }
    },
    {
        persist: {
            key: 'barcode',
            paths: ['selectedPrinter', 'printers'],
            afterRestore: (ctx: PiniaPluginContext) => {
                console.log(`pina store restored: '${ctx.store.$id}'`)
            }
        },
    })

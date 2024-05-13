<script lang="ts" setup>
import {onMounted, ref, Ref} from 'vue';
import ObjectID from "bson-objectid";
import PrinterInfo = dymo.label.framework.PrinterInfo;

/*defineProps({
  msg: String,
});*/

const uiLoadingPrinters: Ref<boolean> = ref(false)
const createBarCodeError: Ref<boolean> = ref(false)
const createBarCodeErrorMessage: Ref<string> = ref('')
const printers: Ref<PrinterInfo[]> = ref([])
const selectedPrinter: Ref<PrinterInfo | undefined> = ref(undefined)

onMounted(async () => {
    await getPrinters()
})

const generatePrintBarcode = () => {
    let oid: ObjectID = new ObjectID()
    let id: string = oid.toHexString()

	//reset error
    createBarCodeError.value = false
    createBarCodeErrorMessage.value = ''

    console.log('Print bar code for: ' + id)

	if(selectedPrinter.value==undefined) {
        createBarCodeError.value = true
        createBarCodeErrorMessage.value = 'No printer is selected'
		return
	}
    //dymo.label.framework.printLabel('', '', '', '')

}

const getPrinters = async () => {
    uiLoadingPrinters.value = true

    createBarCodeError.value = false
    createBarCodeErrorMessage.value = ''

    let printerList = dymo.label.framework.getPrinters()
    if (printerList.length == 0) {
        createBarCodeError.value = true
        createBarCodeErrorMessage.value = 'No printer is available'

        printers.value = []
        uiLoadingPrinters.value = false
        return
    }

    printers.value = printerList
    if (printerList[0]) {
        selectedPrinter.value = printerList[0]
    }

    setTimeout(() => {
        uiLoadingPrinters.value = false
    }, 600);

}
</script>

<template>

	<div>
		<div class="font-bold text-sm mb-2">Create Barcode</div>

		<div v-if="createBarCodeError" class="flex items-center p-4 mb-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
			<svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
				<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
			</svg>
			<span class="sr-only">Info</span>
			<div>
				<span class="font-bold">Error:</span> {{ createBarCodeErrorMessage }}
			</div>
		</div>

		<select v-model="selectedPrinter"
		        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
			<option :value="undefined">Choose Printer</option>
			<option v-for="(printer, printerIndex) in printers" :key="printerIndex" :value="printer">{{ printer.name }}</option>
		</select>
		<div class="flex justify-between mt-2">
			<a class="btn sm" @click="generatePrintBarcode">
				<svg class="inline w-4 h-4 me-2 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<title>printer</title>
					<path d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z" />
				</svg>
				<span>Print New Barcode</span>
			</a>
			<a class="btn sm mr-0 white" title="Refresh Printer List" @click="getPrinters">
				<div v-if="!uiLoadingPrinters">
					<svg class="w-5 h-5 fill-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<title>printer-pos-refresh</title>
						<path d="M17 9H7V4H17V9M12 18.5C12 18.67 12 18.83 12.03 19H4V12C4 10.9 4.89 10 6 10H18C19.11 10 20 10.9 20 12V12.18C19.5 12.07 19 12 18.5 12C14.91 12 12 14.91 12 18.5M10 12H6V14H10V12M22 18.5V14.5L20.83 15.67C20.11 14.95 19.11 14.5 18 14.5C15.79 14.5 14 16.29 14 18.5S15.79 22.5 18 22.5C19.68 22.5 21.12 21.47 21.71 20H20C19.54 20.61 18.82 21 18 21C16.62 21 15.5 19.88 15.5 18.5S16.62 16 18 16C18.69 16 19.32 16.28 19.77 16.73L18 18.5H22Z" />
					</svg>
					<span class="sr-only">Refresh Printer List</span>
				</div>
				<div role="status" v-else>
					<svg aria-hidden="true" class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
						<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
					</svg>
					<span class="sr-only">Loading...</span>
				</div>
			</a>
		</div>

		<p></p>
	</div>

</template>

<style scoped>
</style>

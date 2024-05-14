<script lang="ts" setup>
import {onMounted, ref, Ref} from 'vue';
import {useBarCodePrinterStore} from "@/store/barCodePrinter.store";
import hotkeys from "hotkeys-js";

/*defineProps({
  msg: String,
});*/

const barCodePrinterStore = useBarCodePrinterStore()
const productTitle: Ref<string> = ref('')
const showPrinterList: Ref<boolean> = ref(false)

onMounted(async () => {
    await barCodePrinterStore.getPrinters()
    hotkeys('alt+n', function(event, handler){
        print()
    });

})

const print = (event:any=undefined) => {
    if(event) {
        if(productTitle.value=='') {
            return
        }
    }
    barCodePrinterStore.generatePrintBarcode( barCodePrinterStore.getId(), productTitle.value )
	if(!barCodePrinterStore.createBarCodeError) {
        productTitle.value = ''
	}
}
</script>

<template>

	<div>
		<div class="flex justify-between items-center mb-2">
			<div class="font-bold text-sm">Create Barcode</div>
			<a class="block p-2 fake-a" v-if="!showPrinterList" @click="showPrinterList=true" title="Settings">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4"><title>Settings</title><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" /></svg>
			</a>
			<a class="block p-2 fake-a" v-else @click="showPrinterList=false" title="Close Settings">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4"><title>Close Settings</title><path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" /></svg>
			</a>
		</div>

		<div v-if="barCodePrinterStore.createBarCodeError" class="flex items-center p-4 mb-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
			<svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
				<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
			</svg>
			<span class="sr-only">Info</span>
			<div>
				<span class="font-bold">Error:</span> {{ barCodePrinterStore.createBarCodeErrorMessage }}
			</div>
		</div>

		<div v-if="showPrinterList">
			<div>Printer</div>
			<div class="flex mb-2">
				<select v-model="barCodePrinterStore.selectedPrinter"
				        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
					<option :value="undefined">Choose Printer</option>
					<option v-for="(printer, printerIndex) in barCodePrinterStore.printers" :key="printerIndex" :value="printer">{{ printer.name }}</option>
				</select>
				<a class="btn ml-2 sm mr-0 white" title="Refresh Printer List" @click="barCodePrinterStore.getPrinters">
					<div v-if="!barCodePrinterStore.uiLoadingPrinters">
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
			<hr class="my-4" />
		</div>


		<input type="text" v-model="productTitle" @keyup.enter="print" autofocus class="block w-full mt-2 p-2.5 ps-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Product Description" />

		<div class="flex justify-between mt-2">
			<a class="btn sm" @click="print()">
				<svg class="inline w-4 h-4 me-2 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<title>printer</title>
					<path d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z" />
				</svg>
				<span>Print New Barcode</span>
			</a>

		</div>

<!--		<img v-if="barCodePrinterStore.preview" :src="barCodePrinterStore.preview" class="mt-2" alt="Label Preview" />-->
	</div>

</template>

<style scoped>
</style>

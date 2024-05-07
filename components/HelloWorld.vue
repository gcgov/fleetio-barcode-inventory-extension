<script lang="ts" setup>
import { ref } from 'vue';
import ObjectID from "bson-objectid";

defineProps({
  msg: String,
});

const count = ref(0);

const generatePrintBarcode = () => {
    let oid: ObjectID = new ObjectID()
	let id: string = oid.toHexString()

	//@ts-ignore: getPrintersAsync not a function but it is
    dymo.label.framework.getPrintersAsync().then(function (printers:object[]|undefined) {
        if (typeof printers=='undefined' || printers.length == 0) {
            console.log('No DYMO printers installed')
            return;
        }
        else {
            console.log('Printers Installed')
            console.log(printers)
        }
    });
    //dymo.label.framework.printLabel('', '', '', '')


}
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="generatePrintBarcode">Print New Barcode</button>
    <p></p>
  </div>

</template>

<style scoped>
</style>

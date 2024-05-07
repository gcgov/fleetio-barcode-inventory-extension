<script lang="ts" setup>
import { ref } from 'vue';
import ObjectID from "bson-objectid";
import "../dymo.connect.framework"

defineProps({
  msg: String,
});

const count = ref(0);

const generatePrintBarcode = () => {
    let oid: ObjectID = new ObjectID()
	let id: string = oid.toHexString()

    dymo.label.framework.printLabel('', '', '', '')

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

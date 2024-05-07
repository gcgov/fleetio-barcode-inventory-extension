<script lang="ts" setup>
import { ref } from 'vue';
import ObjectID from "bson-objectid";

/*defineProps({
  msg: String,
});*/

const upc: Ref<string> = ref('')
const data: Ref<object> = ref({})

interface IItem {
    category:string|undefined,
	description:string|undefined,
	ean:string|undefined,
    upc:string|undefined,
	images:string[]|undefined,
    title:string[]|undefined,
    //book
    isbn:string|undefined,
    publisher:string[]|undefined,
	//product
	brand:string|undefined,
	color:string|undefined,
	currency:string|undefined,
	dimension:string|undefined,
	highest_recorded_price:number|undefined,
	lowest_recorded_price:number|undefined,
	model:string|undefined,
	size:string|undefined,
	weight:string|undefined,
}
const lookup = async () => {
	console.log('Lookup: '+upc.value)
    let rsp = await upcLookup.lookupUpc(upc.value)

	console.log(rsp.data)
    data.value = rsp.data

}
</script>

<template>

  <div class="card">
	  <input type="text" v-model="upc" @keyup.enter="lookup" />
    <button type="button" @click="lookup">Lookup UPC</button>
    <pre style="text-align: left">{{ data }}</pre>
  </div>

</template>

<style scoped>
</style>

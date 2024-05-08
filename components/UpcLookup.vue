<script lang="ts" setup>
import {ref, Ref} from 'vue';
import {IItem} from "@/components/upcLookup";

const upc: Ref<string> = ref('')
const data: Ref<IItem|null> = ref(null)

const lookup = async () => {
	console.log('Lookup: '+upc.value)
    data.value = await upcLookup.lookupUpc(upc.value)

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

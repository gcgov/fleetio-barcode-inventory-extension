<script lang="ts" setup>
import {ref, Ref} from 'vue';
import {IItem} from "@/components/upcLookup";

const lookingUp: Ref<boolean> = ref(false)
const lookingUpError: Ref<boolean> = ref(false)
const upc: Ref<string> = ref('')
const data: Ref<IItem | null> = ref(null)

const lookup = async () => {
    lookingUp.value = true
    console.log('Lookup: ' + upc.value)
    data.value = await upcLookup.lookupUpc(upc.value)
    upc.value = ''
    lookingUp.value = false
}
</script>

<template>
	<div class="font-bold text-sm">Lookup Product Details</div>

	<div class="flex gap-2">
		<input type="text" v-model="upc" @keyup.enter="lookup" class="block w-full p-2.5 ps-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="UPC" />
		<a @click="lookup" class="btn">
			<svg v-if="!lookingUp" class="w-4 h-4 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
			</svg>
			<div role="status" v-else>
				<svg aria-hidden="true" class="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
					<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
				</svg>
				<span class="sr-only">Loading...</span>
			</div>
		</a>
	</div>

	<ul v-if="data" class="list-disc ml-5 mt-4">
		<li v-if="data.upc"><span class="font-bold">UPC</span> {{ data.upc }}</li>
		<li v-if="data.isbn"><span class="font-bold">ISBN</span> {{ data.isbn }}</li>
		<li v-if="data.ean"><span class="font-bold">EAN</span> {{ data.ean }}</li>
		<li v-if="data.title"><span class="font-bold">Title</span> {{ data.title }}</li>
		<li v-if="data.description"><span class="font-bold">Description</span> {{ data.description }}</li>
		<li v-if="data.category"><span class="font-bold">Category</span> {{ data.category }}</li>
		<li v-if="data.brand"><span class="font-bold">Brand</span> {{ data.brand }}</li>
		<li v-if="data.model"><span class="font-bold">Model</span> {{ data.model }}</li>
		<li v-if="data.dimension"><span class="font-bold">Dimension</span> {{ data.dimension }}</li>
		<li v-if="data.weight"><span class="font-bold">Weight</span> {{ data.weight }}</li>
		<li v-if="data.color"><span class="font-bold">Color</span> {{ data.color }}</li>
		<li v-if="data.images && data.images[0]">
			<span class="font-bold">Image</span>
			<img :src="data.images[0]" class="max-w-36 max-h-36" />
		</li>
	</ul>
</template>

<style scoped>
</style>

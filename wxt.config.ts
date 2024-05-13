import {defineConfig} from 'wxt';
import vue from '@vitejs/plugin-vue';

// See https://wxt.dev/api/config.html
export default defineConfig({
    imports: {
        addons: {
            vueTemplate: true,
        },
    },
    manifest: {
        host_permissions: ['https://api.upcitemdb.com/*', 'https://*/'],
    },
    vite: () => ({
        plugins: [vue()],
        build: {
            // Enabling sourcemaps with Vue during development is known to cause problems with Vue
            sourcemap: false,
        },
        assetsInclude: ["assets/barcode-label-small.xml"],
    }),
});

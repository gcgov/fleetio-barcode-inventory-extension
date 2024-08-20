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
        host_permissions: [
            'https://api.upcitemdb.com/*',
            'https://*.fleetio.com/*',
            'https://*/' //this is required for images to load from any domain
        ],
        commands: {
            "_execute_action": {
                "suggested_key": {
                    "default": "Alt+B",
                    "mac": "Alt+B"
                },
                "description": "Open barcode options"
            }
        },
    },
    vite: () => ({
        plugins: [vue()],
        /*optimizeDeps: {
            include: ['public/dymo.connect.framework.js', 'public/dymo.connect.framework.qrpatch.js'],
        },*/
        build: {
            // Enabling sourcemaps with Vue during development is known to cause problems with Vue
            sourcemap: false,
            /*commonjsOptions: {
                include: ['public/dymo.connect.framework.js', 'public/dymo.connect.framework.qrpatch.js'],
            },*/
        },
        assetsInclude: [
            "assets/barcode-label-small.xml"
        ],
    }),
});

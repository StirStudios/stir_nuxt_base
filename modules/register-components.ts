import { addComponent, defineNuxtModule } from '@nuxt/kit'
export default defineNuxtModule({
  setup() {
    addComponent({
      name: 'MyAutoImportedVPdfViewer',
      export: 'VPdfViewer',
      filePath: '@vue-pdf-viewer/viewer',
    })
  },
})

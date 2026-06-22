import { createApp } from 'vue'
import TinyVue from '@opentiny/vue'
import '@opentiny/vue-theme/index.css'
import './style.css'
import App from './App.vue'

createApp(App).use(TinyVue).mount('#app')

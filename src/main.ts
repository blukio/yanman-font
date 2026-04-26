import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { setupPlugins } from './plugins/element-plus'
import './styles/index.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
setupPlugins(app)

app.mount('#app')

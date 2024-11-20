import './style.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

document.documentElement.classList.toggle(
  'dark',
  localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
)

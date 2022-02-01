import { createRouter, createWebHistory } from 'vue-router';
import YoutubeMain from '../components/YoutubeMain.vue'

const routes = [
  {
    path: '/',
    component: YoutubeMain,
  },
  {
    path: '/playlist/:params',
    component: YoutubeMain,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

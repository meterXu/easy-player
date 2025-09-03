import { createRouter, createWebHashHistory } from 'vue-router'
import Test1 from '../views/Test1.vue'
import Test2 from '../views/Test2.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'test1',
      component: Test1,
    },
    {
      path: '/test2',
      name: 'test2',
      component: Test2,
    }
  ],
})

export default router

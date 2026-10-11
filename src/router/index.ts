import { createRouter, createWebHashHistory } from 'vue-router'
import ExperimentsHome from '../components/ExperimentsHome.vue'
import ExperimentForm from '../components/ExperimentForm.vue'
import AboutPage from '../components/AboutPage.vue'
import CategoryPage from '../components/CategoryPage.vue'
import { getModule } from '../engine/registry'
import { isCategory } from '../lib/categories'

/**
 * 使用 hash 路由（createWebHashHistory），便于静态部署到任意路径 / 双击打开，
 * 无需服务器做 SPA fallback 配置。
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: ExperimentsHome },
    {
      path: '/experiments/:id',
      name: 'experiment',
      component: ExperimentForm,
      props: true,
      beforeEnter: (to) => (getModule(String(to.params.id)) ? true : { path: '/' }),
    },
    {
      path: '/category/:id',
      name: 'category',
      component: CategoryPage,
      props: true,
      beforeEnter: (to) => (isCategory(String(to.params.id)) ? true : { path: '/' }),
    },
    { path: '/about', name: 'about', component: AboutPage },
  ],
})

export default router

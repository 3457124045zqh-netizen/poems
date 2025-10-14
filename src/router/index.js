import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../views/Home.vue')
const PoemDetail = () => import('../views/PoemDetail.vue')
const EduConsole = () => import('../views/EduConsole.vue')
const ResearchLab = () => import('../views/ResearchLab.vue')
const Learning = () => import('../views/Learning.vue')
const Assistant = () => import('../views/Assistant.vue')

export const routes = [
  { path: '/', name: 'home', component: Home, meta: { title: '诗韵灵犀 · 首页' } },
  { path: '/poem/:id', name: 'poem-detail', component: PoemDetail, meta: { title: '诗词详情' } },
  { path: '/edu', name: 'edu', component: EduConsole, meta: { title: '教材同步 · 教学助手' } },
  { path: '/research', name: 'research', component: ResearchLab, meta: { title: '研究台 · 文化分析' } },
  { path: '/learning', name: 'learning', component: Learning, meta: { title: '我的学习' } },
  { path: '/assistant', name: 'assistant', component: Assistant, meta: { title: 'AI 助手' } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach((to) => {
  if (to.meta?.title) document.title = to.meta.title
})

export default router
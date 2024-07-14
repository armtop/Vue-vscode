import { createRouter, createWebHistory ,useRoute} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes=[
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/class',
      name: 'class',
      component: () => import('../components/ClassStyle.vue')
    },
    {
      path: '/tom',
      name: 'tom',
      component: () => import('../components/TomWelcome.vue')
    },
    {
      path: '/users/:username/posts/:postId',
      name: 'user-posts',
      component: () => import('../components/UserPosts.vue')
    },
    {// 将匹配以 `/user-` 开头的所有内容，并将其放在 `route.params.afterUser` 下
      path: '/user-:afterUser(.*)',
      component: () => import('../components/UserView.vue')
    },
    {// 将匹配所有内容并将其放在 `route.params.pathMatch` 下
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../components/NotFound.vue')
    },
    
    
  ]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})



export default router

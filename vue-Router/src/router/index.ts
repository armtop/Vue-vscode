import { createRouter, createWebHistory, useRoute } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DefaultPage from '../components/DefaultPage.vue'
import LeftSidebar from '../components/LeftSidebar.vue'
import RightSidebar from '../components/RightSidebar.vue'

const routes = [
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
    path: '/class/:tom+',
    name: 'tom',
    component: () => import('../components/TomWelcome.vue')
  },
  {
    // /:postId -> 仅匹配数字
    path: '/users/:username/posts/:postId(\\d+)',
    name: 'user-postid',
    component: () => import('../components/UserPosts.vue')
  },
  {
    path: '/users/:username',
    name: 'userView',
    component: () => import('../components/UserView.vue'),
    children: [
      {
        path: '',
        component: () => import('../components/NullView.vue')
      },
      {
        path: 'profile',
        name: 'user-profile',
        component: () => import('../components/UserProfile.vue')
      },
      {
        path: 'posts',
        name: 'user-posts',
        component: () => import('../components/UserPosts.vue')
      }
    ]
  },
  {
    // 将匹配以 `/user-` 开头的所有内容，并将其放在 `route.params.afterUser` 下
    path: '/user-:afterUser(.*)',
    component: () => import('../components/UserView.vue')
  },
  {
    // 将匹配所有内容并将其放在 `route.params.pathMatch` 下
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../components/NotFound.vue')
  },
  {
    path: '/homepage',
    name: 'homepage',
    component: () => import('../components/HomePage.vue')
  },
  {
    // 命名视图
    path: '/portal',
    components: {
      a: DefaultPage,
      b: RightSidebar,
      default: LeftSidebar
    }
  },
  {
    path: '/settings',
    // You could also have named views at tho top
    component: UserSettings,
    children: [
      {
        path: 'emails',
        component: UserEmailsSubscriptions
      },
      {
        path: 'profile',
        components: {
          default: UserProfile,
          helper: UserProfilePreview
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router

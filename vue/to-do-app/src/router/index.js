import { createRouter, createWebHistory } from 'vue-router'
import auth from '@/middleware/auth'
import guest from '@/middleware/guest'

const middlewares = {
  auth,
  guest,
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/defaultLayout.vue'),
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
          meta: {
            middleware: ['auth'],
          },
        },        
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        middleware: ['guest'],
      },
    },
  ],
})

function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index]
  if (!subsequentMiddleware) return context.next

  return (...parameters) => {
    context.next(...parameters)
    const nextMiddleware = nextFactory(context, middleware, index + 1)
    subsequentMiddleware({ ...context, next: nextMiddleware })
  }
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    let middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware]

    middleware = middleware.map(m => typeof m == 'function' ? m : middlewares[m])
      .filter(m => m);

    const context = {
      from,
      next,
      router,
      to,
    }

    const nextMiddleware = nextFactory(context, middleware, 1)
    return middleware[0]({ ...context, next: nextMiddleware })
  }

  return next()
})

export default router;

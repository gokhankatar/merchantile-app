import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue';
import SignIn from '../views/SignIn.vue';
import SignUp from '../views/SignUp.vue';
import AuthLayout from '../layouts/AuthLayout.vue';
import MainLayout from '../layouts/MainLayout.vue';
import MyProducts from '../views/MyProducts.vue';
import CreateProduct from '../views/CreateProduct.vue';
import MyFavorites from '../views/MyFavorites.vue';
import MySaved from '../views/MySaved.vue';
import Categories from '../views/Categories.vue';

const routes = [
    {
        path: '/',
        name: "HomePage",
        component: HomeView,
        meta: {
            public: true,
            layout: MainLayout
        }
    },
    {
        path: '/signin',
        name: "SinginPage",
        component: SignIn,
        meta: {
            layout: AuthLayout,
            public: true
        }
    },
    {
        path: '/signup',
        name: "SignupPage",
        component: SignUp,
        meta: {
            layout: AuthLayout,
            public: true
        }
    },
    {
        path: '/my-products',
        name: "MyProductsPage",
        component: MyProducts,
        meta: {
            layout: MainLayout,
            public: true
        }
    },
    {
        path: '/create-product',
        name: "CreateProductPage",
        component: CreateProduct,
        meta: {
            layout: MainLayout,
            public: true
        }
    },
    {
        path: '/my-favorites',
        name: "MyFavoritesPage",
        component: MyFavorites,
        meta: {
            layout: MainLayout,
            public: true
        }
    },
    {
        path: '/my-saved',
        name: "MySavedPage",
        component: MySaved,
        meta: {
            layout: MainLayout,
            public: true
        }
    },
    {
        path: '/categories',
        name: "CategoriesPage",
        component: Categories,
        meta: {
            layout: MainLayout,
            public: true
        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;
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
import ProductDetail from '../views/ProductDetail.vue';
import MySelledProducts from '../views/MySelledProducts.vue';

const routes = [
    {
        path: '/',
        name: "HomePage",
        component: HomeView,
        meta: {
            title: 'Home',
            public: true,
            layout: MainLayout
        }
    },
    {
        path: '/signin',
        name: "SinginPage",
        component: SignIn,
        meta: {
            title: 'Sign In',
            layout: AuthLayout,
            public: true
        }
    },
    {
        path: '/signup',
        name: "SignupPage",
        component: SignUp,
        meta: {
            title: 'Sign Up',
            layout: AuthLayout,
            public: true
        }
    },
    {
        path: '/my-products',
        name: "MyProductsPage",
        component: MyProducts,
        meta: {
            title: 'My Products',
            layout: MainLayout,
            public: true
        }
    },
    {
        path: '/create-product',
        name: "CreateProductPage",
        component: CreateProduct,
        meta: {
            title: 'Create Product',
            layout: MainLayout,
            public: true
        }
    },
    {
        path: '/edit-product/:id',
        name: "EditProductPage",
        component: CreateProduct,
        meta: {
            title: 'Edit Product',
            layout: MainLayout,
            public: true
        }
    },
    {
        path: '/my-selled-products',
        name: "SelledProductPage",
        component: MySelledProducts,
        meta: {
            title: 'Selled Products',
            layout: MainLayout,
            public: true
        }
    },
    {
        path: '/my-favorites',
        name: "MyFavoritesPage",
        component: MyFavorites,
        meta: {
            title: 'My Favorites',
            layout: MainLayout,
            public: true
        }
    },
    {
        path: '/my-saved',
        name: "MySavedPage",
        component: MySaved,
        meta: {
            title: 'My Saved',
            layout: MainLayout,
            public: true
        }
    },
    {
        path: '/categories',
        name: "CategoriesPage",
        component: Categories,
        meta: {
            title: 'Categories',
            layout: MainLayout,
            public: true
        }
    },
    {
        path: '/product-detail/:id',
        name: "ProductDetailPage",
        component: ProductDetail,
        meta: {
            title: 'Detail',
            layout: MainLayout,
            public: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = 'Merchantile App | ' + to.meta.title;
    next();
});

export default router;
import { Routes } from '@angular/router';
import { Login } from '../components/login/login';
import { Register } from '../components/register/register';
import { ForgotPassword } from '../components/forgot-password/forgot-password';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('../components/login/login').then(m => m.Login)
        // canActivate: [AuthGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('../components/register/register').then(m => m.Register)
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('../components/forgot-password/forgot-password').then(m => m.ForgotPassword)
    },
     {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'home',
        title: 'Budget Tracker - Home',
        loadComponent: () => import('../components/budget-tracker-components/home/home').then(m => m.Home)
    }
];

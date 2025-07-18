import { Routes } from '@angular/router';
import { Login } from '../components/login/login';
import { Register } from '../components/register/register';
import { ForgotPassword } from '../components/forgot-password/forgot-password';
import { ConfirmEmail } from '../components/confirm-email/confirm-email';

export const routes: Routes = [
    {
        path: 'login',
        title: 'Budget Tracker - Login',
        loadComponent: () => import('../components/login/login').then(m => m.Login)
        // canActivate: [AuthGuard]
    },
    {
        path: 'register',
        title: 'Budget Tracker - Register',
        loadComponent: () => import('../components/register/register').then(m => m.Register)
    },
    {
        path: 'forgot-password',
        title: 'Budget Tracker - Forgot Password',
        loadComponent: () => import('../components/forgot-password/forgot-password').then(m => m.ForgotPassword)
    },
    {
        path: 'home',
        title: 'Budget Tracker - Home',
        loadComponent: () => import('../components/budget-tracker-components/home/home').then(m => m.Home)
    },
    {
        path: 'confirm-email',
        title: 'Budget Tracker - Email Confirmation',
        loadComponent: () => import('../components/confirm-email/confirm-email').then(m => m.ConfirmEmail)
    },
    {
        path: 'reset-password',
        title: 'Budget Tracker - Reset Password',
        loadComponent: () => import('../components/reset-password/reset-password').then(m => m.ResetPassword)
    },
    {
        path: 'connection-timeout',
        title: 'Budget Tracker - Connection Timeout',
        loadComponent: () => import('../components/connection-timeout/connection-timeout').then(m => m.ConnectionTimeout)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];

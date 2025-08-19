import { Routes } from '@angular/router';
import { Login } from '../components/login/login';
import { Register } from '../components/register/register';
import { ForgotPassword } from '../components/forgot-password/forgot-password';
import { ConfirmEmail } from '../components/confirm-email/confirm-email';
import { Injectable } from '@angular/core';


export const routes: Routes = [
    {
        path: 'budget-tracker',
        title: 'Budget Tracker',
        loadComponent: () => import('../components/landing-page/landing-page/landing-page').then(m => m.LandingPage)
    },
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
        // canActivate: [AuthGuard], 
        title: 'Budget Tracker - Home',
        loadComponent: () => import('../components/budget-tracker-components/home/home').then(m => m.Home),
        children: [
            {
                path:'transaction',
                title: 'Budget Tracker - Transaction',
                loadComponent: () => import('../components/budget-tracker-components/transaction/transaction').then(m => m.Transaction)
            },
            {
                path: 'dashboard',
                title: 'Budget Tracker - Dashboard',
                loadComponent: () => import('../components/budget-tracker-components/dashboard/dashboard').then(m => m.Dashboard)
            },
            {
                path: 'about',
                title: 'Budget Tracker - About',
                loadComponent: () => import('../components/budget-tracker-components/about/about').then(m => m.About)
            },
            {
                path: 'account',
                title: 'account',
                loadComponent: () => import('../components/budget-tracker-components/account/account').then(m => m.Account)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
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
        path: 'server-error',
        title: 'Server Error',
        loadComponent: () => import('../components/server-down-error/server-down-error').then(m => m.ServerDownError)
    },
    {
        path: '',
        redirectTo: 'budget-tracker',
        // redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '**',
        title: 'Page Not Found',
        loadComponent: () => import('../components/page-not-found/page-not-found').then(m => m.PageNotFound)
    }
];

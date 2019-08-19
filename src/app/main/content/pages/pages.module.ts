import { NgModule } from '@angular/core';

import { LoginModule } from './authentication/login/login.module';
import { ForgotPasswordModule } from './authentication/forgot-password/forgot-password.module';
import { ResetPasswordModule } from './authentication/reset-password/reset-password.module';
import { UsersManagementModule } from './users-management/users-management.module';
import { BusinessManagementModule } from './business-management/business-management.module';
import { CategoriesManagementModule } from './categories-management/categories-management.module';
import { RegionsManagementModule } from './regions-management/regions-management.module';
import { AdsManagementModule } from './ads-management/ads-management.module';
import { VolumesManagementModule } from './volumes-management/volumes-management.module';
import { GlobalBusinessManagementModule } from './global-business-management/global-business-management.module';
import { PushNotificationModule } from './push-notification/push-notification.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../core/services/auth.gard';
import { BackupsManagementModule } from './backups-management/backups-management.module';

export function BackupsManagementModuleLoad(){
    return BackupsManagementModule; 
}
export function UsersManagementModuleLoad() {
    return UsersManagementModule;
}
export function BusinessManagementModuleLoad() {
    return BusinessManagementModule
}
export function CategoriesManagementModuleLoad() {

    return CategoriesManagementModule;
}
export function RegionsManagementModuleLoad() {
    return RegionsManagementModule;
}

export function AdsManagementModuleLoad() {
    return AdsManagementModule;
}
export function GlobalBusinessManagementModuleLoad() {
    return GlobalBusinessManagementModule;
}
export function PushNotificationModuleLoad() {
    return PushNotificationModule;
}
export function VolumesManagementModuleLoad(){
    return VolumesManagementModule; 
}
const routes: Routes = [
    {
        path: 'pages',
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'volumes-management',
                loadChildren:'./volumes-management/volumes-management.module#VolumesManagementModule' 
            },
            {
                path: 'users-management',
                loadChildren: './users-management/users-management.module#UsersManagementModule'
            }
            ,
            {
                path: 'business-management',
                loadChildren: './business-management/business-management.module#BusinessManagementModule' 
            }
            ,
            {
                path: 'categories-management',
                loadChildren: './categories-management/categories-management.module#CategoriesManagementModule'

            }
            ,
            {
                path: 'regions-management',
                loadChildren: './regions-management/regions-management.module#RegionsManagementModule'
            }
            ,
            {
                path: 'ads-management',
                loadChildren: './ads-management/ads-management.module#AdsManagementModule'
            }
            ,
            {
                path: 'global-business-management',
                loadChildren: './global-business-management/global-business-management.module#GlobalBusinessManagementModule' 

            },
            {
                path: 'push-notification',
                loadChildren: './push-notification/push-notification.module#PushNotificationModule'
            } , 
            {
                path : 'backups-management' ,                 
                loadChildren : './backups-management/backups-management.module#BackupsManagementModule'
            }
        ]

    }

];

@NgModule({
    imports: [
        // Auth
        LoginModule,
        ForgotPasswordModule,
        ResetPasswordModule,
        RouterModule.forChild(routes),


    ]
})
export class PagesModule {
}

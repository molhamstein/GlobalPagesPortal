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
                loadChildren: VolumesManagementModuleLoad
            },
            {
                path: 'users-management',
                loadChildren: UsersManagementModuleLoad
            }
            ,
            {
                path: 'business-management',
                loadChildren: BusinessManagementModuleLoad
            }
            ,
            {
                path: 'categories-management',
                loadChildren: CategoriesManagementModuleLoad

            }
            ,
            {
                path: 'regions-management',
                loadChildren: RegionsManagementModuleLoad
            }
            ,
            {
                path: 'ads-management',
                loadChildren: AdsManagementModuleLoad
            }
            ,
            {
                path: 'global-business-management',
                loadChildren: GlobalBusinessManagementModuleLoad

            },
            {
                path: 'push-notification',
                loadChildren: PushNotificationModuleLoad
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

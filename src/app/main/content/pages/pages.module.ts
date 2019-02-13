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

@NgModule({
    imports: [
        // Auth
        LoginModule,
        ForgotPasswordModule,
        ResetPasswordModule,

        //Management
        UsersManagementModule,
        BusinessManagementModule,
        CategoriesManagementModule,
        RegionsManagementModule,
        AdsManagementModule,
        VolumesManagementModule,
        GlobalBusinessManagementModule,
        PushNotificationModule
    ]
})
export class PagesModule
{
}

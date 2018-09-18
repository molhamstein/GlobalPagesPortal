import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';

import { FuseForgotPasswordComponent } from './forgot-password.component';
import { authService } from '../../../../../core/services/auth.service';

const routes = [
    {
        path     : 'pages/auth/forgot-password',
        component: FuseForgotPasswordComponent
    }
];

@NgModule({
    declarations: [
        FuseForgotPasswordComponent
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers:[authService]
})

export class ForgotPasswordModule
{

}

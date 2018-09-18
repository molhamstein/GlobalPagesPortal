import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';
import { authService } from '../../../../../core/services/auth.service';

const routes = [
    {
        path     : 'pages/auth/reset-password',
        component: ResetPasswordComponent
    }
];

@NgModule({
    declarations: [
        ResetPasswordComponent
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers:[authService]
})

export class ResetPasswordModule
{

}

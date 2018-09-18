import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';

import { FuseLoginComponent } from './login.component';
import { authService } from '../../../../../core/services/auth.service';

const routes = [
    {
        path     : 'pages/auth/login',
        component: FuseLoginComponent
    }
];

@NgModule({
    declarations: [
        FuseLoginComponent
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers:[authService]
})

export class LoginModule
{

}

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';
import { UsersManagementComponent } from './users-management.component';
import { usersService } from '../../../../core/services/users.service';
import { addUsersComponent } from './add-users/add-users.component';
import { editUsersComponent } from './edit-users/edit-users.component';
import { viewUsersComponent } from './view-users/view-users.component';
import { AuthGuard } from '../../../../core/services/auth.gard';


const routes = [
    {
        path     : 'pages/users-management',
        component: UsersManagementComponent,
        canActivate: [AuthGuard] 
    },
    {
        path     : 'pages/users-management/add-users',
        component: addUsersComponent,
        canActivate: [AuthGuard] 
    },
    {
        path     : 'pages/users-management/edit-users/:id',
        component: editUsersComponent,
        canActivate: [AuthGuard] 
    },
    {
        path     : 'pages/users-management/view-users/:id',
        component: viewUsersComponent,
        canActivate: [AuthGuard] 
    }
];

@NgModule({
    declarations: [
        UsersManagementComponent,
        addUsersComponent,
        editUsersComponent,
        viewUsersComponent
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes),
        
    ],
    providers:[usersService, AuthGuard]
})

export class UsersManagementModule
{

}

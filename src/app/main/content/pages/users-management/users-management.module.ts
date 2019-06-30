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
        path     : '',
        component: UsersManagementComponent,
    },
    {
        path     : 'add-users',
        component: addUsersComponent,
    },
    {
        path     : 'edit-users/:id',
        component: editUsersComponent,
    },
    {
        path     : 'view-users/:id',
        component: viewUsersComponent,
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
    providers:[usersService]
})

export class UsersManagementModule
{

}

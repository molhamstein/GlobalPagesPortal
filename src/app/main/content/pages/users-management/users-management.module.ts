import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';
import { UsersManagementComponent } from './users-management.component';
import { usersService } from '../../../../core/services/users.service';
import { addUsersComponent } from './add-users/add-users.component';
import { editUsersComponent } from './edit-users/edit-users.component';
import { viewUsersComponent } from './view-users/view-users.component';
import { PrivilegeGuard } from '../../../../core/guards/privilege.guard';
import { authService } from '../../../../core/services/auth.service';


const routes: Routes = [
    {
        path: '',
        component: UsersManagementComponent,
    },

    {
        path: 'add-users',
        component: addUsersComponent,
        canActivate: [PrivilegeGuard],
        data: { privileges: ["crud-users", "add-user"] }
    },
    {
        path: 'edit-users/:id',
        component: editUsersComponent,
        canActivate: [PrivilegeGuard],
        data: { privileges: ["crud-users", "edit-user"] }
    },
    {
        path: 'view-users/:id',
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
    imports: [
        SharedModule,
        RouterModule.forChild(routes),

    ],
    providers: [usersService, PrivilegeGuard , authService]
})

export class UsersManagementModule {

}

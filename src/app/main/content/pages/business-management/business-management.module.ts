import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';
import { AuthGuard } from '../../../../core/services/auth.gard';
import { BusinessManagementComponent } from './business-management.component';
import { AddBusinessComponent } from './add-business/add-business.component';
import { EditBusinessComponent } from './edit-business/edit-business.component';
import { BusinessCategoriesService } from '../../../../core/services/business-cat.service';
import { CommonModule } from '../../../../../../node_modules/@angular/common';
import { BrowserModule } from '../../../../../../node_modules/@angular/platform-browser';


const routes = [
    {
        path: '',
        component: BusinessManagementComponent,
    },
    {
        path: 'add-business/:id',
        component: AddBusinessComponent,
    },
    {
        path: 'edit-business/:id',
        component: EditBusinessComponent,
    }
];

@NgModule({
    declarations: [
        BusinessManagementComponent,
        AddBusinessComponent,
        EditBusinessComponent,
    ],
    imports: [
        SharedModule,
        CommonModule,
        RouterModule.forChild(routes),

    ],
    providers: [BusinessCategoriesService]
})

export class BusinessManagementModule {

}

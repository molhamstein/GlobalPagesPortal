import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';
import { AuthGuard } from '../../../../core/services/auth.gard';
import { CommonModule } from '../../../../../../node_modules/@angular/common';
import { BrowserModule } from '../../../../../../node_modules/@angular/platform-browser';
import { CategoriesManagementComponent } from './categories-management.component';
import { CategoriesService } from '../../../../core/services/categories.service';
import { AddCategoryComponent } from './add-category/add-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';


const routes = [
    {
        path: '',
        component: CategoriesManagementComponent,
    },
    {
        path: 'add-category/:id',
        component: AddCategoryComponent,
    },
    {
        path: 'edit-category/:id',
        component: EditCategoryComponent,
    }
];

@NgModule({
    declarations: [
        CategoriesManagementComponent,
        AddCategoryComponent,
        EditCategoryComponent,
    ],
    imports: [
        SharedModule,
        CommonModule,
        RouterModule.forChild(routes),

    ],
    providers: [CategoriesService]
})

export class CategoriesManagementModule {

}

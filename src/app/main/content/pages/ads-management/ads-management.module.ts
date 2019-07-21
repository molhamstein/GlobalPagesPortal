import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';
import { AuthGuard } from '../../../../core/services/auth.gard';
import { CommonModule } from '../../../../../../node_modules/@angular/common';
import { BrowserModule } from '../../../../../../node_modules/@angular/platform-browser';
import { AdsService } from '../../../../core/services/ads.service';
import { AdsManagementComponent } from './ads-management.component';
import { AddAdComponent } from './add-ad/add-ad.component';
import { EditAdComponent } from './edit-ad/edit-ad.component';
import { ViewAdComponent } from './view-ad/view-ad.component';
import { RegionsService } from '../../../../core/services/regions.service';
import { CategoriesService } from '../../../../core/services/categories.service';
import { usersService } from '../../../../core/services/users.service';
import { UtilsModule } from '../../../utlis/utils.module';


const routes = [
    {
        path: '',
        component: AdsManagementComponent,
    },
    {
        path: 'add-ad',
        component: AddAdComponent,
    },
    {
        path: 'edit-ad/:id',
        component: EditAdComponent,
    },
    {
        path: 'view-ad/:id',
        component: ViewAdComponent,
    }
];

@NgModule({
    declarations: [
        AdsManagementComponent,
        AddAdComponent,
        EditAdComponent,
        ViewAdComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        UtilsModule,
        RouterModule.forChild(routes)

    ],
    providers: [AdsService, usersService, RegionsService, CategoriesService]
})

export class AdsManagementModule {

}

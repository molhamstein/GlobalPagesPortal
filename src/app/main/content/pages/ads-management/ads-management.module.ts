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


const routes = [
    {
        path     : 'pages/ads-management',
        component: AdsManagementComponent,
        canActivate: [AuthGuard] 
    },
    {
        path     : 'pages/ads-management/add-ad',
        component: AddAdComponent,
        canActivate: [AuthGuard] 
    },
    {
        path     : 'pages/ads-management/edit-ad/:id',
        component: EditAdComponent,
        canActivate: [AuthGuard] 
    },
    {
        path     : 'pages/ads-management/view-ad/:id',
        component: ViewAdComponent,
        canActivate: [AuthGuard] 
    }
];

@NgModule({
    declarations: [
        AdsManagementComponent,
        AddAdComponent,
        EditAdComponent,
        ViewAdComponent
    ],
    imports     : [
        SharedModule,
        CommonModule,
        BrowserModule,
        RouterModule.forChild(routes),
        
    ],
    providers:[ AdsService, usersService, RegionsService, CategoriesService , AuthGuard]
})

export class AdsManagementModule
{

}

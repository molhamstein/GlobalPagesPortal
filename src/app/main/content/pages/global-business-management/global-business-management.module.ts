import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';
import { AuthGuard } from '../../../../core/services/auth.gard';
import { CommonModule } from '../../../../../../node_modules/@angular/common';
import { BrowserModule } from '../../../../../../node_modules/@angular/platform-browser';
import { AdsService } from '../../../../core/services/ads.service';
import { RegionsService } from '../../../../core/services/regions.service';
import { CategoriesService } from '../../../../core/services/categories.service';
import { usersService } from '../../../../core/services/users.service';
import { AgmCoreModule } from '@agm/core';
import { GlobalBusinessManagementComponent } from './global-business-management.component';
import { AddGlobalBusinessComponent } from './add-global-business/add-global-business.component';
import { EditGlobalBusinessComponent } from './edit-global-business/edit-global-business.component';
import { ViewGlobalBusinessComponent } from './view-global-business/view-global-business.component';
import { GlobalBusinessService } from '../../../../core/services/global-business.service';
import { BusinessCategoriesService } from '../../../../core/services/business-cat.service';


const routes = [
    {
        path     : 'pages/global-business-management',
        component: GlobalBusinessManagementComponent,
        canActivate: [AuthGuard] 
    },
    {
        path     : 'pages/global-business-management/add-global-business',
        component: AddGlobalBusinessComponent,
        canActivate: [AuthGuard] 
    },
    {
        path     : 'pages/global-business-management/edit-global-business/:id',
        component: EditGlobalBusinessComponent,
        canActivate: [AuthGuard] 
    },
    {
        path     : 'pages/global-business-management/view-global-business/:id',
        component: ViewGlobalBusinessComponent,
        canActivate: [AuthGuard] 
    }
];

@NgModule({
    declarations: [
        GlobalBusinessManagementComponent,
        AddGlobalBusinessComponent,
        EditGlobalBusinessComponent,
        ViewGlobalBusinessComponent
    ],
    imports     : [
        SharedModule,
        CommonModule,
        BrowserModule,
        RouterModule.forChild(routes),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAth93MSTOwWPvaw_fmwulZgRhd1IsCyPY'
        })
        
    ],
    providers:[ GlobalBusinessService, usersService, RegionsService, CategoriesService, BusinessCategoriesService , AuthGuard]
})

export class GlobalBusinessManagementModule
{

}

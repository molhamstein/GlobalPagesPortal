import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';
import { AuthGuard } from '../../../../core/services/auth.gard';
import { CommonModule } from '../../../../../../node_modules/@angular/common';
import { BrowserModule } from '../../../../../../node_modules/@angular/platform-browser';
import { RegionsManagementComponent } from './regions-management.component';
import { EditRegionComponent } from './edit-region/edit-region.component';
import { AddRegionComponent } from './add-region/add-region.component';
import { RegionsService } from '../../../../core/services/regions.service';


const routes = [
    {
        path     : '',
        component: RegionsManagementComponent,
    },
    {
        path     : 'add-region/:id',
        component: AddRegionComponent,
    },
    {
        path     : 'edit-region/:id',
        component: EditRegionComponent,
    }
];

@NgModule({
    declarations: [
        RegionsManagementComponent,
        AddRegionComponent,
        EditRegionComponent,
    ],
    imports     : [
        SharedModule,
        CommonModule,
        RouterModule.forChild(routes),
        
    ],
    providers:[ RegionsService ]
})

export class RegionsManagementModule
{

}

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';
import { AuthGuard } from '../../../../core/services/auth.gard';
import { CommonModule } from '../../../../../../node_modules/@angular/common';
import { BrowserModule } from '../../../../../../node_modules/@angular/platform-browser';
import { AdsService } from '../../../../core/services/ads.service';
import { VolumesManagementComponent } from './volumes-management.component';
import { AddVolumeComponent } from './add-volume/add-volume.component';
import { EditVolumeComponent } from './edit-volume/edit-volume.component';
import { ViewVolumeComponent } from './view-volume/view-volume.component';
import { VolumesService } from '../../../../core/services/volumes.service.';


const routes = [
    {
        path     : 'pages/volumes-management',
        component: VolumesManagementComponent,
        canActivate: [AuthGuard] 
    },
    {
        path     : 'pages/volumes-management/add-volume',
        component: AddVolumeComponent,
        canActivate: [AuthGuard] 
    },
    {
        path     : 'pages/volumes-management/edit-volume/:id',
        component: EditVolumeComponent,
        canActivate: [AuthGuard] 
    },
    {
        path     : 'pages/volumes-management/view-volume/:id',
        component: ViewVolumeComponent,
        canActivate: [AuthGuard] 
    }
];

@NgModule({
    declarations: [
        VolumesManagementComponent,
        AddVolumeComponent,
        EditVolumeComponent,
        ViewVolumeComponent
    ],
    imports     : [
        SharedModule,
        CommonModule,
        BrowserModule,
        RouterModule.forChild(routes),
        
    ],
    providers:[ VolumesService, AdsService , AuthGuard]
})

export class VolumesManagementModule
{

}

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';
import { AuthGuard } from '../../../../core/services/auth.gard';
import { CommonModule } from '../../../../../../node_modules/@angular/common';
import { BrowserModule } from '../../../../../../node_modules/@angular/platform-browser';
import { AdsService } from '../../../../core/services/ads.service';
import { VolumesService } from '../../../../core/services/volumes.service.';
import { PushNotificationComponent } from './push-notification.component';
import { PushNotificationService } from '../../../../core/services/push-notification.service';
import { usersService } from '../../../../core/services/users.service';


const routes = [
    {
        path: '',
        component: PushNotificationComponent,
    }
];

@NgModule({
    declarations: [
        PushNotificationComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        RouterModule.forChild(routes),

    ],
    providers: [PushNotificationService, usersService]
})

export class PushNotificationModule {

}

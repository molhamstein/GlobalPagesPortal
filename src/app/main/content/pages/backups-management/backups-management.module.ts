import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackupsManagementComponent } from './backups-management.component';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { BackupsService } from '../../../../core/services/backups.service';

const routes = [
  {
    path: '',
    component: BackupsManagementComponent,
  }
];
@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BackupsManagementComponent] ,
  providers : [BackupsService]
})
export class BackupsManagementModule { }

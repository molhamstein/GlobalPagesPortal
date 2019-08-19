import { Component, OnInit } from '@angular/core';
import { BackupsService } from '../../../../core/services/backups.service';
import { MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '../../../../core/animations';

@Component({
  selector: 'app-backups-management',
  templateUrl: './backups-management.component.html',
  styleUrls: ['./backups-management.component.scss'],
  animations: fuseAnimations,

})
export class BackupsManagementComponent implements OnInit {

  constructor(private backupservice: BackupsService) { }
  displayedColumns = ['name', 'size', 'date', 'icons'];

  dbData = new MatTableDataSource<any>([]);
  mediaData = new MatTableDataSource<any>([]); 
  async ngOnInit() {
    this.dbData.data = await this.backupservice.getDbBackups().toPromise();
    this.mediaData.data = await this.backupservice.getMediaBackups().toPromise(); 
  }

  humanFileSize(size) {
    if (size < 1024) return size + ' B'
    let i = Math.floor(Math.log(size) / Math.log(1024))
    let num:any = (size / Math.pow(1024, i))
    let round = Math.round(num)
    num = round < 10 ? num.toFixed(2) : round < 100 ? num.toFixed(1) : round
    return `${num} ${'KMGTPEZY'[i - 1]}B`
  }

}

import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ApiServiceBase } from "./api.service";
import { map, tap } from "rxjs/operators";

@Injectable()
export class BackupsService extends ApiServiceBase {


  getDbBackups(): Observable<any[]> {
    return this.get("backups/mongobackups/files").pipe(map((data: any[]) => {
      return data.map(e => {
        e.download = `${this.apiEndPoint}backups/mongobackups/download/${e.name}`;
        return e;
      });
    }))
  }

  getMediaBackups(): Observable<any[]> {
    return this.get("backups/images-backup/files").pipe(map((data: any[]) => {
      return data.map(e => {
        e.download = `${this.apiEndPoint}backups/images-backup/download/${e.name}`;
        return e;
      });
    }));
  }

}
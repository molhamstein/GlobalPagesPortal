import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http, Headers } from "@angular/http";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalURL } from "../global-url";
import { ApiServiceBase } from "./api.service";

@Injectable()

export class VolumesService  extends ApiServiceBase{

  accessToken = localStorage.getItem('authtoken');


  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': this.accessToken
  })

  getAllVolumes(): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'volumes');
  }

  getVolumes(skip, limit, filter): Observable<any> {
    return this.getWithCount(`volumes/?filter={"where":{"titleEn":{ "like":".*${filter}.*" , "options":"i" }},"limit":${limit}, "skip" : ${skip}}`);
  }

  getVolumesCount(): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'volumes/count')
  }

  getVolumeById(id): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'volumes/' + id);
  }

  addNewVolume(volume): Observable<any> {
    return this.httpclient.post(GlobalURL.URL + 'volumes', volume, { headers: this.headers })
  }

  editVolume(volume, id): Observable<any> {
    return this.httpclient.put(GlobalURL.URL + 'volumes/' + id, volume, { headers: this.headers })
  }

  deleteVolume(volume, id): Observable<any> {
    return this.httpclient.put(GlobalURL.URL + 'volumes/' + id, volume, { headers: this.headers })
  }

  filterVolume(value): Observable<any> {


    return this.httpclient.get(GlobalURL.URL + 'volumes/?filter={"where":{"titleEn":{"like":"' + value + '" , "options":"i" }},"limit":50}');
  }

  /* uploadImages(data) : Observable<any> {
   var headers1 = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      'Authorization': this.accessToken
    })
    return this.httpclient.post(GlobalURL.URL + 'attachments/images/upload', data , {headers: headers1  });
  } */


}
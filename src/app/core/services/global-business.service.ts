import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http, Headers } from "@angular/http";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalURL } from "../global-url";
import { ApiServiceBase } from "./api.service";

@Injectable()

export class GlobalBusinessService extends ApiServiceBase {

  accessToken = localStorage.getItem('authtoken');

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': this.accessToken
  })

  getAllGlobalBusiness(): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'businesses');
  }

  getGlobalBusiness(skip, limit, filter): Observable<any> {
    return this.getWithCount(`businesses/?filter={"where":{"nameEn":{ "like":".*${filter}.*" , "options":"i" }},"limit":${limit}, "skip" : ${skip}}`);
  }

  getGlobalBusinessCount(): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'businesses/count')
  }

  getGlobalBusinessById(id): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'businesses/' + id);
  }

  addNewGlobalBusiness(bus): Observable<any> {
    return this.httpclient.post(GlobalURL.URL + 'businesses', bus, { headers: this.headers })
  }

  editGlobalBusiness(bus, id): Observable<any> {
    return this.httpclient.put(GlobalURL.URL + 'businesses/' + id, bus, { headers: this.headers })
  }

  deleteGlobalBusiness(id): Observable<any> {
    return this.httpclient.delete(GlobalURL.URL + 'businesses/' + id, { headers: this.headers })
  }


  uploadImages(data): Observable<any> {
    return this.httpclient.post(GlobalURL.URL + 'attachments/images/upload', data);
  }

}
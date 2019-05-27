import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http, Headers } from "@angular/http";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalURL } from "../global-url";

@Injectable()

export class GlobalBusinessService {

 accessToken = localStorage.getItem('authtoken');

  constructor(private httpclient: HttpClient) {
  }

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': this.accessToken
  })

  getAllGlobalBusiness(): Observable<any> {
      return this.httpclient.get(GlobalURL.URL + 'businesses');
  }

  getGlobalBusiness(skip) : Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'businesses/?filter[limit]=5&filter[skip]='+ skip + '&filter[order]=creationDate Desc')
  }

  getGlobalBusinessCount() : Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'businesses/count')
  }

  getGlobalBusinessById(id): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'businesses/' + id);
}

  addNewGlobalBusiness(bus): Observable<any> {
    return this.httpclient.post(GlobalURL.URL + 'businesses', bus, {headers : this.headers})
  }

  editGlobalBusiness(bus, id): Observable<any> {
    return this.httpclient.put(GlobalURL.URL + 'businesses/' + id, bus, { headers: this.headers })
  }

  deleteGlobalBusiness(id): Observable<any> {
    return this.httpclient.delete(GlobalURL.URL + 'businesses/' + id,  { headers: this.headers })
  }

  filterGlobalBusiness(value): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'businesses/?filter={"where":{"nameEn":{"like":"' + value +'" , "options":"i" }},"limit":50}');
  }

  uploadImages(data) : Observable<any> {
     return this.httpclient.post(GlobalURL.URL + 'attachments/images/upload', data );
   }

}
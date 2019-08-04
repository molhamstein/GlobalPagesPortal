import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http, Headers } from "@angular/http";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalURL } from "../global-url";

@Injectable()

export class BusinessCategoriesService {

  headers = new HttpHeaders();


  constructor(private httpclient: HttpClient) {
    this.headers.append('Content-Type', 'application/json');
  }

  getAllBusiness(): Observable<any> {
      return this.httpclient.get(GlobalURL.URL + 'businessCategories');
  }

  getBusinessCategories(order="createdAt DESC") : Observable<any> {
    return this.httpclient.get(GlobalURL.URL + `businessCategories/?filter={"where":{"parentCategoryId":{"exists":false}},"include":"subCategories","order":"${order}"}`)
  }

  getBusinessSubCategories(order="createdAt DESC") : Observable<any> {
    return this.httpclient.get(GlobalURL.URL + `businessCategories/?filter={"where":{"parentCategoryId":{"exists":true}},"order":"${order}"}`)
  }

  getBusinessById(id): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'businessCategories/' + id + '?filter[include]=subCategories');
}

  addBusiness(business): Observable<any> {
    return this.httpclient.post(GlobalURL.URL + 'businessCategories', business, { headers: this.headers })
  }

  editBusiness(business, id): Observable<any> {
    return this.httpclient.put(GlobalURL.URL + 'businessCategories/' + id, business, { headers: this.headers })
  }

  deleteBusiness( id): Observable<any> {
    return this.httpclient.delete(GlobalURL.URL + 'businessCategories/' + id, { headers: this.headers })
  }




}
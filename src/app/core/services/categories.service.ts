import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http, Headers } from "@angular/http";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalURL } from "../global-url";

@Injectable()

export class CategoriesService {

  headers = new HttpHeaders();


  constructor(private httpclient: HttpClient) {
    this.headers.append('Content-Type', 'application/json');
  }

  getAllCategories(): Observable<any> {
      return this.httpclient.get(GlobalURL.URL + 'postCategories');
  }

  getCategories() : Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'postCategories/?filter={"where":{"parentCategoryId":{"exists":false}},"include":"subCategories"}')
  }

  getSubCategories() : Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'postCategories/?filter={"where":{"parentCategoryId":{"exists":true}}}')
  }

  getCategoriesChildren(id):  Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'postCategories/' + id + '/children');
  }

  getCategoryById(id): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'postCategories/' + id + '?filter[include]=subCategories');
}

  addCategory(cat): Observable<any> {
    return this.httpclient.post(GlobalURL.URL + 'postCategories', cat, { headers: this.headers })
  }

  editCategory(cat, id): Observable<any> {
    return this.httpclient.put(GlobalURL.URL + 'postCategories/' + id, cat, { headers: this.headers })
  }

  deleteCategory( id): Observable<any> {
    return this.httpclient.delete(GlobalURL.URL + 'postCategories/' + id, { headers: this.headers })
  }

  uploadImages(data) : Observable<any> {
    return this.httpclient.post(GlobalURL.URL + 'attachments/images/upload', data );
  }


}
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

  makeFilter(filter: any): any {
    let filters = [];

    let nameFilter = [];

    if (filter.name) {
      nameFilter.push({ nameAr: { "like": `.*${filter.name}.*`, "options": "i" } });
      nameFilter.push({ nameEn: { "like": `.*${filter.name}.*`, "options": "i" } });
    }

    if (nameFilter.length)
      filters.push({ or: nameFilter });

    if (filter.from)
      filters.push({ creationDate: { gte: new Date(filter.from) } });

    if (filter.to)
      filters.push({ creationDate: { lte: new Date(filter.to) } });


    if (filter.city)
      filters.push({ cityId: filter.city.id });

    if (filter.status)
      filters.push({ status: filter.status });

    if (filter.location)
      filters.push({ locationId: filter.location.id });

    if (filter.subCategory)
      filters.push({ subCategoryId: filter.subCategory.id });

    if (filter.category)
      filters.push({ categoryId: filter.category.id });

    if (filter.owner)
      filters.push({ ownerId: filter.owner.id });
    if (filters.length)
      return { and: filters };
    return {};
  }

  getGlobalBusiness(skip, limit, filter): Observable<any> {
    let where = this.makeFilter(filter);
    where = JSON.stringify(where);
    return this.getWithCount(`businesses/?filter={"where":${where},"limit":${limit},"skip":${skip}}`);
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
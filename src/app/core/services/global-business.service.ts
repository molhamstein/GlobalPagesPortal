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

  makeFilter(filter: any) {
    let where: any = {};
    if (filter.nameEn)
      where.nameEn = { "like": `.*${filter.nameEn}.*`, "options": "i" };

    if (filter.nameAr)
      where.nameAr = { "like": `.*${filter.nameAr}.*`, "options": "i" };

    let dateFilter = [];
    if (filter.from)
      dateFilter.push({ creationDate: { gte: filter.from } });

    if (filter.to)
      dateFilter.push({ creationDate: { lte: filter.to } });

    if (dateFilter.length)
      where.and = dateFilter;


    if (filter.city)
      where.cityId = filter.city.id;
    if (filter.status)
      where.status = filter.status;

    if (filter.location)
      where.locationId = filter.location.id;

    if (filter.subCategory)
      where.subCategoryId = filter.subCategory.id;

    if (filter.category)
      where.categoryId = filter.category.id;

    if (filter.owner)
      where.ownerId = filter.owner.id;

    return where;
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
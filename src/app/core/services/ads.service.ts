import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http, Headers } from "@angular/http";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalURL } from "../global-url";
import { ApiServiceBase } from "./api.service";

@Injectable()

export class AdsService extends ApiServiceBase {

  /*   headers = new HttpHeaders(); */
  accessToken = localStorage.getItem('authtoken');


  headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: this.accessToken
  })

  getAllAds(): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'posts');
  }
  makeFilter(filter: any) {
    let where: any = {};
    if (filter.title)
      where.title = { "like": `.*${filter.title}.*`, "options": "i" };


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
  getAds(skip, limit, filter): Observable<any> {
    let where = this.makeFilter(filter);
    where = JSON.stringify(where);
    return this.getWithCount(`posts/?filter={"where":${where},"limit":${limit},"skip":${skip}}`);
  }

  getAdsCount(): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'posts/count')
  }

  getAdById(id): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'posts/' + id);
  }

  addNewAd(ad): Observable<any> {
    return this.httpclient.post(GlobalURL.URL + 'posts', ad, { headers: this.headers })
  }

  editAd(ad, id): Observable<any> {
    return this.httpclient.put(GlobalURL.URL + 'posts/' + id, ad, { headers: this.headers })
  }

  deleteAd(id): Observable<any> {
    return this.httpclient.delete(GlobalURL.URL + 'posts/' + id, { headers: this.headers })
  }

  uploadImages(data): Observable<any> {
    var headers1 = new HttpHeaders({
      /* 'Content-Type': 'multipart/form-data', */
      'Authorization': this.accessToken
    })
    headers1.delete('Content Type');
    return this.httpclient.post(GlobalURL.URL + 'attachments/images/upload', data);
  }



}
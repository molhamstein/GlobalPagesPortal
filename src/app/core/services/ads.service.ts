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


    let filters = [];


    if (filter.title)
      filters.push({ title: { "like": `.*${filter.title}.*`, "options": "i" } });


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
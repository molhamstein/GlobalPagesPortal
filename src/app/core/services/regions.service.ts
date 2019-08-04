import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http, Headers } from "@angular/http";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalURL } from "../global-url";

@Injectable()

export class RegionsService {

  headers = new HttpHeaders();


  constructor(private httpclient: HttpClient) {
    this.headers.append('Content-Type', 'application/json');
  }

  getAllCities(order = "creationDate Desc"): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + `cities/?filter[include]=locations&filter[order]=${order}`);
  }

  getAllLocations(order = "creationDate Desc"): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + `locations/?filter[order]=${order}`);
  }

  cityExist(id): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'cities/' + id + '/exists');
  }

  locationExist(id): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'locations/' + id + '/exists');
  }

  getCityById(id): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'cities/' + id);
  }

  getLocationById(id): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'locations/' + id);
  }

  addCity(city): Observable<any> {
    return this.httpclient.post(GlobalURL.URL + 'cities', city, { headers: this.headers })
  }

  addLocation(location): Observable<any> {
    return this.httpclient.post(GlobalURL.URL + 'locations', location, { headers: this.headers })
  }

  editCity(city, id): Observable<any> {
    return this.httpclient.put(GlobalURL.URL + 'cities/' + id, city, { headers: this.headers })
  }

  editLocation(loc, id): Observable<any> {
    return this.httpclient.put(GlobalURL.URL + 'locations/' + id, loc, { headers: this.headers })
  }

  deleteCity(id): Observable<any> {
    return this.httpclient.delete(GlobalURL.URL + 'cities/' + id, { headers: this.headers })
  }

  deleteLocation(id): Observable<any> {
    return this.httpclient.delete(GlobalURL.URL + 'locations/' + id, { headers: this.headers })
  }




}
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http, Headers } from "@angular/http";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalURL } from "../global-url";

@Injectable()

export class usersService {

  headers = new HttpHeaders();


  constructor(private http: Http, private httpclient: HttpClient) {
    this.headers.append('Content-Type', 'application/json');
  }

  getAllUsers(): Observable<any> {
      return this.httpclient.get(GlobalURL.URL + 'users');
  }

  getUsers(skip) : Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'users/?filter[limit]=5&filter[skip]='+ skip +'&filter[order]=creationDate Desc')
  }

  getUsersCount() : Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'users/count')
  }

  getUserById(id): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'users/' + id);
  }

  addUser(user): Observable<any> {
    return this.httpclient.post(GlobalURL.URL + 'users', user, { headers: this.headers })
  }

  editUser(user, id): Observable<any> {
    return this.httpclient.put(GlobalURL.URL + 'users/' + id, user, { headers: this.headers })
  }

  deleteUser(user, id): Observable<any> {
    return this.httpclient.put(GlobalURL.URL + 'users/' + id, user, { headers: this.headers })
  }

  filterUser(value): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'users/?filter={"where":{"username":{"like":"' + value +'"}},"limit":50}');
  }



}
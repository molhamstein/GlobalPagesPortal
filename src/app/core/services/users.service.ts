import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http, Headers } from "@angular/http";
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { GlobalURL } from "../global-url";
import { map } from "rxjs/operators";
import { ApiServiceBase } from "./api.service";

@Injectable()

export class usersService extends ApiServiceBase {


  accessToken = localStorage.getItem('authtoken');
  /* headers = new HttpHeaders(); */
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': this.accessToken,
  });

  getAllUsers(): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'users?filter={"order" : "username"}');
  }

  getUsers(skip, limit, filter): Observable<any> {
    return this.getWithCount(`users/?filter={"where":{"username":{ "like":".*${filter}.*" , "options":"i" }},"limit":${limit}, "skip" : ${skip} , "order" : "username" }`);
  }

  getUsersCount(): Observable<number> {
    return this.httpclient.get(GlobalURL.URL + 'users/count').pipe(map((res: any) => res.count));
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

  changePassword(userId, password) {
    return this.httpclient.put(GlobalURL.URL + `users/${userId}/changePassword`, { password }, { headers: this.headers })
  }

  deleteUser(user, id): Observable<any> {
    return this.httpclient.put(GlobalURL.URL + 'users/' + id, user, { headers: this.headers })
  }






}
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http, Headers } from "@angular/http";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalURL } from "../global-url";
import { Router } from "../../../../node_modules/@angular/router";
import { JsonPipe } from "@angular/common";

@Injectable()

export class authService {

  headers = new HttpHeaders();


  constructor(private http: Http, private httpclient: HttpClient, private route: Router) {
    this.headers.append('Content-Type', 'application/json');
  }

  login(user): Observable<any> {
    return this.httpclient.post(GlobalURL.URL + 'users/login?include=user', user, { headers: this.headers })
  }

  forgotPassword(myEmail): Observable<any> {
    var body = { email: myEmail }
    return this.httpclient.post(GlobalURL.URL + 'users/forgotPassword', body, { headers: this.headers })
  }

  resetPassword(pass, token): Observable<any> {
    var body = { newPassword: pass }
    return this.httpclient.post(GlobalURL.URL + 'users/resetPassword/' + token, body, { headers: this.headers })
  }

  Logout() {
    localStorage.clear();
    localStorage.removeItem('authtoken');
    localStorage.removeItem('userFullName');
    localStorage.removeItem("user");
    /*  localStorage.removeItem('userPermissions'); */
    this.route.navigate(['/pages/auth/login']);
  }
  storeUser(user) {
    localStorage.setItem("user", user);
  }

  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  hasPrivilege(privilege): boolean {
    let user = this.getUser();
    if (!user) return false;

    return user.role.privileges.include("*") || user.role.privileges.include(privilege);

  }


}
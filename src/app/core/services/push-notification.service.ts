import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http, Headers } from "@angular/http";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalURL } from "../global-url";

@Injectable()

export class PushNotificationService {

 accessToken = localStorage.getItem('authtoken');

  constructor(private httpclient: HttpClient) {
  }

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': this.accessToken
  })

  getAllNotifications(): Observable<any> {
      return this.httpclient.get(GlobalURL.URL + 'notifications');
  }

  getNotificationById(id): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + 'notifications/' + id);
}

  addNewNotification(notif): Observable<any> {
    return this.httpclient.post(GlobalURL.URL + 'notifications/customNotifcation', notif, {headers : this.headers})
  }


}
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http, Headers } from "@angular/http";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { GlobalURL } from "../global-url";

@Injectable()
export class AdsService {
  /*   headers = new HttpHeaders(); */
  accessToken = localStorage.getItem("authtoken");

  constructor(private httpclient: HttpClient) {
    /* this.headers.append('Content-Type', 'application/json');
    this.headers.append('Authorization', accessToken); */
  }

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: this.accessToken
  });

  getAllAds(): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + "posts");
  }

  getAds(skip): Observable<any> {
    return this.httpclient.get(
      GlobalURL.URL + "posts/?filter[limit]=5&filter[skip]=" + skip
    );
  }

  getAdsCount(): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + "posts/count");
  }

  getAdById(id): Observable<any> {
    return this.httpclient.get(GlobalURL.URL + "posts/" + id);
  }

  addNewAd(ad): Observable<any> {
    return this.httpclient.post(GlobalURL.URL + "posts", ad, {
      headers: this.headers
    });
  }

  editAd(ad, id): Observable<any> {
    return this.httpclient.put(GlobalURL.URL + "posts/" + id, ad, {
      headers: this.headers
    });
  }

  deleteAd(ad, id): Observable<any> {
    return this.httpclient.put(GlobalURL.URL + "posts/" + id, ad, {
      headers: this.headers
    });
  }

  filterAd(value): Observable<any> {
    return this.httpclient.get(
      GlobalURL.URL +
        'posts/?filter={"where":{"title":{"like":"' +
        value +
        '"}},"limit":50}'
    );
  }

  // uploadImages(items, type?): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.httpclient
  //       .post(GlobalURL.URL + "attachments/images/upload", items)
  //       .subscribe(
  //         data => {
  //           console.log("data ", data);
  //           resolve(data);
  //         },
  //         error => {
  //           console.log("error ", error);
  //           reject();
  //         }
  //       );
  //   });
  // }

  uploadImages(data): Observable<any> {
    var headers1 = new HttpHeaders({
      /* 'Content-Type': 'multipart/form-data', */
      Authorization: this.accessToken
    });
    headers1.delete("Content Type");
    return this.httpclient.post(
      GlobalURL.URL + "attachments/images/upload",
      data,
      {
        reportProgress: true,
        observe: "events"
      }
    );
  }
  /* return new Promise((resolve, reject) => {
      this.httpclient.post(GlobalURL.URL + 'attachments/images/upload?access_token=' + this.accessToken, data)
          .subscribe(
            data => {
             // console.log('data ', data);
              resolve(data);
              debugger
            },
            error => {
              console.log('error ', error);
               reject();
            }
          );
    }
  })
 */

  /*  reportProgress: true,
    observe: 'events' */
}

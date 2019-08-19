import { GlobalURL } from "../global-url";
import { HttpClient } from "@angular/common/http";
import { map, catchError, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
@Injectable()
export abstract class ApiServiceBase {

    apiEndPoint = GlobalURL.URL;
    constructor(protected httpclient: HttpClient) { }

    getWithCount(query) {

        return this.httpclient.get(this.apiEndPoint + query, { observe: 'response' }).pipe(
            map((response) => {
                let count = response.headers.get('X-Total-Count');
                let data = response.body;
                return { count, data };
            })
        )
    }

    get(query) {
        return this.httpclient.get(this.apiEndPoint + query);
    }



}

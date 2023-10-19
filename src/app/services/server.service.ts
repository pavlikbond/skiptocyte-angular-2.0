import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private apiURLs = {
    updateSubscriptionStatus:
      'http://localhost:4000/api/updateSubscriptionStatus',
  };
  constructor(private httpClient: HttpClient) {}

  updateSubscriptionStatus(status: string, userId: string) {
    //call server with a /api/updateSubscriptionStatus endpoint and pass in userId and status using Angular http module
    //return the response
    console.log('updateSubscriptionStatus called', userId, status);

    this.httpClient
      .put(this.apiURLs.updateSubscriptionStatus, { userId, status })
      .pipe(
        catchError((error) => {
          console.log(error);

          return throwError(() => error);
        })
      )
      .subscribe((data) => {
        console.log(data);
      });
  }
}

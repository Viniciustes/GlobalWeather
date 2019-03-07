import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Constants } from 'src/app/app.constants';
import { CurrentConditions } from 'src/app/shared/models/current-conditions';
import { ErrorHandleService } from 'src/app/shared/services/error-handle.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentConditionsService {

  constructor(
    private http: HttpClient,
    private errorHandleService: ErrorHandleService) { }

  getCurrentConditions(locationKey: string): Observable<CurrentConditions[]> {
    const uri = decodeURIComponent(
      `${Constants.currentConditionsAPIUrl}/${locationKey}?apikey=${Constants.apiKey}`
    );
    return this.http.get<CurrentConditions[]>(uri)
      .pipe(
        tap(_ => console.log('fetched current conditions')),
        catchError(this.errorHandleService.handleError('getCurrentConditions', []))
      );
  }
}

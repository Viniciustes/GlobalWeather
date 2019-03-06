import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorHandleService } from './error-handle.service';
import { Observable } from 'rxjs';
import { CurrentConditions } from '../models/current-conditions';
import { Constants } from 'src/app/app.constants';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrentConditionsService {

  constructor(
    private http: HttpClient,
    private errorHandleService: ErrorHandleService
  ) { }

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

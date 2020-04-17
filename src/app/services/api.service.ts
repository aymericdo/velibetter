import { LatLngBoundsLiteral } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, empty, EMPTY } from 'rxjs';
import { Coordinate, Station } from '../interfaces';
import { Feedback } from './../interfaces/index';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseURL = 'https://velibetter.herokuapp.com';
  constructor(private httpClient: HttpClient) {}

  fetchClosestInfo(
    latLngBoundsLiteral: LatLngBoundsLiteral,
    currentPosition: Coordinate,
  ): Observable < Station[] > {
    return this.httpClient.post(
      `${this.baseURL}/stations-in-polygon/`, {
        latLngBoundsLiteral,
        currentPosition,
      },
    ) as Observable < Station[] > ;
  }

  fetchClosestStatusForDeparture(
    currentPosition: Coordinate,
    delta?: number,
  ): Observable<Station[]> {
    return this.httpClient.post(
      `${this.baseURL}/departure/`, {
        currentPosition,
        options: { delta },
      },
    ) as Observable < Station[] > ;
  }

  fetchClosestStatusForArrival(
    currentPosition: Coordinate,
    delta ?: number,
  ): Observable<Station[]> {
    return this.httpClient.post(
      `${this.baseURL}/arrival/`, {
        currentPosition,
        options: { delta },
      },
    ) as Observable<Station[]>;
  }

  fetchStation(
    stationId: number,
    currentPosition: Coordinate,
  ): Observable <Station> {
    return this.httpClient.post(
      `${this.baseURL}/stations/${stationId}`,
      currentPosition,
    ) as Observable<Station>;
  }

  saveFeedback(
    feedback: Feedback,
  ): Observable<never> {
    return this.httpClient.post(
      `${this.baseURL}/feedback/`,
      feedback,
    ) as Observable<never>;
  }
}

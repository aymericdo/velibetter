import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LatLngBoundsLiteral } from '@agm/core';
import { Coordinate, Station } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseURL = 'http://localhost:8000';
  constructor(private httpClient: HttpClient) { }

  fetchClosestInfo(
    latLngBoundsLiteral: LatLngBoundsLiteral,
    currentPosition: Coordinate,
  ): Observable<Station[]> {
    return this.httpClient.post(
      `${this.baseURL}/stations-in-polygon/`,
      {
        latLngBoundsLiteral,
        currentPosition,
      },
    ) as Observable<Station[]>;
  }

  fetchClosestStatusForDeparture(
    currentPosition: Coordinate,
  ): Observable<Station[]> {
    return this.httpClient.post(
      `${this.baseURL}/departure/`,
      currentPosition,
    ) as Observable<Station[]>;
  }

  fetchClosestStatusForArrival(
    currentPosition: Coordinate,
  ): Observable<Station[]> {
    return this.httpClient.post(
      `${this.baseURL}/arrival/`,
      currentPosition,
    ) as Observable<Station[]>;
  }

  fetchStation(
    stationId: number,
    currentPosition: Coordinate,
  ): Observable<Station> {
    return this.httpClient.post(
      `${this.baseURL}/stations/${stationId}`,
      currentPosition,
    ) as Observable<Station>;
  }

  getForecast(
    stationId: number,
    bikeType: string,
    deltaHours: number,
  ): Observable<Station> {
    return this.httpClient.post(
      `${this.baseURL}/stations/${stationId}`,
      {
        stationId,
        bikeType,
        deltaHours
      }
    ) as Observable<Station>;
  }
}

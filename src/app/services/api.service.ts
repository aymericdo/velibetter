import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LatLngBoundsLiteral } from '@agm/core';

export interface Station {
  stationId: number;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  distance?: number;
  numBikesAvailable: number;
  numDocksAvailable: number;
  isInstalled: boolean;
  isReturning: boolean;
  isRenting: boolean;
  lastReported: number;
  mechanical: number;
  ebike: number;
  rentalMethods: string[];
}

export interface Coordinate {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseURL = 'http://127.0.0.1:8000';
  constructor(private httpClient: HttpClient) {}

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
}

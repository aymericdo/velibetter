import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LatLngBoundsLiteral } from '@agm/core';

export interface StationInfo {
  stationId: number;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  stationCode: string;
}

export interface StationStatus extends StationInfo {
  stationCode: string;
  stationId: number;
  distance: number;
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

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseURL = 'https://velibetter.herokuapp.com';
  constructor(private httpClient: HttpClient) {}

  fetchClosestInfo(
    latLngBoundsLiteral: LatLngBoundsLiteral
  ): Observable<StationInfo[]> {
    return this.httpClient.post(
      `${this.baseURL}/closest-station-info-list/`,
      latLngBoundsLiteral
    ) as Observable<StationInfo[]>;
  }

  fetchAllInfo(): Observable<StationInfo[]> {
    return this.httpClient.get(
      `${this.baseURL}/station-info-list/`
    ) as Observable<StationInfo[]>;
  }

  fetchClosestStatusForDeparture(lat: number, lng: number): Observable<StationStatus[]> {
    return this.httpClient.get(
      `${this.baseURL}/departure/${lat}/${lng}`,
    ) as Observable<StationStatus[]>;
  }

  fetchStationStatus(stationId: number): Observable<StationStatus[]> {
    return this.httpClient.get(
      `${this.baseURL}/station-status/${stationId}`
    ) as Observable<StationStatus[]>;
  }
}

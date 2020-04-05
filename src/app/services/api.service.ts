import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  Observable
} from 'rxjs';
import {
  LatLngBoundsLiteral
} from '@agm/core';
import {
  Coordinate,
  Station
} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseURL = 'http://localhost:8000';
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
  ): Observable < Station[] > {
    return this.httpClient.post(
      `${this.baseURL}/departure/`, {
        currentPosition,
        delta: delta || null,
      },
    ) as Observable < Station[] > ;
  }

  fetchClosestStatusForArrival(
    currentPosition: Coordinate,
    delta ? : number,
  ): Observable < Station[] > {
    const payload = {
      ...currentPosition,
      delta: delta !== undefined ? delta : 0
    } ;
    return this.httpClient.post(
      `${this.baseURL}/arrival/`, payload,
    ) as Observable < Station[] > ;
  }

  fetchStation(
    stationId: number,
    currentPosition: Coordinate,
  ): Observable < Station > {
    return this.httpClient.post(
      `${this.baseURL}/stations/${stationId}`,
      currentPosition,
    ) as Observable < Station > ;
  }

}

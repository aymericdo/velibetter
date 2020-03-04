import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LatLngBoundsLiteral } from "@agm/core";

export interface Station {
  stationId: number;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  stationCode: string;
}

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private baseURL = "https://velibetter.herokuapp.com/station-info-list/";
  constructor(private httpClient: HttpClient) {}
  fetchClosest(
    latLngBoundsLiteral: LatLngBoundsLiteral
  ): Observable<Station[]> {
    return this.httpClient.post(
      `${this.baseURL}/closest`,
      latLngBoundsLiteral
    ) as Observable<Station[]>;
  }
  fetchAll(): Observable<Station[]> {
    return this.httpClient.get(this.baseURL) as Observable<Station[]>;
  }
}

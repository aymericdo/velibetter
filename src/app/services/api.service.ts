import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Station {
  stationId: number;
  name: string;
  lat: number;
  lon: number;
  capacity: number;
  stationCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 private baseURL = 'https://velibetter.herokuapp.com/station-info-list/';
 constructor(private httpClient: HttpClient) { }
 fetch(): Observable<Station[]> {
   return this.httpClient.get(this.baseURL) as Observable<Station[]>;
 }
}

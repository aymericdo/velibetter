import { Component, OnInit } from '@angular/core';
import { Station, ApiService } from './services/api.service';

interface Marker {
  lat: number;
  lng: number;
  alpha: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Velibetter';
  stations: Array<Station>;
  markers: Array<Marker>;

  lat = 48.859889;
  lng = 2.346878;
  zoom = 13;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.apiService.fetch().subscribe(
      (data: Array<Station>) => {
        this.stations = data;
        this.markers = this.stations.map(s => ({
          lat: s.lat,
          lng: s.lon,
          alpha: 0.4,
        }));
      }, (err) => {
        console.log(err);
      }
    );
  }
}

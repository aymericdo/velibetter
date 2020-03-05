import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { fetchingClosestStationsStatus } from "../actions/stations";
import { AppState } from "../reducers";
import { stationsStatus, stationsInfo } from "../reducers/stations";
import { StationStatus } from "../services/api.service";

@Component({
  selector: "app-departure-list",
  templateUrl: "./departure-list.component.html",
  styleUrls: ["./departure-list.component.scss"]
})
export class DepartureListComponent implements OnInit {
  stationsStatus$: Observable<StationStatus[]>;

  constructor(private store: Store<AppState>) {
    this.stationsStatus$ = store.pipe(select(stationsStatus));
  }

  ngOnInit(): void {
    this.store.select(stationsInfo).subscribe(state => {
      this.store.dispatch(
        fetchingClosestStationsStatus({
          stationIds: state.map(info => info.stationId)
        })
      );
    });
  }
}

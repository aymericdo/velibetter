import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { getIsCompassView } from '../reducers/galileo';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  isCompassView$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.isCompassView$ = store.pipe(select(getIsCompassView));
  }

  ngOnInit() {
  }

  back(): void {
    if (['departure', 'arrival'].includes(this.router.url.split('/')[1]) && this.router.url.split('/').length > 2) {
      this.router.navigate([this.router.url.split('/')[1]]);
    } else if (['departure', 'arrival'].includes(this.router.url.split('/')[1])) {
      this.router.navigate(['/']);
    } else if (['stations'].includes(this.router.url.split('/')[1]) && this.router.url.split('/').length > 2) {
      this.router.navigate(['/']);
    }
  }
}

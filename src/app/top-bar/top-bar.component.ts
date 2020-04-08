import { Component, Output, EventEmitter } from '@angular/core';
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
export class TopBarComponent {
  @Output() back = new EventEmitter<any>();
  isCompassView$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.isCompassView$ = store.pipe(select(getIsCompassView));
  }

  onBack(): void {
    if (this.back.observers.length > 0) {
      this.back.emit();
    } else {
      this.router.navigate(['/']);
    }
  }
}

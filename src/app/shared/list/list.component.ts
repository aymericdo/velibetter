import { Component, OnInit, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { isLoading } from 'src/app/reducers/stations';
import { isMobile } from '../../reducers/screen';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @HostBinding('class.-is-splitted')
  get isSplittedClass() {
    return this.isSplitted;
  }
  isLoading$: Observable<boolean>;
  isMobile$: Observable<boolean>;
  isSplitted: boolean;

  constructor(
    private store: Store<AppState>,
  ) {
    this.isLoading$ = store.pipe(select(isLoading));
    this.isMobile$ = store.pipe(select(isMobile));
  }

  ngOnInit(): void {
    this.isMobile$.subscribe((isMobile) => {
      this.isSplitted = !isMobile;
    });
  }
}

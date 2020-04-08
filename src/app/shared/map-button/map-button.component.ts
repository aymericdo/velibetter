import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-map-button',
  templateUrl: './map-button.component.html',
  styleUrls: ['./map-button.component.scss']
})
export class MapButtonComponent {
  @Output() goToDescription = new EventEmitter<any>();
}

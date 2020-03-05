import { Component, Output, EventEmitter, Input } from '@angular/core';
import { speedDialFabAnimations } from '../animations/speed-dial-fab.animations';

interface Button {
  id: number;
  icon: string;
}

@Component({
  selector: 'app-speed-dial-fab',
  templateUrl: './speed-dial-fab.component.html',
  styleUrls: ['./speed-dial-fab.component.scss'],
  animations: speedDialFabAnimations
})
export class SpeedDialFabComponent {
  @Input() mainButtonIcon: string;
  @Input() fabButtons: Button[];
  @Output() redirect = new EventEmitter<number>();

  buttons: Button[] = [];
  fabTogglerState = 'inactive';

  constructor() { }

  showItems() {
    this.fabTogglerState = 'active';
    this.buttons = this.fabButtons;
  }

  hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }

  onToggleFab() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }
}

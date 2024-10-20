import { Component } from '@angular/core';

@Component({
  selector: 'app-home-conductor',
  templateUrl: './home-conductor.page.html',
  styleUrls: ['./home-conductor.page.scss'],
})
export class HomeConductorPage {
  selectedSegment = 'inicio';

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }
  constructor() {}
}

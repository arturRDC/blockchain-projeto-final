import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.css',
})
export class CountdownComponent {
  @Input() closingTime: number = 0; // Unix timestamp
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  pollEnded = false;

  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const now = Math.floor(Date.now() / 1000);
    const diff = this.closingTime - now;

    if (diff <= 0) {
      this.pollEnded = true;
    } else {
      this.days = Math.floor(diff / (60 * 60 * 24));
      this.hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
      this.minutes = Math.floor((diff % (60 * 60)) / 60);
      this.seconds = Math.floor(diff % 60);
    }
    console.log(this.pollEnded);
  }
}

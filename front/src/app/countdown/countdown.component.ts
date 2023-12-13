import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PollNum } from '../poll/poll';
// type Poll = {
//   title: string;
//   description: string;
//   options: string[];
//   totalVotes: bigint;
//   votesPerOption: bigint[];
//   _closingTime: bigint;
// };

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.css',
})
export class CountdownComponent {
  @Input() poll: PollNum | null = null; // Unix timestamp
  // days: bigint = BigInt(0);
  // hours: bigint = BigInt(0);
  // minutes: bigint = BigInt(0);
  // seconds: bigint = BigInt(0);
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
    if (this.poll == null) return;
    const diff = this.poll._closingTime - now;

    if (diff <= 0) {
      this.pollEnded = true;
    } else {
      this.days = Math.floor(diff / (60 * 60 * 24));
      this.hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
      this.minutes = Math.floor((diff % (60 * 60)) / 60);
      this.seconds = Math.floor(diff % 60);
    }
  }
}

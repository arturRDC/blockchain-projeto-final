import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type Poll = {
  title: string;
  description: string;
  options: string[];
  totalVotes: bigint;
  votesPerOption: bigint[];
  _closingTime: bigint;
};

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.css',
})
export class CountdownComponent {
  @Input() poll: Poll | null = null; // Unix timestamp
  days: bigint = BigInt(0);
  hours: bigint = BigInt(0);
  minutes: bigint = BigInt(0);
  seconds: bigint = BigInt(0);
  pollEnded = false;

  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const now = BigInt(Math.floor(Date.now() / 1000));
    if (this.poll == null) return;
    const diff = this.poll._closingTime - BigInt(now);

    if (diff <= 0) {
      this.pollEnded = true;
    } else {
      this.days = diff / BigInt(60 * 60 * 24);
      this.hours = (diff % BigInt(60 * 60 * 24)) / BigInt(60 * 60);
      this.minutes = (diff % BigInt(60 * 60)) / BigInt(60);
      this.seconds = diff % BigInt(60);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CountdownComponent } from '../countdown/countdown.component';
import { PollService } from '../poll.service';
import { ActivatedRoute } from '@angular/router';
import { Poll, PollNum } from './poll';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css',
  standalone: true,
  imports: [FormsModule, CommonModule, CountdownComponent],
})
export class PollComponent implements OnInit {
  poll: any;
  pollId: string | null = null;
  votesPercent: number[] | null = null;

  selectedOption: number | null = null;
  voteAmount: number = 1;

  constructor(
    private route: ActivatedRoute,
    private pollService: PollService
  ) {}

  async ngOnInit() {
    this.pollId = this.route.snapshot.paramMap.get('id');
    if (this.pollId) {
      this.pollService.getPollUpdates().subscribe((data) => {
        this.poll = data;
      });
      this.poll = await this.pollService.getPoll(this.pollId as string);
      console.log(this.poll);
      if (this.poll.totalVotes === 0) {
        // Handle the case when there are no votes
        console.log('test');
        this.poll.votesPercent = this.poll.votesPerOption.map(() => 0);
      } else {
        // this.poll.votesPercent = [0, 0];
        // this.poll.votesPercent = this.poll.votesPerOption
        //   .filter((m: number | null): m is number => typeof m === 'number')
        //   .map((m: number) => m / this.poll.totalVotes);
        // this.poll.votesPercent = this.poll.votesPerOption.map(
        //   (m: bigint) => (m * BigInt(100)) / this.poll.totalVotes
        // );
      }
    } else {
      // Handle the case when pollId is null
      // Redirect to a 404 page or show a default message
    }
  }

  openModal() {
    const modal = document.querySelector('#voteConfModal') as HTMLDialogElement;
    modal.showModal();
  }

  handleInvalidKeys(event: KeyboardEvent) {
    return ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(
      event.code
    )
      ? true
      : !isNaN(Number(event.key)) && event.code !== 'Space';
  }

  async handleVote() {
    if (this.pollId === null) {
      console.error('pollId is null');
      return;
    }
    await this.pollService.votePoll(
      this.pollId,
      this.selectedOption,
      this.voteAmount
    );
  }
}

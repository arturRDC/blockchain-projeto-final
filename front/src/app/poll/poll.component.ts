import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CountdownComponent } from '../countdown/countdown.component';
import { PollService } from '../poll.service';
import { ActivatedRoute } from '@angular/router';

type Poll = {
  title: string;
  description: string;
  options: string[];
  totalVotes: bigint;
  votesPerOption: bigint[];
  _closingTime: bigint;
};

type PollNum = {
  title: string;
  description: string;
  options: string[];
  totalVotes: number;
  votesPerOption: number[];
  _closingTime: bigint;
};

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css',
  standalone: true,
  imports: [FormsModule, CommonModule, CountdownComponent],
})
export class PollComponent implements OnInit {
  poll: any;
  pollId = '874';

  selectedOption: number | null = null;
  voteAmount: number = 1;

  constructor(
    private route: ActivatedRoute,
    private pollService: PollService
  ) {}

  async ngOnInit() {
    // this.poll = {
    //   title: 'Who is going to die next episode?',
    //   description: "I'm feeling spicy today...",
    //   timeLeft: 36000,
    //   options: ['John Snow', 'Arya Stark', 'Sansa Stark'],
    //   votesPerOption: [25, 35, 20],
    // };
    if (this.pollId) {
      this.poll = await this.pollService.getPoll(this.pollId as string);
      this.poll.votesPercent = this.poll.votesPerOption
        .filter((m: number | null): m is number => typeof m === 'number')
        .map((m: number) => m / this.poll.totalVotes);

      this.poll.votesPercent = this.poll.votesPerOption.map(
        (m: number) => (m * 100) / this.poll.totalVotes
      );
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

  // TODO
  async handleVote() {
    console.log('vote amount: ' + this.voteAmount);
    console.log('selected option ' + this.selectedOption);
    await this.pollService.votePoll(
      this.pollId,
      this.selectedOption,
      this.voteAmount
    );
  }
}

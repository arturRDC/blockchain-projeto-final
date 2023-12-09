import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class PollComponent implements OnInit {
  poll: any;
  selectedOption: number | null = null;
  voteAmount: number = 1;

  ngOnInit() {
    this.poll = {
      title: 'Who is going to die next episode?',
      description: "I'm feeling spicy today...",
      timeLeft: 36000,
      options: ['John Snow', 'Arya Stark', 'Sansa Stark'],
      votesPerOption: [25, 35, 20],
    };
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
  handleVote() {
    console.log('vote amount: ' + this.voteAmount);
    console.log('selected option ' + this.selectedOption);
  }
}

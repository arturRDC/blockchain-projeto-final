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
  poll: any = { options: [] };

  ngOnInit() {
    this.poll = {
      title: 'Who is going to die next episode?',
      description: "I'm feeling spicy today...",
      timeLeft: 36000,
      options: ['John Snow', 'Arya Stark', 'Sansa Stark'],
    };
  }
}

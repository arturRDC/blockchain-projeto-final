import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { PollService } from '../poll.service';

@Component({
  selector: 'app-poll-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './poll-form.component.html',
  styleUrl: './poll-form.component.css',
})
export class PollFormComponent {
  pollForm: FormGroup;

  constructor(private fb: FormBuilder, private pollService: PollService) {
    this.pollForm = this.fb.group({
      title: '',
      description: '',
      days: 0,
      hours: 6,
      minutes: 0,
      seconds: 0,
      options: this.fb.array(['', '']),
    });
  }

  get options() {
    return this.pollForm.get('options') as FormArray;
  }

  addOption() {
    this.options.push(this.fb.control(''));
  }

  calcDuration(): number {
    let daysUT = this.pollForm.get('days')?.value * (60 * 60 * 24);
    let hoursUT = this.pollForm.get('hours')?.value * 60 * 60;
    let minutesUT = this.pollForm.get('hours')?.value * 60;
    let secondsUT = this.pollForm.get('hours')?.value;
    return daysUT + hoursUT + minutesUT + secondsUT;
  }

  async onSubmit() {
    console.log(this.pollForm.value);
    let duration: number = this.calcDuration();
    this.pollService.createPoll(
      this.pollForm.get('title')?.value,
      this.pollForm.get('description')?.value,
      this.pollForm.get('options')?.value,
      duration
    );
  }

  handleInvalidKeys(event: KeyboardEvent) {
    return ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(
      event.code
    )
      ? true
      : !isNaN(Number(event.key)) && event.code !== 'Space';
  }
}

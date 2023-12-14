import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-poll-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './poll-form.component.html',
  styleUrl: './poll-form.component.css',
})
export class PollFormComponent {
  pollForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.pollForm = this.fb.group({
      title: '',
      description: '',
      duration: '',
      options: this.fb.array(['']),
    });
  }

  get options() {
    return this.pollForm.get('options') as FormArray;
  }

  addOption() {
    this.options.push(this.fb.control(''));
  }

  onSubmit() {
    console.log(this.pollForm.value);
    // Call blockchain
  }
}

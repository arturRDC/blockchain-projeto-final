import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PollService } from '../poll.service';

@Component({
  selector: 'app-add-writer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-writer.component.html',
  styleUrl: './add-writer.component.css',
})
export class AddWriterComponent {
  writerAddress: string = '';

  constructor(private pollService: PollService) {}

  addWriter() {
    console.log(this.writerAddress);
    this.pollService.addWriter(this.writerAddress);
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PollService } from '../poll.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class NavbarComponent {
  constructor(public router: Router, public pollService: PollService) {}

  isWriter: boolean = false;
  canAddWriter: boolean = false;

  async ngOnInit() {
    this.pollService.isWriter().then((result) => {
      this.isWriter = result;
    });

    this.pollService.canAddWriter().then((result) => {
      this.canAddWriter = result;
      console.log(this.canAddWriter);
    });
  }
}

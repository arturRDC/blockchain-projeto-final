import { Routes } from '@angular/router';
import { PollComponent } from './poll/poll.component';
import { PollFormComponent } from './poll-form/poll-form.component';
import { ApplyFormComponent } from './apply-form/apply-form.component';

export const routes: Routes = [
  { path: 'poll/create', component: PollFormComponent },
  { path: 'poll/:id', component: PollComponent },
  { path: 'apply', component: ApplyFormComponent },
];

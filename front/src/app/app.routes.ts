import { Routes } from '@angular/router';
import { PollComponent } from './poll/poll.component';

export const routes: Routes = [{ path: 'poll/:id', component: PollComponent }];

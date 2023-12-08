import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { PollComponent } from './poll/poll.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [],
  imports: [BrowserModule, AppComponent, PollComponent, NavbarComponent],
  providers: [],
  bootstrap: [],
})
export class AppModule {}

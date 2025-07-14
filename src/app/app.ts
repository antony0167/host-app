import {Component, HostListener} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {
  @HostListener('window:message', ['$event'])
  handleButtonClicked(event: MessageEvent) {
    if (event.data?.type === 'buttonClicked') {
      console.log('buttonClicked', event.data.detail);
    }
  }
}

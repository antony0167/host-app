import {Component, HostListener, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App implements OnInit {
  urls: any[] | undefined;

  constructor(private sanitizer: DomSanitizer) {}


  ngOnInit() {
    this.urls = Array.from({ length: 10 }, (value, index) =>
      this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:4201/?id=${index}`));
  }

  @HostListener('window:message', ['$event'])
  handleButtonClicked(event: MessageEvent) {
    if (event.data?.type === 'buttonClicked') {
      console.log('buttonClicked', event.data.detail);
    }
  }
}

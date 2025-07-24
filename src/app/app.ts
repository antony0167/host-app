import {Component, OnInit} from '@angular/core';
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
  n: number = 10;

  constructor(private sanitizer: DomSanitizer) {}


  ngOnInit() {
    this.urls = Array.from({ length: this.n }, (value, index) =>
      this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:3000/mf/?id=${index}`));

    window.addEventListener('message', (event) => {
      if (event.origin !== 'http://localhost:3000') {
        console.log("Unknown origin", event.origin);
        return;
      }

      const iframes = document.querySelectorAll("iframe");

      for (let iframe of iframes) {
        iframe?.contentWindow?.postMessage(event.data, 'http://localhost:3000/mf');
      }
    });
  }

}

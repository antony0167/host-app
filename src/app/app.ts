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
  private iframes!: NodeListOf<HTMLIFrameElement>;
  private observer: MutationObserver | undefined;

  constructor(private sanitizer: DomSanitizer) { }


  ngOnInit() {
    this.iframes = document.querySelectorAll('iframe');
    this.setupObserver();

    this.urls = Array.from({ length: this.n }, () =>
      this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:3000/mf/`));

    window.addEventListener('message', (event) => {
      if (event.origin !== 'http://localhost:3000') {
        console.log("Unknown origin", event.origin);
        return;
      }

      for (let iframe of this.iframes) {
        iframe?.contentWindow?.postMessage(event.data, 'http://localhost:3000/mf');
      }
    });

  }

  onClick() {
    this.urls?.push(this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:3000/mf/`));
    this.n++;
  }

  private setupObserver() {
    this.observer = new MutationObserver(() => {
      this.iframes = document.querySelectorAll('iframe');
      console.log(this.iframes);
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

}

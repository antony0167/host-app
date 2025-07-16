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
  n: number = 10;
  sendRequests: boolean = false;

  constructor(private sanitizer: DomSanitizer) {}


  ngOnInit() {
    this.urls = Array.from({ length: this.n }, (value, index) =>
      this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:4201/?id=${index}`));
  }

  @HostListener('window:message', ['$event'])
  handleButtonClicked(event: MessageEvent) {
    if (event.data?.type === 'sendMessage') {
      const detail = event.data.detail;
      this.sendToChild(detail.sourceId, detail.targetId);
    }
  }

  sendToChild(sourceId: number, targetId: number) {
    const iframe = document.getElementById(`${targetId}`) as HTMLIFrameElement;

    iframe?.contentWindow?.postMessage({
      type: 'sendToChild',
      detail: {
        name: 'sendToChild',
        sourceId: sourceId,
        targetId: targetId
      }
    }, `http://localhost:4201/${targetId}`);
  }

}

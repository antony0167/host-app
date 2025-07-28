import {Component, OnDestroy, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {AppConfig} from '../../../project.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  urls: any[] | undefined;
  private iframes!: NodeListOf<HTMLIFrameElement>;
  private observer: MutationObserver | undefined;
  private channel: BroadcastChannel | null = null;

  constructor(private sanitizer: DomSanitizer) { }


  ngOnInit() {
    this.iframes = document.querySelectorAll('iframe');
    this.setupObserver();

    this.urls = Array.from({ length: AppConfig.microFrontendCount }, () =>
      this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:3000/mf/`));

    if (AppConfig.communicationMethod === 'postMessage') {
      window.addEventListener('message', this.forwardPostMessage);
    } else if (AppConfig.communicationMethod === 'customEvent') {
      window.addEventListener('mf-message', this.forwardCustomEvent as EventListener);
    } else if (AppConfig.communicationMethod === 'broadcastChannel') {
      this.channel = new BroadcastChannel('mf_channel');
      this.channel.onmessage = this.forwardBroadcastChannel;
    }
  }

  forwardPostMessage = (event: MessageEvent) => {
    if (event.origin !== 'http://localhost:3000') return;

    for (let iframe of this.iframes) {
      iframe?.contentWindow?.postMessage(event.data, 'http://localhost:3000/mf');
    }
  };

  forwardCustomEvent = (event: CustomEvent) => {
    const detail = event.detail;
    for (let iframe of this.iframes) {
      iframe?.contentWindow?.postMessage({ type: 'customEvent', detail }, 'http://localhost:3000/mf');
    }
  };

  forwardBroadcastChannel = (event: MessageEvent) => {
    for (let iframe of this.iframes) {
      iframe?.contentWindow?.postMessage(event.data, 'http://localhost:3000/mf');
    }
  };

  ngOnDestroy() {
    if (AppConfig.communicationMethod === 'broadcastChannel') {
      this.channel?.close();
      this.channel = null;
    }
  }

  onClick() {
    this.urls?.push(this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:3000/mf/`));
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

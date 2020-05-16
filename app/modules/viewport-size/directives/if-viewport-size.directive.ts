import { Subscription } from 'rxjs';
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  EmbeddedViewRef,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { ViewportSizesEnum } from '../viewport-sizes.enum';
import { ViewportSizesService } from '../providers/viewport-sizes.service';

@Directive({
  selector: '[ifViewportSize]',
})
export class IfViewportSizeDirective implements OnInit, OnDestroy {
  private embeddedViewRef?: EmbeddedViewRef<unknown>;

  private subscription?: Subscription;

  private size?: ViewportSizesEnum;

  constructor(
    private templateRef: TemplateRef<void>,
    private viewContainerRef: ViewContainerRef,
    private viewportSizesService: ViewportSizesService,
  ) {
  }

  @Input('ifViewportSize')
  set setSize(size: ViewportSizesEnum | undefined) {
    this.size = size;
    this.handler();
  }

  ngOnInit() {
    this.subscription = this.viewportSizesService.size$
      .subscribe(this.handler.bind(this));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // TODO: needs clear viewContainerRef?
  }

  handler() {
    if (!this.size) {
      this.insert();
      return;
    }

    const result = this.viewportSizesService.sizes[this.size];

    if (result) {
      this.insert();
    } else {
      this.clear();
    };
  }

  insert() {
    if (this.embeddedViewRef) return;
    const embeddedViewRef = this.viewContainerRef.createEmbeddedView(this.templateRef);
    embeddedViewRef.detectChanges();
    this.embeddedViewRef = embeddedViewRef;
  }

  clear() {
    if (!this.embeddedViewRef) return;
    this.embeddedViewRef.destroy();
    this.embeddedViewRef = void 0;
  }
}

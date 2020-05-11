import { Subscription } from 'rxjs';
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

import { ViewportSizesEnum } from './viewport-sizes.enum';
import { ViewportSizesService } from './viewport-sizes.service';

@Directive({
  selector: '[ifViewportSize]',
})
export class IfViewportSizeDirective implements OnInit, OnDestroy {
  private isActive = false;

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
    if (this.isActive) return;
    this.viewContainerRef.createEmbeddedView(this.templateRef);
    this.isActive = true;
  }

  clear() {
    if (!this.isActive) return;
    this.viewContainerRef.clear();
    this.isActive = false;
  }
}

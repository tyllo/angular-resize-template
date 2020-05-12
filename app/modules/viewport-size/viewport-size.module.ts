import { NgModule } from '@angular/core';

import { IfViewportSizeDirective } from './directives/if-viewport-size.directive';
import { ViewportSizesService, VIEWPORT_SIZES_SERVICE_SETTINGS } from './providers/viewport-sizes.service';

export { VIEWPORT_SIZES_SERVICE_SETTINGS };

@NgModule({
  declarations: [
    IfViewportSizeDirective,
  ],
  exports: [
    IfViewportSizeDirective,
  ],
  providers: [
    ViewportSizesService,
    {
      provide: VIEWPORT_SIZES_SERVICE_SETTINGS,
      useValue: { medium: 800, large: 1440 },
    }
  ],
})
export class ViewportSizeModule {
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {
  ViewportSizeModule,
  VIEWPORT_SIZES_SERVICE_SETTINGS,
} from './viewport-size/viewport-size.module';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { TestComponent } from './test.component';

@NgModule({
  imports: [
    BrowserModule,
    ViewportSizeModule,
  ],
  declarations: [
    AppComponent,
    HelloComponent,
    TestComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
  providers: [
    {
      provide: VIEWPORT_SIZES_SERVICE_SETTINGS,
      useValue: { medium: 480, large: 1024 },
    }
  ],
})
export class AppModule { }

import { fromEvent, Subject, animationFrameScheduler } from 'rxjs';
import { debounceTime, startWith, map, distinctUntilChanged, shareReplay, observeOn, tap } from 'rxjs/operators';
import { Injectable, InjectionToken, Inject, ApplicationRef, NgZone } from '@angular/core';

import { ViewportSizesEnum as Enum } from './viewport-sizes.enum';

export interface IConfig {
  medium: number;
  large: number;
}

export const VIEWPORT_SIZES_SERVICE_SETTINGS = new InjectionToken<IConfig>(
  'VIEWPORT_SIZES_SERVICE_SETTINGS',
);

const RESIZE_DEBOUNCE_TIME = 20;

const SIZES = {
  DEFAULT: Object.freeze({ [Enum.small]: false, [Enum.medium]: false, [Enum.large]: false }),
  SMALL:   Object.freeze({ [Enum.small]: true,  [Enum.medium]: false, [Enum.large]: false }),
  MEDIUM:  Object.freeze({ [Enum.small]: false, [Enum.medium]: true,  [Enum.large]: false }),
  LARGE:   Object.freeze({ [Enum.small]: false, [Enum.medium]: false, [Enum.large]: true }),
};

const getViewportSizeFabric = (config: IConfig) => () => {
  if (window.innerWidth < config.medium) return Enum.small;
  if (window.innerWidth < config.large) return Enum.medium;
  return Enum.large;
};

const createSizesObservable = (config: IConfig, applicationRef: ApplicationRef, time: number) => {
  const getViewportSize = getViewportSizeFabric(config);
  const initValue = getViewportSize();

  return fromEvent(window, 'resize')
    .pipe(
      observeOn(animationFrameScheduler),
      startWith(initValue),
      debounceTime(time),
      map(getViewportSize),
      distinctUntilChanged(),
      // TODO: нужно вручную запускать tick из-за zone.runOutsideAngular ((
      tap(() => setTimeout(() => applicationRef.tick(), 0)),
      shareReplay({ refCount: true, bufferSize: 1 })
    ) as Subject<Enum>
};

@Injectable({
  providedIn: 'root',
})
export class ViewportSizesService {
  private _size$: Subject<Enum>;

  private _sizes = SIZES.DEFAULT;

  get size$() {
    return this._size$;
  }

  get sizes() {
    return this._sizes;
  }

  constructor(
    @Inject(VIEWPORT_SIZES_SERVICE_SETTINGS) private config: IConfig,
    private zone: NgZone,
    private applicationRef: ApplicationRef,
  ) {

    zone.runOutsideAngular(() => {
      const size$ = createSizesObservable(config, applicationRef, RESIZE_DEBOUNCE_TIME);
      this._size$ = size$;
      size$.subscribe(this.handler.bind(this));
    });
  }

  private handler(size: Enum) {
    switch (size) {
      case Enum.small:
        this._sizes = SIZES.SMALL;
        break;

      case Enum.medium:
        this._sizes = SIZES.MEDIUM;
        break;

      case Enum.large:
        this._sizes = SIZES.LARGE;
        break;

      default:
        this._sizes = SIZES.DEFAULT;
    }
  }
}

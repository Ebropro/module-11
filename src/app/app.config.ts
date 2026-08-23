import { jwtInterceptor } from './interceptors/jwt.interceptor';


import {
  ApplicationConfig,
  provideZonelessChangeDetection
} from '@angular/core';

import {
  provideRouter,
  withComponentInputBinding
} from '@angular/router';

import {
  provideHttpClient,
  withInterceptors,
  withXhr,
  withXsrfConfiguration
} from '@angular/common/http';

import { routes } from './app.routes';

import { credentialsInterceptor } from './interceptors/credentials.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [

    provideZonelessChangeDetection(),

    provideRouter(
      routes,
      withComponentInputBinding()
    ),

    provideHttpClient(
      withXhr(),

      withInterceptors([
        credentialsInterceptor,
        errorInterceptor,
        jwtInterceptor
      ]),

      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      })
    )
  ]
};

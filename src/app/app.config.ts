import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { headersInterceptor } from './Core/Interceptor/headers.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loaderInterceptor } from './Core/Interceptor/loader.interceptor';
import { errorInterceptor } from './Core/Interceptor/error.interceptor';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([headersInterceptor, loaderInterceptor, errorInterceptor])),
    importProvidersFrom(RouterModule, BrowserAnimationsModule, NgxSpinnerModule, SweetAlert2Module),
    provideToastr({
      timeOut: 2500,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      tapToDismiss: true,
      newestOnTop: true,
      preventDuplicates: true,
      enableHtml: true,
      toastClass: 'ngx-toastr toast-modern'
    }),
  ]
};

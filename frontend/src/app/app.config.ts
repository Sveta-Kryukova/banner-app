import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { DialogModule } from "@angular/cdk/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { httpErrorInterceptor } from "./core/http/http-error.interceptor";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    provideRouter(routes),
    importProvidersFrom(DialogModule, MatSnackBarModule),
  ],
};

import { HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { parseHttpErrorMessage } from "./http-error-parse";

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: unknown) => {
      const message = parseHttpErrorMessage(error);
      const label = `${req.method} ${req.url}`;

      if (!environment.production) {
        console.error("[HTTP]", label, message, error);
      }

      return throwError(() => error);
    }),
  );

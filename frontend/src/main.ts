import { bootstrapApplication } from "@angular/platform-browser";
import { from } from "rxjs";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";

from(bootstrapApplication(AppComponent, appConfig)).subscribe({
  error: (err: unknown) => console.error(err),
});

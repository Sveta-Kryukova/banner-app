import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AppFooterComponent } from "./layout/app-footer/app-footer.component";
import { AppHeaderComponent } from "./layout/app-header/app-header.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, AppHeaderComponent, AppFooterComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {}

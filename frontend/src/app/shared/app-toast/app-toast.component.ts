import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";
import type { AppToastData } from "./app-toast.types";

@Component({
  selector: "app-toast",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  templateUrl: "./app-toast.component.html",
  styleUrl: "./app-toast.component.scss",
})
export class AppToastComponent {
  readonly data = inject<AppToastData>(MAT_SNACK_BAR_DATA);

  @HostBinding("attr.role")
  get ariaRole(): "alert" | "status" {
    return this.data.variant === "error" ? "alert" : "status";
  }

  @HostBinding("attr.aria-live")
  get ariaLive(): "assertive" | "polite" {
    return this.data.variant === "error" ? "assertive" : "polite";
  }
}

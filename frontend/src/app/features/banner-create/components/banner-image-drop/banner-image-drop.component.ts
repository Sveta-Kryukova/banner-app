import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  NgZone,
  output,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { NgxFileDropEntry, NgxFileDropModule } from "ngx-file-drop";
import { AppButtonComponent } from "../../../../shared/ui-button/app-button.component";
import { AppIconButtonComponent } from "../../../../shared/ui-icon-button/app-icon-button.component";

/**
 * Image picker UI (ngx-file-drop + preview). Emits `File` or clear — validation lives in {@link BannerImageFileService} / facade.
 */
@Component({
  selector: "app-banner-image-drop",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgxFileDropModule,
    MatIconModule,
    AppButtonComponent,
    AppIconButtonComponent,
  ],
  templateUrl: "./banner-image-drop.component.html",
  styleUrl: "./banner-image-drop.component.scss",
})
export class BannerImageDropComponent {
  private readonly ngZone = inject(NgZone);

  readonly previewUrl = input.required<string | null>();
  readonly fileName = input<string | null>(null);
  readonly labelledBy = input.required<string>();

  readonly fileSelected = output<File>();
  readonly clearRequested = output<void>();

  onFilesDropped(files: NgxFileDropEntry[]): void {
    const entry = files[0];
    if (!entry?.fileEntry.isFile) {
      return;
    }
    const fileEntry = entry.fileEntry as FileSystemFileEntry;
    fileEntry.file((file) => {
      this.ngZone.run(() => this.fileSelected.emit(file));
    });
  }

  clear(): void {
    this.clearRequested.emit();
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  NgZone,
  output,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { NgxFileDropEntry, NgxFileDropModule } from "ngx-file-drop";
import { AppButtonComponent } from "../../../../shared/ui-button/app-button.component";
import { LoadingSpinnerComponent } from "../../../../shared/loading-spinner/loading-spinner.component";

@Component({
  selector: "app-banner-image-drop",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgxFileDropModule,
    MatButtonModule,
    MatIconModule,
    AppButtonComponent,
    LoadingSpinnerComponent,
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

  /** False until the preview image fires `load` or `error` (stable layout while remote URL loads). */
  protected readonly previewImageReady = signal(false);

  constructor() {
    effect(() => {
      this.previewUrl();
      this.previewImageReady.set(false);
    });
  }

  protected onPreviewImageLoad(): void {
    this.previewImageReady.set(true);
  }

  protected onPreviewImageError(): void {
    this.previewImageReady.set(true);
  }

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

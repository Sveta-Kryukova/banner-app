import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-banner-create-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './banner-create-page.component.html',
  styleUrl: './banner-create-page.component.scss',
})
export class BannerCreatePageComponent {}

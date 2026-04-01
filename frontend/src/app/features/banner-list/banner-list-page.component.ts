import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-banner-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './banner-list-page.component.html',
  styleUrl: './banner-list-page.component.scss',
})
export class BannerListPageComponent {}

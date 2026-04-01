import { Component } from '@angular/core';
import { ItemListComponent } from './components/item-list/item-list.component';

@Component({
  selector: 'app-item-list-page',
  standalone: true,
  imports: [ItemListComponent],
  templateUrl: './item-list-page.component.html',
  styleUrl: './item-list-page.component.scss',
})
export class ItemListPageComponent {}

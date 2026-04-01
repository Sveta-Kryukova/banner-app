import { Component } from '@angular/core';
import { ItemFormComponent } from './components/item-form/item-form.component';

@Component({
  selector: 'app-item-form-page',
  standalone: true,
  imports: [ItemFormComponent],
  templateUrl: './item-form-page.component.html',
  styleUrl: './item-form-page.component.scss',
})
export class ItemFormPageComponent {}

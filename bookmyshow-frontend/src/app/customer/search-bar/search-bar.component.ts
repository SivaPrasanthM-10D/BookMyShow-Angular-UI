import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Input() searchQuery: string = '';

  @Output() search = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  onSearch(): void {
    this.search.emit(this.searchQuery);
  }

  onClose(): void {
    this.close.emit();
  }
}

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-sidebar',
  templateUrl: './help-sidebar.component.html',
  styleUrl: './help-sidebar.component.css'
})
export class HelpSidebarComponent {
  selectedSection: string | null = null;

  constructor(
    private router: Router,

  ) {}
  dropdownVisible: boolean = false;
  searchQuery = '';
  collections = [
    { name: 'Introduction ChatCount', id: 'introduction' },
    { name: 'Chat', id: 'chat' },
    { name: 'Documents', id: 'documents' },
    { name: 'Paramétrages', id: 'settings' },
    { name: 'Mon profil', id: 'profil' }
  ];
  filteredCollections = this.collections;

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownVisible = !this.dropdownVisible;

  }

  showSection(section: string) {
    this.selectedSection = section;
  }
  seeAll(section: string) {
    this.router.navigate(['/pages/article', section]).then(() => {
      console.log("section",section);
      location.reload();
    });  }
    returnAll() {
      this.router.navigate(['/pages/chat/:id']).then(() => {
        location.reload();
      });  }
      filterCollections(): void {
        this.filteredCollections = this.collections.filter(collection => 
          collection.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
}
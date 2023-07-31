import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-actor',
  templateUrl: './actor.component.html',
})
export class ActorComponent implements OnInit {
  actors: any;
  dataAktor: any[] = [];
  displayedActors: any[] = [];
  pageSize = 20;
  currentPage = 1;
  totalPages = 0;
  searchQuery = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getAllActors();
  }
  getAllActors() {
    this.apiService.getAllActor().subscribe(
      (data) => {
        this.actors = data;
        this.dataAktor = this.actors?.data || [];
        this.calculateTotalPages();
        this.updateDisplayedActors();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.dataAktor.length / this.pageSize);
  }

  updateDisplayedActors() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.dataAktor.length);
    this.displayedActors = this.dataAktor.slice(startIndex, endIndex);
  }
  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }
  getEndIndex(): number {
    const endIndex = this.currentPage * this.pageSize;
    return Math.min(endIndex, this.dataAktor.length);
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedActors();
    }
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedActors();
    }
  }
onSearch() {
  this.currentPage = 1; 
  if (this.searchQuery.trim() === '') {
    this.updateDisplayedActors();
  } else {
    this.displayedActors = this.dataAktor.filter((actor) =>
      actor.first_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      actor.last_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.calculateTotalPages();
  }
}
  addActor(firstName: string, lastName: string) {
    const newActor = {
      first_name: firstName,
      last_name: lastName,
    };

    this.apiService.insertActor(newActor).subscribe(
      (response) => {
        this.getAllActors();
        this.closeModal(); 
      },
      (error) => {
        console.error('Error adding actor:', error);
      }
    );
  }

    onAddActorFormSubmit(event: Event) {
    event.preventDefault();
    const firstNameInput = document.getElementById('firstName') as HTMLInputElement;
    const lastNameInput = document.getElementById('lastName') as HTMLInputElement;

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();

    if (firstName === '' || lastName === '') {
      console.error('First name and last name are required');
      return;
    }
    this.addActor(firstName, lastName);

    firstNameInput.value = '';
    lastNameInput.value = '';
  }

    closeModal() {
    // Close the modal using the reference
    const modal: HTMLElement | null = document.querySelector('#createProductModal');
    if (modal) {
      modal.classList.remove('flex');
      modal.classList.add('hidden');
    }
  }


actorToDeleteId: number | null = null;

// Method to open the delete modal and set the actor ID to be deleted
openDeleteModal(actorId: number) {
  this.actorToDeleteId = actorId;
  const modal: HTMLElement | null = document.querySelector('#deleteModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

// Method to confirm the deletion and call the deleteActor method
confirmDelete() {
  if (this.actorToDeleteId) {
    this.deleteActor(this.actorToDeleteId);
    this.actorToDeleteId = null; // Reset the actorToDeleteId after deletion
  }
  // Close the modal after confirmation (optional)
  const modal: HTMLElement | null = document.querySelector('#deleteModal');
  if (modal) {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }
}

// Method to delete an actor using the API
deleteActor(actorId: number) {
  this.apiService.deleteActor(actorId).subscribe(
    (response) => {
      this.getAllActors(); // Fetch actors again after successful deletion
    },
    (error) => {
      console.error('Error deleting actor:', error);
    }
  );
}

}

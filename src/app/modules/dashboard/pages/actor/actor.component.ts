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

 actorToUpdateId: number = 0;
  updateActor: { firstName: string; lastName: string } = { firstName: '', lastName: '' };

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
    const modal: HTMLElement | null = document.querySelector('#createProductModal');
    if (modal) {
      modal.classList.remove('flex');
      modal.classList.add('hidden');
    }
  }
actorToDeleteId: number | null = null;

openDeleteModal(actorId: number) {
  this.actorToDeleteId = actorId;
  const modal: HTMLElement | null = document.querySelector('#deleteModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

confirmDelete() {
  if (this.actorToDeleteId) {
    this.deleteActor(this.actorToDeleteId);
    this.actorToDeleteId = null; 
  }
  const modal: HTMLElement | null = document.querySelector('#deleteModal');
  if (modal) {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }
}
deleteActor(actorId: number) {
  this.apiService.deleteActor(actorId).subscribe(
    (response) => {
      this.getAllActors(); 
    },
    (error) => {
      console.error('Error deleting actor:', error);
    }
  );
}

  onUpdateActorFormSubmit(event: Event) {
    event.preventDefault();
    const firstNameInput = document.getElementById('name') as HTMLInputElement;
    const lastNameInput = document.getElementById('brand') as HTMLInputElement;

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();

    if (firstName === '' || lastName === '') {
      console.error('First name and last name are required');
      return;
    }

    if (this.actorToUpdateId !== 0) { // Ensure actorToUpdateId is not null
      this.updateActorData({ actor_id: this.actorToUpdateId, first_name: firstName, last_name: lastName });
      this.actorToUpdateId = 0; // Reset to a default value after successful update or when not needed
    }

    this.closeUpdateModal();
  }

  openUpdateModal(actorId: number) {
    this.actorToUpdateId = actorId; // Set the actorToUpdateId to the selected actor ID
    const modal: HTMLElement | null = document.querySelector('#updateActorModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    // Populate the updateActor object with the current values of the actor being edited
    const actor = this.dataAktor.find((actor) => actor.id === actorId);
    if (actor) {
      this.updateActor.firstName = actor.first_name;
      this.updateActor.lastName = actor.last_name;
    }
  }

  updateActorData(actor: any) {
    // Assuming you have a function in your ApiService to update the actor data, for example, updateActor(actorId: number, updatedActorData: any)
    this.apiService.updateActor(this.actorToUpdateId, actor).subscribe(
      (response) => {
        this.getAllActors();
        this.closeUpdateModal(); // Close the update modal after successful update
      },
      (error) => {
        console.error('Error updating actor:', error);
      }
    );
  }


  closeUpdateModal() {
    const modal: HTMLElement | null = document.querySelector('#updateProductModal');
    if (modal) {
      modal.classList.remove('flex');
      modal.classList.add('hidden');
    }
  }

    getActorById(id: number) {
    this.apiService.getActorById(id).subscribe(
      (data) => {
        // Process the data for the specific actor ID
        console.log('Actor with ID', id, 'received:', data);
      },
      (error) => {
        console.error('Error fetching actor with ID', id, ':', error);
      }
    );
  }

  // New method to fetch data for all actors one by one
  fetchAllActorsData() {
    this.apiService.getAllActor().subscribe(
      (data) => {
        this.actors = data;
        this.dataAktor = this.actors?.data || [];

        // Loop through each actor ID and fetch data for that ID
        this.dataAktor.forEach((actor: any) => {
          this.getActorById(actor.id);
        });
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

}

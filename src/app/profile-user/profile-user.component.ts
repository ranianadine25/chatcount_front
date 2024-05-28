import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertHandlerService } from '../SharedModule/alert_handler.service';
import { AuthService } from '../authetification/auth.service';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../authetification/login/model_user';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { environment } from '../environment/environment.prod';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.css'
})
export class ProfileUserComponent {
  public currentUser: User | null = null;
  currentPassword: string = '';
  isAvatarVisible: boolean = false;
  public file:any;
  imgPrefix = environment.apiUrl + '/avatars/';
  avatarForm: FormGroup;
  invitationLink: string  = "";
  invitedUsers!: any[];

  constructor(
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
    private alertServ: AlertHandlerService,
    private authService: AuthService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
 ) { this.avatarForm = this.fb.group({
  avatar: [null]
});}
 ngOnInit() {
  console.log("marhabaaaaa");
  if (isPlatformBrowser(this.platformId)) {
    this.authService.retrieveCurrentUserFromLocalStorage();
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log("usercoming",this.currentUser?.userInfo._id);

    });
  } else {
  }
  this.getInvitedUsers();
  console.log("invitedddddddddd",this.invitedUsers);
 }  
  generateInvitationLink(email: string) {
  this.authService.generateInvitationLink(email, this.currentUser?.userInfo._id!).subscribe(
    (response: any) => {
      this.invitationLink = response.invitationLink;
      alert('Invitation sent successfully!');
    },
    (error) => {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation.');
    }
  );
}

copyInvitationLink() {
  if (this.invitationLink) {
    const textArea = document.createElement('textarea');
    textArea.value = this.invitationLink;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      alert('Invitation link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy', err);
      alert('Failed to copy the invitation link.');
    }
    document.body.removeChild(textArea);
  } else {
    alert('Generate the invitation link first.');
  }
}
getInvitedUsers() {
  this.authService.getInvitedUsers(this.currentUser?.userInfo._id!).subscribe(
    (response: any[]) => {
      this.invitedUsers = response;
    },
    (error) => {
      console.error('Error fetching invited users:', error);
    }
  );
}
 togglePasswordVisibility(fieldId: string) {
  const field = document.getElementById(fieldId);
  if (field && field.getAttribute('type') === 'password') {
    field.setAttribute('type', 'text');
  } else if (field) {
    field.setAttribute('type', 'password');
  }
}
onFileSelected(event: any) {
  if (event.target.files[0].size > 5242880) {
    return;
  }

  const formData = new FormData();
  formData.append('avatar', event.target.files[0]);
  formData.append('name', this.currentUser?.userInfo.name!); 
  formData.append('email', this.currentUser!.userInfo.email);
  formData.append('password', this.currentUser!.userInfo.password);
  formData.append('phone', this.currentUser!.userInfo.phone);
  formData.append('address', this.currentUser!.userInfo.address);


  this.file = formData;
}
onUpdateProfile(profileForm: NgForm): void {
  if (profileForm.invalid) {
    return;
  }

  console.log('Valeurs du formulaire:', this.currentUser);

  const formData = new FormData();
  formData.append('name', this.currentUser!.userInfo.name);
  formData.append('email', this.currentUser!.userInfo.email);
  formData.append('phone', this.currentUser!.userInfo.phone);
  formData.append('address', this.currentUser!.userInfo.address);
  formData.append('role', this.currentUser!.userInfo.role);
  formData.append('speciality', this.currentUser!.userInfo.speciality);

  if (this.file) {
    formData.append('avatar', this.file);
  }

  this.authService.updateProfile(formData, this.currentUser?.userInfo._id!)
    .subscribe(
      (response) => {
        console.log("Profil utilisateur mis à jour avec succès :", response);
        this._snackBar.open('Profil utilisateur mis à jour avec succès!', 'Fermer', {
          panelClass: ['redNoMatch'],
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      },
      (error) => {
        console.error("Erreur lors de la mise à jour du profil utilisateur :", error);
        this._snackBar.open('Erreur lors de la mise à jour du profil utilisateur', 'Fermer', {
          panelClass: ['redNoMatch'],
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    );
}

toggleAvatarVisibility() {
  // Logique pour afficher/masquer l'avatar
}



onAvatarSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    this.avatarForm.patchValue({ avatar: file });
    this.avatarForm.get('avatar')?.updateValueAndValidity();
  }
}

onSubmit() {
  const formData = new FormData();
  formData.append('avatar', this.avatarForm.get('avatar')?.value);

  const currentUser = this.currentUser?.userInfo._id;
  if (currentUser) {
    this.authService.updateAvatar(formData, currentUser).subscribe(
      response => {
        console.log('Avatar mis à jour avec succès', response);
        // Mettez à jour l'utilisateur localement si nécessaire
        this.authService.setUser(response.user);
      },
      error => {
        console.error('Erreur lors de la mise à jour de l\'avatar', error);
      }
    );
  }
}

}

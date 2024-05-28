import { Component, OnInit, ViewEncapsulation, Renderer2,ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { AlertHandlerService } from '../../SharedModule/alert_handler.service';
import { register } from 'module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
   public loginForm: FormGroup;
  registerForm: FormGroup;
  isPopupOpen = false;

  loading = false;
  submitted = false;
  error = '';
  signInMode = true;
  public file:any;

  token!: string;
  role!: string;
  userId!: string;


  constructor(

    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private router: Router,
    private _snackBar: MatSnackBar,
    private alertServ: AlertHandlerService,
    private route: ActivatedRoute

  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
   
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      avatar: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.authService.verifyInvitationToken(this.token).subscribe(
        (response: any) => {
          this.registerForm.patchValue({ email: response.email });
          this.userId = response.inviterId;
          this.role = response.role;
        },
        (error) => {
          console.error('Invalid or expired token', error);
          this.router.navigate(['/']); // Rediriger vers la page d'accueil ou une page d'erreur
        }
      );
    });
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      avatar: ['']
    });

    // Attendre que la vue soit initialisée avant la manipulation du DOM
    setTimeout(() => {
      const container = this.elementRef.nativeElement.querySelector('#container');
      const registerBtn = this.elementRef.nativeElement.querySelector('#register');
      const loginBtn = this.elementRef.nativeElement.querySelector('#login');

      if (container && registerBtn && loginBtn) {
        registerBtn.addEventListener('click', () => {
          this.toggleSignInMode(false); 

          this.renderer.addClass(container, 'active');
        });

        loginBtn.addEventListener('click', () => {
          this.toggleSignInMode(true); 

          this.renderer.removeClass(container, 'active');
        });
      } else {
        console.error('Un des éléments est nul.');
      }
    }, 0);
  }

  // Méthode pour basculer entre l'inscription et la connexion
  toggleSignInMode(mode: boolean): void {
    this.signInMode = mode;
    this.error = '';
    if (mode) {
      this.loginForm.reset();
    } else {
      this.registerForm.reset();
    }
  }


  // Getter pour accéder facilement aux champs du formulaire
  get lf() {
    return this.loginForm.controls;
  }
  get rf() {
    return this.registerForm.controls;
  }


  // Méthode pour soumettre le formulaire
  onSignIn(): void {
    console.log('Email:', this.loginForm.value.email);
    console.log('Password:', this.loginForm.value.password);
    this.submitted = true;
    this.error = '';
    if (this.loginForm.invalid) {
      return;
    }
  
    this.loading = true;
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
      (response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/pages/chat/:id']);
          // Affichez une notification de succès si la connexion réussit
          this.toastr.success('Connexion réussie !', 'Succès');
        } else {
          this.error = 'Email ou mot de passe incorrect';
        }
        this.loading = false;
      },
      (error: HttpErrorResponse) => {
        console.error("File upload error:", error);
        if (error.status === 300) {
          this._snackBar.open('Inscription réussie ! Vous pouvez maintenant vous connecter.', 'Fermer', {
            duration: 5000, 
          });
          console.log("Fichier déjà existant:", error.error.message);
          this.isPopupOpen = true;
        } else {
          this.loading = false;
          if (error.error && error.error.message) {
            this.alertServ.alertHandler(error.error.message, "error");
            this._snackBar.open('Une erreur inconnue s"est produite.', 'Fermer', {
              duration: 5000, 
            });
          } else    if (error.status === 404){
            this.alertServ.alertHandler("Une erreur inconnue s'est produite.", "error");
            this._snackBar.open('Email ou mot de passe incorrect.', 'Fermer', {
              duration: 5000, 
            });
          }
        }
      }
    );
    }  
    closemodal(){
      var modal=document.getElementById("modal1");
      modal!.style.display = "none";
    } 
    confirmAction(){
      this.isPopupOpen = false;
    }
    onFileSelected(event: any) {
      if (event.target.files[0].size > 5242880) {
        // Handle file size limit
        return;
      }
    
      const formData = new FormData();
      formData.append('avatar', event.target.files[0]);
      formData.append('name', this.registerForm.value.name); // Add other fields
      formData.append('email', this.registerForm.value.email);
      formData.append('password', this.registerForm.value.password);
      formData.append('token', this.token);
      formData.append('role', this.role);
      formData.append('inviterId', this.userId);
      // Add other fields as needed
      this.file = formData;
    }
    onRegister(): void {
      this.submitted = true;
      if (this.registerForm.invalid) {
        return;
      }
  
      this.loading = true;

      const { name, email, password, avatar } = this.registerForm.value;
      
    
      this.authService
        .signUp(this.file) // Include avatar in the request
        .subscribe(
          (response: any) => {
            if (response.statusCode === 201) {
              this._snackBar.open('Inscription réussie ! Vous pouvez maintenant vous connecter.', 'Fermer', {
                duration: 5000, 
              });
              localStorage.setItem('token', response.token);
              this.toastr.success('Vous avez créé votre compte avec succès. Vous pouvez maintenant passer à la connexion.', 'Inscription réussie');
              this.isPopupOpen = true;

              this.loading = false;
              this.router.navigate(['/auth/login']);
              location.reload();
            } else if (response.statusCode === 403) {
              console.log('L\'utilisateur existe déjà !');
              this.toastr.error('L\'utilisateur existe déjà !');
            } else {
              this.loading = false;
            }
          },
          (error: HttpErrorResponse) => {
            console.error("File upload error:", error);
            if (error.status === 300) {
              this._snackBar.open('Inscription réussie ! Vous pouvez maintenant vous connecter.', 'Fermer', {
                duration: 5000, 
              });
              console.log("Fichier déjà existant:", error.error.message);
              this.isPopupOpen = true;
            } else {
              // Handle other error cases
              if (error.error && error.error.message) {
                this.alertServ.alertHandler(error.error.message, "error");
                this._snackBar.open('Une erreur inconnue s"est produite.', 'Fermer', {
                  duration: 5000, 
                });
              } else {
                this.alertServ.alertHandler("Une erreur inconnue s'est produite.", "error");
                this._snackBar.open('Une erreur inconnue s"est produite .', 'Fermer', {
                  duration: 5000, 
                });
              }
            }
          }
      );
  }
}  
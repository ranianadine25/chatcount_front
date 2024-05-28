import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../authetification/auth.service';

@Component({
  selector: 'app-verify-invitation',
  templateUrl: './verify-invitation.component.html',
  styleUrl: './verify-invitation.component.css'
})
export class VerifyInvitationComponent {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.authService.verifyInvitationToken(token).subscribe(
          (response: any) => {
            console.log(response);
            this.router.navigate(['/auth/login'], { queryParams: { email: response.email, inviterId: response.inviterId } });
          },
          (error) => {
            console.error('Error verifying invitation:', error);
            // Afficher un message d'erreur ou rediriger vers une autre page
          }
        );
      } else {
        console.error('No token found in URL');
        // Afficher un message d'erreur ou rediriger vers une autre page
      }
    });
  }
}
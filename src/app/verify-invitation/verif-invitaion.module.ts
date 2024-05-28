import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyInvitationComponent } from './verify-invitation.component';

const routes: Routes = [
  { path: '', component: VerifyInvitationComponent },
  // Ajoutez d'autres routes ici
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class VerifInvitationModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { SharedModule } from '../../SharedModule/shared.module';

import { MatSnackBarModule } from '@angular/material/snack-bar';


// routing
const approutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { animation: 'auth' }
  },
  
 

];


@NgModule({
  declarations: [LoginComponent],
  imports: [SharedModule,RouterModule.forChild(approutes),
    MatSnackBarModule]
})
export class AuthenticationModule {}
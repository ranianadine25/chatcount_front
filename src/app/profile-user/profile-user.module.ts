import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileUserComponent } from './profile-user.component';
import { SharedModule } from '../SharedModule/shared.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';


// routing
const approutes: Routes = [
  {
    path: '',
    component: ProfileUserComponent,
    data: { animation: 'profile' }
  },
  
 

];


@NgModule({
  declarations: [ProfileUserComponent],
  imports: [SharedModule,RouterModule.forChild(approutes),
    MatSnackBarModule],
    providers: [ provideAnimations(),
      provideToastr(),
      
    ],
})
export class ProfileModule {}
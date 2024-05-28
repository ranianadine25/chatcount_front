import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../SharedModule/shared.module';
import { KnowledgeComponent } from './knowledge.component';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { knowledgeService } from './knowledge.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: KnowledgeComponent,
    data: { animation: 'knowledge/:id' }
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    MatSnackBarModule, NgbModule
  ],
  declarations: [KnowledgeComponent],
  providers: [knowledgeService, provideAnimations(),
  provideToastr(),
  
],
})
export class KnowledgeManagementModule { }

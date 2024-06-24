import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../SharedModule/shared.module";
import { NgModule } from "@angular/core";
import { provideToastr } from "ngx-toastr";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ArticleCompletComponentArticleCompletComponent } from "./article-complet.component";

const routes: Routes = [
    {
      path: '',
      component: ArticleCompletComponentArticleCompletComponent,
      data: { animation: '' }
    }
  ];
  
  @NgModule({
    imports: [
      SharedModule,
      RouterModule.forChild(routes),
     
    ],
    declarations: [ArticleCompletComponentArticleCompletComponent],
    providers: [ provideAnimations(),
      provideToastr(),
      
    ],
  })
  export class ArticleManagementModule { }
  
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-article-complet',
  templateUrl: './article-complet.component.html',
  styleUrl: './article-complet.component.css'
})
export class ArticleCompletComponentArticleCompletComponent implements OnInit {
  section: string | null = null;

  constructor(private route: ActivatedRoute,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.section = this.route.snapshot.paramMap.get('section');
  }
  returnAll() {
    this.router.navigate(['/pages/chat/:id']).then(() => {
      location.reload();
    });  }
}
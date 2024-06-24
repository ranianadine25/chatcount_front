import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCompletComponent } from './article-complet.component';

describe('ArticleCompletComponent', () => {
  let component: ArticleCompletComponent;
  let fixture: ComponentFixture<ArticleCompletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleCompletComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleCompletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

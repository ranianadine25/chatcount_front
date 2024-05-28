import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDivComponent } from './chat-div.component';

describe('ChatDivComponent', () => {
  let component: ChatDivComponent;
  let fixture: ComponentFixture<ChatDivComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatDivComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

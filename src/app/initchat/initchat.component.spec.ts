import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitchatComponent } from './initchat.component';

describe('InitchatComponent', () => {
  let component: InitchatComponent;
  let fixture: ComponentFixture<InitchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InitchatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InitchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

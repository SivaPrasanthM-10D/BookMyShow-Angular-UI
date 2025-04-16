import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheatreOwnerComponent } from './theatre-owner.component';

describe('TheatreOwnerComponent', () => {
  let component: TheatreOwnerComponent;
  let fixture: ComponentFixture<TheatreOwnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TheatreOwnerComponent]
    });
    fixture = TestBed.createComponent(TheatreOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

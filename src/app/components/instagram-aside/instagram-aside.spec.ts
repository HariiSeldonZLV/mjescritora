import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramAsideComponent } from './instagram-aside.component';

describe('InstagramAsideComponent', () => {
  let component: InstagramAsideComponent;
  let fixture: ComponentFixture<InstagramAsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstagramAsideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstagramAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

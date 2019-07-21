import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesAutoCompleteComponent } from './categories-auto-complete.component';

describe('CategoriesAutoCompleteComponent', () => {
  let component: CategoriesAutoCompleteComponent;
  let fixture: ComponentFixture<CategoriesAutoCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesAutoCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

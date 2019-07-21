import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoriesAutocompleteComponent } from './sub-categories-autocomplete.component';

describe('SubCategoriesAutocompleteComponent', () => {
  let component: SubCategoriesAutocompleteComponent;
  let fixture: ComponentFixture<SubCategoriesAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubCategoriesAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoriesAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

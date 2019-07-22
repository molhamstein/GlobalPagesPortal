import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessSubCategoriesAutocompleteComponent } from './business-sub-categories-autocomplete.component';

describe('BusinessSubCategoriesAutocompleteComponent', () => {
  let component: BusinessSubCategoriesAutocompleteComponent;
  let fixture: ComponentFixture<BusinessSubCategoriesAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessSubCategoriesAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessSubCategoriesAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

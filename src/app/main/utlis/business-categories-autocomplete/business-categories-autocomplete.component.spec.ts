import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCategoriesAutocompleteComponent } from './business-categories-autocomplete.component';

describe('BusinessCategoriesAutocompleteComponent', () => {
  let component: BusinessCategoriesAutocompleteComponent;
  let fixture: ComponentFixture<BusinessCategoriesAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessCategoriesAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessCategoriesAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

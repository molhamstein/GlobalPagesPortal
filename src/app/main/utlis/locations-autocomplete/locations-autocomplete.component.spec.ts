import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationsAutocompleteComponent } from './locations-autocomplete.component';

describe('LocationsAutocompleteComponent', () => {
  let component: LocationsAutocompleteComponent;
  let fixture: ComponentFixture<LocationsAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationsAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

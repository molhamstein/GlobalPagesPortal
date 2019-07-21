import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnersAutocompleteComponent } from './owners-autocomplete.component';

describe('OwnersAutocompleteComponent', () => {
  let component: OwnersAutocompleteComponent;
  let fixture: ComponentFixture<OwnersAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnersAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnersAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

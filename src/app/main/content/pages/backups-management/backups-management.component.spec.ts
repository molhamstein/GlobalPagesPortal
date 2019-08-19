import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupsManagementComponent } from './backups-management.component';

describe('BackupsManagementComponent', () => {
  let component: BackupsManagementComponent;
  let fixture: ComponentFixture<BackupsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackupsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

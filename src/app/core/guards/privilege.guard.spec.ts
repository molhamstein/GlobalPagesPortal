import { TestBed, async, inject } from '@angular/core/testing';

import { PrivilegeGuard } from './privilege.guard';

describe('PrivilegeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrivilegeGuard]
    });
  });

  it('should ...', inject([PrivilegeGuard], (guard: PrivilegeGuard) => {
    expect(guard).toBeTruthy();
  }));
});

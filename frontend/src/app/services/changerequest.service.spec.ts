import { TestBed } from '@angular/core/testing';

import { ChangeRequestService } from './changerequest.service';

describe('ChangeRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChangeRequestService = TestBed.get(ChangeRequestService);
    expect(service).toBeTruthy();
  });
});

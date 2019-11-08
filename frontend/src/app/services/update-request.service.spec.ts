import { TestBed } from '@angular/core/testing';

import { UpdateRequestService } from './update-request.service';

describe('UpdateRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateRequestService = TestBed.get(UpdateRequestService);
    expect(service).toBeTruthy();
  });
});

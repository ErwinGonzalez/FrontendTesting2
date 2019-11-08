import { TestBed } from '@angular/core/testing';

import { UpdateResponseService } from './update-response.service';

describe('UpdateResponseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateResponseService = TestBed.get(UpdateResponseService);
    expect(service).toBeTruthy();
  });
});

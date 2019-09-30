import { TestBed } from '@angular/core/testing';

import { SearchRequestService } from './searchrequest.service';

describe('SearchRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchRequestService = TestBed.get(SearchRequestService);
    expect(service).toBeTruthy();
  });
});

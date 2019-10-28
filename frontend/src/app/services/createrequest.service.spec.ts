import { TestBed } from '@angular/core/testing';

import { CreaterequestService } from './createrequest.service';

describe('CreaterequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreaterequestService = TestBed.get(CreaterequestService);
    expect(service).toBeTruthy();
  });
});

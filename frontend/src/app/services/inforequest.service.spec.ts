import { TestBed } from '@angular/core/testing';

import { InforequestService } from './inforequest.service';

describe('InforequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InforequestService = TestBed.get(InforequestService);
    expect(service).toBeTruthy();
  });
});

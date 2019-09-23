import { TestBed } from '@angular/core/testing';

import { InfoResponseService } from './inforesponse.service';

describe('InforesponseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InfoResponseService = TestBed.get(InfoResponseService);
    expect(service).toBeTruthy();
  });
});

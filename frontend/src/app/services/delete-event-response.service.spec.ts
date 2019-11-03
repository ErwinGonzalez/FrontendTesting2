import { TestBed } from '@angular/core/testing';

import { DeleteEventResponseService } from './delete-event-response.service';

describe('DeleteEventResponseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeleteEventResponseService = TestBed.get(DeleteEventResponseService);
    expect(service).toBeTruthy();
  });
});

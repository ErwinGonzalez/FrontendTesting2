import { TestBed } from '@angular/core/testing';

import { DeleteEventRequestService } from './delete-event-request.service';

describe('DeleteEventRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeleteEventRequestService = TestBed.get(DeleteEventRequestService);
    expect(service).toBeTruthy();
  });
});

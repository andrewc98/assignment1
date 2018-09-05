import { TestBed, inject } from '@angular/core/testing';

import { DashInterfaceService } from './dash-interface.service';

describe('DashInterfaceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashInterfaceService]
    });
  });

  it('should be created', inject([DashInterfaceService], (service: DashInterfaceService) => {
    expect(service).toBeTruthy();
  }));
});

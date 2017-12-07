import { TestBed, inject } from '@angular/core/testing';

import { ReloadResolveService } from './reload-resolve.service';

describe('ReloadResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReloadResolveService]
    });
  });

  it('should be created', inject([ReloadResolveService], (service: ReloadResolveService) => {
    expect(service).toBeTruthy();
  }));
});

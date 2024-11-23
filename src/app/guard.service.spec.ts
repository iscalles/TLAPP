import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GuardService } from './guard.service';

describe('GuardService', () => {
  let service: GuardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GuardService]
    });

    service = TestBed.inject(GuardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockResponse = {
      token: 'fake-jwt-token',
      userId: 1,
      role: 'user'
    };

    service.login('testuser', 'testpassword').subscribe(response => {
      expect(response.token).toBe(mockResponse.token);
      expect(response.userId).toBe(mockResponse.userId);
      expect(response.role).toBe(mockResponse.role);
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.getUserId()).toBe(mockResponse.userId);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle login error', () => {
    const mockError = { status: 401, statusText: 'Unauthorized' };

    service.login('testuser', 'wrongpassword').subscribe(
      () => fail('should have failed with 401 error'),
      error => {
        expect(error.status).toBe(401);
      }
    );

    const req = httpMock.expectOne(`${service.apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(null, mockError);
  });

  afterEach(() => {
    httpMock.verify();
  });
});

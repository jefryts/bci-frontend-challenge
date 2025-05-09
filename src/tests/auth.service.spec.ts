import { TestBed } from '@angular/core/testing';
import { AuthService } from '../app/core/services/auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow login with an existing user', () => {
    service.register('test@example.com');
    expect(service.userExists('test@example.com')).toBeTrue();
  });

  it('should disallow login with an existing user', () => {
    expect(service.userExists('new@example.com')).toBeFalse();
  });
});

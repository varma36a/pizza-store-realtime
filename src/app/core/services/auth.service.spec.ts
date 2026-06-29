import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }],
    });
    service = TestBed.inject(AuthService);
    service.logout();
  });

  it('should login with valid credentials', (done) => {
    service.login({ email: 'customer@pizza.com', password: 'password123' }).subscribe({
      next: (res) => {
        expect(res.user.role).toBe('customer');
        expect(service.isAuthenticated()).toBeTrue();
        done();
      },
    });
  });

  it('should reject invalid credentials', (done) => {
    service.login({ email: 'wrong@test.com', password: 'bad' }).subscribe({
      error: (err) => {
        expect(err.message).toContain('Invalid');
        done();
      },
    });
  });
});

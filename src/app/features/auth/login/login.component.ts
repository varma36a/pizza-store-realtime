import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-wrapper">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Sign In</mat-card-title>
          <mat-card-subtitle>Pizza Store Demo Accounts</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" />
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading()">
              Login
            </button>
          </form>

          <div class="demo-accounts">
            <p><strong>Demo accounts</strong> (password: password123)</p>
            <button mat-stroked-button type="button" (click)="fillDemo('customer@pizza.com')">
              Customer
            </button>
            <button mat-stroked-button type="button" (click)="fillDemo('admin@pizza.com')">
              Admin
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .login-wrapper {
      display: grid;
      place-items: center;
      min-height: 60vh;
    }
    .login-card {
      width: 100%;
      max-width: 420px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .demo-accounts {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.875rem;
    }
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  fillDemo(email: string): void {
    this.form.patchValue({ email, password: 'password123' });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    try {
      this.auth.login(this.form.getRawValue()).subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err: Error) => {
          this.snackBar.open(err.message, 'OK', { duration: 3000 });
          this.loading.set(false);
        },
        complete: () => this.loading.set(false),
      });
    } catch (err) {
      this.snackBar.open((err as Error).message, 'OK', { duration: 3000 });
      this.loading.set(false);
    }
  }
}

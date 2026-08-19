import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div class="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 class="mb-2 text-2xl font-bold text-gray-900">
          Login
        </h1>

        <p class="mb-6 text-sm text-gray-500">
          Sign in to your TMS account
        </p>

        <form (ngSubmit)="login()" class="space-y-5">
          <div>
            <label
              for="username"
              class="mb-1 block text-sm font-medium text-gray-700"
            >
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              [(ngModel)]="username"
              required
              class="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              for="password"
              class="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              [(ngModel)]="password"
              required
              class="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          @if (errorMessage()) {
            <div class="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {{ errorMessage() }}
            </div>
          }

          <button
            type="submit"
            [disabled]="loading() || !username || !password"
            class="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ loading() ? 'Signing in...' : 'Login' }}
          </button>
        </form>

        <div class="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          <p class="font-medium text-gray-700">Demo account</p>
          <p>Username: admin</p>
          <p>Password: Password123!</p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';

  loading = signal(false);
  errorMessage = signal('');

  async login(): Promise<void> {
    if (!this.username || !this.password) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.login({
        username: this.username,
        password: this.password,
      });

      await this.router.navigate(['/dashboard']);
    } catch {
      this.errorMessage.set('Invalid username or password.');
    } finally {
      this.loading.set(false);
    }
  }
}
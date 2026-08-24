import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CourseStore } from '../../store/course.store';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">

      <!-- Navigation -->
      <header class="border-b border-gray-200 bg-white">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <a
            routerLink="/"
            class="text-2xl font-bold text-gray-900"
          >
            TMS
          </a>

<nav class="flex items-center gap-4">
  <a
    routerLink="/"
    class="text-sm font-medium text-gray-700 hover:text-blue-600"
  >
    Courses
  </a>

  @if (authService.currentUser(); as user) {

    @if (user.role === 'Student') {
      <a
        routerLink="/dashboard"
        class="text-sm font-medium text-gray-700 hover:text-blue-600"
      >
        Dashboard
      </a>
    }

    @if (user.role === 'Instructor') {
      <a
        routerLink="/instructor"
        class="text-sm font-medium text-gray-700 hover:text-blue-600"
      >
        Instructor
      </a>
    }

    @if (user.role === 'Admin') {
      <a
        routerLink="/admin/courses"
        class="text-sm font-medium text-gray-700 hover:text-blue-600"
      >
        Admin
      </a>
    }

    <button
      type="button"
      (click)="logout()"
      class="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
    >
      Logout
    </button>

  } @else {

    <a
      routerLink="/login"
      class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      Login
    </a>

  }
</nav>

        </div>
      </header>


      <!-- Hero -->
      <section class="bg-white">
        <div class="mx-auto max-w-7xl px-6 py-16">

          <div class="max-w-3xl">

            <p class="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
              Training Management System
            </p>

            <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Learn, enroll, and manage your academic journey.
            </h1>

            <p class="mt-5 text-lg leading-8 text-gray-600">
              Explore available courses and find the right learning path
              for you.
            </p>

            <div class="mt-8 flex gap-3">

              <a
                routerLink="/login"
                class="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              >
                Login
              </a>

              <a
                href="#courses"
                class="rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Browse Courses
              </a>

            </div>

          </div>

        </div>
      </section>


      <!-- Courses -->
      <section
        id="courses"
        class="mx-auto max-w-7xl px-6 py-12"
      >

        <div class="mb-8">

          <h2 class="text-2xl font-bold text-gray-900">
            Available Courses
          </h2>

          <p class="mt-2 text-gray-600">
            Explore our current course catalogue.
          </p>

        </div>


        @if (store.entities().length > 0) {

          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            @for (course of store.entities(); track course.id) {

              <article
                class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <div class="mb-4 flex items-center justify-between">

                  <span
                    class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                  >
                    {{ course.code }}
                  </span>

                  <span class="text-sm text-gray-500">
                    {{ course.enrollmentCount }}/{{ course.maxCapacity }}
                  </span>

                </div>


                <h3 class="text-lg font-semibold text-gray-900">
                  {{ course.title }}
                </h3>


                <p class="mt-2 text-sm text-gray-500">
                  {{
                    course.enrollmentCount >= course.maxCapacity
                      ? 'Currently full'
                      : 'Accepting enrollments'
                  }}
                </p>


                <div class="mt-6">

                  <a
                    [routerLink]="['/courses', course.id]"
                    class="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View Course
                  </a>

                </div>

              </article>

            }

          </div>

        } @else {

          <div class="rounded-xl border border-gray-200 bg-white p-8 text-center">

            <p class="text-gray-500">
              Loading courses...
            </p>

          </div>

        }

      </section>


      <!-- Bottom CTA -->
    <section class="bg-blue-600">
  <div class="mx-auto max-w-7xl px-6 py-12 text-center">

    @if (authService.currentUser(); as user) {

      <h2 class="text-2xl font-bold text-white">
        Welcome back, {{ user.displayName }}!
      </h2>

      <p class="mt-2 text-blue-100">
        Continue your learning journey from your dashboard.
      </p>

      @if (user.role === 'Student') {

        <a
          routerLink="/dashboard"
          class="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-medium text-blue-700 hover:bg-blue-50"
        >
          Go to Dashboard
        </a>

      } @else if (user.role === 'Instructor') {

        <a
          routerLink="/instructor"
          class="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-medium text-blue-700 hover:bg-blue-50"
        >
          Go to Instructor Dashboard
        </a>

      } @else if (user.role === 'Admin') {

        <a
          routerLink="/admin/courses"
          class="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-medium text-blue-700 hover:bg-blue-50"
        >
          Go to Admin
        </a>

      }

    } @else {

      <h2 class="text-2xl font-bold text-white">
        Ready to start learning?
      </h2>

      <p class="mt-2 text-blue-100">
        Sign in to enroll in courses and manage your studies.
      </p>

      <a
        routerLink="/login"
        class="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-medium text-blue-700 hover:bg-blue-50"
      >
        Login to TMS
      </a>

    }

  </div>
</section>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class HomeComponent {
  store = inject(CourseStore);
  authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.store.loadCourses();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/"]);
  }
}
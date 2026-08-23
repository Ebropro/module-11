import { Component } from "@angular/core";

@Component({
  selector: "app-admin-course-list",
  standalone: true,
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-semibold text-gray-900">
          Admin Course Management
        </h1>

        <p class="mt-2 text-sm text-gray-500">
          This page is restricted to administrators.
        </p>
      </section>
    </div>
  `,
})
export class AdminCourseListComponent {}

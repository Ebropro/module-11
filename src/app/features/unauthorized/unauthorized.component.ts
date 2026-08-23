import { Component } from "@angular/core";

@Component({
  selector: "app-unauthorized",
  standalone: true,
  template: `
    <div class="p-8 text-center">
      <h1 class="text-3xl font-bold">Unauthorized</h1>
      <p class="mt-2">
        You do not have permission to access this page.
      </p>
    </div>
  `,
})
export class UnauthorizedComponent {}
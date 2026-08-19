import { Component, input, effect, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './course-detail.component.html',
})
export class CourseDetailComponent {
  // Automatically receives the :id from the URL /courses/:id
  // because withComponentInputBinding() is enabled in app.config.ts (Exercise 1).
  // The name must match exactly: the route says ":id", so the input is called "id".
  id = input.required<string>();

  constructor() {
    effect(() => {
      console.log(`Loading course detail for ID: ${this.id()}`);
    });
  }
}


import { Component, inject, signal, input, effect } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of, catchError, map } from 'rxjs';
import { EnrollmentService } from '../../services/enrollment.service';

interface EnrollResult {
  courseCode: string;
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './enrollment-form.component.html',
})
export class EnrollmentFormComponent {
  private fb = inject(FormBuilder);
  private api = inject(EnrollmentService);
  private router = inject(Router);

  // Pre-filled automatically from a query param via withComponentInputBinding
  // (already enabled in app.config.ts since M8 Exercise 1) — navigating to
  // /enroll?courseCode=CSE-101 fills this without any extra wiring.
  courseCode = input<string>('');

  submitted = signal(false);
  submitting = signal(false);
  results = signal<EnrollResult[]>([]);

  form = this.fb.nonNullable.group({
    studentId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    courseCode: ['', [Validators.required, Validators.pattern('^[A-Z]{3}-[0-9]{3}$')]],
    // Captured for your own record-keeping only — EnrollStudentCommand on the
    // real backend has no term/notes fields, so neither is ever sent to the API.
    term: ['Fall 2026'],
    notes: [''],
    backupCourses: this.fb.array<FormControl<string>>([]),
  });

  constructor() {
    // Reacts if the query param value changes after this component is already alive
    effect(() => {
      const code = this.courseCode();
      if (code) this.form.controls.courseCode.setValue(code);
    });
  }

  get backups() {
    return this.form.controls.backupCourses;
  }

  addBackup() {
    this.backups.push(
      this.fb.control('', { nonNullable: true, validators: Validators.pattern('^[A-Z]{3}-[0-9]{3}$') }),
    );
  }

  removeBackup(index: number) {
    this.backups.removeAt(index);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.results.set([]);

    const { studentId, courseCode, backupCourses } = this.form.getRawValue();
    const allCodes = [courseCode, ...backupCourses.filter(c => c.trim())];

    // One real enrollment call per course (primary + any backups). Each is
    // wrapped in its own catchError so one course being full/already-enrolled
    // doesn't wipe out results for the others — forkJoin only completes once
    // every inner observable has emitted something, success or converted-error.
    const calls = allCodes.map((code) =>
      this.api.create(Number(studentId), code).pipe(
        map((): EnrollResult => ({ courseCode: code, success: true, message: 'Enrolled' })),
        catchError((err) =>
          of<EnrollResult>({
            courseCode: code,
            success: false,
            message: err.error?.detail ?? 'Failed',
          }),
        ),
      ),
    );

    forkJoin(calls).subscribe((allResults) => {
      this.results.set(allResults);
      this.submitting.set(false);
      this.submitted.set(true);
      setTimeout(() => this.router.navigateByUrl('/instructor'), 1500);
    });
  }
}      
         // =====================
         // =================

// import { Component, inject, signal } from "@angular/core";
// import { FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
// import { Router } from '@angular/router';
// import { EnrollmentService } from '../../services/enrollment.service';

// @Component({
//   selector: "app-enrollment-form",
//   standalone: true,
//   imports: [ReactiveFormsModule],
//   templateUrl: "./enrollment-form.component.html",
// })
// export class EnrollmentFormComponent {
//   private fb = inject(FormBuilder);
//   private api = inject(EnrollmentService);
//   private router = inject(Router);

//   submitted = signal(false);
//   submitting = signal(false);
//   serverError = signal<string | null>(null);

//   form = this.fb.nonNullable.group({
//     studentId: ["", [Validators.required, Validators.pattern("^[0-9]+$")]],
//     courseCode: ["", [Validators.required, Validators.pattern("^[A-Z]{3}-[0-9]{3}$")]],
//   });

//   submit() {
//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }

//     this.submitting.set(true);
//     this.serverError.set(null);

//     const { studentId, courseCode } = this.form.getRawValue();

//     // TODO: exact call finalized once EnrollmentsController's real route is confirmed
//     this.api.create(Number(studentId), courseCode).subscribe({
//       next: () => {
//         this.submitting.set(false);
//         this.submitted.set(true);
//         setTimeout(() => this.router.navigateByUrl('/instructor'), 1200);
//       },
//       error: (err) => {
//         this.submitting.set(false);
//         this.serverError.set(err.error?.detail ?? 'Enrollment failed. Check the student ID and course code.');
//       },
//     });
//   }
// }
                        
               //==========================
               //=======================

// import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
// import {
//   FormBuilder,
//   FormControl,
//   Validators,
//   ReactiveFormsModule,
//   FormArray,
// } from '@angular/forms';

// @Component({
//   selector: 'app-enrollment-form',
//   standalone: true,
//   imports: [ReactiveFormsModule], // Required—without this, Angular does not recognize form directives.
//   templateUrl: './enrollment-form.component.html',
//   changeDetection: ChangeDetectionStrategy.Eager,
//   styleUrl: './enrollment-form.component.scss',
// })
// export class EnrollmentFormComponent {
//   // inject(FormBuilder) is Angular's way of requesting a service.
//   // It is similar to constructor injection in .NET (like injecting ILogger in a C# class).
//   // The "private" keyword means only this class can access it.
//   private fb = inject(FormBuilder);

//   // A signal to track whether the form was submitted
//   // (for showing a success message).
//   submitted = signal(false);

//   // fb.nonNullable.group({...}) creates a form object in TypeScript code.
//   // "nonNullable" ensures that all values are typed as 'string'
//   // instead of 'string | null'. This saves you from writing
//   // null-checking code everywhere.
//   //
//   // Each field is defined as: [defaultValue, validators]
//   // Validators are rules that the value must pass before
//   // the form is considered valid.
//   form = this.fb.nonNullable.group({
//     studentId: ['', [Validators.required, Validators.pattern('^STU-[0-9]{4}$')]],
//     // ^^ Default value is an empty string.
//     // ^^ Two validators:
//     //    - Field is required.
//     //    - Must match the pattern STU-1234.

//     courseId: ['', Validators.required],

//     // Pre-filled with a default term.
//     term: ['Fall 2026', Validators.required],

//     // Optional field (no validators).
//     notes: [''],

//     // Starts empty. User adds rows dynamically.
//     backupCourses: this.fb.array<FormControl<string>>([]),
//   });

//   // "get backups()" is a TypeScript property accessor.
//   // It looks like a variable but actually runs a function.
//   // This is a shortcut so you can write:
//   //   this.backups
//   // instead of:
//   //   this.form.controls.backupCourses
//   get backups() {
//     return this.form.controls.backupCourses;
//   }

//   // Adds a new empty text input to the backup courses array.
//   addBackup() {
//     this.backups.push(
//       this.fb.control('', {
//         nonNullable: true,
//         validators: Validators.required,
//       }),
//     );
//   }

//   // Removes a specific backup course row by its position in the array.
//   removeBackup(index: number) {
//     this.backups.removeAt(index);
//   }

//   submit() {
//     if (this.form.valid) {
//       // getRawValue() extracts the full form data as a JSON object.
//       // IMPORTANT:
//       // Do NOT use .value here. If any field is disabled,
//       // .value silently drops that field from the object.
//       // getRawValue() always includes every field.
//       const payload = this.form.getRawValue();

//       console.log('Enrollment payload:', payload);
//       this.submitted.set(true);
//     } else {
//       // markAllAsTouched() forces Angular to show validation errors
//       // on every field.
//       // Without this call, Angular only shows errors on fields
//       // the user has interacted with.
//       this.form.markAllAsTouched();
//     }
//   }
// }

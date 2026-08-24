import {
ChangeDetectionStrategy,
Component,
computed,
inject,
signal,
} from '@angular/core';

import { CourseStore } from '../../store/course.store';
import { Course } from '../../models/course.model';

@Component({
selector: 'app-admin-course-list',
standalone: true,
templateUrl: './admin-course-list.component.html',
styleUrl: './admin-course-list.component.css',
changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCourseListComponent {

readonly store = inject(CourseStore);

// ---------------------------------------------------------------
// Search
// ---------------------------------------------------------------

readonly searchTerm = signal('');

readonly filteredCourses = computed(() => {
const search = this.searchTerm()
.trim()
.toLowerCase();


const courses = this.store.entities();

if (!search) {
  return courses;
}

return courses.filter(course =>
  course.code.toLowerCase().includes(search) ||
  course.title.toLowerCase().includes(search)
);


});

// ---------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------

readonly totalCourses = computed(() =>
this.store.entities().length
);

readonly totalEnrollments = computed(() =>
this.store.entities().reduce(
(total, course) =>
total + course.enrollmentCount,
0
)
);

readonly totalCapacity = computed(() =>
this.store.entities().reduce(
(total, course) =>
total + course.maxCapacity,
0
)
);

readonly availableSeats = computed(() =>
Math.max(
0,
this.totalCapacity() -
this.totalEnrollments()
)
);

readonly overallCapacityPercent = computed(() => {
const capacity = this.totalCapacity();


if (capacity === 0) {
  return 0;
}

return Math.min(
  100,
  Math.round(
    (this.totalEnrollments() / capacity) * 100
  )
);


});

// ---------------------------------------------------------------
// Modal
// ---------------------------------------------------------------

readonly modalOpen = signal(false);

readonly modalMode = signal<'create' | 'edit'>('create');

readonly editingId = signal<number | null>(null);

// ---------------------------------------------------------------
// Form
// ---------------------------------------------------------------

readonly formCode = signal('');

readonly formTitle = signal('');

readonly formCapacity = signal<number | null>(null);

// ---------------------------------------------------------------
// UI state
// ---------------------------------------------------------------

readonly saving = signal(false);

readonly errorMessage = signal('');

// ---------------------------------------------------------------
// Constructor
// ---------------------------------------------------------------

constructor() {
this.store.loadCourses();
}

// ---------------------------------------------------------------
// Course helpers
// ---------------------------------------------------------------

capacityPercent(course: {
enrollmentCount: number;
maxCapacity: number;
}): number {
if (course.maxCapacity <= 0) {
return 0;
}


return Math.min(
  100,
  Math.round(
    (course.enrollmentCount /
      course.maxCapacity) *
      100
  )
);


}

availableSeatsFor(course: {
enrollmentCount: number;
maxCapacity: number;
}): number {
return Math.max(
0,
course.maxCapacity -
course.enrollmentCount
);
}

// ---------------------------------------------------------------
// Search
// ---------------------------------------------------------------

setSearchTerm(value: string): void {
this.searchTerm.set(value);
}

// ---------------------------------------------------------------
// Create
// ---------------------------------------------------------------

openCreate(): void {
this.modalMode.set('create');


this.editingId.set(null);

this.formCode.set('');

this.formTitle.set('');

this.formCapacity.set(30);

this.errorMessage.set('');

this.modalOpen.set(true);


}

// ---------------------------------------------------------------
// Edit
// ---------------------------------------------------------------

openEdit(
id: number,
code: string,
title: string,
maxCapacity: number
): void {
this.modalMode.set('edit');


this.editingId.set(id);

this.formCode.set(code);

this.formTitle.set(title);

this.formCapacity.set(maxCapacity);

this.errorMessage.set('');

this.modalOpen.set(true);

}

// ---------------------------------------------------------------
// Close modal
// ---------------------------------------------------------------

closeModal(): void {
if (this.saving()) {
return;
}


this.modalOpen.set(false);

this.editingId.set(null);

this.formCode.set('');

this.formTitle.set('');

this.formCapacity.set(null);

this.errorMessage.set('');


}

// ---------------------------------------------------------------
// Form setters
// ---------------------------------------------------------------

setFormCode(value: string): void {
this.formCode.set(value);
}

setFormTitle(value: string): void {
this.formTitle.set(value);
}

setFormCapacity(value: string): void {
if (value === '') {
this.formCapacity.set(null);
return;
}


const numberValue = Number(value);

this.formCapacity.set(
  Number.isNaN(numberValue)
    ? null
    : numberValue
);

}

// ---------------------------------------------------------------
// Save
// ---------------------------------------------------------------

saveCourse(): void {
this.errorMessage.set('');


const mode = this.modalMode();

const code = this.formCode()
  .trim()
  .toUpperCase();

const title = this.formTitle()
  .trim();

const capacity = this.formCapacity();

if (mode === 'create' && !code) {
  this.errorMessage.set(
    'Course code is required.'
  );
  return;
}

if (!title) {
  this.errorMessage.set(
    'Course title is required.'
  );
  return;
}

if (title.length > 200) {
  this.errorMessage.set(
    'Course title cannot exceed 200 characters.'
  );
  return;
}

if (
  capacity === null ||
  !Number.isInteger(capacity) ||
  capacity < 1 ||
  capacity > 200
) {
  this.errorMessage.set(
    'Maximum capacity must be between 1 and 200.'
  );
  return;
}

this.saving.set(true);

if (mode === 'create') {
  this.store.createCourse(
    code,
    title,
    capacity
  );
} else {
  const id = this.editingId();

  if (id === null) {
    this.errorMessage.set(
      'No course is selected for editing.'
    );

    this.saving.set(false);
    return;
  }

  this.store.updateCourse(
    id,
    title,
    capacity
  );
}

this.saving.set(false);

this.closeModal();


}

// ---------------------------------------------------------------
// Delete
// ---------------------------------------------------------------

deleteCourse(id: number): void {
const confirmed = window.confirm(
'Are you sure you want to delete this course?'
);


if (!confirmed) {
  return;
}

this.store.deleteCourse(id);

}
}

import { CourseStore } from '../../store/course.store';


import {
  rxResource,
  toSignal,
} from '@angular/core/rxjs-interop';

import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  startWith,
} from 'rxjs';

import {
  inject,
  Component,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';

import { CourseService } from '../../services/course.service';
import { CourseCardComponent } from '../../ui/course-card/course-card.component';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CourseCardComponent],
  templateUrl: './student-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent {

  private api = inject(CourseService);
  store = inject(CourseStore);

  // Student information
  studentName = signal('Liya Kebede');

  earnedCredits = signal(45);

  // Search
  searchTerm = signal('');

  private search$ = new Subject<string>();

  // filteredCourses = toSignal(
  //   this.search$.pipe(
  //     startWith(''),
  //     debounceTime(300),
  //     distinctUntilChanged(),

  //     switchMap(term =>
  //       this.api.getAll().pipe(
  //         map(courses => {
  //           const search = term.trim().toLowerCase();

  //           return courses.filter(course =>
  //             course.title.toLowerCase().includes(search) ||
  //             course.code.toLowerCase().includes(search)
  //           );
  //         })
  //       )
  //     )
  //   ),
  //   { initialValue: [] as Course[] }
  // );

  filteredCourses = computed(() => {
  const search = this.searchTerm().trim().toLowerCase();

  return this.store.entities().filter(course =>
    course.title.toLowerCase().includes(search) ||
    course.code.toLowerCase().includes(search)
  );
});


  courseCount = computed(() => this.filteredCourses().length);

  // Graduation status
  graduationStatus = computed(() =>
    this.earnedCredits() >= 120
      ? 'Eligible for Graduation'
      : 'In Progress'
  );

  // Live API course catalogue
  // coursesResource = rxResource({
  //   stream: () => this.api.getAll(),
  // });

  // Selected course after clicking Enroll
  selectedCourse = signal<Course | null>(null);

  // Controls notification toast
  showEnrollmentToast = signal(false);

  constructor() {

    this.store.loadCourses();
    

    effect(() => {
      const course = this.selectedCourse();

      if (course) {
        this.showEnrollmentToast.set(true);

        setTimeout(() => {
          this.showEnrollmentToast.set(false);
        }, 4000);
      }
    });

  }

  // Adds 3 credits when registering
  registerForClass() {
    this.earnedCredits.update(c => c + 3);
  }

  // Search handler
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;

    this.searchTerm.set(input.value);
    this.search$.next(input.value);
  }

  // Called when Enroll is clicked
  handleEnroll(course: Course) {
    this.selectedCourse.set(course);

    console.log(
      'Enrollment requested for:',
      course.title
    );
  }

}
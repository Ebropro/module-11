import { AuthService } from "../../services/auth.service";

import { Component, inject, OnInit } from '@angular/core';

import { EnrollmentListComponent } from '../enrollment-list/enrollment-list.component';
import { EnrollmentSummaryComponent } from '../enrollment-summary/enrollment-summary.component';
import { AnalyticsChartComponent } from '../../ui/analytics-chart/analytics-chart.component';

import { EnrollmentStore } from '../../store/enrollment.store';
import { CourseStore } from '../../store/course.store';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  
  imports: [
    EnrollmentListComponent,
    EnrollmentSummaryComponent,
    AnalyticsChartComponent
  ],
  templateUrl: './instructor-dashboard.component.html'
})
export class InstructorDashboardComponent implements OnInit {
  
  protected auth = inject(AuthService);

  enrollmentStore = inject(EnrollmentStore);

  courseStore = inject(CourseStore);

  ngOnInit() {

    // Existing real-time enrollment updates
    this.enrollmentStore.listenForLiveUpdates();

    // Load courses into CourseStore
    this.courseStore.loadCourses();
  }
}



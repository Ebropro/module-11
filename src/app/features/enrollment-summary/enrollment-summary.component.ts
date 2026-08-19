import { Component, inject } from '@angular/core';
import { EnrollmentStore } from '../../store/enrollment.store';

@Component({
  selector: 'tms-enrollment-summary',
  standalone: true,
  templateUrl: './enrollment-summary.component.html'
})
export class EnrollmentSummaryComponent {
  // Same store, same singleton instance — no fetch call needed here at all.
  // This component never calls loadEnrollments(); it just reads whatever
  // the list component already loaded into the shared store.
  store = inject(EnrollmentStore);
}
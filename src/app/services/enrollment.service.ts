import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';

@Service()
export class EnrollmentService {
  private http = inject(HttpClient);
  private baseUrl = 'api/enrollments';
  private createUrl = 'api/v2/enrollments';

  getAll(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.baseUrl);
  }

  approve(id: number): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.baseUrl}/${id}/approve`, {});
  }

  // Matches EnrollStudentCommand exactly: POST /api/v2/enrollments,
  // { studentId, courseCode } in the body, course identified by code not id.
  create(studentId: number, courseCode: string): Observable<unknown> {
    return this.http.post(this.createUrl, { studentId, courseCode });
  }
}
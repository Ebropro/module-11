import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Course, PagedResponse } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);

  private readonly base =
    `${environment.apiUrl}/courses`;

  private readonly managementBase =
    `${environment.managementApiUrl}/courses`;

  // Public catalogue
  getAll() {
    return this.http
      .get<PagedResponse<Course>>(this.base, {
        params: {
          page: '1',
          pageSize: '50'
        }
      })
      .pipe(
        map(response => response.items)
      );
  }

  // Public course detail
  getById(id: number) {
    return this.getAll().pipe(
      map(courses =>
        courses.find(course => course.id === id) ?? null
      )
    );
  }

  // Admin/Instructor management
  update(
    id: number,
    title: string,
    maxCapacity?: number
  ) {
    return this.http.put<Course>(
      `${this.managementBase}/${id}`,
      {
        title,
        ...(maxCapacity !== undefined
          ? { maxCapacity }
          : {})
      }
    );
  }

  // Admin/Instructor management
  delete(id: number) {
    return this.http.delete(
      `${this.managementBase}/${id}`
    );
  }

  create(
  code: string,
  title: string,
  maxCapacity: number
) {
  return this.http.post<Course>(
    this.managementBase,
    {
      code,
      title,
      maxCapacity
    }
  );
}
}
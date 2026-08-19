import { LiveSyncService } from '../services/live-sync.service';

import { rxMethod } from '@ngrx/signals/rxjs-interop';

import {
  pipe,
  switchMap,
  tap,
  catchError,
  EMPTY
} from 'rxjs';




import { inject } from '@angular/core';
import {
  signalStore,
  withMethods,
  patchState,
} from '@ngrx/signals';

import {
  withEntities,
  removeEntity,
  setAllEntities,
} from '@ngrx/signals/entities';

import { Course } from '../models/course.model';
import { CourseService } from '../services/course.service';



export const CourseStore = signalStore(
  { providedIn: 'root' },

  withEntities<Course>(),

withMethods((
  store,
  svc = inject(CourseService),
  sync = inject(LiveSyncService)
) => ({


    loadCourses() {
      svc.getAll().subscribe({
        next: courses => {
          patchState(
            store,
            setAllEntities(courses)
          );
        },

        error: err => {
          console.error(
            'Failed to load courses:',
            err
          );
        }
      });
    },

    deleteCourse(id: number) {

      // IMPORTANT:
      // Snapshot BEFORE removing the entity.
      const previousSnapshot = store.entities();

      // Optimistic update:
      // Remove immediately from local state.
      patchState(
        store,
        removeEntity(id)
      );

      // Ask the backend to delete it.
      svc.delete(id).pipe(

        catchError(err => {

          // Backend rejected deletion.
          // Restore the original snapshot.
          patchState(
            store,
            setAllEntities(previousSnapshot)
          );

          console.error(
            'Delete failed. Course restored.',
            err
          );

          return EMPTY;
        })

      ).subscribe();
    }
  }))
);



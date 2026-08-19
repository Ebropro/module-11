import { Service, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';

export interface EnrollmentStatusEvent {
  id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Service()
export class LiveSyncService {
  private platformId = inject(PLATFORM_ID);
  private connection: HubConnection | null = null;
  private eventsSubject = new Subject<EnrollmentStatusEvent>();
  events$ = this.eventsSubject.asObservable();
  //
  private courseDeletedSubject = new Subject<number>();
  courseDeleted$ = this.courseDeletedSubject.asObservable();

  connectionState = signal<'connected' | 'reconnecting' | 'disconnected'>('disconnected');

  connect() {
    if (this.connection) return;

    // tms-client project was scaffolded with --ssr=false (M8-1),
    // so isPlatformBrowser(this.platformId) will always be true here in practice. 
    // This guard is kept anyway harmless, if SSR is ever enabled later without needing a rewrite.
    if (!isPlatformBrowser(this.platformId)) return;

    this.connection = new HubConnectionBuilder()
      .withUrl('/hubs/tms')
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

    this.connection.on(
      'ReceiveEnrollmentStatusUpdated',
      (enrollmentId: string, status: 'Pending' | 'Approved' | 'Rejected') => {
        this.eventsSubject.next({ id: enrollmentId, status });
      },
    );

    // NEW: course deletion event
    this.connection.on(
      'CourseDeleted',
      (courseId: number) => {
      this.courseDeletedSubject.next(courseId);
  }
);

    this.connection.onreconnecting(() => this.connectionState.set('reconnecting'));
    this.connection.onreconnected(() => this.connectionState.set('connected'));
    this.connection.onclose(() => this.connectionState.set('disconnected'));

    this.connection
      .start()
      .then(() => this.connectionState.set('connected'))
      .catch((err) => console.error('SignalR connection error:', err));
  }
}
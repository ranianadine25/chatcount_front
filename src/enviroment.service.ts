import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  constructor(@Inject('BASE_HREF') private baseHref: string) {}

  getBaseHref() {
    return this.baseHref;
  }
}

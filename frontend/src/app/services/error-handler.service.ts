import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  
  handleError(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return `Error: ${error.error.message}`;
    } else {
      // Server-side error
      const message = error.error?.message || error.message || 'An unexpected error occurred';
      return `Error ${error.status}: ${message}`;
    }
  }

  getValidationErrors(error: HttpErrorResponse): Record<string, string> {
    if (error.error?.errors) {
      return error.error.errors;
    }
    return {};
  }
}


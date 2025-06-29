import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { environment } from '../environments/environment';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Alert } from '../dialogs/alert/alert';
import { ParameterItem } from '../meta/app.meta';
import { ServerModule } from '../meta/http.meta';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  public clearConnection: Subject<boolean> = new Subject<boolean>();

  private httpClient = inject(HttpClient);
  private dialog = inject(MatDialog);

  public serverGet<T>(
    action: ServerModule,
    path: string = '',
    parameters: ParameterItem[] = []
  ): Observable<T> {
    return this.httpClient
      .get<any>(
        HttpService.getServerUrl(
          action,
          path + HttpService.getParameterString(parameters)
        )
      )
      .pipe(catchError((error) => this.handleError(error)));
  }

  public serverPut<T>(
    action: ServerModule,
    path: string = '',
    data: any,
    parameters: ParameterItem[] = []
  ): Observable<T> {
    return this.httpClient
      .put<any>(
        HttpService.getServerUrl(
          action,
          path + HttpService.getParameterString(parameters)
        ),
        data
      )
      .pipe(catchError((error) => this.handleError(error)));
  }

  public serverPost<T>(
    action: ServerModule,
    path: string = '',
    data: any,
    parameters: ParameterItem[] = []
  ): Observable<T> {
    return this.httpClient
      .post<T>(
        HttpService.getServerUrl(
          action,
          path + HttpService.getParameterString(parameters)
        ),
        data
      )
      .pipe(catchError((error) => this.handleError(error)));
  }

  public serverDelete<T>(
    action: ServerModule,
    path: string = '',
    parameters: ParameterItem[] = []
  ): Observable<T> {
    return this.httpClient
      .delete<any>(
        HttpService.getServerUrl(
          action,
          path + HttpService.getParameterString(parameters)
        )
      )
      .pipe(catchError((error) => this.handleError(error)));
  }

  public serverPatch<T>(
    action: ServerModule,
    path: string = '',
    data: any,
    parameters: ParameterItem[] = []
  ): Observable<T> {
    return this.httpClient
      .patch<T>(
        HttpService.getServerUrl(
          action,
          path + HttpService.getParameterString(parameters)
        ),
        data
      )
      .pipe(catchError((error) => this.handleError(error)));
  }

  private static getServerUrl(action: ServerModule, path: string): string {
    let url: string = environment.apiHost + '/' + action;
    return path ? url + '/' + path : url;
  }

  private static getParameterString(parameters: ParameterItem[]): string {
    return parameters.length
      ? '?' +
          parameters
            .map(
              (parameter: ParameterItem): string =>
                parameter.key + '=' + parameter.value.toString()
            )
            .join('&')
      : '';
  }

  //TODO: update message text
  //TODO: add error exception for more code
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(error);
    const message: string = error.error.message ?? error.message ?? '';
    switch (error.status) {
      case HttpStatusCode.BadRequest:
        this.dialog.open(Alert, {
          width: '500px',
          height: '200px',
          data: {
            title: 'Ошибка',
            message: message ?? 'Не удалось выполнить запрос',
          },
        });
        break;
      case HttpStatusCode.Unauthorized:
        this.clearConnection.next(true);
        this.dialog.open(Alert, {
          width: '500px',
          height: '200px',
          data: {
            title: 'Ошибка',
            message: message ?? 'Необходимо авторизоваться',
          },
        });
        break;
    }
    return throwError(() => error);
  }
}

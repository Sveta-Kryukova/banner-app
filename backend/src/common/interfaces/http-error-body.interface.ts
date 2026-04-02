export interface HttpErrorBody {
  readonly statusCode: number;
  readonly message: string | string[];
  readonly path: string;
  readonly timestamp: string;
}

import { JsonObject } from 'type-fest';

export interface ContextProps<T> {
  status: number;
  body: JsonObject | string | T;
}

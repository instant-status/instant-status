import { JsonObject } from 'type-fest';

export interface ContextProps {
  status: number;
  body: JsonObject | string;
}

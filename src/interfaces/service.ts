import { TSubscriptionHandler } from '../types/subscription-handler';

export interface IService {
  subscribe(event: string, handler: TSubscriptionHandler): void;
}

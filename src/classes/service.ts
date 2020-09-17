import * as Colors from 'colors';
import { injectable } from 'inversify';
import * as stringify from 'stringify-object';
import { IService } from '../interfaces/service';
import { TSubscriptionHandler } from '../types/subscription-handler';
import { logger } from '../utils/logger';

@injectable()
export class Service implements IService {
  private subscriptions: Map<string, Set<TSubscriptionHandler>>;

  public constructor() {
    this.subscriptions = new Map();
  }

  public subscribe(event: string, handler: TSubscriptionHandler) {
    if (this.subscriptions.has(event)) {
      (<Set<TSubscriptionHandler>>this.subscriptions.get(event)).add(handler);
    } else {
      this.subscriptions.set(event, new Set([handler]));
    }
  }

  protected warn(condition: boolean, message: string, data?: object) {
    if (condition) {
      const error = new Error(message);
      const stack = error.stack ? error.stack.split('\n').splice(2).join('\n') : undefined;
      const dataPart = data ? stringify(data, { inlineCharacterLimit: Infinity }) : '';
      const formattedMessage = `${Colors.blue(this.constructor.name)} ${message} ${dataPart} \n${stack}`;
      logger.debug(formattedMessage);
    }
  }

  protected async publish(event: string, data: any) {
    await Promise.all(Array.from(this.subscriptions.get(event) || []).map(async handler => {
      await handler(data);
    }));
  }
}

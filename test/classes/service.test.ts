import { Service } from '../../';

describe('Service', function () {
  describe('.subscribe()', function () {
    class TestService extends Service {
      public async triggerPublish(event: string, data: any) {
        await this.publish(event, data);
      }
    }

    it('should register a new subscription', async () => {
      let eventData: any = null;
      const service = new TestService();
      const handler = (data: any) => eventData = data;
      service.subscribe('test', handler);
      await service.triggerPublish('test', 'test');
      expect(eventData).to.equal('test');
    });
    it('should register multiple subscriptions', async () => {
      let firstEventData: any = null;
      let secondEventData: any = null;
      const service = new TestService();
      const firstHandler = (data: any) => firstEventData = data;
      const secondHandler = (data: any) => secondEventData = data;
      service.subscribe('test', firstHandler);
      service.subscribe('test', secondHandler);
      await service.triggerPublish('test', 'test');
      expect(firstEventData).to.equal('test');
      expect(secondEventData).to.equal('test');
    });
    it('should NOT publish to non subscribing handlers', async () => {
      let eventData: any = null;
      const service = new TestService();
      const handler = (data: any) => eventData = data;
      service.subscribe('other', handler);
      await service.triggerPublish('test', 'test');
      expect(eventData).to.equal(null);
    });
  });
});
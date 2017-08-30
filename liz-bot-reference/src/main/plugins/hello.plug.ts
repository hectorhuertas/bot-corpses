import { RTM_EVENTS } from '@slack/client';
import { State } from '../index';

export = function({rtm, startResult}: State) {
  rtm.on(RTM_EVENTS.MESSAGE, (message: any) => {
    const botId = startResult.self.id;
    if (message.text && message.text.indexOf(`<@${botId}`) > -1) {
      if (message.text && message.text.indexOf('hey') > -1) {
        // console.log(startResult.self);
        // console.log('New message:\n-----------');
        // console.log(message);
        const msg = `ME, ${startResult.self.name}, is listening`;
        rtm.sendMessage(msg, message.channel);
        console.log(`Message sent: "${msg}"`);
      }
    }
  });
};

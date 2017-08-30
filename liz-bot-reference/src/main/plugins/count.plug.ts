import {get} from 'config';
import * as Seneca from 'seneca';
import { RTM_EVENTS } from '@slack/client';
import { State } from '../index';
const {promisify} = require('bluebird');

export = function({rtm, startResult}: State) {

  const db = {
    count: (query: any) => {
      const base =  {
        role: 'vault',
        cmd: 'count',
        model: query.model,
        payload: {}
      };
      let limitDate;
      if (query.from && query.to) {
          limitDate = new Date(query.to);
      } else {
        limitDate = new Date();
      }
      if (query.from) {
          base.payload = {
            where: {
              created_at: {
                $gt: new Date(query.from),
                $lt: limitDate
              }
            }
          };
      }
      return base;
    }
  };

  const vault = senecaInit('vault');

  rtm.on(RTM_EVENTS.MESSAGE, (message: any) => {
    const botId = startResult.self.id;
    if (message.text &&
        message.text.indexOf(`<@${botId}`) > -1 &&
        message.text.indexOf(`count`) > -1) {
      const parsedQuery = parse(message.text);
      const query = db.count(parsedQuery);
      console.log(query);
      vault(query)
        .then((res: any) => {
            const msg = `The answer is: ${res.result}`;
            rtm.sendMessage(msg, message.channel);
            console.log(`Result: ${msg}`);
        })
        .catch(console.error);
    }
  });
};

function parse (text: String) {
  const words = text.split(' ');
  const model = words.indexOf('count') + 1;
  return {
    model: getValue('count', words),
    from: getValue('from', words),
    to: getValue('to', words)
  };
}

function getValue (key: String, words:String[]) {
  const keyPosition = words.indexOf(key);
  if (keyPosition > -1) {
    return words[keyPosition + 1];
  }
}

function senecaInit<R>(config: string): <R>(p: any) => Promise<R> {
  const seneca = Seneca();
  seneca.use(get<string>(`${config}.transport`));
  seneca.client(get(`${config}.client`));
  return <any>promisify(seneca.act, { context: seneca });
}

import {get} from 'config';
import {RtmClient,RTM_EVENTS, CLIENT_EVENTS, RtmStartResult} from '@slack/client';
import * as glob from 'glob';

const token = get<string>('token');
const channels = get<string>('channels').split(',');

const rtm = new RtmClient(token);

export interface State {
  rtm: typeof rtm;
  startResult: RtmStartResult;
}

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (data: RtmStartResult) {
  console.log(`Logged in as ${data.self.name} of team ${data.team.name}`);
  const ch_available = data.channels.filter((ch: any) => ch.is_member);
  if (ch_available.length > 0) {
    console.log(`Listening in ${ch_available.map((ch: any) => ch.name).join(', ')}`);
  } else {
    console.log(`
      The bot is not part of any channels!
      You can invite it to yours with '/invite @${data.self.name}'
      to ${channels.join(', ')}
    `);
  }

  rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
    glob('**/*.plug.js', (err, files) => {
      files.map(f => require(`${__dirname}/../../${f}`)).forEach(p => p({rtm, startResult: data}));
    });
    console.log(`Ready to emit`);
  });
});

rtm.start();

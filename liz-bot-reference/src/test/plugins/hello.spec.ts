import * as test from 'tape';
import { spy } from 'sinon';
import { Test } from 'tape';
import plugin = require('../../main/plugins/hello.plug');

test('Hello Plugin', (t: Test) => {
  const rtm: any = {
    on: spy(),
    sendMessage: spy()
  };
  const startResult: any = {};

  plugin({rtm, startResult});

  t.ok(rtm.on.calledOnce, 'Calls the rtm on message');

  const callback = rtm.on.args[0][1];
  t.ok(typeof callback === 'function', 'sends message handler as callback');

  callback({text: 'hi', user: 'test' });

  t.ok(rtm.sendMessage.calledOnce, 'Send message is called on greeting');

  rtm.sendMessage.reset();

  callback({text: 'whatever', user: 'another'});

  t.notOk(rtm.sendMessage.called, 'Send message is not called if there is no greeting');

  t.end();
});

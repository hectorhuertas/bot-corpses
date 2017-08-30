import { get } from 'config';
import { connect } from 'amqplib';
import Notify from './notify'
import Spam from './spam'

async function start() {
  const conn = await connect(get<string>('broadcast.uri'));
  const ex = get<string>('broadcast.exchange');

  const ch = await conn.createChannel();
  await ch.assertExchange(ex, 'fanout', { durable: true });
  const q = await ch.assertQueue('lizbot', { exclusive: false, durable: true });
  await ch.bindQueue(q.queue, ex, '');
  ch.prefetch(1);
  ch.consume(
    q.queue,
    async (msg) => {
      const e = JSON.parse(msg.content.toString());
      const c = catchAndRestart(ch);
      if (e.model === 'user' && e.cmd === 'create') {
        return Notify.userRegistration(e.payload).catch(c);
      }
      else if (e.model === 'action' && e.cmd === 'create') {
        return Notify.commentCreation(e.payload).catch(c);
      }
      else if (e.model === 'dataset' && e.cmd === 'create') {
        return Notify.modelCreation(e.payload).catch(c);
      }
      else if (e.model === 'request' && e.cmd === 'create') {
        return Notify.modelCreation(e.payload).catch(c);
      }
      ch.ack(msg);
    },
    { noAck: false }
  );
  console.log('\n----Lizbot Listening-----\n');
}

export function catchAndRestart(ch?) {
  return (err) => {
    console.error(err);
    if (ch) {
      console.log('\n\n\nERROR\n\n\n')
      ch.close();
    }
    start().catch(catchAndRestart(ch));
  };
}
Spam();

import {connect} from 'amqplib';
import { get } from 'config'

export function handleMessage (message: Object) {
  console.log(message)
}

export async function work() {
  const conn = await connect(get<string>('rabbitmq.uri'));
  const channel = await conn.createChannel();
    // channel.on('close', () => restartConnection(seneca, sequelize)(new Error('Connection closed')));
    conn.on('error', (err: any) => {
      console.error(err);
      channel.close();
    });

  const ex = get<string>('rabbitmq.exchange');
  channel.assertExchange('slack', 'fanout', {durable: true});
  console.log(`Service ready to broadcast in ${ex}`);

  channel.publish(ex, '', Buffer.from(JSON.stringify({
    name: 'bob',
    surname: 'bobson'
  })))
}

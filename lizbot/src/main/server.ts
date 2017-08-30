import { handleMessage } from './queuer'
import { IncomingMessage, ServerResponse } from 'http'



export function requestHandler(req: IncomingMessage, res: ServerResponse) {
    const body: Array<any> = []
    req.on('error', replyWithError({res}))
    req.on('data', body.push.bind(body))
    req.on('end', () => {
      // const data = Buffer.concat(body).toString()
      const message = Buffer.concat(body).toString()
      // const message = JSON.parse(data)
      handleMessage(message)

      // Reply to enable new Slack subscription
      // if (message.challenge) return res.end(message.challenge)
      res.end()
    })
  }

export function replyWithError({res}: {res: ServerResponse}) {
  return (err: NetworkError) => {
    console.error(err);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = err.statusCode || 500;
    res.write(JSON.stringify({ok: false, error: err.message}));
    res.end();
  };
}

export class NetworkError extends Error {
  public statusCode: number;
  constructor(msg: string, statusCode: number = 500) {
    super(msg);
    this.statusCode = statusCode;
  }
}

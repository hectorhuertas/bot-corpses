import { createServer } from 'http'
import { requestHandler} from './server'
import { get } from 'config'
import { work } from './queuer'

const port = parseInt(get<string>('server_port'))

const server = createServer();
server.on('request', requestHandler);
server.on('request', requestHandler2);

server.listen(port, () => {
   console.log(`Service listening on port ${port}`)
})

work()

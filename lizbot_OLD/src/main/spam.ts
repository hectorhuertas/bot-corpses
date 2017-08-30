import * as Seneca from 'seneca';
import { get } from 'config';
import { promisify } from 'bluebird';

const seneca = Seneca();
seneca.use(get<string>(`vault.transport`));
seneca.client(get(`vault.client`));
const vault = promisify(seneca.act, { context: seneca });

// const val = Math.floor(1000 +  Math.random() * 9000);
// console.log(val)

export default function start() {
  // setTimeout(spamUserCreation, 1000);
  // setTimeout(spamCommentCreation, 1000);
  // setTimeout(spamDatasetCreation, 1000);
  // setTimeout(spamRequestCreation, 1000);
}

async function spamDatasetCreation() {
  const bob = await vault({
    role: 'vault',
    model: 'dataset',
    cmd: 'create',
    payload: {
      title: 'probando' + guidGenerator(),
      external_id: 'TEST-' + guidGenerator(),
      datasource_id: 'd75f0078-f311-4334-bed5-a9a24e8ac2db',
      user_id: '4b509062-3f8c-43ee-8aec-c75f3784e9d6'
    }
  });
  console.log(JSON.stringify(bob));
}

async function spamRequestCreation() {
  const bob = await vault({
    role: 'vault',
    model: 'request',
    cmd: 'create',
    payload: {
      description: 'a random desc',
      title: 'describiendo' + guidGenerator()
      // external_id: 'TEST-' + guidGenerator(),
      // datasource_id: 'd75f0078-f311-4334-bed5-a9a24e8ac2db',
    }
  });
  console.log(JSON.stringify(bob));
}

async function spamUserCreation() {
  const bob = await vault({
    role: 'vault',
    model: 'user',
    cmd: 'create',
    payload: {
      firstname: 'bob'
    }
  });
  console.log(JSON.stringify(bob));
}
async function spamCommentCreation() {
  const bob = await vault({
    role: 'vault',
    model: 'action',
    cmd: 'create',
    // query: {
    // },
    subscribable_id: '41058b60-5f25-4964-aec6-746db28ce1c0',
    payload: {
      type: 'comment',
      user_id: '6cced6c0-dc39-4f67-9c41-41b5b93fea1e',
      actionable_model: 'dataset',
      // actionable_id: 'sdfasfd',
      // subscribable_id: '41058b60-5f25-4964-aec6-746db28ce1c0',
      actionable_id: '41058b60-5f25-4964-aec6-746db28ce1c0',
      properties: {
        subscribable_id: '41058b60-5f25-4964-aec6-746db28ce1c0',
        text: 'yeah'
      }
    }
  });
  console.log(JSON.stringify(bob));
}

function guidGenerator() {
    const S4 = function() {
       return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
}

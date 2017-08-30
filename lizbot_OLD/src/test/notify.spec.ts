import * as test from 'tape';
import {
  _link,
} from '../main/notify'


const d = {
  title: 'Pemento',
  id: 'test'
}

// test('modelLink', t => {
//   // const actual = _link('baseUrl', 'modelType', 'modelId')
//   const actual = _link('baseUrl')('modelType', 'modelId')
//   const expected = '<baseUrl/modelType/modelId|modelType>'
//
//   t.equals(actual, expected);
//   t.end()
// });

const bob: number[] = [2,3]

function suma (...n: number[]) {
  return n.reduce((acc, a) => acc + a, 0);
}

const total = suma(...bob)

console.log(total)

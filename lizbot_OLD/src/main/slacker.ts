import fetch from 'node-fetch'

export default {
  postMessage
}

async function postMessage(body) {
  const apiUrl = 'https://slack.com/api/chat.postMessage';
  const query = Object.keys(body).reduce((acc, k) => {
    if(acc === '') {
      return `?${k}=${body[k]}`;
    }
    else {
      return acc + '&' + `${k}=${body[k]}`;
    }
  }, '')

  fetch(apiUrl + query)
  .then(function(res) {
      return res.text();
  })
  .then(function(body) {
      return body;
  });
}

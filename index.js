require('dotenv').config()
const request = require('request-promise')
const http = require('http')
const fs = require('fs')

let server_started = false

const pullData = []
let counter = 0

const repo = `https://api.github.com/repos/${process.env.REPO}/pulls`

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(JSON.stringify(pullData));
});


const headers = {
  'User-Agent': `${process.env.GITHUB_USER}`,
  'Authorization': `token ${process.env.GITHUB_TOKEN}`,
}




const authRequest = (url) => {
  const options = {
    url: url,
    headers: headers
  }

  return request(options)
}

const getPulls = (pulls) => {
  pulls.forEach(pull => {
    authRequest(pull.url)
      .then(response => {
        const data = JSON.parse(response)
        pullData.push({
          id: data.id,
          title: data.title,
          created_at: data.created_at,
          owner: data.user.login,
          owner_avatar: data.user.avatar_url,
          comments: data.comments,
          review_comments: data.review_comments,
        })
        counter++
        if (counter === pulls.length) {
          if (!server_started) {
            server.listen(process.env.PORT, process.env.HOSTNAME, () => {
              console.log('Server running')
              server_started = true
            })
          }

        }
      })
  })
}

authRequest(repo)
.then(res => {
  const pulls = JSON.parse(res)
  getPulls(pulls)
}).then(() => console.log(pullData))
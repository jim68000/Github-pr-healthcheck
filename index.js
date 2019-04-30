require('dotenv').config()
const request = require('request-promise')

console.log(process.env.GITHUB_USER)

const repo = `https://api.github.com/repos/${process.env.REPO}/pulls`

const headers = {
  'User-Agent': `${process.env.GITHUB_USER}`,
  'Authorization': `${process.env.GITHUB_TOKEN}`,
}

const pullData = []
let counter = 0

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
          // we are ready

        }
      })
  })
}

authRequest(repo)
.then(res => {
  const pulls = JSON.parse(res)
  getPulls(pulls)
}).then(() => console.log(pullData))
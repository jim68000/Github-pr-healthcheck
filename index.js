require('dotenv').config()
const request = require('request-promise')
const http = require('http')
const fs = require('fs')
const hour_diff = require('date-fns/difference_in_hours')
const compare_asc = require('date-fns/compare_asc')

const template = fs.readFileSync('./html/git_status.html', 'utf-8').split('\n')

let server_started = false

let pullData = []
let counter = 0

const repo = `https://api.github.com/repos/${process.env.REPO}/pulls`

const sort_by_comments_desc = (one, two) => {
  if (one.comments > two.comments) {
    return -1
  } else if (one.comments < two.comments) {
    return 1
  }
  return 0
}

const sort_by_date_desc = (one, two) => {
  let one_date = new Date(one.created_at)
  let two_date = new Date(two.created_at)
  return compare_asc(one_date, two_date)
}

const process_pull_data = (pulls) => {
  const max_comments_pull = pulls.sort(sort_by_comments_desc)[0]
  const oldest = pulls.sort(sort_by_date_desc)[0]
  const total_comments = pulls.reduce((acc, pull) => { return acc + parseInt(pull.comments, 10)}, 0)
  const average = total_comments / pulls.length
  const now = new Date()
  const total_hours = pulls.reduce((acc,  pull) => {return acc + hour_diff(now, pull.created_at)}, 0)
  const ave_age = ((total_hours/pulls.length)/24).toFixed(2)
  const replaced = []

  template.forEach((li) => {
      replaced.push(
        li
          .replace('${repo}', process.env.REPO)
          .replace('${num_open_prs}', pulls.length)
          .replace('${num_ave_age}', ave_age)
          .replace('${most_comments_title}', max_comments_pull.title)
          .replace('${author_most_comments_avi}', max_comments_pull.owner_avatar)
          .replace('${author_most_comments}', max_comments_pull.owner)
          .replace('${most_comments_comments}', max_comments_pull.comments)
          .replace('${oldest_title}', oldest.title)
          .replace('${author_oldest_avi}', oldest.owner_avatar)
          .replace('${author_oldest}', oldest.owner)
          .replace('${oldest_age}', (hour_diff(new Date(), new Date(oldest.created_at))/24).toFixed(2))
      )
    }
  )
  return replaced.join('\n')
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(process_pull_data(pullData));
})

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
  pullData = []
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
          comments: data.comments + data.review_comments,
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

const makeGitHubRequest = () => {
  authRequest(repo)
    .then(res => {
      const pulls = JSON.parse(res)
      getPulls(pulls)
    }).then(() => console.log('Request done'))
}

makeGitHubRequest()

setInterval(makeGitHubRequest, 1 * 60 * 1000)




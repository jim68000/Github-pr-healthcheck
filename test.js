const assert = require('assert');
describe('Healthcheck status', () => {
  describe('Github connector', () => {
    it('should successfully talk to GitHub', () => assert(false))
    it('should receive a valid JSON response from GitHub', () => assert(false))
    it('should retrieve a PR count from GitHub', () => assert(false))
    it('should retrieve a list of PR ages from GitHub', () => assert(false))
    it('should retrieve a list of comment counts from GitHub', () => assert(false))
  })
  describe('Transformations', () => {
    it('should correctly average PR ages', () => assert(false))
    it('should correctly average PR comments', () => assert(false))
    it('should correctly calculate the oldest PR', () => assert(false))
    it('should correctly calculate the highest number of PR comments', () => assert(false))
  })
  describe('Geckoboard connector', () => {
    it('should successfully connect to Geckoboard', () => assert(false))
    it('should provide a PR average age to Geckoboard', () => assert(false))
    it('should provide a PR average comment count to Geckoboard', () => assert(false))
    it('should provide a list of PRs and ages to Geckoboard', () => assert(false))
    it('should provide a list of PRs and comment counts to Geckobioard', () => assert(false))
  })
})
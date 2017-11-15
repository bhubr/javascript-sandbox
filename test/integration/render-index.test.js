const chai          = require('chai');
const should        = chai.should();
const httpMocks     = require('node-mocks-http');
const cheerio       = require('cheerio');
const minify        = require('html-minifier').minify;
const ExampleStore  = require('../../lib/ExampleStore');
const exStore       = new ExampleStore(__dirname + '/test-examples');
const indexHandlers = require('../../lib/indexHandlers')(exStore, __dirname + '/test-examples');

function invokeHandler(url, handler, options) {
  options = options || {};
  method = options.method || 'GET';
  params = options.params || {};

  // Prepare request&response
  const request  = httpMocks.createRequest({
    method, url, params
  });
  const response = httpMocks.createResponse();

  // Invoke route handler, get returned html and load it with cheerio
  handler(request, response);
  const body = response._getData();
  const statusCode = response._getStatusCode();
  const $ = cheerio.load(body);
  return { body, statusCode, $ };
}



describe('render index', () => {


  /**
   * Run before all tests
   */
  before(() => exStore.init());


  /**
   * Index without repo nor example
   */
  it('without selected repo nor example', () => {

    const { statusCode, body, $ } = invokeHandler('/', indexHandlers.getIndexBare);
    statusCode.should.equal(200);
    const inlineJsData = "let window = {};" +
      $('#inline-js-data').html();
    try {
      eval(inlineJsData);
    } catch(e) {
      throw new Error('injected script in #inline-js-data throws an error: "' + e.message + '');
    }

    const $menuRepoItems = $('#menu-repo li');
    $menuRepoItems.length.should.equal(2);
    const repo1Link = $($menuRepoItems[0]).html();
    const repo2Link = $($menuRepoItems[1]).html();
    repo1Link.should.equal('<a href="/example-repo1">Example Repo 1</a>');
    repo2Link.should.equal('<a href="/example-repo2">Example Repo 2</a>');

  });


  /**
   * Index with non-existent repo
   */
  it('without inexistent selected repo', () => {

    const { body, statusCode } = invokeHandler(
      '/wrong',
      indexHandlers.getIndexRepo,
      {
        params: { repoSlug: 'wrong' }
      }
    );
    statusCode.should.equal(404);
    body.should.equal('Repo wrong not found');

  });


  /**
   * Index with existent repo
   */
  it('with selected repo', () => {

    const { $, statusCode } = invokeHandler(
      '/example-repo1',
      indexHandlers.getIndexRepo,
      {
        params: { repoSlug: 'example-repo1' }
      }
    );
    statusCode.should.equal(200);

    const inlineJsData = "let window = {};" +
      $('#inline-js-data').html();
    try {
      eval(inlineJsData);
    } catch(e) {
      throw new Error('injected script in #inline-js-data throws an error: "' + e.message + '');
    }

    const $menuRepoItems = $('#menu-repo li');
    $menuRepoItems.length.should.equal(2);
    const repo1Link = $($menuRepoItems[0]).html();
    const repo2Link = $($menuRepoItems[1]).html();
    repo1Link.should.equal('<a href="/example-repo1">Example Repo 1</a>');
    repo2Link.should.equal('<a href="/example-repo2">Example Repo 2</a>');

    const $menuExampleItems = $('#menu-example div');
    var minifiedMenu = minify($('#menu-example').html(), {
      collapseWhitespace: true
    });
    $menuExampleItems.length.should.equal(2);
    minifiedMenu.should.equal(
      '<div class="pure-u-1 pure-u-md-1-2">Test Stuff<ul><li><a href="/example-repo1/repo1-example1">Test Example</a></li></ul></div>' +
      '<div class="pure-u-1 pure-u-md-1-2">Empty Category<ul></ul></div>'
      );
  });

  /**
   * Index with existent repo and example
   */
  it('with selected repo and example', () => {

    const { $, body, statusCode } = invokeHandler(
      '/example-repo1/repo1-example1',
      indexHandlers.getIndexExample,
      {
        params: {
          repoSlug: 'example-repo1',
          exampleSlug: 'repo1-example1'
        }
      }
    );
    statusCode.should.equal(200);
console.log('body', body);
    const inlineJsData = "let window = {};" +
      $('#inline-js-data').html();
    try {
      eval(inlineJsData);
    } catch(e) {
      throw new Error('injected script in #inline-js-data throws an error: "' + e.message + '');
    }
    console.log('inlineJsData', inlineJsData);

    // const $menuRepoItems = $('#menu-repo li');
    // $menuRepoItems.length.should.equal(2);
    // const repo1Link = $($menuRepoItems[0]).html();
    // const repo2Link = $($menuRepoItems[1]).html();
    // repo1Link.should.equal('<a href="/example-repo1">Example Repo 1</a>');
    // repo2Link.should.equal('<a href="/example-repo2">Example Repo 2</a>');

    // const $menuExampleItems = $('#menu-example div');
    // var minifiedMenu = minify($('#menu-example').html(), {
    //   collapseWhitespace: true
    // });
    // $menuExampleItems.length.should.equal(2);
    // minifiedMenu.should.equal(
    //   '<div class="pure-u-1 pure-u-md-1-2">Test Stuff<ul><li><a href="/example-repo1/repo1-example1">Test Example</a></li></ul></div>' +
    //   '<div class="pure-u-1 pure-u-md-1-2">Empty Category<ul></ul></div>'
    //   );
  });
});
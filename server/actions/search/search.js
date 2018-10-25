import request from 'request';

function requestWithPromise(url) {
  return new Promise((resolve) => {
    request(url, (error, response, body) => {
      resolve(JSON.parse(body));
    });
  });
}

async function searchBower(query) {
  const results = await requestWithPromise(`https://libraries.io/api/bower-search?q=${query}`);

  return results.map(result => ({
    name: result.name,
    version: result.latest_release_number,
    score: result.stars,
    url: result.repository_url,
    description: result.description,
  }));
}

async function searchNPM(query) {
  const { results } = await requestWithPromise(`https://api.npms.io/v2/search?from=0&size=25&q=${query}`);

  return results.map(result => ({
    name: result.package.name,
    version: result.package.version,
    score: result.score.final,
    url: result.package.links.repository,
    description: result.package.description,
  }));
}

const methodsFor = {
  bower: searchBower,
  npm: searchNPM,
};

export async function search(req, res) {
  const results = await methodsFor[req.params.repoName](req.body.query);
  res.json(results);
}

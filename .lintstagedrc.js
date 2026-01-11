module.exports = {
  // Lint & Prettify TS and JS files
  '**/*.(ts|tsx|js)': () => ['npm run lint:fix', 'npm run prettier:fix'],

  // Prettify only markdown and json files
  '**/*.(md|json)': () => ['npm run prettier:fix']
};

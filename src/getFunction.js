const getFunctionAggregation = require('function-name-export');

function getFunction(body) {
  const document = body.document;

  const content = document.getText();
  const languageId = document.languageId;

  if (['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'vue'].indexOf(languageId) > -1) {
    let result = getFunctionAggregation(content);

    return result;
  }

  return [];
}

module.exports = getFunction;
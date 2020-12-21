// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const {
  FEProvider
} = require('./src/FunctionExport');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "function-export" is now active!');

  let jumpToLine = vscode.commands.registerCommand('functionExport.jumpToLine', function(line=1) {
    const editor = vscode.window.activeTextEditor;
    const range = new vscode.Range(line - 1, 0, line, 0);
    editor.revealRange(range, 1);
  })

  // vscode.window.createTreeView('functionExport', {
  //   treeDataProvider: new FEProvider()
  // })
  const treeDataProvider = new FEProvider();
  
  vscode.window.registerTreeDataProvider(
    'functionExport',
    treeDataProvider
  );

  const TreeViewRefresh = vscode.commands.registerCommand("functionExportTreeView.refresh", function () {
    treeDataProvider.refresh();
  });
  
  vscode.window.onDidChangeActiveTextEditor(() => {
    // console.log('change active editor');
    vscode.commands.executeCommand('functionExportTreeView.refresh')
  });

  context.subscriptions.push(TreeViewRefresh, jumpToLine);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

const vscode = require('vscode');
const getFunction = require('./getFunction');
const path = require('path');

class FEProvider {
  constructor() {
    this.eventEmitter = new vscode.EventEmitter();
    this.onDidChangeTreeData = this.eventEmitter.event;
  }

  refresh() {
    this.eventEmitter.fire();
  }

  getTreeItem(element) {
    // console.log(element);
    return element;
  }

  getChildren(element) {
    // console.log(element, '---->');
    if (element && element.children) {
      let child = {};
      return element.children.map(item => {
        child = {
          label: item.name,
          description: item.line,
          command: item.command,
          collapsibleState: false,
          isChildNode: true
        }
        return new FunctionExport(child);
      }) || [];
    } else {
      const editor = vscode.window.activeTextEditor;
      let result = [];
      if (editor) {
        result = getFunction(editor);
      }
      const children = result.map(item => {
        const options = {
          label: item.name,
          description: item.line,
          command: {
            "command": 'functionExport.jumpToLine',
            "title": "Function Export Jump To Line",
            "arguments": [item.line]
          },
          collapsibleState: item.status,
          children: item.status ? item.calledAggregation.map(ca => {
            ca.command = {
              "command": 'functionExport.jumpToLine',
              "title": "Function Export Jump To Line",
              "arguments": [ca.line]
            };
            return ca;
          }) : []
        };
        // console.log(options);
        return new FunctionExport(options);
      })
      return children;
    }
  }
}

class FunctionExport {
  constructor({
      label,
      description,
      command,
      children,
      collapsibleState,
      isChildNode
    }) {
    this.label = label;
    // description must be a string
    this.description = description + '';

    if (collapsibleState) {
      this.collapsibleState = collapsibleState;
      this.children = children;
    }

    this.command = command;
    this.tooltip = `${label}-${description}`;

    this.iconPath = {
      light: path.join(__filename, '..', '..', 'resources', isChildNode ? 'node.svg' : 'function.svg'),
      dark: path.join(__filename, '..', '..', 'resources', isChildNode ? 'node.svg' : 'function.svg')
    };

    this.contextValue = 'functionExport';

    // console.log(this);

  }

}

module.exports = {
  FEProvider,
  FunctionExport
}
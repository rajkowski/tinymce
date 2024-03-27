export type NamespaceType = 'html' | 'svg' | 'math';

export interface NamespaceTracker {
  readonly track: (node: Node) => NamespaceType;
  readonly current: () => NamespaceType;
  readonly reset: () => void;
}

const nodeNameToNamespaceType = (name: string) => {
  const lowerCaseName = name.toLowerCase();

  if (lowerCaseName === 'svg') {
    return 'svg';
  } else if (lowerCaseName === 'math') {
    return 'math';
  } else {
    return 'html';
  }
};

export const isNonHtmlElementRootName = (name: string): boolean => nodeNameToNamespaceType(name) !== 'html';

export const isNonHtmlElementRoot = (node: Node): boolean => isNonHtmlElementRootName(node.nodeName);

export const toScopeType = (node: Node | undefined): NamespaceType => nodeNameToNamespaceType(node?.nodeName ?? 'html');

export const namespaceElements = [ 'svg', 'mathml' ];

export const createNamespaceTracker = (): NamespaceTracker => {
  let scopes: Node[] = [];

  const peek = () => scopes[scopes.length - 1];

  const track = (node: Node): NamespaceType => {
    if (isNonHtmlElementRoot(node)) {
      scopes.push(node);
    }

    let currentScope: Node | undefined = peek();
    if (currentScope && !currentScope.contains(node)) {
      scopes.pop();
      currentScope = peek();
    }

    return toScopeType(currentScope);
  };

  const current = () => toScopeType(peek());

  const reset = () => {
    scopes = [];
  };

  return {
    track,
    current,
    reset
  };
};

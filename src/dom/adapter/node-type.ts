export type NodeTypeLabel = 'ELEMENT' |
  'ATTRIBUTE' |
  'TEXT' |
  'CDATA_SECTION' |
  'PROCESSING_INSTRUCTION' |
  'COMMENT' |
  'DOCUMENT' |
  'DOCUMENT_TYPE' |
  'DOCUMENT_FRAGMENT';


export const NodeType = new Map<number, NodeTypeLabel>([
  [ 1, 'ELEMENT' ],
  [ 2, 'ATTRIBUTE' ],
  [ 3, 'TEXT' ],
  [ 4, 'CDATA_SECTION' ],
  [ 7, 'PROCESSING_INSTRUCTION' ],
  [ 8, 'COMMENT' ],
  [ 9, 'DOCUMENT' ],
  [ 10, 'DOCUMENT_TYPE' ],
  [ 11, 'DOCUMENT_FRAGMENT' ],
]);


interface WithNodeType {
  nodeType: number;
}


export const nodeType = (node: WithNodeType): NodeTypeLabel => {
  return NodeType.get(node.nodeType) || NodeType.get(3)!
}

export const isElement = (node: WithNodeType): boolean => {
  return NodeType.get(node.nodeType) === 'ELEMENT';
}

export const isText = (node: WithNodeType): boolean => {
  return NodeType.get(node.nodeType) === 'TEXT';
}

export default NodeType;
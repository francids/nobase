export interface Document {
  id: string;
  [key: string]: any;
}

export interface CollectionSchema {
  [key: string]: 'string' | 'number' | 'boolean' | 'object' | 'array';
}

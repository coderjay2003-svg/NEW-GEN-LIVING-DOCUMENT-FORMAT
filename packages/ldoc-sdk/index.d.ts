/**
 * @ldoc/sdk — TypeScript Definitions for Living Document (.ldocx) SDK
 * Copyright (c) 2026 J-AI-ENTERPRISES. Licensed under Apache-2.0.
 */

export const SCHEMA_VERSION: string;

export interface LDocManifest {
  format: 'ldocx';
  schema_version: string;
  title: string;
  created_at: string;
  author?: string;
  description?: string;
  tags?: string[];
  cover_image?: string;
}

export type LDocBlockType =
  | 'heading'
  | 'paragraph'
  | 'quote'
  | 'list'
  | 'code'
  | 'table'
  | 'form'
  | 'button'
  | 'web_image'
  | 'web_audio'
  | 'web_video'
  | '3d_model'
  | 'feature_grid'
  | 'live_feed'
  | 'preorder'
  | 'jsx_canvas'
  | 'quantum_sim'
  | 'balance_tuner'
  | 'throttle_dyno'
  | 'orbit_sim'
  | 'arr_projector'
  | 'spell_matrix';

export interface LDocBlock {
  id: string;
  type: LDocBlockType;
  title?: string;
  value?: string;
  text?: string;
  level?: number;
  language?: string;
  code?: string;
  src?: string;
  mesh_template?: 'atomic_lattice' | 'snitch' | 'satellite' | 'car' | 'tourbillon';
  format?: 'glb' | 'gltf' | 'obj' | 'stl' | '3mf';
  fields?: Array<{ label: string; field_type: string; placeholder?: string }>;
  metrics?: Array<{ label: string; val: string; sub?: string }>;
  cards?: Array<{ badge: string; title: string; desc: string }>;
  style?: Record<string, any>;
  [key: string]: any;
}

export interface LDocPage {
  id: string;
  title: string;
  blocks: LDocBlock[];
}

export interface LDocAST {
  title: string;
  description?: string;
  version?: string;
  theme?: string;
  pages: LDocPage[];
  metadata?: Record<string, any>;
}

export interface ValidationResult {
  valid: boolean;
  schema_version: string;
  errors: string[];
}

export function validate(ast: LDocAST): ValidationResult;
export function calculateChecksum(data: string | Buffer | Uint8Array): string;
export function parse(fileInput: string | Buffer | Uint8Array | Blob): Promise<LDocAST>;
export function serialize(ast: LDocAST, assetsMap?: Record<string, any>): Promise<Buffer | Uint8Array>;

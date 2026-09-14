/**
 * @ldoc/sdk v3.0.0 TypeScript Type Definitions
 */

export interface BlockA11y {
  alt?: string;
  aria_label?: string;
  screen_reader_summary?: string;
}

export interface BlockProvenance {
  author_type: 'human' | 'ai' | 'collaborative';
  agent_id?: string;
  timestamp: string;
  confidence?: number;
  prompt_digest?: string;
}

export interface LdocBlock {
  id: string;
  type: string;
  content?: string;
  text?: string;
  data?: any;
  name?: string;
  inputs?: string[];
  formula?: string;
  value?: any;
  a11y?: BlockA11y;
  provenance?: BlockProvenance;
  props?: Record<string, any>;
  capabilities?: string[];
}

export interface LdocPage {
  id: string;
  title?: string;
  blocks: LdocBlock[];
}

export interface MerkleIntegrity {
  algorithm: string;
  merkle_root: string;
  total_leaves: number;
  block_leaves: Record<string, string>;
  page_leaves: Record<string, string>;
  computed_at: string;
}

export interface IntegrityVerificationResult {
  valid: boolean;
  merkle_root: string;
  expected_root: string;
  tampered_blocks: string[];
  verified_blocks: string[];
  tamper_count: number;
  verified_count: number;
  reason?: string;
}

export interface LdocAST {
  id?: string;
  title: string;
  schema_version: string;
  metadata?: Record<string, any>;
  pages: LdocPage[];
  integrityStatus?: IntegrityVerificationResult;
}

export const SCHEMA_VERSION: string;

export function canonicalStringify(obj: any): string;
export function sha256Hex(data: string | Buffer): string;
export function computeBlockLeaf(block: LdocBlock): string;
export function computeDocumentMerkle(ast: LdocAST): MerkleIntegrity;
export function verifyDocumentIntegrity(ast: LdocAST, recorded: MerkleIntegrity): IntegrityVerificationResult;

export function annotateBlockProvenance(block: LdocBlock, opts: {
  author_type?: 'human' | 'ai' | 'collaborative';
  agent_id?: string;
  prompt?: string;
  confidence?: number;
}): LdocBlock;

export function queryBlocksByProvenance(ast: LdocAST, filter?: {
  author_type?: string;
  agent_id?: string;
}): Array<{ page_id: string; block: LdocBlock }>;

export function getDocumentProvenanceStats(ast: LdocAST): {
  total_blocks: number;
  human_authored: number;
  ai_authored: number;
  collaborative: number;
  ai_percentage: number;
  active_agents: string[];
};

export function evaluateReactiveGraph(ast: LdocAST, initialContext?: Record<string, any>): {
  executionOrder: string[];
  results: Record<string, any>;
  context: Record<string, any>;
};

export function renderFallbackHtml(ast: LdocAST): string;

export function getSandboxPolicy(block: LdocBlock): {
  sandbox_attributes: string;
  content_security_policy: string;
  capabilities: string[];
  isolated: boolean;
};

export function validate(ast: any): { valid: boolean; schema_version: string; errors: string[] };

export function parse(fileInput: any): Promise<LdocAST>;
export function serialize(ast: LdocAST, assetsMap?: Record<string, any>): Promise<Buffer | Uint8Array>;

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

export interface LayoutLine {
  text: string;
  width: number;
  x?: number;
  y?: number;
  height?: number;
  availableWidth?: number;
}

export interface BlockLayoutResult {
  width: number;
  height: number;
  lineCount: number;
  lines: LayoutLine[];
  naturalWidth?: number;
  lineHeight?: number;
}

export interface ExclusionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExclusionFlowResult {
  lines: LayoutLine[];
  lineCount: number;
  totalHeight: number;
}

export interface TextLayoutEngine {
  version: string;
  prepare(text: string, font: string, options?: any): any;
  prepareWithSegments(text: string, font: string, options?: any): any;
  layout(prepared: any, maxWidth: number, lineHeight: number): { height: number; lineCount: number };
  layoutWithLines(prepared: any, maxWidth: number, lineHeight: number): BlockLayoutResult;
  layoutNextLine(prepared: any, cursor: any, maxWidth: number): any;
  layoutNextLineRange(prepared: any, cursor: any, maxWidth: number): any;
  materializeLineRange(prepared: any, lineRange: any): any;
  measureNaturalWidth(prepared: any): number;
  measureLineStats(prepared: any, maxWidth: number): { lineCount: number; maxLineWidth: number };
  setLocale(locale?: string): void;
  detectScript(text: string): { script: string; locale: string; direction: string };
  autoSetLocale(text: string): { script: string; locale: string; direction: string };
  fitFontSize(blockOrText: any, width: number, height: number, options?: any): { fontSize: number; lineHeight: number; lineCount: number; height: number; fits: boolean; font: string };
  prepareRichInline(spans: any[]): any;
  measureRichInlineStats(preparedRich: any, maxWidth: number): { lineCount: number; maxLineWidth: number };
  layoutRichInline(textOrSpans: any, maxWidth: number, lineHeight?: number, options?: any): any;
  renderRichInlineHTML(textOrSpans: any, maxWidth: number, lineHeight?: number, options?: any): string;
  clearCache(): void;
  measureBlock(block: LdocBlock, width?: number, options?: any): BlockLayoutResult;
  flowAroundExclusion(text: string, font: string, containerWidth: number, exclusionRects: ExclusionRect | ExclusionRect[], lineHeight?: number, options?: any): ExclusionFlowResult;
  formatBlockStyle(block: LdocBlock, layoutResult: BlockLayoutResult): string;
}

export const LdocTextLayout: TextLayoutEngine;
export function measureBlock(block: LdocBlock, width?: number, options?: any): BlockLayoutResult;
export function flowAroundExclusion(text: string, font: string, containerWidth: number, exclusionRects: ExclusionRect | ExclusionRect[], lineHeight?: number, options?: any): ExclusionFlowResult;
export function fitFontSize(blockOrText: any, width: number, height: number, options?: any): { fontSize: number; lineHeight: number; lineCount: number; height: number; fits: boolean; font: string };
export function layoutRichInline(textOrSpans: any, width: number, lineHeight?: number, options?: any): any;

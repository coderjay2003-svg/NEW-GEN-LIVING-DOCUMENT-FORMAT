#!/usr/bin/env node
/**
 * @ldoc/sdk CLI — Developer Command-Line Utility for Living Documents (.ldocx)
 * Copyright (c) 2026 J-AI-ENTERPRISES. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0.
 * Trademarks "LDOC", "LDOCX", and "Living Document Format" are proprietary to J-AI-ENTERPRISES.
 */

const fs = require('fs');
const path = require('path');
const sdk = require('../index.js');

const pkg = require('../package.json');
const VERSION = pkg.version || sdk.SCHEMA_VERSION || '2.5.0';

const BANNER = `
===========================================================
  LDOC Developer CLI — Living Document (.ldocx) Suite
  Version ${VERSION} | J-AI-ENTERPRISES (c) 2026
===========================================================
`;

function printHelp() {
  console.log(BANNER);
  console.log(`Usage: ldocx <command> [options]

Commands:
  validate <file.ldocx>       Validate document AST, schema, and checksum integrity
  parse <file.ldocx>          Inspect Living Document pages, blocks, and 3D assets
  new [title] [filename]      Generate a fresh starter Living Document (.ldocx)
  test                        Run the @ldoc/sdk automated test suite
  info                        Display SDK runtime environment, paths, and schema info
  version, -v, --version      Display installed version and company information
  help, -h, --help            Show this help reference

Examples:
  ldocx validate my-doc.ldocx
  ldocx parse my-doc.ldocx
  ldocx new "Quantum Computing Blueprint" quantum.ldocx
  ldocx test
`);
}

function printVersion() {
  console.log(`@ldoc/sdk v${VERSION}`);
  console.log(`Schema Version: ${sdk.SCHEMA_VERSION}`);
  console.log(`Copyright (c) 2026 J-AI-ENTERPRISES. All Rights Reserved.`);
  console.log(`Format: Living Document (.ldoc, .ldocx)`);
}

function printInfo() {
  console.log(BANNER);
  console.log(`SDK Information:`);
  console.log(`  Package:          ${pkg.name}`);
  console.log(`  Version:          ${VERSION}`);
  console.log(`  Schema Version:   ${sdk.SCHEMA_VERSION}`);
  console.log(`  License:          ${pkg.license}`);
  console.log(`  Author:           ${pkg.author}`);
  console.log(`  Node.js:          ${process.version}`);
  console.log(`  Platform:         ${process.platform} (${process.arch})`);
  console.log(`  Install Path:     ${path.resolve(__dirname, '..')}`);
  console.log(`  Main Entry:       ${path.resolve(__dirname, '../index.js')}`);
}

async function runValidate(filePath) {
  if (!filePath) {
    console.error('Error: Please specify the path to a .ldocx file to validate.');
    console.error('Usage: ldocx validate <path/to/document.ldocx>');
    process.exit(1);
  }

  const absPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absPath)) {
    console.error(`Error: File not found: "${absPath}"`);
    process.exit(1);
  }

  console.log(`Validating: ${path.basename(absPath)}...`);
  try {
    const fileBuffer = fs.readFileSync(absPath);
    const ast = await sdk.parse(fileBuffer);
    const valResult = sdk.validate(ast);

    if (valResult.valid) {
      console.log(`\n[PASS] Document passed validation!`);
      console.log(`  Title:         ${ast.title}`);
      console.log(`  Schema:        v${valResult.schema_version}`);
      console.log(`  Pages:         ${ast.pages ? ast.pages.length : 0}`);
      
      let blockCount = 0;
      const blockTypes = {};
      if (Array.isArray(ast.pages)) {
        ast.pages.forEach(p => {
          if (Array.isArray(p.blocks)) {
            blockCount += p.blocks.length;
            p.blocks.forEach(b => {
              blockTypes[b.type] = (blockTypes[b.type] || 0) + 1;
            });
          }
        });
      }
      console.log(`  Total Blocks:  ${blockCount}`);
      console.log(`  Block Types:   ` + Object.entries(blockTypes).map(([k, v]) => `${k} (${v})`).join(', '));
      console.log(`  Size:          ${(fileBuffer.length / 1024).toFixed(2)} KB`);
    } else {
      console.error(`\n[FAIL] Validation failed with errors:`);
      valResult.errors.forEach((err, idx) => {
        console.error(`  ${idx + 1}. ${err}`);
      });
      process.exit(1);
    }
  } catch (err) {
    console.error(`\n[ERROR] Could not parse or validate document: ${err.message}`);
    process.exit(1);
  }
}

async function runParse(filePath) {
  if (!filePath) {
    console.error('Error: Please specify a .ldocx file.');
    console.error('Usage: ldocx parse <path/to/document.ldocx>');
    process.exit(1);
  }

  const absPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absPath)) {
    console.error(`Error: File not found: "${absPath}"`);
    process.exit(1);
  }

  try {
    const fileBuffer = fs.readFileSync(absPath);
    const ast = await sdk.parse(fileBuffer);

    console.log(BANNER);
    console.log(`DOCUMENT AST: ${ast.title}`);
    console.log(`-----------------------------------------------------------`);
    console.log(`Schema Version: ${ast.schema_version || '2.5.0'}`);
    console.log(`Pages (${ast.pages ? ast.pages.length : 0}):\n`);

    if (Array.isArray(ast.pages)) {
      ast.pages.forEach((page, pIdx) => {
        console.log(`  Page ${pIdx + 1}: "${page.title || 'Untitled'}" [id: ${page.id}]`);
        if (Array.isArray(page.blocks)) {
          page.blocks.forEach((blk, bIdx) => {
            const extra = blk.text ? ` - "${blk.text.slice(0, 40)}..."` : (blk.mesh_template ? ` (mesh: ${blk.mesh_template})` : '');
            console.log(`    [${bIdx + 1}] Type: ${blk.type}${extra}`);
          });
        }
        console.log('');
      });
    }
  } catch (err) {
    console.error(`Parse error: ${err.message}`);
    process.exit(1);
  }
}

async function runNew(docTitle, outFileName) {
  const title = docTitle || 'New Living Document';
  const fileName = outFileName || (title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.ldocx');
  const targetPath = path.resolve(process.cwd(), fileName);

  console.log(`Creating starter Living Document: "${title}"...`);

  const sampleAst = {
    title: title,
    schema_version: sdk.SCHEMA_VERSION,
    metadata: {
      author: "LDOC Developer SDK",
      company: "J-AI-ENTERPRISES",
      created_at: new Date().toISOString()
    },
    pages: [
      {
        id: "page_1",
        title: "Overview and Interactive Blueprint",
        blocks: [
          {
            id: "blk_1",
            type: "heading",
            level: 1,
            text: title
          },
          {
            id: "blk_2",
            type: "text",
            text: "This Living Document was generated using the official @ldoc/sdk CLI from J-AI-ENTERPRISES."
          },
          {
            id: "blk_3",
            type: "3d_model",
            mesh_template: "atomic_lattice",
            title: "FCC Atomic Lattice"
          },
          {
            id: "blk_4",
            type: "quantum_sim",
            title: "Real-Time Superposition State"
          }
        ]
      }
    ]
  };

  try {
    const buffer = await sdk.serialize(sampleAst);
    fs.writeFileSync(targetPath, buffer);
    console.log(`✓ Successfully created: ${path.basename(targetPath)} (${(buffer.length / 1024).toFixed(2)} KB)`);
    console.log(`  Target: ${targetPath}`);
    console.log(`\nYou can open this file in LDOC Viewer, LDOC Editor, or LDOC Studio!`);
  } catch (err) {
    console.error(`Failed to create document: ${err.message}`);
    process.exit(1);
  }
}

async function runTest() {
  console.log(BANNER);
  const testScriptPath = path.resolve(__dirname, '../test.js');
  if (fs.existsSync(testScriptPath)) {
    require(testScriptPath);
  } else {
    console.error('test.js not found at:', testScriptPath);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0] ? args[0].toLowerCase() : 'help';

  switch (cmd) {
    case 'validate':
      await runValidate(args[1]);
      break;
    case 'parse':
      await runParse(args[1]);
      break;
    case 'new':
      await runNew(args[1], args[2]);
      break;
    case 'test':
      await runTest();
      break;
    case 'info':
      printInfo();
      break;
    case 'version':
    case '-v':
    case '--version':
      printVersion();
      break;
    case 'help':
    case '-h':
    case '--help':
    default:
      if (cmd !== 'help' && cmd !== '-h' && cmd !== '--help') {
        console.warn(`Unknown command: "${cmd}"\n`);
      }
      printHelp();
      break;
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

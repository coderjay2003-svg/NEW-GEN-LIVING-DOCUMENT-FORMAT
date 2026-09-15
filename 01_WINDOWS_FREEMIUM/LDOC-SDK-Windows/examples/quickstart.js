// Quickstart Example: Parse and Validate an .ldocx document
const fs = require('fs');
const path = require('path');
const { parse, serialize, validate } = require('../index.js');

async function main() {
  console.log('--- LDOC SDK Quickstart ---');
  const samplePath = path.join(__dirname, 'ldoc-showcase.ldocx');
  
  if (fs.existsSync(samplePath)) {
    const buffer = fs.readFileSync(samplePath);
    const doc = await parse(buffer);
    console.log('Successfully parsed document:', doc.title || 'Untitled');
    console.log('Total pages:', doc.pages ? doc.pages.length : 0);
    
    const val = validate(doc);
    console.log('Schema validation valid:', val.valid);
  }
}

main().catch(console.error);

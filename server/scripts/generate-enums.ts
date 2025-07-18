// scripts/generate-enums.ts
const fs = require("fs");
const path = require("path");

// Resolve the path to schema.prisma relative to this script
const schemaPath = path.join(__dirname, "../prisma/schema.prisma");
const outputDir = path.join(__dirname, "../../shared/types");
const outputPath = path.join(outputDir, "prisma-enums.ts");

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const schema = fs.readFileSync(schemaPath, "utf-8");
const enumRegex = /enum (\w+) \{([^}]+)\}/g;

let match;
let output = "";

while ((match = enumRegex.exec(schema)) !== null) {
  const [_, enumName, valuesBlock] = match;
  const values = valuesBlock
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((val) => `${val} = \"${val}\"`)
    .join(",\n  ");
  output += `export enum ${enumName} {\n  ${values}\n}\n\n`;
}

fs.writeFileSync(outputPath, output);
console.log("Enums generated at " + outputPath);

const fs = require('fs');
const yaml = require('js-yaml');

// Function to load a YAML file
function loadYaml(filePath) {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return yaml.load(fileContents);
    } catch (e) {
        console.log(`Error reading file: ${filePath}`, e);
        process.exit(1);
    }
}

// Function to check if dev keys exist in prod and dr and are not empty
function compareFiles(devData, prodData, drData) {
    const missingKeysInProd = [];
    const missingKeysInDr = [];
    const emptyValuesInProd = [];
    const emptyValuesInDr = [];

    for (const key in devData) {
        if (!(key in prodData)) {
            missingKeysInProd.push(key);
        } else if (prodData[key] === '' || prodData[key] === null) {
            emptyValuesInProd.push(key);
        }

        if (!(key in drData)) {
            missingKeysInDr.push(key);
        } else if (drData[key] === '' || drData[key] === null) {
            emptyValuesInDr.push(key);
        }
    }

    return { missingKeysInProd, missingKeysInDr, emptyValuesInProd, emptyValuesInDr };
}

// Load YAML files
const devYaml = loadYaml('values-dev.yaml');
const prodYaml = loadYaml('values-prod.yaml');
const drYaml = loadYaml('values-dr.yaml');

// Compare dev values with prod and dr
const result = compareFiles(devYaml, prodYaml, drYaml);

// Output results
if (result.missingKeysInProd.length > 0) {
    console.log('Missing keys in Prod:', result.missingKeysInProd.join(', '));
} else {
    console.log('All keys from Dev are present in Prod.');
}

if (result.emptyValuesInProd.length > 0) {
    console.log('Keys with empty values in Prod:', result.emptyValuesInProd.join(', '));
} else {
    console.log('No empty values in Prod.');
}

if (result.missingKeysInDr.length > 0) {
    console.log('Missing keys in DR:', result.missingKeysInDr.join(', '));
} else {
    console.log('All keys from Dev are present in DR.');
}

if (result.emptyValuesInDr.length > 0) {
    console.log('Keys with empty values in DR:', result.emptyValuesInDr.join(', '));
} else {
    console.log('No empty values in DR.');
}

const fs = require('fs');
const path = require('path');

// Custom function to parse YAML
function parseYaml(yamlStr) {
    let result = {};
    let lines = yamlStr.split('\n');
    for (let line of lines) {
        let parts = line.split(':');
        if (parts.length === 2) {
            result[parts[0].trim()] = parts[1].trim();
        }
    }
    return result;
}

// Custom function to stringify YAML
function stringifyYaml(obj) {
    let yamlStr = '';
    for (let key in obj) {
        yamlStr += `${key}: ${obj[key]}\n`;
    }
    return yamlStr;
}

// Read the images.json file
fs.readFile('images.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // Parse the JSON data
    let images = JSON.parse(data);

    // Loop through each module
    for (let module in images.image) {
        let imageValue = images.image[module];

        // Construct the path to the module directory inside helm-charts
        let moduleDirPath = path.join('helm-charts', module);

        // Get the list of all values-<env>.yaml files in the module directory
        fs.readdir(moduleDirPath, (err, files) => {
            if (err) {
                console.error(err);
                return;
            }

            // Filter the list to include only values-<env>.yaml files
            let yamlFiles = files.filter(file => file.startsWith('values') && file.endsWith('.yaml'));

            // Loop through each values-<env>.yaml file
            yamlFiles.forEach(yamlFile => {
                // Construct the path to the values-<env>.yaml file
                let yamlFilePath = path.join(moduleDirPath, yamlFile);

                // Read the values-<env>.yaml file
                fs.readFile(yamlFilePath, 'utf8', (err, yamlData) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // Parse the yaml data
                    let doc = parseYaml(yamlData);

                    // Update the image value in the yaml data
                    doc.image = imageValue;

                    // Convert the updated yaml data back into a string
                    let updatedYaml = stringifyYaml(doc);

                    // Write the updated yaml string back to the values-<env>.yaml file
                    fs.writeFile(yamlFilePath, updatedYaml, 'utf8', (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }

                        console.log(`${yamlFilePath} has been updated with the new image value.`);
                    });
                });
            });
        });
    }
});

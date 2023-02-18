const fs = require('fs');
const { cwd } = require('process');
const csvFiles = fs
    .readdirSync(cwd(), { encoding: 'utf-8' })
    .filter((fileName) => fileName.includes('.csv'));

csvFiles.forEach((fileName) => {
    csvToJson(fileName, fileName.replace('.csv', '.json'));
});

function csvToJson(csvFilePath, jsonFilePath) {
    /* reading csv file */
    let csv = fs.readFileSync(csvFilePath, {
        encoding: 'utf-8',
    });

    /* splitting by new line and comma */
    csv = csv.trim().split('\n');
    csv = csv.map((row) => row.split(','));

    /* converting to json */
    const jsonArray = [];
    for (let i = 1; i < csv.length; i++) {
        jsonArray.push({
            id: +csv[i][0],
            date: csv[i][1],
            close: +csv[i][2],
            high: +csv[i][3],
            low: +csv[i][4],
            open: +csv[i][5],
        });
    }

    /* create json file */
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray));
}

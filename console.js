const { Adapter } = require('./src/elastic/elastic')
const process = require('process');

const adapter = new Adapter();
const command = process.argv[2];

function adapt(argv) {
    const query = argv[3];
    const pretty = argv[4];
    const adapted = adapter.adaptFilters(JSON.parse(query));

    if (pretty) {
        process.stdout.write(JSON.stringify(adapted, null, 2));
    } else {
        process.stdout.write(JSON.stringify(adapted));
    }

    process.stdout.write('\n');
}

function showAllowedCommands() {
    process.stdout.write(`Allowed commands: \n`);
    process.stdout.write(`\tadapt {queryObject} {isPretty} \n`);
}

switch (command) {
    case 'adapt':
        adapt(process.argv)
        break;
    default:
        showAllowedCommands()
        break
}

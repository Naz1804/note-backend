const { createUsersTable } = require('../models/User');
const { createNotesTable } = require('../models/Note');

async function setup() {
    await createUsersTable();
    await createNotesTable();
    console.log('Done!');
    process.exit(0);
}

setup();
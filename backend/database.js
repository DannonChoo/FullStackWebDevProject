const { Client } = require('pg');

const CONNECTION_STRING = 'postgres://ajpxdykx:Jyy5a_QYCGP8nFXjrqP3psDgBuflrm-v@john.db.elephantsql.com:5432/ajpxdykx';

function connect() {
    const client = new Client({
        connectionString: CONNECTION_STRING,
    });
    client.connect();
    return client;  
}

function resetTable () {
    const client = connect();
    const query = `
        DROP TABLE IF EXISTS adOptions;
        CREATE TABLE adOptions (
            id SERIAL PRIMARY KEY,
            optionId INTEGER UNIQUE,
            companyId INTEGER,
            audienceCount INTEGER,
            cost INTEGER
        );
    `
    client.query(query, (err, res) => {
        console.log(err, res)
        client.end()
    })
}

module.exports = {
    resetTable
}
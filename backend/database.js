const { Client } = require('pg');

const CONNECTION_STRING = 'postgres://ajpxdykx:Jyy5a_QYCGP8nFXjrqP3psDgBuflrm-v@john.db.elephantsql.com:5432/ajpxdykx';

function connect() {
    const client = new Client({
        connectionString: CONNECTION_STRING,
    });
    client.connect();
    return client;  
};

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
    `;
    client.query(query, (err, res) => {
        console.log(err, res);
        client.end();
    });
};

function insertOptions(options, callback) {
    let i = 1;
    const template = options.map((option) => `($${i++}, $${i++}, $${i++}, $${i++})`).join(',');
    const values = options.reduce((reduced, option) => [...reduced, option.optionId, option.companyId, option.audienceCount, option.cost], []);
    const query = `INSERT INTO adOptions (optionId, companyId, audienceCount, cost) VALUES ${template}`;
    
    const client = connect();
    client.query(query, values, (err, result) => {
        callback(err, result);
        client.end();
    });
};

function getOptions(companyId, audienceCount, page = 0, pageSize = 10, callback) {
    let whereClause;
    let i = 1;
    const values = [];
    if (!companyId && !audienceCount) whereClause = '';
    else {
        whereClause = 'WHERE ';
        if (companyId) {
            whereClause += `companyId = $${i++}`;
            values.push(parseInt(companyId));
        };
        if (audienceCount) {  
            whereClause += (companyId) ? ` AND audienceCount > $${i++}` : `audienceCount > $${i++}`; 
            values.push(parseInt(audienceCount));
        }
    }

    let limitOffsetClause = `LIMIT $${i++} OFFSET $${i++}`;
    values.push(parseInt(pageSize)); //limit = page size
    values.push(parseInt(page) * parseInt(pageSize)); // offset = page * pageSize
    const query = `SELECT * FROM adOptions ${whereClause} ${limitOffsetClause}`;

    const client = connect();
    client.query(query, values, function(err, {rows}) {
        client.end();
        callback(err, rows);
    })
}
module.exports = {
    resetTable,
    insertOptions,
    getOptions
}
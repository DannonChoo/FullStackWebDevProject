const { Client } = require('pg');

const CONNECTION_STRING = 'postgres://ajpxdykx:Jyy5a_QYCGP8nFXjrqP3psDgBuflrm-v@john.db.elephantsql.com:5432/ajpxdykx';

function connect() {
    const client = new Client({
        connectionString: CONNECTION_STRING,
    });
    client.connect();
    return client;
};

function resetTable() {
    const client = connect();
    const query = `
        DROP TABLE IF EXISTS adOptions;
        CREATE TABLE adOptions (
            id SERIAL PRIMARY KEY,
            optionId BIGINT UNIQUE NOT NULL,
            companyId BIGINT NOT NULL,
            audienceCount INTEGER NOT NULL,
            cost INTEGER NOT NULL
        );
    `;
    client.query(query, (err, res) => {
        console.log(err, res);
        client.end();
    });
};

async function insertOptions(options) {
    if (options.length == 0) {
        console.log("empty");
        throw {'message': 'Cannot Insert Empty Array.', 'status': 400};
    }
    let i = 1;
    const template = options.map((option) => `($${i++}, $${i++}, $${i++}, $${i++})`).join(',');
    const values = options.reduce((reduced, option) => [...reduced, option.optionId, option.companyId, option.audienceCount, option.cost], []);
    const query = `INSERT INTO adOptions (optionId, companyId, audienceCount, cost) VALUES ${template}`;

    const client = connect();

    try {
        result = await client.query(query, values);
        client.end(); 
        return result;
    }
    catch (err) {
        throw err;
    }
}

async function getOptions(companyId, audienceCount, page = 0, pageSize = 20) {
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
    const query = `SELECT *, COUNT(*) OVER() AS noOfRows FROM adOptions ${whereClause} ${limitOffsetClause}`;

    const client = connect();

    try {
        result = await client.query(query, values);
        client.end();
        const {rows} = result;
        console.log(rows);
        return rows;
    }
    catch (err) {
        throw err;
    }
}

async function getBasicComputationInfo(options) {
    if (options.length == 0) {
        throw {'message': 'Cannot Insert Empty Array.', 'status': 400};
    }

    let optionParams = options.map((item, index) => {return '$' + (index+1)});

    const query = 'SELECT optionid, cost, audiencecount FROM adOptions WHERE optionid IN (' + optionParams.join(',') + ')';

    const client = connect();

    try {
        result = await client.query(query, options);
        client.end();
        const { rows } = result;
        if (options.length < 2) {
            throw {'message': 'Minimum 2 IDs', 'status': 400};
        }
        if (rows.length < options.length) {
            console.log("Id no exist");
            throw {'message': 'one or more ID(s) does not exists', 'status': 400};
        }
        return rows;
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    resetTable,
    getOptions,
    getBasicComputationInfo,
    insertOptions,
}
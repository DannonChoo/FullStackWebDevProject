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

function insertOptions(options, callback) {
    if (options.length == 0) {
        return callback({'message': 'Cannot Insert Empty Array.', 'status': 400}, []);
    }
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
    const query = `SELECT *, COUNT(*) OVER() AS noOfRows FROM adOptions ${whereClause} ${limitOffsetClause}`;

    const client = connect();
    client.query(query, values, function (err, result) {
        client.end();
        if (err) return callback(err, result);
        const { rows } = result;
        callback(err, rows);
    })
}

function getBasicComputationInfo(options, callback) {
    if (options.length == 0) {
        return callback({'message': 'Option ID Array is Empty.', 'status': 400}, []);
    }

    let optionParams = options.map((item, index) => {return '$' + (index+1)});

    const query = 'SELECT optionid, cost, audiencecount FROM adOptions WHERE optionid IN (' + optionParams.join(',') + ')';

    const client = connect();

    client.query(query, options, function (err, result) {
        client.end();
        if (err) return callback(err, result);
        const { rows } = result;
        callback(err, rows);
    })
}

module.exports = {
    resetTable,
    insertOptions,
    getOptions,
    getBasicComputationInfo
}
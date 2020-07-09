const { Client } = require('pg');
const { options } = require('./app');

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
            optionId BIGINT NOT NULL,
            optionType INT NOT NULL,
            companyId BIGINT NOT NULL,
            audienceCount INTEGER NOT NULL,
            cost INTEGER NOT NULL,
            PRIMARY KEY (optionId, optionType)
        );
    `;
    client.query(query, (err, res) => {
        console.log(err, res);
        client.end();
    });
};

//basic
async function insertOptions(options) {
    if (options.length == 0) {
        console.log("empty");
        throw {'message': 'Cannot Insert Empty Array.', 'status': 400};
    }
    let i = 1;
    const template = options.map((option) => `($${i++}, $${i++}, $${i++}, $${i++}, $${i++})`).join(',');
    const values = options.reduce((reduced, option) => [...reduced, option.optionId, option.optionType, option.companyId, option.audienceCount, option.cost], []);
    const query = `INSERT INTO adOptions (optionId, optionType, companyId, audienceCount, cost) VALUES ${template}`;

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
    whereClause = 'WHERE optionType = 0'
    if (!companyId && !audienceCount) whereClause;
    else {
        if (companyId) {
            whereClause += ` AND companyId = $${i++}`;
            values.push(parseInt(companyId));
        };
        if (audienceCount) {
            whereClause += (companyId) ? ` AND audienceCount > $${i++}` : ` AND audienceCount > $${i++}`;
            values.push(parseInt(audienceCount));
        }
    }

    let limitOffsetClause = `LIMIT $${i++} OFFSET $${i++}`;
    values.push(parseInt(pageSize)); //limit = page size
    values.push(parseInt(page) * parseInt(pageSize)); // offset = page * pageSize
    const query = `SELECT *, COUNT(*) OVER() AS noOfRows FROM adOptions ${whereClause} ${limitOffsetClause}`;

    console.log(query);
    
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

async function getBasicComputationInfo(inputOptions, budget) {
    
    const options = inputOptions.split(',');

    if (budget == '') {
		throw {'message': 'Please insert a budget', 'status': 400};
	}

    if (options[0] == '') {
        throw {'message': 'Cannot Insert Empty Array.', 'status': 400};
    }

    if (options.length < 2) {
        throw {'message': 'Minimum of Two Options Required', 'status': 400};
    }

    if (new Set(options).size !== options.length) {
        throw {'message': 'Duplicate Values Detected', 'status': 400};
    }

    let optionParams = options.map((item, index) => {return '$' + (index+1)});

    const query = 'SELECT optionid, cost, audiencecount FROM adOptions WHERE optionType = 0 AND optionid IN (' + optionParams.join(',') + ')';

    const client = connect();

    try {
        result = await client.query(query, options);
        client.end();
        const { rows } = result;
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

//advance
async function insertAdvanceOptions(options) {
    if (options.length == 0) {
        console.log("empty");
        throw {'message': 'Cannot Insert Empty Array.', 'status': 400};
    }
    let i = 1;
    const template = options.map((option) => `($${i++}, $${i++}, $${i++}, $${i++}, $${i++})`).join(',');
    const values = options.reduce((reduced, option) => [...reduced, option.optionId, option.optionType, option.companyId, option.audienceCount, option.cost], []);
    const query = `INSERT INTO adOptions (optionId, optionType, companyId, audienceCount, cost) VALUES ${template}`;

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

async function getAdvanceOptions(companyId, audienceCount, cost, page = 0, pageSize = 20) {
    let whereClause;
    let i = 1;
    const values = [];
    whereClause = 'WHERE optionType = 1'
    if (!companyId && !audienceCount && !cost) whereClause;
    else {
        if (companyId) {
            whereClause += ` AND companyId = $${i++}`;
            values.push(parseInt(companyId));
        }
        if (audienceCount) {
            whereClause += (companyId) ? ` AND audienceCount > $${i++}` : ` AND audienceCount > $${i++}`;
            values.push(parseInt(audienceCount));
        }
        if (cost) {
            whereClause += (cost) ? ` AND cost > $${i++}` : ` AND cost > $${i++}`;
            values.push(parseInt(cost));
        }
    }

    let limitOffsetClause = `LIMIT $${i++} OFFSET $${i++}`;
    values.push(parseInt(pageSize)); //limit = page size
    values.push(parseInt(page) * parseInt(pageSize)); // offset = page * pageSize
    const query = `SELECT *, COUNT(*) OVER() AS noOfRows FROM adOptions ${whereClause} ${limitOffsetClause}`;

    console.log(query);
    
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

async function getAdvanceComputationInfo(inputOptions, budget) {
    
    const options = inputOptions.split(',');

    if (budget == '') {
		throw {'message': 'Please insert a budget', 'status': 400};
	}

    if (options[0] == '') {
        throw {'message': 'Cannot Insert Empty Array.', 'status': 400};
    }

    if (options.length < 2) {
        throw {'message': 'Minimum of Two Options Required', 'status': 400};
    }

    if (new Set(options).size !== options.length) {
        throw {'message': 'Duplicate Values Detected', 'status': 400};
    }
    
    let optionParams = options.map((item, index) => {return '$' + (index+1)});

    const query = 'SELECT optionid, cost, audiencecount FROM adOptions WHERE optionType = 1 AND optionid IN (' + optionParams.join(',') + ')';

    const client = connect();

    try {
        result = await client.query(query, options);
        client.end();
        const { rows } = result;
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
    getAdvanceComputationInfo,
    getAdvanceOptions,
    insertAdvanceOptions,
}
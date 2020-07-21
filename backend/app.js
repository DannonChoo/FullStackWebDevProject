var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const database = require('./database');
const computeAlgo = require('./backend');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//reset
app.get('/reset', async (req, res, next) => {
	try {
		const result = await database.resetTable();
		const jsonData = {
			"success": "true"
		};
		res.json(jsonData);
	}

	catch (err) {
		return next(err);
	}
});

// basic
app.post('/basic/insert', async (req, res, next) => {
	const { data } = req.body;
	try {
		const result = await database.insertOptions(data);
		const jsonData = {
			"result": "success"
		};
		res.json(jsonData);
	}
	catch (err) {
		return next(err);
	}
});

app.get('/basic/data', async (req, res, next) => {
	let { companyId, audienceCount, page, pageSize } = req.query;
	try {
		const result = await database.getOptions(companyId, audienceCount, page, pageSize);
		res.json(result);
	}
	catch (err) {
		return next(err);
	}
});

app.get('/basic/result', async (req, res, next) => {
	let { optionIds, budget } = req.query;
	try {
		const result = await database.getBasicComputationInfo(optionIds, budget);
		let bestOptions = computeAlgo.basicComputeBestOption(result, budget);
		res.json(bestOptions);
	}
	catch (err) {
		return next(err);
	}
});

//advanced
app.post('/advance/insert', async (req, res, next) => {
	const { data } = req.body;
	try {
		const result = await database.insertAdvanceOptions(data);
		const jsonData = {
			"result": "success"
		};
		res.json(jsonData);
	}
	catch (err) {
		return next(err);
	}
});

app.get('/advance/data', async (req, res, next) => {
	let { companyId, audienceCount, cost, page, pageSize } = req.query;
	try {
		const result = await database.getAdvanceOptions(companyId, audienceCount, cost, page, pageSize);
		res.json(result);
	}
	catch (err) {
		return next(err);
	}
});

app.get('/advance/result', async (req, res, next) => {
	let { optionIds, budget } = req.query;
	try {
		const result = await database.getAdvanceComputationInfo(optionIds, budget);
		let bestOptions = computeAlgo.advancedComputeBestOption(result, budget);
		res.json(bestOptions);
	}
	catch (err) {
		return next(err);
	}
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.json({
		error: err.message,
		code: err.status || 500
	});
});

module.exports = app;
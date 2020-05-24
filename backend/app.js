var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const database = require('./database');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/basic/insert', function (req, res, next) {
	const { data } = req.body;
	database.insertOptions(data, (error, result) => {
		if (error) {
			return next(error);
		}
		jsonData = {
			"result" : "success"
		};
		console.log(result);
		res.json(jsonData);
	});
});

app.get('/basic/data', function (req, res, next) {
	let { companyId, audienceCount, page, pageSize } = req.query;
	database.getOptions(companyId, audienceCount, page, pageSize, (error, result) => {
		if (error) {
			return next(error);
		}
		res.json(result);
	});
});

app.get('/basic/dataLength', function (req, res, next) {
	database.getTotalDataLength((error, result) => {
		if (error) {
			return next(error);
		}
		console.log(result);
		res.json(result.rows[0]);
	})
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

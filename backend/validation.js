function validateResultAPI (options, budget) {

    if (budget == '' && options[0] == '') {
        return {'message': 'Cannot Insert Empty Array and Budget', 'status': 400};
    }

    if (budget == '') {
		return {'message': 'Please insert a budget', 'status': 400};
	}

    if (options[0] == '') {
        return {'message': 'Please insert option id.', 'status': 400};
    }

    if (options.length < 2) {
        return {'message': 'Minimum of Two Options Required', 'status': 400};
    }

    if (new Set(options).size !== options.length) {
        return {'message': 'Duplicate Values Detected', 'status': 400};
    }
}

module.exports = {
    validateResultAPI
}
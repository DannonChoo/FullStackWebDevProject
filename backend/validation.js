function validateResultAPI (options, budget) {

    if (budget == '' && options[0] == '') {
        return {'message': 'Option Ids and Budget Inputs cannot be detected.', 'status': 400};
    }

    if (budget == '') {
		return {'message': 'Please insert a Budget', 'status': 400};
	}

    if (options[0] == '') {
        return {'message': 'Please insert Option Id.', 'status': 400};
    }

    if (options.length < 2) {
        return {'message': 'Minimum of 2 Option Ids Required', 'status': 400};
    }

    if (new Set(options).size !== options.length) {
        return {'message': 'Duplicate Option Ids Detected.', 'status': 400};
    }
}

module.exports = {
    validateResultAPI
}
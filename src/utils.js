"use strict";

const path = require('path');

// eslint-disable-next-line
const types = require('./_typedefs');
const Package = require('../package.json');

const winston = require.main.require('winston');

/**
 * @description Prepends the package name to the error object / string for clarity of its origin
 * @param {Error | string} err
 * @returns {Error}
 */
function wrapError(err) {
	if (err instanceof Error) {
		err.message = `${Package.name} :: ${err.message}`;
	} else {
		err = new Error(`${Package.name} :: ${err}`);
	}

	winston.error(err.message);
	return err;
}

function isExtensionAllowed(filePath, allowed) {
	const extension = path.extname(filePath).toLowerCase();
	return !(allowed.length > 0 && (!extension || extension === '.' || !allowed.includes(extension)));
}

module.exports = {
    wrapError,
    isExtensionAllowed
}
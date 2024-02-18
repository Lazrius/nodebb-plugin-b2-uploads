"use strict";

// eslint-disable-next-line
const types = require('./_typedefs');

const db = require.main.require('./src/database');

const Package = require('../package.json');
const { wrapError } = require('./utils');

/** @type {types.Settings} */
let settings = {
    bucketId: null,
    bucketPath: null,
    bucketPathImages: null,
    storeImages: false,
    applicationKey: null,
    applicationKeyId: null
};

let applicationKeyIdFromDb = false;
let applicationKeyFromDb = false;

/**
 * 
 * @param {boolean} refresh Query the database for the settings
 * @returns {Promise<types.Settings>}
 */
async function getSettings(refresh) {
    if (!refresh) {
        return Promise.resolve(settings);
    }

    return await refreshSettings();
}

/**
 * @param {types.B2Endpoint} req
 */
function saveB2SettingsEndpoint(req, res, next) {
console.log(req.body);
	const data = req.body;
    /** @type {types.B2Settings} */
	const newSettings = {
        bucketId: data.bucketId || '',
        bucketPath: data.bucketPath || '',
        bucketPathImages: data.bucketPath || '',
        storeImages: (data.storeImages === "on") || false,
	};

	saveSettingsToDatabase(newSettings, res, next);
}

/**
 * @param {types.CredEndpoint} req
 */
function saveCredentialsEndpoint(req, res, next) {
	const data = req.body;
	const newSettings = {
		applicationKeyId: data.applicationKeyId || null,
		applicationKey: data.applicationKey || null,
	};

    if (!newSettings.applicationKey || !newSettings.applicationKeyId) {
        return next(wrapError("Application key and application key id must be provided."));
    }

	saveSettingsToDatabase(newSettings, res, next);
}

function saveSettingsToDatabase(newConfig, res, next) {
	db.setObject(Package.name, {...settings, ...newConfig}, (err) => {
		if (err) {
			return next(wrapError(err));
		}

		refreshSettings();
        console.log(settings);
		res.json('Saved!');
	});
}

function renderAdmin(req, res) {
	const data = {
		title: 'B2 Uploads',
        bucketId: settings.bucketId || '',
        bucketPath: settings.bucketPath || '',
        bucketPathImages: settings.bucketPath || '',
        storeImages: settings.storeImages || false,
		applicationKeyId: (applicationKeyIdFromDb && settings.applicationKeyId) || '',
		applicationKey: (applicationKeyFromDb && settings.applicationKey) || '',
	};

    console.log(data);

	res.render('admin/plugins/b2-uploads', data);
}

async function refreshSettings() {
	const newSettings = await db.getObjectFields(Package.name, Object.keys(settings));
    console.log(newSettings);

    applicationKeyIdFromDb = false;
    applicationKeyFromDb = false;

    if (newSettings.applicationKeyId) {
        settings.applicationKeyId = newSettings.applicationKeyId;
        applicationKeyIdFromDb = true;
    } else {
        settings.applicationKeyId = process.env.B2_APPLICATION_KEY_ID;
    }

    if (newSettings.applicationKey) {
        settings.applicationKey = newSettings.applicationKey;
        applicationKeyFromDb = true;
    } else {
        settings.applicationKey = process.env.B2_APPLICATION_KEY;
    }

    settings = newSettings;
    return settings;
}

module.exports = {
    renderAdmin,
    getSettings,
    saveB2SettingsEndpoint,
    saveCredentialsEndpoint
}
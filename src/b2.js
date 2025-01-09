"use strict";

const B2 = require('backblaze-b2');
const { wrapError } = require('./utils');
const { getSettings } = require('./admin');

// eslint-disable-next-line
require("./_typedefs");

let b2Api = null;
let lastAuthorize = new Date(0);
let downloadUrl = '';
let pluginActive = false;

function unload() {
	b2Api = null;
	lastAuthorize = new Date(0);
	pluginActive = false;
}

/**
 * @param {types.Settings} settings
 * @throws {Error} if authorization is unsuccessful, throws an error
 */
async function authorize(settings) {
	b2Api = new B2({
		applicationKeyId: settings.applicationKeyId,
		applicationKey: settings.applicationKey
	});

	await b2Api.authorize()
		.then((req) => {
			lastAuthorize = Date.now();
			downloadUrl = `${req.data.downloadUrl}/file/${req.data.bucketName || req.data.allowed.bucketName}/`;
		})
		.catch(err => {
			b2Api = null;
			lastAuthorize = new Date(0);
			throw wrapError(err);
        });
}

// did i ever tell you JS dates are trash?
/**
 * @returns {boolean} -- true if less than 23 hours have passed
 */
const stillAuthed = () => {
	const hours23 = 1000 * 60 * 60 * 23;
	return lastAuthorize + hours23 < Date.now();
}

/**
 *
 * @param {string} fileName
 * @param {Buffer} buffer
 * @param {boolean} isImg
 * @param {string | undefined} fileMime
 */
async function uploadToB2(fileName, buffer, isImg, fileMime = undefined) {
	if (!pluginActive) {
		// Shouldn't happen, but lets be safe
		throw wrapError("B2 plugin called while inactive");
	}

	const settings = await getSettings();
	if (!stillAuthed()) {
		// Throws if fails to authorize
		await authorize(settings);
	}

	let path = '';
	if (isImg && settings.bucketPathImages) {
		path = settings.bucketPathImages.replace('\\', '/');
	} else if (settings.bucketPath) {
		path = settings.bucketPath.replace('\\', '/');
	}

	if (path.length !== 0 && path.charAt(path.length - 1) !== '/') {
		path += '/';
    }

	const urlReq = await b2Api.getUploadUrl({
		bucketId: settings.bucketId
	});

	return await b2Api.uploadFile({
		uploadUrl: urlReq.data.uploadUrl,
		uploadAuthToken: urlReq.data.authorizationToken,
		fileName: path + fileName,
        data: buffer,
        mime: fileMime
	})
        .then((x) => ({
            name: fileName,
            url: downloadUrl + x.data.fileName
        }))
	.catch(err => {
		throw wrapError(err);
	});
}

/**
 *
 * @param {types.Settings | undefined} settings
 */
function load() {
	pluginActive = true;
}

module.exports = {
	unload,
	load,
    uploadToB2
};

"use strict";

/**
* @typedef {Object} B2Settings
* @property {string | null} bucketId - The bucket to store data within
* @property {string | null} bucketPath - The prefix/path that should be used to store files
* @property {string | null} bucketPathImages - The prefix/path that should be used to store images
* @property {boolean} storeImages - If images should be stored
* 
* @typedef {Object} Credentials
* @property {string | null} applicationKey - The application key for authorization.
* @property {string | null} applicationKeyId - The identifier for the application authorization key.
*
* @typedef {B2Settings & Credentials} Settings 
*
* @typedef {Object} CredEndpoint
* @property {Credentials} body
* @typedef {Object} B2Endpoint
* @property {B2Settings} body
*/

module.exports = {};
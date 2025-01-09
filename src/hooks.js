"use strict";

// eslint-disable-next-line
require("./_typedefs");

const meta = require.main.require('./src/meta');
const routeHelpers = require.main.require('./src/routes/helpers');
const fileModule = require.main.require('./src/file');
const winston = require.main.require("winston");

const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const gm = require("gm");
const axios = require("axios");
const { getSettings, renderAdmin, saveB2SettingsEndpoint, saveCredentialsEndpoint } = require("./admin");
const { wrapError, isExtensionAllowed } = require("./utils");
const { unload, uploadToB2, load } = require("./b2");

let fileTypeFromBuffer;
import("file-type").then(x => {
    fileTypeFromBuffer = x.fileTypeFromBuffer;
});

const im = gm.subClass({ imageMagick: true });

const plugin = {};

plugin.deactivate = function (data) {
    if (data.id === "nodebb-plugin-b2-uploads") {
        unload();
    }
};

plugin.load = async function (params) {
    const adminRoute = "/admin/plugins/b2-uploads";
    const { router, middleware } = params;
    routeHelpers.setupAdminPageRoute(router, adminRoute, renderAdmin);

    params.router.post(`/api${adminRoute}/b2settings`, middleware.applyCSRF, saveB2SettingsEndpoint);
    params.router.post(`/api${adminRoute}/credentials`, middleware.applyCSRF, saveCredentialsEndpoint);

    await getSettings(true)
        .then(() => {
            load();
        })
        .catch(winston.error);
};

plugin.uploadImage = async function (data) {
    const settings = await getSettings();
    if (!settings.storeImages) {
        return data;
    }

    const { image, uid } = data;

    if (!image) {
        winston.error("Image was null or undefined.");
        throw wrapError("Image provided was invalid.");
    }

    // check filesize vs. settings
    if (image.size > parseInt(meta.config.maximumFileSize, 10) * 1024) {
        winston.error(`error:file-too-big, ${meta.config.maximumFileSize}`);
        return wrapError(`[[error:file-too-big, ${meta.config.maximumFileSize}]]`);
    }

    const type = image.url ? "url" : "file";
    const allowed = fileModule.allowedExtensions();

    if (type === "file") {
        if (!image.path) {
            return wrapError("invalid image path");
        }

        if (!isExtensionAllowed(image.path, allowed)) {
            throw wrapError(`[[error:invalid-file-type, ${allowed.join("&#44; ")}]]`);
        }

        return await fs
            .readFileAsync(image.path)
            .then(async (buffer) => {
                const fileType = await fileTypeFromBuffer(buffer);
                return uploadToB2(uid, buffer, true, fileType.mime);
            })
            .catch((err) => {
                throw wrapError(err);
            });
    } else {
        if (!isExtensionAllowed(image.url, allowed)) {
            throw wrapError(`[[error:invalid-file-type, ${allowed.join("&#44; ")}]]`);
        }

        const filename = uid;
        const imageDimension = parseInt(meta.config.profileImageDimension, 10) || 128;

        const promise = new Promise((resolve, reject) => {
            im(axios.get(image.url), filename)
            .resize(`${imageDimension}^`, `${imageDimension}^`)
            .streamAsync()
            .then((err, stdout) => {
                if (err) {
                    reject(wrapError(err));
                    return;
                }

                let buf = Buffer.alloc(0);
                stdout.on("data", (d) => {
                    buf = Buffer.concat([buf, d]);
                });
                stdout.on("end", async () => {
                    const fileType = await fileTypeFromBuffer(buf);
                    return uploadToB2(filename, buf, true, fileType.mime)
                    .then(resolve)
                    .catch(reject);
                });
            });
        });

        return await promise;
    }
};

plugin.uploadFile = async function (data) {
    const { file } = data;

    if (!file) {
        throw wrapError("invalid file");
    }

    if (!file.path) {
        throw wrapError("invalid file path");
    }

    // check filesize vs. settings
    if (file.size > parseInt(meta.config.maximumFileSize, 10) * 1024) {
        winston.error(`error:file-too-big, ${meta.config.maximumFileSize}`);
        throw wrapError(`[[error:file-too-big, ${meta.config.maximumFileSize}]]`);
    }

    const allowed = fileModule.allowedExtensions();
    if (!isExtensionAllowed(file.path, allowed)) {
        throw wrapError(`[[error:invalid-file-type, ${allowed.join("&#44; ")}]]`);
    }

    return fs
        .readFileAsync(file.path)
        .then(async (buffer) => {
            const fileType = await fileTypeFromBuffer(buffer);
            return uploadToB2(file.name, buffer, false, fileType.mime);
        })
        .catch((err) => {
            throw wrapError(err);
        });
};

plugin.adminNavigation = async function (customHeader) {
    customHeader.plugins.push({
        route: "/plugins/b2-uploads",
        icon: "fa-cloud-upload",
        name: "b2 Uploads"
    });

    return customHeader;
};

module.exports = plugin;

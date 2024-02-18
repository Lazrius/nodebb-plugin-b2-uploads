# NodeBB B2 Uploads Plugin
This is a plugin for NodeBB 3.X for uploading files to Backblaze B2.

### Database Variables

From the NodeBB Admin panel, you can configure the following settings to be stored in the Database:

* `bucketId` — The ID of the bucket you would like to upload into
* `bucketPath` — The path that within the bucket you would like to upload all files into. Root if no string is provided.
* `bucketImagePath` — The path that image files will be stored at if images are being uploaded via this plugin.
* `storeImages` — If false, this plugin will not hook into image uploads, and will only handle regular file uploads.
* `applicationKey` — The secure application key for authentication
* `applicationKeyId` — The identifier for the aforementioned authentication key. Think of these like a username and password :)

The application key and and application key id can be specified in the database using the admin panel, or they can be passed in through environment variables.
It is preferable to specify them through the following ENVs as it's more secure:
```
B2_APPLICATION_KEY=123etc
B2_APPLICATION_KEY_ID=123etc
```

**Reiteration: I highly advise that you load the applicationKey and applicationKeyId via environment variables as it's far more secure.**

### Feature Requests & Contributing

This project was primarily created for the forum that I assist in running, and it is scoped to such. However if people would like to contribute I am more than happy to assist in the process.
If you would like a feature or change, you may request it by making an issue, but I make no promises.


### Credits

This plugin was originally based of the S3 upload plugin as it the latest version of it no longer supports Backblaze.
While working on this plugin it has changed change quite significantly and now contains scant references to the original, but credit where credit is due.
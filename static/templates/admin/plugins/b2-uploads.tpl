<div class="acp-page-container">
	<div component="settings/main/header" class="row border-bottom py-2 m-0 sticky-top acp-page-main-header align-items-center">
		<div class="col-12 col-md-8 px-0 mb-1 mb-md-0">
			<h4 class="fw-bold tracking-tight mb-0">{title}</h4>
		</div>
	</div>

	<div class="row m-0">
		<div id="spy-container" class="col-12 px-0 mb-4" tabindex="0">
			<p>You can configure this plugin via a combination of the below, for instance, you can use <em>instance meta-data</em>
				and <em>environment variables</em> in combination. You can also specify values in the form below, and those will be
				stored in the database.</p>

			<h3>Environment Variables</h3>
<pre><code>export B2_APPLICATION_KEY="xxxxx"
export B2_APPLICATION_KEY_ID="yyyyy"
</code></pre>

			<h3>Database Stored configuration:</h3>
			<form id="b2-upload-bucket">
				<div class="mb-3">
					<label class="form-label" for="bucketId">Bucket ID</label>
					<input type="text" id="bucketId" name="bucketId" value="{bucketId}" title="B2 Bucket ID" class="form-control" placeholder="0b423q4b9e99a2bbf85d2013">
				</div>

				<div class="mb-3">
					<label class="form-label" for="bucketPath">Bucket Path</label>
					<input type="text" id="bucketPath" name="bucketPath" value="{bucketPath}" title="B2 Bucket Path" class="form-control" placeholder="files/">
				</div>

				<div class="mb-3">
					<label class="form-label" for="bucketPathImages">Bucket Path Images</label>
					<input type="text" id="bucketPathImages" name="bucketPathImages" value="{bucketPathImages}" title="B2 Bucket Image Path" class="form-control" placeholder="files/images/">
				</div>

				<div class="mb-3">
					<label class="form-label" for="storeImages">Store Images</label>
					<input type="checkbox" id="storeImages" name="storeImages" checked="{storeImages}" title="B2 Store Images">
				</div>

				<button class="btn btn-primary" type="submit">Save</button>
			</form>

			<hr/>

			<form id="b2-upload-credentials">
				<label class="form-label mb-2" for="credentials">Credentials</label>
				<div class="alert alert-warning">
					Configuring this plugin using the fields below is <strong>NOT recommended</strong>, as it can be a potential
					security issue. We highly recommend that you investigate using either <strong>Environment Variables</strong> or
					<strong>Instance Meta-data</strong>
				</div>
				<label class="form-label" for="applicationKeyId">Application Key Id</label>
				<input type="text" name="applicationKeyId" value="{applicationKeyId}" maxlength="64" title="Application Key ID" class="form-control mb-3">
				<label class="form-label" for="applicationKey">Application Key</label>
				<input type="text" name="applicationKey" value="{applicationKey}" title="Application Key" class="form-control mb-3">
				<button class="btn btn-primary" type="submit">Save</button>
			</form>
		</div>

		<!-- IMPORT admin/partials/settings/toc.tpl -->
	</div>
</div>

'use strict';

// eslint-disable-next-line import/no-unresolved
import * as alerts from 'alerts';

// eslint-disable-next-line import/prefer-default-export
export function init() {
	$('#b2-upload-bucket').on('submit', function (e) {
		e.preventDefault();
		save('b2settings', this);
	});

	$('#b2-upload-credentials').on('submit', function (e) {
		e.preventDefault();
		var form = this;
		bootbox.confirm('Are you sure you wish to store your credentials for accessing B2 in the database?', function (confirm) {
			if (confirm) {
				save('credentials', form);
			}
		});
	});

	function save(type, form) {
		var data = {
			_csrf: config.csrf_token,
		};

		var values = $(form).serializeArray();
		for (var i = 0, l = values.length; i < l; i++) {
			data[values[i].name] = values[i].value;
		}

		console.log(window);
		$.post(`${config.relative_path}/api/admin/plugins/b2-uploads/${type}`, data).done(function (response) {
			if (response) {
				ajaxify.refresh();
				alerts.success(response);
			}
		}).fail(function (jqXHR) {
			ajaxify.refresh();
			alerts.error(jqXHR.responseJSON ? jqXHR.responseJSON.error : 'Error saving!');
		});
	}
}

Package.describe({summary: 'template-live-edit package'});

Package.on_use(function(api) {
	api.use('standard-app-packages');

	api.export('LiveEditTemplates');

	api.add_files('collection.js');
	api.add_files('template-live-edit.html', 'client');
	api.add_files('template-live-edit.js', 'client');
});

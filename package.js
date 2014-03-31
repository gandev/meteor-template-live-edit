Package.describe({summary: 'template-live-edit package'});

Package.on_use(function(api) {
	api.use('standard-app-packages');

	//at the moment only for debugging, template {{liveEdit}} brings all you need
	api.export('LiveEditTemplates');

	api.add_files('collection.js');
	api.add_files('template-live-edit.html', 'client');
	api.add_files('template-live-edit.css', 'client');
	api.add_files('template-live-edit.js', 'client');
});

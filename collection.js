LiveEditTemplates = new Meteor.Collection("live-edit");

if(Meteor.isServer) {
  LiveEditTemplates.remove({});

  LiveEditTemplates.insert({
    html: '{{#each test}}\n\t<p class="test_p">{{this}}</p>\n{{/each}}',
    js: "{\n\thelpers:{\n\t\ttest:['1','2']\n\t},\n\tevents:{\n\t\t'click .test_p': function(evt, tmpl) {\n\t\t\tconsole.log(evt);\n\t\t}\n\t}\n}"
  });
}

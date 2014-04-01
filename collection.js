LiveEditTemplates = new Meteor.Collection("live-edit");

if(Meteor.isServer) {
  Meteor.methods({
    resetLiveEdit: function () {
      LiveEditTemplates.remove({});

      LiveEditTemplates.insert({
        html: '{{#each test}}\n\t<p class="test_p">{{this}}</p>\n{{/each}}\n\n{{ident}}',
        js: "(function data() {return {\n\tmockDataContext:{\n\t\trandomId: function() {\n\t\t\treturn Random.id();\n\t\t}\n\t},\n\thelpers:{\n\t\ttest:['1','2'],\n\t\tident: function() {\n\t\t\treturn this.randomId();\n\t\t}\n\t},\n\tevents:{\n\t\t'click .test_p': function(evt, tmpl) {\n\t\t\tconsole.log(evt);\n\t\t}\n\t}\n};})();"
      });
    }
  });
}

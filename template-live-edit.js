var tmpl_id;
var tmpl_context;

var createPreviewComponent = function(template_html) {
    var component_attr = {
        kind: "Template_liveEdit_preview",
        __helperHost: true
    };

    var errMessage;

    if(tmpl_context instanceof Error) {
      errMessage = "JAVASCRIPT | " + err.toString();
    }

    if (template_html) {
        try {
            var renderFunctionCode = Spacebars.compile(template_html);
            //console.log(renderFunctionCode);
            component_attr = _.extend(component_attr, {
                render: eval(renderFunctionCode)
            });
        } catch (err) {
            errMessage = "HTML | " + err.toString();
        }
    }

    if (errMessage) {
        component_attr = _.extend(component_attr, {
            render: function() {
                return HTML.P(errMessage);
            }
        });
    }

    var component = UI.Component.extend(component_attr);

    if (tmpl_context && !errMessage) {
        component.helpers(tmpl_context.helpers);
        component.events(tmpl_context.events);
    }

    return component;
};

var editorHtml;
var editorJavascript;
var editors_initialized = false;

Template.liveEdit_html_edit.rendered = function() {
    editorHtml = ace.edit("aceEditorHtml");

    editorHtml.setTheme("ace/theme/xcode");
    editorHtml.getSession().setMode("ace/mode/html");
    editorHtml.setHighlightActiveLine(true);
};

Template.liveEdit_javascript_edit.rendered = function() {
    editorJavascript = ace.edit("aceEditorJavascript");

    editorJavascript.setTheme("ace/theme/xcode");
    editorJavascript.getSession().setMode("ace/mode/javascript");
    editorJavascript.setHighlightActiveLine(true);
};

Template.liveEdit.helpers({
    template_content: function() {
        var tmpl_content = LiveEditTemplates.findOne();

        if (!tmpl_content) return;

        tmpl_id = tmpl_content._id;

        try {
            tmpl_context = eval(tmpl_content.js) || {};
            //console.log(template_javascript.helpers);
        } catch (err) {
            tmpl_context = err;
        }

        if(!editors_initialized) {
          editorHtml.getSession().setValue(tmpl_content.html);
          editorJavascript.getSession().setValue(tmpl_content.js);
          editors_initialized = true;
        }

        return tmpl_context.mockDataContext;
    },
    preview: function() {
        var tmpl_content = LiveEditTemplates.findOne(tmpl_id);
        if(!tmpl_content) return null;
        
        var component = createPreviewComponent(tmpl_content.html);

        return component;
    }
});

Template.liveEdit.events({
    'keyup .liveEdit_html': function(evt, tmpl) {
        LiveEditTemplates.update(tmpl_id, {
            '$set': {
                html: editorHtml.getSession().getValue()
            }
        });
    },
    'click #liveEdit_javascript': function(evt, tmpl) {
        LiveEditTemplates.update(tmpl_id, {
            '$set': {
                js: editorJavascript.getSession().getValue()
            }
        });
    },
    'click #resetLiveEdit': function (evt, tmpl) {
      editors_initialized = false;
      Meteor.call('resetLiveEdit');
    }
});

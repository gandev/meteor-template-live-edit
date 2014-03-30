var createPreviewComponent = function(template_html, template_javascript) {
    var component_attr = {
        kind: "Template_liveEdit_preview",
        __helperHost: true
    };

    var errMessage;

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

    if (template_javascript) {
        try {
            template_javascript = eval('(function() {return ' + template_javascript + ';})();') || {};
            //console.log(template_javascript.helpers);
        } catch (err) {
            errMessage = "JAVASCRIPT | " + err.toString();

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

    if (template_javascript && !errMessage) {
        component.helpers(template_javascript.helpers);
        component.events(template_javascript.events);
    }

    return component;
};

var editorHtml;
var editorJavascript;

Template.liveEdit.rendered = function() {
    editorHtml = ace.edit("aceEditorHtml");
    editorJavascript = ace.edit("aceEditorJavascript");

    editorHtml.setTheme("ace/theme/xcode");
    editorHtml.getSession().setMode("ace/mode/html");
    editorHtml.setHighlightActiveLine(true);

    editorJavascript.setTheme("ace/theme/xcode");
    editorJavascript.getSession().setMode("ace/mode/javascript");
    editorJavascript.setHighlightActiveLine(true);
};

Template.liveEdit.helpers({
    template_view: function() {
        var tmpl = LiveEditTemplates.findOne();

        if (!tmpl) return;

        editorHtml.getSession().setValue(tmpl.html);
        editorJavascript.getSession().setValue(tmpl.js);

        Session.set('liveEdit_html_update', tmpl.html);
        Session.set('liveEdit_javascript_update', tmpl.js);

        return tmpl;
    },
    preview: function() {
        return createPreviewComponent(Session.get('liveEdit_html_update'),
            Session.get('liveEdit_javascript_update'));
    }
});

Template.liveEdit.events({
    'keyup .liveEdit_html': function(evt, tmpl) {
        Session.set('liveEdit_html_update', editorHtml.getSession().getValue());
    },
    'keyup .liveEdit_javascript': function(evt, tmpl) {
        Session.set('liveEdit_javascript_update', editorJavascript.getSession().getValue());
    }
});

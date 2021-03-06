/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

/**
 * Provides a declarative way to specify `document.title` in a single-page app.
 * This component is only intended for client-side usage.
 *
 * Because it is just a React component, you can return it in `render` inside
 * your own components, and use their `props` or `state` to determine the title.
 *
 * `DocumentTitle` does not render to DOM itself, not even to a <noscript />.
 * In its `render`, it simply returns the only child that was passed to it.
 * Being a container itself, it allows title nesting and specificity.

 * For example, you may put it at the very top of view hierarchy to specify the
 * default title, and then you can give some pages their own `DocumentTitle`s
 * that depend on their `props` or `state`.
 *
 * Sample code (assuming you use something like react-router):
 *
 *     var App = React.createClass({
 *       render: function () {
 *
 *         // Use "My Web App" if no child overrides this
 *
 *         return (
 *           <DocumentTitle title='My Web App'>
*              <this.props.activeRouteHandler />
 *           </DocumentTitle>
 *         );
 *       }
 *     });
 *
 *     var HomePage = React.createClass({
 *       render: function () {
 *
 *         // Use "Home" when this component is mounted
 *
 *         return (
 *           <DocumentTitle title='Home'>
 *             <h1>Home, sweet home.</h1>
 *           </DocumentTitle>
 *         );
 *       }
 *     });
 *
 *     var NewArticlePage = React.createClass({
 *       mixins: [LinkStateMixin],
 *
 *       render: function () {
 *
 *         // Update using value from state when this component is mounted
 *
 *         return (
 *           <DocumentTitle title={this.state.title || 'Untitled'}>
 *             <div>
 *               <h1>New Article</h1>
 *               <input valueLink={this.linkState('title')} />
 *             </div>
 *           </DocumentTitle>
 *         );
 *       }
 *     });
 */
var DocumentTitle = React.createClass({

  displayName: 'DocumentTitle',

  propTypes: {
    title: React.PropTypes.string
  },

  statics: {
    originalTitle: '',

    mountedInstances: [],

    rewind: function () {
      var activeInstance = DocumentTitle.getActiveInstance();
      DocumentTitle.mountedInstances.splice(0);

      if ( activeInstance ) {
        return activeInstance.props.title;
      }
    },

    getActiveInstance: function () {
      var length = DocumentTitle.mountedInstances.length;
      if ( length > 0 ) {
        return DocumentTitle.mountedInstances[length - 1];
      }
    },

    updateDocumentTitle: function () {
      var newPageTitle = '';
      var activeInstance = DocumentTitle.getActiveInstance();

      if ( typeof document !== 'undefined' && activeInstance ) {
        newPageTitle += activeInstance.props.title;
        newPageTitle += ' \u2014 ';

        newPageTitle += DocumentTitle.originalTitle;

        document.title = newPageTitle;
      }
    }
  },

  getDefaultProps: function () {
    return {
      title: ''
    };
  },

  componentWillMount: function () {
    if ( !DocumentTitle.originalTitle ) {
      DocumentTitle.originalTitle = document.title;
    }

    DocumentTitle.mountedInstances.push(this);
    DocumentTitle.updateDocumentTitle();
  },

  componentDidUpdate: function (prevProps) {
    if ( this.isActive() && prevProps.title !== this.props.title ) {
      DocumentTitle.updateDocumentTitle();
    }
  },

  componentWillUnmount: function () {
    var index = DocumentTitle.mountedInstances.indexOf(this);
    DocumentTitle.mountedInstances.splice(index, 1);
    DocumentTitle.updateDocumentTitle();
  },

  isActive: function () {
    return this === DocumentTitle.getActiveInstance();
  },

  render: function () {
    return null;
  }

});

module.exports = React.createFactory(DocumentTitle);
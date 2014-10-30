import Ember from 'ember';

var DEFAULT_SORT = '-modified';

export default Ember.ArrayController.extend({
  itemController: 'packages/item',

  queryParams: {
    query:     {as: 'q', replace: true},
    qpSort:    's',
    qpReverse: 'r'
  },

  sortProperties: [DEFAULT_SORT],
  sortAscending:  true,

  // used to show the user if a filtering is scheduled or not
  isFiltering:    false,

  // used by query parameters and the match method in the item controllers
  query:          '',

  // beautify or parse the sort QP
  qpSort:         function (key, value) {
    if (arguments.length > 1) {
      this.set('sortProperties', ['-' + value]);
    }
    return (this.get('sortProperties.firstObject') || DEFAULT_SORT).substr(1);
  }.property('sortProperties.firstObject'),

  // beatify or parse the sort order QP
  qpReverse:      function (key, value) {
    if (arguments.length > 1) {
      this.set('sortAscending', !value);
    }
    return this.get('sortAscending') ? '' : '1';
  }.property('sortAscending'),

  // used by the input box
  searchInput:    function (key, value) {
    if (arguments.length > 1) {
      this.set('isFiltering', true);
      Ember.run.debounce(this, 'updateQuery', value, 100);
    }
    else {
      value = this.get('query');
    }
    return value;
  }.property('query'),

  // filter content
  model:          function () {
    var query = (this.get('query') || '').trim().toLowerCase();
    return (this.get('sourceContent') || []).filter(function (item) {
      return !query ||
        item.get('-name').indexOf(query) >= 0 ||
        item.get('-owner').indexOf(query) >= 0 ||
        item.get('-description').indexOf(query) >= 0;
    });
  }.property(
    // we don't need to listen for @each since our content will never change or be totally updated
    'sourceContent', 'query'
  ).readOnly(),

  // in a function so that we can debounce it => the filtering and refreshing of URL isn't done on
  // each char
  updateQuery:    function (value) {
    this.set('query', value || '');
    this.set('isFiltering', false);
  },

  // our filtered content
  sourceContent:  null,

  // whether we have some items matching the filters or not
  hasMatch:       Ember.computed.bool('length'),

  actions: {
    // used in the table headers to sort
    toggleSort: function (name) {
      name = '-' + name;
      if (this.get('sortProperties.firstObject') === name) {
        this.toggleProperty('sortAscending');
      }
      else {
        this.setProperties({
          sortProperties: [name],
          sortAscending:  true
        });
      }
    }
  }
});

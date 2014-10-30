import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.store.findAll('package');
  },

  setupController: function (controller, model) {
    controller.set('sourceContent', model);
    this.controllerFor('application').set('packageCount', model.get('length'));
  }
});

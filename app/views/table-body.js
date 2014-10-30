import SortableCollectionView from 'ember-sortable-collection-view/views/sortable-collection';

export default SortableCollectionView.extend({
  tagName:          'tbody',
  itemTemplateName: 'packages/item'
});

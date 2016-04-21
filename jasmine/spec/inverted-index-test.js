describe('InvertedIndex Test Suite', function () {
  'use strict';
  var app,
      app1;  

  describe('Read Book data', function () {
    beforeAll(function (done) {
      app = new InvertedIndex();
      app.createIndex('../jasmine/books.json', done);
    });

    it('books JSON should not be empty', function () {
      expect(app.jsonArray.length).toBeGreaterThan(0);
    });

    it('ensures objects in json array contains strings', function() {
      expect(app.jsonArray.every(function (object) {
        return (typeof(object.title) === 'string' && typeof(object.text) === 'string');
      })).toEqual(true);
    });

    describe('Check Index is not overwritten', function () {
      beforeAll(function (done) {
        app1 = new InvertedIndex();
        // Create first index
        app1.createIndex('../jasmine/books.json', done);
      });

      it('ensures index is not overwritten| First Index Created', function(done) {
        expect(app1.index.of).toEqual([0, 1]);
        expect(app1.index.another).toBeUndefined();
        // Create the second index for the next test :| Second Index Created
        app1.createIndex('../jasmine/another.json', done);
      });

      it('ensures index is not overwritten| Second Index Created', function() {
        expect(app1.index.of).toEqual([0, 1]);
        expect(app1.index.another).toEqual([0]);
      });
    });
  });

  describe('Populate index', function () {
    it('assert that the index is created', function () {
      expect(app.index).toBeDefined();
      expect(app.getIndex().alice).toEqual([0]);
      expect(app.getIndex().wonderland).toEqual([0]);
      expect(app.getIndex().rings).toEqual([1]);
      expect(app.getIndex().lord).toEqual([1]);
      expect(app.getIndex().a).toEqual([0, 1]);
    });
  });

  describe('Search Index', function() {
    it ('should be correct search result', function () {
      expect(app.searchIndex('Alice')).toEqual([[0]]);
      expect(app.searchIndex('DWARF')).toEqual([[1]]);
      expect(app.searchIndex('lord falls')).toEqual([[1], [0]]);
    });

    it('verifies searching an index returns index of correctly', function() {
      expect(app.searchIndex('wonderland')).toEqual([[0]]);
      expect(app.searchIndex('dwarf')).toEqual([[1]]);
      expect(app.searchIndex('hi')).toEqual([]);
      expect(app.searchIndex('lord')).toEqual([[1]]);
      expect(app.searchIndex('a')).toEqual([[0, 1]]);
      expect(app.searchIndex('of')).toEqual([[0, 1]]);
    });

    it('can handle varied number of search terms', function() {
      expect(app.searchIndex('alice in wonderland'))
        .toEqual([[0],[0],[0]]);
      expect(app.searchIndex('lord of the rings'))
        .toEqual([[1],[0, 1],[1],[1]]);
      expect(app.searchIndex('man a rabbit hole'))
        .toEqual([[1],[0, 1],[0],[0]]);
    });

    it('ensures search can handle an array of words', function() {
      expect(app.searchIndex(['alice', 'in', 'wonderland']))
        .toEqual([[0],[0],[0]]);
      expect(app.searchIndex(['lord', 'of', 'the', 'rings']))
        .toEqual([[1],[0, 1],[1],[1]]);
      expect(app.searchIndex(['an', 'unusual', 'alliance', 'of', 'man']))
        .toEqual([[1],[1],[1],[0, 1],[1]]);
    });

    it('search handles varied number of arguments and setences', function() {
      expect(app.searchIndex('alice', 'alice in wonderland', 'in'))
        .toEqual([[0],[0],[0],[0],[0]]);
      expect(app.searchIndex('lord', 'of', 'the', 'rings'))
        .toEqual([[1],[0, 1],[1],[1]]);
      expect(app.searchIndex('an', 'unusual', 'alliance', 'of', 'man'))
        .toEqual([[1],[1],[1],[0, 1],[1]]);
    });

    it('ensures search can handle edge cases', function() {
      expect(app.searchIndex('alice', 'notAvailable', 'in'))
        .toEqual([[0],[],[0]]);
    });
  });
});
describe('Read book data', function () {
  var app, booksObject;  

  describe('Read Book data', function () {

    beforeAll(function () {
      booksObject = [];
      app = new InvertedIndex();
      booksObject = app.createIndex('../jasmine/books.json');
    });

    it('books JSON should not be empty', function () {
      expect(booksObject.length).toBeGreaterThan(0);
    });

    it("ensures objects in json array contains strings", function() {
      expect(booksObject.every(function (object) {
        return (typeof(object.title) == 'string' && typeof(object.text) == 'string');
      })).toEqual(true);
    });

    it("ensures index is not overwritten", function() {
      var app = new InvertedIndex();
      app.createIndex('../jasmine/books.json');
      
      expect(app.index.of).toEqual([0, 1]);
      expect(app.index.another).toBeUndefined();

      app.createIndex('../jasmine/another.json');

      expect(app.index.of).toEqual([0, 1]);
      expect(app.index.another).toEqual([0]);
      
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

    it("verifies searching an index returns array of indices of correct object", function() {
      expect(app.searchIndex('wonderland')).toEqual([[0]]);
      expect(app.searchIndex('dwarf')).toEqual([[1]]);
      expect(app.searchIndex('hi')).toEqual([]);
      expect(app.searchIndex('lord')).toEqual([[1]]);
      expect(app.searchIndex('a')).toEqual([[0, 1]]);
      expect(app.searchIndex('of')).toEqual([[0, 1]]);
    });

    it("can handle varied number of search terms", function() {
      expect(app.searchIndex('alice in wonderland')).toEqual([[0],[0],[0]]);
      expect(app.searchIndex('lord of the rings')).toEqual([[1],[0, 1],[1],[1]]);
      expect(app.searchIndex('man a rabbit hole')).toEqual([[1],[0, 1],[0],[0]]);
    });

    it("ensures search can handle an array of words", function() {
      expect(app.searchIndex(['alice', 'in', 'wonderland'])).toEqual([[0],[0],[0]]);
      expect(app.searchIndex(['lord', 'of', 'the', 'rings'])).toEqual([[1],[0, 1],[1],[1]]);
      expect(app.searchIndex(['an', 'unusual', 'alliance', 'of', 'man'])).toEqual([[1],[1],[1],[0, 1],[1]]);
    });

    it("ensures search can handle a varied number of arguments and strings with space characters", function() {
      expect(app.searchIndex('alice', 'alice in wonderland', 'in')).toEqual([[0],[0],[0],[0],[0]]);
      expect(app.searchIndex('lord', 'of', 'the', 'rings')).toEqual([[1],[0, 1],[1],[1]]);
      expect(app.searchIndex('an', 'unusual', 'alliance', 'of', 'man')).toEqual([[1],[1],[1],[0, 1],[1]]);
    });

    it("ensures search can handle edge cases", function() {
      expect(app.searchIndex('alice', 'notAvailable', 'in')).toEqual([[0],[],[0]]);
      
    });
  });
});
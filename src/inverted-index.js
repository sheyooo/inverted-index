// The InvertedIndex object takes JSON files and indexes them
/**
 * A JavaScript Class that indexes words in documents for fast searches
 */
var InvertedIndex = function () {
  'use strict';
  var self = this;

  this.index = {};
  this.jsonArray = null;

  /**
   * Returns index property of the Object
   * @return Object 
   */
  this.getIndex = function () {
    return self.index;
  };

  /**
   * Performs an asynchronous request for the json
   * @param  {String} filepath String representing the path of the file
   * @return {Object}          Parsed JSON Response of the JSON file
   */
  this.readJsonFile = function (filepath, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', filepath);
    xhr.send();
    xhr.onload = function () {
      var response = JSON.parse(this.response);
      self.jsonArray = response;
      callback(response);
    };
  };

  /**
   * Creates the index property on the object
   * @param  {String} filepath String representing the filepath
   * @return {Object}          Parsed JSON Response from the readJsonFile method
   */
  this.createIndex = function (filepath, callback) {
    self.readJsonFile(filepath, function (json) {
      json.forEach(function (book, location) {
        var words = book.title + ' ' + book.text;
        words = self.tokenize(words);
        words.forEach(function (word) {
          var normalizedWord = self.normalize(word);
          if (!self.index.hasOwnProperty(normalizedWord)) {
            self.index[normalizedWord] = [location];
          } else if (self.index[normalizedWord].indexOf(location) < 0) {
            self.index[normalizedWord].push(location);
          }
        });
      });
      callback();
    });
  };

  /**
   * Performs search on index property
   * @param  {mixed} query query can be an array or a string
   * @return {Array}       An array containing search results
   */
  this.searchIndex = function (query) {
    var performSearch = function (searchWords) {
      var result = [];
      for (var i = 0; i < searchWords.length; i++) {
        var arg = searchWords[i];
        arg = self.normalize(arg);
        if (self.index[arg]) {
          result.push(self.index[arg]);
        } else if (searchWords.length > 1) {
          //if multiple searchWords pushes empty array to the result
          result.push([]);
        }
      }

      return result;
    };

    if (query instanceof Array) {
      return performSearch(query);
    } else if (arguments.length > 1) {
      var terms = [];
      var searchTerms = Array.prototype.slice.call(arguments);
      // If multiple arguments with strings containing space characters
      searchTerms.forEach(function (arg) {
        var args = arg.split(' ');
        args.forEach(function (word) {
          terms.push(word);
        });
      });
      return performSearch(terms);
    } else if (typeof(query) === 'string') {
      // Split the query for space characters
      return performSearch(query.split(' '));
    } 
  };

  /**
   * Splits the words in the documents or JSON objects into an array
   * @param  {String} words Sentence or strings in documents
   * @return {Array}       Splitted words in an array
   */
  this.tokenize = function (words) {
    return words.split(' ');
  };

  /**
   * Turns the tokens to lowercase and removes special characters
   * @param  {String} word The tokenized string is taken in here
   * @return {String}      The cleaned up string
   */
  this.normalize = function (word) {
    word = word.replace(/[,";:?!@#$%(^)&*()_+|.><{}±=-]/g, '');
    return word.toLowerCase();
  };
};
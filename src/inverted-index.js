'use strict';

//The InvertedIndex object takes JSON files and indexes them
/**
 * A JavaScript Class that indexes words in documents for fast searches
 */
var InvertedIndex = function () {
  var that = this;

  this.index = {};
  this.jsonArray = null;

  /**
   * Returns index property of the Object
   * @return Object 
   */
  this.getIndex = function () {
    return that.index;
  };

  /**
   * Performs a synchronous request for the json
   * @param  {String} filepath String representing the path of the file
   * @return {Object}          Parsed JSON Response of the JSON file
   */
  this.readJsonFile = function (filepath, callback) {
    var response;
    var xhr = new XMLHttpRequest();

    xhr.open('GET', filepath);
    xhr.send();
    xhr.onload = function () {
      var response = JSON.parse(this.response);
      that.jsonArray = response;

      callback(response);
    };
  };

  /**
   * Creates the index property on the object
   * @param  {String} filepath String representing the filepath
   * @return {Object}          Parsed JSON Response from the readJsonFile method
   */
  this.createIndex = function (filepath, callback) {

    var json = that.readJsonFile(filepath, function (json) {

      json.forEach(function (book, location) {
        var words = book.title + ' ' + book.text;
        words = that.tokenize(words);

        words.forEach(function (word) {
          var normalizedWord = that.normalize(word);

          if (! that.index.hasOwnProperty(normalizedWord) ) {
            that.index[normalizedWord] = [location];

          } else if(that.index[normalizedWord].indexOf(location) < 0) {
            that.index[normalizedWord].push(location);
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
    var result = [];

    var performSearch = function (searchWords) {
      for (var i = 0; i < searchWords.length; i++) {
        var arg = searchWords[i];
        arg = that.normalize(arg);

        if (typeof that.index[arg] !== 'undefined') {
          result.push(that.index[arg]);
        } else if (searchWords.length > 1) {
          //if multiple searchWords pushes empty array to the result
          result.push([]);
        }
      }
    };

    if (query instanceof Array) {

      performSearch(query);
    } else if (arguments.length > 1) {

      var terms = [];
      var searchTerms = Array.prototype.slice.call(arguments);

      //If multiple arguments with strings containing space characters
      searchTerms.forEach(function (arg) {
        var args = arg.split(' ');
        args.forEach(function (word) {
          terms.push(word);
        });
      });

      performSearch(terms);
    } else if (typeof(query) == 'string') {
      //Split the query for space characters
      performSearch(query.split(' '));
    }
    

    return result;
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
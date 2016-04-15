'use strict';

//The InvertedIndex object takes JSON files and indexes them
/**
 * [InvertedIndex description]
 */
var InvertedIndex = function () {
  this.index = {};
};

InvertedIndex.prototype.index = {};

/**
 * Returns index property of the Object
 * @return Object 
 */
InvertedIndex.prototype.getIndex = function () {
    return this.index;
};

/**
 * Performs a synchronous request for the json
 * @param  {String} filepath String representing the path of the file
 * @return {Object}          Parsed JSON Response of the JSON file
 */
InvertedIndex.prototype.readJsonFile = function (filepath) {
  var response;
  var xhr = new XMLHttpRequest();

  xhr.open('GET', filepath, false);
  xhr.send();
  if (xhr.status === 200) {
    var data = JSON.parse(xhr.responseText);
    response = data;
    this.jsonArray = data;
  }

  return response;
};

/**
 * Creates the index property on the object
 * @param  {String} filepath String representing the filepath
 * @return {Object}          Parsed JSON Response from the readJsonFile method
 */
InvertedIndex.prototype.createIndex = function (filepath) {

  var json = this.readJsonFile(filepath);
  var that = this;
  
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

  return json;
};

/**
 * Performs search on index property
 * @param  {mixed} query query can be an array or a string
 * @return {Array}       An array containing search results
 */
InvertedIndex.prototype.searchIndex = function (query) {
  var that = this;
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
InvertedIndex.prototype.tokenize = function (words) {
  return words.split(' ');
};

/**
 * Turns the tokens to lowercase and removes special characters
 * @param  {String} word The tokenized string is taken in here
 * @return {String}      The cleaned up string
 */
InvertedIndex.prototype.normalize = function (word) {
  word = word.replace(/[,";:?!@#$%(^)&*()_+|.><{}±=-]/, '');
  return word.toLowerCase();
};
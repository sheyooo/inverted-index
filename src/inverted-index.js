'use strict';

var InvertedIndex = function() {
  var that = this;

  this.index = {};
  this.jsonArray;

  this.getIndex = function () {

    return that.index;
  };

  this.createIndex = function (filepath) {

    let populateIndex = function (json) {
      json.forEach(function (book, location) {
        let words = book.title + ' ' + book.text;
        words = that.tokenize(words);

        words.forEach(function (word) {
          let normalizedWord = that.normalize(word);

          if (! that.index.hasOwnProperty(normalizedWord) ) {
            that.index[normalizedWord] = [location];

          } else if(that.index[normalizedWord].indexOf(location) < 0) {
            that.index[normalizedWord].push(location);
          }
        });
      });
    };
    let response;
    let xhr = new XMLHttpRequest();

    xhr.open('GET', filepath, false);
    xhr.send();
    if (xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      response = data;
      that.jsonArray = data;
      populateIndex(data);
    };

    return response
  };

  this.searchIndex = function (query) {
    let result = [];
    //let query = Array.prototype.slice.call(arguments);

    var performSearch = function (searchWords) {
      for (let i = 0; i < searchWords.length; i++) {
        let arg = searchWords[i];
        arg = that.normalize(arg);
        if (typeof that.index[arg] === 'undefined') {

        } else {
          result.push(that.index[arg]);
        }
      }
    }

    if (query instanceof Array) {
      performSearch(query);
    } else {
      //Split the query for space characters
      performSearch(query.split(' '));
    }

    return result
  };

  this.tokenize = function (words) {
  
    return words.split(' ');
  };

  this.normalize = function (word) {
    word = word.replace(/[,";:?!@#$%(^)&*()_+|.><{}±]/, '');
    return word.toLowerCase();
  };

};
# merge-sort-stream [![Build Status](https://travis-ci.org/debitoor/merge-sort-stream.svg?branch=master)](https://travis-ci.org/debitoor/merge-sort-stream)

Merge sort two input streams to one sorted stream.

	npm install merge-sort-stream

If you do not want to load all data into memory before doing the sort and the two input streams already are sorted then this module might help you.

## Usage

Precondition, the two input streams should be readable with objectMode set to true and sorted regarding to the compare function.

```javascript
var streamArray = require('stream-array');
var concat = require('concat-stream');
var mergeSortStream = require('merge-sort-stream');

function compare(a, b) { return b - a; }

var sortedA = streamArray([1,3,5,6,7]);
var sortedB = streamArray([2,3,4]);

var sorted = mergeSortStream(sortedA, sortedB, compare);

sorted.pipe(concat({encoding: 'object'}, function(array){
	console.log(array);
}));

// output to console will be [ 1, 2, 3, 3, 4, 5, 6, 7 ]
```

## Streaming objects

If you have a streams of objects/points that have to be sorted regarding to the euclidean distance.

```javascript
function euclidean(a, b) { return Math.sqrt(b.x*b.x+b.y*b.y) - Math.sqrt(a.x*a.x+a.y*a.y); }

var sortedA = streamArray([{x: 1, y: 1}, {x: 3, y: 3}]);
var sortedB = streamArray([{x: 4, y: 1}, {x: 5, y: 1}]);

var sorted = mergeSortStream(sortedA, sortedB, euclidean);

sorted.pipe(concat({encoding: 'object'}, function(array){
	console.log(array);
}));

// output to console will be [ { x: 1, y: 1 }, { x: 4, y: 1 }, { x: 3, y: 3 }, { x: 5, y: 1 } ]
```

## Related module

If you are going to sort objects only based on a property, you should consider to use the well proven module [sorted-union-stream](https://www.npmjs.com/package/sorted-union-stream).


## License

[MIT](http://opensource.org/licenses/MIT)

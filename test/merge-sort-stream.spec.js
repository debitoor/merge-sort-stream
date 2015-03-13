var fromArray = require('stream-array');
var concat = require('concat-stream');
var pump = require('pump');
var mergeSortStream = require('../index');

describe('mergeSortStream.spec.js', function() {

	var result;

	describe('when merge', function() {

		beforeEach(function(done) {
			pump(
				new mergeSortStream(fromArray([1,3,5,6,7]), fromArray([2,3,4]), increasing),
				toArray(function(array) {
					result = array;
				}), done);
		});

		it('should sort the arrays', function() {
			expect(result).to.eql([1,2,3,3,4,5,6,7]);
		});
	});

	describe('when first has zero element', function() {

		beforeEach(function(done) {
			pump(
				new mergeSortStream(fromArray([]), fromArray([1,2,3,4]), increasing),
				toArray(function(array) {
					result = array;
				}), done);
		});

		it('should sort the arrays', function() {
			expect(result).to.eql([1,2,3,4]);
		});
	});

	describe('when second has zero element', function() {

		beforeEach(function(done) {
			pump(
				new mergeSortStream(fromArray([1,2,3,4]), fromArray([]), increasing),
				toArray(function(array) {
					result = array;
				}), done);
		});

		it('should sort the arrays', function() {
			expect(result).to.eql([1,2,3,4]);
		});
	});

	describe('when first has one element', function() {

		beforeEach(function(done) {
			pump(
				new mergeSortStream(fromArray([1]), fromArray([2,3,4]), increasing),
				toArray(function(array) {
					result = array;
				}), done);
		});

		it('should sort the arrays', function() {
			expect(result).to.eql([1,2,3,4]);
		});
	});

	describe('when first has one element', function() {

		beforeEach(function(done) {
			pump(
				new mergeSortStream(fromArray([2]), fromArray([1,3,4]), increasing),
				toArray(function(array) {
					result = array;
				}), done);
		});

		it('should sort the arrays', function() {
			expect(result).to.eql([1,2,3,4]);
		});
	});

	describe('when second has one element', function() {

		beforeEach(function(done) {
			pump(
				new mergeSortStream(fromArray([2,3,4]), fromArray([1]), increasing),
				toArray(function(array) {
					result = array;
				}), done);
		});

		it('should sort the arrays', function() {
			expect(result).to.eql([1,2,3,4]);
		});
	});

	describe('when second has one element', function() {

		beforeEach(function(done) {
			pump(
				new mergeSortStream(fromArray([1,3,4]), fromArray([2]), increasing),
				toArray(function(array) {
					result = array;
				}), done);
		});

		it('should sort the arrays', function() {
			expect(result).to.eql([1,2,3,4]);
		});
	});

	describe("when merge zero's", function() {

		beforeEach(function(done) {
			pump(
				new mergeSortStream(fromArray([0,1]), fromArray([0,2]), increasing),
				toArray(function(array) {
					result = array;
				}), done);
		});

		it('should sort the arrays', function() {
			expect(result).to.eql([0,0,1,2]);
		});
	});

	describe("when merge zero's", function() {

		beforeEach(function(done) {
			pump(
				new mergeSortStream(fromArray([0,0,1]), fromArray([0,0,2]), increasing),
				toArray(function(array) {
					result = array;
				}), done);
		});

		it('should sort the arrays', function() {
			expect(result).to.eql([0,0,0,0,1,2]);
		});
	});

	describe("when sort objects based on euclidean distance", function() {

		beforeEach(function(done) {
			pump(
				new mergeSortStream(fromArray([{x: 1, y: 1}, {x: 3, y: 3}]), fromArray([{x: 4, y: 1}, {x: 5, y: 1}]), euclidean),
				toArray(function(array) {
					result = array;
				}), done);
		});

		it('should sort the arrays', function() {
			expect(result).to.eql([ { x: 1, y: 1 }, { x: 4, y: 1 }, { x: 3, y: 3 }, { x: 5, y: 1 } ]);
		});
	});
});

function euclidean(a, b) {
	return Math.sqrt(b.x*b.x+b.y*b.y) - Math.sqrt(a.x*a.x+a.y*a.y);
}

function increasing(a, b) {
	return b-a;
}

function toArray(callback) {
	return concat({encoding: 'object'}, callback);
}
var Readable = require('readable-stream').Readable;
var eos = require('end-of-stream');
var util = require('util');

var stream2 = function(stream) {
	if (stream._readableState) {
		return stream;
	}
	return new Readable({objectMode:true, highWaterMark:16}).wrap(stream);
};

var destroy = function(stream) {
	if (stream.readable && stream.destroy) {
		stream.destroy();
	}
};

// Merge sort two input streams to one sorted stream
// Precondition, the two input streams should be sorted regarding to compare
function MergeSortStream(streamA, streamB, compare) {

	if (!(this instanceof MergeSortStream)) {
		return new MergeSortStream(streamA, streamB, compare);
	}

	this._compare = compare;
	this._sourceA = stream2(streamA);
	this._sourceB = stream2(streamB);
	this._endA = false;
	this._endB = false;
	this._chunkA = null;
	this._chunkB = null;
	this._destroyed = false;

	Readable.call(this, {objectMode:true, highWaterMark:0});

	var me = this;

	eos(streamA, function(err) {
		if (err) {
			return me.destroy(err);
		}
		me._endA = true;
		me._read();
	});
	eos(streamB, function(err) {
		if (err) {
			return me.destroy(err);
		}
		me._endB = true;
		me._read();
	});

	streamA.on('readable', function() {
		me._readableA = true;
		me._read();
	});
	streamB.on('readable', function() {
		me._readableB = true;
		me._read();
	});
}

util.inherits(MergeSortStream, Readable);

MergeSortStream.prototype.destroy = function(err) {
	if (this._destroyed) {
		return;
	}

	this._destroyed = true;
	destroy(this._sourceA);
	destroy(this._sourceB);

	if (err) {
		this.emit('error', err);
	}
	this.emit('close');
};

MergeSortStream.prototype._read = function() {
	var chunk = null;

	if (this._readableA && !exist(this._chunkA)) {

		this._chunkA = this._sourceA.read();
		this._readableA = exist(this._chunkA);

	} else if (this._readableB && !exist(this._chunkB)) {

		this._chunkB = this._sourceB.read();
		this._readableB = exist(this._chunkB);
	}

	if (exist(this._chunkA) && exist(this._chunkB)) {
		if (this._compare(this._chunkA, this._chunkB) > 0) {

			chunk = this._chunkA;
			this._chunkA = null;

		} else {

			chunk = this._chunkB;
			this._chunkB = null;
		}
	} else if (this._endB && exist(this._chunkA)) {

		chunk = this._chunkA;
		this._chunkA = null;

	} else if (this._endA && exist(this._chunkB)) {

		chunk = this._chunkB;
		this._chunkB = null;
	}

	if (exist(chunk)) {
		this.push(chunk);
	}

	if (!exist(chunk) && this._endA && this._endB) {
		this.push(null);
	}
};

function exist(chunk) {
	return chunk !== null;
}

module.exports = MergeSortStream;
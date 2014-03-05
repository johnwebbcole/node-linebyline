module.exports = LineByLine;

var Transform = require('stream').Transform;
var util = require('util');
util.inherits(LineByLine, Transform);

function LineByLine(options) {
	if (!(this instanceof LineByLine)) return new LineByLine(options);
	this.buffer = '';
	this.hasheader = options.hasheader || true;
	this.line_number = 0;
	Transform.call(this, options);
}


LineByLine.prototype._transform = function(data, encoding, cb) {
	if (!this.encoding) {
		this.encoding = encoding || 'utf8';
	}

	if (Buffer.isBuffer(data)) {
		data = data.toString(encoding || 'utf8');
	}

	var parts = data.split(/\n|\r\n/g);

	if (this.buffer.length > 0) {
		parts[0] = this.buffer + parts[0];
	}

	for (var i = 0; i < parts.length - 1; i++) {
		if (!(this.hasheader && this.line_number === 0)) {
			this.push(parts[i], this.encoding);
		}
		this.line_number++;
	}

	this.buffer = parts[parts.length - 1];

	cb(null);
};

LineByLine.prototype._flush = function(cb) {
	if (this.buffer.length > 0) {
		this.push(buffer, this.encoding);
		this.line_number++;
	}
	cb();
};
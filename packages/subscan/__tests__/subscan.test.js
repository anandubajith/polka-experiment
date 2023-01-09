'use strict';

const subscan = require('..');
const assert = require('assert').strict;

assert.strictEqual(subscan(), 'Hello from subscan');
console.info("subscan tests passed");

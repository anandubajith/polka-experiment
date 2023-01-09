'use strict';

const apiWrapper = require('..');
const assert = require('assert').strict;

assert.strictEqual(apiWrapper(), 'Hello from apiWrapper');
console.info("apiWrapper tests passed");

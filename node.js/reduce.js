const fs = require('fs')
let output = fs
  .readFileSync('1.txt', 'utf8')
  .trim()
  .split('\n')
  .map(line => line.split('\t'))

console.log('🚀 ~ file: reduce.js ~ line 3 ~ output', output)

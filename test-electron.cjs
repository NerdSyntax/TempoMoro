const e = require('electron');
console.log('type:', typeof e);
console.log('keys:', Object.keys(e || {}).slice(0, 10).join(', '));

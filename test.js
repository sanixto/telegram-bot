'use strict';


Promise.reject(new Error('efewr'));

process.on('unhandledRejection', (reason, promise) => {
  console.log('Error' + reason + promise);
});

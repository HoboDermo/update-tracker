# update-tracker

[![Build Status](https://travis-ci.org/HoboDermo/update-tracker.svg?branch=master)](https://travis-ci.org/HoboDermo/update-tracker)

> A simple update tracker with pub/sub


## Install

```sh
$ npm install --save update-tracker
```


## Usage

```js

var tracker = new updateTracker();

//Id subscriber identifier
//Callback
tracker.subscribe('subscriber identifier', function(update) {
  console.log(update);
});

//Description
//Data
tracker.add('update description', { info: 'information' });
//=> { timestamp: 123456789, description: 'update description', data: { info: 'information' } }

//Description
//Data
//isPrivate true
tracker.add('next update description', { info: 'private info' }, true);
//=> NO OUTPUT

tracker.updates();
//=> [{ timestamp: 123456789, description: 'update description', data: { info: 'information' }, isPrivate: false }, { timestamp: 123456790, description: 'next update description', data: { info: 'private info' }, isPrivate: true }]

//PublicOnly true
tracker.updates(true);
//=> [{ timestamp: 123456789, description: 'update description', data: { info: 'information' }, isPrivate: false }]

//Id subscriber identifier
tracker.unsubscribe('subscriber identifier');

//Description
//Data
tracker.add('another update description', { info: 'more info' });
//=> NO OUTPUT
```


## License

MIT © Diarmuid Delaney
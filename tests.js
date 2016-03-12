var assert = require('assert');
var updateTracker = require('./update-tracker');

describe('add', function() {
  it('adds a public update and publishes it', function() {
    var tracker = new updateTracker();
    var description = "Update description";
    var data = { data: "values" };
    var result;
    var callback = function(update) {
      result = update;
    };
    tracker.subscribe("subscriber-id", callback);

    tracker.add(description, data);

    assert.equal(result.description, description);
    assert.deepEqual(result.data, data);
  });
  it('adds a private update and does not publishes it', function() {
    var tracker = new updateTracker();
    var description = "Update description";
    var data = { data: "values" };
    var result;
    var callback = function(update) {
      result = update;
    };
    tracker.subscribe("subscriber-id", callback);

    tracker.add(description, data, true);

    assert.equal(result, null);
  });
});

describe('updates', function() {
  it('gets all of the updates without parameters', function() {
    var tracker = new updateTracker();
    var description1 = "Update description 1";
    var data1 = { data: "values 1" };
    var description2 = "Update description 2";
    var data2 = { data: "values 2" };
    var description3 = "Update description 3";
    var data3 = { data: "values 3" };

    tracker.add(description1, data1, true);
    tracker.add(description2, data2);
    tracker.add(description3, data3, true);
    var updates = tracker.updates();

    assert.equal(updates.length, 3);
    assert.equal(updates[0].description, description1);
    assert.equal(updates[0].data, data1);
    assert.equal(updates[1].description, description2);
    assert.equal(updates[1].data, data2);
    assert.equal(updates[2].description, description3);
    assert.equal(updates[2].data, data3);
  });
  it('gets only the public updates when publicOnly is true', function() {
    var tracker = new updateTracker();
    var description1 = "Update description 1";
    var data1 = { data: "values 1" };
    var description2 = "Update description 2";
    var data2 = { data: "values 2" };
    var description3 = "Update description 3";
    var data3 = { data: "values 3" };

    tracker.add(description1, data1, true);
    tracker.add(description2, data2);
    tracker.add(description3, data3, true);
    var updates = tracker.updates(true);

    assert.equal(updates.length, 1);
    assert.equal(updates[0].description, description2);
    assert.equal(updates[0].data, data2);
  });
});

describe('subscribe', function() {
  it('throws an error when id is not a string', function() {
    var tracker = new updateTracker();

    var subscribe = function() {
      tracker.subscribe(null, function() {});
    };

    assert.throws(subscribe, TypeError);
  });
  it('throws an error when callback is not a function', function() {
    var tracker = new updateTracker();

    var subscribe = function() {
      tracker.subscribe('subscriber identifier', 'not a function');
    };

    assert.throws(subscribe, TypeError);
  });
  /*it('registers the subscriber to receive public updates', function() {
    //tested in add#adds a public update and publishes it
  });*/
  /*it('does not execute callback on private updates', function() {
    //tested in add#adds a private update and does not publishes it
  });*/
  it('registers multiple subscribers to receive public updates', function() {
    var tracker = new updateTracker();
    var description = "Update description";
    var data = { data: "values" };
    var result1, result2;
    var callback1 = function(update) {
      result1 = update;
    };
    var callback2 = function(update) {
      result2 = update;
    };
    tracker.subscribe("subscriber-id-1", callback1);
    tracker.subscribe("subscriber-id-2", callback2);

    tracker.add(description, data);

    assert.equal(result1.description, description);
    assert.deepEqual(result1.data, data);
    assert.equal(result2.description, description);
    assert.deepEqual(result2.data, data);
  });
  it('replaces callback if subscribe identifier already exists', function() {
    var tracker = new updateTracker();
    var description = "Update description";
    var data = { data: "values" };
    var result1, result2;
    var callback1 = function(update) {
      result1 = update;
    };
    var callback2 = function(update) {
      result2 = update;
    };
    tracker.subscribe("subscriber-id", callback1);
    tracker.subscribe("subscriber-id", callback2);

    tracker.add(description, data);

    assert.equal(result1, null);
    assert.equal(result2.description, description);
    assert.deepEqual(result2.data, data);
  });
});

describe('unsubscribe', function() {
  it('throws an error when id is not a string', function() {
    var tracker = new updateTracker();

    var unsubscribe = function() {
      tracker.unsubscribe(null);
    };

    assert.throws(unsubscribe, TypeError);
  });
  it('removes a subscriber from receiving public updates', function() {
    var tracker = new updateTracker();
    var description = "Update description";
    var data = { data: "values" };
    var result1, result2;
    var callback1 = function(update) {
      result1 = update;
    };
    var callback2 = function(update) {
      result2 = update;
    };
    tracker.subscribe("subscriber-id-1", callback1);
    tracker.subscribe("subscriber-id-2", callback2);
    tracker.unsubscribe("subscriber-id-1");

    tracker.add(description, data);

    assert.equal(result1, null);
    assert.equal(result2.description, description);
    assert.deepEqual(result2.data, data);
  });
});

/**
 * Construct a new update tracker
 * @class UpdateTracker
 */
function UpdateTracker() {
  var updates = [];
  var subscribers = {};

  /**
   * Add a new update and publish to subscribers if not private.
   *
   * @param {string} description - the description of the update
   * @param {object} data - the data belonging to the update
   * @param {boolean} [isPrivate=false] - when true do not publish update
   */
  this.add = function(description, data, isPrivate) {
    var timestamp = Date.now();
    var update = {
      timestamp: timestamp,
      description: description,
      data: data,
      isPrivate: !!isPrivate
    };
    updates.push(update);
    if(!isPrivate) {
      publish(update);
    }
  };

  /**
   * Get the updates
   *
   * @param {boolean} [publicOnly=false] - when true only return public updates
   */
  this.updates = function(publicOnly) {
    if(publicOnly) {
      return updates.filter(function(update) {
        return !update.isPrivate;
      });
    }
    return updates.slice();
  };

  /**
   * Subscribe to receive public updates
   *
   * @param {string} id - subscriber identifier
   * @param {function} callback - the function to be called with each update
   */
  this.subscribe = function(id, callback) {
    if(typeof id !== 'string') throw new TypeError('Id must be a string');
    if(typeof callback !== 'function') throw new TypeError('Callback must be a function');
    subscribers[id] = callback;
  };

  /**
   * Unsubscribe from public updates
   *
   * @param {string} id - subscriber identifier
   */
  this.unsubscribe = function(id) {
    if(typeof id !== 'string') throw new TypeError('Id must be a string');
    if(subscribers.hasOwnProperty(id)) {
      delete subscribers[id];
    }
  };

  function publish(update) {
    var output = {
      timestamp: update.timestamp,
      description: update.description,
      data: update.data
    };
    for(var id in subscribers) {
      if(subscribers.hasOwnProperty(id)) {
        subscribers[id](output);
      }
    }
  }

}

module.exports = UpdateTracker;
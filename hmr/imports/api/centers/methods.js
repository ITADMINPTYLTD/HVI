import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { Centers } from './centers.js';

export const insertCenter = new ValidatedMethod({
  name: 'centers.insert',
  validate: Centers.simpleSchema().pick(['name', 'ip', 'code']).validator({ clean: true, filter: false }),
  run({ name, ip, code}) {
    if (!this.userId){
      throw new Meteor.Error(403, "Not authorized to add center");
    }
    const centers = {
      name,
      ip,
      code,
      createdAt: new Date(),
    };
    return Centers.insert(centers);
  },
});

export const updateCenter = new ValidatedMethod({
  name: 'centers.update',
  validate: new SimpleSchema({
    _id: Centers.simpleSchema().schema('_id'),
    name: Centers.simpleSchema().schema('name'),
    ip: Centers.simpleSchema().schema('ip'),
    code: Centers.simpleSchema().schema('code'),
  }).validator({ clean: true, filter: false }),
  run({ _id, name, ip, code }) {
    if (this.userId)
    {
      throw new Meteor.Error(403, "Not authorized to update theme");
    }
    Centers.update(_id, {
      $set: {
        name: (_.isUndefined(name) ? null : name),
        ip: (_.isUndefined(ip) ? null : ip),
        code: (_.isUndefined(code) ? null : code)
      },
    });
  },
});


export const removeCenter = new ValidatedMethod({
  name: 'centers.remove',
  validate: new SimpleSchema({
    _id: Centers.simpleSchema().schema('_id'),
  }).validator({ clean: true, filter: false }),
  run({ _id }) {
    if (!this.userId)
    {
      throw new Meteor.Error(403, "Not authorized to remove theme");
    }
    Centers.remove(_id);
  },
});

// Get client of all method names on Centers
const CENTERS_METHODS = _.pluck([
  insertTheme,
  updateTheme,
  removeTheme,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 Centers operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(CENTERS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}

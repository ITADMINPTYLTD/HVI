import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { Doctors } from './doctors.js';

export const insertCenter = new ValidatedMethod({
  name: 'doctors.insert',
  validate: Doctors.simpleSchema().pick(['name', 'ip', 'code']).validator({ clean: true, filter: false }),
  run({ name, ip, code}) {
    if (!this.userId){
      throw new Meteor.Error(403, "Not authorized to add center");
    }
    const doctors = {
      name,
      ip,
      code,
      createdAt: new Date(),
    };
    return Doctors.insert(doctors);
  },
});

export const updateCenter = new ValidatedMethod({
  name: 'doctors.update',
  validate: new SimpleSchema({
    _id: Doctors.simpleSchema().schema('_id'),
    name: Doctors.simpleSchema().schema('name'),
    ip: Doctors.simpleSchema().schema('ip'),
    code: Doctors.simpleSchema().schema('code'),
  }).validator({ clean: true, filter: false }),
  run({ _id, name, ip, code }) {
    if (this.userId)
    {
      throw new Meteor.Error(403, "Not authorized to update theme");
    }
    Doctors.update(_id, {
      $set: {
        name: (_.isUndefined(name) ? null : name),
        ip: (_.isUndefined(ip) ? null : ip),
        code: (_.isUndefined(code) ? null : code)
      },
    });
  },
});


export const removeCenter = new ValidatedMethod({
  name: 'doctors.remove',
  validate: new SimpleSchema({
    _id: Doctors.simpleSchema().schema('_id'),
  }).validator({ clean: true, filter: false }),
  run({ _id }) {
    if (!this.userId)
    {
      throw new Meteor.Error(403, "Not authorized to remove theme");
    }
    Doctors.remove(_id);
  },
});

// Get client of all method names on Doctors
const DOCTORS_METHODS = _.pluck([
  insertTheme,
  updateTheme,
  removeTheme,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 Doctors operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(DOCTORS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}

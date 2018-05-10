import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Doctors } from '../doctors.js';

Meteor.publish("doctors", function () {
  if (!this.userId)
  {
    throw new Meteor.Error(403, "You need to login to fetch information");
  }
  return Doctors.find({});
});

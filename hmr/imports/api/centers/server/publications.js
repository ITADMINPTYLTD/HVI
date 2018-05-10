import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Centers } from '../centers.js';

Meteor.publish("centers", function () {
  if (!this.userId)
  {
    throw new Meteor.Error(403, "You need to login to fetch information");
  }
  return Centers.find({});
});

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Settings } from '../settings.js';

Meteor.publish("settings", function () {
  if (!this.userId)
  {
    throw new Meteor.Error(403, "You need to login to fetch information");
  }
  return Settings.find({});
});

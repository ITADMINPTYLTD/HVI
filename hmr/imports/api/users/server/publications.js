import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { UserSchema } from '../users.js';

Meteor.publish("users", function () {
    if (this.userId)
    {
        return Meteor.users.find({_id: this.userId}, { fields: Meteor.users.publicFields });
    }
    if (!this.userId)
    {
        throw new Meteor.Error(403, "Not authorized to get users information");
    }
    return Meteor.users.find({_id:{$ne: this.userId}}, { fields: Meteor.users.publicFields });
});

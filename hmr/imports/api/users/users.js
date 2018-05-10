import { Mongo } from 'meteor/mongo'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Accounts } from 'meteor/accounts-base'

Schema = {};

Schema.User = new SimpleSchema({
  username: {
    type: String
  },
  emails: {
    type: Array,
    optional: true
  },
  "emails.$": {
    type: Object
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  createdAt: {
    type: Date
  },
  // Make sure this services field is in your schema if you're using any of the accounts packages
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true
  },
  firstName: {
    type: String,
    optional: true
  },
  lastName: {
    type: String,
    optional: true
  }
})

Meteor.users.attachSchema(Schema.User);

Meteor.users.publicFields = {
    username: 1,
    emails: 1,
    firstName: 1,
    lastName: 1,
    createdAt: 1
};

export const UserSchema = Schema.User;

export const ROLES = {
    ADMIN: "admin",
    NURSE: "nurse",
    DOCTOR: "doctor"
};

// Deny all client-side updates to user documents
Meteor.users.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});

if(Meteor.isServer) {
    Accounts.onCreateUser(function(options, user) {
        if(options.firstName)
        {
            user.firstName = options.firstName;
        }
        if(options.lastName)
        {
            user.lastName = options.lastName;
        }
        if(options.presentationMachineId)
        {
            user.presentationMachineId = options.presentationMachineId;
        }
        return user;
    });
}

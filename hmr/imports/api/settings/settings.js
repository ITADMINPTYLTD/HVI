import { Mongo } from 'meteor/mongo'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

class SettingsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.createdAt = ourDoc.createdAt || new Date();
    const result = super.insert(ourDoc, callback);
    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }
  remove(selector) {
    const result = super.remove(selector);
    return result;
  }
}

export const Settings = new SettingsCollection('settings');

// Deny all theme-side updates since we will be using methods to manage this collection
Settings.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

Settings.schema = new SimpleSchema({
  serverApi: {
    type: String,
    regEx: SimpleSchema.RegEx.IP
  },
  serverPort:{
    type: Number,
    optional: true
  },
  projectName: {
    type: String
  },
  projectCode: {
    type: String,
    optional: true
  },
  productOwner: {
    type: String
  },
  version: {
    type: String,
  },
  yearRelease: {
    type: Number
  },
  createdBy: {
    type: String,
    optional: true
  },
  contactInfo: {
    type: Object
  },
  'contactInfo.$.title':{
    type: String
  },
  'contactInfo.$.place':{
    type: String
  },
  'contactInfo.$.phone':{
    type: String
  },
  'contactInfo.$.email':{
    type: String
  },
  aboutInfo: {
    type: Object
  },
  'aboutInfo.$.title': {
    type: String
  },
  'aboutInfo.$.description': {
    type: String
  },
  createdAt: {
    type: Date
  },
  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true
  }
})


Settings.attachSchema(Settings.schema);

// This represents the keys from Settings objects that should be published
// to the theme. If we add secret properties to Settings objects, don't list
// them here to keep them private to the server.
Settings.publicFields = {
  serverApi: 1,
  serverPort: 1,
  projectName: 1,
  projectCode: 1,
  productOwner: 1,
  version: 1,
  yearRelease: 1,
  createdBy: 1,
  contactInfo: 1,
  aboutInfo: 1
};

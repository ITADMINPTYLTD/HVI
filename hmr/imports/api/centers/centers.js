import { Mongo } from 'meteor/mongo'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

class CentersCollection extends Mongo.Collection {
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

export const Centers = new CentersCollection('centers');

// Deny all theme-side updates since we will be using methods to manage this collection
Centers.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});


Centers.schema = new SimpleSchema({
  name: {
    type: String
  },
  ip: {
    type: String,
    regEx: SimpleSchema.RegEx.IP,
    optional: true
  },
  code: {
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


Centers.attachSchema(Centers.schema);

// This represents the keys from Centers objects that should be published
// to the theme. If we add secret properties to Centers objects, don't list
// them here to keep them private to the server.
Centers.publicFields = {
  name: 1,
  ip: 1,
  code: 1,
  createdAt: 1
};

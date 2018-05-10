import { Mongo } from 'meteor/mongo'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

class DoctorCollection extends Mongo.Collection {
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

export const Doctors = new DoctorsCollection('doctors');

// Deny all theme-side updates since we will be using methods to manage this collection
Doctors.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

Doctors.schema = new SimpleSchema({
  name: {
    type: String
  },
  codeSite: {
    type: String
  },
  isActive: {
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


Doctors.attachSchema(Doctors.schema);

// This represents the keys from Doctors objects that should be published
// to the theme. If we add secret properties to Doctors objects, don't list
// them here to keep them private to the server.
Doctors.publicFields = {
  name: 1,
  codeSite: 1,
  isActive: 1,
  createdAt: 1
};

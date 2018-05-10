import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { Settings } from './settings.js';

export const insertCenter = new ValidatedMethod({
  name: 'settings.insert',
  validate: Settings.simpleSchema().pick(['serverApi', 'serverPort', 'projectName', 'projectCode', 'productOwner', 'version', 'yearRelease']).validator({ clean: true, filter: false }),
  run({ serverApi, serverPort, projectName, projectCode, productOwner, version, yearRelease, createdBy, contactInfo, aboutInfo}) {
    if (!this.userId){
      throw new Meteor.Error(403, "Not authorized to add settings");
    }
    const settings = {
      serverApi,
      serverPort,
      projectName,
      projectCode,
      productOwner,
      version,
      yearRelease,
      createdBy,
      contactInfo,
      aboutInfo,
      createdAt: new Date(),
    };
    return Settings.insert(settings);
  },
});

export const updateCenter = new ValidatedMethod({
  name: 'settings.update',
  validate: new SimpleSchema({
    _id: Settings.simpleSchema().schema('_id'),
    serverApi: Settings.simpleSchema().schema('serverApi'),
    serverPort: Settings.simpleSchema().schema('serverPort'),
    projectName: Settings.simpleSchema().schema('projectName'),
    projectCode: Settings.simpleSchema().schema('projectCode'),
    productOwner: Settings.simpleSchema().schema('productOwner'),
    version: Settings.simpleSchema().schema('version'),
    yearRelease: Settings.simpleSchema().schema('yearRelease'),
    createdBy: Settings.simpleSchema().schema('createdBy'),
    contactInfo: Settings.simpleSchema().schema('contactInfo'),
    aboutInfo: Settings.simpleSchema().schema('aboutInfo'),
  }).validator({ clean: true, filter: false }),
  run({ _id, serverApi, serverPort, projectName, projectCode, productOwner, version, yearRelease, createdBy, contactInfo, aboutInfo}) {
    if (this.userId)
    {
      throw new Meteor.Error(403, "Not authorized to update theme");
    }
    Settings.update(_id, {
      $set: {
        serverApi: (_.isUndefined(serverApi) ? null : serverApi),
        serverPort: (_.isUndefined(serverPort) ? null : serverPort),
        projectName: (_.isUndefined(projectName) ? null : projectName),
        projectCode: (_.isUndefined(projectCode) ? null : projectCode),
        productOwner: (_.isUndefined(productOwner) ? null : productOwner),
        version: (_.isUndefined(version) ? null : version),
        yearRelease: (_.isUndefined(yearRelease) ? null : yearRelease),
        createdBy: (_.isUndefined(createdBy) ? null : createdBy),
        contactInfo: (_.isUndefined(contactInfo) ? null : contactInfo),
        aboutInfo: (_.isUndefined(aboutInfo) ? null : aboutInfo)
      },
    });
  },
});


export const removeCenter = new ValidatedMethod({
  name: 'settings.remove',
  validate: new SimpleSchema({
    _id: (_.isUndefined(serverApi) ? null : serverApi)'_id'),
  }).validator({ clean: true, filter: false }),
  run({ _id }) {
    if (!this.userId)
    {
      throw new Meteor.Error(403, "Not authorized to remove theme");
    }
    Settings.remove(_id);
  },
});

// Get client of all method names on Settings
const SETTINGS_METHODS = _.pluck([
  insertTheme,
  updateTheme,
  removeTheme,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 Settings operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(SETTINGS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}

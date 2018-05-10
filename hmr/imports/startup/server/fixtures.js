import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Centers } from '../../api/centers/centers'
import { Settings } from '../../api/settings/settings'
import {UserSchema, ROLES} from '../../api/users/users.js';

Meteor.methods({
    'resetDatabase'() {
        if(!Meteor.isServer)
        {
            console.log("From Client. Rejecting...");
            return;
        }
        console.log("Resetting Database");

        Meteor.users.remove({});
    },
    'fixtures.userData'() {
        if(!Meteor.isServer)
        {
            console.log("From Client. Rejecting...");
            return;
        }

        let adminObject = {
            username: 'admin',
            email: 'camilop@itadmin.com',
            firstName: 'Admin',
            lastName: 'User',
            password: 'admin@Medi7',
            role: ROLES.ADMIN
        };
        console.log("Create User Data");
        let adminId = Accounts.createUser(adminObject);
        console.log('Admin User:'+adminId)

        let nurseUser = {
            username: 'nurse',
            email: 'nurse@test.com',
            firstName: 'nurse',
            lastName: 'test',
            password: 'nurse@Medi7',
            role: ROLES.NURSE
        };
        let nurseId = Accounts.createUser(nurseUser);
        console.log('Nurse Data:'+nurseId)

        let doctorUser = {
            username: 'doctor',
            email: 'doctor@test.com',
            firstName: 'doctor',
            lastName: 'test',
            password: 'doctor@Medi7',
            role: ROLES.DOCTOR
        };
        let doctorId = Accounts.createUser(doctorUser);
        console.log('Doctor Data:'+doctorId)


    },
    'fixtures.centerData'(){

      console.log("Create Centers Data");
      const centersData = [["Bentleigh", "bent"], ["Chadstone","chad"],
                             ["Clayton","clay"], ["Mooroolbark","moor"],
                             ["St. Kilda", "stkd"], ["Lilydale", "lily"]]

      console.log("Create Centers Data");

      centersData.forEach((c) => {
        let centerData = {
          name: c[0],
          ip: '',
          code: c[1]
        }
        Centers.insert(centerData);
      })
    },
    'fixtures.settingsData'(){
      if(!Meteor.isServer)
      {
          console.log("From Client. Rejecting...");
          return;
      }

      let contactObject = {
        title: 'Contact',
        place: 'Medi7 Head Office',
        phone: '20000',
        email: 'support@itadmin.com.au'
      }

      let aboutObject = {
        title: 'About',
        description: 'This webpage is to help our nurses access HMR list more efficiency. Only limited info will be provided on this webpage'
      }

      let settingsObject = {
        serverApi: '192.168.10.103',
        serverPort: 3333,
        projectName: 'HMR',
        projectCode: 'hmr',
        productOwner: 'Medi7',
        version: '0.1',
        yearRelease: 2016,
        createdBy: 'Camilo Pestana',
        contactInfo: {
          title: 'Contact',
          place: 'Medi7 Head Office',
          phone: '20000',
          email: 'support@itadmin.com.au'
        },
        aboutInfo: {
          title: 'About',
          description: 'This webpage is to help our nurses access HMR list more efficiency. Only limited info will be provided on this webpage'
        }
      };

      console.log("Create Settings Data");
      Settings.insert(settingsObject);
    }
})

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  console.log('Startup ...')
  if(Meteor.users.find({}).count() === 0){
    Meteor.call('fixtures.userData')
  }
  if(Centers.find({}).count() === 0){
    Meteor.call('fixtures.centerData')
  }
  if(Settings.find({}).count() === 0){
    Meteor.call('fixtures.settingsData')
  }
})

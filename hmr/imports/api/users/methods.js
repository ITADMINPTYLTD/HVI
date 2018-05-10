import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { UserSchema } from './users.js';

export const insertUser = new ValidatedMethod({
    name: 'users.insert',
    //validate: UserSchema.pick(['username', 'firstName', 'lastName']).validator({ clean: true, filter: false }),
    validate: new SimpleSchema({
        firstName: UserSchema.schema('firstName'),
        lastName: UserSchema.schema('lastName'),
        username: UserSchema.schema('username'),
        email: { type: String, optional: true},
        password: { type: String},
        role: {type: String, optional: true},
    }).validator({ clean: true, filter: false }),

    run({ username, firstName, lastName, password, email}) {
        const user = {
            username,
            firstName,
            lastName,
            password,
            createdAt: new Date()
        };
        if(email)
        {
            user.email = email;
        }

        if(role){
          user.role = role
        }

        var newUserId = Accounts.createUser(user);
        return newUserId;
    }
});

export const updateUser = new ValidatedMethod({
    name: 'users.update',
    validate: new SimpleSchema({
        _id: { type: String},
        firstName: UserSchema.schema('firstName'),
        lastName: UserSchema.schema('lastName')
    }).validator({ clean: true, filter: false }),
    run({ _id, firstName, lastName }) {
        if (_id != this.userId)
        {
            throw new Meteor.Error(403, "Not authorized to update");
        }

        Meteor.users.update(_id, {
            $set: {
                firstName: (_.isUndefined(firstName) ? null : firstName),
                lastName: (_.isUndefined(lastName) ? null : lastName)
            }
        });
    }
});


export const removeUser = new ValidatedMethod({
    name: 'users.remove',
    validate: new SimpleSchema({
        _id: { type: String},
    }).validator({ clean: true, filter: false }),
    run({ _id }) {
        if (this.userId)
        {
            throw new Meteor.Error(403, "Not authorized to remove");
        }
        Meteor.users.remove(_id);
    },
});

 //Get client of all method names on Users
const USERS_METHODS = _.pluck([
    insertUser,
    updateUser,
    removeUser
], 'name');

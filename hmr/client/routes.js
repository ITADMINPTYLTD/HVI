import React from 'react'
import { Meteor } from 'meteor/meteor';
import { mount } from 'react-mounter'

//Pages
import LoginPage from '/imports/ui/pages/LoginPage'
import MainPage from '/imports/ui/pages/MainPage'
import NursePage from '/imports/ui/pages/NursePage'
import DoctorPage from '/imports/ui/pages/DoctorPage'
import AppointmentsPage from '/imports/ui/pages/AppointmentsPage'
import AboutPage from '/imports/ui/pages/AboutPage'
import ContactPage from '/imports/ui/pages/ContactPage'
import Page404 from '/imports/ui/pages/Page404'
//Layouts
import MainLayout from '/imports/ui/layouts/MainLayout'
//Nav
import TopNav from '/imports/ui/components/TopNav'
//Roles

import { ROLES } from '/imports/api/users/users.js';
//Subscription Manager
subsManager = new SubsManager();
// Track if the user is suddendly logout ( session expire etc..)
Tracker.autorun(function(c) {
  var userId = Meteor.userId();
  if (c.firstRun)
    return;
  if(!userId){
    FlowRouter.go('/login');
  }
});

FlowRouter.route('/404',{
  name : '404',
  action(){
    mount(Page404)
  }
})

FlowRouter.notFound = {
  action: function() {
    mount(Page404)
  }
}

const authenticatedRoutes = FlowRouter.group(
  { name: 'authenticated',
    triggersEnter: [function(context, redirect) {
      //Not Authorized
      if(!Meteor.userId()){
        FlowRouter.go('/login')
      }
    }]}
);


// reRoute the user to the proper page if he or she has a userId
FlowRouter.route('/',{
  triggersEnter: [(context, redirect)=>{
    const userId = Meteor.userId()
    const redirectAfterLogin = Session.get('redirectAfterLogin')
    if(userId){
      Tracker.autorun(()=>{
        if(Meteor.userId() && Meteor.user()){
          let user = Meteor.user()
          if(Meteor.user().username === 'admin'){
            const go = '/admin'
            return FlowRouter.go(go);
          }
          if(Meteor.user().username === 'nurse'){
            return FlowRouter.go('/nurse');
          }
          if(Meteor.user().username === 'doctor'){
            return FlowRouter.go('/doctor');
          }
        }
      })
      // If no roles sent it back to the login
      return FlowRouter.go('/login');
    }
    return FlowRouter.go('/login');
  }],
})

authenticatedRoutes.route('/appointments',{
  name: 'Appointments',
  action(){
    mount(MainLayout, {
      navbar: () => (<TopNav type='admin'/>),
      content: () => (<AppointmentsPage />)
    })
  }
})

authenticatedRoutes.route('/about',{
  name: 'About',
  action(){
    mount(MainLayout, {
      navbar: () => (<TopNav />),
      content: () => (<AboutPage />)
    })
  }
})

authenticatedRoutes.route('/contact',{
  name: 'Contact',
  action(){
    mount(MainLayout, {
      navbar: () => (<TopNav />),
      content: () => (<ContactPage />)
    })
  }
})

authenticatedRoutes.route('/admin',{
  name: 'Admin',
  action(){
    mount(MainLayout, {
      navbar: () => (<TopNav type='admin'/>),
      content: () => (<MainPage />)
    })
  }
})
authenticatedRoutes.route('/nurse',{
  name: 'Nurse',
  action(){
    mount(MainLayout, {
      navbar: () => (<TopNav type='admin'/>),
      content: () => (<MainPage />)
    })
  }
})

// Doctor routes groups

authenticatedRoutes.route('/doctor/:codeSite/:idDoctor',{
  name: 'Doctor',
  action(params, queryParams){
    var route;
    if(!(Meteor.loggingIn() &&  Meteor.userId().username === 'doctor')){
      route = FlowRouter.current();
      if (route.route.name !== '/login') {
        FlowRouter.go(route.path);
      }else{
        return FlowRouter.go('/login');
      }
    }
    mount(MainLayout, {
      navbar: () => (<TopNav type='doctor'/>),
      content: () => (<DoctorPage codeSite={params.codeSite} idDoctor={params.idDoctor}/>)
    })
  }
})

FlowRouter.route('/login',{
  name : 'Login',
  action(){
    mount(MainLayout, {
      navbar: () => (''),
      content: () => (<LoginPage />)
    })
  }
})

import { Meteor } from 'meteor/meteor';
import { Fetch } from 'node-fetch'
import { HTTP } from 'meteor/http'
import settingsAPI from './settingsAPI'

//settings.json file properties
var server = Meteor.settings.server
var port = Meteor.settings.port

Meteor.methods({
    getResults: (codesite) => {
      let accessPoint = `http://${server}:${port}/api/hmr/${codesite}`
      console.log(accessPoint)
      var result =  HTTP.get(accessPoint)
      return result.content;
    },
    getAppointments: (codesite) => {
      let accessPoint = `http://${server}:${port}/api/appointment?codeAction=appointment&codeSite=${codesite}`
      console.log(accessPoint)
      var result =  HTTP.get(accessPoint)
      return result.content;
    },
	getAppointmentsByDate: (codesite, date) => {
      let accessPoint = `http://${server}:${port}/api/appointment?codeAction=appointmentsByDate&codeSite=${codesite}&date=${date}`
      console.log(accessPoint)
      var result =  HTTP.get(accessPoint)
      return result.content;
    },
    getAppointmentByDoctor: (idDoctor, codeSite, date) => {
      console.log('getAppointmentByDoctor: '+idDoctor+' '+codeSite+' '+date)
      let accessPoint = `http://${server}:${port}/api/appointment?codeAction=appointmentByDoctor&codeSite=${codeSite}&encodedId=${idDoctor}&date=${date}`
      console.log(accessPoint)
      var result =  HTTP.get(accessPoint)
      return result.content;
    },
    getItems: (codesite) => {
      let accessPoint = `http://${server}:${port}/api/appointment?codeAction=items&codeSite=${codesite}`
      console.log(accessPoint)
      var result =  HTTP.get(accessPoint)
      return result.content;
    },
    getItemsIds: (id,codesite) => {
      let accessPoint = `http://${server}:${port}/api/appointment?codeAction=itemsByAppointment&codeSite=${codesite}&paramId=${id}`
      console.log(accessPoint)
      var result =  HTTP.get(accessPoint)
      return result.content;
    },
    postData: (body) => {
      let accessPoint = `http://${server}:${port}/api/appointment`
      console.log(accessPoint)
      console.log(JSON.stringify(body))
      var result =  HTTP.post(accessPoint, {data : body})
      return result
    },
    putData: (body, id) => {
      let accessPoint = `http://${server}:${port}/api/appointment/${id}`
      console.log('PUT:'+accessPoint)
      console.log(JSON.stringify(body))
      var result =  HTTP.put(accessPoint, {data : body})
      return result
    },
})

// External dependencies
const express = require('express');
const router = express.Router();
const http = require('http')
const version = 'v1';

// add scenarios here - change session data
router.get('/' + version + '/alice-nominates-bob', function (req, res) {
    req.session.data['hasLogin'] = true;
    res.render(version + '/email/delegate-invite');
})

router.get('/' + version + '/research-flow-bob', function(req, res) {
    req.session.data = {}; // reset the data
    console.log('Im here')
    res.render(version + '/email/delegate-invite');
})

router.get('/' + version + '/research-flow-alice', function(req, res) {
    req.session.data = {}; // reset the data
    console.log('Im here')
    http.get("http://delegated-access-nhslogin.herokuapp.com", function(e) {});
    http.get("http://delegated-access.herokuapp.com/", function(e) {});
    http.get("http://manage-nhs-login.herokuapp.com/", function(e) {});
    res.redirect('/' + version + '/primary-user-details');

})

router.get('/' + version + '/alice-adds-bob-as-delegator', function (req, res) {
    req.session.data = {}
    req.session.data['hasLogin'] = true;
    res.render(version + 'service/select-single-service');
})

router.post('/' + version + '/nhs-login', function (req, res) {

    var nhsNumber = req.session.data['nhs-login'];
    
    if (nhsNumber == "Yes"){
      res.redirect('/' + version + '/login/login-details')
    }
    else {
      res.redirect('/' + version + '/login/login-details')
    }
})

router.post('/' + version + '/login/login-details', function(req, res) {

    // we check here if the user already has nhs login
    // we also check if the user has already consented to the service

    var hasLogin = req.session.data['hasLogin'] || true;
    var serviceConsent = req.session.data['serviceConsent'] || false;

        if (hasLogin === true) {
            if (serviceConsent === true) {
                // login then go straight into the service
                console.log('user has given consent')
                res.redirect('/' + version + '/service/service-logged-in')
            } else {
                // go to the service consent page
                console.log('user has not given consent');
                res.redirect('/' + version + '/service/nhslogin-consent');
            }
        } else {
        }
})

router.post('/' + version + '/add-delegate/delegate-relationship', function(req, res) {
    
    var relationship = req.session.data['relationship'];
    console.log('relationship')
    if (relationship === '1') {
        res.redirect('/' + version + '/add-delegate/delegate-relationship-1');

    } if (relationship === '2') {
        res.redirect('/' + version + '/add-delegate/delegate-relationship-2');

    } if (relationship === '3') {
        res.redirect('/' + version + '/add-delegate/delegate-relationship-3');
            
    } if (relationship === '4') {
        res.redirect('/' + version + '/add-delegate/delegate-relationship-4');
   
    } if (relationship === '5') {
        res.redirect('/' + version + '/add-delegate/delegate-relationship-5');

    } else {
        res.redirect('/' + version + '/add-delegate/delegate-nhs-no-1');
    }
})

router.get('/' + version + '/service/nhslogin-consent', function(req, res) {
    // get the status of the ID check
    req.session.data['id'] = req.query.id || 'passed';
    console.log("ID check has: " + req.session.data['id']);

    res.render(version + '/service/nhslogin-consent');
})

router.post('/' + version + '/service/nhslogin-consent', function(req, res) {
    var givesConsent = req.session.data['givesConsent'];

    if (givesConsent === 'yes') {
        res.redirect('/' + version + '/service/nhslogin-success');
    } else {
        res.redirect('/' + version + '/service/nhslogin-rejected');
    }
})

router.post('/' + version + '/service/select-single-service', function(req, res) {
    var service = req.session.data['selectSingleService'];

    if (service === 'notFound') {
        res.redirect('/' + version + '/service/select-service-not-listed');
    } else {
        // set the service throughout
        req.session.data['service'] = service;
        res.redirect('/' + version + '/add-delegate/delegate-preflight');
    }
})

router.post('/' + version + '/login-as', function (req, res) {

    // Make a variable and give it the value from 'know-nhs-number'
    var proxy = req.session.data['proxy']
  
    // Check whether the variable matches a condition
    if (proxy == "Yourself"){
      // Send user to next page
      res.redirect('/' + version + '/service/service-page-logged-in')
    }
    else {
      // Send user to ineligible page
      res.redirect('/' + version + '/service/service-page-consent')
    }
})

router.post('/' + version + '/login/login-triage', function (req, res) {

    // Make a variable and give it the value from 'know-nhs-number'
    var triage = req.session.data['triage']
  
    // Check whether the variable matches a condition
    if (triage == "AsYourself"){
      // Send user to next page
      res.redirect('/' + version + '/service/service-logged-in')
    }
    if (triage == "AsSomeoneElse"){
        // Send user to next page
        res.redirect('/' + version + '/login/login-as-list')
    }
      if (triage == "Delegate"){
        // Send user to next page
        res.redirect('/' + version + '/add-delegate/delegate-preflight')
    }
})

router.post('/' + version + '/login/login-as-list', function (req, res) {

    // Make a variable and give it the value from 'know-nhs-number'
    var delegate = req.session.data['delegate']
  
    // Check whether the variable matches a condition
    if (delegate == "Alice"){
      // Send user to next page
      res.redirect('/' + version + '/service/service-logged-in')
    }
    if (delegate == "Tom"){
        // Send user to next page
        res.redirect('/' + version + '/service/service-logged-in')
    }
      if (delegate == "Harriet"){
        // Send user to next page
        res.redirect('/' + version + '/service/service-logged-in')
    }
})

module.exports = router;
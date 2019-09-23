// External dependencies
const express = require('express');
const router = express.Router();
const http = require('http');

function getVersion(a) {
    return a || 'v1';
}

// add scenarios here - change session data
router.get('/*/alice-nominates-bob', function (req, res) {
    req.session.data['hasLogin'] = true;
    console.log(getVersion(req.query.version))
    res.render(req.url.substring(1,3) + '/email/delegate-invite');
})

router.get('/*/research-flow-bob', function(req, res) {
    req.session.data = {}; // reset the data
    //console.log('Im here')
    res.render(getVersion(req.query.version) + '/email/delegate-invite');
})

// testing version controlling routing
router.get('/*/research-flow-alice', function(req, res) {
    req.session.data = {}; // reset the data
    //console.log(getVersion(req.query.version));
    http.get("http://delegated-access-nhslogin.herokuapp.com", function(e) {});
    http.get("http://delegated-access.herokuapp.com/", function(e) {});
    http.get("http://manage-nhs-login.herokuapp.com/", function(e) {});
    res.redirect('/' + getVersion(req.query.version) + '/primary-user-details');

})

router.get('/*/research-flow-alice', function(req, res) {
    req.session.data = {}; // reset the data
    http.get("http://delegated-access-nhslogin.herokuapp.com", function(e) {});
    http.get("http://delegated-access.herokuapp.com/", function(e) {});
    http.get("http://manage-nhs-login.herokuapp.com/", function(e) {});
    res.redirect('/' + getVersion(req.query.version) + '/primary-user-details');

})

router.get('/*/alice-adds-bob-as-delegator', function (req, res) {
    req.session.data = {}
    req.session.data['hasLogin'] = true;
    res.render(getVersion(req.query.version) + 'service/select-single-service');
})

router.post('/*/add-delegate/delegate-nhs-no-1', function(req, res) {
    req.session.data['hasNHSNumber'];

    if (req.session.data['hasNHSNumber'] == 'yes') {
        res.redirect('/' + getVersion(req.query.version) + '/add-delegate/delegate-nhs-no-2');
    } else {
        res.redirect('/' + getVersion(req.query.version) + '/add-delegate/delegate-dob');
    }
})

router.post('/*/nhs-login', function (req, res) {

    var nhsNumber = req.session.data['nhs-login'];
    
    if (nhsNumber == "Yes"){
      res.redirect('/' + getVersion(req.query.version) + '/login/login-details')
    }
    else {
      res.redirect('/' + getVersion(req.query.version) + '/login/login-details')
    }
})

router.post('/*/login/login-details', function(req, res) {

    // we check here if the user already has nhs login
    // we also check if the user has already consented to the service

    var hasLogin = req.session.data['hasLogin'] || true;
    var serviceConsent = req.session.data['serviceConsent'] || false;

        if (hasLogin === true) {
            if (serviceConsent === true) {
                // login then go straight into the service
                console.log('user has given consent')
                res.redirect('/' + getVersion(req.query.version) + '/service/service-logged-in')
            } else {
                // go to the service consent page
                console.log('user has not given consent');
                res.redirect('/' + getVersion(req.query.version) + '/service/nhslogin-consent');
            }
        } else {
        }
})

router.post('/*/add-delegate/delegate-relationship', function(req, res) {
    var relationship = req.session.data['relationship'];
    if (relationship === '1') {
        res.redirect('/' + req.url.substring(1,3) + '/add-delegate/delegate-relationship-1');

    } if (relationship === '2') {
        res.redirect('/' + req.url.substring(1,3) + '/add-delegate/delegate-relationship-2');

    } if (relationship === '3') {
        res.redirect('/' + req.url.substring(1,3) + '/add-delegate/delegate-relationship-3');
            
    } if (relationship === '4') {
        res.redirect('/' + req.url.substring(1,3) + '/add-delegate/delegate-relationship-4');
   
    } if (relationship === '5') {
        res.redirect('/' + req.url.substring(1,3) + '/add-delegate/delegate-relationship-5');

    } else {
        res.redirect('/' + req.url.substring(1,3) + '/add-delegate/delegate-nhs-no-1');
    }
})

router.get('/*/service/nhslogin-consent', function(req, res) {
    // get the status of the ID check
    req.session.data['id'] = req.query.id || 'passed';
    console.log("ID check has: " + req.session.data['id']);

    res.render(getVersion(req.query.version) + '/service/nhslogin-consent');
})

router.post('/*/service/nhslogin-consent', function(req, res) {
    var givesConsent = req.session.data['givesConsent'];

    if (givesConsent === 'yes') {
        res.redirect('/' + getVersion(req.query.version) + '/service/nhslogin-success');
    } else {
        res.redirect('/' + getVersion(req.query.version) + '/service/nhslogin-rejected');
    }
})

router.post('/*/service/select-single-service', function(req, res) {
    var service = req.session.data['selectSingleService'];

    if (service === 'notFound') {
        res.redirect('/' + getVersion(req.query.version) + '/service/select-service-not-listed');
    } else {
        // set the service throughout
        req.session.data['service'] = service;
        res.redirect('/' + getVersion(req.query.version) + '/add-delegate/delegate-preflight');
    }
})

router.post('/*/login-as', function (req, res) {

    // Make a variable and give it the value from 'know-nhs-number'
    var proxy = req.session.data['proxy']
  
    // Check whether the variable matches a condition
    if (proxy == "Yourself"){
      // Send user to next page
      res.redirect('/' + getVersion(req.query.version) + '/service/service-page-logged-in')
    }
    else {
      // Send user to ineligible page
      res.redirect('/' + getVersion(req.query.version) + '/service/service-page-consent')
    }
})

router.post('/*/login/login-triage', function (req, res) {

    // Make a variable and give it the value from 'know-nhs-number'
    var triage = req.session.data['triage']
  
    // Check whether the variable matches a condition
    if (triage == "AsYourself"){
      // Send user to next page
      res.redirect('/' + getVersion(req.query.version) + '/service/service-logged-in')
    }
    if (triage == "AsSomeoneElse"){
        // Send user to next page
        res.redirect('/' + getVersion(req.query.version) + '/login/login-as-list')
    }
      if (triage == "Delegate"){
        // Send user to next page
        res.redirect('/' + getVersion(req.query.version) + '/add-delegate/delegate-preflight')
    }
})

router.post('/*/login/login-as-list', function (req, res) {

    // Make a variable and give it the value from 'know-nhs-number'
    var delegate = req.session.data['delegate']
  
    // Check whether the variable matches a condition
    if (delegate == "Alice"){
      // Send user to next page
      res.redirect('/' + getVersion(req.query.version) + '/service/service-logged-in')
    }
    if (delegate == "Tom"){
        // Send user to next page
        res.redirect('/' + getVersion(req.query.version) + '/service/service-logged-in')
    }
      if (delegate == "Harriet"){
        // Send user to next page
        res.redirect('/' + getVersion(req.query.version) + '/service/service-logged-in')
    }
})

module.exports = router;
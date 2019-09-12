// External dependencies
const express = require('express');
const router = express.Router();
const http = require('http')

// add scenarios here - change session data
router.get('/alice-nominates-bob', function (req, res) {
    //req.session.data = {}
    //req.session.data['primaryUserFirstName'] = 'Alice';
    //req.session.data['delegate'] = 'Bob';
    //req.session.data['service'] = 'myHealth';
    //req.session.data['serviceConsent'] = false;
    req.session.data['hasLogin'] = true;
    res.render('email/delegate-invite');
})

router.get('/research-flow-bob', function(req, res) {
    req.session.data = {}; // reset the data
    //req.session.data['service'] = ''

    // we need to wake up the other herokus at this point

    res.render('email/delegate-invite');
})

router.get('/research-flow-alice', function(req, res) {
    req.session.data = {}; // reset the data
    //req.session.data['service'] = ''
    http.get("http://delegated-access-nhslogin.herokuapp.com", function(e) {
        console.log(e.statusCode);
    });
    http.get("http://delegated-access.herokuapp.com/", function(e) {
        console.log(e.statusCode);
    });
    http.get("http://manage-nhs-login.herokuapp.com/", function(e) {
        console.log(e.statusCode);
    });
  
    console.log('waking up all heroku sites')
 

    //res.redirect('service/myhealth-home');
    res.redirect('primary-user-details');

})

router.get('/alice-adds-bob-as-delegator', function (req, res) {
    req.session.data = {}
    //req.session.data['primaryUserFirstName'] = 'Alice';
    //req.session.data['service'] = 'myHealth';
    req.session.data['hasLogin'] = true;
    res.render('service/select-single-service');
})

// Add your routes here - above the module.exports line
router.post('/primary-user-details', function (req, res) {

    //var nhsNumber = req.session.data['nhs-login'];
    
    res.redirect('service/myhealth-home');
})

// Add your routes here - above the module.exports line
router.post('/nhs-login', function (req, res) {

    var nhsNumber = req.session.data['nhs-login'];
    
    if (nhsNumber == "Yes"){
      res.redirect('/login/login-details')
    }
    else {
      res.redirect('/login/login-details')
    }
})

router.post('/login/login-details', function(req, res) {

    // we check here if the user already has nhs login
    // we also check if the user has already consented to the service

    var hasLogin = req.session.data['hasLogin'] || true;
    var serviceConsent = req.session.data['serviceConsent'] || false;
    //var primaryUserFirstName = req.session.data['primaryUserFirstName'] || 'NoUserSet';
    //var delegatedUser = req.session.
    //if (primaryUserFirstName === 'Bob') {
        if (hasLogin === true) {
            if (serviceConsent === true) {
                // login then go straight into the service
                console.log('user has given consent')
                res.redirect('/service/service-logged-in')
            } else {
                // go to the service consent page
                console.log('user has not given consent');
                res.redirect('/service/nhslogin-consent');
            }
        } else {
            // 
        }
   // }

})


router.post('/add-delegate/delegate-name', function(req, res) {
    res.redirect('/add-delegate/delegate-relationship');
})


router.post('/add-delegate/delegate-relationship', function(req, res) {
    
    var relationship = req.session.data['relationship'];

    if (relationship === '1') {
        res.redirect('/add-delegate/delegate-relationship-1');

    } if (relationship === '2') {
        res.redirect('/add-delegate/delegate-relationship-2');

    } if (relationship === '3') {
        res.redirect('/add-delegate/delegate-relationship-3');
            
    } if (relationship === '4') {
        res.redirect('/add-delegate/delegate-relationship-4');
   
    } if (relationship === '5') {
        res.redirect('/add-delegate/delegate-relationship-5');

    } else {
        res.redirect('/add-delegate/delegate-nhs-no-1');
    }
})


router.post('/add-delegate/delegate-relationship-1', function(req, res) {
    res.redirect('/add-delegate/delegate-nhs-no-1');
})

router.post('/add-delegate/delegate-relationship-2', function(req, res) {
    res.redirect('/add-delegate/delegate-nhs-no-1');
})

router.post('/add-delegate/delegate-relationship-3', function(req, res) {
    res.redirect('/add-delegate/delegate-nhs-no-1');
})

router.post('/add-delegate/delegate-relationship-4', function(req, res) {
    res.redirect('/add-delegate/delegate-nhs-no-1');
})

router.post('/add-delegate/delegate-relationship-5', function(req, res) {
    res.redirect('/add-delegate/delegate-nhs-no-1');
})


router.post('/add-delegate/delegate-relationship-not-listed', function(req, res) {
    res.redirect('/add-delegate/delegate-nhs-no-1');
})


router.post('/add-delegate/delegate-nhs-no-1', function(req, res) {
    
    var hasNHSNumber = req.session.data['hasNHSNumber'];

    if (hasNHSNumber === 'yes') {
        res.redirect('/add-delegate/delegate-nhs-no-2');
    } else {
        res.redirect('/add-delegate/delegate-dob');
    }
})

router.post('/service/service-consent', function(req, res) {
    
    var givesConsent = req.session.data['givesConsent'];

    if (givesConsent === 'yes') {
        res.redirect('/service/service-consent-success');
    } else {
        res.redirect('/service/service-consent-rejected');
    }
})

router.get('/service/nhslogin-consent', function(req, res) {
    // get the status of the ID check
    req.session.data['id'] = req.query.id || 'passed';
    console.log("ID check has: " + req.session.data['id']);

    res.render('service/nhslogin-consent');
})

router.post('/service/nhslogin-consent', function(req, res) {
    var givesConsent = req.session.data['givesConsent'];

    if (givesConsent === 'yes') {
        res.redirect('/service/nhslogin-success');
    } else {
        res.redirect('/service/nhslogin-rejected');
    }
})

router.post('/service/select-single-service', function(req, res) {
    var service = req.session.data['selectSingleService'];

    if (service === 'notFound') {
        res.redirect('/service/select-service-not-listed');
    } else {
        // set the service throughout
        req.session.data['service'] = service;
        res.redirect('/add-delegate/delegate-preflight');
    }
})

router.post('/service/select-multi-service', function(req, res) {
    res.redirect('/add-delegate/delegate-preflight');
})

router.post('/add-delegate/delegate-dob', function(req, res) {
    res.redirect('/add-delegate/delegate-email');
})

router.post('/add-delegate/delegate-postcode', function(req, res) {
    res.redirect('/add-delegate/delegate-email')
})

router.post('/add-delegate/delegate-nhs-no-2', function(req, res) {
    res.redirect('/add-delegate/delegate-email')
})

router.post('/add-delegate/delegate-email', function(req, res) {
    res.redirect('/add-delegate/delegate-summary');
})

router.post('/login-as', function (req, res) {

    // Make a variable and give it the value from 'know-nhs-number'
    var proxy = req.session.data['proxy']
  
    // Check whether the variable matches a condition
    if (proxy == "Yourself"){
      // Send user to next page
      res.redirect('/service/service-page-logged-in')
    }
    else {
      // Send user to ineligible page
      res.redirect('/service/service-page-consent')
    }
})

router.post('/login/login-triage', function (req, res) {

    // Make a variable and give it the value from 'know-nhs-number'
    var triage = req.session.data['triage']
  
    // Check whether the variable matches a condition
    if (triage == "AsYourself"){
      // Send user to next page
      res.redirect('/service/service-logged-in')
    }
    if (triage == "AsSomeoneElse"){
        // Send user to next page
        res.redirect('/login/login-as-list')
    }
      if (triage == "Delegate"){
        // Send user to next page
        res.redirect('/add-delegate/delegate-preflight')
    }
})

router.post('/login/login-as-list', function (req, res) {

    // Make a variable and give it the value from 'know-nhs-number'
    var delegate = req.session.data['delegate']
  
    // Check whether the variable matches a condition
    if (delegate == "Alice"){
      // Send user to next page
      res.redirect('/service/service-logged-in')
    }
    if (delegate == "Tom"){
        // Send user to next page
        res.redirect('/service/service-logged-in')
    }
      if (delegate == "Harriet"){
        // Send user to next page
        res.redirect('/service/service-logged-in')
    }
})

router.post('/login/login-as-combined', function (req, res) {
    res.redirect('/service/myhealth-logged-in')
})


module.exports = router;

// External dependencies
const express = require('express');
const router = express.Router();
const http = require('http');

function getVersion(a) {
    return a.url.substring(1,3) || 'v1';
}

// connect to Notify

var NotifyClient = require('notifications-node-client').NotifyClient,
    notify = new NotifyClient(process.env.NOTIFYAPIKEY);


    
// add scenarios here - change session data
//router.get('/*/alice-nominates-bob', function (req, res) {
    //req.session.data['hasLogin'] = true;
//    console.log(getVersion(req.query.version))
//    res.render(getVersion(req) + '/email/delegate-invite');
//})

router.get('/*/research-flow-bob', function(req, res) {
    req.session.data = {}; // reset the data
    //console.log('Im here')
    res.render(getVersion(req) + '/email/delegate-invite');
})

// testing version controlling routing
router.get('/*/research-flow-alice', function(req, res) {
    req.session.data = {}; // reset the data
    //console.log(getVersion(req.query.version));
    http.get("http://delegated-access-nhslogin.herokuapp.com", function(e) {});
    http.get("http://delegated-access.herokuapp.com/", function(e) {});
    http.get("http://manage-nhs-login.herokuapp.com/", function(e) {});
    res.redirect('/' + getVersion(req) + '/primary-user-details');

})

router.get('/*/research-flow-alice', function(req, res) {
    req.session.data = {}; // reset the data
    http.get("http://delegated-access-nhslogin.herokuapp.com", function(e) {});
    http.get("http://delegated-access.herokuapp.com/", function(e) {});
    http.get("http://manage-nhs-login.herokuapp.com/", function(e) {});
    res.redirect('/' + getVersion(req) + '/primary-user-details');

})

router.get('/*/alice-adds-bob-as-delegator', function (req, res) {
    req.session.data = {}
    req.session.data['hasLogin'] = true;
    res.render(getVersion(req) + 'service/select-single-service');
})

router.post('/*/add-delegate/delegate-nhs-no-1', function(req, res) {
    //req.session.data['hasNHSNumber'];
    console.log('quert version ' + req.query.version);
    console.log('substring ' + req.url.substring(1,3));
    console.log('hasNHSnumber ' + req.session.data.hasNHSNumber);
    //console.log('version ' + getVersion(req.query.version));

    if (req.session.data['hasNHSNumber'] == 'yes') {
        res.redirect('/' + getVersion(req) + '/add-delegate/delegate-nhs-no-2');
    } else {
        res.redirect('/' + getVersion(req) + '/add-delegate/delegate-dob');
    }
})

router.post('/*/nhs-login', function (req, res) {

    var nhsNumber = req.session.data['nhs-login'];
    
    if (nhsNumber == "Yes"){
      res.redirect('/' + getVersion(req) + '/login/login-details')
    }
    else {
      res.redirect('/' + getVersion(req) + '/login/login-details')
    }
})

// router.post('/*/login/login-details', function(req, res) {

//     // we check here if the user already has nhs login
//     // we also check if the user has already consented to the service

//     var hasLogin = req.session.data['hasLogin'] || true;
//     var serviceConsent = req.session.data['serviceConsent'] || false;

//         if (hasLogin === true) {
//             if (serviceConsent === true) {
//                 // login then go straight into the service
//                 console.log('user has given consent')
//                 res.redirect('/' + getVersion(req) + '/service/service-logged-in')
//             } else {
//                 // go to the service consent page
//                 console.log('user has not given consent');
//                 res.redirect('/' + getVersion(req) + '/service/consent');
//             }
//         } else {
//         }
// })

router.post('/*/add-delegate/delegate-relationship', function(req, res) {
    var relationship = req.session.data['relationship'];
    if (relationship === '1') {
        res.redirect('/' + getVersion(req) + '/add-delegate/delegate-relationship-1');

    } if (relationship === '2') {
        res.redirect('/' + getVersion(req) + '/add-delegate/delegate-relationship-2');

    } if (relationship === '3') {
        res.redirect('/' + getVersion(req) + '/add-delegate/delegate-relationship-3');
            
    } if (relationship === '4') {
        res.redirect('/' + getVersion(req) + '/add-delegate/delegate-relationship-4');
   
    } if (relationship === '5') {
        res.redirect('/' + getVersion(req) + '/add-delegate/delegate-relationship-5');

    } if (relationship === '6') {
        res.redirect('/' + getVersion(req) + '/add-delegate/delegate-relationship-6');    

    } else {
        res.redirect('/' + getVersion(req) + '/add-delegate/delegate-nhs-no-1');
    }
})


router.get('/v4/primary-user-details-and-relationship', function (req, res) {
    var emailSent = req.query.emailSent
    console.log(req.query.emailSent)
    res.render('v4/primary-user-details-and-relationship', {emailSent: emailSent}, function(err,html) {
        res.send(html)
    })
})

// The URL here needs to match the URL of the page that the user is on
// when they type in their email address
router.post('/v4/primary-user-details-and-relationship', function (req, res) {

    notify.sendEmail(
      // this long string is the template ID, copy it from the template
      // page in GOV.UK Notify. It’s not a secret so it’s fine to put it
      // in your code.
      '5d6649e3-b6df-4fc5-96e0-af80e3bec737',
      // `emailAddress` here needs to match the name of the form field in
      // your HTML page
      req.body.emailAddress, { 
          personalisation: {
          'primaryuserfirstname': req.body.primaryUserFirstName,
          'primaryuserlastname': req.body.primaryUserLastName 
        },
        reference: ''
      })
      .then(response => console.log(response))
      .catch(err => console.error(err))

    console.log(req.body.emailAddress)
  
    // This is the URL the users will be redirected to once the email
    // has been sent
    res.redirect('/v4/primary-user-details-and-relationship?emailSent=true');
  
  })



// The URL here needs to match the URL of the page that the user is on
// when they type in their email address
router.post('/v4/primary-user-details-and-relationship', function (req, res) {

    notify.sendEmail(
      // this long string is the template ID, copy it from the template
      // page in GOV.UK Notify. It’s not a secret so it’s fine to put it
      // in your code.
      '5d6649e3-b6df-4fc5-96e0-af80e3bec737',
      // `emailAddress` here needs to match the name of the form field in
      // your HTML page
      req.body.emailAddress, { 
          personalisation: {
          'primaryuserfirstname': req.body.primaryUserFirstName,
          'primaryuserlastname': req.body.primaryUserLastName 
        },
        reference: ''
      })
      .then(response => console.log(response))
      .catch(err => console.error(err))

    console.log(req.body.emailAddress)
  
    // This is the URL the users will be redirected to once the email
    // has been sent
    res.redirect('/v4/consent-success');
  
  })


router.post('/*/login/login-as-v3', function(req, res) {
    var loggedInUser = req.session.data['loggedInUser'];
    if (loggedInUser === 'CreateAccount') {
        res.redirect('/' + getVersion(req) + '/service/myhealth-logged-out');

    } else {
        res.redirect('/' + getVersion(req) + '/service/myhealth-logged-in');
    }
})


// router.get('/*/service/consent', function(req, res) {
//     // get the status of the ID check
//     req.session.data['id'] = req.query.id || 'passed';
//     console.log("ID check has: " + req.session.data['id']);

//     res.render(getVersion(req) + '/service/consent');
// })

// router.post('/*/service/consent', function(req, res) {
//     var givesConsent = req.session.data['givesConsent'];

//     if (givesConsent === 'yes') {
//         res.redirect('/' + getVersion(req) + '/service/nhslogin-success');
//     } else {
//         res.redirect('/' + getVersion(req) + '/service/nhslogin-rejected');
//     }
// }) 

////
//router.post('/*/service/select-single-service', function(req, res) {
//    var service = req.session.data['selectSingleService'];
//
//    if (service === 'notFound') {
//        res.redirect('/' + getVersion(req.query.version) + '/service/select-service-not-listed');
//    } else {
//        req.session.data['service'] = service;
//        res.redirect('/' + getVersion(req.query.version) + '/add-delegate/delegate-preflight');
//    }
//})

router.post('/*/login-as', function (req, res) {

    // Make a variable and give it the value from 'know-nhs-number'
    var proxy = req.session.data['proxy']
  
    // Check whether the variable matches a condition
    if (proxy == "Yourself"){
      // Send user to next page
      res.redirect('/' + getVersion(req) + '/service/service-page-logged-in')
    }
    else {
      // Send user to ineligible page
      res.redirect('/' + getVersion(req) + '/service/service-page-consent')
    }
})

router.post('/*/login/login-triage', function (req, res) {

    // Make a variable and give it the value from 'know-nhs-number'
    var triage = req.session.data['triage']
  
    // Check whether the variable matches a condition
    if (triage == "AsYourself"){
      // Send user to next page
      res.redirect('/' + getVersion(req) + '/service/service-logged-in')
    }
    if (triage == "AsSomeoneElse"){
        // Send user to next page
        res.redirect('/' + getVersion(req) + '/login/login-as-list')
    }
      if (triage == "Delegate"){
        // Send user to next page
        res.redirect('/' + getVersion(req) + '/add-delegate/delegate-preflight')
    }
})

router.post('/*/login/login-as-list', function (req, res) {

    // Make a variable and give it the value from 'know-nhs-number'
    var delegate = req.session.data['delegate']
  
    // Check whether the variable matches a condition
    if (delegate == "Alice"){
      // Send user to next page
      res.redirect('/' + getVersion(req) + '/service/service-logged-in')
    }
    if (delegate == "Tom"){
        // Send user to next page
        res.redirect('/' + getVersion(req) + '/service/service-logged-in')
    }
      if (delegate == "Harriet"){
        // Send user to next page
        res.redirect('/' + getVersion(req) + '/service/service-logged-in')
    }
})

module.exports = router;



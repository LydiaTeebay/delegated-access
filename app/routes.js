// External dependencies
const express = require('express');
const router = express.Router();

// add scenarios here - change session data
router.get('/sean-nominates-david', function (req, res) {
    req.session.data['currentUser'] = 'David';
    req.session.data['delegateUser'] = 'Sean';
    req.session.data['service'] = 'myHealth';
    req.session.data['serviceConsent'] = false;
    req.session.data['hasLogin'] = true;
    res.render('email/nominatee-invite');
})

// Add your routes here - above the module.exports line
router.post('/nhs-login', function (req, res) {

    //console.log(req.session.data);
    //req.session.data['user'] = 'andrew';
    //console.log(req.session.data);

    // Make a variable and give it the value from 'know-nhs-number'
    var nhsNumber = req.session.data['nhs-login'];
    
    // Check whether the variable matches a condition
    if (nhsNumber == "Yes"){
      // Send user to next page
      res.redirect('/login/login-details')
    }
    else {
      // Send user to ineligible page
      res.redirect('/login/login-details')
    }
})

router.post('/login/login-details', function(req, res) {

    // we check here if the user already has nhs login
    // we also check if the user has already consented to the service

    var hasLogin = req.session.data['hasLogin'];
    var serviceConsent = req.session.data['serviceConsent'];
    var currentUser = req.session.data['currentUser'];
    
    if (currentUser === 'David') {
        if (hasLogin === true) {
            if (serviceConsent === true) {
                // login then go straight into the service
                console.log('user has given consent')
                res.redirect('/service/service-logged-in')
            } else {
                // go to the service consent page
                console.log('user has not given consent');
                res.redirect('/service/service-consent');
            }
        } else {
            // 
        }
    }

})

router.post('/service/service-consent', function(req, res) {

    // user agrees to the consent
    // and then accesses the service as the nominate
   req.session.data['serviceConsent'] = true;
   res.redirect('/service/service-logged-in');

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


router.post('/add-delegate/delegate-contactinfo', function(req, res) {
console.log (req.session.data)
    // user agrees to the consent
    // and then accesses the service as the nominate
   res.redirect('/add-delegate/delegate-summary');

})

module.exports = router;

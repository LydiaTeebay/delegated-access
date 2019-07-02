// External dependencies
const express = require('express');
const router = express.Router();

router.get('/sean-nominates-david', function (req, res) {
    console.log(req.session.data);
    req.session.data['user'] = 'David';
    req.session.data['myHealthConsent'] = false;
    req.session.data['userHasLogin'] = true;
    console.log(req.session.data);
    //res.redirect('/email/nominatee-invite')
    res.render('email/nominatee-invite');
})

// Add your routes here - above the module.exports line
router.post('/nhs-login', function (req, res) {

    console.log(req.session.data);
    req.session.data['user'] = 'andrew';
    console.log(req.session.data);

    // Make a variable and give it the value from 'know-nhs-number'
    var nhsNumber = req.session.data['nhs-login']
  
    // Check whether the variable matches a condition
    if (nhsNumber == "Yes"){
      // Send user to next page
      res.redirect('/login/nhs-logging-in')
    }
    else {
      // Send user to ineligible page
      res.redirect('/login/nhs-logging-in')
    }
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


module.exports = router;

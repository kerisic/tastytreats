# Tasty Treats

### Description

To create an inquiry form for Tasty Treats, a local bakery. 

The business owner, Terence, wants to capture the following information and save it in plain text files on his server.

* Name
* Email address
* Message
* If they would like to subscribe to Tasty Treats' newsletter

Terence has been struggling to contact people who have completed the form. Lots of the email addresses are invalid. Can you prevent invalid email addresses from being submitted?

The text files aren’t very nice to work with. Can you create a page for Terence to see the inquiries with the newest showing first? 

The form is being spammed by naughty bots! How can they be stopped so Terence doesn’t miss potential customers?

### Heroku

<img width="300" alt="Screenshot 2021-05-12 at 21 52 23" src="https://user-images.githubusercontent.com/71288920/118042753-5e9b2d80-b36c-11eb-9a61-8fa31fbdf05c.png">

[demo here](https://warm-inlet-62149.herokuapp.com/)

* Form submission on main page
* Inquiries on /show [example](https://warm-inlet-62149.herokuapp.com/show)

### Installation

* clone this repo
* run `npm install`
* run `node index.js`
* visit `http://localhost:8080/`

### Tech

* Node.js
* Express
* jQuery
* Firebase

### User Stories
```
As a local bakery owner
so that I can let customers submit inquiries
I would like an inquiry form on my website

As a local bakery owner
so that I can contact the customers who inquired
the enquiry form should take a name, email address, message
and if they would like to subscribe to the newsletter

As a local bakery owner
so that I can access the contacts from the form
I would like the details to be saved in plain text files 

As a local bakery owner
so that invalid email addresses don't get submitted
email addresses should be validified before being allowed to submit

As a local bakery owner
so that I can see all inquiries on one page
a separate page should list all inquiries 
with the newest showing first

As a local bakery owner
so that the form will not be spammed by bots
I would like the form to have a captcha 
```

### Security

* .env and firebase's serviceAccountKey.json should be stored locally
* For the purpose of this test, it is temporarily stored on this repo

### Further features

* Implement authentication so that inquiries are displayed only to an authorised user.

// I-AMVOCAL ROUTE DESCRIPTIONS

/*
ROUTE: '/'
This is the homepage of the platform.
Contains links to the sign-in, sign-up, about, contact,polls, create poll etc

ROUTE: '/createpoll'
This is the page that someone can create a poll from
It needs authorization.
REQUEST TYPES: ['get','post']

ROUTE: '/addPoll'
This page allows someone who has already created a poll to 
add the poll participants.
There are two types of polls: election and opinion polls
Election polls are for human beings while opinion polls
are for voting on ideas
REQUEST TYPES: ['get','post']

ROUTE: '/polls'
This is a page that contains all the ongoing polls within the platform
Only  ongoing polls are displayed. Each poll has a description, name, start and end dates and time
REQUEST TYPES: ['get']

ROUTE: '/pollVote'
This page can be accessed from the polls page
It allows people to view a particular poll and its participants
It also allows people to vote for the idea or person that they 
support in an opinion or election poll.
REQUEST TYPES: ['get','post']

ROUTE: '/beforeVote'
This page is showed to a voter if he tries voting before the stipulated time for a poll
It is more like a redirect page

ROUTE: '/afterVote'
This page is showed to a voter if he tries voting after the stipulated time for a poll
It is also a redirect page

ROUTE: '/signup'
This is the page on which someone signs up
We get their basic data. Name, age range, if he or she is a registered voter, email
REQUEST TYPES: ['get','post']

ROUTE: '/signin'
This is the page where someone signs in. Basically email and password or phone number and password
REQUEST TYPES: ['get','post']

ROUTE: '/logout'
This is the logout page. It waits for while before redirecting back to the homepage.




*/


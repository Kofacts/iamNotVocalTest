var Member = require('../app/models/members')
var Poll = require('../app/models/polls');
var Team = require('../app/models/team');
var Report = require('../app/models/report');
var Blog = require('../app/models/blog');

var formidable = require('formidable');
var AWS = require('aws-sdk');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto')


function route(app,passport,mongoose){
	/*
		Static pages:
			'/','/about_us',
	*/

	app.get('/',function(req,res){
		Blog.find({},function(err,posts){
			if(err)
				throw err;
			if(posts.length < 1){
				var blogPosts = [];
			}
			else{
				var blogPosts = posts;
			}
			Report.find({},function(err,posts){
				var reports = [];
				if(err)
					throw err;
				if(posts.length < 1){
					reports = [];
				}
				else{
					reports = posts;
				}
				res.render('index',{user:req.user, posts:blogPosts, reports: reports});
			})
		});
	})

	app.get('/about_us',function(req,res){
		res.render('about',{user:req.user});
	});

	app.get('/blog',function(req,res){
		//get all the polls and render it
		// check for queries so as to know what to fetch
		if(req.query.query){
			var range = req.query.query.split('-');
			Blog.find({},function(err,posts){
				if(err)
					throw err;
				if(!posts.length)
					res.render('blog',{user:req.user, posts:[]});
				else{
					var postsResponse = posts.length > Number(range[1])? posts.slice(posts.length-Number(range[1]),posts.length-Number(range[0])) : posts;
					res.render('blog',{user:req.user, posts:postsResponse})
				}
			})
		}
		else{
			Blog.find({},function(err,posts){
				if(err)
					throw err;
				if(posts.length == 0)
					res.render('blog',{user:req.user, posts:[], message:'There are no blog posts'});
				else{
					var postsResponse = posts.length > 10 ? posts.slice(posts.length-11,posts.length) : posts;
					res.render('blog',{user:req.user, posts:postsResponse});
				}
			})
		}
	})

	app.get('/reports',function(req,res){
		//get all the polls and render it
		// check for queries so as to know what to fetch
		if(req.query.query){
			var range = req.query.query.split('-');
			Report.find({},function(err,posts){
				if(err)
					throw err;
				if(!posts.length)
					res.render('reports',{user:req.user, posts:[]});
				else{
					var postsResponse = posts.length > Number(range[1])? posts.slice(posts.length-Number(range[1]),posts.length-Number(range[0])) : posts;
					res.render('reports',{user:req.user, posts:postsResponse})
				}
			})
		}
		else{
			Report.find({},function(err,posts){
				if(err)
					throw err;
				if(posts.length == 0)
					res.render('reports',{user:req.user, posts:[]});
				else{
					var postsResponse = posts.length > 10 ? posts.slice(posts.length-11,posts.length) : posts;
					res.render('reports',{user:req.user, posts:postsResponse});
				}
			})
		}
	})
	/*
	========================================================================================
		Dynamic pages:
			'/createPoll','/addParticipants','/polls'
	
	*/
	app.get('/createPoll',function(req,res){
		if(req.user){
			res.render('createPoll',{user:req.user,message:''});
		}
		else{
			req.flash('loginMessage','You cannot create a poll without first signing in... Thank you');
			res.redirect('/signin');
		}
	});

	app.post('/createPoll',function(req,res){
		//we get the poll details
		// send the user a mail notifying him of the action and the details of the poll
		// we check for authentication as well
		console.log(req.body['endDate']);
		
		if(req.user){
			var poll = new Poll();
			poll.name = req.body.name;
			poll.createdBy = req.user.uniqueHash;
			poll.description = req.body.description;
			poll.passcode = req.body.passcode;
			poll.pollType = req.body.pollType;
			poll.startAt = req.body.startTime;
			poll.endAt = req.body.endTime;
			poll.startDate = req.body.startDate;
			poll.endDate = req.body.endDate;
			poll.pollId = crypto.createHmac('sha256',req.body.name).update(req.body.passcode).digest('hex');

			poll.save(function(err,savedPoll){
				if(err)
					throw err; // there was an error in saving the poll
				// since we have successfully saved the poll let's send him a success message to start adding participants
				if(req.body.pollType == 'election'){
					var response = {success:true, pollId: savedPoll.pollId, pollType: savedPoll.pollType}
					res.json(response);
					//res.render('addElectionCandidates',{user:req.user,pollId:savedPoll.pollId})
				}
				else {
					var response = {success:true, pollId: savedPoll.pollId, pollType: savedPoll.pollType}
					res.json(response);
					//res.render('addOpinionCandidates',{user:req.user,pollId:savedPoll.pollId})
				}
			})
		}
		else{
			req.flash('loginMessage','You must be signed in to create a poll')
			res.redirect('/signin')
		}
	})

	app.post('/addPoll',function(req,res){
		if(req.user){
			console.log(req.body);
			//first we find the poll with the given poll id and then update its participants based on the poll type
			Poll.findOne({pollId:req.body.pollId},function(err,poll){
				if(err)
					throw err;
				// this is to counteract people making irregular calls or trying to find vulnerabilities in the system
				if(!poll){
					res.send('There is no poll with the given id '+req.body.pollId);
				}
				else{
					if(poll.pollType == 'election'){
						var data = {
							name: req.body.participant_name,
							description: req.body.participant_desc,
							manifesto: req.body.participant_manifesto,
							participantId: crypto.createHmac('sha256', req.body['participant_name']).update(req.body['participant_manifesto']).digest('hex'),
							votes:0
						}
						poll.contestants.push(data);
						poll.save(function(err,savedPoll){
							if(err)
								throw err
							console.log("Successfully added a new contestant to a poll");
							res.json({'success':true, pollId:savedPoll['pollId'], pollType:savedPoll['pollType']});
						})
					}
					else{
						var data = {
							name: req.body.participant_name,
							description: req.body.participant_desc,
							participantId: crypto.createHmac('sha256', req.body['participant_name']).update(req.body['participant_desc']).digest('hex'),
							votes:0
						};
						poll.contestants.push(data);
						poll.save(function(err,savedPoll){
							if(err)
								throw err;
							console.log('Successfully saved an idea choice for a poll');
							res.json({'success':true, pollId:savedPoll['pollId'], pollType:savedPoll['pollType']});
						})
					}
				}
			})
			
			// conditionally render back the poll type view.
		}
		else{
			res.redirect('/signin')
		}
	})


	app.get('/polls',function(req,res){
		// this is to view all the available polls
		// we view all the polls that are still within range
		var calendar = {
			'January':0,'February':1,'March':2,'April':3,'May':4,'June':5,'July':6,'August':7,'September':8,'October':9,'November':10,'December':11
		}
		// we check if the user wants to view a particular poll
		if(req.query.pollId){
			var pollId = req.query.pollId;
			Poll.findOne({pollId:pollId},function(err,poll){
				if(err)
					throw err;
				// if we didn't find any poll with the id
				if(!poll){
					console.log('there is no poll as the one you requested for');
					// take him back to where he was
					res.redirect('/polls');
				}
				else{
					// there is a poll as that
					// we send him the poll view
					res.render('viewpoll',{user:req.user, poll:poll});
				}
			})
		}
		else{
			// if the user just wants to see the polls that are available
			Poll.find({},function(err,polls){
				if(err)
					throw err;
				if(polls.length<1)
					res.render('polls',{user:req.user, polls:polls});
				else{
					var eligiblePolls = polls.filter(function(poll, index){
						var date = poll['endDate'].split(' ');
						var time = poll['endAt'].split(':');
						var startMonth = calendar[date[1].slice(0,-1)];
						var startHour = time[0];
						var startMinute = time[1];
						var startDay = date[0];
						var startYear = date[2];
						return (new Date(startYear,startMonth,startDay,startHour,startMinute)).getTime() > (new Date()).getTime();
					})
					// after the filtering, we render the eligible polls whether they exist or not
					res.render('polls',{user:req.user, polls:eligiblePolls});
				}
			})
		}
	})

	app.get('/results',function(req,res){
		if(req.query.pollId){
			Poll.findOne({pollId:req.query.pollId},function(err,poll){
				if(err)
					throw err;
				if(!poll)
					res.render('viewpoll',{user:req.user,poll:''});
				else{
					res.render('viewpoll',{user:req.user, poll:poll});
				}
			})
		}
		else{
			Poll.find({},function(err,polls){
				if(err)
					throw err;
				if(polls.length < 1)
					res.render('results',{user:req.user, results:[]});
				else{
					var calendar = {'January':0,'February':1,'March':2,'April':3,'May':4,'June':5,'July':6,'August':7,'September':8,'October':9,'November':10,'December':11}
					var orderedPolls = polls.sort(function(a,b){
						// in displaying results, we display it based on the most current results

						// we first get details for their end times and use it for sorting
						var adate = a['endDate'].split(' ');
						var atime = a['endAt'].split(':')
						var apollDate = (new Date(adate[2],calendar[adate[1].slice(0,-1)],adate[0],atime[0],atime[1])).getTime();

						var bdate = b['endDate'].split(' ');
						var btime = b['endAt'].split(':')
						var bpollDate = (new Date(bdate[2],calendar[bdate[1].slice(0,-1)],bdate[0],btime[0],btime[1])).getTime();

						if(apollDate > bpollDate){
							return a > b;
						}
						else{
							return b > a;
						}
						
					})

					res.render('results',{user:req.user,results:orderedPolls});
				}
			});
		}
	})

	app.post('/vote',function(req,res){
		if(req.user){
			// we get the person the user voted for
			// we increase his or her vote by 1
			// we add the user to participants
			// we add the poll to the poll the user has participated in 
			Member.findOne({uniqueHash:req.user.uniqueHash},function(err,member){
				if(err)
					throw err;
				if(!member)
					res.send('there is no user as that');
				if(member){
					// we now have the member, let's find the poll
					Poll.findOne({pollId:req.body.pollId},function(err,poll){
						if(err)
							throw err;
						if(!poll)
							res.send('There is no poll as the one you requested for');
						if(poll){
							// we check if the user has not participated in the poll before 
							if(member.participatedIn.length){
								for(var u = 0; u < member.participatedIn.length; u++){
									if(member.participatedIn[u]['pollId'] != req.body.pollId && u == member.participatedIn.length-1 ){
										console.log('new participation in a poll');
										console.log(req.body);
										// this guy has not voted before in this poll
										
										poll.participants.push({id:member.uniqueHash,timevoted:Date.now(),votedFor:req.body.choice});
										for(var i = 0; i < poll['contestants'].length; i++){
											if(poll['contestants'][i]['participantId'] == req.body.choice){
												poll['contestants'][i]['votes'] +=1;
												poll.save(function(err,savedPoll){
													if(err)
														throw err;
													console.log('updated poll for first time voter in this poll '+savedPoll);
												})
												break;
											}
										}
										member.participatedIn.push({pollId:req.body.pollId});
										member.save(function(err,updatedMember){
											if(err)
												throw err;
											console.log(updatedMember);
											res.json(updatedMember);
										})

									}
									else if(member.participatedIn[u]['pollId'] == req.body.pollId){
										// he has voted in the poll before
										// we check the participants in the poll and adjust their data
										console.log('it came here ooo where votes are updated')
										console.log(req.body);
										for(var x = 0; x < poll['participants'].length; x++){
											if(poll['participants'][x]['id'] == member.uniqueHash){
												for(var z = 0; z<poll['contestants'].length; z++){
													if(poll['contestants'][z]['participantId'] == poll['participants'][x]['votedFor'] ){
														console.log('we have reduced the vote')
														poll['contestants'][z]['votes']-=1;
														console.log(poll['contestants'][z]['votes'])
														// we have reduced her vote by one.
													}
													break;
												}
												
												// then we now add the votes of the new participant
												for(var z = 0; z<poll['contestants'].length; z++){
													if(poll['contestants'][z]['participantId'] == req.body.choice ){
														poll['contestants'][z]['votes'] +=1;
														console.log('we have increased the vote');
														console.log(poll['contestants'][z]['votes']);
														poll['participants'][x]['votedFor'] = req.body.choice;
														poll['participants'][x]['timeVoted'] = Date.now();
														// we have now updated the new votes.
													}
													break;
												}
												break;
											}
										}
										poll.save(function(err,savedPoll){
											if(err)
												throw err;
											if(savedPoll){
												//console.log('updated vote for a voter '+savedPoll)
												res.json(savedPoll);
											}
										})
										// now we increase the vote of the new person

									}
								}
							}
							else{
								// he has never voted before at all
								
								poll.participants.push({id:member.uniqueHash,timevoted:Date.now(),votedFor:req.body.choice});
								for(var i = 0; i < poll['contestants'].length; i++){
									if(poll['contestants'][i]['participantId'] == req.body.choice){
										poll['contestants'][i]['votes'] +=1;
										poll.save(function(err,savedPoll){
											if(err)
												throw err;
											console.log('updated poll for first time voter '+savedPoll);
										})
										break;
									}
								}
								// we need to update the user data about participating in this poll
								member.participatedIn.push({pollId:req.body.pollId});
								member.save(function(err,updatedMember){
									if(err)
										throw err;
									console.log(updatedMember);
									res.json(updatedMember);
								})
							}
							
						}
					})
				}
			})
		}
		else{
			req.flash('loginMessage','You must be signed in to vote.')
			res.redirect('/signin')
		}
	})
	
	app.get('/vote',function(req,res){
		res.redirect('/');
	})





	/*
	============================================================
	Authentication pages...
		'/signin','/signup','/logout','/admin',
	*/
	app.get('/signup',function(req,res){
		//we are getting the signup data to be used here in adding a new member to the database
		// we would fix a situation where a user is already signed up to the system.
		if(req.user){
			res.redirect('/');
		}
		else{
			res.render('signup',{user:req.user,message:req.flash('failedSignupMessage')});
		}
	})
	app.post('/signup',passport.authenticate('local-signup',{failureRedirect:'/signup', failureFlash:true, successRedirect:'/'}))
	
	app.post('/signin',passport.authenticate('local-login',{failureRedirect:'/signin', failureFlash:true, successRedirect:'/'}))
	app.get('/signin',function(req,res){
		// we need to fix up some messages to show the user incase of failed login messages
		// and for successful logins
		if(req.user){
			res.redirect('/');
		}
		else{
			res.render('signin',{message:req.flash('loginMessage'),user:req.user})
		}
	})
	app.get('/logout',function(req,res){
		if(req.user){
			req.logout();
			res.redirect('/')
		}
		else{
			res.redirect('/')
		}
	})

}
module.exports = route;

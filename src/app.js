// Throws errors when common mistakes are made
'use strict';

// Imports - Things app needs to access
// Express module - use this variable to access express methods and properties
const express = require('express');
const posts = require('./mock/posts.json')

// Common JS pattern for converting objects into arrays:
const postsLists = Object.keys(posts).map((value) => {
	return posts[value]
})

// Create instance of express application with express() function
var app = express();
// debugger;
// use method defines middleware with the static method. Tells express how to handle a request between it being made but before it arrives at a route.
// '/static' added in as a prefix to our public directory
app.use('/static', express.static( __dirname + '/public'));

// app.set defines different settings
// Template engine we want to use
app.set('view engine', 'pug');
// Where to look for our templates
app.set('views', __dirname + '/templates'); // __dirname makes sure template path is relative to the file rather than the directory where we start our node process

// debugger; - flag

// Routes for HTTP requests
// Call get method on app variable

// First parameter sometimes called location parameter/ endpoint. Catcher of requests. Address request is being made to. in this case it's for the route of the server (/)
// Anon callback function with request obj and response obj as parameters
app.get('/', (req, res) => {
	// Assign path in request to a variable
	let path = req.path;
	// Assign the value of the path to the locals object in the response - We access then in the nav template
	res.locals.path = path;
	// send back our index template - we've told express to use jade template engine and where our templates are above
	res.render('index');
});

// What to do when a request is made to /blog
// /:title? - add a parameter to the route (:title is the parameter) - adding question mark makes the parameter optional
// Value of that parameter is whatever we add to the url - /blog/I like to run!
app.get('/blog/:title?', (req, res) => {
	// title value is taken from url
	let title = req.params.title;
	if (title === undefined) {
		//render page with 503 status code rather than 200
		res.status(503);
		// Render blog listing - first parameter is the template we want to use.
		// Blog data is in JSON format, when method iterates over a data type it should be an array. Convert our JSON object to array
		// Object.keys(posts) - generates an array of keys from posts object
		// Arrays have a map method that allows us to create a new array of objects:
		res.render('blog', {posts: postsLists});
	} else {
	// post stores the data we send back - in this case it's the json object with the title we added to the url.
		let post = posts[title] || {}; // If post doesn't exist, define it as an empty object. This is on'y a quick fix, won't give user any useful info.
		// response contains info client needs to render page in browser or whatever
		// providing path to blog post template (1.) here. 2nd parameter to render method is the variable
		res.render('post', { post: post });
	}
});


// Make API endpiunt so anyone can get the post data
app.get('/posts', (req, res) => {
// For /posts endpoint we'll send back the raw JSON data is raw is included as a query parameter. Otherwise send back the array we created in postsLists variable
	if (req.query.raw) {
		res.json(posts);
	} else
	// For /posts endpoint we'll send back the array we created in postsLists
	res.json(postsLists);
})

// Port to listen on for HTTP requests / serve application on
app.listen(3000, () => {
	// Logs success running server
	console.log('Frontend now running on port 3000...')
});

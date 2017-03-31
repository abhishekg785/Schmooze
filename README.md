# Schmooze
An real time multi-platform, multi-channel web app for online Discussion and Learning. The project is aimed to conduct the online group sessions for students  of the National Institute of Technology, Kurukshetra.
<h2>The project have:</h2>

Group chat and discussion<br/>
Private chat<br/>
File sharing <br/>
Create own channel for discussion<br/>
No login required, just give a nickname to enter into the discussion<br/>
Several commands and rules for chat and discussion such as:  /join %<room name>  for joining a room etc.<br/>
User can join different groups and be part of the discussion<br/>
Different color schemes for the chat and logs.<br/>
Download the chat ,logs and discussion file of a channel (Incase the user could not attend the dicussion)


<h2>Things to add:</h2>
Creating a robot named "Aron" for the project to automate the thing.<br/>
Using webRTC for extending the functionality of the project such as Face to Face Chat and sessions.<br/>
and lots more to decide :)</br>


<h2>Technologies I have used:</h2>
Socket.io for socket connections<br/>
Redis Server for session storage and managment.<br/>
Node.js And Express for the server side<br/>
Simple HTML5 and CSS3 for the front-end.<br/>
MongoDB and Mongoose for Database Management.

<h2>Schmooze Setup</h2>
<h3>Step 1</h3>
Fork/Clone the project.

<h3>Step 2</h3>
Install Redis on your computer.

<h3>Step 3</h3>
Install and setup MongoDB on the computer and ensure to that it runs successfully.

<h3>Step 4</h3>
Ensure you have latest version of node and npm installed.<br/>
Check for node version by using node --version in your terminal (v >= 4.3.0).

<h3>Step 5</h3>
Create a config.js file in the project directory.<br/>
Add the following content in the file :<br/>
<code>
  var params = {
    'sessionSecret':'choose one',
    'sessionCookieKey':choose one'
  };
  module.exports = params;
</code>

<h3>Step 6</h3>
cd into the project directory.<br/>
Run "sudo npm install" to install all the node dependencies required by the project.
Run node bin/www to run the project.<br/>

<h3>Contribute :)</h3>
Feel free to contribute to the project.<br/>
Create an issue if you find anything wrong with the project.
<h2>Simply Fork, Clone and send Pull Request :)</h2>

<h3>Screenshots</h3>
![Alt text](/screenshots/Login.png?raw=true "Optional Title")
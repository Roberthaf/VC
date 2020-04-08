This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
The App uses a AWS Serverless structure, this includes AWS CLI and AWS Amplify [AWS-Amplify](https://aws-amplify.github.io/docs/js/react).

## Available Scripts

In the project directory, you can run :
### `amplify run start`

You can also run if needed:
### `npm run start`
It will start the localhost server with out using AWS.

This will run the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
ATH! We will not be using the `npm run build` Its possible if needed.

To build and publish we use Amplify.
### `Amplify push` 

Will update the stack. The AWS stack holds all our configurations, lambdas, API's, GraphQL etc.

### `Amplify publish`

Will create our Production build and publish all our changes. They will become live using CloudeFront.


## App Structure.

This Application is intended to be a cloud solution for various Vaki products, currently three websites have been merged into one.
Vaki Counters, Spotlice(Maybe not needed anymore) and Admin View.

#### Architecture
'.App' the '.' denotes a file where '/Component', the '/' denotes a folder.
<pre>
.
+---/index  
   |
   +---.AppWithAuth <- Custom Login page, wrapping .App withAuthenctiator from AWS
         |+--- .App <- Main File  
               +--- /AdminView
               |  
               +---/Components
                  |
                  +---/Buttons
                  +---/Charts
                  +---/Tabs  
                  +---/Utils
               |   
               +---/Containers 
               |
               +---/Equipment  
               +---/customGQL
               +---/graphql
               +---/image
               +---/Navigation
               +---/Spotlice  
               
</pre>

### Counters
Vaki Counters is a cloud service for our various vaki counters. From Micro to Wellboat counters.

### Setting up a New AWS user and connect to amplify.

1. Make sure you have cloned the project from [VakiCloud](https://github.com/VAKI-Aquaculture-Systems/VakiCloud)

2. Open a terminal and make sure you are in the root directory of your repo.
   For the next part you will need to have amplify-cli installed on your system and also dont forget 
   to run npm install in the root directory before continuing 
   and 'npm install -g @aws-amplify/cli' to install amplify-cli after.

3. Use amplify init to connect to AWS. You will need to sign into aws.console and the user will need a programatic access.
   If you need to create a new user use: In the root directory run : amplify configure
   You need to have a user that has access to AWS.console, f.x. Robert's account or Bjarkis account.

4. You can now modify the aws stack. Using Push or Publish if you want to create a licv version.


### API's

There are three API's in this project. It seems like allot but its for a reason. And creating and managing API's is easy in AWS.

1. vakicloudAuth-dev - The GraphQL handles the user authentication and authorization. It's created in the frontend and managed in the Amplify CLI.
   See [Amplify Transform](https://aws-amplify.github.io/docs/cli-toolchain/graphql)
   The information is then stored in DynamoDB tables.

2. vakicloudRdsAPI - Main REST API. This API is handled by the Amplidy CLI [REST API](https://aws-amplify.github.io/docs/js/api)
   Scroll down to find the REST API.
   We use this API to connect to our MySQL database, it has VPC access.

3. Vakicloud-licencegen - REST API only function is to create a licence. There is a Python lambda function behind this API.


# Seattle Snow Report

A very early, work-in-progress alexa skill that uses a lambda web scraper to return information about the ski conditions at Stevens Pass. This will be expanded to include other resorts, like Baker, Crystal, Snoqualmie, and Mission Ridge.

Leverages the "Serverless" framework - https://serverless.com/

## Setup

Project currently contains two folders, each with their own package.json.

### Setup Alexa Skill

Alexa uses the serverless webpack plugin in order to use a webpack babel build. This plugin is compatible with webpack 1 right now.

To test the webpack build, run

`serverless webpack`

To deploy

`env AWS_PROFILE={awsProfileName} serverless deploy`

### Setup Webpack scraper

The webpack scraper has already been configured manually with iam roles and permissions. This will later be made more portable/extensible with cloudformation.

Run tests

`env AWS_PROFILE=sprockow node_modules/.bin/mocha tests/`

To deploy

`env AWS_PROFILE={awsProfileName} serverless deploy`

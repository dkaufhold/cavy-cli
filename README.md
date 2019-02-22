# cavy-cli

[![npm version](https://badge.fury.io/js/cavy-cli.svg)](https://badge.fury.io/js/cavy-cli)

![Cavy logo](https://cloud.githubusercontent.com/assets/126989/22546798/6cf18938-e936-11e6-933f-da756b9ee7b8.png)

**cavy-cli** is a command line interface for
[Cavy](https://github.com/pixielabs/cavy), a cross-platform integration test
framework for React Native, by [Pixie Labs](https://pixielabs.io).

## About this fork

This fork is an almost complete rewrite of the cavy cli. It's meant to work around
some limitations of the cavy cli in regards to the project I am currently using
it in. Maybe some of the ideas outlined in this fork might find it back to the
original.
  
Also the rest of this readme might not match the new implementation.

Note: Installing from NPM means installing the original.

I'm on it :)

## Known incompatibilities

* Expo is required (which is ok if you have a fresh, recent React Native project)
* Requires [fork of main project](https://github.com/dkaufhold/cavy/)
* The cavy command currently does not work. It runs from a server connection as stated under Installation or Usage

## What does it do?

**cavy-cli** builds, simulates, and tests your React Native app from the
command line. When the tests finish the command outputs the results and quits
with the relevant exit code (0 for success, 1 for failure) which can be used by
continuous integration scripts to determine if the test suite passed or not.

**cavy-cli is in an early stage of development**. But we are using it to test
Cavy itself! Check out [our sample app Circle CI
configuration](https://github.com/pixielabs/cavy/blob/master/.circleci/config.yml) 
for inspiration.

## Installation

install locally 

```shell
$ npm i cavy-cli
```

or with `yarn`

```shell
$ yarn add cavy-cli
```

Add this script to your `package.json`

```json5
{
    // ...
    "scripts": {
        "cavy": "node ./node_modules/cavy-cli/src/server.js",
    }
    // ...
}
```

Run test server"

```shell
$ npm run cavy
```

or

```shell
$ yarn run cavy
```


## Basic usage

WIP

## Contributing

Before contributing, please read the [code of conduct](CODE_OF_CONDUCT.md).

You can test your local version of cavy-cli by running `npm link` within the
`cavy-cli` folder. This will make it so `cavy` is pointing to the `cavy.js`
script in your local copy of `cavy-cli`. See
[the documentation for npm link](https://docs.npmjs.com/cli/link) for more
information.

- Check out the latest master to make sure the feature hasn't been implemented
  or the bug hasn't been fixed yet.
- Check out the issue tracker to make sure someone already hasn't requested it
  and/or contributed it.
- Fork the project.
- Start a feature/bugfix branch.
- Commit and push until you are happy with your contribution.
- Please try not to mess with the package.json, version, or history. If you
  want to have your own version, or is otherwise necessary, that is fine, but
  please isolate to its own commit so we can cherry-pick around it.

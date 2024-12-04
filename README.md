# Welcome to the OPENFGA Plugins Repository for Backstage!

This repository contains a collection of plugins for [Backstage](https://backstage.io) that integrate with [OPENFGA](https://openfga.dev/docs/fga).

- Instead of using TypeScript to code policies into your Backstage instance, use OPENFGA to create, update, and manage your policies!

- To manage your policies in a more flexible manner, use OPENFGA [MODEL](https://openfga.dev/docs/modeling/getting-started).

- To create your model, use the OPENGA [PLAYGROUND] (https://play.fga.dev/sandbox/?store=github).

- No need to relaunch your Backstage instance to update policies , simply update your OPENFGA plugin policies from the UI and you're ready to go!

- Allow teams to set their own policies without having to know TypeScript or the Backstage codebase!

## Pre-requisites

- Make sure you have forked this repo and your backstage instance running.
- You have deployed OPENFGA, kindly see how to do that [here](https://github.com/openfga/openfga).
- This plugin also requires and assumes that you have at least setup the permission framework (without any policies) as outlined here [Backstage Permissions Docs](https://backstage.io/docs/permissions/overview) as it of course relies on the permissions framework to be there and set up.

## How It Works

This plugin wraps around the Backstage Permission Framework and uses the OPENFGA client to evaluate policies. It will send a request to OPENFGA with the permission and identity information, OPENFGA will then evaluate the policy and return a decision, which is then passed back to the Permission Framework.

- Permissions are created in the plugin in which they need to be enforced.
- The plugin will send a request to the Permission Framework backend with the permission and identity information.
- The Permission Framework backend will then forward the request to OPENFGA with the permission and identity information.
- OPENFGA will evaluate the the information against the policy and return a decision.

FOR MORE INFORMATION AND SETUP PLEASE VISIT PLUGIN DOCS [OPENFGA PLUGIN] (https://github.com/Infosys/openfga-plugin-backstage/blob/master/plugins/openfga/README.md)

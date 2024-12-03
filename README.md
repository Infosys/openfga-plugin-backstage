# openfga-plugin-backstage
This plugin wraps around the Backstage Permission Framework and uses the OPENFGA client to evaluate policies. It will send a request to OPENFGA with the permission and identity information, OPENFGA will then evaluate the policy and return a decision, which is then passed back to the Permission Framework.

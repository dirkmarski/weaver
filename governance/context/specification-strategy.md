This document outlines how to handle specifications and the verification thereof.

This environment will use the ATDD approach and multi-layer specification definition. Use Gherkin for the implementation. The layers are:
 - Executable specifications. This is a top level description of the behaviour, using abstract concepts that are not technology specific, however detailed to a level where it is clear how the solution needs to behave. This lives in the specs/ folder and is exclusively managed by the product manager to define what they need the product to do. Gherkin provided syntax will be used here to describe what is needed. This layer represents the feature files.
 - DSL: domain specific language. This is test code that reads like the domain and sits behind the executable specifications. It belongs to the development team. This layer is the step implementation level in Gherkin. This and any other code relating to the ATDD method sit under spec-implementation/ folder.
 - Protocol drivers: this drives the application or system under test, but does not contain any assertion logic. This is the only code that touches the system under test.
 - System under test: the item being tested.

Strict rules: 
 - the specifications are executed - they are not translated.
 - a step with no implementation behind it is a failure.
 - the system uses a red first, then green approach: i.e. any new spec item needs to be defined and failing before development begins.


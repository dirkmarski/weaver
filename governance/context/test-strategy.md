This document outlines the test strategy for the weaver project.

Testing is treated similar to core development. It is carefully planned, pros / cons weighed and maintained over time. It serves a specific purpose and testing is done in a reasonable approach (so for instance, when you want to test something: you include golden path, edge cases, error conditions etc. You don't bruteforce across all values).
Different levels of testing are maintained at different stages:
 - unit testing during development
 - testing by the test team
 - User acceptance testing by the product team and it should be exactly that: sufficient testing to accept the feature.
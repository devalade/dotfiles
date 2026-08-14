# Code Smell 229 - Red Tape

**TL;DR:** Avoid Accidental complexity and bureaucracy

## Problems

- Accidental Complexity

- Readability

- Bijection Fault

## Solutions

- Asign the responsibilities to real-world objects using the MAPPER

## Sample Code

##### Wrong

```
class VotingSystem:
    def __init__(self, config):
        self.config = config

    def validate_voter(self, voter_id):
        if self.config['voter_verification_enabled']:
            # Code to verify the voter's identity goes here

    def cast_vote(self, voter_id, candidate):
        if self.config['voting_enabled']:
            # Code to record the vote goes here

    def generate_vote_report(self):
        if self.config['generate_report']:
            # Code to generate a voting report goes here

    def audit_voting_system(self):
        if self.config['audit_enabled']:
            # Code to perform an audit of the voting system goes here

    # ... other voting-related methods ...

# Usage
config = {
    'voter_verification_enabled': True,
    'voting_enabled': False,
    'generate_report': False,
    'audit_enabled': True
}

voting_system = VotingSystem(config)

# Voter validation, voting, report generation, and auditing are handled based on the configuration.

```

##### Right

```
class VoterVerification:
    def verify_voter(self, voter_id):
        # Code to verify the voter's identity goes here

class VotingMachine:
    def cast_vote(self, voter_id, candidate):
        # Code to record the vote goes here

class VoteReporter:
    def generate_report(self):
        # Code to generate a voting report goes here

class VotingAuditor:
    def audit_voting_system(self):
        # Code to perform an audit of the voting system goes here

# Usage
voter_verification = VoterVerification()
voting_machine = VotingMachine()
vote_reporter = VoteReporter()
voting_auditor = VotingAuditor()

# Voter verification, vote casting, report generation, and auditing are handled separately.

```

## Detection

[X] Semi-Automatic

Some tools can guess you are bloating your objects with unnecessary responsibilities.

## Tags

- Bloaters

## Conclusion

The red tape code smell is evident as developers need to navigate the complex configuration to determine which features are active.

This not only adds unnecessary complexity but also increases the likelihood of misconfigurations that could impact the integrity of your system.

## Relations

[https://maximilianocontieri.com/code-smell-54-anchor-boats](https://maximilianocontieri.com/code-smell-54-anchor-boats)
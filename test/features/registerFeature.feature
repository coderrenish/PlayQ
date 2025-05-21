Feature: Register User - New 3

# @test_1
# Scenario: Register new User
# Given I navigate to the register page
# When I created a new user
# Then I conform user registeration is success
# @TD:FILE=login.csv @TD:FILTER=_ENV=="DEV"


@test_2
Scenario: Login user from test data
  * I login using "${var.username}" and "<password>"
  * Web: I test web
  * D365CRM: I I test "sdfsdff" and "sdfsdfsf"
  # * I login using step 2 "<username>" and "<password>"
  # * I login using step 2 ".*" and ""

  * Step Group: "@login.steps" "Fill Personal Contact Details"

 


Examples:{ "dataFile": "test-data/login.csv",  "filter": "_ENV==\"DEV\" && _STATUS==\"true\" && age <= 4"}

# Examples:
#   | _ENV | _STATUS | username | password | age |
#   | DEV | true | testuser2 | testpassword2 | 4 |


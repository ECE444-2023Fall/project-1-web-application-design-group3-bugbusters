from contextlib import nullcontext as does_not_raise
import pytest
from flask_server.classes.user_profile import UserProfile, USER_PROFILE_FIELDS

test_profile_json = {'displayName': 'Ben Goel', 'email': 'benjamin.goel@mail.utoronto.ca', 'uid': 'CwEtKo8TIoch7ThjSra5PRklFr63',
                     'photoURL': 'http://testtesttest.jpg', 'isAdmin': False}

@pytest.mark.parametrize('input_json, expectation',
                         [(test_profile_json, does_not_raise()),
                          ({k: v for k, v in test_profile_json.items() if k != 'photoURL'}, does_not_raise()),
                          ({k: v for k, v in test_profile_json.items() if k != 'isAdmin'}, does_not_raise()),
                          ({k: v for k, v in test_profile_json.items() if k != 'uid'}, pytest.raises(TypeError)),
                          ({k: v for k, v in test_profile_json.items() if k != 'email'}, pytest.raises(TypeError)),
                          ({k: v for k, v in test_profile_json.items() if k != 'displayName'}, pytest.raises(TypeError)),
                          ])
def test_from_json(input_json, expectation):
    with expectation:
        user_profile = UserProfile.from_json(input_json)

        # validate correct values were set by from_json
        # by asserting their equality to the corresponding
        # factory result
        for field_name in USER_PROFILE_FIELDS:
            if not hasattr(input_json, field_name):
                continue
            field_value = getattr(user_profile, field_name)
            json_factory_func = USER_PROFILE_FIELDS.json_factory_funcs(field_name)
            test_factory_result = json_factory_func(input_json[field_name])
            assert field_value == test_factory_result

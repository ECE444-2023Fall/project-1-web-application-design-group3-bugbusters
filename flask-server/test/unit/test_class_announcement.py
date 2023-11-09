from contextlib import nullcontext as does_not_raise
from dateutil.parser._parser import ParserError
import pytest
from flask_server.classes.announcement import Announcement, ANNOUNCEMENT_FIELDS


test_announcement_json = {'description': 'This is a test announcement!', 'id': 'UNgBPV6Xp5sZqqNcWHZ7',
                          'timestamp': '20220509T000000Z'}

@pytest.mark.parametrize('input_json, expectation',
                         [(test_announcement_json, does_not_raise()),
                          # do not supply required key
                          ({k: v for k, v in test_announcement_json.items() if k != 'description'}, pytest.raises(TypeError)),
                          # do not supply required key
                          ({k: v for k, v in test_announcement_json.items() if k != 'id'}, pytest.raises(TypeError)),
                          # do not supply optional key
                          ({k: v for k, v in test_announcement_json.items() if k != 'timestamp'}, does_not_raise()),
                          # timestamp is missing Z
                          ({k: v if k != 'timestamp' else v[:-1] for k, v in test_announcement_json.items()}, does_not_raise()),
                          # timestamp is missing Z and digit
                          ({k: v if k != 'timestamp' else v[:-2] for k, v in test_announcement_json.items()}, pytest.raises(ParserError)),
                          # timestamp is in improper format
                          ({k: v if k != 'timestamp' else '123123123123' for k, v in test_announcement_json.items()}, pytest.raises(ParserError)),
                          ])
def test_from_json(input_json, expectation):
    with expectation:
        user_profile = Announcement.from_json(input_json)

        # validate correct values were set by from_json
        # by asserting their equality to the corresponding
        # factory result
        for field_name in ANNOUNCEMENT_FIELDS:
            if not hasattr(input_json, field_name):
                continue
            field_value = getattr(user_profile, field_name)
            json_factory_func = ANNOUNCEMENT_FIELDS.factory_funcs(field_name)
            test_factory_result = json_factory_func(input_json[field_name])
            assert field_value == test_factory_result


@pytest.mark.parametrize('input_announcement, expectation',
                         [(Announcement(**test_announcement_json), does_not_raise()),
                          (Announcement(**{k: v for k, v in test_announcement_json.items() if k != 'timestamp'}), does_not_raise()),
                          ])
def test_to_json(input_announcement, expectation):
    with expectation:
        announcement_data = input_announcement.to_json()

        # validate correct values were set by from_json
        # by asserting their equality to the corresponding
        # factory result
        for field_name in ANNOUNCEMENT_FIELDS:
            if not hasattr(announcement_data, field_name):
                continue
            field_value = announcement_data[field_name]
            json_factory_func = ANNOUNCEMENT_FIELDS.json_factory_funcs(field_name)
            test_factory_result = json_factory_func(getattr(announcement_data, field_name))
            assert field_value == test_factory_result

import datetime
from dateutil.parser import parse as DateParser
from flask_server.classes.common import ClassField, DataField


def _verify_timestamp(timestamp):
    if isinstance(timestamp, datetime.datetime):
        return timestamp
    elif DateParser(timestamp):
        return timestamp


ANNOUNCEMENT_FIELDS = DataField([
    ClassField("description"),
    ClassField("timestamp", factory_func=_verify_timestamp),
])


class Announcement:
    """Announcement class"""
    def __init__(self, description, timestamp=None):
        self.description = description
        self.timestamp = timestamp

    @classmethod
    def from_json(cls, json):
        # check that all required fields exist and no extra kwargs exist
        announcement_instance = cls(**json)

        for key, value in json.items():
            factory_func = ANNOUNCEMENT_FIELDS.factory_funcs(key)
            value = factory_func(value)
            setattr(announcement_instance, key, value)

        return announcement_instance

    def to_json(self):
        announcement_json = {}

        for field_name in ANNOUNCEMENT_FIELDS:
            announcement_value = eval(f"self.{field_name}")
            if announcement_value is not None:
                json_factory_func = ANNOUNCEMENT_FIELDS.json_factory_funcs(field_name)
                announcement_json[field_name] = json_factory_func(announcement_value)

        return announcement_json

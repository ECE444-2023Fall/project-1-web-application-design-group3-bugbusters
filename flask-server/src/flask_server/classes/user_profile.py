from flask_server.classes.common import ClassField, DataField


USER_PROFILE_FIELDS = DataField([
    ClassField("display_name"),
    ClassField("email"),
    ClassField("is_admin"),
    ClassField("photo_url"),
    ClassField("uid"),
])


class UserProfile:
    """User Profile class"""

    def __init__(self, display_name, email, uid, is_admin=False, photo_url=""):
        self.display_name: str = display_name
        self.email: str = email
        self.uid: str = uid
        self.is_admin: bool = is_admin
        self.photo_url: str = photo_url

    @classmethod
    def from_json(cls, json):
        # check that all required fields exist and no extra kwargs exist
        profile_instance = cls(**json)

        for key, value in json.items():
            factory_func = USER_PROFILE_FIELDS.factory_funcs(key)
            value = factory_func(value)
            setattr(profile_instance, key, value)

        return profile_instance

    def to_json(self):
        user_profile_json = {}

        for field_name in USER_PROFILE_FIELDS:
            event_value = eval(f"self.{field_name}")
            if event_value is not None:
                json_factory_func = USER_PROFILE_FIELDS.json_factory_funcs(field_name)
                user_profile_json[field_name] = json_factory_func(event_value)

        return user_profile_json

from flask_server.classes.common import ClassField, DataField


USER_PROFILE_FIELDS = DataField([
    ClassField("displayName"),
    ClassField("email"),
    ClassField("isAdmin"),
    ClassField("photoURL"),
    ClassField("uid"),
])


class UserProfile:
    """User Profile class"""

    def __init__(self, displayName, email, uid, isAdmin=False, photoURL=""):
        self.displayName: str = displayName
        self.email: str = email
        self.uid: str = uid
        self.isAdmin: bool = isAdmin
        self.photoURL: str = photoURL

    @classmethod
    def from_json(cls, json):
        # check that all required fields exist and no extra kwargs exist
        profile_instance = cls(**json)

        for key, value in json.items():
            factory_func = USER_PROFILE_FIELDS.factory_funcs(key)
            value = factory_func(value)
            setattr(profile_instance, key, value)

        return profile_instance

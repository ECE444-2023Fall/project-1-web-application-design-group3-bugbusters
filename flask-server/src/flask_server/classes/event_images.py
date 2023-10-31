from flask_server.classes.common import ClassField, DataField

EVENT_IMAGE_FIELDS = DataField([
    ClassField("_header_image"),
    ClassField("_profile_image"),
    ClassField("_image_gallery"),
])

class EventImages:
    """Event Images class"""
    def __init__(self):
        self._header_image = ""
        self._profile_image = ""
        self._image_gallery = []
        return

    @classmethod
    def from_json(cls, json):
        event_images_instance = cls()
        if json is None:
            return event_images_instance

        for key, value in json.items():
            factory_func = EVENT_IMAGE_FIELDS.factory_funcs(key)
            value = factory_func(value)
            setattr(event_images_instance, key, value)

        return event_images_instance

    def to_json(self):
        event_json = {}

        for event_field_name in EVENT_IMAGE_FIELDS:
            event_value = eval(f"self.{event_field_name}")
            if event_value is not None:
                json_factory_func = EVENT_IMAGE_FIELDS.json_factory_funcs(event_field_name)
                event_json[event_field_name] = json_factory_func(event_value)

        return event_json

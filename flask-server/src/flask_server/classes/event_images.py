from flask_server.classes.common import ClassField, DataField

EVENT_IMAGE_FIELDS = DataField([
    ClassField("_header_image"),
    ClassField("_profile_image"),
    ClassField("_image_gallery"),
])

class EventImages:

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
            factory_func = getattr(EVENT_IMAGE_FIELDS, key)
            value = factory_func(value)
            setattr(event_images_instance, key, value)
        
        return event_images_instance
    
    @classmethod
    def to_json(self, cls):
        if cls is None:
            return None
        event_images_json = {}

        if cls._header_image is not None: event_images_json['_header_image'] = cls._header_image
        if cls._profile_image is not None: event_images_json['_profile_image'] = cls._profile_image
        if not cls._image_gallery == []: event_images_json['_image_gallery'] = cls._image_gallery
        return event_images_json



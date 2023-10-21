EVENT_IMAGE_FIELDS = ["_header_image", "profile_image", "_image_gallery"]
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
            if key in EVENT_IMAGE_FIELDS:
                setattr(event_images_instance, key, value)
        
        return event_images_instance
    
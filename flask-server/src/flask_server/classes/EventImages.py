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
        
        if '_header_image' in json: event_images_instance._header_image = json['_header_image']
        if '_profile_image' in json: event_images_instance._profile_image = json['_profile_image']
        if '_image_gallery' in json :event_images_instance._image_gallery = json['_image_gallery']
        return event_images_instance
    
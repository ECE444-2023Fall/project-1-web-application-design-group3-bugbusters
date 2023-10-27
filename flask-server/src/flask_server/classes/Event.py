from flask_server.classes.event_images import EventImages
from flask_server.classes.common import ClassField, DataField
import json

EVENT_FIELDS = DataField([
    ClassField("_event_id"),
    ClassField("_creator_id"),
    ClassField("_event_title"),
    ClassField("_description"),
    ClassField("_location"),
    ClassField("_event_start_time"),
    ClassField("_event_end_time"),
    ClassField("_images", lambda arg: EventImages.from_json(arg)),
])
# Out of scope fields '_tags', '_flagged', '_rsvp_email_list'

# def object_to_dict(cls):
#     if hasattr(cls, '__dict__'):
#         return cls.__dict__
#     elif isinstance(cls, list):
#         return [object_to_dict(item) for item in cls]
#     else:
#         return cls

class Event:
    """Event class"""
    def __init__(self, event_id, creator_id):
        self._event_id = event_id
        self._event_title = ""
        self._description = ""
        self._location = ""
        self._event_start_time = ""
        self._event_end_time = ""
        self._images = EventImages()

        self._creator_id = creator_id

        # out of scope for the time being
        # self._tags = []
        # self._flagged = False
        # self._rsvp_email_list = []

        return

    @classmethod
    def from_json(cls, json):
        if json is None:
            return None
        if '_event_id' not in json or '_creator_id' not in json: 
            return None
        
        event_id = json['_event_id']
        creator_id = json['_creator_id']
        event_instance = cls(event_id, creator_id)

        for key, value in json.items():
            factory_func = getattr(EVENT_FIELDS, key)
            value = factory_func(value)
            setattr(event_instance, key, value)

        return event_instance


    @classmethod
    def to_json(self):
        # cls = self
        if cls is None:
            return None
        
        event_json = {}

        print("HERE")
        print(cls._event_id)

        event_json['_event_id'] = cls._event_id
        event_json['_creator_id'] = cls._creator_id
        event_json['_event_title'] = cls._event_title
        event_json['_description'] = cls._description
        event_json['_location'] = cls._location
        event_json['_event_start_time'] = cls._event_start_time
        event_json['_event_end_time'] = cls._event_start_time
        event_json['_images'] = cls._images.to_json()

        print(event_json)
        print("HERE")


        # print(dir(cls))
        # print(cls.__dict__)
        # print(" ")
        # print(cls.__getattribute__)
        # test_funct = getattr(EVENT_FIELDS , '_event_id')
        # print(test_funct("DttWcIu4XOe5vdskk79v"))
        # # print(tesfunct)
        # print(getattr(EVENT_FIELDS , '_event_id'))
        # print(getattr(EVENT_FIELDS , '_event_id'))
        # print(dir(cls))
        # print("  ")
        # print(cls.__dict__)

        # for key in EVENT_FIELDS:
        #     factory_func = getattr(EVENT_FIELDS, key)
        #     print(factory_func)
        #     value = factory_func(value)
        #     print(factory_func)
        #     setattr(cls, key, value)
            
        # event_json = object_to_dict(cls)

        # for key, factory_func in EVENT_FIELDS.fields.items():
        #     value = getattr(cls, key)
        #     if value is not None:
        #         event_json[key] = factory_func(value)
        
        # for field in cls.fields:
        # print(dir(EVENT_FIELDS))
        # print(EVENT_FIELDS.__dict__)
        # event_dict = EVENT_FIELDS.__dict__
        # for key in event_dict:
        #     print(key)
        #     print("AAs")
        #     classfield = event_dict[key].fields
        #     # print(event_dict[key])
        #     print(classfield)
        #     key = field.name
        #     value = getattr(self, key)
        #     if value is not None:
        #         event_json[key] = value#field.serialize(value)

        # print(event_json)
        # print(event_json)

        # for att in cls.__getattribute__:
            # print(att)

        
        # if '_event_id' not in json or '_creator_id' not in json: 
        # factory_func = getattr(EVENT_FIELDS, _event_id)
        # print(factory_func)
        # value = factory_func(value)

        # if cls._event_id is None or cls.creator_id is None:
        #     return None
        # print(cls)
        # for member, value in cls:
        #     if str(member) in EVENT_FIELDS:
        #         event_json[str(member)] = value

        # event_id = json['_event_id']
        # creator_id = json['_creator_id']
        # event_instance = cls(event_id, creator_id)

        # for key, value in json.items():
        #     factory_func = getattr(EVENT_FIELDS, key)
        #     value = factory_func(value)
        #     setattr(event_instance, key, value)

        return json.dumps(event_json)
    
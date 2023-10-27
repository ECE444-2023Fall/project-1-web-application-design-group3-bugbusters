from flask_server.classes.event import Event
from flask_server.services.event_service import getEvent, getAllEvents
from flask_server.global_config import db_client
import pytest
import werkzeug
import json

class TestEventService(): 
    def test_valid_Event(self):
        valid_event_id = "DttWcIu4XOe5vdskk79v"
        event_json = getEvent(valid_event_id)

        event = Event.from_json(event_json)

        # Test failed: could not fetch valid event
        assert(event._event_id == valid_event_id)
        return
    
    def test_invalid_Event(self):
        with pytest.raises(werkzeug.exceptions.NotFound):
            invalid_event_id = "Invalid_event_id"
            event_json = getEvent(invalid_event_id)
            event = Event.from_json(event_json)
            # Test failed: invalid event retured a value
            assert(event == None)
        return
    
    def test_get_all_events(self):
        event_size = len(list(db_client._events_collection.stream()))
        event_json = getAllEvents()
        events = []
        for json in event_json:
            event = Event.from_json(json) 
            if event:
                events.append(event)
            else:
                event_size -= 1

        # Test failed: getAllEvents query returned no events
        assert(events != None and event_size != 0)

        # Test failed: getAllEvents query did not return all events
        assert(event_size == len(events))

        return
    
    def test_to_json(self):

        originial_event_json = {"_event_title": "SKULE Band Meeting", "_event_id": "DttWcIu4XOe5vdskk79v", "_creator_id": "rgLV0SQuAa0QPAXH9wl7"}
        event_obj = Event(originial_event_json['_event_id'], originial_event_json['_creator_id'])
        event_obj._event_title = originial_event_json['_event_title']

        new_event_json = Event.to_json(event_obj)
        # print("A")
        # print(originial_event_json['_description'])
        # print("A")

        # print(new_event_json['_description'])
        # print("A")


        for key, value in new_event_json.items():
            # Test failed: incorrect information in transformation
            if value is None:
                assert(originial_event_json[key] is None)
                continue
            assert(value == originial_event_json[key])

        return
    
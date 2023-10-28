from flask_server.classes.event import Event, EVENT_FIELDS
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

        # Setup 
        originial_event_json = {'_event_title': 'SKULE Band Meeting', '_event_id': 'DttWcIu4XOe5vdskk79v', '_images': {'_profile_image': 'https://firebasestorage.googleapis.com/v0/b/ece444bulletin.appspot.com/o/images%2FSKULE.jpg?alt=media&token=6f6161fc-e3d5-46ad-a20c-855047ff66d0&_gl=1*1mu6xm5*_ga*MjAyMDkzOTUwNS4xNjk1OTE1NzI4*_ga_CW55HF8NVT*MTY5NzcyODMyMC4xMi4xLjE2OTc3MjgzMzguNDIuMC4w', '_image_gallery': ['https://firebasestorage.googleapis.com/v0/b/ece444bulletin.appspot.com/o/images%2FBNAD.jfif?alt=media&token=974ff480-9132-4ae7-9ead-6803eb9b9e9e&_gl=1*om634*_ga*MjAyMDkzOTUwNS4xNjk1OTE1NzI4*_ga_CW55HF8NVT*MTY5NzY1MTUzMC4xMC4xLjE2OTc2NTUxOTEuNTUuMC4w', 'https://firebasestorage.googleapis.com/v0/b/ece444bulletin.appspot.com/o/images%2Ffront_campus.jpeg?alt=media&token=d176f235-ee09-4e11-978b-624247b4d425&_gl=1*1uvnzpb*_ga*MjAyMDkzOTUwNS4xNjk1OTE1NzI4*_ga_CW55HF8NVT*MTY5NzY1MTUzMC4xMC4xLjE2OTc2NTUxODYuNjAuMC4w'], '_header_image': 'https://firebasestorage.googleapis.com/v0/b/ece444bulletin.appspot.com/o/images%2FSKULE.jpg?alt=media&token=6f6161fc-e3d5-46ad-a20c-855047ff66d0&_gl=1*ak4s2r*_ga*MjAyMDkzOTUwNS4xNjk1OTE1NzI4*_ga_CW55HF8NVT*MTY5NzY1MTUzMC4xMC4xLjE2OTc2NTUxOTUuNTEuMC4w'}, '_location': 'Stanford Flemming', '_creator_id': 'rgLV0SQuAa0QPAXH9wl7', '_event_start_time': '2023-10-17 12:23:33.361628', '_description': 'Testing event functionality with multiple events', '_event_end_time': '2023-10-17 12:23:33.361628'}
        event_obj = Event(originial_event_json['_event_id'], originial_event_json['_creator_id'])
        event_obj._event_title = originial_event_json['_event_title']

        for key, value in originial_event_json.items():
            factory_func = getattr(EVENT_FIELDS, key)
            value = factory_func(value)
            setattr(event_obj, key, value)

        # Testing
        new_event_json = event_obj.to_json(event_obj)

        # Validation
        for key, value in new_event_json.items():
            # Test failed: incorrect information in transformation
            if value == [] or value == "":
                assert(originial_event_json[key] is "" or originial_event_json[key] == [])
                continue
            assert(value == originial_event_json[key])

        return
    
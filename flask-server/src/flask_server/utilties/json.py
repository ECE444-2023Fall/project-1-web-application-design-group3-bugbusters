from flask.json.provider import JSONProvider
import json
import datetime


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        return super(CustomJSONEncoder, self).default(obj)


class CustomJSONProvider(JSONProvider):
    
    def dumps(self, obj, **kwargs):
        return json.dumps(obj, **kwargs, cls=CustomJSONEncoder)
    
    def loads(self, s, **kwargs):
        return json.loads(s, **kwargs)

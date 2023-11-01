from dataclasses import dataclass, field
from typing import Callable


@dataclass
class ClassField:
    field_name: str
    factory_func: Callable = field(default=lambda arg: arg)
    json_factory_func: Callable = field(default=lambda arg: arg)

    def __post_init__(self):
        for (name, field_type) in self.__annotations__.items():
            if not isinstance(self.__dict__[name], field_type):
                current_type = type(self.__dict__[name])
                raise TypeError(f"The field `{name}` was assigned by `{current_type}` instead of `{field_type}`")

class DataField():
    def __init__(self, class_fields: list[ClassField]):
        self._fields = []
        self._factory_funcs = dict()
        self._json_factory_funcs = dict()
        if not all(isinstance(class_field, ClassField) for class_field in class_fields):
            raise TypeError('class_fields must be a list of ClassField')
        for class_field in class_fields:
            self._factory_funcs[class_field.field_name] = class_field.factory_func
            self._json_factory_funcs[class_field.field_name] = class_field.json_factory_func
            self._fields.append(class_field.field_name)

    def factory_funcs(self, field_name):
        return self._factory_funcs[field_name]

    def json_factory_funcs(self, field_name):
        return self._json_factory_funcs[field_name]

    def __iter__(self):
        i = 0
        while i < len(self._fields):
            yield self._fields[i]
            i += 1

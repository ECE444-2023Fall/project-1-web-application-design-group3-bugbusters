from dataclasses import dataclass, field
from typing import Callable


@dataclass
class ClassField:
    field_name: str
    factory_func: Callable = field(default=lambda arg: arg)

class DataField():
    def __init__(self, class_fields: list[ClassField]):
        if not all(isinstance(class_field, ClassField) for class_field in class_fields):
            raise TypeError('class_fields must be a list of ClassField')
        for class_field in class_fields:
            setattr(self, class_field.field_name, class_field.factory_func)

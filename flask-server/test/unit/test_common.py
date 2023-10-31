from flask_server.classes.common import ClassField, DataField
import random
import pytest


@pytest.fixture
def time_series_data():
    random.seed(2023)
    num_points = 100
    data = {"x": list(range(100)),
            "y": list(random.random() for _ in range(num_points))}
    return data


# Lab 5 - Ben Goel Unit Test
def test_valid_class_field_construction_default_factories(time_series_data):
    # tests valid construction of a ClassField with no factory function overrides for time series data
    example_time_series_data = ClassField(field_name='time_series_data')
    assert example_time_series_data.factory_func(time_series_data) == time_series_data
    assert example_time_series_data.json_factory_func(time_series_data) == time_series_data


# Lab 5 - Ben Goel Unit Test
def test_valid_class_field_construction_overriden_factories(time_series_data):
    # tests valid construction of a ClassField with factory function overrides for time series data

    # define factory function for deserealizing JSON data into python data
    def factory_func(data):
        return tuple(data)

    # define json factory function for serializing python variable into JSON format
    def json_factory_func(data):
        return isinstance(data, tuple)

    example_time_series_data = ClassField(field_name='time_series_data', factory_func=factory_func, json_factory_func=json_factory_func)
    assert isinstance(time_series_data, dict)
    factory_func_result = example_time_series_data.factory_func(time_series_data)
    assert isinstance(factory_func_result, tuple)
    json_factory_func_result = example_time_series_data.json_factory_func(factory_func_result)
    assert isinstance(json_factory_func_result, bool)
    assert json_factory_func_result == True


# Lab 5 - Ben Goel Unit Test
def test_invalid_class_field_construction():
    # tests invalid construction of a ClassField with invalid factory & json factory functions

    # define invalid factory function for deserealizing JSON data into python data
    invalid_factory_func = "This will fail because factory functions must be functions"

    # define invalid json factory function for serealizing python data into JSON format
    invalid_json_factory_func = [1, 2, 3]

    with pytest.raises(TypeError):
        _ = ClassField(field_name='time_series_data', factory_func=invalid_factory_func)

    with pytest.raises(TypeError):
        _ = ClassField(field_name='time_series_data', json_factory_func=invalid_json_factory_func)


# Lab 5 - Ben Goel Unit Test
def test_valid_data_field_construction_default(time_series_data):
    # tests valid construction of a DataField instance with multiple valid ClassField
    # also tests the iteration over the ClassFields and checks the callability of their factory funcs
    example_time_series_data_input = ClassField(field_name='x')
    example_time_series_data_output = ClassField(field_name='y')
    example_time_series = DataField([example_time_series_data_input, example_time_series_data_output])

    for field in example_time_series:
        factory_func = example_time_series.factory_funcs(field)
        json_factory_func = example_time_series.json_factory_funcs(field)
        assert callable(factory_func)
        assert callable(json_factory_func)
        assert factory_func(time_series_data) == time_series_data
        assert json_factory_func(time_series_data) == time_series_data


# Lab 5 - Ben Goel Unit Test
def test_invalid_data_field_construction_default():
    # tests valid construction of a DataField instance with multiple valid ClassField
    # also tests the iteration over the ClassFields and checks the callability of their factory funcs
    example_time_series_data_input = ClassField(field_name='x')
    example_time_series_data_output = dict(field_name="y", factory_func=lambda arg: arg, json_factory_func=lambda arg: arg)

    # DataField must be created from list of ClassField
    with pytest.raises(TypeError):
        example_time_series = DataField([example_time_series_data_input, example_time_series_data_output])

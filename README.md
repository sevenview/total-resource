# Total Resource

An ORM to connect to an API. This ORM is very specific with our way of building APIs
using (primarily) Ruby on Rails and is not designed to be API-agnostic.

## Overview

TotalResource provides a base class that you can extend in order to provide
methods to access JSON API data.

It expects your API result to look something like:

``` JSON
{
  "widgets": {
    "id": "12345",
    "name": "My Widget",
    "description": "A very high quality widget.",
    "code": "W123",
    "active: True
  }
}
```

## Methods

* `.find`
* `.all`
* `.allWithPagination`
* `.delete`
* `.create`
* `.update`
* `.hasMany`
* `.belongsTo`

When you run a method such as `.find(id)`, it will return a `YourModelName` object. When you
run `.all()` if will return an array of `YourModelName` objects.

## Extending Base

Create a JS class and extend TotalResource.Base. You will need to provide two static
methods and a constructor providing the attributes.

* `static get className () {}` - allows TotalResource to dynamically build the API
  URLs.
* `static get axios () {}` - an axios instance that has any required auth
  headers, etc. set.
* `constructor (params) {}` - used to build an intance of your model. Inside the constructor
   you must call the `this.attributes()` method and pass an array of field names that you
   want extracted from the API result.

### An example
``` js
import TotalResource from 'total-resource'
import axios from 'axios'

class Widget extends TotalResource.Base {
  static get className () {
    return 'Widget'
  }

  static get axios () {
    return axios
  }

  constructor (params) {
    super(params)

    this.attributes([
      'id',
      'name',
      'description',
      'code',
      'active'
    ])
  }
}

export default Widget
```

## Publish a new Package

`npm publish`
import inflection from 'inflection'
import TotalResourceError from './TotalResourceError'

class Base {
  #params
  
  constructor (params) {
    this.#params = params
  }

  attributes (attributes) {
    attributes.forEach(attribute => {
      this[attribute] = this.#params[attribute]
    })
  }

  hasMany (resource, Model) {
    if (this.#params[resource]) {
      this[resource] = []
      this.#params[resource].forEach(item => {
        this[resource].push(new Model(item))
      })
    }
  }

  belongsTo (resource, Model) {
    if (this.#params[resource]) {
      this[resource] = new Model(this.#params[resource])
    }
  }

  static async find(id) {
    let resource = null
    try {
      let response = await this.axios.get(`/${this.resourceNamePlural}/${id}`)
      resource = new this(response.data[this.classNameCamelized])
    } catch (error) {
      throw new TotalResourceError(error.message, 'total_resource_error')      
    }
    return resource
  }

  static async all (queryParams) {
    let resources = []
    try {
      let response = await this.axios.get(
        `/${this.resourceNamePlural}`,
        { params: queryParams }
      )
      response.data[this.classNameCamelizedPlural].forEach(item => {
        resources.push(new this(item))
      })
    } catch (error) {
      throw new TotalResourceError(error.message, 'total_resource_error')
    }
    return resources
  }

  static get resourceName () {
    return inflection.underscore(this.className)
  }

  static get resourceNamePlural () {
    return inflection.pluralize(this.resourceName)
  }

  static get classNameCamelized () {
    return inflection.camelize(this.className, true)
  }
  
  static get classNameCamelizedPlural () {
    let name = this.className
    name = inflection.camelize(name, true)
    name = inflection.pluralize(name)
    return name
  }
}

export default Base

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

  static async all (queryParams, options) {
    let resources
    try {
      let uri
      if (options.customUrl) {
        uri = options.customUrl
      } else {
        uri = this.resourceNamePlural
      }

      let response = await this.axios.get(
        `${uri}`,
        { params: queryParams }
      )
      /*
      if (options.customUrl) {
        return response.data
      } else { */
      let x = response.data[this.classNameCamelizedPlural]
      if (Array.isArray(x)) {
        resources = []
        x.forEach(item => {
          resources.push(new this(item))
        })
      } else {
        resources = x
      }
      /*} */
    } catch (error) {
      throw new TotalResourceError(error.message, 'total_resource_error')
    }
    return resources
  }

  static async requestPaginated (pagination, filter, options) {
    let orderSymbol
    if (pagination.descending) {
      orderSymbol = 'desc'
    } else {
      orderSymbol = 'asc'
    }

    let url
    if (options.customUrl) {
      url = options.customUrl
    } else {
      url = `${this.resourceNamePlural}`
    }
    return this.axios.get(url, {
      params: {
        page: pagination.page,
        page_size: pagination.rowsPerPage,
        sort_by: pagination.sortBy,
        sort_order: orderSymbol,
        filter: filter
      }
    })
  }

  static async delete (id) {
    try {
      await this.axios.delete(`${this.resourceNamePlural}/${id}`)
    } catch (error) {
      throw new TotalResourceError(error.message, 'total_resource_error')
    }
  }

  static async create (params) {
    try {
      await this.axios.post(`/${this.resourceNamePlural}`, params)
    } catch (error) {
      throw new TotalResourceError(error.message, 'total_resource_error')
    }
  }

  static async update (id, params) {
    try {
      await this.axios.put(`/${this.resourceNamePlural}/${id}`, params)
    } catch (error) {
      throw new TotalResourceError(error.message, 'total_resource_error')
    }
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
